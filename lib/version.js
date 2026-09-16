'use strict';
// =====================================================================
// 版本号唯一真源 (lib/version.js)
// =====================================================================
// 编码规则：YYYYMMDD + 当天第 N 版的字母
//   第 1 版 → A，第 2 版 → B … 第 26 版 → Z，第 27 版 → AA（超出再进位）
//   例：2026-09-16 当天的第 1 个提交（即当天第一版）→ 20260916A
//       2026-09-16 当天的第 3 个提交（即当天第三版）→ 20260916C
//
// 与 git 编号的对应关系（自动建立，无需手工维护）：
//   字母序号 = 该 commit 是「其提交日当天」的第几个 commit（按提交时间从早到晚）。
//   反查：版本号 20260916C → 当天第 3 个 commit → git log --since=2026-09-16T00:00:00 的第 3 条。
//   页面上同时展示短 hash，可与 GitHub 提交记录直接对上。
//
// 数据源优先级：
//   1) git 实时计算（本地开发 / 带 .git 的部署）——始终与仓库一致
//   2) version.json（Docker 镜像内无 git、或静态托管）——由 `npm run version:sync` 生成
//
// ⚠️ 实现注意：一律用 execFileSync + 参数数组调用 git。
//    不要用 execSync 拼字符串命令 —— Windows 下经 cmd.exe 会踩两个坑：
//      · "|" 被当成管道符、"--pretty=format:%H|%h" 里成对的 "%" 被当变量展开
//      · 带空格的参数被拆成多个 argv
// =====================================================================
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VERSION_FILE = path.join(ROOT, 'version.json');
const SEP = '\x01';   // git format 里用 %x01 输出，字段分隔用；不可用 "|"（shell 管道符）

// 执行 git（参数数组，绕过 shell）；无 git / 非仓库环境返回空串，静默降级
function git(args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000
    }).trim();
  } catch (e) {
    return '';
  }
}

// 序号 → 字母：1→A … 26→Z，27→AA，28→AB …
function seqToLetter(n) {
  let x = Math.max(1, Math.floor(Number(n)) || 1);
  let s = '';
  while (x > 0) {
    const r = (x - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

// 取指定日期（本地时区 YYYY-MM-DD）当天的提交，按时间【早 → 晚】排序
// 即：索引 0 = 当天第 1 版（A）、索引 1 = 第 2 版（B）…
function commitsOn(dateStr) {
  // 用 --since 粗筛（不能只靠 --until，边界秒会漏），再按 %cI 的日期前缀精确过滤
  const out = git([
    'log',
    '--since=' + dateStr + 'T00:00:00',
    '--pretty=format:%H%x01%h%x01%cI%x01%s'
  ]);
  if (!out) return [];
  return out.split('\n')
    .filter(Boolean)
    .map(function (line) {
      const p = line.split(SEP);
      return {
        full: p[0] || '',
        short: p[1] || '',
        time: p[2] || '',
        subject: p.slice(3).join(SEP)
      };
    })
    .filter(function (c) { return c.time.slice(0, 10) === dateStr; })
    .reverse();   // git log 是「新 → 旧」，反转成「早 → 晚」
}

// 本地时区的今天，格式 YYYY-MM-DD
function todayLocal() {
  const d = new Date();
  const p = function (n) { return String(n).padStart(2, '0'); };
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function build(dateStr, seq, c) {
  const letter = seqToLetter(seq);
  return {
    version: dateStr.replace(/-/g, '') + letter,
    date: dateStr,
    seq: seq,
    letter: letter,
    commit: (c && c.short) || '',
    commitFull: (c && c.full) || '',
    commitTime: (c && c.time) || '',
    commitSubject: (c && c.subject) || '',
    source: 'git'
  };
}

// 已发布版本：以 HEAD 提交为准（HEAD 是其提交日当天的第几版 → 字母）
function fromHead() {
  const headFull = git(['rev-parse', 'HEAD']);
  if (!headFull) return null;
  const dateStr = git(['log', '-1', '--pretty=format:%cd', '--date=short']);
  if (!dateStr) return null;
  const list = commitsOn(dateStr);
  let idx = list.findIndex(function (c) { return c.full === headFull; });
  if (idx < 0) idx = list.length - 1;      // 兜底：当作当天最后一版
  return build(dateStr, idx + 1, list[idx]);
}

// 待发布版本：当天已有提交数 +（工作区有未提交改动 → 算上即将产生的这一版）
// 提交后 fromHead() 会得到同一结果，二者自洽
function fromPending() {
  const dateStr = todayLocal();
  const list = commitsOn(dateStr);
  const dirty = git(['status', '--porcelain']) !== '';
  const seq = Math.max(1, list.length + (dirty ? 1 : 0));
  return build(dateStr, seq, list[list.length - 1]);
}

function fromFile() {
  try {
    const j = JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
    if (!j || !j.version) return null;
    j.source = 'file';
    return j;
  } catch (e) {
    return null;
  }
}

let _cache = { at: 0, data: null };

// 对外主入口：带缓存（默认 5s），避免每次请求都 fork git
function getVersion(ttl) {
  const now = Date.now();
  const limit = ttl == null ? 5000 : ttl;
  if (_cache.data && now - _cache.at < limit) return _cache.data;
  const data = fromHead() || fromFile() || { version: 'unknown', source: 'none' };
  _cache = { at: now, data: data };
  return data;
}

module.exports = {
  ROOT: ROOT,
  VERSION_FILE: VERSION_FILE,
  git: git,
  seqToLetter: seqToLetter,
  commitsOn: commitsOn,
  todayLocal: todayLocal,
  fromHead: fromHead,
  fromPending: fromPending,
  fromFile: fromFile,
  getVersion: getVersion
};
