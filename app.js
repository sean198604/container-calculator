// =====================================================================
// Smart Packing Optimizer — Unified Product List (cm units)
// =====================================================================

// ---------- I18N ----------
const I18N = {
  zh: {
    containerSec:'集装箱', containerType:'集装箱类型', custom:'自定义',
    maxH:'限高 (cm)', cbmRate:'装载率目标 %',
    autoHint:'自动组合 20GP / 40GP / 40HQ / 45HQ 找最优搭配', containerCompare:'集装箱对比',
    products:'外箱明细', productHint:'添加各类外箱，系统统一装入同一批集装箱',
    addStd:'标准 Standard', addStk:'叠装 Stack', addSet:'套装 Set',
    optimize:'计算最优方案', resultTitle:'装箱方案',
    noResult:'请在左侧添加外箱，点击"计算最优方案"',
    ready:'拖动旋转 · 滚轮缩放 · 右键平移', resetView:'复位视角',
    name:'名称', qty:'数量', weight:'重量(kg)',
    uprightOnly:'仅正向摆放',
    typeStd:'标准', typeStk:'叠装', typeSet:'套装',
    stackDir:'叠装方向', perStack:'每叠件数', nestInc:'嵌入量(cm)',
    sets:'套数', parts:'组件列表', addPart:'添加组件', qtyPerSet:'每套数量',
    containersNeeded:'需要集装箱', avgFill:'综合装载率',
    bestPlan:'最优方案', utilisation:'装载率', target:'目标',
    perCarton:'每柜装载', totalLoaded:'总装载', perContainerPlan:'各集装箱装载方案',
    clickToView:'点击查看该柜 3D 装箱图', byProduct:'各外箱装载情况',
    maxMatrix:'单柜最大装载矩阵', maxMatrixHint:'每种集装箱单独装每种外箱的最大数',
    mixed:'混装', blank:'(留空)', sub:'组件',
    knownMode:'已知数量', maxMode:'最大装载',
    cartonDim:'外箱尺寸', stackedDim:'叠装后尺寸',
    first:'第', secContainer:'柜',
  },
  en: {
    containerSec:'Container', containerType:'Container Type', custom:'Custom',
    maxH:'Max Height (cm)', cbmRate:'Target Fill %',
    autoHint:'Auto-mix 20GP / 40GP / 40HQ / 45HQ for optimal combination', containerCompare:'Container Comparison',
    products:'Carton List', productHint:'Add any mix of cartons — all packed into same containers',
    addStd:'Standard', addStk:'Stack', addSet:'Set',
    optimize:'Optimize', resultTitle:'Packing Plan',
    noResult:'Add cartons on the left and click "Optimize"',
    ready:'Drag · Scroll · Right-click', resetView:'Reset View',
    name:'Name', qty:'Qty', weight:'Weight(kg)',
    uprightOnly:'Upright only',
    typeStd:'Standard', typeStk:'Stack', typeSet:'Set',
    stackDir:'Stack Dir', perStack:'Pcs/Stack', nestInc:'Nest (cm)',
    sets:'Sets', parts:'Parts', addPart:'Add Part', qtyPerSet:'Qty/set',
    containersNeeded:'Containers', avgFill:'Avg Fill',
    bestPlan:'Best Plan', utilisation:'Fill', target:'target',
    perCarton:'Per Container', totalLoaded:'Total', perContainerPlan:'Per-Container Plan',
    clickToView:'Click to view 3D loading', byProduct:'By Carton',
    maxMatrix:'Max-Pack Matrix', maxMatrixHint:'Max count when packing each carton alone per container',
    mixed:'Mixed', blank:'(blank)', sub:'Part',
    knownMode:'Known Qty', maxMode:'Max Pack',
    cartonDim:'Dim', stackedDim:'Stack Dim',
    first:'#', secContainer:'',
  }
};
let LANG='zh';
function t(k,v){ let s=(I18N[LANG]&&I18N[LANG][k])||(I18N.zh[k]||k);
  if(v) Object.keys(v).forEach(kk=>{s=s.replace('{'+kk+'}',v[kk]);}); return s; }
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(I18N[LANG][k]) el.textContent=I18N[LANG][k];
  });
  document.getElementById('langLabel').textContent = LANG==='zh'?'English':'中文';
  document.documentElement.lang = LANG==='zh'?'zh-CN':'en';
  refreshProducts();
}
function toggleLang(){ LANG=LANG==='zh'?'en':'zh'; applyI18n(); }

// ---------- CONTAINERS (cm) ----------
const CONTAINERS = {
  '20GP': {L:589.8, W:235.2, H:239.3, name:"20' GP", maxWeight:28200},
  '40GP': {L:1203.2, W:235.2, H:239.3, name:"40' GP", maxWeight:26700},
  '40HQ': {L:1203.2, W:235.2, H:269.8, name:"40' HQ", maxWeight:26500},
  '45HQ': {L:1360.8, W:235.2, H:269.8, name:"45' HQ", maxWeight:25800}
};
const PALETTE = [
  '#5B9BD5','#D4A04A','#6BBF8A','#D07882','#8FAED4',
  '#E8A84C','#55B8A0','#D48F6A','#A0C76E','#C4A060',
];

// ---------- COLOR HELPERS ----------
function _hexRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function _rgbHex(r,g,b){ return '#'+[r,g,b].map(c=>Math.max(0,Math.min(255,Math.round(c))).toString(16).padStart(2,'0')).join(''); }
function _lighten(hex,f){ const c=_hexRgb(hex); return _rgbHex(c[0]+(255-c[0])*f, c[1]+(255-c[1])*f, c[2]+(255-c[2])*f); }
function _darken(hex,f){ const c=_hexRgb(hex); return _rgbHex(c[0]*(1-f), c[1]*(1-f), c[2]*(1-f)); }

// ---------- STATE ----------
let productId = 1;
let products = [
  { id:productId++, type:'standard', name:'', L:null, W:null, H:null, weight:null, qty:null, uprightOnly:false }
];
let lastResult = null;
let selectedContainerIdx = 0;

function defaultProductName(i){ return (LANG==='zh'?'外箱':'Carton')+(i+1); }
function getName(p,i){ return (p.name && p.name.trim()) || defaultProductName(i); }

// ---------- PRODUCT MANAGEMENT ----------
function addProduct(type){
  const base = { id: productId++, type, name:'', uprightOnly:false };
  if(type==='standard'){
    products.push({ ...base, L:null,W:null,H:null, weight:null, qty:null });
  } else if(type==='stack'){
    products.push({ ...base, L:null,W:null,H:null, weight:null, qty:null,
                    stackDir:'H', perStack:null, nestInc:null });
  } else if(type==='set'){
    products.push({ ...base, setsQty:null, parts: [
      { name:'', L:null, W:null, H:null, weight:null, qtyPerSet:1, uprightOnly:false }
    ]});
  }
  refreshProducts();
}
function delProduct(i){ if(products.length>1){ products.splice(i,1); refreshProducts(); } }
function updProduct(i,k,v){ products[i][k]=v; }
function updPart(i,pIdx,k,v){ products[i].parts[pIdx][k]=v; }
function addPart(i){
  products[i].parts.push({ name:'', L:null,W:null,H:null, weight:null, qtyPerSet:1, uprightOnly:false });
  refreshProducts();
}
function delPart(i,pIdx){
  if(products[i].parts.length>1){ products[i].parts.splice(pIdx,1); refreshProducts(); }
}

function refreshProducts(){
  const box = document.getElementById('productList');
  if(!box) return;
  box.innerHTML = products.map((p,i)=>renderProductCard(p,i)).join('');
}

