/**
 * Field Games — Shared HTML base wrapper.
 *
 * All 12 zone games share ~60% of their CSS (overlays, panels, practice modals,
 * dialogue, seed buttons, done screens). This base extracts the common pieces
 * so each zone only provides its unique CSS, HTML body, and JS.
 */

export interface GameParts {
  /** Zone number (1-12) */
  zone: number;
  /** Zone title e.g. "The Fog Field" */
  title: string;
  /** CSS custom properties + game-specific styles */
  css: string;
  /** HTML body content (game area + panel + overlays) */
  body: string;
  /** Game JavaScript (runs after bridge injection) */
  js: string;
}

/**
 * Wrap zone-specific parts into a complete HTML document with RN bridge,
 * shared styles, and system font stack (no Google Fonts dependency).
 */
export function wrapFieldGame(parts: GameParts): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>THE FIELD — Zone ${parts.zone}: ${parts.title}</title>
<style>
/* ─── System Font Stack (no Google Fonts in WebView) ─── */
@font-face {
  font-family: 'GameSans';
  src: local('SF Pro Display'), local('Helvetica Neue'), local('Segoe UI'), local('Roboto');
  font-weight: 300 600;
}
@font-face {
  font-family: 'GameSerif';
  src: local('Georgia'), local('Times New Roman'), local('Palatino');
  font-weight: 400 700;
}
@font-face {
  font-family: 'GameMono';
  src: local('SF Mono'), local('Menlo'), local('Consolas');
  font-weight: 300 600;
}

/* ─── Reset ─── */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}

/* ─── Base Variables ─── */
:root {
  --parchment:#FDF6F0;--terracotta:#D8A499;--deep-rose:#8B3A4A;
  --ink:#2D2226;--warm-gray:#6B5B5E;--rose:#C4616E;
  --sage:#6B9080;--gold:#D4A843;
  --you:#C4616E;--them:#7294D4;
}

html,body{
  height:100%;width:100%;
  background:var(--ink);
  overflow:hidden;touch-action:none;
  -webkit-user-select:none;user-select:none;
  -webkit-tap-highlight-color:transparent;
}

body{
  display:flex;flex-direction:column;
  font-family:'GameSans',system-ui,sans-serif;
}

/* ─── Game Area ─── */
#game-area{
  flex:1;min-height:0;position:relative;overflow:hidden;
}
canvas{position:absolute;inset:0;}

/* ─── Zone Label ─── */
.zone-label{position:absolute;top:14px;left:14px;z-index:5;}
.zone-num{font-family:'GameMono',monospace;font-size:clamp(7px,1.8vw,9px);letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.45);}
.zone-name{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(10px,2.5vw,13px);letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.65);}

/* ─── Bottom Panel ─── */
#panel{
  background:var(--parchment);
  border-top:1px solid rgba(216,164,153,.35);
  flex-shrink:0;z-index:25;
  display:flex;flex-direction:column;
}

/* ─── Dialogue ─── */
#dialogue{padding:clamp(10px,2vh,16px) clamp(14px,4vw,22px) clamp(6px,1.5vh,10px);flex-shrink:0;}
.dlg-row{display:flex;gap:10px;align-items:flex-start;}
.dlg-sym{font-family:'GameMono',monospace;font-size:clamp(10px,2.5vw,12px);color:var(--terracotta);flex-shrink:0;margin-top:2px;width:14px;}
.dlg-text{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(12px,3vw,15px);line-height:1.65;color:var(--ink);white-space:pre-wrap;transition:opacity .25s;}

/* ─── Controls (generic) ─── */
#controls{display:none;padding:clamp(8px,2vh,12px) clamp(14px,4vw,22px) clamp(12px,2.5vh,18px);}
.ctrl-info{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(11px,2.8vw,13px);color:var(--warm-gray);text-align:center;}

/* ─── Seed Button ─── */
#seed-btn{display:none;flex-direction:column;align-items:center;padding:clamp(8px,2vh,12px) clamp(22px,6vw,32px) clamp(14px,3vh,20px);gap:8px;}
#seed-btn button{width:100%;height:clamp(52px,14vw,62px);border:none;border-radius:31px;background:linear-gradient(135deg,var(--sage),#4A8A6E);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(11px,2.8vw,13px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 6px 24px rgba(107,144,128,.45);animation:seedpulse 2.2s ease-in-out infinite;}
@keyframes seedpulse{0%,100%{box-shadow:0 6px 24px rgba(107,144,128,.4);}50%{box-shadow:0 6px 36px rgba(107,144,128,.7);}}
.seed-note{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(10px,2.5vw,12px);color:rgba(107,91,94,.45);text-align:center;}

