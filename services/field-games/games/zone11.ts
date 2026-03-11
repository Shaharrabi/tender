import { wrapFieldGame } from '../base';

export function getZone11Html(): string {
  return wrapFieldGame({
    zone: 11,
    title: 'The Observatory',

    css: /* css */ `
/* ─── Zone 11 Variables ─── */
:root {
  --night:#0A0A1A;--star:#FFFAEA;
}

#game-area {
  background:radial-gradient(ellipse at 50% 100%,#1A1A3A 0%,#0A0A1A 50%,#050510 100%);
}

/* ─── Shooting Stars ─── */
.shooting-star{position:absolute;width:2px;height:2px;background:white;border-radius:50%;opacity:0;}
@keyframes shoot{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(100px) translateY(100px);opacity:0}}

/* ─── Constellation Name Display ─── */
#constellation-name{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,10,26,.6);border:1px solid rgba(255,250,234,.15);border-radius:8px;padding:8px 12px;text-align:center;}
.const-text{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(11px,2.8vw,13px);color:rgba(255,250,234,.7);}
.const-sub{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,250,234,.35);margin-top:4px;}

/* ─── Intro Overlay (zone-specific colors) ─── */
#o-intro{background:radial-gradient(ellipse at 50% 50%,#1A1A3A,#0A0A1A);z-index:60;}

/* ─── Done Overlay (zone-specific colors) ─── */
#o-done{background:radial-gradient(ellipse at 50% 50%,#1A1A3A,#0A0A1A);}
`,

    body: /* html */ `
  <div id="game-area">
    <canvas id="canvas"></canvas>

    <div class="zone-label"><div class="zone-num">Zone XI \u00b7 Step 11</div><div class="zone-name">The Observatory</div></div>
    <div id="constellation-name">
      <div class="const-text" id="const-text">\u2014</div>
      <div class="const-sub" id="const-sub">CONNECT THE STARS</div>
    </div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">Look up. The stars hold meaning.</div>
      </div>
    </div>

    <div id="controls">
      <div class="ctrl-info">Tap stars in order to draw the constellation</div>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for shared meaning</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone XI \u00b7 Step 11 \u2726</div>
    <div class="oi-ic">\ud83d\udd2d</div>
    <div class="oi-big">The Observatory</div>
    <div class="oi-sub">Seek shared insight</div>
    <div class="oi-desc">In the night sky, scattered stars become constellations when you connect them.<br><br>Your relationship has the same scattered lights. Together, you will find the patterns that give them meaning.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Seeking Shared Insight</div>
        <div class="ps-h">Finding<br>Meaning Together</div>
        <div class="ps-body">Insight does not come from thinking alone. It comes from wondering together \u2014 asking questions neither of you can answer yet.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Wonder</div>
        <div class="ps-h">The Questions</div>
        <div class="ps-body">What questions do you want to explore together \u2014 about your relationship, your future, your meaning?</div>
        <div class="ps-box">
          <div class="ps-lbl">WE WONDER ABOUT...</div>
          <textarea class="ps-ta" placeholder="What we are building... Where we are going... What really matters to us..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Connection</div>
        <div class="ps-h">The Ritual</div>
        <div class="ps-body">Create a practice for seeking insight together \u2014 a time to step back and look at the bigger picture.</div>
        <div class="ps-box">
          <div class="ps-lbl">OUR RITUAL FOR SHARED INSIGHT IS...</div>
          <textarea class="ps-ta" placeholder="Monthly walks to talk about the big things... Annual retreat... Weekly wondering time..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Look Together</div>
        <div class="ps-carry">
          The stars are always there. You just have to look up.<br><br>
          <em>Set aside time to wonder together.</em><br><br>
          Not to solve problems \u2014 but to ask questions that open you both to something larger than the daily details.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\u2728</div>
    <div class="done-ey">Zone XI Complete</div>
    <div class="done-ti">The Observatory</div>
    <div class="done-bo">You found the patterns.<br>You connected the lights.<br>The sky holds your story.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
var CONSTELLATIONS = [
  {
    name: "Trust",
    stars: [{x:0.3,y:0.2},{x:0.4,y:0.15},{x:0.5,y:0.2},{x:0.55,y:0.3},{x:0.45,y:0.35},{x:0.35,y:0.3}]
  },
  {
    name: "Connection",
    stars: [{x:0.2,y:0.4},{x:0.3,y:0.35},{x:0.45,y:0.4},{x:0.55,y:0.35},{x:0.7,y:0.4}]
  },
  {
    name: "Growth",
    stars: [{x:0.4,y:0.55},{x:0.45,y:0.45},{x:0.5,y:0.55},{x:0.55,y:0.48},{x:0.6,y:0.58},{x:0.5,y:0.65}]
  },
  {
    name: "Home",
    stars: [{x:0.35,y:0.75},{x:0.5,y:0.65},{x:0.65,y:0.75},{x:0.55,y:0.8},{x:0.45,y:0.8}]
  }
];

var S = {
  phase: 'intro',
  currentConstellation: 0,
  stars: [],
  connections: [],
  selectedStar: null,
  completedConstellations: 0,
  backgroundStars: [],
  gameLoop: null,
  touchPoint: null
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

  // Create background stars
  S.backgroundStars = [];
  for (var i = 0; i < 80; i++) {
    S.backgroundStars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2
    });
  }
}

function loadConstellation(index) {
  var c = CONSTELLATIONS[index];
  S.stars = c.stars.map(function(s, i) {
    return {
      x: s.x * W,
      y: s.y * H,
      index: i,
      connected: false,
      size: 6
    };
  });
  S.connections = [];
  S.selectedStar = null;

  document.getElementById('const-text').textContent = c.name;
  document.getElementById('const-sub').textContent = 'CONSTELLATION ' + (index + 1) + ' OF ' + CONSTELLATIONS.length;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Background stars with twinkle
  var time = Date.now() / 1000;
  S.backgroundStars.forEach(function(star) {
    var alpha = 0.3 + Math.sin(time * 2 + star.twinkle) * 0.2;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,250,234,' + alpha + ')';
    ctx.fill();
  });

  // Draw existing connections
  ctx.strokeStyle = 'rgba(255,250,234,0.6)';
  ctx.lineWidth = 2;
  S.connections.forEach(function(conn) {
    ctx.beginPath();
    ctx.moveTo(conn.from.x, conn.from.y);
    ctx.lineTo(conn.to.x, conn.to.y);
    ctx.stroke();
  });

  // Draw line from selected star to touch point
  if (S.selectedStar !== null && S.touchPoint) {
    ctx.strokeStyle = 'rgba(255,250,234,0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(S.stars[S.selectedStar].x, S.stars[S.selectedStar].y);
    ctx.lineTo(S.touchPoint.x, S.touchPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw constellation stars
  S.stars.forEach(function(star, i) {
    // Glow
    var glowSize = star.connected ? 20 : 15;
    var gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowSize);
    gradient.addColorStop(0, star.connected ? 'rgba(212,168,67,0.5)' : 'rgba(255,250,234,0.3)');
    gradient.addColorStop(1, 'rgba(255,250,234,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Star
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.connected ? 8 : 6, 0, Math.PI * 2);
    ctx.fillStyle = star.connected ? '#D4A843' : '#FFFAEA';
    ctx.fill();

    // Selection ring
    if (S.selectedStar === i) {
      ctx.strokeStyle = 'rgba(212,168,67,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function handleTap(x, y) {
  // Find closest star
  var closest = null;
  var closestDist = 40;

  S.stars.forEach(function(star, i) {
    var dist = Math.hypot(x - star.x, y - star.y);
    if (dist < closestDist) {
      closest = i;
      closestDist = dist;
    }
  });

  if (closest === null) {
    S.selectedStar = null;
    return;
  }

  if (S.selectedStar === null) {
    // Select first star
    S.selectedStar = closest;
  } else if (S.selectedStar !== closest) {
    // Connect stars
    var from = S.stars[S.selectedStar];
    var to = S.stars[closest];

    // Check if connection already exists
    var exists = S.connections.some(function(c) {
      return (c.from === from && c.to === to) || (c.from === to && c.to === from);
    });

    if (!exists) {
      S.connections.push({from: from, to: to});
      from.connected = true;
      to.connected = true;

      // Check if constellation complete
      if (S.connections.length >= S.stars.length - 1) {
        completeConstellation();
      }
    }

    S.selectedStar = closest;
  }

  draw();
}

function completeConstellation() {
  S.completedConstellations++;

  var c = CONSTELLATIONS[S.currentConstellation];
  fadeD('\u2726', '"' + c.name + '"\\n\\nYou found the pattern in the stars.');

  setTimeout(function() {
    if (S.currentConstellation < CONSTELLATIONS.length - 1) {
      S.currentConstellation++;
      loadConstellation(S.currentConstellation);
      draw();
    } else {
      completeGame();
    }
  }, 2000);
}

// Touch/click handlers
canvas.addEventListener('click', function(e) {
  if (S.phase !== 'game') return;
  var rect = canvas.getBoundingClientRect();
  handleTap(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('touchstart', function(e) {
  if (S.phase !== 'game') return;
  e.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var touch = e.touches[0];
  handleTap(touch.clientX - rect.left, touch.clientY - rect.top);
}, {passive: false});

canvas.addEventListener('touchmove', function(e) {
  if (S.phase !== 'game' || S.selectedStar === null) return;
  e.preventDefault();
  var rect = canvas.getBoundingClientRect();
  var touch = e.touches[0];
  S.touchPoint = {x: touch.clientX - rect.left, y: touch.clientY - rect.top};
  draw();
}, {passive: false});

canvas.addEventListener('touchend', function(e) {
  S.touchPoint = null;
  draw();
});

function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  S.currentConstellation = 0;
  S.completedConstellations = 0;
  loadConstellation(0);

  document.getElementById('controls').style.display = 'block';

  fadeD('\u2014', 'Tap stars to connect them.\\n\\nFind the constellation hidden in the sky.');

  S.gameLoop = setInterval(function() { draw(); }, 50);
}

function completeGame() {
  clearInterval(S.gameLoop);
  S.phase = 'done';

  document.getElementById('controls').style.display = 'none';
  document.getElementById('seed-btn').style.display = 'flex';

  fadeD('\u2726', 'All constellations found.\\n\\nThe sky tells your story now.');
}

function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\ud83c\udf31 Seed planted. Look up together.</div>';
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
      loadConstellation(S.currentConstellation);
      draw();
    }
  });
});
`,
  });
}
