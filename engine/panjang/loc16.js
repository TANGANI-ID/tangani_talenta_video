/* STORY16 locations (16:9). World: 1920 wide, actors stand on y = 1000 (S.GY); wall/floor seam ~ y 700-760.
   Each location: {bg(ctx, cam, t, opt), mid?, front?, bounds:[x0,x1,y0,y1], grade:{warm, vig}, def:{default opt}}.
   Every location has ambient motion (dust, lamps, clouds, clock hands, traffic, screen glow...). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, { LOC, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer, eIn } = S;
  const U = S.U = {};

  /* ---------- shared pieces ---------- */
  U.panel = (ctx, x, y, w, h, r, fill, lw, stroke) => { rr(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); if (lw){ ctx.strokeStyle = stroke || OUT; ctx.lineWidth = lw; ctx.stroke(); } };
  U.motes = (ctx, t, n, seed, x0, y0, w, h, col, a) => { for (let i = 0; i < n; i++){ const x = x0 + ((rnd(seed + i) * w + Math.sin(t * .4 + i) * 30 + t * 9) % w), y = y0 + ((rnd(seed + i + 7) * h - t * (10 + rnd(i) * 14)) % h + h) % h;
    ctx.globalAlpha = a * (.4 + .6 * Math.abs(Math.sin(t * 1.3 + i))); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 2.5 + rnd(seed + i + 3) * 3.5, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; };
  U.puff = (ctx, x, y, s, col) => { ctx.fillStyle = col; ctx.beginPath(); [[0, 0, 1], [.9, -.45, 1.2], [2, -.15, 1], [2.8, .2, .75], [1.2, .3, 1], [-.7, .3, .7]].forEach(([dx, dy, r]) => { ctx.moveTo(x + dx * 60 * s + r * 55 * s, y + dy * 60 * s); ctx.arc(x + dx * 60 * s, y + dy * 60 * s, r * 55 * s, 0, TAU); }); ctx.fill(); };
  const SKY = { pagi: [[0, "#9CCFE0"], [.6, "#CFE6E4"], [1, "#FBE6C6"]], siang: [[0, "#86BFD3"], [.6, "#BFDDDF"], [1, "#F7E2C2"]],
    sore: [[0, "#E7A06F"], [.5, "#F3C18B"], [1, "#FBE0B5"]], senja: [[0, "#5E4C7E"], [.45, "#D3826F"], [1, "#F6C98C"]], malam: [[0, "#0E1330"], [.6, "#25244A"], [1, "#4E3446"]] };
  U.sky = (ctx, x, y, w, h, time, t, seed) => { ctx.fillStyle = lg(ctx, 0, y, 0, y + h, SKY[time] || SKY.siang); ctx.fillRect(x, y, w, h);
    if (time === "malam"){ for (let i = 0; i < 40; i++){ ctx.globalAlpha = .3 + .6 * Math.abs(Math.sin(t * (1 + rnd(i)) + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(x + rnd(i + seed) * w, y + rnd(i + 50 + seed) * h * .55, 1.8, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
    else for (let k = 0; k < 3; k++){ const cx = x + ((t * (8 + k * 4) + rnd(seed + k) * w * 2) % (w + 400)) - 200; U.puff(ctx, cx, y + 60 + k * 70 + rnd(k + seed) * 40, .45 + rnd(k) * .25, time === "senja" || time === "sore" ? "rgba(255,226,200,.85)" : "rgba(255,255,255,.88)"); } };
  // skyline inside a window/backdrop; lit windows at night/dusk
  U.skyline = (ctx, x, y0, w, base, time, t, seed, scale) => {
    const night = time === "malam" || time === "senja", s = scale || 1;
    for (let b = 0; b < Math.ceil(w / (70 * s)) + 1; b++){ const bx = x + b * 70 * s - 20, bh = (120 + rnd(b + seed) * 240) * s;
      ctx.fillStyle = night ? (b % 2 ? "#2A2742" : "#332E4C") : (b % 2 ? "#C9C2B4" : "#D8CDB9"); ctx.fillRect(bx, base - bh, 62 * s, bh);
      for (let wy = base - bh + 14 * s; wy < base - 12; wy += 28 * s) for (let wx = bx + 8 * s; wx < bx + 52 * s; wx += 18 * s){ const r = rnd(wx * 3.1 + wy * 1.7);
        if (night){ if (r > .5){ ctx.fillStyle = Math.sin(t * (.4 + r) + r * 40) > -.7 ? "rgba(246,196,122,.9)" : "rgba(246,196,122,.25)"; ctx.fillRect(wx, wy, 9 * s, 13 * s); } }
        else if (r > .3){ ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(wx, wy, 9 * s, 13 * s); } } } };
  U.window = (ctx, x, y, w, h, time, t, seed, o) => { o = o || {};
    ctx.save(); rr(ctx, x, y, w, h, 10); ctx.clip(); U.sky(ctx, x, y, w, h, time, t, seed); U.skyline(ctx, x, y, w, y + h, time, t, seed, o.cityScale || 1);
    if (time !== "malam"){ ctx.fillStyle = lg(ctx, x, y, x + w, y + h, [[0, "rgba(255,255,255,.25)"], [.5, "rgba(255,255,255,0)"], [1, "rgba(255,255,255,.12)"]]); ctx.fillRect(x, y, w, h); }
    if (o.blinds){ for (let k = 0; k < o.blinds; k++){ ctx.fillStyle = "rgba(240,228,210,.92)"; ctx.fillRect(x, y + k * 26, w, 16); } }
    ctx.restore(); rr(ctx, x, y, w, h, 10); ctx.strokeStyle = o.frame || "#FFF6EA"; ctx.lineWidth = 18; ctx.stroke();
    ctx.lineWidth = 10; ctx.beginPath(); for (let k = 1; k < (o.cols || 2); k++){ ctx.moveTo(x + w * k / (o.cols || 2), y); ctx.lineTo(x + w * k / (o.cols || 2), y + h); } ctx.moveTo(x, y + h * .42); ctx.lineTo(x + w, y + h * .42); ctx.stroke();
    ctx.fillStyle = "#EBD5BB"; rr(ctx, x - 24, y + h + 4, w + 48, 22, 7); ctx.fill(); };
  U.lamp = (ctx, x, y0, len, t, i, night, col) => { const sw = Math.sin(t * .9 + i * 2) * .025; ctx.save(); ctx.translate(x, y0); ctx.rotate(sw);
    ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
    glow(ctx, 0, len + 60, night ? 380 : 220, "#FFD9A0", night ? .5 : .28);
    ctx.fillStyle = col || (i % 2 ? ORANGE : BROWN); ctx.beginPath(); ctx.moveTo(-22, len); ctx.lineTo(22, len); ctx.lineTo(60, len + 62); ctx.lineTo(-60, len + 62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.ellipse(0, len + 64, 26, 9, 0, 0, TAU); ctx.fill(); ctx.restore(); };
  U.floor = (ctx, y0, cols, lines, t) => { ctx.fillStyle = lg(ctx, 0, y0, 0, y0 + 600, cols); ctx.fillRect(-4000, y0, 10000, 3000);
    ctx.fillStyle = "rgba(59,36,24,.25)"; ctx.fillRect(-4000, y0, 10000, 10);
    if (lines !== false){ ctx.strokeStyle = "rgba(59,36,24,.11)"; ctx.lineWidth = 3; for (let y = y0 + 34, k = 0; y < y0 + 900; y += 30 + k * 9, k++){ ctx.beginPath(); ctx.moveTo(-4000, y); ctx.lineTo(6000, y); ctx.stroke(); }
      for (let k = -30; k < 30; k++){ ctx.beginPath(); ctx.moveTo(960 + k * 160, y0); ctx.lineTo(960 + k * 420, y0 + 900); ctx.stroke(); } } };
  U.baseboard = (ctx, y, col) => { ctx.fillStyle = col || "#B98152"; ctx.fillRect(-4000, y - 26, 10000, 26); ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.fillRect(-4000, y - 26, 10000, 5); };
  // wall clock: h, m in hours/minutes (floats ok), sec = seconds hand angle source (ticks), o.fast spins
  U.clock = (ctx, x, y, r, h, m, sec, o) => { o = o || {};
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.beginPath(); ctx.arc(6, 10, r + 6, 0, TAU); ctx.fill();
    ctx.fillStyle = o.rim || BROWN; ctx.beginPath(); ctx.arc(0, 0, r + 8, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFF8EC"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = BROWN; ctx.lineCap = "round"; for (let i = 0; i < 12; i++){ const a = i / 12 * TAU, L = i % 3 ? .1 : .18; ctx.lineWidth = i % 3 ? r * .03 : r * .055; ctx.beginPath(); ctx.moveTo(Math.sin(a) * r * .9, -Math.cos(a) * r * .9); ctx.lineTo(Math.sin(a) * r * (.9 - L), -Math.cos(a) * r * (.9 - L)); ctx.stroke(); }
    if (o.nums !== false && r > 50){ font(ctx, 800, r * .2, S.FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; [[12, 0], [3, 1], [6, 2], [9, 3]].forEach(([n, k]) => { const a = k * TAU / 4; ctx.fillText(n, Math.sin(a) * r * .6, -Math.cos(a) * r * .6 + r * .07); }); ctx.textAlign = "left"; }
    const ha = ((h % 12) + m / 60) / 12 * TAU, ma = (m / 60) * TAU;
    ctx.strokeStyle = BROWN; ctx.lineWidth = r * .085; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ha) * r * .5, -Math.cos(ha) * r * .5); ctx.stroke();
    ctx.lineWidth = r * .06; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(ma) * r * .76, -Math.cos(ma) * r * .76); ctx.stroke();
    if (sec != null){ const sa = sec / 60 * TAU; ctx.strokeStyle = ORANGE; ctx.lineWidth = r * .025; ctx.beginPath(); ctx.moveTo(-Math.sin(sa) * r * .15, Math.cos(sa) * r * .15); ctx.lineTo(Math.sin(sa) * r * .84, -Math.cos(sa) * r * .84); ctx.stroke(); }
    ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(0, 0, r * .07, 0, TAU); ctx.fill();
    if (o.glare !== false){ ctx.fillStyle = "rgba(255,255,255,.22)"; ctx.beginPath(); ctx.arc(-r * .25, -r * .3, r * .55, Math.PI * 1.1, Math.PI * 1.6); ctx.lineTo(0, 0); ctx.fill(); }
    ctx.restore(); };
  U.tick = t => { const s = Math.floor(t), f = t - s; return s + Math.min(1, f / .08); };   // ticking seconds
  U.parseClock = (str, t, o) => { o = o || {}; const [hh, mm] = String(str || "09:00").split(/[:.]/).map(Number); const sec = U.tick(t + (o.sec0 || 0));
    let m = mm + (o.rate ? t * o.rate * 60 : sec / 60); return { h: hh + Math.floor(m / 60), m: ((m % 60) + 60) % 60, s: o.rate ? (t * 60 * 8) % 60 : sec % 60 }; };
  U.plant = (ctx, x, y, s, t, col) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let k = 0; k < 9; k++){ ctx.save(); ctx.translate(0, -100); ctx.rotate(-1.3 + k * .33 + Math.sin(t * 1.2 + k) * .05); ctx.fillStyle = k % 2 ? "#3E7D4F" : "#4F8F5C"; ctx.beginPath(); ctx.ellipse(0, -70, 20, 72, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = col || ORANGE; ctx.beginPath(); ctx.moveTo(-52, -110); ctx.lineTo(52, -110); ctx.lineTo(40, 0); ctx.lineTo(-40, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); };
  // background coworker (small toon) seated behind a monitor desk
  U.bgDesk = (ctx, x, y, s, t, who, i) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(43,26,18,.18)"; ctx.beginPath(); ctx.ellipse(0, 4, 210, 16, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (who){ const k = .55 * s; const a = Object.assign({ size: 330 * s / .55 * .55, x: x - 10 * s, y: y, face: 1, seed: i * 3.3 }, who, { keys: [{ at: 0, pose: "sit" }] });
      const st = TT.toonState(a, null, t); st.talk = false; st.look = [.7, .3]; TT.drawToon(ctx, a, st, t + i * 1.7); }
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "#8E4E2E"; [-180, 168].forEach(dx => { ctx.fillRect(dx, -190, 14, 190); });
    ctx.fillStyle = "#C47A48"; rr(ctx, -200, -210, 400, 26, 8); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#3D3A40"; rr(ctx, 40, -350, 170, 118, 10); ctx.fill(); ctx.stroke(); ctx.fillRect(116, -232, 18, 24);
    ctx.fillStyle = "#9FD3E0"; ctx.globalAlpha = .55 + .15 * Math.sin(t * 2 + i); rr(ctx, 50, -340, 150, 98, 6); ctx.fill(); ctx.globalAlpha = 1;
    ctx.restore(); };

  /* ---------- 1. ruang rapat "Melati" ---------- */
  // opt: slide ("cover"|"sinta"|"none"|"proyek"|"logo"), clock "08:05", rows (draw table front), people handled as actors
  LOC.rapat = { bounds: [-260, 2180, -200, 1300], grade: { warm: .12, vig: .42 }, def: { clock: "08:05", slide: "cover" },
    bg(ctx, c, t, o){
      layer(ctx, c, .35, () => {
        fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#E9CFAE"], [1, "#DDB68C"]]));
        ctx.fillStyle = "#C99568"; ctx.fillRect(-1000, 470, 4000, 300);              // wood wainscot
        ctx.strokeStyle = "rgba(59,36,24,.14)"; ctx.lineWidth = 3; for (let x = -1000; x < 3000; x += 120){ ctx.beginPath(); ctx.moveTo(x, 476); ctx.lineTo(x, 770); ctx.stroke(); }
        ctx.fillStyle = "#A9744B"; ctx.fillRect(-1000, 462, 4000, 16);
        // window with blinds on the right
        U.window(ctx, 1640, 90, 420, 330, "pagi", t, 7, { blinds: 4, cols: 2 });
        // name plaque
        U.panel(ctx, -150, 120, 260, 70, 12, "#3B2418", 0); S.text(ctx, "MELATI", -20, 168, 34, { align: "center", col: "#F6D9AE", track: 6 });
        U.plant(ctx, 1500, 772, .8, t, "#2F6F73");
      });
      // presentation screen (projected) + projector beam
      layer(ctx, c, .55, () => {
        const x = 380, y = 70, w = 760, h = 430;
        ctx.fillStyle = "#2B1A12"; ctx.fillRect(x - 20, y - 26, w + 40, 22); U.panel(ctx, x, y, w, h, 8, "#FFFDF7", 6, "#3B2418");
        if (S.FX.slide) S.FX.slide.paint(ctx, x, y, w, h, t, o);
        ctx.save(); ctx.globalAlpha = .1 + .03 * Math.sin(t * 7); ctx.fillStyle = "#FFF6D8"; ctx.beginPath(); ctx.moveTo(x + w * .5, y + h * .5); ctx.lineTo(1330, -200); ctx.lineTo(1420, -200); ctx.closePath(); ctx.fill(); ctx.restore();
        const cl = U.parseClock(o.clock, t, { rate: o.clockRate }); U.clock(ctx, 1380, 250, 110, cl.h, cl.m, cl.s);
      });
      layer(ctx, c, .8, () => { U.floor(ctx, 770, [[0, "#B9875D"], [1, "#9C6B45"]], true, t); U.baseboard(ctx, 772, "#8E5A34");
        // back-row chairs along the wall
        (o.backChairs || [1300, 1520, 1740]).forEach(x => TT.prop(ctx, "chair", x, 880, { s: .62 }, t)); });
      layer(ctx, c, .65, () => { U.motes(ctx, t, 18, 5, 300, 0, 1500, 760, "#FFF3D6", .55); [520, 1400].forEach((x, i) => U.lamp(ctx, x, -400, 330, t, i, false, "#3B2418")); });
    },
    // long table in front of the seated front row (drawn over their legs)
    front(ctx, c, t, o){ if (o.table === false) return; layer(ctx, c, 1, () => {
      const x0 = o.tableX0 ?? 520, x1 = o.tableX1 ?? 1760, y = o.tableY ?? 820;
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, 1010, (x1 - x0) / 2 + 40, 26, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#7A4429"; ctx.fillRect(x0 + 40, y + 40, 34, 1000 - y - 30); ctx.fillRect(x1 - 74, y + 40, 34, 1000 - y - 30);
      ctx.fillStyle = "#9A5A34"; rr(ctx, x0, y + 30, x1 - x0, 90, 10); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = "#C47A48"; rr(ctx, x0 - 20, y, x1 - x0 + 40, 40, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,240,220,.35)"; ctx.fillRect(x0, y + 6, x1 - x0, 6);
      (o.tableItems || [[700, "cup"], [980, "paper"], [1240, "laptop"], [1520, "cup"]]).forEach(([x, k], i) => {
        if (k === "cup"){ U.panel(ctx, x - 16, y - 40, 32, 40, 6, "#FFF4E6", 4); ctx.fillStyle = ORANGE; ctx.fillRect(x - 13, y - 28, 26, 7); }
        else if (k === "paper"){ ctx.fillStyle = "#FFFDF8"; ctx.save(); ctx.translate(x, y - 4); ctx.rotate(-.05); ctx.fillRect(-60, -8, 120, 10); ctx.restore(); }
        else { ctx.fillStyle = "#544E42"; rr(ctx, x - 70, y - 92, 140, 90, 8); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = hexA(ORANGE, .9); ctx.beginPath(); ctx.arc(x, y - 47, 10, 0, TAU); ctx.fill(); } });
    }); } };

  /* ---------- 2. ruang kerja terbuka (meja Rina dekat jendela) ---------- */
  // opt: time pagi|siang|sore|malam, empty (no coworkers), lights (0..1), sintaDesk, deskX
  const COWORK = [{ hair: "hijab", hijab: "#7A6BB0", shirt: "#E8C07A", skin: "e" }, { hair: "short", hairColor: "#2B1A12", shirt: "#5B7DB1", skin: "a" }, { hair: "hijab", hijab: "#3E7D4F", shirt: "#F3D9B5", skin: "b" }, { hair: "curly", hairColor: "#2B1A12", shirt: "#C2691F", skin: "c" }];
  LOC.kerja = { bounds: [-400, 2320, -200, 1300], grade: { warm: .12, vig: .4 }, def: { time: "siang" },
    bg(ctx, c, t, o){
      const night = o.time === "malam", lights = o.lights ?? 1;
      layer(ctx, c, .3, () => {
        fillAll(ctx, lg(ctx, 0, -300, 0, 760, night ? [[0, "#4A3122"], [1, "#3A261A"]] : [[0, "#F4DEC1"], [1, "#E8C69E"]]));
        [[-380, 70, 620, 540], [330, 70, 620, 540], [1040, 70, 620, 540], [1750, 70, 620, 540]].forEach(([x, y, w, h], k) => U.window(ctx, x, y, w, h, o.time === "malam" ? "malam" : o.time === "sore" ? "sore" : o.time === "pagi" ? "pagi" : "siang", t, k * 11 + 3, { cols: 3, cityScale: 1.1 }));
        if (o.clockWall !== false){ const cl = U.parseClock(o.clock || "10:10", t, { rate: o.clockRate }); U.clock(ctx, o.clockX ?? 975, 150, 70, cl.h, cl.m, cl.s); }
      });
      layer(ctx, c, .5, () => { if (!night && o.time !== "sore"){ ctx.fillStyle = lg(ctx, 0, 100, 0, 1000, [[0, "rgba(255,236,196,.35)"], [1, "rgba(255,236,196,0)"]]);
        [[330, 950], [1040, 1660]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a, 120); ctx.lineTo(b, 120); ctx.lineTo(b + 500, 1000); ctx.lineTo(a + 500, 1000); ctx.closePath(); ctx.fill(); }); }
        U.motes(ctx, t, 26, 9, 200, 100, 1600, 800, night ? "#FFE3B0" : "#FFF3D6", night ? .35 : .7); });
      layer(ctx, c, .72, () => { U.floor(ctx, 700, night ? [[0, "#6B4329"], [1, "#4A2D1B"]] : [[0, "#C99A6C"], [1, "#B07C4F"]], true, t); U.baseboard(ctx, 702);
        if (!o.empty) (o.cowork || [[-120, 0], [560, 1], [1260, 2], [1900, 3]]).forEach(([x, k], i) => U.bgDesk(ctx, x, 830, .62, t, k == null ? null : COWORK[k], i));
        else (o.cowork || [[-120], [560], [1260], [1900]]).forEach(([x], i) => U.bgDesk(ctx, x, 830, .62, t, null, i));
        U.plant(ctx, 260, 830, .7, t); U.plant(ctx, 1600, 830, .6, t, "#2F6F73"); });
      layer(ctx, c, .85, () => { [-100, 560, 1220, 1880].forEach((x, i) => U.lamp(ctx, x, -500, 360, t, i, night, i % 2 ? ORANGE : "#3B2418")); });
      if (lights < 1){ ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.restore(); }
    },
    front(ctx, c, t, o){ if ((o.lights ?? 1) < 1){ ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(16,10,24,${(1 - o.lights) * .62})`; ctx.fillRect(0, 0, S.SW, S.SH); ctx.restore(); } } };

  /* ---------- 3. meja Yoga (pojok, dua monitor) ---------- */
  LOC.yoga = { bounds: [-200, 2120, -200, 1300], grade: { warm: .08, vig: .48 }, def: { time: "sore" },
    bg(ctx, c, t, o){
      layer(ctx, c, .3, () => {
        fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#C8A889"], [1, "#B48E6B"]]));
        // corner: two wall planes
        ctx.fillStyle = "#A98463"; ctx.beginPath(); ctx.moveTo(-600, -400); ctx.lineTo(420, -400); ctx.lineTo(420, 720); ctx.lineTo(-600, 720); ctx.fill();
        ctx.fillStyle = "rgba(43,26,18,.15)"; ctx.fillRect(414, -400, 12, 1130);
        U.window(ctx, 1180, 80, 560, 420, o.time === "malam" ? "malam" : "sore", t, 41, { cols: 2, blinds: 3 });
        // posters / sticky charts
        U.panel(ctx, 520, 120, 260, 190, 10, "#FFFDF8", 5); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(550, 280); ctx.lineTo(600, 230); ctx.lineTo(650, 250); ctx.lineTo(700, 170); ctx.lineTo(750, 190); ctx.stroke();
        S.text(ctx, "DATA", 650, 158, 28, { align: "center", col: BROWN });
        [[820, 140, "#F6D36B"], [880, 210, "#9FD3E0"], [830, 270, "#F4A85C"]].forEach(([x, y, col], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate((i - 1) * .08); U.panel(ctx, 0, 0, 70, 64, 4, col, 0); ctx.restore(); });
        const cl = U.parseClock(o.clock || "16:40", t); U.clock(ctx, 1000, 170, 60, cl.h, cl.m, cl.s);
        // shelf with headphones stand + figure
        ctx.fillStyle = "#7A4A2B"; ctx.fillRect(-300, 380, 560, 18); [[-260, "#2F6F73"], [-200, ORANGE], [-150, "#3B2418"], [-100, "#E8A55B"]].forEach(([x, col]) => { ctx.fillStyle = col; ctx.fillRect(x, 300, 40, 80); });
        U.plant(ctx, 120, 382, .45, t, "#3B2418");
      });
      layer(ctx, c, .7, () => { U.floor(ctx, 720, [[0, "#9F7A5C"], [1, "#7F5D44"]], true, t); U.baseboard(ctx, 722, "#6E4A30"); U.motes(ctx, t, 16, 31, 200, 80, 1600, 700, "#D6E8FF", .35); });
    },
    // the desk with 2 monitors in front of Yoga
    front(ctx, c, t, o){ if (o.desk === false) return; layer(ctx, c, 1, () => {
      const x = o.deskX ?? 1080, y = 1000, w = 980;
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, y + 8, w / 2 + 40, 24, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#5E3A26"; ctx.fillRect(x - w / 2 + 30, y - 230, 30, 230); ctx.fillRect(x + w / 2 - 60, y - 230, 30, 230);
      U.panel(ctx, x - w / 2, y - 262, w, 42, 10, "#8E5A3A", 6);
      // two monitors (screens face the viewer slightly) with glow
      [[x - 170, -.06], [x + 170, .06]].forEach(([mx, r], i) => { ctx.save(); ctx.translate(mx, y - 262); ctx.fillStyle = "#2B2A30"; ctx.fillRect(-14, -70, 28, 70); rr(ctx, -70, -12, 140, 16, 6); ctx.fill();
        ctx.rotate(r); U.panel(ctx, -160, -300, 320, 220, 14, "#232228", 6); ctx.save(); rr(ctx, -146, -287, 292, 194, 8); ctx.clip();
        ctx.fillStyle = "#16263F"; ctx.fillRect(-146, -287, 292, 194);
        if (S.FX.monitorUI) S.FX.monitorUI.paint(ctx, -146, -287, 292, 194, t, o, i);
        ctx.restore(); glow(ctx, 0, -190, 260, "#9FD3E0", .18 + .04 * Math.sin(t * 3 + i)); ctx.restore(); });
      // keyboard, mug, headphones on desk? (Yoga wears his headphones on the neck)
      U.panel(ctx, x - 120, y - 282, 240, 22, 6, "#3B3A40", 4);
      U.panel(ctx, x + 330, y - 320, 44, 58, 8, "#FFF4E6", 4); ctx.fillStyle = "#2F6F73"; ctx.fillRect(x + 334, y - 300, 36, 9);
    }); } };

  /* ---------- 4. halte bus (senja/malam), bus lewat ---------- */
  // opt: time senja|malam, busAt (local s) bus passes, busStop (bus stops for a while), rain
  LOC.halte = { bounds: [-300, 2220, -300, 1300], grade: { warm: .1, vig: .5 }, def: { time: "malam" },
    bg(ctx, c, t, o){
      const night = o.time === "malam";
      layer(ctx, c, .08, () => { fillAll(ctx, lg(ctx, 0, -400, 0, 700, night ? [[0, "#0E1330"], [.6, "#2A2346"], [1, "#6A3E48"]] : [[0, "#4F4579"], [.45, "#C77B6E"], [1, "#F4C38A"]]));
        if (night){ for (let i = 0; i < 90; i++){ ctx.globalAlpha = .3 + .6 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(rnd(i + 40) * 3000 - 500, rnd(i + 90) * 500 - 300, 1.5 + rnd(i) * 2, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
          glow(ctx, 1500, 60, 220, "#FFE7C0", .35); ctx.fillStyle = "#FFF0D6"; ctx.beginPath(); ctx.arc(1500, 60, 52, 0, TAU); ctx.fill(); }
        else { glow(ctx, 700, 520, 520, "#FFC27A", .7); ctx.fillStyle = "#FFD79A"; ctx.beginPath(); ctx.arc(700, 540, 110, 0, TAU); ctx.fill(); for (let k = 0; k < 4; k++) U.puff(ctx, ((t * 10 + k * 700) % 2800) - 500, 60 + k * 60, .7, "rgba(249,217,192,.8)"); } });
      layer(ctx, c, .2, () => { for (let i = -8; i < 26; i++){ const w = 100 + rnd(i + 170) * 110, h = 260 + rnd(i + 180) * 380, x = i * 130 - 300; ctx.fillStyle = night ? "#24253F" : "#7B6382"; ctx.fillRect(x, 640 - h, w, h + 100);
        for (let wy = 640 - h + 24; wy < 700; wy += 34) for (let wx = x + 12; wx < x + w - 14; wx += 22){ const r = rnd(wx * 1.3 + wy * .7); if (r > (night ? .55 : .7)){ ctx.fillStyle = Math.sin(t * (.5 + r) + r * 50) > -.6 ? "rgba(244,194,122,.85)" : "rgba(244,194,122,.2)"; ctx.fillRect(wx, wy, 10, 15); } } } });
      layer(ctx, c, .45, () => { // far sidewalk + shop fronts glow
        ctx.fillStyle = night ? "#2E2638" : "#8C6A72"; ctx.fillRect(-3000, 560, 8000, 200);
        for (let i = -4; i < 10; i++){ const x = i * 420; ctx.fillStyle = night ? "rgba(246,196,122,.5)" : "rgba(255,226,190,.5)"; ctx.fillRect(x + 40, 600, 300, 110); ctx.fillStyle = i % 2 ? ORANGE : "#2F6F73"; ctx.fillRect(x + 20, 580, 340, 22); }
        // road
        ctx.fillStyle = night ? "#28232C" : "#5E5560"; ctx.fillRect(-3000, 740, 8000, 200); ctx.fillStyle = "#F2E6D0"; for (let x = -3000; x < 5000; x += 260) ctx.fillRect(x + ((t * 0) % 260), 830, 140, 10);
        // traffic: headlight / taillight streaks + small cars
        for (let k = 0; k < 6; k++){ const dir = k % 2 ? -1 : 1, sp = 520 + rnd(k) * 300, span = 4200, x = dir > 0 ? ((t * sp + rnd(k + 3) * span) % span) - 1200 : 3000 - ((t * sp + rnd(k + 5) * span) % span), y = dir > 0 ? 800 : 870;
          ctx.fillStyle = ["#2F6F73", "#C2691F", "#E8E0D0", "#6E2430", "#3B4A6B", "#E8A55B"][k]; rr(ctx, x - 90, y - 46, 180, 50, 16); ctx.fill(); rr(ctx, x - 55, y - 74, 110, 34, 12); ctx.fill();
          ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(x - 50, y + 4, 16, 0, TAU); ctx.arc(x + 50, y + 4, 16, 0, TAU); ctx.fill();
          if (night){ glow(ctx, x + dir * 100, y - 24, 120, dir > 0 ? "#FFE3A8" : "#FF5A3A", .45); } ctx.fillStyle = dir > 0 ? "#FFE9B0" : "#E0503A"; ctx.fillRect(x + dir * 84 - 6, y - 34, 12, 12); }
      });
      // bus (local time busAt): drives in from the right, stops, drives out left
      if (o.busAt != null){ layer(ctx, c, .7, () => { const q = t - o.busAt, stop = o.busStop || 0; let x;
        if (q < -1) return; if (q < 1.6) x = 2900 - 1900 * eOut(clamp((q + 1) / 2.6, 0, 1)); else if (q < 1.6 + stop) x = 1000 + (2900 - 1000) * 0; else x = 1000 - 3200 * eIn(clamp((q - 1.6 - stop) / 2.2, 0, 1));
        if (q >= 1.6 && q < 1.6 + stop) x = 1000; drawBus(ctx, x, 960, t, night); }); }
      layer(ctx, c, .9, () => { // near sidewalk
        ctx.fillStyle = night ? "#4E4450" : "#B49A8E"; ctx.fillRect(-3000, 940, 8000, 400); ctx.fillStyle = night ? "#6A5E68" : "#CDB6A6"; ctx.fillRect(-3000, 932, 8000, 14);
        ctx.strokeStyle = "rgba(20,12,6,.18)"; ctx.lineWidth = 3; for (let x = -3000; x < 5000; x += 150){ ctx.beginPath(); ctx.moveTo(x, 946); ctx.lineTo(x - 60, 1300); ctx.stroke(); } });
    },
    mid(ctx, c, t, o){ // shelter structure + bench + street lamp (actors sit in front of the back panel)
      const night = o.time === "malam"; layer(ctx, c, 1, () => {
        const x0 = o.shelterX0 ?? 520, x1 = o.shelterX1 ?? 1560;
        ctx.fillStyle = "#3B4A6B"; ctx.fillRect(x0, 300, 24, 700); ctx.fillRect(x1 - 24, 300, 24, 700);
        ctx.fillStyle = "rgba(190,220,235,.28)"; ctx.fillRect(x0 + 24, 380, x1 - x0 - 48, 470); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 3; ctx.strokeRect(x0 + 24, 380, x1 - x0 - 48, 470);
        // ad poster in the shelter (lit)
        const px = x1 - 330; U.panel(ctx, px, 420, 250, 360, 8, night ? "#FFF3DE" : "#FFF7EA", 5, "#3B4A6B"); glow(ctx, px + 125, 600, 240, "#FFE9C0", night ? .35 : .12);
        ctx.fillStyle = ORANGE; rr(ctx, px + 20, 440, 210, 150, 8); ctx.fill(); S.drawLogo(ctx, px + 125, 515, 90);
        S.text(ctx, "Kasir pintar", px + 125, 640, 30, { align: "center", col: BROWN }); S.text(ctx, "untuk tokomu", px + 125, 680, 26, { align: "center", col: "#8A5A3E", w: 600 });
        ctx.fillStyle = "#2F3C59"; rr(ctx, x0 - 50, 270, x1 - x0 + 100, 50, 10); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
        ctx.fillStyle = "#C2691F"; rr(ctx, x0 + 40, 230, 260, 46, 10); ctx.fill(); ctx.stroke(); S.text(ctx, "HALTE TANGANI", x0 + 170, 264, 26, { align: "center", col: "#FFF" });
        // bench
        ctx.fillStyle = "#3B2418"; ctx.fillRect(x0 + 120, 900, 20, 100); ctx.fillRect(x1 - 160, 900, 20, 100);
        ctx.fillStyle = "#B5643C"; rr(ctx, x0 + 80, 880, x1 - x0 - 160, 34, 8); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke();
        // street lamp (left), flickering
        const lx = o.lampX ?? 260, fl = night ? (.85 + .15 * Math.sin(t * 23) * (Math.sin(t * 1.7) > .85 ? 1 : 0)) : .5;
        ctx.fillStyle = "#2B2A30"; ctx.fillRect(lx - 10, 120, 20, 880); ctx.fillRect(lx - 10, 120, 120, 16);
        ctx.fillStyle = night ? "#FFE3A8" : "#FFF4E6"; ctx.beginPath(); ctx.ellipse(lx + 100, 146, 40, 16, 0, 0, TAU); ctx.fill();
        if (night){ ctx.save(); ctx.globalAlpha = fl; glow(ctx, lx + 100, 200, 420, "#FFD08A", .45); ctx.fillStyle = lg(ctx, 0, 150, 0, 1000, [[0, "rgba(255,220,160,.3)"], [1, "rgba(255,220,160,0)"]]);
          ctx.beginPath(); ctx.moveTo(lx + 70, 150); ctx.lineTo(lx + 130, 150); ctx.lineTo(lx + 420, 1000); ctx.lineTo(lx - 220, 1000); ctx.fill(); ctx.restore();
          for (let i = 0; i < 4; i++){ const a = t * (3 + i) + i * 2; ctx.fillStyle = "rgba(255,240,210,.8)"; ctx.beginPath(); ctx.arc(lx + 100 + Math.cos(a) * 40, 175 + Math.sin(a * 1.3) * 26, 3, 0, TAU); ctx.fill(); } }
      });
      if (o.rain){ layer(ctx, c, 1.1, () => { ctx.strokeStyle = "rgba(200,220,255,.35)"; ctx.lineWidth = 2; for (let i = 0; i < 120; i++){ const x = rnd(i) * 2600 - 300, y = ((rnd(i + 5) * 1400 + t * 1300) % 1400) - 200; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 34); ctx.stroke(); } }); }
    } };
  function drawBus(ctx, x, y, t, night){
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(0, 40, 560, 26, 0, 0, TAU); ctx.fill();
    U.panel(ctx, -540, -380, 1080, 380, 40, "#2F6F73", 7); ctx.fillStyle = ORANGE; ctx.fillRect(-536, -150, 1072, 46);
    for (let k = 0; k < 7; k++){ U.panel(ctx, -470 + k * 136, -340, 112, 140, 12, night ? "#F4C27A" : "#BFE2EA", 5); if (night){ glow(ctx, -414 + k * 136, -270, 120, "#FFD08A", .25); }
      ctx.fillStyle = "rgba(43,26,18,.35)"; if (rnd(k + 3) > .4){ ctx.beginPath(); ctx.arc(-414 + k * 136, -250, 26, 0, TAU); ctx.fill(); ctx.fillRect(-440 + k * 136, -226, 52, 30); } }
    U.panel(ctx, 380, -340, 120, 330, 10, night ? "#E9C58A" : "#9FC6D0", 5);
    S.text(ctx, "TRANS KOTA · 7", -80, -118, 30, { align: "center", col: "#FFF" });
    [-340, 330].forEach(dx => { ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(dx, 0, 62, 0, TAU); ctx.fill(); ctx.fillStyle = "#9A948A"; ctx.beginPath(); ctx.arc(dx, 0, 26, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#1E1A18"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(dx, 0); ctx.lineTo(dx + Math.cos(t * 9) * 26, Math.sin(t * 9) * 26); ctx.stroke(); });
    ctx.fillStyle = night ? "#FFE3A8" : "#FFF4E6"; ctx.beginPath(); ctx.ellipse(-528, -60, 12, 22, 0, 0, TAU); ctx.fill(); if (night) glow(ctx, -600, -50, 200, "#FFE3A8", .5);
    ctx.restore();
  }
  U.drawBus = drawBus;

  /* ---------- 5. ruang kaca Bu Ratna ---------- */
  // opt.view: "dalam" (inside: desk, whiteboard) | "luar" (outside the glass wall; actors with layer:"back" are inside)
  LOC.kaca = { bounds: [-200, 2120, -200, 1300], grade: { warm: .11, vig: .42 }, def: { view: "dalam", time: "sore" },
    bg(ctx, c, t, o){
      layer(ctx, c, .4, () => {
        fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#E6D3BC"], [1, "#D2B794"]]));
        U.window(ctx, 120, 90, 460, 380, o.time === "malam" ? "malam" : "sore", t, 23, { cols: 2, blinds: 2 });
        // whiteboard with sticky notes
        const bx = o.view === "luar" ? 1080 : 820, by = 120, bw = 640, bh = 380;
        U.panel(ctx, bx - 14, by - 14, bw + 28, bh + 28, 14, "#9AA3AE", 0); U.panel(ctx, bx, by, bw, bh, 8, "#FBFCFB", 5, "#6E7782");
        const notes = [["#F6D36B", "Target Q1"], ["#9FD3E0", "SLA 1 hari"], ["#F4A85C", "CSAT ★"], ["#B9E3A6", "Rapat Jumat"], ["#F6D36B", "Training"], ["#F7B6C2", "Cuti?"]];
        notes.forEach(([col, txt], i) => { const nx = bx + 30 + (i % 3) * 120 + (i > 2 ? 30 : 0), ny = by + 30 + Math.floor(i / 3) * 120; ctx.save(); ctx.translate(nx + 48, ny + 44); ctx.rotate((rnd(i + 7) - .5) * .16 + Math.sin(t * 1.5 + i) * .01);
          U.panel(ctx, -48, -44, 96, 88, 3, col, 0); ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(-48, 36, 96, 8); S.text(ctx, txt, 0, 6, 15, { align: "center", col: BROWN, w: 700, maxW: 86 }); ctx.restore(); });
        ctx.strokeStyle = "#2F6F73"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx + 420, by + 320); ctx.lineTo(bx + 470, by + 270); ctx.lineTo(bx + 520, by + 300); ctx.lineTo(bx + 600, by + 220); ctx.stroke();
        if (S.FX.boardCards) S.FX.boardCards.paint && null;
        S.boardRect = [bx, by, bw, bh];
        // shelf + plant + frame
        ctx.fillStyle = "#7A4A2B"; ctx.fillRect(1560, 380, 340, 16); [[1580, "#2F6F73"], [1630, ORANGE], [1680, "#6E2430"]].forEach(([x, col]) => { ctx.fillStyle = col; ctx.fillRect(x, 300, 40, 80); });
        U.plant(ctx, 1820, 382, .45, t, "#6E2430");
      });
      layer(ctx, c, .75, () => { U.floor(ctx, 730, [[0, "#B8946C"], [1, "#9C7752"]], true, t); U.baseboard(ctx, 732, "#7A5236"); U.motes(ctx, t, 14, 13, 100, 80, 1700, 650, "#FFF3D6", .5); });
    },
    mid(ctx, c, t, o){ if (o.view !== "luar"){ layer(ctx, c, 1, () => drawBossDesk(ctx, o.deskX ?? 1240, t, o)); return; }
      // seen from the corridor: the desk inside, then the glass wall with frame, door, frosted band and reflections
      layer(ctx, c, 1, () => { drawBossDesk(ctx, o.deskX ?? 1300, t, o);
        ctx.fillStyle = "rgba(170,205,220,.20)"; ctx.fillRect(-600, -400, 3200, 1400);
        const bY = o.bandY ?? 520; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(-600, bY, 3200, 46); S.text(ctx, "SUPERVISOR LAYANAN PELANGGAN", 1350, bY + 33, 24, { align: "center", col: "#6E7782", track: 3 });
        ctx.save(); ctx.globalAlpha = .22; ctx.fillStyle = "#FFFFFF"; [[100, 1], [760, .6], [1500, .8]].forEach(([x, a], i) => { const dx = Math.sin(t * .3 + i) * 20; ctx.globalAlpha = .16 * a; ctx.beginPath(); ctx.moveTo(x + dx, -400); ctx.lineTo(x + 140 + dx, -400); ctx.lineTo(x - 260 + dx, 1000); ctx.lineTo(x - 400 + dx, 1000); ctx.fill(); }); ctx.restore();
        ctx.fillStyle = "#8D97A3"; [-40, 620, 1980].forEach(x => ctx.fillRect(x, -400, 22, 1400)); ctx.fillRect(-600, 980, 3200, 24);
        // door (left part) with handle
        ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 10; ctx.strokeRect(80, 60, 520, 925); ctx.fillStyle = "#5C6670"; rr(ctx, 540, 470, 16, 140, 8); ctx.fill();
        U.panel(ctx, 210, 300, 260, 64, 8, "rgba(255,255,255,.75)", 0); S.text(ctx, "Bu Ratna", 340, 342, 30, { align: "center", col: BROWN });
      }); } };
  function drawBossDesk(ctx, x, t, o){
    const y = 1000; ctx.save();
    ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(x, y + 6, 420, 22, 0, 0, TAU); ctx.fill();
    U.panel(ctx, x - 360, y - 250, 720, 250, 10, "#6B4129", 6); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(x - 330, y - 220, 660, 8);
    U.panel(ctx, x - 400, y - 286, 800, 44, 10, "#9A5A34", 6);
    if (o.deskItems !== false){ U.panel(ctx, x + 200, y - 380, 150, 96, 8, "#544E42", 4); ctx.fillStyle = hexA(ORANGE, .9); ctx.beginPath(); ctx.arc(x + 275, y - 332, 12, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFFDF8"; ctx.fillRect(x - 300, y - 298, 160, 12); ctx.fillStyle = "#2F6F73"; ctx.save(); ctx.translate(x - 90, y - 300); ctx.rotate(-.3); rr(ctx, -40, -6, 80, 12, 5); ctx.fill(); ctx.restore();
      U.panel(ctx, x + 80, y - 336, 40, 50, 6, "#FFF4E6", 4); }
    ctx.restore();
  }
  U.drawBossDesk = drawBossDesk;

  /* ---------- 6. lorong kantor ---------- */
  LOC.lorong = { bounds: [-600, 2520, -200, 1300], grade: { warm: .1, vig: .45 }, def: {},
    bg(ctx, c, t, o){
      layer(ctx, c, .35, () => { fillAll(ctx, "#E2C9A8");
        // vanishing corridor at the centre-right
        const vx = 1240, vy = 470; ctx.fillStyle = "#CDAE88"; ctx.beginPath(); ctx.moveTo(vx - 140, vy - 120); ctx.lineTo(vx + 140, vy - 120); ctx.lineTo(vx + 140, vy + 150); ctx.lineTo(vx - 140, vy + 150); ctx.fill();
        ctx.fillStyle = "#FFF1D8"; ctx.fillRect(vx - 60, vy - 70, 120, 220); glow(ctx, vx, vy + 20, 260, "#FFF3D6", .5);
        ctx.strokeStyle = "rgba(59,36,24,.2)"; ctx.lineWidth = 4; [[-140, -120, -1600, -600], [140, -120, 1600, -600], [-140, 150, -1600, 900], [140, 150, 1600, 900]].forEach(([a, b, cc, d]) => { ctx.beginPath(); ctx.moveTo(vx + a, vy + b); ctx.lineTo(vx + cc, vy + d); ctx.stroke(); });
        // doors on both sides receding
        for (let k = 0; k < 4; k++){ const q = Math.pow(.62, k), s = q; [[-1], [1]].forEach(([d]) => { const x = vx + d * (180 + 900 * q), w = 170 * s, h = 520 * s; ctx.fillStyle = k % 2 ? "#9A5A34" : "#A9643B"; ctx.fillRect(x - w / 2, vy + 150 * s - h + 60 * s, w, h); ctx.fillStyle = "#E8C07A"; ctx.beginPath(); ctx.arc(x - d * w * .32, vy + 150 * s - h / 2 + 60 * s, 6 * s + 2, 0, TAU); ctx.fill(); }); }
        // framed posters on the near wall
        [[170, "#2F6F73", "TIM CS"], [560, ORANGE, "TANGANI"]].forEach(([x, col, tx]) => { U.panel(ctx, x, 200, 250, 190, 8, "#FFFDF8", 6); ctx.fillStyle = col; ctx.fillRect(x + 18, 218, 214, 110); S.text(ctx, tx, x + 125, 365, 26, { align: "center", col: BROWN }); });
      });
      layer(ctx, c, .7, () => { ctx.fillStyle = lg(ctx, 0, 680, 0, 1300, [[0, "#C8A27A"], [1, "#A98258"]]); ctx.fillRect(-4000, 690, 10000, 2000); U.baseboard(ctx, 692, "#8E5A34");
        ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 5; for (let k = -10; k < 12; k++){ ctx.beginPath(); ctx.moveTo(1240 + k * 40, 690); ctx.lineTo(1240 + k * 420, 1400); ctx.stroke(); }
        ctx.fillStyle = "rgba(255,246,224,.12)"; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.ellipse(1240 - 200 * k, 760 + k * 90, 140 + k * 70, 18 + k * 8, 0, 0, TAU); ctx.fill(); }
        U.plant(ctx, 80, 860, .9, t, "#2F6F73"); });
      layer(ctx, c, .9, () => { for (let k = 0; k < 4; k++){ const x = 1240 + (k - 1.5) * 520, on = Math.sin(t * 17 + k) > -.95 || k !== 2; ctx.fillStyle = on ? "#FFF6DE" : "#BFAF96"; rr(ctx, x - 120, -60, 240, 26, 12); ctx.fill(); if (on) glow(ctx, x, 0, 300, "#FFE8B8", .22); } U.motes(ctx, t, 20, 77, -200, 0, 2400, 900, "#FFF3D6", .5); });
    } };

  /* ---------- 7. toko kelontong Bu Sari ---------- */
  // opt: queue handled as actors; fan, hanging sachets, shelves, counter with POS + receipt printer
  LOC.toko = { bounds: [-300, 2220, -200, 1300], grade: { warm: .14, vig: .44 }, def: {},
    bg(ctx, c, t, o){
      layer(ctx, c, .35, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#E7D2A8"], [1, "#D8B884"]]));
        // shelves full of products
        for (let s = 0; s < 3; s++){ const x0 = -200 + s * 760; ctx.fillStyle = "#8E5A34"; ctx.fillRect(x0, 60, 640, 640); ctx.fillStyle = "#6B4129"; ctx.fillRect(x0 + 16, 76, 608, 608);
          for (let r = 0; r < 4; r++){ const y = 220 + r * 150; ctx.fillStyle = "#A9643B"; ctx.fillRect(x0 + 10, y, 620, 16);
            for (let k = 0; k < 9; k++){ const id = s * 50 + r * 10 + k, w = 46 + rnd(id) * 20, h = 70 + rnd(id + 1) * 50, col = ["#E0503A", "#F6D36B", "#2F6F73", "#F4A85C", "#5B7DB1", "#7FA563", "#FFF4E6", "#C2691F"][id % 8];
              ctx.fillStyle = col; rr(ctx, x0 + 26 + k * 66, y - h, w, h, 6); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x0 + 32 + k * 66, y - h + 14, w - 12, 10); } } }
        // shop sign
        U.panel(ctx, 640, -120, 640, 120, 14, ORANGE, 6); S.text(ctx, "TOKO SARI JAYA", 960, -42, 52, { align: "center", col: "#FFF" });
      });
      layer(ctx, c, .55, () => { // hanging sachet strips swaying
        for (let k = 0; k < 7; k++){ const x = 120 + k * 280, sw = Math.sin(t * 1.4 + k) * .05; ctx.save(); ctx.translate(x, -60); ctx.rotate(sw); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 120); ctx.stroke();
          for (let j = 0; j < 6; j++){ ctx.fillStyle = ["#E0503A", "#F6D36B", "#5B7DB1"][(k + j) % 3]; rr(ctx, -26, 120 + j * 58, 52, 52, 6); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(-18, 130 + j * 58, 36, 8); } ctx.restore(); }
        // ceiling fan
        ctx.save(); ctx.translate(960, -100); ctx.fillStyle = "#3B2418"; ctx.fillRect(-6, -200, 12, 200); ctx.scale(1, .25); ctx.rotate(t * 7); for (let k = 0; k < 3; k++){ ctx.rotate(TAU / 3); ctx.fillStyle = "#8E5A34"; rr(ctx, 0, -26, 300, 52, 26); ctx.fill(); } ctx.restore(); });
      layer(ctx, c, .8, () => { U.floor(ctx, 720, [[0, "#D9C6A8"], [1, "#BFA785"]], false, t); ctx.strokeStyle = "rgba(59,36,24,.12)"; ctx.lineWidth = 3;
        for (let k = -20; k < 30; k++){ ctx.beginPath(); ctx.moveTo(k * 120, 720); ctx.lineTo(k * 260 - 1000, 1400); ctx.stroke(); } for (let y = 760; y < 1300; y += 70){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); } U.baseboard(ctx, 722, "#8E5A34"); });
      layer(ctx, c, .6, () => U.motes(ctx, t, 18, 55, 0, 0, 1920, 800, "#FFF3D6", .5));
    },
    // the counter in front of Bu Sari (actors behind it use layer:"back")
    mid(ctx, c, t, o){ layer(ctx, c, 1, () => { const x = o.counterX ?? 700, w = 760, top = 760;
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, 1004, w / 2 + 30, 20, 0, 0, TAU); ctx.fill();
      U.panel(ctx, x - w / 2, top, w, 1000 - top, 10, "#B5643C", 6); ctx.fillStyle = "#9A5A34"; for (let k = 0; k < 5; k++) ctx.fillRect(x - w / 2 + 20 + k * 150, top + 50, 120, 170);
      U.panel(ctx, x - w / 2 - 20, top - 30, w + 40, 40, 10, "#D9894E", 6);
      // POS screen (facing the cashier) and receipt printer
      ctx.save(); ctx.translate(x - 160, top - 30); ctx.fillStyle = "#2B2A30"; ctx.fillRect(-10, -80, 20, 80); ctx.rotate(.18); U.panel(ctx, -110, -230, 220, 150, 12, "#2B2A30", 5);
      ctx.fillStyle = o.posFrozen ? "#7F8FA6" : "#BFE2EA"; rr(ctx, -98, -218, 196, 126, 6); ctx.fill(); if (o.posFrozen){ ctx.strokeStyle = "#FFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -155, 24, t * 5, t * 5 + 4.5); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.translate(x + 150, top - 30); U.panel(ctx, -70, -80, 140, 80, 12, "#3B3A40", 5); ctx.fillStyle = "#1E1A18"; ctx.fillRect(-46, -84, 92, 8);
      const pq = o.printJam ? (Math.sin(t * 30) * 2) : 0; ctx.fillStyle = "#FFFDF8"; ctx.save(); ctx.translate(pq, 0); ctx.beginPath(); ctx.moveTo(-36, -82); ctx.lineTo(36, -82); ctx.lineTo(30 + (o.printJam ? 18 : 0), -150 - (o.printJam ? 0 : (t * 6) % 40)); ctx.lineTo(-34, -150); ctx.fill(); ctx.restore();
      if (o.printJam){ ctx.fillStyle = "#E0503A"; ctx.beginPath(); ctx.arc(52, -40, 8 + Math.abs(Math.sin(t * 6)) * 2, 0, TAU); ctx.fill(); }
      ctx.restore();
      // goods on the counter
      [[x + 300, "#F6D36B"], [x + 340, "#E0503A"], [x - 330, "#2F6F73"]].forEach(([gx, col], i) => U.panel(ctx, gx - 22, top - 90, 44, 62, 8, col, 4));
    }); } };

  /* ---------- 8. kamar kos Rina (malam) ---------- */
  LOC.kos = { bounds: [-200, 2120, -200, 1300], grade: { warm: .14, vig: .58 }, def: {},
    bg(ctx, c, t, o){
      layer(ctx, c, .35, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#6E5A7A"], [1, "#5A4866"]]));
        ctx.fillStyle = "rgba(255,255,255,.04)"; for (let x = -400; x < 2400; x += 60) ctx.fillRect(x, -400, 28, 1200);
        U.window(ctx, 1380, 120, 380, 330, "malam", t, 77, { cols: 2, frame: "#EADBC8" });
        // curtain
        const sw = Math.sin(t * .8) * 10; ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(1340, 90); ctx.lineTo(1450, 90); ctx.quadraticCurveTo(1420 + sw, 300, 1460 + sw, 500); ctx.lineTo(1330, 500); ctx.fill();
        // pinned goal papers + photo string with polaroids
        ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(260, 160); ctx.quadraticCurveTo(560, 220, 860, 160); ctx.stroke();
        [[330, "#F6D36B"], [480, "#9FD3E0"], [630, "#F7B6C2"], [780, "#B9E3A6"]].forEach(([x, col], i) => { ctx.save(); ctx.translate(x, 190 + Math.sin(i) * 10); ctx.rotate(Math.sin(t * 1.1 + i) * .03 + (i - 1.5) * .05); U.panel(ctx, -48, 0, 96, 110, 4, "#FFFDF8", 3); ctx.fillStyle = col; ctx.fillRect(-38, 10, 76, 66); ctx.restore(); });
        // bookshelf
        ctx.fillStyle = "#5A321C"; ctx.fillRect(140, 420, 360, 16); [[160, ORANGE], [200, "#2F6F73"], [240, "#F6D36B"], [280, "#3B2418"], [330, "#E0503A"]].forEach(([x, col]) => { ctx.fillStyle = col; ctx.fillRect(x, 340, 36, 80); });
      });
      layer(ctx, c, .75, () => { U.floor(ctx, 720, [[0, "#9B6E4E"], [1, "#7A5239"]], true, t); U.baseboard(ctx, 722, "#5A3A2A");
        // bed at the right
        U.panel(ctx, 1500, 700, 520, 160, 20, "#F3D9B5", 6); U.panel(ctx, 1500, 650, 140, 70, 24, "#FFF6EA", 5); ctx.fillStyle = "#5B7DB1"; rr(ctx, 1640, 690, 380, 120, 16); ctx.fill(); });
      layer(ctx, c, .65, () => { const lx = 760; glow(ctx, lx, 500, 520, "#FFCF8A", .3); U.motes(ctx, t, 16, 91, 300, 200, 1000, 700, "#FFE3B0", .5); });
    },
    // small desk with Rina's laptop (video call screen faces the camera slightly)
    front(ctx, c, t, o){ if (o.desk === false) return; layer(ctx, c, 1, () => { const x = o.deskX ?? 1180, y = 1000;
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(x, y + 6, 330, 20, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - 280, y - 250, 26, 250); ctx.fillRect(x + 254, y - 250, 26, 250); U.panel(ctx, x - 310, y - 282, 620, 38, 10, "#C47A48", 6);
      // desk lamp
      ctx.fillStyle = "#3B2418"; ctx.fillRect(x + 220, y - 470, 10, 190); ctx.save(); ctx.translate(x + 225, y - 470); ctx.rotate(.5); U.panel(ctx, -50, -10, 100, 50, 18, ORANGE, 5); ctx.restore(); glow(ctx, x + 190, y - 360, 260, "#FFD9A0", .45);
    }); } };

  /* ---------- abstract backgrounds ---------- */
  LOC.none = { bg(ctx){ ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.restore(); }, grade: { warm: 0, vig: 0 } };
  // black "held breath" frame (ad-break hold): a slow heartbeat glow so the picture is never dead still
  LOC.hitam = { bg(ctx, c, t){ fillAll(ctx, "#0C0705"); ctx.save(); ctx.setTransform(ctx.getTransform()); const b = Math.pow(Math.max(0, Math.sin(t * 4.2)), 6) + .6 * Math.pow(Math.max(0, Math.sin(t * 4.2 - .9)), 6);
    ctx.fillStyle = rg(ctx, 960, 540, 0, 900, [[0, `rgba(160,30,24,${.1 + .32 * b})`], [1, "rgba(12,7,5,0)"]]); ctx.fillRect(-100, -100, 2200, 1300); ctx.restore(); }, grade: { warm: 0, vig: .3 } };
  LOC.brand = { bg(ctx, c, t, o){ layer(ctx, c, .4, () => { fillAll(ctx, lg(ctx, 0, -200, 0, 1300, [[0, "#1A2C4E"], [1, "#0D172B"]]));
      for (let i = 0; i < 14; i++){ const x = rnd(i + 3) * 2200 - 140, y = rnd(i + 8) * 1200 - 60, r = 90 + rnd(i) * 220; ctx.fillStyle = `rgba(194,105,31,${.05 + rnd(i + 2) * .08})`; ctx.beginPath(); ctx.arc(x + Math.sin(t * .3 + i) * 40, y + Math.cos(t * .25 + i) * 30, r, 0, TAU); ctx.fill(); } });
      layer(ctx, c, .8, () => U.motes(ctx, t, 40, 17, -100, -100, 2200, 1300, "#F6D9AE", .55)); }, grade: { warm: .04, vig: .45 } };
})();
