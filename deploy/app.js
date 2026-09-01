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
    uprightOnly:'仅正向摆放', maxStack:'最大堆码层数',
    margin:'装载余量/涨箱 %',
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
    containerUnit:'柜',
    appTitle:'智能装箱优化工具', modeA:'模式 A：多品混合装柜', modeB:'模式 B：单品→外箱→托盘',
    foldLeft:'◧ 配置', foldRight:'◨ 看板', doorNote:'柜门/角件固定 5cm 避让', autoOpt:'🤖 自动推荐',
    viewIso:'轴测', viewTop:'顶视', viewFront:'正门', viewSide:'侧视', pngExport:'📷 PNG', reset:'复位',
    rpPlay:'播放/暂停', rpPrev:'上一排', rpNext:'下一排', rpClose:'收起',
    modeBSub:'模式 B · 单品→外箱→托盘三级联动', bItemSpec:'单品规格', bCartonLimit:'外箱与限重', bLogistics:'物流载具',
    accExpand:'展开 / 编辑', collapse:'收起', bLen:'长 L (mm)', bWid:'宽 W (mm)', bHei:'高 H (mm)', bItemWt:'单品毛重 (g)',
    bTarget:'目标装箱 PCS', bWall:'纸板厚度 (mm)', bMaxLoad:'单箱限重 (kg)', bOverhang:'边缘溢出 Overhang (mm)', bMaxStack:'最大堆码层数',
    bAllowSide:'允许侧放 (Side Loading)', bAllowInvert:'允许整体倒置 (Full Inversion)',
    bCartonHint:'单箱毛重 = 单品净重 + 500g 箱重；超限组合自动剔除。边缘溢出与堆码层数影响打托排布与双层堆叠。',
    bPallet:'国际托盘', bContainer:'目标集装箱', bPattern:'打托堆叠模式', bOptimize:'计算模式B方案',
    bNote:'默认三项展开；可点"收起"收拢栏目，或点"计算模式B方案"生成联动结果。',
    bCartonTitle:'外箱拼箱透视', bPalletTitle:'托盘打托堆叠', bResultsTitle:'模式B方案', bTop10Title:'候选方案 Top 10', bEmpty:'点击"计算模式B方案"生成联动结果',
    bBestPlan:'最优方案', bOuterDim:'外箱尺寸 (外)', bOuterLayout:'外箱排布', bBoxWt:'单箱毛重', bPerLayer:'每托层数 / 每层',
    bPatternMode:'堆叠模式', bOverStack:'边缘溢出 / 最大堆码', bPerPallet:'每托装箱', bPalletH:'每托高度', bContPallets:'集装箱托盘数',
    bTotalBoxes:'总装箱数', bTotalPCS:'总单品 PCS', bFillRate:'整柜装载率', bGrossWt:'整柜毛重',
    bPatternColumn:'列阵 Column', bPatternInterlock:'交错 Interlocking', bPatternPinwheel:'风车 Pinwheel',
    bNoPlan:'无可行方案，请调整参数', recFill:'🏆 最佳容积率', recMax:'📦 最大装箱数', recBal:'⚖️ 重量均衡',
    thNo:'#', thCarton:'外箱(mm)', thLayerPer:'层×每', thPerPallet:'每托', thPallet:'托盘', thPCS:'总PCS', thFill:'装载率',
    bOverLimit:'⚠ 超出限重', bLimit:'限重', bOverHint:'请降低单品重量、减少每箱 PCS 或提高限重。',
    bPrevItem:'单品', bPrevWall:'箱壁', bPrevOver:'溢出', bPrevStack:'堆码', bPrevLayer:'层',
    bItem:'件', bTtDim:'尺寸', bTtWt:'重量', bTtPos:'位置', bTtNA:'未录入',
    box:'箱', ttDim:'尺寸', ttBoxWt:'单箱重量', ttPos:'位置', notEntered:'未录入',
    layer:'层', row:'排', col:'列', wordCol:'列', wordRow:'排', wordLayer:'层', wordBox:'箱', wordLoad:'装', wordOrient:'摆放方向',
    stepFromBottom:'底层起',
    batchImport:'批量导入 (Excel 粘贴)', exportPlan:'导出装柜单', batchImportTitle:'批量导入外箱',
    cancel:'取消', parseImport:'解析并导入',
    batchImportHint:'从 Excel 选中单元格区域直接 Ctrl+C 复制，粘贴到下面文本框（每行一个外箱）。<br>列顺序：<b>品名 · 长 · 宽 · 高 · 数量 · 重量</b>（品名放最后也可自动识别；品名可留空）。<br>支持 Tab / 逗号 / 多空格分隔。尺寸按当前单位（cm 或 inch）解析。',
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
    uprightOnly:'Upright only', maxStack:'Max Stack',
    margin:'Load margin %',
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
    containerUnit:'containers',
    appTitle:'Smart Packing Optimizer', modeA:'Mode A: Mixed-SKU Loading', modeB:'Mode B: Item→Carton→Pallet',
    foldLeft:'◧ Config', foldRight:'◨ Board', doorNote:'Door/corner posts: fixed 5cm clearance', autoOpt:'🤖 Auto (mix types)',
    viewIso:'Iso', viewTop:'Top', viewFront:'Front', viewSide:'Side', pngExport:'📷 PNG', reset:'Reset',
    rpPlay:'Play/Pause', rpPrev:'Prev row', rpNext:'Next row', rpClose:'Close',
    modeBSub:'Mode B · Item→Carton→Pallet (3-stage)', bItemSpec:'Item Spec', bCartonLimit:'Carton & Limits', bLogistics:'Logistics',
    accExpand:'Expand / Edit', collapse:'Collapse', bLen:'Length L (mm)', bWid:'Width W (mm)', bHei:'Height H (mm)', bItemWt:'Item Gross Wt (g)',
    bTarget:'Target PCS', bWall:'Wall Thickness (mm)', bMaxLoad:'Carton Max Load (kg)', bOverhang:'Edge Overhang (mm)', bMaxStack:'Max Stack Layers',
    bAllowSide:'Allow Side Loading', bAllowInvert:'Allow Full Inversion',
    bCartonHint:'Carton gross = item net + 500g box. Over-weight combos auto-rejected. Overhang & stack layers affect pallet layout.',
    bPallet:'Pallet', bContainer:'Target Container', bPattern:'Palletizing Pattern', bOptimize:'Optimize Stage B',
    bNote:'All three expanded by default; click "Collapse" to fold, or "Optimize Stage B" to compute.',
    bCartonTitle:'Carton Stuffing', bPalletTitle:'Pallet Stacking', bResultsTitle:'Stage B Results', bTop10Title:'Top 10 Candidates', bEmpty:'Click "Optimize Stage B" to compute',
    bBestPlan:'Best Plan', bOuterDim:'Carton Dim (outer)', bOuterLayout:'Carton Layout', bBoxWt:'Box Gross Wt', bPerLayer:'Layers / Per Layer',
    bPatternMode:'Pattern', bOverStack:'Overhang / Max Stack', bPerPallet:'Per Pallet', bPalletH:'Pallet Height', bContPallets:'Pallets in Container',
    bTotalBoxes:'Total Boxes', bTotalPCS:'Total PCS', bFillRate:'Container Fill', bGrossWt:'Container Gross Wt',
    bPatternColumn:'Column', bPatternInterlock:'Interlocking', bPatternPinwheel:'Pinwheel',
    bNoPlan:'No feasible plan — adjust parameters', recFill:'🏆 Best Fill', recMax:'📦 Max Boxes', recBal:'⚖️ Balanced',
    thNo:'#', thCarton:'Carton(mm)', thLayerPer:'Layer×Per', thPerPallet:'Pallet', thPallet:'Pallets', thPCS:'Total PCS', thFill:'Fill %',
    bOverLimit:'⚠ Over Limit', bLimit:'Limit', bOverHint:'Reduce item weight, fewer PCS/box, or raise the limit.',
    bPrevItem:'Item', bPrevWall:'Wall', bPrevOver:'Overhang', bPrevStack:'Stack', bPrevLayer:'layers',
    bItem:'Item', bTtDim:'Size', bTtWt:'Weight', bTtPos:'Position', bTtNA:'N/A',
    box:'Box', ttDim:'Size', ttBoxWt:'Box Weight', ttPos:'Position', notEntered:'N/A',
    layer:'Layer', row:'Row', col:'Col', wordCol:'col', wordRow:'row', wordLayer:'layer', wordBox:'box', wordLoad:'Load', wordOrient:'orient',
    stepFromBottom:'from bottom',
    batchImport:'Batch Import (Excel paste)', exportPlan:'Export Plan', batchImportTitle:'Batch Import Cartons',
    cancel:'Cancel', parseImport:'Parse & Import',
    batchImportHint:'Copy a cell range from Excel with Ctrl+C and paste into the box below (one carton per line).<br>Column order: <b>Name · L · W · H · Qty · Weight</b> (name may be last or blank; auto-detected).<br>Supports Tab / comma / space separators. Dimensions parsed in the current unit (cm or inch).',
  }
};
let LANG='zh';
function t(k,v){ let s=(I18N[LANG]&&I18N[LANG][k])||(I18N.zh[k]||k);
  if(v) Object.keys(v).forEach(kk=>{s=s.replace('{'+kk+'}',v[kk]);}); return s; }
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(I18N[LANG][k]) el.textContent=I18N[LANG][k];
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    const k=el.getAttribute('data-i18n-title'); if(I18N[LANG][k]) el.title=I18N[LANG][k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const k=el.getAttribute('data-i18n-html'); if(I18N[LANG][k]) el.innerHTML=I18N[LANG][k];
  });
  document.getElementById('langLabel').textContent = LANG==='zh'?'English':'中文';
  document.documentElement.lang = LANG==='zh'?'zh-CN':'en';
  if (typeof refreshProducts==='function') refreshProducts();
  // 重新渲染依赖 LANG 的动态面板，使切换即时生效
  if (lastResult){
    try { if(lastResult.mode==='known') renderResultsKnown(lastResult); else renderResultsMax(lastResult); } catch(e){}
  }
  if (window.PalletOptimizer && typeof window.PalletOptimizer.rerender==='function'){
    try { window.PalletOptimizer.rerender(); } catch(e){}
  }
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

