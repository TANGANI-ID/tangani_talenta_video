/* Scene pack set6a: conveyor, traffic, stairs, magnet, rocket, envelope, hourglass.
   Runs after motion-tangani.js in its own <script>. Canvas 1080x1920; visuals kept in y ~560-1330, text in x 90-990. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, sceneDur, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const RED = "#D84315", GREEN = "#3BB273", YEL = "#E8A317", PAPER = "#FFF7EE";
  const dark = th => th.key === "B";

  /* ---------- text helpers (always measured, shrunk or wrapped to fit) ---------- */
  function fitFont(ctx, th, txt, maxW, size, weight, min){ let z = size; font(ctx, weight || 700, z, th.fam); while (z > (min || 16) && ctx.measureText(txt).width > maxW){ z -= 1; font(ctx, weight || 700, z, th.fam); } return z; }
  function wrapL(ctx, txt, maxW){ return wrapRich(ctx, String(txt || ""), "", maxW).map(l => l.map(z => z.w).join(" ")).filter(l => l.length); }
  function fitLines(ctx, th, txt, maxW, size, maxL, weight, min){ let z = size;
    for (;;){ font(ctx, weight || 700, z, th.fam); const L = wrapL(ctx, txt, maxW);
      if ((L.length <= maxL && L.every(l => ctx.measureText(l).width <= maxW)) || z <= (min || 16)) return { z, L: L.slice(0, maxL) }; z -= 1; } }
  function textLines(ctx, th, txt, cx, cy, maxW, size, maxL, color, weight){ const r = fitLines(ctx, th, txt, maxW, size, maxL, weight); const lh = r.z * 1.15;
    ctx.fillStyle = color; ctx.textAlign = "center"; r.L.forEach((l, k) => ctx.fillText(l, cx, cy + r.z * .35 + (k - (r.L.length - 1) / 2) * lh)); ctx.textAlign = "left"; return r; }
  // pill tag (1–2 lines) anchored at cx (center/left/right), vertically centred at cy
  function tag(ctx, th, txt, cx, cy, o){ o = o || {}; const size = o.size || 32, maxW = o.maxW || 800, pad = size * .72, icS = o.icon ? size * 1.05 : 0, inner = maxW - pad * 2 - (icS ? icS + 10 : 0);
    const r = fitLines(ctx, th, txt, inner, size, o.lines || 1, o.weight || 800, o.min || 18), z = r.z, lh = z * 1.18;
    const tw = Math.max(...r.L.map(l => ctx.measureText(l).width), 10), ic = o.icon ? z * 1.05 : 0, w = tw + pad * 2 + (ic ? ic + 10 : 0), h = z * .85 + lh * r.L.length;
    const x0 = o.align === "right" ? cx - w : o.align === "left" ? cx : cx - w / 2;
    rr(ctx, x0, cy - h / 2, w, h, Math.min(h / 2, 30)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); if (o.stroke){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); }
    if (ic) icon(ctx, o.icon, x0 + pad * .75, cy - ic / 2, ic, o.fg || INK, 2.4);
    font(ctx, o.weight || 800, z, th.fam); ctx.fillStyle = o.fg || INK; ctx.textAlign = "left";
    r.L.forEach((l, k) => ctx.fillText(l, x0 + pad + (ic ? ic + 8 : 0), cy + z * .36 + (k - (r.L.length - 1) / 2) * lh));
    return { x0, w, h };
  }
  const popAt = (t, T, d) => t < T ? 0 : eBack(clamp((t - T) / (d || .4), 0, 1));
  function scaled(ctx, x, y, k, fn){ if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }
  function checkDisc(ctx, x, y, r, col){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col || GREEN; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .42, y + r * .02); ctx.lineTo(x - r * .1, y + r * .34); ctx.lineTo(x + r * .45, y - r * .3); ctx.stroke(); }
  function crossDisc(ctx, x, y, r){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - r * .35, y - r * .35); ctx.lineTo(x + r * .35, y + r * .35); ctx.moveTo(x + r * .35, y - r * .35); ctx.lineTo(x - r * .35, y + r * .35); ctx.stroke(); }
  const fmtNum = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  /* =====================================================================
     conveyor: items ride a belt; optional scanner gate rejects some into a bin,
     the rest drop into a crate (with a counter / running total).
     f: headline, highlight, items:[{label, icon, cue, reject, bad, value}], gate, okLabel, okIcon, rejectLabel, counter:{prefix,suffix}
     ===================================================================== */
  const CV = { V: 420, X0: 10, GX: 500, END: 745, CX: 885, gap: .72 };
  function convTimes(s, f, idx){ let prev = -9; return (f.items || []).map((it, i) => { const c = Math.max(at(s, it.cue, .08 + i * .18, idx), prev + CV.gap); prev = c; return c; }); }
  function convState(it, T0, t, gate, BY){
    const dt = t - T0; if (dt < 0) return null; const yb = BY - 81, tg = (CV.GX - CV.X0) / CV.V, te = (CV.END - CV.X0) / CV.V;
    if (it.reject && gate && dt >= tg){ const u = dt - tg; if (u < .3) return { x: CV.GX, y: yb, sc: 1, ph: "scan", u };
      const q = clamp((u - .3) / .5, 0, 1); return { x: CV.GX, y: yb + q * q * 230, sc: 1 - q * .5, ph: q >= 1 ? "bin" : "drop", u, rot: q * .6 }; }
    if (dt < te) return { x: CV.X0 + CV.V * dt, y: yb, sc: 1, ph: "belt", a: clamp(dt / .25, 0, 1) };
    const q = clamp((dt - te) / .45, 0, 1); return { x: CV.END + (CV.CX - CV.END) * q, y: yb - Math.sin(q * Math.PI) * 80 + q * 120, sc: 1 - q * .45, ph: q >= 1 ? "in" : "hop", tin: T0 + te + .45 };
  }
  function itemCard(ctx, th, it, M, i, flag){
    const bad = it.bad || flag === "rej";
    rr(ctx, -85, -70, 170, 140, 22); ctx.fillStyle = bad ? "#FCE4DA" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = bad ? RED : INK; ctx.lineWidth = 5; ctx.stroke();
    const fl = fitLines(ctx, th, it.label || "", 150, 25, 2, 800, 17), two = fl.L.length > 1;
    ctx.beginPath(); ctx.arc(0, two ? -34 : -22, two ? 25 : 30, 0, TAU); ctx.fillStyle = bad ? RED : M.pal[i % 3]; ctx.fill();
    const isz = two ? 30 : 36; icon(ctx, it.icon || "file", -isz / 2, (two ? -34 : -22) - isz / 2, isz, "#fff", 2.4);
    font(ctx, 800, fl.z, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center"; fl.L.forEach((l, k) => ctx.fillText(l, 0, (two ? 18 : 40) + k * fl.z * 1.1 + fl.z * .3)); ctx.textAlign = "left";
    if (it.bad){ ctx.beginPath(); ctx.arc(70, -58, 20, 0, TAU); ctx.fillStyle = RED; ctx.fill(); font(ctx, 900, 30, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("!", 70, -47); ctx.textAlign = "left"; }
  }
  TT.layout("conveyor", "Ban berjalan", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const gate = !!f.gate, BY = (f.headline ? 1010 : 970) + (gate ? 0 : 50), GX = CV.GX, T = convTimes(s, f), sts = its.map((it, i) => convState(it, T[i], t, gate, BY));
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // floor + legs
    ctx.fillStyle = dark(th) ? "rgba(250,248,243,.08)" : hexA(INK, .08); rr(ctx, 90, BY + 150, 900, 14, 7); ctx.fill();
    ctx.fillStyle = "#3B2418"; [150, 330, 650, 720].forEach(x => ctx.fillRect(x - 9, BY + 44, 18, 110));
    // reject bin (back)
    const binY = BY + 120;
    if (gate){ ctx.fillStyle = "#5A4232"; rr(ctx, GX - 105, binY, 210, 130, 18); ctx.fill(); }
    // crate (back)
    ctx.fillStyle = "#8E4E2E"; rr(ctx, CV.CX - 95, BY - 10, 190, 160, 14); ctx.fill();
    // items that are inside bin/crate are counted, others drawn
    let nIn = 0, sum = 0, lastIn = -9, lastBad = -9, nBin = 0, lastBin = -9;
    sts.forEach((st, i) => { if (!st) return; if (st.ph === "in"){ nIn++; sum += +(its[i].value || 0); lastIn = Math.max(lastIn, st.tin); if (its[i].bad) lastBad = Math.max(lastBad, st.tin); } if (st.ph === "bin"){ nBin++; lastBin = Math.max(lastBin, T[i] + (CV.GX - CV.X0) / CV.V + .8); } });
    // items peeking out of the bin
    if (gate){ let k = 0; sts.forEach((st, i) => { if (!st || st.ph !== "bin") return; ctx.save(); ctx.translate(GX - 55 + (k % 3) * 55, binY + 6 - Math.floor(k / 3) * 14); ctx.rotate((k % 2 ? .25 : -.2)); ctx.scale(.42, .42); itemCard(ctx, th, its[i], M, i, "rej"); ctx.restore(); k++; }); }
    // belt
    const bx0 = 90, bx1 = CV.END + 80, off = (t * CV.V) % 46;
    rr(ctx, bx0, BY, bx1 - bx0, 44, 22); ctx.fillStyle = "#544E42"; ctx.fill();
    ctx.save(); rr(ctx, bx0, BY, bx1 - bx0, 44, 22); ctx.clip(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 6; for (let x = bx0 - 46 + off; x < bx1; x += 46){ ctx.beginPath(); ctx.moveTo(x, BY + 4); ctx.lineTo(x - 10, BY + 40); ctx.stroke(); } ctx.restore();
    for (let x = bx0 + 30; x < bx1 - 10; x += 92){ ctx.beginPath(); ctx.arc(x, BY + 22, 15, 0, TAU); ctx.fillStyle = "#8C8476"; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 4; ctx.beginPath(); const a = t * CV.V / 15; ctx.moveTo(x + Math.cos(a) * 12, BY + 22 + Math.sin(a) * 12); ctx.lineTo(x - Math.cos(a) * 12, BY + 22 - Math.sin(a) * 12); ctx.stroke(); }
    // trapdoor at gate opens while something drops
    const dropping = gate && sts.some(st => st && (st.ph === "drop" || (st.ph === "scan" && st.u > .2)));
    if (dropping){ ctx.fillStyle = "#18150f"; ctx.fillRect(GX - 100, BY - 2, 200, 48); }
    // gate arch (back post) and scan beam
    let scanCol = null; sts.forEach((st, i) => { if (st && Math.abs(st.x - GX) < 100 && st.y < BY - 20) scanCol = its[i].reject ? RED : GREEN; });
    if (gate){ ctx.fillStyle = dark(th) ? "#6B5A48" : "#544E42"; ctx.fillRect(GX - 126, BY - 250, 24, 250); ctx.fillRect(GX + 102, BY - 250, 24, 250); rr(ctx, GX - 140, BY - 280, 280, 44, 16); ctx.fill();
      ctx.beginPath(); ctx.arc(GX, BY - 258, 11, 0, TAU); ctx.fillStyle = scanCol ? (Math.sin(t * 20) > 0 ? scanCol : "#fff") : "#B8AE9D"; ctx.fill();
      if (scanCol){ const g = ctx.createLinearGradient(0, BY - 236, 0, BY); g.addColorStop(0, hexA(scanCol, .45)); g.addColorStop(1, hexA(scanCol, .05)); ctx.fillStyle = g; ctx.fillRect(GX - 102, BY - 236, 204, 236);
        const sy = BY - 236 + ((t * 2.2) % 1) * 230; ctx.fillStyle = hexA(scanCol, .8); ctx.fillRect(GX - 102, sy, 204, 6); } }
    // items on belt / flying
    ctx.save(); ctx.beginPath(); ctx.rect(90, 540, 900, 800); ctx.clip();
    sts.forEach((st, i) => { if (!st || st.ph === "in" || st.ph === "bin") return; ctx.save(); ctx.globalAlpha *= st.a != null ? st.a : 1; ctx.translate(st.x, st.y + (st.ph === "belt" ? Math.sin(t * 9 + i) * 1.5 : 0)); ctx.rotate(st.rot || 0); ctx.scale(st.sc * 1.15, st.sc * 1.15);
      itemCard(ctx, th, its[i], M, i, st.ph === "scan" || st.ph === "drop" ? "rej" : null);
      if (st.ph === "scan" || st.ph === "drop") crossDisc(ctx, 0, -96, 28);
      ctx.restore(); });
    ctx.restore();
    // gate front beam + label
    if (gate){ ctx.fillStyle = dark(th) ? "#7A6956" : "#6B6457"; ctx.fillRect(GX - 126, BY - 250, 10, 250); ctx.fillRect(GX + 116, BY - 250, 10, 250);
      tag(ctx, th, f.gate, GX, BY - 325, { bg: INK, fg: PAPER, size: 30, maxW: 420, icon: f.gateIcon }); }
    // bin front + label
    if (gate){ rr(ctx, GX - 112, binY + 40, 224, 100, 16); ctx.fillStyle = "#3B2418"; ctx.fill(); crossDisc(ctx, GX - 60, binY + 90, 24);
      font(ctx, 900, 40, th.fam); ctx.fillStyle = PAPER; ctx.textAlign = "center"; const kb = popAt(t, lastBin, .35); ctx.save(); ctx.translate(GX + 30, binY + 104); ctx.scale(.7 + .3 * (kb || 1), .7 + .3 * (kb || 1)); ctx.fillText(String(nBin), 0, 0); ctx.restore(); ctx.textAlign = "left";
      if (f.rejectLabel) tag(ctx, th, f.rejectLabel, GX, binY + 178, { bg: RED, fg: "#fff", size: 26, maxW: 330 }); }
    // crate front + counter + label
    const flash = t - lastBad < 1.2 && lastBad > 0;
    rr(ctx, CV.CX - 100, BY + 30, 200, 130, 16); ctx.fillStyle = flash && Math.sin(t * 14) > 0 ? RED : "#B5643C"; ctx.fill(); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(CV.CX - 100, BY + 75); ctx.lineTo(CV.CX + 100, BY + 75); ctx.stroke();
    if (!f.counter) icon(ctx, f.okIcon || "check", CV.CX - 82, BY + 48, 40, "#fff", 2.6);
    const kc = popAt(t, lastIn, .35), ctr = f.counter ? `${f.counter.prefix || ""}${fmtNum(sum)}${f.counter.suffix || ""}` : String(nIn);
    ctx.save(); ctx.translate(CV.CX + (f.counter ? 0 : 16), BY + 74); const ks = lastIn > 0 ? .75 + .25 * kc : 1; ctx.scale(ks, ks); const zc = fitFont(ctx, th, ctr, f.counter ? 176 : 110, 38, 900, 18); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(ctr, 0, zc * .36); ctx.textAlign = "left"; ctx.restore();
    if (f.okLabel) tag(ctx, th, f.okLabel, Math.min(CV.CX, 990 - 150), BY + 205, { bg: flash ? RED : th.accent, fg: "#fff", size: 28, maxW: 290 });
    if (flash) emoteAt(ctx, th, "!", CV.CX, BY - 120, t - lastBad, t);
    if (lastIn > 0 && !flash && f.okBurst !== false) burst(ctx, CV.CX, BY - 20, t - lastIn, M, 7);
    ctx.restore();
  }, (s, f, i, add) => { const T = convTimes(s, f, i); (f.items || []).forEach((it, k) => { add(T[k], "pop"); if (it.reject && f.gate) add(T[k] + (CV.GX - CV.X0) / CV.V + .3, "whoosh"); else add(T[k] + (CV.END - CV.X0) / CV.V + .45, it.bad ? "ping" : "pop"); }); });

  /* =====================================================================
     traffic: a traffic light switches red/yellow/green on cue; a car (or a walking
     person from the actor rig) stops at the line on red, slows on yellow, drives on green.
     f: headline, highlight, states:[{cue, light:"red"|"yellow"|"green", label, icon}], start, mover:"car"|"actor", car:{label}, actor:{...}
     ===================================================================== */
  const LCOL = { red: RED, yellow: YEL, green: GREEN }, LIDX = { red: 0, yellow: 1, green: 2 };
  function trafficTimes(s, f, idx){ return (f.states || []).map((x, i) => Object.assign({}, x, { T: at(s, x.cue, .15 + i * .25, idx) })).sort((a, b) => a.T - b.T); }
  TT.layout("traffic", "Lampu lalu lintas", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const tl = trafficTimes(s, f), LX = 880, L0 = f.headline ? 660 : 620, GAP = 128, RY = f.headline ? 1140 : 1110, STOP = 600, actor = f.mover === "actor";
    const lightAt = T => { let l = f.start || null; tl.forEach(x => { if (T >= x.T) l = x.light; }); return l; };
    const cur = lightAt(t), curT = tl.filter(x => t >= x.T).map(x => x.T).pop() ?? -9;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // road
    rr(ctx, 90, RY, 900, 185, 26); ctx.fillStyle = dark(th) ? "#2A2622" : "#5C554B"; ctx.fill();
    ctx.fillStyle = dark(th) ? "#4A4038" : "#CBBBA6"; rr(ctx, 90, RY - 16, 900, 18, 8); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.85)"; for (let k = 0; k < 4; k++) rr(ctx, 650 + k * 34, RY + 22, 20, 145, 6), ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(STOP + 4, RY + 18, 10, 152);
    ctx.fillStyle = "rgba(255,255,255,.4)"; const doff = 0; for (let x = 110 + doff; x < 600; x += 90) ctx.fillRect(x, RY + 90, 50, 6);
    // pole + housing
    ctx.fillStyle = "#3B2418"; ctx.fillRect(LX - 12, L0 + 2 * GAP + 60, 24, RY - (L0 + 2 * GAP + 60)); rr(ctx, LX - 40, RY - 22, 80, 14, 6); ctx.fill();
    rr(ctx, LX - 82, L0 - 72, 164, 2 * GAP + 144, 40); ctx.fillStyle = "#2B2118"; ctx.fill(); ctx.strokeStyle = dark(th) ? "#6B5A48" : INK; ctx.lineWidth = 5; ctx.stroke();
    ["red", "yellow", "green"].forEach((c, k) => { const y = L0 + k * GAP, on = cur === c, pulse = .85 + .15 * Math.sin(t * 6);
      if (on){ const g = ctx.createRadialGradient(LX, y, 20, LX, y, 150); g.addColorStop(0, hexA(LCOL[c], .55 * pulse)); g.addColorStop(1, hexA(LCOL[c], 0)); ctx.fillStyle = g; ctx.fillRect(LX - 150, y - 150, 300, 300); }
      ctx.beginPath(); ctx.arc(LX, y, 48, 0, TAU); ctx.fillStyle = on ? LCOL[c] : hexA(LCOL[c], .22); ctx.fill();
      if (on){ ctx.beginPath(); ctx.arc(LX - 15, y - 15, 13, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill(); const k2 = popAt(t, curT, .3); if (k2 < 1.05 && t - curT < .5){ ctx.strokeStyle = hexA(LCOL[c], 1 - (t - curT) * 2); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(LX, y, 48 + (t - curT) * 120, 0, TAU); ctx.stroke(); } }
      ctx.fillStyle = "#18150f"; ctx.beginPath(); ctx.moveTo(LX - 60, y - 52); ctx.quadraticCurveTo(LX, y - 78, LX + 60, y - 52); ctx.lineTo(LX + 54, y - 40); ctx.quadraticCurveTo(LX, y - 60, LX - 54, y - 40); ctx.closePath(); ctx.fill(); });
    // labels next to the lamps (latest label per colour)
    const lab = {}; tl.forEach(x => { if (t >= x.T && x.label) lab[x.light] = x; });
    Object.keys(lab).forEach(c => { const x = lab[c], y = L0 + LIDX[c] * GAP, on = cur === c, k = popAt(t, x.T, .4);
      scaled(ctx, LX - 110, y, k, () => { ctx.save(); if (!on) ctx.globalAlpha *= .55;
        ctx.strokeStyle = on ? LCOL[c] : hexA(dark(th) ? "#FAF8F3" : INK, .3); ctx.lineWidth = 5; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(LX - 108, y); ctx.lineTo(LX - 88, y); ctx.stroke(); ctx.setLineDash([]);
        tag(ctx, th, x.label, LX - 110, y, { align: "right", bg: on ? LCOL[c] : (dark(th) ? "#2A2622" : "#FFFFFF"), fg: on ? "#fff" : (dark(th) ? "#FAF8F3" : INK), size: on ? 38 : 32, maxW: LX - 110 - 95, icon: x.icon, stroke: on ? null : hexA(INK, .15), lw: 3 });
        ctx.restore(); }); });
    // mover simulation (deterministic, integrated from scene start)
    const HALF = actor ? 30 : 100, vmax = actor ? (f.speed || 170) : 430; let x = actor ? 140 : 210, v = 0; const dt = 1 / 30;
    for (let u = 0; u < t; u += dt){ const l = lightAt(u), halt = l === "red" || (l === "yellow" && f.yellowStop); let tgt = l === "yellow" ? vmax * .4 : vmax; const front = x + HALF;
      if (actor){ if (halt) tgt = 0; if (x > 930) tgt = 0; }
      else if (halt && front <= STOP + 6){ const d = STOP - front; tgt = Math.min(tgt, Math.sqrt(Math.max(0, 2 * 700 * d))); }
      v += clamp(tgt - v, -(actor ? 700 : 1500) * dt, (actor ? 400 : 600) * dt); x += v * dt; if (!actor && x > 1220) x = -160; }
    const RL = RY + 120;
    ctx.save(); ctx.beginPath(); ctx.rect(90, 540, 900, 800); ctx.clip();
    if (actor){ const a = f.actor || { hair: "short", shirt: "#2F6F73", skin: "a" }, st = actorState(a, s, t); st.x = x; st.walking = v > 25; st.face = 1;
      const r = drawActor(ctx, th, a, st, t, RY + 150, a.scale || .56); ctx.restore();
      if (r && st.emote) emoteAt(ctx, th, st.emote, r.headX + 46, r.headTop - 6, t - st.emoteT, t);
      if (r && st.say) bubbleAt(ctx, th, st.say, r.headX, r.headTop - 6, st.chat, t - st.sayT);
    } else {
      const c = f.car || {}, bob = v > 20 ? Math.sin(t * 22) * 1.5 : 0;
      if (v > 120){ ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.35)" : "rgba(255,255,255,.6)"; ctx.lineWidth = 5; ctx.lineCap = "round"; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.moveTo(x - 130 - k * 12, RL - 70 + k * 22); ctx.lineTo(x - 190 - k * 20, RL - 70 + k * 22); ctx.stroke(); } }
      ctx.save(); ctx.translate(x, RL + bob);
      rr(ctx, -70, -112, 128, 56, 18); ctx.fillStyle = c.top || "#F4A85C"; ctx.fill(); ctx.fillStyle = "#CFE7EE"; rr(ctx, -56, -102, 50, 40, 8); ctx.fill(); rr(ctx, 2, -102, 46, 40, 8); ctx.fill();
      rr(ctx, -100, -66, 200, 58, 20); ctx.fillStyle = c.color || th.accent; ctx.fill(); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.arc(92, -44, 9, 0, TAU); ctx.fillStyle = "#FFF1B8"; ctx.fill();
      if (c.label){ const z = fitFont(ctx, th, c.label, 150, 24, 800, 14); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(c.label, -4, -30); ctx.textAlign = "left"; }
      [-58, 58].forEach(wx => { ctx.beginPath(); ctx.arc(wx, -6, 24, 0, TAU); ctx.fillStyle = "#18150f"; ctx.fill(); ctx.beginPath(); ctx.arc(wx, -6, 10, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill();
        const a2 = x / 24; ctx.strokeStyle = "#544E42"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx + Math.cos(a2) * 18, -6 + Math.sin(a2) * 18); ctx.lineTo(wx - Math.cos(a2) * 18, -6 - Math.sin(a2) * 18); ctx.stroke(); });
      ctx.restore(); ctx.restore();
    }
    ctx.restore();
  }, (s, f, i, add) => { trafficTimes(s, f, i).forEach(x => add(x.T, x.light === "green" ? "chime" : x.light === "red" ? "ping" : "pop")); });

  /* =====================================================================
     stairs: a person (actor rig) climbs labelled steps, one step per cue.
     f: headline, highlight, steps:[{label, cue, icon}], actor:{hair, shirt, skin, ..., keys:[{cue, pose, expr, emote, say}]}, start (-1 floor)
     ===================================================================== */
  TT.layout("stairs", "Anak tangga", (ctx, th, s, t) => {
    const f = s.f, M = mv(), sp = f.steps || [], n = Math.max(1, sp.length); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const B = 1300, X0 = 280, X1 = 985, sw = (X1 - X0) / n, h = Math.min(125, 430 / n), T = sp.map((x, i) => at(s, x.cue, .15 + i * .2));
    const pos = k => k < 0 ? [X0 - 120, B] : [X0 + (k + .5) * sw, B - (k + 1) * h];
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // floor
    ctx.fillStyle = dark(th) ? "#3A3027" : "#E4D2BC"; rr(ctx, 90, B, 900, 26, 10); ctx.fill();
    // steps
    sp.forEach((x, k) => { const bx = X0 + k * sw, by = B - (k + 1) * h, on = t >= T[k], kk = popAt(t, T[k], .45);
      ctx.fillStyle = "rgba(24,21,15,.18)"; ctx.fillRect(bx + 10, by + 10, sw, (k + 1) * h - 10);
      ctx.fillStyle = on ? M.pal[k % 3] : (dark(th) ? "#3A3027" : "#EADCCB"); ctx.fillRect(bx, by, sw + 1, (k + 1) * h);
      ctx.fillStyle = on ? "rgba(255,255,255,.35)" : (dark(th) ? "rgba(250,248,243,.12)" : "rgba(59,36,24,.1)"); ctx.fillRect(bx, by, sw + 1, 12);
      ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.25)" : hexA(INK, .25); ctx.lineWidth = 3; ctx.strokeRect(bx, by, sw, (k + 1) * h);
      if (on && x.label){ scaled(ctx, bx + sw / 2, by + 50, kk, () => { const fl = fitLines(ctx, th, x.label, sw - 20, 31, 2, 800, 17); font(ctx, 800, fl.z, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        fl.L.forEach((l, j) => ctx.fillText(l, bx + sw / 2, by + 22 + fl.z + j * fl.z * 1.12)); ctx.textAlign = "left";
        const ly = by + 22 + fl.z * 1.12 * fl.L.length + 8; if (x.icon && (k + 1) * h - (ly - by) > 70){ icon(ctx, x.icon, bx + sw / 2 - 26, ly + 4, 52, "rgba(255,255,255,.9)", 2.4); } }); }
      else if (!on){ font(ctx, 800, 34, th.fam); ctx.fillStyle = dark(th) ? "rgba(250,248,243,.3)" : hexA(INK, .25); ctx.textAlign = "center"; ctx.fillText(String(k + 1), bx + sw / 2, by + 50); ctx.textAlign = "left"; } });
    // actor position along the stairs
    let k0 = f.start != null ? f.start : -1, [px, py] = pos(k0), moving = false;
    sp.forEach((x, k) => { if (t < T[k]) return; const u = clamp((t - T[k]) / .8, 0, 1), [x0, y0] = pos(k0), [x1, y1] = pos(k);
      if (u < 1){ const e = easeIO(u); px = x0 + (x1 - x0) * e; py = y0 + (y1 - y0) * e - Math.sin(u * Math.PI) * 55; moving = true; } else { px = x1; py = y1; moving = false; } k0 = k; });
    const a = f.actor || { hair: "short", shirt: "#2F6F73", skin: "a" }, st = actorState(a, s, t); st.x = px; st.walking = moving; st.face = 1; if (moving) st.sit = false;
    const r = drawActor(ctx, th, a, st, t, py, a.scale || .6);
    const lastT = T[n - 1]; if (sp.length && t > lastT + .8) burst(ctx, pos(n - 1)[0], Math.max(620, pos(n - 1)[1] - 300), t - lastT - .8, M, 10);
    if (r && st.emote) emoteAt(ctx, th, st.emote, r.headX + 50, r.headTop - 4, t - st.emoteT, t);
    if (r && st.say) bubbleAt(ctx, th, st.say, r.headX, r.headTop - 6, st.chat, t - st.sayT);
    ctx.restore();
  }, (s, f, i, add) => { (f.steps || []).forEach((x, k) => add(at(s, x.cue, .15 + k * .2, i), "pop")); const n = (f.steps || []).length; if (n) add(at(s, f.steps[n - 1].cue, .15 + (n - 1) * .2, i) + .8, "chime"); });

  /* =====================================================================
     magnet: a horseshoe magnet pulls icons in (they snap on) or pushes them away (repel).
     f: headline, highlight, label, items:[{label, icon, cue, repel}]
     ===================================================================== */
  TT.layout("magnet", "Magnet", (ctx, th, s, t) => {
    const f = s.f, M = mv(), its = f.items || [], n = its.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const CX = 540, CY = f.headline ? 790 : 750, RO = 205, TH = 98, LB = CY + 160, xl = CX - RO + TH / 2, xr = CX + RO - TH / 2;
    const T = its.map((it, i) => at(s, it.cue, .12 + i * .22)), att = its.map((it, i) => i).filter(i => !its[i].repel), m = att.length, SY = LB + 110;
    const spS = Math.min(250, 800 / Math.max(1, n)), spA = Math.min(260, 800 / Math.max(1, m));
    const pulling = T.some((T0, i) => t > T0 + .5 && t < T0 + 1.2);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // field lines
    for (let k = 0; k < 4; k++){ const q = ((t * (pulling ? .9 : .4)) + k / 4) % 1; ctx.strokeStyle = hexA(th.accent, (1 - q) * (pulling ? .55 : .3)); ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 40;
      ctx.beginPath(); ctx.ellipse(CX, LB, (xr - xl) / 2 + q * 140, 30 + q * 190, 0, 0, Math.PI); ctx.stroke(); }
    ctx.setLineDash([]);
    // magnet
    const wob = Math.sin(t * 1.6) * .015 + (pulling ? Math.sin(t * 30) * .01 : 0);
    ctx.save(); ctx.translate(CX, CY); ctx.rotate(wob); ctx.translate(-CX, -CY);
    ctx.lineCap = "butt"; ctx.strokeStyle = "rgba(24,21,15,.25)"; ctx.lineWidth = TH; ctx.beginPath(); ctx.moveTo(xl + 10, LB - 50 + 10); ctx.lineTo(xl + 10, CY + 10); ctx.arc(CX + 10, CY + 10, RO - TH / 2, Math.PI, 0); ctx.lineTo(xr + 10, LB - 50 + 10); ctx.stroke();
    ctx.strokeStyle = "#C8442A"; ctx.beginPath(); ctx.moveTo(xl, LB - 50); ctx.lineTo(xl, CY); ctx.arc(CX, CY, RO - TH / 2, Math.PI, 0); ctx.lineTo(xr, LB - 50); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(CX, CY, RO - TH / 2 + 26, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
    [xl, xr].forEach(x => { rr(ctx, x - TH / 2, LB - 56, TH, 62, 6); ctx.fillStyle = "#DAD3C8"; ctx.fill(); ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 4; ctx.stroke(); });
    ctx.restore();
    if (f.label) tag(ctx, th, f.label, CX, CY - RO + TH / 2, { bg: INK, fg: PAPER, size: 32, maxW: 640 });
    // items
    let lastSnap = -9;
    its.forEach((it, i) => { const T0 = T[i]; if (t < T0) return; const sx = CX + (i - (n - 1) / 2) * spS, sy = 1172 + (i % 2 ? -12 : 12), k = popAt(t, T0, .35);
      let x = sx, y = sy, sc = k, alpha = 1, rot = 0, dead = false;
      const u = t - T0;
      if (u > .45 && u < .65){ x += Math.sin(u * 60) * 5; }
      if (!it.repel){ const j = att.indexOf(i), tx = CX + (j - (m - 1) / 2) * spA, ty = SY; const q = clamp((u - .6) / .55, 0, 1), e = q * q;
        if (q > 0){ x = sx + (tx - sx) * e; y = sy + (ty - sy) * e - Math.sin(q * Math.PI) * 30; rot = Math.sin(q * 12) * .15 * (1 - q); }
        if (q >= 1){ lastSnap = Math.max(lastSnap, T0 + 1.15); y = ty + Math.sin(t * 3 + i) * 3; } }
      else { const q1 = clamp((u - .6) / .4, 0, 1), q2 = clamp((u - 1) / .55, 0, 1), dir = sx < CX ? -1 : sx > CX ? 1 : (i % 2 ? 1 : -1), mx = sx + (CX - sx) * .3, my = sy - 150;
        if (q1 > 0 && q2 <= 0){ const e = easeIO(q1); x = sx + (mx - sx) * e; y = sy + (my - sy) * e; }
        if (q2 > 0){ const e = eOut(q2), ex = clamp(sx + dir * 45, 150, 930); x = mx + (ex - mx) * e; y = my + (sy + 14 - my) * e; rot = dir * q2 * .5; alpha = 1 - q2 * .35; dead = q2 >= 1; } }
      ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
      ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fillStyle = it.repel ? "#8C8476" : M.pal[i % 3]; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; ctx.stroke(); icon(ctx, it.icon || "star", -33, -33, 66, "#fff", 2.4);
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= alpha * clamp(k, 0, 1); const lw = (it.repel ? spS : (t - T0 > 1.15 ? spA : spS)) - 16;
      tag(ctx, th, it.label, clamp(x, 90 + lw / 2, 990 - lw / 2), y + 98, { bg: it.repel ? (dark(th) ? "#2A2622" : "#ECE6DD") : "#FFFFFF", fg: INK, size: 30, maxW: Math.max(150, lw), lines: 2, stroke: it.repel ? null : hexA(INK, .12), lw: 3 });
      ctx.restore();
      if (it.repel && t - T0 > 1.2) crossDisc(ctx, x + 46, y - 46, 22);
    });
    if (lastSnap > 0) burst(ctx, CX, SY - 40, t - lastSnap, M, 9);
    ctx.restore();
  }, (s, f, i, add) => { (f.items || []).forEach((it, k) => { const T0 = at(s, it.cue, .12 + k * .22, i); add(T0, "pop"); add(T0 + (it.repel ? 1 : 1.15), it.repel ? "whoosh" : "pop"); }); });

  /* =====================================================================
     rocket: countdown on the pad, launch, then the rocket climbs past stage markers.
     f: headline, highlight, label (on the pad), countCue, count (3), launchCue, stages:[{label, icon, cue}]
     ===================================================================== */
  function rocketTimes(s, f, idx){ const tc = f.countCue ? at(s, f.countCue, .08, idx) : null, cnt = f.count || 3;
    const tL = f.launchCue ? at(s, f.launchCue, .3, idx) : (tc != null ? tc + cnt * .7 : .7);
    return { tc, cnt, tL, ts: (f.stages || []).map((x, k) => Math.max(tL + .5, at(s, x.cue, .45 + k * .15, idx))) }; }
  TT.layout("rocket", "Roket", (ctx, th, s, t) => {
    const f = s.f, M = mv(), sg = f.stages || [], n = sg.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { tc, cnt, tL, ts } = rocketTimes(s, f), RX = 300, PAD = 1240, RS = 1.3, RH = 210 * RS, top = f.headline ? 700 : 660;
    const yPad = PAD - RH / 2, yLift = yPad - 90, ySt = k => n <= 1 ? top + 100 : (yLift - 80) - k * ((yLift - 80 - (top + 100)) / (n - 1));
    // rocket centre y: chained eased moves
    let ry = yPad; const ev = [[tL, yLift]].concat(ts.map((T, k) => [T, ySt(k)]));
    ev.forEach(([T, y], k) => { if (t < T) return; const from = k ? ev[k - 1][1] : yPad; ry = from + (y - from) * easeIO(clamp((t - T) / .9, 0, 1)); });
    const launched = t >= tL, counting = tc != null && t >= tc && !launched;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // sky streaks once launched
    if (launched){ ctx.save(); ctx.globalAlpha *= clamp((t - tL) * 2, 0, 1) * .5; ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.35)" : hexA(INK, .18); ctx.lineWidth = 4; ctx.lineCap = "round";
      for (let k = 0; k < 7; k++){ const x = 130 + ((k * 137) % 330), y = 580 + (((t - tL) * 520 + k * 113) % 700); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 50); ctx.stroke(); } ctx.restore(); }
    // altitude rail + stage markers
    const railX = 500; ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.25)" : hexA(INK, .2); ctx.lineWidth = 5; ctx.setLineDash([10, 14]); ctx.beginPath(); ctx.moveTo(railX, ySt(0) + 40); ctx.lineTo(railX, ySt(n - 1) - 40); ctx.stroke(); ctx.setLineDash([]);
    sg.forEach((x, k) => { const y = ySt(k), on = t >= ts[k], kk = popAt(t, ts[k], .45);
      ctx.beginPath(); ctx.arc(railX, y, 14, 0, TAU); ctx.fillStyle = on ? GREEN : (dark(th) ? "#3A3027" : "#E4D7C7"); ctx.fill();
      if (on) scaled(ctx, railX + 30, y, kk, () => { tag(ctx, th, x.label, railX + 34, y, { align: "left", bg: "#FFFFFF", fg: INK, size: 36, maxW: 990 - railX - 34, icon: x.icon, stroke: th.accent, lw: 4 }); });
      if (on && t - ts[k] > .9) checkDisc(ctx, railX, y, 22); });
    // pad + tower
    ctx.fillStyle = "#544E42"; for (let k = 0; k < 4; k++){ ctx.fillRect(RX - 165, PAD - 230 + k * 58, 14, 58); ctx.save(); ctx.strokeStyle = "#544E42"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(RX - 155, PAD - 230 + k * 58); ctx.lineTo(RX - 125, PAD - 172 + k * 58); ctx.stroke(); ctx.restore(); }
    ctx.fillRect(RX - 165, PAD - 232, 60, 12);
    rr(ctx, RX - 180, PAD, 360, 64, 16); ctx.fillStyle = "#3B2418"; ctx.fill();
    if (f.label){ const z = fitFont(ctx, th, f.label, 330, 30, 800, 16); ctx.fillStyle = PAPER; ctx.textAlign = "center"; ctx.fillText(f.label, RX, PAD + 32 + z * .35); ctx.textAlign = "left"; }
    // smoke on the pad
    if (counting || (launched && t - tL < 3)){ const age = launched ? t - tL : 0; for (let k = 0; k < 9; k++){ const q = ((t * .8) + k / 9) % 1, side = k % 2 ? 1 : -1, sz = (counting ? 16 : 30) + q * (counting ? 30 : 70);
      ctx.beginPath(); ctx.arc(RX + side * (20 + q * (counting ? 70 : 180)), PAD - 10 - q * 30, sz, 0, TAU); ctx.fillStyle = `rgba(232,222,208,${(1 - q) * (launched ? .8 * (1 - age / 3) : .5)})`; ctx.fill(); } }
    // exhaust trail
    if (launched){ const g = ctx.createLinearGradient(0, ry + RH / 2, 0, PAD); g.addColorStop(0, "rgba(244,168,92,.55)"); g.addColorStop(1, "rgba(232,222,208,0)"); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(RX - 28, ry + RH / 2 + 30); ctx.lineTo(RX + 28, ry + RH / 2 + 30); ctx.lineTo(RX + 60 + Math.sin(t * 7) * 8, PAD); ctx.lineTo(RX - 60 + Math.sin(t * 6) * 8, PAD); ctx.closePath(); ctx.fill(); }
    // rocket
    const jit = counting ? Math.sin(t * 50) * 2 : 0, sway = launched ? Math.sin(t * 2.2) * .03 : 0;
    ctx.save(); ctx.translate(RX + jit, ry); ctx.rotate(sway); ctx.scale(RS, RS); { const RH = 210;
    if (launched){ const fl = 60 + Math.sin(t * 40) * 14 + Math.sin(t * 23) * 8; ctx.beginPath(); ctx.moveTo(-26, RH / 2 - 8); ctx.quadraticCurveTo(0, RH / 2 + fl * 1.6, 26, RH / 2 - 8); ctx.fillStyle = "#F4A85C"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-14, RH / 2 - 8); ctx.quadraticCurveTo(0, RH / 2 + fl, 14, RH / 2 - 8); ctx.fillStyle = "#FFF1B8"; ctx.fill(); }
    ctx.fillStyle = "#A0522D"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 40, RH / 2 - 80); ctx.lineTo(d * 78, RH / 2 + 6); ctx.lineTo(d * 40, RH / 2 - 6); ctx.closePath(); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(-42, RH / 2 - 4); ctx.lineTo(-42, -RH / 2 + 70); ctx.quadraticCurveTo(-40, -RH / 2 + 10, 0, -RH / 2); ctx.quadraticCurveTo(40, -RH / 2 + 10, 42, -RH / 2 + 70); ctx.lineTo(42, RH / 2 - 4); ctx.closePath();
    ctx.fillStyle = "#FFF7EE"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.fillStyle = th.accent; ctx.fillRect(-50, -RH / 2 - 4, 100, 62); ctx.fillRect(-50, RH / 2 - 40, 100, 40); ctx.restore();
    ctx.beginPath(); ctx.arc(0, -12, 21, 0, TAU); ctx.fillStyle = "#9FD3E0"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); ctx.beginPath(); ctx.arc(-6, -18, 6, 0, TAU); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fill(); }
    ctx.restore();
    // countdown
    if (tc != null && t >= tc && t < tL + .5){ const iv = Math.max(.35, (tL - tc) / cnt), k = Math.min(cnt - 1, Math.floor((t - tc) / iv)), num = t >= tL ? (f.goText || "") : String(cnt - k), kt = t >= tL ? tL : tc + k * iv, q = popAt(t, kt, .3);
      const fade = t >= tL ? 1 - clamp((t - tL) / .5, 0, 1) : 1; if (num){ ctx.save(); ctx.globalAlpha *= fade; scaled(ctx, 740, 900, q, () => {
        ctx.beginPath(); ctx.arc(740, 900, 130, 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.stroke();
        const z = fitFont(ctx, th, num, 220, 150, 900, 40); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(num, 740, 900 + z * .36); ctx.textAlign = "left";
        ctx.strokeStyle = hexA(th.accent, .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(740, 900, 150, -Math.PI / 2, -Math.PI / 2 + TAU * clamp((t - kt) / iv, 0, 1)); ctx.stroke(); }); ctx.restore(); } }
    if (n && t > ts[n - 1] + .9) burst(ctx, RX, ry - RH / 2, t - ts[n - 1] - .9, M, 10);
    ctx.restore();
  }, (s, f, i, add) => { const r = rocketTimes(s, f, i); if (r.tc != null){ const iv = Math.max(.35, (r.tL - r.tc) / r.cnt); for (let k = 0; k < r.cnt; k++) add(r.tc + k * iv, "pop"); } add(r.tL, "whoosh"); r.ts.forEach(T => add(T, "chime")); });

  /* =====================================================================
     envelope: a letter (optionally with a typo that gets fixed) folds into an envelope,
     the flap closes, a seal pops, then it flies to a destination or comes back stamped.
     f: headline, highlight, title, rows:[...], fix:{line, from, to, cue}, foldCue, sealCue, seal (short text) | sealIcon,
        sendCue, to:{label, icon}, returnCue, returnLabel, start:"sealed"
     ===================================================================== */
  function envTimes(s, f, idx){ const sealed = f.start === "sealed";
    const tF = f.foldCue ? at(s, f.foldCue, .45, idx) : (sealed ? -9 : 1e9);
    return { sealed, tF, tS: f.sealCue ? at(s, f.sealCue, .6, idx) : (sealed ? -9 : 1e9), tX: f.fix ? at(s, f.fix.cue, .3, idx) : 1e9,
      tSend: f.sendCue ? at(s, f.sendCue, .75, idx) : 1e9, tR: f.returnCue ? at(s, f.returnCue, .85, idx) : 1e9 }; }
  TT.layout("envelope", "Amplop", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const { sealed, tF, tS, tX, tSend, tR } = envTimes(s, f), EX = 540, EY = f.headline ? 1110 : 1080, EW = 560, EH = 320, ET = EY - EH / 2, FH = 190;
    const DX = 815, DY = 650, sent = f.sendCue && t >= tSend, back = f.returnCue && t >= tR;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    // destination
    if (f.to && (sent || back)){ const k = popAt(t, tSend - .1, .4), arrived = sent && t >= tSend + 1 && !(back && t >= tR);
      scaled(ctx, DX, DY, k || 1, () => { ctx.beginPath(); ctx.arc(DX, DY, 66, 0, TAU); ctx.fillStyle = arrived ? (f.sentWarn ? RED : GREEN) : INK; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 6; ctx.stroke(); icon(ctx, f.to.icon || "users", DX - 36, DY - 36, 72, "#fff", 2.4);
        tag(ctx, th, f.to.label || "", Math.min(DX, 990 - 150), DY + 108, { bg: "#FFFFFF", fg: INK, size: 28, maxW: 300, stroke: hexA(INK, .15), lw: 3 }); });
      if (sent && t >= tSend + 1) burst(ctx, DX, DY, t - tSend - 1, M, 9); if (arrived && t > tSend + 1.2 && !f.sentWarn) checkDisc(ctx, DX + 52, DY - 52, 24); }
    // tally pills (e.g. repeated incidents) on the left
    (f.tally || []).forEach((x, k) => { const T = at(s, x.cue, .2 + k * .25); if (t < T) return; const y = 615 + k * 92, q = popAt(t, T, .4);
      scaled(ctx, 140, y, q, () => { crossDisc(ctx, 140, y, 28); tag(ctx, th, x.label, 182, y, { align: "left", bg: "#FFFFFF", fg: INK, size: 30, maxW: 520, stroke: RED, lw: 4 }); }); });
    // envelope transform
    let ex = EX, ey = EY + Math.sin(t * 1.5) * 5, esc = 1, erot = 0, show = true;
    const pathTo = (q, fx, fy, tx, ty, cxp, cyp) => { const a = 1 - q; return [a * a * fx + 2 * a * q * cxp + q * q * tx, a * a * fy + 2 * a * q * cyp + q * q * ty]; };
    if (sent){ const q = easeIO(clamp((t - tSend) / 1, 0, 1)); [ex, ey] = pathTo(q, EX, EY, DX, DY, EX + 40, EY - 520); esc = 1 - q * .78; erot = -Math.sin(q * Math.PI) * .25; if (q >= 1) show = false; }
    if (back){ const q = easeIO(clamp((t - tR) / .9, 0, 1)), [fx, fy] = sent ? [DX, DY] : [1250, EY]; [ex, ey] = pathTo(q, fx, fy, EX, EY, (fx + EX) / 2, Math.min(fy, EY) - 180); esc = (sent ? .22 : 1) + (1 - (sent ? .22 : 1)) * q; erot = Math.sin(q * Math.PI) * .3; show = true; }
    // fold / flap progress
    const uF = sealed ? 1 : clamp((t - tF) / .9, 0, 1), uFl = sealed ? 1 : clamp((t - tF - .85) / .45, 0, 1), closedFlap = uFl > .5;
    const drawFlap = () => { const ay = ET - FH * (1 - 2 * uFl) + (uFl > 0 ? 0 : 0); ctx.beginPath(); ctx.moveTo(-EW / 2, -EH / 2); ctx.lineTo(EW / 2, -EH / 2); ctx.lineTo(0, ay - EY); ctx.closePath();
      ctx.fillStyle = closedFlap ? "#F3D9B5" : "#E9C79C"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.stroke(); };
    // letter (local coords relative to envelope centre when inside)
    const lines = f.rows || [], LW = 520, LH = Math.max(250, 120 + lines.length * 62), LY0 = Math.min(ET - LH / 2 - 14, ET - 10 - LH / 2);
    const drawLetter = (lx, ly, sx, sy) => { ctx.save(); ctx.translate(lx, ly); ctx.scale(sx, sy);
      rr(ctx, -LW / 2 + 8, -LH / 2 + 10, LW, LH, 18); ctx.fillStyle = "rgba(24,21,15,.18)"; ctx.fill(); rr(ctx, -LW / 2, -LH / 2, LW, LH, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .25); ctx.lineWidth = 4; ctx.stroke();
      let y = -LH / 2 + 56; if (f.title){ const z = fitFont(ctx, th, f.title, LW - 80, 30, 800, 18); ctx.fillStyle = th.accent; ctx.fillText(f.title, -LW / 2 + 40, y); y += 22; ctx.fillStyle = hexA(INK, .12); ctx.fillRect(-LW / 2 + 40, y, LW - 80, 4); y += 18; }
      let budget = Math.max(0, (t - .25) * 45);
      lines.forEach((ln, k) => { y += 56; let txt = String(ln); const fx = f.fix && f.fix.line === k ? f.fix : null, fixed = fx && t >= tX + .35;
        if (fixed) txt = txt.replace(fx.from, fx.to);
        const z = fitFont(ctx, th, txt.length >= String(ln).length ? txt : String(ln), LW - 80, 36, 700, 18); const shown = txt.slice(0, Math.floor(budget)); budget -= txt.length;
        const xL = -LW / 2 + 40;
        if (fx){ const word = fixed ? fx.to : fx.from, wi = txt.indexOf(word); if (wi >= 0 && shown.length > wi){ const pre = ctx.measureText(txt.slice(0, wi)).width, ww = ctx.measureText(word).width;
          if (fixed){ const q = eOut(clamp((t - tX - .35) / .4, 0, 1)); rr(ctx, xL + pre - 6, y - z * .95, (ww + 12) * q, z * 1.25, 8); ctx.fillStyle = hexA(GREEN, .3); ctx.fill(); }
          else { ctx.strokeStyle = RED; ctx.lineWidth = 3.5; ctx.beginPath(); for (let xx = 0; xx <= ww; xx += 4) ctx.lineTo(xL + pre + xx, y + 10 + Math.sin(xx * .5 + t * 6) * 3); ctx.stroke();
            if (t >= tX){ const q = clamp((t - tX) / .3, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(xL + pre - 4, y - z * .3); ctx.lineTo(xL + pre - 4 + (ww + 8) * q, y - z * .3); ctx.stroke(); } } } }
        font(ctx, 700, z, th.fam); ctx.fillStyle = INK; ctx.fillText(shown, xL, y);
        if (fx && !fixed){ const wi = txt.indexOf(fx.from); if (wi >= 0 && shown.length > wi){ const pre = ctx.measureText(txt.slice(0, wi)).width; ctx.fillStyle = RED; ctx.fillText(shown.slice(wi, wi + fx.from.length), xL + pre, y); } }
        if (fixed){ const wi = txt.indexOf(fx.to); if (wi >= 0){ const pre = ctx.measureText(txt.slice(0, wi)).width; ctx.fillStyle = "#1F7A4D"; ctx.fillText(fx.to, xL + pre, y); } } });
      if (!sealed && t > .25 && budget < 0 && Math.sin(t * 8) > 0 && uF <= 0){ /* caret blink while typing */ }
      ctx.restore(); };
    const letterOut = !sealed && uF <= 0, inside = !sealed && uF > 0 && uF < 1;
    if (show){ ctx.save(); ctx.translate(ex, ey); ctx.rotate(erot); ctx.scale(esc, esc);
      // back
      rr(ctx, -EW / 2, -EH / 2, EW, EH, 14); ctx.fillStyle = "#E3BF92"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      if (!closedFlap) drawFlap();
      if (inside){ const e = easeIO(uF); ctx.save(); ctx.beginPath(); ctx.rect(-EW, -EH * 4, EW * 2, EH * 4 + EH / 2 - 6); ctx.clip(); drawLetter(0, (LY0 - EY) + (20 - (LY0 - EY)) * e, 1 - e * .12, 1 - e * .4); ctx.restore(); }
      // front pocket
      ctx.beginPath(); ctx.moveTo(-EW / 2, -EH / 2); ctx.lineTo(0, 22); ctx.lineTo(EW / 2, -EH / 2); ctx.lineTo(EW / 2, EH / 2); ctx.lineTo(-EW / 2, EH / 2); ctx.closePath(); ctx.fillStyle = "#F6E3C8"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.stroke();
      ctx.strokeStyle = hexA(INK, .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-EW / 2, EH / 2); ctx.lineTo(-40, 0); ctx.moveTo(EW / 2, EH / 2); ctx.lineTo(40, 0); ctx.stroke();
      if (closedFlap) drawFlap();
      // seal
      if (t >= tS){ const k = sealed && tS < 0 ? 1 : popAt(t, tS, .4); scaled(ctx, 0, FH - EH / 2 - 6, k, () => { const sy = FH - EH / 2 - 6;
        ctx.beginPath(); for (let a = 0; a < 16; a++){ const r = a % 2 ? 54 : 60, an = a * TAU / 16; ctx.lineTo(Math.cos(an) * r, sy + Math.sin(an) * r); } ctx.closePath(); ctx.fillStyle = "#B23A1E"; ctx.fill();
        ctx.beginPath(); ctx.arc(0, sy, 40, 0, TAU); ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 4; ctx.stroke();
        if (f.seal){ const z = fitFont(ctx, th, f.seal, 70, 30, 900, 14); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(f.seal, 0, sy + z * .36); ctx.textAlign = "left"; }
        else icon(ctx, f.sealIcon || "check", -24, sy - 24, 48, "#fff", 3); }); }
      // return stamp
      if (back && t >= tR + .9){ const q = clamp((t - tR - .9) / .3, 0, 1), sc = 2 - eOut(q); ctx.save(); ctx.globalAlpha *= q; ctx.rotate(-.18); ctx.scale(sc, sc);
        const txt = f.returnLabel || "Kembali", z = fitFont(ctx, th, txt, 380, 54, 900, 22), w = ctx.measureText(txt).width + 56; rr(ctx, -w / 2, -z * .9 - 6, w, z * 1.6 + 12, 12); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.stroke();
        ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(txt, 0, z * .36); ctx.textAlign = "left"; ctx.restore(); }
      ctx.restore();
      if (letterOut) drawLetter(EX, LY0 + Math.sin(t * 1.3) * 4, 1, 1);
      if (sent && !back){ const q = clamp((t - tSend) / 1, 0, 1); ctx.save(); ctx.setLineDash([12, 14]); ctx.strokeStyle = hexA(th.accent, .6 * (1 - Math.max(0, (t - tSend - 1.2)))); ctx.lineWidth = 5; ctx.beginPath();
        for (let k = 0; k <= 30 * q; k++){ const [x, y] = pathTo(k / 30, EX, EY, DX, DY, EX + 40, EY - 520); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); } }
    if (back && t >= tR + .9 && t < tR + 1.8){ const d = t - tR - .9; for (let k = 0; k < 6; k++){ const a = k * TAU / 6 + .4; ctx.strokeStyle = hexA(RED, 1 - d / .9); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(EX + Math.cos(a) * (200 + d * 80), EY + Math.sin(a) * (120 + d * 60)); ctx.lineTo(EX + Math.cos(a) * (240 + d * 90), EY + Math.sin(a) * (150 + d * 70)); ctx.stroke(); } }
    if (t >= tS && tS > 0 && !sent) burst(ctx, EX, EY + 20, t - tS, M, 8);
    // after arrival: a big confirmation where the envelope was
    if (sent && !back && t >= tSend + 1.05){ const k = popAt(t, tSend + 1.05, .45), warn = !!f.sentWarn, cy = EY - 40 + Math.sin(t * 1.6) * 5;
      scaled(ctx, EX, cy, k, () => { const g = ctx.createRadialGradient(EX, cy, 40, EX, cy, 230); g.addColorStop(0, hexA(warn ? RED : GREEN, .25)); g.addColorStop(1, hexA(warn ? RED : GREEN, 0)); ctx.fillStyle = g; ctx.fillRect(EX - 230, cy - 230, 460, 460);
        if (warn){ ctx.beginPath(); ctx.arc(EX, cy, 95, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.stroke(); font(ctx, 900, 130, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("!", EX, cy + 46); ctx.textAlign = "left"; }
        else { checkDisc(ctx, EX, cy, 95, GREEN); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(EX, cy, 95, 0, TAU); ctx.stroke(); }
        tag(ctx, th, f.sentLabel || "Terkirim", EX, cy + 160, { bg: warn ? RED : INK, fg: "#fff", size: 38, maxW: 820 }); }); }
    ctx.restore();
  }, (s, f, i, add) => { const e = envTimes(s, f, i); if (f.fix) add(e.tX + .35, "pop"); if (f.foldCue) add(e.tF, "whoosh"); if (f.sealCue) add(e.tS, "pop"); if (f.sendCue){ add(e.tSend, "whoosh"); add(e.tSend + 1, "chime"); } if (f.returnCue){ add(e.tR, "whoosh"); add(e.tR + .9, "ping"); } (f.tally || []).forEach((x, k) => add(at(s, x.cue, .2 + k * .25, i), "pop")); });

  /* =====================================================================
     hourglass: sand runs from startCue to endCue; tags pop beside the glass on cue;
     optional flip (turns over and restarts) and a running clock readout.
     f: headline, highlight, label, marks:[{label, cue, icon}], startCue, endCue, flipCue, timer:{from:"09.00", to:"12.00"}
     ===================================================================== */
  function hgTimes(s, f, idx){ return { t0: at(s, f.startCue, .05, idx), t1: f.endCue ? at(s, f.endCue, .9, idx) : null, tf: f.flipCue ? at(s, f.flipCue, .6, idx) : null }; }
  TT.layout("hourglass", "Jam pasir", (ctx, th, s, t) => {
    const f = s.f, M = mv(), mk = f.marks || [], n = mk.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const tm = hgTimes(s, f), CX = 540, CY = f.headline ? 945 : 905, HH = 245, BW = 128;
    const t0 = tm.t0, t1 = tm.t1 != null ? tm.t1 : sceneDur() - .5, rate = 1 / Math.max(.8, t1 - t0);
    let p = clamp((t - t0) * rate, 0, 1), rot = 0, timerP = p;
    if (tm.tf != null && t >= tm.tf){ const pf = clamp((tm.tf - t0) * rate, 0, 1), u = clamp((t - tm.tf) / .7, 0, 1); rot = Math.PI * easeIO(u);
      if (u >= 1){ rot = 0; p = clamp((1 - pf) + (t - tm.tf - .7) * rate, 0, 1); } else p = pf; timerP = 0; }
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    const glow = ctx.createRadialGradient(CX, CY, 30, CX, CY, 380); glow.addColorStop(0, hexA(th.accent, .18 + .06 * Math.sin(t * 2))); glow.addColorStop(1, hexA(th.accent, 0)); ctx.fillStyle = glow; ctx.fillRect(CX - 380, CY - 380, 760, 760);
    ctx.save(); ctx.translate(CX, CY); ctx.rotate(rot + Math.sin(t * 1.2) * .012);
    const glass = () => { ctx.beginPath(); ctx.moveTo(-BW, -HH + 20); ctx.bezierCurveTo(-BW, -HH * .3, -18, -48, -14, 0); ctx.bezierCurveTo(-18, 48, -BW, HH * .3, -BW, HH - 20); ctx.lineTo(BW, HH - 20); ctx.bezierCurveTo(BW, HH * .3, 18, 48, 14, 0); ctx.bezierCurveTo(18, -48, BW, -HH * .3, BW, -HH + 20); ctx.closePath(); };
    glass(); ctx.fillStyle = dark(th) ? "rgba(207,231,238,.10)" : "rgba(255,255,255,.55)"; ctx.fill();
    ctx.save(); glass(); ctx.clip();
    const sand = "#E8A317", sand2 = "#F4A85C";
    // top sand (level drops)
    const yTop = -12 - (HH - 40) * Math.pow(1 - p, .75); if (p < 1){ ctx.fillStyle = sand; ctx.beginPath(); ctx.moveTo(-BW, yTop); ctx.quadraticCurveTo(0, yTop + (p > 0 && p < 1 ? 26 : 0), BW, yTop); ctx.lineTo(BW, 0); ctx.lineTo(-BW, 0); ctx.closePath(); ctx.fill(); }
    // bottom mound
    const hb = (HH - 40) * Math.pow(p, .8); if (p > 0){ const base = HH - 20; ctx.fillStyle = sand2; ctx.beginPath(); ctx.moveTo(-BW, base); ctx.lineTo(-BW, base - hb * .55); ctx.quadraticCurveTo(-BW * .4, base - hb * .75, 0, base - hb - 14); ctx.quadraticCurveTo(BW * .4, base - hb * .75, BW, base - hb * .55); ctx.lineTo(BW, base); ctx.closePath(); ctx.fill(); }
    // stream + grains
    const flowing = p > 0 && p < 1 && rot === 0 && t >= t0; if (flowing){ const yb = HH - 20 - hb - 14; ctx.strokeStyle = sand; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, yb); ctx.stroke();
      ctx.fillStyle = sand; for (let k = 0; k < 8; k++){ const q = ((t * 1.6) + k / 8) % 1; ctx.beginPath(); ctx.arc(Math.sin(k * 3.1) * 6, q * yb, 4, 0, TAU); ctx.fill(); } }
    ctx.restore();
    glass(); ctx.strokeStyle = dark(th) ? "rgba(250,248,243,.85)" : INK; ctx.lineWidth = 7; ctx.lineJoin = "round"; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-BW + 26, -HH + 60); ctx.quadraticCurveTo(-BW + 22, -HH * .5, -BW * .55, -HH * .3); ctx.stroke();
    // frame
    ctx.fillStyle = "#8E4E2E"; [-1, 1].forEach(d => { rr(ctx, d * (BW + 22) - 9, -HH, 18, HH * 2, 8); ctx.fill(); });
    ctx.fillStyle = "#A0522D"; rr(ctx, -BW - 50, -HH - 30, (BW + 50) * 2, 36, 14); ctx.fill(); rr(ctx, -BW - 50, HH - 6, (BW + 50) * 2, 36, 14); ctx.fill();
    ctx.restore();
    if (f.label) tag(ctx, th, f.label, CX, CY - HH - 70, { bg: INK, fg: PAPER, size: 32, maxW: 700 });
    if (f.timer){ const pm = v => { const m = /(\d{1,2})[.:](\d{2})/.exec(v || ""); return m ? +m[1] * 60 + +m[2] : 0; }, a = pm(f.timer.from), b = pm(f.timer.to), mm = Math.round(a + (b - a) * timerP);
      const txt = `${String(Math.floor(mm / 60) % 24).padStart(2, "0")}.${String(mm % 60).padStart(2, "0")}`; tag(ctx, th, (f.timer.prefix ? f.timer.prefix + " " : "") + txt, CX, CY + HH + 72, { bg: th.accent, fg: "#fff", size: 36, maxW: 600, icon: "clock" }); }
    // marks beside the glass
    mk.forEach((m, i) => { const T = at(s, m.cue, .15 + i * .2); if (t < T) return; const right = i % 2 === 1, y = n <= 1 ? CY : CY - HH + 50 + i * ((HH * 2 - 100) / (n - 1)), k = popAt(t, T, .4);
      const ax = right ? CX + BW + 60 : CX - BW - 60, maxW = right ? 990 - ax : ax - 90;
      ctx.strokeStyle = th.accent; ctx.lineWidth = 4; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(right ? CX + BW * .6 : CX - BW * .6, y); ctx.lineTo(ax, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(right ? CX + BW * .6 : CX - BW * .6, y, 8, 0, TAU); ctx.fillStyle = th.accent; ctx.fill();
      scaled(ctx, ax, y, k, () => tag(ctx, th, m.label, ax, y, { align: right ? "left" : "right", bg: m.warn ? RED : "#FFFFFF", fg: m.warn ? "#fff" : INK, size: 33, maxW, lines: 2, icon: m.icon, stroke: m.warn ? null : th.accent, lw: 4 })); });
    ctx.restore();
  }, (s, f, i, add) => { (f.marks || []).forEach((m, k) => add(at(s, m.cue, .15 + k * .2, i), "pop")); const tm = hgTimes(s, f, i); if (tm.tf != null) add(tm.tf, "whoosh"); if (tm.t1 != null) add(tm.t1, "chime"); });
})();
