/* Scene pack j2611221424543: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SB44, SP44, RN44, KD44, JS44.
   Layout prefix j2611221424543_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots    [{at|cue, env, envOpt, toons, cam, props, cards, chips, ...}]  hard cut (cream flash) to a new shot inside one scene
     hold     [{on, kind, at|cue, outCue, s, dx, dy, rot, text}]  object in a toon's hand: phone, doc, whistle, torch, knife, binder, scoop, sketch
     chips    [{at|cue, outCue, text, x, y, bg, fg, size, rot}]   screen chips          pops [{at|cue, text, x, y, size, rot, col}]
     stamps   [{at|cue, text, x, y, col, size, rot}]  framed stamp + burst            badges [{on, at|cue, outCue, text, col}] chip over a toon
     confetti {at|cue}
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _boneka   puppet booth in the office: the boss watches a cheerful puppet ("AMAN, BU!"); cut behind the booth: the real
               worker holds the puppet stick in panic, papers fly, red siren, DATA VENDOR 0 note      f.side front|back, f.chaosCue
     _lengan   the surprised boss sprouts three helping arms from her back (phone the vendor, extra person, shift the schedule),
               the phone rings, the arms droop because it is too late                                 f.arms {on, litCue, ringCue, droopCue, items:[{kind, label}]}
     _suar     night forest: a rescue helicopter (the boss in the cockpit) sweeps its searchlight in the dark; the worker fires
               three flares PROGRES / KENDALA / KEBUTUHAN, the light locks on, rope ladder drops     f.sar {heliCue, flares:[{cue,label}], lockCue, hijab}
     _skor     split-flap board in the office at night: date, target and actual flip into place      f.board {rows:[{cue, label, val, bad}]}
     _kancing  giant shirt on a hanger: one button in the wrong hole spotted at the first button (fixed alone) vs at the
               last button (every button pops open again)                                            f.btn {wrongCue, spotCue, fixCue, lateCue, redoCue}
     _ronda    village watch post at dusk: weekly score board, wooden slit drum struck, the number climbs back  f.post {rows, hitCue, fixCue}
     _kaca     home at night: the monthly target written with a marker on the window glass, crossed out, split into four weeks   f.glass {lines:[{cue,text,x,y,size,col,strike}], arrowCue}
     _usul     meeting table: two event dioramas pop up (loud concert stage vs calm picnic) and bounce   f.mock {stageCue, picnicCue, heatCue}
     _landasan a KUNO anvil drops on the colleague's head (not on the idea): BONK, stars, grey silence, the picnic idea sinks
               into the table with a tiny IDE SARI tombstone                                         f.anv {to, dropCue, greyCue, text}, f.mock {sinkCue}
     _tigad    giant 3D glasses: red lens (stage) + blue lens (tree), snapped together the merged diorama pops out   f.g3 {redCue, blueCue, joinCue}
     _acara    rule board SERANG IDENYA, BUKAN ORANGNYA / dusk park event: string lights, KONSER SENJA stage, picnic mats, crowd   f.rule, f.ev, shot.park
     _meteor   the 40-page minutes crash onto the desk like a meteor (fire trail, crater cracks, dust, papers)   f.met {dropCue, tagCue, label}
     _peras    AI juicer: pages fly into the hopper, 10-second ring, press squeezes one glass of summary f.juice {feedCue, countCue, pressCue}
     _jaring   beach: a net hauled from the sea; big fish stay, three small gold fish (ANGKA, TANGGAL, KEPUTUSAN) slip
               through the mesh, then jump into the original document                              f.net {upCue, fish:[{cue,label}], checkCue}
     _stabilo  home at night: floating summary sheet, giant highlighter marks three lines, the strips fly into the original
               binder as page tabs, send button                                                      f.hl {lines:[{text, cue}], matchCue, sendCue}
     _truk     delivery truck cut-away: mugs with faces rattle over a bump and crack; complaint counter   f.truck {bumpCue, countCue, leaveCue}
     _peluit   warehouse racks: workers rush with boxes, whistle, everyone freezes, whiteboard rolls in   f.wh {whistleCue, freezeCue, boardCue}
     _mug      lab: cut-away shipping box, crammed mugs in one thin wrap, no dividers, they knock and crack   f.box {crackCue, wrapCue, wallCue, bumpCue}
     _kapsul   packing desk: every mug gets its own capsule room, two blankets, a PECAH BELAH door tag, sleeps; shot.home:
               the customer's parcel opens and a happy mug hops out, five stars                      f.cap {wrapCue, wallCue, tagCue, openCue, starCue}
     _kitiran  dusk hills: the hero holds a giant paper pinwheel; its three blades APA / KENAPA / UBAH light up one by one,
               then the wind spins it fast, LEBIH BAIK                                               f.pin {cues, x, y, r, spinDelay} */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424543_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const pin = (t, T0, d) => t < T0 ? 0 : eBack(clamp((t - T0) / (d || .4), 0, 1));
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
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, Math.min(1, a))); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); const sz = fit(ctx, txt, 760, size, 900, 30);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; size = fit(ctx, txt, maxW || 860, size, 800); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); font(ctx, 800, size || 34, FAM);
    const w = ctx.measureText(txt).width + (size || 34) * 1.1; x = clamp(x, 70 + w / 2, 1010 - w / 2);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.moveTo(x + Math.cos(a) * r * .6 + r * .55, y + Math.sin(a) * r * .45); ctx.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .45, r * .55, 0, TAU); } ctx.fillStyle = col; ctx.fill(); }
  function check(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }
  function cross(ctx, x, y, r, col, lw){ ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke(); ctx.restore(); }
  function papers(ctx, t, n, seed, x0, y0, w, h, sp){ for (let i = 0; i < n; i++){ const q = ((t * (sp || .35) + rnd(i + seed)) % 1), x = x0 + rnd(i + seed + 7) * w + Math.sin(t * 2 + i) * 50, y = y0 + h - q * h;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * (1.5 + rnd(i)) + i); ctx.globalAlpha *= Math.sin(q * Math.PI); ctx.fillStyle = PAPER; ctx.fillRect(-36, -46, 72, 92); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-36, -46, 72, 92);
      ctx.fillStyle = "#C9B9A2"; for (let l = 0; l < 4; l++) ctx.fillRect(-24, -30 + l * 18, 48 - (l % 2) * 14, 6); ctx.restore(); } }

  /* ---------- small objects (world, origin = hand) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "phone"){ ctx.rotate(-.15); rr(ctx, -40, -80, 80, 150, 14); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); rr(ctx, -32, -70, 64, 128, 8); ctx.fillStyle = o.col || "#BFE2EA"; ctx.fill();
      ctx.fillStyle = hexA(ORANGE, .85); for (let k = 0; k < 3; k++) rr(ctx, -24, -60 + k * 30, 30 + ((k * 13 + Math.floor(t * 3)) % 20), 14, 6), ctx.fill();
      if (o.ring){ for (let k = 0; k < 3; k++){ const q = (t * 1.6 + k / 3) % 1; ctx.globalAlpha = 1 - q; ctx.strokeStyle = HL; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -10, 70 + q * 70, -.9, .9); ctx.stroke(); } ctx.globalAlpha = 1; } }
    else if (kind === "doc"){ ctx.rotate(-.08); rr(ctx, -80, -110, 160, 210, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#C9B9A2"; for (let l = 0; l < 6; l++) ctx.fillRect(-60, -84 + l * 26, 120 - (l % 3) * 26, 9);
      if (o.text){ textC(ctx, o.text, 0, 70, o.size || 48, o.col || RED, 900, 140); } }
    else if (kind === "binder"){ ctx.rotate(-.06); rr(ctx, -90, -120, 180, 230, 10); ctx.fillStyle = o.col || TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, -70, -100, 140, 70, 6); ctx.fillStyle = PAPER; ctx.fill(); textC(ctx, o.text || "ASLI", 0, -54, 34, BROWN, 900, 124);
      ctx.fillStyle = PAPER; for (let k = 0; k < 6; k++) ctx.fillRect(84, -110 + k * 36, 10, 26); }
    else if (kind === "whistle"){ ctx.rotate(-.2); rr(ctx, -10, -18, 70, 36, 14); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(54, 0, 26, 0, TAU); ctx.fillStyle = "#DADFE6"; ctx.fill(); ol(ctx, 4);
      if (o.blow){ for (let k = 0; k < 3; k++){ const q = (t * 2.4 + k / 3) % 1; ctx.globalAlpha = 1 - q; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(-20, 0, 30 + q * 90, Math.PI - .7, Math.PI + .7); ctx.stroke(); } ctx.globalAlpha = 1; } }
    else if (kind === "torch"){ ctx.rotate(-.3); rr(ctx, -16, -20, 90, 40, 10); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(74, -26); ctx.lineTo(104, -36); ctx.lineTo(104, 36); ctx.lineTo(74, 26); ctx.closePath(); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4);
      ctx.save(); ctx.globalAlpha = .28 + .05 * Math.sin(t * 9); ctx.fillStyle = "#FFF1B8"; ctx.beginPath(); ctx.moveTo(104, -30); ctx.lineTo(560, -170); ctx.lineTo(560, 170); ctx.lineTo(104, 30); ctx.closePath(); ctx.fill(); ctx.restore(); }
    else if (kind === "knife"){ ctx.rotate(-.6 + (o.cut ? Math.sin(t * 12) * .25 : 0)); rr(ctx, -16, -12, 70, 24, 8); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.moveTo(54, -12); ctx.lineTo(190, -6); ctx.quadraticCurveTo(196, 8, 180, 12); ctx.lineTo(54, 12); ctx.closePath(); ctx.fillStyle = "#E6EAF0"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "scoop"){ ctx.rotate(-.9); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -230); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -300, 60, 74, 0, 0, TAU); ctx.strokeStyle = "#3B4A6B"; ctx.lineWidth = 8; ctx.stroke();
      ctx.save(); ctx.clip(); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 2; for (let k = -4; k <= 4; k++){ ctx.beginPath(); ctx.moveTo(k * 16, -380); ctx.lineTo(k * 16, -220); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-70, -300 + k * 16); ctx.lineTo(70, -300 + k * 16); ctx.stroke(); } ctx.restore(); }
    else if (kind === "box"){ ctx.rotate(-.04); rr(ctx, -90, -90, 180, 130, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-90, -58); ctx.lineTo(90, -58); ctx.moveTo(0, -90); ctx.lineTo(0, -58); ctx.stroke(); }
    else if (kind === "sketch"){ ctx.rotate(-.05); rr(ctx, -120, -150, 240, 180, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -60, -120, 120, 120, 8); ctx.fillStyle = "#E8A55B"; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.ellipse(0, -60, 26, 40, .5, 0, TAU); ctx.fill(); }
    ctx.restore(); }

  /* ---------- characters made of things ---------- */
  // mug with a face; y = bottom. o: {col, face: happy|scared|hurt|sleep|neutral, crack 0..1, wrap 0|1|2, seed, tilt}
  function mugChar(ctx, x, y, s, t, o){
    o = o || {}; const sd = o.seed || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt || 0); ctx.scale(s, s);
    const col = o.col || "#F3E2C7", w = 110, h = 130;
    ctx.strokeStyle = OUT; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(w / 2, -h / 2, 34, -1.2, 1.2); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.stroke();
    rr(ctx, -w / 2, -h, w, h, [10, 10, 22, 22]); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.ellipse(0, -h, w / 2, 12, 0, 0, TAU); ctx.fillStyle = "#6B3A22"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA(o.band || ORANGE, .9); ctx.fillRect(-w / 2 + 3, -h * .32, w - 6, 14);
    const fc = o.face || "neutral", ey = -h * .62, bl = ((t + sd * .7) % 3.3) < .13;
    if (fc === "sleep"){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(d * 22, ey, 10, .1 * Math.PI, .9 * Math.PI); ctx.stroke(); });
      for (let k = 0; k < 2; k++){ const q = (t * .6 + k / 2 + sd * .3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); textC(ctx, "z", 40 + q * 40, -h - 20 - q * 70, 30 + k * 8, "#FFFFFF", 900); ctx.restore(); } }
    else { [-1, 1].forEach(d => { const sc = fc === "scared" || fc === "hurt" ? 1.25 : 1; ctx.beginPath(); ctx.ellipse(d * 22, ey, 11 * sc, (bl ? 2 : 13) * sc, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3);
      if (!bl){ ctx.beginPath(); ctx.arc(d * 22 + (fc === "scared" ? Math.sin(t * 30) * 2 : 2), ey + 2, fc === "scared" ? 4 : 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); } }); }
    ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath();
    if (fc === "happy" || fc === "sleep") ctx.arc(0, -h * .42, 16, .15 * Math.PI, .85 * Math.PI);
    else if (fc === "scared"){ for (let k = 0; k <= 4; k++) ctx.lineTo(-18 + k * 9, -h * .36 + (k % 2 ? -6 : 4)); }
    else if (fc === "hurt"){ ctx.ellipse(0, -h * .36, 10, 13, 0, 0, TAU); ctx.fillStyle = "#6B2A22"; ctx.fill(); }
    else { ctx.moveTo(-12, -h * .38); ctx.lineTo(12, -h * .38); }
    ctx.stroke();
    if (fc === "scared" || fc === "hurt"){ ctx.fillStyle = "#8FD3E8"; ctx.beginPath(); ctx.ellipse(-w / 2 - 6, -h * .8 + ((t * 2 + sd) % 1) * 30, 7, 11, 0, 0, TAU); ctx.fill(); }
    if ((o.crack || 0) > 0){ const q = clamp(o.crack, 0, 1); ctx.save(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); const pts = [[-30, -h], [-18, -h + 30], [-34, -h + 52], [-12, -h + 80], [-26, -h + 110]];
      const nPts = 1 + Math.floor(q * (pts.length - 1)); ctx.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k <= nPts && k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]); ctx.stroke(); ctx.restore(); }
    const wr = o.wrap || 0;
    if (wr >= 1){ ctx.save(); ctx.globalAlpha *= .55; rr(ctx, -w / 2 - 12, -h * .9, w + 24, h * .55, 14); ctx.fillStyle = "#CFEAF5"; ctx.fill(); ctx.globalAlpha = 1; ol(ctx, 3, "#7FB8CC");
      ctx.fillStyle = hexA("#FFFFFF", .8); for (let k = 0; k < 8; k++){ ctx.beginPath(); ctx.arc(-w / 2 + 2 + (k % 4) * 34, -h * .8 + Math.floor(k / 4) * 30, 6, 0, TAU); ctx.fill(); } ctx.restore(); }
    if (wr >= 2){ ctx.save(); rr(ctx, -w / 2 - 20, -h * .38, w + 40, h * .42, 16); ctx.fillStyle = o.blanket || "#E07A9B"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 5; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(-w / 2 - 8 + k * 38, -h * .34); ctx.lineTo(-w / 2 + 8 + k * 38, -h * .02); ctx.stroke(); } ctx.restore(); }
    ctx.restore(); }
  // caterpillar on a leaf; x,y = middle; s scale
  function ulat(ctx, x, y, s, t, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); const n = 6, ph = t * (o.fast ? 9 : 5) + (o.seed || 0);
    for (let i = n - 1; i >= 0; i--){ const xx = -i * 26, yy = -Math.max(0, Math.sin(ph - i * .7)) * 12; ctx.beginPath(); ctx.arc(xx, yy, 18, 0, TAU); ctx.fillStyle = i % 2 ? "#7CC254" : "#8ED063"; ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.arc(xx, yy + 18, 4, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
    const hy = -Math.max(0, Math.sin(ph)) * 12 - 6; ctx.beginPath(); ctx.arc(14, hy, 22, 0, TAU); ctx.fillStyle = "#9BDC6E"; ctx.fill(); ol(ctx, 4);
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(14 + d * 9, hy - 6, 6, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.beginPath(); ctx.arc(16 + d * 9, hy - 5, 3, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(8, hy - 20); ctx.lineTo(2, hy - 38); ctx.moveTo(20, hy - 20); ctx.lineTo(26, hy - 38); ctx.stroke();
    if (o.chew){ const m = Math.abs(Math.sin(t * 14)); ctx.beginPath(); ctx.ellipse(24, hy + 8, 7, 2 + m * 6, 0, 0, TAU); ctx.fillStyle = "#4A2018"; ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(18, hy + 6, 6, .1 * Math.PI, .9 * Math.PI); ctx.stroke(); }
    ctx.restore(); }
  // fish; x,y centre; label shown on the body
  function fishDraw(ctx, x, y, s, t, col, label, o){
    o = o || {}; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (o.flip ? -1 : 1), s); const wag = Math.sin(t * 10 + (o.seed || 0)) * .25;
    if (o.glow) glowAt(ctx, 0, 0, 160, GOLD, .45 + .15 * Math.sin(t * 6));
    ctx.save(); ctx.translate(-88, 0); ctx.rotate(wag); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -44); ctx.lineTo(-48, 0); ctx.lineTo(-60, 44); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, 100, 56, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.arc(58, -14, 13, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(61, -13, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(80, 14, 9, .2 * Math.PI, .9 * Math.PI); ctx.stroke();
    if (label){ ctx.save(); if (o.flip) ctx.scale(-1, 1); textC(ctx, label, o.flip ? 10 : -10, 13, 34, o.ink || BROWN, 900, 150); ctx.restore(); }
    ctx.restore(); }
  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    const R = { f, shotT, sts, m: [] };
    if (H.mod) H.mod(sts, f, R);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    R.c = c;
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    env(ctx, E, t, c, eo);
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9) }, h));
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, t, { st });
      const r = R[j];
      if (r) layer(ctx, c, 1, () => {
        holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
          drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0) - (st.y - r.y), t, Object.assign({}, h, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : (st.face || 1), rot: (h.rot || 0) })); });
      });
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, p[0] + (b.dx || 0), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180)); });
    (f.chips || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .08, idx), O = p.outCue ? T(s, p.outCue, .6, idx) : (p.out ?? 1e9); if (t < T0 || t > O + .3) return;
      ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1); popChip(ctx, p.text, p.x ?? 540, (p.y ?? 330) + Math.sin(t * 2 + n) * 4, t - T0, p.bg || PAPER, p.fg || BROWN, p.size || 40, (p.rot ?? 0) * Math.PI / 180); ctx.restore(); }); });
    (f.stamps || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx), O = p.outCue ? T(s, p.outCue, .6, idx) : 1e9; if (t < T0 || t > O + .3) return; const x = p.x ?? 540, y = p.y ?? 600;
      ovs.push(() => { ctx.save(); ctx.globalAlpha *= 1 - clamp((t - O) / .3, 0, 1); stampBox(ctx, p.text, x, y, t - T0, p.col || ORANGE, p.size || 60, (p.rot ?? -8) * Math.PI / 180); burstFx(ctx, x, y, t - T0 - .1, p.col || HL, 12, 200); ctx.restore(); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return R;
  }
  function sfxBase(s, f0, i, add){
    const all = [f0].concat(f0.shots || []);
    all.forEach((f, n) => {
      const k2 = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
      if (n > 0) add(tOf(s, f, .2, i), "whoosh");
      if (n === 0 || f.cam !== f0.cam) (f.cam || []).forEach((k, j) => { if (k.shake) add(k2(k, j), "pop"); if (k.cut && k2(k, j) > .2) add(k2(k, j), "whoosh"); });
      if (n === 0 || f.toons !== f0.toons) (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const t0 = k2(k, j); if (k.say != null) add(t0, "pop"); if (k.jump) add(t0 + .13, "whoosh"); if (k.expr === "shock") add(t0, "ping"); if (k.emote === "idea" || k.emote === "check") add(t0, "chime"); }));
      if (n === 0 || f.cards !== f0.cards) (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
      (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); });
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      if (n === 0 || f.chips !== f0.chips) (f.chips || []).forEach((p, n2) => { if (p.cue || p.at != null) add(tOf(s, p, .3 + n2 * .08, i), "pop"); });
      if (n === 0 || f.stamps !== f0.stamps) (f.stamps || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i) + .05, "chime"));
      if (n === 0 || f.pops !== f0.pops) (f.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    });
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const sfxWith = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); fn(s, f, i, add); };

  /* ================= _adegan ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda di tangan, chip, kata pop, stempel, konfeti, potong shot)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= _boneka: puppet booth / backstage ================= */
  TT.scene(PX + "boneka", "Cerita: panggung boneka \"aman, Bu\" lalu di balik layar (panik, kertas, sirene)", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, B = Object.assign({ x0: 170, x1: 650, top: 620, sill: 1180 }, f0.booth || {}), tCh = T(s, f0.chaosCue, .6, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010, rug: false },
      spots: { stage: [(B.x0 + B.x1) / 2, 930, 1.2] },
      back: (ctx2, c, sts, R) => { const back = R.f.side === "back", xm = (B.x0 + B.x1) / 2;
        if (!back){
          // pillars + header + dark opening
          ctx.fillStyle = "#1B2438"; ctx.fillRect(B.x0, B.top, B.x1 - B.x0, B.sill - B.top);
          for (let i = 0; i < 9; i++){ ctx.fillStyle = hexA("#F6D36B", .25 + .2 * Math.sin(t * 3 + i)); ctx.beginPath(); ctx.arc(B.x0 + 40 + i * 50, B.top + 60 + (i % 3) * 30, 4, 0, TAU); ctx.fill(); }
          glowAt(ctx, xm, B.sill - 80, 260, "#FFE3A8", .3);
        } else {
          ctx.fillStyle = "#5A3A2A"; ctx.fillRect(xm - 420, B.top - 80, 840, 70); ol(ctx, 5);
          // red siren
          const sx = xm + 300, sy = B.top - 120; glowAt(ctx, sx + Math.cos(t * 8) * 120, sy + 40, 320, "#FF4A3A", .35); rr(ctx, sx - 40, sy - 10, 80, 60, 20); ctx.fillStyle = Math.sin(t * 16) > 0 ? "#FF5A4A" : "#B42A22"; ctx.fill(); ol(ctx, 5);
        } },
      front: (ctx2, c, sts, R) => { const back = R.f.side === "back", xm = (B.x0 + B.x1) / 2;
        if (!back){
          // curtains
          [-1, 1].forEach(d => { const x = d < 0 ? B.x0 : B.x1, sw = Math.sin(t * 1.7 + d) * 10; ctx.beginPath(); ctx.moveTo(x, B.top); ctx.lineTo(x - d * 110 + sw, B.top);
            ctx.quadraticCurveTo(x - d * 60 + sw, B.top + 300, x - d * 20, B.sill); ctx.lineTo(x, B.sill); ctx.closePath(); ctx.fillStyle = "#A8343F"; ctx.fill(); ol(ctx, 4); });
          // lower panel
          rr(ctx, B.x0 - 30, B.sill - 10, B.x1 - B.x0 + 60, GY - B.sill + 10, 8); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 6);
          rr(ctx, B.x0, B.sill + 30, B.x1 - B.x0, 160, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); textC(ctx, "PROYEK YUSUF", xm, B.sill + 128, 54, BROWN, 900, B.x1 - B.x0 - 40);
          for (let i = 0; i < 5; i++) sparkle(ctx, B.x0 + 30 + i * (B.x1 - B.x0 - 60) / 4, B.sill + 250, 14 + 4 * Math.sin(t * 4 + i), GOLD);
          // side pillars + header with scallops
          ctx.fillStyle = "#8E4E2E"; ctx.fillRect(B.x0 - 30, B.top - 40, 30, B.sill - B.top + 40); ctx.fillRect(B.x1, B.top - 40, 30, B.sill - B.top + 40);
          rr(ctx, B.x0 - 50, B.top - 150, B.x1 - B.x0 + 100, 130, 14); ctx.fillStyle = "#7A1F2B"; ctx.fill(); ol(ctx, 6); textC(ctx, "PANGGUNG LAPORAN", xm, B.top - 68, 44, GOLD, 900, B.x1 - B.x0);
          for (let i = 0; i < 8; i++){ const x = B.x0 - 50 + i * (B.x1 - B.x0 + 100) / 8; ctx.beginPath(); ctx.arc(x + (B.x1 - B.x0 + 100) / 16, B.top - 20, (B.x1 - B.x0 + 100) / 16, 0, Math.PI); ctx.fillStyle = i % 2 ? CREAM : "#E8A55B"; ctx.fill(); ol(ctx, 3); }
        } else {
          // back side of the booth: plain planks hide the worker's legs; puppet stick
          const st = sts[0]; if (st){ const h = handOf(st); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(h[0] + 10, h[1] - 120); ctx.stroke(); }
          for (let i = 0; i < 9; i++){ ctx.fillStyle = i % 2 ? "#8E5A34" : "#9C673D"; ctx.fillRect(xm - 430 + i * 96, 1290, 96, GY - 1290); } ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(xm - 430, 1290, 864, GY - 1290);
          const k = t - tCh; if (k > 0){ ctx.save(); ctx.translate(xm + 300, 820); ctx.rotate(.08 + Math.sin(t * 3) * .03); const q = eBack(clamp(k / .4, 0, 1)); ctx.scale(q, q);
            rr(ctx, -150, -90, 300, 180, 10); ctx.fillStyle = "#FFF1A8"; ctx.fill(); ol(ctx, 5); textC(ctx, "DATA VENDOR", 0, -30, 36, BROWN, 900, 260); textC(ctx, "0", 0, 70, 96, RED, 900); ctx.restore(); }
          papers(ctx, t, 9, 3, xm - 520, 500, 1040, 900, .45);
        } } });
  }, sfxWith((s, f, i, add) => { const k = (f.shots || [])[0]; if (f.chaosCue) add(cueT(s, f.chaosCue, .6, i), "ping"); void k; }));

  /* ================= _lengan: the boss sprouts helping arms ================= */
  function helpIcon(ctx, kind, x, y, t, lit, ring){
    ctx.save(); ctx.translate(x, y);
    if (lit) glowAt(ctx, 0, 0, 110, "#FFE3A8", .5 * lit);
    if (kind === "phone"){ ctx.rotate(ring ? Math.sin(t * 40) * .15 : 0); rr(ctx, -46, -26, 92, 52, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -26, 40, Math.PI, 0); ctx.lineWidth = 16; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = RED; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 2, 12, 0, TAU); ctx.fillStyle = CREAM; ctx.fill();
      if (ring) for (let k = 0; k < 2; k++){ const q = (t * 2 + k / 2) % 1; ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = HL; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -10, 60 + q * 50, -2.4, -.7); ctx.stroke(); ctx.restore(); } }
    else if (kind === "person"){ ctx.beginPath(); ctx.arc(0, -26, 22, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 4); rr(ctx, -34, 0, 68, 44, 18); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 4);
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(40, -30, 18, 0, TAU); ctx.fill(); ol(ctx, 3); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(32, -33, 16, 6); ctx.fillRect(37, -38, 6, 16); }
    else if (kind === "clock"){ ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 2) * 28, -Math.cos(t * 2) * 28); ctx.moveTo(0, 0); ctx.lineTo(18, 6); ctx.stroke();
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 54, -1.2, .4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(50, 14); ctx.lineTo(62, 2); ctx.lineTo(42, 0); ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "lengan", "Cerita: atasan kaget, lengan-lengan bantuan (telepon vendor, tambah orang, geser jadwal) tumbuh dari punggungnya", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, A = Object.assign({ on: 1, items: [] }, f0.arms || {});
    const tLit = T(s, A.litCue, .5, idx), tRing = T(s, A.ringCue, .6, idx), tDroop = T(s, A.droopCue, .9, idx);
    const arm = (st, n, N) => { const k = st.size / 92, f = st.face || 1, sh = [st.x - f * 4 * k, st.y - 50 * k], q = t < tLit + n * .15 ? 0 : eBack(clamp((t - tLit - n * .15) / .5, 0, 1)), dr = ramp(t, tDroop, tDroop + .8);
      const a = (-135 + n * 40) * Math.PI / 180 + Math.sin(t * 3 + n * 2) * .07 + dr * (n - 1) * .35 + dr * .5, L = 400 * q;
      const mx = sh[0] + Math.cos(a - .25) * L * .5, my = sh[1] + Math.sin(a - .25) * L * .5, ex = sh[0] + Math.cos(a) * L, ey = sh[1] + Math.sin(a) * L + dr * 120;
      return { q, sh, mx, my, ex, ey }; };
    base(ctx, s, t, { env: "office", envOpt: { deskX: 980, plantX: 70 },
      under: (ctx2, c, sts, j) => { if (j !== A.on) return; const st = sts[j], items = A.items, a0 = (f0.toons[j] || {});
        items.forEach((it, n) => { const g = arm(st, n, items.length); if (g.q <= 0) return;
          ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 50; ctx.beginPath(); ctx.moveTo(g.sh[0], g.sh[1]); ctx.quadraticCurveTo(g.mx, g.my, g.ex, g.ey); ctx.stroke();
          ctx.strokeStyle = a0.jacket || a0.shirt || "#3B4A6B"; ctx.lineWidth = 38; ctx.stroke();
          ctx.beginPath(); ctx.arc(g.ex, g.ey, 26, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 5); }); },
      over1: (ctx2, c, sts, j) => { if (j !== A.on) return; const st = sts[j];
        A.items.forEach((it, n) => { const g = arm(st, n, A.items.length); if (g.q <= 0) return; ctx.save(); ctx.translate(g.ex, g.ey - 60); ctx.scale(g.q * 1.45, g.q * 1.45); helpIcon(ctx, it.kind, 0, 0, t, 1 - ramp(t, tDroop, tDroop + .8) * .6, it.kind === "phone" && t > tRing && t < tDroop + .5); ctx.restore(); }); },
      over: (ctx2, c, sts) => { const st = sts[A.on]; if (!st) return;
        A.items.forEach((it, n) => { const g = arm(st, n, A.items.length); if (g.q < .6) return; const p = c.toScreen(g.ex, g.ey - 175); popChip(ctx, it.label, p[0], Math.max(250, p[1] - (n === 1 ? 30 : 0)), t - tLit - n * .15 - .3, t > tDroop ? "#B9B4AA" : PAPER, BROWN, 36, (n - 1) * .05); }); } });
  }, sfxWith((s, f, i, add) => { const A = f.arms || {}; if (A.litCue){ const t0 = cueT(s, A.litCue, .5, i); (A.items || []).forEach((it, n) => add(t0 + n * .15, "pop")); add(t0 + .4, "chime"); } if (A.ringCue) add(cueT(s, A.ringCue, .6, i), "ping"); if (A.droopCue) add(cueT(s, A.droopCue, .9, i), "whoosh"); }));

  /* ================= _suar: rescue helicopter in the dark, three flares ================= */
  TT.scene(PX + "suar", "Cerita: hutan malam, helikopter penyelamat mencari dalam gelap; tiga suar (progres, kendala, kebutuhan) menuntun bantuan", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Sr = Object.assign({ flares: [] }, f0.sar || {});
    const tHeli = T(s, Sr.heliCue, .25, idx), tF = Sr.flares.map((fl, n) => T(s, fl.cue, .5 + n * .1, idx)), tLock = T(s, Sr.lockCue, .85, idx);
    const heli = (sts) => { const st = sts[0], yx = st ? st.x : 300, inQ = t < tHeli ? 0 : eOut(clamp((t - tHeli) / 1.4, 0, 1)), lock = ramp(t, tLock, tLock + 1);
      const sx = 640 + Math.sin(t * .7) * 220; return { x: lerp(1500, lerp(sx, yx + 200, lock), inQ), y: 560 + Math.sin(t * 1.3) * 18 - lock * 60, lock, inQ }; };
    base(ctx, s, t, { env: "park", envOpt: { time: "dusk", bench: false, treeX: -300 },
      back: (ctx2, c, sts) => {
        ctx.fillStyle = "rgba(10,16,40,.78)"; ctx.fillRect(-1500, -1500, 4200, 4500);
        ctx.fillStyle = "#F4ECD0"; ctx.beginPath(); ctx.arc(220, 420, 60, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(10,16,40,.78)"; ctx.beginPath(); ctx.arc(244, 404, 54, 0, TAU); ctx.fill();
        for (let i = 0; i < 30; i++){ ctx.fillStyle = hexA("#FFFFFF", .4 + .4 * Math.sin(t * 2 + i)); ctx.fillRect(rnd(i) * 1400 - 160, rnd(i + 40) * 600 + 200, 4, 4); }
        for (let i = -3; i < 14; i++){ const x = i * 110 + rnd(i) * 40, h = 380 + rnd(i + 7) * 260, sw = Math.sin(t * 1.2 + i) * 6; ctx.fillStyle = i % 2 ? "#0E2A22" : "#123329";
          ctx.beginPath(); ctx.moveTo(x + sw, GY - 60 - h); ctx.lineTo(x + 90, GY - 40); ctx.lineTo(x - 90, GY - 40); ctx.closePath(); ctx.fill(); }
        const H = heli(sts); if (H.inQ > 0){
          // searchlight
          const st = sts[0], gx = H.lock > 0 ? lerp(H.x + Math.sin(t * 1.9) * 420, st.x, H.lock) : H.x + Math.sin(t * 1.9) * 420;
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = hexA("#FFF1B8", .2 + .1 * H.lock); ctx.beginPath(); ctx.moveTo(H.x - 20, H.y + 60); ctx.lineTo(H.x + 20, H.y + 60); ctx.lineTo(gx + 170, GY); ctx.lineTo(gx - 170, GY); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.ellipse(gx, GY - 10, 180, 40, 0, 0, TAU); ctx.fillStyle = hexA("#FFF1B8", .25 + .2 * H.lock); ctx.fill(); ctx.restore();
          // rope ladder after lock
          const lq = ramp(t, tLock + .9, tLock + 1.8); if (lq > 0){ const yb = H.y + 60 + lq * 560; ctx.strokeStyle = "#E8D6B0"; ctx.lineWidth = 6; [-26, 26].forEach(d => { ctx.beginPath(); ctx.moveTo(H.x - 30 + d, H.y + 60); ctx.lineTo(H.x - 30 + d + Math.sin(t * 2) * 10, yb); ctx.stroke(); });
            for (let y = H.y + 100; y < yb; y += 60){ ctx.beginPath(); ctx.moveTo(H.x - 56, y); ctx.lineTo(H.x - 4, y); ctx.stroke(); } }
          // helicopter
          ctx.save(); ctx.translate(H.x, H.y); ctx.rotate(Math.sin(t * 1.1) * .05 - .06 * (1 - H.lock));
          ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-60, 90); ctx.lineTo(-90, 120); ctx.moveTo(60, 90); ctx.lineTo(90, 120); ctx.moveTo(-130, 120); ctx.lineTo(130, 120); ctx.stroke();
          ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(110, -10); ctx.lineTo(380, -30); ctx.lineTo(390, 10); ctx.lineTo(110, 30); ctx.closePath(); ctx.fill(); ol(ctx, 5);
          ctx.save(); ctx.translate(385, -10); ctx.rotate(t * 30); ctx.fillStyle = hexA("#DDE3EA", .6); ctx.fillRect(-6, -50, 12, 100); ctx.restore();
          ctx.beginPath(); ctx.ellipse(0, 10, 150, 90, 0, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.ellipse(-60, 0, 80, 66, 0, 0, TAU); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
          // the boss in the cockpit (hijab)
          ctx.save(); ctx.beginPath(); ctx.ellipse(-60, 0, 78, 64, 0, 0, TAU); ctx.clip(); ctx.beginPath(); ctx.arc(-66, 14, 46, 0, TAU); ctx.fillStyle = Sr.hijab || "#8E2A36"; ctx.fill(); ol(ctx, 4);
          ctx.beginPath(); ctx.arc(-66, 16, 30, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 3);
          ctx.strokeStyle = OUT; ctx.lineWidth = 3; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(-66 + d * 12, 12, 9, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(-66 + d * 12, 12, 3, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
          ctx.beginPath(); ctx.arc(-66, 26, 8, H.lock > .5 ? .1 * Math.PI : 1.1 * Math.PI, H.lock > .5 ? .9 * Math.PI : 1.9 * Math.PI); ctx.stroke(); ctx.restore();
          ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(-90, -30, 26, 12, -.4, 0, TAU); ctx.fill();
          ctx.fillStyle = OUT; ctx.fillRect(-6, -110, 12, 40); ctx.save(); ctx.translate(0, -112); ctx.scale(1, .18); ctx.rotate(t * 25); ctx.fillStyle = hexA("#DDE3EA", .55); ctx.fillRect(-300, -14, 600, 28); ctx.fillRect(-14, -300, 28, 600); ctx.restore();
          ctx.beginPath(); ctx.arc(120, 40, 8, 0, TAU); ctx.fillStyle = Math.sin(t * 10) > 0 ? "#FF5A4A" : "#5A2A22"; ctx.fill();
          ctx.restore(); }
      },
      front: (ctx2, c, sts) => { const st = sts[0]; if (!st) return; const h0 = handOf(st);
        Sr.flares.forEach((fl, n) => { const k = t - tF[n]; if (k < 0) return; const tx = 300 + n * 240, ty = 380 + (n % 2) * 70, col = ["#4FD18B", "#FFC23A", "#FF5A4A"][n];
          if (k < .8){ const q = eOut(k / .8), x = lerp(h0[0], tx, q), y = lerp(h0[1], ty, q); for (let i = 0; i < 8; i++){ const qq = clamp(q - i * .04, 0, 1); ctx.fillStyle = hexA(col, .7 - i * .08); ctx.beginPath(); ctx.arc(lerp(h0[0], tx, qq), lerp(h0[1], ty, qq), 12 - i, 0, TAU); ctx.fill(); }
            glowAt(ctx, x, y, 120, col, .7); }
          else { const kk = k - .8, y = ty + kk * 25, x = tx + Math.sin(kk * 2) * 20; glowAt(ctx, x, y, 260 + 30 * Math.sin(t * 9), col, .45); ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill();
            if (kk < .9) burstFx(ctx, x, y, kk, col, 14, 230); } }); },
      over: (ctx2, c) => { Sr.flares.forEach((fl, n) => { const k = t - tF[n] - .8; if (k < 0) return; const p = c.toScreen(300 + n * 240, 380 + (n % 2) * 70 + k * 25);
          popChip(ctx, fl.label, p[0], p[1] + 70, k, ["#4FD18B", "#FFC23A", "#FF5A4A"][n], n === 1 ? BROWN : "#FFFFFF", 34, (n - 1) * .05); }); } });
  }, sfxWith((s, f, i, add) => { const Sr = f.sar || {}; if (Sr.heliCue) add(cueT(s, Sr.heliCue, .25, i), "whoosh"); (Sr.flares || []).forEach((fl, n) => { const t0 = cueT(s, fl.cue, .5 + n * .1, i); add(t0, "whoosh"); add(t0 + .8, "pop"); }); if (Sr.lockCue) add(cueT(s, Sr.lockCue, .85, i), "chime"); }));

  /* ================= _skor: split-flap board ================= */
  const FLAP = "0123456789";
  function flapText(val, k, seed){ if (k >= .8) return val; return val.split("").map((ch, i) => /[0-9]/.test(ch) ? FLAP[Math.floor(rnd(i + seed + Math.floor(k * 18)) * 10)] : ch).join(""); }
  TT.scene(PX + "skor", "Cerita: papan kepak (split-flap) di kantor malam: tanggal, target, tercapai", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Bd = Object.assign({ x: 600, y: 470, w: 800, rh: 150 }, f0.board || {}), rows = Bd.rows || [];
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plantX: 1020 },
      spots: { board: [Bd.x, Bd.y + rows.length * Bd.rh / 2 + 40, 1.08] },
      back: () => {
        const x0 = Bd.x - Bd.w / 2, h = rows.length * Bd.rh + 70; glowAt(ctx, Bd.x, Bd.y + h / 2, 640, "#FFD9A0", .18);
        rr(ctx, x0 - 16, Bd.y - 16, Bd.w + 32, h + 32, 24); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6); rr(ctx, x0, Bd.y, Bd.w, h, 16); ctx.fillStyle = "#1E1C24"; ctx.fill();
        rows.forEach((r, n) => { const ti = T(s, r.cue, .3 + n * .15, idx), k = t - ti, y = Bd.y + 50 + n * Bd.rh;
          textC(ctx, r.label, x0 + 160, y + 72, 40, k >= 0 ? "#F4E6C8" : "#5A5666", 900, 260);
          const v = k < 0 ? r.val.replace(/[0-9]/g, "0") : flapText(r.val, k, n * 7), cw = 96, cx0 = Bd.x + Bd.w / 2 - 30 - v.length * (cw + 10);
          v.split("").forEach((ch, i) => { const cx = cx0 + i * (cw + 10); rr(ctx, cx, y, cw, 118, 12); ctx.fillStyle = "#33303C"; ctx.fill(); ol(ctx, 3, "#0E0D12");
            const fl = k >= 0 && k < .8 ? ((k * 18) % 1) : 1; ctx.fillStyle = "#2A2732"; ctx.fillRect(cx + 2, y + 2, cw - 4, 56 * fl);
            textC(ctx, ch, cx + cw / 2, y + 92, 84, k >= .8 && r.bad ? "#FF6A55" : (k >= 0 ? "#FFFFFF" : "#6E6A78"), 900);
            ctx.fillStyle = "#0E0D12"; ctx.fillRect(cx, y + 57, cw, 4); });
          if (k >= .8 && r.bad){ ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 8); glowAt(ctx, Bd.x + 200, y + 60, 260, "#FF5A4A", .35); ctx.restore(); } });
      } });
  }, sfxWith((s, f, i, add) => { ((f.board || {}).rows || []).forEach((r, n) => { const t0 = cueT(s, r.cue, .3 + n * .15, i); for (let k = 0; k < 4; k++) add(t0 + k * .18, "pop"); if (r.bad) add(t0 + .8, "ping"); }); }));

  /* ================= _kancing: buttoned one hole off ================= */
  TT.scene(PX + "kancing", "Cerita: kemeja raksasa, salah kancing ketahuan di kancing pertama (cukup dibetulkan) / di kancing terakhir (semua dibuka ulang)", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Kc = Object.assign({ x: 620, top: 560, gap: 150 }, f0.btn || {});
    const tWrong = T(s, Kc.wrongCue, .3, idx), tSpot = T(s, Kc.spotCue, .45, idx), tFix = T(s, Kc.fixCue, .6, idx), tLate = T(s, Kc.lateCue, .7, idx), tRedo = T(s, Kc.redoCue, .85, idx);
    const late = t >= tLate, ys = [0, 1, 2, 3].map(i => Kc.top + 170 + i * Kc.gap), bot = Kc.top + 170 + 4 * Kc.gap - 20;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 620 },
      spots: { shirt: [Kc.x, Kc.top + 360, 1.08], low: [Kc.x, ys[3], 1.2] },
      back: () => {
        // per-button state: 0 open, 1 in own hole, 2 in the next hole (wrong)
        let shift = 0; const stt = [0, 0, 0, 0];
        if (!late){ if (t > tWrong){ stt[0] = 2; shift = Kc.gap * eOut(clamp((t - tWrong) / .5, 0, 1)); }
          if (t > tFix){ const q = clamp((t - tFix) / .5, 0, 1); shift = Kc.gap * (1 - eOut(q)); stt[0] = 1; for (let i = 1; i < 4; i++) if (t > tFix + .5 + i * .22) stt[i] = 1; } }
        else { shift = Kc.gap; for (let i = 0; i < 4; i++) stt[i] = 2; if (t > tRedo) for (let i = 3; i >= 0; i--) if (t > tRedo + (3 - i) * .3) stt[i] = 0; if (t > tRedo + 1.4) shift = Kc.gap * (1 - eOut(clamp((t - tRedo - 1.4) / .6, 0, 1))); }
        const anyClosed = stt.some(v => v > 0), gapX = anyClosed ? 0 : 60 + Math.sin(t * 2) * 6;
        const x = Kc.x, w = 300, sway = Math.sin(t * 1.4) * 4;
        ctx.save(); ctx.translate(sway, 0);
        // hanger
        ctx.strokeStyle = "#9AA6B2"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x - 220, Kc.top + 40); ctx.lineTo(x, Kc.top - 40); ctx.lineTo(x + 220, Kc.top + 40); ctx.stroke(); ctx.beginPath(); ctx.arc(x, Kc.top - 70, 30, Math.PI * .9, Math.PI * 2.2); ctx.stroke();
        // right panel (holes) - wearer's left
        const col = "#DCEBF7", col2 = "#C6DCEE";
        ctx.beginPath(); ctx.moveTo(x, Kc.top + 20); ctx.lineTo(x + 120, Kc.top); ctx.lineTo(x + w, Kc.top + 60); ctx.lineTo(x + w + 30, bot); ctx.lineTo(x - 10, bot); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
        ys.forEach((y, i) => { rr(ctx, x - 6, y - 8, 46, 16, 8); ctx.fillStyle = "#6E8BA6"; ctx.fill(); textC(ctx, "MGG " + (i + 1), x + 190, y + 12, 34, BROWN, 900); });
        // extra hole/button for the late state
        // left panel (buttons), shifted down when wrong
        const lx = x - gapX;
        ctx.save(); ctx.translate(-gapX, shift);
        ctx.beginPath(); ctx.moveTo(x + 40, Kc.top + 20); ctx.lineTo(x - 120, Kc.top); ctx.lineTo(x - w, Kc.top + 60); ctx.lineTo(x - w - 30, bot); ctx.lineTo(x + 40, bot); ctx.closePath(); ctx.fillStyle = col2; ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 10, Kc.top + 30); ctx.lineTo(x + 10, bot); ctx.stroke();
        // collar
        ctx.beginPath(); ctx.moveTo(x + 40, Kc.top + 20); ctx.lineTo(x - 60, Kc.top + 120); ctx.lineTo(x - 120, Kc.top); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
        ctx.restore();
        ctx.beginPath(); ctx.moveTo(x, Kc.top + 20); ctx.lineTo(x + 100, Kc.top + 120); ctx.lineTo(x + 120, Kc.top); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
        // buttons
        ys.forEach((y, i) => { const v = stt[i], bx = v ? x + 16 : lx - 20, by = y + shift, pop = late && v === 0 && t > tRedo ? Math.max(0, 1 - (t - tRedo - (3 - i) * .3) / .4) : 0;
          ctx.save(); ctx.translate(bx, by - pop * 40); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = v === 2 ? "#FF8A6A" : v === 1 ? "#7FD39B" : "#F6D36B"; ctx.fill(); ol(ctx, 5);
          ctx.fillStyle = OUT; [[-8, -8], [8, -8], [-8, 8], [8, 8]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 4, 0, TAU); ctx.fill(); }); ctx.restore();
          if (v === 1 && !late && t < tFix + 2.4){ check(ctx, x + 70, by, 1.4, GREEN); } });
        if (late){ ctx.save(); ctx.globalAlpha = .6 + .4 * Math.sin(t * 8); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.setLineDash([12, 8]); ctx.strokeRect(x - 40, Kc.top + 20, 100, 120); ctx.beginPath(); ctx.arc(x + 16, bot + 40, 44, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
        ctx.restore();
      } });
  }, sfxWith((s, f, i, add) => { const Kc = f.btn || {}; if (Kc.wrongCue) add(cueT(s, Kc.wrongCue, .3, i), "pop"); if (Kc.spotCue) add(cueT(s, Kc.spotCue, .45, i), "ping"); if (Kc.fixCue){ const t0 = cueT(s, Kc.fixCue, .6, i); add(t0, "pop"); for (let k = 1; k < 4; k++) add(t0 + .5 + k * .22, "pop"); add(t0 + 1.3, "chime"); }
    if (Kc.lateCue) add(cueT(s, Kc.lateCue, .7, i), "whoosh"); if (Kc.redoCue){ const t0 = cueT(s, Kc.redoCue, .85, i); for (let k = 0; k < 4; k++) add(t0 + k * .3, "pop"); } }));

  /* ================= _ronda: watch post at dusk ================= */
  TT.scene(PX + "ronda", "Cerita: pos ronda senja, papan skor mingguan, kentongan dipukul, angka dikejar", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Pp = Object.assign({ x: 790 }, f0.post || {}), rows = Pp.rows || [];
    const tHit = T(s, Pp.hitCue, .55, idx), tFix = T(s, Pp.fixCue, .8, idx), x0 = Pp.x - 200, x1 = Pp.x + 200;
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      spots: { board: [Pp.x - 40, 860, 1.12], drum: [Pp.x - 140, 1150, 1.15] },
      back: () => {
        // platform + posts + roof
        ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(Pp.x, GY, 260, 22, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#6B4426"; [x0 + 10, x1 - 30].forEach(x => { ctx.fillRect(x, 1060, 22, GY - 1060); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(x, 1060, 22, GY - 1060); });
        rr(ctx, x0 - 10, 1430, x1 - x0 + 20, 40, 6); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 5);
        for (let i = 0; i < 6; i++){ ctx.fillStyle = i % 2 ? "#B5743F" : "#C08048"; ctx.fillRect(x0 + 10 + i * 64, 1470, 60, 12); }
        glowAt(ctx, Pp.x + 60, 1150, 260, "#FFD27A", .45 + .08 * Math.sin(t * 7)); ctx.fillStyle = "#3B2418"; ctx.fillRect(Pp.x + 56, 1080, 6, 50); rr(ctx, Pp.x + 36, 1128, 46, 62, 10); ctx.fillStyle = "#FFD27A"; ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.moveTo(x0 - 70, 1080); ctx.lineTo(Pp.x, 960); ctx.lineTo(x1 + 70, 1080); ctx.closePath(); ctx.fillStyle = "#8E3B2A"; ctx.fill(); ol(ctx, 6);
        for (let i = 0; i < 7; i++){ ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 - 40 + i * 74, 1076); ctx.lineTo(Pp.x - 10 + i * 4, 968); ctx.stroke(); }
        // board on the roof
        ctx.fillStyle = "#5A3A2A"; ctx.fillRect(Pp.x - 6, 900, 12, 70);
        const bw = 470, by = 640; rr(ctx, Pp.x - bw / 2, by, bw, 270, 16); ctx.fillStyle = "#2E4A36"; ctx.fill(); ol(ctx, 7);
        textC(ctx, "PATROLI JUMAT", Pp.x, by + 52, 36, GOLD, 900, bw - 40);
        rows.forEach((r, n) => { const ti = T(s, r.cue, .4 + n * .2, idx); if (t < ti) return; const q = eBack(clamp((t - ti) / .35, 0, 1)), y = by + 118 + n * 82;
          ctx.save(); ctx.translate(Pp.x, y); ctx.scale(q, q); let val = r.val, bad = r.bad;
          if (r.to && t > tFix){ const p = clamp((t - tFix) / 1.4, 0, 1); val = Math.round(lerp(parseInt(r.val), parseInt(r.to), eOut(p))) + "/25"; if (p >= 1) bad = false; }
          textC(ctx, r.label, -110, 14, 38, "#F4E6C8", 900, 200); textC(ctx, val, 100, 14, 46, bad ? "#FF7A62" : "#9BE08A", 900, 150);
          if (!bad) check(ctx, 200, 0, 1.3, "#9BE08A"); else textC(ctx, "!", 200, 16, 50, "#FF7A62", 900);
          ctx.restore(); });
        // slit drum (kentongan)
        const dx = x0 + 60, k = t - tHit, sw = k > 0 && k < 1.6 ? Math.sin(k * 18) * .18 * (1 - k / 1.6) : Math.sin(t * 1.4) * .03;
        ctx.save(); ctx.translate(dx, 1090); ctx.rotate(sw); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke();
        rr(ctx, -34, 30, 68, 230, 30); ctx.fillStyle = "#A0643C"; ctx.fill(); ol(ctx, 5); rr(ctx, -7, 70, 14, 150, 7); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.restore();
        if (k > 0 && k < 1.6){ for (let n = 0; n < 2; n++){ const kk = k - n * .45; if (kk < 0 || kk > .6) continue; ctx.save(); ctx.globalAlpha = 1 - kk / .6; ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(dx, 1200, 60 + kk * 200, -1, 1); ctx.stroke(); ctx.beginPath(); ctx.arc(dx, 1200, 60 + kk * 200, Math.PI - 1, Math.PI + 1); ctx.stroke(); ctx.restore(); } }
      },
      over: (ctx2, c) => { const k = t - tHit; if (k > 0 && k < 1.4){ const p = c.toScreen(x0 + 60, 1050); popWord(ctx, "TOK!", p[0] - 90, p[1] - 40, k, { size: 80, rot: -10, hold: .7 }); popWord(ctx, "TOK!", p[0] + 80, p[1] - 90, k - .45, { size: 80, rot: 8, hold: .7 }); } } });
  }, sfxWith((s, f, i, add) => { const Pp = f.post || {}; (Pp.rows || []).forEach((r, n) => add(cueT(s, r.cue, .4 + n * .2, i), r.bad ? "ping" : "pop")); if (Pp.hitCue){ const t0 = cueT(s, Pp.hitCue, .55, i); add(t0, "pop"); add(t0 + .45, "pop"); } if (Pp.fixCue) add(cueT(s, Pp.fixCue, .8, i) + 1.4, "chime"); }));

  /* ================= _kaca: weekly targets written on the window glass ================= */
  TT.scene(PX + "kaca", "Cerita: malam di rumah, target bulanan ditulis di kaca jendela lalu dipecah empat target mingguan, alarm Jumat", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Gw = Object.assign({ x0: 360, x1: 1000, y0: 470, y1: 1210 }, f0.glass || {}), lines = Gw.lines || [];
    base(ctx, s, t, { env: "home", envOpt: { lampX: 120 },
      spots: { glass: [(Gw.x0 + Gw.x1) / 2, (Gw.y0 + Gw.y1) / 2, 1.05] },
      back: (ctx2, c, sts) => {
        const W2 = Gw.x1 - Gw.x0, H2 = Gw.y1 - Gw.y0;
        rr(ctx, Gw.x0 - 30, Gw.y0 - 30, W2 + 60, H2 + 60, 14); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 6);
        ctx.save(); rr(ctx, Gw.x0, Gw.y0, W2, H2, 6); ctx.clip();
        ctx.fillStyle = "#18233F"; ctx.fillRect(Gw.x0, Gw.y0, W2, H2);
        for (let i = 0; i < 9; i++){ const bx = Gw.x0 - 20 + i * 80, bh = 200 + rnd(i + 3) * 300; ctx.fillStyle = "#26304E"; ctx.fillRect(bx, Gw.y1 - bh, 70, bh);
          for (let wy = Gw.y1 - bh + 20; wy < Gw.y1; wy += 34) for (let wx = bx + 10; wx < bx + 60; wx += 22) if (rnd(wx + wy) > .5){ ctx.fillStyle = Math.sin(t * (.4 + rnd(wx)) + wx) > -.5 ? "rgba(244,194,122,.8)" : "rgba(244,194,122,.2)"; ctx.fillRect(wx, wy, 10, 14); } }
        ctx.fillStyle = "rgba(200,230,255,.10)"; ctx.fillRect(Gw.x0, Gw.y0, W2, H2);
        const gx = Gw.x0 - 300 + ((t * 70) % (W2 + 600)); ctx.fillStyle = "rgba(255,255,255,.1)"; ctx.beginPath(); ctx.moveTo(gx, Gw.y0); ctx.lineTo(gx + 90, Gw.y0); ctx.lineTo(gx - 200, Gw.y1); ctx.lineTo(gx - 290, Gw.y1); ctx.closePath(); ctx.fill();
        // handwriting
        let pen = null;
        lines.forEach((L, n) => { const ti = T(s, L.cue, .2 + n * .12, idx), q = clamp((t - ti) / (L.dur || .5), 0, 1); if (q <= 0) return;
          const x = Gw.x0 + (L.x ?? 50), y = Gw.y0 + (L.y ?? 120 + n * 110), size = L.size || 70; font(ctx, 800, size, FAM); const w = ctx.measureText(L.text).width;
          ctx.save(); ctx.beginPath(); ctx.rect(x - 10, y - size, (w + 20) * q, size * 1.4); ctx.clip(); ctx.fillStyle = L.col || "#FFFFFF"; ctx.save(); ctx.translate(x, y); ctx.rotate(-.02); ctx.fillText(L.text, 0, 0); ctx.restore(); ctx.restore();
          const tsk = L.strikeCue ? T(s, L.strikeCue, .3, idx) : ti + .6; if ((L.strike || L.strikeCue) && t > tsk){ const q2 = clamp((t - tsk) / .4, 0, 1); ctx.strokeStyle = "#FF7A62"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x - 10, y - size * .35); ctx.lineTo(x - 10 + (w + 20) * q2, y - size * .3); ctx.stroke(); }
          if (q < 1) pen = [x + w * q, y - size * .3]; });
        if (Gw.arrowCue){ const ta = T(s, Gw.arrowCue, .4, idx); if (t > ta){ const q = clamp((t - ta) / .4, 0, 1); ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(Gw.x0 + 300, Gw.y0 + 150); ctx.lineTo(Gw.x0 + 300, Gw.y0 + 150 + 80 * q); ctx.stroke(); } }
        ctx.restore();
        ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo((Gw.x0 + Gw.x1) / 2, Gw.y0); ctx.lineTo((Gw.x0 + Gw.x1) / 2, Gw.y0 + 4); ctx.stroke();
        rr(ctx, Gw.x0 - 50, Gw.y1 + 20, W2 + 100, 34, 8); ctx.fillStyle = "#7A4A2B"; ctx.fill(); ol(ctx, 5);
        // marker pen following the writing
        if (pen){ ctx.save(); ctx.translate(pen[0] + 20, pen[1] + 30); ctx.rotate(-.6 + Math.sin(t * 30) * .05); rr(ctx, -16, -10, 32, 150, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); rr(ctx, -16, -10, 32, 40, 10); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); ctx.restore(); }
      } });
  }, sfxWith((s, f, i, add) => { ((f.glass || {}).lines || []).forEach((L, n) => add(cueT(s, L.cue, .2 + n * .12, i), "whoosh")); }));

  /* ================= RN: event idea dioramas ================= */
  function dioStage(ctx, x, y, s, t, live){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, 0, 130, 34, 0, 0, TAU); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
    rr(ctx, -100, -60, 200, 50, 6); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 4);
    rr(ctx, -110, -200, 220, 140, 8); ctx.fillStyle = "#7A1F2B"; ctx.fill(); ol(ctx, 4);
    [-1, 1].forEach(d => { const p = live ? 1 + .12 * Math.abs(Math.sin(t * 9 + d)) : 1; rr(ctx, d * 80 - 26, -150, 52, 90, 6); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 3); ctx.beginPath(); ctx.arc(d * 80, -98, 16 * p, 0, TAU); ctx.fillStyle = "#5A6270"; ctx.fill(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(0, -140); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -146, 9, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill();
    if (live){ ctx.save(); ctx.globalCompositeOperation = "lighter"; [["#FF5A8A", -1], ["#5AC8FF", 1]].forEach(([c2, d]) => { const a = Math.sin(t * 3 + d) * .4; ctx.fillStyle = hexA(c2, .3); ctx.beginPath(); ctx.moveTo(d * 100, -200); ctx.lineTo(d * 100 + Math.sin(a) * 200 - 40, -40); ctx.lineTo(d * 100 + Math.sin(a) * 200 + 40, -40); ctx.closePath(); ctx.fill(); }); ctx.restore();
      for (let k = 0; k < 3; k++){ const q = (t * .8 + k / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); textC(ctx, "♪", -60 + k * 60 + Math.sin(q * 6) * 20, -220 - q * 120, 44, GOLD, 900); ctx.restore(); } }
    ctx.restore(); }
  function dioPicnic(ctx, x, y, s, t, live){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, 0, 130, 34, 0, 0, TAU); ctx.fillStyle = "#7FB35A"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = "#7A4A2B"; ctx.fillRect(-70, -170, 18, 160); for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(-62 + (k - 1) * 40, -190 - (k % 2) * 30 + Math.sin(t * 2 + k) * 3, 52, 0, TAU); ctx.fillStyle = k % 2 ? "#5F8F4E" : "#6E9A58"; ctx.fill(); }
    ctx.save(); ctx.translate(40, -10); ctx.scale(1, .45); ctx.rotate(.3); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++){ ctx.fillStyle = (i + j) % 2 ? "#FFFFFF" : "#D9483B"; ctx.fillRect(-60 + i * 30, -60 + j * 30, 30, 30); } ctx.restore();
    rr(ctx, 30, -50, 56, 36, 8); ctx.fillStyle = "#C98F58"; ctx.fill(); ol(ctx, 3); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(58, -50, 20, Math.PI, 0); ctx.stroke();
    if (live) for (let k = 0; k < 4; k++){ const q = (t * .4 + k / 4) % 1; ctx.save(); ctx.globalAlpha = .8 * Math.sin(q * Math.PI); ctx.translate(-100 + k * 60 + Math.sin(t + k) * 20, -150 - q * 140); ctx.rotate(q * 3); ctx.fillStyle = "#8ED063"; ctx.beginPath(); ctx.ellipse(0, 0, 10, 18, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore(); }
  function dioBoth(ctx, x, y, s, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 230, 46, 0, 0, TAU); ctx.fillStyle = "#7FB35A"; ctx.fill(); ol(ctx, 5); ctx.restore();
    dioPicnic(ctx, x - 90 * s, y - 6 * s, s * .85, t, true); dioStage(ctx, x + 100 * s, y - 6 * s, s * .8, t, true); }
  function meetTable(ctx, t, M, s, idx){
    const tO = T(s, M.stageCue, .3, idx), tG = T(s, M.picnicCue, .55, idx), tH = T(s, M.heatCue, .2, idx), tS = T(s, M.sinkCue, .8, idx), ty = M.top ?? 1380;
    const hop = (ph) => t > tH ? Math.abs(Math.sin(t * 6 + ph)) * 22 : 0;
    const qo = M.always ? 1 : pin(t, tO, .45), qg = M.always ? 1 : pin(t, tG, .45), sink = t < tS ? 0 : eOut(clamp((t - tS) / 1.4, 0, 1));
    if (t > tH && !M.always){ ctx.save(); for (let i = 0; i < 6; i++){ const q = (t * .9 + i / 6) % 1, x = 400 + i * 60; ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FF8A5A"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, ty - 300 - q * 300); ctx.quadraticCurveTo(x + 20, ty - 340 - q * 300, x, ty - 380 - q * 300); ctx.stroke(); } ctx.restore(); }
    if (qo > 0){ ctx.save(); ctx.translate(M.ox ?? 400, ty - 30 - hop(0)); ctx.scale(qo, qo); dioStage(ctx, 0, 0, 1.05, t, !M.always || t < tS); ctx.restore(); }
    if (qg > 0){ ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1080, ty + 4); ctx.clip(); ctx.translate(M.gx ?? 690, ty - 30 - hop(1.6) + sink * 300); ctx.scale(qg, qg); dioPicnic(ctx, 0, 0, 1.05, t, !M.always); ctx.restore(); }
    rr(ctx, 120, ty - 6, 840, 44, 12); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#6B3A22"; ctx.fillRect(150, ty + 38, 780, GY - ty); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(150, ty + 38, 780, GY - ty);
    if (sink > .6){ const q = eBack(clamp((t - tS - 1) / .4, 0, 1)); ctx.save(); ctx.translate(M.gx ?? 690, ty - 4); ctx.scale(q, q); rr(ctx, -64, -120, 128, 120, [64, 64, 6, 6]); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); textC(ctx, "IDE", 0, -66, 30, OUT, 900); textC(ctx, "SARI", 0, -32, 30, OUT, 900); ctx.restore(); }
  }
  TT.scene(PX + "usul", "Cerita: rapat acara kantor, dua diorama usulan (konser meriah vs piknik santai) bersaing di meja", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, M = Object.assign({}, f0.mock || {});
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010, rug: false },
      spots: { table: [545, 1180, 1.2] }, front: () => meetTable(ctx, t, M, s, idx) });
  }, sfxWith((s, f, i, add) => { const M = f.mock || {}; if (M.stageCue) add(cueT(s, M.stageCue, .3, i), "chime"); if (M.picnicCue) add(cueT(s, M.picnicCue, .55, i), "chime"); if (M.heatCue) add(cueT(s, M.heatCue, .2, i), "whoosh"); }));

  /* ================= _landasan: a "KUNO" anvil drops on the person, not on the idea ================= */
  function anvil(ctx, x, y, sc, label){ ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.beginPath(); ctx.moveTo(-120, -110); ctx.lineTo(120, -110); ctx.quadraticCurveTo(180, -100, 200, -70); ctx.lineTo(90, -60); ctx.lineTo(60, -20); ctx.lineTo(90, 0); ctx.lineTo(-90, 0); ctx.lineTo(-60, -20); ctx.lineTo(-90, -60); ctx.lineTo(-120, -70); ctx.closePath();
    ctx.fillStyle = "#4A4E58"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(-110, -104, 220, 10);
    rr(ctx, -78, -96, 156, 48, 8); ctx.fillStyle = "#FFE45C"; ctx.fill(); ol(ctx, 3); textC(ctx, label || "KUNO", 0, -60, 34, RED, 900, 140); ctx.restore(); }
  TT.scene(PX + "landasan", "Cerita: landasan besi berlabel KUNO jatuh menimpa orangnya (bukan idenya), ruang hening abu-abu, ide terkubur", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, K = Object.assign({ to: 1, text: "KUNO" }, f0.anv || {}), M = f0.mock || {};
    const tD = T(s, K.dropCue, .4, idx), tG = T(s, K.greyCue, .5, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010, rug: false },
      front: () => meetTable(ctx, t, Object.assign({ always: true }, M), s, idx),
      over: (ctx2, c, sts, R) => {
        const r = R[K.to]; if (r){ const hd = r.screen.head, sc = r.screen.scale / 7.8, top = [hd[0], hd[1] - 150 * sc], k = t - tD;
          if (k > -.6 && k < 0){ ctx.save(); ctx.globalAlpha = .35 * (1 + k / .6); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(top[0], top[1] + 20, 120 * (1 + k / .6) * sc, 20 * sc, 0, 0, TAU); ctx.fill(); ctx.restore(); }
          if (k >= 0){ let y, x = top[0] + 150 * sc * clamp((k - .3) / .5, 0, 1), rot = 0;
            if (k < .3) y = lerp(-200, top[1], (k / .3) * (k / .3)); else { const kk = k - .3; y = top[1] - Math.sin(clamp(kk / .5, 0, 1) * Math.PI) * 160 * sc + clamp(kk / .5, 0, 1) * 120 * sc; rot = clamp(kk / .5, 0, 1) * .3; }
            ctx.save(); ctx.translate(x, y); ctx.rotate(rot); anvil(ctx, 0, 0, .9 * sc, K.text); ctx.restore();
            if (k > .3){ const kk = k - .3; popWord(ctx, "BONK!", top[0] - 170 * sc, top[1] - 60 * sc, kk, { size: 92, rot: -12, hold: .9, col: RED }); if (kk < .9) burstFx(ctx, top[0], top[1], kk, GOLD, 10, 160 * sc);
              if (kk < 3.2) for (let i = 0; i < 4; i++){ const a = t * 5 + i * TAU / 4; sparkle(ctx, hd[0] + Math.cos(a) * 120 * sc, hd[1] - 120 * sc + Math.sin(a) * 30 * sc, 16 * sc, i % 2 ? GOLD : CREAM); } } } }
        if (t > tG){ const q = clamp((t - tG) / .4, 0, 1); ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = .9 * q; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          ctx.save(); ctx.globalAlpha = .7 * q; ctx.fillStyle = "rgba(20,20,30,.25)"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          for (let i = 0; i < 2; i++){ const k = (t - tG - .3 - i * 1.1) % 2.2; if (k < 0 || k > 1.2) continue; ctx.save(); ctx.globalAlpha = Math.sin(k / 1.2 * Math.PI); font(ctx, 800, 44, FAM); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText("krik... krik...", 260 + i * 540, 300 - k * 30); ctx.textAlign = "left"; ctx.restore(); } } } });
  }, sfxWith((s, f, i, add) => { const K = f.anv || {}; if (K.dropCue){ const t0 = cueT(s, K.dropCue, .4, i); add(t0, "whoosh"); add(t0 + .3, "pop"); add(t0 + .35, "ping"); } if (K.greyCue) add(cueT(s, K.greyCue, .5, i), "ping"); if (f.mock && f.mock.sinkCue) add(cueT(s, f.mock.sinkCue, .8, i), "whoosh"); }));

  /* ================= _tigad: 3D glasses ================= */
  TT.scene(PX + "tigad", "Cerita: kacamata 3D raksasa, lensa merah + lensa biru disatukan, gambar utuh melompat keluar", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Gq = Object.assign({ y: 600 }, f0.g3 || {});
    const tR = T(s, Gq.redCue, .45, idx), tB = T(s, Gq.blueCue, .6, idx), tJ = T(s, Gq.joinCue, .8, idx), tIn = Gq.inCue ? T(s, Gq.inCue, .1, idx) : .2;
    const j = t < tJ ? 0 : eBack(clamp((t - tJ) / .5, 0, 1)), qin = pin(t, tIn, .5);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      spots: { glass: [540, Gq.y + 120, 1.1] },
      back: () => {
        const lw = 300, lh = 190, gap = 40;
        const half = (side, lit, col) => { const cx = lerp(side < 0 ? 270 : 810, 540 + side * (lw / 2 + gap / 2), j), cy = Gq.y + Math.sin(t * 1.6 + side) * 10 * (1 - j), sc = qin;
          ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.rotate((1 - j) * side * .06);
          rr(ctx, -lw / 2 - 22, -lh / 2 - 22, lw + 44, lh + 44, 26); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 6);
          ctx.strokeStyle = "#FFFDF6"; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(side * (lw / 2 + 20), -lh / 2); ctx.lineTo(side * (lw / 2 + 120), -lh / 2 - 40); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
          ctx.save(); rr(ctx, -lw / 2, -lh / 2, lw, lh, 16); ctx.clip(); ctx.fillStyle = hexA(col, .2 + .55 * lit); ctx.fillRect(-lw / 2, -lh / 2, lw, lh);
          if (lit > 0 && j < 1){ ctx.globalAlpha = lit * (1 - j); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 40;
            if (side < 0){ ctx.strokeRect(-90, -50, 180, 90); ctx.beginPath(); ctx.moveTo(-60, -50); ctx.lineTo(-60, 40); ctx.moveTo(60, -50); ctx.lineTo(60, 40); ctx.stroke(); textC(ctx, "♪", 0, 10, 60, "#FFFFFF", 900); } else { ctx.beginPath(); ctx.arc(-20, -30, 50, 0, TAU); ctx.moveTo(-20, 20); ctx.lineTo(-20, 70); ctx.stroke(); ctx.strokeRect(20, 40, 80, 30); } ctx.setLineDash([]); }
          ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(-lw / 2 + 20, -lh / 2 + 14, 40, lh - 28); ctx.restore();
          rr(ctx, -lw / 2, -lh / 2, lw, lh, 16); ol(ctx, 5);
          if (lit > 0 && j < 1) glowAt(ctx, 0, 0, 240, col, .3 * lit);
          ctx.restore(); };
        half(-1, ramp(t, tR, tR + .3), "#E8403A"); half(1, ramp(t, tB, tB + .3), "#2F9BEA");
        if (j > 0){ ctx.save(); ctx.translate(540, Gq.y - 10); ctx.fillStyle = "#FFFDF6"; rr(ctx, -30, -24, 60, 40, 12); ctx.fill(); ol(ctx, 4); ctx.restore(); }
        const kj = t - tJ - .35; if (kj > 0){ const q = eBack(clamp(kj / .7, 0, 1)), y = lerp(Gq.y + 60, Gq.y + 500, eOut(clamp(kj / .7, 0, 1))), sc = .4 + .6 * q, off = 26 * (1 - clamp(kj / 1.2, 0, 1));
          glowAt(ctx, 540, y - 150, 360, "#FFE3A8", .45); ctx.save(); ctx.translate(540, y); ctx.scale(sc, sc);
          if (off > 1){ ctx.save(); ctx.globalAlpha = .45; ctx.fillStyle = "#E8403A"; ctx.beginPath(); ctx.ellipse(-off, -120, 240, 170, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#2F9BEA"; ctx.beginPath(); ctx.ellipse(off, -120, 240, 170, 0, 0, TAU); ctx.fill(); ctx.restore(); }
          dioBoth(ctx, 0, 0, 1, t); ctx.restore();
          if (kj < 1) burstFx(ctx, 540, y - 140, kj, GOLD, 14, 280); }
      } });
  }, sfxWith((s, f, i, add) => { const Gq = f.g3 || {}; if (Gq.redCue) add(cueT(s, Gq.redCue, .45, i), "pop"); if (Gq.blueCue) add(cueT(s, Gq.blueCue, .6, i), "pop"); if (Gq.joinCue){ const t0 = cueT(s, Gq.joinCue, .8, i); add(t0, "whoosh"); add(t0 + .4, "chime"); } }));

  /* ================= _acara: rule board, then the merged event in the park ================= */
  TT.scene(PX + "acara", "Cerita: papan aturan rapat (serang idenya, bukan orangnya), lalu acara gabungan: piknik siang + konser kecil senja di taman", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Ru = Object.assign({ x: 560, y: 500 }, f0.rule || {}), Ev = Object.assign({}, f0.ev || {});
    const tL1 = T(s, Ru.line1Cue, .3, idx), tL2 = T(s, Ru.line2Cue, .4, idx), tCrowd = T(s, Ev.crowdCue, .7, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1010, rug: false },
      back: (ctx2, c, sts, R) => {
        if (!R.f.park){
          const x0 = Ru.x - 340, y0 = Ru.y; ctx.fillStyle = "#5A3A2A"; ctx.fillRect(Ru.x - 8, y0 - 40, 16, 40); rr(ctx, x0, y0, 680, 360, 18); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 8);
          rr(ctx, x0, y0, 680, 76, [18, 18, 0, 0]); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, "ATURAN RAPAT", Ru.x, y0 + 54, 40, "#FFFFFF", 900);
          const l1 = pin(t, tL1, .4), l2 = pin(t, tL2, .4);
          if (l1 > 0){ ctx.save(); ctx.translate(Ru.x, y0 + 170); ctx.scale(l1, l1); textC(ctx, "SERANG IDENYA,", 0, 0, 62, GREEN, 900, 620); ctx.restore(); }
          if (l2 > 0){ ctx.save(); ctx.translate(Ru.x, y0 + 270); ctx.scale(l2, l2); textC(ctx, "BUKAN ORANGNYA", 0, 0, 62, RED, 900, 620); ctx.restore(); if (t - tL2 < .9) burstFx(ctx, Ru.x, y0 + 250, t - tL2, GOLD, 12, 300); }
        } else {
          // dusk park event: string lights, small stage, picnic mats
          for (let k = 0; k < 2; k++){ ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-100, 620 + k * 90); ctx.quadraticCurveTo(540, 760 + k * 90, 1180, 620 + k * 90); ctx.stroke();
            for (let i = 0; i < 16; i++){ const u = i / 15, x = lerp(-100, 1180, u), y = (1 - u) * (1 - u) * (620 + k * 90) + 2 * u * (1 - u) * (760 + k * 90) + u * u * (620 + k * 90) + 14; const on = Math.sin(t * 4 + i + k) > -.3;
              glowAt(ctx, x, y, 40, i % 2 ? "#FFD27A" : "#FF9A6A", on ? .7 : .25); ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fillStyle = on ? "#FFF1C9" : "#C9A87A"; ctx.fill(); } }
          const sx = Ev.stageX ?? 820; rr(ctx, sx - 240, 1300, 480, 90, 8); ctx.fillStyle = "#6B3A22"; ctx.fill(); ol(ctx, 5); rr(ctx, sx - 260, 880, 520, 70, 12); ctx.fillStyle = "#7A1F2B"; ctx.fill(); ol(ctx, 5); textC(ctx, "KONSER SENJA", sx, 930, 40, GOLD, 900, 480);
          ctx.fillStyle = "#3B2418"; ctx.fillRect(sx - 230, 950, 14, 360); ctx.fillRect(sx + 216, 950, 14, 360);
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = hexA("#FFE3A8", .18 + .06 * Math.sin(t * 3)); ctx.beginPath(); ctx.moveTo(sx - 40, 950); ctx.lineTo(sx + 40, 950); ctx.lineTo(sx + 200, 1300); ctx.lineTo(sx - 200, 1300); ctx.closePath(); ctx.fill(); ctx.restore();
          // guitar on a stand + mic
          ctx.save(); ctx.translate(sx - 90, 1300); ctx.rotate(-.15 + Math.sin(t * 2) * .03); ctx.beginPath(); ctx.ellipse(0, -60, 44, 56, 0, 0, TAU); ctx.fillStyle = "#C98F58"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -66, 14, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.fillStyle = "#6B3A22"; ctx.fillRect(-7, -230, 14, 150); ctx.restore();
          ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(sx + 60, 1300); ctx.lineTo(sx + 60, 1150); ctx.stroke(); ctx.beginPath(); ctx.arc(sx + 60, 1140, 12, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3);
          for (let k = 0; k < 4; k++){ const q = (t * .6 + k / 4) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); textC(ctx, k % 2 ? "♪" : "♫", sx - 160 + k * 100 + Math.sin(q * 6) * 20, 1200 - q * 260, 54, GOLD, 900); ctx.restore(); }
          // picnic mats
          [[220, 1580, "#D9483B"], [520, 1600, "#3E7FB0"]].forEach(([mx, my, c2], n) => { ctx.save(); ctx.translate(mx, my); ctx.scale(1, .32); for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++){ ctx.fillStyle = (i + j) % 2 ? "#FFFFFF" : c2; ctx.fillRect(-150 + i * 50, -150 + j * 50, 50, 50); } ctx.restore();
            rr(ctx, mx + 60, my - 70, 70, 46, 8); ctx.fillStyle = "#C98F58"; ctx.fill(); ol(ctx, 3); });
          const qc = pin(t, tCrowd, .4); if (qc > 0) for (let i = 0; i < 8; i++){ const x = 140 + i * 120, y = 1230 + (i % 2) * 20 + Math.sin(t * 3 + i) * 4; ctx.save(); ctx.translate(x, y); ctx.scale(qc, qc); ctx.globalAlpha = .5;
            ctx.fillStyle = "#2C2433"; ctx.beginPath(); ctx.arc(0, -40, 22, 0, TAU); ctx.fill(); rr(ctx, -26, -18, 52, 60, 18); ctx.fill(); ctx.restore(); }
        } } });
  }, sfxWith((s, f, i, add) => { const Ru = f.rule || {}; if (Ru.line1Cue) add(cueT(s, Ru.line1Cue, .3, i), "pop"); if (Ru.line2Cue) add(cueT(s, Ru.line2Cue, .4, i), "chime"); const Ev = f.ev || {}; if (Ev.crowdCue) add(cueT(s, Ev.crowdCue, .7, i), "chime"); }));

  /* ================= _meteor: the 40-page minutes crash onto the desk ================= */
  TT.scene(PX + "meteor", "Cerita: notulen 40 halaman jatuh dari langit bagai meteor ke meja, debu dan kertas berhamburan", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Mt = Object.assign({ deskX: 720, label: "40 HALAMAN" }, f0.met || {}), tD = T(s, Mt.dropCue, .3, idx), tTag = T(s, Mt.tagCue, .5, idx);
    const k = t - tD, top = GY - 290, hit = k > .7;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1020 },
      spots: { desk: [Mt.deskX, 1150, 1.15] },
      back: () => {
        if (k > -.8 && !hit){ const q = clamp((k + .8) / 1.5, 0, 1); ctx.save(); ctx.globalAlpha = .4 * q; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(Mt.deskX, top - 6, 160 * q + 20, 26, 0, 0, TAU); ctx.fill(); ctx.restore(); }
        const sq = hit && k < 1.0 ? 1 - .06 * Math.sin((k - .7) / .3 * Math.PI) : 1;
        ctx.save(); ctx.translate(Mt.deskX, GY); ctx.scale(1, sq); ctx.translate(-Mt.deskX, -GY); prop(ctx, "desk", Mt.deskX, GY, { laptop: true, lx: -150 }, t);
        if (hit){ ctx.strokeStyle = OUT; ctx.lineWidth = 5; [[-1, 1], [1, 1], [0, 1.3]].forEach(([d, l]) => { ctx.beginPath(); ctx.moveTo(Mt.deskX, top + 4); ctx.lineTo(Mt.deskX + d * 60 * l, top + 60 * l); ctx.lineTo(Mt.deskX + d * 110 * l, top + 90 * l); ctx.stroke(); }); }
        ctx.restore();
      },
      front: () => {
        if (k < 0) return; let x, y, rot;
        if (!hit){ const q = k / .7; x = lerp(Mt.deskX + 700, Mt.deskX, q); y = lerp(-500, top - 10, q * q); rot = -.5 * (1 - q);
          for (let i = 0; i < 10; i++){ const qq = clamp(q - i * .03, 0, 1); ctx.save(); ctx.globalAlpha = .6 - i * .05; puffC(ctx, lerp(Mt.deskX + 700, Mt.deskX, qq) + 60, lerp(-500, top - 10, qq * qq) - 120, 60 - i * 3, i % 2 ? "#FF8A3A" : "#FFD27A"); ctx.restore(); } }
        else { x = Mt.deskX; y = top - 10; rot = Math.sin((k - .7) * 20) * .05 * Math.max(0, 1 - (k - .7) / .6); }
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1.5, 1.5); ctx.translate(0, -110); drawItem(ctx, "binder", 0, 0, t, { text: "NOTULEN", col: "#5B7DB1" }); ctx.restore();
        if (hit && k < 2.2){ const q = (k - .7) / 1.5; for (let i = 0; i < 10; i++){ ctx.save(); ctx.globalAlpha = (1 - q) * .8; puffC(ctx, Mt.deskX + (i - 4.5) * 70 * (1 + q), top - 10 - q * 60, 40 + q * 50, "#EDE2D2"); ctx.restore(); } }
        if (hit) papers(ctx, t, 6, 11, Mt.deskX - 420, 560, 760, 700, .3);
        if (t > tTag){ const q = eBack(clamp((t - tTag) / .4, 0, 1)); ctx.save(); ctx.translate(Mt.deskX + 170, top - 420); ctx.rotate(.1 + Math.sin(t * 3) * .04); ctx.scale(q, q); rr(ctx, -150, -40, 300, 80, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, Mt.label, 0, 16, 44, "#FFFFFF", 900, 270); ctx.restore(); }
      } });
  }, sfxWith((s, f, i, add) => { const Mt = f.met || {}; if (Mt.dropCue){ const t0 = cueT(s, Mt.dropCue, .3, i); add(t0, "whoosh"); add(t0 + .7, "pop"); add(t0 + .75, "ping"); } if (Mt.tagCue) add(cueT(s, Mt.tagCue, .5, i), "pop"); }));

  /* ================= _peras: AI juicer ================= */
  TT.scene(PX + "peras", "Cerita: mesin peras AI, halaman masuk corong, hitung 10 detik, jadi segelas rangkuman", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, J = Object.assign({ x: 650 }, f0.juice || {});
    const tFeed = T(s, J.feedCue, .2, idx), tCount = T(s, J.countCue, .35, idx), tPress = T(s, J.pressCue, .55, idx), cx = J.x;
    const press = t < tPress ? 0 : clamp((t - tPress) / 1.6, 0, 1), fill = t < tPress + .4 ? 0 : clamp((t - tPress - .4) / 1.6, 0, 1), shake = press > 0 && press < 1 ? Math.sin(t * 60) * 5 : 0;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 650 },
      spots: { glass: [cx + 210, 1240, 1.25], machine: [cx, 1000, 1.05] },
      back: () => {
        ctx.save(); ctx.translate(shake, 0);
        // hopper
        ctx.beginPath(); ctx.moveTo(cx - 220, 600); ctx.lineTo(cx + 220, 600); ctx.lineTo(cx + 110, 760); ctx.lineTo(cx - 110, 760); ctx.closePath(); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 6);
        // chamber
        rr(ctx, cx - 140, 760, 280, 460, 20); ctx.fillStyle = "rgba(190,225,245,.25)"; ctx.fill(); ol(ctx, 6);
        ctx.save(); rr(ctx, cx - 140, 760, 280, 460, 20); ctx.clip(); const pressY = 790 + press * 330;
        const nP = t < tFeed ? 0 : Math.min(14, Math.floor((t - tFeed) * 6)); for (let i = 0; i < nP; i++){ const y = lerp(1180 - i * 26, 1190 - i * 4, press), x = cx + (rnd(i) - .5) * 160; ctx.save(); ctx.translate(x, Math.max(y, pressY + 30)); ctx.rotate((rnd(i + 5) - .5) * (1 - press)); ctx.fillStyle = PAPER; ctx.fillRect(-60, -10, 120, 18 * (1 - press * .7)); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-60, -10, 120, 18 * (1 - press * .7)); ctx.restore(); }
        ctx.fillStyle = "#5A6270"; ctx.fillRect(cx - 130, pressY - 20, 260, 30); ctx.fillRect(cx - 12, 700, 24, pressY - 700); ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(cx - 120, 780, 30, 420);
        // base with AI badge
        rr(ctx, cx - 190, 1220, 380, GY - 1220, 24); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 6);
        glowAt(ctx, cx, 1380, 160, "#7FD3FF", .4 + .2 * Math.sin(t * 6)); ctx.beginPath(); ctx.arc(cx, 1380, 72, 0, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 5); textC(ctx, "AI", cx, 1404, 64, "#7FD3FF", 900);
        for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(cx - 110 + i * 110, 1520, 14, 0, TAU); ctx.fillStyle = press > 0 && (Math.floor(t * 6) + i) % 3 === 0 ? "#4FD18B" : "#1E2A3E"; ctx.fill(); }
        // spout
        rr(ctx, cx + 180, 1160, 90, 34, 10); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5);
        ctx.restore();
        // stream + glass
        const gx = cx + 250, gTop = 1250, gBot = 1430;
        if (press > .1 && fill < 1){ ctx.fillStyle = "#F4A23A"; ctx.fillRect(gx - 8, 1194, 16, gBot - 1194 - fill * (gBot - gTop - 20)); }
        rr(ctx, gx - 120, gBot, 240, GY - gBot, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 5);
        ctx.save(); ctx.beginPath(); ctx.moveTo(gx - 80, gTop); ctx.lineTo(gx + 80, gTop); ctx.lineTo(gx + 64, gBot); ctx.lineTo(gx - 64, gBot); ctx.closePath(); ctx.fillStyle = "rgba(220,240,250,.35)"; ctx.fill(); ctx.clip();
        const fy = gBot - fill * (gBot - gTop - 20); ctx.fillStyle = "#F4A23A"; ctx.fillRect(gx - 90, fy + Math.sin(t * 8) * 3, 180, gBot - fy + 10); ctx.restore();
        ctx.beginPath(); ctx.moveTo(gx - 80, gTop); ctx.lineTo(gx + 80, gTop); ctx.lineTo(gx + 64, gBot); ctx.lineTo(gx - 64, gBot); ctx.closePath(); ol(ctx, 5);
        if (fill > .6){ const q = eBack(clamp((fill - .6) / .3, 0, 1)); ctx.save(); ctx.translate(gx, gBot - 70); ctx.scale(q, q); ctx.rotate(-.05); rr(ctx, -96, -26, 192, 52, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "1 PARAGRAF", 0, 11, 28, BROWN, 900, 176); ctx.restore(); }
        if (fill >= 1) for (let i = 0; i < 5; i++){ const a = t * 2 + i * TAU / 5; sparkle(ctx, gx + Math.cos(a) * 130, gTop + 60 + Math.sin(a) * 90, 12 + 4 * Math.sin(t * 6 + i), i % 2 ? GOLD : CREAM); }
      },
      front: (ctx2, c, sts) => { // pages flying from the hero's hands into the hopper
        if (t < tFeed || t > tPress + .3) return; const st = sts[0], h = st ? handOf(st) : [300, 1100];
        for (let i = 0; i < 6; i++){ const q = ((t - tFeed) * 1.4 + i / 6) % 1, x = lerp(h[0], cx + (rnd(i) - .5) * 120, q), y = lerp(h[1], 640, q) - Math.sin(q * Math.PI) * 260;
          ctx.save(); ctx.translate(x, y); ctx.rotate(q * 8 + i); ctx.fillStyle = PAPER; ctx.fillRect(-36, -46, 72, 92); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-36, -46, 72, 92); ctx.fillStyle = "#C9B9A2"; for (let l = 0; l < 4; l++) ctx.fillRect(-24, -30 + l * 18, 44, 6); ctx.restore(); } },
      over: () => { const k = t - tCount; if (k < 0 || k > 3.4) return; const n = Math.max(0, 10 - Math.floor(k / .25)), q = eBack(clamp(k / .3, 0, 1)), out = clamp((k - 2.9) / .5, 0, 1);
        ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(925, 300); ctx.scale(q * .85, q * .85); ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(0, 0, 80, -Math.PI / 2, -Math.PI / 2 + TAU * (n / 10)); ctx.strokeStyle = HL; ctx.lineWidth = 14; ctx.stroke(); textC(ctx, String(n), 0, 30, 84, "#FFFFFF", 900); textC(ctx, "DETIK", 0, 150, 32, "#FFFFFF", 900); ctx.restore(); } });
  }, sfxWith((s, f, i, add) => { const J = f.juice || {}; if (J.feedCue){ const t0 = cueT(s, J.feedCue, .2, i); for (let k = 0; k < 4; k++) add(t0 + k * .3, "whoosh"); } if (J.countCue) add(cueT(s, J.countCue, .35, i), "ping"); if (J.pressCue){ const t0 = cueT(s, J.pressCue, .55, i); add(t0, "pop"); add(t0 + 2, "chime"); } }));

  /* ================= _jaring: fishing net, small important fish slip through ================= */
  TT.scene(PX + "jaring", "Cerita: pantai, jaring rangkuman ditarik dari laut, ikan kecil penting (angka, tanggal, keputusan) lolos lalu dicek", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, N = Object.assign({ x: 700 }, f0.net || {}), fish = N.fish || [];
    const tUp = T(s, N.upCue, .2, idx), tChk = T(s, N.checkCue, .6, idx), up = t < tUp ? 0 : eOut(clamp((t - tUp) / 1.1, 0, 1)), ny = lerp(1500, 0, up);
    const pul = [N.x + 120, 440], binder = [N.bx ?? 640, N.by ?? 1420];
    base(ctx, s, t, { env: "beach", envOpt: { palmX: 1060 },
      spots: { net: [N.x, 900, 1.1], binder: [binder[0], 1300, 1.0] },
      back: (ctx2, c, sts) => {
        // boom / pulley
        ctx.strokeStyle = "#7A4A2B"; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(N.x + 320, GY); ctx.lineTo(pul[0] + 20, pul[1] - 30); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
        ctx.beginPath(); ctx.arc(pul[0], pul[1], 34, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5);
        const st = sts[0]; if (st){ const h = handOf(st); ctx.strokeStyle = "#E8D6B0"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(pul[0] - 30, pul[1]); ctx.stroke(); }
        ctx.strokeStyle = "#E8D6B0"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(pul[0], pul[1]); ctx.lineTo(N.x, 600 + ny); ctx.stroke();
        // net bag
        ctx.save(); ctx.translate(N.x + Math.sin(t * 2) * 10 * up, ny); const sway = Math.sin(t * 2.2) * .04; ctx.rotate(sway);
        const bag = () => { ctx.beginPath(); ctx.moveTo(-180, 620); ctx.quadraticCurveTo(-240, 900, -120, 1040); ctx.quadraticCurveTo(0, 1110, 120, 1040); ctx.quadraticCurveTo(240, 900, 180, 620); ctx.closePath(); };
        bag(); ctx.fillStyle = "rgba(60,90,110,.18)"; ctx.fill();
        fishDraw(ctx, -30, 820, .85, t, "#7FA3C9", "TOPIK", { seed: 1 }); fishDraw(ctx, 20, 950, .8, t, "#9C8FCB", "INTI", { flip: true, seed: 2 });
        fish.forEach((fi, n) => { const tf = T(s, fi.cue, .3 + n * .2, idx); if (t >= tf) return; fishDraw(ctx, -60 + n * 60, 1030 - (n % 2) * 30, .4, t, GOLD, "", { seed: n + 4, glow: true }); });
        ctx.save(); bag(); ctx.clip(); ctx.strokeStyle = "#3B4A6B"; ctx.lineWidth = 4; for (let k = -12; k <= 12; k++){ ctx.beginPath(); ctx.moveTo(-260 + k * 40, 600); ctx.lineTo(-60 + k * 40, 1120); ctx.stroke(); ctx.beginPath(); ctx.moveTo(260 + k * 40, 600); ctx.lineTo(60 + k * 40, 1120); ctx.stroke(); } ctx.restore();
        bag(); ol(ctx, 6, "#3B4A6B"); rr(ctx, -190, 600, 380, 30, 14); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 4);
        ctx.restore();
        if (up > 0 && up < 1) for (let i = 0; i < 8; i++){ const q = (t * 2 + i / 8) % 1; ctx.save(); ctx.globalAlpha = 1 - q; ctx.fillStyle = "#DFF3FA"; ctx.beginPath(); ctx.arc(N.x + (rnd(i) - .5) * 400, 1300 + ny * .2 - q * 200, 12, 0, TAU); ctx.fill(); ctx.restore(); }
        // the original document on the sand
        const qb = pin(t, tChk, .4); if (qb > 0){ ctx.save(); ctx.translate(binder[0], binder[1]); ctx.scale(qb, qb); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 40, 230, 30, 0, 0, TAU); ctx.fill();
          rr(ctx, -220, -110, 440, 150, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 5); rr(ctx, -200, -100, 190, 130, 8); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 3); rr(ctx, 10, -100, 190, 130, 8); ctx.fill(); ol(ctx, 3);
          ctx.fillStyle = "#C9B9A2"; for (let l = 0; l < 4; l++){ ctx.fillRect(-180, -80 + l * 26, 150, 8); ctx.fillRect(30, -80 + l * 26, 150, 8); } ctx.restore();
          ctx.save(); ctx.translate(binder[0], binder[1] - 170); ctx.scale(qb, qb); rr(ctx, -180, -34, 360, 68, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, "DOKUMEN ASLI", 0, 13, 36, TEAL, 900, 340); ctx.restore(); }
        // escaping fish
        fish.forEach((fi, n) => { const tf = T(s, fi.cue, .3 + n * .2, idx), k = t - tf; if (k < 0) return;
          const sx = N.x - 60 + n * 60, sy = 1030 + ny - (n % 2) * 30, ex = 960 - n * 40, ey = 1250;
          let x, y, rot = 0, sc = .5, show = true;
          if (t < tChk){ const q = clamp(k / 1.1, 0, 1); x = lerp(sx, ex, q); y = lerp(sy, ey, q) - Math.sin(q * Math.PI) * 120 + (q > .7 ? (q - .7) * 300 : 0); rot = q * 1.2; show = q < 1; }
          else { const q = clamp((t - tChk - n * .35) / .8, 0, 1); x = lerp(ex, binder[0] - 130 + n * 130, eOut(q)); y = lerp(ey + 60, binder[1] - 60, q) - Math.sin(q * Math.PI) * 420; rot = -1 + q; show = true; sc = .5 + .1 * q; }
          if (show){ fishDraw(ctx, x, y, sc, t, GOLD, "", { seed: n + 4, glow: true, rot }); }
        });
      },
      over: (ctx2, c) => { fish.forEach((fi, n) => { const tf = T(s, fi.cue, .3 + n * .2, idx), k = t - tf; if (k < 0) return;
          if (t < tChk){ const q = clamp(k / 1.1, 0, 1), p = c.toScreen(lerp(N.x - 60 + n * 60, 960 - n * 40, q), lerp(1030 + ny, 1250, q) - Math.sin(q * Math.PI) * 120);
            if (k < 2.2) popChip(ctx, fi.label, clamp(p[0] - 60, 200, 880), Math.min(p[1] - 110, 1160), k, GOLD, BROWN, 40, -.06); }
          else { const q = clamp((t - tChk - n * .35) / .8, 0, 1); if (q >= 1){ const p = c.toScreen(binder[0] - 150 + n * 150, binder[1] - 300); popChip(ctx, "✓ " + fi.label, p[0], p[1] - 70 * (n % 2), t - tChk - n * .35 - .8, GREEN, "#FFFFFF", 32, 0); } } }); } });
  }, sfxWith((s, f, i, add) => { const N = f.net || {}; if (N.upCue) add(cueT(s, N.upCue, .2, i), "whoosh"); (N.fish || []).forEach((fi, n) => add(cueT(s, fi.cue, .3 + n * .2, i), "pop")); if (N.checkCue){ const t0 = cueT(s, N.checkCue, .6, i); (N.fish || []).forEach((fi, n) => add(t0 + n * .35 + .8, "chime")); } }));

  /* ================= _stabilo: highlight & match ================= */
  TT.scene(PX + "stabilo", "Cerita: lembar rangkuman melayang, stabilo raksasa menandai angka/tanggal/keputusan, dicocokkan, kirim", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Hq = Object.assign({ x: 600, y: 430, w: 600 }, f0.hl || {}), lines = Hq.lines || [];
    const tM = T(s, Hq.matchCue, .5, idx), tS = T(s, Hq.sendCue, .85, idx), fly = t < tS + .5 ? 0 : clamp((t - tS - .5) / .7, 0, 1);
    base(ctx, s, t, { env: "home", envOpt: { lampX: 980 },
      spots: { sheet: [Hq.x, Hq.y + 260, 1.12] },
      back: () => {
        const x0 = Hq.x - Hq.w / 2, y0 = Hq.y + Math.sin(t * 1.4) * 8, h = 140 + lines.length * 96 + 110;
        ctx.save(); ctx.translate(fly * 900, -fly * 300); ctx.rotate(fly * .4);
        glowAt(ctx, Hq.x, y0 + h / 2, 520, "#FFE3A8", .25);
        ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; rr(ctx, x0, y0, Hq.w, h, 20); ctx.fillStyle = PAPER; ctx.fill(); ctx.restore(); rr(ctx, x0, y0, Hq.w, h, 20); ol(ctx, 6);
        rr(ctx, x0, y0, Hq.w, 90, [20, 20, 0, 0]); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 5); sparkle(ctx, x0 + 56, y0 + 45, 24, GOLD); textC(ctx, "RANGKUMAN AI", Hq.x + 20, y0 + 60, 40, "#FFFFFF", 900, Hq.w - 140);
        lines.forEach((L, n) => { const y = y0 + 150 + n * 96, th0 = L.cue ? T(s, L.cue, .3 + n * .2, idx) : 1e9, hq = clamp((t - th0) / .5, 0, 1);
          if (hq > 0){ ctx.fillStyle = hexA("#FFE45C", .85); rr(ctx, x0 + 30, y - 46, (Hq.w - 150) * hq, 64, 10); ctx.fill(); }
          font(ctx, 700, 44, FAM); ctx.fillStyle = L.cue ? BROWN : "#9A8A78"; fit(ctx, L.text, Hq.w - 170, 44, 700); ctx.fillText(L.text, x0 + 44, y);
          const tc = tM + n * .45; if (L.cue && t > tc + .5){ const q = eBack(clamp((t - tc - .5) / .3, 0, 1)); ctx.save(); ctx.translate(x0 + Hq.w - 56, y - 14); ctx.scale(q, q); check(ctx, 0, 2, 1.6, GREEN); ctx.restore(); }
          // the highlighter pen while marking
          if (hq > 0 && hq < 1){ const px = x0 + 30 + (Hq.w - 150) * hq; ctx.save(); ctx.translate(px, y - 40); ctx.rotate(-.7); rr(ctx, -22, -200, 44, 200, 12); ctx.fillStyle = "#FFE45C"; ctx.fill(); ol(ctx, 5); rr(ctx, -22, -200, 44, 60, 12); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 5);
            ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.lineTo(8, 26); ctx.lineTo(-8, 26); ctx.closePath(); ctx.fillStyle = "#E2C23A"; ctx.fill(); ol(ctx, 4); ctx.restore(); } });
        // send button
        const by = y0 + h - 70, pr = t > tS && t < tS + .3 ? .88 : 1; ctx.save(); ctx.translate(Hq.x, by); ctx.scale(pr, pr); rr(ctx, -130, -36, 260, 72, 36); ctx.fillStyle = t > tS ? GREEN : ORANGE; ctx.fill(); ol(ctx, 5); textC(ctx, t > tS ? "TERKIRIM ✓" : "KIRIM", 0, 14, 36, "#FFFFFF", 900, 230); ctx.restore();
        ctx.restore();
        if (fly > 0 && fly < 1){ ctx.save(); ctx.globalAlpha = 1 - fly; ctx.strokeStyle = CREAM; ctx.lineWidth = 8; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.moveTo(Hq.x - 200 + fly * 700, y0 + 100 + i * 90); ctx.lineTo(Hq.x - 500 + fly * 700, y0 + 140 + i * 90); ctx.stroke(); } ctx.restore(); }
        // original binder; highlighted strips fly over as page tabs
        const qb = pin(t, tM - .3, .4), bxc = Hq.x + Hq.w / 2 + 60, byc = Hq.y + 330 + Math.sin(t * 2) * 8;
        if (qb > 0 && fly < .5){ ctx.save(); ctx.translate(bxc, byc); ctx.scale(qb * .85, qb * .85); drawItem(ctx, "binder", 0, 0, t, { text: "ASLI" }); ctx.restore();
          const TC = [GOLD, "#FF8A6A", "#7FD39B"]; let k2 = 0;
          lines.forEach((L, n) => { if (!L.cue) return; const m = k2++, tc = tM + m * .45; if (t < tc) return; const q = clamp((t - tc) / .5, 0, 1), y = Hq.y + 136 + n * 96;
            const sx = x0 + Hq.w - 120, ex = bxc + 70, ey = byc - 80 + m * 56, x = lerp(sx, ex, eOut(q)), yy = lerp(y, ey, q) - Math.sin(q * Math.PI) * 120;
            ctx.save(); ctx.translate(x, yy); ctx.rotate((1 - q) * .6); rr(ctx, -10, -18, 70, 36, 6); ctx.fillStyle = TC[m % 3]; ctx.fill(); ol(ctx, 4); ctx.restore(); });
          const tAll = tM + (k2 - 1) * .45 + .6; if (t > tAll){ glowAt(ctx, bxc, byc, 200, "#7FD39B", .35 + .15 * Math.sin(t * 6)); if (t - tAll < .9) burstFx(ctx, bxc, byc, t - tAll, GREEN, 10, 180); } }
      } });
  }, sfxWith((s, f, i, add) => { const Hq = f.hl || {}; (Hq.lines || []).forEach((L, n) => { if (L.cue) add(cueT(s, L.cue, .3 + n * .2, i), "whoosh"); }); if (Hq.matchCue){ const t0 = cueT(s, Hq.matchCue, .5, i); (Hq.lines || []).forEach((L, n) => { if (L.cue) add(t0 + n * .45, "chime"); }); } if (Hq.sendCue){ const t0 = cueT(s, Hq.sendCue, .85, i); add(t0, "pop"); add(t0 + .5, "whoosh"); } }));

  /* ================= JS: mugs ================= */
  function racks(ctx, t){
    ctx.fillStyle = "#D8CBB6"; ctx.fillRect(-700, 300, 2480, GY - 300);
    for (let r = 0; r < 3; r++){ const x0 = -380 + r * 640; ctx.fillStyle = "#4A6FA5"; [x0, x0 + 560].forEach(x => { ctx.fillRect(x, 420, 26, GY - 420); });
      for (let l = 0; l < 4; l++){ const y = 600 + l * 270; ctx.fillStyle = "#F08C2E"; ctx.fillRect(x0, y, 586, 22); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(x0, y, 586, 22);
        for (let b = 0; b < 4; b++){ if (rnd(r * 13 + l * 5 + b) < .25) continue; const bw = 100 + rnd(r + l + b) * 30, bh = 90 + rnd(b * 3 + l) * 60; rr(ctx, x0 + 30 + b * 135, y - bh, bw, bh, 4); ctx.fillStyle = b % 2 ? "#D9A066" : "#C98F58"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = "rgba(142,78,46,.5)"; ctx.fillRect(x0 + 30 + b * 135 + bw / 2 - 6, y - bh, 12, bh); } } }
    ctx.fillStyle = "#BFAE95"; ctx.fillRect(-700, GY - 10, 2480, 40); }
  TT.scene(PX + "truk", "Cerita: truk pengiriman potong-lintang, mug berwajah terguncang polisi tidur dan retak, keluhan menghitung", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Tk = Object.assign({ x: 520 }, f0.truck || {});
    const tB = T(s, Tk.bumpCue, .4, idx), tC = T(s, Tk.countCue, .25, idx), tL = T(s, Tk.leaveCue, .55, idx);
    const kB = t - tB, jolt = kB > 0 && kB < .8 ? Math.sin(kB / .8 * Math.PI * 3) * 40 * (1 - kB / .8) : 0, idle = Math.sin(t * 14) * 4;
    const xOff = t < tL ? 0 : Math.pow(clamp((t - tL) / 1.2, 0, 1), 2) * 1600, X = Tk.x + xOff;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { cargo: [Tk.x - 80, 1300, 1.15] },
      back: () => {
        ctx.fillStyle = hexA("#FFFFFF", .7); for (let i = 0; i < 9; i++){ const x = 1500 - ((t * (t < tL ? 700 : 300) + i * 320) % 3000); ctx.fillRect(x, GY + 60, 150, 14); }
        // speed bump
        const bx = Tk.x - 120; ctx.beginPath(); ctx.ellipse(bx, GY + 4, 110, 26, 0, Math.PI, TAU); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 4); for (let k = 0; k < 3; k++){ ctx.fillStyle = OUT; ctx.fillRect(bx - 70 + k * 50, GY - 20, 20, 20); }
        ctx.save(); ctx.translate(X, -jolt - idle);
        const c0 = -420, c1 = 200, top = 1100, bot = 1520;
        rr(ctx, c0, top, c1 - c0, bot - top, 16); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 7);
        rr(ctx, c0 + 40, top + 50, c1 - c0 - 80, bot - top - 90, 12); ctx.fillStyle = "#6B4A3A"; ctx.fill(); ol(ctx, 5);
        textC(ctx, "KIRIM CEPAT", (c0 + c1) / 2, top + 36, 30, ORANGE, 900);
        ctx.fillStyle = "#8E5A34"; ctx.fillRect(c0 + 40, bot - 70, c1 - c0 - 80, 30);
        for (let i = 0; i < 4; i++){ const jx = kB > 0 && kB < 1 ? Math.sin(kB * 20 + i) * 16 * (1 - kB) : Math.sin(t * 14 + i) * 3, jy = kB > 0 && kB < .6 ? -Math.abs(Math.sin(kB / .6 * Math.PI)) * (60 + i * 15) : 0;
          mugChar(ctx, c0 + 110 + i * 130 + jx, bot - 70 + jy, .95, t, { seed: i, face: kB > 0 ? "hurt" : "scared", crack: kB > 0 ? clamp((kB - .2) / .6, 0, 1) * (i % 2 ? 1 : .7) : 0, col: ["#F3E2C7", "#CFE3F0", "#F6D5D5", "#E6E9C8"][i], band: [ORANGE, TEAL, RED, GREEN][i], tilt: jx * .01 }); }
        // cab
        ctx.beginPath(); ctx.moveTo(c1 + 10, bot); ctx.lineTo(c1 + 10, top + 120); ctx.lineTo(c1 + 190, top + 120); ctx.lineTo(c1 + 290, top + 260); ctx.lineTo(c1 + 300, bot); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 7);
        ctx.beginPath(); ctx.moveTo(c1 + 50, top + 150); ctx.lineTo(c1 + 180, top + 150); ctx.lineTo(c1 + 255, top + 260); ctx.lineTo(c1 + 50, top + 260); ctx.closePath(); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
        rr(ctx, c0 - 10, bot - 10, c1 - c0 + 320, 50, 10); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 5);
        ctx.restore();
        [Tk.x - 300, Tk.x + 40, Tk.x + 380].forEach((wx, n) => { ctx.save(); ctx.translate(wx + xOff, 1580 - jolt * (n === 1 ? 1 : .5) * 0); ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill();
          ctx.rotate(t * 14); ctx.strokeStyle = "#5A6270"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(24, 0); ctx.stroke(); ctx.restore(); });
        if (t < tL) for (let i = 0; i < 5; i++){ const q = (t * 1.5 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .5 * (1 - q); puffC(ctx, Tk.x - 470 - q * 260 + xOff, 1560 - q * 60, 30 + q * 40, "#E3D8C8"); ctx.restore(); }
      },
      over: (ctx2, c) => {
        if (kB > .1 && kB < 1.3){ const p = c.toScreen(Tk.x - 120 + xOff, 1250); popWord(ctx, "PRAK!", p[0], p[1] - 380, kB - .1, { size: 110, rot: -8, hold: 1.1, col: RED }); }
        const k = t - tC; if (k > 0){ const n = Math.min(12, Math.floor(k / .09)), q = eBack(clamp(k / .35, 0, 1)), out = t > tL + 1.2 ? clamp((t - tL - 1.2) / .4, 0, 1) : 0; if (out >= 1) return;
          ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(540, 360); ctx.scale(q, q); ctx.rotate(-.02); rr(ctx, -330, -90, 660, 180, 26); ctx.fillStyle = NAVY; ctx.fill(); ol(ctx, 6);
          textC(ctx, "KELUHAN MASUK", -90, -24, 38, "#A9BCDD", 900); textC(ctx, String(n), 210, 60, 140, n >= 12 ? "#FF6A55" : "#FFFFFF", 900);
          for (let i = 0; i < Math.min(n, 12); i++){ const x = -290 + (i % 6) * 66, y = 30 + Math.floor(i / 6) * 46; ctx.beginPath(); ctx.arc(x, y, 20, 0, TAU); ctx.fillStyle = "#FF8A5A"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = OUT; ctx.fillRect(x - 9, y - 6, 5, 5); ctx.fillRect(x + 4, y - 6, 5, 5); ctx.beginPath(); ctx.arc(x, y + 12, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
          ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const Tk = f.truck || {}; if (Tk.bumpCue){ const t0 = cueT(s, Tk.bumpCue, .4, i); add(t0, "pop"); add(t0 + .2, "ping"); } if (Tk.countCue){ const t0 = cueT(s, Tk.countCue, .25, i); for (let k = 0; k < 4; k++) add(t0 + k * .27, "pop"); } if (Tk.leaveCue) add(cueT(s, Tk.leaveCue, .55, i), "whoosh"); }));

  TT.scene(PX + "peluit", "Cerita: gudang, tim berlarian bawa kardus, peluit, semua membeku, papan evaluasi beroda masuk", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Wh = Object.assign({ bx: 620 }, f0.wh || {});
    const tW = T(s, Wh.whistleCue, .3, idx), tF = T(s, Wh.freezeCue, .4, idx), tBd = T(s, Wh.boardCue, .6, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: -900, rug: false },
      spots: { board: [Wh.bx, 820, 1.1] },
      back: () => { racks(ctx, t);
        const q = t < tBd ? 0 : clamp((t - tBd) / .9, 0, 1), x = lerp(1500, Wh.bx, eBack(q)); if (q > 0){ ctx.save(); ctx.translate(x, 0);
          ctx.strokeStyle = "#5A6270"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-260, 900); ctx.lineTo(-260, GY - 40); ctx.moveTo(260, 900); ctx.lineTo(260, GY - 40); ctx.moveTo(-300, GY - 40); ctx.lineTo(300, GY - 40); ctx.stroke();
          [-280, 280].forEach(wx => { ctx.beginPath(); ctx.arc(wx, GY - 22, 20, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); });
          rr(ctx, -330, 520, 660, 400, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8);
          const cols = [["APA?", RED], ["KENAPA?", ORANGE], ["UBAH?", GREEN]]; cols.forEach(([lb, col], n) => { const cx = -220 + n * 220; rr(ctx, cx - 100, 545, 200, 62, 10); ctx.fillStyle = col; ctx.fill(); textC(ctx, lb, cx, 589, 36, "#FFFFFF", 900, 186);
            if (n > 0){ ctx.strokeStyle = "#D6CFC4"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 110, 620); ctx.lineTo(cx - 110, 900); ctx.stroke(); }
            ctx.fillStyle = "#E5DED2"; for (let l = 0; l < 3; l++) ctx.fillRect(cx - 80, 650 + l * 70, 160 - l * 30, 12); });
          ctx.restore(); }
      },
      over: (ctx2, c, sts, R) => { const k = t - tF; if (k > 0 && k < 1.6){ ctx.save(); ctx.globalAlpha = (1 - k / 1.6) * .5; ctx.strokeStyle = "#BFE7FF"; ctx.lineWidth = 6;
          (sts || []).forEach((st, j) => { if (j === 0 || !R[j]) return; const p = R[j].screen.head; for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.beginPath(); ctx.moveTo(p[0] + Math.cos(a) * 130, p[1] + Math.sin(a) * 130); ctx.lineTo(p[0] + Math.cos(a) * 170, p[1] + Math.sin(a) * 170); ctx.stroke(); } }); ctx.restore(); }
        const kw = t - tW; if (kw > 0 && kw < 1.2 && R[0]){ const p = R[0].screen.head; popWord(ctx, "PRIIIT!", clamp(p[0] + 220, 300, 800), p[1] - 230, kw, { size: 96, rot: -8, hold: 1.1 }); } } });
  }, sfxWith((s, f, i, add) => { const Wh = f.wh || {}; if (Wh.whistleCue) add(cueT(s, Wh.whistleCue, .3, i), "ping"); if (Wh.freezeCue) add(cueT(s, Wh.freezeCue, .4, i), "pop"); if (Wh.boardCue) add(cueT(s, Wh.boardCue, .6, i), "whoosh"); }));

  // big cut-away shipping box with crammed mugs
  TT.scene(PX + "mug", "Cerita: lab, kardus potong-lintang, mug berdesakan selapis tanpa sekat, saling benturan dan retak", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Bx = Object.assign({ x: 650, top: 760, bot: 1300, w: 640 }, f0.box || {});
    const tCr = T(s, Bx.crackCue, .3, idx), tWr = T(s, Bx.wrapCue, .45, idx), tWa = T(s, Bx.wallCue, .6, idx), tBu = T(s, Bx.bumpCue, .8, idx);
    const kb = t - tBu, shake = kb > 0 ? Math.sin(t * 22) * 18 * Math.max(.25, 1 - kb / 2.5) : Math.sin(t * 3) * 2;
    const x0 = Bx.x - Bx.w / 2, x1 = Bx.x + Bx.w / 2;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 650 },
      spots: { box: [Bx.x, 1060, 1.12] },
      back: () => {
        ctx.save(); ctx.translate(shake, 0);
        ctx.beginPath(); ctx.moveTo(x0, Bx.top); ctx.lineTo(x0 + 80, Bx.top - 70); ctx.lineTo(x1 + 80, Bx.top - 70); ctx.lineTo(x1, Bx.top); ctx.closePath(); ctx.fillStyle = "#E4B67E"; ctx.fill(); ol(ctx, 5);
        ctx.beginPath(); ctx.moveTo(x1, Bx.top); ctx.lineTo(x1 + 80, Bx.top - 70); ctx.lineTo(x1 + 80, Bx.bot - 70); ctx.lineTo(x1, Bx.bot); ctx.closePath(); ctx.fillStyle = "#B98450"; ctx.fill(); ol(ctx, 5);
        rr(ctx, x0, Bx.top, Bx.w, Bx.bot - Bx.top, 6); ctx.fillStyle = "#7A5236"; ctx.fill(); ol(ctx, 6);
        ctx.fillStyle = "#D9A066"; ctx.fillRect(x0, Bx.top, Bx.w, 40); ctx.fillRect(x0, Bx.bot - 30, Bx.w, 30); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x0, Bx.top, Bx.w, Bx.bot - Bx.top);
        const wrap = t > tWr ? 1 : 0;
        for (let i = 0; i < 4; i++){ const jx = kb > 0 ? Math.sin(kb * 9 + i * 1.7) * 26 * Math.max(.3, 1 - kb / 3) : 0, cr = (i === 1 && t > tCr ? clamp((t - tCr) / .5, 0, 1) : 0) + (kb > 0 ? clamp((kb - .3 - i * .2) / .8, 0, 1) * (i % 2 ? .9 : .6) : 0);
          mugChar(ctx, x0 + 95 + i * 150 + jx, Bx.bot - 34, 1.15, t, { seed: i, face: kb > 0 || (i === 1 && t > tCr) ? "hurt" : "scared", crack: Math.min(1, cr), wrap, col: ["#F3E2C7", "#CFE3F0", "#F6D5D5", "#E6E9C8"][i], band: [ORANGE, TEAL, RED, GREEN][i], tilt: jx * .006 }); }
        // missing dividers
        const qw = t < tWa ? 0 : clamp((t - tWa) / .4, 0, 1); if (qw > 0){ ctx.save(); ctx.globalAlpha = qw * (.6 + .4 * Math.sin(t * 6)); ctx.strokeStyle = "#FF6A55"; ctx.lineWidth = 6; ctx.setLineDash([18, 12]);
          for (let i = 1; i < 4; i++){ const x = x0 + 20 + i * 150; ctx.beginPath(); ctx.moveTo(x, Bx.top + 60); ctx.lineTo(x, Bx.bot - 34); ctx.stroke(); } ctx.setLineDash([]); ctx.restore(); }
        ctx.restore();
      },
      over: (ctx2, c) => {
        if (t > tWr){ const p = c.toScreen(x0 + 120, Bx.top + 180); popChip(ctx, "BUNGKUS SELAPIS", p[0] + 120, p[1] - 140, t - tWr, "#CFEAF5", BROWN, 36, -.04); }
        if (t > tWa){ const p = c.toScreen(Bx.x + 120, Bx.top + 230); popChip(ctx, "✕ TANPA SEKAT", p[0], p[1], t - tWa, RED, "#FFFFFF", 38, .04); }
        if (kb > 0){ for (let n = 0; n < 3; n++){ const kk = kb - n * .5; if (kk < 0 || kk > .6) continue; const p = c.toScreen(x0 + 170 + n * 150, Bx.bot - 200); popWord(ctx, n % 2 ? "AW!" : "TUK!", p[0], p[1] - 90, kk, { size: 72, rot: n % 2 ? 8 : -8, hold: .6 }); } }
        if (t > tCr && t - tCr < 1){ const p = c.toScreen(x0 + 245, Bx.bot - 180); popWord(ctx, "KRAK", p[0], p[1] - 70, t - tCr, { size: 64, rot: 6, hold: .9, col: RED }); } } });
  }, sfxWith((s, f, i, add) => { const Bx = f.box || {}; if (Bx.crackCue) add(cueT(s, Bx.crackCue, .3, i), "ping"); if (Bx.wrapCue) add(cueT(s, Bx.wrapCue, .45, i), "pop"); if (Bx.wallCue) add(cueT(s, Bx.wallCue, .6, i), "pop"); if (Bx.bumpCue){ const t0 = cueT(s, Bx.bumpCue, .8, i); for (let k = 0; k < 3; k++) add(t0 + k * .5, "pop"); } }));

  // capsule rooms for the mugs; then the customer's home
  TT.scene(PX + "kapsul", "Cerita: meja kemas, tiap mug dapat kamar kapsul, dua lapis selimut, tag PECAH BELAH, tidur nyenyak; lalu rumah pelanggan bintang lima", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Cp = Object.assign({ x: 560, top: 860, bot: 1250, w: 600 }, f0.cap || {});
    const tW1 = T(s, Cp.wrapCue, .2, idx), tW2 = tW1 + .5, tDv = T(s, Cp.wallCue, .45, idx), tTag = T(s, Cp.tagCue, .6, idx), tOpen = T(s, Cp.openCue, .3, idx), tStar = T(s, Cp.starCue, .8, idx);
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: -900, rug: false },
      spots: { box: [Cp.x, 1080, 1.15] },
      back: (ctx2, c, sts, R) => { if (!R.f.home) racks(ctx, t); },
      front: (ctx2, c, sts, R) => {
        if (!R.f.home){
          const x0 = Cp.x - Cp.w / 2, shake = t > tTag + 1 ? Math.sin(t * 20) * 8 : 0;
          rr(ctx, 120, Cp.bot, 860, 44, 10); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#7A4A2B"; ctx.fillRect(150, Cp.bot + 44, 780, GY - Cp.bot); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(150, Cp.bot + 44, 780, GY - Cp.bot);
          ctx.save(); ctx.translate(shake, 0);
          rr(ctx, x0, Cp.top, Cp.w, Cp.bot - Cp.top, 6); ctx.fillStyle = "#7A5236"; ctx.fill(); ol(ctx, 6);
          const wr = t > tW2 ? 2 : t > tW1 ? 1 : 0, sleep = t > tTag + .8;
          const cw = Cp.w / 4; for (let i = 0; i < 4; i++){ const cx = x0 + cw / 2 + i * cw; ctx.fillStyle = "#FFE9C2"; ctx.globalAlpha = t > tDv ? .35 : 0; ctx.fillRect(cx - cw / 2 + 5, Cp.top + 20, cw - 10, Cp.bot - Cp.top - 40); ctx.globalAlpha = 1;
            mugChar(ctx, cx, Cp.bot - 30, cw / 150, t, { seed: i, face: sleep ? "sleep" : (wr ? "happy" : "neutral"), wrap: wr, blanket: ["#E07A9B", "#7FA563", "#5B7DB1", "#E8A55B"][i], col: ["#F3E2C7", "#CFE3F0", "#F6D5D5", "#E6E9C8"][i], band: [ORANGE, TEAL, RED, GREEN][i] }); }
          if (t > tDv){ for (let i = 1; i < 4; i++){ const q = clamp((t - tDv - i * .12) / .35, 0, 1), x = x0 + i * cw; ctx.fillStyle = "#D9A066"; ctx.fillRect(x - 8, lerp(Cp.top - 400, Cp.top, eOut(q)), 16, Cp.bot - Cp.top); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(x - 8, lerp(Cp.top - 400, Cp.top, eOut(q)), 16, Cp.bot - Cp.top); } }
          ctx.fillStyle = "#D9A066"; ctx.fillRect(x0, Cp.top, Cp.w, 26); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.strokeRect(x0, Cp.top, Cp.w, Cp.bot - Cp.top);
          if (t > tTag){ const q = eBack(clamp((t - tTag) / .4, 0, 1)); ctx.save(); ctx.translate(x0 + Cp.w - 40, Cp.top + 20); ctx.rotate(Math.sin(t * 3) * .12); ctx.scale(q, q); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.stroke();
            rr(ctx, -110, 14, 220, 150, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "PECAH", 0, 70, 40, "#FFFFFF", 900); textC(ctx, "BELAH", 0, 116, 40, "#FFFFFF", 900);
            ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-14, 130); ctx.lineTo(14, 130); ctx.moveTo(0, 130); ctx.lineTo(0, 150); ctx.stroke(); ctx.restore(); }
          ctx.restore();
        } else {
          // customer home: parcel on a low table, a happy mug pops out
          const bx = Cp.homeX ?? 700, ty = 1330; rr(ctx, bx - 260, ty, 520, 40, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#6B4426"; [bx - 230, bx + 200].forEach(x => { ctx.fillRect(x, ty + 40, 30, GY - ty - 40); });
          const op = t < tOpen ? 0 : eBack(clamp((t - tOpen) / .5, 0, 1));
          rr(ctx, bx - 150, ty - 200, 300, 200, 6); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5);
          [-1, 1].forEach(d => { ctx.save(); ctx.translate(bx + d * 150, ty - 200); ctx.rotate(-d * op * 2.2); rr(ctx, d < 0 ? 0 : -150, -10, 150, 20, 4); ctx.fillStyle = "#E4B67E"; ctx.fill(); ol(ctx, 4); ctx.restore(); });
          rr(ctx, bx - 110, ty - 150, 220, 60, 8); ctx.fillStyle = RED; ctx.fill(); textC(ctx, "PECAH BELAH", bx, ty - 108, 28, "#FFFFFF", 900, 200);
          if (op > 0){ const hop = Math.abs(Math.sin((t - tOpen) * 5)) * 30, y = ty - 200 - op * 120 - hop; glowAt(ctx, bx, y - 80, 200, "#FFE3A8", .5); mugChar(ctx, bx, y, 1.25, t, { face: "happy", seed: 2, col: "#CFE3F0", band: TEAL, tilt: Math.sin(t * 4) * .1 }); }
        } },
      over: () => { if (t > tStar){ for (let n = 0; n < 5; n++){ const k = t - tStar - n * .18; if (k < 0) continue; const q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(260 + n * 140, 330 + Math.sin(t * 3 + n) * 6); ctx.scale(q, q); ctx.rotate(Math.sin(t * 2 + n) * .1);
            ctx.fillStyle = GOLD; ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 26 : 60; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); } } } });
  }, sfxWith((s, f, i, add) => { const Cp = f.cap || {}; if (Cp.wrapCue){ const t0 = cueT(s, Cp.wrapCue, .2, i); add(t0, "pop"); add(t0 + .5, "pop"); } if (Cp.wallCue){ const t0 = cueT(s, Cp.wallCue, .45, i); for (let k = 1; k < 4; k++) add(t0 + k * .12 + .3, "pop"); } if (Cp.tagCue) add(cueT(s, Cp.tagCue, .6, i), "chime");
    if (Cp.openCue) add(cueT(s, Cp.openCue, .3, i), "whoosh"); if (Cp.starCue){ const t0 = cueT(s, Cp.starCue, .8, i); for (let k = 0; k < 5; k++) add(t0 + k * .18, "pop"); add(t0 + 1, "chime"); } }));

  /* ================= _kitiran: paper pinwheel with three blades ================= */
  TT.scene(PX + "kitiran", "Cerita: senja di bukit, kitiran kertas raksasa tiga baling-baling APA / KENAPA / UBAH menyala lalu berputar kencang", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {}, Pw = Object.assign({ x: 650, y: 740, r: 240, labels: ["APA", "KENAPA", "UBAH"] }, f0.pin || {}), cues = Pw.cues || [];
    const tB = cues.map((cu, n) => T(s, cu, .3 + n * .2, idx)), tSpin = (tB[2] ?? 1e9) + (Pw.spinDelay ?? .5);
    const COL = [RED, ORANGE, GREEN];
    const ang = (tt) => { const base0 = Math.sin(tt * 1.3) * .15 + tt * .25; if (tt < tSpin) return base0; const k = tt - tSpin; return base0 + 2.2 * k * k + Math.max(0, k - 1) * 0; };
    const spinV = t < tSpin ? 0 : Math.min(1, (t - tSpin) / 1.2);
    base(ctx, s, t, { env: "sunset", envOpt: { hills: true }, envFront: false,
      spots: { pin: [Pw.x, Pw.y + 120, 1.08] },
      back: (ctx2, c, sts) => {
        // wind streaks
        if (spinV > 0){ ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .6 * spinV); ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 9; i++){ const x = 1300 - ((t * 900 + i * 260) % 1800), y = 420 + i * 90; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 160, y - 10); ctx.stroke(); } ctx.restore(); }
      },
      front: (ctx2, c, sts) => {
        const st = sts[0], h = st ? handOf(st) : [480, 1270];
        ctx.strokeStyle = OUT; ctx.lineWidth = 22; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(h[0], h[1] + 40); ctx.lineTo(Pw.x, Pw.y); ctx.stroke(); ctx.strokeStyle = "#C98F58"; ctx.lineWidth = 14; ctx.stroke();
        const a0 = ang(t); glowAt(ctx, Pw.x, Pw.y, Pw.r * 1.5, "#FFE3A8", .25 + .35 * spinV);
        for (let n = 0; n < 3; n++){ const lit = ramp(t, tB[n], tB[n] + .3), a = a0 + n * TAU / 3, R = Pw.r;
          ctx.save(); ctx.translate(Pw.x, Pw.y); ctx.rotate(a);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, -R * .12); ctx.quadraticCurveTo(R * .95, R * .45, R * .35, R * .62); ctx.closePath();
          ctx.fillStyle = lit > 0 ? mixHex("#D8CFC2", COL[n], lit) : "#D8CFC2"; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R * .35, R * .62); ctx.lineTo(R * .25, R * .2); ctx.closePath(); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fill();
          if (lit > 0 && spinV < .35){ ctx.save(); ctx.globalAlpha *= 1 - spinV / .35; ctx.translate(R * .58, R * .16); ctx.rotate(-a); textC(ctx, Pw.labels[n], 0, 14, 42, "#FFFFFF", 900, 190); ctx.restore(); }
          if (lit > 0 && t - tB[n] < .8) burstFx(ctx, R * .55, R * .15, t - tB[n], COL[n], 8, 120);
          ctx.restore(); }
        if (spinV > .2){ ctx.save(); ctx.globalAlpha = .35 * spinV; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(Pw.x, Pw.y, Pw.r * (.5 + k * .22), a0 * 0 + t * 6 + k, t * 6 + k + 1.4); ctx.stroke(); } ctx.restore(); }
        ctx.beginPath(); ctx.arc(Pw.x, Pw.y, 26, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5);
      },
      over: (ctx2, c) => { if (t > tSpin + .5){ const p = c.toScreen(Pw.x, Pw.y - Pw.r - 90); popChip(ctx, "LEBIH BAIK!", p[0], Math.max(250, p[1]), t - tSpin - .5, CREAM, ORANGE, 46, -.05); } } });
  }, sfxWith((s, f, i, add) => { const Pw = f.pin || {}; (Pw.cues || []).forEach((cu, n) => add(cueT(s, cu, .3 + n * .2, i), "pop")); if ((Pw.cues || [])[2]){ const t0 = cueT(s, Pw.cues[2], .7, i) + (Pw.spinDelay ?? .5); add(t0, "whoosh"); add(t0 + .5, "chime"); } }));
})();