function renderProductCard(p,i){
  const color = PALETTE[i % PALETTE.length];
  const typeName = p.type==='standard' ? t('typeStd') : p.type==='stack' ? t('typeStk') : t('typeSet');
  const typeClass = p.type==='standard' ? '' : p.type==='stack' ? 'stack' : 'set';
  const header = `
    <button class="del" onclick="delProduct(${i})">×</button>
    <div style="margin-bottom:6px">
      <span class="type-badge ${typeClass}">${typeName}</span>
      <input type="text" value="${p.name||''}" placeholder="${defaultProductName(i)}"
        oninput="updProduct(${i},'name',this.value)" onfocus="this.select()"
        style="display:inline-block;width:calc(100% - 70px);padding:4px 8px;font-weight:600">
    </div>`;

  if(p.type==='standard'){
    return `<div class="item-card" style="border-left-color:${color}">
      ${header}
      <div class="row">
        <div><label>L (cm)</label><input type="number" value="${p.L??''}" placeholder="60"
               oninput="updProduct(${i},'L',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        <div><label>W (cm)</label><input type="number" value="${p.W??''}" placeholder="40"
               oninput="updProduct(${i},'W',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        <div><label>H (cm)</label><input type="number" value="${p.H??''}" placeholder="30"
               oninput="updProduct(${i},'H',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
      <div class="row-2" style="margin-top:6px">
        <div><label>${t('weight')}</label><input type="number" step="0.1" value="${p.weight??''}" placeholder="—"
               oninput="updProduct(${i},'weight',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        <div><label>${t('qty')}</label><input type="number" value="${p.qty??''}" placeholder="${t('blank')}"
               oninput="updProduct(${i},'qty',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
      <label class="single-check"><input type="checkbox" ${p.uprightOnly?'checked':''}
        onchange="updProduct(${i},'uprightOnly',this.checked)">${t('uprightOnly')}</label>
    </div>`;
  }

  if(p.type==='stack'){
    return `<div class="item-card" style="border-left-color:${color}">
      ${header}
      <div class="row">
        <div><label>L (cm)</label><input type="number" value="${p.L??''}" placeholder="56"
               oninput="updProduct(${i},'L',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        <div><label>W (cm)</label><input type="number" value="${p.W??''}" placeholder="52"
               oninput="updProduct(${i},'W',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        <div><label>H (cm)</label><input type="number" value="${p.H??''}" placeholder="82"
               oninput="updProduct(${i},'H',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
      <div class="row-2" style="margin-top:6px">
        <div><label>${t('weight')}</label><input type="number" step="0.1" value="${p.weight??''}" placeholder="5"
               oninput="updProduct(${i},'weight',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        <div><label>${t('qty')}</label><input type="number" value="${p.qty??''}" placeholder="${t('blank')}"
               oninput="updProduct(${i},'qty',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
      <div class="sub-section">
        <div class="row">
          <div><label>${t('stackDir')}</label>
            <select onchange="updProduct(${i},'stackDir',this.value)">
              <option value="H" ${p.stackDir==='H'?'selected':''}>↕ H</option>
              <option value="L" ${p.stackDir==='L'?'selected':''}>→ L</option>
              <option value="W" ${p.stackDir==='W'?'selected':''}>→ W</option>
            </select>
          </div>
          <div><label>${t('perStack')}</label><input type="number" value="${p.perStack??''}" placeholder="6"
                 oninput="updProduct(${i},'perStack',this.value===''?null:+this.value)" onfocus="this.select()"></div>
          <div><label>${t('nestInc')}</label><input type="number" value="${p.nestInc??''}" placeholder="10"
                 oninput="updProduct(${i},'nestInc',this.value===''?null:+this.value)" onfocus="this.select()"></div>
        </div>
      </div>
      <label class="single-check"><input type="checkbox" ${p.uprightOnly?'checked':''}
        onchange="updProduct(${i},'uprightOnly',this.checked)">${t('uprightOnly')}</label>
    </div>`;
  }

  if(p.type==='set'){
    const parts = p.parts.map((pt,pIdx)=>`
      <div class="part-item">
        <button class="mini-del" onclick="delPart(${i},${pIdx})">×</button>
        <input type="text" value="${pt.name||''}" placeholder="${t('sub')+(pIdx+1)}"
               oninput="updPart(${i},${pIdx},'name',this.value)" onfocus="this.select()"
               style="padding:4px 8px;margin-bottom:4px">
        <div class="row-4">
          <div><label>L</label><input type="number" value="${pt.L??''}" placeholder="90"
                 oninput="updPart(${i},${pIdx},'L',+this.value)" onfocus="this.select()"></div>
          <div><label>W</label><input type="number" value="${pt.W??''}" placeholder="85"
                 oninput="updPart(${i},${pIdx},'W',+this.value)" onfocus="this.select()"></div>
          <div><label>H</label><input type="number" value="${pt.H??''}" placeholder="40"
                 oninput="updPart(${i},${pIdx},'H',+this.value)" onfocus="this.select()"></div>
          <div><label>${t('qtyPerSet')}</label><input type="number" value="${pt.qtyPerSet??1}" placeholder="1"
                 oninput="updPart(${i},${pIdx},'qtyPerSet',+this.value)" onfocus="this.select()"></div>
          <div></div>
        </div>
        <label class="single-check" style="margin-top:4px;font-size:11px">
          <input type="checkbox" ${pt.uprightOnly?'checked':''}
            onchange="updPart(${i},${pIdx},'uprightOnly',this.checked)">${t('uprightOnly')}</label>
      </div>`).join('');
    return `<div class="item-card" style="border-left-color:${color}">
      ${header}
      <label>${t('sets')}</label>
      <input type="number" value="${p.setsQty??''}" placeholder="10"
             oninput="updProduct(${i},'setsQty',this.value===''?null:+this.value)" onfocus="this.select()">
      <div class="part-list">
        <div style="font-size:12px;font-weight:600;color:#425060;margin-bottom:6px">${t('parts')}</div>
        ${parts}
        <button class="btn-small btn-sec btn" style="width:auto;margin-top:4px" onclick="addPart(${i})">+ ${t('addPart')}</button>
      </div>
    </div>`;
  }
  return '';
}

// ---------- CONTAINER HELPERS ----------
function valOrPh(el){ if(!el) return 0; const v=el.value; if(v!==''&&v!=null) return +v; return +el.placeholder||0; }
function onContainerChange(){
  const v=document.getElementById('containerType').value;
  document.getElementById('customContainer').style.display = v==='custom'?'grid':'none';
  document.getElementById('autoHint').style.display = v==='auto'?'block':'none';
}
function getContainerCandidates(){
  const type = document.getElementById('containerType').value;
  const mh = +document.getElementById('maxHeight').value;
  const apply = c => { if(mh>0&&mh<c.H) c.H=mh; return c; };
  if(type==='auto') return ['20GP','40GP','40HQ','45HQ'].map(k=>apply({...CONTAINERS[k],key:k}));
  if(type==='custom'){
    const L=valOrPh(document.getElementById('contL'));
    const W=valOrPh(document.getElementById('contW'));
    const H=valOrPh(document.getElementById('contH'));
    return [apply({L,W,H,name:'Custom',maxWeight:Infinity,key:'custom'})];
  }
  return [apply({...CONTAINERS[type],key:type})];
}

// ---------- EXPAND PRODUCTS TO PACKING UNITS ----------
function expandUnits(){
  const units = [];
  products.forEach((p,pIdx)=>{
    const color = PALETTE[pIdx % PALETTE.length];
    const pname = getName(p,pIdx);
    if(p.type==='standard'){
      const L=p.L||60, W=p.W||40, H=p.H||30;
      units.push({
        productIdx:pIdx, productName:pname, subName:pname,
        type:'standard', L, W, H, qty:p.qty,
        uprightOnly:p.uprightOnly, color
      });
    } else if(p.type==='stack'){
      const L=p.L||56, W=p.W||52, H=p.H||82;
      const n = p.perStack||1;
      const nest = p.nestInc||0;
      let sL=L,sW=W,sH=H;
      if(p.stackDir==='H') sH = H + (n-1)*nest;
      if(p.stackDir==='L') sL = L + (n-1)*nest;
      if(p.stackDir==='W') sW = W + (n-1)*nest;
      const stackQty = p.qty!=null ? Math.ceil(p.qty/n) : null;
      units.push({
        productIdx:pIdx, productName:pname,
        subName: n>1 ? `${pname} (${n}/叠)` : pname,
        type:'stack', L:sL, W:sW, H:sH, qty:stackQty,
        uprightOnly:p.uprightOnly, color,
        stackMeta:{ perStack:n, nestInc:nest, dir:p.stackDir, baseL:L, baseW:W, baseH:H, totalPieces:p.qty }
      });
    } else if(p.type==='set'){
      const sets = p.setsQty||1;
      (p.parts||[]).forEach((pt,ptIdx)=>{
        const L=pt.L||90, W=pt.W||85, H=pt.H||40;
        const perSet = pt.qtyPerSet||1;
        units.push({
          productIdx:pIdx, productName:pname,
          subName: `${pname} · ${pt.name||(t('sub')+(ptIdx+1))}`,
          type:'set', L, W, H, qty: perSet*sets,
          uprightOnly:pt.uprightOnly, color,
          partIdx: ptIdx
        });
      });
    }
  });
  return units.filter(u=>u.L>0&&u.W>0&&u.H>0);
}

// ---------- PACKING CORE ----------

// Simple helpers for matrix calculation (max count per unit per container)
function allowedOrients(L,W,H,upOnly){
  if(upOnly) return [[L,W,H],[W,L,H]];
  const set = new Set(); const dims=[L,W,H]; const result=[];
  for(let i=0;i<3;i++) for(let j=0;j<3;j++){
    if(j===i) continue; const k=3-i-j;
    const key=`${dims[i]},${dims[j]},${dims[k]}`;
    if(!set.has(key)){ set.add(key); result.push([dims[i],dims[j],dims[k]]); }
  }
  return result;
}
function simpleBestFit(cx,cy,cz,L,W,H,upOnly){
  const ors = allowedOrients(L,W,H,upOnly);
  if(!ors.length) return {count:0};
  const minDim = Math.min(L,W,H);

  // Level-0: best uniform count for a rectangular space
  function uniMax(sx,sy,sz){
    let best=0;
    for(const [ol,ow,oh] of ors){
      const c=Math.floor(sx/ol)*Math.floor(sy/ow)*Math.floor(sz/oh);
      if(c>best) best=c;
    }
    return best;
  }

  // Level-1: strip-pack (main + 3 uniform remainders)
  function stripMax(sx,sy,sz){
    if(sx<minDim||sy<minDim||sz<minDim) return 0;
    let best=0;
    for(const [ol,ow,oh] of ors){
      const nx=Math.floor(sx/ol),ny=Math.floor(sy/ow),nz=Math.floor(sz/oh);
      if(nx<=0||ny<=0||nz<=0) continue;
      const main=nx*ny*nz;
      const uL=nx*ol,uW=ny*ow,uH=nz*oh;
      const r=(sx-uL>=minDim)?uniMax(sx-uL,sy,sz):0;
      const b=(sy-uW>=minDim)?uniMax(uL,sy-uW,sz):0;
      const t=(sz-uH>=minDim)?uniMax(uL,uW,sz-uH):0;
      if(main+r+b+t>best) best=main+r+b+t;
    }
    return best;
  }

  // Level-2: primary block + each remainder strip uses stripMax
  let bestCount=0, bestPrimary=null;
  for(const [ol,ow,oh] of ors){
    const nx=Math.floor(cx/ol), ny=Math.floor(cy/ow), nz=Math.floor(cz/oh);
    if(nx<=0||ny<=0||nz<=0) continue;
    const main=nx*ny*nz;
    const uL=nx*ol, uW=ny*ow, uH=nz*oh;

    const r = (cx-uL>=minDim) ? stripMax(cx-uL, cy, cz) : 0;
    const b = (cy-uW>=minDim) ? stripMax(uL, cy-uW, cz) : 0;
    const t = (cz-uH>=minDim) ? stripMax(uL, uW, cz-uH) : 0;

    const total=main+r+b+t;
    if(total>bestCount){
      bestCount=total;
      bestPrimary={ol,ow,oh,nx,ny,nz};
    }
  }

  return {
    count: bestCount,
    nx: bestPrimary?bestPrimary.nx:0,
    ny: bestPrimary?bestPrimary.ny:0,
    nz: bestPrimary?bestPrimary.nz:0,
    dims: bestPrimary?[bestPrimary.ol,bestPrimary.ow,bestPrimary.oh]:[L,W,H]
  };
}

