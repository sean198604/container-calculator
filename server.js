const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7002;

// 禁止浏览器缓存 html/js，避免折叠修复等前端改动被旧缓存掩盖
function noCache(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

// index:false —— 禁用 static 对 "/" 的默认 index.html 响应，让 app.get('/') 按 EGO_BRAND 品牌双轨分发
app.use(express.static(path.join(__dirname), { index: false, maxAge: 0, setHeaders: noCache }));

// 默认页面（品牌双轨：内网 7002 设 EGO_BRAND=true 返回 EGO 版 ego-index.html；
// GitHub 公开部署无此环境变量，默认返回 SEAN 版 index.html）
app.get('/', (req, res) => {
  noCache(res);
  const entry = process.env.EGO_BRAND === 'true' ? 'ego-index.html' : 'index.html';
  res.sendFile(path.join(__dirname, entry));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Container Calculator running on port ${PORT}`);
});