/* ─── Intro Overlay ─── */
.overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(28px,6vw,48px);opacity:0;pointer-events:none;transition:opacity .7s ease;z-index:50;}
.overlay.on{opacity:1;pointer-events:all;}
.oi-b{font-family:'GameMono',monospace;font-size:clamp(8px,2vw,10px);letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:clamp(12px,3vh,18px);}
.oi-ic{font-size:clamp(36px,10vw,48px);margin-bottom:clamp(10px,2.5vh,16px);}
.oi-big{font-family:'GameSans',sans-serif;font-weight:300;font-size:clamp(28px,8vw,40px);letter-spacing:4px;text-transform:uppercase;color:var(--parchment);line-height:1.1;margin-bottom:8px;}
.oi-sub{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(12px,3.2vw,15px);color:rgba(255,255,255,.6);margin-bottom:clamp(18px,4vh,28px);}
.oi-desc{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(11px,2.8vw,13px);line-height:1.85;color:rgba(253,246,240,.35);margin-bottom:clamp(26px,6vh,40px);max-width:280px;}
.oi-btn{width:clamp(160px,48vw,190px);height:clamp(44px,11vw,52px);border-radius:26px;border:1.5px solid rgba(255,255,255,.4);background:transparent;font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.2vw,11px);letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.8);cursor:pointer;transition:all .3s;}
.oi-btn:active{background:rgba(255,255,255,.1);}

/* ─── Practice Overlay ─── */
#practice-overlay{position:absolute;inset:0;z-index:70;background:rgba(45,34,38,.96);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s;}
#practice-overlay.on{opacity:1;pointer-events:all;}
.ps-inner{width:min(340px,90vw);background:var(--parchment);border-radius:20px;overflow:hidden;position:relative;max-height:85vh;overflow-y:auto;}
.ps-bar{height:4px;background:rgba(107,91,94,.12);}
.ps-fill{height:100%;width:0;background:var(--sage);transition:width .4s;}
.ps-x{position:absolute;top:12px;right:14px;width:28px;height:28px;border-radius:14px;border:none;background:rgba(107,91,94,.08);font-size:14px;color:var(--warm-gray);cursor:pointer;z-index:2;}
.ps-step{display:none;padding:clamp(28px,6vw,40px) clamp(18px,5vw,26px) clamp(20px,4vh,28px);flex-direction:column;text-align:center;}
.ps-step.active{display:flex;animation:fadeUp .4s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.ps-eyebrow{font-family:'GameMono',monospace;font-size:clamp(7px,1.8vw,9px);letter-spacing:3px;text-transform:uppercase;color:var(--terracotta);margin-bottom:clamp(10px,2.5vh,16px);}
.ps-h{font-family:'GameSans',sans-serif;font-weight:300;font-size:clamp(20px,5.5vw,26px);letter-spacing:2px;text-transform:uppercase;color:var(--ink);line-height:1.15;margin-bottom:clamp(14px,3.5vh,22px);}
.ps-body{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(12px,3vw,14px);line-height:1.85;color:rgba(45,34,38,.65);margin-bottom:clamp(18px,4.5vh,28px);}
.ps-btn{width:100%;height:clamp(44px,11vw,52px);border:none;border-radius:26px;background:linear-gradient(135deg,var(--sage),#4A8A6E);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.2vw,11px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;}
.ps-box{background:rgba(107,91,94,.04);border-radius:12px;padding:clamp(12px,3vw,18px);margin-bottom:clamp(14px,3.5vh,22px);text-align:left;}
.ps-lbl{font-family:'GameMono',monospace;font-size:clamp(7px,1.8vw,9px);letter-spacing:2px;text-transform:uppercase;color:var(--warm-gray);margin-bottom:8px;}
.ps-ta{width:100%;border:none;background:transparent;font-family:'GameSerif',serif;font-style:italic;font-size:clamp(13px,3.2vw,15px);color:var(--ink);line-height:1.6;resize:none;outline:none;}
.ps-ta::placeholder{color:rgba(107,91,94,.35);}
.ps-carry{background:rgba(107,144,128,.1);border-radius:12px;padding:clamp(12px,3vw,18px);margin-bottom:clamp(18px,4.5vh,26px);font-family:'GameSerif',serif;font-style:italic;font-size:clamp(11px,2.8vw,13px);line-height:1.75;color:var(--sage);text-align:left;}
.ps-carry em{color:var(--deep-rose);font-style:normal;font-weight:600;}

/* ─── Done Overlay ─── */
#o-done{position:absolute;inset:0;z-index:80;background:rgba(45,34,38,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(28px,6vw,48px);opacity:0;pointer-events:none;transition:opacity .8s;}
#o-done.on{opacity:1;pointer-events:all;}
.done-g{font-size:clamp(36px,10vw,48px);margin-bottom:clamp(12px,3vh,20px);}
.done-ey{font-family:'GameMono',monospace;font-size:clamp(8px,2vw,10px);letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:clamp(6px,1.5vh,10px);}
.done-ti{font-family:'GameSans',sans-serif;font-weight:300;font-size:clamp(26px,8vw,36px);letter-spacing:4px;text-transform:uppercase;color:var(--parchment);line-height:1.1;margin-bottom:clamp(14px,3.5vh,24px);}
.done-bo{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(12px,3vw,14px);line-height:1.9;color:rgba(253,246,240,.5);margin-bottom:clamp(24px,6vh,40px);max-width:280px;}
.done-btn{width:clamp(200px,60vw,240px);height:clamp(46px,11vw,54px);border-radius:27px;border:none;background:linear-gradient(135deg,var(--sage),#4A8A6E);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(8px,2vw,10px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;}

/* ─── Game-specific CSS ─── */
${parts.css}
</style>
</head>
<body>
${parts.body}
<script>
// ─── RN WebView Bridge ───
var BRIDGE = {
  post: function(type, data) {
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, data: data || {} }));
      }
    } catch(e) { console.log('Bridge error:', e); }
  },
  ready: function() { this.post('game:ready'); },
  complete: function(score, practiceData) { this.post('game:complete', { score: score, practiceData: practiceData }); },
  practiceComplete: function(responses) { this.post('game:practice_complete', { responses: responses }); },
  close: function() { this.post('game:close'); }
};

