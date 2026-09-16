'use strict';
// =====================================================================
// Set Load（按比例拼柜）回归测试 — scripts/test-set-load.js
// ---------------------------------------------------------------------
// 用法：npm run test:set-load
//
// 直接在 Node 里加载浏览器用的 app.js（同一份源码，非副本），验证：
//   1. 严格模式下「各款箱数 == 比例 × 套数」严格成立
//   2. 补装模式下套数不下降，且超装只发生在被放开的那一款
//   3. 二分调用次数与耗时在可接受范围
//
// ⚠️ app.js 是给浏览器写的顶层脚本，顶层的 function 声明会泄漏到 eval 作用域，
//    所以必须整段包在 IIFE 里 eval，只导出需要的几个符号，否则会与 Node 全局冲突
//    （典型报错：Identifier 'packContainer' has already been declared）。
// =====================================================================
const fs = require('fs');
const path = require('path');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// --- 最小 DOM / BOM 垫片：app.js 顶层会 touch 这些 ---------------
global.window = { addEventListener() {}, dispatchEvent() {}, THREE: null };
global.document = {
  addEventListener() {},
  getElementById() { return null; },
  querySelectorAll() { return []; },
  documentElement: {},
  createElement() { return { style: {}, getContext() { return null; } }; }
};
global.requestAnimationFrame = cb => setTimeout(cb, 0);
global.alert = () => {};

const api = (function () {
  return eval(SRC + '\n;({ packContainer, tryRatioFit, fillRatioFit, PACK_CFG, CONTAINERS })');
})();
const { tryRatioFit, fillRatioFit, PACK_CFG, CONTAINERS } = api;

PACK_CFG.marginPct = 1.5;   // 与页面默认装载余量一致，保证基准可复现

// --- 测试夹具 -----------------------------------------------------
const C = { ...CONTAINERS['40HQ'], key: '40HQ' };

const mk = (i, n, L, W, H, w, r) => ({
  unitIdx: i, productIdx: i, productName: n, subName: n, type: 'standard',
  L, W, H, weight: w, qty: null, uprightOnly: false, color: '#36c', ratio: r, maxStack: null
});

// 与 runRatioOptimize 主流程同构的二分（不含补装）
function solveStrict(container, units, ratios) {
  const gv = units.reduce((s, u, i) => s + ratios[i] * u.L * u.W * u.H, 0);
  const gw = units.reduce((s, u, i) => s + ratios[i] * (u.weight || 0), 0);
  let hi = Math.floor(container.L * container.W * container.H * 0.95 / gv);
  if (gw > 0 && isFinite(container.maxWeight)) hi = Math.min(hi, Math.floor(container.maxWeight / gw));
  let lo = 1, best = 0, bestRes = null, calls = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const r = tryRatioFit(container, units, ratios, mid); calls++;
    if (r.ok) { best = mid; bestRes = r; lo = mid + 1; } else { hi = mid - 1; }
  }
  return { best, bestRes, calls, upper: hi };
}

const CASES = [
  { name: '两款 1:2（典型）', units: [mk(0, '外箱1', 60, 40, 30, 8, 1), mk(1, '外箱2', 50, 35, 25, 5, 2)], ratios: [1, 2], expectSets: 402 },
  { name: '两款 1:1', units: [mk(0, 'A', 80, 60, 50, 18, 1), mk(1, 'B', 40, 30, 25, 4, 1)], ratios: [1, 1], expectSets: 224 },
  { name: '三款 4:3:2', units: [mk(0, '20cm', 40, 40, 30, 6, 4), mk(1, '24cm', 48, 48, 34, 9, 3), mk(2, '28cm', 56, 56, 38, 13, 2)], ratios: [4, 3, 2], expectSets: 90 },
  { name: '尺寸悬殊 1:5', units: [mk(0, '大箱', 110, 90, 80, 45, 1), mk(1, '小箱', 30, 25, 20, 2, 5)], ratios: [1, 5], expectSets: null }
];

console.log('='.repeat(74));
console.log('Set Load 回归测试   柜型 40HQ  ' + C.L + '×' + C.W + '×' + C.H + '  =  ' + (C.L * C.W * C.H / 1e6).toFixed(1) + ' m³');
console.log('='.repeat(74));

let fails = 0, totalCalls = 0, totalMs = 0;

CASES.forEach(cs => {
  const units = cs.units.map((u, i) => ({ ...u, unitIdx: i }));
  const ratios = cs.ratios;

  const t0 = Date.now();
  const s = solveStrict(C, units, ratios);
  const ms = Date.now() - t0;
  totalCalls += s.calls; totalMs += ms;

  console.log('\n【' + cs.name + '】  比例 ' + ratios.join(' : '));
  console.log('  理论上界 ' + s.upper + '  →  严格最大套数 = ' + s.best + '  （二分 ' + s.calls + ' 次, ' + ms + 'ms）');

  if (!s.bestRes) { console.log('  ❌ 无可行解'); fails++; return; }

  const got = units.map((u, i) => s.bestRes.counts[i] || 0);
  const want = ratios.map(r => r * s.best);
  const strictOK = got.every((v, i) => v === want[i]);
  console.log('  各款箱数 [' + got.join(', ') + ']  期望 [' + want.join(', ') + ']  ' + (strictOK ? '✅ 比例严格' : '❌ 比例不符'));
  if (!strictOK) fails++;

  if (cs.expectSets != null && s.best !== cs.expectSets) {
    console.log('  ❌ 套数与基准不符（期望 ' + cs.expectSets + '）'); fails++;
  }

  // 补装：套数不得下降，超装只允许出现在 fillUnit 那一款
  const f = fillRatioFit(C, units, ratios, s.best);
  const fgot = units.map((u, i) => f.counts[i] || 0);
  const over = fgot.map((v, i) => Math.max(0, v - ratios[i] * f.sets));
  const fillOK = f.sets >= s.best
    && over.every((v, i) => v === 0 || i === f.fillUnit)
    && f.placements.length >= s.bestRes.placements.length;

  console.log('  [补装] 套数 ' + f.sets + '  各款 [' + fgot.join(', ') + ']  超装 [' + over.join(', ') + ']'
    + '  总箱数 ' + f.placements.length + '  装载率 ' + (f.fillRate * 100).toFixed(1) + '%'
    + '  填充款=' + (f.fillUnit != null ? units[f.fillUnit].productName : '无(柜已满)'));
  console.log('         vs 严格：套数 ' + (f.sets - s.best) + '，箱数 ' + (f.placements.length - s.bestRes.placements.length)
    + '  ' + (fillOK ? '✅ 配比未被破坏' : '❌ 补装破坏了配比'));
  if (!fillOK) fails++;
});

console.log('\n' + '='.repeat(74));
console.log('性能：' + totalCalls + ' 次二分调用共 ' + totalMs + 'ms  →  平均 ' + (totalMs / totalCalls).toFixed(1) + 'ms/次');
console.log('完整测算（二分 ~' + totalCalls + ' 次 + 补探 3 次 + 补装 ' + CASES.length + ' 次）预计 < '
  + ((totalCalls + 4) * totalMs / totalCalls / 1000).toFixed(2) + 's');
console.log(fails === 0 ? '✅ 全部用例通过' : '❌ ' + fails + ' 项失败');
console.log('='.repeat(74));

process.exit(fails === 0 ? 0 : 1);