// =====================================================================
// UNITS — display layer only; internal computation core stays cm / kg
// =====================================================================
let UNIT = 'metric'; // 'metric' | 'imperial'
const CM_PER_IN = 2.54, KG_PER_LB = 0.45359237;
function toDispLen(cm){ return UNIT==='metric' ? +cm : cm/CM_PER_IN; }
function fromDispLen(v){ return UNIT==='metric' ? +v : v*CM_PER_IN; }
function toDispWt(kg){ return UNIT==='metric' ? +kg : kg/KG_PER_LB; }
function fromDispWt(v){ return UNIT==='metric' ? +v : v*KG_PER_LB; }
function lenUnit(){ return UNIT==='metric' ? 'cm' : 'in'; }
function wtUnit(){ return UNIT==='metric' ? 'kg' : 'lbs'; }
function fmtLen(cm,d){ if(cm==null||!isFinite(cm)) return '—';
  return (UNIT==='metric'?+cm:cm/CM_PER_IN).toFixed(d==null?1:d)+' '+lenUnit(); }
function fmtWt(kg,d){ if(kg==null||!isFinite(kg)) return '—';
  return (UNIT==='metric'?+kg:kg/KG_PER_LB).toFixed(d==null?1:d)+' '+wtUnit(); }
function fmtDims(L,W,H){ return `${fmtLen(L,1)} × ${fmtLen(W,1)} × ${fmtLen(H,1)}`; }
function wtLabel(){ return (LANG==='zh'?'重量':'Weight')+' ('+wtUnit()+')'; }
function toggleUnit(){
  UNIT = UNIT==='metric' ? 'imperial' : 'metric';
  const b=document.getElementById('unitToggle'); if(b) b.textContent = UNIT==='metric'?'cm / kg':'inch / lbs';
  // 容器自定义输入显示换算
  ['contL','contW','contH','maxHeight'].forEach(id=>{
    const el=document.getElementById(id);
    if(el && el.value!=='') el.value = (+toDispLen(+el.value)).toFixed(1);
  });
  refreshProducts();
  if(lastResult){
    if(lastResult.mode==='known') renderResultsKnown(lastResult);
    else renderResultsMax(lastResult);
  }
}

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
  const base = { id: productId++, type, name:'', uprightOnly:false, maxStack:null };
  if(type==='standard'){
    products.push({ ...base, L:null,W:null,H:null, weight:null, qty:null });
  } else if(type==='stack'){
    products.push({ ...base, L:null,W:null,H:null, weight:null, qty:null,
                    stackDir:'H', perStack:null, nestInc:null });
  } else if(type==='set'){
    products.push({ ...base, setsQty:null, maxStack:null, parts: [
      { name:'', L:null, W:null, H:null, weight:null, qtyPerSet:1, uprightOnly:false, maxStack:null }
    ]});
  }
  refreshProducts();
}
function delProduct(i){ if(products.length>1){ products.splice(i,1); refreshProducts(); } }
function updProduct(i,k,v){ products[i][k]=v; }
function updProductLen(i,k,v){ products[i][k] = v===''?null:+fromDispLen(+v).toFixed(2); }
function updProductWt(i,k,v){ products[i][k] = v===''?null:+fromDispWt(+v).toFixed(3); }
function updPart(i,pIdx,k,v){ products[i].parts[pIdx][k]=v; }
function updPartLen(i,pIdx,k,v){ products[i].parts[pIdx][k] = v===''?null:+fromDispLen(+v).toFixed(2); }

