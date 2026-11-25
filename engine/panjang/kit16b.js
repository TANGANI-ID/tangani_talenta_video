/* STORY16 kit B — tambahan untuk Kantor Tangani (mulai Tak Terlihat Eps 2). Dimuat sesudah fx16.js.
   Lokasi : pantry (dapur kantor), kampus (halaman gedung kuliah, untuk Dimas).
   Properti: deskCal (kalender meja berdiri).
   Efek   : recap (bingkai "Sebelumnya di…"), calendar (kalender tenggat), mail (surel + balasan otomatis),
            group (grup chat di ponsel: banjir stiker / laporan 3 baris, bisukan / buka bisuan), exportSheet (tabel ekspor rusak),
            projectChat (laporan Sinta + balasan Bu Ratna), report (laporan 3 baris Rina), phone2 (ponsel umum: chat / layar kunci),
            rescue (papan tulis: penyelamat dalam gelap), ring (lingkaran spidol merah), sticky (catatan tempel 3 baris).
   Slide rapat baru (LOC.rapat locOpt.slide): "bagi" (pembagian proyek, nama muncul di o.bagi1..3) dan "demo" (sistem baru menyala di o.demoOn).
   Semua waktu fx bersarang ({cue}) sudah relatif terhadap f.at (lihat story16 rel()), kecuali f.out (lokal adegan). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer, eIn } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430";
  const typed = (str, t, t0, cps) => str.slice(0, Math.max(0, Math.floor((t - t0) * (cps || 22))));
  const avatar = (ctx, x, y, r, col, ch) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); T(ctx, ch, x, y + r * .38, r * 1.05, { align: "center", col: "#FFF" }); };
  const outA = (f, t) => f.out != null ? 1 - fin(t, f.out, .35) : 1;

  /* ============================== LOKASI ============================== */
  // pantry kantor: jendela, kabinet atas, jam, meja dapur (ketel beruap, wastafel, microwave), dispenser galon, kulkas bertempel catatan
  LOC.pantry = { bounds: [-300, 2220, -200, 1300], grade: { warm: .13, vig: .44 }, def: { time: "siang", clock: "12:40" },
    bg(ctx, c, t, o){
      const night = o.time === "malam";
      layer(ctx, c, .35, () => {
        fillAll(ctx, lg(ctx, 0, -300, 0, 700, night ? [[0, "#5A4A3E"], [1, "#4A3A30"]] : [[0, "#EAD9BF"], [1, "#DCC3A0"]]));
        U.window(ctx, 60, 70, 440, 270, night ? "malam" : (o.time || "siang"), t, 61, { cols: 2 });
        for (let k = 0; k < 4; k++){ const x = 760 + k * 262; P(ctx, x, 40, 246, 250, 10, "#B5643C", 5); ctx.fillStyle = "rgba(255,240,220,.18)"; ctx.fillRect(x + 14, 54, 218, 10); ctx.fillStyle = "#E8C07A"; rr(ctx, x + (k % 2 ? 24 : 196), 230, 26, 10, 5); ctx.fill(); }
        const cl = U.parseClock(o.clock, t); U.clock(ctx, 620, 170, 62, cl.h, cl.m, cl.s);
        // papan jadwal piket
        P(ctx, 1840, 80, 260, 220, 8, "#C9A27A", 5); P(ctx, 1858, 98, 224, 184, 4, "#FFFDF8", 0); T(ctx, "PIKET PANTRY", 1970, 132, 22, { align: "center", col: BROWN, track: 1 });
        ["Sen  Dodi", "Sel  Nisa", "Rab  Bayu", "Kam  Rina"].forEach((l, i) => T(ctx, l, 1878, 172 + i * 30, 20, { col: "#5A3A2A", w: 600 }));
      });
      layer(ctx, c, .75, () => {
        U.floor(ctx, 760, night ? [[0, "#7A6A58"], [1, "#5E5040"]] : [[0, "#D6C3A6"], [1, "#B9A485"]], false, t);
        ctx.strokeStyle = "rgba(59,36,24,.12)"; ctx.lineWidth = 3; for (let y = 800; y < 1400; y += 70){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); }
        for (let k = -20; k < 30; k++){ ctx.beginPath(); ctx.moveTo(k * 140, 760); ctx.lineTo(k * 300 - 1100, 1400); ctx.stroke(); }
        // tile backsplash
        ctx.fillStyle = night ? "#6E6458" : "#F3EAD9"; ctx.fillRect(-600, 380, 2240, 150); ctx.strokeStyle = "rgba(59,36,24,.13)"; ctx.lineWidth = 2;
        for (let x = -600; x <= 1640; x += 56){ ctx.beginPath(); ctx.moveTo(x, 380); ctx.lineTo(x, 530); ctx.stroke(); } for (let y = 380; y <= 530; y += 50){ ctx.beginPath(); ctx.moveTo(-600, y); ctx.lineTo(1640, y); ctx.stroke(); }
        // counter
        P(ctx, -620, 530, 2280, 36, 8, "#D9894E", 5); ctx.fillStyle = "#9A5A34"; ctx.fillRect(-600, 566, 2240, 194); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(-600, 566, 2240, 194);
        for (let k = 0; k < 7; k++){ const x = -580 + k * 316; ctx.strokeStyle = "rgba(43,26,18,.45)"; ctx.lineWidth = 3; ctx.strokeRect(x + 10, 584, 290, 160); ctx.fillStyle = "#E8C07A"; rr(ctx, x + 140, 600, 34, 8, 4); ctx.fill(); }
        // kettle with steam
        ctx.save(); ctx.translate(520, 530); P(ctx, -60, -110, 120, 110, 40, "#C2D0D6", 5); P(ctx, -30, -132, 60, 26, 10, "#3B3A40", 4); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(60, -80); ctx.quadraticCurveTo(110, -70, 96, -20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-58, -70); ctx.lineTo(-100, -110); ctx.stroke(); ctx.fillStyle = (Math.sin(t * 2) > 0 || !night) ? "#E0503A" : "#7A2A20"; ctx.beginPath(); ctx.arc(0, -30, 7, 0, TAU); ctx.fill();
        for (let k = 0; k < 4; k++){ const q = (t * .45 + k / 4) % 1; ctx.globalAlpha = .55 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-100 + k * 4, -116 - q * 120); ctx.quadraticCurveTo(-120 + Math.sin(q * 7 + k) * 16, -150 - q * 120, -98, -190 - q * 120); ctx.stroke(); } ctx.globalAlpha = 1; ctx.restore();
        // jars + mugs
        [["KOPI", "#5A321C"], ["GULA", "#FFFDF8"], ["TEH", "#3E7D4F"]].forEach(([lab, col], i) => { const x = 700 + i * 90; P(ctx, x - 34, 430, 68, 100, 12, "rgba(220,235,240,.85)", 4); ctx.fillStyle = col; ctx.fillRect(x - 28, 470, 56, 54); P(ctx, x - 38, 418, 76, 18, 6, ORANGE, 3); T(ctx, lab, x, 462, 15, { align: "center", col: BROWN, w: 800 }); });
        // sink + faucet
        ctx.fillStyle = "#B8C4CA"; rr(ctx, 1010, 520, 240, 18, 6); ctx.fill(); ctx.strokeStyle = "#6E7782"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(1130, 520); ctx.lineTo(1130, 440); ctx.quadraticCurveTo(1130, 420, 1170, 420); ctx.lineTo(1170, 440); ctx.stroke(); ctx.lineCap = "butt";
        { const d = (t * 1.3) % 1; ctx.fillStyle = "rgba(159,211,224,.9)"; ctx.beginPath(); ctx.arc(1170, 450 + d * 66, 5, 0, TAU); ctx.fill(); }
        // microwave with clock
        P(ctx, 1320, 380, 250, 150, 12, "#3B3A40", 5); P(ctx, 1340, 398, 150, 112, 8, "#1E1A18", 0); ctx.fillStyle = hexA("#9FD3E0", .12 + .05 * Math.sin(t * 2)); ctx.fillRect(1346, 404, 138, 100);
        P(ctx, 1500, 400, 54, 30, 4, "#0E1A12", 0); const cl = U.parseClock(o.clock, t); T(ctx, `${String(cl.h % 24).padStart(2, "0")}:${String(Math.floor(cl.m)).padStart(2, "0")}`, 1527, 422, 15, { align: "center", col: "#7FD39B", w: 700 });
        // dispenser (left, standing on the floor)
        ctx.save(); ctx.translate(-260, 760); P(ctx, -70, -330, 140, 330, 14, "#E9EEF1", 5); P(ctx, -60, -470, 120, 150, 40, "rgba(159,211,224,.75)", 5); ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(-40, -450, 14, 110);
        for (let k = 0; k < 5; k++){ const q = (t * .6 + k / 5) % 1; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(-20 + rnd(k) * 40, -330 - q * 130, 4 + rnd(k + 2) * 4, 0, TAU); ctx.fill(); }
        [[-30, RED], [30, BLUE]].forEach(([x, col]) => { P(ctx, x - 12, -250, 24, 30, 5, col, 3); }); ctx.restore();
        // fridge (right) with magnets + notes
        ctx.save(); ctx.translate(1820, 760); P(ctx, -150, -620, 300, 620, 22, "#EEF2F4", 6); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-150, -400); ctx.lineTo(150, -400); ctx.stroke();
        ctx.fillStyle = "#9AA3AE"; rr(ctx, -128, -520, 12, 90, 6); ctx.fill(); rr(ctx, -128, -370, 12, 120, 6); ctx.fill();
        [[-40, -560, YEL, "Jangan lupa\nlabeli bekal!"], [60, -330, "#F7B6C2", "Arisan\nJumat"]].forEach(([x, y, col, txt], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate((i ? .06 : -.05) + Math.sin(t * 1.2 + i) * .01); P(ctx, -62, -50, 124, 100, 3, col, 0); txt.split("\n").forEach((l, j) => T(ctx, l, 0, -12 + j * 26, 18, { align: "center", col: BROWN, w: 700 })); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, -46, 9, 0, TAU); ctx.fill(); ctx.restore(); });
        ctx.restore();
      });
      layer(ctx, c, .6, () => U.motes(ctx, t, 18, 71, 0, 0, 1920, 800, night ? "#FFE3B0" : "#FFF3D6", .5));
    } };

  // halaman kampus (Dimas): langit, gedung kuliah berpilar, pohon bergoyang, papan info UKT, mahasiswa lewat di kejauhan
  const STUD = [{ hair: "hijab", hijab: "#5B7DB1", shirt: "#F3D9B5", pants: "#3B2418", skin: "b" }, { hair: "short", hairColor: "#2B1A12", shirt: "#E8A55B", pants: "#2C2433", skin: "d" }, { hair: "hijab", hijab: "#3E7D4F", shirt: "#FFFDF8", pants: "#5A3A2A", skin: "e" }];
  LOC.kampus = { bounds: [-300, 2220, -300, 1300], grade: { warm: .1, vig: .38 }, def: { time: "siang" },
    bg(ctx, c, t, o){
      layer(ctx, c, .1, () => U.sky(ctx, -1200, -700, 4400, 1500, o.time || "siang", t, 5));
      layer(ctx, c, .3, () => {
        const x0 = 260, x1 = 1660; ctx.fillStyle = "#E9DCC6"; ctx.fillRect(x0, 160, x1 - x0, 620); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.strokeRect(x0, 160, x1 - x0, 620);
        ctx.fillStyle = "#C9B08C"; ctx.beginPath(); ctx.moveTo(x0 - 60, 170); ctx.lineTo((x0 + x1) / 2, -20); ctx.lineTo(x1 + 60, 170); ctx.closePath(); ctx.fill(); ctx.stroke();
        P(ctx, (x0 + x1) / 2 - 300, 190, 600, 70, 10, TEAL, 5); T(ctx, "GEDUNG KULIAH B", (x0 + x1) / 2, 238, 38, { align: "center", col: "#FFF", track: 4 });
        for (let r = 0; r < 2; r++) for (let k = 0; k < 9; k++){ const wx = x0 + 70 + k * 150, wy = 300 + r * 170; P(ctx, wx, wy, 90, 120, 8, "#9FC6D0", 4); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(wx + 8, wy + 8, 24, 104); }
        for (let k = 0; k < 6; k++){ const px = x0 + 120 + k * 236; ctx.fillStyle = "#F6EEDF"; ctx.fillRect(px, 640, 46, 140); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(px, 640, 46, 140); }
        ctx.fillStyle = "#CDBB9E"; for (let k = 0; k < 3; k++) ctx.fillRect(x0 - 40 - k * 30, 780 + k * 18, x1 - x0 + 80 + k * 60, 18);
      });
      layer(ctx, c, .55, () => {
        // trees
        [[-120, 1.1], [180, .8], [1780, 1], [2080, .9]].forEach(([x, s], i) => { ctx.save(); ctx.translate(x, 860); ctx.fillStyle = "#6B4129"; ctx.fillRect(-18 * s, -300 * s, 36 * s, 300 * s); ctx.rotate(Math.sin(t * .9 + i) * .02);
          [[0, -420, 150], [-110, -340, 120], [110, -330, 125], [0, -270, 130]].forEach(([dx, dy, r], j) => { ctx.fillStyle = j % 2 ? "#4F8F5C" : "#3E7D4F"; ctx.beginPath(); ctx.arc(dx * s, dy * s, r * s, 0, TAU); ctx.fill(); }); ctx.restore(); });
        // notice board UKT
        ctx.save(); ctx.translate(o.boardX ?? 1460, 860); ctx.fillStyle = "#5A321C"; ctx.fillRect(-150, -170, 16, 170); ctx.fillRect(134, -170, 16, 170); P(ctx, -190, -400, 380, 240, 10, "#8E5A34", 6); P(ctx, -172, -382, 344, 204, 4, "#E9D2AE", 0);
        T(ctx, "INFO KEUANGAN", 0, -350, 24, { align: "center", col: BROWN, track: 2 }); ctx.save(); ctx.translate(-40, -270); ctx.rotate(-.04); P(ctx, -110, -56, 220, 120, 3, "#FFFDF8", 0); T(ctx, "BATAS BAYAR UKT", 0, -18, 20, { align: "center", col: RED, w: 800 }); T(ctx, "6 FEBRUARI", 0, 22, 32, { align: "center", col: BROWN, w: 800 }); ctx.restore();
        ctx.save(); ctx.translate(110, -260); ctx.rotate(.07); P(ctx, -50, -44, 100, 88, 2, YEL, 0); ctx.restore(); ctx.restore();
        // students far away
        STUD.forEach((lk, i) => { const sp = 70 + i * 18, x = ((t * sp + i * 900) % 2900) - 500, dir = i % 2 ? -1 : 1, xx = dir > 0 ? x : 1920 - x;
          const a = Object.assign({ size: 230, x: xx, y: 880, face: dir, seed: 7 + i }, lk, { keys: [{ at: 0, x: xx }, { at: .01, x: xx + dir * 3000, speed: sp }] });
          const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(ctx, a, st, t); });
      });
      layer(ctx, c, .8, () => { U.floor(ctx, 860, [[0, "#C9B79A"], [1, "#A9967A"]], false, t); ctx.fillStyle = "#7FA563"; ctx.fillRect(-3000, 860, 8000, 26);
        ctx.strokeStyle = "rgba(59,36,24,.14)"; ctx.lineWidth = 3; for (let k = -20; k < 30; k++){ ctx.beginPath(); ctx.moveTo(k * 120, 886); ctx.lineTo(k * 260 - 1000, 1400); ctx.stroke(); } for (let y = 930; y < 1400; y += 64){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); } });
      layer(ctx, c, .6, () => { for (let i = 0; i < 8; i++){ const x = ((t * (30 + i * 6) + i * 400) % 2600) - 300, y = 300 + Math.sin(t * 1.3 + i) * 120 + i * 30; ctx.fillStyle = i % 2 ? "#7FA563" : "#E8A55B"; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); ctx.beginPath(); ctx.ellipse(0, 0, 10, 5, 0, 0, TAU); ctx.fill(); ctx.restore(); } });
    } };

  /* ============================== PROPERTI ============================== */
  // standing desk calendar (origin = bottom centre on the desk top)
  PROP.deskCal = (ctx, o, t) => { ctx.save(); ctx.rotate(-.05);
    ctx.fillStyle = "#3B2418"; ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-40, -120); ctx.lineTo(40, -120); ctx.lineTo(58, 0); ctx.fill();
    P(ctx, -50, -128, 100, 118, 8, "#FFFDF8", 4); P(ctx, -50, -128, 100, 30, [8, 8, 0, 0], RED, 0); T(ctx, o.mon || "JAN", 0, -106, 18, { align: "center", col: "#FFF", w: 800 });
    T(ctx, o.day || "29", 0, -50, 46, { align: "center", col: BROWN }); T(ctx, o.sub || "JUMAT", 0, -22, 14, { align: "center", col: RED, w: 800 });
    if (o.ring){ ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, -64, 34, 26, 0, 0, TAU); ctx.stroke(); } ctx.restore(); };

  /* ============================== EFEK LAYAR ============================== */
  // --- "Sebelumnya di …": sepia, grain, orange frame, label pill (screen overlay on top of a normal shot) ---
  FX.recap = { layer: "screen", draw(ctx, f, t){
    ctx.save(); ctx.globalCompositeOperation = "color"; ctx.fillStyle = "rgba(150,108,70,.42)"; ctx.fillRect(0, 0, SW, SH); ctx.restore();
    ctx.save(); for (let i = 0; i < 70; i++){ ctx.fillStyle = `rgba(255,240,210,${rnd(i + Math.floor(t * 24)) * .22})`; ctx.fillRect(rnd(i * 3 + Math.floor(t * 24)) * SW, rnd(i * 7 + Math.floor(t * 24)) * SH, 3, 3); }
    ctx.fillStyle = rg(ctx, 960, 540, 400, 1150, [[0, "rgba(0,0,0,0)"], [1, "rgba(30,16,8,.55)"]]); ctx.fillRect(0, 0, SW, SH);
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 16; rr(ctx, 22, 22, SW - 44, SH - 44, 26); ctx.stroke(); ctx.strokeStyle = "rgba(255,246,234,.6)"; ctx.lineWidth = 3; rr(ctx, 42, 42, SW - 84, SH - 84, 18); ctx.stroke();
    const lab = f.label || "SEBELUMNYA DI TAK TERLIHAT", s = 1 + .02 * Math.sin(t * 3); font(ctx, 800, 30, F); const w = ctx.measureText(lab).width + 64;
    ctx.translate(SW - 70 - w / 2, 92); ctx.scale(s, s); P(ctx, -w / 2, -34, w, 68, 34, ORANGE, 5, OUT); T(ctx, lab, 0, 11, 30, { align: "center", col: "#FFF", track: 3 }); ctx.restore(); } };

  // --- desk calendar close-up: week 25..31, today ring, deadline circle, vendor-back marker ---
  FX.calendar = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C98A55"], [1, "#9C6A40"]])); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, 120 * k + 40, SW, 4);
    const z = 1 + q * (f.push ?? .02); ctx.save(); ctx.translate(960, 520); ctx.scale(z, z); ctx.rotate(-.02); ctx.translate(-960, -520);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; P(ctx, 170, 150, 1580, 760, 30, "#FFFDF8", 0); ctx.restore(); P(ctx, 170, 150, 1580, 760, 30, "#FFFDF8", 7, OUT);
    P(ctx, 170, 150, 1580, 130, [30, 30, 0, 0], RED, 0); T(ctx, f.title || "JANUARI", 960, 238, 70, { align: "center", col: "#FFF", track: 10 });
    for (let k = 0; k < 9; k++){ ctx.fillStyle = "#3B3A40"; ctx.beginPath(); ctx.arc(300 + k * 165, 150, 16, 0, TAU); ctx.fill(); }
    const days = f.days || [["SEN", 25], ["SEL", 26], ["RAB", 27], ["KAM", 28], ["JUM", 29], ["SAB", 30], ["MIN", 31]], cw = 210, gx = 960 - cw * days.length / 2;
    const ix = n => days.findIndex(d => d[1] === n), cx = i => gx + cw * i + cw / 2;
    days.forEach(([dn, n], i) => { const x = gx + cw * i; ctx.strokeStyle = "rgba(59,36,24,.25)"; ctx.lineWidth = 3; ctx.strokeRect(x + 6, 300, cw - 12, 560); T(ctx, dn, x + cw / 2, 350, 34, { align: "center", col: i > 4 ? RED : "#8A5A3E", track: 2 });
      T(ctx, String(n), x + cw / 2, 520, 120, { align: "center", col: i > 4 ? "#E9A79E" : BROWN }); });
    if (f.today != null){ const i = ix(f.today); if (i >= 0){ ctx.save(); ctx.globalAlpha = .5 + .3 * Math.sin(t * 4); ctx.fillStyle = hexA(YEL, .5); ctx.fillRect(gx + cw * i + 10, 304, cw - 20, 552); ctx.restore(); T(ctx, f.todayLabel || "HARI INI", cx(i), 840, 26, { align: "center", col: "#8A5A3E", track: 1 }); } }
    if (f.dead != null){ const i = ix(f.dead), cq = clamp((q - (f.circleAt ?? .4)) / .7, 0, 1); if (i >= 0 && cq > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); for (let k = 0; k <= 40 * cq; k++){ const a = -1.9 + k / 40 * TAU * 1.08, r = 1 + .05 * Math.sin(k * .9); ctx.lineTo(cx(i) + Math.cos(a) * 92 * r, 480 + Math.sin(a) * 110 * r); } ctx.stroke(); ctx.lineCap = "butt";
      const lq = pop(t, f.at + (f.circleAt ?? .4) + .6, .4); if (lq > 0){ ctx.save(); ctx.translate(cx(i), 690); ctx.scale(lq, lq); ctx.rotate(-.04); font(ctx, 800, 30, F); const lab = f.deadLabel || "TENGGAT"; const w = Math.max(ctx.measureText(lab).width + 40, 180); P(ctx, -w / 2, -40, w, 80, 14, RED, 5, OUT); T(ctx, lab, 0, 12, 30, { align: "center", col: "#FFF" }); ctx.restore();
        if (f.deadSub){ T(ctx, f.deadSub, cx(i), 792, 30, { align: "center", col: RED, w: 800, maxW: cw + 120 }); } } } }
    if (f.back != null && f.backAt != null){ const i = ix(f.back), bq = pop(t, f.at + f.backAt, .45); if (i >= 0 && bq > 0){ ctx.save(); ctx.translate(cx(i), 690); ctx.scale(bq, bq); ctx.rotate(.05); P(ctx, -92, -70, 184, 140, 4, "#9FD3E0", 0); T(ctx, "Vendor", 0, -16, 28, { align: "center", col: NAVY }); T(ctx, "masuk lagi", 0, 22, 26, { align: "center", col: NAVY, w: 700 }); ctx.restore();
      const i0 = ix(f.dead); if (i0 >= 0){ const aq = clamp((q - f.backAt - .3) / .5, 0, 1); ctx.strokeStyle = NAVY; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx(i0) + 60, 420); ctx.quadraticCurveTo((cx(i0) + cx(i)) / 2, 300, lerp(cx(i0) + 60, cx(i) - 50, aq), lerp(420, 410, aq)); ctx.stroke(); }
      const sq = pop(t, f.at + f.backAt + .9, .35); if (sq > 0){ ctx.save(); ctx.translate(1440, 220); ctx.scale(sq * 1.1, sq * 1.1); ctx.rotate(.12); ctx.strokeStyle = RED; ctx.lineWidth = 8; rr(ctx, -230, -54, 460, 108, 14); ctx.stroke(); T(ctx, f.stamp || "TERLAMBAT!", 0, 22, 62, { align: "center", col: RED }); ctx.restore(); } } }
    ctx.restore(); },
    sfx(f, g, add){ if (f.dead != null) add(g(f.at + (f.circleAt ?? .4)), "scribble", .7, .7); if (f.backAt != null){ add(g(f.at + f.backAt), "pop", .6); add(g(f.at + f.backAt + .9), "stamp", .9); } } };

  // --- e-mail client on the laptop: sent request, days pass with no reply, then the out-of-office auto reply ---
  FX.mail = { layer: "screen", draw(ctx, f, t){
    ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Surel Kantor" }, f)), q = t - f.at, rep = f.replyAt != null && q >= f.replyAt;
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y, 300, h); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + 300, y, w - 300, h);
    [["Kotak masuk", rep], ["Terkirim", !rep], ["Draf", false]].forEach(([n, on], i) => { P(ctx, x + 18, y + 26 + i * 72, 264, 58, 12, on ? "#FDEBD9" : "#F3F4F6", 0); T(ctx, n, x + 44, y + 64 + i * 72, 26, { col: on ? ORANGE : "#374151" }); if (i === 0 && rep){ P(ctx, x + 226, y + 40, 40, 30, 15, RED, 0); T(ctx, "1", x + 246, y + 63, 20, { align: "center", col: "#FFF" }); } });
    const px = x + 340, pw = w - 380;
    if (!rep){
      P(ctx, px, y + 30, pw, 330, 16, "#FFFFFF", 3, "#E3E6EA"); T(ctx, "Kepada:", px + 30, y + 80, 24, { col: "#9CA3AF", w: 600 }); T(ctx, f.to || "Vendor Sistem Lama · bagian data", px + 140, y + 80, 26, { col: NAVY });
      T(ctx, "Perihal:", px + 30, y + 124, 24, { col: "#9CA3AF", w: 600 }); T(ctx, f.subject || "Mohon kirim data klien untuk pindah sistem", px + 140, y + 124, 26, { col: "#111827", maxW: pw - 170 });
      ctx.fillStyle = "#E3E6EA"; ctx.fillRect(px + 30, y + 146, pw - 60, 2);
      ["Selamat pagi, Pak/Bu.", "Mohon bantuannya mengirimkan seluruh data klien Tangani", "dari sistem lama, paling lambat Kamis, 28 Januari.", "Terima kasih. Salam, Rina."].forEach((l, i) => T(ctx, l, px + 30, y + 196 + i * 40, 25, { col: "#374151", w: 500, fam: F2 }));
      const sq = f.sentAt != null ? pop(t, f.at + f.sentAt, .35) : 1; if (sq > 0){ ctx.save(); ctx.translate(px + pw - 140, y + 76); ctx.scale(sq, sq); P(ctx, -110, -26, 220, 52, 26, "#E7F3EC", 0); T(ctx, "Terkirim ✓", 0, 10, 24, { align: "center", col: GREEN }); ctx.restore(); }
      if (f.sentAt != null && q < f.sentAt + .6){ const k = clamp((q - f.sentAt + .1) / .6, 0, 1); ctx.save(); ctx.translate(lerp(px + pw - 200, x + w + 300, eIn(k)), lerp(y + 250, y - 250, eIn(k))); ctx.rotate(-.4); ctx.globalAlpha = 1 - k * .5; P(ctx, -70, -46, 140, 92, 10, "#FFFFFF", 5, ORANGE); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-70, -46); ctx.lineTo(0, 10); ctx.lineTo(70, -46); ctx.stroke(); ctx.restore(); }
      const wq = fin(t, f.at + (f.waitAt ?? 1), .4); if (wq > 0){ ctx.save(); ctx.globalAlpha = wq; P(ctx, px, y + 390, pw, 330, 16, "#F9FAFB", 3, "#E3E6EA");
        ctx.save(); ctx.translate(px + 150, y + 555); ctx.rotate(Math.floor(q * 1.2) % 2 ? Math.PI : 0); ctx.fillStyle = "#C9B08C"; ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(40, -60); ctx.lineTo(0, 0); ctx.lineTo(40, 60); ctx.lineTo(-40, 60); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
        T(ctx, "Belum ada balasan", px + 260, y + 530, 44, { col: "#6B7280" });
        const d0 = f.d0 ?? 3, d1 = f.d1 ?? 6, dd = Math.round(lerp(d0, d1, clamp((q - (f.waitAt ?? 1)) / (f.dayDur || 6), 0, 1)));
        T(ctx, `Hari ke-${dd}`, px + 260, y + 600, 36, { col: dd >= 6 ? RED : "#9CA3AF" }); if (f.call){ T(ctx, "Telepon kantor vendor: tidak diangkat", px + 260, y + 650, 26, { col: "#9CA3AF", w: 600 }); } ctx.restore(); }
    } else {
      const nq = pop(t, f.at + f.replyAt, .45); ctx.save(); ctx.translate(0, (1 - Math.min(1, nq)) * -60); ctx.globalAlpha = Math.min(1, nq);
      P(ctx, px, y + 30, pw, 640, 16, "#FFFFFF", 4, ORANGE); avatar(ctx, px + 70, y + 100, 36, "#6B7280", "V");
      T(ctx, f.from || "Vendor Sistem Lama", px + 130, y + 92, 28, { col: NAVY }); T(ctx, "Balasan otomatis", px + 130, y + 128, 24, { col: "#9CA3AF", w: 600 });
      T(ctx, f.replySubject || "Saya sedang cuti", px + 30, y + 200, 40, { col: "#111827" });
      ["Terima kasih atas email Anda.", "Saya sedang cuti sampai"].forEach((l, i) => T(ctx, l, px + 30, y + 270 + i * 48, 30, { col: "#374151", w: 500, fam: F2 }));
      font(ctx, 500, 30, F2); const wl = ctx.measureText("Saya sedang cuti sampai ").width; P(ctx, px + 24 + wl, y + 288, 250, 46, 8, "#FDE2DF", 0); T(ctx, f.until || "30 Januari.", px + 34 + wl, y + 318, 30, { col: RED, w: 800, fam: F2 });
      T(ctx, "Email Anda akan dibalas setelah saya kembali.", px + 30, y + 366, 30, { col: "#374151", w: 500, fam: F2 });
      ctx.restore();
      const dq = f.deadAt != null ? pop(t, f.at + f.deadAt, .4) : 0; if (dq > 0){ ctx.save(); ctx.translate(px + pw / 2, y + 560); ctx.scale(dq, dq); ctx.rotate(-.03); P(ctx, -330, -52, 660, 104, 22, RED, 6, OUT); T(ctx, f.deadText || "TENGGAT: 29 JANUARI", 0, 18, 48, { align: "center", col: "#FFF" }); ctx.restore(); }
    }
    ctx.restore(); },
    sfx(f, g, add){ if (f.sentAt != null) add(g(f.at + f.sentAt), "send", .8); if (f.waitAt != null) add(g(f.at + f.waitAt), "tick", .5, Math.max(1, f.dayDur || 4)); if (f.replyAt != null) add(g(f.at + f.replyAt), "notif", .9); if (f.deadAt != null) add(g(f.at + f.deadAt), "dun", .8); } };

  // --- cat sticker (dancing) ---
  function cat(ctx, x, y, s, t, seed){ ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 9 + seed) * .22); ctx.scale(s, s * (1 + .06 * Math.sin(t * 18 + seed)));
    ctx.fillStyle = ["#F4A85C", "#E8C07A", "#B0763A"][seed % 3]; ctx.strokeStyle = OUT; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-40, -20); ctx.lineTo(-34, -62); ctx.lineTo(-10, -38); ctx.lineTo(10, -38); ctx.lineTo(34, -62); ctx.lineTo(40, -20); ctx.arc(0, -4, 42, -.2, Math.PI + .2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = OUT; [-15, 15].forEach(d => { ctx.beginPath(); ctx.ellipse(d, -10, 5, 7, 0, 0, TAU); ctx.fill(); }); ctx.beginPath(); ctx.moveTo(-6, 4); ctx.quadraticCurveTo(0, 12, 6, 4); ctx.stroke();
    ctx.lineWidth = 2; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 22, 6); ctx.lineTo(d * 48, 0); ctx.moveTo(d * 22, 12); ctx.lineTo(d * 48, 14); ctx.stroke(); });
    ctx.fillStyle = "#FFF"; ctx.restore();
    for (let k = 0; k < 2; k++){ const q = (t * .9 + k / 2 + seed * .3) % 1; ctx.save(); ctx.globalAlpha = 1 - q; T(ctx, "♪", x + 46 * s + k * 18, y - 30 * s - q * 50, 30 * s, { col: ORANGE }); ctx.restore(); } }
  S.catSticker = cat;

  // --- phone in hand (shared by group + phone2) ---
  function phoneShell(ctx, t, f, z){ const night = !!f.night; fillAll(ctx, lg(ctx, 0, 0, 0, SH, night ? [[0, "#2A2346"], [1, "#120E20"]] : (f.bgCols || [[0, "#C9925F"], [1, "#9E6A40"]]))); U.motes(ctx, t, 22, 9, 0, 0, SW, SH, night ? "#FFE3B0" : "#FFF3D6", .35);
    ctx.translate((f.px ?? 960) + Math.sin(t * .7) * 14, 560 + Math.sin(t * 1.2) * 12); ctx.scale(z, z); ctx.rotate((f.rot ?? -.04) + Math.sin(t * .9) * .014);
    ctx.fillStyle = f.skin || "#E2A77C"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; rr(ctx, -270, 150, 540, 420, 120); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; P(ctx, -250, -480, 500, 940, 60, "#1E1A18", 0); ctx.restore(); P(ctx, -250, -480, 500, 940, 60, "#1E1A18", 7, OUT);
    rr(ctx, -226, -452, 452, 884, 44); ctx.clip(); return [-226, -452, 452, 884]; }
  function chatHeader(ctx, x, y, w, name, sub, col, ch, muted, t){ ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, 120); avatar(ctx, x + 60, y + 72, 32, col, ch); T(ctx, name, x + 106, y + 66, 28, { col: "#FFF", maxW: w - 200 }); if (sub) T(ctx, sub, x + 106, y + 100, 20, { col: "#A9BCDD", w: 600 });
    if (muted != null){ ctx.save(); ctx.translate(x + w - 50, y + 72); ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.moveTo(-16, 10); ctx.quadraticCurveTo(-16, -20, 0, -20); ctx.quadraticCurveTo(16, -20, 16, 10); ctx.lineTo(20, 14); ctx.lineTo(-20, 14); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 18, 5, 0, TAU); ctx.fill();
      if (muted > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-22, -24); ctx.lineTo(lerp(-22, 22, muted), lerp(-24, 22, muted)); ctx.stroke(); } ctx.restore(); } }
  function bubbleMsg(ctx, x, y, w, txt, o){ o = o || {}; font(ctx, 600, o.size || 26, F2); const L = S.wrap(ctx, txt, w - 50), lh = (o.size || 26) * 1.3, h = L.length * lh + 34 + (o.name ? 30 : 0);
    const bx = o.me ? x + (o.right ?? 0) - Math.min(w, Math.max(...L.map(l => ctx.measureText(l).width)) + 50) : x, bw = Math.min(w, Math.max(...L.map(l => ctx.measureText(l).width), o.name ? 140 : 0) + 50);
    P(ctx, o.me ? x + (o.right ?? 0) - bw : bx, y, bw, h, 20, o.bg || (o.me ? "#DCF5E6" : "#FFFFFF"), 3, o.stroke || "#D1D5DB"); const X0 = (o.me ? x + (o.right ?? 0) - bw : bx) + 25;
    if (o.name) T(ctx, o.name, X0, y + 34, 22, { col: o.nameCol || ORANGE, w: 800 }); L.forEach((l, i) => T(ctx, l, X0, y + (o.name ? 66 : 40) + i * lh, o.size || 26, { col: "#111827", w: 600, fam: F2 }));
    if (o.time) T(ctx, o.time, (o.me ? x + (o.right ?? 0) : bx + bw) - 14, y + h - 10, 16, { align: "right", col: o.me ? GREEN : "#9CA3AF", w: 700 }); return [o.me ? x + (o.right ?? 0) - bw : bx, y, bw, h]; }

  // --- group chat on a phone: Bayu floods "Tim Operasional"; or the 3-line version + unmute ---
  const FLOOD = [["t", "Sudah sampai kantor ya, rekan-rekan"], ["s", 0], ["t", "Otw gudang dulu"], ["s", 1], ["t", "Kurir sudah jalan"], ["s", 2], ["t", "Hujan, agak telat"], ["imp", "Kiriman Toko Makmur telat 2 hari"], ["s", 0], ["t", "Makan siang dulu ya"], ["s", 1], ["t", "Balik kantor"], ["s", 2], ["t", "Semangat semua!"]];
  FX.group = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1) * (1 + q * .015); ctx.save(); const [x, y, w, h] = phoneShell(ctx, t, f, z);
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); for (let k = 0; k < 14; k++){ ctx.fillStyle = "rgba(194,105,31,.05)"; ctx.beginPath(); ctx.arc(x + rnd(k) * w, y + rnd(k + 4) * h, 30 + rnd(k + 8) * 40, 0, TAU); ctx.fill(); }
    const muted = f.mode === "tiga" ? (f.unmuteAt != null ? 1 - clamp((q - f.unmuteAt) / .4, 0, 1) : 1) : (f.muteAt != null ? clamp((q - f.muteAt - .5) / .4, 0, 1) : 0);
    const cy0 = y + 130, ch = h - 130 - 80; ctx.save(); ctx.beginPath(); ctx.rect(x, cy0, w, ch); ctx.clip();
    if (f.mode === "tiga"){ const m = pop(t, f.at + (f.msgAt ?? .3), .35); if (m > 0){ ctx.save(); ctx.translate(x + 20, cy0 + 60); ctx.scale(Math.min(1, m), Math.min(1, m));
        P(ctx, 0, 0, w - 60, 330, 20, "#FFFFFF", 3, "#D1D5DB"); T(ctx, "Bayu", 24, 36, 22, { col: ORANGE, w: 800 });
        (f.lines || [["Selesai", "18 kiriman sampai", GREEN], ["Sedang", "3 di jalan, tiba besok", ORANGE], ["Butuh", "alamat baru Toko Makmur", RED]]).forEach(([lab, txt, col], i) => { P(ctx, 22, 62 + i * 82, 110, 40, 12, col, 0); T(ctx, lab, 77, 90 + i * 82, 20, { align: "center", col: "#FFF" }); T(ctx, txt, 22, 128 + i * 82, 23, { col: "#111827", w: 600, fam: F2, maxW: w - 110 }); });
        T(ctx, f.time || "16.10", w - 80, 318, 16, { align: "right", col: "#9CA3AF", w: 700 }); ctx.restore(); } }
    else { const rate = f.rate ?? 2.6, n = f.instant ? (f.max ?? FLOOD.length) : clamp(Math.floor((q - (f.startAt ?? .2)) * rate) + 1, 0, f.max ?? FLOOD.length);
      let yy = 0; const items = []; for (let i = 0; i < n; i++){ const [k, v] = FLOOD[i % FLOOD.length], hh = k === "s" ? 150 : 104; items.push({ k, v, y: yy, h: hh, i }); yy += hh + 14; }
      const total = yy, focus = f.focus != null ? items.find(it => it.k === "imp") : null; let off = focus ? focus.y + focus.h / 2 - ch / 2 : Math.max(0, total - ch + 20);
      if (!focus && !f.instant){ const last = items[items.length - 1]; if (last){ const k = clamp((q - (f.startAt ?? .2) - (n - 1) / rate) / .25, 0, 1); off -= (1 - easeIO(k)) * (last.h + 14) * (off > 0 ? 1 : 0); } }
      items.forEach(it => { const iy = cy0 + 20 + it.y - Math.max(0, off); if (iy > cy0 + ch || iy + it.h < cy0) return;
        if (it.k === "s"){ P(ctx, x + 24, iy, 190, 150, 20, "#FFFFFF", 3, "#D1D5DB"); cat(ctx, x + 119, iy + 92, 1.05, t, it.v + it.i); }
        else { const r = bubbleMsg(ctx, x + 24, iy, w - 90, it.v, { name: "Bayu", time: ["08.0", "09.1", "10.3", "11.4", "12.0", "13.2", "14.5"][it.i % 7] + (it.i % 10), size: 24 });
          if (it.k === "imp" && f.hlAt != null && q > f.hlAt){ ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 8); ctx.strokeStyle = RED; ctx.lineWidth = 7; rr(ctx, r[0] - 8, r[1] - 8, r[2] + 16, r[3] + 16, 24); ctx.stroke(); ctx.restore(); } } });
      f._n = n; }
    ctx.restore();
    // header + input bar
    chatHeader(ctx, x, y, w, f.title || "Tim Operasional", f.sub || "18 anggota", TEAL, "T", muted, t);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - 80, w, 80); P(ctx, x + 20, y + h - 64, w - 40, 48, 24, "#FFFFFF", 2, "#D1D5DB"); T(ctx, "Ketik pesan…", x + 44, y + h - 32, 20, { col: "#9CA3AF", w: 600 });
    // mute sheet
    if (f.mode !== "tiga" && f.muteAt != null && q > f.muteAt - .1 && q < f.muteAt + 1.4){ const sq = easeIO(clamp((q - f.muteAt + .1) / .3, 0, 1)) * (1 - easeIO(clamp((q - f.muteAt - 1) / .3, 0, 1)));
      ctx.fillStyle = `rgba(0,0,0,${.35 * sq})`; ctx.fillRect(x, y, w, h); ctx.save(); ctx.translate(0, (1 - sq) * 320); P(ctx, x, y + h - 300, w, 320, 30, "#FFFFFF", 0); T(ctx, "Bisukan notifikasi", x + 40, y + h - 236, 28, { col: NAVY });
      ["8 jam", "1 minggu", "Selalu"].forEach((l, i) => { const on = i === 2 && q > f.muteAt + .45; ctx.beginPath(); ctx.arc(x + 60, y + h - 176 + i * 54, 13, 0, TAU); ctx.strokeStyle = on ? GREEN : "#9CA3AF"; ctx.lineWidth = 4; ctx.stroke(); if (on){ ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x + 60, y + h - 176 + i * 54, 7, 0, TAU); ctx.fill(); } T(ctx, l, x + 92, y + h - 167 + i * 54, 24, { col: "#374151", w: 600 }); });
      ctx.restore(); if (q > f.muteAt + .2 && q < f.muteAt + .7) S.cursor(ctx, x + 70, y + h - 60, q > f.muteAt + .4); }
    ctx.restore();
    // outside the phone: counter + labels
    if (f.mode !== "tiga" && f.counter !== false){ const n = Math.min(14, f.instant ? 14 : Math.max(0, Math.floor((q - (f.startAt ?? .2)) * (f.rate ?? 2.6)) + 1)), s = pop(t, f.at + .3, .4);
      ctx.save(); ctx.translate(1520, 260); ctx.scale(s, s); ctx.rotate(.04); P(ctx, -190, -70, 380, 140, 24, RED, 6, OUT); T(ctx, String(n), -90, 34, 92, { align: "center", col: "#FFF" }); T(ctx, "PESAN", 50, 0, 34, { align: "left", col: "#FFF" }); T(ctx, "hari ini", 50, 38, 26, { col: "#FFE1DC", w: 600 }); ctx.restore(); }
    if (f.hlAt != null && q > f.hlAt){ const s = pop(t, f.at + f.hlAt, .4); ctx.save(); ctx.translate(430, 300); ctx.scale(s, s); ctx.rotate(-.05); P(ctx, -200, -50, 400, 100, 20, YEL, 6, OUT); T(ctx, f.hlText || "KABAR PENTING", 0, 16, 38, { align: "center", col: BROWN }); ctx.restore(); }
    if (f.mode !== "tiga" && f.muteAt != null && q > f.muteAt + .7){ const s = pop(t, f.at + f.muteAt + .7, .4); ctx.save(); ctx.translate(1500, 560); ctx.scale(s, s); ctx.rotate(.05); P(ctx, -210, -52, 420, 104, 22, "#5E5A62", 6, OUT); T(ctx, "DIBISUKAN", 0, 18, 50, { align: "center", col: "#FFF" }); ctx.restore(); }
    if (f.mode === "tiga" && f.unmuteAt != null && q > f.unmuteAt){ const s = pop(t, f.at + f.unmuteAt, .4); ctx.save(); ctx.translate(1500, 560); ctx.scale(s, s); ctx.rotate(.05); P(ctx, -250, -52, 500, 104, 22, GREEN, 6, OUT); T(ctx, "NOTIFIKASI AKTIF", 0, 16, 44, { align: "center", col: "#FFF" }); ctx.restore(); }
    if (f.label){ const s = pop(t, f.at + (f.labelAt ?? .3), .4); ctx.save(); ctx.translate(f.labelX ?? 430, f.labelY ?? 860); ctx.scale(s, s); ctx.rotate(-.04); font(ctx, 800, 40, F); const lw = ctx.measureText(f.label).width + 60; P(ctx, -lw / 2, -46, lw, 92, 20, f.labelBg || ORANGE, 6, OUT); T(ctx, f.label, 0, 14, 40, { align: "center", col: "#FFF" }); ctx.restore(); } },
    sfx(f, g, add){ if (f.mode === "tiga"){ add(g(f.at + (f.msgAt ?? .3)), "notif", .8); if (f.unmuteAt != null) add(g(f.at + f.unmuteAt), "chime", .8); return; }
      if (!f.instant){ const rate = f.rate ?? 2.6, n = f.max ?? FLOOD.length; for (let i = 0; i < n; i++) add(g(f.at + (f.startAt ?? .2) + i / rate), "notif", .5); }
      if (f.hlAt != null) add(g(f.at + f.hlAt), "ping", .6); if (f.muteAt != null){ add(g(f.at + f.muteAt + .4), "click", .9); add(g(f.at + f.muteAt + .7), "dun", .6); } } };

  // --- spreadsheet export gone wrong (laptop) ---
  const ROWS = [["10023", "Toko Mak#ur Jaya", "Bek?si", "0812-77??", "KASIR+"], ["10024", "Warung Bu T�ni", "Dep°k", "0813-1##2", "PRINT"], ["10025", "Mart 8", "Jak~arta", "08?1-5560", "KAS;IR"], ["10026", "Kopi Sen", "Bogor;;", "0857-2", "LAPOR"],
    ["10027", "Apotek Se�at", "Tangerang", "081#-9912", "KASIR"], ["10028", "Bengkel J@ya", "", "0821-44", "PRI;NT"], ["10029", "Roti Han", "Bandu~g", "08??-1199", "KAS"], ["10030", "Toko Ma�war", "Bek;asi", "0812-0", "LAP"]];
  FX.exportSheet = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Ekspor Sistem Lama" }, f)), q = t - f.at;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#E7F3EC"; ctx.fillRect(x, y, w, 64); T(ctx, f.file || "ekspor_klien_FINAL(5).csv", x + 30, y + 44, 28, { col: "#14532D" });
    const cols = [[30, "ID"], [170, "NAMA KLIEN"], [560, "KOTA"], [800, "TELEPON"], [1060, "PAKET"]];
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + 64, w, 56); cols.forEach(([cx, n]) => T(ctx, n, x + cx, y + 102, 22, { col: "#6B7280", track: 2 }));
    const glitch = "#%?~;@�°^*"; ROWS.forEach((r, i) => { const ry = y + 130 + i * 72, sh = (i % 3 === 1) ? Math.round(Math.sin(t * 2.3 + i) * 1.5) : 0; ctx.fillStyle = i % 2 ? "#FAFAFA" : "#FFFFFF"; ctx.fillRect(x, ry, w, 72); ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry + 72); ctx.lineTo(x + w, ry + 72); ctx.stroke();
      r.forEach((v, j) => { const jj = clamp(j + sh, 0, cols.length - 1); let s = v; if (Math.sin(t * 7 + i * 3 + j) > .7){ const p = Math.floor(rnd(i + j + Math.floor(t * 6)) * Math.max(1, s.length)); s = s.slice(0, p) + glitch[Math.floor(rnd(i * j + Math.floor(t * 8)) * glitch.length)] + s.slice(p + 1); }
        T(ctx, s, x + cols[jj][0] + (sh ? 30 : 0), ry + 46, 26, { col: sh && j > 0 ? RED : "#111827", w: 600, fam: F2, maxW: 360 }); }); });
    for (let k = 0; k < 5; k++){ ctx.strokeStyle = "rgba(229,231,235,.9)"; ctx.lineWidth = 2; const cx = [160, 550, 790, 1050][k]; if (cx){ ctx.beginPath(); ctx.moveTo(x + cx, y + 64); ctx.lineTo(x + cx, y + h); ctx.stroke(); } }
    const eq = f.errAt != null ? pop(t, f.at + f.errAt, .4) : 0; if (eq > 0){ ctx.save(); ctx.translate(x + w / 2, y + h - 90); ctx.scale(eq, eq); P(ctx, -520, -54, 1040, 108, 20, "#FDE2DF", 5, RED); ctx.beginPath(); ctx.arc(-460, 0, 30, 0, TAU); ctx.fillStyle = RED; ctx.fill(); T(ctx, "!", -460, 14, 40, { align: "center", col: "#FFF" }); T(ctx, f.err || "1.204 baris tidak terbaca · format rusak", -410, 14, 38, { col: RED }); ctx.restore(); }
    if (f.tries){ const n = Math.min(f.tries[1], Math.round(lerp(f.tries[0], f.tries[1], clamp(q / (f.triesDur || 4), 0, 1)))), s = pop(t, f.at + .2, .4); ctx.restore(); ctx.save(); ctx.translate(1600, 140); ctx.scale(s, s); ctx.rotate(.05); P(ctx, -200, -50, 400, 100, 22, NAVY, 6, OUT); T(ctx, `PERCOBAAN KE-${n}`, 0, 15, 40, { align: "center", col: YEL }); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(f.at) + .1, "typing", .4, 1.5); if (f.errAt != null) add(g(f.at + f.errAt), "dun", .6); } };

  // --- project group on the laptop: Sinta's tidy report, Bu Ratna's reply in 2 minutes, Rina types then deletes ---
  FX.projectChat = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Grup Proyek · Pindah Data" }, f)), q = t - f.at;
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); const px = x + 60;
    const m1 = pop(t, f.at + (f.msgAt ?? .3), .4); if (m1 > 0){ ctx.save(); ctx.translate(px, y + 40); ctx.scale(Math.min(1, m1), Math.min(1, m1)); avatar(ctx, 40, 40, 38, TEAL, "S");
      P(ctx, 100, 0, 900, 330, 22, "#FFFFFF", 3, "#D1D5DB"); T(ctx, "Sinta", 130, 40, 26, { col: TEAL, w: 800 }); T(ctx, "10.02", 980, 316, 18, { align: "right", col: "#9CA3AF", w: 700 });
      [["Selesai", "templat balasan 80%", GREEN], ["Macet", "akses ke sistem lama", ORANGE], ["Butuh", "izin akses dari tim TI", RED]].forEach(([lab, txt, col], i) => { const lq = pop(t, f.at + (f.msgAt ?? .3) + .25 + i * .2, .3); ctx.save(); ctx.globalAlpha = Math.min(1, lq); P(ctx, 130, 72 + i * 80, 150, 52, 14, col, 0); T(ctx, lab, 205, 108 + i * 80, 26, { align: "center", col: "#FFF" }); T(ctx, txt, 306, 110 + i * 80, 32, { col: "#111827", w: 600, fam: F2 }); ctx.restore(); });
      ctx.restore(); }
    const m2 = f.replyAt != null ? pop(t, f.at + f.replyAt, .4) : 0; if (m2 > 0){ ctx.save(); ctx.translate(px, y + 410); ctx.scale(Math.min(1, m2), Math.min(1, m2)); avatar(ctx, 40, 40, 38, MAROON, "R"); P(ctx, 100, 0, 620, 120, 22, "#FFFFFF", 3, "#D1D5DB");
      T(ctx, "Bu Ratna", 130, 40, 26, { col: MAROON, w: 800 }); T(ctx, "Sudah saya mintakan.", 130, 88, 32, { col: "#111827", w: 600, fam: F2 }); T(ctx, "10.04", 700, 108, 18, { align: "right", col: "#9CA3AF", w: 700 }); ctx.restore();
      const cq = pop(t, f.at + f.replyAt + .5, .4); ctx.save(); ctx.translate(px + 900, y + 470); ctx.scale(cq, cq); ctx.rotate(-.05); P(ctx, -140, -40, 280, 80, 40, ORANGE, 5, OUT); T(ctx, "2 MENIT", 0, 14, 38, { align: "center", col: "#FFF" }); ctx.restore(); }
    // input bar: Rina types a confession, then deletes it
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - 100, w, 100); P(ctx, x + 30, y + h - 80, w - 200, 60, 30, "#FFFFFF", 2, "#D1D5DB");
    if (f.typeAt != null && q > f.typeAt){ const msg = f.draft || "Bu, bagian saya juga macet di vendor…", del = f.delAt != null && q > f.delAt; let s = typed(msg, t, f.at + f.typeAt, 16);
      if (del) s = msg.slice(0, Math.max(0, msg.length - Math.floor((q - f.delAt) * 40))); T(ctx, s + (Math.sin(t * 8) > 0 ? "|" : ""), x + 60, y + h - 40, 26, { col: "#111827", w: 600, fam: F2, maxW: w - 260 });
      if (!del || s.length){ T(ctx, "Rina sedang mengetik…", x + 60, y + h - 110, 22, { col: "#6B7280", w: 600 }); } }
    else T(ctx, "Ketik pesan…", x + 60, y + h - 40, 24, { col: "#9CA3AF", w: 600 });
    P(ctx, x + w - 150, y + h - 80, 120, 60, 30, GREEN, 0); T(ctx, "➤", x + w - 90, y + h - 38, 30, { align: "center", col: "#FFF" });
    ctx.restore(); },
    sfx(f, g, add){ add(g(f.at + (f.msgAt ?? .3)), "notif", .8); if (f.replyAt != null) add(g(f.at + f.replyAt), "notif", .8); if (f.typeAt != null) add(g(f.at + f.typeAt), "typing", .45, Math.max(.5, (f.delAt ?? f.typeAt + 2) - f.typeAt)); if (f.delAt != null) add(g(f.at + f.delAt), "typing", .3, 1); } };

  // --- Rina's first 3-line report to Bu Ratna (laptop): typed, sent, thumbs up in 1 minute ---
  FX.report = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Chat · Bu Ratna", clock: "16:00" }, f)), q = t - f.at;
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h);
    const L = f.lines || [["Selesai", "312 data klien sudah pindah.", GREEN], ["Sedang", "cek 40 data ganda, beres besok jam 12.", ORANGE], ["Butuh", "akses edit dari TI untuk 5 klien.", RED]];
    const sent = f.sendAt != null && q >= f.sendAt, k = sent ? easeIO(clamp((q - f.sendAt) / .5, 0, 1)) : 0;
    const bx = lerp(x + 80, x + w - 1040, k), by = lerp(y + h - 420, y + 50, k);
    ctx.save(); P(ctx, bx, by, 960, 330, 24, sent ? "#DCF5E6" : "#FFFFFF", 4, sent ? "#86C9A0" : ORANGE);
    L.forEach(([lab, txt, col], i) => { const la = f.lineAt && f.lineAt[i], t0 = la != null ? (typeof la === "object" ? la.at : f.at + la) : f.at + (f.typeAt ?? .3) + i * (f.per ?? 1.3); if (t < t0) return; P(ctx, bx + 30, by + 34 + i * 96, 150, 56, 14, col, 0); T(ctx, lab, bx + 105, by + 72 + i * 96, 28, { align: "center", col: "#FFF" });
      T(ctx, sent ? txt : typed(txt, t, t0 + .15, 34), bx + 200, by + 74 + i * 96, 32, { col: "#111827", w: 600, fam: F2, maxW: 730 }); });
    if (sent) T(ctx, f.sentTime || "16.00 ✓✓", bx + 940, by + 316, 18, { align: "right", col: GREEN, w: 700 }); ctx.restore();
    if (!sent){ P(ctx, x + w - 210, y + h - 90, 170, 64, 32, GREEN, 0); T(ctx, "Kirim ➤", x + w - 125, y + h - 47, 28, { align: "center", col: "#FFF" }); if (f.sendAt != null){ const cq = clamp((q - f.sendAt + 1) / 1, 0, 1); if (cq > 0) S.cursor(ctx, lerp(x + w - 500, x + w - 120, easeIO(cq)), lerp(y + h - 300, y + h - 60, easeIO(cq)), q > f.sendAt - .15); } }
    const rq = f.replyAt != null ? pop(t, f.at + f.replyAt, .45) : 0; if (rq > 0){ ctx.save(); ctx.translate(x + 60, y + 430); ctx.scale(Math.min(1, rq), Math.min(1, rq)); avatar(ctx, 40, 50, 38, MAROON, "R"); P(ctx, 100, 0, 700, 230, 22, "#FFFFFF", 3, "#D1D5DB");
      T(ctx, "Bu Ratna", 130, 44, 26, { col: MAROON, w: 800 }); ctx.save(); ctx.translate(200, 150); ctx.scale(.7, .7); ctx.rotate(-.1 + Math.sin(t * 4) * .06); S.bigThumb(ctx); ctx.restore();
      const RL = f.reply || ["Akses sudah saya minta", "ke tim TI."]; T(ctx, RL[0], 290, 120, 30, { col: "#111827", w: 600, fam: F2 }); T(ctx, RL[1] || "", 290, 162, 30, { col: "#111827", w: 600, fam: F2 }); T(ctx, "16.01", 780, 214, 18, { align: "right", col: "#9CA3AF", w: 700 }); ctx.restore();
      const cq = pop(t, f.at + f.replyAt + .5, .4); ctx.save(); ctx.translate(x + 1000, y + 560); ctx.scale(cq, cq); ctx.rotate(-.05); P(ctx, -150, -40, 300, 80, 40, ORANGE, 5, OUT); T(ctx, f.replyChip || "1 MENIT", 0, 14, 38, { align: "center", col: "#FFF" }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ if (f.lineAt) f.lineAt.forEach(la => add(typeof la === "object" ? g(la.at) : g(f.at + la), "typing", .5, 1.4)); else add(g(f.at + (f.typeAt ?? .3)), "typing", .5, 3 * (f.per ?? 1.3)); if (f.sendAt != null) add(g(f.at + f.sendAt), "send", .8); if (f.replyAt != null){ add(g(f.at + f.replyAt), "notif", .9); add(g(f.at + f.replyAt + .5), "chime", .6); } } };

  // --- generic phone: chat (msgs [{at, text, me, time, from}]) or lock screen (lock:true, notifs [{at, title, text}]) ---
  const mT = (f, m) => m.cue != null ? m.at : f.at + (m.at || 0);   // msg/notif time (adegan-local)
  FX.phone2 = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1) * (1 + q * .018); let shake = 0;
    (f.msgs || f.notifs || []).forEach(m => { const d = t - mT(f, m); if (!m.me && d > 0 && d < .7) shake = Math.sin(t * 70) * 6 * (1 - d / .7); });
    ctx.save(); ctx.translate(shake, 0); const [x, y, w, h] = phoneShell(ctx, t, f, z);
    if (f.lock){ ctx.fillStyle = lg(ctx, 0, y, 0, y + h, f.night ? [[0, "#1B2440"], [1, "#3A2C48"]] : [[0, "#F6C98C"], [1, "#C2691F"]]); ctx.fillRect(x, y, w, h);
      T(ctx, f.time || "23.07", 0, y + 190, 104, { align: "center", col: "#FFF" }); T(ctx, f.date || "Jumat, 30 Januari", 0, y + 240, 28, { align: "center", col: "#E5E7EB", w: 600 });
      (f.notifs || []).forEach((m, i) => { const s = pop(t, mT(f, m), .4); if (s <= 0) return; ctx.save(); ctx.translate(0, y + 330 + i * 150); ctx.scale(Math.min(1, s), Math.min(1, s)); P(ctx, -205, -10, 410, 132, 24, "rgba(255,255,255,.92)", 0);
        avatar(ctx, -160, 50, 30, m.col || MAROON, m.ch || "R"); T(ctx, m.title || "Bu Ratna", -116, 34, 24, { col: NAVY, maxW: 250 }); T(ctx, m.when || f.time || "", 190, 34, 18, { align: "right", col: "#6B7280", w: 600 });
        font(ctx, 600, 22, F2); S.wrap(ctx, m.text, 300).slice(0, 2).forEach((l, j) => T(ctx, l, -116, 70 + j * 28, 22, { col: "#111827", w: 600, fam: F2 })); ctx.restore(); }); }
    else { ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); chatHeader(ctx, x, y, w, f.chat || "Dimas", f.chatSub || "online", f.chatCol || "#1F4E8C", f.chatCh || "D", null, t);
      let yy = y + 150; (f.msgs || []).forEach(m => { const s = pop(t, mT(f, m), .35); if (s <= 0) return; ctx.save(); ctx.translate(0, (1 - Math.min(1, s)) * 30); ctx.globalAlpha = Math.min(1, s);
        const r = bubbleMsg(ctx, x + 22, yy, w - 80, m.text, { me: m.me, right: w - 44, time: m.time, name: m.from, nameCol: m.col, size: 26 }); yy += r[3] + 18; ctx.restore(); });
      ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - 80, w, 80); P(ctx, x + 20, y + h - 64, w - 40, 48, 24, "#FFFFFF", 2, "#D1D5DB"); }
    ctx.restore(); ctx.restore();
    if (f.chip){ const s = pop(t, f.at + (f.chipAt ?? .3), .4); ctx.save(); ctx.translate(f.chipX ?? 1500, f.chipY ?? 240); ctx.scale(s, s); ctx.rotate(.04); font(ctx, 800, 46, F); const cw = ctx.measureText(f.chip).width + 70; P(ctx, -cw / 2, -50, cw, 100, 22, f.chipBg || NAVY, 6, OUT); T(ctx, f.chip, 0, 16, 46, { align: "center", col: f.chipCol || YEL }); ctx.restore(); } },
    sfx(f, g, add){ (f.msgs || f.notifs || []).forEach(m => add(g(mT(f, m)), m.me ? "send" : (f.lock ? "buzz" : "notif"), m.me ? .7 : .8, f.lock ? .9 : 0)); } };

  // --- whiteboard drawing: a rescuer searching in the dark; the beam never reaches the person who keeps quiet ---
  FX.rescue = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#D2B794"], [1, "#B8946C"]])); const z = 1 + q * .02; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.015); ctx.translate(-960, -540);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 16; P(ctx, 200, 90, 1520, 900, 20, "#9AA3AE", 0); ctx.restore(); P(ctx, 200, 90, 1520, 900, 20, "#9AA3AE", 6, OUT); P(ctx, 230, 120, 1460, 840, 10, "#FBFCFB", 0);
    const rv = clamp((q - (f.drawAt ?? .2)) / (f.drawDur || 2.4), 0, 1), xr = 230 + 1460 * rv;
    ctx.save(); ctx.beginPath(); ctx.rect(230, 120, xr - 230, 840); ctx.clip();
    // dark room: marker hatching
    ctx.strokeStyle = "rgba(31,78,140,.55)"; ctx.lineWidth = 5; for (let k = 0; k < 60; k++){ const x0 = 300 + k * 24; ctx.beginPath(); ctx.moveTo(x0, 200); ctx.lineTo(x0 - 120, 820); ctx.stroke(); }
    ctx.strokeStyle = "#1F4E8C"; ctx.lineWidth = 9; ctx.strokeRect(290, 190, 1340, 640);
    // flashlight beam (highlighter) sweeping
    const ang = -.15 + Math.sin(q * 1.1) * .28, sx = 520, sy = 600; ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang); ctx.fillStyle = "rgba(246,195,67,.75)"; ctx.beginPath(); ctx.moveTo(30, -10); ctx.lineTo(900, -190); ctx.lineTo(900, 170); ctx.lineTo(30, 10); ctx.closePath(); ctx.fill(); ctx.restore();
    // rescuer (stick figure with helmet) holding a torch
    ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(420, 470, 46, 0, TAU); ctx.stroke(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(420, 462, 52, Math.PI, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(420, 516); ctx.lineTo(420, 680); ctx.moveTo(420, 560); ctx.lineTo(500, 600); ctx.moveTo(420, 560); ctx.lineTo(360, 620); ctx.moveTo(420, 680); ctx.lineTo(370, 790); ctx.moveTo(420, 680); ctx.lineTo(470, 790); ctx.stroke();
    ctx.fillStyle = "#3B3A40"; ctx.save(); ctx.translate(sx - 10, sy); ctx.rotate(ang); rr(ctx, -40, -14, 60, 28, 6); ctx.fill(); ctx.restore();
    // the hidden person in the far corner (never lit)
    ctx.beginPath(); ctx.arc(1460, 700, 30, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1460, 730); ctx.quadraticCurveTo(1420, 780, 1460, 800); ctx.moveTo(1460, 745); ctx.lineTo(1420, 770); ctx.stroke(); ctx.lineCap = "butt";
    if (q > (f.drawAt ?? .2) + (f.drawDur || 2.4) * .9){ const b = Math.abs(Math.sin(t * 3)) * 8; T(ctx, "?", 1530, 660 - b, 90, { align: "center", col: RED }); }
    ctx.restore();
    // marker hand at the drawing front
    if (rv > 0 && rv < 1){ ctx.save(); ctx.translate(xr, 300 + Math.sin(q * 9) * 220); ctx.rotate(-.6); P(ctx, -12, -90, 24, 110, 8, "#1F4E8C", 4); P(ctx, -12, -90, 24, 30, 6, "#FFF", 0); ctx.fillStyle = "#E2A77C"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -50, -10, 100, 90, 30); ctx.fill(); ctx.stroke(); ctx.restore(); }
    // caption written in red
    const cq = clamp((q - (f.textAt ?? 4)) / .9, 0, 1); if (cq > 0){ ctx.save(); ctx.beginPath(); ctx.rect(300, 840, 1320 * cq, 120); ctx.clip(); T(ctx, f.text || "ATASAN BUKAN PERAMAL", 960, 925, 76, { align: "center", col: RED, fam: F2, w: 800 }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(f.at + (f.drawAt ?? .2)), "scribble", .7, f.drawDur || 2.4); add(g(f.at + (f.textAt ?? 4)), "scribble", .7, .9); } };

  // --- red marker ring (screen) around a point ---
  FX.ring = { layer: "screen", draw(ctx, f, t){ const q = clamp((t - f.at) / (f.dur || .7), 0, 1); if (q <= 0) return; ctx.save(); ctx.globalAlpha = outA(f, t);
    ctx.translate(Math.sin(t * .8 + 2) * 6, Math.sin(t * 1.2 + 2 * 1.7) * 6); ctx.strokeStyle = f.col || RED; ctx.lineWidth = f.lw || 12; ctx.lineCap = "round"; ctx.beginPath(); const n = 60; for (let k = 0; k <= n * q; k++){ const a = (f.a0 ?? -2.2) + k / n * TAU * 1.07, r = 1 + .04 * Math.sin(k * .7 + 1); ctx.lineTo(f.x + Math.cos(a) * f.rx * r, f.y + Math.sin(a) * f.ry * r); } ctx.stroke(); ctx.restore(); },
    sfx(f, g, add){ add(g(f.at), "scribble", .7, f.dur || .7); } };

  // --- sticky note with the 3 lines, slapped onto the laptop lid ---
  FX.sticky = { layer: "screen", draw(ctx, f, t){ const q = t - f.at;
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#6E6A72"], [1, "#4F4B55"]])); ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(900, 0); ctx.lineTo(0, 700); ctx.fill();
    ctx.save(); ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(1500, 540, 130, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 1500, 540, 170); ctx.restore();
    const s = q < .2 ? 0 : 1 + .35 * (1 - eOut(clamp((q - .2) / .35, 0, 1))), a = clamp((q - .2) / .15, 0, 1); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(820 + Math.sin(t * .7) * 12, 540 + Math.sin(t * 1.1) * 10); ctx.scale(s * (1 + q * .025), s * (1 + q * .025)); ctx.rotate(-.04 + Math.sin(t * .8) * .02);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, -420, -400, 840, 800, 6, YEL, 0); ctx.restore(); ctx.fillStyle = "rgba(0,0,0,.06)"; ctx.fillRect(-420, -400, 840, 70);
    (f.lines || ["1. Sudah selesai:", "2. Sedang dikerjakan:", "3. Butuh bantuan:"]).forEach((l, i) => { const lq = clamp((q - (f.writeAt ?? .7) - i * .8) / .7, 0, 1); ctx.save(); ctx.beginPath(); ctx.rect(-380, -260 + i * 210 - 90, 760 * lq, 150); ctx.clip(); T(ctx, l, -360, -240 + i * 210, 66, { col: i === 2 ? RED : "#1F4E8C", fam: F2, w: 800 }); ctx.restore(); });
    const cq = clamp((q - (f.circleAt ?? 3.4)) / .6, 0, 1); if (cq > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); for (let k = 0; k <= 50 * cq; k++){ const an = -2.4 + k / 50 * TAU * 1.06; ctx.lineTo(-40 + Math.cos(an) * 400, 175 + Math.sin(an) * 96); } ctx.stroke(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(f.at + .2), "stamp", .7); for (let i = 0; i < 3; i++) add(g(f.at + (f.writeAt ?? .7) + i * .8), "scribble", .6, .7); add(g(f.at + (f.circleAt ?? 3.4)), "scribble", .7, .6); } };

  S.phoneShell = phoneShell; S.chatHeader = chatHeader; S.bubbleMsg = bubbleMsg; S.avatar = avatar;   // dipakai kit16c

  /* ============================== SLIDE RAPAT BARU ============================== */
  const basePaint = FX.slide.paint;
  FX.slide.paint = (ctx, x, y, w, h, t, o) => {
    const k = o.slide;
    if (k === "bagi"){ ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip(); ctx.fillStyle = "#FFFDF7"; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, 96); T(ctx, "PINDAH DATA KLIEN → SISTEM TIKET BARU", x + w / 2, y + 62, 34, { align: "center", col: "#FFF", maxW: w - 40 });
      [["Templat balasan", "SINTA", TEAL, o.bagi1], ["Pemetaan data", "YOGA", "#7FA563", o.bagi2], ["Data dari vendor", "RINA", ORANGE, o.bagi3]].forEach(([role, nm, col, at], i) => { const cx = x + w / 6 + i * w / 3;
        T(ctx, role, cx, y + 160, 26, { align: "center", col: "#6B7280", maxW: w / 3 - 20 }); ctx.strokeStyle = "#E5E7EB"; ctx.lineWidth = 3; ctx.strokeRect(cx - w / 6 + 12, y + 180, w / 3 - 24, 220);
        const s = at != null ? pop(t, at, .4) : 0; if (s > 0){ ctx.save(); ctx.translate(cx, y + 290); ctx.scale(s, s); ctx.rotate((i - 1) * .04); P(ctx, -100, -50, 200, 100, 10, col, 5, OUT); T(ctx, nm, 0, 16, 42, { align: "center", col: "#FFF" }); ctx.restore();
          if (i === 2 && t > at + .5){ ctx.save(); ctx.globalAlpha = .4 + .4 * Math.sin(t * 5); ctx.strokeStyle = ORANGE; ctx.lineWidth = 8; ctx.strokeRect(cx - w / 6 + 16, y + 184, w / 3 - 32, 212); ctx.restore(); } } });
      ctx.restore(); return; }
    if (k === "demo"){ ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip(); ctx.fillStyle = "#13223D"; ctx.fillRect(x, y, w, h); S.drawLogo(ctx, x + 50, y + 46, 46); T(ctx, "Tangani Helpdesk · SISTEM BARU", x + 90, y + 58, 30, { col: "#FFF" });
      const on = o.demoOn == null || t > o.demoOn; if (!on){ ctx.strokeStyle = "#FFF"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2 + 20, 50, t * 5, t * 5 + 4.5); ctx.stroke(); T(ctx, "Memuat…", x + w / 2, y + h / 2 + 120, 30, { align: "center", col: "#A9BCDD" }); ctx.restore(); return; }
      const q = t - (o.demoOn || 0), b = .5 + .5 * Math.sin(t * 5); ctx.fillStyle = `rgba(59,163,107,${.6 + .4 * b})`; ctx.beginPath(); ctx.arc(x + w - 150, y + 48, 12, 0, TAU); ctx.fill(); T(ctx, "LIVE", x + w - 128, y + 58, 28, { col: "#7FD39B" });
      [["Klien pindah", String(Math.round(312 * clamp(q / 1.8, 0, 1)))], ["Tiket masuk", String(Math.round(48 * clamp(q / 2.2, 0, 1)))], ["Error", "0"]].forEach(([lab, v], i) => { const tx = x + 40 + i * (w - 80) / 3; P(ctx, tx, y + 100, (w - 80) / 3 - 20, 140, 14, "#1E3354", 0); T(ctx, lab, tx + 20, y + 140, 22, { col: "#A9BCDD" }); T(ctx, v, tx + 20, y + 215, 64, { col: i === 2 ? "#7FD39B" : "#FFF" }); });
      ctx.strokeStyle = "#F7A23B"; ctx.lineWidth = 6; ctx.beginPath(); for (let j = 0; j <= 24; j++){ const px = x + 50 + j * (w - 100) / 24, py = y + h - 40 - (j / 24) * 120 * clamp(q / 2, 0, 1) - Math.sin(j * .9 + t) * 10; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      ctx.restore(); return; }
    basePaint(ctx, x, y, w, h, t, o);
  };
})();