// ─── Single-variety placement generator (2-level strip-packing) ─────────────
// Real logistics practice: fill main block, then fill 3 remainder strips,
// each strip itself uses strip-packing (not just uniform fill).
// This captures 2 levels of remainder utilization.
function singleVarietyPlace(cx,cy,cz,unit){
  const ors=allowedOrients(unit.L,unit.W,unit.H,unit.uprightOnly);
  if(!ors.length) return [];
  const minDim=Math.min(unit.L,unit.W,unit.H);
  const limit=isFinite(unit.remaining)?unit.remaining:1e7;

  // Level-0: best uniform fill for a space
  function uniInfo(sx,sy,sz){
    let best=0,bo=null;
    for(const [ol,ow,oh] of ors){
      const nx=Math.floor(sx/ol),ny=Math.floor(sy/ow),nz=Math.floor(sz/oh);
      const c=nx*ny*nz;
      if(c>best){best=c;bo={ol,ow,oh,nx,ny,nz};}
    }
    return bo?{count:best,...bo}:null;
  }

  // Level-1: strip-pack a sub-space (main + 3 uniform remainder strips)
  function stripCount(sx,sy,sz){
    if(sx<minDim||sy<minDim||sz<minDim) return 0;
    let best=0;
    for(const [ol,ow,oh] of ors){
      const nx=Math.floor(sx/ol),ny=Math.floor(sy/ow),nz=Math.floor(sz/oh);
      if(nx<=0||ny<=0||nz<=0) continue;
      const main=nx*ny*nz;
      const uL=nx*ol,uW=ny*ow,uH=nz*oh;
      const rC=(sx-uL>=minDim)?(uniInfo(sx-uL,sy,sz)||{count:0}).count:0;
      const bC=(sy-uW>=minDim)?(uniInfo(uL,sy-uW,sz)||{count:0}).count:0;
      const tC=(sz-uH>=minDim)?(uniInfo(uL,uW,sz-uH)||{count:0}).count:0;
      if(main+rC+bC+tC>best) best=main+rC+bC+tC;
    }
    return best;
  }

  // Level-2: For the primary split, each remainder strip uses stripCount
  let bestTotal=0,bestCfg=null;
  for(const [ol,ow,oh] of ors){
    const nx=Math.floor(cx/ol),ny=Math.floor(cy/ow),nz=Math.floor(cz/oh);
    if(nx<=0||ny<=0||nz<=0) continue;
    const main=nx*ny*nz;
    const uL=nx*ol,uW=ny*ow,uH=nz*oh;
    // Each remainder strip gets strip-packed (1 level of recursion)
    const rC=(cx-uL>=minDim)?stripCount(cx-uL,cy,cz):0;
    const bC=(cy-uW>=minDim)?stripCount(uL,cy-uW,cz):0;
    const tC=(cz-uH>=minDim)?stripCount(uL,uW,cz-uH):0;
    const total=main+rC+bC+tC;
    if(total>bestTotal){
      bestTotal=total;
      bestCfg={ol,ow,oh,nx,ny,nz,uL,uW,uH};
    }
  }
  if(!bestCfg) return [];

  // Generate placements: main block + recursive strip placements
  const placements=[];
  let placed=0;

  function addBlock(info,ox,oy,oz){
    if(!info||placed>=limit) return;
    for(let iz=0;iz<info.nz&&placed<limit;iz++)
      for(let ix=0;ix<info.nx&&placed<limit;ix++)
        for(let iy=0;iy<info.ny&&placed<limit;iy++){
          placements.push({
            x:ox+ix*info.ol, y:oy+iy*info.ow, z:oz+iz*info.oh,
            L:info.ol, W:info.ow, H:info.oh,
            unitIdx:unit.unitIdx, productIdx:unit.productIdx,
            productName:unit.productName||'', name:unit.subName||unit.productName||'',
            color:unit.color||'#888888', type:unit.type||'',
            stackMeta:unit.stackMeta||null,
          });
          placed++;
        }
  }

  // Recursively place strip: find best primary + uniform remainders, generate placements
  function placeStrip(sx,sy,sz,ox,oy,oz){
    if(sx<minDim||sy<minDim||sz<minDim||placed>=limit) return;
    let bestSt=null,bestStTotal=0;
    for(const [sol,sow,soh] of ors){
      const snx=Math.floor(sx/sol),sny=Math.floor(sy/sow),snz=Math.floor(sz/soh);
      if(snx<=0||sny<=0||snz<=0) continue;
      const smain=snx*sny*snz;
      const suL=snx*sol,suW=sny*sow,suH=snz*soh;
      const srI=(sx-suL>=minDim)?uniInfo(sx-suL,sy,sz):null;
      const sbI=(sy-suW>=minDim)?uniInfo(suL,sy-suW,sz):null;
      const stI=(sz-suH>=minDim)?uniInfo(suL,suW,sz-suH):null;
      const total=smain+(srI?srI.count:0)+(sbI?sbI.count:0)+(stI?stI.count:0);
      if(total>bestStTotal){
        bestStTotal=total;
        bestSt={sol,sow,soh,snx,sny,snz,suL,suW,suH,
                rI:srI?{...srI,ox:ox+suL,oy:oy,oz:oz}:null,
                bI:sbI?{...sbI,ox:ox,oy:oy+suW,oz:oz}:null,
                tI:stI?{...stI,ox:ox,oy:oy,oz:oz+suH}:null};
      }
    }
    if(!bestSt) return;
    addBlock({ol:bestSt.sol,ow:bestSt.sow,oh:bestSt.soh,
              nx:bestSt.snx,ny:bestSt.sny,nz:bestSt.snz},ox,oy,oz);
    if(bestSt.rI) addBlock(bestSt.rI, bestSt.rI.ox, bestSt.rI.oy, bestSt.rI.oz);
    if(bestSt.bI) addBlock(bestSt.bI, bestSt.bI.ox, bestSt.bI.oy, bestSt.bI.oz);
    if(bestSt.tI) addBlock(bestSt.tI, bestSt.tI.ox, bestSt.tI.oy, bestSt.tI.oz);
  }

  // Place main block
  addBlock({ol:bestCfg.ol,ow:bestCfg.ow,oh:bestCfg.oh,
            nx:bestCfg.nx,ny:bestCfg.ny,nz:bestCfg.nz},0,0,0);
  // Place remainder strips using strip-packing
  if(cx-bestCfg.uL>=minDim) placeStrip(cx-bestCfg.uL,cy,cz, bestCfg.uL,0,0);
  if(cy-bestCfg.uW>=minDim) placeStrip(bestCfg.uL,cy-bestCfg.uW,cz, 0,bestCfg.uW,0);
  if(cz-bestCfg.uH>=minDim) placeStrip(bestCfg.uL,bestCfg.uW,cz-bestCfg.uH, 0,0,bestCfg.uH);

  return placements;
}

// ─── Height-map for support validation ────────────────────────────────────────
const GRID_RES = 5;
class HeightMap {
  constructor(containerL, containerW){
    this.containerL=containerL; this.containerW=containerW;
    this.nx=Math.ceil(containerL/GRID_RES); this.ny=Math.ceil(containerW/GRID_RES);
    this.grid=[];
    for(let ix=0;ix<this.nx;ix++) this.grid[ix]=new Float32Array(this.ny);
  }
  addBox(x,y,z,L,W,H){
    const topZ=z+H;
    const ix0=Math.floor(x/GRID_RES), iy0=Math.floor(y/GRID_RES);
    const ix1=Math.min(Math.ceil((x+L)/GRID_RES),this.nx);
    const iy1=Math.min(Math.ceil((y+W)/GRID_RES),this.ny);
    for(let ix=ix0;ix<ix1;ix++) for(let iy=iy0;iy<iy1;iy++)
      if(this.grid[ix][iy]<topZ) this.grid[ix][iy]=topZ;
  }
  supportRatio(x,y,z,L,W){
    if(z<=0.01) return 1.0;
    const tol=0.5;
    const ix0=Math.floor(x/GRID_RES), iy0=Math.floor(y/GRID_RES);
    const ix1=Math.min(Math.ceil((x+L)/GRID_RES),this.nx);
    const iy1=Math.min(Math.ceil((y+W)/GRID_RES),this.ny);
    let supported=0, total=0;
    for(let ix=ix0;ix<ix1;ix++) for(let iy=iy0;iy<iy1;iy++){
      total++;
      if(this.grid[ix][iy]>=z-tol) supported++;
    }
    return total===0?0:supported/total;
  }
  maxHeightAt(x,y,L,W){
    const ix0=Math.floor(x/GRID_RES), iy0=Math.floor(y/GRID_RES);
    const ix1=Math.min(Math.ceil((x+L)/GRID_RES),this.nx);
    const iy1=Math.min(Math.ceil((y+W)/GRID_RES),this.ny);
    let maxH=0;
    for(let ix=ix0;ix<ix1;ix++) for(let iy=iy0;iy<iy1;iy++)
      if(this.grid[ix][iy]>maxH) maxH=this.grid[ix][iy];
    return maxH;
  }
}

// ─── Layer-block best-fit helpers ────────────────────────────────────────────
function layerBestFit(unit, spaceL, spaceW, maxH){
  const orients=allowedOrients(unit.L,unit.W,unit.H,unit.uprightOnly);
  let best=null, bestCount=0;
  for(const [oL,oW,oH] of orients){
    if(oH>maxH) continue;
    const nx=Math.floor(spaceL/oL), ny=Math.floor(spaceW/oW);
    if(nx<=0||ny<=0) continue;
    if(nx*ny>bestCount){ bestCount=nx*ny; best={oL,oW,oH,nx,ny}; }
  }
  return best;
}

function sortUnits(units){
  return units.slice().sort((a,b)=>{
    const wa=a.weight||0, wb=b.weight||0;
    if(wb!==wa) return wb-wa;
    const va=a.L*a.W*a.H, vb=b.L*b.W*b.H;
    if(vb!==va) return vb-va;
    return (a.unitIdx||0)-(b.unitIdx||0);
  });
}