// =====================================================================
// BATCH IMPORT — paste rows copied from Excel (tab / comma / spaces)
// Columns: [name] L W H [qty] [weight] — name auto-detected (non-numeric)
// =====================================================================
function openBatchImport(){
  document.getElementById('batchModal').style.display='flex';
  const msg=document.getElementById('batchMsg');
  msg.textContent=''; msg.className='hint';
  setTimeout(()=>document.getElementById('batchText').focus(),50);
}
function closeBatchImport(){ document.getElementById('batchModal').style.display='none'; }
function doBatchImport(){
  const txt=document.getElementById('batchText').value;
  const msg=document.getElementById('batchMsg');
  const zh=LANG==='zh';
  const lines=txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if(!lines.length){ msg.className='hint err'; msg.textContent=zh?'请先粘贴数据':'Paste data first'; return; }
  let ok=0, fail=0;
  lines.forEach(line=>{
    // Excel paste is tab-separated; fall back to comma/semicolon, then whitespace
    let toks = line.indexOf('\t')>=0 ? line.split('\t')
             : (/[,;]/.test(line)) ? line.split(/[,;]/)
             : line.split(/\s+/);
    toks = toks.map(s=>s.trim()).filter(s=>s!=='');
    if(!toks.length){ return; }
    const nums=[], names=[];
    toks.forEach(tk=>{ if(/^-?\d+(\.\d+)?$/.test(tk)) nums.push(+tk); else names.push(tk); });
    if(nums.length<3){ fail++; return; }  // 至少 L W H
    const L=nums[0], W=nums[1], H=nums[2];
    const qty = nums.length>3 ? Math.round(nums[3]) : null;
    const weight = nums.length>4 ? nums[4] : null;
    products.push({
      id:productId++, type:'standard', name:names.join(' ').trim(),
      L:+fromDispLen(L).toFixed(2), W:+fromDispLen(W).toFixed(2), H:+fromDispLen(H).toFixed(2),
      weight: weight!=null ? +fromDispWt(weight).toFixed(3) : null,
      qty, uprightOnly:false, maxStack:null
    });
    ok++;
  });
  if(!ok){ msg.className='hint err';
    msg.textContent=zh?'未解析到有效行（每行至少 长/宽/高 三个数字）':'No valid rows (need at least L/W/H per row)'; return; }
  refreshProducts();
  msg.className='hint ok';
  msg.textContent=`✓ ${zh?'成功导入':'Imported'} ${ok} ${zh?'个外箱':'cartons'}`+
    (fail?`，${zh?'另有':'skipped'} ${fail} ${zh?'行无效已跳过':' invalid row(s)'}`:'');
  setTimeout(closeBatchImport, 900);
}
function addPart(i){
  products[i].parts.push({ name:'', L:null,W:null,H:null, weight:null, qtyPerSet:1, uprightOnly:false, maxStack:null });
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
    const lu = lenUnit();
    return `<div class="item-card" style="border-left-color:${color}">
      ${header}
      <div class="row">
        <div><label>L (${lu})</label><input type="number" step="0.1" value="${p.L!=null?(+toDispLen(p.L)).toFixed(1):''}" placeholder="60"
               oninput="updProductLen(${i},'L',this.value)" onfocus="this.select()"></div>
        <div><label>W (${lu})</label><input type="number" step="0.1" value="${p.W!=null?(+toDispLen(p.W)).toFixed(1):''}" placeholder="40"
               oninput="updProductLen(${i},'W',this.value)" onfocus="this.select()"></div>
        <div><label>H (${lu})</label><input type="number" step="0.1" value="${p.H!=null?(+toDispLen(p.H)).toFixed(1):''}" placeholder="30"
               oninput="updProductLen(${i},'H',this.value)" onfocus="this.select()"></div>
      </div>
      <div class="row-2" style="margin-top:6px">
        <div><label>${wtLabel()}</label><input type="number" step="0.1" value="${p.weight!=null?(+toDispWt(p.weight)).toFixed(1):''}" placeholder="—"
               oninput="updProductWt(${i},'weight',this.value)" onfocus="this.select()"></div>
        <div><label>${t('qty')}</label><input type="number" value="${p.qty??''}" placeholder="${t('blank')}"
               oninput="updProduct(${i},'qty',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
      <label class="single-check"><input type="checkbox" ${p.uprightOnly?'checked':''}
        onchange="updProduct(${i},'uprightOnly',this.checked)">${t('uprightOnly')}</label>
      <div class="row-2" style="margin-top:6px">
        <div><label>${t('maxStack')}</label><input type="number" min="1" step="1" value="${p.maxStack??''}" placeholder="∞"
               oninput="updProduct(${i},'maxStack',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
    </div>`;
  }

  if(p.type==='stack'){
    const lu = lenUnit();
    return `<div class="item-card" style="border-left-color:${color}">
      ${header}
      <div class="row">
        <div><label>L (${lu})</label><input type="number" step="0.1" value="${p.L!=null?(+toDispLen(p.L)).toFixed(1):''}" placeholder="56"
               oninput="updProductLen(${i},'L',this.value)" onfocus="this.select()"></div>
        <div><label>W (${lu})</label><input type="number" step="0.1" value="${p.W!=null?(+toDispLen(p.W)).toFixed(1):''}" placeholder="52"
               oninput="updProductLen(${i},'W',this.value)" onfocus="this.select()"></div>
        <div><label>H (${lu})</label><input type="number" step="0.1" value="${p.H!=null?(+toDispLen(p.H)).toFixed(1):''}" placeholder="82"
               oninput="updProductLen(${i},'H',this.value)" onfocus="this.select()"></div>
      </div>
      <div class="row-2" style="margin-top:6px">
        <div><label>${wtLabel()}</label><input type="number" step="0.1" value="${p.weight!=null?(+toDispWt(p.weight)).toFixed(1):''}" placeholder="5"
               oninput="updProductWt(${i},'weight',this.value)" onfocus="this.select()"></div>
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
          <div><label>${t('nestInc')} (${lu})</label><input type="number" step="0.1" value="${p.nestInc!=null?(+toDispLen(p.nestInc)).toFixed(1):''}" placeholder="10"
                 oninput="updProductLen(${i},'nestInc',this.value)" onfocus="this.select()"></div>
        </div>
      </div>
      <label class="single-check"><input type="checkbox" ${p.uprightOnly?'checked':''}
        onchange="updProduct(${i},'uprightOnly',this.checked)">${t('uprightOnly')}</label>
      <div class="row-2" style="margin-top:6px">
        <div><label>${t('maxStack')}</label><input type="number" min="1" step="1" value="${p.maxStack??''}" placeholder="∞"
               oninput="updProduct(${i},'maxStack',this.value===''?null:+this.value)" onfocus="this.select()"></div>
      </div>
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
          <div><label>L (${lenUnit()})</label><input type="number" step="0.1" value="${pt.L!=null?(+toDispLen(pt.L)).toFixed(1):''}" placeholder="90"
                 oninput="updPartLen(${i},${pIdx},'L',this.value)" onfocus="this.select()"></div>
          <div><label>W (${lenUnit()})</label><input type="number" step="0.1" value="${pt.W!=null?(+toDispLen(pt.W)).toFixed(1):''}" placeholder="85"
                 oninput="updPartLen(${i},${pIdx},'W',this.value)" onfocus="this.select()"></div>
          <div><label>H (${lenUnit()})</label><input type="number" step="0.1" value="${pt.H!=null?(+toDispLen(pt.H)).toFixed(1):''}" placeholder="40"
                 oninput="updPartLen(${i},${pIdx},'H',this.value)" onfocus="this.select()"></div>
          <div><label>${t('qtyPerSet')}</label><input type="number" value="${pt.qtyPerSet??1}" placeholder="1"
                 oninput="updPart(${i},${pIdx},'qtyPerSet',+this.value)" onfocus="this.select()"></div>
          <div><label>${t('maxStack')}</label><input type="number" min="1" value="${pt.maxStack??''}" placeholder="∞"
                 oninput="updPart(${i},${pIdx},'maxStack',this.value===''?null:+this.value)" onfocus="this.select()"></div>
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
  const mhRaw = +document.getElementById('maxHeight').value;
  const mh = mhRaw>0 ? fromDispLen(mhRaw) : 0;
  const apply = c => { if(mh>0&&mh<c.H) c.H=mh; return c; };
  if(type==='auto') return ['20GP','40GP','40HQ','45HQ'].map(k=>apply({...CONTAINERS[k],key:k}));
  if(type==='custom'){
    const L=fromDispLen(valOrPh(document.getElementById('contL')));
    const W=fromDispLen(valOrPh(document.getElementById('contW')));
    const H=fromDispLen(valOrPh(document.getElementById('contH')));
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
        weight: p.weight, maxStack: p.maxStack,
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
        weight: p.weight, maxStack: p.maxStack,
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
          weight: pt.weight, maxStack: pt.maxStack,
          uprightOnly:pt.uprightOnly, color,
          partIdx: ptIdx
        });
      });
    }
  });
  return units.filter(u=>u.L>0&&u.W>0&&u.H>0);
}

// ---------- PACKING CONFIG (物理作业容差) ----------
// marginPct  : 装载余量/涨箱预留 (默认1.5%，0~5%) — 按比例缩减可用内尺寸
// doorClearCm: 箱门立柱+角件避让 (固定5cm) — 缩减可用长度，防止尾部过满关不上门
// warnLenPct : 重心长度方向偏移安全阈值 (%)
// warnSidePct: 重心左右偏重安全阈值 (%)
const PACK_CFG = { marginPct: 1.5, doorClearCm: 5, warnLenPct: 10, warnSidePct: 5 };

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
    const capZ = (unit.maxStack&&unit.maxStack>=1)?Math.min(info.nz, unit.maxStack):info.nz;
    for(let iz=0;iz<capZ&&placed<limit;iz++)
      for(let ix=0;ix<info.nx&&placed<limit;ix++)
        for(let iy=0;iy<info.ny&&placed<limit;iy++){
          placements.push({
            x:ox+ix*info.ol, y:oy+iy*info.ow, z:oz+iz*info.oh,
            L:info.ol, W:info.ow, H:info.oh,
            unitIdx:unit.unitIdx, productIdx:unit.productIdx,
            weight:unit.weight||0,
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
  // ── 物理作业容差：装载余量(涨箱) + 箱门/角件避让 ──
  const margin = (PACK_CFG.marginPct||0)/100;
  const doorClr = (PACK_CFG.doorClearCm||0);
  const CL=Math.max(1, container.L*(1-margin) - doorClr); // 可用长度 (扣除关门避让)
  const CW=Math.max(1, container.W*(1-margin));            // 可用宽度
  const CH=Math.max(1, container.H*(1-margin));            // 可用高度
  const containerVolume=container.L*container.W*container.H; // 原始体积(用于装载率)

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
  // Per-SKU vertical stack counters (counts THIS sku's boxes stacked in each column)
  // Used to enforce maxStack (承重/抗压约束) across all phases.
  const skuStack={};
  for(const sku of skuOrder){
    const nx=Math.ceil(CL/GRID_RES), ny=Math.ceil(CW/GRID_RES);
    const g=[]; for(let ix=0;ix<nx;ix++) g.push(new Float32Array(ny));
    skuStack[sku.unitIdx]={nx,ny,grid:g};
  }
  function colCountAbove(unitIdx, x, y, L, W){
    const sg=skuStack[unitIdx]; if(!sg) return 0;
    const ix0=Math.floor(x/GRID_RES), iy0=Math.floor(y/GRID_RES);
    const ix1=Math.min(Math.ceil((x+L)/GRID_RES), sg.nx);
    const iy1=Math.min(Math.ceil((y+W)/GRID_RES), sg.ny);
    let m=0;
    for(let ix=ix0;ix<ix1;ix++) for(let iy=iy0;iy<iy1;iy++) if(sg.grid[ix][iy]>m) m=sg.grid[ix][iy];
    return m;
  }
  function colSet(unitIdx, x, y, L, W, val){
    const sg=skuStack[unitIdx]; if(!sg) return;
    const ix0=Math.floor(x/GRID_RES), iy0=Math.floor(y/GRID_RES);
    const ix1=Math.min(Math.ceil((x+L)/GRID_RES), sg.nx);
    const iy1=Math.min(Math.ceil((y+W)/GRID_RES), sg.ny);
    for(let ix=ix0;ix<ix1;ix++) for(let iy=iy0;iy<iy1;iy++) sg.grid[ix][iy]=val;
  }
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
            // 承重约束：本SKU该列已堆高度 + 1 不得超过 maxStack
            const newCount=colCountAbove(sku.unitIdx, pos.x, pos.y, oL, oW)+1;
            if(sku.maxStack && sku.maxStack>=1 && newCount>sku.maxStack) continue;
            placements.push({
              x:pos.x, y:pos.y, z:pos.z, L:oL, W:oW, H:oH,
              unitIdx:sku.unitIdx, productIdx:sku.productIdx,
              weight:sku.weight||0,
              productName:sku.productName||'', name:sku.subName||sku.productName||'',
              color:sku.color||'#888888', type:sku.type||'',
              stackMeta:sku.stackMeta||null,
            });
            heightMap.addBox(pos.x,pos.y,pos.z,oL,oW,oH);
            skuHMs[sku.unitIdx].addBox(pos.x,pos.y,pos.z,oL,oW,oH);
            colSet(sku.unitIdx, pos.x, pos.y, oL, oW, newCount);
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
              const newCount=colCountAbove(sku.unitIdx, pos.x, pos.y, oL, oW)+1;
              if(sku.maxStack && sku.maxStack>=1 && newCount>sku.maxStack) continue;
              placements.push({
                x:pos.x, y:pos.y, z:pos.z, L:oL, W:oW, H:oH,
                unitIdx:sku.unitIdx, productIdx:sku.productIdx,
              weight:sku.weight||0,
                productName:sku.productName||'', name:sku.subName||sku.productName||'',
                color:sku.color||'#888888', type:sku.type||'',
                stackMeta:sku.stackMeta||null,
              });
              heightMap.addBox(pos.x,pos.y,pos.z,oL,oW,oH);
              if(skuHMs[sku.unitIdx]) skuHMs[sku.unitIdx].addBox(pos.x,pos.y,pos.z,oL,oW,oH);
              colSet(sku.unitIdx, pos.x, pos.y, oL, oW, newCount);
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
            const newCount=colCountAbove(sku.unitIdx, gx, gy, oL, oW)+1;
            if(sku.maxStack && sku.maxStack>=1 && newCount>sku.maxStack) continue;

            placements.push({
              x:gx, y:gy, z:baseZ, L:oL, W:oW, H:oH,
              unitIdx:sku.unitIdx, productIdx:sku.productIdx,
              weight:sku.weight||0,
              productName:sku.productName||'', name:sku.subName||sku.productName||'',
              color:sku.color||'#888888', type:sku.type||'',
              stackMeta:sku.stackMeta||null,
            });
            heightMap.addBox(gx,gy,baseZ,oL,oW,oH);
            if(skuHMs[sku.unitIdx]) skuHMs[sku.unitIdx].addBox(gx,gy,baseZ,oL,oW,oH);
            colSet(sku.unitIdx, gx, gy, oL, oW, newCount);
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
    steps.push({
      step:stepNum,
      name,
      unitIdx, count, nx:cols, ny:rows, nz:layers,
      minX, maxX, minZ, maxZ,
      dims:[group[0].L, group[0].W, group[0].H],
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

// ─── Center of Gravity (三维复合重心) ────────────────────────────────────────
// 计算每个箱体重心贡献：CoG = Σ(mᵢ·cᵢ) / Σmᵢ，cᵢ = 箱体中心坐标。
// 未录入重量时退化为几何中心（等质量），并在结果中标注。
function computeCoG(placements, container){
  const L=container.L, W=container.W, H=container.H;
  let M=0, sx=0, sy=0, sz=0, hasWeight=false;
  for(const p of placements){
    const w=(p.weight && isFinite(p.weight) && p.weight>0) ? p.weight : 0;
    if(w>0) hasWeight=true;
    const m = w>0 ? w : 1; // 无重量时按等质量求几何中心
    M += m;
    sx += m*(p.x + p.L/2);
    sy += m*(p.y + p.W/2);
    sz += m*(p.z + p.H/2);
  }
  if(M<=0) return null;
  const cog={ x:sx/M, y:sy/M, z:sz/M };
  // 偏移百分比：相对集装箱几何中心
  const offX=((cog.x - L/2)/(L/2))*100;   // 长度方向 (柜尾→柜门)
  const offY=((cog.y - W/2)/(W/2))*100;   // 左右偏重
  const offZ=((cog.z - H/2)/(H/2))*100;   // 高度 (越低越稳)
  const lenWarn = Math.abs(offX) > PACK_CFG.warnLenPct;
  const sideWarn = Math.abs(offY) > PACK_CFG.warnSidePct;
  return { cog, offX, offY, offZ, lenWarn, sideWarn, hasWeight,
           tipRisk: lenWarn||sideWarn };
}

// ─── Backward-compatible wrapper ─────────────────────────────────────────────
function packMixedShelf(container, units){
  const result=packContainer(container, units);
  packMixedShelf._lastSteps=result.steps;
  return result.placements;
}

function simulateKnown(units){
  const containerType = document.getElementById('containerType').value;
  const mhRaw = +document.getElementById('maxHeight').value;
  const mh = mhRaw>0 ? fromDispLen(mhRaw) : 0;
  const containersUsed = [];
  const targets = units.map(u=>({ ...u, remaining: u.qty }));

  let availableKeys;
  if(containerType==='auto') availableKeys = ['20GP','40GP','40HQ','45HQ'];
  else if(containerType==='custom'){
    const L=fromDispLen(valOrPh(document.getElementById('contL')));
    const W=fromDispLen(valOrPh(document.getElementById('contW')));
    const H=fromDispLen(valOrPh(document.getElementById('contH')));
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
function syncPackCfg(){
  const m = parseFloat(document.getElementById('loadMargin') && document.getElementById('loadMargin').value);
  if(isFinite(m)) PACK_CFG.marginPct = Math.max(0, Math.min(5, m));
}

function runOptimize(){
  syncPackCfg();
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
            const dims = fmtDims(u.L,u.W,u.H);
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

function renderCoGBox(cog){
  if(!cog) return '';
  const cls = cog.tipRisk ? 'warn' : 'good';
  const warnTxt = cog.tipRisk
    ? `<span style="color:#ef4444;font-weight:700">⚠ ${LANG==='zh'?'偏重/倾覆风险':'Tipping Risk'}</span>`
    : `<span style="color:#10b981;font-weight:700">✓ ${LANG==='zh'?'重心安全':'CoG Safe'}</span>`;
  const wtNote = cog.hasWeight ? '' : ` <span style="color:#b45309">(${LANG==='zh'?'未录入重量·几何中心':'No weight·geometric'})</span>`;
  return `<div class="result-box"><h4>⚖️ ${LANG==='zh'?'三维重心 CoG':'Center of Gravity'}</h4>
    <div class="result-row"><span>${LANG==='zh'?'状态':'Status'}</span><span class="val ${cls}">${warnTxt}${wtNote}</span></div>
    <div class="result-row"><span>CoG (X, Y, Z)</span><span class="val">${fmtLen(cog.cog.x)}, ${fmtLen(cog.cog.y)}, ${fmtLen(cog.cog.z)}</span></div>
    <div class="result-row ${Math.abs(cog.offX)>PACK_CFG.warnLenPct?'warn':''}"><span>${LANG==='zh'?'长度偏移':'Length off'}</span><span class="val">${cog.offX.toFixed(1)}% (≤${PACK_CFG.warnLenPct}%)</span></div>
    <div class="result-row ${Math.abs(cog.offY)>PACK_CFG.warnSidePct?'warn':''}"><span>${LANG==='zh'?'左右偏重':'Side off'}</span><span class="val">${cog.offY.toFixed(1)}% (≤${PACK_CFG.warnSidePct}%)</span></div>
    <div class="result-row"><span>${LANG==='zh'?'高度偏移':'Height off'}</span><span class="val">${cog.offZ.toFixed(1)}%</span></div>
  </div>`;
}

function renderSteps(steps){
  if(!steps||!steps.length) return '';
  const zh = LANG==='zh';
  const U = lenUnit();
  let html = `<div class="result-box"><h4>📋 ${zh?'装柜步骤':'Loading Steps'}</h4>
    <div class="steps-list">`;
  steps.forEach(s=>{
    const layerLabel = s.minZ<1 ? t('stepFromBottom')
      : (zh?`从高${Math.round(toDispLen(s.minZ))}${U}起`:`from ${Math.round(toDispLen(s.minZ))}${U} up`);
    const instr = zh
      ? `${layerLabel}${t('wordLoad')} ${s.name} ${s.nx}${t('wordCol')}×${s.ny}${t('wordRow')}×${s.nz}${t('wordLayer')}（${s.count}${t('wordBox')}）`
      : `${layerLabel} ${t('wordLoad')} ${s.name}: ${s.nx}×${s.ny}×${s.nz} (${s.count} ${t('wordBox')}s)`;
    const hPart = s.nz>1 ? (zh?`（高${Math.round(toDispLen(s.minZ))}-${Math.round(toDispLen(s.maxZ))}${U}）`:` (h ${Math.round(toDispLen(s.minZ))}-${Math.round(toDispLen(s.maxZ))}${U})`) : '';
    const detail = zh
      ? `X:${Math.round(toDispLen(s.minX))}-${Math.round(toDispLen(s.maxX))}${U}${hPart}，${t('wordOrient')} ${fmtDims(s.dims[0],s.dims[1],s.dims[2])}`
      : `X:${Math.round(toDispLen(s.minX))}-${Math.round(toDispLen(s.maxX))}${U}${hPart}, ${t('wordOrient')} ${fmtDims(s.dims[0],s.dims[1],s.dims[2])}`;
    html += `<div class="step-item">
      <span class="step-num">${s.step}</span>
      <div class="step-body">
        <div class="step-instr">${instr}</div>
        <div class="step-detail">${detail}</div>
      </div>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function renderResultsKnown(r){
  const box = document.getElementById('results');
  const mixSummary = summarizeMix(r.containersUsed);
  // KPI dashboard
  let totalW=0, totalCbm=0;
  r.containersUsed.forEach(cu=>{
    (cu.placements||[]).forEach(p=>{ totalW += (p.weight||0); totalCbm += p.L*p.W*p.H/1e6; });
  });
  renderKPI({
    fillRate: r.avgFillRate,
    totalPcs: Object.values(r.totalCounts).reduce((s,v)=>s+v,0),
    totalCbm, totalWeight: totalW,
    maxWeight: null
  });
  let html = '';
  html += `<div class="result-box">
    <h4>🏆 ${t('bestPlan')} <span class="tag">${t('knownMode')}</span></h4>
    <div class="result-row good"><span>${t('containersNeeded')}</span>
      <span class="val">${fmt(r.containersNeeded)} ${t('containerUnit')} · ${mixSummary}</span></div>
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
  const selCuR = r.containersUsed[selectedContainerIdx];
  if(selCuR) html += renderCoGBox(computeCoG(selCuR.placements||[], selCuR.container));
  box.innerHTML = html + renderLegend(r.units);
}

function renderResultsMax(r){
  const box = document.getElementById('results');
  const best = r.best;
  // KPI dashboard
  let totalW=0, totalCbm=0;
  (best.placements||[]).forEach(p=>{ totalW += (p.weight||0); totalCbm += p.L*p.W*p.H/1e6; });
  renderKPI({
    fillRate: best.fillRate,
    totalPcs: best.mixTotal,
    totalCbm, totalWeight: totalW,
    maxWeight: (best.container.maxWeight && isFinite(best.container.maxWeight)) ? best.container.maxWeight : null
  });
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
  if(best) html += renderCoGBox(computeCoG(best.placements||[], best.container));
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
  // 防御：layout 未完成时 clientWidth/clientHeight 可能为 0 → canvas 黑屏
  let w = vp.clientWidth, h = vp.clientHeight;
  if (!w || !h) { w = 800; h = 500; }
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeef2f8);
  camera = new THREE.PerspectiveCamera(45, w/h, 1, 50000);
  camera.position.set(1500, 1200, 1800);
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, preserveDrawingBuffer:true});
  renderer.setSize(w,h); renderer.setPixelRatio(window.devicePixelRatio||1);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0,0,0); controls.update();
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const dl = new THREE.DirectionalLight(0xffffff, 0.55); dl.position.set(1,1.5,1); scene.add(dl);
  const dl2 = new THREE.DirectionalLight(0xffffff, 0.3); dl2.position.set(-1,0.5,-1); scene.add(dl2);
  const grid = new THREE.GridHelper(2500, 25, 0x888888, 0xcccccc); scene.add(grid);
  boxesGroup = new THREE.Group(); scene.add(boxesGroup);
  // 立即渲染一帧确保 canvas 非黑
  try { renderer.render(scene, camera); } catch(e) { console.error('[Mode A] first render failed:', e); }
  animate();
  window.addEventListener('resize', onResize);
  initPick();
  // layout 完成后再校准一次尺寸（修复首帧黑屏）
  requestAnimationFrame(() => {
    const w2 = vp.clientWidth, h2 = vp.clientHeight;
    if (w2 && h2 && (w2 !== w || h2 !== h)) {
      renderer.setSize(w2, h2);
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
    }
  });
}
function onResize(){
  const vp=document.getElementById('viewport');
  const w = Math.max(vp.clientWidth, 1), h = Math.max(vp.clientHeight, 1);
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
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

function drawBox(x,y,z,L,W,H,color,label,meta){
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
  const mdata = Object.assign({ pickable:true, z:z, x:x, boxColor:color }, meta||{});
  mesh.userData = mdata;
  boxesGroup.add(mesh);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({color:0x1A1A1A, transparent:true, opacity:0.5}));
  mesh.add(edges);
  // L-direction stripe on top face (child of mesh → visibility follows box)
  const stripeW = Math.max(L*0.06, 2);
  const stripeGeo = new THREE.PlaneGeometry(stripeW, W*0.7);
  const stripeMat = new THREE.MeshBasicMaterial({color:_darken(color,0.45), side:THREE.DoubleSide, depthWrite:false});
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.rotation.x = -Math.PI/2;
  stripe.position.set(stripeW/2 + L*0.04 - L/2, H/2 + 0.3, 0);
  mesh.add(stripe);
  if(label){
    const sp = makeLabelSprite(label, 'rgba(30,42,68,0.92)');
    const sz = Math.min(L,W)*0.7;
    sp.scale.set(sz*2.2, sz*0.65, 1);
    sp.position.set(0, H/2+8, 0);
    mesh.add(sp);
  }
  return mesh;
}

function drawStackBox(x,y,z,L,W,H,color,label,stackMeta,meta){
  const mesh = drawBox(x,y,z,L,W,H,color,label,meta);
  if(!stackMeta || stackMeta.perStack<=1) return mesh;
  // Add a prominent "×N" quantity badge on front face (child of mesh)
  const n = stackMeta.perStack;
  const badge = makeLabelSprite('×'+n, 'rgba(16,185,129,0.92)');
  const bSz = Math.max(Math.min(L,H)*0.35, 18);
  badge.scale.set(bSz*2, bSz*0.7, 1);
  badge.position.set(0, 0, -W/2-3);
  mesh.add(badge);
  return mesh;
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
    const meta = {
      name: p.productName || p.name || '',
      dims: [p.L, p.W, p.H],
      weight: p.weight || 0,
      row: Math.round(p.y / Math.max(p.W,1)) + 1,
      col: Math.round(p.x / Math.max(p.L,1)) + 1,
      layer: Math.round(p.z / Math.max(p.H,1)) + 1
    };
    if(p.type==='stack' && p.stackMeta && p.stackMeta.perStack>1){
      drawStackBox(p.x, p.y, p.z, p.L, p.W, p.H, p.color, label, p.stackMeta, meta);
    } else {
      drawBox(p.x, p.y, p.z, p.L, p.W, p.H, p.color, label, meta);
    }
  });
}

function frameCamera(L,W,H){
  const d = Math.max(L,W,H)*1.8;
  camera.position.set(L*0.7+d, H*0.5+d*0.5, W*0.7+d);
  controls.target.set(L/2, H/2, W/2);
  controls.update();
}

function drawCoG(container, cog){
  const {L,W,H}=container;
  const dash = Math.max(L,W,H)*0.02;
  // 容器中心基准虚线（竖直中轴 + 中段水平中线）
  const vGeo=new THREE.BufferGeometry();
  vGeo.setAttribute('position', new THREE.Float32BufferAttribute([L/2,0,W/2, L/2,H,W/2],3));
  const vLine=new THREE.LineSegments(vGeo, new THREE.LineDashedMaterial({color:0x2563eb, dashSize:dash, gapSize:dash}));
  vLine.computeLineDistances(); vLine.userData.tempHelper=true; scene.add(vLine);

  const hGeo=new THREE.BufferGeometry();
  hGeo.setAttribute('position', new THREE.Float32BufferAttribute([0,H/2,W/2, L,H/2,W/2],3));
  const hLine=new THREE.LineSegments(hGeo, new THREE.LineDashedMaterial({color:0x2563eb, dashSize:dash, gapSize:dash}));
  hLine.computeLineDistances(); hLine.userData.tempHelper=true; scene.add(hLine);

  // 重心红球
  const r=Math.max(2, Math.min(L,W,H)*0.025);
  const ball=new THREE.Mesh(new THREE.SphereGeometry(r,16,16), new THREE.MeshBasicMaterial({color:0xef4444}));
  ball.position.set(cog.cog.x, cog.cog.z, cog.cog.y); // 注意: 场景Y=高度=物理Z
  ball.userData.tempHelper=true; scene.add(ball);
  // 重心十字虚线 (从中心基准到红球)
  const cGeo=new THREE.BufferGeometry();
  cGeo.setAttribute('position', new THREE.Float32BufferAttribute([L/2,cog.cog.z,W/2, cog.cog.x,cog.cog.z,cog.cog.y],3));
  const cLine=new THREE.LineSegments(cGeo, new THREE.LineDashedMaterial({color:0xef4444, dashSize:dash, gapSize:dash}));
  cLine.computeLineDistances(); cLine.userData.tempHelper=true; scene.add(cLine);
  const lbl=makeLabelSprite('重心 CoG', 'rgba(239,68,68,0.95)');
  lbl.position.set(cog.cog.x, cog.cog.z+r+10, cog.cog.y);
  const sz=Math.min(L,W)*0.06+8; lbl.scale.set(sz*2.4, sz*0.6, 1);
  lbl.userData.tempHelper=true; scene.add(lbl);
}

function render3DContainer(cu){
  clearScene();
  drawContainer(cu.container.L, cu.container.W, cu.container.H);
  drawPlacements(cu.placements||[]);
  const cog=computeCoG(cu.placements||[], cu.container);
  if(cog) drawCoG(cu.container, cog);
  frameCamera(cu.container.L, cu.container.W, cu.container.H);
  initReplay(cu.container.L);   // 从里端往门端逐排回放（真实装柜顺序）
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

// =====================================================================
// SIDE PANEL COLLAPSE
// =====================================================================
// v4: 折叠状态由全局 JS 变量驱动（不读 DOM class 判断，避免旧浏览器
// classList.toggle(第二参数) 兼容性差异导致状态错乱）；显隐一律用内联样式
// 强控并显式覆盖所有折叠属性，任何旧缓存 CSS 都无法再"误伤"面板。
const __panelState = { left: false, right: false };
const __panelClicks = { left: 0, right: 0 };
function togglePanel(side){
  __panelState[side] = !__panelState[side];
  __panelClicks[side]++;
  const badge = document.getElementById('verBadge');
  if (badge) badge.textContent = 'v5 · R' + __panelClicks.right + ' L' + __panelClicks.left;
  const L = __panelState.left, R = __panelState.right;
  document.querySelectorAll('.mode-view').forEach(v => {
    // 同步 class（供其它逻辑使用），但不再作为显隐状态源
    if (L) v.classList.add('collapsed-left'); else v.classList.remove('collapsed-left');
    if (R) v.classList.add('collapsed-right'); else v.classList.remove('collapsed-right');
    applyPanelState(v);
  });
  window.dispatchEvent(new Event('resize'));
}
// 折叠/展开的"内联三重强控"：display + grid 轨道 + 全属性覆盖。
// 不依赖 CSS class 折叠规则 —— 即使旧版本 HTML 的误伤 CSS 被缓存、
// 即使内核不支持某些新特性，display:none/'' 也是最基础的显隐手段，物理上不可能失败。
function applyPanelState(v){
  if(!v) return;
  const isB = v.classList.contains('b');
  const leftHidden  = __panelState.left;
  const rightHidden = __panelState.right;
  const L = (isB ? 396 : 372) * (leftHidden  ? 0 : 1);
  const R = (isB ? 430 : 348) * (rightHidden ? 0 : 1);
  // 1) grid 轨道强制写入（内联优先级最高，覆盖任何旧缓存 CSS）
  v.style.gridTemplateColumns = L + 'px 1fr ' + R + 'px';
  // 2) 面板 display + 全属性显隐强控（children 遍历，兼容性最稳）
  const kids = v.children;
  for (let i = 0; i < kids.length; i++) {
    const el = kids[i];
    if (!el) continue;
    // 显式固定列位置：display:none 的 item 不参与 grid 布局，若无显式列号，
    // 后续 item 会前移占位（左栏折叠时右栏被挤到 1fr、3D 区被挤到 0px）。
    el.style.gridColumn = String(i + 1);
    // 关键：min-width:0 防止 canvas 等子内容把 1fr 轨道撑爆
    //（#viewport 无 min-width:0 时，canvas 固定宽会把中间轨道撑大，
    //   右栏被挤出屏幕，表现为"看板展开后回不来"）
    el.style.minWidth = '0';
    if (!el.classList || !el.classList.contains('panel')) continue;
    const isRight = el.classList.contains('panel-right');
    const hide = isRight ? rightHidden : leftHidden;
    if (hide) {
      el.style.display = 'none';
      el.style.width = '0px'; el.style.minWidth = '0px';
      el.style.padding = '0px'; el.style.border = 'none';
      el.style.opacity = '0'; el.style.overflow = 'hidden';
    } else {
      el.style.display = '';
      el.style.width = 'auto'; el.style.minWidth = '0';
      el.style.padding = '14px'; el.style.border = 'none';
      if (isRight) el.style.borderLeft = '1px solid var(--border)';
      el.style.opacity = '1'; el.style.overflow = 'auto';
    }
  }
}

// =====================================================================
// QUICK VIEW SWITCH (Mode A) — top / front(door) / side / iso
// =====================================================================
let lastViewMode = 'iso';
function setView(mode){
  let L,W,H;
  if(lastResult && lastResult.mode==='known' && lastResult.containersUsed[selectedContainerIdx]){
    const c = lastResult.containersUsed[selectedContainerIdx].container; L=c.L; W=c.W; H=c.H;
  } else if(lastResult && lastResult.mode==='max' && lastResult.best){
    const c = lastResult.best.container; L=c.L; W=c.W; H=c.H;
  } else return;
  lastViewMode = mode;
  const cx=L/2, cy=H/2, cz=W/2, d=Math.max(L,W,H);
  if(mode==='top')     camera.position.set(cx, cy+d*2.6, cz+0.1);
  else if(mode==='front') camera.position.set(L+d*1.3, cy, cz);
  else if(mode==='side')  camera.position.set(cx, cy, W+d*1.3);
  else { frameCamera(L,W,H); }
  controls.target.set(cx,cy,cz);
  controls.update();
  document.querySelectorAll('#vpViewsA .vp-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===mode));
}
function resetView(){ setView('iso'); }

// =====================================================================
// RAYCASTER PICK + TOOLTIP (Mode A)
// =====================================================================
let hlEdge = null;
function initPick(){
  const el = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function onMove(e){
    const rect = el.getBoundingClientRect();
    pointer.x = ((e.clientX-rect.left)/rect.width)*2-1;
    pointer.y = -((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(boxesGroup.children, true);
    let found = null;
    for(const h of hits){
      let o=h.object;
      while(o && o!==boxesGroup && !o.userData.pickable) o=o.parent;
      if(o && o.userData.pickable && o.visible){ found=o; break; }
    }
    highlightBox(found);
    if(found) showTooltip(e.clientX, e.clientY, found.userData);
    else hideTooltip();
  }
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', ()=>{ highlightBox(null); hideTooltip(); });
}
function highlightBox(mesh){
  if(hlEdge){ boxesGroup.remove(hlEdge); hlEdge.geometry.dispose(); hlEdge.material.dispose(); hlEdge=null; }
  if(!mesh) return;
  const g = new THREE.EdgesGeometry(mesh.geometry);
  const m = new THREE.LineBasicMaterial({color:0xffb020, transparent:true, opacity:0.95});
  hlEdge = new THREE.LineSegments(g, m);
  hlEdge.position.copy(mesh.position);
  hlEdge.scale.copy(mesh.scale);
  boxesGroup.add(hlEdge);
}
function showTooltip(x,y,d){
  const tt = document.getElementById('tooltip');
  if(!tt) return;
  tt.style.display = 'block';
  tt.style.left = (x+14)+'px';
  tt.style.top  = (y+14)+'px';
  const dim = d.dims ? fmtDims(d.dims[0], d.dims[1], d.dims[2]) : '—';
  const wt  = (d.weight && d.weight>0) ? fmtWt(d.weight,1) : t('notEntered');
  const loc = (d.layer!=null && d.row!=null && d.col!=null)
    ? `${t('layer')} ${d.layer} · ${t('row')} ${d.row} · ${t('col')} ${d.col}` : '';
  tt.innerHTML = `<div class="tt-title">📦 ${d.name || t('box')}</div>
    <div class="tt-row"><span class="tt-k">${t('ttDim')}</span><span class="tt-v">${dim}</span></div>
    <div class="tt-row"><span class="tt-k">${t('ttBoxWt')}</span><span class="tt-v">${wt}</span></div>
    ${loc?`<div class="tt-row"><span class="tt-k">${t('ttPos')}</span><span class="tt-v">${loc}</span></div>`:''}`;
}
function hideTooltip(){
  const tt = document.getElementById('tooltip');
  if(tt) tt.style.display='none';
}

// =====================================================================
// LOADING STEP REPLAY (Mode A) — real-world order: from interior (FRONT,
// x=0) outward toward the door (x=L), column by column along the length
// =====================================================================
let replay = { boxes:[], maxLen:100, current:0, timer:null };
function initReplay(maxLen){
  stopReplay();
  replay.boxes = boxesGroup.children.filter(m=>m.userData && m.userData.pickable);
  replay.maxLen = maxLen>0 ? maxLen : 100;
  replay.current = 0;
  const bar = document.getElementById('replayBar');
  if(!bar) return;
  bar.style.display = 'flex';
  const sl = document.getElementById('rpSlider');
  sl.min = 0; sl.max = Math.round(replay.maxLen); sl.value = 0;
  document.getElementById('rpInfo').textContent = '0%';
  document.getElementById('rpPlay').textContent = '▶';
  applyReplay();
}
function applyReplay(){
  const th = replay.current;
  // x = 箱子沿长度方向的起点；里端 x=0 → 门端 x=L。阈值内(已装到该深度)的箱子可见
  replay.boxes.forEach(m=>{ m.visible = (m.userData.x !== undefined) ? m.userData.x <= th + 0.01 : true; });
  const sl = document.getElementById('rpSlider');
  if(sl){ sl.max = Math.round(replay.maxLen); sl.value = Math.min(sl.max, th); }
  const pct = replay.maxLen>0 ? Math.round(th/replay.maxLen*100) : 0;
  const info = document.getElementById('rpInfo');
  if(info) info.textContent = pct+'%';
}
function toggleReplay(){
  if(!replay.boxes.length) return;
  const play = document.getElementById('rpPlay');
  if(replay.timer){ stopReplay(); if(play) play.textContent='▶'; return; }
  if(play) play.textContent='⏸';
  replay.timer = setInterval(()=>{
    if(replay.current >= replay.maxLen){ stopReplay(); if(play) play.textContent='▶'; return; }
    replay.current = Math.min(replay.maxLen, replay.current + replay.maxLen/20);
    applyReplay();
  }, 180);
}
function replayStep(d){
  if(!replay.maxLen) return;
  const step = replay.maxLen/10;
  replay.current = Math.max(0, Math.min(replay.maxLen, replay.current + d*step));
  applyReplay();
}
function replayTo(v){
  replay.current = +v;
  applyReplay();
}
function hideReplay(){
  stopReplay();
  const bar = document.getElementById('replayBar');
  if(bar) bar.style.display='none';
}
function stopReplay(){
  if(replay.timer){ clearInterval(replay.timer); replay.timer=null; }
}

// =====================================================================
// KPI DASHBOARD
// =====================================================================
function kpiRing(pctVal){
  const r = 24, circ = 2*Math.PI*r, filled = Math.max(0, Math.min(100, pctVal));
  const col = filled>=100 ? '#ef4444' : (filled>=70 ? '#10b981' : '#2563eb');
  return `<div class="kpi-ring">
    <svg width="58" height="58" viewBox="0 0 58 58">
      <circle cx="29" cy="29" r="${r}" fill="none" stroke="#e4e9f1" stroke-width="6"/>
      <circle cx="29" cy="29" r="${r}" fill="none" stroke="${col}" stroke-width="6"
              stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-filled/100)}"/>
    </svg>
    <span class="ring-val">${Math.round(filled)}%</span>
  </div>`;
}
function renderKPI(cfg, targetId){
  // cfg: { fillRate, totalPcs, totalCbm, totalWeight, maxWeight, totalPallets }
  const el = document.getElementById(targetId || 'kpiA');
  if(!el) return;
  const wOver = cfg.maxWeight && cfg.totalWeight > cfg.maxWeight;
  const wPct  = cfg.maxWeight ? Math.min(100, cfg.totalWeight/cfg.maxWeight*100) : 0;
  const wDisp = cfg.totalWeight!=null ? fmtWt(cfg.totalWeight,1) : '—';
  const wMax  = cfg.maxWeight ? fmtWt(cfg.maxWeight,0) : (LANG==='zh'?'未设限':'no limit');
  el.innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">📈 ${LANG==='zh'?'容积利用率':'Fill Rate'}</div>
      <div class="kpi-ring-wrap">${kpiRing((cfg.fillRate||0)*100)}
        <div><div class="kpi-value">${pct(cfg.fillRate||0)}</div>
        <div class="kpi-sub">${LANG==='zh'?'体积 / 内容积':'vol / cap'}</div></div>
      </div>
    </div>
    <div class="kpi-card ${wOver?'warn':''}">
      <div class="kpi-label">⚖️ ${LANG==='zh'?'装载毛重':'Gross Weight'}</div>
      <div class="kpi-value">${wDisp}${cfg.maxWeight?` / ${wMax}`:''}</div>
      <div class="kpi-bar"><div class="bar-fill ${wOver?'over':''}" style="width:${wPct}%"></div>
        <div class="bar-mark" style="left:100%"></div></div>
      <div class="kpi-legend"><span>${wOver?'⚠ 超限':'ok'}</span><span>${LANG==='zh'?'港口限重':'payload'}</span></div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">📦 ${LANG==='zh'?'装载总件数':'Total Boxes'}</div>
      <div class="kpi-value">${fmt(cfg.totalPcs||0)}</div>
      <div class="kpi-sub">${LANG==='zh'?'外箱合计':'cartons'}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">📐 ${LANG==='zh'?'总 CBM':'Total CBM'}</div>
      <div class="kpi-value">${cfg.totalCbm!=null?cfg.totalCbm.toFixed(2):'—'}</div>
      <div class="kpi-sub">${LANG==='zh'?'立方米':'cubic meters'}</div>
    </div>` + (cfg.totalPallets!=null ? `
    <div class="kpi-card">
      <div class="kpi-label">🪵 ${LANG==='zh'?'总托盘数':'Pallets'}</div>
      <div class="kpi-value">${fmt(cfg.totalPallets)}</div>
      <div class="kpi-sub">${LANG==='zh'?'托盘托数':'units'}</div>
    </div>` : '');
}

