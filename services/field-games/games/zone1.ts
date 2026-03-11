/**
 * Zone 1 — The Fog Field
 *
 * Couple pattern awareness: walk through fog, breathe to clear it,
 * discover the creature (the pattern) living between you.
 */
import { wrapFieldGame } from '../base';

export function getZone1Html(): string {
  return wrapFieldGame({
    zone: 1,
    title: 'The Fog Field',

    /* ─── Zone-Specific CSS ─── */
    css: `
/* zone 1 custom vars */
:root { --blue:#7294D4; }

/* WORLD (game-area) */
#game-area {
  background: linear-gradient(180deg,
    #857C78 0%, #A09690 18%,
    #BCACA4 42%, #D4C8BF 65%,
    #E6DDD4 82%, #F0E8DF 100%);
  cursor: pointer;
}

/* fog layers */
.fog { position:absolute; inset:0; pointer-events:none; transition:opacity 4s ease; }
.fog-1 {
  background:
    radial-gradient(ellipse 140% 75% at 38% 52%, rgba(238,228,218,.82) 0%, transparent 58%),
    radial-gradient(ellipse 95% 60% at 88% 38%, rgba(230,222,212,.62) 0%, transparent 54%),
    radial-gradient(ellipse 85% 55% at 18% 72%, rgba(236,226,216,.56) 0%, transparent 50%);
  animation: f1 22s ease-in-out infinite alternate;
}
.fog-2 {
  background:
    radial-gradient(ellipse 115% 68% at 60% 46%, rgba(244,236,226,.58) 0%, transparent 60%),
    radial-gradient(ellipse 72% 48% at 14% 34%, rgba(238,230,220,.44) 0%, transparent 52%);
  animation: f2 28s ease-in-out infinite alternate;
}
@keyframes f1 { from{transform:translate(0,-5px) scale(1)} to{transform:translate(5%,5px) scale(1.04)} }
@keyframes f2 { from{transform:translate(4%,3px) scale(1)} to{transform:translate(-4%,-4px) scale(1.06)} }

/* ground */
.ground {
  position:absolute; bottom:0; left:0; right:0;
  height:50%; background:#B4A494;
}
.ground::before {
  content:'';
  position:absolute; inset:0;
  background:
    repeating-linear-gradient(90deg, transparent 0, transparent 15px, rgba(0,0,0,.03) 15px, rgba(0,0,0,.03) 16px),
    repeating-linear-gradient(0deg, transparent 0, transparent 15px, rgba(0,0,0,.03) 15px, rgba(0,0,0,.03) 16px);
}
.path-strip {
  position:absolute; bottom:0; left:50%;
  transform:translateX(-50%);
  width:44px; height:100%;
  background:repeating-linear-gradient(0deg, #C8B4A0 0, #C8B4A0 12px, #B8A490 12px, #B8A490 14px);
}

/* trees */
.tree { position:absolute; }
.tree-trunk { position:absolute; bottom:0; left:50%; transform:translateX(-50%); background:#786050; }
.tree-top { position:absolute; left:50%; transform:translateX(-50%); background:#342C26; border-radius:50% 50% 40% 40%; }

/* avatars */
.av {
  position:absolute; left:50%;
  display:flex; flex-direction:column; align-items:center;
  z-index:12;
  transition:bottom .6s cubic-bezier(.4,0,.2,1);
}
.av-head { border-radius:50%; }
.av-body { margin-top:-2px; }
.av-foot { border-radius:50%; background:rgba(45,34,38,.16); margin-top:2px; }

#av-player { margin-left:-10px; }
#av-player .av-head { width:18px; height:18px; background:var(--rose); }
#av-player .av-body { width:18px; height:14px; background:var(--deep-rose); }
#av-player .av-foot { width:12px; height:4px; }

#av-partner { margin-left:-16px; opacity:0; transition:opacity 2s ease, bottom .6s ease; }
#av-partner .av-head { width:18px; height:18px; background:var(--blue); }
#av-partner .av-body { width:18px; height:14px; background:#4A6699; }
#av-partner .av-foot { width:12px; height:4px; }

@keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
.bobbing { animation:bob .4s ease infinite; }

/* creature */
#creature {
  position:absolute; left:50%;
  transform:translateX(-50%);
  opacity:0; pointer-events:none; z-index:9;
  transition:opacity 2s ease, transform 1s ease;
}
#creature .blob {
  border-radius:50%;
  background:radial-gradient(ellipse at 42% 40%,
    rgba(196,184,174,.96) 0%, rgba(214,204,194,.62) 42%, transparent 73%);
  animation:float 5s ease-in-out infinite;
}
@keyframes float { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.1) translateY(-8px)} }

/* zone label overrides for fog field */
.zone-label .zone-num { color:rgba(45,34,38,.38); }
.zone-label .zone-name { color:rgba(45,34,38,.55); }

/* HUD */
.hud {
  position:absolute; top:clamp(10px,2.5vw,16px); right:clamp(10px,2.5vw,16px); z-index:20;
  background:rgba(28,18,22,.87); border:1px solid rgba(212,168,67,.28);
  border-radius:8px; padding:clamp(7px,2vw,10px) clamp(8px,2vw,12px) clamp(5px,1.5vw,8px);
}
.hrow { display:flex; align-items:center; gap:4px; margin-bottom:5px; }
.hrow:last-child { margin-bottom:0; }
.hlbl { font-family:'GameMono',monospace; font-size:7px; color:rgba(212,168,67,.45); width:18px; }
.hh { font-size:8px; line-height:1; }
.hh.on { color:var(--rose); } .hh.off { color:rgba(255,255,255,.13); }
.harr { font-size:11px; color:var(--sage); }
.hbar { display:flex; gap:2px; }
.hbu { width:9px; height:4px; border-radius:1px; }
.hbu.on { background:var(--gold); } .hbu.off { background:rgba(255,255,255,.1); }
.hnote {
  font-family:'GameSerif',serif; font-style:italic;
  font-size:7px; color:rgba(212,168,67,.38); text-align:center;
  margin-top:5px; padding-top:4px; border-top:1px solid rgba(212,168,67,.12);
  white-space:nowrap;
}

/* dialogue cue */
.dlg-cue {
  font-family:'GameMono',monospace;
  font-size:clamp(7px,1.8vw,9px);
  letter-spacing:2px; text-transform:uppercase;
  color:rgba(107,91,94,.4); text-align:right; margin-top:4px;
  animation:blink 2.4s ease-in-out infinite;
}
.dlg-cue.hide { visibility:hidden; }
@keyframes blink { 0%,100%{opacity:.3} 55%{opacity:1} }

/* BREATHE SECTION */
#breathe-section {
  display:none;
  flex-direction:column; align-items:center;
  padding:clamp(4px,1vh,8px) clamp(14px,4vw,24px) clamp(12px,2.5vh,20px);
  gap:clamp(8px,1.5vh,14px);
}
.b-label {
  font-family:'GameMono',monospace;
  font-size:clamp(9px,2.2vw,11px);
  letter-spacing:2px; text-transform:uppercase;
  color:var(--warm-gray); text-align:center;
}
.b-label em { color:var(--rose); font-style:normal; font-weight:600; }

/* Circle hold button */
#b-circle {
  width:clamp(80px,22vw,100px);
  height:clamp(80px,22vw,100px);
  border-radius:50%;
  border:3px solid rgba(196,97,110,.4);
  background:rgba(196,97,110,.08);
  position:relative; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:background .2s, border-color .2s, transform .15s;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
  touch-action:none;
}
#b-circle:active { transform:scale(0.96); }
#b-circle.active {
  background:rgba(196,97,110,.85);
  border-color:var(--rose);
  transform:scale(1.02);
}

/* SVG progress ring */
#b-svg {
  position:absolute; inset:-6px;
  width:calc(100% + 12px); height:calc(100% + 12px);
  transform:rotate(-90deg); pointer-events:none;
}
#b-track { fill:none; stroke:rgba(196,97,110,.18); stroke-width:4; }
#b-prog  { fill:none; stroke:var(--rose); stroke-width:4; stroke-linecap:round; }

.b-word {
  font-family:'GameSans',sans-serif; font-weight:400;
  font-size:clamp(10px,2.5vw,12px);
  letter-spacing:3px; text-transform:uppercase;
  color:var(--rose); pointer-events:none; position:relative; z-index:1;
  transition:color .15s;
}
#b-circle.active .b-word { color:white; }

.b-pips { display:flex; gap:12px; }
.b-pip {
  width:12px; height:12px; border-radius:50%;
  background:var(--terracotta); opacity:.25;
  transition:opacity .4s, background .4s, transform .3s;
}
.b-pip.done { opacity:1; background:var(--sage); transform:scale(1.1); }

/* intro overlay: fog-field specific colors */
#o-intro { background:var(--ink); z-index:60; }
#o-intro .oi-sub { color:rgba(212,168,67,.55); }
#o-intro .oi-btn {
  border-color:rgba(196,97,110,.5);
  color:rgba(196,97,110,.85);
}
#o-intro .oi-btn:active { background:rgba(196,97,110,.15); border-color:var(--rose); }

/* intro extra elements */
.oi-ital {
  font-family:'GameSerif',serif; font-style:italic;
  font-size:clamp(12px,3vw,14px);
  color:rgba(241,187,123,.6); margin-bottom:clamp(18px,4vh,32px);
}
.divider { display:flex; align-items:center; gap:14px; margin-bottom:clamp(12px,3vh,20px); }
.div-line { width:28px; height:1px; background:rgba(212,168,67,.28); }
.div-sym { font-family:'GameMono',monospace; font-size:10px; color:rgba(212,168,67,.5); }
.oi-zone {
  font-family:'GameMono',monospace;
  font-size:clamp(8px,2vw,10px); letter-spacing:2.5px; text-transform:uppercase;
  color:rgba(212,168,67,.4); margin-bottom:clamp(20px,5vh,36px);
}

/* practice shell: zone 1 uses its own pr- prefix structure */
#practice-overlay {
  position:absolute; inset:0; z-index:70;
  background:rgba(45,34,38,.96);
  display:flex; align-items:center; justify-content:center;
  opacity:0; pointer-events:none; transition:opacity .4s;
}
#practice-overlay.on { opacity:1; pointer-events:all; }
.pr-shell {
  width:100%; max-width:340px;
  background:var(--parchment);
  border-radius:20px; overflow:hidden;
  position:relative; max-height:85vh; overflow-y:auto;
}
.pr-prog { height:4px; background:rgba(107,91,94,.12); }
.pr-prog-fill { height:100%; width:0; background:var(--sage); transition:width .4s ease; }
.pr-x {
  position:absolute; top:12px; right:14px;
  width:28px; height:28px; border-radius:14px;
  border:none; background:rgba(107,91,94,.08);
  font-size:14px; color:var(--warm-gray); cursor:pointer;
  display:flex; align-items:center; justify-content:center; z-index:2;
}
.pr-step {
  display:none; padding:clamp(22px,5vw,32px) clamp(18px,5vw,28px);
  flex-direction:column; text-align:center;
}
.pr-step.active { display:flex; animation:prFadeUp .4s ease; }
@keyframes prFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.pr-eyebrow {
  font-family:'GameMono',monospace;
  font-size:clamp(7px,1.8vw,9px); letter-spacing:3px; text-transform:uppercase;
  color:var(--terracotta); margin-bottom:clamp(10px,2.5vh,16px);
}
.pr-h {
  font-family:'GameSans',sans-serif; font-weight:300;
  font-size:clamp(20px,5.5vw,26px); letter-spacing:2px; text-transform:uppercase;
  color:var(--ink); line-height:1.15; margin-bottom:clamp(14px,3.5vh,22px);
}
.pr-body {
  font-family:'GameSerif',serif; font-style:italic;
  font-size:clamp(12px,3vw,14px); line-height:1.85;
  color:rgba(45,34,38,.65); margin-bottom:clamp(18px,4.5vh,28px);
}
.pr-opts { display:flex; flex-direction:column; gap:10px; margin-bottom:clamp(18px,4.5vh,28px); }
.pr-opt {
  width:100%; padding:14px 18px;
  border:1.5px solid rgba(107,91,94,.18); border-radius:12px;
  background:transparent; text-align:left; cursor:pointer;
  font-family:'GameSerif',serif; font-style:italic;
  font-size:clamp(11px,2.8vw,13px); color:var(--ink);
  transition:all .2s;
}
.pr-opt:active { border-color:var(--sage); background:rgba(107,144,128,.06); }
.pr-btn {
  width:100%; height:clamp(44px,11vw,52px);
  border:none; border-radius:26px;
  background:linear-gradient(135deg, var(--rose), var(--deep-rose));
  font-family:'GameSans',sans-serif; font-weight:600;
  font-size:clamp(9px,2.2vw,11px); letter-spacing:3px; text-transform:uppercase;
  color:white; cursor:pointer; transition:transform .15s;
}
.pr-btn:active { transform:scale(.97); }
.pr-btn.sage { background:linear-gradient(135deg, var(--sage), #4A8A6E); }
.pr-input-box {
  background:rgba(107,91,94,.04); border-radius:12px;
  padding:clamp(12px,3vw,18px); margin-bottom:clamp(14px,3.5vh,22px);
}
.pr-input-label {
  font-family:'GameMono',monospace;
  font-size:clamp(7px,1.8vw,9px); letter-spacing:2px; text-transform:uppercase;
  color:var(--warm-gray); margin-bottom:8px; text-align:left;
}
.pr-input {
  width:100%; border:none; background:transparent;
  font-family:'GameSerif',serif; font-style:italic;
  font-size:clamp(13px,3.2vw,15px); color:var(--ink);
  line-height:1.6; resize:none; outline:none;
}
.pr-input::placeholder { color:rgba(107,91,94,.35); }
.pr-insight-box {
  background:rgba(139,58,74,.06); border-radius:12px;
  padding:clamp(14px,3.5vw,20px); margin-bottom:clamp(14px,3.5vh,22px);
}
.pr-pattern-name {
  font-family:'GameSans',sans-serif; font-weight:600;
  font-size:clamp(16px,4.2vw,20px); letter-spacing:2px; text-transform:uppercase;
  color:var(--deep-rose); margin-bottom:6px;
}
.pr-pattern-note {
  font-family:'GameSerif',serif; font-style:italic;
  font-size:clamp(11px,2.8vw,13px); color:rgba(139,58,74,.55);
}
.pr-carry {
  background:rgba(107,144,128,.08); border-radius:12px;
  padding:clamp(12px,3vw,18px); margin-bottom:clamp(18px,4.5vh,26px);
  font-family:'GameSerif',serif; font-style:italic;
  font-size:clamp(11px,2.8vw,13px); line-height:1.75; color:var(--sage);
  text-align:left;
}
.pr-carry em { color:var(--deep-rose); font-style:normal; font-weight:600; }
`,

    /* ─── HTML Body ─── */
    body: `
<!-- WORLD -->
<div id="game-area" onclick="worldTap()">

  <!-- fog layers -->
  <div class="fog fog-1" id="fog1"></div>
  <div class="fog fog-2" id="fog2"></div>

  <!-- ground + path -->
  <div class="ground">
    <div class="path-strip"></div>
  </div>

  <!-- trees -->
  <div class="tree" style="left:12%; bottom:52%">
    <div class="tree-top" style="width:28px; height:34px; bottom:18px;"></div>
    <div class="tree-trunk" style="width:6px; height:18px;"></div>
  </div>
  <div class="tree" style="left:82%; bottom:58%">
    <div class="tree-top" style="width:22px; height:28px; bottom:14px;"></div>
    <div class="tree-trunk" style="width:5px; height:14px;"></div>
  </div>
  <div class="tree" style="left:24%; bottom:68%">
    <div class="tree-top" style="width:18px; height:22px; bottom:10px;"></div>
    <div class="tree-trunk" style="width:4px; height:10px;"></div>
  </div>

  <!-- player avatar -->
  <div class="av" id="av-player" style="bottom:65px">
    <div class="av-head"></div>
    <div class="av-body"></div>
    <div class="av-foot"></div>
  </div>

  <!-- partner avatar (fades in) -->
  <div class="av" id="av-partner" style="bottom:220px">
    <div class="av-head"></div>
    <div class="av-body"></div>
    <div class="av-foot"></div>
  </div>

  <!-- fog creature (appears between you) -->
  <div id="creature" style="bottom:145px">
    <div class="blob" style="width:62px; height:52px;"></div>
  </div>

  <!-- zone label -->
  <div class="zone-label">
    <div class="zone-num">Zone I</div>
    <div class="zone-name">The Fog Field</div>
  </div>

  <!-- HUD -->
  <div class="hud">
    <div class="hrow">
      <div class="hlbl">R</div>
      <div class="hh off">&#9829;</div><div class="hh off">&#9829;</div><div class="hh off">&#9829;</div><div class="hh off">&#9829;</div><div class="hh off">&#9829;</div>
    </div>
    <div class="hrow">
      <div class="hlbl">E</div>
      <div class="harr">&#8594;</div>
    </div>
    <div class="hrow">
      <div class="hlbl">F</div>
      <div class="hbar">
        <div class="hbu off"></div><div class="hbu off"></div><div class="hbu off"></div>
        <div class="hbu off"></div><div class="hbu off"></div><div class="hbu off"></div>
        <div class="hbu off"></div><div class="hbu off"></div><div class="hbu off"></div>
        <div class="hbu off"></div><div class="hbu off"></div><div class="hbu off"></div>
      </div>
    </div>
    <div class="hnote">the space between you</div>
  </div>

</div><!-- /game-area -->

<!-- PANEL -->
<div id="panel">
  <!-- dialogue -->
  <div id="dialogue">
    <div class="dlg-row">
      <div class="dlg-sym" id="dlg-sym">&mdash;</div>
      <div class="dlg-text" id="dlg-text">Step into the field...</div>
    </div>
    <div class="dlg-cue hide" id="dlg-cue">TAP ANYWHERE TO CONTINUE &#8250;</div>
  </div>

  <!-- breathe section -->
  <div id="breathe-section">
    <div class="b-label" id="b-label">
      <em>Hold the circle</em> to breathe &middot; 3 seconds
    </div>
    <div id="b-circle">
      <svg id="b-svg" viewBox="0 0 100 100">
        <circle id="b-track" cx="50" cy="50" r="46"/>
        <circle id="b-prog" cx="50" cy="50" r="46"/>
      </svg>
      <div class="b-word" id="b-word">HOLD</div>
    </div>
    <div class="b-pips">
      <div class="b-pip" id="b-p1"></div>
      <div class="b-pip" id="b-p2"></div>
      <div class="b-pip" id="b-p3"></div>
    </div>
  </div>

  <!-- seed button -->
  <div id="seed-btn">
    <button id="seed-tap">
      <span class="seed-glyph">&#127793;</span> PICK UP THE SEED
    </button>
    <div class="seed-note">Something to carry into your day</div>
  </div>
</div>

<!-- INTRO OVERLAY -->
<div class="overlay on" id="o-intro">
  <div class="oi-sub">Tender &middot; The Science of Relationships</div>
  <div class="oi-big">The Field</div>
  <div class="oi-ital">A journey through the space between you</div>
  <div class="divider"><div class="div-line"></div><div class="div-sym">&#10022;</div><div class="div-line"></div></div>
  <div class="oi-zone">Zone I</div>
  <button class="oi-btn" id="intro-btn">ENTER THE FIELD</button>
</div>

<!-- PRACTICE MODAL -->
<div id="practice-overlay">
  <div class="pr-shell">
    <div class="pr-prog"><div class="pr-prog-fill" id="pr-prog-fill"></div></div>
    <button class="pr-x" id="pr-close">&#10005;</button>

    <!-- Step 0: Opening -->
    <div class="pr-step active" id="pr-step-0">
      <div class="pr-eyebrow">&#10022; Practice &middot; Knowing Your Dance</div>
      <div class="pr-h">Before We Begin</div>
      <div class="pr-body">This practice works best when you are inside your window of tolerance &mdash; present, grounded, able to notice without being overwhelmed.</div>
      <div class="pr-opts">
        <button class="pr-opt" id="pr-ready">I'm ready &mdash; let's begin</button>
        <button class="pr-opt" id="pr-later">I need to come back later</button>
      </div>
    </div>

    <!-- Step 1: Framing -->
    <div class="pr-step" id="pr-step-1">
      <div class="pr-eyebrow">Framing</div>
      <div class="pr-h">The Dance</div>
      <div class="pr-body">Every couple has a pattern &mdash; a dance they do when things get hard. One reaches, one retreats. Or both escalate. Or both withdraw.<br><br>This isn't about who's right. It's about <em>seeing the dance itself</em>.</div>
      <button class="pr-btn" id="pr-next-1">CONTINUE</button>
    </div>

    <!-- Step 2: Your move -->
    <div class="pr-step" id="pr-step-2">
      <div class="pr-eyebrow">The Work</div>
      <div class="pr-h">Your Move</div>
      <div class="pr-body">Think of a recent moment when tension arose between you. What did <em>you</em> do?</div>
      <div class="pr-input-box">
        <div class="pr-input-label">WHEN IT STARTED, I...</div>
        <textarea class="pr-input" id="pr-input-2" rows="2" placeholder="got louder... asked for reassurance... went quiet..."></textarea>
      </div>
      <button class="pr-btn" id="pr-next-2">NEXT</button>
    </div>

    <!-- Step 3: Their move -->
    <div class="pr-step" id="pr-step-3">
      <div class="pr-eyebrow">The Work</div>
      <div class="pr-h">Their Move</div>
      <div class="pr-body">And what did they do in response?</div>
      <div class="pr-input-box">
        <div class="pr-input-label">AND THEN THEY...</div>
        <textarea class="pr-input" id="pr-input-3" rows="2" placeholder="shut down... walked away... got defensive..."></textarea>
      </div>
      <button class="pr-btn" id="pr-next-3">SEE THE PATTERN</button>
    </div>

    <!-- Step 4: The Pattern -->
    <div class="pr-step" id="pr-step-4">
      <div class="pr-eyebrow">The Insight</div>
      <div class="pr-h">Your Pattern</div>
      <div class="pr-insight-box">
        <div class="pr-pattern-name" id="pr-pattern-display">The Reach &amp; Retreat</div>
        <div class="pr-pattern-note">This is not either person's fault. It is the dance itself.</div>
      </div>
      <div class="pr-body">When you see the pattern, you're no longer trapped inside it. You're watching it from outside.</div>
      <button class="pr-btn" id="pr-next-4">CONTINUE</button>
    </div>

    <!-- Step 5: Reflections -->
    <div class="pr-step" id="pr-step-5">
      <div class="pr-eyebrow">Closing</div>
      <div class="pr-h">Reflection</div>
      <div class="pr-input-box">
        <div class="pr-input-label">WHAT SURPRISED YOU?</div>
        <textarea class="pr-input" rows="2" placeholder="Something I noticed..."></textarea>
      </div>
      <div class="pr-input-box">
        <div class="pr-input-label">WHAT DID YOU NOTICE IN THE SPACE BETWEEN YOU?</div>
        <textarea class="pr-input" rows="2" placeholder="In the space, there was..."></textarea>
      </div>
      <button class="pr-btn" id="pr-next-5">NEXT</button>
    </div>

    <!-- Step 6: Integration -->
    <div class="pr-step" id="pr-step-6">
      <div class="pr-eyebrow">Integration</div>
      <div class="pr-h">Carry This</div>
      <div class="pr-carry">
        Today, when the pattern starts &mdash; just notice.<br><br>
        Say to yourself: <em>"There's our thing."</em><br><br>
        That's it. Noticing is the first step.
      </div>
      <button class="pr-btn sage" id="ps-plant">PLANT THIS SEED &#10022;</button>
    </div>
  </div>
</div>

<!-- DONE OVERLAY -->
<div id="o-done">
  <div class="done-g">&#127807;</div>
  <div class="done-ey">Zone I Complete</div>
  <div class="done-ti">The Fog Field</div>
  <div class="done-bo">You saw the pattern.<br>You breathed through it.<br>You planted a seed.<br><br>The work has begun.</div>
  <button class="done-btn" id="done-btn">RETURN TO THE FIELD</button>
</div>
`,

    /* ─── Game JavaScript ─── */
    js: `
// ══════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════
var CIRC = 2 * Math.PI * 46;
var HOLD_MS = 3000;

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
var S = {
  running: false,
  line: -1,
  playerY: 65,
  partnerShown: false,
  creatureShown: false,
  breatheCount: 0,
  holding: false,
  holdStart: 0,
  raf: null,
  breatheOpen: false,
  seedVisible: false,
};

// ══════════════════════════════════════════════
// DIALOGUE SCRIPT
// ══════════════════════════════════════════════
var LINES = [
  { sym:'\\u2014', text:'The fog is not a problem to solve.', cue:true },
  { sym:'\\u2014', text:'It is what it looks like when two people try to protect themselves at the same time.', cue:true },
  { sym:'\\u2014', text:'Every couple has a pattern.\\nOne reaches. One retreats.\\nOr both go loud. Or both go quiet.', cue:true },
  { sym:'\\u2726', text:'There you are.', cue:true, partner:true },
  { sym:'\\u2014', text:"You can\\u2019t see them clearly.\\nThey can\\u2019t see you clearly.\\n\\nThis is where we begin.", cue:true },
  { sym:'\\u25C6', text:'This is the pattern.\\nIt lives between you \\u2014\\nnot in either of you. Between you.', cue:true, creature:true },
  { sym:'\\u2014', text:"You can\\u2019t force your way through it.\\nBut you can change the conditions around it.", cue:false, openBreathe:true },
];

var BREATHE_LINES = [
  { sym:'\\u2726', text:'One breath.\\nThe fog shifted \\u2014 did you feel it?' },
  { sym:'\\u2726', text:'Two breaths.\\nThe creature is smaller now.' },
  { sym:'\\u2726', text:'Three breaths.\\nLook what happens when you stop pushing.' },
];

// ══════════════════════════════════════════════
// PRACTICE STATE + NAVIGATION (zone 1's own practice)
// ══════════════════════════════════════════════
var PR = {
  currentStep: 0,
  totalSteps: 7,
};

// ══════════════════════════════════════════════
// EVENT WIRING
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // intro
  document.getElementById('intro-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    startGame(e);
  });

  // seed tap -> open zone-1 practice
  document.getElementById('seed-tap').addEventListener('click', function(e) {
    e.stopPropagation();
    onSeedTap();
  });

  // practice close
  document.getElementById('pr-close').addEventListener('click', function(e) { e.stopPropagation(); closeZonePractice(); });
  document.getElementById('pr-ready').addEventListener('click', function(e) { e.stopPropagation(); prNext(); });
  document.getElementById('pr-later').addEventListener('click', function(e) { e.stopPropagation(); closeZonePractice(); });
  document.getElementById('pr-next-1').addEventListener('click', function(e) { e.stopPropagation(); prNext(); });
  document.getElementById('pr-next-2').addEventListener('click', function(e) { e.stopPropagation(); prNext(); });
  document.getElementById('pr-next-3').addEventListener('click', function(e) { e.stopPropagation(); prNext(); });
  document.getElementById('pr-next-4').addEventListener('click', function(e) { e.stopPropagation(); prNext(); });
  document.getElementById('pr-next-5').addEventListener('click', function(e) { e.stopPropagation(); prNext(); });

  // plant
  document.getElementById('ps-plant').addEventListener('click', function(e) { e.stopPropagation(); psPlant(); });

  // done
  document.getElementById('done-btn').addEventListener('click', function(e) { e.stopPropagation(); finish(); });
});

// ══════════════════════════════════════════════
// START GAME
// ══════════════════════════════════════════════
function startGame(e) {
  if (e) e.stopPropagation();
  var intro = document.getElementById('o-intro');
  intro.classList.remove('on');
  S.running = true;
  setTimeout(function() { showLine(0); }, 700);
}

// ══════════════════════════════════════════════
// WORLD TAP — advance dialogue
// ══════════════════════════════════════════════
function worldTap() {
  if (!S.running) return;
  if (S.breatheOpen) return;
  var next = S.line + 1;
  if (next < LINES.length) {
    showLine(next);
    walkPlayer();
  }
}

// ══════════════════════════════════════════════
// SHOW DIALOGUE LINE
// ══════════════════════════════════════════════
function showLine(i) {
  S.line = i;
  var d = LINES[i];
  fadeDialogue(d.sym, d.text, d.cue ? 'TAP ANYWHERE TO CONTINUE \\u203A' : null);

  if (d.partner && !S.partnerShown) {
    S.partnerShown = true;
    document.getElementById('av-partner').style.opacity = '1';
  }
  if (d.creature && !S.creatureShown) {
    S.creatureShown = true;
    var cr = document.getElementById('creature');
    cr.style.opacity = '1';
    cr.style.transition = 'opacity 2s ease';
  }
  if (d.openBreathe) {
    setTimeout(openBreathe, 900);
  }
}

// ══════════════════════════════════════════════
// FADE DIALOGUE
// ══════════════════════════════════════════════
function fadeDialogue(sym, text, cue) {
  var el = document.getElementById('dlg-text');
  var cueEl = document.getElementById('dlg-cue');
  el.style.opacity = '0';
  setTimeout(function() {
    document.getElementById('dlg-sym').textContent = sym;
    el.textContent = text;
    el.style.opacity = '1';
    if (cue) {
      cueEl.textContent = cue;
      cueEl.classList.remove('hide');
    } else {
      cueEl.classList.add('hide');
    }
  }, 220);
}

// ══════════════════════════════════════════════
// WALK PLAYER
// ══════════════════════════════════════════════
function walkPlayer() {
  var player = document.getElementById('av-player');
  player.classList.add('bobbing');
  S.playerY += 18;
  player.style.bottom = S.playerY + 'px';
  setTimeout(function() { player.classList.remove('bobbing'); }, 400);
}

// ══════════════════════════════════════════════
// BREATHE — open
// ══════════════════════════════════════════════
function openBreathe() {
  S.breatheOpen = true;
  document.getElementById('dialogue').style.display = 'none';
  document.getElementById('breathe-section').style.display = 'flex';

  var circle = document.getElementById('b-circle');
  circle.addEventListener('mousedown', breatheDown);
  circle.addEventListener('touchstart', breatheDown, { passive: false });
  circle.addEventListener('mouseup', breatheUp);
  circle.addEventListener('mouseleave', breatheUp);
  circle.addEventListener('touchend', breatheUp);
  circle.addEventListener('touchcancel', breatheUp);
}

// ══════════════════════════════════════════════
// BREATHE — hold start
// ══════════════════════════════════════════════
function breatheDown(e) {
  e.preventDefault();
  e.stopPropagation();
  if (S.holding || S.breatheCount >= 3) return;

  S.holding = true;
  S.holdStart = performance.now();

  var circle = document.getElementById('b-circle');
  circle.classList.add('active');
  document.getElementById('b-word').textContent = 'HOLD...';

  function tick(now) {
    if (!S.holding) return;
    var progress = Math.min((now - S.holdStart) / HOLD_MS, 1);
    setRing(progress);
    if (progress >= 1) {
      onBreatheDone();
    } else {
      S.raf = requestAnimationFrame(tick);
    }
  }
  S.raf = requestAnimationFrame(tick);
}

// ══════════════════════════════════════════════
// BREATHE — hold end (released early)
// ══════════════════════════════════════════════
function breatheUp(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  if (!S.holding) return;
  S.holding = false;
  if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; }
  setRing(0);
  document.getElementById('b-circle').classList.remove('active');
  document.getElementById('b-word').textContent = 'HOLD';
}

// ══════════════════════════════════════════════
// BREATHE — completed a full hold
// ══════════════════════════════════════════════
function onBreatheDone() {
  S.holding = false;
  if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; }
  S.breatheCount++;

  setRing(1);
  document.getElementById('b-circle').classList.remove('active');
  setTimeout(function() {
    setRing(0);
    document.getElementById('b-word').textContent = S.breatheCount < 3 ? 'HOLD' : '\\u2726';
  }, 450);

  document.getElementById('b-p' + S.breatheCount).classList.add('done');

  var cr = document.getElementById('creature');
  var s = 1 - S.breatheCount * 0.22;
  var op = Math.max(0.9 - S.breatheCount * 0.18, 0.08);
  cr.style.transition = 'transform 1s ease, opacity 1s ease';
  cr.style.transform = 'translateX(-50%) scale(' + s + ')';
  cr.style.opacity = op;

  var fb = BREATHE_LINES[S.breatheCount - 1];
  showFeedback(fb.sym, fb.text);

  var lbl = document.getElementById('b-label');
  if (S.breatheCount < 3) {
    lbl.innerHTML = '<em>' + (3 - S.breatheCount) + ' more breath' + (3 - S.breatheCount > 1 ? 's' : '') + '</em> \\u2014 hold again';
  } else {
    lbl.innerHTML = 'Three breaths. Something shifted.';
  }

  if (S.breatheCount >= 3) {
    setTimeout(function() {
      document.getElementById('breathe-section').style.display = 'none';
      S.breatheOpen = false;
      S.seedVisible = true;
      document.getElementById('seed-btn').style.display = 'flex';
    }, 2200);
  }
}

function showFeedback(sym, text) {
  document.getElementById('dialogue').style.display = 'flex';
  fadeDialogue(sym, text, null);
  setTimeout(function() {
    if (S.breatheOpen) {
      document.getElementById('dialogue').style.display = 'none';
    }
  }, 1800);
}

// ══════════════════════════════════════════════
// SVG RING HELPER
// ══════════════════════════════════════════════
function setRing(progress) {
  var filled = progress * CIRC;
  document.getElementById('b-prog').setAttribute('stroke-dasharray', filled + ' ' + CIRC);
}

// ══════════════════════════════════════════════
// SEED TAP — open zone-1 practice
// ══════════════════════════════════════════════
function onSeedTap() {
  if (!S.seedVisible) return;
  PR.currentStep = 0;
  showPrStep(0);
  updatePrProgress();
  document.getElementById('practice-overlay').classList.add('on');
}

function closeZonePractice() {
  document.getElementById('practice-overlay').classList.remove('on');
}

// ══════════════════════════════════════════════
// PRACTICE NAVIGATION
// ══════════════════════════════════════════════
function prNext() {
  var next = PR.currentStep + 1;
  if (next >= PR.totalSteps) return;
  showPrStep(next);
  updatePrProgress();
}

function showPrStep(i) {
  var cur = document.querySelector('.pr-step.active');
  if (cur) cur.classList.remove('active');
  var el = document.getElementById('pr-step-' + i);
  if (el) el.classList.add('active');
  PR.currentStep = i;
  if (i === 4) derivePrPattern();
}

function updatePrProgress() {
  var pct = (PR.currentStep / (PR.totalSteps - 1)) * 100;
  document.getElementById('pr-prog-fill').style.width = pct + '%';
}

function derivePrPattern() {
  var myMove = (document.getElementById('pr-input-2').value || '').toLowerCase();
  var theirMove = (document.getElementById('pr-input-3').value || '').toLowerCase();

  var pattern = 'The Reach & Retreat';

  var pursueWords = ['ask','push','reach','louder','voice','pursue','chase','more','reassure','talk','explain'];
  var withdrawWords = ['quiet','away','shut','leave','distance','withdraw','silent','space','walk','defensive'];

  var iPursue = pursueWords.some(function(w) { return myMove.includes(w); });
  var iWithdraw = withdrawWords.some(function(w) { return myMove.includes(w); });
  var theyPursue = pursueWords.some(function(w) { return theirMove.includes(w); });
  var theyWithdraw = withdrawWords.some(function(w) { return theirMove.includes(w); });

  if (iPursue && theyWithdraw) pattern = 'The Reach & Retreat';
  else if (iWithdraw && theyPursue) pattern = 'The Retreat & Reach';
  else if (iPursue && theyPursue) pattern = 'The Escalation';
  else if (iWithdraw && theyWithdraw) pattern = 'The Mutual Withdrawal';

  document.getElementById('pr-pattern-display').textContent = pattern;
}

// ══════════════════════════════════════════════
// PLANT SEED — completes the practice
// ══════════════════════════════════════════════
function psPlant() {
  document.getElementById('pr-prog-fill').style.width = '100%';
  setTimeout(function() {
    document.getElementById('practice-overlay').classList.remove('on');

    var sb = document.getElementById('seed-btn');
    sb.innerHTML = '<div style="font-family:GameSerif,serif;font-style:italic;font-size:14px;color:var(--sage);text-align:center;padding:12px 0">\\ud83c\\udf31 Seed planted. The work begins.</div>';

    // Update HUD
    document.querySelectorAll('.hbu').forEach(function(el, i) { if (i < 6) el.classList.add('on'); });
    document.querySelectorAll('.hh').forEach(function(el, i) { if (i < 4) el.classList.add('on'); });

    BRIDGE.practiceComplete({});

    setTimeout(function() { document.getElementById('o-done').classList.add('on'); }, 900);
  }, 400);
}

// ══════════════════════════════════════════════
// COMPLETE
// ══════════════════════════════════════════════
function finish() {
  document.getElementById('o-done').classList.remove('on');

  document.getElementById('fog1').style.opacity = '0.18';
  document.getElementById('fog2').style.opacity = '0.12';

  document.getElementById('dialogue').style.display = 'flex';
  fadeDialogue('\\u2014',
    'The pattern has a name now.\\nYou can return here whenever you need this place.',
    null
  );

  BRIDGE.complete();
}
`,
  });
}
