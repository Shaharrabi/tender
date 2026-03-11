import { wrapFieldGame } from '../base';

export function getZone12Html(): string {
  return wrapFieldGame({
    zone: 12,
    title: 'The Crossroads',

    css: /* css */ `
/* ─── Zone 12 Game Area ─── */
#game-area {
  background:linear-gradient(180deg,#D4A870 0%,#E8C8A0 20%,#F0D8B8 40%,#98B898 70%,#78A078 100%);
}

/* ─── Light Rays ─── */
.light-ray{position:absolute;top:0;left:50%;width:2px;height:40%;background:linear-gradient(180deg,rgba(255,240,200,.4),transparent);transform-origin:top center;pointer-events:none;}

/* ─── Path Choice Buttons ─── */
#path-choice{display:none;padding:clamp(8px,2vh,12px) clamp(14px,4vw,22px) clamp(14px,3vh,20px);gap:10px;flex-direction:column;}
.path-btn{width:100%;padding:clamp(14px,3.5vw,18px);border:1.5px solid rgba(107,144,128,.3);border-radius:16px;background:rgba(107,144,128,.05);cursor:pointer;text-align:left;transition:all .2s;-webkit-tap-highlight-color:transparent;}
.path-btn:active{background:rgba(107,144,128,.15);border-color:var(--sage);}
.path-btn.selected{background:rgba(107,144,128,.15);border-color:var(--sage);}
.path-title{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(11px,2.8vw,13px);letter-spacing:2px;text-transform:uppercase;color:var(--sage);margin-bottom:4px;}
.path-desc{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(11px,2.8vw,13px);color:var(--warm-gray);line-height:1.5;}

/* ─── Continue Button ─── */
#continue-btn{display:none;padding:clamp(8px,2vh,12px) clamp(14px,4vw,22px) clamp(14px,3vh,20px);}
#continue-btn button{width:100%;height:clamp(52px,14vw,62px);border:none;border-radius:31px;background:linear-gradient(135deg,var(--sage),#4A8A6E);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(11px,2.8vw,13px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;box-shadow:0 6px 24px rgba(107,144,128,.45);}

/* ─── Intro Overlay (zone-specific colors) ─── */
#o-intro{background:linear-gradient(180deg,#C4A060,#D4B080);z-index:60;}
.oi-b{color:rgba(45,34,38,.5);}
.oi-big{color:var(--ink);}
.oi-sub{color:rgba(45,34,38,.6);}
.oi-desc{color:rgba(45,34,38,.45);}
.oi-btn{border-color:rgba(45,34,38,.4);color:rgba(45,34,38,.8);}
.oi-btn:active{background:rgba(45,34,38,.1);}

/* ─── Done Overlay (zone-specific colors) ─── */
#o-done{background:linear-gradient(180deg,#D4B888,#E8D0A8);}
.done-ey{color:rgba(45,34,38,.5);}
.done-ti{color:var(--ink);}
.done-bo{color:rgba(45,34,38,.6);}

/* ─── Journey Complete Overlay ─── */
#journey-complete{position:absolute;inset:0;z-index:90;background:radial-gradient(ellipse at 50% 50%,#F8F0E0,#E8D8C0);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(28px,6vw,48px);opacity:0;pointer-events:none;transition:opacity 1.5s;}
#journey-complete.on{opacity:1;pointer-events:all;}
.jc-icon{font-size:clamp(48px,14vw,64px);margin-bottom:clamp(16px,4vh,28px);}
.jc-title{font-family:'GameSans',sans-serif;font-weight:300;font-size:clamp(28px,8vw,40px);letter-spacing:5px;text-transform:uppercase;color:var(--ink);line-height:1.1;margin-bottom:clamp(8px,2vh,14px);}
.jc-sub{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(14px,4vw,18px);color:var(--sage);margin-bottom:clamp(20px,5vh,36px);}
.jc-body{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(12px,3vw,14px);line-height:2;color:rgba(45,34,38,.6);max-width:280px;margin-bottom:clamp(28px,7vh,48px);}
.jc-btn{width:clamp(220px,65vw,260px);height:clamp(50px,13vw,60px);border-radius:30px;border:none;background:linear-gradient(135deg,var(--gold),#C49838);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.2vw,11px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;box-shadow:0 8px 30px rgba(212,168,67,.4);}
`,

    body: /* html */ `
  <div id="game-area">
    <!-- Light rays -->
    <div class="light-ray" style="transform:rotate(-30deg);left:30%"></div>
    <div class="light-ray" style="transform:rotate(-15deg);left:40%"></div>
    <div class="light-ray" style="transform:rotate(0deg);left:50%"></div>
    <div class="light-ray" style="transform:rotate(15deg);left:60%"></div>
    <div class="light-ray" style="transform:rotate(30deg);left:70%"></div>

    <canvas id="canvas"></canvas>

    <div class="zone-label"><div class="zone-num">Zone XII \u00b7 Step 12</div><div class="zone-name">The Crossroads</div></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">You have walked the field.</div>
      </div>
    </div>

    <div id="path-choice">
      <div class="path-btn" id="path-1" data-path="1">
        <div class="path-title">\ud83c\udf31 Tend the Garden</div>
        <div class="path-desc">Return to the practices. Keep growing what you planted.</div>
      </div>
      <div class="path-btn" id="path-2" data-path="2">
        <div class="path-title">\ud83c\udf09 Rebuild the Bridge</div>
        <div class="path-desc">Continue the repair. Trust takes time and showing up.</div>
      </div>
      <div class="path-btn" id="path-3" data-path="3">
        <div class="path-title">\u2728 Share the Light</div>
        <div class="path-desc">Carry what you learned to others who are walking this path.</div>
      </div>
    </div>

    <div id="continue-btn">
      <button id="continue-tap">WALK THIS PATH</button>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE FINAL SEED</button>
      <div class="seed-note">A practice for carrying the message</div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone XII \u00b7 Step 12 \u2726</div>
    <div class="oi-ic">\ud83d\udee4\ufe0f</div>
    <div class="oi-big">The Crossroads</div>
    <div class="oi-sub">Carry the message</div>
    <div class="oi-desc">You stand where many paths meet. Behind you: the field you have walked. Before you: the world waiting for what you have learned.<br><br>Choose how you will carry this forward.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Carrying the Message</div>
        <div class="ps-h">What You<br>Now Know</div>
        <div class="ps-body">You have walked through fog and mirrors, caves and ruins. You have built bridges and planted gardens.<br><br>What do you know now that you did not know before?</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Wisdom</div>
        <div class="ps-h">Your Learning</div>
        <div class="ps-body">Name the most important thing you learned on this journey.</div>
        <div class="ps-box">
          <div class="ps-lbl">WHAT I LEARNED IS...</div>
          <textarea class="ps-ta" placeholder="That I am part of the pattern... That repair is possible... That we can grow..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Service</div>
        <div class="ps-h">How You Will Share</div>
        <div class="ps-body">How will you carry what you learned into your life and relationships?</div>
        <div class="ps-box">
          <div class="ps-lbl">I WILL CARRY THIS BY...</div>
          <textarea class="ps-ta" placeholder="Living it every day... Sharing with others who struggle... Being patient with myself and others..." rows="3"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">The Journey Continues</div>
        <div class="ps-carry">
          This is not the end. This is where the real work begins.<br><br>
          <em>You have walked the field. Now you carry it with you.</em><br><br>
          Every relationship you touch. Every moment of awareness. Every choice to show up differently. This is how the message spreads.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THE FINAL SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83c\udf05</div>
    <div class="done-ey">Zone XII Complete</div>
    <div class="done-ti">The Crossroads</div>
    <div class="done-bo">You chose your path.<br>The journey continues beyond this field.<br>Carry it well.</div>
    <button class="done-btn" id="done-btn">COMPLETE THE JOURNEY</button>
  </div>

  <div id="journey-complete">
    <div class="jc-icon">\ud83c\udf3f</div>
    <div class="jc-title">Journey Complete</div>
    <div class="jc-sub">You have walked The Field</div>
    <div class="jc-body">
      Twelve zones. Twelve steps.<br>
      From fog to crossroads.<br>
      From separation to connection.<br><br>
      The field is always here.<br>
      Return whenever you need to remember.
    </div>
    <button class="jc-btn" id="jc-btn">BEGIN AGAIN \u2726</button>
  </div>
`,

    js: /* js */ `
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var W, H;
var S = {
  phase: 'intro',
  selectedPath: null,
  avatarY: 0,
  pathsDrawn: false
};

function initCanvas() {
  var area = document.getElementById('game-area');
  W = area.clientWidth;
  H = area.clientHeight;
  canvas.width = W;
  canvas.height = H;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  var centerX = W / 2;
  var crossY = H * 0.55;

  // Main path coming from bottom
  ctx.strokeStyle = 'rgba(90,74,58,0.4)';
  ctx.lineWidth = 30;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(centerX, H);
  ctx.lineTo(centerX, crossY);
  ctx.stroke();

  // Three diverging paths
  if (S.pathsDrawn) {
    ctx.lineWidth = 20;

    // Left path
    ctx.strokeStyle = S.selectedPath === 1 ? 'rgba(107,144,128,0.5)' : 'rgba(90,74,58,0.3)';
    ctx.beginPath();
    ctx.moveTo(centerX, crossY);
    ctx.quadraticCurveTo(centerX - 60, crossY - 80, W * 0.15, 0);
    ctx.stroke();

    // Center path
    ctx.strokeStyle = S.selectedPath === 2 ? 'rgba(107,144,128,0.5)' : 'rgba(90,74,58,0.3)';
    ctx.beginPath();
    ctx.moveTo(centerX, crossY);
    ctx.lineTo(centerX, 0);
    ctx.stroke();

    // Right path
    ctx.strokeStyle = S.selectedPath === 3 ? 'rgba(107,144,128,0.5)' : 'rgba(90,74,58,0.3)';
    ctx.beginPath();
    ctx.moveTo(centerX, crossY);
    ctx.quadraticCurveTo(centerX + 60, crossY - 80, W * 0.85, 0);
    ctx.stroke();
  }

  // Crossroads marker
  ctx.fillStyle = 'rgba(212,168,67,0.6)';
  ctx.beginPath();
  ctx.arc(centerX, crossY, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(212,168,67,0.3)';
  ctx.beginPath();
  ctx.arc(centerX, crossY, 25, 0, Math.PI * 2);
  ctx.fill();

  // Avatar
  var avatarX = centerX;
  var avatarY = crossY + 60 - S.avatarY;

  // Shadow
  ctx.beginPath();
  ctx.ellipse(avatarX, avatarY + 22, 12, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();

  // Body
  ctx.fillStyle = '#A84858';
  ctx.beginPath();
  ctx.roundRect(avatarX - 10, avatarY - 5, 20, 24, 6);
  ctx.fill();

  // Head
  ctx.fillStyle = '#C4616E';
  ctx.beginPath();
  ctx.arc(avatarX, avatarY - 12, 12, 0, Math.PI * 2);
  ctx.fill();

  // Partner avatar (slightly behind)
  var partnerX = centerX + 20;
  var partnerY = avatarY + 15;

  ctx.beginPath();
  ctx.ellipse(partnerX, partnerY + 20, 10, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fill();

  ctx.fillStyle = '#5274A4';
  ctx.beginPath();
  ctx.roundRect(partnerX - 8, partnerY - 3, 16, 20, 5);
  ctx.fill();

  ctx.fillStyle = '#7294D4';
  ctx.beginPath();
  ctx.arc(partnerX, partnerY - 10, 10, 0, Math.PI * 2);
  ctx.fill();
}

function animateWalk() {
  S.avatarY += 2;
  if (S.avatarY >= 60) {
    S.avatarY = 60;
    S.pathsDrawn = true;
    document.getElementById('path-choice').style.display = 'flex';
    fadeD('\u2014', 'Three paths lie before you.\\n\\nWhich will you walk?');
  }
  draw();
  if (S.avatarY < 60) {
    requestAnimationFrame(animateWalk);
  }
}

function selectPath(pathNum) {
  S.selectedPath = pathNum;
  document.querySelectorAll('.path-btn').forEach(function(b) { b.classList.remove('selected'); });
  document.getElementById('path-' + pathNum).classList.add('selected');
  document.getElementById('continue-btn').style.display = 'block';
  draw();
}

function walkPath() {
  document.getElementById('path-choice').style.display = 'none';
  document.getElementById('continue-btn').style.display = 'none';

  var pathNames = ['', 'Tend the Garden', 'Rebuild the Bridge', 'Share the Light'];
  fadeD('\u2726', 'You chose: ' + pathNames[S.selectedPath] + '\\n\\nThis path is yours to walk.');

  setTimeout(function() {
    document.getElementById('seed-btn').style.display = 'flex';
  }, 2000);
}

function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';

  initCanvas();
  draw();

  fadeD('\u2014', 'You have walked all twelve zones.\\n\\nNow you stand at the crossroads.');

  setTimeout(function() {
    animateWalk();
  }, 2000);
}

function completeGame() {
  document.getElementById('o-done').classList.remove('on');
  document.getElementById('journey-complete').classList.add('on');
}

function psPlant() {
  document.getElementById('ps-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\ud83c\udf3f All seeds planted. The garden is yours.</div>';
    BRIDGE.practiceComplete({});
    setTimeout(function() { document.getElementById('o-done').classList.add('on'); }, 800);
  }, 400);
}

function finish() {
  completeGame();
}

function beginAgain() {
  document.getElementById('journey-complete').classList.remove('on');
  BRIDGE.complete();
}

// Wire zone-specific event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('intro-btn').addEventListener('click', begin);
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);
  document.getElementById('jc-btn').addEventListener('click', beginAgain);
  document.getElementById('continue-tap').addEventListener('click', walkPath);

  // Path selection
  document.querySelectorAll('.path-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      selectPath(parseInt(btn.getAttribute('data-path')));
    });
  });

  window.addEventListener('resize', function() {
    initCanvas();
    draw();
  });
});
`,
  });
}
