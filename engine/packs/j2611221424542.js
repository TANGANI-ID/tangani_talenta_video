/* Scene pack j2611221424542: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for RN43, KD43, JS43, SC43, MS43.
   Layout prefix j2611221424542_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots  [{at|cue, ...any field}]  hard cut (cream flash) to a new shot inside one scene (all features read the active shot)
     set    backdrop drawn over the env wall: cetak (print shop, night:true), ruang (small meeting room), klien (client meeting room),
            koridor (hotel corridor), lineup (police line-up wall), linen (hotel linen room), kamar (bedroom + wardrobe),
            toko (bike shop front), rumah (home wall + door frame), kompleks (housing street + gate + warung), garasi (house front + carport)
     hold   [{on, kind, at|cue, outCue, s, dx, dy, rot, text}]  object in a toon's hand: phone, sheet, money, towel, helmet, placard, cup
     blush  [{on, at|cue, outCue}]  red face + steam          ping [{on, at|cue, text}]  tiny text message by the toon's phone
     toa    {on, at|cue, blasts:[{cue, text, kind: shout|praise}]}  megaphone in the toon's hand; words/hearts blast out
     whisper {on, cue, text}   tiny whisper bubble           boxes {x, cues:[..]}  finished order boxes stack up
     banner {x, y, text, bad, dropCue, markCue}  hanging print banner with a typo circled red
     table  {x, sheet, tickCues:[..]}  round table with steaming tea cups and a proof sheet
     robot  {x, y, s, at|cue, holo, keys:[{cue, x, y, mood}]}  AI mascot (smug / oops / proud), hologram pops from a laptop
     facts  [{cue, text, x, y, crackCue, fixCue, fix, okCue}]  fact cards (screen) that crack red or get a green tick
     helmets [{on, at|cue, clickCue}]  motorbike helmet on a toon's head (strap click)      belts [{on, at|cue, clickCue}]  seat belt
     motor  [{on, hang (helmet on mirror until cue), brakeCue}]  scooter under a seated toon
     car    {x, at}  hatchback with a window hole, drawn in front of a seated toon
     chest  {x, openCue}  wooden chest with money             bike {x, tagFrom, tagTo, tagCue}  bicycle with a price tag
     trolley {x, mode: cek|baru, shelfCue, labelCue, listCue}  housekeeping trolley
     door   {x, cue}  hotel door 304 opens                    flash [{cue}]  camera flash (line-up)
     cat    {cue, x0, x1}  cat jumps across the road           pole {x}  electricity pole
     badges [{on, at|cue, outCue, text, col}]  pops [{at|cue, text, x, y, size, rot, col}]  stamps [{at|cue, text, x, y, col}]  confetti {at|cue}
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _spanduk  print shop briefing: banner with a typo drops, red circle, crowd turns, blushing culprit (RN43)
     _toa      overtime night shot with tiny thank-you text, then the boss with a giant megaphone (RN43)
     _tempat   two places: a small stage (public praise) and a little room (private correction); a star and a note are tossed in (RN43)
     _ruang    public praise through the megaphone, then a quiet talk over tea with a proof checklist (RN43)
     _ai       laptop at night: the answer panel grows out of the laptop, types itself, gets a 100% YAKIN stamp, fact cards slide out (KD43)
     _klien    client meeting room: the client frowns, fact cards crack one by one (KD43)
     _dadu     the AI mascot rolls a giant die and lands on a made-up name: HALUSINASI (KD43)
     _cek      office: each AI fact card is checked against the original document, ticked or fixed (KD43)
     _koridor  hotel corridor: door 304 opens, a guest with a tiny towel, the complaint counter (JS43)
     _barisan  line-up wall: three different staff hold name boards, flash, same mistake (JS43)
     _troli    housekeeping trolley inspected (only 3 slots) or upgraded (4th shelf, labels, checklist) (JS43)
     _sarung   bedroom: savings tucked in a folded sarung in the wardrobe; it is unfolded, dust, the money glows (SC43)
     _sepeda   bike shop: the price tag keeps rolling up, the money is short (SC43)
     _bakso    infographic: a bowl of meatballs costs 10.000 -> 10.300; the same bill buys a smaller bowl (SC43)
     _kusen    door frame height chart: prices climb each year, the idle money stays flat, then starts to climb (SC43)
     _gang     housing street: scooter with the helmet hanging on the mirror, neighbour warns, 200 m pin (MS43)
     _kucing   riding along the park road: a cat jumps out, hard brake, wobble, near the pole (MS43)
     _uji      crash-test sled: a dummy without a belt lurches forward, a belted dummy with helmet stays put (MS43)
     _klik     house front: helmet strap and seat belt click (MS43) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424542_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const pop = (k, d) => k < 0 ? 0 : eBack(clamp(k / (d || .35), 0, 1));
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
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.moveTo(x + Math.cos(a) * r * .6 + r * .55, y + Math.sin(a) * r * .45); ctx.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .45, r * .55, 0, TAU); } ctx.fillStyle = col; ctx.fill(); }
  function tick(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }
  function cross(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-13, -13); ctx.lineTo(13, 13); ctx.moveTo(13, -13); ctx.lineTo(-13, 13); ctx.stroke(); ctx.restore(); }
  function heart(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, r * .9); ctx.bezierCurveTo(-r * 1.4, -r * .1, -r * .7, -r * 1.2, 0, -r * .45); ctx.bezierCurveTo(r * .7, -r * 1.2, r * 1.4, -r * .1, 0, r * .9); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  function money(ctx, x, y, s, n, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < n; i++){ ctx.save(); ctx.translate((i - (n - 1) / 2) * 22, -i * 4); ctx.rotate((i - (n - 1) / 2) * .16 + Math.sin(t * 2 + i) * .02);
      rr(ctx, -70, -38, 140, 76, 8); ctx.fillStyle = i % 2 ? "#8CC49A" : "#A8D5B0"; ctx.fill(); ol(ctx, 4); rr(ctx, -58, -27, 116, 54, 5); ctx.strokeStyle = hexA("#2E6B44", .6); ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); ctx.fillStyle = hexA("#2E6B44", .35); ctx.fill(); textC(ctx, "Rp", -38, -10, 16, "#2E6B44", 900); ctx.restore(); } ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "phone"){ ctx.rotate(-.15); rr(ctx, -34, -64, 68, 124, 12); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 4); rr(ctx, -28, -56, 56, 104, 6); ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fill(); }
    else if (kind === "sheet"){ ctx.rotate(-.08); rr(ctx, -80, -105, 160, 210, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); for (let i = 0; i < 5; i++){ ctx.fillStyle = i ? "#C9BBA6" : ORANGE; rr(ctx, -58, -78 + i * 34, i ? 100 - rnd(i) * 30 : 116, 12, 6); ctx.fill(); } }
    else if (kind === "money"){ money(ctx, 0, -20, .9, o.n || 4, t); }
    else if (kind === "towel"){ rr(ctx, -46, -18, 92, 36, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#9FD3E0"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, 8); ctx.lineTo(40, 8); ctx.stroke(); }
    else if (kind === "helmet"){ motoHelmet(ctx, 0, -30, 2.6, o.col || RED, t, false); }
    else if (kind === "placard"){ ctx.fillStyle = "#2C2433"; rr(ctx, -130, -10, 260, 110, 8); ctx.fill(); ol(ctx, 4); textC(ctx, o.text || "", 0, 68, 50, "#FFFFFF", 900, 230); }
    else if (kind === "sarung"){ const op = !!o.open; ctx.rotate(-.06); if (!op){ for (let i = 0; i < 2; i++){ rr(ctx, -110, -40 - i * 40, 220, 44, 10); ctx.fillStyle = i ? "#5B7DB1" : "#3F5E91"; ctx.fill(); ol(ctx, 4);
        ctx.save(); rr(ctx, -110, -40 - i * 40, 220, 44, 10); ctx.clip(); ctx.strokeStyle = hexA("#F6C343", .8); ctx.lineWidth = 6; for (let xx = -100; xx < 110; xx += 36){ ctx.beginPath(); ctx.moveTo(xx, -90); ctx.lineTo(xx, 10); ctx.stroke(); } ctx.strokeStyle = hexA("#D9483B", .7); ctx.beginPath(); ctx.moveTo(-110, -20 - i * 40); ctx.lineTo(110, -20 - i * 40); ctx.stroke(); ctx.restore(); } }
      else { ctx.beginPath(); ctx.moveTo(-200, -20); ctx.quadraticCurveTo(-100, -70 + Math.sin(t * 4) * 8, 0, -30); ctx.quadraticCurveTo(100, 10, 200, -40 + Math.sin(t * 4 + 1) * 8); ctx.lineTo(200, 60); ctx.quadraticCurveTo(100, 100, 0, 70); ctx.quadraticCurveTo(-100, 40, -200, 80); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 4);
        ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#F6C343", .8); ctx.lineWidth = 7; for (let xx = -200; xx < 210; xx += 40){ ctx.beginPath(); ctx.moveTo(xx, -90); ctx.lineTo(xx, 110); ctx.stroke(); } ctx.restore();
        rr(ctx, -70, -50, 140, 80, 8); ctx.fillStyle = "#F3E2C8"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(-70, -50); ctx.lineTo(0, 0); ctx.lineTo(70, -50); ol(ctx, 3); } }
    else if (kind === "cup"){ rr(ctx, -30, -60, 60, 60, 10); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-26, -50, 52, 10); }
    ctx.restore(); }

  /* motorbike helmet; origin = head centre in head units (r ≈ 20.5) */
  function motoHelmet(ctx, x, y, k, col, t, strap, q){
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-25, 7); ctx.bezierCurveTo(-31, -42, 31, -42, 25, 7); ctx.lineTo(20, 8); ctx.quadraticCurveTo(19, -8, 10, -11); ctx.quadraticCurveTo(0, -13, -10, -11); ctx.quadraticCurveTo(-19, -8, -20, 8); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-17, -12); ctx.quadraticCurveTo(0, -20, 17, -12); ctx.lineTo(18, -16); ctx.quadraticCurveTo(0, -25, -18, -16); ctx.closePath(); ctx.fillStyle = hexA("#3A4A5E", .9); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.globalAlpha *= .5; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(-4, -10, 17, -2.6, -1.7); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, -20, -14, 11, 6, 2); ctx.fill(); ctx.fillStyle = OUT; font(ctx, 900, 4.4, FAM); ctx.textAlign = "center"; ctx.fillText("SNI", -14.5, -9.4); ctx.textAlign = "left";
    if (strap){ ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(-21, 7); ctx.quadraticCurveTo(-10, 22, 2, 21); ctx.stroke(); ctx.beginPath(); ctx.moveTo(21, 7); ctx.quadraticCurveTo(12, 21, 6, 21); ctx.stroke();
      const cq = q ?? 1; rr(ctx, 1, 18.5, 6, 5, 1.2); ctx.fillStyle = cq >= 1 ? GOLD : "#9AA6B2"; ctx.fill(); ctx.lineWidth = .8; ctx.stroke(); }
    ctx.restore(); }

  /* ---------- scooter (world, origin = ground under the seat centre) ---------- */
  function scooter(ctx, x, y, s, f, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
    const spin = (o.spin || 0), wob = o.wob || 0; ctx.rotate(wob);
    if (o.hangOnly){ const sw = Math.sin(t * 3.4) * .25 + (o.swing || 0); ctx.save(); ctx.translate(150, -450); ctx.rotate(sw); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(30, 40); ctx.stroke(); motoHelmet(ctx, 40, 120, 3.8, o.helmetCol || RED, t, true, 0); ctx.restore(); ctx.restore(); return; }
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(40, 4, 300, 18, 0, 0, TAU); ctx.fill();
    [[-150, 0], [230, 0]].forEach(([wx]) => { ctx.beginPath(); ctx.arc(wx, -78, 78, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(wx, -78, 40, 0, TAU); ctx.fillStyle = "#B9B4AA"; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.translate(wx, -78); ctx.rotate(spin); ctx.strokeStyle = "#6B6660"; ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ ctx.rotate(TAU / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(36, 0); ctx.stroke(); } ctx.restore(); });
    ctx.strokeStyle = "#8A8580"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-210, -110); ctx.lineTo(-120, -70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-250, -150); ctx.quadraticCurveTo(-250, -250, -140, -262); ctx.lineTo(40, -262); ctx.quadraticCurveTo(80, -200, 110, -140); ctx.lineTo(160, -110); ctx.lineTo(-60, -110); ctx.quadraticCurveTo(-130, -110, -160, -150); ctx.closePath();
    ctx.fillStyle = o.col || "#3F7FBF"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -170, -290, 220, 36, 16); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(110, -140); ctx.quadraticCurveTo(170, -250, 150, -360); ctx.lineTo(200, -360); ctx.quadraticCurveTo(230, -240, 250, -110); ctx.closePath(); ctx.fillStyle = o.col || "#3F7FBF"; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(230, -140); ctx.lineTo(230, -80); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(232, -300, 22, 30, -.2, 0, TAU); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(170, -365); ctx.lineTo(70, -360); ctx.stroke(); ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(70, -360); ctx.lineTo(100, -362); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(160, -365); ctx.lineTo(140, -450); ctx.stroke(); ctx.beginPath(); ctx.ellipse(136, -470, 26, 18, -.3, 0, TAU); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4);
    if (o.hang && false){ const sw = Math.sin(t * 3.4) * .25 + (o.swing || 0); ctx.save(); ctx.translate(150, -420); ctx.rotate(sw); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke(); ctx.scale(1 / s / f, 1 / s); ctx.scale(f * s, s); motoHelmet(ctx, 0, 82, 2.6, o.helmetCol || RED, t, true, 0); ctx.restore(); }
    if (o.lines){ ctx.save(); ctx.globalAlpha *= .6; ctx.strokeStyle = CREAM; ctx.lineWidth = 6; for (let i = 0; i < 5; i++){ const yy = -320 + i * 55, L = 80 + (i % 2) * 60, sh = (t * 900 + i * 70) % 60; ctx.beginPath(); ctx.moveTo(-300 - sh, yy); ctx.lineTo(-300 - sh - L, yy); ctx.stroke(); } ctx.restore(); }
    ctx.restore(); }

  /* ---------- hatchback (world, origin = ground centre), window hole so a seated toon shows ---------- */
  function carBody(ctx, x, y, s, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round";
    const col = o.col || "#E8A55B";
    ctx.beginPath(); ctx.moveTo(-400, -90); ctx.lineTo(-400, -250); ctx.quadraticCurveTo(-395, -290, -330, -300); ctx.lineTo(-250, -310); ctx.lineTo(-170, -470); ctx.quadraticCurveTo(-150, -500, -100, -500);
    ctx.lineTo(150, -500); ctx.quadraticCurveTo(200, -500, 230, -460); ctx.lineTo(330, -320); ctx.quadraticCurveTo(410, -300, 410, -230); ctx.lineTo(410, -90); ctx.closePath();
    ctx.moveTo(-215, -250); ctx.lineTo(-140, -455); ctx.lineTo(180, -455); ctx.lineTo(300, -250); ctx.closePath();
    ctx.fillStyle = col; ctx.fill("evenodd"); ol(ctx, 7);
    ctx.save(); ctx.globalAlpha *= .25; ctx.fillStyle = "#BFE2EA"; ctx.beginPath(); ctx.moveTo(180, -455); ctx.lineTo(300, -250); ctx.lineTo(260, -250); ctx.lineTo(150, -455); ctx.fill(); ctx.restore();
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(40, -250); ctx.lineTo(40, -110); ctx.stroke(); rr(ctx, 70, -210, 50, 14, 6); ctx.fillStyle = OUT; ctx.fill();
    ctx.fillStyle = hexA("#FFFFFF", .35); rr(ctx, -380, -170, 760, 16, 8); ctx.fill();
    ctx.beginPath(); ctx.ellipse(395, -220, 14, 26, 0, 0, TAU); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 4);
    [[-240], [250]].forEach(([wx]) => { ctx.beginPath(); ctx.arc(wx, -90, 92, Math.PI, TAU); ctx.fillStyle = "#3B2418"; ctx.fill();
      ctx.beginPath(); ctx.arc(wx, -82, 80, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(wx, -82, 40, 0, TAU); ctx.fillStyle = "#B9B4AA"; ctx.fill(); ol(ctx, 4); });
    ctx.restore(); }

  /* ---------- AI mascot (world, origin = hover point under the body) ---------- */
  function robot(ctx, x, y, s, t, o){
    o = o || {}; const mood = o.mood || "smug", holo = !!o.holo; ctx.save(); ctx.translate(x, y + Math.sin(t * 2.6) * 14 * s); ctx.scale(s, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (holo) ctx.globalAlpha *= .9;
    const bodyC = holo ? "#7FE0F0" : "#EEF2F5", trim = holo ? "#2FA8C4" : "#5B7DB1";
    glowAt(ctx, 0, 10, 170, holo ? "#7FE0F0" : "#9FD3FF", .45);
    ctx.fillStyle = hexA(holo ? "#7FE0F0" : "#9FD3FF", .5); ctx.beginPath(); ctx.ellipse(0, 10, 90 + Math.sin(t * 5) * 10, 16, 0, 0, TAU); ctx.fill();
    // arms
    const armL = mood === "oops" ? [-170, -330] : [-150, -150], armR = mood === "proud" || mood === "smug" ? [175, -420 + Math.sin(t * 4) * 10] : [170, -200];
    [[-90, -210, armL], [90, -210, armR]].forEach(([sx, sy, e]) => { ctx.strokeStyle = trim; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + e[0]) / 2, sy - 40, e[0], e[1]); ctx.stroke(); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(e[0], e[1], 26, 0, TAU); ctx.fillStyle = bodyC; ctx.fill(); ol(ctx, 5); });
    if (mood === "smug" || mood === "proud"){ ctx.save(); ctx.translate(armR[0] + 8, armR[1] - 34); rr(ctx, -9, -26, 18, 34, 8); ctx.fillStyle = bodyC; ctx.fill(); ol(ctx, 4); ctx.restore(); }
    // body
    ctx.beginPath(); ctx.moveTo(-100, -290); ctx.quadraticCurveTo(0, -310, 100, -290); ctx.lineTo(70, -40); ctx.quadraticCurveTo(0, -10, -70, -40); ctx.closePath(); ctx.fillStyle = bodyC; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(0, -170, 44, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, "AI", 0, -154, 44, "#FFFFFF", 900);
    if (mood === "proud" || mood === "smug"){ ctx.save(); ctx.globalAlpha *= .9; ctx.strokeStyle = GOLD; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-96, -282); ctx.lineTo(66, -60); ctx.stroke(); ctx.restore(); }
    // head
    ctx.strokeStyle = trim; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -470); ctx.lineTo(0, -540); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -548, 16, 0, TAU); ctx.fillStyle = Math.sin(t * 6) > 0 ? HL : GOLD; ctx.fill(); ol(ctx, 4);
    rr(ctx, -150, -480, 300, 200, 60); ctx.fillStyle = bodyC; ctx.fill(); ol(ctx, 6);
    rr(ctx, -120, -455, 240, 150, 44); ctx.fillStyle = "#1B2333"; ctx.fill();
    ctx.strokeStyle = "#7FE0F0"; ctx.fillStyle = "#7FE0F0"; ctx.lineWidth = 9;
    const bl = (t % 3.3) < .12;
    if (mood === "oops"){ [-50, 50].forEach(ex => { ctx.beginPath(); ctx.arc(ex, -385, 22, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(ex, -385, 7, 0, TAU); ctx.fill(); });
      ctx.beginPath(); ctx.moveTo(-34, -335); for (let i = 0; i <= 6; i++) ctx.lineTo(-34 + i * 11.3, -335 + (i % 2 ? -8 : 0)); ctx.stroke();
      ctx.fillStyle = "#9FD3FF"; ctx.beginPath(); ctx.ellipse(132, -470, 12, 18, 0, 0, TAU); ctx.fill(); }
    else if (o.shades){ ctx.fillStyle = "#0A0E16"; [-52, 52].forEach(ex => { rr(ctx, ex - 44, -410, 88, 46, 16); ctx.fill(); }); ctx.fillRect(-10, -400, 20, 8);
      ctx.save(); ctx.globalAlpha *= .6; ctx.fillStyle = "#FFFFFF"; [-52, 52].forEach(ex => { ctx.beginPath(); ctx.moveTo(ex - 30, -404); ctx.lineTo(ex - 14, -404); ctx.lineTo(ex - 28, -372); ctx.lineTo(ex - 40, -372); ctx.fill(); }); ctx.restore();
      ctx.beginPath(); ctx.moveTo(-36, -335); ctx.quadraticCurveTo(10, -310, 44, -345); ctx.stroke(); }
    else { [-50, 50].forEach(ex => { if (bl){ ctx.beginPath(); ctx.moveTo(ex - 18, -385); ctx.lineTo(ex + 18, -385); ctx.stroke(); } else { ctx.beginPath(); ctx.arc(ex, -380, 20, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } });
      ctx.beginPath(); ctx.arc(0, -350, 34, .15 * Math.PI, .85 * Math.PI); ctx.stroke(); }
    if (holo){ ctx.save(); ctx.globalAlpha *= .25; ctx.fillStyle = "#FFFFFF"; for (let yy = -560; yy < 0; yy += 18) ctx.fillRect(-180, yy + (t * 60) % 18, 360, 4); ctx.restore(); }
    ctx.restore(); }

  /* ---------- backdrops (world, drawn in `back`) ---------- */
  function wall(ctx, col, y1){ ctx.fillStyle = col; ctx.fillRect(-900, -900, 2900, (y1 || 1450) + 900); }
  function lamp(ctx, x, y, t, night, i){ const sw = Math.sin(t * .9 + i * 2) * .04; ctx.save(); ctx.translate(x, -300); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, y + 300); ctx.stroke();
    glowAt(ctx, 0, y + 380, night ? 380 : 220, "#FFD9A0", night ? .5 : .25); ctx.beginPath(); ctx.moveTo(-24, y + 300); ctx.lineTo(24, y + 300); ctx.lineTo(64, y + 370); ctx.lineTo(-64, y + 370); ctx.closePath(); ctx.fillStyle = i % 2 ? ORANGE : TEAL; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.ellipse(0, y + 372, 28, 10, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function windowBox(ctx, x, y, w, h, t, time){ ctx.save(); rr(ctx, x, y, w, h, 12); ctx.clip();
    const night = time === "night"; ctx.fillStyle = night ? "#16203C" : "#A9D6E2"; ctx.fillRect(x, y, w, h);
    for (let b = 0; b < Math.ceil(w / 70); b++){ const bh = h * (.3 + rnd(b + x) * .45); ctx.fillStyle = night ? "#232540" : (b % 2 ? "#CFC5B4" : "#DCCDB6"); ctx.fillRect(x + b * 70, y + h - bh, 62, bh);
      ctx.fillStyle = night ? "rgba(244,194,122,.8)" : "rgba(255,255,255,.5)"; for (let wy = y + h - bh + 14; wy < y + h - 10; wy += 30) for (let wx = x + b * 70 + 8; wx < x + b * 70 + 54; wx += 18) if (!night || rnd(wx + wy) > .5) ctx.fillRect(wx, wy, 9, 14); }
    if (!night) puffC(ctx, x + ((t * 20) % (w + 200)) - 100, y + 70, 70, "rgba(255,255,255,.9)"); else for (let i = 0; i < 14; i++){ ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * 2 + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(x + rnd(i + 3) * w, y + rnd(i + 8) * h * .4, 2.5, 0, TAU); ctx.fill(); }
    ctx.restore(); rr(ctx, x, y, w, h, 12); ctx.strokeStyle = "#FFF6EA"; ctx.lineWidth = 18; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.lineWidth = 10; ctx.stroke(); }
  function shelfRolls(ctx, x, y, w, t){ for (let r = 0; r < 3; r++){ const yy = y + r * 170; ctx.fillStyle = "#9A5A34"; rr(ctx, x, yy, w, 20, 6); ctx.fill(); ol(ctx, 3);
      for (let i = 0; i < Math.floor(w / 64); i++){ const cx = x + 36 + i * 64, col = ["#FFFFFF", "#F6C343", "#BFE2EA", "#E07A9B", "#F3D9B5"][(i + r * 2) % 5]; ctx.beginPath(); ctx.ellipse(cx, yy - 70, 28, 70, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 3);
        ctx.beginPath(); ctx.ellipse(cx, yy - 136, 26, 8, 0, 0, TAU); ctx.fillStyle = hexA(OUT, .2); ctx.fill(); } } }
  function printer(ctx, x, t, night){ const top = 1450 - 400; ctx.save();
    rr(ctx, x - 230, top, 460, 400, 18); ctx.fillStyle = "#D7DCE0"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 230, top, 460, 90, 18); ctx.fillStyle = "#5B6470"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x + 110, top + 20, 90, 50, 8); ctx.fillStyle = Math.sin(t * 5) > 0 ? "#7FE0A0" : "#3E9B5A"; ctx.fill(); ol(ctx, 3);
    for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(x - 180 + i * 40, top + 46, 10, 0, TAU); ctx.fillStyle = [RED, GOLD, "#5B7DB1"][i]; ctx.fill(); }
    const sh = (t * 80) % 60; ctx.save(); rr(ctx, x - 200, top + 100, 400, 230, 6); ctx.clip(); ctx.fillStyle = PAPER; ctx.fillRect(x - 200, top + 100, 400, 230);
    for (let i = -1; i < 5; i++){ ctx.fillStyle = ["#E8A55B", "#5B7DB1", "#7FA563", "#E07A9B"][(i + 4) % 4]; ctx.fillRect(x - 170, top + 110 + i * 60 + sh, 340, 26); } ctx.restore();
    rr(ctx, x - 200, top + 100, 400, 230, 6); ol(ctx, 4); ctx.fillStyle = "#3B3A3F"; rr(ctx, x - 240, top + 320, 480, 30, 8); ctx.fill();
    if (night) glowAt(ctx, x, top + 200, 300, "#BFE2EA", .25); ctx.restore(); }
  function sign(ctx, x, y, txt, bg, fg, w){ w = w || 420; ctx.save(); ctx.translate(x, y); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * .3, -200); ctx.lineTo(-w * .3, -40); ctx.moveTo(w * .3, -200); ctx.lineTo(w * .3, -40); ctx.stroke();
    rr(ctx, -w / 2, -45, w, 90, 16); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); textC(ctx, txt, 0, 16, 46, fg, 900, w - 40); ctx.restore(); }
  function hotelDoor(ctx, x, num, t, open){ const w = 230, h = 520, top = 1450 - h; ctx.save();
    rr(ctx, x - w / 2 - 18, top - 18, w + 36, h + 18, 8); ctx.fillStyle = "#6B3A22"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = "#1E1410"; ctx.fillRect(x - w / 2, top, w, h);
    if (open > 0) glowAt(ctx, x, top + 250, 200, "#FFE3A8", .45 * open);
    const ww = w * (1 - .85 * open); ctx.fillStyle = "#A86A3E"; rr(ctx, x - w / 2, top, ww, h, 4); ctx.fill(); ol(ctx, 4);
    if (ww > 60){ ctx.strokeStyle = hexA(OUT, .35); ctx.lineWidth = 4; rr(ctx, x - w / 2 + ww * .15, top + 40, ww * .7, 180, 6); ctx.stroke(); rr(ctx, x - w / 2 + ww * .15, top + 270, ww * .7, 200, 6); ctx.stroke();
      ctx.beginPath(); ctx.arc(x - w / 2 + ww * .85, top + 270, 10, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); }
    rr(ctx, x - 70, top - 90, 140, 56, 10); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); textC(ctx, num, x, top - 46, 40, BROWN, 900);
    ctx.restore(); }
  function sconce(ctx, x, y, t){ glowAt(ctx, x, y, 160, "#FFE3A8", .45 + .05 * Math.sin(t * 3 + x)); rr(ctx, x - 10, y + 10, 20, 50, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 3);
    ctx.beginPath(); ctx.moveTo(x - 36, y + 14); ctx.lineTo(x + 36, y + 14); ctx.lineTo(x + 24, y - 40); ctx.lineTo(x - 24, y - 40); ctx.closePath(); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 4); }
  function towelStack(ctx, x, y, n, cols){ for (let i = 0; i < n; i++){ rr(ctx, x - 60, y - 28 - i * 30, 120, 30, 10); ctx.fillStyle = cols ? cols[i % cols.length] : (i % 2 ? "#FFFFFF" : "#F3EFE6"); ctx.fill(); ol(ctx, 3); } }
  function house(ctx, x, w, col, t, o){ o = o || {}; const top = 1450 - 620; ctx.save();
    ctx.fillStyle = col; ctx.fillRect(x - w / 2, top, w, 640); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x - w / 2, top, w, 640);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 60, top + 10); ctx.lineTo(x, top - 200); ctx.lineTo(x + w / 2 + 60, top + 10); ctx.closePath(); ctx.fillStyle = o.roof || "#B5532E"; ctx.fill(); ol(ctx, 6);
    for (let i = 0; i < 6; i++){ ctx.strokeStyle = hexA(OUT, .25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - w / 2 - 60 + i * 40, top + 10 - i * 34); ctx.lineTo(x + w / 2 + 60 - i * 40, top + 10 - i * 34); ctx.stroke(); }
    windowBox(ctx, x - w / 2 + 50, top + 120, 200, 200, t, "day");
    rr(ctx, x + w / 2 - 200, top + 220, 150, 420, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(x + w / 2 - 80, top + 440, 8, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore(); }
  function gate(ctx, x0, x1){ ctx.save(); const top = 1460; ctx.fillStyle = "#3B3A3F"; for (let x = x0; x <= x1; x += 34){ ctx.fillRect(x - 5, top, 10, 200); ctx.beginPath(); ctx.moveTo(x - 9, top); ctx.lineTo(x, top - 22); ctx.lineTo(x + 9, top); ctx.fill(); }
    ctx.fillRect(x0 - 10, top + 30, x1 - x0 + 20, 14); ctx.fillRect(x0 - 10, top + 150, x1 - x0 + 20, 14); ctx.restore(); }
  function road(ctx, t, y0, dashOff){ ctx.fillStyle = "#6B6660"; ctx.fillRect(-2000, y0, 6000, 400); ctx.fillStyle = "#8A8580"; ctx.fillRect(-2000, y0, 6000, 14);
    ctx.fillStyle = "#F3EFE6"; for (let x = -2000 - ((dashOff || 0) % 220); x < 4000; x += 220) ctx.fillRect(x, y0 + 150, 120, 12); }

  function drawSet(ctx, name, t, F, s, idx){
    const o = F.setOpt || {};
    if (name === "cetak"){ const night = !!o.night; wall(ctx, night ? "#3E3346" : "#EBDDC6"); ctx.fillStyle = night ? "#2E2638" : "#D9C3A0"; ctx.fillRect(-900, 1150, 2900, 300); ctx.fillStyle = hexA(OUT, .2); ctx.fillRect(-900, 1150, 2900, 8);
      windowBox(ctx, 420, 420, 300, 330, t, night ? "night" : "day");
      sign(ctx, 570, 360, "CETAK SPANDUK", ORANGE, "#FFFFFF", 380);
      printer(ctx, o.printerX ?? 150, t, night); shelfRolls(ctx, o.shelfX ?? 790, 900, 330, t);
      lamp(ctx, 300, 300, t, night, 0); lamp(ctx, 860, 260, t, night, 1);
      if (night){ ctx.fillStyle = "rgba(10,12,30,.28)"; ctx.fillRect(-900, -900, 2900, 2350); } }
    else if (name === "ruang"){ wall(ctx, "#DCE8E2"); ctx.fillStyle = "#B98152"; ctx.fillRect(-900, 1120, 2900, 330); ctx.fillStyle = hexA(OUT, .25); ctx.fillRect(-900, 1112, 2900, 10);
      for (let x = -900; x < 2000; x += 120){ ctx.fillStyle = hexA(OUT, .12); ctx.fillRect(x, 1122, 6, 328); }
      windowBox(ctx, 620, 480, 360, 420, t, "day");
      [[600, -1], [1000, 1]].forEach(([cx, d]) => { const sw = Math.sin(t * 1.4 + d) * 10; ctx.beginPath(); ctx.moveTo(cx - 40 * d, 450); ctx.lineTo(cx + 40 * d, 450); ctx.quadraticCurveTo(cx + 30 * d + sw, 700, cx + 50 * d + sw, 950); ctx.lineTo(cx - 40 * d, 950); ctx.closePath(); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 4); });
      rr(ctx, 130, 520, 280, 220, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); rr(ctx, 150, 540, 240, 180, 4); ctx.fillStyle = "#BFE2EA"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(150, 720); ctx.lineTo(240, 600); ctx.lineTo(300, 660); ctx.lineTo(340, 620); ctx.lineTo(390, 720); ctx.closePath(); ctx.fillStyle = "#7FA563"; ctx.fill(); ctx.beginPath(); ctx.arc(330, 580, 22, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
      lamp(ctx, 540, 380, t, false, 1); }
    else if (name === "klien"){ wall(ctx, "#E6E0D6"); windowBox(ctx, 60, 380, 960, 640, t, "day");
      ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-900, 1080, 2900, 370); ctx.fillStyle = hexA("#FFFFFF", .08); for (let x = -900; x < 2000; x += 90) ctx.fillRect(x, 1080, 4, 370);
      rr(ctx, 400, 1150, 280, 110, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(460, 1205, 34, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ctx.beginPath(); ctx.arc(460, 1205, 16, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill();
      ctx.fillStyle = "#FFFFFF"; rr(ctx, 510, 1185, 140, 14, 7); ctx.fill(); rr(ctx, 510, 1212, 100, 12, 6); ctx.fill(); }
    else if (name === "koridor"){ wall(ctx, "#F1E3C8"); for (let x = -900; x < 2000; x += 60){ ctx.fillStyle = (Math.round(x / 60) % 2) ? "#E9D5B2" : "#F1E3C8"; ctx.fillRect(x, -900, 60, 2350); }
      ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-900, 1180, 2900, 270); ctx.fillStyle = hexA(OUT, .3); ctx.fillRect(-900, 1174, 2900, 10);
      const dO = F.door ? ramp(t, T(s, F.door.cue, .3, idx), T(s, F.door.cue, .3, idx) + .5) : 0;
      [[-240, "302"], [o.doorX ?? 760, "304"], [1280, "306"]].forEach(([x, n]) => hotelDoor(ctx, x, n, t, n === "304" ? dO : 0));
      [260, 1020].forEach(x => sconce(ctx, x, 820, t)); }
    else if (name === "lineup"){ wall(ctx, "#4E5560"); glowAt(ctx, 540, 600, 700, "#FFFFFF", .18);
      for (let i = 0; i < 11; i++){ const y = 1450 - i * 80; ctx.fillStyle = hexA("#FFFFFF", i % 2 ? .35 : .6); ctx.fillRect(-900, y - 3, 2900, i % 2 ? 4 : 6); if (!(i % 2)) { textC(ctx, String(120 + i * 10), 60, y - 12, 30, hexA("#FFFFFF", .7), 800); textC(ctx, String(120 + i * 10), 1020, y - 12, 30, hexA("#FFFFFF", .7), 800); } }
      sign(ctx, 540, 560, "SIAPA YANG SALAH?", "#2C2433", "#FFFFFF", 560); }
    else if (name === "linen"){ wall(ctx, "#E3ECEF"); ctx.fillStyle = "#C9D6DA"; ctx.fillRect(-900, 1200, 2900, 250);
      [[-60, 420], [700, 460]].forEach(([x0, w]) => { ctx.fillStyle = "#9A5A34"; ctx.fillRect(x0, 560, 18, 890); ctx.fillRect(x0 + w, 560, 18, 890);
        [700, 900, 1100, 1300].forEach((sy, r) => { ctx.fillStyle = "#9A5A34"; rr(ctx, x0, sy, w + 18, 20, 5); ctx.fill(); ol(ctx, 3); for (let i = 0; i < Math.floor(w / 140); i++) towelStack(ctx, x0 + 85 + i * 140, sy, 3 + ((i + r) % 3), [["#FFFFFF", "#F3EFE6"], ["#BFE2EA", "#FFFFFF"], ["#F3D9B5", "#FFFFFF"]][(i + r) % 3]); }); });
      sign(ctx, 540, 400, "RUANG LINEN", TEAL, "#FFFFFF", 360); }
    else if (name === "kamar"){ wall(ctx, "#E9D3B4"); ctx.fillStyle = "#C99A6E"; ctx.fillRect(-900, 1180, 2900, 270);
      windowBox(ctx, 560, 470, 300, 320, t, "day"); [[540, -1], [880, 1]].forEach(([cx, d]) => { const sw = Math.sin(t * 1.2 + d) * 8; ctx.beginPath(); ctx.moveTo(cx, 440); ctx.lineTo(cx + 50 * d, 440); ctx.quadraticCurveTo(cx + 40 * d + sw, 650, cx + 70 * d + sw, 820); ctx.lineTo(cx, 820); ctx.closePath(); ctx.fillStyle = "#7FA563"; ctx.fill(); ol(ctx, 4); });
      const wx = o.wardrobeX ?? 140, op = o.openCue ? ramp(t, T(s, o.openCue, .2, idx), T(s, o.openCue, .2, idx) + .5) : 1;
      rr(ctx, wx - 190, 700, 380, 750, 10); ctx.fillStyle = "#7A4528"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#2B1A12"; ctx.fillRect(wx - 170, 730, 340, 700);
      for (let i = 0; i < 5; i++){ ctx.fillStyle = ["#5B7DB1", "#E8A55B", "#7FA563", "#E9E2D6", "#D9483B"][i]; rr(ctx, wx - 150 + i * 62, 760, 54, 240, 8); ctx.fill(); }
      ctx.fillStyle = "#8E5A34"; ctx.fillRect(wx - 170, 1180, 340, 18); for (let r2 = 0; r2 < 2; r2++) for (let i = 0; i < 3; i++){ const sx = wx - 110 + r2 * 150, sy = 1176 - i * 42; rr(ctx, sx - 66, sy - 40, 132, 40, 8); ctx.fillStyle = ["#3F5E91", "#7A1F2B", "#2F6F73"][(i + r2) % 3]; ctx.fill(); ol(ctx, 3);
        ctx.save(); rr(ctx, sx - 66, sy - 40, 132, 40, 8); ctx.clip(); ctx.strokeStyle = hexA("#F6C343", .6); ctx.lineWidth = 4; for (let xx = sx - 60; xx < sx + 66; xx += 26){ ctx.beginPath(); ctx.moveTo(xx, sy - 40); ctx.lineTo(xx, sy); ctx.stroke(); } ctx.restore(); }
      [[-1], [1]].forEach(([d]) => { const ww = 170 * (1 - .8 * op); ctx.fillStyle = "#8E5A34"; if (d < 0) rr(ctx, wx - 170, 730, ww, 700, 4); else rr(ctx, wx + 170 - ww, 730, ww, 700, 4); ctx.fill(); ol(ctx, 4); });
      rr(ctx, 900, 1150, 500, 300, 20); ctx.fillStyle = "#F3EFE6"; ctx.fill(); ol(ctx, 5); rr(ctx, 900, 1150, 500, 70, 20); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); }
    else if (name === "toko"){ ctx.fillStyle = "#EAD2B0"; ctx.fillRect(-300, 520, 1700, 930); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(-300, 520, 1700, 930);
      rr(ctx, 160, 560, 760, 130, 18); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); textC(ctx, "TOKO SEPEDA", 540, 650, 70, "#FFFFFF", 900, 700);
      ctx.save(); ctx.beginPath(); ctx.moveTo(-320, 720); ctx.lineTo(1420, 720); ctx.lineTo(1400, 800); ctx.lineTo(-300, 800); ctx.closePath(); ctx.clip(); for (let i = 0; i < 30; i++){ ctx.fillStyle = i % 2 ? RED : CREAM; ctx.fillRect(-320 + i * 60, 720, 60, 90); } ctx.restore();
      rr(ctx, -200, 860, 1480, 590, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
      for (let i = 0; i < 4; i++){ const bx = -60 + i * 380; ctx.save(); ctx.globalAlpha *= .45; bicycle(ctx, bx, 1300, .62, ["#5B7DB1", "#7FA563", "#E07A9B", GOLD][i], t); ctx.restore(); }
      ctx.save(); ctx.globalAlpha *= .3; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(0, 860); ctx.lineTo(120, 860); ctx.lineTo(-60, 1450); ctx.lineTo(-180, 1450); ctx.fill(); ctx.restore(); }
    else if (name === "rumah"){ wall(ctx, "#F2E4CC"); ctx.fillStyle = "#D9B88E"; ctx.fillRect(-900, 1200, 2900, 250);
      rr(ctx, 700, 520, 300, 220, 8); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); rr(ctx, 718, 538, 264, 184, 4); ctx.fillStyle = "#F6E3C4"; ctx.fill();
      ctx.beginPath(); ctx.arc(800, 640, 40, 0, TAU); ctx.fillStyle = "#E8A55B"; ctx.fill(); ctx.beginPath(); ctx.arc(890, 650, 32, 0, TAU); ctx.fillStyle = "#7FA563"; ctx.fill();
      lamp(ctx, 120, 320, t, false, 0); }
    else if (name === "kompleks"){ house(ctx, 120, 560, "#F0C9A0", t, {}); house(ctx, 1240, 520, "#BFE2EA", t, { roof: "#5A3A2A" });
      gate(ctx, -140, 380); road(ctx, t, 1530, 0);
      ctx.save(); ctx.translate(o.warungX ?? 1000, 1450); rr(ctx, -150, -360, 300, 360, 8); ctx.fillStyle = "#F6E3C4"; ctx.fill(); ol(ctx, 5); rr(ctx, -170, -420, 340, 80, 12); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 5); textC(ctx, "WARUNG", 0, -366, 44, "#FFFFFF", 900, 300);
      for (let i = 0; i < 4; i++){ ctx.fillStyle = ["#F6C343", "#E07A9B", "#7FA563", "#E8A55B"][i]; rr(ctx, -120 + i * 62, -240, 48, 70, 6); ctx.fill(); ol(ctx, 3); } ctx.restore(); }
    else if (name === "garasi"){ wall(ctx, "#F3DFC2"); ctx.fillStyle = "#C2A27E"; ctx.fillRect(-900, 1250, 2900, 200);
      ctx.fillStyle = "#8E5A34"; ctx.fillRect(-300, 380, 1700, 40); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-300, 380, 1700, 40);
      [-100, 1180].forEach(x => { ctx.fillStyle = "#8E5A34"; ctx.fillRect(x - 14, 420, 28, 1030); });
      windowBox(ctx, 360, 560, 300, 280, t, "day"); rr(ctx, 60, 620, 180, 560, 6); ctx.fillStyle = "#7A4528"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#7FA563"; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.ellipse(720 + i * 60, 1200 + Math.sin(t * 2 + i) * 4, 34, 60, (i - 2) * .3, 0, TAU); ctx.fill(); } rr(ctx, 700, 1240, 260, 210, 10); ctx.fillStyle = "#B5532E"; ctx.fill(); ol(ctx, 4); }
  }

  /* ---------- bicycle (world, origin = ground centre) ---------- */
  function bicycle(ctx, x, y, s, col, t){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
    [[-200], [200]].forEach(([wx]) => { ctx.beginPath(); ctx.arc(wx, -125, 120, 0, TAU); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 18; ctx.stroke(); ctx.strokeStyle = "#B9B4AA"; ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++){ const a = i / 8 * Math.PI; ctx.beginPath(); ctx.moveTo(wx + Math.cos(a) * 110, -125 + Math.sin(a) * 110); ctx.lineTo(wx - Math.cos(a) * 110, -125 - Math.sin(a) * 110); ctx.stroke(); } });
    ctx.strokeStyle = col; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-200, -125); ctx.lineTo(-40, -125); ctx.lineTo(130, -300); ctx.lineTo(-70, -300); ctx.lineTo(-200, -125); ctx.moveTo(-40, -125); ctx.lineTo(-90, -350); ctx.moveTo(130, -300); ctx.lineTo(200, -125); ctx.moveTo(130, -300); ctx.lineTo(110, -400); ctx.stroke();
    ctx.lineWidth = 2; rr(ctx, -150, -375, 120, 30, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 3);
    ctx.strokeStyle = "#3B3A3F"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(60, -400); ctx.lineTo(170, -410); ctx.stroke();
    ctx.beginPath(); ctx.arc(-40, -125, 30, 0, TAU); ctx.strokeStyle = "#6B6660"; ctx.lineWidth = 8; ctx.stroke();
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }

  // fact cards (screen space)
  function factCard(ctx, fc, x, y, k, t, st){
    const q = pop(k, .35); if (q <= 0) return; ctx.save(); ctx.translate(x + (st.shake || 0), y); ctx.rotate((fc.rot ?? -2) * Math.PI / 180 + (st.fall || 0) * .6); ctx.scale(q * (st.flipS ?? 1), q);
    const txt = st.fixed ? fc.fix : fc.text, w = 520, h = 124, col = st.fixed || st.ok ? GREEN : st.bad ? RED : "#5B7DB1";
    rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fillStyle = PAPER; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.stroke();
    rr(ctx, -w / 2 + 14, -h / 2 + 14, 82, h - 28, 12); ctx.fillStyle = col; ctx.fill(); icon(ctx, fc.icon || "file", -w / 2 + 55, 0, 50, "#FFFFFF", 4);
    textC(ctx, txt, 50, 17, 50, BROWN, 900, w - 140);
    if (st.bad && !st.fixed){ ctx.save(); ctx.globalAlpha *= clamp(st.badK / .2, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-40, -h / 2); ctx.lineTo(-10, -10); ctx.lineTo(-30, 10); ctx.lineTo(10, h / 2); ctx.stroke();
      ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-w / 2 + 110, 0); ctx.lineTo(w / 2 - 20, 0); ctx.stroke(); ctx.restore(); cross(ctx, w / 2 - 6, -h / 2 + 4, 1.6 * pop(st.badK, .3)); }
    if (st.ok || st.fixed){ ctx.beginPath(); ctx.arc(w / 2 - 6, -h / 2 + 4, 34 * pop(st.okK, .3), 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); tick(ctx, w / 2 - 6, -h / 2 + 4, 1.4 * pop(st.okK, .3), "#FFFFFF"); }
    ctx.restore(); }

  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.mod) H.mod(sts, f);
    const spots = Object.assign({}, H.spots || {}, f.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = { c, f, shotT, s, idx };
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    layer(ctx, c, 1, () => { if (f.set) drawSet(ctx, f.set, t, f, s, idx); featBack(ctx, c, sts, R, t); if (H.back) H.back(ctx, c, sts, R); });
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      layer(ctx, c, 1, () => { featUnder(ctx, c, sts, j, R, t); if (H.under) H.under(ctx, c, sts, j, R); });
      R[j] = toon(ctx, c, a, s, t, { st });
      const r = R[j];
      if (r) layer(ctx, c, 1, () => {
        featOver1(ctx, c, sts, j, R, t);
        holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
          drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0) - (st.y - r.y), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1) })); });
        if (H.over1) H.over1(ctx, c, sts, j, R);
      }); } }));
    items.push({ z: .5, j: 99, draw: () => layer(ctx, c, 1, () => { featMid(ctx, c, sts, R, t); if (H.mid) H.mid(ctx, c, sts, R); }) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    layer(ctx, c, 1, () => { featFront(ctx, c, sts, R, t); if (H.front) H.front(ctx, c, sts, R); });
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    const ovs = [];
    ovs.push(() => { ctx.save(); featOver(ctx, c, sts, R, t); ctx.restore(); });
    if (H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, clamp(p[0] + (b.dx || 0), 200, 880), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180)); });
    (f.stamps || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx); if (t < T0) return; const x = p.x ?? 540, y = p.y ?? 600;
      ovs.push(() => { stampBox(ctx, p.text, x, y, t - T0, p.col || ORANGE, p.size || 60, (p.rot ?? -8) * Math.PI / 180); burstFx(ctx, x, y, t - T0 - .1, p.col || HL, 12, 200); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    (f.flash || []).forEach((fl, n) => { const k = t - tOf(s, fl, .3 + n * .1, idx); if (k >= 0 && k < .4) ovs.push(() => { ctx.save(); ctx.globalAlpha = .85 * (1 - k / .4); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }); });
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }

  /* ---------- features ---------- */
  function featBack(ctx, c, sts, R, t){ const f = R.f, s = R.s, idx = R.idx;
    if (f.banner){ const B = Object.assign({ x: 540, y: 520, w: 820, h: 220, text: "SELAMAT DATAMG", bad: 12 }, f.banner);
      const td = B.dropCue ? T(s, B.dropCue, .3, idx) : -1, q = t < td ? 0 : eBack(clamp((t - td) / .6, 0, 1)); if (q > 0){
        const y = lerp(B.y - 900, B.y, q), sw = Math.sin(t * 2.2) * .015 + (t - td < 1 ? Math.sin((t - td) * 14) * .03 * (1 - (t - td)) : 0);
        ctx.save(); ctx.translate(B.x, y); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-B.w * .4, -B.h / 2); ctx.lineTo(-B.w * .3, -900); ctx.moveTo(B.w * .4, -B.h / 2); ctx.lineTo(B.w * .3, -900); ctx.stroke();
        rr(ctx, -B.w / 2, -B.h / 2, B.w, B.h, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = ORANGE; ctx.fillRect(-B.w / 2, -B.h / 2, B.w, 30); ctx.fillRect(-B.w / 2, B.h / 2 - 30, B.w, 30);
        const size = fit(ctx, B.text, B.w - 70, 92, 900); ctx.fillStyle = TEAL; ctx.textAlign = "left"; const tw = ctx.measureText(B.text).width, x0 = -tw / 2; ctx.fillText(B.text, x0, size * .36);
        const pre = ctx.measureText(B.text.slice(0, B.bad)).width, cw = ctx.measureText(B.text[B.bad] || "M").width;
        const tm = B.markCue ? T(s, B.markCue, .4, idx) : 1e9, mq = clamp((t - tm) / .5, 0, 1); if (mq > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(x0 + pre + cw / 2, 0, cw * .9, size * .62, -.1, -1.2, -1.2 + TAU * mq * 1.05); ctx.stroke();
          if (mq >= 1){ textC(ctx, "N?", x0 + pre + cw / 2 + 4, -size * .7 + Math.sin(t * 5) * 4, 44, RED, 900); } }
        ctx.restore(); } }
    if (f.boxes){ const Bx = f.boxes; (Bx.cues || []).forEach((cu, n) => { const k = t - T(s, cu, .2 + n * .2, idx); if (k < 0) return; const q = clamp(k / .35, 0, 1), y = GY - 20 - n * 120 - (1 - eOut(q)) * 400;
      ctx.save(); ctx.translate(Bx.x + (n % 2 ? 14 : -10), y); ctx.rotate((n % 2 ? .04 : -.03)); rr(ctx, -110, -110, 220, 110, 6); ctx.fillStyle = "#C9925A"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#E8C9A0"; ctx.fillRect(-14, -110, 28, 110);
      textC(ctx, "SIAP KIRIM", 0, -40, 22, BROWN, 900); ctx.restore(); }); }
    if (f.chart) drawChart(ctx, f.chart, R, t);
    if (f.road) road(ctx, t, f.road.y ?? 1500, 0);
    if (f.parked) scooter(ctx, f.parked.x ?? 800, GY, f.parked.s || 1, f.parked.face || -1, t, { col: f.parked.col });
  }
  function featUnder(ctx, c, sts, j, R, t){ const f = R.f, s = R.s, idx = R.idx, st = sts[j];
    (f.motor || []).filter(m => (m.on ?? 0) === j).forEach(m => { const k = st.size / 700, hangOn = m.hang ? (m.hang === true || t < T(s, m.hang, .3, idx)) : false;
      const tb = m.brakeCue ? T(s, m.brakeCue, .3, idx) : 1e9, kb = t - tb, wob = kb > 0 && kb < 1.4 ? Math.sin(kb * 14) * .05 * (1 - kb / 1.4) : 0;
      const dist = (st.x - (m.x0 ?? st.x)); scooter(ctx, st.x + 60 * k * (st.face || 1), GY, k, st.face || 1, t, { hang: hangOn, spin: dist / 78 + (st.moving ? t * 0 : 0), wob, lines: st.moving && Math.abs(st.vx) > 200, col: m.col, helmetCol: m.helmetCol, swing: kb > 0 && kb < 1 ? Math.sin(kb * 10) * .8 * (1 - kb) : 0 });
      if (kb > 0 && kb < .9){ ctx.save(); ctx.globalAlpha *= 1 - kb / .9; for (let i = 0; i < 5; i++) puffC(ctx, st.x - 160 * k * (st.face || 1) - i * 40 * (st.face || 1), GY - 30 - rnd(i) * 30 - kb * 60, 40 + kb * 50, "#E9E2D6"); ctx.restore(); } });
  }
  function featOver1(ctx, c, sts, j, R, t){ const f = R.f, s = R.s, idx = R.idx, st = sts[j], r = R[j]; if (!r) return; const k = r.k;
    (f.motor || []).filter(m => (m.on ?? 0) === j).forEach(m => { const km = st.size / 700, hangOn = m.hang ? (m.hang === true || t < T(s, m.hang, .3, idx)) : false; if (!hangOn) return;
      const tb = m.brakeCue ? T(s, m.brakeCue, .3, idx) : 1e9, kb = t - tb, wob = kb > 0 && kb < 1.4 ? Math.sin(kb * 14) * .05 * (1 - kb / 1.4) : 0;
      scooter(ctx, st.x + 60 * km * (st.face || 1), GY, km, st.face || 1, t, { hangOnly: true, wob, helmetCol: m.helmetCol, swing: kb > 0 && kb < 1 ? Math.sin(kb * 10) * .8 * (1 - kb) : 0 }); });
    (f.blush || []).filter(b => (b.on ?? 0) === j).forEach(b => { const T0 = tOf(s, b, .3, idx), O = b.outCue ? T(s, b.outCue, .5, idx) : 1e9; if (t < T0 || t > O + .4) return; const a = clamp((t - T0) / .4, 0, 1) * (1 - clamp((t - O) / .4, 0, 1));
      ctx.save(); ctx.globalAlpha *= a * .5; ctx.fillStyle = "#E0453A"; ctx.beginPath(); ctx.ellipse(r.headX, r.headY + 4 * k, 17 * k, 12 * k, 0, 0, TAU); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha *= a * .8; for (let i = 0; i < 3; i++){ const q = (t * .9 + i / 3) % 1; puffC(ctx, r.headX + (i - 1) * 14 * k + Math.sin(q * 6 + i) * 3 * k, r.top - 4 * k - q * 26 * k, (4 + q * 5) * k, "#FFFFFF"); } ctx.restore(); });
    (f.stash || []).filter(h => (h.on ?? 0) === j).forEach(h => { const k0 = t - T(s, h.cue, .3, idx); if (k0 < 0) return; const p = handOf(st), op = eOut(clamp(k0 / .6, 0, 1));
      glowAt(ctx, p[0], p[1] - 200 * op, 300 * op, "#FFE7A0", .7 * op); for (let i = 0; i < 8; i++){ const a = -Math.PI / 2 + (i - 3.5) * .3; ctx.save(); ctx.globalAlpha *= .4 * op; ctx.strokeStyle = "#FFE7A0"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(a) * 60, p[1] - 80 + Math.sin(a) * 60); ctx.lineTo(p[0] + Math.cos(a) * (230 + Math.sin(t * 4 + i) * 30), p[1] - 80 + Math.sin(a) * (230 + Math.sin(t * 4 + i) * 30)); ctx.stroke(); ctx.restore(); }
      money(ctx, p[0], p[1] - 90 - 120 * op, 1.0 * op + .01, 5, t);
      if (k0 < 1.4){ ctx.save(); ctx.globalAlpha *= 1 - k0 / 1.4; for (let i = 0; i < 9; i++){ const a = i / 9 * TAU; puffC(ctx, p[0] + Math.cos(a) * (120 + k0 * 160), p[1] - 40 + Math.sin(a) * (50 + k0 * 90) - k0 * 50, 46 + k0 * 40, "#D9CBB4"); } ctx.restore(); } });
    (f.helmets || []).filter(h => (h.on ?? 0) === j).forEach(h => { const T0 = h.cue || h.at != null ? tOf(s, h, .3, idx) : -1; if (t < T0) return; const q = T0 < 0 ? 1 : eOut(clamp((t - T0) / .45, 0, 1));
      const tc = h.clickCue ? T(s, h.clickCue, .4, idx) : (h.click === false ? 1e9 : -1); const sitD = st.pose === "sit" ? 0 : 0;
      ctx.save(); ctx.translate(r.headX - 2 * k * (st.face || 1), r.headY + sitD - (1 - q) * 60 * k); ctx.scale(st.face || 1, 1); motoHelmet(ctx, 0, 0, k * 1.05, h.col || RED, t, t >= tc - .4 || tc < 0, t >= tc ? 1 : 0); ctx.restore(); });
    (f.belts || []).filter(b => (b.on ?? 0) === j).forEach(b => { const T0 = b.cue || b.at != null ? tOf(s, b, .3, idx) : -1; if (t < T0) return; const q = T0 < 0 ? 1 : eOut(clamp((t - T0) / .6, 0, 1)), fc = st.face || 1;
      const sx = st.x - 14 * k * fc, sy = r.headY + 22 * k, ex = st.x + 12 * k * fc, ey = r.headY + 46 * k;
      ctx.save(); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 7 * k; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, ex, q), lerp(sy, ey, q)); ctx.stroke(); ctx.strokeStyle = "#5B6470"; ctx.lineWidth = 3 * k; ctx.stroke();
      if (q >= 1){ rr(ctx, ex - 6 * k, ey - 4 * k, 12 * k, 8 * k, 2 * k); ctx.fillStyle = "#B9B4AA"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.2 * k; ctx.stroke(); } ctx.restore(); });
  }
  function featMid(ctx, c, sts, R, t){ const f = R.f, s = R.s, idx = R.idx;
    if (f.robot){ const Rb = f.robot, T0 = Rb.cue || Rb.at != null ? tOf(s, Rb, .3, idx) : -1; if (t >= T0){ let x = Rb.x ?? 540, y = Rb.y ?? 1500, mood = Rb.mood || "smug", shades = Rb.shades;
        (Rb.keys || []).forEach((kk, n) => { const tk = tOf(s, kk, .3 + n * .1, idx); if (t < tk) return; const q = easeIO(clamp((t - tk) / (kk.dur || .8), 0, 1)); if (kk.x != null) x = lerp(x, kk.x, q); if (kk.y != null) y = lerp(y, kk.y, q); if (kk.mood) mood = kk.mood; if (kk.shades != null) shades = kk.shades; });
        const q = T0 < 0 ? 1 : eBack(clamp((t - T0) / .55, 0, 1)); const sx = Rb.fromX != null ? lerp(Rb.fromX, x, q) : x, sy = Rb.fromY != null ? lerp(Rb.fromY, y, q) : y;
        if (Rb.holo && T0 >= 0 && t - T0 < 1){ ctx.save(); ctx.globalAlpha *= .35 * (1 - (t - T0)); ctx.fillStyle = "#7FE0F0"; ctx.beginPath(); ctx.moveTo((Rb.fromX ?? x) - 60, Rb.fromY ?? y); ctx.lineTo((Rb.fromX ?? x) + 60, Rb.fromY ?? y); ctx.lineTo(sx + 220, sy - 600); ctx.lineTo(sx - 220, sy - 600); ctx.fill(); ctx.restore(); }
        robot(ctx, sx, sy, (Rb.s || 1) * Math.max(.05, q), t, { mood, shades, holo: Rb.holo });
        R.robot = { x: sx, y: sy, s: Rb.s || 1 }; } }
    if (f.dice) drawDice(ctx, f.dice, R, t);
    if (f.panel){ const Pn = Object.assign({ x: 760, y: 700, w: 520, h: 420 }, f.panel), T0 = T(s, Pn.cue, .3, idx), k = t - T0; if (k >= 0){ const q = eBack(clamp(k / .6, 0, 1));
      const cx = lerp(Pn.fromX ?? Pn.x, Pn.x, q), cy = lerp(Pn.fromY ?? Pn.y, Pn.y, q), w = Pn.w * q, h = Pn.h * q;
      ctx.save(); ctx.globalAlpha *= .3 * (1 - clamp(k / .8, 0, 1)); ctx.fillStyle = "#7FE0F0"; ctx.beginPath(); ctx.moveTo((Pn.fromX ?? cx) - 60, Pn.fromY ?? cy); ctx.lineTo((Pn.fromX ?? cx) + 60, Pn.fromY ?? cy); ctx.lineTo(cx + w / 2, cy + h / 2); ctx.lineTo(cx - w / 2, cy + h / 2); ctx.fill(); ctx.restore();
      glowAt(ctx, cx, cy, Math.max(w, h) * .8, "#7FE0F0", .35);
      ctx.save(); ctx.translate(cx, cy + Math.sin(t * 2) * 8); ctx.rotate(-.02); rr(ctx, -w / 2, -h / 2, w, h, 24); ctx.fillStyle = hexA("#13223D", .93); ctx.fill(); ctx.strokeStyle = "#7FE0F0"; ctx.lineWidth = 7; ctx.stroke();
      if (q > .9){ rr(ctx, -w / 2, -h / 2, w, 70, 24); ctx.fillStyle = hexA("#7FE0F0", .25); ctx.fill(); textC(ctx, "JAWABAN AI", -w / 2 + 150, -h / 2 + 48, 34, "#7FE0F0", 900, 260);
        for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(w / 2 - 40 - i * 34, -h / 2 + 36, 10, 0, TAU); ctx.fillStyle = ["#7FE0A0", GOLD, RED][i]; ctx.fill(); }
        const typed = clamp((k - .5) / 2.2, 0, 1), nl = 7; for (let i = 0; i < nl; i++){ const lq = clamp(typed * nl - i, 0, 1); if (lq <= 0) break; ctx.fillStyle = hexA("#FFFFFF", i % 3 ? .55 : .85); rr(ctx, -w / 2 + 40, -h / 2 + 110 + i * 40, (w - 80 - (i % 3) * 60) * lq, 16, 8); ctx.fill(); }
        if (typed < 1 && Math.sin(t * 12) > 0){ ctx.fillStyle = "#7FE0F0"; ctx.fillRect(-w / 2 + 40 + (w - 80) * ((typed * nl) % 1), -h / 2 + 106 + Math.floor(typed * nl) * 40, 6, 24); }
        const tb = Pn.badgeCue ? T(s, Pn.badgeCue, .4, idx) : 1e9; if (t >= tb){ ctx.save(); ctx.translate(w / 2 - 120, h / 2 - 40); ctx.rotate(-.18); const qq = clamp((t - tb) / .3, 0, 1), sc = 2 - eOut(qq); ctx.scale(sc, sc); ctx.globalAlpha *= qq;
          rr(ctx, -150, -50, 300, 100, 18); ctx.fillStyle = hexA(CREAM, .96); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.stroke(); textC(ctx, "100% YAKIN", 0, 18, 50, RED, 900, 270); ctx.restore(); } }
      ctx.restore(); R.panel = { x: cx, y: cy }; } }
    if (f.cat){ const C = f.cat, tc = T(s, C.cue, .3, idx), k = t - tc; if (k > -.1 && k < 1.6){ const q = clamp(k / 1.2, 0, 1), x = lerp(C.x0 ?? 700, C.x1 ?? 1300, q), y = (C.y ?? 1420) - Math.sin(q * Math.PI) * 260;
        ctx.save(); ctx.translate(x, y); ctx.scale(-1.9, 1.9); ctx.rotate(Math.sin(q * Math.PI) * -.2); ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.ellipse(0, 0, 60, 30, 0, 0, TAU); ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.arc(58, -22, 28, 0, TAU); ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(42, -44); ctx.lineTo(48, -66); ctx.lineTo(60, -48); ctx.moveTo(64, -48); ctx.lineTo(76, -64); ctx.lineTo(80, -40); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 3);
        ctx.strokeStyle = "#E8A55B"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-56, -6); ctx.quadraticCurveTo(-100, -50 + Math.sin(t * 12) * 10, -80, -80); ctx.stroke();
        [[-30], [30]].forEach(([lx]) => { ctx.strokeStyle = "#E8A55B"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(lx, 20); ctx.lineTo(lx + Math.sin(t * 20 + lx) * 16, 44); ctx.stroke(); });
        ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(66, -26, 5, 0, TAU); ctx.fill(); ctx.restore(); } }
  }
  function featFront(ctx, c, sts, R, t){ const f = R.f, s = R.s, idx = R.idx;
    if (f.table) drawTable(ctx, f.table, R, t);
    if (f.car){ const C = f.car, q = C.cue ? pop(t - T(s, C.cue, .3, idx), .5) : 1; carBody(ctx, C.x ?? 800, GY, (C.s || 1) * q, t, C); }
    if (f.chest) drawChest(ctx, f.chest, R, t);
    if (f.bike) drawBike(ctx, f.bike, R, t);
    if (f.trolley) drawTrolley(ctx, f.trolley, R, t);
    if (f.pole){ const px = f.pole.x ?? 1200; ctx.fillStyle = "#B9B4AA"; rr(ctx, px - 30, 300, 60, GY - 300 + 20, 10); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#8A8580"; ctx.fillRect(px - 120, 420, 240, 26); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(px - 120, 420, 240, 26);
      ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 4; [-100, 100].forEach(d => { ctx.beginPath(); ctx.moveTo(px + d, 420); ctx.quadraticCurveTo(px + d * 4, 520, px + d * 9, 430); ctx.stroke(); }); }
  }
  function featOver(ctx, c, sts, R, t){ const f = R.f, s = R.s, idx = R.idx;
    if (f.toa){ const A = f.toa, j = A.on ?? 0, st = sts[j], r = R[j]; const T0 = A.cue || A.at != null ? tOf(s, A, .2, idx) : -1;
      if (r && t >= T0){ const fc = st.face || 1, hp = handOf(st), q = T0 < 0 ? 1 : eBack(clamp((t - T0) / .35, 0, 1)), k = st.size / 760;
        const mx = hp[0] + 250 * k * fc, my = hp[1] - 60 * k;
        ctx.save(); c.apply(ctx, 1); ctx.translate(hp[0], hp[1] - (st.y - r.y)); ctx.scale(fc * k * q, k * q); ctx.rotate(-.22);
        const pulse = (A.blasts || []).some((b, n) => { const kb = t - T(s, b.cue, .3 + n * .2, idx); return kb >= 0 && kb < .3; }) ? 1.08 : 1; ctx.scale(pulse, pulse);
        rr(ctx, -20, -10, 40, 90, 10); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.moveTo(-30, -40); ctx.lineTo(60, -50); ctx.lineTo(260, -150); ctx.lineTo(260, 70); ctx.lineTo(60, 20); ctx.lineTo(-30, 10); ctx.closePath(); ctx.fillStyle = "#F3EFE6"; ctx.fill(); ol(ctx, 7);
        ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(150, -100); ctx.lineTo(200, -125); ctx.lineTo(200, 45); ctx.lineTo(150, 30); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.ellipse(262, -40, 22, 112, 0, 0, TAU); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 5); ctx.restore();
        const ms = c.toScreen(hp[0] + 270 * k * fc * Math.cos(.22), hp[1] - (st.y - r.y) - 100 * k);
        (A.blasts || []).forEach((b, n) => { const kb = t - T(s, b.cue, .3 + n * .2, idx); if (kb < 0 || kb > 1.6) return; const praise = b.kind === "praise";
          for (let w = 0; w < 3; w++){ const q2 = ((kb * 1.6 + w / 3) % 1); ctx.save(); ctx.globalAlpha = (1 - q2) * (kb < 1.2 ? 1 : (1.6 - kb) / .4); ctx.strokeStyle = praise ? GOLD : RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(ms[0] - fc * 40, ms[1], 60 + q2 * 260, fc > 0 ? -.7 : Math.PI - .7, fc > 0 ? .7 : Math.PI + .7); ctx.stroke(); ctx.restore(); }
          const q3 = eOut(clamp(kb / .9, 0, 1)), sc0 = .5 + .6 * q3; font(ctx, 900, 104, FAM); const hw = Math.min(ctx.measureText(String(b.text).toUpperCase()).width * sc0 / 2 + 20, 440);
          const x = clamp(ms[0] + fc * (120 + q3 * 230), 90 + hw, 990 - hw), y = Math.max(300, ms[1] - 200 - q3 * 160);
          ctx.save(); ctx.globalAlpha = kb < 1.3 ? 1 : (1.6 - kb) / .3; ctx.translate(x + Math.sin(kb * 40) * (praise ? 0 : 6) * (1 - q3), y); ctx.rotate(-.08 * fc); const sc = .5 + .6 * q3; ctx.scale(sc, sc);
          outlineWords(ctx, String(b.text).toUpperCase().split(" ").map(w => ({ w, hl: true })), 0, 0, 104, { sw: 24, hl: praise ? GOLD : RED }); ctx.restore();
          if (praise) for (let i = 0; i < 6; i++){ const a = i / 6 * TAU + kb * 2, rr2 = 80 + q3 * 220; heart(ctx, x + Math.cos(a) * rr2, y + 60 + Math.sin(a) * rr2 * .5 - kb * 60, 22 * (1 - kb / 1.6) + 4, i % 2 ? "#E07A9B" : GOLD); } }); } }
    if (f.whisper){ const W = f.whisper, j = W.on ?? 0, r = R[j], k = t - T(s, W.cue, .3, idx); if (r && k >= 0){ const p = r.screen.head, q = pop(k, .3);
        ctx.save(); ctx.translate(clamp(p[0] + 170 * (sts[j].face || 1), 200, 880), p[1] - 210); ctx.scale(q, q); ctx.globalAlpha *= .95; ctx.setLineDash([8, 8]);
        rr(ctx, -110, -36, 220, 72, 36); ctx.fillStyle = hexA("#FFFFFF", .85); ctx.fill(); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 4; ctx.stroke(); ctx.setLineDash([]);
        textC(ctx, W.text || "makasih...", 0, 10, 26, "#9AA6B2", 700); ctx.restore(); } }
    (f.ping || []).forEach((pg, n) => { const j = pg.on ?? 0, r = R[j], st = sts[j], k = t - tOf(s, pg, .3 + n * .1, idx); if (!r || k < 0) return; const hp = c.toScreen(...handOf(st)), q = pop(k, .3);
      const x = clamp(hp[0] + 150 * (st.face || 1), 170, 910), y = hp[1] - 150;
      ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 4); ctx.scale(q, q); rr(ctx, -80, -30, 160, 60, 18); ctx.fillStyle = "#DCF2C9"; ctx.fill(); ol(ctx, 3); textC(ctx, pg.text || "mksh", 0, 10, 28, BROWN, 700);
      ctx.beginPath(); ctx.moveTo(-50 * (st.face || 1), 28); ctx.lineTo(-70 * (st.face || 1), 50); ctx.lineTo(-24 * (st.face || 1), 28); ctx.fillStyle = "#DCF2C9"; ctx.fill(); ctx.restore();
      if (pg.label){ popChip(ctx, pg.label, x, y - 80, k - .5, "#9AA6B2", "#FFFFFF", 26, -.05); } });
    (f.facts || []).forEach((fc, n) => { const k = t - tOf(s, fc, .3 + n * .15, idx); if (k < 0) return;
      const tb = fc.crackCue ? T(s, fc.crackCue, .4, idx) : 1e9, tf = fc.fixCue ? T(s, fc.fixCue, .5, idx) : 1e9, to = fc.okCue ? T(s, fc.okCue, .5, idx) : 1e9;
      const st = { bad: t >= tb, badK: t - tb, ok: t >= to, okK: t >= tf + .2 ? t - tf - .2 : t - to, fixed: t >= tf + .2 };
      if (st.bad && t - tb < .5) st.shake = Math.sin((t - tb) * 60) * 12 * (1 - (t - tb) / .5);
      if (t >= tf && t < tf + .4){ st.flipS = Math.abs(Math.cos((t - tf) / .4 * Math.PI)); }
      let x = fc.x ?? 540, y = fc.y ?? (330 + n * 140);
      if (fc.from && k < .6){ const q = eOut(clamp(k / .6, 0, 1)); const p0 = fc.from === "robot" && R.robot ? c.toScreen(R.robot.x, R.robot.y - 400 * R.robot.s) : fc.from === "panel" && R.panel ? c.toScreen(R.panel.x, R.panel.y) : [540, 900]; x = lerp(p0[0], x, q); y = lerp(p0[1], y, q); }
      if (fc.dropCue && t > T(s, fc.dropCue, .5, idx)){ const kd = t - T(s, fc.dropCue, .5, idx); y += kd * kd * 1800; st.fall = kd; }
      factCard(ctx, fc, x, y, k, t, st); });
    if (f.over2) f.over2(ctx, c, sts, R, t);
  }

  /* --- table with tea + proof sheet (front) --- */
  function drawTable(ctx, Tb, R, t){ const x = Tb.x ?? 540, top = Tb.top ?? 1420, s = R.s, idx = R.idx;
    ctx.save(); ctx.fillStyle = "#6B3A22"; ctx.fillRect(x - 30, top, 60, GY - top + 30); rr(ctx, x - 150, GY + 10, 300, 30, 10); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, top, 360, 70, 0, 0, TAU); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(x, top - 8, 340, 58, 0, 0, TAU); ctx.fillStyle = "#C08654"; ctx.fill();
    [-200, 200].forEach((dx, i) => { const cx = x + dx, cy = top - 18; rr(ctx, cx - 34, cy - 60, 68, 60, 12); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(cx + 38, cy - 32, 16, -1.4, 1.4); ol(ctx, 6);
      ctx.beginPath(); ctx.ellipse(cx, cy, 50, 12, 0, 0, TAU); ctx.fillStyle = "#F3EFE6"; ctx.fill(); ol(ctx, 3);
      for (let k = 0; k < 3; k++){ const q = (t * .6 + k / 3 + i * .2) % 1; ctx.save(); ctx.globalAlpha *= .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - 12 + k * 12, cy - 70 - q * 90); ctx.quadraticCurveTo(cx + k * 12 + Math.sin(q * 8 + k) * 14, cy - 100 - q * 90, cx - 8 + k * 12, cy - 130 - q * 90); ctx.stroke(); ctx.restore(); } });
    if (Tb.sheet){ const sq = Tb.sheetCue ? pop(t - T(s, Tb.sheetCue, .2, idx), .4) : 1; if (sq > 0){ ctx.save(); ctx.translate(x, top - 30); ctx.scale(sq, sq); ctx.rotate(-.04);
      rr(ctx, -120, -100, 240, 130, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "CEK EJAAN", 0, -66, 26, ORANGE, 900);
      (Tb.tickCues || []).forEach((cu, n) => { const kk = t - T(s, cu, .3 + n * .2, idx); ctx.fillStyle = "#C9BBA6"; rr(ctx, -70, -48 + n * 26, 150, 10, 5); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-100, -54 + n * 26, 18, 18); if (kk >= 0) tick(ctx, -91, -45 + n * 26, .9 * pop(kk, .3)); });
      ctx.restore(); } }
    ctx.restore(); }

  /* --- wooden chest (front) --- */
  function drawChest(ctx, Ch, R, t){ const x = Ch.x ?? 640, s = R.s, idx = R.idx, to = Ch.openCue ? T(s, Ch.openCue, .3, idx) : 1e9, op = eBack(clamp((t - to) / .6, 0, 1)), w = 380, h = 200, y = GY + 20;
    const ti = Ch.inCue ? T(s, Ch.inCue, .2, idx) : -1, slide = Ch.inCue ? eOut(clamp((t - ti) / .8, 0, 1)) : 1; const cx = lerp(Ch.fromX ?? x, x, slide);
    ctx.save(); ctx.translate(cx, y);
    if (op > 0){ glowAt(ctx, 0, -h - 60, 320 * op, "#FFE7A0", .7 * op); for (let i = 0; i < 8; i++){ const a = -Math.PI / 2 + (i - 3.5) * .28; ctx.save(); ctx.globalAlpha *= .4 * op; ctx.strokeStyle = "#FFE7A0"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 60, -h + Math.sin(a) * 60); ctx.lineTo(Math.cos(a) * (240 + Math.sin(t * 4 + i) * 30), -h + Math.sin(a) * (240 + Math.sin(t * 4 + i) * 30)); ctx.stroke(); ctx.restore(); }
      money(ctx, 0, -h - 30 - 50 * op, 1.1, 5, t); }
    rr(ctx, -w / 2, -h, w, h, 14); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#6B3A22"; ctx.fillRect(-w / 2, -h * .55, w, 18); [-w / 2 + 30, w / 2 - 30].forEach(bx => { ctx.fillStyle = GOLD; ctx.fillRect(bx - 10, -h, 20, h); });
    if (op > 0){ ctx.beginPath(); ctx.ellipse(0, -h, w / 2 - 10, 26 * op, 0, 0, TAU); ctx.fillStyle = "#2B1A12"; ctx.fill(); }
    ctx.save(); ctx.translate(0, -h - op * 110); ctx.rotate(-op * .18); ctx.scale(1, 1 - .35 * op); rr(ctx, -w / 2 - 8, -80, w + 16, 84, 30); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 6); ctx.restore();
    rr(ctx, -26, -h - 10, 52, 54, 8); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    const td = Ch.dustCue ? T(s, Ch.dustCue, .3, idx) : to, kd = t - td; if (kd > 0 && kd < 1.4){ ctx.save(); ctx.globalAlpha *= 1 - kd / 1.4; for (let i = 0; i < 9; i++){ const a = Math.PI + i / 8 * Math.PI; puffC(ctx, Math.cos(a) * (200 + kd * 180), -h * .6 + Math.sin(a) * (60 + kd * 120) - kd * 60, 50 + kd * 50, "#D9CBB4"); } ctx.restore(); }
    ctx.restore(); }

  /* --- bike + rolling price tag (front) --- */
  function drawBike(ctx, Bk, R, t){ const x = Bk.x ?? 700, s = R.s, idx = R.idx; bicycle(ctx, x, GY, Bk.s || 1.05, Bk.col || RED, t);
    ctx.save(); ctx.translate(x + 30, GY - 260); ctx.rotate(-.1); rr(ctx, -70, -30, 140, 50, 25); ctx.fillStyle = "#E07A9B"; ctx.fill(); ol(ctx, 4); textC(ctx, "BARU", 0, 8, 28, "#FFFFFF", 900); ctx.restore();
    const tt = Bk.tagCue ? T(s, Bk.tagCue, .3, idx) : 1e9, q = clamp((t - tt) / (Bk.tagDur || 2.2), 0, 1), val = Math.round(lerp(Bk.tagFrom || 1500000, Bk.tagTo || 2100000, easeIO(q)) / 1000) * 1000;
    const hx = x + 190 * (Bk.s || 1.05), hy = GY - 430 * (Bk.s || 1.05), sw = Math.sin(t * 2.4) * .08 + (q > 0 && q < 1 ? Math.sin(t * 30) * .05 : 0);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
    ctx.translate(0, 60); rr(ctx, -150, 0, 300, 140, 16); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, 20, 10, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    textC(ctx, "HARGA", 0, 60, 26, BROWN, 900); textC(ctx, "Rp" + val.toLocaleString("id-ID"), 0, 116, 50, q > 0 ? RED : BROWN, 900, 270);
    if (q > 0 && q < 1){ ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(170, 120); ctx.lineTo(170, 20); ctx.lineTo(150, 40); ctx.moveTo(170, 20); ctx.lineTo(190, 40); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }

  /* --- housekeeping trolley (front) --- */
  function drawTrolley(ctx, Tr, R, t){ const x = Tr.x ?? 620, s = R.s, idx = R.idx, mode = Tr.mode || "cek", sc = Tr.s || 1;
    const t4 = Tr.shelfCue ? T(s, Tr.shelfCue, .3, idx) : (mode === "baru" ? -1 : 1e9), q4 = t < t4 ? 0 : eBack(clamp((t - t4) / .5, 0, 1));
    const tl = Tr.labelCue ? T(s, Tr.labelCue, .3, idx) : 1e9, tc = Tr.listCue ? T(s, Tr.listCue, .3, idx) : 1e9, tm = Tr.missCue ? T(s, Tr.missCue, .3, idx) : 1e9;
    ctx.save(); ctx.translate(x, GY); ctx.scale(sc, sc); ctx.lineJoin = "round";
    const W = 520, H = 600; ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 8, 320, 20, 0, 0, TAU); ctx.fill();
    [-W / 2 + 40, W / 2 - 40].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -34, 34, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); });
    ctx.strokeStyle = "#8A8580"; ctx.lineWidth = 16; ctx.strokeRect(-W / 2, -H - 60, W, H - 10); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-W / 2 - 8, -H - 68, W + 16, H + 6);
    ctx.strokeStyle = "#8A8580"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-W / 2, -H - 40); ctx.lineTo(-W / 2 - 80, -H - 80); ctx.lineTo(-W / 2 - 80, -H + 60); ctx.stroke();
    const shelves = [-H - 60 + 150, -H - 60 + 300, -H - 60 + 450]; shelves.forEach((sy, i) => { ctx.fillStyle = "#B9B4AA"; rr(ctx, -W / 2, sy, W, 16, 4); ctx.fill(); ol(ctx, 3); });
    // top shelf: towel rolls
    const slots = 3; for (let i = 0; i < 4; i++){ const tx = -W / 2 + 70 + i * 125, ty = -H - 60 + 140;
      if (i < slots){ ctx.beginPath(); ctx.ellipse(tx, ty - 40, 52, 40, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(tx, ty - 40, 22, 16, 0, 0, TAU); ctx.strokeStyle = "#9FD3E0"; ctx.lineWidth = 4; ctx.stroke(); }
      else if (mode === "cek"){ if (t >= tm){ ctx.save(); ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.ellipse(tx, ty - 40, 52, 40, 0, 0, TAU); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); textC(ctx, "?", tx, ty - 22, 56 + Math.sin(t * 6) * 4, RED, 900); } }
      else if (q4 > 0){ ctx.save(); ctx.translate(tx + (1 - q4) * 300, ty - 40); ctx.beginPath(); ctx.ellipse(0, 0, 52, 40, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(0, 0, 22, 16, 0, 0, TAU); ctx.strokeStyle = "#9FD3E0"; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } }
    if (mode === "cek"){ ctx.save(); ctx.translate(W / 2 - 10, -H - 60 - 30); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(-30, -10, 60, 10); ctx.restore(); }
    // middle + bottom shelves: supplies
    for (let i = 0; i < 4; i++){ const bx = -W / 2 + 70 + i * 125, by = shelves[1]; rr(ctx, bx - 34, by - 80, 68, 80, 10); ctx.fillStyle = ["#7FD3C7", "#F6C343", "#E07A9B", "#BFE2EA"][i]; ctx.fill(); ol(ctx, 3); }
    towelStack(ctx, -W / 2 + 130, shelves[2], 3, ["#F3D9B5", "#FFFFFF"]); towelStack(ctx, W / 2 - 130, shelves[2], 2, ["#BFE2EA", "#FFFFFF"]);
    // fourth shelf (mode baru): extends the top rail
    if (mode === "baru" && q4 > 0){ ctx.save(); ctx.globalAlpha *= clamp(q4 * 2, 0, 1); ctx.fillStyle = GREEN; rr(ctx, W / 2 - 150, -H - 60 + 140, 140, 14, 4); ctx.fill(); ol(ctx, 3); ctx.restore(); }
    // labels
    if (t >= tl){ const k = t - tl; ctx.save(); ctx.translate(-W / 2 + 130, -H - 60 + 182); ctx.scale(pop(k), pop(k)); rr(ctx, -125, -28, 250, 56, 12); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 3); textC(ctx, "STANDAR: 3", 0, 12, 34, "#FFFFFF", 900, 230); ctx.restore();
      ctx.save(); ctx.translate(W / 2 - 130, -H - 60 + 182); ctx.scale(pop(k - .2), pop(k - .2)); rr(ctx, -125, -28, 250, 56, 12); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 3); textC(ctx, "BESAR: 4", 0, 12, 34, "#FFFFFF", 900, 230); ctx.restore(); }
    // laundry bag on the side
    ctx.save(); ctx.translate(W / 2 + 30, -H + 120); ctx.rotate(Math.sin(t * 1.5) * .03); rr(ctx, 0, 0, 150, 360, 30); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); ctx.restore();
    // checklist card
    if (mode === "baru" && t >= tc){ const k = t - tc, q = pop(k, .4); ctx.save(); ctx.translate(-W / 2 + 10, -H + 210); ctx.rotate(-.05); ctx.scale(q, q); rr(ctx, -10, 0, 230, 260, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, "DAFTAR CEK", 105, 46, 28, ORANGE, 900, 200);
      for (let i = 0; i < 4; i++){ ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(14, 76 + i * 44, 22, 22); ctx.fillStyle = "#C9BBA6"; rr(ctx, 48, 82 + i * 44, 140, 10, 5); ctx.fill(); if (k > .4 + i * .3) tick(ctx, 25, 87 + i * 44, 1.1 * pop(k - .4 - i * .3, .25)); } ctx.restore(); }
    else if (mode === "cek" && t >= tm){ ctx.save(); ctx.translate(-W / 2 + 10, -H + 210); ctx.setLineDash([10, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.strokeRect(-10, 0, 230, 260); ctx.setLineDash([]); textC(ctx, "DAFTAR", 105, 110, 34, RED, 900); textC(ctx, "CEK?", 105, 160, 44, RED, 900); ctx.restore(); }
    ctx.restore(); }

  /* --- door frame height chart (back) --- */
  function drawChart(ctx, Cs, R, t){ const s = R.s, idx = R.idx, x = Cs.x ?? 420; ctx.save();
    rr(ctx, x - 150, 560, 300, 890, 6); ctx.fillStyle = "#4A2E1A"; ctx.fill(); ctx.fillStyle = "#8E5A34"; ctx.fillRect(x - 150, 560, 36, 890); ctx.fillRect(x + 114, 560, 36, 890); ctx.fillRect(x - 150, 560, 300, 36); ol(ctx, 4);
    ctx.fillStyle = "#3A2416"; ctx.fillRect(x - 114, 596, 228, 854); rr(ctx, x - 106, 606, 212, 844, 4); ctx.fillStyle = "#A86A3E"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(x + 80, 1050, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill();
    const years = Cs.years || [], grow = Cs.growCue ? T(s, Cs.growCue, .3, idx) : 1e9;
    // price marks on the left post, money marks on the right post
    years.forEach((yv, n) => { const ty = T(s, yv.cue, .2 + n * .12, idx), k = t - ty; if (k < 0) return; const q = pop(k, .3);
      const py = 1240 - n * 130; ctx.save(); ctx.translate(x - 132, py); ctx.scale(q, q); ctx.fillStyle = RED; ctx.fillRect(-50, -6, 70, 12); rr(ctx, -310, -36, 270, 72, 18); ctx.fill(); ol(ctx, 4); textC(ctx, yv.price, -175, 13, 38, "#FFFFFF", 900, 250); ctx.restore();
      textC(ctx, yv.label, x, py + 10, 28, hexA(CREAM, .95), 800, 200);
      const gy = t >= grow ? Math.min(n, Math.max(0, (t - grow) / .5)) : 0, my = 1240 - gy * 130;
      ctx.save(); ctx.translate(x + 132, my); ctx.scale(q, q); ctx.fillStyle = GREEN; ctx.fillRect(-20, -6, 70, 12); rr(ctx, 40, -36, 270, 72, 18); ctx.fill(); ol(ctx, 4); textC(ctx, t >= grow && n > 0 ? "TUMBUH" : "UANG DIAM", 175, 13, 34, "#FFFFFF", 900, 250); ctx.restore(); });
    ctx.restore(); }

  /* --- dice (mid) --- */
  function drawDice(ctx, D, R, t){ const s = R.s, idx = R.idx, tr = T(s, D.rollCue, .3, idx), tl = D.landCue ? T(s, D.landCue, .5, idx) : tr + 1.6; if (t < tr) return;
    const k = t - tr, rolling = t < tl, q = clamp(k / Math.max(.4, tl - tr), 0, 1), x = lerp(D.x0 ?? 300, D.x ?? 560, q), bounce = rolling ? Math.abs(Math.sin(k * 7)) * 260 * (1 - q) : 0, y = (D.y ?? 1500) - bounce;
    ctx.save(); ctx.translate(x, y - 130); ctx.rotate(rolling ? k * 9 : 0); const S = 120;
    rr(ctx, -S, -S, 2 * S, 2 * S, 30); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 8);
    const face = rolling ? Math.floor(k * 10) % 6 : -1;
    if (face >= 0){ const P = [[[0, 0]], [[-1, -1], [1, 1]], [[-1, -1], [0, 0], [1, 1]], [[-1, -1], [1, -1], [-1, 1], [1, 1]], [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]][face];
      P.forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px * 60, py * 60, 22, 0, TAU); ctx.fillStyle = face === 0 ? RED : OUT; ctx.fill(); }); }
    else textC(ctx, "?", 0, 50, 150, ORANGE, 900);
    ctx.restore();
    if (!rolling){ const kk = t - tl; const names = D.names || ["Budi", "Slamet", "Hartono"]; const sp = R.c.toScreen(x, y - 420);
      R.diceTop = sp; void names; }
  }

  /* --- crash-test sled (front) --- */
  function drawSled(ctx, Sl, R, t){ const s = R.s, idx = R.idx;
    ctx.fillStyle = "#3B3A3F"; ctx.fillRect(-600, GY - 10, 2400, 20); ctx.fillStyle = "#8A8580"; for (let x = -600; x < 1800; x += 80) ctx.fillRect(x, GY - 14, 40, 8);
    const bx = Sl.wallX ?? 980; rr(ctx, bx, GY - 520, 120, 520, 10); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 6); ctx.save(); ctx.beginPath(); rr(ctx, bx, GY - 520, 120, 520, 10); ctx.clip(); for (let i = -6; i < 12; i++){ ctx.fillStyle = "#2C2433"; ctx.beginPath(); ctx.moveTo(bx, GY - 520 + i * 80); ctx.lineTo(bx + 120, GY - 580 + i * 80); ctx.lineTo(bx + 120, GY - 540 + i * 80); ctx.lineTo(bx, GY - 480 + i * 80); ctx.fill(); } ctx.restore();
    rr(ctx, bx - 30, GY - 470, 40, 420, 18); ctx.fillStyle = "#E07A9B"; ctx.fill(); ol(ctx, 4);
    (R.sleds || []).forEach(sd => { ctx.save(); ctx.translate(sd.x, GY - 20); rr(ctx, -230, -60, 460, 60, 10); ctx.fillStyle = "#5B6470"; ctx.fill(); ol(ctx, 5);
      [[-170], [170]].forEach(([wx]) => { ctx.beginPath(); ctx.arc(wx, 0, 24, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 3); });
      rr(ctx, -150, -360, 70, 300, 24); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 5); rr(ctx, -150, -120, 230, 60, 16); ctx.fill(); ol(ctx, 5);
      if (sd.label){ rr(ctx, -150, 10, 300, 50, 12); ctx.fillStyle = sd.good ? GREEN : RED; ctx.fill(); ol(ctx, 3); textC(ctx, sd.label, 0, 46, 28, "#FFFFFF", 900, 280); }
      ctx.restore(); }); }

  const sfxMap = (fn) => (s, f0, i, add) => { sfxBase(s, f0, i, add); if (fn) fn(s, f0, i, add); };
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
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      (f.stamps || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i) + .05, "chime"));
      (f.flash || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i), "ping"));
      (f.facts || []).forEach((p, n2) => { if (p.cue) add(tOf(s, p, .3 + n2 * .15, i), "pop"); if (p.crackCue) add(cueT(s, p.crackCue, .4, i), "ping"); if (p.fixCue) add(cueT(s, p.fixCue, .5, i) + .2, "chime"); if (p.okCue) add(cueT(s, p.okCue, .5, i), "chime"); });
      (f.ping || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i), "ping"));
      (f.helmets || []).forEach(h => { if (h.clickCue) add(cueT(s, h.clickCue, .4, i), "pop"); if (h.cue) add(tOf(s, h, .3, i), "whoosh"); });
      (f.belts || []).forEach(h => { if (h.clickCue) add(cueT(s, h.clickCue, .4, i), "pop"); if (h.cue) add(tOf(s, h, .3, i), "whoosh"); });
      (f.motor || []).forEach(m => { if (m.brakeCue) add(cueT(s, m.brakeCue, .3, i), "whoosh"); });
      if (f.toa){ if (f.toa.cue) add(tOf(s, f.toa, .2, i), "pop"); (f.toa.blasts || []).forEach((b, n2) => add(cueT(s, b.cue, .3 + n2 * .2, i), b.kind === "praise" ? "chime" : "pop")); }
      if (f.whisper) add(cueT(s, f.whisper.cue, .3, i), "ping");
      if (f.banner){ if (f.banner.dropCue) add(cueT(s, f.banner.dropCue, .3, i), "whoosh"); if (f.banner.markCue) add(cueT(s, f.banner.markCue, .4, i), "pop"); }
      if (f.boxes) (f.boxes.cues || []).forEach((cu, n2) => add(cueT(s, cu, .2 + n2 * .2, i), "pop"));
      if (f.robot && (f.robot.cue || f.robot.at != null)) add(tOf(s, f.robot, .3, i), "whoosh");
      if (f.dice){ add(cueT(s, f.dice.rollCue, .3, i), "whoosh"); if (f.dice.landCue) add(cueT(s, f.dice.landCue, .5, i), "pop"); }
      if (f.cat) add(cueT(s, f.cat.cue, .3, i), "whoosh");
      if (f.door) add(cueT(s, f.door.cue, .3, i), "whoosh");
      if (f.chest && f.chest.openCue) add(cueT(s, f.chest.openCue, .3, i), "chime");
      (f.stash || []).forEach(h => add(cueT(s, h.cue, .3, i), "chime"));
      if (f.panel){ add(cueT(s, f.panel.cue, .3, i), "whoosh"); if (f.panel.badgeCue) add(cueT(s, f.panel.badgeCue, .4, i), "pop"); }
      if (f.bike && f.bike.tagCue) add(cueT(s, f.bike.tagCue, .3, i), "ping");
      if (f.trolley){ ["shelfCue", "labelCue", "listCue", "missCue"].forEach(kk => { if (f.trolley[kk]) add(cueT(s, f.trolley[kk], .3, i), kk === "listCue" ? "chime" : "pop"); }); }
      if (f.chart){ (f.chart.years || []).forEach((y, n2) => add(cueT(s, y.cue, .2 + n2 * .12, i), "pop")); if (f.chart.growCue) add(cueT(s, f.chart.growCue, .3, i), "chime"); }
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  /* ================= generic + set-piece scenes ================= */
  const simple = (name, label, H) => TT.scene(PX + name, label, (ctx, th, s, t) => base(ctx, s, t, typeof H === "function" ? H(s, t) : (H || {})), sfxMap());
  simple("adegan", "Cerita: adegan + efek (set latar, benda, toa, helm, sabuk, kartu fakta, kursi, potong shot)", {});
  simple("spanduk", "Cerita: briefing percetakan, spanduk salah ketik turun, dilingkari merah, wajah merah padam", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("toa", "Cerita: lembur malam + pesan terima kasih mungil, lalu atasan dengan toa raksasa", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("ruang", "Cerita: pujian lewat toa di depan tim, lalu bicara berdua sambil minum teh + daftar cek ejaan", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("ai", "Cerita: laptop malam, panel jawaban AI membesar dengan cap 100% YAKIN, kartu fakta melayang keluar", { env: "home", envOpt: { lampX: 900 } });
  simple("klien", "Cerita: ruang rapat klien, klien mengernyit, kartu fakta retak satu per satu", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("cek", "Cerita: kantor, kartu fakta AI dicocokkan ke dokumen asli: dicentang atau diganti", { env: "office", envOpt: { rug: false } });
  simple("koridor", "Cerita: koridor hotel, pintu 304 terbuka, tamu dengan handuk mungil, keluhan ke-3", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("barisan", "Cerita: dinding barisan tersangka, tiga petugas berbeda pegang papan nama, kilat foto", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("troli", "Cerita: troli kebersihan hotel diperiksa (cuma 3 slot) atau dibenahi (rak ke-4, label, daftar cek)", { env: "office", envOpt: { desk: false, plant: false, rug: false } });
  simple("sarung", "Cerita: kamar, lemari terbuka, uang diselipkan di lipatan sarung, debu, tabungan bercahaya", { env: "home", envOpt: { time: "day" } });
  simple("sepeda", "Cerita: toko sepeda, label harga terus berputar naik, uang kurang", { env: "street", envOpt: { time: "day" } });
  simple("kusen", "Cerita: kusen pintu pengukur tinggi: harga naik tiap tahun, uang diam datar lalu ikut tumbuh", { env: "home", envOpt: { time: "day" } });
  simple("gang", "Cerita: jalan kompleks, motor dengan helm tergantung di spion, tetangga mengingatkan, pin 200 m", { env: "street", envOpt: { time: "day" }, envFront: false });
  simple("kucing", "Cerita: naik motor di jalan taman, kucing melompat, rem mendadak, oleng dekat tiang", { env: "park", envOpt: { bench: false }, envFront: false });
  simple("klik", "Cerita: depan rumah, tali helm dan sabuk pengaman berbunyi KLIK", { env: "street", envOpt: { time: "day" }, envFront: false });

  /* _tempat: two places for two kinds of feedback */
  TT.scene(PX + "tempat", "Cerita: dua tempat (panggung kecil = pujian di depan tim, ruang kecil = koreksi berdua), bintang & catatan dilempar masuk", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Z = Object.assign({ y: 560, starCue: null, noteCue: null }, f.zones || {});
    const ts = T(s, Z.starCue, .3, idx), tn = T(s, Z.noteCue, .3, idx), tLab = Z.labelCue ? T(s, Z.labelCue, .2, idx) : -1;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: (ctx2) => {
        const y0 = Z.y, h = 470;
        // stage (left)
        ctx.save(); rr(ctx, 70, y0, 440, h, 18); ctx.fillStyle = "#2A1A30"; ctx.fill(); ol(ctx, 6); ctx.clip();
        for (let i = 0; i < 8; i++){ const sw = Math.sin(t * 1.3 + i) * 4; ctx.fillStyle = i % 2 ? "#8E2A36" : "#A8343F"; ctx.fillRect(70 + i * 22 + sw, y0, 22, h); ctx.fillRect(510 - (i + 1) * 22 - sw, y0, 22, h); }
        const lit = t >= ts ? 1 : .5; ctx.globalAlpha = .25 * lit; ctx.fillStyle = "#FFF4C8"; ctx.beginPath(); ctx.moveTo(260, y0); ctx.lineTo(320, y0); ctx.lineTo(420, y0 + h - 120); ctx.lineTo(160, y0 + h - 120); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = "#A0643C"; ctx.fillRect(70, y0 + h - 130, 440, 30); ctx.fillStyle = "#6B3A22"; ctx.fillRect(70, y0 + h - 100, 440, 100);
        for (let i = 0; i < 6; i++){ const cx = 105 + i * 72, cl = t >= ts && t - ts < 4 ? Math.abs(Math.sin((t - ts) * 12 + i)) * 14 : 0; ctx.fillStyle = ["#5B7DB1", "#E07A9B", "#7FA563", "#E8A55B", "#2F6F73", "#D9483B"][i];
          ctx.beginPath(); ctx.arc(cx, y0 + h - 30 - cl, 30, 0, TAU); ctx.fill(); ol(ctx, 3); if (cl > 7){ ctx.fillStyle = "#F3D9B5"; ctx.beginPath(); ctx.arc(cx - 20, y0 + h - 70 - cl, 10, 0, TAU); ctx.arc(cx + 20, y0 + h - 70 - cl, 10, 0, TAU); ctx.fill(); } }
        ctx.restore();
        // small room (right)
        ctx.save(); rr(ctx, 570, y0, 440, h, 18); ctx.fillStyle = "#F3E2C8"; ctx.fill(); ol(ctx, 6); ctx.clip();
        ctx.fillStyle = "#C99A6E"; ctx.fillRect(570, y0 + h - 110, 440, 110); glowAt(ctx, 690, y0 + 120, 200, "#FFE3A8", .6); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(690, y0); ctx.lineTo(690, y0 + 70); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(670, y0 + 70); ctx.lineTo(710, y0 + 70); ctx.lineTo(730, y0 + 110); ctx.lineTo(650, y0 + 110); ctx.closePath(); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 3);
        [640, 760].forEach((cx, i) => { rr(ctx, cx - 40, y0 + h - 230, 80, 120, 10); ctx.fillStyle = i ? "#E8A55B" : "#7FA563"; ctx.fill(); ol(ctx, 3); rr(ctx, cx - 46, y0 + h - 120, 92, 24, 6); ctx.fill(); ol(ctx, 3); });
        rr(ctx, 690, y0 + h - 170, 20, 60, 4); ctx.fillStyle = "#8E5A34"; ctx.fill(); ctx.beginPath(); ctx.ellipse(700, y0 + h - 172, 60, 14, 0, 0, TAU); ctx.fill(); ol(ctx, 3);
        const dc = t >= tn + .9 ? eOut(clamp((t - tn - .9) / .4, 0, 1)) : 0, dw = 150 * (.25 + .75 * dc);
        ctx.fillStyle = "#5A3A2A"; ctx.fillRect(840, y0 + 150, 150, 320); ctx.fillStyle = "#A86A3E"; rr(ctx, 840, y0 + 150, dw, 320, 4); ctx.fill(); ol(ctx, 4);
        if (dc >= 1){ heart(ctx, 760, y0 + 80 - Math.sin(t * 3) * 8, 30, "#E07A9B"); }
        ctx.restore(); },
      over: (ctx2, c, sts, R) => {
        const a = c.toScreen(290, Z.y), b = c.toScreen(790, Z.y);
        popChip(ctx, Z.left || "DEPAN TIM", a[0], a[1] - 40, t - tLab, ORANGE, "#FFFFFF", 38, -.04); popChip(ctx, Z.right || "BERDUA", b[0], b[1] - 40, t - tLab - .25, TEAL, "#FFFFFF", 38, .04);
        const thr = (tt0, from, to, draw) => { const k = t - tt0; if (k < 0) return; const q = eOut(clamp(k / .9, 0, 1)); const p0 = c.toScreen(...from), p1 = c.toScreen(...to);
          const x = lerp(p0[0], p1[0], q), y = lerp(p0[1], p1[1], q) - Math.sin(q * Math.PI) * 260; draw(x, y, q, k); };
        const ja = Z.thrower ?? 0, st = sts[ja]; if (!st) return; const hand = handOf(st);
        thr(ts, hand, [290, Z.y + 300], (x, y, q, k) => { if (q < 1){ sparkle(ctx, x, y, 70, GOLD); textC(ctx, "PUJIAN", x, y + 100, 34, "#FFFFFF", 900); } else { sparkle(ctx, x, y - Math.sin(t * 4) * 8, 60 + Math.sin(t * 5) * 6, GOLD); burstFx(ctx, x, y, k - .9, GOLD, 10, 160); } });
        thr(tn, hand, [915, Z.y + 300], (x, y, q, k) => { if (q < 1){ ctx.save(); ctx.translate(x, y); ctx.rotate(q * 6); rr(ctx, -60, -44, 120, 88, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); ctx.fillStyle = RED; rr(ctx, -40, -18, 80, 10, 5); ctx.fill(); rr(ctx, -40, 4, 60, 10, 5); ctx.fill(); ctx.restore(); textC(ctx, "KOREKSI", x, y + 90, 32, "#FFFFFF", 900); } });
      } });
  }, sfxMap((s, f, i, add) => { const Z = f.zones || {}; if (Z.labelCue) add(cueT(s, Z.labelCue, .2, i), "pop"); if (Z.starCue){ add(cueT(s, Z.starCue, .3, i), "whoosh"); add(cueT(s, Z.starCue, .3, i) + .9, "chime"); } if (Z.noteCue){ add(cueT(s, Z.noteCue, .3, i), "whoosh"); add(cueT(s, Z.noteCue, .3, i) + 1.2, "pop"); } }));

  /* _dadu: the AI rolls a die and makes up a name */
  TT.scene(PX + "dadu", "Cerita: maskot AI melempar dadu raksasa, keluar nama karangan, cap HALUSINASI", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, D = f.dice || {}; const tl = D.landCue ? T(s, D.landCue, .5, idx) : 1e9;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 560 },
      over: (ctx2, c, sts, R) => { if (t < tl) return; const k = t - tl, names = D.names || ["Budi?", "Slamet?", "Hartono!"]; const spin = clamp(k / 1.1, 0, 1), ni = spin < 1 ? Math.floor(k * 9) % names.length : names.length - 1;
        const p = c.toScreen(D.x ?? 560, (D.y ?? 1500) - 470); const q = pop(k, .3); ctx.save(); ctx.translate(clamp(p[0], 300, 780), Math.max(330, p[1])); ctx.scale(q, q); ctx.rotate(-.03);
        rr(ctx, -230, -70, 460, 140, 24); ctx.fillStyle = spin < 1 ? "#1B2333" : PAPER; ctx.fill(); ctx.strokeStyle = spin < 1 ? "#7FE0F0" : ORANGE; ctx.lineWidth = 8; ctx.stroke();
        textC(ctx, "Pak " + names[ni].replace(/[?!]/g, ""), 0, 24, 64, spin < 1 ? "#7FE0F0" : BROWN, 900, 420); ctx.restore(); } });
  }, sfxMap());

  /* _peti, _bakso, _uji, _klik etc. that need extra logic */
  TT.scene(PX + "bakso", "Cerita: infografis semangkuk bakso 10.000 -> 10.300, uang yang sama dapat mangkuk lebih kecil", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bw = Object.assign({ x: 560, y: 1180 }, f.bowl || {});
    const tp = T(s, Bw.priceCue, .3, idx), tsh = T(s, Bw.shrinkCue, .3, idx), tb = T(s, Bw.billCue, .3, idx);
    base(ctx, s, t, { env: "info", envOpt: { spotX: Bw.x },
      mid: () => { const sh = t >= tsh ? eOut(clamp((t - tsh) / .7, 0, 1)) : 0, sc = 1 - .22 * sh, x = Bw.x, y = Bw.y;
        ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
        for (let k = 0; k < 4; k++){ const q = (t * .5 + k / 4) % 1; ctx.save(); ctx.globalAlpha *= .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-90 + k * 60, -120 - q * 200); ctx.quadraticCurveTo(-70 + k * 60 + Math.sin(q * 7 + k) * 30, -170 - q * 200, -90 + k * 60, -220 - q * 200); ctx.stroke(); ctx.restore(); }
        ctx.beginPath(); ctx.ellipse(0, -60, 290, 60, 0, 0, TAU); ctx.fillStyle = "#C98A4A"; ctx.fill(); ol(ctx, 6);
        const nBalls = 5, lost = sh > 0 ? 2 : 0; for (let i = 0; i < nBalls; i++){ let bx = -180 + i * 90, by = -76 - (i % 2) * 18; if (i >= nBalls - lost){ const kk = t - tsh - (i - nBalls + lost) * .15; if (kk > 0){ bx += kk * 500; by -= Math.sin(clamp(kk / .8, 0, 1) * Math.PI) * 260 - kk * kk * 600; } if (kk > 1.2) continue; }
          ctx.beginPath(); ctx.arc(bx, by, 46, 0, TAU); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = hexA("#FFFFFF", .35); ctx.beginPath(); ctx.arc(bx - 14, by - 14, 12, 0, TAU); ctx.fill(); }
        ctx.fillStyle = "#7FA563"; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.ellipse(-200 + i * 80, -50, 16, 7, i, 0, TAU); ctx.fill(); }
        ctx.beginPath(); ctx.moveTo(-300, -60); ctx.quadraticCurveTo(-280, 170, 0, 180); ctx.quadraticCurveTo(280, 170, 300, -60); ctx.closePath(); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-250, 10); for (let i = 0; i < 10; i++) ctx.lineTo(-250 + (i + .5) * 50, i % 2 ? 10 : 40); ctx.stroke();
        rr(ctx, -110, 180, 220, 30, 10); ctx.fillStyle = "#E9E2D6"; ctx.fill(); ol(ctx, 4); ctx.restore(); },
      over: (ctx2, c, sts, R) => { const p = c.toScreen(Bw.x, Bw.y - 360); if (t >= tp){ const k = t - tp, tq = Bw.countCue ? T(s, Bw.countCue, .5, idx) : tp + .9, q = clamp((t - tq) / 1.2, 0, 1), v = Math.round(lerp(10000, 10300, easeIO(q)) / 10) * 10, sq = pop(k, .35);
          ctx.save(); ctx.translate(clamp(p[0] + 230, 300, 740), Math.max(300, p[1] - 80)); ctx.rotate(.06 + Math.sin(t * 2) * .02); ctx.scale(sq, sq); rr(ctx, -200, -80, 400, 160, 20); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 6);
          textC(ctx, q < 1 ? (q > 0 ? "TAHUN DEPAN" : "TAHUN INI") : "TAHUN DEPAN", 0, -26, 30, BROWN, 900); textC(ctx, "Rp" + v.toLocaleString("id-ID"), 0, 50, 70, q > 0 ? RED : BROWN, 900, 370);
          if (q > 0 && q < 1){ ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(220, 60); ctx.lineTo(220, -50); ctx.lineTo(196, -26); ctx.moveTo(220, -50); ctx.lineTo(244, -26); ctx.stroke(); } ctx.restore(); }
        if (t >= tb){ const k = t - tb, sq = pop(k, .4); const pb = c.toScreen(Bw.billX ?? 300, Bw.billY ?? 900); ctx.save(); ctx.translate(pb[0], pb[1]); ctx.scale(sq, sq); ctx.rotate(-.1);
          rr(ctx, -160, -80, 320, 160, 14); ctx.fillStyle = "#A8D5B0"; ctx.fill(); ol(ctx, 6); rr(ctx, -140, -62, 280, 124, 8); ctx.strokeStyle = "#2E6B44"; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, "10.000", 0, 26, 64, "#2E6B44", 900);
          if (t >= tsh){ const kk = t - tsh; textC(ctx, "DIAM", 0, -96, 38, "#FFFFFF", 900); ctx.save(); ctx.globalAlpha *= clamp(kk / .4, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(190, -60); ctx.lineTo(190, 70); ctx.lineTo(166, 46); ctx.moveTo(190, 70); ctx.lineTo(214, 46); ctx.stroke(); ctx.restore(); }
          ctx.restore(); } } });
  }, sfxMap((s, f, i, add) => { const B = f.bowl || {}; if (B.priceCue) { add(cueT(s, B.priceCue, .3, i), "pop"); add(cueT(s, B.priceCue, .3, i) + .9, "ping"); } if (B.billCue) add(cueT(s, B.billCue, .3, i), "pop"); if (B.shrinkCue) add(cueT(s, B.shrinkCue, .3, i), "whoosh"); }));

  TT.scene(PX + "uji", "Cerita: kereta uji tabrak, boneka tanpa sabuk terlempar ke depan, boneka bersabuk + helm tetap di kursi", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, U = Object.assign({ wallX: 980 }, f.sled || {});
    const runs = (U.runs || []).map((r, n) => Object.assign({ T: T(s, r.cue, .3 + n * .2, idx) }, r));
    const sledX = (r) => { const k = t - r.T; if (k < 0) return r.x0 ?? 120; const q = clamp(k / (r.dur || 1), 0, 1); return lerp(r.x0 ?? 120, U.wallX - 230, q * q); };
    const hit = (r) => r.T + (r.dur || 1);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 700 },
      mod: (sts) => { runs.forEach((r, n) => { const st = sts[r.on]; if (!st) return; const sx = sledX(r), kh = t - hit(r);
        st.x = sx - 60 + (r.loose && kh > 0 ? Math.min(1, kh / .18) * 150 - Math.max(0, kh - .4) * 40 * (kh < 1.4 ? 1 : 0) : 0) + (!r.loose && kh > 0 && kh < .5 ? Math.sin(kh * 30) * 8 * (1 - kh / .5) : 0);
        if (r.loose && kh > 0 && kh < 1.3) st.y -= Math.sin(clamp(kh / .5, 0, 1) * Math.PI) * 60; }); },
      back: (ctx2, c, sts, R) => { R.sleds = runs.map(r => ({ x: sledX(r), label: t >= hit(r) ? r.label : null, good: !r.loose })); drawSled(ctx, U, R, t); },
      front: (ctx2, c, sts, R) => { runs.forEach(r => { const kh = t - hit(r); if (kh > 0 && kh < .7) burstFx(ctx, U.wallX - 20, GY - 300, kh, r.loose ? RED : GOLD, 10, 220); }); } });
  }, sfxMap((s, f, i, add) => { const U = f.sled || {}; (U.runs || []).forEach((r, n) => { const t0 = cueT(s, r.cue, .3 + n * .2, i); add(t0, "whoosh"); add(t0 + (r.dur || 1), r.loose ? "ping" : "pop"); }); }));

})();
