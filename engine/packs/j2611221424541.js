/* Scene pack j2611221424541: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for JS42, SC42, MS42, SB43, SP43.
   Layout prefix j2611221424541_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots   [{at|cue, env, envOpt, toons, cam, props, cards, part, ...}]  hard cut (cream flash) inside one scene
     hold    [{on, kind, at|cue, outCue, s, dx, dy, rot, ...}]  object in a toon's hand (hamper, phone, notebook, folder, mug, pages, tablet, toolbox, memo, polaroid)
     things  [{kind, x, y, s, rot, at|cue, outCue, front, keys:[{cue, x, y, dur}]}]  world objects (same kinds + cone, printer, clock2, gate, counter, folderL)
     flies   [{cue|at, kind, from:[x,y], to:[x,y] | toHand: j, dur, s, arc}]  object thrown along an arc (world)
     eyes    [{on, at|cue, outCue}]  "seen" eye chip over a toon's head          tiles [{cue, col, icon}] + tray {text, cue}  habit tiles fly to a top tray
     badges  [{on, at|cue, outCue, text, col}]   pops [{at|cue, text, x, y, size, rot, col}]   stamps [{at|cue, text, x, y, col}]   confetti {at|cue}
   Set pieces (layout suffix):
     _adegan  generic story shot with the extras above
     _parsel  hamper workshop: wall shelves, workbench, hampers that pop in (each variant different), wall vitrine with the correct sample,
              glance lines, numbered tag chips, pyramid of identical hampers            f.ws {hampers:[{x, v, cue}], vit:{at|cue, tags:[{cue, n, text}]}, glanceCue, pyr:{cue, x}}
     _bicara  client office: two hampers on a desk come alive and argue with speech bubbles      f.ar {lines:[{cue, who, text}]}
     _vitrin  spotlight pedestal: the sample hamper is assembled, numbered, then a glass case drops over it   f.vt {buildCue, doneCue, tagCue, tags:[..], caseCue, thinkCue}
     _antar   street: hamper shop front, photo flash, polaroid taped on the window, van leaves     f.sh {flashCue, pinCue, vanCue}
     _kolam   swimming pool + diving tower with four boards (photo mode) or navy diagram mode: labelled boards, risk/return arrow, divers
              f.pool {mode: real|diagram, kid:{cue}, labels:[{cue, n, text}], arrowCue, divers:[{actor, board, cue, kind: nice|flop}], notes:[{cue, board, text}]}
     _tawar   street at dusk: cousin with a sandwich board, dream panel (tall board over a soft mattress, coins), mini-tower memory   f.of {holoCue, recallCue}
     _brosur  home at night: giant offer flyer, red flag springs up, LEGAL? / LOGIS? stamps crossed out, flyer tears     f.fl {flagCue, q:[{cue, text, xCue}], tearCue}
     _toko    minimarket aisle: living hazards (oil puddle, frayed cable, leaning boxes) that get a wet-floor sign, tape, rope; or fixed later
              f.mk {aliveCue, signCue, tapeCue, ropeCue, dryCue, cableCue, stackCue}
     _licin   imagination (navy): grandma pushes a trolley toward a puddle in slow motion, tilts, freeze "BELUM TERJADI"   f.sl {granny, slowCue, slipCue}
     _mozaik  portrait mosaic of habit tiles: full (info) tiles fly in + labels, or wall frame flipping tiles to gold
              f.mz {mode: full|wall, inCue, doneCue, labels:[{cue, text}], flips:[{cue, to}], smileCue}
     _cetak   office: printer spits five report pages that pin to the wall                         f.pr {startAt, hl:[{cue, n, chip}], sendCue}
     _taksi   moving taxi on the street: passenger scrolls, report ribbon streams out of the window, KENDALA page blows away   f.tx {scrollCue, lostCue, sleepCue}
     _reli    imagination rally: car on a dirt road, co-driver pace notes CAPAIAN / KENDALA / RENCANA, pothole jump   f.rl {notes:[{cue, text, col}], jumpCue}
     _bandara airport lounge window: three-line memo writes itself line by line            f.memo {lines:[{cue, text, col}], y}  */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424541_";
  const REG = {}; const SC = (n, l, d, sf) => { REG[n] = [d, sf]; TT.scene(n, l, d, sf); };
  const ALIAS = (n, from, l) => TT.scene(PX + n, l, (...a) => REG[PX + from][0](...a), (...a) => REG[PX + from][1](...a));
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", BLUE = "#3F6FB5", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .35), 0, 1));
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); fit(ctx, txt, 820, size, 900, 30); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot, maxW){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size, maxW); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.moveTo(x + Math.cos(a) * r * .6 + r * .55, y + Math.sin(a) * r * .45); ctx.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .45, r * .55, 0, TAU); } ctx.fillStyle = col; ctx.fill(); }
  function checkMark(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }
  function crossMark(ctx, x, y, r, k, col){ if (k < 0) return; const q = clamp(k / .25, 0, 1), q2 = clamp((k - .12) / .25, 0, 1); ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = r * .22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * q, y - r + 2 * r * q); ctx.stroke(); if (q2 > 0){ ctx.beginPath(); ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * q2, y - r + 2 * r * q2); ctx.stroke(); } ctx.restore(); }
  function dust(ctx, x, y, t, n, col, spread){ for (let i = 0; i < n; i++){ const q = (t * .9 + i / n) % 1; ctx.save(); ctx.globalAlpha = .55 * (1 - q); puffC(ctx, x - q * (spread || 220) - rnd(i) * 40, y - q * 60 - rnd(i + 3) * 30, 26 + q * 40, col || "#E8D2B0"); ctx.restore(); } }

  /* ---------- hamper (parsel): origin = bottom centre ---------- */
  const HV = { rib: RED, ribX: 1, card: "front", n: 5, tilt: 0, wrap: true };
  function hamper(ctx, x, y, s, t, o){
    o = o || {}; const v = Object.assign({}, HV, o.v || {}); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(v.tilt || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    const nItems = o.fill != null ? Math.floor(o.fill * v.n + .001) : v.n;
    const itemCols = ["#7FA563", GOLD, "#D9483B", "#5B7DB1", "#E8A55B", "#8E4E2E"];
    for (let i = 0; i < nItems; i++){ const ix = -78 + i * (156 / Math.max(1, v.n - 1)), h = 70 + (i * 37 % 60), col = itemCols[(i + (v.seed || 0)) % itemCols.length];
      const drop = o.dropK && o.dropK[i] != null ? (1 - eOut(clamp(o.dropK[i], 0, 1))) * -260 : 0;
      ctx.save(); ctx.translate(ix, drop);
      if (i % 3 === 0){ rr(ctx, -16, -90 - h, 32, h, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); rr(ctx, -9, -108 - h, 18, 22, 4); ctx.fillStyle = BROWN; ctx.fill(); }
      else if (i % 3 === 1){ rr(ctx, -30, -90 - h * .8, 60, h * .8, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .6); ctx.fillRect(-22, -80 - h * .6, 44, 10); }
      else { ctx.beginPath(); ctx.ellipse(0, -95 - h * .35, 30, h * .4, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); }
      ctx.restore(); }
    // basket
    ctx.beginPath(); ctx.moveTo(-118, -100); ctx.lineTo(118, -100); ctx.lineTo(96, 0); ctx.lineTo(-96, 0); ctx.closePath(); ctx.fillStyle = "#C98F4E"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#7A4A22", .55); ctx.lineWidth = 5; for (let k = -6; k <= 6; k++){ ctx.beginPath(); ctx.moveTo(k * 22, -100); ctx.lineTo(k * 18, 0); ctx.stroke(); }
    for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(-120, -80 + k * 24); ctx.lineTo(120, -80 + k * 24); ctx.stroke(); } ctx.restore();
    rr(ctx, -126, -112, 252, 24, 10); ctx.fillStyle = "#A86A34"; ctx.fill(); ol(ctx, 5);
    if (v.wrap && o.wrap !== false){ ctx.beginPath(); ctx.moveTo(-122, -104); ctx.quadraticCurveTo(-130, -250, -20, -268); ctx.lineTo(20, -268); ctx.quadraticCurveTo(130, -250, 122, -104);
      ctx.fillStyle = hexA("#E8F6FA", .28); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .85); ctx.lineWidth = 4; ctx.stroke();
      ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-90, -130); ctx.quadraticCurveTo(-98, -210, -50, -236); ctx.stroke(); }
    // ribbon bow
    if (v.rib && o.rib !== false){ const bx = v.ribX * 96, by = -112, w = Math.sin(t * 3 + (v.seed || 0)) * .08;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(w); ctx.fillStyle = v.rib;
      [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(d * 46, -40, d * 50, 0); ctx.quadraticCurveTo(d * 46, 26, 0, 0); ctx.fill(); ol(ctx, 4); });
      ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(-22, 50); ctx.lineTo(-8, 44); ctx.lineTo(2, 56); ctx.lineTo(8, 6); ctx.fill(); ol(ctx, 3);
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore();
      if (o.glow === "rib") glowAt(ctx, bx, by, 110, GOLD, .5 + .2 * Math.sin(t * 8)); }
    // card
    if (v.card !== "none" && o.card !== false){ const cp = { front: [0, -48, 0], top: [0, -282, -.1], side: [-118, -150, -.5], left: [-60, -50, .2] }[v.card] || [0, -48, 0];
      ctx.save(); ctx.translate(cp[0], cp[1]); ctx.rotate(cp[2]); rr(ctx, -40, -26, 80, 52, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-20, -4, -10, -20, 0, -8); ctx.bezierCurveTo(10, -20, 20, -4, 0, 12); ctx.fill(); ctx.restore();
      if (o.glow === "card") glowAt(ctx, cp[0], cp[1], 100, GOLD, .5 + .2 * Math.sin(t * 8)); }
    if (o.glow === "items") glowAt(ctx, 0, -160, 150, GOLD, .4 + .2 * Math.sin(t * 8));
    // face (living hamper)
    if (o.face){ const talkA = o.face.talk || 0, mood = o.face.mood || "angry", bl = ((t + (v.seed || 0)) % 2.9) < .12;
      [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 38, -60, 17, bl ? 3 : 20, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
        if (!bl){ ctx.beginPath(); ctx.arc(d * 38 + (o.face.lookX || 0) * 6, -56, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
        if (mood === "angry"){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(d * 18, -84); ctx.lineTo(d * 56, -96); ctx.stroke(); } });
      const mo = 6 + talkA * 18; ctx.beginPath(); ctx.ellipse(0, -24, 22, mo, 0, 0, TAU); ctx.fillStyle = "#7A2A1F"; ctx.fill(); ol(ctx, 4); }
    ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "hamper"){ hamper(ctx, 0, 70, .55, t, o); }
    else if (kind === "phone"){ ctx.rotate(-.15); rr(ctx, -36, -70, 72, 140, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); rr(ctx, -28, -58, 56, 112, 8); ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fill();
      if (o.flash){ glowAt(ctx, 0, -20, 220, "#FFFFFF", o.flash); } ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-20, -44 + k * 22 - ((t * 40) % 22) * (o.scroll ? 1 : 0), 30 + (k * 13 % 14), 8); }
    else if (kind === "notebook"){ ctx.rotate(-.1); rr(ctx, -70, -90, 140, 180, 10); ctx.fillStyle = o.col || "#F6C343"; ctx.fill(); ol(ctx, 5); rr(ctx, -56, -76, 112, 152, 6); ctx.fillStyle = PAPER; ctx.fill();
      const n = o.n != null ? o.n : 3; for (let i = 0; i < n; i++){ ctx.fillStyle = i % 2 ? ORANGE : TEAL; rr(ctx, -44, -60 + i * 30, 70 + rnd(i) * 18, 12, 6); ctx.fill(); } }
    else if (kind === "folder"){ ctx.rotate(-.08); rr(ctx, -95, -70, 190, 140, 10); ctx.fillStyle = o.col || ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -95, -86, 80, 24, 6); ctx.fill(); ol(ctx, 4);
      rr(ctx, -70, -40, 140, 50, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); textC(ctx, o.text || "PROYEK", 0, -6, 24, BROWN, 900, 130); }
    else if (kind === "mug"){ rr(ctx, -34, -80, 68, 80, 10); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(36, -42, 16, -1.3, 1.3); ol(ctx, 6);
      if (o.dirty){ ctx.fillStyle = "#8E5A2E"; [[-14, -30, 10], [10, -52, 7], [-4, -14, 6]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(a, b, r, 0, TAU); ctx.fill(); });
        for (let i = 0; i < 2; i++){ const a = t * 5 + i * 3; ctx.fillStyle = "#2C2433"; ctx.beginPath(); ctx.arc(Math.cos(a) * 50, -110 + Math.sin(a * 1.3) * 20, 5, 0, TAU); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 50 + 4, -116 + Math.sin(a * 1.3) * 20, 6, 3, .5, 0, TAU); ctx.stroke(); } }
      else if (o.clean){ sparkle(ctx, 30, -90, 16 + 4 * Math.sin(t * 6), GOLD); } }
    else if (kind === "pages"){ const n = o.n || 6; for (let i = n - 1; i >= 0; i--){ ctx.save(); ctx.translate(i * 4, -i * 6); ctx.rotate((rnd(i) - .5) * .12); rr(ctx, -70, -95, 140, 190, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.restore(); }
      for (let k = 0; k < 6; k++){ ctx.fillStyle = hexA(BROWN, .35); ctx.fillRect(-52, -70 + k * 24, 90 + rnd(k) * 14, 8); } }
    else if (kind === "memo"){ ctx.rotate(-.06); rr(ctx, -90, -70, 180, 140, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); [GREEN, RED, BLUE].forEach((c, k) => { ctx.beginPath(); ctx.arc(-62, -34 + k * 36, 10, 0, TAU); ctx.fillStyle = c; ctx.fill(); ctx.fillStyle = hexA(BROWN, .5); ctx.fillRect(-44, -40 + k * 36, 110, 10); }); }
    else if (kind === "tablet"){ ctx.rotate(-.1); rr(ctx, -80, -60, 160, 120, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); rr(ctx, -68, -48, 136, 96, 6); ctx.fillStyle = "#EAF3F6"; ctx.fill();
      for (let k = 0; k < 3; k++){ ctx.fillStyle = k < (o.n ?? 3) ? GREEN : "#C9D2DA"; ctx.beginPath(); ctx.arc(-46, -26 + k * 28, 8, 0, TAU); ctx.fill(); ctx.fillStyle = hexA(BROWN, .45); ctx.fillRect(-30, -30 + k * 28, 80, 8); } }
    else if (kind === "toolbox"){ rr(ctx, -80, -70, 160, 70, 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-36, -70); ctx.lineTo(-30, -100); ctx.lineTo(30, -100); ctx.lineTo(36, -70); ol(ctx, 8); ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-60, -46, 120, 8); }
    else if (kind === "polaroid"){ rr(ctx, -80, -95, 160, 190, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#F4E3C8"; ctx.fillRect(-66, -82, 132, 132); ctx.save(); ctx.beginPath(); ctx.rect(-66, -82, 132, 132); ctx.clip(); hamper(ctx, 0, 40, .45, t, {}); ctx.restore();
      textC(ctx, "CONTOH BENAR", 0, 80, 18, BROWN, 900, 140);
      if (o.tape){ ctx.save(); ctx.globalAlpha = .8; ctx.fillStyle = "#F3E2A0"; ctx.translate(-70, -96); ctx.rotate(-.6); ctx.fillRect(-30, -10, 60, 20); ctx.restore(); ctx.save(); ctx.globalAlpha = .8; ctx.fillStyle = "#F3E2A0"; ctx.translate(70, -96); ctx.rotate(.6); ctx.fillRect(-30, -10, 60, 20); ctx.restore(); } }
    else if (kind === "cone"){ // A-frame wet floor sign
      ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-40, -230); ctx.lineTo(40, -230); ctx.lineTo(70, 0); ctx.closePath(); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(36, -140); ctx.lineTo(-36, -140); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); textC(ctx, "!", 0, -150, 40, OUT, 900);
      textC(ctx, "AWAS", 0, -90, 30, OUT, 900); textC(ctx, "LICIN", 0, -55, 30, OUT, 900); }
    else if (kind === "printer"){ rr(ctx, -130, -150, 260, 150, 14); ctx.fillStyle = "#E8E4DA"; ctx.fill(); ol(ctx, 6); rr(ctx, -100, -170, 200, 30, 6); ctx.fillStyle = "#CFC9BC"; ctx.fill(); ol(ctx, 4);
      rr(ctx, -100, -60, 200, 16, 4); ctx.fillStyle = "#2C2433"; ctx.fill(); ctx.beginPath(); ctx.arc(95, -110, 9, 0, TAU); ctx.fillStyle = o.busy && Math.sin(t * 14) > 0 ? GREEN : "#7FA563"; ctx.fill(); }
    else if (kind === "folderL"){ rr(ctx, -120, -170, 240, 170, 12); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); rr(ctx, -120, -192, 100, 30, 8); ctx.fill(); ol(ctx, 4); textC(ctx, o.text || "LAMPIRAN", 0, -70, 34, "#FFFFFF", 900, 210); }
    else if (kind === "coin"){ ctx.beginPath(); ctx.ellipse(0, 0, 30 * Math.abs(Math.cos(t * 4 + (o.seed || 0))) + 4, 30, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); }
    else if (kind === "alarm"){ ctx.beginPath(); ctx.arc(0, -60, 56, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -60, 42, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3);
      ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, -88); ctx.moveTo(0, -60); ctx.lineTo(18, -52); ctx.stroke(); [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 40, -112, 16, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); });
      if (o.ring){ const r = Math.sin(t * 40) * .15; ctx.rotate(r); for (let i = 0; i < 3; i++){ ctx.strokeStyle = hexA(ORANGE, .8); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -60, 76 + i * 16, -2.4, -.7); ctx.stroke(); } } }
    else if (kind === "note"){ ctx.rotate(o.rot2 || -.05); ctx.fillStyle = o.col || "#F6E27A"; ctx.fillRect(-90, -70, 180, 140); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.strokeRect(-90, -70, 180, 140);
      const lines = String(o.text || "").split("\n"); lines.forEach((ln, k) => textC(ctx, ln, 0, -8 + k * 40 - (lines.length - 1) * 20, 30, BROWN, 900, 160)); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function thingPos(s, th, t, idx){ let x = th.x ?? 540, y = th.y ?? GY;
    (th.keys || []).forEach((k, j) => { const T0 = tOf(s, k, .2 + j * .1, idx); if (t < T0) return; const q = easeIO(clamp((t - T0) / (k.dur || .8), 0, 1)); x = lerp(x, k.x ?? x, q); y = lerp(y, k.y ?? y, q); }); return [x, y]; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.mod) H.mod(sts, f);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = { c, f, shotT, sts };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1); return popQ(t, T0); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const drawThings = front => layer(ctx, c, 1, () => (f.things || []).filter(th => !!th.front === front).forEach((th, n) => {
      const T0 = th.cue || th.at != null ? tOf(s, th, .3 + n * .05, idx) : -1, O = th.outCue ? T(s, th.outCue, .5, idx) : 1e9; if (t < T0 || t > O + .3) return;
      const q = T0 < 0 ? 1 : popQ(t, T0), oq = 1 - clamp((t - O) / .3, 0, 1), p = thingPos(s, th, t, idx);
      ctx.save(); ctx.globalAlpha *= oq; drawItem(ctx, th.kind, p[0], p[1], t, Object.assign({}, th, { s: (th.s || 1) * q })); ctx.restore(); }));
    const holds = (f.hold || []).map((h) => Object.assign({}, h, { T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }));
    if (H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false); drawThings(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      const r = R[j];
      if (r) layer(ctx, c, 1, () => {
        holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => { const p = handOf(st), q = h.T < 0 ? 1 : popQ(t, h.T, .3);
          drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0) - (st.y - r.y), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1),
            flash: h.flashCue ? Math.max(0, 1 - Math.abs(t - T(s, h.flashCue, .5, idx)) / .25) : 0 })); });
      });
      if (H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    (f.flies || []).forEach((fl, n) => { const T0 = tOf(s, fl, .3 + n * .1, idx), d = fl.dur || .8; if (t < T0) return; const q = clamp((t - T0) / d, 0, 1);
      if (q >= 1 && fl.vanish) return;
      let to = fl.to; if (fl.toHand != null && sts[fl.toHand]) { const hp = handOf(sts[fl.toHand]); to = [hp[0], hp[1] - 20]; }
      if (q >= 1 && fl.toHand != null) return;
      const e = easeIO(q), x = lerp(fl.from[0], to[0], e), y = lerp(fl.from[1], to[1], e) - Math.sin(q * Math.PI) * (fl.arc ?? 260);
      layer(ctx, c, 1, () => drawItem(ctx, fl.kind, x, y, t, Object.assign({}, fl, { s: fl.s || 1, rot: (fl.spin ?? 1) * q * TAU }))); });
    if (H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true); drawThings(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, clamp(p[0] + (b.dx || 0), 220, 860), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180, 560)); });
    (f.eyes || []).forEach((e, n) => { const T0 = tOf(s, e, .3 + n * .05, idx), O = e.outCue ? T(s, e.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[e.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => eyeChip(ctx, clamp(p[0] + (e.dx || 0), 120, 960), Math.max(220, p[1] - 60 + (e.dy || 0)), t - T0, t)); });
    if (f.tiles){ const tr = f.tray || {}; const tl = f.tiles.map((ti, n) => Object.assign({ T: tOf(s, ti, .3 + n * .1, idx) }, ti)), N = tl.length, trT = tr.cue ? T(s, tr.cue, .5, idx) : 1e9;
      ovs.push(() => { const y0 = tr.y || 330, sp = 120, x0 = 540 - (N - 1) * sp / 2;
        tl.forEach((ti, n) => { const k = t - ti.T; if (k < 0) return; const q = eOut(clamp(k / .7, 0, 1)); const r = ti.on != null && R[ti.on] && R[ti.on].screen ? R[ti.on].screen.top : [ti.x ?? 540, ti.y ?? 900];
          const x = lerp(r[0], x0 + n * sp, q), y = lerp(r[1], y0, q) - Math.sin(q * Math.PI) * 120, sc = .6 + .4 * q + (k > .7 && k < 1 ? .15 * Math.sin((k - .7) / .3 * Math.PI) : 0);
          ctx.save(); ctx.translate(x, y); ctx.rotate((1 - q) * 3 + (t > trT ? Math.sin(t * 8 + n) * .08 : 0)); ctx.scale(sc, sc); rr(ctx, -48, -48, 96, 96, 14); ctx.fillStyle = ti.col || RED; ctx.fill(); ol(ctx, 6);
          if (ti.icon) icon(ctx, ti.icon, 0, 0, 52, "#FFFFFF", 6); ctx.restore(); });
        if (t > trT) popChip(ctx, tr.text || "TERLIHAT", 540, y0 + 100, t - trT, GOLD, BROWN, 34, -.03, 700); }); }
    (f.stamps || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx); if (t < T0) return; const x = p.x ?? 540, y = p.y ?? 600;
      ovs.push(() => { stampBox(ctx, p.text, x, y, t - T0, p.col || ORANGE, p.size || 60, (p.rot ?? -8) * Math.PI / 180); burstFx(ctx, x, y, t - T0 - .1, p.col || HL, 12, 200); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
  function eyeChip(ctx, x, y, k, t){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    rr(ctx, -62, -40, 124, 80, 40); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-44, 0); ctx.quadraticCurveTo(0, -36, 44, 0); ctx.quadraticCurveTo(0, 36, -44, 0); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    const lx = Math.sin(t * 2) * 8; ctx.beginPath(); ctx.arc(lx, 0, 15, 0, TAU); ctx.fillStyle = "#3B7DB1"; ctx.fill(); ctx.beginPath(); ctx.arc(lx, 0, 7, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); }
  function sfxBase(s, f0, i, add){
    const all = [f0].concat(f0.shots || []);
    all.forEach((f, n) => {
      const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
      if (n > 0) add(tOf(s, f, .2, i), "whoosh");
      (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
      (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
      if (n === 0 || f.cards !== f0.cards) (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
      (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); });
      (f.things || []).forEach((th, n2) => { if (th.cue) add(tOf(s, th, .3 + n2 * .05, i), "pop"); });
      (f.flies || []).forEach((fl, n2) => add(tOf(s, fl, .3 + n2 * .1, i), "whoosh"));
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      (f.eyes || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "ping"); });
      (f.tiles || []).forEach((b, n2) => add(tOf(s, b, .3 + n2 * .1, i), "pop"));
      (f.stamps || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i) + .05, "chime"));
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const sfxWith = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); fn(s, f, i, add); };
  // draw a toon actor at an arbitrary position / rotation (pivot = waist)
  function drawFig(ctx, actor, s, t, x, y, rot, pose){ const st = toonState(actor, s, t); st.x = x; st.y = y; if (pose) st.pose = pose;
    ctx.save(); const py = y - st.size * .3; ctx.translate(x, py); ctx.rotate(rot || 0); ctx.translate(-x, -py); TT.drawToon(ctx, actor, st, t); ctx.restore(); return st; }

  /* ================= _adegan ================= */
  SC(PX + "adegan", "Cerita: adegan + efek (benda di tangan, benda dunia, lemparan, mata melihat, ubin kebiasaan, kata pop, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= _parsel: hamper workshop ================= */
  function shopWall(ctx, t, o){
    ctx.fillStyle = "#F4E3C8"; ctx.fillRect(-700, 120, 2500, GY - 120); ctx.fillStyle = "#C98F5E"; ctx.fillRect(-700, GY - 430, 2500, 430);
    ctx.strokeStyle = hexA("#7A4A22", .35); ctx.lineWidth = 4; for (let x = -700; x < 1800; x += 90){ ctx.beginPath(); ctx.moveTo(x, GY - 430); ctx.lineTo(x, GY); ctx.stroke(); }
    ctx.fillStyle = "#A86A34"; ctx.fillRect(-700, GY - 440, 2500, 16);
    const shelf = (x0, x1, y) => { rr(ctx, x0, y, x1 - x0, 20, 5); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4);
      for (let x = x0 + 30, i = 0; x < x1 - 30; x += 58, i++){ const h = 60 + (i * 23 % 50), col = ["#E8A55B", "#7FA563", RED, BLUE, GOLD, "#B9A58E"][(i + Math.floor(x)) % 6];
        if (i % 2){ rr(ctx, x - 18, y - h, 36, h, 8); } else { rr(ctx, x - 24, y - h * .75, 48, h * .75, 4); } ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); } };
    shelf(-260, 300, 700); shelf(-260, 300, 930); shelf(780, 1340, 700); shelf(780, 1340, 930);
    // ribbon spools on pegs
    for (let i = 0; i < 4; i++){ const x = 830 + i * 120, y = 1080 + Math.sin(t * 2 + i) * 3; ctx.beginPath(); ctx.arc(x, y, 34, 0, TAU); ctx.fillStyle = [RED, BLUE, GOLD, GREEN][i]; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fillStyle = "#F4E3C8"; ctx.fill(); ol(ctx, 3);
      ctx.strokeStyle = [RED, BLUE, GOLD, GREEN][i]; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x + 30, y + 10); ctx.quadraticCurveTo(x + 40 + Math.sin(t * 3 + i) * 8, y + 80, x + 26, y + 130); ctx.stroke(); }
    if (!o.noSign){ rr(ctx, 340, 280, 400, 90, 14); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 5); textC(ctx, "PARSEL RATNA", 540, 340, 46, GOLD, 900, 360); }
  }
  function vitrine(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    glowAt(ctx, 0, 0, 330, "#FFE9A8", .35 + .08 * Math.sin(t * 3));
    rr(ctx, -190, -170, 380, 340, 16); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 7); rr(ctx, -166, -146, 332, 292, 8); ctx.fillStyle = "#FFF7E6"; ctx.fill(); ol(ctx, 4);
    hamper(ctx, 0, 130, .95, t, { v: o.v, glow: o.glow });
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.moveTo(-160, -140); ctx.lineTo(-90, -140); ctx.lineTo(-160, -20); ctx.closePath(); ctx.fill();
    rr(ctx, -110, 182, 220, 46, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, "CONTOH BENAR", 0, 214, 26, BROWN, 900, 200);
    const tagPos = [[96, -20], [0, 60], [-60, -70]];
    (o.tags || []).forEach((k, n) => { if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)), p = tagPos[n]; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(n + 1), 0, 11, 32, "#FFFFFF", 900); ctx.restore(); });
    ctx.restore(); }
  SC(PX + "parsel", "Cerita: bengkel parsel (rak, meja kerja, parsel beda-beda / kembar, vitrin contoh benar, lirikan)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, W = Object.assign({ vx: 540, vy: 600, vs: 1 }, f0.ws || {});
    const hs = (W.hampers || []).map((h, n) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .3 + n * .1, idx) : -1 }, h));
    const vit = W.vit, vT = vit ? (vit.cue || vit.at != null ? tOf(s, vit, .3, idx) : -1) : 1e9;
    const tags = vit ? (vit.tags || []).map((g, n) => Object.assign({ T: T(s, g.cue, .3, idx) }, g)) : [];
    const gT = W.glanceCue ? T(s, W.glanceCue, .3, idx) : 1e9, pyT = W.pyr ? T(s, W.pyr.cue, .3, idx) : 1e9;
    const benchTop = GY - 330;
    const curTag = tags.filter(g => t >= g.T).length;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { vit: [W.vx, W.vy + 120, 1.1], bench: [540, benchTop - 120, 1.05] },
      back: () => { shopWall(ctx, t, { noSign: !!vit });
        if (vit && t >= vT){ const q = vT < 0 ? 1 : eBack(clamp((t - vT) / .5, 0, 1)); vitrine(ctx, W.vx, W.vy - (1 - q) * 500, W.vs, t, { v: vit.v, tags: tags.map(g => t - g.T), glow: ["rib", "card", "items"][curTag - 1] && t - tags[curTag - 1].T < 1.6 ? ["rib", "card", "items"][curTag - 1] : null }); } },
      front: () => { // workbench
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(540, GY + 6, 700, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, -300, benchTop, 1680, 50, 12); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#A86A34"; ctx.fillRect(-280, benchTop + 50, 1640, GY - benchTop - 30); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-280, benchTop + 50, 1640, GY - benchTop - 30);
        ctx.strokeStyle = hexA("#5A3A2A", .4); ctx.lineWidth = 4; for (let x = -240; x < 1360; x += 160){ ctx.beginPath(); ctx.moveTo(x, benchTop + 70); ctx.lineTo(x, GY); ctx.stroke(); }
        // ribbon scraps & scissors on the bench
        ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, benchTop + 4); ctx.quadraticCurveTo(100, benchTop - 20 + Math.sin(t * 2) * 4, 150, benchTop + 4); ctx.stroke();
        hs.forEach((h, n) => { if (h.T >= 0 && t < h.T) return; const k = h.T < 0 ? 9 : t - h.T, drop = k < .4 ? (1 - eOut(k / .4)) * -380 : 0, sq = k >= .4 && k < .7 ? 1 - .12 * Math.sin((k - .4) / .3 * Math.PI) : 1;
          ctx.save(); ctx.translate(h.x, benchTop + 4 + drop); ctx.scale(2 - sq, sq); hamper(ctx, 0, 0, h.s || .95, t, { v: h.v, glow: h.glowCue && t > T(s, h.glowCue, .3, idx) ? h.glow : null }); ctx.restore();
          if (k >= .4 && k < 1.2) dust(ctx, h.x + 120, benchTop, (k - .4) * 1.4, 4, "#F3E2C8", 120); });
        if (t >= pyT){ const P = W.pyr, rows = [3, 2, 1], sc = P.s || .5; let n = 0;
          rows.forEach((cnt, r) => { for (let i = 0; i < cnt; i++, n++){ const tt = pyT + n * .16; if (t < tt) continue; const k = t - tt, dy = k < .3 ? (1 - eOut(k / .3)) * -300 : 0;
            const x = P.x + (i - (cnt - 1) / 2) * 130 * sc / .5, y = benchTop + 4 - r * 125 * sc / .5 + dy; hamper(ctx, x, y, sc, t, { v: P.v }); } });
          if (t - pyT > .9){ sparkle(ctx, P.x + 110 * Math.sin(t * 2), benchTop - 330 + 40 * Math.cos(t * 3), 20, GOLD); sparkle(ctx, P.x - 140, benchTop - 160 + 20 * Math.sin(t * 4), 16, "#FFFFFF"); } } },
      over: (ctx2, c, sts, R) => {
        if (t >= gT && t < gT + 3.2){ const vp = c.toScreen(W.vx, W.vy); sts.forEach((st, j) => { const r = R[j]; if (!r || !r.screen) return; const hp = r.screen.head || r.screen.top, a = Math.min(1, (t - gT) / .3) * (1 - clamp((t - gT - 2.7) / .5, 0, 1));
          ctx.save(); ctx.globalAlpha = a * .9; ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 80; ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(hp[0], hp[1] - 40); ctx.quadraticCurveTo((hp[0] + vp[0]) / 2, Math.min(hp[1], vp[1]) - 60, vp[0], vp[1] + 120); ctx.stroke(); ctx.restore(); }); }
        tags.forEach((g, n) => { const k = t - g.T; if (k < 0 || !g.text) return; const vp = c.toScreen(W.vx, W.vy), x = clamp(vp[0] + (n % 2 ? -1 : 1) * 330, 200, 880), y = vp[1] - 110 + n * 110;
          popChip(ctx, (n + 1) + ". " + g.text, x, y, k, n === curTag - 1 ? GOLD : PAPER, BROWN, 32, (n % 2 ? 3 : -3) * Math.PI / 180, 320); });
      } });
  }, sfxWith((s, f, i, add) => { const W = f.ws || {}; (W.hampers || []).forEach((h, n) => { if (h.cue) add(tOf(s, h, .3 + n * .1, i) + .38, "pop"); });
    if (W.vit && W.vit.cue) add(cueT(s, W.vit.cue, .3, i), "whoosh"); ((W.vit || {}).tags || []).forEach(g => add(cueT(s, g.cue, .3, i), "ping"));
    if (W.glanceCue) add(cueT(s, W.glanceCue, .3, i), "whoosh"); if (W.pyr) add(cueT(s, W.pyr.cue, .3, i) + .5, "chime"); }));

  /* ================= _bicara: living hampers argue on the client's desk ================= */
  SC(PX + "bicara", "Cerita: dua parsel hidup di meja klien saling berdebat", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, A = Object.assign({ deskX: 690, hx: [560, 830], vs: [{ rib: RED, ribX: 1, card: "front" }, { rib: BLUE, ribX: -1, card: "top", seed: 2 }] }, f0.ar || {});
    const lines = (A.lines || []).map((l, n) => Object.assign({ T: T(s, l.cue, .3, idx) }, l));
    const deskTop = GY - 290 * 1.1, wake = A.wakeCue ? T(s, A.wakeCue, .3, idx) : -1;
    const talkOf = who => { const l = lines.filter(l => l.who === who && t >= l.T && t < l.T + 1.5).pop(); return l ? Math.abs(Math.sin((t - l.T) * 14)) : 0; };
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 980 },
      spots: { desk: [A.deskX, deskTop - 160, 1.15] },
      back: () => { prop(ctx, "desk", A.deskX, GY, { s: 1.1, papers: 2 }, t); },
      front: () => { [0, 1].forEach(w => { const tk = talkOf(w), hop = tk > 0 ? Math.abs(Math.sin(t * 10)) * 26 : 0, rot = tk > 0 ? Math.sin(t * 12) * .06 : 0;
          ctx.save(); ctx.translate(A.hx[w], deskTop - hop); ctx.rotate(rot); hamper(ctx, 0, 0, .9, t, { v: A.vs[w], face: t >= wake ? { talk: tk, mood: "angry", lookX: w ? -1 : 1 } : null }); ctx.restore();
          if (hop > 18) { ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 5; for (let i = -1; i <= 1; i++){ ctx.beginPath(); ctx.moveTo(A.hx[w] + i * 40, deskTop + 10); ctx.lineTo(A.hx[w] + i * 50, deskTop + 30); ctx.stroke(); } } }); },
      over: (ctx2, c) => { lines.forEach((l) => { const k = t - l.T; if (k < 0 || k > 1.6) return; const p = c.toScreen(A.hx[l.who], deskTop - 260);
        TT.bubble(ctx, l.text, p[0], p[1], k, { kind: "shout", size: 46, maxW: 420, side: l.who ? 1 : -1 }); }); } });
  }, sfxWith((s, f, i, add) => ((f.ar || {}).lines || []).forEach(l => add(cueT(s, l.cue, .3, i), "pop"))));

  /* ================= _vitrin: assembling the correct sample on a pedestal ================= */
  SC(PX + "vitrin", "Cerita: parsel contoh dirangkai di atas alas bersorot, diberi nomor, ditutup kaca", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, V = Object.assign({ x: 640, top: GY - 380, hs: 1.35 }, f0.vt || {});
    const tB = T(s, V.buildCue, .3, idx), tD = T(s, V.doneCue, .5, idx), tG = T(s, V.tagCue, .4, idx), tC = T(s, V.caseCue, .4, idx), tTh = T(s, V.thinkCue, .3, idx);
    const tags = V.tags || ["PITA KANAN", "KARTU DEPAN", "5 BARANG"];
    base(ctx, s, t, { env: "info", envOpt: { spotX: V.x },
      spots: { ped: [V.x, V.top - 200, 1.1] },
      back: () => { ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(V.x, GY + 6, 300, 24, 0, 0, TAU); ctx.fill();
        if (V.table){ // dining table at night under a pendant lamp
          ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(V.x, 0); ctx.lineTo(V.x, V.top - 620); ctx.stroke();
          ctx.save(); ctx.globalAlpha = .22 + .03 * Math.sin(t * 3); ctx.fillStyle = "#FFE9A8"; ctx.beginPath(); ctx.moveTo(V.x - 70, V.top - 560); ctx.lineTo(V.x + 70, V.top - 560); ctx.lineTo(V.x + 330, V.top); ctx.lineTo(V.x - 330, V.top); ctx.closePath(); ctx.fill(); ctx.restore();
          ctx.beginPath(); ctx.moveTo(V.x - 90, V.top - 560); ctx.quadraticCurveTo(V.x, V.top - 680, V.x + 90, V.top - 560); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); glowAt(ctx, V.x, V.top - 550, 140, "#FFE9A8", .8);
          ctx.fillStyle = "#6B4426"; [[-250, 0], [230, 0]].forEach(([dx]) => { rr(ctx, V.x + dx, V.top, 24, GY - V.top, 6); ctx.fill(); ol(ctx, 4); });
          rr(ctx, V.x - 300, V.top - 30, 600, 44, 10); ctx.fillStyle = "#A86A34"; ctx.fill(); ol(ctx, 6);
          ctx.save(); rr(ctx, V.x - 290, V.top + 14, 580, 110, 6); ctx.clip(); for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++){ ctx.fillStyle = (i + j) % 2 ? hexA(ORANGE, .85) : hexA(CREAM, .95); ctx.fillRect(V.x - 290 + i * 50, V.top + 14 + j * 40, 50, 40); } ctx.restore();
          [[-230, RED], [-150, BLUE], [190, GOLD]].forEach(([dx, c2], k) => { ctx.save(); ctx.translate(V.x + dx, V.top - 34); ctx.rotate(k * .4); ctx.strokeStyle = c2; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.quadraticCurveTo(0, -18 + Math.sin(t * 2 + k) * 4, 30, 0); ctx.stroke(); ctx.restore(); }); }
        else { rr(ctx, V.x - 150, V.top, 300, GY - V.top, 10); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 6); rr(ctx, V.x - 175, V.top - 30, 350, 40, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); }
        if (t > tC && !V.table){ rr(ctx, V.x - 110, V.top + 90, 220, 60, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, "CONTOH BENAR", V.x, V.top + 131, 28, BROWN, 900, 200); } },
      front: () => {
        if (t < tB) return; const n = 5, dropK = []; for (let i = 0; i < n; i++) dropK.push((t - tB - .25 - i * .3) / .35);
        const fill = clamp(Math.floor((t - tB - .25) / .3) + 1, 0, n) / n, done = t >= tD;
        const q0 = popQ(t, tB, .35); ctx.save(); ctx.translate(V.x, V.top - 30); ctx.scale(q0, q0);
        hamper(ctx, 0, 0, V.hs, t, { v: { rib: RED, ribX: 1, card: "front", n: 5 }, fill: done ? 1 : fill, dropK: done ? null : dropK, wrap: done, rib: done, card: done, glow: t > tG && t < tG + 3.5 ? ["rib", "card", "items"][Math.floor((t - tG) / .9) % 3] : null });
        ctx.restore();
        if (done && t - tD < 1.4){ for (let i = 0; i < 6; i++) sparkle(ctx, V.x + Math.cos(i + t * 3) * 220, V.top - 220 + Math.sin(i * 2 + t * 3) * 140, 18, i % 2 ? GOLD : "#FFFFFF"); }
        // numbered badges on the hamper
        const bp = [[V.x + 96 * V.hs, V.top - 30 - 112 * V.hs], [V.x, V.top - 30 - 48 * V.hs], [V.x - 50 * V.hs, V.top - 30 - 200 * V.hs]];
        bp.forEach((p, k) => { const kk = t - tG - k * .9; if (kk < 0) return; const q = eBack(clamp(kk / .35, 0, 1)); ctx.save(); ctx.translate(p[0] + 40, p[1] - 40); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, String(k + 1), 0, 13, 38, "#FFFFFF", 900); ctx.restore(); });
        // glass case
        if (t >= tC){ const k = t - tC, dy = k < .45 ? (1 - eOut(k / .45)) * -700 : (k < .7 ? Math.sin((k - .45) / .25 * Math.PI) * -18 : 0), w = 380 * V.hs / 1.35, h = 470 * V.hs / 1.35;
          ctx.save(); ctx.translate(V.x, V.top - 30 + dy); rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = hexA("#DDF1F7", .22); ctx.fill(); ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = 6; ctx.stroke();
          ctx.fillStyle = hexA("#FFFFFF", .45); ctx.beginPath(); ctx.moveTo(-w / 2 + 20, -h + 20); ctx.lineTo(-w / 2 + 90, -h + 20); ctx.lineTo(-w / 2 + 20, -h + 200); ctx.closePath(); ctx.fill(); ctx.restore();
          if (k > .45 && k < 1.3) burstFx(ctx, V.x, V.top - 200, k - .45, GOLD, 12, 260);
          if (V.table && k > .5){ const q = popQ(t, tC + .5); ctx.save(); ctx.translate(V.x, V.top - 10); ctx.scale(q, q); rr(ctx, -120, -26, 240, 52, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, "CONTOH BENAR", 0, 10, 28, BROWN, 900, 210); ctx.restore(); } } },
      over: (ctx2, c, sts, R) => {
        tags.forEach((txt, k) => { const kk = t - tG - k * .9; if (kk < 0) return; const p = c.toScreen(V.x, V.top - 30 - (230 - k * 90) * V.hs);
          popChip(ctx, (k + 1) + ". " + txt, clamp(p[0] + 300, 260, 860), p[1], kk, k === Math.floor((t - tG) / .9) % 3 ? GOLD : PAPER, BROWN, 30, -.04, 240); });
        if (t >= tTh && t < tB + .2 && R[0] && R[0].screen){ const p = R[0].screen.top, k = t - tTh, q = eBack(clamp(k / .4, 0, 1)), x = clamp(p[0] + 170, 300, 780), y = Math.max(360, p[1] - 120);
          ctx.save(); ctx.translate(x, y); ctx.scale(q * 1.45, q * 1.45); puffC(ctx, 0, 0, 170, "#FFFFFF"); ctx.strokeStyle = OUT; ctx.lineWidth = 4; [[-110, 110, 18], [-140, 150, 11]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(a, b, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); });
          hamper(ctx, 0, 60, .5, t, {}); glowAt(ctx, 0, -10, 120, GOLD, .3); ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const V = f.vt || {}; if (V.buildCue) add(cueT(s, V.buildCue, .3, i), "pop"); if (V.doneCue) add(cueT(s, V.doneCue, .5, i), "chime");
    if (V.tagCue) [0, 1, 2].forEach(k => add(cueT(s, V.tagCue, .4, i) + k * .9, "ping")); if (V.caseCue) add(cueT(s, V.caseCue, .4, i) + .45, "chime"); if (V.thinkCue) add(cueT(s, V.thinkCue, .3, i), "pop"); }));

  /* ================= _antar: hamper shop front ================= */
  function van(ctx, x, t, moving){ ctx.save(); ctx.translate(x, GY); const b = moving ? Math.sin(t * 20) * 3 : 0; ctx.translate(0, b);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 300, 18, 0, 0, TAU); ctx.fill();
    rr(ctx, -290, -360, 440, 300, 18); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(150, -300); ctx.lineTo(240, -300); ctx.quadraticCurveTo(290, -250, 290, -180); ctx.lineTo(290, -60); ctx.lineTo(150, -60); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
    rr(ctx, 170, -280, 80, 90, 10); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
    textC(ctx, "PARSEL RATNA", -70, -230, 40, ORANGE, 900, 380); for (let i = 0; i < 3; i++) hamper(ctx, -200 + i * 130, -80, .42, t, {});
    [-180, 200].forEach(wx => { ctx.save(); ctx.translate(wx, -40); ctx.rotate(moving ? t * 12 : 0); ctx.beginPath(); ctx.arc(0, 0, 48, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fillStyle = "#B9B4AA"; ctx.fill(); ctx.fillStyle = OUT; ctx.fillRect(-3, -20, 6, 40); ctx.restore(); });
    ctx.restore(); }
  SC(PX + "antar", "Cerita: depan toko parsel (foto contoh ditempel di kaca, mobil antar berangkat)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, S = Object.assign({ shopX: 380, winX: 640, winY: 1080 }, f0.sh || {});
    const tPin = T(s, S.pinCue, .3, idx), tVan = T(s, S.vanCue, .3, idx), tFl = T(s, S.flashCue, .5, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { win: [S.winX, S.winY, 1.2] },
      back: () => { const x0 = S.shopX - 420, x1 = S.shopX + 420, top = GY - 820;
        rr(ctx, x0, top, x1 - x0, GY - top, 6); ctx.fillStyle = "#F4E3C8"; ctx.fill(); ol(ctx, 6);
        for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.moveTo(x0 - 20 + i * 96, top + 120); ctx.lineTo(x0 - 20 + (i + 1) * 96, top + 120); ctx.lineTo(x0 - 20 + (i + 1) * 96, top + 190 + Math.sin(t * 3 + i) * 3); ctx.quadraticCurveTo(x0 + 28 + i * 96, top + 230, x0 - 20 + i * 96, top + 190 + Math.sin(t * 3 + i) * 3); ctx.closePath(); ctx.fillStyle = i % 2 ? CREAM : ORANGE; ctx.fill(); ol(ctx, 4); }
        rr(ctx, S.shopX - 260, top + 20, 520, 90, 12); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 5); textC(ctx, "PARSEL RATNA", S.shopX, top + 82, 50, GOLD, 900, 480);
        rr(ctx, x0 + 40, top + 300, 250, GY - top - 300, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(x0 + 250, GY - 260, 9, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
        rr(ctx, S.winX - 200, S.winY - 180, 400, 420, 8); ctx.fillStyle = "#CFE7EE"; ctx.fill(); ol(ctx, 6);
        hamper(ctx, S.winX - 100, S.winY + 220, .55, t, { v: { seed: 1 } }); hamper(ctx, S.winX + 100, S.winY + 220, .55, t, { v: { seed: 1 } });
        ctx.fillStyle = hexA("#FFFFFF", .45); ctx.beginPath(); ctx.moveTo(S.winX - 190, S.winY - 170); ctx.lineTo(S.winX - 100, S.winY - 170); ctx.lineTo(S.winX - 190, S.winY - 40); ctx.closePath(); ctx.fill();
        if (t >= tPin){ const k = t - tPin, q = clamp(k / .5, 0, 1); const x = lerp(S.winX - 420, S.winX, eOut(q)), y = lerp(S.winY + 120, S.winY - 40, eOut(q)) - Math.sin(q * Math.PI) * 160;
          drawItem(ctx, "polaroid", x, y, t, { s: 1, rot: (1 - q) * 2 + (q >= 1 ? Math.sin(t * 2) * .02 : 0), tape: q >= 1 }); if (k > .5 && k < 1.4) burstFx(ctx, S.winX, S.winY - 40, k - .5, GOLD, 10, 170); }
        if (S.vanX != null){ const vx = t < tVan ? S.vanX : S.vanX + Math.pow(t - tVan, 2) * 500; van(ctx, vx, t, t >= tVan); if (t >= tVan) dust(ctx, vx - 300, GY - 30, t, 5, "#E8D8C0", 200); } },
      over: () => { if (t >= tFl && t < tFl + .35){ ctx.save(); ctx.globalAlpha = .85 * (1 - (t - tFl) / .35); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const S = f.sh || {}; if (S.flashCue) add(cueT(s, S.flashCue, .5, i), "ping"); if (S.pinCue) add(cueT(s, S.pinCue, .3, i) + .5, "pop"); if (S.vanCue) add(cueT(s, S.vanCue, .3, i), "whoosh"); }));

  /* ================= _kolam: swimming pool + diving tower ================= */
  const BOARDS = [{ y: 1440, len: 250 }, { y: 1250, len: 290 }, { y: 1060, len: 330 }, { y: 870, len: 370 }];
  function tower(ctx, x, t, dia, hl){
    const col = dia ? "#D9E6F2" : "#FFFFFF", leg = dia ? "#6F86A6" : "#9AA6B2";
    ctx.fillStyle = leg; rr(ctx, x - 40, 820, 30, GY - 820, 6); ctx.fill(); ol(ctx, 5); rr(ctx, x + 10, 820, 30, GY - 820, 6); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = leg; ctx.lineWidth = 8; for (let y = 860; y < GY; y += 60){ ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.stroke(); }
    BOARDS.forEach((b, i) => { const L = b.len, wob = (hl && hl[i]) ? Math.sin(t * 18) * 6 * hl[i] : 0;
      ctx.beginPath(); ctx.moveTo(x + 30, b.y); ctx.quadraticCurveTo(x + 30 + L * .6, b.y + wob * .3, x + 30 + L, b.y + wob); ctx.lineTo(x + 30 + L, b.y + 22 + wob); ctx.quadraticCurveTo(x + 30 + L * .6, b.y + 22 + wob * .3, x + 30, b.y + 22); ctx.closePath();
      ctx.fillStyle = dia ? ["#7FD3A0", "#8FD3C7", "#F6C343", "#F08C5A"][i] : col; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = leg; ctx.fillRect(x + 30, b.y + 22, 22, 40); });
  }
  function water(ctx, x0, x1, y, t, a, dia){ ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = dia ? "#1F5F8F" : "#4FB3D9"; ctx.beginPath(); ctx.moveTo(x0, y + 30);
    for (let x = x0; x <= x1; x += 30) ctx.lineTo(x, y + Math.sin(x * .02 + t * 3) * 7); ctx.lineTo(x1, y + 700); ctx.lineTo(x0, y + 700); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hexA("#FFFFFF", .55); ctx.lineWidth = 5; for (let i = 0; i < 8; i++){ const xx = x0 + 60 + ((i * 167 + t * 40) % (x1 - x0 - 120)); ctx.beginPath(); ctx.moveTo(xx, y + 40 + (i % 3) * 40); ctx.quadraticCurveTo(xx + 30, y + 30 + (i % 3) * 40, xx + 60, y + 40 + (i % 3) * 40); ctx.stroke(); }
    ctx.restore(); }
  function splash(ctx, x, y, k, big){ if (k < 0 || k > 1.2) return; const n = big ? 18 : 9, H = big ? 320 : 150, q = k / 1.2;
    ctx.save(); ctx.globalAlpha = 1 - q; for (let i = 0; i < n; i++){ const a = -Math.PI / 2 + (i / (n - 1) - .5) * 2.2, v = H * (.6 + rnd(i) * .6); const px = x + Math.cos(a) * v * q * 1.6, py = y + Math.sin(a) * v * q * 2 + 600 * q * q;
      ctx.beginPath(); ctx.arc(px, py, (big ? 16 : 11) * (1 - q * .5), 0, TAU); ctx.fillStyle = i % 2 ? "#FFFFFF" : "#BFE7F5"; ctx.fill(); }
    ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, 40 + q * (big ? 260 : 120), 10 + q * 20, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  SC(PX + "kolam", "Cerita: kolam renang + menara loncat empat papan (nyata / diagram risiko-untung, penyelam indah & jatuh telentang)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, P = Object.assign({ tx: 520, mode: "real", poolX0: 470 }, f0.pool || {}), dia = P.mode === "diagram";
    const tx = P.tx, wy = GY + 10;
    const kidT = P.kid ? T(s, P.kid.cue, .3, idx) : 1e9, kidJ = P.kid ? P.kid.j ?? 1 : -1;
    const labels = (P.labels || []).map(l => Object.assign({ T: T(s, l.cue, .3, idx) }, l));
    const divers = (P.divers || []).map(d => Object.assign({ T: T(s, d.cue, .3, idx) }, d));
    const notes = (P.notes || []).map(d => Object.assign({ T: T(s, d.cue, .3, idx) }, d));
    const tA = T(s, P.arrowCue, .3, idx);
    let kidSplash = -9;
    base(ctx, s, t, { env: dia ? "info" : "sky", envOpt: dia ? { spotX: 540 } : { time: P.time || "day", hills: false }, envFront: false,
      spots: { top: [tx + 200, 900, 1.05], low: [tx + 150, 1380, 1.1] },
      mod: (sts) => { if (kidJ < 0 || !sts[kidJ]) return; const st = sts[kidJ], b = BOARDS[0], x0 = tx + 30 + b.len - 60;
        if (t < kidT){ st.y = b.y; st.x = x0; } else { const k = t - kidT, d = .8; if (k < d){ const q = k / d; st.x = x0 + q * 170; st.y = lerp(b.y, wy + 130, q) - Math.sin(q * Math.PI) * 170; st.pose = "cheer"; }
          else { st.x = x0 + 170 + Math.sin(t * 2) * 8; st.y = wy + 300 + Math.sin(t * 3) * 8; st.pose = "cheer"; } kidSplash = kidT + d * .82; } },
      back: () => { if (!dia){ // pool deck, fence, far wall
          ctx.fillStyle = "#EAF3F6"; ctx.fillRect(-700, GY - 330, 2600, 330); ctx.strokeStyle = hexA("#9AA6B2", .6); ctx.lineWidth = 3; for (let x = -700; x < 1900; x += 70){ ctx.beginPath(); ctx.moveTo(x, GY - 330); ctx.lineTo(x, GY); ctx.stroke(); }
          ctx.fillStyle = "#3E9B5A"; ctx.fillRect(-700, GY - 360, 2600, 30);
          for (let i = 0; i < 8; i++){ const x = -300 + i * 300; ctx.fillStyle = i % 2 ? "#F08C5A" : "#F6C343"; ctx.beginPath(); ctx.moveTo(x, GY - 330); ctx.lineTo(x + 100, GY - 330); ctx.lineTo(x + 50, GY - 420 + Math.sin(t * 2 + i) * 4); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
          ctx.fillStyle = "#F2EDE4"; ctx.fillRect(-700, GY, P.poolX0 + 700, 600); ctx.strokeStyle = hexA("#B9B4AA", .6); for (let x = -700; x < P.poolX0; x += 80){ ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, GY + 600); ctx.stroke(); }
          ctx.fillStyle = "#FFFFFF"; ctx.fillRect(P.poolX0 - 20, GY - 6, 24, 600); }
        else { ctx.fillStyle = hexA("#0E1A30", .6); ctx.fillRect(P.poolX0, GY, 1600, 600); }
        water(ctx, P.poolX0, 1900, wy, t, 1, dia);
        tower(ctx, tx, t, dia, divers.map(d => t > d.T - .4 && t < d.T + .2 ? 1 : 0).reduce((a, v, i) => { a[divers[i].board] = v; return a; }, [0, 0, 0, 0]));
        labels.forEach((l, n) => { const k = t - l.T; if (k < 0) return; const b = BOARDS[l.n], q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(tx - 60, b.y + 10); ctx.scale(q, q);
          font(ctx, 900, 42, FAM); const w = ctx.measureText(l.text).width + 44; rr(ctx, -w, -36, w, 72, 36); ctx.fillStyle = ["#7FD3A0", "#8FD3C7", "#F6C343", "#F08C5A"][l.n]; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = BROWN; ctx.textAlign = "right"; ctx.fillText(l.text, -22, 15); ctx.textAlign = "left"; ctx.restore(); });
        notes.forEach((nt) => { const k = t - nt.T; if (k < 0) return; const b = BOARDS[nt.board], q = clamp(k / .6, 0, 1), x = lerp(200, tx + 30 + b.len - 90, eOut(q)), y = lerp(1100, b.y - 90, eOut(q)) - Math.sin(q * Math.PI) * 200;
          drawItem(ctx, "note", x, y, t, { text: nt.text, col: nt.col || "#F6E27A", s: .9, rot: (1 - q) * 3 + Math.sin(t * 2) * .03 }); });
        if (t >= tA && !P.noArrow){ const q = eOut(clamp((t - tA) / .9, 0, 1)), ax = P.arrowX ?? 960, y0 = 1500, y1 = lerp(1500, 820, q);
          ctx.fillStyle = hexA(GOLD, .9); rr(ctx, ax - 26, y1, 52, y0 - y1, 20); ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(ax - 60, y1 + 10); ctx.lineTo(ax, y1 - 70); ctx.lineTo(ax + 60, y1 + 10); ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); } },
      mid: (ctx2, c, sts) => { divers.forEach((d) => { const b = BOARDS[d.board], x0 = tx + 30 + b.len - 70, k = t - d.T, nice = d.kind !== "flop";
          if (k < 0){ if (d.fromCue && t < T(s, d.fromCue, .3, idx) + 1.1) return; drawFig(ctx, d.actor, s, t, x0, b.y, 0, "idle"); return; }
          const dur = 1.0; if (k > dur + .2) return; const q = clamp(k / dur, 0, 1), x = x0 + q * (d.dx ?? (nice ? 240 : 200)), y = lerp(b.y, wy + 80, q * q) - Math.sin(q * Math.PI) * (nice ? 260 : 120);
          const rot = nice ? q * Math.PI * 1.05 : -q * Math.PI / 2; if (q < 1) drawFig(ctx, d.actor, s, t, x, y, rot, nice ? "pointUp" : "scared");
          if (nice && q < 1){ for (let i = 0; i < 4; i++) drawItem(ctx, "coin", x - 80 - i * 40, y - 100 + Math.sin(i + t * 6) * 30, t, { s: .7, seed: i }); } }); },
      midZ: .6,
      front: () => { water(ctx, P.poolX0, 1900, wy, t, .55, dia); splash(ctx, tx + 30 + BOARDS[0].len + 110, wy, t - kidSplash, false);
        divers.forEach(d => { const b = BOARDS[d.board]; splash(ctx, tx + 30 + b.len - 70 + (d.dx ?? (d.kind !== "flop" ? 240 : 200)), wy, t - d.T - .95, true); }); },
      over: (ctx2, c) => { divers.forEach(d => { const k = t - d.T - .95; if (k < 0 || k > 1.4) return; const b = BOARDS[d.board], p = c.toScreen(tx + 30 + b.len + 160, wy - 300);
          popWord(ctx, d.kind === "flop" ? "ADUH!" : "WOW!", clamp(p[0], 260, 820), clamp(p[1], 360, 1100), k, { size: 110, col: d.kind === "flop" ? RED : GOLD, hold: 1.3 }); });
        if (t >= tA && P.arrowText){ popChip(ctx, P.arrowText[0], 300, 320, t - tA, GREEN, "#FFFFFF", 44, -.05, 420); popChip(ctx, P.arrowText[1], 780, 320, t - tA - .35, RED, "#FFFFFF", 44, .05, 420);
          const q = clamp((t - tA - .3) / .5, 0, 1); if (q > 0){ ctx.save(); ctx.globalAlpha = q; textC(ctx, "+", 540, 340, 70, GOLD, 900); ctx.restore(); } } } });
  }, sfxWith((s, f, i, add) => { const P = f.pool || {}; if (P.kid) add(cueT(s, P.kid.cue, .3, i) + .65, "pop"); (P.labels || []).forEach(l => add(cueT(s, l.cue, .3, i), "pop"));
    (P.divers || []).forEach(d => { add(cueT(s, d.cue, .3, i), "whoosh"); add(cueT(s, d.cue, .3, i) + .95, d.kind === "flop" ? "ping" : "chime"); }); (P.notes || []).forEach(n => add(cueT(s, n.cue, .3, i) + .5, "pop")); if (P.arrowCue) add(cueT(s, P.arrowCue, .3, i), "whoosh"); }));

  /* ================= _tawar: cousin's too-good offer at dusk ================= */
  SC(PX + "tawar", "Cerita: sepupu dengan papan tawaran, panel mimpi papan tinggi di atas kasur empuk", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, O = Object.assign({ on: 1, hx: 640, hy: 600 }, f0.of || {});
    const tH = T(s, O.holoCue, .3, idx), tR = T(s, O.recallCue, .3, idx), tCn = T(s, O.coinCue, .3, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      over1: (ctx2, c, sts, j) => { if (j !== O.on) return; const st = sts[j], k = st.size / 92, top = st.y - st.size * .555, w = st.size * .46, h = st.size * .3, sw = Math.sin(t * 3) * .03;
        ctx.save(); ctx.translate(st.x, top + h / 2 + 10 * k); ctx.rotate(sw); rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 8); ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.stroke();
        textC(ctx, "UNTUNG BESAR!", 0, -h * .14, w * .15, GOLD, 900, w - 40); textC(ctx, "TANPA RISIKO", 0, h * .14, w * .11, "#FFFFFF", 900, w - 40);
        for (let i = 0; i < 3; i++) sparkle(ctx, -w / 2 + 20 + i * (w - 40) / 2, -h / 2 - 10 + Math.sin(t * 5 + i) * 6, 12, GOLD); ctx.restore(); },
      back: () => { if (t < tH) return; const k = t - tH, q = eBack(clamp(k / .5, 0, 1)), W2 = 640, H2 = 420, rec = t >= tR ? clamp((t - tR) / .6, 0, 1) : 0;
        ctx.save(); ctx.translate(O.hx, O.hy); ctx.scale(q, q); ctx.globalAlpha *= .97;
        puffC(ctx, 0, 0, 380, hexA("#FFF4FA", .95)); ctx.strokeStyle = hexA("#E07A9B", .7); ctx.lineWidth = 5; ctx.scale(1.12, 1.12);
        rr(ctx, -W2 / 2 + 40, -H2 / 2 + 20, W2 - 80, H2 - 40, 30); ctx.fillStyle = hexA("#FCE3EF", .9); ctx.fill(); ctx.stroke();
        // tall board over a soft mattress
        ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-200, -150, 22, 300); ctx.fillStyle = "#FFFFFF"; rr(ctx, -190, -150, 200, 18, 6); ctx.fill(); ol(ctx, 4);
        const mat = rec > 0 ? 1 - rec * .5 : 1; ctx.save(); ctx.translate(40, 130); ctx.scale(1, mat); rr(ctx, -190, -40, 380, 70, 30); ctx.fillStyle = "#F7A8C4"; ctx.fill(); ol(ctx, 5);
        for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(-140 + i * 95, -5, 8, 0, TAU); ctx.fillStyle = "#E07A9B"; ctx.fill(); } ctx.restore();
        if (rec > 0){ ctx.save(); ctx.globalAlpha = rec; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-60, 90); ctx.lineTo(-20, 130); ctx.lineTo(-40, 160); ctx.lineTo(10, 180); ctx.stroke(); textC(ctx, "?", 140, -40, 110, RED, 900); ctx.restore(); }
        textC(ctx, "PASTI AMAN", 90, -60, 54, "#B0305A", 900, 320);
        if (t >= tCn) for (let i = 0; i < 7; i++){ const qq = ((t - tCn) * .7 + i / 7) % 1; drawItem(ctx, "coin", -220 + i * 75, -170 + qq * 300, t, { s: .55, seed: i }); }
        ctx.restore(); },
      over: (ctx2, c, sts, R) => { if (t < tR || !R[0] || !R[0].screen) return; const p = R[0].screen.top, k = t - tR, q = eBack(clamp(k / .4, 0, 1)), x = clamp(p[0] + 60, 200, 860), y = Math.max(330, p[1] - 130);
        ctx.save(); ctx.translate(x, y); ctx.scale(q, q); rr(ctx, -110, -110, 220, 220, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.rect(-100, -100, 200, 200); ctx.clip();
        ctx.fillStyle = "#4FB3D9"; ctx.fillRect(-100, 60, 200, 40); ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-70, -90, 12, 150);
        [60, 20, -20, -60].forEach((yy, i) => { ctx.fillStyle = ["#7FD3A0", "#8FD3C7", "#F6C343", "#F08C5A"][i]; ctx.fillRect(-60, yy, 50 + i * 18, 10); }); ctx.restore();
        popChip(ctx, "INGAT MENARA!", x, y + 150, k - .2, GOLD, BROWN, 30, -.04, 300); } });
  }, sfxWith((s, f, i, add) => { const O = f.of || {}; if (O.holoCue) add(cueT(s, O.holoCue, .3, i), "whoosh"); if (O.coinCue) add(cueT(s, O.coinCue, .3, i), "chime"); if (O.recallCue) add(cueT(s, O.recallCue, .3, i), "ping"); }));

  /* ================= _brosur: the offer flyer is checked ================= */
  SC(PX + "brosur", "Cerita: brosur tawaran raksasa, bendera merah, cap LEGAL? / LOGIS? dicoret, brosur sobek", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, B = Object.assign({ x: 700, y: 760, w: 580, h: 470 }, f0.fl || {});
    const tF = T(s, B.flagCue, .3, idx), tT = T(s, B.tearCue, .3, idx); const qs = (B.q || []).map((q, n) => Object.assign({ T: T(s, q.cue, .3, idx), X: T(s, q.xCue, .5, idx) }, q));
    base(ctx, s, t, { env: "home", envOpt: { time: "night", lampX: 980 },
      back: () => { // red flag behind the flyer
        if (t >= tF){ const k = t - tF, q = eBack(clamp(k / .45, 0, 1)), px = B.x - B.w / 2 + 40, top = B.y - B.h / 2 - 330 * q;
          ctx.fillStyle = "#8E4E2E"; rr(ctx, px - 10, top, 20, B.y - top, 6); ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.moveTo(px + 10, top + 10); for (let i = 0; i <= 10; i++){ const xx = px + 10 + i * 26; ctx.lineTo(xx, top + 10 + Math.sin(t * 8 - i * .7) * 10 * (i / 10)); }
          for (let i = 10; i >= 0; i--){ const xx = px + 10 + i * 26; ctx.lineTo(xx, top + 150 + Math.sin(t * 8 - i * .7) * 10 * (i / 10)); } ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
          textC(ctx, "!", px + 140, top + 112, 90, "#FFFFFF", 900); }
        const tk = t >= tT ? t - tT : -1;
        [-1, 1].forEach(side => { ctx.save(); let dx = 0, dy = 0, rot = 0; if (tk >= 0){ const q = clamp(tk / 1.2, 0, 1); dx = side * q * 160; dy = q * q * 700; rot = side * q * .6; }
          ctx.translate(B.x + dx, B.y + dy); ctx.rotate(rot + Math.sin(t * 1.5) * .015); ctx.beginPath();
          if (tk >= 0){ if (side < 0){ ctx.moveTo(-B.w / 2, -B.h / 2); ctx.lineTo(10, -B.h / 2); for (let i = 0; i <= 8; i++) ctx.lineTo(i % 2 ? -14 : 14, -B.h / 2 + i * B.h / 8); ctx.lineTo(-B.w / 2, B.h / 2); }
            else { ctx.moveTo(10, -B.h / 2); ctx.lineTo(B.w / 2, -B.h / 2); ctx.lineTo(B.w / 2, B.h / 2); for (let i = 8; i >= 0; i--) ctx.lineTo(i % 2 ? -14 : 14, -B.h / 2 + i * B.h / 8); }
            ctx.closePath(); ctx.clip(); }
          rr(ctx, -B.w / 2, -B.h / 2, B.w, B.h, 14); ctx.fillStyle = "#FFF2C2"; ctx.fill(); ol(ctx, 7);
          rr(ctx, -B.w / 2, -B.h / 2, B.w, 110, 14); ctx.fillStyle = "#B0305A"; ctx.fill(); textC(ctx, "PELUANG EMAS!", 0, -B.h / 2 + 76, 54, GOLD, 900, B.w - 60);
          textC(ctx, "UNTUNG BESAR", 0, -40, 50, BROWN, 900, B.w - 60); textC(ctx, "TIAP BULAN", 0, 14, 44, BROWN, 900, B.w - 60);
          rr(ctx, -200, 50, 400, 66, 33); ctx.fillStyle = RED; ctx.fill(); textC(ctx, "DIJAMIN TANPA RISIKO", 0, 95, 30, "#FFFFFF", 900, 370);
          for (let i = 0; i < 5; i++) drawItem(ctx, "coin", -200 + i * 100, B.h / 2 - 60, t, { s: .7, seed: i }); textC(ctx, "Hub. Jefri", 0, B.h / 2 - 12, 26, BROWN, 700);
          ctx.restore(); }); },
      over: (ctx2, c) => { qs.forEach((q, n) => { const p = c.toScreen(B.x + (n ? 150 : -150), B.y - 40), k = t - q.T; if (k < 0 || t > tT + .2) return;
          popChip(ctx, q.text, p[0], p[1], k, NAVY, "#FFFFFF", 40, (n ? 6 : -6) * Math.PI / 180, 260); crossMark(ctx, p[0], p[1], 70, t - q.X, RED); }); } });
  }, sfxWith((s, f, i, add) => { const B = f.fl || {}; if (B.flagCue) add(cueT(s, B.flagCue, .3, i), "ping"); (B.q || []).forEach(q => { add(cueT(s, q.cue, .3, i), "pop"); add(cueT(s, q.xCue, .5, i), "ping"); }); if (B.tearCue) add(cueT(s, B.tearCue, .3, i), "whoosh"); }));

  /* ================= _toko: minimarket aisle with living hazards ================= */
  function storeBack(ctx, t){
    ctx.fillStyle = "#E4EEF0"; ctx.fillRect(-700, 120, 2600, GY - 120);
    for (let i = 0; i < 4; i++){ const x = -100 + i * 420; ctx.fillStyle = hexA("#FFFFFF", .85 + .1 * Math.sin(t * 20 + i * 5) * (i === 2 ? 1 : 0)); rr(ctx, x, 150, 240, 26, 13); ctx.fill(); }
    // chiller doors (drinks) along the back wall
    rr(ctx, -520, 610, 2100, 70, 10); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5);
    for (let k = 0; k < 4; k++) textC(ctx, "MINUMAN DINGIN", -260 + k * 560, 662, 40, "#FFFFFF", 900, 460);
    for (let d = 0; d < 9; d++){ const x0 = -500 + d * 230, y0 = 700, h = GY - 160 - y0;
      rr(ctx, x0, y0, 220, h, 10); ctx.fillStyle = "#2C3E50"; ctx.fill(); ol(ctx, 6);
      ctx.save(); rr(ctx, x0 + 12, y0 + 12, 196, h - 24, 6); ctx.clip(); ctx.fillStyle = "#BFE7F5"; ctx.fillRect(x0, y0, 220, h);
      glowAt(ctx, x0 + 110, y0 + 40, 160, "#FFFFFF", .6);
      for (let r = 0; r < 4; r++){ const sy = y0 + 60 + r * (h - 40) / 4 + 80; ctx.fillStyle = "#8FB8C8"; ctx.fillRect(x0, sy, 220, 8);
        for (let b = 0; b < 5; b++){ const bx = x0 + 26 + b * 40, col = ["#D9483B", "#3E9B5A", "#F6C343", "#3F6FB5", "#E07A9B", "#F08C2E"][(d + r + b) % 6], bh = 70 + ((d * 7 + r * 3 + b * 5) % 4) * 8;
          rr(ctx, bx - 12, sy - bh, 24, bh, 8); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(bx - 12, sy - bh * .55, 24, 12); rr(ctx, bx - 6, sy - bh - 12, 12, 14, 3); ctx.fillStyle = "#3B3A3F"; ctx.fill(); } }
      ctx.fillStyle = hexA("#FFFFFF", .3); ctx.beginPath(); ctx.moveTo(x0 + 20, y0 + 20); ctx.lineTo(x0 + 80, y0 + 20); ctx.lineTo(x0 + 20, y0 + 200); ctx.closePath(); ctx.fill(); ctx.restore();
      rr(ctx, x0 + (d % 2 ? 18 : 186), y0 + h / 2 - 70, 16, 140, 8); ctx.fillStyle = "#C9D2DA"; ctx.fill(); ol(ctx, 3); }
    ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-520, GY - 160, 2100, 160); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-520, GY - 160, 2100, 160);
    for (let x = -480; x < 1560; x += 120){ ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fillRect(x, GY - 140, 80, 20); }
    // hanging aisle sign
    const sw = Math.sin(t * 1.6) * .04; ctx.save(); ctx.translate(490, 260); ctx.rotate(sw); ctx.strokeStyle = "#5A6470"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-100, -60); ctx.lineTo(-100, 0); ctx.moveTo(100, -60); ctx.lineTo(100, 0); ctx.stroke();
    rr(ctx, -150, 0, 300, 110, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); textC(ctx, "LORONG 3", 0, 72, 52, "#FFFFFF", 900, 270); ctx.restore();
  }
  function storeFloor(ctx){ ctx.fillStyle = "#F2EFE8"; ctx.fillRect(-700, GY - 10, 2600, 800); ctx.strokeStyle = hexA("#B9B4AA", .55); ctx.lineWidth = 3;
    for (let x = -700; x < 1900; x += 120){ ctx.beginPath(); ctx.moveTo(x, GY - 10); ctx.lineTo(x + (x - 540) * .25, GY + 500); ctx.stroke(); } [GY + 40, GY + 110, GY + 200].forEach(y => { ctx.beginPath(); ctx.moveTo(-700, y); ctx.lineTo(1900, y); ctx.stroke(); }); }
  function hazardFace(ctx, x, y, s, t, mood, seed){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const bl = ((t + seed) % 2.7) < .12;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * 24, 0, 14, bl ? 2 : 16, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); if (!bl){ ctx.beginPath(); ctx.arc(d * 24 + 3, mood === "sad" ? 6 : 2, 7, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); if (mood === "evil"){ ctx.moveTo(d * 8, -16); ctx.lineTo(d * 40, -26); } else { ctx.moveTo(d * 10, -26); ctx.lineTo(d * 38, -18); } ctx.stroke(); });
    ctx.beginPath(); if (mood === "evil"){ ctx.moveTo(-26, 26); ctx.quadraticCurveTo(0, 48, 26, 26); ctx.closePath(); ctx.fillStyle = "#7A2A1F"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-14, 27, 9, 8); ctx.fillRect(5, 27, 9, 8); }
    else { ctx.moveTo(-18, 38); ctx.quadraticCurveTo(0, 24, 18, 38); ol(ctx, 5); } ctx.restore(); }
  SC(PX + "toko", "Cerita: lorong minimarket dengan bahaya hidup (genangan minyak, kabel terkelupas, kardus miring) / ditandai / beres", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { puddle: [540, GY - 150, 1.15], cable: [820, GY - 160, 1.15], boxes: [260, GY - 240, 1.0] },
      back: (ctx2, c, sts, R) => { const M = Object.assign({ px: 520, cx: 860, bx: 150 }, R.f.mk || {}); if (R.f.part === "kantor") return;
        const tA = M.aliveCue ? T(s, M.aliveCue, .3, idx) : (M.alive ? -1 : 1e9), tS = T(s, M.signCue, .3, idx), tTp = T(s, M.tapeCue, .3, idx), tRp = T(s, M.ropeCue, .3, idx);
        const tDry = T(s, M.dryCue, .3, idx), tCb = T(s, M.cableCue, .3, idx), tSt = T(s, M.stackCue, .3, idx), alive = t >= tA;
        storeBack(ctx, t); storeFloor(ctx);
        // checkout counter on the right
        rr(ctx, 930, GY - 330, 600, 330, 10); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 6); rr(ctx, 910, GY - 350, 640, 30, 8); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5);
        rr(ctx, 1010, GY - 470, 150, 120, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); rr(ctx, 1024, GY - 458, 122, 60, 6); ctx.fillStyle = "#8FD3C7"; ctx.fill(); textC(ctx, "KASIR", 1220, GY - 220, 40, BROWN, 900);
        // cable from the counter to a wall socket along the floor
        const dry = t >= tDry ? clamp((t - tDry) / .8, 0, 1) : 0, newC = t >= tCb, taped = t >= tTp && !newC;
        ctx.strokeStyle = newC ? "#F2F0EA" : "#2C2433"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(1000, GY - 340); ctx.quadraticCurveTo(940, GY - 100, M.cx + 60, GY + 22); ctx.lineTo(M.cx - 110, GY + 26); ctx.quadraticCurveTo(M.cx - 170, GY + 20, M.cx - 180, GY - 40); ctx.stroke();
        rr(ctx, M.cx - 205, GY - 110, 50, 70, 8); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4);
        if (!newC){ ctx.strokeStyle = "#D9483B"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(M.cx - 30, GY + 18); ctx.lineTo(M.cx - 14, GY + 8); ctx.moveTo(M.cx - 20, GY + 30); ctx.lineTo(M.cx - 4, GY + 40); ctx.stroke(); ctx.strokeStyle = "#E8B23A"; ctx.beginPath(); ctx.moveTo(M.cx - 10, GY + 22); ctx.lineTo(M.cx + 8, GY + 14); ctx.stroke(); }
        if (taped){ ctx.save(); ctx.translate(M.cx - 15, GY + 24); for (let i = -2; i <= 2; i++){ ctx.fillStyle = i % 2 ? "#2C2433" : GOLD; ctx.fillRect(i * 16 - 8, -18, 16, 36); } ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-48, -18, 96, 36); ctx.restore(); }
        else if (!newC && Math.sin(t * 23) > -.2){ for (let i = 0; i < 5; i++){ const a = rnd(i + Math.floor(t * 12)) * TAU, r = 20 + rnd(i + 3 + Math.floor(t * 12)) * 40; ctx.strokeStyle = i % 2 ? GOLD : "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(M.cx - 15, GY + 10); ctx.lineTo(M.cx - 15 + Math.cos(a) * r, GY + 10 + Math.sin(a) * r * .7 - 10); ctx.stroke(); } glowAt(ctx, M.cx - 15, GY + 10, 70, GOLD, .5); }
        if (newC) sparkle(ctx, M.cx - 15, GY - 10, 18 + 4 * Math.sin(t * 6), GOLD);
        // oil puddle + tipped bottle
        if (dry < 1){ ctx.save(); ctx.globalAlpha = 1 - dry; ctx.beginPath(); ctx.ellipse(M.px, GY + 30, 190 * (1 - dry * .4), 40, 0, 0, TAU); ctx.fillStyle = hexA("#E8C25A", .8); ctx.fill(); ctx.strokeStyle = hexA("#B88A2A", .9); ctx.lineWidth = 4; ctx.stroke();
          ctx.fillStyle = hexA("#FFFFFF", .7); ctx.beginPath(); ctx.ellipse(M.px - 60 + Math.sin(t * 2) * 10, GY + 22, 40, 7, 0, 0, TAU); ctx.fill(); ctx.restore(); }
        else sparkle(ctx, M.px + 30 * Math.sin(t * 2), GY + 10, 18, "#FFFFFF");
        ctx.save(); ctx.translate(M.px + 200, GY + 10); ctx.rotate(dry > 0 ? 0 : -1.45); rr(ctx, -22, -110, 44, 110, 10); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 4); rr(ctx, -12, -130, 24, 24, 4); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore();
        // leaning box tower
        const fixedB = t >= tSt ? clamp((t - tSt) / .8, 0, 1) : 0; let bx = M.bx, by = GY;
        for (let i = 0; i < 5; i++){ const lean = (1 - fixedB) * (i * .05 + Math.sin(t * 3) * .012 * i), w = 170 - i * 6; ctx.save(); ctx.translate(bx, by); ctx.rotate(lean); rr(ctx, -w / 2, -110, w, 110, 6); ctx.fillStyle = "#C98F4E"; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = hexA("#7A4A22", .5); ctx.fillRect(-12, -110, 24, 110); ctx.restore(); bx += Math.sin(lean) * 110; by -= Math.cos(lean) * 110; }
        if (t >= tRp && fixedB <= 0){ const q = popQ(t, tRp); [M.bx - 150, M.bx + 170].forEach((x, n) => { ctx.save(); ctx.translate(x, GY); ctx.scale(q, q); ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(0, -120); ctx.lineTo(34, 0); ctx.closePath(); ctx.fillStyle = "#F08C2E"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-18, -70, 36, 14); ctx.restore(); });
          ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(M.bx - 150, GY - 100 * q); ctx.quadraticCurveTo(M.bx + 10, GY - 60, M.bx + 170, GY - 100 * q); ctx.stroke(); ctx.setLineDash([]); }
        if (alive){ const tame = t >= tS; if (dry < .5) hazardFace(ctx, M.px - 20, GY + 22, 1.25, t, tame ? "sad" : "evil", 1);
          if (!newC) hazardFace(ctx, M.cx - 15, GY - 50, 1.0, t, taped ? "sad" : "evil", 2);
          if (fixedB <= 0){ const lean = 4 * .05; hazardFace(ctx, M.bx + Math.sin(lean) * 440 - 10, GY - 500, 1.1, t, t >= tRp ? "sad" : "evil", 3); } }
        if (t >= tS && dry < 1){ const q = popQ(t, tS); ctx.save(); ctx.globalAlpha = 1 - dry; drawItem(ctx, "cone", M.px - 160, GY + 10, t, { s: q }); ctx.restore(); } },
      over: (ctx2, c, sts, R) => { const M = Object.assign({ px: 520, cx: 860, bx: 150 }, R.f.mk || {}); if (R.f.part === "kantor") return;
        [["dryCue", M.px, GY - 120], ["cableCue", M.cx - 15, GY - 160], ["stackCue", M.bx + 40, GY - 640]].forEach(([k, x, y]) => { if (!M[k]) return; const kk = t - T(s, M[k], .3, idx); if (kk < 0) return; const p = c.toScreen(x, y), q = eBack(clamp(kk / .35, 0, 1));
          ctx.save(); ctx.translate(clamp(p[0], 120, 960), clamp(p[1], 250, 1220)); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 48, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-6, 14); ctx.lineTo(22, -16); ctx.stroke(); ctx.restore(); }); } });
  }, sfxWith((s, f0, i, add) => { [f0].concat(f0.shots || []).forEach(f => { const M = f.mk || {}; ["aliveCue", "signCue", "tapeCue", "ropeCue"].forEach(k => { if (M[k]) add(cueT(s, M[k], .3, i), k === "aliveCue" ? "ping" : "pop"); });
    ["dryCue", "cableCue", "stackCue"].forEach(k => { if (M[k]) add(cueT(s, M[k], .3, i), "chime"); }); }); }));

  /* ================= _licin: slow-motion imagination ================= */
  function trolley(ctx, x, y, t, roll){ ctx.save(); ctx.translate(x, y); ctx.strokeStyle = "#7A8794"; ctx.lineWidth = 8; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-150, -330); ctx.lineTo(-120, -330); ctx.lineTo(-90, -110); ctx.lineTo(130, -110); ctx.lineTo(150, -280); ctx.lineTo(-110, -280); ctx.stroke();
    for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(-100 + i * 46, -280); ctx.lineTo(-80 + i * 40, -110); ctx.stroke(); }
    [["#7FA563", -40], [GOLD, 30], [RED, 90]].forEach(([c2, dx]) => { rr(ctx, dx - 30, -340, 60, 80, 8); ctx.fillStyle = c2; ctx.fill(); ol(ctx, 3); });
    [-70, 110].forEach(wx => { ctx.save(); ctx.translate(wx, -26); ctx.rotate(roll); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ctx.fillStyle = "#B9B4AA"; ctx.fillRect(-3, -24, 6, 48); ctx.restore(); });
    ctx.beginPath(); ctx.moveTo(-90, -110); ctx.lineTo(-70, -50); ctx.lineTo(110, -50); ctx.stroke(); ctx.restore(); }
  SC(PX + "licin", "Cerita: bayangan gerak lambat, nenek mendorong troli ke genangan lalu oleng, dibekukan", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, L = Object.assign({ px: 600 }, f0.sl || {});
    const tSl = T(s, L.slowCue, .3, idx), tSp = T(s, L.slipCue, .5, idx), frozen = t >= tSp + .55;
    base(ctx, s, t, { env: "info", envOpt: { spotX: L.px },
      back: () => { ctx.fillStyle = hexA("#DDE6EE", .16); ctx.fillRect(-700, GY - 10, 2600, 700); ctx.beginPath(); ctx.ellipse(L.px, GY + 30, 230, 46, 0, 0, TAU); ctx.fillStyle = hexA("#E8C25A", .85); ctx.fill();
        ctx.fillStyle = hexA("#FFFFFF", .7); ctx.beginPath(); ctx.ellipse(L.px - 70 + Math.sin(t * 2) * 10, GY + 20, 50, 8, 0, 0, TAU); ctx.fill(); },
      mid: () => { if (!L.granny) return; const st0 = toonState(L.granny, s, t), slip = t >= tSp ? clamp((t - tSp) / .55, 0, 1) : 0, tt = frozen ? tSp + .55 : t;
        const x = st0.x, rot = -eOut(slip) * .55 + (slip > 0 ? 0 : Math.sin(t * 6) * .01), ty = st0.y - eOut(slip) * 60;
        trolley(ctx, x + 190 + slip * 160, GY, tt, (x + slip * 160) * .03);
        drawFig(ctx, L.granny, s, tt, x, ty, rot, slip > 0 ? "shock" : null);
        if (slip > 0 && !frozen) for (let i = 0; i < 4; i++){ ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 120 - i * 30, ty - 300 + i * 50); ctx.lineTo(x - 220 - i * 30, ty - 300 + i * 50); ctx.stroke(); } },
      midZ: -1,
      over: () => { // dreamy frame + slow-mo + freeze
        ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 14; ctx.setLineDash([40, 26]); ctx.lineDashOffset = -t * 30; rr(ctx, 40, 190, 1000, 1560, 60); ctx.stroke(); ctx.restore();
        popChip(ctx, "BAYANGAN DIMAS", 540, 250, t - .2, PAPER, NAVY, 32, -.02, 500);
        if (t >= tSl && !frozen){ const blink = Math.sin(t * 6) > 0; ctx.save(); ctx.globalAlpha = blink ? 1 : .6; ctx.beginPath(); ctx.arc(150, 340, 16, 0, TAU); ctx.fillStyle = RED; ctx.fill(); font(ctx, 900, 34, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText("SLOW MOTION", 180, 352); ctx.restore(); }
        if (frozen){ ctx.save(); ctx.fillStyle = hexA("#0A1222", .35); ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); stampBox(ctx, "BELUM TERJADI!", 540, 560, t - tSp - .55, RED, 70, -.08); burstFx(ctx, 540, 560, t - tSp - .65, GOLD, 12, 240); } } });
  }, sfxWith((s, f, i, add) => { const L = f.sl || {}; if (L.slowCue) add(cueT(s, L.slowCue, .3, i), "whoosh"); if (L.slipCue){ add(cueT(s, L.slipCue, .5, i), "ping"); add(cueT(s, L.slipCue, .5, i) + .6, "chime"); } }));

  /* ================= _mozaik: reputation as a mosaic of habit tiles ================= */
  function faceMask(i, j, C, Rw){ // returns tile type for a simple portrait
    const cx = (C - 1) / 2, x = (i - cx) / (C / 2), y = (j - (Rw - 1) / 2) / (Rw / 2);
    const head = x * x / .42 + (y + .05) * (y + .05) / .62 < 1, hair = head && y < -.42, eye = (Math.abs(Math.abs(x) - .3) < .14) && Math.abs(y + .12) < .1, mouth = Math.abs(x) < .3 && Math.abs(y - .34) < .08, body = y > .62 && Math.abs(x) < .8;
    return eye ? "eye" : mouth ? "mouth" : hair ? "hair" : head ? "skin" : body ? "shirt" : "bg"; }
  const MZC = { bad: { bg: ["#7A3A3A", "#8A4A3A", "#6B5A5A"], skin: ["#B98A6A", "#A97A5A"], hair: ["#3A2A22"], eye: ["#1E1A18"], mouth: ["#5A2A2A"], shirt: ["#5A6470", "#6B7580"] },
    good: { bg: [GOLD, "#F8D57A", "#F0B53A"], skin: ["#E8A877", "#F0B88A"], hair: ["#3B2418"], eye: ["#1E1A18"], mouth: ["#C2691F"], shirt: [ORANGE, "#E07A3A"] } };
  function mosaic(ctx, cx, top, C, Rw, sz, t, o){ const x0 = cx - C * sz / 2; let n = 0; const N = C * Rw;
    for (let j = 0; j < Rw; j++) for (let i = 0; i < C; i++, n++){ const ord = Math.floor(rnd(n * 3.1) * 1000) % N, typ = faceMask(i, j, C, Rw);
      const inK = o.inK != null ? o.inK - (ord / N) * o.inSpan : 9; if (inK < 0) continue;
      const flip = o.flipF != null ? clamp((o.flipF * N - ord) / 1, 0, 1) : 0, smile = o.smile && typ === "mouth" && (Math.abs(i - (C - 1) / 2) > 1.2);
      const pal = flip > .5 ? MZC.good : MZC.bad, arr = pal[typ], col = smile && flip > .5 ? MZC.good.skin[0] : arr[(i + j) % arr.length];
      const fq = inK < .6 ? eOut(inK / .6) : 1, fx = (1 - fq) * (rnd(n) - .5) * 1400, fy = (1 - fq) * -(400 + rnd(n + 1) * 600);
      const fs = o.flipF != null && flip > 0 && flip < 1 ? Math.abs(Math.cos(flip * Math.PI)) : 1;
      ctx.save(); ctx.translate(x0 + i * sz + sz / 2 + fx, top + j * sz + sz / 2 + fy); ctx.rotate((1 - fq) * 3); ctx.scale(fs, 1);
      rr(ctx, -sz / 2 + 3, -sz / 2 + 3, sz - 6, sz - 6, sz * .18); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); } }
  SC(PX + "mozaik", "Cerita: reputasi = mozaik ubin kebiasaan (ubin terbang membentuk potret + label / bingkai di dinding berubah emas)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, Z = Object.assign({ mode: "full", C: 9, Rw: 9, sz: 68, cx: 640, top: 470 }, f0.mz || {}), full = Z.mode === "full";
    const tIn = T(s, Z.inCue, .2, idx), tDn = T(s, Z.doneCue, .5, idx), tSm = T(s, Z.smileCue, .5, idx);
    const flips = (Z.flips || []).map(fl => Object.assign({ T: T(s, fl.cue, .3, idx) }, fl)); let flipF = full ? null : 0;
    if (!full){ let prev = 0; flips.forEach(fl => { if (t >= fl.T) { const q = clamp((t - fl.T) / .8, 0, 1); flipF = prev + (fl.to - prev) * q; prev = fl.to; } }); }
    const labels = (Z.labels || []).map(l => Object.assign({ T: T(s, l.cue, .3, idx) }, l));
    base(ctx, s, t, { env: full ? "info" : "office", envOpt: full ? { spotX: Z.cx } : { desk: false, plant: true, plantX: 1000 },
      spots: { mz: [Z.cx, Z.top + Z.Rw * Z.sz / 2, 1.05] },
      back: () => { const W2 = Z.C * Z.sz, H2 = Z.Rw * Z.sz;
        if (!full || t >= tDn){ const q = full ? popQ(t, tDn, .4) : 1; ctx.save(); ctx.globalAlpha *= Math.min(1, q); rr(ctx, Z.cx - W2 / 2 - 26, Z.top - 26, W2 + 52, H2 + 52, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 7); ctx.restore(); }
        if (!full){ rr(ctx, Z.cx - W2 / 2 - 4, Z.top - 4, W2 + 8, H2 + 8, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); }
        mosaic(ctx, Z.cx, Z.top, Z.C, Z.Rw, Z.sz, t, { inK: full ? t - tIn : null, inSpan: full ? Math.max(.6, (tDn - tIn) - .6) : 0, flipF, smile: t >= tSm });
        if (full && t >= tDn){ const k = t - tDn; rr(ctx, Z.cx - 170, Z.top - 90, 340, 70, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "REPUTASI", Z.cx, Z.top - 40, 44, BROWN, 900, 300); if (k < 1) burstFx(ctx, Z.cx, Z.top + H2 / 2, k, GOLD, 12, 340); }
        if (!full && flipF >= .99){ for (let i = 0; i < 4; i++) sparkle(ctx, Z.cx + Math.cos(t * 2 + i * 1.6) * (W2 / 2 + 40), Z.top + H2 / 2 + Math.sin(t * 2 + i * 1.6) * (H2 / 2 + 40), 18, i % 2 ? "#FFFFFF" : GOLD); } },
      over: (ctx2, c) => { labels.forEach((l, n) => { const k = t - l.T; if (k < 0) return; const p = c.toScreen(Z.cx, Z.top + Z.Rw * Z.sz + 60 + n * 90);
        popChip(ctx, l.text, clamp(p[0], 300, 780), Math.min(p[1], 1240), k, l.col || RED, "#FFFFFF", 46, (n % 2 ? 3 : -3) * Math.PI / 180, 640); }); } });
  }, sfxWith((s, f, i, add) => { const Z = f.mz || {}; if (Z.inCue) add(cueT(s, Z.inCue, .2, i), "whoosh"); if (Z.doneCue) add(cueT(s, Z.doneCue, .5, i), "chime");
    (Z.labels || []).forEach(l => add(cueT(s, l.cue, .3, i), "ping")); (Z.flips || []).forEach(fl => add(cueT(s, fl.cue, .3, i), "chime")); }));

  /* ================= _cetak: printer -> five pages pinned to the wall ================= */
  const PAGE_T = ["RAPAT", "EMAIL", "DAFTAR HADIR", "LAIN-LAIN", "CATATAN"];
  SC(PX + "cetak", "Cerita: printer memuntahkan lima halaman laporan yang tertempel berjajar di dinding", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, Pr = Object.assign({ x: 800, startAt: .3, gap: .5, titles: PAGE_T }, f0.pr || {});
    const deskTop = GY - 290 * .95, prY = deskTop, hl = (Pr.hl || []).map(h => Object.assign({ T: T(s, h.cue, .3, idx) }, h)), tSend = T(s, Pr.sendCue, .3, idx);
    const slots = [0, 1, 2, 3, 4].map(n => [150 + n * 195, 600]);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { wall: [540, 700, 1.0] },
      back: () => { prop(ctx, "desk", Pr.x, GY, { s: .95, papers: 1 }, t); drawItem(ctx, "printer", Pr.x - 40, prY, t, { busy: t < Pr.startAt + 5 * Pr.gap });
        // cork strip
        rr(ctx, 40, 470, 1000, 270, 12); ctx.fillStyle = "#D9B48A"; ctx.fill(); ol(ctx, 5);
        slots.forEach((sl, n) => { const tp = Pr.startAt + n * Pr.gap, k = t - tp; if (k < 0) return; const q = clamp(k / .45, 0, 1);
          const sx = Pr.x - 40, sy = prY - 80, x = lerp(sx, sl[0], eOut(q)), y = lerp(sy, sl[1], eOut(q)) - Math.sin(q * Math.PI) * 220;
          let fly = 0; if (t >= tSend){ fly = clamp((t - tSend - n * .1) / .6, 0, 1); }
          const h0 = hl.filter(h => h.n === n && t >= h.T).length > 0, hk = h0 ? t - hl.find(h => h.n === n).T : -1;
          ctx.save(); ctx.translate(x + fly * 1400, y - fly * 500); ctx.rotate((1 - q) * 2 + (n - 2) * .04 + Math.sin(t * 2 + n) * .01 + fly * 2); const sc = (.5 + .5 * q) * (hk >= 0 && hk < .4 ? 1 + .15 * Math.sin(hk / .4 * Math.PI) : 1); ctx.scale(sc, sc);
          rr(ctx, -80, -105, 160, 210, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); if (h0) { ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.stroke(); }
          textC(ctx, Pr.titles[n], 0, -66, 22, BROWN, 900, 140); for (let r = 0; r < 6; r++){ ctx.fillStyle = hexA(BROWN, .3); ctx.fillRect(-60, -40 + r * 22, 100 + rnd(r + n) * 20, 8); }
          if (n === 3){ ctx.fillStyle = hexA(RED, .6); ctx.fillRect(-60, 86, 60, 6); }
          textC(ctx, String(n + 1), 60, 96, 22, ORANGE, 900); ctx.beginPath(); ctx.arc(0, -96, 9, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); }); },
      over: (ctx2, c) => { hl.forEach(h => { const k = t - h.T; if (k < 0 || !h.chip || k > 1.3) return; const p = c.toScreen(slots[h.n][0], slots[h.n][1] - 150); popChip(ctx, h.chip, clamp(p[0], 220, 860), Math.max(240, p[1]), k, GOLD, BROWN, 40, -.04, 360); }); } });
  }, sfxWith((s, f, i, add) => { const Pr = Object.assign({ startAt: .3, gap: .5 }, f.pr || {}); for (let n = 0; n < 5; n++) add(Pr.startAt + n * Pr.gap + .4, "pop"); (Pr.hl || []).forEach(h => add(cueT(s, h.cue, .3, i), "ping")); if (Pr.sendCue) add(cueT(s, Pr.sendCue, .3, i), "whoosh"); }));

  /* ================= _taksi: report ribbon streams out of a moving taxi ================= */
  SC(PX + "taksi", "Cerita: taksi melaju, penumpang menggulir laporan, pita halaman mengalir keluar jendela, halaman KENDALA terbang", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, X = Object.assign({ x0: 300, v: 220, pj: 0 }, f0.tx || {});
    const tx = X.x0 + X.v * t, tS = T(s, X.scrollCue, .3, idx), tL = T(s, X.lostCue, .3, idx), roofY = GY - 760, winB = GY - 360;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { taxi: () => [tx + 60, GY - 560, 1.08], win: () => [tx - 40, GY - 640, 1.25] },
      mod: (sts) => { const st = sts[X.pj]; if (st){ st.x = tx + 10; st.y = GY - 170; } },
      back: () => { // taxi body (behind passenger)
        ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(tx, GY + 4, 470, 20, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(tx - 330, winB); ctx.lineTo(tx - 250, roofY); ctx.lineTo(tx + 230, roofY); ctx.lineTo(tx + 330, winB); ctx.closePath(); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.moveTo(tx - 290, winB - 10); ctx.lineTo(tx - 228, roofY + 30); ctx.lineTo(tx + 210, roofY + 30); ctx.lineTo(tx + 290, winB - 10); ctx.closePath(); ctx.fillStyle = "#8C7A5E"; ctx.fill(); ol(ctx, 4);
        rr(ctx, tx - 60, roofY - 60, 120, 60, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); textC(ctx, "TAKSI", tx, roofY - 18, 30, BROWN, 900); },
      front: (ctx2, c, sts) => { // lower body + window frame + wheels
        rr(ctx, tx - 470, winB, 940, 300, 40); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#2C2433"; for (let i = 0; i < 6; i++) ctx.fillRect(tx - 400 + i * 140, winB + 120, 70, 26);
        ctx.strokeStyle = "#E0A82A"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(tx, winB + 20); ctx.lineTo(tx, winB + 260); ctx.stroke();
        ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(tx - 290, winB - 10); ctx.lineTo(tx - 228, roofY + 30); ctx.lineTo(tx + 210, roofY + 30); ctx.lineTo(tx + 290, winB - 10); ctx.stroke();
        [-280, 280].forEach(wx => { ctx.save(); ctx.translate(tx + wx, GY - 40); ctx.rotate(t * 9); ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = "#B9B4AA"; ctx.fill(); ctx.fillStyle = OUT; ctx.fillRect(-4, -30, 8, 60); ctx.fillRect(-30, -4, 60, 8); ctx.restore(); });
        dust(ctx, tx - 480, GY - 30, t, 5, "#E6DCCB", 260);
        for (let i = 0; i < 5; i++){ const yy = roofY + 80 + i * 110, ph = (t * 3 + i * .37) % 1; ctx.strokeStyle = hexA("#FFFFFF", .7 * (1 - ph)); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(tx - 560 - ph * 300, yy); ctx.lineTo(tx - 700 - ph * 300, yy); ctx.stroke(); }
        // report ribbon from the phone out of the window
        if (t >= tS){ const st = sts[X.pj], hp = st ? handOf(st) : [tx, GY - 400], k = t - tS, len = Math.min(1500, k * 520), segs = 30;
          ctx.save(); ctx.lineJoin = "round"; let px = hp[0] - 10, py = hp[1] - 60; const pts = [[px, py]];
          for (let i = 1; i <= segs; i++){ const d = len * i / segs; pts.push([hp[0] - 60 - d, py + 40 - Math.min(Math.max(0, d - 380), 300) * .8 + Math.sin(t * 5 - i * .5) * 30 * (i / segs)]); }
          for (let i = 0; i < segs; i++){ const a = pts[i], b = pts[i + 1], red = X.redSeg != null && i >= X.redSeg && i < X.redSeg + 3, gone = red && t >= tL; if (gone) continue;
            ctx.beginPath(); ctx.moveTo(a[0], a[1] - 34); ctx.lineTo(b[0], b[1] - 34); ctx.lineTo(b[0], b[1] + 34); ctx.lineTo(a[0], a[1] + 34); ctx.closePath(); ctx.fillStyle = red ? "#FFD9D2" : PAPER; ctx.fill(); ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = hexA(red ? RED : BROWN, .45); ctx.fillRect(Math.min(a[0], b[0]) + 6, (a[1] + b[1]) / 2 - 16, Math.abs(b[0] - a[0]) - 12, 7); ctx.fillRect(Math.min(a[0], b[0]) + 6, (a[1] + b[1]) / 2 + 4, Math.abs(b[0] - a[0]) * .6, 7); }
          if (t >= tL && X.redSeg != null){ const k2 = t - tL, i = Math.min(X.redSeg + 1, segs), a = pts[i]; const x = a[0] - k2 * 420, y = a[1] - k2 * 260 + Math.sin(k2 * 6) * 30;
            ctx.save(); ctx.translate(x, y); ctx.rotate(k2 * 2.4); rr(ctx, -120, -70, 240, 140, 8); ctx.fillStyle = "#FFD9D2"; ctx.fill(); ol(ctx, 5); textC(ctx, "HAL. 4", 0, -24, 30, RED, 900); textC(ctx, "KENDALA:", 0, 12, 26, RED, 900); textC(ctx, "PEMASOK TELAT", 0, 44, 24, RED, 900, 220); ctx.restore(); }
          ctx.restore(); } },
      over: (ctx2, c) => { if (t >= tL){ popChip(ctx, "TIDAK TERBACA!", 540, 340, t - tL - .3, RED, "#FFFFFF", 50, -.04, 700); } } });
  }, sfxWith((s, f, i, add) => { const X = f.tx || {}; if (X.scrollCue) add(cueT(s, X.scrollCue, .3, i), "whoosh"); if (X.lostCue) add(cueT(s, X.lostCue, .3, i), "ping"); }));

  /* ================= _reli: rally imagination with pace notes ================= */
  SC(PX + "reli", "Cerita: imajinasi reli, navigator meneriakkan catatan singkat CAPAIAN / KENDALA / RENCANA, mobil melompati lubang", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, Rl = Object.assign({ x0: 200, v: 260, dj: 0, cj: 1 }, f0.rl || {});
    const cx = Rl.x0 + Rl.v * t, tJ = T(s, Rl.jumpCue, .4, idx), notes = (Rl.notes || []).map(n => Object.assign({ T: T(s, n.cue, .3, idx) }, n));
    const jk = t - tJ, hop = jk > 0 && jk < .7 ? Math.sin(jk / .7 * Math.PI) * 150 : 0, tilt = jk > 0 && jk < .7 ? -Math.sin(jk / .7 * Math.PI) * .12 : Math.sin(t * 14) * .01;
    const holeX = Rl.x0 + Rl.v * (tJ + .35) + 60;
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: 3000 },
      spots: { car: () => [cx + 60, GY - 470, 1.0] },
      mod: (sts) => { [Rl.dj, Rl.cj].forEach((j, n) => { const st = sts[j]; if (!st) return; st.x = cx + (n ? 120 : -120); st.y = GY - 175 - hop; }); },
      back: () => { // dirt road
        ctx.fillStyle = "#C9A27A"; ctx.fillRect(-2000, GY - 40, 9000, 700); ctx.fillStyle = "#B08A62"; for (let i = 0; i < 80; i++){ const x = -1500 + i * 140; ctx.beginPath(); ctx.ellipse(x, GY + 60 + (i % 3) * 40, 26, 8, 0, 0, TAU); ctx.fill(); }
        if (Rl.jumpCue){ ctx.fillStyle = "#5A3A2A"; ctx.beginPath(); ctx.ellipse(holeX, GY + 6, 110, 26, 0, 0, TAU); ctx.fill(); ol(ctx, 4); }
        // pace-note sign posts along the road
        if (Rl.posts) notes.forEach((n, k) => { const px = Rl.x0 + Rl.v * (n.T + .9) + 380; if (Math.abs(px - cx) > 1400) return; ctx.fillStyle = "#8E4E2E"; ctx.fillRect(px - 8, GY - 380, 16, 340);
          rr(ctx, px - 120, GY - 470, 240, 110, 12); ctx.fillStyle = n.col || GREEN; ctx.fill(); ol(ctx, 5); textC(ctx, n.sign || n.text, px, GY - 400, 34, "#FFFFFF", 900, 210); });
        ctx.save(); ctx.translate(cx, GY - 80 - hop); ctx.rotate(tilt);
        ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-250, -150); ctx.lineTo(-170, -620); ctx.lineTo(200, -620); ctx.lineTo(290, -150); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, -620); ctx.lineTo(10, -150); ctx.stroke(); ctx.restore(); },
      front: () => { ctx.save(); ctx.translate(cx, GY - 80 - hop); ctx.rotate(tilt);
        rr(ctx, -420, -170, 840, 150, 40); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = ORANGE; ctx.fillRect(-420, -120, 840, 36); ctx.fillStyle = BLUE; ctx.fillRect(-420, -84, 840, 18);
        ctx.beginPath(); ctx.arc(-30, -110, 50, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); textC(ctx, "43", -30, -92, 52, BROWN, 900);
        [-280, 280].forEach(wx => { ctx.save(); ctx.translate(wx, -10); ctx.rotate(t * 11); ctx.beginPath(); ctx.arc(0, 0, 72, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.fillStyle = OUT; ctx.fillRect(-4, -32, 8, 64); ctx.restore(); });
        ctx.restore(); dust(ctx, cx - 450, GY - 40, t, 7, "#E0C9A6", 360);
        if (jk > .55 && jk < 1.3){ const q = (jk - .55) / .75; for (let i = 0; i < 8; i++){ ctx.save(); ctx.globalAlpha = 1 - q; puffC(ctx, cx - 200 + i * 60 - q * 80, GY - 20 - q * 80 * rnd(i), 40 + q * 60, "#E0C9A6"); ctx.restore(); } } },
      over: (ctx2, c, sts, R) => { notes.forEach((n, k) => { const kk = t - n.T; if (kk < 0 || kk > 2.4) return; const r = R[Rl.cj]; const p = r && r.screen ? r.screen.top : [700, 600];
        const y = 330 + k * 120; popChip(ctx, n.text, 540, y, kk, n.col || GREEN, "#FFFFFF", 44, (k - 1) * .04, 820); });
        if (jk > 0 && jk < 1.4) popWord(ctx, "AWAS LUBANG!", 540, 760, jk, { size: 90, col: RED, hold: 1.3 }); } });
  }, sfxWith((s, f, i, add) => { const Rl = f.rl || {}; (Rl.notes || []).forEach(n => add(cueT(s, n.cue, .3, i), "pop")); if (Rl.jumpCue){ add(cueT(s, Rl.jumpCue, .4, i), "whoosh"); add(cueT(s, Rl.jumpCue, .4, i) + .7, "pop"); } }));

  /* ================= _bandara: airport lounge + three-line memo ================= */
  SC(PX + "bandara", "Cerita: ruang tunggu bandara (jendela, pesawat lewat) + memo tiga baris yang tertulis sendiri", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, { env: "sky", envOpt: { time: "day", hills: false }, envFront: false,
      back: (ctx2, c, sts, R) => { if (R.f.part === "kantor") return;
        const px = ((t * 260) % 2600) - 700; ctx.save(); ctx.translate(px, 520 - t * 6); ctx.fillStyle = "#FFFFFF"; rr(ctx, -150, -26, 300, 52, 26); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-90, 90); ctx.lineTo(-40, 90); ctx.lineTo(60, 0); ctx.closePath(); ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.moveTo(-130, -10); ctx.lineTo(-170, -70); ctx.lineTo(-130, -70); ctx.lineTo(-100, -20); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.arc(-60 + i * 36, -6, 7, 0, TAU); ctx.fillStyle = "#8FD3C7"; ctx.fill(); } ctx.restore();
        ctx.fillStyle = "#3B4A6B"; for (let x = -400; x < 1600; x += 360) ctx.fillRect(x, 200, 26, GY - 560); ctx.fillRect(-500, 200, 2200, 26); ctx.fillRect(-500, GY - 380, 2200, 30);
        ctx.fillStyle = "#D9D2C4"; ctx.fillRect(-600, GY - 350, 2400, 350); ctx.fillStyle = "#B9B0A0"; for (let x = -600; x < 1800; x += 200) ctx.fillRect(x, GY - 350, 6, 350);
        for (let i = 0; i < 4; i++){ const x = -20 + i * 290; if (x > 260 && x < 760) continue; rr(ctx, x, GY - 230, 200, 70, 14); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 4); rr(ctx, x + 10, GY - 330, 180, 110, 16); ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#3B3A3F"; ctx.fillRect(x + 30, GY - 160, 12, 160); ctx.fillRect(x + 160, GY - 160, 12, 160); ctx.fillStyle = "#2F6F73"; } },
      over: (ctx2, c, sts, R) => { const M = R.f.memo; if (!M) return; const lines = (M.lines || []).map(l => Object.assign({ T: T(s, l.cue, .3, idx) }, l)), t0 = lines.length ? lines[0].T - .4 : 1e9; if (t < t0) return;
        const q = eBack(clamp((t - t0) / .4, 0, 1)), y0 = M.y || 250, H2 = 100 + lines.length * 82; ctx.save(); ctx.translate(540, y0 + H2 / 2); ctx.rotate(-.015); ctx.scale(q, q); ctx.translate(-540, -(y0 + H2 / 2));
        rr(ctx, 110, y0, 860, H2, 22); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, 110, y0, 860, 64, 22); ctx.fillStyle = NAVY; ctx.fill(); font(ctx, 900, 30, FAM); ctx.fillStyle = "#FFFFFF"; ctx.fillText(M.title || "LAPORAN MINGGU INI", 150, y0 + 43);
        lines.forEach((l, n) => { const k = t - l.T; if (k < 0) return; const y = y0 + 100 + n * 82, chars = Math.floor(clamp(k / .6, 0, 1) * l.text.length);
          ctx.beginPath(); ctx.arc(170, y + 10, 24, 0, TAU); ctx.fillStyle = l.col || GREEN; ctx.fill(); ol(ctx, 4); textC(ctx, l.icon || "•", 170, y + 22, 32, "#FFFFFF", 900);
          fit(ctx, l.text, 740, 40, 800); ctx.fillStyle = BROWN; ctx.fillText(l.text.slice(0, chars), 215, y + 24); if (chars < l.text.length && Math.sin(t * 20) > 0) ctx.fillRect(215 + ctx.measureText(l.text.slice(0, chars)).width + 4, y - 6, 4, 38); });
        ctx.restore(); } });
  }, sfxWith((s, f0, i, add) => { [f0].concat(f0.shots || []).forEach(f => ((f.memo || {}).lines || []).forEach(l => add(cueT(s, l.cue, .3, i), "pop"))); }));
  /* aliases: same drawing code, different story beats (data decides the content) */
  ALIAS("menara", "kolam", "Cerita: diagram menara loncat (papan berlabel, panah untung/risiko, penyelam indah vs jatuh telentang)");
  ALIAS("lapor", "toko", "Cerita: lapor ke atasan di kantor lalu potong ke toko: lantai kering, kabel baru, kardus rapi");
  ALIAS("tonton", "adegan", "Cerita: montase kebiasaan kecil yang dilihat orang (mata, ubin kebiasaan terbang ke baki)");
  ALIAS("bingkai", "mozaik", "Cerita: bingkai mozaik reputasi di dinding kantor, ubin berbalik jadi emas");
})();
