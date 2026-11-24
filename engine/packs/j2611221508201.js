/* Scene pack j2611221508201: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for KD45, JS45, SC45, MS45, SB46.
   Layout prefix j2611221508201_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front, shots[]) plus shared extras (base()):
     hold [{on, kind, at|cue, outCue, s, dx, dy, text, col}]  object in a toon's hand
     pops [{text, cue}] big outlined word · stamps [{text, cue, col}] · chips [{text, cue, outCue, x, y}] screen chips
     steps [{text, cue}] numbered action pills · confetti {cue} · bg <name> custom world background · shots [] cut to another set-up
   Scenes (each one born from its own story):
     _draf      KD45 office: the AI prompt pops a raw clay lump "DRAF" out of the laptop onto the desk
     _prasasti  KD45 the draft as a clay tablet on an easel: wrong day/place crack red, stiff words get a top hat + frost; later re-carved
     _tembikar  KD45 imagination potter's studio: rough AI clay on a wheel, chips FAKTA / GAYA / KONTEKS shape it into a fine vase
     _lobi      JS45 office atrium with a mezzanine ledge of flower pots: pot falls & shatters / shards swept / rail fitted, heavy pot lowered
     _wasit     JS45 imagination night stadium: referee Rizal shows a yellow card to a sweating flower pot, red card looms
     _ubin      JS45 office sidewalk: a loose paving tile rocks under Bu Ratna's step
     _tokoemas  SC45 gold shop counter: school-fee envelope swapped for a small gold bar
     _turun     SC45 home at night: a giant red arrow crashes down, school bill slides under the door, gold bar sold back as fewer notes
     _yoyo      SC45 office pantry: Bu Ani's giant gold yo-yo "HARGA EMAS" bounces up and down, Hendra's eyes follow it
     _tumbuh    SC45 home: daughter Nadia grows from schoolgirl to graduate while the locked gold box sits quietly on the shelf
     _alarm     MS45 office: alarm bell rings, red light pulses, lift doors; Pak Bowo stops Dinda, big X on the lift;
                the green running-man exit sign comes alive ("Si Hijau") and hops out to lead the way
     _evakuasi  MS45 corridor with green arrows -> stairwell -> assembly point in the yard (shots)
     _gelap     MS45 imagined dark smoky corridor of identical doors, then daylight walk-through with check marks
     _mal       MS45 Sunday at a shopping mall atrium: green sign, emergency door, family
     _apel      SB46 Monday stand-up huddle: colleagues hide behind laptops, Arif raises his hand under a spotlight
     _pikul     SB46 imagination market street: bamboo shoulder pole (pikulan), baskets fill with RUANGAN / PEMBICARA / KONSUMSI
     _tahap     SB46 sunset hill path: three stages, baskets and Arif grow a little at each stage
     _kelas     SB46 training room: air conditioner dies (smoke, heat), move to the cool room next door
     _adegan    generic shot with extras */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221508201_";
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


  /* ================= extra hand-held objects ================= */
  function goldBar(ctx, w, t){ const h = w * .42; ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.lineTo(w * .36, -h); ctx.lineTo(-w * .36, -h); ctx.closePath();
    const g = ctx.createLinearGradient(-w / 2, -h, w / 2, 0); g.addColorStop(0, "#FFE79A"); g.addColorStop(.5, "#F2BF3A"); g.addColorStop(1, "#C98A1B"); ctx.fillStyle = g; ctx.fill(); ol(ctx, Math.max(3, w * .04));
    ctx.beginPath(); ctx.moveTo(-w * .3, -h * .82); ctx.lineTo(w * .3, -h * .82); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = Math.max(2, w * .03); ctx.stroke();
    const sh = ((t || 0) * .7) % 1.6 - .3; ctx.save(); ctx.clip(); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.beginPath(); ctx.moveTo(-w / 2 + sh * w, 0); ctx.lineTo(-w / 2 + sh * w + w * .12, 0); ctx.lineTo(-w / 2 + sh * w + w * .3, -h); ctx.lineTo(-w / 2 + sh * w + w * .18, -h); ctx.closePath(); ctx.fill(); ctx.restore();
    textC(ctx, "EMAS", 0, -h * .3, w * .17, "#8E5A1E", 900, w * .6); ctx.restore(); }
  function envelope(ctx, w, txt, col){ const h = w * .62; rr(ctx, -w / 2, -h, w, h, 8); ctx.fillStyle = col || "#F3E3C3"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(0, -h * .45); ctx.lineTo(w / 2, -h); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    if (txt){ const L = lines2(ctx, txt, w * .8, w * .13, 900); font(ctx, 900, L.size, FAM); ctx.fillStyle = RED; ctx.textAlign = "center"; L.L.forEach((l, i) => ctx.fillText(l, 0, -h * .3 + (i - (L.L.length - 1)) * L.size * 1.05 + L.size * .35)); ctx.textAlign = "left"; } }
  function laptopShape(ctx, w, open){ const h = w * .66; rr(ctx, -w / 2, -h, w, h, 12); ctx.fillStyle = "#5C5650"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -h / 2, w * .07, 0, TAU); ctx.fillStyle = hexA(ORANGE, .9); ctx.fill();
    rr(ctx, -w * .56, -6, w * 1.12, 16, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); }
  function card(ctx, col, w, txt){ const h = w * 1.38; ctx.save(); ctx.rotate(.12); rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .35); rr(ctx, -w / 2 + 8, -h + 8, w * .3, h - 16, 6); ctx.fill(); if (txt) textC(ctx, txt, 0, -h / 2 + 10, w * .2, OUT, 900, w * .85); ctx.restore(); }
  function drawItem2(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1;
    const K = { vase: 1, chisel: 1, envelope: 1, goldbar: 1, laptop: 1, broom: 1, megaphone: 1, folder: 1, ycard: 1, fan: 1, cash2: 1, tablet: 1 };
    if (!K[kind]) return drawItem(ctx, kind, x, y, t, o);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "vase"){ ctx.translate(0, 40); vase(ctx, t, { h: 230, rough: 0, neck: 1, swirl: 1, band: 1, R0: 70 }); }
    else if (kind === "chisel"){ ctx.rotate(-.7 + Math.sin(t * 9) * .12); rr(ctx, -14, -150, 28, 110, 10); ctx.fillStyle = "#A0522D"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-8, -40); ctx.lineTo(8, -40); ctx.lineTo(4, 30); ctx.lineTo(-4, 30); ctx.closePath(); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "envelope"){ ctx.rotate(-.12); envelope(ctx, 200, o.text, o.col); }
    else if (kind === "goldbar"){ ctx.translate(0, -10); goldBar(ctx, 170, t); glowAt(ctx, 0, -40, 160, GOLD, .25 + .1 * Math.sin(t * 5)); }
    else if (kind === "laptop"){ ctx.translate(0, o.lift || 0); laptopShape(ctx, 260, true); }
    else if (kind === "broom"){ ctx.rotate(.35 + Math.sin(t * 7) * .25); rr(ctx, -8, -300, 16, 330, 6); ctx.fillStyle = "#B07A45"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.moveTo(-14, 20); ctx.lineTo(14, 20); ctx.lineTo(70, 130); ctx.lineTo(-70, 130); ctx.closePath(); ctx.fillStyle = "#E3C16F"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 3; for (let k = -3; k <= 3; k++){ ctx.beginPath(); ctx.moveTo(k * 4, 30); ctx.lineTo(k * 16, 126); ctx.stroke(); } }
    else if (kind === "megaphone"){ ctx.rotate(-.25); ctx.beginPath(); ctx.moveTo(-10, -40); ctx.lineTo(110, -90); ctx.lineTo(110, 30); ctx.lineTo(-10, -10); ctx.closePath(); ctx.fillStyle = "#F0F0EA"; ctx.fill(); ol(ctx, 5); rr(ctx, -40, -42, 40, 34, 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); rr(ctx, -22, -10, 18, 50, 6); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "folder"){ ctx.rotate(-.08); rr(ctx, -120, -170, 240, 180, 12); ctx.fillStyle = o.col || ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -120, -190, 90, 30, 8); ctx.fill(); ol(ctx, 4); textC(ctx, o.text || "PROYEK", 0, -70, 32, "#FFFFFF", 900, 200); }
    else if (kind === "ycard"){ card(ctx, o.col || "#F6C343", 120, o.text); }
    else if (kind === "fan"){ ctx.rotate(Math.sin(t * 16) * .45); rr(ctx, -60, -170, 120, 160, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++) ctx.fillRect(-40, -150 + i * 30, 80, 8); }
    else if (kind === "cash2"){ const n = o.n ?? 2; for (let i = 0; i < n; i++) bill(ctx, -10 + i * 16, -30 - i * 7, -.4 + i * .3 + Math.sin((t || 0) * 3 + i) * .03, i % 2 ? "#E58BA0" : "#7FB7A0", ""); }
    else if (kind === "tablet"){ ctx.rotate(-.1); rr(ctx, -110, -150, 220, 160, 14); ctx.fillStyle = "#3B3530"; ctx.fill(); ol(ctx, 5); rr(ctx, -96, -138, 192, 136, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-76, -118 + k * 34, 100 + k * 20, 12); }
    ctx.restore(); }

  /* ================= KD45: clay draft ================= */
  function clayLump(ctx, w, h, t, o){ o = o || {}; ctx.save(); ctx.beginPath(); const N = 40;
    for (let i = 0; i <= N; i++){ const a = i / N * TAU, r = 1 + .07 * Math.sin(a * 5 + 1.3) + .04 * Math.sin(a * 9); const x = Math.cos(a) * w / 2 * r; let y = -h / 2 - Math.sin(a) * h / 2 * r; y = Math.min(y, 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); const g = ctx.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, "#C9A17C"); g.addColorStop(1, "#9C7352"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = hexA("#FFFFFF", .25); ctx.beginPath(); ctx.ellipse(-w * .18, -h * .72, w * .16, h * .08, -.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#7C5638"; ctx.lineWidth = Math.max(3, w * .02); ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(-w * .28, -h * (.22 + k * .14)); ctx.lineTo(w * (.12 + k * .08), -h * (.22 + k * .14)); ctx.stroke(); }
    if (o.label) textC(ctx, o.label, 0, -h * .7, w * .16, "#FFF4E6", 900, w * .7); ctx.restore(); }
  function vase(ctx, t, o){ const h = o.h || 300, R0 = o.R0 || 110, rough = o.rough ?? 0, neck = o.neck || 0, spin = t * 7;
    const rad = u => { let r = R0 * (.72 + .38 * Math.sin(Math.min(1, u) * Math.PI * .92)); r *= 1 - neck * .5 * clamp((u - .62) / .3, 0, 1); if (u > .93) r += neck * R0 * .28 * (u - .93) / .07;
      r += rough * R0 * (.12 * Math.sin(u * 19 + spin) + .07 * Math.sin(u * 41 - spin * 1.3)); return Math.max(R0 * .2, r); };
    const pts = []; const N = 36; for (let i = 0; i <= N; i++){ const u = i / N; pts.push([rad(u), -u * h]); }
    ctx.save(); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); for (let i = N; i >= 0; i--) ctx.lineTo(-pts[i][0], pts[i][1]); ctx.closePath();
    const g = ctx.createLinearGradient(-R0, 0, R0, 0); g.addColorStop(0, "#9E623A"); g.addColorStop(.45, "#D69A68"); g.addColorStop(1, "#8E5530"); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip();
    for (let k = 0; k < 7; k++){ const yy = -h * (.1 + k * .13); ctx.strokeStyle = hexA("#6B3F22", .25 * (1 - neck * .6)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-R0 * 1.5, yy + Math.sin(spin + k) * 3); ctx.lineTo(R0 * 1.5, yy - Math.sin(spin + k) * 3); ctx.stroke(); }
    if (o.swirl > 0){ ctx.globalAlpha = clamp(o.swirl, 0, 1); ctx.fillStyle = ORANGE; ctx.fillRect(-R0 * 1.6, -h * .56, R0 * 3.2, h * .12); ctx.strokeStyle = CREAM; ctx.lineWidth = 6;
      ctx.beginPath(); for (let x = -R0 * 1.6; x < R0 * 1.6; x += 6){ const y = -h * .5 + Math.sin(x * .06 + spin) * h * .035; x === -R0 * 1.6 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.globalAlpha = 1; }
    if (o.band > 0){ ctx.globalAlpha = clamp(o.band, 0, 1); ctx.fillStyle = TEAL; ctx.fillRect(-R0 * 1.6, -h * .8, R0 * 3.2, h * .06); ctx.fillStyle = GOLD; for (let k = -6; k <= 6; k++){ const x = k * R0 * .28 + ((spin * 12) % (R0 * .28)); ctx.beginPath(); ctx.arc(x, -h * .3, R0 * .06, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
    ctx.fillStyle = hexA("#FFFFFF", .18); ctx.fillRect(-R0 * .45, -h, R0 * .14, h); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.lineJoin = "round"; ctx.stroke();
    if (neck > .2){ ctx.beginPath(); ctx.ellipse(0, -h, rad(1), rad(1) * .22, 0, 0, TAU); ctx.fillStyle = "#6B3F22"; ctx.fill(); ol(ctx, 5); }
    ctx.restore(); }
  function wheel(ctx, x, top, t, spinOn){ ctx.save(); ctx.translate(x, top);
    ctx.fillStyle = "#6E7B82"; ctx.beginPath(); ctx.moveTo(-70, 40); ctx.lineTo(70, 40); ctx.lineTo(120, GY - top); ctx.lineTo(-120, GY - top); ctx.closePath(); ctx.fill(); ol(ctx, 6);
    rr(ctx, -240, 30, 480, 46, 18); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.ellipse(0, 10, 200, 40, 0, 0, TAU); ctx.fillStyle = "#B9C3C8"; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 10, 200, 40, 0, 0, TAU); ctx.clip(); ctx.strokeStyle = hexA(OUT, .3); ctx.lineWidth = 5; for (let k = 0; k < 6; k++){ const a = k / 6 * TAU + t * (spinOn ? 9 : 0); ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(Math.cos(a) * 200, 10 + Math.sin(a) * 40); ctx.stroke(); } ctx.restore();
    ctx.restore(); }
  function studioBG(ctx, t, o){
    ctx.fillStyle = (() => { const g = ctx.createLinearGradient(0, -400, 0, GY); g.addColorStop(0, "#E9CDA6"); g.addColorStop(1, "#D9B184"); return g; })(); ctx.fillRect(-2600, -1400, 6400, GY + 1400);
    for (let r = 0; r < 14; r++) for (let c = -12; c < 24; c++){ ctx.strokeStyle = hexA("#8E5A35", .12); ctx.lineWidth = 3; ctx.strokeRect(c * 140 + (r % 2) * 70, r * 120 - 300, 140, 60); }
    ctx.save(); rr(ctx, 60, 280, 420, 420, 20); ctx.clip(); ctx.fillStyle = "#BFE3EA"; ctx.fillRect(60, 280, 420, 420); puff(ctx, 140 + (t * 20) % 400, 380, .6); ctx.fillStyle = "#9CC58A"; ctx.fillRect(60, 600, 420, 100); ctx.restore();
    rr(ctx, 60, 280, 420, 420, 20); ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 20; ctx.stroke(); ctx.beginPath(); ctx.moveTo(270, 280); ctx.lineTo(270, 700); ctx.moveTo(60, 490); ctx.lineTo(480, 490); ctx.lineWidth = 10; ctx.stroke();
    ctx.fillStyle = hexA("#FFF1CC", .25); ctx.beginPath(); ctx.moveTo(60, 300); ctx.lineTo(480, 300); ctx.lineTo(980, GY); ctx.lineTo(260, GY); ctx.closePath(); ctx.fill();
    [[700, 520], [700, 800], [-500, 600]].forEach(([sx, sy], r) => { ctx.fillStyle = "#8E5A35"; rr(ctx, sx, sy, 420, 24, 6); ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 4; k++){ ctx.save(); ctx.translate(sx + 60 + k * 100, sy); const hh = 70 + rnd(k + r * 4) * 70; vase(ctx, 0, { h: hh, R0: 26 + rnd(k + 2 + r) * 14, neck: rnd(k + r) > .4 ? 1 : 0, swirl: k % 2, band: (k + r) % 3 === 0 ? 1 : 0 }); ctx.restore(); } });
    // kiln glow on the right
    const kx = 1250; rr(ctx, kx - 150, GY - 620, 300, 620, [60, 60, 0, 0]); ctx.fillStyle = "#A35A3A"; ctx.fill(); ol(ctx, 6); rr(ctx, kx - 90, GY - 420, 180, 150, 20); ctx.fillStyle = "#3A1E12"; ctx.fill(); ol(ctx, 5);
    glowAt(ctx, kx, GY - 345, 220, "#FF8A3A", .35 + .15 * Math.sin(t * 4)); ctx.fillStyle = hexA("#FFB25A", .8 + .2 * Math.sin(t * 7)); rr(ctx, kx - 70, GY - 330, 140, 40, 12); ctx.fill();
    ctx.fillStyle = "#B98454"; ctx.fillRect(-2600, GY - 120, 6400, 1600); ctx.fillStyle = hexA(OUT, .15); ctx.fillRect(-2600, GY - 120, 6400, 10);
    ctx.strokeStyle = hexA(OUT, .1); ctx.lineWidth = 3; for (let y = GY - 60; y < GY + 900; y += 60){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  }
  BG.studio = studioBG;
  function puff(ctx, x, y, s, col){ ctx.fillStyle = col || "rgba(255,255,255,.9)"; [[0, 0, 40], [36, -10, 46], [74, 4, 36], [36, 14, 34]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); }); }

  // _draf: office, the AI prompt pops a raw clay lump out of the laptop
  TT.scene(PX + "draf", "Cerita: draf AI keluar dari laptop sebagai gumpalan tanah liat", (ctx, th, s, t) => {
    const idx = G.scene, D = s.f.draf || {};
    const lx = D.lx ?? 740, ly = D.ly ?? 1205, deskTop = GY - 40 - 290;
    const tType = T(s, D.typeCue, .15, idx), tCount = T(s, D.countCue, .35, idx), tOut = T(s, D.outCue, .5, idx), tLift = T(s, D.liftCue, .75, idx);
    const landX = D.landX ?? 520, landT = tOut + .75;
    let lump = null;
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => {
        // typing glyphs
        if (t > tType && t < tOut){ for (let i = 0; i < 6; i++){ const q = ((t - tType) * 1.6 + i / 6) % 1; ctx.globalAlpha = 1 - q; textC(ctx, ["A", "k", "S", "@", "i", "?"][i], lx - 60 + i * 24 + Math.sin(i * 3) * 10, ly - 20 - q * 160, 34, "#FFFFFF", 900); } ctx.globalAlpha = 1; }
        // counter chip above the laptop
        if (t > tCount && t < tOut + .4){ const n = Math.min(10, Math.floor((t - tCount) / Math.max(.15, (tOut - tCount) / 10)) + 1); popChip(ctx, n + " dtk", lx, ly - 230, t - tCount, NAVY, "#FFFFFF", 40, 0, true); }
        // laptop flash + lump flight
        if (t > tOut - .1 && t < tOut + .8) glowAt(ctx, lx, ly - 60, 320 * (1 - (t - tOut) / .9), "#BFE9FF", .8);
        if (t >= tOut){ const q = clamp((t - tOut) / .75, 0, 1); let x = lerp(lx, landX, q), y = lerp(ly - 60, deskTop, q) - Math.sin(q * Math.PI) * 420, sq = 1;
          if (t > landT){ const k = t - landT; sq = 1 - .25 * Math.exp(-k * 7) * Math.cos(k * 18); x = landX; y = deskTop; }
          if (t > tLift){ const st = R.sts ? null : null; const k = eBack(clamp((t - tLift) / .45, 0, 1)), hp = toonHead(sts[0]); x = lerp(landX, hp[0] + 60, k); y = lerp(deskTop, hp[1] - sts[0].size * .3, k) + Math.sin(t * 6) * 8; }
          lump = [x, y];
          ctx.save(); ctx.translate(x, y); ctx.rotate(t < landT ? (t - tOut) * 5 : 0); ctx.scale(1 / Math.sqrt(sq), sq); clayLump(ctx, 260, 170, t, { label: "DRAF" }); ctx.restore();
          if (t > landT && t < landT + .6) smoke(ctx, x, y, t, 1 - (t - landT) / .6, { n: 5, h: 120, col: "#C9A17C", s: .7 }); }
      },
      over: (ctx2, c, sts, R) => {
        if (t > landT && t < landT + 1.3){ const p = c.toScreen(landX, deskTop - 220); popWord(ctx, "PLOP!", p[0], Math.max(300, p[1]), t - landT, { size: 96, rot: -8, hold: 1.2 }); }
        if (t >= tOut && t < tOut + .9){ burstFx(ctx, ...c.toScreen(lx, ly - 80), t - tOut, "#BFE9FF", 12, 230); }
        if (t > tLift && lump){ const p = c.toScreen(lump[0], lump[1] - 200); if (t - tLift < 2.5) popChip(ctx, "Langsung kirim?", p[0], Math.max(260, p[1]), t - tLift - .3, GOLD, OUT, 40, -.05); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const D = f.draf || {}; const tOut = cueT(s, D.outCue, .5, i); add(cueT(s, D.typeCue, .15, i), "pop"); add(tOut, "whoosh"); add(tOut + .75, "pop"); add(cueT(s, D.liftCue, .75, i), "chime"); });

  // _prasasti: the draft as a clay tablet on an easel (check / re-carve), optional park shot with the walk crowd
  function tabletDraw(ctx, x, y, w, h, t, L, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    // easel legs
    ctx.strokeStyle = "#6B3F22"; ctx.lineWidth = 22; ctx.lineCap = "round"; [[-w * .3, -w * .42], [w * .3, w * .42]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a, 0); ctx.lineTo(b, GY - y); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, GY - y - 40); ctx.stroke();
    ctx.fillStyle = "#6B3F22"; rr(ctx, -w * .55, h / 2 - 10, w * 1.1, 34, 8); ctx.fill(); ol(ctx, 5);
    rr(ctx, -w / 2, -h / 2, w, h, 26); const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, "#DDB892"); g.addColorStop(1, "#C29468"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 7);
    rr(ctx, -w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 16); ctx.strokeStyle = hexA("#7C5638", .5); ctx.lineWidth = 4; ctx.stroke();
    const n = L.length, lh = (h - 70) / n;
    L.forEach((l, i) => { const yy = -h / 2 + 50 + lh * (i + .5), bad = l.bad ?? 0, nw = l.nw ?? 0;
      const txt = nw > .5 ? l.text2 : l.text, size = i === 0 ? 46 : 38;
      ctx.save(); if (nw > 0 && nw < 1){ const sc = nw < .5 ? 1 - nw * 2 : (nw - .5) * 2; ctx.translate(0, yy); ctx.scale(1, Math.max(.05, sc)); ctx.translate(0, -yy); }
      fit(ctx, txt, w - 90, size, 900); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.textAlign = "center"; ctx.fillText(txt, 2, yy + size * .35 + 3);
      ctx.fillStyle = nw > .5 ? "#9A4508" : (bad > 0 ? lerpCol("#5A3A22", RED, clamp(bad, 0, 1)) : "#5A3A22"); ctx.fillText(txt, 0, yy + size * .35); ctx.textAlign = "left";
      if (bad > 0 && nw < .5){ const tw = ctx.measureText(txt).width; ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-tw / 2 - 10, yy + 4); ctx.lineTo(-tw / 2 - 10 + (tw + 20) * clamp(bad * 1.5, 0, 1), yy - 2); ctx.stroke();
        ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tw / 2 + 14, yy - 26); ctx.lineTo(tw / 2 + 4, yy - 6); ctx.lineTo(tw / 2 + 18, yy + 6); ctx.lineTo(tw / 2 + 8, yy + 26); ctx.stroke(); }
      if (nw > .5 && nw < 1.3){ for (let k = 0; k < 6; k++){ const a = k * 1.05 + nw * 3; sparkle(ctx, Math.cos(a) * (w * .32), yy + Math.sin(a) * 20, 12 * (1.3 - nw), GOLD); } }
      ctx.restore(); });
    // stiff formal look: top hat, monocle and icicles
    const stiff = o.stiff || 0;
    if (stiff > 0){ ctx.save(); ctx.globalAlpha *= clamp(stiff, 0, 1); ctx.translate(w * .22, -h / 2 - 10 - (1 - eBack(clamp(stiff, 0, 1))) * 120); ctx.rotate(.12);
      rr(ctx, -70, -130, 140, 130, 8); ctx.fillStyle = "#2B2B33"; ctx.fill(); ol(ctx, 5); rr(ctx, -110, -14, 220, 26, 10); ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; ctx.fillRect(-70, -40, 140, 18); ctx.restore();
      ctx.save(); ctx.globalAlpha *= clamp(stiff, 0, 1); for (let k = 0; k < 9; k++){ const ix = -w / 2 + 40 + k * (w - 80) / 8, L2 = (28 + rnd(k) * 40) * clamp(stiff, 0, 1); ctx.beginPath(); ctx.moveTo(ix - 12, h / 2 - 6); ctx.lineTo(ix + 12, h / 2 - 6); ctx.lineTo(ix, h / 2 - 6 + L2); ctx.closePath(); ctx.fillStyle = "#DDF2FA"; ctx.fill(); ol(ctx, 3); }
      for (let k = 0; k < 5; k++) sparkle(ctx, -w / 2 + rnd(k + 3) * w, -h / 2 + rnd(k + 8) * h, 10 + 6 * Math.sin(t * 5 + k), "#DDF2FA"); ctx.restore(); }
    ctx.restore(); }
  function lerpCol(a, b, q){ const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return "rgb(" + pa.map((v, i) => Math.round(lerp(v, pb[i], q))).join(",") + ")"; }
  function walkBanner(ctx, t, o){ const x0 = o.x0 ?? 120, x1 = o.x1 ?? 960, top = GY - 820;
    [x0, x1].forEach(x => { rr(ctx, x - 16, top, 32, GY - top, 8); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 5); });
    const sw = Math.sin(t * 2) * 8; ctx.beginPath(); ctx.moveTo(x0, top + 20); ctx.quadraticCurveTo((x0 + x1) / 2, top + 60 + sw, x1, top + 20); ctx.lineTo(x1, top + 150); ctx.quadraticCurveTo((x0 + x1) / 2, top + 190 + sw, x0, top + 150); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
    textC(ctx, o.text || "JALAN SEHAT", (x0 + x1) / 2, top + 125 + sw * .8, 70, "#FFFFFF", 900, x1 - x0 - 80);
    for (let i = 0; i < 12; i++){ const q = i / 11, x = lerp(x0, x1, q), y = top + 10 + Math.sin(q * Math.PI) * 30; ctx.fillStyle = [GOLD, TEAL, RED, "#FFFFFF"][i % 4]; ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y); ctx.lineTo(x, y + 44 + Math.sin(t * 4 + i) * 4); ctx.closePath(); ctx.fill(); ol(ctx, 3); } }
  TT.scene(PX + "prasasti", "Cerita: draf sebagai lempeng tanah liat (cek fakta / pahat ulang)", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const P0 = R.f.tablet; if (P0){
          const L = (P0.lines || []).map(l => ({ text: l.text, text2: l.text2, bad: l.badCue ? clamp((t - T(s, l.badCue, .4, idx)) / .5, 0, 1) : 0, nw: l.newCue ? clamp((t - T(s, l.newCue, .5, idx)) / .5, 0, 1.4) : 0 }));
          const stiffOn = P0.stiffCue ? clamp((t - T(s, P0.stiffCue, .6, idx)) / .5, 0, 1) : (P0.stiff || 0), stiffOff = P0.thawCue ? clamp((t - T(s, P0.thawCue, .6, idx)) / .5, 0, 1) : 0;
          const wob = Math.sin(t * 2.2) * .012 * (1 - stiffOn + stiffOff);
          tabletDraw(ctx, P0.x ?? 560, P0.y ?? 700, P0.w ?? 640, P0.h ?? 440, t, L, { rot: wob, stiff: stiffOn * (1 - stiffOff) }); }
        if (R.f.walk) walkBanner(ctx, t, R.f.walk); },
      over: (ctx2, c, sts, R) => { const P0 = R.f.tablet; if (!P0) return;
        (P0.lines || []).forEach((l, i) => { if (!l.fix || !l.badCue) return; const T0 = T(s, l.badCue, .4, idx) + .35, O = l.fixOut ? T(s, l.fixOut, .6, idx) : 1e9; if (t < T0 || t > O) return;
          const n = (P0.lines || []).length, lh = ((P0.h ?? 440) - 70) / n, yy = (P0.y ?? 700) - (P0.h ?? 440) / 2 + 50 + lh * (i + .5), p = c.toScreen((P0.x ?? 560) + (P0.w ?? 640) * .4, yy - 42);
          popChip(ctx, l.fix, p[0], p[1], t - T0, ORANGE, "#FFFFFF", 40, .06); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(sh => { const P0 = sh.tablet; if (!P0) return; (P0.lines || []).forEach(l => { if (l.badCue) add(cueT(s, l.badCue, .4, i), "ping"); if (l.newCue) add(cueT(s, l.newCue, .5, i) + .25, "chime"); }); if (P0.stiffCue) add(cueT(s, P0.stiffCue, .6, i), "pop"); }); });

  // _tembikar: potter's wheel imagination
  TT.scene(PX + "tembikar", "Cerita: imajinasi studio tembikar (draf kasar dibentuk jadi vas)", (ctx, th, s, t) => {
    const idx = G.scene, V = s.f.pot || {}, wx = V.x ?? 650, top = V.top ?? (GY - 420);
    const tK = T(s, V.roughCue, .3, idx), tF = T(s, V.faktaCue, .55, idx), tG = T(s, V.gayaCue, .65, idx), tC = T(s, V.konteksCue, .75, idx), tW = T(s, V.winCue, .9, idx);
    const fly = [[tF, "FAKTA", GREEN], [tG, "GAYA", ORANGE], [tC, "KONTEKS", TEAL]];
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => { wheel(ctx, wx, top, t, true);
        const rise = clamp((t - tK) / .8, 0, 1), h = lerp(150, 330, eOut(rise)), R0 = lerp(130, 105, rise);
        const nf = clamp((t - tF - .45) / .5, 0, 1), sg = clamp((t - tG - .45) / .5, 0, 1), bc = clamp((t - tC - .45) / .5, 0, 1);
        ctx.save(); ctx.translate(wx, top + 10);
        if (t < tK) { clayLump(ctx, 260 + Math.sin(t * 7) * 6, 150, t, { label: "DRAF AI" }); }
        else vase(ctx, t, { h, R0, rough: 1 - nf * .55 - sg * .25 - bc * .2, neck: nf, swirl: sg, band: bc });
        ctx.restore();
        if (t > tW) glowAt(ctx, wx, top - 160, 300, GOLD, .25 + .12 * Math.sin(t * 5));
        // clay spray while shaping
        if (t > tK && t < tW){ for (let i = 0; i < 6; i++){ const q = ((t * 1.7) + i / 6) % 1; ctx.fillStyle = hexA("#9C7352", 1 - q); ctx.beginPath(); ctx.arc(wx + (i % 2 ? 1 : -1) * (120 + q * 160), top - 60 - q * 80 + q * q * 160, 7, 0, TAU); ctx.fill(); } } },
      over: (ctx2, c, sts, R) => { const tgt = c.toScreen(wx, top - 150);
        fly.forEach(([T0, txt, col], j) => { const k = t - T0; if (k < 0) return; if (k < .5){ const q = eOut(k / .5), sx = 200 + j * 340, x = lerp(sx, tgt[0], q), y = lerp(300, tgt[1], q) - Math.sin(q * Math.PI) * 120; popChip(ctx, txt, x, y, .4, col, "#FFFFFF", 44 * (1 - q * .4)); }
          else if (k < 1.1) burstFx(ctx, tgt[0], tgt[1], k - .5, col, 10, 180); });
        if (t > tF) { [["FAKTA", GREEN], ["GAYA", ORANGE], ["KONTEKS", TEAL]].forEach(([txt, col], j) => { const k = t - fly[j][0] - .5; if (k > 0) popChip(ctx, txt, 190 + j * 350, 1240, k, col, "#FFFFFF", 34, 0); }); }
        if (t > tW && t < tW + 1) burstFx(ctx, tgt[0], tgt[1] - 60, t - tW, GOLD, 14, 300); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const V = f.pot || {}; add(cueT(s, V.roughCue, .3, i), "whoosh"); ["faktaCue", "gayaCue", "konteksCue"].forEach((k, j) => { const T0 = cueT(s, V[k], .55 + j * .1, i); add(T0, "whoosh"); add(T0 + .5, "pop"); }); add(cueT(s, V.winCue, .9, i), "chime"); });

  /* ================= JS45: near miss ================= */
  function flowerPot(ctx, s, t, o){ o = o || {}; ctx.save(); ctx.scale(s, s);
    // leaves + flower
    const sw = Math.sin(t * 2.4 + (o.seed || 0)) * .08 + (o.sway || 0);
    ctx.save(); ctx.translate(0, -100); ctx.rotate(sw);
    for (let k = 0; k < 5; k++){ ctx.save(); ctx.rotate(-1 + k * .5); ctx.beginPath(); ctx.ellipse(0, -60, 18, 58, 0, 0, TAU); ctx.fillStyle = k % 2 ? "#4E9A57" : "#3E8B4A"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    ctx.translate(0, -112); for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.ellipse(Math.cos(k) * 20, Math.sin(k) * 20, 16, 16, 0, 0, TAU); ctx.fillStyle = o.flower || "#E05A6A"; ctx.fill(); ol(ctx, 3); } ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(-50, -100); ctx.lineTo(50, -100); ctx.lineTo(38, 0); ctx.lineTo(-38, 0); ctx.closePath(); ctx.fillStyle = o.col || "#C8643B"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -58, -112, 116, 24, 6); ctx.fillStyle = "#B3532F"; ctx.fill(); ol(ctx, 4);
    if (o.face){ const e = o.scared ? 1.35 : 1; [[-18, -62], [18, -62]].forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x, y, 11 * e, 13 * e, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(x + 2, y + 2, 5 / e, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
      ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); if (o.scared){ ctx.moveTo(-14, -30); for (let k = 0; k < 6; k++) ctx.lineTo(-14 + k * 6, -30 + (k % 2 ? -5 : 5)); } else { ctx.arc(0, -36, 10, .2, Math.PI - .2); } ctx.stroke();
      if (o.sweat){ for (let k = 0; k < 2; k++){ const q = ((t * 1.3) + k * .5) % 1; ctx.fillStyle = hexA("#8FD3F4", 1 - q); ctx.beginPath(); ctx.ellipse(46 + k * 10, -80 + q * 60, 6, 9, 0, 0, TAU); ctx.fill(); } } }
    ctx.restore(); }
  function shards(ctx, x, y, k, o){ o = o || {}; const sweep = o.sweep || 0;
    for (let i = 0; i < 8; i++){ const vx = (rnd(i) - .5) * 520, vy = -260 - rnd(i + 4) * 300, d = Math.min(k, .9); let px = x + vx * d * (1 - d * .45), py = y + vy * d + 900 * d * d; py = Math.min(y, py);
      if (o.settled) { px = x + vx * .45; py = y; } px += sweep; ctx.save(); ctx.translate(px, py - 6); ctx.rotate(i + (o.settled ? 0 : k * 8));
      ctx.beginPath(); ctx.moveTo(-18, -8); ctx.lineTo(16, -14); ctx.lineTo(10, 10); ctx.lineTo(-12, 8); ctx.closePath(); ctx.fillStyle = i % 2 ? "#C8643B" : "#B3532F"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    ctx.fillStyle = "#6B4A2E"; ctx.beginPath(); ctx.ellipse(x + sweep, y - 4, 70 + Math.min(k, .4) * 120, 16, 0, 0, TAU); ctx.fill(); }
  function lobiBG(ctx, t, o){ const slab = o.slab ?? 760;
    ctx.fillStyle = "#D6E2DB"; ctx.fillRect(-2600, -1400, 6400, slab + 1400);
    for (let k = -3; k < 6; k++){ const x = k * 480 + 40, y = slab - 420; ctx.save(); rr(ctx, x, y, 340, 320, 12); ctx.clip(); ctx.fillStyle = "#AFD8E3"; ctx.fillRect(x, y, 340, 320); puff(ctx, x + ((t * 18 + k * 90) % 420) - 60, y + 90, .5); ctx.restore(); rr(ctx, x, y, 340, 320, 12); ctx.strokeStyle = "#F5F5F0"; ctx.lineWidth = 16; ctx.stroke();
      const fl = o.wind ? Math.sin(t * 9 + k) * 26 * o.wind : Math.sin(t * 1.5 + k) * 6; ctx.fillStyle = "#E9C9A0"; ctx.beginPath(); ctx.moveTo(x + 10, y + 8); ctx.lineTo(x + 90, y + 8); ctx.quadraticCurveTo(x + 80 + fl, y + 160, x + 90 + fl * 1.6, y + 312); ctx.lineTo(x + 10, y + 312); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
    // slab
    ctx.fillStyle = "#F3F1EA"; ctx.fillRect(-2600, slab, 6400, 70); ctx.fillStyle = "#9AA7A0"; ctx.fillRect(-2600, slab + 70, 6400, 26); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-2600, slab, 6400, 96);
    // glass railing far right
    for (let x = 1150; x < 2600; x += 200){ ctx.fillStyle = hexA("#BFE3EA", .45); ctx.fillRect(x, slab - 170, 200, 170); ctx.strokeStyle = "#8C989E"; ctx.lineWidth = 8; ctx.strokeRect(x, slab - 170, 200, 170); }
    // ground floor wall
    ctx.fillStyle = "#EFE8DA"; ctx.fillRect(-2600, slab + 96, 6400, 1450 - slab - 96 + 10);
    [340, 1180, -500].forEach(x => { ctx.fillStyle = "#E2D8C6"; ctx.fillRect(x - 40, slab + 96, 80, 1450 - slab - 96); ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 4; ctx.strokeRect(x - 40, slab + 96, 80, 1450 - slab - 96); });
    // reception desk
    const rx = o.deskX ?? 980; rr(ctx, rx - 220, 1180, 440, 270, 14); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 5); rr(ctx, rx - 240, 1160, 480, 36, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5); textC(ctx, "LOBI", rx, 1330, 54, hexA("#FFF4E6", .85), 900);
    // floor
    ctx.fillStyle = "#E8DFCF"; ctx.fillRect(-2600, 1450, 6400, 1600); ctx.strokeStyle = hexA(OUT, .1); ctx.lineWidth = 3;
    for (let y = 1450; y < 2600; y += 70){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); } for (let x = -2600; x < 3800; x += 160){ ctx.beginPath(); ctx.moveTo(x, 1450); ctx.lineTo(x + (x - 540) * .4, 2600); ctx.stroke(); }
    ctx.fillStyle = hexA(OUT, .18); ctx.fillRect(-2600, 1450, 6400, 8); }
  BG.lobi = lobiBG;
  function railing(ctx, x0, x1, y, q){ const n = 7; for (let i = 0; i < n; i++){ const k = clamp(q * n - i, 0, 1); if (k <= 0) continue; const x = lerp(x0, x1, i / (n - 1)), h = 150 * eBack(k);
      rr(ctx, x - 9, y - h, 18, h, 6); ctx.fillStyle = "#4B5A62"; ctx.fill(); ol(ctx, 4); }
    const kk = clamp(q * n - n + 1.5, 0, 1); if (kk > 0){ const x2 = lerp(x0, x1, kk); [150, 80].forEach(hh => { rr(ctx, x0 - 14, y - hh - 8, x2 - x0 + 28, 16, 8); ctx.fillStyle = "#5E6E77"; ctx.fill(); ol(ctx, 4); }); } }
  TT.scene(PX + "lobi", "Cerita: lobi kantor dengan balkon pot bunga (jatuh / disapu / dipasang pagar)", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const L = R.f.lobi; if (!L) return; const slab = L.slab ?? 760, xs = L.pots || [150, 430, 700, 980];
        const tCrash = T(s, L.crashCue, .6, idx), tFall = Math.max(T(s, L.fallCue, .3, idx), tCrash - .7), tWind = T(s, L.windCue, .1, idx);
        const tRail = T(s, L.railCue, .5, idx), tLow = T(s, L.lowerCue, .75, idx), tShake = T(s, L.shakeCue, .5, idx);
        xs.forEach((x, i) => { const falling = L.mode === "jatuh" && i === (L.fallIdx ?? 2), heavy = L.mode === "pagar" && i === (L.heavyIdx ?? 1);
          let px = x, py = slab, rot = Math.sin(t * 3 + i) * .02, sc = heavy ? 1.35 : 1;
          if (L.mode === "jatuh" && t > tWind) rot += Math.sin(t * 13 + i) * .05 * (falling ? 1.6 : .6);
          if (L.mode === "sapu" && t > tShake) rot += Math.sin(t * 12 + i) * .06;
          if (falling){ if (t > tFall - .4) { const q = clamp((t - tFall + .4) / .4, 0, 1); rot += q * .5; px += q * 30; }
            if (t > tFall){ const q = clamp((t - tFall) / (tCrash - tFall), 0, 1); px = x + 30 + q * 90; py = lerp(slab, GY, q * q); rot = .5 + q * 3; }
            if (t >= tCrash){ shards(ctx, x + 120, GY, t - tCrash); return; } }
          if (L.mode === "sapu" && i === (L.fallIdx ?? 2)) return;
          if (heavy && t > tLow){ const q = clamp((t - tLow) / 1.6, 0, 1); py = lerp(slab, GY - 10, easeIO(q)); px = lerp(x, x + 140, easeIO(q));
            ctx.strokeStyle = "#8E6A3A"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px, py - 220 * sc); ctx.lineTo(px, -200); ctx.stroke(); }
          ctx.save(); ctx.translate(px, py); ctx.rotate(rot); flowerPot(ctx, sc, t, { seed: i, flower: ["#E05A6A", "#F0A23C", "#B05AE0", "#E05A6A"][i % 4] }); ctx.restore(); });
        if (L.mode === "sapu"){ const tS = T(s, L.sweepCue, .4, idx), q = clamp((t - tS) / 2.2, 0, 1); if (q < 1){ ctx.save(); ctx.globalAlpha *= 1 - clamp((q - .8) / .2, 0, 1); shards(ctx, L.shardX ?? 820, GY, 1, { settled: true, sweep: q * 500 }); ctx.restore(); } }
        if (L.mode === "pagar") railing(ctx, (L.railX0 ?? 60), (L.railX1 ?? 1100), slab, clamp((t - tRail) / 1.4, 0, 1));
        if (L.mode === "jatuh" && t > tWind && t < tCrash + .3){ for (let i = 0; i < 5; i++){ const q = ((t - tWind) * 1.2 + i / 5) % 1; ctx.strokeStyle = hexA("#FFFFFF", .8 * (1 - q)); ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); const y = slab - 260 + i * 40; ctx.moveTo(-200 + q * 1400, y); ctx.quadraticCurveTo(-100 + q * 1400, y - 30, 0 + q * 1400, y); ctx.stroke(); } } },
      over: (ctx2, c, sts, R) => { const L = R.f.lobi; if (!L) return; const tCrash = T(s, L.crashCue, .6, idx);
        if (L.mode === "jatuh" && t > tCrash && t < tCrash + 1.4){ const p = c.toScreen((L.pots || [150, 430, 700, 980])[L.fallIdx ?? 2] + 120, GY - 260); popWord(ctx, "PRAANG!", p[0], Math.max(320, p[1]), t - tCrash, { size: 110, rot: -8, hold: 1.3 }); burstFx(ctx, p[0], p[1] + 200, t - tCrash, ORANGE, 14, 260); }
        if (L.mode === "sapu" && L.shakeCue){ const k = t - T(s, L.shakeCue, .5, idx); if (k > 0 && k < 2.2){ const xs = L.pots || [150, 430, 700, 980]; xs.forEach((x, i) => { if (i === (L.fallIdx ?? 2)) return; const p = c.toScreen(x, (L.slab ?? 760) - 300); popWord(ctx, "!", p[0], p[1], k - i * .12, { size: 90, rot: 0, hold: 2 }); }); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(sh => { const L = sh.lobi; if (!L) return; if (L.crashCue){ add(cueT(s, L.crashCue, .6, i) - .6, "whoosh"); add(cueT(s, L.crashCue, .6, i), "ping"); add(cueT(s, L.crashCue, .6, i) + .05, "pop"); }
    if (L.sweepCue) add(cueT(s, L.sweepCue, .4, i), "whoosh"); if (L.railCue){ const T0 = cueT(s, L.railCue, .5, i); for (let k = 0; k < 7; k++) add(T0 + k * .2, "pop"); } if (L.lowerCue) add(cueT(s, L.lowerCue, .75, i), "whoosh"); if (L.shakeCue) add(cueT(s, L.shakeCue, .5, i), "ping"); }); });

  // _wasit: night stadium imagination, referee shows a yellow card to a sweating flower pot
  function stadionBG(ctx, t, o){
    ctx.fillStyle = (() => { const g = ctx.createLinearGradient(0, -600, 0, 1200); g.addColorStop(0, "#0E1A33"); g.addColorStop(1, "#24365E"); return g; })(); ctx.fillRect(-2600, -1400, 6400, 3000);
    for (let i = 0; i < 40; i++){ ctx.fillStyle = hexA("#FFFFFF", .3 + .4 * Math.abs(Math.sin(t + i))); ctx.beginPath(); ctx.arc(-600 + rnd(i) * 2300, -300 + rnd(i + 5) * 700, 2.5, 0, TAU); ctx.fill(); }
    // stands with crowd
    for (let r = 0; r < 6; r++){ const y = 620 + r * 90; ctx.fillStyle = r % 2 ? "#33415F" : "#2C3955"; ctx.fillRect(-2600, y, 6400, 90);
      for (let i = 0; i < 46; i++){ const x = -900 + i * 70 + (r % 2) * 35, j = Math.abs(Math.sin(t * 6 + i * .7 + r)) * 10 * (o.cheer || .4); ctx.fillStyle = ["#C2691F", "#F6C343", "#E9E2D6", "#5B7DB1", "#D9483B"][(i + r) % 5];
        ctx.beginPath(); ctx.arc(x, y + 40 - j, 18, 0, TAU); ctx.fill(); ctx.fillRect(x - 16, y + 52 - j, 32, 40); } }
    ctx.fillStyle = "#1B2540"; ctx.fillRect(-2600, 1160, 6400, 30);
    // ad boards
    for (let i = -4; i < 9; i++){ rr(ctx, i * 300, 1190, 290, 90, 6); ctx.fillStyle = i % 2 ? ORANGE : "#2F6F73"; ctx.fill(); ol(ctx, 4); textC(ctx, i % 2 ? "FAIR PLAY" : "AMAN", i * 300 + 145, 1250, 40, "#FFFFFF", 900, 250); }
    // floodlights
    [-250, 1330].forEach((x, k) => { ctx.fillStyle = "#4B5A62"; ctx.fillRect(x - 14, 80, 28, 1100); rr(ctx, x - 110, 20, 220, 120, 10); ctx.fill(); ol(ctx, 4);
      for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.arc(x - 70 + (i % 3) * 70, 50 + Math.floor(i / 3) * 55, 20, 0, TAU); ctx.fillStyle = "#FFF6D0"; ctx.fill(); }
      ctx.save(); ctx.globalAlpha = .12 + .03 * Math.sin(t * 2 + k); ctx.fillStyle = "#FFF6D0"; ctx.beginPath(); ctx.moveTo(x - 100, 100); ctx.lineTo(x + 100, 100); ctx.lineTo(540 + (k ? -200 : 200) + 600, GY + 200); ctx.lineTo(540 + (k ? -200 : 200) - 600, GY + 200); ctx.closePath(); ctx.fill(); ctx.restore(); });
    // pitch
    for (let i = -10; i < 20; i++){ ctx.fillStyle = i % 2 ? "#3F8F45" : "#4A9C4F"; ctx.fillRect(i * 160, 1280, 160, 1600); }
    ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-2600, 1330); ctx.lineTo(3800, 1330); ctx.stroke(); ctx.beginPath(); ctx.ellipse(540, 1800, 520, 150, 0, Math.PI, TAU); ctx.stroke(); }
  BG.stadion = stadionBG;
  TT.scene(PX + "wasit", "Cerita: imajinasi stadion, wasit memberi kartu kuning ke pot bunga", (ctx, th, s, t) => {
    const idx = G.scene, Wf = s.f.wasit || {}, tY = T(s, Wf.yellowCue, .3, idx), tR = T(s, Wf.redCue, .75, idx), px = Wf.potX ?? 790;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { if (t > tR){ const q = eOut(clamp((t - tR) / .6, 0, 1)); ctx.save(); ctx.translate(px - 60, lerp(-500, 900, q)); ctx.rotate(-.15 + Math.sin(t * 2) * .03); glowAt(ctx, 0, -220, 420, RED, .35); card(ctx, RED, 300, "KECELAKAAN"); ctx.restore(); } },
      front: (ctx2, c, sts, R) => { const scared = t > tY, k = scared ? 1 : 0; const hop = t > tR ? Math.abs(Math.sin((t - tR) * 9)) * 30 * Math.exp(-(t - tR) * .8) : 0;
        ctx.save(); ctx.translate(px + (t > tR ? Math.sin(t * 50) * 4 : 0), GY - hop); flowerPot(ctx, 3.1, t, { face: true, scared, sweat: scared, seed: 2 });
        ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 130, -180); ctx.lineTo(d * 190, -140 + (scared ? -60 : 0) + Math.sin(t * 8 + d) * 10); ctx.stroke(); }); ctx.restore();
        // yellow card in the referee's raised hand
        if (t > tY){ const st = sts[0], h = handOf(st), q = eBack(clamp((t - tY) / .35, 0, 1)); ctx.save(); ctx.translate(h[0], h[1] + 20); ctx.scale(q, q); glowAt(ctx, 0, -110, 220, GOLD, .4 + .15 * Math.sin(t * 6)); card(ctx, "#F6C343", 120, ""); ctx.restore(); } },
      over: (ctx2, c, sts, R) => { if (t > tY && t < tY + .9){ const st = sts[0], h = handOf(st), p = c.toScreen(h[0], h[1] - 90); burstFx(ctx, p[0], p[1], t - tY, GOLD, 14, 260); }
        if (t > tR && t < tR + .5){ ctx.save(); ctx.globalAlpha = .3 * (1 - (t - tR) / .5); ctx.fillStyle = RED; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Wf = f.wasit || {}; add(cueT(s, Wf.yellowCue, .3, i), "ping"); add(cueT(s, Wf.yellowCue, .3, i) + .1, "chime"); add(cueT(s, Wf.redCue, .75, i), "whoosh"); add(cueT(s, Wf.redCue, .75, i) + .5, "pop"); });

  // _ubin: office front sidewalk, a loose paving tile rocks under a step
  TT.scene(PX + "ubin", "Cerita: trotoar depan kantor, ubin goyang nyaris membuat tersandung", (ctx, th, s, t) => {
    const idx = G.scene, U = s.f.ubin || {}, tx = U.x ?? 560, tStep = T(s, U.stepCue, .2, idx), tFix = T(s, U.fixCue, .9, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { // office facade behind the sidewalk
        ctx.fillStyle = "#E9E2D6"; ctx.fillRect(-900, GY - 900, 2900, 720); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-900, GY - 900, 2900, 720);
        for (let k = -2; k < 6; k++){ rr(ctx, k * 300 + 20, GY - 840, 220, 300, 10); ctx.fillStyle = "#AFD8E3"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .4); ctx.fillRect(k * 300 + 40, GY - 830, 30, 280); }
        rr(ctx, 860, GY - 500, 260, 320, 10); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 5); textC(ctx, "KANTOR", 990, GY - 520, 40, BROWN, 900);
        // sidewalk tiles
        ctx.fillStyle = "#CFC6B6"; ctx.fillRect(-900, GY - 180, 2900, 260); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4;
        for (let x = -900; x < 2000; x += 160){ if (Math.abs(x + 80 - tx) < 10) continue; ctx.strokeRect(x, GY - 180, 160, 130); ctx.strokeRect(x + 80, GY - 50, 160, 130); }
        const k = t - tStep, fixed = t > tFix; let rot = 0; if (!fixed && k > 0) rot = -.32 * Math.exp(-k * 2.2) * Math.cos(k * 14); else if (!fixed) rot = Math.sin(t * 5) * .015;
        ctx.save(); ctx.translate(tx - 80, GY - 50); ctx.rotate(rot); rr(ctx, 0, -130, 160, 130, 4); ctx.fillStyle = fixed ? "#D9D2C4" : "#C9BBA4"; ctx.fill(); ol(ctx, 5);
        if (!fixed){ ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, -100); ctx.lineTo(70, -60); ctx.lineTo(60, -20); ctx.stroke(); } ctx.restore();
        if (fixed){ const q = clamp((t - tFix) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= q; ["#F0A23C", OUT].forEach((col, j) => { ctx.fillStyle = j ? OUT : "#F0A23C"; }); [[-120, 0], [120, 0]].forEach(([dx]) => { ctx.beginPath(); ctx.moveTo(tx + dx - 40, GY - 50); ctx.lineTo(tx + dx + 40, GY - 50); ctx.lineTo(tx + dx, GY - 200); ctx.closePath(); ctx.fillStyle = "#F07C2E"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(tx + dx - 22, GY - 130, 44, 16); }); ctx.restore(); } },
      over: (ctx2, c, sts, R) => { const k = t - tStep; if (k > 0 && k < 1.2){ const p = c.toScreen(tx, GY - 260); popWord(ctx, "TAK!", p[0] + 60, Math.max(320, p[1] - 200), k, { size: 90, rot: 8, hold: 1.1 }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const U = f.ubin || {}; add(cueT(s, U.stepCue, .2, i), "ping"); add(cueT(s, U.fixCue, .9, i), "pop"); });

  /* ================= SC45: gold for the long run ================= */
  function tokoBG(ctx, t, o){
    ctx.fillStyle = (() => { const g = ctx.createLinearGradient(0, -400, 0, GY); g.addColorStop(0, "#5A1E28"); g.addColorStop(1, "#7A2A34"); return g; })(); ctx.fillRect(-2600, -1400, 6400, GY + 1400);
    ctx.strokeStyle = hexA(GOLD, .18); ctx.lineWidth = 3; for (let r = 0; r < 12; r++) for (let c = -8; c < 18; c++){ const x = c * 130 + (r % 2) * 65, y = r * 130 - 300; ctx.beginPath(); ctx.moveTo(x, y - 40); ctx.lineTo(x + 30, y); ctx.lineTo(x, y + 40); ctx.lineTo(x - 30, y); ctx.closePath(); ctx.stroke(); }
    // back shelves with glittering items
    [700, 930].forEach((sy, r) => { ctx.fillStyle = "#3A1218"; rr(ctx, 380, sy, 900, 26, 6); ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 7; k++){ const x = 440 + k * 120, y = sy - 50; ctx.strokeStyle = GOLD; ctx.lineWidth = 9; ctx.beginPath(); if ((k + r) % 2) ctx.ellipse(x, y, 34, 40, 0, 0, TAU); else { ctx.moveTo(x - 36, y - 30); ctx.quadraticCurveTo(x, y + 50, x + 36, y - 30); } ctx.stroke();
        const g = Math.max(0, Math.sin(t * 3 + k * 1.7 + r)); if (g > .6) sparkle(ctx, x + 20, y - 30, 16 * g, "#FFF6D0"); } });
    // lamp glow
    [520, 1060].forEach(x => glowAt(ctx, x, 380, 260, "#FFD98A", .25));
    // floor
    ctx.fillStyle = "#3A1A1A"; ctx.fillRect(-2600, GY - 150, 6400, 1600); ctx.fillStyle = hexA(GOLD, .12); for (let x = -2600; x < 3800; x += 180) ctx.fillRect(x, GY - 150, 90, 1600); }
  BG.toko = tokoBG;
  function counterFront(ctx, x0, x1, top, t){ rr(ctx, x0, top, x1 - x0, GY - top + 20, 10); ctx.fillStyle = hexA("#CFEFF5", .5); ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = "#3A1218"; ctx.fillRect(x0, GY - 140, x1 - x0, 160); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x0, GY - 140, x1 - x0, 160);
    for (let k = 0; k < 5; k++){ const x = x0 + 80 + k * (x1 - x0 - 160) / 4, y = top + 120; ctx.save(); ctx.translate(x, y); goldBar(ctx, 90, t + k); ctx.restore(); ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(x, y + 90, 30, 22, 0, 0, TAU); ctx.stroke(); }
    ctx.fillStyle = hexA("#FFFFFF", .25); ctx.beginPath(); ctx.moveTo(x0 + 40, top + 10); ctx.lineTo(x0 + 110, top + 10); ctx.lineTo(x0 + 20, GY - 150); ctx.lineTo(x0 - 50 + 40, GY - 150); ctx.closePath(); ctx.fill();
    rr(ctx, x0 - 10, top - 18, x1 - x0 + 20, 26, 6); ctx.fillStyle = "#C98A1B"; ctx.fill(); ol(ctx, 5); }
  TT.scene(PX + "tokoemas", "Cerita: toko emas, amplop uang sekolah ditukar emas batangan", (ctx, th, s, t) => {
    const idx = G.scene, E = s.f.toko || {}, top = E.top ?? (GY - 420), x0 = E.x0 ?? 560, x1 = E.x1 ?? 1400;
    const tBuy = T(s, E.buyCue, .3, idx);
    base(ctx, s, t, {
      front: (ctx2, c, sts, R) => { counterFront(ctx, x0, x1, top, t);
        // envelope travels from the customer's hand to the counter, gold bar comes back
        const st = sts[0], h = handOf(st);
        if (t > tBuy){ const q = clamp((t - tBuy) / .7, 0, 1), ex = lerp(h[0], x0 + 200, eOut(q)), ey = lerp(h[1], top - 10, eOut(q)) - Math.sin(q * Math.PI) * 120;
          if (q < 1 || t < tBuy + 1.4){ ctx.save(); ctx.translate(ex, ey); ctx.rotate(-.1 + q * .2); ctx.scale(.8, .8); envelope(ctx, 200, "UANG SEKOLAH"); ctx.restore(); }
          const q2 = clamp((t - tBuy - .9) / .6, 0, 1); if (q2 < 1 && t > tBuy + .5){ const gx = lerp(x0 + 380, h[0], eOut(q2)), gy = lerp(top - 10, h[1], eOut(q2)) - Math.sin(q2 * Math.PI) * 100; ctx.save(); ctx.translate(gx, gy); goldBar(ctx, 150, t); ctx.restore(); glowAt(ctx, gx, gy - 30, 200, GOLD, .4); } } },
      over: (ctx2, c, sts, R) => { if (t > tBuy + 1.4 && t < tBuy + 2.4){ const p = c.toScreen(handOf(sts[0])[0], handOf(sts[0])[1] - 120); burstFx(ctx, p[0], p[1], t - tBuy - 1.4, GOLD, 12, 220); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const E = f.toko || {}, T0 = cueT(s, E.buyCue, .3, i); add(T0, "whoosh"); add(T0 + 1.4, "chime"); });

  // _turun: home at night, a giant red arrow crashes down; bill under the door; gold sold back for fewer notes
  function bigArrow(ctx, h, label){ const w = 160; ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w / 2, -170); ctx.lineTo(w * 1.15, -170); ctx.lineTo(0, 0); ctx.lineTo(-w * 1.15, -170); ctx.lineTo(-w / 2, -170); ctx.closePath();
    ctx.fillStyle = RED; ctx.fill(); ol(ctx, 8); ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fillRect(-w / 2 + 14, -h + 14, 24, h - 200);
    if (label){ ctx.save(); ctx.translate(0, -h * .55); ctx.rotate(-Math.PI / 2); textC(ctx, label, 0, 18, 52, "#FFFFFF", 900, h * .7); ctx.restore(); } }
  TT.scene(PX + "turun", "Cerita: rumah malam, panah merah harga jatuh, tagihan sekolah, emas dijual", (ctx, th, s, t) => {
    const idx = G.scene, A = s.f.turun || {}, ax = A.x ?? 820, tDown = T(s, A.downCue, .2, idx), tBill = T(s, A.billCue, .4, idx), tSell = T(s, A.sellCue, .55, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { // door on the right
        rr(ctx, 930, GY - 620, 300, 620, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(960, GY - 300, 14, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3);
        if (t > tDown){ const q = clamp((t - tDown) / .35, 0, 1), y = lerp(-400, GY + 40, q * q), wob = t - tDown - .35 > 0 ? Math.sin((t - tDown) * 20) * .06 * Math.exp(-(t - tDown - .35) * 3) : 0;
          ctx.save(); ctx.translate(ax, y); ctx.rotate(wob); bigArrow(ctx, 900, "HARGA EMAS"); ctx.restore();
          if (q >= 1){ const k = t - tDown - .35; if (k < 1) smoke(ctx, ax, GY, t, 1 - k, { n: 8, h: 200, col: "#B9A58E", s: 1.2 }); ctx.fillStyle = OUT; for (let j = 0; j < 5; j++){ ctx.save(); ctx.translate(ax - 150 + j * 75, GY + 10); ctx.rotate(j - 2); ctx.fillRect(-20, -5, 40, 10); ctx.restore(); } } }
        // school bill slides under the door
        if (t > tBill){ const q = clamp((t - tBill) / .8, 0, 1), x = lerp(1150, 700, eOut(q)), y = q < 1 ? GY - 8 : GY - 8, lift = clamp((t - tBill - .9) / .5, 0, 1);
          ctx.save(); ctx.translate(x, lerp(y, GY - 620, eBack(lift))); ctx.rotate(lerp(0, -.08, lift) + Math.sin(t * 3) * .03 * lift); const sc = lerp(.5, 1, lift); ctx.scale(sc, sc);
          rr(ctx, -130, -90, 260, 180, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, "TAGIHAN", 0, -36, 40, RED, 900, 220); textC(ctx, "SEKOLAH", 0, 14, 36, BROWN, 900, 220); ctx.fillStyle = "#B9A58E"; rr(ctx, -90, 40, 180, 12, 5); ctx.fill(); ctx.restore(); } },
      front: (ctx2, c, sts, R) => { if (t > tSell){ const st = sts[0], h = handOf(st), q = clamp((t - tSell) / .7, 0, 1);
          if (q < 1){ ctx.save(); ctx.translate(lerp(h[0], 1300, eOut(q)), lerp(h[1], h[1] - 300, q)); ctx.rotate(q * 4); goldBar(ctx, 150, t); ctx.restore(); }
          const q2 = clamp((t - tSell - .8) / .6, 0, 1); if (t > tSell + .8 && q2 < 1){ for (let j = 0; j < 2; j++){ ctx.save(); ctx.translate(lerp(1300, h[0] + j * 20, eOut(q2)), lerp(h[1] - 300, h[1] - j * 10, q2)); bill(ctx, 0, 0, -.3 + j * .4, j ? "#E58BA0" : "#7FB7A0", ""); ctx.restore(); } } } },
      over: (ctx2, c, sts, R) => { if (t > tDown + .3 && t < tDown + 1.5){ const p = c.toScreen(ax, GY - 300); popWord(ctx, "TURUN!", Math.min(820, p[0]), Math.max(320, p[1] - 500), t - tDown - .3, { size: 110, rot: -6, hold: 1.2, col: "#FF6B5B" }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.turun || {}; const tD = cueT(s, A.downCue, .2, i); add(tD, "whoosh"); add(tD + .35, "ping"); add(tD + .36, "pop"); add(cueT(s, A.billCue, .4, i), "whoosh"); add(cueT(s, A.sellCue, .55, i), "whoosh"); add(cueT(s, A.sellCue, .55, i) + .8, "pop"); });

  // _yoyo: giant gold yo-yo "HARGA EMAS" bouncing in the office pantry
  function yoyo(ctx, x, y, r, spin, label){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, "#FFE9A0"); g.addColorStop(1, "#C98A1B"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 7);
    ctx.save(); ctx.rotate(spin); ctx.strokeStyle = hexA("#8E5A1E", .6); ctx.lineWidth = 6; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.arc(0, 0, r * .72, k * Math.PI / 2, k * Math.PI / 2 + .9); ctx.stroke(); } ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r * .42, 0, TAU); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 4); if (label) textC(ctx, label, 0, r * .12, r * .28, "#8E5A1E", 900, r * .8); ctx.restore(); }
  TT.scene(PX + "yoyo", "Cerita: yoyo emas raksasa naik turun, mata Pak Hendra mengikutinya", (ctx, th, s, t) => {
    const idx = G.scene, Y = s.f.yoyo || {}, tGo = T(s, Y.goCue, .2, idx), tWild = T(s, Y.wildCue, .5, idx), tStop = T(s, Y.stopCue, .8, idx);
    let yy = null;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const j = Y.on ?? 1, st = sts[j]; if (!st) return; const h = handOf(st);
        let L = 60; if (t > tGo && t < tStop){ const sp = t > tWild ? 4.2 : 2.6, amp = t > tWild ? 420 : 300; L = 60 + amp * Math.abs(Math.sin((t - tGo) * sp)); } else if (t >= tStop) L = 60 + 40 * Math.abs(Math.sin(t * 1.2));
        const x = h[0] + Math.sin(t * 1.7) * 10, y = h[1] + L; const o = Y.watch ?? 0, sw = sts[o]; if (sw){ const hp = toonHead(sw); sw.look = [clamp((x - hp[0]) / 300, -1, 1) * .9, clamp((y - hp[1]) / 300, -1, 1)]; } },
      mid: (ctx2, c, sts, R) => { const j = Y.on ?? 1, st = sts[j]; if (!st) return; const h = handOf(st);
        let L = 60; if (t > tGo && t < tStop){ const sp = t > tWild ? 4.2 : 2.6, amp = t > tWild ? 420 : 300; L = 60 + amp * Math.abs(Math.sin((t - tGo) * sp)); } else if (t >= tStop) L = 60 + 40 * Math.abs(Math.sin(t * 1.2));
        const x = h[0] + Math.sin(t * 1.7) * 10, y = h[1] + L; yy = [x, y];
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(x, y); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke();
        if (t > tGo && t < tStop){ for (let k = 1; k < 4; k++){ ctx.save(); ctx.globalAlpha = .15; yoyo(ctx, x, y - k * 30 * Math.sign(Math.cos((t - tGo) * 2.6)), 100, 0, ""); ctx.restore(); } }
        yoyo(ctx, x, y, 100, t * 14, "EMAS");
        }, midZ: 2,
      over: (ctx2, c, sts, R) => { if (!yy) return; if (t > tGo && t < tStop){ const p = c.toScreen(yy[0], yy[1]); const up = Math.cos((t - tGo) * (t > tWild ? 4.2 : 2.6)) < 0; outlineWords(ctx, [{ w: up ? "NAIK!" : "TURUN!", hl: true }], Math.min(880, p[0] + 230), Math.max(300, p[1]), 56, { sw: 12, hl: up ? "#6BD08A" : "#FF6B5B" }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Y = f.yoyo || {}; const T0 = cueT(s, Y.goCue, .2, i), T1 = cueT(s, Y.stopCue, .8, i); for (let k = T0; k < T1; k += .6) add(k, "whoosh"); });

  // _tumbuh: daughter grows up while the gold box stays locked on the shelf
  function safeBox(ctx, x, y, w, t, open){ ctx.save(); ctx.translate(x, y); rr(ctx, -w / 2, -w * .85, w, w * .85, 14); ctx.fillStyle = "#4B5A62"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 14, -w * .85 + 14, w - 28, w * .85 - 28, 8); ctx.fillStyle = "#5E6E77"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, -w * .43, w * .16, 0, TAU); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.translate(0, -w * .43); ctx.rotate(Math.sin(t * .8) * .3); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -w * .13); ctx.stroke(); ctx.restore();
    rr(ctx, w * .3, -w * .55, 14, w * .24, 6); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
  function gradCap(ctx, x, y, w, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(0, -w * .22); ctx.lineTo(w / 2, 0); ctx.lineTo(0, w * .22); ctx.closePath(); ctx.fillStyle = "#22252B"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -w * .28, 0, w * .56, w * .2, 6); ctx.fill(); ol(ctx, 4); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(w * .4, w * .05, w * .38, w * .35); ctx.stroke(); ctx.restore(); }
  TT.scene(PX + "tumbuh", "Cerita: anak tumbuh dari siswi sampai wisuda, kotak emas tetap terkunci", (ctx, th, s, t) => {
    const idx = G.scene, G2 = s.f.grow || {}, kid = G2.on ?? 1, sizes = G2.sizes || [470, 610, 730];
    const tA = T(s, G2.teenCue, .35, idx), tB = T(s, G2.gradCue, .55, idx), tDip = T(s, G2.dipCue, .8, idx);
    const years = G2.years || ["2026", "2031", "2036"];
    let stage = t < tA ? 0 : t < tB ? 1 : 2;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const st = sts[kid]; if (st){ const q1 = clamp((t - tA) / .6, 0, 1), q2 = clamp((t - tB) / .6, 0, 1); st.size = lerp(lerp(sizes[0], sizes[1], eBack(q1)), sizes[2], eBack(q2)); }
        // shelf + safe + calendar
        const sx = G2.safeX ?? 900; ctx.fillStyle = "#4E2A17"; rr(ctx, sx - 170, GY - 560, 340, 26, 6); ctx.fill(); ol(ctx, 4); safeBox(ctx, sx, GY - 560, 200, t);
        rr(ctx, sx - 40, GY - 820, 80, 40, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, "EMAS", sx, GY - 790, 22, BROWN, 900);
        const cx = G2.calX ?? 640, cy = GY - 1020; rr(ctx, cx - 110, cy, 220, 230, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; rr(ctx, cx - 110, cy, 220, 60, [10, 10, 0, 0]); ctx.fill(); ol(ctx, 5);
        const flip = [tA, tB].map(T0 => clamp((t - T0) / .4, 0, 1)), yi = stage, fq = stage ? flip[stage - 1] : 1;
        ctx.save(); ctx.translate(cx, cy + 150); ctx.scale(1, Math.max(.05, Math.abs(Math.cos((1 - fq) * Math.PI / 2)))); textC(ctx, years[yi], 0, 24, 64, BROWN, 900); ctx.restore(); },
      over1: (ctx2, c, sts, j, R) => { if (j !== kid || t < tB) return; const st = sts[j], hp = toonHead(st), q = eBack(clamp((t - tB) / .5, 0, 1)); gradCap(ctx, hp[0], hp[1] - st.size * .2 - (1 - q) * 300, st.size * .36, -.08 + Math.sin(t * 2) * .03); },
      over: (ctx2, c, sts, R) => { const sx = G2.safeX ?? 900, p = c.toScreen(sx, GY - 760);
        if (t > tDip){ const k = t - tDip; popChip(ctx, "Tetap disimpan", p[0], Math.max(280, p[1] - 40), k, GREEN, "#FFFFFF", 36, -.04); }
        if (t > tB && t < tB + 1) burstFx(ctx, ...c.toScreen(toonHead(sts[kid])[0], toonHead(sts[kid])[1] - 200), t - tB, GOLD, 14, 260); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const G2 = f.grow || {}; add(cueT(s, G2.teenCue, .35, i), "whoosh"); add(cueT(s, G2.gradCue, .55, i), "chime"); add(cueT(s, G2.dipCue, .8, i), "pop"); });

  /* ================= MS45: evacuation route ================= */
  // Si Hijau: the running man of the green exit sign (pictogram figure). origin = feet; h = height
  function hijau(ctx, x, y, h, t, o){ o = o || {}; const k = h / 200, run = o.run ?? 1, ph = t * (o.speed || 10);
    ctx.save(); ctx.translate(x, y); ctx.scale(k * (o.face || 1), k); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const sw = Math.sin(ph) * run, wave = o.wave ? Math.sin(t * 10) * .5 : 0;
    const limb = (x0, y0, x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 34; ctx.stroke(); ctx.strokeStyle = "#1FA45A"; ctx.lineWidth = 22; ctx.stroke(); };
    const hipY = -86 - Math.abs(Math.sin(ph)) * 8 * run;
    limb(0, hipY, -22 * sw - 8, hipY + 44, -38 * sw - 4, 0); limb(0, hipY, 22 * sw + 8, hipY + 44, 38 * sw + 4, 0);
    ctx.beginPath(); ctx.moveTo(-4, hipY); ctx.lineTo(10, hipY - 70); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 44; ctx.stroke(); ctx.strokeStyle = "#1FA45A"; ctx.lineWidth = 30; ctx.stroke();
    if (o.wave) limb(10, hipY - 62, 44, hipY - 100, 50 + wave * 20, hipY - 150); else limb(10, hipY - 62, 40 * sw + 10, hipY - 30, 56 * sw + 30, hipY - 50);
    limb(10, hipY - 62, -40 * sw - 6, hipY - 34, -52 * sw - 30, hipY - 52);
    ctx.beginPath(); ctx.arc(20, hipY - 104, 24, 0, TAU); ctx.fillStyle = "#1FA45A"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.stroke();
    if (o.eyes !== false){ ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(26, hipY - 108, 5, 0, TAU); ctx.arc(14, hipY - 108, 5, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(20, hipY - 100, 8, .3, Math.PI - .3); ctx.stroke(); }
    ctx.restore(); }
  function exitSign(ctx, x, y, w, t, o){ o = o || {}; const h = w * .45; ctx.save(); ctx.translate(x, y); glowAt(ctx, 0, 0, w * (.9 + .2 * (o.glow || 0)), "#3BE07E", .25 + .35 * (o.glow || 0));
    rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.fillStyle = "#16934C"; ctx.fill(); ol(ctx, 6); rr(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 8); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();
    // door pictogram + arrow
    rr(ctx, w * .1, -h * .32, w * .22, h * .64, 4); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.moveTo(-w * .42, 0); ctx.lineTo(-w * .26, -h * .2); ctx.lineTo(-w * .26, h * .2); ctx.closePath(); ctx.fill(); ctx.fillRect(-w * .3, -h * .06, w * .12, h * .12);
    if (!o.empty){ ctx.save(); ctx.beginPath(); rr(ctx, -w / 2, -h / 2, w, h, 12); ctx.clip(); hijau(ctx, -w * .06, h * .4, h * .78, t, { run: .35, eyes: false, speed: 6 }); ctx.restore(); }
    else { ctx.setLineDash([8, 8]); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 3; ctx.strokeRect(-w * .18, -h * .36, w * .22, h * .72); ctx.setLineDash([]); }
    ctx.restore(); }
  function liftDoors(ctx, x, w, top, bot, t, o){ o = o || {}; ctx.save(); rr(ctx, x - w / 2 - 30, top - 30, w + 60, bot - top + 30, 8); ctx.fillStyle = "#8C989E"; ctx.fill(); ol(ctx, 6);
    const gap = (o.open || 0) * w * .4; [[-1], [1]].forEach(([d]) => { const x0 = d < 0 ? x - w / 2 : x + gap / 2; rr(ctx, d < 0 ? x - w / 2 : x, top, w / 2 - (d < 0 ? gap / 2 : 0) - (d > 0 ? gap / 2 : 0), bot - top, 4); ctx.fillStyle = "#C9D1D5"; ctx.fill(); ol(ctx, 4); });
    ctx.fillStyle = hexA("#FFFFFF", .35); ctx.fillRect(x - w / 2 + 20, top + 10, 18, bot - top - 20); ctx.fillRect(x + 20, top + 10, 18, bot - top - 20);
    rr(ctx, x - 70, top - 110, 140, 60, 8); ctx.fillStyle = "#1E1E24"; ctx.fill(); ol(ctx, 4); textC(ctx, "LIFT", x, top - 66, 34, o.alarm ? "#FF6B5B" : "#FFB25A", 900);
    rr(ctx, x + w / 2 + 50, top + 180, 50, 110, 10); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4); [0, 1].forEach(k => { ctx.beginPath(); ctx.arc(x + w / 2 + 75, top + 212 + k * 46, 13, 0, TAU); ctx.fillStyle = o.pressed && k === 1 ? "#FFB25A" : "#FFFFFF"; ctx.fill(); ol(ctx, 3); });
    ctx.restore(); }
  function alarmBell(ctx, x, y, t, on){ const sh = on ? Math.sin(t * 60) * .12 : 0; ctx.save(); ctx.translate(x, y); ctx.rotate(sh); ctx.beginPath(); ctx.arc(0, 0, 70, Math.PI, TAU); ctx.lineTo(70, 20); ctx.lineTo(-70, 20); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, 30, 16, 0, TAU); ctx.fillStyle = "#BFC6CC"; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (on){ for (let k = 0; k < 3; k++){ const q = ((t * 2.4) + k / 3) % 1; ctx.strokeStyle = hexA(RED, 1 - q); ctx.lineWidth = 7; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x, y, 90 + q * 90, d < 0 ? Math.PI * .8 : -Math.PI * .2, d < 0 ? Math.PI * 1.2 : Math.PI * .2); ctx.stroke(); }); } } }
  function beacon(ctx, x, y, t, on){ rr(ctx, x - 40, y, 80, 30, 6); ctx.fillStyle = "#4B5A62"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(x, y, 38, Math.PI, TAU); ctx.fillStyle = on ? (Math.sin(t * 14) > 0 ? "#FF4B3B" : "#9E1F2C") : "#9E1F2C"; ctx.fill(); ol(ctx, 5);
    if (on){ ctx.save(); ctx.translate(x, y - 20); ctx.rotate(t * 6); ctx.fillStyle = hexA("#FF4B3B", .22); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, -160); ctx.lineTo(900, 160); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  TT.scene(PX + "alarm", "Cerita: alarm kantor, lampu merah, lift disilang, rambu hijau hidup", (ctx, th, s, t) => {
    const idx = G.scene, A = s.f.alarm || {}, tOn = A.onCue ? T(s, A.onCue, .3, idx) : (A.on ? -1 : 1e9), tRed = A.redCue ? T(s, A.redCue, .4, idx) : tOn, tX = T(s, A.xCue, .4, idx);
    const tGlow = T(s, A.glowCue, .6, idx), tAlive = T(s, A.aliveCue, .8, idx), sg = A.sign || { x: 150, y: 860, w: 300 }, lx = A.liftX ?? 900;
    let hj = null;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { // emergency door with the exit sign on the left, lift on the right
        rr(ctx, sg.x - 150, GY - 190 - 480, 300, 480, 8); ctx.fillStyle = "#C9D1D5"; ctx.fill(); ol(ctx, 6); rr(ctx, sg.x - 130, GY - 190 - 460, 260, 460, 6); ctx.fillStyle = "#9E2A2A"; ctx.fill(); ol(ctx, 4);
        rr(ctx, sg.x - 100, GY - 190 - 220, 200, 26, 10); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 3); textC(ctx, "PINTU DARURAT", sg.x, GY - 190 - 380, 26, "#FFFFFF", 900, 230);
        exitSign(ctx, sg.x, sg.y, sg.w, t, { glow: t > tGlow ? .6 + .4 * Math.sin(t * 6) : 0, empty: t > tAlive });
        if (A.lift !== false) liftDoors(ctx, lx, 260, GY - 190 - 520, GY - 190, t, { alarm: t > tOn, pressed: A.pressCue && t > T(s, A.pressCue, .9, idx) });
        if (t > tX){ const q = eBack(clamp((t - tX) / .35, 0, 1)); ctx.save(); ctx.translate(lx, GY - 190 - 260); ctx.scale(q, q); ctx.rotate(-.05); ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 64; ctx.beginPath(); ctx.moveTo(-170, -200); ctx.lineTo(170, 200); ctx.moveTo(170, -200); ctx.lineTo(-170, 200); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 44; ctx.stroke(); ctx.restore(); }
        alarmBell(ctx, A.bellX ?? 560, A.bellY ?? 560, t, t > tOn); beacon(ctx, A.beaconX ?? 380, 420, t, t > tRed);
        // Si Hijau hops out of the sign and stands on the door frame
        if (t > tAlive){ const k = t - tAlive, q = clamp(k / .7, 0, 1), x0 = sg.x - sg.w * .06, y0 = sg.y + sg.w * .18, x1 = A.hopX ?? (sg.x + 230), y1 = A.hopY ?? (GY - 190 - 490);
          const x = lerp(x0, x1, q), y = lerp(y0, y1, q) - Math.sin(q * Math.PI) * 220, h = lerp(sg.w * .35, 240, q); hj = [x, y - h];
          hijau(ctx, x, y, h, t, { run: q < 1 ? 1 : .15, wave: q >= 1, face: 1 }); } },
      over: (ctx2, c, sts, R) => { if (t > tRed){ ctx.save(); ctx.globalAlpha = .1 + .1 * Math.max(0, Math.sin(t * 14)); ctx.fillStyle = "#FF2A1A"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
        if (t > tOn && t < tOn + 1.3){ const p = c.toScreen(A.bellX ?? 560, A.bellY ?? 560); popWord(ctx, "KRIIING!", clamp(p[0], 300, 780), Math.max(330, p[1] - 140), t - tOn, { size: 100, rot: -6, hold: 1.3 }); }
        if (hj && t > tAlive + .7 && t < tAlive + 3){ const p = c.toScreen(hj[0], hj[1]); popChip(ctx, "Ikuti aku!", clamp(p[0] + 120, 300, 820), Math.max(300, p[1] - 70), t - tAlive - .7, "#16934C", "#FFFFFF", 38, -.05); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.alarm || {}; if (A.onCue){ const T0 = cueT(s, A.onCue, .3, i); for (let k = 0; k < 6; k++) add(T0 + k * .35, "ping"); } if (A.xCue) add(cueT(s, A.xCue, .4, i), "pop"); if (A.glowCue) add(cueT(s, A.glowCue, .6, i), "chime"); if (A.aliveCue) add(cueT(s, A.aliveCue, .8, i), "whoosh"); });

  // _evakuasi: corridor -> stairwell -> assembly point (shots)
  function koridorBG(ctx, t, o){ ctx.fillStyle = "#E4E0D6"; ctx.fillRect(-2600, -1400, 6400, GY + 1400); ctx.fillStyle = "#CFC8B8"; ctx.fillRect(-2600, GY - 420, 6400, 260);
    for (let x = -1200; x < 3000; x += 520){ rr(ctx, x, 260, 300, 40, 10); ctx.fillStyle = "#FFF6D0"; ctx.fill(); glowAt(ctx, x + 150, 300, 200, "#FFF6D0", .25); }
    for (let x = -1000; x < 3000; x += 360){ const q = (x / 360 + 10) % 3, on = Math.floor(t * 3) % 3 === Math.floor(q); ctx.save(); ctx.translate(x, GY - 300); rr(ctx, -70, -40, 140, 80, 10); ctx.fillStyle = on ? "#1FC46A" : "#16934C"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(44, 0); ctx.lineTo(4, -26); ctx.lineTo(4, 26); ctx.closePath(); ctx.fill(); ctx.fillRect(-44, -9, 50, 18); if (on) glowAt(ctx, 0, 0, 140, "#3BE07E", .3); ctx.restore(); }
    const dx = o.doorX ?? 1500; rr(ctx, dx - 150, GY - 700, 300, 700, 8); ctx.fillStyle = "#9E2A2A"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 120, GY - 380, 240, 30, 12); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 3); textC(ctx, "PINTU DARURAT", dx, GY - 600, 30, "#FFFFFF", 900, 250);
    ctx.fillStyle = "#BDB3A0"; ctx.fillRect(-2600, GY - 160, 6400, 1600); ctx.strokeStyle = hexA(OUT, .12); ctx.lineWidth = 3; for (let x = -2600; x < 3800; x += 140){ ctx.beginPath(); ctx.moveTo(x, GY - 160); ctx.lineTo(x + (x - 540) * .3, GY + 800); ctx.stroke(); } }
  function tanggaBG(ctx, t, o){ ctx.fillStyle = "#B9B4AA"; ctx.fillRect(-2600, -1400, 6400, 4400); ctx.strokeStyle = hexA(OUT, .08); ctx.lineWidth = 3; for (let y = -1400; y < 3000; y += 80){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
    const sl = o.slope ?? .42, x0 = -600, y0 = o.y0 ?? 1200; ctx.fillStyle = "#8E877B"; ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 0; i < 40; i++){ const x = x0 + i * 60; ctx.lineTo(x + 60, y0 + i * 60 * sl); ctx.lineTo(x + 60, y0 + (i + 1) * 60 * sl); } ctx.lineTo(x0 + 2400, 3400); ctx.lineTo(x0, 3400); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = "#F0C12C"; for (let i = 0; i < 40; i++){ const x = x0 + i * 60; ctx.fillRect(x + 4, y0 + i * 60 * sl - 4, 56, 8); }
    ctx.strokeStyle = "#4B5A62"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x0, y0 - 300); ctx.lineTo(x0 + 2400, y0 - 300 + 2400 * sl); ctx.stroke(); for (let i = 0; i < 12; i++){ const x = x0 + i * 220; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y0 - 300 + (x - x0) * sl); ctx.lineTo(x, y0 + (x - x0) * sl); ctx.stroke(); }
    textC(ctx, "LT 2", 300, 500, 90, hexA(OUT, .25), 900); textC(ctx, "LT 1", 1300, 1100, 90, hexA(OUT, .25), 900);
    for (let k = 0; k < 3; k++){ const x = 100 + k * 500, y = 700 + k * 230; ctx.save(); ctx.translate(x, y); rr(ctx, -70, -40, 140, 80, 10); ctx.fillStyle = "#16934C"; ctx.fill(); ol(ctx, 4); ctx.rotate(.4); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(44, 0); ctx.lineTo(4, -26); ctx.lineTo(4, 26); ctx.closePath(); ctx.fill(); ctx.fillRect(-44, -9, 50, 18); ctx.restore(); } }
  function kumpulSign(ctx, x, t, q){ const top = GY - 760; ctx.save(); ctx.translate(x, 0); ctx.fillStyle = "#8C989E"; ctx.fillRect(-12, top + 200, 24, GY - top - 200); ol(ctx, 3); ctx.translate(0, top); ctx.scale(q, q);
    rr(ctx, -170, 0, 340, 300, 16); ctx.fillStyle = "#16934C"; ctx.fill(); ol(ctx, 6); rr(ctx, -150, 20, 300, 190, 10); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.stroke();
    [[-60, 80], [60, 80], [-60, 160], [60, 160]].forEach(([dx, dy], k) => { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(dx * .5, dy - 14, 11, 0, TAU); ctx.fill(); ctx.fillRect(dx * .5 - 9, dy - 2, 18, 22);
      ctx.save(); ctx.translate(dx * 1.6, dy); ctx.rotate(Math.atan2(-dy + 120, -dx)); ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-6, -10); ctx.lineTo(-6, 10); ctx.closePath(); ctx.fill(); ctx.restore(); });
    textC(ctx, "TITIK KUMPUL", 0, 262, 40, "#FFFFFF", 900, 300); ctx.restore(); }
  BG.koridor = koridorBG; BG.tangga = tanggaBG;
  BG.kantor2 = (ctx, t, o) => { ctx.fillStyle = "#E9DFCF"; ctx.fillRect(-2600, -1400, 6400, GY + 1400); ctx.fillStyle = "#D2BFA3"; ctx.fillRect(-2600, GY - 420, 6400, 230); ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-2600, GY - 424, 6400, 8);
    for (let x = -1200; x < 3000; x += 520){ rr(ctx, x, 230, 300, 40, 10); ctx.fillStyle = "#FFF6D0"; ctx.fill(); }
    rr(ctx, 600, 640, 160, 220, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 4; i++) ctx.fillRect(620, 670 + i * 40, 120 - i * 15, 10);
    ctx.fillStyle = "#C9935F"; ctx.fillRect(-2600, GY - 190, 6400, 1600); ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-2600, GY - 190, 6400, 10); ctx.strokeStyle = hexA(OUT, .1); ctx.lineWidth = 3; for (let y = GY - 140; y < GY + 900; y += 54){ ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); } };
  TT.scene(PX + "evakuasi", "Cerita: lorong panah hijau, tangga darurat, titik kumpul (potong shot)", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const E = R.f.evak || {};
        if (E.slope != null) sts.forEach((st, j) => { st.y = (E.y0 ?? 1200) + (st.x + 600) * E.slope; });
        if (E.kumpul) kumpulSign(ctx, E.kumpul, t, eBack(clamp((t - (R.shotT > 0 ? R.shotT : 0) - .2) / .5, 0, 1)));
        if (E.hijau){ const H = E.hijau, k = t - (R.shotT > 0 ? R.shotT : 0), x = lerp(H.x0, H.x1, clamp(k / (H.dur || 3), 0, 1)), y = H.slope != null ? (H.y0 + (x - H.xs) * H.slope) : H.y;
          hijau(ctx, x, y, H.h || 240, t, { run: k < (H.dur || 3) ? 1 : .2, wave: k >= (H.dur || 3), face: 1 }); } },
      over: (ctx2, c, sts, R) => { } });
  }, sfxBase);

  // _gelap: imagined dark smoky corridor, then daylight walkthrough
  TT.scene(PX + "gelap", "Cerita: imajinasi lorong gelap berasap pintu kembar, lalu terang dengan tanda centang", (ctx, th, s, t) => {
    const idx = G.scene, Gf = s.f.gelap || {}, tLight = T(s, Gf.lightCue, .6, idx), dark = t < tLight;
    const doors = [-260, 140, 540, 940, 1340];
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { ctx.fillStyle = dark ? "#2A2F3A" : "#E4E0D6"; ctx.fillRect(-2600, -1400, 6400, GY + 1400); ctx.fillStyle = dark ? "#1E222B" : "#BDB3A0"; ctx.fillRect(-2600, GY - 160, 6400, 1600);
        doors.forEach((x, i) => { rr(ctx, x - 130, GY - 160 - 560, 260, 560, 8); ctx.fillStyle = dark ? "#3E4452" : (i === 3 ? "#9E2A2A" : "#C9B08E"); ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(x + 90, GY - 160 - 280, 12, 0, TAU); ctx.fillStyle = dark ? "#6B7280" : GOLD; ctx.fill();
          if (dark){ textC(ctx, "?", x, GY - 160 - 360, 120, hexA("#FFFFFF", .25 + .2 * Math.sin(t * 3 + i)), 900); }
          else if (i === 3){ textC(ctx, "PINTU DARURAT", x, GY - 160 - 470, 26, "#FFFFFF", 900, 230); exitSign(ctx, x, GY - 160 - 640, 240, t, { glow: .6 }); } });
        if (dark){ for (let k = 0; k < 4; k++) smoke(ctx, -200 + k * 450, GY - 100, t + k, 1, { n: 6, h: 900, col: "#7B8090", s: 2.2, speed: .25 }); beacon(ctx, 540, 360, t, true); }
        else { const tc = Gf.checks || []; tc.forEach((cc, j) => { const k = t - T(s, cc.cue, .7 + j * .1, idx); if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(cc.x, cc.y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-26, 2); ctx.lineTo(-6, 22); ctx.lineTo(28, -20); ctx.stroke(); ctx.restore(); });
          if (Gf.hijau) hijau(ctx, Gf.hijau.x, Gf.hijau.y, Gf.hijau.h || 260, t, { run: .2, wave: true }); } },
      over: (ctx2, c, sts, R) => { if (dark){ const g = ctx.createRadialGradient(540, 960, 200, 540, 960, 1100); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.75)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }
        if (t > tLight && t < tLight + .4){ ctx.save(); ctx.globalAlpha = 1 - (t - tLight) / .4; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Gf = f.gelap || {}; add(cueT(s, Gf.lightCue, .6, i), "whoosh"); (Gf.checks || []).forEach((cc, j) => add(cueT(s, cc.cue, .7 + j * .1, i), "chime")); });

  // _mal: Sunday at a mall atrium
  function malBG(ctx, t, o){ ctx.fillStyle = "#F4EEE4"; ctx.fillRect(-2600, -1400, 6400, GY + 1400);
    ctx.fillStyle = "#E7DDCC"; ctx.fillRect(-2600, 560, 6400, 60); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-2600, 560, 6400, 60);
    for (let x = -1000; x < 2800; x += 260){ ctx.fillStyle = hexA("#BFE3EA", .45); ctx.fillRect(x, 400, 240, 160); ctx.strokeStyle = "#8C989E"; ctx.lineWidth = 6; ctx.strokeRect(x, 400, 240, 160); }
    const shops = [[-700, "#2F6F73"], [-100, ORANGE], [500, "#5B7DB1"], [1100, "#7FA563"], [1700, "#B05AE0"]];
    shops.forEach(([x, col], k) => { ctx.fillStyle = "#FFFDF8"; ctx.fillRect(x, 700, 520, GY - 160 - 700); ol(ctx, 5); ctx.strokeRect(x, 700, 520, GY - 160 - 700);
      for (let i = 0; i < 8; i++){ ctx.fillStyle = i % 2 ? col : "#FFFFFF"; ctx.beginPath(); ctx.moveTo(x + i * 65, 700); ctx.lineTo(x + i * 65 + 65, 700); ctx.lineTo(x + i * 65 + 65, 780 + Math.sin(t * 2 + i) * 4); ctx.quadraticCurveTo(x + i * 65 + 32, 810, x + i * 65, 780 + Math.sin(t * 2 + i) * 4); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = hexA("#BFE3EA", .7); ctx.fillRect(x + 40, 860, 440, GY - 160 - 900); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(x + 40, 860, 440, GY - 160 - 900);
      for (let i = 0; i < 3; i++){ ctx.fillStyle = [GOLD, RED, TEAL][(i + k) % 3]; rr(ctx, x + 80 + i * 130, 1180, 90, 120, 10); ctx.fill(); ol(ctx, 3); } });
    for (let i = 0; i < 4; i++){ const x = -300 + i * 600, y = 160 + Math.sin(t * 1.2 + i) * 10; ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 60, y); ctx.lineTo(x + 60, y); ctx.lineTo(x + 60, y + 150); ctx.lineTo(x, y + 120); ctx.lineTo(x - 60, y + 150); ctx.closePath(); ctx.fillStyle = [ORANGE, TEAL, GOLD, RED][i]; ctx.fill(); ol(ctx, 4); }
    ctx.fillStyle = "#EDE6DA"; ctx.fillRect(-2600, GY - 160, 6400, 1600); for (let x = -2600; x < 3800; x += 200){ ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(x, GY - 160, 100, 1600); } ctx.fillStyle = hexA(OUT, .15); ctx.fillRect(-2600, GY - 160, 6400, 8); }
  BG.mal = malBG;
  TT.scene(PX + "mal", "Cerita: hari Minggu di mal, rambu hijau, pintu darurat, keluarga", (ctx, th, s, t) => {
    const idx = G.scene, M = s.f.mal || {}, dx = M.doorX ?? 150, tSign = T(s, M.signCue, .3, idx), tDoor = T(s, M.doorCue, .5, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { rr(ctx, dx - 140, GY - 160 - 500, 280, 500, 8); ctx.fillStyle = "#9E2A2A"; ctx.fill(); ol(ctx, 6); rr(ctx, dx - 110, GY - 160 - 230, 220, 26, 10); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 3); textC(ctx, "PINTU DARURAT", dx, GY - 160 - 410, 26, "#FFFFFF", 900, 240);
        if (t > tDoor){ const q = .5 + .5 * Math.sin((t - tDoor) * 6); ctx.strokeStyle = hexA(GOLD, .5 + .5 * q); ctx.lineWidth = 12; ctx.setLineDash([26, 16]); ctx.lineDashOffset = -t * 60; rr(ctx, dx - 165, GY - 160 - 525, 330, 550, 16); ctx.stroke(); ctx.setLineDash([]); }
        exitSign(ctx, dx, GY - 160 - 640, 280, t, { glow: t > tSign ? .5 + .5 * Math.sin(t * 6) : 0 });
        if (t > tSign + .3){ const k = t - tSign - .3; hijau(ctx, dx + 190, GY - 160 - 560, 200, t, { run: 0, wave: true }); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const M = f.mal || {}; add(cueT(s, M.signCue, .3, i), "chime"); add(cueT(s, M.doorCue, .5, i), "pop"); });

  /* ================= SB46: ready to carry more ================= */
  // _apel: Monday stand-up, colleagues hide behind laptops, Arif raises his hand under a spotlight
  TT.scene(PX + "apel", "Cerita: rapat berdiri Senin, rekan sembunyi di balik laptop, Arif angkat tangan", (ctx, th, s, t) => {
    const idx = G.scene, A = s.f.apel || {}, hide = A.hide || [], tHide = T(s, A.hideCue, .5, idx), tHand = T(s, A.handCue, .8, idx), hero = A.hero ?? 0;
    base(ctx, s, t, {
      over1: (ctx2, c, sts, j, R) => { if (!hide.includes(j)) return; const st = sts[j], hp = toonHead(st), h = handOf(st), q = t < tHide ? 0 : eBack(clamp((t - tHide - hide.indexOf(j) * .2) / .45, 0, 1));
        const x = lerp(h[0], hp[0] + 10 * (st.face || 1), q), y = lerp(h[1] + 40, hp[1] + st.size * .1, q) + (q > .9 ? Math.sin(t * 3 + j) * 4 : 0);
        ctx.save(); ctx.translate(x, y); const sc = st.size / 700 * lerp(1, 1.25, q); ctx.scale(sc, sc); ctx.rotate(q * .04 * Math.sin(t * 2 + j)); laptopShape(ctx, 280, true); ctx.restore();
        if (q > .9){ for (let k = 0; k < 2; k++){ const qq = ((t * 1.2) + k * .5 + j * .3) % 1; ctx.fillStyle = hexA("#8FD3F4", 1 - qq); ctx.beginPath(); ctx.ellipse(hp[0] + st.size * .2 + k * 14, hp[1] - st.size * .2 + qq * 70, 9, 13, 0, 0, TAU); ctx.fill(); ol(ctx, 2); } } },
      front: (ctx2, c, sts, R) => { },
      over: (ctx2, c, sts, R) => { if (t > tHand){ const st = sts[hero], hp = toonHead(st), p = c.toScreen(hp[0], hp[1] - st.size * .25), q = clamp((t - tHand) / .5, 0, 1);
          ctx.save(); ctx.globalAlpha = .35 * q; const g = ctx.createLinearGradient(p[0], 0, p[0], 1700); g.addColorStop(0, "rgba(255,246,208,.9)"); g.addColorStop(1, "rgba(255,246,208,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(p[0] - 70, 0); ctx.lineTo(p[0] + 70, 0); ctx.lineTo(p[0] + 330, 1700); ctx.lineTo(p[0] - 330, 1700); ctx.closePath(); ctx.fill(); ctx.restore();
          for (let k = 0; k < 6; k++){ const a = t * 2 + k; sparkle(ctx, p[0] + Math.cos(a) * 200, p[1] + 80 + Math.sin(a * 1.3) * 140, 14 + 6 * Math.sin(t * 6 + k), GOLD); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.apel || {}; add(cueT(s, A.hideCue, .5, i), "whoosh"); add(cueT(s, A.handCue, .8, i), "chime"); });

  // _pikul: bamboo shoulder pole with two baskets on a market street
  function pasarBG(ctx, t, o){ const cols = [["#D9483B", "#FFFFFF"], ["#2F6F73", "#F6C343"], [ORANGE, "#FFF4E6"], ["#5B7DB1", "#FFFFFF"]];
    for (let k = -3; k < 7; k++){ const x = k * 420 - 100, top = GY - 760, cc = cols[(k + 6) % 4]; ctx.fillStyle = "#8E5A35"; ctx.fillRect(x + 10, top, 16, 760); ctx.fillRect(x + 374, top, 16, 760);
      for (let i = 0; i < 6; i++){ ctx.fillStyle = cc[i % 2]; ctx.beginPath(); ctx.moveTo(x + i * 66, top); ctx.lineTo(x + i * 66 + 66, top); ctx.lineTo(x + i * 66 + 66, top + 90 + Math.sin(t * 2 + i + k) * 5); ctx.lineTo(x + i * 66, top + 90 + Math.sin(t * 2 + i + k) * 5); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
      rr(ctx, x + 20, GY - 330, 360, 150, 8); ctx.fillStyle = "#B07A45"; ctx.fill(); ol(ctx, 4);
      for (let i = 0; i < 7; i++){ ctx.beginPath(); ctx.arc(x + 60 + i * 46, GY - 345 - (i % 2) * 20, 26, 0, TAU); ctx.fillStyle = ["#F0A23C", "#7FA563", "#D9483B", GOLD][(i + k) % 4]; ctx.fill(); ol(ctx, 3); } } }
  BG.pasar = pasarBG;
  function basket(ctx, w, fill, items, t, seed){ const h = w * .62; ctx.save(); ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w * .38, 0); ctx.lineTo(-w * .38, 0); ctx.closePath(); ctx.fillStyle = "#C9974F"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#7A4A2E", .6); ctx.lineWidth = 4; for (let k = -6; k < 8; k++){ ctx.beginPath(); ctx.moveTo(k * 26, -h); ctx.lineTo(k * 26 + 50, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(k * 26 + 50, -h); ctx.lineTo(k * 26, 0); ctx.stroke(); } ctx.restore();
    (items || []).forEach((it, i) => { const q = it.q; if (q <= 0) return; const y = lerp(-900, -h - 20 - i * 52, eOut(Math.min(1, q))), sq = q > 1 ? 1 : 1; ctx.save(); ctx.translate((i % 2 ? 12 : -12), y); ctx.rotate((i % 2 ? .06 : -.05));
      fit(ctx, it.text, w * 1.1, 30, 900); const tw = Math.max(w * .7, ctx.measureText(it.text).width + 36); rr(ctx, -tw / 2, -46, tw, 56, 10); ctx.fillStyle = it.col || CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, it.text, 0, -8, 30, it.fg || BROWN, 900, w * 1.1); ctx.restore(); });
    ctx.restore(); }
  function pikulan(ctx, st, t, P0, sag, load){ const k = st.size / 92, f = st.face || 1, sx = st.x, sy = st.y - 57 * k + sag * .1, half = (P0.half ?? 175) * st.size / 760, bw = (P0.bw ?? 200) * st.size / 760 * (P0.scale || 1);
    const ex = [sx - half, sx + half], ey = sy + sag; const sway = Math.sin(t * 3) * 8 * (1 + load);
    [0, 1].forEach(i => { const bx = ex[i] + sway * (i ? 1 : -1) * .3, by = ey + 240 * st.size / 760; ctx.strokeStyle = "#5A3A22"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ex[i] - bw * .32, ey); ctx.lineTo(bx - bw * .45, by - bw * .62); ctx.moveTo(ex[i] + bw * .32, ey); ctx.lineTo(bx + bw * .45, by - bw * .62); ctx.stroke();
      ctx.save(); ctx.translate(bx, by); basket(ctx, bw, 0, (P0.items || []).filter(it => (it.side ?? 0) === i || it.side === 2).map(it => ({ text: it.text, q: it.q, col: it.col, fg: it.fg })), t, i); ctx.restore(); });
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 30 * st.size / 760; ctx.beginPath(); ctx.moveTo(ex[0] - 20, ey); ctx.quadraticCurveTo(sx, sy - sag * .6, ex[1] + 20, ey); ctx.stroke();
    ctx.strokeStyle = "#E3C16F"; ctx.lineWidth = 20 * st.size / 760; ctx.stroke(); }
  TT.scene(PX + "pikul", "Cerita: imajinasi pikulan bambu dengan dua keranjang tanggung jawab", (ctx, th, s, t) => {
    const idx = G.scene, P0 = s.f.pikul || {}, on = P0.on ?? 0, tDrop = T(s, P0.dropCue, .3, idx), tBeat = T(s, P0.beatCue, .05, idx);
    const items = (P0.items || []).map((it, j) => Object.assign({}, it, { q: clamp((t - T(s, it.cue, .4 + j * .15, idx)) / .45, 0, 1.2) }));
    const load = items.reduce((a, it) => a + Math.min(1, it.q), 0);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const st = sts[on]; if (st && t > tDrop) st.y = GY + load * 16 + Math.sin(t * 9) * load * 3; },
      over1: (ctx2, c, sts, j, R) => { if (j !== on || t < tDrop) return; const st = sts[j], q = clamp((t - tDrop) / .4, 0, 1), sag = 10 + load * 38 + Math.sin(t * 4) * 6;
        ctx.save(); ctx.translate(0, -(1 - eOut(q)) * 900); pikulan(ctx, st, t, Object.assign({}, P0, { items }), sag, load); ctx.restore();
        if (t > tBeat && t < tDrop){ const k = st.size / 92, hp = [st.x + 6 * k * (st.face || 1), st.y - 45 * k], b = 1 + .25 * Math.max(0, Math.sin((t - tBeat) * 14)); ctx.save(); ctx.translate(hp[0], hp[1]); ctx.scale(b, b); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 20); ctx.bezierCurveTo(-60, -20, -30, -60, 0, -30); ctx.bezierCurveTo(30, -60, 60, -20, 0, 20); ctx.fill(); ol(ctx, 4); ctx.restore(); } },
      over: (ctx2, c, sts, R) => { const st = sts[on]; if (!st) return; if (t > tBeat && t < tDrop){ const p = c.toScreen(st.x + 140, st.y - st.size * .55); popWord(ctx, "DUG DUG", Math.min(860, p[0] + 60), Math.max(320, p[1]), ((t - tBeat) % 1.2), { size: 70, rot: 8, hold: 1.1, col: "#FF6B5B" }); }
        if (t > tDrop && t < tDrop + 1){ const p = c.toScreen(st.x, st.y - st.size * .7); burstFx(ctx, p[0], p[1], t - tDrop - .35, ORANGE, 10, 220); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const P0 = f.pikul || {}; add(cueT(s, P0.dropCue, .3, i) + .35, "pop"); add(cueT(s, P0.dropCue, .3, i), "whoosh"); (P0.items || []).forEach((it, j) => add(cueT(s, it.cue, .4 + j * .15, i) + .4, "pop")); });

  // _tahap: sunset hill path, three stages, baskets and Arif grow a little each time
  TT.scene(PX + "tahap", "Cerita: jalan bukit senja, tiga tahap tanggung jawab, keranjang dan tokoh tumbuh", (ctx, th, s, t) => {
    const idx = G.scene, S = s.f.tahap || {}, on = S.on ?? 0, cues = (S.stages || []).map((sg, j) => T(s, sg.cue, .2 + j * .25, idx));
    let k = 0; cues.forEach((T0, j) => { if (t >= T0) k = j; });
    const sg = (S.stages || [])[k] || {}, tBadge = T(s, S.badgeCue, .85, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const st = sts[on]; if (!st) return; const q = clamp((t - cues[k]) / .6, 0, 1), from = k ? (S.stages[k - 1].size || 700) : (sg.size || 700); st.size = lerp(from, sg.size || 700, eBack(q));
        // stage markers on the path: bamboo gates with lanterns
        (S.stages || []).forEach((g2, j) => { const x = g2.x ?? (j * 700); ctx.save(); ctx.translate(x, GY); ctx.fillStyle = "#C9974F"; [-170, 170].forEach(d => { rr(ctx, d - 12, -560, 24, 560, 8); ctx.fill(); ol(ctx, 4); }); rr(ctx, -200, -580, 400, 34, 10); ctx.fill(); ol(ctx, 4);
          const lit = t >= cues[j]; glowAt(ctx, 0, -500, 140, "#FFD98A", lit ? .5 : .1); ctx.beginPath(); ctx.ellipse(0, -500, 34, 44, 0, 0, TAU); ctx.fillStyle = lit ? "#F0A23C" : "#8E6A3A"; ctx.fill(); ol(ctx, 4); textC(ctx, String(j + 1), 0, -486, 36, "#FFFFFF", 900); ctx.restore(); }); },
      over1: (ctx2, c, sts, j, R) => { if (j !== on) return; const st = sts[j], sc = sg.basket || 1, load = sc;
        pikulan(ctx, st, t, { half: 175 * (.8 + sc * .25), bw: 200, scale: sc, items: [{ text: sg.label || "", side: 0, q: clamp((t - cues[k]) / .45, 0, 1), col: CREAM }, { text: sg.label2 || sg.label || "", side: 1, q: clamp((t - cues[k] - .15) / .45, 0, 1), col: GOLD }] }, 10 + sc * 20 + Math.sin(t * 4) * 5, load * .3);
        if (t > tBadge){ const q = eBack(clamp((t - tBadge) / .5, 0, 1)), kk = st.size / 92; ctx.save(); ctx.translate(st.x - 8 * kk * (st.face || 1), st.y - 50 * kk); ctx.scale(q, q); ctx.rotate(Math.sin(t * 3) * .1); ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 50; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore(); } },
      over: (ctx2, c, sts, R) => { if (t > cues[0]) popChip(ctx, (sg.tag || ("Tahap " + (k + 1))), 540, 300, t - cues[k], k === (S.stages || []).length - 1 ? ORANGE : NAVY, "#FFFFFF", 44, -.03);
        if (t > tBadge && t < tBadge + 1){ const st = sts[on], p = c.toScreen(st.x, st.y - st.size * .55); burstFx(ctx, p[0], p[1], t - tBadge, GOLD, 12, 240); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.tahap || {}; (S.stages || []).forEach((sg, j) => { const T0 = cueT(s, sg.cue, .2 + j * .25, i); add(T0, "whoosh"); add(T0 + .3, "pop"); }); add(cueT(s, S.badgeCue, .85, i), "chime"); });

  // _kelas: training room, air conditioner dies, then the cool room next door
  function kelasBG(ctx, t, o){ ctx.fillStyle = o.cool ? "#D7E6EE" : "#E6E1D8"; ctx.fillRect(-2600, -1400, 6400, GY + 1400);
    rr(ctx, 80, 620, 600, 380, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7); textC(ctx, o.board || "PELATIHAN", 380, 720, 56, ORANGE, 900, 520); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 3; i++) rr(ctx, 140, 790 + i * 60, 360 - i * 70, 16, 8), ctx.fill();
    rr(ctx, 1150, 560, 240, 900, 8); ctx.fillStyle = "#8E5A35"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(1180, 1000, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
    ctx.fillStyle = o.cool ? "#9FB3BF" : "#C9B89E"; ctx.fillRect(-2600, GY - 170, 6400, 1600); ctx.fillStyle = hexA(OUT, .15); ctx.fillRect(-2600, GY - 170, 6400, 8); }
  BG.kelas = kelasBG;
  function acUnit(ctx, x, y, t, on, broken){ ctx.save(); ctx.translate(x + (broken ? Math.sin(t * 40) * 3 : 0), y); rr(ctx, -200, -70, 400, 140, 22); ctx.fillStyle = "#F4F6F7"; ctx.fill(); ol(ctx, 6);
    const flap = on ? Math.sin(t * 2) * .25 : .5; ctx.save(); ctx.translate(0, 50); ctx.rotate(flap * .2); rr(ctx, -170, -8, 340, 16, 6); ctx.fillStyle = "#C9D1D5"; ctx.fill(); ol(ctx, 3); ctx.restore();
    ctx.beginPath(); ctx.arc(160, -40, 8, 0, TAU); ctx.fillStyle = on ? "#3BE07E" : (broken && Math.sin(t * 12) > 0 ? RED : "#6B7280"); ctx.fill(); ctx.restore();
    if (on){ for (let k = 0; k < 6; k++){ const q = ((t * .8) + k / 6) % 1; ctx.strokeStyle = hexA("#7EC8F0", .8 * (1 - q)); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 140 + k * 56, y + 80 + q * 300); ctx.quadraticCurveTo(x - 120 + k * 56, y + 120 + q * 300, x - 140 + k * 56, y + 160 + q * 300); ctx.stroke();
      ctx.save(); ctx.translate(x - 200 + k * 80 + Math.sin(t + k) * 20, y + 120 + q * 500); ctx.rotate(t + k); ctx.strokeStyle = hexA("#FFFFFF", 1 - q); ctx.lineWidth = 4; for (let a = 0; a < 3; a++){ ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.stroke(); } ctx.restore(); } } }
  TT.scene(PX + "kelas", "Cerita: ruang pelatihan, pendingin mati (asap, panas), pindah ke ruang sebelah", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const K = R.f.kelas; if (!K) return; const tOff = K.offCue ? T(s, K.offCue, .3, idx) : 1e9, broken = t > tOff;
        acUnit(ctx, K.acX ?? 820, K.acY ?? 560, t, K.cool || !broken, broken && !K.cool);
        if (broken && !K.cool){ smoke(ctx, (K.acX ?? 820) + 120, (K.acY ?? 560) - 40, t, clamp((t - tOff) / .4, 0, 1) * Math.max(.3, 1 - (t - tOff) / 4), { n: 6, h: 260, col: "#6B7280" });
          if (t - tOff < .6){ for (let i = 0; i < 8; i++){ const a = i / 8 * TAU, r = 40 + (t - tOff) * 300; sparkle(ctx, (K.acX ?? 820) + Math.cos(a) * r, (K.acY ?? 560) + Math.sin(a) * r, 14, GOLD); } } }
        sts.forEach((st, j) => { if ((R.f.toons[j] || {}).seat){ const k = st.size / 92, sy = -13 * k; ctx.save(); ctx.translate(st.x - 2 * k * (st.face || 1), st.y); ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-11 * k, sy, 2.4 * k, -sy); ctx.fillRect(8.6 * k, sy, 2.4 * k, -sy); rr(ctx, -13 * k, sy - 2 * k, 26 * k, 4 * k, 6); ctx.fill(); ol(ctx, 4); rr(ctx, -14 * k * (st.face || 1) - 2 * k, sy - 26 * k, 4 * k, 26 * k, 6); ctx.fill(); ol(ctx, 4); ctx.restore(); } }); },
      over: (ctx2, c, sts, R) => { const K = R.f.kelas; if (!K) return; const tOff = K.offCue ? T(s, K.offCue, .3, idx) : 1e9;
        if (t > tOff && !K.cool){ const q = clamp((t - tOff - .3) / 1, 0, 1); ctx.save(); ctx.globalAlpha = .16 * q; ctx.fillStyle = "#FF8A3A"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          ctx.save(); ctx.globalAlpha = .5 * q; ctx.strokeStyle = "#FFB25A"; ctx.lineWidth = 6; for (let i = 0; i < 6; i++){ const x = 120 + i * 170, y0 = 1250 - ((t * 120 + i * 90) % 500); ctx.beginPath(); for (let y = 0; y < 160; y += 10) ctx.lineTo(x + Math.sin((y + t * 200) * .05) * 14, y0 - y); ctx.stroke(); } ctx.restore();
          if (t - tOff < 1.3){ const p = c.toScreen(K.acX ?? 820, (K.acY ?? 560) - 120); popWord(ctx, "PFFT...", p[0] - 60, Math.max(320, p[1]), t - tOff, { size: 90, rot: -6, hold: 1.2 }); } }
        if (K.cool && R.shotT > 0 && t - R.shotT < 1.6) popWord(ctx, "ADEM!", 540, 380, t - R.shotT - .2, { size: 110, rot: -5, hold: 1.4, col: "#7EC8F0" }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(sh => { const K = sh.kelas; if (K && K.offCue){ add(cueT(s, K.offCue, .3, i), "ping"); add(cueT(s, K.offCue, .3, i) + .1, "pop"); } }); });

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, chip, langkah, konfeti, potong shot, latar khusus)", (ctx, th, s, t) => {
    base(ctx, s, t, { back: (ctx2, c, sts, R) => { if (R.f.walk) walkBanner(ctx, t, R.f.walk); } }); }, sfxBase);
})();
