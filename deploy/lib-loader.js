// =====================================================================
// lib-loader.js — Resilient Three.js loader with multi-source fallback
// ---------------------------------------------------------------------
// Both Mode A and Mode B depend on Three.js + OrbitControls, which were
// previously hard-linked to Cloudflare / jsDelivr CDNs. In restricted
// networks those CDNs are often blocked, leaving BOTH 3D views dead while
// the rest of the UI keeps working (THREE is simply undefined).
//
// This loader tries several sources in order and only signals readiness
// once a WORKING THREE + THREE.OrbitControls pair is available:
//   1. China-friendly public CDNs (BootCDN, etc.)
//   2. jsDelivr / unpkg (with fastly mirrors)
//   3. Local ./vendor/ copy served by this very app (offline-safe)
//
// It dispatches:
//   window 'three-ready'  -> THREE is loaded and usable
//   window 'three-failed' -> all sources exhausted (UI shows a banner)
// and exposes window.__threeReady (a Promise) for consumers that prefer it.
// =====================================================================
(function () {
  'use strict';

  // Offline-first: try the local ./vendor/ copy first so the app works on a
  // disconnected intranet with zero external dependencies. Public CDNs remain
  // as fallbacks for environments where the local files are missing.
  var CORE = [
    'vendor/three.min.js',
    'https://cdn.bootcdn.net/ajax/libs/three.js/r128/three.min.js',
    'https://lib.baomidou.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
    'https://fastly.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
    'https://unpkg.com/three@0.128.0/build/three.min.js'
  ];

  var CONTROLS = [
    'vendor/OrbitControls.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://fastly.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js'
  ];

  function loadFirst(urls, test) {
    return new Promise(function (resolve, reject) {
      var i = 0;
      (function next() {
        if (i >= urls.length) { reject(new Error('all sources failed')); return; }
        var url = urls[i++];
        var s = document.createElement('script');
        s.src = url;
        s.onload = function () {
          if (test()) resolve(url);
          else { if (s.parentNode) s.parentNode.removeChild(s); next(); }
        };
        s.onerror = function () { next(); };
        document.head.appendChild(s);
      })();
    });
  }

  function showBanner() {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:9999;' +
      'background:#ef4444;color:#fff;padding:10px 16px;border-radius:6px;font:13px/1.5 sans-serif;' +
      'max-width:92%;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.25)';
    el.innerHTML = '⚠ 3D 引擎 (Three.js) 加载失败：所有 CDN 均不可达。请将 <b>three.min.js</b> 与 ' +
      '<b>OrbitControls.js</b> 放入本应用的 <b>vendor/</b> 目录后刷新（离线可用）。';
    (document.body || document.documentElement).appendChild(el);
  }

  window.__threeReady = (function () {
    if (window.THREE && window.THREE.OrbitControls) return Promise.resolve('cached');
    return loadFirst(CORE, function () { return !!window.THREE; })
      .then(function () {
        return loadFirst(CONTROLS, function () { return !!(window.THREE && window.THREE.OrbitControls); });
      })
      .then(function () { window.dispatchEvent(new Event('three-ready')); return 'ok'; })
      .catch(function (e) {
        console.error('[lib-loader] Three.js failed to load from all sources:', e);
        window.dispatchEvent(new Event('three-failed'));
        return 'failed';
      });
  })();

  window.addEventListener('three-failed', function () {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  });
})();
