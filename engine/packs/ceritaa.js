/* Scene pack ceritaa: MODE CERITA story scenes (prefix ca_) for JS22, SC22, MS22, SB23, SP23.
   Every scene = full-screen environment + toons (f.toons, same actor format as layout "cerita") + camera (f.cam, on:<toon index|id|"obj">)
   + cards (f.cards) + title stamp (f.stamp) + ONE animated story object that is unique to the scene:
     ca_pilih    two offer cards float beside the hero; his eyes ping-pong; "NANTI SAJA" stamp hits them        f.offers [{cue,title,sub}], f.waitCue
     ca_tunggu   days fly by in a big window (sun/moon), a day tile flips per cue, phone rings, bad-news card     f.days [{cue,txt}], f.ringCue
     ca_ponsel   giant phone slides up next to the hero: chat bubbles pop in, phone rings, warning stamp           f.phone {inCue,ringCue,name,unknown}, f.msgs [{cue,text,me,warn}], f.phoneStamp {cue,text}
     ca_daftar   clipboard board: items write in on cue and get a check / warning mark, hero points            f.board {title, mark}, f.items [{cue,text}]
     ca_kabur    memory flashback (sepia, film grain): a shady manager runs off with the money sack, bills fly   f.flashCue, f.runCue, toons with phase "a"|"b"
     ca_lingkar  arisan table: members behind a round table, numbered envelope goes round, bills fly to the tin   f.rules [{cue,text}], f.orderCue, f.payCue, f.lateCue
     ca_awan     a personal rain cloud follows the hero (rain, lightning), then breaks into sunshine             f.cloud {on, formCue, boltCue, clearCue}
     ca_angkat   weights: light (bored), heavy (crushed), just above (strain -> lift -> grow)                     f.lightCue, f.heavyCue, f.rightCue, f.words
     ca_presentasi presentation board with rising bars, audience heads clap, confetti                          f.board {title}, f.clapCue, f.winCue
     ca_kerja    hero behind a desk: routine stamping loop ("rutin") or fast work with progress bar ("kebut")    f.mode, f.startCue, f.endCue, f.bar {label, to}
     ca_gunung   a giant task mountain grows behind the small hero; camera tilts up                              f.mountain {label, revealCue, grow:[cue..]}
     ca_jam      giant kitchen timer: the 5-minute wedge is set, the hand ticks                                   f.timer {setCue, startCue, minutes} */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, bubble, outlineWords, layer, CS, TAU } = TT;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", RED = "#D9483B", FAM = "Poppins", GY = 1640;
  const lerp = (a, b, q) => a + (b - a) * q;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const ol = (ctx, w) => { ctx.strokeStyle = OUT; ctx.lineWidth = w || 6; ctx.lineJoin = "round"; ctx.stroke(); };
  const popQ = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  const fitFont = (ctx, txt, w, size, min, weight) => { let z = size; font(ctx, weight || 800, z, FAM); while (ctx.measureText(txt).width > w && z > (min || 20)){ z -= 2; font(ctx, weight || 800, z, FAM); } return z; };
  const over = fn => { if (CS && CS.active) CS.ov.push(fn); else fn(); };
  function sparkles(ctx, x, y, dt, n, R0, col){ if (dt < 0 || dt > .9) return; const q = eOut(dt / .9);
    for (let k = 0; k < n; k++){ const a = k / n * TAU + .4; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = col || (k % 2 ? HL : "#FFE9B8"); TT.G && 0; starP(ctx, x + Math.cos(a) * (R0 * .3 + q * R0), y + Math.sin(a) * (R0 * .3 + q * R0), 16 * (1 - q * .5)); ctx.restore(); } }
  function starP(ctx, x, y, s){ ctx.beginPath(); for (let i = 0; i < 8; i++){ const r = i % 2 ? s * .38 : s, a = i * Math.PI / 4; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
  // big outlined pop word in screen space (after grading)
  function popWord(ctx, text, x, y, T, t, o){
    o = o || {}; const q = t - T, out = o.out ?? 1e9; if (q < 0 || t > out + .3) return;
    over(() => { const s = eBack(clamp(q / .32, 0, 1)) * (1 - .3 * clamp((t - out) / .3, 0, 1)), a = 1 - clamp((t - out) / .3, 0, 1);
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate((o.rot ?? -4) * Math.PI / 180 + Math.sin(t * 3) * .015); ctx.scale(s, s);
      const U = String(text).toUpperCase(); let size = o.size || 96; font(ctx, 800, size, FAM); while (ctx.measureText(U).width > 860 && size > 50){ size -= 4; font(ctx, 800, size, FAM); }
      outlineWords(ctx, U.split(" ").map(w => ({ w, hl: !!o.hl })), 0, 0, size, { sw: size * .24, hl: o.color || HL }); ctx.restore(); });
  }
  function amplop(ctx, x, y, s, rot, txt){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    rr(ctx, -70, -46, 140, 92, 8); ctx.fillStyle = "#FFF8EC"; ctx.fill(); ol(ctx, 5);
    ctx.beginPath(); ctx.moveTo(-70, -46); ctx.lineTo(0, 6); ctx.lineTo(70, -46); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    if (txt){ font(ctx, 800, 22, FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "center"; ctx.fillText(txt, 0, 34); ctx.textAlign = "left"; }
    ctx.restore();
  }
  function bill(ctx, x, y, s, rot){
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s);
    rr(ctx, -46, -24, 92, 48, 6); ctx.fillStyle = "#9CC58A"; ctx.fill(); ol(ctx, 4);
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fillStyle = "#6E9A58"; ctx.fill();
    ctx.fillStyle = "#6E9A58"; ctx.fillRect(-38, -16, 12, 6); ctx.fillRect(26, 10, 12, 6); ctx.restore();
  }

  /* ---------- shared scene base: env + camera + toons + hooks + cards + stamp ---------- */
  function base(ctx, s, t, o){
    const f = s.f || {}, idx = TT.G.scene, toons = (f.toons || []).filter(a => !o.only || o.only(a));
    const sts = toons.map(a => toonState(a, s, t)), anchors = [];
    if (o.pre) o.pre(sts, toons);
    const resolve = (on, tt, k) => {
      if (on === "obj" && o.target) return o.target(k);
      const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null;
      const st = sts[j], hp = toonHead(st), z = k.fit ? (1080 * k.fit) / (st.size * 42 / 92) : null;
      return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || o.cam || [{ at: 0, x: 540, y: 960, zoom: 1.04 }], Object.assign({ resolve }, f.camOpt || {}));
    const kind = f.env || o.env || "office", eo = Object.assign({}, o.envOpt || {}, f.envOpt || {});
    env(ctx, kind, t, c, eo);
    const W = fn => { ctx.save(); c.apply(ctx); try { fn(); } finally { ctx.restore(); } };
    if (o.back) W(() => o.back(c, sts, toons));
    (f.props || []).forEach(p => { const T = p.cue ? at(s, p.cue, .3) : (p.at ?? -1), q = popQ(t, T, .35); if (q <= 0 || p.front) return; W(() => { ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); }); });
    toons.map((a, j) => [a, j]).sort((p, q) => (p[0].z || 0) - (q[0].z || 0)).forEach(([a, j]) => {
      if (o.mid && (a.z || 0) >= 0 && !o._mid){ o._mid = 1; W(() => o.mid(c, sts, toons)); }
      anchors[j] = toon(ctx, c, a, s, t, { st: sts[j] }); });
    if (o.mid && !o._mid) W(() => o.mid(c, sts, toons));
    if (o.front) W(() => o.front(c, sts, toons, anchors));
    (f.props || []).forEach(p => { const T = p.cue ? at(s, p.cue, .3) : (p.at ?? -1), q = popQ(t, T, .35); if (q <= 0 || !p.front) return; W(() => { ctx.translate(p.x ?? 540, p.y ?? GY); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); }); });
    if (f.front !== false) envFront(ctx, kind, t, c, eo);
    if (o.screen) o.screen(c, sts, toons, anchors);
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? at(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? at(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    (f.words || []).forEach((w, j) => popWord(ctx, w.text, w.x ?? 540, w.y ?? 330, w.cue ? at(s, w.cue, .3 + j * .2) : (w.at ?? .3), t, { out: w.outCue ? at(s, w.outCue, .9) : w.out, hl: w.hl, rot: w.rot, size: w.size, color: w.color }));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? at(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
    return { c, sts, anchors, f };
  }
  // generic sfx (toons, cam, cards, words, stamp)
  function sfxBase(s, f, i, add){
    const kt = (k, j) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, i) : 0);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(kt(k, j), "pop"); if (k.cut && kt(k, j) > .2) add(kt(k, j), "whoosh"); });
    (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const T = kt(k, j); if (k.say != null) add(T, "pop"); if (k.jump) add(T + .13, "whoosh"); if (k.expr === "shock") add(T, "ping"); if (k.emote === "idea" || k.emote === "check") add(T, "chime"); }));
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.words || []).forEach((w, j) => add(w.cue ? cueT(s, w.cue, .3 + j * .2, i) : (w.at ?? .3), "pop"));
    (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }
  const reg = (name, label, draw, sfx) => TT.scene(name, label, draw, (s, f, i, add) => { sfxBase(s, f, i, add); if (sfx) sfx(s, f, i, add); });

  /* ---------- ca_pilih: two offers float beside the hero, then "NANTI SAJA" ---------- */
  function offerCard(ctx, x, y, o, t, q, waitQ, k){
    if (q <= 0) return; const bob = Math.sin(t * 2.2 + k * 2) * 12, w = 320, h = 360;
    ctx.save(); ctx.translate(x, y + bob - 40 * waitQ); ctx.rotate((k ? 4 : -4) * Math.PI / 180 + Math.sin(t * 1.7 + k) * .03); ctx.scale(q * (1 - .12 * waitQ), q * (1 - .12 * waitQ));
    ctx.globalAlpha *= 1 - .35 * waitQ;
    ctx.save(); ctx.shadowColor = "rgba(40,20,10,.35)"; ctx.shadowOffsetY = 14; rr(ctx, -w / 2, -h / 2, w, h, 24); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.restore(); rr(ctx, -w / 2, -h / 2, w, h, 24); ol(ctx, 6);
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 24); ctx.clip(); ctx.fillStyle = k ? "#2F6F73" : ORANGE; ctx.fillRect(-w / 2, -h / 2, w, 96); ctx.restore();
    fitFont(ctx, o.title || "", w - 40, 46, 26); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(o.title || "", 0, -h / 2 + 64);
    icon(ctx, "pin", -40, -40, 80, k ? "#2F6F73" : ORANGE, 2.4);
    ctx.fillStyle = "#E8B23A"; for (let i = 0; i < 4; i++) starP(ctx, -66 + i * 44, 82, 18);
    if (o.sub){ fitFont(ctx, o.sub, w - 40, 36, 22, 700); ctx.fillStyle = BROWN; ctx.fillText(o.sub, 0, 150); }
    ctx.textAlign = "left";
    if (waitQ > 0){ const sq = eBack(clamp(waitQ * 1.6, 0, 1)); ctx.save(); ctx.globalAlpha = 1; ctx.rotate(-.25); ctx.scale(2.2 - 1.2 * sq, 2.2 - 1.2 * sq); ctx.globalAlpha = clamp(waitQ * 4, 0, 1);
      font(ctx, 800, 50, FAM); const T = "NANTI SAJA", tw = ctx.measureText(T).width + 40; rr(ctx, -tw / 2, -42, tw, 80, 12); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.stroke(); ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(T, 0, 16); ctx.textAlign = "left"; ctx.restore(); }
    ctx.restore();
  }
  reg("ca_pilih", "Cerita: dua pilihan melayang", (ctx, th, s, t) => {
    const f = s.f || {}, offers = f.offers || [], tW = f.waitCue ? at(s, f.waitCue, .8) : 1e9, T0 = offers.map((o, k) => at(s, o.cue, .25 + k * .1));
    const tPing = Math.min(...T0.concat([1e9])) + .6;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      target: k => { const j = k.offer || 0; return [j ? 830 : 250, 620, k.zoom || 1.5]; },
      back: () => {},
      pre: (sts) => {
        // ping-pong look between the two offers until the wait cue
        if (sts[0] && t > tPing && t < tW){ const side = Math.sin((t - tPing) * 3.2) > 0 ? 1 : -1; sts[0].face = side; sts[0].look = [.85, -.55]; }
      },
      front: (c, sts) => {
        offers.forEach((o, k) => { const q = popQ(t, T0[k], .45), wq = clamp((t - tW) / .5, 0, 1); offerCard(ctx, k ? 830 : 250, 600, o, t, q, wq, k); });
      },
      screen: () => { offers.forEach((o, k) => { const dt = t - T0[k]; if (dt > 0 && dt < .9) over(() => { const p = CS.cam ? CS.cam.toScreen(k ? 830 : 250, 600) : [k ? 830 : 250, 600]; sparkles(ctx, p[0], p[1], dt, 10, 230); }); }); }
    });
  }, (s, f, i, add) => { (f.offers || []).forEach((o, k) => add(cueT(s, o.cue, .25 + k * .1, i), "pop")); if (f.waitCue) { const T = cueT(s, f.waitCue, .8, i); add(T, "whoosh"); add(T + .15, "pop"); } });

  /* ---------- ca_tunggu: days fly by ---------- */
  reg("ca_tunggu", "Cerita: hari-hari berlalu", (ctx, th, s, t) => {
    const f = s.f || {}, days = f.days || [], tR = f.ringCue ? at(s, f.ringCue, .6) : 1e9, D = days.map((d, k) => d.cue ? at(s, d.cue, k / Math.max(1, days.length)) : (d.at ?? 0));
    const tEnd = D.length ? D[D.length - 1] : 0, spin = Math.max(0, Math.min(t, tEnd + .6)), cyc = spin * .9; // day cycles
    const di = D.reduce((a, T, k) => t >= T ? k : a, -1);
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 900 },
      back: () => {
        // big window with sky cycling (world, behind the hero)
        const x0 = 180, y0 = 330, w = 560, h = 470, ph = cyc % 1, dayA = Math.sin(ph * Math.PI);
        ctx.save(); rr(ctx, x0, y0, w, h, 16); ctx.clip();
        const top = `rgb(${lerp(14, 134, dayA) | 0},${lerp(19, 191, dayA) | 0},${lerp(48, 211, dayA) | 0})`, bot = `rgb(${lerp(94, 247, dayA) | 0},${lerp(59, 226, dayA) | 0},${lerp(60, 194, dayA) | 0})`;
        const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
        for (let i = 0; i < 26; i++){ ctx.globalAlpha = (1 - dayA) * (.5 + .5 * Math.sin(t * 3 + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(x0 + rnd(i) * w, y0 + rnd(i + 7) * h * .7, 2.5, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
        const an = Math.PI * (1 - ph), bx = x0 + w / 2 + Math.cos(an) * w * .46, by = y0 + h * .95 - Math.sin(an) * h * .8;
        ctx.fillStyle = dayA > .25 ? "#FFE7A6" : "#FFF0D6"; ctx.beginPath(); ctx.arc(bx, by, dayA > .25 ? 46 : 34, 0, TAU); ctx.fill();
        if (dayA > .25){ ctx.strokeStyle = "rgba(255,231,166,.7)"; ctx.lineWidth = 6; for (let r = 0; r < 8; r++){ const a = r / 8 * TAU + t; ctx.beginPath(); ctx.moveTo(bx + Math.cos(a) * 58, by + Math.sin(a) * 58); ctx.lineTo(bx + Math.cos(a) * 78, by + Math.sin(a) * 78); ctx.stroke(); } }
        ctx.fillStyle = "#6E5A4A"; for (let i = 0; i < 6; i++){ const hh = 70 + rnd(i + 3) * 90; ctx.fillRect(x0 + i * 100, y0 + h - hh, 80, hh); }
        // speed streaks while days pass
        if (t < tEnd + .6){ ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 5; for (let i = 0; i < 6; i++){ const yy = y0 + 40 + i * 70, xx = x0 + ((t * 900 + i * 230) % (w + 300)) - 150; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 120, yy); ctx.stroke(); } }
        ctx.restore();
        rr(ctx, x0, y0, w, h, 16); ctx.lineWidth = 22; ctx.strokeStyle = "#5A3A2A"; ctx.stroke(); ctx.fillStyle = "#5A3A2A"; ctx.fillRect(x0 + w / 2 - 8, y0, 16, h); ctx.fillRect(x0, y0 + h / 2 - 8, w, 16);
        ctx.fillStyle = "#8E4E2E"; rr(ctx, x0 - 30, y0 + h + 4, w + 60, 26, 8); ctx.fill(); ol(ctx, 5);
        // flipping day tile on the wall (right)
        const tx = 900, ty = 430; ctx.save(); ctx.translate(tx, ty + Math.sin(t * 2) * 4); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(-60, -110); ctx.moveTo(0, -150); ctx.lineTo(60, -110); ctx.stroke();
        ctx.fillStyle = BROWN; ctx.beginPath(); ctx.arc(0, -150, 9, 0, TAU); ctx.fill();
        rr(ctx, -110, -110, 220, 230, 18); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 6); ctx.save(); rr(ctx, -110, -110, 220, 230, 18); ctx.clip(); ctx.fillStyle = RED; ctx.fillRect(-110, -110, 220, 62); ctx.restore();
        const cur = di >= 0 ? days[di].txt : (f.day0 || ""), fq = di >= 0 ? clamp((t - D[di]) / .35, 0, 1) : 1;
        ctx.save(); ctx.scale(1, fq < .5 ? 1 - fq * 2 * .9 : .1 + (fq - .5) * 1.8); fitFont(ctx, cur, 190, 84, 40); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(cur, 0, 70); ctx.restore();
        ctx.fillStyle = "#fff"; font(ctx, 800, 26, FAM); ctx.textAlign = "center"; ctx.fillText(f.tileTag || "HARI", 0, -70); ctx.textAlign = "left"; ctx.restore();
      },
      front: (c, sts, toons, an) => {
        // ringing phone near the hero's hand
        if (t > tR && sts[0]){ const st = sts[0], k = st.size / 92, q = popQ(t, tR, .3), rq = t - tR, wig = rq < 1.6 ? Math.sin(rq * 60) * .12 : 0;
          const px = st.x + 24 * k * st.face, py = st.y - 66 * k;
          if (st.pose !== "phone"){ ctx.save(); ctx.translate(px, py); ctx.scale(q * .7, q * .7); prop(ctx, "phone", 0, 0, { rot: wig, notif: 2 }, t); ctx.restore(); }
          if (rq < 2){ ctx.strokeStyle = HL; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ const rr2 = 120 + i * 40 + (rq * 120) % 40; ctx.globalAlpha = .8 - i * .2; ctx.beginPath(); ctx.arc(px, py, rr2, -.6, .6); ctx.stroke(); ctx.beginPath(); ctx.arc(px, py, rr2, Math.PI - .6, Math.PI + .6); ctx.stroke(); } ctx.globalAlpha = 1; } }
      }
    });
  }, (s, f, i, add) => { (f.days || []).forEach((d, k) => { if (d.cue) add(cueT(s, d.cue, 0, i), "whoosh"); }); if (f.ringCue){ const T = cueT(s, f.ringCue, .6, i); add(T, "ping"); add(T + .5, "ping"); } });

  /* ---------- ca_ponsel: giant phone with chat ---------- */
  reg("ca_ponsel", "Cerita: ponsel raksasa + chat", (ctx, th, s, t) => {
    const f = s.f || {}, P0 = Object.assign({ x: 735, y: 450, w: 450, h: 820, name: "Kontak" }, f.phone || {});
    const tIn = P0.inCue ? at(s, P0.inCue, .05) : (P0.at ?? 0), tRing = P0.ringCue ? at(s, P0.ringCue, .1) : -9, msgs = f.msgs || [], TM = msgs.map((m, k) => m.cue ? at(s, m.cue, .2 + k * .2) : (m.at ?? .5 + k));
    const tSt = f.phoneStamp ? at(s, f.phoneStamp.cue, .8) : 1e9;
    base(ctx, s, t, { env: "home", envOpt: { time: "night" },
      target: k => [P0.x - (k.dx ?? 170), Math.max(k.minY ?? 880, P0.y + P0.h * (k.fy ?? .45)), k.zoom || 1.15],
      front: () => {
        const qi = clamp((t - tIn) / .55, 0, 1); if (qi <= 0) return; const rq = t - tRing, wig = rq > 0 && rq < 1.4 ? Math.sin(rq * 55) * .05 * (1 - rq / 1.4) : 0;
        const x0 = P0.x - P0.w / 2, y0 = P0.y + (1 - eBack(qi)) * 1300, w = P0.w, h = P0.h;
        ctx.save(); ctx.translate(P0.x, y0 + h / 2); ctx.rotate(.05 + wig + Math.sin(t * 1.3) * .012); ctx.translate(-P0.x, -(y0 + h / 2));
        ctx.save(); ctx.shadowColor = "rgba(20,10,5,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; rr(ctx, x0, y0, w, h, 60); ctx.fillStyle = "#1E1A18"; ctx.fill(); ctx.restore(); rr(ctx, x0, y0, w, h, 60); ol(ctx, 8);
        const sx = x0 + 22, sy = y0 + 26, sw = w - 44, sh = h - 52; ctx.save(); rr(ctx, sx, sy, sw, sh, 42); ctx.clip();
        ctx.fillStyle = "#F3EBDD"; ctx.fillRect(sx, sy, sw, sh);
        ctx.fillStyle = "rgba(194,105,31,.06)"; for (let i = 0; i < 40; i++){ ctx.beginPath(); ctx.arc(sx + rnd(i) * sw, sy + rnd(i + 3) * sh, 10, 0, TAU); ctx.fill(); }
        // header
        ctx.fillStyle = P0.unknown ? "#4A3A48" : "#2F6F73"; ctx.fillRect(sx, sy, sw, 120);
        ctx.beginPath(); ctx.arc(sx + 70, sy + 70, 34, 0, TAU); ctx.fillStyle = P0.unknown ? "#8C7B8A" : "#E8B98A"; ctx.fill();
        font(ctx, 800, 40, FAM); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(P0.unknown ? "?" : (P0.name[0] || "").toUpperCase(), sx + 70, sy + 84); ctx.textAlign = "left";
        fitFont(ctx, P0.name, sw - 140, 32, 20); ctx.fillStyle = "#fff"; ctx.fillText(P0.name, sx + 118, sy + 66); font(ctx, 600, 22, FAM); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillText(P0.status || "online", sx + 118, sy + 96);
        // messages
        let yy = sy + 150; msgs.forEach((m, k) => { const T = TM[k]; if (t < T - (m.me ? 0 : .55)) return;
          if (!m.me && t < T){ rr(ctx, sx + 20, yy, 120, 60, 26); ctx.fillStyle = "#fff"; ctx.fill(); for (let d = 0; d < 3; d++){ ctx.fillStyle = "#B9A58F"; ctx.beginPath(); ctx.arc(sx + 52 + d * 28, yy + 30 + Math.sin(t * 12 + d) * 5, 8, 0, TAU); ctx.fill(); } return; }
          const q = eBack(clamp((t - T) / .3, 0, 1)); font(ctx, 700, 31, FAM); const L = wrapRich(ctx, m.text, "", sw - 110).map(l => l.map(z => z.w).join(" ")).slice(0, 3);
          const bw = Math.max(...L.map(l => ctx.measureText(l).width)) + 44, bh = L.length * 40 + 30, bx = m.me ? sx + sw - 18 - bw : sx + 18;
          ctx.save(); ctx.translate(bx + (m.me ? bw : 0), yy); ctx.scale(q, q); ctx.translate(-(bx + (m.me ? bw : 0)), -yy);
          rr(ctx, bx, yy, bw, bh, 24); ctx.fillStyle = m.me ? ORANGE : (m.warn ? "#FFF1C9" : "#FFFFFF"); ctx.fill(); if (m.warn){ ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.stroke(); }
          ctx.fillStyle = m.me ? "#fff" : BROWN; L.forEach((l, i) => ctx.fillText(l, bx + 22, yy + 46 + i * 40));
          if (m.warn){ const bq = Math.sin(t * 8) * .1 + 1; ctx.save(); ctx.translate(bx + bw - 6, yy + 4); ctx.scale(bq, bq); ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fillStyle = RED; ctx.fill(); font(ctx, 800, 32, FAM); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("!", 0, 11); ctx.textAlign = "left"; ctx.restore(); }
          ctx.restore(); yy += bh + 22; });
        ctx.restore();
        // notch
        rr(ctx, P0.x - 60, y0 + 30, 120, 22, 11); ctx.fillStyle = "#1E1A18"; ctx.fill();
        if (rq > 0 && rq < 2.2){ ctx.strokeStyle = HL; ctx.lineWidth = 9; ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ const d = 30 + i * 34 + (rq * 90) % 34; ctx.globalAlpha = .9 - i * .25; ctx.beginPath(); ctx.moveTo(x0 - d, y0 + 160); ctx.lineTo(x0 - d - 20, y0 + 140); ctx.moveTo(x0 + w + d, y0 + 160); ctx.lineTo(x0 + w + d + 20, y0 + 140); ctx.stroke(); } ctx.globalAlpha = 1; }
        if (t > tSt){ const q = clamp((t - tSt) / .25, 0, 1), sc = 2.4 - 1.4 * eOut(q); ctx.save(); ctx.translate(P0.x, y0 + h * .62); ctx.rotate(-.3); ctx.scale(sc, sc); ctx.globalAlpha = q;
          const T2 = f.phoneStamp.text.toUpperCase(); let z = fitFont(ctx, T2, w - 60, 64, 30); const tw = ctx.measureText(T2).width + 50; rr(ctx, -tw / 2, -z, tw, z * 1.5, 14); ctx.fillStyle = "rgba(255,241,201,.85)"; ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.stroke();
          ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(T2, 0, z * .38); ctx.textAlign = "left"; ctx.restore(); }
        ctx.restore();
      }
    });
  }, (s, f, i, add) => { const P0 = f.phone || {}; add(P0.inCue ? cueT(s, P0.inCue, .05, i) : (P0.at ?? 0), "whoosh"); if (P0.ringCue){ const T = cueT(s, P0.ringCue, .1, i); add(T, "ping"); add(T + .45, "ping"); }
    (f.msgs || []).forEach((m, k) => add(m.cue ? cueT(s, m.cue, .2 + k * .2, i) : (m.at ?? .5 + k), "pop")); if (f.phoneStamp) add(cueT(s, f.phoneStamp.cue, .8, i), "pop"); });

  /* ---------- ca_daftar: clipboard with items + marks ---------- */
  reg("ca_daftar", "Cerita: papan daftar + centang", (ctx, th, s, t) => {
    const f = s.f || {}, B = Object.assign({ x: 715, y: 470, w: 560, h: 700, title: "", mark: "check" }, f.board || {}), items = f.items || [];
    const TI = items.map((it, k) => at(s, it.cue, .15 + k * .25)), tB = f.boardCue ? at(s, f.boardCue, .05) : (B.at ?? .15);
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      target: k => { const j = k.item ?? 0; return [B.x - (k.dx ?? 200), B.y + 240 + j * 140 + (k.dy ?? 130), k.zoom || 1.1]; },
      back: () => {
        const q = popQ(t, tB, .5); if (q <= 0) return; const sw = Math.sin(t * 1.4) * .012;
        ctx.save(); ctx.translate(B.x, B.y + B.h / 2); ctx.rotate(.03 + sw); ctx.scale(q, q); ctx.translate(-B.x, -(B.y + B.h / 2));
        const x0 = B.x - B.w / 2, y0 = B.y;
        ctx.save(); ctx.shadowColor = "rgba(30,15,8,.35)"; ctx.shadowOffsetY = 18; ctx.shadowBlur = 20; rr(ctx, x0, y0, B.w, B.h, 26); ctx.fillStyle = "#A9643B"; ctx.fill(); ctx.restore(); rr(ctx, x0, y0, B.w, B.h, 26); ol(ctx, 7);
        rr(ctx, x0 + 28, y0 + 50, B.w - 56, B.h - 78, 12); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 4);
        ctx.strokeStyle = "rgba(194,105,31,.18)"; ctx.lineWidth = 3; for (let l = 0; l < 9; l++){ ctx.beginPath(); ctx.moveTo(x0 + 50, y0 + 180 + l * 60); ctx.lineTo(x0 + B.w - 50, y0 + 180 + l * 60); ctx.stroke(); }
        rr(ctx, B.x - 90, y0 - 20, 180, 70, 16); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 6); rr(ctx, B.x - 40, y0 - 40, 80, 40, 12); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 5);
        fitFont(ctx, B.title.toUpperCase(), B.w - 110, 46, 26); ctx.fillStyle = ORANGE; ctx.textAlign = "center"; ctx.fillText(B.title.toUpperCase(), B.x, y0 + 130); ctx.textAlign = "left";
        items.forEach((it, k) => { const T = TI[k], dt = t - T; if (dt < 0) return; const yy = y0 + 225 + k * 140, rv = clamp(dt / .55, 0, 1);
          const mk = it.mark || B.mark, num = String(k + 1);
          const bq = popQ(t, T, .35); ctx.save(); ctx.translate(x0 + 92, yy - 14); ctx.scale(bq, bq); ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = mk === "warn" ? RED : (mk === "num" ? ORANGE : "#E8B98A"); ctx.fill(); ol(ctx, 4);
          font(ctx, 800, 36, FAM); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(mk === "warn" ? "!" : num, 0, 13); ctx.textAlign = "left"; ctx.restore();
          const z = fitFont(ctx, it.text, B.w - 190, 40, 24); ctx.save(); ctx.beginPath(); ctx.rect(x0 + 140, yy - 60, (B.w - 170) * rv, 90); ctx.clip(); ctx.fillStyle = BROWN; ctx.fillText(it.text, x0 + 142, yy + z * .0); ctx.restore();
          if (rv < 1){ const px = x0 + 142 + Math.min(ctx.measureText(it.text).width, (B.w - 170) * rv); ctx.save(); ctx.translate(px, yy - 6); ctx.rotate(.5); ctx.fillStyle = ORANGE; rr(ctx, -6, -60, 12, 60, 4); ctx.fill(); ol(ctx, 3); ctx.restore(); }
          if (mk === "check" || mk === "num"){ const cq = clamp((dt - .55) / .3, 0, 1); if (cq > 0){ const cx = x0 + 92, cy = yy - 14; ctx.strokeStyle = mk === "num" ? "#fff" : "#2F8F4E"; ctx.lineWidth = 12; ctx.lineCap = "round";
              if (mk === "check"){ ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 20 + 14 * Math.min(1, cq * 2), cy + 14 * Math.min(1, cq * 2)); if (cq > .5) ctx.lineTo(cx - 6 + 34 * (cq - .5) * 2, cy + 14 - 36 * (cq - .5) * 2); ctx.stroke(); } } }
        });
        ctx.restore();
      },
      screen: () => { items.forEach((it, k) => { const dt = t - TI[k] - .55; if (dt > 0 && dt < .9) over(() => { const p = CS.cam.toScreen(B.x - B.w / 2 + 92, B.y + 211 + k * 140); sparkles(ctx, p[0], p[1], dt, 8, 120); }); }); }
    });
  }, (s, f, i, add) => { add(f.boardCue ? cueT(s, f.boardCue, .05, i) : ((f.board || {}).at ?? .15), "whoosh"); (f.items || []).forEach((it, k) => { const T = cueT(s, it.cue, .15 + k * .25, i); add(T, "pop"); add(T + .6, "chime"); }); });

  /* ---------- ca_kabur: flashback, manager runs off with the money ---------- */
  reg("ca_kabur", "Cerita: kilas balik uang dibawa kabur", (ctx, th, s, t) => {
    const f = s.f || {}, tF = at(s, f.flashCue, .3), tRun = at(s, f.runCue, .55), B = t >= tF;
    const runner = (f.toons || []).find(a => a.id === "runner");
    const r = base(ctx, s, t, { env: B ? "street" : "home", envOpt: B ? { time: "day" } : { time: "night" }, only: a => (a.phase || "a") === (B ? "b" : "a"),
      cam: B ? (f.camB || [{ at: tF, cut: true, x: 540, y: 1000, zoom: 1.12 }, { at: tRun, x: 640, y: 980, zoom: 1, dur: 1.2 }]) : (f.camA || [{ at: 0, x: 540, y: 1000, zoom: 1.05 }]),
      front: (c, sts, toons) => {
        if (!B || !runner) return; const j = toons.indexOf(runner); if (j < 0) return; const st = sts[j], k = st.size / 92;
        // sack on the runner's back + bills flying out behind him
        if (st.show){ const bx = st.x - 18 * k * st.face, by = st.y - 62 * k + Math.sin(t * 15) * 6; ctx.save(); ctx.translate(bx, by); ctx.rotate(-.2 * st.face + Math.sin(t * 15) * .08);
          ctx.beginPath(); ctx.ellipse(0, 0, 18 * k, 20 * k, 0, 0, TAU); ctx.fillStyle = "#C9A26B"; ctx.fill(); ol(ctx, 6); font(ctx, 800, 15 * k, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText("Rp", 0, 5 * k); ctx.textAlign = "left"; ctx.restore(); }
        if (t > tRun) for (let i = 0; i < 16; i++){ const ts = tRun + i * .14; if (t < ts) continue; const sp = toonState(runner, s, ts), age = t - ts;
          const x = sp.x - 18 * k * sp.face + Math.sin(age * 3 + i) * 50 - sp.face * age * 40, y = sp.y - 70 * k - 60 * age + 170 * age * age * .4 + Math.sin(age * 4 + i) * 20;
          if (y > GY - 10) continue; bill(ctx, x, Math.min(y, GY - 30), .9, Math.sin(age * 5 + i) * 1.2); }
      },
      screen: () => {
        if (!B) return; const q = t - tF;
        over(() => { ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#E9C79A"; ctx.fillRect(0, 0, 1080, 1920); ctx.restore();
          ctx.save(); for (let i = 0; i < 70; i++){ ctx.fillStyle = `rgba(60,35,15,${.12 + rnd(i + Math.floor(t * 12)) * .15})`; ctx.fillRect(rnd(i * 3 + Math.floor(t * 12)) * 1080, rnd(i * 7 + Math.floor(t * 12) * 2) * 1920, 3, 3); }
          if (rnd(Math.floor(t * 8)) > .6){ ctx.fillStyle = "rgba(60,35,15,.18)"; ctx.fillRect(rnd(Math.floor(t * 8) + 4) * 1080, 0, 3, 1920); }
          const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1150); g.addColorStop(0, "rgba(40,22,8,0)"); g.addColorStop(1, "rgba(40,22,8,.55)"); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
          if (q < .25){ ctx.fillStyle = `rgba(255,248,235,${1 - q / .25})`; ctx.fillRect(0, 0, 1080, 1920); }
          const tq = eBack(clamp((q - .1) / .4, 0, 1)); ctx.save(); ctx.translate(250, 260); ctx.rotate(-.06); ctx.scale(tq, tq); font(ctx, 800, 40, FAM); const T = (f.flashTag || "Cerita tetangga").toUpperCase(), tw = ctx.measureText(T).width + 50;
          rr(ctx, -tw / 2, -40, tw, 72, 12); ctx.fillStyle = BROWN; ctx.fill(); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(T, 0, 10); ctx.textAlign = "left"; ctx.restore(); ctx.restore(); });
      }
    });
  }, (s, f, i, add) => { const tF = cueT(s, f.flashCue, .3, i), tR = cueT(s, f.runCue, .55, i); add(tF, "whoosh"); add(tR, "whoosh"); for (let k = 0; k < 6; k++) add(tR + .2 + k * .3, "pop"); });

  /* ---------- ca_lingkar: arisan table ---------- */
  reg("ca_lingkar", "Cerita: meja arisan", (ctx, th, s, t) => {
    const f = s.f || {}, rules = f.rules || [], TR = rules.map((r, k) => at(s, r.cue, .3 + k * .2)), tO = f.orderCue ? at(s, f.orderCue, .5) : 1e9, tP = f.payCue ? at(s, f.payCue, .7) : 1e9, tL = f.lateCue ? at(s, f.lateCue, .85) : 1e9;
    const tableY = 1290;
    base(ctx, s, t, { env: "home", envOpt: { time: "day", lampX: 540 },
      target: k => [540, k.y ?? 1080, k.zoom || 1.25],
      front: (c, sts) => {
        // table (in front of the seated members)
        ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(540, 1630, 520, 40, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#8E4E2E"; rr(ctx, 470, tableY + 40, 140, 330, 10); ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.ellipse(540, tableY + 40, 500, 70, 0, 0, Math.PI); ctx.lineTo(40, tableY); ctx.ellipse(540, tableY, 500, 70, 0, Math.PI, 0, true); ctx.closePath(); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.ellipse(540, tableY, 500, 70, 0, 0, TAU); ctx.fillStyle = "#C47A48"; ctx.fill(); ol(ctx, 6);
        // tin in the middle with bills
        const nB = t > tP ? Math.min(sts.length, Math.floor((t - tP) / .45) + 1) : 0, tinY = tableY - 6;
        ctx.save(); ctx.translate(540, tinY); rr(ctx, -80, -100, 160, 100, 14); ctx.fillStyle = "#E8B23A"; ctx.fill(); ol(ctx, 6); ctx.beginPath(); ctx.ellipse(0, -100, 80, 20, 0, 0, TAU); ctx.fillStyle = "#F6D36B"; ctx.fill(); ol(ctx, 5);
        font(ctx, 800, 26, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText("ARISAN", 0, -36); ctx.textAlign = "left";
        for (let b = 0; b < nB; b++){ ctx.save(); ctx.translate(-20 + b * 14, -112 - b * 4); ctx.rotate(-.2 + b * .12); bill(ctx, 0, 0, .7, 0); ctx.restore(); }
        ctx.restore();
        // bills flying from each member to the tin
        sts.forEach((st, j) => { const T = tP + j * .45, q = (t - T) / .5; if (q < 0 || q > 1) return; const hx = st.x, hy = st.y - st.size * .45;
          bill(ctx, lerp(hx, 540, q), lerp(hy, tinY - 120, q) - Math.sin(q * Math.PI) * 160, .8, q * 6); });
        // envelope going round in order + number badges
        const n = sts.length; if (t > tO && n){ const per = .6, pos = clamp((t - tO) / per, 0, n - 1 + .999), j = Math.floor(pos), q = eOut(pos - j), a = sts[j], b2 = sts[Math.min(n - 1, j + 1)];
          sts.forEach((st, m) => { const bq = popQ(t, tO + m * per, .35); if (bq <= 0) return; const hp = toonHead(st); ctx.save(); ctx.translate(hp[0] - st.size * .2, hp[1] - st.size * .3); ctx.scale(bq, bq); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ol(ctx, 5); font(ctx, 800, 44, FAM); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(String(m + 1), 0, 16); ctx.textAlign = "left"; ctx.restore(); });
          if (t < tO + per * n + 1.2){ const ha = toonHead(a), hb = toonHead(b2), done = pos >= n - 1 + .99, ex = done ? ha[0] : lerp(ha[0], hb[0], q), ey = (done ? ha[1] : lerp(ha[1], hb[1], q)) - a.size * .36 - Math.sin(q * Math.PI) * 60;
            amplop(ctx, ex + 40, ey, .85, Math.sin(t * 6) * .15, "ARISAN"); } }
        // late member
        if (t > tL && sts[f.lateIdx ?? 2]){ const st = sts[f.lateIdx ?? 2], hp = toonHead(st), q = popQ(t, tL, .4); ctx.save(); ctx.translate(hp[0] + st.size * .24, hp[1] - st.size * .28); ctx.scale(q * .55, q * .55); ctx.rotate(Math.sin(t * 20) * .08); prop(ctx, "clock", 0, 0, { fast: true }, t); ctx.restore(); }
      },
      screen: () => {
        // rules card (screen, top)
        if (!rules.length || t < TR[0] - .1) return;
        over(() => { const q = eBack(clamp((t - TR[0] + .1) / .45, 0, 1)), x0 = 120, y0 = 210, w = 840, h = 110 + rules.length * 92;
          ctx.save(); ctx.translate(540, y0 + h / 2); ctx.rotate(-.02); ctx.scale(.6 + .4 * q, .6 + .4 * q); ctx.globalAlpha = clamp(q * 3, 0, 1); ctx.translate(-540, -(y0 + h / 2));
          ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 14; rr(ctx, x0, y0, w, h, 28); ctx.fillStyle = CREAM; ctx.fill(); ctx.restore(); rr(ctx, x0, y0, w, h, 28); ctx.strokeStyle = "#E3C9A6"; ctx.lineWidth = 5; ctx.stroke();
          font(ctx, 800, 30, FAM); const tag = (f.rulesTag || "Pahami aturannya").toUpperCase(), tw = ctx.measureText(tag).width + 40; rr(ctx, x0 + 40, y0 + 30, tw, 50, 8); ctx.fillStyle = ORANGE; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(tag, x0 + 60, y0 + 66);
          rules.forEach((r, k) => { const rq = eBack(clamp((t - TR[k]) / .35, 0, 1)); if (rq <= 0) return; const yy = y0 + 140 + k * 92;
            ctx.save(); ctx.translate(x0 + 70, yy); ctx.scale(rq, rq); ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fillStyle = r.warn ? RED : "#2F8F4E"; ctx.fill(); icon(ctx, r.icon || "check", -17, -17, 34, "#fff", 2.6); ctx.restore();
            ctx.save(); ctx.globalAlpha *= clamp(rq, 0, 1); fitFont(ctx, r.text.toUpperCase(), w - 170, 46, 28); ctx.fillStyle = BROWN; ctx.fillText(r.text.toUpperCase(), x0 + 120 + (1 - rq) * 40, yy + 16); ctx.restore(); });
          ctx.restore(); });
      }
    });
  }, (s, f, i, add) => { (f.rules || []).forEach((r, k) => add(cueT(s, r.cue, .3 + k * .2, i), "pop")); if (f.orderCue){ const T = cueT(s, f.orderCue, .5, i); for (let k = 0; k < 4; k++) add(T + k * .6, "pop"); }
    if (f.payCue){ const T = cueT(s, f.payCue, .7, i); for (let k = 0; k < 4; k++) add(T + k * .45 + .4, "chime"); } if (f.lateCue) add(cueT(s, f.lateCue, .85, i), "ping"); });

  /* ---------- ca_awan: personal rain cloud ---------- */
  function cloudShape(ctx, x, y, s, col, shade){
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const B = [[-120, 10, 70], [-50, -30, 90], [40, -40, 85], [115, 5, 65], [0, 20, 80]];
    ctx.fillStyle = OUT; B.forEach(([bx, by, r]) => { ctx.beginPath(); ctx.arc(bx, by, r + 7, 0, TAU); ctx.fill(); });
    ctx.fillStyle = col; B.forEach(([bx, by, r]) => { ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); });
    ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(0, 50, 150, 34, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  reg("ca_awan", "Cerita: awan hujan pribadi", (ctx, th, s, t) => {
    const f = s.f || {}, C = Object.assign({ on: 0 }, f.cloud || {}), tFm = C.formCue ? at(s, C.formCue, .1) : (C.at ?? .2), tBt = C.boltCue ? at(s, C.boltCue, .5) : 1e9, tCl = C.clearCue ? at(s, C.clearCue, .7) : 1e9;
    let hp = [540, 900], R = 300;
    base(ctx, s, t, { env: "office", envOpt: { desk: true, deskX: 830 },
      target: k => [hp[0], hp[1] - (k.up ?? 120), k.zoom || 1.25],
      front: (c, sts) => {
        const st = sts[C.on]; if (!st) return; hp = toonHead(st); R = st.size * .42;
        const form = clamp((t - tFm) / .6, 0, 1), clr = clamp((t - tCl) / 1.1, 0, 1); if (form <= 0) return;
        const cx = hp[0] + Math.sin(t * 1.3) * 16, cy = hp[1] - st.size * .5 + Math.sin(t * 2.1) * 8, sc = (st.size / 760) * eBack(form) * (1 - clr * .9);
        // rain
        if (clr < 1){ ctx.save(); ctx.globalAlpha *= (1 - clr) * clamp(form * 2 - .6, 0, 1); ctx.strokeStyle = "#9FC3E0"; ctx.lineWidth = 6; ctx.lineCap = "round";
          for (let i = 0; i < 26; i++){ const rx = cx - 150 * sc + rnd(i) * 300 * sc, sp = 900, ry0 = cy + 40 * sc, len = st.y - ry0, yy = ry0 + ((t * sp + rnd(i + 9) * len) % len); ctx.beginPath(); ctx.moveTo(rx, yy); ctx.lineTo(rx - 6, yy + 34); ctx.stroke(); }
          for (let i = 0; i < 5; i++){ const q = ((t * 1.6 + i / 5) % 1); ctx.globalAlpha = (1 - q) * .6 * (1 - clr); ctx.strokeStyle = "#9FC3E0"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx - 120 + rnd(i + 2) * 240, st.y + 4, 20 + q * 60, 6 + q * 12, 0, 0, TAU); ctx.stroke(); }
          ctx.restore(); }
        // bolt
        const bq = t - tBt; if (bq > 0 && bq < .5 && clr <= 0){ ctx.save(); ctx.globalAlpha = 1 - bq / .5; ctx.fillStyle = "#FFE066"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); const bx = cx + 20, by = cy + 40 * sc;
          ctx.moveTo(bx, by); ctx.lineTo(bx - 40, by + 120); ctx.lineTo(bx - 5, by + 120); ctx.lineTo(bx - 35, by + 240); ctx.lineTo(bx + 45, by + 90); ctx.lineTo(bx + 5, by + 90); ctx.lineTo(bx + 30, by); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
        if (sc > .02){ const dark = clamp(.35 + .1 * Math.sin(t * 2), 0, 1); cloudShape(ctx, cx, cy, sc, `rgb(${lerp(120, 98, dark) | 0},${lerp(124, 102, dark) | 0},${lerp(140, 118, dark) | 0})`, "rgba(40,40,60,.25)"); }
        // sunshine when cleared
        if (clr > 0){ const g = clamp(clr * 1.4, 0, 1); ctx.save(); ctx.globalAlpha *= g; ctx.translate(cx, cy - 40); ctx.rotate(t * .4);
          for (let r = 0; r < 12; r++){ ctx.rotate(TAU / 12); ctx.fillStyle = r % 2 ? "rgba(255,226,150,.55)" : "rgba(255,240,200,.45)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -520); ctx.lineTo(40, -520); ctx.closePath(); ctx.fill(); }
          ctx.rotate(-t * .4); ctx.fillStyle = "#FFD66B"; ctx.beginPath(); ctx.arc(0, 0, 70 * eBack(clamp(clr * 1.5, 0, 1)), 0, TAU); ctx.fill(); ol(ctx, 6); ctx.restore(); }
      },
      screen: () => {
        const bq = t - tBt; if (bq > 0 && bq < .3 && t < tCl) over(() => { ctx.fillStyle = `rgba(255,250,230,${.6 * (1 - bq / .3)})`; ctx.fillRect(0, 0, 1080, 1920); });
        const dq = clamp((t - tFm) / 1, 0, 1) * (1 - clamp((t - tCl) / 1, 0, 1)); if (dq > 0) over(() => { ctx.fillStyle = `rgba(30,35,60,${.22 * dq})`; ctx.fillRect(0, 0, 1080, 1920); });
        const cq = t - tCl - .3; if (cq > 0 && cq < .9) over(() => { const p = CS.cam.toScreen(hp[0], hp[1] - 300); sparkles(ctx, p[0], p[1], cq, 12, 300); });
      }
    });
  }, (s, f, i, add) => { const C = f.cloud || {}; add(C.formCue ? cueT(s, C.formCue, .1, i) : (C.at ?? .2), "whoosh"); if (C.boltCue) add(cueT(s, C.boltCue, .5, i), "pop"); if (C.clearCue){ const T = cueT(s, C.clearCue, .7, i); add(T, "whoosh"); add(T + .3, "chime"); } });

  /* ---------- ca_angkat: weights ---------- */
  function barbell(ctx, x, y, plates, wob, col, txt){
    const pw = 26 + plates * 4, ph = 70 + plates * 34, len = 150 + plates * 60;
    ctx.save(); ctx.translate(x, y); ctx.rotate(wob || 0);
    rr(ctx, -len, -9, len * 2, 18, 9); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 5);
    [-1, 1].forEach(d => { for (let p = 0; p < plates; p++){ const px = d * (len - 30 - p * (pw + 6)); rr(ctx, px - pw / 2, -ph / 2 + p * 6, pw, ph - p * 12, 10); ctx.fillStyle = col || "#3B2418"; ctx.fill(); ol(ctx, 5); } });
    if (txt){ fitFont(ctx, txt, len * 1.3, 34, 20); const tw = ctx.measureText(txt).width + 28; rr(ctx, -tw / 2, -ph / 2 - 58, tw, 46, 10); ctx.fillStyle = CREAM; ctx.fill(); ol(ctx, 4); ctx.fillStyle = BROWN; ctx.textAlign = "center"; ctx.fillText(txt, 0, -ph / 2 - 24); ctx.textAlign = "left"; }
    ctx.restore();
  }
  reg("ca_angkat", "Cerita: angkat beban yang pas", (ctx, th, s, t) => {
    const f = s.f || {}, tL = at(s, f.lightCue, .35), tH = at(s, f.heavyCue, .55), tR = at(s, f.rightCue, .72), tG = f.liftCue ? at(s, f.liftCue, .9) : tR + (f.liftDelay ?? 1.4);
    const ph = t < tL ? 0 : t < tH ? 1 : t < tR ? 2 : 3;
    base(ctx, s, t, { env: "info", envOpt: { spotX: 540 },
      target: k => [540, k.y ?? 900, k.zoom || 1.3],
      back: () => {
        // rack with the unused weights
        ctx.fillStyle = "#4A3A48"; rr(ctx, 120, 1180, 840, 22, 10); ctx.fill(); ol(ctx, 4); [150, 930].forEach(x => { rr(ctx, x - 10, 1180, 20, 460, 8); ctx.fill(); ol(ctx, 4); });
        const pulse = 1 + .05 * Math.sin(t * 5);
        if (ph < 1) barbell(ctx, 270, 1140, 1, 0, "#7FA563", "RINGAN");
        if (ph < 2) barbell(ctx, 810, 1110, 4, 0, RED, "BERAT");
        if (ph < 3){ ctx.save(); if (ph === 0 && t > .4){ ctx.translate(540, 1130); ctx.scale(pulse, pulse); ctx.translate(-540, -1130); glowC(ctx, 540, 1130, 220, HL, .35); } barbell(ctx, 540, 1130, 2, 0, ORANGE, "PAS"); ctx.restore(); }
      },
      front: (c, sts) => {
        const st = sts[0]; if (!st) return; const k = st.size / 92, hx = st.x + 2 * k * st.face;
        if (ph === 1){ const y = st.y - 74 * k + Math.sin(t * 6) * 18; barbell(ctx, hx, y, 1, Math.sin(t * 3) * .05, "#7FA563"); }
        if (ph === 2){ const q = clamp((t - tH) / .35, 0, 1), y = lerp(-400, st.y - 74 * k, eIn2(q)), land = clamp((t - tH - .35) / .4, 0, 1);
          const yy = q < 1 ? y : lerp(st.y - 74 * k, GY - 60, eOut(land)); barbell(ctx, hx, yy, 4, q >= 1 ? .08 * (1 - land) : 0, RED);
          if (t > tH + .35 && t < tH + 1.2){ const dq = (t - tH - .75) / .8; if (dq > 0) for (let i = 0; i < 10; i++){ const a = Math.PI + i / 9 * Math.PI; ctx.globalAlpha = (1 - dq) * .6; ctx.fillStyle = "#C9B6A0"; ctx.beginPath(); ctx.arc(hx + Math.cos(a) * (120 + dq * 260), GY - 40 + Math.sin(a) * (30 + dq * 80), 26 * (1 - dq) + 8, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; } }
        if (ph === 3){ const lq = clamp((t - tR) / .3, 0, 1), up = eBack(clamp((t - tG) / .5, 0, 1)), shake = t < tG ? Math.sin(t * 40) * 4 : 0;
          const y = lerp(st.y - 47 * k, st.y - 76 * k, up) + shake + (1 - lq) * 200; barbell(ctx, hx + shake, y, 2, t < tG ? Math.sin(t * 9) * .04 : 0, ORANGE);
          if (t > tG){ const gq = t - tG; ctx.save(); ctx.globalAlpha = clamp(gq * 2, 0, 1) * .8; glowC(ctx, hx, st.y - 60 * k, 420, "#FFD9A0", .45); ctx.restore();
            // growth arrow
            const aq = eBack(clamp((gq - .2) / .5, 0, 1)); ctx.save(); ctx.translate(hx + 290, st.y - 70 * k - aq * 60); ctx.scale(aq, aq); ctx.fillStyle = "#2F8F4E"; ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(70, -30); ctx.lineTo(28, -30); ctx.lineTo(28, 90); ctx.lineTo(-28, 90); ctx.lineTo(-28, -30); ctx.lineTo(-70, -30); ctx.closePath(); ctx.fill(); ol(ctx, 6); ctx.restore(); } }
      },
      screen: () => { if (ph === 3 && t > tG && t < tG + .9) over(() => { const p = CS.cam.toScreen(540, 820); sparkles(ctx, p[0], p[1], t - tG, 14, 380); }); }
    });
  }, (s, f, i, add) => { const tL = cueT(s, f.lightCue, .35, i), tH = cueT(s, f.heavyCue, .55, i), tR = cueT(s, f.rightCue, .72, i); add(tL, "whoosh"); add(tH, "whoosh"); add(tH + .35, "pop"); add(tR, "pop"); add(f.liftCue ? cueT(s, f.liftCue, .9, i) : tR + (f.liftDelay ?? 1.4), "chime"); });
  function glowC(ctx, x, y, r, col, a){ const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  const eIn2 = x => x * x;

  /* ---------- ca_presentasi: board + audience ---------- */
  reg("ca_presentasi", "Cerita: presentasi + tepuk tangan", (ctx, th, s, t) => {
    const f = s.f || {}, Bd = Object.assign({ x: 720, y: 520, w: 560, h: 420, title: "Presentasi" }, f.board || {}), tC = f.clapCue ? at(s, f.clapCue, .6) : 1e9, tW = f.winCue ? at(s, f.winCue, .85) : 1e9, tB = f.barCue ? at(s, f.barCue, .3) : .3;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      target: k => [Bd.x, Bd.y + Bd.h / 2, k.zoom || 1.4],
      back: () => {
        const x0 = Bd.x - Bd.w / 2, y0 = Bd.y; ctx.fillStyle = "#3B2418"; [x0 + 60, x0 + Bd.w - 80].forEach(x => { rr(ctx, x, y0 + Bd.h - 20, 20, GY - y0 - Bd.h + 20, 6); ctx.fill(); });
        ctx.save(); ctx.shadowColor = "rgba(30,15,8,.3)"; ctx.shadowOffsetY = 14; rr(ctx, x0, y0, Bd.w, Bd.h, 18); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ctx.restore(); rr(ctx, x0, y0, Bd.w, Bd.h, 18); ol(ctx, 8);
        fitFont(ctx, Bd.title.toUpperCase(), Bd.w - 60, 40, 24); ctx.fillStyle = ORANGE; ctx.textAlign = "center"; ctx.fillText(Bd.title.toUpperCase(), Bd.x, y0 + 62); ctx.textAlign = "left";
        const bars = [.35, .5, .62, .9]; bars.forEach((v, k) => { const g = eBack(clamp((t - tB - k * .35) / .6, 0, 1)), h = 230 * v * g; rr(ctx, x0 + 70 + k * 115, y0 + Bd.h - 40 - h, 80, Math.max(2, h), 8); ctx.fillStyle = k === 3 ? ORANGE : "#E8B98A"; ctx.fill(); ol(ctx, 4); });
        ctx.strokeStyle = BROWN; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x0 + 50, y0 + Bd.h - 38); ctx.lineTo(x0 + Bd.w - 40, y0 + Bd.h - 38); ctx.stroke();
        if (t > tW){ const q = eBack(clamp((t - tW) / .4, 0, 1)); ctx.save(); ctx.translate(x0 + Bd.w - 60, y0 + 50); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.fillStyle = "#2F8F4E"; ctx.fill(); ol(ctx, 6); icon(ctx, "check", -30, -30, 60, "#fff", 3); ctx.restore(); }
      },
      front: () => {
        // audience heads (backs) in the foreground
        [[170, "#2B1A12", "short"], [540, "#3B2418", "hijab"], [900, "#2B1A12", "curly"]].forEach(([x, hc, h], k) => {
          const clap = t > tC, bob = clap ? Math.abs(Math.sin(t * 10 + k)) * 18 : Math.sin(t * 1.5 + k) * 4, y = 1700 - bob;
          ctx.fillStyle = ["#2F6F73", "#B5643C", "#5B7DB1"][k]; rr(ctx, x - 170, y - 40, 340, 400, 120); ctx.fill(); ol(ctx, 7);
          ctx.beginPath(); ctx.arc(x, y - 150, 120, 0, TAU); ctx.fillStyle = h === "hijab" ? ORANGE : hc; ctx.fill(); ol(ctx, 7);
          if (h === "curly"){ ctx.fillStyle = hc; for (let i = 0; i < 7; i++){ ctx.beginPath(); ctx.arc(x - 100 + i * 33, y - 240 + Math.abs(i - 3) * 14, 30, 0, TAU); ctx.fill(); } }
          if (clap){ const cq = Math.abs(Math.sin(t * 12 + k * 2)); [-1, 1].forEach(d => { ctx.save(); ctx.translate(x + d * (30 + cq * 30), y - 300); ctx.rotate(d * .3); ctx.beginPath(); ctx.ellipse(0, 0, 32, 46, 0, 0, TAU); ctx.fillStyle = "#E2A77C"; ctx.fill(); ol(ctx, 5); ctx.restore(); });
            ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.lineCap = "round"; for (let i = 0; i < 3; i++){ const a = -Math.PI / 2 + (i - 1) * .6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 90, y - 300 + Math.sin(a) * 90); ctx.lineTo(x + Math.cos(a) * (120 + cq * 20), y - 300 + Math.sin(a) * (120 + cq * 20)); ctx.stroke(); } } });
      },
      screen: () => { if (t > tC) over(() => { const n = 60; for (let i = 0; i < n; i++){ const T = tC + rnd(i) * 1.2, a = t - T; if (a < 0) continue; const x = rnd(i + 3) * 1080 + Math.sin(a * 3 + i) * 40, y = -40 + a * (380 + rnd(i + 5) * 260); if (y > 1960) continue;
          ctx.save(); ctx.translate(x, y); ctx.rotate(a * (4 + rnd(i) * 4)); ctx.fillStyle = [ORANGE, "#F6D36B", "#2F6F73", "#FFF4E6", RED][i % 5]; ctx.fillRect(-10, -6, 20, 12); ctx.restore(); } }); }
    });
  }, (s, f, i, add) => { if (f.clapCue){ const T = cueT(s, f.clapCue, .6, i); add(T, "chime"); for (let k = 0; k < 5; k++) add(T + .2 + k * .25, "pop"); } if (f.winCue) add(cueT(s, f.winCue, .85, i), "chime"); add(f.barCue ? cueT(s, f.barCue, .3, i) : .3, "whoosh"); });

  /* ---------- ca_kerja: hero behind a desk ---------- */
  reg("ca_kerja", "Cerita: kerja di meja (rutin / kebut)", (ctx, th, s, t) => {
    const f = s.f || {}, mode = f.mode || "kebut", t0 = f.startCue ? at(s, f.startCue, .1) : (f.start ?? .3), t1 = f.endCue ? at(s, f.endCue, .9) : 1e9, Bar = f.bar;
    const rate = mode === "rutin" ? 1.25 : .32, live = t > t0 && t < t1 + (mode === "rutin" ? 99 : 0);
    let dq = 0;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      target: k => [540, k.y ?? 1100, k.zoom || 1.3],
      back: () => {
        prop(ctx, "clock", f.clockX ?? 180, f.clockY ?? 600, { fast: mode === "rutin" || !!f.fastClock, s: .8 }, t);
        // done pile on the right (behind desk front)
      },
      front: (c, sts) => {
        const n = live ? Math.floor((Math.min(t, t1) - t0) / rate) : 0;
        prop(ctx, "desk", 540, GY, { laptop: mode !== "rutin", back: true, lx: -20, mug: true }, t);
        // pile of finished sheets (right)
        const pile = Math.min(18, n); for (let p = 0; p < pile; p++){ ctx.save(); ctx.translate(800 + Math.sin(p * 2.1) * 6, GY - 300 - p * 9); ctx.rotate(Math.sin(p * 1.7) * .05); ctx.fillStyle = p % 2 ? "#FFFDF8" : "#F3E6D2"; rr(ctx, -80, -8, 160, 14, 3); ctx.fill(); ol(ctx, 2.5); ctx.restore(); }
        if (live){ const ph = ((t - t0) % rate) / rate;
          if (mode === "rutin"){
            // paper slides in, stamp thumps, paper flies to the pile
            const px = ph < .3 ? lerp(240, 470, eOut(ph / .3)) : ph < .7 ? 470 : lerp(470, 800, eOut((ph - .7) / .3)), py = GY - 300 - (ph > .7 ? Math.sin((ph - .7) / .3 * Math.PI) * 120 : 0);
            ctx.save(); ctx.translate(px, py - 10); ctx.fillStyle = "#FFFDF8"; rr(ctx, -90, -14, 180, 22, 4); ctx.fill(); ol(ctx, 3); font(ctx, 800, 18, FAM); ctx.fillStyle = ORANGE; ctx.textAlign = "center"; ctx.fillText(f.paper || "LAPORAN", 0, 3); ctx.textAlign = "left"; ctx.restore();
            const sy = ph < .35 ? -190 : ph < .5 ? lerp(-190, -40, eIn2((ph - .35) / .15)) : lerp(-40, -190, eOut((ph - .5) / .3)); ctx.save(); ctx.translate(470, GY - 300 + Math.min(-30, sy));
            rr(ctx, -45, -16, 90, 22, 6); ctx.fillStyle = RED; ctx.fill(); ol(ctx, 4); rr(ctx, -14, -90, 28, 76, 10); ctx.fillStyle = "#8E4E2E"; ctx.fill(); ol(ctx, 4); ctx.beginPath(); ctx.arc(0, -100, 28, 0, TAU); ctx.fillStyle = "#A9643B"; ctx.fill(); ol(ctx, 4); ctx.restore();
            if (ph > .5 && ph < .62){ ctx.strokeStyle = CREAM; ctx.lineWidth = 6; for (let i = 0; i < 5; i++){ const a = Math.PI + i / 4 * Math.PI; ctx.beginPath(); ctx.moveTo(470 + Math.cos(a) * 70, GY - 310 + Math.sin(a) * 30); ctx.lineTo(470 + Math.cos(a) * 110, GY - 310 + Math.sin(a) * 50); ctx.stroke(); } }
          } else {
            // sheets fly out of the laptop to the pile, speed lines, typing marks
            for (let k = 0; k < 3; k++){ const q = (((t - t0) / rate + k / 3) % 1); const x = lerp(520, 800, q), y = GY - 470 - Math.sin(q * Math.PI) * 220 + q * 160; ctx.save(); ctx.translate(x, y); ctx.rotate(q * 4); ctx.fillStyle = "#FFFDF8"; rr(ctx, -50, -36, 100, 72, 6); ctx.fill(); ol(ctx, 3);
              ctx.fillStyle = "#E8B98A"; for (let l = 0; l < 3; l++) ctx.fillRect(-36, -20 + l * 16, 72 - l * 14, 6); ctx.restore(); }
            font(ctx, 800, 34, FAM); ctx.fillStyle = BROWN; for (let k = 0; k < 4; k++){ const q = ((t * 2.6 + k / 4) % 1); ctx.globalAlpha = 1 - q; ctx.fillText(k % 2 ? "tik" : "tak", 330 + rnd(k + Math.floor(t * 2.6)) * 420, GY - 520 - q * 120); } ctx.globalAlpha = 1;
          } }
        dq = n;
      },
      screen: () => {
        if (mode === "kebut" && live){ over(() => { ctx.save(); ctx.strokeStyle = "rgba(255,244,230,.55)"; ctx.lineWidth = 5; for (let i = 0; i < 14; i++){ const a = i / 14 * TAU + .1, r0 = 520 + ((t * 700 + i * 90) % 300); ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0 * 1.4); ctx.lineTo(540 + Math.cos(a) * (r0 + 140), 960 + Math.sin(a) * (r0 + 140) * 1.4); ctx.stroke(); } ctx.restore(); }); }
        if (Bar && t > t0){ over(() => { const q = eBack(clamp((t - t0) / .4, 0, 1)), v = (Bar.to ?? .9) * eOut(clamp((t - t0) / Math.max(.5, (Bar.endCue ? at(s, Bar.endCue, .9) : t1) - t0), 0, 1)), x0 = 140, y0 = 230, w = 800;
          ctx.save(); ctx.translate(540, y0 + 70); ctx.scale(q, q); ctx.translate(-540, -(y0 + 70)); rr(ctx, x0, y0, w, 150, 26); ctx.fillStyle = "#13223D"; ctx.fill(); ctx.strokeStyle = "#2E4670"; ctx.lineWidth = 5; ctx.stroke();
          font(ctx, 800, 40, FAM); ctx.fillStyle = "#fff"; ctx.fillText((Bar.label || "Progres").toUpperCase(), x0 + 36, y0 + 58); ctx.fillStyle = HL; ctx.textAlign = "right"; ctx.fillText(Math.round(v * 100) + "%", x0 + w - 36, y0 + 58); ctx.textAlign = "left";
          rr(ctx, x0 + 36, y0 + 84, w - 72, 36, 18); ctx.fillStyle = "#24365A"; ctx.fill(); rr(ctx, x0 + 36, y0 + 84, Math.max(36, (w - 72) * v), 36, 18); ctx.fillStyle = HL; ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 8; i++){ const sx = x0 + 36 + ((t * 160 + i * 60) % Math.max(40, (w - 72) * v)); ctx.fillRect(sx, y0 + 88, 14, 28); } ctx.restore(); }); }
      }
    });
  }, (s, f, i, add) => { const t0 = f.startCue ? cueT(s, f.startCue, .1, i) : (f.start ?? .3); if ((f.mode || "kebut") === "rutin"){ for (let k = 0; k < 10; k++) add(t0 + 1.25 * k + .6, "pop"); } else { add(t0, "whoosh"); for (let k = 0; k < 8; k++) add(t0 + .5 + k * .6, "pop"); } });

  /* ---------- ca_gunung: giant task mountain ---------- */
  reg("ca_gunung", "Cerita: gunung tugas", (ctx, th, s, t) => {
    const f = s.f || {}, M = Object.assign({ label: "LAPORAN", x: 600 }, f.mountain || {}), G0 = (M.grow || []).map((c, k) => at(s, c, .5 + k * .2));
    let H = 820; G0.forEach(T => { H += 260 * eBack(clamp((t - T) / .6, 0, 1)); });
    base(ctx, s, t, { env: "sky", envOpt: { time: f.time || "day", hills: true },
      target: k => [M.x, GY - H * (k.fy ?? .55), k.zoom || .9],
      back: () => {
        const x = M.x, base0 = GY + 10, w = H * 1.05, rum = G0.some(T => t > T && t < T + .6) ? Math.sin(t * 60) * 6 : 0;
        ctx.save(); ctx.translate(rum, 0);
        ctx.beginPath(); ctx.moveTo(x - w, base0); ctx.lineTo(x - w * .35, base0 - H * .62); ctx.lineTo(x - w * .18, base0 - H * .55); ctx.lineTo(x, base0 - H); ctx.lineTo(x + w * .22, base0 - H * .66); ctx.lineTo(x + w * .4, base0 - H * .72); ctx.lineTo(x + w, base0); ctx.closePath();
        ctx.fillStyle = "#8C6A4C"; ctx.fill(); ol(ctx, 8);
        ctx.beginPath(); ctx.moveTo(x, base0 - H); ctx.lineTo(x + w * .22, base0 - H * .66); ctx.lineTo(x + w * .4, base0 - H * .72); ctx.lineTo(x + w, base0); ctx.lineTo(x + w * .1, base0); ctx.closePath(); ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, base0 - H); ctx.lineTo(x - w * .12, base0 - H * .8); ctx.lineTo(x - w * .04, base0 - H * .84); ctx.lineTo(x + w * .03, base0 - H * .78); ctx.lineTo(x + w * .11, base0 - H * .83); ctx.closePath(); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 6);
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, base0 - H); ctx.lineTo(x, base0 - H - 90); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x, base0 - H - 90); ctx.quadraticCurveTo(x + 40, base0 - H - 80 + Math.sin(t * 6) * 8, x + 70, base0 - H - 72); ctx.lineTo(x, base0 - H - 50); ctx.closePath(); ctx.fill(); ol(ctx, 4);
        // big label painted on the mountain
        const ly = base0 - H * .36; let z = Math.min(130, H * .12); font(ctx, 800, z, FAM); while (ctx.measureText(M.label).width > w * .9 && z > 50){ z -= 6; font(ctx, 800, z, FAM); }
        ctx.save(); ctx.translate(x, ly); ctx.rotate(-.04); ctx.lineJoin = "round"; ctx.textAlign = "center"; ctx.strokeStyle = OUT; ctx.lineWidth = z * .2; ctx.strokeText(M.label, 0, 0); ctx.fillStyle = CREAM; ctx.fillText(M.label, 0, 0); ctx.textAlign = "left"; ctx.restore();
        // rocks tumbling after each growth
        G0.forEach((T, g) => { for (let i = 0; i < 5; i++){ const a = t - T - i * .12; if (a < 0 || a > 1.6) continue; const sx = x + (i % 2 ? 1 : -1) * (60 + i * 30), sy = base0 - H * .8 + a * a * 900, px = sx + (i % 2 ? 1 : -1) * a * 260; if (sy > GY - 20) continue;
          ctx.save(); ctx.translate(px, sy); ctx.rotate(a * 8); ctx.beginPath(); ctx.ellipse(0, 0, 30 + i * 4, 24 + i * 3, 0, 0, TAU); ctx.fillStyle = "#6E5A4A"; ctx.fill(); ol(ctx, 4); ctx.restore(); } });
        ctx.restore();
      },
      screen: () => { G0.forEach(T => { const a = t - T; if (a > 0 && a < .6) over(() => { ctx.fillStyle = `rgba(255,244,230,${.25 * (1 - a / .6)})`; ctx.fillRect(0, 0, 1080, 1920); }); }); }
    });
  }, (s, f, i, add) => { ((f.mountain || {}).grow || []).forEach((c, k) => { const T = cueT(s, c, .5 + k * .2, i); add(T, "whoosh"); add(T + .3, "pop"); }); });

  /* ---------- ca_jam: giant kitchen timer ---------- */
  reg("ca_jam", "Cerita: pengatur waktu raksasa", (ctx, th, s, t) => {
    const f = s.f || {}, Tm = Object.assign({ x: 540, y: 600, r: 220, minutes: 5 }, f.timer || {}), tIn = Tm.inCue ? at(s, Tm.inCue, .1) : (Tm.at ?? .3), tSet = at(s, Tm.setCue, .35), tGo = Tm.startCue ? at(s, Tm.startCue, .6) : tSet + 1.5;
    base(ctx, s, t, { env: "office", envOpt: { desk: false },
      target: k => [Tm.x, Tm.y, k.zoom || 1.5],
      mid: () => {
        const q = popQ(t, tIn, .5); if (q <= 0) return; const set = eOut(clamp((t - tSet) / .9, 0, 1)), m = Tm.minutes, frac = m / 60;
        const run = t > tGo ? (t - tGo) : 0, remain = Math.max(0, m * 60 - run * 9), wedge = frac * set * (remain / (m * 60));
        ctx.save(); ctx.translate(Tm.x, Tm.y + Math.sin(t * 1.8) * 8); ctx.rotate(Math.sin(t * 1.3) * .03 + (t > tGo ? Math.sin(t * 30) * .006 : 0)); ctx.scale(q, q);
        const R = Tm.r; ctx.save(); ctx.shadowColor = "rgba(30,15,8,.35)"; ctx.shadowOffsetY = 16; ctx.beginPath(); ctx.arc(0, 0, R + 30, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.arc(0, 0, R + 30, 0, TAU); ol(ctx, 8);
        rr(ctx, -40, -R - 80, 80, 60, 14); ctx.fillStyle = "#8A8580"; ctx.fill(); ol(ctx, 6);
        ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill(); ol(ctx, 6);
        if (wedge > 0){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R - 10, -Math.PI / 2, -Math.PI / 2 + wedge * TAU); ctx.closePath(); ctx.fillStyle = hexA(HL, .85); ctx.fill(); }
        for (let i = 0; i < 60; i++){ const a = i / 60 * TAU - Math.PI / 2, L = i % 5 ? 14 : 30; ctx.strokeStyle = BROWN; ctx.lineWidth = i % 5 ? 3 : 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * (R - 14), Math.sin(a) * (R - 14)); ctx.lineTo(Math.cos(a) * (R - 14 - L), Math.sin(a) * (R - 14 - L)); ctx.stroke(); }
        const ha = -Math.PI / 2 + (t > tGo ? run * 1.2 : wedge * TAU); ctx.strokeStyle = OUT; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ha) * (R - 50), Math.sin(ha) * (R - 50)); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fillStyle = OUT; ctx.fill();
        const mm = Math.floor(remain / 60), ss = Math.floor(remain % 60), txt = set > .05 ? `${mm}:${String(ss).padStart(2, "0")}` : "0:00";
        rr(ctx, -110, R * .3, 220, 84, 16); ctx.fillStyle = "#13223D"; ctx.fill(); ol(ctx, 5); font(ctx, 800, 60, FAM); ctx.fillStyle = HL; ctx.textAlign = "center"; ctx.fillText(txt, 0, R * .3 + 63); ctx.textAlign = "left";
        if (t > tGo && (t * 2) % 1 < .5){ ctx.strokeStyle = HL; ctx.lineWidth = 6; ctx.lineCap = "round"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * (R + 50), -R * .6); ctx.lineTo(d * (R + 90), -R * .8); ctx.moveTo(d * (R + 60), -R * .3); ctx.lineTo(d * (R + 105), -R * .3); ctx.stroke(); }); }
        ctx.restore();
      },
      screen: () => { const a = t - tSet - .9; if (a > 0 && a < .9) over(() => { const p = CS.cam.toScreen(Tm.x, Tm.y); sparkles(ctx, p[0], p[1], a, 12, 320); }); }
    });
  }, (s, f, i, add) => { const Tm = f.timer || {}; add(Tm.inCue ? cueT(s, Tm.inCue, .1, i) : (Tm.at ?? .3), "whoosh"); const T = cueT(s, Tm.setCue, .35, i); add(T, "pop"); add(T + .9, "chime"); });
})();