// Shared helpers
function fadeD(sym, text) {
  var el = document.getElementById('dlg-text');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(function() {
    var symEl = document.getElementById('dlg-sym');
    if (symEl) symEl.textContent = sym;
    el.textContent = text;
    el.style.opacity = '1';
  }, 200);
}

// Practice overlay shared logic
var P = { step: 0 };
function openPractice() {
  P.step = 0;
  psShow(0);
  var fill = document.getElementById('ps-fill');
  if (fill) fill.style.width = '0%';
  var overlay = document.getElementById('practice-overlay');
  if (overlay) overlay.classList.add('on');
}
function closePractice() {
  var overlay = document.getElementById('practice-overlay');
  if (overlay) overlay.classList.remove('on');
}
function psGo(n) {
  psShow(n);
  var fill = document.getElementById('ps-fill');
  if (fill) fill.style.width = (n / 3 * 100) + '%';
}
function psShow(n) {
  document.querySelectorAll('.ps-step').forEach(function(el) { el.classList.remove('active'); });
  var step = document.getElementById('ps-' + n);
  if (step) step.classList.add('active');
  P.step = n;
}

// Wire shared practice events
document.addEventListener('DOMContentLoaded', function() {
  var seedTap = document.getElementById('seed-tap');
  if (seedTap) seedTap.addEventListener('click', openPractice);
  var psClose = document.getElementById('ps-close');
  if (psClose) psClose.addEventListener('click', closePractice);
  var psNext0 = document.getElementById('ps-next-0');
  if (psNext0) psNext0.addEventListener('click', function() { psGo(1); });
  var psNext1 = document.getElementById('ps-next-1');
  if (psNext1) psNext1.addEventListener('click', function() { psGo(2); });
  var psNext2 = document.getElementById('ps-next-2');
  if (psNext2) psNext2.addEventListener('click', function() { psGo(3); });
});

// ─── Game-specific JS ───
${parts.js}

// Signal ready
BRIDGE.ready();
</script>
</body>
</html>`;
}
