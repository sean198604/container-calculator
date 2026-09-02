# 智能装箱优化工具 — 算法与架构总结文档

> 本文档面向需要接手 / 二次开发本项目的 AI 或工程师。
> 仓库：`container-calculator/`（纯前端，Node Express 仅作静态服务器，核心计算全在浏览器端 Three.js + 原生 JS）。

---

## 0. 项目定位与运行方式

- **纯前端离线应用**：所有装箱计算在浏览器内完成，没有任何后端 API 调用（代码中无 `fetch` / `XMLHttpRequest` / localhost 依赖）。
- 两种部署：
  1. **本地 / 内网**：`server.js`（Express，监听 7002）+ Docker（`Dockerfile` / `docker-compose.yml`）。容器名 `container-calculator-7002`，内网访问 `http://192.168.1.246:7002`。
  2. **静态托管**（InfinityFree / GitHub Pages / 任意 PHP+静态空间）：上传 `deploy/` 目录即可，无需 Node。
- **Three.js 本地化**：`vendor/three.min.js`（r128）+ `vendor/OrbitControls.js`（r128）已落入项目，`lib-loader.js` 加载顺序为「本地 vendor → 公共 CDN 兜底」，断外网也能跑。

### 关键约定（务必遵守）
- **Logo 双轨（2026-09-02 两度升级，终版为「单一 index.html + 后端动态注入」，无第二份 HTML）**：
  - **EGO 激活条件**：`EGO_BRAND=true` **且** `assets/logo.png` 存在（EGO logo 被 .gitignore 忽略、不进公开仓库，由内网部署方放入 `assets/` 即可）。
  - 激活时 `server.js` 读 `index.html`，把 `assets/logo.jpg` / `alt="SEAN Logo"` 动态替换为 `assets/logo.png` / `alt="EGO International Logo"`（favicon + header 同时切换）后返回。
  - 默认或 `logo.png` 缺失 → 原样返回 `index.html`（SEAN）。公开仓库 clone 后 `docker-compose up` 开箱即用；**静态托管（无 Node）也不受影响**——`index.html` 文件本身始终是 SEAN 引用。
  - 内网 7002：`docker-compose.yml` 设 `EGO_BRAND=true`，本地 `assets/logo.png` 随 `COPY . .` 进镜像 → 自动 EGO。
  - `server.js` 的 `express.static` 必须保持 `{ index: false }`，否则 `/` 会被 static 默认 index.html 短路，动态注入失效。
  - `deploy/assets/logo.jpg` 绝不能覆盖成 `logo.png`；GitHub 公开仓库不得出现任何 EGO 品牌文件。
  - 已废弃：`ego-index.html`（历史方案的双 HTML，2026-09-02 删除，勿再引入）。
- 唯一主页面 `index.html`（SEAN 静态引用为默认），脚本引用必须为 `<script src="app.js">` + `<script src="pallet-optimizer.js">`（不能用 `ego-app.js` 之类旧名）。

---

## 1. 文件结构

| 文件 | 作用 |
|------|------|
| `index.html` | 主页面（Mode A + Mode B 双模式 Tab）。SEAN 静态引用为默认；EGO 版由 server.js 按 `EGO_BRAND=true` + `assets/logo.png` 存在时动态注入 logo，**无第二份 HTML**。 |
| `app.js` | **Mode A** 逻辑：集装箱装箱（多 SKU 人工装柜）+ 3D 渲染 + 步骤指令生成 + 评分。 |
| `pallet-optimizer.js` | **Mode B** 逻辑：单品→外箱→托盘三级优化 + 双视口 3D。封装为 `window.PalletOptimizer`，对 Mode A **零侵入**。 |
| `lib-loader.js` | Three.js 多级回退加载器（本地优先）。 |
| `vendor/` | 本地化 Three.js r128 + OrbitControls，离线可用。 |
| `server.js` / `Dockerfile` / `docker-compose.yml` | 7002 容器部署。 |
| `deploy/` | 上传到静态托管的完整静态包（含 SEAN logo）。 |

