/**
 * Zone 2 — The Window
 *
 * Nervous system regulation: navigate avatar through hyperarousal /
 * window-of-tolerance / hypoarousal zones using activate / calm / breathe controls.
 */
import { wrapFieldGame } from '../base';

export function getZone2Html(): string {
  return wrapFieldGame({
    zone: 2,
    title: 'The Window',

    /* ─── Zone-Specific CSS ─── */
    css: `
/* zone 2 custom vars */
:root { --hyper:#E85D4C; --hypo:#5C7FA3; --window:#6B9080; }

/* terrain (game-area) */
#game-area {
  background: linear-gradient(180deg,
    #E85D4C 0%, #D47A6A 15%, #C9A080 30%, #B8C4A0 42%,
    #8BB888 50%, #A0B8C8 58%, #7A98B4 70%, #5C7FA3 85%, #4A6890 100%);
}

.zone-line { position:absolute; left:0; right:0; height:2px; background:rgba(255,255,255,.15); pointer-events:none; }
.zone-line.top { top:30%; }
.zone-line.bottom { top:70%; }

.zone-marker { position:absolute; right:12px; font-family:'GameMono',monospace; font-size:clamp(7px,1.8vw,9px); letter-spacing:2px; text-transform:uppercase; pointer-events:none; }
.zone-marker.hyper { top:12%; color:rgba(232,93,76,.6); }
.zone-marker.window { top:48%; color:rgba(107,144,128,.7); }
.zone-marker.hypo { top:82%; color:rgba(92,127,163,.6); }

/* avatar */
#avatar { position:absolute; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; transition:top .5s cubic-bezier(.4,0,.2,1); z-index:10; }
.av-h { width:22px; height:22px; border-radius:50%; background:var(--parchment); transition:background .4s; }
.av-b { width:22px; height:18px; margin-top:-3px; background:#E8DDD0; border-radius:0 0 8px 8px; transition:background .4s; }
.av-s { width:14px; height:4px; border-radius:50%; background:rgba(0,0,0,.2); margin-top:3px; }

#avatar.hyper .av-h { background:#FFD4CC; }
#avatar.hyper .av-b { background:#FFB8AA; }
#avatar.window .av-h { background:#C8E0C4; }
#avatar.window .av-b { background:#A8D0A0; }
#avatar.hypo .av-h { background:#C4D8E8; }
#avatar.hypo .av-b { background:#A0C0D8; }

@keyframes breathe { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.1)} }
#avatar.breathing { animation:breathe 4s ease-in-out infinite; }

/* particles */
.particle { position:absolute; width:4px; height:4px; border-radius:50%; pointer-events:none; opacity:.6; }
@keyframes rise { from{transform:translateY(0);opacity:.6} to{transform:translateY(-80px);opacity:0} }
@keyframes fall { from{transform:translateY(0);opacity:.6} to{transform:translateY(80px);opacity:0} }
.particle.up { background:var(--hyper); animation:rise 3s ease-out infinite; }
.particle.down { background:var(--hypo); animation:fall 3s ease-out infinite; }

/* dialogue cue */
.dlg-cue { font-family:'GameMono',monospace; font-size:clamp(7px,1.8vw,9px); letter-spacing:2px; text-transform:uppercase; color:rgba(107,91,94,.4); text-align:right; margin-top:4px; animation:blink 2.4s ease-in-out infinite; }
.dlg-cue.hide { visibility:hidden; }
@keyframes blink { 0%,100%{opacity:.3} 55%{opacity:1} }

/* controls */
#controls { display:none; flex-direction:column; padding:clamp(6px,1.5vh,10px) clamp(14px,4vw,22px) clamp(12px,2.5vh,18px); gap:clamp(8px,2vw,12px); }
.ctrl-row { display:flex; gap:clamp(8px,2vw,12px); }
.ctrl-btn { flex:1; height:clamp(52px,14vw,64px); border:none; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer; font-family:'GameMono',monospace; font-size:clamp(7px,1.8vw,9px); letter-spacing:2px; text-transform:uppercase; transition:all .2s; -webkit-tap-highlight-color:transparent; }
.ctrl-btn:active { transform:scale(.96); }
.ctrl-btn.up { background:linear-gradient(180deg,rgba(232,93,76,.15),rgba(232,93,76,.08)); border:1.5px solid rgba(232,93,76,.3); color:var(--hyper); }
.ctrl-btn.up:active { background:rgba(232,93,76,.25); }
.ctrl-btn.down { background:linear-gradient(180deg,rgba(92,127,163,.08),rgba(92,127,163,.15)); border:1.5px solid rgba(92,127,163,.3); color:var(--hypo); }
.ctrl-btn.down:active { background:rgba(92,127,163,.25); }
.ctrl-btn.center { background:linear-gradient(135deg,var(--sage),#4A8A6E); border:none; color:white; }
.ctrl-btn.center:active { background:var(--sage); }
.ctrl-icon { font-size:clamp(16px,4.5vw,22px); line-height:1; }

/* state meter */
#state-meter { display:none; padding:0 clamp(14px,4vw,22px) clamp(10px,2vh,14px); }
.meter-wrap { background:linear-gradient(90deg,var(--hypo),var(--window) 40%,var(--window) 60%,var(--hyper)); border-radius:20px; height:clamp(8px,2vw,12px); position:relative; overflow:hidden; }
.meter-indicator { position:absolute; width:clamp(14px,3.5vw,18px); height:clamp(14px,3.5vw,18px); background:white; border-radius:50%; top:50%; transform:translate(-50%,-50%); box-shadow:0 2px 8px rgba(0,0,0,.3); transition:left .3s ease; }
.meter-labels { display:flex; justify-content:space-between; margin-top:6px; }
.meter-lbl { font-family:'GameMono',monospace; font-size:clamp(6px,1.5vw,8px); letter-spacing:1.5px; text-transform:uppercase; color:var(--warm-gray); }

/* intro overlay: zone 2 specific */
#o-intro { background:linear-gradient(180deg,#3A2A1A,#2A1A10); z-index:60; }
`,

    /* ─── HTML Body ─── */
    body: `
<div id="game-area">
  <div class="zone-line top"></div>
  <div class="zone-line bottom"></div>
  <div class="zone-marker hyper">&#8593; HYPERAROUSAL</div>
  <div class="zone-marker window">&mdash; WINDOW &mdash;</div>
  <div class="zone-marker hypo">&#8595; HYPOAROUSAL</div>
  <div id="avatar" style="top:50%">
    <div class="av-h"></div>
    <div class="av-b"></div>
    <div class="av-s"></div>
  </div>
  <div class="zone-label">
    <div class="zone-num">Zone II</div>
    <div class="zone-name">The Window</div>
  </div>
</div>

<div id="panel">
  <div id="dialogue">
    <div class="dlg-row">
      <div class="dlg-sym" id="dlg-sym">&mdash;</div>
      <div class="dlg-text" id="dlg-text">This is your nervous system terrain.</div>
    </div>
    <div class="dlg-cue hide" id="dlg-cue">TAP TO CONTINUE &#8250;</div>
  </div>
  <div id="state-meter">
    <div class="meter-wrap">
      <div class="meter-indicator" id="meter-dot" style="left:50%"></div>
    </div>
    <div class="meter-labels">
      <span class="meter-lbl">Shutdown</span>
      <span class="meter-lbl">Window</span>
      <span class="meter-lbl">Overwhelm</span>
    </div>
  </div>
  <div id="controls">
    <div class="ctrl-row">
      <button class="ctrl-btn up" id="btn-up"><span class="ctrl-icon">&#128293;</span>ACTIVATE</button>
      <button class="ctrl-btn down" id="btn-down"><span class="ctrl-icon">&#127754;</span>CALM</button>
    </div>
    <button class="ctrl-btn center" id="btn-center"><span class="ctrl-icon">&#127807;</span>FIND YOUR CENTER &middot; BREATHE</button>
  </div>
  <div id="seed-btn">
    <button id="seed-tap"><span>&#127793;</span> PICK UP THE SEED</button>
    <div class="seed-note">A practice for your window</div>
  </div>
</div>

<!-- INTRO OVERLAY -->
<div class="overlay on" id="o-intro">
  <div class="oi-b">&#10022; Zone II &#10022;</div>
  <div class="oi-ic">&#129695;</div>
  <div class="oi-big">The Window</div>
  <div class="oi-sub">Trust the relational field</div>
  <div class="oi-desc">Your nervous system has a window &mdash; a range where you can stay present, connected, and responsive.<br><br>Outside that window, everything becomes harder. Learn to find your way back.</div>
  <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
</div>

<!-- PRACTICE OVERLAY (shared structure from base) -->
<div id="practice-overlay">
  <div class="ps-inner">
    <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
    <button class="ps-x" id="ps-close">&#10005;</button>
    <div class="ps-step active" id="ps-0">
      <div class="ps-eyebrow">&#10022; Practice &middot; Window Awareness</div>
      <div class="ps-h">Know Your<br>Window</div>
      <div class="ps-body">The window of tolerance is where you can think clearly, feel your feelings, and stay connected to others.<br><br>Outside it, you are either too activated (fight/flight) or too shut down (freeze).</div>
      <button class="ps-btn" id="ps-next-0">CONTINUE</button>
    </div>
    <div class="ps-step" id="ps-1">
      <div class="ps-eyebrow">Signals</div>
      <div class="ps-h">Above the Window</div>
      <div class="ps-body">When you are above your window &mdash; hyperaroused &mdash; you might feel:<br><br>Racing heart. Racing thoughts. Anger. Anxiety. Urgency. The need to <em>do something</em>.</div>
      <div class="ps-box">
        <div class="ps-lbl">WHEN I AM ABOVE MY WINDOW, I NOTICE...</div>
        <textarea class="ps-ta" placeholder="my chest gets tight... I talk faster... I want to fix everything..." rows="2"></textarea>
      </div>
      <button class="ps-btn" id="ps-next-1">NEXT</button>
    </div>
    <div class="ps-step" id="ps-2">
      <div class="ps-eyebrow">Signals</div>
      <div class="ps-h">Below the Window</div>
      <div class="ps-body">When you are below your window &mdash; hypoaroused &mdash; you might feel:<br><br>Foggy. Numb. Disconnected. Empty. The urge to withdraw or disappear.</div>
      <div class="ps-box">
        <div class="ps-lbl">WHEN I AM BELOW MY WINDOW, I NOTICE...</div>
        <textarea class="ps-ta" placeholder="I go quiet... I feel far away... nothing seems to matter..." rows="2"></textarea>
      </div>
      <button class="ps-btn" id="ps-next-2">NEXT</button>
    </div>
    <div class="ps-step" id="ps-3">
      <div class="ps-eyebrow">Return</div>
      <div class="ps-h">Finding Center</div>
      <div class="ps-body">The breath is your doorway back. Not just any breath &mdash; but conscious, slow breath that tells your nervous system: <em>you are safe.</em></div>
      <div class="ps-carry"><strong>The 4-7-8 breath:</strong><br><br>Inhale for <em>4</em> counts.<br>Hold for <em>7</em> counts.<br>Exhale for <em>8</em> counts.<br><br>The long exhale activates your rest system.</div>
      <button class="ps-btn" id="ps-next-3">NEXT</button>
    </div>
    <div class="ps-step" id="ps-4">
      <div class="ps-eyebrow">Integration</div>
      <div class="ps-h">Carry This</div>
      <div class="ps-carry">When you feel yourself leaving your window &mdash; pause.<br><br>Ask: <em>"Am I above or below?"</em><br><br>Then: one slow breath. That is the return.</div>
      <button class="ps-btn" id="ps-plant">PLANT THIS SEED &#10022;</button>
    </div>
  </div>
</div>

<!-- DONE OVERLAY -->
<div id="o-done">
  <div class="done-g">&#127807;</div>
  <div class="done-ey">Zone II Complete</div>
  <div class="done-ti">The Window</div>
  <div class="done-bo">You found your window.<br>You learned to return.<br>This is the ground you stand on.</div>
  <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
</div>
`,

    /* ─── Game JavaScript ─── */
    js: `
var S = { running:false, phase:'intro', line:-1, position:50, inWindow:true, windowVisits:0, breathCount:0 };

var LINES = [
  { sym:'\\u2014', text:'This is your nervous system terrain.', cue:true },
  { sym:'\\u2014', text:'The green zone in the center is your window of tolerance.\\n\\nWhen you are inside it, you can think clearly. Feel clearly. Connect.', cue:true },
  { sym:'\\u2014', text:'Above it: hyperarousal.\\nAnxiety. Urgency. Racing thoughts.', cue:true },
  { sym:'\\u2014', text:'Below it: hypoarousal.\\nShutdown. Numbness. Disconnection.', cue:true },
  { sym:'\\u2726', text:'Your job is simple:\\nFind your way back to the window.', cue:true, startGame:true },
];

// ── Event Wiring ──
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('intro-btn').addEventListener('click', begin);
  document.getElementById('btn-up').addEventListener('click', moveUp);
  document.getElementById('btn-down').addEventListener('click', moveDown);
  document.getElementById('btn-center').addEventListener('click', findCenter);
  document.getElementById('seed-tap').addEventListener('click', openPractice);
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);

  document.getElementById('game-area').addEventListener('click', function() {
    if (!S.running || S.phase !== 'dialogue') return;
    var next = S.line + 1;
    if (next < LINES.length) showLine(next);
  });
});

function begin() {
  var el = document.getElementById('o-intro');
  el.style.opacity = '0';
  el.style.pointerEvents = 'none';
  setTimeout(function() { el.style.display = 'none'; }, 700);
  S.running = true;
  S.phase = 'dialogue';
  addParticles();
  setTimeout(function() { showLine(0); }, 500);
}

function addParticles() {
  var terrain = document.getElementById('game-area');
  for (var i = 0; i < 6; i++) {
    var p = document.createElement('div');
    p.className = 'particle up';
    p.style.left = (10 + Math.random() * 80) + '%';
    p.style.top = (5 + Math.random() * 20) + '%';
    p.style.animationDelay = (Math.random() * 3) + 's';
    terrain.appendChild(p);
  }
  for (var i = 0; i < 6; i++) {
    var p = document.createElement('div');
    p.className = 'particle down';
    p.style.left = (10 + Math.random() * 80) + '%';
    p.style.top = (75 + Math.random() * 15) + '%';
    p.style.animationDelay = (Math.random() * 3) + 's';
    terrain.appendChild(p);
  }
}

function showLine(i) {
  S.line = i;
  var d = LINES[i];
  fadeD(d.sym, d.text);
  var cueEl = document.getElementById('dlg-cue');
  if (d.cue) { cueEl.textContent = 'TAP TO CONTINUE \\u203A'; cueEl.classList.remove('hide'); }
  else { cueEl.classList.add('hide'); }
  if (d.startGame) setTimeout(startGame, 1500);
}

function startGame() {
  S.phase = 'game';
  document.getElementById('controls').style.display = 'flex';
  document.getElementById('state-meter').style.display = 'block';
  S.position = 15;
  updateAvatar();
  fadeD('\\u2014', 'You are above your window now.\\n\\nUse the buttons to find your way back.');
  document.getElementById('dlg-cue').classList.add('hide');
}

function moveUp() {
  if (S.phase !== 'game') return;
  S.position = Math.max(5, S.position - 12);
  updateAvatar();
  checkZone();
}

function moveDown() {
  if (S.phase !== 'game') return;
  S.position = Math.min(95, S.position + 12);
  updateAvatar();
  checkZone();
}

function findCenter() {
  if (S.phase !== 'game') return;
  var avatar = document.getElementById('avatar');
  avatar.classList.add('breathing');
  S.breathCount++;
  var diff = 50 - S.position;
  S.position += diff * 0.4;
  updateAvatar();
  setTimeout(function() {
    avatar.classList.remove('breathing');
    checkZone();
  }, 2000);
  fadeD('\\u2726', 'Breathe... The center is where you can stay present.');
  document.getElementById('dlg-cue').classList.add('hide');
}

function updateAvatar() {
  var avatar = document.getElementById('avatar');
  var meter = document.getElementById('meter-dot');
  avatar.style.top = S.position + '%';
  meter.style.left = (100 - S.position) + '%';
  avatar.classList.remove('hyper', 'window', 'hypo');
  if (S.position < 30) {
    avatar.classList.add('hyper');
    S.inWindow = false;
  } else if (S.position > 70) {
    avatar.classList.add('hypo');
    S.inWindow = false;
  } else {
    avatar.classList.add('window');
    if (!S.inWindow) S.windowVisits++;
    S.inWindow = true;
  }
}

function checkZone() {
  if (S.position >= 35 && S.position <= 65 && S.breathCount >= 2) {
    setTimeout(completeGame, 1200);
  } else if (S.position < 25) {
    fadeD('\\u2191', 'Too high. Your system is activated.\\nCalm, or find your center.');
    document.getElementById('dlg-cue').classList.add('hide');
  } else if (S.position > 75) {
    fadeD('\\u2193', 'Too low. Your system is shutting down.\\nActivate, or find your center.');
    document.getElementById('dlg-cue').classList.add('hide');
  } else if (S.inWindow && S.breathCount < 2) {
    fadeD('\\u2014', 'Good. You are in the window.\\nNow: breathe. Let yourself settle here.');
    document.getElementById('dlg-cue').classList.add('hide');
  }
}

function completeGame() {
  S.phase = 'done';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('state-meter').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';
  fadeD('\\u2726', 'You found it.\\n\\nThis is your window of tolerance.\\nRemember what it feels like.');
  document.getElementById('dlg-cue').classList.add('hide');
}

// ── Practice: psPlant (zone-specific completion) ──
function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. You know your window.</div>';
    BRIDGE.practiceComplete({});
    setTimeout(function() { document.getElementById('o-done').classList.add('on'); }, 800);
  }, 400);
}

function finish() {
  document.getElementById('o-done').classList.remove('on');
  fadeD('\\u2726', 'The window will always be here.\\nNow you know how to find it.');
  document.getElementById('dlg-cue').classList.add('hide');
  BRIDGE.complete();
}
`,
  });
}
