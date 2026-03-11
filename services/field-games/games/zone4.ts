import { wrapFieldGame } from '../base';

/**
 * Zone 4 — The Mirror Lake (Snake game)
 *
 * Collect reflections floating on a still lake by guiding a snake.
 * Metaphor: examining your own part in the relationship pattern.
 */
export function getZone4Html(): string {
  return wrapFieldGame({
    zone: 4,
    title: 'The Mirror Lake',

    css: /* css */ `
/* ─── Zone 4 Variables ─── */
:root {
  --lake:#4A7A9A;--lake-light:#7AAAC8;
}

#game-area{background:linear-gradient(180deg,#1A2A3A 0%,#2A4A5A 30%,#4A7A9A 60%,#5A8AAA 80%,#6A9ABA 100%);}

/* Ripple effect on the lake */
.ripple{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.15);animation:ripple 4s ease-out infinite;pointer-events:none;}
@keyframes ripple{0%{transform:scale(0);opacity:.4}100%{transform:scale(3);opacity:0}}

/* Game canvas */
#canvas{image-rendering:pixelated;}

/* Reflection text floating on water */
.reflection-text{position:absolute;font-family:'GameSerif',serif;font-style:italic;font-size:clamp(10px,2.5vw,12px);color:rgba(255,255,255,.25);pointer-events:none;animation:float 6s ease-in-out infinite;}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

/* Score display */
#score-display{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.7);border:1px solid rgba(212,168,67,.2);border-radius:8px;padding:8px 12px;text-align:center;}
.score-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(16px,4.5vw,22px);color:var(--parchment);line-height:1;}
.score-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(212,168,67,.4);margin-top:2px;}

/* Controls grid */
.ctrl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(6px,1.5vw,10px);max-width:200px;margin:0 auto;}
.ctrl-btn{height:clamp(44px,12vw,56px);border:none;border-radius:12px;background:linear-gradient(180deg,rgba(74,122,154,.2),rgba(74,122,154,.1));border:1.5px solid rgba(74,122,154,.3);color:var(--lake);font-size:clamp(18px,5vw,24px);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;-webkit-tap-highlight-color:transparent;}
.ctrl-btn:active{background:rgba(74,122,154,.3);transform:scale(.95);}
.ctrl-btn.empty{background:transparent;border:none;pointer-events:none;}

/* Intro overlay */
#o-intro{background:linear-gradient(180deg,#1A2A3A,#2A3A4A);z-index:60;}

/* Collected reflections display */
#reflections-collected{display:none;padding:0 clamp(14px,4vw,22px) clamp(8px,2vh,12px);}
.ref-list{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;}
.ref-tag{background:rgba(74,122,154,.12);border:1px solid rgba(74,122,154,.25);border-radius:12px;padding:4px 10px;font-family:'GameSerif',serif;font-style:italic;font-size:clamp(9px,2.2vw,11px);color:var(--lake);}
`,

    body: /* html */ `
  <div id="game-area">
    <canvas id="canvas"></canvas>

    <!-- Ripples -->
    <div class="ripple" style="left:20%;top:30%;width:40px;height:40px;animation-delay:0s"></div>
    <div class="ripple" style="left:70%;top:50%;width:30px;height:30px;animation-delay:1.5s"></div>
    <div class="ripple" style="left:40%;top:70%;width:50px;height:50px;animation-delay:3s"></div>

    <div class="zone-label"><div class="zone-num">Zone IV \u00b7 Step 4</div><div class="zone-name">The Mirror Lake</div></div>
    <div id="score-display"><div class="score-num" id="score">0</div><div class="score-lbl">REFLECTIONS</div></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">The still water shows what is true.</div>
      </div>
    </div>

    <div id="reflections-collected">
      <div class="ref-list" id="ref-list"></div>
    </div>

    <div id="controls">
      <div class="ctrl-grid">
        <div class="ctrl-btn empty"></div>
        <button class="ctrl-btn" id="btn-up">\u2191</button>
        <div class="ctrl-btn empty"></div>
        <button class="ctrl-btn" id="btn-left">\u2190</button>
        <button class="ctrl-btn" id="btn-down">\u2193</button>
        <button class="ctrl-btn" id="btn-right">\u2192</button>
      </div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for honest reflection</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone IV \u00b7 Step 4 \u2726</div>
    <div class="oi-ic">\ud83e\ude9e</div>
    <div class="oi-big">The Mirror<br>Lake</div>
    <div class="oi-sub">Examine our part</div>
    <div class="oi-desc">The lake is still. It shows you not your partner \u2014 but yourself.<br><br>Collect the reflections floating on the water. Each one is a piece of honest seeing.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Examining Your Part</div>
        <div class="ps-h">Honest<br>Inventory</div>
        <div class="ps-body">This step asks the hardest question:<br><br><em>What is my part in this pattern?</em><br><br>Not to blame yourself. But to see yourself clearly.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Reflection 1</div>
        <div class="ps-h">What I Do</div>
        <div class="ps-body">When the pattern begins, what do you actually do?<br>Not what they do. What do <em>you</em> do?</div>
        <div class="ps-box">
          <div class="ps-lbl">WHEN TENSION RISES, I TEND TO...</div>
          <textarea class="ps-ta" id="ps-input-1" placeholder="get critical... withdraw... over-explain... control..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Reflection 2</div>
        <div class="ps-h">What I Avoid</div>
        <div class="ps-body">What are you protecting yourself from feeling?<br>What do you not want to face?</div>
        <div class="ps-box">
          <div class="ps-lbl">I AVOID FEELING...</div>
          <textarea class="ps-ta" id="ps-input-2" placeholder="inadequate... abandoned... out of control... vulnerable..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Reflection 3</div>
        <div class="ps-h">What I Want</div>
        <div class="ps-body">Underneath the pattern \u2014 what do you actually want from your partner?</div>
        <div class="ps-box">
          <div class="ps-lbl">WHAT I REALLY WANT IS...</div>
          <textarea class="ps-ta" id="ps-input-3" placeholder="to feel chosen... to be seen... to know I matter..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-3">NEXT</button>
      </div>
      <div class="ps-step" id="ps-4">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Carry This</div>
        <div class="ps-carry">
          The mirror shows both the wound and the healer.<br><br>
          Next time the pattern starts, ask yourself:<br>
          <em>"What is my part in this moment?"</em><br><br>
          Not blame. Just honest seeing.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83e\ude9e</div>
    <div class="done-ey">Zone IV Complete</div>
    <div class="done-ti">The Mirror Lake</div>
    <div class="done-bo">You looked at yourself honestly.<br>That takes courage.<br>The water remembers what you saw.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// ─── Zone 4: The Mirror Lake — Snake Game ───

// Game constants
var GRID_SIZE = 12;
var REFLECTIONS_NEEDED = 6;

var REFLECTION_WORDS = [
  "my part", "my fear", "my wall", "my need",
  "my pattern", "my hurt", "my hope", "my armor"
];

// State
var S = {
  phase: 'intro',
  snake: [{x: 6, y: 6}],
  dir: {x: 1, y: 0},
  nextDir: {x: 1, y: 0},
  food: null,
  score: 0,
  collected: [],
  gameLoop: null,
  cellSize: 0,
  offsetX: 0,
  offsetY: 0
};

// Elements
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Colors (lake theme)
var COLORS = {
  water: '#4A7A9A',
  waterLight: '#5A8AAA',
  snake: '#FDF6F0',
  snakeHead: '#D8A499',
  food: '#D4A843',
  foodGlow: 'rgba(212,168,67,0.3)'
};

// Initialize canvas size
function initCanvas() {
  var area = document.getElementById('game-area');
  var w = area.clientWidth;
  var h = area.clientHeight;
  canvas.width = w;
  canvas.height = h;
  S.cellSize = Math.floor(Math.min(w, h) / GRID_SIZE);

  // Center the grid
  S.offsetX = Math.floor((w - GRID_SIZE * S.cellSize) / 2);
  S.offsetY = Math.floor((h - GRID_SIZE * S.cellSize) / 2);
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid (subtle)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (var x = 0; x <= GRID_SIZE; x++) {
    ctx.beginPath();
    ctx.moveTo(S.offsetX + x * S.cellSize, S.offsetY);
    ctx.lineTo(S.offsetX + x * S.cellSize, S.offsetY + GRID_SIZE * S.cellSize);
    ctx.stroke();
  }
  for (var y = 0; y <= GRID_SIZE; y++) {
    ctx.beginPath();
    ctx.moveTo(S.offsetX, S.offsetY + y * S.cellSize);
    ctx.lineTo(S.offsetX + GRID_SIZE * S.cellSize, S.offsetY + y * S.cellSize);
    ctx.stroke();
  }

  // Draw food (reflection to collect)
  if (S.food) {
    var fx = S.offsetX + S.food.x * S.cellSize + S.cellSize / 2;
    var fy = S.offsetY + S.food.y * S.cellSize + S.cellSize / 2;

    // Glow
    ctx.beginPath();
    ctx.arc(fx, fy, S.cellSize * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.foodGlow;
    ctx.fill();

    // Food
    ctx.beginPath();
    ctx.arc(fx, fy, S.cellSize * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.food;
    ctx.fill();
  }

  // Draw snake
  S.snake.forEach(function(seg, i) {
    var x = S.offsetX + seg.x * S.cellSize;
    var y = S.offsetY + seg.y * S.cellSize;
    var pad = 2;

    ctx.fillStyle = i === 0 ? COLORS.snakeHead : COLORS.snake;
    ctx.beginPath();
    ctx.roundRect(x + pad, y + pad, S.cellSize - pad * 2, S.cellSize - pad * 2, 4);
    ctx.fill();
  });
}

// Game logic
function update() {
  S.dir = S.nextDir;

  var head = S.snake[0];
  var newHead = {
    x: (head.x + S.dir.x + GRID_SIZE) % GRID_SIZE,
    y: (head.y + S.dir.y + GRID_SIZE) % GRID_SIZE
  };

  // Check self collision
  if (S.snake.some(function(seg) { return seg.x === newHead.x && seg.y === newHead.y; })) {
    // Hit self - just don't move
    return;
  }

  S.snake.unshift(newHead);

  // Check food
  if (S.food && newHead.x === S.food.x && newHead.y === S.food.y) {
    S.score++;
    document.getElementById('score').textContent = S.score;

    // Collect reflection word
    var word = REFLECTION_WORDS[S.collected.length % REFLECTION_WORDS.length];
    S.collected.push(word);
    addReflectionTag(word);

    // Feedback
    fadeD('\\u2726', '"' + word + '"\\n\\nYou see a little more clearly.');

    if (S.score >= REFLECTIONS_NEEDED) {
      completeGame();
    } else {
      spawnFood();
    }
  } else {
    S.snake.pop();
  }

  draw();
}

function spawnFood() {
  var pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (S.snake.some(function(seg) { return seg.x === pos.x && seg.y === pos.y; }));
  S.food = pos;
}

function addReflectionTag(word) {
  var list = document.getElementById('ref-list');
  var tag = document.createElement('span');
  tag.className = 'ref-tag';
  tag.textContent = word;
  list.appendChild(tag);
  document.getElementById('reflections-collected').style.display = 'block';
}

// Controls
function setDir(dx, dy) {
  // Prevent 180-degree turns
  if (S.dir.x === -dx && S.dir.y === -dy) return;
  S.nextDir = {x: dx, y: dy};
}

document.getElementById('btn-up').addEventListener('click', function() { setDir(0, -1); });
document.getElementById('btn-down').addEventListener('click', function() { setDir(0, 1); });
document.getElementById('btn-left').addEventListener('click', function() { setDir(-1, 0); });
document.getElementById('btn-right').addEventListener('click', function() { setDir(1, 0); });

// Keyboard controls
document.addEventListener('keydown', function(e) {
  if (S.phase !== 'game') return;
  switch(e.key) {
    case 'ArrowUp': case 'w': setDir(0, -1); break;
    case 'ArrowDown': case 's': setDir(0, 1); break;
    case 'ArrowLeft': case 'a': setDir(-1, 0); break;
    case 'ArrowRight': case 'd': setDir(1, 0); break;
  }
});

// Swipe controls
var touchStart = null;
document.getElementById('game-area').addEventListener('touchstart', function(e) {
  touchStart = {x: e.touches[0].clientX, y: e.touches[0].clientY};
});
document.getElementById('game-area').addEventListener('touchend', function(e) {
  if (!touchStart || S.phase !== 'game') return;
  var dx = e.changedTouches[0].clientX - touchStart.x;
  var dy = e.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    setDir(dx > 0 ? 1 : -1, 0);
  } else {
    setDir(0, dy > 0 ? 1 : -1);
  }
  touchStart = null;
});

// Game flow
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  document.getElementById('controls').style.display = 'block';

  S.snake = [{x: 6, y: 6}];
  S.dir = {x: 1, y: 0};
  S.nextDir = {x: 1, y: 0};
  S.score = 0;
  S.collected = [];

  spawnFood();
  draw();

  fadeD('\\u2014', 'Use the arrows (or swipe) to move.\\n\\nCollect 6 reflections floating on the lake.');

  S.gameLoop = setInterval(update, 200);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'done';

  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';

  fadeD('\\u2726', 'You collected all the reflections.\\n\\nThe lake shows you clearly now.');
}

// Zone-specific practice: psPlant + extra step wiring
function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. You see yourself more clearly.</div>';
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
  // Extra practice step wiring (zone 4 has 5 practice steps: 0-4)
  var psNext3 = document.getElementById('ps-next-3');
  if (psNext3) psNext3.addEventListener('click', function() { psGo(4); });
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
