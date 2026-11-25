/* Scene pack set7c: lighthouse, sailboat, anchor, campfire, backpack, suitcase, mailbox, balloon.
   Every scene draws its own framed panel (sky/sea/night/room), so all text sits on white pills in INK and reads on light and dark themes.
   Canvas 1080x1920; visuals stay in y ~600-1325, text inside x 90-990. */
(() => {
  'use strict';
  const { cueT, popS, burst, topHead, INK, actorState, drawActor, bubbleAt, emoteAt, mv, easeIO, TAU, star } = TT;
  const at = (s, c, fr, i) => cueT(s, c, fr, i);
  const CREAM = "#FFF7EE", GREEN = "#3BB273", RED = "#D84315", TEAL = "#2F6F73", WOOD = "#B5643C", WOOD2 = "#7A4128", GOLD = "#FFD166", ORANGE = "#C2691F";
  const X0 = 90, X1 = 990, BOT = 1325;
  const topOf = f => f.headline ? 598 : 570;
  const lerp = (a, b, p) => a + (b - a) * p;
  const qb = (a, c, b, p) => (1 - p) * (1 - p) * a + 2 * (1 - p) * p * c + p * p * b;
  const SAILOR = { hair: "short", shirt: "#E89544", skin: "c" };

  // ---------- text helpers ----------
  function wrapFit(ctx, th, text, maxW, size, weight, maxLines, minSize){
    let sz = size;
    for (;;){
      font(ctx, weight, sz, th.fam); const lines = [];
      String(text || "").split("\n").forEach(par => { let cur = "";
        par.split(/\s+/).filter(Boolean).forEach(w => { const tr = cur ? cur + " " + w : w; if (!cur || ctx.measureText(tr).width <= maxW) cur = tr; else { lines.push(cur); cur = w; } });
        if (cur) lines.push(cur); });
      const ok = lines.length <= maxLines && lines.every(l => ctx.measureText(l).width <= maxW);
      if (ok || sz <= (minSize || 18)) return { lines: lines.slice(0, maxLines), size: sz };
      sz -= 2;
    }
  }
  // centred label box, clamped inside x 90-990; o: {size, weight, lines, bg, fg, stroke, lw, k(scale), strike}
  function tag(ctx, th, text, cx, cy, maxW, o){
    o = o || {}; maxW = Math.min(maxW || 880, 880); const { lines, size } = wrapFit(ctx, th, text, maxW - 34, o.size || 30, o.weight || 800, o.lines || 2, 16);
    font(ctx, o.weight || 800, size, th.fam); const lh = size * 1.16, w = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width)) + 36), h = lines.length * lh + 22;
    cx = clamp(cx, X0 + 4 + w / 2, X1 - 4 - w / 2);
    const k = o.k == null ? 1 : o.k; if (k <= 0) return { w, h, cx }; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    if (o.bg !== "none"){ ctx.save(); ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4; rr(ctx, -w / 2, -h / 2, w, h, Math.min(24, h / 2)); ctx.fillStyle = o.bg || "#FFFFFF"; ctx.fill(); ctx.restore();
      if (o.stroke){ rr(ctx, -w / 2, -h / 2, w, h, Math.min(24, h / 2)); ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 4; ctx.stroke(); } }
    ctx.fillStyle = o.fg || INK; ctx.textAlign = "center";
    lines.forEach((l, i) => { const y = -h / 2 + 11 + lh * (i + .5) + size * .36; ctx.fillText(l, 0, y);
      if (o.strike){ const lw2 = ctx.measureText(l).width; ctx.strokeStyle = o.fg || INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-lw2 / 2 - 4, y - size * .32); ctx.lineTo(lw2 / 2 + 4, y - size * .32); ctx.stroke(); } });
    ctx.textAlign = "left"; ctx.restore(); return { w, h, cx };
  }
  // list chip with a round badge on the left; x = left edge (or right edge when o.right)
  function chip(ctx, th, text, x, y, maxW, kind, k, o){
    o = o || {}; if (k <= 0) return; const { lines, size } = wrapFit(ctx, th, text, maxW - 92, o.size || 28, 800, 1, 16);
    font(ctx, 800, size, th.fam); const tw = ctx.measureText(lines[0] || "").width, w = tw + 92, h = 56, lx = o.right ? x - w : x;
    ctx.save(); ctx.translate(lx + w / 2, y); ctx.scale(k, k); ctx.translate(-w / 2, 0);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.16)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; rr(ctx, 0, -h / 2, w, h, h / 2); ctx.fillStyle = o.dim ? "#EDE6DC" : "#FFFFFF"; ctx.fill(); ctx.restore();
    const col = kind === "ok" ? GREEN : kind === "no" ? RED : kind === "minus" ? TEAL : kind === "out" ? "#8C8476" : ORANGE;
    ctx.beginPath(); ctx.arc(30, 0, 20, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath();
    if (kind === "ok"){ ctx.moveTo(21, 1); ctx.lineTo(28, 8); ctx.lineTo(40, -7); }
    else if (kind === "no"){ ctx.moveTo(23, -7); ctx.lineTo(37, 7); ctx.moveTo(37, -7); ctx.lineTo(23, 7); }
    else if (kind === "minus"){ ctx.moveTo(22, 0); ctx.lineTo(38, 0); }
    else if (kind === "out"){ ctx.moveTo(22, 0); ctx.lineTo(38, 0); ctx.moveTo(32, -6); ctx.lineTo(38, 0); ctx.lineTo(32, 6); }
    else { ctx.moveTo(22, 0); ctx.lineTo(38, 0); ctx.moveTo(30, -8); ctx.lineTo(30, 8); }
    ctx.stroke(); ctx.fillStyle = o.dim ? "#8C8476" : INK; ctx.fillText(lines[0] || "", 60, size * .36);
    if (o.strike){ ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(56, -2); ctx.lineTo(64 + tw, -2); ctx.stroke(); }
    ctx.restore();
  }
  function badge(ctx, x, y, r, q, ok){ if (q <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = ok ? GREEN : RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = r * .22; ctx.lineCap = "round"; ctx.beginPath();
    if (ok){ ctx.moveTo(-r * .42, 0); ctx.lineTo(-r * .1, r * .32); ctx.lineTo(r * .45, -r * .32); } else { ctx.moveTo(-r * .35, -r * .35); ctx.lineTo(r * .35, r * .35); ctx.moveTo(r * .35, -r * .35); ctx.lineTo(-r * .35, r * .35); }
    ctx.stroke(); ctx.restore(); }
  function tile(ctx, th, name, x, y, sz, rot, col){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.save(); ctx.shadowColor = "rgba(0,0,0,.2)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    rr(ctx, -sz / 2, -sz / 2, sz, sz, sz * .24); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore(); rr(ctx, -sz / 2, -sz / 2, sz, sz, sz * .24); ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.stroke();
    icon(ctx, name || "star", -sz * .3, -sz * .3, sz * .6, col || ORANGE, 2.4); ctx.restore(); }
  function puff(ctx, x, y, r, a){ if (a <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x + r * .7, y + r * .2, r * .75, 0, TAU); ctx.arc(x - r * .7, y + r * .25, r * .7, 0, TAU); ctx.fillStyle = `rgba(190,178,160,${a})`; ctx.fill(); }

  // ---------- frames ----------
  function frame(ctx, th, top, t, paint){
    const q = eOut(clamp((t - .05) / .45, 0, 1)); ctx.globalAlpha *= q;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.18)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; rr(ctx, X0, top, X1 - X0, BOT - top, 40); ctx.fillStyle = "#FFF3E4"; ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, X0, top, X1 - X0, BOT - top, 40); ctx.clip(); paint(); ctx.restore();
    rr(ctx, X0, top, X1 - X0, BOT - top, 40); ctx.strokeStyle = th.key === "B" ? "rgba(250,248,243,.25)" : hexA(INK, .14); ctx.lineWidth = 4; ctx.stroke();
  }
  function skyFill(ctx, top, y1, c0, c1){ const g = ctx.createLinearGradient(0, top, 0, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(X0, top, X1 - X0, y1 - top); }
  function stars(ctx, top, y1, t, n){ for (let k = 0; k < (n || 26); k++){ const x = X0 + 30 + (k * 211) % 840, y = top + 20 + (k * 97) % Math.max(40, y1 - top - 40), a = .35 + .35 * Math.sin(t * 2 + k * 1.7); ctx.fillStyle = `rgba(255,247,230,${a})`; star(ctx, x, y, 3 + (k % 3) * 2); } }
  function cloud(ctx, x, y, s, a){ ctx.fillStyle = `rgba(255,255,255,${a == null ? .9 : a})`; ctx.beginPath(); ctx.arc(x, y, 30 * s, 0, TAU); ctx.arc(x + 34 * s, y + 8 * s, 24 * s, 0, TAU); ctx.arc(x - 34 * s, y + 10 * s, 22 * s, 0, TAU); ctx.arc(x + 8 * s, y + 16 * s, 26 * s, 0, TAU); ctx.fill(); }
  function sea(ctx, y, t, c0, c1, amp){ const g = ctx.createLinearGradient(0, y, 0, BOT); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(X0, BOT); for (let x = X0; x <= X1; x += 20) ctx.lineTo(x, y + Math.sin(x * .02 + t * 2) * (amp || 6)); ctx.lineTo(X1, BOT); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 4; for (let r = 0; r < 4; r++){ const yy = y + 50 + r * 75; ctx.beginPath(); for (let x = X0 + ((r * 90 + t * 30) % 180) - 180; x < X1; x += 180){ ctx.moveTo(x, yy); ctx.quadraticCurveTo(x + 30, yy - 10, x + 60, yy); } ctx.stroke(); } }
  function waveFront(ctx, y, t, col){ ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(X0, y + 40); for (let x = X0; x <= X1; x += 20) ctx.lineTo(x, y + 8 + Math.sin(x * .03 - t * 2.4) * 7); ctx.lineTo(X1, y + 40); ctx.closePath(); ctx.fill(); }
  function room(ctx, top, floorY){ skyFill(ctx, top, floorY, "#FFF3E4", "#FBE3CA"); ctx.fillStyle = "#E9C9A8"; ctx.fillRect(X0, floorY, X1 - X0, BOT - floorY); ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fillRect(X0, floorY, X1 - X0, 8);
    ctx.strokeStyle = "rgba(59,36,24,.07)"; ctx.lineWidth = 3; for (let x = X0 + 60; x < X1; x += 120){ ctx.beginPath(); ctx.moveTo(x, floorY + 8); ctx.lineTo(x - 50, BOT); ctx.stroke(); } }
  function grass(ctx, top, gy, t){ skyFill(ctx, top, gy, "#CFE7EE", "#F6EBDD"); cloud(ctx, 250 + Math.sin(t * .3) * 20, top + 90, 1.1, .85); cloud(ctx, 760 + Math.sin(t * .25 + 1) * 24, top + 150, .9, .75);
    ctx.fillStyle = "#9CC27A"; ctx.fillRect(X0, gy, X1 - X0, BOT - gy); ctx.fillStyle = "#7FA862"; ctx.fillRect(X0, gy, X1 - X0, 10);
    ctx.strokeStyle = "#6E9A52"; ctx.lineWidth = 3; for (let x = X0 + 20; x < X1; x += 46){ ctx.beginPath(); ctx.moveTo(x, gy + 30); ctx.lineTo(x + 6, gy + 16); ctx.moveTo(x + 10, gy + 30); ctx.lineTo(x + 14, gy + 18); ctx.stroke(); } }

  // ---------- actors ----------
  function act(a, s, t, defX, extra){ const A = Object.assign({ x: defX }, a || {}); if (extra && extra.length) A.keys = (A.keys || []).concat(extra); const st = actorState(A, s, t); return { A, st }; }
  function overlay(ctx, th, o, t){ if (!o || !o.r) return; const { st, r } = o; if (st.emote) emoteAt(ctx, th, st.emote, r.headX, r.headTop - 24, t - st.emoteT, t); if (st.say) bubbleAt(ctx, th, st.say, r.headX, r.headTop - (st.emote ? 90 : 14), st.chat, t - st.sayT); }

  // ---------- boat (local frame: waterline at y=0) ----------
  function boat(ctx, th, o, t){
    const w = o.w || 230, h = w * .3; ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rock || 0);
    let r = null;
    if (o.sail){ const mx = w * .08, top = -w * 1.02, bel = (o.belly || 0) * w * .22 * (o.dir || 1);
      ctx.strokeStyle = WOOD2; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(mx, -h * .4); ctx.lineTo(mx, top); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx + 6, top + 10); ctx.quadraticCurveTo(mx + w * .36 + bel, top + w * .45, mx + w * .42, -h * .8); ctx.lineTo(mx + 6, -h * .8); ctx.closePath(); ctx.fillStyle = "#FFFDF7"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx - 6, top + 26); ctx.quadraticCurveTo(mx - w * .26 + bel * .6, top + w * .5, mx - w * .32, -h * .8); ctx.lineTo(mx - 6, -h * .8); ctx.closePath(); ctx.fillStyle = o.sailCol || ORANGE; ctx.fill(); ctx.stroke();
      ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(mx, top); ctx.lineTo(mx + 34 + Math.sin(t * 8) * 4, top + 10); ctx.lineTo(mx, top + 20); ctx.fill(); }
    if (o.actor){ const st = Object.assign({}, o.ast, { x: o.ax != null ? o.ax : -w * .2 }); r = drawActor(ctx, th, o.actor, st, t, h * .2, o.sc || .34); }
    ctx.beginPath(); ctx.moveTo(-w / 2, -h * .5); ctx.lineTo(w / 2 + 8, -h * .62); ctx.quadraticCurveTo(w * .4, h * .55, w * .22, h * .55); ctx.lineTo(-w * .3, h * .55); ctx.quadraticCurveTo(-w * .46, h * .4, -w / 2, -h * .5); ctx.closePath();
    ctx.fillStyle = o.hull || WOOD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(-w * .44, -h * .3, w * .86, h * .12);
    if (o.label){ const z = wrapFit(ctx, th, o.label, w * .74, 24, 800, 1, 14); font(ctx, 800, z.size, th.fam); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(z.lines[0] || "", 0, h * .3); ctx.textAlign = "left"; }
    ctx.restore();
    return r ? { headX: o.x + r.headX * Math.cos(o.rock || 0), headTop: o.y + r.headTop } : null;
  }

  /* =============== lighthouse: night sea, beam sweeps then lands on each cued buoy; the goal buoy stays lit and a boat sails to it ===============
     f: headline, highlight, items:[{label, icon, cue, bad, goal}] (max 4), actor (sailor in the boat) */
  const LH = { x: 225, lamp: 0 };
  const lhPos = (n, top) => { const y0 = Math.max(top + 380, 990); return n <= 2 ? [[600, y0 + 20], [850, y0 + 150]] : n === 3 ? [[590, y0], [860, y0 + 60], [700, y0 + 200]] : [[560, y0 - 10], [850, y0], [600, y0 + 190], [880, y0 + 200]]; };
  function lhTimes(s, f, i){ return (f.items || []).slice(0, 4).map((it, k) => at(s, it.cue, .15 + k * .2, i)); }
  TT.layout("lighthouse", "Mercusuar", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), items = (f.items || []).slice(0, 4), T = lhTimes(s, f), pos = lhPos(items.length, top), horizon = top + 330;
    const lx = LH.x, ly = top + 175, seaY = horizon;
    // beam angle
    const idle = tt => .32 + Math.sin(tt * 1.3) * .42;
    const tgt = k => Math.atan2(pos[k][1] - ly, pos[k][0] - lx);
    let ang = idle(t), cur = -1; const ord = items.map((x, k) => k).sort((a, b) => T[a] - T[b]);
    ord.forEach((k, j) => { const Tk = T[k]; if (t < Tk) return; const from = j === 0 ? idle(Tk) : tgt(ord[j - 1]); ang = lerp(from, tgt(k), easeIO(clamp((t - Tk) / .7, 0, 1))); cur = k; });
    if (cur >= 0) ang += Math.sin(t * 3) * .01;
    const gk = items.findIndex(it => it.goal), gT = gk >= 0 ? T[gk] : 1e9, sailT = gT + 1, cueTop = cur >= 0 && t > T[cur] + .55;
    const boatHome = [430, BOT - 52], boatTo = gk >= 0 && items.length < 4 ? [pos[gk][0] - 150, pos[gk][1] + 70] : boatHome, bp = easeIO(clamp((t - sailT) / 2.4, 0, 1));
    const bx = lerp(boatHome[0], boatTo[0], bp), by = lerp(boatHome[1], boatTo[1], bp) + Math.sin(t * 2.2) * 4;
    const sailor = act(f.actor || SAILOR, s, t, 0, gk >= 0 ? [{ at: gT + .6, pose: "point", expr: "happy" }, { at: sailT + 2.6, pose: "cheer", emote: "sparkle" }] : []);
    let boatHead = null;
    frame(ctx, th, top, t, () => {
      skyFill(ctx, top, seaY, "#1E2A3A", "#3B4C60"); stars(ctx, top, seaY - 40, t, 22);
      ctx.beginPath(); ctx.arc(860, top + 90, 38, 0, TAU); ctx.fillStyle = "#FFF1C9"; ctx.fill(); ctx.beginPath(); ctx.arc(876, top + 80, 34, 0, TAU); ctx.fillStyle = "#2A3747"; ctx.fill();
      sea(ctx, seaY, t, "#1F4E5E", "#123540", 5);
      // beam
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang); const L = 1000, sp = .11;
      const bg = ctx.createLinearGradient(0, 0, L, 0); bg.addColorStop(0, "rgba(255,226,150,.75)"); bg.addColorStop(1, "rgba(255,226,150,0)");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(L, -L * sp); ctx.lineTo(L, L * sp); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill(); ctx.restore();
      // buoys
      items.forEach((it, k) => { const [x, y0] = pos[k], y = y0 + Math.sin(t * 2 + k * 1.3) * 6, seen = t >= T[k], lit = seen && (k === cur || it.goal || !it.bad), q = seen ? eBack(clamp((t - T[k]) / .5, 0, 1)) : 0;
        if (seen && k === cur){ const g = ctx.createRadialGradient(x, y, 0, x, y, 120); g.addColorStop(0, "rgba(255,226,150,.55)"); g.addColorStop(1, "rgba(255,226,150,0)"); ctx.fillStyle = g; ctx.fillRect(x - 120, y - 120, 240, 240); }
        if (it.goal && t > T[k] + .6){ ctx.strokeStyle = hexA(GOLD, .5 + .3 * Math.sin(t * 5)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y - 30, 58 + Math.sin(t * 4) * 5, 0, TAU); ctx.stroke(); }
        ctx.fillStyle = lit ? "#FFFFFF" : "#3A4B5B"; ctx.beginPath(); ctx.moveTo(x - 30, y + 8); ctx.lineTo(x + 30, y + 8); ctx.lineTo(x + 20, y - 34); ctx.lineTo(x - 20, y - 34); ctx.closePath(); ctx.fill();
        ctx.fillStyle = lit ? RED : "#2E3D4B"; ctx.fillRect(x - 25, y - 16, 50, 12);
        ctx.beginPath(); ctx.arc(x, y - 58, 30, 0, TAU); ctx.fillStyle = lit ? (it.bad ? "#8C8476" : (it.goal ? GREEN : ORANGE)) : "#2E3D4B"; ctx.fill(); ctx.strokeStyle = lit ? "#fff" : "#4A5C6C"; ctx.lineWidth = 4; ctx.stroke();
        if (q > 0) icon(ctx, it.icon || (it.bad ? "alert" : "star"), x - 17, y - 75, 34, "#fff", 2.4);
        ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.ellipse(x, y + 12, 44, 8, 0, 0, TAU); ctx.fill(); });
      // boat with sailor
      boatHead = boat(ctx, th, { x: bx, y: by, w: 150, rock: Math.sin(t * 2.1) * .05, actor: sailor.A, ast: sailor.st, sc: .26, ax: -10 }, t);
      // lighthouse
      ctx.fillStyle = "#3F4A44"; ctx.beginPath(); ctx.moveTo(X0, BOT); ctx.lineTo(X0, BOT - 70); ctx.quadraticCurveTo(160, BOT - 120, 260, BOT - 100); ctx.quadraticCurveTo(340, BOT - 90, 370, BOT); ctx.closePath(); ctx.fill();
      const tb = BOT - 95, tt0 = ly + 60;
      ctx.beginPath(); ctx.moveTo(lx - 62, tb); ctx.lineTo(lx - 40, tt0); ctx.lineTo(lx + 40, tt0); ctx.lineTo(lx + 62, tb); ctx.closePath(); ctx.fillStyle = "#FFFDF7"; ctx.fill(); ctx.save(); ctx.clip();
      ctx.fillStyle = RED; for (let k = 0; k < 4; k++){ const yy = tt0 + 40 + k * ((tb - tt0) / 4); ctx.fillRect(lx - 80, yy, 160, (tb - tt0) / 8); } ctx.restore();
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lx - 62, tb); ctx.lineTo(lx - 40, tt0); ctx.lineTo(lx + 40, tt0); ctx.lineTo(lx + 62, tb); ctx.stroke();
      rr(ctx, lx - 22, tb - 70, 44, 70, 20); ctx.fillStyle = WOOD2; ctx.fill();
      ctx.fillStyle = INK; ctx.fillRect(lx - 58, tt0 - 8, 116, 14);
      rr(ctx, lx - 34, ly - 38, 68, 52, 8); ctx.fillStyle = "#FFE9A8"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      const lg = ctx.createRadialGradient(lx, ly - 10, 0, lx, ly - 10, 90); lg.addColorStop(0, "rgba(255,236,170,.9)"); lg.addColorStop(1, "rgba(255,236,170,0)"); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly - 10, 90, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(lx - 46, ly - 38); ctx.quadraticCurveTo(lx, ly - 96, lx + 46, ly - 38); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = INK; ctx.stroke();
    });
    // labels (outside clip so shadows render cleanly)
    const mw = items.length > 3 ? 250 : 300;
    items.forEach((it, k) => { if (t < T[k]) return; const [x, y] = pos[k], q = eBack(clamp((t - T[k] - .15) / .4, 0, 1)), past = k !== cur && it.bad;
      const lab = tag(ctx, th, it.label, x, y + 58, mw, { size: 28, k: q, bg: past ? "#E7E1D8" : "#FFFFFF", fg: past ? "#8C8476" : INK, stroke: it.goal && t > T[k] + .6 ? GREEN : (k === cur ? GOLD : null), lw: 5, strike: past });
      if (past) badge(ctx, lab.cx + lab.w / 2 - 6, y + 34, 18, q, false);
      if (it.goal) { badge(ctx, x + 34, y - 92, 22, eBack(clamp((t - T[k] - .6) / .4, 0, 1)), true); burst(ctx, x, y - 50, t - T[k] - .6, M, 12); } });
    if (boatHead && sailor.st.emote) emoteAt(ctx, th, sailor.st.emote, boatHead.headX, boatHead.headTop - 30, t - sailor.st.emoteT, t);
  }, (s, f, i, add) => { const T = lhTimes(s, f, i); add(.15, "whoosh"); (f.items || []).slice(0, 4).forEach((it, k) => { add(T[k], it.goal ? "chime" : it.bad ? "ping" : "pop"); }); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* =============== sailboat: winds (labelled gusts) push the boat toward the goal island; bad winds push it back ===============
     f: headline, highlight, boat (hull label), actor, winds:[{label, cue, bad}], goal:{label, icon} */
  function sbTimes(s, f, i){ return (f.winds || []).slice(0, 4).map((w, k) => at(s, w.cue, .12 + k * .22, i)); }
  TT.layout("sailboat", "Perahu layar", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), winds = (f.winds || []).slice(0, 4), T = sbTimes(s, f), seaY = top + 470, goal = f.goal;
    const nGood = winds.filter(w => !w.bad).length || 1, x0 = 250, x1 = goal ? 640 : 760;
    let good = 0, back = 0, active = -1, rock = 0, belly = .2, dir = 1;
    winds.forEach((w, k) => { if (t < T[k]) return; const p = easeIO(clamp((t - T[k]) / 1.8, 0, 1));
      if (w.bad){ const pb = Math.sin(clamp((t - T[k]) / 2.2, 0, 1) * Math.PI); back = Math.max(back, pb); } else good += p;
      if (t - T[k] < 2.2){ active = k; belly = w.bad ? -.6 : 1; dir = w.bad ? -1 : 1; rock = w.bad ? Math.sin((t - T[k]) * 9) * .1 * (1 - (t - T[k]) / 2.2) : -.06 * Math.sin(clamp((t - T[k]) / 1.8, 0, 1) * Math.PI); } });
    const prog2 = good / nGood, arrived = goal && prog2 > .999, arrT = arrived ? T[winds.reduce((m, w, k) => w.bad ? m : k, 0)] + 1.8 : 1e9;
    const bx = lerp(x0, x1, prog2) - back * 90, by = seaY + 48 + Math.sin(t * 2) * 6;
    const extra = []; winds.forEach((w, k) => extra.push(w.bad ? { at: T[k] + .1, expr: "worried", emote: "sweat", pose: "stand" } : { at: T[k] + .1, expr: "smile", pose: "point" }));
    if (arrived) extra.push({ at: arrT, pose: "cheer", expr: "happy", emote: "sparkle" });
    const sailor = act(f.actor || SAILOR, s, t, 0, extra); let head = null;
    frame(ctx, th, top, t, () => {
      skyFill(ctx, top, seaY, "#BFE0EA", "#FBEBD6"); cloud(ctx, 640 + Math.sin(t * .3) * 20, top + 70, 1, .9); cloud(ctx, 380 + Math.sin(t * .2 + 2) * 30, top + 150, .8, .75);
      ctx.beginPath(); ctx.arc(900, top + 80, 44, 0, TAU); ctx.fillStyle = "#FFD98A"; ctx.fill();
      // island
      if (goal){ const ix = 860, iy = seaY + 20; ctx.fillStyle = "#E8C98E"; ctx.beginPath(); ctx.ellipse(ix, iy + 10, 150, 46, 0, Math.PI, TAU); ctx.fill();
        ctx.strokeStyle = "#7A5A2E"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(ix + 40, iy - 20); ctx.quadraticCurveTo(ix + 60, iy - 110, ix + 30, iy - 190); ctx.stroke();
        ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 5; k++){ ctx.save(); ctx.translate(ix + 30, iy - 190); ctx.rotate(-2.3 + k * .9 + Math.sin(t * 1.4 + k) * .06); ctx.beginPath(); ctx.ellipse(0, -48, 16, 52, 0, 0, TAU); ctx.fill(); ctx.restore(); }
        ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ix - 60, iy - 10); ctx.lineTo(ix - 60, iy - 150); ctx.stroke();
        const wv = Math.sin(t * 6) * 6; ctx.fillStyle = arrived && t > arrT ? GREEN : ORANGE; ctx.beginPath(); ctx.moveTo(ix - 60, iy - 150); ctx.quadraticCurveTo(ix - 10, iy - 140 + wv, ix + 20, iy - 128); ctx.lineTo(ix - 60, iy - 104); ctx.closePath(); ctx.fill(); }
      sea(ctx, seaY, t, "#5FA8B8", "#2F6F73", 6);
      // gust streaks
      winds.forEach((w, k) => { const lt = t - T[k]; if (lt < 0 || lt > 2.2) return; const a = Math.sin(clamp(lt / 2.2, 0, 1) * Math.PI);
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = w.bad ? "rgba(216,67,21,.8)" : "rgba(255,255,255,.95)"; ctx.lineWidth = 7; ctx.lineCap = "round";
        for (let j = 0; j < 6; j++){ const yy = top + 190 + j * 46, ph = ((lt * 520 + j * 130) % 1100), xx = w.bad ? X1 + 100 - ph : X0 - 100 + ph, d = w.bad ? -1 : 1;
          ctx.beginPath(); ctx.moveTo(xx - d * 150, yy); ctx.quadraticCurveTo(xx - d * 60, yy - 14, xx, yy); ctx.stroke(); ctx.beginPath(); ctx.arc(xx + d * 10, yy - 14, 12, d > 0 ? Math.PI * .5 : Math.PI * .5, d > 0 ? Math.PI * 2 : -Math.PI, d < 0); ctx.stroke(); }
        ctx.restore(); });
      head = boat(ctx, th, { x: bx, y: by, w: 250, rock, sail: true, belly, dir, label: f.boat, actor: sailor.A, ast: sailor.st, sc: .36, ax: -62 }, t);
      waveFront(ctx, seaY + 70, t, "rgba(47,111,115,.55)");
    });
    // wind chips (top-left stack) and goal pill
    winds.forEach((w, k) => { if (t < T[k]) return; chip(ctx, th, w.label, X0 + 22, top + 46 + k * 62, 520, w.bad ? "no" : "plus", eBack(clamp((t - T[k]) / .4, 0, 1))); });
    if (goal){ const ix = 860, iy = seaY + 20, ok = arrived && t > arrT, q = popS(t, .35);
      tag(ctx, th, goal.label, ix - 30, iy - 210, 300, { size: 28, k: q, bg: ok ? GREEN : "#FFFFFF", fg: ok ? "#fff" : INK, stroke: ok ? null : ORANGE });
      if (ok){ burst(ctx, ix - 30, iy - 210, t - arrT, M, 12); } }
    if (head && sailor.st.emote) emoteAt(ctx, th, sailor.st.emote, head.headX, head.headTop - 30, t - sailor.st.emoteT, t);
  }, (s, f, i, add) => { const T = sbTimes(s, f, i); (f.winds || []).slice(0, 4).forEach((w, k) => add(T[k], w.bad ? "ping" : "whoosh"));
    const ws = (f.winds || []).slice(0, 4); if (f.goal && ws.some(w => !w.bad)){ const last = ws.reduce((m, w, k) => w.bad ? m : k, 0); add(T[last] + 1.8, "chime"); } },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* =============== anchor: currents (labelled) make the boat drift and rock; the anchor drops to the seabed and the boat steadies ===============
     f: headline, highlight, boat (hull label), actor, drifts:[{label, cue}], anchor:{label, cue} */
  function anTimes(s, f, i){ return { d: (f.drifts || []).slice(0, 3).map((d, k) => at(s, d.cue, .1 + k * .2, i)), a: f.anchor ? at(s, f.anchor.cue, .7, i) : 1e9 }; }
  TT.layout("anchor", "Jangkar", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), drifts = (f.drifts || []).slice(0, 3), TM = anTimes(s, f), seaY = top + 250, bedY = BOT - 70;
    const aT = TM.a, hold = t > aT;
    // drift offset: each current pushes the boat (alternating), anchor pulls it back to centre
    let off = 0, sway = .04; drifts.forEach((d, k) => { if (t < TM.d[k]) return; const p = easeIO(clamp((t - TM.d[k]) / 1.6, 0, 1)); off += (k % 2 ? -1 : 1) * 170 * p * (k ? 1.4 : 1) * (TM.d[k] < aT ? 1 : 0); sway += .05; });
    const offA = (() => { let o = 0; drifts.forEach((d, k) => { if (aT < TM.d[k]) return; o += (k % 2 ? -1 : 1) * 170 * easeIO(clamp((aT - TM.d[k]) / 1.6, 0, 1)) * (k ? 1.4 : 1); }); return o; })();
    const back = hold ? easeIO(clamp((t - aT - .9) / 1.2, 0, 1)) : 0;
    off = hold ? offA * (1 - back) : off; if (hold) sway = lerp(sway, .015, back);
    const bx = clamp(540 + off, 260, 820), by = seaY + 10 + Math.sin(t * 2.2) * (hold ? 3 : 8), rock = Math.sin(t * 2.6) * sway;
    const extra = []; drifts.forEach((d, k) => { if (TM.d[k] < aT) extra.push({ at: TM.d[k] + .2, expr: "worried", emote: k === 0 ? "sweat" : "!" }); });
    if (f.anchor) extra.push({ at: aT + 1.2, expr: "smile", pose: "thumbs", emote: "check" });
    const sailor = act(f.actor || SAILOR, s, t, 0, extra); let head = null;
    const drop = hold ? clamp((t - aT) / .9, 0, 1) : 0, ay = lerp(by + 30, bedY - 30, drop * drop);
    frame(ctx, th, top, t, () => {
      skyFill(ctx, top, seaY, "#CFE7EE", "#FBEBD6"); cloud(ctx, 300 + Math.sin(t * .3) * 20, top + 80, 1, .9); cloud(ctx, 780, top + 120, .8, .8);
      const g = ctx.createLinearGradient(0, seaY, 0, BOT); g.addColorStop(0, "#5FA8B8"); g.addColorStop(1, "#1F4E5E"); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(X0, BOT); for (let x = X0; x <= X1; x += 20) ctx.lineTo(x, seaY + Math.sin(x * .02 + t * 2) * 7); ctx.lineTo(X1, BOT); ctx.closePath(); ctx.fill();
      // light rays + bubbles
      ctx.fillStyle = "rgba(255,255,255,.06)"; for (let k = 0; k < 4; k++){ ctx.beginPath(); ctx.moveTo(200 + k * 220, seaY); ctx.lineTo(260 + k * 220, seaY); ctx.lineTo(200 + k * 220 + 120, BOT); ctx.lineTo(200 + k * 220 + 20, BOT); ctx.fill(); }
      for (let k = 0; k < 10; k++){ const q = ((t * .25 + k * .137) % 1), x = X0 + 40 + (k * 97) % 820, y = bedY - q * (bedY - seaY - 30); ctx.strokeStyle = `rgba(255,255,255,${.4 * (1 - q)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + Math.sin(t * 2 + k) * 6, y, 5 + k % 3 * 2, 0, TAU); ctx.stroke(); }
      // seabed
      ctx.fillStyle = "#D9B98A"; ctx.beginPath(); ctx.moveTo(X0, BOT); ctx.lineTo(X0, bedY + 10); for (let x = X0; x <= X1; x += 60) ctx.quadraticCurveTo(x + 30, bedY - 8 + (x % 120 ? 6 : -4), x + 60, bedY + 8); ctx.lineTo(X1, BOT); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#3E7D4F"; [[170, 1], [930, -1], [760, 1]].forEach(([x, d], k) => { for (let j = 0; j < 3; j++){ ctx.save(); ctx.translate(x + j * 14, bedY + 6); ctx.rotate(Math.sin(t * 1.5 + j + k) * .15 * d); ctx.beginPath(); ctx.ellipse(0, -40, 8, 42, 0, 0, TAU); ctx.fill(); ctx.restore(); } });
      // currents
      drifts.forEach((d, k) => { const lt = t - TM.d[k]; if (lt < 0) return; const yy = seaY + 110 + k * 95, dirn = k % 2 ? -1 : 1, a = lt < 2.6 ? 1 : .35;
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 6; ctx.lineCap = "round";
        for (let j = 0; j < 4; j++){ const ph = ((lt * 260 + j * 230) % 920), xx = dirn > 0 ? X0 + ph : X1 - ph; ctx.beginPath(); ctx.moveTo(xx - dirn * 90, yy); ctx.bezierCurveTo(xx - dirn * 60, yy - 18, xx - dirn * 30, yy + 18, xx, yy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(xx - dirn * 14, yy - 12); ctx.lineTo(xx, yy); ctx.lineTo(xx - dirn * 14, yy + 12); ctx.stroke(); }
        ctx.restore(); });
      // chain + anchor
      if (hold){ const AX = t - aT < .9 ? bx : lerp(bx, 540, 1);
        ctx.strokeStyle = "#5A5348"; ctx.lineWidth = 6; ctx.setLineDash([12, 6]); ctx.beginPath(); ctx.moveTo(bx + 40, by + 20); ctx.quadraticCurveTo((bx + AX) / 2 + 30 * (1 - back), (by + ay) / 2 + 40, AX, ay - 50); ctx.stroke(); ctx.setLineDash([]);
        ctx.save(); ctx.translate(AX, ay); ctx.rotate(t - aT < .9 ? Math.sin(t * 10) * .2 : 0); ctx.strokeStyle = "#4A4A4A"; ctx.lineWidth = 12; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(0, 22); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -2, 36, .15 * Math.PI, .85 * Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-22, -30); ctx.lineTo(22, -30); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -60, 10, 0, TAU); ctx.stroke(); ctx.restore();
        if (t - aT > .9 && t - aT < 2.2){ const q = (t - aT - .9) / 1.3; puff(ctx, AX - 40 - q * 40, bedY, 16 + q * 14, .6 * (1 - q)); puff(ctx, AX + 40 + q * 40, bedY, 16 + q * 14, .6 * (1 - q)); } }
      head = boat(ctx, th, { x: bx, y: by, w: 230, rock, label: f.boat, actor: sailor.A, ast: sailor.st, sc: .36, ax: -20 }, t);
      waveFront(ctx, seaY + 26, t, "rgba(95,168,184,.55)");
    });
    // drift labels ride the current then settle
    drifts.forEach((d, k) => { const lt = t - TM.d[k]; if (lt < 0) return; const dirn = k % 2 ? -1 : 1, yy = seaY + 110 + k * 95, p = easeOutQ(clamp(lt / 1.2, 0, 1)), fx = dirn > 0 ? 300 : 790, sx = dirn > 0 ? 120 : 960;
      ctx.save(); if (hold && t > aT + 1) ctx.globalAlpha *= .6; tag(ctx, th, d.label, lerp(sx, fx, p), yy, 360, { size: 28, k: clamp(lt * 4, 0, 1), bg: "#FFFFFF", stroke: hold && t > aT + 1 ? null : "#8FC3D0" }); ctx.restore(); });
    if (f.anchor && hold && t > aT + .9){ const q = eBack(clamp((t - aT - .9) / .45, 0, 1)); tag(ctx, th, f.anchor.label, 540 + 70 + 170, bedY - 52, 380, { size: 30, k: q, bg: GREEN, fg: "#fff" }); burst(ctx, 540, bedY - 40, t - aT - .9, M, 10); }
    if (head) overlay(ctx, th, { st: sailor.st, r: head }, t);
  }, (s, f, i, add) => { const TM = anTimes(s, f, i); TM.d.forEach(T => add(T, "whoosh")); if (f.anchor){ add(TM.a, "whoosh"); add(TM.a + .9, "pop"); add(TM.a + 1.3, "chime"); } },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);
  function easeOutQ(p){ return 1 - (1 - p) * (1 - p); }

  /* =============== campfire: logs (labelled) make the fire grow; rain/wind (labelled) calm or shrink it; actors sit around ===============
     f: headline, highlight, title, level (0-1 start), logs:[{label, cue, delta, fx:"rain"|"wind", bad}], actors:[actor] (max 2), result:{label, cue} */
  function cfTimes(s, f, i){ return { l: (f.logs || []).slice(0, 4).map((l, k) => at(s, l.cue, .15 + k * .2, i)), r: f.result ? at(s, f.result.cue, .85, i) : 1e9 }; }
  function flame(ctx, x, y, w, h, t, col, k){ const fl = Math.sin(t * 9 + k) * .08 + Math.sin(t * 15 + k * 2) * .05; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - w / 2, y);
    ctx.bezierCurveTo(x - w / 2, y - h * .45, x - w * .15 + fl * w, y - h * .6, x + fl * w * 1.5, y - h); ctx.bezierCurveTo(x + w * .2 + fl * w, y - h * .6, x + w / 2, y - h * .45, x + w / 2, y); ctx.closePath(); ctx.fill(); }
  TT.layout("campfire", "Api unggun", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), logs = (f.logs || []).slice(0, 4), TM = cfTimes(s, f), gy = BOT - 70, fx = 540, fy = gy - 20;
    let lvl = f.level != null ? f.level : .5; logs.forEach((l, k) => { const lt = t - TM.l[k] - (l.delta < 0 ? .3 : .75); if (lt < 0) return; lvl += (l.delta || .25) * easeIO(clamp(lt / 1.1, 0, 1)); }); lvl = clamp(lvl, 0, 1);
    const wild = clamp((lvl - .75) / .25, 0, 1), H = 40 + lvl * 250, Wd = 60 + lvl * 120;
    const acts = (f.actors || []).slice(0, 2).map((a, k) => { const auto = a.keys && a.keys.some(q => q.expr) ? null : (lvl > .55 ? (wild > .5 ? "worried" : "smile") : lvl < .25 ? "tired" : "neutral");
      const o = act(Object.assign({ face: k ? -1 : 1, pose: "rest", sit: true }, a), s, t, k ? 840 : 240); if (auto && !o.st.say) o.st.expr = auto; return o; });
    const heads = [];
    frame(ctx, th, top, t, () => {
      skyFill(ctx, top, gy, "#1C2330", "#33303A"); stars(ctx, top, gy - 200, t, 24);
      ctx.fillStyle = "#2C3A2E"; ctx.beginPath(); ctx.moveTo(X0, gy); for (let x = X0; x <= X1; x += 45) ctx.lineTo(x, gy - 60 - ((x * 7) % 50) - (x % 90 ? 0 : 40)); ctx.lineTo(X1, gy); ctx.fill();
      ctx.fillStyle = "#3A2F28"; ctx.fillRect(X0, gy, X1 - X0, BOT - gy);
      const R0 = 140 + lvl * 380, gl = ctx.createRadialGradient(fx, fy - 60, 0, fx, fy - 60, R0); gl.addColorStop(0, `rgba(255,170,80,${.2 + lvl * .4})`); gl.addColorStop(1, "rgba(255,170,80,0)"); ctx.fillStyle = gl; ctx.fillRect(X0, top, X1 - X0, BOT - top);
      // log seats + actors
      acts.forEach(({ A, st }, k) => { const sx = st.x, sy = gy - 112 * (A.scale || .62) - 6; rr(ctx, sx - 80, sy, 160, 50, 24); ctx.fillStyle = WOOD2; ctx.fill(); ctx.beginPath(); ctx.ellipse(sx + (k ? -80 : 80), sy + 25, 12, 24, 0, 0, TAU); ctx.fillStyle = "#D9A066"; ctx.fill();
        const r = drawActor(ctx, th, A, st, t, gy, A.scale || .62); heads.push({ st, r }); });
      // stones + logs
      for (let k = 0; k < 9; k++){ const a = Math.PI + k * Math.PI / 8; ctx.beginPath(); ctx.ellipse(fx + Math.cos(a) * 110, fy + 18 + Math.sin(a) * -10, 26, 16, 0, 0, TAU); ctx.fillStyle = k % 2 ? "#8C8476" : "#A39B8C"; ctx.fill(); }
      [[-.35, 0], [.35, 0], [0, 1]].forEach(([r0, d]) => { ctx.save(); ctx.translate(fx, fy + 4); ctx.rotate(r0); rr(ctx, -95, -14, 190, 28, 14); ctx.fillStyle = d ? "#6E3B22" : WOOD2; ctx.fill(); ctx.restore(); });
      const emb = ctx.createRadialGradient(fx, fy, 0, fx, fy, 90); emb.addColorStop(0, `rgba(255,120,40,${.5 + lvl * .4})`); emb.addColorStop(1, "rgba(255,120,40,0)"); ctx.fillStyle = emb; ctx.fillRect(fx - 90, fy - 60, 180, 120);
      if (lvl > .04){ const j = 1 + wild * .25 * Math.sin(t * 23);
        flame(ctx, fx, fy, Wd, H * j, t, "#E8582A", 0); flame(ctx, fx - Wd * .25, fy, Wd * .6, H * .7 * j, t * 1.1, "#F07A2E", 1.3); flame(ctx, fx + Wd * .25, fy, Wd * .6, H * .75, t * 1.2, "#F07A2E", 2.6);
        flame(ctx, fx, fy, Wd * .62, H * .62, t * 1.3, "#F4A85C", 4); flame(ctx, fx, fy, Wd * .32, H * .34, t * 1.5, "#FFE08A", 5); }
      // sparks / smoke
      for (let k = 0; k < 8; k++){ const q = ((t * .6 + k * .13) % 1); if (lvl > .4){ ctx.fillStyle = `rgba(255,210,120,${(1 - q) * lvl})`; ctx.beginPath(); ctx.arc(fx + Math.sin(k * 7 + t * 2) * 40 * q + (k - 4) * 8, fy - H * .5 - q * 260, 4, 0, TAU); ctx.fill(); }
        if (lvl < .35) puff(ctx, fx + Math.sin(k + t) * 20 * q, fy - 30 - q * 240, 14 + q * 30, .35 * (1 - q) * (1 - lvl / .35)); }
      // incoming logs / rain / wind
      logs.forEach((l, k) => { const lt = t - TM.l[k]; if (lt < 0 || lt > 2) return; const side = k % 2 ? 1 : -1;
        if ((l.delta || .25) > 0){ if (lt > .8) return; const p = lt / .8, x = lerp(fx + side * 420, fx, p), y = qb(top + 250, top + 140, fy - 10, p);
          ctx.save(); ctx.translate(x, y); ctx.rotate(p * 5 * side); rr(ctx, -70, -16, 140, 32, 16); ctx.fillStyle = WOOD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.ellipse(66, 0, 9, 15, 0, 0, TAU); ctx.fillStyle = "#E8C08A"; ctx.fill(); ctx.restore(); }
        else if (l.fx === "wind"){ const a = Math.sin(clamp(lt / 2, 0, 1) * Math.PI); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "rgba(207,231,238,.9)"; ctx.lineWidth = 6; ctx.lineCap = "round";
          for (let j = 0; j < 3; j++){ const yy = fy - 230 + j * 60, xx = X0 + ((lt * 300 + j * 140) % 700); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.bezierCurveTo(xx + 80, yy - 30, xx + 140, yy + 30, xx + 200, yy); ctx.arc(xx + 200, yy - 18, 18, Math.PI * .5, -Math.PI * .5, true); ctx.stroke(); } ctx.restore(); }
        else { const a = Math.sin(clamp(lt / 2, 0, 1) * Math.PI); ctx.save(); ctx.globalAlpha *= a; cloud(ctx, fx, fy - H - 120, 1.6, .95); ctx.strokeStyle = "#8FC3D0"; ctx.lineWidth = 5; ctx.lineCap = "round";
          for (let j = 0; j < 9; j++){ const q = ((lt * 1.6 + j * .37) % 1), xx = fx - 80 + (j * 23) % 170, yy = fy - H - 90 + q * (H + 60); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx - 4, yy + 18); ctx.stroke(); } ctx.restore(); } });
    });
    // chips: positives left, negatives right
    let li = 0, ri = 0; logs.forEach((l, k) => { const lt = t - TM.l[k]; if (lt < 0) return; const pos = (l.delta || .25) > 0, row = pos ? li++ : ri++, y = top + 150 + row * 66, q = eBack(clamp(lt / .45, 0, 1));
      chip(ctx, th, l.label, pos ? X0 + 20 : X1 - 20, y, 360, l.bad ? "no" : pos ? "plus" : "minus", q, { right: !pos }); });
    // title / result
    const rT = TM.r, done = t > rT, txt = done ? f.result.label : f.title, rb = done && f.result.bad;
    if (txt){ const q = done ? eBack(clamp((t - rT) / .45, 0, 1)) : popS(t, .3); tag(ctx, th, txt, 540, top + 62, 420, { size: 32, k: q, bg: done ? (rb ? RED : GREEN) : "#FFFFFF", fg: done ? "#fff" : INK, stroke: done ? null : ORANGE }); if (done && !rb) burst(ctx, 540, top + 62, t - rT, M, 12); }
    heads.forEach(h => overlay(ctx, th, h, t));
  }, (s, f, i, add) => { const TM = cfTimes(s, f, i); (f.logs || []).slice(0, 4).forEach((l, k) => { add(TM.l[k], "whoosh"); if ((l.delta || .25) > 0) add(TM.l[k] + .8, "pop"); }); if (f.result) add(TM.r, "chime"); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* =============== backpack: actor tosses items toward the open bag; accepted ones drop in, rejected ones bounce out; zip closes it ===============
     f: headline, highlight, bag (label), actor, items:[{label, icon, cue, out}] (max 5), zipCue */
  function bpTimes(s, f, i){ return { it: (f.items || []).slice(0, 5).map((it, k) => at(s, it.cue, .1 + k * .17, i)), z: f.zipCue ? at(s, f.zipCue, .9, i) : 1e9 }; }
  TT.layout("backpack", "Ransel", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), items = (f.items || []).slice(0, 5), TM = bpTimes(s, f), gy = BOT - 70, bx = 500, bw = 250, bh = 290, btop = gy - bh, mouth = [bx, btop + 18];
    const zT = TM.z, zp = clamp((t - zT) / .5, 0, 1), inN = items.filter((it, k) => !it.out && t > TM.it[k] + .8).length;
    const extra = []; items.forEach((it, k) => { extra.push({ at: TM.it[k] - .25, pose: "work" }, { at: TM.it[k] + .45, pose: "stand" }); if (it.out) extra.push({ at: TM.it[k] + 1, shake: true, expr: "confused" }); else extra.push({ at: TM.it[k] + 1, expr: "smile" }); });
    if (f.zipCue) extra.push({ at: zT + .4, pose: "thumbs", expr: "happy", emote: "check" });
    const who = act(f.actor || { hair: "hijab", hijab: "#A0522D", shirt: "#2F6F73", skin: "a" }, s, t, 200, extra); let r = null;
    const hand = [300, gy - 300];
    frame(ctx, th, top, t, () => {
      room(ctx, top, gy);
      r = drawActor(ctx, th, who.A, who.st, t, gy, .78);
      // bag (wiggle on each landing)
      let wig = 0; items.forEach((it, k) => { const lt = t - TM.it[k] - .8; if (lt > 0 && lt < .6) wig += Math.sin(lt * 25) * .04 * (1 - lt / .6); });
      if (zp > 0 && zp < 1) wig += Math.sin(zp * 20) * .03; const hop = t > zT + .5 && t < zT + 1.1 ? -Math.sin((t - zT - .5) / .6 * Math.PI) * 30 : 0;
      const sx = 1 + inN * .035;
      ctx.save(); ctx.translate(bx, gy + hop); ctx.rotate(wig); ctx.scale(sx, 1);
      ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.beginPath(); ctx.ellipse(0, -hop + 4, bw * .55, 14, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#1F4E50"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-60, -bh + 10); ctx.quadraticCurveTo(0, -bh - 70, 60, -bh + 10); ctx.stroke();
      rr(ctx, -bw / 2, -bh, bw, bh, 60); ctx.fillStyle = TEAL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = "#1F2A2A"; ctx.beginPath(); ctx.ellipse(0, -bh + 22, bw * .4 * (1 - zp), 22 * (1 - zp) + .1, 0, 0, TAU); ctx.fill();
      // items peeking out
      for (let k = 0; k < Math.min(inN, 4); k++){ if (zp >= 1) break; ctx.fillStyle = [ORANGE, GOLD, "#E89544", CREAM][k]; rr(ctx, -70 + k * 38, -bh + 2 - (k % 2) * 14, 30, 34, 6); ctx.fill(); }
      // flap
      const fh = 40 + zp * 80; rr(ctx, -bw * .46, -bh - 6, bw * .92, fh, 40); ctx.fillStyle = "#25585B"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      if (zp > .5){ rr(ctx, -16, -bh - 6 + fh - 26, 32, 30, 6); ctx.fillStyle = GOLD; ctx.fill(); }
      rr(ctx, -bw * .36, -bh * .48, bw * .72, bh * .36, 26); ctx.fillStyle = "#25585B"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      if (f.bag){ const z = wrapFit(ctx, th, f.bag, bw * .64, 26, 800, 2, 16); font(ctx, 800, z.size, th.fam); ctx.fillStyle = CREAM; ctx.textAlign = "center"; z.lines.forEach((l, j) => ctx.fillText(l, 0, -bh * .3 + (j - (z.lines.length - 1) / 2) * z.size * 1.1 + z.size * .36)); ctx.textAlign = "left"; }
      ctx.restore();
      // rejected items on the floor
      items.forEach((it, k) => { if (!it.out) return; const lt = t - TM.it[k] - .8; if (lt < 0) return; const p = clamp(lt / .9, 0, 1), fxp = 830 + (k % 2) * 70, x = qb(mouth[0], 720, fxp, p), y = qb(mouth[1], top + 140, gy - 40, p);
        ctx.save(); if (p >= 1) ctx.globalAlpha *= .7; tile(ctx, th, it.icon, x, y, 78, p * 4 + (p >= 1 ? .3 : 0), "#8C8476"); ctx.restore(); if (p >= 1) badge(ctx, x + 36, y - 36, 18, eBack(clamp((lt - .9) / .3, 0, 1)), false); });
    });
    // flying items with labels
    items.forEach((it, k) => { const lt = t - TM.it[k]; if (lt < 0 || lt > .8 + (it.out ? 0 : .25)) return; const p = clamp(lt / .8, 0, 1), x = qb(hand[0], 420, mouth[0], p), y = qb(hand[1], top + 120, mouth[1] - 10, p), sc = lt > .8 ? 1 - (lt - .8) / .25 : 1;
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); tile(ctx, th, it.icon, 0, 0, 88, p * .6, it.out ? RED : ORANGE); ctx.restore();
      tag(ctx, th, it.label, x, y - 82, 330, { size: 28, k: sc * eBack(clamp(lt / .3, 0, 1)) }); });
    // list on the right
    items.forEach((it, k) => { const lt = t - TM.it[k] - .8; if (lt < 0) return; chip(ctx, th, it.label, X1 - 20, top + 60 + k * 66, 400, it.out ? "no" : "ok", eBack(clamp(lt / .4, 0, 1)), { right: true, dim: it.out, strike: it.out }); });
    if (f.zipCue && t > zT + .4){ badge(ctx, bx + 110, gy - bh - 40, 30, eBack(clamp((t - zT - .4) / .4, 0, 1)), true); burst(ctx, bx, gy - bh, t - zT - .4, M, 12); }
    overlay(ctx, th, { st: who.st, r }, t);
  }, (s, f, i, add) => { const TM = bpTimes(s, f, i); (f.items || []).slice(0, 5).forEach((it, k) => { add(TM.it[k], "whoosh"); add(TM.it[k] + .8, it.out ? "ping" : "pop"); }); if (f.zipCue) add(TM.z + .4, "chime"); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* =============== suitcase: items packed into an open suitcase, lid closes, actor pulls it away to the goal (or off-screen) ===============
     f: headline, highlight, actor, items:[{label, icon, cue}] (max 4), closeCue, goCue, goal:{label, icon}, result:{label, cue, bad} */
  function scTimes(s, f, i){ const it = (f.items || []).slice(0, 4).map((x, k) => at(s, x.cue, .1 + k * .17, i)); const c = f.closeCue ? at(s, f.closeCue, .7, i) : 1e9, g = f.goCue ? at(s, f.goCue, .78, i) : 1e9;
    return { it, c, g, r: f.result ? at(s, f.result.cue, .9, i) : 1e9 }; }
  TT.layout("suitcase", "Koper", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), items = (f.items || []).slice(0, 4), TM = scTimes(s, f), gy = BOT - 70, L = 270, D = 100, HL = 70;
    const cP = clamp((t - TM.c) / .6, 0, 1), open = 1 - easeIO(cP), gT = TM.g, goal = f.goal;
    // actor path: stand right while packing, walk to the handle, then pull to the goal / off-screen
    const axStand = 860, axGrab = 360 + L + HL + 18, axEnd = goal ? 790 : 1330, sp = 300;
    const t1 = gT + Math.abs(axStand - axGrab) / sp, t2 = t1 + .6;
    const keys = []; items.forEach((it, k) => keys.push({ at: TM.it[k] - .2, pose: "work" }, { at: TM.it[k] + .5, pose: "stand", expr: "smile" }));
    if (f.goCue) keys.push({ at: gT, x: axGrab, speed: sp }, { at: t2, x: axEnd, speed: 220 });
    if (goal) keys.push({ at: t2 + Math.abs(axEnd - axGrab) / 220 + .1, pose: "cheer", expr: "happy", emote: "sparkle", face: 1 });
    const who = act(f.actor || { hair: "short", shirt: "#544E42", skin: "b", glasses: true }, s, t, axStand, keys); let r = null;
    const ax = who.st.x, walking = t > t2;
    const hand = [ax - 34, gy - 168];
    // suitcase pivot (back-bottom wheel) + angle
    const up = clamp((t - t1) / .6, 0, 1), pullA = Math.atan2(hand[1] - gy, (L + HL)) , ang = lerp(0, pullA, easeIO(up));
    const px = walking ? hand[0] - Math.cos(pullA) * (L + HL) : 360;
    frame(ctx, th, top, t, () => {
      room(ctx, top, gy);
      if (goal){ const gx = 930; ctx.fillStyle = WOOD2; ctx.fillRect(gx - 7, gy - 330, 14, 330); rr(ctx, gx - 60, gy - 360, 120, 70, 14); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); icon(ctx, goal.icon || "pin", gx - 22, gy - 347, 44, "#fff", 2.6); }
      // suitcase
      ctx.save(); ctx.translate(px, gy - 14); ctx.rotate(ang);
      ctx.fillStyle = "rgba(0,0,0,.15)"; if (!up) { ctx.beginPath(); ctx.ellipse(L / 2, 14, L * .55, 12, 0, 0, TAU); ctx.fill(); }
      if (open > .02){ const lh = 190 * open, sp = 22 * open; const lid = (i0) => { ctx.beginPath(); ctx.moveTo(i0, -D - 2); ctx.lineTo(L - i0, -D - 2); ctx.lineTo(L + sp - i0, -D - lh + i0); ctx.lineTo(-sp + i0, -D - lh + i0); ctx.closePath(); };
        lid(0); ctx.fillStyle = "#8E2F1E"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.stroke();
        if (lh > 30){ lid(14); ctx.fillStyle = "#5A1E14"; ctx.fill(); ctx.strokeStyle = "rgba(244,217,184,.55)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(30, -D - 14); ctx.lineTo(L - 30, -D - lh + 24); ctx.moveTo(L - 30, -D - 14); ctx.lineTo(30, -D - lh + 24); ctx.stroke();
          rr(ctx, L * .3, -D - lh * .62, L * .4, lh * .3, 8); ctx.fillStyle = "rgba(244,217,184,.25)"; ctx.fill(); } }
      rr(ctx, 0, -D, L, D, 18); ctx.fillStyle = "#B23A26"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      if (open > .02){ ctx.fillStyle = "#5A1E14"; rr(ctx, 12, -D + 6, L - 24, 22 * open + 2, 8); ctx.fill();
        const n = items.filter((it, k) => t > TM.it[k] + .8).length; for (let k = 0; k < n; k++){ ctx.fillStyle = [ORANGE, GOLD, "#CFE7EE", CREAM][k]; rr(ctx, 26 + k * 58, -D - 2 - (k % 2) * 10, 48, 26, 6); ctx.fill(); } }
      else { ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.setLineDash([10, 6]); ctx.beginPath(); ctx.moveTo(10, -D + 8); ctx.lineTo(L - 10, -D + 8); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.fillRect(L * .3, -D + 30, 12, D - 40); ctx.fillRect(L * .66, -D + 30, 12, D - 40);
      [[18, 6], [L - 18, 6]].forEach(([wx, wy]) => { ctx.beginPath(); ctx.arc(wx, wy, 12, 0, TAU); ctx.fillStyle = INK; ctx.fill(); });
      if (up > 0){ const hl = HL * easeIO(up); ctx.strokeStyle = "#544E42"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(L, -D * .3); ctx.lineTo(L + hl, -D * .3); ctx.stroke(); rr(ctx, L + hl - 6, -D * .3 - 22, 14, 44, 6); ctx.fillStyle = INK; ctx.fill(); }
      ctx.restore();
      r = drawActor(ctx, th, who.A, who.st, t, gy, .78);
      // rolling dust
      if (walking && ax < axEnd - 2){ for (let k = 0; k < 3; k++){ const q = ((t * 2 + k / 3) % 1); puff(ctx, px - 10 - q * 60, gy - 6, 8 + q * 10, .5 * (1 - q)); } }
    });
    // flying items
    const dst = [490, gy - 120];
    items.forEach((it, k) => { const lt = t - TM.it[k]; if (lt < 0 || lt > 1.05) return; const p = clamp(lt / .8, 0, 1), x = qb(hand[0] - 10, 640, dst[0] + (k - 1.5) * 40, p), y = qb(gy - 250, top + 150, dst[1], p), sc = lt > .8 ? 1 - (lt - .8) / .25 : 1;
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); tile(ctx, th, it.icon, 0, 0, 84, p * .5); ctx.restore(); tag(ctx, th, it.label, x, y - 80, 330, { size: 28, k: sc * eBack(clamp(lt / .3, 0, 1)) }); });
    items.forEach((it, k) => { const lt = t - TM.it[k] - .8; if (lt < 0) return; chip(ctx, th, it.label, X0 + 20, top + 60 + k * 66, 420, "ok", eBack(clamp(lt / .4, 0, 1))); });
    if (goal){ const ok = f.goCue && t > t2 + Math.abs(axEnd - axGrab) / 220; tag(ctx, th, goal.label, 900, gy - 410, 300, { size: 28, k: popS(t, .3), bg: ok ? GREEN : "#FFFFFF", fg: ok ? "#fff" : INK, stroke: ok ? null : ORANGE });
      if (ok) burst(ctx, 900, gy - 410, t - t2 - Math.abs(axEnd - axGrab) / 220, M, 12); }
    if (f.result && t > TM.r){ const q = eBack(clamp((t - TM.r) / .45, 0, 1)); tag(ctx, th, f.result.label, 700, top + 90, 440, { size: 32, k: q, bg: f.result.bad ? RED : GREEN, fg: "#fff" }); }
    overlay(ctx, th, { st: who.st, r }, t);
  }, (s, f, i, add) => { const TM = scTimes(s, f, i); (f.items || []).slice(0, 4).forEach((it, k) => { add(TM.it[k], "whoosh"); add(TM.it[k] + .8, "pop"); }); if (f.closeCue) add(TM.c + .5, "pop"); if (f.goCue) add(TM.g + .9, "whoosh"); if (f.goal && f.goCue) add(TM.g + 3.2, "chime"); if (f.result) add(TM.r, f.result.bad ? "ping" : "chime"); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* =============== mailbox: letters fly into (or out of) a mailbox on a post; flag rises; actor can open and read; optional stamp ===============
     f: headline, highlight, box (label), actor, letters:[{label, cue, out}] (max 4), openCue, read:{label}, stamp:{label, cue} */
  function mbTimes(s, f, i){ return { l: (f.letters || []).slice(0, 4).map((l, k) => at(s, l.cue, .12 + k * .18, i)), o: f.openCue ? at(s, f.openCue, .7, i) : 1e9, st: f.stamp ? at(s, f.stamp.cue, .85, i) : 1e9 }; }
  function envelope(ctx, x, y, w, rot, col){ const h = w * .64; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.fillStyle = col || "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2 + 4, -h / 2 + 4); ctx.lineTo(0, h * .1); ctx.lineTo(w / 2 - 4, -h / 2 + 4); ctx.stroke(); ctx.fillStyle = RED; ctx.fillRect(w / 2 - 22, -h / 2 + 8, 14, 16); ctx.restore(); }
  TT.layout("mailbox", "Kotak surat", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), letters = (f.letters || []).slice(0, 4), TM = mbTimes(s, f), gy = BOT - 70, mx = 520, my = gy - 330, mw = 270, mh = 150;
    const inArr = letters.map((l, k) => !l.out && t > TM.l[k] + .9), nIn = inArr.filter(Boolean).length, opened = t > TM.o;
    const flagUp = nIn > 0 && !opened, fl = (() => { let v = 0; letters.forEach((l, k) => { if (!l.out) v = Math.max(v, clamp((t - TM.l[k] - .9) / .4, 0, 1)); }); if (opened) v *= 1 - clamp((t - TM.o - .6) / .4, 0, 1); return v; })();
    const door = (() => { let d = 0; letters.forEach((l, k) => { const lt = t - TM.l[k] - (l.out ? 0 : .6); if (lt > -.0 && lt < .6) d = Math.max(d, Math.sin(lt / .6 * Math.PI)); }); if (opened) d = Math.max(d, clamp((t - TM.o) / .35, 0, 1)); return d; })();
    const who = act(f.actor || { hair: "long", shirt: "#A0522D", skin: "d" }, s, t, 230); let r = null;
    frame(ctx, th, top, t, () => {
      grass(ctx, top, gy, t);
      // fence
      ctx.fillStyle = "#FFFDF7"; for (let x = X0 + 10; x < X1; x += 56){ rr(ctx, x, gy - 150, 34, 150, 8); ctx.fill(); } ctx.fillRect(X0, gy - 120, X1 - X0, 16); ctx.fillRect(X0, gy - 60, X1 - X0, 16);
      r = drawActor(ctx, th, who.A, who.st, t, gy, .78);
      // post
      ctx.fillStyle = WOOD2; ctx.fillRect(mx + mw / 2 - 18, my + mh - 10, 36, gy - my - mh + 10); ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.beginPath(); ctx.ellipse(mx + mw / 2, gy + 4, 60, 10, 0, 0, TAU); ctx.fill();
      // flag (behind body, right side)
      ctx.save(); ctx.translate(mx + mw - 26, my + mh - 46); ctx.rotate(-(Math.PI / 2) * eBack(fl)); ctx.fillStyle = "#544E42"; ctx.fillRect(-4, -6, 110, 12); ctx.fillStyle = RED; rr(ctx, 70, -36, 50, 36, 4); ctx.fill(); ctx.restore();
      // body
      ctx.beginPath(); ctx.moveTo(mx, my + mh); ctx.lineTo(mx, my + 60); ctx.quadraticCurveTo(mx, my, mx + 60, my); ctx.lineTo(mx + mw - 60, my); ctx.quadraticCurveTo(mx + mw, my, mx + mw, my + 60); ctx.lineTo(mx + mw, my + mh); ctx.closePath();
      ctx.fillStyle = TEAL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(mx + 30, my + 20, mw - 60, 10);
      if (f.box){ const z = wrapFit(ctx, th, f.box, mw - 70, 28, 800, 2, 16); font(ctx, 800, z.size, th.fam); ctx.fillStyle = CREAM; ctx.textAlign = "center"; z.lines.forEach((l, j) => ctx.fillText(l, mx + mw / 2 + 20, my + mh / 2 + 18 + (j - (z.lines.length - 1) / 2) * z.size * 1.1)); ctx.textAlign = "left"; }
      // door (front end, left) swings open toward the viewer
      ctx.save(); ctx.translate(mx, my + mh); ctx.rotate(-door * 1.2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -mh + 60); ctx.quadraticCurveTo(0, -mh, 26, -mh); ctx.lineTo(34, -mh); ctx.lineTo(34, 0); ctx.closePath(); ctx.fillStyle = "#25585B"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.arc(20, -mh / 2, 7, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore();
      if (nIn && !opened){ ctx.beginPath(); ctx.arc(mx + mw - 14, my + 10, 26, 0, TAU); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.stroke(); font(ctx, 800, 28, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(String(nIn), mx + mw - 14, my + 20); ctx.textAlign = "left"; }
    });
    // letters in flight
    const door0 = [mx + 10, my + mh - 50];
    letters.forEach((l, k) => { const lt = t - TM.l[k]; if (lt < 0 || lt > 1) return; const p = clamp(lt / .9, 0, 1);
      const [a, c, b] = l.out ? [door0, [800, top + 80], [1080, top + 40]] : [[1080, top + 120 + k * 20], [760, top + 40], door0];
      const x = qb(a[0], c[0], b[0], p), y = qb(a[1], c[1], b[1], p), sc = l.out ? 1 : 1 - Math.max(0, p - .85) / .15 * .6;
      envelope(ctx, x, y, 110 * sc, Math.sin(lt * 8) * .2, "#FFFFFF"); if (p < .9) tag(ctx, th, l.label, x, y - 74, 340, { size: 28, k: eBack(clamp(lt / .3, 0, 1)) }); });
    letters.forEach((l, k) => { const lt = t - TM.l[k] - .9; if (lt < 0) return; chip(ctx, th, l.label, X0 + 20, top + 60 + k * 66, 440, l.out ? "out" : "plus", eBack(clamp(lt / .4, 0, 1)), { dim: opened && !l.out && false }); });
    // opened letter becomes a readable card
    if (opened && f.read){ const lt = t - TM.o; const p = easeIO(clamp((lt - .2) / .6, 0, 1)), x = lerp(door0[0], 700, p), y = lerp(door0[1], top + 215, p);
      if (p < 1) envelope(ctx, x, y, 110 + p * 60, 0); else { const q = eBack(clamp((lt - .8) / .4, 0, 1)); ctx.save(); ctx.translate(700, top + 215); ctx.rotate(-.03); ctx.scale(q, q);
        const z = wrapFit(ctx, th, f.read.label, 360, 32, 800, 3, 18); const lh = z.size * 1.2, h = z.lines.length * lh + 70; rr(ctx, -210, -h / 2, 420, h, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = ORANGE; ctx.fillRect(-180, -h / 2 + 18, 80, 8); font(ctx, 800, z.size, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center"; z.lines.forEach((l, j) => ctx.fillText(l, 0, -h / 2 + 50 + lh * (j + .5))); ctx.textAlign = "left"; ctx.restore(); } }
    if (f.stamp && t > TM.st){ const lt = t - TM.st, q = lt < .25 ? 1.8 - .8 * (lt / .25) : 1; ctx.save(); ctx.globalAlpha *= clamp(lt * 5, 0, 1); ctx.translate(600, top + 290); ctx.rotate(-.1); ctx.scale(q, q);
      const z = wrapFit(ctx, th, f.stamp.label.toUpperCase(), 560, 52, 800, 1, 24); font(ctx, 800, z.size, th.fam); const w = ctx.measureText(z.lines[0]).width + 60; rr(ctx, -w / 2, -48, w, 96, 14); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.stroke();
      ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.fillText(z.lines[0], 0, z.size * .36); ctx.textAlign = "left"; ctx.restore(); }
    overlay(ctx, th, { st: who.st, r }, t);
  }, (s, f, i, add) => { const TM = mbTimes(s, f, i); (f.letters || []).slice(0, 4).forEach((l, k) => { add(TM.l[k], "whoosh"); if (!l.out) add(TM.l[k] + .9, "pop"); }); if (f.openCue) add(TM.o + .9, "chime"); if (f.stamp) add(TM.st + .2, "ping"); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);

  /* =============== balloon: hot-air balloon held down by labelled sandbags; dropping them makes it rise toward the goal cloud ===============
     f: headline, highlight, actor, bags:[{label, cue, drop}] (max 4; drop defaults true), riseCue, goal:{label, icon} */
  function blTimes(s, f, i){ return { b: (f.bags || []).slice(0, 4).map((b, k) => at(s, b.cue, .15 + k * .18, i)), r: f.riseCue ? at(s, f.riseCue, .85, i) : 1e9 }; }
  TT.layout("hotair", "Balon udara", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = topOf(f), bags = (f.bags || []).slice(0, 4), TM = blTimes(s, f), gy = BOT - 62, cx = 540;
    const drops = bags.map(b => b.drop !== false), nD = drops.filter(Boolean).length, maxB = gy - (top + 470);
    let lift = 0; bags.forEach((b, k) => { if (drops[k]) lift += easeIO(clamp((t - TM.b[k] - .2) / 1.2, 0, 1)); });
    const rise = clamp((nD ? lift / nD : 0) * (f.riseCue ? .6 : 1) + (f.riseCue ? .4 * easeIO(clamp((t - TM.r) / 1.6, 0, 1)) : 0), 0, 1);
    const allDropped = nD && lift > nD - .01, heavy = bags.length - bags.filter((b, k) => drops[k] && t > TM.b[k] + .2).length;
    const strain = heavy > 0 ? Math.max(0, Math.sin(t * 3)) * 8 : 0, B = gy - 6 - rise * maxB - strain + Math.sin(t * 1.6) * (rise > .05 ? 6 : 0);
    const keys = []; bags.forEach((b, k) => { if (drops[k]) keys.push({ at: TM.b[k], expr: "smile", pose: "point" }); });
    if (heavy === bags.length && bags.length) keys.unshift({ at: .3, expr: "worried", emote: "sweat" });
    const fin = f.riseCue ? TM.r + 1.6 : (nD ? Math.max(...TM.b.filter((x, k) => drops[k])) + 1.4 : 1e9);
    if (nD) keys.push({ at: fin, pose: "cheer", expr: "happy", emote: "sparkle" });
    const who = act(f.actor || { hair: "hijab", hijab: "#2F6F73", shirt: "#E89544", skin: "b" }, s, t, cx, keys); let r = null;
    const fdx = k => (k % 2 ? 1 : -1) * (20 + Math.floor(k / 2) * 300);
    const appear = k => bags[k].drop === false && bags[k].cue ? TM.b[k] : .2 + k * .12;
    const bagPos = k => { const side = k % 2 ? 1 : -1, lvl = Math.floor(k / 2); return [cx + side * (82 + lvl * 26), B - 70 + lvl * 46]; };
    const flameH = (heavy && !allDropped ? 24 : 40) + Math.sin(t * 14) * 6 + (t % 2.4 < .5 ? 20 : 0);
    frame(ctx, th, top, t, () => {
      skyFill(ctx, top, gy, "#A9D3E3", "#FCEBD8"); cloud(ctx, 220 + Math.sin(t * .2) * 20, top + 120, 1.1, .9); cloud(ctx, 850, top + 260 + Math.sin(t * .3) * 10, .8, .8); cloud(ctx, 330, top + 380, .7, .7);
      ctx.fillStyle = "#9CC27A"; ctx.beginPath(); ctx.moveTo(X0, gy + 10); ctx.quadraticCurveTo(300, gy - 40, 540, gy + 4); ctx.quadraticCurveTo(800, gy - 30, X1, gy); ctx.lineTo(X1, BOT); ctx.lineTo(X0, BOT); ctx.fill();
      ctx.fillStyle = "#7FA862"; ctx.fillRect(X0, gy + 4, X1 - X0, BOT - gy);
      if (f.goal){ const q = clamp(rise * 1.6 - .3, 0, 1); cloud(ctx, 820, top + 110, 1.9 * (.6 + .4 * q), .95 * Math.max(.35, q)); }
      // tether while grounded
      if (rise < .05){ ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 60, B - 10); ctx.lineTo(cx - 160, gy + 10); ctx.stroke(); rr(ctx, cx - 170, gy, 20, 24, 4); ctx.fillStyle = WOOD2; ctx.fill(); }
      // fallen bags
      bags.forEach((b, k) => { if (!drops[k]) return; const lt = t - TM.b[k]; if (lt < 0) return; const [bx0, by0] = bagPosAt(k, TM.b[k]); if (lt < .9){ const p = lt / .9; sandbag(ctx, th, bx0 + fdx(k) * p, lerp(by0 + 30, gy - 10, p * p), p * 2 * (k % 2 ? 1 : -1), 1); }
        else { sandbag(ctx, th, bx0 + fdx(k), gy - 10, .3 * (k % 2 ? 1 : -1), .75); if (lt < 1.8) { const q = (lt - .9) / .9; puff(ctx, bx0 + fdx(k), gy, 16 + q * 26, .6 * (1 - q)); } } });
      // envelope + ropes
      const ey = B - 330, er = 135, sw = Math.sin(t * 1.1) * 4;
      ctx.strokeStyle = "#6E4A2F"; ctx.lineWidth = 3; [[-58, -40], [58, 40], [-20, -14], [20, 14]].forEach(([bx2, tx]) => { ctx.beginPath(); ctx.moveTo(cx + bx2, B - 88); ctx.lineTo(cx + tx + sw, ey + er + 32); ctx.stroke(); });
      const envP = () => { ctx.beginPath(); ctx.moveTo(-er * .98, 10); ctx.bezierCurveTo(-er * 1.05, -er * 1.3, er * 1.05, -er * 1.3, er * .98, 10); ctx.bezierCurveTo(er * .9, er * .7, er * .4, er * .95, er * .3, er + 30); ctx.lineTo(-er * .3, er + 30); ctx.bezierCurveTo(-er * .4, er * .95, -er * .9, er * .7, -er * .98, 10); ctx.closePath(); };
      ctx.save(); ctx.translate(cx + sw, ey); envP();
      ctx.save(); ctx.clip(); const cols = [ORANGE, "#FFF3E4", RED, "#FFF3E4", ORANGE, "#FFF3E4", TEAL]; for (let k = 0; k < 7; k++){ ctx.fillStyle = cols[k]; ctx.beginPath(); ctx.ellipse(0, 0, er * (1 - k / 7) + 2, er * 1.6, 0, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.ellipse(-er * .45, -er * .45, er * .18, er * .4, -.4, 0, TAU); ctx.fill(); ctx.restore();
      envP(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); rr(ctx, -er * .32, er + 24, er * .64, 16, 6); ctx.fillStyle = "#6E4A2F"; ctx.fill(); ctx.restore();
      // burner flame
      ctx.save(); ctx.translate(cx + sw, ey + er + 50); ctx.fillStyle = "#F4A85C"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(0, -flameH * 1.4, 14, 0); ctx.fill(); ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.moveTo(-7, 0); ctx.quadraticCurveTo(0, -flameH * .8, 7, 0); ctx.fill(); ctx.fillStyle = "#544E42"; ctx.fillRect(-16, 0, 32, 12); ctx.restore();
      // actor in the basket
      r = drawActor(ctx, th, who.A, Object.assign({}, who.st, { x: cx }), t, B - 6, .36);
      rr(ctx, cx - 66, B - 90, 132, 90, 14); ctx.fillStyle = "#C98B4A"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 3; for (let k = 1; k < 4; k++){ ctx.beginPath(); ctx.moveTo(cx - 66, B - 90 + k * 22); ctx.lineTo(cx + 66, B - 90 + k * 22); ctx.stroke(); } for (let k = 1; k < 6; k++){ ctx.beginPath(); ctx.moveTo(cx - 66 + k * 22, B - 90); ctx.lineTo(cx - 66 + k * 22, B); ctx.stroke(); }
      rr(ctx, cx - 72, B - 96, 144, 14, 7); ctx.fillStyle = WOOD2; ctx.fill();
      // hanging bags
      bags.forEach((b, k) => { if (drops[k] && t >= TM.b[k]) return; const ap = appear(k); if (t < ap) return; const [x, y] = bagPos(k), sway2 = Math.sin(t * 2 + k) * .06; ctx.strokeStyle = "#6E4A2F"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + (k % 2 ? 60 : -60), B - 88); ctx.lineTo(x, y); ctx.stroke(); ctx.save(); const qa = eBack(clamp((t - ap) / .4, 0, 1)); ctx.translate(x, y + 30); ctx.scale(qa, qa); sandbag(ctx, th, 0, 0, sway2, 1); ctx.restore(); });
    });
    // labels: hanging ones beside the bag, dropped ones on the ground
    bags.forEach((b, k) => { const dropped = drops[k] && t >= TM.b[k], side = k % 2 ? 1 : -1;
      if (!dropped){ const [x, y] = bagPos(k); if (t < appear(k)) return; const lv = Math.floor(k / 2), ly2 = lv ? B - 20 : B - 130; ctx.save(); ctx.strokeStyle = "rgba(110,74,47,.5)"; ctx.lineWidth = 3; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(x + side * 30, y + 30); ctx.lineTo(x + side * 70, ly2); ctx.stroke(); ctx.restore();
        tag(ctx, th, b.label, x + side * 175, ly2, 270, { size: 26, k: popS(t, appear(k)), stroke: heavy === bags.length ? "#D9A066" : null }); }
      else { const lt = t - TM.b[k], [bx0] = bagPosAt(k, TM.b[k]), p = clamp(lt / .9, 0, 1), y = lerp(bagPosAt(k, TM.b[k])[1] + 30, gy - 10, p * p);
        tag(ctx, th, b.label, lerp(bx0 + side * 175, bx0 + fdx(k), p), lerp(Math.floor(k / 2) ? y - 50 : y - 160, gy + 30, p), 270, { size: 24, bg: p >= 1 ? "#EDE6DC" : "#FFFFFF", fg: p >= 1 ? "#8C8476" : INK }); } });
    if (f.goal){ const q = clamp(rise * 1.6 - .3, 0, 1), ok = allDropped && t > fin; if (q > 0){ ctx.save(); ctx.globalAlpha *= q; tag(ctx, th, f.goal.label, 820, top + 124, 280, { size: 28, bg: ok ? GREEN : "#FFFFFF", fg: ok ? "#fff" : INK, stroke: ok ? null : ORANGE }); ctx.restore(); } if (ok) burst(ctx, 820, top + 124, t - fin, M, 12); }
    overlay(ctx, th, { st: who.st, r }, t);
    function bagPosAt(k, T){ const side = k % 2 ? 1 : -1, lvl = Math.floor(k / 2); let l2 = 0; bags.forEach((b, j) => { if (drops[j]) l2 += easeIO(clamp((T - TM.b[j] - .2) / 1.2, 0, 1)); }); const rs = clamp((nD ? l2 / nD : 0) * (f.riseCue ? .6 : 1), 0, 1); const BB = gy - 6 - rs * maxB; return [cx + side * (82 + lvl * 26), BB - 70 + lvl * 46]; }
  }, (s, f, i, add) => { const TM = blTimes(s, f, i); (f.bags || []).slice(0, 4).forEach((b, k) => { if (b.drop !== false){ add(TM.b[k], "whoosh"); add(TM.b[k] + .9, "pop"); } else add(TM.b[k], "pop"); }); if (f.riseCue) add(TM.r + 1.4, "chime"); },
  [["headline", "Judul", "area"], ["highlight", "Kata diwarnai", "text"]]);
  function sandbag(ctx, th, x, y, rot, a){ ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.moveTo(-26, -20); ctx.quadraticCurveTo(-34, 24, 0, 28); ctx.quadraticCurveTo(34, 24, 26, -20); ctx.quadraticCurveTo(0, -30, -26, -20); ctx.closePath();
    ctx.fillStyle = "#D9B98A"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = "#8E4E2E"; ctx.beginPath(); ctx.moveTo(-14, -22); ctx.lineTo(14, -22); ctx.stroke(); font(ctx, 800, 18, "Poppins"); ctx.fillStyle = "#8E4E2E"; ctx.textAlign = "center"; ctx.fillText("KG", 0, 12); ctx.textAlign = "left"; ctx.restore(); }
})();
