# 智能装箱计算器 (Container Calculator)

外贸智能装箱优化工具，输入产品外箱尺寸自动计算最优装柜方案，支持 3D 可视化。

## 技术栈

- **后端**: Node.js + Express
- **前端**: 原生 HTML/CSS/JS + Three.js 3D 渲染
- **部署**: Docker
- **端口**: 7002（规划迁移至 7004）

## 功能

- 📦 **自动装箱算法** — 3D 装柜优化，支持 20GP/40GP/40HQ/45HQ 集装箱
- 🧩 **多种产品类型** — 标准外箱、叠装、套装组件
- 🎯 **装载率优先** — 可设置目标装载率，自动匹配最优组合
- 🖥️ **3D 可视化** — 鼠标拖拽旋转、滚轮缩放、右键平移，直观查看装箱效果
- 🌐 **中英双语** — 完整 i18n 支持
- 📊 **装箱矩阵** — 每种集装箱单独装每种外箱的最大数量分析

## 目录结构

```
├── server.js            # Express 静态服务器
├── app.js               # 装箱算法核心逻辑
├── index.html           # 默认页面
├── ego-index.html       # EGO 品牌页面
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 快速启动

```bash
npm install
npm start
# 或
docker-compose up -d
```

访问 `http://192.168.1.246:7002`

## 注意事项

- `ego-index.html` 需引用 `app.js`（非 `ego-app.js`）
- 规划迁移端口至 7004
- 规划 3D 效果增强及左侧箱体功能
