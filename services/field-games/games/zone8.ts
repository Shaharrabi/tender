import { wrapFieldGame } from '../base';

/**
 * Zone 8 — The Ruins (Platformer)
 * Navigate crumbling ruins to collect broken pieces of trust.
 * Move carefully — fragile platforms crumble if you rush.
 */
export function getZone8Html(): string {
  return wrapFieldGame({
    zone: 8,
    title: 'The Ruins',

    css: /* css */ `
/* ─── Zone 8 Variables ─── */
:root {
  --ruin:#5A4A3A;--ruin-light:#7A6A5A;--dust:#A89A8A;
}

#game-area{background:linear-gradient(180deg,#4A4A5A 0%,#5A5A6A 30%,#6A6A7A 60%,#5A5040 80%,#4A4030 100%);}

/* Dust particles */
.dust{position:absolute;width:2px;height:2px;background:rgba(168,154,138,.4);border-radius:50%;animation:dustFloat 8s ease-in-out infinite;pointer-events:none;}
@keyframes dustFloat{0%,100%{transform:translateY(0) translateX(0)}25%{transform:translateY(-20px) translateX(10px)}50%{transform:translateY(-10px) translateX(-5px)}75%{transform:translateY(-30px) translateX(15px)}}

#pieces-counter{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.6);border:1px solid rgba(212,168,67,.25);border-radius:8px;padding:8px 12px;text-align:center;}
.pieces-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(16px,4.5vw,22px);color:var(--parchment);line-height:1;}
.pieces-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(212,168,67,.45);margin-top:2px;}

/* Warning flash */
#warning{position:absolute;inset:0;background:rgba(196,97,110,.3);opacity:0;pointer-events:none;transition:opacity .1s;}
#warning.flash{opacity:1;}

/* Platformer controls */
#controls{padding:clamp(6px,1.5vh,10px) clamp(14px,4vw,22px) clamp(12px,2.5vh,18px);}
.ctrl-row{display:flex;gap:clamp(10px,3vw,16px);justify-content:center;align-items:center;}
.ctrl-btn{width:clamp(60px,17vw,76px);height:clamp(48px,13vw,60px);border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:clamp(20px,6vw,28px);transition:all .15s;-webkit-tap-highlight-color:transparent;}
.ctrl-btn:active{transform:scale(.94);}
.ctrl-btn.move{background:linear-gradient(135deg,rgba(90,74,58,.2),rgba(90,74,58,.1));border:2px solid rgba(90,74,58,.4);}
.ctrl-btn.jump{background:linear-gradient(135deg,rgba(212,168,67,.25),rgba(212,168,67,.15));border:2px solid rgba(212,168,67,.5);color:var(--gold);}
.ctrl-speed{display:flex;flex-direction:column;align-items:center;gap:4px;padding:0 8px;}
.speed-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:1.5px;text-transform:uppercase;color:var(--warm-gray);}
.speed-bar{width:40px;height:6px;background:rgba(107,91,94,.15);border-radius:3px;overflow:hidden;}
.speed-fill{height:100%;background:var(--gold);border-radius:3px;transition:width .1s;}

/* Intro overlay ruins theme */
#o-intro{background:linear-gradient(180deg,#3A3A4A,#4A4A5A);z-index:60;}
.oi-b{color:rgba(168,154,138,.6);}
.oi-sub{color:rgba(168,154,138,.7);}
.oi-btn{border-color:rgba(168,154,138,.5);color:rgba(168,154,138,.85);}
.oi-btn:active{background:rgba(168,154,138,.15);}

/* Practice overlay ruins bg */
#practice-overlay{background:rgba(58,58,74,.96);}
.ps-carry{background:rgba(168,154,138,.12);color:var(--ruin);}

/* Done overlay ruins bg */
#o-done{background:rgba(58,58,74,.97);}
.done-ey{color:rgba(168,154,138,.6);}
`,

    body: /* html */ `
  <div id="game-area">
    <!-- Dust particles -->
    <div class="dust" style="left:15%;top:30%;animation-delay:0s"></div>
    <div class="dust" style="left:45%;top:20%;animation-delay:2s"></div>
    <div class="dust" style="left:75%;top:40%;animation-delay:4s"></div>
    <div class="dust" style="left:25%;top:60%;animation-delay:1s"></div>
    <div class="dust" style="left:85%;top:25%;animation-delay:3s"></div>

    <canvas id="canvas"></canvas>
    <div id="warning"></div>

    <div class="zone-label"><div class="zone-num">Zone VIII \u00b7 Step 8</div><div class="zone-name">The Ruins</div></div>
    <div id="pieces-counter"><div class="pieces-num" id="pieces">0</div><div class="pieces-lbl">GATHERED</div></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">Something was broken here.</div>
      </div>
    </div>

    <div id="controls">
      <div class="ctrl-row">
        <button class="ctrl-btn move" id="btn-left">\u2190</button>
        <button class="ctrl-btn jump" id="btn-jump">\u2191</button>
        <button class="ctrl-btn move" id="btn-right">\u2192</button>
        <div class="ctrl-speed">
          <div class="speed-lbl">CAREFUL</div>
          <div class="speed-bar"><div class="speed-fill" id="speed-fill" style="width:30%"></div></div>
        </div>
      </div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for preparing repair</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone VIII \u00b7 Step 8 \u2726</div>
    <div class="oi-ic">\ud83c\udfd9\ufe0f</div>
    <div class="oi-big">The Ruins</div>
    <div class="oi-sub">Prepare to repair harm</div>
    <div class="oi-desc">Here lie the broken pieces \u2014 trust that crumbled, words that wounded, moments that fractured.<br><br>Move carefully. Collect what was lost. Rushing makes things worse.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Preparing to Repair</div>
        <div class="ps-h">Before<br>You Begin</div>
        <div class="ps-body">Repair cannot be rushed. Before you try to fix what was broken, you must understand what you broke \u2014 and why.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Honesty</div>
        <div class="ps-h">What You Did</div>
        <div class="ps-body">Name the harm specifically. Not "I messed up" \u2014 but exactly what you did and how it affected them.</div>
        <div class="ps-box">
          <div class="ps-lbl">THE HARM I CAUSED WAS...</div>
          <textarea class="ps-ta" placeholder="When I... they felt... It damaged..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Understanding</div>
        <div class="ps-h">Why It Happened</div>
        <div class="ps-body">Not an excuse \u2014 but an understanding. What was going on inside you?</div>
        <div class="ps-box">
          <div class="ps-lbl">I DID IT BECAUSE I WAS FEELING...</div>
          <textarea class="ps-ta" placeholder="Scared... Overwhelmed... Defensive... Disconnected..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Ready to Repair</div>
        <div class="ps-carry">
          Repair is not about being forgiven.<br><br>
          It is about <em>showing up differently</em> \u2014 taking responsibility without defensiveness, listening without explaining.<br><br>
          You are preparing your heart, not your argument.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83d\udd27</div>
    <div class="done-ey">Zone VIII Complete</div>
    <div class="done-ti">The Ruins</div>
    <div class="done-bo">You gathered the pieces.<br>You moved with care.<br>Now you are ready to rebuild.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// ─── Platformer Ruins Game ───
var PIECE_LABELS = [
  "Trust", "Safety", "Connection", "Honesty",
  "Presence", "Patience", "Kindness"
];

var TARGET_PIECES = 6;

var S = {
  phase: 'intro',
  player: {x: 50, y: 0, vx: 0, vy: 0, grounded: false},
  platforms: [],
  pieces: [],
  collected: 0,
  speed: 0,
  moving: {left: false, right: false},
  gameLoop: null
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var W, H;

function initCanvas() {
  var area = document.getElementById('game-area');
  W = area.clientWidth;
  H = area.clientHeight;
  canvas.width = W;
  canvas.height = H;
}

function createLevel() {
  S.platforms = [];
  S.pieces = [];

  // Ground
  S.platforms.push({x: 0, y: H - 30, w: W, h: 30, stable: true});

  // Platforms at various heights
  var platformData = [
    {x: 20, y: H - 100, w: 80},
    {x: W - 120, y: H - 100, w: 100},
    {x: W/2 - 50, y: H - 160, w: 100, fragile: true},
    {x: 30, y: H - 220, w: 90},
    {x: W - 100, y: H - 280, w: 80},
    {x: W/2 - 40, y: H - 340, w: 80, fragile: true},
    {x: 60, y: H - 400, w: 70},
  ];

  platformData.forEach(function(p) {
    S.platforms.push({
      x: p.x, y: p.y, w: p.w, h: 16,
      stable: !p.fragile,
      fragile: p.fragile,
      crumble: 0
    });
  });

  // Pieces to collect (on platforms)
  var piecePositions = [
    {x: 50, y: H - 120},
    {x: W - 80, y: H - 120},
    {x: W/2, y: H - 180},
    {x: 70, y: H - 240},
    {x: W - 60, y: H - 300},
    {x: W/2, y: H - 360},
  ];

  piecePositions.forEach(function(p, i) {
    S.pieces.push({
      x: p.x, y: p.y,
      label: PIECE_LABELS[i % PIECE_LABELS.length],
      collected: false
    });
  });

  // Player start
  S.player = {x: 50, y: H - 60, vx: 0, vy: 0, grounded: false};
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Draw platforms
  S.platforms.forEach(function(p) {
    if (p.crumble >= 1) return; // Fully crumbled

    var alpha = p.fragile ? (1 - p.crumble * 0.7) : 1;

    // Platform body
    var grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    grad.addColorStop(0, 'rgba(122,106,90,' + alpha + ')');
    grad.addColorStop(1, 'rgba(90,74,58,' + alpha + ')');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 3);
    ctx.fill();

    // Cracks for fragile platforms
    if (p.fragile && p.crumble > 0) {
      ctx.strokeStyle = 'rgba(40,30,20,' + alpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x + p.w * 0.3, p.y);
      ctx.lineTo(p.x + p.w * 0.4, p.y + p.h);
      ctx.moveTo(p.x + p.w * 0.7, p.y);
      ctx.lineTo(p.x + p.w * 0.6, p.y + p.h);
      ctx.stroke();
    }

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,' + (0.15 * alpha) + ')';
    ctx.fillRect(p.x + 2, p.y + 1, p.w - 4, 2);
  });

  // Draw pieces
  S.pieces.forEach(function(p) {
    if (p.collected) return;

    // Glow
    ctx.beginPath();
    ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,168,67,0.2)';
    ctx.fill();

    // Piece
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#D4A843';
    ctx.fill();

    // Label
    ctx.font = '8px GameMono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(p.label.toUpperCase(), p.x, p.y + 24);
  });

  // Draw player
  var px = S.player.x;
  var py = S.player.y;

  // Shadow
  ctx.beginPath();
  ctx.ellipse(px, py + 18, 10, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  // Body
  ctx.fillStyle = '#C4616E';
  ctx.beginPath();
  ctx.roundRect(px - 8, py - 5, 16, 20, 4);
  ctx.fill();

  // Head
  ctx.fillStyle = '#D8A499';
  ctx.beginPath();
  ctx.arc(px, py - 12, 10, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  var p = S.player;

  // Speed tracking
  S.speed = Math.abs(p.vx);
  document.getElementById('speed-fill').style.width = Math.min(100, S.speed * 500) + '%';

  // Movement
  if (S.moving.left) p.vx = Math.max(p.vx - 0.3, -3);
  else if (S.moving.right) p.vx = Math.min(p.vx + 0.3, 3);
  else p.vx *= 0.85;

  // Gravity
  p.vy += 0.5;
  if (p.vy > 10) p.vy = 10;

  // Apply velocity
  p.x += p.vx;
  p.y += p.vy;

  // Bounds
  if (p.x < 10) p.x = 10;
  if (p.x > W - 10) p.x = W - 10;

  // Platform collision
  p.grounded = false;
  S.platforms.forEach(function(plat) {
    if (plat.crumble >= 1) return;

    if (p.x > plat.x - 8 && p.x < plat.x + plat.w + 8 &&
        p.y + 18 > plat.y && p.y + 18 < plat.y + plat.h + p.vy + 5 &&
        p.vy >= 0) {
      p.y = plat.y - 18;
      p.vy = 0;
      p.grounded = true;

      // Fragile platforms crumble when moving too fast
      if (plat.fragile) {
        if (S.speed > 1.5) {
          plat.crumble += 0.05;
          flashWarning();
          if (plat.crumble >= 1) {
            fadeD('\u2014', 'Too fast. The ground crumbles.\\n\\nSlow down.');
          }
        }
      }
    }
  });

  // Fall reset
  if (p.y > H + 50) {
    p.x = 50;
    p.y = H - 60;
    p.vx = 0;
    p.vy = 0;
    fadeD('\u2014', 'You fell. Begin again.\\n\\nPatience is part of the practice.');
  }

  // Piece collection
  S.pieces.forEach(function(piece) {
    if (piece.collected) return;
    var dist = Math.hypot(p.x - piece.x, p.y - piece.y);
    if (dist < 20) {
      piece.collected = true;
      S.collected++;
      document.getElementById('pieces').textContent = S.collected;

      fadeD('\u2726', '"' + piece.label + '"\\n\\nYou gathered a piece of what was broken.');

      if (S.collected >= TARGET_PIECES) {
        completeGame();
      }
    }
  });

  draw();
}

function flashWarning() {
  var w = document.getElementById('warning');
  w.classList.add('flash');
  setTimeout(function() { w.classList.remove('flash'); }, 100);
}

function jump() {
  if (S.player.grounded) {
    S.player.vy = -10;
    S.player.grounded = false;
  }
}

// Controls — touch + mouse for left/right
document.getElementById('btn-left').addEventListener('touchstart', function(e) { e.preventDefault(); S.moving.left = true; });
document.getElementById('btn-left').addEventListener('touchend', function() { S.moving.left = false; });
document.getElementById('btn-left').addEventListener('mousedown', function() { S.moving.left = true; });
document.getElementById('btn-left').addEventListener('mouseup', function() { S.moving.left = false; });
document.getElementById('btn-left').addEventListener('mouseleave', function() { S.moving.left = false; });

document.getElementById('btn-right').addEventListener('touchstart', function(e) { e.preventDefault(); S.moving.right = true; });
document.getElementById('btn-right').addEventListener('touchend', function() { S.moving.right = false; });
document.getElementById('btn-right').addEventListener('mousedown', function() { S.moving.right = true; });
document.getElementById('btn-right').addEventListener('mouseup', function() { S.moving.right = false; });
document.getElementById('btn-right').addEventListener('mouseleave', function() { S.moving.right = false; });

document.getElementById('btn-jump').addEventListener('click', jump);

document.addEventListener('keydown', function(e) {
  if (S.phase !== 'game') return;
  if (e.key === 'ArrowLeft' || e.key === 'a') S.moving.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') S.moving.right = true;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') jump();
});

document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') S.moving.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') S.moving.right = false;
});

// ─── Game Flow ───
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  createLevel();

  document.getElementById('controls').style.display = 'block';

  fadeD('\u2014', 'Move carefully. Fragile platforms crumble if you rush.\\n\\nCollect the pieces.');

  S.gameLoop = setInterval(update, 16);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'done';

  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';

  fadeD('\u2726', 'You gathered all the pieces.\\n\\nNow you are ready to repair.');
}

function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\ud83c\udf31 Seed planted. You are ready to repair.</div>';
    BRIDGE.practiceComplete({});
    setTimeout(function() { document.getElementById('o-done').classList.add('on'); }, 800);
  }, 400);
}

function finish() {
  BRIDGE.complete();
}

// ─── Wire Events ───
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('intro-btn').addEventListener('click', begin);
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);
});

window.addEventListener('resize', function() {
  if (S.phase === 'game') {
    initCanvas();
    draw();
  }
});
`,
  });
}
