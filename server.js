const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7002;

app.use(express.static(path.join(__dirname)));

// 默认页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Container Calculator running on port ${PORT}`);
});
