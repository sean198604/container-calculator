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

app.use(express.static(path.join(__dirname), { maxAge: 0, setHeaders: noCache }));

// 默认页面
app.get('/', (req, res) => {
  noCache(res);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Container Calculator running on port ${PORT}`);
});
