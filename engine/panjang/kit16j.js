/* STORY16 kit J — tambahan untuk Kantor Tangani: Utang Bayu Eps 2 ("Suara atasan minta transfer 25 juta. Ternyata bukan dia"). Dimuat sesudah kit16i.js.
   Efek: transferApp (layar transfer bank: rekening baru, Rp25.000.000, tombol KIRIM dengan jari melayang; opsi typeAt, badgeAt, fingerOut, stampAt, chip),
         voiceMsg (pesan suara 0:08 dari nomor tak dikenal; opsi plays = [waktu mulai putar…], labelAt (label "Pak Hendra?"), flatAt (gelombang jadi terlalu rata), chip),
         twoCol (kertas aturan dua kolom ISI / SETUJUI di papan; opsi titleAt, colsAt, neqAt, ruleAt).
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} = waktu lokal adegan (lihat tm()).
   S16.thumbs.utang2 = thumbnail (tools/panjang/thumb16.py jenis "utang2"). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", YEL = "#F6C343", GREY = "#9CA3AF";
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const WAVE = Array.from({ length: 34 }, (_, i) => .25 + rnd(i * 3 + 7) * .75);

  /* ============================== LAYAR TRANSFER ============================== */
  FX.transferApp = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .014); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#E2A77C" }, f), z);
    const stA = tm(f, f.stampAt), bdA = tm(f, f.badgeAt, 1.2), tyA = tm(f, f.typeAt, .3), foA = tm(f, f.fingerOut), stamped = stA != null && t > stA;
    ctx.fillStyle = "#F4F6F8"; ctx.fillRect(x, y, w, h); P(ctx, x, y, w, 110, 0, NAVY, 0); T(ctx, "Transfer · Rekening Kantor", 0, y + 70, 30, { align: "center", col: "#FFF" });
    T(ctx, "Rekening tujuan", x + 24, y + 160, 22, { col: "#6B7280", w: 600 }); P(ctx, x + 18, y + 176, w - 36, 130, 14, "#FFFFFF", 3, "#D1D5DB"); T(ctx, "7710 4482 91", x + 38, y + 226, 38, { col: NAVY, w: 800 }); T(ctx, "CV Sentosa Mitra Abadi", x + 38, y + 268, 26, { col: "#374151", w: 700 });
    const bs = pop(t, bdA, .4); if (bs > 0){ ctx.save(); ctx.translate(x + w - 120, y + 308); ctx.scale(bs, bs); ctx.rotate(.05); P(ctx, -96, -26, 192, 52, 12, RED, 3, OUT); T(ctx, "REKENING BARU", 0, 8, 22, { align: "center", col: "#FFF" }); ctx.restore(); }
    T(ctx, "Jumlah", x + 24, y + 350, 22, { col: "#6B7280", w: 600 }); P(ctx, x + 18, y + 366, w - 36, 120, 14, "#FFFFFF", 3, "#D1D5DB");
    const k = easeIO(clamp((t - tyA) / 1.2, 0, 1)), val = Math.round(25000000 * k), s2 = String(val).replace(/\B(?=(\d{3})+(?!\d))/g, "."); T(ctx, "Rp" + s2, x + 38, y + 450, 56, { col: NAVY, w: 800, maxW: w - 76 });
    T(ctx, "Catatan", x + 24, y + 530, 22, { col: "#6B7280", w: 600 }); P(ctx, x + 18, y + 546, w - 36, 80, 14, "#FFFFFF", 3, "#D1D5DB"); T(ctx, "Urgent · vendor baru", x + 38, y + 598, 30, { col: "#374151", w: 600 });
    const by = y + h - 120, pulse = stamped ? 1 : 1 + .025 * Math.sin(t * 6); ctx.save(); ctx.translate(0, by); ctx.scale(pulse, pulse); P(ctx, x + 30, -52, w - 60, 104, 52, stamped ? GREY : GREEN, 5, OUT); T(ctx, "KIRIM", 0, 18, 52, { align: "center", col: "#FFF", track: 3 }); ctx.restore();
    if (f.finger !== false){ const out = foA != null ? easeIO(clamp((t - foA) / .6, 0, 1)) : 0, bob = Math.sin(t * 2.6) * 7; ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(150 + out * 260, by - 120 - bob + out * 120); ctx.rotate(-.15); ctx.fillStyle = f.skin || "#E2A77C"; ctx.strokeStyle = OUT; ctx.lineWidth = 7;
      rr(ctx, -46, -40, 92, 300, 46); ctx.fill(); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(-12, -14, 14, 22, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    if (stamped){ const s = pop(t, stA, .35); ctx.save(); ctx.translate(0, y + 560); ctx.rotate(-.22); ctx.scale(s * 1.0, s * 1.0); ctx.globalAlpha = .96; P(ctx, -200, -62, 400, 124, 14, "rgba(255,246,242,.92)", 10, RED); T(ctx, "TIDAK", 0, -6, 46, { align: "center", col: RED, track: 4 }); T(ctx, "TERKIRIM", 0, 44, 46, { align: "center", col: RED, track: 4 }); ctx.restore(); }
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2.5), .4), f.chip, f.chipBg || RED, "#FFF", 40, .04); },
    sfx(f, g, add){ add(g(tm(f, f.typeAt, .3)), "scribble", .5, 1.2); if (f.badgeAt != null || true) add(g(tm(f, f.badgeAt, 1.2)), "pop", .5); if (f.stampAt != null) add(g(tm(f, f.stampAt)), "stamp", .9); } };

  /* ============================== PESAN SUARA ============================== */
  FX.voiceMsg = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .014); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#E2A77C" }, f), z);
    const lbA = tm(f, f.labelAt), flA = tm(f, f.flatAt), plays = (f.plays || [.6]).map(p => tm(f, p)), dur = f.playDur ?? 8;
    ctx.fillStyle = "#E7DED2"; ctx.fillRect(x, y, w, h); const named = lbA != null && t > lbA; S.chatHeader(ctx, x, y, w, named ? (f.labelText || "Pak Hendra?") : "+62 812-5550-0147", named ? (f.labelSub || "label dari Bayu · belum terverifikasi") : "bukan kontak tersimpan", named ? (f.labelCol || ORANGE) : "#6B7280", named ? (f.labelCh || "H") : "?", null, t);
    T(ctx, "Hari ini · 16.45", 0, y + 170, 22, { align: "center", col: "#6B7280", w: 600 }); const s = pop(t, f.at + .3, .4);
    ctx.save(); ctx.translate(x + 20, y + 210); ctx.scale(s, s); P(ctx, 0, 0, w - 90, 130, 28, "#FFFFFF", 3, "#D1D5DB");
    let pr = 0, playing = false; plays.forEach(p => { if (t >= p){ const k = (t - p) / dur; if (k < 1){ pr = k; playing = true; } else if (!playing) pr = 1; } }); if (plays.length && t < Math.min(...plays)) pr = 0;
    ctx.beginPath(); ctx.arc(60, 65, 40, 0, TAU); ctx.fillStyle = playing ? ORANGE : GREEN; ctx.fill(); ctx.fillStyle = "#FFF"; if (playing){ ctx.fillRect(48, 48, 10, 34); ctx.fillRect(66, 48, 10, 34); } else { ctx.beginPath(); ctx.moveTo(50, 46); ctx.lineTo(50, 84); ctx.lineTo(80, 65); ctx.closePath(); ctx.fill(); }
    const flat = flA != null ? easeIO(clamp((t - flA) / .8, 0, 1)) : 0; WAVE.forEach((v, i) => { const hh = lerp(v, .55, flat) * 74 + (playing ? Math.sin(t * 14 + i) * 4 : 0), bx = 120 + i * 8.6; ctx.fillStyle = (i / WAVE.length) < pr ? ORANGE : "#C5CCD6"; rr(ctx, bx, 65 - hh / 2, 5, hh, 2.5); ctx.fill(); });
    T(ctx, "0:08", w - 130, 112, 20, { align: "right", col: "#6B7280", w: 700 }); ctx.restore();
    if (f.caption){ const cs = pop(t, tm(f, f.captionAt, 1.5), .4); if (cs > 0){ ctx.save(); ctx.translate(0, y + 470); ctx.scale(cs, cs); P(ctx, x + 30, -50, w - 60, 100, 18, "#FFF1C9", 4, OUT); T(ctx, f.caption, 0, 14, 30, { align: "center", col: BROWN, w: 800, maxW: w - 90 }); ctx.restore(); } }
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, 2.5), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, .04); },
    sfx(f, g, add){ (f.plays || [.6]).forEach(p => add(g(tm(f, p)), "notif", .5)); } };

  /* ============================== KERTAS ATURAN DUA KOLOM ============================== */
  FX.twoCol = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#B98A5A"], [1, "#8F6540"]])); U.motes(ctx, t, 18, 9, 0, 0, SW, SH, "#FFF3D6", .3);
    ctx.save(); ctx.translate(960, 540); const z = 1 + q * .012; ctx.scale(z, z); ctx.rotate(-.02 + Math.sin(t * .7) * .005); const s = pop(t, f.at + .1, .5); ctx.scale(s, s);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, -640, -400, 1280, 800, 12, "#FFFDF0", 0); ctx.restore(); P(ctx, -640, -400, 1280, 800, 12, "#FFFDF0", 5, OUT);
    [-600, 600].forEach(px => { ctx.beginPath(); ctx.arc(px, -380, 16, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); });
    const rv = (txt, x0, y0, size, a, col) => { if (a <= 0) return; font(ctx, 800, size, F2); const wd = ctx.measureText(txt).width; ctx.save(); ctx.beginPath(); ctx.rect(x0 - 6, y0 - size * 1.1, (wd + 12) * a, size * 1.6); ctx.clip(); T(ctx, txt, x0, y0, size, { fam: F2, w: 800, col: col || "#1F4E8C" }); ctx.restore(); };
    rv("TRANSFER BESAR", -300, -300, 64, fin(t, tm(f, f.titleAt, .5), .8));
    const cA = tm(f, f.colsAt, 1.6); [["ISI", -330, "#3F6FB5", "orang pertama"], ["SETUJUI", 330, ORANGE, "orang kedua"]].forEach(([lb, cx, col, sub], i) => { const k = pop(t, cA + i * .5, .45); if (k <= 0) return; ctx.save(); ctx.translate(cx, -90); ctx.scale(k, k); P(ctx, -250, -110, 500, 360, 20, "rgba(255,255,255,.7)", 6, col); P(ctx, -250, -110, 500, 100, [20, 20, 0, 0], col, 0); T(ctx, lb, 0, -36, 64, { align: "center", col: "#FFF", track: 3 }); T(ctx, sub, 0, 90, 34, { align: "center", col: "#374151", w: 700 });
      ctx.beginPath(); ctx.arc(0, 160, 40, 0, TAU); ctx.fillStyle = col; ctx.globalAlpha = .25; ctx.fill(); ctx.globalAlpha = 1; ctx.restore(); });
    const nA = tm(f, f.neqAt, 3.4), ns = pop(t, nA, .4); if (ns > 0){ ctx.save(); ctx.translate(0, -90); ctx.scale(ns, ns); ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); T(ctx, "≠", 0, 34, 96, { align: "center", col: "#FFF" }); ctx.restore(); }
    const rA = tm(f, f.ruleAt, 4.4); rv("Tidak boleh orang yang sama. Tidak boleh hanya karena suaranya mirip.", -580, 330, 38, fin(t, rA, 1.6), "#9B1C1C");
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 6), .4), f.chip, f.chipBg || NAVY, "#FFF", 40, -.02); },
    sfx(f, g, add){ add(g(tm(f, f.titleAt, .5)), "scribble", .5, .8); add(g(tm(f, f.colsAt, 1.6)), "pop", .5); add(g(tm(f, f.colsAt, 1.6) + .5), "pop", .5); add(g(tm(f, f.neqAt, 3.4)), "stamp", .7); add(g(tm(f, f.ruleAt, 4.4)), "scribble", .5, 1.6); } };

  /* ============================== THUMBNAIL ============================== */
  S.thumbs = S.thumbs || {};
  S.thumbs.utang2 = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0); S.LOC.kerja.bg(x, cam, 3.1, { time: 'sore', clock: '16:45' });
    S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.38)'; x.fillRect(0, 0, 1920, 1080);
    x.save(); x.translate(430, 185); x.rotate(-.04); x.fillStyle = '#FFF'; x.beginPath(); x.roundRect(-300, -130, 600, 260, 28); x.fill(); x.fillStyle = '#6B7280'; x.font = '700 28px Poppins'; x.textAlign = 'left'; x.fillText('Transfer ke vendor baru', -262, -72);
    x.fillStyle = '#13223D'; x.font = '800 76px Poppins'; x.fillText('Rp25.000.000', -262, 18); x.fillStyle = '#3BA36B'; x.beginPath(); x.roundRect(-262, 48, 524, 62, 31); x.fill(); x.fillStyle = '#FFF'; x.font = '800 36px Poppins'; x.textAlign = 'center'; x.fillText('KIRIM', 0, 94); x.restore();
    x.save(); x.translate(330, 405); x.rotate(.03); x.scale(.78, .78); x.fillStyle = '#FFF'; x.beginPath(); x.roundRect(-300, -64, 600, 128, 64); x.fill(); x.fillStyle = '#C2691F'; x.beginPath(); x.arc(-240, 0, 40, 0, 7); x.fill(); x.fillStyle = '#FFF'; x.beginPath(); x.moveTo(-252, -20); x.lineTo(-252, 20); x.lineTo(-222, 0); x.fill();
    for (let i = 0; i < 30; i++){ const hh = 14 + Math.abs(Math.sin(i * 1.7) * 46) + (i % 3) * 6; x.fillStyle = i < 18 ? '#C2691F' : '#C5CCD6'; x.beginPath(); x.roundRect(-180 + i * 12, -hh / 2, 7, hh, 3); x.fill(); } x.restore();
    const put = (who, o, key, t) => { const look = S.cast[who].look || S.cast[who]; const a = Object.assign({ face: 1, seed: 3 }, look, o, { keys: [Object.assign({ at: 0 }, key)] }); const st = TT.toonState(a, null, t); st.talk = false; TT.drawToon(x, a, st, t); };
    put('bayu', { x: 560, y: 1760, size: 1240, face: 1, item: 'phone' }, { pose: 'phone', expr: 'scared', look: 'cam' }, 5.25);
    return c.toDataURL('image/png').slice(22); };
})();