// =====================================================================
// LOADING PLAN REPORT — A4 print-friendly HTML (window.print → PDF)
// =====================================================================
function exportLoadingReport(){
  const zh = LANG==='zh';
  if(!lastResult){ alert(zh?'请先点击"计算最优方案"':'Run "Optimize" first'); return; }
  let cu=null, planTitle='';
  if(lastResult.mode==='known' && lastResult.containersUsed[selectedContainerIdx]){
    cu = lastResult.containersUsed[selectedContainerIdx];
    planTitle = (zh?'第 ':'#')+(selectedContainerIdx+1)+(zh?' 柜':'');
  } else if(lastResult.mode==='max' && lastResult.best){
    cu = lastResult.best;
    planTitle = zh?'最大装载方案':'Max-Pack Plan';
  }
  if(!cu){ alert(zh?'无装载数据':'No data'); return; }
  // 3D snapshot (preserveDrawingBuffer is on)
  let shot='';
  try{ renderer.render(scene,camera); shot = renderer.domElement.toDataURL('image/png'); }catch(e){}
  const placements = cu.placements||[];
  const cog = computeCoG(placements, cu.container);
  const steps = cu.steps||[];
  const totalBoxes = placements.length;
  const cbm = placements.reduce((s,p)=>s+p.L*p.W*p.H,0)/1e6;
  const gross = placements.reduce((s,p)=>s+(p.weight||0),0);
  const vol = cu.container.L*cu.container.W*cu.container.H;
  const fill = vol>0 ? (placements.reduce((s,p)=>s+p.L*p.W*p.H,0))/vol : 0;
  // legend by product
  const byProd={};
  placements.forEach(p=>{
    const k=p.productIdx;
    if(!byProd[k]) byProd[k]={name:p.productName||p.name||('SKU-'+k), color:p.color||'#888', n:0, L:p.L,W:p.W,H:p.H};
    byProd[k].n++;
  });
  const legendRows = Object.values(byProd).map(g=>`
    <tr><td><span class="sw" style="background:${g.color}"></span>${g.name}</td>
    <td>${fmtDims(g.L,g.W,g.H)}</td><td class="num">${g.n}</td></tr>`).join('');
  const stepRows = (steps.length?steps:[]).map(s=>`
    <tr><td class="num">${s.step}</td><td>${s.instruction||''}</td>
    <td>${s.orientation||''}</td><td class="num">${s.count||''}</td></tr>`).join('');
  const cogHtml = cog ? `
    <table class="rt">
      <tr><th>CoG (X · Y · Z)</th><th>${zh?'长度偏移':'Length off'}</th><th>${zh?'左右偏重':'Side off'}</th><th>${zh?'状态':'Status'}</th></tr>
      <tr><td class="num">${fmtLen(cog.cog.x)}, ${fmtLen(cog.cog.y)}, ${fmtLen(cog.cog.z)}</td>
      <td class="num ${Math.abs(cog.offX)>PACK_CFG.warnLenPct?'bad':''}">${cog.offX.toFixed(1)}% (≤${PACK_CFG.warnLenPct}%)</td>
      <td class="num ${Math.abs(cog.offY)>PACK_CFG.warnSidePct?'bad':''}">${cog.offY.toFixed(1)}% (≤${PACK_CFG.warnSidePct}%)</td>
      <td class="${cog.tipRisk?'bad':'good'}">${cog.tipRisk?'⚠ '+(zh?'偏重/倾覆风险':'Tipping Risk'):'✓ '+(zh?'重心安全':'Safe')}</td></tr>
    </table>` : `<div class="note">—</div>`;
  const now=new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const logoEl = document.querySelector('header img');
  const logoUrl = logoEl ? logoEl.src : '';
  const html = `<!doctype html><html lang="${zh?'zh-CN':'en'}"><head><meta charset="utf-8">
<title>${zh?'装柜指导单':'Loading Plan'} — ${cu.container.name}</title>
<style>
  @page { size: A4; margin: 12mm 10mm; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; color:#16223b; font-size:12px; padding:18px; }
  .rp-head { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #2563eb; padding-bottom:10px; margin-bottom:12px; }
  .rp-head img { height:40px; }
  .rp-head h1 { font-size:20px; letter-spacing:.5px; }
  .rp-head .meta { text-align:right; color:#51607a; font-size:11px; line-height:1.7; }
  h2 { font-size:14px; margin:13px 0 6px; padding-left:8px; border-left:4px solid #2563eb; }
  table.rt { width:100%; border-collapse:collapse; margin:6px 0; }
  table.rt th { background:#eef4ff; text-align:left; padding:6px 8px; border:1px solid #cbd4e2; font-size:11px; }
  table.rt td { padding:5px 8px; border:1px solid #e4e9f1; }
  td.num, th.num { text-align:right; font-variant-numeric:tabular-nums; }
  .kpi-row { display:flex; gap:8px; flex-wrap:wrap; margin:6px 0; }
  .kpi { flex:1; min-width:110px; border:1px solid #e4e9f1; border-radius:8px; padding:8px 10px; background:#f8fafd; }
  .kpi .k { font-size:10px; color:#8b95a8; }
  .kpi .v { font-size:16px; font-weight:800; margin-top:2px; }
  .shot { width:100%; border:1px solid #cbd4e2; border-radius:8px; margin:6px 0; }
  .sw { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:6px; border:1px solid rgba(0,0,0,.15); vertical-align:-1px; }
  .note { color:#51607a; font-size:11px; line-height:1.6; margin:4px 0; }
  .warn-box { border:1px solid #f3d9b0; background:#fff8ee; color:#92400e; border-radius:8px; padding:8px 10px; margin:6px 0; }
  .good { color:#0e9f6e; font-weight:700; } .bad { color:#ef4444; font-weight:700; }
  .foot { margin-top:14px; padding-top:8px; border-top:1px solid #e4e9f1; color:#8b95a8; font-size:10px; display:flex; justify-content:space-between; }
  .no-print { text-align:center; margin:12px 0; }
  @media print { .no-print { display:none; } body { padding:0; } .rp-head img { height:34px; } }
</style></head><body>
<div class="rp-head">
  <div style="display:flex;align-items:center;gap:12px">
    <img src="${logoUrl}" onerror="this.style.display='none'">
    <div><h1>${zh?'装柜指导单':'Container Loading Plan'}</h1>
    <div class="note">${planTitle} · ${cu.container.name} (${fmtDims(cu.container.L,cu.container.W,cu.container.H)})</div></div>
  </div>
  <div class="meta">${zh?'生成日期':'Date'}: ${dateStr}<br>${zh?'单位':'Units'}: ${lenUnit().toUpperCase()} / ${wtUnit().toUpperCase()}<br>Smart Packing Optimizer</div>
</div>
<h2>① ${zh?'整柜装载汇总':'Load Summary'}</h2>
<div class="kpi-row">
  <div class="kpi"><div class="k">${zh?'装载总件数':'Total Boxes'}</div><div class="v">${totalBoxes}</div></div>
  <div class="kpi"><div class="k">${zh?'容积利用率':'Fill Rate'}</div><div class="v">${(fill*100).toFixed(1)}%</div></div>
  <div class="kpi"><div class="k">${zh?'总体积':'Volume'}</div><div class="v">${cbm.toFixed(2)} CBM</div></div>
  <div class="kpi"><div class="k">${zh?'总毛重':'Gross Weight'}</div><div class="v">${fmtWt(gross,1)}</div></div>
</div>
<h2>② ${zh?'3D 装载视角':'3D Loading View'}</h2>
${shot?`<img class="shot" src="${shot}">`:`<div class="note">—</div>`}
<h2>③ ${zh?'重心分布':'Center of Gravity'}</h2>
${cogHtml}
${cog&&cog.tipRisk?`<div class="warn-box">⚠ ${zh?'警告：重心偏移超出安全阈值（长度 &gt;10% 或左右 &gt;5%），运输存在偏重/倾覆风险，建议调整配重分布。':'Warning: CoG offset exceeds safety threshold (length >10% or side >5%). Rebalance recommended.'}</div>`:''}
${cog&&!cog.hasWeight?`<div class="note">${zh?'注：未录入单箱重量，重心按几何中心计算。':'Note: no per-carton weights entered — geometric center used.'}</div>`:''}
<h2>④ ${zh?'分步装柜清单（按施工先后排序）':'Loading Sequence (construction order)'}</h2>
<div class="note">${zh?'施工顺序：从里端（封闭端）向柜门方向逐排推进；每一步内先底层后上层。工人按步骤号依次施工。':'Load from the interior (closed end) toward the door, row by row; within each step, load bottom-up.'}</div>
<table class="rt">
  <tr><th class="num" style="width:36px">#</th><th>${zh?'施工指导':'Instruction'}</th><th style="width:120px">${zh?'摆放方向':'Orientation'}</th><th class="num" style="width:56px">${zh?'数量':'Qty'}</th></tr>
  ${stepRows||`<tr><td colspan="4" class="note">—</td></tr>`}
</table>
<h2>⑤ ${zh?'SKU 图例':'SKU Legend'}</h2>
<table class="rt">
  <tr><th>${zh?'外箱':'Carton'}</th><th>${zh?'尺寸':'Dimensions'}</th><th class="num">${zh?'数量':'Qty'}</th></tr>
  ${legendRows}
</table>
<div class="foot"><span>${zh?'本单据由智能装箱优化工具自动生成':'Auto-generated by Smart Packing Optimizer'}</span><span>${location.host}</span></div>
<div class="no-print"><button onclick="window.print()" style="padding:10px 28px;font-size:14px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700">🖨 ${zh?'打印 / 保存 PDF':'Print / Save PDF'}</button></div>
</body></html>`;
  const w=window.open('','_blank');
  if(!w){ alert(zh?'弹窗被浏览器拦截，请允许本站弹窗后重试':'Popup blocked — allow popups and retry'); return; }
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(()=>{ try{ w.print(); }catch(e){} }, 800);
}

