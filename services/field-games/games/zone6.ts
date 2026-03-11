import { wrapFieldGame } from '../base';

/**
 * Zone 6 — The Wall (Breakout / brick-breaker)
 *
 * Break the wall of enemy stories brick by brick.
 * Metaphor: dismantling the negative narratives we build about our partner.
 * When the wall breaks, you finally see each other.
 */
export function getZone6Html(): string {
  return wrapFieldGame({
    zone: 6,
    title: 'The Wall',

    css: /* css */ `
/* ─── Zone 6 Variables ─── */
:root {
  --wall:#6A5A4A;--wall-light:#8A7A6A;
}

#game-area{background:linear-gradient(180deg,#1A1A2A 0%,#2A2A3A 30%,#3A3A4A 60%,#2A2A3A 100%);}

/* Game canvas */
#canvas{image-rendering:pixelated;}

/* Bricks counter */
#bricks-counter{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.7);border:1px solid rgba(106,90,74,.25);border-radius:8px;padding:8px 12px;text-align:center;}
.bricks-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(16px,4.5vw,22px);color:var(--parchment);line-height:1;}
.bricks-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(138,122,106,.5);margin-top:2px;}

/* Break label — flashes brick text when broken */
#break-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;opacity:0;transition:opacity .3s;pointer-events:none;background:rgba(45,34,38,.85);border:1px solid rgba(212,168,67,.25);border-radius:12px;padding:8px 16px;max-width:200px;text-align:center;font-family:'GameSerif',serif;font-style:italic;font-size:clamp(11px,2.8vw,13px);color:var(--parchment);line-height:1.4;}
#break-label.show{opacity:1;}

/* Controls */
.ctrl-row{display:flex;gap:clamp(10px,3vw,16px);justify-content:center;}
.ctrl-btn{width:clamp(70px,20vw,90px);height:clamp(48px,13vw,60px);border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:clamp(20px,6vw,28px);transition:all .15s;-webkit-tap-highlight-color:transparent;}
.ctrl-btn:active{transform:scale(.94);}
.ctrl-btn.left{background:linear-gradient(135deg,rgba(196,97,110,.2),rgba(196,97,110,.1));border:2px solid rgba(196,97,110,.4);}
.ctrl-btn.right{background:linear-gradient(135deg,rgba(196,97,110,.2),rgba(196,97,110,.1));border:2px solid rgba(196,97,110,.4);}

/* See-moment overlay — avatars seeing each other after wall breaks */
#see-moment{position:absolute;inset:0;z-index:55;background:rgba(45,34,38,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;pointer-events:none;transition:opacity .8s;}
#see-moment.on{opacity:1;pointer-events:all;}
.see-title{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(14px,3.5vw,17px);color:var(--parchment);margin-bottom:clamp(20px,5vh,32px);line-height:1.7;}
.see-avatars{display:flex;gap:clamp(32px,10vw,56px);align-items:center;margin-bottom:clamp(20px,5vh,28px);}
.see-avatar{display:flex;flex-direction:column;align-items:center;gap:6px;}
.see-head{width:clamp(40px,12vw,52px);height:clamp(40px,12vw,52px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(18px,5vw,24px);}
.see-body{width:clamp(28px,8vw,36px);height:clamp(36px,10vw,44px);border-radius:8px 8px 14px 14px;}
.see-avatar.you .see-head{background:rgba(196,97,110,.25);border:2px solid var(--you);}
.see-avatar.you .see-body{background:linear-gradient(180deg,rgba(196,97,110,.3),rgba(196,97,110,.15));}
.see-avatar.them .see-head{background:rgba(114,148,212,.25);border:2px solid var(--them);}
.see-avatar.them .see-body{background:linear-gradient(180deg,rgba(114,148,212,.3),rgba(114,148,212,.15));}
.see-label{font-family:'GameMono',monospace;font-size:clamp(7px,1.8vw,9px);letter-spacing:2px;text-transform:uppercase;margin-top:4px;}
.see-avatar.you .see-label{color:var(--you);}
.see-avatar.them .see-label{color:var(--them);}
.see-between{font-size:clamp(20px,6vw,28px);color:rgba(212,168,67,.6);animation:seePulse 2s ease-in-out infinite;}
@keyframes seePulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}

/* Intro overlay */
#o-intro{background:linear-gradient(180deg,#1A1A2A,#2A2A3A);z-index:60;}
`,

    body: /* html */ `
  <div id="game-area">
    <canvas id="canvas"></canvas>

    <div id="break-label"></div>

    <div class="zone-label"><div class="zone-num">Zone VI \u00b7 Step 6</div><div class="zone-name">The Wall</div></div>
    <div id="bricks-counter"><div class="bricks-num" id="bricks-left">20</div><div class="bricks-lbl">BRICKS</div></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">Between you stands a wall of stories.</div>
      </div>
    </div>

    <div id="controls">
      <div class="ctrl-row">
        <button class="ctrl-btn left" id="btn-left">\u2190</button>
        <button class="ctrl-btn right" id="btn-right">\u2192</button>
      </div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for seeing past the wall</div>
    </div>
  </div>

  <div id="see-moment">
    <div class="see-title">The wall is gone.<br>You can finally see each other.</div>
    <div class="see-avatars">
      <div class="see-avatar you">
        <div class="see-head">\ud83d\ude4f</div>
        <div class="see-body"></div>
        <div class="see-label">YOU</div>
      </div>
      <div class="see-between">\u2726</div>
      <div class="see-avatar them">
        <div class="see-head">\ud83d\ude4f</div>
        <div class="see-body"></div>
        <div class="see-label">THEM</div>
      </div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone VI \u00b7 Step 6 \u2726</div>
    <div class="oi-ic">\ud83e\uddf1</div>
    <div class="oi-big">The Wall</div>
    <div class="oi-sub">Dismantle the enemy story</div>
    <div class="oi-desc">Between you and your partner stands a wall \u2014 built brick by brick from the stories you tell about them.<br><br>Break it down. See what is actually on the other side.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Seeing Past the Wall</div>
        <div class="ps-h">The Enemy<br>Story</div>
        <div class="ps-body">We all build a story about our partner \u2014 one where they are the problem.<br><br>This practice asks you to notice that story and look behind it.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Your Story</div>
        <div class="ps-h">What I Tell Myself</div>
        <div class="ps-body">What is the story you carry about your partner when things are hard?</div>
        <div class="ps-box">
          <div class="ps-lbl">THE STORY I TELL MYSELF IS...</div>
          <textarea class="ps-ta" id="ps-input-1" placeholder="They don't care... They never listen... They always..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Behind the Wall</div>
        <div class="ps-h">What Might Be True</div>
        <div class="ps-body">If you could see past the story \u2014 what might actually be going on for them?</div>
        <div class="ps-box">
          <div class="ps-lbl">BEHIND THE WALL, THEY MIGHT BE...</div>
          <textarea class="ps-ta" id="ps-input-2" placeholder="scared... trying... overwhelmed... hurting too..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">See Them</div>
        <div class="ps-carry">
          The enemy story protects you from vulnerability.<br><br>
          Next time you feel it rising, pause and ask:<br>
          <em>"What if they are not the enemy?"</em><br><br>
          See the person, not the story.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83e\uddf1</div>
    <div class="done-ey">Zone VI Complete</div>
    <div class="done-ti">The Wall</div>
    <div class="done-bo">You broke down the wall.<br>The stories are not the truth.<br>Now you can see each other.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// ─── Zone 6: The Wall — Breakout / Brick-Breaker ───

// Enemy story labels on each brick
var BRICK_LABELS = [
  "they don't care",
  "they never listen",
  "they always criticize",
  "they're selfish",
  "they don't try",
  "they shut me out",
  "they don't respect me",
  "they'll never change",
  "they do it on purpose",
  "they're the problem",
  "they don't understand",
  "they always blame me",
  "they're cold",
  "they don't love me",
  "they're impossible",
  "they never apologize",
  "they take me for granted",
  "they don't see me",
  "they're too controlling",
  "they just don't get it"
];

// Game state
var S = {
  phase: 'intro',
  paddleX: 0.5,
  partnerX: 0.5,
  balls: [],
  bricks: [],
  bricksLeft: 20,
  gameLoop: null
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Dimensions (recalculated on init/resize)
var W, H, PADDLE_W, PADDLE_H, BALL_R;
var BRICK_ROWS = 4;
var BRICK_COLS = 5;
var BRICK_W, BRICK_H, BRICK_PAD, BRICK_OFFSET_X, BRICK_OFFSET_Y;

function initCanvas() {
  var area = document.getElementById('game-area');
  W = area.clientWidth;
  H = area.clientHeight;
  canvas.width = W;
  canvas.height = H;

  PADDLE_W = W * 0.22;
  PADDLE_H = H * 0.025;
  BALL_R = Math.min(W, H) * 0.02;

  // Brick layout
  BRICK_PAD = 4;
  BRICK_W = (W - BRICK_PAD * (BRICK_COLS + 1)) / BRICK_COLS;
  BRICK_H = H * 0.045;
  BRICK_OFFSET_X = BRICK_PAD;
  BRICK_OFFSET_Y = H * 0.2;
}

function createBricks() {
  S.bricks = [];
  var idx = 0;
  for (var r = 0; r < BRICK_ROWS; r++) {
    for (var c = 0; c < BRICK_COLS; c++) {
      S.bricks.push({
        x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_PAD),
        y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_PAD),
        w: BRICK_W,
        h: BRICK_H,
        alive: true,
        label: BRICK_LABELS[idx % BRICK_LABELS.length],
        row: r
      });
      idx++;
    }
  }
  S.bricksLeft = BRICK_ROWS * BRICK_COLS;
  document.getElementById('bricks-left').textContent = S.bricksLeft;
}

function createBall(fromTop) {
  var ball = {
    x: W / 2,
    y: fromTop ? H * 0.15 : H * 0.82,
    vx: (Math.random() - 0.5) * 3,
    vy: fromTop ? 3.5 : -3.5
  };
  S.balls.push(ball);
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Draw bricks
  S.bricks.forEach(function(b) {
    if (!b.alive) return;

    // Row-based color gradient (darker = deeper story)
    var alpha = 0.5 + b.row * 0.15;
    ctx.fillStyle = 'rgba(106,90,74,' + alpha + ')';
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, 4);
    ctx.fill();

    // Brick border
    ctx.strokeStyle = 'rgba(138,122,106,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label text
    ctx.fillStyle = 'rgba(253,246,240,0.5)';
    ctx.font = Math.max(8, Math.min(10, b.w / 10)) + 'px GameSerif, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
  });

  // Partner paddle (top — blue / "them")
  var partnerPx = S.partnerX * W - PADDLE_W / 2;
  ctx.fillStyle = 'rgba(114,148,212,0.8)';
  ctx.beginPath();
  ctx.roundRect(partnerPx, H * 0.08, PADDLE_W, PADDLE_H, 6);
  ctx.fill();

  // Your paddle (bottom — rose / "you")
  var yourPx = S.paddleX * W - PADDLE_W / 2;
  ctx.fillStyle = 'rgba(196,97,110,0.9)';
  ctx.beginPath();
  ctx.roundRect(yourPx, H * 0.88, PADDLE_W, PADDLE_H, 6);
  ctx.fill();

  // Balls with glow
  S.balls.forEach(function(ball) {
    // Glow
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,168,67,0.2)';
    ctx.fill();

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = '#D4A843';
    ctx.fill();
  });
}

function update() {
  // Move partner paddle toward first ball (AI)
  if (S.balls.length > 0) {
    var target = S.balls[0].x / W;
    S.partnerX += (target - S.partnerX) * 0.06;
  }

  var toRemove = [];

  S.balls.forEach(function(ball, bi) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall bounce (left/right)
    if (ball.x - BALL_R < 0) {
      ball.x = BALL_R;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + BALL_R > W) {
      ball.x = W - BALL_R;
      ball.vx = -Math.abs(ball.vx);
    }

    // Your paddle (bottom)
    if (ball.vy > 0 && ball.y + BALL_R >= H * 0.88 && ball.y + BALL_R <= H * 0.88 + PADDLE_H + 4) {
      var pLeft = S.paddleX * W - PADDLE_W / 2;
      var pRight = S.paddleX * W + PADDLE_W / 2;
      if (ball.x >= pLeft && ball.x <= pRight) {
        ball.vy = -Math.abs(ball.vy);
        ball.y = H * 0.88 - BALL_R;
        // Add spin based on hit position
        var hitPos = (ball.x - S.paddleX * W) / (PADDLE_W / 2);
        ball.vx += hitPos * 1.5;
      }
    }

    // Partner paddle (top)
    if (ball.vy < 0 && ball.y - BALL_R <= H * 0.08 + PADDLE_H && ball.y - BALL_R >= H * 0.08 - 4) {
      var tLeft = S.partnerX * W - PADDLE_W / 2 - 8;
      var tRight = S.partnerX * W + PADDLE_W / 2 + 8;
      if (ball.x >= tLeft && ball.x <= tRight) {
        ball.vy = Math.abs(ball.vy);
        ball.y = H * 0.08 + PADDLE_H + BALL_R;
      }
    }

    // Brick collisions
    S.bricks.forEach(function(b) {
      if (!b.alive) return;
      if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + b.w &&
          ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + b.h) {
        b.alive = false;
        ball.vy *= -1;
        S.bricksLeft--;
        document.getElementById('bricks-left').textContent = S.bricksLeft;

        showBreakLabel(b.label);

        if (S.bricksLeft <= 0) {
          completeGame();
          return;
        }
      }
    });

    // Ball lost (top or bottom off screen)
    if (ball.y < -BALL_R * 2 || ball.y > H + BALL_R * 2) {
      toRemove.push(bi);
    }
  });

  // Remove lost balls (backwards to preserve indices)
  for (var i = toRemove.length - 1; i >= 0; i--) {
    S.balls.splice(toRemove[i], 1);
  }

  // Spawn new ball if none left
  if (S.balls.length === 0 && S.bricksLeft > 0 && S.phase === 'game') {
    // Alternate who spawns
    var fromTop = Math.random() > 0.5;
    createBall(fromTop);
  }

  draw();
}

var breakLabelTimer = null;
function showBreakLabel(text) {
  var el = document.getElementById('break-label');
  el.textContent = '\\u2717 "' + text + '"';
  el.classList.add('show');
  if (breakLabelTimer) clearTimeout(breakLabelTimer);
  breakLabelTimer = setTimeout(function() {
    el.classList.remove('show');
  }, 900);
}

function movePaddle(dir) {
  S.paddleX = Math.max(0.15, Math.min(0.85, S.paddleX + dir * 0.08));
}

// Touch drag controls on game-area
var touchActive = false;
document.getElementById('game-area').addEventListener('touchstart', function(e) {
  touchActive = true;
});
document.getElementById('game-area').addEventListener('touchmove', function(e) {
  if (!touchActive || S.phase !== 'game') return;
  var touch = e.touches[0];
  var rect = document.getElementById('game-area').getBoundingClientRect();
  S.paddleX = (touch.clientX - rect.left) / rect.width;
  S.paddleX = Math.max(0.15, Math.min(0.85, S.paddleX));
});
document.getElementById('game-area').addEventListener('touchend', function() {
  touchActive = false;
});

// Button controls
document.getElementById('btn-left').addEventListener('click', function() { movePaddle(-1); });
document.getElementById('btn-right').addEventListener('click', function() { movePaddle(1); });

// Keyboard controls
document.addEventListener('keydown', function(e) {
  if (S.phase !== 'game') return;
  if (e.key === 'ArrowLeft' || e.key === 'a') movePaddle(-1);
  if (e.key === 'ArrowRight' || e.key === 'd') movePaddle(1);
});

// ─── Game Flow ───
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  createBricks();
  document.getElementById('controls').style.display = 'block';

  S.balls = [];
  S.paddleX = 0.5;
  S.partnerX = 0.5;

  createBall(false);
  draw();

  fadeD('\\u2014', 'Break the wall between you.\\n\\nEvery brick is a story you tell about them.');

  S.gameLoop = setInterval(update, 16);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'see';

  document.getElementById('controls').style.display = 'none';

  fadeD('\\u2726', 'The wall is gone.');

  // Show see-moment overlay for 3.5s
  document.getElementById('see-moment').classList.add('on');
  setTimeout(function() {
    document.getElementById('see-moment').classList.remove('on');
    S.phase = 'done';
    document.getElementById('seed-btn').style.display = 'flex';
    fadeD('\\u2726', 'Without the wall, you see a person\\u2014not a story.');
  }, 3500);
}

// Zone-specific practice: ps-next-1 wiring (4 steps, 0-3)
function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. The wall stays down.</div>';
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

// Resize handler
window.addEventListener('resize', function() {
  if (S.phase === 'game') {
    initCanvas();
    // Recalculate brick positions
    BRICK_W = (W - BRICK_PAD * (BRICK_COLS + 1)) / BRICK_COLS;
    BRICK_OFFSET_X = BRICK_PAD;
    BRICK_OFFSET_Y = H * 0.2;
    var idx = 0;
    S.bricks.forEach(function(b) {
      var r = Math.floor(idx / BRICK_COLS);
      var c = idx % BRICK_COLS;
      b.x = BRICK_OFFSET_X + c * (BRICK_W + BRICK_PAD);
      b.y = BRICK_OFFSET_Y + r * (BRICK_H + BRICK_PAD);
      b.w = BRICK_W;
      idx++;
    });
    draw();
  }
});
`
  });
}
