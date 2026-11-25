/* =====================================================================================================
   STORY16 — 16:9 (1920x1080) full-animation story renderer for long YouTube episodes (Kantor Tangani).
   Loaded AFTER engine/studio-tangani.html (needs TT.toonState / TT.drawToon / TT.prop and the engine
   helpers clamp, eOut, eBack, rr, font, spacing, hexA, mixHex, wrapRich, icon). It never touches the 9:16
   renderer: it draws on its own canvas with its own camera, locations (loc16.js), effects (fx16.js),
   bubbles, captions, transitions and colour grade.

   S16.init({ep, tl, env, logo})   ep = episode.json (+cast), tl = timeline (tools/panjang/render16.py),
                                   env = VO loudness envelope {env:[..], dur} for lip-flap, logo = data URL
   S16.frame(ctx, T)               draw the frame at global time T (seconds) on a 1920x1080 context
   S16.events                      SFX events [{t, type, vol, dur}] (global seconds) for the audio mix
   ===================================================================================================== */
(() => {
  'use strict';
  const TT = window.TT, G = TT.G;
  const SW = 1920, SH = 1080, GY = 1000, TAU = Math.PI * 2;
  const ORANGE = "#C2691F", NAVY = "#13223D", CREAM = "#FFF6EA", BROWN = "#3B2418", OUT = "#2B1A12", HL = "#F7A23B", INK = "#1E120B";
  const FAM = "Poppins", FAM2 = "'Plus Jakarta Sans'";
  const lerp = (a, b, q) => a + (b - a) * q;
  const easeIO = TT.easeIO, eIn = x => x * x * x;
  const EASE = { io: easeIO, out: eOut, back: eBack, lin: x => x, in: eIn };
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const lg = (ctx, x0, y0, x1, y1, stops) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const rg = (ctx, x, y, r0, r1, stops) => { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const glow = (ctx, x, y, r, col, a) => { ctx.fillStyle = rg(ctx, x, y, 0, r, [[0, hexA(col, a)], [1, hexA(col, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2); };
  const fillAll = (ctx, st) => { ctx.fillStyle = st; ctx.fillRect(-6000, -6000, 14000, 14000); };
  const ease = (q, k) => (EASE[k || "io"] || easeIO)(clamp(q, 0, 1));
  const win = (t, a, b, fi, fo) => clamp(Math.min((t - a) / (fi || .3), (b - t) / (fo || .3)), 0, 1);   // fade-in/out window

  const S = window.S16 = { LOC: {}, FX: {}, PROP: {}, SW, SH, GY, TAU, ORANGE, NAVY, CREAM, BROWN, OUT, HL, INK, FAM, FAM2,
    lerp, rnd, lg, rg, glow, fillAll, ease, win, eIn, warnings: [], events: [], anchors: {} };

  /* ---------------- text helpers ---------------- */
  S.text = (ctx, txt, x, y, size, o) => {        // o: {w=800, col, align, fam, stroke, sw, shadow, track, maxW}
    o = o || {}; font(ctx, o.w || 800, size, o.fam || FAM); spacing(ctx, o.track || 0); ctx.textAlign = o.align || "left";
    if (o.maxW){ let s = size; while (ctx.measureText(txt).width > o.maxW && s > 10){ s -= 2; font(ctx, o.w || 800, s, o.fam || FAM); } }
    if (o.shadow){ ctx.save(); ctx.fillStyle = o.shadow; ctx.fillText(txt, x + 3, y + 5); ctx.restore(); }
    if (o.stroke){ ctx.lineJoin = "round"; ctx.strokeStyle = o.stroke; ctx.lineWidth = o.sw || size * .18; ctx.strokeText(txt, x, y); }
    ctx.fillStyle = o.col || "#FFFFFF"; ctx.fillText(txt, x, y); ctx.textAlign = "left"; spacing(ctx, 0);
  };
  S.wrap = (ctx, txt, maxW) => { const out = []; String(txt).split("\n").forEach(par => { let line = "";
    par.split(/\s+/).filter(Boolean).forEach(w => { const tr = line ? line + " " + w : w; if (ctx.measureText(tr).width > maxW && line){ out.push(line); line = w; } else line = tr; }); out.push(line); }); return out; };

  /* ---------------- keyed values ---------------- */
  // keys [{at, dur?, ease?, <name>: value}] -> value of <name> at t (numbers ramp over dur, others step)
  S.kv = (keys, name, t, def) => {
    let v = def, prev = def;
    for (const k of keys || []){ if (k[name] === undefined) continue; if (t < (k.at || 0)) break;
      const q = k.dur ? ease((t - k.at) / k.dur, k.ease) : 1; prev = v;
      v = (typeof k[name] === "number" && typeof prev === "number" && q < 1) ? lerp(prev, k[name], q) : k[name]; }
    return v;
  };
  S.merged = (obj, t) => { if (!obj.keys) return obj; const o = Object.assign({}, obj); const names = new Set(); obj.keys.forEach(k => Object.keys(k).forEach(n => names.add(n)));
    ["at", "dur", "ease", "cue", "d", "n", "atE", "atF"].forEach(n => names.delete(n)); names.forEach(n => { o[n] = S.kv(obj.keys, n, t, obj[n]); }); return o; };

  /* ---------------- camera ---------------- */
  function makeCam(x, y, zoom, rot, sx, sy, ox){
    return { x, y, zoom, rot, sx, sy, ox: ox || 0,
      apply(ctx, depth){ const d = depth ?? 1, z = 1 + (this.zoom - 1) * d, cx = 960 + (this.x - 960) * d, cy = 540 + (this.y - 540) * d;
        ctx.translate(960 + this.ox + this.sx, 540 + this.sy); if (this.rot) ctx.rotate(this.rot * d); ctx.scale(z, z); ctx.translate(-cx, -cy); },
      toScreen(wx, wy, depth){ const d = depth ?? 1, z = 1 + (this.zoom - 1) * d, cx = 960 + (this.x - 960) * d, cy = 540 + (this.y - 540) * d;
        const dx = (wx - cx) * z, dy = (wy - cy) * z, r = this.rot * d, c = Math.cos(r), s = Math.sin(r);
        return [960 + this.ox + this.sx + dx * c - dy * s, 540 + this.sy + dx * s + dy * c]; },
      scale(depth){ return 1 + (this.zoom - 1) * (depth ?? 1); } };
  }
  S.makeCam = makeCam;
  S.CAM0 = makeCam(960, 540, 1, 0, 0, 0, 0);
  // keys [{at, x, y, zoom, rot, dur=1, ease, cut, shake, sdur, on:<actor id>, fit, sx, sy}]
  function cam16(keys, t, o){
    o = o || {}; const K = (keys && keys.length ? keys : [{ at: 0, x: 960, y: 540, zoom: 1 }]).slice().sort((p, q) => (p.at || 0) - (q.at || 0));
    const tgt = k => { const r = k.on != null && o.resolve ? o.resolve(k.on, k) : null;
      return { x: r ? r[0] : k.x, y: r ? r[1] : k.y, zoom: k.zoom ?? (r ? r[2] : null), rot: k.rot }; };
    let a = { x: 960, y: 540, zoom: 1, rot: 0 }, b = Object.assign({}, a), t0 = 0, d = 0, e = easeIO;
    const val = T => { const q = d > 0 ? e(clamp((T - t0) / d, 0, 1)) : 1; return { x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q), zoom: lerp(a.zoom, b.zoom, q), rot: lerp(a.rot, b.rot, q) }; };
    K.forEach((k, j) => { const kt = k.at || 0; if (t < kt) return; if (j && t < (K[j - 1].at || 0)) return; const cur = val(kt), g = tgt(k);
      a = cur; b = { x: g.x ?? b.x, y: g.y ?? b.y, zoom: g.zoom ?? b.zoom, rot: g.rot ?? b.rot }; t0 = kt;
      d = (k.cut || (j === 0 && k.dur == null)) ? 0 : (k.dur ?? 1); e = EASE[k.ease || "io"] || easeIO; });
    const v = val(t), hd = o.handheld ?? 1;
    v.x += Math.sin(t * .63) * 5 * hd + Math.sin(t * 1.7) * 1.2 * hd; v.y += Math.sin(t * .47 + 1) * 4 * hd; v.rot += Math.sin(t * .37) * .0022 * hd;
    v.zoom *= 1 + (o.push ?? .005) * Math.max(0, t - (o.t0 || 0));
    if (o.bounds){ const [x0, x1, y0, y1] = o.bounds, hw = (o.half ? 480 : 960) / v.zoom, hh = 540 / v.zoom;
      v.x = x1 - x0 < hw * 2 ? (x0 + x1) / 2 : clamp(v.x, x0 + hw, x1 - hw); v.y = y1 - y0 < hh * 2 ? (y0 + y1) / 2 : clamp(v.y, y0 + hh, y1 - hh); }
    let sx = 0, sy = 0;
    K.concat(o.shake || []).forEach(k => { if (!k.shake) return; const A0 = typeof k.shake === "number" ? k.shake : 16, D = k.sdur || .55, q = (t - (k.at || 0)) / D; if (q < 0 || q > 1) return;
      const f = A0 * Math.pow(1 - q, 2); sx += Math.sin(t * 73 + k.at * 7) * f; sy += Math.cos(t * 61 + k.at * 3) * f; });
    return makeCam(v.x, v.y, v.zoom, v.rot, sx, sy, o.ox);
  }
  S.cam16 = cam16;
  S.layer = (ctx, c, d, fn) => { ctx.save(); c.apply(ctx, d); try { fn(); } finally { ctx.restore(); } };

  /* ---------------- episode / timeline ---------------- */
  let EP = null, TLX = null, OFF = [];
  const norm = s => String(s).toLowerCase().replace(/[“”"]/g, '"').replace(/…/g, ".");
  function findCue(A, phrase, n, end){
    const txt = norm(A.text || ""), p = norm(phrase); let idx = -1, from = 0;
    for (let k = 0; k < (n || 1); k++){ idx = txt.indexOf(p, from); if (idx < 0) break; from = idx + 1; }
    if (idx < 0) return null;
    const ci = end ? idx + p.length - 1 : idx, W = A.words || [];
    let w = W.find(x => ci >= x.i && ci < x.i + x.w.length); if (!w) w = W.find(x => x.i >= ci) || W[W.length - 1]; if (!w) return null;
    return A.voOff + (end ? w.e : w.t);
  }
  function resolveTimes(A, o){
    if (Array.isArray(o)){ o.forEach(x => resolveTimes(A, x)); return; }
    if (!o || typeof o !== "object") return;
    if (typeof o.cue === "string"){ const v = findCue(A, o.cue, o.n, o.cueEnd); if (v == null){ S.warnings.push(`adegan ${A.n}: cue "${o.cue}" tidak ditemukan`); o.at = o.at ?? (o.atF != null ? o.atF * A.dur : 0); } else o.at = v + (o.d || 0); }
    else if (o.atE != null) o.at = A.dur - o.atE + (o.d || 0);
    else if (o.atF != null) o.at = A.dur * o.atF + (o.d || 0);
    else if (o.atV != null) o.at = A.voOff + A.voDur * o.atV + (o.d || 0);       // fraction of the VO span
    Object.keys(o).forEach(k => { if (o[k] && typeof o[k] === "object") resolveTimes(A, o[k]); });
  }
  S.init = (data) => {
    EP = data.ep; TLX = data.tl; S.warnings = [];
    S.cast = Object.assign({}, EP.cast || {}, EP.extras || {});
    S.logo = new Image(); if (data.logo) S.logo.src = data.logo;
    EP.adegan.forEach((A, i) => { const T = TLX.adegan[i]; Object.assign(A, { start: T.start, end: T.end, dur: T.end - T.start, voOff: T.voOff || 0, voDur: T.voDur || 0, text: T.text || "", words: T.words || [], idx: i }); });
    EP.adegan.forEach(A => {
      resolveTimes(A, A.shots); resolveTimes(A, A.actors || []); resolveTimes(A, A.props || []); resolveTimes(A, A.locOpt || {}); resolveTimes(A, A.sfx || []); resolveTimes(A, A.fx || []);
      (A.lines || []).forEach(L => { L.t0 = L.from != null ? (findCue(A, L.from, L.n, false) ?? 0) + (L.d0 || 0) : L.at; L.t1 = L.to != null ? (findCue(A, L.to, L.n2 || L.n, true) ?? L.t0 + 2) + (L.d1 || 0) : L.t0 + 2;
        if (L.from != null && findCue(A, L.from, L.n, false) == null) S.warnings.push(`adegan ${A.n}: kalimat "${L.from}" tidak ditemukan`); });
      const rel = f => { if (!f || typeof f !== "object") return; Object.keys(f).forEach(k => { const v = f[k]; if (k !== "keys" && v && typeof v === "object" && !Array.isArray(v) && v.at != null && f.type) f[k] = k === "out" ? v.at : v.at - (f.at || 0); }); };   // "out" stays absolute (adegan-local): every consumer compares it with t
      const fxs = (A.fx || []).slice(); (A.shots || []).forEach(sh => { const sa = sh.at || 0; (sh.fx || []).forEach(f => { if (f.at == null) f.at = sa; fxs.push(f); }); (sh.split || []).forEach(p => (p.fx || []).forEach(f => { if (f.at == null) f.at = sa; fxs.push(f); })); }); (A.fx || []).forEach(f => { if (f.at == null) f.at = 0; }); fxs.forEach(rel);
      A.shots = (A.shots || []).slice().sort((p, q) => (p.at || 0) - (q.at || 0)); A.shots.forEach((s, j) => { s.at = j ? s.at || 0 : 0; s.end = j + 1 < A.shots.length ? A.shots[j + 1].at : A.dur; });
    });
    // fake engine timeline so TT.drawToon's lip-flap (voLevel) + blink timing use our global times
    TL = { scenes: EP.adegan.map(A => ({ start: A.start, end: A.end, ss: A.start + A.voOff, se: A.start + A.voOff + A.voDur, T: {} })), dur: TLX.dur };
    if (data.env && data.env.env) voAnalysis = { env: Float32Array.from(data.env.env), dur: data.env.dur, gaps: [], sStart: 0, sEnd: data.env.dur };
    buildCaptions(); buildEvents();
    return { dur: TLX.dur, warnings: S.warnings, events: S.events.length };
  };
  S.ep = () => EP;

  /* ---------------- actors ---------------- */
  const HANDS = { idle: [11, -29], talk: [24, -36], wave: [25, -70], point: [33, -56], pointUp: [25, -71], hold: [21, -47], phone: [17, -43], cheer: [23, -72],
    hips: [17, -37], think: [9, -62], shrug: [24, -57], sit: [14, -26], clap: [12, -47], scratch: [21, -76], facepalm: [7, -71], scared: [20, -60], shock: [24, -64], sad: [8, -29] };
  function speaking(A, who, t){ return (A.lines || []).some(L => L.who === who && L.talk !== false && t >= L.t0 - .05 && t <= L.t1 + .1); }
  function actorOf(A, sp, t){
    const look = S.cast[sp.who] ? (S.cast[sp.who].look || S.cast[sp.who]) : {};
    const a = Object.assign({ size: 560, y: GY }, look, sp.look || {}, sp); delete a.look; if (sp.look === "cam" || Array.isArray(sp.look)) a.look = sp.look;
    const st = TT.toonState(a, null, t);
    st.talk = speaking(A, sp.who, t) || (sp.alwaysTalk && st.talk);
    if (st.pose === "idle" && st.talk && a.gesture !== false) st.pose = "talk";
    return { a, st, sp, id: sp.id || sp.who };
  }
  const headOf = st => { const k = st.size / 92; return [st.x + 2 * k * (st.face || 1), st.y - 72 * k + (st.pose === "sit" ? 13 * k : 0)]; };
  S.headOf = headOf;
  function drawActor(ctx, c, X, t){
    const { a, st, sp } = X; if (sp.hide) return;
    const alpha = S.kv(sp.keys, "alpha", t, sp.alpha ?? 1); if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha; c.apply(ctx, sp.depth ?? 1);
    const r = TT.drawToon(ctx, a, st, t);
    if (r){
      const k = r.k, f = r.face;
      const bags = S.kv(sp.keys, "eyebags", t, sp.eyebags || 0);
      if (bags > 0.02){ ctx.save(); ctx.lineCap = "round"; [-1, 1].forEach(d => { const ex = st.x + (2.6 + d * 7.3) * k * f, ey = r.headY + 4.6 * k;
        ctx.strokeStyle = `rgba(74,40,70,${.25 + .5 * bags})`; ctx.lineWidth = (1 + 1.6 * bags) * k; ctx.beginPath(); ctx.arc(ex, ey - 2.2 * k, 4.6 * k, .25 * Math.PI, .75 * Math.PI); ctx.stroke(); }); ctx.restore(); }
      const item = S.kv(sp.keys, "item", t, sp.item || null);
      if (item){ const pose = st.pose === "idle" && st.talk ? "talk" : st.pose, h = HANDS[pose] || HANDS.idle; const hx = st.x + h[0] * k * f, hy = st.y + h[1] * k;
        (S.PROP["hand_" + item] || S.PROP.hand_thumb)(ctx, hx, hy, k, f, t, sp); }
      const hs = c.toScreen(r.headX, r.headY, sp.depth ?? 1), ts = c.toScreen(r.headX, r.top, sp.depth ?? 1);
      S.anchors[X.id] = { head: hs, top: ts, scale: c.scale(sp.depth ?? 1) * k, face: f, world: r };
    }
    ctx.restore();
  }

  /* ---------------- props ---------------- */
  function drawProps(ctx, c, A, sh, t, layer){
    (sh.props ?? (sh.loc && sh.loc !== A.loc ? [] : (sh.useLoc === false ? [] : (A.props || [])))).forEach(p0 => { if ((p0.layer || "main") !== layer) return; const p = S.merged(p0, t); if (p.hide) return;
      const T0 = p.at ?? -1, q = t - T0; if (q < 0) return; const pop = p.pop === false ? 1 : eBack(clamp(q / .35, 0, 1)); if (pop <= 0) return;
      ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 960, p.y ?? GY); ctx.scale((p.s || 1) * pop * (p.flip ? -1 : 1), (p.s || 1) * pop); if (p.rot) ctx.rotate(p.rot);
      try { if (S.PROP[p.type]) S.PROP[p.type](ctx, p, t, A, sh); else TT.prop(ctx, p.type, 0, 0, Object.assign({}, p, { s: 1 }), t); } catch (e){ console.error(e); }
      ctx.restore(); });
  }

  /* ---------------- fx ---------------- */
  function drawFx(ctx, c, A, sh, t, layer){
    (sh.fx || []).forEach(f0 => { const def = S.FX[f0.type]; if (!def) return; const L = f0.layer || def.layer || "screen"; if (L !== layer) return;
      const T0 = f0.at ?? 0, out = f0.out ?? 1e9; if (t < T0 - (def.pre || 0) || t > out + (f0.outDur ?? def.outDur ?? .4)) return;
      const f = S.merged(f0, t);
      ctx.save(); try { if (L === "world") c.apply(ctx, f.depth ?? 1); def.draw(ctx, f, t, c, A, sh); } catch (e){ console.error(e); } ctx.restore(); });
  }
  S.fxIn = (f, t, d) => clamp((t - (f.at || 0)) / (d || .4), 0, 1);
  S.fxOut = (f, t, d) => f.out != null ? clamp((t - f.out) / (d || f.outDur || .4), 0, 1) : 0;

  /* ---------------- colour grade ---------------- */
  function grade(ctx, g, ox, wdt){
    g = Object.assign({ warm: .12, vig: .38 }, g || {}); ox = ox || 0; wdt = wdt || SW; ctx.save();
    if (g.warm){ ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = hexA("#E0893A", Math.min(1, g.warm * 2.2)); ctx.fillRect(ox, 0, wdt, SH); ctx.globalCompositeOperation = "source-over"; }
    if (g.tint){ ctx.fillStyle = g.tint; ctx.fillRect(ox, 0, wdt, SH); }
    if (g.vig){ const cx = ox + wdt / 2; ctx.fillStyle = rg(ctx, cx, 520, Math.min(wdt, 1200) * .42, Math.max(wdt * .62, 700), [[0, "rgba(43,26,18,0)"], [1, `rgba(30,16,10,${g.vig})`]]); ctx.fillRect(ox, 0, wdt, SH); }
    ctx.restore();
  }
  S.grade = grade;

  /* ---------------- speech bubble (screen space, 16:9 clamps) ---------------- */
  function bubble(ctx, text, x, y, k, o){
    o = o || {}; if (k < 0) return; const kind = o.kind || "say"; let size = o.size || 46; const maxW = o.maxW || 760;
    const label = kind === "shout" ? String(text).toUpperCase() : String(text); let lines;
    for (;;){ font(ctx, 800, size, FAM); lines = S.wrap(ctx, label, maxW); if (lines.length <= 3 || size <= 28) break; size -= 3; }
    lines = lines.slice(0, 3); const lh = size * 1.2, tw = Math.max(...lines.map(l => ctx.measureText(l).width)), w = Math.max(170, tw + size * 1.5), h = lines.length * lh + size * .95;
    const L = o.ox0 ?? 30, R = o.ox1 ?? SW - 30;
    let bx = clamp(x - w / 2 + (o.side || 0) * w * .3, L, R - w), by = y - h - (o.gap ?? 64), below = false;
    if (by < 70){ by = Math.max(70, y + 70); below = true; }
    const sc = eBack(clamp(k / .28, 0, 1)) * (1 - .25 * (o.fo || 0)), bob = Math.sin((o.t ?? k) * 3) * 3; if (sc <= 0) return;
    ctx.save(); ctx.globalAlpha *= 1 - (o.fo || 0); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y + bob); ctx.lineJoin = "round";
    const tipX = clamp(x, bx + 46, bx + w - 46);
    const path = () => { ctx.beginPath();
      if (kind === "shout"){ const n = 24; for (let i = 0; i < n; i++){ const an = i / n * TAU, rx = w / 2 + (i % 2 ? 20 : -2), ry = h / 2 + (i % 2 ? 20 : -2), px = bx + w / 2 + Math.cos(an) * rx, py = by + h / 2 + Math.sin(an) * ry; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
      else if (kind === "think"){ const n = 12; for (let i = 0; i < n; i++){ const an = i / n * TAU, px = bx + w / 2 + Math.cos(an) * w / 2, py = by + h / 2 + Math.sin(an) * h / 2; ctx.moveTo(px + size * .55, py); ctx.arc(px, py, size * .55, 0, TAU); } ctx.roundRect(bx + 10, by + 10, w - 20, h - 20, h / 2); }
      else ctx.roundRect(bx, by, w, h, Math.min(44, h / 2));
      if (kind === "think"){ const ty0 = below ? by : by + h; for (let i = 0; i < 3; i++){ const q = (i + 1) / 4, cx = lerp(tipX, x, q), cy = lerp(ty0, y, q), r = size * (.3 - i * .07); ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, TAU); } }
      else if (o.noTail){}
      else if (below){ ctx.moveTo(tipX - 26, by + 4); ctx.lineTo(x, y + 6); ctx.lineTo(tipX + 26, by + 4); }
      else { ctx.moveTo(tipX - 28, by + h - 4); ctx.quadraticCurveTo(tipX - 6, by + h + 30, x, y - 4); ctx.quadraticCurveTo(tipX + 10, by + h + 20, tipX + 30, by + h - 4); } };
    ctx.shadowColor = "rgba(30,18,11,.35)"; ctx.shadowOffsetY = 10; path(); ctx.fillStyle = kind === "shout" ? "#FFF1C9" : "#FFFFFF"; ctx.fill(); ctx.shadowColor = "transparent";
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); path(); ctx.fill();
    if (o.who){ font(ctx, 800, 22, FAM); const nw = ctx.measureText(o.who.toUpperCase()).width + 26; rr(ctx, bx + 26, by - 16, nw, 34, 17); ctx.fillStyle = o.whoCol || ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#FFF"; ctx.fillText(o.who.toUpperCase(), bx + 39, by + 9); }
    font(ctx, 800, size, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + size * .5 + lh * .8 + i * lh)); ctx.textAlign = "left";
    ctx.restore();
  }
  S.bubble = bubble;
  function drawBubbles(ctx, A, sh, t, half){
    (A.lines || []).forEach(L => { if (L.bubble === "none") return; let hold = Math.max(L.t1 - L.t0 + .8, L.min || 2.6); const k = t - L.t0;
      // the same speaker's next bubble replaces this one (no stacked bubbles from one mouth)
      (A.lines || []).forEach(N => { if (N !== L && N.who === L.who && N.bubble !== "none" && N.t0 > L.t0) hold = Math.min(hold, Math.max(.4, N.t0 - L.t0 - .3)); });
      if (k < 0 || k > hold + .3) return;
      if (L.shots && !L.shots.includes(A.shots.indexOf(sh))) return;
      const an = S.anchors[L.who]; let x, y;
      if (an && an.frame === S.frameId){ x = an.top[0] + (L.dx || 0); y = an.top[1] - 6 + (L.dy || 0); }
      else if (L.pos){ x = L.pos[0]; y = L.pos[1]; } else return;
      if (half && (L.own || A.ownBubbles) && (x < half[0] || x > half[1])) return;   // opt-in (Klien Terbesar Eps 3+): layar terbelah, balon hanya di separuh milik tokohnya
      const fo = clamp((k - hold) / .3, 0, 1);
      bubble(ctx, L.text, x, y, k, { kind: L.kind || "say", side: L.side || 0, t, fo, who: L.label, size: L.size, maxW: L.maxW, noTail: !an || an.frame !== S.frameId, ox0: half ? half[0] + 20 : 30, ox1: half ? half[1] - 20 : SW - 30 }); });
  }

  /* ---------------- shots ---------------- */
  S.frameId = 0;
  function drawShot(ctx, A, sh, t, opt){
    opt = opt || {};
    if (sh.split){ // two (or more) sub-shots side by side
      const parts = sh.split, n = parts.length, dv = S.kv(sh.keys, "divide", t, sh.divide ?? .5);
      parts.forEach((p, j) => { const x0 = j === 0 ? 0 : SW * dv, x1 = j === 0 ? SW * dv : SW, sub = Object.assign({ at: sh.at, end: sh.end }, p);
        ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, SH); ctx.clip();
        drawShot(ctx, A, sub, t, { ox: (x0 + x1) / 2 - 960, half: [x0, x1], noBubbles: false });
        ctx.restore(); });
      ctx.save(); const xm = SW * dv; ctx.fillStyle = CREAM; ctx.fillRect(xm - 7, 0, 14, SH); ctx.fillStyle = ORANGE; ctx.fillRect(xm - 3, 0, 6, SH); ctx.restore();
      drawFx(ctx, S.CAM0, A, sh, t, "screen");
      return;
    }
    const locName = sh.loc ?? (sh.useLoc === false ? null : A.loc), Lc = S.LOC[locName] || S.LOC.none, lo = Object.assign({}, Lc.def || {}, sh.loc && sh.loc !== A.loc ? {} : (A.locOpt || {}), sh.locOpt || {});
    let lo2 = lo.keys ? S.merged(lo, t) : lo; Object.keys(lo2).forEach(k => { const v = lo2[k]; if (v && typeof v === "object" && !Array.isArray(v) && v.at != null) lo2[k] = v.at; });
    const actors = (sh.actors ?? (sh.loc && sh.loc !== A.loc ? [] : (A.actors || []))).concat(sh.addActors || []).map(sp => actorOf(A, sp, t));
    const resolve = (on, k) => { const X = actors.find(x => x.id === on); let hx, hy, sz, d = 1;
      if (X){ [hx, hy] = headOf(X.st); sz = X.st.size; d = X.sp.depth ?? 1; } else if (Array.isArray(on)){ [hx, hy] = on; sz = 560; } else return null;
      hx += k.dx || 0; hy += k.dy || 0;
      const z = k.fit ? (SW * k.fit) / (sz * 42 / 92) : (k.zoom || 1), sxT = k.sx ?? 960, syT = k.sy ?? (k.fit ? 470 : 540);
      const tx = hx - (sxT - 960) / z, ty = hy - (syT - 540) / z;   // target centre in the actor's own layer
      return [960 + (tx - 960) / d, 540 + (ty - 540) / d, k.fit ? 1 + (z - 1) / d : (k.zoom ?? null)]; };
    const c = cam16(sh.cam, t, { resolve, t0: sh.at, push: sh.push ?? .005, handheld: sh.handheld ?? 1, bounds: sh.bounds === false ? null : (sh.bounds || Lc.bounds), ox: opt.ox, half: !!opt.half, shake: sh.shake });
    S.cam = c; A._cur = sh;
    ctx.save();
    try {
      if (Lc.bg){ if (sh.blur){ const x = off(5); x.save(); Lc.bg(x, c, t, lo2, sh, A); x.restore(); ctx.save(); ctx.setTransform(ctx.getTransform()); ctx.filter = `blur(${sh.blur}px)`; ctx.drawImage(OFF[5], -20, -20, SW + 40, SH + 40); ctx.restore(); } else Lc.bg(ctx, c, t, lo2, sh, A); }
      drawFx(ctx, c, A, sh, t, "bg");
      actors.filter(x => x.sp.layer === "back").sort((p, q) => (p.sp.z || 0) - (q.sp.z || 0)).forEach(x => drawActor(ctx, c, x, t));
      if (Lc.mid) Lc.mid(ctx, c, t, lo2, sh, A);
      drawProps(ctx, c, A, sh, t, "main");
      actors.filter(x => !x.sp.layer || x.sp.layer === "main").sort((p, q) => (p.sp.z || 0) - (q.sp.z || 0)).forEach(x => drawActor(ctx, c, x, t));
      drawProps(ctx, c, A, sh, t, "front");
      if (Lc.front) Lc.front(ctx, c, t, lo2, sh, A);
      actors.filter(x => x.sp.layer === "front").forEach(x => drawActor(ctx, c, x, t));
      drawFx(ctx, c, A, sh, t, "world");
    } catch (e){ console.error(e); }
    ctx.restore();
    actors.forEach(x => { if (S.anchors[x.id]) S.anchors[x.id].frame = S.frameId; });
    grade(ctx, Object.assign({}, Lc.grade || {}, sh.grade || {}), opt.half ? opt.half[0] : 0, opt.half ? opt.half[1] - opt.half[0] : SW);
    drawFx(ctx, c, A, sh, t, "screen");
    if (!opt.noBubbles) drawBubbles(ctx, A, sh, t, opt.half);
  }

  /* ---------------- transitions ---------------- */
  function off(depth){ if (!OFF[depth]){ const c = document.createElement("canvas"); c.width = SW; c.height = SH; OFF[depth] = c; }
    const x = OFF[depth].getContext("2d"); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = "none"; x.globalCompositeOperation = "source-over"; x.clearRect(0, 0, SW, SH); return x; }
  const TRD = { whip: .45, zoom: .55, iris: .9, fade: .7, flash: .3, cut: 0, black: 1.2, dip: .5, slide: .5 };
  // p in 0..1 across the boundary (0.5 = the cut); draw(ctx, which) draws side 0 (out) or 1 (in)
  function transition(ctx, kind, p, draw, focus, depth){
    const out = p < .5, side = out ? 0 : 1;
    if (kind === "whip" || kind === "slide"){
      const x = off(depth); draw(x, side); const q = out ? eIn(p * 2) : 1 - eOut((p - .5) * 2), dx = (out ? -1 : 1) * q * SW * 1.05, spread = kind === "whip" ? 110 * q : 0;
      ctx.fillStyle = "#120A05"; ctx.fillRect(0, 0, SW, SH);
      const n = kind === "whip" ? 6 : 1; for (let j = 0; j < n; j++){ ctx.save(); ctx.globalAlpha = n > 1 ? 1 / (j + 1) : 1; ctx.drawImage(OFF[depth], dx + (j - 2.5) * spread / 2.5 * (out ? -1 : 1), 0, SW, SH); ctx.restore(); }
      if (kind === "whip"){ ctx.save(); ctx.globalAlpha = q * .7; ctx.fillStyle = "#FFF4E6"; for (let j = 0; j < 18; j++){ const y = rnd(j + Math.floor(p * 40)) * SH, L = 400 + rnd(j + 5) * 900, xx = rnd(j + 9) * SW; ctx.fillRect(xx - L / 2, y, L, 3 + rnd(j) * 6); } ctx.restore(); }
    } else if (kind === "zoom"){
      const x = off(depth); draw(x, side); const fc = focus[side] || [960, 520];
      const sc = out ? 1 + 2.2 * eIn(p * 2) : 1 + 1.1 * (1 - eOut((p - .5) * 2)), bl = out ? 16 * eIn(p * 2) : 12 * (1 - eOut((p - .5) * 2));
      ctx.save(); ctx.translate(fc[0], fc[1]); ctx.scale(sc, sc); ctx.translate(-fc[0], -fc[1]); if (bl > .5) ctx.filter = `blur(${bl.toFixed(1)}px)`; ctx.drawImage(OFF[depth], 0, 0, SW, SH); ctx.restore();
      const fl = 1 - Math.abs(p - .5) / .2; if (fl > 0){ ctx.save(); ctx.globalAlpha = clamp(fl, 0, 1) * .85; ctx.fillStyle = "#FFF4E6"; ctx.fillRect(0, 0, SW, SH); ctx.restore(); }
    } else if (kind === "iris"){
      draw(ctx, side); const fc = focus[side] || [960, 520];
      let r; if (out){ const q = p * 2; r = q < .55 ? lerp(2300, 230, easeIO(q / .55)) : q < .8 ? lerp(230, 200, (q - .55) / .25) : lerp(200, 0, eIn((q - .8) / .2)); } else r = lerp(0, 2300, eOut((p - .5) * 2));
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, SW, SH); ctx.moveTo(fc[0] + r, fc[1]); ctx.arc(fc[0], fc[1], Math.max(.1, r), 0, TAU, true); ctx.fillStyle = "#120A05"; ctx.fill("evenodd");
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(fc[0], fc[1], Math.max(.1, r), 0, TAU); if (r > 4) ctx.stroke(); ctx.restore();
    } else if (kind === "fade" || kind === "flash" || kind === "black" || kind === "dip"){
      draw(ctx, side); const a = out ? clamp(p * 2.3, 0, 1) : clamp((1 - p) * 2.3, 0, 1);
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = kind === "flash" ? "#FFF4E6" : "#120A05"; ctx.fillRect(0, 0, SW, SH); ctx.restore();
    } else draw(ctx, side);
  }

  function drawAdegan(ctx, i, t, depth){
    const A = EP.adegan[i]; G.scene = i; G.lt = t;
    let j = A.shots.length - 1; while (j > 0 && t < A.shots[j].at) j--;
    const sh = A.shots[j]; if (!sh){ ctx.fillStyle = "#120A05"; ctx.fillRect(0, 0, SW, SH); return; }
    // shot transition (inside the adegan)
    const nx = A.shots[j + 1], kin = sh.trans || "cut", kout = nx ? (nx.trans || "cut") : "cut";
    const Din = j ? (TRD[kin] ?? .4) : 0, Dout = nx ? (TRD[kout] ?? .4) : 0;
    let tr = null; if (Din && t - sh.at < Din / 2) tr = { a: A.shots[j - 1], b: sh, kind: kin, p: .5 + (t - sh.at) / Din };
    else if (Dout && nx.at - t < Dout / 2) tr = { a: sh, b: nx, kind: kout, p: .5 - (nx.at - t) / Dout };
    if (!tr) drawShot(ctx, A, sh, t);
    else transition(ctx, tr.kind, clamp(tr.p, 0, 1), (x, side) => drawShot(x, A, side ? tr.b : tr.a, t), [shotFocus(tr.a), shotFocus(tr.b)], depth + 1);
    if (A.fx) drawFx(ctx, S.CAM0, A, { fx: A.fx }, t, "screen");
  }
  const shotFocus = sh => { const f = sh && sh.focus; if (!f) return [960, 500]; const an = S.anchors[f]; return an ? an.head : [960, 500]; };

  /* ---------------- captions (YouTube style, 1 line, bottom centre) ---------------- */
  let CAP = [];
  function buildCaptions(){
    CAP = [];
    EP.adegan.forEach(A => { if (A.noCaption) return; const W = (A.words || []).map(w => ({ w: w.w, t: A.start + A.voOff + w.t, e: A.start + A.voOff + w.e }));
      let cur = null;
      W.forEach((w, k) => { const prev = W[k - 1], len = cur ? cur.words.reduce((a, x) => a + x.w.length + 1, 0) : 0;
        const brk = !cur || cur.words.length >= 7 || len + w.w.length > 44 || (prev && /[.?!…:;]["”]?$/.test(prev.w)) || (prev && /[,]["”]?$/.test(prev.w) && cur.words.length >= 4) || (prev && w.t - prev.e > .55);
        if (brk){ cur = { words: [], A: A.idx }; CAP.push(cur); } cur.words.push(w); });
    });
    CAP.forEach((c, k) => { c.t = c.words[0].t - .08; const nx = CAP[k + 1]; c.e = Math.min(c.words[c.words.length - 1].e + .45, nx ? nx.t : 1e9); });
  }
  function captions(ctx, T){
    const c = CAP.find(x => T >= x.t && T < x.e); if (!c) return; const A = EP.adegan[c.A]; if (A.noCaption) return;
    const size = 50, y = 1022; let active = -1; c.words.forEach((w, j) => { if (T >= w.t - .02) active = j; });
    font(ctx, 800, size, FAM); const sp = ctx.measureText(" ").width, ws = c.words.map(w => ctx.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let x = 960 - tot / 2; const a = clamp((T - c.t) / .12, 0, 1) * clamp((c.e - T) / .12, 0, 1);
    ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = "round"; ctx.miterLimit = 2;
    c.words.forEach((w, j) => { ctx.save(); const on = j === active, q = on ? clamp((T - w.t) / .12, 0, 1) : 0, s = on ? 1 + .06 * Math.sin(q * Math.PI) : 1;
      if (s !== 1){ ctx.translate(x + ws[j] / 2, y - size * .35); ctx.scale(s, s); ctx.translate(-(x + ws[j] / 2), -(y - size * .35)); }
      ctx.strokeStyle = "rgba(10,6,3,.55)"; ctx.lineWidth = 14; ctx.strokeText(w.w, x + 2, y + 4);
      ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.strokeText(w.w, x, y); ctx.fillStyle = on ? HL : "#FFFFFF"; ctx.fillText(w.w, x, y); ctx.restore(); x += ws[j] + sp; });
    ctx.restore();
  }
  S.captionAt = T => { const c = CAP.find(x => T >= x.t && T < x.e); return c ? c.words.map(w => w.w).join(" ") : ""; };

  /* ---------------- header (logo) + month chip ---------------- */
  function header(ctx, T, A, t){
    if (A.noHeader) return; const sh = A._cur; if (sh && (sh.noHeader || (sh.useLoc === false && sh.noHeader !== false))) return;
    const a = clamp((t - .2) / .5, 0, 1) * clamp((A.dur - t) / .3, 0, 1) * .92; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2;
    ctx.beginPath(); ctx.arc(62, 60, 30, 0, TAU); ctx.fillStyle = "rgba(255,246,234,.95)"; ctx.fill(); ctx.shadowColor = "transparent";
    if (S.logo && S.logo.complete && S.logo.naturalWidth){ const sz = 46, r = Math.min(sz / S.logo.naturalWidth, sz / S.logo.naturalHeight); ctx.drawImage(S.logo, 62 - S.logo.naturalWidth * r / 2, 60 - S.logo.naturalHeight * r / 2, S.logo.naturalWidth * r, S.logo.naturalHeight * r); }
    ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 8; S.text(ctx, "Tangani Talenta", 104, 71, 28, { w: 700 }); ctx.restore();
  }
  S.drawLogo = (ctx, x, y, sz) => { if (S.logo && S.logo.complete && S.logo.naturalWidth){ const r = Math.min(sz / S.logo.naturalWidth, sz / S.logo.naturalHeight); ctx.drawImage(S.logo, x - S.logo.naturalWidth * r / 2, y - S.logo.naturalHeight * r / 2, S.logo.naturalWidth * r, S.logo.naturalHeight * r); } };

  /* ---------------- frame ---------------- */
  S.frame = (ctx, T) => {
    S.frameId++;
    ctx.save(); ctx.textAlign = "left"; ctx.globalAlpha = 1; ctx.fillStyle = "#120A05"; ctx.fillRect(0, 0, SW, SH);
    const L = EP.adegan; let i = L.findIndex(A => T < A.end); if (i < 0) i = L.length - 1;
    const A = L[i], nx = L[i + 1];
    let tr = null;
    if (i > 0){ const k = A.trans || "fade", D = TRD[k] ?? .5; if (D && T - A.start < D / 2) tr = { a: i - 1, b: i, kind: k, p: .5 + (T - A.start) / D }; }
    if (!tr && nx){ const k = nx.trans || "fade", D = TRD[k] ?? .5; if (D && nx.start - T < D / 2) tr = { a: i, b: i + 1, kind: k, p: .5 - (nx.start - T) / D }; }
    if (!tr) drawAdegan(ctx, i, T - A.start, 0);
    else transition(ctx, tr.kind, clamp(tr.p, 0, 1), (x, side) => { const k = side ? tr.b : tr.a; drawAdegan(x, k, T - L[k].start, 1); },
      [shotFocus(L[tr.a]._cur), shotFocus(L[tr.b]._cur)], 0);
    G.scene = i; header(ctx, T, A, T - A.start);
    const capA = tr ? clamp((Math.abs(tr.p - .5) - .25) * 6, 0, 1) : 1; if (capA > 0){ ctx.save(); ctx.globalAlpha = capA; captions(ctx, T); ctx.restore(); }
    ctx.restore();
  };
  S.ambience = () => { const out = []; EP.adegan.forEach(A => A.shots.forEach(sh => { const loc = sh.amb || sh.loc || A.loc || (sh.split && sh.split[1] && sh.split[1].loc) || (sh.split && sh.split[0].loc); if (loc && sh.amb !== false) out.push({ t0: A.start + sh.at, t1: A.start + sh.end, kind: loc }); })); return out; };
  S.moods = () => EP.adegan.map(A => ({ t0: A.start + (A.musicFrom || 0), t1: A.end - (A.musicCut || 0), mood: A.music || "none" }));
  S.adegan = () => EP.adegan.map(A => ({ n: A.n, name: A.name, start: A.start, end: A.end, shots: A.shots.map(s => s.at) }));
  // grab n frames starting at frame index f0 as JPEG base64 strings (render driver)
  let GCV = null;
  S.grab = (f0, n, fps, q, scale) => { scale = scale || 1;
    if (!GCV || GCV.width !== Math.round(SW * scale)){ GCV = document.createElement("canvas"); GCV.width = Math.round(SW * scale); GCV.height = Math.round(SH * scale); }
    const x = GCV.getContext("2d"), out = [];
    for (let k = 0; k < n; k++){ x.setTransform(scale, 0, 0, scale, 0, 0); S.frame(x, (f0 + k) / fps); out.push(GCV.toDataURL("image/jpeg", q || .92).slice(23)); }
    return out; };
  S.grabAt = (ts, q, scale, fmt) => { scale = scale || 1; const c = document.createElement("canvas"); c.width = Math.round(SW * scale); c.height = Math.round(SH * scale); const x = c.getContext("2d");
    return ts.map(T => { x.setTransform(scale, 0, 0, scale, 0, 0); S.frame(x, T); return fmt === "png" ? c.toDataURL("image/png").slice(22) : c.toDataURL("image/jpeg", q || .9).slice(23); }); };

  /* ---------------- SFX events for the audio mix ---------------- */
  function buildEvents(){
    const ev = S.events = [], add = (t, type, vol, dur, x) => { if (t >= 0) ev.push(Object.assign({ t: +t.toFixed(3), type, vol: vol ?? 1, dur: dur || 0 }, x || {})); };
    EP.adegan.forEach((A, i) => {
      const g = x => A.start + x;
      if (i > 0){ const k = A.trans || "fade"; if (k === "whip" || k === "zoom" || k === "slide") add(A.start - .05, "whoosh", .8); if (k === "iris") add(A.start - .2, "whoosh", .4); }
      (A.sfx || []).forEach(s => add(g(s.at || 0), s.type, s.vol, s.dur, s.x));
      (A.fx || []).forEach(f => { const def = S.FX[f.type]; if (f.sfx) add(g(f.at || 0), f.sfx, f.sfxVol ?? .7); else if (def && def.sfx) def.sfx(f, x => g(x), add, A, null); });
      (A.lines || []).forEach(L => { if (L.bubble !== "none") add(g(L.t0), "pop", .7); });
      A.shots.forEach((sh, j) => {
        if (j && (sh.trans === "whip" || sh.trans === "zoom")) add(g(sh.at) - .05, "whoosh", .6);
        (sh.cam || []).forEach(k => { if (k.shake) add(g(k.at || 0), "thud", .5); });
        const acts = (sh.actors ?? (sh.loc && sh.loc !== A.loc ? [] : (A.actors || []))).concat(sh.addActors || [], ...(sh.split || []).map(p => p.actors || []));
        acts.forEach(a => (a.keys || []).forEach(k => { const T = g(k.at || 0); if (T < g(sh.at) || T > g(sh.end)) return;
          if (k.jump) add(T + .1, "boing", .35); if (k.expr === "shock") add(T, "ping", .6); if (k.emote === "idea" || k.emote === "check") add(T, "chime", .5);
          if (k.emote === "!" || k.emote === "?" || k.emote === "!!" || k.emote === "?!") add(T, "pop", .5); }));
        (sh.fx || []).concat(...(sh.split || []).map(p => p.fx || [])).forEach(f => { const def = S.FX[f.type]; if (f.sfx) add(g(f.at || 0) + (f.sfxD || 0), f.sfx, f.sfxVol ?? .7); else if (def && def.sfx) def.sfx(f, x => g(x), add, A, sh); });
        (sh.props || []).forEach(p => { if (p.at > sh.at + .05 && p.pop !== false) add(g(p.at), "pop", .4); });
        if (j && !sh.trans && !(sh.split)) add(g(sh.at), "click", .12);
      });
    });
    ev.sort((a, b) => a.t - b.t);
  }
})();