// ─── Main packing: SKU-driven wall-building (人工装柜逻辑) ─────────────────
// Rules enforced:
//   1. 柜尾→柜门 (x=0 → x=CL), 下→上 (z=0 → z=CH), 大→小
//   2. 一层未铺满80%宽度 → 禁止上层放箱
//   3. 同SKU连续装，形成整面墙
//   4. 大箱/重箱优先底部
//   5. 上层支撑面 ≥75%
//   6. 禁止单箱补洞 (≥2箱连续)
//   7. 优先规则矩形排布 (整行整列)
// ──────────────────────────────────────────────────────────────────────────────
function packContainer(container, units){
  const CL=container.L, CW=container.W, CH=container.H;
  const containerVolume=CL*CW*CH;

  // ── Single-variety fast path: use dedicated strip-packing ──
  if(units.length===1){
    const u0=units[0];
    const totalQty=(u0.qty===null||u0.qty===undefined)?Infinity:u0.qty;
    const svPlacements=singleVarietyPlace(CL,CW,CH,{
      ...u0,
      unitIdx: u0.unitIdx!==undefined?u0.unitIdx:0,
      remaining: totalQty
    });
    return { placements:svPlacements, steps:generateSteps(svPlacements) };
  }
  // Multiple units with same dimensions: use strip packing then distribute spatially
  const distinctDims=new Set(units.map(u=>`${Math.round(u.L*10)},${Math.round(u.W*10)},${Math.round(u.H*10)},${!!u.uprightOnly}`));
  if(distinctDims.size===1){
    const u0=units[0];
    const totalQty=units.reduce((s,u)=>{
      const q=(u.qty===null||u.qty===undefined)?Infinity:u.qty;
      return isFinite(s)&&isFinite(q)?s+q:Infinity;
    },0);
    const svPlacements=singleVarietyPlace(CL,CW,CH,{
      ...u0, unitIdx:0, remaining:totalQty
    });
    // Distribute placements across units in spatial order (each unit gets a contiguous wall section)
    svPlacements.sort((a,b)=>Math.abs(a.x-b.x)>1?a.x-b.x:Math.abs(a.z-b.z)>1?a.z-b.z:a.y-b.y);
    const quotas=units.map(u=>{
      const q=(u.qty===null||u.qty===undefined)?Infinity:u.qty;
      return isFinite(q)?q:null;
    });
    const hasFinite=quotas.some(q=>q!==null);
    let idx=0;
    for(let ui=0;ui<units.length&&idx<svPlacements.length;ui++){
      const u=units[ui];
      const quota=quotas[ui];
      const remaining=svPlacements.length-idx;
      const unitsLeft=units.length-ui;
      const n=quota!==null?Math.min(quota,remaining):
              (hasFinite?remaining:Math.ceil(remaining/unitsLeft));
      for(let i=0;i<n&&idx<svPlacements.length;i++,idx++){
        const p=svPlacements[idx];
        p.unitIdx=u.unitIdx!==undefined?u.unitIdx:ui;
        p.productIdx=u.productIdx!==undefined?u.productIdx:ui;
        p.productName=u.productName||'';
        p.name=u.subName||u.productName||'';
        p.color=u.color||'#888888';
        p.type=u.type||'';
        p.stackMeta=u.stackMeta||null;
      }
    }
    return { placements:svPlacements, steps:generateSteps(svPlacements) };
  }

  // ── Multi-variety: SKU-driven wall-building (人工装柜逻辑) ──
  // Outer loop iterates SKUs (not spaces).
  // Each SKU builds contiguous walls before the next SKU starts.

  const workUnits=units.map((u,i)=>({
    ...u,
    unitIdx: u.unitIdx!==undefined?u.unitIdx:i,
    remaining:(u.qty===null||u.qty===undefined)?Infinity:u.qty,
    volume:u.L*u.W*u.H,
    weight:u.weight||0,
    uprightOnly:!!u.uprightOnly,
  }));

  const finiteUnits=workUnits.filter(u=>isFinite(u.remaining));
  const infiniteUnits=workUnits.filter(u=>!isFinite(u.remaining));

  // For unlimited SKUs: give generous remaining (full container capacity).
  // Phase 1 X-range limit is controlled by maxX per SKU, not remaining count.
  // remaining only serves as a safety counter for Phase 2/3 gap-filling.
  if(infiniteUnits.length>0){
    for(const u of infiniteUnits){
      const orients=allowedOrients(u.L,u.W,u.H,u.uprightOnly);
      let maxFit=0;
      for(const [oL,oW,oH] of orients){
        const nx=Math.floor(CL/oL), ny=Math.floor(CW/oW), nz=Math.floor(CH/oH);
        if(nx>0&&ny>=1&&nz>=1) maxFit=Math.max(maxFit, nx*ny*nz);
      }
      u.remaining=Math.max(10, maxFit);
    }
  }

  // Calculate X-range allocation for Phase 1 (per-SKU wall territory).
  // Real practice: supervisor divides container length among products.
  // Finite-qty SKUs get estimated X, unlimited split the remainder equally.
  let phase1XRanges={};
  {
    let finiteXEst=0;
    for(const u of finiteUnits){
      const orients=allowedOrients(u.L,u.W,u.H,u.uprightOnly);
      let bestPerCol=1, bestOL=u.L;
      for(const [oL,oW,oH] of orients){
        const ny=Math.floor(CW/oW), nz=Math.floor(CH/oH);
        if(ny>=2&&nz>=1&&ny*nz>bestPerCol){bestPerCol=ny*nz;bestOL=oL;}
      }
      const xNeeded=Math.ceil(u.remaining/bestPerCol)*bestOL;
      phase1XRanges[u.unitIdx]=xNeeded;
      finiteXEst+=xNeeded;
    }
    const remainingX=Math.max(0, CL-finiteXEst);
    const infShare=infiniteUnits.length>0 ? remainingX/infiniteUnits.length : 0;
    for(const u of infiniteUnits){
      phase1XRanges[u.unitIdx]=Math.max(infShare, CL/workUnits.length);
    }
  }

  // Sort: heavy first → large first (大箱/重箱优先底部)
  const skuOrder=[...finiteUnits,...infiniteUnits].sort((a,b)=>{
    const wa=a.weight||0, wb=b.weight||0;
    if(Math.abs(wb-wa)>0.01) return wb-wa;
    return b.volume-a.volume;
  });

  const heightMap=new HeightMap(CL,CW);
  // Per-SKU heightMaps: collision check queries OTHER SKUs only,
  // automatically ignoring same-SKU grid boundary contamination.
  const skuHMs={};
  for(const sku of skuOrder) skuHMs[sku.unitIdx]=new HeightMap(CL,CW);
  // Helper: max height from all SKUs EXCEPT the given one
  function otherSkuMaxH(excludeIdx, x, y, L, W){
    let maxH=0;
    for(const [idx,hm] of Object.entries(skuHMs)){
      if(+idx===excludeIdx) continue;
      const h=hm.maxHeightAt(x,y,L,W);
      if(h>maxH) maxH=h;
    }
    return maxH;
  }
  const placements=[];

  // Choose best orientation for wall-building:
  // maximize width coverage (≥80% required), then height, then total count
  function chooseBestWallOrient(sku, availH){
    const orients=allowedOrients(sku.L,sku.W,sku.H,sku.uprightOnly);
    let best=null, bestScore=-1;
    for(const [oL,oW,oH] of orients){
      if(oH>availH) continue;
      const ny=Math.floor(CW/oW);
      const nz=Math.floor(availH/oH);
      if(ny<2||nz<1) continue; // ≥2 boxes per layer required
      const widthFill=(ny*oW)/CW;
      const heightFill=(nz*oH)/availH;
      let score=0;
      score+= widthFill>=0.80 ? 10000 : widthFill*5000;
      score+= heightFill*3000;
      score+= ny*nz*10;
      score+= widthFill*heightFill*2000;
      if(score>bestScore){ bestScore=score; best={oL,oW,oH,ny,nz}; }
    }
    return best;
  }

  // ── Phase 1: SKU-driven primary wall building ──
  // Each SKU fills entire cross-section walls from back (x=0) toward door
  // Shared wall frontier: each SKU starts where the previous one left off
  // This prevents gaps between SKU walls (人工装柜: adjacent walls, no gaps)
  let globalSearchX=0;

  for(const sku of skuOrder){
    if(sku.remaining<2) continue;

    const orient=chooseBestWallOrient(sku, CH);
    if(!orient) continue;
    const {oL,oW,oH,ny}=orient;

    // Start from shared wall frontier, not 0
    let searchX=globalSearchX;
    const skuStartX=searchX;
    // Last SKU extends to container door (CL) — fill remaining space completely
    const isLastSku=(sku===skuOrder[skuOrder.length-1]);
    const skuMaxX=isLastSku ? CL : skuStartX+(phase1XRanges[sku.unitIdx]||CL);

    while(sku.remaining>=2 && searchX+oL<=CL+0.01 && searchX<skuMaxX+0.01){
      // Find next valid X position where ≥2 boxes can be placed.
      // Use FULL heightMap check (detects real obstacles from other SKUs).
      let wallX=-1;
      // Scan at GRID_RES (5cm) steps for tight wall placement (no big gaps)
      for(let x=searchX; x+oL<=CL+0.01; x+=GRID_RES){
        let canPlace=0;
        for(let iy=0;iy<ny;iy++){
          const py=iy*oW;
          const baseZ=heightMap.maxHeightAt(x,py,oL,oW);
          if(baseZ+oH>CH+0.01) continue;
          if(baseZ>0.01 && heightMap.supportRatio(x,py,baseZ,oL,oW)<0.75) continue;
          canPlace++;
        }
        if(canPlace>=2){ wallX=x; break; }
      }
      if(wallX<0) break;

      // Build wall: multiple X columns, each column stacks layers bottom-up
      let totalPlacedInWall=0, colsUsed=0;
      let wallBaseZ=-1; // Base height for first column; reused for consecutive columns

      for(let ix=0; wallX+ix*oL+oL<=CL+0.01 && wallX+ix*oL<skuMaxX+0.01 && sku.remaining>=2; ix++){
        const colX=wallX+ix*oL;
        let placedInCol=0, prevLayerCount=0;

        // Determine base height for this column.
        // ix=0: use heightBins (global heightMap) to find most common surface height.
        // ix>0: reuse wallBaseZ for consistent wall height (人工装柜 stability).
        let baseZ;
        if(ix===0){
          const heightBins={};
          for(let iy=0;iy<ny;iy++){
            const h=Math.round(heightMap.maxHeightAt(colX,iy*oW,oL,oW)*10)/10;
            heightBins[h]=(heightBins[h]||0)+1;
          }
          baseZ=0; let baseCount=0;
          for(const [h,cnt] of Object.entries(heightBins)){
            if(cnt>baseCount||(cnt===baseCount&&+h<baseZ)){
              baseZ=+h; baseCount=cnt;
            }
          }
          wallBaseZ=baseZ;
        } else {
          baseZ=wallBaseZ;
        }

        // Build layers from baseZ upward
        for(let iz=0; baseZ+iz*oH+oH<=CH+0.01 && sku.remaining>=2; iz++){
          const layerZ=baseZ+iz*oH;

          // 80% rule: previous layer must be ≥80% filled before adding upper layer
          if(iz>0 && prevLayerCount/ny<0.80) break;

          // Collect valid Y positions for this layer
          const layerBoxes=[];
          for(let iy=0;iy<ny;iy++){
            const py=iy*oW;

            // Collision check using per-SKU heightMaps:
            // ix=0: use global heightMap (no same-SKU predecessor to contaminate)
            // ix>0: check OTHER SKUs only (ignores same-SKU grid boundary contamination)
            if(ix===0){
              const actualH=heightMap.maxHeightAt(colX,py,oL,oW);
              if(actualH>layerZ+1) continue;
            } else {
              const otherH=otherSkuMaxH(sku.unitIdx,colX,py,oL,oW);
              if(otherH>layerZ+1) continue;
            }

            if(layerZ+oH>CH+0.01) continue;

            // Support check (≥75%)
            if(layerZ>0.01){
              const support=heightMap.supportRatio(colX,py,layerZ,oL,oW);
              if(support<0.75) continue;
            }

            layerBoxes.push({x:colX, y:py, z:layerZ});
          }

          // ≥2 box rule: no single-box placement
          if(layerBoxes.length<2) break;

          // 80% rule for current layer
          if(iz>0 && layerBoxes.length/ny<0.80) break;

          // Place boxes in this layer
          const toPlace=Math.min(layerBoxes.length, sku.remaining);
          for(let bi=0;bi<toPlace;bi++){
            const pos=layerBoxes[bi];
            placements.push({
              x:pos.x, y:pos.y, z:pos.z, L:oL, W:oW, H:oH,
              unitIdx:sku.unitIdx, productIdx:sku.productIdx,
              productName:sku.productName||'', name:sku.subName||sku.productName||'',
              color:sku.color||'#888888', type:sku.type||'',
              stackMeta:sku.stackMeta||null,
            });
            heightMap.addBox(pos.x,pos.y,pos.z,oL,oW,oH);
            skuHMs[sku.unitIdx].addBox(pos.x,pos.y,pos.z,oL,oW,oH);
            sku.remaining--;
            placedInCol++;
            totalPlacedInWall++;
          }

          prevLayerCount=layerBoxes.length;
        }

        if(placedInCol>0) colsUsed++;
        else break; // can't extend wall further in X
      }

      if(totalPlacedInWall===0){
        searchX+=GRID_RES; // skip this position
      } else {
        searchX=wallX+colsUsed*oL;
        // Update shared frontier so next SKU starts adjacent
        globalSearchX=Math.max(globalSearchX, searchX);
      }
    }
  }

  // Re-allocate unlimited SKUs for Phase 2/3: generous remaining so
  // top-fill and gap-fill can pack every remaining space.
  // Estimate remaining capacity from heightMap to avoid over-allocating.
  for(const sku of skuOrder){
    const isUnlimited = (sku.qty===null || sku.qty===undefined);
    if(isUnlimited && sku.remaining<=5){
      const orients=allowedOrients(sku.L,sku.W,sku.H,sku.uprightOnly);
      let maxFit=0;
      for(const [oL,oW,oH] of orients){
        const nx=Math.floor(CL/oL), ny=Math.floor(CW/oW), nz=Math.floor(CH/oH);
        if(nx>0&&ny>0&&nz>0) maxFit=Math.max(maxFit, nx*ny*nz);
      }
      // 40% of full container — generous enough for gap-filling
      sku.remaining=Math.max(20, Math.ceil(maxFit*0.4));
    }
  }

  // ── Phase 2: Layer-based top-fill ──
  // Place full/partial layers on top of Phase 1 walls.
  // Relaxed rules: ≥2 boxes, ≥50% width, height tolerance ±5cm.
  // Real practice: workers stack boxes on existing walls wherever there's support.
  let phase2Changed=true;
  let phase2Passes=0;
  while(phase2Changed && phase2Passes<20){
    phase2Changed=false;
    phase2Passes++;

    for(const sku of skuOrder){
      if(sku.remaining<2) continue;
      const orients=allowedOrients(sku.L,sku.W,sku.H,sku.uprightOnly);

      for(const [oL,oW,oH] of orients){
        if(sku.remaining<2) break;
        const ny=Math.floor(CW/oW);
        if(ny<2) continue;

        for(let x=0; x+oL<=CL+0.01 && sku.remaining>=2; x+=GRID_RES){
          // Find valid positions across width at this X
          const layerBoxes=[];
          for(let iy=0;iy<ny;iy++){
            const py=iy*oW;
            const baseZ=heightMap.maxHeightAt(x,py,oL,oW);
            if(baseZ+oH>CH+0.01) continue;
            if(baseZ>0.01){
              const support=heightMap.supportRatio(x,py,baseZ,oL,oW);
              if(support<0.70) continue;
            }
            layerBoxes.push({x, y:py, z:baseZ});
          }

          if(layerBoxes.length<2) continue;
          // 50% width rule (relaxed from 80% — allows partial layers on uneven surfaces)
          if(layerBoxes.length/ny<0.50) continue;

          // Group by similar height (±5cm tolerance for uneven walls)
          const heightGroups={};
          for(const b of layerBoxes){
            const hKey=Math.round(b.z/5)*5; // 5cm bins
            if(!heightGroups[hKey]) heightGroups[hKey]=[];
            heightGroups[hKey].push(b);
          }
          // Place the largest consistent group
          const groups=Object.values(heightGroups).sort((a,b)=>b.length-a.length);
          for(const group of groups){
            if(group.length<2) continue;
            const toPlace=Math.min(group.length, sku.remaining);
            for(let bi=0;bi<toPlace;bi++){
              const pos=group[bi];
              placements.push({
                x:pos.x, y:pos.y, z:pos.z, L:oL, W:oW, H:oH,
                unitIdx:sku.unitIdx, productIdx:sku.productIdx,
                productName:sku.productName||'', name:sku.subName||sku.productName||'',
                color:sku.color||'#888888', type:sku.type||'',
                stackMeta:sku.stackMeta||null,
              });
              heightMap.addBox(pos.x,pos.y,pos.z,oL,oW,oH);
              if(skuHMs[sku.unitIdx]) skuHMs[sku.unitIdx].addBox(pos.x,pos.y,pos.z,oL,oW,oH);
              sku.remaining--;
              phase2Changed=true;
            }
            break; // only place the best group per X position per pass
          }
        }
      }
    }
  }

  // ── Phase 3: Aggressive gap-fill (补空隙) ──
  // Real warehouse practice: after main walls and layers, workers fill any
  // remaining gaps with individual boxes. No minimum count, no width rule.
  // Only requirement: ≥70% support and fits within container.
  // Tries all orientations to find boxes that fit into remaining spaces.
  let phase3Changed=true;
  let phase3Passes=0;
  while(phase3Changed && phase3Passes<10){
    phase3Changed=false;
    phase3Passes++;

    for(const sku of skuOrder){
      if(sku.remaining<=0) continue;
      const orients=allowedOrients(sku.L,sku.W,sku.H,sku.uprightOnly);

      for(const [oL,oW,oH] of orients){
        if(sku.remaining<=0) break;

        for(let gx=0; gx+oL<=CL+0.01 && sku.remaining>0; gx+=GRID_RES){
          for(let gy=0; gy+oW<=CW+0.01 && sku.remaining>0; gy+=GRID_RES){
            const baseZ=heightMap.maxHeightAt(gx,gy,oL,oW);
            if(baseZ+oH>CH+0.01) continue;
            if(baseZ>0.01 && heightMap.supportRatio(gx,gy,baseZ,oL,oW)<0.70) continue;

            placements.push({
              x:gx, y:gy, z:baseZ, L:oL, W:oW, H:oH,
              unitIdx:sku.unitIdx, productIdx:sku.productIdx,
              productName:sku.productName||'', name:sku.subName||sku.productName||'',
              color:sku.color||'#888888', type:sku.type||'',
              stackMeta:sku.stackMeta||null,
            });
            heightMap.addBox(gx,gy,baseZ,oL,oW,oH);
            if(skuHMs[sku.unitIdx]) skuHMs[sku.unitIdx].addBox(gx,gy,baseZ,oL,oW,oH);
            sku.remaining--;
            phase3Changed=true;
          }
        }
      }
    }
  }

  return { placements, steps: generateSteps(placements) };
}

