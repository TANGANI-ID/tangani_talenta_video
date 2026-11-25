/* Scene pack j2611221424514: MODE CERITA story scenes ("motion": {"mode": "cerita"}) for MS41, SB42, SP42, RN42, KD42.
   Layout prefix j2611221424514_. Every scene takes the base fields of the generic "cerita" layout
   (env, envOpt, toons[], cam[], camOpt, props[], cards[], stamp, front) plus shared extras handled by base():
     shots   [{at|cue, env, envOpt, toons, cam, props, cards, items, piece:false}]  hard cut (cream flash) inside one scene
     hold    [{on, kind, at|cue, outCue, pocketCue, s, dx, dy, rot, n, nCues, text, torn}]  object in a toon's hand
             kinds: helmet, glove, notebook, laptop, file, card, milk, scanner, whistle, flag, paddle, tapi, box, bolt
     apd     [{on, keys:[{at|cue, helmet: hip|head|hand, goggles: up|eyes, gloves: pocket|hands, mask, muffs, boots, from:[x,y]}]}]
             personal protective gear worn by a toon; items fly from `from` (world) and snap on with a ring
     items   [{kind, x, y, s, rot, at|cue, outCue, front, text, mark:{cue, ok, text}}]  world objects that pop in
     tags    [{on, part: hip|forehead|pocket|head|hand|feet, text, at|cue, outCue, dx, dy, col}]  chip + leader line to a body part
     bonk    {cue, on, text, from:[x,y], dur}   ball flies to a toon's head, bounces off with TOK!
     freeze  {cue, on, text, sub}               world freezes, colour drains, red ring on a toon (flashback "should have asked")
     ticks   [{at|cue, text, mark: x|v, markCue}]  checklist chips on screen (y 300..)
     badges  [{on, at|cue, outCue, text, col}]    pops [{at|cue, text, x, y, size, rot, col}]   stamps [{at|cue, text, x, y, col}]
     confetti {at|cue}
   Set pieces (layout suffix):
     _adegan   generic story shot with the extras above
     _proyek   building site: concrete frame, scaffolding (perancah) with planks, crane, cones, APD sign; a bolt can slip off a plank
               and fall (f.bolt {cue, x, y0, y1, dur})
     _bahaya   infographic hazards around a worker: falling brick, grinder sparks, dust cloud, jackhammer noise; each hazard
               bounces off once the matching APD is worn (f.haz [{kind: fall|spark|dust|noise, cue, gearCue}])
     _lapangan athletics field: running track, stands, high-jump bar on uprights (rises per cue, labelled), foam mat,
               long-jump sand pit + sign that lights up, distance flags, sand burst (f.fld {hj:{x, bars:[{at|cue,h,label}]}, pit:{x, signCue, landCue}})
     _bunga    flower shop inside: tiered stands of flower buckets, cashier counter + register, big wall board PENJUALAN HARI INI
               (rolling number); optional second row EMBER BELUM GANTI AIR counting down while wilted bouquets are tossed into a bin
               (f.shop {sales:{from,to,cues}, row2:{cue, from, stepCues, lines}, toss:[cues], mold: wilted fraction})
     _layu     dim back room: wilted flowers and murky buckets pile up into a fly-buzzing blob monster behind the cheering boss
               (f.mold {x, growCues, sizes, eyesCue, burpCue})
     _depan    flower shop front at dusk: awning, sign TOKO BUNGA, glass door, buckets in the windows (f.shopfront {x, doorCue})
     _gantung  infographic: big tags drop on strings from the top and swing (f.hang {y, tagS, tags:[{cue, text, icon, x, markCue}]})
     _pingpong feedback as table tennis: balls served with labels, TAPI! returns, a golden ball slips past (f.pp {balls:[{cue, text, ret}], gold:{cue, text}})
     _tangkap  listening: feedback balls float from the speaker into the listener's notebook, TAPI words pushed back (f.catch {balls:[{cue,text}], tapi:[cues]})
     _salin    office desk: a big data file is copied and floats toward a public AI chat window (f.ai {copyCue, flyCue})
     _isi      inside the file: rows slide out as red-edged cards stamped RAHASIA (f.rows [{cue, icon, text, sub, y, row}])
     _batas    street: company fence, dashed line BATAS PERUSAHAAN, public AI kiosk across the road; a data card crosses and blows away (f.line {crossCue, windCue})
     _samar    office desk: a giant rubber stamp SAMARKAN / HAPUS slams data cards (name -> Pelanggan 1, number blacked out),
               the password card tears in two; the AI window answers with a summary (f.cap {x0, dx, y, items:[{cue, inTxt, outTxt, kind: samar|hapus|tolak}], sumCue, sumText}) */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, layer, outlineWords, G, TAU } = TT;
  const easeIO = TT.easeIO;
  const PX = "j2611221424514_";
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GREEN = "#3E9B5A", RED = "#D9483B", PAPER = "#FFFDF6", GOLD = "#F6C343", NAVY = "#13223D", TEAL = "#2F6F73", YEL = "#F2C230", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const eIn = x => x * x * x;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const tOf = (s, o, fr, i) => o == null ? 1e9 : (o.at != null ? +o.at : (o.cue ? cueT(s, o.cue, fr ?? .3, i) : 1e9));
  const T = (s, cue, fr, i) => cue ? cueT(s, cue, fr ?? .5, i) : 1e9;
  const ol = (ctx, w, col) => { ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const ramp = (t, a, b) => b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);
  const pop = (k, d) => k < 0 ? 0 : eBack(clamp(k / (d || .35), 0, 1));
  const TP = { idle: [[11, -29], [-11, -29]], talk: [[24, -36], [-11, -29]], wave: [[25, -70], [-11, -29]], point: [[33, -56], [-11, -30]], pointUp: [[25, -71], [-11, -30]],
    shrug: [[24, -57], [-24, -57]], facepalm: [[7, -71], [-16, -37]], clap: [[12, -47], [10, -48]], scratch: [[21, -76], [-16, -37]], cheer: [[23, -72], [-23, -72]],
    hips: [[17, -37], [-17, -37]], think: [[9, -62], [-6, -43]], phone: [[17, -43], [13, -42]], hold: [[21, -47], [18, -47]], scared: [[20, -60], [12, -61]],
    shock: [[24, -64], [-24, -64]], sad: [[8, -29], [-7, -29]], sit: [[14, -26], [-4, -26]] };
  const AUTO = { confused: "scratch", proud: "hips", scared: "scared", sad: "sad", shock: "shock" };
  const poseOf = st => { let p = st.pose || "idle"; if (p === "idle" && AUTO[st.expr]) p = AUTO[st.expr]; if (st.talk && p === "idle") p = "talk"; return p; };
  /* body anchors in world coordinates (r = anchors returned by toon()) */
  function body(st, r){
    const k = st.size / 92, f = st.face || 1, lift = r ? r.headY - (st.y - 72 * k) : 0, p = poseOf(st), H = TP[p] || TP.idle, sit = p === "sit" ? 13 * k : 0;
    const at = (x, y) => [st.x + x * k * f, st.y + y * k + lift];
    return { k, f, head: [st.x, r ? r.headY : st.y - 72 * k], hip: at(-9, -27 + (sit ? 13 : 0)), pocket: at(-7, -24 + (sit ? 13 : 0)), handF: at(H[0][0] + 2, H[0][1]), handB: at(H[1][0] - 1, H[1][1]),
      feet: [at(5.5, 0), at(-5.5, 0)], chest: at(2, -45 + (sit ? 13 : 0)), moving: st.moving, sit: p === "sit" };
  }
  function fit(ctx, txt, maxW, size, weight, min){ size = size || 40; for (;;){ font(ctx, weight || 800, size, FAM); if (ctx.measureText(txt).width <= maxW || size <= (min || 14)) return size; size -= 2; } }
  function textC(ctx, txt, x, y, size, col, weight, maxW){ if (maxW) fit(ctx, txt, maxW, size, weight); else font(ctx, weight || 800, size, FAM); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; }
  function sparkle(ctx, x, y, r, col){ ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = k * Math.PI / 4, r2 = k % 2 ? r * .28 : r; ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
  function burstFx(ctx, x, y, k, col, n, R0){ if (k < 0 || k > .9) return; n = n || 12; R0 = R0 || 200; const q = eOut(k / .9);
    ctx.save(); ctx.globalAlpha *= 1 - k / .9; for (let i = 0; i < n; i++){ const a = i / n * TAU + rnd(i) * .3, r1 = R0 * (.35 + q * .8), r0 = r1 - 40 - 30 * (1 - q);
      ctx.strokeStyle = i % 2 ? col : CREAM; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    for (let i = 0; i < n; i++){ const a = i / n * TAU + .2, r = R0 * (.5 + q * 1.1); sparkle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r - 30 * q, 16 * (1 - q * .6), i % 3 ? HL : GOLD); }
    ctx.restore(); }
  function ring(ctx, x, y, k, col, R){ if (k < 0 || k > .6) return; ctx.save(); ctx.globalAlpha *= 1 - k / .6; ctx.strokeStyle = col || "#FFFFFF"; ctx.lineWidth = 10 * (1 - k / .6) + 2; ctx.beginPath(); ctx.arc(x, y, (R || 60) * (.4 + k * 2.2), 0, TAU); ctx.stroke(); ctx.restore(); }
  function glowAt(ctx, x, y, r, col, a){ if (r <= 0 || a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function stampBox(ctx, txt, x, y, k, col, size, rot){ if (k < 0) return; const q = clamp(k / .3, 0, 1), sc = 2.2 - 1.2 * eOut(q); size = size || 64;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot ?? -.12); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(q * 2, 0, 1); fit(ctx, txt, 760, size, 900, 30); const sz = parseInt(ctx.font.match(/(\d+)px/)[1], 10);
    const w = ctx.measureText(txt).width + sz * .9, h = sz * 1.45;
    rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fillStyle = hexA(CREAM, .95); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.stroke(); rr(ctx, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 10); ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "center"; ctx.fillText(txt, 0, sz * .36); ctx.textAlign = "left"; ctx.restore(); }
  function popWord(ctx, txt, x, y, k, o){ o = o || {}; const hold = o.hold || 1.1; if (k < 0 || k > hold) return; const a = 1 - clamp((k - hold + .25) / .25, 0, 1), s = eBack(clamp(k / .25, 0, 1));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - k * 30); ctx.rotate((o.rot ?? -6) * Math.PI / 180); ctx.scale(s, s);
    const size = o.size || 110; outlineWords(ctx, String(txt).toUpperCase().split(" ").map(w => ({ w, hl: o.hl !== false })), 0, 0, size, { sw: size * .24, hl: o.col || HL }); ctx.restore(); }
  function chip(ctx, txt, x, y, bg, fg, size, maxW){ size = size || 34; if (maxW) size = fit(ctx, txt, maxW, size, 800); font(ctx, 800, size, FAM); const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
    rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ol(ctx, 5); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + size * .36); ctx.textAlign = "left"; return w; }
  function popChip(ctx, txt, x, y, k, bg, fg, size, rot){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)); font(ctx, 800, size || 34, FAM); const hw = (ctx.measureText(txt).width + (size || 34) * 1.1) / 2;
    x = clamp(x, 90 + hw, 990 - hw); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(q, q); chip(ctx, txt, 0, 0, bg, fg, size); ctx.restore(); }
  function confetti(ctx, k){ if (k < 0 || k > 3.2) return; ctx.save(); const cols = [ORANGE, GOLD, "#FFFFFF", GREEN, "#E8A55B", RED];
    for (let i = 0; i < 70; i++){ const x0 = rnd(i) * 1080, vy = 300 + rnd(i + 9) * 380, y = -40 + k * vy - (1 - Math.min(1, k * 2)) * 60 * rnd(i + 3), x = x0 + Math.sin(k * 3 + i) * 40;
      if (y > 1960) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(k * (3 + rnd(i + 5) * 4) + i); ctx.globalAlpha *= clamp((3.2 - k) / .6, 0, 1);
      ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } ctx.restore(); }
  function puffC(ctx, x, y, r, col){ ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.moveTo(x + Math.cos(a) * r * .6 + r * .55, y + Math.sin(a) * r * .45); ctx.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .45, r * .55, 0, TAU); } ctx.fillStyle = col; ctx.fill(); }
  function check(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || GREEN; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(16, -13); ctx.stroke(); ctx.restore(); }
  function cross(ctx, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col || RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-13, -13); ctx.lineTo(13, 13); ctx.moveTo(13, -13); ctx.lineTo(-13, 13); ctx.stroke(); ctx.restore(); }
  function markBadge(ctx, x, y, k, ok, s){ if (k < 0) return; const q = eBack(clamp(k / .35, 0, 1)) * (s || 1); ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = ok ? GREEN : RED; ctx.fill(); ol(ctx, 5);
    if (ok) check(ctx, 0, 0, 1.25, "#FFFFFF"); else cross(ctx, 0, 0, 1.1, "#FFFFFF"); ctx.restore(); }
  function icon2(ctx, name, x, y, s, col){ ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (name === "user"){ ctx.beginPath(); ctx.arc(0, -14, 14, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0, 26, 26, Math.PI, TAU); ctx.fill(); }
    else if (name === "money"){ rr(ctx, -30, -18, 60, 36, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.stroke(); }
    else if (name === "key"){ ctx.beginPath(); ctx.arc(-14, 0, 13, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-1, 0); ctx.lineTo(30, 0); ctx.moveTo(20, 0); ctx.lineTo(20, 12); ctx.moveTo(28, 0); ctx.lineTo(28, 10); ctx.stroke(); }
    else if (name === "star"){ ctx.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 13 : 30; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
    else if (name === "num"){ font(ctx, 900, 44, FAM); ctx.textAlign = "center"; ctx.fillText("123", 0, 16); ctx.textAlign = "left"; }
    else if (name === "cal"){ rr(ctx, -28, -24, 56, 50, 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-28, -8); ctx.lineTo(28, -8); ctx.stroke(); check(ctx, 0, 10, .8, col); }
    else if (name === "users"){ ctx.beginPath(); ctx.arc(-12, -12, 11, 0, TAU); ctx.arc(14, -12, 11, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-12, 24, 20, Math.PI, TAU); ctx.arc(14, 24, 20, Math.PI, TAU); ctx.fill(); }
    ctx.restore(); }

  /* ---------- APD (personal protective gear), drawn in body units around a local origin ---------- */
  const lwU = st => (5.5 + st.size * .0034) / (st.size / 92);
  function gHelmet(ctx, lw, col, hj){ const rx = hj ? 26.5 : 23.5, ry = hj ? 21 : 18.5;
    ctx.beginPath(); ctx.ellipse(0, -9, rx, ry, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = OUT; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -9 - ry); ctx.lineTo(0, -9); ctx.lineWidth = lw * 2.4; ctx.strokeStyle = mixHex(col, "#000000", .15); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(2.5, -9, rx + 4, 3.6, 0, 0, TAU); ctx.fillStyle = mixHex(col, "#000000", .18); ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = OUT; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-8, -9 - ry * .62, 6, 3, -.5, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .55); ctx.fill(); }
  function gStrap(ctx, lw, hj){ ctx.beginPath(); ctx.moveTo(-(hj ? 20 : 17), -8); ctx.quadraticCurveTo(-8, 22, 3, 21); ctx.quadraticCurveTo(14, 21, (hj ? 22 : 19), -8); ctx.strokeStyle = "#3A3348"; ctx.lineWidth = lw * 1.1; ctx.stroke(); }
  function gGoggles(ctx, lw, up){ const y = up ? -15 : -2, fx = 2.6;
    ctx.beginPath(); ctx.moveTo(-24, y); ctx.lineTo(27, y); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = lw * 2.2; ctx.stroke();
    [-1, 1].forEach(d => { rr(ctx, fx + d * 7.3 - 6.6, y - 5, 13.2, 10, 4); ctx.fillStyle = hexA("#BFE8F5", up ? .9 : .5); ctx.fill(); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = lw * 1.1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx + d * 7.3 - 3.5, y - 2.6); ctx.lineTo(fx + d * 7.3 - .5, y - 2.6); ctx.strokeStyle = hexA("#FFFFFF", .9); ctx.lineWidth = lw * .8; ctx.stroke(); }); }
  function gMask(ctx, lw){ const fx = 2.6; ctx.beginPath(); ctx.moveTo(-20, 1); ctx.lineTo(fx - 9, 6); ctx.moveTo(25, 1); ctx.lineTo(fx + 11, 6); ctx.strokeStyle = "#E8E2D6"; ctx.lineWidth = lw * .8; ctx.stroke();
    rr(ctx, fx - 11, 3.5, 22, 12.5, 5); ctx.fillStyle = "#F7F4EC"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke();
    ctx.strokeStyle = hexA("#9AA6B2", .9); ctx.lineWidth = lw * .55; [7.5, 10.5, 13].forEach(yy => { ctx.beginPath(); ctx.moveTo(fx - 8, yy); ctx.lineTo(fx + 8, yy); ctx.stroke(); }); }
  function gMuffs(ctx, lw, hj){ const ex = hj ? 26 : 22.5; ctx.beginPath(); ctx.moveTo(-ex, -2); ctx.quadraticCurveTo(-ex, -34, 1, -33); ctx.quadraticCurveTo(ex + 3, -34, ex + 3, -2); ctx.strokeStyle = "#2C2433"; ctx.lineWidth = lw * 2.6; ctx.stroke();
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d < 0 ? -ex : ex + 3, 1, 5.2, 8.5, 0, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); }); }
  function gGlove(ctx, lw, torn){ ctx.beginPath(); ctx.arc(0, 0, 5.4, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .9; ctx.stroke();
    rr(ctx, -4.6, 3, 9.2, 4.2, 1.5); ctx.fillStyle = "#B98A1E"; ctx.fill(); ctx.stroke(); if (torn){ ctx.beginPath(); ctx.moveTo(-2, -3); ctx.lineTo(1, -1); ctx.lineTo(-1, 1); ctx.lineTo(2, 3); ctx.strokeStyle = RED; ctx.lineWidth = lw * .7; ctx.stroke(); } }
  function gPocketGloves(ctx, lw){ [-2.5, 1, 4.5].forEach((dx, i) => { rr(ctx, dx - 1.6, -5 - i % 2 * 1.5, 3.2, 8, 1.6); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); }); }
  function gBoot(ctx, lw){ rr(ctx, -5, -8.5, 13.5, 8.5, 3); ctx.fillStyle = "#4A3426"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); rr(ctx, 3.6, -5.5, 5.5, 5.5, 2.4); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#1E1A18"; ctx.fillRect(-5, -1.6, 13.5, 1.6); }
  const APD_KINDS = ["helmet", "goggles", "gloves", "mask", "muffs", "boots"];
  function apdState(s, spec, t, idx){
    const K = (spec.keys || []).map((k, j) => Object.assign({ T: tOf(s, k, .15 + j * .1, idx) }, k)).sort((a, b) => a.T - b.T);
    const cur = {}; APD_KINDS.forEach(n => cur[n] = { v: null, prev: null, T: -9, from: null });
    K.forEach(k => { if (t < k.T) return; APD_KINDS.forEach(n => { if (k[n] !== undefined && k[n] !== cur[n].v){ cur[n] = { v: k[n], prev: cur[n].v, T: k.T, from: k.from || null }; } }); });
    return cur;
  }
  function drawApd(ctx, a, st, r, cur, t){
    if (!r) return; const B = body(st, r), k = B.k, f = B.f, lw = lwU(st), hj = a.hair === "hijab", hcol = a.helmetColor || "#F2B632";
    const at = (p, fn, rot, sc) => { ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(k * f * (sc || 1), k * (sc || 1)); if (rot) ctx.rotate(rot); ctx.lineJoin = "round"; ctx.lineCap = "round"; fn(); ctx.restore(); };
    const fly = (n, dest, fn, sc) => { const c = cur[n], q = clamp((t - c.T) / .45, 0, 1); if (q >= 1 || c.T < 0) return false;
      const src = c.from || [dest[0] + 40 * f, dest[1] - 420]; const e = easeIO(q), x = lerp(src[0], dest[0], e), y = lerp(src[1], dest[1], e) - Math.sin(q * Math.PI) * 140;
      at([x, y], fn, (1 - q) * 2.4, (sc || 1) * (1 + .25 * Math.sin(q * Math.PI))); return true; };
    const snap = (n, p) => { const c = cur[n], kk = t - c.T - .45; if (c.T >= 0 && kk >= 0 && kk < .6) ring(ctx, p[0], p[1], kk, "#FFFFFF", 26 * k); };
    // helmet
    const H = cur.helmet; if (H.v){ const sw = Math.sin(t * 3.2) * .18 + (B.moving ? Math.sin(t * 9) * .25 : 0);
      if (H.v === "head"){ const p = B.head; if (!fly("helmet", p, () => { gHelmet(ctx, lw, hcol, hj); })) { at(p, () => { gHelmet(ctx, lw, hcol, hj); if (a.strap !== false) gStrap(ctx, lw, hj); }); snap("helmet", [p[0], p[1] - 14 * k]); } }
      else if (H.v === "hip"){ const p = B.hip; at(p, () => { ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 6); ctx.strokeStyle = "#3A3348"; ctx.lineWidth = lw; ctx.stroke(); ctx.translate(-1, 15); ctx.rotate(.25 + sw); ctx.scale(.66, .66); gHelmet(ctx, lw / .66, hcol, false); }); }
      else if (H.v === "hand"){ const p = B.handF; if (!fly("helmet", p, () => gHelmet(ctx, lw, hcol, false), .8)) at(p, () => { ctx.translate(4, 4); ctx.rotate(.4); ctx.scale(.8, .8); gHelmet(ctx, lw / .8, hcol, false); }); } }
    const Gg = cur.goggles; if (Gg.v){ const p = B.head; if (!fly("goggles", p, () => gGoggles(ctx, lw, Gg.v === "up"))) { at(p, () => gGoggles(ctx, lw, Gg.v === "up")); if (Gg.v === "eyes") snap("goggles", [p[0], p[1]]); } }
    const M = cur.mask; if (M.v){ const p = B.head; if (!fly("mask", p, () => gMask(ctx, lw))) { at(p, () => gMask(ctx, lw)); snap("mask", [p[0], p[1] + 10 * k]); } }
    const U = cur.muffs; if (U.v){ const p = B.head; if (!fly("muffs", p, () => gMuffs(ctx, lw, hj))) { at(p, () => gMuffs(ctx, lw, hj)); snap("muffs", [p[0], p[1]]); } }
    const Gl = cur.gloves; if (Gl.v){ if (Gl.v === "pocket") at(B.pocket, () => gPocketGloves(ctx, lw));
      else { const torn = Gl.v === "torn"; [B.handF, B.handB].forEach((p, i) => { if (!fly("gloves", p, () => gGlove(ctx, lw, torn && i === 0))) at(p, () => gGlove(ctx, lw, torn && i === 0)); }); if (!torn) snap("gloves", B.handF); } }
    const Bo = cur.boots; if (Bo.v && !B.moving && !B.sit){ B.feet.forEach(p => { if (!fly("boots", p, () => gBoot(ctx, lw))) at(p, () => gBoot(ctx, lw)); }); snap("boots", B.feet[0]); }
  }

  /* ---------- small objects (world coordinates, origin = where they are held / stand) ---------- */
  function drawItem(ctx, kind, x, y, t, o){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.rot || 0); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (kind === "helmet"){ ctx.scale(4, 4); gHelmet(ctx, 1.4, o.col || "#F2B632", false); }
    else if (kind === "goggles"){ ctx.scale(4, 4); gGoggles(ctx, 1.4, false); if (o.cracked){ ctx.beginPath(); ctx.moveTo(-6, -6); ctx.lineTo(-3, -2); ctx.lineTo(-7, 1); ctx.lineTo(-4, 4); ctx.strokeStyle = RED; ctx.lineWidth = 1.2; ctx.stroke(); } }
    else if (kind === "glove"){ ctx.rotate(-.2); ctx.beginPath(); ctx.moveTo(-40, 60); ctx.lineTo(-44, -10); ctx.quadraticCurveTo(-46, -30, -30, -30); ctx.lineTo(-30, -70); ctx.quadraticCurveTo(-30, -84, -18, -84); ctx.quadraticCurveTo(-8, -84, -8, -70);
      ctx.lineTo(-6, -86); ctx.quadraticCurveTo(-4, -98, 8, -98); ctx.quadraticCurveTo(18, -98, 18, -86); ctx.lineTo(18, -76); ctx.quadraticCurveTo(22, -88, 32, -86); ctx.quadraticCurveTo(42, -84, 40, -70); ctx.lineTo(38, -30); ctx.quadraticCurveTo(54, -40, 58, -26); ctx.quadraticCurveTo(50, 0, 40, 10); ctx.lineTo(40, 60); ctx.closePath();
      ctx.fillStyle = YEL; ctx.fill(); ol(ctx, 5); rr(ctx, -46, 44, 92, 34, 8); ctx.fillStyle = "#B98A1E"; ctx.fill(); ol(ctx, 5);
      if (o.torn){ ctx.beginPath(); ctx.moveTo(-14, -40); ctx.lineTo(0, -20); ctx.lineTo(-12, -6); ctx.lineTo(4, 12); ctx.lineTo(-8, 26); ctx.lineTo(10, 26); ctx.lineTo(20, 8); ctx.lineTo(6, -8); ctx.lineTo(18, -24); ctx.lineTo(2, -44); ctx.closePath(); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 4, RED); } }
    else if (kind === "boot"){ ctx.scale(5, 5); gBoot(ctx, 1.2); }
    else if (kind === "mask"){ ctx.scale(4.5, 4.5); ctx.translate(-2.6, -9); gMask(ctx, 1.2); }
    else if (kind === "muffs"){ ctx.scale(3.4, 3.4); gMuffs(ctx, 1.4, false); }
    else if (kind === "bolt"){ ctx.rotate(o.spin || 0); ctx.fillStyle = "#8E98A6"; rr(ctx, -9, -40, 18, 70, 4); ctx.fill(); ol(ctx, 4); ctx.strokeStyle = "#5E6874"; ctx.lineWidth = 3; for (let i = 0; i < 5; i++){ ctx.beginPath(); ctx.moveTo(-9, -30 + i * 12); ctx.lineTo(9, -26 + i * 12); ctx.stroke(); }
      ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i / 6 * TAU; ctx.lineTo(Math.cos(a) * 22, -46 + Math.sin(a) * 12); } ctx.closePath(); ctx.fillStyle = "#A9B3BF"; ctx.fill(); ol(ctx, 4); }
    else if (kind === "notebook"){ ctx.rotate(-.1); rr(ctx, -70, -90, 140, 180, 10); ctx.fillStyle = o.col || "#5B7DB1"; ctx.fill(); ol(ctx, 5); rr(ctx, -56, -76, 112, 152, 6); ctx.fillStyle = PAPER; ctx.fill();
      for (let i = 0; i < (o.n || 0); i++){ ctx.fillStyle = i % 2 ? ORANGE : TEAL; rr(ctx, -44, -60 + i * 26, 64 + rnd(i) * 26, 10, 5); ctx.fill(); } }
    else if (kind === "laptop"){ ctx.fillStyle = "#544E42"; ctx.beginPath(); ctx.moveTo(-90, -130); ctx.lineTo(90, -130); ctx.lineTo(98, 0); ctx.lineTo(-98, 0); ctx.closePath(); ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = o.screen || "#BFE2EA"; ctx.fillRect(-78, -118, 156, 104); ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 3; k++) ctx.fillRect(-64, -104 + k * 26, 50 + ((k * 37 + Math.floor(t * 3)) % 60), 10);
      rr(ctx, -112, 0, 224, 16, 6); ctx.fillStyle = "#3B2418"; ctx.fill(); }
    else if (kind === "file"){ ctx.rotate(-.06); ctx.beginPath(); ctx.moveTo(-90, -120); ctx.lineTo(50, -120); ctx.lineTo(90, -80); ctx.lineTo(90, 120); ctx.lineTo(-90, 120); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6);
      ctx.beginPath(); ctx.moveTo(50, -120); ctx.lineTo(50, -80); ctx.lineTo(90, -80); ctx.fillStyle = "#DDE6EA"; ctx.fill(); ol(ctx, 5);
      rr(ctx, -70, -96, 110, 30, 6); ctx.fillStyle = GREEN; ctx.fill(); textC(ctx, "DATA", -15, -73, 22, "#FFFFFF", 900);
      for (let r2 = 0; r2 < 6; r2++) for (let c2 = 0; c2 < 3; c2++){ ctx.fillStyle = r2 === 5 && c2 === 2 ? hexA(RED, .8) : (r2 % 2 ? "#E3ECE6" : "#CFE0D6"); ctx.fillRect(-72 + c2 * 50, -50 + r2 * 26, 44, 20); }
      if (o.text) textC(ctx, o.text, 0, 108, 18, BROWN, 800, 170); }
    else if (kind === "card"){ const w = o.w || 300, h = o.h || 120; ctx.rotate(o.tilt || 0); rr(ctx, -w / 2, -h / 2, w, h, 14); ctx.fillStyle = o.bg || PAPER; ctx.fill(); ol(ctx, 5, o.edge || OUT);
      if (o.icon) icon2(ctx, o.icon, -w / 2 + 46, 0, .85, o.ink || BROWN); textC(ctx, o.text || "", o.icon ? 30 : 0, 12, o.size || 34, o.ink || BROWN, 900, w - (o.icon ? 110 : 30)); }
    else if (kind === "milk"){ ctx.rotate(.08); ctx.beginPath(); ctx.moveTo(-34, -60); ctx.lineTo(0, -90); ctx.lineTo(34, -60); ctx.lineTo(34, 50); ctx.lineTo(-34, 50); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#5B9BD5"; ctx.fillRect(-34, -20, 68, 34); textC(ctx, "SUSU", 0, 6, 20, "#FFFFFF", 900); rr(ctx, -26, 22, 52, 20, 4); ctx.fillStyle = hexA(RED, .9); ctx.fill(); textC(ctx, "EXP", 0, 38, 15, "#FFFFFF", 900);
      if (o.stink){ ctx.strokeStyle = hexA("#7FA563", .9); ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ const q = (t * .8 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); ctx.beginPath(); for (let yy = 0; yy < 60; yy += 6) ctx.lineTo(-30 + i * 30 + Math.sin(yy * .2 + t * 6) * 8, -100 - yy - q * 60); ctx.stroke(); ctx.restore(); } } }
    else if (kind === "bouquet"){ const wl = o.wilt ? 1 : 0; ctx.save(); ctx.translate(0, -70); bunch(ctx, 0, 0, t, wl, 3, FLC[0]); ctx.translate(18, 4); bunch(ctx, 0, 0, t, wl, 7, FLC[2]); ctx.restore();
      ctx.beginPath(); ctx.moveTo(-70, -80); ctx.lineTo(70, -80); ctx.lineTo(10, 70); ctx.lineTo(-10, 70); ctx.closePath(); ctx.fillStyle = "#F7EBDD"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.strokeStyle = "#E85A7A"; ctx.lineWidth = 8; ctx.stroke();
      if (o.flies) for (let i = 0; i < 3; i++){ const a = t * 5 + i * 2.1, fx = Math.cos(a) * 70, fy = -150 + Math.sin(a * 1.3) * 40; ctx.beginPath(); ctx.arc(fx, fy, 6, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill();
        ctx.fillStyle = hexA("#FFFFFF", .8); ctx.beginPath(); ctx.ellipse(fx - 5, fy - 7, 6, 3, -.5 + Math.sin(t * 60) * .4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(fx + 5, fy - 7, 6, 3, .5 - Math.sin(t * 60) * .4, 0, TAU); ctx.fill(); } }
    else if (kind === "carton"){ rr(ctx, -30, -70, 60, 70, 6); ctx.fillStyle = o.col || "#E8A55B"; ctx.fill(); ol(ctx, 4); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-22, -50, 44, 16);
      if (o.mold){ ctx.fillStyle = hexA("#6E9B3A", .9); [[-14, -20], [10, -60], [14, -14], [-18, -58]].forEach(([mx, my], i) => { ctx.beginPath(); ctx.arc(mx, my, 7 + i % 2 * 3, 0, TAU); ctx.fill(); }); } }
    else if (kind === "scanner"){ ctx.rotate(-.3); rr(ctx, -50, -30, 100, 50, 14); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ol(ctx, 5); rr(ctx, -10, 10, 34, 70, 10); ctx.fillStyle = "#2C3E66"; ctx.fill(); ol(ctx, 5);
      ctx.fillStyle = "#BFE8F5"; ctx.fillRect(-36, -20, 44, 20); if (o.beam){ ctx.save(); ctx.globalAlpha = .4 + .3 * Math.sin(t * 20); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(50, -10); ctx.lineTo(190, -40); ctx.lineTo(190, 20); ctx.closePath(); ctx.fill(); ctx.restore(); } }
    else if (kind === "whistle"){ rr(ctx, -30, -18, 50, 32, 12); ctx.fillStyle = "#D9D3C8"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(-14, -2, 9, 0, TAU); ctx.fillStyle = "#6B6F78"; ctx.fill();
      if (o.blow){ ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ const q = (t * 3 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(30, -2, 20 + q * 70, -.6, .6); ctx.stroke(); ctx.restore(); } } }
    else if (kind === "flag"){ ctx.fillStyle = "#6B4426"; ctx.fillRect(-5, -200, 10, 230); const w2 = Math.sin(t * 8) * 10; ctx.beginPath(); ctx.moveTo(5, -200); ctx.quadraticCurveTo(60, -210 + w2, 120, -196); ctx.lineTo(120, -120); ctx.quadraticCurveTo(60, -134 - w2, 5, -124); ctx.closePath();
      ctx.fillStyle = o.col || "#FFFFFF"; ctx.fill(); ol(ctx, 4); if (o.text) textC(ctx, o.text, 62, -150, 30, o.ink || RED, 900, 100); }
    else if (kind === "paddle"){ ctx.rotate(o.swing || 0); rr(ctx, -8, 0, 16, 60, 6); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.ellipse(0, -42, 40, 46, 0, 0, TAU); ctx.fillStyle = o.col || RED; ctx.fill(); ol(ctx, 5); }
    else if (kind === "tapi"){ const fq = o.fold ?? 1; ctx.scale(1, Math.max(.05, fq)); rr(ctx, -120, -60, 240, 120, 18); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 6); textC(ctx, "TAPI...", 0, 22, 62, "#FFFFFF", 900, 210); }
    else if (kind === "box"){ rr(ctx, -110, -110, 220, 110, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5);
      if (o.gear){ ctx.save(); ctx.translate(-50, -112); ctx.scale(2.4, 2.4); gHelmet(ctx, 1.6, "#F2B632", false); ctx.restore(); ctx.save(); ctx.translate(40, -124); ctx.scale(.55, .55); ctx.rotate(.4); drawItem(ctx, "glove", 0, 0, t, {}); ctx.restore(); }
      ctx.fillStyle = "#F7EBDD"; rr(ctx, -110, -70, 220, 70, 6); ctx.fill(); ol(ctx, 5); textC(ctx, o.text || "APD", 0, -22, 38, ORANGE, 900, 190); }
    else if (kind === "easel"){ ctx.strokeStyle = "#6B4426"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-40, -720); ctx.moveTo(150, 0); ctx.lineTo(40, -720); ctx.moveTo(0, -60); ctx.lineTo(0, -700); ctx.stroke();
      ctx.save(); ctx.translate(0, -470); ctx.rotate(Math.sin(t * 1.4) * .01); rr(ctx, -190, -260, 380, 470, 10); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 7);
      rr(ctx, -170, -240, 340, 230, 6); ctx.fillStyle = "#F6B26B"; ctx.fill(); ctx.beginPath(); ctx.arc(70, -150, 50, 0, TAU); ctx.fillStyle = "#FFE29A"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-170, -10); ctx.lineTo(-60, -120); ctx.lineTo(30, -40); ctx.lineTo(90, -90); ctx.lineTo(170, -10); ctx.closePath(); ctx.fillStyle = "#7FA563"; ctx.fill();
      textC(ctx, "PROMO", 0, 60, 66, ORANGE, 900); const sm = o.small ? 14 : 22; textC(ctx, "diskon akhir bulan", 0, 110, sm, BROWN, 700); textC(ctx, "kunjungi toko kami", 0, 150, sm, BROWN, 700);
      if (o.ring){ ctx.beginPath(); ctx.ellipse(0, 128, 150, 48, 0, 0, TAU); ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.setLineDash([16, 10]); ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore(); ctx.fillStyle = "#8E5A34"; rr(ctx, -210, -230, 420, 20, 6); ctx.fill(); ol(ctx, 4); }
    else if (kind === "door"){ rr(ctx, -150, -560, 300, 560, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 7); rr(ctx, -120, -520, 240, 220, 6); ctx.fillStyle = "#A9744A"; ctx.fill(); ol(ctx, 4);
      rr(ctx, -120, -270, 240, 230, 6); ctx.fillStyle = "#A9744A"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(110, -290, 14, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 4);
      if (o.text){ rr(ctx, -110, -630, 220, 54, 10); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 4); textC(ctx, o.text, 0, -593, 26, BROWN, 800, 200); } }
    else if (kind === "bench2"){ ctx.fillStyle = "#6B4426"; rr(ctx, -250, -120, 500, 26, 8); ctx.fill(); ol(ctx, 5); ctx.fillRect(-230, -96, 18, 96); ctx.fillRect(212, -96, 18, 96); }
    else if (kind === "cone"){ ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-10, -110); ctx.lineTo(10, -110); ctx.lineTo(34, 0); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-20, -66, 40, 18); rr(ctx, -50, -10, 100, 14, 4); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 4); }
    ctx.restore(); }

  /* ---------- shared base ---------- */
  function shotOf(s, t){ const f = s.f || {}, idx = G.scene; let F = f, T0 = -9;
    (f.shots || []).forEach((sh) => { const ts = tOf(s, sh, .2, idx); if (t >= ts && ts >= T0){ F = Object.assign({}, f, sh); T0 = ts; } }); return { F, T0 }; }
  function itemDraw(ctx, s, it, t, n, idx){ const T0 = it.cue || it.at != null ? tOf(s, it, .3 + n * .05, idx) : -1, O = it.outCue ? T(s, it.outCue, .6, idx) : 1e9; if (t < T0 || t > O + .35) return null;
    const q = T0 < 0 ? 1 : eBack(clamp((t - T0) / .4, 0, 1)), oq = 1 - clamp((t - O) / .35, 0, 1), wob = Math.sin(t * 2.4 + n) * (it.wob ?? .02);
    ctx.save(); ctx.globalAlpha *= oq; drawItem(ctx, it.kind, it.x ?? 540, (it.y ?? GY) - (1 - q) * 60, t, Object.assign({}, it, { s: (it.s || 1) * q, rot: (it.rot || 0) + wob })); ctx.restore(); return { x: it.x ?? 540, y: it.y ?? GY }; }
  function base(ctx, s, t, H){
    H = H || {};
    const { F: f, T0: shotT } = shotOf(s, t), toons = f.toons || [], idx = G.scene;
    const fz = f.freeze ? T(s, f.freeze.cue, .6, idx) : 1e9, tv = Math.min(t, fz);
    const sts = toons.map(a => toonState(a, s, tv));
    if (H.mod) H.mod(sts, f, tv);
    const spots = Object.assign({}, H.spots || {});
    const resolve = (on, tt, k) => {
      if (typeof on === "string" && spots[on]){ const p = typeof spots[on] === "function" ? spots[on]() : spots[on]; return [p[0] + (k.dx || 0), p[1] + (k.dy || 0), k.zoom ?? p[2] ?? null]; }
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), sitD = st.pose === "sit" ? 13 * st.size / 92 : 0, z = k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + sitD + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const E = f.env || H.env || "office", eo = Object.assign({}, H.envOpt || {}, f.envOpt || {});
    const piece = f.piece !== false;
    env(ctx, E, tv, c, eo);
    const R = { c, f, piece, shotT, tv, it: [] };
    if (piece && H.far) layer(ctx, c, H.farD || .5, () => H.far(ctx, c, sts, R));
    const propOn = p => { const T0 = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1), q = t - T0; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, tv); ctx.restore(); });
    const holds = (f.hold || []).map((h) => Object.assign({ T: h.cue || h.at != null ? tOf(s, h, .2, idx) : -1, O: h.outCue ? T(s, h.outCue, .5, idx) : (h.out ?? 1e9), P: h.pocketCue ? T(s, h.pocketCue, .4, idx) : 1e9 }, h));
    const apds = (f.apd || []).map(sp => ({ on: sp.on ?? 0, cur: apdState(s, sp, tv, idx) }));
    const drawItems = front => (f.items || []).forEach((it, n) => { if (!!it.front !== front) return; layer(ctx, c, 1, () => { R.it[n] = itemDraw(ctx, s, it, tv, n, idx);
      if (R.it[n] && it.mark){ const Tm = T(s, it.mark.cue, .5, idx); if (t >= Tm){ const mx = it.x ?? 540, my = (it.y ?? GY) - (it.mark.dy ?? 150); markBadge(ctx, mx, my, t - Tm, it.mark.ok !== false, 1.2); if (!it.mark.ok) ring(ctx, mx, my, t - Tm, RED, 50); } } }); });
    if (piece && H.back) layer(ctx, c, 1, () => H.back(ctx, c, sts, R));
    drawProps(false); drawItems(false);
    const items = toons.map((a, j) => ({ z: a.z || 0, j, draw: () => {
      const st = sts[j];
      if (piece && H.under) layer(ctx, c, 1, () => H.under(ctx, c, sts, j, R));
      R[j] = toon(ctx, c, a, s, tv, { st });
      const r = R[j];
      if (r) layer(ctx, c, 1, () => {
        apds.filter(p => p.on === j).forEach(p => drawApd(ctx, a, st, r, p.cur, tv));
        holds.filter(h => (h.on ?? 0) === j && tv >= h.T && tv < h.O).forEach(h => { const B = body(st, r); let p = B.handF, q = h.T < 0 ? 1 : eBack(clamp((tv - h.T) / .3, 0, 1));
          let sc = (h.s || 1) * q * st.size / 760, dx = (h.dx || 0) * (st.face || 1), dy = h.dy || 0;
          if (tv >= h.P){ const pq = easeIO(clamp((tv - h.P) / .5, 0, 1)); p = [lerp(p[0] + dx, B.pocket[0], pq), lerp(p[1] + dy, B.pocket[1], pq) - Math.sin(pq * Math.PI) * 60]; dx = 0; dy = 0; sc *= 1 - pq * .92; if (pq >= 1) return; }
          let n = h.n || 0; (h.nCues || []).forEach((cu, m) => { if (tv >= T(s, cu, .4 + m * .05, idx)) n++; });
          drawItem(ctx, h.kind, p[0] + dx, p[1] + dy, tv, Object.assign({}, h, { s: sc, flip: h.flip ? -(st.face || 1) : 1, rot: (h.rot || 0) * (st.face || 1), n,
            fold: h.foldCue ? 1 - clamp((tv - T(s, h.foldCue, .4, idx)) / .4, 0, .85) : 1, blow: h.blowCue ? tv >= T(s, h.blowCue, .3, idx) && tv < T(s, h.blowCue, .3, idx) + 1.4 : h.blow })); });
      });
      if (piece && H.over1) layer(ctx, c, 1, () => H.over1(ctx, c, sts, j, R)); } }));
    if (piece && H.mid) items.push({ z: H.midZ ?? .5, j: 99, draw: () => layer(ctx, c, 1, () => H.mid(ctx, c, sts, R)) });
    items.sort((p, q) => (p.z - q.z) || (p.j - q.j)).forEach(o => o.draw());
    drawItems(true);
    if (piece && H.front) layer(ctx, c, 1, () => H.front(ctx, c, sts, R));
    drawProps(true);
    if (f.front !== false && H.envFront !== false) envFront(ctx, E, tv, c, eo);
    // bonk: a ball flies to a toon's head, bounces off
    if (f.bonk){ const b = f.bonk, Tb = T(s, b.cue, .3, idx), d = b.dur || .7, j = b.on ?? 0, st = sts[j];
      if (st && t >= Tb){ const hp = toonHead(st), hit = [hp[0] + 14 * (st.face || 1), hp[1] - 40], src = b.from || [hit[0] + 700, hit[1] - 500], k = t - Tb;
        let x, y; if (k < d){ const q = k / d; x = lerp(src[0], hit[0], q); y = lerp(src[1], hit[1], q) - Math.sin(q * Math.PI) * 220; }
        else { const k2 = k - d, vx = -260 * Math.sign(src[0] - hit[0] || 1), g = 2200; x = hit[0] + vx * k2; y = hit[1] - 520 * k2 + .5 * g * k2 * k2; const fl = GY - 30; if (y > fl){ const over = (y - fl); y = fl - Math.min(over * .3, 80) * Math.abs(Math.sin(k2 * 6)) / (1 + k2 * 2); } }
        layer(ctx, c, 1, () => { ctx.save(); ctx.translate(x, y); ctx.rotate(k * 8); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = b.col || GOLD; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-10, -10, 9, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .7); ctx.fill(); ctx.restore(); });
        const sc = c.toScreen(x, y - 70); if (b.text) TT.CS.ov.push(() => popChip(ctx, b.text, sc[0], Math.max(250, sc[1]), k, GOLD, BROWN, 34, -.05));
        const hs = c.toScreen(hit[0], hit[1]); TT.CS.ov.push(() => { popWord(ctx, b.word || "TOK!", hs[0] + 130, hs[1] - 120, k - d, { size: 100, rot: 8, hold: .9 }); ring(ctx, hs[0], hs[1], k - d, GOLD, 50); }); } }
    if (piece && H.post) { ctx.save(); H.post(ctx, c, sts, R); ctx.restore(); }
    const ovs = [];
    if (piece && H.over) ovs.push(() => { ctx.save(); H.over(ctx, c, sts, R); ctx.restore(); });
    if (f.freeze && t >= fz){ const fr = f.freeze, k = t - fz, j = fr.on ?? 0, r = R[j];
      ovs.push(() => { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = clamp(k / .25, 0, 1) * .85; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
        ctx.save(); ctx.globalAlpha = clamp(k / .2, 0, 1) * .6; ctx.fillStyle = "#FFFFFF"; if (k < .2){ ctx.globalAlpha = 1 - k / .2; ctx.fillRect(0, 0, 1080, 1920); } ctx.restore();
        if (r && r.screen){ const hp = r.screen.head, R0 = clamp(r.screen.scale * 34, 120, 260) * (1 + .04 * Math.sin(k * 6)), q = clamp(k / .6, 0, 1);
          ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(hp[0], hp[1] + R0 * .55, R0 * .95, R0 * 1.25, -.1, -Math.PI / 2, -Math.PI / 2 + TAU * q * 1.04); ctx.stroke(); ctx.restore();
          if (fr.text) popChip(ctx, fr.text, hp[0], Math.max(300, hp[1] - R0 * 1.0 - 40), k - .5, RED, "#FFFFFF", 44, -.04); }
        if (fr.sub) popChip(ctx, fr.sub, 540, 1220, k - .9, PAPER, BROWN, 36, .02); }); }
    (f.badges || []).forEach((b, n) => { const T0 = tOf(s, b, .3 + n * .05, idx), O = b.outCue ? T(s, b.outCue, .6, idx) : 1e9; if (t < T0 || t > O) return; const r = R[b.on ?? 0]; if (!r || !r.screen) return;
      const p = r.screen.top; ovs.push(() => popChip(ctx, b.text, p[0] + (b.dx || 0), Math.max(230, p[1] - 70 + (b.dy || 0)), t - T0, b.col || ORANGE, "#FFFFFF", b.size || 34, (b.rot ?? -3) * Math.PI / 180)); });
    (f.tags || []).forEach((g, n) => { const T0 = tOf(s, g, .3 + n * .08, idx), O = g.outCue ? T(s, g.outCue, .6, idx) : 1e9; if (t < T0 || t > O + .3) return; const j = g.on ?? 0, r = R[j]; if (!r) return;
      const B = body(sts[j], r), wp = g.part === "forehead" ? [B.head[0], B.head[1] - 16 * B.k] : g.part === "head" ? [B.head[0], B.head[1] - 20 * B.k] : g.part === "pocket" ? B.pocket : g.part === "hand" ? B.handF : g.part === "feet" ? B.feet[0] : B.hip;
      const p = c.toScreen(wp[0], wp[1]), lx = clamp(p[0] + (g.dx ?? 260), 200, 880), ly = clamp(p[1] + (g.dy ?? -60), 250, 1250), oq = 1 - clamp((t - O) / .3, 0, 1);
      ovs.push(() => { const k = t - T0, q = clamp(k / .3, 0, 1); ctx.save(); ctx.globalAlpha *= oq; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], lx, q), lerp(p[1], ly, q)); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(p[0], p[1], 12 + 3 * Math.sin(t * 8), 0, TAU); ctx.fillStyle = g.col || ORANGE; ctx.fill(); ol(ctx, 4, "#FFFFFF"); popChip(ctx, g.text, lx, ly, k - .15, g.col || ORANGE, "#FFFFFF", g.size || 36, (g.rot ?? -3) * Math.PI / 180); ctx.restore(); }); });
    (f.ticks || []).forEach((g, n) => { const T0 = tOf(s, g, .3 + n * .1, idx); if (t < T0) return; const y = (f.ticksY || 330) + n * 104, M = g.markCue ? T(s, g.markCue, .7, idx) : T0 + .5;
      ovs.push(() => { const k = t - T0, q = eBack(clamp(k / .35, 0, 1)); ctx.save(); ctx.translate(540 + (1 - q) * -700, y); fit(ctx, g.text, 600, 44, 900); const w = Math.min(760, ctx.measureText(g.text).width + 190);
        rr(ctx, -w / 2, -42, w, 84, 42); ctx.fillStyle = hexA(PAPER, .96); ctx.fill(); ol(ctx, 5); ctx.fillStyle = BROWN; ctx.textAlign = "left"; ctx.fillText(g.text, -w / 2 + 40, 15); ctx.textAlign = "left";
        markBadge(ctx, w / 2 - 50, 0, t - M, g.mark === "v", .95); ctx.restore(); }); });
    (f.stamps || []).forEach((p, n) => { const T0 = tOf(s, p, .3 + n * .1, idx); if (t < T0) return; const x = p.x ?? 540, y = p.y ?? 600;
      ovs.push(() => { stampBox(ctx, p.text, x, y, t - T0, p.col || ORANGE, p.size || 60, (p.rot ?? -8) * Math.PI / 180); burstFx(ctx, x, y, t - T0 - .1, p.col || HL, 12, 200); }); });
    (f.pops || []).forEach((p, j) => ovs.push(() => popWord(ctx, p.text, p.x ?? 540, p.y ?? 520, t - tOf(s, p, .3 + j * .1, idx), { size: p.size || 96, rot: p.rot ?? -5, hold: p.hold || 1.3, col: p.col })));
    if (f.confetti){ const tc = tOf(s, f.confetti, .5, idx); ovs.push(() => confetti(ctx, t - tc)); }
    if (shotT > 0 && t - shotT < .35) ovs.push(() => { ctx.save(); ctx.globalAlpha = 1 - (t - shotT) / .35; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); });
    if (ovs.length) TT.CS.ov.push(() => ovs.forEach(fn => fn()));
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, R, f, tv };
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
      (f.items || []).forEach((it, m) => { if (it.cue) add(tOf(s, it, .3 + m * .05, i), "pop"); if (it.mark && it.mark.cue) add(T(s, it.mark.cue, .5, i), it.mark.ok ? "chime" : "ping"); });
      (f.hold || []).forEach(h => { if (h.cue) add(tOf(s, h, .2, i), "pop"); if (h.pocketCue) add(T(s, h.pocketCue, .4, i), "whoosh"); });
      (f.apd || []).forEach(sp => (sp.keys || []).forEach((k, j) => { if (j > 0 || k.cue) add(tOf(s, k, .15 + j * .1, i) + .45, "pop"); }));
      (f.tags || []).forEach((g, m) => add(tOf(s, g, .3 + m * .08, i), "pop"));
      (f.ticks || []).forEach((g, m) => { add(tOf(s, g, .3 + m * .1, i), "pop"); if (g.markCue) add(T(s, g.markCue, .7, i), g.mark === "v" ? "chime" : "ping"); });
      (f.badges || []).forEach((b, n2) => { if (b.cue) add(tOf(s, b, .3 + n2 * .05, i), "pop"); });
      (f.stamps || []).forEach((p, n2) => add(tOf(s, p, .3 + n2 * .1, i) + .05, "chime"));
    });
    (f0.pops || []).forEach((p, j) => add(tOf(s, p, .3 + j * .1, i), "pop"));
    if (f0.bonk){ add(T(s, f0.bonk.cue, .3, i), "whoosh"); add(T(s, f0.bonk.cue, .3, i) + (f0.bonk.dur || .7), "ping"); }
    if (f0.freeze) add(T(s, f0.freeze.cue, .6, i), "ping");
    if (f0.confetti) add(tOf(s, f0.confetti, .5, i), "chime");
    if (f0.stamp) add((f0.stamp.cue ? cueT(s, f0.stamp.cue, .05, i) : (f0.stamp.at ?? .15)) + .2, "chime");
  }
  const sfxWith = (fn) => (s, f, i, add) => { sfxBase(s, f, i, add); fn(s, f, i, add); };

  /* ================= _adegan ================= */
  TT.scene(PX + "adegan", "Cerita: adegan + efek (APD, benda di tangan, label bagian tubuh, bola TOK, bingkai beku, daftar cek)", (ctx, th, s, t) => { base(ctx, s, t, {}); }, sfxBase);

  /* ================= _proyek: building site with scaffolding ================= */
  function crane(ctx, t){ ctx.save(); ctx.translate(1350, 1500); ctx.strokeStyle = "#D9A23A"; ctx.lineWidth = 10;
    for (let y = 0; y > -1150; y -= 70){ ctx.strokeRect(-30, y - 70, 60, 70); ctx.beginPath(); ctx.moveTo(-30, y); ctx.lineTo(30, y - 70); ctx.stroke(); }
    const sw = Math.sin(t * .3) * .05; ctx.save(); ctx.translate(0, -1220); ctx.rotate(sw); ctx.fillStyle = "#D9A23A"; ctx.fillRect(-700, -16, 900, 32); ctx.strokeRect(-700, -16, 900, 32);
    ctx.fillStyle = "#5A5550"; ctx.fillRect(110, 16, 80, 70); ctx.strokeStyle = "#6B6F78"; ctx.lineWidth = 4; const hx = -420 + Math.sin(t * .5) * 60; ctx.beginPath(); ctx.moveTo(hx, 16); ctx.lineTo(hx, 300 + Math.sin(t * .7) * 30); ctx.stroke();
    ctx.fillStyle = "#8E98A6"; ctx.fillRect(hx - 60, 300 + Math.sin(t * .7) * 30, 120, 40); ctx.restore(); ctx.restore(); }
  function scaffold(ctx, x0, x1, levels, t){
    ctx.save(); const top = Math.min(...levels) - 120;
    ctx.fillStyle = "#B8B1A6"; ctx.fillRect(x0 - 120, top - 60, (x1 - x0) + 520, GY - top + 60); // concrete frame
    ctx.strokeStyle = "#8A8378"; ctx.lineWidth = 8; for (let x = x0 - 120; x < x1 + 400; x += 260){ ctx.fillStyle = "#A39C90"; ctx.fillRect(x, top - 60, 44, GY - top + 60); }
    levels.forEach(y => { ctx.fillStyle = "#9B9488"; ctx.fillRect(x0 - 120, y + 26, (x1 - x0) + 520, 34); });
    for (let i = 0; i < 18; i++){ const bx = x0 + 40 + (i % 6) * 70, by = levels[1] + 100 + Math.floor(i / 6) * 40; ctx.fillStyle = (i + Math.floor(i / 6)) % 2 ? "#B5643C" : "#A9573A"; ctx.fillRect(bx, by, 64, 34); }
    ctx.strokeStyle = "#5E6874"; ctx.lineWidth = 14; ctx.lineCap = "round";
    const xs = []; for (let x = x0; x <= x1 + 1; x += (x1 - x0) / 2) xs.push(x);
    xs.forEach(x => { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, GY); ctx.stroke(); });
    ctx.lineWidth = 9; [GY].concat(levels).forEach((y, j) => { if (j === 0) return; ctx.beginPath(); ctx.moveTo(x0 - 20, y - 160); ctx.lineTo(x1 + 20, y - 160); ctx.stroke(); });
    for (let j = 0; j < levels.length; j++){ const yA = j === 0 ? GY : levels[j - 1], yB = levels[j]; for (let i = 0; i < xs.length - 1; i++){ ctx.beginPath(); ctx.moveTo(xs[i], (i + j) % 2 ? yA : yB); ctx.lineTo(xs[i + 1], (i + j) % 2 ? yB : yA); ctx.stroke(); } }
    levels.forEach(y => { rr(ctx, x0 - 40, y, (x1 - x0) + 80, 26, 4); ctx.fillStyle = "#C9934F"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 3; for (let x = x0; x < x1 + 40; x += 120){ ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 22); ctx.stroke(); }
      ctx.fillStyle = hexA(ORANGE, .9); for (let x = x0 - 30; x < x1 + 40; x += 60){ ctx.fillRect(x, y - 170, 30, 10); } });
    ctx.restore(); }
  function apdSign(ctx, x, t){ ctx.save(); ctx.translate(x, GY); ctx.fillStyle = "#5E6874"; ctx.fillRect(-8, -420, 16, 420); rr(ctx, -150, -640, 300, 240, 14); ctx.fillStyle = "#2F7D4F"; ctx.fill(); ol(ctx, 6);
    rr(ctx, -132, -622, 264, 60, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); textC(ctx, "WAJIB APD", 0, -578, 34, "#2F7D4F", 900, 240);
    [-80, 0, 80].forEach((dx, i) => { ctx.beginPath(); ctx.arc(dx, -490, 34, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.save(); ctx.translate(dx, -482); ctx.scale(1.25, 1.25);
      if (i === 0) gHelmet(ctx, 1.6, "#2F7D4F", false); else if (i === 1) gGoggles(ctx, 1.6, false); else { ctx.translate(-2, 4); gBoot(ctx, 1.6); } ctx.restore(); }); ctx.restore(); }
  TT.scene(PX + "proyek", "Cerita: proyek bangunan (perancah, crane, baut jatuh)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, Bt = f.bolt;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" }, far: (ctx2) => crane(ctx2, t), farD: .55,
      spots: { top: [Bt ? Bt.x : 700, (Bt ? Bt.y0 : 900) + 80, 1.0], sign: [f.signX ?? 160, GY - 520, 1.05] },
      back: () => { scaffold(ctx, f.scX0 ?? 480, f.scX1 ?? 1000, f.levels || [1250, 860, 470], t); apdSign(ctx, f.signX ?? 160, t);
        ctx.fillStyle = "#C9A46A"; ctx.beginPath(); ctx.moveTo(820, GY); ctx.quadraticCurveTo(930, GY - 150, 1060, GY); ctx.closePath(); ctx.fill(); ol(ctx, 5); },
      front: () => { [[f.coneX ?? 980, 1], [(f.coneX ?? 980) - 120, .8]].forEach(([x, sc]) => drawItem(ctx, "cone", x, GY + 20, t, { s: sc }));
        if (Bt){ const Ts = T(s, Bt.cue, .3, idx), d = Bt.dur || 1.0, k = t - Ts; let y = Bt.y0, x = Bt.x, sp = 0;
          if (k < 0){ sp = Math.sin(t * 9) * .15; x += Math.sin(t * 7) * 3; }
          else if (k < d){ const q = k / d; y = lerp(Bt.y0, Bt.y1, q * q); sp = k * 14; ctx.save(); ctx.strokeStyle = hexA("#FFFFFF", .8); ctx.lineWidth = 6; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(x - 30 + i * 20, y - 80 - i * 14); ctx.lineTo(x - 30 + i * 20, y - 80 - i * 14 - 140 * q); ctx.stroke(); } ctx.restore(); }
          else { y = Bt.y1; const k2 = k - d; y -= Math.abs(Math.sin(k2 * 10)) * 50 * Math.exp(-k2 * 4); sp = 1.4; for (let i = 0; i < 6; i++){ const q2 = clamp(k2 / .8, 0, 1); ctx.save(); ctx.globalAlpha = .7 * (1 - q2); puffC(ctx, x + (i - 2.5) * 40 * (1 + q2), Bt.y1 - 10 - q2 * 40 * rnd(i), 30 + q2 * 30, "#E9DFCF"); ctx.restore(); } }
          drawItem(ctx, "bolt", x, y, t, { s: 1.3, spin: sp }); } } });
    if (Bt){ const Ts = T(s, Bt.cue, .3, idx) + (Bt.dur || 1); TT.CS.ov.push(() => popWord(ctx, Bt.word || "TANG!", Bt.wx ?? 760, Bt.wy ?? 560, t - Ts, { size: 130, rot: -8, hold: 1.2 })); }
  }, sfxWith((s, f, i, add) => { if (f.bolt){ add(T(s, f.bolt.cue, .3, i), "whoosh"); add(T(s, f.bolt.cue, .3, i) + (f.bolt.dur || 1), "ping"); } }));

  /* ================= _bahaya: hazards bounce off the gear ================= */
  function grinder(ctx, x, y, t, on){ ctx.save(); ctx.translate(x, y); ctx.rotate(-.35); rr(ctx, -110, -26, 160, 52, 20); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(60, 0, 46, 0, TAU); ctx.fillStyle = "#9AA6B2"; ctx.fill(); ol(ctx, 5);
    ctx.save(); ctx.translate(60, 0); ctx.rotate(t * 30); ctx.strokeStyle = "#5E6874"; ctx.lineWidth = 4; for (let i = 0; i < 4; i++){ ctx.rotate(Math.PI / 4); ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(36, 0); ctx.stroke(); } ctx.restore(); ctx.restore(); }
  function jackhammer(ctx, x, y, t){ const j = Math.sin(t * 50) * 4; ctx.save(); ctx.translate(x, y + j); rr(ctx, -30, -180, 60, 130, 12); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); rr(ctx, -70, -200, 140, 26, 10); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 4);
    ctx.fillStyle = "#9AA6B2"; ctx.fillRect(-8, -50, 16, 60); ol(ctx, 3); ctx.restore(); for (let i = 0; i < 5; i++){ const q = (t * 2 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .6 * (1 - q); puffC(ctx, x + (i - 2) * 30 * (1 + q), y + 6 - q * 40, 16 + q * 12, "#D9CDBA"); ctx.restore(); } }
  TT.scene(PX + "bahaya", "Cerita: bahaya kerja memantul dari APD (benda jatuh, percikan, debu, bising)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, HZ = (f.haz || []).map((h, n) => Object.assign({ T0: T(s, h.cue, .2 + n * .05, idx), G: h.gearCue ? T(s, h.gearCue, .5, idx) + .5 : 1e9 }, h));
    let hero = null;
    base(ctx, s, t, { env: "info", envOpt: { spotX: f.heroX ?? 640 },
      mod: (sts) => { hero = sts[f.hero ?? 0]; },
      front: () => { if (!hero) return; const hp = toonHead(hero), k = hero.size / 92, f1 = hero.face || 1;
        HZ.forEach(h => { const a = t - h.T0; if (a < 0) return; const out = t - h.G - 1.6; if (out > .5) return; const fade = 1 - clamp(out / .5, 0, 1), ap = eBack(clamp(a / .4, 0, 1)); ctx.save(); ctx.globalAlpha *= fade;
          if (h.kind === "fall"){ const x = hp[0] + 10, yTop = hp[1] - 520, hitY = hp[1] - 26 * k; let y = yTop + Math.sin(t * 6) * 10, rot = Math.sin(t * 5) * .2, b = t - h.G;
            if (b >= 0){ const fallD = .35; if (b < fallD) y = lerp(yTop, hitY, (b / fallD) ** 2); else { const k2 = b - fallD; y = hitY - 260 * k2 + 1400 * k2 * k2; rot = k2 * 9; ctx.translate((k2) * 300, 0); if (k2 < .6) ring(ctx, x - k2 * 300, hitY, k2, GOLD, 60); } }
            ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(ap, ap); rr(ctx, -60, -30, 120, 60, 6); ctx.fillStyle = "#B5643C"; ctx.fill(); ol(ctx, 5); ctx.strokeStyle = hexA("#000000", .2); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.stroke(); ctx.restore(); }
          else if (h.kind === "spark"){ const gx = h.x ?? 1010, gy = h.y ?? hp[1] + 60; grinder(ctx, gx, gy, t, true); const eye = [hp[0] + 10 * k * f1, hp[1] - 2 * k], prot = t >= h.G;
            for (let i = 0; i < 16; i++){ const q = (t * 1.6 + rnd(i)) % 1, sx = gx - 40, sy = gy - 20; let x = lerp(sx, eye[0] + 20, q), y = lerp(sy, eye[1], q) - Math.sin(q * Math.PI) * 40 + (rnd(i + 3) - .5) * 60 * q;
              if (prot && q > .8){ const q2 = (q - .8) / .2; x = eye[0] + 20 + q2 * 160; y = eye[1] - q2 * 120 * (rnd(i) - .3); }
              ctx.strokeStyle = i % 2 ? GOLD : "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 16, y - 6); ctx.stroke(); }
            if (prot) ring(ctx, eye[0], eye[1], (t - h.G) % .5, "#BFE8F5", 50); }
          else if (h.kind === "dust"){ const mouth = [hp[0] + 6 * k * f1, hp[1] + 10 * k], prot = t >= h.G, sx = h.x ?? 960, sy = h.y ?? hp[1] + 240;
            for (let i = 0; i < 9; i++){ const q = (t * .5 + i / 9) % 1; let x = lerp(sx, mouth[0] + 30, q), y = lerp(sy, mouth[1], q) + Math.sin(q * 6 + i) * 20;
              if (prot && q > .75){ const q2 = (q - .75) / .25; x = mouth[0] + 30 + q2 * 200; y = mouth[1] + (i % 2 ? -1 : 1) * q2 * 160; }
              ctx.save(); ctx.globalAlpha *= .75 * Math.sin(q * Math.PI) + .1; puffC(ctx, x, y, 34 + q * 20, "#CDBFA8"); ctx.restore(); }
            ctx.save(); ctx.globalAlpha *= ap; puffC(ctx, sx, sy, 90 + Math.sin(t * 3) * 8, "#CDBFA8"); ctx.restore(); }
          else if (h.kind === "noise"){ const ex = hp[0] - 22 * k * f1, ey = hp[1], jx = h.x ?? 150, jy = h.y ?? hp[1] + 380, prot = t >= h.G; jackhammer(ctx, jx, jy, t);
            for (let i = 0; i < 5; i++){ const q = (t * 1.2 + i / 5) % 1, d = Math.hypot(ex - jx, ey - (jy - 200)); let rad = 40 + q * d; if (prot) rad = Math.min(rad, d - 60);
              ctx.save(); ctx.globalAlpha *= (1 - q) * .9; ctx.strokeStyle = prot && rad >= d - 61 ? RED : "#FFFFFF"; ctx.lineWidth = 9; const ang = Math.atan2(ey - (jy - 200), ex - jx); ctx.beginPath(); ctx.arc(jx, jy - 200, rad, ang - .35, ang + .35); ctx.stroke(); ctx.restore(); }
            if (prot) ring(ctx, ex, ey, (t - h.G) % .6, RED, 40); }
          ctx.restore(); }); } });
  }, sfxWith((s, f, i, add) => (f.haz || []).forEach((h, n) => { add(T(s, h.cue, .2 + n * .05, i), "whoosh"); if (h.gearCue) add(T(s, h.gearCue, .5, i) + .55, "ping"); })));

  /* ================= _lapangan: athletics field ================= */
  function stands(ctx, t){ ctx.save(); ctx.fillStyle = "#8E98A6"; ctx.fillRect(-600, 1180, 2400, 300); for (let r = 0; r < 5; r++){ ctx.fillStyle = r % 2 ? "#3F6FB5" : "#5B7DB1"; ctx.fillRect(-600, 1200 + r * 56, 2400, 40); }
    for (let i = 0; i < 90; i++){ const x = -560 + i * 27, y = 1196 + (i % 5) * 56 + Math.abs(Math.sin(t * 4 + i)) * -6; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fillStyle = ["#E2A77C", "#C98B62", "#F0C29A"][i % 3]; ctx.fill();
      ctx.fillStyle = [ORANGE, "#FFFFFF", GREEN, RED, GOLD][i % 5]; ctx.fillRect(x - 11, y + 10, 22, 16); }
    ctx.fillStyle = "#5E6874"; ctx.fillRect(-600, 1470, 2400, 30); ctx.restore(); }
  function track(ctx){ ctx.save(); ctx.fillStyle = "#C2573A"; ctx.fillRect(-800, 1500, 2700, 160); ctx.strokeStyle = hexA("#FFFFFF", .85); ctx.lineWidth = 5; [1540, 1580, 1620].forEach(y => { ctx.beginPath(); ctx.moveTo(-800, y); ctx.lineTo(1900, y); ctx.stroke(); });
    ctx.fillStyle = "#7FB069"; ctx.fillRect(-800, 1660, 2700, 600); ctx.restore(); }
  TT.scene(PX + "lapangan", "Cerita: lapangan atletik (lompat tinggi, mistar naik, bak pasir lompat jauh)", (ctx, th, s, t) => {
    const f0 = s.f || {}, idx = G.scene;
    base(ctx, s, t, { env: "park", envOpt: { time: "day" }, envFront: false,
      spots: { pit: [((f0.fld || {}).pit || {}).x ?? 860, 1250, 1.0], bar: [((f0.fld || {}).hj || {}).x ?? 600, 1300, 1.0] },
      back: (c2, c3, sts, R) => { const F = R.f.fld || {}; stands(ctx, t); track(ctx);
        if (F.pit){ const P = F.pit, px = P.x ?? 860, lit = P.signCue ? t >= T(s, P.signCue, .3, idx) : !!P.lit, lk = P.signCue ? t - T(s, P.signCue, .3, idx) : 9;
          ctx.save(); ctx.fillStyle = "#F0D9A0"; ctx.beginPath(); ctx.ellipse(px + 120, GY + 10, 300, 46, 0, 0, TAU); ctx.fill(); ol(ctx, 5, "#B08A4A"); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(px - 210, GY - 6, 40, 20);
          for (let i = 0; i < 3; i++){ const fx = px + 20 + i * 110; ctx.fillStyle = "#5E6874"; ctx.fillRect(fx - 3, GY - 70, 6, 70); ctx.fillStyle = [GOLD, ORANGE, RED][i]; ctx.beginPath(); ctx.moveTo(fx + 3, GY - 70); ctx.lineTo(fx + 40, GY - 58); ctx.lineTo(fx + 3, GY - 46); ctx.fill(); textC(ctx, (5 + i) + "m", fx, GY + 34, 24, BROWN, 900); }
          const sx = px + 120, sy = P.signY ?? 1020, sc = lit ? 1 + .1 * Math.sin(clamp(lk / .4, 0, 1) * Math.PI) : 1; ctx.fillStyle = "#5E6874"; ctx.fillRect(sx - 8, sy + 70, 16, GY - sy - 70);
          ctx.save(); ctx.translate(sx, sy); ctx.scale(sc, sc); if (lit) glowAt(ctx, 0, 0, 340, "#FFE9A8", .55 + .1 * Math.sin(t * 8)); rr(ctx, -230, -80, 460, 160, 18); ctx.fillStyle = lit ? GOLD : "#8A8378"; ctx.fill(); ol(ctx, 7);
          textC(ctx, "LOMPAT JAUH", 0, 20, 62, lit ? BROWN : "#5E5850", 900, 420); ctx.restore(); ctx.restore(); }
        if (F.hj){ const J = F.hj, hx = J.x ?? 600; let h = 140, lab = null, tb = -9; (J.bars || []).forEach((b, n) => { const tt = tOf(s, b, .3 + n * .1, idx); if (t >= tt){ h = b.h; lab = b.label; tb = tt; } });
          const bump = t - tb < .5 ? Math.sin((t - tb) / .5 * Math.PI) * 18 : 0, by = GY - h - bump;
          ctx.fillStyle = "#3F6FB5"; rr(ctx, hx + 30, GY - 110, 360, 110, 16); ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#5B9BD5"; rr(ctx, hx + 30, GY - 110, 360, 30, 12); ctx.fill();
          [-1, 1].forEach(d => { ctx.fillStyle = "#E9E2D6"; ctx.fillRect(hx + d * 190 - 8, GY - 520, 16, 520); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(hx + d * 190 - 8, GY - 520, 16, 520); });
          ctx.save(); ctx.translate(hx, by); for (let i = -4; i < 4; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : RED; ctx.fillRect(i * 48, -8, 48, 16); } ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-192, -8, 384, 16);
          if (lab){ chip(ctx, lab, 0, -52, PAPER, BROWN, 32); } ctx.restore(); }
      },
      front: (c2, c3, sts, R) => { const F = R.f.fld || {}; if (F.pit && F.pit.landCue){ const P = F.pit, Tl = T(s, P.landCue, .5, idx) + (P.landDelay || 0), k = t - Tl, px = P.landX ?? (P.x ?? 860) + 150;
          if (k >= 0 && k < 1.4) for (let i = 0; i < 22; i++){ const a = Math.PI + rnd(i) * Math.PI, v = 300 + rnd(i + 4) * 500, x = px + Math.cos(a) * v * k, y = GY - 10 + Math.sin(a) * v * k * .8 + 900 * k * k;
            if (y > GY + 30) continue; ctx.beginPath(); ctx.arc(x, y, 8 + rnd(i) * 8, 0, TAU); ctx.fillStyle = "#E6C77E"; ctx.fill(); } } } });
  }, sfxWith((s, f, i, add) => { const F = f.fld || {}; (((F.hj || {}).bars) || []).forEach((b, n) => { if (b.cue) add(tOf(s, b, .3 + n * .1, i), "pop"); });
    if (F.pit && F.pit.signCue) add(T(s, F.pit.signCue, .3, i), "chime"); if (F.pit && F.pit.landCue) add(T(s, F.pit.landCue, .5, i) + (F.pit.landDelay || 0), "pop");
    (f.shots || []).forEach(sh => { const G2 = sh.fld || {}; if (G2.pit && G2.pit.signCue) add(T(s, G2.pit.signCue, .3, i), "chime"); }); }));

  /* ================= _toko: mini-market ================= */
  function bunch(ctx, x, y, t, wilt, seed, cols){ for (let i = 0; i < 5; i++){ const a = -.55 + i * .27 + Math.sin(t * 1.3 + seed + i) * .04 * (1 - wilt), L = 70 + rnd(seed * 3 + i) * 34;
      const ex = x + Math.sin(a) * L, ey = y - Math.cos(a) * L * (1 - wilt * .45), hx = ex + wilt * (a < 0 ? -1 : 1) * 34, hy = ey + wilt * 46;
      ctx.strokeStyle = wilt > .5 ? "#7A6A3A" : "#3E7D4F"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(ex, ey, hx, hy); ctx.stroke();
      const pc = wilt > .5 ? ["#8E6A4A", "#9B7B55", "#7A5A3A"][i % 3] : cols[i % cols.length];
      for (let p2 = 0; p2 < 5; p2++){ const pa = p2 / 5 * TAU + i; ctx.beginPath(); ctx.ellipse(hx + Math.cos(pa) * 10, hy + Math.sin(pa) * 10 * (1 - wilt * .4), 10, 6.5, pa, 0, TAU); ctx.fillStyle = pc; ctx.fill(); }
      ctx.beginPath(); ctx.arc(hx, hy, 6.5, 0, TAU); ctx.fillStyle = wilt > .5 ? "#5A4A2A" : GOLD; ctx.fill(); } }
  function bucket(ctx, x, y, murky){ ctx.beginPath(); ctx.moveTo(x - 36, y - 72); ctx.lineTo(x + 36, y - 72); ctx.lineTo(x + 27, y); ctx.lineTo(x - 27, y); ctx.closePath(); ctx.fillStyle = "#A9B3BF"; ctx.fill(); ol(ctx, 4);
    ctx.strokeStyle = hexA("#FFFFFF", .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 20, y - 60); ctx.lineTo(x - 16, y - 10); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y - 72, 36, 9, 0, 0, TAU); ctx.fillStyle = murky ? "#6E7A3A" : "#8FD3E8"; ctx.fill(); ol(ctx, 3); }
  const FLC = [["#E85A7A", "#F49AB0", "#FFFFFF"], ["#F6C343", "#F08C2E"], ["#C76BD9", "#9B7BD9"], ["#D9483B", "#FF8A80"]];
  function shelfUnit(ctx, x, w, top, t, wilt, seed){ const tiers = 3, th = (GY - top) / tiers; ctx.save();
    ctx.fillStyle = "#6B4426"; ctx.fillRect(x - 6, top, 14, GY - top); ctx.fillRect(x + w - 8, top, 14, GY - top);
    for (let r = 0; r < tiers; r++){ const y = top + (r + 1) * th; rr(ctx, x - 12, y - 20, w + 24, 22, 6); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 4);
      const n = Math.max(1, Math.floor((w - 20) / 92)); for (let i = 0; i < n; i++){ const bx = x + 56 + i * 92 + (r % 2) * 18, wl = wilt && rnd(i * 7 + r + seed) < wilt ? 1 : 0;
        bunch(ctx, bx, y - 20 - 66, t, wl, i + r * 5 + seed, FLC[(i + r + seed) % 4]); bucket(ctx, bx, y - 20, wl); } }
    ctx.restore(); }
  function rupiah(n){ return "Rp" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  let R2L = ["EMBER BELUM GANTI AIR", "target 0 · cek tiap pagi"];
  function salesBoard(ctx, x, y, t, val, k, row2){ const w = 860, h = row2 ? 400 : 250; ctx.save(); ctx.translate(x, y); glowAt(ctx, 0, h / 2 - 40, 620, "#FFE9A8", .35 + (k >= 0 && k < .5 ? .3 * (1 - k / .5) : 0));
    rr(ctx, -w / 2, -40, w, h, 20); ctx.fillStyle = "#1E1A18"; ctx.fill(); ol(ctx, 8); textC(ctx, "PENJUALAN HARI INI", 0, 22, 40, GOLD, 900, w - 80);
    const bump = k >= 0 && k < .3 ? 1 + .12 * Math.sin(k / .3 * Math.PI) : 1; ctx.save(); ctx.translate(0, 120); ctx.scale(bump, bump); textC(ctx, rupiah(Math.round(val / 1000) * 1000), 0, 30, 96, "#6CF08A", 900, w - 80); ctx.restore();
    if (row2){ ctx.fillStyle = "#3A3348"; ctx.fillRect(-w / 2 + 20, 190, w - 40, 6); const q = eBack(clamp(row2.k / .5, 0, 1)); ctx.save(); ctx.translate(0, 280); ctx.scale(1, q);
      textC(ctx, R2L[0], -110, -10, 36, "#FFB08A", 900, 520); textC(ctx, R2L[1], -110, 40, 28, "#D9D3C8", 700, 520);
      const v = row2.v, bk = row2.vk >= 0 && row2.vk < .3 ? 1 + .2 * Math.sin(row2.vk / .3 * Math.PI) : 1; ctx.save(); ctx.translate(300, 22); ctx.scale(bk, bk); textC(ctx, String(v), 0, 30, 110, v === 0 ? "#6CF08A" : "#FF7A5A", 900); ctx.restore(); ctx.restore(); }
    ctx.restore(); }
  TT.scene(PX + "bunga", "Cerita: toko bunga (rak ember bunga, kasir, papan penjualan, baris ember belum ganti air)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, S = Object.assign({ boardY: 420 }, f.shop || {}); if (S.row2 && S.row2.lines) R2L = S.row2.lines;
    const sales = S.sales || { from: 3150000, to: 3150000, cues: [] }, sc = (sales.cues || []).map((cu, n) => T(s, cu, .3 + n * .1, idx));
    let val = sales.from, lastK = -9; sc.forEach((tt, n) => { if (t >= tt){ const q = clamp((t - tt) / .5, 0, 1), step = (sales.to - sales.from) / sc.length; val = sales.from + step * (n + q); lastK = t - tt; } });
    if (!sc.length) val = sales.from + (sales.tick || 0) * t;
    let row2 = null; if (S.row2){ const R2 = S.row2, T2 = R2.cue ? T(s, R2.cue, .3, idx) : (R2.at ?? -1); if (t >= T2){ const dc = (R2.stepCues || []).map((cu, n) => T(s, cu, .3 + n * .1, idx)); let v = R2.from ?? 7, vk = -9; dc.forEach((tt, n) => { if (t >= tt){ v = Math.max(0, Math.round(lerp(R2.from ?? 7, 0, (n + 1) / dc.length))); vk = t - tt; } }); row2 = { k: t - T2, v, vk }; } }
    const toss = (S.toss || []).map((cu, n) => T(s, cu, .35 + n * .1, idx));
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plant: false, rug: false },
      spots: { board: [540, S.boardY + 120, 1.0], counter: [S.counterX ?? 840, 1180, 1.05] },
      back: () => { ctx.fillStyle = "#F4E7D3"; ctx.fillRect(-500, 120, 2100, GY - 120); ctx.fillStyle = "#E9D6BC"; for (let x = -500; x < 1600; x += 120) for (let y = 120; y < GY; y += 120) ctx.fillRect(x + 2, y + 2, 116, 116);
        ctx.fillStyle = "#D7C3A6"; ctx.fillRect(-500, GY - 40, 2100, 40); ctx.fillStyle = "#CDBB9F"; ctx.fillRect(-500, GY, 2100, 400);
        ctx.fillStyle = "#CFE3C9"; ctx.fillRect(-500, 120, 2100, 240); for (let i = 0; i < 22; i++){ ctx.save(); ctx.translate(-480 + i * 100, 360); ctx.rotate(Math.sin(t * 1.2 + i) * .1); ctx.beginPath(); ctx.ellipse(0, 30, 16, 40, 0, 0, TAU); ctx.fillStyle = "#3E7D4F"; ctx.fill(); ctx.restore(); }
        shelfUnit(ctx, S.shelfX ?? -40, 520, 820, t, S.mold || 0, 1); if (S.shelf2 !== false) shelfUnit(ctx, (S.shelfX ?? -40) - 560, 520, 820, t, 0, 3);
        salesBoard(ctx, S.boardX ?? 540, S.boardY, t, val, lastK, row2);
        const bx = S.binX ?? 520; if (S.toss){ rr(ctx, bx - 80, GY - 120, 160, 120, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ol(ctx, 5); textC(ctx, "LAYU", bx, GY - 50, 32, BROWN, 900); } },
      front: () => { const cx = S.counterX ?? 840; ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(cx, GY + 6, 300, 20, 0, 0, TAU); ctx.fill();
        rr(ctx, cx - 280, GY - 330, 560, 330, 12); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 6); rr(ctx, cx - 300, GY - 350, 600, 34, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5);
        ctx.save(); ctx.translate(cx + 150, GY - 350); rr(ctx, -80, -110, 160, 110, 10); ctx.fillStyle = "#3A3348"; ctx.fill(); ol(ctx, 5); rr(ctx, -60, -96, 120, 40, 6); ctx.fillStyle = "#6CF08A"; ctx.fill();
        if (lastK >= 0 && lastK < .5){ ctx.fillStyle = "#FFFFFF"; ctx.globalAlpha = 1 - lastK / .5; ctx.fillRect(-60, -96, 120, 40); ctx.globalAlpha = 1; } ctx.restore();
        textC(ctx, "KASIR", cx - 80, GY - 160, 46, "#FFFFFF", 900); ctx.save(); ctx.translate(cx - 200, GY - 352); ctx.scale(.9, .9); bunch(ctx, 0, 0, t, 0, 11, FLC[1]); ctx.restore();
        toss.forEach((tt, n) => { const k = t - tt; if (k < 0 || k > .9) return; const q = k / .8, sx = (S.shelfX ?? -40) + 160 + n * 90, sy = 1150 - (n % 2) * 170, ex = S.binX ?? 520, ey = GY - 120;
          drawItem(ctx, "bouquet", lerp(sx, ex, Math.min(1, q)), lerp(sy, ey, Math.min(1, q)) - Math.sin(Math.min(1, q) * Math.PI) * 220, t, { s: .9, rot: k * 7, wilt: true }); if (k > .8) ring(ctx, ex, ey, k - .8, GREEN, 40); }); } });
    if (lastK >= 0 && lastK < 1.1 && sales.pop !== false) TT.CS.ov.push(() => popWord(ctx, "+" + rupiah((sales.to - sales.from) / Math.max(1, sc.length)).replace("Rp", "Rp "), 760, 330, lastK, { size: 64, rot: 6, hold: 1.1, col: "#6CF08A" }));
  }, sfxWith((s, f, i, add) => { const S = f.shop || {}; ((S.sales || {}).cues || []).forEach((cu, n) => add(T(s, cu, .3 + n * .1, i), "chime")); if (S.row2 && S.row2.cue) add(T(s, S.row2.cue, .3, i), "whoosh");
    (S.toss || []).forEach((cu, n) => add(T(s, cu, .35 + n * .1, i) + .8, "pop")); ((S.row2 || {}).stepCues || []).forEach((cu, n) => add(T(s, cu, .3 + n * .1, i), "pop")); }));

  /* ================= _basi: back aisle mould monster ================= */
  function moldMonster(ctx, x, y, sc, t, eyes, burp){ ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc * (1 + .04 * Math.sin(t * 3)));
    ctx.beginPath(); for (let i = 0; i <= 24; i++){ const a = Math.PI + i / 24 * Math.PI, r = 230 + Math.sin(a * 5 + t * 2) * 18 + rnd(i) * 20; ctx.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r); } ctx.closePath();
    ctx.fillStyle = "#8A7A45"; ctx.fill(); ol(ctx, 7, "#4A3E20");
    for (let i = 0; i < 14; i++){ const a = Math.PI + rnd(i + 2) * Math.PI, r = 60 + rnd(i + 8) * 140; ctx.save(); ctx.translate(Math.cos(a) * r, Math.sin(a) * r * .9); ctx.rotate(rnd(i) * 2 - 1);
      if (i % 3 === 0) drawItem(ctx, "bouquet", 0, 40, t, { s: .8, wilt: true }); else if (i % 3 === 1) bucket(ctx, 0, 36, true); else { ctx.beginPath(); ctx.ellipse(0, 0, 20, 12, i, 0, TAU); ctx.fillStyle = "#7A5A3A"; ctx.fill(); } ctx.restore(); }
    for (let i = 0; i < 7; i++){ const a = t * (3 + i * .4) + i * 1.7, fx = Math.cos(a) * (150 + i * 12), fy = -250 + Math.sin(a * 1.4) * 60 - i * 8; ctx.beginPath(); ctx.arc(fx, fy, 7, 0, TAU); ctx.fillStyle = "#2C2433"; ctx.fill();
      ctx.fillStyle = hexA("#FFFFFF", .85); ctx.beginPath(); ctx.ellipse(fx - 5, fy - 8, 7, 3.5, -.5 + Math.sin(t * 60 + i) * .5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(fx + 5, fy - 8, 7, 3.5, .5 - Math.sin(t * 60 + i) * .5, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 6; i++){ const q = (t * .4 + i / 6) % 1; ctx.save(); ctx.globalAlpha = .6 * Math.sin(q * Math.PI); ctx.strokeStyle = "#A39A5A"; ctx.lineWidth = 6; ctx.beginPath(); for (let yy = 0; yy < 80; yy += 8) ctx.lineTo(-150 + i * 60 + Math.sin(yy * .15 + t * 5) * 10, -250 - yy - q * 80); ctx.stroke(); ctx.restore(); }
    if (eyes > 0){ const bl = (t % 2.7) < .12; [-1, 1].forEach(d => { ctx.save(); ctx.translate(d * 70, -150); ctx.scale(eyes, bl ? .1 : eyes); ctx.beginPath(); ctx.ellipse(0, 0, 34, 40, 0, 0, TAU); ctx.fillStyle = "#FFFDE0"; ctx.fill(); ol(ctx, 5);
      ctx.beginPath(); ctx.arc(-d * 6 - 10, 6, 14, 0, TAU); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); });
      ctx.beginPath(); if (burp > 0){ ctx.ellipse(0, -60, 60 * burp, 40 * burp, 0, 0, TAU); ctx.fillStyle = "#3D2A1A"; ctx.fill(); ol(ctx, 5); } else { ctx.moveTo(-60, -70); ctx.quadraticCurveTo(0, -30, 60, -70); ol(ctx, 6, "#3D4E22"); } }
    ctx.restore(); }
  TT.scene(PX + "layu", "Cerita: ruang belakang toko bunga, bunga layu & air keruh menjadi monster berlalat", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ x: 760, s0: .25 }, f.mold || {});
    const gs = (M.growCues || []).map((cu, n) => T(s, cu, .3 + n * .1, idx)); let sc = M.s0; gs.forEach((tt, n) => { const tgt = (M.sizes || [.5, .8, 1.05])[n] ?? 1; if (t >= tt) sc = lerp(sc, tgt, eBack(clamp((t - tt) / .6, 0, 1))); });
    sc += .012 * t; const eyes = M.eyesCue ? eBack(clamp((t - T(s, M.eyesCue, .4, idx)) / .4, 0, 1)) : 0, bk = M.burpCue ? t - T(s, M.burpCue, .5, idx) : -9, burp = bk >= 0 && bk < .9 ? Math.sin(bk / .9 * Math.PI) : 0;
    base(ctx, s, t, { env: "office", envOpt: { time: "night", desk: false, plant: false, rug: false },
      spots: { mon: () => [M.x, GY - 260 * sc, null] },
      back: () => { ctx.fillStyle = "#4A4238"; ctx.fillRect(-500, 100, 2200, GY - 100); ctx.fillStyle = "#3A342C"; ctx.fillRect(-500, GY, 2200, 400);
        glowAt(ctx, -120, 900, 700, "#FFE9A8", .35 + .05 * Math.sin(t * 5)); ctx.fillStyle = hexA("#FFE9A8", .18); ctx.beginPath(); ctx.moveTo(-500, 400); ctx.lineTo(300, 700); ctx.lineTo(300, 1600); ctx.lineTo(-500, 1700); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#2C2620"; ctx.fillRect(1000, 300, 30, 1340); shelfUnit(ctx, 520, 560, 760, t, .55, 5);
        ctx.save(); ctx.translate(1180, 260); ctx.rotate(Math.sin(t * 1.6) * .08); ctx.strokeStyle = "#2C2620"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -160); ctx.lineTo(0, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(40, 0); ctx.lineTo(24, 30); ctx.lineTo(-24, 30); ctx.closePath(); ctx.fillStyle = "#5E5850"; ctx.fill(); glowAt(ctx, 0, 60, 160, "#D9E8A0", .25); ctx.restore(); },
      mid: () => { moldMonster(ctx, M.x, GY, sc, t, eyes, burp); if (bk >= 0 && bk < 1.2){ for (let i = 0; i < 8; i++){ const q = bk / 1.2; ctx.save(); ctx.globalAlpha = .7 * (1 - q); puffC(ctx, M.x - 40 + (rnd(i) - .5) * 300 * q, GY - 300 * sc - q * 200 - i * 10, 30 + q * 40, "#A7C66A"); ctx.restore(); } } }, midZ: -1 });
    if (bk >= 0) TT.CS.ov.push(() => popWord(ctx, M.burpWord || "BLURP!", 700, 520, bk, { size: 110, rot: 7, hold: 1.2, col: "#C9B46A" }));
  }, sfxWith((s, f, i, add) => { const M = f.mold || {}; (M.growCues || []).forEach((cu, n) => add(T(s, cu, .3 + n * .1, i), "pop")); if (M.burpCue) add(T(s, M.burpCue, .5, i), "ping"); if (M.eyesCue) add(T(s, M.eyesCue, .4, i), "pop"); }));

  /* ================= _depan: shop front at dusk ================= */
  TT.scene(PX + "depan", "Cerita: depan toko bunga senja (kanopi, pintu kaca, ember bunga di etalase)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, D = Object.assign({ x: 380 }, f.shopfront || {}), dT = D.doorCue ? T(s, D.doorCue, .3, idx) : 1e9, dq = t >= dT ? Math.sin(clamp((t - dT) / 1.2, 0, 1) * Math.PI) : 0;
    base(ctx, s, t, { env: "street", envOpt: { time: "dusk" },
      back: () => { const x = D.x; ctx.save(); ctx.fillStyle = "#E9D6BC"; ctx.fillRect(x - 520, 520, 1040, GY - 520); ol(ctx, 6); ctx.fillStyle = "#D7C3A6"; ctx.fillRect(x - 520, 520, 1040, 40);
        rr(ctx, x - 360, 600, 720, 150, 16); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, "TOKO BUNGA", x, 700, 84, "#FFFFFF", 900, 660);
        for (let i = 0; i < 12; i++){ ctx.fillStyle = i % 2 ? "#FFFFFF" : ORANGE; ctx.beginPath(); ctx.moveTo(x - 540 + i * 90, 790); ctx.lineTo(x - 450 + i * 90, 790); ctx.lineTo(x - 450 + i * 90, 860); ctx.quadraticCurveTo(x - 495 + i * 90, 900, x - 540 + i * 90, 860); ctx.closePath(); ctx.fill(); ol(ctx, 4); }
        glowAt(ctx, x, 1250, 520, "#FFE2A8", .5); [[x - 470, 300], [x + 170, 300]].forEach(([wx, ww]) => { rr(ctx, wx, 940, ww, 520, 10); ctx.fillStyle = "#FFE9C4"; ctx.fill(); ol(ctx, 6);
          for (let r = 0; r < 2; r++) for (let i = 0; i < 3; i++){ const bx = wx + 60 + i * 90, by = 1180 + r * 250; bunch(ctx, bx, by - 72, t, 0, i + r * 3, FLC[(i + r) % 4]); bucket(ctx, bx, by, false); } });
        const dw = 200; ctx.fillStyle = "#2C2433"; ctx.fillRect(x - dw / 2 - 10, 930, dw + 20, GY - 930); ctx.save(); ctx.translate(x - dw / 2, 940); ctx.scale(1 - dq * .8, 1); ctx.fillStyle = hexA("#BFE2EA", .75); ctx.fillRect(0, 0, dw, GY - 940); ol(ctx, 5); ctx.restore();
        rr(ctx, x - 60, 1020, 120, 40, 8); ctx.fillStyle = "#FFFFFF"; ctx.fill(); textC(ctx, "BUKA", x, 1050, 26, GREEN, 900);
        [x - 500, x + 500].forEach(px => { rr(ctx, px - 50, GY - 110, 100, 110, 10); ctx.fillStyle = "#B5643C"; ctx.fill(); ol(ctx, 5); for (let i = 0; i < 5; i++){ ctx.save(); ctx.translate(px, GY - 110); ctx.rotate(-1 + i * .5 + Math.sin(t * 1.5 + i) * .05); ctx.beginPath(); ctx.ellipse(0, -60, 16, 60, 0, 0, TAU); ctx.fillStyle = "#3E7D4F"; ctx.fill(); ctx.restore(); } });
        ctx.restore(); } });
  }, sfxWith((s, f, i, add) => { if ((f.shopfront || {}).doorCue) add(T(s, f.shopfront.doorCue, .3, i), "whoosh"); }));

  /* ================= _gantung: hanging tags drop on strings ================= */
  TT.scene(PX + "gantung", "Cerita: label besar turun bergantung tali dari atas, berayun", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ y: 560 }, f.hang || {});
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      back: () => { (M.tags || []).forEach((g, n) => { const tt = T(s, g.cue, .3 + n * .1, idx), k = t - tt; if (k < 0) return; const gx = g.x ?? (200 + n * 300), drop = k < .5 ? eBack(k / .5) : 1,
          yy = lerp(-200, g.y ?? M.y, drop), sw = Math.sin(t * 2.2 + n) * .05 + (k < 1.2 ? Math.sin(k * 9) * .22 * (1 - k / 1.2) : 0), tsc = M.tagS || 1;
          ctx.save(); ctx.translate(gx, 0); ctx.rotate(sw); ctx.strokeStyle = "#E9E2D6"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, yy); ctx.stroke(); ctx.translate(0, yy); ctx.scale(tsc, tsc);
          ctx.beginPath(); ctx.moveTo(-130, 30); ctx.lineTo(-90, -10); ctx.lineTo(90, -10); ctx.lineTo(130, 30); ctx.lineTo(130, 250); ctx.lineTo(-130, 250); ctx.closePath(); ctx.fillStyle = g.bg || PAPER; ctx.fill(); ol(ctx, 6);
          ctx.beginPath(); ctx.arc(0, 18, 12, 0, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 4); icon2(ctx, g.icon || "star", 0, 110, 1.1, g.ink || ORANGE); textC(ctx, g.text, 0, 218, 34, BROWN, 900, 230);
          if (g.markCue && t >= T(s, g.markCue, .6, idx)) markBadge(ctx, 100, 40, t - T(s, g.markCue, .6, idx), true, .9); ctx.restore(); }); } });
  }, sfxWith((s, f, i, add) => { const M = f.hang || {}; (M.tags || []).forEach((g, n) => { add(T(s, g.cue, .3 + n * .1, i), "whoosh"); add(T(s, g.cue, .3 + n * .1, i) + .45, "pop"); if (g.markCue) add(T(s, g.markCue, .6, i), "chime"); }); }));

  /* ================= _pingpong: feedback rally ================= */
  TT.scene(PX + "pingpong", "Cerita: masukan jadi pingpong (bola dipukul balik TAPI!, bola emas lolos)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, P = Object.assign({ tableY: 1300 }, f.pp || {});
    const balls = (P.balls || []).map((b, n) => Object.assign({ T0: T(s, b.cue, .2 + n * .1, idx) }, b));
    const gold = P.gold ? Object.assign({ T0: T(s, P.gold.cue, .3, idx) }, P.gold) : null;
    let L = null, Rt = null, swingR = -9, swingL = -9;
    balls.forEach(b => { if (t >= b.T0) swingL = Math.max(swingL, b.T0); if (b.ret !== false && t >= b.T0 + .55) swingR = Math.max(swingR, b.T0 + .55); }); if (gold && t >= gold.T0) swingL = Math.max(swingL, gold.T0);
    const ovs = [];
    const B0 = base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      mod: (sts) => { L = sts[0]; Rt = sts[1]; },
      back: () => { ctx.fillStyle = hexA("#FFFFFF", .06); for (let i = 0; i < 6; i++) ctx.fillRect(-300 + i * 340, 200, 170, 1300); },
      front: () => { const ty = P.tableY; ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(540, GY + 6, 470, 26, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#3A3348"; [180, 880].forEach(x => ctx.fillRect(x, ty + 30, 22, GY - ty - 30));
        ctx.beginPath(); ctx.moveTo(110, ty); ctx.lineTo(970, ty); ctx.lineTo(990, ty + 40); ctx.lineTo(90, ty + 40); ctx.closePath(); ctx.fillStyle = "#1F7A55"; ctx.fill(); ol(ctx, 6); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(540, ty); ctx.lineTo(540, ty + 40); ctx.stroke();
        rr(ctx, 520, ty - 70, 40, 74, 4); ctx.fillStyle = hexA("#FFFFFF", .5); ctx.fill(); ol(ctx, 4);
        const hand = (st, back) => { const B = body(st, null); const hp = toonHead(st); void hp; return [B.handF[0] + (back ? 0 : 0), B.handF[1]]; };
        if (!L || !Rt) return; const hl = hand(L), hr = hand(Rt);
        // paddles
        [[L, hl, swingL, RED], [Rt, hr, swingR, "#3F6FB5"]].forEach(([st, h, sw, col]) => { const k = t - sw, a = k >= 0 && k < .3 ? Math.sin(k / .3 * Math.PI) * 1.1 : 0; drawItem(ctx, "paddle", h[0], h[1], t, { s: 1.4 * st.size / 760, col, swing: (st.face || 1) * (.5 + a) }); });
        const arc = (a, b, q, hgt) => [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * hgt];
        const pA = [hl[0] + 40, hl[1] - 60], pB = [hr[0] - 40, hr[1] - 60];
        balls.forEach((b, n) => { const k = t - b.T0; if (k < 0) return; let p = null;
          if (k < .55) p = arc(pA, pB, k / .55, 260); else if (b.ret !== false && k < 1.05) p = arc(pB, pA, (k - .55) / .5, 200 + n * 20);
          else if (b.ret !== false && k < 1.5){ const q = (k - 1.05) / .45; p = [pA[0] - q * 260, pA[1] + q * q * 600]; }
          else if (b.ret === false && k < 1.4){ const q = (k - .55) / .85; p = [pB[0] + q * 300, pB[1] + q * q * 500]; }
          if (!p) return; ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
          const sp = c => c; void sp; ovs.push({ p, text: b.text, k, col: PAPER });
          if (b.ret !== false && k >= .55 && k < 1.7) ovs.push({ tapi: true, p: [hr[0] - 190, hr[1] - 330], k: k - .55, word: b.word || "TAPI!" }); });
        if (gold){ const k = t - gold.T0; if (k >= 0 && k < 2.2){ let p; if (k < .7) p = arc(pA, [pB[0] + 120, pB[1] - 120], k / .7, 300); else { const q = (k - .7); p = [pB[0] + 120 + q * 420, pB[1] - 120 + q * q * 700]; }
            glowAt(ctx, p[0], p[1], 90, GOLD, .6); ctx.beginPath(); ctx.arc(p[0], p[1], 30, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ol(ctx, 5); sparkle(ctx, p[0] - 8, p[1] - 8, 10, "#FFFFFF"); ovs.push({ p, text: gold.text, k, col: GOLD, big: true }); } } } });
    TT.CS.ov.push(() => ovs.forEach(o => { const cm = B0.c; const sp = cm.toScreen(o.p[0], o.p[1]);
      if (o.tapi) popWord(ctx, o.word, clamp(sp[0], 260, 820), Math.max(330, sp[1]), o.k, { size: 120, rot: 8, hold: 1.1, col: RED });
      else popChip(ctx, o.text, sp[0], Math.max(280, sp[1] - 80), o.k, o.col, BROWN, o.big ? 50 : 42, -.04); }));
  }, sfxWith((s, f, i, add) => { const P = f.pp || {}; (P.balls || []).forEach((b, n) => { const t0 = T(s, b.cue, .2 + n * .1, i); add(t0, "pop"); if (b.ret !== false) add(t0 + .55, "pop"); }); if (P.gold) add(T(s, P.gold.cue, .3, i), "whoosh"); }));

  /* ================= _tangkap: listening, feedback lands in the notebook ================= */
  TT.scene(PX + "tangkap", "Cerita: mendengarkan, masukan melayang masuk ke buku catatan, kata TAPI ditahan", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, C = Object.assign({ from: 0, to: 1 }, f.catch || {});
    const balls = (C.balls || []).map((b, n) => Object.assign({ T0: T(s, b.cue, .2 + n * .1, idx) }, b)), tapi = (C.tapi || []).map((cu, n) => T(s, cu, .4 + n * .1, idx));
    let A = null, B2 = null; const ovs = [];
    const B0 = base(ctx, s, t, { env: "office", envOpt: Object.assign({ desk: false, plantX: 980 }, f.envOpt || {}),
      mod: (sts) => { A = sts[C.from]; B2 = sts[C.to]; },
      front: () => { if (!A || !B2) return; const ha = toonHead(A), Bb = body(B2, null), nb = [Bb.handF[0] + 10 * (B2.face || 1), Bb.handF[1] - 20];
        balls.forEach((b, n) => { const k = t - b.T0; if (k < 0 || k > 1.6) return; const q = clamp(k / 1.1, 0, 1), e = easeIO(q), x = lerp(ha[0] + 190 * (A.face || 1), nb[0], e), y = lerp(ha[1] - 90, nb[1], e) - Math.sin(q * Math.PI) * 180;
          if (q < 1){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(k * 6) * .2); const sc = 1 - .5 * e; ctx.scale(sc, sc); rr(ctx, -90, -40, 180, 80, 40); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 5); ctx.restore(); ovs.push({ p: [x, y], text: b.text, k }); }
          else ring(ctx, nb[0], nb[1], k - 1.1, GREEN, 50); });
        tapi.forEach((tt, n) => { const k = t - tt; if (k < 0 || k > 1.3) return; const hb = toonHead(B2), up = k < .5 ? eBack(k / .5) : 1 - easeIO(clamp((k - .7) / .5, 0, 1)), x = hb[0] + 80 * (B2.face || 1), y = hb[1] + 60 - up * 90;
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 30) * .08 * up); ctx.scale(up, up); rr(ctx, -80, -36, 160, 72, 14); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 5); textC(ctx, "TAPI", 0, 16, 44, "#FFFFFF", 900); ctx.restore();
          if (k > .6 && k < 1.1){ ctx.save(); ctx.globalAlpha = 1 - (k - .6) / .5; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.moveTo(x - 40 + i * 40, y - 70); ctx.lineTo(x - 40 + i * 40, y - 110); ctx.stroke(); } ctx.restore(); } }); } });
    TT.CS.ov.push(() => ovs.forEach(o => { const sp = B0.c.toScreen(o.p[0], o.p[1]); popChip(ctx, o.text, sp[0], Math.max(280, sp[1] - 80), o.k, PAPER, BROWN, 40, -.04); }));
  }, sfxWith((s, f, i, add) => { const C = f.catch || {}; (C.balls || []).forEach((b, n) => { add(T(s, b.cue, .2 + n * .1, i), "whoosh"); add(T(s, b.cue, .2 + n * .1, i) + 1.1, "pop"); }); (C.tapi || []).forEach((cu, n) => add(T(s, cu, .4 + n * .1, i), "pop")); }));

  /* ================= KD42: data pieces ================= */
  function aiWindow(ctx, x, y, w, h, t, o){ o = o || {}; ctx.save(); ctx.translate(x, y); glowAt(ctx, 0, 0, w * .9, "#9FD3FF", .25 + .05 * Math.sin(t * 3));
    rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = "#F4F8FC"; ctx.fill(); ol(ctx, 7); rr(ctx, -w / 2, -h / 2, w, 70, 26); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + 40, w, 30); ol(ctx, 0.01);
    textC(ctx, "AI PUBLIK", 0, -h / 2 + 48, 34, "#FFFFFF", 900, w - 160); [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.arc(-w / 2 + 34 + i * 30, -h / 2 + 36, 9, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); });
    // robot avatar
    ctx.save(); ctx.translate(-w / 2 + 90, -h / 2 + 150); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ol(ctx, 5); sparkle(ctx, -4, -2, 26 + 3 * Math.sin(t * 4), "#FFFFFF"); sparkle(ctx, 20, -20, 10, GOLD); ctx.restore();
    rr(ctx, -w / 2 + 160, -h / 2 + 110, w - 200, 80, 18); ctx.fillStyle = "#E3ECF6"; ctx.fill(); textC(ctx, o.greet || "Ada yang bisa dibantu?", 70, -h / 2 + 162, 26, BROWN, 700, w - 240);
    if (o.reply){ const q = eBack(clamp(o.reply.k / .4, 0, 1)); ctx.save(); ctx.translate(40, 20); ctx.scale(q, q); rr(ctx, -w / 2 + 70, -60, w - 140, 120, 18); ctx.fillStyle = "#E6F5EA"; ctx.fill(); ol(ctx, 4, GREEN); textC(ctx, o.reply.text, -20, 12, 30, BROWN, 900, w - 200); check(ctx, w / 2 - 120, 0, 1.4, GREEN); ctx.restore(); }
    rr(ctx, -w / 2 + 30, h / 2 - 100, w - 60, 70, 35); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); const cur = Math.floor(t * 2) % 2 ? "|" : ""; font(ctx, 600, 26, FAM); ctx.fillStyle = "#8A8378"; ctx.fillText((o.input || "Tempel di sini...") + cur, -w / 2 + 60, h / 2 - 56);
    ctx.restore(); }
  TT.scene(PX + "salin", "Cerita: file data disalin melayang ke jendela AI publik", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, A = Object.assign({ x: 760, y: 560, w: 520, h: 460 }, f.ai || {}), tc = A.copyCue ? T(s, A.copyCue, .3, idx) : 1e9, tf = A.flyCue ? T(s, A.flyCue, .3, idx) : 1e9;
    let hand = null;
    base(ctx, s, t, { env: "office", envOpt: Object.assign({ desk: false, plantX: 120 }, f.envOpt || {}),
      mod: (sts) => { hand = sts[0]; },
      back: () => { aiWindow(ctx, A.x, A.y, A.w, A.h, t, { input: t > tf + 1 ? "Ctrl+V ..." : null }); },
      front: () => { if (!hand) return; const B = body(hand, null), src = [B.handF[0] + 20, B.handF[1] - 80];
        if (t >= tc){ const k = t - tc; const dst = [A.x, A.y + A.h / 2 - 60]; const q = t >= tf ? easeIO(clamp((t - tf) / 1.6, 0, 1)) : 0, sh = Math.sin(t * 30) * (q >= 1 ? 6 : 0);
          const x = lerp(src[0] + 120, dst[0], q) + sh, y = lerp(src[1] - 120, dst[1] - 40, q) - Math.sin(q * Math.PI) * 160;
          ctx.save(); ctx.globalAlpha = clamp(k / .3, 0, 1) * .95; drawItem(ctx, "file", x, y, t, { s: (1.25 + .25 * eBack(clamp(k / .4, 0, 1))) * (1 - .45 * q), text: "300 keluhan" }); ctx.restore();
          if (k < .6) ring(ctx, src[0] + 120, src[1] - 120, k, GOLD, 60); } } });
  }, sfxWith((s, f, i, add) => { const A = f.ai || {}; if (A.copyCue) add(T(s, A.copyCue, .3, i), "pop"); if (A.flyCue) add(T(s, A.flyCue, .3, i), "whoosh"); }));

  TT.scene(PX + "isi", "Cerita: isi file terbuka, baris rahasia meluncur keluar dan dicap RAHASIA", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, rows = (f.rows || []).map((r, n) => Object.assign({ T0: T(s, r.cue, .3 + n * .1, idx) }, r)), anyOn = rows.some(r => t >= r.T0);
    base(ctx, s, t, { env: "info", envOpt: { spotX: 300 },
      back: () => { const fx = f.fileX ?? 640, fy = f.fileY ?? 1020; ctx.save(); ctx.translate(fx, fy); ctx.rotate(-.03); rr(ctx, -300, -420, 600, 840, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 8);
        rr(ctx, -300, -420, 600, 80, 18); ctx.fillStyle = GREEN; ctx.fill(); textC(ctx, "DATA KELUHAN", 0, -366, 38, "#FFFFFF", 900, 540);
        for (let r = 0; r < 12; r++) for (let c2 = 0; c2 < 4; c2++){ ctx.fillStyle = r % 2 ? "#EEF4F0" : "#DCE9E1"; ctx.fillRect(-276 + c2 * 140, -320 + r * 60, 130, 50); ctx.fillStyle = hexA(BROWN, .25); ctx.fillRect(-264 + c2 * 140, -300 + r * 60, 60 + rnd(r * 4 + c2) * 50, 10); }
        ctx.restore();
        void anyOn; },
      front: () => { rows.forEach((r, n) => { const k = t - r.T0; if (k < 0) return; const fx = f.fileX ?? 640, y0 = (f.fileY ?? 1020) - 260 + (r.row ?? n * 4) * 60, y1 = r.y ?? (680 + n * 230), x1 = r.x ?? 620, q = eBack(clamp(k / .5, 0, 1)), e = easeIO(clamp(k / .5, 0, 1));
          const x = lerp(fx, x1, e), y = lerp(y0, y1, e), sc = lerp(.5, 1, q); glowAt(ctx, x, y, 330, RED, .35 + .15 * Math.sin(t * 8 + n));
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3 + n) * .02 - .02); ctx.scale(sc, sc); rr(ctx, -300, -90, 600, 180, 22); ctx.fillStyle = PAPER; ctx.fill(); ol(ctx, 8, RED);
          ctx.beginPath(); ctx.arc(-220, 0, 56, 0, TAU); ctx.fillStyle = hexA(RED, .15); ctx.fill(); icon2(ctx, r.icon || "user", -220, 0, 1.2, RED);
          ctx.textAlign = "left"; fit(ctx, r.text, 400, 46, 900); ctx.fillStyle = BROWN; ctx.fillText(r.text, -140, -6); if (r.sub){ fit(ctx, r.sub, 400, 32, 700); ctx.fillStyle = "#8A5A44"; ctx.fillText(r.sub, -140, 46); }
          const sk = k - .45; if (sk >= 0){ const sq = clamp(sk / .25, 0, 1), ssc = 1.8 - .8 * eOut(sq); ctx.save(); ctx.translate(190, 52); ctx.rotate(-.18); ctx.scale(ssc, ssc); ctx.globalAlpha *= sq; rr(ctx, -104, -30, 208, 60, 10); ctx.fillStyle = hexA("#FFFFFF", .9); ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.stroke(); textC(ctx, "RAHASIA", 0, 15, 38, RED, 900); ctx.restore(); }
          ctx.restore(); }); } });
  }, sfxWith((s, f, i, add) => (f.rows || []).forEach((r, n) => add(T(s, r.cue, .3 + n * .1, i), "ping"))));

  TT.scene(PX + "batas", "Cerita: pagar kantor, garis batas perusahaan, kios AI publik, kartu data tertiup angin", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, L = Object.assign({ x: 560 }, f.line || {}), tcx = L.crossCue ? T(s, L.crossCue, .3, idx) : 1e9, tw = L.windCue ? T(s, L.windCue, .4, idx) : 1e9;
    base(ctx, s, t, { env: "street", envOpt: { time: "day" },
      back: () => { ctx.save(); ctx.fillStyle = "#D7C3A6"; ctx.fillRect(-700, 300, 1100, GY - 300); ol(ctx, 6); for (let r = 0; r < 6; r++) for (let i = 0; i < 4; i++){ rr(ctx, -640 + i * 250, 380 + r * 190, 170, 130, 8); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ol(ctx, 4); }
        rr(ctx, -560, 230, 760, 110, 14); ctx.fillStyle = TEAL; ctx.fill(); ol(ctx, 6); textC(ctx, "KANTOR KITA", -180, 305, 64, "#FFFFFF", 900, 700);
        ctx.strokeStyle = "#5E6874"; ctx.lineWidth = 10; for (let x = -700; x < L.x - 30; x += 60){ ctx.beginPath(); ctx.moveTo(x, GY); ctx.lineTo(x, GY - 220); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-700, GY - 200); ctx.lineTo(L.x - 40, GY - 200); ctx.moveTo(-700, GY - 60); ctx.lineTo(L.x - 40, GY - 60); ctx.stroke();
        const kx = L.kioskX ?? 1240; ctx.translate(kx, GY); rr(ctx, -200, -760, 400, 760, 26); ctx.fillStyle = "#3F6FB5"; ctx.fill(); ol(ctx, 7); rr(ctx, -160, -700, 320, 260, 20); ctx.fillStyle = "#9FD3FF"; ctx.fill(); ol(ctx, 5);
        rr(ctx, -110, -660, 220, 140, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.moveTo(-40, -522); ctx.lineTo(-70, -480); ctx.lineTo(0, -522); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 4);
        for (let i = 0; i < 3; i++){ ctx.beginPath(); ctx.arc(-50 + i * 50, -590 - Math.abs(Math.sin(t * 5 + i)) * 12, 14, 0, TAU); ctx.fillStyle = "#3F6FB5"; ctx.fill(); }
        textC(ctx, "AI PUBLIK", 0, -370, 50, "#FFFFFF", 900, 360); rr(ctx, -120, -300, 240, 120, 14); ctx.fillStyle = "#2C2433"; ctx.fill(); ol(ctx, 5); ctx.fillStyle = "#9FD3FF"; ctx.fillRect(-90, -260, 180, 16);
        ctx.restore();
        ctx.save(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.setLineDash([40, 26]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(L.x, GY - 30); ctx.lineTo(L.x, GY + 260); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.translate(L.x, GY); ctx.fillStyle = "#5E6874"; ctx.fillRect(-8, -760, 16, 760); ctx.rotate(Math.sin(t * 1.5) * .015); rr(ctx, -170, -900, 340, 150, 16); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ol(ctx, 6, RED);
        textC(ctx, "BATAS", 0, -840, 46, RED, 900, 300); textC(ctx, "PERUSAHAAN", 0, -785, 40, RED, 900, 300); ctx.restore(); },
      front: () => { if (t < tcx) return; const k = t - tcx, x0 = L.x - 160, y0 = GY - 520; let x = lerp(x0, L.x + 80, clamp(k / .6, 0, 1)), y = y0, rot = 0;
        if (t >= tw){ const k2 = t - tw; x += k2 * 600 + Math.sin(k2 * 5) * 60; y -= k2 * 520 - Math.sin(k2 * 7) * 40; rot = k2 * 3; for (let i = 0; i < 5; i++){ ctx.save(); ctx.globalAlpha = .6; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; const yy = y0 - 120 + i * 70 - k2 * 200; ctx.beginPath(); ctx.moveTo(L.x - 200 + (k2 * 900 + i * 80) % 900, yy); ctx.quadraticCurveTo(L.x + (k2 * 900 + i * 80) % 900, yy - 40, L.x + 160 + (k2 * 900 + i * 80) % 900, yy); ctx.stroke(); ctx.restore(); } }
        drawItem(ctx, "card", x, y, t, { s: L.cardS || 1.3, w: 300, h: 110, icon: "user", text: "Data pelanggan", size: 30, tilt: rot + Math.sin(t * 4) * .05, edge: RED }); } });
  }, sfxWith((s, f, i, add) => { const L = f.line || {}; if (L.crossCue) add(T(s, L.crossCue, .3, i), "pop"); if (L.windCue) add(T(s, L.windCue, .4, i), "whoosh"); }));

  function rubberStamp(ctx, x, y, col, label){ ctx.save(); ctx.translate(x, y); rr(ctx, -120, -50, 240, 50, 10); ctx.fillStyle = col; ctx.fill(); ol(ctx, 6); textC(ctx, label, 0, -14, 30, "#FFFFFF", 900, 220);
    rr(ctx, -100, -90, 200, 44, 10); ctx.fillStyle = "#8E5A34"; ctx.fill(); ol(ctx, 5); rr(ctx, -22, -200, 44, 116, 16); ctx.fillStyle = "#A9744A"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.arc(0, -224, 44, 0, TAU); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 5); ctx.beginPath(); ctx.arc(-12, -236, 12, 0, TAU); ctx.fillStyle = hexA("#FFFFFF", .45); ctx.fill(); ctx.restore(); }
  TT.scene(PX + "samar", "Cerita: cap SAMARKAN raksasa (nama jadi Pelanggan 1, nomor dicoret hitam, kartu password disobek)", (ctx, th, s, t) => {
    const f = s.f || {}, idx = G.scene, M = Object.assign({ x0: 430, dx: 230, y: 1030 }, f.cap || {}), its = (M.items || []).map((it, n) => Object.assign({ T0: T(s, it.cue, .3 + n * .1, idx) }, it)), ts = M.sumCue ? T(s, M.sumCue, .4, idx) : 1e9;
    base(ctx, s, t, { env: "office", envOpt: { desk: false, plantX: 90 },
      back: () => { aiWindow(ctx, M.aiX ?? 760, M.aiY ?? 470, 500, 340, t, { greet: "Siap merangkum!", reply: t >= ts ? { k: t - ts, text: M.sumText || "5 keluhan teratas" } : null, input: "" }); },
      front: () => { prop(ctx, "desk", M.deskX ?? 660, GY, { s: 1.1, papers: 3 }, t);
        its.forEach((it, n) => { const k = t - it.T0, cx = M.x0 + n * M.dx, cy = M.y + Math.sin(t * 2 + n) * 6, hit = k >= .35, hq = clamp((k - .35) / .3, 0, 1);
          if (it.kind === "tolak" && hit){ const q = clamp((k - .35) / .9, 0, 1); [-1, 1].forEach(d => { ctx.save(); ctx.translate(cx + d * (20 + q * 120), cy + q * q * 300 - Math.sin(q * Math.PI) * 60); ctx.rotate(d * q * 1.3); ctx.beginPath(); ctx.rect(d < 0 ? -135 : 0, -80, 135, 160); ctx.clip();
              drawItem(ctx, "card", 0, 0, t, { w: 260, h: 140, text: it.inTxt, size: 34, edge: RED, bg: "#FBE3DF" }); ctx.restore(); });
            if (k > 1.25) markBadge(ctx, cx, cy - 60, k - 1.25, false, 1.1); }
          else { let txt = it.inTxt, bg = PAPER, edge = RED, ink = BROWN; if (hit && it.kind === "samar"){ txt = it.outTxt; bg = "#EAF6EC"; edge = GREEN; } if (hit && it.kind === "hapus"){ edge = "#6B6F78"; }
            const sq = hit && k < .6 ? 1 - .12 * Math.sin((k - .35) / .25 * Math.PI) : 1; ctx.save(); ctx.translate(cx, cy); ctx.scale(1 / sq, sq); drawItem(ctx, "card", 0, 0, t, { w: 260, h: 140, text: txt, size: 34, bg, edge, ink, tilt: (n - 1) * .04 }); ctx.restore();
            if (it.kind === "hapus" && hit){ rr(ctx, cx - 115, cy - 28, 230 * hq, 56, 8); ctx.fillStyle = "#1E1A18"; ctx.fill(); if (hq >= 1) textC(ctx, it.outTxt || "dihapus", cx, cy + 10, 26, "#FFFFFF", 900); }
            if (hit && k > .8) markBadge(ctx, cx + 100, cy - 60, k - .8, true, .7); }
          if (it.kind !== "tolak" && k >= -.2 && k < 1.0){ let sy; const kk = k + .2; if (kk < .55) sy = lerp(cy - 520, cy - 62, kk < .2 ? 0 : (eIn((kk - .2) / .35))); else sy = lerp(cy - 62, cy - 520, easeIO(clamp((kk - .65) / .5, 0, 1)));
            rubberStamp(ctx, cx, sy, it.kind === "hapus" ? "#3A3348" : ORANGE, it.kind === "hapus" ? "HAPUS" : "SAMARKAN"); if (hit) ring(ctx, cx, cy, k - .35, "#FFFFFF", 70); } }); } });
  }, sfxWith((s, f, i, add) => { const M = f.cap || {}; (M.items || []).forEach((it, n) => { const t0 = T(s, it.cue, .3 + n * .1, i); add(t0 + .35, it.kind === "tolak" ? "ping" : "pop"); if (it.kind !== "tolak") add(t0 - .1, "whoosh"); }); if (M.sumCue) add(T(s, M.sumCue, .4, i), "chime"); }));
})();