---

## 2. MODE A — 集装箱整车装箱（多 SKU「人工装柜」算法）

**入口文件**：`app.js`
**核心函数**：`packContainer(container, units)`（约 572–999 行），上层 `simulateKnown` / `runOptimize` 负责「选箱型 / 自动组合」。

### 2.1 输入

```
container = { L, W, H, maxPayload }
units[]   = { L, W, H, qty, weight, uprightOnly, color, productName, ... }
```
尺寸单位统一为 **cm**，重量 **kg**。`qty` 可为 `null/Infinity` 表示不限量。

### 2.2 取向枚举 `allowedOrients(L,W,H,upOnly)`
- `upOnly=false`：3 个维度全排列去重 → 最多 6 种取向。
- `upOnly=true`：仅 (L,W,H)、(W,L,H) 两种（高度方向锁定）。

### 2.3 高度图 `HeightMap`（支撑校验）
- 分辨率 `GRID_RES = 5` cm，覆盖集装箱底面 `L × W`。
- `addBox(x,y,z,L,W,H)`：把箱子占据的网格单元「顶高」更新为该箱顶面。
- `supportRatio(x,y,z,L,W)`：在 (x,y) 落点处，已有堆积顶面 ≥ `z-0.5` 的网格占比 → 支撑率（阈值 0.75）。
- `maxHeightAt(...)`：落点处当前最高堆积高度（用于找基准面）。
- **按 SKU 分表 `skuHMs`**：碰撞检测只查「其它 SKU」高度图，避免同 SKU 边界污染（消除「同一个箱子自己挡自己」的误判）。

### 2.4 单品种快速路径 `singleVarietyPlace`
当只有一个 SKU（或所有 SKU 尺寸相同）时走**二层 strip-packing**：
1. 枚举取向，对每个取向计算整齐排布 `nx×ny×nz` 主块。
2. 剩余三条边料（`cx-uL`、`cy-uW`、`cz-uH`）再递归 strip-fill（1 级递归）。
3. 取总箱数最大取向，逐箱生成 `placements`。

### 2.5 多品种主算法：SKU 驱动的「砌墙」装柜（`packContainer` 多分支）
模拟真实仓库装柜的人工决策，分 3 个阶段：

**阶段 1 — SKU 主墙搭建（Phase 1）**
- 预先把集装箱长度方向按 SKU 估算 X 区间（`phase1XRanges`）：有限量 SKU 按「每层列数 × 箱长」估需求；无限量 SKU 平分剩余长度。
- SKU 排序：重 / 大优先（`weight` 降序，其次 `volume` 降序）——重箱大箱落地。
- 逐个 SKU 从「共享前沿 `globalSearchX`」向箱门方向砌墙：
  - `chooseBestWallOrient`：选能让宽度填充 ≥80% 的取向（评分 10000 起），否则按宽/高填充率评分。
  - 沿 X 以 `GRID_RES=5cm` 扫描找「≥2 箱可落」的列起点，接着在该 X 列内从基准面向上逐层堆叠。
  - **80% 规则**：上一层未铺满 80% 宽度则禁止上层放箱。
  - **≥2 箱规则**：单层可放箱数 <2 时禁止（禁止单箱补洞）。
  - 同 SKU 连续堆放形成整面墙，墙之间不留缝（共享前沿）。

**阶段 2 — 顶部补层（Phase 2，最多 20 轮）**
- 在 Phase 1 墙面顶部继续铺「整层」：规则放宽至 ≥50% 宽、支撑 ≥70%、高度按 5cm 容差分组。
- 每轮只放当前 X 位置最大的等高组，直到无可放。

**阶段 3 — 激进补缝（Phase 3，最多 10 轮）**
- 全空间扫描（X、Y 各 5cm 步进）找能塞下的单箱：仅要求支撑 ≥70%、不超高。
- 不限制数量与方向，把所有空隙填满。