// ─── Step generation: worker-friendly instructions ───────────────────────────
// Groups placements by SKU (same SKU = one step), ordered by loading sequence.
// Format: "底层起装 [产品名] [列]×[排]×[层] (N箱)"
function generateSteps(placements){
  if(!placements.length) return [];

  // Group all placements by SKU (unitIdx), maintaining loading order
  // Loading order = by the FIRST occurrence of each SKU (back→front, bottom→up)
  const skuFirstX={};
  for(const p of placements){
    if(!(p.unitIdx in skuFirstX)) skuFirstX[p.unitIdx]=p.x;
    else skuFirstX[p.unitIdx]=Math.min(skuFirstX[p.unitIdx], p.x);
  }

  // Get unique SKU order (by their starting X position, then Z)
  const skuOrder=[...new Set(placements.map(p=>p.unitIdx))];
  skuOrder.sort((a,b)=>{
    const xa=skuFirstX[a]||0, xb=skuFirstX[b]||0;
    return xa-xb;
  });

  const steps=[];
  let stepNum=0;

  for(const unitIdx of skuOrder){
    const group=placements.filter(p=>p.unitIdx===unitIdx);
    if(!group.length) continue;

    const count=group.length;
    const name=group[0].productName||group[0].name||`Unit${unitIdx}`;

    // Analyse grid dimensions (loop-based to avoid stack overflow with large arrays)
    const xSet=new Set(), ySet=new Set(), zSet=new Set();
    let minX=Infinity, maxX=-Infinity, minZ=Infinity, maxZ=-Infinity;
    for(const p of group){
      xSet.add(Math.round(p.x*10));
      ySet.add(Math.round(p.y*10));
      zSet.add(Math.round(p.z*10));
      if(p.x<minX) minX=p.x;
      if(p.x+p.L>maxX) maxX=p.x+p.L;
      if(p.z<minZ) minZ=p.z;
      if(p.z+p.H>maxZ) maxZ=p.z+p.H;
    }

    const cols=xSet.size;
    const rows=ySet.size;
    const layers=zSet.size;

    stepNum++;
    const layerLabel=minZ<1?'底层起':`从高${Math.round(minZ)}cm起`;
    const posLabel=`X:${Math.round(minX)}-${Math.round(maxX)}cm`;
    const hLabel=layers>1?` (高度${Math.round(minZ)}-${Math.round(maxZ)}cm)`:'';

    steps.push({
      step:stepNum,
      instruction:`${layerLabel}装 ${name} ${cols}列×${rows}排×${layers}层 (${count}箱)`,
      detail:`${posLabel}${hLabel}, 摆放方向 ${group[0].L}×${group[0].W}×${group[0].H}cm`,
      unitIdx, count, nx:cols, ny:rows, nz:layers,
      orientation:`${group[0].L}x${group[0].W}x${group[0].H}`,
      color: group[0].color||'#888',
    });
  }

  return steps;
}

