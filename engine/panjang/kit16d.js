/* STORY16 kit D — tambahan untuk Kantor Tangani: Tak Terlihat Eps 4 ("Pilih dua"). Dimuat sesudah kit16c.js.
   Lokasi  : warung (warung kopi seberang kantor), bos (ruang Pak Hendra), lobi (lobi kantor + meja resepsionis), gudang (rak kardus perangkat kasir).
   Properti: warungTable (meja warung + gelas teh/kopi), hand_paper (kertas nilai di tangan).
   Efek    : jobApp (aplikasi lowongan, jempol melayang di "Lamar Sekarang" / formulir setengah jadi → simpan draf),
             review (kertas penilaian: kotak nilai dilingkari + stempel), yearFile (berkas penilaian 12 bulan: 10 abu-abu + 2 oranye, 2 catatan distabilo),
             nineList (daftar 9 hal: ditulis satu per satu / dicoret jadi 2), lineChart (grafik garis + garis rata-rata tim),
             rankTop (peringkat tim, Rina naik ke urutan teratas), jobMail (email "lamaran belum selesai" → Hapus draf),
             headChart (grafik datar kecil di atas kepala tokoh), countdown (papan "7 HARI"), oldPhoto (foto hari pertama di galeri ponsel),
             course (kursus daring tengah malam di laptop), twoNote (kertas "2 hal" ditempel di laptop di samping catatan 3 baris).
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} di dalam larik = waktu lokal adegan (lihat tm()). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430", GREY = "#9CA3AF";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const toon = (ctx, id, x, y, size, key, q, extra) => { const c = S.cast[id]; if (!c) return; const a = Object.assign({ size, x, y, face: 1, seed: 7 }, c.look || c, extra || {}, { keys: [Object.assign({ at: 0, pose: "idle", expr: "happy" }, key || {})] });
    const st = TT.toonState(a, null, q); st.talk = false; TT.drawToon(ctx, a, st, q); };
  // thumb (screen space, pointing up-left), used over phone buttons
  const thumb = (ctx, x, y, skin, press) => { ctx.save(); ctx.translate(x, y + press * 14); ctx.rotate(-.35); ctx.fillStyle = skin || "#C98B62"; ctx.strokeStyle = OUT; ctx.lineWidth = 7;
    rr(ctx, -46, -10, 92, 260, 46); ctx.fill(); ctx.stroke(); ctx.fillStyle = "rgba(255,240,225,.55)"; rr(ctx, -26, 0, 52, 46, 20); ctx.fill(); ctx.restore(); };
  const marker = (ctx, x, y, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(.6); P(ctx, -14, -150, 28, 130, 8, "#F7F7F7", 4); P(ctx, -14, -40, 28, 36, 4, col || RED, 4); ctx.fillStyle = col || RED; ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(8, -4); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const scribble = (ctx, x0, x1, y, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y); const n = 18;
    for (let j = 1; j <= n * k; j++){ const u = j / n; ctx.lineTo(lerp(x0, x1, u), y + Math.sin(j * 2.3) * 5); } ctx.stroke(); ctx.restore(); };
  const ring = (ctx, cx, cy, rx, ry, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); const n = 44;
    for (let j = 0; j <= n * k; j++){ const a = -2.3 + j / n * TAU * 1.07; ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } ctx.stroke(); ctx.restore(); };

  /* ============================== LOKASI ============================== */
  // warung kopi seberang kantor: jalan + gedung Tangani di seberang, terpal bergaris, etalase kerupuk, renceng sachet kopi, papan menu, bangku kayu
  LOC.warung = { bounds: [-300, 2220, -200, 1300], grade: { warm: .15, vig: .44 }, def: { time: "siang" },
    bg(ctx, c, t, o){ const time = o.time || "siang", night = time === "malam";
      layer(ctx, c, .25, () => { U.sky(ctx, -900, -500, 3800, 1100, time, t, 41); U.skyline(ctx, -900, -500, 3800, 560, time, t, 41, 1.2);
        // gedung kantor Tangani di seberang jalan
        P(ctx, 1240, 40, 560, 540, 8, night ? "#3A3552" : "#E9DCC8", 6); for (let r = 0; r < 6; r++) for (let k = 0; k < 5; k++){ ctx.fillStyle = night ? (rnd(r * 7 + k) > .4 ? "rgba(246,196,122,.85)" : "#2A2742") : "rgba(140,180,200,.75)"; ctx.fillRect(1280 + k * 104, 150 + r * 66, 76, 44); }
        P(ctx, 1380, 64, 280, 64, 10, NAVY, 4); S.drawLogo(ctx, 1420, 96, 40); T(ctx, "TANGANI", 1540, 108, 32, { align: "center", col: "#FFF", track: 3 }); });
      layer(ctx, c, .5, () => { ctx.fillStyle = "#6E6A72"; ctx.fillRect(-1200, 560, 4400, 120); ctx.fillStyle = "#F3EAD9"; for (let x = -1200; x < 3200; x += 200) ctx.fillRect(x + ((t * 0) % 200), 616, 110, 10);
        // motor lewat
        const mx = -400 + ((t * 260) % 3400); ctx.save(); ctx.translate(mx, 640); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(-40, 0, 22, 0, TAU); ctx.arc(50, 0, 22, 0, TAU); ctx.fill(); P(ctx, -60, -46, 120, 34, 12, RED, 4); P(ctx, -10, -96, 34, 56, 12, BLUE, 4); ctx.fillStyle = "#F6C343"; ctx.beginPath(); ctx.arc(8, -108, 20, 0, TAU); ctx.fill(); ctx.restore(); });
      layer(ctx, c, .8, () => { U.floor(ctx, 700, [[0, "#C9B79A"], [1, "#A8977B"]], false, t);
        ctx.strokeStyle = "rgba(59,36,24,.14)"; ctx.lineWidth = 3; for (let y = 760; y < 1400; y += 80){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); }
        // tiang + terpal bergaris
        ctx.fillStyle = "#8E5A3A"; [-180, 2100].forEach(x => { ctx.fillRect(x, -100, 30, 900); });
        for (let k = 0; k < 24; k++){ ctx.fillStyle = k % 2 ? ORANGE : "#FFF4E2"; ctx.beginPath(); const x = -300 + k * 110, sag = Math.sin(t * 1.4 + k) * 4; ctx.moveTo(x, -120); ctx.lineTo(x + 110, -120); ctx.lineTo(x + 110, 60 + sag); ctx.quadraticCurveTo(x + 55, 92 + sag, x, 60 + sag); ctx.closePath(); ctx.fill(); }
        ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-300, 64); ctx.lineTo(2340, 64); ctx.stroke();
        // papan menu
        P(ctx, 120, 150, 380, 250, 10, "#2E3A2F", 6); T(ctx, "WARUNG BU TINI", 310, 200, 30, { align: "center", col: YEL, track: 2 });
        [["Kopi hitam", "5rb"], ["Teh manis", "4rb"], ["Mi rebus", "10rb"], ["Gorengan", "1rb"]].forEach(([a, b], i) => { T(ctx, a, 150, 250 + i * 40, 26, { col: "#F3EAD9", w: 600 }); T(ctx, b, 470, 250 + i * 40, 26, { align: "right", col: "#F3EAD9", w: 700 }); });
        // renceng sachet kopi
        for (let r = 0; r < 3; r++){ const x0 = 640 + r * 90; ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, 70); ctx.lineTo(x0, 420); ctx.stroke();
          for (let k = 0; k < 7; k++){ ctx.save(); ctx.translate(x0, 100 + k * 46); ctx.rotate(Math.sin(t * 1.6 + k + r) * .06); P(ctx, -30, 0, 60, 40, 4, [RED, "#7A4A2A", YEL][(k + r) % 3], 3); ctx.restore(); } }
        // etalase + toples kerupuk
        P(ctx, 960, 330, 900, 300, 10, "#B5643C", 6); ctx.fillStyle = "rgba(210,235,240,.55)"; ctx.fillRect(990, 350, 840, 150); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.strokeRect(990, 350, 840, 150);
        [1040, 1200, 1360, 1520, 1680].forEach((x, i) => { P(ctx, x, 380, 120, 110, 18, "rgba(240,250,250,.85)", 4); ctx.fillStyle = ["#F3D27A", "#E9B56A", "#F7E4B0", "#D98A4E", "#F3D27A"][i]; ctx.fillRect(x + 10, 420, 100, 64); P(ctx, x - 4, 372, 128, 20, 6, ORANGE, 3); });
        // termos + gelas
        P(ctx, 1060, 250, 90, 80, 14, RED, 4); P(ctx, 1200, 270, 60, 60, 8, "rgba(240,250,250,.8)", 3);
        // bangku panjang (di belakang tokoh)
        P(ctx, o.benchX0 ?? 200, 900, o.benchW ?? 1500, 34, 8, "#8E5A3A", 5); ctx.fillStyle = "#6B4129"; [0.05, .95].forEach(u => ctx.fillRect((o.benchX0 ?? 200) + (o.benchW ?? 1500) * u - 15, 934, 30, 66));
        if (night) { ctx.fillStyle = "rgba(20,16,50,.25)"; ctx.fillRect(-3000, -400, 8000, 2000); }
        U.lamp(ctx, 900, -120, 120, t, 1, night, "#FFF4E2"); });
    } };
  PROP.warungTable = (ctx, o, t) => { const w = o.w || 900; ctx.save(); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 6, w * .55, 18, 0, 0, TAU); ctx.fill();
    P(ctx, -w / 2, -205, w, 40, 8, "#B5643C", 6); ctx.fillStyle = "#8E5A3A"; ctx.fillRect(-w / 2 + 30, -165, 26, 165); ctx.fillRect(w / 2 - 56, -165, 26, 165);
    (o.cups || [[-200, "teh"], [140, "kopi"]]).forEach(([x, k], i) => { ctx.save(); ctx.translate(x, -205); P(ctx, -26, -70, 52, 70, 8, "rgba(240,250,250,.8)", 4); ctx.fillStyle = k === "kopi" ? "#3B2418" : "#C9772E"; ctx.fillRect(-20, -46, 40, 42);
      if (o.spoon === i){ const a = Math.sin(t * 7) * .3; ctx.save(); ctx.translate(0, -50); ctx.rotate(a); ctx.strokeStyle = "#9AA3AE"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, -60); ctx.stroke(); ctx.restore(); }
      for (let s = 0; s < 2; s++){ const q = (t * .5 + s / 2 + i * .3) % 1; ctx.globalAlpha = .45 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-6 + s * 12, -76 - q * 60); ctx.quadraticCurveTo(-16 + s * 12, -100 - q * 60, -4 + s * 12, -124 - q * 60); ctx.stroke(); ctx.globalAlpha = 1; } ctx.restore(); });
    if (o.paper){ ctx.save(); ctx.translate(o.paper, -211); ctx.rotate(-.08); P(ctx, -70, -16, 140, 22, 3, "#FFFFFF", 3); ctx.restore(); }
    ctx.restore(); };
  // pintu ruangan (prop di lapisan main, di belakang tokoh) dengan papan nama
  PROP.officeDoor = (ctx, o, t) => { ctx.save(); P(ctx, -150, -560, 300, 560, 6, "#A9643B", 6); P(ctx, -120, -530, 240, 230, 4, "rgba(255,255,255,.08)", 0); ctx.fillStyle = "#E8C07A"; ctx.beginPath(); ctx.arc(100, -270, 12, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 12; ctx.strokeRect(-162, -572, 324, 572); P(ctx, -140, -470, 280, 56, 6, "#FFFDF8", 3); T(ctx, o.label || "KEPALA OPERASIONAL", 0, -435, 16, { align: "center", col: BROWN, w: 800 }); ctx.restore(); };
  PROP.hand_paper = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.2 + Math.sin(t * 9) * .12); P(ctx, -2, -18, 16, 20, 1, "#FFFFFF", .8); ctx.fillStyle = RED; ctx.fillRect(1, -6, 9, 2.6); ctx.restore(); };

  // ruang Pak Hendra: dinding panel kayu, rak buku, piagam, jendela kota besar, papan nama; o.folder = berkas WIJAYA di meja
  LOC.bos = { bounds: [-200, 2120, -200, 1300], grade: { warm: .12, vig: .46 }, def: { time: "sore" },
    bg(ctx, c, t, o){ const time = o.time || "sore";
      layer(ctx, c, .4, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#C9A27A"], [1, "#A97E56"]]));
        ctx.strokeStyle = "rgba(59,36,24,.22)"; ctx.lineWidth = 4; for (let x = -400; x < 2600; x += 160){ ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, 760); ctx.stroke(); }
        U.window(ctx, 820, 70, 760, 440, time, t, 77, { cols: 3, cityScale: 1.3 });
        // rak buku
        P(ctx, 80, 60, 520, 640, 8, "#6B4129", 6); for (let r = 0; r < 4; r++){ ctx.fillStyle = "#4A2C1A"; ctx.fillRect(96, 200 + r * 140, 488, 14); for (let k = 0; k < 9; k++){ const h = 80 + rnd(r * 9 + k) * 40; ctx.fillStyle = [NAVY, MAROON, TEAL, ORANGE, "#5E5A62"][(r + k) % 5]; ctx.fillRect(110 + k * 52, 200 + r * 140 - h, 40, h); } }
        // piagam
        [[1680, 120, "PENGHARGAAN"], [1680, 330, "MITRA UMKM"]].forEach(([x, y, l]) => { P(ctx, x, y, 260, 170, 6, "#E8C07A", 6); P(ctx, x + 18, y + 18, 224, 134, 4, "#FFFDF8", 0); S.drawLogo(ctx, x + 130, y + 62, 46); T(ctx, l, x + 130, y + 128, 20, { align: "center", col: BROWN, track: 2 }); });
      });
      layer(ctx, c, .75, () => { U.floor(ctx, 760, [[0, "#8E6A4E"], [1, "#6E5038"]], true, t); U.baseboard(ctx, 760, "#5A3A26");
        // karpet
        ctx.fillStyle = "rgba(110,36,48,.55)"; ctx.beginPath(); ctx.ellipse(1150, 1040, 900, 110, 0, 0, TAU); ctx.fill(); });
      layer(ctx, c, 1, () => { const x = o.deskX ?? 1300; U.drawBossDesk(ctx, x, t, Object.assign({}, o, { deskItems: true }));
        // papan nama
        P(ctx, x - 300, 680, 240, 40, 6, "#2B1A12", 4); T(ctx, "Pak Hendra", x - 180, 708, 22, { align: "center", col: "#E8C07A" });
        if (o.folder){ const fq = o.folder === true ? 1 : clamp((t - o.folder) / .4, 0, 1); ctx.save(); ctx.translate(x + 30, 708 - (1 - fq) * 60); ctx.globalAlpha = fq; ctx.rotate(-.05); P(ctx, -120, -26, 240, 30, 4, "#E8A55B", 4); P(ctx, -100, -20, 200, 18, 3, "#FFFDF8", 0); T(ctx, "WIJAYA · 12 TOKO", 0, -6, 15, { align: "center", col: MAROON, w: 800 }); ctx.restore(); } });
    } };

  // lobi kantor: dinding logo besar, meja resepsionis (o.deskX), sofa, pintu kaca dengan cahaya luar, tanaman
  LOC.lobi = { bounds: [-200, 2120, -200, 1300], grade: { warm: .1, vig: .42 }, def: { time: "pagi" },
    bg(ctx, c, t, o){ const time = o.time || "pagi";
      layer(ctx, c, .35, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#EFE5D6"], [1, "#DDCDB5"]]));
        // pintu kaca kiri
        ctx.save(); rr(ctx, 60, 60, 560, 700, 6); ctx.clip(); U.sky(ctx, 60, 60, 560, 700, time, t, 12); U.skyline(ctx, 60, 60, 560, 600, time, t, 12, 1.1); ctx.fillStyle = "#8E8A86"; ctx.fillRect(60, 600, 560, 160); ctx.restore();
        ctx.strokeStyle = "#8D97A3"; ctx.lineWidth = 14; ctx.strokeRect(60, 60, 560, 700); ctx.beginPath(); ctx.moveTo(340, 60); ctx.lineTo(340, 760); ctx.stroke(); ctx.fillStyle = "#5C6670"; rr(ctx, 312, 380, 12, 120, 6); ctx.fill(); rr(ctx, 356, 380, 12, 120, 6); ctx.fill();
        // dinding logo
        P(ctx, 880, 70, 820, 360, 16, NAVY, 6); ctx.save(); ctx.beginPath(); ctx.arc(1050, 250, 110, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 1050, 250, 150); ctx.restore();
        T(ctx, "TANGANI", 1420, 240, 84, { align: "center", col: "#FFF", track: 6 }); T(ctx, "Talenta · Kasir · Aplikasi UMKM", 1420, 300, 28, { align: "center", col: "#A9BCDD", w: 600 });
        glow(ctx, 1290, 250, 600, "#FFD9A0", .12 + .04 * Math.sin(t * 1.3)); });
      layer(ctx, c, .75, () => { U.floor(ctx, 760, [[0, "#E4DACB"], [1, "#C9BBA6"]], false, t);
        ctx.strokeStyle = "rgba(59,36,24,.1)"; ctx.lineWidth = 3; for (let k = -20; k < 30; k++){ ctx.beginPath(); ctx.moveTo(960 + k * 180, 760); ctx.lineTo(960 + k * 420, 1400); ctx.stroke(); } for (let y = 820; y < 1400; y += 90){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); }
        // sofa tamu
        P(ctx, 1820, 640, 420, 120, 30, "#2F6F73", 6); P(ctx, 1800, 720, 460, 90, 24, "#3E8086", 6); U.plant(ctx, 760, 760, 1.1, t); });
      layer(ctx, c, 1, () => { const x = o.deskX ?? 1250, y = 1000, sl = o.slam != null ? Math.max(0, 1 - Math.abs(t - o.slam) / .25) : 0; ctx.save(); ctx.translate(x, y + sl * 4);
        ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, 480, 22, 0, 0, TAU); ctx.fill();
        P(ctx, -440, -300, 880, 300, 16, "#FFFDF8", 6); ctx.fillStyle = ORANGE; ctx.fillRect(-440, -110, 880, 26); P(ctx, -470, -330, 940, 44, 12, "#B5643C", 6);
        S.drawLogo(ctx, -300, -200, 70); T(ctx, "RESEPSIONIS", 60, -184, 34, { align: "center", col: NAVY, track: 4 });
        P(ctx, 220, -400, 120, 70, 8, "#544E42", 4); P(ctx, -160, -350, 70, 22, 6, "#C9D6DA", 3); // monitor + bel
        if (sl > 0){ ctx.strokeStyle = OUT; ctx.lineWidth = 6; for (let k = 0; k < 5; k++){ const a = -Math.PI + k * .3 + .3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 90 + (o.slamX ?? -260), -330 + Math.sin(a) * 50); ctx.lineTo(Math.cos(a) * (130 + sl * 50) + (o.slamX ?? -260), -330 + Math.sin(a) * (80 + sl * 40)); ctx.stroke(); } }
        ctx.restore(); });
    } };

  // gudang: rak besi + kardus PERANGKAT KASIR, palet, pintu gulung, lampu gantung
  LOC.gudang = { bounds: [-200, 2120, -200, 1300], grade: { warm: .08, vig: .55 }, def: {},
    bg(ctx, c, t, o){
      layer(ctx, c, .4, () => { fillAll(ctx, lg(ctx, 0, -300, 0, 760, [[0, "#9C978C"], [1, "#7E796F"]]));
        // pintu gulung
        P(ctx, 1380, 40, 620, 720, 6, "#B9BDC2", 6); ctx.strokeStyle = "rgba(43,43,50,.3)"; ctx.lineWidth = 4; for (let y = 70; y < 760; y += 34){ ctx.beginPath(); ctx.moveTo(1380, y); ctx.lineTo(2000, y); ctx.stroke(); }
        P(ctx, 1540, 120, 300, 70, 8, YEL, 4); T(ctx, "AREA BONGKAR", 1690, 168, 28, { align: "center", col: OUT, track: 2 });
        // rak besi + kardus
        [[-120, 0], [560, 1]].forEach(([x0, j]) => { ctx.fillStyle = "#3E5C7E"; ctx.fillRect(x0, 40, 20, 720); ctx.fillRect(x0 + 640, 40, 20, 720); for (let r = 0; r < 3; r++){ ctx.fillStyle = "#E8A55B"; ctx.fillRect(x0, 250 + r * 230, 660, 16);
          for (let k = 0; k < 4; k++){ const bx = x0 + 30 + k * 152, bh = 130 + rnd(r * 4 + k + j * 13) * 50; P(ctx, bx, 250 + r * 230 - bh, 140, bh, 4, "#C9965E", 4); ctx.fillStyle = "#A8794A"; ctx.fillRect(bx + 60, 250 + r * 230 - bh, 20, bh);
            if ((k + r + j) % 2 === 0) { P(ctx, bx + 12, 250 + r * 230 - bh + 20, 116, 30, 3, "#FFFDF8", 2); T(ctx, "KASIR", bx + 70, 250 + r * 230 - bh + 42, 18, { align: "center", col: MAROON, w: 800 }); } } } }); });
      layer(ctx, c, .75, () => { U.floor(ctx, 760, [[0, "#A8A398"], [1, "#8A857B"]], false, t); ctx.fillStyle = YEL; for (let x = -800; x < 3000; x += 160) { ctx.save(); ctx.translate(x, 900); ctx.transform(1, 0, -.6, 1, 0, 0); ctx.fillRect(0, 0, 80, 16); ctx.restore(); }
        // tumpukan kardus di lantai (o.boxes)
        (o.boxes || [[1500, 3], [1760, 2]]).forEach(([x, n], i) => { for (let k = 0; k < n; k++){ P(ctx, x - 110 + (k % 2) * 16, 760 - (k + 1) * 120, 220, 120, 4, "#C9965E", 5); ctx.fillStyle = "#A8794A"; ctx.fillRect(x - 10 + (k % 2) * 16, 760 - (k + 1) * 120, 20, 120);
          P(ctx, x - 80 + (k % 2) * 16, 760 - (k + 1) * 120 + 30, 160, 44, 4, "#FFFDF8", 3); T(ctx, k === n - 1 && o.wrong ? "TIPE SALAH" : "PERANGKAT KASIR", x + (k % 2) * 16, 760 - (k + 1) * 120 + 60, 16, { align: "center", col: k === n - 1 && o.wrong ? RED : BROWN, w: 800 }); } });
        U.lamp(ctx, 500, -200, 200, t, 0, true, "#5E5A62"); U.lamp(ctx, 1300, -200, 200, t, 1, true, "#5E5A62"); });
    } };

  /* ============================== EFEK LAYAR ============================== */
  // aplikasi lowongan: kartu lowongan + tombol "Lamar Sekarang", jempol melayang; formAt → formulir setengah jadi; saveAt → "Simpan sebagai draf"
  FX.jobApp = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.05) * (1 + q * .012); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: !!f.night, skin: "#C98B62" }, f), z);
    const fA = tm(f, f.formAt), sA = tm(f, f.saveAt), form = fA != null && t > fA;
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y, w, h); ctx.fillStyle = TEAL; ctx.fillRect(x, y, w, 110); T(ctx, "LokerKu", x + 30, y + 72, 34, { col: "#FFF" }); T(ctx, form ? "Formulir lamaran" : "Lowongan untukmu", x + w - 24, y + 70, 20, { align: "right", col: "#CFE7E5", w: 700 });
    if (!form){
      P(ctx, x + 20, y + 130, w - 40, 420, 18, "#FFFFFF", 2, "#E5E7EB"); P(ctx, x + 40, y + 150, 80, 80, 14, "#5B7DB1", 0); T(ctx, "NR", x + 80, y + 202, 30, { align: "center", col: "#FFF" });
      T(ctx, "Customer Service", x + 140, y + 182, 28, { col: "#111827" }); T(ctx, "Supervisor", x + 140, y + 218, 28, { col: "#111827" }); T(ctx, "PT Niaga Raya · Jakarta", x + 40, y + 280, 22, { col: "#6B7280", w: 600 });
      const gq = pop(t, tm(f, f.payAt, .5), .4); chip(ctx, x + 150, y + 340, gq, "Gaji lebih tinggi", GREEN, "#FFF", 20, 0);
      ["Purnawaktu · Kantor", "Pengalaman CS 2+ tahun", "Ditutup 3 hari lagi"].forEach((l, i) => T(ctx, "• " + l, x + 40, y + 410 + i * 40, 20, { col: "#374151", w: 600 }));
      const pulse = 1 + .03 * Math.sin(t * 5); ctx.save(); ctx.translate(x + w / 2, y + h - 110); ctx.scale(pulse, pulse); P(ctx, -180, -44, 360, 88, 44, ORANGE, 5, OUT); T(ctx, "Lamar Sekarang", 0, 12, 32, { align: "center", col: "#FFF" }); ctx.restore();
      const hA = tm(f, f.hoverAt, 1.2), hq = easeIO(clamp((t - hA) / 1.2, 0, 1)); if (hq > 0){ const hov = Math.sin(t * 2.2) * 18; thumb(ctx, x + w / 2 + 120 + (1 - hq) * 240, y + h - 70 + (1 - hq) * 300 + hov - 20, f.skin || "#C98B62", 0); }
    } else {
      const fq = clamp((t - fA) / .35, 0, 1); ctx.globalAlpha = fq;
      T(ctx, "Customer Service Supervisor", x + 30, y + 160, 24, { col: "#111827" }); P(ctx, x + 30, y + 186, w - 60, 18, 9, "#E5E7EB", 0); const pr = lerp(.15, .5, clamp((t - fA - .3) / 1.6, 0, 1)); P(ctx, x + 30, y + 186, (w - 60) * pr, 18, 9, ORANGE, 0);
      T(ctx, `${Math.round(pr * 100)}% terisi`, x + w - 30, y + 236, 20, { align: "right", col: ORANGE, w: 800 });
      [["Nama lengkap", "Rina"], ["Pengalaman", "3 tahun · Tangani"], ["Alasan pindah", ""], ["Surat lamaran", ""]].forEach(([k0, v], i) => { const yy = y + 270 + i * 120; T(ctx, k0, x + 30, yy, 20, { col: "#6B7280", w: 600 }); P(ctx, x + 30, yy + 14, w - 60, 62, 10, "#FFFFFF", 2, v ? "#D1D5DB" : "#F0B8B0"); if (v) T(ctx, v, x + 50, yy + 54, 24, { col: "#111827", fam: F2, w: 600 }); else if (Math.sin(t * 6) > 0 && i === 2) { ctx.fillStyle = "#111827"; ctx.fillRect(x + 50, yy + 30, 3, 32); } });
      const saved = sA != null && t > sA; P(ctx, x + 30, y + h - 140, w - 60, 80, 40, saved ? GREEN : "#FFFFFF", 4, saved ? OUT : TEAL); T(ctx, saved ? "✓ Draf tersimpan" : "Simpan sebagai draf", x + w / 2, y + h - 88, 26, { align: "center", col: saved ? "#FFF" : TEAL });
      if (sA != null){ const tq = clamp((t - sA + .8) / .6, 0, 1), pr2 = t > sA - .1 && t < sA + .2 ? 1 : 0; if (tq > 0 && t < sA + 1.4) thumb(ctx, x + w / 2 + 60, y + h - 70 + (1 - tq) * 240, f.skin || "#C98B62", pr2); }
      ctx.globalAlpha = 1; }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1500, f.chipY ?? 200, pop(t, tm(f, f.chipAt, .6), .4), f.chip, f.chipBg || MAROON, "#FFF", 36); },
    sfx(f, g, add){ add(g(f.at + .1), "notif", .5); if (f.formAt != null) add(g(tm(f, f.formAt)), "click", .4); if (f.saveAt != null) add(g(tm(f, f.saveAt)), "tap", .7); else add(g(tm(f, f.hoverAt, 1.2)) + 1.2, "tick", .25); } };

  // kertas penilaian: kotak nilai; pick = indeks yang dilingkari; banner = stempel tambahan ("TERBAIK DI TIM")
  FX.review = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, desk = f.bg === "desk";
    fillAll(ctx, desk ? lg(ctx, 0, 0, 0, SH, [[0, "#B5643C"], [1, "#8E4E2E"]]) : lg(ctx, 0, 0, 0, SH, [[0, "#B7A48C"], [1, "#8F7E68"]]));
    if (desk){ ctx.fillStyle = "rgba(255,255,255,.06)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, k * 130, SW, 4); } else { const fl = Math.sin(t * 23) > .95 ? .14 : 0; ctx.fillStyle = `rgba(0,0,0,${fl})`; ctx.fillRect(0, 0, SW, SH); }
    const z = 1 + q * (f.push ?? .02); ctx.save(); ctx.translate(960, 600); ctx.scale(z, z); ctx.rotate(-.03 + Math.sin(t * .8) * .01);
    const sA = tm(f, f.stampAt, 1), bA = tm(f, f.bannerAt), labels = f.labels || ["ISTIMEWA", "BAIK", "CUKUP", "KURANG"], pick = f.pick ?? 2, col = f.col || RED;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, -460, -480, 920, 1000, 8, "#FFFFFF", 0); ctx.restore(); P(ctx, -460, -480, 920, 1000, 8, "#FFFFFF", 5);
    ctx.fillStyle = NAVY; ctx.fillRect(-460, -480, 920, 100); S.drawLogo(ctx, -390, -430, 56); T(ctx, f.title || "PENILAIAN KINERJA TAHUNAN", 40, -416, 34, { align: "center", col: "#FFF" });
    [["Nama", f.name || "Rina"], ["Jabatan", "Staf Layanan Pelanggan"], ["Periode", f.period || "Januari – Desember"]].forEach(([k0, v], i) => { T(ctx, k0, -400, -300 + i * 60, 28, { col: "#6B7280", w: 600 }); T(ctx, ": " + v, -210, -300 + i * 60, 30, { col: "#111827", fam: F2, w: 700 }); });
    T(ctx, "Nilai akhir", -400, -70, 30, { col: "#6B7280" }); const bw = 820 / labels.length;
    labels.forEach((l, i) => { const bx = -410 + i * bw, on = i === pick && t > sA; P(ctx, bx + 6, -40, bw - 12, 80, 12, on ? (col === RED ? "#FDE2DF" : "#DDF3E6") : "#F3F4F6", 3, on ? col : "#D1D5DB"); T(ctx, l, bx + bw / 2, 12, labels.length > 4 ? 20 : 24, { align: "center", col: on ? col : GREY }); });
    if (t > sA){ const k = clamp((t - sA) / .5, 0, 1); ring(ctx, -410 + pick * bw + bw / 2, 0, bw * .62, 64, k, col, 10); }
    // catatan atasan (baris tipis)
    for (let i = 0; i < 4; i++){ ctx.fillStyle = "#E5E7EB"; ctx.fillRect(-400, 120 + i * 56, 800 - i * 90, 12); }
    if (f.note) T(ctx, f.note, -400, 110, 26, { col: "#374151", fam: F2, w: 600, maxW: 800 });
    if (bA != null){ const s = t < bA ? 0 : 1 + 1.2 * (1 - eOut(clamp((t - bA) / .3, 0, 1))), a = clamp((t - bA) / .15, 0, 1); if (a > 0){ ctx.save(); ctx.globalAlpha = a * .92; ctx.translate(200, 330); ctx.rotate(-.16); ctx.scale(s, s);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 10; rr(ctx, -260, -70, 520, 140, 18); ctx.stroke(); T(ctx, f.banner || "TERBAIK DI TIM", 0, 24, 58, { align: "center", col: GREEN, track: 2 }); ctx.restore(); } }
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1600, f.chipY ?? 170, pop(t, tm(f, f.chipAt, .4), .4), f.chip, f.chipBg || "#5E5A62", "#FFF", 34); },
    sfx(f, g, add){ add(g(tm(f, f.stampAt, 1)), "scribble", .7, .5); if (f.bannerAt != null) add(g(tm(f, f.bannerAt)), "stamp", .9); } };

  // berkas penilaian setahun: 12 batang (10 abu-abu "cara lama", 2 oranye "cara baru") + 2 catatan distabilo
  FX.yearFile = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#3B4A63"], [1, "#22304A"]])); U.motes(ctx, t, 20, 5, 0, 0, SW, SH, "#CFE0FF", .25);
    const z = 1 + q * .012; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    P(ctx, 220, 60, 1480, 960, 18, "#FFFDF8", 6); ctx.fillStyle = NAVY; ctx.fillRect(220, 60, 1480, 96); S.drawLogo(ctx, 290, 108, 50); T(ctx, "Berkas penilaian · Rina", 340, 122, 38, { col: "#FFF" }); T(ctx, "12 bulan terakhir", 1650, 120, 26, { align: "right", col: "#A9BCDD", w: 600 });
    const M = f.months || ["MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES", "JAN", "FEB"], bA = tm(f, f.barsAt, .3), base = 560, bw = 98;
    const vals = [.42, .38, .45, .35, .4, .44, .36, .41, .37, .43, .66, .78];
    M.forEach((m, i) => { const g = eOut(clamp((t - bA - i * .1) / .6, 0, 1)), isNew = i >= 10, bh = 300 * vals[i] * g, bx = 300 + i * 112;
      P(ctx, bx, base - bh, bw - 18, Math.max(3, bh), [10, 10, 2, 2], isNew ? ORANGE : "#B8BEC8", 0); T(ctx, m, bx + (bw - 18) / 2, base + 40, 22, { align: "center", col: isNew ? ORANGE : "#6B7280" }); });
    ctx.fillStyle = "#D1D5DB"; ctx.fillRect(290, base, 1350, 4);
    const lq = pop(t, tm(f, f.legendAt, 1.6), .4); if (lq > 0){ ctx.save(); ctx.globalAlpha = Math.min(1, lq);
      ctx.strokeStyle = "#6B7280"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(300, 200); ctx.lineTo(300, 180); ctx.lineTo(1400, 180); ctx.lineTo(1400, 200); ctx.stroke(); T(ctx, "10 bulan · cara lama", 850, 166, 28, { align: "center", col: "#6B7280" });
      ctx.strokeStyle = ORANGE; ctx.beginPath(); ctx.moveTo(1420, 200); ctx.lineTo(1420, 180); ctx.lineTo(1620, 180); ctx.lineTo(1620, 200); ctx.stroke(); T(ctx, "2 bulan · cara baru", 1520, 166, 26, { align: "center", col: ORANGE }); ctx.restore(); }
    const notes = f.notes || ["Tiket sering melewati hari", "Masalah proyek baru dilaporkan di H-1"], nt = f.noteAt || [];
    notes.forEach((n, i) => { const na = nt[i] != null ? tm(f, nt[i]) : f.at + 2.5 + i, a = clamp((t - na) / .3, 0, 1); if (a <= 0) return; const yy = 700 + i * 130; ctx.save(); ctx.globalAlpha = a;
      T(ctx, `Catatan ${i + 1}`, 320, yy, 24, { col: "#6B7280", w: 700 }); font(ctx, 700, 40, F2); const tw = ctx.measureText(n).width; const hq = clamp((t - na - .3) / .6, 0, 1);
      ctx.fillStyle = "rgba(246,195,67,.55)"; ctx.fillRect(310, yy + 18, (tw + 30) * hq, 56); T(ctx, n, 320, yy + 60, 40, { col: "#111827", fam: F2, w: 700 }); ctx.restore(); });
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.barsAt, .3)), "riser", .4, 1.4); (f.noteAt || [null, null]).forEach((v, i) => add(g(v != null ? tm(f, v) : f.at + 2.5 + i) + .3, "scribble", .5, .5)); } };

  // daftar sembilan hal: tulisan tangan di kertas bergaris; writeAt[] per baris (atau writeStart + per); strikeAt[] per baris yang dicoret (KEEP tidak dicoret); circleAt → 2 sisa dilingkari
  const NINE = ["Belajar Excel lanjutan", "Bikin templat balasan baru", "Ikut semua rapat", "Ambil semua tugas tambahan", "Ikut kursus daring", "Tuntaskan keluhan di hari yang sama", "Pegang pelatihan karyawan baru", "Laporkan progres sebelum ditanya", "Lembur tiap hari"];
  FX.nineList = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, items = f.items || NINE, keep = f.keep || [5, 7], night = !!f.night;
    fillAll(ctx, night ? lg(ctx, 0, 0, 0, SH, [[0, "#3A2E40"], [1, "#221A28"]]) : lg(ctx, 0, 0, 0, SH, [[0, "#B5643C"], [1, "#8E4E2E"]])); if (night) glow(ctx, 1500, 200, 700, "#FFD9A0", .22);
    const z = 1 + q * (f.push ?? .01); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.025); ctx.translate(-960, -540);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; P(ctx, 420, 30, 1080, 1020, 6, "#FFFDF4", 0); ctx.restore(); P(ctx, 420, 30, 1080, 1020, 6, "#FFFDF4", 4);
    ctx.strokeStyle = "rgba(91,125,177,.3)"; ctx.lineWidth = 2; for (let y = 200; y < 1040; y += 92){ ctx.beginPath(); ctx.moveTo(440, y); ctx.lineTo(1480, y); ctx.stroke(); } ctx.strokeStyle = "rgba(217,72,59,.4)"; ctx.beginPath(); ctx.moveTo(530, 40); ctx.lineTo(530, 1040); ctx.stroke();
    T(ctx, f.title || "Yang harus kuperbaiki:", 560, 150, 48, { col: "#1F4E8C", fam: F2, w: 800 });
    const W = f.writeAt, wS = tm(f, f.writeStart, .3), per = f.per ?? .5, sk = f.strikeAt || [], cA = tm(f, f.circleAt);
    let pen = null; let si = 0;
    items.forEach((it, i) => { const wa = W ? (W[i] != null ? tm(f, W[i]) : -1e9) : (f.written ? -1e9 : wS + i * per), wq = clamp((t - wa) / .45, 0, 1), yy = 186 + i * 92; if (wq <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(540, yy - 10, 940 * wq, 92); ctx.clip(); T(ctx, `${i + 1}. ${it}`, 560, yy + 66, 44, { col: "#1F4E8C", fam: F2, w: 700 }); ctx.restore();
      if (wq < 1) pen = [560 + 900 * wq, yy + 60, "#1F4E8C"];
      if (!keep.includes(i)){ const sa = sk[si] != null ? tm(f, sk[si]) : null; si++; if (sa != null){ const k = clamp((t - sa) / .35, 0, 1); font(ctx, 700, 44, F2); const tw = ctx.measureText(`${i + 1}. ${it}`).width; scribble(ctx, 550, 570 + tw, yy + 52, k, RED, 9); if (k > 0 && k < 1) pen = [lerp(550, 570 + tw, k), yy + 52, RED]; } } });
    if (cA != null){ const k = clamp((t - cA) / .6, 0, 1); keep.forEach((i, j) => { const kk = clamp(k * 2 - j, 0, 1); ring(ctx, 900, 186 + i * 92 + 50, 420, 52, kk, GREEN, 8); }); }
    if (pen) marker(ctx, pen[0], pen[1], pen[2]);
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1660, f.chipY ?? 160, pop(t, tm(f, f.chipAt, .4), .4), f.chip, f.chipBg || MAROON, "#FFF", 34); },
    sfx(f, g, add){ const items = f.items || NINE; if (f.writeAt) f.writeAt.forEach(v => v != null && add(g(tm(f, v)), "scribble", .45, .45)); else if (!f.written) items.forEach((_, i) => add(g(tm(f, f.writeStart, .3) + i * (f.per ?? .5)), "scribble", .4, .4));
      (f.strikeAt || []).forEach(v => add(g(tm(f, v)), "scribble", .7, .35)); if (f.circleAt != null) add(g(tm(f, f.circleAt)), "ping", .6); } };

  // grafik garis: vals[] per label, opsional garis rata-rata (avg), warna segmen akhir (lastCol), bendera teks (flag)
  FX.lineChart = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]])); U.motes(ctx, t, 26, 3, 0, 0, SW, SH, "#9FB9E8", .35);
    const z = 1 + q * (f.push ?? .02); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    P(ctx, 220, 80, 1480, 920, 24, "#13223D", 5, "#2B4A7A"); T(ctx, f.title || "Waktu balas Rina", 290, 170, 50, { col: "#FFF" }); if (f.sub) T(ctx, f.sub, 290, 220, 28, { col: "#A9BCDD", w: 600 });
    const L = f.labels, V = f.vals, mn = f.min ?? 0, mx = f.max ?? 100, X0 = 360, X1 = 1600, Y0 = 880, Y1 = 300, X = i => lerp(X0, X1, i / (L.length - 1)), Y = v => lerp(Y0, Y1, (v - mn) / (mx - mn));
    ctx.strokeStyle = "rgba(169,188,221,.18)"; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++){ const yy = lerp(Y0, Y1, k / 4); ctx.beginPath(); ctx.moveTo(X0 - 20, yy); ctx.lineTo(X1 + 20, yy); ctx.stroke(); T(ctx, String(Math.round(lerp(mn, mx, k / 4))) + (f.unit || ""), X0 - 40, yy + 10, 24, { align: "right", col: "#A9BCDD", w: 600 }); }
    L.forEach((l, i) => T(ctx, l, X(i), Y0 + 56, 26, { align: "center", col: "#DCE6F5" }));
    if (f.yNote) T(ctx, f.yNote, X1 + 10, Y1 - 40, 24, { align: "right", col: f.yNoteCol || "#A9BCDD", w: 700 });
    if (f.avg != null){ const aq = clamp((t - tm(f, f.avgAt, .2)) / .6, 0, 1); if (aq > 0){ ctx.save(); ctx.setLineDash([18, 14]); ctx.strokeStyle = "#A9BCDD"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(X0, Y(f.avg)); ctx.lineTo(lerp(X0, X1, aq), Y(f.avg)); ctx.stroke(); ctx.restore(); T(ctx, f.avgLabel || "rata-rata tim", X1, Y(f.avg) - 18, 24, { align: "right", col: "#A9BCDD", w: 700 }); } }
    const dA = tm(f, f.drawAt, .4), dD = f.drawDur || 3, prog = clamp((t - dA) / dD, 0, 1) * (L.length - 1), lastFrom = f.lastFrom ?? L.length - 2;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let i = 0; i < L.length - 1; i++){ const k = clamp(prog - i, 0, 1); if (k <= 0) break; ctx.strokeStyle = i >= lastFrom && f.lastCol ? f.lastCol : (f.col || ORANGE); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(X(i), Y(V[i])); ctx.lineTo(lerp(X(i), X(i + 1), k), lerp(Y(V[i]), Y(V[i + 1]), k)); ctx.stroke(); }
    for (let i = 0; i <= Math.floor(prog); i++){ const col = i > lastFrom && f.lastCol ? f.lastCol : (f.col || ORANGE); ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(X(i), Y(V[i]), 14, 0, TAU); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke(); }
    if (prog > 0){ const i = Math.min(Math.floor(prog), L.length - 2), k = prog - i, hx = lerp(X(i), X(i + 1), k), hy = lerp(Y(V[i]), Y(V[i + 1]), k); glow(ctx, hx, hy, 60, f.lastCol && i >= lastFrom ? f.lastCol : ORANGE, .5); }
    if (f.flag){ const fa = tm(f, f.flag.t, dD + .6), fq = pop(t, fa, .4); if (fq > 0){ const i = f.flag.i ?? L.length - 1; chip(ctx, X(i) + (f.flag.dx ?? -120), Y(V[i]) + (f.flag.dy ?? -90), fq, f.flag.text, f.flag.col || RED, "#FFF", 34, -.03); } }
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.drawAt, .4)), f.lastCol ? "riser" : "rise", .5, f.drawDur || 3); if (f.flag) add(g(tm(f, f.flag.t, (f.drawDur || 3) + .6)), f.flag.col === GREEN ? "chime" : "dun", .8); } };

  // peringkat tim (grafik Yoga): Rina naik ke urutan teratas
  FX.rankTop = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]])); U.motes(ctx, t, 26, 3, 0, 0, SW, SH, "#9FB9E8", .35);
    const z = 1 + q * .02; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    P(ctx, 300, 70, 1320, 960, 24, "#13223D", 5, "#2B4A7A"); T(ctx, f.title || "Tiket tuntas di hari yang sama", 360, 160, 46, { col: "#FFF" }); T(ctx, f.sub || "Tim Layanan Pelanggan · Mei", 360, 208, 28, { col: "#A9BCDD", w: 600 });
    const rows = [["Rina", .96], ["Sinta", .91], ["Dewi", .86], ["Fajar", .8], ["Lia", .74], ["Agus", .7]], start = ["Sinta", "Dewi", "Fajar", "Lia", "Agus", "Rina"], rA = tm(f, f.riseAt, 1), rq = easeIO(clamp((t - rA) / 1.6, 0, 1));
    rows.forEach(([n, v], iEnd) => { const iStart = start.indexOf(n), pos = lerp(iStart, iEnd, rq), yy = 250 + pos * 120, isR = n === "Rina", g = eOut(clamp((q - .3 - iStart * .12) / .8, 0, 1)), vv = isR ? lerp(.58, v, rq) : v;
      if (isR && rq > .9){ ctx.save(); ctx.globalAlpha = .35 + .3 * Math.sin(t * 5); P(ctx, 330, yy - 4, 1260, 100, 18, ORANGE, 0); ctx.restore(); }
      T(ctx, n.toUpperCase(), 380, yy + 60, 40, { col: isR ? "#FFD9A0" : "#DCE6F5" }); P(ctx, 640, yy + 18, 820 * vv * g, 60, 14, isR ? ORANGE : BLUE, 0);
      if (g > .9) T(ctx, `${Math.round(vv * 100)}%`, 640 + 820 * vv * g + 18, yy + 60, 32, { col: "#FFF" });
      if (isR && rq > .95){ const sq = pop(t, rA + 1.6, .4); ctx.save(); ctx.translate(345, yy + 46); ctx.scale(sq, sq); ctx.fillStyle = YEL; ctx.beginPath(); for (let k = 0; k < 10; k++){ const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 14 : 32; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } });
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1500, f.chipY ?? 980, pop(t, tm(f, f.chipAt, 3), .4), f.chip, f.chipBg || "#5E5A62", "#FFF", 32); },
    sfx(f, g, add){ add(g(tm(f, f.riseAt, 1)), "rise", .7); add(g(tm(f, f.riseAt, 1)) + 1.6, "chime", .7); } };

  // email di ponsel (malam): "Lamaran Anda belum selesai. Lanjutkan?" → jempol menekan "Hapus draf" → "Draf dihapus"
  FX.jobMail = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.06) * (1 + q * .012); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: true, skin: "#C98B62" }, f), z);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y, w, h); ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, 110); T(ctx, "Kotak masuk", x + 30, y + 72, 32, { col: "#FFF" });
    const mA = tm(f, f.mailAt, .2), dA = tm(f, f.delAt, 2.5), mq = pop(t, mA, .4), gone = clamp((t - dA - .25) / .4, 0, 1);
    [["Promo Kopi Kita", "Diskon 20% minggu ini"], ["Bank Sentosa", "e-Statement April"]].forEach(([a, b], i) => { const yy = y + 380 + i * 120 - gone * 0; P(ctx, x + 16, yy, w - 32, 104, 14, "#FFFFFF", 2, "#E5E7EB"); T(ctx, a, x + 36, yy + 42, 22, { col: "#374151" }); T(ctx, b, x + 36, yy + 78, 20, { col: GREY, w: 600 }); });
    if (mq > 0 && gone < 1){ ctx.save(); ctx.globalAlpha = 1 - gone; ctx.translate(x + w / 2, y + 240); ctx.scale(mq * (1 - .2 * gone), mq * (1 - .2 * gone));
      P(ctx, -w / 2 + 16, -110, w - 32, 236, 16, "#FFFFFF", 4, TEAL); T(ctx, "LokerKu", -w / 2 + 40, -66, 22, { col: TEAL }); T(ctx, "Lamaran Anda belum selesai.", -w / 2 + 40, -24, 24, { col: "#111827", fam: F2, w: 700 }); T(ctx, "Lanjutkan sekarang?", -w / 2 + 40, 12, 24, { col: "#111827", fam: F2, w: 700 });
      const pr = t > dA - .08 && t < dA + .25; P(ctx, -w / 2 + 40, 44, 170, 56, 28, TEAL, 0); T(ctx, "Lanjutkan", -w / 2 + 125, 82, 22, { align: "center", col: "#FFF" }); P(ctx, 10, 44, 170, 56, 28, pr ? "#FDE2DF" : "#FFFFFF", 3, RED); T(ctx, "Hapus draf", 95, 82, 22, { align: "center", col: RED }); ctx.restore(); }
    const tq = clamp((t - dA + 1.2) / .9, 0, 1); if (tq > 0 && t < dA + 1.2) thumb(ctx, x + w / 2 + 120, y + 330 + (1 - tq) * 420, f.skin || "#C98B62", t > dA - .08 && t < dA + .25 ? 1 : 0);
    if (gone > 0){ const s = pop(t, dA + .5, .35); ctx.save(); ctx.translate(x + w / 2, y + h - 120); ctx.scale(s, s); P(ctx, -170, -36, 340, 72, 36, "#111827", 0); T(ctx, "✓ Draf dihapus", 0, 10, 24, { align: "center", col: "#FFF" }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.mailAt, .2)), "notif", .7); add(g(tm(f, f.delAt, 2.5)), "tap", .8); add(g(tm(f, f.delAt, 2.5)) + .4, "whoosh", .4); } };

  // grafik datar kecil di atas kepala tokoh (layar, mengikuti jangkar balon)
  FX.headChart = { layer: "screen", draw(ctx, f, t){ const an = S.anchors[f.who || "bayu"]; if (!an || an.frame !== S.frameId) return; const s = pop(t, f.at, .4) * (f.scale || 1); if (s <= 0) return;
    const fo = f.out != null ? 1 - clamp((t - f.out) / .3, 0, 1) : 1; if (fo <= 0) return; ctx.save(); ctx.globalAlpha = fo; ctx.translate(an.top[0] + (f.dx ?? 0), an.top[1] - (f.dy ?? 150) + Math.sin(t * 2) * 6); ctx.scale(s, s);
    P(ctx, -150, -90, 300, 180, 18, "#FFFDF8", 5, OUT); ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-120, 50); ctx.lineTo(120, 50); ctx.moveTo(-120, 50); ctx.lineTo(-120, -60); ctx.stroke();
    const k = clamp((t - f.at - .3) / 1.2, 0, 1); ctx.strokeStyle = GREY; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-110, 0); for (let j = 1; j <= 20 * k; j++) ctx.lineTo(-110 + j * 11, Math.sin(j * 1.7) * 3); ctx.stroke();
    T(ctx, f.label || "DATAR", 0, -52, 24, { align: "center", col: "#6B7280", track: 2 }); ctx.restore(); } };

  // papan hitung mundur "7 HARI"
  FX.countdown = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#3A1E22"], [1, "#1A0E10"]])); glow(ctx, 960, 520, 700, RED, .2 + .08 * Math.sin(t * 6));
    const z = 1 + q * .03; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(Math.sin(t * .8) * .01);
    P(ctx, -520, -330, 1040, 600, 30, "#13223D", 8, OUT); T(ctx, f.top || "PEMBUKAAN 12 TOKO WIJAYA", 0, -230, 40, { align: "center", col: "#FFD9A0", track: 3 });
    const n0 = f.from ?? 9, n1 = f.to ?? 7, n = Math.round(lerp(n0, n1, clamp((q - .3) / 1, 0, 1))), fl = (q - .3) % 1;
    P(ctx, -170, -170, 340, 330, 24, "#0B1426", 5, "#2B4A7A"); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(-170, -8, 340, 6); T(ctx, String(n), 0, 110, 280, { align: "center", col: RED });
    T(ctx, f.unit || "HARI LAGI", 0, 230, 56, { align: "center", col: "#FFF", track: 4 }); ctx.restore(); },
    sfx(f, g, add){ for (let k = 0; k < 3; k++) add(g(f.at + .3 + k * .5), "tick", .6); add(g(f.at + 1.4), "dun", .8); } };

  // foto lama di galeri ponsel: Rina di hari pertama dengan kartu identitas baru
  FX.oldPhoto = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.06) * (1 + q * .012); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: true, skin: "#C98B62" }, f), z);
    ctx.fillStyle = "#111"; ctx.fillRect(x, y, w, h); T(ctx, "Galeri", x + 30, y + 64, 26, { col: "#FFF" }); T(ctx, f.date || "3 tahun lalu", x + w - 30, y + 64, 22, { align: "right", col: GREY, w: 600 });
    ctx.save(); rr(ctx, x, y + 110, w, 620, 0); ctx.clip(); fillAll(ctx, "#EFE5D6"); ctx.fillStyle = NAVY; ctx.fillRect(x, y + 120, w, 300); ctx.beginPath(); ctx.arc(x + 110, y + 230, 60, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, x + 110, y + 230, 84); T(ctx, "TANGANI", x + 300, y + 250, 50, { align: "center", col: "#FFF", track: 4 });
    ctx.save(); ctx.translate(x + w / 2, y + 740); toon(ctx, "rina", 0, -20, 400, { pose: "cheer", expr: "laugh" }, q, { idcard: "#C2691F" }); ctx.restore();
    ctx.fillStyle = "rgba(255,230,180,.12)"; ctx.fillRect(x, y + 110, w, 620); ctx.restore();
    T(ctx, f.caption || "Hari pertama di Tangani", x + 30, y + 790, 28, { col: "#FFF" }); T(ctx, "♡  Bagikan  ·  Hapus", x + 30, y + 840, 22, { col: GREY, w: 600 });
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1500, f.chipY ?? 200, pop(t, tm(f, f.chipAt, .6), .4), f.chip, f.chipBg || ORANGE, "#FFF", 36); } };

  // kursus daring tengah malam: layar laptop (video pelajaran Excel + progres), jam 23.xx, nguap
  FX.course = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#2A2346"], [1, "#120E20"]])); glow(ctx, 960, 520, 900, "#9FB9E8", .18);
    const z = 1 + q * .02; ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
    P(ctx, 260, 90, 1400, 860, 30, "#2B2B33", 8, OUT); ctx.fillStyle = "#F3F4F6"; ctx.fillRect(300, 130, 1320, 780); ctx.fillStyle = "#1F7A4D"; ctx.fillRect(300, 130, 1320, 80); T(ctx, f.title || "Kursus Excel Lanjutan · Modul 4: Pivot Table", 340, 184, 32, { col: "#FFF" });
    // spreadsheet
    for (let r = 0; r < 9; r++) for (let c2 = 0; c2 < 7; c2++){ ctx.strokeStyle = "#D1D5DB"; ctx.lineWidth = 2; ctx.strokeRect(340 + c2 * 150, 240 + r * 56, 150, 56); if (r === 0){ ctx.fillStyle = "#E5E7EB"; ctx.fillRect(341 + c2 * 150, 241, 148, 54); } else if (rnd(r * 7 + c2) > .35) { ctx.fillStyle = "#9CA3AF"; ctx.fillRect(360 + c2 * 150, 262 + r * 56, 60 + rnd(r + c2) * 60, 12); } }
    const hl = Math.floor(q * 1.5) % 8; ctx.strokeStyle = "#1F7A4D"; ctx.lineWidth = 5; ctx.strokeRect(340 + (hl % 7) * 150, 296 + (hl % 8) * 56, 150, 56);
    // video pengajar (pojok)
    P(ctx, 1380, 640, 220, 160, 12, "#3A3552", 3); ctx.fillStyle = "#E8C07A"; ctx.beginPath(); ctx.arc(1490, 700, 34, 0, TAU); ctx.fill(); P(ctx, 1440, 740, 100, 60, 20, BLUE, 0);
    // bar progres
    P(ctx, 340, 860, 1240, 14, 7, "#D1D5DB", 0); P(ctx, 340, 860, 1240 * (.2 + q * .01), 14, 7, RED, 0); T(ctx, "12:40 / 48:15", 1580, 848, 22, { align: "right", col: "#6B7280", w: 700 });
    ctx.restore(); chip(ctx, 1640, 120, pop(t, f.at + .3, .4), f.clock || "23.12", MAROON, YEL, 40); if (f.chip) chip(ctx, 360, 1000, pop(t, tm(f, f.chipAt, .8), .4), f.chip, "#5E5A62", "#FFF", 32); } };

  // kertas "2 hal" yang ditempel di laptop, di samping catatan 3 baris
  FX.twoNote = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#6E6A72"], [1, "#4F4B55"]]));
    ctx.save(); ctx.beginPath(); ctx.arc(1520, 760, 120, 0, TAU); ctx.fillStyle = CREAM; ctx.globalAlpha = .9; ctx.fill(); S.drawLogo(ctx, 1520, 760, 150); ctx.restore();
    // catatan 3 baris (sudah ada)
    ctx.save(); ctx.translate(560 + Math.sin(t * .6) * 10, 560 + Math.sin(t * .9) * 8); ctx.scale(1 + q * .012, 1 + q * .012); ctx.rotate(-.05 + Math.sin(t * .7) * .015); P(ctx, -300, -300, 600, 600, 6, YEL, 0); ["1. Sudah selesai:", "2. Sedang dikerjakan:", "3. Butuh bantuan:"].forEach((l, i) => T(ctx, l, -260, -170 + i * 150, 44, { col: i === 2 ? RED : "#1F4E8C", fam: F2, w: 800 })); ctx.restore();
    // kertas dua hal, diselap
    const sA = tm(f, f.slapAt, .3), s = t < sA ? 0 : 1 + .35 * (1 - eOut(clamp((t - sA) / .35, 0, 1))); if (s > 0){ ctx.save(); ctx.translate(1240 + Math.sin(t * .8) * 14, 420 + Math.sin(t * 1.15) * 12); ctx.scale(s * (1 + q * .03), s * (1 + q * .03)); ctx.rotate(.05 + Math.sin(t * .9) * .02);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; P(ctx, -360, -260, 720, 520, 4, "#FFFDF4", 0); ctx.restore(); ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -260); ctx.lineTo(0, 260); ctx.stroke();
      P(ctx, -80, -290, 160, 50, 4, "rgba(240,230,200,.8)", 0); T(ctx, "FOKUS", 0, -150, 52, { align: "center", col: ORANGE, track: 4 });
      [["1. Tuntas hari ini", -30], ["2. Lapor sebelum ditanya", 100]].forEach(([l, yy], i) => { const lq = f.written ? 1 : clamp((t - sA - .5 - i * .7) / .6, 0, 1); if (lq <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-330, yy - 60, 680 * lq, 90); ctx.clip(); T(ctx, l, -310, yy, 46, { col: "#1F4E8C", fam: F2, w: 800 }); ctx.restore(); });
      const uq = clamp((t - sA - 2.2) / .5, 0, 1); if (uq > 0){ ctx.strokeStyle = ORANGE; ctx.lineWidth = 7; ctx.lineCap = "round"; [[-310, 10, 340], [-310, 140, 520]].forEach(([x0, yy, w0]) => { ctx.beginPath(); for (let j = 0; j <= 20 * uq; j++) ctx.lineTo(x0 + j / 20 * w0, yy + Math.sin(j * 1.9) * 3); ctx.stroke(); }); }
      ctx.restore(); }
    if (f.chip) chip(ctx, 1240, 860, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || GREEN, "#FFF", 36); },
    sfx(f, g, add){ const sA = tm(f, f.slapAt, .3); add(g(sA), "stamp", .7); if (!f.written){ add(g(sA + .5), "scribble", .5, .5); add(g(sA + 1.2), "scribble", .5, .5); add(g(sA + 2.2), "scribble", .4, .4); } } };
})();
