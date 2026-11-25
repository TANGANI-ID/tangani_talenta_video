/* Scene pack j2611221631541: MODE CERITA story scenes for SC49, MS49, SB50, SP50, RN50 (layout prefix j2611221631541_).
   Every scene = base fields of the generic "cerita" layout (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front, shots[], bg)
   + shared extras (hold, pops, stamps, chips, tags, steps, confetti) + any of these story pieces present in its fields:
     dream   {x,y,w,h,blur,focusCue,hang,float,from,stand,qCue,tags[],card,label}   SC49 dream photo of the school, blurry -> sharp
     amplop  {on,n0,flights[{cue,n,to}],moth,label}  stalls [{x,text,cue,col,pop}]  SC49 savings envelope thins out, a moth flies out
     split   {x,y,w,h,big,sub,splitCue,handCue,to,tile}                          SC49 Rp18 JUTA block cracks into 36 monthly tiles
     suns    {x0,x1,y,r,wakeCue,cheerCue,flyCue,orbit,label,noShelf}             MS49 twelve "leave day" suns, dusty -> awake -> playing
     spirit  {on,outCue,backCue,target}  + bg "desa" (rice field + saung)         MS49 the mind floats to the office, snaps back PLOP
     chili   {xs,pickCue,basketX}                                                MS49 chili bushes, picked chilies fly into a basket
     badge   {on,cue,text}  qfly {from,to,cues,label}                             SB50 MENTOR rosette; KENAPA? marks bonk the mentor
     sharpen {x,y,pushCue,crankCue,sharpCue,feeds[],label}  pencils [{on,cue}]   SB50 giant pencil sharpener; sharp pencils over heads
     board   {x,top,w,h,title,lines[{text,cue}],boxes[]}                         SB50/RN50 whiteboard written at cues
     crab    {mode:pinch|calm,x0,toX,ringCue,legsCue,runCue,pinchCue,standeeCue,leaveCue,actor,sign}  lounge {x,seat}   SP50 beach
     mess    {x,top,w,searchCue,ringCue}  calls {cue,on,from,every}               SP50 flashback desk rummage; call counter
     moles   {top,x0,x1,holes[{text,cue,hitCue,keep}],noteCue,on}                SP50 whack-a-task desk with BERES mallet
     standee {cue,x,actor,sign}                                                  SP50 cardboard cut-out of the hero = auto-reply
     tiger   {x,y,s,label,basket,wakeCue,roarCue,grow[{cue,s,roar}],shrinkCue,small,blanketCue,blanketText}  table {x,w,top}
     kapur   {puppets[], items[{kind,cue,x,y,s,label}]} + bg "papan"           RN50 chalkboard flashback, chalk figures and icons
     gap {a,b,cue}  progress {cue}                                               RN50 team keeps distance, slow progress
   Scenes: _impian _belok _bagi _hari _sawah _lencana _kenapa _rautan _kepiting _cari _tuntas _serah _macan _kapur _ungkit _damai _adegan */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631541_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const BG = {};
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = (st) => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
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
  function lines2(ctx, txt, maxW, size, weight){ const ws = String(txt).split(" "); let L = [txt];
    font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width > maxW && ws.length > 1){ let best = null; for (let i = 1; i < ws.length; i++){ const a = ws.slice(0, i).join(" "), b = ws.slice(i).join(" "), m = Math.max(ctx.measureText(a).width, ctx.measureText(b).width); if (!best || m < best[0]) best = [m, [a, b]]; } L = best[1]; }
    while (Math.max(...L.map(l => ctx.measureText(l).width)) > maxW && size > 14){ size -= 2; font(ctx, weight || 800, size, FAM); }
    return { L, size }; }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function chipW(ctx, txt, x, y, bg, fg, size){ // world chip, no clamping
    size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot, world){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1));
    if (!world){ size = size || 34; font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1; if (w > 896){ size = Math.floor(size * 896 / w); } font(ctx, 800, size, FAM); const w2 = ctx.measureText(txt).width + size * 1.1; x = clamp(x, 92 + w2 / 2, 988 - w2 / 2); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); (world ? chipW : chip)(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function smoke(ctx, x, y, t, k, o){ o = o || {}; const n = o.n || 7, h = o.h || 260, col = o.col || "#8C8C94", sz = o.s || 1;
    for (let i = 0; i < n; i++){ const q = ((t * (o.speed || .55)) + i / n) % 1, a = (1 - q) * .55 * k; if (a <= 0) continue;
      ctx.fillStyle = hexA(col, a); ctx.beginPath(); ctx.arc(x + Math.sin(q * 6 + i) * 26 * sz + (o.drift || 0) * q, y - q * h, (18 + q * 46) * sz, 0, TAU); ctx.fill(); } }
  function arrowLine(ctx, x0, y0, x1, y1, col, w, p){ p = p ?? 1; if (p <= 0) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p), a = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = w + 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(w * 1.6, 0); ctx.lineTo(-w * 1.6, -w * 1.8); ctx.lineTo(-w * 1.6, w * 1.8); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function mug(ctx, col){ rr(ctx, -26, -60, 52, 60, 9); ctx.fillStyle = col || CREAM; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(28, -32, 14, -1.3, 1.3); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(-22, -42, 44, 10); }
  function note(ctx, x, y, w, h, col, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, 8); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.restore(); }
  function bill(ctx, x, y, rot, col, val){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -80, -40, 160, 80, 8); ctx.fillStyle = col || "#E58BA0"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 3; rr(ctx, -68, -28, 136, 56, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 20, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill();
    if (val) textC(ctx, val, 0, 9, 24, OUT, 900, 120); ctx.restore(); }
  function coin(ctx, x, y, r, spin){ const sx = Math.max(.15, Math.abs(Math.cos(spin || 0))); ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, Math.max(3, r * .16)); ctx.beginPath(); ctx.arc(0, 0, r * .62, 0, TAU); ctx.strokeStyle = "#C98A1B"; ctx.lineWidth = Math.max(2, r * .1); ctx.stroke();
    if (r > 14){ font(ctx, 900, r * .9, FAM); ctx.fillStyle = "#C98A1B"; ctx.textAlign = "center"; ctx.fillText("Rp", 0, r * .32); ctx.textAlign = "left"; } ctx.restore(); }
  function sodaBottle(ctx, h, o){ // origin = bottom centre; h = height
    o = o || {}; const w = h * .36, neck = h * .3, cap = o.cap ?? 1, lvl = o.level ?? .78, fizz = o.fizz || 0, t = o.t || 0;
    ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h + neck + w * .2); ctx.quadraticCurveTo(-w / 2, -h + neck * .7, -w * .2, -h + neck * .25); ctx.lineTo(-w * .2, -h);
    ctx.lineTo(w * .2, -h); ctx.lineTo(w * .2, -h + neck * .25); ctx.quadraticCurveTo(w / 2, -h + neck * .7, w / 2, -h + neck + w * .2); ctx.lineTo(w / 2, 0); ctx.closePath();
    ctx.fillStyle = hexA("#BFE8D6", .55); ctx.fill(); ctx.save(); ctx.clip();
    const ly = -h * lvl; ctx.fillStyle = o.col || "#8B3A1E"; ctx.fillRect(-w, ly + Math.sin(t * 9) * 4 * (1 + fizz * 3), w * 2, h); // liquid
    for (let i = 0; i < 6 + fizz * 26; i++){ const q = ((t * (0.5 + fizz * 2.5) + rnd(i) ) % 1), bx = (rnd(i + 7) - .5) * w * .8, by = -q * h * lvl; ctx.fillStyle = hexA("#FFE9C9", .75); ctx.beginPath(); ctx.arc(bx, by, 3 + rnd(i + 3) * 6, 0, TAU); ctx.fill(); }
    if (fizz > .2){ ctx.fillStyle = hexA("#FFF4E6", .9); ctx.fillRect(-w, ly - 10 * fizz, w * 2, 18 * fizz); }
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fillRect(-w * .36, -h * .9, w * .12, h * .8); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(4, h * .022); ctx.lineJoin = "round"; ctx.stroke();
    // label
    rr(ctx, -w / 2, -h * .52, w, h * .2, 4); ctx.fillStyle = o.label || RED; ctx.fill(); ol(ctx, Math.max(3, h * .016)); if (o.text) textC(ctx, o.text, 0, -h * .52 + h * .14, h * .085, "#FFFFFF", 900, w * .9);
    if (cap > 0){ ctx.save(); ctx.translate(0, -h - (o.capLift || 0)); ctx.rotate(o.capRot || 0); rr(ctx, -w * .26, -h * .07, w * .52, h * .075, 4); ctx.fillStyle = o.capCol || "#D9483B"; ctx.fill(); ol(ctx, Math.max(3, h * .016));
      ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 2; for (let k = -2; k <= 2; k++){ ctx.beginPath(); ctx.moveTo(k * w * .09, -h * .065); ctx.lineTo(k * w * .09, -h * .005); ctx.stroke(); } ctx.restore(); }
    ctx.restore(); }
  function sprout(ctx, g, t){ if (g <= 0) return; ctx.save(); ctx.scale(g, g); ctx.strokeStyle = "#3E8B4A"; ctx.lineWidth = 8; ctx.lineCap = "round"; const sw = Math.sin(t * 2) * .08; ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(6, -40, 0, -80); ctx.stroke(); ctx.fillStyle = "#5DB36A";
    ctx.save(); ctx.translate(0, -70); ctx.rotate(-.7); ctx.beginPath(); ctx.ellipse(-26, 0, 30, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.save(); ctx.translate(0, -80); ctx.rotate(.6); ctx.beginPath(); ctx.ellipse(26, 0, 30, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); ctx.restore(); }
  function potPlant(ctx, g, t, label){ ctx.beginPath(); ctx.moveTo(-60, -90); ctx.lineTo(60, -90); ctx.lineTo(46, 0); ctx.lineTo(-46, 0); ctx.closePath(); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -68, -104, 136, 22, 6); ctx.fillStyle = "#A9561A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#5A3A2A"; ctx.beginPath(); ctx.ellipse(0, -100, 56, 10, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(0, -100); sprout(ctx, g, t); ctx.restore(); if (label) textC(ctx, label, 0, -34, 22, "#FFFFFF", 900, 90); }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "cash"){ const n = o.n ?? 3; for (let i = 0; i < n; i++) bill(ctx, -10 + i * 14, -30 - i * 6, -.5 + i * .32 + Math.sin((t || 0) * 3 + i) * .03, i % 2 ? "#E58BA0" : "#7FB7A0", ""); }
    else if (kind === "coin"){ coin(ctx, 0, -30, 34, (t || 0) * 3); }
    else if (kind === "phone"){ prop(ctx, "phone", 0, 0, { s: .6, screen: o.screen || "#BFE2EA", notif: o.notif }, t); }
    else if (kind === "form"){ ctx.rotate(-.06); rr(ctx, -95, -130, 190, 250, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, o.text || "FORMULIR", 0, -92, 24, ORANGE, 900, 160);
      for (let i = 0; i < 3; i++){ ctx.fillStyle = "#B9A58E"; rr(ctx, -70, -66 + i * 32, 140 - i * 20, 11, 5); ctx.fill(); }
      ctx.setLineDash([8, 6]); ctx.strokeStyle = o.signed ? GREEN : RED; ctx.lineWidth = 4; ctx.strokeRect(-70, 36, 140, 60); ctx.setLineDash([]);
      textC(ctx, "TTD", 0, 30, 18, o.signed ? GREEN : RED, 900);
      if (o.signed){ ctx.strokeStyle = "#13223D"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-56, 76); ctx.bezierCurveTo(-30, 30, -10, 100, 10, 60); ctx.bezierCurveTo(24, 40, 40, 90, 60, 58); ctx.stroke(); } }
    else if (kind === "soda"){ ctx.rotate(Math.sin((t || 0) * (o.shake ? 22 : 2)) * (o.shake ? .35 : .04)); sodaBottle(ctx, 190, { t, text: "", fizz: o.fizz || 0, cap: o.cap ?? 1 }); }
    else if (kind === "bag"){ ctx.beginPath(); ctx.moveTo(-34, -120); ctx.quadraticCurveTo(0, -190, 34, -120); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 6; ctx.stroke();
      rr(ctx, -80, -124, 160, 150, 18); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, -50, -80, 100, 40, 8); ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fill(); }
    else if (kind === "key"){ ctx.rotate(-.6 + Math.sin((t || 0) * 2) * .06); ctx.beginPath(); ctx.arc(0, -150, 46, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -150, 18, 0, TAU); ctx.fillStyle = "#8E5A1E"; ctx.fill();
      rr(ctx, -12, -108, 24, 150, 6); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); rr(ctx, 10, 0, 34, 16, 4); ctx.fill(); ol(ctx, 4); rr(ctx, 10, 26, 24, 14, 4); ctx.fill(); ol(ctx, 4); }
    else if (kind === "pot"){ ctx.translate(0, 40); potPlant(ctx, o.g ?? 1, t || 0, o.text); }
    else if (kind === "sticker"){ ctx.rotate(-.1); ctx.beginPath(); ctx.arc(0, -40, 56, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -40, 46, 0, TAU); ctx.fillStyle = o.col || "#5B7DB1"; ctx.fill();
      ctx.fillStyle = "#E2A77C"; ctx.beginPath(); ctx.arc(0, -46, 20, 0, TAU); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-7, -48, 3, 0, TAU); ctx.arc(7, -48, 3, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -42, 8, .3, Math.PI - .3); ctx.stroke(); }
    else if (kind === "marker"){ ctx.rotate(-.5); rr(ctx, -22, -150, 44, 190, 14); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 5); rr(ctx, -22, -150, 44, 60, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-14, 40); ctx.lineTo(14, 40); ctx.lineTo(4, 74); ctx.lineTo(-4, 74); ctx.closePath(); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 4); }
    else if (kind === "mug"){ mug(ctx, o.col || "#FFFFFF"); for (let k = 0; k < 2; k++){ const q = ((t || 0) * .6 + k / 2) % 1; ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6 + k * 12, -70 - q * 50); ctx.quadraticCurveTo(-16 + k * 12, -86 - q * 50, -4 + k * 12, -104 - q * 50); ctx.stroke(); } ctx.globalAlpha = 1; }
    else if (kind === "paper"){ ctx.rotate(-.08); rr(ctx, -90, -120, 180, 240, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      const n = o.lines ?? 5; for (let i = 0; i < n; i++){ ctx.fillStyle = i === 0 ? ORANGE : "#B9A58E"; rr(ctx, -66, -92 + i * 40, i === 0 ? 132 : 70 + rnd(i) * 60, 14, 6); ctx.fill(); } }
    else if (kind === "book"){ ctx.rotate(-.1); rr(ctx, -100, -70, 200, 130, 8); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 5); ctx.fillStyle = PAPER; rr(ctx, -90, -62, 86, 114, 4); ctx.fill(); rr(ctx, 4, -62, 86, 114, 4); ctx.fill();
      ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++){ ctx.fillRect(-80, -44 + i * 24, 64, 7); ctx.fillRect(14, -44 + i * 24, 64, 7); } }
    else if (kind === "ball"){ ctx.rotate((t || 0) * 6); ctx.beginPath(); ctx.arc(0, -40, 40, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -40, 40, -.6, .6); ctx.lineTo(0, -40); ctx.fill(); ctx.beginPath(); ctx.arc(0, -40, 40, Math.PI - .6, Math.PI + .6); ctx.lineTo(0, -40); ctx.fill(); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function keycap(ctx, txt, x, y, k, hl){ if (k < 0) return 0; const q = eBack(clamp(k / .3, 0, 1)), press = k > .35 && k < .55 ? 8 : 0; fit(ctx, txt, 260, 50, 900); const w = Math.max(110, ctx.measureText(txt).width + 60);
    ctx.save(); ctx.translate(x, y + press); ctx.scale(q, q); rr(ctx, -w / 2, -50, w, 112, 18); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 8, -48 - (8 - press), w - 16, 94, 14); ctx.fillStyle = hl ? ORANGE : "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = hl ? "#FFFFFF" : OUT; ctx.textAlign = "center"; ctx.fillText(txt, 0, 12 - (8 - press)); ctx.textAlign = "left"; ctx.restore(); return w; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    env(ctx, E, t, c, eo);
    if (f.bg && BG[f.bg]) layer(ctx, c, 1, () => BG[f.bg](ctx, t, f.bgOpt || {}));
    const R = { c, f, piece, shotT };
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
        drawItem2(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
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
    (f.stamps || []).forEach((p, j) => ovs.push(() => { const k = t - tOf(s, p, .4, idx); if (k >= 0 && k < (p.hold || 99)) stampBox(ctx, p.text, p.x ?? 540, p.y ?? 600, k, p.col || GREEN, p.size || 70, (p.rot ?? -8) * Math.PI / 180); if (k >= 0 && k < .9) burstFx(ctx, p.x ?? 540, p.y ?? 600, k, p.col || GREEN, 12, 220); }));
    (f.tags || []).forEach((g, j) => ovs.push(() => { const st = sts[g.on ?? 0]; if (!st) return; const k = t - tOf(s, g, .2 + j * .1, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : 1e9; if (k < 0 || t > O) return;
      const hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, p = c.toScreen(hp[0], hp[1] + sitD - st.size * .36); popChip(ctx, g.text, p[0], Math.max(230, p[1]), k, g.bg || NAVY, g.fg || "#FFFFFF", g.size || 34, g.rot ?? -.04); }));
    if (f.keys){ const K = f.keys, T0 = tOf(s, K, .3, idx), O = K.outCue ? T(s, K.outCue, .9, idx) : (K.out ?? 1e9);
      if (t >= T0 && t < O + .3) ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1);
        (K.caps || []).forEach((row, r) => { const y = (K.y || 300) + r * 170, gap = 70; font(ctx, 900, 50, FAM); const ws = row.map(x => Math.max(110, ctx.measureText(x).width + 60)), tot = ws.reduce((a, b) => a + b, 0) + gap * (row.length - 1);
          let x = 540 - tot / 2; if (K.label && K.label[r]){ popChip(ctx, K.label[r], 540, y - 92, t - T0 - r * .6, NAVY, "#FFFFFF", 28); }
          row.forEach((cap, i) => { const kk = t - T0 - r * .6 - i * .18; keycap(ctx, cap, x + ws[i] / 2, y, kk, i === row.length - 1); if (i < row.length - 1 && kk > .1){ ctx.save(); ctx.globalAlpha *= clamp(kk * 3, 0, 1); outlineWords(ctx, [{ w: "+" }], x + ws[i] + gap / 2, y + 24, 60, { sw: 12 }); ctx.restore(); } x += ws[i] + gap; }); });
        ctx.restore(); }); }
    if (f.steps){ const y0 = f.stepsY || 250; f.steps.forEach((st, j) => { const T0 = tOf(s, st, .3, idx); if (t < T0) return; ovs.push(() => { const q = eBack(clamp((t - T0) / .4, 0, 1)), y = y0 + j * 104;
        ctx.save(); ctx.translate(540 + (1 - q) * -700, y); ctx.rotate(-.015 + j * .012); fit(ctx, st.text, 640, 46, 900); const w = Math.min(860, ctx.measureText(st.text).width + 170);
        rr(ctx, -w / 2, -42, w, 84, 42); ctx.fillStyle = j === f.steps.length - 1 ? ORANGE : CREAM; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(-w / 2 + 44, 0, 30, 0, TAU); ctx.fillStyle = j === f.steps.length - 1 ? CREAM : ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, String(j + 1), -w / 2 + 44, 15, 38, j === f.steps.length - 1 ? ORANGE : "#FFFFFF", 900);
        fit(ctx, st.text, 640, 46, 900); ctx.fillStyle = j === f.steps.length - 1 ? "#FFFFFF" : BROWN; ctx.textAlign = "center"; ctx.fillText(st.text, 40, 16); ctx.textAlign = "left"; ctx.restore(); }); }); }
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    (f.chips || []).forEach((g, j) => { const T0 = tOf(s, g, .3 + j * .1, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : (g.out ?? 1e9); if (t >= T0 && t < O + .25) ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .25, 0, 1); popChip(ctx, g.text, g.x ?? 540, g.y ?? 330, t - T0, g.bg || NAVY, g.fg || "#FFFFFF", g.size || 40, (g.rot ?? -2) * Math.PI / 180); ctx.restore(); }); });
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
    all.forEach(f => (f.chips || []).forEach((g, j) => add(tOf(s, g, .3 + j * .1, i), "pop")));
    (f0.stamps || []).forEach(p => add(tOf(s, p, .4, i), "ping"));
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }


  function puff(ctx, x, y, s, col){ ctx.fillStyle = col || "rgba(255,255,255,.9)"; [[0, 0, 40], [36, -10, 46], [74, 4, 36], [36, 14, 34]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); }); }

  /* ================= hand-held items ================= */
  function drawItem2(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1;
    const K = { wallet: 1, calc: 1, bignote: 1, folder: 1, kelapa: 1, marker2: 1, lunch: 1, pencilS: 1, cup: 1 };
    if (!K[kind]) return drawItem(ctx, kind, x, y, t, o);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "wallet"){ ctx.rotate(-.1); rr(ctx, -80, -70, 160, 110, 14); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 5); rr(ctx, -80, -70, 160, 40, 12); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(52, -32, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); }
    else if (kind === "calc"){ ctx.rotate(-.08); rr(ctx, -70, -150, 140, 190, 14); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5); rr(ctx, -54, -134, 108, 44, 6); ctx.fillStyle = "#CFE8C9"; ctx.fill(); ol(ctx, 3);
      textC(ctx, o.text || "18.000.000", 46, -102, 18, "#2B3A2A", 900, 100); ctx.textAlign = "left";
      for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++){ rr(ctx, -52 + q * 38, -78 + r * 36, 30, 26, 5); ctx.fillStyle = (r === 2 && q === 2) ? ORANGE : "#E9E2D6"; ctx.fill(); } }
    else if (kind === "bignote"){ ctx.rotate(-.12 + Math.sin(t * 2) * .03); rr(ctx, -150, -260, 300, 330, 14); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 6); rr(ctx, -132, -240, 264, 290, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3);
      for (let i = 0; i < 6; i++){ ctx.fillStyle = i === 0 ? ORANGE : "#B9A58E"; rr(ctx, -106, -212 + i * 42, i === 0 ? 212 : 120 + rnd(i) * 80, 13, 6); ctx.fill(); }
      for (let i = 0; i < 7; i++){ ctx.beginPath(); ctx.arc(-150, -236 + i * 44, 10, 0, TAU); ctx.strokeStyle = "#8C989E"; ctx.lineWidth = 5; ctx.stroke(); } }
    else if (kind === "folder"){ ctx.rotate(-.08); rr(ctx, -130, -180, 260, 190, 12); ctx.fillStyle = o.col || ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -130, -200, 100, 32, 8); ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#F6D36B"; ctx.save(); ctx.translate(70, -150); ctx.rotate(.15); rr(ctx, -40, -40, 80, 80, 4); ctx.fill(); ol(ctx, 3); ctx.restore();
      const L = lines2(ctx, o.text || "SERAH TERIMA", 210, 30, 900); font(ctx, 900, L.size, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; L.L.forEach((l, i) => ctx.fillText(l, 0, -80 + i * L.size * 1.1)); ctx.textAlign = "left"; }
    else if (kind === "kelapa"){ ctx.beginPath(); ctx.arc(0, -60, 62, 0, TAU); ctx.fillStyle = "#6E9A3A"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.ellipse(0, -104, 40, 14, 0, 0, TAU); ctx.fillStyle = "#F3EBD3"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = "#E05A6A"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(10, -104); ctx.lineTo(44, -190); ctx.lineTo(70, -196); ctx.stroke(); }
    else if (kind === "marker2"){ ctx.rotate(-.6); rr(ctx, -16, -120, 32, 150, 10); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 4); rr(ctx, -16, -120, 32, 44, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
      ctx.beginPath(); ctx.moveTo(-10, 30); ctx.lineTo(10, 30); ctx.lineTo(3, 56); ctx.lineTo(-3, 56); ctx.closePath(); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 3); }
    else if (kind === "lunch"){ rr(ctx, -100, -80, 200, 90, 14); ctx.fillStyle = "#E05A6A"; ctx.fill(); ol(ctx, 5); rr(ctx, -110, -96, 220, 30, 12); ctx.fillStyle = "#F0A23C"; ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 2; k++){ const q = (t * .6 + k / 2) % 1; ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-20 + k * 40, -100 - q * 50); ctx.quadraticCurveTo(-34 + k * 40, -120 - q * 50, -16 + k * 40, -140 - q * 50); ctx.stroke(); } ctx.globalAlpha = 1; }
    else if (kind === "pencilS"){ ctx.rotate(-.7); pencil(ctx, 0, 0, 230, 34, 1, t, ""); }
    else if (kind === "cup"){ mug(ctx, o.col || "#FFFFFF"); for (let k = 0; k < 2; k++){ const q = ((t || 0) * .6 + k / 2) % 1; ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6 + k * 12, -70 - q * 50); ctx.quadraticCurveTo(-16 + k * 12, -86 - q * 50, -4 + k * 12, -104 - q * 50); ctx.stroke(); } ctx.globalAlpha = 1; }
    ctx.restore(); }
  // pencil: horizontal, tip pointing +x at (x,y)=tip end; len, th thickness, sharp 0..1
  function pencil(ctx, x, y, len, th, sharp, t, label, o){ o = o || {};
    const cone = th * 1.7 * sharp; ctx.save(); ctx.translate(x, y);
    // body from -len to -cone (or -th*.2 when blunt)
    const bx1 = sharp > 0 ? -cone : 0;
    ctx.beginPath(); ctx.moveTo(-len, -th / 2); ctx.lineTo(bx1, -th / 2); ctx.lineTo(bx1, th / 2); ctx.lineTo(-len, th / 2); ctx.closePath(); ctx.fillStyle = o.col || "#F6C343"; ctx.fill(); ol(ctx, Math.max(3, th * .09));
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fillRect(-len + 8, -th / 2 + th * .14, len - cone - 16, th * .16); ctx.fillStyle = hexA("#C98A1B", .5); ctx.fillRect(-len + 8, th * .18, len - cone - 16, th * .14);
    // eraser + ferrule
    rr(ctx, -len - th * .9, -th / 2, th * .9, th, th * .25); ctx.fillStyle = "#E58BA0"; ctx.fill(); ol(ctx, Math.max(3, th * .08)); ctx.fillStyle = "#BFC6CC"; ctx.fillRect(-len - th * .1, -th / 2, th * .5, th); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(2, th * .06); ctx.strokeRect(-len - th * .1, -th / 2, th * .5, th);
    if (sharp > 0){ ctx.beginPath(); ctx.moveTo(bx1, -th / 2); ctx.lineTo(0, 0); ctx.lineTo(bx1, th / 2); ctx.closePath(); ctx.fillStyle = "#E8C79A"; ctx.fill(); ol(ctx, Math.max(3, th * .08));
      ctx.beginPath(); ctx.moveTo(-cone * .35, -th * .5 * .35); ctx.lineTo(0, 0); ctx.lineTo(-cone * .35, th * .5 * .35); ctx.closePath(); ctx.fillStyle = "#3B3530"; ctx.fill(); }
    else { rr(ctx, -6, -th * .22, 14, th * .44, 4); ctx.fillStyle = "#3B3530"; ctx.fill(); }
    if (label){ const sz = fit(ctx, label, len * .62, th * .62, 900); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(label, -len * .5 - cone * .3, sz * .36); ctx.textAlign = "left"; }
    ctx.restore(); }
  const easeIO2 = q => easeIO(clamp(q, 0, 1));
  const toonOf = (R, j) => (R.f.toons || [])[j];

  /* ================= piece registry: every scene = base() + any pieces present in its fields ================= */
  const PIECES = {};
  const piece = (name, o) => { PIECES[name] = o; };

  /* ---------- SC49: the dream picture (blurry -> sharp) ---------- */
  function dreamPic(ctx, w, h, t, s, o){ o = o || {};
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.clip();
    const m = ctx.getTransform(), sc = Math.hypot(m.a, m.b), b = (o.blur || 0) * sc;
    if (b > .4) ctx.filter = "blur(" + b.toFixed(1) + "px) saturate(" + (1 - .55 * clamp((o.blur || 0) / 14, 0, 1)).toFixed(2) + ")";
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, "#8CCBE0"); g.addColorStop(.62, "#F6E2C4"); g.addColorStop(1, "#F6E2C4"); ctx.fillStyle = g; ctx.fillRect(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40);
    ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.arc(w * .34, -h * .3, h * .09, 0, TAU); ctx.fill();
    puff(ctx, -w * .62 + ((t * 18) % (w * 1.3)), -h * .34, h * .0022);
    // hills + field
    ctx.fillStyle = "#9CC58A"; ctx.beginPath(); ctx.ellipse(-w * .2, h * .3, w * .6, h * .16, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#7FB06A"; ctx.fillRect(-w / 2 - 20, h * .26, w + 40, h * .3);
    // school building
    const bx = -w * .44, bw = w * .56, by = -h * .1, bh = h * .38;
    ctx.fillStyle = "#FFF4E6"; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(2, h * .008); ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = "#C8643B"; ctx.beginPath(); ctx.moveTo(bx - w * .03, by); ctx.lineTo(bx + bw / 2, by - h * .16); ctx.lineTo(bx + bw + w * .03, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++){ if (r === 1 && q === 1) continue; ctx.fillStyle = "#8CCBE0"; ctx.fillRect(bx + bw * (.08 + q * .23), by + bh * (.14 + r * .44), bw * .14, bh * .26); ctx.strokeRect(bx + bw * (.08 + q * .23), by + bh * (.14 + r * .44), bw * .14, bh * .26); }
    ctx.fillStyle = "#7A4A2E"; ctx.fillRect(bx + bw * .31, by + bh * .56, bw * .14, bh * .44);
    font(ctx, 900, h * .055, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(o.school || "SEKOLAH", bx + bw / 2, by - h * .035); ctx.textAlign = "left";
    // flag
    const fx = w * .2, fy = -h * .3; ctx.strokeStyle = "#8C989E"; ctx.lineWidth = Math.max(2, h * .012); ctx.beginPath(); ctx.moveTo(fx, h * .27); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.beginPath(); for (let i = 0; i <= 10; i++){ const u = i / 10; ctx.lineTo(fx + u * w * .12, fy + Math.sin(t * 6 + u * 4) * h * .012 * u); } for (let i = 10; i >= 0; i--){ const u = i / 10; ctx.lineTo(fx + u * w * .12, fy + h * .06 + Math.sin(t * 6 + u * 4) * h * .012 * u); } ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
    ctx.beginPath(); for (let i = 0; i <= 10; i++){ const u = i / 10; ctx.lineTo(fx + u * w * .12, fy + Math.sin(t * 6 + u * 4) * h * .012 * u); } for (let i = 10; i >= 0; i--){ const u = i / 10; ctx.lineTo(fx + u * w * .12, fy + h * .03 + Math.sin(t * 6 + u * 4) * h * .012 * u); } ctx.closePath(); ctx.fillStyle = RED; ctx.fill();
    // the kid in uniform
    if (s){ const a = Object.assign({ hair: "spiky", shirt: "#FFFFFF", pants: "#2C3E6B", skin: "d", tie: "#2C3E6B", shadow: false }, o.kid || {}, { x: w * .3, y: h * .5 + h * .02, size: h * .72, face: -1, pose: "wave", expr: "happy", keys: [] });
      const st = toonState(a, s, t); TT.drawToon(ctx, a, st, t); }
    ctx.filter = "none"; ctx.restore(); }
  function frameBox(ctx, w, h, label, glow){ const pad = 34;
    rr(ctx, -w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad * 2, 14); const g = ctx.createLinearGradient(0, -h, 0, h); g.addColorStop(0, "#A86A3E"); g.addColorStop(1, "#7A4A2E"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 7);
    rr(ctx, -w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 6); ctx.fillStyle = "#5A3520"; ctx.fill(); ol(ctx, 4);
    if (label){ const lw = Math.min(w * .78, 420); rr(ctx, -lw / 2, h / 2 + pad - 26, lw, 52, 10); ctx.fillStyle = "#E3B65A"; ctx.fill(); ol(ctx, 4); textC(ctx, label, 0, h / 2 + pad + 10, 30, BROWN, 900, lw - 30); } }
  function qMark(ctx, x, y, size, rot, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); font(ctx, 900, size, FAM); ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = size * .16; ctx.strokeText("?", 0, size * .36); ctx.fillStyle = col || ORANGE; ctx.fillText("?", 0, size * .36); ctx.textAlign = "left"; ctx.restore(); }
  function dreamGeom(P, s, t, idx){ const x = P.x ?? 540, y = P.y ?? 820; return [x, y + (P.float ? Math.sin(t * 1.6) * 12 : 0)]; }
  piece("dream", {
    spot: (P, s, t, idx) => { const g = dreamGeom(P, s, t, idx); return [g[0], g[1] + (P.camDy ?? 60), P.camZoom ?? null]; },
    back: (ctx, c, sts, R, P, s, t, idx) => {
      const tA = P.cue ? T(s, P.cue, .1, idx) : (P.at ?? 0), k = t - tA; if (k < 0) return;
      const tF = P.focusCue ? T(s, P.focusCue, .6, idx) : (P.sharp ? -9 : 1e9), fq = clamp((t - tF) / .8, 0, 1), blur = (P.blur ?? 14) * (1 - easeIO2(fq));
      let [x, y] = dreamGeom(P, s, t, idx); const w = P.w ?? 520, h = P.h ?? 380; let rot = 0, sc = 1;
      if (P.hang){ const q = clamp(k / .55, 0, 1); y -= (1 - eOut(q)) * 1000; rot = k > .55 ? Math.sin((k - .55) * 6) * .1 * Math.exp(-(k - .55) * 1.2) : 0;
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - w * .3, y - h / 2 - 30); ctx.lineTo(x, y - h / 2 - 120); ctx.lineTo(x + w * .3, y - h / 2 - 30); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y - h / 2 - 120, 10, 0, TAU); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 3); }
      else { sc = eBack(clamp(k / .45, 0, 1)); if (P.float) rot = Math.sin(t * 1.1) * .03; }
      if (P.float){ const st = sts[P.from ?? 0]; if (st){ const hp = toonHead(st); for (let i = 0; i < 3; i++){ const q = clamp(k * 3 - i, 0, 1); if (q <= 0) continue;
        const px = lerp(hp[0], x, (i + 1) / 4.4), py = lerp(hp[1] - st.size * .2, y + h / 2 + 40, (i + 1) / 4.4); ctx.beginPath(); ctx.arc(px, py, (12 + i * 9) * q, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); } } }
      if (P.stand){ ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - w * .35, GY - 4); ctx.lineTo(x - w * .1, y); ctx.moveTo(x + w * .35, GY - 4); ctx.lineTo(x + w * .1, y); ctx.moveTo(x, y); ctx.lineTo(x + w * .05, GY - 4); ctx.stroke();
        ctx.strokeStyle = "#A86A3E"; ctx.lineWidth = 9; ctx.stroke(); }
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
      if (fq > 0) glowAt(ctx, 0, 0, w * .95, GOLD, .4 * fq * (.8 + .2 * Math.sin(t * 4)));
      frameBox(ctx, w, h, P.label);
      dreamPic(ctx, w, h, t, s, { blur, school: P.school, kid: P.kid });
      // focus brackets + flash
      if (t > tF - .6 && t < tF + 1.1){ const u = clamp((t - tF + .6) / .6, 0, 1), a = 1 - clamp((t - tF - .6) / .5, 0, 1), m = lerp(90, 0, eOut(u));
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.lineCap = "round";
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy]) => { const cx = dx * (w / 2 + m - 18), cy = dy * (h / 2 + m - 18); ctx.beginPath(); ctx.moveTo(cx, cy - dy * 60); ctx.lineTo(cx, cy); ctx.lineTo(cx - dx * 60, cy); ctx.stroke(); });
        ctx.restore(); if (t > tF && t < tF + .3){ ctx.fillStyle = hexA("#FFFFFF", .7 * (1 - (t - tF) / .3)); ctx.fillRect(-w / 2, -h / 2, w, h); } }
      // question marks orbiting while blurry
      const tQ = P.qCue ? T(s, P.qCue, .4, idx) : 1e9;
      if (t > tQ && t < tF + .3){ const a = clamp((t - tQ) / .3, 0, 1) * (1 - clamp((t - tF) / .3, 0, 1));
        for (let i = 0; i < 3; i++){ const an = t * 1.8 + i * TAU / 3; ctx.save(); ctx.globalAlpha *= a; qMark(ctx, Math.cos(an) * (w * .62), -h * .62 + Math.sin(an) * 40, 110 + 20 * Math.sin(t * 5 + i), Math.sin(t * 3 + i) * .2); ctx.restore(); } }
      // pinned tags
      (P.tags || []).forEach((g, j) => { const kk = t - tOf(s, g, .5, idx); if (kk < 0) return; const q = eBack(clamp(kk / .35, 0, 1));
        ctx.save(); ctx.translate(g.dx ?? 0, g.dy ?? (-h / 2 - 10)); ctx.rotate((g.rot ?? -4) * Math.PI / 180); ctx.scale(q, q); chipW(ctx, g.text, 0, 0, g.bg || ORANGE, "#FFFFFF", g.size || 44);
        ctx.beginPath(); ctx.arc(0, -36, 11, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); ctx.restore(); });
      // taped card
      if (P.card){ const kk = t - tOf(s, P.card, .4, idx); if (kk >= 0){ const q = eBack(clamp(kk / .35, 0, 1)), L = P.card.lines || [];
        ctx.save(); ctx.translate(P.card.dx ?? w * .28, P.card.dy ?? h * .3); ctx.rotate(.06 + (1 - q) * .5); ctx.scale(q, q); const cw = P.card.w || 330, ch = 60 + L.length * 52;
        rr(ctx, -cw / 2, -ch / 2, cw, ch, 10); ctx.fillStyle = "#FFF7D6"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#E9E2D6", .9); ctx.fillRect(-50, -ch / 2 - 18, 100, 34);
        L.forEach((l, i) => textC(ctx, l, 0, -ch / 2 + 62 + i * 52, 38, i === L.length - 1 ? ORANGE : BROWN, 900, cw - 30)); ctx.restore(); } }
      ctx.restore(); },
    sfx: (P, s, i, add) => { if (P.focusCue){ add(cueT(s, P.focusCue, .6, i) - .5, "whoosh"); add(cueT(s, P.focusCue, .6, i), "chime"); } if (P.hang) add((P.cue ? cueT(s, P.cue, .1, i) : (P.at ?? 0)) + .5, "pop");
      (P.tags || []).forEach(g => add(tOf(s, g, .5, i), "pop")); if (P.card) add(tOf(s, P.card, .4, i), "pop"); if (P.qCue) add(cueT(s, P.qCue, .4, i), "ping"); } });

  /* ---------- SC49: the TABUNGAN envelope gets thinner: bills fly to shops, finally a moth flies out ---------- */
  function stall(ctx, x, q, text, col, t){ if (q <= 0) return; ctx.save(); ctx.translate(x, GY); ctx.scale(1, q); const w = 320, h = 380;
    rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = "#F3E3C3"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -w / 2 + 30, -h + 120, w - 60, 90, 6); ctx.fillStyle = "#3A2418"; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 4; i++){ rr(ctx, -w / 2 + 44 + i * 62, -h + 140, 48, 56, 6); ctx.fillStyle = ["#E05A6A", "#F0A23C", "#5B7DB1", "#7FA563"][i]; ctx.fill(); ol(ctx, 3); }
    rr(ctx, -w / 2 - 10, -h + 230, w + 20, 40, 8); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 6; i++){ const x0 = -w / 2 - 20 + i * (w + 40) / 6, x1 = x0 + (w + 40) / 6; ctx.beginPath(); ctx.moveTo(x0, -h + 10); ctx.lineTo(x1, -h + 10); ctx.lineTo(x1, -h + 80); ctx.quadraticCurveTo((x0 + x1) / 2, -h + 110, x0, -h + 80); ctx.closePath(); ctx.fillStyle = i % 2 ? "#FFFFFF" : col; ctx.fill(); ol(ctx, 4); }
    ctx.rotate(Math.sin(t * 5) * .03); rr(ctx, -w / 2 - 10, -h - 120, w + 20, 100, 14); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); textC(ctx, text, 0, -h - 52, 50, "#FFFFFF", 900, w - 10);
    for (let i = 0; i < 8; i++){ const on = Math.floor(t * 6 + i) % 2; ctx.beginPath(); ctx.arc(-w / 2 + i * w / 7, -h - 120, 7, 0, TAU); ctx.fillStyle = on ? "#FFF1A8" : "#C98A1B"; ctx.fill(); }
    ctx.restore(); }
  piece("stalls", {
    back: (ctx, c, sts, R, P, s, t, idx) => (P || []).forEach(st => { const T0 = tOf(s, st, .3, idx); stall(ctx, st.x, t < T0 ? 0 : eBack(clamp((t - T0) / .45, 0, 1)), st.text, st.col || RED, t); }),
    over: (ctx, c, sts, R, P, s, t, idx) => (P || []).forEach((st, j) => { if (!st.pop) return; const k = t - tOf(s, st, .3, idx); if (k < 0 || k > 1.3) return; const p = c.toScreen(st.x, GY - 640); popWord(ctx, st.pop, p[0], Math.max(300, p[1]), k, { size: 88, rot: j % 2 ? 6 : -6, hold: 1.3 }); }),
    sfx: (P, s, i, add) => (P || []).forEach(st => { if (st.cue){ add(tOf(s, st, .3, i), "whoosh"); add(tOf(s, st, .3, i) + .4, "ping"); } }) });
  function moth(ctx, x, y, t, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const fl = Math.sin(t * 30) * .6;
    [-1, 1].forEach(d => { ctx.save(); ctx.scale(d, 1); ctx.rotate(fl * .5); ctx.beginPath(); ctx.ellipse(34, -14, 36, 24, -.4, 0, TAU); ctx.fillStyle = "#B9B0A0"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(28, 16, 22, 16, .4, 0, TAU); ctx.fillStyle = "#A39A8A"; ctx.fill(); ol(ctx, 3); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 30, 0, 0, TAU); ctx.fillStyle = "#6E6A60"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-4, -28); ctx.quadraticCurveTo(-14, -50, -24, -52); ctx.moveTo(4, -28); ctx.quadraticCurveTo(14, -50, 24, -52); ctx.stroke(); ctx.restore(); }
  piece("amplop", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const st = sts[P.on ?? 0]; if (!st) return; const h = handOf(st), fl = (P.flights || []).map(f => ({ T: T(s, f.cue, .4, idx), n: f.n || 3, to: f.to || [800, 1200] }));
      let n = P.n0 ?? 8; fl.forEach(f => { for (let k = 0; k < f.n; k++) if (t > f.T + k * .16) n--; }); n = Math.max(0, n);
      const tm = P.moth ? T(s, P.moth, .2, idx) : 1e9, flip = clamp((t - tm) / .4, 0, 1);
      ctx.save(); ctx.translate(h[0] + 30 * (st.face || 1), h[1] - 40); ctx.rotate(lerp(-.12 + Math.sin(t * 2) * .03, Math.PI * .92, easeIO2(flip)) * (st.face || 1));
      const w = 190, hh = 110 + n * 3;
      for (let i = 0; i < Math.min(n, 6); i++){ ctx.save(); ctx.translate(-50 + i * 20, -hh + 6); ctx.rotate(-.1 + i * .05); rr(ctx, -40, -46, 80, 70, 6); ctx.fillStyle = i % 2 ? "#E58BA0" : "#7FB7A0"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
      rr(ctx, -w / 2, -hh, w, hh, 10); ctx.fillStyle = "#F3E3C3"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-w / 2, -hh); ctx.lineTo(0, -hh * .45); ctx.lineTo(w / 2, -hh); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
      if (n === 0){ ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * .3, -hh * .2); ctx.lineTo(w * .3, -hh * .25); ctx.stroke(); }
      ctx.save(); ctx.scale(st.face || 1, 1); textC(ctx, P.label || "TABUNGAN", 0, -hh * .2, 30, RED, 900, w - 24); ctx.restore(); ctx.restore();
      fl.forEach(f => { for (let k = 0; k < f.n; k++){ const tk = f.T + k * .16, q = clamp((t - tk) / .75, 0, 1); if (t < tk || q >= 1) continue;
        const x = lerp(h[0], f.to[0], q), y = lerp(h[1] - 120, f.to[1], q) - Math.sin(q * Math.PI) * 300; ctx.save(); ctx.translate(x, y); ctx.scale(1 - q * .4, 1 - q * .4); bill(ctx, 0, 0, q * 7 + k, k % 2 ? "#E58BA0" : "#7FB7A0", ""); ctx.restore(); } });
      if (t > tm + .35){ const k = t - tm - .35; smoke(ctx, h[0], h[1] + 40, t, clamp(1 - k / 1.2, 0, 1), { n: 5, h: 120, s: .6, col: "#B9B0A0" }); moth(ctx, h[0] + k * 150 + Math.sin(k * 8) * 50, h[1] + 40 - k * 230 + Math.cos(k * 6) * 30, t, .9); } },
    over: (ctx, c, sts, R, P, s, t, idx) => { if (!P.moth) return; const st = sts[P.on ?? 0], k = t - T(s, P.moth, .2, idx) - .4; if (!st || k < 0 || k > 1.4) return; const h = handOf(st), p = c.toScreen(h[0] + 180, h[1] - 300); popWord(ctx, P.mothText || "KOSONG...", p[0], Math.max(300, p[1]), k, { size: 84, rot: -6, hold: 1.4, col: "#B9B0A0" }); },
    sfx: (P, s, i, add) => { (P.flights || []).forEach(f => { const t0 = cueT(s, f.cue, .4, i); for (let k = 0; k < (f.n || 3); k++) add(t0 + k * .16, "pop"); add(t0, "whoosh"); }); if (P.moth){ add(cueT(s, P.moth, .2, i), "whoosh"); add(cueT(s, P.moth, .2, i) + .4, "ping"); } } });
  /* ---------- SC49: the big sum split into 36 monthly tiles ---------- */
  piece("split", {
    spot: (P) => [P.x ?? 430, (P.y ?? 760) + 120, P.camZoom ?? null],
    back: (ctx, c, sts, R, P, s, t, idx) => { const x = P.x ?? 430, y = P.y ?? 760, W0 = P.w ?? 560, H0 = P.h ?? 330, tA = P.cue ? T(s, P.cue, .05, idx) : (P.at ?? .15), tS = T(s, P.splitCue, .3, idx), tH = T(s, P.handCue, .6, idx);
      const n = P.n ?? 36, cols = P.cols ?? 6, rows = Math.ceil(n / cols), cw = W0 / cols, chh = H0 / rows;
      if (t < tS + .05){ const q = popQ(t, tA, .5); if (q <= 0) return; ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 6); ctx.scale(q, q); const crack = clamp((t - tS + .6) / .6, 0, 1); ctx.rotate(crack > 0 ? Math.sin(t * 40) * .02 * crack : Math.sin(t * 1.5) * .015);
        glowAt(ctx, 0, 0, W0 * .8, ORANGE, .25); rr(ctx, -W0 / 2, -H0 / 2, W0, H0, 20); const g = ctx.createLinearGradient(0, -H0 / 2, 0, H0 / 2); g.addColorStop(0, "#E08A3C"); g.addColorStop(1, "#A9561A"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 8);
        ctx.fillStyle = hexA("#FFFFFF", .2); rr(ctx, -W0 / 2 + 16, -H0 / 2 + 14, W0 - 32, 26, 12); ctx.fill();
        TT.outlineWords(ctx, [{ w: P.big || "Rp18 JUTA" }], 0, 30, 104, { sw: 22, fill: "#FFFFFF" }); textC(ctx, P.sub || "DANA SMP ALIF", 0, H0 / 2 - 34, 34, CREAM, 900, W0 - 60);
        if (crack > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 1; i < cols; i++){ const xx = -W0 / 2 + i * cw; ctx.beginPath(); ctx.moveTo(xx, -H0 / 2); ctx.lineTo(xx + Math.sin(i * 3) * 10, -H0 / 2 + H0 * crack); ctx.stroke(); } for (let r = 1; r < rows; r++){ const yy = -H0 / 2 + r * chh; ctx.beginPath(); ctx.moveTo(-W0 / 2, yy); ctx.lineTo(-W0 / 2 + W0 * crack, yy + Math.sin(r * 2) * 8); ctx.stroke(); } }
        ctx.restore(); return; }
      const hj = n - 1; const st = sts[P.to ?? 0];
      for (let i = 0; i < n; i++){ const r = Math.floor(i / cols), co = i % cols, tx = x - W0 / 2 + (co + .5) * cw, ty = y - H0 / 2 + (r + .5) * chh;
        const q = clamp((t - tS - (i % 7) * .03) / .7, 0, 1), bump = Math.sin(q * Math.PI) * .55, gx = tx + (tx - x) * bump, gy = ty + (ty - y) * bump * 1.2 - Math.sin(q * Math.PI) * 40;
        let px = gx, py = gy, sc = 1, rot = Math.sin(q * Math.PI) * (rnd(i) - .5) * 1.2;
        if (i === hj && t > tH && st){ const u = easeIO2((t - tH) / .7), hp = handOf(st); px = lerp(gx, hp[0], u); py = lerp(gy, hp[1] - 60, u) - Math.sin(u * Math.PI) * 160; sc = 1 + u * .8; rot = 0;
          if (u > .9) glowAt(ctx, px, py, 160, GOLD, .45 + .15 * Math.sin(t * 6)); }
        ctx.save(); ctx.translate(px, py); ctx.rotate(rot); ctx.scale(sc, sc); rr(ctx, -cw / 2 + 5, -chh / 2 + 5, cw - 10, chh - 10, 8); ctx.fillStyle = (i % 2) ? "#F6D36B" : CREAM; ctx.fill(); ol(ctx, 4);
        textC(ctx, P.tile || "500rb", 0, 9, 26, BROWN, 900, cw - 18); ctx.restore(); }
      // month numbers counter under the grid
      const kq = clamp((t - tS - .3) / 1.2, 0, 1); if (kq > 0){ chipW(ctx, Math.round(kq * n) + " BULAN", x, y + H0 / 2 + 70, NAVY, "#FFFFFF", 40); } },
    sfx: (P, s, i, add) => { const tS = cueT(s, P.splitCue, .3, i); add(tS - .5, "whoosh"); add(tS, "ping"); for (let k = 0; k < 6; k++) add(tS + .1 + k * .1, "pop"); if (P.handCue){ add(cueT(s, P.handCue, .6, i), "whoosh"); add(cueT(s, P.handCue, .6, i) + .7, "chime"); } } });

  /* ---------- MS49: twelve little "leave day" suns on a shelf ---------- */
  function sunGuy(ctx, r, t, o){ o = o || {}; const sp = o.spin || 0;
    ctx.save(); ctx.rotate(sp); ctx.fillStyle = o.dusty ? "#C9B98E" : "#F6A93B"; for (let i = 0; i < 10; i++){ const a = i / 10 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a - .16) * r * .9, Math.sin(a - .16) * r * .9); ctx.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45); ctx.lineTo(Math.cos(a + .16) * r * .9, Math.sin(a + .16) * r * .9); ctx.closePath(); ctx.fill(); ol(ctx, r * .07); } ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, o.dusty ? "#E6DDBF" : "#FFE98A"); g.addColorStop(1, o.dusty ? "#BFB08A" : "#F6C343"); ctx.fillStyle = g; ctx.fill(); ol(ctx, r * .1);
    // face
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .09; ctx.lineCap = "round";
    if (o.sleep){ [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .34, -r * .12, r * .14, .2, Math.PI - .2); ctx.stroke(); }); ctx.beginPath(); ctx.arc(0, r * .28, r * .1, 0, TAU); ctx.stroke(); }
    else { [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .34, -r * .14, r * .1, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }); ctx.beginPath(); ctx.arc(0, r * .14, r * .32, .2, Math.PI - .2); ctx.stroke();
      ctx.fillStyle = hexA("#E05A6A", .45); [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .6, r * .16, r * .14, 0, TAU); ctx.fill(); }); }
    if (o.num != null){ ctx.beginPath(); ctx.arc(0, r * .95, r * .4, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, r * .07); textC(ctx, String(o.num), 0, r * 1.08, r * .46, BROWN, 900); }
    if (o.dusty){ ctx.fillStyle = hexA("#8C8C94", .35); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); for (let i = 0; i < 6; i++){ ctx.fillStyle = hexA("#6E6A60", .6); ctx.beginPath(); ctx.arc((rnd(i + (o.num || 0)) - .5) * r * 1.4, (rnd(i + 9) - .5) * r * 1.4, r * .07, 0, TAU); ctx.fill(); } } }
  function cobweb(ctx, x, y, s, dir){ ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s); ctx.strokeStyle = hexA("#FFFFFF", .75); ctx.lineWidth = 2.5;
    for (let i = 0; i <= 4; i++){ const a = i / 4 * Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 120, Math.sin(a) * 120); ctx.stroke(); }
    for (let r = 30; r <= 120; r += 30){ ctx.beginPath(); for (let i = 0; i <= 4; i++){ const a = i / 4 * Math.PI / 2, rr2 = r * (i % 2 ? .9 : 1); const px = Math.cos(a) * rr2, py = Math.sin(a) * rr2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } ctx.restore(); }
  piece("suns", {
    spot: (P) => [((P.x0 ?? 150) + (P.x1 ?? 930)) / 2, (P.y ?? 720) + 60, P.camZoom ?? null],
    back: (ctx, c, sts, R, P, s, t, idx) => { const n = P.n ?? 12, x0 = P.x0 ?? 150, x1 = P.x1 ?? 930, y = P.y ?? 720, r = P.r ?? 30;
      const tW = P.wakeCue ? T(s, P.wakeCue, .3, idx) : (P.awake ? -9 : 1e9), tC = P.cheerCue ? T(s, P.cheerCue, .5, idx) : 1e9, tFly = P.flyCue ? T(s, P.flyCue, .3, idx) : (P.fly ? -9 : 1e9);
      if (!P.noShelf){ rr(ctx, x0 - 30, y + r * 1.4, x1 - x0 + 60, 26, 6); ctx.fillStyle = "#9A5A34"; ctx.fill(); ol(ctx, 5); [x0 + 20, x1 - 20].forEach(bx => { ctx.beginPath(); ctx.moveTo(bx, y + r * 1.4 + 26); ctx.lineTo(bx, y + r * 1.4 + 80); ctx.lineTo(bx - 40, y + r * 1.4 + 26); ctx.closePath(); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 4); });
        const lw = 380; rr(ctx, (x0 + x1) / 2 - lw / 2, y + r * 1.4 + 34, lw, 56, 8); ctx.fillStyle = "#E3B65A"; ctx.fill(); ol(ctx, 4); textC(ctx, P.label || "JATAH CUTI: 12 HARI", (x0 + x1) / 2, y + r * 1.4 + 74, 30, BROWN, 900, lw - 24);
        if (t < tW + .4){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tW) / .4, 0, 1); cobweb(ctx, x0 - 30, y - r * 2.6, 1, 1); cobweb(ctx, x1 + 30, y - r * 2.6, 1, -1); ctx.restore(); } }
      for (let i = 0; i < n; i++){ let px = lerp(x0 + 30, x1 - 30, n > 1 ? i / (n - 1) : .5), py = y, sc = 1, spin = t * .2 + i;
        const tw = tW + i * .07, awake = t > tw, k = t - tw; let sleep = !awake, dusty = !awake;
        if (!awake){ py += Math.sin(t * 1.4 + i) * 2; sc = 1 + Math.sin(t * 1.4 + i) * .02; }
        else { if (k < .6) py -= Math.sin(clamp(k / .6, 0, 1) * Math.PI) * 90; if (t > tC){ const kk = t - tC; py -= Math.abs(Math.sin(kk * 7 + i * .7)) * 50; spin = t * 3 + i; } }
        if (t > tFly){ const kk = t - tFly, o = P.orbit || [540, 760], R0 = P.orbitR || [380, 140], a = kk * (P.orbitSpeed ?? 1.1) + i * TAU / n, mix = clamp(kk / 1.2, 0, 1);
          px = lerp(px, o[0] + Math.cos(a) * R0[0], easeIO2(mix)); py = lerp(py, o[1] + Math.sin(a) * R0[1] + Math.sin(kk * 5 + i) * 20, easeIO2(mix)); spin = t * 3 + i; sleep = false; dusty = false; }
        ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc); sunGuy(ctx, r, t, { sleep, dusty, num: i + 1, spin });
        if (P.mark && (P.mark.idx || []).includes(i)){ const km = t - T(s, P.mark.cue, .3, idx) - (P.mark.idx.indexOf(i)) * .25; if (km > 0){ const q = clamp(km / .4, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(0, r * .3, r * 1.7, r * 2.0, -.2, -1.2, -1.2 + q * TAU * 1.05); ctx.stroke(); } }
        ctx.restore();
        if (awake && k > 0 && k < .6 && !(t > tFly)) smoke(ctx, px, y + 10, t, 1 - k / .6, { n: 4, h: 80, s: .5, col: "#B9B0A0" });
        if (!awake && i % 4 === 1){ const q = ((t * .5) + i * .3) % 1; ctx.save(); ctx.globalAlpha *= (1 - q) * .9; font(ctx, 900, 30 + q * 14, FAM); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeText("z", px + 20 + q * 30, py - r - q * 70); ctx.fillText("z", px + 20 + q * 30, py - r - q * 70); ctx.restore(); } } },
    sfx: (P, s, i, add) => { if (P.mark) (P.mark.idx || []).forEach((m, j) => add(cueT(s, P.mark.cue, .3, i) + j * .25, "pop")); if (P.wakeCue){ const t0 = cueT(s, P.wakeCue, .3, i); for (let k = 0; k < 12; k += 3) add(t0 + k * .07, "pop"); add(t0 + .9, "chime"); } if (P.cheerCue) add(cueT(s, P.cheerCue, .5, i), "whoosh"); if (P.flyCue) add(cueT(s, P.flyCue, .3, i), "chime"); } });

  /* ---------- MS49: village backdrop (rice field + saung) ---------- */
  BG.desa = (ctx, t, o) => {
    const g = ctx.createLinearGradient(0, -600, 0, 1200); g.addColorStop(0, "#7EC4DC"); g.addColorStop(1, "#F8E7C8"); ctx.fillStyle = g; ctx.fillRect(-2600, -1600, 6400, 3200);
    ctx.fillStyle = "#FFE7A0"; ctx.beginPath(); ctx.arc(860, 180, 80, 0, TAU); ctx.fill(); glowAt(ctx, 860, 180, 260, "#FFF1C0", .5);
    for (let i = 0; i < 4; i++) puff(ctx, -600 + ((t * 16 + i * 520) % 2400), 120 + (i % 2) * 140, .9);
    // mountains
    [["#8FB3A8", -500, 900, 520], ["#7AA394", 500, 820, 640], ["#9DBFB2", 1500, 900, 520]].forEach(([col, mx, base, hh]) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(mx - 900, base + 100); ctx.lineTo(mx, base - hh); ctx.lineTo(mx + 900, base + 100); ctx.closePath(); ctx.fill(); });
    // terraces
    for (let r = 0; r < 7; r++){ const y = 860 + r * 110; ctx.fillStyle = r % 2 ? "#7FB65A" : "#8FC768"; ctx.beginPath(); ctx.moveTo(-2600, y + 30); for (let x = -2600; x <= 3800; x += 200) ctx.lineTo(x, y + Math.sin(x * .004 + r) * 22); ctx.lineTo(3800, y + 400); ctx.lineTo(-2600, y + 400); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = hexA("#5E8F3E", .55); ctx.lineWidth = 3; for (let x = -1400; x < 2600; x += 46){ const yy = y + 30 + Math.sin(x * .004 + r) * 22; const sw = Math.sin(t * 1.6 + x * .01 + r) * 5; ctx.beginPath(); ctx.moveTo(x, yy + 26); ctx.lineTo(x + sw, yy); ctx.stroke(); } }
    // coconut trees
    [-260, 1240, 1500].forEach((px, i) => { ctx.strokeStyle = "#7A5A3A"; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(px, GY - 120); ctx.quadraticCurveTo(px + 60, GY - 600, px + 30, GY - 1000); ctx.stroke();
      for (let k = 0; k < 6; k++){ const a = -Math.PI / 2 + (k - 2.5) * .55 + Math.sin(t * 1.3 + k + i) * .06; ctx.save(); ctx.translate(px + 30, GY - 1000); ctx.rotate(a); ctx.fillStyle = "#4E9A57"; ctx.beginPath(); ctx.ellipse(130, 0, 140, 30, .25, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); } });
    // ground path
    ctx.fillStyle = "#C9A774"; ctx.fillRect(-2600, GY - 120, 6400, 1600); ctx.fillStyle = hexA(OUT, .12); ctx.fillRect(-2600, GY - 120, 6400, 10);
    for (let i = 0; i < 30; i++){ ctx.fillStyle = hexA("#8E6A3A", .35); ctx.beginPath(); ctx.ellipse(-1200 + rnd(i) * 3600, GY - 60 + rnd(i + 3) * 300, 16, 6, 0, 0, TAU); ctx.fill(); }
    if (o.saung !== false){ const sx = o.saungX ?? 540, top = GY - 1000, plat = o.plat ?? (GY - 230);
      ctx.fillStyle = "#8E6A3A"; [-300, 300].forEach(d => { rr(ctx, sx + d - 14, top + 120, 28, GY - top - 120, 6); ctx.fill(); ol(ctx, 4); });
      rr(ctx, sx - 360, plat, 720, 40, 8); ctx.fillStyle = "#C79A5A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 3; for (let x = sx - 340; x < sx + 360; x += 34){ ctx.beginPath(); ctx.moveTo(x, plat + 4); ctx.lineTo(x, plat + 36); ctx.stroke(); }
      ctx.fillStyle = "#8E6A3A"; [-250, 0, 250].forEach(d => { rr(ctx, sx + d - 12, plat + 40, 24, GY - plat - 40, 5); ctx.fill(); ol(ctx, 3); });
      ctx.beginPath(); ctx.moveTo(sx - 430, top + 160); ctx.lineTo(sx, top - 60); ctx.lineTo(sx + 430, top + 160); ctx.closePath(); ctx.fillStyle = "#B8873E"; ctx.fill(); ol(ctx, 6);
      ctx.strokeStyle = hexA("#7A5A2A", .6); ctx.lineWidth = 4; for (let k = -8; k <= 8; k++){ ctx.beginPath(); ctx.moveTo(sx + k * 10, top - 40); ctx.lineTo(sx + k * 52, top + 156 + Math.sin(t * 2 + k) * 3); ctx.stroke(); } }
  };
  /* ---------- MS49: the mind leaves the body for the office (and snaps back) ---------- */
  function miniOffice(ctx, x, y, t, a){ ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + Math.sin(t * 2) * 8); puff(ctx, -190, 40, 1.6); puff(ctx, -40, 50, 1.5);
    rr(ctx, -110, -260, 220, 290, 8); ctx.fillStyle = "#9AA7B4"; ctx.fill(); ol(ctx, 5); for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++){ ctx.fillStyle = Math.floor(t * 3 + r + q) % 3 ? "#FFE08A" : "#DCE6EE"; ctx.fillRect(-84 + q * 62, -236 + r * 62, 44, 40); }
    textC(ctx, "KANTOR", 0, -280, 40, "#FFFFFF", 900); for (let i = 0; i < 3; i++){ const q = ((t * .8) + i / 3) % 1; ctx.save(); ctx.translate(140 + q * 60, -120 - q * 140); ctx.globalAlpha *= 1 - q; rr(ctx, -34, -22, 68, 44, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.moveTo(-34, -22); ctx.lineTo(0, 4); ctx.lineTo(34, -22); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  piece("spirit", {
    back: (ctx, c, sts, R, P, s, t, idx) => { const tO = P.outCue ? T(s, P.outCue, .2, idx) : (P.outAt ?? 1e9), tB = P.backCue ? T(s, P.backCue, .3, idx) : 1e9; if (t < tO - .2 || t > tB + .4) return; const a = clamp((t - tO + .2) / .5, 0, 1) * (1 - clamp((t - tB) / .4, 0, 1)); const tg = P.target || [900, 560]; miniOffice(ctx, tg[0], tg[1], t, a); },
    front: (ctx, c, sts, R, P, s, t, idx) => { const j = P.on ?? 0, st = sts[j], a0 = toonOf(R, j); if (!st || !a0) return; const tO = P.outCue ? T(s, P.outCue, .2, idx) : (P.outAt ?? 1e9), tB = P.backCue ? T(s, P.backCue, .3, idx) : 1e9; if (t < tO) return;
      let u = easeIO2((t - tO) / 1.6); if (t > tB) u = u * (1 - eOut(clamp((t - tB) / .35, 0, 1)));
      if (u > .01){ const tg = P.target || [900, 560], sx = st.x, sy = st.y, x = lerp(sx, tg[0] - 200, u), y = lerp(sy, tg[1] + st.size * .62, u) + Math.sin(t * 3) * 24 * u;
        ctx.save(); ctx.globalAlpha *= .6 * clamp(u * 4, 0, 1);
        // ribbon tail from body to spirit
        ctx.strokeStyle = hexA("#DCEBFF", .8); ctx.lineWidth = 30 * (1 - u * .5); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx, sy - st.size * .5); ctx.bezierCurveTo(sx + 80, sy - st.size * .9, x - 160, y - st.size * .1, x, y - st.size * .45); ctx.stroke();
        const m = ctx.getTransform(), sc = Math.hypot(m.a, m.b); ctx.filter = "grayscale(1) brightness(1.55) blur(" + (1.5 * sc).toFixed(1) + "px)";
        const stc = Object.assign({}, st, { x, y, pose: "phone", expr: "neutral", say: null, emote: null, moving: false, run: false, jumpT: -9 }), ac = Object.assign({}, a0, { shadow: false, talk: false });
        TT.drawToon(ctx, ac, stc, t); ctx.filter = "none"; ctx.restore(); }
      if (t > tB && t < tB + .9){ const hp = toonHead(st); burstFx(ctx, hp[0], hp[1], t - tB, "#8FD3F4", 12, 230); } },
    over: (ctx, c, sts, R, P, s, t, idx) => { const tB = P.backCue ? T(s, P.backCue, .3, idx) : 1e9, st = sts[P.on ?? 0]; if (!st || t < tB || t > tB + 1.3) return; const hp = toonHead(st), p = c.toScreen(hp[0], hp[1] - st.size * .35); popWord(ctx, P.pop || "PLOP!", p[0] + 120, Math.max(300, p[1]), t - tB, { size: 90, rot: 8, hold: 1.2 }); },
    sfx: (P, s, i, add) => { if (P.outCue) add(cueT(s, P.outCue, .2, i), "whoosh"); if (P.backCue){ add(cueT(s, P.backCue, .3, i), "whoosh"); add(cueT(s, P.backCue, .3, i) + .3, "pop"); } } });
  /* ---------- MS49: chili bushes, picked chilies fly into a basket ---------- */
  function basketW(ctx, x, y, w){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(-w / 2, -w * .45); ctx.lineTo(w / 2, -w * .45); ctx.lineTo(w * .4, 0); ctx.lineTo(-w * .4, 0); ctx.closePath(); ctx.fillStyle = "#C79A5A"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = hexA("#7A5A2A", .7); ctx.lineWidth = 3; for (let k = 1; k < 4; k++){ ctx.beginPath(); ctx.moveTo(-w / 2 + k * 4, -w * .45 + k * w * .11); ctx.lineTo(w / 2 - k * 4, -w * .45 + k * w * .11); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, -w * .45, w / 2, w * .09, 0, 0, TAU); ctx.fillStyle = "#A87A40"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function chili(ctx, x, y, r){ ctx.save(); ctx.translate(x, y); ctx.rotate(r || 0); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(16, 30, 4, 62); ctx.quadraticCurveTo(-8, 30, -8, 4); ctx.closePath(); ctx.fillStyle = "#D9372B"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#4E9A57"; ctx.fillRect(-6, -10, 10, 12); ctx.restore(); }
  piece("chili", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const tP = T(s, P.pickCue, .2, idx), bx = P.basketX ?? 540, xs = P.xs || [250, 830];
      xs.forEach((x, b) => { ctx.save(); ctx.translate(x, GY - 10); const sw = Math.sin(t * 2 + b) * .04; ctx.rotate(sw);
        for (let k = 0; k < 7; k++){ ctx.beginPath(); ctx.ellipse((k - 3) * 40, -150 - Math.abs(k - 3) * -14, 70, 50, 0, 0, TAU); ctx.fillStyle = k % 2 ? "#4E9A57" : "#3E8B4A"; ctx.fill(); ol(ctx, 4); }
        for (let k = 0; k < 6; k++){ const ti = tP + (b * 6 + k) * .18; if (t > ti) continue; chili(ctx, (k - 2.5) * 44, -150 + (k % 2) * 40, .3 * (k % 2 ? 1 : -1)); } ctx.restore();
        for (let k = 0; k < 6; k++){ const ti = tP + (b * 6 + k) * .18, q = clamp((t - ti) / .5, 0, 1); if (t < ti || q >= 1) continue; const sx = x + (k - 2.5) * 44, sy = GY - 160; chili(ctx, lerp(sx, bx, q), lerp(sy, GY - 170, q) - Math.sin(q * Math.PI) * 260, q * 8); } });
      basketW(ctx, bx, GY - 20, 220); const nIn = (P.xs || [1, 1]).length * 6; let got = 0; for (let k = 0; k < nIn; k++) if (t > tP + k * .18 + .5) got++;
      for (let k = 0; k < Math.min(got, 12); k++) chili(ctx, bx - 70 + (k % 6) * 28, GY - 128 - Math.floor(k / 6) * 14, 1.4 + k); },
    sfx: (P, s, i, add) => { const tP = cueT(s, P.pickCue, .2, i); for (let k = 0; k < 12; k += 2) add(tP + k * .18, "pop"); } });

  /* ---------- SB50: MENTOR rosette pinned on the chest ---------- */
  piece("badge", {
    over1: (ctx, c, sts, R, P, s, t, idx, j) => { if (j !== (P.on ?? 0)) return; const st = sts[j], kk = t - tOf(s, P, .4, idx); if (!st || kk < 0) return; const k = st.size / 92, q = eBack(clamp(kk / .4, 0, 1)), p = lp(st, 9, -46);
      ctx.save(); ctx.translate(p[0], p[1] - (1 - clamp(kk / .3, 0, 1)) * 300); ctx.rotate(Math.sin(t * 2) * .05); ctx.scale(q, q); const r = 12 * k;
      [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * r * .3, r * .5); ctx.lineTo(d * r * .75, r * 2.1); ctx.lineTo(d * r * .45, r * 1.85); ctx.lineTo(d * r * .2, r * 2.1); ctx.closePath(); ctx.fillStyle = d < 0 ? ORANGE : RED; ctx.fill(); ol(ctx, 4); });
      ctx.beginPath(); for (let i = 0; i < 24; i++){ const a = i / 24 * TAU, rr2 = i % 2 ? r : r * 1.12; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 3); textC(ctx, P.text || "MENTOR", 0, r * .14, r * .36, ORANGE, 900, r * 1.3); ctx.restore();
      if (kk < .9) burstFx(ctx, p[0], p[1], kk, GOLD, 10, 160); },
    sfx: (P, s, i, add) => { add(tOf(s, P, .4, i), "whoosh"); add(tOf(s, P, .4, i) + .3, "chime"); } });
  /* ---------- SB50: "KENAPA?" question marks fly from Putri and bonk Yoga's head ---------- */
  piece("qfly", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const A = sts[P.from ?? 1], B = sts[P.to ?? 0]; if (!A || !B) return; const ha = toonHead(A), hb = toonHead(B);
      (P.cues || []).forEach((cu, i) => { const T0 = T(s, cu, .3, idx), k = t - T0; if (k < 0) return; const fl = .6;
        let x, y, sz = 120, rot = 0;
        if (k < fl){ const u = k / fl; x = lerp(ha[0], hb[0], u); y = lerp(ha[1] - A.size * .28, hb[1] - B.size * .3, u) - Math.sin(u * Math.PI) * 220; rot = u * 6; }
        else { const an = (t - T0 - fl) * 2.2 + i * TAU / Math.max(1, (P.cues || []).length), sq = k < fl + .25 ? 1 - Math.sin((k - fl) / .25 * Math.PI) * .35 : 1; x = hb[0] + Math.cos(an) * B.size * .3; y = hb[1] - B.size * .36 + Math.sin(an) * 34; sz = 104 * sq; rot = Math.sin(t * 3 + i) * .25; }
        qMark(ctx, x, y, sz, rot, i % 2 ? GOLD : ORANGE);
        if (k < fl && P.label){ ctx.save(); ctx.globalAlpha *= 1 - k / fl * .3; chipW(ctx, P.label, x, y - 96, NAVY, "#FFFFFF", 30); ctx.restore(); } }); },
    over: (ctx, c, sts, R, P, s, t, idx) => { const B = sts[P.to ?? 0]; if (!B) return; (P.cues || []).forEach((cu, i) => { const k = t - T(s, cu, .3, idx) - .6; if (k < 0 || k > .9) return; const hb = toonHead(B), p = c.toScreen(hb[0] + 150 * (i % 2 ? -1 : 1), hb[1] - B.size * .4); popWord(ctx, "TOK!", p[0], Math.max(300, p[1]), k, { size: 78, rot: i % 2 ? -8 : 8, hold: .9 }); }); },
    sfx: (P, s, i, add) => (P.cues || []).forEach(cu => { add(cueT(s, cu, .3, i), "whoosh"); add(cueT(s, cu, .3, i) + .6, "pop"); }) });
  /* ---------- SB50: the giant pencil sharpener (imagination) ---------- */
  piece("sharpen", {
    spot: (P) => [P.x ?? 600, (P.y ?? 1250) - 120, P.camZoom ?? null],
    back: (ctx, c, sts, R, P, s, t, idx) => { const x = P.x ?? 600, y = P.y ?? 1250, tP = T(s, P.pushCue, .2, idx), tK = T(s, P.crankCue, .3, idx), tS = T(s, P.sharpCue, .5, idx);
      const bw = 360, bh = 300, hole = x - bw / 2, top = y - 150;
      // pedestal
      rr(ctx, x - 150, y + 150, 300, GY - y - 150, 8); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 200, GY - 40, 400, 40, 10); ctx.fillStyle = "#6E7B82"; ctx.fill(); ol(ctx, 5);
      // shavings tray + spiral shavings
      rr(ctx, x - 260, y + 110, 200, 60, 10); ctx.fillStyle = "#5E6E77"; ctx.fill(); ol(ctx, 4);
      const cranking = t > tK && t < tS + .2, nSh = Math.floor(clamp((t - tK) / Math.max(.5, tS - tK), 0, 1) * 9);
      for (let i = 0; i < nSh; i++){ ctx.save(); ctx.translate(x - 230 + (i % 5) * 34, y + 112 - Math.floor(i / 5) * 18); ctx.rotate(i); ctx.beginPath(); for (let a = 0; a < 9; a += .3){ const r = 4 + a * 2.2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .7); } ctx.strokeStyle = "#E8C79A"; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = "#C2691F"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
      if (cranking){ for (let i = 0; i < 3; i++){ const q = ((t * 1.6) + i / 3) % 1; ctx.save(); ctx.translate(hole + 40 - q * 60, y + 40 + q * 70); ctx.rotate(q * 6 + i); ctx.beginPath(); for (let a = 0; a < 7; a += .3){ const r = 4 + a * 2.4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .7); } ctx.strokeStyle = "#E8C79A"; ctx.lineWidth = 8; ctx.stroke(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); } }
      // pencil (drawn before the body so the tip hides inside)
      const len = P.len || 560, th = 74; let tipX, py = y, prot = 0, sharp = 0, glow = 0;
      const inX = hole + 90, outX = hole - 60, pushQ = easeIO2((t - tP) / .7);
      if (t < tS){ tipX = lerp(hole - 220, inX, pushQ) + (cranking ? Math.sin(t * 30) * 3 : 0); }
      else { const u = easeIO2((t - tS) / .6), u2 = easeIO2((t - tS - .6) / .8); sharp = 1; tipX = lerp(inX, outX, u); glow = u2;
        if (u2 > 0){ tipX = lerp(outX, x + 30, u2); py = lerp(y, y - 560, u2); prot = lerp(0, -Math.PI / 2, u2); } }
      ctx.save(); ctx.translate(tipX, py); ctx.rotate(prot); if (glow > 0) glowAt(ctx, 0, 0, 340, GOLD, .5 * glow * (.8 + .2 * Math.sin(t * 6)));
      pencil(ctx, 0, 0, len, th, sharp, t, P.label || "PAHAM"); if (glow > .6){ for (let i = 0; i < 6; i++){ const a = t * 2 + i; sparkle(ctx, Math.cos(a) * 120 - len * .3, Math.sin(a) * 90, 16 + 6 * Math.sin(t * 5 + i), GOLD); } } ctx.restore();
      // body
      ctx.save(); ctx.translate(x, y + (cranking ? Math.sin(t * 40) * 2 : 0)); rr(ctx, -bw / 2, -bh / 2, bw, bh, 30); const g = ctx.createLinearGradient(0, -bh / 2, 0, bh / 2); g.addColorStop(0, "#E0574A"); g.addColorStop(1, "#A93A2E"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 7);
      ctx.fillStyle = hexA("#FFFFFF", .25); rr(ctx, -bw / 2 + 20, -bh / 2 + 16, bw - 40, 26, 12); ctx.fill();
      textC(ctx, P.title || "RAUTAN", 20, 30, 50, "#FFFFFF", 900, bw - 120);
      // hole on the left side
      ctx.beginPath(); ctx.arc(-bw / 2 + 4, 0, 52, -Math.PI / 2, Math.PI / 2, true); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-bw / 2 + 4, 0, 30, -Math.PI / 2, Math.PI / 2, true); ctx.fillStyle = "#2B2B30"; ctx.fill();
      // hopper on top
      ctx.beginPath(); ctx.moveTo(-90, -bh / 2); ctx.lineTo(-140, -bh / 2 - 90); ctx.lineTo(140, -bh / 2 - 90); ctx.lineTo(90, -bh / 2); ctx.closePath(); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 5);
      // crank on the right
      const ca = cranking ? (t - tK) * 7 : 0; ctx.translate(bw / 2, 0); ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fillStyle = "#6E7B82"; ctx.fill(); ol(ctx, 5);
      ctx.rotate(ca); rr(ctx, -12, -12, 130, 24, 10); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 4); rr(ctx, 104, -40, 36, 70, 14); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 4);
      ctx.restore();
      // feeds falling into the hopper
      (P.feeds || []).forEach((fd, i) => { const k = t - T(s, fd.cue, .3, idx); if (k < 0 || k > 1.4) return; const u = clamp(k / 1.1, 0, 1), sx = x + (i % 2 ? 360 : -360), sy = top - 520;
        ctx.save(); ctx.translate(lerp(sx, x, eOut(u)), lerp(sy, top - 90, u * u)); ctx.scale(1 - u * .7, 1 - u * .7); ctx.rotate((1 - u) * (i % 2 ? .3 : -.3)); chipW(ctx, fd.text, 0, 0, i % 2 ? TEAL : NAVY, "#FFFFFF", 40); ctx.restore(); }); },
    over: (ctx, c, sts, R, P, s, t, idx) => { const tS = T(s, P.sharpCue, .5, idx), k = t - tS - .6; if (k > 0 && k < 1.6){ const p = c.toScreen(P.x ?? 600, (P.y ?? 1250) - 820); popWord(ctx, P.pop || "TAJAM!", p[0], Math.max(300, p[1]), k, { size: 110, rot: -6, hold: 1.5 }); }
      const tK = T(s, P.crankCue, .3, idx); if (t > tK && t < tS){ const p = c.toScreen((P.x ?? 600) + 260, (P.y ?? 1250) - 220); ctx.save(); ctx.globalAlpha *= .9; font(ctx, 900, 44, FAM); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 9; const tx2 = "kriet " + "kriet".slice(0, 1 + Math.floor(t * 6) % 5); ctx.strokeText(tx2, p[0], p[1]); ctx.fillText(tx2, p[0], p[1]); ctx.restore(); } },
    sfx: (P, s, i, add) => { add(cueT(s, P.pushCue, .2, i), "whoosh"); const tK = cueT(s, P.crankCue, .3, i), tS = cueT(s, P.sharpCue, .5, i); for (let k = tK; k < tS; k += .5) add(k, "pop"); add(tS + .6, "whoosh"); add(tS + 1.2, "chime"); (P.feeds || []).forEach(fd => add(cueT(s, fd.cue, .3, i), "whoosh")); } });
  /* ---------- small sharp pencils above heads (screen) ---------- */
  piece("pencils", {
    over: (ctx, c, sts, R, P, s, t, idx) => (Array.isArray(P) ? P : [P]).forEach((g, j) => { const st = sts[g.on ?? 0], k = t - tOf(s, g, .4, idx); if (!st || k < 0) return; const hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, p = c.toScreen(hp[0], hp[1] + sitD - st.size * .42), q = eBack(clamp(k / .4, 0, 1));
      const sx = clamp(p[0], 200, 880), sy = Math.max(250, p[1]); ctx.save(); ctx.translate(sx, sy + Math.sin(t * 3 + j) * 8); ctx.scale(q, q); glowAt(ctx, 0, 0, 150, GOLD, .4); ctx.rotate(-.5); pencil(ctx, 110, 0, 230, 40, 1, t, ""); ctx.restore();
      if (g.text){ ctx.save(); ctx.translate(sx, sy + 70); ctx.scale(q, q); chip(ctx, g.text, 0, 0, NAVY, "#FFFFFF", 30); ctx.restore(); } }),
    sfx: (P, s, i, add) => (Array.isArray(P) ? P : [P]).forEach(g => add(tOf(s, g, .4, i), "chime")) });
  /* ---------- whiteboard on a stand (lines written at cues) ---------- */
  piece("board", {
    spot: (P) => [P.x ?? 760, (P.top ?? 700) + (P.h ?? 420) / 2 + 80, P.camZoom ?? null],
    back: (ctx, c, sts, R, P, s, t, idx) => { const x = P.x ?? 760, top = P.top ?? 700, w = P.w ?? 520, h = P.h ?? 420;
      ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - w * .38, top + h); ctx.lineTo(x - w * .42, GY - 6); ctx.moveTo(x + w * .38, top + h); ctx.lineTo(x + w * .42, GY - 6); ctx.stroke(); ctx.strokeStyle = "#8C989E"; ctx.lineWidth = 8; ctx.stroke();
      rr(ctx, x - w / 2 - 14, top - 14, w + 28, h + 28, 12); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 5); rr(ctx, x - w / 2, top, w, h, 6); ctx.fillStyle = "#FBFBF6"; ctx.fill(); ol(ctx, 3);
      ctx.fillStyle = hexA("#BFE3EA", .25); ctx.beginPath(); ctx.moveTo(x - w / 2 + 40, top); ctx.lineTo(x - w / 2 + 120, top); ctx.lineTo(x - w / 2 + 20, top + h); ctx.lineTo(x - w / 2, top + h); ctx.closePath(); ctx.fill();
      if (P.title) textC(ctx, P.title, x, top + 62, 46, P.titleCol || ORANGE, 900, w - 40);
      (P.lines || []).forEach((ln, i) => { const T0 = tOf(s, ln, .3 + i * .15, idx), q = clamp((t - T0) / .7, 0, 1); if (q <= 0) return; const ly = top + 130 + i * 70, txt = ln.text;
        fit(ctx, txt, w - 80, 38, 800); const tw = ctx.measureText(txt).width; ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2 + 30, ly - 46, (tw + 20) * q, 64); ctx.clip(); ctx.fillStyle = ln.col || BROWN; ctx.fillText(txt, x - w / 2 + 40, ly); ctx.restore();
        if (q < 1){ ctx.save(); ctx.translate(x - w / 2 + 40 + tw * q, ly - 10); drawItem2(ctx, "marker2", 0, 0, t, { s: .55, col: ln.col || TEAL }); ctx.restore(); }
        if (ln.check && q >= 1){ ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + w / 2 - 70, ly - 14); ctx.lineTo(x + w / 2 - 54, ly); ctx.lineTo(x + w / 2 - 26, ly - 34); ctx.stroke(); } });
      (P.boxes || []).forEach((b, i) => { const T0 = tOf(s, b, .3 + i * .15, idx), q = popQ(t, T0, .35); if (q <= 0) return; ctx.save(); ctx.translate(x - w / 2 + (b.x ?? (90 + i * 170)), top + (b.y ?? 220)); ctx.scale(q, q); rr(ctx, -70, -40, 140, 80, 12); ctx.fillStyle = b.col || CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, b.text, 0, 12, 30, BROWN, 900, 120); ctx.restore();
        if (i > 0 && q >= 1){ arrowLine(ctx, x - w / 2 + (P.boxes[i - 1].x ?? (90 + (i - 1) * 170)) + 72, top + (P.boxes[i - 1].y ?? 220), x - w / 2 + (b.x ?? (90 + i * 170)) - 80, top + (b.y ?? 220), ORANGE, 6, 1); } }); },
    sfx: (P, s, i, add) => { (P.lines || []).forEach((ln, j) => add(tOf(s, ln, .3 + j * .15, i), "whoosh")); (P.boxes || []).forEach((b, j) => add(tOf(s, b, .3 + j * .15, i), "pop")); } });

  /* ---------- SP50: the phone in the sand grows crab legs ---------- */
  function crabPhone(ctx, t, o){ o = o || {}; const legs = o.legs || 0, ph = o.ph || 0, ring = o.ring || 0, pinch = o.pinch || 0, dir = o.dir || 1, w = 170, h = 96, lift = 70 * legs;
    ctx.save(); ctx.scale(dir, 1);
    if (legs > 0){ ctx.strokeStyle = OUT; ctx.lineCap = "round"; for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 3; i++){ const a = Math.sin(ph + i * 2.1 + side) * .5, bx = side * (w * .32 + i * 6) , by = -lift - 10;
        const kx = bx + side * 50 * legs, ky = by - 30 * legs + Math.sin(ph + i) * 10, fx = bx + side * (70 + i * 16) * legs + Math.sin(a) * 26, fy = 0;
        ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = "#E0574A"; ctx.lineWidth = 9; ctx.stroke(); ctx.strokeStyle = OUT; }
      // claws
      [-1, 1].forEach(d => { const ex = d * w * .36 + w * .3, ey = -lift - h * .9; ctx.save(); ctx.translate(ex + 40, ey - 20 - Math.sin(ph * .5 + d) * 8); ctx.rotate(-.4 + d * .1);
        const op = .5 - .45 * pinch * (Math.sin(t * 22) * .5 + .5); ctx.fillStyle = "#E0574A"; ctx.beginPath(); ctx.ellipse(0, 0, 36 * legs, 26 * legs, 0, 0, TAU); ctx.fill(); ol(ctx, 4);
        ctx.save(); ctx.rotate(-op); ctx.beginPath(); ctx.ellipse(36 * legs, -10, 34 * legs, 14 * legs, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); ctx.save(); ctx.rotate(op); ctx.beginPath(); ctx.ellipse(36 * legs, 10, 34 * legs, 14 * legs, 0, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore(); ctx.restore(); }); }
    const vib = ring ? Math.sin(t * 60) * 5 : 0; ctx.translate(vib, -lift);
    // eyes on stalks
    if (legs > 0){ [-1, 1].forEach(d => { ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(d * 34, -h + 4); ctx.lineTo(d * 40, -h - 50 * legs); ctx.stroke(); ctx.beginPath(); ctx.arc(d * 40, -h - 56 * legs, 20 * legs, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(d * 40 + 6, -h - 54 * legs, 9 * legs, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }); }
    rr(ctx, -w / 2, -h, w, h, 20); ctx.fillStyle = "#2F2F36"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 12, -h + 12, w - 24, h - 24, 10);
    ctx.fillStyle = ring ? (Math.floor(t * 8) % 2 ? "#9FE0B0" : "#BFE8F5") : "#5A6470"; ctx.fill();
    if (ring){ ctx.save(); ctx.translate(0, -h / 2); ctx.rotate(Math.sin(t * 30) * .2); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); icon(ctx, "phone", -14, -14, 28, "#FFFFFF", 3); ctx.restore(); }
    ctx.restore();
    if (ring){ for (let i = 0; i < 3; i++){ const q = ((t * 1.8) + i / 3) % 1; ctx.strokeStyle = hexA("#FFFFFF", (1 - q) * .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -lift - h / 2, 100 + q * 90, -Math.PI * .85, -Math.PI * .15); ctx.stroke(); } } }
  piece("crab", {
    spot: (P, s, t, idx) => [P.x0 ?? 820, GY - 260, P.camZoom ?? null],
    front: (ctx, c, sts, R, P, s, t, idx) => { const tR = P.ringCue ? T(s, P.ringCue, .2, idx) : 1e9, tL = P.legsCue ? T(s, P.legsCue, .3, idx) : (P.mode === "calm" ? -9 : 1e9), tRun = P.runCue ? T(s, P.runCue, .3, idx) : 1e9, tPin = P.pinchCue ? T(s, P.pinchCue, .4, idx) : 1e9, tLeave = P.leaveCue ? T(s, P.leaveCue, .5, idx) : 1e9, tSt = P.standeeCue ? T(s, P.standeeCue, .3, idx) : 1e9;
      const x0 = P.x0 ?? 820, toX = P.toX ?? 520; let x = x0, legs = clamp((t - tL) / .5, 0, 1), dir = -1, ph = t * 3;
      if (t > tRun){ const u = clamp((t - tRun) / (P.runDur ?? 1.1), 0, 1); x = lerp(x0, toX, u); if (u < 1) ph = t * 22; }
      if (t > tLeave){ const u = clamp((t - tLeave) / 2.4, 0, 1); x = lerp(toX, x0 + 900, u); dir = 1; ph = t * 18; }
      const ring = t > tR && t < Math.min(tPin + .8, tSt) && (P.mode !== "calm" || t < tSt);
      if (legs <= 0){ ctx.save(); ctx.translate(x, GY + 24); ctx.rotate(-.12); crabPhone(ctx, t, { ring: ring ? 1 : 0 }); ctx.restore(); ctx.fillStyle = "#E9CF97"; ctx.beginPath(); ctx.ellipse(x, GY + 20, 140, 24, 0, 0, TAU); ctx.fill(); }
      else { ctx.save(); ctx.translate(x, GY); const pin = t > tPin && t < tPin + 1.2 ? 1 : 0; crabPhone(ctx, t, { legs, ph, ring: ring ? 1 : 0, pinch: pin, dir }); ctx.restore(); }
      // mini standee popping from the screen
      if (t > tSt){ const k = t - tSt, q = eBack(clamp(k / .5, 0, 1)), a0 = P.actor; ctx.save(); ctx.translate(x, GY - 70 * legs - 96); ctx.scale(q, q);
        ctx.strokeStyle = "#8E6A3A"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.stroke();
        rr(ctx, -170, -340, 340, 280, 16); ctx.fillStyle = "#D9B27C"; ctx.fill(); ol(ctx, 5);
        if (a0){ const a = Object.assign({}, a0, { x: -80, y: -70, size: 250, face: 1, shadow: false, keys: [] }), st2 = toonState(a, s, t); st2.pose = "point"; st2.expr = "happy"; TT.drawToon(ctx, a, st2, t); }
        rr(ctx, -10, -320, 170, 140, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); const L = (P.sign || "CUTI\nHUBUNGI\nLARAS").split("\n"); L.forEach((l, i) => textC(ctx, l, 75, -284 + i * 40, 30, i === L.length - 1 ? ORANGE : BROWN, 900, 150));
        ctx.restore(); } },
    over: (ctx, c, sts, R, P, s, t, idx) => { const tR = P.ringCue ? T(s, P.ringCue, .2, idx) : 1e9, tPin = P.pinchCue ? T(s, P.pinchCue, .4, idx) : 1e9;
      if (P.mode !== "calm" && t > tR && t < tR + 1.3){ const p = c.toScreen(P.x0 ?? 820, GY - 330); popWord(ctx, "KRIIING!", p[0], Math.max(300, p[1]), t - tR, { size: 88, rot: -8, hold: 1.3 }); }
      if (t > tPin && t < tPin + 1.3){ const p = c.toScreen(P.toX ?? 520, GY - 430); popWord(ctx, P.pinchText || "CAPIT!", p[0] + 120, Math.max(300, p[1]), t - tPin, { size: 100, rot: 8, hold: 1.3 }); } },
    sfx: (P, s, i, add) => { if (P.ringCue && P.mode !== "calm"){ const t0 = cueT(s, P.ringCue, .2, i); add(t0, "ping"); add(t0 + .5, "ping"); } if (P.legsCue) add(cueT(s, P.legsCue, .3, i), "whoosh"); if (P.runCue) add(cueT(s, P.runCue, .3, i), "whoosh"); if (P.pinchCue) add(cueT(s, P.pinchCue, .4, i), "pop"); if (P.standeeCue){ add(cueT(s, P.standeeCue, .3, i), "pop"); add(cueT(s, P.standeeCue, .3, i) + .3, "chime"); } if (P.leaveCue) add(cueT(s, P.leaveCue, .5, i), "whoosh"); } });
  /* ---------- SP50: beach lounger ---------- */
  piece("lounge", {
    back: (ctx, c, sts, R, P, s, t, idx) => { const x = P.x ?? 380, sy = P.seat ?? (GY - 150); ctx.save(); ctx.translate(x, 0);
      ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; [[-170, -120], [170, 150]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a, GY); ctx.lineTo(a + 20, sy + 20); ctx.stroke(); });
      ctx.strokeStyle = "#A86A3E"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-170, GY); ctx.lineTo(-150, sy + 20); ctx.moveTo(170, GY); ctx.lineTo(190, sy + 20); ctx.stroke();
      // seat + backrest with stripes
      const seg = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 + 34); ctx.lineTo(x1, y1 + 34); ctx.closePath(); };
      ctx.save(); seg(-210, sy, 220, sy); ctx.clip(); for (let i = -5; i < 10; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : (P.col || TEAL); ctx.fillRect(-210 + i * 48, sy - 10, 48, 60); } ctx.restore(); seg(-210, sy, 220, sy); ol(ctx, 5);
      ctx.save(); ctx.translate(-200, sy + 10); ctx.rotate(-1.05); seg(0, -17, 300, -17); ctx.save(); ctx.clip(); for (let i = -1; i < 8; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : (P.col || TEAL); ctx.fillRect(i * 48, -30, 48, 60); } ctx.restore(); seg(0, -17, 300, -17); ol(ctx, 5); ctx.restore();
      ctx.restore(); } });
  /* ---------- SP50: flashback desk rummage (papers fly, desk phone rings) ---------- */
  piece("mess", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const x = P.x ?? 560, top = P.top ?? (GY - 330), w = P.w ?? 640, tS = T(s, P.searchCue, .2, idx), tR = P.ringCue ? T(s, P.ringCue, .3, idx) : 1e9;
      // papers flying out of the drawers
      if (t > tS){ for (let i = 0; i < 14; i++){ const per = 1.4, q = (((t - tS) / per) + rnd(i)) % 1, born = t - tS - q * per; if (born < -per * .2) continue; const sx = x + (i % 2 ? 200 : -200), vx = (rnd(i + 2) - .5) * 700, vy = -700 - rnd(i + 5) * 400;
        const px = sx + vx * q * per, py = top + 120 + vy * q * per + 900 * (q * per) * (q * per); ctx.save(); ctx.translate(px, py); ctx.rotate(q * 9 + i); ctx.globalAlpha *= 1 - q * .4; rr(ctx, -44, -56, 88, 112, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#B9A58E"; for (let k = 0; k < 3; k++) ctx.fillRect(-30, -36 + k * 24, 60, 7); ctx.restore(); } }
      // desk
      rr(ctx, x - w / 2, top, w, 36, 8); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 6); rr(ctx, x - w / 2 + 20, top + 36, w - 40, GY - top - 36, 6); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 5);
      const open = t > tS ? 1 : 0; [-1, 1].forEach(d => { for (let r = 0; r < 2; r++){ const dx = d * (w / 2 - 130), dy = top + 70 + r * 110, ox = open * (r ? 26 : 50) * Math.abs(Math.sin(t * 3 + r + d)); rr(ctx, x + dx - 100 + ox * d, dy, 200, 90, 6); ctx.fillStyle = "#B97B4A"; ctx.fill(); ol(ctx, 4); rr(ctx, x + dx - 30 + ox * d, dy + 34, 60, 14, 7); ctx.fillStyle = OUT; ctx.fill(); } });
      // closed laptop with "?" note
      rr(ctx, x - 120, top - 22, 240, 22, 6); ctx.fillStyle = "#5C5650"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.translate(x + 40, top - 60); ctx.rotate(.1); rr(ctx, -34, -34, 68, 68, 4); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 3); textC(ctx, "?", 0, 18, 50, RED, 900); ctx.restore();
      // desk phone
      const ph = t > tR ? Math.sin(t * 50) * 6 : 0; ctx.save(); ctx.translate(x - w / 2 + 110, top + ph * .3); rr(ctx, -70, -60, 140, 60, 12); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.translate(0, -70 - (t > tR ? Math.abs(Math.sin(t * 25)) * 14 : 0)); ctx.rotate(ph * .02); rr(ctx, -80, -20, 160, 34, 16); ctx.fillStyle = "#2F2F36"; ctx.fill(); ol(ctx, 4); ctx.restore();
      if (t > tR){ for (let i = 0; i < 3; i++){ const q = ((t * 1.8) + i / 3) % 1; ctx.strokeStyle = hexA("#FFFFFF", (1 - q) * .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -60, 80 + q * 70, -Math.PI * .85, -Math.PI * .15); ctx.stroke(); } } ctx.restore(); },
    over: (ctx, c, sts, R, P, s, t, idx) => { const tR = P.ringCue ? T(s, P.ringCue, .3, idx) : 1e9; if (t > tR && t < tR + 1.3){ const p = c.toScreen((P.x ?? 560) - (P.w ?? 640) / 2 + 110, (P.top ?? (GY - 330)) - 260); popWord(ctx, "KRIIING!", p[0] + 60, Math.max(300, p[1]), t - tR, { size: 80, rot: -8, hold: 1.3 }); } },
    sfx: (P, s, i, add) => { add(cueT(s, P.searchCue, .2, i), "whoosh"); if (P.ringCue){ add(cueT(s, P.ringCue, .3, i), "ping"); add(cueT(s, P.ringCue, .3, i) + .5, "ping"); } } });
  /* ---------- SP50: call counter + ring waves around a toon's phone ---------- */
  piece("calls", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const st = sts[P.on ?? 0]; if (!st) return; const T0 = tOf(s, P, .1, idx); if (t < T0) return; const h = handOf(st);
      for (let i = 0; i < 3; i++){ const q = ((t * 2) + i / 3) % 1; ctx.strokeStyle = hexA("#FFFFFF", (1 - q) * .9); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(h[0], h[1] - 60, 60 + q * 80, -Math.PI * .9, -Math.PI * .1); ctx.stroke(); } },
    over: (ctx, c, sts, R, P, s, t, idx) => { const T0 = tOf(s, P, .1, idx); if (t < T0) return; const n = Math.min(P.max || 9, (P.from || 2) + Math.floor((t - T0) / (P.every || .7))), k = (t - T0) % (P.every || .7);
      ctx.save(); ctx.translate(540, P.y || 330); const q = 1 + .18 * Math.max(0, 1 - k / .2); ctx.scale(q, q); chip(ctx, (P.text || "PANGGILAN KE-") + n, 0, 0, RED, "#FFFFFF", 50); ctx.restore(); },
    sfx: (P, s, i, add) => { const T0 = tOf(s, P, .1, i); for (let k = 0; k < 6; k++) add(T0 + k * (P.every || .7), "ping"); } });
  /* ---------- SP50: whack-a-task desk ---------- */
  function mole(ctx, h, t, o){ o = o || {}; ctx.save(); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-50, -h + 50); ctx.arc(0, -h + 50, 50, Math.PI, 0); ctx.lineTo(50, 0); ctx.closePath(); ctx.fillStyle = "#9A6B4A"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(0, -h + 74, 28, 20, 0, 0, TAU); ctx.fillStyle = "#E8C6A8"; ctx.fill(); ctx.beginPath(); ctx.arc(0, -h + 64, 9, 0, TAU); ctx.fillStyle = "#E58BA0"; ctx.fill(); ol(ctx, 3);
    if (o.hit){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 20 - 7, -h + 30); ctx.lineTo(d * 20 + 7, -h + 44); ctx.moveTo(d * 20 + 7, -h + 30); ctx.lineTo(d * 20 - 7, -h + 44); ctx.stroke(); }); }
    else [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 20, -h + 38, 8, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(d * 20 + 2, -h + 35, 3, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); });
    if (o.text){ ctx.save(); ctx.translate(0, -h - 30 - ((o.seed || 0) % 2) * 56); ctx.rotate(Math.sin(t * 4 + (o.seed || 0)) * .06); chipW(ctx, o.text, 0, 0, o.col || CREAM, BROWN, 30); ctx.restore(); }
    if (o.note){ ctx.save(); ctx.translate(26, -h + 120); ctx.rotate(-.12); const q = o.note; ctx.scale(q, q); rr(ctx, -54, -50, 108, 100, 4); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#8E6A3A"; for (let k = 0; k < 3; k++) ctx.fillRect(-38, -28 + k * 24, 76 - k * 10, 8); ctx.restore(); }
    ctx.restore(); }
  piece("moles", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const top = P.top ?? (GY - 300), x0 = P.x0 ?? 140, x1 = P.x1 ?? 980, holes = P.holes || [], tN = P.noteCue ? T(s, P.noteCue, .3, idx) : 1e9;
      // desk back edge
      rr(ctx, x0 - 60, top - 30, x1 - x0 + 120, 60, 12); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 6);
      const hitT = []; holes.forEach((hl, i) => { const hx = hl.x ?? lerp(x0 + 60, x1 - 60, i / Math.max(1, holes.length - 1)), tU = T(s, hl.cue, .2, idx), tH = hl.hitCue ? T(s, hl.hitCue, .5, idx) : 1e9;
        ctx.save(); ctx.beginPath(); ctx.ellipse(hx, top, 74, 20, 0, 0, TAU); ctx.fillStyle = "#3A2418"; ctx.fill(); ol(ctx, 4); ctx.restore();
        let up = clamp((t - tU) / .3, 0, 1); let hit = false; if (t > tH){ hit = true; up = 1 - clamp((t - tH - .15) / .3, 0, 1); hitT.push(tH); }
        if (up > 0){ ctx.save(); ctx.beginPath(); ctx.rect(hx - 140, top - 500, 280, 500); ctx.clip(); ctx.translate(hx, top + 4); ctx.scale(1.22, 1.22); const sq = hit && t - tH < .2 ? 1 - Math.sin((t - tH) / .2 * Math.PI) * .3 : 1; ctx.scale(1 + (1 - sq) * .6, sq); mole(ctx, 150 * eBack(up), t, { text: hl.text, hit, seed: i, note: hl.keep && t > tN ? eBack(clamp((t - tN - i * .2) / .3, 0, 1)) : 0, col: hl.keep ? "#F6D36B" : CREAM }); ctx.restore(); }
        if (hit && t > tH + .4){ const q = eBack(clamp((t - tH - .4) / .35, 0, 1)); ctx.save(); ctx.translate(hx, top); ctx.scale(q, q); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -110); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(70, -90); ctx.lineTo(0, -66); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4);
          ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(16, -90); ctx.lineTo(26, -80); ctx.lineTo(44, -100); ctx.stroke(); ctx.restore(); } });
      // desk front
      rr(ctx, x0 - 60, top + 20, x1 - x0 + 120, GY - top, 10); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 6); textC(ctx, P.label || "MEJA ARMAN", (x0 + x1) / 2, top + 110, 40, hexA(CREAM, .8), 900);
      // mallet in the hero's hand: rest forward-down, wind up over the head and slam forward onto the desk
      const st = sts[P.on ?? 0]; if (st){ const h = handOf(st); let a = .5; const hs = holes.map(hl => hl.hitCue ? T(s, hl.hitCue, .5, idx) : 1e9);
        hs.forEach(hT => { const d = t - hT; if (d > -.35 && d < 0) a = lerp(.5, -2.4, easeIO2((d + .35) / .35)); else if (d >= 0 && d < .1) a = lerp(-2.4, -5.15, d / .1); else if (d >= .1 && d < .45) a = lerp(1.13, .5, (d - .1) / .35); });
        ctx.save(); ctx.translate(h[0], h[1]); ctx.scale(-(st.face || 1), 1); ctx.rotate(a); rr(ctx, -10, -10, 22, 120, 8); ctx.fillStyle = "#B07A45"; ctx.fill(); ol(ctx, 5); ctx.translate(0, 120); rr(ctx, -84, -8, 170, 84, 20); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6); ctx.translate(0, 34); ctx.scale(-1, 1); textC(ctx, P.mallet || "BERES", 0, 12, 32, "#FFFFFF", 900, 150); ctx.restore(); } },
    over: (ctx, c, sts, R, P, s, t, idx) => { (P.holes || []).forEach((hl, i) => { if (!hl.hitCue) return; const tH = T(s, hl.hitCue, .5, idx), k = t - tH; if (k < 0 || k > 1) return; const hx = hl.x ?? lerp((P.x0 ?? 140) + 60, (P.x1 ?? 980) - 60, i / Math.max(1, (P.holes.length - 1))), p = c.toScreen(hx, (P.top ?? (GY - 300)) - 250); popWord(ctx, "BERES!", p[0], Math.max(300, p[1]), k, { size: 70, rot: i % 2 ? 6 : -6, hold: 1 }); }); },
    sfx: (P, s, i, add) => { (P.holes || []).forEach(hl => { add(cueT(s, hl.cue, .2, i), "pop"); if (hl.hitCue){ add(cueT(s, hl.hitCue, .5, i), "pop"); add(cueT(s, hl.hitCue, .5, i) + .4, "chime"); } }); if (P.noteCue) add(cueT(s, P.noteCue, .3, i), "whoosh"); } });
  /* ---------- SP50: cardboard standee of the hero at his desk (auto-reply) ---------- */
  piece("standee", {
    back: (ctx, c, sts, R, P, s, t, idx) => { const kk = t - tOf(s, P, .3, idx); if (kk < 0) return; const x = P.x ?? 820, q = eBack(clamp(kk / .55, 0, 1)), a0 = P.actor || {};
      ctx.save(); ctx.translate(x, GY); ctx.rotate((1 - clamp(kk / .55, 0, 1)) * 1.3 + Math.sin(t * 1.4) * .015); ctx.scale(q, q);
      ctx.strokeStyle = "#8E6A3A"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, -300); ctx.lineTo(90, 0); ctx.stroke();
      const sz = P.size || 640, a = Object.assign({}, a0, { x: 0, y: 0, size: sz, face: -1, shadow: false, keys: [] }), st2 = toonState(a, s, t); st2.pose = "hold"; st2.expr = "happy";
      const m = ctx.getTransform(), scl = Math.hypot(m.a, m.b); ctx.save(); ctx.filter = "brightness(0) sepia(1) saturate(3) hue-rotate(-10deg) brightness(.75)"; ctx.translate(-10 * 1, 8); ctx.scale(1.05, 1.03); TT.drawToon(ctx, a, st2, t); ctx.restore();
      ctx.save(); ctx.filter = "saturate(.75) contrast(.95)"; TT.drawToon(ctx, a, st2, t); ctx.restore();
      // sign board held at chest
      const k = sz / 92; ctx.save(); ctx.translate(-14 * k, -46 * k); ctx.rotate(-.04); const sw = 300, sh = 200; rr(ctx, -sw / 2, -sh / 2, sw, sh, 12); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      const L = (P.sign || "SAYA CUTI\ns/d 2 JANUARI\nHUBUNGI LARAS").split("\n"); L.forEach((l, i) => textC(ctx, l, 0, -sh / 2 + 54 + i * 52, 36, i === L.length - 1 ? ORANGE : BROWN, 900, sw - 26)); ctx.restore();
      ctx.restore(); },
    sfx: (P, s, i, add) => { add(tOf(s, P, .3, i), "whoosh"); add(tOf(s, P, .3, i) + .5, "pop"); } });

  /* ---------- RN50: the "old problem" tiger cub ---------- */
  function tigerCub(ctx, t, o){ o = o || {}; const sleep = o.sleep, roar = o.roar || 0, lying = o.lying, OR = o.col || "#F08C2E", ST = "#3A2418";
    ctx.save();
    if (lying){ const br = 1 + Math.sin(t * 2.2) * .03;
      ctx.strokeStyle = OUT; ctx.lineWidth = 24; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(110, -40); ctx.quadraticCurveTo(170, -10, 120, 10); ctx.stroke(); ctx.strokeStyle = OR; ctx.lineWidth = 14; ctx.stroke();
      ctx.save(); ctx.scale(1, br); ctx.beginPath(); ctx.ellipse(20, -62, 125, 62, 0, 0, TAU); ctx.fillStyle = OR; ctx.fill(); ol(ctx, 6);
      ctx.strokeStyle = ST; ctx.lineWidth = 10; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-20 + i * 40, -120); ctx.quadraticCurveTo(-10 + i * 40, -90, -24 + i * 40, -66); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.translate(-95, -70); ctx.rotate(-.1); headT(ctx, 70, t, { sleep: true, OR, ST }); ctx.restore();
      ctx.restore(); return; }
    // tail
    const sw = Math.sin(t * (roar ? 9 : 3)) * .5; ctx.strokeStyle = OUT; ctx.lineWidth = 28; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(70, -50); ctx.quadraticCurveTo(170, -60 + sw * 40, 150 + sw * 30, -190); ctx.stroke(); ctx.strokeStyle = OR; ctx.lineWidth = 17; ctx.stroke();
    // body
    ctx.beginPath(); ctx.ellipse(0, -100, 100, 100, 0, 0, TAU); ctx.fillStyle = OR; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(0, -82, 56, 68, 0, 0, TAU); ctx.fillStyle = "#FFF4E6"; ctx.fill();
    ctx.strokeStyle = ST; ctx.lineWidth = 11; ctx.lineCap = "round"; [-1, 1].forEach(d => { for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(d * 96, -150 + i * 38); ctx.quadraticCurveTo(d * 74, -136 + i * 38, d * 62, -146 + i * 38); ctx.stroke(); } });
    // legs
    [-1, 1].forEach(d => { rr(ctx, d * 40 - 24, -70, 48, 72, 22); ctx.fillStyle = OR; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(d * 40 - 8, -8); ctx.lineTo(d * 40 - 8, 0); ctx.moveTo(d * 40 + 8, -8); ctx.lineTo(d * 40 + 8, 0); ctx.stroke(); });
    // collar + tag
    rr(ctx, -64, -186, 128, 22, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4);
    if (o.label){ ctx.save(); ctx.translate(0, -164); ctx.rotate(Math.sin(t * 3) * .08); ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); const L = String(o.label).split("\n"); rr(ctx, -90, 10, 180, 22 + L.length * 30, 8); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); L.forEach((l, i) => textC(ctx, l, 0, 40 + i * 30, 24, RED, 900, 166)); ctx.restore(); }
    ctx.save(); ctx.translate(0, -250 - (roar ? 8 : 0)); headT(ctx, 86, t, { sleep, roar, OR, ST }); ctx.restore();
    ctx.restore(); }
  function headT(ctx, r, t, o){ const { sleep, roar, OR, ST } = o;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .72, -r * .7, r * .32, 0, TAU); ctx.fillStyle = OR; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(d * r * .72, -r * .7, r * .16, 0, TAU); ctx.fillStyle = "#F2A7A0"; ctx.fill(); });
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = OR; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = ST; [-1, 0, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * r * .3 - r * .08, -r * .98); ctx.lineTo(d * r * .3 + r * .08, -r * .98); ctx.lineTo(d * r * .3, -r * .62); ctx.closePath(); ctx.fill(); });
    [-1, 1].forEach(d => { ctx.strokeStyle = ST; ctx.lineWidth = r * .09; ctx.beginPath(); ctx.moveTo(d * r * .98, -r * .1); ctx.lineTo(d * r * .7, -r * .02); ctx.moveTo(d * r * .96, r * .16); ctx.lineTo(d * r * .72, r * .14); ctx.stroke(); });
    ctx.fillStyle = "#FFF4E6"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * r * .3, r * .42, r * .36, r * .3, 0, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = r * .07; ctx.lineCap = "round";
    if (sleep){ [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * r * .38, -r * .12, r * .16, .2, Math.PI - .2); ctx.stroke(); }); }
    else { [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * r * .38, -r * .16, r * .18, r * .2, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, r * .05); ctx.beginPath(); ctx.arc(d * r * .38, -r * .12, r * .1, 0, TAU); ctx.fillStyle = "#3E8B4A"; ctx.fill(); ctx.beginPath(); ctx.arc(d * r * .38, -r * .12, r * .05, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
      if (roar){ ctx.strokeStyle = OUT; ctx.lineWidth = r * .09; ctx.beginPath(); ctx.moveTo(d * r * .62, -r * .48); ctx.lineTo(d * r * .16, -r * .32); ctx.stroke(); } }); }
    ctx.beginPath(); ctx.moveTo(-r * .12, r * .2); ctx.lineTo(r * .12, r * .2); ctx.lineTo(0, r * .34); ctx.closePath(); ctx.fillStyle = "#E06A7A"; ctx.fill(); ol(ctx, r * .04);
    if (roar){ ctx.beginPath(); ctx.ellipse(0, r * .58, r * .3, r * .26 * roar + r * .06, 0, 0, TAU); ctx.fillStyle = "#6B1E22"; ctx.fill(); ol(ctx, r * .05); ctx.fillStyle = "#FFFFFF"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * r * .2, r * .36); ctx.lineTo(d * r * .12, r * .36); ctx.lineTo(d * r * .16, r * .5); ctx.closePath(); ctx.fill(); }); }
    else { ctx.beginPath(); ctx.moveTo(0, r * .34); ctx.quadraticCurveTo(-r * .12, r * .5, -r * .24, r * .4); ctx.moveTo(0, r * .34); ctx.quadraticCurveTo(r * .12, r * .5, r * .24, r * .4); ctx.stroke(); }
    ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 2.5; [-1, 1].forEach(d => { for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(d * r * .45, r * .36 + k * 8); ctx.lineTo(d * r * 1.15, r * .26 + k * 16); ctx.stroke(); } }); }
  function tigerScale(P, s, t, idx){ let sc = P.s ?? 1; (P.grow || []).forEach(g => { const T0 = tOf(s, g, .4, idx); if (t > T0){ const q = eBack(clamp((t - T0) / .5, 0, 1)); sc = lerp(sc, g.s, q); } });
    if (P.shrinkCue){ const T0 = T(s, P.shrinkCue, .3, idx); if (t > T0) sc = lerp(sc, P.small ?? .45, easeIO2((t - T0) / .9)); } return sc; }
  piece("tiger", {
    spot: (P, s, t, idx) => { const sc = tigerScale(P, s, t, idx); return [P.x ?? 540, (P.y ?? 1320) - 200 * sc, P.camZoom ?? null]; },
    back: (ctx, c, sts, R, P, s, t, idx) => { if (P.layer === "front") return; drawTigerP(ctx, c, P, s, t, idx); },
    front: (ctx, c, sts, R, P, s, t, idx) => { if (P.layer !== "front") return; drawTigerP(ctx, c, P, s, t, idx); },
    over: (ctx, c, sts, R, P, s, t, idx) => { const sc = tigerScale(P, s, t, idx); [P.roarCue].concat((P.grow || []).filter(g => g.roar).map(g => g.cue)).forEach((cu, j) => { if (!cu) return; const k = t - T(s, cu, .4, idx); if (k < 0 || k > 1.2) return;
        const p = c.toScreen((P.x ?? 540) + 120 * sc, (P.y ?? 1320) - 420 * sc); popWord(ctx, "GRRR!", clamp(p[0], 260, 820), Math.max(300, p[1]), k, { size: 96 + j * 12, rot: j % 2 ? 8 : -8, hold: 1.2 }); }); },
    sfx: (P, s, i, add) => { if (P.wakeCue) add(cueT(s, P.wakeCue, .3, i), "ping"); if (P.roarCue){ add(cueT(s, P.roarCue, .4, i), "whoosh"); add(cueT(s, P.roarCue, .4, i) + .1, "pop"); } (P.grow || []).forEach(g => { add(tOf(s, g, .4, i), "whoosh"); if (g.roar) add(tOf(s, g, .4, i) + .1, "pop"); }); if (P.shrinkCue) add(cueT(s, P.shrinkCue, .3, i), "whoosh"); if (P.blanketCue) add(cueT(s, P.blanketCue, .4, i), "chime"); } });
  function drawTigerP(ctx, c, P, s, t, idx){ const x = P.x ?? 540, y = P.y ?? 1320, sc = tigerScale(P, s, t, idx);
    const tW = P.wakeCue ? T(s, P.wakeCue, .3, idx) : (P.awake ? -9 : 1e9), tRo = P.roarCue ? T(s, P.roarCue, .4, idx) : 1e9, tSl = P.sleepCue ? T(s, P.sleepCue, .3, idx) : 1e9, tB = P.blanketCue ? T(s, P.blanketCue, .4, idx) : 1e9;
    const awake = t > tW && t < tSl, roarK = Math.max(...[tRo].concat((P.grow || []).filter(g => g.roar).map(g => tOf(s, g, .4, idx))).map(T0 => (t > T0 && t < T0 + 1.1) ? Math.sin(clamp((t - T0) / 1.1, 0, 1) * Math.PI) : 0));
    const shake = roarK > 0 ? Math.sin(t * 50) * 4 * roarK : 0, hop = t > tW && t < tW + .5 ? Math.sin((t - tW) / .5 * Math.PI) * 60 : 0;
    ctx.save(); ctx.translate(x + shake, y - hop * sc); ctx.scale(sc, sc);
    if (P.glow) glowAt(ctx, 0, -180, 360, RED, .25 + .15 * Math.sin(t * 4));
    if (P.basket){ ctx.beginPath(); ctx.ellipse(0, 0, 190, 40, 0, Math.PI, TAU); ctx.fillStyle = "#7A5A2A"; ctx.fill(); }
    tigerCub(ctx, t, { sleep: !awake, roar: roarK, lying: !awake, label: P.label, col: P.col });
    if (P.basket){ ctx.beginPath(); ctx.moveTo(-200, -60); ctx.quadraticCurveTo(0, 40, 200, -60); ctx.lineTo(170, 10); ctx.quadraticCurveTo(0, 60, -170, 10); ctx.closePath(); ctx.fillStyle = "#C79A5A"; ctx.fill(); ol(ctx, 5);
      ctx.strokeStyle = hexA("#7A5A2A", .7); ctx.lineWidth = 4; for (let k = -6; k <= 6; k++){ ctx.beginPath(); ctx.moveTo(k * 28, -20 + Math.abs(k) * -4); ctx.lineTo(k * 26, 24); ctx.stroke(); } }
    if (t > tB){ const q = eOut(clamp((t - tB) / .6, 0, 1)); ctx.save(); ctx.translate(0, -60 - (1 - q) * 300); ctx.rotate((1 - q) * -.4); ctx.beginPath(); ctx.moveTo(-170, -40); ctx.quadraticCurveTo(0, -110, 170, -40); ctx.lineTo(190, 40); ctx.quadraticCurveTo(0, 0, -190, 40); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = hexA("#FFFFFF", .35); for (let k = -4; k <= 4; k++){ ctx.beginPath(); ctx.arc(k * 36, -30 + Math.abs(k) * 4, 7, 0, TAU); ctx.fill(); } if (P.blanketText) textC(ctx, P.blanketText, 0, 8, 40, "#FFFFFF", 900, 300); ctx.restore(); }
    ctx.restore();
    if (!awake){ for (let i = 0; i < 2; i++){ const q = ((t * .6) + i * .5) % 1; ctx.save(); ctx.globalAlpha *= 1 - q; font(ctx, 900, (40 + q * 20) * Math.max(.6, sc), FAM); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; const zx = x - 120 * sc + q * 60, zy = y - 180 * sc - q * 140; ctx.strokeText("z", zx, zy); ctx.fillText("z", zx, zy); ctx.restore(); } }
    if (roarK > 0){ ctx.save(); ctx.globalAlpha *= roarK; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 7; i++){ const a = -Math.PI / 2 + (i - 3) * .32, r0 = 160 * sc, r1 = r0 + 90 * sc * roarK; const hx = x, hy = y - 250 * sc; ctx.beginPath(); ctx.moveTo(hx + Math.cos(a) * r0, hy + Math.sin(a) * r0); ctx.lineTo(hx + Math.cos(a) * r1, hy + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); } }
  /* ---------- RN50: meeting table in front of the toons ---------- */
  piece("table", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const x = P.x ?? 540, w = P.w ?? 1000, top = P.top ?? 1330; rr(ctx, x - w / 2, top, w, 40, 14); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 6); rr(ctx, x - w / 2 + 30, top + 40, w - 60, GY - top, 8); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 5);
      (P.items || [[-330, "paper"], [300, "cup"]]).forEach(([dx, kind], j) => drawItem2(ctx, kind, x + dx, top + 4, t, { s: .7, col: j % 2 ? CREAM : null })); } });
  /* ---------- RN50: chalkboard flashback (chalk figures + chalk icons drawn line by line) ---------- */
  BG.papan = (ctx, t, o) => { const L = 80, Rr = 1000, Tp = 450, B = 1290;
    ctx.fillStyle = "#E6D3B3"; ctx.fillRect(-2600, -1600, 6400, 4800); ctx.strokeStyle = hexA("#B89A70", .35); ctx.lineWidth = 3; for (let y = -1600; y < 3200; y += 90){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
    rr(ctx, L - 40, Tp - 40, Rr - L + 80, B - Tp + 80, 16); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 7);
    rr(ctx, L, Tp, Rr - L, B - Tp, 6); const g = ctx.createLinearGradient(0, Tp, 0, B); g.addColorStop(0, "#2F5A46"); g.addColorStop(1, "#244A39"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 4);
    ctx.save(); ctx.beginPath(); ctx.rect(L, Tp, Rr - L, B - Tp); ctx.clip(); ctx.fillStyle = hexA("#FFFFFF", .05); for (let i = 0; i < 9; i++){ ctx.beginPath(); ctx.ellipse(L + 60 + rnd(i) * (Rr - L - 120), Tp + 80 + rnd(i + 4) * (B - Tp - 160), 120 + rnd(i + 2) * 120, 40, rnd(i) * 2, 0, TAU); ctx.fill(); } ctx.restore();
    rr(ctx, L + 40, B + 10, Rr - L - 80, 34, 8); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 5);
    [[200, "#FFFFFF"], [260, "#F6D36B"], [330, "#E58BA0"]].forEach(([x, col]) => { rr(ctx, x, B + 2, 50, 16, 6); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3); });
    rr(ctx, 760, B - 14, 130, 40, 8); ctx.fillStyle = "#5B4636"; ctx.fill(); ol(ctx, 4); rr(ctx, 760, B + 14, 130, 14, 4); ctx.fillStyle = "#D8D2C8"; ctx.fill();
    ctx.fillStyle = "#B98454"; ctx.fillRect(-2600, GY - 160, 6400, 2000); ctx.fillStyle = hexA(OUT, .15); ctx.fillRect(-2600, GY - 160, 6400, 10);
    for (let i = 0; i < 14; i++){ const q = ((t * .12) + rnd(i)) % 1; ctx.fillStyle = hexA("#FFFFFF", .35 * (1 - q)); ctx.beginPath(); ctx.arc(L + rnd(i + 3) * (Rr - L), B - 40 + q * 220, 3 + rnd(i) * 3, 0, TAU); ctx.fill(); } };
  function chalkPath(ctx, kind){ ctx.beginPath();
    if (kind === "gear"){ for (let i = 0; i <= 16; i++){ const a = i / 16 * TAU, r = i % 2 ? 80 : 104; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.moveTo(34, 0); ctx.arc(0, 0, 34, 0, TAU); }
    else if (kind === "cal"){ ctx.rect(-110, -90, 220, 190); ctx.moveTo(-110, -40); ctx.lineTo(110, -40); for (let q = 1; q < 4; q++){ ctx.moveTo(-110 + q * 55, -40); ctx.lineTo(-110 + q * 55, 100); } ctx.moveTo(-110, 30); ctx.lineTo(110, 30); ctx.moveTo(-60, -120); ctx.lineTo(-60, -70); ctx.moveTo(60, -120); ctx.lineTo(60, -70); }
    else if (kind === "check"){ ctx.moveTo(-100, 0); ctx.lineTo(-30, 70); ctx.lineTo(110, -90); }
    else if (kind === "arrow"){ ctx.moveTo(-170, 60); ctx.bezierCurveTo(-60, 60, 0, -40, 150, -60); ctx.moveTo(110, -100); ctx.lineTo(150, -60); ctx.lineTo(100, -20); }
    else if (kind === "heart"){ ctx.moveTo(0, 60); ctx.bezierCurveTo(-130, -20, -60, -110, 0, -40); ctx.bezierCurveTo(60, -110, 130, -20, 0, 60); } }
  piece("kapur", {
    back: (ctx, c, sts, R, P, s, t, idx) => { const L = 80, Rr = 1000, Tp = 450, B = 1290; ctx.save(); ctx.beginPath(); ctx.rect(L, Tp, Rr - L, B - Tp); ctx.clip();
      (P.items || []).forEach((it, i) => { const T0 = tOf(s, it, .3, idx), O = it.outCue ? T(s, it.outCue, .3, idx) : 1e9; if (t < T0 || t > O + .5) return; const q = clamp((t - T0) / .9, 0, 1), qo = clamp((t - O) / .5, 0, 1);
        ctx.save(); ctx.globalAlpha *= .92 * (1 - qo); ctx.translate((it.x ?? 540) + (it.drift ? (t - T0) * it.drift : 0), (it.y ?? 700) + Math.sin(t * 2 + i) * 3); ctx.scale(it.s || 1, it.s || 1); 
        chalkPath(ctx, it.kind); ctx.setLineDash([2400, 2400]); ctx.lineDashOffset = 2400 * (1 - q); ctx.strokeStyle = it.col || "#F4F1E8"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(); ctx.setLineDash([]);
        if (it.label && q > .6){ ctx.globalAlpha *= clamp((q - .6) / .3, 0, 1); font(ctx, 800, 40, FAM); ctx.fillStyle = it.col || "#F4F1E8"; ctx.textAlign = "center"; ctx.fillText(it.label, 0, 150); ctx.textAlign = "left"; } ctx.restore(); });
      (P.puppets || []).forEach((a0, j) => { const a = Object.assign({ shadow: false }, a0), st = toonState(a, s, t), jit = Math.floor(t * 8);
        ctx.save(); ctx.globalAlpha *= .86; ctx.translate((rnd(jit + j * 7) - .5) * 4, (rnd(jit + 3 + j) - .5) * 4); ctx.filter = "grayscale(1) brightness(1.9) contrast(.55)"; TT.drawToon(ctx, a, Object.assign({}, st, { say: null }), t); ctx.restore(); });
      ctx.restore();
      // chalk in a hand at the board edge (draws the newest item)
      const its = (P.items || []).map(it => ({ it, T0: tOf(s, it, .3, idx) })).filter(o => t > o.T0 && t < o.T0 + .9); if (its.length){ const o = its[its.length - 1], q = (t - o.T0) / .9; ctx.save(); ctx.translate((o.it.x ?? 540) + Math.cos(q * 9) * 90 * (o.it.s || 1), (o.it.y ?? 700) + Math.sin(q * 7) * 70 * (o.it.s || 1)); ctx.rotate(-.6); rr(ctx, -9, -40, 18, 80, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.restore(); } },
    sfx: (P, s, i, add) => { (P.items || []).forEach(it => add(tOf(s, it, .3, i), "whoosh")); } });
  /* ---------- RN50: distance arrows between colleagues / slow progress bar ---------- */
  piece("gap", {
    front: (ctx, c, sts, R, P, s, t, idx) => { const k = t - tOf(s, P, .3, idx); if (k < 0) return; const A = sts[P.a ?? 1], B = sts[P.b ?? 2]; if (!A || !B) return; const ya = P.y ?? 1180, q = eOut(clamp(k / .5, 0, 1));
      const x0 = A.x + 110, x1 = B.x - 110; if (x1 - x0 < 60) return; ctx.save(); ctx.globalAlpha *= q; arrowLine(ctx, (x0 + x1) / 2, ya, x1, ya, RED, 10, 1); arrowLine(ctx, (x0 + x1) / 2, ya, x0, ya, RED, 10, 1);
      chipW(ctx, P.text || "JAGA JARAK", (x0 + x1) / 2, ya - 70, RED, "#FFFFFF", 30); ctx.restore(); },
    sfx: (P, s, i, add) => add(tOf(s, P, .3, i), "whoosh") });
  piece("progress", {
    over: (ctx, c, sts, R, P, s, t, idx) => { const k = t - tOf(s, P, .3, idx); if (k < 0) return; const q = eBack(clamp(k / .4, 0, 1)), y = P.y ?? 330, w = 640, p = Math.min(.32, .04 + k * .04) + Math.sin(t * 2) * .004;
      ctx.save(); ctx.translate(540, y); ctx.scale(q, q); rr(ctx, -w / 2 - 20, -62, w + 40, 124, 20); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); textC(ctx, P.text || "PROGRES TIM", -w / 2 + 120, -18, 30, "#FFFFFF", 900); textC(ctx, "lambat...", w / 2 - 80, -18, 28, GOLD, 800);
      rr(ctx, -w / 2, 4, w, 36, 18); ctx.fillStyle = "#33415F"; ctx.fill(); rr(ctx, -w / 2, 4, w * p, 36, 18); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); },
    sfx: (P, s, i, add) => add(tOf(s, P, .3, i), "pop") });

  /* ================= master scene ================= */
  function master(ctx, th, s, t){
    const idx = G.scene, { F } = shotOf(s, t), spots = {};
    for (const k in PIECES){ if (F[k] && PIECES[k].spot) spots[k] = () => PIECES[k].spot(F[k], s, t, idx); }
    const run = (hook, c, sts, R, j) => { for (const k in PIECES){ const P = R.f[k], fn = PIECES[k][hook]; if (P && fn){ ctx.save(); fn(ctx, c, sts, R, P, s, t, idx, j); ctx.restore(); } } };
    base(ctx, s, t, { spots,
      back: (c2, c, sts, R) => run("back", c, sts, R),
      over1: (c2, c, sts, j, R) => run("over1", c, sts, R, j),
      front: (c2, c, sts, R) => run("front", c, sts, R),
      over: (c2, c, sts, R) => run("over", c, sts, R) }); }
  function masterSfx(s, f, i, add){ sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { for (const k in PIECES){ if (F[k] && PIECES[k].sfx && (F === f || F[k] !== f[k])) PIECES[k].sfx(F[k], s, i, add); } }); }
  [["impian", "Cerita: foto impian buram di dinding jadi tajam setelah diberi angka & tenggat"],
   ["belok", "Cerita: amplop TABUNGAN menipis, uang terbang ke toko DISKON & warung makan, ngengat keluar dari amplop kosong"],
   ["bagi", "Cerita: balok Rp18 JUTA retak jadi 36 ubin bulanan, satu ubin ke tangan"],
   ["hari", "Cerita: dua belas matahari kecil jatah cuti berdebu di rak, lalu bangun & bersorak"],
   ["sawah", "Cerita: saung di tepi sawah, pikiran melayang ke kantor lalu kembali PLOP"],
   ["lencana", "Cerita: lencana MENTOR disematkan, karyawan baru datang dengan buku catatan raksasa"],
   ["kenapa", "Cerita: tanda tanya KENAPA? terbang dari karyawan baru dan mengetuk kepala mentor"],
   ["rautan", "Cerita: imajinasi rautan pensil raksasa, pensil PAHAM jadi runcing bercahaya"],
   ["kepiting", "Cerita: ponsel di pasir pantai tumbuh kaki kepiting dan mencapit (atau ditenangkan papan cuti)"],
   ["cari", "Cerita: kilas balik meja kosong dibongkar, kertas beterbangan, telepon meja berdering"],
   ["tuntas", "Cerita: meja tugas pukul-tikus, tugas dipukul palu BERES, sisanya diberi catatan"],
   ["serah", "Cerita: serah terima map, papan kardus diri sendiri menjawab tamu (pesan otomatis)"],
   ["macan", "Cerita: anak macan masalah lama tidur di keranjang rapat, dibangunkan sindiran"],
   ["kapur", "Cerita: kilas balik gambar kapur di papan tulis (minta maaf, jadwal, proyek lancar)"],
   ["ungkit", "Cerita: macan masalah lama membesar tiap diungkit, tim menjauh, progres lambat"],
   ["damai", "Cerita: macan mengecil jadi tidur berselimut SELESAI, papan rencana baru"],
   ["adegan", "Cerita: adegan + efek (benda di tangan, chip, kata pop, langkah, konfeti, potong shot)"]].forEach(([n, l]) => TT.scene(PX + n, l, master, masterSfx));
})();