// ─── Scoring function ────────────────────────────────────────────────────────
function scorePackingResult(container, placements, steps){
  const containerVol=container.L*container.W*container.H;
  let usedVol=0;
  for(const p of placements) usedVol+=p.L*p.W*p.H;
  const utilization=containerVol>0?usedVol/containerVol:0;

  let skuSwitches=0;
  for(let i=1;i<steps.length;i++) if(steps[i].unitIdx!==steps[i-1].unitIdx) skuSwitches++;
  const stepPenalty=Math.min(steps.length/20,1);
  const switchPenalty=Math.min(skuSwitches/10,1);
  const avgBlockSize=steps.length>0?steps.reduce((s,st)=>s+st.count,0)/steps.length:0;
  const blockRegularity=Math.min(avgBlockSize/10,1);
  const simplicity=Math.max(0,1-stepPenalty*0.4-switchPenalty*0.3)*0.5+blockRegularity*0.5;

  let bottomArea=0, heavyAtBottom=0, totalWeight=0;
  const maxZ=placements.reduce((m,p)=>Math.max(m,p.z+p.H),0);
  for(const p of placements){
    if(p.z<1) bottomArea+=p.L*p.W;
    const w=p.stackMeta?.weight||0;
    totalWeight+=w;
    if(w>0&&maxZ>0) heavyAtBottom+=w*(1-p.z/maxZ);
  }
  const floorCoverage=Math.min(bottomArea/(container.L*container.W),1);
  const weightDist=totalWeight>0?heavyAtBottom/totalWeight:1;
  const stability=floorCoverage*0.6+weightDist*0.4;

  const score=utilization*0.5+simplicity*0.3+stability*0.2;
  return {score,utilization,simplicity,stability};
}

// ─── Backward-compatible wrapper ─────────────────────────────────────────────
function packMixedShelf(container, units){
  const result=packContainer(container, units);
  packMixedShelf._lastSteps=result.steps;
  return result.placements;
}

function simulateKnown(units){
  const containerType = document.getElementById('containerType').value;
  const mh = +document.getElementById('maxHeight').value;
  const containersUsed = [];
  const targets = units.map(u=>({ ...u, remaining: u.qty }));

  let availableKeys;
  if(containerType==='auto') availableKeys = ['20GP','40GP','40HQ','45HQ'];
  else if(containerType==='custom'){
    const L=valOrPh(document.getElementById('contL'));
    const W=valOrPh(document.getElementById('contW'));
    const H=valOrPh(document.getElementById('contH'));
    return simulateKnownSingle({L,W,H,name:'Custom',key:'custom',maxWeight:Infinity}, targets);
  } else {
    const c = {...CONTAINERS[containerType], key:containerType};
    if(mh>0&&mh<c.H) c.H=mh;
    return simulateKnownSingle(c, targets);
  }

  const byKey = {};
  availableKeys.forEach(k=>{
    const c = {...CONTAINERS[k], key:k};
    if(mh>0&&mh<c.H) c.H=mh;
    byKey[k] = c;
  });

  let safety = 100;
  const hasFiniteRemaining = () => targets.some(t=>!t.isUnlimited && t.remaining>0);
  while(hasFiniteRemaining() && safety-->0){
    const activeUnits = targets.filter(t=>t.remaining>0)
      .map(t=>({...t, unitIdx: t.__unitIdx, qty: t.remaining}));
    let picked = null;
    for(const k of ['20GP','40GP','40HQ','45HQ']){
      const c = byKey[k];
      const pr = packContainer(c, activeUnits);
      const counts = {};
      pr.placements.forEach(p=>{ counts[p.unitIdx]=(counts[p.unitIdx]||0)+1; });
      const fitsAll = activeUnits.every(u=> (counts[u.unitIdx]||0) >= u.remaining);
      if(fitsAll){
        picked = { container:c, placements:pr.placements, steps:pr.steps, counts };
        break;
      }
    }
    if(!picked){
      const c = byKey['45HQ'];
      const pr = packContainer(c, activeUnits);
      const counts = {};
      pr.placements.forEach(p=>{ counts[p.unitIdx]=(counts[p.unitIdx]||0)+1; });
      picked = { container:c, placements:pr.placements, steps:pr.steps, counts };
    }
    if(picked.placements.length===0) break;
    Object.keys(picked.counts).forEach(k=>{
      const tg = targets.find(t=>t.__unitIdx===+k);
      if(tg) tg.remaining -= picked.counts[k];
    });
    const vol = picked.placements.reduce((s,p)=>s+p.L*p.W*p.H,0);
    picked.volume = vol;
    picked.fillRate = vol/(picked.container.L*picked.container.W*picked.container.H);
    containersUsed.push(picked);
  }
  return containersUsed;
}

function simulateKnownSingle(container, targets){
  const used = [];
  let safety = 100;
  const hasFiniteRemaining = () => targets.some(t=>!t.isUnlimited && t.remaining>0);
  while(hasFiniteRemaining() && safety-->0){
    const activeUnits = targets.filter(t=>t.remaining>0)
      .map(t=>({...t, unitIdx: t.__unitIdx, qty: t.remaining}));
    const pr = packContainer(container, activeUnits);
    const counts = {};
    pr.placements.forEach(p=>{ counts[p.unitIdx]=(counts[p.unitIdx]||0)+1; });
    if(pr.placements.length===0) break;
    Object.keys(counts).forEach(k=>{
      const tg = targets.find(t=>t.__unitIdx===+k);
      if(tg) tg.remaining -= counts[k];
    });
    const vol = pr.placements.reduce((s,p)=>s+p.L*p.W*p.H,0);
    used.push({
      container, placements:pr.placements, steps:pr.steps, counts,
      volume: vol,
      fillRate: vol/(container.L*container.W*container.H)
    });
  }
  return used;
}

// ---------- OPTIMIZE ----------
function runOptimize(){
  const units = expandUnits();
  if(!units.length){ alert('请添加外箱 / Please add cartons'); return; }
  units.forEach((u,idx)=>{ u.unitIdx = idx; u.__unitIdx = idx; });

  const anyQty = units.some(u=>u.qty!=null && u.qty>0);

  selectedContainerIdx = 0;

  if(anyQty){
    const packedUnits = units.map(u=>({
      ...u,
      qty: (u.qty!=null && u.qty>0) ? u.qty : 99999,
      isUnlimited: !(u.qty!=null && u.qty>0)
    }));
    const containersUsed = simulateKnown(packedUnits);
    const totalCounts = {};
    containersUsed.forEach(cu=>{
      Object.keys(cu.counts).forEach(k=>{ totalCounts[k]=(totalCounts[k]||0)+cu.counts[k]; });
    });
    const totalVol = containersUsed.reduce((s,c)=>s+c.volume,0);
    const totalCap = containersUsed.reduce((s,c)=>s+c.container.L*c.container.W*c.container.H,0);
    const result = {
      mode:'known', units: packedUnits, containersUsed,
      containersNeeded: containersUsed.length,
      totalCounts,
      avgFillRate: totalCap>0 ? totalVol/totalCap : 0
    };
    lastResult = result;
    renderResultsKnown(result);
    if(containersUsed.length) render3DContainer(containersUsed[0]);
  } else {
    const cands = getContainerCandidates();
    const byContainer = cands.map(c=>{
      const perUnit = units.map(u=>{
        const f = simpleBestFit(c.L,c.W,c.H,u.L,u.W,u.H,u.uprightOnly);
        return { unit:u, count: f.count };
      });
      const mixUnits = units.map(u=>({...u, qty:null}));
      const packResult = packContainer(c, mixUnits);
      const placements = packResult.placements;
      const steps = packResult.steps;
      const counts = {};
      placements.forEach(p=>{ counts[p.unitIdx]=(counts[p.unitIdx]||0)+1; });
      const vol = placements.reduce((s,p)=>s+p.L*p.W*p.H,0);
      const scoring = scorePackingResult(c, placements, steps);
      return { container:c, perUnit, placements, steps, counts,
               mixTotal: Object.values(counts).reduce((s,v)=>s+v,0),
               fillRate: vol/(c.L*c.W*c.H), scoring };
    });
    byContainer.sort((a,b)=> b.scoring.score - a.scoring.score);
    const result = {
      mode:'max', units, byContainer,
      best: byContainer[0]
    };
    lastResult = result;
    renderResultsMax(result);
    render3DContainer(byContainer[0]);
  }
}

// ---------- RESULT RENDERING ----------
function fmt(n,d){ return (n==null||!isFinite(n))?'-':n.toLocaleString(undefined,{maximumFractionDigits:d??0}); }
function pct(n){ return (n*100).toFixed(1)+'%'; }
function getTargetRate(){ const v=+document.getElementById('targetRate').value; return (v>0&&v<=100)?v/100:null; }
function rateClass(r){ const tg=getTargetRate(); if(tg==null) return ''; return r>=tg?'good':'warn'; }
function rateBadge(r){ const tg=getTargetRate(); if(tg==null) return pct(r);
  return `${pct(r)} ${r>=tg?'✓':'⚠'} (${t('target')} ${(tg*100).toFixed(0)}%)`; }

