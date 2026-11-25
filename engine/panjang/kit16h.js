/* STORY16 kit H — tambahan untuk Kantor Tangani: Klien Terbesar Eps 4 ("Gudang paling lambat", penutup cerita). Dimuat sesudah kit16g.js.
   Tokoh   : opsi look `neckphones: true` (headphone di leher, Yoga); kunci tokoh boleh berisi `hat`, `pencil`, `neckphones`
             (mis. {cue, hat: null} = topi dilepas, {cue, hat: "cap"} = dipakai lagi). Tanpa kunci itu tidak ada yang berubah.
   Lokasi  : halaman (halaman depan gudang: pintu gulung terbuka, papan GUDANG TANGANI, jam dinding `clock`/`clockRate`).
   Slide rapat baru (LOC.rapat locOpt.slide): "bukuSaku" (halaman buku saku Dodi di layar) dan "gudang14" (42 → 14 menit).
   Properti: box16 (kardus untuk duduk), radio16 (`on`), brochure (brosur JASA GUDANG PIHAK KETIGA berdiri), truck16 (truk kurir + sopir tertidur),
             statusBoard (`green` 0..1), schedBoard (`strike`, `rev` 0..1), rackSign (`text`, `text2`, `swap` 0..1), tapeLine (`len`), bekal (nasi + kerupuk);
             hand_stopwatch, hand_clipboard, hand_pocketbook, hand_cap, hand_clicker, hand_tape, hand_tablet, hand_two (dua jari).
   Efek    : dayChip (HARI n/30 di pojok), dropPencil (pensil jatuh dari telinga), clipCard (papan jepit KE MANA WAKTU HABIS?), measure (pengukur waktu per pesanan),
             floorPlan (denah + benang merah: kusut ke rak 9 / pendek dan rapi), bar42 (42 menit, berjalan 26 menit = 62%), movers (tabel barang laris di rak 9),
             tenList (10 perbaikan, 9 dicoret), pocketBook (buku saku lusuh: sketsa, tanggal 2 tahun lalu, "Rapat: nanti dulu."), sched (papan jadwal baru Bayu),
             compare (42 → 14 menit, 71% → 98%), wijayaCall (panggilan video Pak Wijaya + peta di dinding), storeMap17 (12 + 5 toko baru),
             drawer (brosur masuk laci), bills (notifikasi tagihan 7 aplikasi), finale (KLIEN TERBESAR · SELESAI).
   S16.thumbs.gudang4 = gambar thumbnail (tools/panjang/thumb16.py jenis "gudang4").
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} (juga di dalam larik) = waktu lokal adegan (lihat tm()). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430", GREY = "#9CA3AF", WBROWN = "#8E4A24";
  const SK = { a: "#D99A6E", b: "#C98B62", c: "#B5774F", d: "#E2A77C", e: "#F0C29A" };
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const chip = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const ring = (ctx, cx, cy, rx, ry, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); const n = 44;
    for (let j = 0; j <= n * k; j++){ const a = -2.3 + j / n * TAU * 1.07; ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } ctx.stroke(); ctx.restore(); };
  const scribble = (ctx, x0, x1, y, k, col, lw) => { if (k <= 0) return; ctx.save(); ctx.strokeStyle = col || RED; ctx.lineWidth = lw || 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y); const n = 18;
    for (let j = 1; j <= n * k; j++){ const u = j / n; ctx.lineTo(lerp(x0, x1, u), y + Math.sin(j * 2.3) * 5); } ctx.stroke(); ctx.restore(); };
  const marker = (ctx, x, y, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(.6); P(ctx, -14, -150, 28, 130, 8, "#F7F7F7", 4); P(ctx, -14, -40, 28, 36, 4, col || RED, 4); ctx.fillStyle = col || RED; ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(8, -4); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const reveal = (ctx, txt, x, y, size, k, o) => { if (k <= 0) return null; o = o || {}; font(ctx, o.w || 700, size, o.fam || F2); const w = ctx.measureText(txt).width; const ax = o.align === "center" ? x - w / 2 : x;
    ctx.save(); ctx.beginPath(); ctx.rect(ax - 6, y - size * 1.1, (w + 12) * k, size * 1.6); ctx.clip(); T(ctx, txt, ax, y, size, Object.assign({ fam: F2, w: 700 }, o, { align: "left" })); ctx.restore(); return k < 1 ? [ax + w * k, y - size * .3] : null; };
  const bgDark = (ctx, t) => { fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0B1426"]])); U.motes(ctx, t, 26, 3, 0, 0, SW, SH, "#9FB9E8", .35); };
  const bgWood = (ctx, t) => { fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#C9925F"], [1, "#9E6A40"]])); ctx.fillStyle = "rgba(59,36,24,.12)"; for (let k = 0; k < 9; k++) ctx.fillRect(0, 120 * k + 40, SW, 4); U.motes(ctx, t, 20, 9, 0, 0, SW, SH, "#FFF3D6", .3); };
  const push = (ctx, f, t, k, cx, cy) => { const z = 1 + (t - f.at) * (f.push ?? k ?? .015); ctx.translate(cx ?? 960, cy ?? 540); ctx.scale(z, z); ctx.rotate(Math.sin(t * .6) * .006); ctx.translate(-(cx ?? 960), -(cy ?? 540)); };
  const toon = (ctx, id, x, y, size, key, q, extra) => { const c = S.cast[id]; if (!c) return null; const a = Object.assign({ size, x, y, face: 1, seed: 7 }, c.look || c, extra || {}, { keys: [Object.assign({ at: 0, pose: "idle", expr: "happy" }, key || {})] });
    const st = TT.toonState(a, null, q); st.talk = !!(extra && extra.talk); return TT.drawToon(ctx, a, st, q); };

  /* ============================== TOKOH: headphone di leher + kunci hat/pencil ============================== */
  const KEYED = ["hat", "pencil", "neckphones"];
  function neck(ctx, r){ const k = r.k, cx = r.x + 1 * k * r.face, cy = r.headY + 17 * k;
    ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = 4.4 * k; ctx.beginPath(); ctx.ellipse(cx, cy, 15 * k, 7 * k, 0, .1, Math.PI - .1); ctx.stroke(); ctx.strokeStyle = "#2B2A30"; ctx.lineWidth = 3 * k; ctx.stroke();
    [-1, 1].forEach(d => { P(ctx, cx + d * 15 * k - 4 * k, cy - 2 * k, 8 * k, 11 * k, 3 * k, "#2B2A30", 1.2 * k); ctx.fillStyle = ORANGE; ctx.fillRect(cx + d * 15 * k - 2.5 * k, cy + 1 * k, 5 * k, 5 * k); }); ctx.restore(); }
  const drawToonH = TT.drawToon;
  TT.drawToon = function(ctx, a, st, t){
    if (a && a.keys && a.keys.length && a.keys.some(k => k && KEYED.some(n => k[n] !== undefined))){ const o = {};
      KEYED.forEach(n => { if (a.keys.some(k => k && k[n] !== undefined)) o[n] = S.kv(a.keys, n, t, a[n]); }); a = Object.assign({}, a, o); }
    const r = drawToonH.apply(this, [ctx, a, st, t]);
    if (r && a && a.neckphones){ try { neck(ctx, r); } catch (e){ console.error(e); } }
    return r; };

  /* ============================== PROPERTI ============================== */
  const hp = fn => (ctx, x, y, k, f, t, sp) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); try { fn(ctx, t, sp); } finally { ctx.restore(); } };
  function watchFace(ctx, x, y, r, sec, lw){ ctx.fillStyle = "#C9D1D9"; ctx.strokeStyle = OUT; ctx.lineWidth = lw; rr(ctx, x - r * .2, y - r * 1.45, r * .4, r * .35, r * .08); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = "#2B2A30"; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * .8, 0, TAU); ctx.fillStyle = "#FFFDF8"; ctx.fill();
    ctx.strokeStyle = "#6B7280"; ctx.lineWidth = lw * .5; for (let i = 0; i < 12; i++){ const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r * .66, y - Math.cos(a) * r * .66); ctx.lineTo(x + Math.sin(a) * r * .76, y - Math.cos(a) * r * .76); ctx.stroke(); }
    const an = sec / 60 * TAU; ctx.strokeStyle = RED; ctx.lineWidth = lw * .8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(an) * r * .7, y - Math.cos(an) * r * .7); ctx.stroke();
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y, r * .09, 0, TAU); ctx.fill(); }
  S.watchFace = watchFace;
  PROP.hand_stopwatch = hp((ctx, t) => watchFace(ctx, 3, -7, 6.2, (t * 9) % 60, .7));
  PROP.hand_clipboard = hp(ctx => { ctx.rotate(-.12); P(ctx, -5, -24, 20, 27, 1.6, "#A8743E", .9); P(ctx, -3, -21, 16, 22, .6, "#FFFDF8", 0); P(ctx, 1.5, -26, 7, 4, .8, "#9AA3AE", .6);
    ctx.fillStyle = NAVY; ctx.fillRect(-1, -17.5, 11, 1.6); ctx.fillStyle = "rgba(0,0,0,.25)"; for (let i = 0; i < 4; i++) ctx.fillRect(-1, -13 + i * 3, 12 - i, .7); });
  PROP.hand_pocketbook = hp(ctx => { ctx.rotate(-.15); P(ctx, -4, -13, 15, 16, 1.2, "#5E4A3A", .8); P(ctx, -2.5, -11.5, 12, 13, .5, "#F3E3C3", 0); ctx.strokeStyle = "rgba(43,26,18,.5)"; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(3.5, -11.5); ctx.lineTo(3.5, 1.5); ctx.stroke();
    ctx.fillStyle = "rgba(31,78,140,.6)"; for (let i = 0; i < 4; i++) ctx.fillRect(4.5, -9 + i * 2.6, 4.5 - (i % 2), .6); ctx.strokeStyle = "rgba(31,78,140,.7)"; ctx.strokeRect(-1.5, -9, 4, 3); ctx.strokeRect(-1.5, -4.5, 4, 3); });
  PROP.hand_cap = hp(ctx => { ctx.rotate(-.35); ctx.strokeStyle = OUT; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(2, -5, 8.5, 6.5, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(10, -5, 5.5, 1.6, -.06, 0, TAU); ctx.fillStyle = "#9C5418"; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.arc(2, -8, 1.4, 0, TAU); ctx.fill(); });
  PROP.hand_clicker = hp((ctx, t) => { ctx.rotate(-.5); P(ctx, -1.6, -11, 3.6, 11, 1.2, "#1E1A18", .6); ctx.fillStyle = Math.sin(t * 6) > 0 ? RED : "#7A2A20"; ctx.beginPath(); ctx.arc(.2, -9, .8, 0, TAU); ctx.fill(); ctx.fillStyle = "#5E5A62"; ctx.fillRect(-.8, -6, 2, 1.6); });
  PROP.hand_tape = hp(ctx => { ctx.beginPath(); ctx.arc(2, -5, 5.5, 0, TAU); ctx.fillStyle = YEL; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = .7; ctx.stroke(); ctx.beginPath(); ctx.arc(2, -5, 2, 0, TAU); ctx.fillStyle = "#2B2A30"; ctx.fill(); P(ctx, 6, -2.5, 9, 2.2, .3, "#F7D36A", .4); });
  PROP.hand_tablet = hp((ctx, t) => { ctx.rotate(-.08); P(ctx, -6, -19, 26, 18, 2, "#26252B", .9); ctx.fillStyle = NAVY; ctx.fillRect(-4.5, -17.5, 23, 15);
    [[.4, GREY], [.9, ORANGE], [.6, GREY]].forEach(([v, col], i) => { ctx.fillStyle = col; ctx.fillRect(-2 + i * 7, -4 - 11 * v * (.85 + .15 * Math.sin(t * 2 + i)), 4.5, 11 * v * (.85 + .15 * Math.sin(t * 2 + i))); }); });
  PROP.hand_two = hp((ctx, t, sp) => { const c = S.cast[sp && sp.who]; const sk = SK[(c && (c.look || c).skin) || "a"] || SK.a; ctx.strokeStyle = OUT; ctx.lineWidth = .9; ctx.fillStyle = sk;
    [[-1.6, -.18], [2.2, .14]].forEach(([dx, r]) => { ctx.save(); ctx.translate(dx, -3); ctx.rotate(r); rr(ctx, -1.5, -11, 3, 12, 1.5); ctx.fill(); ctx.stroke(); ctx.restore(); });
    ctx.beginPath(); ctx.arc(.4, -1, 4, 0, TAU); ctx.fill(); ctx.stroke(); });

  // kardus untuk duduk (tinggi = dudukan kursi), label opsional
  PROP.box16 = (ctx, o) => { const w = o.w || 200, h = o.h || 100; ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 4, w * .62, 14, 0, 0, TAU); ctx.fill();
    P(ctx, -w / 2, -h, w, h, 4, "#C9965E", 5); ctx.fillStyle = "#A8794A"; ctx.fillRect(-12, -h, 24, h); ctx.fillStyle = "rgba(255,240,220,.25)"; ctx.fillRect(-w / 2 + 6, -h + 6, w - 12, 6);
    if (o.label !== false){ P(ctx, -w / 2 + 22, -h + 30, 70, 30, 3, "#FFFDF8", 2); T(ctx, o.label || "KASIR", -w / 2 + 57, -h + 51, 14, { align: "center", col: MAROON, w: 800 }); } };
  // radio kecil: mati (sunyi) / menyala (lampu + not musik)
  PROP.radio16 = (ctx, o, t) => { const on = typeof o.on === "number" ? o.on > .5 : !!o.on; ctx.save(); ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 2, 90, 8, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, -86); ctx.lineTo(90, -170); ctx.stroke(); ctx.fillStyle = "#4B5563"; ctx.beginPath(); ctx.arc(90, -170, 5, 0, TAU); ctx.fill();
    const sh = on ? Math.sin(t * 26) * 1.2 : 0; ctx.translate(sh, 0);
    P(ctx, -78, -90, 156, 90, 14, "#8E4A24", 5); P(ctx, -70, -104, 140, 18, 8, "#5E3A22", 4); ctx.beginPath(); ctx.arc(-36, -44, 30, 0, TAU); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "rgba(255,240,220,.25)"; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if ((i - 2) ** 2 + (j - 2) ** 2 < 6){ ctx.beginPath(); ctx.arc(-36 + (i - 2) * 10, -44 + (j - 2) * 10, 2.4, 0, TAU); ctx.fill(); }
    P(ctx, 6, -70, 60, 26, 4, on ? "#FFE9A8" : "#4A4238", 3); if (on) glow(ctx, 36, -57, 60, YEL, .5); ctx.fillStyle = RED; ctx.fillRect(on ? 20 + Math.sin(t) * 6 : 14, -70, 3, 26);
    [[18, -22], [52, -22]].forEach(([x, y], i) => { ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fillStyle = "#2B2A30"; ctx.fill(); ctx.strokeStyle = "#9AA3AE"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(i + (on ? t : 0)) * 7, y + Math.sin(i + (on ? t : 0)) * 7); ctx.stroke(); });
    if (on){ for (let i = 0; i < 4; i++){ const q = (t * .6 + i / 4) % 1; ctx.globalAlpha = Math.sin(q * Math.PI); T(ctx, i % 2 ? "♫" : "♪", -40 + i * 26 + Math.sin(q * 6 + i) * 18, -110 - q * 160, 34 + i * 4, { align: "center", col: ORANGE, stroke: "#FFF6EA", sw: 6 }); } ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(194,105,31,.6)"; ctx.lineWidth = 4; [0, 1].forEach(j => { const r = 40 + ((t * 40 + j * 25) % 50); ctx.globalAlpha = 1 - (r - 40) / 50; ctx.beginPath(); ctx.arc(-100, -46, r, Math.PI * .75, Math.PI * 1.25); ctx.stroke(); }); ctx.globalAlpha = 1; }
    else { ctx.globalAlpha = .55 + .2 * Math.sin(t * 1.5); T(ctx, "…", -36, -112 - Math.sin(t * 1.2) * 6, 34, { align: "center", col: "#6B7280" }); ctx.globalAlpha = 1; }
    ctx.restore(); };
  // brosur berdiri (tri-fold)
  function brochureArt(ctx, w, h, t){ P(ctx, -w / 2, -h, w, h, 6, "#FFFDF8", 4); ctx.fillStyle = "#5E5A62"; ctx.fillRect(-w / 2 + 3, -h + 3, w - 6, h * .42);
    T(ctx, "JASA GUDANG", 0, -h + h * .17, h * .11, { align: "center", col: "#FFF" }); T(ctx, "PIHAK KETIGA", 0, -h + h * .32, h * .11, { align: "center", col: YEL });
    ctx.save(); ctx.translate(-w * .12, -h * .3); ctx.fillStyle = "#9AA3AE"; ctx.fillRect(-w * .18, -h * .1, w * .26, h * .12); ctx.fillRect(w * .08, -h * .06, w * .1, h * .08); ctx.fillStyle = "#2B2A30"; ctx.beginPath(); ctx.arc(-w * .1, h * .03, h * .025, 0, TAU); ctx.arc(w * .12, h * .03, h * .025, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(43,26,18,.3)"; for (let i = 0; i < 4; i++) ctx.fillRect(-w / 2 + w * .1, -h * .42 + i * h * .085, w * (.75 - (i % 2) * .2), h * .03);
    P(ctx, -w * .32, -h * .1, w * .64, h * .065, 3, RED, 0); T(ctx, "MURAH · CEPAT", 0, -h * .05, h * .05, { align: "center", col: "#FFF" }); }
  S.brochureArt = brochureArt;
  PROP.brochure = (ctx, o, t) => { ctx.save(); ctx.rotate(o.rot ?? -.06); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.fillRect(-70, -4, 160, 6); brochureArt(ctx, o.w || 150, o.h || 200, t); ctx.restore(); };
  // truk kurir (samping) dengan sopir tertidur
  PROP.truck16 = (ctx, o, t) => { ctx.save(); if (o.flip) ctx.scale(-1, 1); ctx.fillStyle = "rgba(20,12,6,.3)"; ctx.beginPath(); ctx.ellipse(0, 6, 520, 26, 0, 0, TAU); ctx.fill();
    const bob = o.moving ? Math.sin(t * 9) * 3 : 0; ctx.translate(0, bob);
    P(ctx, -500, -470, 640, 380, 10, "#F3F4F6", 6); ctx.fillStyle = ORANGE; ctx.fillRect(-496, -170, 632, 26); T(ctx, o.label || "KURIR KILAT", -180, -300, 58, { align: "center", col: NAVY, track: 3 }); T(ctx, "Antar barang · Ekspedisi", -180, -246, 26, { align: "center", col: "#6B7280", w: 700 });
    ctx.beginPath(); ctx.moveTo(150, -90); ctx.lineTo(150, -380); ctx.quadraticCurveTo(150, -400, 175, -400); ctx.lineTo(330, -400); ctx.quadraticCurveTo(360, -400, 380, -350); ctx.lineTo(430, -230); ctx.quadraticCurveTo(480, -220, 482, -170); ctx.lineTo(482, -90); ctx.closePath();
    ctx.fillStyle = "#2F6F73"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.moveTo(185, -235); ctx.lineTo(185, -370); ctx.lineTo(325, -370); ctx.quadraticCurveTo(345, -370, 358, -340); ctx.lineTo(400, -235); ctx.closePath(); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.stroke(); ctx.clip();
    // sleeping driver (head leaning on the window)
    if (o.driver !== false){ const hx = 290, hy = -290 + Math.sin(t * 1.3) * 3; ctx.fillStyle = "#3F6FB5"; ctx.beginPath(); ctx.ellipse(hx - 10, hy + 90, 70, 50, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(.35); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = SK.c; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -22, 44, 22, 0, Math.PI, TAU); ctx.fillStyle = "#13223D"; ctx.fill(); ctx.stroke(); ctx.fillRect(10, -26, 46, 9);
      ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(8, 2, 7, .2, Math.PI - .2); ctx.stroke(); ctx.beginPath(); ctx.arc(26, 2, 6, .2, Math.PI - .2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(20, 20, 6, 4 + 2 * Math.abs(Math.sin(t * 1.3)), 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.moveTo(200, -360); ctx.lineTo(240, -360); ctx.lineTo(205, -260); ctx.fill();
    if (o.driver !== false && o.zzz !== false) for (let i = 0; i < 3; i++){ const q = (t * .5 + i / 3) % 1; ctx.globalAlpha = Math.sin(q * Math.PI); T(ctx, "Z", 330 + q * 90 + i * 10, -420 - q * 120, 30 + i * 10, { align: "center", col: NAVY, stroke: "#FFF", sw: 6 }); } ctx.globalAlpha = 1;
    ctx.fillStyle = "#FFF4E6"; rr(ctx, 460, -200, 24, 34, 8); ctx.fill(); ctx.fillStyle = RED; rr(ctx, -508, -200, 16, 40, 6); ctx.fill();
    [[-360], [-160], [330]].forEach(([wx]) => { ctx.save(); ctx.translate(wx, -50); ctx.fillStyle = "#1E1A18"; ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fill(); ctx.fillStyle = "#9AA3AE"; ctx.beginPath(); ctx.arc(0, 0, 26, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.restore(); };
  // papan status gudang: merah TERLAMBAT → hijau TEPAT WAKTU (green 0..1 berputar)
  function statusArt(ctx, g, t){ const fl = Math.cos(Math.PI * clamp(g, 0, 1)), on = g > .5, col = on ? GREEN : RED;
    P(ctx, -230, -300, 460, 300, 16, "#2B2A30", 6); T(ctx, "STATUS GUDANG", 0, -248, 34, { align: "center", col: "#FFF6EA", track: 3 });
    ctx.save(); ctx.translate(0, -130); ctx.scale(1, Math.max(.04, Math.abs(fl))); P(ctx, -190, -70, 380, 140, 14, col, 5, OUT);
    T(ctx, on ? "TEPAT WAKTU" : "TERLAMBAT", 0, 20, 52, { align: "center", col: "#FFF", maxW: 350 }); ctx.restore();
    for (let i = 0; i < 5; i++){ const cx = -120 + i * 60, lit = on || (Math.floor(t * 3) + i) % 2; ctx.beginPath(); ctx.arc(cx, -28, 14, 0, TAU); ctx.fillStyle = lit ? col : "#4B5563"; ctx.fill(); if (lit) glow(ctx, cx, -28, 40, col, .35); } }
  S.statusArt = statusArt;
  PROP.statusBoard = (ctx, o, t) => { ctx.save(); ctx.scale(o.s2 || 1, o.s2 || 1); statusArt(ctx, o.green || 0, t); ctx.restore(); };
  // papan jadwal (berdiri): jadwal lama dicoret (strike), jadwal baru ditulis (rev)
  PROP.schedBoard = (ctx, o, t) => { const st = o.strike || 0, rv = o.rev || 0; ctx.save(); ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 10; [-200, 200].forEach(x => { ctx.beginPath(); ctx.moveTo(x, -300); ctx.lineTo(x * 1.1, 0); ctx.stroke(); });
    P(ctx, -280, -640, 560, 360, 10, "#FFFFFF", 6, "#9AA3AE"); T(ctx, "JADWAL", 0, -592, 34, { align: "center", col: NAVY, track: 4 });
    [["Kurir 10.00", -540], ["Kardus siap 14.00", -500]].forEach(([s, y], i) => { T(ctx, s, -240, y, 26, { col: "#6B7280", fam: F2, w: 700 }); scribble(ctx, -246, -246 + (i ? 230 : 150), y - 9, clamp(st * 2 - i, 0, 1), RED, 5); });
    [["KEMAS 08.00", ORANGE], ["KURIR 11.00", BLUE], ["PASANG 13.00", GREEN]].forEach(([s, col], i) => { const k = clamp(rv * 3 - i, 0, 1); if (k <= 0) return; const y = -440 + i * 54; ctx.save(); ctx.beginPath(); ctx.rect(-260, y - 40, 520 * k, 56); ctx.clip();
      P(ctx, -250, y - 32, 26, 26, 6, col, 3); T(ctx, s, -210, y - 9, 32, { col: NAVY, fam: F2, w: 800 }); if (i < 2) T(ctx, "↓", 210, y + 14, 30, { col: col }); ctx.restore(); });
    ctx.restore(); };
  // papan nama rak (berbalik saat swap)
  PROP.rackSign = (ctx, o) => { const sw = o.swap || 0, fl = Math.cos(Math.PI * clamp(sw, 0, 1)), two = sw > .5, w = o.w || 360; ctx.save(); ctx.scale(1, Math.max(.05, Math.abs(fl)));
    P(ctx, -w / 2, -44, w, 88, 10, two ? "#DDF3E6" : "#FFF6C9", 5, OUT); const L = String(two ? (o.text2 || "") : (o.text || "")).split("\n");
    L.forEach((l, i) => T(ctx, l, 0, (L.length > 1 ? -8 : 12) + i * 32, i ? 24 : 30, { align: "center", col: i ? (two ? GREEN : "#6B7280") : NAVY, maxW: w - 24 })); ctx.restore(); };
  // meteran gulung terbentang (len = panjang)
  PROP.tapeLine = (ctx, o) => { const L = o.len || 0; if (L <= 2) return; ctx.save(); P(ctx, 0, -5, L, 10, 2, "#F7D36A", 2, "#9C7A1E"); ctx.fillStyle = "#3B2418"; for (let x = 20; x < L; x += 20) ctx.fillRect(x, -5, 2, x % 100 === 0 ? 8 : 4); ctx.restore(); };
  // bekal: nasi putih + kerupuk
  PROP.bekal = (ctx, o, t) => { ctx.save(); ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 4, 120, 12, 0, 0, TAU); ctx.fill();
    P(ctx, -110, -46, 220, 46, 12, "#7FA563", 5); ctx.fillStyle = "#FFFDF8"; ctx.beginPath(); ctx.ellipse(-26, -48, 70, 26, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 12; i++) ctx.fillRect(-80 + rnd(i) * 110, -64 + rnd(i + 4) * 26, 5, 3);
    [[52, -58, .2], [74, -46, -.3]].forEach(([x, y, r]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.beginPath(); for (let k = 0; k <= 16; k++){ const a = k / 16 * TAU, rr2 = 26 + Math.sin(k * 3) * 3; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2 * .55); } ctx.closePath();
      ctx.fillStyle = "#F3DDB0"; ctx.fill(); ctx.strokeStyle = "#B9935B"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); });
    ctx.restore(); };

  /* ============================== LOKASI: halaman gudang ============================== */
  LOC.halaman = { bounds: [-300, 2220, -200, 1300], grade: { warm: .1, vig: .42 }, def: { time: "pagi", clock: "10:00" },
    bg(ctx, c, t, o){ const time = o.time || "pagi";
      layer(ctx, c, .3, () => { U.sky(ctx, -1400, -500, 4800, 1300, time, t, 31); U.skyline(ctx, -1400, -500, 4800, 520, time, t, 31, 1.3); });
      layer(ctx, c, .6, () => { P(ctx, -600, 90, 3200, 600, 0, "#D8D2C6", 0); ctx.fillStyle = "rgba(43,26,18,.07)"; for (let x = -600; x < 2600; x += 80) ctx.fillRect(x, 90, 4, 600);
        P(ctx, -620, 40, 3240, 70, 0, "#8D97A3", 6);
        P(ctx, 300, 210, 700, 480, 4, "#2B2A30", 6); ctx.fillStyle = "#3B3A40"; for (let y = 220; y < 300; y += 16) ctx.fillRect(304, y, 692, 8);
        for (let i = 0; i < 6; i++){ const bx = 340 + (i % 3) * 210, by = 690 - (Math.floor(i / 3) + 1) * 110; P(ctx, bx, by, 180, 100, 4, "#C9965E", 4); ctx.fillStyle = "#A8794A"; ctx.fillRect(bx + 80, by, 20, 100); }
        P(ctx, 1150, 150, 620, 100, 14, NAVY, 5); ctx.beginPath(); ctx.arc(1210, 200, 34, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); S.drawLogo(ctx, 1210, 200, 50); T(ctx, "GUDANG TANGANI", 1490, 218, 46, { align: "center", col: "#FFF", track: 3 });
        const cl = U.parseClock(o.clock, t, { rate: o.clockRate }); U.clock(ctx, 1460, 400, 90, cl.h, cl.m, cl.s);
        P(ctx, 1150, 520, 130, 170, 6, "#8D97A3", 5); U.plant(ctx, 1880, 690, .9, t); });
      layer(ctx, c, .8, () => { U.floor(ctx, 760, [[0, "#A8A398"], [1, "#7E796F"]], false, t); ctx.fillStyle = "rgba(255,255,255,.55)"; for (let x = -800; x < 3000; x += 420){ ctx.save(); ctx.translate(x, 860); ctx.transform(1, 0, -.7, 1, 0, 0); ctx.fillRect(0, 0, 14, 160); ctx.restore(); }
        ctx.fillStyle = YEL; ctx.fillRect(-1000, 780, 5000, 10); });
    } };

  /* ============================== slide rapat baru ============================== */
  const slide0 = FX.slide.paint;
  FX.slide.paint = function(ctx, x, y, w, h, t, o){ const k = o.slide;
    if (k === "bukuSaku"){ ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip(); ctx.fillStyle = "#3B4A6B"; ctx.fillRect(x, y, w, h); pocketPage(ctx, x + 30, y + 40, w - 60, h - 60, t, { sk: 1, tx: 1, dt: 1, nt: 1, n2: 1, hl: o.dateHl ? 1 : 0 });
      P(ctx, x + 6, y + 6, w - 12, 40, 0, "rgba(19,34,61,.9)", 0); T(ctx, "Usulan Dodi · buku saku", x + 24, y + 34, 22, { col: YEL }); ctx.restore(); return; }
    if (k === "gudang14"){ ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip(); ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, h); T(ctx, "GUDANG · 30 HARI", x + w / 2, y + 80, 44, { align: "center", col: YEL, track: 3 });
      T(ctx, "42 → 14 menit", x + w / 2, y + 210, 70, { align: "center", col: "#FFF" }); T(ctx, "Tepat waktu: 71% → 98%", x + w / 2, y + 300, 44, { align: "center", col: "#7FD39B" }); ctx.restore(); return; }
    return slide0.apply(this, arguments); };

  /* ============================== EFEK ============================== */
  // HARI n/30 (pojok kanan atas), angka bisa berjalan dari `from` ke `day`
  FX.dayChip = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .4), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; const a = 1 - fin(t, out, .3);
    const d0 = f.from ?? f.day, n = Math.round(lerp(d0, f.day, easeIO(clamp((t - f.at - .4) / (f.dur ?? .8), 0, 1))));
    ctx.save(); ctx.globalAlpha = a; ctx.translate((f.x ?? 1690) + Math.sin(t * .9) * 3, (f.y ?? 66)); ctx.scale(Math.min(1, s), Math.min(1, s));
    P(ctx, -190, -34, 380, 68, 34, "rgba(19,34,61,.92)", 4, "#F6D9AE"); T(ctx, `HARI ${n}/30`, -160, 12, 30, { col: YEL, track: 1 });
    for (let i = 0; i < 30; i++){ ctx.fillStyle = i < n ? (f.col || ORANGE) : "rgba(255,255,255,.2)"; ctx.fillRect(48 + i * 4.4, -14 + (i % 5 === 4 ? -4 : 0), 3, 28 + (i % 5 === 4 ? 4 : 0)); }
    ctx.restore(); }, sfx(f, g, add){ add(g(f.at), "pop", .4); if (f.from != null && f.from !== f.day) add(g(f.at + .4), "tickfast", .4, .8); } };

  // pensil jatuh dari telinga (dunia, ikut tokoh)
  FX.dropPencil = { layer: "world", draw(ctx, f, t){ const q = t - f.at; if (q < 0 || q > 2.2) return; const an = S.anchors[f.who || "dodi"]; if (!an || !an.world || an.frame != null) return;   // anchor drawn in THIS frame (frame id is stamped after the world fx)
    const r = an.world, k = r.k, x0 = r.x + (-21) * k * r.face, y0 = r.headY - 4 * k, g = clamp(q / .65, 0, 1), y = Math.min(y0 + (995 - y0) * g * g, 995), x = x0 - r.face * 80 * g;
    ctx.save(); ctx.translate(x, y); ctx.rotate(.8 + (g < 1 ? q * 10 : 1.6 + Math.sin(Math.min(q - .65, .5) * 20) * .1 * (1 - Math.min(1, (q - .65) * 2)))); ctx.scale(k * .62, k * .62);
    ctx.fillStyle = YEL; ctx.strokeStyle = OUT; ctx.lineWidth = 1.1; rr(ctx, -12, -1.9, 22, 3.8, .6); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#E9B58A"; ctx.beginPath(); ctx.moveTo(10, -1.9); ctx.lineTo(15, 0); ctx.lineTo(10, 1.9); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#F7B6C2"; rr(ctx, -15, -1.9, 3.6, 3.8, .8); ctx.fill(); ctx.stroke(); ctx.restore(); },
    sfx(f, g, add){ add(g(f.at + .65), "tap", .7); add(g(f.at + .8), "tap", .4); } };

  // papan jepit "KE MANA WAKTU HABIS?" + pengukur waktu
  FX.clipCard = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; bgWood(ctx, t); ctx.save(); push(ctx, f, t, .02);
    ctx.save(); ctx.translate(820, 560); ctx.rotate(-.05 + Math.sin(t * .7) * .01); ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; P(ctx, -430, -470, 860, 960, 30, "#A8743E", 0); ctx.restore();
    P(ctx, -430, -470, 860, 960, 30, "#A8743E", 6, OUT); P(ctx, -380, -400, 760, 850, 8, "#FFFDF8", 3); P(ctx, -120, -500, 240, 80, 16, "#9AA3AE", 5, OUT);
    T(ctx, f.title || "KE MANA WAKTU HABIS?", 0, -300, 56, { align: "center", col: NAVY, maxW: 700 }); ctx.fillStyle = ORANGE; ctx.fillRect(-300, -275, 600, 8);
    const cols = ["Pesanan", "Mulai", "Selesai", "Menit"], cx = [-330, -110, 70, 240]; cols.forEach((c, i) => T(ctx, c, cx[i], -200, 30, { col: "#6B7280", w: 700 }));
    const rows = f.rows || [["#031", "08.12", "08.56", "44"], ["#032", "08.20", "08.59", "39"], ["#033", "08.41", "09.28", "47"], ["#034", "09.02", "09.43", "41"], ["#035", "09.15", "09.53", "38"]];
    const rA = tm(f, f.rowsAt, .8), per = f.per ?? .7;
    rows.forEach((r, i) => { const k = clamp((t - rA - i * per) / .4, 0, 1); if (k <= 0) return; const y = -130 + i * 74; ctx.strokeStyle = "rgba(91,125,177,.25)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-350, y + 22); ctx.lineTo(350, y + 22); ctx.stroke();
      r.forEach((v, j) => reveal(ctx, v, cx[j], y, 34, k, { col: j === 3 ? RED : "#1F4E8C", fam: F2, w: 700 })); });
    const qA = tm(f, f.qAt, 4.5), qq = pop(t, qA, .4); if (qq > 0){ ctx.save(); ctx.translate(0, 330); ctx.scale(qq, qq); T(ctx, "Rata-rata: ?? menit", 0, 0, 42, { align: "center", col: RED, fam: F2 }); ctx.restore(); }
    ctx.restore();
    // stopwatch
    ctx.save(); ctx.translate(1500, 600); ctx.rotate(.08 + Math.sin(t * 1.1) * .03); watchFace(ctx, 0, 0, 210, (q * 6) % 60, 10); ctx.restore();
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 1500, f.chipY ?? 200, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || NAVY, "#FFF", 36, -.04); },
    sfx(f, g, add){ add(g(f.at + .2), "click", .7); for (let k = 0; k < 4; k++) add(g(f.at + .4 + k), "tick", .35); } };

  // pengukur waktu: stopwatch besar berputar ulang per pesanan + daftar menit per pesanan + jam dinding berputar cepat
  FX.measure = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; bgDark(ctx, t); ctx.save(); push(ctx, f, t, .012);
    const rows = f.rows || [["#031", 44], ["#032", 39], ["#033", 47], ["#034", 41], ["#035", 38], ["#036", 45], ["#037", 40], ["#038", 42]], per = f.per ?? 1.3, n = Math.min(rows.length, Math.floor(Math.max(0, q - .3) / per) + 1), cur = rows[Math.min(rows.length - 1, n - 1)], ph = clamp(((q - .3) % per) / (per * .85), 0, 1);
    ctx.save(); ctx.translate(560, 560); watchFace(ctx, 0, 0, 260, ph * cur[1] % 60, 12); ctx.restore();
    const mm = Math.floor(ph * cur[1]); T(ctx, `${String(mm).padStart(2, "0")}:${String(Math.floor((ph * cur[1] * 60) % 60)).padStart(2, "0")}`, 560, 940, 74, { align: "center", col: "#FFF" });
    P(ctx, 390, 150, 340, 66, 33, ORANGE, 4, OUT); T(ctx, "PESANAN " + cur[0], 560, 196, 32, { align: "center", col: "#FFF" });
    P(ctx, 1000, 110, 760, 860, 26, "#13223D", 5, "#2B4A7A"); T(ctx, f.title || "Cetak → kardus selesai", 1050, 190, 40, { col: "#FFF" });
    rows.slice(0, n).forEach((r, i) => { const y = 270 + i * 84, k = clamp((q - .3 - i * per - per * .85) / .3, 0, 1); T(ctx, r[0], 1050, y + 30, 32, { col: "#A9BCDD" });
      P(ctx, 1180, y + 2, 440 * (i === n - 1 ? ph : 1) * r[1] / 50, 40, 10, i === n - 1 && k <= 0 ? "#5B7DB1" : ORANGE, 0); if (k > 0) T(ctx, r[1] + " mnt", 1720, y + 32, 30, { align: "right", col: "#FFF" }); });
    const cl = U.parseClock(f.clock || "08:00", t - f.at, { rate: 30 }); U.clock(ctx, 1640, 1010, 60, cl.h, cl.m, cl.s);
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 560, f.chipY ?? 80, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || NAVY, "#FFF", 32, -.03); },
    sfx(f, g, add){ const per = f.per ?? 1.3, n = (f.rows || [1, 2, 3, 4, 5, 6, 7, 8]).length; for (let i = 0; i < n; i++){ add(g(f.at + .3 + i * per), "click", .5); add(g(f.at + .3 + i * per + per * .85), "ping", .3); } } };

  // denah gudang + benang merah
  const RACKS = [[740, 830], [1040, 830], [1340, 830], [740, 630], [1040, 630], [1340, 630], [740, 450], [1040, 450], [1420, 280]], DESK = [450, 860];
  function planPath(i, j, tidy){ const [rx, ry] = RACKS[i], s = tidy ? .25 : 1, jx = (rnd(j * 3.1 + i) - .5) * 60 * s, jy = (rnd(j * 5.7 + i) - .5) * 40 * s;
    if (i === 8) return [[DESK[0] + 70 + jx * .4, DESK[1] - 30 + jy * .3], [585 + jx * .6, DESK[1] - 30 + jy], [585 + jx * .6, ry + jy * .6], [rx - 200 + jx, ry + jy * .6], [rx - 110, ry + jy * .3]];
    return [[DESK[0] + 70 + jx * .4, DESK[1] - 30 + jy * .3], [585 + jx * .6, DESK[1] - 30 + jy], [585 + jx * .6, ry + 70 + jy * .5], [rx - 40 + jx, ry + 70 + jy * .5], [rx + jx * .4, ry + 34]]; }
  function strokePath(ctx, pts, k){ if (k <= 0) return; let L = 0; const seg = []; for (let i = 1; i < pts.length; i++){ const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let rem = L * k; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length && rem > 0; i++){ const u = Math.min(1, rem / seg[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)); rem -= seg[i - 1]; } ctx.stroke(); }
  FX.floorPlan = { layer: "screen", draw(ctx, f, t){ const tidy = f.mode === "tidy"; bgWood(ctx, t); ctx.save(); push(ctx, f, t, .015);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 250, 70, 1420, 960, 10, "#F3EAD9", 0); ctx.restore(); P(ctx, 250, 70, 1420, 960, 10, "#F3EAD9", 5, OUT);
    ctx.strokeStyle = "rgba(91,125,177,.15)"; ctx.lineWidth = 2; for (let x = 270; x < 1660; x += 40){ ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x, 1020); ctx.stroke(); } for (let y = 90; y < 1020; y += 40){ ctx.beginPath(); ctx.moveTo(260, y); ctx.lineTo(1660, y); ctx.stroke(); }
    T(ctx, f.title || "Denah gudang · jalur staf", 300, 140, 40, { col: NAVY }); ctx.strokeStyle = "#3B4A6B"; ctx.lineWidth = 10; ctx.strokeRect(330, 190, 1260, 800);
    ctx.fillStyle = "#F3EAD9"; ctx.fillRect(340, 984, 160, 14); T(ctx, "PINTU", 420, 1022, 22, { align: "center", col: "#6B7280" });
    P(ctx, 360, 820, 180, 80, 8, "#E8A55B", 4); T(ctx, "MEJA KEMAS", 450, 870, 22, { align: "center", col: BROWN });
    const lab = f.labels || (tidy ? { 0: "printer · pemindai", 1: "kertas struk", 8: "jarang dikirim" } : { 8: "printer · pemindai · kertas", 0: "jarang dikirim" });
    RACKS.forEach(([x, y], i) => { const hot = (!tidy && i === 8) || (tidy && i < 2); P(ctx, x - 110, y - 34, 220, 68, 6, hot ? "#F7C9A1" : "#D7DEE8", 4, "#3B4A6B"); T(ctx, "RAK " + (i + 1), x, y + 10, 28, { align: "center", col: NAVY });
      if (lab[i]) T(ctx, lab[i], x, i === 8 ? y - 46 : y + 58, 20, { align: "center", col: hot ? RED : "#6B7280", w: 700, maxW: 260 }); });
    const n = f.n || (tidy ? 16 : 30), gA = tm(f, f.growAt, .4), gD = f.growDur || 5, prog = clamp((t - gA) / gD, 0, 1) * n;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let j = 0; j < n; j++){ const k = clamp(prog - j, 0, 1); if (k <= 0) break; const tgt = tidy ? (j % 3 === 2 ? 1 : 0) : (j % 6 === 2 ? 6 : j % 6 === 4 ? 7 : j % 9 === 5 ? 3 : 8);
      ctx.strokeStyle = tidy ? "rgba(217,72,59,.85)" : `rgba(217,72,59,${.5 + rnd(j) * .35})`; ctx.lineWidth = tidy ? 5 : 4 + rnd(j + 2) * 2; strokePath(ctx, planPath(tgt, j, tidy), k);
      if (k >= 1){ const p = planPath(tgt, j, tidy)[4]; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, TAU); ctx.fill(); } }
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(DESK[0] + 70, DESK[1] - 30, 10, 0, TAU); ctx.fill();
    const hA = tm(f, f.hlAt); if (hA != null){ const k = clamp((t - hA) / .6, 0, 1); if (tidy){ ring(ctx, 890, 820, 330, 90, k, GREEN, 9); } else { ring(ctx, RACKS[8][0], RACKS[8][1], 170, 80, k, RED, 9); glow(ctx, RACKS[8][0], RACKS[8][1], 220, RED, .25 * k); } }
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1500, f.chipY ?? 980, pop(t, tm(f, f.chipAt, 2), .4), f.chip, f.chipBg || RED, "#FFF", f.chipSize || 34, -.03); },
    sfx(f, g, add){ const gA = tm(f, f.growAt, .4), gD = f.growDur || 5; add(g(gA), "scribble", .4, gD); if (f.hlAt != null) add(g(tm(f, f.hlAt)), f.mode === "tidy" ? "chime" : "dun", .7); if (f.chip) add(g(tm(f, f.chipAt, 2)), "pop", .5); } };

  // 42 menit; berjalan 26 menit = 62%
  FX.bar42 = { layer: "screen", draw(ctx, f, t){ bgDark(ctx, t); ctx.save(); push(ctx, f, t, .012);
    P(ctx, 200, 110, 1520, 860, 26, "#13223D", 5, "#2B4A7A"); T(ctx, f.title || "Menyiapkan 1 pesanan · rata-rata", 270, 200, 50, { col: "#FFF" }); T(ctx, f.sub || "Diukur 2 hari · semua pesanan", 270, 250, 28, { col: "#A9BCDD", w: 600 });
    const X0 = 300, X1 = 1620, Y = 380, H = 160, bA = tm(f, f.barAt, .3), bk = easeIO(clamp((t - bA) / 1.6, 0, 1)), sA = tm(f, f.splitAt, 3), sk = easeIO(clamp((t - sA) / 1, 0, 1)), pA = tm(f, f.pctAt, 5);
    P(ctx, X0, Y, (X1 - X0) * bk, H, 18, sk > 0 ? "#5B7DB1" : RED, 5, OUT);
    if (sk > 0){ const w = (X1 - X0) * .62 * sk; P(ctx, X0, Y, w, H, 18, ORANGE, 5, OUT); ctx.save(); rr(ctx, X0, Y, w, H, 18); ctx.clip(); for (let i = 0; i < 12; i++){ const fx = X0 + ((t * 120 + i * 90) % (w + 60)) - 30, fy = Y + 50 + (i % 2) * 50; ctx.fillStyle = "rgba(255,246,234,.35)"; ctx.beginPath(); ctx.ellipse(fx, fy, 14, 22, .3, 0, TAU); ctx.fill(); } ctx.restore();
      ctx.save(); ctx.globalAlpha = sk; T(ctx, "BERJALAN · 26 menit", X0 + 40, Y + 100, 46, { col: "#FFF", stroke: OUT, sw: 8 }); T(ctx, "ambil · kemas · cetak", X0 + (X1 - X0) * .62 + 30, Y + 80, 28, { col: "#FFF", w: 700 }); T(ctx, "16 menit", X0 + (X1 - X0) * .62 + 30, Y + 122, 34, { col: "#FFF" }); ctx.restore(); }
    if (bk > 0){ const v = Math.round(42 * bk); T(ctx, v + " menit", X1, Y - 30, 64, { align: "right", col: bk >= 1 ? RED : "#FFF" }); }
    const pq = pop(t, pA, .45); if (pq > 0){ ctx.save(); ctx.translate(X0 + (X1 - X0) * .31, 760); ctx.scale(pq, pq); T(ctx, "62%", 0, 60, 190, { align: "center", col: ORANGE, stroke: OUT, sw: 18 }); ctx.restore();
      ctx.save(); ctx.globalAlpha = Math.min(1, pq); T(ctx, "waktu habis untuk berjalan", 1250, 760, 44, { align: "center", col: "#FFF" }); T(ctx, "bukan untuk bekerja", 1250, 820, 34, { align: "center", col: "#A9BCDD", w: 700 }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.barAt, .3)), "rise", .5, 1.6); add(g(tm(f, f.splitAt, 3)), "whoosh", .5); add(g(tm(f, f.pctAt, 5)), "dun", .9); } };

  // tabel barang laris
  FX.movers = { layer: "screen", draw(ctx, f, t){ bgDark(ctx, t); ctx.save(); push(ctx, f, t, .012);
    P(ctx, 220, 90, 1480, 900, 26, "#13223D", 5, "#2B4A7A"); T(ctx, f.title || "Barang paling sering dikirim", 290, 180, 50, { col: "#FFF" }); T(ctx, "Hasil 2 hari pengukuran", 290, 228, 28, { col: "#A9BCDD", w: 600 });
    const rows = f.rows || [["Kertas struk", "54×", "RAK 9", 1], ["Printer struk", "38×", "RAK 9", 1], ["Pemindai", "31×", "RAK 9", 1], ["Kabel model lama", "1×", "RAK 1", 0], ["Mesin kasir pameran", "0×", "RAK 1", 0]];
    const cx = [300, 1000, 1380]; ["Barang", "Dikirim / minggu", "Letak"].forEach((c, i) => T(ctx, c, cx[i], 320, 30, { col: "#A9BCDD", w: 700 }));
    const ra = f.rowsAt || rows.map((_, i) => .4 + i * .35);
    rows.forEach((r, i) => { const k = pop(t, tm(f, ra[i]), .35); if (k <= 0) return; const y = 400 + i * 110 + (i > 2 ? 30 : 0); ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.translate((1 - Math.min(1, k)) * 60, 0);
      P(ctx, 270, y - 50, 1380, 90, 14, r[3] ? "rgba(194,105,31,.18)" : "rgba(156,163,175,.12)", 0); T(ctx, r[0], cx[0], y + 12, 40, { col: "#FFF" }); T(ctx, r[1], cx[1] + 100, y + 12, 40, { align: "center", col: r[3] ? YEL : "#9CA3AF" });
      P(ctx, cx[2], y - 34, 220, 60, 30, r[3] ? RED : "#5E5A62", 4, OUT); T(ctx, r[2], cx[2] + 110, y + 8, 32, { align: "center", col: "#FFF" }); ctx.restore(); });
    const hA = tm(f, f.hlAt); if (hA != null){ const k = clamp((t - hA) / .6, 0, 1); ring(ctx, cx[2] + 110, 510, 170, 190, k, YEL, 8); }
    const h2 = tm(f, f.hl2At); if (h2 != null){ const k = clamp((t - h2) / .6, 0, 1); ring(ctx, cx[2] + 110, 815, 160, 110, k, "#A9BCDD", 7); }
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 3), .4), f.chip, f.chipBg || RED, "#FFF", 34, -.02);
    if (f.chip2) chip(ctx, f.chip2X ?? 960, f.chip2Y ?? 1010, pop(t, tm(f, f.chip2At, 5), .4), f.chip2, f.chip2Bg || "#5E5A62", "#FFF", 34, .02); },
    sfx(f, g, add){ (f.rowsAt || [.4, .75, 1.1, 1.45, 1.8]).forEach(v => add(g(tm(f, v)), "pop", .45)); if (f.hlAt != null) add(g(tm(f, f.hlAt)), "dun", .7); if (f.hl2At != null) add(g(tm(f, f.hl2At)), "scribble", .5, .5); } };

  // sepuluh perbaikan: ditulis / dicoret sembilan, satu dilingkari
  const TEN = ["Rapikan semua rak", "Label ulang semua kardus", "Beli troli baru", "Tambah satu staf gudang", "Ganti printer label", "Pelatihan staf gudang", "Barang laris ke rak depan", "Laporan harian ke kantor", "Cek stok tiap pagi", "Perbaiki lampu gudang"];
  FX.tenList = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, items = f.items || TEN, keep = f.keep || [6];
    fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#8D97A3"], [1, "#5E6670"]])); const z = 1 + q * (f.push ?? .01); ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.02); ctx.translate(-960, -540);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; P(ctx, 420, 30, 1080, 1020, 6, "#FFFDF4", 0); ctx.restore(); P(ctx, 420, 30, 1080, 1020, 6, "#FFFDF4", 4);
    ctx.strokeStyle = "rgba(91,125,177,.3)"; ctx.lineWidth = 2; for (let y = 176; y < 1040; y += 84){ ctx.beginPath(); ctx.moveTo(440, y); ctx.lineTo(1480, y); ctx.stroke(); } ctx.strokeStyle = "rgba(217,72,59,.4)"; ctx.beginPath(); ctx.moveTo(530, 40); ctx.lineTo(530, 1040); ctx.stroke();
    T(ctx, f.title || "10 perbaikan gudang:", 560, 130, 46, { col: "#1F4E8C", fam: F2, w: 800 });
    const wS = tm(f, f.writeStart, .2), per = f.per ?? .3, sk = f.strikeAt || [], cA = tm(f, f.circleAt); let pen = null, si = 0;
    items.forEach((it, i) => { const wa = f.written ? -1e9 : wS + i * per, wq = clamp((t - wa) / .4, 0, 1), yy = 176 + i * 84; if (wq <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(540, yy - 10, 940 * wq, 84); ctx.clip(); T(ctx, `${i + 1}. ${it}`, 560, yy + 60, 40, { col: "#1F4E8C", fam: F2, w: 700 }); ctx.restore(); if (wq < 1) pen = [560 + 900 * wq, yy + 55, "#1F4E8C"];
      if (!keep.includes(i)){ const sa = sk[si] != null ? tm(f, sk[si]) : null; si++; if (sa != null){ const k = clamp((t - sa) / .3, 0, 1); font(ctx, 700, 40, F2); const tw = ctx.measureText(`${i + 1}. ${it}`).width; scribble(ctx, 550, 570 + tw, yy + 46, k, RED, 8); if (k > 0 && k < 1) pen = [lerp(550, 570 + tw, k), yy + 46, RED]; } }
      else if (f.done){ const dk = pop(t, tm(f, f.done), .3); if (dk > 0){ font(ctx, 700, 40, F2); const tw = ctx.measureText(`${i + 1}. ${it}`).width; ctx.save(); ctx.translate(600 + tw, yy + 44); ctx.scale(dk, dk); T(ctx, "✓", 0, 0, 56, { align: "center", col: GREEN }); ctx.restore(); } } });
    if (cA != null){ const k = clamp((t - cA) / .6, 0, 1); keep.forEach(i => ring(ctx, 900, 176 + i * 84 + 44, 430, 50, k, GREEN, 8)); }
    if (pen) marker(ctx, pen[0], pen[1], pen[2]);
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1660, f.chipY ?? 160, pop(t, tm(f, f.chipAt, .4), .4), f.chip, f.chipBg || MAROON, "#FFF", 34, .04);
    if (f.chip2) chip(ctx, f.chip2X ?? 1660, f.chip2Y ?? 960, pop(t, tm(f, f.chip2At, 2), .4), f.chip2, f.chip2Bg || GREEN, "#FFF", 32, -.04); },
    sfx(f, g, add){ const items = f.items || TEN; if (!f.written) items.forEach((_, i) => add(g(tm(f, f.writeStart, .2) + i * (f.per ?? .3)), "scribble", .3, .3));
      (f.strikeAt || []).forEach(v => add(g(tm(f, v)), "scribble", .6, .3)); if (f.circleAt != null) add(g(tm(f, f.circleAt)), "ping", .6); if (f.chip) add(g(tm(f, f.chipAt, .4)), "pop", .5); } };

  // halaman buku saku (koordinat lokal 1200 x 800, diskalakan ke w x h). pr = {sk, tx, dt, nt, n2, hl} 0..1
  function pocketPage(ctx, x, y, w, h, t, pr){ ctx.save(); ctx.translate(x, y); ctx.scale(w / 1200, h / 800);
    P(ctx, -14, -10, 1228, 820, 22, "#5E4A3A", 5, OUT);
    [[0, 590], [610, 590]].forEach(([px, pw], i) => { P(ctx, px, 0, pw, 800, 10, "#F1E1BF", 0); ctx.fillStyle = "rgba(139,94,52,.10)"; for (let k = 0; k < 14; k++){ ctx.beginPath(); ctx.arc(px + rnd(k + i * 9) * pw, rnd(k + 3 + i * 9) * 800, 20 + rnd(k + 5) * 50, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = "rgba(91,125,177,.28)"; ctx.lineWidth = 2; for (let ly = 90; ly < 790; ly += 56){ ctx.beginPath(); ctx.moveTo(px + 20, ly); ctx.lineTo(px + pw - 20, ly); ctx.stroke(); } });
    ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.fillRect(594, 0, 12, 800);
    ctx.fillStyle = "rgba(120,80,40,.18)"; ctx.beginPath(); ctx.ellipse(1060, 700, 90, 70, .3, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(120,80,40,.35)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(1060, 700, 90, 70, .3, .4, 5.4); ctx.stroke();
    ctx.fillStyle = "#E3CFA6"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(70, 0); ctx.lineTo(0, 70); ctx.closePath(); ctx.fill();
    // sketch (pencil) left page
    const sk = pr.sk ?? 1; ctx.strokeStyle = "#4B4B55"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const box = (bx, by, bw, bh, k) => { if (k <= 0) return; strokePath(ctx, [[bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh], [bx, by]], k); };
    box(50, 80, 500, 640, clamp(sk * 4, 0, 1));
    [[100, 140], [240, 140], [380, 140], [100, 330], [240, 330], [380, 330]].forEach(([bx, by], i) => box(bx, by, 110, 70, clamp(sk * 4 - 1 - i * .25, 0, 1)));
    if (sk > .55){ ctx.save(); ctx.globalAlpha = clamp((sk - .55) * 4, 0, 1); T(ctx, "rak 9", 435, 132, 26, { align: "center", col: "#4B4B55", fam: F2 }); T(ctx, "rak 1", 155, 455, 26, { align: "center", col: "#4B4B55", fam: F2 });
      P(ctx, 80, 560, 200, 90, 6, "rgba(0,0,0,0)", 5, "#4B4B55"); T(ctx, "meja kemas", 180, 615, 28, { align: "center", col: "#4B4B55", fam: F2 }); ctx.restore(); }
    const ak = clamp((sk - .7) / .3, 0, 1); if (ak > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 8; const pts = []; for (let i = 0; i <= 20; i++){ const u = i / 20; pts.push([lerp(450, 170, u) + Math.sin(u * Math.PI) * 120, lerp(220, 520, u) - Math.sin(u * Math.PI) * 40]); } strokePath(ctx, pts, ak);
      if (ak >= 1){ ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(170, 540); ctx.lineTo(140, 495); ctx.lineTo(195, 500); ctx.closePath(); ctx.fill(); } }
    // right page handwriting
    const ink = "#1F4E8C"; const L = ["Printer & pemindai", "pindah ke rak depan,", "dekat meja kemas."]; const tx = pr.tx ?? 1;
    L.forEach((l, i) => reveal(ctx, l, 650, 210 + i * 56, 40, clamp(tx * 3 - i, 0, 1), { col: ink, fam: F2, w: 600 }));
    if ((pr.dt ?? 1) > 0){ ctx.save(); ctx.globalAlpha = clamp(pr.dt, 0, 1); T(ctx, "14 Juni 2024", 1170, 80, 34, { align: "right", col: ink, fam: F2, w: 700 }); ctx.restore(); if (pr.hl > 0) ring(ctx, 1065, 68, 130, 40, clamp(pr.hl, 0, 1), RED, 6); }
    reveal(ctx, "Rapat: nanti dulu.", 650, 430, 44, clamp(pr.nt ?? 1, 0, 1), { col: RED, fam: F2, w: 800 }); if ((pr.nt ?? 1) >= 1){ ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(650, 446); ctx.lineTo(1010, 442); ctx.stroke(); }
    if ((pr.n2 ?? 0) > 0){ const k2 = clamp(pr.n2, 0, 1); reveal(ctx, "3 Feb 2025 · usul lagi.", 650, 560, 34, clamp(k2 * 2, 0, 1), { col: ink, fam: F2, w: 600 }); reveal(ctx, "Rapat: nanti dulu.", 650, 614, 38, clamp(k2 * 2 - 1, 0, 1), { col: RED, fam: F2, w: 800 }); }
    ctx.restore(); }
  S.pocketPage = pocketPage;
  FX.pocketBook = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#3B4A6B"], [1, "#24304A"]]));
    ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 3; for (let x = -200; x < 2200; x += 14){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 300, SH); ctx.stroke(); } ctx.strokeStyle = "rgba(246,195,67,.35)"; ctx.setLineDash([16, 12]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(120, 0); ctx.quadraticCurveTo(60, 540, 150, 1080); ctx.stroke(); ctx.setLineDash([]);
    const zA = tm(f, f.zoomAt), zk = zA != null ? easeIO(clamp((t - zA) / 1.2, 0, 1)) : 0, z = (1 + q * .012) * (1 + zk * .55), oA = tm(f, f.openAt, .1), ok = easeIO(clamp((t - oA) / .7, 0, 1));
    ctx.save(); ctx.translate(960 - zk * 380, 560 + zk * 330); ctx.scale(z, z); ctx.rotate(-.03 + Math.sin(t * .7) * .008); ctx.scale(lerp(.55, 1, ok), 1); ctx.translate(-760, -500);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20; P(ctx, -10, -10, 1540, 1020, 26, "#5E4A3A", 0); ctx.restore();
    const g = (v, d) => { const a = tm(f, v); return a == null ? (d ?? 1) : clamp((t - a) / (d ?? 1.4), 0, 1); };
    pocketPage(ctx, 0, 0, 1520, 1000, t, { sk: g(f.sketchAt, 2.2), tx: g(f.textAt, 2.2), dt: g(f.dateAt, .5), hl: f.dateAt != null ? clamp((t - tm(f, f.dateAt) - .4) / .6, 0, 1) : 0, nt: g(f.noteAt, .9), n2: f.note2At != null ? g(f.note2At, 1.6) : 0 });
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1560, f.chipY ?? 980, pop(t, tm(f, f.chipAt, 2), .4), f.chip, f.chipBg || RED, "#FFF", 34, -.03); },
    sfx(f, g, add){ add(g(tm(f, f.openAt, .1)), "whoosh", .4); if (f.sketchAt != null) add(g(tm(f, f.sketchAt)), "scribble", .4, 2); if (f.dateAt != null) add(g(tm(f, f.dateAt) + .4), "ping", .6); if (f.noteAt != null) add(g(tm(f, f.noteAt)), "dun", .7); } };

  // papan jadwal Bayu (sisipan)
  FX.sched = { layer: "screen", draw(ctx, f, t){ fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#9C978C"], [1, "#7E796F"]])); ctx.save(); push(ctx, f, t, .012);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, 170, 80, 1580, 900, 18, "#FFFFFF", 0); ctx.restore(); P(ctx, 170, 80, 1580, 900, 18, "#FFFFFF", 14, "#9AA3AE");
    T(ctx, "JADWAL GUDANG", 960, 180, 56, { align: "center", col: NAVY, track: 6 });
    const sA = tm(f, f.strikeAt, .3); [["Kurir datang 10.00", 290], ["Kardus siap 14.00", 350]].forEach(([s, y], i) => { T(ctx, s, 260, y, 40, { col: "#6B7280", fam: F2, w: 700 }); scribble(ctx, 250, 260 + (i ? 360 : 380), y - 14, clamp((t - sA - i * .3) / .35, 0, 1), RED, 8); });
    let pen = null; const B = [["KEMAS", "08.00–10.30", ORANGE, f.w1At], ["KURIR", "11.00", BLUE, f.w2At], ["PASANG", "13.00", GREEN, f.w3At]];
    B.forEach(([a, b, col, at], i) => { const k = clamp((t - tm(f, at, 1 + i * 1.5)) / .9, 0, 1); if (k <= 0) return; const bx = 260 + i * 500, by = 470; ctx.save(); ctx.beginPath(); ctx.rect(bx - 20, by - 20, 440 * k + 20, 360); ctx.clip();
      P(ctx, bx, by, 400, 280, 22, "rgba(0,0,0,0)", 8, col); T(ctx, a, bx + 200, by + 110, 66, { align: "center", col: col, fam: F2, w: 800 }); T(ctx, b, bx + 200, by + 200, i ? 72 : 56, { align: "center", col: NAVY, fam: F2, w: 800 }); ctx.restore();
      if (k < 1) pen = [bx + 420 * k, by + 150]; if (i < 2 && k >= 1){ const ak = clamp((t - tm(f, at, 1 + i * 1.5) - .9) / .4, 0, 1); ctx.strokeStyle = NAVY; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(bx + 410, by + 140); ctx.lineTo(bx + 410 + 80 * ak, by + 140); ctx.stroke();
        if (ak >= 1){ ctx.fillStyle = NAVY; ctx.beginPath(); ctx.moveTo(bx + 500, by + 140); ctx.lineTo(bx + 470, by + 118); ctx.lineTo(bx + 470, by + 162); ctx.closePath(); ctx.fill(); } } });
    if (pen) marker(ctx, pen[0], pen[1], NAVY);
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 960, pop(t, tm(f, f.chipAt, 5), .4), f.chip, f.chipBg || GREEN, "#FFF", 36, -.02); },
    sfx(f, g, add){ add(g(tm(f, f.strikeAt, .3)), "scribble", .5, .6); [f.w1At, f.w2At, f.w3At].forEach((v, i) => add(g(tm(f, v, 1 + i * 1.5)), "scribble", .5, .9)); if (f.chip) add(g(tm(f, f.chipAt, 5)), "chime", .6); } };

  // 42 → 14 menit; 71% → 98%
  FX.compare = { layer: "screen", draw(ctx, f, t){ bgDark(ctx, t); ctx.save(); push(ctx, f, t, .012);
    T(ctx, f.title || "Diukur lagi · hari ke-20", 960, 120, 50, { align: "center", col: "#FFF" });
    const panel = (x, title, a, b, unit, mx, at0, at1, good) => { P(ctx, x, 170, 760, 820, 26, "#13223D", 5, "#2B4A7A"); T(ctx, title, x + 380, 250, 40, { align: "center", col: "#FFF", maxW: 700 });
      [[a, "Hari 2", at0, RED], [b, "Hari 20", at1, GREEN]].forEach(([v, lab, at, col], i) => { const k = easeIO(clamp((t - at) / 1.1, 0, 1)); if (t < at) return; const bx = x + 150 + i * 280, H = 420 * v / mx * k, base = 880;
        P(ctx, bx, base - H, 180, Math.max(H, 4), 14, col, 5, OUT); T(ctx, Math.round(v * k) + unit, bx + 90, base - H - 24, 54, { align: "center", col: "#FFF" }); T(ctx, lab, bx + 90, base + 50, 30, { align: "center", col: "#A9BCDD" }); });
      if (t > at1 + 1.1){ const s = pop(t, at1 + 1.1, .4); ctx.save(); ctx.translate(x + 380, 330); ctx.scale(s, s); P(ctx, -170, -40, 340, 80, 40, GREEN, 5, OUT); T(ctx, `${a}${unit} → ${b}${unit}`, 0, 14, 38, { align: "center", col: "#FFF" }); ctx.restore(); } };
    panel(170, "Menyiapkan 1 pesanan", 42, 14, " mnt", 46, tm(f, f.a0At, .2), tm(f, f.aAt, 1), true);
    panel(990, "Kiriman tepat waktu", 71, 98, "%", 100, tm(f, f.b0At, 2.5), tm(f, f.bAt, 3.5), false);
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.aAt, 1)), "rise", .5, 1); add(g(tm(f, f.aAt, 1)) + 1.1, "chime", .6); add(g(tm(f, f.bAt, 3.5)), "rise", .5, 1); add(g(tm(f, f.bAt, 3.5)) + 1.1, "chime", .7); } };

  // peta kota: 12 toko oranye + 5 toko baru hijau
  const DOTS12 = [[540, 380], [700, 300], [860, 420], [1010, 330], [620, 560], [800, 640], [1120, 520], [1270, 400], [980, 720], [1220, 700], [1400, 600], [1520, 360]], NEW5 = [[430, 300], [560, 760], [1380, 850], [1580, 520], [880, 880]];
  function cityMap(ctx, t, o){ ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; P(ctx, 260, 150, 1400, 820, 26, "#F3EAD9", 0); ctx.restore(); P(ctx, 260, 150, 1400, 820, 26, "#F3EAD9", 6, OUT);
    ctx.save(); rr(ctx, 266, 156, 1388, 808, 22); ctx.clip();
    ctx.fillStyle = "#CFE3B8"; ctx.beginPath(); ctx.ellipse(420, 820, 200, 120, .2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(1500, 860, 180, 90, -.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#9FC6D9"; ctx.lineWidth = 46; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(200, 250); ctx.bezierCurveTo(600, 300, 500, 520, 900, 560); ctx.bezierCurveTo(1200, 590, 1300, 820, 1700, 900); ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 22; [[[260, 470], [1660, 470]], [[260, 760], [1660, 760]], [[700, 150], [700, 970]], [[1180, 150], [1180, 970]], [[300, 200], [1600, 950]]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
    ctx.restore();
    const lit = o.lit, per = o.per ?? .12; let n = 0, m = 0;
    DOTS12.forEach(([x, y], i) => { const s = pop(t, lit + i * per, .35); if (s <= 0) return; n++; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, String(i + 1), 0, 10, 28, { align: "center", col: "#FFF" }); ctx.restore(); });
    NEW5.forEach(([x, y], i) => { const a = o.nw + i * (o.per5 ?? .45), s = pop(t, a, .4); if (s <= 0) return; m++; const r = ((t - a) * 1.1) % 1; ctx.strokeStyle = hexA(GREEN, 1 - r); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 34 + r * 60, 0, TAU); ctx.stroke(); glow(ctx, x, y, 80, GREEN, .4);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fillStyle = GREEN; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); T(ctx, "+", 0, 14, 44, { align: "center", col: "#FFF" }); ctx.restore(); });
    T(ctx, o.title || "Toko Wijaya", 320, 236, 50, { col: NAVY }); P(ctx, 1240, 196, 380, 64, 32, NAVY, 4); T(ctx, m ? `${n} toko + ${m} baru` : `${n} toko`, 1430, 240, 30, { align: "center", col: "#FFF", maxW: 350 });
    return [n, m]; }
  FX.storeMap17 = { layer: "screen", draw(ctx, f, t){ bgDark(ctx, t); ctx.save(); push(ctx, f, t, .018, 960, 560); const lit = tm(f, f.litAt, .3); cityMap(ctx, t, { lit, nw: tm(f, f.newAt, 2.2), title: f.title }); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 1010, pop(t, tm(f, f.chipAt, 4.5), .4), f.chip, f.chipBg || GREEN, "#FFF", 36, 0); },
    sfx(f, g, add){ for (let i = 0; i < 12; i++) add(g(tm(f, f.litAt, .3) + i * .12), "pop", .3); for (let i = 0; i < 5; i++) add(g(tm(f, f.newAt, 2.2) + i * .45), "ping", .5); if (f.chip) add(g(tm(f, f.chipAt, 4.5)), "chime", .6); } };

  // panggilan video Pak Wijaya (ponsel): peta toko di dinding belakangnya, jendela kecil Rina & Dodi
  FX.wijayaCall = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.04) * (1 + q * .012); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#B5774F", bgCols: [[0, "#8E6A4A"], [1, "#5E4430"]] }, f), z);
    ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#E9D9BF"], [1, "#CDB58F"]]); ctx.fillRect(x, y, w, h);
    ctx.save(); ctx.translate(x + w / 2, y + 250); ctx.scale(.3, .3); ctx.translate(-960, -560); cityMap(ctx, t, { lit: -9, nw: tm(f, f.newAt, 1.5), per5: .35, title: "Toko Wijaya" }); ctx.restore();
    const talk = (f.talk || []).some(([a, b]) => t >= tm(f, a) && t <= tm(f, b));
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); toon(ctx, "wijaya", x + w / 2 - 10, y + h + 170, 640, { pose: talk ? "talk" : "idle", expr: f.expr || "happy", look: "cam" }, t, { talk }); ctx.restore();
    ctx.fillStyle = "rgba(19,34,61,.75)"; ctx.fillRect(x, y, w, 110); T(ctx, "Pak Wijaya", x + 30, y + 58, 32, { col: "#FFF" }); T(ctx, "Panggilan video · " + String(Math.floor(q / 60)).padStart(2, "0") + ":" + String(Math.floor(q % 60)).padStart(2, "0"), x + 30, y + 92, 22, { col: "#7FD39B", w: 700 });
    P(ctx, x + w - 150, y + h - 290, 130, 170, 14, "#3B4A6B", 4, "#FFF6EA"); ctx.save(); rr(ctx, x + w - 150, y + h - 290, 130, 170, 14); ctx.clip(); toon(ctx, "rina", x + w - 112, y + h - 40, 170, { pose: "idle", expr: "happy", look: "cam" }, t); toon(ctx, "dodi", x + w - 58, y + h - 40, 170, { pose: "idle", expr: f.dodiExpr || "shock", look: "cam" }, t + 1, { hat: null }); ctx.restore();
    ctx.beginPath(); ctx.arc(x + w / 2, y + h - 70, 40, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.fillStyle = "#FFF"; ctx.fillRect(x + w / 2 - 18, y + h - 74, 36, 9);
    ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1520, f.chipY ?? 240, pop(t, tm(f, f.chipAt, 1), .4), f.chip, f.chipBg || GREEN, "#FFF", 38, .04); },
    sfx(f, g, add){ add(g(f.at), "ring", .5, .8); add(g(f.at + .8), "click", .6); if (f.newAt != null) for (let i = 0; i < 5; i++) add(g(tm(f, f.newAt)) + i * .35, "ping", .35); if (f.chip) add(g(tm(f, f.chipAt, 1)), "chime", .6); } };

  // brosur masuk laci meja
  FX.drawer = { layer: "screen", draw(ctx, f, t){ fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#E9CFAE"], [1, "#C99568"]])); ctx.save(); push(ctx, f, t, .015);
    const oA = tm(f, f.openAt, .3), cA = tm(f, f.closeAt, 2.4), op = easeIO(clamp((t - oA) / .6, 0, 1)) * (1 - easeIO(clamp((t - cA) / .5, 0, 1))), mA = tm(f, f.moveAt, 1), mk = easeIO(clamp((t - mA) / 1, 0, 1));
    P(ctx, 200, 300, 1520, 120, 10, "#C47A48", 6); P(ctx, 220, 420, 1480, 700, 0, "#9A5A34", 6);
    P(ctx, 560, 470 + op * 40, 800, 70 * op + 2, 4, "#3B2418", 0); // drawer interior
    const bx = lerp(980, 960, mk), by = lerp(250, 470 + op * 60, mk), sc = lerp(1, .8, mk);
    if (!(t > cA + .3)){ ctx.save(); ctx.translate(bx, by); ctx.rotate(lerp(-.12, 0, mk)); ctx.scale(sc * 2.2, sc * 2.2 * lerp(1, .35, mk)); brochureArt(ctx, 150, 200, t); ctx.restore(); }
    P(ctx, 540, 480 + op * 90, 840, 250, 10, "#B5643C", 6); P(ctx, 860, 580 + op * 90, 200, 36, 18, "#E8C07A", 5);
    if (mk > 0 && mk < 1){ ctx.save(); ctx.translate(bx + 120, by - 40); ctx.rotate(-.4); ctx.fillStyle = SK.c; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -50, -20, 120, 230, 50); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#3B2418"; ctx.fillRect(-55, 150, 130, 120); ctx.restore(); }
    ctx.restore(); if (f.chip) chip(ctx, f.chipX ?? 960, f.chipY ?? 150, pop(t, tm(f, f.chipAt, 3), .4), f.chip, f.chipBg || GREEN, "#FFF", 42, -.02); },
    sfx(f, g, add){ add(g(tm(f, f.openAt, .3)), "whoosh", .4); add(g(tm(f, f.closeAt, 2.4)) + .4, "thud", .7); if (f.chip) add(g(tm(f, f.chipAt, 3)), "stamp", .7); } };

  // notifikasi tagihan dari 7 aplikasi di layar kunci
  const BILLS = [["Pinjaman A", "#5B7DB1", "Tagihan Rp850.000 jatuh tempo hari ini"], ["Paylater B", "#D9483B", "Cicilan ke-3 belum dibayar"], ["Kredit C", "#2F6F73", "Denda keterlambatan Rp45.000"], ["Pinjaman D", "#8E4A24", "Tagihan Rp1.200.000 · hari ini"],
    ["Paylater E", "#9B7BC4", "Segera bayar, hindari denda"], ["Cicilan F", "#C2691F", "Jatuh tempo: 5 Juli"], ["Pinjaman G", "#3BA36B", "Tagihan Rp600.000 belum lunas"]];
  FX.bills = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, per = f.per ?? .45, a0 = tm(f, f.startAt, .3); let shake = 0; BILLS.forEach((_, i) => { const d = t - (a0 + i * per); if (d > 0 && d < .4) shake = Math.sin(t * 80) * 8 * (1 - d / .4); });
    ctx.save(); ctx.translate(shake, 0); const z = (f.scale || 1.04) * (1 + q * .014); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: true, skin: "#E2A77C" }, f), z);
    ctx.fillStyle = lg(ctx, 0, y, 0, y + h, [[0, "#2A2346"], [1, "#4E3446"]]); ctx.fillRect(x, y, w, h); T(ctx, f.clock || "12.41", 0, y + 120, 84, { align: "center", col: "#FFF" }); T(ctx, f.date || "Sabtu, 5 Juli", 0, y + 160, 26, { align: "center", col: "#DCE6F5", w: 600 });
    BILLS.forEach(([nm, col, tx], i) => { const s = pop(t, a0 + i * per, .3); if (s <= 0) return; const by = y + 190 + i * 96; ctx.save(); ctx.globalAlpha = Math.min(1, s); ctx.translate(0, (1 - Math.min(1, s)) * -40);
      P(ctx, x + 14, by, w - 28, 88, 18, "rgba(255,255,255,.94)", 0); P(ctx, x + 28, by + 18, 52, 52, 12, col, 0); T(ctx, nm[0], x + 54, by + 56, 32, { align: "center", col: "#FFF" });
      T(ctx, nm, x + 96, by + 36, 22, { col: NAVY }); T(ctx, "sekarang", x + w - 36, by + 36, 16, { align: "right", col: "#6B7280", w: 600 }); T(ctx, tx, x + 96, by + 68, 18, { col: "#374151", w: 600, maxW: w - 140 }); ctx.restore(); });
    ctx.restore(); ctx.restore();
    if (f.chip) chip(ctx, f.chipX ?? 1530, f.chipY ?? 260, pop(t, tm(f, f.chipAt, a0 - f.at + 7 * per), .4), f.chip, f.chipBg || RED, "#FFF", 40, .04); },
    sfx(f, g, add){ const per = f.per ?? .45, a0 = tm(f, f.startAt, .3); BILLS.forEach((_, i) => { add(g(a0 + i * per), "buzz", .6, .3); add(g(a0 + i * per), "notif", .5); }); } };

  // kartu penutup cerita: KLIEN TERBESAR · SELESAI
  FX.finale = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .5), a = fin(t, f.at, .5); if (s <= 0) return; ctx.save(); ctx.fillStyle = `rgba(12,8,20,${.72 * a})`; ctx.fillRect(0, 0, SW, SH);
    ctx.translate(960 + Math.sin(t * .8) * 6, 500 + Math.sin(t * 1.1) * 6); ctx.scale(s, s); ctx.rotate(-.015);
    T(ctx, f.top || "KANTOR TANGANI", 0, -170, 44, { align: "center", col: "#F6D9AE", track: 8 }); T(ctx, f.title || "KLIEN TERBESAR", 0, -40, 130, { align: "center", col: "#FFF", stroke: "#0B1426", sw: 18 });
    const st = pop(t, f.at + (f.stampAt ?? .8), .35); if (st > 0){ ctx.save(); ctx.translate(0, 110); ctx.scale(st * 1.05, st * 1.05); ctx.rotate(-.05); P(ctx, -260, -66, 520, 132, 24, ORANGE, 8, OUT); T(ctx, f.stamp || "SELESAI", 0, 34, 92, { align: "center", col: "#FFF6EA", track: 8 }); ctx.restore(); }
    const sa = fin(t, f.at + (f.stampAt ?? .8) + .5, .5); ctx.globalAlpha = sa; T(ctx, f.sub || "Cerita 2 · Eps 1–4", 0, 250, 36, { align: "center", col: "#DCE6F5", w: 700 }); ctx.restore(); },
    sfx(f, g, add){ add(g(f.at), "whoosh", .5); add(g(f.at + (f.stampAt ?? .8)), "stamp", 1); } };

  /* ============================== THUMBNAIL ============================== */
  S.thumbs = S.thumbs || {};
  S.thumbs.gudang4 = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
    const cam = S.makeCam(1000, 470, 1.05, 0, 0, 0, 0); S.LOC.gudang.bg(x, cam, 3.1, { boxes: [] });
    x.save(); cam.apply(x, 1); x.translate(1250, 640); x.scale(1.1, 1.1); statusArt(x, 1, 2.3); x.restore();
    S.grade(x, { warm: .1, vig: .3 }); x.fillStyle = 'rgba(19,34,61,.22)'; x.fillRect(0, 0, 1920, 1080);
    x.save(); x.translate(470, 150); x.rotate(-.04); P(x, -300, -66, 600, 132, 66, GREEN, 7, OUT); T(x, "42 → 14 MENIT", 0, 24, 64, { align: 'center', col: '#FFF' }); x.restore();
    const look = S.cast.dodi.look || S.cast.dodi; const a = Object.assign({ x: 450, y: 1560, size: 1050, face: 1, seed: 3 }, look, { keys: [{ at: 0, pose: 'hold', expr: 'laugh', look: 'cam' }] });
    const st = TT.toonState(a, null, 5); st.talk = false; TT.drawToon(x, a, st, 5.25);
    x.save(); x.translate(820, 1000); x.rotate(-.1); x.scale(1.15, 1.15); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 30; pocketPage(x, -150, -100, 300, 200, 3, { sk: 1, tx: 1, dt: 1, nt: 1, n2: 0, hl: 1 }); x.restore();
    return c.toDataURL('image/png').slice(22); };
})();
