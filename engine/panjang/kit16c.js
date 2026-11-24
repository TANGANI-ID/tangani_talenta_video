/* STORY16 kit C — tambahan untuk Kantor Tangani: Tak Terlihat Eps 3 ("Bu Radar"). Dimuat sesudah kit16b.js.
   Lokasi  : toilet (bilik toilet kantor, lampu neon berkedip).
   Properti: bigPlant (tanaman besar untuk bersembunyi), hand_folder, hand_envelope, hand_envelopes.
   Efek    : radarChat (grup: gambar "BU RADAR AKTIF" lalu dihapus), ccMail (CC Bu Ratna di setiap surel),
             updateDay (Update? jam 09/13/16), headphones (headphone leher → telinga, world), capGlasses (kacamata tutup botol, world),
             wrongSend (balasan salah klien + ralat), cycle (lingkaran menghindar ↔ dicek), msgChart (grafik pesan Bu Ratna ke tim),
             phoneDraft (draf tengah malam yang dihapus huruf demi huruf), alarm (alarm 16.00 LAPORAN), nightCount (pesan malam 5→3→1→0),
             boardWrite (papan tulis: tulisan tangan), rulePoster (aturan grup di pintu), sleepBed (Rina tidur nyenyak),
             folderDesk (map KLIEN PRIORITAS), envelope (amplop penilaian kinerja: CUKUP).
   Waktu: angka = relatif terhadap f.at; objek {cue}/{at} di dalam larik = waktu lokal adegan (lihat tm()). */