function summarizeMix(containersUsed){
  const counts={};
  containersUsed.forEach(c=>{ counts[c.container.name]=(counts[c.container.name]||0)+1; });
  return Object.keys(counts).map(k=>`${counts[k]}×${k}`).join(' + ');
}

function renderLegend(units){
  const byProd = {};
  units.forEach(u=>{
    if(!byProd[u.productIdx]){
      byProd[u.productIdx] = { name: u.productName, color: u.color, type: u.type, units: [] };
    }
    byProd[u.productIdx].units.push(u);
  });
  let html = `<div class="result-box"><h4>🎨 ${LANG==='zh'?'图例':'Legend'}</h4>`;
  Object.values(byProd).forEach(g=>{
    const typeName = g.type==='standard'?t('typeStd'):g.type==='stack'?t('typeStk'):t('typeSet');
    html += `<div class="legend-item">
      <div class="legend-swatch" style="background:${g.color}"></div>
      <div><strong>${g.name}</strong>
        <span style="color:#8b95a8;font-size:11px">[${typeName}]</span>
        <div style="color:#8b95a8;font-size:11px">
          ${g.units.map(u=>{
            const dims = `${u.L}×${u.W}×${u.H}cm`;
            if(u.type==='stack' && u.stackMeta){
              return `${u.subName}: ${dims} (${t('stackedDim')})`;
            }
            return `${u.subName}: ${dims}`;
          }).join('<br>')}
        </div>
      </div>
    </div>`;
  });
  html += `</div>`;
  return html;
}

function renderSteps(steps){
  if(!steps||!steps.length) return '';
  let html = `<div class="result-box"><h4>📋 ${LANG==='zh'?'装柜步骤':'Loading Steps'}</h4>
    <div class="steps-list">`;
  steps.forEach(s=>{
    html += `<div class="step-item">
      <span class="step-num">${s.step}</span>
      <div class="step-body">
        <div class="step-instr">${s.instruction}</div>
        <div class="step-detail">${s.orientation} · ${s.count}${LANG==='zh'?'箱':'box'}</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function renderResultsKnown(r){
  const box = document.getElementById('results');
  const mixSummary = summarizeMix(r.containersUsed);
  let html = '';
  html += `<div class="result-box">
    <h4>🏆 ${t('bestPlan')} <span class="tag">${t('knownMode')}</span></h4>
    <div class="result-row good"><span>${t('containersNeeded')}</span>
      <span class="val">${fmt(r.containersNeeded)}柜 · ${mixSummary}</span></div>
    <div class="result-row ${rateClass(r.avgFillRate)}"><span>${t('avgFill')}</span>
      <span class="val">${rateBadge(r.avgFillRate)}</span></div>
    <div class="progress"><div class="progress-bar" style="width:${Math.min(100,r.avgFillRate*100)}%"></div></div>
  </div>`;
  html += `<div class="result-box"><h4>🚚 ${t('perContainerPlan')}</h4>
    <div class="hint" style="margin-bottom:6px">${t('clickToView')}</div>`;
  r.containersUsed.forEach((cu,i)=>{
    const sel = i===selectedContainerIdx;
    const total = Object.values(cu.counts).reduce((s,v)=>s+v,0);
    html += `<div class="container-card ${sel?'selected':''}" onclick="selectContainer(${i})">
      <div class="result-row" style="font-weight:600">
        <span>${LANG==='zh'?t('first')+(i+1)+t('secContainer'):t('first')+(i+1)} · ${cu.container.name}</span>
        <span class="val">${fmt(total)} ${LANG==='zh'?'箱':'boxes'}</span>
      </div>
      <div class="result-row"><span>${t('utilisation')}</span><span class="val">${pct(cu.fillRate)}</span></div>
      <div style="margin-top:4px;line-height:1.7">`;
    Object.keys(cu.counts).forEach(k=>{
      const unit = r.units[+k];
      if(!unit) return;
      html += `<span style="display:inline-block;margin-right:8px;font-size:11px">
        <span class="legend-swatch" style="display:inline-block;width:9px;height:9px;background:${unit.color};border-radius:2px;margin-right:3px;vertical-align:middle"></span>${unit.subName}: <strong>${cu.counts[k]}</strong></span>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;
  // Loading steps for selected container
  const selCu = r.containersUsed[selectedContainerIdx];
  if(selCu && selCu.steps) html += renderSteps(selCu.steps);
  html += `<div class="result-box"><h4>📦 ${t('byProduct')}</h4>`;
  r.units.forEach((u,idx)=>{
    const total = r.totalCounts[idx] || 0;
    const isUnlimited = u.isUnlimited;
    const target = isUnlimited ? null : u.qty;
    const done = !isUnlimited && total >= (target||0);
    let extra = '';
    if(u.type==='stack' && u.stackMeta){
      const pieces = total * u.stackMeta.perStack;
      const pieceTarget = u.stackMeta.totalPieces;
      const pieceTargetStr = pieceTarget && !isUnlimited ? ' / '+fmt(pieceTarget) : '';
      extra = ` (${fmt(pieces)} ${LANG==='zh'?'件':'pcs'}${pieceTargetStr})`;
    }
    const valStr = isUnlimited
      ? `${fmt(total)} ${LANG==='zh'?'(填充剩余空间)':'(fill remaining)'}`
      : `${fmt(total)} / ${fmt(target)} ${done?'✓':''}`;
    html += `<div class="result-row">
      <span><span class="legend-swatch" style="display:inline-block;width:10px;height:10px;background:${u.color};border-radius:2px;margin-right:5px"></span>${u.subName}</span>
      <span class="val ${done?'good':''}">${valStr}${extra}</span></div>`;
  });
  html += `</div>`;
  box.innerHTML = html + renderLegend(r.units);
}

function renderResultsMax(r){
  const box = document.getElementById('results');
  const best = r.best;
  let html = '';
  html += `<div class="result-box">
    <h4>🏆 ${t('bestPlan')} <span class="tag">${t('maxMode')}</span> — ${best.container.name}</h4>
    <div class="result-row good"><span>${LANG==='zh'?'混装最多可装':'Mixed Max'}</span>
      <span class="val">${fmt(best.mixTotal)} ${LANG==='zh'?'箱':'boxes'}</span></div>
    <div class="result-row ${rateClass(best.fillRate)}"><span>${t('utilisation')}</span>
      <span class="val">${rateBadge(best.fillRate)}</span></div>
    <div class="progress"><div class="progress-bar" style="width:${Math.min(100,best.fillRate*100)}%"></div></div>
  </div>`;
  html += `<div class="result-box"><h4>📊 ${t('maxMatrix')}</h4>
    <div class="hint" style="margin-bottom:6px">${t('maxMatrixHint')}</div>
    <table class="matrix">
      <tr><th>${LANG==='zh'?'外箱':'Carton'}</th>`;
  r.byContainer.forEach(bc=>{ html += `<th>${bc.container.name}</th>`; });
  html += `</tr>`;
  r.units.forEach((u,idx)=>{
    html += `<tr><td>
      <span class="legend-swatch" style="display:inline-block;width:10px;height:10px;background:${u.color};border-radius:2px;margin-right:4px;vertical-align:middle"></span>${u.subName}</td>`;
    r.byContainer.forEach(bc=>{
      const perU = bc.perUnit.find(pu=>pu.unit.unitIdx===u.unitIdx);
      html += `<td>${fmt(perU?perU.count:0)}</td>`;
    });
    html += `</tr>`;
  });
  html += `<tr class="mix-row"><td>${t('mixed')}</td>`;
  r.byContainer.forEach(bc=>{ html += `<td>${fmt(bc.mixTotal)}</td>`; });
  html += `</tr></table></div>`;
  if(r.byContainer.length>1){
    html += `<div class="result-box"><h4>🚚 ${LANG==='zh'?'选择集装箱查看 3D':'Select Container'}</h4>`;
    r.byContainer.forEach((bc,i)=>{
      const sel = bc.container.name===r.best.container.name && selectedContainerIdx===i;
      html += `<div class="container-card ${sel?'selected':''}" onclick="selectMaxContainer(${i})">
        <div class="result-row" style="font-weight:600">
          <span>${bc.container.name}</span>
          <span class="val">${fmt(bc.mixTotal)} ${LANG==='zh'?'箱':'boxes'} · ${pct(bc.fillRate)}</span>
        </div></div>`;
    });
    html += `</div>`;
  }
  // Loading steps for best container
  if(best.steps) html += renderSteps(best.steps);
  // Scoring detail
  if(best.scoring){
    const sc = best.scoring;
    html += `<div class="result-box"><h4>⚖️ ${LANG==='zh'?'综合评分':'Score'}</h4>
      <div class="result-row"><span>${LANG==='zh'?'综合得分':'Total'}</span><span class="val">${(sc.score*100).toFixed(1)}</span></div>
      <div class="result-row"><span>${LANG==='zh'?'装载率':'Utilization'} (50%)</span><span class="val">${pct(sc.utilization)}</span></div>
      <div class="result-row"><span>${LANG==='zh'?'操作简洁性':'Simplicity'} (30%)</span><span class="val">${(sc.simplicity*100).toFixed(1)}</span></div>
      <div class="result-row"><span>${LANG==='zh'?'稳定性':'Stability'} (20%)</span><span class="val">${(sc.stability*100).toFixed(1)}</span></div>
    </div>`;
  }
  box.innerHTML = html + renderLegend(r.units);
}

function selectContainer(i){
  selectedContainerIdx = i;
  if(lastResult && lastResult.mode==='known'){
    renderResultsKnown(lastResult);
    render3DContainer(lastResult.containersUsed[i]);
  }
}
function selectMaxContainer(i){
  selectedContainerIdx = i;
  if(lastResult && lastResult.mode==='max'){
    lastResult.best = lastResult.byContainer[i];
    renderResultsMax(lastResult);
    render3DContainer(lastResult.byContainer[i]);
  }
}

// ---------- 3D ----------
let scene, camera, renderer, controls, boxesGroup, containerMesh;

function initThree(){
  const canvas = document.getElementById('canvas');
  const vp = document.getElementById('viewport');
  const w=vp.clientWidth, h=vp.clientHeight;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeef2f8);
  camera = new THREE.PerspectiveCamera(45, w/h, 1, 50000);
  camera.position.set(1500, 1200, 1800);
  renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setSize(w,h); renderer.setPixelRatio(window.devicePixelRatio||1);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0,0,0); controls.update();
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const dl = new THREE.DirectionalLight(0xffffff, 0.55); dl.position.set(1,1.5,1); scene.add(dl);
  const dl2 = new THREE.DirectionalLight(0xffffff, 0.3); dl2.position.set(-1,0.5,-1); scene.add(dl2);
  const grid = new THREE.GridHelper(2500, 25, 0x888888, 0xcccccc); scene.add(grid);
  boxesGroup = new THREE.Group(); scene.add(boxesGroup);
  animate();
  window.addEventListener('resize', onResize);
}
function onResize(){
  const vp=document.getElementById('viewport');
  camera.aspect=vp.clientWidth/vp.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(vp.clientWidth, vp.clientHeight);
}
function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); }
function clearScene(){
  while(boxesGroup.children.length) boxesGroup.remove(boxesGroup.children[0]);
  if(containerMesh){ scene.remove(containerMesh); containerMesh=null; }
  const toRemove = scene.children.filter(c=>c.userData&&c.userData.tempHelper);
  toRemove.forEach(c=>scene.remove(c));
}

