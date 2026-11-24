/* Scene pack j2611221424513: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SP41, RN41, KD41, JS41, SC41.
   Layout prefix j2611221424513_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, part, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, out|outCue, s, dx, dy, rot, text}]  object in a toon's hand:
            tea, tumbler, phone, notebook, calculator, pointer, bill, chips (snack bag), can (watering can)
     pops   [{at|cue, text, x, y, size, rot, col, hold}]   big outlined pop words (screen)
     chips  [{at|cue, outCue, text, x, y, bg, fg, size, rot}] screen chips
     confetti {at|cue}
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _santai   office turned beach resort: lounge chair + parasol, iced tea with straw, the TARGET 240 sheet lands on the side table,
               date chip                                                                                     f.santai
     _bus      street at dusk: the TARGET bus with "90/240" on its back pulls away, the hero chases it, papers fly, she gives up   f.bus
     _boneka   the boss folds the "240" sheet like an accordion, giant scissors snip, it opens into a chain of 20 paper dolls "12"   f.boneka
     _sempoa   giant abacus on the office wall: 20 rods x 12 beads = 240; one rod slides over per day, a lagging rod blinks red
               with dashed empty beads, then catches up; day + total counters, gold glow at 240                 f.sempoa
     _kemasan  a giant snack-bag mock-up on a turning pedestal: mode "puji" (pale design, team applauds) or mode "ubah"
               (note chips fly from colleagues onto the bag, it spins and flips into the bright new design)       f.kemasan
     _rak      minimarket aisle: shoppers pick the pale bag, squint at the tiny text and put it back; the designer peeks
               from the end of the aisle                                                                     f.rak
     _gema     echo canyon at sunset: a shouted closed question bounces back as shrinking echoes; an open question lights
               lanterns in the canyon wall and honest answer chips float up                                  f.gema
     _hasil    laptop on a desk with a floating prompt bar: mode "kacau" = an ornate wedding-invitation-like card bursts out
               and grows page after page; mode "rapi" = three prompt pills, a neat 3-line message flies to colleagues' phones   f.hasil
     _foto     photo studio: backdrop sweep, softboxes, photographer at a tripod gets three question chips, flash, a badly
               cropped print slides out (only shoes)                                                         f.foto
     _resep    prompt recipe: KONTEKS / TUGAS / FORMAT blocks (+ CONTOH) fly in and snap into one prompt card with the example text   f.resep
     _palu     high striker next to the desk: the hero swings a giant mallet onto the KIRIM pad, the puck shoots up the pole
               and rings the bell TERKIRIM                                                                    f.palu
     _balas    the client reads the offer on a floating page: wrong name wiggles red, empty attachment slot with a cobweb,
               REVISI stamp, crumpled into a ball and thrown; shot part "kena": the ball bonks the hero      f.balas
     _apotek   pharmacy counter (imagination): the pharmacist reaches out with the wrong bottle, the world freezes red STOP,
               resep vs label mismatch, swap to the right bottle with a tick                                   f.apotek
     _periksa  desk + floating offer page: the hero reads aloud (sound arcs) to a desk cactus that nods; rows get fixed and
               ticked one by one (name morphs, amount sweep, paper clip attaches the file, spelling squiggle), 5-minute timer   f.periksa
     _rumah    storm over the hills: a house labelled INVESTASI without foundation; the scooter breaks down (smoke, bill chip),
               rain, the house sinks and tilts, the hero pulls a brick out (sold at a loss)                   f.rumah
     _fondasi  construction at sunset: the house hangs from a crane hook while foundation blocks 1..6 BLN slide in under it,
               then it is lowered and locks with a dust puff                                                  f.fondasi
     _kaca     home: a red wall box "DANA DARURAT" behind glass with a little hammer on a chain; bills fly in, gauge to AMAN;
               the daily wallet on a side table; small INVESTASI coin stacks start growing on the side table   f.kaca */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424513_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1] + (st.pose === "sit" ? 13 : 0)); };
  const headOf = (st) => { const h = toonHead(st); return [h[0], h[1] + (st.pose === "sit" ? 13 * st.size / 92 : 0)]; };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function textL(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(txt, x, y); }
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
  // screen chip that pops in; x is clamped in SCREEN space before translating
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1));
    size = size || 34; font(ctx, 800, size, FAM); let w = ctx.measureText(txt).width + size * 1.1; if (w > 896){ size = Math.floor(size * 896 / w); font(ctx, 800, size, FAM); w = ctx.measureText(txt).width + size * 1.1; }
    x = clamp(x, 92 + w / 2, 988 - w / 2);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  // world chip (no clamping, used inside layer())
  function wChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function smoke(ctx, x, y, t, k, o){ o = o || {}; const n = o.n || 7, h = o.h || 260, col = o.col || "#8C8C94", sz = o.s || 1;
    for (let i = 0; i < n; i++){ const q = ((t * (o.speed || .55)) + i / n) % 1, a = (1 - q) * .55 * k; if (a <= 0) continue;
      ctx.fillStyle = hexA(col, a); ctx.beginPath(); ctx.arc(x + Math.sin(q * 6 + i) * 26 * sz + (o.drift || 0) * q, y - q * h, (18 + q * 46) * sz, 0, TAU); ctx.fill(); } }
  function tick(ctx, x, y, r, k, col){ if (k <= 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * .28; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-r * .45, 0); ctx.lineTo(-r * .1, r * .38); ctx.lineTo(r * .5, -r * .38); ctx.stroke(); ctx.restore(); }
  function cross(ctx, x, y, r, k){ if (k <= 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * .26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-r * .4, -r * .4); ctx.lineTo(r * .4, r * .4); ctx.moveTo(r * .4, -r * .4); ctx.lineTo(-r * .4, r * .4); ctx.stroke(); ctx.restore(); }
  function banknote(ctx, x, y, s, rot, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); rr(ctx, -60, -32, 120, 64, 8); ctx.fillStyle = col || "#7FB77E"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill(); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.strokeRect(-50, -22, 100, 44); ctx.restore(); }

  /* ---------- small objects held in a hand (world coords, origin = the hand) ---------- */
  function snackBag(ctx, w, h, q, t){ // q: 0 = old pale design, 1 = new bright design
    const k = w / 300; ctx.save();
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 14 * k); for (let i = 0; i <= 10; i++) ctx.lineTo(-w / 2 + i * w / 10, -h / 2 + (i % 2 ? 0 : 14 * k)); ctx.lineTo(w / 2, h / 2 - 14 * k);
    for (let i = 10; i >= 0; i--) ctx.lineTo(-w / 2 + i * w / 10, h / 2 - (i % 2 ? 0 : 14 * k)); ctx.closePath();
    ctx.fillStyle = q < .5 ? "#E9DFC9" : "#E2502E"; ctx.fill(); ol(ctx, Math.max(3, 6 * k));
    ctx.save(); ctx.clip();
    if (q < .5){ ctx.fillStyle = "#D9CDB2"; ctx.fillRect(-w / 2, h * .18, w, h * .3); ctx.fillStyle = "#C9B9A0"; ctx.beginPath(); ctx.ellipse(0, h * .02, 26 * k, 14 * k, -.4, 0, TAU); ctx.fill();
      font(ctx, 600, 15 * k, FAM); ctx.fillStyle = "#B7A88E"; ctx.textAlign = "center"; ctx.fillText("keripik pedas", 0, -h * .2); ctx.fillText("rasa balado", 0, -h * .2 + 18 * k); ctx.textAlign = "left"; }
    else { ctx.fillStyle = GOLD; ctx.fillRect(-w / 2, h * .2, w, h * .3); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, h * .05, 62 * k, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(0, h * .05); ctx.rotate(-.5 + Math.sin((t || 0) * 3) * .06); ctx.fillStyle = "#C8261C"; ctx.beginPath(); ctx.ellipse(0, 0, 50 * k, 18 * k, 0, 0, TAU); ctx.fill(); ol(ctx, 3 * k);
      ctx.fillStyle = "#3E9B5A"; ctx.beginPath(); ctx.ellipse(-52 * k, -4 * k, 12 * k, 7 * k, .4, 0, TAU); ctx.fill(); ctx.restore();
      textC(ctx, "KERIPIK", 0, -h * .27, 50 * k, "#FFFFFF", 900, w * .86); textC(ctx, "PEDAS", 0, -h * .27 + 46 * k, 44 * k, GOLD, 900, w * .8);
      textC(ctx, "SOBEK DI SINI →", 0, h * .42, 17 * k, BROWN, 800, w * .8); }
    ctx.fillStyle = hexA("#FFFFFF", .25); ctx.beginPath(); ctx.ellipse(-w * .32, -h * .05, w * .06, h * .36, 0, 0, TAU); ctx.fill();
    ctx.restore(); ctx.restore(); }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "tea"){ ctx.beginPath(); ctx.moveTo(-34, -120); ctx.lineTo(34, -120); ctx.lineTo(26, 10); ctx.lineTo(-26, 10); ctx.closePath(); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill(); ol(ctx, 5);
      const lvl = o.level ?? clamp(.85 - (o.age || 0) * .08, .3, .85); ctx.save(); ctx.clip(); ctx.fillStyle = "#C47A2C"; ctx.fillRect(-40, 10 - 125 * lvl, 80, 125 * lvl); ctx.fillStyle = hexA("#FFFFFF", .8); [[-10, -60], [10, -40], [-4, -20]].forEach(([a, b], i) => { rr(ctx, a - 10, b + Math.sin((t || 0) * 3 + i) * 3, 20, 20, 4); ctx.fill(); }); ctx.restore();
      ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(8, -100); ctx.lineTo(26, -170); ctx.lineTo(48, -178); ctx.stroke();
      ctx.fillStyle = "#F6D743"; ctx.beginPath(); ctx.arc(-30, -116, 18, 0, TAU); ctx.fill(); ol(ctx, 4); }
    else if (kind === "tumbler"){ rr(ctx, -40, -170, 80, 190, 18); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, -44, -196, 88, 34, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4);
      rr(ctx, -34, -130, 68, 90, 8); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 3); textC(ctx, o.text || "12", 0, -82, 44, ORANGE, 900, 60); textC(ctx, o.sub || "/HARI", 0, -52, 16, BROWN, 900, 60); }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA", notif: o.notif }, t); }
    else if (kind === "notebook"){ ctx.rotate(-.12); rr(ctx, -80, -110, 160, 200, 10); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -70, -100, 140, 180, 6); ctx.fillStyle = PAPER; ctx.fill();
      ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 5; i++) ctx.fillRect(-56, -76 + i * 30, 90 + (i % 2) * 20 - (i === 4 ? 40 * (1 - ((t || 0) * .7 % 1)) : 0), 7);
      ctx.save(); ctx.translate(40, -10 + Math.sin((t || 0) * 9) * 10); ctx.rotate(.6); rr(ctx, -7, -70, 14, 90, 4); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    else if (kind === "calculator"){ ctx.rotate(-.1); rr(ctx, -70, -110, 140, 200, 14); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5); rr(ctx, -56, -96, 112, 46, 6); ctx.fillStyle = "#CFE8C8"; ctx.fill(); ol(ctx, 3);
      fit(ctx, o.text || "4 jt × 3", 100, 28, 900); ctx.fillStyle = OUT; ctx.textAlign = "right"; ctx.fillText(o.text || "4 jt × 3", 50, -62); ctx.textAlign = "left";
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++){ rr(ctx, -52 + c * 36, -38 + r * 38, 30, 30, 6); ctx.fillStyle = (r * 3 + c + Math.floor((t || 0) * 4)) % 7 === 0 ? ORANGE : CREAM; ctx.fill(); } }
    else if (kind === "pointer"){ ctx.rotate(-.9 + Math.sin((t || 0) * 2.4) * .12); rr(ctx, -5, -230, 10, 250, 5); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(0, -232, 11, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); }
    else if (kind === "bill"){ for (let i = 0; i < 4; i++) banknote(ctx, i * 6 - 8, -i * 10, 1, -.15 + i * .08 + Math.sin((t || 0) * 4 + i) * .03); }
    else if (kind === "chips"){ ctx.rotate(-.15); snackBag(ctx, 150, 200, o.q ?? 0, t); }
    else if (kind === "can"){ ctx.rotate(.35 + Math.sin((t || 0) * 3) * .08); rr(ctx, -50, -60, 100, 90, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.moveTo(46, -36); ctx.lineTo(120, -86); ctx.lineTo(128, -74); ctx.lineTo(50, -10); ctx.closePath(); ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(-46, -16, 26, Math.PI * .5, Math.PI * 1.5); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.stroke();
      for (let i = 0; i < 6; i++){ const q = ((t || 0) * 1.6 + i / 6) % 1; ctx.fillStyle = hexA("#7EC8E3", 1 - q); ctx.beginPath(); ctx.arc(128 + q * 30 + (i % 2) * 8, -74 + q * 120, 6, 0, TAU); ctx.fill(); } }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.prep) H.prep(sts, f);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = headOf(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    env(ctx, E, t, c, eo);
    const R = { c, f, piece, shotT, part: f.part };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { age: t - h.T, s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    (f.chips || []).forEach((p, j) => { const T0 = tOf(s, p, .3 + j * .1, idx), O = p.outCue ? T(s, p.outCue, .5, idx) : (p.out ?? 1e9); if (t < T0 || t > O + .3) return;
      ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1); popChip(ctx, p.text, p.x ?? 540, (p.y ?? 330) + Math.sin(t * 2 + j) * 4, t - T0, p.bg || ORANGE, p.fg || "#FFFFFF", p.size || 40, p.rot || 0); ctx.restore(); }); });
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
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
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    (f0.chips || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const SFX = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); if (fn) fn(s, f, i, add, (o, fr) => tOf(s, o, fr ?? .3, i), (c, fr) => cueT(s, c, fr ?? .5, i)); };

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, chip, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= SP41: _santai (office as a beach resort) ================= */
  function lounger(ctx, x, t){ const sy = GY - 150;
    // backrest (behind the toon), slanted to the left
    ctx.save(); ctx.translate(x - 110, sy); ctx.rotate(-.42); rr(ctx, -40, -430, 84, 440, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
    ctx.save(); rr(ctx, -40, -430, 84, 440, 18); ctx.clip(); ctx.fillStyle = "#5FA8C8"; for (let i = 0; i < 6; i++) ctx.fillRect(-40, -430 + i * 80, 84, 40); ctx.restore(); rr(ctx, -40, -430, 84, 440, 18); ol(ctx, 6); ctx.restore();
    // frame + legs
    ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 160, sy + 20); ctx.lineTo(x - 140, GY); ctx.moveTo(x + 200, sy + 20); ctx.lineTo(x + 220, GY); ctx.moveTo(x - 60, sy + 20); ctx.lineTo(x - 80, GY); ctx.moveTo(x + 120, sy + 20); ctx.lineTo(x + 100, GY); ctx.stroke();
    // seat cushion
    rr(ctx, x - 175, sy - 8, 410, 40, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.save(); rr(ctx, x - 175, sy - 8, 410, 40, 16); ctx.clip(); ctx.fillStyle = "#5FA8C8"; for (let i = 0; i < 6; i++) ctx.fillRect(x - 175 + i * 80, sy - 8, 40, 40); ctx.restore(); rr(ctx, x - 175, sy - 8, 410, 40, 16); ol(ctx, 6); }
  function parasol(ctx, x, t){ const top = [x + 40, GY - 980], sw = Math.sin(t * 1.7) * .03;
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 80, GY); ctx.lineTo(top[0], top[1] + 20); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    ctx.save(); ctx.translate(top[0], top[1]); ctx.rotate(.12 + sw); const R0 = 380;
    for (let i = 0; i < 8; i++){ const a0 = Math.PI + i * Math.PI / 8, a1 = a0 + Math.PI / 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R0, a0, a1); ctx.closePath(); ctx.fillStyle = i % 2 ? CREAM : ORANGE; ctx.fill(); }
    ctx.beginPath(); ctx.arc(0, 0, R0, Math.PI, 0); ctx.closePath(); ol(ctx, 7);
    for (let i = 0; i < 16; i++){ const xx = -R0 + i * (2 * R0 / 16) + R0 / 16, fl = Math.sin(t * 6 + i) * 6; ctx.beginPath(); ctx.moveTo(xx - R0 / 16, 0); ctx.quadraticCurveTo(xx, 34 + fl, xx + R0 / 16, 0); ctx.fillStyle = i % 2 ? ORANGE : CREAM; ctx.fill(); ol(ctx, 4); }
    ctx.beginPath(); ctx.arc(0, -8, 16, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function sideTable(ctx, x){ ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 120, 14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; rr(ctx, x - 12, GY - 320, 24, 320, 8); ctx.fill(); ol(ctx, 4); rr(ctx, x - 80, GY - 16, 160, 18, 8); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(x, GY - 322, 150, 26, 0, 0, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 5); }
  function targetSheet(ctx, x, y, w, h, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    rr(ctx, -w / 2, -h, w, h, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2, -h, w, h * .2, 14); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
    textC(ctx, o.tag || "TARGET BULAN INI", 0, -h + h * .13, h * .075, "#FFFFFF", 900, w * .86);
    textC(ctx, o.big || "240", 0, -h * .32, h * .38, BROWN, 900, w * .86); textC(ctx, o.sub || "PESANAN", 0, -h * .12, h * .085, ORANGE, 900, w * .8); ctx.restore(); }
  function beachBall(ctx, x, y, r, t){ const rot = Math.sin(t * 1.4) * .5; ctx.save(); ctx.translate(x + Math.sin(t * 1.4) * 14, y - r); ctx.rotate(rot);
    const cols = [RED, "#FFFFFF", "#3E7DB5", "#FFFFFF", GOLD, "#FFFFFF"]; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, i * TAU / 6, (i + 1) * TAU / 6); ctx.closePath(); ctx.fillStyle = cols[i]; ctx.fill(); }
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .4); ctx.beginPath(); ctx.ellipse(-r * .35, -r * .4, r * .25, r * .14, -.6, 0, TAU); ctx.fill(); ctx.restore(); }
  TT.scene(PX + "santai", "Cerita: kantor jadi resor pantai (kursi santai, payung, es teh, kertas target 240)", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, S = Object.assign({ chairX: 400, tableX: 830, dates: [] }, F0.santai || {});
    const tP = T(s, S.paperCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010 },
      spots: { paper: S.paperSpot || [S.tableX, GY - 560, 1.25] },
      back: () => { parasol(ctx, S.chairX - 260, t); lounger(ctx, S.chairX, t); sideTable(ctx, S.tableX); beachBall(ctx, S.tableX - 230, GY, 62, t);
        if (t >= tP){ const k = t - tP, fall = k < .45 ? eOut(k / .45) : 1, y = lerp(GY - 1500, GY - 330, fall), sq = k > .45 && k < .8 ? Math.sin((k - .45) / .35 * Math.PI) * .12 : 0, rot = k < .45 ? (1 - fall) * .8 : -.06;
          ctx.save(); ctx.translate(S.tableX, y); ctx.scale(1 + sq, 1 - sq); targetSheet(ctx, 0, 0, 280, 340, { rot, tag: S.tag, big: S.big, sub: S.sub }); ctx.restore();
          if (k > .45 && k < 1.3){ ctx.save(); ctx.globalAlpha = 1 - (k - .45) / .85; smoke(ctx, S.tableX, GY - 330, t, 1, { n: 5, h: 90, col: "#E9DFC9", s: .8 }); ctx.restore(); } } },
      over: (ctx2, c) => { (S.dates || []).forEach((d, j) => { const T0 = tOf(s, d, .2, idx), nx = S.dates[j + 1] ? tOf(s, S.dates[j + 1], .2, idx) : 1e9; if (t < T0 || t >= nx) return;
          const q = popQ(t, T0, .35); ctx.save(); ctx.translate(200, 330); ctx.scale(q, q); ctx.rotate(-.05); rr(ctx, -110, -80, 220, 170, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -110, -80, 220, 52, 18); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
          textC(ctx, d.month || "BULAN INI", 0, -42, 26, "#FFFFFF", 900, 190); textC(ctx, d.text, 0, 64, 84, BROWN, 900, 190); ctx.restore(); }); } });
  }, SFX((s, f, i, add, tO, cT) => { const S = f.santai || {}; if (S.paperCue){ add(cT(S.paperCue, .3), "whoosh"); add(cT(S.paperCue, .3) + .45, "pop"); } (S.dates || []).forEach(d => add(tO(d, .2), "pop")); }));

  /* ================= SP41: _bus (chasing the target bus) ================= */
  function busDraw(ctx, x, len, t, o){ const top = GY - 470, bot = GY - 70, L = x - len / 2, Rr = x + len / 2, vib = o.idle ? Math.sin(t * 40) * 2 : Math.sin(t * 12) * 3;
    ctx.save(); ctx.translate(0, vib);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, len * .55, 20, 0, 0, TAU); ctx.fill();
    rr(ctx, L, top, len, bot - top, 40); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = CREAM; ctx.fillRect(L + 6, top + 210, len - 12, 46);
    for (let i = 0; i < 5; i++){ rr(ctx, L + 210 + i * ((len - 300) / 5), top + 40, (len - 300) / 5 - 22, 140, 14); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = hexA("#FFFFFF", .45); ctx.beginPath(); ctx.moveTo(L + 222 + i * ((len - 300) / 5), top + 160); ctx.lineTo(L + 252 + i * ((len - 300) / 5), top + 52); ctx.lineTo(L + 270 + i * ((len - 300) / 5), top + 52); ctx.lineTo(L + 240 + i * ((len - 300) / 5), top + 160); ctx.fill(); }
    rr(ctx, Rr - 90, top + 40, 70, 180, 16); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
    // rear panel (left end) with the counter
    rr(ctx, L + 20, top + 36, 170, 170, 14); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); textC(ctx, o.back || "90/240", L + 105, top + 140, 44, GOLD, 900, 150); textC(ctx, "TERCAPAI", L + 105, top + 80, 20, "#FFFFFF", 800, 150);
    ctx.fillStyle = "#2C2433"; ctx.fillRect(x - 6, top - 50, 12, 50); ctx.fillRect(x + 200, top - 50, 12, 50); rr(ctx, x - 150, top - 150, 520, 110, 18); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6); textC(ctx, o.label || "TARGET 240", x + 110, top - 72, 62, GOLD, 900, 480);
    textC(ctx, o.label || "TARGET 240", x + 60, top + 330, 74, "#FFFFFF", 900, len - 280);
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(L + 14, bot - 70, 16, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(Rr - 14, bot - 70, 16, 0, TAU); ctx.fill(); ol(ctx, 4);
    const rot = (o.dist || 0) / 62; [L + len * .2, Rr - len * .2].forEach(wx => { ctx.beginPath(); ctx.arc(wx, GY - 62, 62, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.arc(wx, GY - 62, 28, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(wx + Math.cos(rot) * 26, GY - 62 + Math.sin(rot) * 26); ctx.lineTo(wx - Math.cos(rot) * 26, GY - 62 - Math.sin(rot) * 26); ctx.stroke(); });
    ctx.restore();
    smoke(ctx, L - 20, GY - 90, t, 1, { n: 6, h: 160, drift: -140, col: "#6E6A70", s: .9, speed: o.idle ? .6 : 1.4 }); }
  TT.scene(PX + "bus", "Cerita: mengejar bus TARGET yang sudah berangkat", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, B = Object.assign({ x0: 760, len: 820, acc: 360, vmax: 620 }, F0.bus || {});
    const tg = T(s, B.goCue, .3, idx), tt = Math.max(0, t - tg), vv = Math.min(B.vmax, B.acc * tt), tAcc = B.vmax / B.acc;
    const dist = tt <= tAcc ? .5 * B.acc * tt * tt : .5 * B.acc * tAcc * tAcc + B.vmax * (tt - tAcc), bx = B.x0 + dist;
    const tPa = T(s, B.paperCue, .3, idx), a0 = (F0.toons || [])[0];
    let st0 = null;
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      prep: (sts) => { st0 = sts[0]; },
      spots: { chase: () => { const hx = st0 ? st0.x : 300, span = Math.max(900, (bx + B.len / 2) - hx + 380), z = clamp(1080 / span, .72, 1), x = clamp((hx - 190 + bx + B.len / 2 + 190) / 2, 540, hx + 380); return [x, GY - 600 / z, z]; },
               runner: () => [st0 ? st0.x + 120 : 400, GY - 600, 1] },
      back: () => { busDraw(ctx, bx, B.len, t, { idle: t < tg, dist, back: B.back, label: B.label });
        if (vv > 200){ ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = CREAM; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const yy = GY - 420 + i * 60, xx = bx - B.len / 2 - 60 - ((t * 900 + i * 140) % 400); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - 120, yy); ctx.stroke(); } ctx.restore(); } },
      over1: (ctx2, c, sts, j) => { if (j !== 0 || t < tPa || !a0) return;
        for (let i = 0; i < 9; i++){ const ts = tPa + i * .32, k = t - ts; if (k < 0 || k > 2.2) continue; const sp = toonState(a0, s, ts), hp = handOf(sp);
          const x = hp[0] - k * 180 + Math.sin(k * 5 + i) * 40, y = hp[1] - 60 + k * k * 170 - 120 * Math.sin(Math.min(1, k) * Math.PI);
          ctx.save(); ctx.globalAlpha = clamp((2.2 - k) / .4, 0, 1); ctx.translate(x, y); ctx.rotate(k * 3 + i); rr(ctx, -34, -44, 68, 88, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
          ctx.fillStyle = "#B9A58E"; for (let r = 0; r < 4; r++) ctx.fillRect(-22, -30 + r * 18, 44 - (r % 2) * 12, 6); ctx.restore(); } } });
  }, SFX((s, f, i, add, tO, cT) => { const B = f.bus || {}; if (B.goCue){ add(cT(B.goCue, .3), "whoosh"); add(cT(B.goCue, .3) + .8, "whoosh"); } if (B.paperCue) add(cT(B.paperCue, .3), "pop"); }));

  /* ================= SP41: _boneka (fold, snip, paper-doll chain) ================= */
  function dollPath(ctx, w, h){ const hr = w * .22; ctx.beginPath(); ctx.arc(0, -h + hr + 4, hr, 0, TAU);
    ctx.moveTo(-w * .28, -h + hr * 2 + 6); ctx.lineTo(w * .28, -h + hr * 2 + 6); ctx.lineTo(w * .5, -h * .62); ctx.lineTo(w * .5, -h * .5); ctx.lineTo(w * .26, -h * .52); ctx.lineTo(w * .3, -h * .32);
    ctx.lineTo(w * .3, 0); ctx.lineTo(w * .06, 0); ctx.lineTo(0, -h * .2); ctx.lineTo(-w * .06, 0); ctx.lineTo(-w * .3, 0); ctx.lineTo(-w * .3, -h * .32); ctx.lineTo(-w * .26, -h * .52); ctx.lineTo(-w * .5, -h * .5); ctx.lineTo(-w * .5, -h * .62); ctx.closePath(); }
  function doll(ctx, x, y, w, h, label, t, i){ ctx.save(); ctx.translate(x, y + Math.sin(t * 6 + i * .7) * 6); ctx.rotate(Math.sin(t * 5 + i) * .05);
    dollPath(ctx, w, h); ctx.fillStyle = i % 2 ? PAPER : "#FFF0DA"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-w * .07, -h + w * .22 + 2, 3, 0, TAU); ctx.arc(w * .07, -h + w * .22 + 2, 3, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, -h + w * .22 + 8, 6, .2, Math.PI - .2); ctx.stroke();
    textC(ctx, label, 0, -h * .36, w * .34, ORANGE, 900, w * .56); ctx.restore(); }
  function scissors(ctx, x, y, open, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); [-1, 1].forEach(sg => { ctx.save(); ctx.rotate(sg * open * .5);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(150, sg * -6); ctx.lineTo(150, sg * 10); ctx.closePath(); ctx.fillStyle = "#C9D3DD"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.ellipse(-56, sg * 24, 34, 22, 0, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 20; ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.stroke(); ctx.restore(); });
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore(); }
  TT.scene(PX + "boneka", "Cerita: kertas target dilipat, digunting, terbuka jadi rantai boneka kertas", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Bn = Object.assign({ cx: 560, y: 880, w: 580, h: 380, n: 20, label: "12", rows: 2, rowY: [560, 790], dw: 84, dh: 190 }, F0.boneka || {});
    const tf = T(s, Bn.foldCue, .3, idx), tc = T(s, Bn.cutCue, .3, idx), to = T(s, Bn.openCue, .3, idx);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => {
        const qF = ramp(t, tf, tf + .9), qC = ramp(t, tc, tc + 1.3), qO = ramp(t, to, to + 1.6);
        if (qO <= 0){ const W = lerp(Bn.w, Bn.w / 10, easeIO(qF)), H = Bn.h, x = Bn.cx, y = Bn.y + Math.sin(t * 2) * 6;
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.3) * .02 * (1 - qF));
          ctx.save(); ctx.scale(W / Bn.w, 1); targetSheet(ctx, 0, 0, Bn.w, H, { big: Bn.big || "240", tag: "TARGET BULANAN", sub: "PESANAN" });
          if (qF > 0){ for (let i = 0; i < 10; i++){ ctx.fillStyle = hexA(i % 2 ? "#FFFFFF" : OUT, .22 * qF); ctx.fillRect(-Bn.w / 2 + i * Bn.w / 10, -H, Bn.w / 10, H); } } ctx.restore();
          if (qF >= 1){ for (let i = 1; i < 5; i++){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.strokeRect(-W / 2 + i * 3, -H + i * 3, W, H); } }
          // cut progress: doll silhouette revealed from the top
          if (qC > 0){ ctx.save(); ctx.beginPath(); ctx.rect(-W, -H - 20, W * 2, (H + 20) * qC); ctx.clip(); ctx.fillStyle = hexA("#13223D", 1); ctx.fillRect(-W * 1.5, -H - 20, W * 3, H + 40);
              ctx.save(); ctx.translate(0, 0); dollPath(ctx, W * 1.6, H); ctx.fillStyle = "#FFF0DA"; ctx.fill(); ol(ctx, 4); ctx.restore(); ctx.restore(); }
          ctx.restore();
          if (qC > 0 && qC < 1){ const sy = Bn.y - Bn.h + Bn.h * qC; scissors(ctx, x + W / 2 + 60, sy, Math.abs(Math.sin(t * 22)) * .9, Math.PI + .15);
            for (let i = 0; i < 8; i++){ const k = ((t * 1.8 + i / 8) % 1); ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(x + W / 2 + 20 + k * 160 * (i % 2 ? 1 : -.4), sy + k * k * 300); ctx.rotate(k * 8 + i);
              ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(12, 10); ctx.lineTo(-10, 8); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 2); ctx.restore(); } } }
        else { const per = Math.ceil(Bn.n / Bn.rows), gap = (1000 - 80) / per;
          for (let r = 0; r < Bn.rows; r++){ const y = Bn.rowY[r] + Bn.dh / 2;
            // hand-holding strip
            for (let i = 0; i < per; i++){ const n = r * per + i; if (n >= Bn.n) break; const tx = 80 + gap / 2 + i * gap, ord = Math.abs(i - (per - 1) / 2) / (per / 2), q = clamp((qO - ord * .55) / .45, 0, 1); if (q <= 0) continue;
              const x = lerp(Bn.cx, tx, eOut(q)), sc = eBack(clamp(q * 1.4, 0, 1));
              ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); doll(ctx, 0, 0, Bn.dw, Bn.dh, Bn.label, t, n); ctx.restore(); } }
          if (t - to < .9) burstFx(ctx, Bn.cx, Bn.rowY[0] + 120, t - to, HL, 14, 360); } } });
  }, SFX((s, f, i, add, tO, cT) => { const B = f.boneka || {}; if (B.foldCue) add(cT(B.foldCue, .3), "whoosh"); if (B.cutCue){ for (let k = 0; k < 4; k++) add(cT(B.cutCue, .3) + k * .3, "pop"); } if (B.openCue){ add(cT(B.openCue, .3), "whoosh"); add(cT(B.openCue, .3) + .9, "chime"); } }));

  /* ================= SP41: _sempoa (giant abacus, one rod of 12 beads per day) ================= */
  TT.scene(PX + "sempoa", "Cerita: sempoa raksasa 20 batang x 12 manik, satu batang per hari, batang tertinggal menyala merah", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Sp = Object.assign({ x0: 360, x1: 1010, top: 420, rods: 20, beads: 12, lagRod: 8, lagN: 8 }, F0.sempoa || {});
    const tS = T(s, Sp.startCue, .2, idx), tL = T(s, Sp.lagCue, .3, idx), tF = T(s, Sp.fastCue, .2, idx), tD = T(s, Sp.doneCue, .3, idx);
    const gap = 34, H = Sp.rods * gap + 60, bw = 20, L = Sp.x0 + 70, Rr = Sp.x1 - 30;
    const dayT = d => d <= Sp.lagRod ? lerp(tS, tL, d / Sp.lagRod) : lerp(tF + .2, tD - .3, (d - Sp.lagRod - 1) / Math.max(1, Sp.rods - Sp.lagRod - 2));
    const done = d => t >= dayT(d) ? (d === Sp.lagRod && t < tF ? Sp.lagN : Sp.beads) : 0;
    let days = 0, total = 0; for (let d = 0; d < Sp.rods; d++){ const n = done(d); if (n > 0) days = d + 1; total += t >= dayT(d) ? n : 0; }
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1040 },
      spots: { lag: [lerp(Sp.x0, Sp.x1, .5), Sp.top + 40 + Sp.lagRod * gap, 1.3] },
      back: () => { const glow = ramp(t, tD, tD + .6);
        if (glow > 0) glowAt(ctx, (Sp.x0 + Sp.x1) / 2, Sp.top + H / 2, 700, "#FFE2B4", .5 * glow);
        rr(ctx, Sp.x0, Sp.top, Sp.x1 - Sp.x0, H, 24); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 7); rr(ctx, Sp.x0 + 22, Sp.top + 22, Sp.x1 - Sp.x0 - 44, H - 44, 12); ctx.fillStyle = "#F7EAD6"; ctx.fill(); ol(ctx, 4);
        for (let d = 0; d < Sp.rods; d++){ const y = Sp.top + 40 + d * gap, lagging = d === Sp.lagRod && t >= tL && t < tF + .3;
          ctx.strokeStyle = lagging && (t * 4 % 1) < .6 ? RED : "#B5793D"; ctx.lineWidth = lagging ? 7 : 4; ctx.beginPath(); ctx.moveTo(Sp.x0 + 30, y); ctx.lineTo(Sp.x1 - 30, y); ctx.stroke();
          textC(ctx, String(d + 1), Sp.x0 + 46, y + 8, 18, d < days ? ORANGE : "#B9A58E", 900);
          const T0 = dayT(d), nMoved = done(d);
          for (let b = 0; b < Sp.beads; b++){ const moved = b >= Sp.beads - nMoved, Tb = (d === Sp.lagRod && b < Sp.beads - Sp.lagN ? tF : T0) + (Sp.beads - 1 - b) * .02, q = moved ? eOut(clamp((t - Tb) / .3, 0, 1)) : 0;
            const xl = L + b * (bw + 2), xr = Rr - (Sp.beads - b) * (bw + 2), x = lerp(xl, xr, q);
            ctx.beginPath(); ctx.ellipse(x + bw / 2, y, bw / 2 + 1, 14, 0, 0, TAU); ctx.fillStyle = glow > 0 ? (b % 2 ? GOLD : "#F6D77A") : (d % 2 ? ORANGE : "#E8A55B"); if (!moved) ctx.fillStyle = "#D8C8B0"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.stroke(); }
          if (lagging){ for (let b = 0; b < Sp.beads - Sp.lagN; b++){ const x = Rr - (Sp.beads - b) * (bw + 2); ctx.beginPath(); ctx.ellipse(x + bw / 2, y, bw / 2 + 4, 17, 0, 0, TAU); ctx.setLineDash([5, 4]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]); } }
          if (t >= T0 && t - T0 < .5 && d !== Sp.lagRod) sparkle(ctx, Rr + 10, y, 14 * (1 - (t - T0) / .5), GOLD); }
        if (t >= tL && t < tF + .3) wChip(ctx, Sp.lagText || "KURANG 4!", Sp.x0 + 150, Sp.top + 40 + Sp.lagRod * gap, t - tL, RED, "#FFFFFF", 30, -.06);
        if (t >= tD) burstFx(ctx, (Sp.x0 + Sp.x1) / 2, Sp.top + H / 2, t - tD, GOLD, 16, 420); },
      over: () => { if (t < tS) return; const q = popQ(t, tS, .35);
        ctx.save(); ctx.translate(250, 330); ctx.scale(q, q); chip(ctx, "HARI " + Math.max(1, days), 0, 0, NAVY, "#FFFFFF", 44); ctx.restore();
        ctx.save(); ctx.translate(790, 330); ctx.scale(q, q); chip(ctx, total + " / " + Sp.rods * Sp.beads, 0, 0, t >= tD ? GREEN : ORANGE, "#FFFFFF", 44); ctx.restore(); } });
  }, SFX((s, f, i, add, tO, cT) => { const Sp = f.sempoa || {}; if (Sp.startCue && Sp.lagCue){ const a = cT(Sp.startCue, .2), b = cT(Sp.lagCue, .3); for (let d = 0; d <= 8; d += 2) add(lerp(a, b, d / 8), "pop"); add(b, "ping"); }
    if (Sp.fastCue) add(cT(Sp.fastCue, .2), "whoosh"); if (Sp.doneCue) add(cT(Sp.doneCue, .3), "chime"); }));

  /* ================= RN41: _kemasan (snack-bag mock-up on a turning pedestal) ================= */
  TT.scene(PX + "kemasan", "Cerita: maket kemasan keripik di atas meja putar (dipuji / dirombak jadi desain baru)", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, K = Object.assign({ x: 560, top: GY - 600, w: 340, h: 460, mode: "puji", notes: [] }, F0.kemasan || {});
    const tSp = T(s, K.spinCue, .3, idx), sq = ramp(t, tSp, tSp + 1.1), design = K.mode === "ubah" ? (sq >= .5 ? 1 : 0) : 0;
    const notes = (K.notes || []).map((n, j) => Object.assign({ T: T(s, n.cue, .4, idx), j }, n));
    const bagC = () => [K.x, K.top - K.h / 2 - 20];
    base(ctx, s, t, { env: K.env || "office", envOpt: { desk: false },
      spots: { bag: () => [K.x, K.top - K.h / 2 + 60, 1.15] },
      back: (ctx2, c, sts) => {
        if (K.mode === "ubah"){ glowAt(ctx, K.x, K.top - K.h / 2, 520, "#FFE2B4", .25 + .2 * design); }
        // pedestal
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(K.x, GY + 4, 170, 20, 0, 0, TAU); ctx.fill();
        rr(ctx, K.x - 90, K.top + 10, 180, GY - K.top - 10, 14); ctx.fillStyle = K.mode === "ubah" ? "#FFFFFF" : "#E8E0D2"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = ORANGE; ctx.fillRect(K.x - 90, K.top + 60, 180, 24); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(K.x - 90, K.top + 60, 180, 24);
        ctx.beginPath(); ctx.ellipse(K.x, K.top + 10, 170, 34, 0, 0, TAU); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 6);
        for (let i = 0; i < 6; i++){ const a = t * 1.2 + i * TAU / 6; if (Math.sin(a) < 0) continue; ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.arc(K.x + Math.cos(a) * 140, K.top + 10 + Math.sin(a) * 26, 7, 0, TAU); ctx.fill(); }
        // the bag
        const [bx, by] = bagC(); let sx = 1 + Math.sin(t * 1.2) * .0, wob = Math.sin(t * 1.2) * .06;
        if (K.mode === "ubah" && sq > 0 && sq < 1) sx = Math.cos(sq * TAU * 1.5) * (1 - sq * .2);
        ctx.save(); ctx.translate(bx, by + Math.sin(t * 2) * 5); ctx.rotate(wob * .3); ctx.scale(Math.abs(sx) < .05 ? .05 : sx, 1); snackBag(ctx, K.w, K.h, design, t); ctx.restore();
        if (K.mode === "ubah" && t >= tSp + .55) burstFx(ctx, bx, by, t - tSp - .55, GOLD, 14, 300);
        // flying notes from colleagues
        notes.forEach((n, j) => { const k = t - n.T; if (k < 0) return; const st = sts[n.from ?? 1]; if (!st) return; const hp = headOf(st);
          const side = j % 2 ? 1 : -1, tx = bx + side * (K.w / 2 + 60), ty = by - K.h * .25 + j * 120, q = eOut(clamp(k / .7, 0, 1));
          let x = lerp(hp[0], tx, q), y = lerp(hp[1] - 120, ty, q) - Math.sin(q * Math.PI) * 160, a = 1;
          if (K.mode === "ubah" && t >= tSp){ const u = clamp((t - tSp) / .6, 0, 1); a = 1 - u; y -= u * 160; }
          if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(side * .08 + Math.sin(t * 3 + j) * .03); chip(ctx, n.text, 0, 0, j % 2 ? GOLD : "#FFFFFF", BROWN, 40); ctx.restore(); });
      },
      over: (ctx2, c) => { if (K.mode === "ubah"){ const p = c.toScreen(K.x, K.top + 70); if (t < tSp) popChip(ctx, K.before || "SEBELUM", p[0], Math.min(p[1], 1240), t - (K.beforeAt ?? .2), "#9AA6B2", "#FFFFFF", 36, -.04);
          else popChip(ctx, K.after || "SESUDAH", p[0], Math.min(p[1], 1240), t - tSp - .55, GREEN, "#FFFFFF", 40, -.04); } } });
  }, SFX((s, f, i, add, tO, cT) => { const K = f.kemasan || {}; (K.notes || []).forEach(n => { add(cT(n.cue, .4), "whoosh"); add(cT(n.cue, .4) + .7, "pop"); }); if (K.spinCue){ add(cT(K.spinCue, .3), "whoosh"); add(cT(K.spinCue, .3) + .55, "chime"); } }));

  /* ================= RN41: _rak (minimarket aisle) ================= */
  function storeShelf(ctx, x0, x1, t, o){ const top = GY - 940; ctx.fillStyle = "#D7DEE4"; rr(ctx, x0, top, x1 - x0, GY - top, 10); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#B9C3CC"; ctx.fillRect(x0 + 14, top + 14, x1 - x0 - 28, GY - top - 28);
    const levels = [GY - 760, GY - 540, GY - 320, GY - 100]; const cols = ["#3E7DB5", "#E2502E", "#3E9B5A", "#F6C343", "#7A3B8F", "#E8A55B", "#2F6F73"];
    levels.forEach((ly, r) => { let x = x0 + 30, i = r * 7;
      while (x < x1 - 70){ const w = 64 + rnd(i) * 30, h = 120 + rnd(i + 3) * 60; const skip = o.slot && r === 1 && x + w / 2 > o.slot[0] - 190 && x + w / 2 < o.slot[0] + 190;
        if (!skip){ if (rnd(i + 7) > .5){ rr(ctx, x, ly - h, w, h, 6); ctx.fillStyle = cols[i % cols.length]; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fillRect(x + 8, ly - h + 20, w - 16, 18); }
          else { ctx.save(); ctx.translate(x + w / 2, ly - h / 2); snackBag(ctx, w, h, 1, t); ctx.restore(); ctx.save(); ctx.globalCompositeOperation = "source-atop"; ctx.fillStyle = hexA(cols[i % cols.length], .55); ctx.fillRect(x, ly - h, w, h); ctx.restore(); } }
        x += w + 12; i++; }
      ctx.fillStyle = "#F4F6F8"; rr(ctx, x0 + 6, ly, x1 - x0 - 12, 26, 6); ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 4; k++){ const px = x0 + 80 + k * (x1 - x0 - 160) / 3; ctx.save(); ctx.translate(px, ly + 26); ctx.rotate(Math.sin(t * 2 + k + r) * .08); rr(ctx, -30, 0, 60, 34, 4); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore(); } }); }
  TT.scene(PX + "rak", "Cerita: lorong minimarket, pembeli memicingkan mata lalu menaruh kemasan pucat kembali", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Rk = Object.assign({ slot: [620, GY - 540], x0: 40, x1: 900, endX: 1010 }, F0.rak || {});
    const tPk = T(s, Rk.pickCue, .3, idx), tBk = T(s, Rk.backCue, .3, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false }, envFront: false,
      back: () => { ctx.fillStyle = "#EAF2EE"; ctx.fillRect(-800, -200, 2700, GY + 200); ctx.fillStyle = "#DDE7E2"; for (let i = -4; i < 12; i++) ctx.fillRect(i * 220, -200, 110, GY + 200);
        ctx.fillStyle = "#CFC4B4"; ctx.fillRect(-800, GY - 20, 2700, 800); ctx.strokeStyle = hexA(OUT, .18); ctx.lineWidth = 3; for (let i = -8; i < 20; i++){ ctx.beginPath(); ctx.moveTo(i * 140, GY - 20); ctx.lineTo(i * 140 - 300, GY + 600); ctx.stroke(); }
        for (let i = 0; i < 4; i++){ const lx = -100 + i * 420; ctx.fillStyle = hexA("#FFFFFF", .9); rr(ctx, lx, 380, 260, 26, 13); ctx.fill(); ol(ctx, 3); glowAt(ctx, lx + 130, 400, 260, "#FFFFFF", .25 + .05 * Math.sin(t * 9 + i)); }
        ctx.save(); ctx.translate(360, 560); ctx.rotate(Math.sin(t * 1.5) * .05); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(-90, 0); ctx.moveTo(90, -120); ctx.lineTo(90, 0); ctx.stroke();
        rr(ctx, -150, 0, 300, 80, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, Rk.sign || "CAMILAN", 0, 54, 44, "#FFFFFF", 900, 270); ctx.restore();
        storeShelf(ctx, Rk.x0, Rk.x1, t, { slot: Rk.slot });
        // our pale bags (the middle one is picked up)
        [-130, 0, 130].forEach((dx, k) => { if (k === 1 && t >= tPk && t < tBk) return; ctx.save(); ctx.translate(Rk.slot[0] + dx, Rk.slot[1] - 95 + (k === 1 && t >= tBk && t < tBk + .4 ? -Math.sin((t - tBk) / .4 * Math.PI) * 20 : 0)); snackBag(ctx, 118, 170, 0, t); ctx.restore(); });
        if (t >= T(s, Rk.dustCue, .3, idx)){ for (let i = 0; i < 6; i++){ const q = ((t * .4 + i / 6) % 1); ctx.fillStyle = hexA("#B9A58E", .5 * (1 - q)); ctx.beginPath(); ctx.arc(Rk.slot[0] - 150 + i * 60, Rk.slot[1] - 200 - q * 80, 6, 0, TAU); ctx.fill(); } } },
      front: () => { // stacked cartons at the end of the aisle (the designer peeks from behind them)
        [[0, 0, 300, 190], [20, -190, 250, 170], [-10, -360, 200, 150]].forEach(([dx, dy, w, h], k) => { const x = Rk.endX + dx, y = GY + dy;
          ctx.save(); ctx.translate(x, y); ctx.rotate((k - 1) * .03); rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = k % 2 ? "#D9A066" : "#C98B52"; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-w / 2, -h + 30); ctx.lineTo(w / 2, -h + 30); ctx.stroke(); textC(ctx, "KERIPIK", 0, -h / 2 + 20, 30, "#8E4E2E", 900, w * .8); ctx.restore(); }); } });
  }, SFX((s, f, i, add, tO, cT) => { const R0 = f.rak || {}; if (R0.pickCue) add(cT(R0.pickCue, .3), "pop"); if (R0.backCue) add(cT(R0.backCue, .3), "pop"); }));

  /* ================= RN41: _gema (echo canyon) ================= */
  function canyon(ctx, t){ const g = ctx.createLinearGradient(0, 700, 0, 2200); g.addColorStop(0, "#7A3E4A"); g.addColorStop(1, "#1E1424"); ctx.fillStyle = g; ctx.fillRect(400, 700, 1400, 1700);
    ctx.fillStyle = hexA("#E8A07A", .55); ctx.beginPath(); ctx.moveTo(380, 980); ctx.lineTo(430, 900); ctx.lineTo(560, 890); ctx.lineTo(600, 940); ctx.lineTo(700, 930); ctx.lineTo(720, 1100); ctx.lineTo(380, 1100); ctx.fill();
    ctx.fillStyle = hexA("#B0603F", .55); ctx.fillRect(380, 1090, 340, 1300);
    // far right wall with strata
    ctx.beginPath(); ctx.moveTo(700, 2300); ctx.lineTo(700, 820); ctx.lineTo(780, 760); ctx.lineTo(900, 700); ctx.lineTo(1120, 690); ctx.lineTo(1400, 640); ctx.lineTo(1700, 660); ctx.lineTo(1700, 2300); ctx.closePath(); ctx.fillStyle = "#C8643A"; ctx.fill(); ol(ctx, 7);
    ctx.save(); ctx.clip(); for (let i = 0; i < 12; i++){ ctx.fillStyle = i % 2 ? hexA("#8E3A26", .35) : hexA("#F0A060", .25); ctx.beginPath(); ctx.moveTo(680, 780 + i * 110); ctx.quadraticCurveTo(1100, 760 + i * 110 + 30 * Math.sin(i), 1720, 790 + i * 110); ctx.lineTo(1720, 840 + i * 110); ctx.quadraticCurveTo(1100, 810 + i * 110, 680, 830 + i * 110); ctx.fill(); } ctx.restore();
    // left wall behind the ledge
    ctx.beginPath(); ctx.moveTo(-700, GY); ctx.lineTo(-700, 640); ctx.lineTo(-200, 600); ctx.lineTo(120, 680); ctx.lineTo(300, 820); ctx.lineTo(420, 1000); ctx.lineTo(470, GY); ctx.closePath(); ctx.fillStyle = "#B0532F"; ctx.fill(); ol(ctx, 7);
    // ledge
    ctx.beginPath(); ctx.moveTo(-700, GY + 600); ctx.lineTo(-700, GY - 6); ctx.lineTo(560, GY - 6); ctx.lineTo(600, GY + 40); ctx.lineTo(540, GY + 600); ctx.closePath(); ctx.fillStyle = "#9A4A2C"; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = "#D98A52"; ctx.fillRect(-700, GY - 6, 1262, 18);
    for (let i = 0; i < 4; i++){ const q = ((t * .25 + i / 4) % 1); ctx.fillStyle = hexA("#FFF4E6", .35 * (1 - q)); ctx.beginPath(); ctx.arc(820 + i * 160 + q * 120, 900 - q * 60, 30 + q * 40, 0, TAU); ctx.fill(); } }
  function lantern(ctx, x, y, k, t){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.ellipse(0, 0, 70, 90, 0, 0, TAU); ctx.fillStyle = "#2A1520"; ctx.fill(); ol(ctx, 5);
    if (k > 0){ glowAt(ctx, 0, 0, 220 * k, "#FFD58A", .55 * k); ctx.beginPath(); ctx.ellipse(0, 0, 56 * k, 74 * k, 0, 0, TAU); ctx.fillStyle = hexA("#FFC861", .9); ctx.fill();
      ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.ellipse(0, 10 + Math.sin(t * 9) * 3, 12 * k, 22 * k, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
  TT.scene(PX + "gema", "Cerita: tebing gema, pertanyaan tertutup memantul, pertanyaan terbuka menyalakan lentera jawaban", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Gm = Object.assign({ echo: "BAGUS, KAN?", answers: [], holes: [[860, 960], [1060, 1150], [880, 1330]] }, F0.gema || {});
    const tSh = T(s, Gm.shoutCue, .3, idx), tOp = T(s, Gm.openCue, .3, idx);
    base(ctx, s, t, { env: "sunset", envOpt: {}, envFront: false,
      back: () => { canyon(ctx, t); Gm.holes.forEach((h, j) => lantern(ctx, h[0], h[1], ramp(t, tOp + .3 + j * .35, tOp + .7 + j * .35), t)); },
      mid: (ctx2, c, sts) => {
        // echoes: the shout bounces between the walls, shrinking
        for (let i = 0; i < 5; i++){ const T0 = tSh + .5 + i * .55, k = t - T0; if (k < 0 || k > 1.6 || t > tOp + .4) continue; const right = i % 2 === 0;
          const x = right ? 900 + i * 30 : 520 - i * 20, y = 820 + i * 60, sz = 92 - i * 14, a = clamp(1 - k / 1.6, 0, 1) * (1 - i * .12);
          ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.scale(eBack(clamp(k / .3, 0, 1)), eBack(clamp(k / .3, 0, 1))); ctx.rotate(right ? .06 : -.06);
          outlineWords(ctx, [{ w: i === 0 ? Gm.echo : Gm.echo.replace(/^[^ ]+ /, "...") , hl: true }], 0, 0, sz, { sw: sz * .22, hl: i % 2 ? CREAM : HL }); ctx.restore();
          ctx.save(); ctx.globalAlpha *= a * .7; ctx.strokeStyle = CREAM; ctx.lineWidth = 6; for (let r = 0; r < 3; r++){ ctx.beginPath(); ctx.arc(x + (right ? -170 : 170), y - 20, 40 + r * 28 + k * 30, right ? -.6 : Math.PI - .6, right ? .6 : Math.PI + .6); ctx.stroke(); } ctx.restore(); }
        // honest answers float up out of the lit holes
        (Gm.answers || []).forEach((a, j) => { const h = Gm.holes[j % Gm.holes.length], T0 = tOp + .8 + j * .45, k = t - T0; if (k < 0) return;
          const q = eOut(clamp(k / .9, 0, 1)), x = lerp(h[0], a.x ?? (h[0] - 60), q), y = lerp(h[1], a.y ?? (h[1] - 220), q) + Math.sin(t * 2 + j) * 8;
          ctx.save(); ctx.globalAlpha *= clamp(k / .3, 0, 1); ctx.translate(x, y); ctx.scale(.6 + .4 * q, .6 + .4 * q); ctx.rotate(Math.sin(t * 1.6 + j) * .04); chip(ctx, a.text, 0, 0, j % 2 ? GOLD : CREAM, BROWN, 42); ctx.restore(); }); }, midZ: 5 });
  }, SFX((s, f, i, add, tO, cT) => { const Gm = f.gema || {}; if (Gm.shoutCue) for (let k = 0; k < 4; k++) add(cT(Gm.shoutCue, .3) + .5 + k * .55, "whoosh"); if (Gm.openCue){ add(cT(Gm.openCue, .3) + .3, "chime"); (Gm.answers || []).forEach((a, j) => add(cT(Gm.openCue, .3) + .8 + j * .45, "pop")); } }));

  /* ================= KD41: _hasil (prompt bar + AI result card) ================= */
  function wrapLines(ctx, txt, maxW, size, weight){ font(ctx, weight || 700, size, FAM); const ws = String(txt).split(" "), L = []; let cur = "";
    ws.forEach(w => { const tr = cur ? cur + " " + w : w; if (ctx.measureText(tr).width > maxW && cur){ L.push(cur); cur = w; } else cur = tr; }); if (cur) L.push(cur); return L; }
  function inviteCard(ctx, x, y, w, h, t, pages){ // ornate, wedding-invitation-like result
    for (let p = Math.min(pages, 5) - 1; p > 0; p--){ ctx.save(); ctx.translate(x + p * 16, y + p * 14); ctx.rotate(p * .025); rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.fillStyle = "#FBF1DC"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.02); rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.fillStyle = "#FFF8EA"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 8); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.stroke(); rr(ctx, -w / 2 + 30, -h / 2 + 30, w - 60, h - 60, 6); ctx.lineWidth = 2; ctx.stroke();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], k) => { ctx.save(); ctx.translate(sx * (w / 2 - 44), sy * (h / 2 - 44)); ctx.rotate(t * .6 * (k % 2 ? 1 : -1));
      for (let i = 0; i < 5; i++){ ctx.fillStyle = "#F2A7B8"; ctx.beginPath(); ctx.ellipse(Math.cos(i * TAU / 5) * 14, Math.sin(i * TAU / 5) * 14, 12, 8, i * TAU / 5, 0, TAU); ctx.fill(); } ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-18, -h / 2 + 96, 26, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(18, -h / 2 + 96, 26, 0, TAU); ctx.stroke();
    ctx.save(); font(ctx, 700, 40, "Georgia"); ctx.font = "italic 700 42px Georgia, serif"; ctx.fillStyle = "#8E4E2E"; ctx.textAlign = "center"; ctx.fillText("Dengan Hormat,", 0, -h / 2 + 180);
    ctx.font = "italic 400 26px Georgia, serif"; ["Dengan penuh sukacita dan", "rasa syukur yang mendalam,", "perkenankanlah kami", "mengumumkan dengan khidmat..."].forEach((l, i) => ctx.fillText(l, 0, -h / 2 + 236 + i * 38));
    ctx.restore(); ctx.fillStyle = hexA("#B9A58E", .7); for (let i = 0; i < 4; i++) rr(ctx, -w / 2 + 70, -h / 2 + 400 + i * 30, w - 140 - (i % 2) * 60, 10, 5), ctx.fill();
    textC(ctx, "HAL. 1 / " + Math.max(1, pages), 0, h / 2 - 50, 24, "#8E4E2E", 800); ctx.restore(); }
  function chatCard(ctx, x, y, w, lines, t, o){ o = o || {}; const lh = 46, h = 110 + lines.length * lh; ctx.save(); ctx.translate(x, y);
    rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2, -h / 2, w, 64, 26); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + 34, w, 30); rr(ctx, -w / 2, -h / 2, w, h, 26); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(-w / 2 + 40, -h / 2 + 32, 18, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); textL(ctx, o.title || "Grup Kantor", -w / 2 + 70, -h / 2 + 44, 30, "#FFFFFF", 800, w - 110);
    lines.forEach((l, i) => { const q = clamp((o.p ?? 1) * lines.length - i, 0, 1); if (q <= 0) return; ctx.save(); ctx.globalAlpha *= q; textL(ctx, l, -w / 2 + 34, -h / 2 + 108 + i * lh, 30, OUT, 700, w - 68); ctx.restore(); });
    textL(ctx, "09.12 ✓✓", w / 2 - 130, h / 2 - 18, 20, "#3E7DB5", 800); ctx.restore(); return h; }
  TT.scene(PX + "hasil", "Cerita: laptop + kolom prompt; hasil AI kacau (kartu undangan) atau rapi (pesan grup 3 kalimat)", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Hs = Object.assign({ mode: "kacau", deskX: 700, bar: [600, 600], barW: 680, card: [640, 820], labels: [], readers: [] }, F0.hasil || {});
    const tTy = T(s, Hs.typeCue, .3, idx), tOut = T(s, Hs.outCue, .3, idx), tSend = T(s, Hs.sendCue, .3, idx);
    const lap = [Hs.deskX - 40, GY - 360];
    base(ctx, s, t, { env: Hs.env || "home", envOpt: { desk: false },
      back: () => { prop(ctx, "desk", Hs.deskX, GY, { laptop: true, mug: true, s: Hs.deskS || 1 }, t); },
      front: (ctx2, c, sts) => {
        // prompt bar
        const kB = popQ(t, tTy - .3, .35); if (kB > 0 && t < tOut + .6){ const [bx, by] = Hs.bar, a = 1 - clamp((t - tOut - .2) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= a; ctx.translate(bx, by); ctx.scale(kB, kB);
          rr(ctx, -Hs.barW / 2, -50, Hs.barW, 100, 50); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(Hs.barW / 2 - 52, 0, 34, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4);
          ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(Hs.barW / 2 - 64, -16); ctx.lineTo(Hs.barW / 2 - 34, 0); ctx.lineTo(Hs.barW / 2 - 64, 16); ctx.closePath(); ctx.fill();
          if (Hs.mode === "kacau"){ const n = Math.floor(clamp((t - tTy) / 1.1, 0, 1) * Hs.prompt.length); textL(ctx, Hs.prompt.slice(0, n) + ((t * 2) % 1 < .5 ? "|" : ""), -Hs.barW / 2 + 40, 14, 40, OUT, 700, Hs.barW - 140); }
          else { let x = -Hs.barW / 2 + 30; (Hs.pills || []).forEach((p, j) => { const k = t - tTy - j * .35; if (k < 0) return; const q = eBack(clamp(k / .3, 0, 1)); font(ctx, 900, 30, FAM); const w = ctx.measureText(p.text).width + 40;
              ctx.save(); ctx.translate(x + w / 2, 0); ctx.scale(q, q); rr(ctx, -w / 2, -28, w, 56, 28); ctx.fillStyle = p.col; ctx.fill(); ol(ctx, 4); textC(ctx, p.text, 0, 11, 30, "#FFFFFF", 900); ctx.restore(); x += w + 12; }); }
          ctx.restore(); }
        // the result card
        if (t >= tOut){ const k = t - tOut, q = eBack(clamp(k / .55, 0, 1)), [cx, cy] = Hs.card, x = lerp(lap[0], cx, q), y = lerp(lap[1], cy, q);
          if (k < .9) burstFx(ctx, lap[0], lap[1] - 40, k, Hs.mode === "kacau" ? "#F2A7B8" : GREEN, 12, 200);
          ctx.save(); ctx.translate(x, y); ctx.scale(.2 + .8 * q, .2 + .8 * q); ctx.translate(-x, -y);
          if (Hs.mode === "kacau"){ const pages = 1 + Math.floor(Math.max(0, k - .6) / .5); const wob = Math.sin(t * 2) * .01; ctx.save(); ctx.translate(x, y); ctx.rotate(wob); ctx.translate(-x, -y); inviteCard(ctx, x, y, Hs.cardW || 560, Hs.cardH || 640, t, pages); ctx.restore(); }
          else { const sendK = t - tSend, sc = sendK > 0 ? 1 - .08 * clamp(sendK / .3, 0, 1) : 1; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y); chatCard(ctx, x, y + Math.sin(t * 2) * 6, Hs.cardW || 600, Hs.lines || [], t, { p: clamp((k - .4) / 1.4, 0, 1) }); ctx.restore(); }
          ctx.restore();
          (Hs.labels || []).forEach((l, j) => { const k2 = t - T(s, l.cue, .3, idx); if (k2 < 0) return; stampBox(ctx, l.text, cx + (l.dx ?? 0), cy + (l.dy ?? 0), k2, l.col || RED, l.size || 54, l.rot ?? (j % 2 ? .12 : -.14)); });
          // copies fly to the readers' phones
          if (t >= tSend) (Hs.readers || []).forEach((r, j) => { const st = sts[r]; if (!st) return; const kk = t - tSend - j * .25; if (kk < 0) return; const hp = handOf(st), u = eOut(clamp(kk / .7, 0, 1));
            if (u < 1){ const px = lerp(cx, hp[0], u), py = lerp(cy, hp[1] - 40, u) - Math.sin(u * Math.PI) * 200; ctx.save(); ctx.translate(px, py); ctx.rotate(u * 6); rr(ctx, -40, -28, 80, 56, 10); ctx.fillStyle = "#D7F5C9"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
            else if (kk < 1.6){ burstFx(ctx, hp[0], hp[1] - 40, kk - .7, GREEN, 8, 90); } }); } } });
  }, SFX((s, f, i, add, tO, cT) => { const H = f.hasil || {}; if (H.typeCue){ const a = cT(H.typeCue, .3); if (H.mode === "kacau") for (let k = 0; k < 4; k++) add(a + k * .25, "pop"); else (H.pills || []).forEach((p, j) => add(a + j * .35, "pop")); }
    if (H.outCue){ add(cT(H.outCue, .3), "whoosh"); add(cT(H.outCue, .3) + .5, H.mode === "kacau" ? "ping" : "chime"); } (H.labels || []).forEach(l => add(cT(l.cue, .3), "pop")); if (H.sendCue){ (H.readers || []).forEach((r, j) => add(cT(H.sendCue, .3) + j * .25 + .7, "ping")); } }));

  /* ================= KD41: _foto (photo studio without instructions) ================= */
  function softbox(ctx, x, y, k, flip){ ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x, GY); ctx.moveTo(x, GY - 10); ctx.lineTo(x - 70, GY); ctx.moveTo(x, GY - 10); ctx.lineTo(x + 70, GY); ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.scale(flip, 1); ctx.rotate(.25); ctx.beginPath(); ctx.moveTo(-30, -40); ctx.lineTo(120, -120); ctx.lineTo(120, 140); ctx.lineTo(-30, 50); ctx.closePath(); ctx.fillStyle = "#3B3540"; ctx.fill(); ol(ctx, 5);
    rr(ctx, 110, -124, 30, 268, 8); ctx.fillStyle = k > 0 ? "#FFFFFF" : "#F3EEE6"; ctx.fill(); ol(ctx, 4); ctx.restore(); if (k > 0) glowAt(ctx, x + flip * 140, y, 520 * k, "#FFFFFF", .7 * k); }
  function photoPrint(ctx, x, y, s, rot, t){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rr(ctx, -200, -240, 400, 480, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.beginPath(); ctx.rect(-170, -210, 340, 340); ctx.clip(); ctx.fillStyle = "#BFD3E0"; ctx.fillRect(-170, -210, 340, 340); ctx.fillStyle = "#C9B9A0"; ctx.fillRect(-170, 60, 340, 80);
    // only the legs and shoes made it into the frame
    ctx.fillStyle = "#3B2418"; rr(ctx, -70, -210, 50, 250, 14); ctx.fill(); ol(ctx, 4); rr(ctx, 20, -210, 50, 250, 14); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.ellipse(-30, 50, 62, 26, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(60, 50, 62, 26, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-170, -210, 340, 340); textC(ctx, "?!", 0, 205, 56, RED, 900); ctx.restore(); }
  TT.scene(PX + "foto", "Cerita: studio foto, fotografer bingung tanpa penjelasan, hasil foto cuma sepatu", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Fo = Object.assign({ camX: 700, qs: [] }, F0.foto || {});
    const tFl = T(s, Fo.flashCue, .3, idx), tPr = tFl + .5;
    base(ctx, s, t, { env: "office", envOpt: { desk: false }, envFront: false,
      spots: { print: [560, 860, 1.0] },
      back: () => { ctx.fillStyle = "#3A3440"; ctx.fillRect(-800, -200, 2700, GY + 200); ctx.fillStyle = "#2E2934"; ctx.fillRect(-800, GY - 20, 2700, 900);
        // paper backdrop sweep
        ctx.fillStyle = "#9EC3D6"; ctx.beginPath(); ctx.moveTo(60, 330); ctx.lineTo(820, 330); ctx.lineTo(820, GY - 120); ctx.quadraticCurveTo(820, GY + 60, 1000, GY + 80); ctx.lineTo(-120, GY + 80); ctx.quadraticCurveTo(60, GY + 60, 60, GY - 120); ctx.closePath(); ctx.fill(); ol(ctx, 5);
        ctx.fillStyle = hexA("#FFFFFF", .18); ctx.fillRect(80, 340, 120, GY - 470); rr(ctx, 30, 300, 820, 46, 23); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 5);
        const fk = t >= tFl ? Math.max(0, 1 - (t - tFl) / .5) : 0; softbox(ctx, -20, 760, fk, 1); softbox(ctx, 1080, 700, fk, -1);
        // stool
        ctx.fillStyle = "#8E4E2E"; rr(ctx, 240, GY - 230, 220, 34, 12); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(270, GY - 196); ctx.lineTo(250, GY); ctx.moveTo(430, GY - 196); ctx.lineTo(450, GY); ctx.stroke(); },
      front: (ctx2, c, sts) => { // tripod + camera in front of the photographer
        const x = Fo.camX, y = GY - 560; ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, y + 40); ctx.lineTo(x - 90, GY); ctx.moveTo(x, y + 40); ctx.lineTo(x + 90, GY); ctx.moveTo(x, y + 40); ctx.lineTo(x, GY); ctx.stroke();
        ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 2); rr(ctx, -90, -60, 180, 110, 16); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); rr(ctx, -60, -84, 60, 30, 8); ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.arc(-96, -4, 44, 0, TAU); ctx.fillStyle = "#4A4550"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-96, -4, 26, 0, TAU); ctx.fillStyle = "#7EC8E3"; ctx.fill(); ol(ctx, 3);
        ctx.fillStyle = hexA("#FFFFFF", .6); ctx.beginPath(); ctx.arc(-104, -12, 8, 0, TAU); ctx.fill(); if (t >= tFl && t < tFl + .25){ glowAt(ctx, -40, -80, 200, "#FFFFFF", .9); } ctx.restore();
        // question chips orbit near the photographer
        (Fo.qs || []).forEach((q, j) => { const k = t - T(s, q.cue, .3, idx); if (k < 0 || t > tFl) return; const st = sts[1]; if (!st) return; const hp = headOf(st);
          wChip(ctx, q.text, hp[0] - 260 + (j % 2) * 40, hp[1] - 330 + j * 110 + Math.sin(t * 2 + j) * 6, k, j === 2 ? ORANGE : "#FFFFFF", j === 2 ? "#FFFFFF" : BROWN, 40, (j - 1) * .05); }); },
      over: () => { if (t >= tFl && t < tFl + .35){ ctx.fillStyle = hexA("#FFFFFF", 1 - (t - tFl) / .35); ctx.fillRect(0, 0, 1080, 1920); }
        if (t >= tPr && t < T(s, Fo.printOutCue, .5, idx) + .3){ const k = t - tPr, q = eBack(clamp(k / .5, 0, 1)), a = 1 - clamp((t - T(s, Fo.printOutCue, .5, idx)) / .3, 0, 1);
          ctx.save(); ctx.globalAlpha *= a; photoPrint(ctx, lerp(760, 560, q), lerp(1000, 620, q), .2 + .8 * q, -.08 + Math.sin(t * 1.5) * .02, t); ctx.restore(); } } });
  }, SFX((s, f, i, add, tO, cT) => { const Fo = f.foto || {}; (Fo.qs || []).forEach(q => add(cT(q.cue, .3), "pop")); if (Fo.flashCue){ add(cT(Fo.flashCue, .3), "ping"); add(cT(Fo.flashCue, .3) + .5, "whoosh"); } }));

  /* ================= KD41: _resep (prompt recipe card) ================= */
  TT.scene(PX + "resep", "Cerita: blok KONTEKS / TUGAS / FORMAT (+ CONTOH) menyatu jadi satu kartu prompt", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Rs = Object.assign({ x: 690, top: 450, w: 640, blocks: [] }, F0.resep || {});
    base(ctx, s, t, { env: "info", envOpt: { spotX: 690 },
      spots: { card: [Rs.x, Rs.top + 380, 1.0] },
      front: () => { const n = Rs.blocks.length, bh = 176, H = 80 + n * (bh + 16) + 20, kC = popQ(t, Rs.at ?? .2, .45);
        if (kC <= 0) return; ctx.save(); ctx.translate(Rs.x, Rs.top); ctx.scale(kC, kC);
        rr(ctx, -Rs.w / 2 - 16, 0, Rs.w + 32, H, 26); ctx.fillStyle = hexA("#FFFFFF", .14); ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.stroke(); ctx.setLineDash([]);
        chip(ctx, Rs.title || "PROMPT", 0, 0, ORANGE, "#FFFFFF", 40);
        Rs.blocks.forEach((b, j) => { const y = 64 + j * (bh + 16), T0 = T(s, b.cue, .25, idx), k = t - T0, small = !!b.small, h = small ? 96 : bh;
          if (k < 0){ rr(ctx, -Rs.w / 2, y, Rs.w, h, 18); ctx.strokeStyle = hexA(CREAM, .5); ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.stroke(); ctx.setLineDash([]); textC(ctx, b.label, 0, y + h / 2 + 12, 34, hexA(CREAM, .55), 900); return; }
          const q = clamp(k / .45, 0, 1), e = eOut(q), from = j % 2 ? 1 : -1, dx = (1 - e) * from * 900, rot = (1 - e) * from * .4, sq = k > .45 && k < .75 ? Math.sin((k - .45) / .3 * Math.PI) * .08 : 0;
          ctx.save(); ctx.translate(dx, y + h / 2); ctx.rotate(rot); ctx.scale(1 + sq, 1 - sq);
          rr(ctx, -Rs.w / 2, -h / 2, Rs.w, h, 18); ctx.fillStyle = small ? hexA(GOLD, .9) : "#FFFFFF"; ctx.fill(); ol(ctx, 6); if (small){ ctx.setLineDash([12, 8]); rr(ctx, -Rs.w / 2 + 8, -h / 2 + 8, Rs.w - 16, h - 16, 12); ol(ctx, 3); ctx.setLineDash([]); }
          font(ctx, 900, 30, FAM); const lw = ctx.measureText(b.label).width + 36; rr(ctx, -Rs.w / 2 + 20, -h / 2 + 18, lw, 46, 23); ctx.fillStyle = b.col || TEAL; ctx.fill(); ol(ctx, 4); textL(ctx, b.label, -Rs.w / 2 + 38, -h / 2 + 52, 30, "#FFFFFF", 900);
          if (small) textL(ctx, b.text, -Rs.w / 2 + lw + 40, -h / 2 + 54, 30, BROWN, 800, Rs.w - lw - 70);
          else { const L = wrapLines(ctx, b.text, Rs.w - 60, 34, 700); L.slice(0, 2).forEach((l, i) => textL(ctx, l, -Rs.w / 2 + 28, -h / 2 + 108 + i * 44, 34, OUT, 700, Rs.w - 56)); }
          ctx.restore(); if (k > .45 && k < 1.3) sparkle(ctx, Rs.w / 2 - 20, y + 10, 26 * (1 - (k - .45) / .85), GOLD); });
        ctx.restore(); } });
  }, SFX((s, f, i, add, tO, cT) => { const Rs = f.resep || {}; (Rs.blocks || []).forEach(b => { add(cT(b.cue, .25), "whoosh"); add(cT(b.cue, .25) + .45, "pop"); }); }));

  /* ================= JS41: _palu (high striker SEND) ================= */
  function striker(ctx, x, t, puckY, ring, o){ const top = GY - 1400, padY = GY - 70;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 190, 18, 0, 0, TAU); ctx.fill();
    rr(ctx, x - 50, top + 60, 100, GY - 120 - top - 60, 20); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
    const marks = o.marks || ["KIRIM", "CEPAT", "KILAT!"]; for (let i = 0; i < 12; i++){ const y = GY - 200 - i * 95; ctx.fillStyle = i % 2 ? hexA(ORANGE, .25) : hexA(RED, .15); ctx.fillRect(x - 46, y - 47, 92, 95); }
    marks.forEach((m, i) => { const y = GY - 330 - i * 380; wChip(ctx, m, x - 150, y, 1, i === marks.length - 1 ? RED : NAVY, "#FFFFFF", 30, -.05); });
    ctx.fillStyle = "#2C2433"; rr(ctx, x - 8, top + 70, 16, GY - top - 200, 8); ctx.fill();
    // bell
    ctx.save(); ctx.translate(x, top + 20); ctx.rotate(ring > 0 ? Math.sin(ring * 40) * .25 * Math.max(0, 1 - ring) : 0); ctx.beginPath(); ctx.moveTo(-70, 40); ctx.quadraticCurveTo(-64, -60, 0, -70); ctx.quadraticCurveTo(64, -60, 70, 40); ctx.closePath();
    ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 46, 14, 0, TAU); ctx.fillStyle = "#C9A227"; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (ring > 0 && ring < 1.2){ ctx.save(); ctx.globalAlpha = 1 - ring / 1.2; ctx.strokeStyle = GOLD; ctx.lineWidth = 8; for (let r = 0; r < 3; r++){ ctx.beginPath(); ctx.arc(x, top + 10, 90 + r * 40 + ring * 160, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } ctx.restore(); }
    // puck
    rr(ctx, x - 34, puckY - 26, 68, 52, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
    // pad
    rr(ctx, x - 150, padY - 40, 300, 80, 20); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 110, padY - 70 + (o.press || 0), 220, 50, 16); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, o.pad || "KIRIM", x, padY - 34 + (o.press || 0), 30, "#FFFFFF", 900); }
  function mallet(ctx, hx, hy, ang, L){ ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); rr(ctx, -10, -10, L, 20, 10); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 4);
    rr(ctx, L - 40, -70, 110, 140, 22); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fillRect(L - 30, -58, 20, 116); ctx.restore(); }
  TT.scene(PX + "palu", "Cerita: menekan kirim = palu raksasa di permainan uji tenaga, bel TERKIRIM", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Pl = Object.assign({ x: 880, deskX: 230 }, F0.palu || {});
    const tUp = T(s, Pl.raiseCue, .2, idx), tHit = T(s, Pl.hitCue, .3, idx), tTop = tHit + .6, padX = Pl.x, padY = GY - 90;
    const pq = t < tHit ? 0 : clamp((t - tHit) / .6, 0, 1), puckY = lerp(GY - 150, GY - 1330, pq < 1 ? eOut(pq) : 1) + (t > tTop ? Math.sin((t - tTop) * 3) * 6 : 0);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1040 },
      spots: { bell: [Pl.x - 60, GY - 1150, 1.0] },
      back: () => { prop(ctx, "desk", Pl.deskX, GY, { laptop: true, papers: 3, s: .8 }, t);
        if (t < tUp){ for (let i = 0; i < 5; i++){ const q = ((t * 2.2 + i / 5) % 1); ctx.fillStyle = hexA(GOLD, 1 - q); sparkle(ctx, Pl.deskX - 30 + Math.sin(i * 3) * 70, GY - 360 - q * 140, 12, GOLD); } }
        striker(ctx, Pl.x, t, puckY, t > tTop ? t - tTop : 0, { press: t > tHit && t < tHit + .3 ? 18 : 0, marks: Pl.marks, pad: Pl.pad }); },
      over1: (ctx2, c, sts, j) => { if (j !== 0 || t < tUp) return; const st = sts[0], h = handOf(st); let ang, L = 230;
        if (t < tHit - .05){ const q = eOut(clamp((t - tUp) / .5, 0, 1)); ang = lerp(-.3, -1.75, q) + Math.sin(t * 10) * .04; }
        else if (t < tHit + .12){ const q = clamp((t - tHit + .05) / .17, 0, 1); const tgt = Math.atan2(padY - 40 - h[1], padX - h[0]); ang = lerp(-1.75, tgt, q); L = lerp(230, Math.min(330, Math.hypot(padX - h[0], padY - h[1]) - 50), q); }
        else { const tgt = Math.atan2(padY - 40 - h[1], padX - h[0]); ang = tgt - clamp((t - tHit - .6) / .6, 0, 1) * 1.1; L = Math.min(330, Math.hypot(padX - h[0], padY - h[1]) - 50); }
        mallet(ctx, h[0], h[1], ang, L);
        if (t > tHit && t < tHit + .9) burstFx(ctx, padX, padY - 60, t - tHit, HL, 10, 160); },
      over: (ctx2, c) => { if (t > tTop && t < tTop + 1.6){ const p = c.toScreen(Pl.x, GY - 1420); popWord(ctx, Pl.word || "TERKIRIM!", clamp(p[0], 300, 780), clamp(p[1] + 210, 300, 1100), t - tTop, { size: 104, hold: 1.6, rot: -6 }); } } });
  }, SFX((s, f, i, add, tO, cT) => { const P0 = f.palu || {}; if (P0.raiseCue) add(cT(P0.raiseCue, .2), "whoosh"); if (P0.hitCue){ const h = cT(P0.hitCue, .3); add(h, "pop"); add(h + .1, "whoosh"); add(h + .6, "ping"); add(h + .65, "chime"); } }));

  /* ================= JS41: _balas (the client reads, REVISI, the paper ball comes back) ================= */
  function offerPage(ctx, x, y, w, h, o, t){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2, -h / 2, w, 80, 12); ctx.fillStyle = ORANGE; ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + 40, w, 40); rr(ctx, -w / 2, -h / 2, w, h, 12); ol(ctx, 6);
    textC(ctx, o.title || "PENAWARAN HARGA", 0, -h / 2 + 54, 34, "#FFFFFF", 900, w - 40);
    const L = -w / 2 + 34; let y0 = -h / 2 + 140; const rows = o.rows || [];
    rows.forEach((r, i) => { const y = y0 + i * 100; textL(ctx, r.k, L, y, 26, "#8E7A66", 800); const tx = L + 6, ty = y + 40;
      if (r.hl > 0){ ctx.fillStyle = hexA(GOLD, .6); ctx.fillRect(tx - 6, ty - 30, (w - 80) * r.hl, 40); }
      textL(ctx, r.v, tx, ty, 34, r.bad ? RED : OUT, 800, w - 90);
      if (r.wig){ font(ctx, 800, 34, FAM); const ww = ctx.measureText(r.v).width; ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); for (let k = 0; k <= 30; k++){ const xx = tx + ww * k / 30; ctx.lineTo(xx, ty + 12 + Math.sin(k * 1.6 + t * 12) * 5); } ctx.stroke(); }
      if (r.empty){ ctx.setLineDash([10, 8]); rr(ctx, tx + 10, ty - 34, 220, 50, 10); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.stroke(); ctx.setLineDash([]); textL(ctx, "0 file", tx + 30, ty, 28, RED, 900);
        ctx.strokeStyle = hexA("#8C8C94", .8); ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k < 5; k++){ ctx.moveTo(tx + 230, ty - 34); ctx.lineTo(tx + 230 - Math.cos(k * .35) * 60, ty - 34 + Math.sin(k * .35) * 60); } ctx.stroke();
        for (let k = 1; k < 4; k++){ ctx.beginPath(); ctx.arc(tx + 230, ty - 34, k * 18, Math.PI * .5, Math.PI); ctx.stroke(); } }
      if (r.tick > 0) tick(ctx, w / 2 - 50, ty - 12, 26, r.tick); });
    if (o.clip > 0){ const q = eBack(clamp(o.clip, 0, 1)); ctx.save(); ctx.translate(w / 2 - 70 + (1 - q) * 260, -h / 2 + 10 - (1 - q) * 180); ctx.rotate(.4 + (1 - q) * 1.5); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 9; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(0, -40); ctx.arc(16, -40, 16, Math.PI, 0); ctx.lineTo(32, 70); ctx.arc(16, 70, 16, 0, Math.PI); ctx.lineTo(0, -10); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  function paperBall(ctx, x, y, r, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); for (let i = 0; i < 12; i++){ const a = i / 12 * TAU, rr2 = r * (.86 + rnd(i) * .2); ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath();
    ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 3; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(Math.cos(i * 1.7) * r * .7, Math.sin(i * 1.7) * r * .7); ctx.lineTo(Math.cos(i * 1.7 + 2) * r * .3, Math.sin(i * 1.7 + 2) * r * .3); ctx.stroke(); }
    ctx.fillStyle = RED; font(ctx, 900, r * .32, FAM); ctx.textAlign = "center"; ctx.fillText("REVISI", 0, r * .12); ctx.textAlign = "left"; ctx.restore(); }
  TT.scene(PX + "balas", "Cerita: klien membaca penawaran (nama salah, lampiran kosong), cap REVISI, bola kertas kembali ke pengirim", (ctx, th, s, t) => {
    const idx = G.scene, sh = shotOf(s, t), F0 = sh.F, Bl = Object.assign({ page: [700, 820], w: 480, h: 620 }, F0.balas || {});
    const tN = T(s, Bl.nameCue, .3, idx), tL = T(s, Bl.lampCue, .3, idx), tS = T(s, Bl.stampCue, .3, idx), tB = T(s, Bl.ballCue, .3, idx);
    base(ctx, s, t, { env: F0.env || "home",
      back: (ctx2, c, sts, R) => { if (R.part === "kena") prop(ctx, "desk", 820, GY, { laptop: true, mug: true, s: .85 }, t); },
      front: (ctx2, c, sts, R) => {
        if (R.part !== "kena"){ const [px, py] = Bl.page; if (t < tB){ const kS = t - tS;
            offerPage(ctx, px, py + Math.sin(t * 1.8) * 6, Bl.w, Bl.h, { rot: -.03, rows: [{ k: "Kepada:", v: Bl.wrong || "Ibu Rini", bad: t >= tN, wig: t >= tN }, { k: "Total:", v: Bl.total || "Rp4.500.000" }, { k: "Lampiran:", v: "", empty: t >= tL }] }, t);
            if (kS >= 0) stampBox(ctx, "REVISI", px, py + 60, kS, RED, 76, -.18); }
          else { const k = t - tB, q = clamp(k / .35, 0, 1), fly = clamp((k - .35) / .6, 0, 1); if (q < 1){ ctx.save(); ctx.translate(px, py); ctx.scale(1 - .75 * q, 1 - .75 * q); ctx.rotate(q * 2); offerPage(ctx, 0, 0, Bl.w, Bl.h, { rows: [] }, t); ctx.restore(); }
            else paperBall(ctx, lerp(px, px + 900, fly), py - Math.sin(fly * Math.PI) * 300, 70, k * 9); } }
        else { const st = sts[0]; if (!st) return; const hp = headOf(st), k = t - R.shotT, u = clamp(k / .4, 0, 1);
          if (u < 1) paperBall(ctx, lerp(hp[0] - 700, hp[0] - 60, u), lerp(hp[1] - 300, hp[1] - 120, u) - Math.sin(u * Math.PI) * 100, 70, k * 10);
          else { const d = k - .4; paperBall(ctx, hp[0] - 60 - d * 160, Math.min(GY - 70, hp[1] - 120 + d * d * 1800 - d * 300), 70, d * 6);
            if (d < 2.6) for (let i = 0; i < 4; i++){ const a = t * 5 + i * TAU / 4; sparkle(ctx, hp[0] + Math.cos(a) * 130, hp[1] - 190 + Math.sin(a) * 34, 20, i % 2 ? GOLD : CREAM); }
            if (d < .8) burstFx(ctx, hp[0] - 40, hp[1] - 150, d, HL, 10, 140); } } } });
  }, SFX((s, f, i, add, tO, cT) => { const B = f.balas || {}; if (B.nameCue) add(cT(B.nameCue, .3), "ping"); if (B.lampCue) add(cT(B.lampCue, .3), "pop"); if (B.stampCue) add(cT(B.stampCue, .3) + .1, "pop"); if (B.ballCue) add(cT(B.ballCue, .3) + .35, "whoosh");
    (f.shots || []).forEach(sh => add(tO(sh, .2) + .4, "pop")); }));

  /* ================= JS41: _apotek (pharmacist imagination) ================= */
  function medBottle(ctx, x, y, s, label, ok, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -46, -150, 92, 150, 18); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 5); rr(ctx, -40, -180, 80, 36, 8); ctx.fillStyle = ok ? GREEN : RED; ctx.fill(); ol(ctx, 4);
    rr(ctx, -40, -118, 80, 70, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); textC(ctx, "OBAT", 0, -92, 18, BROWN, 900, 70); textC(ctx, label, 0, -58, 34, ok ? GREEN : RED, 900, 70); ctx.restore(); }
  function resepSheet(ctx, x, y, label, t){ ctx.save(); ctx.translate(x, y); ctx.rotate(-.08 + Math.sin(t * 1.3) * .02); rr(ctx, -110, -150, 220, 280, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
    textL(ctx, "RESEP", -90, -108, 28, ORANGE, 900); ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-90, -96); ctx.lineTo(90, -96); ctx.stroke();
    textL(ctx, "R/", -90, -48, 36, BROWN, 900); textL(ctx, "OBAT " + label, -40, -48, 34, BROWN, 900, 130); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 3; i++) ctx.fillRect(-90, -10 + i * 30, 150 - i * 30, 8);
    ctx.strokeStyle = "#3E7DB5"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, 100); ctx.bezierCurveTo(40, 70, 60, 120, 90, 90); ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "apotek", "Cerita: apoteker hampir menyerahkan obat yang salah, STOP, cocokkan dengan resep", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Ap = Object.assign({ cx0: 420, cTop: GY - 330, resep: [530, GY - 480], right: "A", wrong: "B" }, F0.apotek || {});
    const tG = T(s, Ap.grabCue, .3, idx), tR = T(s, Ap.reachCue, .3, idx), tS = T(s, Ap.stopCue, .2, idx), tF = T(s, Ap.fixCue, .3, idx), tO = T(s, Ap.okCue, .3, idx);
    const frozen = t >= tS && t < tF; let bPos = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false }, envFront: false,
      back: () => { ctx.fillStyle = "#E4F1EE"; ctx.fillRect(-800, -200, 2700, GY + 200); ctx.fillStyle = "#CFC4B4"; ctx.fillRect(-800, GY - 20, 2700, 900);
        rr(ctx, 520, 420, 560, 120, 20); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(560, 452, 56, 18); ctx.fillRect(579, 433, 18, 56); textC(ctx, Ap.sign || "APOTEK", 830, 500, 58, "#FFFFFF", 900, 380);
        for (let r = 0; r < 3; r++){ const y = 700 + r * 200; ctx.fillStyle = "#FFFFFF"; rr(ctx, 440, y, 760, 22, 6); ctx.fill(); ol(ctx, 4);
          for (let i = 0; i < 9; i++){ const x = 470 + i * 80, col = ["#E8A55B", "#7EC8E3", "#F2A7B8", "#C9E4B8", "#F6C343"][(i + r) % 5]; if (i % 3 === 1){ rr(ctx, x, y - 120, 60, 120, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); rr(ctx, x + 6, y - 140, 48, 24, 6); ctx.fillStyle = i % 2 ? GREEN : RED; ctx.fill(); ol(ctx, 3); }
            else { rr(ctx, x, y - 90, 66, 90, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); ctx.fillStyle = hexA("#FFFFFF", .8); ctx.fillRect(x + 8, y - 60, 50, 16); } } } },
      front: (ctx2, c, sts) => { // counter
        rr(ctx, Ap.cx0, Ap.cTop, 1300, GY - Ap.cTop + 10, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = GREEN; ctx.fillRect(Ap.cx0, Ap.cTop + 60, 1300, 26); ctx.strokeRect(Ap.cx0, Ap.cTop + 60, 1300, 26);
        rr(ctx, Ap.cx0 - 20, Ap.cTop - 26, 1340, 34, 10); ctx.fillStyle = "#D7DEE4"; ctx.fill(); ol(ctx, 5);
        resepSheet(ctx, Ap.resep[0], Ap.resep[1], Ap.right, t);
        const ph = sts[0], cu = sts[1]; if (!ph || t < tG) return; const okB = t >= tF, lab = okB ? Ap.right : Ap.wrong; let p = handOf(ph);
        if (t >= tO && cu){ const u = eOut(clamp((t - tO) / .6, 0, 1)), q = handOf(cu); p = [lerp(p[0], q[0], u), lerp(p[1], q[1], u)]; }
        const sw = t >= tF && t < tF + .5 ? Math.sin((t - tF) / .5 * Math.PI) : 0; bPos = p;
        medBottle(ctx, p[0], p[1] + 130, .8 * eBack(clamp((t - tG) / .3, 0, 1)) * (1 + sw * .2), lab, okB, t);
        if (frozen || (t >= tF && t < tO + .5)){ const a = [p[0], p[1] - 40], b = [Ap.resep[0] + 30, Ap.resep[1] - 60]; ctx.save(); ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = okB ? GREEN : RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
          const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 20]; if (okB) tick(ctx, m[0], m[1], 44, t - tF); else cross(ctx, m[0], m[1], 44, t - tS); } },
      post: () => { if (frozen){ ctx.fillStyle = hexA("#D9483B", .18 + .05 * Math.sin(t * 12)); ctx.fillRect(0, 0, 1080, 1920); } },
      over: () => { if (frozen) popWord(ctx, "STOP!", 540, 520, t - tS, { size: 150, hold: tF - tS, rot: -4, col: RED }); } });
  }, SFX((s, f, i, add, tO, cT) => { const A = f.apotek || {}; if (A.grabCue) add(cT(A.grabCue, .3), "pop"); if (A.stopCue){ add(cT(A.stopCue, .2), "ping"); add(cT(A.stopCue, .2) + .1, "pop"); } if (A.fixCue) add(cT(A.fixCue, .3), "chime"); if (A.okCue) add(cT(A.okCue, .3) + .6, "pop"); }));

  /* ================= JS41: _periksa (read aloud, rows fixed and ticked) ================= */
  function cactusPal(ctx, x, y, t, nod, happy){ ctx.save(); ctx.translate(x, y); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-50, -70); ctx.lineTo(50, -70); ctx.lineTo(38, 0); ctx.lineTo(-38, 0); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.translate(0, -70); ctx.rotate(Math.sin(t * (nod ? 7 : 1.5)) * (nod ? .12 : .04)); rr(ctx, -34, -150, 68, 156, 34); ctx.fillStyle = "#4E9A5E"; ctx.fill(); ol(ctx, 5); rr(ctx, 26, -110, 46, 26, 13); ctx.fill(); ol(ctx, 4); rr(ctx, 50, -150, 24, 56, 12); ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = OUT; const bl = (t % 3.1) < .12 ? .2 : 1; ctx.beginPath(); ctx.ellipse(-12, -100, 6, 8 * bl, 0, 0, TAU); ctx.ellipse(12, -100, 6, 8 * bl, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); if (happy) ctx.arc(0, -84, 10, .2, Math.PI - .2); else { ctx.moveTo(-8, -78); ctx.lineTo(8, -78); } ctx.stroke();
    if (happy){ ctx.fillStyle = "#F28DB2"; ctx.beginPath(); ctx.arc(0, -158, 12, 0, TAU); ctx.fill(); ol(ctx, 3); } ctx.restore(); }
  TT.scene(PX + "periksa", "Cerita: membaca ulang bersuara ke kaktus meja; baris nama, angka, lampiran, ejaan diperbaiki dan dicentang", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Pr = Object.assign({ page: [690, 840], w: 520, h: 640, deskX: 760, cactus: [960, GY - 232] }, F0.periksa || {});
    const tName = T(s, Pr.nameCue, .3, idx), tAmt = T(s, Pr.amountCue, .3, idx), tClip = T(s, Pr.clipCue, .3, idx), tSp = T(s, Pr.spellCue, .3, idx), tRd = T(s, Pr.readCue, .2, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 90 },
      back: () => { prop(ctx, "desk", Pr.deskX, GY, { laptop: false, mug: true, s: .8 }, t); },
      front: (ctx2, c, sts) => { const [px, py] = Pr.page, reading = t >= tRd;
        const rows = [{ k: "Kepada:", v: t >= tName + .3 ? (Pr.right || "Ibu Rina") : (Pr.wrong || "Ibu Rini"), bad: t >= tName && t < tName + .3, tick: t - tName - .35 },
          { k: "Total:", v: Pr.total || "Rp4.500.000", hl: ramp(t, tAmt, tAmt + .6), tick: t - tAmt - .6 },
          { k: "Lampiran:", v: t >= tClip + .5 ? "1 file ✔" : "", empty: false, tick: t - tClip - .5 },
          { k: "Penutup:", v: t >= tSp + .35 ? "Hormat kami," : "Hromat kami,", wig: t < tSp + .35, bad: t < tSp + .35, tick: t - tSp - .35 }];
        offerPage(ctx, px, py + Math.sin(t * 1.6) * 5, Pr.w, Pr.h, { rot: .02, rows, clip: (t - tClip) / .5 }, t);
        if (reading){ const q = ((t - tRd) * .35) % 1, ly = py - Pr.h / 2 + 140 + q * (Pr.h - 180); ctx.fillStyle = hexA("#7EC8E3", .25); ctx.fillRect(px - Pr.w / 2 + 10, ly - 30, Pr.w - 20, 46); }
        cactusPal(ctx, Pr.cactus[0], Pr.cactus[1], t, reading && t < tRd + 3.5, t >= tSp + .4);
        const st = sts[0]; if (st && reading && t < tRd + 3.5){ const hp = headOf(st); ctx.save(); ctx.strokeStyle = hexA(CREAM, .9); ctx.lineWidth = 7; ctx.lineCap = "round";
          for (let r = 0; r < 3; r++){ const k = ((t * 1.4 + r / 3) % 1); ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(hp[0] + 120 + k * 120, hp[1] + 20, 40 + k * 60, -.7, .7); ctx.stroke(); } ctx.restore(); } } });
  }, SFX((s, f, i, add, tO, cT) => { const P0 = f.periksa || {}; [["nameCue", .65], ["amountCue", .9], ["clipCue", .8], ["spellCue", .65]].forEach(([k, d]) => { if (P0[k]){ add(cT(P0[k], .3), "pop"); add(cT(P0[k], .3) + d, "chime"); } }); }));

  /* ================= SC41: house helpers ================= */
  function houseDraw(ctx, x, baseY, t, o){ o = o || {}; const W = o.w || 500, F = o.fh || 250, Rf = o.rh || 180;
    ctx.save(); ctx.translate(x + (o.pivot || 0), baseY); ctx.rotate(o.tilt || 0); ctx.translate(-(o.pivot || 0), 0);
    // ground floor
    rr(ctx, -W / 2, -F, W, F, 6); ctx.fillStyle = "#FFF0DA"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -40, -170, 80, 170, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(24, -86, 7, 0, TAU); ctx.fill();
    [-1, 1].forEach(sd => { rr(ctx, sd * 150 - 55, -190, 110, 90, 8); ctx.fillStyle = o.lit ? "#FFE08A" : "#BFE2EA"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sd * 150, -190); ctx.lineTo(sd * 150, -100); ctx.stroke(); });
    // upper floor (the investment floor)
    rr(ctx, -W / 2 + 10, -2 * F, W - 20, F, 6); ctx.fillStyle = o.topCol || "#F0B47A"; ctx.fill(); ol(ctx, 6);
    if (o.glow > 0) glowAt(ctx, 0, -1.5 * F, W * .9, "#FFE2B4", .55 * o.glow);
    ctx.strokeStyle = hexA("#8E4E2E", .35); ctx.lineWidth = 3; for (let r = 1; r < 5; r++){ ctx.beginPath(); ctx.moveTo(-W / 2 + 14, -2 * F + r * F / 5); ctx.lineTo(W / 2 - 14, -2 * F + r * F / 5); ctx.stroke(); }
    (o.holes || []).forEach(([hx, hy]) => { ctx.fillStyle = "#3B2418"; ctx.fillRect(hx - 34, -2 * F + hy - 18, 68, 36); });
    rr(ctx, -150, -2 * F + 70, 300, 82, 14); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); textC(ctx, o.label || "INVESTASI", 0, -2 * F + 126, 44, GOLD, 900, 270);
    if (o.crack > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W / 2 - 60, -2 * F + 10); ctx.lineTo(W / 2 - 110, -2 * F + 70 * o.crack); ctx.lineTo(W / 2 - 80, -2 * F + 130 * o.crack); ctx.lineTo(W / 2 - 140, -F + 40 * o.crack); ctx.stroke(); }
    // roof
    ctx.beginPath(); ctx.moveTo(-W / 2 - 40, -2 * F + 4); ctx.lineTo(0, -2 * F - Rf); ctx.lineTo(W / 2 + 40, -2 * F + 4); ctx.closePath(); ctx.fillStyle = "#A9432E"; ctx.fill(); ol(ctx, 6);
    rr(ctx, W / 4 - 10, -2 * F - Rf + 40, 50, 90, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4);
    if (o.hook){ ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -2 * F - Rf - 4); ctx.lineTo(0, -2 * F - Rf - 2600); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -2 * F - Rf - 30, 26, -.3, Math.PI * 1.3); ctx.lineWidth = 10; ctx.stroke(); }
    ctx.restore(); }
  function scooter(ctx, x, t, broke){ const y = GY; ctx.save(); ctx.translate(x, y); if (broke) ctx.translate(Math.sin(t * 40) * 2, 0);
    [-110, 110].forEach(dx => { ctx.beginPath(); ctx.arc(dx, -48, 46, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(dx, -48, 18, 0, TAU); ctx.fillStyle = "#C9D3DD"; ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(-150, -70); ctx.quadraticCurveTo(-140, -170, -40, -160); ctx.lineTo(40, -110); ctx.lineTo(70, -60); ctx.lineTo(-150, -60); ctx.closePath(); ctx.fillStyle = "#E2502E"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -130, -184, 120, 26, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(40, -110); ctx.lineTo(100, -240); ctx.lineTo(140, -230); ctx.lineTo(150, -60); ctx.lineTo(70, -60); ctx.closePath(); ctx.fillStyle = "#E2502E"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(80, -262); ctx.lineTo(160, -262); ctx.stroke(); ctx.beginPath(); ctx.arc(150, -200, 18, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (broke) smoke(ctx, x - 20, y - 120, t, 1, { n: 7, h: 260, col: "#5A5560", s: 1.1 }); }
  function stormFx(ctx, k, t, flashT){ if (k <= 0) return; ctx.fillStyle = hexA("#1E2433", .45 * k); ctx.fillRect(0, 0, 1080, 1920);
    ctx.strokeStyle = hexA("#BFD3E0", .55 * k); ctx.lineWidth = 3; for (let i = 0; i < 70; i++){ const x = (rnd(i) * 1300 + t * 260) % 1300 - 110, y = (rnd(i + 5) * 2000 + t * 1700 * (1 + rnd(i + 9) * .4)) % 2000 - 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 46); ctx.stroke(); }
    const lf = ((t - flashT) % 3.2); if (lf >= 0 && lf < .12){ ctx.fillStyle = hexA("#FFFFFF", .5 * k); ctx.fillRect(0, 0, 1080, 1920); } }
  function stormCloud(ctx, x, y, s, t, label){ ctx.save(); ctx.translate(x + Math.sin(t * .8) * 20, y); ctx.scale(s, s);
    ctx.fillStyle = "#4A4E5E"; [[-170, 20, 110], [-60, -40, 140], [80, -20, 130], [190, 30, 100], [0, 50, 120]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(a, b, r, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-60, -40, 140, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    if (label) textC(ctx, label, 0, 50, 46, "#FFFFFF", 900, 380);
    if ((t % 3.2) < .25){ ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(40, 140); ctx.lineTo(-10, 260); ctx.lineTo(50, 260); ctx.lineTo(0, 400); ctx.stroke(); } ctx.restore(); }

  /* ================= SC41: _rumah (house without foundation in a storm) ================= */
  TT.scene(PX + "rumah", "Cerita: rumah INVESTASI tanpa fondasi diterpa badai biaya mendadak, miring dan dibongkar", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Ru = Object.assign({ x: 650, scooterX: 1010 }, F0.rumah || {});
    const tBr = T(s, Ru.brokeCue, .3, idx), tSt = T(s, Ru.stormCue, .3, idx), tDn = T(s, Ru.downCue, .3, idx), tPl = T(s, Ru.pullCue, .3, idx);
    const sink = ramp(t, tDn, tDn + 2.4), storm = ramp(t, tSt, tSt + .8);
    base(ctx, s, t, { env: "sky", envOpt: { hills: true }, envFront: false,
      back: () => { if (storm > 0){ ctx.fillStyle = hexA("#2A3040", .35 * storm); ctx.fillRect(-800, -400, 2800, 2600); }
        if (sink > 0){ ctx.fillStyle = "#6B4426"; ctx.beginPath(); ctx.ellipse(Ru.x, GY + 6, 360, 46, 0, 0, TAU); ctx.fill(); ol(ctx, 5); for (let i = 0; i < 5; i++){ const q = ((t * .7 + i / 5) % 1); ctx.fillStyle = hexA("#8E5A36", 1 - q); ctx.beginPath(); ctx.arc(Ru.x - 280 + i * 140, GY - q * 30, 14 * (1 - q) + 4, 0, TAU); ctx.fill(); } }
        const holes = t >= tPl ? [[120, 200]] : [];
        houseDraw(ctx, Ru.x, GY + 70 * sink, t, { tilt: .12 * sink + (sink > 0 ? Math.sin(t * 3) * .01 : 0), pivot: 250, holes, crack: ramp(t, tPl, tPl + .5) });
        if (t >= tDn){ const q = popQ(t, tDn, .4); ctx.save(); ctx.translate(Ru.x + 230, GY - 660); ctx.scale(q, q); rr(ctx, -70, -60, 140, 120, 18); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-20, -40); ctx.lineTo(20, -40); ctx.lineTo(20, 4); ctx.lineTo(44, 4); ctx.lineTo(0, 46 + Math.sin(t * 6) * 4); ctx.lineTo(-44, 4); ctx.lineTo(-20, 4); ctx.closePath(); ctx.fill(); ctx.restore(); }
        scooter(ctx, Ru.scooterX, t, t >= tBr);
        if (t >= tBr) wChip(ctx, Ru.bill || "SERVIS Rp2 JUTA", Ru.scooterX - 40, GY - 560 + Math.sin(t * 2) * 6, t - tBr - .3, RED, "#FFFFFF", 36, .05);
        if (storm > 0) stormCloud(ctx, Ru.x + 40, 520 - 300 * (1 - storm), 1.0, t, Ru.cloud || "BIAYA MENDADAK"); },
      over1: (ctx2, c, sts, j) => { if (j !== 0 || t < tPl) return; const st = sts[0], h = handOf(st), k = t - tPl, u = eOut(clamp(k / .6, 0, 1));
        const from = [Ru.x - 250 + 120 + 0, GY - 500 + 200], x = lerp(from[0], h[0], u), y = lerp(from[1], h[1], u) - Math.sin(u * Math.PI) * 160;
        if (u < 1){ rr(ctx, x - 34, y - 18, 68, 36, 6); ctx.fillStyle = "#C0563A"; ctx.fill(); ol(ctx, 4); } else banknote(ctx, h[0], h[1] - 10, .9, -.2 + Math.sin(t * 5) * .05); },
      post: () => { stormFx(ctx, storm, t, tSt + .6); } });
  }, SFX((s, f, i, add, tO, cT) => { const R0 = f.rumah || {}; if (R0.brokeCue){ add(cT(R0.brokeCue, .3), "pop"); add(cT(R0.brokeCue, .3) + .3, "pop"); } if (R0.stormCue){ add(cT(R0.stormCue, .3), "whoosh"); add(cT(R0.stormCue, .3) + .6, "ping"); }
    if (R0.downCue) add(cT(R0.downCue, .3), "whoosh"); if (R0.pullCue){ add(cT(R0.pullCue, .3), "pop"); add(cT(R0.pullCue, .3) + .6, "pop"); } }));

  /* ================= SC41: _fondasi (crane lowers the house onto the emergency-fund foundation) ================= */
  TT.scene(PX + "fondasi", "Cerita: rumah digantung derek, balok fondasi dana darurat 1-6 bulan masuk, rumah diturunkan", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Fd = Object.assign({ x: 580, w: 460, slabH: 130, hover: 170, blocks: [] }, F0.fondasi || {});
    const tTop = T(s, Fd.topCue, .3, idx), tSl = T(s, Fd.slabCue, .3, idx), tLow = T(s, Fd.lowerCue, .3, idx);
    const low = ramp(t, tLow, tLow + .9), baseY = GY - Fd.slabH - Fd.hover * (1 - eOut(low)) + Math.sin(t * 2.2) * 8 * (1 - low);
    base(ctx, s, t, { env: "sunset", envOpt: {}, envFront: false,
      back: () => { const n = Fd.blocks.length, bw = (Fd.w + 40) / Math.max(1, n), x0 = Fd.x - (Fd.w + 40) / 2;
        // slab outline
        if (t >= tSl){ const q = popQ(t, tSl, .4); ctx.save(); ctx.globalAlpha *= clamp(q, 0, 1); ctx.setLineDash([16, 10]); rr(ctx, x0 - 10, GY - Fd.slabH - 10, Fd.w + 60, Fd.slabH + 14, 10); ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
        Fd.blocks.forEach((b, j) => { const T0 = T(s, b.cue, .3, idx) + (b.d || 0), k = t - T0; if (k < 0) return; const q = eOut(clamp(k / .45, 0, 1)), from = j < n / 2 ? -700 : 1800, x = lerp(from, x0 + j * bw + bw / 2, q), sq = k > .45 && k < .7 ? Math.sin((k - .45) / .25 * Math.PI) * .1 : 0;
          ctx.save(); ctx.translate(x, GY); ctx.scale(1 + sq, 1 - sq); rr(ctx, -bw / 2 + 4, -Fd.slabH, bw - 8, Fd.slabH, 10); ctx.fillStyle = b.soft ? "#E9DFC9" : "#9AA6B2"; ctx.fill(); ol(ctx, 5);
          if (b.soft){ ctx.setLineDash([10, 8]); rr(ctx, -bw / 2 + 14, -Fd.slabH + 10, bw - 28, Fd.slabH - 20, 8); ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]); }
          textC(ctx, b.label, 0, -Fd.slabH / 2 + 6, 46, b.soft ? "#8E7A66" : NAVY, 900, bw - 16); textC(ctx, "BLN", 0, -Fd.slabH / 2 + 44, 22, b.soft ? "#8E7A66" : NAVY, 900); ctx.restore();
          if (k > .45 && k < 1.1){ ctx.save(); ctx.globalAlpha = 1 - (k - .45) / .65; smoke(ctx, x, GY - 10, t, 1, { n: 4, h: 60, col: "#E9DFC9", s: .6 }); ctx.restore(); } });
        if (t >= tSl) wChip(ctx, Fd.slabLabel || "DANA DARURAT", Fd.x, GY + 60, t - tSl, ORANGE, "#FFFFFF", 40, -.02);
        houseDraw(ctx, Fd.x, baseY, t, { w: Fd.w, fh: 230, rh: 160, hook: low < 1, glow: ramp(t, tTop, tTop + .5), lit: low >= 1 });
        if (t >= tLow + .9 && t < tLow + 2){ ctx.save(); ctx.globalAlpha = 1 - (t - tLow - .9) / 1.1; smoke(ctx, Fd.x - Fd.w / 2, GY - Fd.slabH, t, 1, { n: 5, h: 90, col: "#E9DFC9" }); smoke(ctx, Fd.x + Fd.w / 2, GY - Fd.slabH, t, 1, { n: 5, h: 90, col: "#E9DFC9" }); ctx.restore(); burstFx(ctx, Fd.x, GY - Fd.slabH - 300, t - tLow - .9, GOLD, 12, 300); } } });
  }, SFX((s, f, i, add, tO, cT) => { const Fd = f.fondasi || {}; if (Fd.topCue) add(cT(Fd.topCue, .3), "chime"); if (Fd.slabCue) add(cT(Fd.slabCue, .3), "pop"); (Fd.blocks || []).forEach(b => add(cT(b.cue, .3) + (b.d || 0) + .45, "pop")); if (Fd.lowerCue){ add(cT(Fd.lowerCue, .3), "whoosh"); add(cT(Fd.lowerCue, .3) + .9, "chime"); } }));

  /* ================= SC41: _kaca (emergency glass box on the wall) ================= */
  TT.scene(PX + "kaca", "Cerita: kotak kaca DANA DARURAT di dinding (palu kecil), dompet HARIAN terpisah, tumpukan koin INVESTASI mulai tumbuh", (ctx, th, s, t) => {
    const idx = G.scene, F0 = shotOf(s, t).F, Kc = Object.assign({ box: [300, 900], bw: 300, bh: 420, tableX: 930 }, F0.kaca || {});
    const tFi = T(s, Kc.fillCue, .3, idx), tSe = T(s, Kc.sepCue, .3, idx), tEa = T(s, Kc.easyCue, .3, idx), tSa = T(s, Kc.safeCue, .3, idx), tIn = T(s, Kc.investCue, .3, idx);
    const lvl = t < tFi ? .15 : lerp(.15, 1, clamp((t - tFi) / Math.max(1, tSa - tFi), 0, 1));
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 1000 },
      back: () => { const [bx, by] = Kc.box, w = Kc.bw, h = Kc.bh;
        // box
        rr(ctx, bx - w / 2 - 16, by - h / 2 - 70, w + 32, h + 90, 18); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); textC(ctx, Kc.label || "DANA DARURAT", bx, by - h / 2 - 22, 34, "#FFFFFF", 900, w - 10);
        rr(ctx, bx - w / 2, by - h / 2, w, h, 10); ctx.fillStyle = "#F4E9D8"; ctx.fill(); ol(ctx, 5);
        ctx.save(); rr(ctx, bx - w / 2, by - h / 2, w, h, 10); ctx.clip(); const top = by + h / 2 - h * lvl;
        for (let i = 0; i < 14; i++){ const yy = by + h / 2 - 20 - i * 30; if (yy < top) break; banknote(ctx, bx + (i % 2 ? 12 : -12), yy, 1.9, (i % 3 - 1) * .05, i % 2 ? "#7FB77E" : "#8CC48A"); } ctx.restore();
        ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = "#BFE2EA"; rr(ctx, bx - w / 2, by - h / 2, w, h, 10); ctx.fill(); ctx.globalAlpha = .6; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(bx - w / 2 + 30, by - h / 2 + 20); ctx.lineTo(bx - w / 2 + 70, by - h / 2 + 20); ctx.lineTo(bx - w / 2 + 10, by + h / 2 - 40); ctx.lineTo(bx - w / 2 + 10, by - h / 2 + 90); ctx.fill(); ctx.restore();
        rr(ctx, bx - w / 2, by - h / 2, w, h, 10); ol(ctx, 6);
        // gauge
        rr(ctx, bx + w / 2 + 30, by - h / 2, 40, h, 20); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); rr(ctx, bx + w / 2 + 36, by + h / 2 - 6 - (h - 12) * lvl, 28, (h - 12) * lvl, 14); ctx.fillStyle = lvl >= 1 ? GREEN : GOLD; ctx.fill();
        if (t >= tSa){ wChip(ctx, "AMAN", bx + w / 2 + 50, by - h / 2 - 40, t - tSa, GREEN, "#FFFFFF", 34, .06); if (t - tSa < 1) burstFx(ctx, bx, by, t - tSa, GREEN, 12, 260); }
        // little hammer on a chain
        const sw = t >= tEa ? Math.sin((t - tEa) * 8) * .5 * Math.exp(-(t - tEa) * 1.2) : Math.sin(t * 1.6) * .05; ctx.save(); ctx.translate(bx - w / 2 - 70, by - h / 2 - 40); ctx.rotate(sw);
        ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 4; ctx.setLineDash([8, 5]); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 150); ctx.stroke(); ctx.setLineDash([]);
        rr(ctx, -6, 150, 12, 110, 5); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 3); rr(ctx, -34, 140, 68, 30, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); if (t >= tEa && t < tEa + 1.2) sparkle(ctx, 30, 150, 22, GOLD); ctx.restore();
        // side table: daily wallet + investment pot
        const tx = Kc.tableX; ctx.fillStyle = "#8E4E2E"; rr(ctx, tx - 150, GY - 330, 300, 30, 10); ctx.fill(); ol(ctx, 5); rr(ctx, tx - 130, GY - 300, 22, 300, 6); ctx.fill(); ol(ctx, 4); rr(ctx, tx + 108, GY - 300, 22, 300, 6); ctx.fill(); ol(ctx, 4);
        ctx.save(); ctx.translate(tx - 60, GY - 330); rr(ctx, -70, -80, 140, 80, 14); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5); rr(ctx, 20, -60, 60, 36, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.restore();
        wChip(ctx, Kc.daily || "HARIAN", tx - 60, GY - 450, t - tSe, NAVY, "#FFFFFF", 30, -.04);
        if (t >= tSe && t < tSa + 1){ ctx.save(); ctx.globalAlpha = clamp(t - tSe, 0, 1) * (1 - clamp(t - tSa, 0, 1)); ctx.setLineDash([18, 12]); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo((bx + w / 2 + tx - 150) / 2 + 60, GY - 900); ctx.lineTo((bx + w / 2 + tx - 150) / 2 + 60, GY); ctx.stroke(); ctx.restore(); }
        if (t >= tIn){ const g = ramp(t, tIn + .3, tIn + 2.4); ctx.save(); ctx.translate(tx + 60, GY - 330); const q = popQ(t, tIn, .4); ctx.scale(q, q);
          [1, 2, 3].forEach((h, i) => { const n = Math.min(h * 2, Math.floor(g * 6 * (i + 1) / 3 + .01)); for (let k = 0; k < n; k++){ const yy = -14 - k * 16; ctx.beginPath(); ctx.ellipse(-46 + i * 46, yy, 20, 8, 0, 0, TAU); ctx.fillStyle = k % 2 ? GOLD : "#F6D77A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); } });
          ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-70, -60); ctx.lineTo(60, -60 - 70 * g); ctx.stroke(); ctx.beginPath(); ctx.moveTo(60, -60 - 70 * g); ctx.lineTo(36, -50 - 70 * g); ctx.moveTo(60, -60 - 70 * g); ctx.lineTo(54, -36 - 70 * g); ctx.stroke();
          ctx.restore(); wChip(ctx, Kc.potLabel || "INVESTASI", tx + 70, GY - 230, t - tIn - .2, GOLD, BROWN, 26, .05); } },
      over1: (ctx2, c, sts, j) => { if (j !== 0 || t < tFi || t > tSa + .4) return; const st = sts[0], h = handOf(st), [bx, by] = Kc.box;
        for (let i = 0; i < 6; i++){ const T0 = tFi + .3 + i * ((tSa - tFi - .3) / 6), k = t - T0; if (k < 0 || k > .7) continue; const u = eOut(k / .7), x = lerp(h[0], bx, u), y = lerp(h[1], by - Kc.bh / 2 + 20, u) - Math.sin(u * Math.PI) * 200;
          banknote(ctx, x, y, .9, u * 6); } } });
  }, SFX((s, f, i, add, tO, cT) => { const K = f.kaca || {}; if (K.fillCue && K.safeCue){ const a = cT(K.fillCue, .3), b = cT(K.safeCue, .3); for (let k = 0; k < 6; k++) add(a + .3 + k * ((b - a - .3) / 6), "pop"); add(b, "chime"); } if (K.easyCue) add(cT(K.easyCue, .3), "ping"); if (K.investCue) add(cT(K.investCue, .3), "pop"); }));

  /*@@SCENES@@*/
})();
