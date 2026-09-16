'use strict';
// =====================================================================
// 版本号同步脚本 (scripts/gen-version.js)
// =====================================================================
// 用法：npm run version:sync
//
// 做三件事：
//   1. 按「YYYYMMDD + 当天第 N 版字母」规则算出当前版本号
//   2. 写入 version.json（Docker 镜像内无 git 时的数据源、静态托管用）
//   3. 同步 index.html / deploy/index.html 的内嵌兜底值 data-version，
//      并把脚本引用的 ?v=xxx 刷成新版本号（自动 cache-busting）
//
// 建议流程：改完代码 → npm run version:sync → git add -A && git commit
// 这样 version.json 中的版本号与本次 commit 在当天 git 历史中的序号严格一致。
// =====================================================================
const fs = require('fs');
const path = require('path');
const V = require('../lib/version');

const pending = V.fromPending();
const version = pending.version;
const payload = {
  version: version,
  date: pending.date,
  seq: pending.seq,
  letter: pending.letter,
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(V.VERSION_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log('[version] version.json → ' + version + '  (当天第 ' + pending.seq + ' 版)');

// 同步 HTML：内嵌 data-version 兜底 + script 资源版本号
const targets = ['index.html', 'deploy/index.html'];
targets.forEach(function (rel) {
  const file = path.join(V.ROOT, rel);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(/(data-version=")[^"]*(")/, '$1' + version + '$2');   // 右下角角标兜底
  html = html.replace(/(\?v=)[A-Za-z0-9._-]+/g, '$1' + version);           // script cache-busting
  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('[version] ' + rel + ' → data-version / ?v= 已同步为 ' + version);
  } else {
    console.log('[version] ' + rel + ' 无需变更');
  }
});

// 静态托管包（deploy/）也放一份 version.json，供无后端环境读取
const deployCopy = path.join(V.ROOT, 'deploy', 'version.json');
if (fs.existsSync(path.dirname(deployCopy))) {
  fs.writeFileSync(deployCopy, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log('[version] deploy/version.json 已同步');
}

const headHash = V.git(['log', '-1', '--pretty=format:%h']);
const headSubj = V.git(['log', '-1', '--pretty=format:%s']);
console.log('[version] 当前 HEAD: ' + (headHash ? headHash + ' ' + headSubj : '(无 git 环境)'));
