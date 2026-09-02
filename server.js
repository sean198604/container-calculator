const express = require('express');
const path = require('path');
const fs = require('fs');

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

// 品牌双轨——单一 index.html + 后端动态注入 logo（无第二份 HTML）：
// - EGO 激活条件：EGO_BRAND=true 且 assets/logo.png 存在（EGO logo 不进公开仓库，由内网部署方放入）
// - 激活时把 index.html(SEAN) 中 logo.jpg / SEAN Logo 动态替换为 logo.png / EGO International Logo
// - 未激活或文件缺失 → 原样返回 index.html(SEAN)：公开仓库 clone 后 docker-compose up 即用；静态托管不受影响
const INDEX_FILE = path.join(__dirname, 'index.html');
const EGO_LOGO_FILE = path.join(__dirname, 'assets', 'logo.png');

function isEgoActive() {
  return process.env.EGO_BRAND === 'true' && fs.existsSync(EGO_LOGO_FILE);
}

app.get('/', (req, res) => {
  noCache(res);
  let html = fs.readFileSync(INDEX_FILE, 'utf8');
  if (isEgoActive()) {
    html = html.split('assets/logo.jpg').join('assets/logo.png')
               .split('alt="SEAN Logo"').join('alt="EGO International Logo"');
  }
  res.type('html').send(html);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Container Calculator running on port ${PORT}`);
});