### 2.6 步骤指令 `generateSteps`
把 `placements` 按 SKU 分组（保持装柜顺序：先 X 后 Z），生成工人可读指令：
`「底层起装 [产品名] {列}×{排}×{层} ({N}箱)」`，并标注摆放方向与空间跨度。

### 2.7 评分 `scorePackingResult`
综合三项的加权分，用于「自动推荐箱型」时排序多种箱型结果：
```
score = utilization×0.5 + simplicity×0.3 + stability×0.2
```
- `utilization` = 已用体积 / 集装箱体积。
- `simplicity` = 步骤数与 SKU 切换惩罚 + 平均块大小（大块更整齐）。
- `stability` = 底面积覆盖率×0.6 + 重量分布到底部比例×0.4。

### 2.8 「自动推荐」模式
`containerType='auto'` 时对 `['20GP','40GP','40HQ','45HQ']` 逐一 `packContainer`，按 `score` 取最优。默认 40HQ（HTML `selected`）。

---

## 3. MODE B — 单品→外箱→托盘三级优化（`pallet-optimizer.js`）

**入口**：`compute(inp)` → 串起 3 个 Stage，输出 **Top 10 候选装载方案**。
**输入**（`runOptimize` 从 DOM 读取）：

```
itemL/W/H         单品尺寸 (mm)
itemWeightG       单品重量 (g)
targetQty         目标装箱数量 Q
wall              纸箱壁厚 (mm)
maxLoadKg         单人搬运限重 (kg)
palletType        US / UK / EU / AU / JP
containerType     20GP / 40GP / 40HQ
allowSide         是否允许侧放（全 6 向旋转）
allowInvert       是否允许倒置（当前实际只影响注释，Z 锁定时无差异）
```

### Stage 1 — 单品 → 外箱候选 `genCartonCandidates`
1. **取向**：`allowSide` 时取 6 种全排列；否则仅 (L,W,H) / (W,L,H) 两种（高度方向锁竖）。
2. **整数分解**：枚举 `(nx,ny,nz)` 满足 `nx*ny*nz = Q` 且均能整除（即把 Q 件排成整齐网格）。
3. 对每种 `(nx,ny,nz)` × 每种取向，算内尺寸与外尺寸（外 = 内 + 2×壁厚）。
4. **限重互锁**：`boxGrossKg = Q×itemWeightG/1000 + 0.5kg(纸箱皮重)`，若 > `maxLoadKg` 返回 `overLimit`。
5. 去重（外尺寸相同）、按外体积升序，保留前 24 个候选。

### Stage 2 — 外箱 → 托盘单元载 `evalPallet`
```
c0  = floor(pallet.L/L) × floor(pallet.W/W)      // 0° 摆放每层箱数
c90 = floor(pallet.L/W) × floor(pallet.W/L)      // 90° 摆放
perLayer = max(c0, c90);  pattern = (c0>=c90)?'0°':'90°'
availH   = containerInteriorH - pallet.baseH     // 托盘高度占用后的可用高
layers   = max(1, floor(availH / H))             // 可堆叠层数
perPallet= perLayer × layers
palletWeight = perPal 箱 × 单箱毛重
```

### Stage 3 — 托盘块 → 海运箱 `evalContainer`
```
PL, PW = 托盘长/宽;  ph = 托盘总高(palletHeight)
aN = floor(C.l/PL)×floor(C.w/PW);   // 托盘 L 沿箱 L
bN = floor(C.l/PW)×floor(C.w/PL);   // 托盘旋转 90°
baseCount = max(aN,bN); orientation = (aN>=bN)?'0°':'90°'
stack = (2×ph <= C.h) ? 2 : 1        // 可双层叠托盘
totalPallets = baseCount × stack
totalBoxes   = totalPallets × perPallet
totalPCS     = totalBoxes × Q
totalWeight  = totalPallets × palletWeight
fill         = 占用体积 / 箱内容积
if (totalWeight > container.maxPayload) return null   // 港口限重剪枝
```

