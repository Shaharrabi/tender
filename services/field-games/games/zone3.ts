import { wrapFieldGame } from '../base';

/**
 * Zone 3 — The Story Field (Card-based stone game)
 *
 * Examine the stories you carry about your relationship by inspecting
 * stone cards and choosing to drop or keep them.
 * Metaphor: releasing old narratives that weigh you down.
 */
export function getZone3Html(): string {
  return wrapFieldGame({
    zone: 3,
    title: 'The Story Field',

    css: /* css */ `
/* --- Zone 3 Variables --- */
:root {
  --stone:#8B7D6B;--stone-light:#A99B89;--stone-dark:#6B5D4B;
  --sky-top:#1A1A2E;--sky-mid:#2A2A4A;--ground:#3D3424;
}

#game-area{background:linear-gradient(180deg,var(--sky-top) 0%,var(--sky-mid) 40%,#3A3040 70%,var(--ground) 100%);overflow:hidden;}

/* Sky elements */
#sky{position:absolute;inset:0;pointer-events:none;}

.star{position:absolute;width:2px;height:2px;background:rgba(255,255,255,.6);border-radius:50%;animation:twinkle 3s ease-in-out infinite;}
@keyframes twinkle{0%,100%{opacity:.3}50%{opacity:.9}}

#ground-strip{position:absolute;bottom:0;left:0;right:0;height:30%;background:linear-gradient(180deg,transparent 0%,rgba(61,52,36,.6) 30%,var(--ground) 100%);}

#path{position:absolute;bottom:10%;left:50%;transform:translateX(-50%);width:3px;height:25%;background:linear-gradient(180deg,transparent,rgba(253,246,240,.1),rgba(253,246,240,.06));border-radius:2px;}

#avatar{position:absolute;bottom:32%;left:50%;transform:translateX(-50%);font-size:clamp(20px,6vw,28px);animation:bob 3s ease-in-out infinite;z-index:2;}
@keyframes bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-4px)}}

/* Weight counter */
#weight-counter{position:absolute;top:14px;right:14px;z-index:5;background:rgba(10,6,8,.7);border:1px solid rgba(139,125,107,.25);border-radius:8px;padding:8px 12px;text-align:center;}
.wt-num{font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(16px,4.5vw,22px);color:var(--parchment);line-height:1;}
.wt-lbl{font-family:'GameMono',monospace;font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(139,125,107,.5);margin-top:2px;}

/* Stone grid */
#stone-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(6px,1.5vw,10px);padding:clamp(6px,1.5vh,10px) clamp(14px,4vw,22px);}
.stone-card{position:relative;height:clamp(56px,15vw,72px);border:none;border-radius:12px;background:linear-gradient(135deg,var(--stone),var(--stone-dark));box-shadow:0 3px 10px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'GameSerif',serif;font-style:italic;font-size:clamp(9px,2.2vw,11px);color:rgba(253,246,240,.7);text-align:center;padding:6px;line-height:1.35;transition:all .35s ease;-webkit-tap-highlight-color:transparent;overflow:hidden;}
.stone-card::before{content:'';position:absolute;inset:0;border-radius:12px;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent);pointer-events:none;}
.stone-card.dropped{opacity:.2;transform:scale(.85);pointer-events:none;}

/* Dialogue cue */
.dlg-cue{font-family:'GameMono',monospace;font-size:clamp(7px,1.8vw,9px);letter-spacing:2px;text-transform:uppercase;color:var(--terracotta);opacity:0;transition:opacity .3s;margin-top:4px;}
.dlg-cue.on{opacity:1;}

/* Practice button wrap */
#practice-btn-wrap{display:none;padding:clamp(6px,1.5vh,10px) clamp(14px,4vw,22px) clamp(10px,2vh,14px);text-align:center;}
#practice-btn{width:100%;height:clamp(44px,11vw,52px);border:none;border-radius:26px;background:linear-gradient(135deg,var(--sage),#4A8A6E);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.2vw,11px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;box-shadow:0 6px 24px rgba(107,144,128,.4);}

/* Modal sheet */
#modal{position:absolute;inset:0;z-index:55;background:rgba(45,34,38,.92);display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s;}
#modal.on{opacity:1;pointer-events:all;}
.modal-sheet{width:min(360px,92vw);background:var(--parchment);border-radius:20px 20px 0 0;padding:clamp(24px,5vw,36px) clamp(18px,5vw,26px) clamp(20px,4vh,30px);text-align:center;transform:translateY(20px);transition:transform .35s ease;}
#modal.on .modal-sheet{transform:translateY(0);}
.modal-story{font-family:'GameSerif',serif;font-style:italic;font-size:clamp(14px,3.5vw,17px);line-height:1.75;color:var(--ink);margin-bottom:clamp(8px,2vh,14px);}
.modal-q{font-family:'GameSerif',serif;font-size:clamp(11px,2.8vw,13px);line-height:1.65;color:var(--warm-gray);margin-bottom:clamp(16px,4vh,24px);}
.modal-btns{display:flex;gap:10px;}
.modal-btns button{flex:1;height:clamp(44px,11vw,52px);border-radius:26px;border:none;font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.2vw,11px);letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
#drop-btn{background:linear-gradient(135deg,var(--sage),#4A8A6E);color:white;}
#drop-btn:active{transform:scale(.96);}
#keep-btn{background:rgba(107,91,94,.08);color:var(--warm-gray);border:1px solid rgba(107,91,94,.15);}
#keep-btn:active{transform:scale(.96);}

/* Intro overlay */
#o-intro{background:linear-gradient(180deg,#1A1A2E,#2A2030);z-index:60;}

/* Practice: defuse button */
#ps-defuse-btn{width:100%;height:clamp(44px,11vw,52px);border:none;border-radius:26px;background:linear-gradient(135deg,var(--deep-rose),#6B2A3A);font-family:'GameSans',sans-serif;font-weight:600;font-size:clamp(9px,2.2vw,11px);letter-spacing:3px;text-transform:uppercase;color:white;cursor:pointer;margin-top:clamp(8px,2vh,12px);}
`,

    body: /* html */ `
  <div id="game-area">
    <div id="sky">
      <div class="star" style="left:12%;top:8%;animation-delay:0s"></div>
      <div class="star" style="left:35%;top:14%;animation-delay:0.8s"></div>
      <div class="star" style="left:58%;top:6%;animation-delay:1.6s"></div>
      <div class="star" style="left:78%;top:18%;animation-delay:0.4s"></div>
      <div class="star" style="left:25%;top:25%;animation-delay:2.1s"></div>
      <div class="star" style="left:65%;top:22%;animation-delay:1.2s"></div>
      <div class="star" style="left:88%;top:10%;animation-delay:2.8s"></div>
      <div class="star" style="left:48%;top:30%;animation-delay:0.6s"></div>
      <div id="path"></div>
      <div id="ground-strip"></div>
      <div id="avatar">\ud83e\uddd8</div>
    </div>

    <div class="zone-label"><div class="zone-num">Zone III \u00b7 Step 3</div><div class="zone-name">The Story Field</div></div>
    <div id="weight-counter"><div class="wt-num" id="wt-num">5</div><div class="wt-lbl">STONES</div></div>
  </div>

  <div id="panel">
    <div id="dialogue">
      <div class="dlg-row">
        <div class="dlg-sym" id="dlg-sym">\u2014</div>
        <div class="dlg-text" id="dlg-text">You carry old stories like stones in a bag.</div>
      </div>
      <div class="dlg-cue" id="dlg-cue"></div>
    </div>

    <div id="stone-grid"></div>

    <div id="practice-btn-wrap">
      <button id="practice-btn">\ud83c\udf31 PICK UP THE SEED</button>
    </div>

    <div id="seed-btn">
      <button id="seed-tap">\ud83c\udf31 PICK UP THE SEED</button>
      <div class="seed-note">A practice for rewriting your story</div>
    </div>
  </div>

  <div id="modal">
    <div class="modal-sheet">
      <div class="modal-story" id="modal-story"></div>
      <div class="modal-q" id="modal-q"></div>
      <div class="modal-btns">
        <button id="drop-btn">DROP IT</button>
        <button id="keep-btn">KEEP IT</button>
      </div>
    </div>
  </div>

  <div class="overlay on" id="o-intro">
    <div class="oi-b">\u2726 Zone III \u00b7 Step 3 \u2726</div>
    <div class="oi-ic">\ud83e\udea8</div>
    <div class="oi-big">The Story<br>Field</div>
    <div class="oi-sub">Examine the stories we carry</div>
    <div class="oi-desc">You carry old stories about your relationship like stones in a bag. Each one weighs you down.<br><br>Tap each stone to examine the story inside. Then choose: drop it, or keep carrying it.</div>
    <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
  </div>

  <div id="practice-overlay">
    <div class="ps-inner">
      <div class="ps-bar"><div class="ps-fill" id="ps-fill"></div></div>
      <button class="ps-x" id="ps-close">\u2715</button>
      <div class="ps-step active" id="ps-0">
        <div class="ps-eyebrow">\u2726 Practice \u00b7 Rewriting Your Story</div>
        <div class="ps-h">The Stories<br>We Carry</div>
        <div class="ps-body">We all carry stories about our partner, our relationship, ourselves.<br><br>Some protect us. Some imprison us.<br><br>This practice helps you see which is which.</div>
        <button class="ps-btn" id="ps-next-0">CONTINUE</button>
      </div>
      <div class="ps-step" id="ps-1">
        <div class="ps-eyebrow">Reflection 1</div>
        <div class="ps-h">The Story<br>I Tell</div>
        <div class="ps-body">What is the story you most often tell yourself about your partner or your relationship?</div>
        <div class="ps-box">
          <div class="ps-lbl">THE STORY I KEEP TELLING IS...</div>
          <textarea class="ps-ta" id="ps-input-1" placeholder="they never listen... I always have to... we can't..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-1">NEXT</button>
      </div>
      <div class="ps-step" id="ps-2">
        <div class="ps-eyebrow">Reflection 2</div>
        <div class="ps-h">What It<br>Protects</div>
        <div class="ps-body">Every story we carry serves a purpose. What does this story protect you from?</div>
        <div class="ps-box">
          <div class="ps-lbl">THIS STORY PROTECTS ME FROM...</div>
          <textarea class="ps-ta" id="ps-input-2" placeholder="disappointment... being hurt again... hoping too much..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-2">NEXT</button>
      </div>
      <div class="ps-step" id="ps-3">
        <div class="ps-eyebrow">Reflection 3</div>
        <div class="ps-h">The Cost</div>
        <div class="ps-body">What does carrying this story cost you? What does it prevent?</div>
        <div class="ps-box">
          <div class="ps-lbl">CARRYING THIS STORY COSTS ME...</div>
          <textarea class="ps-ta" id="ps-input-3" placeholder="closeness... trust... being present... peace..." rows="2"></textarea>
        </div>
        <button class="ps-btn" id="ps-next-3">NEXT</button>
      </div>
      <div class="ps-step" id="ps-4">
        <div class="ps-eyebrow">Defuse</div>
        <div class="ps-h">Drop The<br>Stone</div>
        <div class="ps-body">You do not have to believe every story your mind tells you.<br><br>Say this quietly:<br><em>"I notice I am telling myself the story that..."</em><br><br>Adding "I notice" creates distance. The story loosens its grip.</div>
        <button id="ps-defuse-btn">DEFUSE THIS STORY</button>
      </div>
      <div class="ps-step" id="ps-defuse">
        <div class="ps-eyebrow">Integration</div>
        <div class="ps-h">Carry This<br>Instead</div>
        <div class="ps-carry">
          The stones you dropped are not gone forever. They may return.<br><br>
          But now you know the move:<br>
          <em>"I notice I am telling myself the story that..."</em><br><br>
          Notice. Name. Set down. Repeat.
        </div>
        <button class="ps-btn" id="ps-plant">PLANT THIS SEED \u2726</button>
      </div>
    </div>
  </div>

  <div id="o-done">
    <div class="done-g">\ud83e\udea8</div>
    <div class="done-ey">Zone III Complete</div>
    <div class="done-ti">The Story Field</div>
    <div class="done-bo">You examined the stories you carry.<br>Some you dropped. Some you kept.<br>Either way, you chose consciously.</div>
    <button class="done-btn" id="done-btn">CONTINUE THE JOURNEY</button>
  </div>
`,

    js: /* js */ `
// --- Zone 3: The Story Field --- Card-based stone game ---

var STONES = [
  { story: "They never really listen to me.", defuse: "I notice I am telling myself the story that they never listen.", q: "Is this always true? Or does it feel true when you are hurting?" },
  { story: "Things will never actually change.", defuse: "I notice I am telling myself the story that nothing changes.", q: "What small changes have you missed while holding this belief?" },
  { story: "I have to do everything myself.", defuse: "I notice I am telling myself the story that I am alone in this.", q: "Is this a fact? Or a feeling that hardens into a story?" },
  { story: "They should just know what I need.", defuse: "I notice I am telling myself the story that asking means they do not care.", q: "What if needing to ask does not mean they love you less?" },
  { story: "It is too late to fix this.", defuse: "I notice I am telling myself the story that we are past repair.", q: "Does this story keep you safe, or does it keep you stuck?" }
];

// State
var S = {
  phase: 'intro',
  remaining: STONES.length,
  currentStone: -1,
  dropped: []
};

// Override base fadeD with 3-arg version that handles .dlg-cue
function fadeD(sym, text, cue) {
  var el = document.getElementById('dlg-text');
  if (!el) return;
  el.style.opacity = '0';
  var cueEl = document.getElementById('dlg-cue');
  if (cueEl) { cueEl.classList.remove('on'); }
  setTimeout(function() {
    var symEl = document.getElementById('dlg-sym');
    if (symEl) symEl.textContent = sym;
    el.textContent = text;
    el.style.opacity = '1';
    if (cueEl) {
      if (cue) {
        cueEl.textContent = cue;
        cueEl.classList.add('on');
      } else {
        cueEl.textContent = '';
        cueEl.classList.remove('on');
      }
    }
  }, 200);
}

// Build stone grid
function buildGrid() {
  var grid = document.getElementById('stone-grid');
  grid.innerHTML = '';
  STONES.forEach(function(stone, i) {
    var card = document.createElement('button');
    card.className = 'stone-card';
    card.dataset.index = i;
    card.textContent = 'Stone ' + (i + 1);
    card.addEventListener('click', function() { openStone(i); });
    grid.appendChild(card);
  });
}

// Open modal with stone details
function openStone(i) {
  if (S.dropped.indexOf(i) !== -1) return;
  S.currentStone = i;
  var stone = STONES[i];
  document.getElementById('modal-story').textContent = stone.story;
  document.getElementById('modal-q').textContent = stone.q;
  document.getElementById('modal').classList.add('on');
}

function closeModal() {
  document.getElementById('modal').classList.remove('on');
  S.currentStone = -1;
}

function dropStone() {
  if (S.currentStone < 0) return;
  var idx = S.currentStone;
  S.dropped.push(idx);
  S.remaining--;

  // Mark card as dropped
  var cards = document.querySelectorAll('.stone-card');
  if (cards[idx]) cards[idx].classList.add('dropped');

  // Update weight counter
  document.getElementById('wt-num').textContent = S.remaining;

  closeModal();
  updateWorld();

  var stone = STONES[idx];
  fadeD('\\u2726', 'You set down a stone.\\n\\n"' + stone.defuse + '"', 'STONE DROPPED');

  if (S.remaining === 0) {
    setTimeout(function() { allDropped(); }, 1200);
  }
}

function keepStone() {
  if (S.currentStone < 0) return;
  closeModal();
  fadeD('\\u2014', 'You chose to keep this stone. That is okay.\\nYou can always set it down later.', 'STONE KEPT');
}

// Update sky/avatar based on stones dropped
function updateWorld() {
  var pct = S.dropped.length / STONES.length;
  // Lighten avatar area as stones drop
  var area = document.getElementById('game-area');
  var lightness = Math.round(pct * 15);
  area.style.filter = 'brightness(' + (1 + pct * 0.15) + ')';

  // Avatar rises slightly
  var avatar = document.getElementById('avatar');
  var lift = Math.round(pct * 8);
  avatar.style.bottom = (32 + lift) + '%';
}

function allDropped() {
  S.phase = 'seed';
  fadeD('\\u2726', 'All stones dropped. You walk lighter now.\\n\\nPick up the seed to begin the practice.', 'ALL STORIES EXAMINED');
  document.getElementById('seed-btn').style.display = 'flex';
}

// Begin game
function begin() {
  document.getElementById('o-intro').classList.remove('on');
  S.phase = 'game';
  buildGrid();
  document.getElementById('stone-grid').style.display = 'grid';
  fadeD('\\u2014', 'Tap a stone to examine the story inside.', 'TAP A STONE');
}

// Zone-specific practice: psDefuse + psPlant
function psDefuse() {
  // Move to defuse result step
  psShow('defuse');
  var fill = document.getElementById('ps-fill');
  if (fill) fill.style.width = '90%';
}

function psPlant() {
  var fill = document.getElementById('ps-fill');
  if (fill) fill.style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');
    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. Notice the story. Name it. Set it down.</div>';
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
  document.getElementById('drop-btn').addEventListener('click', dropStone);
  document.getElementById('keep-btn').addEventListener('click', keepStone);

  // Close modal on background tap
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // Extra practice step wiring (zone 3 has 5 steps: 0-4 + defuse)
  var psNext3 = document.getElementById('ps-next-3');
  if (psNext3) psNext3.addEventListener('click', function() { psGo(4); });
  var defuseBtn = document.getElementById('ps-defuse-btn');
  if (defuseBtn) defuseBtn.addEventListener('click', psDefuse);
  document.getElementById('ps-plant').addEventListener('click', psPlant);
  document.getElementById('done-btn').addEventListener('click', finish);
});
`
  });
}