(() => {
  'use strict';
  const S = window.S16, TT = window.TT, U = S.U, { LOC, FX, PROP, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, lerp, rnd, lg, rg, glow, fillAll, layer, eIn } = S;
  const SW = 1920, SH = 1080, F = S.FAM, F2 = S.FAM2, easeIO = TT.easeIO;
  const pop = (t, t0, d) => t < t0 ? 0 : eBack(clamp((t - t0) / (d || .35), 0, 1));
  const fin = (t, t0, d) => clamp((t - t0) / (d || .3), 0, 1);
  const P = U.panel, T = (ctx, txt, x, y, size, o) => S.text(ctx, txt, x, y, size, o);
  const RED = "#D9483B", GREEN = "#3BA36B", BLUE = "#5B7DB1", TEAL = "#2F6F73", YEL = "#F6C343", MAROON = "#6E2430";
  const typed = (str, t, t0, cps) => str.slice(0, Math.max(0, Math.floor((t - t0) * (cps || 22))));
  const tm = (f, v, d) => v == null ? (d == null ? null : f.at + d) : (typeof v === "object" ? v.at : f.at + v);
  const outA = (f, t) => f.out != null ? 1 - fin(t, f.out, .35) : 1;
  const chipAt = (ctx, x, y, s, txt, bg, col, size, rot) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot ?? .04); font(ctx, 800, size || 44, F); const w = ctx.measureText(txt).width + 70;
    P(ctx, -w / 2, -(size || 44) * 1.1, w, (size || 44) * 2.2, 22, bg || NAVY, 6, OUT); T(ctx, txt, 0, (size || 44) * .36, size || 44, { align: "center", col: col || "#FFF" }); ctx.restore(); };
  const moon = (ctx, x, y, r, col) => { ctx.save(); ctx.fillStyle = col || "#FFE9B0"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(x + r * .45, y - r * .3, r * .85, 0, TAU); ctx.fill(); ctx.restore(); };

  /* ============================== LOKASI ============================== */
  // bilik toilet kantor: dinding keramik, sekat kiri-kanan, tangki + kloset (tutup tertutup), tisu, gantungan, lampu neon berkedip
  LOC.toilet = { bounds: [-200, 2120, -200, 1300], grade: { warm: .04, vig: .6 }, def: {},
    bg(ctx, c, t, o){
      layer(ctx, c, .5, () => { fillAll(ctx, "#CFE0DC");
        ctx.strokeStyle = "rgba(47,111,115,.18)"; ctx.lineWidth = 3; for (let x = -400; x < 2400; x += 90){ ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, 760); ctx.stroke(); } for (let y = -400; y < 760; y += 90){ ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2400, y); ctx.stroke(); }
        ctx.fillStyle = "#A9C7C2"; ctx.fillRect(-400, 420, 2800, 30);
        // sign
        P(ctx, 1180, 170, 300, 120, 10, "#FFFDF8", 5); T(ctx, "JAGA", 1330, 220, 30, { align: "center", col: TEAL, track: 3 }); T(ctx, "KEBERSIHAN", 1330, 264, 30, { align: "center", col: TEAL, track: 2 });
        // flush tank
        P(ctx, 820, 330, 280, 220, 18, "#F7FAFA", 6); P(ctx, 930, 350, 60, 22, 8, "#C9D6DA", 3);
      });
      layer(ctx, c, .75, () => { ctx.fillStyle = lg(ctx, 0, 740, 0, 1300, [[0, "#B9C9C6"], [1, "#94A6A3"]]); ctx.fillRect(-3000, 740, 8000, 2000);
        ctx.strokeStyle = "rgba(47,80,80,.18)"; ctx.lineWidth = 3; for (let k = -20; k < 30; k++){ ctx.beginPath(); ctx.moveTo(960 + k * 110, 740); ctx.lineTo(960 + k * 300, 1400); ctx.stroke(); } for (let y = 800; y < 1400; y += 80){ ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(5000, y); ctx.stroke(); }
        // partitions
        [[-200, 1], [2120, -1]].forEach(([x, d]) => { ctx.fillStyle = "#B7A48C"; ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x + d * 520, -200); ctx.lineTo(x + d * 520, 940); ctx.lineTo(x, 1300); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); });
        // toilet paper + hook on the right partition
        ctx.save(); ctx.translate(1700, 640); P(ctx, -50, -20, 100, 16, 6, "#9AA3AE", 3); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(0, 26, 46, 40, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = "#E5E7EB"; ctx.fillRect(-46, 26, 92 * .5, 90 + Math.sin(t * 1.6) * 6); ctx.restore();
        ctx.save(); ctx.translate(1660, 300); ctx.strokeStyle = "#6E7782"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 40); ctx.quadraticCurveTo(0, 70, 30, 60); ctx.stroke(); ctx.restore();
        P(ctx, 1630, 320, 70, 160, 16, "#8E4E2E", 4); // tas tergantung
      });
      // toilet bowl (closed lid) — the actor sits on it
      layer(ctx, c, 1, () => { const x = o.seatX ?? 960; ctx.save(); ctx.translate(x, 1000);
        ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(0, 4, 150, 16, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#F4F7F7"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-90, -80); ctx.lineTo(90, -80); ctx.lineTo(70, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
        P(ctx, -130, -110, 260, 34, 16, "#FFFFFF", 6); ctx.restore(); });
    },
    front(ctx, c, t, o){ ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const fl = Math.sin(t * 23) > .96 ? .22 : 0, b = .1 + fl; ctx.fillStyle = `rgba(10,20,24,${b})`; ctx.fillRect(0, 0, SW, SH);
      ctx.fillStyle = rg(ctx, 960, -120, 50, 900, [[0, "rgba(230,255,250,.22)"], [1, "rgba(230,255,250,0)"]]); ctx.fillRect(0, 0, SW, SH); ctx.restore(); } };

  /* ============================== PROPERTI ============================== */
  // big potted plant (monstera) — origin = floor point; sways a little; o.rustle = time (local) when someone brushes past
  PROP.bigPlant = (ctx, o, t) => { const s = o.size || 1, rT = o.rustle != null && typeof o.rustle === "object" ? o.rustle.at : o.rustle, ru = rT != null ? Math.max(0, 1 - Math.abs(t - rT) / .8) : 0;
    ctx.save(); ctx.scale(s, s); ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, 150, 18, 0, 0, TAU); ctx.fill();
    P(ctx, -110, -190, 220, 190, 24, "#B5643C", 6); ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(-90, -170, 180, 14);
    const leaf = (a, l, w, col, k) => { ctx.save(); ctx.rotate(a + Math.sin(t * 1.2 + k) * .03 + ru * Math.sin(t * 22 + k) * .12); ctx.fillStyle = col; ctx.strokeStyle = OUT; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-w, -l * .5, 0, -l); ctx.quadraticCurveTo(w, -l * .5, 0, 0); ctx.fill(); ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, -l + 20); ctx.stroke(); ctx.restore(); };
    ctx.translate(0, -180); [[-1.1, 360, 120], [-.7, 520, 150], [-.3, 640, 160], [.1, 700, 170], [.5, 600, 160], [.9, 460, 140], [1.25, 330, 110], [-.15, 470, 130], [.35, 420, 130]].forEach(([a, l, w], k) => leaf(a, l, w, k % 2 ? "#4F8F5C" : "#3E7D4F", k));
    ctx.restore(); };
  // hand-held map / envelopes
  PROP.hand_folder = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.15); P(ctx, -4, -12, 20, 16, 1.4, "#E8A55B", .9); ctx.fillStyle = RED; ctx.fillRect(-2, -10, 7, 2.4); ctx.restore(); };
  PROP.hand_envelope = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.rotate(-.12); P(ctx, -3, -9, 16, 11, 1, "#F3E3C3", .8); ctx.strokeStyle = "rgba(59,36,24,.6)"; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(-3, -9); ctx.lineTo(5, -3); ctx.lineTo(13, -9); ctx.stroke(); ctx.restore(); };
  PROP.hand_envelopes = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); [0, 1, 2].forEach(i => { ctx.save(); ctx.translate(i * 1.5, -i * 2.2); ctx.rotate(-.12 + i * .05); P(ctx, -3, -9, 16, 11, 1, i === 2 ? "#FFFDF8" : "#F3E3C3", .8); ctx.restore(); }); ctx.restore(); };

  /* ============================== EFEK WORLD (menempel di tokoh) ============================== */
  // headphones: on the neck until onAt, then lifted onto the ears
  FX.headphones = { layer: "world", draw(ctx, f, t){ const an = S.anchors[f.who || "yoga"]; if (!an || !an.world) return; const r = an.world, k = r.k, st = r.st;
    const on = f.onAt == null ? 1 : easeIO(clamp((t - tm(f, f.onAt)) / .45, 0, 1));
    const nx = st.x + 1 * k * r.face, ny = r.headY + 17 * k, hx = r.headX, hy = r.headY + 1 * k;
    ctx.save(); ctx.lineCap = "round";
    if (on < .02){ ctx.strokeStyle = OUT; ctx.lineWidth = 4.4 * k; ctx.beginPath(); ctx.ellipse(nx, ny, 15 * k, 7 * k, 0, .1, Math.PI - .1); ctx.stroke(); ctx.strokeStyle = "#2B2A30"; ctx.lineWidth = 3 * k; ctx.stroke();
      [-1, 1].forEach(d => { P(ctx, nx + d * 15 * k - 4 * k, ny - 2 * k, 8 * k, 11 * k, 3 * k, "#2B2A30", 1.2 * k); ctx.fillStyle = ORANGE; ctx.fillRect(nx + d * 15 * k - 2.5 * k, ny + 1 * k, 5 * k, 5 * k); }); }
    else { const cx = lerp(nx, hx, on), cy = lerp(ny, hy, on), R = lerp(15, 23.5, on) * k;
      ctx.strokeStyle = OUT; ctx.lineWidth = 4.4 * k; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI + .25, TAU - .25); ctx.stroke(); ctx.strokeStyle = "#2B2A30"; ctx.lineWidth = 3 * k; ctx.stroke();
      [-1, 1].forEach(d => { const px = cx + d * (R - 1 * k); P(ctx, px - 4.5 * k, cy - 6 * k, 9 * k, 14 * k, 4 * k, "#2B2A30", 1.3 * k); ctx.fillStyle = ORANGE; ctx.fillRect(px - 2.5 * k, cy - 2 * k, 5 * k, 6 * k); });
      if (on >= 1){ for (let i = 0; i < 2; i++){ const q = (t * .9 + i * .5) % 1; ctx.globalAlpha = 1 - q; T(ctx, "♪", cx + R + 8 * k + q * 10 * k, cy - 14 * k - q * 18 * k, 10 * k, { col: ORANGE }); } ctx.globalAlpha = 1; } }
    ctx.restore(); },
    sfx(f, g, add){ if (f.onAt != null) add(g(tm(f, f.onAt)), "whoosh", .4); } };

  // bottle-cap glasses on Bayu (pantry joke)
  FX.capGlasses = { layer: "world", draw(ctx, f, t){ const an = S.anchors[f.who || "bayu"]; if (!an || !an.world) return; const r = an.world, k = r.k, st = r.st, fc = r.face;
    const s = f.onAt == null ? 1 : pop(t, tm(f, f.onAt), .3); if (s <= 0) return; ctx.save();
    const ex = d => st.x + (2.6 + d * 7.3) * k * fc, ey = r.headY + 2.6 * k;
    ctx.strokeStyle = OUT; ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.moveTo(ex(-1) + 5 * k, ey); ctx.lineTo(ex(1) - 5 * k, ey); ctx.stroke();
    [-1, 1].forEach((d, i) => { ctx.save(); ctx.translate(ex(d), ey); ctx.scale(s, s); ctx.rotate(t * .5 + i); ctx.fillStyle = i ? "#D9483B" : "#2F6F73"; ctx.beginPath();
      for (let j = 0; j < 21; j++){ const a = j / 21 * TAU, rr0 = (j % 2 ? 5.2 : 6) * k; ctx.lineTo(Math.cos(a) * rr0, Math.sin(a) * rr0); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = .9 * k; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(-1.4 * k, -1.6 * k, 1.6 * k, 0, TAU); ctx.fill(); ctx.restore(); });
    ctx.restore(); },
    sfx(f, g, add){ if (f.onAt != null) add(g(tm(f, f.onAt)), "boing", .5); } };

  /* ============================== EFEK LAYAR ============================== */
  // --- group chat at night: Bayu posts a "BU RADAR AKTIF" picture, then deletes it ---
  function radarPic(ctx, x, y, w, h, t){ P(ctx, x, y, w, h, 14, "#0F2A22", 0); ctx.save(); rr(ctx, x, y, w, h, 14); ctx.clip();
    const cx = x + w / 2, cy = y + h * .44, R = Math.min(w, h) * .36; ctx.strokeStyle = "rgba(127,211,155,.55)"; ctx.lineWidth = 3; [1, .66, .33].forEach(q => { ctx.beginPath(); ctx.arc(cx, cy, R * q, 0, TAU); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    const a = t * 2.6; ctx.fillStyle = "rgba(127,211,155,.35)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a - .7, a); ctx.closePath(); ctx.fill();
    [[.4, -.5], [-.55, .2], [.2, .6]].forEach(([dx, dy], i) => { ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * 3 + i)); ctx.fillStyle = "#7FD39B"; ctx.beginPath(); ctx.arc(cx + dx * R, cy + dy * R, 7, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1;
    T(ctx, "BU RADAR AKTIF", cx, y + h - 26, 30, { align: "center", col: "#F6C343", stroke: "#0F2A22", sw: 6 }); ctx.restore(); }
  FX.radarChat = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.06) * (1 + q * .015); ctx.save(); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: true, skin: "#C98E68" }, f), z);
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); for (let k = 0; k < 12; k++){ ctx.fillStyle = "rgba(194,105,31,.05)"; ctx.beginPath(); ctx.arc(x + rnd(k) * w, y + rnd(k + 4) * h, 30 + rnd(k + 8) * 40, 0, TAU); ctx.fill(); }
    let yy = y + 146; [["Sinta", "Templat balasan baru sudah di folder, ya.", TEAL, "22.58"], ["Yoga", "Siap, makasih.", "#5E8C3A", "23.02"]].forEach(([nm, tx, col, tt]) => { const r = S.bubbleMsg(ctx, x + 22, yy, w - 80, tx, { name: nm, nameCol: col, time: tt, size: 24 }); yy += r[3] + 16; });
    const im = tm(f, f.imgAt, .4), dl = tm(f, f.delAt), s = pop(t, im, .4);
    if (s > 0){ const del = dl != null && t > dl; ctx.save(); ctx.translate(x + 22, yy); ctx.scale(Math.min(1, s), Math.min(1, s));
      if (!del){ P(ctx, 0, 0, 340, 380, 20, "#FFFFFF", 3, "#D1D5DB"); T(ctx, "Bayu", 22, 34, 22, { col: ORANGE, w: 800 }); radarPic(ctx, 16, 50, 308, 290, t); T(ctx, "23.31", 324, 368, 16, { align: "right", col: "#9CA3AF", w: 700 });
        if (dl != null && t > dl - .5){ const k = 1 - (dl - t) / .5; ctx.fillStyle = `rgba(255,255,255,${k * .8})`; ctx.fillRect(0, 0, 340, 380); } }
      else { const k = pop(t, dl, .3); ctx.scale(Math.min(1, k), Math.min(1, k)); P(ctx, 0, 0, 380, 76, 20, "#FFFFFF", 3, "#D1D5DB"); ctx.strokeStyle = "#9CA3AF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(36, 38, 12, 0, TAU); ctx.moveTo(28, 30); ctx.lineTo(44, 46); ctx.stroke();
        T(ctx, "Pesan ini telah dihapus", 60, 47, 23, { col: "#6B7280", w: 500, fam: F2 }); }
      ctx.restore();
      if (dl != null && t > dl && t < dl + .7){ for (let i = 0; i < 14; i++){ const a = rnd(i) * TAU, d = (t - dl) * (200 + rnd(i + 3) * 300); ctx.globalAlpha = 1 - (t - dl) / .7; ctx.fillStyle = i % 2 ? "#7FD39B" : "#F6C343"; ctx.beginPath(); ctx.arc(x + 190 + Math.cos(a) * d, yy + 190 + Math.sin(a) * d, 7, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; } }
    S.chatHeader(ctx, x, y, w, f.title || "Tim Layanan Pelanggan", f.sub || "12 anggota", TEAL, "T", null, t);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - 80, w, 80); P(ctx, x + 20, y + h - 64, w - 40, 48, 24, "#FFFFFF", 2, "#D1D5DB");
    ctx.restore();
    if (dl != null && t > dl + .2) chipAt(ctx, 1490, 300, pop(t, dl + .2, .4), "DIHAPUS…", "#5E5A62", "#FFF", 46, .05);
    else if (s > 0) chipAt(ctx, 1490, 300, pop(t, im + .5, .4), "BAYU", ORANGE, "#FFF", 46, -.04); },
    sfx(f, g, add){ add(g(tm(f, f.imgAt, .4)), "notif", .8); if (f.delAt != null) add(g(tm(f, f.delAt)), "whoosh", .5); } };

  // --- inbox where every e-mail carries "CC: Bu Ratna" ---
  const MAILS = [["Toko Berkah", "Balasan tiket #4471"], ["Tim TI", "Akses edit sistem tiket"], ["Sinta", "Templat balasan baru"], ["Apotek Sehat", "Keluhan struk tidak tercetak"], ["Yoga", "Rekap tiket minggu ini"], ["Mart 8", "Jadwal pelatihan kasir"]];
  FX.ccMail = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Surel Kantor · Terkirim" }, f)), q = t - f.at, per = f.per ?? .55, st = f.startAt ?? .4;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); T(ctx, "Terkirim", x + 40, y + 62, 36, { col: NAVY });
    MAILS.forEach(([to, sub], i) => { const ry = y + 96 + i * 122; ctx.fillStyle = i % 2 ? "#FAFAFA" : "#FFFFFF"; ctx.fillRect(x, ry, w, 122); ctx.fillStyle = "#E5E7EB"; ctx.fillRect(x, ry + 120, w, 2);
      S.avatar(ctx, x + 70, ry + 60, 32, ["#6B7280", TEAL, ORANGE, BLUE][i % 4], to[0]); T(ctx, "Kepada: " + to, x + 124, ry + 50, 26, { col: "#111827" }); T(ctx, sub, x + 124, ry + 92, 24, { col: "#6B7280", w: 500, fam: F2 });
      const s = pop(t, f.at + st + i * per, .3); if (s > 0){ ctx.save(); ctx.translate(x + w - 250, ry + 60); ctx.scale(s, s); ctx.rotate((i % 2 ? .03 : -.03)); P(ctx, -150, -30, 300, 60, 30, "#FDE2DF", 4, RED); T(ctx, "CC: Bu Ratna", 0, 11, 28, { align: "center", col: RED }); ctx.restore(); } });
    ctx.restore(); const n = clamp(Math.floor((q - st) / per) + 1, 0, MAILS.length), s = pop(t, f.at + st, .4);
    ctx.save(); ctx.translate(1650, 150); ctx.scale(s, s); ctx.rotate(.05); P(ctx, -190, -62, 380, 124, 24, RED, 6, OUT); T(ctx, `${n}/${MAILS.length}`, 0, 0, 52, { align: "center", col: "#FFF" }); T(ctx, "surel di-CC", 0, 42, 26, { align: "center", col: "#FFE1DC", w: 600 }); ctx.restore(); },
    sfx(f, g, add){ for (let i = 0; i < MAILS.length; i++) add(g(f.at + (f.startAt ?? .4) + i * (f.per ?? .55)), "pop", .5); } };

  // --- three clocks 09.00 · 13.00 · 16.00, each with Bu Ratna's "Update?" ---
  FX.updateDay = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#F4DEC1"], [1, "#E2BE93"]])); U.motes(ctx, t, 20, 5, 0, 0, SW, SH, "#FFF3D6", .5);
    const z = 1 + q * .015; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    T(ctx, f.title || "SETIAP HARI", 960, 150, 56, { align: "center", col: BROWN, track: 6 });
    const times = f.times || [.3, 1.3, 2.3], lab = ["09.00", "13.00", "16.00"], hh = [9, 13, 16];
    lab.forEach((l, i) => { const cx = 380 + i * 580, s0 = pop(t, f.at + .1 + i * .12, .4); if (s0 <= 0) return; ctx.save(); ctx.translate(cx, 470); ctx.scale(s0, s0);
      const tt = tm(f, times[i]), on = t > tt; U.clock(ctx, 0, 0, 150, hh[i] + (on ? Math.min(.25, (t - tt) * .05) : 0), on ? Math.min(15, (t - tt) * 3) : 0, 0);
      T(ctx, l, 0, 230, 58, { align: "center", col: on ? RED : BROWN });
      const b = pop(t, tt, .4); if (b > 0){ ctx.save(); ctx.translate(110, -150); ctx.scale(b, b); ctx.rotate(.06 + Math.sin(t * 3 + i) * .03); P(ctx, -30, -50, 230, 100, 24, "#FFFFFF", 5); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(0, 46); ctx.lineTo(-30, 80); ctx.lineTo(30, 46); ctx.fill();
        T(ctx, "Update?", 85, 16, 40, { align: "center", col: MAROON }); ctx.restore(); }
      ctx.restore(); });
    const n = times.filter(v => t > tm(f, v)).length; if (n >= 3) chipAt(ctx, 960, 900, pop(t, tm(f, times[2]) + .5, .4), "3× SEHARI", RED, "#FFF", 56, -.03);
    ctx.restore(); },
    sfx(f, g, add){ (f.times || [.3, 1.3, 2.3]).forEach(v => add(g(tm(f, v)), "notif", .8)); } };

  // --- laptop chat: reply meant for Toko Makmur sent to Toko Maju, then the correction ---
  FX.wrongSend = { layer: "screen", draw(ctx, f, t){ ctx.save(); const [x, y, w, h] = S.laptopFrame(ctx, t, Object.assign({ app: "Chat Klien", clock: "08:14" }, f)), q = t - f.at;
    const sA = tm(f, f.sendAt, .6), eA = tm(f, f.errAt, 1.6), xA = tm(f, f.fixAt, 3);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y, 380, h); [["Toko Maju Jaya", true], ["Toko Makmur", false], ["Apotek Sehat", false], ["Mart 8", false], ["Kopi Senja", false]].forEach(([n, on], i) => { const ry = y + 20 + i * 100;
      P(ctx, x + 14, ry, 352, 84, 14, on ? "#FDEBD9" : "#F3F4F6", 0); S.avatar(ctx, x + 60, ry + 42, 28, on ? ORANGE : "#9CA3AF", n[0]); T(ctx, n, x + 102, ry + 52, 26, { col: on ? ORANGE : "#374151", maxW: 250 });
      if (i === 1 && t > eA){ ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 8); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; rr(ctx, x + 14, ry, 352, 84, 14); ctx.stroke(); ctx.restore(); } });
    const px = x + 380, pw = w - 380; ctx.fillStyle = "#EDE5DA"; ctx.fillRect(px, y, pw, h); ctx.fillStyle = NAVY; ctx.fillRect(px, y, pw, 96); S.avatar(ctx, px + 56, y + 48, 30, ORANGE, "M"); T(ctx, "Toko Maju Jaya", px + 104, y + 60, 30, { col: "#FFF" });
    if (t > eA){ ctx.save(); ctx.globalAlpha = .6 + .4 * Math.sin(t * 9); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.strokeRect(px + 4, y + 4, pw - 8, 88); ctx.restore(); }
    const msg = f.text || "Pak, pesanan kertas struk Toko Makmur sudah kami kirim pagi ini, ya.", fix = f.fixText || "Mohon maaf, Pak, pesan tadi salah kirim. Mohon diabaikan.";
    if (t < sA){ P(ctx, px + 30, y + h - 110, pw - 60, 80, 40, "#FFFFFF", 2, "#D1D5DB"); T(ctx, typed(msg, t, f.at, 40) + (Math.sin(t * 8) > 0 ? "|" : ""), px + 60, y + h - 60, 24, { col: "#111827", w: 600, fam: F2, maxW: pw - 140 }); }
    else { const s = pop(t, sA, .35); ctx.save(); ctx.translate(0, (1 - Math.min(1, s)) * 40); const r = S.bubbleMsg(ctx, px + 40, y + 140, pw - 140, msg, { me: true, right: pw - 80, time: "08.14 ✓✓", size: 28 }); ctx.restore();
      if (t > xA){ const s2 = pop(t, xA, .35); ctx.save(); ctx.translate(0, (1 - Math.min(1, s2)) * 40); ctx.globalAlpha = Math.min(1, s2); S.bubbleMsg(ctx, px + 40, y + 140 + r[3] + 26, pw - 140, fix, { me: true, right: pw - 80, time: "08.16 ✓✓", size: 28, bg: "#FFF4D6", stroke: "#E8C07A" }); ctx.restore(); } }
    ctx.restore();
    if (t > eA) chipAt(ctx, 1460, 640, pop(t, eA, .4), "SALAH KLIEN!", RED, "#FFF", 58, -.06);
    if (t > xA) chipAt(ctx, 520, 880, pop(t, xA + .2, .4), "RALAT", YEL, BROWN, 46, .05); },
    sfx(f, g, add){ add(g(f.at), "typing", .4, 1.2); add(g(tm(f, f.sendAt, .6)), "send", .7); add(g(tm(f, f.errAt, 1.6)), "dun", .8); add(g(tm(f, f.fixAt, 3)), "send", .6); } };

  // --- vicious circle: avoid → no news → more checking → more pressure → avoid … ---
  FX.cycle = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#2B2140"], [1, "#16112A"]])); U.motes(ctx, t, 24, 13, 0, 0, SW, SH, "#FFE3B0", .3);
    const z = 1 + q * .012; ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.rotate(Math.sin(t * .3) * .01);
    const N = f.nodes || [["Rina", "menghindar", RED], ["Bu Ratna", "tidak dapat kabar", BLUE], ["Bu Ratna", "makin sering mengecek", MAROON], ["Rina", "makin tertekan", ORANGE]];
    const R = 330, per = f.per ?? .7, ang = i => -Math.PI / 2 + i * TAU / N.length, sp = f.spinAt != null ? tm(f, f.spinAt) : f.at + per * N.length;
    // arrows
    N.forEach((_, i) => { const a0 = ang(i) + .32, a1 = ang(i + 1) - .32, s = clamp((t - f.at - (i + .6) * per) / .5, 0, 1); if (s <= 0) return; ctx.strokeStyle = "rgba(255,246,234,.75)"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, 0, R, a0, lerp(a0, a1, s)); ctx.stroke();
      if (s >= 1){ const ax = Math.cos(a1) * R, ay = Math.sin(a1) * R, da = a1 + Math.PI / 2; ctx.fillStyle = "rgba(255,246,234,.85)"; ctx.beginPath(); ctx.moveTo(ax + Math.cos(da) * 26, ay + Math.sin(da) * 26); ctx.lineTo(ax + Math.cos(da + 2.4) * 22, ay + Math.sin(da + 2.4) * 22); ctx.lineTo(ax + Math.cos(da - 2.4) * 22, ay + Math.sin(da - 2.4) * 22); ctx.fill(); } });
    // travelling spark (faster and faster)
    if (t > sp){ const u = t - sp, a = -Math.PI / 2 + (u * 1.2 + u * u * .25) * TAU / 4; for (let k = 0; k < 8; k++){ const aa = a - k * .05; ctx.globalAlpha = 1 - k / 8; ctx.fillStyle = YEL; ctx.beginPath(); ctx.arc(Math.cos(aa) * R, Math.sin(aa) * R, 16 - k * 1.5, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
    N.forEach(([who, txt, col], i) => { const s = pop(t, f.at + i * per, .4); if (s <= 0) return; const a = ang(i), nx = Math.cos(a) * R, ny = Math.sin(a) * R; ctx.save(); ctx.translate(nx, ny); ctx.scale(s, s); ctx.rotate(Math.sin(t * 1.5 + i) * .02);
      font(ctx, 800, 34, F); const w = Math.max(ctx.measureText(txt).width, 200) + 70; P(ctx, -w / 2, -70, w, 140, 26, col, 6, OUT); T(ctx, who, 0, -18, 30, { align: "center", col: "#FFE9D6", w: 700 }); T(ctx, txt, 0, 34, 34, { align: "center", col: "#FFF" }); ctx.restore(); });
    if (t > sp){ const s = pop(t, sp + .3, .4); ctx.save(); ctx.scale(s, s); T(ctx, f.center || "MAKIN", 0, -10, 54, { align: "center", col: YEL }); T(ctx, f.center2 || "BERPUTAR", 0, 50, 54, { align: "center", col: YEL }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ const n = (f.nodes || [0, 0, 0, 0]).length; for (let i = 0; i < n; i++) add(g(f.at + i * (f.per ?? .7)), "pop", .6); add(g(f.spinAt != null ? tm(f, f.spinAt) : f.at + (f.per ?? .7) * n), "riser", .5, 2); } };

  // --- Yoga's chart: Bu Ratna's messages per day to the whole team; flat for months, spike after the system demo ---
  const TEAM = [["Rina", RED], ["Yoga", "#7FA563"], ["Sinta", TEAL], ["Bayu", "#E8A55B"], ["Dewi", "#9B7BC4"], ["Fajar", "#5B9BD5"]];
  FX.msgChart = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1A2C4E"], [1, "#0D172B"]]));
    const z = 1 + q * .012; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    P(ctx, 130, 60, 1660, 940, 26, "#16263F", 5, "#2C4366"); T(ctx, f.title || "Pesan Bu Ratna ke tim, per hari", 190, 140, 44, { col: "#FFF" }); T(ctx, "data grup + chat pribadi · Sep–Feb", 190, 184, 24, { col: "#A9BCDD", w: 600 });
    const gx = 260, gy = 300, gw = 1300, gh = 560, N = 60, spike = 46, mx = 20;
    ctx.strokeStyle = "rgba(169,188,221,.18)"; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++){ const yy = gy + gh - k * gh / 4; ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke(); T(ctx, String(k * 5), gx - 20, yy + 8, 22, { align: "right", col: "#A9BCDD", w: 600 }); }
    ["SEP", "OKT", "NOV", "DES", "JAN", "FEB"].forEach((m, i) => T(ctx, m, gx + (i + .5) * gw / 6, gy + gh + 44, 24, { align: "center", col: "#A9BCDD" }));
    const dr = clamp((t - tm(f, f.drawAt, .3)) / (f.drawDur || 3), 0, 1), xi = i => gx + i / (N - 1) * gw;
    const val = (p, i) => i < spike ? 1 + rnd(i * 7 + p) * (p === 0 ? 1.5 : 1.2) : Math.min(19, 6 + (i - spike) * (1.6 + p * .2) + rnd(i + p * 3) * 3) - (p * .9);
    TEAM.forEach(([nm, col], p) => { ctx.strokeStyle = col; ctx.lineWidth = p === 0 ? 7 : 5; ctx.lineJoin = "round"; ctx.beginPath(); const nn = Math.floor(dr * (N - 1));
      for (let i = 0; i <= nn; i++){ const yy = gy + gh - val(p, i) / mx * gh; i ? ctx.lineTo(xi(i), yy) : ctx.moveTo(xi(i), yy); } ctx.stroke(); });
    // demo marker
    const ma = tm(f, f.markAt, 2.2), ms = pop(t, ma, .4); if (ms > 0){ const sx = xi(spike); ctx.save(); ctx.strokeStyle = YEL; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(sx, gy - 10); ctx.lineTo(sx, gy + gh); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(sx - 20, gy + 60); ctx.scale(ms, ms); ctx.rotate(-.04); P(ctx, -300, -44, 300, 88, 18, YEL, 5, OUT); T(ctx, "DEMO SISTEM BARU", -150, 12, 30, { align: "center", col: BROWN }); ctx.restore(); }
    // legend
    const la = tm(f, f.legendAt, 3.2); TEAM.forEach(([nm, col], i) => { const s = pop(t, la + i * .12, .3); if (s <= 0) return; ctx.save(); ctx.translate(1640, 330 + i * 86); ctx.scale(s, s); P(ctx, -90, -30, 180, 60, 30, col, 4, OUT); T(ctx, nm, 0, 11, 28, { align: "center", col: "#FFF" }); ctx.restore(); });
    if (f.hlAt != null && t > tm(f, f.hlAt)){ const s = pop(t, tm(f, f.hlAt), .35); ctx.save(); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 6; ctx.globalAlpha = Math.min(1, s); rr(ctx, 1530, 284, 220, 6 * 86 + 6, 24); ctx.stroke(); ctx.restore();
      chipAt(ctx, 1640, 900, s, "SEMUA KENA", RED, "#FFF", 40, .04); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.drawAt, .3)), "rise", .5, f.drawDur || 3); add(g(tm(f, f.markAt, 2.2)), "stamp", .7); if (f.hlAt != null) add(g(tm(f, f.hlAt)), "ping", .7); } };

  // --- night phone: Bu Ratna's message, Rina types an angry reply, thumb hovers over Send, deletes it letter by letter ---
  FX.phoneDraft = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, z = (f.scale || 1.08) * (1 + q * .012); let shake = 0; const mA = tm(f, f.msgAt, .3);
    if (t > mA && t < mA + .7) shake = Math.sin(t * 70) * 6 * (1 - (t - mA) / .7);
    ctx.save(); ctx.translate(shake, 0); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ night: true, skin: "#D9A07A" }, f), z);
    ctx.fillStyle = "#EDE5DA"; ctx.fillRect(x, y, w, h); S.chatHeader(ctx, x, y, w, "Bu Ratna", "online", MAROON, "R", null, t);
    const s = pop(t, mA, .35); if (s > 0){ ctx.save(); ctx.globalAlpha = Math.min(1, s); S.bubbleMsg(ctx, x + 22, y + 150, w - 80, f.msg || "Rin, laporan besok jam berapa?", { time: f.time || "23.40", size: 27 }); ctx.restore(); }
    const tA = tm(f, f.typeAt, 1.2), hA = tm(f, f.holdAt), dA = tm(f, f.delAt), draft = f.draft || "Bu, ini sudah jam sebelas malam. Saya juga punya kehidupan.";
    let txt = ""; if (t > tA){ txt = typed(draft, t, tA, f.cps || 20); if (dA != null && t > dA) txt = draft.slice(0, Math.max(0, draft.length - Math.floor((t - dA) * (f.delCps || 16)))); }
    font(ctx, 600, 26, F2); const L = txt ? S.wrap(ctx, txt + (Math.sin(t * 8) > 0 ? "|" : " "), w - 170) : ["Ketik pesan…"], ih = Math.max(48, L.length * 34 + 16);
    ctx.fillStyle = "#F3F4F6"; ctx.fillRect(x, y + h - ih - 34, w, ih + 34); P(ctx, x + 16, y + h - ih - 18, w - 110, ih, 24, "#FFFFFF", 2, txt ? ORANGE : "#D1D5DB");
    L.forEach((l, i) => T(ctx, l, x + 38, y + h - ih + 14 + i * 34, 26, { col: txt ? "#111827" : "#9CA3AF", w: 600, fam: F2 }));
    const bx = x + w - 50, by = y + h - 42, hot = hA != null && t > hA && (dA == null || t < dA); ctx.fillStyle = txt ? (hot ? RED : GREEN) : "#9CA3AF"; ctx.beginPath(); ctx.arc(bx, by, 30 + (hot ? 3 * Math.sin(t * 10) : 0), 0, TAU); ctx.fill(); T(ctx, "➤", bx + 2, by + 11, 30, { align: "center", col: "#FFF" });
    ctx.restore();
    // thumb hovering over send
    if (hA != null){ const a = clamp((t - hA + .4) / .5, 0, 1) * (dA != null ? 1 - clamp((t - dA) / .5, 0, 1) : 1); if (a > 0){ const tr = Math.sin(t * 31) * 3; ctx.translate(lerp(160, 0, easeIO(a)) + tr, lerp(260, 0, easeIO(a)));
        ctx.fillStyle = f.skin || "#D9A07A"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; rr(ctx, bx + 2, by + 18, 96, 300, 48); ctx.fill(); ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.35)"; rr(ctx, bx + 18, by + 30, 50, 44, 18); ctx.fill(); } }
    ctx.restore();
    if (hA != null && t > hA && (dA == null || t < dA)) chipAt(ctx, 1500, 260, pop(t, hA + .2, .4), "KIRIM?", RED, "#FFF", 54, .05);
    if (dA != null && t > dA + .6) chipAt(ctx, 1500, 260, pop(t, dA + .6, .4), "HAPUS…", "#5E5A62", "#FFF", 50, -.04); },
    sfx(f, g, add){ add(g(tm(f, f.msgAt, .3)), "buzz", .8, .9); const tA = tm(f, f.typeAt, 1.2), dr = f.draft || "Bu, ini sudah jam sebelas malam. Saya juga punya kehidupan."; add(g(tA), "typing", .5, dr.length / (f.cps || 20));
      if (f.holdAt != null) add(g(tm(f, f.holdAt)), "tick", .4, 1.5); if (f.delAt != null) add(g(tm(f, f.delAt)), "typing", .35, Math.min(4, dr.length / (f.delCps || 16))); } };

  // --- phone alarm "16.00 LAPORAN": set (toggle on), optional ring ---
  FX.alarm = { layer: "screen", draw(ctx, f, t){ const q = t - f.at, rA = tm(f, f.ringAt), ring = rA != null && t > rA, z = (f.scale || 1.06) * (1 + q * .015);
    ctx.save(); if (ring) ctx.translate(Math.sin(t * 60) * 5, 0); const [x, y, w, h] = S.phoneShell(ctx, t, Object.assign({ skin: "#D9A07A", bgCols: [[0, "#E7B07A"], [1, "#B47A48"]] }, f), z);
    ctx.fillStyle = ring ? lg(ctx, 0, y, 0, y + h, [[0, "#F6C98C"], [1, "#C2691F"]]) : "#16131C"; ctx.fillRect(x, y, w, h);
    if (!ring){ T(ctx, "Alarm", x + 30, y + 80, 40, { col: "#FFF" }); const on = clamp((t - tm(f, f.onAt, .8)) / .3, 0, 1);
      [["06.00", "Bangun", false], [f.time || "16.00", f.label || "LAPORAN 3 BARIS", true], ["21.00", "Siapkan baju", false]].forEach(([hh, lb, main], i) => { const ry = y + 130 + i * 190, s = main ? pop(t, f.at + .3, .4) : 1; ctx.save(); ctx.translate(x + w / 2, ry + 80); ctx.scale(main ? Math.min(1.08, s) : 1, main ? Math.min(1.08, s) : 1);
        P(ctx, -w / 2 + 20, -80, w - 40, 160, 26, main ? "#2A2433" : "#201C28", main ? 4 : 0, ORANGE); T(ctx, hh, -w / 2 + 50, 14, 68, { col: main && on > .5 ? "#FFF" : "#6B7280" }); T(ctx, lb, -w / 2 + 52, 56, 22, { col: main ? YEL : "#6B7280", w: 700, maxW: 260 });
        const k = main ? on : 0; P(ctx, w / 2 - 130, -24, 90, 48, 24, k > .5 ? GREEN : "#3F3A48", 0); ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.arc(w / 2 - 106 + 42 * k, 0, 19, 0, TAU); ctx.fill();
        ctx.restore(); }); }
    else { T(ctx, f.time || "16.00", 0, y + 260, 120, { align: "center", col: "#FFF" }); T(ctx, f.label || "LAPORAN 3 BARIS", 0, y + 330, 34, { align: "center", col: "#FFF6EA" });
      ctx.save(); ctx.translate(0, y + 520); ctx.rotate(Math.sin(t * 30) * .25); ctx.fillStyle = "#FFF"; ctx.beginPath(); ctx.moveTo(-70, 40); ctx.quadraticCurveTo(-70, -80, 0, -80); ctx.quadraticCurveTo(70, -80, 70, 40); ctx.lineTo(86, 56); ctx.lineTo(-86, 56); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 72, 18, 0, TAU); ctx.fill(); ctx.restore();
      for (let k = 0; k < 3; k++){ const r = ((t - rA) * 1.4 + k / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${1 - r})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, y + 520, 120 + r * 160, 0, TAU); ctx.stroke(); }
      P(ctx, -170, y + h - 170, 340, 90, 45, "rgba(255,255,255,.25)", 0); T(ctx, "Kirim laporan ➤", 0, y + h - 112, 30, { align: "center", col: "#FFF" }); }
    ctx.restore(); ctx.restore();
    const s = pop(t, f.at + .5, .4); chipAt(ctx, 1490, 250, s, ring ? "SEBELUM DITANYA" : "SETIAP HARI", ring ? GREEN : NAVY, ring ? "#FFF" : YEL, 46, .05); },
    sfx(f, g, add){ add(g(tm(f, f.onAt, .8)), "click", .8); if (f.ringAt != null) add(g(tm(f, f.ringAt)), "ring", .7, 2); } };

  // --- night messages from Bu Ratna over four days: 5 → 3 → 1 → 0 ---
  FX.nightCount = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#1B2440"], [1, "#2E2346"]]));
    for (let i = 0; i < 50; i++){ ctx.globalAlpha = .25 + .6 * Math.abs(Math.sin(t * (1 + rnd(i)) + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(rnd(i + 3) * SW, rnd(i + 40) * 500, 2, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
    const z = 1 + q * .012; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    T(ctx, f.title || "Pesan malam dari Bu Ratna", 960, 130, 52, { align: "center", col: "#FFF" });
    const days = f.days || [["HARI 1", 5], ["HARI 2", 3], ["HARI 3", 1], ["HARI 4", 0]], times = f.times || [.3, 1.3, 2.3, 3.3];
    days.forEach(([lab, n], i) => { const cx = 330 + i * 420, tt = tm(f, times[i]), s = pop(t, tt, .4); ctx.save(); ctx.translate(cx, 0);
      P(ctx, -170, 200, 340, 700, 30, i === 3 && s > 0 ? "rgba(59,163,107,.18)" : "rgba(255,255,255,.06)", 4, i === 3 && s > 0 ? GREEN : "rgba(255,255,255,.18)"); moon(ctx, 0, 270, 38, s > 0 ? "#FFE9B0" : "#5A5470");
      T(ctx, lab, 0, 360, 32, { align: "center", col: s > 0 ? "#FFF" : "#7A7490", track: 2 });
      for (let k = 0; k < n; k++){ const bs = pop(t, tt + .1 + k * .12, .25); if (bs <= 0) continue; ctx.save(); ctx.translate(0, 830 - k * 74); ctx.scale(bs, bs); P(ctx, -120, -30, 240, 60, 20, "#FFFFFF", 0); S.avatar(ctx, -88, 0, 20, MAROON, "R"); ctx.fillStyle = "#D1D5DB"; ctx.fillRect(-56, -8, 130 - (k % 2) * 30, 14); ctx.restore(); }
      if (s > 0){ ctx.save(); ctx.translate(0, n ? 500 : 620); ctx.scale(s, s); T(ctx, String(n), 0, 0, 130, { align: "center", col: n ? (n > 2 ? RED : YEL) : GREEN, stroke: "#13223D", sw: 12 }); ctx.restore(); }
      if (n === 0 && s > 0){ chipAt(ctx, 0, 800, pop(t, tt + .4, .4), "TENANG", GREEN, "#FFF", 40, -.04); for (let k = 0; k < 5; k++){ const a = t * 1.3 + k * TAU / 5; ctx.fillStyle = k % 2 ? YEL : "#FFF"; ctx.save(); ctx.translate(Math.cos(a) * 120, 560 + Math.sin(a) * 70); TT.star(ctx, 0, 0, 10 + 4 * Math.sin(t * 5 + k)); ctx.restore(); } }
      ctx.restore(); });
    for (let i = 0; i < 3; i++){ const s = clamp((t - tm(f, times[i + 1]) + .3) / .3, 0, 1); if (s <= 0) continue; ctx.save(); ctx.globalAlpha = s; T(ctx, "→", 330 + i * 420 + 210, 560, 60, { align: "center", col: "rgba(255,246,234,.7)" }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ const d = f.days || [[0, 5], [0, 3], [0, 1], [0, 0]]; (f.times || [.3, 1.3, 2.3, 3.3]).forEach((v, i) => { add(g(tm(f, v)), d[i][1] ? "pop" : "chime", .7); }); } };

  // --- whiteboard close-up with handwritten lines (lines [{text, at, col, size, x, y}]) ---
  FX.boardWrite = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#D2B794"], [1, "#B8946C"]])); const z = 1 + q * (f.push ?? .015);
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.rotate(-.012); ctx.translate(-960, -540);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 16; P(ctx, 160, 80, 1600, 920, 20, "#9AA3AE", 0); ctx.restore(); P(ctx, 160, 80, 1600, 920, 20, "#9AA3AE", 6, OUT); P(ctx, 190, 110, 1540, 860, 10, "#FBFCFB", 0);
    if (f.title) T(ctx, f.title, 260, 210, 44, { col: "#6B7280", fam: F2, w: 800 });
    let front = null; (f.lines || []).forEach((L, i) => { const t0 = tm(f, L.at, .3 + i), dur = L.dur || .9, k = clamp((t - t0) / dur, 0, 1); if (k <= 0) return; const lx = L.x ?? 260, ly = L.y ?? 330 + i * 150, sz = L.size || 70;
      font(ctx, 800, sz, F2); const wv = ctx.measureText(L.text).width; ctx.save(); ctx.beginPath(); ctx.rect(lx - 10, ly - sz, (wv + 30) * k, sz * 1.5); ctx.clip(); T(ctx, L.text, lx, ly, sz, { col: L.col || "#1F4E8C", fam: F2, w: 800 }); ctx.restore();
      if (L.box && k >= 1){ const bq = clamp((t - t0 - dur) / .5, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); const n = 50; for (let j = 0; j <= n * bq; j++){ const a = -2.3 + j / n * TAU * 1.05; ctx.lineTo(lx + wv / 2 + Math.cos(a) * (wv / 2 + 40), ly - sz * .3 + Math.sin(a) * sz * .9); } ctx.stroke(); }
      if (k < 1) front = [lx + wv * k, ly - sz * .3]; });
    if (front){ ctx.save(); ctx.translate(front[0] + 10, front[1] + Math.sin(t * 18) * 10); ctx.rotate(-.6); P(ctx, -12, -90, 24, 110, 8, f.marker || "#1F4E8C", 4); P(ctx, -12, -90, 24, 30, 6, "#FFF", 0); ctx.fillStyle = f.skin || "#E2A77C"; ctx.strokeStyle = OUT; ctx.lineWidth = 5; rr(ctx, -50, -10, 100, 90, 30); ctx.fill(); ctx.stroke(); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ (f.lines || []).forEach((L, i) => add(g(tm(f, L.at, .3 + i)), "scribble", .6, L.dur || .9)); } };

  // --- the team rule taped to the door (+ Sinta's 3rd line, + Bayu's cat sticker question) ---
  FX.rulePoster = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#E8C69E"], [1, "#C99A6C"]]));
    const z = 1 + q * .015; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    P(ctx, 420, -40, 1080, 1200, 10, "#A9643B", 8); for (let k = 0; k < 3; k++){ ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 5; ctx.strokeRect(480, 20 + k * 360, 960, 320); }
    ctx.fillStyle = "#E8C07A"; ctx.beginPath(); ctx.arc(1440, 600, 26, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); P(ctx, 640, 60, 640, 70, 8, "#FFFDF8", 4); T(ctx, "RUANG TIM LAYANAN", 960, 108, 32, { align: "center", col: BROWN, track: 3 });
    const sA = tm(f, f.slapAt, .2), s = q < 0 ? 0 : (t < sA ? 0 : 1 + .3 * (1 - eOut(clamp((t - sA) / .3, 0, 1)))); if (s > 0){ ctx.save(); ctx.translate(960, 560); ctx.scale(s, s); ctx.rotate(-.025 + Math.sin(t * .8) * .006);
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; P(ctx, -400, -360, 800, 760, 6, "#FFFDF8", 0); ctx.restore();
      [[-330, -360], [330, -360]].forEach(([tx, ty], i) => { ctx.save(); ctx.translate(tx, ty); ctx.rotate(i ? .5 : -.5); ctx.fillStyle = "rgba(246,195,67,.75)"; ctx.fillRect(-60, -18, 120, 36); ctx.restore(); });
      P(ctx, -400, -360, 800, 120, [6, 6, 0, 0], ORANGE, 0); T(ctx, "GRUP KERJA", 0, -284, 58, { align: "center", col: "#FFF", track: 6 });
      T(ctx, "08.00 – 20.00", 0, -130, 104, { align: "center", col: NAVY }); ctx.fillStyle = "#E5E7EB"; ctx.fillRect(-340, -90, 680, 4);
      T(ctx, "Di luar jam itu, hanya:", 0, -20, 40, { align: "center", col: "#374151", w: 600, fam: F2 }); P(ctx, -190, 10, 380, 86, 16, RED, 5, OUT); T(ctx, "[DARURAT]", 0, 70, 52, { align: "center", col: "#FFF" });
      const l3 = tm(f, f.line3At); if (l3 != null){ const k = clamp((t - l3) / 1, 0, 1); if (k > 0){ ctx.save(); ctx.beginPath(); ctx.rect(-360, 130, 720 * k, 200); ctx.clip(); T(ctx, "+ tulis: butuh apa", 0, 190, 46, { align: "center", col: GREEN, fam: F2, w: 800 }); T(ctx, "& kapan", 0, 250, 46, { align: "center", col: GREEN, fam: F2, w: 800 }); ctx.restore(); T(ctx, "— usul Sinta", 300, 330, 24, { align: "right", col: TEAL, fam: F2, w: 700 }); } }
      ctx.restore(); }
    const cA = tm(f, f.catAt); if (cA != null && t > cA){ const cs = pop(t, cA, .4); ctx.save(); ctx.translate(1340, 860); ctx.scale(cs, cs); ctx.rotate(.1); P(ctx, -110, -110, 220, 220, 30, "#FFFFFF", 5); S.catSticker(ctx, 0, 20, 1.3, t, 1); T(ctx, "?", 90, -60, 80, { align: "center", col: RED, stroke: "#FFF", sw: 10 }); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(tm(f, f.slapAt, .2)), "stamp", .8); if (f.line3At != null) add(g(tm(f, f.line3At)), "scribble", .6, 1); if (f.catAt != null) add(g(tm(f, f.catAt)), "boing", .7); } };

  // --- Rina sleeping soundly; the phone on the nightstand stays dark ---
  FX.sleepBed = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#2A2346"], [1, "#1A1530"]]));
    const z = 1 + q * .018; ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
    // window with moon + curtain
    P(ctx, 160, 90, 420, 360, 14, "#141A33", 8, "#4A3E5E"); moon(ctx, 420, 210, 54); for (let i = 0; i < 12; i++){ ctx.globalAlpha = .3 + .6 * Math.abs(Math.sin(t * 1.3 + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(190 + rnd(i) * 360, 120 + rnd(i + 9) * 300, 2, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,233,176,.08)"; ctx.beginPath(); ctx.moveTo(160, 450); ctx.lineTo(580, 450); ctx.lineTo(1100, 1080); ctx.lineTo(400, 1080); ctx.fill();
    ctx.fillStyle = "#8E4A2A"; ctx.beginPath(); ctx.moveTo(130, 70); ctx.lineTo(230, 70); ctx.quadraticCurveTo(210 + Math.sin(t * .7) * 8, 280, 240, 480); ctx.lineTo(120, 480); ctx.fill();
    // bed
    P(ctx, 330, 600, 1180, 300, 26, "#5A3A2A", 6); P(ctx, 300, 470, 70, 460, 20, "#6B4129", 6); P(ctx, 360, 560, 1120, 120, 30, "#E9DCC6", 5);
    P(ctx, 400, 520, 270, 120, 50, "#FFF6EA", 5);   // pillow
    // Rina lying (toon rotated: head to the left on the pillow)
    const look = S.cast.rina.look || S.cast.rina, a = Object.assign({ size: 560, x: 0, y: 0, face: 1, seed: 4 }, look, { keys: [{ at: 0, pose: "sit", expr: f.expr || "proud" }] });
    const st = TT.toonState(a, null, q); st.talk = false; ctx.save(); ctx.translate(1100, 610 + Math.sin(t * 1.6) * 2); ctx.rotate(-Math.PI / 2 + .04); TT.drawToon(ctx, a, st, q); ctx.restore();
    // blanket with breathing
    const br = Math.sin(t * 1.6) * 6; ctx.fillStyle = "#5B7DB1"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(800, 720); ctx.quadraticCurveTo(810, 470 - br, 960, 440 - br); ctx.quadraticCurveTo(1250, 450 - br * .6, 1460, 560); ctx.lineTo(1480, 720); ctx.quadraticCurveTo(1100, 770, 800, 720); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.moveTo(800, 720); ctx.quadraticCurveTo(810, 470 - br, 960, 440 - br); ctx.lineTo(990, 470 - br); ctx.quadraticCurveTo(850, 500 - br, 850, 724); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 4; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(920 + k * 110, 500 - br * .5); ctx.quadraticCurveTo(960 + k * 110, 620, 930 + k * 110, 730); ctx.stroke(); }
    // nightstand + phone (dark) + clock
    P(ctx, 1560, 640, 260, 260, 14, "#7A4A2B", 6); P(ctx, 1540, 620, 300, 34, 10, "#9A5A34", 6); ctx.save(); ctx.translate(1640, 612); ctx.rotate(-.06); P(ctx, -70, -16, 140, 26, 8, "#1E1A18", 3); ctx.restore();
    P(ctx, 1720, 540, 100, 80, 10, "#26252B", 4); T(ctx, f.clock || "23.00", 1770, 592, 30, { align: "center", col: "#7FD39B", w: 700 });
    // Zzz
    for (let k = 0; k < 3; k++){ const u = (t * .45 + k / 3) % 1; ctx.globalAlpha = Math.sin(u * Math.PI); T(ctx, "z", 640 + u * 160 + k * 10, 440 - u * 260, 40 + u * 50, { col: "#FFF6EA" }); } ctx.globalAlpha = 1;
    ctx.restore();
    if (f.chip !== false) chipAt(ctx, 1500, 200, pop(t, f.at + (f.chipAt ?? .8), .4), f.chip || "0 PESAN MALAM", GREEN, "#FFF", 44, .04); },
    sfx(f, g, add){ } };

  // --- top-down desk: Bu Ratna's hand puts down the "KLIEN PRIORITAS" folder (+ her sticky note) ---
  FX.folderDesk = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, SW, SH, [[0, "#C47A48"], [1, "#9A5A34"]])); ctx.strokeStyle = "rgba(59,36,24,.13)"; ctx.lineWidth = 4; for (let k = 0; k < 14; k++){ ctx.beginPath(); ctx.moveTo(0, 60 + k * 80 + Math.sin(k) * 10); ctx.bezierCurveTo(600, 40 + k * 80, 1300, 90 + k * 80, SW, 60 + k * 80); ctx.stroke(); }
    const z = 1 + q * .015; ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    // keyboard + mug
    P(ctx, 160, 760, 620, 220, 20, "#3B3A40", 6); for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++){ P(ctx, 186 + c * 54, 786 + r * 46, 44, 36, 6, "#55545C", 0); }
    ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.arc(1660, 260, 90, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = "#5A321C"; ctx.beginPath(); ctx.arc(1660, 260, 66, 0, TAU); ctx.fill();
    for (let k = 0; k < 3; k++){ const u = (t * .5 + k / 3) % 1; ctx.globalAlpha = .5 * Math.sin(u * Math.PI); ctx.strokeStyle = "#FFF"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(1640 + k * 20, 240 - u * 100); ctx.quadraticCurveTo(1620 + k * 20, 200 - u * 100, 1650 + k * 20, 170 - u * 100); ctx.stroke(); } ctx.globalAlpha = 1;
    const dA = tm(f, f.dropAt, .4), k = easeIO(clamp((t - dA + .8) / .8, 0, 1)), fx = lerp(1900, 1000, k), fy = lerp(-300, 470, k), rot = lerp(.4, -.06, k);
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(rot); ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30 * (1.4 - k * .4); ctx.shadowOffsetY = 16 + (1 - k) * 40; P(ctx, -360, -250, 720, 500, 14, "#E8A55B", 0); ctx.restore();
    P(ctx, -360, -250, 720, 500, 14, "#E8A55B", 6, OUT); P(ctx, -360, -300, 260, 70, [14, 14, 0, 0], "#E8A55B", 6, OUT); P(ctx, -357, -250, 254, 20, 0, "#E8A55B", 0);
    ctx.fillStyle = "#FFFDF8"; ctx.fillRect(-330, -230, 660, 30); P(ctx, -250, -120, 500, 130, 10, "#FFFDF8", 5); T(ctx, "KLIEN", 0, -66, 50, { align: "center", col: RED, track: 6 }); T(ctx, "PRIORITAS", 0, -12, 50, { align: "center", col: RED, track: 6 });
    ["Toko Makmur", "Apotek Sehat", "Mart 8 (4 cabang)"].forEach((l, i) => T(ctx, `${i + 1}. ${l}`, -230, 90 + i * 52, 34, { col: BROWN, fam: F2, w: 700 }));
    const ns = pop(t, dA + (f.noteAt ?? .9), .35); if (ns > 0){ ctx.save(); ctx.translate(250, 120); ctx.scale(ns, ns); ctx.rotate(.08); P(ctx, -120, -100, 240, 200, 4, YEL, 0); T(ctx, "Kabari saya,", 0, -30, 30, { align: "center", col: "#1F4E8C", fam: F2, w: 800 }); T(ctx, "ya. :)", 0, 14, 30, { align: "center", col: "#1F4E8C", fam: F2, w: 800 }); T(ctx, "— R", 70, 70, 26, { align: "center", col: MAROON, fam: F2, w: 800 }); ctx.restore(); }
    ctx.restore();
    // hand + sleeve sliding away after the drop
    const hk = clamp((t - dA - .25) / .8, 0, 1), hx = fx + 300 + eIn(hk) * 900, hy = fy - 120 - eIn(hk) * 500; if (hk < 1){ ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.7); P(ctx, 40, -60, 600, 140, 40, "#3B4A6B", 6); ctx.fillStyle = "#C98B62"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, -110, -56, 170, 120, 50); ctx.fill(); ctx.stroke(); ctx.restore(); }
    ctx.restore(); },
    sfx(f, g, add){ const d = tm(f, f.dropAt, .4); add(g(d - .7), "whoosh", .5); add(g(d), "thud", .7); add(g(d + (f.noteAt ?? .9)), "pop", .5); } };

  // --- performance review envelope opened in the toilet stall: "CUKUP" ---
  FX.envelope = { layer: "screen", draw(ctx, f, t){ const q = t - f.at; fillAll(ctx, lg(ctx, 0, 0, 0, SH, [[0, "#B7A48C"], [1, "#8F7E68"]])); ctx.fillStyle = "rgba(0,0,0,.08)"; for (let k = 0; k < 8; k++) ctx.fillRect(k * 260, 0, 6, SH);
    const fl = Math.sin(t * 23) > .95 ? .18 : 0; const z = 1 + q * .02; ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.rotate(-.02 + Math.sin(t * .9) * .01);
    const oA = tm(f, f.openAt, .4), sA = tm(f, f.stampAt, 2), op = easeIO(clamp((t - oA) / .5, 0, 1)), sl = easeIO(clamp((t - oA - .4) / .9, 0, 1));
    // paper (behind the front of the envelope while sliding)
    ctx.save(); ctx.translate(0, 60 - sl * 330); P(ctx, -400, -260, 800, 920, 8, "#FFFFFF", 5); ctx.fillStyle = NAVY; ctx.fillRect(-400, -260, 800, 90); S.drawLogo(ctx, -340, -215, 54); T(ctx, "PENILAIAN KINERJA TAHUNAN", 30, -200, 34, { align: "center", col: "#FFF" });
    [["Nama", "Rina"], ["Jabatan", "Staf Layanan Pelanggan"], ["Periode", "Januari – Desember"]].forEach(([k0, v], i) => { T(ctx, k0, -350, -100 + i * 56, 28, { col: "#6B7280", w: 600 }); T(ctx, ": " + v, -170, -100 + i * 56, 30, { col: "#111827", fam: F2, w: 700 }); });
    T(ctx, "Nilai akhir", -350, 110, 30, { col: "#6B7280" }); ["ISTIMEWA", "BAIK", "CUKUP", "KURANG"].forEach((l, i) => { const bx = -350 + i * 180, on = i === 2 && t > sA; P(ctx, bx, 140, 160, 70, 12, on ? "#FDE2DF" : "#F3F4F6", 3, on ? RED : "#D1D5DB"); T(ctx, l, bx + 80, 186, 24, { align: "center", col: on ? RED : "#9CA3AF" }); });
    if (t > sA){ const k = clamp((t - sA) / .5, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); const n = 40; for (let j = 0; j <= n * k; j++){ const a = -2.2 + j / n * TAU * 1.06; ctx.lineTo(10 + Math.cos(a) * 110, 175 + Math.sin(a) * 62); } ctx.stroke(); }
    ctx.restore();
    // envelope front + flap
    ctx.save(); ctx.translate(0, 300); ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; P(ctx, -460, -40, 920, 420, 14, "#E9D2AE", 0); ctx.restore(); P(ctx, -460, -40, 920, 420, 14, "#E9D2AE", 6, OUT);
    ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-460, 380); ctx.lineTo(0, 140); ctx.lineTo(460, 380); ctx.stroke(); P(ctx, -200, 170, 400, 80, 10, "#FFFDF8", 3); T(ctx, "RAHASIA · RINA", 0, 222, 32, { align: "center", col: MAROON, track: 3 });
    ctx.save(); ctx.translate(0, -40); ctx.scale(1, 1 - 2 * op); ctx.fillStyle = op > .5 ? "#D8BE96" : "#E3C9A2"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-460, 0); ctx.lineTo(0, 230); ctx.lineTo(460, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    // hands
    [-1, 1].forEach(d => { ctx.fillStyle = "#B5774F"; ctx.strokeStyle = OUT; ctx.lineWidth = 6; rr(ctx, d * 470 - 70, 120, 140, 200, 60); ctx.fill(); ctx.stroke(); P(ctx, d * 520 - 110, 260, 220, 260, 60, "#5B7DB1", 6); }); ctx.restore();
    ctx.restore(); if (fl) { ctx.fillStyle = `rgba(10,20,24,${fl})`; ctx.fillRect(0, 0, SW, SH); }
    if (t > sA) chipAt(ctx, 1560, 220, pop(t, sA + .4, .4), "CUKUP?", RED, "#FFF", 64, .06); },
    sfx(f, g, add){ add(g(tm(f, f.openAt, .4)), "whoosh", .5); add(g(tm(f, f.stampAt, 2)), "dun", .9); } };

  /* ============================== TAMBAHAN KECIL ============================== */
  PROP.hand_bowl = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.fillStyle = "#FFF6EA"; ctx.strokeStyle = OUT; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(-9, -6); ctx.quadraticCurveTo(0, 6, 9, -6); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#F6C343"; ctx.fillRect(-8, -7.5, 16, 2); ctx.strokeStyle = "#7A4A2B"; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(2, -7); ctx.lineTo(9, -17); ctx.moveTo(4, -7); ctx.lineTo(11, -16); ctx.stroke();
    for (let i = 0; i < 2; i++){ const q = (t * .7 + i / 2) % 1; ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFF"; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-3 + i * 4, -9 - q * 8); ctx.quadraticCurveTo(-5 + i * 4, -12 - q * 8, -2 + i * 4, -15 - q * 8); ctx.stroke(); } ctx.restore(); };
  PROP.hand_glasses = (ctx, x, y, k, f, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(k * f, k); ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = .9; [-3.5, 3.5].forEach(d => { ctx.beginPath(); ctx.arc(d, -3, 3, 0, TAU); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(-.5, -3); ctx.lineTo(.5, -3); ctx.stroke(); ctx.restore(); };

  // cat sticker popping at a screen point (Bayu's question)
  FX.catPop = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .4), out = f.out ?? 1e9; if (s <= 0 || t > out + .3) return; ctx.save(); ctx.globalAlpha = 1 - fin(t, out, .3); ctx.translate(f.x ?? 1500, f.y ?? 300); ctx.scale(s, s); ctx.rotate(.08 + Math.sin(t * 2) * .04);
    P(ctx, -120, -120, 240, 240, 34, "#FFFFFF", 6); S.catSticker(ctx, 0, 24, 1.45, t, 2); if (f.q !== false) T(ctx, "?", 100, -70, 90, { align: "center", col: RED, stroke: "#FFF", sw: 12 }); ctx.restore(); },
    sfx(f, g, add){ add(g(f.at), "boing", .7); } };

  // chip that gets crossed out and fades ("BU RADAR")
  FX.strikeChip = { layer: "screen", draw(ctx, f, t){ const s = pop(t, f.at, .4); if (s <= 0) return; const st = tm(f, f.strikeAt, 1), fo = f.fadeAt != null ? 1 - fin(t, tm(f, f.fadeAt), 1.2) : 1; if (fo <= 0) return;
    ctx.save(); ctx.globalAlpha = fo; ctx.translate(f.x ?? 1400, f.y ?? 240); ctx.scale(s, s); ctx.rotate(f.rot ?? -.04); font(ctx, 800, f.size || 64, F); const w = ctx.measureText(f.text).width + 90;
    P(ctx, -w / 2, -60, w, 120, 26, f.bg || MAROON, 6, OUT); T(ctx, f.text, 0, (f.size || 64) * .36, f.size || 64, { align: "center", col: "#FFF" });
    const k = clamp((t - st) / .5, 0, 1); if (k > 0){ ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-w / 2 - 10, 10); ctx.lineTo(-w / 2 - 10 + (w + 20) * k, -14); ctx.stroke(); }
    ctx.restore(); },
    sfx(f, g, add){ add(g(f.at), "pop", .6); add(g(tm(f, f.strikeAt, 1)), "scribble", .7, .5); } };

  /* ============================== SLIDE RAPAT: aturan grup ============================== */
  const basePaint = FX.slide.paint;
  FX.slide.paint = (ctx, x, y, w, h, t, o) => {
    if (o.slide === "aturan"){ ctx.save(); rr(ctx, x + 6, y + 6, w - 12, h - 12, 4); ctx.clip(); ctx.fillStyle = "#FFFDF7"; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = NAVY; ctx.fillRect(x, y, w, 90); T(ctx, "USUL: ATURAN GRUP KERJA", x + w / 2, y + 60, 34, { align: "center", col: "#FFF", maxW: w - 40 });
      const s1 = o.aturan1 != null ? pop(t, o.aturan1, .4) : 1; if (s1 > 0){ ctx.save(); ctx.translate(x + w / 2, y + 190); ctx.scale(s1, s1); T(ctx, "08.00 – 20.00", 0, 0, 78, { align: "center", col: ORANGE }); T(ctx, "grup kerja aktif", 0, 46, 28, { align: "center", col: "#6B7280", w: 600 }); ctx.restore(); }
      const s2 = o.aturan2 != null ? pop(t, o.aturan2, .4) : 1; if (s2 > 0){ ctx.save(); ctx.translate(x + w / 2, y + 330); ctx.scale(s2, s2); P(ctx, -250, -46, 500, 92, 18, RED, 5, OUT); T(ctx, "di luar itu: [DARURAT]", 0, 14, 38, { align: "center", col: "#FFF" }); ctx.restore(); }
      ctx.restore(); return; }
    basePaint(ctx, x, y, w, h, t, o);
  };
})();
