import { wrapFieldGame } from '../base';

export function getZone10Html(): string {
  return wrapFieldGame({
    zone: 10,
    title: 'The Watchtower',

    css: /* css */ `
/* ─── Zone 10 Variables ─── */
:root {
  --sky-day:#7ABADC;--sky-dusk:#C4946A;--tower:#5A4A3A;
}

#game-area {
  background:linear-gradient(180deg,#5A8AAA 0%,#7ABADC 30%,#9ACAEC 50%,#7AA87A 75%,#5A8A5A 100%);
  transition:background 2s;
}

/* ─── Watch Counter ─── */
#watch-counter{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.5);border:1px solid rgba(212,168,67,.3);border-radius:8px;padding:8px 12px;text-align:center;}
.watch-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(16px,4.5vw,22px);color:var(--parchment);line-height:1;}
.watch-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(212,168,67,.5);margin-top:2px;}

/* ─── Awareness Bar ─── */
#awareness-bar{position:absolute;top:60px;right:14px;z-index:5;width:50px;height:120px;background:rgba(10,6,8,.4);border-radius:8px;padding:4px;display:flex;flex-direction:column-reverse;}
.awareness-fill{background:linear-gradient(180deg,var(--sage),#4A8A6A);border-radius:4px;transition:height .3s;width:100%;}
.awareness-lbl{position:absolute;bottom:-18px;left:0;right:0;font-family:'GameMono',monospace;font-size:6px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);text-align:center;}

/* ─── Intro Overlay (zone-specific colors) ─── */
#o-intro{background:linear-gradient(180deg,#3A5A7A,#4A6A8A);z-index:60;}
`,

    body: /* html */ `
  <div id="game-area">
    <canvas id="canvas"></canvas>

    <div class="zone-label"><div class="zone-num">Zone X \u00b7 Step 10</div><div class="zone-name">The Watchtower</div></div>
    <div id="watch-counter"><div class="watch-num" id="caught">0</div><div class="watch-lbl">CAUGHT</div></div>
    <div id="awareness-bar">
      <div class="awareness-fill" id="awareness-fill" style="height:100%"></div>
      <div class="awareness-lbl">AWARENESS</div>
    </div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">From here, you can see everything.</div>
      </div>
    </div>

    <div id="controls">
      <div class="ctrl-info">Tap the shadows before they reach the center</div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for staying aware</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone X \u00b7 Step 10 \u2726</div>
    <div class="oi-ic">\ud83d\uddfc</div>
    <div class="oi-big">The Watchtower</div>
    <div class="oi-sub">Maintain awareness</div>
    <div class="oi-desc">Old patterns do not disappear. They wait. They creep back when you stop paying attention.<br><br>From the watchtower, you can see them coming. Tap them before they take hold.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Maintaining Awareness</div>
        <div class="ps-h">The Watch<br>Never Ends</div>
        <div class="ps-body">Patterns return. Triggers reappear. The work is not to eliminate them \u2014 it is to see them coming and choose differently.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Early Signs</div>
        <div class="ps-h">Know Your Signals</div>
        <div class="ps-body">What are the early warning signs that your old pattern is returning?</div>
        <div class="ps-box">
          <div class="ps-lbl">I KNOW THE PATTERN IS COMING WHEN...</div>
          <textarea class="ps-ta" placeholder="I start getting critical... I withdraw... I feel that familiar tightness..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Intervention</div>
        <div class="ps-h">What You Will Do</div>
        <div class="ps-body">When you notice the pattern returning, what will you do differently?</div>
        <div class="ps-box">
          <div class="ps-lbl">WHEN I SEE IT COMING, I WILL...</div>
          <textarea class="ps-ta" placeholder="Pause and breathe... Name what I am feeling... Ask for a timeout..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Stay Watchful</div>
        <div class="ps-carry">
          Awareness is not a one-time achievement. It is a practice.<br><br>
          <em>Check in with yourself daily:</em><br>
          "What am I feeling? What patterns are stirring? What do I need?"<br><br>
          The watchtower is always open.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83d\udc41\ufe0f</div>
    <div class="done-ey">Zone X Complete</div>
    <div class="done-ti">The Watchtower</div>
    <div class="done-bo">You learned to watch.<br>You caught what was coming.<br>Keep your eyes open.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
var SHADOW_LABELS = [
  "Criticism", "Withdrawal", "Blame", "Defensiveness",
  "Contempt", "Stonewalling", "The old story", "Fear"
];

var TARGET_CAUGHT = 12;

var S = {
  phase: 'intro',
  shadows: [],
  caught: 0,
  missed: 0,
  awareness: 100,
  gameLoop: null,
  spawnTimer: 0
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var W, H, centerX, centerY;

function initCanvas() {
  var area = document.getElementById('game-area');
  W = area.clientWidth;
  H = area.clientHeight;
  canvas.width = W;
  canvas.height = H;
  centerX = W / 2;
  centerY = H * 0.45;
}

function spawnShadow() {
  var angle = Math.random() * Math.PI * 2;
  var dist = Math.max(W, H) * 0.6;

  S.shadows.push({
    x: centerX + Math.cos(angle) * dist,
    y: centerY + Math.sin(angle) * dist,
    targetX: centerX,
    targetY: centerY,
    speed: 0.008 + Math.random() * 0.004,
    size: 20 + Math.random() * 15,
    label: SHADOW_LABELS[Math.floor(Math.random() * SHADOW_LABELS.length)],
    alpha: 0,
    progress: 0
  });
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Draw tower
  var towerW = 60;
  var towerH = H * 0.35;
  var towerX = centerX - towerW / 2;
  var towerY = centerY - 20;

  // Tower base
  ctx.fillStyle = '#5A4A3A';
  ctx.beginPath();
  ctx.moveTo(towerX - 20, towerY + towerH);
  ctx.lineTo(towerX + towerW + 20, towerY + towerH);
  ctx.lineTo(towerX + towerW, towerY);
  ctx.lineTo(towerX, towerY);
  ctx.closePath();
  ctx.fill();

  // Tower top
  ctx.fillStyle = '#7A6A5A';
  ctx.beginPath();
  ctx.moveTo(towerX - 10, towerY);
  ctx.lineTo(towerX + towerW + 10, towerY);
  ctx.lineTo(towerX + towerW + 5, towerY - 15);
  ctx.lineTo(towerX - 5, towerY - 15);
  ctx.closePath();
  ctx.fill();

  // Lookout platform
  ctx.fillStyle = '#8A7A6A';
  ctx.fillRect(towerX - 15, towerY - 30, towerW + 30, 15);

  // Watcher figure
  ctx.fillStyle = '#4A3A2A';
  ctx.beginPath();
  ctx.arc(centerX, towerY - 45, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(centerX - 6, towerY - 37, 12, 15);

  // Draw shadows
  S.shadows.forEach(function(shadow) {
    var alpha = Math.min(shadow.alpha, 0.7);

    // Shadow body
    ctx.beginPath();
    ctx.arc(shadow.x, shadow.y, shadow.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(40,30,50,' + alpha + ')';
    ctx.fill();

    // Inner darkness
    ctx.beginPath();
    ctx.arc(shadow.x, shadow.y, shadow.size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20,10,30,' + alpha + ')';
    ctx.fill();

    // Label
    if (shadow.alpha > 0.3) {
      ctx.font = '9px "GameMono"';
      ctx.fillStyle = 'rgba(255,200,200,' + alpha + ')';
      ctx.textAlign = 'center';
      ctx.fillText(shadow.label.toUpperCase(), shadow.x, shadow.y + shadow.size + 14);
    }
  });

  // Draw awareness ring around tower
  var ringAlpha = S.awareness / 100 * 0.3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(107,144,128,' + ringAlpha + ')';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function update() {
  S.spawnTimer++;
  if (S.spawnTimer > 90 && S.shadows.length < 5) {
    S.spawnTimer = 0;
    spawnShadow();
  }

  S.shadows.forEach(function(shadow, i) {
    // Move toward center
    var dx = shadow.targetX - shadow.x;
    var dy = shadow.targetY - shadow.y;
    var dist = Math.hypot(dx, dy);

    shadow.x += dx * shadow.speed;
    shadow.y += dy * shadow.speed;
    shadow.alpha = Math.min(shadow.alpha + 0.01, 1);
    shadow.progress = 1 - (dist / (Math.max(W, H) * 0.6));

    // Reached center
    if (dist < 30) {
      S.shadows.splice(i, 1);
      S.missed++;
      S.awareness = Math.max(0, S.awareness - 15);
      updateAwareness();
      fadeD('\u2014', '"' + shadow.label + '" slipped through.\\n\\nStay watchful.');

      if (S.awareness <= 0) {
        resetGame();
      }
    }
  });

  // Check win
  if (S.caught >= TARGET_CAUGHT) {
    completeGame();
  }

  draw();
}

function handleTap(x, y) {
  for (var i = S.shadows.length - 1; i >= 0; i--) {
    var shadow = S.shadows[i];
    var dist = Math.hypot(x - shadow.x, y - shadow.y);

    if (dist < shadow.size + 15) {
      S.shadows.splice(i, 1);
      S.caught++;
      document.getElementById('caught').textContent = S.caught;

      // Restore some awareness
      S.awareness = Math.min(100, S.awareness + 5);
      updateAwareness();

      fadeD('\u2726', 'Caught: "' + shadow.label + '"\\n\\nYou saw it coming.');
      return;
    }
  }
}

function updateAwareness() {
  document.getElementById('awareness-fill').style.height = S.awareness + '%';
}

function resetGame() {
  S.shadows = [];
  S.awareness = 100;
  S.caught = 0;
  S.missed = 0;
  document.getElementById('caught').textContent = '0';
  updateAwareness();
  fadeD('\u2014', 'Awareness faded. Begin again.\\n\\nThe watch requires vigilance.');
}

// Touch/click handler
canvas.addEventListener('click', function(e) {
  if (S.phase !== 'game') return;
  var rect = canvas.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  handleTap(x, y);
});

canvas.addEventListener('touchstart', function(e) {
  if (S.phase !== 'game') return;
  e.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var touch = e.touches[0];
  var x = touch.clientX - rect.left;
  var y = touch.clientY - rect.top;
  handleTap(x, y);
}, {passive: false});

function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  document.getElementById('controls').style.display = 'block';

  S.shadows = [];
  S.caught = 0;
  S.missed = 0;
  S.awareness = 100;

  draw();
  fadeD('\u2014', 'Shadows approach from all sides.\\n\\nTap them before they reach the center.');

  S.gameLoop = setInterval(update, 16);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'done';

  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';

  fadeD('\u2726', 'You caught them all.\\n\\nYour awareness is strong.');
}

function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\ud83c\udf31 Seed planted. Stay watchful.</div>';
    BRIDGE.practiceComplete({});
    setTimeout(function() { document.getElementById('o-done').classList.add('on'); }, 800);
  }, 400);
}

function finish() {
  BRIDGE.complete();
}

// Wire zone-specific event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('intro-btn').addEventListener('click', begin);
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);

  window.addEventListener('resize', function() {
    if (S.phase === 'game') {
      initCanvas();
      draw();
    }
  });
});
`,
  });
}