function makeLabelSprite(text, bg){
  const canvas = document.createElement('canvas');
  canvas.width=256; canvas.height=80;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg || 'rgba(30,42,68,0.9)';
  ctx.fillRect(0,0,256,80);
  ctx.font = 'bold 42px -apple-system, "PingFang SC", sans-serif';
  ctx.fillStyle = '#fff'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(text, 128, 40);
  const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({map:tex, transparent:true, depthTest:false});
  return new THREE.Sprite(mat);
}

function drawContainer(L,W,H){
  const geo = new THREE.BoxGeometry(L,H,W);
  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(edges,
    new THREE.LineBasicMaterial({color:0x1e2a44, transparent:true, opacity:0.7}));
  line.position.set(L/2,H/2,W/2); scene.add(line); containerMesh=line;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(L,W),
    new THREE.MeshBasicMaterial({color:0xe6ecf4, side:THREE.DoubleSide}));
  floor.rotation.x=-Math.PI/2; floor.position.set(L/2,-0.5,W/2);
  floor.userData.tempHelper=true; scene.add(floor);
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W,H),
    new THREE.MeshBasicMaterial({color:0xc9d4e3, side:THREE.DoubleSide}));
  backWall.rotation.y=Math.PI/2; backWall.position.set(-0.5,H/2,W/2);
  backWall.userData.tempHelper=true; scene.add(backWall);
  const backLabel = makeLabelSprite(LANG==='zh'?'里端 FRONT':'FRONT','rgba(107,120,148,0.92)');
  const bs = Math.min(W*0.35,200);
  backLabel.scale.set(bs*2.2, bs*0.6, 1);
  backLabel.position.set(-20, H*0.5, W/2); backLabel.userData.tempHelper=true;
  scene.add(backLabel);
  // Door end — subtle frame only, no blocking overlay
  const dfGeo = new THREE.BufferGeometry();
  const dfv = new Float32Array([
    L,0,0, L,H,0,  L,H,0, L,H,W,  L,H,W, L,0,W,  L,0,W, L,0,0
  ]);
  dfGeo.setAttribute('position', new THREE.BufferAttribute(dfv,3));
  const df = new THREE.LineSegments(dfGeo, new THREE.LineBasicMaterial({color:0xef4444}));
  df.userData.tempHelper=true; scene.add(df);
  // Door label — well above container so it doesn't block boxes
  const doorLabel = makeLabelSprite(LANG==='zh'?'门 DOOR':'DOOR','rgba(161,74,60,0.9)');
  const ds = Math.max(W*0.4, 140);
  doorLabel.scale.set(ds*2.2, ds*0.55, 1);
  doorLabel.position.set(L, H+H*0.35, W/2);
  doorLabel.userData.tempHelper=true; scene.add(doorLabel);
  // Load direction arrow — below floor so it doesn't obscure boxes
  const arrowDir = new THREE.Vector3(-1,0,0);
  const arrowLen = Math.min(L*0.4, 400);
  const arrow = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(L-5, -H*0.08, W/2),
    arrowLen, 0xef4444, arrowLen*0.14, arrowLen*0.08);
  arrow.userData.tempHelper=true; scene.add(arrow);
  const loadLabel = makeLabelSprite(LANG==='zh'?'← 装入方向':'← LOAD','rgba(239,68,68,0.92)');
  const ls = Math.max(W*0.3,100);
  loadLabel.scale.set(ls*2, ls*0.55, 1);
  loadLabel.position.set(L-arrowLen/2, -H*0.15, W/2);
  loadLabel.userData.tempHelper=true; scene.add(loadLabel);
}

function drawBox(x,y,z,L,W,H,color,label){
  const geo = new THREE.BoxGeometry(L,H,W);
  const po = {polygonOffset:true, polygonOffsetFactor:1, polygonOffsetUnits:1};
  const topCol = _lighten(color, 0.35);
  const sideCol = _darken(color, 0.18);
  const matSide  = new THREE.MeshLambertMaterial({color:sideCol, ...po});
  const matTop   = new THREE.MeshLambertMaterial({color:topCol, ...po});
  const matFront = new THREE.MeshLambertMaterial({color:color, ...po});
  // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
  const materials = [matSide, matSide, matTop, matSide, matFront, matFront];
  const mesh = new THREE.Mesh(geo, materials);
  mesh.position.set(x+L/2, z+H/2, y+W/2);
  boxesGroup.add(mesh);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({color:0x1A1A1A, transparent:true, opacity:0.5}));
  edges.position.copy(mesh.position); boxesGroup.add(edges);
  // L-direction stripe on top face
  const stripeW = Math.max(L*0.06, 2);
  const stripeGeo = new THREE.PlaneGeometry(stripeW, W*0.7);
  const stripeMat = new THREE.MeshBasicMaterial({color:_darken(color,0.45), side:THREE.DoubleSide, depthWrite:false});
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.rotation.x = -Math.PI/2;
  stripe.position.set(x + stripeW/2 + L*0.04, z+H+0.3, y+W/2);
  boxesGroup.add(stripe);
  if(label){
    const sp = makeLabelSprite(label, 'rgba(30,42,68,0.92)');
    const sz = Math.min(L,W)*0.7;
    sp.scale.set(sz*2.2, sz*0.65, 1);
    sp.position.set(mesh.position.x, mesh.position.y+H/2+8, mesh.position.z);
    boxesGroup.add(sp);
  }
}

function drawStackBox(x,y,z,L,W,H,color,label,stackMeta){
  if(!stackMeta || stackMeta.perStack<=1){
    drawBox(x,y,z,L,W,H,color,label);
    return;
  }
  // Draw as one clean box — identical to drawBox
  drawBox(x,y,z,L,W,H,color,label);

  // Add a prominent "×N" quantity badge on front face
  const n = stackMeta.perStack;
  const badge = makeLabelSprite('×'+n, 'rgba(16,185,129,0.92)');
  const bSz = Math.max(Math.min(L,H)*0.35, 18);
  badge.scale.set(bSz*2, bSz*0.7, 1);
  badge.position.set(x+L/2, z+H/2, y-3);
  boxesGroup.add(badge);
}

function drawPlacements(placements){
  // Determine if this is a mixed-product load
  const productSet = new Set(placements.map(p=>p.productIdx));
  const isMixed = productSet.size > 1;

  // For mixed loads: label more aggressively so each product region is clear
  const byProd = {};
  placements.forEach((p,i)=>{
    const key = p.productIdx;
    if(!byProd[key]) byProd[key] = [];
    byProd[key].push({p,i});
  });
  const toLabel = new Set();
  Object.values(byProd).forEach(arr=>{
    arr.sort((a,b)=>{
      if(Math.abs(b.p.z-a.p.z)>1) return b.p.z-a.p.z;
      return (b.p.x+b.p.y)-(a.p.x+a.p.y);
    });
    // Mixed: label top box in each distinct region (every ~15 boxes)
    // Single: label just top 1-2
    const labelCount = isMixed
      ? Math.max(2, Math.min(5, Math.ceil(arr.length/15)))
      : Math.min(arr.length, arr.length>30?2:1);
    const step = Math.max(1, Math.floor(arr.length/labelCount));
    for(let i=0;i<labelCount&&i*step<arr.length;i++) toLabel.add(arr[i*step].i);
  });

  placements.forEach((p,i)=>{
    const label = toLabel.has(i) ? p.productName : null;
    if(p.type==='stack' && p.stackMeta && p.stackMeta.perStack>1){
      drawStackBox(p.x, p.y, p.z, p.L, p.W, p.H, p.color, label, p.stackMeta);
    } else {
      drawBox(p.x, p.y, p.z, p.L, p.W, p.H, p.color, label);
    }
  });
}

function frameCamera(L,W,H){
  const d = Math.max(L,W,H)*1.8;
  camera.position.set(L*0.7+d, H*0.5+d*0.5, W*0.7+d);
  controls.target.set(L/2, H/2, W/2);
  controls.update();
}

function render3DContainer(cu){
  clearScene();
  drawContainer(cu.container.L, cu.container.W, cu.container.H);
  drawPlacements(cu.placements||[]);
  frameCamera(cu.container.L, cu.container.W, cu.container.H);
}

function resetView(){
  if(lastResult){
    if(lastResult.mode==='known' && lastResult.containersUsed[selectedContainerIdx]){
      const cu = lastResult.containersUsed[selectedContainerIdx];
      frameCamera(cu.container.L, cu.container.W, cu.container.H);
    } else if(lastResult.mode==='max' && lastResult.best){
      const c = lastResult.best.container;
      frameCamera(c.L, c.W, c.H);
    }
  }
}

function exportPNG(){
  renderer.render(scene,camera);
  const url = renderer.domElement.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url; a.download = 'packing-plan.png'; a.click();
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', ()=>{
  refreshProducts();
  applyI18n();
  initThree();
  onContainerChange();
});
