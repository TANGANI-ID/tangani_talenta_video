/* Scene pack j2611221631544: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for MS51, SB52, SP52, RN52, KD52.
   Layout prefix j2611221631544_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, env, envOpt, toons, cam, props, cards, ...}]  hard cut (cream flash) to a new shot inside one scene
     hold   [{on, kind, at|cue, outCue, s, dx, dy, rot, ...}]  object in a toon's hand
     pops / stamps / tags / steps / confetti / chips   screen overlays (see base)
   Set pieces (layout suffix):
     MS51 _saku     home night: jacket on a standing coat rack, pocket rustles KRESEK, small things tumble out          f.saku
          _kenangan memory space: struk / karcis / nomor dada float up and blow into soap-bubble windows with mini dioramas  f.kenangan
          _kunang   front garden at night: busy-year streaks rush past, stop, turn into fireflies carrying memory icons   f.kunang
          _pin      dining table: the work jacket on a dress form, three memory pins (TERTAWA / MENOLONG / BANGGA) fly in     f.pin
     SB52 _pisang   giant banana peel "SIAP TANPA CEK": the hero says SIAP and slips (also: shots per month, peel sulks)   f.pisang
          _kabur    walking talk on the street: a vague lesson "LEBIH HATI-HATI" floats as a blurry sign and melts to mist  f.kabur
          _rambu    office corridor: wooden warning sign with the written lesson planted beside the banana peel             f.rambu
     SP52 _amplop   team table at dusk: target written fast, folded, dropped into the "BUKA DESEMBER DEPAN" box            f.amplop
          _lompat   time skip: office ages (plant grows, beard, dust), the envelope opens, question marks swarm a TERCAPAI? meter f.lompat
          _ketik    giant typewriter types the new target, number and date get circled, bell TING                        f.ketik
          _jendela  night office building: each finished report lights a window, June 5/12, November 12/12                  f.jendela
     RN52 _pesan    a spoken message chip travels from toon to toon and morphs (50 -> 15, Senin -> Sabtu)               f.pesan
          _ulang    navy diagram: the same message travels, each receiver repeats it, it gets a green ring and arrives intact f.ulang
          _stiker   home desk at night: old laptop full of tip stickers peeled off one by one, one moves to the new laptop   f.stiker
     KD52 _daftar   office: wish list on paper, five skill cards burst out and orbit the hero's head                       f.daftar
          _kucing   five skill cats with name tags: chase in the park (all escape) / the chosen one comes / training treats  f.kucing
     _adegan  generic story shot with the extras above (used for the action scenes) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631544_";
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
    else if (kind === "card"){ ctx.rotate(-.06); const w = o.w || 240, h = o.h || 160; rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = o.col || PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; ctx.fillRect(-w / 2 + 14, -h + 14, 40, 8);
      if (o.text){ const ls = String(o.text).split("\n"); ls.forEach((l, k) => textC(ctx, l, 0, -h + 50 + k * 36 + (3 - ls.length) * 16, 28, BROWN, 900, w - 30)); } }
    else if (kind === "envelope"){ ctx.rotate(-.08); rr(ctx, -110, -150, 220, 140, 8); ctx.fillStyle = o.col || "#F3D9B5"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-110, -150); ctx.lineTo(0, -70); ctx.lineTo(110, -150); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(0, -78, 14, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 3); }
    else if (kind === "pen"){ ctx.rotate(-.7 + Math.sin((t || 0) * 14) * .08); rr(ctx, -12, -150, 24, 150, 8); ctx.fillStyle = o.col || "#2F6F73"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.lineTo(0, 30); ctx.closePath(); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 3); }
    else if (kind === "clip"){ ctx.rotate(-.05); rr(ctx, -100, -150, 200, 260, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5); rr(ctx, -84, -128, 168, 224, 6); ctx.fillStyle = PAPER; ctx.fill(); rr(ctx, -40, -164, 80, 36, 8); ctx.fillStyle = "#B9B4BF"; ctx.fill(); ol(ctx, 4);
      for (let k = 0; k < 5; k++){ ctx.fillStyle = k < (o.done ?? 0) ? GREEN : "#B9A58E"; rr(ctx, -64, -104 + k * 40, 24, 24, 5); ctx.fill(); ctx.fillStyle = "#B9A58E"; rr(ctx, -30, -98 + k * 40, 90, 10, 5); ctx.fill(); } }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function fxDraw(ctx, fx, t, c){
    if (fx === "rain"){ ctx.save(); ctx.fillStyle = "rgba(40,60,90,.18)"; ctx.fillRect(0, 0, 1080, 1920); ctx.strokeStyle = "rgba(220,235,255,.55)"; ctx.lineWidth = 4; ctx.lineCap = "round";
      for (let i = 0; i < 90; i++){ const x = (rnd(i) * 1300 + t * 260) % 1300 - 110, y = (rnd(i + 50) * 2000 + t * (1500 + rnd(i + 9) * 600)) % 2000 - 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 46); ctx.stroke(); } ctx.restore(); }
    else if (fx === "heat"){ ctx.save(); const g = ctx.createRadialGradient(900, 160, 0, 900, 160, 900); g.addColorStop(0, "rgba(255,214,120,.55)"); g.addColorStop(1, "rgba(255,214,120,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      ctx.strokeStyle = "rgba(255,240,200,.35)"; ctx.lineWidth = 3; for (let i = 0; i < 7; i++){ const y = 700 + i * 110 + Math.sin(t * 2 + i) * 10; ctx.beginPath(); for (let x = 0; x <= 1080; x += 30) ctx.lineTo(x, y + Math.sin(x * .02 + t * 5 + i) * 8); ctx.stroke(); } ctx.restore(); }
    else if (fx === "leaves"){ ctx.save(); for (let i = 0; i < 26; i++){ const x = (rnd(i) * 1200 + t * 90 + Math.sin(t * 2 + i) * 40) % 1200 - 60, y = (rnd(i + 20) * 2000 + t * (160 + rnd(i) * 120)) % 2000 - 40;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); ctx.fillStyle = ["#C2691F", "#E8A55B", "#A0522D"][i % 3]; ctx.beginPath(); ctx.ellipse(0, 0, 18, 9, 0, 0, TAU); ctx.fill(); ctx.restore(); } ctx.restore(); }
  }
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
    if (f.bg && BG[f.bg]) layer(ctx, c, 1, () => BG[f.bg](ctx, t, f.bgOpt || {}, s, shotT));
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
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (f.fx) fxDraw(ctx, f.fx, t, c);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    (f.chips || []).forEach((g, j) => ovs.push(() => { const k = t - tOf(s, g, .3 + j * .1, idx), O = g.outCue ? T(s, g.outCue, .5, idx) : (g.out ?? 1e9); if (k < 0 || t > O + .25) return;
      ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .25, 0, 1); popChip(ctx, g.text, g.x ?? 540, (g.y ?? 330) + Math.sin(t * 2 + j) * 4, k, g.bg || NAVY, g.fg || "#FFFFFF", g.size || 44, (g.rot ?? -2) * Math.PI / 180); ctx.restore(); }));
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
    (f0.stamps || []).forEach(p => add(tOf(s, p, .4, i), "ping"));
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, tombol, langkah, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= shared: jacket, coat rack, memory items, badges ================= */
  function memItem(ctx, kind, s, t){
    ctx.save(); ctx.scale(s, s); ctx.lineJoin = "round";
    if (kind === "struk"){ ctx.rotate(-.12); ctx.beginPath(); ctx.moveTo(-42, -80); for (let k = 0; k <= 6; k++) ctx.lineTo(-42 + k * 14, -80 + (k % 2 ? -8 : 0)); ctx.lineTo(42, 80); for (let k = 6; k >= 0; k--) ctx.lineTo(-42 + k * 14, 80 + (k % 2 ? 8 : 0)); ctx.closePath();
      ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "KOPI", 0, -40, 24, BROWN, 900); for (let k = 0; k < 4; k++){ ctx.fillStyle = "#B9A58E"; ctx.fillRect(-28, -18 + k * 20, 34, 6); ctx.fillRect(14, -18 + k * 20, 14, 6); } }
    else if (kind === "karcis"){ ctx.rotate(.1); rr(ctx, -78, -44, 156, 88, 8); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 4); ctx.setLineDash([6, 6]); ctx.strokeStyle = BROWN; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(34, -40); ctx.lineTo(34, 40); ctx.stroke(); ctx.setLineDash([]);
      textC(ctx, "BUS", -22, 4, 28, "#FFFFFF", 900); textC(ctx, "MUDIK", -22, 30, 16, BROWN, 900); ctx.fillStyle = BROWN; ctx.beginPath(); ctx.arc(56, 0, 9, 0, TAU); ctx.fill(); }
    else if (kind === "nomor"){ ctx.rotate(-.06); rr(ctx, -80, -60, 160, 120, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(-80, -60, 160, 26); ol(ctx, 0);
      textC(ctx, "LARI", 0, -40, 18, "#FFFFFF", 900); textC(ctx, "127", 0, 40, 56, BROWN, 900); [[-62, -48], [62, -48]].forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fillStyle = "#B9B4BF"; ctx.fill(); }); }
    ctx.restore(); }
  function badge(ctx, kind, r, t){ // round pin, centre origin
    const col = kind === "tawa" ? GOLD : kind === "tolong" ? "#4FA3A8" : ORANGE;
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, r * .82, 0, TAU); ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = OUT; ctx.fillStyle = OUT; ctx.lineWidth = r * .1; ctx.lineCap = "round";
    if (kind === "tawa"){ ctx.beginPath(); ctx.arc(-r * .28, -r * .18, r * .1, 0, TAU); ctx.arc(r * .28, -r * .18, r * .1, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, r * .02, r * .42, .25, Math.PI - .25); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); }
    else if (kind === "tolong"){ ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(0, r * .45); ctx.bezierCurveTo(-r * .9, -r * .1, -r * .35, -r * .7, 0, -r * .25); ctx.bezierCurveTo(r * .35, -r * .7, r * .9, -r * .1, 0, r * .45); ctx.fill(); ctx.lineWidth = r * .07; ctx.stroke(); }
    else { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * .25 : r * .6; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath(); ctx.fill(); ctx.lineWidth = r * .07; ctx.stroke(); }
    ctx.fillStyle = hexA("#FFFFFF", .45); ctx.beginPath(); ctx.ellipse(-r * .4, -r * .5, r * .22, r * .12, -.6, 0, TAU); ctx.fill(); ctx.restore(); }
  // jacket: origin = top of the hanger hook (or neck when hanger:false); o.shake (pocket rustle 0..1), o.peek (items out 0..1), o.pins [{kind, x, y, k}], o.patches [{kind, x, y, k}]
  function jacket(ctx, x, y, s, o, t){
    o = o || {}; const col = o.col || "#3B5F8A", dk = o.dark || "#2C4A6E";
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s); ctx.lineJoin = "round";
    if (o.hanger !== false){ ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -16, 16, Math.PI * .9, Math.PI * 2.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 18); ctx.stroke(); }
    const sw = Math.sin(t * 1.4) * .03;
    [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 140, 70); ctx.rotate(d * (.12 + sw)); rr(ctx, -38, 0, 76, 360, 30); ctx.fillStyle = dk; ctx.fill(); ol(ctx, 6); rr(ctx, -38, 320, 76, 40, 14); ctx.fillStyle = hexA(OUT, .25); ctx.fill(); ctx.restore(); });
    ctx.beginPath(); ctx.moveTo(-150, 50); ctx.quadraticCurveTo(0, 20, 150, 50); ctx.lineTo(172, 480); ctx.quadraticCurveTo(0, 500, -172, 480); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = hexA("#FFFFFF", .12); ctx.beginPath(); ctx.moveTo(-130, 70); ctx.lineTo(-90, 70); ctx.lineTo(-110, 460); ctx.lineTo(-150, 460); ctx.closePath(); ctx.fill();
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 8, 40); ctx.lineTo(d * 78, 44); ctx.lineTo(d * 30, 210); ctx.closePath(); ctx.fillStyle = dk; ctx.fill(); ol(ctx, 5); });
    ctx.strokeStyle = "#C9C4CF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(0, 488); ctx.stroke(); ctx.fillStyle = "#C9C4CF"; rr(ctx, -9, 214, 18, 30, 5); ctx.fill();
    // pocket (right side of the jacket = viewer right)
    const sh = (o.shake || 0) * Math.sin(t * 38) * 7, px = 92, py = 330;
    if (o.peek > 0){ const p = clamp(o.peek, 0, 1); [["struk", -24, -.3], ["karcis", 10, .25], ["nomor", 40, -.1]].forEach(([k, dx, r0], j) => { ctx.save(); ctx.translate(px + dx * .6, py - 10 - p * (60 + j * 26)); ctx.rotate(r0 + Math.sin(t * 6 + j) * .08); memItem(ctx, k, .42, t); ctx.restore(); }); }
    ctx.save(); ctx.translate(px + sh * .4, py); ctx.rotate(sh * .01); rr(ctx, -52, 0, 104, 96, 10); ctx.fillStyle = dk; ctx.fill(); ol(ctx, 5); rr(ctx, -58, -10, 116, 34, 9); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.restore();
    if (o.shake > 0){ ctx.strokeStyle = hexA(OUT, .7 * o.shake); ctx.lineWidth = 5; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const a = -.9 + k * .45; ctx.beginPath(); ctx.moveTo(px + 70 + Math.cos(a) * 30, py + 30 + Math.sin(a) * 30); ctx.lineTo(px + 70 + Math.cos(a) * 60, py + 30 + Math.sin(a) * 60); ctx.stroke(); } }
    (o.patches || []).forEach(pp => { if (pp.k <= 0) return; ctx.save(); ctx.translate(pp.x, pp.y); const q = eBack(clamp(pp.k / .35, 0, 1)); ctx.scale(q, q); ctx.rotate(pp.rot || 0); memItem(ctx, pp.kind, pp.s || .55, t); ctx.restore(); });
    (o.pins || []).forEach(pp => { if (pp.k <= 0) return; ctx.save(); ctx.translate(pp.x, pp.y); const q = eBack(clamp(pp.k / .35, 0, 1)); ctx.scale(q, q); badge(ctx, pp.kind, pp.r || 44, t); ctx.restore();
      if (pp.k < .8) burstFx(ctx, pp.x, pp.y, pp.k, GOLD, 10, 110); });
    ctx.restore(); }
  function coatRack(ctx, x, gy){
    ctx.save(); ctx.translate(x, gy); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 150, 18, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineCap = "round"; [[-130, 0], [130, 0], [0, 26]].forEach(([fx, fy]) => { ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = OUT; });
    rr(ctx, -16, -1250, 32, 1110, 12); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -1262, 26, 0, TAU); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5);
    [-1, 1].forEach(d => { ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, -1190); ctx.quadraticCurveTo(d * 70, -1200, d * 80, -1250); ctx.stroke(); ctx.strokeStyle = "#6B4429"; ctx.lineWidth = 8; ctx.stroke(); });
    ctx.restore(); }

  /* ================= MS51: _saku (sofa sigh, grey days rush by, jacket on rack, pocket KRESEK) ================= */
  TT.scene(PX + "saku", "Cerita: rumah malam, hari-hari abu-abu melintas, jaket digantung di gantungan berdiri, saku berbunyi KRESEK", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ rackX: 800, sofaX: 330, days: ["RAPAT", "LEMBUR", "MACET", "RAPAT", "TENGGAT", "LEMBUR"] }, f.saku || {});
    const tDays = T(s, K.daysCue, .3, idx), tHang = T(s, K.hangCue, .5, idx), tRus = T(s, K.rustleCue, .3, idx), tPeek = T(s, K.peekCue, .4, idx);
    base(ctx, s, t, { env: "home", envOpt: { lampX: 560 },
      spots: { pocket: [K.rackX - 40, GY - 760, 1.25], rack: [K.rackX - 120, GY - 700, 1.0] },
      back: () => {
        prop(ctx, "sofa", K.sofaX, GY - 10, { s: 1, color: "#8E5BB5" }, t);
        coatRack(ctx, K.rackX, GY - 30);
        const q = t < tHang ? 0 : eBack(clamp((t - tHang) / .5, 0, 1));
        if (q > 0){ const swing = Math.sin((t - tHang) * 5) * .12 * Math.exp(-(t - tHang) * 1.5); jacket(ctx, K.rackX + 70, GY - 1270 + (1 - q) * 80, 1.0, { rot: swing, shake: t > tRus ? clamp((t - tRus) / .2, 0, 1) : 0, peek: t > tPeek ? eOut(clamp((t - tPeek) / .5, 0, 1)) : 0 }, t); }
      },
      over: (c2, c) => {
        if (t >= tDays && t < tHang + .4){ const fade = 1 - clamp((t - tHang) / .4, 0, 1);
          K.days.forEach((d, j) => { const sp = 900 + (j % 3) * 260, x = 1300 - ((t - tDays) * sp + j * 330) % 1700, y = 330 + (j % 3) * 120 + Math.sin(t * 4 + j) * 8;
            ctx.save(); ctx.globalAlpha *= fade * .95; ctx.fillStyle = hexA("#FFFFFF", .25); ctx.fillRect(x + 90, y - 6, 220, 12); popChip(ctx, d, x, y, 1, "#6B6470", "#FFFFFF", 46, -.03, true); ctx.restore(); }); }
        if (t >= tRus && t < tRus + 2.2){ const p = c.toScreen(K.rackX + 150, GY - 900); popWord(ctx, "KRESEK!", clamp(p[0], 300, 800), Math.max(300, p[1] - 220), t - tRus, { size: 92, hold: 1.6, rot: 8 }); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.saku || {}; if (K.daysCue) add(cueT(s, K.daysCue, .3, i), "whoosh"); if (K.hangCue) add(cueT(s, K.hangCue, .5, i), "pop"); if (K.rustleCue) add(cueT(s, K.rustleCue, .3, i), "ping"); });

  /* ================= MS51: _kenangan (items blow into soap-bubble memory windows) ================= */
  const MINI = {
    nadia: { hair: "hijab", hijab: "#2F6F73", shirt: "#F3D9B5", jacket: "#3B5F8A", pants: "#2C2433", skin: "c" },
    rekan: { hair: "short", hairColor: "#2B1A12", shirt: "#7FA563", pants: "#3B2418", skin: "a", idcard: "#C2691F" },
    ibu: { hair: "hijab", hijab: "#8E3B5A", glasses: true, shirt: "#E8A55B", pants: "#5A3A2A", skin: "b" },
    lari1: { hair: "hijab", hijab: "#D9483B", shirt: "#FFFFFF", pants: "#2C2433", skin: "e", sleeve: "short", collar: false },
    lari2: { hair: "spiky", shirt: "#F6C343", pants: "#2C2433", skin: "d", sleeve: "short", collar: false },
  };
  function mini(ctx, key, x, y, size, o, s, t){ const a = Object.assign({}, MINI[key], { x, y, size, face: o.face || 1, pose: o.pose || "idle", expr: o.expr || "happy", shadow: false, seed: x * .01 + size * .001 });
    const st = toonState(a, s, t); TT.drawToon(ctx, a, st, t); }
  function itemFrame(ctx, kind, x, y, r, t, inside){ // the memory item itself grows into a framed window (receipt / ticket / race bib)
    const W = kind === "struk" ? r * 1.6 : kind === "karcis" ? r * 2.3 : r * 2.1, H = kind === "struk" ? r * 2.1 : kind === "karcis" ? r * 1.55 : r * 1.75, m = r * .1;
    ctx.save(); ctx.translate(x, y); ctx.rotate(kind === "struk" ? -.04 : kind === "karcis" ? .03 : -.02);
    ctx.fillStyle = "rgba(0,0,0,.25)"; rr(ctx, -W / 2 + 14, -H / 2 + 18, W, H, 10); ctx.fill();
    ctx.beginPath();
    if (kind === "struk"){ const n = 10; ctx.moveTo(-W / 2, -H / 2); for (let k = 1; k <= n; k++) ctx.lineTo(-W / 2 + k * W / n, -H / 2 + (k % 2 ? -12 : 0)); ctx.lineTo(W / 2, H / 2); for (let k = n - 1; k >= 0; k--) ctx.lineTo(-W / 2 + k * W / n, H / 2 + (k % 2 ? 12 : 0)); ctx.closePath(); ctx.fillStyle = PAPER; }
    else if (kind === "karcis"){ ctx.moveTo(-W / 2, -H / 2); ctx.lineTo(W / 2, -H / 2); ctx.lineTo(W / 2, -18); ctx.arc(W / 2, 0, 18, -Math.PI / 2, Math.PI / 2, true); ctx.lineTo(W / 2, H / 2); ctx.lineTo(-W / 2, H / 2); ctx.lineTo(-W / 2, 18); ctx.arc(-W / 2, 0, 18, Math.PI / 2, -Math.PI / 2, true); ctx.closePath(); ctx.fillStyle = "#E8A55B"; }
    else { rr(ctx, -W / 2, -H / 2, W, H, 14); ctx.fillStyle = "#FFFFFF"; }
    ctx.fill(); ol(ctx, 6);
    const top = kind === "nomor" ? H * .2 : kind === "struk" ? H * .1 : m, bot = kind === "struk" ? H * .16 : m, right = kind === "karcis" ? W * .2 : m;
    const ix = -W / 2 + m, iy = -H / 2 + top, iw = W - m - right, ih = H - top - bot;
    if (kind === "nomor"){ ctx.save(); rr(ctx, -W / 2, -H / 2, W, H, 14); ctx.clip(); ctx.fillStyle = RED; ctx.fillRect(-W / 2, -H / 2, W, H * .2 - 6); ctx.restore(); textC(ctx, "LARI KANTOR · 127", 0, -H / 2 + H * .14, H * .09, "#FFFFFF", 900, W - 60);
      [[-W / 2 + 26, -H / 2 + 22], [W / 2 - 26, -H / 2 + 22]].forEach(([px, py]) => { ctx.strokeStyle = "#B9B4BF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(px, py, 16, 7, .3, 0, TAU); ctx.stroke(); }); }
    if (kind === "struk"){ textC(ctx, "KOPI SUSU x2", 0, -H / 2 + H * .075, H * .05, BROWN, 900, W - 40); ctx.setLineDash([8, 8]); ctx.strokeStyle = "#B9A58E"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-W / 2 + 20, H / 2 - H * .1); ctx.lineTo(W / 2 - 20, H / 2 - H * .1); ctx.stroke(); ctx.setLineDash([]);
      textC(ctx, "TERIMA KASIH", 0, H / 2 - H * .035, H * .045, BROWN, 800, W - 40); }
    if (kind === "karcis"){ ctx.setLineDash([10, 8]); ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W / 2 - W * .2 + 4, -H / 2 + 10); ctx.lineTo(W / 2 - W * .2 + 4, H / 2 - 10); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.translate(W / 2 - W * .1, 0); ctx.rotate(-Math.PI / 2); textC(ctx, "BUS MUDIK", 0, 12, W * .07, "#FFFFFF", 900, H - 40); ctx.restore(); }
    ctx.save(); rr(ctx, ix, iy, iw, ih, 8); ctx.clip(); ctx.translate(ix + iw / 2, iy + ih / 2); inside(Math.min(iw, ih) / 2, iw, ih); ctx.restore();
    rr(ctx, ix, iy, iw, ih, 8); ol(ctx, 4); ctx.restore(); }
  function diorama(ctx, kind, r, s, t){ // centre origin, radius r
    if (kind === "struk"){ ctx.fillStyle = "#F4DEC1"; ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.fillStyle = "#C98B62"; ctx.fillRect(-r, r * .35, 2 * r, r);
      ctx.fillStyle = "#9DCFDC"; rr(ctx, -r * .7, -r * .8, r * .6, r * .7, 8); ctx.fill(); ctx.fillStyle = "#3B2418"; for (let k = 0; k < 3; k++){ ctx.fillRect(r * .2 + k * 40, -r * .7, 24, 50); }
      mini(ctx, "nadia", -r * .42, r * .62, r * 1.0, { face: 1, pose: "talk", expr: "laugh" }, s, t); mini(ctx, "rekan", r * .45, r * .62, r * 1.02, { face: -1, pose: "clap", expr: "happy" }, s, t);
      rr(ctx, -r * .35, r * .25, r * .7, r * .12, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4); [-.15, .15].forEach(dx => { ctx.save(); ctx.translate(dx * r, r * .25); mug(ctx, "#FFFFFF"); ctx.restore(); }); }
    else if (kind === "karcis"){ const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, "#F6B26B"); g.addColorStop(1, "#FBE3C0"); ctx.fillStyle = g; ctx.fillRect(-r, -r, 2 * r, 2 * r);
      ctx.fillStyle = "#7FA563"; ctx.beginPath(); ctx.ellipse(0, r * .9, r * 1.4, r * .55, 0, 0, TAU); ctx.fill();
      const bx = -r * .2 + ((t * 40) % 60) * 0; rr(ctx, bx - r * .9, -r * .25, r * 1.2, r * .55, 16); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 4); for (let k = 0; k < 4; k++){ rr(ctx, bx - r * .82 + k * r * .27, -r * .17, r * .2, r * .2, 5); ctx.fillStyle = "#BFE2EA"; ctx.fill(); }
      [-r * .55, r * .05].forEach(wx => { ctx.beginPath(); ctx.arc(bx + wx, r * .3, r * .1, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
      mini(ctx, "ibu", r * .3, r * .7, r * .95, { face: -1, pose: "cheer", expr: "laugh" }, s, t); mini(ctx, "nadia", -r * .05, r * .72, r * .95, { face: 1, pose: "cheer", expr: "happy" }, s, t);
      const hb = (t * 1.5) % 1; ctx.save(); ctx.globalAlpha = 1 - hb; ctx.translate(r * .13, -r * .1 - hb * r * .5); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-26, -4, -12, -22, 0, -8); ctx.bezierCurveTo(12, -22, 26, -4, 0, 14); ctx.fill(); ctx.restore(); }
    else { ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.fillStyle = "#C98B62"; ctx.fillRect(-r, r * .45, 2 * r, r);
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-r, r * .62); ctx.lineTo(r, r * .62); ctx.stroke();
      ctx.fillStyle = OUT; ctx.fillRect(r * .38, -r * .7, 10, r * 1.2); ctx.fillRect(-r * .95, -r * .7, 10, r * 1.2); rr(ctx, -r * .95, -r * .78, r * 1.33 + 10, r * .26, 8); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, "FINIS", -r * .28, -r * .6, r * .16, "#FFFFFF", 900);
      mini(ctx, "lari1", -r * .7, r * .5, r * .62, { pose: "clap", expr: "laugh" }, s, t); mini(ctx, "lari2", -r * .38, r * .5, r * .62, { pose: "cheer", expr: "laugh" }, s, t);
      const jx = r * .05 + Math.sin(t * 3) * 6; mini(ctx, "nadia", jx, r * .82, r * .95, { face: 1, pose: "cheer", expr: "laugh" }, s, t);
      ctx.save(); ctx.translate(jx + r * .07, r * .82 - r * .95 * .5); memItem(ctx, "nomor", .32, t); ctx.restore(); }
  }
  TT.scene(PX + "kenangan", "Cerita: benda dari saku melayang lalu membesar jadi bingkai kenangan berbentuk bendanya sendiri (struk kopi, karcis mudik, nomor dada lomba lari)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ items: [] }, f.kenangan || {});
    const its = K.items.map((it, j) => Object.assign({ T: T(s, it.cue, .3, idx) }, it)), n = its.length;
    const slots = [[190, 360], [540, 330], [890, 360]];
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      over: (c2, c, sts) => {
        const st = sts[0]; const hp = st ? c.toScreen(st.x + 40 * (st.face || 1), st.y - st.size * .4) : [300, 1200];
        its.forEach((it, j) => { const k = t - it.T; if (k < 0) return; const nxt = its[j + 1] ? its[j + 1].T : 1e9, kn = t - nxt;
          const fly = eOut(clamp(k / .6, 0, 1)), big = 245, small = 112;
          let x = lerp(hp[0], 610, fly), y = lerp(hp[1], 660, fly) - Math.sin(fly * Math.PI) * 80, r = lerp(30, big, eBack(clamp((k - .35) / .5, 0, 1)));
          if (kn > 0){ const q = TT.easeIO(clamp(kn / .7, 0, 1)); x = lerp(610, slots[j][0], q); y = lerp(660, slots[j][1], q); r = lerp(big, small, q); }
          y += Math.sin(t * 2 + j * 2) * 8; x += Math.cos(t * 1.6 + j) * 5;
          if (k < .45){ ctx.save(); ctx.translate(x, y); ctx.rotate(k * 8); memItem(ctx, it.kind, .9, t); ctx.restore(); return; }
          itemFrame(ctx, it.kind, x, y, r, t + j, (rd, iw, ih) => { ctx.save(); ctx.scale(Math.max(iw, ih) / (2 * rd), Math.max(iw, ih) / (2 * rd)); diorama(ctx, it.kind, rd, s, t); ctx.restore(); });
          if (kn <= 0 && k > .5){ popChip(ctx, it.label, 610, 660 + big * .95 + 40, k - .5, NAVY, "#FFFFFF", 40); }
          if (k > .4 && k < 1.3) burstFx(ctx, x, y, k - .4, GOLD, 12, r * 1.2); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.kenangan || {}).items || []).forEach(it => { const a = cueT(s, it.cue, .3, i); add(a, "whoosh"); add(a + .45, "pop"); }); });

  /* ================= MS51: _kolam (busy whirl in the garden pond settles, water clears, memory pebbles glow) ================= */
  TT.scene(PX + "kolam", "Cerita: duduk di tepi teras rumah malam, kolam kecil di halaman depan; air berpusar keruh (hari sibuk), lalu berhenti, mengendap, jernih, batu kenangan bersinar", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ cx: 560, cy: 1660, rx: 430, ry: 105, words: ["RAPAT", "LEMBUR", "MACET", "TENGGAT"] }, f.kolam || {});
    const tRush = T(s, K.rushCue, .2, idx), tStop = T(s, K.stopCue, .4, idx), tGlow = T(s, K.glowCue, .4, idx);
    const spin = tt => tt < tRush ? .35 : tt < tStop ? 1 : Math.max(.08, 1 - (tt - tStop) / 1.2);
    const clear = t < tStop ? 0 : TT.easeIO(clamp((t - tStop - .2) / 1.6, 0, 1)), glow = t < tGlow ? 0 : TT.easeIO(clamp((t - tGlow) / .8, 0, 1));
    const ang = (() => { let a = 0; const dt = .05; for (let u = 0; u < t; u += dt) a += spin(u) * 7 * dt; return a; })();
    const peb = [{ x: -250, y: 22, ic: "cup" }, { x: -85, y: 48, ic: "bus" }, { x: 90, y: 30, ic: "medal" }, { x: 250, y: 50, ic: "heart" }];
    base(ctx, s, t, { env: "park", envOpt: { time: "night", bench: false, treeX: 1000 },
      spots: { pond: [K.cx, K.cy - 200, 1.15] },
      back: () => { // house front: wall, lit windows, door, porch deck the two sit on
        ctx.fillStyle = "#7A4528"; ctx.fillRect(-600, GY - 1120, 2300, 960); for (let x = -600; x < 1700; x += 90){ ctx.fillStyle = (x / 90) % 2 ? "#83502F" : "#764126"; ctx.fillRect(x, GY - 1120, 86, 960); }
        ctx.fillStyle = "#4E2A17"; ctx.fillRect(-600, GY - 1160, 2300, 60);
        [[150, GY - 900], [970, GY - 900]].forEach(([wx, wy]) => { glowAt(ctx, wx, wy + 120, 260, "#FFD9A0", .45); rr(ctx, wx - 120, wy, 240, 260, 10); ctx.fillStyle = "#FFD58A"; ctx.fill(); ol(ctx, 8); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + 260); ctx.moveTo(wx - 120, wy + 130); ctx.lineTo(wx + 120, wy + 130); ctx.stroke(); });
        rr(ctx, K.cx - 120, GY - 1000, 240, 820, 10); ctx.fillStyle = "#5A321C"; ctx.fill(); ol(ctx, 7); ctx.beginPath(); ctx.arc(K.cx + 80, GY - 560, 14, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
        const lx = K.cx + 200; glowAt(ctx, lx, GY - 1040, 220, "#FFE3A8", .6); ctx.beginPath(); ctx.arc(lx, GY - 1040, 26, 0, TAU); ctx.fillStyle = "#FFF0C8"; ctx.fill(); ol(ctx, 4);
        rr(ctx, -600, GY - 200, 2300, 40, 6); ctx.fillStyle = "#B98152"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#8E5A34"; ctx.fillRect(-600, GY - 160, 2300, 70); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-600, GY - 160, 2300, 70);
        for (let x = -500; x < 1700; x += 260){ rr(ctx, x, GY - 1100, 30, 900, 6); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 4); } },
      front: (c2, c, sts) => {
        const { cx, cy, rx, ry } = K;
        // stone rim
        for (let k = 0; k < 22; k++){ const a = k / 22 * TAU, x = cx + Math.cos(a) * (rx + 22), y = cy + Math.sin(a) * (ry + 16); ctx.beginPath(); ctx.ellipse(x, y, 46, 24, a * .2, 0, TAU); ctx.fillStyle = k % 2 ? "#8C8794" : "#A39EAA"; ctx.fill(); ol(ctx, 4); }
        ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.clip();
        const mud = [107, 90, 58], cl = [47, 111, 138], col = mud.map((m, i) => Math.round(lerp(m, cl[i], clear)));
        ctx.fillStyle = `rgb(${col.join(",")})`; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
        // pebbles + icons at the bottom
        peb.forEach((P, j) => { const x = cx + P.x, y = cy + P.y, a = clear; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
          glowAt(ctx, x, y - 4, 70 + glow * 60, "#F6E27A", (.35 + glow * .5) * (.8 + .2 * Math.sin(t * 5 + j)));
          ctx.beginPath(); ctx.ellipse(x, y, 52, 26, 0, 0, TAU); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 4); ctx.translate(x, y - 2); ctx.scale(1, .62);
          if (P.ic === "cup"){ ctx.scale(.55, .55); ctx.translate(0, 34); mug(ctx, "#FFFFFF"); } else if (P.ic === "bus"){ rr(ctx, -26, -16, 52, 30, 6); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-18, -10, 14, 10); ctx.fillRect(4, -10, 14, 10); }
          else if (P.ic === "medal") badge(ctx, "bangga", 22, t); else { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 16); ctx.bezierCurveTo(-28, -4, -14, -24, 0, -9); ctx.bezierCurveTo(14, -24, 28, -4, 0, 16); ctx.fill(); ol(ctx, 3); }
          ctx.restore(); });
        // swirl + mud + floating busy chips
        const mudA = 1 - clear;
        if (mudA > 0){ ctx.save(); ctx.globalAlpha *= mudA; ctx.strokeStyle = hexA("#C9B48A", .8); ctx.lineWidth = 7; ctx.lineCap = "round";
          for (let k = 0; k < 9; k++){ const r0 = 40 + k * 44, a0 = ang * (1.4 - k * .08) + k; ctx.beginPath(); ctx.ellipse(cx, cy, r0, r0 * ry / rx, 0, a0, a0 + 1.6); ctx.stroke(); }
          for (let k = 0; k < 30; k++){ const r0 = 30 + rnd(k) * (rx - 40), a0 = ang * (1.6 - r0 / rx) + k * 2.1; ctx.fillStyle = hexA("#4A3A22", .7); ctx.beginPath(); ctx.arc(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0 * ry / rx + clear * 30, 7, 0, TAU); ctx.fill(); }
          ctx.restore(); }
        ctx.fillStyle = hexA("#FFFFFF", .16); ctx.beginPath(); ctx.ellipse(cx - rx * .3, cy - ry * .45, rx * .35, ry * .18, 0, 0, TAU); ctx.fill();
        if (clear > .3){ [0, 1].forEach(j => { const a = t * (.5 + j * .2) + j * 3, fx = cx + Math.cos(a) * rx * .6, fy = cy + Math.sin(a) * ry * .55; ctx.save(); ctx.globalAlpha *= clamp((clear - .3) / .4, 0, 1); ctx.translate(fx, fy); ctx.rotate(a + Math.PI / 2); ctx.scale(1, .55);
          ctx.fillStyle = j ? "#F08C2E" : "#FFFFFF"; ctx.beginPath(); ctx.ellipse(0, 0, 34, 14, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-52, -14 + Math.sin(t * 10) * 4); ctx.lineTo(-52, 14 + Math.sin(t * 10) * 4); ctx.closePath(); ctx.fill(); ctx.restore(); }); }
        ctx.restore();
        // spinning busy chips above the water
        if (mudA > 0 && t >= tRush){ ctx.save(); ctx.globalAlpha *= mudA; K.words.forEach((w, j) => { const a0 = ang * 1.1 + j * TAU / K.words.length, x = cx + Math.cos(a0) * rx * .75, y = cy - 40 + Math.sin(a0) * ry * .8 - 30;
          chipW(ctx, w, x, y, "#6B6470", "#FFFFFF", 30); }); ctx.restore(); }
        // light rising from the pebbles to the hero
        if (glow > 0){ const st = sts[0], hp = st ? toonHead(st) : [cx, 900]; ctx.save(); ctx.globalAlpha *= glow * .55; peb.forEach((P, j) => { const x = cx + P.x, y = cy + P.y;
          const g = ctx.createLinearGradient(x, y, hp[0], hp[1] + 60); g.addColorStop(0, "rgba(246,226,122,.9)"); g.addColorStop(1, "rgba(246,226,122,0)"); ctx.strokeStyle = g; ctx.lineWidth = 14 + Math.sin(t * 4 + j) * 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + hp[0]) / 2 + (j - 1.5) * 60, (y + hp[1]) / 2, hp[0], hp[1] + 80); ctx.stroke(); });
          ctx.restore(); glowAt(ctx, hp[0], hp[1], 260 * glow, "#F6E27A", .35 * glow); }
      },
      over: () => { if (t >= tStop && t < tStop + 1.5) popWord(ctx, "BERHENTI SEJENAK", 540, 330, t - tStop, { size: 70, hold: 1.5, rot: -4 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kolam || {}; if (K.rushCue) add(cueT(s, K.rushCue, .2, i), "whoosh"); if (K.stopCue) add(cueT(s, K.stopCue, .4, i), "ping"); if (K.glowCue) add(cueT(s, K.glowCue, .4, i), "chime"); });

  /* ================= MS51: _pin (jacket on a dress form, memory patches + three question pins) ================= */
  function dressForm(ctx, x, gy){ ctx.save(); ctx.translate(x, gy); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 130, 16, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 18; ctx.lineCap = "round"; [[-110, 0], [110, 0], [0, 20]].forEach(([fx, fy]) => { ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(fx, fy); ctx.stroke(); });
    ctx.strokeStyle = "#6B4429"; ctx.lineWidth = 9; [[-110, 0], [110, 0], [0, 20]].forEach(([fx, fy]) => { ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(fx, fy); ctx.stroke(); });
    rr(ctx, -12, -1150, 24, 1050, 8); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 5); ctx.restore(); }
  TT.scene(PX + "pin", "Cerita: jaket kerja di manekin, kenangan disematkan, lalu tiga pin pertanyaan (tertawa, menolong, bangga) terbang menempel", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 720, pins: [] }, f.pin || {});
    const tPatch = T(s, K.patchCue, .4, idx), pins = K.pins.map((p, j) => Object.assign({ T: T(s, p.cue, .4, idx) }, p));
    const JX = K.x, JY = GY - 1210, JS = 1.12;
    const slots = [[-70, 140], [70, 140], [0, 280]], patchPos = [["struk", -110, 300, -.2], ["karcis", 100, 230, .15], ["nomor", -40, 400, -.05]];
    base(ctx, s, t, { env: "home", envOpt: { lampX: 880 },
      spots: { jacket: [JX, JY + 380, 1.25] },
      back: () => { dressForm(ctx, JX, GY - 20); },
      mid: (c2, c, sts) => {
        const patches = patchPos.map(([k, x, y, r], j) => ({ kind: k, x, y, rot: r, k: t - tPatch - j * .25, s: .5 }));
        jacket(ctx, JX, JY, JS, { hanger: false, patches, pins: pins.map((p, j) => ({ kind: p.kind, x: slots[j][0], y: slots[j][1], k: t - p.T - .45, r: 46 })) }, t);
        const st = sts[0]; if (!st) return; const h = handOf(st);
        pins.forEach((p, j) => { const k = t - p.T; if (k < 0 || k > .45) return; const q = TT.easeIO(k / .45), tx = JX + slots[j][0] * JS, ty = JY + slots[j][1] * JS;
          ctx.save(); ctx.translate(lerp(h[0], tx, q), lerp(h[1], ty, q) - Math.sin(q * Math.PI) * 160); ctx.rotate(q * 6); badge(ctx, p.kind, 46 * JS, t); ctx.restore(); });
      }, midZ: 1,
      over: () => { pins.forEach((p, j) => { const k = t - p.T, nx = pins[j + 1] ? pins[j + 1].T : 1e9; if (k < 0 || t > nx + .2) return; ctx.save(); ctx.globalAlpha *= 1 - clamp((t - nx) / .2, 0, 1);
        popChip(ctx, p.q, 540, 320, k, j === 2 ? ORANGE : NAVY, "#FFFFFF", 46); ctx.restore(); }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pin || {}; if (K.patchCue) [0, .25, .5].forEach(d => add(cueT(s, K.patchCue, .4, i) + d, "pop")); (K.pins || []).forEach(p => { const a = cueT(s, p.cue, .4, i); add(a, "whoosh"); add(a + .45, "chime"); }); });

  /* ================= MS51 shared BG: balcony night with pinned jacket on a chair ================= */
  BG.balkon = (ctx, t, o) => {
    const x = o.x ?? 860; ctx.save(); ctx.fillStyle = "#4A3A48"; ctx.fillRect(-2000, GY - 140, 5000, 22);
    ctx.fillStyle = "#6B4429"; rr(ctx, x - 90, GY - 300, 180, 30, 8); ctx.fill(); ol(ctx, 4); ctx.fillRect(x - 80, GY - 270, 16, 270); ctx.fillRect(x + 64, GY - 270, 16, 270); rr(ctx, x + 60, GY - 640, 26, 370, 8); ctx.fill(); ol(ctx, 4);
    jacket(ctx, x + 40, GY - 690, .62, { hanger: false, rot: -.05, patches: [{ kind: "struk", x: -110, y: 300, rot: -.2, k: 1, s: .5 }, { kind: "karcis", x: 100, y: 230, rot: .15, k: 1, s: .5 }, { kind: "nomor", x: -40, y: 400, rot: -.05, k: 1, s: .5 }],
      pins: [{ kind: "tawa", x: -70, y: 140, k: 1 }, { kind: "tolong", x: 70, y: 140, k: 1 }, { kind: "bangga", x: 0, y: 280, k: 1 }] }, t);
    // small table + lamp + tea
    ctx.fillStyle = "#8E4E2E"; rr(ctx, (o.tableX ?? 520) - 150, GY - 330, 300, 30, 8); ctx.fill(); ol(ctx, 4); ctx.fillRect((o.tableX ?? 520) - 12, GY - 300, 24, 300);
    ctx.save(); ctx.translate((o.tableX ?? 520) + 90, GY - 330); mug(ctx, "#FFFFFF"); ctx.restore(); glowAt(ctx, (o.tableX ?? 520) - 80, GY - 420, 180, "#FFD9A0", .5);
    ctx.restore(); };

  /* ================= SB52 shared: banana peel + slip ================= */
  function peel(ctx, x, y, s, o, t){ // origin = floor centre
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 120, 16, 0, 0, TAU); ctx.fill();
    const wob = Math.sin(t * 3) * .04;
    [[-1, -.9], [1, -.9], [-.35, -1.1], [.35, -1.05]].forEach(([d, l], j) => { ctx.save(); ctx.rotate(d * (1.15 + wob) ); ctx.beginPath(); ctx.moveTo(-18, 0); ctx.quadraticCurveTo(-26, -60 * -l, 0, -90 * -l); ctx.quadraticCurveTo(26, -60 * -l, 18, 0); ctx.closePath();
      ctx.fillStyle = j > 1 ? "#F2C94C" : "#F6D365"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#8E6A2A"; ctx.beginPath(); ctx.arc(0, -86 * -l, 6, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, -18, 40, 26, 0, 0, TAU); ctx.fillStyle = "#F6D365"; ctx.fill(); ol(ctx, 5); rr(ctx, -8, -64, 16, 26, 5); ctx.fillStyle = "#6B4429"; ctx.fill(); ol(ctx, 4);
    if (o.face){ const m = o.mood || "smug"; ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-12, -22, 5, 0, TAU); ctx.arc(12, -22, 5, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath();
      if (m === "sulk"){ ctx.arc(0, -2, 9, Math.PI + .3, -.3); ctx.moveTo(-20, -34); ctx.lineTo(-6, -30); ctx.moveTo(20, -34); ctx.lineTo(6, -30); } else { ctx.arc(0, -14, 10, .3, Math.PI - .3); } ctx.stroke(); }
    ctx.restore(); }
  // slip state for a toon: returns {rot, lift, slide, phase} or null; k = seconds since the slip
  function slipAt(k){ if (k < 0) return null;
    if (k < .18){ const q = k / .18; return { rot: -.5 * q, lift: 30 * q, slide: 90 * q, phase: "slide" }; }
    if (k < .62){ const q = (k - .18) / .44; return { rot: -.5 - 1.1 * q, lift: 30 + Math.sin(q * Math.PI) * 260, slide: 90 + 60 * q, phase: "air" }; }
    if (k < .8){ const q = (k - .62) / .18; return { rot: -1.6 + .3 * q, lift: 0, slide: 150, phase: "land", sq: Math.sin(q * Math.PI) }; }
    return { rot: 0, lift: 0, slide: 150, phase: "daze" }; }
  function stars(ctx, x, y, t, r){ for (let j = 0; j < 3; j++){ const a = t * 5 + j * TAU / 3; sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .35, 18, j % 2 ? GOLD : "#FFFFFF"); } }
  function paperBurst(ctx, x, y, k){ if (k < 0 || k > 1.2) return; for (let j = 0; j < 5; j++){ const vx = (j - 2) * 150, vy = -420 - rnd(j) * 200, xx = x + vx * k, yy = y + vy * k + 600 * k * k;
    ctx.save(); ctx.globalAlpha *= 1 - clamp((k - .8) / .4, 0, 1); ctx.translate(xx, yy); ctx.rotate(k * 6 + j); rr(ctx, -40, -50, 80, 100, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#B9A58E"; ctx.fillRect(-26, -30, 52, 7); ctx.fillRect(-26, -12, 40, 7); ctx.restore(); } }
  // shared drawing for a toon that may be slipping; used inside base hooks
  function slipToon(K, s, t, idx){
    const slips = (K.slips || []).map(o => tOf(s, o, .3, idx)).filter(x => x < 1e8), daze = K.daze ?? 1.4;
    let cur = null, T0 = -9; slips.forEach(x => { if (t >= x && t < x + .8 + daze) { cur = slipAt(t - x); T0 = x; } });
    return { cur, T0, slips };
  }
  function slipHooks(ctx, K, s, t, idx, extra){
    const S = slipToon(K, s, t, idx), j = K.on ?? 0;
    return Object.assign({
      back: (c2, c, sts, R) => { const st = sts[j]; if (S.cur && st){ st.hide = true; st._sv = st.show; st.show = false; st.showT = -9; } if (extra && extra.back) extra.back(c2, c, sts, R); },
      mid: (c2, c, sts, R) => {
        if (extra && extra.mid) extra.mid(c2, c, sts, R);
        const st = sts[j]; if (!S.cur || !st) return; const a = R.f.toons[j], fc = st.face || 1, P = S.cur, k = t - S.T0;
        const s2 = Object.assign({}, st, { show: true, x: st.x + P.slide * fc, y: st.y - P.lift, pose: P.phase === "daze" ? "sit" : "shock", expr: P.phase === "daze" ? (a.dazeExpr || "confused") : "shock", poseT: S.T0 });
        if (P.phase === "daze") s2.y = st.y + 6 * st.size / 92;
        ctx.save(); ctx.translate(s2.x, s2.y); ctx.rotate(P.rot * fc * (K.dir || 1)); if (P.sq) ctx.scale(1 + P.sq * .12, 1 - P.sq * .12); ctx.translate(-s2.x, -s2.y); TT.drawToon(ctx, a, s2, t); ctx.restore();
        if (P.phase === "daze"){ const hp = toonHead(s2); stars(ctx, hp[0], hp[1] - st.size * .26 + 13 * st.size / 92, t, st.size * .2); }
        paperBurst(ctx, st.x + 120 * fc, st.y - st.size * .5, k - .2);
        if (k > .62 && k < 1.1){ const q = (k - .62) / .48; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = "#E9DCC6"; for (let d = 0; d < 7; d++){ ctx.beginPath(); ctx.arc(st.x + P.slide * fc + (d - 3) * 50 * (1 + q), st.y - q * 40, 20 * (1 - q * .5), 0, TAU); ctx.fill(); } ctx.restore(); }
      }, midZ: 2 }, extra ? { front: extra.front, over: extra.over, over1: extra.over1, spots: extra.spots, env: extra.env, envOpt: extra.envOpt } : {});
  }

  /* ================= SB52: _pisang (giant peel SIAP TANPA CEK, slip; also month shots) ================= */
  TT.scene(PX + "pisang", "Cerita: kulit pisang raksasa berlabel SIAP TANPA CEK; tokoh bilang siap lalu terpeleset, tergeletak berbintang (juga potongan bulan Maret/Juli/Oktober)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, { F: f } = shotOf(s, t), K = Object.assign({ x: 560, s: 1.2, label: "SIAP TANPA CEK" }, f0.pisang || {}, f.pisang || {});
    const tLab = T(s, K.labelCue, .4, idx), tAgenda = T(s, K.agendaCue, .4, idx), tClash = T(s, K.clashCue, .4, idx), tNight = T(s, K.nightCue, .3, idx);
    const S = slipToon(K, s, t, idx), flyK = S.cur ? t - S.T0 : -1;
    base(ctx, s, t, slipHooks(ctx, K, s, t, idx, {
      env: "office", envOpt: { desk: false, plant: true, plantX: 1010 },
      back: () => {
        if (K.desk){ prop(ctx, "desk", K.desk.x ?? 880, GY - 40, { s: K.desk.s || .95, laptop: true, mug: true, papers: true }, t);
          if (t >= tAgenda){ const q = eBack(clamp((t - tAgenda) / .35, 0, 1)), dx = (K.desk.x ?? 880) + 150, dy = GY - 380; ctx.save(); ctx.translate(dx, dy); ctx.scale(q, q); ctx.rotate(-.08 + Math.sin(t * 12) * .03);
            rr(ctx, -70, -90, 140, 110, 10); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 5); rr(ctx, -58, -78, 116, 86, 6); ctx.fillStyle = PAPER; ctx.fill();
            for (let r = 0; r < 3; r++) for (let q2 = 0; q2 < 4; q2++){ ctx.fillStyle = RED; ctx.fillRect(-50 + q2 * 27, -70 + r * 26, 22, 20); }
            ctx.restore(); glowAt(ctx, dx, dy - 30, 160, RED, .25 + .15 * Math.sin(t * 8)); } }
        if (K.lamp && t >= tNight){ glowAt(ctx, (K.desk ? K.desk.x : 880) - 60, GY - 520, 300, "#FFD9A0", .55); }
      },
      front: () => { let px = K.x, py = GY + 6, rot = 0, sc = K.s;
        if (flyK >= 0 && flyK < 1.0){ const q = flyK / 1.0; py -= Math.sin(q * Math.PI) * 420; rot = q * 9; px += 60 * q; }
        ctx.save(); ctx.translate(px, py); ctx.rotate(rot); peel(ctx, 0, 0, sc, { face: K.face, mood: flyK >= 0 ? "smug" : (K.mood || "smug") }, t); ctx.restore();
        if (t >= tLab && K.label){ const q = eBack(clamp((t - tLab) / .4, 0, 1)); ctx.save(); ctx.translate(K.x, GY - 200 * K.s); ctx.scale(q, q); chipW(ctx, K.label, 0, 0, RED, "#FFFFFF", 40); ctx.restore(); } },
      over: (c2, c) => {
        if (S.cur && flyK < 1.2){ popWord(ctx, K.slipWord || "GUBRAK!", 540, 380, flyK - .6, { size: 96, hold: .9, rot: -8 }); }
        if (t >= tClash && t < tClash + 2.2){ const k = t - tClash, q = clamp(k / .35, 0, 1), cx = 540, cy = 360, sh = k > .35 && k < .7 ? Math.sin(k * 80) * 10 : 0;
          ctx.save(); ctx.globalAlpha *= 1 - clamp((k - 1.9) / .3, 0, 1);
          [[-1, K.clashA || "TENGGAT A"], [1, K.clashB || "TENGGAT B"]].forEach(([d, txt]) => { const x = cx + d * (420 - 260 * eOut(q)) + sh; ctx.save(); ctx.translate(x, cy); ctx.rotate(d * (q >= 1 ? .12 : 0)); rr(ctx, -130, -70, 260, 140, 14); ctx.fillStyle = d < 0 ? ORANGE : TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, txt, 0, 14, 38, "#FFFFFF", 900, 230); ctx.restore(); });
          if (k > .3) burstFx(ctx, cx, cy, k - .3, RED, 14, 240); if (k > .35) popWord(ctx, "TABRAKAN!", cx, cy + 150, k - .35, { size: 64, hold: 1.5, rot: 6 }); ctx.restore(); }
      } }));
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const all = [f].concat(f.shots || []); all.forEach(F => { const K = Object.assign({}, f.pisang || {}, F.pisang || {}); (F.pisang ? (F.pisang.slips || []) : (F === f ? (K.slips || []) : [])).forEach(o => { const a = tOf(s, o, .3, i); add(a, "whoosh"); add(a + .62, "pop"); }); });
    const K = f.pisang || {}; if (K.labelCue) add(cueT(s, K.labelCue, .4, i), "pop"); if (K.agendaCue) add(cueT(s, K.agendaCue, .4, i), "ping"); if (K.clashCue) add(cueT(s, K.clashCue, .4, i) + .3, "pop"); });

  /* ================= SB52: _kabur (walking talk; blurry lesson sign melts to mist) ================= */
  TT.scene(PX + "kabur", "Cerita: berjalan di trotoar sambil bicara, jawaban LEBIH HATI-HATI melayang buram seperti kabut lalu menguap", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ text: "LEBIH HATI-HATI", on: 1 }, f.kabur || {});
    const tIn = T(s, K.inCue, .3, idx), tMelt = T(s, K.meltCue, .4, idx), tSharp = T(s, K.sharpCue, .4, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      over: (c2, c, sts) => {
        const st = sts[K.on]; if (!st || t < tIn) return; const hp = toonHead(st), p = c.toScreen(hp[0] + 120, hp[1] - st.size * .42), k = t - tIn, melt = t < tMelt ? 0 : clamp((t - tMelt) / 1.1, 0, 1);
        const x = 540, y = 470;
        if (melt < 1){ ctx.save(); ctx.globalAlpha *= clamp(k / .4, 0, 1) * (1 - melt); ctx.translate(x + Math.sin(t * 2) * 12, y + Math.cos(t * 1.7) * 8 - melt * 80); ctx.rotate(Math.sin(t * 1.3) * .05);
          ctx.filter = `blur(${4 + melt * 14 + Math.sin(t * 3) * 1.5}px)`; rr(ctx, -380, -100, 760, 200, 36); ctx.fillStyle = hexA("#FFFFFF", .8); ctx.fill(); ctx.strokeStyle = hexA("#9C98A3", .9); ctx.lineWidth = 8; ctx.stroke();
          textC(ctx, K.text, 0, 28, 84, "#6B6470", 900, 700); ctx.filter = "none"; ctx.restore(); }
        if (melt > 0 && melt < 1){ ctx.save(); for (let j = 0; j < 16; j++){ const a = j / 16 * TAU, r = 80 + melt * 300 * (.6 + rnd(j) * .6); ctx.globalAlpha = (1 - melt) * .6; ctx.fillStyle = "#FFFFFF";
          ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r * .5 - melt * 60, 40 + melt * 40, 0, TAU); ctx.fill(); } ctx.restore();
          popWord(ctx, "TERLALU KABUR", 540, 330, t - tMelt, { size: 72, hold: 1.4, rot: -5 }); }
        if (t >= tSharp) stampBox(ctx, K.sharp || "TULIS YANG JELAS", 540, 330, t - tSharp, GREEN, 70, -.06);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kabur || {}; if (K.inCue) add(cueT(s, K.inCue, .3, i), "whoosh"); if (K.meltCue) add(cueT(s, K.meltCue, .4, i), "whoosh"); if (K.sharpCue) add(cueT(s, K.sharpCue, .4, i), "chime"); });

  /* ================= SB52: _rambu (wooden warning sign with the written lesson, planted beside the peel) ================= */
  function woodSign(ctx, x, gy, lines, reveal, glow, t, title, sc){
    ctx.save(); ctx.translate(x, gy); ctx.scale(sc || 1, sc || 1); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 90, 14, 0, 0, TAU); ctx.fill();
    rr(ctx, -18, -560, 36, 560, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
    ctx.rotate(Math.sin(t * 1.2) * .01); if (glow > 0) glowAt(ctx, 0, -700, 420, GOLD, .45 * glow);
    rr(ctx, -300, -880, 600, 380, 18); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 7); ctx.strokeStyle = hexA(OUT, .2); ctx.lineWidth = 3; for (let k = 1; k < 5; k++){ ctx.beginPath(); ctx.moveTo(-290, -880 + k * 76); ctx.lineTo(290, -880 + k * 76); ctx.stroke(); }
    [[-270, -850], [270, -850], [-270, -530], [270, -530]].forEach(([nx, ny]) => { ctx.beginPath(); ctx.arc(nx, ny, 8, 0, TAU); ctx.fillStyle = "#6B6470"; ctx.fill(); });
    rr(ctx, -150, -910, 300, 60, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, title || "AWAS!", 0, -868, 38, "#FFFFFF", 900);
    const total = lines.reduce((a, l) => a + l.length, 0); let n = Math.floor(reveal * total);
    lines.forEach((l, k) => { const part = l.slice(0, Math.max(0, n)); n -= l.length; if (!part) return; const sz = k === 0 ? 40 : 56; fit(ctx, l, 540, sz, 900); const sz2 = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
      font(ctx, 900, sz2, FAM); ctx.fillStyle = k === 0 ? BROWN : (k === 1 ? "#13223D" : "#13223D"); ctx.textAlign = "left"; const w = ctx.measureText(l).width; ctx.fillText(part, -w / 2, -770 + k * 100); ctx.textAlign = "left"; });
    ctx.restore(); }
  TT.scene(PX + "rambu", "Cerita: lorong kantor, pelajaran ditulis di papan peringatan kayu di samping kulit pisang; seminggu kemudian dibaca, tokoh melompati kulit pisang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 760, peelX: 520, lines: ["SEBELUM BILANG SIAP:", "CEK JADWAL", "TANYA TENGGAT"], on: 0 }, f.rambu || {});
    const tW0 = T(s, K.writeCue, .2, idx), tW1 = T(s, K.doneCue, .9, idx), tRead = T(s, K.readCue, .4, idx), tHop = T(s, K.hopCue, .3, idx), tWeek = T(s, K.weekCue, .2, idx);
    const reveal = t < tW0 ? 0 : clamp((t - tW0) / Math.max(.5, tW1 - tW0), 0, 1), glow = t < tRead ? 0 : clamp((t - tRead) / .4, 0, 1) * (.7 + .3 * Math.sin(t * 6));
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 90, rug: false },
      spots: { sign: [K.x, GY - 720, 1.15] },
      back: () => { const { F } = shotOf(s, t), R2 = Object.assign({}, K, F.rambu || {}); woodSign(ctx, R2.x, GY - 10, K.lines, reveal, glow, t, K.title, R2.signS); },
      front: () => { const sulk = t >= tHop, R2 = Object.assign({}, K, shotOf(s, t).F.rambu || {}); if (R2.peelX == null) return; peel(ctx, R2.peelX, GY + 10, 1.1, { face: true, mood: sulk ? "sulk" : "smug" }, t);
        if (sulk && t - tHop < 1.6){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tHop - 1.2) / .4, 0, 1); smoke(ctx, R2.peelX + 40, GY - 90, t, 1, { n: 4, h: 120, col: "#9C98A3", s: .5 }); ctx.restore(); } },
      over: () => { if (t >= tWeek && t < tWeek + 2.2){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tWeek - 1.9) / .3, 0, 1); popChip(ctx, K.weekText || "SEMINGGU KEMUDIAN", 540, 300, t - tWeek, NAVY, "#FFFFFF", 46); ctx.restore(); }
        if (t >= tHop + .3) stampBox(ctx, K.stamp || "TIDAK TERULANG", 540, 320, t - tHop - .3, GREEN, 70, -.07); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.rambu || {}; if (K.writeCue){ const a = cueT(s, K.writeCue, .2, i); for (let k = 0; k < 6; k++) add(a + k * .5, "pop"); } if (K.readCue) add(cueT(s, K.readCue, .4, i), "chime"); if (K.weekCue) add(cueT(s, K.weekCue, .2, i), "whoosh"); if (K.hopCue) add(cueT(s, K.hopCue, .3, i) + .3, "ping"); });

  /* ================= SB52 BG: front door at home, card taped, peel peeks from under the door ================= */
  BG.pintu = (ctx, t, o, s) => {
    const idx = G.scene, x = o.x ?? 760, tCard = T(s, o.cardCue, .5, idx), tPeel = T(s, o.peelCue, .3, idx), tShoo = T(s, o.shooCue, .4, idx);
    ctx.save(); rr(ctx, x - 200, GY - 1010, 400, 1000, 10); ctx.fillStyle = "#4E2A17"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - 170, GY - 980, 340, 970, 8); ctx.fillStyle = "#A0522D"; ctx.fill(); ol(ctx, 5); [[GY - 940, 380], [GY - 520, 420]].forEach(([y, h]) => { rr(ctx, x - 130, y, 260, h - 40, 8); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 5; ctx.stroke(); });
    ctx.beginPath(); ctx.arc(x + 120, GY - 500, 16, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    if (t >= tCard){ const q = eBack(clamp((t - tCard) / .4, 0, 1)); ctx.save(); ctx.translate(x, GY - 760); ctx.scale(q, q); ctx.rotate(-.04);
      rr(ctx, -150, -110, 300, 220, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#F6E27A", .85); ctx.save(); ctx.rotate(-.5); ctx.fillRect(-170, -120, 90, 30); ctx.restore(); ctx.save(); ctx.translate(150, -110); ctx.rotate(.5); ctx.fillRect(-45, -15, 90, 30); ctx.restore();
      (o.lines || ["CEK JADWAL", "SEBELUM", "BILANG SIAP"]).forEach((l, k) => textC(ctx, l, 0, -40 + k * 56, k === 0 ? 44 : 40, k === 0 ? RED : BROWN, 900, 260)); ctx.restore(); }
    if (t >= tPeel){ const k = t - tPeel, out = t >= tShoo ? clamp((t - tShoo) / .5, 0, 1) : 0, peek = eOut(clamp(k / .5, 0, 1)) * (1 - out);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 400, GY - 300, 800, 330); ctx.clip(); peel(ctx, x - 60 - 160 * peek + 200 * out, GY + 8, .8, { face: true, mood: out > 0 ? "sulk" : "smug" }, t); ctx.restore(); }
    ctx.restore(); };

  /* ================= SB52 BG: kitchen morning, lesson card taped on the coffee jar, peel peeks from under the counter ================= */
  BG.dapur = (ctx, t, o, s) => {
    const idx = G.scene, x0 = o.x0 ?? 470, top = GY - 360, tCard = T(s, o.cardCue, .5, idx), tPeel = T(s, o.peelCue, .3, idx), tShoo = T(s, o.shooCue, .4, idx), jx = o.jarX ?? 800;
    ctx.save(); rr(ctx, x0 + 40, GY - 1080, 560, 300, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0 + 320, GY - 1080); ctx.lineTo(x0 + 320, GY - 780); ctx.stroke();
    if (t >= tPeel){ const out = t >= tShoo ? clamp((t - tShoo) / .5, 0, 1) : 0, peek = eOut(clamp((t - tPeel) / .5, 0, 1)) * (1 - out); ctx.save(); ctx.beginPath(); ctx.rect(x0 - 300, GY - 300, 1200, 330); ctx.clip(); peel(ctx, x0 + 150 - 200 * peek + 260 * out, GY + 8, .8, { face: true, mood: out > 0 ? "sulk" : "smug" }, t); ctx.restore(); }
    rr(ctx, x0, top + 40, 700, GY - top - 50, 8); ctx.fillStyle = "#C98B52"; ctx.fill(); ol(ctx, 6); [0, 1, 2].forEach(k => { rr(ctx, x0 + 20 + k * 228, top + 70, 210, GY - top - 100, 8); ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(x0 + 200 + k * 228, top + 160, 8, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); });
    rr(ctx, x0 - 20, top, 740, 44, 8); ctx.fillStyle = "#E9DCC6"; ctx.fill(); ol(ctx, 6);
    // kettle with steam
    const kx = x0 + 140; ctx.beginPath(); ctx.ellipse(kx, top - 60, 80, 64, 0, 0, TAU); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(kx + 70, top - 70); ctx.lineTo(kx + 130, top - 110); ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.stroke(); ctx.strokeStyle = "#D9483B"; ctx.lineWidth = 8; ctx.stroke();
    ctx.beginPath(); ctx.arc(kx, top - 120, 44, Math.PI, 0); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.stroke(); smoke(ctx, kx + 134, top - 130, t, 1, { n: 5, h: 200, col: "#FFFFFF", s: .7, drift: 30 });
    // coffee jar
    rr(ctx, jx - 110, top - 300, 220, 300, 26); ctx.fillStyle = hexA("#BFE2EA", .8); ctx.fill(); ol(ctx, 6); rr(ctx, jx - 96, top - 180, 192, 170, 18); ctx.fillStyle = "#5A321C"; ctx.fill(); rr(ctx, jx - 120, top - 330, 240, 46, 12); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 5);
    if (t >= tCard){ const q = eBack(clamp((t - tCard) / .4, 0, 1)); ctx.save(); ctx.translate(jx, top - 170); ctx.scale(q, q); ctx.rotate(-.05); rr(ctx, -130, -90, 260, 180, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = hexA("#F6E27A", .85); ctx.fillRect(-60, -104, 120, 26);
      (o.lines || ["CEK JADWAL", "SEBELUM", "BILANG SIAP"]).forEach((l, k) => textC(ctx, l, 0, -34 + k * 48, k === 0 ? 38 : 34, k === 0 ? RED : BROWN, 900, 230)); ctx.restore(); if (t - tCard < .8) burstFx(ctx, jx, top - 170, t - tCard, GOLD, 10, 180); }
    ctx.restore(); };

  /* ================= SP52 shared ================= */
  function meetTable(ctx, x0, x1, top){ ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, GY + 6, (x1 - x0) / 2 + 40, 24, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; [x0 + 40, x1 - 66].forEach(x => { rr(ctx, x, top + 30, 26, GY - top - 30, 6); ctx.fill(); ol(ctx, 5); });
    rr(ctx, x0, top, x1 - x0, 44, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#A9643B"; ctx.fillRect(x0 + 10, top + 44, x1 - x0 - 20, 30); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x0 + 10, top + 44, x1 - x0 - 20, 30); }
  function capsuleBox(ctx, x, y, o, t){ // origin = bottom centre on the table
    o = o || {}; ctx.save(); ctx.translate(x, y); const w = 300, h = 200;
    rr(ctx, -w / 2, -h, w, h, 14); ctx.fillStyle = o.col || "#2F6F73"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .12); ctx.fillRect(-w / 2 + 14, -h + 14, 30, h - 28);
    rr(ctx, -w / 2 + 30, -h + 60, w - 60, 90, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "BUKA", 0, -h + 96, 30, RED, 900); textC(ctx, "DESEMBER DEPAN", 0, -h + 132, 28, BROWN, 900, w - 80);
    const lid = o.lid || 0; ctx.save(); ctx.translate(-w / 2 - 6, -h); ctx.rotate(-lid * 1.9); rr(ctx, 0, -26, w + 12, 30, 8); ctx.fillStyle = o.col2 || "#24585B"; ctx.fill(); ol(ctx, 5); rr(ctx, w / 2 - 40, -22, 92, 12, 6); ctx.fillStyle = OUT; ctx.fill(); ctx.restore();
    if (o.dust > 0){ ctx.save(); ctx.globalAlpha *= o.dust; ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w / 2 - 10, -h); for (let k = 0; k < 6; k++){ const a = Math.PI / 2 + k * .3; ctx.moveTo(w / 2 - 10, -h); ctx.lineTo(w / 2 - 10 + Math.cos(a) * -90, -h + Math.sin(a) * 90); } ctx.stroke();
      for (let r = 30; r < 90; r += 25){ ctx.beginPath(); ctx.arc(w / 2 - 10, -h, r, Math.PI / 2, Math.PI); ctx.stroke(); } ctx.fillStyle = hexA("#D9C9B4", .6); ctx.fillRect(-w / 2, -h - 8, w, 8); ctx.restore(); }
    ctx.restore(); }

  /* ================= SP52: _amplop (team table, vague target written fast, envelope into the box) ================= */
  TT.scene(PX + "amplop", "Cerita: meja tim sore akhir Desember, target LEBIH PRODUKTIF ditulis kilat, dilipat jadi amplop, masuk kotak BUKA DESEMBER DEPAN", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ boxX: 560, text: "LEBIH PRODUKTIF", on: 0 }, f.amplop || {});
    const tW = T(s, K.writeCue, .2, idx), tFast = T(s, K.fastCue, .3, idx), tEnv = T(s, K.envCue, .3, idx), tShut = T(s, K.shutCue, .3, idx), top = GY - 290;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1010, grade: { warm: .25 } },
      spots: { box: [K.boxX, top - 150, 1.2] },
      front: (c2, c, sts) => {
        meetTable(ctx, 60, 1020, top);
        // papers on the table
        [[220, -.1], [840, .12]].forEach(([px, r], j) => { ctx.save(); ctx.translate(px, top + 4); ctx.rotate(r); ctx.scale(1, .45); rr(ctx, -80, -100, 160, 200, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.restore(); });
        const lid = t < tShut ? 1 : 1 - eBack(clamp((t - tShut) / .4, 0, 1)); capsuleBox(ctx, K.boxX, top + 6, { lid: clamp(lid, 0, 1) }, t);
        const st = sts[K.on]; if (!st) return; const h = handOf(st);
        if (t >= tEnv && t < tEnv + .9){ const q = clamp((t - tEnv) / .9, 0, 1), e = TT.easeIO(q); ctx.save(); ctx.translate(lerp(h[0], K.boxX, e), lerp(h[1], top - 200, e) - Math.sin(q * Math.PI) * 260 + (q > .8 ? (q - .8) * 600 : 0)); ctx.rotate(q * 7); drawItem(ctx, "envelope", 0, 75, t, { s: .8 }); ctx.restore(); }
        if (t >= tShut && t < tShut + .6){ burstFx(ctx, K.boxX, top - 120, t - tShut, ORANGE, 10, 200); }
      },
      over: (c2, c, sts) => {
        if (t >= tFast && t < tEnv){ const k = t - tFast, q = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(540, 360); ctx.rotate(-.06 + Math.sin(t * 20) * .01); ctx.scale(q, q);
          rr(ctx, -330, -110, 660, 220, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); textC(ctx, "TARGET TAHUN DEPAN:", 0, -50, 30, "#8C7A6A", 800);
          const n = Math.floor(clamp(k / .5, 0, 1) * K.text.length); ctx.save(); ctx.rotate(-.04); textC(ctx, K.text.slice(0, n), 0, 40, 72, "#13223D", 900, 600); ctx.restore();
          ctx.strokeStyle = hexA(OUT, .5); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let j = 0; j < 3; j++){ ctx.beginPath(); ctx.moveTo(350 + j * 10, -60 + j * 50); ctx.lineTo(430 + j * 20, -60 + j * 50); ctx.stroke(); } ctx.restore();
          popWord(ctx, "SET, SET, SET!", 540, 560, k - .2, { size: 60, hold: 1.0, rot: 6 }); }
        if (t >= tShut) popChip(ctx, "DISIMPAN 1 TAHUN", 540, 330, t - tShut, NAVY, "#FFFFFF", 44);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.amplop || {}; if (K.fastCue){ const a = cueT(s, K.fastCue, .3, i); [0, .15, .3, .45].forEach(d => add(a + d, "pop")); } if (K.envCue) add(cueT(s, K.envCue, .3, i), "whoosh"); if (K.shutCue) add(cueT(s, K.shutCue, .3, i), "ping"); });

  /* ================= SP52: _lompat (time skip; envelope opened, question marks, TERCAPAI? meter swings) ================= */
  TT.scene(PX + "lompat", "Cerita: lompatan waktu ke Desember berikutnya (jam berputar, tanaman tumbuh, jenggot, debu), amplop dibuka, tanda tanya mengerumuni, meteran TERCAPAI? bimbang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ boxX: 720, text: "LEBIH PRODUKTIF", on: 0 }, f.lompat || {});
    const tOpen = T(s, K.openCue, .2, idx), tQ = T(s, K.qCue, .3, idx), tMeter = T(s, K.meterCue, .2, idx), skipEnd = Math.min(tOpen, 2.2);
    const grow = clamp(t / Math.max(.5, skipEnd), 0, 1), top = GY - 360;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, time: "night" },
      back: () => { // plant that grows during the skip
        ctx.save(); ctx.translate(980, GY - 40); const g = .5 + eOut(grow) * 1.2; ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 11; k++){ ctx.save(); ctx.translate(0, -110); ctx.rotate(-1.3 + k * .26 + Math.sin(t * 1.3 + k) * .05); ctx.beginPath(); ctx.ellipse(0, -80 * g, 24 * Math.min(g, 1.3), 80 * g, 0, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); }
        ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-60, -120); ctx.lineTo(60, -120); ctx.lineTo(46, 0); ctx.lineTo(-46, 0); ctx.closePath(); ctx.fill(); ol(ctx, 6); ctx.restore(); },
      front: (c2, c, sts) => {
        meetTable(ctx, 380, 1060, top);
        capsuleBox(ctx, K.boxX, top + 6, { lid: t >= tOpen ? eBack(clamp((t - tOpen) / .4, 0, 1)) : 0, dust: t < tOpen ? clamp(grow * 1.2, 0, 1) : 0 }, t);
        if (t >= tOpen && t < tOpen + .6){ const q = (t - tOpen) / .6; ctx.save(); ctx.translate(K.boxX, top - 200 - q * 300); ctx.rotate(q * 4); drawItem(ctx, "envelope", 0, 75, t, { s: .8 }); ctx.restore(); burstFx(ctx, K.boxX, top - 220, t - tOpen, GOLD, 10, 180); }
        const st = sts[K.on]; if (st && t >= tQ){ const hp = toonHead(st); for (let j = 0; j < 9; j++){ const a = j / 9 * TAU + t * 1.6, r = st.size * (.32 + .05 * Math.sin(t * 3 + j)), k = clamp((t - tQ - j * .08) / .3, 0, 1); if (k <= 0) continue;
          ctx.save(); ctx.translate(hp[0] + Math.cos(a) * r, hp[1] - st.size * .05 + Math.sin(a) * r * .55); ctx.rotate(Math.sin(t * 4 + j) * .3); ctx.scale(k, k); outlineWords(ctx, [{ w: "?", hl: j % 2 === 0 }], 0, 20, 70, { sw: 14 }); ctx.restore(); } }
      },
      over: (c2, c, sts) => {
        if (t < skipEnd + .3){ const a = 1 - clamp((t - skipEnd) / .3, 0, 1); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA("#13223D", .35); ctx.fillRect(0, 0, 1080, 1920);
          ctx.translate(540, 520); ctx.beginPath(); ctx.arc(0, 0, 190, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 10); ctx.strokeStyle = BROWN; ctx.lineCap = "round";
          ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 9) * 110, -Math.cos(t * 9) * 110); ctx.stroke(); ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 1.5) * 70, -Math.cos(t * 1.5) * 70); ctx.stroke();
          for (let k = 0; k < 12; k++){ const an = k / 12 * TAU; ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(Math.sin(an) * 160, -Math.cos(an) * 160, 8, 0, TAU); ctx.fill(); }
          ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 8; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(0, 0, 230 + k * 40 + (t * 200) % 40, t * 4 + k, t * 4 + k + 1.2); ctx.stroke(); }
          ctx.restore(); ctx.save(); ctx.globalAlpha *= a; popChip(ctx, K.banner || "DESEMBER BERIKUTNYA", 540, 820, t - .1, ORANGE, "#FFFFFF", 50); ctx.restore(); }
        if (t >= tOpen + .4 && t < tMeter + .2){ const k = t - tOpen - .4, q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(540, 360); ctx.rotate(.03); ctx.scale(q, q); rr(ctx, -320, -100, 640, 200, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
          textC(ctx, "TARGET:", 0, -40, 30, "#8C7A6A", 800); textC(ctx, K.text, 0, 50, 72, "#13223D", 900, 580); ctx.restore(); }
        if (t >= tMeter){ const k = t - tMeter, q = eBack(clamp(k / .35, 0, 1)), cx = 540, cy = 470; ctx.save(); ctx.translate(cx, cy); ctx.scale(q, q);
          rr(ctx, -300, -190, 600, 300, 24); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 6); textC(ctx, "TERCAPAI?", 0, -130, 44, "#FFFFFF", 900);
          ctx.lineWidth = 34; ctx.lineCap = "butt"; ctx.beginPath(); ctx.arc(0, 70, 190, Math.PI, Math.PI * 1.5); ctx.strokeStyle = RED; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 70, 190, Math.PI * 1.5, TAU); ctx.strokeStyle = GREEN; ctx.stroke();
          textC(ctx, "BELUM", -150, 40, 26, "#FFFFFF", 900); textC(ctx, "SUDAH", 150, 40, 26, "#FFFFFF", 900);
          const a = -Math.PI / 2 + Math.sin(t * 5) * 1.15; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(Math.cos(a) * 170, 70 + Math.sin(a) * 170); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 70, 18, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); add(.05, "whoosh"); const K = f.lompat || {}; if (K.openCue) add(cueT(s, K.openCue, .2, i), "pop"); if (K.qCue) add(cueT(s, K.qCue, .3, i), "ping"); if (K.meterCue) add(cueT(s, K.meterCue, .2, i), "pop"); });

  /* ================= SP52: _ketik (giant typewriter types the target with number + deadline) ================= */
  function typewriter(ctx, x, gy, o, t){
    o = o || {}; ctx.save(); ctx.translate(x, gy); ctx.lineJoin = "round";
    const lines = o.lines || [], shift = o.shift || 0, hit = o.hit || 0, PW = 840;
    // paper (behind the carriage) - rises with the number of lines
    const py = -420 - (o.rise || 0);
    ctx.save(); ctx.translate(-shift, 0); rr(ctx, -PW / 2, py - 380, PW, 420, 6); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
    lines.forEach((L, k) => { if (!L.txt) return; ctx.font = `bold ${L.size || 44}px 'Courier New', monospace`; ctx.fillStyle = L.col || "#1E1A22"; ctx.textAlign = "left"; const lx = -PW / 2 + 40, ly = py - 290 + k * 96; ctx.fillText(L.txt, lx, ly);
      (L.marks || []).forEach(m => { if (m.k <= 0) return; const cw = ctx.measureText("M").width, mx = lx + m.from * cw - 10, mw = (m.to - m.from) * cw + 20, q = clamp(m.k / .5, 0, 1);
        ctx.save(); ctx.strokeStyle = m.col || ORANGE; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); if (m.strike){ ctx.moveTo(mx, ly - 12); ctx.lineTo(mx + mw * q, ly - 12); } else ctx.ellipse(mx + mw / 2, ly - 14, mw / 2 + 8, 40, -.04, -Math.PI / 2, -Math.PI / 2 + TAU * q); ctx.stroke(); ctx.restore(); }); });
    ctx.restore();
    // carriage roller
    rr(ctx, -380 - shift, -470, 760, 64, 30); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6); [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 395 - shift, -438, 34, 0, TAU); ctx.fillStyle = "#6B6470"; ctx.fill(); ol(ctx, 5); });
    rr(ctx, -360 - shift, -486, 120, 22, 8); ctx.fillStyle = "#B9B4BF"; ctx.fill(); ol(ctx, 4);
    // body
    ctx.beginPath(); ctx.moveTo(-340, -410); ctx.lineTo(340, -410); ctx.lineTo(400, 0); ctx.lineTo(-400, 0); ctx.closePath(); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = hexA("#FFFFFF", .12); ctx.beginPath(); ctx.moveTo(-320, -395); ctx.lineTo(-200, -395); ctx.lineTo(-250, -20); ctx.lineTo(-370, -20); ctx.closePath(); ctx.fill();
    // type bar hitting
    ctx.save(); ctx.translate(0, -380); ctx.rotate(-1.2 + hit * 1.1); ctx.strokeStyle = "#B9B4BF"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -90); ctx.stroke(); ctx.restore();
    rr(ctx, -110, -380, 220, 40, 10); ctx.fillStyle = "#1E1A22"; ctx.fill(); textC(ctx, "TARGET", 0, -350, 24, GOLD, 900);
    // keys
    for (let r = 0; r < 3; r++) for (let k = 0; k < 9 - r; k++){ const kx = -300 + r * 30 + k * 70, ky = -270 + r * 80, pressed = o.key === r * 10 + k ? 6 : 0;
      ctx.beginPath(); ctx.arc(kx, ky + pressed, 26, 0, TAU); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(kx, ky + pressed, 17, 0, TAU); ctx.strokeStyle = "#B9B4BF"; ctx.lineWidth = 3; ctx.stroke(); }
    rr(ctx, -200, -50, 400, 34, 17); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4);
    ctx.restore(); }
  TT.scene(PX + "ketik", "Cerita: mesin ketik raksasa mengetik target baru, LEBIH PRODUKTIF dicoret, angka 12 dan tenggat 30 NOVEMBER dilingkari, bel TING", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 620, l0: "lebih produktif", l1: "Selesaikan 12 laporan audit", l2: "paling lambat 30 November" }, f.ketik || {});
    const tStrike = T(s, K.strikeCue, .3, idx), a1 = T(s, K.l1Cue, .1, idx), b1 = T(s, K.l1End, .9, idx), a2 = T(s, K.l2Cue, .1, idx), b2 = T(s, K.l2End, .9, idx), tN = T(s, K.numCue, .5, idx), tD = T(s, K.dateCue, .7, idx);
    const n1 = t < a1 ? 0 : Math.round(clamp((t - a1) / Math.max(.4, b1 - a1), 0, 1) * K.l1.length), n2 = t < a2 ? 0 : Math.round(clamp((t - a2) / Math.max(.4, b2 - a2), 0, 1) * K.l2.length);
    const typing = (t > a1 && t < b1) || (t > a2 && t < b2), hit = typing ? Math.abs(Math.sin(t * 28)) : 0, cur = t >= a2 ? n2 / K.l2.length : n1 / K.l1.length;
    const i12 = K.l1.indexOf("12"), i30 = K.l2.indexOf("30");
    base(ctx, s, t, { env: "info", envOpt: { spotX: K.x },
      spots: { paper: [K.x, GY - 760, 1.1] },
      front: () => { typewriter(ctx, K.x, GY - 20, { shift: (cur - .5) * 160, hit, key: typing ? Math.floor(t * 9) % 30 : -1, rise: t >= a2 ? 20 : 0,
        lines: [{ txt: K.l0, col: "#8C7A6A", size: 38, marks: [{ strike: true, from: 0, to: K.l0.length, k: t - tStrike, col: RED }] }, { txt: K.l1.slice(0, n1), marks: [{ from: i12, to: i12 + 2, k: t - tN }] }, { txt: K.l2.slice(0, n2), marks: [{ from: i30, to: K.l2.length, k: t - tD }] }] }, t); },
      over: () => { if (t >= tD) popWord(ctx, "TING!", 870, 330, t - tD, { size: 80, hold: 1.2, rot: 10 }); if (t >= tN && t < tN + 1.4) popWord(ctx, "ANGKA", 300, 330, t - tN, { size: 70, hold: 1.3, rot: -8 }); if (t >= tD + .2 && t < tD + 1.6) popWord(ctx, "TENGGAT", 300, 330, t - tD - .2, { size: 70, hold: 1.3, rot: -8 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ketik || {}; [[K.l1Cue, K.l1End], [K.l2Cue, K.l2End]].forEach(([a, b]) => { if (!a) return; const A = cueT(s, a, .1, i), B = cueT(s, b, .9, i); for (let x = A; x < B; x += .25) add(x, "pop"); });
    if (K.strikeCue) add(cueT(s, K.strikeCue, .3, i), "whoosh"); if (K.numCue) add(cueT(s, K.numCue, .5, i), "chime"); if (K.dateCue) add(cueT(s, K.dateCue, .7, i), "ping"); });

  /* ================= SP52: _donat (box of 12 donuts = 12 reports; June 5/12, November 12/12) ================= */
  function donut(ctx, x, y, r, col, t, j){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .62, 0, 0, TAU); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(0, -4, r * .86, r * .5, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -2, r * .28, r * .16, 0, 0, TAU); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 3);
    for (let k = 0; k < 6; k++){ const a = k + j, rr2 = r * .58; ctx.fillStyle = ["#FFFFFF", GOLD, "#7FD1C0"][k % 3]; ctx.save(); ctx.translate(Math.cos(a) * rr2, -4 + Math.sin(a) * rr2 * .55); ctx.rotate(a); ctx.fillRect(-7, -2.5, 14, 5); ctx.restore(); } ctx.restore(); }
  TT.scene(PX + "donat", "Cerita: kotak donat isi 12 di meja = 12 laporan audit; Juni baru 5 (lubang kosong berkedip merah), tokoh mengejar, November penuh 12/12", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 650 }, f.donat || {});
    const tJun = T(s, K.junCue, .3, idx), tRun = T(s, K.runCue, .3, idx), tNov = T(s, K.novCue, .2, idx), tDone = T(s, K.doneCue, .5, idx);
    const count = t < tJun ? Math.min(5, Math.floor(clamp((t - .3) / Math.max(.5, tJun - .3), 0, 1) * 5)) : t < tNov ? 5 : 5 + Math.min(7, Math.floor(clamp((t - tNov) / Math.max(.4, tDone - tNov), 0, 1) * 7.99));
    const top = GY - 330, BX = K.x, BW = 600, BH = 300;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1010, rug: false },
      spots: { box: [BX, top - 150, 1.15] },
      front: () => {
        meetTable(ctx, BX - 380, BX + 380, top);
        // open lid (behind)
        ctx.save(); ctx.translate(BX, top - 4); rr(ctx, -BW / 2, -BH - 150, BW, 160, 12); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 5); textC(ctx, "LAPORAN AUDIT", 0, -BH - 80, 44, ORANGE, 900, BW - 60);
        textC(ctx, `${count}/12`, 0, -BH - 26, 40, count >= 12 ? GREEN : BROWN, 900);
        // tray (slanted top view)
        ctx.beginPath(); ctx.moveTo(-BW / 2, -BH + 10); ctx.lineTo(BW / 2, -BH + 10); ctx.lineTo(BW / 2 + 30, 0); ctx.lineTo(-BW / 2 - 30, 0); ctx.closePath(); ctx.fillStyle = "#FFF4E6"; ctx.fill(); ol(ctx, 6);
        for (let j = 0; j < 12; j++){ const r = Math.floor(j / 4), c = j % 4, q = (r + .5) / 3, w = BW + 60 * q, x = -w / 2 + (c + .5) * w / 4, y = -BH + 10 + (r + .5) * (BH - 10) / 3, rad = 54 + 6 * q;
          ctx.beginPath(); ctx.ellipse(x, y + 6, rad, rad * .6, 0, 0, TAU); ctx.fillStyle = "#E9DCC6"; ctx.fill();
          if (j < count){ const T0 = j < 5 ? Math.min(tJun, .3 + j * .2) : tNov + (j - 5) * Math.max(.4, tDone - tNov) / 7.99, k = t - T0, sc = k < 0 ? 1 : eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(x, y - (1 - sc) * 60); ctx.scale(sc, sc); donut(ctx, 0, 0, rad, ["#F28DB2", "#7B4A2E", "#F6C343", "#FFFFFF"][j % 4], t, j); ctx.restore(); }
          else if (t >= tJun && t < tNov){ ctx.save(); ctx.globalAlpha = .4 + .4 * Math.sin(t * 8 + j); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.ellipse(x, y + 6, rad, rad * .6, 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
        ctx.restore();
        if (t >= tDone && t < tDone + 1) burstFx(ctx, BX, top - 200, t - tDone, GREEN, 14, 320);
      },
      over: () => {
        if (t >= tJun && t < tNov){ ctx.save(); ctx.globalAlpha *= 1 - clamp((t - tNov + .2) / .2, 0, 1); popChip(ctx, "JUNI: 5 DARI 12", 540, 300, t - tJun, RED, "#FFFFFF", 50); ctx.restore(); }
        if (t >= tRun && t < tNov) popWord(ctx, "KEJAR!", 540, 420, t - tRun, { size: 80, hold: 1.4, rot: -6 });
        if (t >= tNov && t < tDone) popChip(ctx, "NOVEMBER", 540, 300, t - tNov, NAVY, "#FFFFFF", 50);
        if (t >= tDone) stampBox(ctx, "12/12 TERCAPAI", 540, 320, t - tDone, GREEN, 72, -.06);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.donat || {}; if (K.junCue) add(cueT(s, K.junCue, .3, i), "ping"); if (K.runCue) add(cueT(s, K.runCue, .3, i), "whoosh");
    if (K.novCue && K.doneCue){ const a = cueT(s, K.novCue, .2, i), b = cueT(s, K.doneCue, .5, i); for (let j = 0; j < 7; j++) add(a + j * Math.max(.4, b - a) / 7.99, "pop"); add(b, "chime"); } });

  /* ================= RN52 shared: facades, brochure boxes, message chip ================= */
  function broBox(ctx, x, y, s, lab){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(ctx, -60, -70, 120, 70, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-60, -50, 120, 6);
    if (lab) textC(ctx, lab, 0, -16, 20, BROWN, 900, 110); ctx.restore(); }
  function boxStack(ctx, x, gy, n, s){ s = s || 1; for (let j = 0; j < n; j++){ const c = j % 3, r = Math.floor(j / 3); broBox(ctx, x + (c - 1) * 122 * s + (r % 2) * 20 * s, gy - r * 70 * s, s, "BROSUR"); } }
  BG.gudang = (ctx, t, o) => { const x = o.x ?? 760, w = o.w ?? 640; ctx.save();
    rr(ctx, x - w / 2, GY - 760, w, 610, 8); ctx.fillStyle = "#9C98A3"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#7A7682"; for (let k = 0; k < 7; k++) ctx.fillRect(x - w / 2, GY - 740 + k * 84, w, 8);
    rr(ctx, x - w / 2 + 60, GY - 560, w - 120, 410, 6); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 5); const op = o.open ?? .6; ctx.fillStyle = "#B9B4BF"; ctx.fillRect(x - w / 2 + 60, GY - 560, w - 120, 410 * (1 - op)); ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; for (let y = GY - 560; y < GY - 560 + 410 * (1 - op); y += 22){ ctx.beginPath(); ctx.moveTo(x - w / 2 + 60, y); ctx.lineTo(x + w / 2 - 60, y); ctx.stroke(); }
    rr(ctx, x - 150, GY - 830, 300, 80, 12); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 5); textC(ctx, "GUDANG", x, GY - 776, 44, "#FFFFFF", 900);
    if (o.n) boxStack(ctx, x + (o.stackDx ?? 0), GY - 150, o.n, o.boxS || .9); ctx.restore(); };
  BG.kantorDepan = (ctx, t, o) => { const x = o.x ?? 250; ctx.save(); rr(ctx, x - 260, GY - 900, 520, 750, 8); ctx.fillStyle = "#E8D2B0"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - 150, GY - 560, 300, 410, 8); ctx.fillStyle = hexA("#9DCFDC", .85); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, GY - 560); ctx.lineTo(x, GY - 150); ctx.stroke();
    rr(ctx, x - 160, GY - 860, 320, 80, 12); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, "KANTOR", x, GY - 806, 44, "#FFFFFF", 900); ctx.restore(); };
  function msgChip(ctx, txt, x, y, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.sx ?? 1, o.sy ?? 1);
    font(ctx, 900, o.size || 40, FAM); const w = ctx.measureText(txt).width + 70, h = (o.size || 40) * 1.9;
    if (o.ring > 0){ ctx.save(); ctx.globalAlpha *= o.ring; glowAt(ctx, 0, 0, w * .7, GREEN, .5); rr(ctx, -w / 2 - 14, -h / 2 - 14, w + 28, h + 28, h / 2 + 14); ctx.strokeStyle = GREEN; ctx.lineWidth = 10; ctx.stroke(); ctx.restore(); }
    rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(-w * .25, h / 2 - 4); ctx.lineTo(-w * .32, h / 2 + 26); ctx.lineTo(-w * .14, h / 2 - 4); ctx.closePath(); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = o.fg || "#13223D"; ctx.textAlign = "center"; ctx.fillText(txt, 0, (o.size || 40) * .36); ctx.textAlign = "left";
    if (o.check > 0){ ctx.save(); ctx.translate(w / 2 - 6, -h / 2 + 4); ctx.scale(o.check, o.check); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-3, 10); ctx.lineTo(14, -10); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  function zap(ctx, x, y, k, s){ if (k < 0 || k > .9) return; ctx.save(); ctx.globalAlpha *= 1 - k / .9; ctx.strokeStyle = GOLD; ctx.lineWidth = 10 * (s || 1); ctx.lineJoin = "miter";
    for (let j = 0; j < 4; j++){ const a = j * Math.PI / 2 + .4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 40, y + Math.sin(a) * 40); for (let q = 1; q <= 4; q++) ctx.lineTo(x + Math.cos(a) * (40 + q * 40) + (q % 2 ? 20 : -20) * Math.sin(a), y + Math.sin(a) * (40 + q * 40) + (q % 2 ? -20 : 20) * Math.cos(a)); ctx.stroke(); } ctx.restore(); }

  /* ================= RN52: _pesan (phone line between office and warehouse; static flips the message) ================= */
  TT.scene(PX + "pesan", "Cerita: kantor dan gudang bersebelahan di jalan, pesan berjalan di kabel telepon di atas, kena gangguan KRRZZT, 50 SENIN berubah jadi 15 SABTU", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ t0: "50 BROSUR · SENIN", t1: "15 BROSUR · SABTU", a: 0, b: 1, sagY: 640 }, f.pesan || {});
    const tSend = T(s, K.sendCue, .2, idx), tZap = T(s, K.zapCue, .3, idx), tFlip = T(s, K.flipCue, .3, idx), tArr = T(s, K.arriveCue, .5, idx);
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      back: () => { BG.kantorDepan(ctx, t, { x: 190 }); BG.gudang(ctx, t, { x: 860, w: 560, open: .55, n: t >= tArr ? 6 : 0, boxS: .8 }); },
      front: (c2, c, sts) => {
        const A = sts[K.a], B = sts[K.b]; if (!A || !B) return; const pa = [A.x + A.size * .12, A.y - A.size * 1.05], pb = [B.x - B.size * .12, B.y - B.size * 1.05];
        const P = u => { const x = lerp(pa[0], pb[0], u), y = lerp(pa[1], pb[1], u) - Math.sin(u * Math.PI) * (lerp(pa[1], pb[1], u) - K.sagY); return [x, y]; };
        ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); for (let u = 0; u <= 1.001; u += .05){ const p = P(u); u ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.strokeStyle = "#5B7DB1"; ctx.lineWidth = 4; ctx.stroke();
        if (t >= tSend){ const u = clamp((t - tSend) / Math.max(.6, tArr - tSend), 0, 1), u2 = t < tZap ? Math.min(u, .5) : (t < tFlip + .3 ? .5 : u), p = P(Math.max(.02, u2 * (t < tZap ? 1 : 1)));
          const jit = t >= tZap && t < tFlip + .4 ? Math.sin(t * 60) * 12 : 0, flip = t >= tFlip && t < tFlip + .35 ? Math.cos((t - tFlip) / .35 * Math.PI) : 1, txt = t >= tFlip + .17 ? K.t1 : K.t0;
          if (t < tArr) msgChip(ctx, txt, p[0] + jit, p[1] - 90 + Math.sin(t * 6) * 6, { sy: Math.abs(flip) || .05, bg: t >= tFlip + .17 ? "#FFE1DC" : "#FFFFFF", fg: t >= tFlip + .17 ? RED : "#13223D", size: 38 });
          zap(ctx, P(.5)[0], P(.5)[1] - 90, t - tZap, 1.2); zap(ctx, P(.5)[0], P(.5)[1] - 90, t - tZap - .45, 1); }
      },
      over: (c2, c, sts) => {
        if (t >= tZap && t < tZap + 1.3){ const p = c.toScreen(540, K.sagY - 200); popWord(ctx, "KRRZZT!", 540, Math.max(300, p[1]), t - tZap, { size: 84, hold: 1.2, rot: -8 }); }
        if (t >= tArr) popChip(ctx, K.t1, 540, 320, t - tArr, RED, "#FFFFFF", 50);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pesan || {}; if (K.sendCue) add(cueT(s, K.sendCue, .2, i), "whoosh"); if (K.zapCue){ add(cueT(s, K.zapCue, .3, i), "ping"); add(cueT(s, K.zapCue, .3, i) + .45, "pop"); } if (K.flipCue) add(cueT(s, K.flipCue, .3, i), "whoosh"); if (K.arriveCue) add(cueT(s, K.arriveCue, .5, i), "pop"); });

  /* ================= RN52: _ulang (navy: message flies, comes back like a boomerang, confirmed, arrives intact) ================= */
  TT.scene(PX + "ulang", "Cerita: panggung navy, pesan terbang ke penerima lalu kembali berputar seperti bumerang saat diulang, dicentang hijau, tiba utuh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ text: "50 BROSUR · SENIN PAGI", a: 0, b: 1 }, f.ulang || {});
    const tSend = T(s, K.sendCue, .3, idx), tBack = T(s, K.backCue, .3, idx), tOk = T(s, K.okCue, .3, idx), tFin = T(s, K.finCue, .4, idx);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: (c2, c, sts) => { sts.forEach((st, j) => { ctx.save(); ctx.translate(st.x, GY + 4); ctx.beginPath(); ctx.ellipse(0, 0, 210, 44, 0, 0, TAU); ctx.fillStyle = j ? "#2F6F73" : ORANGE; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(0, -10, 190, 34, 0, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .2); ctx.fill(); ctx.restore(); }); },
      front: (c2, c, sts) => {
        const A = sts[K.a], B = sts[K.b]; if (!A || !B) return; const pa = [A.x + 60, A.y - A.size * 1.16], pb = [B.x - 60, B.y - B.size * 1.16];
        let p = null, rot = 0, ring = 0, chk = 0;
        if (t >= tSend && t < tBack){ const u = TT.easeIO(clamp((t - tSend) / .9, 0, 1)); p = [lerp(pa[0], pb[0], u), lerp(pa[1], pb[1], u) - Math.sin(u * Math.PI) * 160]; }
        else if (t >= tBack && t < tOk){ const u = clamp((t - tBack) / Math.max(.8, Math.min(1.6, tOk - tBack)), 0, 1); p = [lerp(pb[0], pa[0], u), lerp(pb[1], pa[1], u) + Math.sin(u * Math.PI) * 260]; rot = u * TAU * 2;
          ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .35); ctx.lineWidth = 8; ctx.setLineDash([16, 14]); ctx.beginPath(); for (let v = 0; v <= u; v += .05) { const q = [lerp(pb[0], pa[0], v), lerp(pb[1], pa[1], v) + Math.sin(v * Math.PI) * 260]; v ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.restore(); }
        else if (t >= tOk){ const k = t - tOk, u = TT.easeIO(clamp((k - .7) / .9, 0, 1)); ring = clamp(k / .3, 0, 1); chk = eBack(clamp(k / .35, 0, 1)); p = [lerp(pa[0], pb[0], u), lerp(pa[1], pb[1], u) - Math.sin(u * Math.PI) * 160 - (u >= 1 ? 40 : 0)]; }
        if (p) msgChip(ctx, K.text, p[0], p[1] + Math.sin(t * 5) * 6, { rot: rot ? Math.sin(rot) * .5 : 0, ring, check: chk, size: 36 });
        if (t >= tOk && t < tOk + .9) burstFx(ctx, pa[0], pa[1], t - tOk, GREEN, 12, 200);
      },
      over: () => { if (t >= tBack && t < tOk) popChip(ctx, "DIULANG BALIK", 540, 300, t - tBack, ORANGE, "#FFFFFF", 48);
        if (t >= tFin) stampBox(ctx, "PESAN TETAP UTUH", 540, 320, t - tFin, GREEN, 70, -.06); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.ulang || {}; if (K.sendCue) add(cueT(s, K.sendCue, .3, i), "whoosh"); if (K.backCue) add(cueT(s, K.backCue, .3, i), "whoosh"); if (K.okCue) add(cueT(s, K.okCue, .3, i), "chime"); if (K.finCue) add(cueT(s, K.finCue, .4, i), "ping"); });

  /* ================= RN52: _stiker (old laptop full of tip stickers, peeled; one moves to the new laptop) ================= */
  function laptopBack(ctx, x, y, o, t){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(o.s || 1, o.s || 1);
    rr(ctx, -170, -250, 340, 240, 18); ctx.fillStyle = o.col || "#6B6470"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .12); ctx.fillRect(-150, -232, 26, 200);
    ctx.beginPath(); ctx.moveTo(-190, -10); ctx.lineTo(190, -10); ctx.lineTo(210, 12); ctx.lineTo(-210, 12); ctx.closePath(); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 5);
    if (o.shine > 0){ ctx.save(); ctx.globalAlpha *= o.shine; ctx.beginPath(); rr(ctx, -170, -250, 340, 240, 18); ctx.clip(); const sx = -260 + ((t * 300) % 700); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.moveTo(sx, -260); ctx.lineTo(sx + 60, -260); ctx.lineTo(sx - 20, 0); ctx.lineTo(sx - 80, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore(); }
  function sticker(ctx, txt, col, x, y, rot, s, curl){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * (1 - (curl || 0) * .35), s);
    font(ctx, 900, 26, FAM); const w = Math.max(120, ctx.measureText(txt).width + 34); rr(ctx, -w / 2, -30, w, 60, 14); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.stroke(); ol(ctx, 3);
    ctx.fillStyle = col === GOLD || col === "#FFFFFF" ? BROWN : "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(txt, 0, 9); ctx.textAlign = "left";
    if (curl > 0){ ctx.beginPath(); ctx.moveTo(w / 2, -30); ctx.lineTo(w / 2 - 40 * curl, -30); ctx.lineTo(w / 2, -30 + 40 * curl); ctx.closePath(); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 3); }
    ctx.restore(); }
  TT.scene(PX + "stiker", "Cerita: serah terima laptop di kantor siang, laptop lama penuh stiker tips komunikasi dikelupas satu per satu, stiker ULANG INTINYA dipindah ke laptop baru", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ oldX: 570, newX: 940, LS: 1.1, keep: 4, list: [["BALAS DETIK ITU", RED], ["RAPAT TIAP HARI", "#5B7DB1"], ["CC SEMUA ORANG", "#8E5BB5"], ["PAKAI EMOJI", GOLD], ["ULANG INTINYA", GREEN]] }, f.stiker || {});
    const tNew = T(s, K.newCue, .3, idx), tPeel = T(s, K.peelCue, .2, idx), tPeelEnd = T(s, K.peelEnd, .9, idx), tMove = T(s, K.moveCue, .3, idx), tSlap = T(s, K.slapCue, .4, idx), tCarry = T(s, K.carryCue, .4, idx);
    const top = GY - 330, LS = K.LS, pos = [[-90, -190, -.12], [80, -200, .1], [-70, -110, .06], [90, -110, -.08], [0, -60, .02]];
    const others = K.list.map((x, j) => j).filter(j => j !== K.keep), per = Math.max(.3, (tPeelEnd - tPeel) / others.length);
    base(ctx, s, t, { env: f.env || "home", envOpt: f.env === "office" ? { desk: false, plant: true, plantX: 80, rug: false } : { lampX: 700 },
      spots: { desk: [700, top - 160, 1.15] },
      front: () => {
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(760, GY + 6, 470, 26, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#8E4E2E"; [370, 1120].forEach(x => { rr(ctx, x, top + 30, 26, GY - top - 30, 6); ctx.fill(); ol(ctx, 5); }); rr(ctx, 330, top, 860, 44, 12); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
        laptopBack(ctx, K.oldX, top + 2, { s: LS }, t);
        const nq = t < tNew ? 0 : eBack(clamp((t - tNew) / .4, 0, 1)); if (nq > 0){ ctx.save(); ctx.translate(K.newX, top + 2); ctx.scale(nq, nq); laptopBack(ctx, 0, 0, { s: LS, col: "#C9C4CF", shine: t >= tSlap ? 1 : .5 }, t); ctx.restore(); if (t - tNew < .8) burstFx(ctx, K.newX, top - 120, t - tNew, GOLD, 10, 170); }
        K.list.forEach(([txt, col], j) => { const P = pos[j], bx = K.oldX + P[0] * LS, by = top + P[1] * LS;
          if (j !== K.keep){ const T0 = tPeel + others.indexOf(j) * per, k = t - T0;
            if (k < 0) sticker(ctx, txt, col, bx, by, P[2], LS * .95, 0);
            else if (k < .25) sticker(ctx, txt, col, bx, by, P[2] + k, LS * .95, k / .25);
            else if (k < 1.3){ const q = (k - .25) / 1.05; ctx.save(); ctx.globalAlpha *= 1 - q; sticker(ctx, txt, col, bx - 250 * q, by - 500 * q + 300 * q * q, P[2] + q * 9, .8 * (1 - q * .4), 1); ctx.restore(); } }
          else { let x = bx, y = by, r = P[2], sc = LS * .95; if (t >= tMove){ const q = TT.easeIO(clamp((t - tMove) / Math.max(.6, tSlap - tMove), 0, 1)); x = lerp(bx, K.newX, q); y = lerp(by, top - 140 * LS, q) - Math.sin(q * Math.PI) * 220; r = lerp(P[2], -.05, q); sc = LS * .95 + Math.sin(q * Math.PI) * .5; }
            if (t >= tSlap){ const k = t - tSlap; sc = LS * (1 + (k < .2 ? (1 - k / .2) * .25 : 0)); }
            if (t >= tMove - .4 && t < tSlap) glowAt(ctx, x, y, 140, GOLD, .5 + .2 * Math.sin(t * 8));
            sticker(ctx, txt, col, x, y, r, sc, 0); if (t >= tSlap && t - tSlap < .8) burstFx(ctx, x, y, t - tSlap, GREEN, 12, 180); } });
      },
      over: () => { if (t >= tCarry) popChip(ctx, K.carry || "DIBAWA KE TAHUN DEPAN", 540, 320, t - tCarry, GREEN, "#FFFFFF", 48); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.stiker || {}; if (K.newCue) add(cueT(s, K.newCue, .3, i), "pop"); if (K.peelCue && K.peelEnd){ const a = cueT(s, K.peelCue, .2, i), b = cueT(s, K.peelEnd, .9, i), per = Math.max(.3, (b - a) / 4); for (let j = 0; j < 4; j++) add(a + j * per, "whoosh"); }
    if (K.moveCue) add(cueT(s, K.moveCue, .3, i), "whoosh"); if (K.slapCue) add(cueT(s, K.slapCue, .4, i), "chime"); if (K.carryCue) add(cueT(s, K.carryCue, .4, i), "pop"); });

  /* ================= KD52 shared: skills, cats ================= */
  const SKILLS = [["DESAIN", "#D9483B", "#E8A55B"], ["EDIT VIDEO", "#8E5BB5", "#6B6470"], ["KODING", "#13223D", "#2B1A12"], ["ANALISIS DATA", "#3E9B5A", "#F3D9B5"], ["AI", "#2F6F73", "#C9C4CF"]];
  function skillIcon(ctx, j, r){ ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.fillStyle = "#FFFFFF"; ctx.lineWidth = r * .12; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (j === 0){ ctx.beginPath(); ctx.ellipse(0, 0, r * .7, r * .55, 0, 0, TAU); ctx.stroke(); [[-.3, -.15], [0, -.3], [.3, -.1]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * r, b * r, r * .1, 0, TAU); ctx.fill(); }); }
    else if (j === 1){ ctx.beginPath(); ctx.moveTo(-r * .3, -r * .45); ctx.lineTo(r * .5, 0); ctx.lineTo(-r * .3, r * .45); ctx.closePath(); ctx.fill(); }
    else if (j === 2){ ctx.beginPath(); ctx.moveTo(-r * .2, -r * .4); ctx.lineTo(-r * .6, 0); ctx.lineTo(-r * .2, r * .4); ctx.moveTo(r * .2, -r * .4); ctx.lineTo(r * .6, 0); ctx.lineTo(r * .2, r * .4); ctx.stroke(); }
    else if (j === 3){ for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++){ ctx.strokeRect(-r * .55 + a * r * .37, -r * .5 + b * r * .33, r * .37, r * .33); } }
    else { sparkle(ctx, -r * .15, 0, r * .55, "#FFFFFF"); sparkle(ctx, r * .4, -r * .35, r * .25, "#FFFFFF"); }
    ctx.restore(); }
  function skillCard(ctx, j, x, y, s, rot){ const [lab, col] = SKILLS[j]; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    font(ctx, 900, 30, FAM); const w = Math.max(170, ctx.measureText(lab).width + 110); rr(ctx, -w / 2, -42, w, 84, 20); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.save(); ctx.translate(-w / 2 + 44, 0); skillIcon(ctx, j, 28); ctx.restore(); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "left"; ctx.fillText(lab, -w / 2 + 84, 11); ctx.restore(); }
  // cat: origin = floor centre; o {face, run (0..1 speed), sit, sleep, tag, j (skill index), glow, s}
  function cat(ctx, x, y, o, t){ o = o || {}; const j = o.j ?? 0, fur = SKILLS[j][2], s = o.s || 1, f = o.face || 1, ph = t * (6 + 10 * (o.run || 0)) + j;
    ctx.save(); ctx.translate(x, y); if (o.glow > 0) glowAt(ctx, 0, -110 * s, 260 * s, GOLD, .5 * o.glow); ctx.scale(s * f, s); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, 110, 14, 0, 0, TAU); ctx.fill();
    const tail = Math.sin(t * 3 + j) * .4;
    if (o.sleep){ ctx.beginPath(); ctx.ellipse(0, -46, 110, 50, 0, 0, TAU); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(70, -58, 42, 0, TAU); ctx.fill(); ol(ctx, 5);
      [[50, -92], [92, -90]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.moveTo(ex - 16, ey + 12); ctx.lineTo(ex, ey - 16); ctx.lineTo(ex + 16, ey + 12); ctx.closePath(); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 4); });
      ctx.strokeStyle = OUT; ctx.lineWidth = 4; [[56, -60], [86, -60]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.arc(ex, ey, 8, .2, Math.PI - .2); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(-100, -40); ctx.quadraticCurveTo(-150, 0, -60, 2); ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.stroke(); ctx.strokeStyle = fur; ctx.lineWidth = 13; ctx.stroke(); ctx.restore(); return; }
    // tail
    ctx.save(); ctx.translate(-80, -80); ctx.rotate(-.6 + tail); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-30, -60, -6, -110); ctx.strokeStyle = OUT; ctx.lineWidth = 24; ctx.lineCap = "round"; ctx.stroke(); ctx.strokeStyle = fur; ctx.lineWidth = 14; ctx.stroke(); ctx.restore();
    if (o.sit){ ctx.beginPath(); ctx.ellipse(-10, -70, 70, 72, 0, 0, TAU); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 5); [-30, 20].forEach(lx => { rr(ctx, lx, -24, 30, 26, 12); ctx.fill(); ol(ctx, 4); }); }
    else { [[-60, 0], [-30, 1], [40, 2], [70, 3]].forEach(([lx, k]) => { const sw = Math.sin(ph + k * 1.6) * 26 * Math.min(1, (o.run || 0) * 2 + .15); ctx.save(); ctx.translate(lx, -60); ctx.rotate(sw / 60); rr(ctx, -13, 0, 26, 62, 12); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 4); ctx.restore(); });
      const bob = Math.abs(Math.sin(ph)) * 8 * (o.run || 0); ctx.translate(0, -bob); ctx.beginPath(); ctx.ellipse(0, -84, 100, 46, 0, 0, TAU); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 5);
      if (j === 1 || j === 0){ ctx.fillStyle = hexA(OUT, .18); [[-40, -100], [0, -104], [36, -98]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(a, b, 12, 18, 0, 0, TAU); ctx.fill(); }); } }
    // head
    const hx = o.sit ? 10 : 92, hy = o.sit ? -168 : -124; ctx.save(); ctx.translate(hx, hy); ctx.rotate(Math.sin(t * 2 + j) * .06);
    [[-30, -1], [30, 1]].forEach(([ex, d]) => { ctx.beginPath(); ctx.moveTo(ex - 20, -24); ctx.lineTo(ex + d * 6, -76); ctx.lineTo(ex + 22, -26); ctx.closePath(); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(ex - 8, -30); ctx.lineTo(ex + d * 4, -60); ctx.lineTo(ex + 10, -30); ctx.closePath(); ctx.fillStyle = "#F28DB2"; ctx.fill(); });
    ctx.beginPath(); ctx.ellipse(0, 0, 56, 48, 0, 0, TAU); ctx.fillStyle = fur; ctx.fill(); ol(ctx, 5);
    const happy = o.mood === "happy"; ctx.fillStyle = OUT; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.lineCap = "round";
    [-20, 20].forEach(ex => { if (happy){ ctx.beginPath(); ctx.arc(ex, -6, 9, Math.PI + .3, -.3); ctx.stroke(); } else { ctx.beginPath(); ctx.ellipse(ex, -6, 8, 11, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(ex + 2, -5, 4.5, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); } });
    ctx.fillStyle = "#F28DB2"; ctx.beginPath(); ctx.moveTo(-7, 10); ctx.lineTo(7, 10); ctx.lineTo(0, 18); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(-6, 20, 6, 0, Math.PI); ctx.arc(6, 20, 6, 0, Math.PI); ctx.stroke();
    ctx.lineWidth = 2.5; [[-1, 1], [1, 1]].forEach(([d]) => { for (let k = -1; k <= 1; k++){ ctx.beginPath(); ctx.moveTo(d * 24, 14 + k * 6); ctx.lineTo(d * 60, 10 + k * 12); ctx.stroke(); } });
    // collar + tag
    ctx.fillStyle = SKILLS[j][1]; rr(ctx, -40, 38, 80, 14, 7); ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(0, 60, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3);
    ctx.restore();
    ctx.restore();
    if (o.tag !== false){ const tx = x + f * (o.sit ? 10 : 92) * s, ty = y + ((o.sit ? -168 : -124) - 120) * s; ctx.save(); ctx.translate(tx, ty); const sc = Math.max(.55, s * .8); ctx.scale(sc, sc); chipW(ctx, o.label || SKILLS[j][0], 0, 0, SKILLS[j][1], "#FFFFFF", 30); ctx.restore(); }
  }

  /* ================= KD52: _daftar (wish list, five skill cards burst out and orbit the head) ================= */
  TT.scene(PX + "daftar", "Cerita: kantor sore, daftar belajar ditulis, lima kartu keterampilan jatuh menumpuk jadi menara goyah di tangan tokoh, makin oleng saat SEMUANYA SEKALIGUS", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ on: 0, cues: [] }, f.daftar || {});
    const Ts = K.cues.map((c, j) => T(s, c, .3, idx)), tSpin = T(s, K.spinCue, .2, idx);
    const spd = tt => tt < tSpin ? .9 : .9 + clamp((tt - tSpin) / 1, 0, 1) * 4;
    const ang = (() => { let a = 0; for (let u = 0; u < t; u += .05) a += spd(u) * .05; return a; })();
    base(ctx, s, t, { env: "office", envOpt: { desk: true, deskX: 860, plant: false, rug: true, rugX: 420 },
      front: (c2, c, sts) => { const st = sts[K.on]; if (!st) return; const h = handOf(st), fc = st.face || 1;
        const wob = t < tSpin ? .03 : .03 + clamp((t - tSpin) / 1.2, 0, 1) * .16, n = Ts.filter(x => t >= x).length;
        let px = h[0] + 110 * fc, py = h[1] - 10, ang = 0;
        Ts.forEach((T0, j) => { const k = t - T0; if (k < 0) return; ang += Math.sin(t * (2.2 + j * .3) + j) * wob * (j + 1) * .35;
          const fall = eOut(clamp(k / .45, 0, 1)), tx = px + Math.sin(ang) * 92, ty = py - Math.cos(ang) * 92, x = lerp(tx + (j % 2 ? 260 : -260), tx, fall), y = lerp(ty - 420, ty, fall);
          ctx.save(); ctx.translate(x, y); ctx.rotate(ang + (1 - fall) * 2); skillCard(ctx, j, 0, 0, 1.25, 0); ctx.restore(); if (k > .4 && k < 1) burstFx(ctx, x, y, k - .4, SKILLS[j][1], 8, 130); px = tx; py = ty; });
        if (t >= tSpin){ ctx.save(); ctx.globalAlpha *= clamp((t - tSpin) / .4, 0, 1); ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ const yy = py - 20 + k * 60, sx = Math.sin(t * 9) * 20; ctx.beginPath(); ctx.moveTo(px - 220 + sx, yy); ctx.lineTo(px - 160 + sx, yy - 10); ctx.moveTo(px + 160 - sx, yy); ctx.lineTo(px + 220 - sx, yy - 10); ctx.stroke(); } ctx.restore(); } },
      over: () => { if (t >= tSpin) popWord(ctx, "SEMUA SEKALIGUS?!", 540, 300, t - tSpin, { size: 70, hold: 2.2, rot: -5 }); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.daftar || {}; (K.cues || []).forEach(c => add(cueT(s, c, .3, i), "pop")); if (K.spinCue) add(cueT(s, K.spinCue, .2, i), "whoosh"); });

  /* ================= KD52: _kucing (five skill cats; chase + dive, all escape) ================= */
  TT.scene(PX + "kucing", "Cerita: taman, lima kucing berkalung label keterampilan berlarian, tokoh mengejar dan menerkam, semuanya lepas", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ on: 0 }, f.kucing || {});
    const tIn = T(s, K.inCue, .2, idx), tEsc = T(s, K.escCue, .3, idx);
    const pos = (j, tt) => { const k = tt - tIn; if (k < 0) return null; const base0 = [120, 330, 560, 780, 980][j], amp = 100 + j * 15, x = base0 + Math.sin(k * (1.6 + j * .3) + j * 2) * amp, y = GY - 10 + (j % 2) * 30;
      const vx = Math.cos(k * (1.6 + j * .3) + j * 2); if (tt >= tEsc){ const e = tt - tEsc, dir = j % 2 ? 1 : -1; return { x: x + dir * e * 1400, y, face: dir, run: 1 }; } return { x, y, face: vx >= 0 ? 1 : -1, run: .8 }; };
    base(ctx, s, t, slipHooks(ctx, Object.assign({ daze: 2 }, K), s, t, idx, { env: "park", envOpt: { time: "day", bench: false },
      front: () => { for (let j = 0; j < 5; j++){ const p = pos(j, t); if (!p) continue; const k = t - tIn - j * .1; if (k < 0) continue; cat(ctx, p.x, p.y, { j, face: p.face, run: p.run, s: 1.1 }, t);
        if (t >= tEsc && t - tEsc < .6) { ctx.save(); ctx.globalAlpha *= 1 - (t - tEsc) / .6; ctx.fillStyle = "#E9DCC6"; ctx.beginPath(); ctx.arc(p.x - p.face * 120, p.y - 20, 40, 0, TAU); ctx.fill(); ctx.restore(); } } },
      over: () => { if (t >= tEsc) popWord(ctx, "LEPAS SEMUA!", 540, 330, t - tEsc, { size: 78, hold: 2, rot: 6 }); } }));
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.kucing || {}; if (K.inCue) add(cueT(s, K.inCue, .2, i), "whoosh"); (K.slips || []).forEach(o => add(tOf(s, o, .3, i), "whoosh")); if (K.escCue) add(cueT(s, K.escCue, .3, i), "ping"); });

  /* ================= KD52: _pilih (rooftop at dusk: the spreadsheet cat walks in and sits by the hero) ================= */
  TT.scene(PX + "pilih", "Cerita: atap kantor senja, rekan bertanya, kucing LEMBAR KERJA berjalan datang lalu duduk manja di kaki tokoh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ j: 3, to: 520, from: 1300 }, f.pilih || {});
    const tIn = T(s, K.inCue, .2, idx), tSit = T(s, K.sitCue, .4, idx);
    base(ctx, s, t, { env: "sunset", envOpt: { hills: true },
      back: () => { ctx.fillStyle = "#6B5A4A"; ctx.fillRect(-2000, GY - 120, 5000, 40); ctx.fillStyle = "#8C7A6A"; ctx.fillRect(-2000, GY - 80, 5000, 600); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-2000, GY - 120); ctx.lineTo(5000, GY - 120); ctx.stroke();
        for (let x = -400; x < 1600; x += 120){ rr(ctx, x, GY - 300, 14, 180, 4); ctx.fillStyle = "#5A4A3A"; ctx.fill(); } ctx.fillStyle = "#5A4A3A"; ctx.fillRect(-2000, GY - 310, 5000, 16); },
      front: () => { if (t < tIn) return; const k = t - tIn, q = clamp(k / 1.6, 0, 1), x = lerp(K.from, K.to, TT.easeIO(q)), sit = t >= tSit;
        cat(ctx, x, GY + 20, { j: K.j, label: K.label || "LEMBAR KERJA", face: -1, run: q < 1 ? .6 : 0, sit, s: .95, mood: sit ? "happy" : "", glow: sit ? clamp((t - tSit) / .5, 0, 1) * (.7 + .3 * Math.sin(t * 5)) : 0 }, t);
        if (sit){ for (let h = 0; h < 3; h++){ const kk = ((t - tSit) * .8 + h / 3) % 1; ctx.save(); ctx.globalAlpha *= 1 - kk; ctx.translate(x - 30 + h * 30, GY - 240 - kk * 120); ctx.scale(.8, .8); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-24, -4, -12, -22, 0, -8); ctx.bezierCurveTo(12, -22, 24, -4, 0, 14); ctx.fill(); ctx.restore(); } } },
      over: () => { if (t >= tSit) stampBox(ctx, K.stamp || "PILIH SATU", 540, 330, t - tSit, GREEN, 72, -.06); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.pilih || {}; if (K.inCue) add(cueT(s, K.inCue, .2, i), "whoosh"); if (K.sitCue) add(cueT(s, K.sitCue, .4, i), "chime"); });

  /* ================= KD52: _latih (night desk: treats RUMUS/TABEL/GRAFIK feed the cat, it grows; report stack shrinks) ================= */
  function treat(ctx, x, y, lab, col, s){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 70, 34, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(62, 0); ctx.lineTo(100, -26); ctx.lineTo(100, 26); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-40, -6, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    textC(ctx, lab, 6, 10, 26, "#FFFFFF", 900, 110); ctx.restore(); }
  TT.scene(PX + "latih", "Cerita: meja malam tiap Kamis, camilan ikan RUMUS/TABEL/GRAFIK dilempar ke kucing LEMBAR KERJA yang membesar dan bersinar, tumpukan rekap menyusut", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ j: 3, catX: 760, stackX: 980, treats: [] }, f.latih || {});
    const tr = K.treats.map((x, j) => Object.assign({ T: T(s, x.cue, .3, idx) }, x)), tShrink = T(s, K.shrinkCue, .2, idx), tDone = T(s, K.doneCue, .4, idx);
    const fed = tr.filter(x => t >= x.T + .6).length, grow = 1 + fed * .13, top = GY - 330;
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plant: false, rug: false },
      front: (c2, c, sts) => {
        prop(ctx, "desk", 700, GY - 40, { s: 1.15, laptop: true, lx: -200, mug: false, papers: false }, t);
        glowAt(ctx, 560, top - 200, 320, "#FFD9A0", .4);
        const sh = t < tShrink ? 0 : TT.easeIO(clamp((t - tShrink) / Math.max(.6, tDone - tShrink), 0, 1)), n = Math.round(lerp(12, 2, sh));
        for (let k = 0; k < n; k++){ ctx.save(); ctx.translate(K.stackX + Math.sin(k * 1.7) * 6, top - 6 - k * 22); ctx.rotate((rnd(k) - .5) * .06); rr(ctx, -80, -20, 160, 22, 4); ctx.fillStyle = k % 2 ? PAPER : "#F3E6D2"; ctx.fill(); ol(ctx, 3); ctx.restore(); }
        chipW(ctx, "REKAP", K.stackX, top - 40 - n * 22, NAVY, "#FFFFFF", 28);
        const catY = top - 4; cat(ctx, K.catX, catY, { j: K.j, label: K.label || "LEMBAR KERJA", face: -1, sit: true, s: .85 * grow, mood: fed ? "happy" : "", glow: fed / 3, tag: true }, t);
        const st = sts[0]; const h = st ? handOf(st) : [300, 1200];
        tr.forEach((x, j) => { const k = t - x.T; if (k < 0 || k > .65) return; const q = k / .6, px = lerp(h[0], K.catX, q), py = lerp(h[1], catY - 150 * grow, q) - Math.sin(q * Math.PI) * 260; treat(ctx, px, py, x.label, x.col || ORANGE, 1.3); });
        tr.forEach((x, j) => { const k = t - x.T - .6; if (k >= 0 && k < .8) burstFx(ctx, K.catX, catY - 120 * grow, k, GOLD, 10, 160); });
      },
      over: () => { tr.forEach((x, j) => { const k = t - x.T, nx = tr[j + 1] ? tr[j + 1].T : tShrink; if (k < 0 || t > nx) return; popChip(ctx, x.chip || x.label, 540, 300, k, x.col || ORANGE, "#FFFFFF", 46); });
        if (t >= tShrink && t < tDone) popChip(ctx, "BULAN KEENAM", 540, 300, t - tShrink, NAVY, "#FFFFFF", 46);
        if (t >= tDone) stampBox(ctx, K.stamp || "1 HARI JADI 1 JAM", 540, 320, t - tDone, GREEN, 66, -.06); } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.latih || {}; (K.treats || []).forEach(x => { const a = cueT(s, x.cue, .3, i); add(a, "whoosh"); add(a + .6, "pop"); }); if (K.shrinkCue) add(cueT(s, K.shrinkCue, .2, i), "whoosh"); if (K.doneCue) add(cueT(s, K.doneCue, .4, i), "chime"); });

  /* ================= KD52 BG: sleeping spreadsheet cat on the sofa ================= */
  BG.kucingTidur = (ctx, t, o) => { prop(ctx, "sofa", o.sofaX ?? 560, GY - 10, { s: 1.05, color: "#2F6F73" }, t); cat(ctx, (o.sofaX ?? 560) + 190, GY - 185, { j: 3, sleep: true, s: .95, tag: false }, t);
    for (let k = 0; k < 3; k++){ const q = (t * .5 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; textC(ctx, "z", (o.sofaX ?? 560) + 240 + q * 40 + k * 6, GY - 290 - q * 120, 30 + k * 8, "#FFFFFF", 900); ctx.restore(); } };
})();
