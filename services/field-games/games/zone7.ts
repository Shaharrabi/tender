import { wrapFieldGame } from '../base';

/**
 * Zone 7 — The Garden (Tetris)
 * Plant relationship practices by arranging falling pieces in a garden grid.
 */
export function getZone7Html(): string {
  return wrapFieldGame({
    zone: 7,
    title: 'The Garden',

    css: /* css */ `
/* ─── Zone 7 Variables ─── */
:root {
  --sky:#7AB8D4;--soil:#4A3A2A;--grass:#5A8A5A;
}

#game-area{background:linear-gradient(180deg,#87CEEB 0%,#A8D8EA 40%,#C8E8D8 70%,#6A9A6A 85%,#4A7A4A 100%);}

/* Floating clouds */
.cloud{position:absolute;background:rgba(255,255,255,.6);border-radius:50px;animation:drift 20s linear infinite;pointer-events:none;}
.cloud::before,.cloud::after{content:'';position:absolute;background:inherit;border-radius:50%;}
.cloud.c1{width:60px;height:20px;top:8%;left:-60px;animation-duration:25s;}
.cloud.c1::before{width:30px;height:30px;top:-15px;left:10px;}
.cloud.c2{width:40px;height:15px;top:15%;left:-40px;animation-duration:30s;animation-delay:5s;}
.cloud.c2::before{width:20px;height:20px;top:-10px;left:8px;}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(calc(100vw + 100px))}}

#growth-meter{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.6);border:1px solid rgba(107,144,128,.3);border-radius:8px;padding:8px 12px;text-align:center;}
.growth-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(16px,4.5vw,22px);color:var(--parchment);line-height:1;}
.growth-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(107,144,128,.6);margin-top:2px;}

/* Next piece preview */
#next-piece{position:absolute;top:60px;right:14px;z-index:5;background:rgba(10,6,8,.5);border:1px solid rgba(107,144,128,.2);border-radius:8px;padding:8px;width:60px;height:60px;}
.next-lbl{font-family:'GameMono',monospace;font-size:6px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);text-align:center;margin-bottom:4px;}

/* Tetris controls */
#controls{padding:clamp(6px,1.5vh,10px) clamp(14px,4vw,22px) clamp(12px,2.5vh,18px);}
.ctrl-row{display:flex;gap:clamp(8px,2vw,12px);justify-content:center;}
.ctrl-btn{width:clamp(56px,16vw,72px);height:clamp(48px,13vw,60px);border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:clamp(18px,5vw,24px);transition:all .15s;-webkit-tap-highlight-color:transparent;}
.ctrl-btn:active{transform:scale(.94);}
.ctrl-btn.move{background:linear-gradient(135deg,rgba(107,144,128,.2),rgba(107,144,128,.1));border:2px solid rgba(107,144,128,.4);}
.ctrl-btn.rotate{background:linear-gradient(135deg,rgba(212,168,67,.2),rgba(212,168,67,.1));border:2px solid rgba(212,168,67,.4);}
.ctrl-btn.drop{background:linear-gradient(135deg,var(--sage),#4A8A6E);border:none;color:white;font-size:clamp(10px,2.5vw,12px);font-family:'GameMono',monospace;letter-spacing:1px;}

/* Intro overlay garden theme */
#o-intro{background:linear-gradient(180deg,#2A4A3A,#3A5A4A);z-index:60;}
.oi-b{color:rgba(107,144,128,.6);}
.oi-btn{border-color:rgba(107,144,128,.5);color:rgba(107,144,128,.85);}
.oi-btn:active{background:rgba(107,144,128,.15);}

/* Practice overlay garden bg */
#practice-overlay{background:rgba(42,74,58,.96);}
.ps-practices{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:clamp(16px,4vh,24px);}
.ps-practice{background:rgba(107,144,128,.12);border:1px solid rgba(107,144,128,.25);border-radius:20px;padding:6px 12px;font-family:'GameMono',monospace;font-size:clamp(8px,2vw,10px);letter-spacing:1px;color:var(--sage);cursor:pointer;transition:all .2s;}
.ps-practice.selected{background:var(--sage);color:white;}

/* Done overlay garden bg */
#o-done{background:rgba(42,74,58,.97);}
.done-ey{color:rgba(107,144,128,.6);}
`,

    body: /* html */ `
  <div id="game-area">
    <div class="cloud c1"></div>
    <div class="cloud c2"></div>
    <canvas id="canvas"></canvas>

    <div class="zone-label"><div class="zone-num">Zone VII \u00b7 Step 7</div><div class="zone-name">The Garden</div></div>
    <div id="growth-meter"><div class="growth-num" id="growth">0</div><div class="growth-lbl">PLANTED</div></div>
    <div id="next-piece"><div class="next-lbl">NEXT</div><canvas id="next-canvas" width="44" height="44"></canvas></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">A garden needs tending.</div>
      </div>
    </div>

    <div id="controls">
      <div class="ctrl-row">
        <button class="ctrl-btn move" id="btn-left">\u2190</button>
        <button class="ctrl-btn rotate" id="btn-rotate">\u21bb</button>
        <button class="ctrl-btn move" id="btn-right">\u2192</button>
        <button class="ctrl-btn drop" id="btn-drop">DROP</button>
      </div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for tending your garden</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone VII \u00b7 Step 7 \u2726</div>
    <div class="oi-ic">\ud83c\udf31</div>
    <div class="oi-big">The Garden</div>
    <div class="oi-sub">Commit to relational practices</div>
    <div class="oi-desc">Relationships do not heal themselves. They need practices \u2014 rituals of connection, repair, and care.<br><br>Plant these practices carefully. A garden only grows when you tend it.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Tending the Garden</div>
        <div class="ps-h">Relational<br>Rituals</div>
        <div class="ps-body">A practice is something you do regularly, on purpose, to nurture the relationship.<br><br>Not when you feel like it. Not when things are good. <em>Especially</em> when they are not.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Choose</div>
        <div class="ps-h">Your Practices</div>
        <div class="ps-body">Select 2-3 practices you will commit to:</div>
        <div class="ps-practices" id="practice-list">
          <span class="ps-practice" data-p="weekly-check-in">Weekly check-in</span>
          <span class="ps-practice" data-p="daily-appreciation">Daily appreciation</span>
          <span class="ps-practice" data-p="repair-ritual">Repair ritual</span>
          <span class="ps-practice" data-p="date-night">Date night</span>
          <span class="ps-practice" data-p="morning-connection">Morning connection</span>
          <span class="ps-practice" data-p="evening-debrief">Evening debrief</span>
          <span class="ps-practice" data-p="physical-affection">Physical affection</span>
          <span class="ps-practice" data-p="dream-sharing">Dream sharing</span>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Commit</div>
        <div class="ps-h">When & How</div>
        <div class="ps-body">For each practice, decide: when will you do it? What will it look like?</div>
        <div class="ps-box">
          <div class="ps-lbl">MY COMMITMENT IS...</div>
          <textarea class="ps-ta" placeholder="Every Sunday morning we will... Before bed I will... When we argue I will..." rows="4"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Tend Daily</div>
        <div class="ps-carry">
          A garden does not grow from one watering.<br><br>
          <em>Show up even when you do not feel like it.</em><br><br>
          The practice is not about perfection. It is about presence. Keep tending.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83c\udf3b</div>
    <div class="done-ey">Zone VII Complete</div>
    <div class="done-ti">The Garden</div>
    <div class="done-bo">Your garden is planted.<br>Now the real work begins:<br>showing up, again and again.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// ─── Tetris Garden Game ───
var PIECES = [
  { name: 'Check-in', color: '#7AB87A', shape: [[1,1],[1,1]] },
  { name: 'Gratitude', color: '#D4A843', shape: [[1,1,1],[0,1,0]] },
  { name: 'Repair', color: '#C4616E', shape: [[1,1,0],[0,1,1]] },
  { name: 'Date Night', color: '#7294D4', shape: [[1,1,1,1]] },
  { name: 'Touch', color: '#D8A499', shape: [[1,0],[1,1],[1,0]] },
  { name: 'Listen', color: '#9A7ACC', shape: [[0,1],[1,1],[1,0]] },
];

var COLS = 8;
var ROWS = 12;
var TARGET = 15;

var S = {
  phase: 'intro',
  grid: [],
  current: null,
  next: null,
  x: 0,
  y: 0,
  planted: 0,
  gameLoop: null,
  dropTimer: 0
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var nextCanvas = document.getElementById('next-canvas');
var nextCtx = nextCanvas.getContext('2d');

var CELL, GRID_X, GRID_Y;

function initCanvas() {
  var area = document.getElementById('game-area');
  canvas.width = area.clientWidth;
  canvas.height = area.clientHeight;

  CELL = Math.floor(Math.min(canvas.width / (COLS + 2), canvas.height * 0.6 / ROWS));
  GRID_X = (canvas.width - COLS * CELL) / 2;
  GRID_Y = canvas.height - ROWS * CELL - 20;
}

function newPiece() {
  S.current = S.next || PIECES[Math.floor(Math.random() * PIECES.length)];
  S.next = PIECES[Math.floor(Math.random() * PIECES.length)];
  S.x = Math.floor((COLS - S.current.shape[0].length) / 2);
  S.y = 0;
  drawNextPiece();
}

function drawNextPiece() {
  nextCtx.clearRect(0, 0, 44, 44);
  var p = S.next;
  var size = 10;
  var ox = (44 - p.shape[0].length * size) / 2;
  var oy = (44 - p.shape.length * size) / 2;

  p.shape.forEach(function(row, r) {
    row.forEach(function(cell, c) {
      if (cell) {
        nextCtx.fillStyle = p.color;
        nextCtx.beginPath();
        nextCtx.roundRect(ox + c * size, oy + r * size, size - 1, size - 1, 2);
        nextCtx.fill();
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw soil/grid area
  ctx.fillStyle = 'rgba(74,58,42,0.3)';
  ctx.fillRect(GRID_X - 2, GRID_Y - 2, COLS * CELL + 4, ROWS * CELL + 4);

  // Draw grid lines (subtle)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (var x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(GRID_X + x * CELL, GRID_Y);
    ctx.lineTo(GRID_X + x * CELL, GRID_Y + ROWS * CELL);
    ctx.stroke();
  }
  for (var y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(GRID_X, GRID_Y + y * CELL);
    ctx.lineTo(GRID_X + COLS * CELL, GRID_Y + y * CELL);
    ctx.stroke();
  }

  // Draw planted pieces
  S.grid.forEach(function(row, r) {
    row.forEach(function(cell, c) {
      if (cell) {
        ctx.fillStyle = cell;
        ctx.beginPath();
        ctx.roundRect(GRID_X + c * CELL + 1, GRID_Y + r * CELL + 1, CELL - 2, CELL - 2, 3);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(GRID_X + c * CELL + 2, GRID_Y + r * CELL + 2, CELL - 6, 3);
      }
    });
  });

  // Draw current piece
  if (S.current) {
    S.current.shape.forEach(function(row, r) {
      row.forEach(function(cell, c) {
        if (cell) {
          var px = GRID_X + (S.x + c) * CELL;
          var py = GRID_Y + (S.y + r) * CELL;

          ctx.fillStyle = S.current.color;
          ctx.beginPath();
          ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, 3);
          ctx.fill();

          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect(px + 2, py + 2, CELL - 6, 3);
        }
      });
    });
  }

  // Draw flowers on completed rows (visual flair)
  S.grid.forEach(function(row, r) {
    var filled = row.filter(function(c) { return c; }).length;
    if (filled >= COLS - 1) {
      ctx.font = '14px serif';
      ctx.fillText('\ud83c\udf38', GRID_X + COLS * CELL + 5, GRID_Y + r * CELL + CELL / 2 + 5);
    }
  });
}

function collision(nx, ny, shape) {
  return shape.some(function(row, r) {
    return row.some(function(cell, c) {
      if (!cell) return false;
      var gx = nx + c;
      var gy = ny + r;
      if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
      if (gy >= 0 && S.grid[gy] && S.grid[gy][gx]) return true;
      return false;
    });
  });
}

function rotate(shape) {
  var rows = shape.length;
  var cols = shape[0].length;
  var rotated = [];
  for (var c = 0; c < cols; c++) {
    var newRow = [];
    for (var r = rows - 1; r >= 0; r--) {
      newRow.push(shape[r][c]);
    }
    rotated.push(newRow);
  }
  return rotated;
}

function plant() {
  S.current.shape.forEach(function(row, r) {
    row.forEach(function(cell, c) {
      if (cell && S.y + r >= 0) {
        if (!S.grid[S.y + r]) S.grid[S.y + r] = new Array(COLS).fill(null);
        S.grid[S.y + r][S.x + c] = S.current.color;
      }
    });
  });

  // Count planted cells
  S.planted = S.grid.reduce(function(sum, row) { return sum + row.filter(function(c) { return c; }).length; }, 0);
  document.getElementById('growth').textContent = S.planted;

  // Clear complete rows (with bloom effect)
  for (var r = ROWS - 1; r >= 0; r--) {
    if (S.grid[r] && S.grid[r].every(function(c) { return c; })) {
      S.grid.splice(r, 1);
      S.grid.unshift(new Array(COLS).fill(null));
      S.planted += 5; // Bonus for complete row
      document.getElementById('growth').textContent = S.planted;
      fadeD('\ud83c\udf38', 'A row blooms!\\n\\nPractices grow stronger together.');
    }
  }

  if (S.planted >= TARGET) {
    completeGame();
  } else {
    newPiece();
    if (collision(S.x, S.y, S.current.shape)) {
      // Game over - clear and continue
      S.grid = [];
      for (var r2 = 0; r2 < ROWS; r2++) S.grid.push(new Array(COLS).fill(null));
      fadeD('\u2014', 'The garden needs replanting.\\nTry again \u2014 growth takes time.');
    }
  }
}

function moveLeft() {
  if (!collision(S.x - 1, S.y, S.current.shape)) {
    S.x--;
    draw();
  }
}

function moveRight() {
  if (!collision(S.x + 1, S.y, S.current.shape)) {
    S.x++;
    draw();
  }
}

function rotatePiece() {
  var rotated = rotate(S.current.shape);
  if (!collision(S.x, S.y, rotated)) {
    S.current.shape = rotated;
    draw();
  }
}

function drop() {
  while (!collision(S.x, S.y + 1, S.current.shape)) {
    S.y++;
  }
  plant();
  draw();
}

function update() {
  S.dropTimer++;
  if (S.dropTimer > 30) {
    S.dropTimer = 0;
    if (!collision(S.x, S.y + 1, S.current.shape)) {
      S.y++;
    } else {
      plant();
    }
    draw();
  }
}

// Controls
document.getElementById('btn-left').addEventListener('click', moveLeft);
document.getElementById('btn-right').addEventListener('click', moveRight);
document.getElementById('btn-rotate').addEventListener('click', rotatePiece);
document.getElementById('btn-drop').addEventListener('click', drop);

document.addEventListener('keydown', function(e) {
  if (S.phase !== 'game') return;
  switch(e.key) {
    case 'ArrowLeft': case 'a': moveLeft(); break;
    case 'ArrowRight': case 'd': moveRight(); break;
    case 'ArrowUp': case 'w': rotatePiece(); break;
    case 'ArrowDown': case 's': case ' ': drop(); break;
  }
});

// Practice selection (zone-specific)
var practiceSelected = [];
document.querySelectorAll('.ps-practice').forEach(function(el) {
  el.addEventListener('click', function() {
    el.classList.toggle('selected');
    var p = el.dataset.p;
    if (practiceSelected.indexOf(p) >= 0) {
      practiceSelected = practiceSelected.filter(function(x) { return x !== p; });
    } else if (practiceSelected.length < 3) {
      practiceSelected.push(p);
    } else {
      el.classList.remove('selected');
    }
  });
});

// ─── Game Flow ───
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  S.grid = [];
  for (var r = 0; r < ROWS; r++) S.grid.push(new Array(COLS).fill(null));

  document.getElementById('controls').style.display = 'block';

  newPiece();
  draw();

  fadeD('\u2014', 'Plant your practices.\\n\\nArrange them to build a thriving garden.');

  S.gameLoop = setInterval(update, 50);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'done';

  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';

  fadeD('\u2726', 'Your garden is growing.\\n\\nNow tend it \u2014 every day.');
}

function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\ud83c\udf31 Seed planted. Your garden awaits.</div>';
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
