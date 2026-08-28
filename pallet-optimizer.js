// =====================================================================
// Mode B — Item → Carton → Pallet Multi-Stage Linkage Optimizer
// ---------------------------------------------------------------------
// ISOLATED MODULE: window.PalletOptimizer
//   * Does NOT touch any Mode A (legacy mixed-carton) logic in app.js.
//   * All Mode B DOM ids are prefixed with "b" to avoid collisions.
//   * Reuses the global THREE / THREE.OrbitControls already loaded by
//     index.html (Three.js r128 from CDN).
// =====================================================================
(function () {
  'use strict';

  // ---------- International Pallet Specs (strict, mm) ----------
  const PALLETS = {
    US: { key: 'US', name: 'US GMA',     L: 1219, W: 1016, baseH: 150 },
    UK: { key: 'UK', name: 'UK Standard', L: 1200, W: 1000, baseH: 150 },
    EU: { key: 'EU', name: 'Euro EPAL',  L: 1200, W: 800,  baseH: 144 },
    AU: { key: 'AU', name: 'Australia',  L: 1165, W: 1165, baseH: 150 },
    JP: { key: 'JP', name: 'Japan T11',  L: 1100, W: 1100, baseH: 150 }
  };

  // ---------- Container interior specs (mm) + max payload (kg) ----------
  const CONTAINERS_B = {
    '40HQ': { key: '40HQ', name: "40' HQ", interior: { l: 12032, w: 2352, h: 2698 }, maxPayload: 26000 },
    '40GP': { key: '40GP', name: "40' GP", interior: { l: 12032, w: 2352, h: 2393 }, maxPayload: 26700 },
    '20GP': { key: '20GP', name: "20' GP", interior: { l: 5898,  w: 2352, h: 2393 }, maxPayload: 28200 }
  };

  const PALETTE = ['#5B9BD5','#6BBF8A','#D4A04A','#D07882','#8FAED4',
                   '#E8A84C','#55B8A0','#D48F6A','#A0C76E','#C4A060',
                   '#7E9BD5','#B5C76E'];

  // ---------- Module state ----------
  const state = {
    candidates: [],     // Top 10 computed container setups
    selected: null,     // currently selected candidate
    scenes: null,       // {carton:{...}, pallet:{...}}
    bActive: false,     // Mode B currently visible (drives render loop)
    rafId: null         // active requestAnimationFrame handle (null = no loop running)
  };

  // ---------- i18n bridge (reuse app.js global t/I18N/LANG) ----------
  const _t = (typeof t === 'function') ? t : (k) => k;

  // =====================================================================
  // STAGE 1 — Single Item -> Carton (inner & outer dims)
  // =====================================================================
  function genCartonCandidates(inp) {
    const { itemL, itemW, itemH, itemWeightG, targetQty, wall, maxLoadKg, allowSide, allowInvert } = inp;
    const Q = targetQty;

    // Allowed product orientation assignments (X,Y,Z) -> (dx,dy,dz)
    let perms;
    if (allowSide) {
      // Full rotation: all 6 permutations of the 3 dims
      const d = [itemL, itemW, itemH];
      perms = [
        [d[0], d[1], d[2]], [d[0], d[2], d[1]], [d[1], d[0], d[2]],
        [d[1], d[2], d[0]], [d[2], d[0], d[1]], [d[2], d[1], d[0]]
      ];
    } else {
      // Side-loading locked: product height (itemH) stays vertical (Z).
      // Footprint (X,Y) uses itemL × itemW in either order.
      // Inversion unticked only forbids 180° flip, which is moot when Z is fixed.
      perms = [[itemL, itemW, itemH], [itemW, itemL, itemH]];
    }
    // de-duplicate permutations
    const seen = new Set();
    const uniqPerms = [];
    perms.forEach(p => { const k = p.join(','); if (!seen.has(k)) { seen.add(k); uniqPerms.push(p); } });

    const boxNetKg = Q * itemWeightG / 1000;
    const boxTareKg = 0.5; // fixed 500g carton tare
    const boxGrossKg = boxNetKg + boxTareKg;

    // Ergonomic safety interlock: discard if gross mass exceeds limit
    if (boxGrossKg > maxLoadKg) {
      // still return empty so UI can show a warning
      return { candidates: [], boxGrossKg, overLimit: true };
    }

    const out = [];
    const outerSeen = new Set();
    for (let nx = 1; nx <= Q; nx++) {
      if (Q % nx !== 0) continue;
      const r1 = Q / nx;
      for (let ny = 1; ny <= r1; ny++) {
        if (r1 % ny !== 0) continue;
        const nz = r1 / ny;
        for (const p of uniqPerms) {
          const dx = p[0], dy = p[1], dz = p[2];
          const innerL = nx * dx, innerW = ny * dy, innerH = nz * dz;
          const outerL = innerL + 2 * wall;
          const outerW = innerW + 2 * wall;
          const outerH = innerH + 2 * wall;
          const vol = outerL * outerW * outerH;
          const key = [outerL, outerW, outerH].map(Math.round).join('x');
          if (outerSeen.has(key)) continue;
          outerSeen.add(key);
          out.push({
            nx, ny, nz,
            inner: { l: innerL, w: innerW, h: innerH },
            outer: { l: outerL, w: outerW, h: outerH },
            boxWeight: boxGrossKg,
            volume: vol
          });
        }
      }
    }
    // Prefer denser (smaller-volume) cartons, keep a workable set
    out.sort((a, b) => a.volume - b.volume);
    return { candidates: out.slice(0, 24), boxGrossKg, overLimit: false };
  }

  // =====================================================================
  // STAGE 2 — Carton -> Pallet unit load (堆叠模式枚举)
  // =====================================================================
  // 堆叠模式枚举：
  //   column   列阵 (0°/90° 规则阵列)
  //   interlock交错 (Interlocking) — 相邻行错位 L/2，提升稳定性与边角填充
  //   pinwheel 风车 (Pinwheel)     — 行内交替 L/W 朝向，适配 L≠W 箱体
  // overhang: 允许纸箱边缘溢出托盘(mm, 0~20)；等效可用托盘尺寸 +2*overhang
  function perLayerColumn(oL, oW, pL, pW, oh) {
    return Math.floor((pL + 2 * oh) / oL) * Math.floor((pW + 2 * oh) / oW);
  }
  function perLayerInterlock(oL, oW, pL, pW, oh) {
    const spanL = pL + 2 * oh, spanW = pW + 2 * oh;
    const rows = Math.floor(spanW / oW);
    let total = 0;
    for (let r = 0; r < rows; r++) {
      const shift = (r % 2) ? oL / 2 : 0; // 错位半箱
      let x = shift, n = 0;
      while (x + oL <= spanL + 0.001) { n++; x += oL; }
      total += n;
    }
    return total;
  }
  function perLayerPinwheel(oL, oW, pL, pW, oh) {
    const spanL = pL + 2 * oh, spanW = pW + 2 * oh;
    const rows = Math.floor(spanW / oW);
    let total = 0;
    for (let r = 0; r < rows; r++) {
      let x = 0, n = 0;
      while (x < spanL - 0.001) {
        const useL = (n % 2 === 0) ? oL : oW; // 行内交替朝向
        if (x + useL <= spanL + 0.001) { n++; x += useL; } else break;
      }
      total += n;
    }
    return total;
  }

  function patternPerLayer(foot, pL, pW, oh, kind) {
    const [oL, oW] = foot;
    if (kind === 'column')    return perLayerColumn(oL, oW, pL, pW, oh);
    if (kind === 'interlock') return perLayerInterlock(oL, oW, pL, pW, oh);
    if (kind === 'pinwheel')  return perLayerPinwheel(oL, oW, pL, pW, oh);
    // auto: 取三种最大
    return Math.max(
      perLayerColumn(oL, oW, pL, pW, oh),
      perLayerInterlock(oL, oW, pL, pW, oh),
      perLayerPinwheel(oL, oW, pL, pW, oh)
    );
  }
  function bestPatternKind(foot, pL, pW, oh) {
    const [oL, oW] = foot;
    const c = perLayerColumn(oL, oW, pL, pW, oh);
    const i = perLayerInterlock(oL, oW, pL, pW, oh);
    const p = perLayerPinwheel(oL, oW, pL, pW, oh);
    if (p >= c && p >= i) return 'pinwheel';
    if (i >= c) return 'interlock';
    return 'column';
  }

  function evalPallet(carton, pallet, containerInteriorH, opt) {
    opt = opt || {};
    const oh = (opt.overhang || 0);          // mm
    const maxStack = (opt.cartonMaxStack && opt.cartonMaxStack >= 1) ? opt.cartonMaxStack : Infinity;
    const kindSel = opt.pattern || 'auto';   // auto | column | interlock | pinwheel
    const L = carton.outer.l, W = carton.outer.w, H = carton.outer.h;

    // 两种基础朝向：0°(L沿托盘长) 与 90°(W沿托盘长)
    const feet = [[L, W], [W, L]];
    let best = null;
    for (const foot of feet) {
      const [oL, oW] = foot;
      const perLayerAll = (kindSel === 'auto')
        ? patternPerLayer(foot, pallet.L, pallet.W, oh, 'auto')
        : patternPerLayer(foot, pallet.L, pallet.W, oh, kindSel);
      const kind = (kindSel === 'auto')
        ? bestPatternKind(foot, pallet.L, pallet.W, oh)
        : kindSel;
      if (perLayerAll > 0 && (!best || perLayerAll > best.perLayer)) {
        // 落地的列/行数（用于 3D 可视化）
        const cols = Math.floor((pallet.L + 2 * oh) / oL);
        const rows = Math.floor((pallet.W + 2 * oh) / oW);
        best = {
          oL, oW, perLayer: perLayerAll, kind,
          cols, rows,
          rot90: (foot[0] === W) // 90° 朝向
        };
      }
    }
    if (!best) return { perLayer: 0, layers: 0, perPallet: 0, palletHeight: pallet.baseH, palletWeight: 0, pattern: '—', patternType: 'column', oL: L, oW: W, cols: 0, rows: 0 };

    const availH = containerInteriorH - pallet.baseH;
    let layers = Math.max(1, Math.floor(availH / H));
    if (layers > maxStack) layers = maxStack; // 最大堆码层数约束
    const perPallet = best.perLayer * layers;
    const palletHeight = pallet.baseH + layers * H;
    const palletWeight = perPallet * carton.boxWeight; // kg
    const patternLabel = (best.rot90 ? '90°' : '0°') + '·' +
      (best.kind === 'interlock' ? '交错' : best.kind === 'pinwheel' ? '风车' : '列阵');
    return {
      perLayer: best.perLayer, layers, perPallet, palletHeight, palletWeight,
      pattern: patternLabel, patternType: best.kind,
      oL: best.oL, oW: best.oW, cols: best.cols, rows: best.rows
    };
  }

  // =====================================================================
  // STAGE 3 — Pallet block -> Ocean container
  // =====================================================================
  function evalContainer(palletLoad, pallet, container, Q, cartonMaxStack) {
    const C = container.interior;
    const PL = pallet.L, PW = pallet.W, ph = palletLoad.palletHeight;
    // orientation A: pallet L along container L
    const aN = Math.floor(C.l / PL) * Math.floor(C.w / PW);
    // orientation B: pallet rotated 90°
    const bN = Math.floor(C.l / PW) * Math.floor(C.w / PL);
    const baseCount = Math.max(aN, bN);
    const orientation = (aN >= bN) ? '0°' : '90°';
    let stack = 1;
    if (2 * ph <= C.h) stack = 2; // double-stacking trigger
    // 承重约束：双层堆叠时，底层纸箱承受 stack*layers 层，不得超过最大堆码层数
    if (isFinite(cartonMaxStack) && stack * palletLoad.layers > cartonMaxStack) stack = 1;
    const totalPallets = baseCount * stack;
    const totalBoxes = totalPallets * palletLoad.perPallet;
    const totalPCS = totalBoxes * Q;
    const totalWeight = totalPallets * palletLoad.palletWeight; // kg
    const fill = (totalPallets * PL * PW * ph) / (C.l * C.w * C.h);

    // Port payload constraint interlock
    if (totalWeight > container.maxPayload) return null;

    return {
      baseCount, stack, orientation,
      totalPallets, totalBoxes, totalPCS, totalWeight, fill
    };
  }

  // =====================================================================
  // ORCHESTRATOR — build Top 10 candidate container setups
  // =====================================================================
  function compute(inp) {
    const stage1 = genCartonCandidates(inp);
    if (stage1.overLimit) {
      return { overLimit: true, boxGrossKg: stage1.boxGrossKg, candidates: [] };
    }
    const pallet = PALLETS[inp.palletType];
    const container = CONTAINERS_B[inp.containerType];
    const built = [];
    for (const carton of stage1.candidates) {
      const palletLoad = evalPallet(carton, pallet, container.interior.h, {
        overhang: inp.overhang, cartonMaxStack: inp.cartonMaxStack, pattern: inp.pattern
      });
      if (palletLoad.perPallet <= 0) continue;
      const cont = evalContainer(palletLoad, pallet, container, inp.targetQty, inp.cartonMaxStack);
      if (!cont) continue; // pruned by payload interlock
      built.push({
        carton, palletLoad, cont,
        pallet, container,
        overhang: inp.overhang, cartonMaxStack: inp.cartonMaxStack,
        signature: [
          Math.round(carton.outer.l), Math.round(carton.outer.w), Math.round(carton.outer.h),
          palletLoad.perLayer, palletLoad.layers, cont.totalPallets, cont.totalPCS
        ].join('|')
      });
    }
    // de-duplicate identical setups, sort by total PCS desc, take Top 10
    const dedup = [];
    const sigSeen = new Set();
    built.forEach(c => { if (!sigSeen.has(c.signature)) { sigSeen.add(c.signature); dedup.push(c); } });
    dedup.sort((a, b) => b.cont.totalPCS - a.cont.totalPCS);
    return { overLimit: false, candidates: dedup.slice(0, 10) };
  }

  // =====================================================================
  // 3D — Carton interior viewport
  // =====================================================================
  const S = 0.03; // mm -> scene unit

  function makeScene(canvas) {
    const w = canvas.clientWidth || 320, h = canvas.clientHeight || 320;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f8);
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 50000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h, false);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dl = new THREE.DirectionalLight(0xffffff, 0.6); dl.position.set(1, 1.5, 1); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.3); dl2.position.set(-1, 0.5, -1); scene.add(dl2);
    const group = new THREE.Group(); scene.add(group);
    const indicator = new THREE.Group(); scene.add(indicator); // orientation gizmo (persists)
    const grid = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc); // default floor grid
    scene.add(grid);
    const view = { scene, camera, renderer, controls, group, indicator, grid, canvas };
    view.userData = { size: null, hlEdge: null };
    attachPick(view);
    return view;
  }

  // Raycaster hover pick + tooltip for a Mode B viewport
  function attachPick(view) {
    const el = view.renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, view.camera);
      const hits = raycaster.intersectObjects(view.group.children, true);
      let found = null;
      for (const h of hits) {
        let o = h.object;
        while (o && o !== view.group && !o.userData.pickable) o = o.parent;
        if (o && o.userData.pickable && o.visible) { found = o; break; }
      }
      setHighlightB(view, found);
      if (found) showTooltipB(e.clientX, e.clientY, found.userData);
      else hideTooltipB();
    });
    el.addEventListener('mouseleave', () => { setHighlightB(view, null); hideTooltipB(); });
  }

  function setHighlightB(view, mesh) {
    if (view.hlEdge) { view.group.remove(view.hlEdge); view.hlEdge.geometry.dispose(); view.hlEdge.material.dispose(); view.hlEdge = null; }
    if (!mesh) return;
    const g = new THREE.EdgesGeometry(mesh.geometry);
    const m = new THREE.LineBasicMaterial({ color: 0xffb020, transparent: true, opacity: 0.95 });
    const le = new THREE.LineSegments(g, m);
    le.position.copy(mesh.position);
    le.scale.copy(mesh.scale);
    view.group.add(le);
    view.hlEdge = le;
  }

  function showTooltipB(x, y, d) {
    const tt = document.getElementById('tooltip');
    if (!tt) return;
    tt.style.display = 'block';
    tt.style.left = (x + 14) + 'px';
    tt.style.top = (y + 14) + 'px';
    const dim = d.dims ? `${Math.round(d.dims[0])}×${Math.round(d.dims[1])}×${Math.round(d.dims[2])} mm` : '—';
    const wt = (d.weight && d.weight > 0) ? d.weight.toFixed(2) + ' kg' : _t('bTtNA');
    const loc = (d.layer != null && d.row != null && d.col != null)
      ? `${_t('layer')} ${d.layer} · ${_t('row')} ${d.row} · ${_t('col')} ${d.col}` : '';
    tt.innerHTML = `<div class="tt-title">📦 ${d.name || _t('bItem')}</div>
      <div class="tt-row"><span class="tt-k">${_t('bTtDim')}</span><span class="tt-v">${dim}</span></div>
      <div class="tt-row"><span class="tt-k">${_t('bTtWt')}</span><span class="tt-v">${wt}</span></div>
      ${loc ? `<div class="tt-row"><span class="tt-k">${_t('bTtPos')}</span><span class="tt-v">${loc}</span></div>` : ''}`;
  }

  function hideTooltipB() {
    const tt = document.getElementById('tooltip');
    if (tt) tt.style.display = 'none';
  }

  // Quick orthographic-like view switch for a Mode B viewport
  function setViewB(which, mode) {
    const view = state.scenes && state.scenes[which];
    if (!view) return;
    const s = view.userData && view.userData.size;
    if (!s) return;
    const dx = s.dx, dy = s.dy, dz = s.dz;
    const cx = dx / 2, cy = dy / 2, cz = dz / 2, d = Math.max(dx, dy, dz);
    if (mode === 'top') view.camera.position.set(cx, cy + d * 2.6, cz + 0.1);
    else if (mode === 'front') view.camera.position.set(dx + d * 1.3, cy, cz);
    else if (mode === 'side') view.camera.position.set(cx, cy, dz + d * 1.3);
    else { const dd = d * 2.4 + 10; view.camera.position.set(dd * 0.8, dd * 0.7, dd * 0.9); }
    view.controls.target.set(cx, cy, cz);
    view.controls.update();
    document.querySelectorAll(`.vp-views [data-bview="${which}"]`).forEach(b => b.classList.toggle('active', b.dataset.view === mode));
  }

  // Orientation gizmo: XYZ axes + green UP arrow + UP label at model corner
  function updateIndicator(view, hx, hy, hz) {
    clearGroup(view.indicator);
    const m = Math.max(hx, hy, hz) * 2;
    const pad = m * 0.2;
    // place gizmo at the front-left-bottom corner of the model (outside the mesh)
    view.indicator.position.set(-hx - pad, -hy - pad, hz + pad);
    view.indicator.add(new THREE.AxesHelper(m * 0.5)); // X red, Y green, Z blue
    const up = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0),
      m * 0.75, 0x10b981, m * 0.16, m * 0.1
    );
    view.indicator.add(up);
    const label = (typeof makeLabelSprite === 'function')
      ? makeLabelSprite('UP ↑', 'rgba(16,185,129,0.92)')
      : (function () { // fallback sprite if app.js label helper unavailable
          const c = document.createElement('canvas'); c.width = 256; c.height = 80;
          const x = c.getContext('2d'); x.fillStyle = 'rgba(16,185,129,0.92)'; x.fillRect(0, 0, 256, 80);
          x.font = 'bold 42px sans-serif'; x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
          x.fillText('UP ↑', 128, 40);
          const t = new THREE.CanvasTexture(c);
          return new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
        })();
    label.position.set(0, m * 1.0, 0);
    label.scale.set(m * 0.55, m * 0.17, 1);
    view.indicator.add(label);
  }

  function clearGroup(g) { while (g.children.length) g.remove(g.children[0]); }

  // Ground grid (matches Mode A's mesh floor/wireframe look) — sized to the object.
  function setGroundGrid(view, span, baseY) {
    if (view.grid) { view.scene.remove(view.grid); view.grid.geometry.dispose(); view.grid.material.dispose(); view.grid = null; }
    const size = Math.max(span, 1) * 1.25;
    const grid = new THREE.GridHelper(size, Math.max(4, Math.round(size / 2)), 0x888888, 0xcccccc);
    grid.position.y = baseY;
    view.scene.add(grid);
    view.grid = grid;
  }

  function drawCarton(view, cand) {
    const g = view.group; clearGroup(g);
    const o = cand.carton.outer, inner = cand.carton.inner;
    const ox = o.l * S, oy = o.h * S, oz = o.w * S; // scene Y = height
    // semi-transparent glass box
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(ox, oy, oz),
      new THREE.MeshLambertMaterial({ color: 0xbcd0ea, transparent: true, opacity: 0.12 })
    );
    g.add(glass);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(ox, oy, oz)),
      new THREE.LineBasicMaterial({ color: 0x1e2a44, transparent: true, opacity: 0.85 })
    );
    g.add(edges);
    // product blocks inside (nx × ny × nz)
    // X = nx (inner.l), Z(depth) = ny (inner.w), Y(height) = nz (inner.h)
    const { nx, ny, nz } = cand.carton;
    const cx = (inner.l / nx) * S;          // X cell
    const cz = (inner.w / ny) * S;          // Z cell
    const cy = (inner.h / nz) * S;          // Y cell
    const startX = -inner.l * S / 2 + cx / 2;
    const startZ = -inner.w * S / 2 + cz / 2;
    const startY = -inner.h * S / 2 + cy / 2;
    let idx = 0;
    for (let i = 0; i < nx; i++) {            // X
      for (let j = 0; j < ny; j++) {          // Z (depth)
        for (let k = 0; k < nz; k++) {        // Y (height)
          const col = PALETTE[idx % PALETTE.length];
          const m = new THREE.Mesh(
            new THREE.BoxGeometry(cx * 0.94, cy * 0.94, cz * 0.94),
            new THREE.MeshLambertMaterial({ color: col })
          );
          m.position.set(startX + i * cx, startY + k * cy, startZ + j * cz);
          const itemL = inner.l / nx, itemW = inner.w / ny, itemH = inner.h / nz;
          m.userData = {
            pickable: true,
            z: startY + k * cy - inner.h * S / 2,      // 单品底面高度(场景)
            name: '单品', dims: [itemL, itemW, itemH],  // mm
            weight: cand.carton.boxWeight / (nx * ny * nz), // 单件近似净重 kg
            layer: k + 1, row: i + 1, col: j + 1,
            boxColor: col
          };
          g.add(m);
          idx++;
        }
      }
    }
    view.userData.size = { dx: ox, dy: oy, dz: oz };
    frameCamera(view, Math.max(ox, oy, oz));
    updateIndicator(view, ox / 2, oy / 2, oz / 2);
    setGroundGrid(view, Math.max(ox, oz), -oy / 2);
    view.renderer.render(view.scene, view.camera);
  }

  function drawPallet(view, cand) {
    const g = view.group; clearGroup(g);
    const p = cand.pallet, pl = cand.palletLoad;
    const baseX = p.L * S, baseY = p.baseH * S, baseZ = p.W * S;
    // wooden base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(baseX, baseY, baseZ),
      new THREE.MeshLambertMaterial({ color: 0x9c6b3f })
    );
    base.position.y = baseY / 2;
    g.add(base);
    const slats = new THREE.Mesh(
      new THREE.BoxGeometry(baseX * 0.98, baseY * 0.35, baseZ * 0.98),
      new THREE.MeshLambertMaterial({ color: 0xb07d4c })
    );
    slats.position.y = baseY + baseY * 0.18;
    g.add(slats);
    // carton stacking — 显式 cols×rows 计算后精确居中，箱子永不溢出托盘
    const L = cand.carton.outer.l, W = cand.carton.outer.w, H = cand.carton.outer.h;
    const oh = (cand.overhang || 0);
    const spanX = p.L + 2 * oh, spanZ = p.W + 2 * oh;
    const kind = pl.patternType || 'column';
    const L_along_X = (pl.pattern === '0°');  // 0°=外箱 L 沿托盘 X
    const bOL = L_along_X ? L : W;             // 基础朝向：X 方向尺寸 (mm)
    const bOW = L_along_X ? W : L;             // 基础朝向：Z 方向尺寸 (mm)
    const bXStep = bOL * S, bZStep = bOW * S;
    const bCols = Math.max(0, Math.floor(spanX / bOL));
    const bRows = Math.max(0, Math.floor(spanZ / bOW));
    const bStartX = bCols > 0 ? -bCols * bXStep / 2 + bXStep / 2 : 0;
    const bStartZ = bRows > 0 ? -bRows * bZStep / 2 + bZStep / 2 : 0;
    const halfSpanXS = spanX * S / 2;
    const cy = H * S;
    for (let ly = 0; ly < pl.layers; ly++) {
      for (let r = 0; r < bRows; r++) {
        // 默认基础朝向；pinwheel 奇数行 90° 旋转
        let rowXStep = bXStep, rowZStep = bZStep, rowCols = bCols, rowStartX = bStartX;
        if (kind === 'pinwheel' && (r % 2)) {
          const altOL = bOW;
          const altXStep = altOL * S;
          const altCols = Math.max(0, Math.floor(spanX / altOL));
          if (altCols <= 0) continue;
          rowXStep = altXStep;
          rowZStep = bOL * S;
          rowCols = altCols;
          rowStartX = -altCols * altXStep / 2 + altXStep / 2;
        }
        // interlock 偶数行错位半箱
        const rowShift = (kind === 'interlock' && (r % 2)) ? rowXStep / 2 : 0;
        let x = rowStartX + rowShift;
        for (let c = 0; c < rowCols; c++) {
          // 右边界检查防止错位后溢出
          if (x + rowXStep / 2 > halfSpanXS + 0.001) break;
          const col3 = PALETTE[(ly * 31 + r * 17 + c * 7) % PALETTE.length];
          const m = new THREE.Mesh(
            new THREE.BoxGeometry(rowXStep * 0.96, cy * 0.96, rowZStep * 0.96),
            new THREE.MeshLambertMaterial({ color: col3 })
          );
          const z = bStartZ + r * bZStep;
          m.position.set(x, baseY + cy / 2 + ly * cy, z);
          m.userData = {
            pickable: true,
            z: baseY + ly * cy,
            name: '外箱', dims: [L, W, H],
            weight: cand.carton.boxWeight,
            layer: ly + 1, row: r + 1, col: c + 1,
            boxColor: col3
          };
          g.add(m);
          x += rowXStep;
        }
      }
    }
    const totalH = baseY + pl.layers * cy;
    g.position.y = -totalH / 2; // center vertically
    view.userData.size = { dx: baseX, dy: totalH, dz: baseZ };
    frameCamera(view, Math.max(baseX, baseZ, totalH));
    updateIndicator(view, baseX / 2, totalH / 2, baseZ / 2);
    setGroundGrid(view, Math.max(baseX, baseZ), -totalH / 2);
    view.renderer.render(view.scene, view.camera);
  }

  function frameCamera(view, maxDim) {
    const d = maxDim * 2.4 + 10;
    view.camera.position.set(d * 0.8, d * 0.7, d * 0.9);
    view.camera.lookAt(0, 0, 0);
    view.controls.target.set(0, 0, 0);
    view.controls.update();
  }

  function ensureScenes() {
    if (state.scenes) return;
    if (!window.THREE) {            // Three.js not loaded yet / failed
      console.warn('[PalletOptimizer] THREE not available — 3D disabled');
      return;
    }
    const cartonCanvas = document.getElementById('carton3dCanvas');
    const palletCanvas = document.getElementById('pallet3dCanvas');
    state.scenes = {
      carton: makeScene(cartonCanvas),
      pallet: makeScene(palletCanvas)
    };
  }

  // Continuous render loop — REQUIRED so OrbitControls drag actually repaints
  // (without it the camera moves but nothing re-renders, making it look frozen).
  //
  // Robustness contract:
  //   * Driven solely by state.bActive. When false the loop self-terminates and
  //     clears state.rafId (no ghost frames, no leak).
  //   * startLoop() is a no-op if a loop is already running (rafId != null), so
  //     repeated A->B->A->B switches can never spawn duplicate loops AND can
  //     never fail to restart (the old loopStarted flag did the latter).
  function startLoop() {
    if (state.rafId != null) return;            // already running
    if (!state.bActive || !state.scenes) return;
    const tick = () => {
      if (!state.bActive || !state.scenes) { state.rafId = null; return; }
      ['carton', 'pallet'].forEach(k => {
        const v = state.scenes[k];
        v.controls.update();
        v.renderer.render(v.scene, v.camera);
      });
      state.rafId = requestAnimationFrame(tick);
    };
    state.rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    state.bActive = false;
    if (state.rafId != null) { cancelAnimationFrame(state.rafId); state.rafId = null; }
  }

  function resizeScenes() {
    if (!state.scenes) return;
    ['carton', 'pallet'].forEach(k => {
      const v = state.scenes[k];
      const w = v.canvas.clientWidth, h = v.canvas.clientHeight;
      if (!w || !h) return;
      v.camera.aspect = w / h;
      v.camera.updateProjectionMatrix();
      v.renderer.setSize(w, h, false);
    });
    if (state.selected) {
      drawCarton(state.scenes.carton, state.selected);
      drawPallet(state.scenes.pallet, state.selected);
    }
  }

  // Reset a single Mode B viewport camera to its framed default (mirrors Mode A resetView)
  function resetViewB(which) {
    if (!state.scenes) return;
    if (!state.selected) return;
    if (which === 'carton') drawCarton(state.scenes.carton, state.selected);
    else if (which === 'pallet') drawPallet(state.scenes.pallet, state.selected);
    if (state.rafId == null) startLoop(); // ensure loop alive after manual redraw
  }

  // Export a single Mode B viewport as PNG (mirrors Mode A exportPNG).
  // preserveDrawingBuffer:true on the renderer guarantees a non-blank capture.
  function exportPNGB(which) {
    if (!state.scenes) return;
    const v = state.scenes[which];
    if (!v) return;
    v.renderer.render(v.scene, v.camera);
    const url = v.renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = (which === 'carton' ? 'carton-3d' : 'pallet-3d') + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // =====================================================================
  // RENDER — summary + Top 10 table
  // =====================================================================
  function renderSummary(cand) {
    const el = document.getElementById('bSummary');
    const c = cand.carton, p = cand.palletLoad, ct = cand.cont, pl = cand.pallet, co = cand.container;
    const fillPct = (ct.fill * 100).toFixed(1);
    // KPI dashboard (Mode B) — reuse global renderKPI with target #kpiB
    if (typeof renderKPI === 'function') {
      const kpiCbm = co.interior.l * co.interior.w * co.interior.h / 1e9; // mm³ → m³
      renderKPI({
        fillRate: ct.fill,
        totalPcs: ct.totalPCS,
        totalCbm: kpiCbm * ct.fill,
        totalWeight: ct.totalWeight,
        maxWeight: (co.maxPayload && isFinite(co.maxPayload)) ? co.maxPayload : null,
        totalPallets: ct.totalPallets
      }, 'kpiB');
    }
    const fillCls = ct.fill >= 0.7 ? 'good' : (ct.fill >= 0.5 ? '' : 'warn');
    const patternName = p.patternType==='interlock'?_t('bPatternInterlock'):p.patternType==='pinwheel'?_t('bPatternPinwheel'):_t('bPatternColumn');
    el.innerHTML = `
      <h4>${_t('bBestPlan')} · ${co.name} / ${pl.name}</h4>
      <div class="result-row"><span>${_t('bOuterDim')}</span><span class="val">${Math.round(c.outer.l)}×${Math.round(c.outer.w)}×${Math.round(c.outer.h)} mm</span></div>
      <div class="result-row"><span>${_t('bOuterLayout')}</span><span class="val">${c.nx}×${c.ny}×${c.nz} (内 ${Math.round(c.inner.l)}×${Math.round(c.inner.w)}×${Math.round(c.inner.h)})</span></div>
      <div class="result-row"><span>${_t('bBoxWt')}</span><span class="val">${c.boxWeight.toFixed(2)} kg</span></div>
      <div class="result-row"><span>${_t('bPerLayer')}</span><span class="val">${p.layers} ${_t('wordLayer')} × ${p.perLayer} ${_t('wordBox')} (${patternName})</span></div>
      <div class="result-row"><span>${_t('bPatternMode')}</span><span class="val">${patternName}</span></div>
      <div class="result-row"><span>${_t('bOverStack')}</span><span class="val">${(cand.overhang||0)}mm / ${isFinite(cand.cartonMaxStack)?cand.cartonMaxStack+_t('wordLayer'):'∞'}</span></div>
      <div class="result-row"><span>${_t('bPerPallet')}</span><span class="val">${p.perPallet} ${_t('wordBox')}</span></div>
      <div class="result-row"><span>${_t('bPalletH')}</span><span class="val">${Math.round(p.palletHeight)} mm</span></div>
      <div class="result-row"><span>${_t('bContPallets')}</span><span class="val">${ct.totalPallets} (堆叠 ${ct.stack}×, ${ct.orientation})</span></div>
      <div class="result-row"><span>${_t('bTotalBoxes')}</span><span class="val">${ct.totalBoxes} ${_t('wordBox')}</span></div>
      <div class="result-row good"><span>${_t('bTotalPCS')}</span><span class="val">${ct.totalPCS.toLocaleString()} PCS</span></div>
      <div class="result-row ${fillCls}"><span>${_t('bFillRate')}</span><span class="val">${fillPct}%</span></div>
      <div class="progress"><div class="progress-bar" style="width:${Math.min(100, fillPct)}%"></div></div>
      <div class="result-row"><span>${_t('bGrossWt')}</span><span class="val">${ct.totalWeight.toFixed(1)} / ${co.maxPayload} kg</span></div>
    `;
  }

  function renderTop10(list) {
    const wrap = document.getElementById('bTop10');
    if (!list.length) { wrap.innerHTML = '<div class="empty-state">' + _t('bNoPlan') + '</div>'; return; }
    // Champion badges: best fill / max PCS / most balanced box weight
    let iBestFill = 0, iBestPCS = 0, iBestBal = 0, bestFill = -1, bestPCS = -1;
    list.forEach((cand, i) => {
      if (cand.cont.fill > bestFill) { bestFill = cand.cont.fill; iBestFill = i; }
      if (cand.cont.totalPCS > bestPCS) { bestPCS = cand.cont.totalPCS; iBestPCS = i; }
    });
    const weights = list.map(c => c.carton.boxWeight).sort((a, b) => a - b);
    const med = weights[Math.floor(weights.length / 2)];
    let bestBal = Infinity;
    list.forEach((cand, i) => {
      const diff = Math.abs(cand.carton.boxWeight - med);
      if (diff < bestBal) { bestBal = diff; iBestBal = i; }
    });
    const badgeFor = (i) => {
      const bs = [];
      if (i === iBestFill) bs.push('<span class="rec-badge fill">' + _t('recFill') + '</span>');
      if (i === iBestPCS) bs.push('<span class="rec-badge max">' + _t('recMax') + '</span>');
      if (list.length > 1 && i === iBestBal) bs.push('<span class="rec-badge bal">' + _t('recBal') + '</span>');
      return bs.join('<br>');
    };
    let rows = '';
    list.forEach((cand, i) => {
      const ct = cand.cont, c = cand.carton;
      rows += `<tr data-idx="${i}" class="${i === 0 ? 'selected' : ''}">
        <td>${i + 1}${badgeFor(i) ? `<div class="badge-cell">${badgeFor(i)}</div>` : ''}</td>
        <td>${Math.round(c.outer.l)}×${Math.round(c.outer.w)}×${Math.round(c.outer.h)}</td>
        <td>${cand.palletLoad.perLayer}×${cand.palletLoad.layers}</td>
        <td>${cand.palletLoad.perPallet}</td>
        <td>${ct.totalPallets}</td>
        <td>${ct.totalPCS.toLocaleString()}</td>
        <td>${(ct.fill * 100).toFixed(0)}%</td>
      </tr>`;
    });
    wrap.innerHTML = `<table class="matrix top10">
      <thead><tr><th>${_t('thNo')}</th><th>${_t('thCarton')}</th><th>${_t('thLayerPer')}</th><th>${_t('thPerPallet')}</th><th>${_t('thPallet')}</th><th>${_t('thPCS')}</th><th>${_t('thFill')}</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
    wrap.querySelectorAll('tr[data-idx]').forEach(tr => {
      tr.addEventListener('click', () => {
        const idx = parseInt(tr.getAttribute('data-idx'), 10);
        selectCandidate(idx);
      });
    });
  }

  function selectCandidate(idx) {
    const cand = state.candidates[idx];
    if (!cand) return;
    state.selected = cand;
    document.querySelectorAll('#bTop10 tr[data-idx]').forEach(tr => {
      tr.classList.toggle('selected', parseInt(tr.getAttribute('data-idx'), 10) === idx);
    });
    renderSummary(cand);
    if (state.scenes) {
      drawCarton(state.scenes.carton, cand);
      drawPallet(state.scenes.pallet, cand);
    }
  }

  // =====================================================================
  // INPUT READ
  // =====================================================================
  function readInput() {
    const num = id => parseFloat(document.getElementById(id).value) || 0;
    const ms = parseFloat(document.getElementById('bCartonMaxStack').value);
    return {
      itemL: num('bItemL'), itemW: num('bItemW'), itemH: num('bItemH'),
      itemWeightG: num('bItemWeight'),
      targetQty: Math.max(1, Math.round(num('bTargetQty'))),
      wall: num('bWall'),
      maxLoadKg: num('bMaxLoad'),
      allowSide: document.getElementById('bAllowSide').checked,
      allowInvert: document.getElementById('bAllowInvert').checked,
      palletType: document.getElementById('bPalletType').value,
      containerType: document.getElementById('bContainerType').value,
      overhang: Math.max(0, Math.min(20, num('bOverhang'))),       // 边缘溢出 mm
      cartonMaxStack: isFinite(ms) && ms >= 1 ? Math.floor(ms) : Infinity, // 最大堆码层数
      pattern: document.getElementById('bPattern').value           // auto|column|interlock|pinwheel
    };
  }

  function updatePreviews() {
    const v = readInput();
    const pName = (PALLETS[v.palletType] || {}).name || '';
    const cName = (CONTAINERS_B[v.containerType] || {}).name || '';
    document.getElementById('bPrev1').textContent =
      `${_t('bPrevItem')} ${v.itemL}×${v.itemW}×${v.itemH}mm · ${v.targetQty}PCS · ${v.itemWeightG}g`;
    document.getElementById('bPrev2').textContent =
      `${_t('bPrevWall')} ${v.wall}mm · ${_t('bLimit')} ${v.maxLoadKg}kg · ${_t('bPrevOver')} ${v.overhang}mm · ${_t('bPrevStack')}${isFinite(v.cartonMaxStack)?v.cartonMaxStack:'∞'}${_t('bPrevLayer')}`;
    document.getElementById('bPrev3').textContent =
      `${pName} · ${cName}`;
  }

  // =====================================================================
  // PUBLIC OPTIMIZE
  // =====================================================================
  function runOptimize() {
    const inp = readInput();
    const res = compute(inp);
    if (res.overLimit) {
      document.getElementById('bSummary').innerHTML =
        `<div class="result-box" style="border-color:#ef4444">
           <h4 style="color:#ef4444">${_t('bOverLimit')}</h4>
           <div class="result-row"><span>${_t('bBoxWt')}</span><span class="val">${res.boxGrossKg.toFixed(2)} kg</span></div>
           <div class="result-row"><span>${_t('bLimit')}</span><span class="val">${inp.maxLoadKg} kg</span></div>
           <div class="hint">${_t('bOverHint')}</div>
         </div>`;
      document.getElementById('bTop10').innerHTML = '';
      state.candidates = []; state.selected = null;
      return;
    }
    state.candidates = res.candidates;
    renderTop10(res.candidates);
    if (res.candidates.length) {
      selectCandidate(0);
    } else {
      document.getElementById('bSummary').innerHTML = '<div class="empty-state">' + _t('bNoPlan') + '</div>';
    }
  }

  // =====================================================================
  // MODE SWITCH + ACCORDION WIRING
  // =====================================================================
  function showMode(mode) {
    const a = document.getElementById('modeAView');
    const b = document.getElementById('modeBView');
    const btnA = document.getElementById('btnModeA');
    const btnB = document.getElementById('btnModeB');
    if (mode === 'B') {
      a.style.display = 'none';
      b.style.display = 'grid';
      btnB.classList.add('active'); btnA.classList.remove('active');
      state.bActive = true;
      if (!window.THREE) {
        // Three.js not ready yet — build the scenes as soon as it loads,
        // so an early Mode B click still gets a working 3D.
        window.addEventListener('three-ready', () => showMode('B'), { once: true });
        return;
      }
      ensureScenes();
      // canvases need a frame to get client size
      requestAnimationFrame(() => {
        resizeScenes();
        if (state.selected) {
          drawCarton(state.scenes.carton, state.selected);
          drawPallet(state.scenes.pallet, state.selected);
        }
        startLoop();   // robust: restarts on every B entry, never double-spawns
      });
    } else {
      b.style.display = 'none';
      a.style.display = 'grid';
      btnA.classList.add('active'); btnB.classList.remove('active');
      stopLoop();      // halt + clear rafId so a later B entry restarts cleanly
    }
  }

  function toggleAcc(id) {
    const body = document.getElementById(id + 'Body');
    const expanded = body.style.display !== 'none';
    body.style.display = expanded ? 'none' : 'block';
    document.getElementById(id + 'Edit').textContent = expanded ? _t('accExpand') : _t('collapse');
  }

  function bind() {
    document.getElementById('btnModeA').addEventListener('click', () => showMode('A'));
    document.getElementById('btnModeB').addEventListener('click', () => showMode('B'));
    ['bAcc1', 'bAcc2', 'bAcc3'].forEach(id => {
      document.getElementById(id + 'Edit').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAcc(id);
      });
      document.getElementById(id + 'Head').addEventListener('click', () => toggleAcc(id));
    });
    ['bItemL','bItemW','bItemH','bItemWeight','bTargetQty','bWall','bMaxLoad',
     'bPalletType','bContainerType'].forEach(id => {
      document.getElementById(id).addEventListener('input', updatePreviews);
      document.getElementById(id).addEventListener('change', updatePreviews);
    });
    document.getElementById('bOptimize').addEventListener('click', runOptimize);
    // viewport toolbar: reset + PNG for each of the two 3D views
    document.getElementById('bCartonReset').addEventListener('click', () => resetViewB('carton'));
    document.getElementById('bCartonPng').addEventListener('click', () => exportPNGB('carton'));
    document.getElementById('bPalletReset').addEventListener('click', () => resetViewB('pallet'));
    document.getElementById('bPalletPng').addEventListener('click', () => exportPNGB('pallet'));
    window.addEventListener('resize', () => {
      if (document.getElementById('modeBView').style.display !== 'none') resizeScenes();
    });
    updatePreviews();
  }

  // re-render dynamic panels in the current language (called by app.js applyI18n)
  function rerender() {
    updatePreviews();
    if (state.candidates && state.candidates.length) renderTop10(state.candidates);
    if (state.selected) renderSummary(state.selected);
    ['bAcc1','bAcc2','bAcc3'].forEach(id => {
      const body = document.getElementById(id + 'Body');
      if (!body) return;
      const expanded = body.style.display !== 'none';
      const el = document.getElementById(id + 'Edit');
      if (el) el.textContent = expanded ? _t('accExpand') : _t('collapse');
    });
  }

  // expose
  window.PalletOptimizer = { runOptimize, showMode, resetViewB, exportPNGB, setViewB, rerender, _state: state };
  // inline onclick="setViewB(...)" handlers in HTML resolve on window —
  // the IIFE would otherwise hide this function from them.
  window.setViewB = setViewB;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
