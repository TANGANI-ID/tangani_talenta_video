/* Scene pack j2611221200514: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for SB39, SP39, RN39, KD39, JS39.
   Layout prefix j2611221200514_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots    [{at|cue, env, envOpt, toons, cam, props, cards, part, piece:false}]  hard cut (cream flash) to a new shot inside one scene
     hold     [{on, kind, at|cue, outCue, s, dx, dy, rot, n}]  object in a toon's hands: cable, marker, remote, plate, laptop, bag, notebook, coffee, lolli, iron
     mascots  [{kind: sepatu|bekal|bulan, x, y, s, at|cue, keys:[{at|cue, x, dur}], hop, label, sil (cue: silhouette until), outCue, face, open (cue)}]
     paddles  [{at|cue, outCue, text, x, y, col}]   judge score paddles (screen)      stamps [{at|cue, text, m (mascot idx) | x,y, col}]
     panda    [{on, at|cue}]  panda eyes on a toon      belts [{on, col, keys:[{at|cue, col}]}]  silat belt on a toon
     badges   [{on, at|cue, outCue, text, col}]  role chip over a toon's head      pops [{at|cue, text, x, y, size, rot, col}]
     confetti {at|cue}
   Set pieces (layout suffix):
     _adegan    generic story shot with the extras above
     _audisi    habit audition: lit marquee AUDISI KEBIASAAN, stage, judge table with X / gold buzzers; habit mascots perform,
                get a golden ticket (LOLOS) or are sent home (PULANG)                                     f.aud {tableX, lightCue, buzz:[{cue, kind:x|gold}]}
     _begadang  late-night series binge at home: TV flicker + autoplay countdown, wall clock hours; cut to the office:
                panda eyes, coffee cups stacking, missed meeting                                        f.tv {x, countCue, hours:[{cue, text}]}, f.cups {cues, x}
     _buru      treasure hunt in the office: cable under the desk, marker in a drawer, AC remote on the pantry shelf; each glints,
                pops out ("KETEMU!") and flies into the hunter's arms                                    f.hunt {items:[{kind, cue, label}]}
     _telat     meeting room waiting: NO SIGNAL projector, racing wall clock, seated colleagues behind a long table   f.room {clockFast}
     _komedi    the same Tuesday as a carousel: the hero rides a horse round and round past CARI KABEL / SPIDOL / REMOT signs,
                spins faster, gets dizzy, carousel stops                                                f.ride {spinCue, stopCue, rider (actor), signs:[..]}
     _kit       meeting kit case on a desk: foam cut-outs, items fly in and snap, lid checklist ticks, TEPAT WAKTU   f.kit {inCue, items:[{kind, cue}], checkCue, doneCue}
     _bazar     bazaar booth in the park: striped tent, bunting, products, cash box, speaker on a tripod that dies (smoke, mute)
                or is fixed (sparks -> music notes)                                                     f.bz {mode: mati|pulih, dieCue, fixCue, musicCue}
     _ribut     behind the booth: the whole team crowds one tangled cable inside a cartoon dust cloud; guests wait by an empty
                SELAMAT DATANG standee                                                                  f.dust {at|cue, x}
     _pit       imagination: race pit stop: the car slides in, crew with role tags work the wheels (sparks), timer, car blasts off   f.pit {enterCue, workCue, goCue, time}
     _tutorial  home at night: floating video player "10 FITUR RAHASIA", feature counter flips to 10/10, laptop glow   f.vid {countCue, endCue}
     _prasmanan imagination: buffet of spreadsheet features; lids pop, the plate tower grows and wobbles; cut to the office: features fly
                out of the head                                                                         f.buf {cues:[..], wobbleCue}, f.forget {cue}
     _silat     park dojo: guru and pupil in silat uniforms, JURUS sign, repetition counter, rhythmic strikes   f.silat {on, practiceCue, countCue, max}
     _sabuk     office: 14 day tiles tick, the belt over office clothes changes colour, FILTER chip taps, 60 -> 10 minute dial   f.sabuk {on, dayCue, endCue, filterCue, timeCue}
     _laundry   laundry shop: washers with spinning drums, shelves, counter, "PUAS KOK" tally board                f.shop {tally:[cues]}
     _seberang  street: Lina's laundry front and a rival laundry; customers walk past with bags              f.street {}
     _resleting laundry counter: the customer's mouth is zipped; the right question unzips it and feedback notes fly into a notebook   f.zip {on, openCue, notes:[{cue, text}], to} */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221200514_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const eIn = x => x * x * x;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
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
  function note(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, 0, 16, 12, -.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(13, -4); ctx.lineTo(13, -60); ctx.lineTo(40, -48); ctx.stroke(); ctx.restore(); }
  function check(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "cable"){ ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 12; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.ellipse(0, 0, 54 - i * 6, 40 - i * 4, .2 + i * .3, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(40, 20); ctx.quadraticCurveTo(80, 50, 70, 90); ctx.stroke(); rr(ctx, 52, 86, 36, 40, 6); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = OUT; ctx.fillRect(60, 120, 6, 14); ctx.fillRect(74, 120, 6, 14); }
    else if (kind === "marker"){ ctx.rotate(-.5); rr(ctx, -16, -70, 32, 120, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); rr(ctx, -16, -70, 32, 38, 10); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.moveTo(-10, 50); ctx.lineTo(10, 50); ctx.lineTo(0, 72); ctx.closePath(); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "remote"){ ctx.rotate(.3); rr(ctx, -30, -80, 60, 160, 18); ctx.fillStyle = "#F2F0EA"; ctx.fill(); ol(ctx, 5); rr(ctx, -20, -64, 40, 26, 6); ctx.fillStyle = "#8FD3C7"; ctx.fill();
      textC(ctx, "24°", 0, -45, 18, BROWN, 900); ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fillStyle = RED; ctx.fill(); for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(-12 + (i % 2) * 24, 34 + Math.floor(i / 2) * 22, 7, 0, TAU); ctx.fillStyle = "#B9B4AA"; ctx.fill(); } }
    else if (kind === "plate"){ const n = o.n || 0, wob = o.wob || 0; ctx.beginPath(); ctx.ellipse(0, 0, 90, 20, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      const cols = ["#E8A55B", "#7FA563", "#D9483B", "#F6C343", "#8E4E2E", "#F3D9B5", "#3E9B5A", "#E07A9B", "#C2691F", "#B9A58E"];
      for (let i = 0; i < n; i++){ const yy = -14 - i * 34, sway = Math.sin(t * 7 + i * .5) * wob * i * 4; ctx.beginPath(); ctx.ellipse(sway, yy, 64 - (i % 3) * 8, 22, (rnd(i) - .5) * .3, 0, TAU); ctx.fillStyle = cols[i % cols.length]; ctx.fill(); ol(ctx, 4);
        ctx.fillStyle = hexA("#FFFFFF", .5); ctx.beginPath(); ctx.ellipse(sway - 18, yy - 7, 14, 5, 0, 0, TAU); ctx.fill(); } }
    else if (kind === "laptop"){ ctx.fillStyle = "#544E42"; ctx.beginPath(); ctx.moveTo(-90, -130); ctx.lineTo(90, -130); ctx.lineTo(98, 0); ctx.lineTo(-98, 0); ctx.closePath(); ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fillRect(-78, -118, 156, 104); ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-64, -104 + k * 26, 50 + ((k * 37 + Math.floor(t * 3)) % 60), 10);
      rr(ctx, -112, 0, 224, 16, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); }
    else if (kind === "bag"){ const th = o.thick; ctx.rotate(-.05); rr(ctx, -80, -60, 160, 150, 16); ctx.fillStyle = th ? hexA("#DDEFF5", .95) : hexA("#EAF3F6", .8); ctx.fill(); ol(ctx, th ? 7 : 4, th ? TEAL : OUT);
      [["#5B7DB1", -40], ["#E8A55B", -5], ["#7FA563", 30]].forEach(([c, yy]) => { rr(ctx, -62, yy, 124, 30, 6); ctx.fillStyle = c; ctx.fill(); });
      ctx.strokeStyle = th ? TEAL : "#9AA6B2"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -64, 30, Math.PI, 0); ctx.stroke();
      if (o.torn){ ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(40, 60); ctx.lineTo(52, 74); ctx.lineTo(44, 84); ctx.lineTo(58, 96); ctx.stroke(); }
      if (th){ rr(ctx, -44, 64, 88, 30, 8); ctx.fillStyle = TEAL; ctx.fill(); textC(ctx, "TEBAL", 0, 87, 22, "#FFFFFF", 900); } }
    else if (kind === "notebook"){ ctx.rotate(-.1); rr(ctx, -70, -90, 140, 180, 10); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5); rr(ctx, -56, -76, 112, 152, 6); ctx.fillStyle = PAPER; ctx.fill();
      for (let i = 0; i < (o.n || 0); i++){ ctx.fillStyle = i % 2 ? ORANGE : TEAL; rr(ctx, -44, -60 + i * 30, 70 + rnd(i) * 18, 12, 6); ctx.fill(); } }
    else if (kind === "coffee"){ rr(ctx, -34, -80, 68, 80, 10); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-30, -66, 60, 14); }
    else if (kind === "lolli"){ ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-6, -40, 12, 220); ctx.beginPath(); ctx.arc(0, -110, 80, 0, TAU); ctx.fillStyle = o.go ? GREEN : RED; ctx.fill(); ol(ctx, 6); textC(ctx, o.go ? "GO" : "STOP", 0, -96, o.go ? 52 : 40, "#FFFFFF", 900); }
    else if (kind === "iron"){ ctx.beginPath(); ctx.moveTo(-80, 0); ctx.quadraticCurveTo(-70, -50, 0, -50); ctx.lineTo(60, -50); ctx.quadraticCurveTo(90, -30, 90, 0); ctx.closePath(); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-80, -6, 170, 12); rr(ctx, -40, -90, 90, 22, 10); ctx.fillStyle = BROWN; ctx.fill();
      for (let i = 0; i < 4; i++){ const q = (t * .8 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .7 * Math.sin(q * Math.PI); puffC(ctx, -40 + i * 30 + Math.sin(q * 6 + i) * 10, -100 - q * 120, 22 + q * 20, "#FFFFFF"); ctx.restore(); } }
    ctx.restore(); }

  /* ---------- habit mascots (world, origin = feet) ---------- */
  function mascot(ctx, kind, x, y, s, t, o){
    o = o || {}; const sil = !!o.sil, SC = "#1B2333", f = o.face || 1, seed = kind.length;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s); ctx.lineJoin = "round"; ctx.lineCap = "round";
    const fill = (c) => { ctx.fillStyle = sil ? SC : c; ctx.fill(); ol(ctx, 6, sil ? "#0C1220" : OUT); };
    const eyes = (ex, ey, sp, sleepy) => { if (sil) return; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(ex + d * sp, ey, 15, 18, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
        const bl = ((t + seed) % 3.1) < .12; if (sleepy || bl){ ctx.fillStyle = o.lidCol || "#F3E2A0"; ctx.beginPath(); ctx.ellipse(ex + d * sp, ey, 16, 19, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(ex + d * sp - 15, ey); ctx.lineTo(ex + d * sp + 15, ey); ol(ctx, 4); }
        ctx.beginPath(); ctx.arc(ex + d * sp + 4, ey + (sleepy ? 7 : 2), 7, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }); };
    const legs = (xs, top) => { xs.forEach((lx, i) => { const st = o.moving ? Math.sin(t * 16 + i * Math.PI) * 12 : 0; ctx.strokeStyle = sil ? SC : BROWN; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(lx, top); ctx.lineTo(lx + st, -10); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(lx + st + 8, -8, 20, 10, 0, 0, TAU); ctx.fillStyle = sil ? SC : OUT; ctx.fill(); }); };
    const arm = (sx, sy, ex, ey) => { ctx.strokeStyle = sil ? SC : BROWN; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + ex) / 2, sy - 10, ex, ey); ctx.stroke(); ctx.beginPath(); ctx.arc(ex, ey, 11, 0, TAU); ctx.fillStyle = sil ? SC : "#FFFFFF"; ctx.fill(); ol(ctx, 4, sil ? SC : OUT); };
    let H = 260;
    if (kind === "sepatu"){ H = 260; legs([-50, 50], -60);
      const wave = Math.sin(t * 9) * 20; arm(-110, -150, -170, -220 + wave); arm(120, -120, 175, -200 - wave);
      ctx.beginPath(); ctx.moveTo(-140, -60); ctx.lineTo(-130, -190); ctx.quadraticCurveTo(-60, -230, 10, -215); ctx.lineTo(30, -260); ctx.quadraticCurveTo(70, -262, 74, -230); ctx.lineTo(84, -170); ctx.quadraticCurveTo(150, -150, 150, -90); ctx.lineTo(150, -60); ctx.closePath(); fill(ORANGE);
      rr(ctx, -150, -72, 305, 32, 16); fill("#FFFFFF");
      if (!sil){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(20 + i * 18, -205 + i * 18); ctx.lineTo(60 + i * 18, -195 + i * 18); ctx.stroke(); }
        ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-120, -110); ctx.quadraticCurveTo(-40, -90, 40, -120); ctx.stroke(); }
      eyes(-62, -160, 30); if (!sil){ ctx.beginPath(); ctx.arc(-62, -125, 16, .1 * Math.PI, .9 * Math.PI); ol(ctx, 5); } }
    else if (kind === "bekal"){ H = 270; legs([-55, 55], -40);
      arm(-110, -130, -160, -190 + Math.sin(t * 7) * 15); arm(110, -130, 160, -100);
      rr(ctx, -115, -200, 230, 165, 22); fill(TEAL);
      const op = clamp(o.open || 0, 0, 1);
      if (op > 0 && !sil){ ctx.beginPath(); ctx.ellipse(-30, -205, 60, 26, 0, Math.PI, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(50, -210, 26, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
        ctx.beginPath(); ctx.arc(50, -210, 12, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.beginPath(); ctx.ellipse(-70, -212, 18, 10, -.5, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); }
      ctx.save(); ctx.translate(-120, -200); ctx.rotate(-1.5 * eBack(op)); rr(ctx, 0, -30, 240, 34, 14); fill("#E8A55B"); ctx.restore();
      eyes(0, -125, 38); if (!sil){ ctx.beginPath(); ctx.arc(0, -88, 18, .1 * Math.PI, .9 * Math.PI); ol(ctx, 5); } }
    else if (kind === "bulan"){ H = 330; legs([-40, 40], -70); const sway = Math.sin(t * 2) * .06; ctx.rotate(sway);
      arm(-80, -150, -140, -120); arm(80, -160, 140, -190 + Math.sin(t * 3) * 10);
      if (!sil){ ctx.save(); ctx.translate(150, -200); ctx.rotate(.4); rr(ctx, -16, -40, 32, 80, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 3); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -20, 6, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0, -200, 130, Math.PI * .5, Math.PI * 1.5); ctx.bezierCurveTo(-30, -310, -30, -90, 0, -70); fill("#F6D36B");
      ctx.beginPath(); ctx.arc(-60, -200, 58, 0, TAU); ctx.fillStyle = sil ? SC : "#F6D36B"; ctx.fill();
      if (!sil){ ctx.fillStyle = "#3A3348"; ctx.beginPath(); ctx.ellipse(-62, -212, 30, 26, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-62, -212, 16, 18, 0, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        ctx.fillStyle = "#F6D36B"; ctx.beginPath(); ctx.ellipse(-62, -214, 18, 20, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-80, -214); ctx.lineTo(-44, -214); ol(ctx, 4);
        ctx.beginPath(); ctx.arc(-58, -206, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.ellipse(-70, -160, 12, 8, 0, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); }
      // night cap
      ctx.beginPath(); ctx.moveTo(-120, -260); ctx.quadraticCurveTo(-70, -330, 10, -320); ctx.quadraticCurveTo(70, -300, 90, -240 + Math.sin(t * 2) * 8); ctx.lineTo(40, -300); ctx.quadraticCurveTo(-40, -300, -90, -240); ctx.closePath(); fill("#5B7DB1");
      ctx.beginPath(); ctx.arc(92, -236 + Math.sin(t * 2) * 8, 18, 0, TAU); fill("#FFFFFF");
      if (!sil){ for (let i = 0; i < 3; i++){ const q = (t * .6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); textC(ctx, "z", 60 + q * 60, -330 - q * 100, 34 + i * 6, "#FFFFFF", 900); ctx.restore(); } } }
    if (sil){ ctx.save(); ctx.scale(f, 1); const b = Math.sin(t * 4 + seed) * 8; textC(ctx, "?", 0, -H - 30 + b, 90, "#FFFFFF", 900); ctx.restore(); }
    ctx.restore();
    return { top: y - H * s, cx: x };
  }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function mascotState(s, m, t, idx){
    const T0 = m.cue || m.at != null ? tOf(s, m, .2, idx) : -1; let x = m.x ?? 540, mv = false;
    (m.keys || []).map((k, j) => Object.assign({ T: tOf(s, k, .2 + j * .1, idx) }, k)).sort((a, b) => a.T - b.T).forEach(k => {
      if (t < k.T) return; const d = k.dur || .9, q = clamp((t - k.T) / d, 0, 1); const x0 = x; x = lerp(x0, k.x, easeIO(q)); if (q > 0 && q < 1) mv = true; });
    const out = m.outCue ? T(s, m.outCue, .5, idx) : 1e9;
    return { T0, x, mv, out };
  }
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
    const piece = f.piece !== false;
    env(ctx, E, t, c, eo);
    const R = { c, f, piece, shotT, m: [] };
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
        (f.belts || []).filter(b => (b.on ?? 0) === j).forEach(b => { let col = b.col || "#FFFFFF"; (b.keys || []).forEach((k, n) => { if (t >= tOf(s, k, .3 + n * .05, idx)) col = k.col; }); if (H.beltCol) col = H.beltCol(j, col);
          const k = r.k, by = r.headY + 41 * k;
          ctx.save(); ctx.translate(r.x, by); ctx.scale(k * (st.face || 1), k); rr(ctx, -14.5, -2.6, 29, 5.6, 1.5); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.1; ctx.stroke();
          const sw = Math.sin(t * 5 + j) * .2; [[-1, 0], [1, .4]].forEach(([d, ph]) => { ctx.save(); ctx.translate(4, 2); ctx.rotate(d * .35 + sw + ph * .2); rr(ctx, -1.6, 0, 3.2, 9, 1.2); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); ctx.restore(); });
          ctx.restore(); });
        (f.panda || []).filter(p => (p.on ?? 0) === j && t >= tOf(s, p, .3, idx)).forEach(p => { const k = r.k, q = clamp((t - tOf(s, p, .3, idx)) / .4, 0, 1);
          ctx.save(); ctx.globalAlpha *= q * .75; ctx.strokeStyle = "#3A3348"; ctx.lineWidth = 3.2 * k; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(st.x + (2.6 + d * 7.3) * k * (st.face || 1), r.headY - 1 * k, 7.2 * k, 7.6 * k, 0, 0, TAU); ctx.stroke(); }); ctx.restore(); });
        holds.filter(h => (h.on ?? 0) === j && t >= h.T && t < h.O).forEach(h => { const p = handOf(st), q = h.T < 0 ? 1 : eBack(clamp((t - h.T) / .3, 0, 1));
          drawItem(ctx, h.kind, p[0] + (h.dx || 0) * (st.face || 1), p[1] + (h.dy || 0) - (st.y - r.y), t, { s: (h.s || 1) * q * st.size / 760, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), n: h.n, thick: h.thick, torn: h.torn, go: h.go, screen: h.screen }); });
      });
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    (f.mascots || []).forEach((m, j) => { const ms = mascotState(s, m, t, idx); items.push({ z: m.z ?? .2, j: 50 + j, draw: () => {
      if (t < ms.T0 || t > ms.out + .4) { R.m[j] = null; return; }
      const q = ms.T0 < 0 ? 1 : eBack(clamp((t - ms.T0) / .4, 0, 1)), oq = 1 - clamp((t - ms.out) / .4, 0, 1);
      const hop = (m.hop || ms.mv) ? Math.abs(Math.sin(t * (ms.mv ? 9 : 5) + j)) * (ms.mv ? 30 : 18) : 0, y = (m.y ?? GY) - hop;
      const sil = m.sil ? t < T(s, m.sil, .3, idx) : false, op = m.open ? ramp(t, T(s, m.open, .3, idx), T(s, m.open, .3, idx) + .5) : 0;
      layer(ctx, c, 1, () => { ctx.save(); ctx.globalAlpha *= oq; const sq = 1 + (hop > 0 ? 0 : .04 * Math.sin(t * 5 + j));
        const r = mascot(ctx, m.kind, ms.x, y, (m.s || 1) * q, t, { sil, moving: ms.mv, open: op, face: m.face || 1 }); void sq; R.m[j] = { x: ms.x, top: r.top, y };
        ctx.restore(); });
      if (m.label && !sil && q > .5){ const sc = c.toScreen(ms.x, R.m[j].top - 40); TT.CS.ov.push(() => { ctx.save(); ctx.globalAlpha *= oq; popChip(ctx, m.label, sc[0], sc[1], t - ms.T0 - .2, PAPER, BROWN, 30, -.04); ctx.restore(); }); }
    } }); });
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, t, c, eo);
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, clamp(p[0] + (b.dx || 0), 200, 880), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180)); });
    (f.paddles || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx), O = p.outCue ? T(s, p.outCue, .6, idx) : 1e9; if (t < T0 || t > O + .3) return;
      ovs.push(() => { const k = t - T0, q = eBack(clamp(k / .4, 0, 1)), oq = 1 - clamp((t - O) / .3, 0, 1); ctx.save(); ctx.globalAlpha *= oq; ctx.translate(p.x ?? 540, (p.y ?? 520) + (1 - q) * 300); ctx.rotate(Math.sin(k * 3) * .06 + (p.rot || 0)); ctx.scale(q, q);
        ctx.fillStyle = "#8E4E2E"; rr(ctx, -14, 60, 28, 170, 8); ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.fillStyle = p.col || PAPER; ctx.fill(); ol(ctx, 8);
        ctx.beginPath(); ctx.arc(0, 0, 94, 0, TAU); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.stroke(); textC(ctx, p.text, 0, 44, p.size || 130, p.ink || BROWN, 900, 170); ctx.restore(); }); });
    (f.stamps || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx); if (t < T0) return; let x = p.x ?? 540, y = p.y ?? 600;
      if (p.m != null && R.m[p.m]){ const sc = c.toScreen(R.m[p.m].x, R.m[p.m].top - 70); x = sc[0] + (p.dx || 0); y = sc[1] + (p.dy || 0); } else if (p.m != null) return;
      ovs.push(() => { stampBox(ctx, p.text, x, y, t - T0, p.col || ORANGE, p.size || 60, (p.rot ?? -8) * Math.PI / 180); burstFx(ctx, x, y, t - T0 - .1, p.col || HL, 12, 200); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
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
      (f.mascots || []).forEach(m => { if (m.cue) add(tOf(s, m, .2, i), "pop"); });
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      (f.paddles || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i), "pop"));
      (f.stamps || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i) + .05, "chime"));
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const sfxWith = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); fn(s, f, i, add); };

  /* ================= _adegan ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (benda, maskot kebiasaan, papan skor, sabuk, mata panda)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= _audisi: habit audition ================= */
  function marquee(ctx, x, y, t, lit){
    const w = 820, h = 230; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#5A3A2A"; ctx.fillRect(-w / 2 + 60, h / 2, 16, 140); ctx.fillRect(w / 2 - 76, h / 2, 16, 140);
    glowAt(ctx, 0, 0, 560, "#FFD9A0", .32 * lit);
    rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = lit > .5 ? "#7A1F2B" : "#3A1820"; ctx.fill(); ol(ctx, 8);
    rr(ctx, -w / 2 + 26, -h / 2 + 26, w - 52, h - 52, 14); ctx.fillStyle = lit > .5 ? "#FFF1C9" : "#6B5A4A"; ctx.fill(); ol(ctx, 5);
    textC(ctx, "AUDISI", 0, -8, 86, lit > .5 ? "#7A1F2B" : "#3A2A22", 900, w - 100); textC(ctx, "KEBIASAAN", 0, 62, 50, lit > .5 ? ORANGE : "#3A2A22", 900, w - 100);
    const n = 30; for (let i = 0; i < n; i++){ const u = i / n; let bx, by; const P = 2 * (w + h), d = u * P;
      if (d < w){ bx = -w / 2 + d; by = -h / 2 + 12; } else if (d < w + h){ bx = w / 2 - 12; by = -h / 2 + (d - w); } else if (d < 2 * w + h){ bx = w / 2 - (d - w - h); by = h / 2 - 12; } else { bx = -w / 2 + 12; by = h / 2 - (d - 2 * w - h); }
      const on = lit > .5 && ((i + Math.floor(t * 6)) % 3 !== 0); ctx.beginPath(); ctx.arc(bx, by, 9, 0, TAU); ctx.fillStyle = on ? "#FFE9A8" : "#5A4A3A"; ctx.fill(); if (on) glowAt(ctx, bx, by, 26, "#FFE9A8", .6); }
    ctx.restore(); }
  function stage(ctx, x0, x1, top, t){
    ctx.fillStyle = "#6B3A22"; ctx.fillRect(x0, top, x1 - x0, GY + 300 - top); ctx.fillStyle = "#A0643C"; rr(ctx, x0, top - 30, x1 - x0, 40, 8); ctx.fill(); ol(ctx, 5);
    ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; for (let xx = x0 + 60; xx < x1; xx += 90){ ctx.beginPath(); ctx.moveTo(xx, top - 26); ctx.lineTo(xx, top + 6); ctx.stroke(); }
    ctx.save(); ctx.globalAlpha = .22 + .04 * Math.sin(t * 3); ctx.fillStyle = "#FFF4C8"; ctx.beginPath(); ctx.moveTo((x0 + x1) / 2 - 60, 300); ctx.lineTo((x0 + x1) / 2 + 60, 300); ctx.lineTo(x1 - 40, top); ctx.lineTo(x0 + 40, top); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = .35; ctx.fillStyle = "#FFF4C8"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, top - 10, (x1 - x0) / 2 - 40, 34, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function judgeTable(ctx, x, t, bz){
    const w = 470, top = GY - 300; ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(x, GY + 6, w * .55, 22, 0, 0, TAU); ctx.fill();
    rr(ctx, x - w / 2, top, w, 300, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - w / 2 - 14, top - 26, w + 28, 34, 10); ctx.fillStyle = "#5A3A2A"; ctx.fill(); ol(ctx, 5);
    rr(ctx, x - 110, top + 70, 220, 74, 14); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); textC(ctx, "JURI", x, top + 128, 50, BROWN, 900);
    for (let i = 0; i < 3; i++) sparkle(ctx, x - 150 + i * 150, top + 210, 16 + 4 * Math.sin(t * 4 + i), i === 1 ? GOLD : CREAM);
    [["x", x - 120, RED], ["gold", x + 130, GOLD]].forEach(([kind, bx, col]) => { const k = bz[kind] ?? -9, pr = k >= 0 && k < .35 ? Math.sin(k / .35 * Math.PI) : 0;
      ctx.fillStyle = "#3B3A3F"; rr(ctx, bx - 62, top - 44, 124, 22, 6); ctx.fill(); ol(ctx, 4);
      ctx.beginPath(); ctx.ellipse(bx, top - 44 + pr * 12, 50, 40 - pr * 18, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5);
      textC(ctx, kind === "x" ? "✕" : "★", bx, top - 54 + pr * 10, 34, "#FFFFFF", 900);
      if (k >= 0 && k < .8){ ctx.save(); ctx.globalAlpha = 1 - k / .8; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(bx, top - 60, 40 + k * 160, 0, TAU); ctx.stroke(); ctx.restore(); } });
    ctx.restore(); }
  TT.scene(PX + "audisi", "Cerita: audisi kebiasaan (papan lampu, panggung, meja juri, tombol)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ tableX: 250, signY: 520 }, f.aud || {});
    const tL = A.lightCue ? T(s, A.lightCue, .3, idx) : (A.lightAt ?? -1), lit = t >= tL ? (t - tL < .4 ? (Math.sin((t - tL) * 40) > 0 ? 1 : 0) : 1) : 0;
    const bz = {}; (A.buzz || []).forEach((b, n) => { const tb = T(s, b.cue, .4, idx); if (t >= tb) bz[b.kind] = t - tb; });
    base(ctx, s, t, { env: "info", envOpt: { spotX: 720 },
      spots: { sign: [A.signX ?? 640, A.signY + 60, 1.05], stage: [760, 1200, 1.1], table: [A.tableX + 60, 1180, 1.15] },
      back: () => {
        for (let i = 0; i < 16; i++){ const x = 400 + i * 62, sw = Math.sin(t * 1.3 + i * .7) * 6; ctx.fillStyle = i % 2 ? "#6E1A26" : "#8E2A36"; ctx.beginPath(); ctx.moveTo(x, 180); ctx.lineTo(x + 62, 180); ctx.lineTo(x + 62 + sw, 1420); ctx.lineTo(x + sw, 1420); ctx.closePath(); ctx.fill(); }
        ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(400, 180, 1000, 1340);
        for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.moveTo(400 + i * 170, 180); ctx.quadraticCurveTo(485 + i * 170, 300, 570 + i * 170, 180); ctx.closePath(); ctx.fillStyle = "#A8343F"; ctx.fill(); ol(ctx, 4); }
        ctx.fillStyle = GOLD; for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.arc(400 + i * 170, 190, 12, 0, TAU); ctx.fill(); }
        marquee(ctx, A.signX ?? 640, A.signY, t, lit); stage(ctx, 420, 1400, A.stageY ?? 1400, t); },
      front: () => judgeTable(ctx, A.tableX, t, bz) });
  }, sfxWith((s, f, i, add) => { const A = f.aud || {}; if (A.lightCue) add(cueT(s, A.lightCue, .3, i), "chime"); (A.buzz || []).forEach(b => add(cueT(s, b.cue, .4, i), b.kind === "x" ? "ping" : "chime")); }));

  /* ================= _begadang: binge at night -> office morning ================= */
  function tvSet(ctx, x, t, o){
    const top = GY - 560; ctx.save();
    ctx.fillStyle = "#6B4426"; rr(ctx, x - 190, GY - 220, 380, 220, 10); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#4A2E1A"; rr(ctx, x - 160, GY - 180, 140, 120, 8); ctx.fill(); rr(ctx, x + 20, GY - 180, 140, 120, 8); ctx.fill();
    ctx.fillStyle = "#3B3A3F"; ctx.fillRect(x - 12, GY - 260, 24, 40);
    const fl = [ "#6FB3D9", "#E8A55B", "#9B7BD9", "#7FD3A0" ][Math.floor(t * 3) % 4];
    glowAt(ctx, x, top + 150, 640, fl, .35 + .1 * Math.sin(t * 17));
    rr(ctx, x - 230, top, 460, 300, 16); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 7);
    ctx.save(); rr(ctx, x - 210, top + 20, 420, 260, 8); ctx.clip(); ctx.fillStyle = fl; ctx.fillRect(x - 210, top + 20, 420, 260);
    for (let i = 0; i < 3; i++){ ctx.fillStyle = hexA("#FFFFFF", .25); ctx.beginPath(); ctx.arc(x - 120 + i * 120 + Math.sin(t * 2 + i) * 30, top + 140 + Math.cos(t * 3 + i) * 20, 40, 0, TAU); ctx.fill(); }
    if (o.count >= 0){ const n = Math.max(1, 5 - Math.floor(o.count / .6)); ctx.fillStyle = "rgba(10,10,20,.72)"; ctx.fillRect(x - 210, top + 20, 420, 260);
      textC(ctx, "EPISODE BERIKUTNYA", x, top + 92, 32, "#FFFFFF", 900, 380); ctx.beginPath(); ctx.arc(x, top + 182, 58, 0, TAU); ctx.strokeStyle = hexA("#FFFFFF", .3); ctx.lineWidth = 10; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, top + 182, 58, -Math.PI / 2, -Math.PI / 2 + TAU * ((o.count / .6) % 1)); ctx.strokeStyle = HL; ctx.stroke(); textC(ctx, String(n), x, top + 208, 72, "#FFFFFF", 900); }
    ctx.restore(); ctx.restore(); }
  function digiClock(ctx, x, y, txt, k){ ctx.save(); ctx.translate(x, y); const q = k >= 0 && k < .3 ? 1 + .15 * Math.sin(k / .3 * Math.PI) : 1; ctx.scale(q, q);
    rr(ctx, -130, -60, 260, 120, 20); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6); textC(ctx, txt, 0, 26, 74, "#FF5A4A", 900); ctx.restore(); }
  TT.scene(PX + "begadang", "Cerita: begadang nonton serial (TV, hitung mundur, jam) lalu kantor (mata panda, kopi)", (ctx, th, s, t) => {
    const idx = G.scene, f0 = s.f || {};
    const V = Object.assign({ x: 850 }, f0.tv || {}), tCount = V.countCue ? T(s, V.countCue, .3, idx) : 1e9;
    let clk = V.hours && V.hours[0] ? V.hours[0].text : "23.00", tClk = -9; (V.hours || []).forEach((h, n) => { const th2 = h.cue ? T(s, h.cue, .3, idx) : (h.at ?? 0); if (t >= th2){ clk = h.text; tClk = th2; } });
    const C = Object.assign({ x: 700 }, f0.cups || {}), cupT = (C.cues || []).map((cu, n) => T(s, cu, .2 + n * .25, idx));
    base(ctx, s, t, {
      spots: { tv: [V.x, GY - 420, 1.2] },
      back: (ctx2, c, sts, R) => { const part = R.f.part || "rumah";
        if (part === "rumah"){ prop(ctx, "sofa", 380, GY, { s: .95, color: "#7A5BA6" }, t); tvSet(ctx, V.x, t, { count: t >= tCount ? t - tCount : -1 }); }
        else { prop(ctx, "desk", C.x, GY, { s: .95, laptop: true, lx: 40, papers: 3 }, t); } },
      front: (ctx2, c, sts, R) => { const part = R.f.part || "rumah"; if (part === "kantor"){ const top = GY - 290 * .95;
        cupT.forEach((ct, n) => { if (t < ct) return; const q = eBack(clamp((t - ct) / .35, 0, 1)); ctx.save(); ctx.translate(C.x + 150 - n * 10, top - n * 78 - (1 - q) * 200); ctx.rotate(Math.sin(t * 3 + n) * .03 * n); drawItem(ctx, "coffee", 0, 0, t, { s: q }); ctx.restore();
          if (t - ct < 1){ for (let i = 0; i < 3; i++){ const qq = ((t - ct) * .8 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .6 * Math.sin(qq * Math.PI); puffC(ctx, C.x + 140 + i * 12, top - n * 78 - 100 - qq * 80, 18, "#FFFFFF"); ctx.restore(); } } }); } },
      over: (ctx2, c, sts, R) => { if ((R.f.part || "rumah") === "rumah") digiClock(ctx, 820, 300, clk, t - tClk); } });
  }, sfxWith((s, f, i, add) => { const V = f.tv || {}; if (V.countCue) add(cueT(s, V.countCue, .3, i), "ping"); (V.hours || []).forEach(h => { if (h.cue) add(cueT(s, h.cue, .3, i), "pop"); });
    ((f.cups || {}).cues || []).forEach((cu, n) => add(cueT(s, cu, .2 + n * .25, i), "pop")); }));

  /* ================= _buru: office treasure hunt ================= */
  function cabinet(ctx, x, t, open){ const w = 230, h = 420, top = GY - h; ctx.save();
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 140, 16, 0, 0, TAU); ctx.fill();
    rr(ctx, x - w / 2, top, w, h, 10); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 6);
    for (let i = 0; i < 3; i++){ const dy = i === 0 ? open * 0 : 0, ox = i === 0 ? open * 70 : 0; rr(ctx, x - w / 2 + 14 + ox * .2, top + 16 + i * 134 + dy, w - 28, 118, 8); ctx.fillStyle = i === 0 && open > 0 ? "#C9D2DA" : "#B7C1CB"; ctx.fill(); ol(ctx, 4);
      rr(ctx, x - 40 + ox * .2, top + 60 + i * 134, 80, 16, 8); ctx.fillStyle = "#5A6470"; ctx.fill(); }
    if (open > 0){ ctx.fillStyle = "#6B7580"; rr(ctx, x - w / 2 + 20, top - 50 * open, w - 40, 60 * open, 6); ctx.fill(); ol(ctx, 4);
      for (let i = 0; i < 4; i++){ ctx.fillStyle = ["#FFFDF6", "#F3E6D2", "#E8A55B", "#FFFDF6"][i]; ctx.fillRect(x - 90 + i * 44, top - 50 * open - 14 * open, 30, 26 * open); } }
    ctx.restore(); }
  function shelf(ctx, x, t){ const top = GY - 760; ctx.save();
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - 170, top, 16, 760); ctx.fillRect(x + 154, top, 16, 760);
    [0, 250, 500].forEach(dy => { rr(ctx, x - 180, top + dy, 360, 22, 6); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 4); });
    const jar = (jx, jy, col, h) => { rr(ctx, jx - 34, jy - h, 68, h, 12); ctx.fillStyle = hexA("#DDEFF5", .85); ctx.fill(); ol(ctx, 4); rr(ctx, jx - 30, jy - h * .65, 60, h * .62, 10); ctx.fillStyle = col; ctx.fill(); rr(ctx, jx - 36, jy - h - 14, 72, 18, 6); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 3); };
    jar(x - 100, top, "#8E4E2E", 120); jar(x, top, "#F6C343", 100); jar(x + 100, top, "#FFFFFF", 130);
    jar(x - 100, top + 250, "#7FA563", 90); rr(ctx, x + 40, top + 250 - 130, 110, 130, 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, "TEH", x + 95, top + 250 - 55, 30, "#FFFFFF", 900);
    ctx.fillStyle = "#FFFDF8"; for (let i = 0; i < 4; i++){ rr(ctx, x - 140 + i * 70, top + 500 - 90, 56, 90, 10); ctx.fill(); ol(ctx, 3); }
    ctx.restore(); }
  TT.scene(PX + "buru", "Cerita: berburu harta karun di kantor (kabel, spidol, remot)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Hh = Object.assign({ deskX: 210, cabX: 590, shelfX: 900 }, f.hunt || {});
    const spotPos = { cable: [Hh.deskX + 30, GY - 70], marker: [Hh.cabX, GY - 470], remote: [Hh.shelfX + 10, GY - 760 + 250 - 10] };
    const its = (Hh.items || []).map((it, n) => Object.assign({ T: T(s, it.cue, .4, idx) }, it, { p: it.p || spotPos[it.kind] }));
    const cabOpen = (() => { const m = its.find(i => i.kind === "marker"); return m ? eBack(ramp(t, m.T - .3, m.T + .1)) : 0; })();
    let RR = null;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { desk: [Hh.deskX + 40, GY - 260, 1.15], cab: [Hh.cabX, GY - 500, 1.15], shelf: [Hh.shelfX, GY - 520, 1.15] },
      back: () => { shelf(ctx, Hh.shelfX, t); cabinet(ctx, Hh.cabX, t, cabOpen); prop(ctx, "desk", Hh.deskX, GY, { s: .85, laptop: true, lx: 40 }, t); },
      mid: (ctx2, c, sts, R) => { RR = R; const hero = sts[0];
        its.forEach((it, n) => { const k = t - it.T; const hp = handOf(hero); const held = its.filter(o => t - o.T > .9).indexOf(it);
          let x = it.p[0], y = it.p[1], sc = 1, rot = 0;
          if (k < 0){ if (Math.sin(t * 4 + n * 2) > .3) sparkle(ctx, x + 20, y - 40, 22, GOLD); ctx.save(); ctx.globalAlpha = .9; drawItem(ctx, it.kind, x, y, t, { s: .95 }); ctx.restore(); return; }
          if (k < .5){ const q = k / .5; y -= Math.sin(q * Math.PI) * 160 + q * 40; sc = .95 + .4 * eBack(q); rot = q * TAU * .5; }
          else if (k < .9){ const q = eOut((k - .5) / .4); x = lerp(x, hp[0] + 40, q); y = lerp(y - 40, hp[1] - 60 - held * 50, q); sc = lerp(1.35, .95, q); rot = (1 - q) * 1.5; }
          else { x = hp[0] + 40 * (hero.face || 1); y = hp[1] - 40 - held * 60; sc = .95; rot = Math.sin(t * 3 + n) * .1; }
          if (k < .6) glowAt(ctx, it.p[0], it.p[1] - 80, 220, GOLD, .5 * (1 - k / .6));
          drawItem(ctx, it.kind, x, y, t, { s: sc, rot }); }); }, midZ: 1,
      over: (ctx2, c) => { its.forEach((it, n) => { const k = t - it.T; if (k < 0 || k > 1.6) return; const sc = c.toScreen(it.p[0], it.p[1] - 220);
        ctx.save(); ctx.globalAlpha = 1 - clamp((k - 1.2) / .4, 0, 1); popChip(ctx, it.label || "KETEMU!", clamp(sc[0], 220, 860), clamp(sc[1], 260, 900), k, GOLD, BROWN, 40, -.06); ctx.restore(); burstFx(ctx, sc[0], sc[1] + 120, k, GOLD, 10, 160); }); } });
  }, sfxWith((s, f, i, add) => ((f.hunt || {}).items || []).forEach(it => add(cueT(s, it.cue, .4, i), "chime"))));

  /* ================= _telat: meeting room waiting ================= */
  TT.scene(PX + "telat", "Cerita: ruang rapat menunggu (proyektor NO SIGNAL, jam berlari, meja panjang)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rm = Object.assign({ tableTop: GY - 250 }, f.room || {});
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false },
      spots: { screen: [560, 760, 1.1], clock: [930, 560, 1.4] },
      back: () => { // projector screen
        ctx.fillStyle = "#3B3A3F"; ctx.fillRect(250, 470, 620, 18); rr(ctx, 270, 488, 580, 360, 6); ctx.fillStyle = "#1F3F8F"; ctx.fill(); ol(ctx, 6);
        const bx = 300 + Math.abs(((t * 120) % 760) - 380) * 1.0, by = 520 + Math.abs(((t * 90) % 520) - 260) * .9;
        ctx.save(); rr(ctx, 270, 488, 580, 360, 6); ctx.clip(); rr(ctx, bx - 20, by, 200, 60, 10); ctx.fillStyle = ["#FFFFFF", "#F6C343", "#8FD3C7"][Math.floor(t * 1.3) % 3]; ctx.fill(); textC(ctx, "NO SIGNAL", bx + 80, by + 41, 30, "#1F3F8F", 900); ctx.restore();
        ctx.save(); ctx.translate(950, 560); prop(ctx, "clock", 0, 0, { s: .9, fast: true }, t * (Rm.clockFast ?? 1)); ctx.restore(); },
      front: () => { const top = Rm.tableTop; ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(560, GY + 4, 520, 26, 0, 0, TAU); ctx.fill();
        rr(ctx, 60, top, 1000, 46, 14); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6); ctx.fillStyle = "#8E4E2E"; rr(ctx, 120, top + 46, 880, GY - top - 46, 6); ctx.fill(); ol(ctx, 5);
        [260, 560, 860].forEach((x, n) => { rr(ctx, x - 70, top - 14, 140, 16, 4); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 3); });
        drawItem(ctx, "coffee", 420, top + 4, t, { s: .7 }); drawItem(ctx, "coffee", 720, top + 4, t, { s: .7 }); } });
  }, sfxBase);

  /* ================= _komedi: the carousel of the same Tuesday ================= */
  function horse(ctx, x, y, s, col, t){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, 0, 110, 52, 0, 0, TAU); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6);
    ctx.beginPath(); ctx.moveTo(70, -20); ctx.lineTo(120, -110); ctx.quadraticCurveTo(160, -130, 175, -95); ctx.lineTo(150, -70); ctx.lineTo(110, -10); ctx.closePath(); ctx.fill(); ol(ctx, 6);
    ctx.fillStyle = BROWN; ctx.beginPath(); ctx.moveTo(115, -105); ctx.quadraticCurveTo(80, -90, 72, -40); ctx.lineTo(92, -40); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(140, -100, 6, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 18; ctx.lineCap = "round"; [[-60, 1], [60, -1]].forEach(([lx, d]) => { ctx.beginPath(); ctx.moveTo(lx, 30); ctx.lineTo(lx + d * 30, 90); ctx.stroke(); });
    ctx.strokeStyle = OUT; ctx.lineWidth = 4; [[-60, 1], [60, -1]].forEach(([lx, d]) => { ctx.beginPath(); ctx.moveTo(lx, 30); ctx.lineTo(lx + d * 30, 90); ctx.stroke(); });
    rr(ctx, -50, -60, 90, 26, 8); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); ctx.restore(); }
  TT.scene(PX + "komedi", "Cerita: komedi putar Selasa yang sama (berputar, pusing, berhenti)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Rd = Object.assign({ cx: 540, R: 330, base: 1460, top: 560, w0: .9, w1: 4.2 }, f.ride || {});
    const tSpin = T(s, Rd.spinCue, .3, idx), tStop = T(s, Rd.stopCue, .3, idx), tOff = T(s, Rd.offCue, .3, idx);
    const omega = (x) => x < tSpin ? Rd.w0 : lerp(Rd.w0, Rd.w1, eOut(clamp((x - tSpin) / 1.2, 0, 1)));
    const angAt = (x) => { let a = 0; const n = Math.ceil(Math.max(0, x) * 30); for (let i = 0; i < n; i++){ const tt = (i + .5) / 30; a += omega(tt) / 30; } return a; };
    let ang; if (t < tStop) ang = angAt(t); else { const a0 = angAt(tStop), tgt = Math.ceil(a0 / TAU + .4) * TAU; ang = lerp(a0, tgt, eOut(clamp((t - tStop) / 1.6, 0, 1))); }
    const spinQ = t < tStop ? clamp((omega(t) - Rd.w0) / (Rd.w1 - Rd.w0), 0, 1) : 1 - clamp((t - tStop) / 1.6, 0, 1);
    const signs = Rd.signs || ["CARI KABEL", "CARI SPIDOL", "CARI REMOT", "SELASA LAGI"], cols = ["#F3D9B5", "#FFFFFF", "#E8A55B", "#BFE2EA"];
    const rider = Rd.rider ? Object.assign({ pose: "sit", size: 520 }, Rd.rider) : null;
    base(ctx, s, t, { env: "sunset", envOpt: {},
      spots: { ride: () => [Rd.cx, Rd.base - 420, 1.25] },
      back: (ctx2, c, sts, R) => {
        const hs = [0, 1, 2, 3].map(k => { const ph = ang + k * TAU / 4; return { k, ph, x: Rd.cx + Math.sin(ph) * Rd.R, d: Math.cos(ph) }; });
        // platform
        ctx.fillStyle = "rgba(43,26,18,.3)"; ctx.beginPath(); ctx.ellipse(Rd.cx, GY - 20, Rd.R + 120, 50, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(Rd.cx, Rd.base, Rd.R + 90, 70, 0, 0, TAU); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
        rr(ctx, Rd.cx - Rd.R - 90, Rd.base, (Rd.R + 90) * 2, 90, 10); ctx.fillStyle = "#6B3A22"; ctx.fill(); ol(ctx, 5);
        for (let i = 0; i < 12; i++){ const xx = Rd.cx - Rd.R - 60 + i * (Rd.R * 2 + 120) / 11; ctx.beginPath(); ctx.arc(xx, Rd.base + 45, 8, 0, TAU); ctx.fillStyle = ((i + Math.floor(t * 5)) % 2) ? GOLD : "#FFE9A8"; ctx.fill(); }
        const drawHorse = (h) => { const sc = .78 + .22 * (h.d + 1) / 2, bob = Math.sin(h.ph * 2 + t * 2) * 30, hy = Rd.base - 250 + bob - (1 - h.d) * 30;
          ctx.strokeStyle = GOLD; ctx.lineWidth = 12 * sc; ctx.beginPath(); ctx.moveTo(h.x, Rd.top + 160); ctx.lineTo(h.x, Rd.base - 20 - (1 - h.d) * 30); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
          horse(ctx, h.x, hy, sc * .9, cols[h.k], t);
          // sign on the pole
          if (h.d > -.3){ ctx.save(); ctx.translate(h.x, Rd.top + 230); ctx.scale(sc * (.4 + .6 * Math.max(0, h.d)), sc); rr(ctx, -120, -36, 240, 64, 12); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); textC(ctx, signs[h.k], 0, 10, 30, BROWN, 900, 220); ctx.restore(); }
          if (rider && h.k === 0 && t < tOff){ const st = toonState(rider, s, t); st.x = h.x - 10 * sc; st.y = hy + 60 * sc; st.size = rider.size * sc; st.face = Math.cos(h.ph) >= 0 ? 1 : -1;
            const r = TT.drawToon(ctx, rider, st, t); R.rider = r;
            if (r && spinQ > .3){ for (let i = 0; i < 4; i++){ const a = t * 6 + i * TAU / 4; sparkle(ctx, r.headX + Math.cos(a) * r.r * 1.3, r.top - 10 + Math.sin(a) * r.r * .35, 14, GOLD); } } } };
        hs.filter(h => h.d < 0).sort((a, b) => a.d - b.d).forEach(drawHorse);
        // centre column
        rr(ctx, Rd.cx - 60, Rd.top + 120, 120, Rd.base - Rd.top - 120, 10); ctx.fillStyle = "#C2691F"; ctx.fill(); ol(ctx, 6);
        for (let i = 0; i < 5; i++){ rr(ctx, Rd.cx - 50, Rd.top + 170 + i * 120, 100, 70, 8); ctx.fillStyle = hexA("#FFF1C9", .9); ctx.fill(); ol(ctx, 3); }
        hs.filter(h => h.d >= 0).sort((a, b) => a.d - b.d).forEach(drawHorse);
        // canopy
        ctx.beginPath(); ctx.moveTo(Rd.cx, Rd.top - 120); ctx.lineTo(Rd.cx + Rd.R + 140, Rd.top + 110); ctx.lineTo(Rd.cx - Rd.R - 140, Rd.top + 110); ctx.closePath(); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 6);
        ctx.save(); ctx.clip(); for (let i = -6; i < 7; i++){ const off = ((ang * 60) % 140); ctx.beginPath(); ctx.moveTo(Rd.cx, Rd.top - 120); ctx.lineTo(Rd.cx + i * 140 + off, Rd.top + 110); ctx.lineTo(Rd.cx + i * 140 + off + 70, Rd.top + 110); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); } ctx.restore();
        ctx.beginPath(); ctx.moveTo(Rd.cx, Rd.top - 120); ctx.lineTo(Rd.cx + Rd.R + 140, Rd.top + 110); ctx.lineTo(Rd.cx - Rd.R - 140, Rd.top + 110); ctx.closePath(); ol(ctx, 6);
        for (let i = 0; i < 9; i++){ const xx = Rd.cx - Rd.R - 140 + i * (Rd.R + 140) * 2 / 8; ctx.beginPath(); ctx.arc(xx, Rd.top + 110, 36, 0, Math.PI); ctx.fillStyle = i % 2 ? RED : "#FFF1C9"; ctx.fill(); ol(ctx, 4); }
        ctx.beginPath(); ctx.moveTo(Rd.cx, Rd.top - 120); ctx.lineTo(Rd.cx, Rd.top - 200); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(Rd.cx, Rd.top - 200); ctx.lineTo(Rd.cx + 70 + Math.sin(t * 6) * 8, Rd.top - 180); ctx.lineTo(Rd.cx, Rd.top - 160); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4);
        // speed lines
        if (spinQ > .2){ ctx.save(); ctx.globalAlpha = spinQ * .7; ctx.strokeStyle = CREAM; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const yy = Rd.base - 420 + i * 60, a = (t * 3 + i * .3) % 1; ctx.beginPath(); ctx.moveTo(Rd.cx - Rd.R - 160 + a * 40, yy); ctx.lineTo(Rd.cx - Rd.R - 60 + a * 40, yy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(Rd.cx + Rd.R + 60 - a * 40, yy + 30); ctx.lineTo(Rd.cx + Rd.R + 160 - a * 40, yy + 30); ctx.stroke(); } ctx.restore(); }
      } });
  }, sfxWith((s, f, i, add) => { const Rd = f.ride || {}; if (Rd.spinCue) add(cueT(s, Rd.spinCue, .3, i), "whoosh"); if (Rd.stopCue) add(cueT(s, Rd.stopCue, .3, i), "pop"); }));

  /* ================= _kit: meeting kit case ================= */
  TT.scene(PX + "kit", "Cerita: kotak kit rapat (potongan busa, item masuk, daftar cek di tutup)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, K = Object.assign({ x: 640, ds: 1 }, f.kit || {});
    const tIn = T(s, K.inCue, .3, idx), its = (K.items || []).map((it, n) => Object.assign({ T: T(s, it.cue, .3, idx) }, it)), tChk = T(s, K.checkCue, .3, idx), tDone = T(s, K.doneCue, .4, idx);
    const top = GY - 290 * K.ds, W2 = 560, trayH = 130, lidH = 330;
    const slot = { cable: [-170, -70], marker: [10, -64], remote: [180, -66] };
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 1000 },
      spots: { kit: [K.x, top - 200, 1.2] },
      back: () => { prop(ctx, "desk", K.x, GY, { s: K.ds }, t); },
      mid: (ctx2, c, sts) => { const q = t < tIn ? 0 : eBack(clamp((t - tIn) / .5, 0, 1)); if (q <= 0) return; const hero = sts[0];
        ctx.save(); ctx.translate(K.x, top); ctx.scale(q, q);
        // lid (open, upright)
        const lidA = eOut(clamp((t - tIn - .3) / .6, 0, 1)); ctx.save(); ctx.translate(0, -trayH); ctx.scale(1, .25 + .75 * lidA);
        rr(ctx, -W2 / 2, -lidH, W2, lidH, 20); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 7); rr(ctx, -W2 / 2 + 30, -lidH + 70, W2 - 60, lidH - 100, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4);
        textC(ctx, "KIT RAPAT", 0, -lidH + 52, 40, "#FFFFFF", 900);
        ["Kabel proyektor", "Spidol", "Remot AC"].forEach((lb, n) => { const yy = -lidH + 120 + n * 66; rr(ctx, -W2 / 2 + 50, yy - 26, 40, 40, 8); ctx.strokeStyle = BROWN; ctx.lineWidth = 4; ctx.stroke();
          ctx.save(); ctx.translate(0, 0); fit(ctx, lb, W2 - 200, 34, 800); ctx.fillStyle = BROWN; ctx.fillText(lb, -W2 / 2 + 110, yy + 6); ctx.restore();
          const tk = tChk + n * .35; if (t >= tk) check(ctx, -W2 / 2 + 70, yy - 6, eBack(clamp((t - tk) / .3, 0, 1)) * 1.3, GREEN); });
        ctx.restore();
        // tray
        rr(ctx, -W2 / 2, -trayH, W2, trayH, 18); ctx.fillStyle = "#3B4A6B"; ctx.fill(); ol(ctx, 7); rr(ctx, -W2 / 2 + 20, -trayH + 16, W2 - 40, 70, 10); ctx.fillStyle = "#2C2F36"; ctx.fill();
        ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = "#14161B"; ctx.beginPath(); ctx.ellipse(slot.cable[0], slot.cable[1], 60, 30, 0, 0, TAU); ctx.fill(); rr(ctx, slot.marker[0] - 70, slot.marker[1] - 16, 140, 32, 12); ctx.fill(); rr(ctx, slot.remote[0] - 70, slot.remote[1] - 22, 140, 44, 14); ctx.fill(); ctx.restore();
        ctx.fillStyle = GOLD; rr(ctx, -40, -18, 80, 22, 6); ctx.fill(); ol(ctx, 3);
        ctx.restore();
        its.forEach((it, n) => { const k = t - it.T; if (k < -.6) return; const hp = handOf(hero), sp = [K.x + slot[it.kind][0] * q, top + slot[it.kind][1]];
          let x, y, rot, sc; if (k < 0){ x = hp[0] + 30; y = hp[1] - 40; rot = 0; sc = .8; }
          else if (k < .55){ const u = eOut(k / .55); x = lerp(hp[0] + 30, sp[0], u); y = lerp(hp[1] - 40, sp[1], u) - Math.sin(u * Math.PI) * 220; rot = (1 - u) * 3; sc = .8; }
          else { x = sp[0]; y = sp[1]; rot = 0; sc = .8 * (1 + .12 * Math.exp(-(k - .55) * 8) * Math.sin((k - .55) * 30)); }
          const r0 = it.kind === "marker" ? Math.PI / 2 + .5 : it.kind === "remote" ? Math.PI / 2 - .3 : 0;
          drawItem(ctx, it.kind, x, y, t, { s: sc, rot: k >= .55 ? r0 : rot });
          if (k >= .55 && k < 1.2) sparkle(ctx, x + 50, y - 40, 20 * (1 - (k - .55) / .65), GOLD); }); }, midZ: 1,
      over: (ctx2, c) => { if (t >= tDone){ const sc = c.toScreen(K.x, top - 420); stampBox(ctx, K.doneText || "TEPAT WAKTU!", sc[0], clamp(sc[1], 300, 700), t - tDone, GREEN, 70, -.1); burstFx(ctx, sc[0], clamp(sc[1], 300, 700), t - tDone - .1, GREEN, 12, 260); } } });
  }, sfxWith((s, f, i, add) => { const K = f.kit || {}; if (K.inCue) add(cueT(s, K.inCue, .3, i), "whoosh"); (K.items || []).forEach(it => add(cueT(s, it.cue, .3, i) + .55, "pop")); if (K.checkCue) add(cueT(s, K.checkCue, .3, i), "chime"); if (K.doneCue) add(cueT(s, K.doneCue, .4, i), "chime"); }));

  /* ================= bazaar booth ================= */
  function speaker(ctx, x, t, st){ const top = GY - 560; ctx.save();
    ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, top + 230); ctx.lineTo(x - 80, GY); ctx.moveTo(x, top + 230); ctx.lineTo(x + 80, GY); ctx.moveTo(x, top + 230); ctx.lineTo(x, GY); ctx.stroke();
    const pulse = st.music ? .06 * Math.abs(Math.sin(t * 9)) : 0, sh = st.dead && st.k < .5 ? Math.sin(st.k * 60) * 8 * (1 - st.k * 2) : 0;
    ctx.translate(x + sh, top + 115); ctx.scale(1 + pulse, 1 + pulse);
    rr(ctx, -85, -125, 170, 250, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 6);
    [[-60, 38], [45, 58]].forEach(([yy, r]) => { ctx.beginPath(); ctx.arc(0, yy, r, 0, TAU); ctx.fillStyle = "#4A4A52"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, yy, r * .4, 0, TAU); ctx.fillStyle = st.dead ? "#3B3A3F" : "#9AA6B2"; ctx.fill(); });
    ctx.beginPath(); ctx.arc(60, -105, 8, 0, TAU); ctx.fillStyle = st.dead ? "#5A4A4A" : "#5BE37A"; ctx.fill();
    ctx.restore();
    if (st.dead){ const k = st.k; for (let i = 0; i < 6; i++){ const q = ((t * .45) + i / 6) % 1; ctx.save(); ctx.globalAlpha = (k < 1 ? 1 : .6) * Math.sin(q * Math.PI) * .8; puffC(ctx, x - 20 + Math.sin(q * 5 + i) * 30, top - 10 - q * 260, 30 + q * 50, "#6B6670"); ctx.restore(); }
      if (k < .6) burstFx(ctx, x, top + 100, k, "#F6D36B", 10, 180); }
    if (st.spark >= 0 && st.spark < 2.2){ for (let i = 0; i < 8; i++){ const q = ((st.spark * 2.2) + i / 8) % 1, a = rnd(i) * TAU; ctx.strokeStyle = i % 2 ? GOLD : "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 70 + Math.cos(a) * q * 60, top + 200 + Math.sin(a) * q * 60); ctx.lineTo(x - 70 + Math.cos(a) * (q * 60 + 22), top + 200 + Math.sin(a) * (q * 60 + 22)); ctx.stroke(); } }
    if (st.music){ for (let i = 0; i < 6; i++){ const q = ((t * .5) + i / 6) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); note(ctx, x - 40 + Math.sin(q * 6 + i) * 80 - q * 200 * (i % 2 ? 1 : -.3), top - q * 380, .9 + q * .4, i % 2 ? ORANGE : "#FFFFFF"); ctx.restore(); } }
  }
  function booth(ctx, x, t, o){ o = o || {}; const L = x - 380, Rr = x + 380, aw = 860; ctx.save();
    ctx.fillStyle = "#EDE3D0"; [L, Rr - 22].forEach(px => { rr(ctx, px, aw, 22, GY - aw, 6); ctx.fill(); ol(ctx, 4); });
    ctx.fillStyle = hexA("#FFF4E6", .5); ctx.fillRect(L + 22, aw, Rr - L - 44, GY - aw - 260);
    // bunting
    ctx.strokeStyle = BROWN; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(L - 120, aw - 170); ctx.quadraticCurveTo(x, aw - 90, Rr + 120, aw - 170); ctx.stroke();
    for (let i = 0; i < 12; i++){ const u = (i + .5) / 12, bx = lerp(L - 120, Rr + 120, u), by = aw - 170 + 2 * u * (1 - u) * 160 - 0; const sw = Math.sin(t * 3 + i) * .15;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(sw); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(0, 50); ctx.closePath(); ctx.fillStyle = [ORANGE, GOLD, TEAL, RED][i % 4]; ctx.fill(); ol(ctx, 3); ctx.restore(); }
    // awning
    ctx.beginPath(); ctx.moveTo(L - 50, aw); ctx.lineTo(L + 20, aw - 110); ctx.lineTo(Rr - 20, aw - 110); ctx.lineTo(Rr + 50, aw); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill();
    ctx.save(); ctx.clip(); for (let i = 0; i < 12; i++){ ctx.fillStyle = i % 2 ? ORANGE : CREAM; ctx.fillRect(L - 50 + i * (Rr - L + 100) / 11, aw - 120, (Rr - L + 100) / 22, 140); } ctx.restore();
    ctx.beginPath(); ctx.moveTo(L - 50, aw); ctx.lineTo(L + 20, aw - 110); ctx.lineTo(Rr - 20, aw - 110); ctx.lineTo(Rr + 50, aw); ctx.closePath(); ol(ctx, 6);
    for (let i = 0; i < 10; i++){ const xx = L - 50 + (i + .5) * (Rr - L + 100) / 10; ctx.beginPath(); ctx.arc(xx, aw, (Rr - L + 100) / 20, 0, Math.PI); ctx.fillStyle = i % 2 ? CREAM : ORANGE; ctx.fill(); ol(ctx, 4); }
    rr(ctx, x - 210, aw - 230, 420, 100, 16); ctx.fillStyle = BROWN; ctx.fill(); ol(ctx, 5); textC(ctx, o.title || "BAZAR KANTOR", x, aw - 162, 46, GOLD, 900, 380);
    ctx.restore(); }
  function counterFront(ctx, x, t, o){ const top = GY - 270, L = x - 330, w = 660; ctx.save();
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, GY + 4, 360, 20, 0, 0, TAU); ctx.fill();
    // products on table
    [[-260, "#E8A55B", 90], [-170, "#7FA563", 120], [-80, "#F3D9B5", 80]].forEach(([dx, c, h], n) => { rr(ctx, x + dx - 36, top - h, 72, h, 10); ctx.fillStyle = c; ctx.fill(); ol(ctx, 4); rr(ctx, x + dx - 24, top - h * .6, 48, 22, 4); ctx.fillStyle = PAPER; ctx.fill(); });
    for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.arc(x + 10 + i * 34, top - 26 - (i % 2) * 20, 22, 0, TAU); ctx.fillStyle = ["#D9483B", "#F6C343", "#E07A9B"][i % 3]; ctx.fill(); ol(ctx, 3); }
    // cash box
    const cx = x + 240; rr(ctx, cx - 70, top - 90, 140, 90, 10); ctx.fillStyle = "#5B7DB1"; ctx.fill(); ol(ctx, 5); rr(ctx, cx - 50, top - 76, 100, 30, 6); ctx.fillStyle = "#BFE2EA"; ctx.fill(); textC(ctx, o.cash || "KASIR", cx, top - 54, 22, BROWN, 900);
    rr(ctx, L, top, w, 40, 10); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5);
    rr(ctx, L + 20, top + 40, w - 40, GY - top - 40, 6); ctx.fillStyle = "#FFF4E6"; ctx.fill(); ol(ctx, 5);
    ctx.save(); rr(ctx, L + 20, top + 40, w - 40, GY - top - 40, 6); ctx.clip(); for (let i = 0; i < 8; i++){ ctx.fillStyle = hexA(ORANGE, .85); ctx.beginPath(); ctx.arc(L + 20 + (i + .5) * (w - 40) / 8, top + 40, (w - 40) / 16, 0, Math.PI); ctx.fill(); } ctx.restore();
    textC(ctx, o.sign || "DISKON 20%", x, top + 170, 44, ORANGE, 900, w - 100);
    ctx.restore(); }
  function bzState(s, t, idx, B){ const tDie = T(s, B.dieCue, .4, idx), tFix = T(s, B.fixCue, .3, idx), tMus = T(s, B.musicCue, .3, idx);
    const dead = B.mode === "pulih" ? t < tMus : t >= tDie; return { dead, k: B.mode === "pulih" ? 9 : t - tDie, spark: t >= tFix && t < tMus ? t - tFix : -1, music: B.mode === "pulih" ? t >= tMus : t < tDie }; }
  TT.scene(PX + "bazar", "Cerita: stan bazar (tenda, pengeras suara mati / menyala lagi)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, B = Object.assign({ x: 500, spkX: 960, mode: "mati" }, f.bz || {}), st = bzState(s, t, idx, B);
    base(ctx, s, t, { env: "park", envOpt: { time: "day" }, envFront: false,
      spots: { spk: [B.spkX - 60, GY - 480, 1.25], booth: [B.x, 1080, 1.0], cash: [B.x + 240, GY - 420, 1.3] },
      back: () => { booth(ctx, B.x, t, {}); speaker(ctx, B.spkX, t, st); },
      front: () => counterFront(ctx, B.x, t, {}),
      over: (ctx2, c) => { if (st.dead && B.mode !== "pulih" && st.k >= 0){ const sc = c.toScreen(B.spkX, GY - 700); popChip(ctx, B.deadText || "MATI TOTAL!", clamp(sc[0], 260, 820), clamp(sc[1], 280, 800), st.k - .2, RED, "#FFFFFF", 44, .06); }
        if (B.mode === "pulih" && st.music){ const k = t - T(s, B.musicCue, .3, idx); const sc = c.toScreen(B.spkX, GY - 700); popChip(ctx, B.liveText || "NYALA LAGI!", clamp(sc[0], 260, 820), clamp(sc[1], 280, 800), k, GREEN, "#FFFFFF", 44, -.05); } } });
  }, sfxWith((s, f, i, add) => { const B = f.bz || {}; if (B.dieCue) add(cueT(s, B.dieCue, .4, i), "ping"); if (B.fixCue) add(cueT(s, B.fixCue, .3, i), "pop"); if (B.musicCue) add(cueT(s, B.musicCue, .3, i), "chime"); }));

  /* ================= _ribut: everyone on one cable in a dust cloud ================= */
  function standee(ctx, x, t, txt){ ctx.save(); ctx.translate(x, GY); ctx.rotate(Math.sin(t * 1.4) * .02);
    ctx.fillStyle = "#8E4E2E"; ctx.fillRect(-60, -30, 16, 30); ctx.fillRect(44, -30, 16, 30);
    rr(ctx, -110, -520, 220, 490, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); rr(ctx, -90, -500, 180, 120, 10); ctx.fillStyle = ORANGE; ctx.fill();
    textC(ctx, "SELAMAT", 0, -446, 36, "#FFFFFF", 900, 170); textC(ctx, "DATANG", 0, -404, 36, "#FFFFFF", 900, 170);
    ctx.beginPath(); ctx.arc(0, -250, 60, 0, TAU); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-20, -262, 7, 0, TAU); ctx.arc(20, -262, 7, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.arc(0, -240, 28, .15 * Math.PI, .85 * Math.PI); ol(ctx, 5);
    ctx.restore(); }
  TT.scene(PX + "ribut", "Cerita: semua mengerumuni satu kabel (awan debu kartun), tamu menunggu", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, D = Object.assign({ x: 700, y: 1380, spkX: 1010 }, f.dust || {}), tD = D.cue ? T(s, D.cue, .3, idx) : (D.at ?? .2);
    const q = clamp((t - tD) / .4, 0, 1);
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: 90 }, envFront: false,
      spots: { dust: [D.x, D.y - 200, 1.1] },
      back: () => { standee(ctx, D.standX ?? 150, t, ""); speaker(ctx, D.spkX, t, { dead: true, k: 5, spark: -1, music: false });
        // tangled cable on the ground
        ctx.strokeStyle = "#2C2433"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(D.spkX - 60, GY - 40);
        for (let i = 0; i < 9; i++){ const a = i * 1.7 + t * 2 * q; ctx.quadraticCurveTo(D.x + Math.cos(a) * 160, GY - 60 - Math.abs(Math.sin(a)) * 220 * q, D.x + Math.cos(a + 1) * 120, GY - 30 - i * 6); } ctx.stroke(); },
      post: (ctx2, c) => { if (q <= 0) return; ctx2.save(); c.apply(ctx2, 1);
        for (let i = 0; i < 14; i++){ const a = i / 14 * TAU + t * .8, rx = 340 + Math.sin(t * 5 + i) * 30, ry = 170 + Math.cos(t * 4 + i) * 20;
          puffC(ctx2, D.x + Math.cos(a) * rx * .8 * q, D.y + Math.sin(a) * ry * .7 * q, (120 + Math.sin(t * 7 + i * 2) * 20) * q, i % 2 ? "#E9DCC6" : "#F3E8D6"); }
        puffC(ctx2, D.x, D.y, 260 * q, "#F3E8D6");
        // flailing limbs + stars
        for (let i = 0; i < 6; i++){ const a = t * 9 + i * 1.3, L2 = 120 + 40 * Math.sin(t * 13 + i), bx = D.x + Math.cos(i * 1.1) * 200, by = D.y + Math.sin(i * 1.7) * 90;
          ctx2.strokeStyle = [TEAL, "#E8A55B", "#3B4A6B", "#7FA563"][i % 4]; ctx2.lineWidth = 26; ctx2.lineCap = "round"; ctx2.beginPath(); ctx2.moveTo(bx, by); ctx2.lineTo(bx + Math.cos(a) * L2, by + Math.sin(a) * L2 * .6); ctx2.stroke();
          ctx2.beginPath(); ctx2.arc(bx + Math.cos(a) * L2, by + Math.sin(a) * L2 * .6, 18, 0, TAU); ctx2.fillStyle = "#E2A77C"; ctx2.fill(); ol(ctx2, 4); }
        for (let i = 0; i < 5; i++){ const a = t * 3 + i * TAU / 5; sparkle(ctx2, D.x + Math.cos(a) * 300, D.y - 220 + Math.sin(a) * 60, 22, i % 2 ? GOLD : "#FFFFFF"); }
        ["!", "?!", "#", "!!"].forEach((g, i) => { const a = t * 2 + i * 1.6; textC(ctx2, g, D.x + Math.cos(a) * 260, D.y - 260 + Math.sin(a * 1.3) * 50, 70, i % 2 ? RED : BROWN, 900); });
        ctx2.restore(); } });
  }, sfxWith((s, f, i, add) => { const D = f.dust || {}; add(D.cue ? cueT(s, D.cue, .3, i) : .2, "whoosh"); }));

  /* ================= _pit: race pit stop ================= */
  function raceCar(ctx, x, t, v, col){ const y = GY; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0, 4, 400, 22, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-380, -60); ctx.lineTo(-380, -170); ctx.lineTo(-300, -170); ctx.lineTo(-250, -110); ctx.lineTo(-60, -120); ctx.quadraticCurveTo(-10, -200, 80, -190); ctx.lineTo(120, -120); ctx.lineTo(330, -100); ctx.quadraticCurveTo(400, -80, 410, -50); ctx.lineTo(410, -40); ctx.lineTo(-380, -40); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ol(ctx, 7);
    rr(ctx, -410, -190, 120, 26, 6); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4); rr(ctx, 330, -58, 110, 18, 6); ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.ellipse(20, -170, 40, 32, 0, Math.PI, TAU); ctx.fillStyle = "#F6C343"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(-140, -85, 36, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); textC(ctx, "39", -140, -72, 36, BROWN, 900);
    [[-250], [260]].forEach(([wx]) => { ctx.save(); ctx.translate(wx, -70); ctx.rotate(t * v * .03); ctx.beginPath(); ctx.arc(0, 0, 78, 0, TAU); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, 0, 36, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4);
      ctx.strokeStyle = OUT; ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * 2.1) * 34, Math.sin(i * 2.1) * 34); ctx.stroke(); } ctx.restore(); });
    if (Math.abs(v) > 300){ ctx.strokeStyle = hexA(CREAM, .8); ctx.lineWidth = 10; ctx.lineCap = "round"; for (let i = 0; i < 6; i++){ const yy = -180 + i * 28; ctx.beginPath(); ctx.moveTo(-430 - (i % 2) * 60, yy); ctx.lineTo(-640 - (i % 3) * 80, yy); ctx.stroke(); } }
    ctx.restore(); }
  TT.scene(PX + "pit", "Cerita: imajinasi pit stop balap (mobil masuk, kru bertugas, melesat)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Pp = Object.assign({ x: 600, time: "2,1" }, f.pit || {});
    const tE = T(s, Pp.enterCue, .2, idx), tW = T(s, Pp.workCue, .2, idx), tG = T(s, Pp.goCue, .3, idx);
    let cx, v = 0; if (t < tE) cx = -900; else if (t < tG){ const q = clamp((t - tE) / .9, 0, 1); cx = lerp(-900, Pp.x, eOut(q)); v = q < 1 ? 1500 * (1 - q) : 0; } else { const q = clamp((t - tG) / .9, 0, 1); cx = lerp(Pp.x, 2600, eIn(q)); v = 2500 * q + 400; }
    const working = t >= tW && t < tG;
    base(ctx, s, t, { env: "sky", envOpt: { hills: false }, envFront: false,
      spots: { car: [Pp.x, GY - 300, 1.0] },
      back: (ctx2, c) => {
        // grandstand + crowd
        ctx.fillStyle = "#5A6470"; ctx.fillRect(-600, 900, 2300, 330); ctx.fillStyle = "#3B4A6B"; for (let r = 0; r < 4; r++) ctx.fillRect(-600, 920 + r * 80, 2300, 10);
        for (let i = 0; i < 70; i++){ const xx = -560 + i * 32, yy = 960 + (i % 4) * 70 - Math.abs(Math.sin(t * 6 + i)) * 12; ctx.beginPath(); ctx.arc(xx, yy, 14, 0, TAU); ctx.fillStyle = ["#F6C343", "#E07A9B", "#FFFFFF", "#8FD3C7", ORANGE][i % 5]; ctx.fill(); }
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-600, 1230, 2300, 20); for (let i = 0; i < 40; i++){ ctx.fillStyle = i % 2 ? RED : "#FFFFFF"; ctx.fillRect(-600 + i * 60, 1250, 60, 24); }
        ctx.fillStyle = "#4A4A52"; ctx.fillRect(-600, 1274, 2300, 900); ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 10; ctx.setLineDash([80, 60]); ctx.beginPath(); ctx.moveTo(-600, 1700); ctx.lineTo(1700, 1700); ctx.stroke(); ctx.setLineDash([]);
        rr(ctx, 320, 800, 440, 100, 14); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 5); textC(ctx, "PIT STOP", 540, 875, 60, GOLD, 900);
        for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++){ ctx.fillStyle = (i + j) % 2 ? "#FFFFFF" : "#1E1A18"; ctx.fillRect(900 + i * 26, 640 + j * 26 + Math.sin(t * 5 + i * .6) * 8, 26, 26); }
        ctx.fillStyle = "#9AA6B2"; ctx.fillRect(896, 630, 6, 230); },
      front: (ctx2, c, sts) => { raceCar(ctx, cx, t, v, ORANGE);
        if (working){ [[-250], [260]].forEach(([wx], n) => { for (let i = 0; i < 6; i++){ const q = ((t * 3) + i / 6 + n * .3) % 1, a = rnd(i + n * 7) * Math.PI - Math.PI; ctx.strokeStyle = i % 2 ? GOLD : "#FFFFFF"; ctx.lineWidth = 6; ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(cx + wx + Math.cos(a) * (30 + q * 80), GY - 70 + Math.sin(a) * (30 + q * 80)); ctx.lineTo(cx + wx + Math.cos(a) * (50 + q * 100), GY - 70 + Math.sin(a) * (50 + q * 100)); ctx.stroke(); } }); }
        if (t >= tG && t < tG + 1.2){ for (let i = 0; i < 8; i++){ const q = (t - tG) / 1.2; ctx.save(); ctx.globalAlpha = (1 - q) * .8; puffC(ctx, Pp.x - 300 - i * 60 - q * 200, GY - 40 - rnd(i) * 80, 50 + q * 60, "#D8D2C8"); ctx.restore(); } } },
      over: () => { if (t >= tW){ const el = t < tG ? (t - tW) : (tG - tW), shown = t < tG ? Math.min(parseFloat(Pp.time.replace(",", ".")) - .1, el * .45).toFixed(1).replace(".", ",") : Pp.time;
        ctx.save(); const q = eBack(clamp((t - tW) / .35, 0, 1)); ctx.translate(540, 250); ctx.scale(q, q); rr(ctx, -210, -70, 420, 140, 26); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 6, GOLD);
          textC(ctx, shown + " DTK", 0, 30, 84, t >= tG ? "#5BE37A" : GOLD, 900, 380); ctx.restore(); } } });
  }, sfxWith((s, f, i, add) => { const P2 = f.pit || {}; if (P2.enterCue) add(cueT(s, P2.enterCue, .2, i), "whoosh"); if (P2.workCue) add(cueT(s, P2.workCue, .2, i), "pop"); if (P2.goCue) add(cueT(s, P2.goCue, .3, i), "whoosh"); }));

  /* ================= _tutorial: floating video player at night ================= */
  TT.scene(PX + "tutorial", "Cerita: video tutorial 10 fitur rahasia (pemutar melayang, penghitung fitur)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Vd = Object.assign({ x: 540, y: 300, w: 860, h: 470, sofaX: 420 }, f.vid || {});
    const tIn = Vd.inCue ? T(s, Vd.inCue, .2, idx) : (Vd.at ?? .2), tC = T(s, Vd.countCue, .3, idx), tEnd = T(s, Vd.endCue, .5, idx);
    const n = t < tC ? 1 : Math.min(10, 1 + Math.floor(((t - tC) / Math.max(.6, tEnd - tC)) * 9.99));
    base(ctx, s, t, { env: "home", envOpt: { lampX: 980 },
      spots: { vid: [Vd.x, Vd.y + Vd.h / 2 + 60, 1.1] },
      back: () => { prop(ctx, "sofa", Vd.sofaX, GY, { s: 1, color: "#2F6F73" }, t); },
      over: (ctx2, c) => { const q = t < tIn ? 0 : eBack(clamp((t - tIn) / .5, 0, 1)); if (q <= 0) return; const p0 = c.toScreen(Vd.x, Vd.y), sc = c.scale(1);
        ctx.save(); ctx.translate(p0[0], p0[1] + Math.sin(t * 1.6) * 8); ctx.scale(q * sc, q * sc); ctx.rotate(-.015);
        const w = Vd.w, h = Vd.h; ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowOffsetY = 14; rr(ctx, -w / 2, 0, w, h, 26); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.shadowColor = "transparent"; ol(ctx, 7);
        rr(ctx, -w / 2 + 22, 22, w - 44, h - 110, 14); ctx.fillStyle = "#FFF1C9"; ctx.fill();
        ctx.save(); rr(ctx, -w / 2 + 22, 22, w - 44, h - 110, 14); ctx.clip();
        for (let i = 0; i < 8; i++){ ctx.fillStyle = hexA(i % 2 ? ORANGE : GOLD, .35); ctx.beginPath(); ctx.moveTo(-60, h / 2 - 40); ctx.arc(-60, h / 2 - 40, 900, i * TAU / 8 + t * .3, i * TAU / 8 + t * .3 + TAU / 16); ctx.closePath(); ctx.fill(); }
        const bounce = 1 + .05 * Math.sin(t * 6);
        ctx.save(); ctx.translate(-190, 150); ctx.scale(bounce, bounce); ctx.rotate(-.06); textC(ctx, "10 FITUR", 0, 0, 92, RED, 900, 420); textC(ctx, "RAHASIA", 0, 84, 76, BROWN, 900, 420); ctx.restore();
        ctx.save(); ctx.translate(-190, 300); rr(ctx, -200, -36, 400, 60, 14); ctx.fillStyle = TEAL; ctx.fill(); textC(ctx, "SPREADSHEET!", 0, 8, 40, "#FFFFFF", 900, 380); ctx.restore();
        // mini spreadsheet grid with flying feature icons
        ctx.save(); ctx.translate(210, 70); rr(ctx, -150, 0, 300, 250, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = GREEN; ctx.fillRect(-150, 0, 300, 40);
        ctx.strokeStyle = "#C9D2DA"; ctx.lineWidth = 2; for (let i = 1; i < 5; i++){ ctx.beginPath(); ctx.moveTo(-150, 40 + i * 42); ctx.lineTo(150, 40 + i * 42); ctx.stroke(); } for (let i = 1; i < 3; i++){ ctx.beginPath(); ctx.moveTo(-150 + i * 100, 40); ctx.lineTo(-150 + i * 100, 250); ctx.stroke(); }
        const fi = (n - 1) % 5; ctx.fillStyle = hexA(ORANGE, .35); ctx.fillRect(-150 + (fi % 3) * 100, 40 + fi * 42, 100, 42); ctx.restore();
        ctx.save(); ctx.translate(210, 380); const pq = eBack(clamp(((t - tC) % .5) / .3, 0, 1)); ctx.scale(t >= tC ? pq : 1, t >= tC ? pq : 1); rr(ctx, -120, -38, 240, 64, 32); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); textC(ctx, "FITUR " + n + "/10", 0, 8, 36, "#FFFFFF", 900, 220); ctx.restore();
        ctx.restore();
        // controls + progress
        const pr = clamp((t - tIn) / Math.max(1, (tEnd - tIn) + 1), 0, 1); rr(ctx, -w / 2 + 110, h - 62, w - 160, 16, 8); ctx.fillStyle = "#4A4A52"; ctx.fill(); rr(ctx, -w / 2 + 110, h - 62, (w - 160) * pr, 16, 8); ctx.fillStyle = RED; ctx.fill();
        ctx.beginPath(); ctx.arc(-w / 2 + 110 + (w - 160) * pr, h - 54, 16, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(-w / 2 + 44, h - 76); ctx.lineTo(-w / 2 + 44, h - 32); ctx.lineTo(-w / 2 + 80, h - 54); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        if (n >= 10 && t > tEnd - .2){ ctx.restore(); burstFx(ctx, p0[0] + 210 * sc, p0[1] + 380 * sc, t - tEnd + .2, GOLD, 12, 220); return; }
        ctx.restore(); } });
  }, sfxWith((s, f, i, add) => { const V = f.vid || {}; add(V.inCue ? cueT(s, V.inCue, .2, i) : .2, "whoosh"); if (V.countCue) add(cueT(s, V.countCue, .3, i), "pop"); if (V.endCue) add(cueT(s, V.endCue, .5, i), "chime"); }));

  /* ================= _prasmanan: buffet of features ================= */
  function hall(ctx, t){ ctx.fillStyle = "#6B2E3A"; ctx.fillRect(-800, -400, 2700, 2100); ctx.fillStyle = "#7A3646"; for (let i = 0; i < 30; i++) ctx.fillRect(-800 + i * 90, -400, 45, 2100);
    ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 4; i++){ ctx.moveTo(-600, 240 + i * 8); } ctx.stroke();
    for (let row = 0; row < 2; row++){ ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-300, 240 + row * 160); for (let i = 0; i <= 8; i++) ctx.quadraticCurveTo(-300 + i * 220 - 110, 300 + row * 160, -300 + i * 220, 240 + row * 160); ctx.stroke();
      for (let i = 0; i < 16; i++){ const x = -300 + i * 110 + 55, y = 262 + row * 160 + (i % 2) * 14, on = (i + row + Math.floor(t * 4)) % 3 !== 0; glowAt(ctx, x, y, 40, "#FFE9A8", on ? .7 : .25); ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fillStyle = on ? "#FFE9A8" : "#B59A6A"; ctx.fill(); } }
    ctx.fillStyle = "#C9A27A"; ctx.fillRect(-800, GY - 60, 2700, 600); ctx.fillStyle = "#B58E66"; for (let i = 0; i < 30; i++) ctx.fillRect(-800 + i * 120, GY - 60, 4, 600); }
  const BUF = ["FILTER", "PIVOT", "GRAFIK", "MAKRO", "RUMUS"];
  TT.scene(PX + "prasmanan", "Cerita: prasmanan fitur (tutup saji terbuka, piring menumpuk, lalu lupa)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene, Bf = Object.assign({ cues: [], top: GY - 300 }, f0.buf || {});
    const tc = Bf.cues.map((cu, n) => T(s, cu, .2 + n * .12, idx)), tWob = T(s, Bf.wobbleCue, .3, idx), tFall = T(s, Bf.fallCue, .5, idx);
    const opened = tc.filter(x => t >= x).length, plateN = Math.min(10, opened * 2), Fg = f0.forget || {}, tF = T(s, Fg.cue, .3, idx);
    base(ctx, s, t, {
      back: (ctx2, c, sts, R) => { const part = R.f.part || "pesta";
        if (part === "pesta"){ hall(ctx, t); textC(ctx, "PRASMANAN FITUR", 540, 560, 64, GOLD, 900, 800); }
        else prop(ctx, "desk", 700, GY, { s: .95, laptop: true, lx: 0 }, t); },
      mid: (ctx2, c, sts, R) => { if ((R.f.part || "pesta") !== "pesta") return; const top = Bf.top;
        ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(540, GY + 4, 560, 26, 0, 0, TAU); ctx.fill();
        BUF.forEach((lb, n) => { const x = 140 + n * 200, oq = n < opened ? eBack(clamp((t - tc[n]) / .4, 0, 1)) : 0;
          rr(ctx, x - 80, top - 70, 160, 70, 14); ctx.fillStyle = "#C9CED6"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ["#E8A55B", "#7FA563", "#D9483B", "#F6C343", "#8E4E2E"][n]; rr(ctx, x - 66, top - 80, 132, 26, 10); ctx.fill();
          if (oq > 0){ for (let i = 0; i < 3; i++){ const q = (t * .6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = .6 * Math.sin(q * Math.PI); puffC(ctx, x - 20 + i * 20, top - 120 - q * 120, 20 + q * 16, "#FFFFFF"); ctx.restore(); } }
          ctx.save(); ctx.translate(x + 70 * oq, top - 80 - 90 * Math.sin(oq * Math.PI / 2)); ctx.rotate(oq * .9); ctx.beginPath(); ctx.ellipse(0, 0, 84, 50, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = "#DADDE2"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(0, -54, 10, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3); ctx.restore(); });
        rr(ctx, 20, top, 1040, 30, 10); ctx.fillStyle = "#FFFDF6"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = ORANGE; rr(ctx, 40, top + 30, 1000, GY - top - 30, 6); ctx.fill(); ol(ctx, 5);
        ctx.save(); ctx.beginPath(); ctx.rect(40, top + 30, 1000, 120); ctx.clip(); for (let i = 0; i < 10; i++){ ctx.beginPath(); ctx.arc(90 + i * 100, top + 30, 50, 0, Math.PI); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ol(ctx, 4); } ctx.restore();
        BUF.forEach((lb, n) => { const x = 140 + n * 200; ctx.save(); ctx.translate(x, top + 110); ctx.rotate((n % 2 ? .04 : -.04)); rr(ctx, -82, -30, 164, 56, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, lb, 0, 10, 30, BROWN, 900, 150); ctx.restore(); });
        // plate tower in the hero's hands
        const hero = sts[0]; if (hero){ const hp = handOf(hero), wob = t >= tWob ? Math.min(1, (t - tWob) * 1.2) : 0;
          if (t < tFall) drawItem(ctx, "plate", hp[0] + 20 * (hero.face || 1), hp[1] + 10, t, { s: .85, n: plateN, wob });
          else { const k = t - tFall; for (let i = 0; i < plateN; i++){ ctx.save(); ctx.translate(hp[0] + 20 + (rnd(i) - .5) * k * 700, hp[1] - i * 30 + k * k * 1400 - k * 300); ctx.rotate(k * (rnd(i + 3) - .5) * 12); ctx.beginPath(); ctx.ellipse(0, 0, 54, 20, 0, 0, TAU); ctx.fillStyle = ["#E8A55B", "#7FA563", "#D9483B", "#F6C343", "#8E4E2E"][i % 5]; ctx.fill(); ol(ctx, 4); ctx.restore(); } } } }, midZ: 1,
      over: (ctx2, c, sts, R) => { if ((R.f.part || "pesta") === "pesta"){ if (opened){ const k = t - tc[opened - 1]; if (k < 1.1){ const hp = sts[0] ? c.toScreen(...handOf(sts[0])) : [540, 900]; popWord(ctx, "+" + BUF[(opened - 1) % 5], clamp(hp[0], 260, 820), Math.max(300, hp[1] - 420), k, { size: 62, rot: -4 }); } }
        if (t >= tFall) popWord(ctx, "BRUK!", 540, 640, t - tFall, { size: 140, rot: 6, hold: 1.3, col: RED }); }
        else if (t >= tF){ const r = R[0]; if (!r || !r.screen) return; const h = r.screen.head;
          BUF.concat(["SORTIR", "TABEL", "FREEZE"]).forEach((lb, n) => { const k = t - tF - n * .15; if (k < 0) return; const a = -Math.PI / 2 + (n - 3.5) * .35, d = 160 + k * 420;
            ctx.save(); ctx.globalAlpha = clamp(1.6 - k, 0, 1); popChip(ctx, lb, h[0] + Math.cos(a) * d, Math.max(200, h[1] - 120 + Math.sin(a) * d * .6), k + .4, PAPER, BROWN, 28, (n % 2 ? .1 : -.1)); ctx.restore(); }); } } });
  }, sfxWith((s, f, i, add) => { const B = f.buf || {}; (B.cues || []).forEach((cu, n) => add(cueT(s, cu, .2 + n * .12, i), "pop")); if (B.wobbleCue) add(cueT(s, B.wobbleCue, .3, i), "whoosh"); if (B.fallCue) add(cueT(s, B.fallCue, .5, i), "ping"); if ((f.forget || {}).cue) add(cueT(s, f.forget.cue, .3, i), "whoosh"); }));

  /* ================= _silat: practice one move ================= */
  const MOVES = ["point", "hips", "pointUp", "point", "shock"];
  TT.scene(PX + "silat", "Cerita: latihan jurus silat (guru & murid, penghitung ulangan)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sl = Object.assign({ on: 1, max: 100, signX: 860 }, f.silat || {});
    const tP = T(s, Sl.practiceCue, .2, idx), tC = T(s, Sl.countCue, .2, idx), tCe = Sl.countEndCue ? T(s, Sl.countEndCue, .9, idx) : tC + 2.5;
    const beat = .42, nb = t >= tP ? Math.floor((t - tP) / beat) : -1;
    const cnt = t < tC ? (nb >= 0 ? Math.min(nb + 1, 9) : 0) : Math.round(lerp(Math.min(nb + 1, 9), Sl.max, eOut(ramp(t, tC, tCe))));
    base(ctx, s, t, { env: "park", envOpt: { time: "day", treeX: 120 }, envFront: false,
      mod: (sts) => { if (nb >= 0){ [Sl.on, Sl.guru ?? -1].forEach(j => { if (j < 0 || !sts[j]) return; sts[j].pose = MOVES[nb % MOVES.length]; sts[j].prevPose = MOVES[(nb + MOVES.length - 1) % MOVES.length]; sts[j].poseT = tP + nb * beat; }); } },
      back: () => { // practice mat + sign
        ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.ellipse(540, GY - 10, 520, 60, 0, 0, TAU); ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA(CREAM, .7); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(540, GY - 10, 420, 44, 0, 0, TAU); ctx.stroke();
        ctx.save(); ctx.translate(Sl.signX, GY - 60); ctx.rotate(.03); const sh = Sl.signH || 560; ctx.fillStyle = "#7A4A2E"; ctx.fillRect(-8, -sh, 16, sh); rr(ctx, -150, -sh - 140, 300, 170, 14); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6);
        textC(ctx, "JURUS", 0, -sh - 80, 40, BROWN, 900); textC(ctx, Sl.move || "FILTER", 0, -sh - 15, 54, RED, 900, 270); ctx.restore(); },
      over1: (ctx2, c, sts, j) => { if (j !== Sl.on || nb < 0) return; const st = sts[j], k = (t - tP) % beat, hp = handOf(st);
        if (k < .2){ ctx2.save(); ctx2.globalAlpha = 1 - k / .2; ctx2.strokeStyle = CREAM; ctx2.lineWidth = 8; ctx2.lineCap = "round"; for (let i = 0; i < 4; i++){ const a = -.6 + i * .4; ctx2.beginPath(); ctx2.moveTo(hp[0] + Math.cos(a) * 50, hp[1] + Math.sin(a) * 50); ctx2.lineTo(hp[0] + Math.cos(a) * (90 + k * 200), hp[1] + Math.sin(a) * (90 + k * 200)); ctx2.stroke(); } ctx2.restore(); }
        if (k < .3){ ctx2.save(); ctx2.globalAlpha = .6 * (1 - k / .3); puffC(ctx2, st.x - 60, GY - 20, 40 + k * 120, "#E9DCC6"); puffC(ctx2, st.x + 60, GY - 20, 40 + k * 120, "#E9DCC6"); ctx2.restore(); } },
      over: (ctx2, c, sts, R) => { if (cnt > 0){ const big = t >= tC; ctx.save(); ctx.translate(540, 330); const pq = 1 + .12 * Math.exp(-((t - tP) % beat) * 10); ctx.scale(pq, pq); ctx.rotate(-.04);
          outlineWords(ctx, [{ w: "×" + cnt, hl: true }], 0, 30, big ? 150 : 120, { sw: 34, hl: big && cnt >= Sl.max ? "#5BE37A" : HL }); ctx.restore(); }
        if (nb >= 0 && nb % 3 === 0){ const k = (t - tP) % beat, r = R[Sl.on]; if (r && r.screen) popWord(ctx, "HIAT!", clamp(r.screen.top[0] + 230, 280, 820), Math.max(420, r.screen.top[1] - 40), k, { size: 70, rot: 8, hold: .4 }); } } });
  }, sfxWith((s, f, i, add) => { const S2 = f.silat || {}; if (S2.practiceCue){ const t0 = cueT(s, S2.practiceCue, .2, i); for (let k = 0; k < 6; k++) add(t0 + k * .42 * 2, "whoosh"); } if (S2.countCue) add(cueT(s, S2.countCue, .2, i), "chime"); }));

  /* ================= _sabuk: daily practice in the office ================= */
  const BELT = ["#FFFFFF", "#F6D36B", "#E8A55B", "#3E9B5A", "#5B7DB1", "#8E4E2E", "#1E1A18"];
  TT.scene(PX + "sabuk", "Cerita: 14 hari latihan satu fitur di kantor (petak hari, sabuk berganti warna, jam 60 -> 10)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sb = Object.assign({ on: 0, deskX: 790 }, f.sabuk || {});
    const tD = T(s, Sb.dayCue, .2, idx), tE = T(s, Sb.endCue, .8, idx), tF = T(s, Sb.filterCue, .4, idx), tT = T(s, Sb.timeCue, .3, idx), tAuto = T(s, Sb.autoCue, .3, idx);
    const days = t < tD ? 0 : Math.min(14, Math.floor(ramp(t, tD, tE) * 14) + 1), belt = BELT[Math.min(6, Math.floor(days / 2))];
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 110 },
      beltCol: (j, col) => j === Sb.on ? belt : col,
      spots: { desk: [Sb.deskX, GY - 520, 1.2] },
      back: () => { prop(ctx, "desk", Sb.deskX, GY, { s: .95, laptop: true, lx: -20, mug: true }, t);
        // days board on the wall
        ctx.save(); ctx.translate(540, 470); rr(ctx, -440, -40, 880, 250, 18); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 6); textC(ctx, "LATIHAN FILTER", 0, 4, 34, ORANGE, 900);
        for (let i = 0; i < 14; i++){ const cx = -385 + (i % 7) * 128, cy = 50 + Math.floor(i / 7) * 82, on = i < days; rr(ctx, cx - 50, cy - 4, 100, 70, 10); ctx.fillStyle = on ? hexA(GREEN, .18) : "#F2ECE2"; ctx.fill(); ol(ctx, 3);
          textC(ctx, "H" + (i + 1), cx - 18, cy + 44, 24, BROWN, 800); if (on) check(ctx, cx + 22, cy + 30, i === days - 1 ? eBack(clamp((t - tD) * 14 % 1 / .3, 0, 1)) * 1.2 : 1.2, GREEN); }
        ctx.restore(); },
      over1: (ctx2, c, sts, j) => { if (j !== Sb.on || t < tAuto || t > tT) return; const hp = handOf(sts[j]); ctx2.strokeStyle = hexA(CREAM, .9); ctx2.lineWidth = 7; ctx2.lineCap = "round";
        for (let i = 0; i < 5; i++){ const a = (t * 7 + i * 1.3) % TAU; ctx2.beginPath(); ctx2.arc(hp[0], hp[1], 46 + i * 9, a, a + .8); ctx2.stroke(); } },
      over: (ctx2, c, sts, R) => {
        if (t >= tF && t < tT){ const k = t - tF, sc = c.toScreen(Sb.deskX - 20, GY - 520); const tap = (k % .8) < .15; ctx.save(); ctx.translate(clamp(sc[0], 300, 800), Math.max(260, sc[1] - 230)); const q = eBack(clamp(k / .4, 0, 1)) * (tap ? .9 : 1); ctx.scale(q, q);
          rr(ctx, -150, -46, 300, 92, 46); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.moveTo(-110, -22); ctx.lineTo(-50, -22); ctx.lineTo(-72, 4); ctx.lineTo(-72, 26); ctx.lineTo(-88, 18); ctx.lineTo(-88, 4); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
          textC(ctx, "FILTER", 40, 16, 44, "#FFFFFF", 900); if (tap){ ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.stroke(); } ctx.restore(); }
        if (t >= tT){ const k = t - tT, q = eBack(clamp(k / .5, 0, 1)), m = Math.round(lerp(60, 10, eOut(clamp((k - .4) / 1.6, 0, 1))));
          ctx.save(); ctx.translate(540, 520); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 9);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 150, -Math.PI / 2, -Math.PI / 2 + TAU * m / 60); ctx.closePath(); ctx.fillStyle = m <= 10 ? hexA(GREEN, .8) : hexA(ORANGE, .75); ctx.fill();
          ctx.beginPath(); ctx.arc(0, 0, 92, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, String(m), 0, 18, 76, m <= 10 ? GREEN : BROWN, 900); textC(ctx, "MENIT", 0, 62, 26, BROWN, 800); ctx.restore();
          if (m <= 10) burstFx(ctx, 540, 520, k - 2.0, GREEN, 12, 260); } } });
  }, sfxWith((s, f, i, add) => { const S2 = f.sabuk || {}; if (S2.dayCue) add(cueT(s, S2.dayCue, .2, i), "whoosh"); if (S2.filterCue) add(cueT(s, S2.filterCue, .4, i), "pop"); if (S2.timeCue){ add(cueT(s, S2.timeCue, .3, i), "pop"); add(cueT(s, S2.timeCue, .3, i) + 2.0, "chime"); } }));

  /* ================= laundry shop ================= */
  function washer(ctx, x, t, spin, col){ const top = GY - 420; ctx.save();
    rr(ctx, x - 140, top, 280, 420, 18); ctx.fillStyle = "#F2F0EA"; ctx.fill(); ol(ctx, 6); rr(ctx, x - 140, top, 280, 70, 18); ctx.fillStyle = "#DCD8CF"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(x + 80, top + 35, 14, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 3); rr(ctx, x - 110, top + 22, 110, 26, 6); ctx.fillStyle = "#8FD3C7"; ctx.fill();
    const cy = top + 240; ctx.beginPath(); ctx.arc(x, cy, 110, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.arc(x, cy, 88, 0, TAU); ctx.fillStyle = "#BFE2EA"; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x, cy, 88, 0, TAU); ctx.clip(); ctx.translate(x, cy); ctx.rotate(t * spin);
    [[col, 0], ["#F6C343", 2.1], ["#E07A9B", 4.2]].forEach(([c2, a]) => { ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 40, Math.sin(a) * 40, 46, 26, a, 0, TAU); ctx.fill(); });
    ctx.fillStyle = hexA("#FFFFFF", .5); for (let i = 0; i < 6; i++){ ctx.beginPath(); ctx.arc(Math.cos(i) * 60, Math.sin(i * 2) * 50, 10, 0, TAU); ctx.fill(); } ctx.restore();
    ctx.strokeStyle = hexA("#FFFFFF", .7); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, cy, 70, -2.4, -1.6); ctx.stroke(); ctx.restore(); }
  function shopBack(ctx, t, o){ o = o || {};
    ctx.fillStyle = "#CFE7E2"; ctx.fillRect(-800, -400, 2700, GY + 400); ctx.strokeStyle = hexA("#FFFFFF", .6); ctx.lineWidth = 4;
    for (let y = 820; y < GY; y += 80){ ctx.beginPath(); ctx.moveTo(-800, y); ctx.lineTo(1900, y); ctx.stroke(); } for (let x = -800; x < 1900; x += 80){ ctx.beginPath(); ctx.moveTo(x, 820); ctx.lineTo(x, GY); ctx.stroke(); }
    ctx.fillStyle = "#E9DCC6"; ctx.fillRect(-800, GY, 2700, 600);
    // sign
    rr(ctx, 260, 250, 560, 140, 24); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, "LAUNDRY WANGI", 540, 342, 62, "#FFFFFF", 900, 520);
    for (let i = 0; i < 5; i++){ const q = (t * .4 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .7 * Math.sin(q * Math.PI); ctx.beginPath(); ctx.arc(280 + i * 120 + Math.sin(q * 6 + i) * 20, 250 - q * 120, 14 + i % 2 * 6, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#8FD3C7"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
    // shelf with folded clothes
    const sx = o.shelfX ?? 900; ctx.fillStyle = "#C47A48"; [520, 700].forEach(yy => { rr(ctx, sx - 200, yy, 400, 18, 6); ctx.fill(); ol(ctx, 4); });
    [[520], [700]].forEach(([yy], r) => { for (let i = 0; i < 4; i++){ const cx = sx - 150 + i * 100; for (let k = 0; k < 3; k++){ rr(ctx, cx - 40, yy - 26 - k * 26, 80, 24, 6); ctx.fillStyle = ["#5B7DB1", "#E8A55B", "#7FA563", "#E07A9B", "#FFFFFF"][(i + k + r) % 5]; ctx.fill(); ctx.strokeStyle = hexA(OUT, .6); ctx.lineWidth = 3; ctx.stroke(); } } });
    (o.washers || [130, 420]).forEach((x, n) => washer(ctx, x, t, 4 + n * 1.5, ["#5B7DB1", "#E8A55B"][n % 2]));
  }
  function shopCounter(ctx, x, t){ const top = GY - 330, w = 600; ctx.save();
    rr(ctx, x - w / 2 - 20, top, w + 40, 40, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5); rr(ctx, x - w / 2, top + 40, w, GY - top - 40, 6); ctx.fillStyle = "#F3D9B5"; ctx.fill(); ol(ctx, 5);
    ctx.fillStyle = hexA(TEAL, .8); ctx.fillRect(x - w / 2, top + 100, w, 26);
    rr(ctx, x + 150, top - 70, 110, 70, 8); ctx.fillStyle = "#3B3A3F"; ctx.fill(); ol(ctx, 4); rr(ctx, x + 162, top - 60, 86, 30, 4); ctx.fillStyle = "#8FD3C7"; ctx.fill();
    ctx.beginPath(); ctx.arc(x - 200, top - 18, 26, Math.PI, 0); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
    ctx.restore(); }
  function tallyBoard(ctx, x, y, n, t, lastK){ ctx.save(); ctx.translate(x, y); ctx.rotate(-.03); rr(ctx, -170, -100, 340, 220, 14); ctx.fillStyle = "#2E3B33"; ctx.fill(); ol(ctx, 7, "#8E4E2E");
    textC(ctx, "\"PUAS KOK\"", 0, -46, 40, "#FFFFFF", 900, 300); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; ctx.lineCap = "round";
    for (let i = 0; i < n; i++){ const g = Math.floor(i / 5), m = i % 5, bx = -130 + g * 110; ctx.beginPath(); if (m < 4){ ctx.moveTo(bx + m * 20, 0); ctx.lineTo(bx + m * 20, 80); } else { ctx.moveTo(bx - 10, 70); ctx.lineTo(bx + 72, 10); } ctx.stroke(); }
    ctx.restore(); }
  TT.scene(PX + "laundry", "Cerita: toko laundry (mesin cuci berputar, rak, konter, papan hitung \"puas kok\")", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Sh = Object.assign({ counterX: 700, tallyX: 290, tallyY: 560, base: 6 }, f.shop || {});
    const tl = (Sh.tally || []).map((cu, n) => T(s, cu, .4 + n * .1, idx)), nT = Sh.base + tl.filter(x => t >= x).length * (Sh.step || 3);
    base(ctx, s, t, { env: "office", envOpt: {}, envFront: false,
      spots: { tally: [Sh.tallyX, Sh.tallyY + 100, 1.3], counter: [Sh.counterX, GY - 600, 1.1] },
      back: () => { shopBack(ctx, t, { washers: [130, 420], shelfX: 900 }); tallyBoard(ctx, Sh.tallyX, Sh.tallyY, nT, t); },
      front: () => shopCounter(ctx, Sh.counterX, t) });
  }, sfxWith((s, f, i, add) => ((f.shop || {}).tally || []).forEach((cu, n) => add(cueT(s, cu, .4 + n * .1, i), "pop"))));

  /* ================= _resleting: zipped mouth opens ================= */
  TT.scene(PX + "resleting", "Cerita: mulut beresleting terbuka oleh pertanyaan yang tepat, masukan mengalir ke catatan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Z = Object.assign({ on: 0, to: 1, counterX: 760 }, f.zip || {});
    const tO = T(s, Z.openCue, .3, idx), notes = (Z.notes || []).map((n2, n) => Object.assign({ T: T(s, n2.cue, .3, idx) }, n2));
    const op = eOut(ramp(t, tO, tO + .7));
    base(ctx, s, t, { env: "office", envOpt: {}, envFront: false,
      spots: { mouth: () => [380, 1000, 1.4] },
      back: () => { shopBack(ctx, t, { washers: [-120, 160], shelfX: 960 }); },
      front: () => shopCounter(ctx, Z.counterX, t),
      over1: (ctx2, c, sts, j, R) => { if (j !== Z.on || !R[j]) return; const r = R[j], st = sts[j], k = r.k, mx = st.x + 2.6 * k * (st.face || 1), my = r.mouthY + .5 * k;
        if (op >= 1 && t > tO + 1.2) return; ctx2.save(); ctx2.globalAlpha = 1 - clamp((t - tO - .9) / .3, 0, 1);
        const w = 22 * k, x0 = mx - w / 2, gap = op * 6 * k;
        ctx2.fillStyle = "#9AA6B2"; for (let i = 0; i < 11; i++){ const xx = x0 + i * w / 10, open = (i / 10) < op; const dy = open ? gap * (1 - Math.abs(i / 10 - op * .5) * .6) : 0;
          ctx2.fillRect(xx - 1.2 * k, my - 2.2 * k - dy, 2.4 * k, 2.2 * k); ctx2.fillRect(xx - .2 * k, my + dy, 2.4 * k, 2.2 * k); }
        ctx2.strokeStyle = OUT; ctx2.lineWidth = .9 * k; ctx2.beginPath(); ctx2.moveTo(x0 - k, my); ctx2.lineTo(x0 + w + k, my); ctx2.stroke();
        const px = x0 + w * op; ctx2.save(); ctx2.translate(px, my); ctx2.rotate(Math.sin(t * 6) * .2); rr(ctx2, -2 * k, 0, 4 * k, 8 * k, 1.4 * k); ctx2.fillStyle = GOLD; ctx2.fill(); ctx2.lineWidth = .8 * k; ctx2.stroke(); ctx2.restore();
        ctx2.restore(); },
      over: (ctx2, c, sts, R) => { const a = R[Z.on], b = R[Z.to]; if (!a || !b) return;
        if (t < tO && Math.sin(t * 3) > 0){ const p = a.screen.head; popWord(ctx, "MMM...", clamp(p[0] - 160, 200, 880), Math.max(300, p[1] - 260), (t * .7) % 1, { size: 56, rot: -6, hold: .9, col: "#9AA6B2" }); }
        notes.forEach((nn, n) => { const k = t - nn.T; if (k < 0) return; const p0 = a.screen.head, hb = sts[Z.to], hp = c.toScreen(...handOf(hb)), u = eOut(clamp(k / .9, 0, 1));
          const x = lerp(p0[0] + 40, hp[0], u), y = lerp(p0[1] + 30, hp[1] - 60, u) - Math.sin(u * Math.PI) * 300;
          if (k < 1.0){ ctx.save(); ctx.translate(x, y); ctx.rotate((1 - u) * (n % 2 ? .3 : -.3)); const q = eBack(clamp(k / .3, 0, 1)) * (1 - .45 * u); ctx.scale(q, q); chip(ctx, nn.text, 0, 0, PAPER, BROWN, 46); ctx.restore(); }
          else { const p = c.toScreen(hb.x + 300 * (n ? 1 : 1), 0); void p; const yy = 330 + n * 110; ctx.save(); ctx.globalAlpha = 1; popChip(ctx, "✓ " + nn.text, 540, yy, k - 1, n % 2 ? GOLD : "#BFE2EA", BROWN, 54, -.03); ctx.restore(); } }); } });
  }, sfxWith((s, f, i, add) => { const Z = f.zip || {}; if (Z.openCue) add(cueT(s, Z.openCue, .3, i), "whoosh"); (Z.notes || []).forEach(n => add(cueT(s, n.cue, .3, i), "pop")); }));

  /* ================= _seberang: the street with two laundries ================= */
  function shopFront(ctx, x, w, name, col, t, o){ o = o || {}; const top = GY - 760; ctx.save();
    rr(ctx, x - w / 2, top, w, 760, 8); ctx.fillStyle = o.wall || "#F3E2C8"; ctx.fill(); ol(ctx, 6);
    rr(ctx, x - w / 2 + 20, top + 30, w - 40, 110, 16); ctx.fillStyle = col; ctx.fill(); ol(ctx, 5); textC(ctx, name, x, top + 106, 52, "#FFFFFF", 900, w - 80);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 20, top + 170); ctx.lineTo(x + w / 2 + 20, top + 170); ctx.lineTo(x + w / 2, top + 250); ctx.lineTo(x - w / 2, top + 250); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill(); ctx.save(); ctx.clip(); for (let i = 0; i < 10; i++){ ctx.fillStyle = i % 2 ? col : CREAM; ctx.fillRect(x - w / 2 - 20 + i * (w + 40) / 10, top + 170, (w + 40) / 20, 90); } ctx.restore(); ctx.beginPath(); ctx.moveTo(x - w / 2 - 20, top + 170); ctx.lineTo(x + w / 2 + 20, top + 170); ctx.lineTo(x + w / 2, top + 250); ctx.lineTo(x - w / 2, top + 250); ctx.closePath(); ol(ctx, 5);
    rr(ctx, x - w / 2 + 30, top + 290, w * .5, 300, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 5);
    if (o.washer){ ctx.beginPath(); ctx.arc(x - w / 2 + 30 + w * .25, top + 450, 70, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 4); ctx.save(); ctx.translate(x - w / 2 + 30 + w * .25, top + 450); ctx.rotate(t * 4); ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.ellipse(20, 0, 30, 18, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    rr(ctx, x + w / 2 - w * .38, top + 330, w * .3, 430, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 5);
    if (o.promo){ ctx.save(); ctx.translate(x - w / 2 + 40, top + 280); ctx.rotate(-.12 + Math.sin(t * 3) * .05); rr(ctx, -10, -40, 200, 70, 12); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); textC(ctx, o.promo, 90, 8, 34, "#FFFFFF", 900, 180); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "seberang", "Cerita: jalan, laundry Lina vs laundry seberang, pelanggan lewat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, St = Object.assign({ leftX: 160, rightX: 1180 }, f.street || {});
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      spots: { right: [St.rightX - 120, 1050, 1.0] },
      back: () => { shopFront(ctx, St.leftX, 440, "LAUNDRY WANGI", TEAL, t, { washer: true }); shopFront(ctx, St.rightX, 520, "LAUNDRY BARU", "#5B7DB1", t, { washer: true, promo: St.promo || "BUKA!", wall: "#E9EEF4" }); } });
  }, sfxBase);
})();
