<div align="center">

# 智能装箱计算器 · Container Load Calculator

**外贸装箱优化工具：多 SKU 集装箱配载 + 单品→外箱→托盘三级联动打托，3D 可视化与装柜动画回放。**

</div>

> 一键计算最优装柜 / 打托方案，拖拽旋转查看 3D 码放，逐步回放装柜顺序，导出 A4 装柜指导单。

<div align="center">

[![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)](https://threejs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)

</div>

**关键词 / Keywords**：集装箱装箱计算 · 装箱优化 · 托盘打托 · 装柜动画 · 外贸装箱 ·
container packing · palletizing · 3D loading visualization · cargo loading plan ·
carton to pallet · shipping optimization

## 🚀 快速部署

### Docker（推荐）
```bash
docker compose up -d --build
# 访问 http://localhost:7002
```

### 本地运行
```bash
npm install
npm start
# 访问 http://localhost:7002
```

## ✨ 核心功能

### 🅰 模式 A · 多品混合装柜
- **多 SKU 配载**：同时装入多种规格外箱，自动枚举朝向与排布，求解最优装箱组合（20GP / 40GP / 40HQ / 45HQ）。
- **3D 可视化**：Three.js 实时渲染，支持轴测 / 顶视 / 正门 / 侧视切换，鼠标拖拽旋转、滚轮缩放、右键平移。
- **装柜动画与回放**：按真实装柜顺序（由柜内向外、逐列推进）播放 / 拖动进度条逐步回放，直观演示装箱过程。
- **重心校核**：自动计算重心偏移，提示偏重 / 倾覆风险，保证运输安全。
- **SKU 图例与明细**：按外箱汇总数量、体积、毛重，生成可打印的装柜清单。

### 🅱 模式 B · 单品 → 外箱 → 托盘
- **三级联动**：输入单品规格与目标 PCS，自动推导外箱尺寸与打托方案（列阵 / 交错 / 风车三种码垛图案，auto 自动择优）。
- **载具适配**：内置 US / EU / UK / AU / JP 标准托盘与多类集装箱约束（限重、边缘溢出、最大堆码层数）。
- **Top 10 候选方案**：按容积率、装箱数、重量均衡综合推荐，支持视角切换与 PNG 导出。

### 通用能力
- 📋 **Excel 批量导入**：从 Excel 复制单元格（Tab / 逗号 / 空格分隔）一键导入多行产品。
- 📄 **A4 装柜单导出**：生成打印友好的 A4 装柜指导单（汇总 / 3D 截图 / 重心 / 分步清单 / 图例）。
- 🌐 **公制 / 英制切换**：cm·kg 与 inch·lbs 即时换算，内核计算单位统一、显示随切换。
- 🌏 **中英双语**：界面完整 i18n，一键切换中文 / English。

## 🧰 技术栈

- **前端**：原生 HTML / CSS / JavaScript，核心算法 `app.js`（模式 A）与 `pallet-optimizer.js`（模式 B）
- **3D 渲染**：Three.js（本地 `vendor/`，含 OrbitControls），无外部依赖
- **运行**：Node.js + Express 静态服务（端口 7002），或直接 `docker compose` 部署
- **零后端逻辑**：纯前端计算，无数据库、无密钥、可离线运行

## 📁 目录结构

```
├── server.js            # Express 静态服务器（端口 7002）
├── app.js               # 模式 A 装箱算法 + 3D 渲染 + 装柜单导出
├── pallet-optimizer.js  # 模式 B 托盘优化（单品→外箱→托盘）
├── index.html           # 主页面
├── lib-loader.js        # 本地依赖加载（Three.js 多 CDN 兜底）
├── vendor/              # 本地 Three.js
├── Dockerfile / docker-compose.yml
└── package.json
```

## 🛠 使用流程

1. 选择 **模式 A** 录入多品外箱，或 **模式 B** 录入单品 → 外箱 → 托盘参数。
2. 点击计算，查看 3D 装载视图与 KPI（装载率、重心、箱数）。
3. 模式 A 可拖动回放进度条观看装柜动画；模式 B 可切换外箱 / 托盘视角。
4. 导出 A4 装柜指导单或 PNG 截图，用于现场作业与文档归档。

## 📡 API / 脚本

| 路径 | 说明 |
| --- | --- |
| `GET /` | 主应用页面 |
| `GET /health` | 健康检查（返回 `{ status: "ok" }`） |

## 🏗 算法要点

- 模式 A 对每种外箱枚举 6 朝向与行列层组合，最大化集装箱利用率并校验重心安全域。
- 模式 B 在托盘平面内枚举列阵 / 交错 / 风车码垛，结合限重、溢出与堆码约束选出 Top 10 方案。
- 全部计算在浏览器本地完成，输入即算，不上传任何数据。

## 🛠 FAQ

- **端口被占用？** 修改 `server.js` 中的 `PORT` 或环境变量 `PORT`。
- **3D 不显示？** 确保 `vendor/three.min.js` 与 `vendor/OrbitControls.js` 存在；`lib-loader.js` 会自动兜底。
- **单位如何切换？** 右上角切换公制 / 英制，显示层自动换算，计算内核始终使用 cm / kg。

## English

**Smart Container Load Calculator** — optimize mixed-SKU container packing and carton→pallet building (single-SKU stuffing) with interactive 3D visualization and step-by-step loading animation.

- **Mode A**: multi-SKU container loading with 3D view (iso / top / front / side), loading-sequence replay, and center-of-gravity safety check.
- **Mode B**: cascade optimization from item → carton → pallet with column / interlock / pinwheel patterns, ISO-pallet and container constraints.
- **Extras**: Excel paste import, printable A4 loading plan, metric / imperial toggle, and full Chinese / English i18n.

**Quick start**
```bash
docker compose up -d --build
# or: npm install && npm start
```

Pure front-end computation (Three.js + vanilla JS), no backend logic, no secrets — runs anywhere.

## License

MIT
