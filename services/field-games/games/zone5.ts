import { wrapFieldGame } from '../base';

/**
 * Zone 5 — The Cave of Echoes (Pong game)
 *
 * A Pong rally where each volley reveals a truth from "you" or "them".
 * Metaphor: practicing the sacred exchange of communication.
 */
export function getZone5Html(): string {
  return wrapFieldGame({
    zone: 5,
    title: 'The Cave of Echoes',

    css: /* css */ `
/* ─── Zone 5 Variables ─── */
:root {
  --cave:#2A2035;--cave-light:#4A3A5A;
  --echo:#9A7ACC;
}

#game-area{background:linear-gradient(180deg,#1A1520 0%,#2A2035 40%,#3A2A45 70%,#2A2035 100%);}

/* Cave texture */
#game-area::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");opacity:.3;pointer-events:none;}

/* Echo ripples */
.echo-ring{position:absolute;border-radius:50%;border:1px solid rgba(154,122,204,.2);animation:echoRing 3s ease-out infinite;pointer-events:none;}
@keyframes echoRing{0%{transform:scale(0.5);opacity:.4}100%{transform:scale(2);opacity:0}}

/* Rally counter */
#rally-counter{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.7);border:1px solid rgba(154,122,204,.25);border-radius:8px;padding:8px 12px;text-align:center;}
.rally-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(18px,5vw,24px);color:var(--parchment);line-height:1;}
.rally-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(154,122,204,.45);margin-top:2px;}

/* Truth bubble floating */
#truth-display{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;opacity:0;transition:opacity .8s;pointer-events:none;}
#truth-display.show{opacity:1;}
.truth-bubble{background:rgba(42,32,53,.9);border:1px solid rgba(154,122,204,.3);border-radius:16px;padding:16px 24px;max-width:280px;text-align:center;}
.truth-text{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(15px,4vw,19px);color:var(--parchment);line-height:1.6;}
.truth-from{font-family:'GameMono',monospace;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:rgba(154,122,204,.5);margin-top:6px;}

/* Controls */
.ctrl-row{display:flex;gap:clamp(10px,3vw,16px);justify-content:center;}
.ctrl-btn{width:clamp(70px,20vw,90px);height:clamp(48px,13vw,60px);border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:clamp(20px,6vw,28px);transition:all .15s;-webkit-tap-highlight-color:transparent;}
.ctrl-btn:active{transform:scale(.94);}
.ctrl-btn.left{background:linear-gradient(135deg,rgba(196,97,110,.2),rgba(196,97,110,.1));border:2px solid rgba(196,97,110,.4);}
.ctrl-btn.right{background:linear-gradient(135deg,rgba(196,97,110,.2),rgba(196,97,110,.1));border:2px solid rgba(196,97,110,.4);}

/* Intro overlay */
#o-intro{background:linear-gradient(180deg,#1A1520,#2A2035);z-index:60;}
`,

    body: /* html */ `
  <div id="game-area">
    <canvas id="canvas"></canvas>

    <!-- Echo rings -->
    <div class="echo-ring" style="left:30%;top:40%;width:60px;height:60px;animation-delay:0s"></div>
    <div class="echo-ring" style="left:60%;top:30%;width:40px;height:40px;animation-delay:1s"></div>
    <div class="echo-ring" style="left:45%;top:60%;width:50px;height:50px;animation-delay:2s"></div>

    <!-- Truth display -->
    <div id="truth-display">
      <div class="truth-bubble">
        <div class="truth-text" id="truth-text"></div>
        <div class="truth-from" id="truth-from"></div>
      </div>
    </div>

    <div class="zone-label"><div class="zone-num">Zone V \u00b7 Step 5</div><div class="zone-name">The Cave of Echoes</div></div>
    <div id="rally-counter"><div class="rally-num" id="rally-count">0</div><div class="rally-lbl">RALLY</div></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">In this cave, every truth echoes back.</div>
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
      <div class="seed-note">A practice for sharing truth</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone V \u00b7 Step 5 \u2726</div>
    <div class="oi-ic">\ud83d\udd0a</div>
    <div class="oi-big">The Cave<br>of Echoes</div>
    <div class="oi-sub">Share our truths</div>
    <div class="oi-desc">In this cave, you practice the sacred exchange \u2014 sending your truth and receiving theirs.<br><br>Keep the rally going. Communication is not about winning. It is about keeping the exchange alive.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Sharing Truth</div>
        <div class="ps-h">Speaking<br>& Hearing</div>
        <div class="ps-body">Most couples talk <em>at</em> each other.<br><br>This practice is about talking <em>with</em> \u2014 sending truth that can be received, and receiving truth without defending.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Your Truth</div>
        <div class="ps-h">What You Have Not Said</div>
        <div class="ps-body">What is something true about your experience that your partner does not fully know?</div>
        <div class="ps-box">
          <div class="ps-lbl">SOMETHING I HAVE NOT FULLY SHARED IS...</div>
          <textarea class="ps-ta" placeholder="How scared I am... How much I need... What I wish you knew..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Their Truth</div>
        <div class="ps-h">What You Have Not Heard</div>
        <div class="ps-body">What might your partner be trying to tell you that you have not fully received?</div>
        <div class="ps-box">
          <div class="ps-lbl">THEY MIGHT BE TRYING TO SAY...</div>
          <textarea class="ps-ta" placeholder="That they feel alone... That they are trying... That they need something different..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">The Exchange</div>
        <div class="ps-h">The Sacred Rally</div>
        <div class="ps-body">Real communication is a rally, not a match. No one wins. You just keep it going \u2014 send, receive, send, receive.</div>
        <div class="ps-carry">
          Next time you speak:<br><br>
          <em>Speak to be understood, not to win.</em><br><br>
          Next time you listen:<br><br>
          <em>Listen to understand, not to respond.</em>
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83d\udd0a</div>
    <div class="done-ey">Zone V Complete</div>
    <div class="done-ti">The Cave of Echoes</div>
    <div class="done-bo">You learned the rally.<br>Truth sent. Truth received.<br>The echo carries forward.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// ─── Zone 5: The Cave of Echoes — Pong Game ───

// Truths that appear during rally
var TRUTHS_YOU = [
  "I feel alone sometimes",
  "I need to know I matter",
  "I get scared you will leave",
  "I wish you saw my effort",
  "I want to feel chosen"
];
var TRUTHS_THEM = [
  "I am trying my best",
  "I feel like I disappoint you",
  "I need space to process",
  "I want to be enough",
  "I am scared too"
];

// Game state
var S = {
  phase: 'intro',
  paddleX: 0.5, // 0-1 position
  partnerX: 0.5,
  ball: {x: 0.5, y: 0.5, vx: 0, vy: 0},
  rallyCount: 0,
  maxRally: 0,
  targetRally: 8,
  serving: true,
  gameLoop: null,
  lastHit: 'none',
  truthIndex: 0
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Colors
var COLORS = {
  you: '#C4616E',
  them: '#7294D4',
  ball: '#D4A843',
  ballGlow: 'rgba(212,168,67,0.3)'
};

// Sizing
var W, H, PADDLE_W, PADDLE_H, BALL_R;

function initCanvas() {
  var area = document.getElementById('game-area');
  W = area.clientWidth;
  H = area.clientHeight;
  canvas.width = W;
  canvas.height = H;

  PADDLE_W = W * 0.22;
  PADDLE_H = H * 0.025;
  BALL_R = Math.min(W, H) * 0.025;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Center line (faint)
  ctx.strokeStyle = 'rgba(154,122,204,0.15)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Partner paddle (top - blue)
  var partnerPx = S.partnerX * W - PADDLE_W / 2;
  ctx.fillStyle = COLORS.them;
  ctx.beginPath();
  ctx.roundRect(partnerPx, H * 0.08, PADDLE_W, PADDLE_H, 6);
  ctx.fill();

  // Your paddle (bottom - rose)
  var yourPx = S.paddleX * W - PADDLE_W / 2;
  ctx.fillStyle = COLORS.you;
  ctx.beginPath();
  ctx.roundRect(yourPx, H * 0.88, PADDLE_W, PADDLE_H, 6);
  ctx.fill();

  // Ball with glow
  var bx = S.ball.x * W;
  var by = S.ball.y * H;

  ctx.beginPath();
  ctx.arc(bx, by, BALL_R * 2, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.ballGlow;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.ball;
  ctx.fill();
}

function update() {
  if (S.serving) return;

  // Move ball
  S.ball.x += S.ball.vx;
  S.ball.y += S.ball.vy;

  // Wall bounce
  if (S.ball.x < 0.05 || S.ball.x > 0.95) {
    S.ball.vx *= -1;
    S.ball.x = Math.max(0.05, Math.min(0.95, S.ball.x));
  }

  // Partner AI - moves toward ball with some lag
  var partnerTarget = S.ball.x;
  S.partnerX += (partnerTarget - S.partnerX) * 0.08;

  // Check paddle collisions
  var ballTop = S.ball.y - BALL_R / H;
  var ballBottom = S.ball.y + BALL_R / H;

  // Your paddle (bottom)
  if (ballBottom > 0.88 && S.ball.vy > 0) {
    var paddleLeft = S.paddleX - (PADDLE_W / W) / 2;
    var paddleRight = S.paddleX + (PADDLE_W / W) / 2;

    if (S.ball.x > paddleLeft && S.ball.x < paddleRight) {
      S.ball.vy *= -1;
      S.ball.y = 0.87;

      // Add spin based on where it hit the paddle
      var hitPos = (S.ball.x - S.paddleX) / ((PADDLE_W / W) / 2);
      S.ball.vx += hitPos * 0.008;

      if (S.lastHit !== 'you') {
        S.rallyCount++;
        S.lastHit = 'you';
        document.getElementById('rally-count').textContent = S.rallyCount;
        showTruth('them');
      }
    }
  }

  // Partner paddle (top)
  if (ballTop < 0.12 && S.ball.vy < 0) {
    var pLeft = S.partnerX - (PADDLE_W / W) / 2;
    var pRight = S.partnerX + (PADDLE_W / W) / 2;

    if (S.ball.x > pLeft - 0.05 && S.ball.x < pRight + 0.05) {
      S.ball.vy *= -1;
      S.ball.y = 0.13;

      if (S.lastHit !== 'them') {
        S.rallyCount++;
        S.lastHit = 'them';
        document.getElementById('rally-count').textContent = S.rallyCount;
        showTruth('you');
      }
    }
  }

  // Miss detection
  if (S.ball.y < 0 || S.ball.y > 1) {
    if (S.rallyCount >= S.targetRally) {
      completeGame();
    } else {
      // Reset for new rally
      S.maxRally = Math.max(S.maxRally, S.rallyCount);
      fadeD('\\u2014', 'Rally: ' + S.rallyCount + '\\n\\nThe exchange broke. Try again.');
      resetBall();
    }
  }

  // Check win condition
  if (S.rallyCount >= S.targetRally && S.lastHit === 'you') {
    completeGame();
  }

  draw();
}

function showTruth(from) {
  var truths = from === 'you' ? TRUTHS_YOU : TRUTHS_THEM;
  var text = truths[S.truthIndex % truths.length];
  S.truthIndex++;

  document.getElementById('truth-text').textContent = '"' + text + '"';
  document.getElementById('truth-from').textContent = from === 'you' ? '\\u2014 YOU' : '\\u2014 THEM';
  document.getElementById('truth-display').classList.add('show');

  setTimeout(function() {
    document.getElementById('truth-display').classList.remove('show');
  }, 3500);
}

function resetBall() {
  S.rallyCount = 0;
  S.lastHit = 'none';
  document.getElementById('rally-count').textContent = '0';

  S.ball = {x: 0.5, y: 0.5, vx: 0, vy: 0};
  S.serving = true;

  setTimeout(function() {
    S.serving = false;
    S.ball.vy = 0.012;
    S.ball.vx = (Math.random() - 0.5) * 0.008;
  }, 1000);
}

function movePaddle(dir) {
  S.paddleX = Math.max(0.15, Math.min(0.85, S.paddleX + dir * 0.08));
}

// Controls
document.getElementById('btn-left').addEventListener('click', function() { movePaddle(-1); });
document.getElementById('btn-right').addEventListener('click', function() { movePaddle(1); });

document.addEventListener('keydown', function(e) {
  if (S.phase !== 'game') return;
  if (e.key === 'ArrowLeft' || e.key === 'a') movePaddle(-1);
  if (e.key === 'ArrowRight' || e.key === 'd') movePaddle(1);
});

// Touch drag
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

// Game flow
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  document.getElementById('controls').style.display = 'block';

  resetBall();
  draw();

  fadeD('\\u2014', 'Keep the rally going.\\n\\nEach exchange reveals a truth.');

  S.gameLoop = setInterval(update, 16);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'done';

  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';

  fadeD('\\u2726', S.rallyCount + ' exchanges.\\n\\nYou kept the truth flowing between you.');
}

// Zone-specific practice: psPlant
function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. You know the rally.</div>';
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
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);
});

// Resize handler
window.addEventListener('resize', function() {
  if (S.phase === 'game') {
    initCanvas();
    draw();
  }
});
`
  });
}
