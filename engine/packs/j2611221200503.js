/* Scene pack j2611221200503: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for KD35, JS35, SC35, MS35, SB36.
   Layout prefix j2611221200503_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots [{at|cue, env, envOpt, toons, cam, props, cards, hold}]   hard cut to a new shot inside one scene (cream flash)
     hold  [{on, kind, at|cue, out|outCue, s, dx, dy, rot}]          object in a toon's hand: doc, phone, bowl, plate, fan, bottle,
                                                                     chips, ticket, wallet, toolbox, loupe, tablet, laptop
     pops  [{at|cue, text, x, y, size, rot, col, hold}]              big outlined pop words (screen)
     keys  [{at|cue, out|outCue, keys:["Ctrl","F"], y, press:[{at|cue}]}]  keyboard keycaps pressed on screen
     shades {on, at|cue}                                             dark sunglasses on a toon       confetti {at|cue}
   Set pieces (layout suffix):
     _adegan    generic story shot with the extras above
     _jerami    office: the 80-page contract is a giant haystack of paper strips; the reader pulls strip after strip and
                tosses them over her shoulder, a glowing needle peeks out, page counter + countdown chips      f.hay
     _pelacak   a detective dog (Ctrl+F) leaps out of the search bar: mode "halaman" = it sniffs along a giant contract page
                and lights up every keyword; mode "papan" = it hops between BROWSER / PDF / DOKUMEN / SHEET boards on Enter   f.dog
     _pusaran   service counter: a living complaint ticket is tossed over the shoulder into a swirling TEKNISI vortex and
                vanishes; the clerk's thought bubble goes blank                                     f.vortex
     _cucian    home: broken washing machine leaks, the dirty-laundry mountain grows per day, hold-music phone call  f.wash
     _kawal     street: the clerk becomes a bodyguard (suit + shades) escorting the walking complaint ticket past
                checkpoint arches; each pass sends a chat to an inset of the waiting customer        f.escort
     _ayam      a golden hen: mode "jual" lays labelled golden eggs on a velvet pedestal (warung); mode "cek" = loupe on the
                leg, no registration band; mode "lepas" = the gold paint flakes off, the plain hen runs away   f.hen
     _telur     a 12-month egg carton: golden +10% eggs drop in, the sum counts to 120%, eggs crack hollow, TIDAK LOGIS  f.tray
     _sekat     dollhouse cut-away: four rooms, each family member alone with a glowing screen; camera visits rooms   f.house
     _serabi    kitchen: clay stove with three serabi moulds; batter poured, sprinkles, the fan makes the fire roar  f.stove
     _kelak     time jump: steam from the serabi plate rises and swallows the screen, "20 TAHUN KEMUDIAN", future kitchen  f.jump
     _tangan    office: an orange autopilot arm sprouts from the toon and fetches snacks from the drawer while he types  f.arm
     _perosotan mode "licin" = playground slide BAD HABIT straight into a snack pit; mode "repot" = the snack box on top of a
                giant pantry shelf in the sky with numbered obstacles                              f.slide
   Camera keys may use on:"<spot>" for named spots of a set piece. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, drawToon, prop, infoCard, titleStamp, layer, outlineWords, G } = TT;
  const TAU = Math.PI * 2, easeIO = TT.easeIO || (q => q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2);
  const PX = "j2611221200503_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", TEAL = "#2F6F73", YEL = "#FFE45C", NAVY = "#13223D", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const pq = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], shrug: [24, -57], facepalm: [7, -71], clap: [12, -47],
    scratch: [21, -76], cheer: [23, -72], hips: [17, -37], think: [9, -62], phone: [17, -43], hold: [21, -47], scared: [20, -60], shock: [24, -64], sad: [8, -29], sit: [14, -26] };
  const lp = (st, lx, ly) => { const k = st.size / 92; return [st.x + lx * k * (st.face || 1), st.y + ly * k]; };
  const handOf = st => { const h = HANDS[st.pose] || HANDS.idle; return lp(st, h[0] + 2, h[1]); };
  const headOf = st => { const h = toonHead(st); return [h[0], h[1] + (st.pose === "sit" ? 13 * st.size / 92 : 0)]; };
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burst(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 180; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 36 - 26 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.05); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 26 * q, 15 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot, maxW){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size, maxW); ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 26); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 100; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); fit(ctx, txt, 760, size, 900, 28); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.fillStyle = col; ctx.beginPath(); [[0, 0, 1], [-.75, .2, .7], [.75, .2, .72], [-.35, -.45, .7], [.4, -.4, .66]].forEach(([dx, dy, rs]) => { ctx.moveTo(x + dx * r + rs * r, y + dy * r); ctx.arc(x + dx * r, y + dy * r, rs * r, 0, TAU); }); ctx.fill(); }

  /* ---------- keyboard keycaps (screen) ---------- */
  function keycap(ctx, label, x, y, w, h, p){
    const d = 16 * p;
    rr(ctx, x - w / 2, y - h / 2 + 16, w, h, 20); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - w / 2, y - h / 2 + d, w, h, 20); ctx.fillStyle = p > .5 ? "#FFD79A" : "#FFF8EE"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - w / 2 + 14, y - h / 2 + d + 10, w - 28, h - 34, 14); ctx.strokeStyle = "rgba(43,26,18,.16)"; ctx.lineWidth = 4; ctx.stroke();
    if (p > .5) glowAt(ctx, x, y + d, w * .9, HL, .25 * p);
    textC(ctx, label, x, y + d + 4, 62, BROWN, 900, w - 40); }
  const pressAmt = (t, P) => { let m = 0; P.forEach(([a, b]) => { const k = t - a, up = b - a; let v = 0; if (k >= 0){ v = k < .07 ? k / .07 : k < up ? 1 : k < up + .1 ? 1 - (k - up) / .1 : 0; } m = Math.max(m, v); }); return m; };
  function keysOv(ctx, s, o, t, idx){
    const T0 = tOf(s, o, .2, idx), O = o.outCue ? T(s, o.outCue, .5, idx) : (o.out ?? T0 + 2.6); if (t < T0 || t > O + .35) return;
    const a = t > O ? 1 - (t - O) / .35 : 1, q = eBack(clamp((t - T0) / .35, 0, 1)), keys = o.keys || ["Ctrl", "F"], y = o.y ?? 560, h = 150;
    font(ctx, 900, 62, FAM); const ws = keys.map(k => Math.max(170, ctx.measureText(k).width + 90)), gap = 96, tot = ws.reduce((p, w) => p + w, 0) + gap * (keys.length - 1);
    const presses = (o.press || [{ at: T0 + .35 }]).map(p => tOf(s, p, .3, idx));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, y); ctx.scale(q, q); ctx.translate(-540, -y);
    let x = 540 - tot / 2;
    keys.forEach((k, i) => { const P = presses.map(p => [p + i * .14, p + (keys.length - 1) * .14 + .38]); const pr = pressAmt(t, P);
      keycap(ctx, k, x + ws[i] / 2, y, ws[i], h, pr);
      presses.forEach(p => { const kk = t - p - i * .14; if (kk > 0 && kk < .4){ ctx.save(); ctx.globalAlpha *= 1 - kk / .4; ctx.strokeStyle = HL; ctx.lineWidth = 6; ctx.lineCap = "round";
        for (let j = 0; j < 6; j++){ const an = -Math.PI / 2 + (j - 2.5) * .45, r0 = 100 + kk * 120; ctx.beginPath(); ctx.moveTo(x + ws[i] / 2 + Math.cos(an) * r0, y + Math.sin(an) * r0 * .8); ctx.lineTo(x + ws[i] / 2 + Math.cos(an) * (r0 + 30), y + Math.sin(an) * (r0 + 30) * .8); ctx.stroke(); } ctx.restore(); } });
      x += ws[i];
      if (i < keys.length - 1){ outlineWords(ctx, [{ w: "+", hl: true }], x + gap / 2, y + 26, 84, { sw: 18, hl: "#FFFFFF" }); x += gap; } });
    ctx.restore(); }

  /* ---------- small objects (world, origin = where they are held) ---------- */
  function snack(ctx, kind, x, y, s, rot){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s || 1, s || 1);
    if (kind === "chips"){ ctx.beginPath(); ctx.moveTo(-46, -60); for (let i = 0; i <= 8; i++) ctx.lineTo(-46 + i * 11.5, -60 + (i % 2 ? -8 : 0)); ctx.lineTo(50, 56); ctx.quadraticCurveTo(0, 66, -50, 56); ctx.closePath();
      ctx.fillStyle = "#E8742A"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = GOLD; ctx.beginPath(); ctx.ellipse(0, 4, 26, 22, .3, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); }
    else if (kind === "choco"){ rr(ctx, -30, -60, 60, 120, 8); ctx.fillStyle = "#6B3A1E"; ctx.fill(); ol(ctx, 4); rr(ctx, -32, -10, 64, 70, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = "#4A2612"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, -36); ctx.lineTo(30, -36); ctx.moveTo(0, -60); ctx.lineTo(0, -10); ctx.stroke(); }
    else if (kind === "candy"){ ctx.fillStyle = "#E85D9A"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 24, 0); ctx.lineTo(d * 52, -22); ctx.lineTo(d * 52, 22); ctx.closePath(); ctx.fill(); ol(ctx, 3); });
      ctx.beginPath(); ctx.ellipse(0, 0, 30, 24, 0, 0, TAU); ctx.fillStyle = "#F7A8C8"; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, -12); ctx.lineTo(10, 14); ctx.stroke(); }
    else if (kind === "wrap"){ ctx.fillStyle = ["#E8742A", RED, "#E85D9A"][Math.floor(Math.abs(x)) % 3]; ctx.beginPath(); ctx.moveTo(-30, -6); ctx.lineTo(-10, -20); ctx.lineTo(22, -12); ctx.lineTo(32, 8); ctx.lineTo(4, 18); ctx.lineTo(-24, 12); ctx.closePath(); ctx.fill(); ol(ctx, 3); }
    ctx.restore(); }
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round";
    if (kind === "doc"){ for (let i = 3; i >= 0; i--){ rr(ctx, -80 + i * 6, -110 - i * 6, 160, 220, 8); ctx.fillStyle = i ? "#EFE6D6" : PAPER; ctx.fill(); ol(ctx, 4); }
      ctx.fillStyle = ORANGE; rr(ctx, -60, -92, 120, 16, 6); ctx.fill(); ctx.fillStyle = "#B9A58E"; for (let i = 0; i < 6; i++){ rr(ctx, -60, -60 + i * 26, 70 + rnd(i) * 50, 10, 5); ctx.fill(); }
      if (o.marks){ ctx.fillStyle = hexA(YEL, .9); [[-60, -34], [-60, 18], [-60, 70]].forEach(([mx, my]) => { rr(ctx, mx - 4, my - 6, 90, 20, 5); ctx.fill(); }); } }
    else if (kind === "phone"){ rr(ctx, -40, -72, 80, 144, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = o.screen || "#BFE2EA"; rr(ctx, -32, -60, 64, 116, 8); ctx.fill();
      glowAt(ctx, 0, -10, 110, "#CFE7EE", .35); }
    else if (kind === "tablet"){ rr(ctx, -80, -58, 160, 116, 12); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#9FD7C0"; rr(ctx, -68, -46, 136, 92, 6); ctx.fill();
      ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(-20 + Math.sin(t * 5) * 30, 0, 12, 0, TAU); ctx.fill(); glowAt(ctx, 0, 0, 140, "#CFE7EE", .3); }
    else if (kind === "laptop"){ ctx.fillStyle = "#544E42"; ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(90, -120); ctx.lineTo(100, 0); ctx.lineTo(-100, 0); ctx.closePath(); ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-76, -108, 152, 96); rr(ctx, -112, 0, 224, 14, 6); ctx.fillStyle = BROWN; ctx.fill(); glowAt(ctx, 0, -60, 160, "#CFE7EE", .3); }
    else if (kind === "bowl"){ ctx.beginPath(); ctx.moveTo(-80, -20); ctx.quadraticCurveTo(-76, 60, 0, 62); ctx.quadraticCurveTo(76, 60, 80, -20); ctx.closePath(); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.ellipse(0, -20, 80, 18, 0, 0, TAU); ctx.fillStyle = "#F3E3C0"; ctx.fill(); ol(ctx, 4);
      const a = t * 7; ctx.strokeStyle = "#9B6A3C"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 34, -22 + Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * 34 + 30, -120); ctx.stroke();
      ctx.strokeStyle = hexA("#C9A66B", .8); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, -20, 40, 8, a, 0, 3); ctx.stroke(); }
    else if (kind === "plate"){ ctx.beginPath(); ctx.ellipse(0, 0, 110, 26, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      const n = o.n ?? 5; for (let i = 0; i < n; i++){ const sx = (i % 3 - 1) * 46, sy = -14 - Math.floor(i / 3) * 22; ctx.beginPath(); ctx.ellipse(sx, sy, 40, 16, 0, 0, TAU); ctx.fillStyle = "#E7B66A"; ctx.fill(); ol(ctx, 3);
        ctx.fillStyle = "#6B3A1E"; for (let j = 0; j < 4; j++){ ctx.fillRect(sx - 20 + j * 11, sy - 6 + (j % 2) * 5, 6, 3); } } }
    else if (kind === "fan"){ ctx.rotate(Math.sin(t * 16) * .45); ctx.strokeStyle = "#9B6A3C"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -70); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(-70, -170); ctx.quadraticCurveTo(0, -200, 70, -170); ctx.closePath(); ctx.fillStyle = "#E3C27A"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = "rgba(122,74,46,.5)"; ctx.lineWidth = 3; for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.moveTo(0, -62); ctx.lineTo(i * 30, -180); ctx.stroke(); } }
    else if (kind === "bottle"){ rr(ctx, -30, -100, 60, 150, 16); ctx.fillStyle = hexA("#9FD3E8", .85); ctx.fill(); ol(ctx, 4); rr(ctx, -16, -128, 32, 30, 6); ctx.fillStyle = "#2F6F73"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = "rgba(255,255,255,.6)"; rr(ctx, -20, -86, 10, 110, 5); ctx.fill(); }
    else if (kind === "chips"){ snack(ctx, "chips", 0, -20, 1); }
    else if (kind === "ticket"){ drawTicket(ctx, 0, 0, .7, t, { legs: false }); }
    else if (kind === "wallet"){ rr(ctx, -70, -46, 140, 92, 14); ctx.fillStyle = "#7A4A2E"; ctx.fill(); ol(ctx, 5); rr(ctx, 10, -20, 60, 40, 10); ctx.fillStyle = "#5A321C"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(46, 0, 9, 0, TAU); ctx.fill(); }
    else if (kind === "toolbox"){ rr(ctx, -80, -50, 160, 90, 10); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-34, -50); ctx.lineTo(-34, -80); ctx.lineTo(34, -80); ctx.lineTo(34, -50); ctx.stroke();
      ctx.fillStyle = "#9AA6B2"; rr(ctx, -12, -18, 24, 16, 4); ctx.fill(); }
    else if (kind === "loupe"){ ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-50, 60); ctx.stroke();
      ctx.beginPath(); ctx.arc(30, -36, 44, 0, TAU); ctx.fillStyle = "rgba(200,235,245,.55)"; ctx.fill(); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 12; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.restore(); }

  /* living complaint ticket */
  function drawTicket(ctx, x, y, s, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    const walk = o.walk ? 1 : 0, ph = t * 12, by = o.legs === false ? 0 : -120 - walk * Math.abs(Math.sin(ph)) * 10;
    if (o.legs !== false){ [-1, 1].forEach(d => { const sw = walk ? Math.sin(ph + (d > 0 ? 0 : Math.PI)) * 22 : 0; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(d * 28, by + 70); ctx.lineTo(d * 28 + sw, -8); ctx.stroke(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(d * 28 + sw + 10, -6, 18, 9, 0, 0, TAU); ctx.fill(); }); }
    ctx.save(); ctx.translate(0, by); ctx.rotate(Math.sin(t * 3) * .04);
    rr(ctx, -90, -100, 180, 180, 12); ctx.fillStyle = o.done ? "#DFF3E2" : PAPER; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = o.done ? GREEN : RED; rr(ctx, -90, -100, 180, 40, 12); ctx.fill(); ctx.fillRect(-90, -72, 180, 12);
    textC(ctx, o.tag || "KELUHAN", 0, -68, 24, "#FFFFFF", 900, 160);
    textC(ctx, o.l1 || "MESIN CUCI", 0, 34, 22, BROWN, 900, 160); textC(ctx, o.l2 || "BOCOR", 0, 60, 22, BROWN, 900, 160);
    // face
    ctx.fillStyle = OUT; const blink = (t * .7 % 3) < .12 ? .2 : 1; [-30, 30].forEach(d => { ctx.beginPath(); ctx.ellipse(d, -26, 8, 10 * blink, 0, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); if (o.done || o.happy) ctx.arc(0, -8, 18, .15 * Math.PI, .85 * Math.PI); else { ctx.moveTo(-16, 2); ctx.quadraticCurveTo(0, -10, 16, 2); } ctx.stroke();
    if (o.done){ ctx.save(); ctx.translate(70, -96); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-3, 10); ctx.lineTo(14, -10); ctx.stroke(); ctx.restore(); }
    ctx.restore(); ctx.restore(); }

  /* detective dog */
  function drawDog(ctx, x, y, s, face, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s);
    const run = o.run ? 1 : 0, ph = t * 16, sit = o.sit ? 1 : 0, lift = o.lift || 0;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 4, 95 * (1 - Math.min(.5, lift / 400)), 14, 0, 0, TAU); ctx.fill();
    ctx.translate(0, -lift);
    const by = -118 + sit * 18 - run * Math.abs(Math.sin(ph)) * 12;
    const legs = [[-58, 0], [-34, Math.PI], [40, Math.PI * .5], [64, Math.PI * 1.5]];
    legs.forEach(([lx, off], i) => { let sw = run ? Math.sin(ph + off) * .55 : 0; if (sit && i < 2) sw = -1.1; ctx.save(); ctx.translate(lx, by + 26); ctx.rotate(sw);
      rr(ctx, -12, 0, 24, sit && i < 2 ? 60 : 92 - (by + 118) * .0, 10); ctx.fillStyle = i % 2 ? "#B57A40" : "#C98B4E"; ctx.fill(); ol(ctx, 5); ctx.restore(); });
    const wag = Math.sin(t * (o.bark ? 26 : 16)) * .6; ctx.save(); ctx.translate(-82, by - 14); ctx.rotate(-.8 + wag); ctx.strokeStyle = OUT; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-10, -40, 6, -70); ctx.stroke();
    ctx.strokeStyle = "#C98B4E"; ctx.lineWidth = 15; ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(0, by); ctx.rotate(sit ? -.28 : 0); ctx.beginPath(); ctx.ellipse(0, 0, 92, 46, 0, 0, TAU); ctx.fillStyle = "#C98B4E"; ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = "#8E5A2E"; ctx.beginPath(); ctx.ellipse(-24, -14, 34, 20, -.2, 0, TAU); ctx.fill(); ctx.restore();
    const sn = o.sniff ? Math.sin(t * 30) * 3 : 0, hx = 74, hy = by - 58 - sit * 22 + (o.sniff ? 26 : 0);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(o.sniff ? .35 : 0);
    ctx.fillStyle = "#B91C1C"; rr(ctx, -40, 30, 70, 16, 8); ctx.fill(); ol(ctx, 3);
    ctx.beginPath(); ctx.arc(-2, 58, 17, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 3); ctx.save(); ctx.translate(-2, 64); ctx.scale(face, 1); textC(ctx, "F", 0, 0, 22, BROWN, 900); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = "#C98B4E"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.ellipse(46 + sn, 14, 34, 25, .1, 0, TAU); ctx.fillStyle = "#E7C08F"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.ellipse(76 + sn, 4, 13, 10, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    if (o.bark && Math.sin(t * 22) > 0){ ctx.beginPath(); ctx.ellipse(56, 34, 16, 12, 0, 0, TAU); ctx.fillStyle = "#7A1F1F"; ctx.fill(); ctx.fillStyle = "#F28C9A"; ctx.beginPath(); ctx.ellipse(56, 42, 9, 6, 0, 0, TAU); ctx.fill(); }
    else { ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(52, 24, 12, .2, 2.6); ctx.stroke(); if (o.happy){ ctx.fillStyle = "#F28C9A"; rr(ctx, 44, 30, 16, 26, 8); ctx.fill(); } }
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(18, -12, 8, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(21, -15, 3, 0, TAU); ctx.fill();
    const ear = Math.sin(t * 9) * .15 + (run ? .3 : 0); ctx.save(); ctx.translate(-22, -30); ctx.rotate(.5 + ear); ctx.beginPath(); ctx.ellipse(0, 34, 18, 40, 0, 0, TAU); ctx.fillStyle = "#7A4526"; ctx.fill(); ol(ctx, 5); ctx.restore();
    // deerstalker hat
    ctx.beginPath(); ctx.ellipse(-4, -40, 52, 26, -.1, Math.PI, 0); ctx.fillStyle = "#8B6B4A"; ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = 3; for (let i = -2; i <= 2; i++){ ctx.beginPath(); ctx.moveTo(-4 + i * 16, -64); ctx.lineTo(-4 + i * 16, -40); ctx.stroke(); }
    rr(ctx, -60, -46, 112, 12, 6); ctx.fillStyle = "#6E5238"; ctx.fill(); ol(ctx, 3);
    ctx.restore(); ctx.restore(); }

  /* hen (gold 0..1) */
  function drawHen(ctx, x, y, s, face, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * face, s);
    const g = clamp(o.gold ?? 1, 0, 1), run = o.run ? 1 : 0, ph = t * 18, sq = o.squat || 0;
    const body = g > .02 ? null : "#F4EEE2";
    const fillB = (x0, y0, r) => { if (body) return body; const gr = ctx.createRadialGradient(x0 - r * .3, y0 - r * .4, r * .1, x0, y0, r); gr.addColorStop(0, "#FFF1B0"); gr.addColorStop(.5, GOLD); gr.addColorStop(1, "#B8860B"); return g >= 1 ? gr : gr; };
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, 90, 14, 0, 0, TAU); ctx.fill();
    [-1, 1].forEach(d => { const sw = run ? Math.sin(ph + (d > 0 ? 0 : Math.PI)) * 24 : 0; ctx.strokeStyle = "#E8902A"; ctx.lineWidth = 9; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(d * 20, -50 + sq * 20); ctx.lineTo(d * 20 + sw, 0); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(d * 20 + sw - 14, 2); ctx.lineTo(d * 20 + sw + 18, 2); ctx.stroke();
      if (o.band && d > 0){ ctx.fillStyle = GREEN; rr(ctx, d * 20 + sw - 10, -30, 20, 12, 4); ctx.fill(); } });
    const bob = run ? Math.abs(Math.sin(ph)) * -10 : Math.sin(t * 3) * 2;
    ctx.translate(0, bob + sq * 24);
    const col = (r, y0) => { if (g <= .02) return "#F4EEE2"; const gr = ctx.createRadialGradient(-30, y0 - r * .5, 10, 0, y0, r * 1.2); gr.addColorStop(0, "#FFF4C0"); gr.addColorStop(.45, GOLD); gr.addColorStop(1, "#B8860B"); return gr; };
    // tail
    [[-.9, "#000"], [-.6, "#000"], [-.3, "#000"]].forEach(([a], i) => { ctx.save(); ctx.translate(-80, -140); ctx.rotate(a - .3 + Math.sin(t * 4 + i) * .06); ctx.beginPath(); ctx.ellipse(0, -40, 22, 52, 0, 0, TAU);
      ctx.fillStyle = g > .02 ? (i % 2 ? "#E0A72A" : GOLD) : (i % 2 ? "#DAD2C4" : "#ECE5D8"); ctx.fill(); ol(ctx, 5); ctx.restore(); });
    ctx.beginPath(); ctx.ellipse(0, -118, 100, 78, 0, 0, TAU); ctx.fillStyle = col(100, -118); ctx.fill(); ol(ctx, 6);
    if (g > .02 && g < 1){ ctx.save(); ctx.beginPath(); ctx.ellipse(0, -118, 100, 78, 0, 0, TAU); ctx.clip(); ctx.fillStyle = "#F4EEE2"; for (let i = 0; i < 14; i++){ if (rnd(i + 3) > g){ ctx.beginPath(); ctx.arc(-90 + rnd(i) * 180, -190 + rnd(i + 7) * 150, 26 + rnd(i + 1) * 20, 0, TAU); ctx.fill(); } } ctx.restore(); ctx.beginPath(); ctx.ellipse(0, -118, 100, 78, 0, 0, TAU); ol(ctx, 6); }
    const flap = o.flap ? Math.sin(t * 30) * .6 : Math.sin(t * 2) * .05; ctx.save(); ctx.translate(-10, -130); ctx.rotate(-.2 - flap); ctx.beginPath(); ctx.ellipse(0, 20, 54, 34, .2, 0, TAU);
    ctx.fillStyle = g > .02 ? "#E3A21F" : "#E2DACB"; ctx.fill(); ol(ctx, 5); ctx.restore();
    const peck = o.peck ? Math.max(0, Math.sin(t * 9)) * 30 : 0;
    ctx.save(); ctx.translate(72, -196 + peck); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = col(44, 0); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = RED; [[-14, -44, 14], [4, -50, 16], [22, -42, 13]].forEach(([cx, cy, r]) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ol(ctx, 3); });
    ctx.beginPath(); ctx.ellipse(38, 24, 10, 16, 0, 0, TAU); ctx.fill(); ol(ctx, 3);
    ctx.beginPath(); ctx.moveTo(38, -10); ctx.lineTo(74, 2); ctx.lineTo(38, 12); ctx.closePath(); ctx.fillStyle = "#E8902A"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(18, -10, 7, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(20, -12, 2.5, 0, TAU); ctx.fill();
    if (o.angry){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(4, -26); ctx.lineTo(30, -18); ctx.stroke(); }
    ctx.restore();
    if (g > .5) for (let i = 0; i < 5; i++){ const a = t * 1.3 + i * 1.3, r = 120 + 20 * Math.sin(t * 2 + i); const q = (Math.sin(t * 4 + i * 2) + 1) / 2; sparkle(ctx, Math.cos(a) * r, -130 + Math.sin(a) * r * .8, 8 + q * 12, i % 2 ? "#FFFFFF" : GOLD); }
    ctx.restore(); }
  function drawEgg(ctx, x, y, s, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
    const cr = o.crack || 0;
    if (cr < .5){ ctx.beginPath(); ctx.ellipse(0, -40, 32, 42, 0, 0, TAU); const gr = ctx.createRadialGradient(-10, -60, 4, 0, -40, 50); gr.addColorStop(0, "#FFF6C8"); gr.addColorStop(.5, GOLD); gr.addColorStop(1, "#B8860B");
      ctx.fillStyle = o.plain ? "#F6EBD9" : gr; ctx.fill(); ol(ctx, 5);
      if (cr > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-30, -40); ctx.lineTo(-14, -50); ctx.lineTo(-2, -36); ctx.lineTo(12, -52); ctx.lineTo(30, -40); ctx.stroke(); } }
    else { const sp = (cr - .5) * 2; [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * sp * 30, -sp * 20); ctx.rotate(d * sp * .6); ctx.beginPath(); ctx.ellipse(0, -40, 32, 42, 0, d < 0 ? Math.PI * .5 : -Math.PI * .5, d < 0 ? Math.PI * 1.5 : Math.PI * .5);
        ctx.closePath(); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4); ctx.restore(); });
      ctx.save(); ctx.globalAlpha *= clamp(sp * 2, 0, 1); ctx.fillStyle = "rgba(255,255,255,.6)"; puffC(ctx, 0, -50 - sp * 40, 20 + sp * 10, "rgba(230,230,230,.7)"); ctx.restore(); }
    ctx.restore(); }

  /* rolling chair */
  function chairAt(ctx, x, y, sz, face, tilt){ const k = sz / 92, sy = y - 11 * k; ctx.save(); ctx.translate(x, y); ctx.rotate(tilt || 0); ctx.translate(-x, -y);
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 2.4 * k; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 15 * k, y - 2.5 * k); ctx.lineTo(x + 15 * k, y - 2.5 * k); ctx.moveTo(x, y - 2.5 * k); ctx.lineTo(x, sy + 2 * k); ctx.stroke();
    [-15, 0, 15].forEach(d => { ctx.beginPath(); ctx.arc(x + d * k, y - 1.6 * k, 1.8 * k, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); });
    rr(ctx, x - face * 14 * k - 2.5 * k, sy - 30 * k, 5 * k, 28 * k, 2.5 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k);
    rr(ctx, x - 14 * k - face * 2 * k, sy - 2 * k, 28 * k, 5 * k, 2.4 * k); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, .7 * k); ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach(sh => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f0, T0: shotT } = shotOf(s, t), f = H.F ? H.F(f0, t) : f0, toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    if (H.adjust && f.piece !== false) H.adjust(sts, f, t);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on](tt) : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = toonState(toons[j], s, tt); if (H.adjust && f.piece !== false){ const arr = toons.map((a, q) => q === j ? st : toonState(a, s, tt)); H.adjust(arr, f, tt); }
      const hp = headOf(st), z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({ desk: false }, H.envOpt || {}, f.envOpt || {});
    env(ctx, E, t, c, eo);
    const R = { c, f, shotT, E };
    const piece = f.piece !== false;
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map(h => Object.assign({ T0: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (a.chair) layer(ctx, c, 1, () => chairAt(ctx, a.chairX ?? st.x - (st.face || 1) * 4 * st.size / 92, st.y, st.size, st.face || 1, st.chairTilt || 0));
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      holds.filter(h => (h.on ?? 0) === j && t >= h.T0 && t < h.O).forEach(h => layer(ctx, c, 1, () => { const p = handOf(st), q = h.T0 < 0 ? 1 : eBack(clamp((t - h.T0) / .3, 0, 1));
        drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0), t, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), marks: h.marks, n: h.n, screen: h.screen }); }));
      const sh = f.shades; if (sh && (sh.on ?? 0) === j && t >= tOf(s, sh, .3, idx)) layer(ctx, c, 1, () => shades(ctx, st, t - tOf(s, sh, .3, idx)));
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    (f.dogs || []).forEach((d, n) => { const T0 = d.cue || d.at != null ? tOf(s, d, .3, idx) : -1; if (t < T0) return; items.push({ z: d.z ?? .2, j: 50 + n, draw: () => layer(ctx, c, 1, () => {
      const k = t - T0, enter = T0 < 0 ? 1 : eOut(clamp(k / .6, 0, 1)), x = lerp(d.fromX ?? d.x, d.x, enter), bark = (d.bark || []).some(b => { const tb = tOf(s, b, .3, idx); return t > tb && t < tb + .9; });
      drawDog(ctx, x, d.y ?? GY, d.s || .8, d.face || 1, t, { run: enter < 1, sit: enter >= 1 && d.sit, bark, happy: true, lift: enter < 1 ? Math.abs(Math.sin(k * 9)) * 20 : 0 }); }) }); });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.keys || []).forEach(o => ovs.push(() => keysOv(ctx, s, o, t, idx)));
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (H.shotFx) ovs.push(() => { ctx.save(); H.shotFx(ctx, R); ctx.restore(); });
    else if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f };
  }
  function shades(ctx, st, k){ const hp = headOf(st), u = st.size / 92, f = st.face || 1, q = eBack(clamp(k / .3, 0, 1)), dy = (1 - q) * -60 * u;
    ctx.save(); ctx.translate(hp[0] + 3 * u * f, hp[1] - 1 * u + dy); ctx.globalAlpha *= clamp(k / .15, 0, 1);
    ctx.fillStyle = "#14141A"; [-7, 7].forEach(d => { rr(ctx, d * u - 6 * u, -3.4 * u, 12 * u, 7.5 * u, 3 * u); ctx.fill(); });
    ctx.strokeStyle = "#14141A"; ctx.lineWidth = 1.6 * u; ctx.beginPath(); ctx.moveTo(-1.5 * u, -1.5 * u); ctx.lineTo(1.5 * u, -1.5 * u); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.55)"; [-7, 7].forEach(d => { ctx.beginPath(); ctx.moveTo(d * u - 3 * u, -2.5 * u); ctx.lineTo(d * u - 1 * u, -2.5 * u); ctx.lineTo(d * u - 4 * u, 3 * u); ctx.lineTo(d * u - 5 * u, 3 * u); ctx.closePath(); ctx.fill(); });
    if (k < .6){ sparkle(ctx, 7 * u, -4 * u, (1 - k / .6) * 6 * u, "#FFFFFF"); }
    ctx.restore(); }
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
    (f0.keys || []).forEach(o => { const T0 = tOf(s, o, .2, i); add(T0, "pop"); (o.press || [{ at: T0 + .35 }]).forEach(p => add(tOf(s, p, .3, i), "ping")); });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.shades) add(tOf(s, f0.shades, .3, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }

  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, tombol keyboard, kata pop, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= KD35: jerami (haystack of contract strips) ================= */
  const WORDS = ["PASAL", "PIHAK", "AYAT", "BAB", "KETENTUAN", "JANGKA", "SYARAT", "HAK", "KEWAJIBAN", "LAMPIRAN", "WAKTU", "BIAYA"];
  function strip(ctx, x, y, w, i, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(ctx, -w / 2, -24, w, 48, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
    font(ctx, 800, 22, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "left"; ctx.fillText(WORDS[i % WORDS.length], -w / 2 + 14, 8);
    ctx.fillStyle = "#C9B9A2"; const x0 = -w / 2 + 24 + ctx.measureText(WORDS[i % WORDS.length]).width; for (let k = 0; k < 3; k++){ const ww = 26 + rnd(i * 3 + k) * 36; if (x0 + k * 62 + ww < w / 2 - 10){ rr(ctx, x0 + k * 62, -4, ww, 10, 5); ctx.fill(); } }
    ctx.restore(); }
  function hay(ctx, x, t, shake, shrink){ const W2 = 360 * (1 - shrink * .12), H2 = 560 * (1 - shrink * .15); ctx.save(); ctx.translate(x + Math.sin(t * 30) * shake * 6, GY);
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 6, W2 + 40, 34, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-W2 - 30, 0); ctx.bezierCurveTo(-W2, -H2 * .7, -W2 * .45, -H2, 0, -H2); ctx.bezierCurveTo(W2 * .45, -H2, W2, -H2 * .7, W2 + 30, 0); ctx.closePath();
    const g = ctx.createLinearGradient(0, -H2, 0, 0); g.addColorStop(0, "#FFF1CF"); g.addColorStop(1, "#E3CFA8"); ctx.fillStyle = g; ctx.fill(); ol(ctx, 7);
    ctx.save(); ctx.clip();
    for (let i = 0; i < 70; i++){ const px = (rnd(i) - .5) * W2 * 2, py = -rnd(i + 5) * H2 * .95, a = (rnd(i + 9) - .5) * 1.6 + Math.sin(t * 2 + i) * .05;
      ctx.save(); ctx.translate(px, py); ctx.rotate(a); rr(ctx, -70, -9, 140, 18, 5); ctx.fillStyle = i % 4 ? "#FFFDF6" : "#F3E6CF"; ctx.fill(); ctx.strokeStyle = "rgba(43,26,18,.45)"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "#CDBEA9"; rr(ctx, -56, -3, 50 + rnd(i) * 40, 6, 3); ctx.fill(); ctx.restore(); }
    ctx.restore();
    // the needle peeking out
    const nx = W2 * .35, ny = -H2 * .42, gl = .5 + .5 * Math.sin(t * 5); glowAt(ctx, nx, ny, 70, YEL, .35 * gl); ctx.save(); ctx.translate(nx, ny); ctx.rotate(-.6); ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(-24, 0, 6, 3, 0, 0, TAU); ctx.stroke(); ctx.restore(); sparkle(ctx, nx + 10, ny - 16, 10 * gl, "#FFFFFF");
    ctx.restore(); }
  TT.scene(PX + "jerami", "Cerita: kontrak jadi tumpukan jerami kertas, mencari jarum DENDA", (ctx, th, s, t) => {
    const f = s.f || {}, Hy = Object.assign({ x: 760 }, f.hay || {}), idx = G.scene, dig = Hy.dig ?? 0;
    const tS = T(s, Hy.startCue, .4, idx), tEnd = (s.dur || 12) - .1, rate = Hy.rate || .55;
    const nPull = t < tS ? 0 : Math.floor((t - tS) / rate) + 1;
    const H = {
      spots: { hay: [Hy.x, GY - 420], needle: [Hy.x + 120, GY - 260] },
      back: (ctx2) => { // discarded strips pile on the floor behind the reader
        for (let i = 0; i < nPull - 1; i++){ const px = (Hy.pileX ?? 170) + ((i * 37) % 260) - 130 + Math.sin(i) * 20, py = GY - 14 - Math.floor(i / 6) * 16; strip(ctx2, px, py, 170, i + 2, Math.sin(i * 2.3) * .5); } },
      mid: (ctx2) => { hay(ctx2, Hy.x, t, nPull ? .3 + .3 * Math.sin(t * 6) : 0, ramp(t, tS, tEnd) * .5); },
      midZ: -1,
      front: (ctx2, c, sts) => { const st = sts[dig]; if (!st || t < tS) return; const p = handOf(st);
        for (let i = Math.max(0, nPull - 3); i < nPull; i++){ const t0 = tS + i * rate, k = t - t0; if (k < 0 || k > 1.3) continue;
          if (k < .45){ const q = k / .45; strip(ctx2, lerp(Hy.x - 200, p[0] + 40, q), lerp(GY - 300, p[1] - 60, q) - Math.sin(q * Math.PI) * 60, 220, i, q * .3); }
          else { const q = (k - .45) / .85, x = lerp(p[0] + 40, (Hy.pileX ?? 170) + ((i * 37) % 260) - 130, q), y = lerp(p[1] - 60, GY - 20, q) - Math.sin(q * Math.PI) * 260; strip(ctx2, x, y, 200, i, q * 6); } } },
      over: (ctx2) => {
        if (Hy.pages){ const P = Hy.pages, t0 = tOf(s, P, .2, idx); if (t >= t0){ const n = Math.round(lerp(P.from || 1, P.to || 12, ramp(t, t0, tEnd)));
          popChip(ctx2, "HAL. " + n + " / " + (P.of || 80), 250, 300, t - t0, PAPER, BROWN, 40, -.04); } }
        if (Hy.clock){ const C = Hy.clock, t0 = tOf(s, C, .1, idx); if (t >= t0){ const m = Math.round(lerp(C.from || 10, C.to || 5, ramp(t, t0 + .5, tEnd))), warn = m <= (C.to || 5) + 1;
          ctx2.save(); if (warn) ctx2.translate(Math.sin(t * 40) * 4, 0); popChip(ctx2, "⏱ " + m + " MENIT", 800, 300, t - t0, warn ? RED : NAVY, "#FFFFFF", 40, .04); ctx2.restore(); } }
        (Hy.words || []).forEach((w, j) => { const t0 = tOf(s, w, .3, idx); popWord(ctx2, w.text, w.x ?? 540, w.y ?? 520, t - t0, { size: w.size || 84, hold: w.hold || 1.4, rot: w.rot ?? -6 }); });
      },
      envFront: false
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Hy = f.hay || {}; const tS = T(s, Hy.startCue, .4, i), rate = Hy.rate || .55; for (let k = 0; k < 14; k++) add(tS + k * rate * 2, "whoosh"); (Hy.words || []).forEach(w => add(tOf(s, w, .3, i), "pop")); });

  /* ================= KD35: pelacak (search dog) ================= */
  function page(ctx, x0, y0, w, h, t, rows, found, o){
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,.25)"; rr(ctx, x0 + 18, y0 + 22, w, h, 16); ctx.fill();
    rr(ctx, x0, y0, w, h, 16); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 7);
    if (o.title){ textC(ctx, o.title, x0 + w / 2, y0 + 64, 40, BROWN, 900, w - 80); ctx.fillStyle = ORANGE; ctx.fillRect(x0 + 60, y0 + 84, w - 120, 6); }
    rows.forEach((r, i) => { const y = y0 + (o.title ? 130 : 60) + i * o.lh; let x = x0 + 50;
      r.forEach((wd, j) => { const isKey = wd === o.key, ww = isKey ? 120 : wd; if (isKey){ const fi = found.find(F => F.r === i); const g = fi ? fi.q : 0;
          if (g > 0){ ctx.save(); const sc = 1 + .25 * Math.sin(Math.min(1, g) * Math.PI) ; ctx.translate(x + ww / 2, y); ctx.scale(sc, sc); rr(ctx, -ww / 2 - 8, -26, ww + 16, 44, 8); ctx.fillStyle = YEL; ctx.fill(); ol(ctx, 4); ctx.restore(); glowAt(ctx, x + ww / 2, y, 120, YEL, .35 * Math.min(1, g)); }
          font(ctx, 900, 30, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(o.keyText || "denda", x + ww / 2, y + 10); ctx.textAlign = "left"; }
        else { ctx.fillStyle = "#CDBEA9"; rr(ctx, x, y - 8, ww, 16, 8); ctx.fill(); }
        x += ww + 18; }); });
    ctx.restore(); }
  function searchBar(ctx, x, y, w, txt, k, cnt){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(1, q);
    rr(ctx, -w / 2, -42, w, 84, 42); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
    ctx.strokeStyle = BROWN; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-w / 2 + 52, -4, 16, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2 + 64, 8); ctx.lineTo(-w / 2 + 78, 22); ctx.stroke();
    font(ctx, 800, 38, FAM); ctx.fillStyle = BROWN; ctx.fillText(txt, -w / 2 + 100, 13); const tw = ctx.measureText(txt).width;
    if (Math.sin(k * 10) > 0) ctx.fillRect(-w / 2 + 104 + tw, -18, 4, 40);
    if (cnt){ font(ctx, 800, 30, FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "right"; ctx.fillText(cnt, w / 2 - 34, 11); ctx.textAlign = "left"; }
    ctx.restore(); }
  const dogPath = (pts, t) => { // pts [{t, x, y, hop}] -> {x, y, run, lift, face}
    if (!pts.length) return null; if (t <= pts[0].t) return { x: pts[0].x, y: pts[0].y, run: false, lift: 0, face: pts[0].face || 1 };
    for (let i = 1; i < pts.length; i++){ const a = pts[i - 1], b = pts[i]; if (t < b.t){ const q = (t - a.t) / (b.t - a.t), e = b.hop ? q : easeIO(q);
        return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), run: true, lift: (b.hop || 0) * 4 * q * (1 - q), face: Math.sign(b.x - a.x) || a.face || 1 }; } }
    const L = pts[pts.length - 1]; return { x: L.x, y: L.y, run: false, lift: 0, face: L.face || 1 }; };
  TT.scene(PX + "pelacak", "Cerita: anjing pelacak Ctrl+F (halaman kontrak / papan aplikasi)", (ctx, th, s, t) => {
    const f = s.f || {}, D = Object.assign({ mode: "halaman" }, f.dog || {}), idx = G.scene;
    if (D.mode === "halaman"){
      const px = D.x ?? 420, py = D.y ?? 300, pw = D.w ?? 620, lh = 74;
      const rows = []; for (let i = 0; i < 12; i++){ const r = []; let used = 0; while (used < pw - 200){ const w = 50 + Math.floor(rnd(i * 9 + r.length) * 110); r.push(w); used += w + 18; } rows.push(r); }
      const keyRows = D.keyRows || [2, 6, 10]; keyRows.forEach((ri, n) => { rows[ri].splice(1 + (n % 2), 1, "K"); });
      const tBar = T(s, D.barCue, .2, idx), tType = T(s, D.typeCue, .3, idx), tDog = T(s, D.dogCue, .3, idx), tGlow = T(s, D.glowCue, .2, idx);
      const keyPos = keyRows.map((ri, n) => { let x = px + 50; for (let j = 0; j < 1 + (n % 2); j++) x += rows[ri][j] + 18; return [x + 60, py + 60 + ri * lh]; });
      const hitT = keyPos.map((_, n) => tDog + .6 + n * Math.max(.45, (tGlow + .6 - tDog - .6) / keyPos.length));
      const pts = [{ t: tDog, x: px + 120, y: py - 10, face: 1 }]; keyPos.forEach((p, n) => pts.push({ t: hitT[n], x: p[0] - 60, y: p[1] + 30, hop: 120 }));
      pts.push({ t: hitT[hitT.length - 1] + .7, x: px + pw - 90, y: py + 60 + 12 * lh + 40, hop: 160 });
      const found = keyRows.map((ri, n) => ({ r: ri, q: t > hitT[n] ? Math.min(2, (t - hitT[n]) / .45) : 0 }));
      const typed = (D.keyText || "denda").slice(0, Math.max(0, Math.min(5, Math.floor((t - tType) / .12))));
      const nF = found.filter(F => F.q > 0).length;
      const H = {
        spots: { page: [px + pw / 2, py + 450], dog: tt => { const d = dogPath(pts, tt); return d ? [d.x, d.y - 120] : [px, py]; } },
        mid: (ctx2) => { page(ctx2, px, py, pw, 12 * lh + 110, t, rows, found, { key: "K", lh, keyText: D.keyText });
          if (t >= tBar) searchBar(ctx2, px + pw / 2, py - 40, pw - 40, typed, t - tBar, t > tType + .7 ? (nF || (t > tDog ? 0 : 3)) + "/3" : "");
          found.forEach((F, n) => burst(ctx2, keyPos[n][0], keyPos[n][1], t - hitT[n], YEL, 12, 130));
          if (t >= tDog - .05){ const d = dogPath(pts, t), poofK = t - tDog; if (poofK < .5){ ctx2.save(); ctx2.globalAlpha *= 1 - poofK / .5; puffC(ctx2, px + 120, py - 40, 60 + poofK * 120, "rgba(255,255,255,.9)"); ctx2.restore(); }
            const near = hitT.some(h => t > h - .1 && t < h + .5), done = t > pts[pts.length - 1].t;
            drawDog(ctx2, d.x, d.y, .9, d.face, t, { run: d.run, lift: d.lift, sniff: !d.run && !done, bark: near || (done && t < pts[pts.length - 1].t + 1.2), happy: done }); } },
        midZ: 1,
        over: () => { hitT.forEach((h, n) => { if (t > h && t < h + 1.0){ const d = dogPath(pts, h); const p = R0c.toScreen(d.x + 60, d.y - 230, 1); popWord(ctx, "GUK!", clamp(p[0], 200, 880), clamp(p[1], 260, 1200), t - h, { size: 70, hold: .9, rot: -8 }); } }); }
      };
      let R0c = null; H.mid0 = H.mid; H.mid = (ctx2, c, sts, R) => { R0c = c; H.mid0(ctx2, c, sts, R); };
      base(ctx, s, t, H);
    } else {
      const boards = D.boards || [{ x: 520, label: "BROWSER", icon: "globe" }, { x: 1000, label: "PDF" }, { x: 1480, label: "DOKUMEN" }, { x: 1960, label: "SHEET" }];
      const hops = (D.hops || []).map((h, n) => tOf(s, h, .2 + n * .2, idx));
      const pts = [{ t: 0, x: (D.dogX0 ?? 260), y: GY, face: 1 }]; boards.forEach((b, n) => { if (hops[n] != null && hops[n] < 1e8) pts.push({ t: hops[n] + .75, x: b.x - 150, y: GY, hop: 170 }); });
      const H = {
        spots: Object.assign({}, ...boards.map((b, n) => ({ ["b" + n]: [b.x, 1150] }))),
        back: (ctx2) => { boards.forEach((b, n) => { const lit = hops[n] != null && t > hops[n] + .75 ? Math.min(1, (t - hops[n] - .75) / .3) : 0, sway = Math.sin(t * 1.6 + n) * .015;
          ctx2.save(); ctx2.translate(b.x, GY); ctx2.rotate(sway);
          ctx2.fillStyle = "#7A4A2E"; rr(ctx2, -10, -330, 20, 330, 6); ctx2.fill(); ol(ctx2, 4);
          const w = 330, h = 380, y0 = -330 - h; rr(ctx2, -w / 2, y0, w, h, 14); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 6);
          rr(ctx2, -w / 2, y0, w, 64, 14); ctx2.fillStyle = [TEAL, RED, "#3B6FB6", GREEN][n % 4]; ctx2.fill(); ol(ctx2, 6); textC(ctx2, b.label, 0, y0 + 44, 34, "#FFFFFF", 900, w - 40);
          rr(ctx2, -w / 2 + 24, y0 + 84, w - 48, 44, 22); ctx2.fillStyle = "#FFFFFF"; ctx2.fill(); ol(ctx2, 4); font(ctx2, 800, 24, FAM); ctx2.fillStyle = BROWN; ctx2.fillText("🔍 " + (D.keyText || "denda"), -w / 2 + 40, y0 + 114);
          for (let i = 0; i < 6; i++){ const yy = y0 + 160 + i * 36; ctx2.fillStyle = "#CDBEA9"; rr(ctx2, -w / 2 + 30, yy, 80 + rnd(i + n) * 60, 14, 7); ctx2.fill(); rr(ctx2, -w / 2 + 160 + rnd(i + n * 2) * 30, yy, 90, 14, 7); ctx2.fill();
            if (i === 3){ ctx2.save(); const sc = 1 + .3 * Math.sin(Math.min(1, lit) * Math.PI); ctx2.translate(-w / 2 + 70, yy + 7); ctx2.scale(sc, sc); rr(ctx2, -48, -16, 96, 32, 6); ctx2.fillStyle = lit ? YEL : "#E9DFCF"; ctx2.fill(); if (lit) ol(ctx2, 3); textC(ctx2, D.keyText || "denda", 0, 9, 20, BROWN, 900); ctx2.restore(); } }
          ctx2.restore(); if (lit) glowAt(ctx2, b.x - 95, GY - 330 - h + 280, 160, YEL, .3 * lit); }); },
        mid: (ctx2) => { const d = dogPath(pts, t), done = t > pts[pts.length - 1].t; drawDog(ctx2, d.x, d.y, .85, d.face, t, { run: d.run, lift: d.lift, bark: hops.some(h => t > h + .75 && t < h + 1.3), happy: true, sniff: !d.run && !done });
          boards.forEach((b, n) => { if (hops[n] != null) burst(ctx2, b.x - 95, GY - 330 - 380 + 280, t - hops[n] - .75, YEL, 10, 120); }); },
        midZ: 1
      };
      base(ctx, s, t, Object.assign(H, { envFront: false }));
    }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const D = f.dog || {}; if (D.mode !== "papan"){ add(T(s, D.dogCue, .3, i), "whoosh"); const tT = T(s, D.typeCue, .3, i); for (let k = 0; k < 5; k++) add(tT + k * .12, "pop"); for (let k = 0; k < 3; k++) add(T(s, D.dogCue, .3, i) + .6 + k * .5, "ping"); }
    else (D.hops || []).forEach((h, n) => { add(tOf(s, h, .2 + n * .2, i) + .1, "whoosh"); add(tOf(s, h, .2 + n * .2, i) + .75, "ping"); }); });

  /* ================= JS35: pusaran (vortex) ================= */
  function counterFront(ctx, x0, x1, top){ ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(x0 + 10, GY - 6, x1 - x0, 16);
    rr(ctx, x0, top, x1 - x0, GY - top, 12); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6);
    for (let x = x0 + 40; x < x1 - 30; x += 90){ ctx.fillStyle = "rgba(43,26,18,.12)"; ctx.fillRect(x, top + 50, 50, GY - top - 80); }
    rr(ctx, x0 - 20, top - 30, x1 - x0 + 40, 36, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
    rr(ctx, (x0 + x1) / 2 - 130, top + 40, 260, 70, 12); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); textC(ctx, "LAYANAN", (x0 + x1) / 2, top + 88, 36, "#FFFFFF", 900); }
  function vortex(ctx, x, y, r, t, a){ if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
    const g = ctx.createRadialGradient(0, 0, 4, 0, 0, r); g.addColorStop(0, "#1A1030"); g.addColorStop(.6, "#4B2E6E"); g.addColorStop(1, "rgba(75,46,110,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    for (let i = 0; i < 5; i++){ ctx.strokeStyle = i % 2 ? "rgba(255,244,230,.8)" : hexA(HL, .9); ctx.lineWidth = 7 - i; ctx.beginPath();
      for (let k = 0; k < 60; k++){ const q = k / 60, an = -t * 5 + i * TAU / 5 + q * 6, rr2 = r * (1 - q) * .95; const px = Math.cos(an) * rr2, py = Math.sin(an) * rr2 * .8; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "pusaran", "Cerita: tiket keluhan dilempar ke pusaran TEKNISI", (ctx, th, s, t) => {
    const f = s.f || {}, V = Object.assign({ cx0: 40, cx1: 1060, top: 1260, door: [980, 1080] }, f.vortex || {}), idx = G.scene;
    const tIn = T(s, V.inCue, .3, idx), tToss = T(s, V.tossCue, .6, idx), tGone = T(s, V.goneCue, .4, idx);
    const vA = t < tToss - .3 ? 0 : t < tToss + 2.4 ? Math.min(1, (t - tToss + .3) / .4) : Math.max(0, 1 - (t - tToss - 2.4) / .5);
    const tick = () => { if (t < tIn) return null; const p0 = [V.tx ?? 520, V.top - 150]; if (t < tToss) return { x: p0[0], y: p0[1] + Math.sin(t * 3) * 10, s: pq(t, tIn, .4) * .9, rot: 0 };
      const k = t - tToss, a = Math.min(1, k / .8); if (k < .8){ const x = lerp(p0[0], V.door[0], a), y = lerp(p0[1], V.door[1], a) - 380 * 4 * a * (1 - a); return { x, y, s: .9, rot: k * 9 }; }
      const q = clamp((k - .8) / 1.2, 0, 1); if (q >= 1) return null; const an = q * 14, r = 150 * (1 - q); return { x: V.door[0] + Math.cos(an) * r, y: V.door[1] + Math.sin(an) * r * .8, s: .9 * (1 - q), rot: an }; };
    const H = {
      spots: { door: [V.door[0] - 120, V.door[1] - 60], tick: [V.tx ?? 520, V.top - 200] },
      back: (ctx2) => { // door to the back room
        const [dx, dy] = V.door; ctx2.fillStyle = "#5A321C"; rr(ctx2, dx - 150, dy - 330, 300, 470, 10); ctx2.fill(); ol(ctx2, 6);
        ctx2.fillStyle = "#2B1A12"; ctx2.fillRect(dx - 130, dy - 310, 260, 450);
        vortex(ctx2, dx, dy - 60, 190, t, vA);
        rr(ctx2, dx - 120, dy - 410, 240, 64, 10); ctx2.fillStyle = NAVY; ctx2.fill(); ol(ctx2, 5); textC(ctx2, "TEKNISI", dx, dy - 365, 36, "#FFFFFF", 900); },
      front: (ctx2) => { counterFront(ctx2, V.cx0, V.cx1, V.top); const k = tick(); if (k) drawTicket(ctx2, k.x, k.y, k.s, t, { legs: false, rot: k.rot }); },
      over1: (ctx2, c, sts, j) => { if (j !== (V.clerk ?? 1) || t < tGone) return; const hp = headOf(sts[j]), k = t - tGone, q = eBack(clamp(k / .4, 0, 1)), u = sts[j].size / 92;
        ctx2.save(); ctx2.translate(hp[0] + 14 * u * (sts[j].face || 1), hp[1] - 40 * u); ctx2.scale(q * .55, q * .55);
        puffC(ctx2, 0, 0, 22 * u, "#FFFFFF"); ctx2.beginPath(); ctx2.arc(0, 0, 22 * u, 0, TAU); ctx2.strokeStyle = "rgba(43,26,18,.25)"; ctx2.lineWidth = 6; ctx2.stroke(); ctx2.strokeStyle = OUT; ctx2.lineWidth = .8 * u; [[-14, 30, 5], [-22, 42, 3]].forEach(([x, y, r]) => { ctx2.beginPath(); ctx2.arc(x * u * .5, y * u * .5, r * u * .5, 0, TAU); ctx2.fillStyle = "#FFFFFF"; ctx2.fill(); });
        if (k < .9){ ctx2.save(); ctx2.globalAlpha *= 1 - k / .9; drawTicket(ctx2, 0, -4 * u, .12 * u, t, { legs: false }); ctx2.restore(); }
        else { font(ctx2, 900, 30 * u, FAM); ctx2.fillStyle = BROWN; ctx2.textAlign = "center"; ctx2.fillText(".".repeat(1 + Math.floor((k * 3) % 3)), 0, 4 * u); ctx2.textAlign = "left"; }
        ctx2.restore(); }
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const V = f.vortex || {}; add(T(s, V.inCue, .3, i), "pop"); add(T(s, V.tossCue, .6, i), "whoosh"); add(T(s, V.tossCue, .6, i) + 1.6, "ping"); add(T(s, V.goneCue, .4, i), "pop"); });

  /* ================= JS35: cucian (laundry mountain) ================= */
  function washer(ctx, x, t, leak){ const y = GY; ctx.save(); ctx.translate(x + Math.sin(t * 30) * (leak > 0 ? 1.5 : 0), 0);
    rr(ctx, -150, y - 360, 300, 360, 22); ctx.fillStyle = "#F1EEE8"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#D9D4CB"; ctx.fillRect(-150, y - 360 + 60, 300, 6);
    ctx.beginPath(); ctx.arc(-100, y - 330, 12, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.beginPath(); ctx.arc(-60, y - 330, 12, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill();
    ctx.beginPath(); ctx.arc(0, y - 170, 100, 0, TAU); ctx.fillStyle = "#B8C4CC"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(0, y - 170, 76, 0, TAU); ctx.fillStyle = "#6E8EA3"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, y - 170, 56, -2.4, -1.6); ctx.stroke();
    ctx.fillStyle = "#E8B23A"; ctx.save(); ctx.translate(0, y - 170); ctx.rotate(-.5); rr(ctx, -110, -20, 220, 40, 6); ctx.fill(); ol(ctx, 3); textC(ctx, "RUSAK", 0, 12, 26, BROWN, 900); ctx.restore();
    ctx.restore();
    if (leak > 0){ ctx.fillStyle = "rgba(120,180,220,.55)"; ctx.beginPath(); ctx.ellipse(x - 60, y + 6, 160 * leak, 22 * leak, 0, 0, TAU); ctx.fill();
      for (let i = 0; i < 3; i++){ const q = (t * 1.4 + i / 3) % 1; ctx.fillStyle = "rgba(120,180,220,.85)"; ctx.beginPath(); ctx.ellipse(x - 120, y - 40 + q * 40, 7, 10, 0, 0, TAU); ctx.fill(); } } }
  const CLOTH = ["#C2691F", "#2F6F73", "#E8A55B", "#5B7DB1", "#D9483B", "#7FA563", "#F3D9B5", "#8E4E2E", "#E85D9A"];
  function pileDraw(ctx, x, n, t, fall){ for (let i = 0; i < n; i++){ const row = Math.floor(i / 3), w = 230 - row * 14 + rnd(i) * 30, px = x + ((i % 3) - 1) * (120 - row * 8) + Math.sin(i * 2.1) * 14 + Math.sin(t * 2 + i) * row * 1.2, py = GY - 30 - row * 62;
      ctx.save(); ctx.translate(px, py); ctx.rotate(Math.sin(i * 1.7) * .22); ctx.beginPath(); ctx.ellipse(0, 0, w / 2, 34, 0, 0, TAU); ctx.fillStyle = CLOTH[i % CLOTH.length]; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 3, -6); ctx.quadraticCurveTo(0, 10, w / 3, -8); ctx.stroke(); ctx.restore(); } }
  TT.scene(PX + "cucian", "Cerita: mesin cuci bocor, gunung cucian, telepon menunggu", (ctx, th, s, t) => {
    const f = s.f || {}, Wf = Object.assign({ x: 860, pileX: 600 }, f.wash || {}), idx = G.scene;
    const days = (Wf.days || []).map((d, n) => ({ T: tOf(s, d, .2, idx), text: d.text, n: d.n }));
    let n = Wf.n0 ?? 3; days.forEach(d => { if (t > d.T) n = lerp(n, d.n, 1); });
    let shown = Wf.n0 ?? 3; days.forEach(d => { if (t > d.T) shown = d.n; });
    const prevN = days.filter(d => t > d.T).length > 1 ? days.filter(d => t > d.T).slice(-2)[0].n : (Wf.n0 ?? 3);
    const lastT = days.filter(d => t > d.T).slice(-1)[0], grow = lastT ? clamp((t - lastT.T) / .8, 0, 1) : 1, cnt = Math.round(lerp(prevN, shown, grow));
    const tCall = (Wf.calls || []).map(c => tOf(s, c, .2, idx));
    const H = {
      spots: { pile: [Wf.pileX, 1250], washer: [Wf.x, 1300] },
      back: (ctx2) => { washer(ctx2, Wf.x, t, ramp(t, 0, 1.5)); pileDraw(ctx2, Wf.pileX, cnt, t); },
      over: (ctx2) => {
        days.forEach((d, j) => { const nx = days[j + 1]; if (t >= d.T && (!nx || t < nx.T)) popChip(ctx2, d.text, 540, 300, t - d.T, NAVY, "#FFFFFF", 46, -.03); });
        tCall.forEach((tc, j) => { const k = t - tc; if (k < 0 || k > 2.6) return; const q = eBack(clamp(k / .3, 0, 1)), a = k > 2.3 ? 1 - (k - 2.3) / .3 : 1;
          ctx2.save(); ctx2.globalAlpha *= a; ctx2.translate(Wf.holdX ?? 330, Wf.holdY ?? 520); ctx2.scale(q, q); ctx2.rotate(-.03);
          rr(ctx2, -230, -60, 460, 120, 30); ctx2.fillStyle = "#FFFFFF"; ctx2.fill(); ol(ctx2, 6);
          textC(ctx2, Wf.holdText || "Mohon menunggu...", 0, 14, 38, BROWN, 800, 400);
          for (let m = 0; m < 3; m++){ const qq = (k * .9 + m / 3) % 1; ctx2.globalAlpha = a * Math.sin(qq * Math.PI); font(ctx2, 900, 44, FAM); ctx2.fillStyle = ORANGE; ctx2.fillText("♪", 160 + m * 30, -70 - qq * 80); }
          ctx2.restore(); });
      }
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Wf = f.wash || {}; (Wf.days || []).forEach(d => add(tOf(s, d, .2, i), "pop")); (Wf.calls || []).forEach(c => add(tOf(s, c, .2, i), "ping")); });

  /* ================= JS35: kawal (bodyguard escort) ================= */
  function arch(ctx, x, label, lit, t, n){ ctx.save(); ctx.translate(x, GY);
    const col = lit > 0 ? GREEN : "#9AA6B2"; [-1, 1].forEach(d => { rr(ctx, d * 200 - 18, -560, 36, 560, 10); ctx.fillStyle = "#E9E4DA"; ctx.fill(); ol(ctx, 5); });
    rr(ctx, -250, -660, 500, 120, 18); ctx.fillStyle = lit > 0 ? "#DFF3E2" : PAPER; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.stroke(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(-190, -600, 30, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 4); textC(ctx, String(n), -190, -588, 32, "#FFFFFF", 900);
    textC(ctx, label, 30, -588, 40, BROWN, 900, 360);
    if (lit > 0){ for (let i = 0; i < 6; i++){ const a = t * 2 + i; sparkle(ctx, Math.cos(a) * 240, -600 + Math.sin(a) * 80, 10, GOLD); } }
    ctx.restore(); }
  TT.scene(PX + "kawal", "Cerita: pengawal mengantar tiket keluhan melewati gerbang + kabar ke pelanggan", (ctx, th, s, t) => {
    const f = s.f || {}, E = Object.assign({ gates: [] }, f.escort || {}), idx = G.scene;
    const gates = E.gates.map((g, n) => Object.assign({ T0: tOf(s, g, .3, idx) }, g));
    const tickOn = E.tick ?? 0, tickT = T(s, E.tickCue, .2, idx);
    const H = {
      spots: Object.assign({}, ...gates.map((g, n) => ({ ["g" + n]: [g.x, 1100] }))),
      back: (ctx2) => { gates.forEach((g, n) => arch(ctx2, g.x, g.label, t > g.T0 ? 1 : 0, t, n + 1)); },
      under: (ctx2, c, sts, j) => { if (j !== tickOn || t < tickT) return; const st = sts[j], walking = st.moving, x = st.x + (E.tickDx ?? 170) * (st.face || 1), done = gates.length && t > gates[gates.length - 1].T0;
        const jumpK = done ? t - gates[gates.length - 1].T0 : -1, jy = jumpK > 0 && jumpK < .6 ? 4 * (jumpK / .6) * (1 - jumpK / .6) * 120 : 0;
        ctx2.save(); ctx2.globalAlpha *= clamp((t - tickT) / .3, 0, 1); drawTicket(ctx2, x, GY - jy, .95, t, { walk: walking, done, happy: done }); ctx2.restore(); },
      over: (ctx2) => {
        if (E.inset && t > T(s, E.inset.cue, .1, idx)){ const I = E.inset, k = t - T(s, I.cue, .1, idx), q = eBack(clamp(k / .4, 0, 1)), cx = I.x ?? 830, cy = I.y ?? 380, r = 150;
          ctx2.save(); ctx2.translate(cx, cy); ctx2.scale(q, q);
          ctx2.beginPath(); ctx2.arc(0, 0, r + 10, 0, TAU); ctx2.fillStyle = "#FFFFFF"; ctx2.fill(); ol(ctx2, 6);
          ctx2.save(); ctx2.beginPath(); ctx2.arc(0, 0, r, 0, TAU); ctx2.clip(); ctx2.fillStyle = "#F6DDB2"; ctx2.fillRect(-r, -r, r * 2, r * 2); ctx2.fillStyle = "#83502F"; ctx2.fillRect(-r, -r, r * 2, r * 1.1);
          const a = Object.assign({}, I.actor, { x: 0, y: 0, size: 300 }); const st = toonState(a, s, t); st.x = -10; st.y = r + 150; st.size = 360; drawToon(ctx2, a, st, t); ctx2.restore();
          textC(ctx2, I.label || "BU SARI", 0, r + 52, 30, "#FFFFFF", 900); ctx2.restore();
          gates.forEach((g, n) => { const kk = t - g.T0 - .2; if (kk < 0) return; const fl = clamp(kk / .7, 0, 1);
            const sx = lerp(540, cx - 60, eOut(fl)), sy = lerp(900, cy + 40 - n * 0, eOut(fl)) - 140 * Math.sin(fl * Math.PI);
            if (fl < 1){ ctx2.save(); ctx2.translate(sx, sy); ctx2.scale(.8, .8); rr(ctx2, -70, -40, 140, 80, 22); ctx2.fillStyle = "#DCF8C6"; ctx2.fill(); ol(ctx2, 5); textC(ctx2, "✓", 0, 18, 50, GREEN, 900); ctx2.restore(); }
            else { const bx = cx - r - 20, by = cy - 120 + n * 92, qq = eBack(clamp((kk - .7) / .3, 0, 1)); ctx2.save(); ctx2.translate(bx, by); ctx2.scale(qq, qq); rr(ctx2, -330, -38, 330, 76, 24); ctx2.fillStyle = "#DCF8C6"; ctx2.fill(); ol(ctx2, 5);
              textC(ctx2, "\u2713 " + (g.msg || g.label), -165, 12, 32, BROWN, 800, 300); ctx2.restore(); } }); }
      }
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const E = f.escort || {}; (E.gates || []).forEach(g => { add(tOf(s, g, .3, i), "chime"); add(tOf(s, g, .3, i) + .9, "ping"); }); if (E.inset) add(T(s, E.inset.cue, .1, i), "pop"); });

  /* ================= SC35: ayam (golden hen) ================= */
  function warung(ctx, x, t, day){ ctx.save(); ctx.translate(x, 0);
    ctx.fillStyle = "#8E4E2E"; rr(ctx, -380, GY - 700, 30, 700, 6); ctx.fill(); ol(ctx, 4); rr(ctx, 350, GY - 700, 30, 700, 6); ctx.fill(); ol(ctx, 4);
    for (let i = 0; i < 8; i++){ ctx.fillStyle = i % 2 ? CREAM : ORANGE; ctx.beginPath(); ctx.moveTo(-420 + i * 105, GY - 760); ctx.lineTo(-420 + (i + 1) * 105, GY - 760); ctx.lineTo(-420 + (i + 1) * 105, GY - 680); ctx.quadraticCurveTo(-420 + (i + .5) * 105, GY - 640 + Math.sin(t * 2 + i) * 4, -420 + i * 105, GY - 680); ctx.closePath(); ctx.fill(); ol(ctx, 4); }
    rr(ctx, -200, GY - 860, 400, 90, 14); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 5); textC(ctx, "WARUNG KOPI", 0, GY - 800, 44, CREAM, 900);
    ctx.restore(); }
  function pedestal(ctx, x, top, t){ rr(ctx, x - 120, top, 240, GY - top, 10); ctx.fillStyle = "#7A1F3A"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = GOLD; ctx.fillRect(x - 120, top + 20, 240, 12); ctx.fillRect(x - 120, GY - 50, 240, 12);
    ctx.beginPath(); ctx.ellipse(x, top, 170, 40, 0, 0, TAU); ctx.fillStyle = "#B0284E"; ctx.fill(); ol(ctx, 6); }
  TT.scene(PX + "ayam", "Cerita: ayam emas (jual / cek cincin kaki / cat emas mengelupas)", (ctx, th, s, t) => {
    const f = s.f || {}, A = Object.assign({ mode: "jual", x: 620, top: 1300 }, f.hen || {}), idx = G.scene;
    const eggs = (A.eggs || []).map((e, n) => Object.assign({ T0: tOf(s, e, .3 + n * .2, idx) }, e));
    const tFlake = T(s, A.flakeCue, .3, idx), tRun = T(s, A.runCue, .3, idx), tLoupe = T(s, A.loupeCue, .3, idx), tL = (A.letters || []).map(l => tOf(s, l, .3, idx));
    const gold = A.mode === "lepas" ? 1 - ramp(t, tFlake, tFlake + 1.3) : 1;
    const runK = t - tRun, hx = A.mode === "lepas" && runK > 0 ? A.x + runK * 700 : A.x, hy = A.mode === "lepas" && runK > 0 ? GY : A.top + 10;
    const squat = eggs.reduce((m, e) => { const k = t - e.T0; return k > -.35 && k < .1 ? Math.max(m, 1 - Math.abs(k + .1) / .25) : m; }, 0);
    const H = {
      spots: { hen: [A.x, A.top - 150], leg: [A.x + 20, A.top - 20] },
      back: (ctx2) => { if (A.warung) warung(ctx2, A.warung, t); if (!(A.mode === "lepas" && runK > .3)) pedestal(ctx2, A.x, A.top, t); },
      mid: (ctx2) => {
        drawHen(ctx2, hx, hy, A.s || .95, runK > 0 && A.mode === "lepas" ? 1 : (A.face || 1), t, { gold, squat, run: A.mode === "lepas" && runK > 0, flap: (A.mode === "lepas" && runK > 0) || (A.mode === "lepas" && t > tFlake && t < tFlake + 1.3), peck: A.mode === "cek" && t < tLoupe });
        eggs.forEach((e, n) => { if (t < e.T0) return; const k = t - e.T0, q = clamp(k / .5, 0, 1); const ex = A.x - 40 * (A.face || 1) + (n - 1) * 70 * q - 60, ey = A.top - 8 - 120 * Math.sin(q * Math.PI) * (1 - q * .5);
          const cr = A.mode === "lepas" ? ramp(t, tFlake + .5 + n * .15, tFlake + 1.2 + n * .15) : 0; drawEgg(ctx2, ex, ey, .9, t, { crack: cr, rot: Math.sin(k * 4) * .1 * (1 - q) }); burst(ctx2, ex, ey - 40, k, GOLD, 10, 110); });
        if (A.mode === "lepas" && t > tFlake){ const k = t - tFlake; for (let i = 0; i < 26; i++){ const d = k - rnd(i) * 1.0; if (d < 0) continue; const x = A.x - 100 + rnd(i + 3) * 200 + Math.sin(d * 6 + i) * 30, y = A.top - 220 + rnd(i + 5) * 160 + d * 420 + d * d * 300; if (y > GY) continue;
          ctx2.save(); ctx2.translate(x, y); ctx2.rotate(d * 8 + i); ctx2.fillStyle = i % 3 ? GOLD : "#FFF1B0"; ctx2.fillRect(-10, -6, 20, 12); ctx2.restore(); } }
      },
      midZ: A.henZ ?? .5,
      over: (ctx2) => {
        eggs.forEach((e, n) => { if (!e.label || t < e.T0 + .1) return; const out = A.labelOut ? T(s, A.labelOut, .5, idx) : 1e9; if (t > out + .3) return; const a = t > out ? 1 - (t - out) / .3 : 1;
          ctx2.save(); ctx2.globalAlpha *= a; popChip(ctx2, e.label, e.lx ?? (230 + n * 310), e.ly ?? 330, t - e.T0 - .1, n === eggs.length - 1 ? RED : GOLD, n === eggs.length - 1 ? "#FFFFFF" : BROWN, e.big ? 52 : 42, (n - 1) * .06); ctx2.restore(); });
        if (A.mode === "cek" && t > tLoupe){ const k = t - tLoupe, q = eBack(clamp(k / .4, 0, 1)), cx = A.lx ?? 780, cy = A.ly ?? 420, r = 170;
          ctx2.save(); ctx2.translate(cx, cy); ctx2.scale(q, q); ctx2.beginPath(); ctx2.arc(0, 0, r + 14, 0, TAU); ctx2.fillStyle = "#9AA6B2"; ctx2.fill(); ol(ctx2, 6);
          ctx2.save(); ctx2.beginPath(); ctx2.arc(0, 0, r, 0, TAU); ctx2.clip(); ctx2.fillStyle = "#F3E6CF"; ctx2.fillRect(-r, -r, r * 2, r * 2);
          ctx2.strokeStyle = "#E8902A"; ctx2.lineWidth = 34; ctx2.lineCap = "round"; ctx2.beginPath(); ctx2.moveTo(-10, -r); ctx2.lineTo(0, r * .55); ctx2.stroke(); ctx2.lineWidth = 22; ctx2.beginPath(); ctx2.moveTo(-70, r * .6); ctx2.lineTo(80, r * .6); ctx2.stroke();
          const sc = k > .8 ? 1 : 0; if (sc){ ctx2.setLineDash([14, 10]); ctx2.strokeStyle = RED; ctx2.lineWidth = 6; rr(ctx2, -50, -40, 100, 40, 8); ctx2.stroke(); ctx2.setLineDash([]); }
          ctx2.restore(); ctx2.strokeStyle = "rgba(255,255,255,.7)"; ctx2.lineWidth = 10; ctx2.beginPath(); ctx2.arc(0, 0, r - 24, -2.6, -1.9); ctx2.stroke();
          if (k > .8) popChip(ctx2, A.loupeText || "TANPA IZIN?", 0, r + 40, k - .8, RED, "#FFFFFF", 36);
          ctx2.restore(); if (k > .8) popWord(ctx2, "?", cx + 150, cy - 120, (k - .8) % 2.2, { size: 120, hold: 2, rot: 10, col: RED }); }
        (A.letters || []).forEach((L, n) => { const k = t - tL[n]; if (k < 0) return; const out = L.outCue ? T(s, L.outCue, .3, idx) : 1e9; if (t > out + .3) return; const q = eBack(clamp(k / .45, 0, 1)), x = L.x ?? (360 + n * 360), y = L.y ?? 360, dim = (L.dimUntil ? (t < T(s, L.dimUntil, .3, idx) ? .45 : 1) : 1) * (t > out ? 1 - (t - out) / .3 : 1);
          ctx2.save(); ctx2.translate(x, y - (1 - q) * 300); ctx2.rotate((n ? 1 : -1) * .05); ctx2.globalAlpha *= clamp(k / .2, 0, 1) * dim;
          outlineWords(ctx2, [{ w: "L", hl: true }], 0, 40, 190, { sw: 40, hl: n ? GOLD : HL }); popChip(ctx2, L.text, 0, 110, k - .2, n ? GOLD : ORANGE, n ? BROWN : "#FFFFFF", 38); ctx2.restore(); });
      }
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.hen || {}; (A.eggs || []).forEach((e, n) => { add(tOf(s, e, .3 + n * .2, i), "pop"); });
    if (A.flakeCue) { add(T(s, A.flakeCue, .3, i), "whoosh"); add(T(s, A.flakeCue, .3, i) + .6, "ping"); } if (A.runCue) add(T(s, A.runCue, .3, i), "whoosh"); if (A.loupeCue){ add(T(s, A.loupeCue, .3, i), "pop"); add(T(s, A.loupeCue, .3, i) + .8, "ping"); }
    (A.letters || []).forEach(l => add(tOf(s, l, .3, i), "chime")); });

  /* ================= SC35: telur (12-month egg carton) ================= */
  const MON = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
  TT.scene(PX + "telur", "Cerita: rak telur 12 bulan, +10% per bulan = 120%, telur retak kosong", (ctx, th, s, t) => {
    const f = s.f || {}, R = Object.assign({ x: 560, y: 1000 }, f.tray || {}), idx = G.scene;
    const tIn = T(s, R.inCue, .1, idx), tFill = T(s, R.fillCue, .3, idx), tFillEnd = T(s, R.fillEndCue, .8, idx), tCrack = T(s, R.crackCue, .4, idx), tStamp = T(s, R.stampCue, .7, idx);
    const dropT = MON.map((_, n) => tFill + n * Math.max(.12, (tFillEnd - tFill) / 12));
    const H = {
      spots: { tray: [R.x, R.y] },
      mid: (ctx2) => {
        const q = pq(t, tIn, .5); if (q <= 0) return; ctx2.save(); ctx2.translate(R.x, R.y); ctx2.scale(q, q); ctx2.rotate(Math.sin(t * 1.2) * .01);
        const W2 = 820, H2 = 330; rr(ctx2, -W2 / 2, -H2 / 2 + 30, W2, H2, 30); ctx2.fillStyle = "#C9B08A"; ctx2.fill(); ol(ctx2, 6);
        rr(ctx2, -W2 / 2, -H2 / 2, W2, H2, 30); ctx2.fillStyle = "#E3CDA6"; ctx2.fill(); ol(ctx2, 6);
        for (let n = 0; n < 12; n++){ const cx = -W2 / 2 + 70 + (n % 6) * 136, cy = -H2 / 2 + 90 + Math.floor(n / 6) * 150;
          ctx2.beginPath(); ctx2.ellipse(cx, cy, 52, 40, 0, 0, TAU); ctx2.fillStyle = "#B89A70"; ctx2.fill(); ctx2.strokeStyle = "rgba(43,26,18,.4)"; ctx2.lineWidth = 4; ctx2.stroke();
          textC(ctx2, MON[n], cx, cy + 72, 22, BROWN, 900);
          const k = t - dropT[n]; if (k > 0){ const fall = 1 - eOut(clamp(k / .3, 0, 1)), sq = k < .45 && k > .3 ? Math.sin((k - .3) / .15 * Math.PI) * .15 : 0;
            const cr = ramp(t, tCrack + n * .06, tCrack + .5 + n * .06);
            ctx2.save(); ctx2.translate(cx, cy + 20 - fall * 520); ctx2.scale(1 + sq, 1 - sq); drawEgg(ctx2, 0, 0, .95, t, { crack: cr }); ctx2.restore();
            if (k < .9 && t < tCrack){ ctx2.save(); ctx2.globalAlpha *= 1 - k / .9; textC(ctx2, "+10%", cx, cy - 70 - k * 90, 30, ORANGE, 900); ctx2.restore(); } } }
        ctx2.restore(); },
      over: (ctx2) => {
        if (t > tFill){ const filled = dropT.filter(d => t > d + .2).length, v = filled * 10, a = 1; ctx2.save(); const q = eBack(clamp((t - tFill) / .4, 0, 1)); ctx2.translate(540, 330); ctx2.scale(q, q);
          rr(ctx2, -300, -100, 600, 200, 30); ctx2.fillStyle = NAVY; ctx2.fill(); ol(ctx2, 6);
          textC(ctx2, v + "%", 0, 40, 120, v >= 120 ? YEL : "#FFFFFF", 900); textC(ctx2, filled >= 12 ? "SETAHUN" : "BULAN KE-" + filled, 0, 86, 30, "#FFFFFF", 800); ctx2.restore();
          if (filled >= 12) burst(ctx2, 540, 330, t - dropT[11] - .2, YEL, 14, 260); }
        if (t > tStamp) stampBox(ctx2, R.stampText || "TIDAK LOGIS", 540, 760, t - tStamp, RED, 80, -.1);
      }
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const R = f.tray || {}; const a = T(s, R.fillCue, .3, i), b = T(s, R.fillEndCue, .8, i); for (let n = 0; n < 12; n++) add(a + n * Math.max(.12, (b - a) / 12), "pop");
    if (R.crackCue) add(T(s, R.crackCue, .4, i), "ping"); if (R.stampCue) add(T(s, R.stampCue, .7, i), "whoosh"); });

  /* ================= MS35: sekat (dollhouse) ================= */
  const ROOMS = { L1: [60, 1180, 540, GY], R1: [540, 1180, 1020, GY], L2: [60, 720, 540, 1180], R2: [540, 720, 1020, 1180] };
  function house(ctx, t, o){
    const x0 = 40, x1 = 1040;
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(x0 - 20, GY, x1 - x0 + 40, 24);
    // roof
    ctx.beginPath(); ctx.moveTo(x0 - 70, 740); ctx.lineTo(540, 360); ctx.lineTo(x1 + 70, 740); ctx.closePath(); ctx.fillStyle = "#A9472E"; ctx.fill(); ol(ctx, 8);
    ctx.beginPath(); ctx.moveTo(x0 + 40, 720); ctx.lineTo(540, 410); ctx.lineTo(x1 - 40, 720); ctx.closePath(); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(540, 600, 56, 0, TAU); ctx.fillStyle = o.lit ? "#FFE2A0" : "#BFD6DE"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(484, 600); ctx.lineTo(596, 600); ctx.moveTo(540, 544); ctx.lineTo(540, 656); ctx.lineWidth = 5; ctx.stroke();
    const walls = { L1: "#F6E3C8", R1: "#DDEBD9", L2: "#F4D6DD", R2: "#D7E4F2" };
    Object.entries(ROOMS).forEach(([k, [a, b, c, d]]) => { ctx.fillStyle = o.lit ? "#FFE9C4" : walls[k]; ctx.fillRect(a, b, c - a, d - b);
      ctx.fillStyle = "rgba(43,26,18,.06)"; for (let x = a + 20; x < c; x += 60) ctx.fillRect(x, b, 26, d - b - 30);
      ctx.fillStyle = "#C9925E"; ctx.fillRect(a, d - 30, c - a, 30); });
    // furniture
    const [kx, , , ky] = ROOMS.L1; // kitchen
    ctx.fillStyle = "#E9E4DA"; rr(ctx, kx + 280, ky - 330, 150, 300, 14); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#9AA6B2"; ctx.fillRect(kx + 400, ky - 290, 10, 60);
    rr(ctx, kx + 20, ky - 200, 250, 170, 8); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 5); rr(ctx, kx + 70, ky - 228, 100, 30, 6); ctx.fillStyle = "#2C2433"; ctx.fill();
    for (let i = 0; i < 3; i++){ const q = (t * .6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(kx + 110 + i * 14, ky - 240 - q * 90); ctx.quadraticCurveTo(kx + 100 + i * 14, ky - 270 - q * 90, kx + 115 + i * 14, ky - 300 - q * 90); ctx.stroke(); ctx.restore(); }
    const [rx, , , ry] = ROOMS.R1; rr(ctx, rx + 220, ry - 160, 240, 130, 30); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); rr(ctx, rx + 200, ry - 210, 60, 180, 20); ctx.fill(); ol(ctx, 5);
    rr(ctx, rx + 30, ry - 170, 180, 14, 4); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ctx.fillRect(rx + 50, ry - 160, 12, 130); ctx.fillRect(rx + 180, ry - 160, 12, 130);
    const [ax, , , ay] = ROOMS.L2; rr(ctx, ax + 230, ay - 140, 240, 110, 16); ctx.fillStyle = "#E85D9A"; ctx.fill(); ol(ctx, 5); rr(ctx, ax + 400, ay - 180, 70, 60, 14); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
    rr(ctx, ax + 60, ay - 380, 110, 140, 6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = TEAL; ctx.fillRect(ax + 76, ay - 360, 78, 50);
    const [bx, , , by] = ROOMS.R2; rr(ctx, bx + 300, by - 300, 160, 20, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ["#D9483B", "#F6C343", "#3E9B5A"].forEach((cl, i) => { rr(ctx, bx + 310 + i * 50, by - 350, 40, 50, 8); ctx.fillStyle = cl; ctx.fill(); ol(ctx, 3); });
    rr(ctx, bx + 40, by - 90, 200, 60, 10); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 4);
    // structure
    ctx.strokeStyle = "#7A4A2E"; ctx.lineWidth = 26; ctx.strokeRect(x0 + 13, 733, x1 - x0 - 26, GY - 733 - 13);
    ctx.beginPath(); ctx.moveTo(x0, 1180); ctx.lineTo(x1, 1180); ctx.moveTo(540, 733); ctx.lineTo(540, GY); ctx.stroke();
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x0, 720, x1 - x0, GY - 720);
  }
  TT.scene(PX + "sekat", "Cerita: rumah potongan melintang, tiap orang sendiri di kamarnya", (ctx, th, s, t) => {
    const f = s.f || {}, Hs = Object.assign({}, f.house || {}), idx = G.scene;
    const tLit = T(s, Hs.litCue, .3, idx), tCrick = T(s, Hs.crickCue, .5, idx);
    const H = {
      spots: { L1: [300, 1420, 1.9], R1: [780, 1420, 1.9], L2: [300, 960, 1.9], R2: [780, 960, 1.9], all: [540, 1060, .98] },
      back: (ctx2) => house(ctx2, t, { lit: t > tLit }),
      over1: (ctx2, c, sts, j) => { const g = (Hs.glow || [])[j]; if (!g) return; const st = sts[j], p = handOf(st); glowAt(ctx2, p[0], p[1] - 20 * st.size / 760, 150 * st.size / 400, "#9FD3FF", .35 + .1 * Math.sin(t * 6 + j)); },
      over: (ctx2) => { if (t > tCrick){ const k = t - tCrick; popWord(ctx2, "KRIK... KRIK...", 540, 420, k, { size: 70, hold: 2.4, rot: -4, col: "#9FD7C0" }); } }
    };
    base(ctx, s, t, Object.assign(H, { envFront: false }));
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const Hs = f.house || {}; if (Hs.crickCue){ const c = T(s, Hs.crickCue, .5, i); add(c, "ping"); add(c + .8, "ping"); } });

  /* ================= MS35: serabi (clay stove) ================= */
  function kitchenBack(ctx, top, t, future){ ctx.fillStyle = future ? "#DCE9E4" : "#F3E3C6"; ctx.fillRect(-600, top - 560, 2300, 560);
    for (let y = top - 560; y < top; y += 70) for (let x = -600 + ((y / 70) % 2) * 35; x < 1700; x += 70){ ctx.strokeStyle = future ? "rgba(47,111,115,.18)" : "rgba(122,74,46,.18)"; ctx.lineWidth = 3; ctx.strokeRect(x, y, 70, 70); }
    rr(ctx, 120, top - 520, 300, 22, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill();
    ["#E9E4DA", "#C2691F", "#2F6F73"].forEach((cl, i) => { ctx.beginPath(); ctx.ellipse(170 + i * 90, top - 540, 34, 26, 0, Math.PI, 0); ctx.fillStyle = cl; ctx.fill(); ol(ctx, 4); }); }
  function counter(ctx, top, x0, x1, future){ rr(ctx, x0, top, x1 - x0, GY - top + 40, 8); ctx.fillStyle = future ? "#5E8C86" : "#A9643B"; ctx.fill(); ol(ctx, 6);
    for (let x = x0 + 30; x < x1 - 120; x += 240){ rr(ctx, x, top + 70, 200, GY - top - 120, 10); ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = "rgba(43,26,18,.4)"; ctx.fillRect(x + 80, top + 110, 40, 8); }
    rr(ctx, x0 - 20, top - 22, x1 - x0 + 40, 34, 8); ctx.fillStyle = future ? "#EDEDED" : "#E9D3B0"; ctx.fill(); ol(ctx, 6); }
  function tungku(ctx, x, top, t, o){ // clay stove standing on the counter, moulds on top
    const fire = o.fire || 0, base0 = top - 10;
    ctx.beginPath(); ctx.moveTo(x - 190, base0); ctx.lineTo(x - 160, base0 - 200); ctx.lineTo(x + 160, base0 - 200); ctx.lineTo(x + 190, base0); ctx.closePath(); ctx.fillStyle = "#B5562E"; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(x, base0 - 30, 70, Math.PI, 0); ctx.closePath(); ctx.fillStyle = "#2B1A12"; ctx.fill();
    if (fire > 0){ glowAt(ctx, x, base0 - 60, 160 + 60 * fire, "#FFB347", .5 * fire); for (let i = 0; i < 5; i++){ const h = (40 + 50 * fire) * (1 + .3 * Math.sin(t * 14 + i * 2)); ctx.beginPath(); ctx.moveTo(x - 50 + i * 25 - 14, base0 - 30); ctx.quadraticCurveTo(x - 50 + i * 25, base0 - 30 - h * 1.2, x - 50 + i * 25 + 14, base0 - 30); ctx.fillStyle = i % 2 ? "#FFD34D" : "#F08C2E"; ctx.fill(); }
      for (let i = 0; i < 6 * fire; i++){ const q = (t * 1.5 + i / 6) % 1; ctx.fillStyle = hexA("#FFD34D", 1 - q); ctx.beginPath(); ctx.arc(x - 60 + rnd(i) * 120 + Math.sin(t * 5 + i) * 10, base0 - 80 - q * 260, 5, 0, TAU); ctx.fill(); } }
    for (let m = 0; m < 3; m++){ const mx = x - 110 + m * 110, my = base0 - 210; ctx.beginPath(); ctx.ellipse(mx, my, 50, 18, 0, 0, TAU); ctx.fillStyle = "#7A3A22"; ctx.fill(); ol(ctx, 5);
      const b = (o.batter || [])[m] || 0; if (b > 0){ const puff = o.puff || 0; ctx.beginPath(); ctx.ellipse(mx, my - 4 - puff * 8, 40 * b, 13 * b + puff * 6, 0, 0, TAU); ctx.fillStyle = puff > .5 ? "#EBC17A" : "#F6E7C6"; ctx.fill(); ctx.strokeStyle = "rgba(43,26,18,.4)"; ctx.lineWidth = 3; ctx.stroke();
        for (let i = 0; i < 4 * puff; i++){ ctx.beginPath(); ctx.arc(mx - 20 + rnd(i + m) * 40, my - 6 - puff * 8 + (rnd(i + m * 3) - .5) * 10, 3 + 2 * Math.sin(t * 6 + i), 0, TAU); ctx.fillStyle = "rgba(122,74,46,.4)"; ctx.fill(); }
        const sp = (o.sprinkle || 0); for (let i = 0; i < 10 * sp; i++){ ctx.fillStyle = "#4A2612"; ctx.fillRect(mx - 26 + rnd(i * 7 + m) * 52, my - 12 - puff * 8 + rnd(i * 3 + m) * 10, 7, 3); } } }
    if (fire > .3) for (let i = 0; i < 4; i++){ const q = (t * .5 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .55 * Math.sin(q * Math.PI); puffC(ctx, x - 110 + (i % 3) * 110 + Math.sin(t + i) * 20, base0 - 250 - q * 260, 26 + q * 30, "#FFFFFF"); ctx.restore(); } }
  TT.scene(PX + "serabi", "Cerita: masak serabi bersama di tungku tanah liat", (ctx, th, s, t) => {
    const f = s.f || {}, S = Object.assign({ x: 560, top: 1330 }, f.stove || {}), idx = G.scene;
    const tOn = T(s, S.onCue, .2, idx), tPour = T(s, S.pourCue, .3, idx), tSpr = T(s, S.sprinkleCue, .3, idx), tFan = T(s, S.fanCue, .3, idx);
    const fire = t < tOn ? 0 : t < tFan ? .4 + .1 * Math.sin(t * 3) : Math.min(1, .5 + (t - tFan) * .8);
    const batter = [0, 1, 2].map(m => ramp(t, tPour + m * .35, tPour + m * .35 + .4)), sprinkle = ramp(t, tSpr, tSpr + 1.2), puff = ramp(t, tFan + .3, tFan + 1.8);
    const H = {
      spots: { stove: [S.x, S.top - 230] },
      back: (ctx2) => kitchenBack(ctx2, S.top, t, false),
      front: (ctx2, c, sts) => { counter(ctx2, S.top, -400, 1500, false); const sc = S.s || 1; if (t >= tOn) { ctx2.save(); const q = pq(t, tOn, .4) * sc; ctx2.translate(S.x, S.top); ctx2.scale(q, q); ctx2.translate(-S.x, -S.top); tungku(ctx2, S.x, S.top, t, { fire, batter, sprinkle, puff }); ctx2.restore(); }
        // pour stream from the bowl holder
        if (S.pourOn != null && t > tPour && t < tPour + 1.3){ const st = sts[S.pourOn], p = handOf(st), m = Math.min(2, Math.floor((t - tPour) / .35)); ctx2.strokeStyle = "#F6E7C6"; ctx2.lineWidth = 14; ctx2.lineCap = "round"; ctx2.beginPath(); ctx2.moveTo(p[0], p[1]); ctx2.quadraticCurveTo(p[0] + 60, p[1] + 40, S.x + (m * 110 - 110) * sc, S.top - 225 * sc); ctx2.stroke(); }
        if (S.sprOn != null && t > tSpr && t < tSpr + 1.6){ const st = sts[S.sprOn], p = handOf(st); for (let i = 0; i < 18; i++){ const q = ((t - tSpr) * 1.6 + i / 18) % 1; const tx = S.x + ((i % 3) * 110 - 110) * sc; ctx2.fillStyle = "#4A2612"; ctx2.fillRect(lerp(p[0], tx, q) + Math.sin(i) * 20, lerp(p[1], S.top - 225 * sc, q) + Math.sin(q * Math.PI) * -30, 8, 4); } }
        if (S.fanOn != null && t > tFan){ const st = sts[S.fanOn], p = handOf(st); for (let i = 0; i < 4; i++){ const q = (t * 2 + i / 4) % 1; ctx2.save(); ctx2.globalAlpha = .6 * (1 - q); ctx2.strokeStyle = "#FFFFFF"; ctx2.lineWidth = 6; ctx2.beginPath(); const xx = lerp(p[0], S.x + 140, q); ctx2.moveTo(xx, p[1] - 40 + i * 20); ctx2.quadraticCurveTo(xx - 30, p[1] - 60 + i * 20, xx - 60, p[1] - 40 + i * 20); ctx2.stroke(); ctx2.restore(); } } },
      envFront: false
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const S = f.stove || {}; add(T(s, S.onCue, .2, i), "whoosh"); [0, 1, 2].forEach(m => add(T(s, S.pourCue, .3, i) + m * .35, "pop")); add(T(s, S.sprinkleCue, .3, i), "chime"); add(T(s, S.fanCue, .3, i), "whoosh"); add(T(s, S.fanCue, .3, i) + .6, "ping"); });

  /* ================= MS35: kelak (time jump through steam) ================= */
  TT.scene(PX + "kelak", "Cerita: lompatan waktu lewat uap serabi, 20 tahun kemudian", (ctx, th, s, t) => {
    const f = s.f || {}, J = Object.assign({ x: 540, top: 1330 }, f.jump || {}), idx = G.scene;
    const tJ = (f.shots && f.shots[0]) ? tOf(s, f.shots[0], .2, idx) : 1e9, fut = t >= tJ;
    const H = {
      spots: { stove: [J.x, J.top - 230], steam: tt => [J.x, J.top - 400 - Math.max(0, tt - (tJ - 1.6)) * 500] },
      back: (ctx2) => { kitchenBack(ctx2, J.top, t, fut); if (fut){ ctx2.save(); ctx2.translate(880, J.top - 380); ctx2.rotate(.03); rr(ctx2, -120, -100, 240, 180, 8); ctx2.fillStyle = "#B5793D"; ctx2.fill(); ol(ctx2, 5);
          ctx2.fillStyle = "#E8D3B0"; ctx2.fillRect(-100, -80, 200, 140); ctx2.filter = "none"; [[-60, "#7A4A2E", 1], [-20, "#C2691F", 1.1], [25, "#E85D9A", .7], [60, "#5B7DB1", .6]].forEach(([dx, cl, sc]) => { ctx2.fillStyle = cl; ctx2.beginPath(); ctx2.ellipse(dx, 60, 18 * sc, 30 * sc, 0, Math.PI, 0); ctx2.fill(); ctx2.beginPath(); ctx2.arc(dx, 60 - 40 * sc, 14 * sc, 0, TAU); ctx2.fillStyle = "#E2A77C"; ctx2.fill(); });
          ctx2.restore(); } },
      front: (ctx2) => { counter(ctx2, J.top, -400, fut ? (J.counterX1 ?? 1500) : 1500, fut); tungku(ctx2, J.x, J.top, t, { fire: .7, batter: [1, 1, 1], puff: fut ? ramp(t, tJ + 1.5, tJ + 3) : 1, sprinkle: fut ? 0 : 1 });
        if (!fut){ drawItem(ctx2, "plate", J.x + 330, J.top - 30, t, { n: 6 });
          for (let i = 0; i < 6; i++){ const q = (t * .45 + i / 6) % 1, k = clamp((t - (tJ - 2.2)) / 1.6, 0, 1); ctx2.save(); ctx2.globalAlpha = .6 * Math.sin(q * Math.PI) + k * .3; puffC(ctx2, J.x + 330 + Math.sin(t * 1.5 + i) * 40 * (1 + k * 3), J.top - 80 - q * (300 + k * 900), 26 + q * 40 + k * 120, "#FFFFFF"); ctx2.restore(); } } },
      shotFx: (ctx2, R) => { const k = t - tJ; if (k > -1.2 && k < 1.3){ const cover = k < 0 ? eOut(clamp((k + 1.2) / 1.2, 0, 1)) : 1 - eOut(clamp(k / 1.3, 0, 1));
          ctx2.save(); ctx2.globalAlpha = cover; ctx2.fillStyle = "#FFFFFF"; ctx2.fillRect(0, 0, 1080, 1920);
          for (let i = 0; i < 14; i++){ puffC(ctx2, rnd(i) * 1080, rnd(i + 4) * 1920 - k * 200, 160 + rnd(i + 8) * 120, "#F4F1EC"); } ctx2.restore(); }
        if (k > -.2 && k < 2.6){ const a = k < 2.2 ? 1 : 1 - (k - 2.2) / .4; ctx2.save(); ctx2.globalAlpha = a; const q = eBack(clamp((k + .2) / .45, 0, 1)); ctx2.translate(540, 620); ctx2.scale(q, q); ctx2.rotate(-.03);
          outlineWords(ctx2, [{ w: J.big || "20 TAHUN", hl: true }], 0, 0, 120, { sw: 28, hl: HL }); outlineWords(ctx2, [{ w: J.small || "KEMUDIAN", hl: false }], 0, 110, 80, { sw: 20 }); ctx2.restore(); } },
      envFront: false
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); if (f.shots && f.shots[0]){ const tj = tOf(s, f.shots[0], .2, i); add(tj - 1.1, "whoosh"); add(tj + .1, "chime"); } });

  /* ================= SB36: tangan (autopilot arm) ================= */
  function deskDrawer(ctx, X, t, open){ const top = GY - 300; ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(X, GY + 6, 320, 20, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8E4E2E"; rr(ctx, X - 290, top + 20, 26, 280, 6); ctx.fill(); ol(ctx, 5);
    rr(ctx, X + 40, top + 20, 240, 280, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
    const ox = open * 90; rr(ctx, X + 52 + ox * .2, top + 50 + ox * .55, 216 + ox * .2, 100, 8); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
    if (open > .1){ ctx.fillStyle = "#5A321C"; rr(ctx, X + 60 + ox * .2, top + 46 + ox * .55 - 30 * open, 200, 30 * open, 4); ctx.fill(); }
    ctx.fillStyle = OUT; rr(ctx, X + 140 + ox * .3, top + 92 + ox * .55, 50, 12, 6); ctx.fill();
    rr(ctx, X + 52, top + 170, 216, 100, 8); ctx.fillStyle = "#B66E40"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; rr(ctx, X + 135, top + 212, 50, 12, 6); ctx.fill();
    rr(ctx, X - 320, top - 10, 640, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); return [X + 160 + ox * .3, top + 60 + ox * .55]; }
  TT.scene(PX + "tangan", "Cerita: tangan otomatis mengambil camilan dari laci", (ctx, th, s, t) => {
    const f = s.f || {}, A = Object.assign({ deskX: 700, on: 0 }, f.arm || {}), idx = G.scene;
    const grabs = (A.grabs || []).map((g, n) => Object.assign({ T0: tOf(s, g, .2 + n * .2, idx) }, g));
    const tOpen = grabs.length ? grabs[0].T0 - .8 : 1e9, open = ramp(t, tOpen, tOpen + .4);
    let wrappers = grabs.filter(g => t > g.T0 + .9).length * (A.wrapMul || 3);
    const tNote = T(s, A.noteCue, .3, idx);
    let drawerP = [0, 0], mouth = [0, 0];
    const H = {
      spots: { drawer: [A.deskX + 160, GY - 220], desk: [A.deskX, GY - 380] },
      back: (ctx2) => { drawerP = deskDrawer(ctx2, A.deskX, t, open);
        prop(ctx2, "desk", -9999, 0, {}, t);
        ctx2.save(); ctx2.translate(A.deskX - 120, GY - 310); drawItem(ctx2, "laptop", 0, 0, t, { s: 1.15 }); ctx2.restore();
        for (let i = 0; i < wrappers; i++){ snack(ctx2, "wrap", A.deskX + 120 + (i % 5) * 34 - (Math.floor(i / 5) * 10), GY - 316 - Math.floor(i / 5) * 18, 1, i * .7); }
        if (t > tNote){ const q = pq(t, tNote, .4); ctx2.save(); ctx2.translate(A.deskX + 20, GY - 520); ctx2.rotate(.08 + Math.sin(t * 2) * .02); ctx2.scale(q, q); rr(ctx2, -100, -70, 200, 140, 6); ctx2.fillStyle = "#FFE45C"; ctx2.fill(); ol(ctx2, 4);
          textC(ctx2, A.noteL1 || "JANJI:", 0, -20, 30, RED, 900, 170); textC(ctx2, A.noteL2 || "KURANGI", 0, 16, 28, BROWN, 900, 170); textC(ctx2, A.noteL3 || "CAMILAN", 0, 50, 28, BROWN, 900, 170); ctx2.restore(); } },
      over1: (ctx2, c, sts, j) => { if (j !== A.on) return; const st = sts[j], u = st.size / 92, f1 = st.face || 1;
        const sh = lp(st, -8, -46 - (st.pose === "sit" ? -13 : 0)), mo = headOf(st); mouth = [mo[0] + 10 * u * f1, mo[1] + 8 * u];
        let hand = null, item = null;
        grabs.forEach(g => { const k = t - g.T0; if (k > -.7 && k < .95){ const out = k < 0 ? eOut(clamp((k + .7) / .7, 0, 1)) : 1 - easeIO(clamp((k - .1) / .7, 0, 1)); const target = k < .1 ? drawerP : null;
          hand = [lerp(mouth[0], drawerP[0], out), lerp(mouth[1], drawerP[1], out) - Math.sin(out * Math.PI) * 120]; if (k > 0) item = g.kind; } });
        if (!hand) return;
        const cx = (sh[0] + hand[0]) / 2, cy = Math.min(sh[1], hand[1]) - 160 * u / 8;
        ctx2.save(); ctx2.lineCap = "round"; ctx2.strokeStyle = OUT; ctx2.lineWidth = 8.5 * u; ctx2.beginPath(); ctx2.moveTo(sh[0], sh[1]); ctx2.quadraticCurveTo(cx, cy, hand[0], hand[1]); ctx2.stroke();
        ctx2.strokeStyle = hexA(HL, .95); ctx2.lineWidth = 6.5 * u; ctx2.stroke();
        ctx2.setLineDash([2 * u, 4 * u]); ctx2.strokeStyle = "rgba(255,255,255,.6)"; ctx2.lineWidth = 1.2 * u; ctx2.stroke(); ctx2.setLineDash([]);
        ctx2.beginPath(); ctx2.arc(hand[0], hand[1], 5 * u, 0, TAU); ctx2.fillStyle = "#F0C29A"; ctx2.fill(); ol(ctx2, 1.4 * u);
        if (item) snack(ctx2, item, hand[0], hand[1] - 4 * u, .7 * u / 8.2, Math.sin(t * 8) * .2);
        ctx2.restore();
        grabs.forEach(g => { const k = t - g.T0 - .8; if (k > 0 && k < .5){ for (let i = 0; i < 8; i++){ const a = i / 8 * TAU; ctx2.fillStyle = "#E7B66A"; ctx2.fillRect(mouth[0] + Math.cos(a) * k * 200, mouth[1] + Math.sin(a) * k * 160 + k * k * 300, 9, 9); } } }); },
      over: (ctx2, c) => { grabs.forEach((g, n) => { const k = t - g.T0 - .8; if (k > 0 && k < 1){ const p = c.toScreen(mouth[0], mouth[1] - 200, 1); popWord(ctx2, "NYAM!", clamp(p[0] + 120, 220, 860), clamp(p[1], 300, 1150), k, { size: 80, hold: .95, rot: n % 2 ? 8 : -8 }); } });
        grabs.forEach((g, n) => { if (!g.label || t < g.T0) return; const nx = grabs[n + 1]; if (nx && t > nx.T0) return; if (t > g.T0 + 1.6) return; popChip(ctx2, g.label, 540, 300, t - g.T0, ORANGE, "#FFFFFF", 46, -.04); }); }
    };
    base(ctx, s, t, H);
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const A = f.arm || {}; (A.grabs || []).forEach((g, n) => { const t0 = tOf(s, g, .2 + n * .2, i); add(t0 - .6, "whoosh"); add(t0, "pop"); add(t0 + .8, "pop"); }); if (A.noteCue) add(T(s, A.noteCue, .3, i), "ping"); });

  /* ================= SB36: perosotan (slide / shelf obstacle) ================= */
  function slidePt(o, u){ const P0 = [o.topX + 80, o.topY], P1 = [o.topX + 360, o.topY + 40], P2 = [o.botX - 300, GY - 40], P3 = [o.botX, GY - 60]; const m = 1 - u;
    return [m * m * m * P0[0] + 3 * m * m * u * P1[0] + 3 * m * u * u * P2[0] + u * u * u * P3[0], m * m * m * P0[1] + 3 * m * m * u * P1[1] + 3 * m * u * u * P2[1] + u * u * u * P3[1]]; }
  function slideDraw(ctx, o, t){ const P = []; for (let i = 0; i <= 30; i++) P.push(slidePt(o, i / 30));
    // ladder + platform
    ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 16; ctx.lineCap = "round"; [o.topX - 90, o.topX + 70].forEach(x => { ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, o.topY + 10); ctx.stroke(); });
    ctx.lineWidth = 10; for (let y = GY - 70; y > o.topY + 30; y -= 90){ ctx.beginPath(); ctx.moveTo(o.topX - 90, y); ctx.lineTo(o.topX + 70, y); ctx.stroke(); }
    rr(ctx, o.topX - 120, o.topY, 220, 30, 8); ctx.fillStyle = "#3E9B5A"; ctx.fill(); ol(ctx, 5);
    // chute
    ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 96; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    ctx.strokeStyle = "#E8B23A"; ctx.lineWidth = 84; ctx.stroke(); ctx.strokeStyle = "#FFD45C"; ctx.lineWidth = 40; ctx.stroke();
    for (let i = 0; i < 4; i++){ const q = ((t * 1.4 + i / 4) % 1), p = slidePt(o, q); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.ellipse(p[0], p[1] - 10, 22, 6, .3, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 12; [.35, .7].forEach(u => { const p = slidePt(o, u); ctx.beginPath(); ctx.moveTo(p[0], p[1] + 40); ctx.lineTo(p[0], GY); ctx.stroke(); });
    if (o.sign){ const p = slidePt(o, .42); ctx.save(); ctx.translate(p[0], p[1] - 110); ctx.rotate(.22); rr(ctx, -170, -40, 340, 80, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, o.sign, 0, 14, 34, "#FFFFFF", 900, 310); ctx.restore(); } }
  function snackPit(ctx, x, t, k){ ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 260, 26, 0, 0, TAU); ctx.fill();
    const kinds = ["chips", "choco", "candy"]; for (let i = 0; i < 22; i++){ const row = Math.floor(i / 7), px = x - 210 + (i % 7) * 70 + (row % 2) * 30, py = GY - 30 - row * 50, j = k > 0 && k < .8 ? Math.sin(k * 12 + i) * 30 * (1 - k / .8) : 0;
      snack(ctx, kinds[i % 3], px, py - Math.abs(j), .75, Math.sin(i * 1.3) * .5 + j * .01); } }
  function shelf(ctx, x, top, t, o){ const lv = [GY, GY - 470, GY - 940, top];
    ctx.fillStyle = "#8E4E2E"; [-240, 220].forEach(dx => { rr(ctx, x + dx, top - 30, 24, GY - top + 30, 6); ctx.fill(); ol(ctx, 5); });
    lv.slice(1).forEach((y, i) => { rr(ctx, x - 260, y, 520, 26, 6); ctx.fillStyle = "#B5793D"; ctx.fill(); ol(ctx, 5);
      if (i < 2){ ["#E9E4DA", "#F3D9B5", "#9FD3E8"].forEach((cl, j) => { rr(ctx, x - 200 + j * 150, y - 130, 110, 130, 10); ctx.fillStyle = cl; ctx.fill(); ol(ctx, 4); }); } });
    // the box with tape on top
    const bx = x, by = top, w = 280, h = 200, jig = o.jig ? Math.sin(t * 20) * 3 : 0; ctx.save(); ctx.translate(bx + jig, by);
    rr(ctx, -w / 2, -h, w, h, 10); ctx.fillStyle = "#C9925E"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#B07A47"; ctx.fillRect(-w / 2, -h, w, 40);
    ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = "#E3C27A"; ctx.save(); ctx.translate(0, -100); ctx.rotate(.55); ctx.fillRect(-190, -20, 380, 40); ctx.rotate(-1.1); ctx.fillRect(-190, -20, 380, 40); ctx.restore(); ctx.restore();
    rr(ctx, -110, -96, 220, 56, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "CAMILAN", 0, -56, 36, BROWN, 900, 200);
    ctx.restore(); }
  TT.scene(PX + "perosotan", "Cerita: perosotan kebiasaan buruk / rak tinggi penuh rintangan", (ctx, th, s, t) => {
    const f = shotOf(s, t).F, O = Object.assign({ mode: "licin", topX: 260, topY: 1000, botX: 860 }, f.slide || {}), idx = G.scene;
    if (O.mode === "licin"){
      const tSl = T(s, O.slideCue, .3, idx), D = O.dur || 1.1, rider = O.rider ?? 0;
      const u = t < tSl ? 0 : Math.min(1, Math.pow((t - tSl) / D, 1.6)), land = t - tSl - D;
      const H = {
        spots: { top: [O.topX, O.topY - 260], pit: [O.botX + 60, GY - 300] },
        adjust: (sts, ff, tt) => { const st = sts[rider]; if (!st) return; const uu = tt < tSl ? 0 : Math.min(1, Math.pow((tt - tSl) / D, 1.6)); const p = slidePt(O, uu);
          st.x = p[0] + (uu >= 1 ? 30 : 0); st.y = p[1] + (uu >= 1 ? 30 : 4); if (uu > 0 && uu < 1) st.chairTilt = .3; },
        back: (ctx2) => { slideDraw(ctx2, Object.assign({ sign: O.sign }, O), t); snackPit(ctx2, O.botX + 60, t, land); if (O.pitSign) { ctx2.save(); ctx2.translate(O.botX + 300, GY - 300); rr(ctx2, -110, -36, 220, 72, 12); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 5); textC(ctx2, O.pitSign, 0, 13, 32, BROWN, 900, 200); ctx2.restore(); ctx2.fillStyle = "#7A4A2E"; ctx2.fillRect(O.botX + 293, GY - 264, 14, 264); } },
        front: (ctx2, c, sts) => { const st = sts[rider]; if (!st || u <= 0 || u >= 1) return; for (let i = 0; i < 6; i++){ const p = slidePt(O, Math.max(0, u - .04 - i * .03)); ctx2.save(); ctx2.globalAlpha = .5 * (1 - i / 6); ctx2.strokeStyle = "#FFFFFF"; ctx2.lineWidth = 8; ctx2.beginPath(); ctx2.moveTo(p[0] - 40, p[1] - 200 - i * 10); ctx2.lineTo(p[0] - 120, p[1] - 220 - i * 10); ctx2.stroke(); ctx2.restore(); } },
        over: (ctx2, c) => { if (t > tSl && t < tSl + 1.2) popWord(ctx2, O.whoosh || "WUSSS!", 560, 520, t - tSl, { size: 110, hold: 1.2, rot: -8 }); if (land > 0 && land < 1.2) popWord(ctx2, O.landWord || "NYAM!", 760, 760, land, { size: 96, hold: 1.1, rot: 6 }); },
        envFront: false
      };
      base(ctx, s, t, H);
    } else {
      const X = O.shelfX ?? 720, top = O.top ?? 400; const steps = (O.steps || []).map((st, n) => Object.assign({ T0: tOf(s, st, .3, idx) }, st));
      const H = {
        spots: { box: [X, top - 160], mid: [X, 1000] },
        back: (ctx2) => { shelf(ctx2, X, top, t, { jig: steps.some(st => t > st.T0 && t < st.T0 + .5) });
          // tall ladder leaning on the shelf
          ctx2.save(); ctx2.translate(X - 330, GY); ctx2.rotate(.13); ctx2.strokeStyle = "#9B6A3C"; ctx2.lineWidth = 16; ctx2.lineCap = "round"; [-50, 50].forEach(dx => { ctx2.beginPath(); ctx2.moveTo(dx, 0); ctx2.lineTo(dx, -(GY - top) - 40); ctx2.stroke(); });
          ctx2.lineWidth = 10; for (let y = -80; y > -(GY - top); y -= 100){ ctx2.beginPath(); ctx2.moveTo(-50, y); ctx2.lineTo(50, y); ctx2.stroke(); } ctx2.restore();
          // dotted route
          const pts = [[X - 420, GY - 120], [X - 330, GY - 700], [X - 230, top - 120], [X, top - 120]]; ctx2.save(); ctx2.setLineDash([24, 20]); ctx2.lineDashOffset = -t * 60; ctx2.strokeStyle = hexA(RED, .85); ctx2.lineWidth = 9;
          const pr = ramp(t, steps[0] ? steps[0].T0 : 1e9, steps.length ? steps[steps.length - 1].T0 + .5 : 1e9); if (pr > 0){ ctx2.beginPath(); pts.forEach((p, i) => i ? ctx2.lineTo(p[0], p[1]) : ctx2.moveTo(p[0], p[1])); ctx2.stroke(); } ctx2.restore();
          steps.forEach((st, n) => { const k = t - st.T0; if (k < 0) return; const p = st.at2 || [[X - 330, GY - 700], [X - 120, top - 300], [X + 150, top - 120]][n] || [X, top]; const q = eBack(clamp(k / .4, 0, 1));
            ctx2.save(); ctx2.translate(p[0], p[1]); ctx2.scale(q, q); ctx2.beginPath(); ctx2.arc(-150, 0, 40, 0, TAU); ctx2.fillStyle = RED; ctx2.fill(); ol(ctx2, 5); textC(ctx2, String(n + 1), -150, 14, 42, "#FFFFFF", 900);
            rr(ctx2, -105, -40, 300, 80, 16); ctx2.fillStyle = PAPER; ctx2.fill(); ol(ctx2, 5); textC(ctx2, st.text, 45, 13, 34, BROWN, 900, 270); ctx2.restore(); }); },
        envFront: true
      };
      base(ctx, s, t, H);
    }
  }, (s, f, i, add) => { sfxBase(s, f, i, add); const O = f.slide || ((f.shots || []).find(x => x.slide) || {}).slide || {}; if (O.slideCue){ add(T(s, O.slideCue, .3, i), "whoosh"); add(T(s, O.slideCue, .3, i) + (O.dur || 1.1), "pop"); } (O.steps || []).forEach(st => add(tOf(s, st, .3, i), "pop")); });
})();
