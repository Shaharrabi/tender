import { wrapFieldGame } from '../base';

/**
 * Zone 9 — The Bridge
 *
 * A turn-based bridge building game on canvas.
 * Metaphor: rebuilding trust plank by plank, taking turns.
 */
export function getZone9Html(): string {
  return wrapFieldGame({
    zone: 9,
    title: 'The Bridge',

    css: /* css */ `
/* ─── Zone 9 Variables ─── */
:root {
  --wood:#8A6A4A;--wood-light:#AA8A6A;
}

#game-area{background:linear-gradient(180deg,#87CEEB 0%,#A8D8EA 40%,#C5E8D5 70%,#6B9A60 90%,#4A7A40 100%);}

/* Water shimmer across the gorge */
.water-shimmer{position:absolute;bottom:0;left:0;right:0;height:30%;background:linear-gradient(180deg,rgba(100,180,220,.15),rgba(60,140,200,.35));animation:wave 3s ease-in-out infinite;pointer-events:none;z-index:1;}
@keyframes wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

/* Progress display */
#progress-display{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.7);border:1px solid rgba(138,106,74,.3);border-radius:8px;padding:8px 12px;text-align:center;min-width:80px;}
.prog-bar{width:100%;height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;margin-bottom:4px;}
.prog-fill{height:100%;width:0;background:linear-gradient(90deg,var(--wood),var(--wood-light));border-radius:3px;transition:width .4s ease;}
.prog-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(212,168,67,.4);}

/* Action label */
#action-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:6;font-family:'GameSerif',serif;font-style:italic;font-size:clamp(13px,3.5vw,16px);color:var(--parchment);text-align:center;opacity:0;transition:opacity .4s;pointer-events:none;text-shadow:0 2px 8px rgba(0,0,0,.5);max-width:80%;line-height:1.6;}
#action-label.show{opacity:1;}

/* Build buttons */
.build-btn{flex:1;height:clamp(44px,12vw,54px);border:none;border-radius:14px;font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.4vw,11px);letter-spacing:2px;text-transform:uppercase;color:white;cursor:pointer;transition:all .2s;-webkit-tap-highlight-color:transparent;}
.build-btn:disabled{opacity:.35;cursor:default;transform:none !important;}
.build-btn:active:not(:disabled){transform:scale(.95);}
.build-btn.you{background:linear-gradient(135deg,var(--rose),var(--deep-rose));box-shadow:0 4px 16px rgba(196,97,110,.3);}
.build-btn.them{background:linear-gradient(135deg,var(--them),#5A7AB4);box-shadow:0 4px 16px rgba(114,148,212,.3);}

/* Meet moment overlay */
#meet-moment{position:absolute;inset:0;z-index:75;background:rgba(45,34,38,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(28px,6vw,48px);opacity:0;pointer-events:none;transition:opacity .8s;}
#meet-moment.on{opacity:1;pointer-events:all;}
.meet-avatars{display:flex;align-items:center;gap:clamp(14px,4vw,22px);margin-bottom:clamp(14px,3.5vh,24px);}
.meet-avatar{width:clamp(48px,14vw,64px);height:clamp(48px,14vw,64px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(22px,6vw,28px);}
.meet-avatar.you-av{background:rgba(196,97,110,.2);border:2px solid var(--rose);}
.meet-avatar.them-av{background:rgba(114,148,212,.2);border:2px solid var(--them);}
.meet-bridge{width:clamp(40px,12vw,60px);height:6px;background:linear-gradient(90deg,var(--wood),var(--wood-light));border-radius:3px;}
.meet-text{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(14px,3.8vw,18px);color:var(--parchment);line-height:1.7;}

/* Intro overlay background */
#o-intro{background:linear-gradient(180deg,#3A5A3A,#2A3A2A);z-index:60;}
`,

    body: /* html */ `
  <div id="game-area">
    <div class="water-shimmer"></div>
    <canvas id="canvas"></canvas>
    <div id="action-label"></div>
    <div class="zone-label"><div class="zone-num">Zone IX \u00b7 Step 9</div><div class="zone-name">The Bridge</div></div>
    <div id="progress-display">
      <div class="prog-bar"><div class="prog-fill" id="prog-fill"></div></div>
      <div class="prog-lbl">PLANKS LAID</div>
    </div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">A bridge is built from both sides.</div>
      </div>
    </div>

    <div id="controls">
      <div style="display:flex;gap:clamp(8px,2vw,12px)">
        <button class="build-btn you" id="btn-you" disabled>YOUR PIECE</button>
        <button class="build-btn them" id="btn-them" disabled>THEIR PIECE</button>
      </div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for rebuilding trust</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone IX \u00b7 Step 9 \u2726</div>
    <div class="oi-ic">\ud83c\udf09</div>
    <div class="oi-big">The<br>Bridge</div>
    <div class="oi-sub">Rebuild trust together</div>
    <div class="oi-desc">The gorge between you can only be crossed by building from both sides.<br><br>Take turns laying planks. Each one is an act of trust.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="meet-moment">
    <div class="meet-avatars">
      <div class="meet-avatar you-av">\ud83e\udec2</div>
      <div class="meet-bridge"></div>
      <div class="meet-avatar them-av">\ud83e\udec1</div>
    </div>
    <div class="meet-text">You meet in the middle.<br>The bridge holds.</div>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Rebuilding Trust</div>
        <div class="ps-h">Plank by<br>Plank</div>
        <div class="ps-body">Trust isn't rebuilt in grand gestures.<br><br>It's rebuilt in small, consistent acts \u2014 one plank at a time.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Reflection 1</div>
        <div class="ps-h">What Was<br>Broken</div>
        <div class="ps-body">What trust was damaged between you?<br>Name it simply, without blame.</div>
        <div class="ps-box">
          <div class="ps-lbl">THE TRUST THAT WAS HURT...</div>
          <textarea class="ps-ta" id="ps-input-1" placeholder="feeling safe to be vulnerable... believing promises... feeling prioritized..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Reflection 2</div>
        <div class="ps-h">One Small<br>Act</div>
        <div class="ps-body">What is one small, concrete thing you could do this week to lay a plank?</div>
        <div class="ps-box">
          <div class="ps-lbl">ONE THING I CAN DO...</div>
          <textarea class="ps-ta" id="ps-input-2" placeholder="follow through on a small promise... check in without being asked... be honest about a feeling..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Carry This</div>
        <div class="ps-carry">
          A bridge built from both sides meets in the middle.<br><br>
          You can only build your half. But you <em>can</em> build your half.<br><br>
          One plank. One act. One day at a time.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83c\udf09</div>
    <div class="done-ey">Zone IX Complete</div>
    <div class="done-ti">The Bridge</div>
    <div class="done-bo">You built from your side.<br>They built from theirs.<br>And in the middle \u2014 you met.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// ─── Zone 9: The Bridge — Turn-Based Bridge Building ───

// Trust-building actions
var ACTIONS_YOU = [
  "You lay a plank of honesty",
  "You lay a plank of patience",
  "You lay a plank of vulnerability",
  "You lay a plank of consistency",
  "You lay a plank of listening"
];
var ACTIONS_THEM = [
  "They lay a plank of openness",
  "They lay a plank of forgiveness",
  "They lay a plank of presence",
  "They lay a plank of understanding",
  "They lay a plank of trust"
];

var TOTAL_PLANKS = 10;

// State
var S = {
  phase: 'intro',
  yourPlanks: 0,
  theirPlanks: 0,
  canBuildYou: false,
  canBuildThem: false,
  actionIndex: 0
};

// Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var W = 0, H = 0;

function initCanvas() {
  var area = document.getElementById('game-area');
  W = area.clientWidth;
  H = area.clientHeight;
  canvas.width = W;
  canvas.height = H;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  var cliffW = W * 0.28;
  var cliffH = H * 0.55;
  var cliffY = H * 0.35;
  var bridgeY = cliffY + cliffH * 0.15;
  var bridgeH = 12;
  var gapStart = cliffW;
  var gapEnd = W - cliffW;
  var gapW = gapEnd - gapStart;

  // Left cliff
  ctx.fillStyle = '#5A4A3A';
  ctx.fillRect(0, cliffY, cliffW, cliffH);
  // Cliff top highlight
  ctx.fillStyle = '#7A6A5A';
  ctx.fillRect(0, cliffY, cliffW, 6);

  // Right cliff
  ctx.fillStyle = '#5A4A3A';
  ctx.fillRect(gapEnd, cliffY, cliffW, cliffH);
  ctx.fillStyle = '#7A6A5A';
  ctx.fillRect(gapEnd, cliffY, cliffW, 6);

  // Water below
  ctx.fillStyle = 'rgba(60,140,200,.25)';
  ctx.fillRect(gapStart, cliffY + 20, gapW, cliffH - 20);

  // Draw planks
  var totalPlanks = S.yourPlanks + S.theirPlanks;
  var plankW = gapW / TOTAL_PLANKS;
  for (var i = 0; i < totalPlanks; i++) {
    var px = gapStart + i * plankW;
    drawPlank(px, bridgeY, plankW, bridgeH);
  }

  // Draw avatars
  var avatarSize = Math.min(W * 0.08, 32);

  // Your avatar (left side, moves right as you build)
  var youX = gapStart - avatarSize * 0.4 + S.yourPlanks * plankW;
  drawAvatar(youX, bridgeY - avatarSize - 4, avatarSize, '#C4616E', 'you');

  // Their avatar (right side, moves left as they build)
  var themX = gapEnd - avatarSize * 0.6 - S.theirPlanks * plankW;
  drawAvatar(themX, bridgeY - avatarSize - 4, avatarSize, '#7294D4', 'them');
}

function drawPlank(x, y, w, h) {
  // Wood plank
  ctx.fillStyle = '#8A6A4A';
  ctx.fillRect(x + 1, y, w - 2, h);
  // Wood grain
  ctx.strokeStyle = 'rgba(170,138,106,.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 3, y + h * 0.3);
  ctx.lineTo(x + w - 3, y + h * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 3, y + h * 0.7);
  ctx.lineTo(x + w - 3, y + h * 0.7);
  ctx.stroke();
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.fillRect(x + 1, y, w - 2, 2);
}

function drawAvatar(x, y, size, color, who) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,.15)';
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size + 2, size * 0.35, size * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x + size * 0.2, y + size * 0.45, size * 0.6, size * 0.55, size * 0.15);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size * 0.3, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function buildYou() {
  if (!S.canBuildYou || S.phase !== 'game') return;
  S.yourPlanks++;
  S.actionIndex = (S.actionIndex + 1) % ACTIONS_YOU.length;
  S.canBuildYou = false;
  S.canBuildThem = false;
  updateButtons();
  draw();
  showAction(ACTIONS_YOU[S.actionIndex]);
  updateProgress();

  if (checkComplete()) return;

  // Partner auto-responds after delay
  setTimeout(function() {
    buildThem(true);
  }, 1200);
}

function buildThem(auto) {
  if (S.phase !== 'game') return;
  S.theirPlanks++;
  S.canBuildThem = false;
  draw();
  showAction(ACTIONS_THEM[S.actionIndex % ACTIONS_THEM.length]);
  updateProgress();

  if (checkComplete()) return;

  // Re-enable your button after their build
  setTimeout(function() {
    S.canBuildYou = true;
    updateButtons();
  }, 600);
}

function showAction(text) {
  var label = document.getElementById('action-label');
  label.textContent = text;
  label.classList.add('show');
  setTimeout(function() {
    label.classList.remove('show');
  }, 1800);
}

function updateButtons() {
  var btnYou = document.getElementById('btn-you');
  var btnThem = document.getElementById('btn-them');
  btnYou.disabled = !S.canBuildYou;
  // Partner button always disabled (auto-builds)
  btnThem.disabled = true;
}

function updateProgress() {
  var total = S.yourPlanks + S.theirPlanks;
  var pct = Math.min(total / TOTAL_PLANKS * 100, 100);
  document.getElementById('prog-fill').style.width = pct + '%';
}

function checkComplete() {
  var total = S.yourPlanks + S.theirPlanks;
  if (total >= TOTAL_PLANKS) {
    S.phase = 'meet';
    S.canBuildYou = false;
    S.canBuildThem = false;
    updateButtons();

    // Show meet-moment for 3 seconds
    setTimeout(function() {
      document.getElementById('meet-moment').classList.add('on');
      setTimeout(function() {
        document.getElementById('meet-moment').classList.remove('on');
        completeGame();
      }, 3000);
    }, 600);
    return true;
  }
  return false;
}

function completeGame() {
  S.phase = 'done';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';
  fadeD('\\u2726', 'The bridge is complete.\\nYou met in the middle.');
}

// Game flow
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  document.getElementById('controls').style.display = 'block';

  S.yourPlanks = 0;
  S.theirPlanks = 0;
  S.actionIndex = 0;
  S.canBuildYou = true;
  S.canBuildThem = false;
  updateButtons();
  updateProgress();
  draw();

  fadeD('\\u2014', 'Lay your plank. Then watch them lay theirs.\\nOne at a time, you build toward each other.');
}

// Zone-specific practice: psPlant + ps-next-1 wiring
function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. One plank at a time.</div>';
    BRIDGE.practiceComplete({});
    setTimeout(function() { document.getElementById('o-done').classList.add('on'); }, 800);
  }, 400);
}

function finish() {
  BRIDGE.complete();
}

// Event wiring
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('intro-btn').addEventListener('click', begin);
  document.getElementById('btn-you').addEventListener('click', buildYou);
  // Partner button is for display only; partner auto-builds
  document.getElementById('btn-them').addEventListener('click', function() {});
  // Practice step wiring (zone 9 has 4 steps: 0-3)
  var psNext1 = document.getElementById('ps-next-1');
  if (psNext1) psNext1.addEventListener('click', function() { psGo(2); });
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);
});

// Resize handler
window.addEventListener('resize', function() {
  if (S.phase === 'game' || S.phase === 'meet') {
    initCanvas();
    draw();
  }
});
`
  });
}
