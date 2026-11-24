/* Scene pack cerita_demo: example scenes for MODE CERITA ("motion": {"mode": "cerita"}).
   Shows the cerita toolkit: TT.scene (register a full-screen story scene), TT.cam (camera keys), TT.env /
   TT.envFront (full-screen environments), TT.toon (toon characters), TT.prop, TT.infoCard, TT.titleStamp.
     cd_kantor  office: a toon next to a desk where a tower of small tasks grows, wobbles and collapses (title stamp, push-ins, shake)
     cd_info    dark navy documentary room: info cards with bars and a big word while a toon reacts
     cd_malam   wooden home at night: toon + child, close-up laugh, small cream info cards for finished tasks
   The generic data-driven scene "cerita" (in motion-tangani.js) covers most stories without a pack. */
(() => {
  'use strict';
  if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, G } = TT;
  const at = (s, c, fr) => cueT(s, c, fr);
  const RAKA = { hair: "short", shirt: "#2F6F73", tie: "#C2691F", pants: "#3B2418", skin: "d", idcard: "#C2691F" };
  const NOTE = ["#F6D36B", "#F4A85C", "#FFF4E6", "#E8B98A", "#F6D36B", "#F4A85C", "#FFF4E6", "#E8B98A", "#F6D36B"];
  const keysOf = (s, keys) => (keys || []).map(k => k);

  /* office: tower of small tasks on the desk */
  TT.scene("cd_kantor", "Cerita: tumpukan tugas (kantor)", (ctx, th, s, t) => {
    const f = s.f || {}, gy = 1640, deskX = 760, top0 = gy - 40 - 290;
    const hero = Object.assign({ x: 380, size: 760, face: 1 }, RAKA, f.hero || {});
    const tA = at(s, f.startCue, .15), tC = at(s, f.fallCue, .8), labels = f.labels || ["Email", "Revisi", "Telepon", "Laporan", "Faktur", "Rapat", "Data", "Arsip"];
    const n = t < tA ? 0 : Math.min(labels.length, 1 + Math.floor((t - tA) / Math.max(.3, (tC - .4 - tA)) * (labels.length - 1)));
    const st = toonState(hero, s, t);
    const resolve = (on, tt, k) => { const hp = toonHead(st); return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? 40), k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null]; };
    const c = cam(s, t, f.cam || [
      { at: 0, x: 560, y: 1080, zoom: 1.12 },
      { cue: f.pushCue, on: 0, fit: .5, dur: 1.2 },
      { cue: f.wideCue, x: 600, y: 1000, zoom: 1, dur: .8 },
      { at: tC, shake: 34, x: 620, y: 1040, zoom: 1.05, dur: .2 },
      { at: tC + .55, cut: true, on: 0, fit: .62 },
    ], { resolve });
    env(ctx, "office", t, c, { desk: true, deskX, rugX: 520 });
    // tower of notes on the desk (world space)
    ctx.save(); c.apply(ctx);
    const wob = n > 3 && t < tC ? Math.sin(t * (4 + n)) * .012 * (n - 2) : 0;
    for (let i = 0; i < n; i++){
      const ti = tA + i * (tC - .4 - tA) / Math.max(1, labels.length - 1), q = clamp((t - ti) / .35, 0, 1), drop = (1 - eOut(q)) * -260;
      let x = deskX + 40 + Math.sin(i * 1.7) * 14, y = top0 - 23 - i * 46 + drop, rot = Math.sin(i * 2.3) * .05;
      if (t > tC){ const d = t - tC, vx = -180 - i * 75, vy = -260 - (i % 3) * 120; x += vx * d; y = Math.min(gy - 20, y + vy * d + 1500 * d * d); rot += d * (3 + i) * (i % 2 ? 1 : -1) * (y >= gy - 21 ? .2 : 1); }
      else { x += Math.sin(wob * 30) * i * 6; rot += wob * i; }
      const sq = q < 1 ? 1 + .15 * Math.sin(q * Math.PI) : 1;
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1 / sq, sq);
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(-82, -16, 170, 46);
      ctx.fillStyle = NOTE[i % NOTE.length]; ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-86, -23, 172, 46, 6); ctx.fill(); ctx.stroke();
      font(ctx, 800, 26, "Poppins"); ctx.fillStyle = "#3B2418"; ctx.textAlign = "center"; ctx.fillText(labels[i].toUpperCase(), 0, 10); ctx.textAlign = "left"; ctx.restore();
    }
    ctx.restore();
    toon(ctx, c, hero, s, t, { st });
    if (f.stamp) titleStamp(ctx, f.stamp, t);
  }, (s, f, i, add) => {
    const tA = cueT(s, f.startCue, .15, i), tC = cueT(s, f.fallCue, .8, i), L = (f.labels || [1, 2, 3, 4, 5, 6, 7, 8]).length;
    for (let k = 0; k < L; k++) add(tA + k * (tC - .4 - tA) / Math.max(1, L - 1), "pop");
    add(tC, "whoosh"); add(tC + .05, "ping"); if (f.stamp) add((f.stamp.at ?? .15) + .2, "chime");
  });

  /* dark navy documentary room with info cards */
  TT.scene("cd_info", "Cerita: ruang infografis", (ctx, th, s, t) => {
    const f = s.f || {}, hero = Object.assign({ x: 250, size: 640, face: 1 }, RAKA, f.hero || {});
    const c = cam(s, t, f.cam || [{ at: 0, x: 470, y: 980, zoom: 1.08 }, { at: 1.2, x: 600, y: 960, zoom: 1, dur: 3 }, { cue: f.zoomCue, on: 0, fit: .55, dur: .8 }], { resolve: (on, tt, k) => { const st = toonState(hero, s, tt), hp = toonHead(st); return [hp[0] + 60, hp[1] - 90, k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null]; } });
    env(ctx, "info", t, c, { spotX: 300 });
    toon(ctx, c, hero, s, t);
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({ x: 600, y: 470 + j * 40, w: 720 }, cd, { T: at(s, cd.cue, .15 + j * .35), outT: cd.outCue ? at(s, cd.outCue, .9) : 1e9 }), t));
  }, (s, f, i, add) => { (f.cards || []).forEach((cd, j) => add(cueT(s, cd.cue, .15 + j * .35, i), "pop")); (f.hero && f.hero.keys || []).forEach((k, j) => { if (k.expr === "shock") add(k.at ?? cueT(s, k.cue, .5, i), "ping"); }); });

  /* wooden home at night: toon + child */
  TT.scene("cd_malam", "Cerita: rumah malam", (ctx, th, s, t) => {
    const f = s.f || {}, hero = Object.assign({ x: 430, size: 760, face: 1 }, RAKA, f.hero || {}), kid = Object.assign({ x: 760, size: 470, face: -1, hair: "bun", shirt: "#E8A55B", skin: "d", collar: false }, f.kid || {});
    const st = toonState(hero, s, t);
    const c = cam(s, t, f.cam || [{ at: 0, x: 560, y: 1060, zoom: 1.1 }, { cue: f.closeCue, on: 0, fit: .58, dur: .9 }, { cue: f.wideCue, cut: true, x: 560, y: 1000, zoom: 1 }],
      { resolve: (on, tt, k) => { const hp = toonHead(st); return [hp[0], hp[1] + 10, k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null]; } });
    env(ctx, "home", t, c, { lampX: 560 });
    ctx.save(); c.apply(ctx); prop(ctx, "sofa", 520, 1600, { s: 1.05, color: "#A0522D" }); ctx.restore();
    toon(ctx, c, hero, s, t, { st }); toon(ctx, c, kid, s, t);
    (f.done || []).forEach((d, j) => infoCard(ctx, { style: "cream", x: 540, y: 250 + j * 175, w: 600, tag: d.tag || "SELESAI", tagColor: "yellow", label: d.label, T: at(s, d.cue, .2 + j * .2), outT: at(s, f.wideCue, .7) - .1, rot: j % 2 ? 1.5 : -1.5 }, t));
  }, (s, f, i, add) => { (f.done || []).forEach((d, j) => add(cueT(s, d.cue, .2 + j * .2, i), "chime")); if (f.wideCue) add(cueT(s, f.wideCue, .7, i), "whoosh"); });
})();
