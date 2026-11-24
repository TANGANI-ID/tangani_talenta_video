/* Scene pack j2611221631543: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SP51, RN51, KD51, JS51, SC51.
   Layout prefix j2611221631543_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[] (+acc {headset, shades, shadesCue}), cam[], camOpt, props[], cards[], stamp, front) plus base() extras:
     shots [{at|cue, env, toons, cam, ...}] (cream flash cut), hold [{on, kind, cue}], pops, stamps, tags, steps, confetti, bg "parkir"
   Set pieces (layout suffix):
     SP51 _slot     slot machine CAPAIANKU above the head: spins, ? ? ? + smoke / jackpot with achievement icons + coins   f.slot
          _museum   night "museum of the year": cloths pulled off pedestals, successes glow gold, unfinished ones flicker   f.museum
     RN51 _piala    gold team trophy PROYEK SELESAI, "oke lanjut kerja", team leaves, gold fades gray and steams away       f.piala
          _parkir   office motorbike parking at dusk: whisper by the bikes, boss overhears behind a concrete pillar         f.whisper
          _lampion  rooftop at dusk: string of paper lanterns, each member's story lights their lantern (name + role),
                    then all glow together, PROYEK KITA                                                                   f.lampion
     KD51 _autopilot night office: AI answer types itself on a giant laptop, select all, envelope shoots off, shades drop   f.auto
          _alasan   meeting: AI printout floats up, "Kenapa pemasok B?", dots of silence, red marker circles last year's price f.alasan
          _delman   horse-cart: horse wears an AI saddle cloth; reins dropped -> wrong way; reins held -> right road;
                    optional desk shot (AI comparison panel, checks, decision stamp)                                       f.delman / f.meja
     JS51 _rekor    support desk: "?" bubbles fly to the agents' heads and turn into green checks, REKOR stamp, lights off  f.rekor
          _debu     Monday: REKOR JUMAT photo frame on the wall gathers dust, clock spins, unanswered bubbles pile up         f.debu
          _semen    giant hand print in wet cement "5 MENIT", it hardens and rises into a new floor / sky: the platform floats
                    up, old floor "30 MENIT" sinks away, guide plaques, BATAS MINIMAL line                                 f.semen
     SC51 _lemari   jungle hilltop, phone held high with no signal -> home wardrobe spits the wrong things (BUKAN!)        f.bukit / f.lemari
          _sinyal   split screen: hospital corridor (bill due, call fails) | jungle night, family money map locked in his head f.left / f.right
          _map      dining table: MAP KELUARGA opens as a pop-up book (accounts, policy, loan due date, wardrobe location)   f.map
          _nyamuk   living room at night: PIN & password buzz like mosquitoes, zapped by an electric racket                f.nyamuk
     _adegan  generic story shot with the extras above (used for the action scenes) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221631543_";
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
      if (a.acc) layer(ctx, c, 1, () => drawAcc(ctx, st, a.acc, s, t));
      holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
        drawItemX(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); }));
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
    if (f.steps){ const y0 = f.stepsY || 250, SO = f.stepsOut ? T(s, f.stepsOut, .6, idx) : 1e9; f.steps.forEach((st, j) => { const T0 = tOf(s, st, .3, idx); if (t < T0 || t > SO + .4) return; ovs.push(() => { const q = eBack(clamp((t - T0) / .4, 0, 1)), y = y0 + j * 104;
        ctx.save(); ctx.globalAlpha *= 1 - clamp((t - SO) / .4, 0, 1); ctx.translate(540 + (1 - q) * -700 + clamp((t - SO) / .4, 0, 1) * 900, y); ctx.rotate(-.015 + j * .012); fit(ctx, st.text, 640, 46, 900); const w = Math.min(860, ctx.measureText(st.text).width + 170);
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
    (f0.stamps || []).forEach(p => add(tOf(s, p, .4, i), "ping"));
    (f0.steps || []).forEach(p => add(tOf(s, p, .3, i), "whoosh"));
    if (f0.keys) (f0.keys.caps || []).forEach((row, r) => row.forEach((c2, j) => add(tOf(s, f0.keys, .3, i) + r * .6 + j * .18, "pop")));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= _adegan: generic shot with extras ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, kata pop, tombol, langkah, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= shared extras for this pack ================= */
  const GRAY = "#9A9590", SKY = "#5B7DB1", PINK = "#E58BA0", PURPLE = "#7A3B8F";
  const mixC = (a, b, q) => { const p = x => [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)]; const A = p(a), B = p(b);
    return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(q, 0, 1))).toString(16).padStart(2, "0")).join(""); };
  const headOf = (st) => { const k = st.size / 92, sitD = st.pose === "sit" ? 13 * k : 0, h = toonHead(st); return [h[0], h[1] + sitD, 20 * k]; };
  const qIn = (t, T0, d) => t < T0 ? 0 : clamp((t - T0) / (d || .4), 0, 1);
  const bounce = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  function thinkDots(ctx, x0, y0, x1, y1, q){ for (let i = 0; i < 3; i++){ const a = (i + 1) / 4; if (q < a) continue; const r = 10 + i * 7; ctx.beginPath(); ctx.arc(lerp(x0, x1, a), lerp(y0, y1, a), r, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); } }
  function worldChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chipW(ctx, txt, 0, 0, bg, fg, size || 34); ctx.restore(); }
  /* accessories drawn right after a toon (world): headset, shades */
  function drawAcc(ctx, st, acc, s, t){
    const [hx, hy, r] = headOf(st), f = st.face || 1, k = st.size / 92;
    if (acc.headset){ ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 7 * k / 7.8 + 6; ctx.beginPath(); ctx.arc(hx, hy - 2 * k, r * 1.08, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
      ctx.strokeStyle = "#3B3640"; ctx.lineWidth = 5; ctx.stroke();
      const ex = hx - f * r * .98, ey = hy + 1 * k; rr(ctx, ex - 4.5 * k, ey - 6 * k, 9 * k, 12 * k, 3 * k); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 5);
      ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex, ey + 4 * k); ctx.quadraticCurveTo(ex + f * 4 * k, ey + 16 * k, hx + f * 9 * k, hy + 13 * k); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx + f * 9 * k, hy + 13 * k, 2.6 * k, 0, TAU); ctx.fillStyle = acc.micCol || ORANGE; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    if (acc.shades){ const T0 = acc.shadesCue ? cueT(s, acc.shadesCue, .5, G.scene) : -1; if (t >= T0){ const q = clamp((t - T0) / .35, 0, 1), dy = (1 - eOut(q)) * -26 * k;
      ctx.save(); ctx.translate(hx + f * 3 * k, hy - 3 * k + dy); ctx.fillStyle = "#1E1A22"; [-1, 1].forEach(d => { rr(ctx, d * 1.2 * k - (d < 0 ? 12 * k : 0) + (d > 0 ? 0 : 0), -4 * k, 11 * k, 7.5 * k, 3 * k); ctx.fill(); ol(ctx, 4); });
        ctx.fillRect(-1.5 * k, -2.5 * k, 3 * k, 2 * k); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fillRect(-9 * k, -3 * k, 3 * k, 2 * k); ctx.fillRect(4 * k, -3 * k, 3 * k, 2 * k); ctx.restore(); } }
  }
  /* extra hand-held items, falls back to drawItem */
  function drawItemX(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1;
    if (kind === "calc"){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.12); rr(ctx, -60, -150, 120, 170, 14); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 5);
      rr(ctx, -46, -136, 92, 40, 6); ctx.fillStyle = "#BFE8C9"; ctx.fill(); textC(ctx, o.text || "12.000", 0, -106, 22, OUT, 900, 84);
      for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 3; c2++){ const on = Math.floor(t * 6) % 9 === r * 3 + c2; rr(ctx, -44 + c2 * 31, -84 + r * 32, 26, 24, 5); ctx.fillStyle = on ? ORANGE : "#E9E2D6"; ctx.fill(); }
      ctx.restore(); return; }
    if (kind === "racket"){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0); rr(ctx, -14, -40, 28, 120, 10); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.ellipse(0, -160, 82, 118, 0, 0, TAU); ctx.fillStyle = hexA("#BFE2EA", .25); ctx.fill(); ctx.lineWidth = 16; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = "#2F6F73"; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, -160, 76, 112, 0, 0, TAU); ctx.clip(); ctx.strokeStyle = hexA("#E9E2D6", .8); ctx.lineWidth = 2.5; for (let i = -90; i <= 90; i += 16){ ctx.beginPath(); ctx.moveTo(i, -290); ctx.lineTo(i, -30); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-90, -160 + i * 1.3); ctx.lineTo(90, -160 + i * 1.3); ctx.stroke(); } ctx.restore();
      if (o.zap){ ctx.strokeStyle = hexA("#BFF4FF", .9); ctx.lineWidth = 5; for (let i = 0; i < 5; i++){ const a = rnd(i + Math.floor(t * 20)) * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 40, -160 + Math.sin(a) * 60); ctx.lineTo(Math.cos(a) * 110, -160 + Math.sin(a) * 150); ctx.stroke(); } }
      ctx.restore(); return; }
    if (kind === "letter"){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.1 + Math.sin(t * 3) * .03); rr(ctx, -80, -120, 160, 200, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5);
      rr(ctx, -68, -108, 136, 34, 6); ctx.fillStyle = RED; ctx.fill(); textC(ctx, o.text || "TAGIHAN", 0, -83, 22, "#FFFFFF", 900, 126); for (let i = 0; i < 4; i++){ ctx.fillStyle = "#B9A58E"; rr(ctx, -60, -52 + i * 28, 120 - i * 18, 10, 5); ctx.fill(); }
      ctx.restore(); return; }
    drawItem(ctx, kind, x, y, t, o);
  }

  /* ================= SP51 _slot: slot machine of "achievements" above Salma's head ================= */
  const SLOT_FILL = ["star", "chart", "clock", "heart", "target", "briefcase", "rocket", "money"];
  function slotMachine(ctx, x, y, w, o, t){ // x,y = centre
    const h = w * .64, sc = o.q ?? 1; if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 2.2) * .015 + (o.tilt || 0));
    const win = o.state === "win", lose = o.state === "lose";
    if (win) glowAt(ctx, 0, 0, w * .95, GOLD, .35 + .15 * Math.sin(t * 9));
    // lever (right)
    const pull = o.pull || 0; ctx.save(); ctx.translate(w / 2 + 6, -h * .05); ctx.fillStyle = "#B9BDC2"; rr(ctx, -6, -24, 34, 48, 8); ctx.fill(); ol(ctx, 5);
    ctx.rotate(-.35 + pull * 1.5); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(18, -h * .62); ctx.stroke(); ctx.strokeStyle = "#D9DDE2"; ctx.lineWidth = 9; ctx.stroke();
    ctx.beginPath(); ctx.arc(18, -h * .64, 26, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.arc(10, -h * .67, 8, 0, TAU); ctx.fill(); ctx.restore();
    // cabinet
    rr(ctx, -w / 2, -h / 2, w, h, 34); ctx.fillStyle = lose ? "#8E4A3A" : ORANGE; ctx.fill(); ol(ctx, 7);
    rr(ctx, -w / 2 + 14, -h / 2 + 12, w - 28, h * .2, 18); ctx.fillStyle = BROWN; ctx.fill();
    textC(ctx, o.title || "CAPAIANKU", 0, -h / 2 + 12 + h * .15, h * .12, win ? GOLD : "#FFF4E6", 900, w * .8);
    // bulbs
    for (let i = 0; i < 14; i++){ const a = i / 13, bx = -w / 2 + 22 + a * (w - 44), on = win ? (Math.floor(t * 10) + i) % 2 : lose ? 0 : (Math.floor(t * 5) + i) % 3 === 0;
      ctx.beginPath(); ctx.arc(bx, h / 2 - 14, 8, 0, TAU); ctx.fillStyle = on ? (win ? GOLD : "#FFE9C9") : (lose ? "#5A3028" : "#C98A4A"); ctx.fill(); }
    // reels
    const rw = w * .25, rh = h * .5, gap = w * .045, top = -h / 2 + h * .29;
    (o.reels || []).forEach((R, i) => { const rx = -1.5 * rw - gap + i * (rw + gap);
      ctx.save(); rr(ctx, rx, top, rw, rh, 12); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ctx.clip();
      if (R.spin){ const off = (t * 9 + i * .37) % 1; for (let k = -1; k < 3; k++){ const sy = top + rh / 2 + (k - off) * rh * .8; ctx.globalAlpha = .55; icon(ctx, SLOT_FILL[(k + Math.floor(t * 9) + i * 3) & 7], rx + rw / 2, sy, rw * .42, BROWN, 6); }
        ctx.globalAlpha = 1; ctx.fillStyle = hexA("#FFFDF6", .35); ctx.fillRect(rx, top, rw, rh); }
      else { const bq = R.k == null ? 1 : clamp(R.k / .35, 0, 1), dy = (1 - eBack(bq)) * -rh * .5; ctx.translate(0, dy);
        if (R.sym === "?"){ textC(ctx, "?", rx + rw / 2, top + rh * .72, rh * .7, lose ? "#8C8C94" : BROWN, 900); }
        else icon(ctx, R.sym, rx + rw / 2, top + rh * .45, rw * .55, R.col || GREEN, 7); }
      ctx.restore(); rr(ctx, rx, top, rw, rh, 12); ol(ctx, 5);
      ctx.fillStyle = lg2(ctx, top, rh); rr(ctx, rx, top, rw, rh, 12); ctx.fill(); });
    ctx.restore(); }
  function lg2(ctx, top, rh){ const g = ctx.createLinearGradient(0, top, 0, top + rh); g.addColorStop(0, "rgba(43,26,18,.28)"); g.addColorStop(.25, "rgba(43,26,18,0)"); g.addColorStop(.75, "rgba(43,26,18,0)"); g.addColorStop(1, "rgba(43,26,18,.28)"); return g; }
  TT.scene(PX + "slot", "Cerita: mesin slot CAPAIANKU muncul di atas kepala saat ditanya capaian (berputar lalu ? ? ? berasap / jackpot capaian + koin)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ on: 0, w: 500, gapY: 70, syms: ["?", "?", "?"], labels: [] }, f.slot || {});
    const tA = K.appearCue ? T(s, K.appearCue, .2, idx) : (K.appearAt ?? .2), tS = K.spinCue ? T(s, K.spinCue, .3, idx) : (K.spinAt ?? tA + .3), tE = K.stopCue ? T(s, K.stopCue, .6, idx) : (K.stopAt ?? tS + 1.4);
    const win = !!K.win, a0 = (f.toons || [])[K.on], st0 = a0 ? toonState(a0, s, t) : null;
    const mPos = (st) => { const [hx, hy, r] = headOf(st), h = K.w * .64; return [clamp(hx + (K.dx || 0), 330, 750), hy - r - K.gapY - h / 2 + Math.sin(t * 1.7) * 6]; };
    let M = st0 ? mPos(st0) : null;
    base(ctx, s, t, { env: "office",
      spots: { slot: () => M ? [M[0], M[1] + 160, 1.08] : [540, 900, 1] },
      front: (c2, c, sts) => {
        const st = sts[K.on]; if (!st) return; const [hx, hy, r] = headOf(st), h = K.w * .64;
        M = mPos(st); const mx = M[0], my = M[1];
        const q = bounce(t, tA, .45); if (q <= 0) return;
        thinkDots(ctx, hx + (st.face || 1) * r * .4, hy - r * 1.05, mx, my + h / 2 + 10, q);
        const reels = K.syms.map((sym, i) => { const stopI = tE + i * .38; return t < tS ? { sym: K.idle ? K.idle[i] : "?", k: null } : t < stopI ? { spin: true } : { sym, k: t - stopI, col: (K.cols || [])[i] }; });
        const done = t >= tE + .38 * (K.syms.length - 1) + .2, pull = t >= tS && t < tS + .5 ? Math.sin((t - tS) / .5 * Math.PI) : 0;
        slotMachine(ctx, mx, my, K.w, { q, reels, pull, title: K.title, state: done ? (win ? "win" : "lose") : null, tilt: done && !win ? Math.sin((t - tE) * 30) * .03 * Math.exp(-(t - tE) * 3) : 0 }, t);
        if (done && !win) smoke(ctx, mx + K.w * .3, my - h * .45, t, clamp((t - tE - .9) * 2, 0, 1), { n: 6, h: 260, col: "#7C7470", s: 1.1, speed: .7 });
        if (done && win){ const k0 = t - (tE + .38 * (K.syms.length - 1) + .2);
          for (let i = 0; i < 18; i++){ const kk = (k0 * .9 + rnd(i) * .9) % 1.6; if (k0 < rnd(i) * .5) continue; const vx = (rnd(i + 3) - .5) * 700, vy = -500 - rnd(i + 7) * 300, px = mx + vx * kk, py = my + h * .3 + vy * kk + 900 * kk * kk; coin(ctx, px, py, 22, t * 6 + i); } }
      },
      over: (c2, c) => {
        if (!M) return; const done = t >= tE + .38 * (K.syms.length - 1) + .2, h = K.w * .64;
        if (win && done){ const sp = c.toScreen(M[0], M[1] - h / 2); (K.labels || []).forEach((lb, i) => { const sx = 540 + (i - 1) * 300; popChip(ctx, lb, sx, Math.max(380, sp[1] - 46), t - tE - .38 * i - .1, i === 1 ? ORANGE : GREEN, "#FFFFFF", 32, (i - 1) * .04); }); }
        if (K.plan && t >= T(s, K.plan.cue, .4, idx)) popChip(ctx, K.plan.text, 540, 260, t - T(s, K.plan.cue, .4, idx), NAVY, "#FFFFFF", 32, -.03);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.slot || {}; if (K.spinCue){ const a = cueT(s, K.spinCue, .3, i); add(a, "whoosh"); for (let k = 0; k < 4; k++) add(a + .25 + k * .3, "pop"); }
    if (K.stopCue){ const b = cueT(s, K.stopCue, .6, i); [0, 1, 2].forEach(k => add(b + k * .38, "pop")); add(b + .96, K.win ? "chime" : "ping"); } });

  /* ================= SP51 _museum: night museum of one year, cloths pulled off pedestals ================= */
  function exhibit(ctx, kind, t, ok){
    ctx.save(); ctx.lineJoin = "round";
    if (kind === "klien"){ ctx.translate(0, Math.sin(t * 2) * 4); [[-46, "#5B7DB1"], [46, "#7FA563"], [0, ORANGE]].forEach(([dx, col], i) => { const y0 = i === 2 ? -20 : 0; ctx.beginPath(); ctx.ellipse(dx, -40 + y0, 46, 40, 0, Math.PI, 0); ctx.lineTo(dx + 46, -40 + y0); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(dx, -104 + y0, 30, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 5); });
      ctx.beginPath(); ctx.arc(70, -150, 34, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "8", 70, -136, 42, OUT, 900); }
    else if (kind === "katalog"){ ctx.rotate(Math.sin(t * 1.6) * .05); rr(ctx, -95, -190, 190, 180, 14); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 6); rr(ctx, -82, -176, 164, 150, 8); ctx.fillStyle = "#FFF4E6"; ctx.fill();
      for (let r = 0; r < 2; r++) for (let c2 = 0; c2 < 3; c2++){ rr(ctx, -72 + c2 * 52, -166 + r * 70, 42, 58, 6); ctx.fillStyle = [ORANGE, TEAL, PINK, GOLD, SKY, GREEN][r * 3 + c2]; ctx.fill(); } }
    else if (kind === "medal"){ ctx.rotate(Math.sin(t * 2.2) * .08); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-40, -200); ctx.lineTo(0, -110); ctx.lineTo(40, -200); ctx.lineTo(20, -200); ctx.lineTo(0, -150); ctx.lineTo(-20, -200); ctx.closePath(); ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(0, -70, 62, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, -70, 42, 0, TAU); ctx.strokeStyle = "#C98A1B"; ctx.lineWidth = 5; ctx.stroke(); icon(ctx, "graduation", 0, -70, 48, "#8E5A1E", 5); }
    else if (kind === "kanvas"){ ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-20, -250); ctx.moveTo(70, 0); ctx.lineTo(20, -250); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.stroke();
      ctx.save(); ctx.translate(0, -150); ctx.rotate(-.03); rr(ctx, -95, -95, 190, 150, 6); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5);
      ctx.strokeStyle = "#8C8C94"; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(-20, -20, 40, 0, TAU); ctx.moveTo(-80, 40); ctx.lineTo(70, 40); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(-20, -20, 40, Math.PI * .9, Math.PI * 1.6); ctx.lineTo(-20, -20); ctx.fill(); ctx.restore(); }
    else if (kind === "arsip"){ for (let i = 0; i < 7; i++){ const wob = Math.sin(t * 5 + i) * (i * .012); ctx.save(); ctx.translate((rnd(i) - .5) * 30 + Math.sin(t * 5 + i) * i * 2, -i * 26); ctx.rotate(wob + (rnd(i + 4) - .5) * .25); rr(ctx, -80, -24, 160, 26, 4); ctx.fillStyle = i % 2 ? PAPER : "#F3D9B5"; ctx.fill(); ol(ctx, 4); ctx.restore(); }
      for (let i = 0; i < 3; i++){ const q = ((t * .5 + i / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - q; ctx.translate(60 + q * 120, -180 + q * 200); ctx.rotate(q * 6 + i); rr(ctx, -30, -20, 60, 40, 4); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); ctx.restore(); } }
    ctx.restore(); }
  function pedestal(ctx, x, t, o){
    const top = o.top, on = o.on || 0, ok = o.ok, rev = o.rev || 0;
    // spotlight cone
    if (on > 0){ const flick = ok ? 1 : (.55 + .45 * (Math.sin(t * 23) > .2 ? 1 : .3)); const col = ok ? "#FFE3A8" : "#AFC3E8"; ctx.save(); ctx.globalAlpha = on * flick * (ok ? .5 : .32);
      const g = ctx.createLinearGradient(0, top - 900, 0, top); g.addColorStop(0, hexA(col, .0)); g.addColorStop(.3, hexA(col, .7)); g.addColorStop(1, hexA(col, .25)); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x - 40, top - 950); ctx.lineTo(x + 40, top - 950); ctx.lineTo(x + 200, top + 40); ctx.lineTo(x - 200, top + 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 150, 18, 0, 0, TAU); ctx.fill();
    rr(ctx, x - 115, top, 230, GY - top, 8); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 135, top - 26, 270, 34, 8); ctx.fillStyle = "#F7F2EA"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "rgba(43,26,18,.12)"; ctx.fillRect(x + 50, top + 10, 60, GY - top - 14);
    // plaque
    if (rev > 0){ const q = eBack(clamp(rev, 0, 1)); ctx.save(); ctx.translate(x, top + 70); ctx.scale(q, q); rr(ctx, -100, -34, 200, 68, 12); ctx.fillStyle = ok ? GREEN : "#8C8C94"; ctx.fill(); ol(ctx, 5);
      textC(ctx, ok ? "BERHASIL" : "BELUM", 0, 13, 34, "#FFFFFF", 900, 180); ctx.restore(); }
  }
  function cloth(ctx, x, top, q, t){ if (q >= 1) return; const lift = eOut(q) * 700, a = 1 - q; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + q * 160, top - 26 - lift); ctx.rotate(q * .8);
    ctx.beginPath(); ctx.moveTo(-120, 0); ctx.quadraticCurveTo(-110, -200, -30, -230); ctx.quadraticCurveTo(0, -250, 30, -230); ctx.quadraticCurveTo(110, -200, 120, 0); for (let i = 0; i < 6; i++) ctx.quadraticCurveTo(100 - i * 40, 18 + Math.sin(t * 4 + i) * 6, 80 - i * 40, 0); ctx.closePath();
    ctx.fillStyle = "#D8CFC4"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-40, -200); ctx.quadraticCurveTo(-60, -100, -70, -10); ctx.moveTo(40, -200); ctx.quadraticCurveTo(50, -100, 60, -10); ctx.stroke(); ctx.restore(); }
  BG.museum = (ctx, t, o) => {
    const top = GY - 330;
    ctx.fillStyle = "#2A2440"; ctx.fillRect(-2000, -1200, 7000, GY + 1200); // wall
    ctx.fillStyle = "#332B4E"; for (let x = -2000; x < 5000; x += 260){ ctx.fillRect(x, -1200, 120, GY + 1200 - 360); }
    ctx.fillStyle = "#1E1A30"; ctx.fillRect(-2000, GY - 360, 7000, 360); ctx.fillStyle = "#C2691F"; ctx.fillRect(-2000, GY - 372, 7000, 12);
    // floor
    ctx.fillStyle = "#4A3A30"; ctx.fillRect(-2000, GY, 7000, 1200); ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 3; for (let x = -2000; x < 5000; x += 160){ ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x - 80, GY + 400); ctx.stroke(); }
    // entrance banner
    const bx = o.signX ?? 300; ctx.save(); ctx.translate(bx, 600 + Math.sin(t * 1.3) * 4); ctx.strokeStyle = "#B9A58E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-150, -500); ctx.lineTo(-150, -60); ctx.moveTo(150, -500); ctx.lineTo(150, -60); ctx.stroke();
    rr(ctx, -230, -70, 460, 150, 18); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 6); textC(ctx, o.sign || "MUSEUM SETAHUN", 0, -12, 46, GOLD, 900, 410); textC(ctx, o.sign2 || "SALMA", 0, 46, 36, "#FFF4E6", 800, 410); ctx.restore();
    // dim empty frames
    for (let i = 0; i < 9; i++){ const fx = 875 + i * 450; rr(ctx, fx - 70, 560, 140, 170, 8); ctx.strokeStyle = "#8E6A3A"; ctx.lineWidth = 10; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fill(); }
    void top; };
  TT.scene(PX + "museum", "Cerita: museum malam 'setahun', kain penutup ditarik dari alas: yang berhasil bersinar, yang belum redup berkedip", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Mu = Object.assign({ top: GY - 720, items: [], ex: 1.3 }, f.museum || {});
    const items = Mu.items.map((it, j) => Object.assign({ T: T(s, it.cue, .3, idx) }, it));
    base(ctx, s, t, { env: "info", envOpt: { spotX: -2000 },
      back: () => { BG.museum(ctx, t, Mu);
        items.forEach(it => { const k = t - it.T, rev = k < 0 ? 0 : clamp(k / .5, 0, 1); pedestal(ctx, it.x, t, { top: Mu.top, on: k < 0 ? 0 : clamp(k / .25, 0, 1), ok: it.ok, rev: k < .15 ? 0 : (k - .15) / .4 });
          if (k >= 0){ ctx.save(); ctx.translate(it.x, Mu.top - 26); const q = eBack(clamp(k / .45, 0, 1)) * Mu.ex; ctx.scale(q, q); if (it.ok) glowAt(ctx, 0, -110, 190, GOLD, .35 + .1 * Math.sin(t * 6)); exhibit(ctx, it.kind, t, it.ok); ctx.restore();
            if (it.ok && k < 1.2) for (let i = 0; i < 6; i++){ const a = i / 6 * TAU + k * 2; sparkle(ctx, it.x + Math.cos(a) * 150 * (.6 + k * .4), Mu.top - 130 + Math.sin(a) * 110, 14 * (1.2 - k), GOLD); } }
          cloth(ctx, it.x, Mu.top, k < 0 ? 0 : clamp(k / .6, 0, 1), t); });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); ((f.museum || {}).items || []).forEach(it => { const a = cueT(s, it.cue, .3, i); add(a, "whoosh"); add(a + .2, it.ok ? "chime" : "ping"); }); });

  /* ================= RN51 shared: team trophy (gold -> gray steam -> gold with names) ================= */
  function trophy2(ctx, x, y, s, o, t){ // y = bottom of the cup base
    o = o || {}; const g = clamp(o.gray || 0, 0, 1), droop = o.droop || 0;
    const C = mixC(GOLD, "#A8A29A", g), C2 = mixC("#E0A42A", "#8C8680", g), C3 = mixC("#FFF1B8", "#D6D2CC", g);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 - droop * .12)); ctx.lineJoin = "round";
    if (g < .9){ ctx.save(); ctx.globalAlpha *= (1 - g) * .55; ctx.rotate(t * .4); for (let i = 0; i < 12; i++){ ctx.rotate(TAU / 12); ctx.fillStyle = hexA(GOLD, .5); ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(-30, -470); ctx.lineTo(30, -470); ctx.closePath(); ctx.fill(); } ctx.restore(); glowAt(ctx, 0, -220, 330, GOLD, .35 * (1 - g)); }
    rr(ctx, -120, -50, 240, 50, 10); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 6); rr(ctx, -90, -90, 180, 44, 8); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -26, -170, 52, 84, 10); ctx.fillStyle = C2; ctx.fill(); ol(ctx, 6);
    // handles (droop when gray)
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 120, -330); ctx.bezierCurveTo(d * 210, -340 + droop * 60, d * 200, -230 + droop * 90, d * 90, -215 + droop * 40); ctx.strokeStyle = OUT; ctx.lineWidth = 30; ctx.lineCap = "round"; ctx.stroke(); ctx.strokeStyle = C2; ctx.lineWidth = 18; ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(-140, -390); ctx.lineTo(140, -390); ctx.quadraticCurveTo(140, -180, 0, -165); ctx.quadraticCurveTo(-140, -180, -140, -390); ctx.closePath(); ctx.fillStyle = C; ctx.fill(); ol(ctx, 7);
    ctx.fillStyle = hexA(C3, .7); ctx.beginPath(); ctx.ellipse(-70, -310, 20, 60, -.2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -390, 140, 22, 0, 0, TAU); ctx.fillStyle = C2; ctx.fill(); ol(ctx, 6);
    // ribbon
    rr(ctx, -190, -300, 380, 64, 10); ctx.fillStyle = mixC(RED, "#7C7470", g); ctx.fill(); ol(ctx, 5); textC(ctx, o.label || "PROYEK SELESAI", 0, -256, 34, "#FFFFFF", 900, 350);
    if (o.names){ const q = clamp(o.namesQ ?? 1, 0, 1); ctx.save(); ctx.globalAlpha *= q; rr(ctx, -110, -230, 220, 48, 8); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 4); textC(ctx, o.names, 0, -196, 24, GOLD, 900, 200); ctx.restore(); }
    ctx.restore(); }
  function steamUp(ctx, x, y, t, a, col){ if (a <= 0) return; for (let i = 0; i < 9; i++){ const q = ((t * .45) + i / 9) % 1; ctx.save(); ctx.globalAlpha *= a * (1 - q) * .8; ctx.strokeStyle = col || "#D6D2CC"; ctx.lineWidth = 12 * (1 - q * .5); ctx.lineCap = "round";
    const bx = x + (rnd(i) - .5) * 240, by = y - q * 520; ctx.beginPath(); ctx.moveTo(bx, by); ctx.bezierCurveTo(bx - 30, by - 40, bx + 30, by - 70, bx, by - 110); ctx.stroke(); ctx.restore(); } }
  TT.scene(PX + "piala", "Cerita: piala PROYEK SELESAI bersinar di tengah tim, 'oke lanjut kerja', tim bubar, emasnya memudar abu-abu dan menguap", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, y: 960, s: 1 }, f.piala || {});
    const tIn = K.inCue ? T(s, K.inCue, .3, idx) : (K.inAt ?? .2), tG = T(s, K.grayCue, .4, idx);
    base(ctx, s, t, { env: "office",
      spots: { cup: [K.x, K.y - 200, 1.15] },
      back: () => { // display stand behind the team
        const q = bounce(t, tIn, .5); ctx.save(); rr(ctx, K.x - 70, K.y, 140, GY - K.y, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6); rr(ctx, K.x - 110, K.y - 10, 220, 30, 8); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 6); ctx.restore();
        if (q <= 0) return; const g = qIn(t, tG, 1.6); ctx.save(); ctx.translate(K.x, K.y - 10); ctx.scale(q, q); trophy2(ctx, 0, 0, K.s, { gray: g, droop: g, label: K.label }, t); ctx.restore();
        steamUp(ctx, K.x, K.y - 300 * K.s, t, g > 0 ? Math.min(1, g * 2) * (1 - qIn(t, tG + 3.2, 1)) : 0);
        if (t >= tIn && t < tIn + 1.2) for (let i = 0; i < 10; i++){ const a = i / 10 * TAU + t, rr2 = 180 + (t - tIn) * 260; sparkle(ctx, K.x + Math.cos(a) * rr2, K.y - 230 + Math.sin(a) * rr2 * .7, 18 * (1.2 - (t - tIn)), GOLD); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.piala || {}; add(K.inCue ? cueT(s, K.inCue, .3, i) : (K.inAt ?? .2), "chime"); if (K.grayCue) add(cueT(s, K.grayCue, .4, i), "whoosh"); });

  /* ================= RN51 _parkir: office motorbike parking at dusk, whispering by the bikes, boss behind a pillar ================= */
  function motor(ctx, x, y, col, face){ ctx.save(); ctx.translate(x, y); ctx.scale(face || 1, 1); ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 230, 18, 0, 0, TAU); ctx.fill();
    [-150, 150].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -70, 70, 0, TAU); ctx.fillStyle = "#2C2830"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(wx, -70, 30, 0, TAU); ctx.fillStyle = "#B9BDC2"; ctx.fill(); ol(ctx, 4); });
    ctx.beginPath(); ctx.moveTo(-200, -120); ctx.quadraticCurveTo(-190, -230, -60, -230); ctx.lineTo(60, -200); ctx.lineTo(120, -140); ctx.lineTo(60, -110); ctx.lineTo(-170, -100); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    rr(ctx, -170, -270, 190, 44, 20); ctx.fillStyle = "#2C2830"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(120, -140); ctx.lineTo(150, -70); ctx.moveTo(100, -180); ctx.lineTo(130, -320); ctx.lineTo(90, -330); ctx.stroke(); ctx.strokeStyle = "#B9BDC2"; ctx.lineWidth = 7; ctx.stroke();
    rr(ctx, 110, -300, 60, 44, 12); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(160, -278, 13, 0, TAU); ctx.fillStyle = "#FFE3A8"; ctx.fill(); ol(ctx, 3);
    ctx.restore(); }
  BG.parkir = (ctx, t, o) => {
    ctx.fillStyle = "#8C8C94"; ctx.fillRect(-1500, GY - 150, 4200, 1400); ctx.strokeStyle = "#F2E6D0"; ctx.lineWidth = 8; for (let x = -1400; x < 2600; x += 330){ ctx.beginPath(); ctx.moveTo(x, GY - 150); ctx.lineTo(x - 70, GY + 260); ctx.stroke(); }
    // roof beam + lamps
    ctx.fillStyle = "#5A5560"; ctx.fillRect(-1500, 300, 4200, 70); for (let x = -300; x < 1500; x += 420){ ctx.fillStyle = "#FFF4E6"; rr(ctx, x - 70, 368, 140, 24, 10); ctx.fill(); glowAt(ctx, x, 420, 300, "#FFE3A8", .25 + .05 * Math.sin(t * 7 + x)); }
    ctx.fillStyle = "#6E6A70"; [-60, 1140].forEach(x => { ctx.fillRect(x - 40, 370, 80, GY - 520); });
    const bikes = o.bikes || [[400, "#D9483B", 1], [1000, "#5B7DB1", -1]]; bikes.forEach(([x, col, f]) => motor(ctx, x, GY - 120, col, f));
    // P sign
    ctx.save(); ctx.translate(o.signX ?? 860, 520); rr(ctx, -50, -50, 100, 100, 14); ctx.fillStyle = "#3E7DB5"; ctx.fill(); ol(ctx, 5); textC(ctx, "P", 0, 30, 80, "#FFFFFF", 900); ctx.restore();
  };
  TT.scene(PX + "parkir", "Cerita: parkiran motor kantor sore, dua staf berbisik di samping motor, atasan tak sengaja mendengar dari balik tiang beton", (ctx, th, s, t) => {
    const f = s.f || {}, px = (f.bgOpt || {}).pillarX ?? 330;
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      back: () => BG.parkir(ctx, t, f.bgOpt || {}),
      front: () => { rr(ctx, px - 70, 300, 140, GY - 300 + 20, 6); ctx.fillStyle = "#B7B0A4"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = hexA("#FFFFFF", .18); ctx.fillRect(px - 56, 320, 22, GY - 330);
        ctx.fillStyle = "#F2C230"; for (let i = 0; i < 4; i++){ ctx.save(); ctx.beginPath(); ctx.rect(px - 70, GY - 90, 140, 100); ctx.clip(); ctx.translate(px - 90 + i * 70, GY - 90); ctx.rotate(.6); ctx.fillRect(0, 0, 30, 300); ctx.restore(); } ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(px - 70, GY - 90, 140, 100);
        const W = f.whisper; if (W && t >= T(s, W.cue, .3, G.scene)){ const k = t - T(s, W.cue, .3, G.scene); for (let i = 0; i < 4; i++){ const q = ((k * .8) + i / 4) % 1; ctx.save(); ctx.globalAlpha *= (1 - q) * Math.min(1, k * 2); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.setLineDash([6, 10]);
          ctx.beginPath(); ctx.arc(W.x, W.y, 30 + q * 120, -.6, .6); ctx.stroke(); ctx.restore(); } }
      } });
  }, sfxBase);

  /* ================= RN51 _lampion: rooftop at dusk, each team story lights one paper lantern on the string ================= */
  BG.atap = (ctx, t, o) => { // rooftop floor + parapet + plants
    ctx.fillStyle = "#C9A27E"; ctx.fillRect(-1500, GY - 260, 4200, 1400); ctx.strokeStyle = "rgba(59,36,24,.14)"; ctx.lineWidth = 3; for (let x = -1500; x < 2700; x += 140){ ctx.beginPath(); ctx.moveTo(x, GY - 260); ctx.lineTo(x - 60, GY + 300); ctx.stroke(); }
    ctx.fillStyle = "#E9DCC8"; ctx.fillRect(-1500, GY - 420, 4200, 160); ctx.fillStyle = "#D2BFA4"; ctx.fillRect(-1500, GY - 432, 4200, 16);
    [-120, 1200].forEach(px => { rr(ctx, px - 60, GY - 520, 120, 100, 12); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#3E8B4A"; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.ellipse(px - 40 + i * 20, GY - 560 - (i % 2) * 30, 24, 50, (i - 2) * .3, 0, TAU); ctx.fill(); ol(ctx, 3); } });
    // two poles holding the lantern string
    [-160, 1240].forEach(px => { ctx.fillStyle = "#5A3A2A"; rr(ctx, px - 12, 380, 24, GY - 380, 6); ctx.fill(); ol(ctx, 4); });
  };
  const strY = (x, o) => (o.y0 ?? 400) + Math.sin(clamp((x + 160) / 1400, 0, 1) * Math.PI) * (o.sag ?? 130);
  function lantern(ctx, x, y, col, lit, t, sw){ ctx.save(); ctx.translate(x, y); ctx.rotate(sw || 0);
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, 0); ctx.stroke();
    const C = mixC("#E9E2D6", col, .25 + .75 * lit);
    if (lit > 0) glowAt(ctx, 0, 90, 150 + 30 * Math.sin(t * 7 + x), "#FFC46B", .55 * lit);
    rr(ctx, -38, 0, 76, 20, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(0, 90, 72, 76, 0, 0, TAU); ctx.fillStyle = C; ctx.fill(); ol(ctx, 6);
    if (lit > 0){ ctx.save(); ctx.globalAlpha *= lit; const g = ctx.createRadialGradient(0, 90, 0, 0, 90, 72); g.addColorStop(0, "rgba(255,244,200,.95)"); g.addColorStop(1, "rgba(255,200,120,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 90, 70, 74, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 3; [-.55, 0, .55].forEach(k => { ctx.beginPath(); ctx.ellipse(0, 90, Math.abs(k) * 72 + 2, 74, 0, 0, TAU); ctx.stroke(); });
    rr(ctx, -34, 160, 68, 18, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 178); ctx.lineTo(Math.sin(t * 2 + x) * 6, 230); ctx.stroke();
    ctx.restore(); }
  TT.scene(PX + "lampion", "Cerita: atap kantor senja, tali lampion kertas padam; tiap cerita anggota tim menyalakan lampionnya (label nama + peran), lalu semua menyala bersama", (ctx, th, s, t) => {
    const idx = G.scene;
    base(ctx, s, t, { env: "sunset", envOpt: { hills: false }, envFront: false,
      back: (c2, c, sts, R) => { const K = R.f.lampion || {}; BG.atap(ctx, t, {});
        if (K.snack){ const sx = K.snack; rr(ctx, sx - 120, GY - 330, 240, 22, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#6E4428"; ctx.fillRect(sx - 100, GY - 308, 18, 308); ctx.fillRect(sx + 82, GY - 308, 18, 308);
          ctx.beginPath(); ctx.ellipse(sx, GY - 338, 100, 22, 0, 0, TAU); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 4); for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.ellipse(sx - 60 + i * 30, GY - 352 - (i % 2) * 10, 22, 14, i, 0, TAU); ctx.fillStyle = "#D9963A"; ctx.fill(); ol(ctx, 3); } }
      },
      front: (c2, c, sts, R) => { const K = R.f.lampion || {}, o = { y0: K.y0, sag: K.sag };
        ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); for (let x = -160; x <= 1240; x += 20){ const y = strY(x, o); x === -160 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
        const tAll = K.allCue ? T(s, K.allCue, .4, idx) : 1e9;
        (K.lamps || []).forEach((L, i) => { const T0 = L.cue ? T(s, L.cue, .3 + i * .1, idx) : (L.lit ? -1 : 1e9), lit = Math.max(qIn(t, T0, .4), qIn(t, tAll, .5)), sw = Math.sin(t * 2.2 + i) * .05 + (t >= T0 ? Math.sin((t - T0) * 9) * .25 * Math.exp(-(t - T0) * 2.5) : 0);
          ctx.save(); ctx.translate(L.x, strY(L.x, o) + 6); ctx.scale(1.3, 1.3); lantern(ctx, 0, 0, L.col || RED, lit, t, sw); ctx.restore();
          if (t >= T0 && t - T0 < .9) burstFx(ctx, L.x, strY(L.x, o) + 125, t - T0, GOLD, 10, 140);
          if (L.text && t >= T0) worldChip(ctx, L.text, clamp(L.x, 230, 850), strY(L.x, o) + 318, t - T0 - .15, L.col || ORANGE, "#FFFFFF", 40, (i % 2 ? .04 : -.04)); });
        if (t >= tAll) for (let i = 0; i < 14; i++){ const q = ((t - tAll) * .35 + rnd(i)) % 1; sparkle(ctx, -100 + rnd(i + 3) * 1300, strY(540, o) - 100 + q * 500, 10 * (1 - q) + 4, GOLD); }
      },
      over: (c2, c, sts, R) => { const K = R.f.lampion || {}; if (K.allCue){ const k = t - T(s, K.allCue, .4, idx) - .3; if (k >= 0){ stampBox(ctx, K.allText || "PROYEK KITA", 540, 330, k, ORANGE, 84, -.06); confetti(ctx, k); } } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const K = F.lampion || {}; (K.lamps || []).forEach((L, j) => { if (L.cue) add(cueT(s, L.cue, .3 + j * .1, i), "chime"); }); if (K.allCue) add(cueT(s, K.allCue, .4, i) + .3, "chime"); }); });

  /* ================= KD51 _autopilot: night office, AI answer types itself, select-all, sent, sunglasses ================= */
  function bigLaptop(ctx, x, y, w, draw){ // x,y = bottom centre of the base on the desk
    const h = w * .62; ctx.save(); ctx.translate(x, y);
    ctx.beginPath(); ctx.moveTo(-w * .56, 0); ctx.lineTo(w * .56, 0); ctx.lineTo(w * .5, -26); ctx.lineTo(-w * .5, -26); ctx.closePath(); ctx.fillStyle = "#B9BDC2"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -w / 2, -26 - h, w, h, 18); ctx.fillStyle = "#2C2830"; ctx.fill(); ol(ctx, 7);
    ctx.save(); rr(ctx, -w / 2 + 16, -26 - h + 16, w - 32, h - 32, 10); ctx.clip(); ctx.translate(-w / 2 + 16, -26 - h + 16); draw(w - 32, h - 32); ctx.restore();
    ctx.restore(); }
  function chatUI(ctx, W, H, o, t){
    ctx.fillStyle = "#F7F5F0"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, 56); sparkle(ctx, 30, 28, 16, GOLD); textL(ctx, "Asisten AI", 54, 38, 26, "#FFFFFF", 800, W - 80);
    let y = 76; const q1 = o.q || 0;
    if (q1 > 0){ const txt = o.ask || "Pemasok mana yang terbaik?", n = Math.floor(txt.length * clamp(q1, 0, 1)); font(ctx, 700, 22, FAM); const w = Math.min(W - 40, ctx.measureText(txt).width + 30);
      rr(ctx, W - w - 14, y, w, 44, 14); ctx.fillStyle = "#DCE7F7"; ctx.fill(); textL(ctx, txt.slice(0, n), W - w + 1, y + 30, 22, NAVY, 700); y += 58; }
    const a = o.a || 0; if (a > 0){ const L = o.lines || 7, shown = Math.min(L, a * L);
      if (o.sel > 0){ ctx.fillStyle = hexA("#5B9BF0", .45); ctx.fillRect(10, y - 6, (W - 20) * clamp(o.sel, 0, 1), L * 30 + 10); }
      for (let i = 0; i < Math.ceil(shown); i++){ const part = clamp(shown - i, 0, 1); if (i === 0){ font(ctx, 900, 22, FAM); ctx.fillStyle = GREEN; ctx.fillText(("Rekomendasi: " + (o.pick || "Pemasok B")).slice(0, Math.floor(26 * part)), 16, y + 18); }
        else { ctx.fillStyle = "#B9B2A8"; rr(ctx, 16, y + 4, (W - 60) * (.55 + rnd(i) * .45) * part, 14, 7); ctx.fill(); } y += 30; }
      if (a < 1 && Math.floor(t * 4) % 2) { ctx.fillStyle = NAVY; ctx.fillRect(18 + (W - 80) * (shown % 1), y - 26, 4, 22); } }
  }
  TT.scene(PX + "autopilot", "Cerita: kantor malam, jawaban AI mengetik sendiri di laptop raksasa, disalin mentah, amplop melesat terkirim, kacamata hitam turun", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 700, y: 1330, w: 560 }, f.auto || {});
    const tQ = T(s, K.askCue, .3, idx), tA = tQ + 1.0, tSel = T(s, K.selCue, .4, idx), tSend = T(s, K.sendCue, .4, idx);
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plant: false },
      spots: { screen: [K.x, K.y - 200, 1.2] },
      front: () => { // desk + laptop in front of the seated toon's legs
        rr(ctx, K.x - 360, K.y, 720, 30, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); rr(ctx, K.x - 330, K.y + 30, 660, GY - K.y - 30, 6); ctx.fillStyle = "#6E4428"; ctx.fill(); ol(ctx, 5);
        const tk = K.snackX ?? K.x - 270; ctx.save(); ctx.translate(tk, K.y); rr(ctx, -46, -90, 92, 90, 12); ctx.fillStyle = "#F2A03D"; ctx.fill(); ol(ctx, 5); textC(ctx, "KERIPIK", 0, -40, 18, "#FFFFFF", 900, 80); ctx.restore();
        bigLaptop(ctx, K.x + 40, K.y, K.w, (W, H) => chatUI(ctx, W, H, { q: qIn(t, tQ, .8), a: qIn(t, tA, Math.max(.6, tSel - tA - .2)), sel: qIn(t, tSel, .45), pick: K.pick }, t));
        if (t >= tSend){ const k = t - tSend, q = eOut(clamp(k / .7, 0, 1)); if (k < .9){ const ex = K.x + 40 + q * 900, ey = K.y - 300 - q * 380;
          for (let i = 0; i < 5; i++){ ctx.strokeStyle = hexA("#FFF4E6", .7); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex - 80 - i * 30, ey + (i - 2) * 16 + 20); ctx.lineTo(ex - 200 - i * 40, ey + (i - 2) * 16 + 50); ctx.stroke(); }
          envelope(ctx, ex, ey, 150, "#FFFDF6", "", -.4); } }
      },
      over: (c2, c) => {
        if (t >= tSel) popChip(ctx, K.selText || "SALIN SEMUA", 360, 330, t - tSel, SKY, "#FFFFFF", 38, -.04);
        if (t >= tSend) popChip(ctx, K.sendText || "TERKIRIM KE BU HANA", 600, 430, t - tSend - .3, GREEN, "#FFFFFF", 34, .03);
        const B = K.done; if (B && t >= T(s, B.cue, .4, idx)) popWord(ctx, B.text || "BERES!", 560, 600, t - T(s, B.cue, .4, idx), { size: 120, hold: 2.4, rot: -6 });
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.auto || {}; if (K.askCue) add(cueT(s, K.askCue, .3, i), "pop"); if (K.selCue) add(cueT(s, K.selCue, .4, i), "pop"); if (K.sendCue) add(cueT(s, K.sendCue, .4, i), "whoosh"); if (K.done) add(cueT(s, K.done.cue, .4, i), "chime"); });

  /* ================= KD51 _alasan: meeting, the AI printout floats up, 'why B?', red marker circles last year's price ================= */
  function answerSheet(ctx, x, y, w, o, t){ const h = w * .74, q = o.q ?? 1; if (q <= 0) return; ctx.save(); ctx.translate(x, y + Math.sin(t * 1.8) * 6); ctx.scale(q, q); ctx.rotate(-.025 + Math.sin(t * 1.3) * .01);
    rr(ctx, -w / 2 + 10, -h / 2 + 14, w, h, 14); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fill(); rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.clip(); ctx.fillStyle = NAVY; ctx.fillRect(-w / 2, -h / 2, w, 70); ctx.restore(); rr(ctx, -w / 2, -h / 2, w, h, 14); ol(ctx, 6); sparkle(ctx, -w / 2 + 40, -h / 2 + 35, 16, GOLD); textL(ctx, "JAWABAN AI", -w / 2 + 66, -h / 2 + 47, 30, "#FFFFFF", 900, w - 100);
    const L = o.rows || [["Rekomendasi", "Pemasok B"], ["Harga", "Rp 9.500/kg"], ["Kirim", "2 hari"]];
    L.forEach((r, i) => { const yy = -h / 2 + 130 + i * 74; textL(ctx, r[0], -w / 2 + 34, yy, 28, "#8C7A66", 800, w * .42); textL(ctx, r[1], -w / 2 + w * .46, yy, 32, i === 0 ? GREEN : BROWN, 900, w * .5);
      ctx.fillStyle = hexA(BROWN, .12); ctx.fillRect(-w / 2 + 24, yy + 22, w - 48, 3); });
    if (o.mark > 0){ const i = o.markRow ?? 1, yy = -h / 2 + 130 + i * 74 - 12, cx = -w / 2 + w * .46 + w * .22; ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath();
      ctx.ellipse(cx, yy, w * .27, 40, -.04, -1.2, -1.2 + TAU * 1.05 * clamp(o.mark, 0, 1)); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "alasan", "Cerita: ruang rapat, lembar jawaban AI melayang, 'Kenapa pemasok B?', tokoh terdiam bertitik-titik, spidol merah melingkari harga lama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, y: 470, w: 620 }, f.alasan || {});
    const tIn = K.inCue ? T(s, K.inCue, .3, idx) : (K.inAt ?? .2), tM = T(s, K.markCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 1000 },
      over: (c2, c, sts) => {
        answerSheet(ctx, K.x, K.y, K.w, { q: bounce(t, tIn, .5), mark: qIn(t, tM, .7), rows: K.rows, markRow: K.markRow }, t);
        if (t >= tM + .6) stampBox(ctx, K.stamp || "HARGA TAHUN LALU", 600, K.y + K.w * .37 + 10, t - tM - .6, RED, 54, -.07);
        const D = K.dots; if (D && t >= T(s, D.cue, .4, idx) && t < T(s, D.outCue, .3, idx)){ const st = sts[D.on ?? 0]; if (st){ const [hx, hy, r] = headOf(st), p = c.toScreen(hx, hy - r * 1.6); const k = t - T(s, D.cue, .4, idx);
          for (let i = 0; i < 3; i++){ const a = clamp(k * 3 - i * .6, 0, 1); ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(p[0] - 50 + i * 50, p[1] - Math.abs(Math.sin(t * 5 + i)) * 10, 14, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.restore(); } } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.alasan || {}; add(K.inCue ? cueT(s, K.inCue, .3, i) : (K.inAt ?? .2), "whoosh"); if (K.markCue){ add(cueT(s, K.markCue, .5, i), "whoosh"); add(cueT(s, K.markCue, .5, i) + .6, "ping"); } });

  /* ================= KD51 _delman: AI horse pulls a cart; reins dropped -> wrong way; reins held -> right road (+ desk shot) ================= */
  function horse(ctx, x, y, t, o){ // y = ground; faces right
    o = o || {}; const run = o.run ?? 1, ph = t * 11 * run, bob = Math.abs(Math.sin(ph)) * 10 * run, look = o.look || 0;
    const sc = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 190, 18, 0, 0, TAU); ctx.fill();
    const body = "#A8673A", dark = "#7A4526", leg = (lx, a) => { const sw = Math.sin(ph + a) * .55 * run; ctx.save(); ctx.translate(lx, -260 - bob); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 120); ctx.lineTo(sw * 30, 246); ctx.stroke(); ctx.strokeStyle = a > 1 ? dark : body; ctx.lineWidth = 22; ctx.stroke(); ctx.fillStyle = OUT; rr(ctx, -16 + sw * 30, 236, 34, 18, 5); ctx.fill(); ctx.restore(); };
    leg(-110, 2.2); leg(110, 1.2); // far legs
    // tail
    ctx.save(); ctx.translate(-170, -330 - bob); ctx.rotate(.6 + Math.sin(ph * .5) * .3); ctx.fillStyle = "#3B2418"; ctx.beginPath(); ctx.ellipse(-20, 60, 22, 80, .3, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, -330 - bob, 190, 92, 0, 0, TAU); ctx.fillStyle = body; ctx.fill(); ol(ctx, 6);
    // saddle cloth AI
    rr(ctx, -80, -410 - bob, 160, 130, 16); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#7FD0FF", .7); ctx.lineWidth = 3; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-66, -390 + i * 36 - bob); ctx.lineTo(-30, -390 + i * 36 - bob); ctx.lineTo(-20, -380 + i * 36 - bob); ctx.stroke(); }
    textC(ctx, "AI", 14, -322 - bob, 64, GOLD, 900); sparkle(ctx, 58, -380 - bob, 12 + Math.sin(t * 8) * 4, GOLD);
    leg(-120, 0); leg(120, Math.PI);
    // neck + head (look: -1 wrong way down, +1 forward)
    ctx.save(); ctx.translate(150, -370 - bob); ctx.rotate(-.75 + look * .35 + Math.sin(ph) * .05 * run);
    ctx.beginPath(); ctx.moveTo(-40, 40); ctx.lineTo(40, 40); ctx.lineTo(50, -170); ctx.lineTo(-20, -170); ctx.closePath(); ctx.fillStyle = body; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#3B2418"; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.ellipse(-30, 20 - i * 40, 18, 28, .3 + Math.sin(ph + i) * .2, 0, TAU); ctx.fill(); }
    ctx.translate(20, -190); ctx.rotate(1.25); ctx.beginPath(); ctx.ellipse(40, 0, 95, 50, 0, 0, TAU); ctx.fillStyle = body; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.ellipse(110, 8, 32, 34, 0, 0, TAU); ctx.fillStyle = "#C98A5A"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(120, 0, 5, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(20, -16, 12, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(24, -16, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-30, -40); ctx.lineTo(-20, -90); ctx.lineTo(0, -44); ctx.closePath(); ctx.fillStyle = body; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(70, -40); ctx.lineTo(80, 44); ctx.moveTo(40, 30); ctx.lineTo(130, 30); ctx.stroke();
    ctx.restore();
    ctx.restore();
    const a1 = -.75 + look * .35 + Math.sin(ph) * .05 * run, rot2 = (px, py, a) => [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)];
    let p = rot2(92, 34, 1.25); p = rot2(p[0] + 20, p[1] - 190, a1); return [x + (150 + p[0]) * sc, y + (-370 - bob + p[1]) * sc];
  }
  function cart(ctx, x, y, t, o, part){ // y = ground; x = cart centre
    o = o || {}; const run = o.run ?? 1, rot = t * 6 * run;
    ctx.save(); ctx.translate(x, y); ctx.lineJoin = "round";
    if (part === "back"){ // canopy + back post
      ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-200, -300); ctx.lineTo(-200, -830); ctx.moveTo(120, -300); ctx.lineTo(120, -830); ctx.stroke(); ctx.strokeStyle = "#E9C46A"; ctx.lineWidth = 7; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-250, -830); ctx.quadraticCurveTo(-40, -950, 170, -830); ctx.lineTo(170, -810); ctx.lineTo(-250, -810); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6);
      for (let i = 0; i < 8; i++){ ctx.beginPath(); ctx.arc(-225 + i * 55, -806, 14, 0, Math.PI); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); }
      ctx.restore(); return; }
    // body
    rr(ctx, -260, -330, 420, 150, 16); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; rr(ctx, -240, -312, 380, 112, 10); ctx.stroke();
    // shafts to horse
    ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(150, -270); ctx.lineTo(470, -330); ctx.stroke(); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 9; ctx.stroke();
    // wheel
    ctx.save(); ctx.translate(-40, -150); ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 16; ctx.stroke();
    ctx.rotate(rot); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 9; for (let k = 0; k < 6; k++){ ctx.rotate(Math.PI / 6 * 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(140, 0); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.restore();
    ctx.restore(); }
  function signPost(ctx, x, y, q, arrows){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.fillStyle = "#7A4A2E"; rr(ctx, -12, -520, 24, 520, 6); ctx.fill(); ol(ctx, 5);
    arrows.forEach((a, i) => { const yy = -480 + i * 120, d = a.dir || 1; ctx.save(); ctx.translate(0, yy); ctx.rotate(a.rot || 0); font(ctx, 900, 34, FAM); const w = Math.max(220, ctx.measureText(a.text).width + 80);
      ctx.beginPath(); ctx.moveTo(-d * 20, -40); ctx.lineTo(d * (w - 40), -40); ctx.lineTo(d * w, 0); ctx.lineTo(d * (w - 40), 40); ctx.lineTo(-d * 20, 40); ctx.closePath(); ctx.fillStyle = a.col || GREEN; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(a.text, d * (w / 2 - 10), 12); ctx.textAlign = "left"; ctx.restore(); });
    ctx.restore(); }
  TT.scene(PX + "delman", "Cerita: delman dengan kuda berpelana AI melaju; tali kekang dilepas -> kuda belok ke arah salah; tali dipegang -> jalan benar (bisa diawali shot meja kerja)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene;
    const D0 = Object.assign({ x0: 300, v: 240, ground: GY }, f0.delman || {});
    const X = (tt, D) => D.x0 + D.v * Math.max(0, tt - (D.t0 || 0));
    const st0 = f0.toons && f0.toons[0] ? toonState(f0.toons[0], s, t) : null; void st0;
    base(ctx, s, t, { env: "street",
      spots: { delman: () => { const D = Object.assign({}, D0, (shotOf(s, t).F.delman) || {}); return [X(t, D) + 300, D.camY ?? 1170, D.zoom ?? .92]; } },
      back: (c2, c, sts, R) => { const F = R.f;
        if (F.delman){ const D = Object.assign({ x0: 300, v: 240 }, F.delman), x = X(t, D), loose = D.looseCue ? qIn(t, T(s, D.looseCue, .3, idx), .5) : 0, wrong = D.wrongCue ? qIn(t, T(s, D.wrongCue, .3, idx), 1.2) : 0;
          if (D.sign) signPost(ctx, D.sign.ahead != null ? X(T(s, D.sign.cue, .3, idx), D) + D.sign.ahead : D.sign.x, GY - 120, bounce(t, T(s, D.sign.cue, .3, idx), .5), D.sign.arrows);
          ctx.save(); ctx.translate(x, GY); ctx.rotate(wrong * .07 + (wrong > 0 ? Math.sin(t * 30) * .012 * wrong : 0)); ctx.translate(-x, -GY);
          cart(ctx, x, GY, t, D, "back"); ctx.restore();
          const st = sts[0]; if (st){ const k = st.size / 92; st.x = x - 70; st.y = GY - 300 + 15 * k + wrong * 30; } }
        if (F.meja){ const M = F.meja; prop(ctx, "desk", M.x ?? 760, GY, { laptop: true, papers: true, mug: true, s: .95 }, t); }
      },
      front: (c2, c, sts, R) => { const F = R.f;
        if (F.delman){ const D = Object.assign({ x0: 300, v: 240 }, F.delman), x = X(t, D), loose = D.looseCue ? qIn(t, T(s, D.looseCue, .3, idx), .5) : 0, wrong = D.wrongCue ? qIn(t, T(s, D.wrongCue, .3, idx), 1.2) : 0, tight = D.tight ? 1 : 0;
          ctx.save(); ctx.translate(x, GY); ctx.rotate(wrong * .07 + (wrong > 0 ? Math.sin(t * 30) * .012 * wrong : 0)); ctx.translate(-x, -GY);
          const mouth = horse(ctx, x + 540, GY, t, { run: 1, look: -wrong, s: 1.3 });
          cart(ctx, x, GY, t, D, "front");
          // reins from the hands to the horse's mouth
          const st = sts[0]; if (st){ const hp = handOf(st), sag = 40 + loose * 320 - tight * 30; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(hp[0], hp[1] + loose * 160); ctx.quadraticCurveTo((hp[0] + mouth[0]) / 2, Math.max(hp[1], mouth[1]) + sag, mouth[0], mouth[1]); ctx.stroke();
            ctx.strokeStyle = tight ? GOLD : "#B5643C"; ctx.lineWidth = 5; ctx.stroke(); if (tight) glowAt(ctx, (hp[0] + mouth[0]) / 2, (hp[1] + mouth[1]) / 2, 120, GOLD, .25 + .1 * Math.sin(t * 6)); }
          ctx.restore();
          for (let i = 0; i < 6; i++){ const q = ((t * 1.6) + i / 6) % 1; ctx.save(); ctx.globalAlpha *= (1 - q) * .55; ctx.fillStyle = "#E6D2B2"; ctx.beginPath(); ctx.arc(x - 60 - q * 260, GY - 20 - q * 60, 18 + q * 40, 0, TAU); ctx.fill(); ctx.restore(); }
 }
        if (F.meja){ const M = F.meja, ai = M.aiCue ? bounce(t, T(s, M.aiCue, .3, idx), .5) : 0;
          if (ai > 0){ ctx.save(); ctx.translate(M.panelX ?? 330, M.panelY ?? 720); ctx.scale(ai, ai); rr(ctx, -230, -170, 460, 340, 26); ctx.fillStyle = hexA(NAVY, .92); ctx.fill(); ctx.strokeStyle = "#7FD0FF"; ctx.lineWidth = 5; ctx.stroke();
            sparkle(ctx, -180, -122, 18, GOLD); textL(ctx, "AI: POIN PEMBANDING", -150, -110, 30, "#FFFFFF", 900, 360);
            (M.points || []).forEach((p, i) => { const q = bounce(t, T(s, M.aiCue, .3, idx) + .35 + i * .3, .35); if (q <= 0) return; ctx.save(); ctx.translate(-190, -40 + i * 76); ctx.scale(q, q); rr(ctx, 0, -28, 380, 56, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); textL(ctx, (i + 1) + ". " + p, 20, 12, 30, NAVY, 800, 340); ctx.restore(); });
            ctx.restore(); }
          const ck = (M.checks || []); ck.forEach((p, i) => { const T0 = T(s, p.cue, .4, idx); if (t < T0) return; const q = bounce(t, T0, .35); ctx.save(); ctx.translate((M.panelX ?? 330) + 260, (M.panelY ?? 720) - 40 + i * 76); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-3, 10); ctx.lineTo(14, -10); ctx.stroke(); ctx.restore(); }); }
      },
      over: (c2, c, sts, R) => { const F = R.f;
        if (F.delman){ const D = F.delman; (D.words || []).forEach((w, i) => { const k = t - T(s, w.cue, .3 + i * .1, idx); popWord(ctx, w.text, w.x ?? 540, w.y ?? 420, k, { size: w.size || 110, hold: w.hold || 1.3, rot: w.rot ?? -6, col: w.col }); }); }
        if (F.meja){ const M = F.meja; if (M.decide){ const k = t - T(s, M.decide.cue, .4, idx); if (k >= 0) stampBox(ctx, M.decide.text, 600, 330, k, GREEN, 70, -.07); if (k >= 0 && k < .9) burstFx(ctx, 600, 330, k, GREEN, 12, 220); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { const D = F.delman; if (D){ if (D.looseCue) add(cueT(s, D.looseCue, .3, i), "whoosh"); if (D.wrongCue) add(cueT(s, D.wrongCue, .3, i), "ping"); if (D.sign) add(cueT(s, D.sign.cue, .3, i), "pop"); (D.words || []).forEach((w, j) => add(cueT(s, w.cue, .3 + j * .1, i), "pop")); }
    const M = F.meja; if (M){ if (M.aiCue) add(cueT(s, M.aiCue, .3, i), "chime"); (M.checks || []).forEach(p => add(cueT(s, p.cue, .4, i), "pop")); if (M.decide) add(cueT(s, M.decide.cue, .4, i), "chime"); } }); });

  /* ================= JS51 shared: chat bubble ================= */
  function chatBub(ctx, x, y, s, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    rr(ctx, -60, -42, 120, 84, 22); ctx.fillStyle = o.ok ? GREEN : "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-30, 40); ctx.lineTo(-44, 66); ctx.lineTo(-6, 40); ctx.closePath(); ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = o.ok ? GREEN : "#FFFFFF"; ctx.fillRect(-28, 34, 20, 10);
    if (o.ok){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-4, 18); ctx.lineTo(26, -16); ctx.stroke(); }
    else textC(ctx, "?", 0, 20, 58, o.col || NAVY, 900);
    if (o.badge){ ctx.beginPath(); ctx.arc(54, -36, 20, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); }
    ctx.restore(); }
  function longDesk(ctx, x, top, w){ rr(ctx, x - w / 2, top, w, 30, 8); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 6); rr(ctx, x - w / 2 + 20, top + 30, w - 40, GY - top - 30, 6); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA("#FFFFFF", .15); for (let i = 0; i < 4; i++) ctx.fillRect(x - w / 2 + 50 + i * (w - 100) / 4, top + 60, (w - 100) / 4 - 30, 10); }
  function monitorBack(ctx, x, top, glow){ ctx.fillStyle = "#3B3640"; rr(ctx, x - 14, top - 80, 28, 80, 6); ctx.fill(); ol(ctx, 4); rr(ctx, x - 120, top - 230, 240, 160, 14); ctx.fillStyle = "#4A4550"; ctx.fill(); ol(ctx, 5);
    if (glow) glowAt(ctx, x, top - 150, 160, "#9FD3E8", glow * .35); }
  TT.scene(PX + "rekor", "Cerita: meja layanan pelanggan, pesan '?' berdatangan ke atas kepala dan langsung jadi centang hijau, cap REKOR, sorak, lampu dimatikan saat pulang", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ deskX: 540, top: 1380, rate: .32 }, f.rekor || {});
    const tS = T(s, K.flowCue, .2, idx), tE = T(s, K.stopCue, .5, idx), tR = T(s, K.rekorCue, .4, idx), tOff = K.offCue ? T(s, K.offCue, .5, idx) : 1e9;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: true, plantX: 60 },
      front: (c2, c, sts) => { longDesk(ctx, K.deskX, K.top, 980);
        // message bubbles fly in from the right edge to above each agent's head, then turn green
        if (t >= tS){ const n = Math.floor((Math.min(t, tE) - tS) / K.rate) + 1;
          for (let i = 0; i < n; i++){ const b0 = tS + i * K.rate, k = t - b0, st = sts[i % Math.max(1, sts.length)]; if (!st || k < 0 || k > 1.6) continue;
            const [hx, hy, r] = headOf(st), tx = hx + (rnd(i) - .5) * 160, ty = hy - r - 150 - rnd(i + 2) * 60, q = eOut(clamp(k / .55, 0, 1));
            const x = lerp(1250, tx, q), y = lerp(560 + rnd(i + 5) * 200, ty, q) - Math.sin(q * Math.PI) * 120, ok = k > .6;
            ctx.save(); ctx.globalAlpha *= 1 - clamp((k - 1.2) / .4, 0, 1); chatBub(ctx, x, y - (ok ? (k - .6) * 120 : 0), ok ? 1 + .15 * Math.sin(clamp((k - .6) / .2, 0, 1) * Math.PI) : .9, { ok, rot: (rnd(i + 9) - .5) * .3 }); ctx.restore();
            if (k > .6 && k < 1.1) for (let j = 0; j < 5; j++){ const a = j / 5 * TAU; sparkle(ctx, x + Math.cos(a) * (k - .6) * 220, y + Math.sin(a) * (k - .6) * 160, 12, GOLD); } } }
      },
      over: (c2, c) => {
        if (t >= tS && t < tR + .2){ const n = Math.max(0, Math.floor((Math.min(t, tE) - tS - .6) / K.rate) + 1); popChip(ctx, "DIJAWAB: " + n + " PESAN", 540, 300, t - tS, NAVY, "#FFFFFF", 36); }
        if (t >= tR){ stampBox(ctx, K.stamp || "REKOR! < 5 MENIT", 540, 330, t - tR, ORANGE, 76, -.06); if (t - tR < .9) burstFx(ctx, 540, 330, t - tR, GOLD, 14, 260); confetti(ctx, t - tR); }
        if (t >= tOff){ ctx.save(); ctx.globalAlpha = .55 * clamp((t - tOff) / .4, 0, 1); ctx.fillStyle = "#0A0E1E"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = Object.assign({ rate: .32 }, f.rekor || {}); if (K.flowCue){ const a = cueT(s, K.flowCue, .2, i), b = cueT(s, K.stopCue, .5, i); for (let x = a + .6; x < b + .6; x += K.rate * 2) add(x, "pop"); }
    if (K.rekorCue) add(cueT(s, K.rekorCue, .4, i), "chime"); if (K.offCue) add(cueT(s, K.offCue, .5, i), "whoosh"); });

  /* ================= JS51 _debu: Monday, record trophy on the shelf gathers dust, unanswered bubbles pile up ================= */
  function framePhoto(ctx, x, y, s, dust, t, tilt){ // y = bottom of the frame (hangs on the wall)
    ctx.save(); ctx.translate(x, y - 150); ctx.rotate(tilt || 0); ctx.scale(s, s);
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-90, -150); ctx.lineTo(0, -210); ctx.lineTo(90, -150); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -212, 8, 0, TAU); ctx.fillStyle = "#8C8C94"; ctx.fill();
    rr(ctx, -200, -160, 400, 320, 14); ctx.fillStyle = mixC(GOLD, "#B7B0A4", dust * .85); ctx.fill(); ol(ctx, 7); rr(ctx, -170, -130, 340, 220, 6); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
    ctx.save(); rr(ctx, -170, -130, 340, 220, 6); ctx.clip(); ctx.fillStyle = "#F4DEC1"; ctx.fillRect(-170, 20, 340, 80);
    [[-90, "#5B7DB1", 0], [0, ORANGE, 1], [90, "#7FA563", 0]].forEach(([dx, col, hj], i) => { ctx.beginPath(); ctx.ellipse(dx, 90, 42, 50, 0, Math.PI, 0); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3);
      ctx.beginPath(); ctx.arc(dx, 10, 30, 0, TAU); ctx.fillStyle = hj ? "#2F6F73" : "#E2A77C"; ctx.fill(); ol(ctx, 3); if (hj){ ctx.beginPath(); ctx.arc(dx, 14, 18, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); }
      ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(dx - 30, 60); ctx.lineTo(dx - 52, 0); ctx.moveTo(dx + 30, 60); ctx.lineTo(dx + 52, 0); ctx.stroke(); });
    ctx.restore();
    rr(ctx, -140, 104, 280, 44, 8); ctx.fillStyle = mixC(RED, "#8C8680", dust * .8); ctx.fill(); ol(ctx, 4); textC(ctx, "REKOR JUMAT", 0, 136, 28, "#FFFFFF", 900, 250);
    if (dust > 0){ ctx.fillStyle = hexA("#D6CFC4", .8 * dust); rr(ctx, -200, -170, 400, 22 * dust + 6, 8); ctx.fill(); ctx.fillStyle = hexA("#CFC6B8", .45 * dust); rr(ctx, -170, -130, 340, 220, 6); ctx.fill();
      ctx.fillStyle = hexA("#D6CFC4", .75 * dust); for (let i = 0; i < 40 * dust; i++){ ctx.beginPath(); ctx.arc((rnd(i) - .5) * 380, -150 + rnd(i + 3) * 300, 3 + rnd(i + 5) * 4, 0, TAU); ctx.fill(); } }
    ctx.restore(); }
  TT.scene(PX + "debu", "Cerita: Senin di kantor, bingkai foto REKOR JUMAT di dinding miring berdebu, tokoh bersantai dengan kopi, gelembung pesan tak terjawab menumpuk dan jam molor", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ shelfX: 300, shelfY: 760, pileX: 860, top: 1380 }, f.debu || {});
    const tP = T(s, K.pileCue, .3, idx), tD = T(s, K.dustCue, .4, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { cup: [K.shelfX, K.shelfY - 130, 1.25] },
      back: () => {
        const dust = clamp(.25 + (t / 6) * .45 + qIn(t, tD, .6) * .4, 0, 1); framePhoto(ctx, K.shelfX, K.shelfY, 1, dust, t, -.05 - qIn(t, tD, .5) * .1 + Math.sin(t * 1.5) * .01);
        for (let i = 0; i < 10; i++){ const q = ((t * .25) + i / 10) % 1; ctx.fillStyle = hexA("#E9E2D6", .7 * (1 - q)); ctx.beginPath(); ctx.arc(K.shelfX - 160 + rnd(i) * 320, K.shelfY - 300 + q * 320, 4, 0, TAU); ctx.fill(); }
        if (t >= tD){ const k = t - tD; if (k < 1.4){ ctx.save(); ctx.globalAlpha *= 1 - k / 1.4; ctx.fillStyle = "#CFC6B8"; for (let i = 0; i < 8; i++){ ctx.beginPath(); ctx.arc(K.shelfX + Math.cos(i) * k * 200, K.shelfY - 200 + Math.sin(i * 2) * k * 120, 30 + k * 30, 0, TAU); ctx.fill(); } ctx.restore(); } }
        // clock on wall (hands spin fast after pileCue)
        ctx.save(); ctx.translate(K.clockX ?? 820, 640); ctx.beginPath(); ctx.arc(0, 0, 80, 0, TAU); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 7); const sp = t >= tP ? (t - tP) * 6 : 0;
        ctx.strokeStyle = OUT; ctx.lineCap = "round"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(sp * .1 + 1) * 40, -Math.cos(sp * .1 + 1) * 40); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(sp) * 62, -Math.cos(sp) * 62); ctx.stroke(); ctx.restore();
      },
      front: (c2, c, sts) => { longDesk(ctx, K.deskX ?? 640, K.top, 900);
        // pile of unanswered bubbles on the desk
        const n = t < tP ? 2 : Math.min(K.max || 11, 2 + Math.floor((t - tP) / .28));
        for (let i = 0; i < n; i++){ const k = t < tP ? 1 : (t - tP) - (i - 2) * .28, q = i < 2 ? 1 : eBack(clamp(k / .3, 0, 1)), row = Math.floor(i / 3), col = i % 3; if (q <= 0) continue;
          chatBub(ctx, K.pileX - 110 + col * 110 + (row % 2) * 55, K.top - 50 - row * 88 + (1 - q) * -200 + Math.sin(t * 6 + i) * 3, .85, { badge: true, rot: (rnd(i) - .5) * .3 }); }
      },
      over: () => { if (t >= tP){ popChip(ctx, K.pileText || "BALASAN: 30 MENIT", 600, 330, t - tP - .2, RED, "#FFFFFF", 40, -.03); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.debu || {}; if (K.pileCue){ const a = cueT(s, K.pileCue, .3, i); for (let k = 0; k < 6; k++) add(a + k * .28 * 1.5, "pop"); add(a + .2, "ping"); } if (K.dustCue) add(cueT(s, K.dustCue, .4, i), "whoosh"); });

  /* ================= JS51 _semen: hand print pressed into wet cement -> hardens -> rises as a new floor (street) / floating platform in the sky ================= */
  function handShape(ctx, s){ ctx.save(); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 70, 80, 0, 0, TAU); ctx.fill();
    [[-60, -70, -.35, 60], [-22, -100, -.1, 74], [18, -104, .08, 76], [54, -88, .3, 64]].forEach(([x, y, a, L]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); rr(ctx, -15, -L / 2, 30, L, 15); ctx.fill(); ctx.restore(); });
    ctx.save(); ctx.translate(76, 10); ctx.rotate(.9); rr(ctx, -15, -34, 30, 68, 15); ctx.fill(); ctx.restore(); ctx.restore(); }
  function slab(ctx, x, top, w, o, t){ // top-surface trapezoid; o.wet 0..1, o.rise px, o.print 0..1
    const d = o.depth ?? 130, rise = o.rise || 0, wet = o.wet ?? 1, th = 40 + rise; const y0 = top - rise;
    const C = mixC("#BDB7AE", "#6E6A66", wet), side = mixC("#A39C92", "#57534F", wet);
    // front face
    ctx.beginPath(); ctx.moveTo(x - w / 2, y0 + d); ctx.lineTo(x + w / 2, y0 + d); ctx.lineTo(x + w / 2, y0 + d + th); ctx.lineTo(x - w / 2, y0 + d + th); ctx.closePath(); ctx.fillStyle = side; ctx.fill(); ol(ctx, 6);
    if (o.frame){ ctx.fillStyle = "#B5843C"; rr(ctx, x - w / 2 - 20, y0 + d - 8, w + 40, 26, 4); ctx.fill(); ol(ctx, 4); }
    // top
    ctx.beginPath(); ctx.moveTo(x - w / 2 + 70, y0); ctx.lineTo(x + w / 2 - 70, y0); ctx.lineTo(x + w / 2, y0 + d); ctx.lineTo(x - w / 2, y0 + d); ctx.closePath(); ctx.fillStyle = C; ctx.fill(); ol(ctx, 6);
    if (wet > .3){ ctx.save(); ctx.clip(); ctx.globalAlpha = (wet - .3) * .7; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; const sx = x - w / 2 + ((t * 120) % (w + 300)) - 150; ctx.beginPath(); ctx.moveTo(sx, y0 + d); ctx.lineTo(sx + 90, y0); ctx.stroke(); ctx.restore(); }
    else { ctx.save(); ctx.fillStyle = hexA("#FFFFFF", .25); for (let i = 0; i < 40; i++){ ctx.beginPath(); ctx.arc(x + (rnd(i) - .5) * (w - 160), y0 + 10 + rnd(i + 4) * (d - 20), 2.5, 0, TAU); ctx.fill(); } ctx.restore(); }
    // hand print + engraving
    if (o.print > 0){ ctx.save(); ctx.translate(x - 70, y0 + d * .52); ctx.scale(1, .42); ctx.globalAlpha *= clamp(o.print, 0, 1); ctx.fillStyle = mixC("#8E877E", "#3E3B38", wet); handShape(ctx, 1); ctx.restore();
      ctx.save(); ctx.globalAlpha *= clamp(o.print * 1.5 - .5, 0, 1); ctx.translate(x + 150, y0 + d * .62); ctx.scale(1, .6); textC(ctx, o.text || "5 MENIT", 0, 0, 74, mixC("#7C766E", "#2E2B29", wet), 900); ctx.restore(); }
    // plaques on the front face
    (o.plaques || []).forEach((p, i) => { if (p.q <= 0) return; const px = x - w / 2 + (i + .5) * w / (o.plaques.length); ctx.save(); ctx.translate(px, y0 + d + th * .5); ctx.scale(p.q, p.q); font(ctx, 900, 28, FAM); const pw = Math.min(w / o.plaques.length - 20, ctx.measureText(p.text).width + 40);
      rr(ctx, -pw / 2, -26, pw, 52, 10); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 4); textC(ctx, p.text, 0, 10, 28, GOLD, 900, pw - 20); ctx.restore(); });
    return { top: y0, front: y0 + d, bottom: y0 + d + th }; }
  TT.scene(PX + "semen", "Cerita: cap tangan raksasa di semen basah bertulis 5 MENIT, semen mengeras dan naik jadi pijakan; versi langit: pijakan melayang naik, lantai lama 30 MENIT menjauh", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, top: 1470, w: 820, mode: "wet" }, f.semen || {}), sky = K.mode === "sky";
    const tH = T(s, K.handCue, .3, idx), tHard = T(s, K.hardCue, .4, idx), tUp = T(s, K.riseCue, .4, idx), tLine = T(s, K.lineCue, .5, idx);
    const rise = sky ? 0 : 150 * eBack(qIn(t, tUp, .6));
    const wet = sky ? 0 : 1 - qIn(t, tHard, 1.0);
    const press = t < tH ? 0 : t < tH + .45 ? eOut((t - tH) / .45) : t < tH + .75 ? 1 : 1 - eOut(clamp((t - tH - .75) / .5, 0, 1));
    base(ctx, s, t, { env: sky ? "sky" : "street", envFront: false, envOpt: sky ? { time: "day" } : {},
      back: (c2, c, sts) => {
        if (sky){ // old floor sinking away + rising streaks
          const sink = t * 70; ctx.save(); ctx.globalAlpha *= clamp(1 - t / 9, .25, 1); slab(ctx, K.x, (K.oldY ?? 1780) + sink, 640, { wet: 0, depth: 90, rise: 0, print: 0 }, t); ctx.translate(0, 0); textC(ctx, K.oldText || "30 MENIT", K.x, (K.oldY ?? 1780) + 70 + sink, 60, "#7C766E", 900); ctx.restore();
          for (let i = 0; i < 12; i++){ const q = ((t * .6) + i / 12) % 1; ctx.strokeStyle = hexA("#FFFFFF", .55 * (1 - q)); ctx.lineWidth = 6; const lx = -200 + rnd(i) * 1500, ly = 300 + q * 1500; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + 120); ctx.stroke(); } }
        else { // cones + safety tape
          [[K.x - K.w / 2 - 110, 1600], [K.x + K.w / 2 + 110, 1600]].forEach(([cx2, cy]) => { ctx.beginPath(); ctx.moveTo(cx2 - 40, cy); ctx.lineTo(cx2 + 40, cy); ctx.lineTo(cx2 + 12, cy - 140); ctx.lineTo(cx2 - 12, cy - 140); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(cx2 - 26, cy - 90, 52, 20); });
          ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(K.x - K.w / 2 - 110, 1480); ctx.quadraticCurveTo(K.x, 1520, K.x + K.w / 2 + 110, 1480); ctx.stroke(); ctx.setLineDash([30, 30]); ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.stroke(); ctx.setLineDash([]); }
        const plaques = (K.plaques || []).map((p, i) => ({ text: p.text, q: bounce(t, T(s, p.cue, .3 + i * .1, idx), .4) }));
        const S = slab(ctx, K.x, sky ? K.top - Math.sin(t * 1.2) * 8 : K.top, K.w, { wet, rise, print: sky ? 1 : (t >= tH + .45 ? 1 : 0), text: K.text, frame: !sky, depth: sky ? 100 : 130, plaques }, t);
        if (sky){ ctx.save(); ctx.globalAlpha *= .6; ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.ellipse(K.x - K.w / 2 + 60 + i * (K.w - 120) / 4, S.bottom + 40 + Math.sin(t * 2 + i) * 6, 90, 30, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
        // the line BATAS MINIMAL along the platform edge
        if (t >= tLine){ const q = qIn(t, tLine, .6); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.setLineDash([24, 14]); ctx.beginPath(); ctx.moveTo(K.x - K.w / 2 - 40, S.front + 6); ctx.lineTo(K.x - K.w / 2 - 40 + (K.w + 80) * q, S.front + 6); ctx.stroke(); ctx.setLineDash([]); }
        // toons standing on the slab once it has risen
        sts.forEach((st, j) => { const on = (K.onSlab || []).indexOf(j) >= 0; if (on && Math.abs(st.x - K.x) < K.w / 2 - 40) st.y = S.top + (S.front - S.top) * .55; });
        R0 = S; },
      front: () => { if (!sky && t >= tH - .2 && t < tH + 1.4){ const y = (R0 ? R0.top + 60 : K.top + 60) - (1 - press) * 900; ctx.save(); ctx.translate(K.x - 70, y); ctx.rotate(.05);
          ctx.fillStyle = "#E2A77C"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.save(); ctx.scale(1, .9); handShape(ctx, 1.25); ctx.restore(); ctx.save(); ctx.scale(1, .9); ctx.beginPath(); ctx.ellipse(0, 0, 88, 100, 0, 0, TAU); ctx.stroke(); ctx.restore();
          rr(ctx, -80, 80, 160, 600, 20); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 6); ctx.restore();
          if (t >= tH + .45 && t < tH + 1.1){ const k = (t - tH - .45) / .65; for (let i = 0; i < 9; i++){ const a = Math.PI + i / 8 * Math.PI; ctx.fillStyle = hexA("#6E6A66", 1 - k); ctx.beginPath(); ctx.arc(K.x - 70 + Math.cos(a) * (60 + k * 200), (R0 ? R0.top : K.top) + 60 + Math.sin(a) * (20 + k * 160) + k * k * 200, 12, 0, TAU); ctx.fill(); } } } },
      over: (c2, c) => {
        if (!sky && t >= tHard && t < tHard + 1.6){ const k = t - tHard; popWord(ctx, K.hardText || "MENGERAS!", 540, 560, k, { size: 100, hold: 1.4, rot: -5 }); }
        if (t >= tLine) stampBox(ctx, K.lineText || "BATAS MINIMAL", 540, 330, t - tLine - .2, RED, 74, -.05);
        if (K.cross){ const k = t - T(s, K.cross.cue, .4, idx); if (k >= 0 && t < tLine){ ctx.save(); const q = eBack(clamp(k / .35, 0, 1)); ctx.translate(540, 330); ctx.scale(q, q); outlineWords(ctx, [{ w: "REKOR" }], 0, 30, 96, { sw: 22 });
          ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.lineCap = "round"; const L = clamp((k - .3) / .3, 0, 1) * 360; ctx.beginPath(); ctx.moveTo(-180, -10); ctx.lineTo(-180 + L, -10 + L * .1); ctx.stroke(); ctx.restore(); } }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.semen || {}; if (K.handCue){ add(cueT(s, K.handCue, .3, i), "whoosh"); add(cueT(s, K.handCue, .3, i) + .45, "pop"); } if (K.hardCue) add(cueT(s, K.hardCue, .4, i), "chime"); if (K.riseCue) add(cueT(s, K.riseCue, .4, i), "whoosh");
    (K.plaques || []).forEach((p, j) => add(cueT(s, p.cue, .3 + j * .1, i), "pop")); if (K.lineCue) add(cueT(s, K.lineCue, .5, i) + .2, "ping"); if (K.cross) add(cueT(s, K.cross.cue, .4, i) + .3, "whoosh"); });
  let R0 = null;

  /* ================= SC51 _lemari: (jungle hill, no signal) -> home wardrobe, drawers spit the wrong things ================= */
  function wardrobe(ctx, x, w, h, open, t){ // x = centre, floor GY
    const top = GY - h; ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, w * .6, 18, 0, 0, TAU); ctx.fill();
    rr(ctx, x - w / 2, top, w, h, 12); ctx.fillStyle = "#9C6238"; ctx.fill(); ol(ctx, 7); rr(ctx, x - w / 2 - 14, top - 24, w + 28, 34, 8); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 6);
    const dh = h * .52; // doors
    [-1, 1].forEach((d, i) => { const op = open.doors ? open.doors[i] || 0 : 0; ctx.save(); const hx = x + d * w / 2; ctx.translate(hx, 0); ctx.scale(1 - op * 1.2 * 1, 1); ctx.translate(-hx, 0);
      rr(ctx, d < 0 ? x - w / 2 + 10 : x + 4, top + 12, w / 2 - 14, dh, 8); ctx.fillStyle = op > 0 ? "#B57A4A" : "#AD7144"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(x + d * 22, top + 12 + dh / 2, 9, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.restore();
      if (op > 0){ ctx.fillStyle = "#3E2618"; rr(ctx, d < 0 ? x - w / 2 + 10 : x + 4, top + 12, (w / 2 - 14) * Math.min(1, op * 1.1), dh, 6); ctx.fill(); } });
    for (let i = 0; i < 3; i++){ const op = open.drawers ? open.drawers[i] || 0 : 0, dy = top + 24 + dh + i * ((h - dh - 40) / 3), dhh = (h - dh - 40) / 3 - 10;
      if (op > 0){ rr(ctx, x - w / 2 + 6, dy - op * 10, w - 12, dhh + op * 24, 6); ctx.fillStyle = "#3E2618"; ctx.fill(); }
      rr(ctx, x - w / 2 + 14 - op * 8, dy + op * 24, w - 28 + op * 16, dhh, 8); ctx.fillStyle = "#B57A4A"; ctx.fill(); ol(ctx, 5); rr(ctx, x - 40, dy + op * 24 + dhh / 2 - 7, 80, 14, 7); ctx.fillStyle = BROWN; ctx.fill(); } }
  function junk(ctx, kind, s){ ctx.save(); ctx.scale(s, s); ctx.lineJoin = "round";
    if (kind === "kaos"){ ctx.beginPath(); ctx.moveTo(-20, -60); ctx.lineTo(20, -60); ctx.lineTo(24, 10); ctx.lineTo(60, 30); ctx.lineTo(50, 56); ctx.lineTo(-10, 40); ctx.lineTo(-20, 10); ctx.closePath(); ctx.fillStyle = "#D9483B"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-20, -46, 40, 10); }
    else if (kind === "remote"){ rr(ctx, -24, -70, 48, 140, 14); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -46, 10, 0, TAU); ctx.fill(); ctx.fillStyle = "#B9BDC2"; for (let i = 0; i < 6; i++) ctx.fillRect(-14 + (i % 2) * 18, -20 + Math.floor(i / 2) * 26, 10, 12); }
    else if (kind === "bebek"){ ctx.beginPath(); ctx.ellipse(0, 0, 54, 38, 0, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(34, -40, 26, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(56, -44); ctx.lineTo(80, -36); ctx.lineTo(56, -30); ctx.fill(); ol(ctx, 3); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(40, -46, 4, 0, TAU); ctx.fill(); }
    else if (kind === "sendal"){ rr(ctx, -30, -70, 60, 140, 30); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-26, -20); ctx.lineTo(0, -46); ctx.lineTo(26, -20); ctx.stroke(); }
    else if (kind === "buku"){ rr(ctx, -50, -66, 100, 132, 8); ctx.fillStyle = SKY; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-36, -40, 72, 14); textC(ctx, "RESEP", 0, 20, 22, "#FFFFFF", 900, 90); }
    else if (kind === "payung"){ ctx.rotate(-.5); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(0, -90, 70, 0); ctx.closePath(); ctx.fillStyle = PURPLE; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(0, 70); ctx.arc(14, 70, 14, Math.PI, 0, true); ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "lemari", "Cerita: bukit di pedalaman, ponsel diangkat tinggi tanpa sinyal -> rumah, lemari dibongkar, barang salah beterbangan (BUKAN!)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene;
    base(ctx, s, t, { env: "park",
      back: (c2, c, sts, R) => { const F = R.f;
        if (F.bukit){ const B = F.bukit; ctx.fillStyle = "#6E655E"; ctx.beginPath(); ctx.moveTo(B.x - 230, GY + 10); ctx.quadraticCurveTo(B.x - 200, GY - 170, B.x - 40, GY - 190); ctx.quadraticCurveTo(B.x + 160, GY - 200, B.x + 230, GY + 10); ctx.closePath(); ctx.fill(); ol(ctx, 6);
          ctx.fillStyle = hexA("#FFFFFF", .15); ctx.beginPath(); ctx.ellipse(B.x - 60, GY - 140, 80, 24, -.2, 0, TAU); ctx.fill(); const st = sts[0]; if (st) st.y = GY - 175; }
        if (F.lemari){ const L = F.lemari, ops = (L.opens || []).map((o, i) => ({ q: qIn(t, T(s, o.cue, .2 + i * .1, idx), .25), o }));
          const open = { doors: [0, 0], drawers: [0, 0, 0] }; ops.forEach(({ q, o }) => { if (o.door != null) open.doors[o.door] = Math.max(open.doors[o.door], q); if (o.drawer != null) open.drawers[o.drawer] = Math.max(open.drawers[o.drawer], q); });
          wardrobe(ctx, L.x, L.w || 440, L.h || 880, open, t); }
      },
      front: (c2, c, sts, R) => { const F = R.f;
        if (F.lemari){ const L = F.lemari; (L.opens || []).forEach((o, i) => { const T0 = T(s, o.cue, .2 + i * .1, idx) + .15, k = t - T0; if (k < 0 || !o.item) return;
          const sx = L.x + (o.door != null ? (o.door ? 110 : -110) : 0), sy = o.door != null ? GY - 640 : GY - 260 + (o.drawer || 0) * 80, vx = o.vx ?? -420 - i * 40, vy = o.vy ?? -900, g = 1900, land = GY - 30;
          let x = sx + vx * k, y = sy + vy * k + .5 * g * k * k, rot = k * 8 * (i % 2 ? 1 : -1); if (y > land){ y = land; const tl = k; void tl; rot = .3; }
          ctx.save(); ctx.translate(x, y); ctx.rotate(rot); junk(ctx, o.item, 1.1); ctx.restore(); }); }
        if (F.bukit){ const st = sts[0]; if (st){ const B = F.bukit, hp = handOf(st); ctx.save(); ctx.translate(hp[0], hp[1] - 20); ctx.rotate(Math.sin(t * 9) * .15); prop(ctx, "phone", 0, 0, { s: .55, screen: "#DCE7F7" }, t);
          ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-26, -66); ctx.lineTo(26, -14); ctx.moveTo(26, -66); ctx.lineTo(-26, -14); ctx.stroke(); ctx.restore();
          for (let i = 0; i < 3; i++){ const q = ((t * .9) + i / 3) % 1; ctx.save(); ctx.globalAlpha *= (1 - q) * .8; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(hp[0], hp[1] - 60, 50 + q * 160, -2.4, -.7); ctx.stroke(); ctx.restore(); } void B; } }
      },
      over: (c2, c, sts, R) => { const F = R.f;
        if (F.lemari) (F.lemari.opens || []).forEach((o, i) => { if (!o.item) return; const T0 = T(s, o.cue, .2 + i * .1, idx) + .35; popWord(ctx, o.word || "BUKAN!", o.wx ?? (i % 2 ? 300 : 760), o.wy ?? (520 + (i % 3) * 70), t - T0, { size: 84, hold: .9, rot: i % 2 ? 7 : -7, col: RED }); });
        if (F.bukit && F.bukit.chip) popChip(ctx, F.bukit.chip, 540, 330, t - .3, RED, "#FFFFFF", 40, -.03);
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); [f].concat(f.shots || []).forEach(F => { if (F.lemari) (F.lemari.opens || []).forEach((o, j) => { const a = cueT(s, o.cue, .2 + j * .1, i); add(a, "pop"); if (o.item) add(a + .35, "whoosh"); }); }); });

  /* ================= SC51 _sinyal: split screen, hospital corridor (left) vs jungle night with the money map locked in his head (right) ================= */
  function hospitalBG(ctx, t){ ctx.fillStyle = "#DCEBE6"; ctx.fillRect(-1500, -800, 4200, GY + 800); ctx.fillStyle = "#A9CFC4"; ctx.fillRect(-1500, GY - 420, 4200, 420); ctx.fillStyle = "#7FB7A6"; ctx.fillRect(-1500, GY - 430, 4200, 16);
    ctx.fillStyle = "#C8D6D2"; ctx.fillRect(-1500, GY, 4200, 800);
    rr(ctx, 520, GY - 900, 300, 900, 10); ctx.fillStyle = "#F7F5F0"; ctx.fill(); ol(ctx, 6); rr(ctx, 600, GY - 820, 140, 180, 10); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4); rr(ctx, 560, GY - 1000, 220, 70, 10); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 5); textC(ctx, "RUANG RAWAT", 670, GY - 952, 30, "#FFFFFF", 900, 200);
    ctx.fillStyle = "#FFFDF6"; for (let i = 0; i < 4; i++){ rr(ctx, -200 + i * 420, 120, 200, 40, 20); ctx.fill(); } glowAt(ctx, 640, 180, 400, "#FFFFFF", .3); }
  function jungleBG(ctx, t){ ctx.fillStyle = "#14243A"; ctx.fillRect(-1500, -800, 4200, GY + 800); ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.arc(820, 300, 60, 0, TAU); ctx.fill(); glowAt(ctx, 820, 300, 200, "#FFF4E6", .25);
    for (let i = 0; i < 30; i++){ ctx.fillStyle = hexA("#FFFFFF", .5 + .5 * Math.sin(t * 2 + i)); ctx.fillRect(rnd(i) * 1100 - 20, rnd(i + 4) * 700, 4, 4); }
    for (let i = 0; i < 7; i++){ const x = -100 + i * 200, h = 700 + rnd(i) * 300; ctx.fillStyle = i % 2 ? "#1E3A2E" : "#234332"; ctx.beginPath(); ctx.moveTo(x - 150, GY - 300); ctx.lineTo(x, GY - 300 - h); ctx.lineTo(x + 150, GY - 300); ctx.fill(); ctx.fillRect(x - 15, GY - 320, 30, 320); }
    ctx.fillStyle = "#1C2E22"; ctx.fillRect(-1500, GY - 320, 4200, 1200); ctx.fillStyle = "#2B4632"; ctx.fillRect(-1500, GY, 4200, 800); }
  function moneyCloud(ctx, x, y, q, lock, t){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); [[-150, 10, 80], [-60, -50, 95], [60, -50, 95], [150, 10, 80], [0, 50, 110]].forEach(([a, b, r]) => { ctx.moveTo(a + r, b); ctx.arc(a, b, r, 0, TAU); }); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(0, 10, 200, 90, 0, 0, TAU); ctx.fill();
    // three icons: account card, policy shield, house loan
    ctx.save(); ctx.translate(-120, 0); ctx.rotate(-.1); rr(ctx, -54, -34, 108, 68, 10); ctx.fillStyle = SKY; ctx.fill(); ol(ctx, 4); ctx.fillStyle = GOLD; ctx.fillRect(-40, -14, 26, 18); ctx.fillStyle = OUT; ctx.fillRect(-54, 10, 108, 8); ctx.restore();
    ctx.save(); ctx.translate(0, -10); ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(44, -34); ctx.quadraticCurveTo(44, 26, 0, 50); ctx.quadraticCurveTo(-44, 26, -44, -34); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, 20); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(120, 0); ctx.beginPath(); ctx.moveTo(-50, -4); ctx.lineTo(0, -48); ctx.lineTo(50, -4); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); rr(ctx, -38, -6, 76, 52, 4); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 4); ctx.restore();
    if (lock > 0){ const lq = eBack(clamp(lock, 0, 1)); ctx.save(); ctx.translate(0, 40); ctx.scale(lq, lq); ctx.strokeStyle = OUT; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, -40, 34, Math.PI, 0); ctx.stroke(); ctx.strokeStyle = "#B9BDC2"; ctx.lineWidth = 9; ctx.stroke();
      rr(ctx, -52, -44, 104, 84, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -8, 10, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillRect(-4, -6, 8, 22); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "sinyal", "Cerita: layar terbelah, kiri lorong rumah sakit malam (tagihan jatuh tempo, telepon tak tersambung), kanan pedalaman malam, peta uang keluarga terkunci di kepala", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, L = f.left || {}, Rr = f.right || {};
    const panel = (side, P, drawBG, envKind) => {
      const sx = side < 0 ? 0 : 540; ctx.save(); ctx.beginPath(); ctx.rect(sx, 0, 540, 1920); ctx.clip(); ctx.translate(side * 270, 0);
      const toons = P.toons || [], sts = toons.map(a => toonState(a, s, t));
      const c = cam(s, t, P.cam || [{ at: 0, x: 540, y: 1100, zoom: 1 }], { resolve: (on, tt, k) => { const st = sts[on]; if (!st) return null; const h = headOf(st); return [h[0] + (k.dx || 0), h[1] + (k.dy || 0), k.zoom ?? null]; } });
      env(ctx, envKind, t, c, { time: "night" }); layer(ctx, c, 1, () => drawBG(ctx, t));
      if (P.bench) layer(ctx, c, 1, () => { rr(ctx, P.bench - 230, GY - 190, 460, 34, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#5A3A2A"; [-200, 180].forEach(d => { ctx.fillRect(P.bench + d, GY - 160, 20, 160); }); });
      if (P.lantern) layer(ctx, c, 1, () => { const lx = P.lantern; glowAt(ctx, lx, GY - 120, 340, "#FFC46B", .45 + .08 * Math.sin(t * 9)); rr(ctx, lx - 34, GY - 170, 68, 110, 12); ctx.fillStyle = "#FFE3A8"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#3B2418"; ctx.fillRect(lx - 40, GY - 70, 80, 16); ctx.fillRect(lx - 40, GY - 186, 80, 16);
        rr(ctx, lx + 120, GY - 110, 260, 70, 30); ctx.fillStyle = "#6E4428"; ctx.fill(); ol(ctx, 5); });
      toons.forEach((a, j) => { const R = toon(ctx, c, a, s, t, { st: sts[j] });
        (P.holds || []).filter(h => (h.on ?? 0) === j && t >= T(s, h.cue, .2, idx)).forEach(h => layer(ctx, c, 1, () => { const p = handOf(sts[j]); drawItemX(ctx, h.kind, p[0] + (h.dx || 0), p[1] + (h.dy || 0), t, Object.assign({}, h, { s: (h.s || 1) * bounce(t, T(s, h.cue, .2, idx), .3) * sts[j].size / 760 })); }));
        void R; });
      // overlays inside the panel (screen coords, already shifted)
      if (P.cloud){ const st = sts[P.cloud.on ?? 0]; if (st){ const h = headOf(st), p = c.toScreen(h[0], h[1] - h[2]); const q = bounce(t, T(s, P.cloud.cue, .3, idx), .5), lk = qIn(t, T(s, P.cloud.lockCue, .4, idx), .4);
        if (q > 0){ thinkDots(ctx, p[0] - 30, p[1] - 10, 540 + (P.cloud.dx || 0), (P.cloud.y || 560) + 110, q); moneyCloud(ctx, 540 + (P.cloud.dx || 0), (P.cloud.y || 560) + Math.sin(t * 1.6) * 6, q * (P.cloud.s || .95), lk, t); } } }
      if (P.waves){ const T0 = T(s, P.waves.cue, .3, idx); if (t >= T0){ const st = sts[0], h = headOf(st), p = c.toScreen(h[0] + 60, h[1]); for (let i = 0; i < 4; i++){ const q = (((t - T0) * .9) + i / 4) % 1; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(p[0], p[1], 40 + q * 260, -.7, .7); ctx.stroke(); ctx.restore(); } } }
      ctx.restore();
      return { c, sts };
    };
    panel(-1, L, hospitalBG, "office"); panel(1, Rr, jungleBG, "night");
    // divider + labels
    ctx.save(); ctx.beginPath(); ctx.moveTo(540 - 10, 0); for (let y = 0; y <= 1920; y += 120) ctx.lineTo(540 + (y / 120 % 2 ? 22 : -22), y); ctx.lineWidth = 22; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = CREAM; ctx.stroke(); ctx.restore();
    TT.CS.ov.push(() => {
      popChip(ctx, L.label || "RUMAH SAKIT", 270, 250, t - .2, TEAL, "#FFFFFF", 38); popChip(ctx, Rr.label || "PEDALAMAN", 810, 250, t - .35, NAVY, "#FFFFFF", 38);
      (f.chips || []).forEach((cp, i) => popChip(ctx, cp.text, cp.x ?? 270, cp.y ?? 360, t - T(s, cp.cue, .3 + i * .1, idx), cp.bg || RED, "#FFFFFF", cp.size || 30, cp.rot ?? -.04));
      const X = f.cross; if (X){ const k = t - T(s, X.cue, .4, idx); if (k >= 0){ const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(540, X.y || 820); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 7);
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-28, -28); ctx.lineTo(28, 28); ctx.moveTo(28, -28); ctx.lineTo(-28, 28); ctx.stroke(); ctx.restore(); } }
      (f.bubbles || []).forEach((b, i) => { const k = t - T(s, b.cue, .3, idx), O = b.outCue ? T(s, b.outCue, .3, idx) : 1e9; if (k >= 0 && t < O) TT.bubble(ctx, b.text, b.x, b.y, k, { kind: b.kind || "say", size: b.size || 40, maxW: 420, side: b.side }); });
    });
  }, (s, f, i, add) => { (f.chips || []).forEach((cp, j) => add(cueT(s, cp.cue, .3 + j * .1, i), "pop")); if (f.cross) add(cueT(s, f.cross.cue, .4, i), "ping"); (f.bubbles || []).forEach(b => add(cueT(s, b.cue, .3, i), "pop"));
    const R = f.right || {}; if (R.cloud){ add(cueT(s, R.cloud.cue, .3, i), "chime"); add(cueT(s, R.cloud.lockCue, .4, i), "pop"); } add(.2, "whoosh"); });

  /* ================= SC51 _map: family map opens as a pop-up book (accounts, insurance, debts + where documents are) ================= */
  function popPiece(ctx, kind, q, t, label, col){ if (q <= 0) return; ctx.save(); ctx.scale(1, eBack(clamp(q, 0, 1))); ctx.lineJoin = "round";
    if (kind === "bank"){ ctx.beginPath(); ctx.moveTo(-110, -150); ctx.lineTo(0, -220); ctx.lineTo(110, -150); ctx.closePath(); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 5); rr(ctx, -100, -150, 200, 150, 4); ctx.fillStyle = "#F7F2EA"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#C9BBA6"; for (let i = 0; i < 4; i++) ctx.fillRect(-80 + i * 50, -130, 22, 120); }
    else if (kind === "shield"){ ctx.beginPath(); ctx.moveTo(0, -230); ctx.lineTo(100, -195); ctx.quadraticCurveTo(100, -60, 0, 0); ctx.quadraticCurveTo(-100, -60, -100, -195); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(0, -70); ctx.moveTo(-50, -120); ctx.lineTo(50, -120); ctx.stroke(); }
    else if (kind === "house"){ ctx.beginPath(); ctx.moveTo(-110, -140); ctx.lineTo(0, -230); ctx.lineTo(110, -140); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); rr(ctx, -90, -142, 180, 142, 4); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 5); rr(ctx, -24, -80, 48, 80, 4); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.translate(86, -190); ctx.rotate(.15 + Math.sin(t * 3) * .08); rr(ctx, -44, -30, 88, 62, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; ctx.fillRect(-44, -30, 88, 18); textC(ctx, "TGL 5", 0, 24, 24, OUT, 900, 80); ctx.restore(); }
    else if (kind === "lemari"){ rr(ctx, -80, -220, 160, 220, 8); ctx.fillStyle = "#9C6238"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -214); ctx.lineTo(0, -100); ctx.stroke(); rr(ctx, -70, -94, 140, 36, 6); ctx.fillStyle = "#B57A4A"; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.translate(30, -150 + Math.sin(t * 4) * 6); ctx.rotate(-.2); rr(ctx, -40, -30, 80, 60, 6); ctx.fillStyle = SKY; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    ctx.restore();
    if (label){ const lq = clamp(q * 1.6 - .6, 0, 1); if (lq > 0){ ctx.save(); ctx.globalAlpha *= lq; chipW(ctx, label, 0, 34, col || NAVY, "#FFFFFF", 28); ctx.restore(); } } }
  TT.scene(PX + "map", "Cerita: meja makan siang, MAP KELUARGA dibuka jadi buku pop-up: rekening, polis, cicilan jatuh tempo, lemari tempat dokumen", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 540, top: 1460, w: 640 }, f.map || {});
    const tO = T(s, K.openCue, .3, idx), op = qIn(t, tO, .7);
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 980 },
      front: () => { rr(ctx, K.x - 420, K.top, 840, 28, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); rr(ctx, K.x - 400, K.top + 28, 800, GY - K.top - 28, 6); ctx.fillStyle = "#6E4428"; ctx.fill(); ol(ctx, 5);
        const bw = K.w, bh = 120, bx = K.x, by = K.top - 6;
        // pages
        ctx.beginPath(); ctx.moveTo(bx - bw / 2, by); ctx.lineTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2 - 40, by - bh); ctx.lineTo(bx - bw / 2 + 40, by - bh); ctx.closePath(); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.moveTo(bx - bw / 2 + 14, by - 10); ctx.lineTo(bx + bw / 2 - 14, by - 10); ctx.lineTo(bx + bw / 2 - 50, by - bh + 8); ctx.lineTo(bx - bw / 2 + 50, by - bh + 8); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
        ctx.strokeStyle = hexA(OUT, .4); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx, by - 10); ctx.lineTo(bx, by - bh + 8); ctx.stroke();
        // cover flipping open (rotates around the spine)
        if (op < 1){ const ang = op * Math.PI; ctx.save(); ctx.translate(bx, by - bh / 2); ctx.scale(Math.cos(ang), 1); ctx.beginPath(); ctx.moveTo(0, bh / 2 + 4); ctx.lineTo(bw / 2 + 6, bh / 2 + 4); ctx.lineTo(bw / 2 - 34, -bh / 2 - 4); ctx.lineTo(0, -bh / 2 - 4); ctx.closePath(); ctx.fillStyle = op < .5 ? "#2F6F73" : "#E9E2D6"; ctx.fill(); ol(ctx, 6);
          if (op < .5){ ctx.scale(1, 1); textC(ctx, "MAP KELUARGA", bw / 4, 12, 34, GOLD, 900, bw / 2 - 60); } ctx.restore();
          if (op <= 0){ ctx.save(); ctx.translate(bx - bw / 4, by - bh / 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.restore(); } }
        (K.pieces || []).forEach((p, i) => { const q = qIn(t, T(s, p.cue, .3 + i * .1, idx), .5); ctx.save(); ctx.translate(bx + p.dx, by - bh * .45); ctx.scale(p.s || 1, p.s || 1); popPiece(ctx, p.kind, q, t, p.label, p.col); ctx.restore();
          if (q > 0 && q < 1) for (let j = 0; j < 6; j++){ const a = j / 6 * TAU; sparkle(ctx, bx + p.dx + Math.cos(a) * 120 * q, by - 200 + Math.sin(a) * 80 * q, 12, GOLD); } });
      },
      over: (c2, c) => { if (K.where){ const k = t - T(s, K.where.cue, .4, idx); if (k >= 0) popChip(ctx, K.where.text, 540, 330, k, SKY, "#FFFFFF", 36, -.03); } } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.map || {}; if (K.openCue) add(cueT(s, K.openCue, .3, i), "whoosh"); (K.pieces || []).forEach((p, j) => add(cueT(s, p.cue, .3 + j * .1, i), "pop")); if (K.where) add(cueT(s, K.where.cue, .4, i), "chime"); });

  /* ================= SC51 _nyamuk: PIN & password buzz like mosquitoes around the family map, zapped by a mosquito racket ================= */
  function mosquito(ctx, x, y, t, label, dead){ ctx.save(); ctx.translate(x, y); ctx.scale(1.7, 1.7); if (dead) ctx.rotate(Math.PI * .9);
    const wf = dead ? 0 : Math.sin(t * 60) * .6; ctx.fillStyle = hexA("#FFFFFF", .75); [-1, 1].forEach(d => { ctx.save(); ctx.rotate(d * (.5 + wf * .4)); ctx.beginPath(); ctx.ellipse(d * 4, -26, 12, 30, d * .3, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, 0, 26, 14, 0, 0, TAU); ctx.fillStyle = "#3B3640"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(48, 6); ctx.stroke();
    for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-10 + i * 10, 10); ctx.lineTo(-18 + i * 10, 32); ctx.stroke(); }
    if (label){ ctx.rotate(dead ? -Math.PI * .9 : 0); chipW(ctx, label, 0, -52, dead ? "#8C8C94" : RED, "#FFFFFF", 20); }
    if (dead){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, -4); ctx.lineTo(16, 2); ctx.moveTo(16, -4); ctx.lineTo(10, 2); ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "nyamuk", "Cerita: ruang keluarga malam, PIN dan kata sandi berdengung seperti nyamuk mendekati map keluarga, ditepuk raket nyamuk listrik, lalu keluarga membaca bersama", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ tx: 560, ty: 1180, bugs: [] }, f.nyamuk || {});
    const tIn = T(s, K.inCue, .2, idx), tZ = T(s, K.zapCue, .4, idx);
    const bugPos = (b, i) => { const k = t - tIn - i * .25; const ang = k * (2.2 + i * .4) + i * 2; const r = 260 - Math.min(110, k * 50); return [K.tx + Math.cos(ang) * r * 1.3 + (i - 1) * 60, K.ty - 260 + Math.sin(ang * 1.3) * r * .45]; };
    base(ctx, s, t, { env: "home", envOpt: { lampX: 120 },
      front: (c2, c, sts) => {
        (K.bugs || []).forEach((b, i) => { if (t < tIn + i * .25) return; const zt = tZ + i * .3, dead = t >= zt; let [x, y] = dead ? [0, 0] : bugPos(b, i);
          if (dead){ const p = bugPos(b, i).map(v => v); const k = t - zt; const z = (function(){ const kk = zt - tIn - i * .25, ang = kk * (2.2 + i * .4) + i * 2, r = 260 - Math.min(140, kk * 50); return [K.tx + Math.cos(ang) * r * 1.4 + (i - 1) * 60, K.ty - 260 + Math.sin(ang * 1.3) * r * .5]; })(); void p;
            x = z[0]; y = z[1] + k * k * 900; if (k > 1.1) return; if (k < .5){ ctx.save(); ctx.strokeStyle = "#BFF4FF"; ctx.lineWidth = 6; for (let j = 0; j < 7; j++){ const a = j / 7 * TAU + k * 9; ctx.beginPath(); ctx.moveTo(z[0] + Math.cos(a) * 30, z[1] + Math.sin(a) * 30); ctx.lineTo(z[0] + Math.cos(a) * (60 + k * 160), z[1] + Math.sin(a) * (60 + k * 160)); ctx.stroke(); } glowAt(ctx, z[0], z[1], 160, "#BFF4FF", .6 * (1 - k * 2)); ctx.restore(); } }
          ctx.save(); if (dead) ctx.globalAlpha *= clamp((1.1 - (t - zt)) / .4, 0, 1); mosquito(ctx, x, y, t, b, dead); ctx.restore(); });
        // racket in the hand of toon K.on
        const st = sts[K.on ?? 0]; if (st && t >= tZ - .6 && t < tZ + (K.bugs.length) * .3 + 1.2){ const hp = handOf(st), sw = Math.sin((t - tZ) * 10) * .6; drawItemX(ctx, "racket", hp[0], hp[1] + 10, t, { s: 1.25 * st.size / 760, rot: .3 + sw, zap: (K.bugs || []).some((b, i) => t >= tZ + i * .3 && t < tZ + i * .3 + .25) }); }
      },
      over: () => {
        (K.bugs || []).forEach((b, i) => { const zt = tZ + i * .3; popWord(ctx, "ZAP!", 300 + i * 240, 560 - (i % 2) * 70, t - zt, { size: 90, hold: .7, rot: i % 2 ? 8 : -8, col: SKY }); });
        if (K.ruleCue){ const k = t - T(s, K.ruleCue, .4, idx); if (k >= 0) popChip(ctx, K.rule || "PIN & SANDI: TETAP RAHASIA", 540, 330, k, NAVY, "#FFFFFF", 36, -.03); }
      } });
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const K = f.nyamuk || {}; if (K.inCue) add(cueT(s, K.inCue, .2, i), "whoosh"); if (K.zapCue) (K.bugs || []).forEach((b, j) => add(cueT(s, K.zapCue, .4, i) + j * .3, "ping")); if (K.ruleCue) add(cueT(s, K.ruleCue, .4, i), "chime"); });
})();