// ---------- INIT ----------
// Wait for Three.js (loaded asynchronously by lib-loader.js with multi-CDN
// fallback). If THREE is already present (cached), start immediately.
function bootApp() {
  refreshProducts();
  applyI18n();
  // 3D 初始化可能因引擎缺失而失败，隔离异常以免阻断后续 UI 初始化
  try { initThree(); } catch (e) { console.error('[3D] init failed, rest of UI still works:', e); }
  onContainerChange();
  // Debug hook: #autob → auto-switch to Mode B + compute (production harmless)
  // #autob-top / #autob-front / #autob-side → also demo that view button
  if (location.hash.indexOf('#autob') === 0) {
    setTimeout(() => {
      if (window.PalletOptimizer) {
        window.PalletOptimizer.showMode('B');
        setTimeout(() => {
          window.PalletOptimizer.runOptimize();
          const v = location.hash.split('-')[1];
          if (v && window.setViewB) setTimeout(()=>window.setViewB('pallet', v), 500);
        }, 500);
      }
    }, 400);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  // 面板折叠状态内联强控：DOM 就绪即同步，不依赖 3D 加载
  try { document.querySelectorAll('.mode-view').forEach(v=>applyPanelState(v)); } catch(e){}
  // 必须等 THREE 与 OrbitControls 二者都就绪，否则 new THREE.OrbitControls 会抛
  // "not a constructor"，导致 initThree 中断、3D 画布黑屏（初始化竞态，时好时坏）。
  if (window.THREE && window.THREE.OrbitControls) { bootApp(); return; }
  const start = () => bootApp();
  if (window.__threeReady && typeof window.__threeReady.then === 'function') {
    window.__threeReady.then(start).catch(start); // 成功或失败都确保 UI 启动
  } else {
    window.addEventListener('three-ready', start, { once: true });
    window.addEventListener('three-failed', start, { once: true });
  }
});