### Stage 3.5 — 编排器 `compute`
- 对每个 Stage1 外箱候选 → 算 Stage2 托盘载 → 算 Stage3 箱装载。
- 用 `signature`（外尺寸+层数+托盘数+总 PCS）去重。
- 按 `totalPCS` 降序取 **Top 10** 候选，展示在左侧列表供选择。

### 3D 可视化（Mode B 双视口）
- 左视口「外箱拼箱透视」：半透明玻璃箱 + 内部分格产品块（`nx×ny×nz`），按 SKU 调色板 `PALETTE` 着色。
- 右视口「托盘打托堆叠」：木托盘底座 + 按 `pattern`、`layers` 摆放的堆叠箱阵。
- 两视口均有：默认网格地面（`GridHelper`，按物体尺寸自适应）、方向标（AxesHelper + 绿色 UP 箭头 + UP 文字）、OrbitControls 旋转、复位视角、PNG 导出（`preserveDrawingBuffer:true`）。
- 渲染循环用 `rafId` 守卫的 `startLoop/stopLoop`，解决 A↔B 切换时循环卡死问题。

---

## 4. 双模式共享 / 差异

| 维度 | Mode A | Mode B |
|------|--------|--------|
| 目标 | 集装箱内多 SKU 整车装载 | 单品→纸箱→托盘→集装箱整链路 |
| 输入 | 多 SKU 多箱型 | 单品 + 托盘型 + 箱型 |
| 算法 | 人工装柜 3 阶段（砌墙/补层/补缝）+ 高度图支撑校验 | 三级解析枚举（整数分解 + 地板除取整） |
| 输出 | 逐箱坐标 placement + 工人步骤 | Top 10 候选装载方案（箱数/托数/毛重/填充率） |
| 3D | 单体容器场景 | 双视口（外箱透视 + 托盘堆叠） |
| 代码耦合 | 独立 `app.js` | 独立 `pallet-optimizer.js`（零侵入 Mode A） |

---

## 5. 常见坑位（供接手者参考）

1. **Three.js 必须本地化**：曾因依赖 Cloudflare/jsDelivr CDN，国内网络下 A、B 3D 同时失效。现 `vendor/` 已落地，`lib-loader.js` 本地优先。
2. **Mode B 渲染循环**：不能用一次性 `loopStarted` 标志，否则切回 B 时 `animateB` 不再启动导致「看起来卡死」。已改为 `rafId` 守卫。
3. **HTML 脚本标签铁律**：底部必须 `<script src="app.js">` + `<script src="pallet-optimizer.js">`，不能用 `ego-app.js`。
4. **Logo 双轨**：见 §0 约定。EGO 由 `EGO_BRAND=true` + `assets/logo.png` 存在共同触发（server.js 动态注入 logo，无第二 HTML）；公开 SEAN 是默认。改前确认当前是「内网 EGO」还是「公开 SEAN」。
5. **尺寸单位**：Mode A 用 cm / kg；Mode B 用 **mm** / g（在 Stage1 转 kg）。两套坐标系独立，勿混。
6. **部署同步**：改 `index.html` / `pallet-optimizer.js` / `app.js` 后，记得同步 `deploy/`；容器改动需 `docker-compose up -d --build` 固化。

---

## 6. 快速验证清单

- Mode A：选箱型 → 录入 SKU → 计算 → 3D 可旋转 / 复位 / PNG；切换 40HQ 默认。
- Mode B：录入单品 → 选托盘/箱型 → 计算 → 左侧 Top10 列表 → 选一条 → 左右双视口 3D + 网格 + 方向标。
- 断外网（关 CDN）刷新页面，3D 仍正常（走 `vendor/`）。
