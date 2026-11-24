/* Tangani motion pack for Studio Explainer 9:16 (style C).
   Loaded after the engine's own script: it overrides theme/drawBg/drawChip/enter/drawRich/drawFrame
   (classic-script globals) to make every video livelier and different, while keeping Tangani's colours:
     - animated background decor (blobs, dots, confetti, stripes, rings, waves) + a corner accent per scene
     - scene transitions (iris, swipe, bars, diamond overlays; push and zoom moves)
     - slow camera move per scene (zoom in/out or drift) and a gentle float
     - per-word headline reveal and an animated marker/underline/circle on the highlighted phrase
     - entrance styles remapped per video, extra life in statement/steps/cta scenes
     - logo chip with the brand url under the series label
   The look is chosen from the project id (episode code), so each episode differs but stays stable on re-render.
   Override in project.json: "motion": {"deco","transition","enter"(0-3),"words","mark","camera","bg"}. */
/* Registry for extra scene packs (engine/packs/*.js, each in its own <script>):
     TT.layout(name, label, drawFn(ctx, th, s, t), sfxFn(s, f, i, add), fields)
   Helpers from this pack are exposed on TT once it has loaded (TT.cueT, TT.popS, TT.drawActor, ...). */
window.TT = { sfx: {}, layout(name, labelText, draw, sfx, fields){ R[name] = draw; LAYOUTS[name] = labelText; FIELD_DEFS[name] = fields || [["headline", "Judul (opsional)", "area"], ["highlight", "Kata yang diwarnai", "text"]]; if (sfx) this.sfx[name] = sfx; } };
(() => {
  'use strict';
  const PAL = ["#C2691F", "#D97F2C", "#E89544", "#A0522D", "#F4A85C", "#B87333"];
  const BGS = ["#FBE9D7", "#FAF1E6", "#F8EADB", "#FDF0E1", "#F6E7D6"];
  const DECOS = ["blobs", "dots", "confetti", "stripes", "rings", "waves"];
  const TRANS = ["iris", "swipe", "bars", "diamond", "push", "zoom"];
  const ENTER = [
    { up: "up", left: "left", pop: "pop" },
    { up: "rise", left: "swing", pop: "spring" },
    { up: "zoom", left: "fromLeft", pop: "flip" },
    { up: "drop", left: "swing", pop: "spin" },
  ];
  const WORDS = ["rise", "pop", "slide"];
  const MARKS = ["marker", "underline", "circle"];
  const CAMS = ["in", "out", "drift"];
  // One fixed look per series (= per day of the week), all in the Tangani palette.
  const FONT = { poppins: "Poppins", jakarta: "'Plus Jakarta Sans'", inter: "Inter" };
  const STYLES = {
    SB: { name: "Pagi Bertumbuh", bg: "#FBE9D7", deco: "sunrise",   trans: ["iris", "diamond"], enter: 1, words: "rise",  mark: "marker",    cam: "in",    fam: FONT.poppins, sub: "chip" },
    SP: { name: "Papan Tugas",    bg: "#EFE0CB", deco: "board",     trans: ["page", "bars"],    enter: 2, words: "slide", mark: "underline", cam: "drift", fam: FONT.jakarta, sub: "tape", card: "note", hook: "checklist", steps: "checkbox" },
    RN: { name: "Ruang Chat",     bg: "#F3E6D6", deco: "chatwall",  trans: ["iris", "push"],    enter: 1, words: "pop",   mark: "circle",    cam: "in",    fam: FONT.poppins, sub: "bubble", card: "bubble", hook: "chat" },
    KD: { name: "Digital Malam",  bg: "#0C0A07", deco: "circuit",   trans: ["glitch", "swipe"], enter: 3, words: "slide", mark: "underline", cam: "drift", fam: FONT.inter,   sub: "chip", base: "B" },
    JS: { name: "Solusi",         bg: "#FBEFE3", deco: "blueprint", trans: ["swipe", "bars"],   enter: 2, words: "rise",  mark: "marker",    cam: "out",   fam: FONT.jakarta, sub: "accent", card: "sharp",  hook: "whiteboard" },
    SC: { name: "Finansial",      bg: "#FAF1E6", deco: "coins",     trans: ["zoom", "diamond"], enter: 0, words: "pop",   mark: "underline", cam: "in",    fam: FONT.poppins, sub: "center", card: "coupon", hook: "receipt" },
    MS: { name: "Sehat",          bg: "#FDF3EA", deco: "calm",      trans: ["push", "iris"],    enter: 1, words: "rise",  mark: "circle",    cam: "drift", fam: FONT.jakarta, sub: "soft",   card: "soft",   hook: "night" },
  };
  // Kuartal 2 (episode number 14–26 in P.id, e.g. "sb14"): a second look per series. Episodes 1–13 keep STYLES above.
  // New pieces only: decos sketch/focus/limelight/archive/roads/garden/meadow, transitions scribble/fold/shutter/ink/curtain/
  // wave/pixel/blinds/arrow/coinfill/cloud, subtitles notebook/viewfinder/onair/filetab/signpost/jarlabel/cloud,
  // words drop/fade/tilt, marks scribble/bracket/wavy/box/arrow, camera pan/breathe, entrance sets 4–5, subtitle font (subFam).
  const ENTER_Q2 = [
    { up: "float", left: "slideR", pop: "bloom" },
    { up: "unfold", left: "slideR", pop: "stamp" },
  ];
  const ENTER_ALL = ENTER.concat(ENTER_Q2);
  const STYLES_Q2 = {
    SB: { name: "Ruang Belajar",   bg: "#FAF3E8", deco: "sketch",    trans: ["scribble", "fold"], enter: 5, words: "drop",  mark: "scribble", cam: "pan",     fam: FONT.jakarta, subFam: FONT.inter,   sub: "notebook" },
    SP: { name: "Fokus",           bg: "#F7EBDD", deco: "focus",     trans: ["shutter", "ink"],   enter: 4, words: "fade",  mark: "bracket",  cam: "out",     fam: FONT.inter,   subFam: FONT.jakarta, sub: "viewfinder" },
    RN: { name: "Panggung Bicara", bg: "#F6E6D5", deco: "limelight", trans: ["curtain", "wave"],  enter: 3, words: "tilt",  mark: "wavy",     cam: "drift",   fam: FONT.jakarta, subFam: FONT.poppins, sub: "onair" },
    KD: { name: "Arsip Data",      bg: "#0E0B08", deco: "archive",   trans: ["pixel", "blinds"],  enter: 1, words: "rise",  mark: "box",      cam: "in",      fam: FONT.poppins, subFam: FONT.inter,   sub: "filetab", base: "B" },
    JS: { name: "Persimpangan",    bg: "#FBF0E2", deco: "roads",     trans: ["arrow", "fold"],    enter: 0, words: "pop",   mark: "arrow",    cam: "pan",     fam: FONT.inter,   subFam: FONT.poppins, sub: "signpost" },
    SC: { name: "Celengan Tumbuh", bg: "#F9EEDF", deco: "garden",    trans: ["coinfill", "ink"],  enter: 2, words: "slide", mark: "marker",   cam: "out",     fam: FONT.jakarta, subFam: FONT.inter,   sub: "jarlabel" },
    MS: { name: "Taman Tenang",    bg: "#FBF4EC", deco: "meadow",    trans: ["cloud", "wave"],    enter: 4, words: "fade",  mark: "wavy",     cam: "breathe", fam: FONT.poppins, subFam: FONT.jakarta, sub: "cloud", trCol: { wave: ["#EDBF92", "#F6DCC1"] } },
  };
  const epNum = () => { const m = String(P.id || P.name || "").match(/(\d+)/); return m ? +m[1] : 0; };
  const G = { lt: 0, scene: 0, enterStart: null };
  // Canvas only loads a font weight when first used, so rarely used weights (e.g. card descriptions) fell back
  // to a serif face. Load them all up front.
  try { for (const fam of ["Poppins", "Plus Jakarta Sans", "Inter"]) for (const w of [500, 600, 700, 800]) document.fonts.load(`${w} 30px "${fam}"`); } catch (e) { /* no FontFaceSet */ }
  const TAU = Math.PI * 2;

  const easeIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eElastic = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (TAU / 3)) + 1;
  function hash(s){ let h = 2166136261; for (const c of String(s)){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed){ let a = seed || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  let MV = null, MVkey = "";
  function mv(){
    const o = P.motion || {};
    const key = (P.id || P.name || "") + JSON.stringify(o);
    if (MV && MVkey === key) return MV;
    const r = rng(hash(key)); const pick = a => a[Math.floor(r() * a.length)];
    const a0 = Math.floor(r() * PAL.length);
    const n = epNum(), q2 = o.quarter != null ? +o.quarter === 2 : (n >= 14 && n <= 26);
    const st = (q2 ? STYLES_Q2 : STYLES)[String(P.series || P.id || "").slice(0, 2).toUpperCase()] || null;
    if (st) P.style = st.base || "C";
    const t1 = o.transition || (st ? st.trans[0] : pick(TRANS)); let t2 = st ? st.trans[1] : pick(TRANS); if (t2 === t1) t2 = TRANS[(TRANS.indexOf(t1) + 2) % TRANS.length];
    MV = {
      cardStyle: st && st.card, hookStyle: st && st.hook, stepsStyle: st && st.steps,
      style: st ? st.name : "acak", fam: o.font ? (FONT[o.font] || o.font) : (st ? st.fam : null), sub: o.subtitle || (st ? st.sub : "chip"),
      bg: o.bg || (st ? st.bg : pick(BGS)), deco: o.deco || (st ? st.deco : pick(DECOS)), trans: [t1, o.transition || t2],
      enter: ENTER_ALL[o.enter != null ? o.enter : (st ? st.enter : Math.floor(r() * ENTER.length))],
      words: o.words || (st ? st.words : pick(WORDS)), mark: o.mark || (st ? st.mark : pick(MARKS)), cam: o.camera || (st ? st.cam : pick(CAMS)),
      pal: PAL.slice(a0).concat(PAL.slice(0, a0)), corner: Math.floor(r() * 4), seed: r(),
      parts: Array.from({ length: 26 }, () => ({ x: r() * 1080, y: r() * 2000, s: 12 + r() * 22, v: 18 + r() * 38, rot: r() * TAU,
        vr: (r() - .5) * 1.4, k: Math.floor(r() * 4), c: Math.floor(r() * 6), ph: r() * TAU })),
      traces: Array.from({ length: 9 }, () => { let x = Math.round(r() * 18) * 60, y = Math.round(r() * 32) * 60; const pts = [[x, y]];
        for (let k = 0; k < 4; k++){ if (k % 2) y += (r() < .5 ? -1 : 1) * (2 + Math.floor(r() * 5)) * 60; else x += (r() < .5 ? -1 : 1) * (2 + Math.floor(r() * 5)) * 60; pts.push([x, y]); }
        return { pts, off: r(), sp: .12 + r() * .15 }; }),
      burst: Array.from({ length: 28 }, () => ({ a: -Math.PI / 2 + (r() - .5) * 2.6, v: 500 + r() * 700, s: 10 + r() * 14, k: Math.floor(r() * 3), c: Math.floor(r() * 6), vr: (r() - .5) * 10 })),
    };
    if (q2 && st) Object.assign(MV, { q2: true, subFam: o.subFont ? (FONT[o.subFont] || o.subFont) : st.subFam, fl: floaters(key), trCol: st.trCol || null });
    MVkey = key; return MV;
  }
  window.motionInfo = () => { const m = mv(); return { style: m.style, quarter: m.q2 ? 2 : 1, font: m.fam, subFont: m.subFam || m.fam, subtitle: m.sub, bg: m.bg, deco: m.deco, transitions: m.trans, enter: ENTER_ALL.indexOf(m.enter), words: m.words, mark: m.mark, camera: m.cam }; };

  /* ---------- theme + background ---------- */
  const _theme = theme;
  theme = function(){
    const m = mv(), th = _theme();
    if (th && th.key === "C"){ th.bg = m.bg; if (m.fam) th.fam = m.fam; }
    if (th && th.key === "B"){ // dark mode of talenta.tangani.id instead of the engine's navy
      Object.assign(th, { bg: m.bg || "#0C0A07", ink: "#FAF8F3", muted: "#B8AE9D", card: "rgba(36,31,24,.94)", line: "rgba(232,149,68,.28)",
        accent: "#E08A3C", accent2: "#C2691F", subBg: "rgba(12,10,7,.78)", subInk: "#FAF8F3", teal: "#A0522D" });
      if (m.fam) th.fam = m.fam;
    }
    return th;
  };

  function shape(ctx, k, s){
    ctx.beginPath();
    if (k === 0){ ctx.arc(0, 0, s / 2, 0, TAU); ctx.fill(); }
    else if (k === 1){ ctx.moveTo(0, -s / 2); ctx.lineTo(s / 2, s / 2); ctx.lineTo(-s / 2, s / 2); ctx.closePath(); ctx.fill(); }
    else if (k === 2){ ctx.lineWidth = s / 4; ctx.lineCap = "round"; ctx.moveTo(-s / 2, 0); ctx.quadraticCurveTo(-s / 4, -s / 2, 0, 0); ctx.quadraticCurveTo(s / 4, s / 2, s / 2, 0); ctx.stroke(); }
    else { ctx.lineWidth = s / 5; ctx.arc(0, 0, s / 2.4, 0, TAU); ctx.stroke(); }
  }

  function deco(ctx, M, t){
    if (DECO_Q2[M.deco] && M.fl) return DECO_Q2[M.deco](ctx, M, t);
    const P0 = M.pal[0], P1 = M.pal[1], P2 = M.pal[2];
    if (M.deco === "blobs"){
      [P0, P1, P2].forEach((c, j) => {
        const cx = 540 + Math.sin(t * .23 + j * 2.1 + M.seed * 6) * 420, cy = 960 + Math.cos(t * .19 + j * 1.7 + M.seed * 3) * 760, rad = 420 + Math.sin(t * .5 + j) * 70;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, hexA(c, .2)); g.addColorStop(1, hexA(c, 0));
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
    } else if (M.deco === "dots"){
      const sp = 60, off = (t * 14) % sp; ctx.fillStyle = hexA(P0, .2);
      for (let y = -sp; y < H + sp; y += sp) for (let x = -sp; x < W + sp; x += sp){
        const r = 2.6 + 1.8 * Math.sin(t * 1.6 + (x + y) * .008);
        ctx.beginPath(); ctx.arc(x + off, y + off, Math.max(.5, r), 0, TAU); ctx.fill();
      }
    } else if (M.deco === "confetti"){
      for (const p of M.parts){
        const y = ((p.y - t * p.v) % 2050 + 2050) % 2050 - 60, x = p.x + Math.sin(t * .8 + p.ph) * 30;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot + t * p.vr); ctx.globalAlpha = .3;
        ctx.fillStyle = ctx.strokeStyle = M.pal[p.c % 6]; shape(ctx, p.k, p.s); ctx.restore();
      }
    } else if (M.deco === "stripes"){
      ctx.save(); ctx.translate(540, 960); ctx.rotate(-Math.PI / 6); ctx.fillStyle = hexA(P0, .07);
      const off = (t * 26) % 160; for (let x = -1500 + off; x < 1500; x += 160) ctx.fillRect(x, -1400, 70, 2800); ctx.restore();
    } else if (M.deco === "rings"){
      ctx.lineWidth = 4;
      [[1010, 1820], [70, 140]].forEach(([cx, cy], j) => {
        for (let k = 0; k < 9; k++){ const r = (k * 150 + t * 45 + j * 75) % 1350; ctx.strokeStyle = hexA(j ? P1 : P0, .18 * (1 - r / 1350));
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); }
      });
    } else if (M.deco === "sunrise"){
      const g = ctx.createRadialGradient(540, 2020, 0, 540, 2020, 1100); g.addColorStop(0, hexA(P1, .3)); g.addColorStop(.55, hexA(P2, .12)); g.addColorStop(1, hexA(P2, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(540, 2020); ctx.rotate(t * .04); ctx.fillStyle = hexA(P0, .06);
      for (let k = 0; k < 16; k++){ ctx.rotate(TAU / 16); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(0, -1500); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.beginPath(); ctx.arc(540, 2020, 330 + Math.sin(t * .9) * 12, 0, TAU); ctx.fillStyle = hexA(P0, .14); ctx.fill();
      for (const p of M.parts.slice(0, 14)){ const y = ((p.y - t * p.v * .8) % 2050 + 2050) % 2050 - 60, x = p.x + Math.sin(t * .7 + p.ph) * 40;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot + Math.sin(t + p.ph) * .5); ctx.fillStyle = hexA(M.pal[p.c % 3], .28);
        ctx.beginPath(); ctx.ellipse(0, 0, p.s * .45, p.s, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    } else if (M.deco === "grid"){
      const sp = 54, oy = (t * 8) % sp; ctx.lineWidth = 2;
      for (let x = 0; x <= W; x += sp){ ctx.strokeStyle = hexA(P0, (x / sp) % 5 ? .1 : .18); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = -sp + oy; y <= H; y += sp){ ctx.strokeStyle = hexA(P0, .1); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = hexA(P0, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(66, 0); ctx.lineTo(66, H); ctx.stroke();
      for (let y = 140; y < H; y += 150){ ctx.beginPath(); ctx.arc(32, y, 11, 0, TAU); ctx.fillStyle = "rgba(59,36,24,.13)"; ctx.fill(); }
    } else if (M.deco === "bubbles"){
      for (const p of M.parts.slice(0, 16)){
        const y = ((p.y - t * p.v * .7) % 2100 + 2100) % 2100 - 80, x = p.x + Math.sin(t * .6 + p.ph) * 34, w = p.s * 4.2, h = p.s * 2.6;
        ctx.save(); ctx.translate(x, y); ctx.globalAlpha = .32; ctx.strokeStyle = M.pal[p.c % 3]; ctx.fillStyle = hexA(M.pal[p.c % 3], .08); ctx.lineWidth = 4;
        rr(ctx, -w / 2, -h / 2, w, h, h / 2.4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); const tx = p.k % 2 ? -w / 4 : w / 4; ctx.moveTo(tx - 10, h / 2 - 2); ctx.lineTo(tx + (p.k % 2 ? -12 : 12), h / 2 + 16); ctx.lineTo(tx + 10, h / 2 - 2); ctx.fill(); ctx.stroke();
        if (p.k === 0){ ctx.fillStyle = M.pal[p.c % 3]; for (let d = 0; d < 3; d++){ ctx.globalAlpha = .25 + .35 * Math.max(0, Math.sin(t * 5 - d * .9)); ctx.beginPath(); ctx.arc((d - 1) * p.s * .9, 0, p.s * .22, 0, TAU); ctx.fill(); } }
        ctx.restore();
      }
    } else if (M.deco === "circuit"){
      ctx.lineWidth = 4; ctx.lineJoin = "round";
      for (const tr of M.traces){
        ctx.strokeStyle = hexA(P0, .22); ctx.beginPath(); tr.pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
        ctx.fillStyle = hexA(P0, .22); for (const [x, y] of [tr.pts[0], tr.pts[tr.pts.length - 1]]){ ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); }
        // a pulse running along the trace
        const segs = []; let L = 0; for (let k = 1; k < tr.pts.length; k++){ const [a, b] = [tr.pts[k - 1], tr.pts[k]]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, l]); L += l; }
        let d = ((t * tr.sp + tr.off) % 1) * L;
        for (const [a, b, l] of segs){ if (d <= l){ const q = d / l, px = a[0] + (b[0] - a[0]) * q, py = a[1] + (b[1] - a[1]) * q;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 26); g.addColorStop(0, hexA(P1, .75)); g.addColorStop(1, hexA(P1, 0)); ctx.fillStyle = g; ctx.fillRect(px - 26, py - 26, 52, 52); break; } d -= l; }
      }
      const sy = (t * 160) % (H + 400) - 200, g2 = ctx.createLinearGradient(0, sy - 120, 0, sy + 120); g2.addColorStop(0, hexA(P1, 0)); g2.addColorStop(.5, hexA(P1, .07)); g2.addColorStop(1, hexA(P1, 0));
      ctx.fillStyle = g2; ctx.fillRect(0, sy - 120, W, 240);
    } else if (M.deco === "blueprint"){
      ctx.fillStyle = hexA(P0, .24); for (let y = 20; y < H; y += 40) for (let x = 20; x < W; x += 40){ ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); }
      const gear = (cx, cy, R, n, a, c) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.beginPath();
        for (let k = 0; k < n * 2; k++){ const ang = k * Math.PI / n, r1 = k % 2 ? R : R * 1.16; ctx.lineTo(Math.cos(ang - .12) * r1, Math.sin(ang - .12) * r1); ctx.lineTo(Math.cos(ang + .12) * r1, Math.sin(ang + .12) * r1); }
        ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, R * .42, 0, TAU); ctx.stroke(); ctx.restore(); };
      gear(1010, 1700, 190, 12, t * .25, hexA(P0, .16)); gear(800, 1880, 110, 9, -t * .42 + .2, hexA(P1, .18)); gear(60, 120, 150, 10, -t * .2, hexA(P0, .12));
      ctx.setLineDash([14, 14]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = hexA(P0, .14); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(1010, 1700, 330, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    } else if (M.deco === "coins"){
      for (const p of M.parts.slice(0, 18)){
        const y = ((p.y + t * p.v * .9) % 2100 + 2100) % 2100 - 80, x = p.x + Math.sin(t * .5 + p.ph) * 20, R = p.s * 1.2, sx = Math.abs(Math.cos(t * 1.6 + p.ph));
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot * .2); ctx.scale(Math.max(.12, sx), 1); ctx.globalAlpha = .34;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fillStyle = M.pal[p.c % 3]; ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, R * .7, 0, TAU); ctx.strokeStyle = "#FFF7EE"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      }
    } else if (M.deco === "calm"){
      const br = .5 + .5 * Math.sin(t * .75);
      [[540, 1020, 460, P1], [540, 1020, 300, P2]].forEach(([cx, cy, R, c]) => { ctx.beginPath(); ctx.arc(cx, cy, R + br * 60, 0, TAU); ctx.fillStyle = hexA(c, .08); ctx.fill(); });
      for (let k = 0; k < 3; k++){
        const base = 1700 + k * 80, amp = 30 - k * 6;
        ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, base + Math.sin(x * .005 + t * (.6 + k * .15) + k) * amp); ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = hexA(M.pal[k], .1); ctx.fill();
      }
    } else if (M.deco === "chatwall"){
      const names = ["chat", "heart", "star", "check", "phone", "clock"], sp = 150, off = (t * 6) % sp;
      for (let r = -1; r < H / sp + 1; r++) for (let c = -1; c < W / sp + 1; c++){
        const x = c * sp + (r % 2 ? sp / 2 : 0) + off * .5, y = r * sp + off, nm = names[Math.abs(r * 7 + c * 3) % names.length];
        ctx.save(); ctx.translate(x + 30, y + 30); ctx.rotate(((r + c) % 3 - 1) * .25); icon(ctx, nm, -24, -24, 48, hexA(M.pal[(((r + c) % 3) + 3) % 3], .14), 2); ctx.restore();
      }
    } else if (M.deco === "board"){
      ctx.fillStyle = "rgba(160,82,45,.10)"; for (const p of M.parts) for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.arc((p.x * (k + 1) * 7.3) % W, (p.y * (k + 3) * 3.1) % H, 1.6 + (k % 3), 0, TAU); ctx.fill(); }
      const note = (x, y, w, r, c, k) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r + Math.sin(t * .8 + k) * .02);
        ctx.fillStyle = "rgba(59,36,24,.10)"; ctx.fillRect(-w / 2 + 8, -w / 2 + 12, w, w); ctx.fillStyle = c; ctx.fillRect(-w / 2, -w / 2, w, w);
        ctx.fillStyle = "rgba(59,36,24,.12)"; for (let l = 0; l < 3; l++) ctx.fillRect(-w / 2 + 24, -w / 2 + 50 + l * 34, w - 48 - l * 30, 8);
        ctx.beginPath(); ctx.arc(0, -w / 2 + 16, 11, 0, TAU); ctx.fillStyle = "#A0522D"; ctx.fill(); ctx.restore(); };
      note(1010, 470, 190, .12, hexA(M.pal[4], .55), 1); note(70, 1730, 210, -.1, hexA(M.pal[2], .5), 2); note(1000, 1850, 170, .2, hexA(M.pal[1], .4), 3);
    } else if (M.deco === "waves"){
      for (let k = 0; k < 4; k++){
        const base = k < 2 ? 1720 + k * 70 : 120 + (k - 2) * 60, amp = 34 - k * 4, c = M.pal[k % 3];
        ctx.beginPath(); ctx.moveTo(0, k < 2 ? H : 0);
        for (let x = 0; x <= W; x += 20) ctx.lineTo(x, base + Math.sin(x * .006 + t * (1 + k * .2) + k * 1.3) * amp);
        ctx.lineTo(W, k < 2 ? H : 0); ctx.closePath(); ctx.fillStyle = hexA(c, .09); ctx.fill();
      }
    }
  }

  /* ---------- Kuartal 2 (episode 14–26, STYLES_Q2): backgrounds, subtitles and transitions ----------
     Everything here is only reached through the names used by STYLES_Q2, so the look of episodes 1–13 is unchanged. */
  const C0 = PAL[0], C1 = PAL[1], C2 = PAL[2], C3 = PAL[3], C4 = PAL[4];
  const cyc = (t, per, off) => ((((t + off) % per) + per) % per) / per;
  const frac = x => { const v = Math.sin(x) * 43758.5453; return v - Math.floor(v); };
  function floaters(key){ const r = rng(hash(key + "|q2"));
    return Array.from({ length: 18 }, () => ({ x: r() * 1080, y: r() * 1920, s: .7 + r() * .6, v: 8 + r() * 14, ph: r() * TAU, k: Math.floor(r() * 4), c: Math.floor(r() * 3), rot: (r() - .5) * .6 })); }
  function cubicPts(segs, n){ const out = []; segs.forEach(([a, b, c, d], k) => { for (let i = k ? 1 : 0; i <= n; i++){ const u = i / n, v = 1 - u;
    out.push([v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]); } }); return out; }
  function polyLen(pts){ let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function alongPts(pts, d){ for (let i = 1; i < pts.length; i++){ const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= l){ const q = d / l; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * q, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * q]; } d -= l; } return pts[pts.length - 1]; }
  function strokePts(ctx, pts){ ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }

  // pencil doodles for "Ruang Belajar" (unit size ~100px), drawn on progressively (d 0..1)
  const DOODLE_LEN = { bulb: 420, star: 460, arrow: 260, spiral: 1000, check: 300, squiggle: 170, plus: 120 };
  function doodle(ctx, k, d){
    ctx.beginPath();
    if (k === "bulb"){ ctx.arc(0, -20, 34, Math.PI * .8, Math.PI * 2.2); ctx.lineTo(15, 30); ctx.lineTo(-15, 30); ctx.closePath(); ctx.moveTo(-13, 42); ctx.lineTo(13, 42); ctx.moveTo(-9, 53); ctx.lineTo(9, 53);
      for (let a = 0; a < 5; a++){ const an = -Math.PI * .9 + a * Math.PI * .2; ctx.moveTo(Math.cos(an) * 50, -20 + Math.sin(an) * 50); ctx.lineTo(Math.cos(an) * 66, -20 + Math.sin(an) * 66); } }
    else if (k === "star"){ for (let i = 0; i <= 5; i++){ const a = -Math.PI / 2 + i * Math.PI * 4 / 5, x = Math.cos(a) * 44, y = Math.sin(a) * 44; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }
    else if (k === "arrow"){ ctx.moveTo(-60, 30); ctx.bezierCurveTo(-20, -50, 30, 60, 60, -20); ctx.moveTo(60, -20); ctx.lineTo(36, -14); ctx.moveTo(60, -20); ctx.lineTo(60, 5); }
    else if (k === "spiral"){ for (let a = 0; a < TAU * 2.6; a += .2){ const r = 4 + a * 7, x = Math.cos(a) * r, y = Math.sin(a) * r; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }
    else if (k === "check"){ ctx.rect(-34, -34, 68, 68); ctx.moveTo(-20, 0); ctx.lineTo(-4, 18); ctx.lineTo(30, -28); }
    else if (k === "squiggle"){ ctx.moveTo(-50, 0); for (let x = -50; x <= 50; x += 5) ctx.lineTo(x, Math.sin(x * .16) * 12); }
    else { ctx.moveTo(-40, -20); ctx.lineTo(-10, -20); ctx.moveTo(-25, -35); ctx.lineTo(-25, -5); ctx.moveTo(8, -26); ctx.lineTo(40, -26); ctx.moveTo(8, -14); ctx.lineTo(40, -14); ctx.moveTo(-40, 24); ctx.quadraticCurveTo(0, 6, 40, 24); }
    const L = DOODLE_LEN[k] || 300; ctx.setLineDash([Math.max(.01, L * d), L * 3]); ctx.stroke(); ctx.setLineDash([]);
  }
  let ROADS = null;
  function roadPts(){
    if (ROADS) return ROADS;
    const main = cubicPts([[[540, 1990], [540, 1880], [540, 1760], [540, 1690]]], 20);
    const left = cubicPts([[[540, 1690], [530, 1605], [330, 1620], [150, 1560]], [[150, 1560], [40, 1520], [36, 1320], [36, 1020]], [[36, 1020], [36, 720], [36, 420], [36, 250]]], 28);
    const right = cubicPts([[[540, 1690], [550, 1605], [750, 1620], [930, 1560]], [[930, 1560], [1040, 1520], [1044, 1320], [1044, 1020]], [[1044, 1020], [1044, 720], [1044, 420], [1044, 250]]], 28);
    const rL = main.concat(left.slice(1)), rR = main.concat(right.slice(1));
    return (ROADS = { main, left, right, rL, rR, LL: polyLen(rL), LR: polyLen(rR) });
  }
  function leaf(ctx, s, col){ ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * .62, s, 0); ctx.quadraticCurveTo(0, s * .62, -s, 0); ctx.fillStyle = col; ctx.fill(); }
  function cloudShape(ctx, x, y, s){ ctx.beginPath(); [[0, 0, 52], [50, -30, 64], [112, -8, 54], [158, 12, 38], [62, 18, 50]].forEach(([dx, dy, r]) => { ctx.moveTo(x + (dx + r) * s, y + dy * s); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); }); ctx.rect(x - 10 * s, y + 10 * s, 170 * s, 46 * s); }

  const DECO_Q2 = {
    // SB Ruang Belajar: ruled paper, pencil doodles that draw themselves and fade, a light bulb that glows
    sketch(ctx, M, t){
      ctx.lineWidth = 2; ctx.strokeStyle = hexA(C0, .075);
      for (let y = 226; y < H - 40; y += 74){ ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const DD = [["bulb", 125, 1640, 1, 0], ["arrow", 335, 1655, .9, 2.5], ["star", 560, 1628, .8, 5], ["spiral", 780, 1655, .55, 7.5], ["check", 965, 1632, .8, 1.2],
        ["squiggle", 1038, 990, .6, 3.7], ["plus", 50, 760, .7, 6.2], ["star", 995, 214, .45, 8.6], ["bulb", 58, 1180, .55, 4.4]];
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (const [k, x, y, s, off] of DD){
        const u = cyc(t, 10, off), d = eOut(clamp(u / .24, 0, 1)), a = u < .82 ? 1 : 1 - (u - .82) / .18;
        if (k === "bulb" && s === 1 && d > .6){ const gl = ctx.createRadialGradient(x, y - 20, 0, x, y - 20, 130); gl.addColorStop(0, hexA(C4, .32 * a * (.65 + .35 * Math.sin(t * 2.2)))); gl.addColorStop(1, hexA(C4, 0)); ctx.fillStyle = gl; ctx.fillRect(x - 130, y - 150, 260, 260); }
        ctx.save(); ctx.translate(x, y + Math.sin(t * .6 + off) * 3); ctx.rotate(Math.sin(off * 3) * .15); ctx.scale(s, s);
        ctx.globalAlpha *= .34 * a; ctx.strokeStyle = "#7A4A2C"; ctx.lineWidth = 5 / s; doodle(ctx, k, d); ctx.restore();
      }
    },
    // SP Fokus: calm target rings, a slowly turning tick ring, a stopwatch that fills over the minute, an hourglass
    focus(ctx, M, t){
      const cx = 540, cy = 945, k60 = clamp(t / 60, 0, 1);
      ctx.lineWidth = 3;
      for (let k = 0; k < 5; k++){ ctx.strokeStyle = hexA(C0, .06); ctx.beginPath(); ctx.arc(cx, cy, 400 + k * 150 + Math.sin(t * .45 + k * .9) * 10, 0, TAU); ctx.stroke(); }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .03); ctx.setLineDash([3, 22]); ctx.lineWidth = 16; ctx.strokeStyle = hexA(C0, .08); ctx.beginPath(); ctx.arc(0, 0, 625, 0, TAU); ctx.stroke(); ctx.restore(); ctx.setLineDash([]);
      ctx.strokeStyle = hexA(C0, .14); ctx.lineWidth = 4; [-1, 1].forEach(dy => { ctx.beginPath(); ctx.moveTo(cx, cy + dy * 880); ctx.lineTo(cx, cy + dy * 990); ctx.stroke(); });
      // stopwatch (bottom right): the orange wedge grows with the minute
      const sx = 950, sy = 1660, R = 118;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.arc(sx, sy, R - 14, -Math.PI / 2, -Math.PI / 2 + TAU * k60); ctx.closePath(); ctx.fillStyle = hexA(C1, .13); ctx.fill();
      ctx.strokeStyle = hexA(C0, .22); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, sy, R, 0, TAU); ctx.stroke();
      rr(ctx, sx - 16, sy - R - 30, 32, 24, 6); ctx.fillStyle = hexA(C0, .2); ctx.fill();
      for (let k = 0; k < 60; k++){ const a = k * TAU / 60, l = k % 5 ? 8 : 18; ctx.lineWidth = k % 5 ? 2 : 4; ctx.beginPath(); ctx.moveTo(sx + Math.cos(a) * (R - 8), sy + Math.sin(a) * (R - 8)); ctx.lineTo(sx + Math.cos(a) * (R - 8 - l), sy + Math.sin(a) * (R - 8 - l)); ctx.stroke(); }
      const ha = -Math.PI / 2 + TAU * ((t % 10) / 10); ctx.strokeStyle = hexA(C3, .32); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(ha) * (R - 30), sy + Math.sin(ha) * (R - 30)); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, sy, 9, 0, TAU); ctx.fillStyle = hexA(C3, .32); ctx.fill();
      // hourglass (bottom left)
      const hx = 125, hy = 1660, hw = 56, hh = 92;
      ctx.fillStyle = hexA(C1, .2);
      const top = (hh - 12) * (1 - k60), wt = 6 + (hw - 10) * top / hh; ctx.beginPath(); ctx.moveTo(hx - 4, hy - 4); ctx.lineTo(hx - wt, hy - 4 - top); ctx.lineTo(hx + wt, hy - 4 - top); ctx.lineTo(hx + 4, hy - 4); ctx.closePath(); ctx.fill();
      const pile = (hh - 14) * k60; ctx.beginPath(); ctx.moveTo(hx - hw + 8, hy + hh - 4); ctx.lineTo(hx + hw - 8, hy + hh - 4); ctx.lineTo(hx + 8, hy + hh - 4 - pile); ctx.lineTo(hx - 8, hy + hh - 4 - pile); ctx.closePath(); ctx.fill();
      if (k60 < 1){ ctx.strokeStyle = hexA(C1, .3); ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy + hh - 6 - pile); ctx.stroke(); ctx.setLineDash([]); }
      ctx.strokeStyle = hexA(C0, .24); ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(hx - hw, hy - hh); ctx.lineTo(hx + hw, hy - hh); ctx.lineTo(hx + 6, hy); ctx.lineTo(hx + hw, hy + hh); ctx.lineTo(hx - hw, hy + hh); ctx.lineTo(hx - 6, hy); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = hexA(C3, .22); ctx.fillRect(hx - hw - 14, hy - hh - 12, 2 * hw + 28, 10); ctx.fillRect(hx - hw - 14, hy + hh + 2, 2 * hw + 28, 10);
    },
    // RN Panggung Bicara: two soft spotlights swaying from the rig, stage glow, a sound-wave equaliser and a microphone
    limelight(ctx, M, t){
      ctx.fillStyle = hexA(C3, .1); ctx.beginPath(); ctx.moveTo(0, 0);
      for (let x = 0; x <= W; x += 90){ ctx.lineTo(x, 26); ctx.quadraticCurveTo(x + 45, 64, x + 90, 26); } ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
      [[150, -90, -.34, 0], [930, -90, .34, 2.1]].forEach(([x, y, tilt, ph]) => {
        const ang = Math.PI / 2 + tilt + Math.sin(t * .33 + ph) * .1, sp = .19;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 1900); g.addColorStop(0, hexA(C4, .24)); g.addColorStop(.55, hexA(C4, .08)); g.addColorStop(1, hexA(C4, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 1950, ang - sp, ang + sp); ctx.closePath(); ctx.fill();
      });
      ctx.save(); ctx.translate(540, 1700); ctx.scale(1, .17); const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, 600); fg.addColorStop(0, hexA(C4, .3)); fg.addColorStop(1, hexA(C4, 0)); ctx.fillStyle = fg; ctx.fillRect(-600, -600, 1200, 1200); ctx.restore();
      // curtains at both sides
      [0, 1].forEach(side => { ctx.save(); if (side){ ctx.translate(W, 0); ctx.scale(-1, 1); }
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(58, 0); for (let y = 0; y <= H; y += 40) ctx.lineTo(44 + Math.sin(y * .009 + t * .4 + side) * 12, y); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = hexA(C3, .12); ctx.fill();
        ctx.strokeStyle = hexA(C3, .1); ctx.lineWidth = 4; [12, 28].forEach(px => { ctx.beginPath(); for (let y = 0; y <= H; y += 60) ctx.lineTo(px + Math.sin(y * .009 + t * .4 + side) * 6, y); ctx.stroke(); });
        ctx.restore(); });
      // equaliser bars between subtitle and footer
      const n = 30, x0 = 190, x1 = 930;
      ctx.fillStyle = hexA(C0, .17);
      for (let i = 0; i < n; i++){ const x = x0 + (x1 - x0) * i / (n - 1), env = Math.sin(Math.PI * (i + .5) / n);
        const h = 8 + 62 * env * Math.abs(Math.sin(t * 1.7 + i * .45)) * (.45 + .55 * Math.abs(Math.sin(t * .6 + i * .17))); rr(ctx, x - 5, 1640 - h / 2, 10, h, 5); ctx.fill(); }
      // microphone
      ctx.save(); ctx.translate(100, 1640); ctx.rotate(-.12 + Math.sin(t * .5) * .03); ctx.strokeStyle = hexA(C3, .3); ctx.lineWidth = 5; ctx.lineCap = "round";
      rr(ctx, -17, -70, 34, 62, 17); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -30, 30, .15, Math.PI - .15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 100); ctx.moveTo(-34, 100); ctx.lineTo(34, 100); ctx.stroke();
      ctx.lineWidth = 2.5; [-52, -40, -28].forEach(y => { ctx.beginPath(); ctx.moveTo(-9, y); ctx.lineTo(9, y); ctx.stroke(); }); ctx.restore();
    },
    // KD Arsip Data (dark): isometric grid scrolling slowly, folders and file sheets drifting up
    archive(ctx, M, t){
      const sp = 96, off = (t * 6) % sp, tn = Math.tan(Math.PI / 6), A = "#E08A3C";
      ctx.lineWidth = 2; ctx.strokeStyle = hexA(A, .055); ctx.beginPath();
      for (let c = -Math.ceil(W * tn / sp) * sp; c < H + 2 * sp; c += sp){ const y0 = c - off; ctx.moveTo(0, y0); ctx.lineTo(W, y0 + W * tn); ctx.moveTo(0, y0 + W * tn); ctx.lineTo(W, y0); }
      ctx.stroke();
      ctx.strokeStyle = hexA(A, .03); ctx.beginPath(); for (let x = 0; x <= W; x += sp / (2 * tn)){ ctx.moveTo(x, 0); ctx.lineTo(x, H); } ctx.stroke();
      const g = ctx.createRadialGradient(540, -120, 0, 540, -120, 950); g.addColorStop(0, hexA(A, .12)); g.addColorStop(1, hexA(A, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 900);
      for (const p of M.fl.slice(0, 13)){
        const y = ((p.y - t * p.v) % 2100 + 2100) % 2100 - 90, x = p.x + Math.sin(t * .4 + p.ph) * 18, w = 74 * p.s, h = w * (p.k % 2 ? 1.25 : .74);
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot + Math.sin(t * .5 + p.ph) * .06); ctx.lineWidth = 3; ctx.lineJoin = "round";
        ctx.strokeStyle = hexA(A, .2 + .06 * p.c); ctx.fillStyle = hexA(A, .05);
        if (p.k % 2 === 0){ ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(-w / 2 + w * .36, -h / 2); ctx.lineTo(-w / 2 + w * .44, -h / 2 + 10); ctx.lineTo(w / 2, -h / 2 + 10); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 22); ctx.lineTo(w / 2, -h / 2 + 22); ctx.stroke(); }
        else { const f = w * .26; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - f, -h / 2); ctx.lineTo(w / 2, -h / 2 + f); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(w / 2 - f, -h / 2); ctx.lineTo(w / 2 - f, -h / 2 + f); ctx.lineTo(w / 2, -h / 2 + f); ctx.stroke();
          for (let l = 0; l < 3; l++){ ctx.beginPath(); ctx.moveTo(-w / 2 + 12, -h / 2 + f + 14 + l * 14); ctx.lineTo(w / 2 - 12 - (l === 2 ? w * .3 : 0), -h / 2 + f + 14 + l * 14); ctx.stroke(); } }
        ctx.restore();
      }
    },
    // JS Persimpangan: a road that forks at a signpost and runs up both sides like a route map, a traveller dot
    roads(ctx, M, t){
      const R = roadPts();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      [R.main, R.left, R.right].forEach(pts => { ctx.strokeStyle = hexA(C3, .085); ctx.lineWidth = 66; strokePts(ctx, pts); });
      ctx.strokeStyle = "rgba(255,250,242,.85)"; ctx.lineWidth = 5; ctx.setLineDash([24, 26]); ctx.lineDashOffset = t * 26;
      [R.main, R.left, R.right].forEach(pts => strokePts(ctx, pts)); ctx.setLineDash([]); ctx.lineDashOffset = 0;
      // travellers
      [[R.rL, R.LL, 0], [R.rR, R.LR, .5]].forEach(([pts, L, off]) => { const u = cyc(t, 16, off * 16), [x, y] = alongPts(pts, u * L), a = Math.sin(Math.PI * u);
        const gl = ctx.createRadialGradient(x, y, 0, x, y, 40); gl.addColorStop(0, hexA(C0, .35 * a)); gl.addColorStop(1, hexA(C0, 0)); ctx.fillStyle = gl; ctx.fillRect(x - 40, y - 40, 80, 80);
        ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fillStyle = hexA(C0, .45 * a); ctx.fill(); });
      // pins at the route ends
      [[36, 236, 0], [1044, 236, 1.6]].forEach(([x, y, ph]) => { ctx.save(); ctx.translate(x, y - 6 - Math.abs(Math.sin(t * 1.4 + ph)) * 10);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-24, -28, -24, -62, 0, -62); ctx.bezierCurveTo(24, -62, 24, -28, 0, 0); ctx.fillStyle = hexA(C0, .3); ctx.fill();
        ctx.beginPath(); ctx.arc(0, -40, 8, 0, TAU); ctx.fillStyle = "rgba(255,250,242,.9)"; ctx.fill(); ctx.restore(); });
      // signpost at the fork
      ctx.save(); ctx.translate(540, 1745); ctx.rotate(Math.sin(t * .8) * .018);
      ctx.fillStyle = hexA(C3, .24); rr(ctx, -6, -180, 12, 180, 5); ctx.fill();
      const board = (y, dir, w) => { ctx.beginPath(); const x0 = dir < 0 ? -w : 0; ctx.moveTo(dir < 0 ? -w - 22 : w + 22, y); ctx.lineTo(dir < 0 ? -w : w, y - 20); ctx.lineTo(dir < 0 ? 0 : 0, y - 20); ctx.lineTo(0, y + 20); ctx.lineTo(dir < 0 ? -w : w, y + 20); ctx.closePath();
        ctx.fillStyle = hexA(C0, .2); ctx.fill(); ctx.strokeStyle = hexA(C0, .32); ctx.lineWidth = 3; ctx.stroke(); };
      board(-160, -1, 120); board(-110, 1, 132); ctx.restore();
    },
    // SC Celengan Tumbuh: coin plants that grow through the minute, a jar slowly filling with coins, leaves drifting at the sides
    garden(ctx, M, t){
      const base = 1762, grow = clamp(.4 + t / 75, 0, 1);
      ctx.fillStyle = hexA(C3, .07); ctx.beginPath(); ctx.ellipse(540, base + 60, 700, 90, 0, 0, TAU); ctx.fill();
      [[110, 150, 0], [300, 120, 1.3], [790, 135, 2.2], [975, 165, .7]].forEach(([x, h0, ph], i) => {
        const h = h0 * grow, sw = Math.sin(t * .7 + ph) * 10, tx = x + sw, ty = base - h;
        ctx.fillStyle = hexA(C3, .1); ctx.beginPath(); ctx.ellipse(x, base, 56, 13, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = hexA(C3, .3); ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x - 16, base - h / 2, tx, ty); ctx.stroke();
        [.38, .66].forEach((f, j) => { const lx = x + (tx - x) * f - 8 * (1 - f), ly = base - h * f, side = (i + j) % 2 ? 1 : -1;
          ctx.save(); ctx.translate(lx, ly); ctx.rotate(side * (.55 + Math.sin(t * .9 + ph + j) * .08)); ctx.translate(side * 24, 0); leaf(ctx, 26 * grow + 6, hexA(C2, .26)); ctx.restore(); });
        const b = Math.sin(t * 1.3 + ph) * 3, sx = Math.max(.25, Math.abs(Math.cos(t * .9 + ph)));
        ctx.save(); ctx.translate(tx, ty - 22 + b); ctx.scale(sx, 1); ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fillStyle = hexA(C1, .34); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.strokeStyle = "rgba(255,248,236,.8)"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      });
      // jar (toples) filling up over the minute
      const jx = 540, jt = 1585, jw = 150, jh = 165, lvl = clamp(.12 + t / 64, 0, 1) * (jh - 26);
      ctx.save(); rr(ctx, jx - jw / 2, jt, jw, jh, 28); ctx.clip();
      for (let y = jt + jh - 14, k = 0; y > jt + jh - 14 - lvl; y -= 13, k++){ ctx.beginPath(); ctx.ellipse(jx + Math.sin(k * 2.3) * 14, y, 46, 9, 0, 0, TAU); ctx.fillStyle = hexA(k % 2 ? C1 : C2, .26); ctx.fill(); }
      ctx.restore();
      rr(ctx, jx - jw / 2, jt, jw, jh, 28); ctx.strokeStyle = hexA(C3, .3); ctx.lineWidth = 5; ctx.stroke();
      rr(ctx, jx - jw / 2 + 14, jt - 26, jw - 28, 26, 8); ctx.fillStyle = hexA(C3, .2); ctx.fill();
      rr(ctx, jx - 24, jt - 20, 48, 8, 4); ctx.fillStyle = "rgba(255,248,236,.7)"; ctx.fill();
      const u = cyc(t, 4.5, 0); if (u < .45){ const q = u / .45, y = 1515 + q * q * (jt - 10 - 1515), sx = Math.max(.2, Math.abs(Math.cos(t * 6)));
        ctx.save(); ctx.globalAlpha *= Math.min(1, (1 - q) * 3); ctx.translate(jx, y); ctx.scale(sx, 1); ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fillStyle = hexA(C1, .4); ctx.fill(); ctx.restore(); }
      // leaves drifting down the side margins
      for (const p of M.fl.slice(0, 6)){ const y = ((p.y + t * p.v * .8) % 2050 + 2050) % 2050 - 60, x = (p.x < 540 ? 24 + p.x * .1 : 1000 + (p.x - 540) * .1) + Math.sin(t * .7 + p.ph) * 22;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.ph + Math.sin(t * .9 + p.ph) * .7); leaf(ctx, 20 * p.s, hexA(p.c ? C2 : C1, .2)); ctx.restore(); }
    },
    // MS Taman Tenang: drifting clouds, a branch with falling leaves, a meadow and a sun that breathes (in 4 s, out 4 s)
    meadow(ctx, M, t){
      const br = .5 - .5 * Math.cos(t * TAU / 8);
      [[0, 205, 9, .9], [700, 535, 6, .7], [300, 1555, 7, 1], [1100, 1700, 5, .75]].forEach(([x0, y, v, s], i) => {
        const x = ((x0 + t * v) % 1500 + 1500) % 1500 - 260;
        ctx.save(); ctx.translate(0, 9); cloudShape(ctx, x, y, s); ctx.fillStyle = hexA(C3, .045); ctx.fill(); ctx.restore();
        cloudShape(ctx, x, y, s); ctx.fillStyle = "rgba(255,255,255,.62)"; ctx.fill(); });
      // breathing sun behind the meadow
      const g = ctx.createRadialGradient(800, 1735, 0, 800, 1735, 260 + br * 70); g.addColorStop(0, hexA(C4, .26)); g.addColorStop(.45, hexA(C4, .12)); g.addColorStop(1, hexA(C4, 0)); ctx.fillStyle = g; ctx.fillRect(480, 1400, 640, 520);
      ctx.beginPath(); ctx.arc(800, 1735, 78 + br * 14, 0, TAU); ctx.fillStyle = hexA(C4, .2); ctx.fill();
      // meadow
      [[1735, .1, C2, 0], [1790, .12, C4, 2]].forEach(([yb, a, c, ph]) => { ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 20) ctx.lineTo(x, yb + Math.sin(x * .004 + ph) * 34 + Math.sin(x * .011 + ph) * 10); ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = hexA(c, a); ctx.fill(); });
      ctx.strokeStyle = hexA(C3, .16); ctx.lineWidth = 3; ctx.lineCap = "round";
      for (let k = 0; k < 16; k++){ const x = 40 + k * 66 + (k % 3) * 9, y = 1740 + Math.sin(x * .004) * 34 + Math.sin(x * .011) * 10, sw = Math.sin(t * .9 + k) * 6;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 2, y - 16, x + sw, y - 30); ctx.moveTo(x + 8, y); ctx.quadraticCurveTo(x + 10, y - 12, x + 14 + sw, y - 22); ctx.stroke(); }
      // branch at the top right
      ctx.save(); ctx.translate(1090, 182); ctx.rotate(Math.sin(t * .5) * .015);
      ctx.strokeStyle = hexA(C3, .26); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-120, 20, -270, 6); ctx.stroke();
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-150, 14); ctx.quadraticCurveTo(-190, 40, -220, 44); ctx.stroke();
      [[-60, 14, .8], [-105, 20, -.6], [-160, 18, .9], [-205, 42, -.4], [-250, 8, .6]].forEach(([x, y, r], k) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r + Math.sin(t * 1.1 + k) * .12); ctx.translate(18, 0); leaf(ctx, 20, hexA(k % 2 ? C2 : C1, .3)); ctx.restore(); });
      ctx.restore();
      for (const p of M.fl.slice(0, 7)){ const per = 2200 / (p.v * 1.6), u = cyc(t, per, p.ph * 3), y = 200 + u * 1800, x = 760 + p.x * .3 - u * 380 + Math.sin(t * .8 + p.ph) * 50;
        ctx.save(); ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.translate(x, y); ctx.rotate(p.ph + t * .6 * (p.c ? 1 : -1)); leaf(ctx, 17 * p.s, hexA(p.c % 2 ? C2 : C1, .2)); ctx.restore(); }
    },
  };

  // subtitles: 3 lines max, y 1380–1600, very legible (solid boxes, dark ink on light or light ink on dark)
  function subLines(ctx, th, text, M, maxW){ font(ctx, 600, 42, M.subFam || th.fam); return wrapRich(ctx, text, "", maxW).map(l => l.map(x => x.w).join(" ")).slice(0, 3); }
  const SUB_LH = 58;
  const SUB_Q2 = {
    notebook(ctx, th, text, M){ // SB: a strip of lined notebook paper with a margin line and punch holes
      const L = subLines(ctx, th, text, M, 800), y0 = 1394, mw = Math.max(...L.map(l => ctx.measureText(l).width)), w = mw + 120, h = L.length * SUB_LH + 30, x = (W - w) / 2;
      ctx.save(); ctx.translate(540, y0 + h / 2); ctx.rotate(-.008); ctx.translate(-540, -(y0 + h / 2));
      ctx.fillStyle = "rgba(59,36,24,.13)"; ctx.fillRect(x + 7, y0 + 9, w, h); ctx.fillStyle = "#FFFDF7"; ctx.fillRect(x, y0, w, h);
      ctx.strokeStyle = "rgba(194,105,31,.22)"; ctx.lineWidth = 2; L.forEach((_, i) => { const ly = y0 + 15 + (i + 1) * SUB_LH - 2; ctx.beginPath(); ctx.moveTo(x + 14, ly); ctx.lineTo(x + w - 14, ly); ctx.stroke(); });
      ctx.strokeStyle = "rgba(194,105,31,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 52, y0); ctx.lineTo(x + 52, y0 + h); ctx.stroke();
      ctx.fillStyle = th.bg; [.3, .7].forEach(f => { ctx.beginPath(); ctx.arc(x + 25, y0 + h * f, 7, 0, TAU); ctx.fill(); });
      ctx.fillStyle = "#3B2418"; L.forEach((l, i) => ctx.fillText(l, x + 76, y0 + 57 + i * SUB_LH)); ctx.restore();
    },
    viewfinder(ctx, th, text, M){ // SP: a clear card inside camera focus brackets
      const L = subLines(ctx, th, text, M, 820), y0 = 1398, mw = Math.max(...L.map(l => ctx.measureText(l).width)), w = mw + 72, h = L.length * SUB_LH + 26, x = (W - w) / 2;
      rr(ctx, x, y0, w, h, 16); ctx.fillStyle = "rgba(255,253,248,.95)"; ctx.fill();
      const c = 30, o = 10; ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round";
      [[x - o, y0 - o, 1, 1], [x + w + o, y0 - o, -1, 1], [x - o, y0 + h + o, 1, -1], [x + w + o, y0 + h + o, -1, -1]].forEach(([cx, cy, sx, sy]) => { ctx.beginPath(); ctx.moveTo(cx, cy + sy * c); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * c, cy); ctx.stroke(); });
      ctx.fillStyle = "#3B2418"; L.forEach((l, i) => ctx.fillText(l, (W - ctx.measureText(l).width) / 2, y0 + 55 + i * SUB_LH));
    },
    onair(ctx, th, text, M){ // RN: broadcast lower-third, brown with an orange tab of moving sound bars
      const L = subLines(ctx, th, text, M, 740), y0 = 1398, mw = Math.max(...L.map(l => ctx.measureText(l).width)), tab = 82, w = mw + tab + 52, h = L.length * SUB_LH + 28, x = (W - w) / 2;
      ctx.fillStyle = "rgba(59,36,24,.14)"; rr(ctx, x + 6, y0 + 10, w, h, 18); ctx.fill();
      ctx.save(); rr(ctx, x, y0, w, h, 18); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.clip(); ctx.fillStyle = th.accent; ctx.fillRect(x, y0, tab, h); ctx.restore();
      ctx.fillStyle = "#FFF7EE"; for (let k = 0; k < 4; k++){ const bh = 12 + 24 * Math.abs(Math.sin(G.lt * 5.5 + k * 1.3)); rr(ctx, x + 18 + k * 13, y0 + h / 2 - bh / 2, 8, bh, 4); ctx.fill(); }
      ctx.fillStyle = "#FFF7EE"; L.forEach((l, i) => ctx.fillText(l, x + tab + 26, y0 + 56 + i * SUB_LH));
    },
    filetab(ctx, th, text, M){ // KD (dark): an archive card with an orange folder tab
      const L = subLines(ctx, th, text, M, 800), y0 = 1410, mw = Math.max(...L.map(l => ctx.measureText(l).width)), w = mw + 84, h = L.length * SUB_LH + 28, x = (W - w) / 2;
      rr(ctx, x + 22, y0 - 30, 150, 46, 12); ctx.fillStyle = "#E08A3C"; ctx.fill();
      ctx.strokeStyle = "#1B1611"; ctx.lineWidth = 3.5; ctx.lineCap = "round"; [[44, 104], [44, 88]].forEach(([a, b], k) => { ctx.beginPath(); ctx.moveTo(x + a + 8, y0 - 17 + k * 10); ctx.lineTo(x + b + 40, y0 - 17 + k * 10); ctx.stroke(); });
      rr(ctx, x, y0, w, h, 14); ctx.fillStyle = "#1B1611"; ctx.fill(); ctx.strokeStyle = "rgba(224,138,60,.6)"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "#FAF8F3"; L.forEach((l, i) => ctx.fillText(l, x + 42, y0 + 56 + i * SUB_LH));
    },
    signpost(ctx, th, text, M){ // JS: a brown direction sign pointing to the right
      const L = subLines(ctx, th, text, M, 780), y0 = 1398, mw = Math.max(...L.map(l => ctx.measureText(l).width)), tip = 46, w = mw + 84, h = L.length * SUB_LH + 28, x = (W - w - tip) / 2;
      const sign = (dx, dy, inset) => { ctx.beginPath(); ctx.moveTo(x + dx + inset, y0 + dy + inset); ctx.lineTo(x + dx + w, y0 + dy + inset); ctx.lineTo(x + dx + w + tip - inset * 1.4, y0 + dy + h / 2); ctx.lineTo(x + dx + w, y0 + dy + h - inset); ctx.lineTo(x + dx + inset, y0 + dy + h - inset); ctx.closePath(); };
      sign(6, 10, 0); ctx.fillStyle = "rgba(59,36,24,.16)"; ctx.fill();
      sign(0, 0, 0); ctx.fillStyle = "#3B2418"; ctx.fill();
      sign(0, 0, 7); ctx.strokeStyle = "rgba(255,247,238,.35)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = th.accent; ctx.fillRect(x, y0, 14, h);
      ctx.fillStyle = "#FFF7EE"; L.forEach((l, i) => ctx.fillText(l, x + 14 + (w - 14 - ctx.measureText(l).width) / 2, y0 + 56 + i * SUB_LH));
    },
    jarlabel(ctx, th, text, M){ // SC: a cream jar label with a stitched border and a coin on top
      const L = subLines(ctx, th, text, M, 800), y0 = 1400, mw = Math.max(...L.map(l => ctx.measureText(l).width)), w = mw + 92, h = L.length * SUB_LH + 32, x = (W - w) / 2;
      rr(ctx, x + 5, y0 + 9, w, h, 22); ctx.fillStyle = "rgba(59,36,24,.11)"; ctx.fill();
      rr(ctx, x, y0, w, h, 22); ctx.fillStyle = "#FFF8EC"; ctx.fill(); ctx.strokeStyle = "rgba(160,82,45,.4)"; ctx.lineWidth = 3; ctx.stroke();
      ctx.setLineDash([11, 8]); rr(ctx, x + 10, y0 + 10, w - 20, h - 20, 14); ctx.strokeStyle = hexA(th.accent, .75); ctx.lineWidth = 2.5; ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(540, y0, 15, 0, TAU); ctx.fillStyle = C1; ctx.fill(); ctx.strokeStyle = "#FFF8EC"; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = "#3B2418"; L.forEach((l, i) => ctx.fillText(l, (W - ctx.measureText(l).width) / 2, y0 + 58 + i * SUB_LH));
    },
    cloud(ctx, th, text, M){ // MS: a soft white cloud
      const L = subLines(ctx, th, text, M, 800), y0 = 1404, mw = Math.max(...L.map(l => ctx.measureText(l).width)), w = mw + 92, h = L.length * SUB_LH + 28, x = (W - w) / 2;
      const shape = (dy) => { ctx.beginPath(); ctx.roundRect(x, y0 + dy, w, h, Math.min(44, h / 2)); const n = Math.max(2, Math.round((w - 120) / 95));
        for (let k = 0; k <= n; k++){ const bx = x + 60 + (w - 120) * k / n, r = 30 + (k % 2) * 10; ctx.moveTo(bx + r, y0 + dy + 8); ctx.arc(bx, y0 + dy + 8, r, 0, TAU); } };
      shape(9); ctx.fillStyle = "rgba(59,36,24,.07)"; ctx.fill(); shape(0); ctx.fillStyle = "rgba(255,255,255,.96)"; ctx.fill();
      ctx.fillStyle = "#3B2418"; L.forEach((l, i) => ctx.fillText(l, (W - ctx.measureText(l).width) / 2, y0 + 55 + i * SUB_LH));
    },
  };

  // transitions: each draws the covered area for coverage q (0..1); out = second half (the cover leaves)
  const INKB = [[180, 260, 0], [880, 420, .12], [420, 980, .05], [930, 1280, .2], [160, 1560, .1], [700, 1800, .16], [560, 620, .25], [300, 1950, .3]];
  const TR_Q2 = {
    scribble(ctx, q, out, col, layer){ // SB: a giant pencil scribble fills the screen, then is "erased" from its start
      const step = 120, pts = []; for (let y = -160, k = 0; y < H + 300; y += step, k++) pts.push([k % 2 ? 1200 : -120, y]);
      const seg = Math.hypot(1320, step), L = (pts.length - 1) * seg;
      ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.lineWidth = 300; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = col;
      if (!out) ctx.setLineDash([Math.max(.01, L * q), L * 2]); else { ctx.setLineDash([Math.max(.01, L * (1 - q)), L * 3]); ctx.lineDashOffset = -L * q; }
      ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
      if (layer && !out && q > 0 && q < 1){ const d = L * q, i = Math.min(pts.length - 2, Math.floor(d / seg)), f = d / seg - i, [ax, ay] = pts[i], [bx, by] = pts[i + 1];
        const px = ax + (bx - ax) * f, py = ay + (by - ay) * f; ctx.save(); ctx.translate(px, py); ctx.rotate(Math.atan2(by - ay, bx - ax) + Math.PI);
        ctx.fillStyle = "#3B2418"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(60, -24); ctx.lineTo(60, 24); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#F4D9B5"; ctx.beginPath(); ctx.moveTo(22, -9); ctx.lineTo(60, -24); ctx.lineTo(60, 24); ctx.lineTo(22, 9); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#E89544"; ctx.fillRect(60, -24, 230, 48); ctx.fillStyle = "#A0522D"; ctx.fillRect(60, -8, 230, 4); ctx.fillRect(60, 6, 230, 4);
        ctx.fillStyle = "#F4A85C"; ctx.fillRect(290, -24, 46, 48); ctx.restore(); }
    },
    fold(ctx, q, out, col, layer){ // SB/JS: a paper sheet folds down over the scene (crease + flap + shadow), then slides away
      const e = out ? -130 + q * (H + 260) : q * (H + 260) - 130, fh = 120 * Math.sin(Math.PI * q);
      ctx.fillStyle = col; if (!out) ctx.fillRect(0, 0, W, Math.max(0, e)); else ctx.fillRect(0, e, W, H - e + 10);
      if (!layer || fh < 1) return;
      const dir = out ? -1 : 1, g = ctx.createLinearGradient(0, e + dir * fh, 0, e + dir * (fh + 70)); g.addColorStop(0, "rgba(59,36,24,.22)"); g.addColorStop(1, "rgba(59,36,24,0)");
      ctx.fillStyle = g; ctx.fillRect(0, Math.min(e + dir * fh, e + dir * (fh + 70)), W, 70);
      ctx.beginPath(); ctx.moveTo(0, e); ctx.lineTo(W, e); ctx.lineTo(W - 34, e + dir * fh); ctx.lineTo(34, e + dir * fh); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      const g2 = ctx.createLinearGradient(0, e, 0, e + dir * fh); g2.addColorStop(0, "rgba(255,250,242,.55)"); g2.addColorStop(1, "rgba(255,250,242,.18)"); ctx.fillStyle = g2; ctx.fill();
      ctx.strokeStyle = "rgba(59,36,24,.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, e); ctx.lineTo(W, e); ctx.stroke();
    },
    shutter(ctx, q, out, col, layer){ // SP: camera aperture blades close to a point, then open again
      const r = Math.max(0, (out ? q : 1 - q) * 1350), rot = (out ? 1 + q : q) * 1.1 + layer * .22, n = 6, V = [];
      for (let k = 0; k < n; k++){ const a = rot + k * TAU / n; V.push([540 + Math.cos(a) * r, 960 + Math.sin(a) * r]); }
      ctx.beginPath(); ctx.rect(-10, -10, W + 20, H + 20); if (r > .5){ V.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
      ctx.fillStyle = col; ctx.fill("evenodd");
      if (layer && r > .5){ ctx.strokeStyle = "rgba(59,36,24,.3)"; ctx.lineWidth = 4;
        for (let k = 0; k < n; k++){ const [ax, ay] = V[k], [bx, by] = V[(k + 1) % n], l = Math.hypot(bx - ax, by - ay) || 1; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + (bx - ax) / l * 2200, by + (by - ay) / l * 2200); ctx.stroke(); } }
    },
    ink(ctx, q, out, col, layer){ // SP/SC: ink drops spread into blots and cover the screen, then dry back
      const g = out ? 1 - q : q; ctx.beginPath();
      INKB.forEach(([x, y, d], i) => { const r = 940 * Math.pow(clamp((g - d) / (1 - d), 0, 1), 1.7); if (r < 1) return;
        for (let a = 0; a <= TAU + .01; a += .12){ const rr2 = r * (1 + .07 * Math.sin(5 * a + i * 2) + .04 * Math.sin(9 * a + i)), px = x + Math.cos(a) * rr2, py = y + Math.sin(a) * rr2; a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.closePath();
        if (layer) for (let j = 0; j < 5; j++){ const a = i * 1.3 + j * 1.26, dd = r * 1.18 + 26, rd = Math.max(2, r * .07); ctx.moveTo(x + Math.cos(a) * dd + rd, y + Math.sin(a) * dd); ctx.arc(x + Math.cos(a) * dd, y + Math.sin(a) * dd, rd, 0, TAU); } });
      ctx.fillStyle = col; ctx.fill();
    },
    curtain(ctx, q, out, col, layer){ // RN: stage curtains close from both sides with a valance, then open
      const g = out ? 1 - q : q, wC = g * 590; if (wC < 1) return;
      [0, 1].forEach(side => { ctx.save(); if (side){ ctx.translate(W, 0); ctx.scale(-1, 1); }
        ctx.beginPath(); ctx.moveTo(-10, -10); for (let y = -10; y <= H + 10; y += 30) ctx.lineTo(wC + 22 * Math.sin(y * .008 + layer * 1.3 + side) + 26 * (y / H), y); ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
        if (layer){ for (let k = 0; k < 7; k++){ const px = wC * (k + .5) / 7; ctx.strokeStyle = "rgba(59,36,24,.18)"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(px, 0); ctx.quadraticCurveTo(px + 10, H / 2, px + 18 * (k / 7), H); ctx.stroke();
          ctx.strokeStyle = "rgba(255,240,220,.14)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px + 16, 0); ctx.quadraticCurveTo(px + 26, H / 2, px + 16 + 18 * (k / 7), H); ctx.stroke(); } }
        ctx.restore(); });
      if (layer){ const vh = 96 * Math.min(1, g * 4); ctx.fillStyle = "#8A4524"; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, vh - 30);
        for (let x = 0; x < W; x += 120) ctx.quadraticCurveTo(x + 60, vh + 26, x + 120, vh - 30); ctx.lineTo(W, -10); ctx.closePath(); ctx.fill(); }
    },
    wave(ctx, q, out, col, layer){ // RN/MS: a sound/water wave rises from the bottom and washes past the top
      const lvl = (H + 150) - q * (H + 300), yy = x => lvl + 46 * Math.sin(x * .009 + q * 7 + layer * 1.4) + 18 * Math.sin(x * .021 - q * 5);
      ctx.beginPath(); ctx.moveTo(0, yy(0)); for (let x = 20; x <= W; x += 20) ctx.lineTo(x, yy(x));
      if (!out){ ctx.lineTo(W, H + 10); ctx.lineTo(0, H + 10); } else { ctx.lineTo(W, -10); ctx.lineTo(0, -10); } ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      if (layer){ ctx.beginPath(); ctx.moveTo(0, yy(0)); for (let x = 20; x <= W; x += 20) ctx.lineTo(x, yy(x)); ctx.strokeStyle = "rgba(255,248,238,.4)"; ctx.lineWidth = 8; ctx.stroke(); }
    },
    pixel(ctx, q, out, col, layer){ // KD: the screen breaks into data pixels and rebuilds
      const cs = 90; ctx.beginPath();
      for (let j = 0; j < 22; j++) for (let i = 0; i < 12; i++){
        const h = out ? frac(i * 1.97 + j * 5.31 + 2) : frac(i * 7.13 + j * 3.71 + 1), g = clamp((q - h * .75) / .25, 0, 1), s = out ? 1 - g : g;
        if (s <= 0) continue; const d = s >= 1 ? cs + 1 : cs * s; ctx.rect(i * cs + (cs - d) / 2, j * cs + (cs - d) / 2, d, d); }
      ctx.fillStyle = col; ctx.fill();
      if (layer){ ctx.fillStyle = "rgba(255,240,220,.12)"; ctx.beginPath(); for (let j = 0; j < 22; j++) for (let i = 0; i < 12; i++){ if (frac(i * 3.3 + j * 9.1) > .22) continue;
        const h = out ? frac(i * 1.97 + j * 5.31 + 2) : frac(i * 7.13 + j * 3.71 + 1), g = clamp((q - h * .75) / .25, 0, 1), s = out ? 1 - g : g; if (s < 1) continue; ctx.rect(i * cs + 14, j * cs + 14, cs - 28, cs - 28); } ctx.fill(); }
    },
    blinds(ctx, q, out, col, layer){ // KD: archive blinds (horizontal slats) turn shut, then open
      const n = 16, sh = H / n; ctx.beginPath(); const hs = [];
      for (let j = 0; j < n; j++){ const g = clamp(q * 1.45 - j * .028, 0, 1), hh = (out ? 1 - g : g) * (sh + 1); hs.push(hh); if (hh > 0) ctx.rect(0, j * sh + sh / 2 - hh / 2, W, hh); }
      ctx.fillStyle = col; ctx.fill();
      if (layer){ ctx.lineWidth = 3; hs.forEach((hh, j) => { if (hh < 6) return; const cy = j * sh + sh / 2;
        ctx.strokeStyle = "rgba(255,240,220,.22)"; ctx.beginPath(); ctx.moveTo(0, cy - hh / 2 + 2); ctx.lineTo(W, cy - hh / 2 + 2); ctx.stroke();
        ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.moveTo(0, cy + hh / 2 - 2); ctx.lineTo(W, cy + hh / 2 - 2); ctx.stroke(); }); }
    },
    arrow(ctx, q, out, col, layer){ // JS: a road-sign chevron sweeps across
      const X = -40 + q * 1700, A = 520;
      ctx.beginPath();
      if (!out){ ctx.moveTo(-600, -60); ctx.lineTo(X - A, -60); ctx.lineTo(X, 960); ctx.lineTo(X - A, 1980); ctx.lineTo(-600, 1980); }
      else { ctx.moveTo(X - A, -60); ctx.lineTo(2000, -60); ctx.lineTo(2000, 1980); ctx.lineTo(X - A, 1980); ctx.lineTo(X, 960); }
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      if (layer){ ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(255,247,238,.32)"; ctx.lineWidth = 34; ctx.lineJoin = "miter";
        [150, 330].forEach(dx => { const x = out ? X + dx : X - dx; ctx.beginPath(); ctx.moveTo(x - A, -60); ctx.lineTo(x, 960); ctx.lineTo(x - A, 1980); ctx.stroke(); }); ctx.restore(); }
    },
    coinfill(ctx, q, out, col, layer){ // SC: coins stack up from the bottom like a filling jar, then drop away
      const R = 82, dx = 128, dy = 112, rows = Math.ceil((H + 80) / dy) + 1, C = [];
      for (let r = 0; r < rows; r++){ const rk = out ? rows - 1 - r : r, g = clamp((q * 1.3 - rk / rows) / .3, 0, 1), s = out ? 1 - g : eBack(g);
        if (s <= .01) continue; const cy = H + 40 - r * dy + (out ? (1 - s) * 160 : 0);
        for (let x = -dx + (r % 2) * dx / 2; x < W + dx; x += dx) C.push([x, cy, R * s]); }
      ctx.beginPath(); C.forEach(([x, y, r]) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }); ctx.fillStyle = col; ctx.fill();
      if (layer){ ctx.beginPath(); C.forEach(([x, y, r]) => { ctx.moveTo(x + r * .66, y); ctx.arc(x, y, r * .66, 0, TAU); }); ctx.strokeStyle = "rgba(255,247,238,.4)"; ctx.lineWidth = 5; ctx.stroke(); }
    },
    cloud(ctx, q, out, col, layer){ // MS: soft cloud banks drift in from alternating sides and drift on
      const rowH = 190, n = 12, span = W + 700; ctx.beginPath();
      for (let j = 0; j < n; j++){ const fromL = j % 2 === 0, cy = j * rowH - 10, g = clamp(q * 1.25 - (j % 3) * .1, 0, 1), adv = g * span;
        let a, b; if (!out){ a = fromL ? -400 : W + 350 - adv; b = fromL ? -350 + adv : W + 400; } else { a = fromL ? -350 + adv : -400; b = fromL ? W + 400 : W + 350 - adv; }
        if (b - a < 1) continue;
        for (let x = a; ; x = Math.min(b, x + 100)){ const r = 160 + 20 * Math.sin(x * .05 + j), y = cy + 25 * Math.sin(x * .031 + j * 2); ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); if (x >= b) break; } }
      ctx.fillStyle = col; ctx.fill();
    },
  };
  const TR_COL = { curtain: ["#A0522D", "#C2691F"], cloud: ["#FFF8F0", "#EDC8A2"] };
  function overlayQ2(ctx, kind, p, M, b){
    const f = TR_Q2[kind], cc = (M.trCol && M.trCol[kind]) || TR_COL[kind], front = cc ? cc[0] : M.pal[b % 6], back = cc ? cc[1] : M.pal[(b + 2) % 6];
    ctx.save();
    if (p < .5){ const q = easeIO(p * 2), q2 = easeIO(clamp((p * 2 - .2) / .8, 0, 1)); f(ctx, q, false, back, 0); if (q2 > 0) f(ctx, q2, false, front, 1); }
    else { const q = easeIO((p - .5) * 2), q2 = easeIO(clamp(((p - .5) * 2 - .2) / .8, 0, 1)); if (q2 < 1) f(ctx, q2, true, back, 0); f(ctx, q, true, front, 1); }
    if (p > .38 && p < .62){ // brand mark at full cover
      const a = clamp(1 - Math.abs(p - .5) / .12, 0, 1), s = .85 + .15 * a; ctx.globalAlpha = a; ctx.translate(540, 960); ctx.scale(s, s);
      ctx.beginPath(); ctx.arc(0, 0, 76, 0, TAU); ctx.fillStyle = "#FFF7EE"; ctx.fill(); drawLogo(ctx, -50, -50, 100); }
    ctx.restore();
  }

  function cornerAccent(ctx, M){
    const i = G.scene, c = (M.corner + i) % 4, p = eBack(clamp(G.lt / .7, 0, 1));
    const x = c % 2 ? W + 40 : -40, y = c < 2 ? 380 : H - 220, r = 230 * p;
    if (r <= 0) return;
    ctx.save(); ctx.fillStyle = hexA(M.pal[i % 6], .13); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = hexA(M.pal[(i + 1) % 6], .22); ctx.lineWidth = 5; ctx.setLineDash([18, 16]); ctx.lineDashOffset = -G.lt * 30;
    ctx.beginPath(); ctx.arc(x, y, r + 46, 0, TAU); ctx.stroke(); ctx.restore();
  }

  const _drawBg = drawBg;
  drawBg = function(ctx, th, t){
    _drawBg(ctx, th, t);
    if (th.key !== "C" && th.key !== "B") return;
    const M = mv(); ctx.save(); deco(ctx, M, t); if (!M.q2) cornerAccent(ctx, M);
    if (th.key === "B"){ const v = ctx.createRadialGradient(540, 900, 500, 540, 900, 1250); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.55)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  };

  /* ---------- header (logo + brand, series icon + label) and footer (site) ---------- */
  // Same icons as the series cards on video.talenta.tangani.id (24-unit grid).
  const SERIES_ICON = {
    SB: { p: ["M12 21v-9", "M12 12c0-4.4 3.2-7 7.5-7 0 4.4-3.2 7-7.5 7z", "M12 14.5c0-3.4-2.6-5.8-6.5-5.8 0 3.4 2.6 5.8 6.5 5.8z", "M7.5 21h9"] },
    SP: { r: [[4, 3.5, 16, 17.5, 3]], p: ["M7.8 9l1.6 1.6 3.1-3.1", "M7.8 15l1.6 1.6 3.1-3.1", "M15 9.5h2", "M15 15.5h2"] },
    RN: { p: ["M3.5 6.8A2.8 2.8 0 0 1 6.3 4h7.4a2.8 2.8 0 0 1 2.8 2.8v3.9a2.8 2.8 0 0 1-2.8 2.8H9l-3.8 3v-3a2.8 2.8 0 0 1-1.7-2.6z", "M19 8.6a2 2 0 0 1 1.5 1.9v3.7a2.4 2.4 0 0 1-2 2.4V19l-3.2-2.6h-3"] },
    KD: { r: [[3.5, 4.5, 17, 11.5, 2.2]], p: ["M2 19.5h20"], f: ["M12 7.3l.95 1.95 2.15.3-1.55 1.5.37 2.12L12 12.2l-1.92 1 .37-2.13-1.55-1.5 2.15-.31z"] },
    JS: { p: ["M9 18h6", "M10 21.2h4", "M12 2.8a6.2 6.2 0 0 0-3.7 11.2c.7.6 1.1 1.3 1.1 2.1v.4h5.2v-.4c0-.8.4-1.5 1.1-2.1A6.2 6.2 0 0 0 12 2.8z", "M10.3 9.6l1.3 1.3 2.3-2.4"] },
    SC: { r: [[3.5, 8, 17, 12, 2.8]], p: ["M4 8.2V7a2.5 2.5 0 0 1 2.5-2.5h10A1.5 1.5 0 0 1 18 6v2.2", "M20.5 11.5h-3.2a2.1 2.1 0 0 0 0 4.2h3.2"] },
    MS: { p: ["M12 20.5s-8-4.8-8-10.6A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 8 2.7c0 5.8-8 10.6-8 10.6z", "M6.5 12.3h2.8l1.4-2.4 2.1 4.8 1.4-2.4h3.3"] },
  };
  const seriesCode = () => String(P.series || P.id || "").slice(0, 2).toUpperCase();
  function seriesIcon(ctx, code, x, y, size, color){
    const d = SERIES_ICON[code]; if (!d) return false;
    ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    (d.r || []).forEach(([rx, ry, rw, rh, r]) => { rr(ctx, rx, ry, rw, rh, r); ctx.stroke(); });
    (d.p || []).forEach(pd => ctx.stroke(new Path2D(pd)));
    (d.f || []).forEach(pd => ctx.fill(new Path2D(pd)));
    ctx.restore(); return true;
  }
  drawChip = function(ctx, th){
    // row 1: logo + brand name, centred at the top
    font(ctx, 700, 38, th.fam); spacing(ctx, -.5);
    const bn = P.brand.name || "", bw = 60 + 16 + ctx.measureText(bn).width, bx = 540 - bw / 2;
    drawLogo(ctx, bx, 96, 60);
    ctx.fillStyle = th.ink; ctx.fillText(bn, bx + 76, 139); spacing(ctx, 0);
    // (no series label row: removed at the owner's request; the series shows in the site, not in the video)
    // footer: site address
    const site = P.brand.site || "";
    if (site){
      font(ctx, 600, 30, th.fam); const w = ctx.measureText(site).width, x0 = 540 - (w + 40) / 2;
      icon(ctx, "link", x0, 1786, 28, th.accent, 2.4); ctx.fillStyle = th.muted; ctx.fillText(site, x0 + 40, 1810);
    }
  };

  /* ---------- dark (base B) layouts in Tangani colours ---------- */
  phoneFrame = function(ctx, x, y, w, h){
    rr(ctx, x, y, w, h, 72); ctx.fillStyle = "#16130E"; ctx.fill(); ctx.strokeStyle = "rgba(232,149,68,.45)"; ctx.lineWidth = 3; ctx.stroke();
    rr(ctx, x + w / 2 - 70, y + 26, 140, 34, 17); ctx.fillStyle = "#0C0A07"; ctx.fill();
    font(ctx, 600, 26, "Inter"); ctx.fillStyle = "#B8AE9D"; ctx.fillText("07.45", x + 52, y + 54);
  };
  const _hook = R.hook;
  R.hook = (ctx, th, s, t, T, first) => {
    if (th.key !== "B") return _hook(ctx, th, s, t, T, first);
    const f = s.f, chips = (f.chips || []).slice(0, 3), ex = (f.extras || []).slice(0, 2), M = mv();
    ctx.save(); if (first || enter(ctx, "up", t, .05)) headline(ctx, th, f.headline, f.highlight, 318, { maxLines: 3 }); ctx.restore();
    const px = 265, py = 650;
    ctx.save(); if (enter(ctx, "up", t, .2)){ const g = ctx.createRadialGradient(540, 1000, 0, 540, 1000, 520); g.addColorStop(0, "rgba(224,138,60,.22)"); g.addColorStop(1, "rgba(224,138,60,0)"); ctx.fillStyle = g; ctx.fillRect(0, 500, W, 1000); phoneFrame(ctx, px, py, 550, 700); } ctx.restore();
    if (T.chips[0] != null && t > T.chips[0]){ ctx.save(); const p = prog(t, T.chips[0], .4), pu = 1 + Math.max(0, Math.sin((t - T.chips[0]) * 5)) * .08;
      ctx.translate(790, py + 12); ctx.scale((.4 + .6 * eBack(p)) * pu, (.4 + .6 * eBack(p)) * pu); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = "#E08A3C"; ctx.fill();
      icon(ctx, "alert", -22, -22, 44, "#fff", 2.4); ctx.restore(); }
    const cols = [M.pal[0], M.pal[1], M.pal[3]];
    chips.forEach((c, i) => { const y = py + 130 + i * 178, x = px - 90 + (i % 2 ? 50 : 0); ctx.save();
      ctx.translate(x + 300, y + 80); ctx.rotate((i % 2 ? 1.5 : -2) * Math.PI / 180); ctx.translate(-300, -80);
      if (enter(ctx, "pop", t, T.chips[i], 300, 80)){
        rr(ctx, 0, 0, 600, 160, 30); ctx.fillStyle = th.card; ctx.fill(); ctx.strokeStyle = th.line; ctx.lineWidth = 2; ctx.stroke();
        rr(ctx, 28, 47, 66, 66, 18); ctx.fillStyle = cols[i % 3]; ctx.fill(); icon(ctx, c.icon, 39, 58, 44, "#fff", 2.2);
        font(ctx, 700, 26, "Inter"); ctx.fillStyle = th.muted; ctx.fillText(c.label, 118, 62);
        const line2 = c.detail || (ex[i] && ex[i].label) || "";
        if (line2) drawRich(ctx, { text: line2, x: 118, y: 76, maxW: c.tag ? 330 : 450, size: 31, weight: 600, fam: "Inter", color: "#FAF8F3", accent: "#FAF8F3", maxLines: 1, lh: 1.2, minSize: 24, track: 0 });
        if (c.tag && t > T.chips[i] + .35){ const q = eBack(prog(t, T.chips[i] + .35, .35)); font(ctx, 800, 24, "Inter"); const tw = ctx.measureText(c.tag).width + 30;
          ctx.save(); ctx.translate(560 - tw / 2, 80); ctx.scale(q, q); rr(ctx, -tw / 2, -22, tw, 44, 22); ctx.fillStyle = "#E08A3C"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(c.tag, 0, 9); ctx.textAlign = "left"; ctx.restore(); }
      }
      ctx.restore(); });
    // extras: floating hint tags
    if (chips.some(c => c.detail)) ex.forEach((e, i) => { ctx.save(); const x = i ? 520 : 90, y = i ? 572 : 556;
      if (enter(ctx, "pop", t, T.extras[i], x + 150, y + 36)){ ctx.translate(0, Math.sin(t * 2 + i) * 6); font(ctx, 700, 30, "Inter"); const w = ctx.measureText(e.label).width + 70;
        ctx.translate(x, y); ctx.rotate((i ? 3 : -3) * Math.PI / 180); rr(ctx, 0, 0, w, 72, 36); ctx.fillStyle = "rgba(224,138,60,.16)"; ctx.fill(); ctx.strokeStyle = "#E08A3C"; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "#E08A3C"; ctx.fillText("?", 24, 47); ctx.fillStyle = "#FAF8F3"; ctx.fillText(e.label, 50, 47); }
      ctx.restore(); });
  };

  /* ---------- icon-led scene layouts (no text lists): handoff, versus, meter, bigicon, flow ---------- */
  // Times of words in the scene's VO, in scene-local seconds (the engine only computes these for its own layouts).
  function cueT(s, cue, frac, idx){
    const st = TL.scenes[idx != null ? idx : G.scene]; if (!st) return frac || 0;
    const s0 = st.ss - st.start, L = Math.max(.3, st.se - st.ss), f = cue ? cueFrac(s.vo, cue) : null;
    return s0 + (f == null ? (frac || 0) : f) * L;
  }
  function tileIcon(ctx, name, cx, cy, size, bg, fg, rad){ rr(ctx, cx - size / 2, cy - size / 2, size, size, rad ?? size * .28); ctx.fillStyle = bg; ctx.fill(); icon(ctx, name, cx - size * .3, cy - size * .3, size * .6, fg, 2.1); }
  function disc(ctx, name, cx, cy, r, bg, fg, ring){ ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = bg; ctx.fill(); if (ring){ ctx.strokeStyle = ring; ctx.lineWidth = r * .09; ctx.stroke(); } icon(ctx, name, cx - r * .55, cy - r * .55, r * 1.1, fg, 2); }
  function label(ctx, th, text, cx, y, size, color){ font(ctx, 700, size || 40, th.fam); ctx.fillStyle = color || th.ink; ctx.textAlign = "center"; ctx.fillText(text, cx, y); ctx.textAlign = "left"; }
  function popS(t, t0, d){ const p = prog(t, t0, d || .45); return p <= 0 ? 0 : .3 + .7 * eBack(p); }
  function topHead(ctx, th, f, t){ if (!f.headline) return; ctx.save(); if (enter(ctx, "up", t, .05)) headline(ctx, th, f.headline, f.highlight, 318, { maxLines: 2 }); ctx.restore(); }
  function burst(ctx, cx, cy, dt, M, n){ if (dt < 0 || dt > .9) return; const q = eOut(dt / .9);
    for (let k = 0; k < (n || 8); k++){ const a = k * TAU / (n || 8) + .3; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = M.pal[k % 3]; star(ctx, cx + Math.cos(a) * (40 + q * 150), cy + Math.sin(a) * (40 + q * 150), 14 * (1 - q * .5)); ctx.restore(); } }

  R.handoff = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    const A = [250, 880], B = [830, 880], tS = cueT(s, f.sendCue, .25), tB = f.backCue ? cueT(s, f.backCue, .65) : null;
    [[A, f.left, .1, 0], [B, f.right, .3, 1]].forEach(([[x, y], who, t0, k]) => { const sc = popS(t, t0); if (!sc || !who) return;
      ctx.save(); ctx.translate(x, y + Math.sin(t * 1.6 + k) * 8); ctx.scale(sc, sc);
      ctx.beginPath(); ctx.arc(0, 0, 135, 0, TAU); ctx.fillStyle = hexA(th.accent, .14); ctx.fill();
      disc(ctx, who.icon || "users", 0, 0, 105, k ? th.teal || "#2F6F73" : th.accent, "#fff"); label(ctx, th, who.label || "", 0, 200, 44); ctx.restore(); });
    // the piece of work travelling between them
    const doc = (x, y, rot, bad) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "rgba(59,36,24,.15)"; ctx.fillRect(-62, -76, 132, 168);
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-70, -86, 140, 172); ctx.strokeStyle = "#3B2418"; ctx.lineWidth = 5; ctx.strokeRect(-70, -86, 140, 172);
      ctx.fillStyle = "rgba(59,36,24,.25)"; [[-46, -52, 92], [-46, -22, 80], [-46, 8, 92], [-46, 38, 60]].forEach(([lx, ly, lw]) => ctx.fillRect(lx, ly, lw, 12));
      if (f.item && f.item.icon){ disc(ctx, f.item.icon, 46, 62, 26, th.accent, "#fff"); }
      if (bad > 0){ ctx.globalAlpha *= bad; ctx.strokeStyle = "#D84315"; ctx.lineWidth = 7; ctx.lineCap = "round"; [[-40, -50], [30, -16], [-20, 30]].forEach(([mx, my]) => { ctx.beginPath(); ctx.moveTo(mx - 14, my - 14); ctx.lineTo(mx + 14, my + 14); ctx.moveTo(mx + 14, my - 14); ctx.lineTo(mx - 14, my + 14); ctx.stroke(); }); }
      ctx.restore(); };
    if (t > .5){
      let x = A[0] + 150, y = A[1] - 40, rot = -.1, bad = 0;
      if (t >= tS){ const p = easeIO(clamp((t - tS) / 1, 0, 1)); x = A[0] + 150 + (B[0] - 210 - A[0] - 150) * p; y = A[1] - 40 - Math.sin(Math.PI * p) * 300; rot = -.1 + p * .2 + Math.sin(Math.PI * p) * .5; }
      if (tB != null && t >= tB){ const p = easeIO(clamp((t - tB) / 1, 0, 1)); x = B[0] - 210 - (B[0] - 210 - A[0] - 150) * p; y = A[1] - 40 + Math.sin(Math.PI * p) * 120; rot = .1 - p * .2; bad = clamp((t - tB) * 2, 0, 1);
        if (p >= 1) x += Math.sin(t * 30) * 4 * Math.max(0, 1 - (t - tB - 1) * 2); }
      ctx.save(); ctx.globalAlpha *= clamp((t - .5) * 3, 0, 1); doc(x, y, rot, bad); ctx.restore();
      burst(ctx, B[0], B[1] - 160, t - tS - 1, M);
      if (tB != null && t > tB + 1){ const sc = popS(t, tB + 1); ctx.save(); ctx.translate(A[0] + 230, A[1] - 150); ctx.scale(sc, sc); ctx.beginPath(); ctx.arc(0, 0, 40, 0, TAU); ctx.fillStyle = "#D84315"; ctx.fill(); label(ctx, th, "!", 0, 18, 52, "#fff"); ctx.restore(); }
    }
  };

  R.versus = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    const tL = cueT(s, f.left && f.left.cue, .1), tR = cueT(s, f.right && f.right.cue, .4), tW = f.winCue ? cueT(s, f.winCue, .75) : null;
    const win = f.win || "right", wp = tW != null ? eOut(prog(t, tW, .5)) : 0;
    [[f.left, 290, tL, "left"], [f.right, 790, tR, "right"]].forEach(([it, cx, t0, side]) => { if (!it) return; const sc = popS(t, t0); if (!sc) return;
      const isW = side === win, cy = 900 + Math.sin(t * 1.4 + (isW ? 0 : 2)) * 10;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(sc * (1 + (isW ? .08 : -.06) * wp), sc * (1 + (isW ? .08 : -.06) * wp)); ctx.rotate((isW ? 0 : -.06) * wp);
      ctx.globalAlpha *= 1 - (isW ? 0 : .5 * wp);
      if (isW && wp > 0){ ctx.save(); ctx.globalAlpha *= wp; rr(ctx, -205, -255, 410, 510, 50); ctx.strokeStyle = th.accent; ctx.lineWidth = 10; ctx.stroke(); ctx.restore(); }
      rr(ctx, -185, -235, 370, 470, 40); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(th.ink, .12); ctx.lineWidth = 3; ctx.stroke();
      disc(ctx, it.icon, 0, -60, 115, side === "left" ? "rgba(59,36,24,.78)" : th.accent, "#fff");
      label(ctx, th, it.label, 0, 150, 54, "#3B2418");
      if (it.sub){ font(ctx, 500, 30, th.fam); ctx.fillStyle = "#9A6A50"; ctx.textAlign = "center"; ctx.fillText(it.sub, 0, 200); ctx.textAlign = "left"; }
      if (wp > 0){ ctx.save(); ctx.translate(140, -200); ctx.scale(eBack(clamp(wp, 0, 1)), eBack(clamp(wp, 0, 1))); ctx.beginPath(); ctx.arc(0, 0, 46, 0, TAU); ctx.fillStyle = isW ? "#3BB273" : "#B8AE9D"; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); if (isW){ ctx.moveTo(-18, 0); ctx.lineTo(-5, 14); ctx.lineTo(20, -14); } else { ctx.moveTo(-14, -14); ctx.lineTo(14, 14); ctx.moveTo(14, -14); ctx.lineTo(-14, 14); } ctx.stroke(); ctx.restore(); }
      ctx.restore(); });
    const vs = popS(t, (tL + tR) / 2); if (vs){ ctx.save(); ctx.translate(540, 900); ctx.scale(vs * (1 + Math.sin(t * 4) * .04), vs * (1 + Math.sin(t * 4) * .04)); ctx.rotate(-.08);
      ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fillStyle = th.key === "B" ? th.accent : th.ink; ctx.fill(); label(ctx, th, "VS", 0, 18, 50, "#FFF7EE"); ctx.restore(); }
    burst(ctx, win === "left" ? 290 : 790, 680, tW != null ? t - tW : -1, M, 10);
  };

  R.meter = (ctx, th, s, t) => {
    const f = s.f, marks = f.marks || [], n = Math.max(1, marks.length); topHead(ctx, th, f, t);
    const cx = 540, cy = 1150, R0 = 360, a0 = Math.PI, a1 = TAU;
    const show = popS(t, .15); if (!show) return;
    ctx.save(); ctx.globalAlpha *= clamp((t - .15) * 3, 0, 1);
    ctx.lineCap = "round"; ctx.lineWidth = 62; ctx.strokeStyle = hexA(th.accent, .16); ctx.beginPath(); ctx.arc(cx, cy, R0, a0, a1); ctx.stroke();
    const tm = marks.map((m, i) => cueT(s, m.cue, (i + 1) / (n + 1)));
    let v = f.from ?? .12; tm.forEach((tt, i) => { const q = easeIO(clamp((t - tt) / .6, 0, 1)); v += ((f.to ?? 1) - (f.from ?? .12)) / n * q; });
    v += Math.sin(t * 6) * .006;
    const g = ctx.createLinearGradient(cx - R0, 0, cx + R0, 0); g.addColorStop(0, hexA(th.accent, .55)); g.addColorStop(1, th.accent);
    ctx.strokeStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R0, a0, a0 + (a1 - a0) * clamp(v, 0, 1)); ctx.stroke();
    for (let k = 0; k <= 10; k++){ const a = a0 + (a1 - a0) * k / 10; ctx.strokeStyle = hexA(th.ink, .25); ctx.lineWidth = k % 5 ? 4 : 7; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R0 - 60), cy + Math.sin(a) * (R0 - 60)); ctx.lineTo(cx + Math.cos(a) * (R0 - 80 - (k % 5 ? 0 : 12)), cy + Math.sin(a) * (R0 - 80 - (k % 5 ? 0 : 12))); ctx.stroke(); }
    const an = a0 + (a1 - a0) * clamp(v, 0, 1); ctx.strokeStyle = th.ink; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * (R0 - 110), cy + Math.sin(an) * (R0 - 110)); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 34, 0, TAU); ctx.fillStyle = th.ink; ctx.fill(); if (f.icon) disc(ctx, f.icon, cx, cy - 150, 62, th.accent, "#fff");
    label(ctx, th, f.left || "", cx - R0, cy + 90, 40, th.muted); label(ctx, th, f.right || "", cx + R0, cy + 90, 44, v > .9 ? th.accent : th.muted);
    marks.forEach((m, i) => { const sc = popS(t, tm[i]); if (!sc) return; const a = a0 + (a1 - a0) * ((f.from ?? .12) + ((f.to ?? 1) - (f.from ?? .12)) * (i + 1) / n) - .12, py = cy + Math.sin(a) * (R0 + 95); let px = cx + Math.cos(a) * (R0 + 95);
      font(ctx, 700, 34, th.fam); const w = ctx.measureText(m.label).width + 90; px = clamp(px, w / 2 + 24, W - w / 2 - 24);
      ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc); font(ctx, 700, 34, th.fam);
      rr(ctx, -w / 2, -38, w, 76, 38); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = th.accent; ctx.lineWidth = 4; ctx.stroke();
      disc(ctx, m.icon || "check", -w / 2 + 38, 0, 24, th.accent, "#fff"); ctx.fillStyle = "#3B2418"; ctx.fillText(m.label, -w / 2 + 72, 12); ctx.restore(); });
    ctx.restore();
  };

  R.bigicon = (ctx, th, s, t) => {
    const f = s.f, M = mv(), cx = 540, cy = 830; topHead(ctx, th, f, t);
    const sc = popS(t, .12, .6); if (!sc) return;
    for (let k = 0; k < 3; k++){ const q = ((t * .5) + k / 3) % 1; ctx.strokeStyle = hexA(th.accent, .35 * (1 - q)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, 240 + q * 200, 0, TAU); ctx.stroke(); }
    const orbit = f.orbit || []; orbit.forEach((nm, k) => { const a = t * .55 + k * TAU / orbit.length, ox = cx + Math.cos(a) * 345, oy = cy + Math.sin(a) * 300, os = popS(t, .4 + k * .15);
      if (!os) return; ctx.save(); ctx.translate(ox, oy); ctx.scale(os, os); ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(th.accent, .4); ctx.lineWidth = 4; ctx.stroke();
      icon(ctx, nm, -32, -32, 64, M.pal[k % 3], 2.2); ctx.restore(); });
    ctx.save(); ctx.translate(cx, cy + Math.sin(t * 1.5) * 8); ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 1.1) * .03);
    ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = th.ink; ctx.lineWidth = 8; ctx.stroke();
    icon(ctx, f.icon || "star", -135, -135, 270, "#fff", 1.8); ctx.restore();
    if (f.word){ ctx.save(); const tw = f.wordCue ? cueT(s, f.wordCue, .5) : .6; if (enter(ctx, "up", t, tw)) drawRich(ctx, { text: f.word, hl: f.highlight, x: 90, y: 1170, maxW: 900, size: 104, weight: th.w, fam: th.fam, color: th.ink, accent: th.accent, maxLines: 2, align: "center", minSize: 60 }); ctx.restore(); }
  };

  R.flow = (ctx, th, s, t) => {
    const f = s.f, M = mv(), nodes = (f.nodes || []).slice(0, 5), n = nodes.length; topHead(ctx, th, f, t);
    const top = f.headline ? 640 : 560, bot = 1250, P = nodes.map((nd, i) => [i % 2 ? 790 : 290, top + (bot - top) * (n > 1 ? i / (n - 1) : .5)]);
    const tn = nodes.map((nd, i) => cueT(s, nd.cue, i / Math.max(1, n)));
    const seg = (i, q) => { const [x0, y0] = P[i], [x1, y1] = P[i + 1], my = (y0 + y1) / 2; const pt = (u) => { const a = 1 - u; return [a * a * a * x0 + 3 * a * a * u * x0 + 3 * a * u * u * x1 + u * u * u * x1, a * a * a * y0 + 3 * a * a * u * my + 3 * a * u * u * my + u * u * u * y1]; };
      ctx.beginPath(); for (let k = 0; k <= 40 * q; k++){ const [x, y] = pt(k / 40); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); return pt; };
    ctx.save(); ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 40; ctx.strokeStyle = hexA(th.accent, .7); ctx.lineWidth = 7; ctx.lineCap = "round";
    const pts = []; for (let i = 0; i < n - 1; i++){ const q = clamp((t - tn[i]) / Math.max(.3, tn[i + 1] - tn[i]), 0, 1); if (q > 0) pts.push([seg(i, q), q]); } ctx.restore();
    pts.forEach(([pt, q], i) => { const u = ((t * .6 + i * .3) % 1) * q, [x, y] = pt(u); const g = ctx.createRadialGradient(x, y, 0, x, y, 30); g.addColorStop(0, hexA(M.pal[1], .9)); g.addColorStop(1, hexA(M.pal[1], 0)); ctx.fillStyle = g; ctx.fillRect(x - 30, y - 30, 60, 60); });
    let cur = -1; tn.forEach((tt, i) => { if (t >= tt) cur = i; });
    nodes.forEach((nd, i) => { const sc = popS(t, tn[i]); if (!sc) return; const [x, y] = P[i];
      ctx.save(); ctx.translate(x, y + Math.sin(t * 1.5 + i) * 5); ctx.scale(sc, sc);
      if (i === cur){ const q = (t * 1.2) % 1; ctx.strokeStyle = hexA(th.accent, .5 * (1 - q)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 96 + q * 50, 0, TAU); ctx.stroke(); }
      disc(ctx, nd.icon, 0, 0, n > 4 ? 76 : 88, i === cur ? th.accent : "#FFFFFF", i === cur ? "#fff" : th.accent, i === cur ? null : hexA(th.accent, .55));
      const lx = i % 2 ? -150 : 150; font(ctx, 700, 40, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = i % 2 ? "right" : "left"; ctx.fillText(nd.label, lx, 14); ctx.textAlign = "left";
      ctx.restore(); });
  };

  R.week = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    const days = f.days || ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"], x0 = 225, step = 126;
    const yt = f.headline ? 650 : 590, yA = yt + 56, yB = 1300, Y = v => yA + (yB - yA) * clamp(v, 0, 1);
    const ta = f.align ? cueT(s, f.align.cue, .7) : null;
    (f.axis || []).forEach(a => { const y = Y(a.at); ctx.strokeStyle = hexA(th.ink, .14); ctx.lineWidth = 2; ctx.setLineDash([8, 10]); ctx.beginPath(); ctx.moveTo(165, y); ctx.lineTo(1010, y); ctx.stroke(); ctx.setLineDash([]);
      font(ctx, 600, 26, th.fam); ctx.fillStyle = th.muted; ctx.textAlign = "right"; ctx.fillText(a.label, 150, y + 9); ctx.textAlign = "left"; });
    days.forEach((d, i) => { const x = x0 + i * step, sc = popS(t, .1 + i * .05); if (!sc) return;
      ctx.save(); ctx.globalAlpha *= clamp((t - .1 - i * .05) * 3, 0, 1);
      rr(ctx, x - 50, yA - 14, 100, yB - yA + 28, 26); ctx.fillStyle = hexA(th.ink, .05); ctx.fill();
      label(ctx, th, d, x, yt + 14, 32, (f.today === i) ? th.accent : th.ink); ctx.restore(); });
    (f.items || []).forEach((it, k) => { const ti = cueT(s, it.cue, .12 + k * .08); if (t < ti) return;
      const x = x0 + it.day * step, g = eOut(prog(t, ti, .5));
      let a = it.from, b = it.to; if (ta != null && f.align && t > ta){ const q = easeIO(prog(t, ta + it.day * .07, .8)); a += (f.align.from - a) * q; b += (f.align.to - b) * q; }
      const ya = Y(a), yb = ya + (Y(b) - ya) * g, col = it.color === "alert" ? "#D84315" : it.color === "soft" ? hexA(th.accent, .45) : th.accent;
      ctx.save(); rr(ctx, x - 40, ya, 80, Math.max(20, yb - ya), 40); ctx.fillStyle = col; ctx.fill();
      if (it.icon && yb - ya > 90) icon(ctx, it.icon, x - 20, ya + 18, 40, "#fff", 2.4);
      if (it.label && yb - ya > 150){ ctx.save(); ctx.beginPath(); ctx.rect(x - 40, ya, 80, yb - ya); ctx.clip(); ctx.translate(x + 11, yb - 22); ctx.rotate(-Math.PI / 2);
        font(ctx, 700, 30, th.fam); ctx.fillStyle = "#fff"; ctx.fillText(it.label, 0, 0); ctx.restore(); }
      ctx.restore();
      if (k === 0 && it.day != null) burst(ctx, x, ya, t - ti - .5, M, 6); });
    if (ta != null && f.align && t > ta + .9){ const q = eOut(prog(t, ta + .9, .5)); ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = th.accent; ctx.lineWidth = 5; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 30;
      [f.align.from, f.align.to].forEach((v, j) => { const y = Y(v); ctx.beginPath(); ctx.moveTo(165, y); ctx.lineTo(1010, y); ctx.stroke(); }); ctx.setLineDash([]);
      if (f.align.labels){ font(ctx, 800, 30, th.fam); ctx.fillStyle = th.accent; ctx.textAlign = "right"; f.align.labels.forEach((l, j) => ctx.fillText(l, 150, Y(j ? f.align.to : f.align.from) + 10)); ctx.textAlign = "left"; }
      ctx.restore(); }
  };

  /* ---------- second animation set: kinetic, sort, stack, split, scale, chart, phone ---------- */
  const INK = "#3B2418";
  const sceneDur = () => { const st = TL.scenes[G.scene]; return st ? st.end - st.start : 8; };
  R.kinetic = (ctx, th, s, t) => {
    const f = s.f, M = mv(), L = f.lines || [], n = L.length; if (!n) return;
    const tm = L.map((l, i) => (i === 0 && !l.cue) ? .1 : cueT(s, l.cue, i / n));
    let cur = -1; tm.forEach((tt, i) => { if (t >= tt) cur = i; }); if (cur < 0) return;
    const draw = (i, lt, out) => {
      const l = L[i], q = out ? clamp(lt / .2, 0, 1) : 0, inP = clamp((lt - (i ? .08 : 0)) / .4, 0, 1);
      const sc = out ? 1 - .25 * q : 1.7 - .7 * eBack(inP), a = out ? 1 - q : clamp((lt - (i ? .08 : 0)) * 6, 0, 1), tilt = (i % 2 ? 1 : -1) * .035;
      ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 900 - q * 260 + (out ? 0 : Math.sin(t * 1.4) * 6)); ctx.rotate(out ? tilt : tilt * eOut(inP)); ctx.scale(sc, sc);
      rr(ctx, -450, -260, 900, 520, 64); ctx.fillStyle = hexA(M.pal[i % 3], .17); ctx.fill();
      ctx.save(); ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = hexA(M.pal[(i + 1) % 3], .45); ctx.lineWidth = 5; rr(ctx, -470, -280, 940, 560, 76); ctx.stroke(); ctx.restore();
      if (l.icon) icon(ctx, l.icon, -50, -240 + Math.sin(t * 2.2) * 6, 100, th.accent, 2.2);
      const es = G.enterStart; G.enterStart = null;
      drawRich(ctx, { text: l.text, hl: l.hl, x: -420, y: l.icon ? -120 : -150, maxW: 840, size: l.size || 116, weight: 800, fam: th.fam, color: th.ink, accent: th.accent, maxLines: 3, align: "center", minSize: 64 });
      G.enterStart = es; ctx.restore(); };
    if (cur > 0 && t - tm[cur] < .2) draw(cur - 1, t - tm[cur], true);
    draw(cur, t - tm[cur], false);
    burst(ctx, 540, 900, t - tm[cur] - .2, M, 12);
  };

  R.sort = (ctx, th, s, t) => {
    const f = s.f, M = mv(), bins = f.bins || [], cards = f.cards || []; topHead(ctx, th, f, t);
    const BX = [300, 780], BY = 1080, BW = 420, BH = 230;
    bins.forEach((b, j) => { const sc = popS(t, .15 + j * .1); if (!sc) return; ctx.save(); ctx.translate(BX[j], BY); ctx.scale(sc, sc);
      rr(ctx, -BW / 2, 0, BW, BH, 28); ctx.fillStyle = j ? hexA(th.accent, .16) : "rgba(59,36,24,.10)"; ctx.fill();
      ctx.strokeStyle = j ? th.accent : "rgba(59,36,24,.55)"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-BW / 2, 0); ctx.lineTo(-BW / 2, BH - 28); ctx.quadraticCurveTo(-BW / 2, BH, -BW / 2 + 28, BH);
      ctx.lineTo(BW / 2 - 28, BH); ctx.quadraticCurveTo(BW / 2, BH, BW / 2, BH - 28); ctx.lineTo(BW / 2, 0); ctx.stroke();
      font(ctx, 800, 38, th.fam); const w = ctx.measureText(b.label).width + (b.icon ? 100 : 56); rr(ctx, -w / 2, -82, w, 68, 34); ctx.fillStyle = j ? th.accent : INK; ctx.fill();
      if (b.icon) icon(ctx, b.icon, -w / 2 + 22, -70, 44, "#fff", 2.4); ctx.fillStyle = "#fff"; ctx.fillText(b.label, -w / 2 + (b.icon ? 76 : 28), -35); ctx.restore(); });
    const count = [0, 0];
    cards.forEach((c, k) => { const tc = cueT(s, c.cue, .15 + k * .2); if (t < tc) return;
      const slot = count[c.bin]++, lt = t - tc, fly = easeIO(clamp((lt - .9) / .7, 0, 1));
      const x0 = 540, y0 = f.headline ? 760 : 700, x1 = BX[c.bin], y1 = BY + BH - 46 - slot * 60;
      const x = x0 + (x1 - x0) * fly, y = y0 + (y1 - y0) * fly - Math.sin(Math.PI * fly) * 180, sc = popS(t, tc) * (1 - .58 * fly);
      ctx.save(); ctx.translate(x, y); ctx.rotate((c.bin ? .12 : -.12) * Math.sin(Math.PI * fly)); ctx.scale(sc, sc);
      rr(ctx, -372, -60, 760, 136, 24); ctx.fillStyle = "rgba(59,36,24,.14)"; ctx.fill(); rr(ctx, -380, -70, 760, 136, 24); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      ctx.strokeStyle = c.bin ? th.accent : "rgba(59,36,24,.45)"; ctx.lineWidth = 5; ctx.stroke();
      const es = G.enterStart; G.enterStart = null;
      drawRich(ctx, { text: c.text, x: -350, y: c.text.length > 24 ? -50 : -30, maxW: 700, size: 46, weight: 700, fam: th.fam, color: INK, accent: INK, maxLines: 2, minSize: 30, align: "center", track: -.5 });
      G.enterStart = es; ctx.restore();
      if (fly >= 1) burst(ctx, x1, BY - 10, lt - 1.6, M, 6); });
  };

  R.stack = (ctx, th, s, t) => {
    const f = s.f, M = mv(), items = f.items || [], n = items.length, box = f.container === "box"; topHead(ctx, th, f, t);
    const cx = 540, top = f.headline ? 720 : 660, H0 = box ? 500 : 540, W0 = box ? 640 : 470, bottom = top + H0;
    if (!popS(t, .1)) return;
    ctx.save(); ctx.globalAlpha *= clamp((t - .1) * 3, 0, 1);
    if (box){ rr(ctx, cx - W0 / 2, top, W0, H0, 30); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill(); ctx.strokeStyle = "rgba(59,36,24,.5)"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(cx - W0 / 2, top); ctx.lineTo(cx - W0 / 2, bottom); ctx.lineTo(cx + W0 / 2, bottom); ctx.lineTo(cx + W0 / 2, top); ctx.stroke(); }
    else { rr(ctx, cx - W0 / 2, top, W0, H0, 80); ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fill(); ctx.strokeStyle = "rgba(59,36,24,.45)"; ctx.lineWidth = 6; ctx.stroke();
      rr(ctx, cx - W0 / 2 + 36, top - 54, W0 - 72, 60, 18); ctx.fillStyle = th.accent; ctx.fill(); }
    ctx.restore();
    const LH = Math.min(118, (H0 - 40) / Math.max(1, n));
    items.forEach((it, k) => { const ti = cueT(s, it.cue, .15 + k * .15); if (t < ti) return;
      const p = clamp((t - ti) / .75, 0, 1), yLand = bottom - 18 - (k + 1) * LH, yStart = top - 260;
      let y = yStart + (yLand - yStart) * Math.pow(Math.min(1, p / .7), 2); if (p > .7){ const b = (p - .7) / .3; y = yLand - Math.sin(Math.PI * b) * 34 * (1 - b); }
      ctx.save(); rr(ctx, cx - W0 / 2 + 24, y, W0 - 48, LH - 12, 24); ctx.fillStyle = hexA(M.pal[k % 3], .9); ctx.fill();
      if (it.icon) icon(ctx, it.icon, cx - W0 / 2 + 44, y + (LH - 12) / 2 - 22, 44, "#fff", 2.4);
      if (it.label){ font(ctx, 700, LH > 90 ? 40 : 32, th.fam); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(it.label, cx + (it.icon ? 24 : 0), y + (LH - 12) / 2 + 13); ctx.textAlign = "left"; }
      ctx.restore(); burst(ctx, cx, yLand, t - ti - .55, M, 8); });
    if (!box){ ctx.save(); ctx.globalAlpha *= .5; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - W0 / 2 + 40, top + 90); ctx.lineTo(cx - W0 / 2 + 40, top + 220); ctx.stroke(); ctx.restore(); }
    if (f.label) label(ctx, th, f.label, cx, bottom + 70, 44);
  };

  R.split = (ctx, th, s, t) => {
    const f = s.f, M = mv(), parts = f.parts || [], n = Math.max(1, parts.length), big = f.big || {}; topHead(ctx, th, f, t);
    const tS = cueT(s, f.splitCue, .25), cy0 = f.headline ? 880 : 840, W0 = 860, H0 = 300, rowTop = f.headline ? 700 : 650, rowH = Math.min(150, 640 / n);
    const sc = popS(t, .1); if (!sc) return;
    if (t < tS + .15){
      const k = clamp((t - (tS - .6)) / .6, 0, 1), shake = Math.sin(t * 60) * 7 * k;
      ctx.save(); ctx.translate(540 + shake, cy0 + Math.sin(t * 1.5) * 6); ctx.scale(sc, sc);
      rr(ctx, -W0 / 2, -H0 / 2, W0, H0, 40); ctx.fillStyle = th.accent; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
      if (big.icon) icon(ctx, big.icon, -40, -120, 80, "#fff", 2.2);
      const es = G.enterStart; G.enterStart = null;
      drawRich(ctx, { text: big.label || "", x: -W0 / 2 + 30, y: big.icon ? -24 : -60, maxW: W0 - 60, size: 72, weight: 800, fam: th.fam, color: "#fff", accent: "#fff", maxLines: 2, minSize: 44, align: "center", track: -1 });
      G.enterStart = es;
      if (k > 0){ ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineJoin = "round"; for (let j = 1; j < n; j++){ const x = -W0 / 2 + W0 * j / n; ctx.beginPath(); ctx.moveTo(x, -H0 / 2);
        for (let z = 1; z <= 6 * k; z++) ctx.lineTo(x + (z % 2 ? 16 : -16), -H0 / 2 + H0 * z / 6); ctx.stroke(); } }
      ctx.restore(); return; }
    parts.forEach((pt, i) => {
      const p = easeIO(clamp((t - tS - .15 - i * .1) / .8, 0, 1)), xs = 540 - W0 / 2 + W0 * (i + .5) / n, ys = cy0, ws = W0 / n, hs = H0;
      const xt = 540, yt = rowTop + i * rowH + rowH / 2, wt = 860, ht = rowH - 22;
      const x = xs + (xt - xs) * p, y = ys + (yt - ys) * p, w = ws + (wt - ws) * p, h = hs + (ht - hs) * p;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(Math.PI * p) * .25 * (i % 2 ? 1 : -1));
      rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = th.accent; ctx.fill(); ctx.globalAlpha *= p; rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.globalAlpha = 1;
      if (p > .9){ rr(ctx, -w / 2, -h / 2, 16, h, 8); ctx.fillStyle = th.accent; ctx.fill();
        ctx.beginPath(); ctx.arc(-w / 2 + 70, 0, Math.min(36, h / 2 - 6), 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); label(ctx, th, String(i + 1), -w / 2 + 70, 14, 38, "#fff");
        const tl = cueT(s, pt.cue, .4 + i * .15); if (t > tl){ const a = eOut(prog(t, tl, .4)); ctx.save(); ctx.globalAlpha *= a; ctx.translate(-30 * (1 - a), 0);
          font(ctx, 700, Math.min(46, h * .42), th.fam); ctx.fillStyle = INK; ctx.fillText(pt.label, -w / 2 + 128, 15); ctx.restore(); } }
      ctx.restore(); });
    burst(ctx, 540, cy0, t - tS - .1, M, 14);
  };

  R.scale = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    const px = 540, py = f.headline ? 840 : 800, half = 330, Ls = (f.left && f.left.items) || [], Rs = (f.right && f.right.items) || [];
    if (!popS(t, .1)) return;
    const ev = []; Ls.forEach((it, k) => ev.push([cueT(s, it.cue, .2 + k * .1), "l"])); Rs.forEach((it, k) => ev.push([cueT(s, it.cue, .5 + k * .1), "r"])); ev.sort((a, b) => a[0] - b[0]);
    const wl = (f.left && f.left.weight) || 1, wr = (f.right && f.right.weight) || 1;
    let nl = 0, nr = 0, prev = 0, tgt = 0, tc = -9;
    for (const [te, side] of ev){ if (t < te + .45) break; prev = tgt; side === "l" ? nl++ : nr++; tgt = clamp((nr * wr - nl * wl) * .1, -.3, .3); tc = te + .45; }
    const dt = t - tc, ang = tgt + (prev - tgt) * Math.exp(-3 * Math.max(0, dt)) * Math.cos(9 * Math.max(0, dt));
    ctx.save(); ctx.globalAlpha *= clamp((t - .1) * 3, 0, 1);
    ctx.fillStyle = INK; rr(ctx, px - 14, py, 28, 1250 - py, 10); ctx.fill(); rr(ctx, px - 130, 1240, 260, 34, 17); ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 22, 0, TAU); ctx.fill();
    const ends = [-1, 1].map(d => [px + d * half * Math.cos(ang), py + d * half * Math.sin(ang)]);
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang); rr(ctx, -half - 30, -14, 2 * half + 60, 28, 14); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
    [[ends[0], Ls, f.left, nl, "l"], [ends[1], Rs, f.right, nr, "r"]].forEach(([[ex, ey], items, side, cnt, key]) => {
      const pc = ey + 190; ctx.strokeStyle = hexA(INK, .6); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 120, pc); ctx.moveTo(ex, ey); ctx.lineTo(ex + 120, pc); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - 150, pc); ctx.quadraticCurveTo(ex, pc + 90, ex + 150, pc); ctx.closePath(); ctx.fillStyle = key === "r" ? th.accent : "#B87333"; ctx.fill();
      items.forEach((it, k) => { const te = cueT(s, it.cue, (key === "l" ? .2 : .5) + k * .1); if (t < te) return; const q = clamp((t - te) / .45, 0, 1);
        const col = k % 3, row = Math.floor(k / 3), tx = ex + (col - 1) * 84, ty = pc - 46 - row * 80, y = ty - (1 - q * q) * 380;
        disc(ctx, it.icon || "star", tx, y, 40, "#FFFFFF", key === "r" ? th.accent : "#B87333", hexA(INK, .25)); });
      if (side && side.label) label(ctx, th, side.label, ex, pc + 130, 42); });
    ctx.restore();
  };

  R.chart = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    const x0 = 170, x1 = 990, y0 = f.headline ? 760 : 680, y1 = 1250, labels = f.labels || [], n = labels.length, ser = f.series || [];
    if (!popS(t, .1) || !n) return;
    const tc = cueT(s, f.cue, .15), vmax = f.max || Math.max(1, ...ser.flatMap(se => se.values)), dark = th.key === "B";
    const col = se => se.color === "muted" ? (dark ? "rgba(250,248,243,.35)" : "rgba(59,36,24,.32)") : se.color === "alert" ? "#D84315" : th.accent;
    ctx.save(); ctx.globalAlpha *= clamp((t - .1) * 3, 0, 1);
    for (let g = 0; g <= 3; g++){ const y = y1 - (y1 - y0 - 40) * g / 3; ctx.strokeStyle = hexA(dark ? "#FAF8F3" : INK, g ? .1 : .4); ctx.lineWidth = g ? 2 : 4; ctx.setLineDash(g ? [10, 10] : []); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
    ctx.setLineDash([]);
    const gw = (x1 - x0) / n; labels.forEach((l, i) => { font(ctx, 600, 30, th.fam); ctx.fillStyle = th.muted; ctx.textAlign = "center"; ctx.fillText(l, x0 + gw * (i + .5), y1 + 46); ctx.textAlign = "left"; });
    let lx = x0; ser.forEach(se => { if (!se.name) return; font(ctx, 700, 30, th.fam); const w = ctx.measureText(se.name).width + 64; rr(ctx, lx, y0 - 70, w, 52, 26); ctx.fillStyle = dark ? "rgba(250,248,243,.08)" : "#FFFFFF"; ctx.fill();
      ctx.beginPath(); ctx.arc(lx + 28, y0 - 44, 10, 0, TAU); ctx.fillStyle = col(se); ctx.fill(); ctx.fillStyle = th.ink; ctx.fillText(se.name, lx + 48, y0 - 33); lx += w + 16; });
    const Y = v => y1 - (y1 - y0 - 40) * v / vmax;
    ser.forEach((se, j) => { const ts = se.cue ? cueT(s, se.cue, .3) : tc;
      if (f.kind === "line"){ const p = clamp((t - ts) / 1.8, 0, 1) * (n - 1); if (t < ts) return; const pts = se.values.map((v, i) => [x0 + gw * (i + .5), Y(v)]);
        ctx.strokeStyle = col(se); ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); let tip = pts[0];
        for (let i = 0; i <= Math.floor(p); i++){ i ? ctx.lineTo(...pts[i]) : ctx.moveTo(...pts[i]); tip = pts[i]; }
        if (p % 1 > 0 && pts[Math.floor(p) + 1]){ const a = pts[Math.floor(p)], b = pts[Math.floor(p) + 1], u = p % 1; tip = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; ctx.lineTo(...tip); }
        ctx.stroke(); pts.forEach((q, i) => { if (i <= p){ ctx.beginPath(); ctx.arc(q[0], q[1], 13, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = col(se); ctx.lineWidth = 6; ctx.stroke(); } });
        const g = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 40); g.addColorStop(0, hexA(se.color === "muted" ? "#9A6A50" : "#E89544", .8)); g.addColorStop(1, "rgba(232,149,68,0)"); ctx.fillStyle = g; ctx.fillRect(tip[0] - 40, tip[1] - 40, 80, 80);
      } else { const bw = gw * .64 / ser.length;
        se.values.forEach((v, i) => { const q = eOut(prog(t, ts + i * .12, .7)); if (q <= 0) return; const h = Math.max(6, (y1 - Y(v))) * q, bx = x0 + gw * i + gw * .18 + j * bw;
          rr(ctx, bx, y1 - h, bw - 8, h, Math.min(14, bw / 3)); ctx.fillStyle = col(se); ctx.fill();
          if (se.show && q > .9){ font(ctx, 700, 28, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = "center"; ctx.fillText(se.show[i] || "", bx + (bw - 8) / 2, y1 - h - 14); ctx.textAlign = "left"; } }); } });
    ctx.restore();
  };

  R.phone = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    const tOff = f.offCue ? cueT(s, f.offCue, .6) : null, off = tOff != null ? easeIO(clamp((t - tOff) / 1, 0, 1)) : 0;
    if (!popS(t, .1)) return;
    if (off > 0){ ctx.save(); ctx.globalAlpha *= off; const g = ctx.createLinearGradient(0, 600, 0, 1340); g.addColorStop(0, "#2A1A12"); g.addColorStop(1, "#5A3320"); rr(ctx, 90, 600, 900, 740, 48); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(820, 740, 60, 0, TAU); ctx.fillStyle = "#F4A85C"; ctx.fill(); ctx.beginPath(); ctx.arc(846, 720, 56, 0, TAU); ctx.fillStyle = "#33201A"; ctx.fill();
      for (let k = 0; k < 3; k++){ const q = ((t - tOff) * .35 + k / 3) % 1; ctx.globalAlpha = off * Math.sin(q * Math.PI); label(ctx, th, "Z", 420 + k * 70 + q * 60, 1120 - q * 300, 60 + k * 16, "#FFF7EE"); }
      ctx.restore(); }
    const parse = l => { const m = /(\d{1,2})[.:](\d{2})/.exec(l || ""); return m ? +m[1] * 60 + +m[2] : null; };
    let m0 = parse(f.from), m1 = parse(f.to) ?? m0; if (m0 != null && m1 < m0) m1 += 1440;
    const end = tOff != null ? tOff : sceneDur() - .3, mm = m0 == null ? null : m0 + (m1 - m0) * clamp((t - .3) / Math.max(.5, end - .3), 0, 1);
    const cx = 540 - off * 230, cy = 960 + off * 230, rot = -off * Math.PI / 2;
    if (off < 1){ ctx.save(); ctx.globalAlpha *= 1 - off; const g = ctx.createRadialGradient(cx, cy, 80, cx, cy, 560); g.addColorStop(0, "rgba(255,247,238,.75)"); g.addColorStop(1, "rgba(255,247,238,0)"); ctx.fillStyle = g; ctx.fillRect(0, 500, W, 900); ctx.restore(); }
    ctx.save(); ctx.translate(cx, cy + Math.sin(t * 1.3) * 6 * (1 - off)); ctx.rotate(rot); ctx.scale(1 - off * .5, 1 - off * .5);
    rr(ctx, -215, -390, 430, 780, 62); ctx.fillStyle = "#18150f"; ctx.fill();
    rr(ctx, -195, -360, 390, 720, 42); ctx.fillStyle = off > .5 ? "#18150f" : "#FFF7EE"; ctx.fill();
    if (off <= .5){ ctx.save(); rr(ctx, -195, -360, 390, 720, 42); ctx.clip();
      const sp = 250, o = (t * 230) % sp, base = Math.floor(t * 230 / sp);
      for (let k = -1; k < 4; k++){ const y = -300 + k * sp - o, c = M.pal[((k + base) % 3 + 3) % 3];
        rr(ctx, -175, y, 350, sp - 24, 26); ctx.fillStyle = hexA(c, .3); ctx.fill(); rr(ctx, -155, y + 20, 310, 140, 18); ctx.fillStyle = hexA(c, .75); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-14, y + 70); ctx.lineTo(22, y + 90); ctx.lineTo(-14, y + 110); ctx.closePath(); ctx.fillStyle = "#fff"; ctx.fill();
        ctx.fillStyle = "rgba(59,36,24,.3)"; rr(ctx, -155, y + 176, 220, 14, 7); ctx.fill(); rr(ctx, -155, y + 200, 160, 12, 6); ctx.fill(); }
      rr(ctx, -195, -360, 390, 64, 0); ctx.fillStyle = "#FFF7EE"; ctx.fill();
      if (mm != null){ const hh = Math.floor(mm / 60) % 24, mi = Math.floor(mm % 60); font(ctx, 800, 30, th.fam); ctx.fillStyle = INK; ctx.fillText(`${String(hh).padStart(2, "0")}.${String(mi).padStart(2, "0")}`, -150, -316); }
      ctx.restore(); }
    rr(ctx, -60, -380, 120, 22, 11); ctx.fillStyle = "#000"; ctx.fill();
    ctx.restore();
  };

  /* ---------- character animation: R.stage (people that walk, sit, type, call, talk) ---------- */
  // Right-side limb angles (absolute; 0 = straight down, PI/2 = outward, PI = up). Left side is mirrored.
  const POSE = {
    stand: { ra: [.15, .08], la: [.15, .08] }, talk: { ra: [.55, -.5], la: [.15, .08], osc: [0, .35, 5] },
    type: { ra: [.35, -.95], la: [.35, -.95], osc: [0, .12, 16] }, rest: { ra: [.35, -.95], la: [.35, -.95] },
    holdphone: { ra: [.3, -1.75], la: [.25, -1.55], prop: "phone-front", tilt: .12 }, phone: { ra: [2.3, 3.9], la: [.15, .08], prop: "phone-ear" },
    wave: { ra: [2.7, 2.9], la: [.15, .08], osc: [0, .4, 7] }, point: { ra: [1.5, 1.55], la: [.15, .08] },
    shrug: { ra: [.9, 2.1], la: [.9, 2.1] }, thumbs: { ra: [.45, 2.75], la: [.15, .08], prop: "thumb" },
    think: { ra: [.3, 3.5], la: [.35, -1.9] }, cross: { ra: [.35, -1.95], la: [.35, -1.95] },
    work: { ra: [.55, -1.2], la: [.55, -1.2], osc: [0, .32, 6] }, cheer: { ra: [2.75, 2.95], la: [2.75, 2.95], osc: [.12, 0, 4] },
    down: { ra: [.05, .02], la: [.05, .02], tilt: .18 },
    drink: { ra: [2.72, -1.3], la: [.15, .08], prop: "glass", tilt: -.05 }, cover: { ra: [2.72, -1.3], la: [.15, .08] },
  };
  const SKIN = { a: "#D99A6E", b: "#C98B62", c: "#B5774F", d: "#E2A77C" };
  function limb(ctx, x, y, t1, l1, t2, l2, w, col){
    const x1 = x + Math.sin(t1) * l1, y1 = y + Math.cos(t1) * l1, x2 = x1 + Math.sin(t2) * l2, y2 = y1 + Math.cos(t2) * l2;
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    return [x2, y2, t2];
  }
  function keyTimes(s, keys, idx){ return (keys || []).map((k, i) => Object.assign({}, k, { T: k.at != null ? k.at : (k.cue ? cueT(s, k.cue, .1 + i * .1, idx) : 0) })).sort((p, q) => p.T - q.T); }
  function actorState(a, s, t){
    let x = a.x, moveFrom = a.x, moveTo = a.x, mS = -1, mD = 0, pose = a.pose || "stand", expr = a.expr || "neutral", face = a.face || 1, sit = !!a.sit;
    let say = null, sayT = 0, sayDur = 0, chat = false, emote = null, emoteT = 0, shakeT = -9, nodT = -9, show = a.show !== false, showT = -9;
    const at = T => (mS >= 0 && T < mS + mD) ? moveFrom + (moveTo - moveFrom) * easeIO((T - mS) / mD) : moveTo;
    for (const k of keyTimes(s, a.keys)){ if (t < k.T) break;
      if (k.x != null && k.x !== moveTo){ const cx = at(k.T); moveFrom = cx; moveTo = k.x; mS = k.T; mD = Math.max(.3, Math.abs(k.x - cx) / (k.speed || 330)); face = Math.sign(k.x - cx) || face; sit = false; }
      if (k.pose) pose = k.pose; if (k.expr) expr = k.expr; if (k.face) face = k.face; if (k.sit != null) sit = k.sit;
      if (k.say != null){ say = k.say; sayT = k.T; sayDur = k.sayDur || 2.8; chat = !!k.chat; }
      if (k.emote){ emote = k.emote; emoteT = k.T; } if (k.shake) shakeT = k.T; if (k.nod) nodT = k.T; if (k.show != null){ show = k.show; showT = k.T; } }
    const walking = mS >= 0 && t < mS + mD;
    return { x: at(t), walking, pose, expr, face, sit, say: say != null && t - sayT < sayDur ? say : null, sayT, chat, emote: emote && t - emoteT < (a.emoteDur || 1.8) ? emote : null, emoteT, shakeT, nodT, show, showT };
  }
  function drawActor(ctx, th, a, st, t, gy, sc){
    if (!st.show && t - st.showT > .4) return;
    const M = mv(), skin = SKIN[a.skin || "a"], shirt = a.shirt || "#2F6F73", pants = a.pants || "#3B2418", hairC = a.hairColor || "#2B1A12";
    ctx.save(); if (!st.show) ctx.globalAlpha *= 1 - clamp((t - st.showT) / .4, 0, 1); else if (st.showT > 0) ctx.globalAlpha *= clamp((t - st.showT) / .4, 0, 1);
    ctx.translate(st.x, gy); ctx.scale(sc, sc);
    const ph = t * 7.5, sw = st.walking ? Math.sin(ph) : 0, bob = st.walking ? Math.abs(Math.sin(ph)) * 7 : Math.sin(t * 2 + st.x) * 2;
    const hipY = st.sit ? -112 : -182 - bob, neckY = hipY - 150;
    // legs
    if (st.sit){ [-1, 1].forEach(d => { ctx.strokeStyle = pants; ctx.lineWidth = 32; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(d * 20, hipY); ctx.lineTo(d * 26, hipY + 22); ctx.lineTo(d * 30, -8); ctx.stroke();
      ctx.fillStyle = "#18150f"; ctx.beginPath(); ctx.ellipse(d * 34, -2, 24, 11, 0, 0, TAU); ctx.fill(); }); }
    else [-1, 1].forEach(d => { const a1 = st.walking ? d * .42 * sw : d * .05, a2 = st.walking ? a1 - Math.max(0, d * sw) * .35 : d * .02;
      const [fx, fy] = limb(ctx, d * 20, hipY, a1, 92, a2, 88, 32, pants); ctx.fillStyle = "#18150f"; ctx.beginPath(); ctx.ellipse(fx + st.face * 10, fy + 6, 24, 11, 0, 0, TAU); ctx.fill(); });
    // torso
    ctx.beginPath(); ctx.moveTo(-48, neckY + 10); ctx.quadraticCurveTo(-56, neckY + 70, -42, hipY + 8); ctx.lineTo(42, hipY + 8); ctx.quadraticCurveTo(56, neckY + 70, 48, neckY + 10); ctx.quadraticCurveTo(0, neckY - 6, -48, neckY + 10); ctx.fillStyle = shirt; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-14, neckY + 4); ctx.lineTo(0, neckY + 28); ctx.lineTo(14, neckY + 4); ctx.fillStyle = a.hair === "hijab" ? (a.hijab || "#C2691F") : "#FFF7EE"; ctx.fill();
    if (a.badge){ rr(ctx, 14, neckY + 46, 26, 34, 5); ctx.fillStyle = "#FFF7EE"; ctx.fill(); ctx.fillStyle = th.accent; ctx.fillRect(18, neckY + 52, 18, 6); }
    // arms
    const P = POSE[st.walking ? "stand" : st.pose] || POSE.stand, o = P.osc ? Math.sin(t * P.osc[2]) : 0;
    let ra = P.ra.slice(), la = P.la.slice();
    if (st.walking){ ra = [-.35 * sw, -.35 * sw - .25]; la = [.35 * sw, .35 * sw - .25]; }
    else if (P.osc){ ra = [ra[0] + P.osc[0] * o, ra[1] + P.osc[1] * o]; la = [la[0] + P.osc[0] * o, la[1] - (st.pose === "type" ? P.osc[1] * o : P.osc[1] * o * .4)]; if (st.pose === "talk" || st.pose === "wave") la = P.la.slice(); }
    const hands = [];
    [[1, ra], [-1, la]].forEach(([d, [u, f]]) => { const r = limb(ctx, d * 44, neckY + 18, d * u, 72, d * f, 66, 26, shirt); ctx.beginPath(); ctx.arc(r[0], r[1], 15, 0, TAU); ctx.fillStyle = skin; ctx.fill(); hands.push(r); });
    // props in hand
    if (P.prop === "phone-front"){ const hx = (hands[0][0] + hands[1][0]) / 2, hy = (hands[0][1] + hands[1][1]) / 2; rr(ctx, hx - 22, hy - 44, 44, 72, 9); ctx.fillStyle = "#18150f"; ctx.fill(); rr(ctx, hx - 17, hy - 38, 34, 58, 5); ctx.fillStyle = "#9FD3E0"; ctx.fill(); }
    if (P.prop === "phone-ear"){ const [hx, hy] = hands[0]; ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.5); rr(ctx, -12, -40, 24, 64, 7); ctx.fillStyle = "#18150f"; ctx.fill(); ctx.restore(); }
    const glassAt = P.prop === "glass" ? hands[0] : null;
    if (false){ const [gx, gy2] = hands[0]; ctx.save(); ctx.translate(gx - 6, gy2 - 4); ctx.rotate(-.5); rr(ctx, -20, -46, 40, 60, 6); ctx.fillStyle = "rgba(207,231,238,.85)"; ctx.fill(); ctx.strokeStyle = "#8FB8C4"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#7CC4E8"; ctx.fillRect(-17, -20, 34, 30); ctx.restore(); }
    if (P.prop === "thumb"){ const [hx, hy] = hands[0]; rr(ctx, hx - 6, hy - 34, 12, 26, 6); ctx.fillStyle = skin; ctx.fill(); }
    // head
    const shake = t - st.shakeT < 1 ? Math.sin((t - st.shakeT) * 22) * 7 * (1 - (t - st.shakeT)) : 0, nod = t - st.nodT < 1 ? Math.abs(Math.sin((t - st.nodT) * 9)) * 6 * (1 - (t - st.nodT)) : 0;
    const hx = shake, hy = neckY - 58 + nod + (P.tilt || 0) * 40, look = st.face * 6;
    ctx.fillStyle = skin; rr(ctx, -12, neckY - 16, 24, 24, 6); ctx.fill();
    if (a.hair === "long"){ ctx.fillStyle = hairC; rr(ctx, hx - 56, hy - 40, 112, 120, 50); ctx.fill(); }
    if (a.hair === "hijab"){ ctx.fillStyle = a.hijab || "#C2691F"; ctx.beginPath(); ctx.ellipse(hx, hy + 6, 64, 70, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx - 60, hy + 30); ctx.quadraticCurveTo(hx, hy + 120, hx + 60, hy + 30); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(hx, hy, 48, 54, 0, 0, TAU); ctx.fillStyle = skin; ctx.fill();
    if (a.hair !== "hijab"){ ctx.fillStyle = hairC; ctx.beginPath(); ctx.ellipse(hx, hy - 26, 52, 34, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(hx - 52, hy - 22); ctx.quadraticCurveTo(hx - 10, hy - 40, hx + 52, hy - 22); ctx.lineTo(hx + 50, hy - 40); ctx.lineTo(hx - 50, hy - 40); ctx.fill(); }
    else { ctx.fillStyle = a.hijab || "#C2691F"; ctx.beginPath(); ctx.ellipse(hx, hy - 30, 54, 30, 0, Math.PI, TAU); ctx.fill(); }
    // face
    const blink = (t * .7 + st.x * .01) % 3.4 < .12, ex = st.say ? "talk" : st.expr;
    ctx.fillStyle = "#2B1A12"; ctx.strokeStyle = "#2B1A12"; ctx.lineCap = "round";
    [-1, 1].forEach(d => { const exx = hx + d * 17 + look, eyy = hy - 2;
      if (ex === "tired" || ex === "yawn"){ ctx.lineWidth = 4; ctx.beginPath(); if (ex === "yawn"){ ctx.arc(exx, eyy, 7, .1, Math.PI - .1); } else { ctx.moveTo(exx - 8, eyy); ctx.lineTo(exx + 8, eyy); } ctx.stroke(); if (ex === "tired"){ ctx.beginPath(); ctx.arc(exx, eyy + 2, 4, 0, Math.PI); ctx.fill(); } }
      else if (blink || ex === "happy"){ ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(exx, eyy + (ex === "happy" ? 3 : 0), 7, ex === "happy" ? Math.PI * 1.15 : .1, ex === "happy" ? Math.PI * 1.85 : Math.PI - .1); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(exx, eyy, ex === "shock" ? 7 : 5.5, 0, TAU); ctx.fill(); }
      if (ex === "worried" || ex === "confused"){ ctx.lineWidth = 4; ctx.beginPath(); const up = ex === "confused" && d === 1 ? -8 : 0; ctx.moveTo(exx - 9, eyy - 16 + up + (ex === "worried" ? d * -3 : 0)); ctx.lineTo(exx + 9, eyy - 16 + up + (ex === "worried" ? d * 3 : 0)); ctx.stroke(); } });
    if (a.glasses){ ctx.lineWidth = 3; ctx.strokeStyle = "#2B1A12"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(hx + d * 17 + look, hy - 2, 13, 0, TAU); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(hx - 4 + look, hy - 2); ctx.lineTo(hx + 4 + look, hy - 2); ctx.stroke(); }
    ctx.fillStyle = "rgba(233,128,106,.35)"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(hx + d * 30 + look * .5, hy + 14, 9, 0, TAU); ctx.fill(); });
    const mx = hx + look * .6, my = hy + 24; ctx.lineWidth = 4.5; ctx.strokeStyle = "#2B1A12";
    if (ex === "talk"){ const o2 = Math.abs(Math.sin(t * 13)) * 9 + 2; ctx.beginPath(); ctx.ellipse(mx, my, 10, o2 / 2 + 2, 0, 0, TAU); ctx.fillStyle = "#5A2A1E"; ctx.fill(); }
    else if (ex === "smile" || ex === "happy"){ ctx.beginPath(); ctx.arc(mx, my - 6, 14, .25 * Math.PI, .75 * Math.PI); ctx.stroke(); }
    else if (ex === "worried"){ ctx.beginPath(); ctx.arc(mx, my + 10, 12, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    else if (ex === "yawn"){ const o3 = 10 + Math.abs(Math.sin(t * 2.2)) * 10; ctx.beginPath(); ctx.ellipse(mx, my + 4, 13, o3, 0, 0, TAU); ctx.fillStyle = "#5A2A1E"; ctx.fill(); }
    else if (ex === "tired"){ ctx.beginPath(); ctx.moveTo(mx - 10, my + 3); ctx.quadraticCurveTo(mx, my - 1, mx + 10, my + 3); ctx.stroke(); }
    else if (ex === "shock"){ ctx.beginPath(); ctx.ellipse(mx, my, 8, 11, 0, 0, TAU); ctx.fillStyle = "#5A2A1E"; ctx.fill(); }
    else if (ex === "confused"){ ctx.beginPath(); ctx.moveTo(mx - 10, my + 2); ctx.quadraticCurveTo(mx, my - 4, mx + 10, my + 4); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(mx - 9, my); ctx.lineTo(mx + 9, my); ctx.stroke(); }
    if (glassAt){ const [gx, gy2] = glassAt; ctx.save(); ctx.translate(gx - 8, gy2 - 6); ctx.rotate(-.55); rr(ctx, -22, -50, 44, 66, 7); ctx.fillStyle = "rgba(207,231,238,.92)"; ctx.fill(); ctx.strokeStyle = "#8FB8C4"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#7CC4E8"; ctx.fillRect(-19, -22, 38, 34); ctx.restore();
      ctx.beginPath(); ctx.arc(gx, gy2, 15, 0, TAU); ctx.fillStyle = skin; ctx.fill(); }
    ctx.restore();
    return { headX: st.x + hx * sc, headTop: gy + (hy - 60) * sc };
  }
  function bubbleAt(ctx, th, text, x, y, chat, k){
    font(ctx, 700, 34, th.fam); const lines = wrapRich(ctx, text, "", 330).map(l => l.map(z => z.w).join(" ")).slice(0, 3);
    const w = Math.max(90, Math.max(...lines.map(l => ctx.measureText(l).width)) + 48), h = lines.length * 42 + 30, bx = clamp(x - w / 2, 90, 990 - w), by = y - h - 24;
    const sc = eBack(clamp(k / .3, 0, 1)); ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
    ctx.beginPath(); ctx.roundRect(bx, by, w, h, 24); ctx.moveTo(x - 14, by + h - 2); ctx.lineTo(x, y - 4); ctx.lineTo(x + 14, by + h - 2);
    ctx.fillStyle = chat ? "#FCE1C6" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = INK; ctx.textAlign = "center"; lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + 48 + i * 42)); ctx.textAlign = "left"; ctx.restore();
  }
  function emoteAt(ctx, th, e, x, y, k, t){
    const sc = eBack(clamp(k / .3, 0, 1)), b = Math.sin(t * 5) * 6; ctx.save(); ctx.translate(x, y - 20 + b); ctx.scale(sc, sc);
    if (e === "check"){ ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fillStyle = "#3BB273"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-4, 11); ctx.lineTo(15, -11); ctx.stroke(); }
    else if (e === "heart"){ icon(ctx, "heart", -30, -30, 60, th.accent, 3); }
    else if (e === "sparkle"){ for (let k = 0; k < 5; k++){ const a = t * 1.5 + k * TAU / 5; ctx.fillStyle = ["#F4A85C", "#E8A317", "#FFFFFF"][k % 3]; star(ctx, Math.cos(a) * 70, Math.sin(a) * 40, 14 + Math.sin(t * 6 + k) * 4); } }
    else if (e === "sweat"){ ctx.fillStyle = "#7CC4E8"; ctx.beginPath(); ctx.moveTo(0, -30); ctx.bezierCurveTo(22, 0, 18, 22, 0, 24); ctx.bezierCurveTo(-18, 22, -22, 0, 0, -30); ctx.fill(); }
    else if (e === "zzz"){ for (let k = 0; k < 3; k++){ const q = ((t * .4) + k / 3) % 1; ctx.globalAlpha = Math.sin(q * Math.PI); font(ctx, 800, 40 + k * 12, th.fam); ctx.fillStyle = th.accent; ctx.fillText("Z", k * 34 + q * 20, -q * 80); } ctx.globalAlpha = 1; }
    else if (e === "ring"){ ctx.strokeStyle = th.accent; ctx.lineWidth = 6; for (let r = 0; r < 3; r++){ const q = ((t * 1.6) + r / 3) % 1; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.arc(0, 0, 20 + q * 50, -.9, .9); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 20 + q * 50, Math.PI - .9, Math.PI + .9); ctx.stroke(); } }
    else { font(ctx, 800, 84, th.fam); ctx.fillStyle = e === "!" ? "#D84315" : th.accent; ctx.textAlign = "center"; ctx.fillText(e, 0, 28); ctx.textAlign = "left"; }
    ctx.restore();
  }
  function room(ctx, th, kind, t){
    const X0 = 60, Y0 = 560, Wd = 960, Hd = 790, floorY = 1180;
    rr(ctx, X0, Y0, Wd, Hd, 44); ctx.save(); ctx.clip();
    const wall = kind === "night" ? ["#3A2C22", "#4A3628"] : kind === "warehouse" ? ["#EFE3D3", "#E6D6C2"] : ["#FFF3E4", "#FBE6D0"];
    let g = ctx.createLinearGradient(0, Y0, 0, floorY); g.addColorStop(0, wall[0]); g.addColorStop(1, wall[1]); ctx.fillStyle = g; ctx.fillRect(X0, Y0, Wd, floorY - Y0);
    ctx.fillStyle = kind === "night" ? "#5A4232" : kind === "warehouse" ? "#D9CFC2" : "#E9C9A8"; ctx.fillRect(X0, floorY, Wd, Y0 + Hd - floorY);
    ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fillRect(X0, floorY, Wd, 8);
    if (kind === "warehouse"){ ctx.fillStyle = "#E8B23A"; ctx.fillRect(X0, floorY + 70, Wd, 10); ctx.strokeStyle = "rgba(59,36,24,.12)"; ctx.lineWidth = 6; for (let y = Y0 + 60; y < floorY - 40; y += 120){ ctx.beginPath(); ctx.moveTo(X0 + 40, y); ctx.lineTo(X0 + Wd - 40, y); ctx.stroke(); } }
    else { ctx.strokeStyle = "rgba(59,36,24,.08)"; ctx.lineWidth = 3; for (let x = X0; x < X0 + Wd; x += 120){ ctx.beginPath(); ctx.moveTo(x, floorY + 8); ctx.lineTo(x - 60, Y0 + Hd); ctx.stroke(); } }
    if (kind === "night"){ const lg = ctx.createRadialGradient(300, 700, 0, 300, 700, 420); lg.addColorStop(0, "rgba(244,168,92,.35)"); lg.addColorStop(1, "rgba(244,168,92,0)"); ctx.fillStyle = lg; ctx.fillRect(X0, Y0, Wd, Hd); }
    ctx.restore();
  }
  function prop(ctx, th, p, s, t){
    const M = mv(); const T = c => cueT(s, c, .5);
    if (p.type === "desk"){ const x = p.x, w = p.w || 300, y = 1110; ctx.fillStyle = "#B5643C"; rr(ctx, x - w / 2, y, w, 26, 8); ctx.fill(); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(x - w / 2 + 20, y + 26, 18, 140); ctx.fillRect(x + w / 2 - 38, y + 26, 18, 140);
      if (p.laptop){ ctx.save(); ctx.translate(x + (p.lx || 0), y); const gl = ctx.createRadialGradient(0, -150, 0, 0, -150, 160); gl.addColorStop(0, "rgba(207,231,238,.35)"); gl.addColorStop(1, "rgba(207,231,238,0)"); ctx.fillStyle = gl; ctx.fillRect(-160, -310, 320, 310);
        rr(ctx, -95, -110, 190, 110, 12); ctx.fillStyle = "#544E42"; ctx.fill(); ctx.beginPath(); ctx.arc(0, -55, 14, 0, TAU); ctx.fillStyle = hexA(th.accent, .8); ctx.fill(); rr(ctx, -105, -6, 210, 10, 5); ctx.fillStyle = "#3B2418"; ctx.fill(); ctx.restore(); }
      if (p.mug){ rr(ctx, x - w / 2 + 40, y - 46, 34, 46, 8); ctx.fillStyle = th.accent; ctx.fill(); } }
    else if (p.type === "chair"){ const x = p.x; ctx.fillStyle = "#5A3A2A"; rr(ctx, x - 70, 1000, 140, 140, 24); ctx.fill(); ctx.fillStyle = "#3B2418"; ctx.fillRect(x - 8, 1140, 16, 90); rr(ctx, x - 60, 1222, 120, 14, 7); ctx.fill(); }
    else if (p.type === "window"){ const x = p.x, y = p.y || 640, w = p.w || 220, h = p.h || 200; rr(ctx, x, y, w, h, 14); ctx.fillStyle = p.night ? "#2A1A12" : "#CFE7EE"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
      if (p.night){ ctx.beginPath(); ctx.arc(x + w * .7, y + h * .3, 22, 0, TAU); ctx.fillStyle = "#F4A85C"; ctx.fill(); } else { ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.beginPath(); ctx.ellipse(x + w * .3 + Math.sin(t * .3) * 20, y + h * .3, 30, 12, 0, 0, TAU); ctx.fill(); } }
    else if (p.type === "plant"){ const x = p.x; rr(ctx, x - 40, 1100, 80, 80, 14); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "#3E7D4F";
      for (let k = 0; k < 5; k++){ ctx.save(); ctx.translate(x, 1100); ctx.rotate(-1 + k * .5 + Math.sin(t * 1.2 + k) * .05); ctx.beginPath(); ctx.ellipse(0, -60, 18, 60, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
    else if (p.type === "clock"){ const x = p.x, y = p.y || 680; ctx.beginPath(); ctx.arc(x, y, 54, 0, TAU); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
      const sp = p.fast ? 2.4 : .25, m = t * sp, hh = t * sp / 12; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(m) * 40, y - Math.cos(m) * 40); ctx.stroke(); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(hh + 2) * 26, y - Math.cos(hh + 2) * 26); ctx.stroke(); }
    else if (p.type === "split"){ ctx.save(); rr(ctx, 60, 560, 960, 790, 44); ctx.clip(); ctx.fillStyle = "rgba(24,21,15,.82)"; ctx.beginPath(); ctx.moveTo(600, 560); ctx.lineTo(1020, 560); ctx.lineTo(1020, 1350); ctx.lineTo(520, 1350); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.moveTo(600, 560); ctx.lineTo(520, 1350); ctx.stroke(); ctx.restore();
      if (p.label){ font(ctx, 700, 30, th.fam); const w = ctx.measureText(p.label).width + 40; rr(ctx, 960 - w, 590, w, 52, 26); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(p.label, 980 - w, 626); } }
    else if (p.type === "machine"){ const x0 = p.x || 470, x1 = x0 + (p.w || 520), y = 1060, jamA = p.jam ? T(p.jam) : 1e9, fixA = p.fix ? T(p.fix) : 1e9, jam = t >= jamA && t < fixA;
      ctx.fillStyle = "#544E42"; rr(ctx, x0, y, x1 - x0, 46, 23); ctx.fill(); ctx.fillStyle = "#3B2418"; ctx.fillRect(x0 + 30, y + 46, 20, 130); ctx.fillRect(x1 - 50, y + 46, 20, 130);
      ctx.strokeStyle = "#8C8476"; ctx.lineWidth = 4; const off = jam ? 0 : (t * 120) % 40; for (let x = x0 + 10 + off; x < x1 - 10; x += 40){ ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 38); ctx.stroke(); }
      const run = jam ? jamA : t, bx = (k) => x0 + 40 + ((run * 110 + k * 170) % (x1 - x0 - 60));
      for (let k = 0; k < 3; k++){ const x = jam ? x0 + 60 + k * 70 : bx(k); rr(ctx, x - 40, y - 70, 80, 70, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 40, y - 50); ctx.lineTo(x + 40, y - 50); ctx.stroke(); }
      const px = x1 - 150, sh = jam ? Math.sin(t * 40) * 4 : 0; rr(ctx, px - 70 + sh, y - 210, 140, 150, 18); ctx.fillStyle = "#FFF7EE"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      rr(ctx, px - 50 + sh, y - 180, 100, 22, 6); ctx.fillStyle = INK; ctx.fill(); font(ctx, 700, 24, th.fam); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(p.label || "PRINTER", px + sh, y - 110); ctx.textAlign = "left";
      ctx.beginPath(); ctx.arc(px + 44 + sh, y - 86, 11, 0, TAU); ctx.fillStyle = jam ? (Math.sin(t * 12) > 0 ? "#D84315" : "#7A2A10") : "#3BB273"; ctx.fill();
      if (jam){ for (let k = 0; k < 4; k++){ const q = ((t - jamA) * .6 + k / 4) % 1; ctx.globalAlpha = .5 * (1 - q); ctx.beginPath(); ctx.arc(px - 20 + k * 12, y - 220 - q * 120, 18 + q * 30, 0, TAU); ctx.fillStyle = "#B8AE9D"; ctx.fill(); } ctx.globalAlpha = 1; } }
    else if (p.type === "boxes"){ const x = p.x; [[0, 0], [90, 0], [45, -76]].forEach(([dx, dy]) => { rr(ctx, x + dx - 42, 1104 + dy, 84, 76, 8); ctx.fillStyle = "#D9A066"; ctx.fill(); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 3; ctx.stroke(); }); }
  }
  R.stage = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t);
    if (!popS(t, .05)) return;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    room(ctx, th, f.room || "office", t);
    rr(ctx, 60, 560, 960, 790, 44); ctx.save(); ctx.clip();
    (f.props || []).filter(p => p.back !== false && p.type !== "desk" && p.type !== "split").forEach(p => prop(ctx, th, p, s, t));
    (f.props || []).filter(p => p.type === "split").forEach(p => prop(ctx, th, p, s, t));
    const actors = (f.actors || []).map(a => ({ a, st: actorState(a, s, t) }));
    actors.filter(x => x.st.sit).forEach(({ a, st }) => prop(ctx, th, { type: "chair", x: st.x }, s, t));
    const heads = [];
    actors.forEach(({ a, st }) => { const r = drawActor(ctx, th, a, st, t, 1262, a.scale || 1.26); heads.push([a, st, r]); });
    (f.props || []).filter(p => p.type === "desk").forEach(p => prop(ctx, th, p, s, t));
    ctx.restore();
    heads.forEach(([a, st, r]) => { if (!r) return;
      if (st.emote) emoteAt(ctx, th, st.emote, r.headX + (a.emoteDx || 0), r.headTop - 30, t - st.emoteT, t);
      if (st.say) bubbleAt(ctx, th, st.say, r.headX + (a.bubbleDx || 0), r.headTop - (st.emote ? 90 : 10), st.chat, t - st.sayT); });
    ctx.restore();
  };

  /* ---------- fourth set: pie, pour, flip, portrait, glass, battery, bricks, daycycle, waveform, search ---------- */
  const SLICE = th => [th.accent, "#2F6F73", "#B87333", "#F4A85C", "#544E42"];
  R.pie = (ctx, th, s, t) => {
    const f = s.f, sl = f.slices || [], tot = sl.reduce((a, x) => a + x.value, 0) || 1; topHead(ctx, th, f, t);
    const cx = 540, cy = f.headline ? 960 : 910, R1 = 290, R0 = 160; if (!popS(t, .1)) return;
    ctx.save(); ctx.globalAlpha *= clamp((t - .1) * 3, 0, 1);
    ctx.beginPath(); ctx.arc(cx, cy, R1, 0, TAU); ctx.arc(cx, cy, R0, 0, TAU, true); ctx.fillStyle = hexA(th.accent, .1); ctx.fill("evenodd");
    let a0 = -Math.PI / 2;
    sl.forEach((x, i) => { const span = x.value / tot * TAU, ts = cueT(s, x.cue, .15 + i * .25), p = easeIO(clamp((t - ts) / .7, 0, 1));
      if (p > 0){ const mid = a0 + span / 2, pop = eOut(clamp((t - ts - .6) / .4, 0, 1)) * 18, ox = Math.cos(mid) * pop, oy = Math.sin(mid) * pop;
        ctx.beginPath(); ctx.arc(cx + ox, cy + oy, R1, a0, a0 + span * p); ctx.arc(cx + ox, cy + oy, R0, a0 + span * p, a0, true); ctx.closePath(); ctx.fillStyle = x.color || SLICE(th)[i % 5]; ctx.fill(); ctx.strokeStyle = th.bg; ctx.lineWidth = 8; ctx.stroke();
        const q = eBack(clamp((t - ts - .6) / .45, 0, 1)); if (q > 0){ const lx = clamp(cx + Math.cos(mid) * (R1 + 40), 190, 890), ly = cy + Math.sin(mid) * (R1 + 40);
          ctx.save(); ctx.translate(lx, ly); ctx.scale(q, q); font(ctx, 800, 30, th.fam); const w = Math.max(ctx.measureText(x.label).width, 90) + 50; rr(ctx, -w / 2, -66, w, 112, 24); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = x.color || SLICE(th)[i % 5]; ctx.lineWidth = 5; ctx.stroke();
          label(ctx, th, x.big || `${x.value}%`, 0, -14, 52, x.color || SLICE(th)[i % 5]); label(ctx, th, x.label, 0, 28, 30, INK); ctx.restore(); } }
      a0 += span; });
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .4); ctx.setLineDash([12, 12]); ctx.strokeStyle = hexA(th.accent, .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, R0 - 24, 0, TAU); ctx.stroke(); ctx.restore();
    if (f.center) label(ctx, th, f.center, cx, cy + 18, 54, th.ink);
    ctx.restore();
  };

  function coin(ctx, x, y, r, c){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = c || "#E8A317"; ctx.fill(); ctx.strokeStyle = "#B87333"; ctx.lineWidth = r * .18; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .28, 0, TAU); ctx.fill(); }
  R.pour = (ctx, th, s, t) => {
    const f = s.f, M = mv(), cups = f.cups || [], n = cups.length; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const sy = (f.headline ? 660 : 620) + 40, step = n > 3 ? 220 : 290, cw = n > 3 ? 170 : 220, cb = 1270, ct = 1030;
    const tc = cups.map((c, i) => cueT(s, c.cue, .15 + i * .2)); let act = -1; tc.forEach((x, i) => { if (t >= x && t < x + 1.4) act = i; });
    const X = i => 540 + (i - (n - 1) / 2) * step;
    const tilt = act >= 0 ? clamp((X(act) - 540) / 600, -.5, .5) : Math.sin(t * 1.2) * .05;
    ctx.save(); ctx.translate(540, sy); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-90, -40); ctx.quadraticCurveTo(-130, 90, 0, 100); ctx.quadraticCurveTo(130, 90, 90, -40); ctx.closePath(); ctx.fillStyle = "#B87333"; ctx.fill();
    rr(ctx, -50, -66, 100, 34, 14); ctx.fillStyle = "#8E4E2E"; ctx.fill(); icon(ctx, "money", -34, -8, 68, "#FFF7EE", 2.2); ctx.restore();
    if (f.source) label(ctx, th, f.source, 540 + 170, sy + 10, 36, th.ink);
    cups.forEach((c, i) => { const x = X(i), ti = tc[i], lev = (c.pct || 0) * eOut(prog(t, ti + .35, 1.1)), sc = popS(t, .2 + i * .08); if (!sc) return;
      ctx.save(); rr(ctx, x - cw / 2, ct, cw, cb - ct, 22); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill(); ctx.clip();
      const ly = cb - (cb - ct) * lev; ctx.beginPath(); ctx.moveTo(x - cw / 2, cb); for (let k = 0; k <= 20; k++){ const xx = x - cw / 2 + cw * k / 20; ctx.lineTo(xx, ly + Math.sin(xx * .05 + t * 4) * (lev > 0 ? 6 : 0)); } ctx.lineTo(x + cw / 2, cb); ctx.closePath(); ctx.fillStyle = c.color || SLICE(th)[i % 5]; ctx.fill(); ctx.restore();
      rr(ctx, x - cw / 2, ct, cw, cb - ct, 22); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - cw / 2, ct); ctx.lineTo(x, ct + 60); ctx.lineTo(x + cw / 2, ct); ctx.strokeStyle = hexA(INK, .35); ctx.lineWidth = 4; ctx.stroke();
      label(ctx, th, c.label, x, cb + 50, n > 3 ? 30 : 36, th.ink);
      if (t > ti + 1.2 && c.tag){ const q = eBack(clamp((t - ti - 1.2) / .4, 0, 1)); ctx.save(); ctx.translate(x, ct - 40); ctx.scale(q, q); font(ctx, 800, 34, th.fam); const w = ctx.measureText(c.tag).width + 40; rr(ctx, -w / 2, -30, w, 60, 30); ctx.fillStyle = c.pct ? th.accent : "#D84315"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(c.tag, 0, 12); ctx.textAlign = "left"; ctx.restore(); } });
    if (act >= 0){ const x1 = X(act), y1 = ct + 30, u0 = t - tc[act]; for (let k = 0; k < 12; k++){ const u = ((u0 * 1.4 + k / 12) % 1); if (u0 * 1.4 < k / 12) continue; const a = 1 - u;
      const x = a * a * 540 + 2 * a * u * ((540 + x1) / 2) + u * u * x1, y = a * a * (sy + 90) + 2 * a * u * (sy + 20) + u * u * y1; coin(ctx, x, y, 16); } }
    if (f.chaos){ for (let k = 0; k < 10; k++){ const q = ((t * .5 + k / 10) % 1), a = -Math.PI / 2 + (k - 4.5) * .35; coin(ctx, 540 + Math.cos(a) * q * 600, sy + 60 + Math.sin(a) * q * 300 + q * q * 900, 14, k % 2 ? "#E8A317" : "#F4A85C"); } }
  };

  R.flip = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); const sc0 = popS(t, .1); if (!sc0) return;
    const tf = cueT(s, f.flipCue, .5), p = clamp((t - tf) / .6, 0, 1), ang = easeIO(p) * Math.PI, sx = Math.cos(ang), back = ang > Math.PI / 2;
    const cx = 540, cy = f.headline ? 960 : 920, w = 760, h = 620, side = back ? (f.back || {}) : (f.front || {});
    ctx.save(); ctx.translate(cx, cy + Math.sin(t * 1.5) * 8); ctx.rotate(Math.sin(t * 1.1) * .015); ctx.scale(sc0 * Math.max(.02, Math.abs(sx)) * (1 + .06 * Math.sin(Math.PI * p)), sc0);
    rr(ctx, -w / 2 + 14, -h / 2 + 20, w, h, 48); ctx.fillStyle = "rgba(59,36,24,.16)"; ctx.fill();
    rr(ctx, -w / 2, -h / 2, w, h, 48); ctx.fillStyle = back ? th.accent : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 48); ctx.clip(); ctx.fillStyle = back ? "rgba(255,255,255,.08)" : hexA(th.accent, .06); for (let k = -6; k < 6; k++){ ctx.save(); ctx.translate(k * 120 + (t * 20) % 120, 0); ctx.rotate(.5); ctx.fillRect(-20, -700, 40, 1400); ctx.restore(); } ctx.restore();
    if (side.icon){ ctx.beginPath(); ctx.arc(0, -h / 2 + 130, 74, 0, TAU); ctx.fillStyle = back ? "#FFFFFF" : th.accent; ctx.fill(); icon(ctx, side.icon, -44, -h / 2 + 86, 88, back ? th.accent : "#FFFFFF", 2.2); }
    const es = G.enterStart; G.enterStart = null;
    drawRich(ctx, { text: side.text || "", hl: side.hl, x: -w / 2 + 50, y: side.icon ? -40 : -120, maxW: w - 100, size: 84, weight: 800, fam: th.fam, color: back ? "#FFFFFF" : INK, accent: back ? "#FFF7EE" : th.accent, maxLines: 3, align: "center", minSize: 48 });
    G.enterStart = es; ctx.restore();
    burst(ctx, 540, cy, t - tf - .55, M, 12);
  };

  R.portrait = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const Y0 = f.headline ? 600 : 560, Y1 = 1330, a = Object.assign({ x: 540 }, f.person || {}), st = actorState(a, s, t); st.x = 540; st.walking = false;
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, Y0, 900, Y1 - Y0, 48); const g = ctx.createRadialGradient(540, Y0 + 260, 40, 540, Y0 + 260, 620); g.addColorStop(0, hexA(M.pal[2], .5)); g.addColorStop(1, hexA(M.pal[0], .22)); ctx.fillStyle = g; ctx.fill();
    ctx.save(); rr(ctx, 90, Y0, 900, Y1 - Y0, 48); ctx.clip();
    for (let k = 0; k < 3; k++){ const q = ((t * .25) + k / 3) % 1; ctx.strokeStyle = hexA("#FFFFFF", .5 * (1 - q)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, Y0 + 300, 220 + q * 360, 0, TAU); ctx.stroke(); }
    const sc = 2.5, head = Y0 + (Y1 - Y0) * .42, gy = head + 390 * sc, r = drawActor(ctx, th, a, st, t, gy, sc); ctx.restore();
    if (st.emote) emoteAt(ctx, th, st.emote, 540 + (a.emoteDx || 230), r.headTop + 150, t - st.emoteT, t);
    if (st.say) bubbleAt(ctx, th, st.say, 540 + (a.bubbleDx || -170), r.headTop + 100, st.chat, t - st.sayT);
    ctx.restore();
  };

  R.glass = (ctx, th, s, t) => {
    const f = s.f, M = mv(), marks = f.marks || [], n = marks.length || 1; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 690 : 640, H0 = 560, cx = 470, wt = 360, wb = 270, bot = top + H0;
    const tm = marks.map((m, i) => cueT(s, m.cue, .15 + i * .25)); let lev = f.start || 0; tm.forEach((x, i) => { lev += ((i + 1) / n * (f.full || .92) - (i ? i / n * (f.full || .92) : (f.start || 0))) * eOut(prog(t, x + .2, 1.1)); });
    const edge = y => { const u = (y - top) / H0; return wt / 2 + (wb / 2 - wt / 2) * u; };
    ctx.save(); ctx.globalAlpha *= clamp((t - .1) * 3, 0, 1);
    ctx.beginPath(); ctx.moveTo(cx - wt / 2, top); ctx.lineTo(cx - wb / 2, bot); ctx.lineTo(cx + wb / 2, bot); ctx.lineTo(cx + wt / 2, top); ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill();
    ctx.save(); ctx.clip(); const ly = bot - H0 * lev;
    ctx.beginPath(); ctx.moveTo(cx - wt, bot); for (let k = 0; k <= 30; k++){ const x = cx - wt / 2 + wt * k / 30; ctx.lineTo(x, ly + Math.sin(x * .04 + t * 3.5) * 9); } ctx.lineTo(cx + wt, bot); ctx.closePath();
    const wg = ctx.createLinearGradient(0, ly, 0, bot); wg.addColorStop(0, "#9FD3E0"); wg.addColorStop(1, "#5FA8C4"); ctx.fillStyle = wg; ctx.fill();
    for (let k = 0; k < 9; k++){ const q = ((t * .35 + k / 9) % 1), by = bot - q * (bot - ly), bx = cx - 90 + ((k * 53) % 180) + Math.sin(t * 3 + k) * 6; if (by > ly + 10){ ctx.beginPath(); ctx.arc(bx, by, 5 + (k % 3) * 2, 0, TAU); ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 3; ctx.stroke(); } }
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(cx - wt / 2, top); ctx.lineTo(cx - wb / 2, bot); ctx.lineTo(cx + wb / 2, bot); ctx.lineTo(cx + wt / 2, top); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = "round"; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - wt / 2 + 40, top + 40); ctx.lineTo(cx - wb / 2 + 34, top + 260); ctx.stroke();
    marks.forEach((m, i) => { if (t < tm[i]) return; const y = bot - H0 * ((i + 1) / n * (f.full || .92)), x = cx + edge(y) + 18, q = eBack(clamp((t - tm[i]) / .4, 0, 1));
      ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.strokeStyle = th.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(16, 0); ctx.stroke();
      font(ctx, 700, 34, th.fam); const w = ctx.measureText(m.label).width + 44; rr(ctx, 24, -28, w, 56, 28); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(m.label, 46, 11); ctx.restore(); });
    let act = -1; tm.forEach((x, i) => { if (t >= x && t < x + 1.3) act = i; });
    if (act >= 0){ const u = clamp((t - tm[act]) / .3, 0, 1), bx = cx + 150, byy = top - 120; ctx.save(); ctx.translate(bx, byy); ctx.rotate(-2.2 * u); rr(ctx, -40, -110, 80, 160, 22); ctx.fillStyle = "rgba(159,211,224,.85)"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke(); rr(ctx, -22, -140, 44, 34, 8); ctx.fillStyle = th.accent; ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#7CC4E8"; ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(bx - 60, byy - 70); ctx.quadraticCurveTo(cx + 20, byy - 40, cx + 10, ly0(top, H0, lev)); ctx.stroke(); }
    ctx.restore();
    function ly0(tp, h, l){ return tp + h * (1 - l); }
  };

  R.battery = (ctx, th, s, t) => {
    const f = s.f, M = mv(), lv = f.levels || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    let v = f.start ?? 1, charging = false, lab = f.label || ""; lv.forEach((l, i) => { const ti = cueT(s, l.cue, .2 + i * .3), q = easeIO(clamp((t - ti) / .9, 0, 1)); if (q > 0){ if (l.value > v && q < 1) charging = true; v = v + (l.value - v) * q; if (t >= ti) lab = l.label || lab; } });
    const x0 = 150, y0 = f.headline ? 820 : 780, w = 720, h = 300, col = v > .6 ? th.accent : v > .3 ? "#B87333" : "#D84315";
    ctx.save(); ctx.translate(Math.sin(t * 30) * (v < .25 ? 3 : 0), 0);
    rr(ctx, x0, y0, w, h, 44); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 12; ctx.stroke(); rr(ctx, x0 + w + 6, y0 + 95, 40, 110, 14); ctx.fillStyle = INK; ctx.fill();
    ctx.save(); rr(ctx, x0 + 22, y0 + 22, (w - 44) * clamp(v, .02, 1), h - 44, 28); ctx.fillStyle = col; ctx.fill(); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,.18)"; for (let k = -2; k < 10; k++){ ctx.save(); ctx.translate(x0 + k * 90 + (t * 60) % 90, y0); ctx.rotate(.4); ctx.fillRect(0, -40, 30, 400); ctx.restore(); } ctx.restore();
    for (let k = 1; k < 5; k++){ ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 + w * k / 5, y0 + 30); ctx.lineTo(x0 + w * k / 5, y0 + h - 30); ctx.stroke(); }
    label(ctx, th, `${Math.round(clamp(v, 0, 1) * 100)}%`, x0 + w / 2, y0 + h / 2 + 34, 104, v > .2 ? "#FFFFFF" : INK);
    if (charging){ const pu = .8 + Math.sin(t * 10) * .2; ctx.save(); ctx.translate(x0 + w / 2, y0 - 70); ctx.scale(pu, pu); ctx.beginPath(); ctx.moveTo(10, -50); ctx.lineTo(-28, 8); ctx.lineTo(0, 8); ctx.lineTo(-10, 50); ctx.lineTo(28, -8); ctx.lineTo(0, -8); ctx.closePath(); ctx.fillStyle = "#E8A317"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
    ctx.restore();
    if (lab){ font(ctx, 800, 40, th.fam); const lw = ctx.measureText(lab).width + 110; rr(ctx, 540 - lw / 2, y0 + h + 50, lw, 76, 38); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .2); ctx.lineWidth = 3; ctx.stroke(); icon(ctx, f.icon || "clock", 540 - lw / 2 + 22, y0 + h + 66, 44, th.accent, 2.4); ctx.fillStyle = INK; ctx.fillText(lab, 540 - lw / 2 + 80, y0 + h + 102); }
  };

  R.bricks = (ctx, th, s, t) => {
    const f = s.f, M = mv(), bs = f.bricks || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const BW = 250, BH = 96, base = 1262, x0 = 540 - BW * 1.5;
    rr(ctx, x0 - 40, base, BW * 3 + 80, 26, 12); ctx.fillStyle = INK; ctx.fill();
    let allIn = true;
    bs.forEach((b, k) => { const row = Math.floor(k / 3), col = k % 3, ti = f.prebuilt ? .1 + k * .06 : cueT(s, b.cue, .1 + k * .08); if (t < ti){ allIn = false; return; }
      const x = x0 + col * BW + (row % 2 ? 36 : -12), yL = base - (row + 1) * (BH + 6), p = clamp((t - ti) / .6, 0, 1);
      let y = yL - 360 * (1 - Math.min(1, p / .7)) ** 2; if (p > .7){ const q = (p - .7) / .3; y = yL - Math.sin(Math.PI * q) * 20 * (1 - q); }
      let rot = 0, dx = 0, alpha = 1; const tb = b.broken ? cueT(s, b.broken, .7) : null;
      if (tb != null && t > tb + .5){ const q = t - tb - .5; y += 900 * q * q; rot = q * 2.2; dx = q * 160; alpha = clamp(1 - q, 0, 1); }
      ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x + BW / 2 + dx, y + BH / 2); ctx.rotate(rot);
      rr(ctx, -BW / 2 + 4, -BH / 2, BW - 8, BH, 12); ctx.fillStyle = b.color || [th.accent, "#B87333", "#D97F2C"][(row + col) % 3]; ctx.fill(); ctx.strokeStyle = hexA(INK, .35); ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.18)"; rr(ctx, -BW / 2 + 14, -BH / 2 + 10, BW - 28, 14, 7); ctx.fill();
      if (b.label){ font(ctx, 700, b.label.length > 14 ? 26 : 30, th.fam); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(b.label, 0, 11); ctx.textAlign = "left"; }
      if (tb != null && t > tb){ const q = clamp((t - tb) / .5, 0, 1); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-40, -BH / 2); for (let z = 1; z <= 5 * q; z++) ctx.lineTo(-40 + (z % 2 ? 22 : -10) + z * 12, -BH / 2 + BH * z / 5); ctx.stroke(); }
      ctx.restore(); if (!b.broken) burst(ctx, x + BW / 2, yL + BH, t - ti - .45, M, 5); });
    if (f.title && allIn){ const rows = Math.ceil(bs.length / 3), ty = base - rows * (BH + 6) - 70, q = eBack(clamp((t - (f.prebuilt ? .1 + bs.length * .06 : cueT(s, bs[bs.length - 1].cue, 1)) - .6) / .5, 0, 1));
      if (q > 0){ ctx.save(); ctx.translate(540, ty); ctx.scale(q, q); font(ctx, 800, 44, th.fam); const w = ctx.measureText(f.title).width + 120; rr(ctx, -w / 2, -40, w, 80, 40); ctx.fillStyle = INK; ctx.fill(); icon(ctx, "shield", -w / 2 + 26, -24, 48, "#F4A85C", 2.4); ctx.fillStyle = "#FFF7EE"; ctx.fillText(f.title, -w / 2 + 88, 15); ctx.restore(); } }
  };

  R.daycycle = (ctx, th, s, t) => {
    const f = s.f, M = mv(), tasks = f.tasks || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const top = f.headline ? 600 : 570, L = 150, Rr = 930, band = top + 520, dur = sceneDur(), p = clamp(t / Math.max(1, dur - .5), 0, 1);
    ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, top, 900, 760, 44); const g = ctx.createLinearGradient(0, top, 0, band); g.addColorStop(0, p < .7 ? "#FFE9CC" : "#F6C79A"); g.addColorStop(1, "#FFF7EE"); ctx.fillStyle = g; ctx.fill();
    ctx.save(); rr(ctx, 90, top, 900, 760, 44); ctx.clip();
    const sa = Math.PI + Math.PI * p, sx = 540 + Math.cos(sa) * 380, sy = band - 40 + Math.sin(sa) * 380;
    ctx.setLineDash([10, 12]); ctx.strokeStyle = hexA(th.accent, .35); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(540, band - 40, 380, Math.PI, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * .8); ctx.fillStyle = "#F4A85C"; for (let k = 0; k < 10; k++){ ctx.rotate(TAU / 10); ctx.fillRect(-4, -78, 8, 22); } ctx.restore();
    ctx.beginPath(); ctx.arc(sx, sy, 46, 0, TAU); ctx.fillStyle = "#E8A317"; ctx.fill();
    const en = f.energy || [], ep = clamp((t - .3) / 1.5, 0, 1);
    if (en.length > 1){ const pts = en.map((v, i) => [L + (Rr - L) * i / (en.length - 1), band - 40 - v * 220]), m = Math.max(1, Math.floor(ep * (pts.length - 1) * 10));
      ctx.beginPath(); ctx.moveTo(pts[0][0], band - 40); for (let k = 0; k <= m; k++){ const u = k / 10, i = Math.min(pts.length - 2, Math.floor(u)), r = u - i; const a = pts[i], b = pts[i + 1]; ctx.lineTo(a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r); }
      const last = [L + (Rr - L) * Math.min(1, m / 10 / (pts.length - 1)), 0]; ctx.lineTo(last[0], band - 40); ctx.closePath(); ctx.fillStyle = hexA(th.accent, .18); ctx.fill();
      ctx.beginPath(); for (let k = 0; k <= m; k++){ const u = k / 10, i = Math.min(pts.length - 2, Math.floor(u)), r = u - i; const a = pts[i], b = pts[i + 1]; const xy = [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]; k ? ctx.lineTo(...xy) : ctx.moveTo(...xy); } ctx.strokeStyle = th.accent; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.stroke();
      font(ctx, 700, 28, th.fam); ctx.fillStyle = th.accent; ctx.fillText(f.energyLabel || "Energi", L, top + 60); }
    ctx.fillStyle = INK; ctx.fillRect(L - 20, band, Rr - L + 40, 6);
    const hs = f.hours || ["07", "09", "11", "13", "15", "17"]; hs.forEach((h, i) => { const x = L + (Rr - L) * i / (hs.length - 1); ctx.fillRect(x - 2, band, 4, 16); font(ctx, 600, 26, th.fam); ctx.fillStyle = th.muted; ctx.textAlign = "center"; ctx.fillText(h + ".00", x, band + 46); ctx.textAlign = "left"; ctx.fillStyle = INK; });
    const nx = L + (Rr - L) * p; ctx.setLineDash([8, 8]); ctx.strokeStyle = hexA(INK, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(nx, band - 300); ctx.lineTo(nx, band); ctx.stroke(); ctx.setLineDash([]);
    tasks.forEach((tk, i) => { const ti = cueT(s, tk.cue, .2 + i * .2); if (t < ti) return; const w = Math.max(130, (tk.w || .15) * (Rr - L) * (tk.heavy ? 1.3 : 1)), h = tk.heavy ? 150 : 84, x = clamp(L + (Rr - L) * tk.at - w / 2, 100, 980 - w), yL = band + 70;
      const q = clamp((t - ti) / .55, 0, 1); let y = yL - 300 * (1 - Math.min(1, q / .7)) ** 2; if (q > .7) y = yL - Math.sin(Math.PI * (q - .7) / .3) * 16;
      rr(ctx, x, y, w, h, 18); ctx.fillStyle = tk.heavy ? "#D84315" : hexA(th.accent, .55); ctx.fill(); if (tk.icon) icon(ctx, tk.icon, x + 16, y + h / 2 - 20, 40, "#fff", 2.4);
      font(ctx, 700, tk.heavy ? 32 : 28, th.fam); ctx.fillStyle = "#fff"; ctx.fillText(tk.label, x + (tk.icon ? 66 : 16), y + h / 2 + 11); });
    ctx.restore(); ctx.restore();
  };

  R.waveform = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const y = f.headline ? 800 : 760, x0 = 110, w = 860, h = 250, tot = (() => { const m = /(\d+):(\d+)/.exec(f.duration || "3:47"); return m ? +m[1] * 60 + +m[2] : 227; })();
    const el = Math.min(tot, (t - .4) * (f.speed || 1)), pr = clamp(el / tot, 0, 1), playing = t > .4;
    if (f.group){ font(ctx, 700, 32, th.fam); ctx.fillStyle = th.muted; ctx.fillText(f.group, x0 + 10, y - 30); }
    ctx.save(); ctx.translate(0, Math.sin(t * 1.4) * 5); ctx.beginPath(); ctx.roundRect(x0, y, w, h, 50); ctx.moveTo(x0 + w - 30, y + h - 40); ctx.lineTo(x0 + w + 20, y + h + 10); ctx.lineTo(x0 + w - 80, y + h - 4);
    ctx.fillStyle = "#FCE1C6"; ctx.fill(); ctx.strokeStyle = hexA(INK, .2); ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(x0 + 90, y + h / 2, 56, 0, TAU); ctx.fillStyle = th.accent; ctx.fill();
    if (playing){ ctx.fillStyle = "#fff"; ctx.fillRect(x0 + 72, y + h / 2 - 22, 12, 44); ctx.fillRect(x0 + 96, y + h / 2 - 22, 12, 44); } else { ctx.beginPath(); ctx.moveTo(x0 + 78, y + h / 2 - 26); ctx.lineTo(x0 + 112, y + h / 2); ctx.lineTo(x0 + 78, y + h / 2 + 26); ctx.fillStyle = "#fff"; ctx.fill(); }
    const bx0 = x0 + 180, bx1 = x0 + w - 50, nb = 44, bw = (bx1 - bx0) / nb;
    for (let k = 0; k < nb; k++){ const base = .25 + .75 * Math.abs(Math.sin(k * 1.7 + 1.3) * Math.cos(k * .53)), live = playing && Math.abs(k / nb - pr) < .06 ? .6 + .4 * Math.abs(Math.sin(t * 14 + k)) : 1, hh = 20 + 110 * base * live;
      rr(ctx, bx0 + k * bw + 2, y + h / 2 - hh / 2 - 14, bw - 6, hh, 4); ctx.fillStyle = k / nb <= pr ? th.accent : hexA(INK, .25); ctx.fill(); }
    ctx.beginPath(); ctx.arc(bx0 + (bx1 - bx0) * pr, y + h / 2 - 14, 14, 0, TAU); ctx.fillStyle = INK; ctx.fill();
    const mmss = v => `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, "0")}`; font(ctx, 700, 32, th.fam); ctx.fillStyle = INK; ctx.fillText(`${mmss(Math.max(0, el))} / ${mmss(tot)}`, bx0, y + h - 30);
    icon(ctx, "phone", x0 + w - 110, y + h - 70, 40, hexA(INK, .5), 2.2);
    ctx.restore();
    if (f.note && t > cueT(s, f.noteCue, .5)){ const q = eBack(clamp((t - cueT(s, f.noteCue, .5)) / .4, 0, 1)); ctx.save(); ctx.translate(540, y + h + 140); ctx.scale(q, q); font(ctx, 800, 40, th.fam); const lw = ctx.measureText(f.note).width + 70;
      rr(ctx, -lw / 2, -44, lw, 88, 44); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(f.note, 0, 14); ctx.textAlign = "left"; ctx.restore(); }
  };

  R.search = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 680 : 620, tt = cueT(s, f.typeCue, .15), tr = cueT(s, f.resultCue, .6), q = f.query || "", nc = clamp(Math.floor((t - tt) * 11), 0, q.length);
    ctx.save(); ctx.globalAlpha *= clamp((t - .1) * 3, 0, 1);
    rr(ctx, 110, top, 860, 112, 56); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = th.accent; ctx.lineWidth = 6; ctx.stroke();
    ctx.save(); ctx.translate(180, top + 56); if (t > tt && t < tr) ctx.rotate(Math.sin(t * 8) * .3); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-6, -6, 20, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(9, 9); ctx.lineTo(24, 24); ctx.stroke(); ctx.restore();
    font(ctx, 600, 44, th.fam); ctx.fillStyle = INK; const typed = q.slice(0, nc); ctx.fillText(typed, 236, top + 72); if (Math.sin(t * 8) > 0 && t < tr + .5){ const cw = ctx.measureText(typed).width; ctx.fillRect(240 + cw, top + 32, 4, 50); }
    if (t > tr){ const rs = f.results || [];
      if (!rs.length || f.empty){ const k = eBack(clamp((t - tr) / .4, 0, 1)); ctx.save(); ctx.translate(540, top + 300); ctx.scale(k, k); label(ctx, th, f.emptyLabel || "0 hasil", 0, 0, 72, "#D84315"); ctx.restore(); }
      rs.forEach((r, i) => { const k = eOut(clamp((t - tr - i * .15) / .5, 0, 1)); if (k <= 0) return; const y = top + (f.empty ? 400 : 160) + i * 170 + (1 - k) * 80;
        ctx.save(); ctx.globalAlpha *= k * (r.voice ? .6 : 1); rr(ctx, 110, y, 860, 140, 30); ctx.fillStyle = r.voice ? "#EFE6DA" : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = r.hit ? th.accent : hexA(INK, .15); ctx.lineWidth = r.hit ? 5 : 3; ctx.stroke();
        disc(ctx, r.voice ? "phone" : "chat", 180, y + 70, 40, r.voice ? "#B8AE9D" : th.accent, "#fff");
        if (r.voice){ for (let b = 0; b < 18; b++){ const hh = 16 + 40 * Math.abs(Math.sin(b * 1.3)); rr(ctx, 250 + b * 22, y + 50 - hh / 2 + 20, 12, hh, 4); ctx.fillStyle = "#B8AE9D"; ctx.fill(); } font(ctx, 600, 28, th.fam); ctx.fillStyle = "#8C8476"; ctx.fillText(r.text || "", 660, y + 82); }
        else { font(ctx, 600, 38, th.fam); const txt = r.text || "", lo = txt.toLowerCase(), qi = q ? lo.indexOf(q.toLowerCase()) : -1;
          if (qi >= 0 && r.hit){ const pre = ctx.measureText(txt.slice(0, qi)).width, mw = ctx.measureText(txt.slice(qi, qi + q.length)).width, mk = eOut(clamp((t - tr - .5) / .5, 0, 1)); rr(ctx, 246 + pre, y + 40, mw * mk + 8, 56, 10); ctx.fillStyle = hexA(th.accent, .3); ctx.fill(); }
          ctx.fillStyle = INK; ctx.fillText(txt, 250, y + 82); }
        ctx.restore(); });
      if (f.count){ font(ctx, 700, 30, th.fam); ctx.fillStyle = th.muted; ctx.fillText(f.count, 130, top + 150); } }
    ctx.restore();
  };

  /* ---------- fifth set: lock, inbox, domino, slider, map, comic, funnel, timer, kanban, calendar, dart, puzzle, tree, bucket ---------- */
  const at0 = (s, c, fr, k) => cueT(s, c, fr, k);
  function panel(ctx, th, y0, y1, tint){ rr(ctx, 90, y0, 900, y1 - y0, 44); ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.05)" : (tint || "rgba(255,255,255,.55)"); ctx.fill(); ctx.strokeStyle = th.key === "B" ? "rgba(250,248,243,.1)" : hexA(INK, .08); ctx.lineWidth = 3; ctx.stroke(); }
  function pill(ctx, th, txt, x, y, bg, fg, size){ font(ctx, 800, size || 32, th.fam); const w = ctx.measureText(txt).width + 44; rr(ctx, x - w / 2, y - (size || 32) * .95, w, (size || 32) * 1.75, (size || 32) * .9); ctx.fillStyle = bg; ctx.fill(); ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.fillText(txt, x, y + (size || 32) * .32); ctx.textAlign = "left"; return w; }

  R.lock = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    let state = f.start || "lock", stT = -9; keyTimes(s, f.keys).forEach(k => { if (t >= k.T){ state = k.action; stT = k.T; } });
    const cx = 540, cy = f.headline ? 1010 : 970, dt = t - stT, open = state === "unlock" || state === "break" ? eOut(clamp(dt / .6, 0, 1)) : (state === "lock" && stT > 0 ? 1 - eOut(clamp(dt / .5, 0, 1)) : 0);
    const shake = state === "break" && dt < .8 ? Math.sin(dt * 50) * 10 * (1 - dt / .8) : 0, danger = state === "break", safe = state === "shield";
    const glow = ctx.createRadialGradient(cx, cy, 40, cx, cy, 460); glow.addColorStop(0, hexA(danger ? "#D84315" : th.accent, .25 + .1 * Math.sin(t * 3))); glow.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = glow; ctx.fillRect(90, cy - 460, 900, 920);
    ctx.save(); ctx.translate(cx + shake, cy + Math.sin(t * 1.4) * 6);
    ctx.save(); ctx.translate(90, -150); ctx.rotate(-open * .5 - (danger ? open * .4 : 0)); ctx.translate(-90, -open * 70);
    ctx.strokeStyle = danger ? "#8C8476" : INK; ctx.lineWidth = 46; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-90, -90); ctx.arc(0, -90, 90, Math.PI, 0); ctx.lineTo(90, 0); ctx.stroke(); ctx.restore();
    if (danger && dt > .3){ ctx.strokeStyle = "#D84315"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(60, -210); ctx.lineTo(80, -180); ctx.lineTo(62, -165); ctx.lineTo(84, -140); ctx.stroke(); }
    rr(ctx, -190, -150, 380, 320, 46); ctx.fillStyle = danger ? (Math.sin(t * 10) > 0 ? "#D84315" : "#A0522D") : safe ? "#3BB273" : th.accent; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.15)"; rr(ctx, -160, -126, 320, 40, 20); ctx.fill();
    if (safe){ ctx.strokeStyle = "#fff"; ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-60, 10); ctx.lineTo(-15, 55); ctx.lineTo(70, -40); ctx.stroke(); }
    else { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, -10, 34, 0, TAU); ctx.fill(); rr(ctx, -14, 10, 28, 70, 10); ctx.fill(); }
    ctx.restore();
    if (f.label) pill(ctx, th, (state === "break" && f.breakLabel) || (safe && f.safeLabel) || f.label, cx, cy + 260, danger ? "#D84315" : safe ? "#3BB273" : INK, "#FFF7EE", 36);
    if (danger) burst(ctx, cx, cy - 120, dt - .1, M, 12); if (safe) burst(ctx, cx, cy, dt - .2, M, 12);
  };

  R.inbox = (ctx, th, s, t) => {
    const f = s.f, M = mv(), items = f.items || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 650 : 600, x0 = 120, w = 840;
    ctx.save(); rr(ctx, 100, top, 880, 700, 44); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .12); ctx.lineWidth = 3; ctx.stroke(); ctx.clip();
    ctx.fillStyle = th.key === "B" ? "#2A2119" : "#FBF3E9"; ctx.fillRect(100, top, 880, 96); icon(ctx, f.appIcon || "chat", 140, top + 26, 44, th.accent, 2.4);
    font(ctx, 800, 36, th.fam); ctx.fillStyle = th.key === "B" ? "#FAF8F3" : INK; ctx.fillText(f.app || "Chat", 200, top + 62);
    const tms = items.map((it, i) => at0(s, it.cue, .1 + i * .15)); const shown = items.map((it, i) => t >= tms[i]);
    let y = top + 116;
    items.forEach((it, i) => { if (!shown[i]) return; const k = eOut(clamp((t - tms[i]) / .45, 0, 1)), h = it.file ? 168 : 120, yy = y + (1 - k) * -60;
      ctx.save(); ctx.globalAlpha *= k; rr(ctx, x0, yy, w, h - 14, 22); const dang = it.danger, hl = it.highlight && t > at0(s, f.hlCue, .6);
      ctx.fillStyle = dang ? "rgba(216,67,21,.07)" : hl ? hexA(th.accent, .14) : "#FBF7F1"; ctx.fill();
      if (dang || hl){ ctx.strokeStyle = dang ? `rgba(216,67,21,${.5 + .4 * Math.sin(t * 6)})` : th.accent; ctx.lineWidth = 5; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x0 + 54, yy + 52, 32, 0, TAU); ctx.fillStyle = dang ? "#D84315" : M.pal[i % 3]; ctx.fill(); icon(ctx, it.icon || "users", x0 + 36, yy + 34, 36, "#fff", 2.4);
      font(ctx, 800, 30, th.fam); ctx.fillStyle = INK; ctx.fillText(it.from || "", x0 + 104, yy + 42); font(ctx, 500, 30, th.fam); ctx.fillStyle = "#544E42"; ctx.fillText(it.text || "", x0 + 104, yy + 84);
      if (it.amount){ font(ctx, 800, 32, th.fam); const aw = ctx.measureText(it.amount).width; ctx.fillStyle = hl ? "#D84315" : INK; ctx.fillText(it.amount, x0 + w - 30 - aw, yy + 62); }
      if (it.file){ rr(ctx, x0 + 104, yy + 100, 330, 50, 14); ctx.fillStyle = dang ? "#D84315" : th.accent; ctx.fill(); icon(ctx, "file", x0 + 116, yy + 108, 34, "#fff", 2.4); font(ctx, 700, 28, th.fam); ctx.fillStyle = "#fff"; ctx.fillText(it.file, x0 + 160, yy + 135); }
      ctx.restore(); y += h; });
    ctx.restore();
    const target = items.findIndex(it => it.danger);
    if (f.tapCue && target >= 0){ const tt = at0(s, f.tapCue, .7); if (t > tt){ let yy = top + 116; for (let i = 0; i < target; i++) yy += items[i].file ? 168 : 120;
      const q = easeIO(clamp((t - tt) / .9, 0, 1)), fx = 900 - 280 * q, fy = 1360 - (1360 - (yy + 130)) * q; ctx.save(); ctx.translate(fx, fy); ctx.rotate(-.4);
      ctx.fillStyle = "#D99A6E"; rr(ctx, -22, -10, 44, 140, 22); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -10, 24, 30, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(59,36,24,.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, -22, 12, 10, 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
    if (f.stopCue){ const ts = at0(s, f.stopCue, .85); if (t > ts){ const q = eBack(clamp((t - ts) / .45, 0, 1)); ctx.save(); ctx.translate(540, top + 400); ctx.scale(q, q); ctx.rotate(-.08);
      ctx.beginPath(); for (let k = 0; k < 8; k++){ const a = Math.PI / 8 + k * Math.PI / 4; ctx.lineTo(Math.cos(a) * 150, Math.sin(a) * 150); } ctx.closePath(); ctx.fillStyle = "#D84315"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 10; ctx.stroke();
      label(ctx, th, f.stopText || "STOP", 0, 26, 64, "#FFFFFF"); ctx.restore(); } }
  };

  R.domino = (ctx, th, s, t) => {
    const f = s.f, M = mv(), tl = f.tiles || [], n = tl.length || 1; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const g = f.headline ? 1150 : 1110, gap = Math.min(220, 760 / n), x0 = 540 - gap * (n - 1) / 2 - 20, H = 300, Wd = 74;
    ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.2)" : hexA(INK, .25); ctx.fillRect(110, g, 860, 8);
    const stopAt = f.stopAt ?? n;
    tl.forEach((d, i) => { const tf = at0(s, d.cue, .15 + i * .18), x = x0 + i * gap, ang = i < stopAt && t > tf ? -Math.min(1.25, 1.25 * eOut(clamp((t - tf) / .45, 0, 1))) * (i === n - 1 ? 1.2 : 1) : 0, sc = popS(t, .1 + i * .06);
      if (!sc) return; ctx.save(); ctx.translate(x + Wd, g); ctx.rotate(-ang); ctx.translate(-Wd, 0);
      rr(ctx, 0, -H, Wd, H, 14); ctx.fillStyle = i >= stopAt ? "#3BB273" : (i === n - 1 && f.lastAlert ? "#D84315" : M.pal[i % 3]); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.arc(Wd / 2, -H * .32, 8, 0, TAU); ctx.arc(Wd / 2, -H * .68, 8, 0, TAU); ctx.fill();
      if (d.icon) icon(ctx, d.icon, Wd / 2 - 22, -H / 2 - 22, 44, "#fff", 2.4); ctx.restore();
      const lt = clamp((t - tf) / .4, 0, 1); if (t > tf || f.labelsFirst){ ctx.save(); ctx.globalAlpha *= f.labelsFirst ? 1 : lt; font(ctx, 700, 28, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = "center";
        const words = (d.label || "").split(" "); const l1 = words.slice(0, Math.ceil(words.length / 2)).join(" "), l2 = words.slice(Math.ceil(words.length / 2)).join(" ");
        ctx.fillText(l1, x + Wd / 2, g + 50); if (l2) ctx.fillText(l2, x + Wd / 2, g + 84); ctx.textAlign = "left"; ctx.restore(); }
      if (t > tf) burst(ctx, x + Wd * 2, g - 30, t - tf - .4, M, 5); });
    if (f.stopAt != null && t > at0(s, f.stopCue, .7)){ const q = eBack(clamp((t - at0(s, f.stopCue, .7)) / .4, 0, 1)), x = x0 + (stopAt - .5) * gap + Wd / 2; ctx.save(); ctx.translate(x, g - H - 70); ctx.scale(q, q); disc(ctx, "shield", 0, 0, 50, "#3BB273", "#fff"); ctx.restore(); }
  };

  R.slider = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const y0 = f.headline ? 650 : 600, y1 = 1320, tc = at0(s, f.cue, .35), dx = 990 - 450 * easeIO(clamp((t - tc) / 1.1, 0, 1)) + (t > tc + 1.1 ? Math.sin(t * 1.5) * 10 : 0);
    const side = (d, x0, warm) => { rr(ctx, 90, y0, 900, y1 - y0, 44); ctx.fillStyle = warm ? hexA(th.accent, .16) : (th.key === "B" ? "#2A2622" : "#ECE6DD"); ctx.fill();
      const cx = x0; font(ctx, 800, 40, th.fam); const tw = ctx.measureText(d.title).width + 60; rr(ctx, cx - tw / 2, y0 + 40, tw, 72, 36); ctx.fillStyle = warm ? th.accent : "#8C8476"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(d.title, cx, y0 + 90);
      ctx.beginPath(); ctx.arc(cx, y0 + 260, 100, 0, TAU); ctx.fillStyle = warm ? th.accent : "#B8AE9D"; ctx.fill(); icon(ctx, d.icon || "star", cx - 56, y0 + 204, 112, "#fff", 2);
      (d.items || []).forEach((it, i) => { const yy = y0 + 430 + i * 92; font(ctx, 700, 32, th.fam); const iw = Math.min(400, ctx.measureText(it).width + 80); rr(ctx, cx - iw / 2, yy, iw, 68, 34); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        ctx.fillStyle = INK; ctx.fillText(it, cx + 16, yy + 45); ctx.beginPath(); ctx.arc(cx - iw / 2 + 32, yy + 34, 12, 0, TAU); ctx.fillStyle = warm ? th.accent : "#B8AE9D"; ctx.fill(); });
      ctx.textAlign = "left"; };
    ctx.save(); side(f.left || {}, 315, false); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(dx, y0, 990 - dx, y1 - y0); ctx.clip(); side(f.right || {}, 765, true); ctx.restore();
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(dx - 4, y0, 8, y1 - y0); ctx.beginPath(); ctx.arc(dx, (y0 + y1) / 2, 40, 0, TAU); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(dx - 26, (y0 + y1) / 2); ctx.lineTo(dx - 10, (y0 + y1) / 2 - 12); ctx.lineTo(dx - 10, (y0 + y1) / 2 + 12); ctx.fill(); ctx.beginPath(); ctx.moveTo(dx + 26, (y0 + y1) / 2); ctx.lineTo(dx + 10, (y0 + y1) / 2 - 12); ctx.lineTo(dx + 10, (y0 + y1) / 2 + 12); ctx.fill();
  };

  R.map = (ctx, th, s, t) => {
    const f = s.f, M = mv(), pins = f.pins || [], n = pins.length; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    const y0 = f.headline ? 640 : 590, y1 = 1320; ctx.save(); ctx.globalAlpha *= clamp(t * 4, 0, 1);
    rr(ctx, 90, y0, 900, y1 - y0, 44); ctx.fillStyle = th.key === "B" ? "#241E18" : "#F3EADF"; ctx.fill(); ctx.save(); ctx.clip();
    ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.05)" : "rgba(255,255,255,.7)"; for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++){ if ((r * 3 + c) % 4 === 0) continue; rr(ctx, 110 + c * 180, y0 + 20 + r * 125, 150, 95, 16); ctx.fill(); }
    ctx.strokeStyle = th.key === "B" ? "rgba(124,196,232,.25)" : "rgba(124,196,232,.55)"; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(90, y0 + 500); ctx.bezierCurveTo(400, y0 + 420, 600, y0 + 640, 990, y0 + 560); ctx.stroke(); ctx.restore();
    const P = u => { const a = 1 - u, A = [180, y1 - 90], B = [260, y0 + 120], C = [820, y1 - 60], D = [880, y0 + 110]; return [a ** 3 * A[0] + 3 * a * a * u * B[0] + 3 * a * u * u * C[0] + u ** 3 * D[0], a ** 3 * A[1] + 3 * a * a * u * B[1] + 3 * a * u * u * C[1] + u ** 3 * D[1]]; };
    const tm = pins.map((p, i) => at0(s, p.cue, .15 + i * .25)), us = pins.map((p, i) => p.u ?? (n > 1 ? i / (n - 1) : .5));
    let u = 0; tm.forEach((x, i) => { const prevU = i ? us[i - 1] : 0, prevT = i ? tm[i - 1] : 0; if (t >= prevT) u = prevU + (us[i] - prevU) * easeIO(clamp((t - Math.max(prevT, x - 1.2)) / 1.2, 0, 1)); });
    ctx.setLineDash([14, 14]); ctx.strokeStyle = hexA(th.accent, .4); ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); for (let k = 0; k <= 60; k++){ const q = P(k / 60); k ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke();
    ctx.setLineDash([]); ctx.strokeStyle = th.accent; ctx.beginPath(); for (let k = 0; k <= Math.floor(u * 60); k++){ const q = P(k / 60); k ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke();
    pins.forEach((p, i) => { if (t < tm[i] - .2) return; const [x, y] = P(us[i]), q = eBack(clamp((t - tm[i] + .2) / .4, 0, 1));
      ctx.save(); ctx.translate(x, y); ctx.scale(q, q); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-34, -40, -34, -86, 0, -86); ctx.bezierCurveTo(34, -86, 34, -40, 0, 0); ctx.fillStyle = i === n - 1 && f.lastAlert ? "#D84315" : th.accent; ctx.fill();
      ctx.beginPath(); ctx.arc(0, -60, 15, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); ctx.restore();
      const lx = clamp(x + (x > 540 ? -20 : 20), 120, 960); font(ctx, 700, 30, th.fam); const w = ctx.measureText(p.label).width + 70; const bx = clamp(x > 540 ? lx - w : lx, 110, 970 - w);
      ctx.save(); ctx.globalAlpha *= q; rr(ctx, bx, y - 150, w, 56, 28); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .15); ctx.lineWidth = 3; ctx.stroke(); if (p.icon) icon(ctx, p.icon, bx + 14, y - 140, 34, th.accent, 2.4); ctx.fillStyle = INK; ctx.fillText(p.label, bx + (p.icon ? 54 : 22), y - 112); ctx.restore(); });
    const [tx, ty] = P(u); disc(ctx, f.traveler || "users", tx, ty - 6 + Math.sin(t * 8) * 4, 40, INK, "#FFF7EE"); ctx.restore();
  };

  R.comic = (ctx, th, s, t) => {
    const f = s.f, M = mv(), ps = (f.panels || []).slice(0, 3); topHead(ctx, th, f, t);
    const y0 = f.headline ? 640 : 590, boxes = [[100, y0, 430, 340, -.015], [550, y0 + 10, 430, 340, .02], [110, y0 + 370, 860, 330, -.01]];
    ps.forEach((pn, i) => { const tp = i === 0 && !pn.cue ? .1 : at0(s, pn.cue, .1 + i * .3); if (t < tp) return; const [x, y, w, h, r] = boxes[i], q = eBack(clamp((t - tp) / .45, 0, 1));
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(r); ctx.scale(q, q); ctx.translate(-w / 2, -h / 2);
      rr(ctx, 8, 10, w, h, 18); ctx.fillStyle = "rgba(24,21,15,.3)"; ctx.fill(); rr(ctx, 0, 0, w, h, 18); ctx.fillStyle = pn.night ? "#3A2C22" : "#FFF3E4"; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, w, h, 18); ctx.clip(); ctx.fillStyle = pn.night ? "#5A4232" : "#E9C9A8"; ctx.fillRect(0, h - 70, w, 70);
      if (pn.desk){ ctx.fillStyle = "#B5643C"; rr(ctx, pn.desk - 90, h - 130, 180, 16, 6); ctx.fill(); ctx.fillStyle = "#8E4E2E"; ctx.fillRect(pn.desk - 80, h - 114, 10, 60); ctx.fillRect(pn.desk + 70, h - 114, 10, 60); }
      if (pn.clock){ ctx.beginPath(); ctx.arc(w - 60, 60, 30, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.moveTo(w - 60, 60); ctx.lineTo(w - 60 + Math.sin(t * 2) * 22, 60 - Math.cos(t * 2) * 22); ctx.stroke(); }
      (pn.actors || []).forEach(a => { const st = actorState(a, s, t); const rr2 = drawActor(ctx, th, a, st, t, h - 18, a.scale || .56);
        if (st.emote) emoteAt(ctx, th, st.emote, rr2.headX + 40, rr2.headTop + 20, t - st.emoteT, t);
        if (st.say){ font(ctx, 700, 24, th.fam); const lines = wrapRich(ctx, st.say, "", 220).map(l => l.map(z => z.w).join(" ")).slice(0, 3), bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 28, bh = lines.length * 28 + 20;
          const bx = clamp(rr2.headX - bw / 2, 8, w - bw - 8), by = Math.max(8, rr2.headTop - bh - 10); ctx.save(); const k = eBack(clamp((t - st.sayT) / .3, 0, 1)); ctx.globalAlpha *= k;
          rr(ctx, bx, by, bw, bh, 14); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = INK; lines.forEach((l, j) => ctx.fillText(l, bx + 14, by + 34 + j * 28)); ctx.restore(); } });
      ctx.restore();
      rr(ctx, 0, 0, w, h, 18); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke();
      if (pn.caption){ font(ctx, 800, 24, th.fam); const cw = ctx.measureText(pn.caption).width + 26; rr(ctx, -6, -6, cw, 44, 8); ctx.fillStyle = "#F4A85C"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = INK; ctx.fillText(pn.caption, 7, 24); }
      ctx.restore(); });
  };

  R.funnel = (ctx, th, s, t) => {
    const f = s.f, M = mv(), ins = f.inputs || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const top = f.headline ? 760 : 700, cx = 540, wT = 640, wB = 110, fh = 330, to = at0(s, (f.output || {}).cue, .8);
    ctx.save(); ctx.translate(cx, top); ctx.beginPath(); ctx.moveTo(-wT / 2, 0); ctx.lineTo(wT / 2, 0); ctx.lineTo(wB / 2, fh); ctx.lineTo(wB / 2, fh + 90); ctx.lineTo(-wB / 2, fh + 90); ctx.lineTo(-wB / 2, fh); ctx.closePath();
    ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.08)" : "rgba(255,255,255,.65)"; ctx.fill(); ctx.strokeStyle = th.key === "B" ? "#FAF8F3" : INK; ctx.lineWidth = 7; ctx.lineJoin = "round"; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.moveTo(-wT / 2, 0); ctx.lineTo(wT / 2, 0); ctx.lineTo(wB / 2, fh); ctx.lineTo(-wB / 2, fh); ctx.closePath(); ctx.clip(); ctx.strokeStyle = hexA(th.accent, .3); ctx.lineWidth = 6;
    for (let k = 0; k < 5; k++){ ctx.beginPath(); ctx.ellipse(0, 40 + k * 60 + ((t * 40) % 60), (wT / 2) * (1 - (40 + k * 60) / fh * .8), 14, 0, 0, TAU); ctx.stroke(); } ctx.restore(); ctx.restore();
    ins.forEach((it, i) => { const ti = at0(s, it.cue, .08 + i * .12); if (t < ti) return; const q = clamp((t - ti) / 1.6, 0, 1), sx = cx + (i - (ins.length - 1) / 2) * 190, sy = top - 120;
      let x, y, sc; if (q < .35){ const u = q / .35; x = sx; y = sy - 60 * (1 - u); sc = eBack(u); } else { const u = (q - .35) / .65; const a = u * 7 + i; x = cx + Math.cos(a) * (1 - u) * (wT * .35) * (1 - u * .3); y = top + 40 + u * (fh - 40); sc = 1 - u * .8; }
      if (q >= 1 && t > to) return; if (q >= 1){ x = cx; y = top + fh; sc = .2; }
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); font(ctx, 700, 30, th.fam); const w = ctx.measureText(it.label).width + 40; rr(ctx, -w / 2, -30, w, 60, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .2); ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.fillText(it.label, 0, 10); ctx.textAlign = "left"; ctx.restore(); });
    if (f.output && t > to){ const q = eBack(clamp((t - to) / .5, 0, 1)), y = top + fh + 90 + 90 * eOut(clamp((t - to) / .5, 0, 1)); ctx.save(); ctx.translate(cx, y); ctx.scale(q, q); font(ctx, 800, 38, th.fam); const w = ctx.measureText(f.output.label).width + 80;
      rr(ctx, -w / 2, -42, w, 84, 42); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(f.output.label, 0, 13); ctx.textAlign = "left"; ctx.restore(); burst(ctx, cx, y, t - to - .2, M, 12); }
  };

  R.timer = (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const cx = 540, cy = f.headline ? 930 : 890, R0 = 250, total = f.total || 120, ts = at0(s, f.startCue, .1), te = f.endCue ? at0(s, f.endCue, .9) : sceneDur() - .3;
    const p = clamp((t - ts) / Math.max(.5, te - ts), 0, 1), remain = Math.ceil(total * (1 - p)), done = p >= 1;
    ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.06)" : "#FFFFFF"; ctx.fill();
    ctx.lineWidth = 44; ctx.strokeStyle = hexA(th.accent, .15); ctx.beginPath(); ctx.arc(cx, cy, R0 - 30, 0, TAU); ctx.stroke();
    ctx.strokeStyle = done ? "#3BB273" : th.accent; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(cx, cy, R0 - 30, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - p) + (done ? TAU : 0)); ctx.stroke();
    for (let k = 0; k < 60; k++){ const a = k * TAU / 60; ctx.strokeStyle = th.key === "B" ? "rgba(250,248,243,.3)" : hexA(INK, k % 5 ? .15 : .4); ctx.lineWidth = k % 5 ? 2 : 5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R0 + 14), cy + Math.sin(a) * (R0 + 14)); ctx.lineTo(cx + Math.cos(a) * (R0 + (k % 5 ? 26 : 34)), cy + Math.sin(a) * (R0 + (k % 5 ? 26 : 34))); ctx.stroke(); }
    rr(ctx, cx - 36, cy - R0 - 74, 72, 40, 12); ctx.fillStyle = th.key === "B" ? "#FAF8F3" : INK; ctx.fill();
    const mm = `${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, "0")}`; label(ctx, th, done ? "Beres!" : mm, cx, cy + 34, done ? 92 : 120, done ? "#3BB273" : th.ink);
    if (f.label) label(ctx, th, f.label, cx, cy + 100, 34, th.muted);
    (f.tasks || []).forEach((tk, i) => { const ti = at0(s, tk.cue, .3 + i * .2); if (t < ti) return; const q = eBack(clamp((t - ti) / .4, 0, 1)), y = cy + R0 + 90 + i * 84;
      ctx.save(); ctx.translate(cx, y); ctx.scale(q, q); font(ctx, 700, 32, th.fam); const w = ctx.measureText(tk.label).width + 100; rr(ctx, -w / 2, -32, w, 64, 32); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .15); ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.arc(-w / 2 + 34, 0, 16, 0, TAU); ctx.fillStyle = "#3BB273"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w / 2 + 26, 0); ctx.lineTo(-w / 2 + 32, 6); ctx.lineTo(-w / 2 + 43, -6); ctx.stroke();
      ctx.fillStyle = INK; ctx.fillText(tk.label, -w / 2 + 64, 11); ctx.restore(); });
    if (done) burst(ctx, cx, cy, t - te - .1, M, 14);
  };

  R.kanban = (ctx, th, s, t) => {
    const f = s.f, M = mv(), cols = f.cols || ["Ditunda", "Dikerjakan", "Selesai"], cards = f.cards || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const y0 = f.headline ? 650 : 600, cw = 280, gap = 20, x0 = 540 - (cw * 3 + gap * 2) / 2;
    cols.forEach((c, j) => { const x = x0 + j * (cw + gap); rr(ctx, x, y0, cw, 680, 28); ctx.fillStyle = th.key === "B" ? "rgba(250,248,243,.06)" : (j === 2 ? "rgba(59,178,115,.10)" : "rgba(255,255,255,.55)"); ctx.fill();
      font(ctx, 800, 30, th.fam); ctx.fillStyle = j === 2 ? "#3BB273" : th.ink; ctx.fillText(c, x + 22, y0 + 50); });
    const info = cards.map((cd, i) => ({ cd, ta: at0(s, cd.cue, .08 + i * .1), mv: (cd.moves || []).map((m, k) => ({ T: at0(s, m.cue, .4 + k * .2), col: m.col })) }));
    const colAt = (o, T) => { let c = o.cd.col || 0; o.mv.forEach(m => { if (T >= m.T) c = m.col; }); return c; };
    const slotAt = (i, T) => { const c = colAt(info[i], T); let n = 0; for (let j = 0; j < i; j++) if (T >= info[j].ta && colAt(info[j], T) === c) n++; return n; };
    const pos = info.map(o => { let col = o.cd.col || 0, from = col, tm = -9; o.mv.forEach(m => { if (t >= m.T){ from = col; col = m.col; tm = m.T; } }); return { cd: o.cd, ta: o.ta, col, from, tm }; });
    pos.forEach((o, i) => { if (t < o.ta) return; const slot = slotAt(i, t), q = easeIO(clamp((t - o.tm) / .7, 0, 1));
      const X = c => x0 + c * (cw + gap) + 16, Y = sl => y0 + 80 + sl * 104, fromSlot = o.tm > 0 ? slotAt(i, o.tm - .01) : slot;
      const x = X(o.from) + (X(o.col) - X(o.from)) * q, y = Y(o.tm > 0 && q < 1 ? fromSlot : slot) + (o.tm > 0 && q < 1 ? (Y(slot) - Y(fromSlot)) * q : 0) - Math.sin(Math.PI * q) * (o.tm > 0 ? 60 : 0);
      const k = eOut(clamp((t - o.ta) / .4, 0, 1)); ctx.save(); ctx.globalAlpha *= k; ctx.translate(x, y + (1 - k) * -30); ctx.rotate(Math.sin(Math.PI * q) * .06);
      rr(ctx, 0, 0, cw - 32, 88, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = o.col === 2 ? "#3BB273" : hexA(INK, .12); ctx.lineWidth = o.col === 2 ? 4 : 3; ctx.stroke();
      rr(ctx, 0, 0, 10, 88, 5); ctx.fillStyle = o.col === 2 ? "#3BB273" : M.pal[i % 3]; ctx.fill();
      font(ctx, 700, 26, th.fam); ctx.fillStyle = INK; const words = o.cd.label; ctx.fillText(words.length > 16 ? words.slice(0, 16) + "…" : words, 24, 52);
      if (o.col === 2 && q >= 1){ ctx.beginPath(); ctx.arc(cw - 60, 44, 15, 0, TAU); ctx.fillStyle = "#3BB273"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cw - 67, 44); ctx.lineTo(cw - 61, 50); ctx.lineTo(cw - 51, 38); ctx.stroke(); }
      ctx.restore(); });
  };

  R.calendar = (ctx, th, s, t) => {
    const f = s.f, M = mv(), pages = f.pages || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const cx = 540, top = f.headline ? 680 : 630, w = 560, h = 560;
    let idx = 0, tearT = -9; let rapid = null;
    if (f.rapid){ const a = at0(s, f.rapid.startCue, .2), b = at0(s, f.rapid.endCue, .8), q = clamp((t - a) / Math.max(.5, b - a), 0, 1), n = f.rapid.to - f.rapid.from; rapid = { day: Math.round(f.rapid.from + n * easeIO(q)), q, frac: (n * easeIO(q)) % 1 }; }
    else pages.forEach((pg, i) => { const ti = at0(s, pg.cue, .15 + i * .3); if (t >= ti){ idx = i; tearT = ti; } });
    const pg = rapid ? { day: String(rapid.day), note: f.rapid.note } : pages[idx] || {}, prev = rapid ? null : (idx > 0 ? pages[idx - 1] : null);
    const drawPage = (p, ox, oy, rot, alpha, circled) => { ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(cx + ox, top + oy); ctx.rotate(rot);
      rr(ctx, -w / 2, 0, w, h, 30); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .15); ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); rr(ctx, -w / 2, 0, w, h, 30); ctx.clip(); ctx.fillStyle = p.alert ? "#D84315" : th.accent; ctx.fillRect(-w / 2, 0, w, 120); ctx.restore();
      label(ctx, th, p.month || f.month || "", 0, 78, 44, "#FFFFFF");
      const big = String(p.day || ""); label(ctx, th, big, 0, 330, big.length > 4 ? 96 : 190, INK);
      if (p.note) label(ctx, th, p.note, 0, 440, 40, p.alert ? "#D84315" : "#9A6A50");
      if (circled){ ctx.strokeStyle = th.accent; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(0, big.length > 4 ? 300 : 268, 220, big.length > 4 ? 96 : 118, -.06, -Math.PI * .9, -Math.PI * .9 + TAU * 1.03 * circled); ctx.stroke(); }
      ctx.restore(); };
    for (let k = 3; k > 0; k--){ rr(ctx, cx - w / 2 + k * 6, top + k * 10, w, h, 30); ctx.fillStyle = `rgba(255,255,255,${.5 - k * .1})`; ctx.fill(); }
    ctx.fillStyle = th.key === "B" ? "#FAF8F3" : INK; for (let k = 0; k < 6; k++){ rr(ctx, cx - w / 2 + 60 + k * 90, top - 22, 22, 50, 11); ctx.fill(); }
    drawPage(pg, 0, 0, 0, 1, pg.circled ? eOut(clamp((t - tearT - .5) / .7, 0, 1)) : 0);
    if (prev && t - tearT < 1){ const q = (t - tearT); drawPage(prev, q * 300, q * q * 900, q * .8, 1 - q, 0); }
    if (rapid && rapid.q > 0 && rapid.q < 1){ drawPage({ day: String(rapid.day - 1) }, rapid.frac * 200, rapid.frac * 400, rapid.frac * .6, 1 - rapid.frac, 0); }
    if (f.counter && rapid){ const v = Math.round((rapid.day - f.rapid.from + 1) * f.counter.per); const txt = `${f.counter.prefix || ""}${v.toLocaleString("id-ID")}`;
      pill(ctx, th, txt, cx, top + h + 90, rapid.q >= 1 ? "#D84315" : INK, "#FFF7EE", 46); if (f.counter.label) label(ctx, th, f.counter.label, cx, top + h + 170, 30, th.muted); }
  };

  R.dart = (ctx, th, s, t) => {
    const f = s.f, M = mv(), th0 = f.throws || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const cx = 540, cy = f.headline ? 940 : 900, R0 = 280;
    const rings = [[1, th.key === "B" ? "#3A2E24" : "#FFFFFF"], [.8, "#F4A85C"], [.6, "#FFFFFF"], [.4, th.accent], [.2, "#FFFFFF"], [.09, "#D84315"]];
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .1); rings.forEach(([r, c]) => { ctx.beginPath(); ctx.arc(0, 0, R0 * r, 0, TAU); ctx.fillStyle = c; ctx.fill(); }); ctx.strokeStyle = hexA(INK, .25); ctx.lineWidth = 3; for (let k = 0; k < 8; k++){ ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(k * TAU / 8) * R0, Math.sin(k * TAU / 8) * R0); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(0, 0, R0, 0, TAU); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
    th0.forEach((d, i) => { const ti = at0(s, d.cue, .2 + i * .25); if (t < ti) return; const a = d.angle ?? (-.8 + i * 1.9), hx = cx + Math.cos(a) * d.hit * R0 * 1.05, hy = cy + Math.sin(a) * d.hit * R0 * 1.05, q = clamp((t - ti) / .45, 0, 1);
      const sx = 1100, sy = cy - 300, x = sx + (hx - sx) * q, y = sy + (hy - sy) * q - Math.sin(Math.PI * q) * 80, wob = q >= 1 ? Math.sin((t - ti) * 30) * .08 * Math.max(0, 1 - (t - ti - .45) * 2) : 0;
      ctx.save(); ctx.translate(x, y); ctx.rotate(-2.6 + wob); ctx.fillStyle = INK; rr(ctx, 0, -5, 120, 10, 5); ctx.fill(); ctx.fillStyle = d.hit < .12 ? th.accent : "#8C8476"; ctx.beginPath(); ctx.moveTo(100, 0); ctx.lineTo(140, -22); ctx.lineTo(132, 0); ctx.lineTo(140, 22); ctx.closePath(); ctx.fill(); ctx.restore();
      if (q >= 1){ const k = eBack(clamp((t - ti - .45) / .35, 0, 1)), good = d.hit < .12, lx = clamp(hx + (hx > cx ? 40 : -40), 120, 960); ctx.save(); ctx.globalAlpha *= k; font(ctx, 800, 30, th.fam); const w = ctx.measureText(d.label).width + 46, bx = clamp(hx > cx ? lx : lx - w, 100, 980 - w), by = hy + 50 + (i % 2) * 70;
        rr(ctx, bx, by, w, 58, 29); ctx.fillStyle = good ? th.accent : "#8C8476"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(d.label, bx + 23, by + 40); ctx.restore(); if (good) burst(ctx, hx, hy, t - ti - .45, M, 14); } });
    if (f.verdict){ const tv = at0(s, f.verdictCue, .85); if (t > tv){ const q = eBack(clamp((t - tv) / .4, 0, 1)); ctx.save(); ctx.translate(cx, cy + R0 + 110); ctx.scale(q, q); pill(ctx, th, f.verdict, 0, 0, INK, "#FFF7EE", 40); ctx.restore(); } }
  };

  R.puzzle = (ctx, th, s, t) => {
    const f = s.f, M = mv(), pcs = f.pieces || [], n = pcs.length, cols = n > 4 ? 3 : 2, rows = Math.ceil(n / cols); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const pw = cols === 3 ? 270 : 360, ph = 250, x0 = 540 - pw * cols / 2, y0 = (f.headline ? 700 : 650);
    ctx.save(); rr(ctx, x0 - 16, y0 - 16, pw * cols + 32, ph * rows + 32, 30); ctx.setLineDash([16, 12]); ctx.strokeStyle = hexA(th.key === "B" ? "#FAF8F3" : INK, .25); ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
    let done = 0;
    pcs.forEach((pc, i) => { const r = Math.floor(i / cols), c = i % cols, tx = x0 + c * pw, ty = y0 + r * ph, ti = at0(s, pc.cue, .15 + i * .15);
      if (t < ti){ ctx.save(); ctx.translate(tx + pw / 2, ty + ph / 2); ctx.fillStyle = hexA(th.key === "B" ? "#FAF8F3" : INK, .05); rr(ctx, -pw / 2 + 8, -ph / 2 + 8, pw - 16, ph - 16, 18); ctx.fill(); label(ctx, th, "?", 0, 24, 70, hexA(th.key === "B" ? "#FAF8F3" : INK, .25)); ctx.restore(); return; }
      const q = easeIO(clamp((t - ti) / .7, 0, 1)); if (q >= 1) done++; const sx = (i % 2 ? 1200 : -200), sy = ty - 300 + (i * 97) % 200, x = sx + (tx - sx) * q, y = sy + (ty - sy) * q;
      ctx.save(); ctx.translate(x + pw / 2, y + ph / 2); ctx.rotate((1 - q) * (i % 2 ? .8 : -.8));
      ctx.beginPath(); ctx.rect(-pw / 2 + 6, -ph / 2 + 6, pw - 12, ph - 12); if (c < cols - 1){ ctx.moveTo(pw / 2 - 6, -20); ctx.arc(pw / 2 + 12, 0, 26, -Math.PI * .7, Math.PI * .7); } if (r < rows - 1){ ctx.moveTo(-20, ph / 2 - 6); ctx.arc(0, ph / 2 + 12, 26, -Math.PI * .2, Math.PI * 1.2); }
      ctx.fillStyle = M.pal[i % 3]; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
      if (pc.icon) icon(ctx, pc.icon, -30, -ph / 2 + 30, 60, "#fff", 2.2);
      const es = G.enterStart; G.enterStart = null; drawRich(ctx, { text: pc.label || "", x: -pw / 2 + 20, y: pc.icon ? 0 : -40, maxW: pw - 40, size: 36, weight: 800, fam: th.fam, color: "#FFFFFF", accent: "#FFFFFF", maxLines: 2, minSize: 24, align: "center", track: -.5 }); G.enterStart = es;
      ctx.restore(); if (q >= 1) burst(ctx, tx + pw / 2, ty + ph / 2, t - ti - .7, M, 6); });
    if (done === n && f.title){ const tl = Math.max(...pcs.map((pc, i) => at0(s, pc.cue, .15 + i * .15))) + .8, q = eBack(clamp((t - tl) / .4, 0, 1)); ctx.save(); ctx.translate(540, y0 + ph * rows + 80); ctx.scale(q, q); pill(ctx, th, f.title, 0, 0, INK, "#FFF7EE", 40); ctx.restore(); }
  };

  R.tree = (ctx, th, s, t) => {
    const f = s.f, M = mv(), nodes = f.nodes || []; topHead(ctx, th, f, t); if (!popS(t, .05)) return;
    if (f.mode === "plant"){ const gx = 540, gy = 1250, tg = at0(s, f.growCue, .05), gp = eOut(clamp((t - tg) / 2.5, 0, 1)), H = 520 * gp;
      ctx.fillStyle = "#8E4E2E"; rr(ctx, 260, gy, 560, 70, 30); ctx.fill(); ctx.fillStyle = th.accent; rr(ctx, 230, gy - 20, 620, 40, 20); ctx.fill();
      ctx.strokeStyle = "#7A4A2A"; ctx.lineWidth = 6; for (let k = 0; k < 5; k++){ const rp = clamp(gp * 1.3 - k * .1, 0, 1); ctx.beginPath(); ctx.moveTo(gx, gy + 20); ctx.quadraticCurveTo(gx + (k - 2) * 60, gy + 50, gx + (k - 2) * 130 * rp, gy + 60 * rp); ctx.stroke(); }
      ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + Math.sin(t) * 6, gy - H / 2, gx, gy - H); ctx.stroke();
      nodes.forEach((nd, i) => { const ti = at0(s, nd.cue, .3 + i * .2); if (t < ti) return; const q = eBack(clamp((t - ti) / .6, 0, 1)), side = i % 2 ? 1 : -1, by = gy - 160 - i * 130, ex = gx + side * 200, ey = by - 60 + Math.sin(t * 1.4 + i) * 6;
        ctx.strokeStyle = "#5A3A2A"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(gx, by); ctx.quadraticCurveTo(gx + side * 100, by - 10, gx + side * 200 * q, by - 60 * q); ctx.stroke();
        ctx.save(); ctx.translate(ex, ey); ctx.scale(q, q); ctx.rotate(side * -.2); ctx.beginPath(); ctx.ellipse(0, 0, 150, 70, 0, 0, TAU); ctx.fillStyle = ["#5E9B5A", "#7FB069", "#4E8A4A"][i % 3]; ctx.fill(); ctx.rotate(side * .2);
        font(ctx, 800, 32, th.fam); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center"; ctx.fillText(nd.label, 0, 11); ctx.textAlign = "left"; ctx.restore(); });
      if (f.title){ const q = eBack(clamp((t - tg - 2.5) / .5, 0, 1)); if (q > 0){ ctx.save(); ctx.translate(gx, gy - H - 70); ctx.scale(q, q); pill(ctx, th, f.title, 0, 0, INK, "#FFF7EE", 38); ctx.restore(); } }
      return; }
    const root = f.root || {}, rx = 540, ry = f.headline ? 700 : 660, kids = nodes.length, kw = Math.min(240, 860 / kids - 20);
    const rq = eBack(clamp((t - .15) / .5, 0, 1)), shake = f.shake && t < at0(s, (nodes[0] || {}).cue, 2) ? Math.sin(t * 22) * 4 : 0;
    ctx.save(); ctx.translate(rx + shake, ry); ctx.scale(rq, rq); font(ctx, 800, 44, th.fam); const rw = ctx.measureText(root.label || "").width + 90; rr(ctx, -rw / 2, -50, rw, 100, 50); ctx.fillStyle = "#D84315"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(root.label || "", 0, 15); ctx.textAlign = "left"; ctx.restore();
    if (f.shake && !kids){ for (let k = 0; k < 3; k++){ const a = t * 1.5 + k * 2.1; label(ctx, th, "?", rx + Math.cos(a) * 260, ry + 120 + Math.sin(a) * 60, 64, hexA(th.accent, .8)); } }
    nodes.forEach((nd, i) => { const ti = at0(s, nd.cue, .25 + i * .2); if (t < ti) return; const q = eOut(clamp((t - ti) / .5, 0, 1)), x = 540 + (i - (kids - 1) / 2) * (kw + 20), y = ry + 300;
      ctx.strokeStyle = hexA(th.key === "B" ? "#FAF8F3" : INK, .4); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(rx, ry + 50); ctx.bezierCurveTo(rx, ry + 170, x, ry + 140, rx + (x - rx) * q, ry + 50 + (y - 60 - ry - 50) * q); ctx.stroke();
      if (q > .7){ const k = eBack(clamp((t - ti - .35) / .4, 0, 1)); ctx.save(); ctx.translate(x, y + Math.sin(t * 1.3 + i) * 4); ctx.scale(k, k); rr(ctx, -kw / 2, -60, kw, 150, 26); ctx.fillStyle = nd.hit ? th.accent : "#FFFFFF"; ctx.fill(); ctx.strokeStyle = hexA(INK, .2); ctx.lineWidth = 3; ctx.stroke();
        if (nd.icon) icon(ctx, nd.icon, -24, -44, 48, nd.hit ? "#fff" : th.accent, 2.4); const es = G.enterStart; G.enterStart = null;
        drawRich(ctx, { text: nd.label, x: -kw / 2 + 12, y: nd.icon ? 10 : -30, maxW: kw - 24, size: 30, weight: 800, fam: th.fam, color: nd.hit ? "#FFFFFF" : INK, accent: nd.hit ? "#FFFFFF" : INK, maxLines: 2, minSize: 22, align: "center", track: -.3 }); G.enterStart = es; ctx.restore(); } });
  };

  R.bucket = (ctx, th, s, t) => {
    const f = s.f, M = mv(), holes = f.holes || []; topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    const cx = 540, top = f.headline ? 860 : 820, h = 400, wT = 460, wB = 340, bot = top + h, tf = at0(s, f.fillCue, .05), tp = f.patchCue ? at0(s, f.patchCue, .7) : 1e9;
    const leaks = holes.map((hh, i) => at0(s, hh.cue, .25 + i * .15)), active = leaks.filter((x, i) => t > x && !(t > tp && (f.patch || []).includes(i))).length;
    const fill = clamp((t - tf) * .22, 0, .85) - clamp(active * .045 * Math.max(0, t - (leaks[0] || 99)), 0, .55) + (t > tp ? clamp((t - tp) * .2, 0, .5) : 0), lev = clamp(fill, .08, .88);
    if (t > tf){ ctx.strokeStyle = "#7CC4E8"; ctx.lineWidth = 20 + Math.sin(t * 9) * 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - 30, top - 230); ctx.quadraticCurveTo(cx - 20, top - 100, cx, bot - h * lev); ctx.stroke(); rr(ctx, cx - 110, top - 290, 160, 80, 20); ctx.fillStyle = INK; ctx.fill(); label(ctx, th, f.source || "Gaji", cx - 30, top - 240, 32, "#FFF7EE"); }
    const edge = y => wT / 2 + (wB / 2 - wT / 2) * (y - top) / h;
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx - wT / 2, top); ctx.lineTo(cx - wB / 2, bot); ctx.lineTo(cx + wB / 2, bot); ctx.lineTo(cx + wT / 2, top); ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill(); ctx.clip();
    const ly = bot - h * lev; ctx.beginPath(); ctx.moveTo(cx - wT, bot); for (let k = 0; k <= 24; k++){ const x = cx - wT / 2 + wT * k / 24; ctx.lineTo(x, ly + Math.sin(x * .05 + t * 4) * 7); } ctx.lineTo(cx + wT, bot); ctx.closePath(); ctx.fillStyle = "#7CC4E8"; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(cx - wT / 2, top); ctx.lineTo(cx - wB / 2, bot); ctx.lineTo(cx + wB / 2, bot); ctx.lineTo(cx + wT / 2, top); ctx.strokeStyle = th.key === "B" ? "#FAF8F3" : INK; ctx.lineWidth = 9; ctx.lineJoin = "round"; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, top, wT / 2, 26, 0, 0, TAU); ctx.lineWidth = 6; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, top - 10, wT / 2 + 10, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 6; ctx.stroke();
    holes.forEach((hh, i) => { if (t < leaks[i]) return; const side = i % 2 ? 1 : -1, y = top + 120 + Math.floor(i / 2) * 110, x = cx + side * edge(y), patched = t > tp && (f.patch || []).includes(i);
      if (patched){ ctx.save(); ctx.translate(x, y); ctx.rotate(.5); rr(ctx, -40, -18, 80, 36, 8); ctx.fillStyle = "#F4A85C"; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fillStyle = INK; ctx.fill(); for (let k = 0; k < 5; k++){ const q = ((t * 1.3 + k / 5) % 1); ctx.beginPath(); ctx.arc(x + side * (20 + q * 90), y + q * q * 260, 8 - q * 3, 0, TAU); ctx.fillStyle = "#7CC4E8"; ctx.fill(); } }
      const q = eBack(clamp((t - leaks[i]) / .4, 0, 1)); ctx.save(); ctx.translate(x + side * 170, y + 30); ctx.scale(q, q); font(ctx, 800, 28, th.fam); const w = ctx.measureText(hh.label).width + 40; rr(ctx, -w / 2, -26, w, 52, 26); ctx.fillStyle = patched ? "#3BB273" : "#D84315"; ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(hh.label, 0, 10); ctx.textAlign = "left"; ctx.restore(); });
  };

  // Register the new layouts with the engine's editor (names + editable fields).
  Object.assign(LAYOUTS, { lock: "Gembok", inbox: "Kotak masuk", domino: "Domino", slider: "Sebelum-sesudah", map: "Peta perjalanan", comic: "Komik 3 panel", funnel: "Corong", timer: "Timer", kanban: "Papan kanban", calendar: "Kalender", dart: "Papan dart", puzzle: "Puzzle", tree: "Pohon", bucket: "Ember bocor", pie: "Donat persen", pour: "Tuang ke wadah", flip: "Kartu balik", portrait: "Potret tokoh", glass: "Gelas air", battery: "Baterai energi", bricks: "Dinding bata", daycycle: "Siklus hari", waveform: "Pesan suara", search: "Pencarian", stage: "Panggung tokoh", kinetic: "Teks kinetik", sort: "Sortir kartu", stack: "Toples / tumpuk", split: "Pecah balok", scale: "Timbangan", chart: "Grafik", phone: "Layar HP", week: "Kalender minggu", handoff: "Serah terima (ikon bergerak)", versus: "Versus (dua ikon)", meter: "Meter (jarum)", bigicon: "Ikon besar", flow: "Alur ikon" });
  const HEAD = [["headline", "Judul (opsional)", "area"], ["highlight", "Kata yang diwarnai", "text"]];
  Object.assign(FIELD_DEFS, { lock: HEAD, inbox: HEAD, domino: HEAD, slider: HEAD, map: HEAD, comic: HEAD, funnel: HEAD, timer: HEAD, kanban: HEAD, calendar: HEAD, dart: HEAD, puzzle: HEAD, tree: HEAD, bucket: HEAD, pie: HEAD, pour: HEAD, flip: HEAD, portrait: HEAD, glass: HEAD, battery: HEAD, bricks: HEAD, daycycle: HEAD, waveform: HEAD, search: HEAD, stage: HEAD, kinetic: [], sort: HEAD, stack: HEAD, split: HEAD, scale: HEAD, chart: HEAD, phone: HEAD, week: HEAD, handoff: HEAD, versus: HEAD, meter: HEAD, flow: HEAD, bigicon: [["word", "Kata besar", "text"], ["highlight", "Kata yang diwarnai", "text"]] });

  // SFX for the new layouts (the engine only knows its own).
  const _collect = collectEvents;
  collectEvents = function(){
    const ev = _collect();
    TL.scenes.forEach((st, i) => { const s = P.scenes[i], f = (s && s.f) || {}, add = (lt, type) => ev.push({ t: st.start + lt, type });
      if (!s) return;
      if (s.layout === "handoff"){ add(cueT(s, f.sendCue, .25, i), "whoosh"); if (f.backCue) add(cueT(s, f.backCue, .65, i), "whoosh"); add(.1, "pop"); add(.3, "pop"); }
      else if (s.layout === "versus"){ add(cueT(s, f.left && f.left.cue, .1, i), "pop"); add(cueT(s, f.right && f.right.cue, .4, i), "pop"); if (f.winCue) add(cueT(s, f.winCue, .75, i), "chime"); }
      else if (s.layout === "meter"){ (f.marks || []).forEach((m, k) => add(cueT(s, m.cue, (k + 1) / ((f.marks || []).length + 1), i), "pop")); }
      else if (s.layout === "bigicon"){ add(.12, "chime"); }
      else if (s.layout === "lock"){ keyTimes(s, f.keys, i).forEach(k => add(k.T, k.action === "break" ? "whoosh" : "chime")); }
      else if (s.layout === "inbox"){ (f.items || []).forEach((it, k) => add(cueT(s, it.cue, .1 + k * .15, i), it.danger ? "ping" : "pop")); if (f.stopCue) add(cueT(s, f.stopCue, .85, i), "whoosh"); }
      else if (s.layout === "domino"){ (f.tiles || []).forEach((d, k) => add(cueT(s, d.cue, .15 + k * .18, i) + .3, "pop")); }
      else if (s.layout === "slider"){ add(cueT(s, f.cue, .35, i), "whoosh"); }
      else if (s.layout === "map"){ (f.pins || []).forEach((p, k) => add(cueT(s, p.cue, .15 + k * .25, i), "pop")); }
      else if (s.layout === "comic"){ (f.panels || []).forEach((pn, k) => add(k === 0 && !pn.cue ? .1 : cueT(s, pn.cue, .1 + k * .3, i), "whoosh")); }
      else if (s.layout === "funnel"){ (f.inputs || []).forEach((it, k) => add(cueT(s, it.cue, .08 + k * .12, i), "pop")); if (f.output) add(cueT(s, f.output.cue, .8, i), "chime"); }
      else if (s.layout === "timer"){ (f.tasks || []).forEach((tk, k) => add(cueT(s, tk.cue, .3 + k * .2, i), "pop")); }
      else if (s.layout === "kanban"){ (f.cards || []).forEach((cd, k) => (cd.moves || []).forEach((m, j) => add(cueT(s, m.cue, .4 + j * .2, i), "pop"))); }
      else if (s.layout === "calendar"){ (f.pages || []).forEach((pg, k) => add(cueT(s, pg.cue, .15 + k * .3, i), "whoosh")); }
      else if (s.layout === "dart"){ (f.throws || []).forEach((d, k) => add(cueT(s, d.cue, .2 + k * .25, i) + .4, d.hit < .12 ? "chime" : "pop")); }
      else if (s.layout === "puzzle"){ (f.pieces || []).forEach((pc, k) => add(cueT(s, pc.cue, .15 + k * .15, i) + .65, "pop")); }
      else if (s.layout === "tree"){ (f.nodes || []).forEach((nd, k) => add(cueT(s, nd.cue, .25 + k * .2, i) + .3, "pop")); }
      else if (s.layout === "bucket"){ (f.holes || []).forEach((h, k) => add(cueT(s, h.cue, .25 + k * .15, i), "pop")); if (f.patchCue) add(cueT(s, f.patchCue, .7, i), "chime"); }
      else if (s.layout === "pie"){ (f.slices || []).forEach((x, k) => add(cueT(s, x.cue, .15 + k * .25, i), "pop")); }
      else if (s.layout === "pour"){ (f.cups || []).forEach((c, k) => { const tc = cueT(s, c.cue, .15 + k * .2, i); add(tc, "whoosh"); if (c.tag) add(tc + 1.2, "pop"); }); }
      else if (s.layout === "flip"){ add(cueT(s, f.flipCue, .5, i), "whoosh"); add(cueT(s, f.flipCue, .5, i) + .6, "chime"); }
      else if (s.layout === "portrait"){ keyTimes(s, (f.person || {}).keys, i).forEach(k => { if (k.say != null || k.emote) add(k.T, "pop"); }); }
      else if (s.layout === "glass"){ (f.marks || []).forEach((m, k) => add(cueT(s, m.cue, .15 + k * .25, i), "pop")); }
      else if (s.layout === "battery"){ (f.levels || []).forEach((l, k) => add(cueT(s, l.cue, .2 + k * .3, i), "pop")); }
      else if (s.layout === "bricks"){ (f.bricks || []).forEach((b, k) => { if (b.label && !f.prebuilt) add(cueT(s, b.cue, .1 + k * .08, i) + .4, "pop"); if (b.broken) add(cueT(s, b.broken, .7, i) + .5, "whoosh"); }); }
      else if (s.layout === "daycycle"){ (f.tasks || []).forEach((tk, k) => add(cueT(s, tk.cue, .2 + k * .2, i) + .4, "pop")); }
      else if (s.layout === "search"){ add(cueT(s, f.resultCue, .6, i), f.empty ? "pop" : "chime"); }
      else if (s.layout === "stage"){ (f.actors || []).forEach(a => keyTimes(s, a.keys, i).forEach(k => { if (k.say != null || k.emote === "?" || k.emote === "!" || k.emote === "check") add(k.T, k.emote === "check" ? "chime" : "pop"); if (k.emote === "ring") add(k.T, "ping"); })); }
      else if (s.layout === "kinetic"){ const L = f.lines || []; L.forEach((l, k) => add((k === 0 && !l.cue) ? .1 : cueT(s, l.cue, k / L.length, i), "pop")); }
      else if (s.layout === "sort"){ (f.cards || []).forEach((c, k) => { const tc = cueT(s, c.cue, .15 + k * .2, i); add(tc, "pop"); add(tc + 1.2, "whoosh"); }); }
      else if (s.layout === "stack"){ (f.items || []).forEach((it, k) => add(cueT(s, it.cue, .15 + k * .15, i) + .5, "pop")); }
      else if (s.layout === "split"){ const tS = cueT(s, f.splitCue, .25, i); add(tS, "whoosh"); (f.parts || []).forEach((pt, k) => add(cueT(s, pt.cue, .4 + k * .15, i), "pop")); }
      else if (s.layout === "scale"){ ((f.left && f.left.items) || []).forEach((it, k) => add(cueT(s, it.cue, .2 + k * .1, i) + .4, "pop")); ((f.right && f.right.items) || []).forEach((it, k) => add(cueT(s, it.cue, .5 + k * .1, i) + .4, "pop")); }
      else if (s.layout === "chart"){ add(cueT(s, f.cue, .15, i), "chime"); }
      else if (s.layout === "phone"){ if (f.offCue) add(cueT(s, f.offCue, .6, i), "whoosh"); }
      else if (s.layout === "week"){ (f.items || []).forEach((it, k) => add(cueT(s, it.cue, .12 + k * .08, i), "pop")); if (f.align) add(cueT(s, f.align.cue, .7, i), "chime"); }
      else if (s.layout === "flow"){ const ns = f.nodes || []; ns.forEach((nd, k) => add(cueT(s, nd.cue, k / Math.max(1, ns.length), i), "pop")); }
      else if (TT.sfx[s.layout]){ try { TT.sfx[s.layout](s, f, i, add); } catch (e){ console.error(e); } }
    });
    return ev.sort((a, b) => a.t - b.t);
  };

  /* ---------- Jumat / Sabtu / Minggu pieces: card shapes + whiteboard, receipt and night hooks ---------- */
  const _cardX = card;
  card = function(ctx, th, x, y, w, h, r){
    const cs = th.key === "C" && mv().cardStyle;
    if (cs === "sharp"){ ctx.strokeStyle = hexA(th.accent, .55); ctx.lineWidth = 4; ctx.strokeRect(x + 12, y + 12, w, h);
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = th.ink; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = th.ink; [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([cx, cy]) => ctx.fillRect(cx - 7, cy - 7, 14, 14)); return; }
    if (cs === "coupon"){ ctx.save(); ctx.shadowColor = "rgba(59,36,24,.16)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; rr(ctx, x, y, w, h, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.restore();
      ctx.fillStyle = th.bg; [x, x + w].forEach(cx => { ctx.beginPath(); ctx.arc(cx, y + h / 2, 22, 0, TAU); ctx.fill(); });
      ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = hexA(th.accent, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 300, y + 18); ctx.lineTo(x + 300, y + h - 18); ctx.stroke(); ctx.restore(); return; }
    if (cs === "soft"){ ctx.save(); ctx.shadowColor = "rgba(59,36,24,.14)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 14; rr(ctx, x, y, w, h, 48); ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fill(); ctx.restore(); return; }
    return _cardX(ctx, th, x, y, w, h, r);
  };
  const _hookX = R.hook;
  R.hook = (ctx, th, s, t, T, first) => {
    const hs = th.key === "C" && mv().hookStyle;
    if (hs !== "whiteboard" && hs !== "receipt" && hs !== "night") return _hookX(ctx, th, s, t, T, first);
    const f = s.f, chips = (f.chips || []).slice(0, hs === "receipt" ? 5 : 4), ex = (f.extras || []).slice(0, 2), M = mv();
    ctx.save(); if (first || enter(ctx, "up", t, .05)) headline(ctx, th, f.headline, f.highlight, 318, { maxLines: 3 }); ctx.restore();
    const show = first || t > .12;
    if (hs === "whiteboard"){
      if (show){
        rr(ctx, 80, 600, 920, 700, 28); ctx.fillStyle = "#CFC6B8"; ctx.fill(); rr(ctx, 98, 618, 884, 664, 18); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        rr(ctx, 300, 1296, 480, 24, 10); ctx.fillStyle = "#B8AE9D"; ctx.fill(); rr(ctx, 360, 1286, 120, 16, 8); ctx.fillStyle = th.accent; ctx.fill();
      }
      const cx = 540, cy = 790;
      if (ex[0] && T.extras[0] != null && t > T.extras[0]){
        font(ctx, 800, 62, th.fam); const tw = ctx.measureText(ex[0].label).width, p = prog(t, T.extras[0], .7);
        ctx.save(); ctx.beginPath(); ctx.rect(cx - tw / 2 - 10, cy - 70, (tw + 20) * p, 110); ctx.clip(); ctx.fillStyle = th.ink; ctx.fillText(ex[0].label, cx - tw / 2, cy + 20); ctx.restore();
        const q = prog(t, T.extras[0] + .7, .5); if (q > 0){ ctx.strokeStyle = th.accent; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(cx, cy - 2, tw / 2 + 50, 80, -.03, -Math.PI * .85, -Math.PI * .85 + TAU * 1.03 * q); ctx.stroke(); }
      }
      const spots = [[250, 1070, -.08], [540, 1130, .05], [830, 1070, -.05], [250, 760, .06]];
      chips.forEach((c, i) => { const [nx, ny, r] = spots[i]; if (T.chips[i] == null || t < T.chips[i]) return;
        const ap = prog(t, T.chips[i], .35); ctx.save(); ctx.strokeStyle = hexA(th.ink, .45); ctx.lineWidth = 4; ctx.setLineDash([12, 10]);
        ctx.beginPath(); ctx.moveTo(cx, cy + 70); ctx.lineTo(cx + (nx - cx) * ap, cy + 70 + (ny - 80 - cy - 70) * ap); ctx.stroke(); ctx.restore();
        ctx.save(); if (enter(ctx, "pop", t, T.chips[i] + .15, nx, ny)){ ctx.translate(nx, ny); ctx.rotate(r);
          ctx.fillStyle = "rgba(59,36,24,.14)"; ctx.fillRect(-112, -66, 236, 150); ctx.fillStyle = [ "#FFE2B8", "#F9CB9C", "#FDE7CF", "#F4A85C"][i % 4]; ctx.fillRect(-120, -76, 236, 150);
          drawRich(ctx, { text: c.label, x: -110, y: -42, maxW: 216, size: 40, weight: 800, fam: th.fam, color: th.ink, accent: th.ink, maxLines: 2, minSize: 26, align: "center", track: -.5 }); }
        ctx.restore(); });
      if (ex[1] && T.extras[1] != null && t > T.extras[1]){ const p = eOut(prog(t, T.extras[1], .3)), sc = 1.8 - .8 * p;
        ctx.save(); ctx.globalAlpha *= p; ctx.translate(800, 1210); ctx.rotate(-.18); ctx.scale(sc, sc); font(ctx, 800, 46, th.fam); spacing(ctx, 3);
        const lb = ex[1].label.toUpperCase(), w = ctx.measureText(lb).width + 50; rr(ctx, -w / 2, -42, w, 84, 12); ctx.strokeStyle = th.accent; ctx.lineWidth = 7; ctx.stroke();
        ctx.fillStyle = th.accent; ctx.textAlign = "center"; ctx.fillText(lb, 0, 16); ctx.textAlign = "left"; spacing(ctx, 0); ctx.restore(); }
    } else if (hs === "receipt"){
      const n = chips.length, shown = chips.filter((c, i) => T.chips[i] != null && t > T.chips[i]).length + (ex[1] && T.extras[1] != null && t > T.extras[1] ? 1.3 : 0);
      if (show){ rr(ctx, 230, 596, 620, 56, 28); ctx.fillStyle = th.ink; ctx.fill(); rr(ctx, 270, 618, 540, 12, 6); ctx.fillStyle = "#18150f"; ctx.fill(); }
      const LH = n > 4 ? 78 : 92, target = 150 + shown * LH, len = Math.min(target, 150 + (n + 1.3) * LH) * Math.min(1, show ? .4 + prog(t, .1, .6) * .6 : 0);
      if (len > 0){ ctx.save(); ctx.translate(540, 624); ctx.rotate(Math.sin(t * 1.2) * .006); ctx.translate(-540, -624);
        const x0 = 290, w = 500, y0 = 624; ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fillRect(x0 + 10, y0, w, len + 10);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.lineTo(x0 + w, y0 + len); for (let zx = x0 + w; zx > x0; zx -= 25){ ctx.lineTo(zx - 12.5, y0 + len + 14); ctx.lineTo(zx - 25, y0 + len); } ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, len); ctx.clip();
        font(ctx, 800, 32, th.fam); ctx.fillStyle = th.ink; ctx.textAlign = "center"; ctx.fillText("STRUK", 540, y0 + 64); ctx.textAlign = "left";
        if (ex[0] && T.extras[0] != null && t > T.extras[0]){ font(ctx, 600, 26, th.fam); ctx.fillStyle = th.muted; ctx.textAlign = "center"; ctx.fillText(ex[0].label, 540, y0 + 102); ctx.textAlign = "left"; }
        ctx.setLineDash([8, 8]); ctx.strokeStyle = hexA(th.ink, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 30, y0 + 128); ctx.lineTo(x0 + w - 30, y0 + 128); ctx.stroke(); ctx.setLineDash([]);
        chips.forEach((c, i) => { if (T.chips[i] == null) return; ctx.save(); if (enter(ctx, "left", t, T.chips[i])){ const ly = y0 + 190 + i * LH;
          font(ctx, 600, 36, th.fam); ctx.fillStyle = th.ink; ctx.fillText(c.label, x0 + 36, ly); if (c.amount){ font(ctx, 700, 36, th.fam); const aw = ctx.measureText(c.amount).width; ctx.fillText(c.amount, x0 + w - 36 - aw, ly); } }
          ctx.restore(); });
        if (ex[1] && T.extras[1] != null && t > T.extras[1]){ const ly = y0 + 190 + n * LH; ctx.setLineDash([8, 8]); ctx.strokeStyle = hexA(th.ink, .35); ctx.beginPath(); ctx.moveTo(x0 + 30, ly - 50); ctx.lineTo(x0 + w - 30, ly - 50); ctx.stroke(); ctx.setLineDash([]);
          ctx.save(); if (enter(ctx, "pop", t, T.extras[1], 540, ly)){ font(ctx, 800, 44, th.fam); ctx.fillStyle = th.accent; ctx.textAlign = "center"; ctx.fillText(ex[1].label, 540, ly + 12); ctx.textAlign = "left"; } ctx.restore(); }
        ctx.restore(); ctx.restore(); }
    } else { // night
      if (show){ const g = ctx.createLinearGradient(0, 600, 0, 1320); g.addColorStop(0, "#2A1A12"); g.addColorStop(1, "#5A3320"); rr(ctx, 90, 600, 900, 720, 48); ctx.fillStyle = g; ctx.fill();
        ctx.save(); rr(ctx, 90, 600, 900, 720, 48); ctx.clip();
        for (const p of M.parts){ const sx = 110 + (p.x % 860), sy = 620 + (p.y % 680), a = .35 + .5 * Math.max(0, Math.sin(t * 2 + p.ph)); ctx.globalAlpha = a; ctx.fillStyle = "#FFF7EE"; ctx.beginPath(); ctx.arc(sx, sy, 2 + p.k, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(860, 700, 56, 0, TAU); ctx.fillStyle = "#F4A85C"; ctx.fill(); ctx.beginPath(); ctx.arc(884, 682, 52, 0, TAU); ctx.fillStyle = "#3A2216"; ctx.fill();
        const parse = (l, d) => { const m = /(\d{1,2})[.:](\d{2})/.exec(l || ""); return m ? +m[1] * 60 + +m[2] : d; };
        let m0 = parse(ex[0] && ex[0].label, 23 * 60), m1 = parse(ex[1] && ex[1].label, 24 * 60 + 30); if (m1 < m0) m1 += 24 * 60;
        const t0 = T.extras[0] ?? .5, t1 = T.extras[1] ?? 6, mm = m0 + (m1 - m0) * clamp((t - t0) / Math.max(.5, t1 - t0), 0, 1);
        const cx = 540, cy = 890, R0 = 170; ctx.beginPath(); ctx.arc(cx, cy, R0 + 14, 0, TAU); ctx.fillStyle = hexA("#F4A85C", .25); ctx.fill(); ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.fillStyle = "#FFF7EE"; ctx.fill();
        ctx.strokeStyle = th.ink; for (let k = 0; k < 12; k++){ const a = k * TAU / 12; ctx.lineWidth = k % 3 ? 4 : 8; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R0 - 18), cy + Math.sin(a) * (R0 - 18)); ctx.lineTo(cx + Math.cos(a) * (R0 - 40), cy + Math.sin(a) * (R0 - 40)); ctx.stroke(); }
        const hand = (ang, len, wd, c) => { ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ang) * len, cy - Math.cos(ang) * len); ctx.stroke(); };
        hand(((mm / 60) % 12) / 12 * TAU, 95, 14, th.ink); hand((mm % 60) / 60 * TAU, 140, 9, th.accent); ctx.beginPath(); ctx.arc(cx, cy, 12, 0, TAU); ctx.fillStyle = th.ink; ctx.fill();
        const hh = Math.floor(mm / 60) % 24, mi = Math.floor(mm % 60); font(ctx, 800, 58, th.fam); ctx.fillStyle = "#FFF7EE"; ctx.textAlign = "center";
        ctx.fillText(`${String(hh).padStart(2, "0")}.${String(mi).padStart(2, "0")}`, cx, cy + R0 + 80); ctx.textAlign = "left";
        chips.forEach((c, i) => { ctx.save(); const [nx, ny] = [[120, 1192], [560, 1192], [330, 1272]][i % 3];
          if (T.chips[i] != null && enter(ctx, "pop", t, T.chips[i], nx + 170, ny)){ ctx.translate(0, Math.sin(t * 1.5 + i) * 5); font(ctx, 700, 32, th.fam); const w = ctx.measureText(c.label).width + 110;
            rr(ctx, nx, ny - 40, w, 80, 40); ctx.fillStyle = "rgba(255,247,238,.95)"; ctx.fill(); ctx.beginPath(); ctx.arc(nx + 42, ny, 24, 0, TAU); ctx.fillStyle = th.accent; ctx.fill();
            icon(ctx, c.icon || "phone", nx + 28, ny - 14, 28, "#fff", 2.4); ctx.fillStyle = th.ink; ctx.fillText(c.label, nx + 80, ny + 11); }
          ctx.restore(); });
        ctx.restore(); }
    }
  };

  /* ---------- "Ruang Chat" pieces: bubble cards, chat-window hook ---------- */
  function bubble(ctx, x, y, w, h, side, fill, stroke){
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 34);
    if (side === "left"){ ctx.moveTo(x + 10, y + h - 30); ctx.lineTo(x - 18, y + h + 4); ctx.lineTo(x + 46, y + h - 2); }
    else if (side === "right"){ ctx.moveTo(x + w - 10, y + h - 30); ctx.lineTo(x + w + 18, y + h + 4); ctx.lineTo(x + w - 46, y + h - 2); }
    ctx.fillStyle = fill; ctx.fill(); if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
  }
  const _cardB = card;
  card = function(ctx, th, x, y, w, h, r){
    if (th.key !== "C" || mv().cardStyle !== "bubble") return _cardB(ctx, th, x, y, w, h, r);
    ctx.save(); ctx.translate(6, 12); bubble(ctx, x, y, w, h, "left", "rgba(59,36,24,.10)"); ctx.restore();
    bubble(ctx, x, y, w, h, "left", "#FFFFFF", "rgba(59,36,24,.10)");
  };
  function ticks(ctx, x, y, c){ ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + 8, y + 8); ctx.lineTo(x + 22, y - 8); ctx.moveTo(x + 14, y + 8); ctx.lineTo(x + 30, y - 8); ctx.stroke(); ctx.restore(); }
  const _hookChat = R.hook;
  R.hook = (ctx, th, s, t, T, first) => {
    if (th.key !== "C" || mv().hookStyle !== "chat") return _hookChat(ctx, th, s, t, T, first);
    const f = s.f, chips = (f.chips || []).slice(0, 3), ex = (f.extras || []).slice(0, 2), kinds = ["out", "sys", "in"];
    ctx.save(); if (first || enter(ctx, "up", t, .05)) headline(ctx, th, f.headline, f.highlight, 318, { maxLines: 3 }); ctx.restore();
    const x0 = 90, y0 = 600, w = 900, h = 740;
    ctx.save(); if (first || enter(ctx, "up", t, .12)){
      ctx.fillStyle = "rgba(59,36,24,.12)"; rr(ctx, x0 + 8, y0 + 14, w, h, 40); ctx.fill();
      rr(ctx, x0, y0, w, h, 40); ctx.fillStyle = "#FBF3E9"; ctx.fill(); ctx.save(); ctx.clip();
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x0, y0, w, 112); ctx.fillStyle = "rgba(59,36,24,.08)"; ctx.fillRect(x0, y0 + 112, w, 2);
      ctx.beginPath(); ctx.arc(x0 + 70, y0 + 56, 34, 0, TAU); ctx.fillStyle = th.accent; ctx.fill(); icon(ctx, "users", x0 + 50, y0 + 36, 40, "#fff", 2.2);
      font(ctx, 700, 36, th.fam); ctx.fillStyle = th.ink; ctx.fillText((ex[0] && ex[0].label) || "Grup", x0 + 124, y0 + 68);
      ctx.fillStyle = th.muted; for (let k = 0; k < 3; k++){ ctx.beginPath(); ctx.arc(x0 + w - 50, y0 + 38 + k * 18, 4.5, 0, TAU); ctx.fill(); }
      let y = y0 + 150;
      chips.forEach((c, i) => { const kind = c.kind || kinds[i] || "in";
        if (kind === "in" && T.chips[i] != null && t > T.chips[i] - 1.1 && t < T.chips[i]){ // typing…
          bubble(ctx, x0 + 40, y, 150, 80, "left", "#FFFFFF"); ctx.fillStyle = th.muted;
          for (let d = 0; d < 3; d++){ ctx.globalAlpha = .35 + .6 * Math.max(0, Math.sin(t * 7 - d)); ctx.beginPath(); ctx.arc(x0 + 82 + d * 33, y + 40, 9, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; }
        ctx.save();
        if (kind === "out"){ font(ctx, 600, 40, th.fam); const tl = c.text ? wrapRich(ctx, c.text, "", 500).map(l => l.map(x => x.w).join(" ")) : null;
          const bw = tl ? Math.min(600, Math.max(...tl.map(l => ctx.measureText(l).width)) + 80) : 600, bh = tl ? tl.length * 52 + 92 : 250, bx = x0 + w - 40 - bw;
          if (enter(ctx, "pop", t, T.chips[i], bx + bw, y + bh)){ bubble(ctx, bx, y, bw, bh, "right", "#FCE1C6");
            if (tl){ font(ctx, 600, 40, th.fam); ctx.fillStyle = th.ink; tl.forEach((l, k) => ctx.fillText(l, bx + 34, y + 56 + k * 52)); }
            else { ctx.fillStyle = "rgba(59,36,24,.22)"; [520, 490, 540, 470, 300].forEach((lw, k) => { rr(ctx, bx + 34, y + 34 + k * 36, lw - 40, 16, 8); ctx.fill(); }); }
            font(ctx, 600, 24, th.fam); ctx.fillStyle = th.muted; ctx.fillText("07.45", bx + bw - 140, y + bh - 22); ticks(ctx, bx + bw - 64, y + bh - 30, ex[1] && T.extras[1] != null && t > T.extras[1] ? "#9A6A50" : th.accent); }
          ctx.restore();
          if (ex[1] && enter(ctx, "fade", t, T.extras[1])){ ctx.save(); icon(ctx, "clock", x0 + w - 330, y + bh + 22, 30, th.muted, 2.2); font(ctx, 600, 28, th.fam); ctx.fillStyle = th.muted; ctx.fillText(ex[1].label, x0 + w - 290, y + bh + 47); ctx.restore(); }
          y += bh + (ex[1] ? 90 : 40); return; }
        if (kind === "sys"){ if (enter(ctx, "pop", t, T.chips[i], 540, y + 30)){ font(ctx, 700, 28, th.fam); const lw = ctx.measureText(c.label).width + 56;
            rr(ctx, 540 - lw / 2, y, lw, 56, 28); ctx.fillStyle = "rgba(59,36,24,.10)"; ctx.fill(); ctx.fillStyle = th.muted; ctx.textAlign = "center"; ctx.fillText(c.label, 540, y + 38); ctx.textAlign = "left"; }
          ctx.restore(); y += 90; return; }
        if (enter(ctx, "pop", t, T.chips[i], x0 + 40, y + 100)){ font(ctx, 700, 44, th.fam); const bw = ctx.measureText(c.label).width + 80;
          bubble(ctx, x0 + 40, y, bw, 100, "left", "#FFFFFF"); ctx.fillStyle = th.ink; ctx.fillText(c.label, x0 + 80, y + 64); }
        ctx.restore(); y += 130; });
      ctx.restore();
    } ctx.restore();
  };

  /* ---------- "Papan Tugas" pieces: sticky-note cards, checklist hook, checkbox steps ---------- */
  function tape(ctx, x, y, w, rot){ ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "rgba(244,168,92,.62)"; ctx.fillRect(-w / 2, -16, w, 32); ctx.restore(); }
  const _card = card;
  card = function(ctx, th, x, y, w, h, r){
    if (th.key !== "C" || mv().cardStyle !== "note") return _card(ctx, th, x, y, w, h, r);
    ctx.fillStyle = "rgba(59,36,24,.14)"; ctx.fillRect(x + 10, y + 14, w, h);
    ctx.fillStyle = "#FFF8EC"; ctx.fillRect(x, y, w, h);
    ctx.beginPath(); ctx.moveTo(x + w - 46, y + h); ctx.lineTo(x + w, y + h - 46); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fillStyle = "#EFE0CB"; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w - 46, y + h); ctx.lineTo(x + w - 46, y + h - 46); ctx.lineTo(x + w, y + h - 46); ctx.closePath(); ctx.fillStyle = "#F6DDBF"; ctx.fill();
    tape(ctx, x + w / 2, y + 2, 150, -.04);
  };
  function checkMark(ctx, x, y, s, p, color){ if (p <= 0) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = s * .16; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const pts = [[x - s * .32, y + s * .02], [x - s * .08, y + s * .26], [x + s * .36, y - s * .26]]; const L1 = Math.hypot(.24, .24), L2 = Math.hypot(.44, .52), tot = L1 + L2, d = p * tot;
    ctx.beginPath(); ctx.moveTo(...pts[0]); if (d <= L1){ const q = d / L1; ctx.lineTo(pts[0][0] + (pts[1][0] - pts[0][0]) * q, pts[0][1] + (pts[1][1] - pts[0][1]) * q); }
    else { ctx.lineTo(...pts[1]); const q = (d - L1) / L2; ctx.lineTo(pts[1][0] + (pts[2][0] - pts[1][0]) * q, pts[1][1] + (pts[2][1] - pts[1][1]) * q); } ctx.stroke(); ctx.restore(); }
  const _hookC = R.hook;
  R.hook = (ctx, th, s, t, T, first) => {
    if (th.key !== "C" || mv().hookStyle !== "checklist") return _hookC(ctx, th, s, t, T, first);
    const f = s.f, chips = (f.chips || []).slice(0, 4), ex = (f.extras || []).slice(0, 2);
    ctx.save(); if (first || enter(ctx, "up", t, .05)) headline(ctx, th, f.headline, f.highlight, 318, { maxLines: 3 }); ctx.restore();
    const x0 = 110, y0 = 640, w = 760, h = 680;
    ctx.save(); if (first || enter(ctx, "up", t, .15)){
      ctx.translate(x0 + w / 2, y0 + h / 2); ctx.rotate(-.015); ctx.translate(-(x0 + w / 2), -(y0 + h / 2));
      ctx.fillStyle = "rgba(59,36,24,.14)"; ctx.fillRect(x0 + 12, y0 + 16, w, h); ctx.fillStyle = "#FFFDF8"; ctx.fillRect(x0, y0, w, h);
      ctx.strokeStyle = "rgba(160,82,45,.16)"; ctx.lineWidth = 2; for (let ly = y0 + 120; ly < y0 + h; ly += 110){ ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x0 + w, ly); ctx.stroke(); }
      ctx.strokeStyle = hexA(th.accent, .55); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 96, y0); ctx.lineTo(x0 + 96, y0 + h); ctx.stroke();
      for (let k = 0; k < 6; k++){ ctx.beginPath(); ctx.arc(x0 + 40 + k * 136, y0 - 2, 12, 0, TAU); ctx.fillStyle = "#EFE0CB"; ctx.fill(); }
      chips.forEach((c, i) => { const ly = y0 + 120 + i * 110 - 54; ctx.save();
        if (enter(ctx, "left", t, T.chips[i])){
          rr(ctx, x0 + 130, ly + 14, 56, 56, 12); ctx.strokeStyle = th.ink; ctx.lineWidth = 5; ctx.stroke();
          const cp = c.check === false ? 0 : prog(t, T.chips[i] + .45, .35); if (cp > 0){ rr(ctx, x0 + 130, ly + 14, 56, 56, 12); ctx.fillStyle = hexA(th.accent, .9 * Math.min(1, cp * 2)); ctx.fill(); checkMark(ctx, x0 + 158, ly + 42, 50, cp, "#fff"); }
          font(ctx, 700, 46, th.fam); ctx.fillStyle = th.ink; ctx.fillText(c.label, x0 + 216, ly + 58);
          if (cp >= 1){ const sw = ctx.measureText(c.label).width; ctx.strokeStyle = hexA(th.ink, .5); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + 212, ly + 42); ctx.lineTo(x0 + 212 + sw * Math.min(1, prog(t, T.chips[i] + .8, .3)), ly + 42); ctx.stroke(); }
        }
        ctx.restore(); });
    } ctx.restore();
    ex.forEach((e, i) => { ctx.save(); const cx = i ? 770 : 800, cy = i ? 1240 : 700, r = i ? .06 : -.08, nw = 300;
      if (enter(ctx, "pop", t, T.extras[i], cx, cy)){ ctx.translate(cx, cy + Math.sin(t * 1.6 + i) * 4); ctx.rotate(r);
        ctx.fillStyle = "rgba(59,36,24,.16)"; ctx.fillRect(-nw / 2 + 8, -80, nw, 170); ctx.fillStyle = i ? "#F4A85C" : "#FFE2B8"; ctx.fillRect(-nw / 2, -90, nw, 170);
        tape(ctx, 0, -90, 120, .05); drawRich(ctx, { text: e.label, x: -nw / 2 + 22, y: -58, maxW: nw - 44, size: 40, weight: 800, fam: th.fam, color: th.ink, accent: th.ink, maxLines: 2, minSize: 28, align: "center", track: -.5 }); }
      ctx.restore(); });
  };
  const _steps = R.steps;
  R.steps = (ctx, th, s, t, T) => {
    if (th.key !== "C" || mv().stepsStyle !== "checkbox") return _steps(ctx, th, s, t, T);
    const f = s.f, steps = (f.steps || []).slice(0, 5);
    ctx.save(); if (enter(ctx, "up", t, .05)) headline(ctx, th, f.headline, f.highlight, 318, { maxLines: 3, maxW: 720 }); ctx.restore();
    ctx.save(); if (f.icon && enter(ctx, "pop", t, .5, 875, 405)){ ctx.translate(0, -Math.abs(Math.sin(t * 2.4)) * 10); icon(ctx, f.icon, 800, 330, 150, th.accent, 2); } ctx.restore();
    const n = steps.length, step = n > 4 ? 150 : 170, y0 = 610;
    ctx.save(); ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fillRect(100, y0 - 30, 880, n * step + 40); ctx.fillStyle = "#FFFDF8"; ctx.fillRect(90, y0 - 40, 880, n * step + 40); tape(ctx, 530, y0 - 40, 170, .03); ctx.restore();
    steps.forEach((st, i) => { const y = y0 + i * step; ctx.save();
      if (enter(ctx, "left", t, T.steps[i], 0, 0, .45)){
        rr(ctx, 130, y + 18, 74, 74, 16); ctx.strokeStyle = th.ink; ctx.lineWidth = 5; ctx.stroke();
        const cp = prog(t, T.steps[i] + .35, .35); if (cp > 0){ rr(ctx, 130, y + 18, 74, 74, 16); ctx.fillStyle = th.accent; ctx.fill(); checkMark(ctx, 167, y + 55, 64, cp, "#fff"); }
        drawRich(ctx, { text: st.label, x: 240, y: y + 24, maxW: 700, size: 52, weight: 700, fam: th.fam, color: th.ink, accent: th.ink, maxLines: 1, minSize: 34, track: -0.5 });
        if (i < n - 1){ ctx.strokeStyle = "rgba(160,82,45,.18)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(130, y + step - 22); ctx.lineTo(930, y + step - 22); ctx.stroke(); }
      }
      ctx.restore(); });
  };

  /* ---------- subtitle styles ---------- */
  const _subtitle = subtitle;
  subtitle = function(ctx, th, text){
    if (!text) return;
    const M = mv(), st = M.sub || "chip";
    if (SUB_Q2[st]) return SUB_Q2[st](ctx, th, text, M);
    if (st === "chip" || th.key !== "C") return _subtitle(ctx, th, text);
    font(ctx, 600, 42, th.fam);
    const lines = wrapRich(ctx, text, "", 820).map(l => l.map(x => x.w).join(" ")).slice(0, 3);
    const y0 = 1400, lh = 58;
    if (st === "bar"){
      rr(ctx, 40, y0 - 18, W - 80, lines.length * lh + 34, 22); ctx.fillStyle = "rgba(24,21,15,.9)"; ctx.fill();
      rr(ctx, 40, y0 - 18, 10, lines.length * lh + 34, 5); ctx.fillStyle = th.accent; ctx.fill();
      ctx.fillStyle = "#FAF8F3"; lines.forEach((l, i) => ctx.fillText(l, 90, y0 + 42 + i * lh)); return;
    }
    if (st === "bubble"){
      const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 56, h = lines.length * lh + 30;
      rr(ctx, 70, y0 - 16, w, h, 34); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = th.ink; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(110, y0 - 16 + h - 2); ctx.lineTo(96, y0 + h + 16); ctx.lineTo(146, y0 - 16 + h - 2); ctx.closePath(); ctx.fillStyle = "#FFFFFF"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(110, y0 - 16 + h); ctx.lineTo(96, y0 + h + 16); ctx.lineTo(146, y0 - 16 + h); ctx.stroke();
      ctx.fillStyle = th.ink; lines.forEach((l, i) => ctx.fillText(l, 98, y0 + 40 + i * lh)); return;
    }
    if (st === "tape"){
      const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 70, h = lines.length * lh + 26, x = (W - w) / 2;
      ctx.save(); ctx.translate(540, y0 + h / 2 - 12); ctx.rotate(-.012); ctx.translate(-540, -(y0 + h / 2 - 12));
      ctx.fillStyle = "rgba(59,36,24,.14)"; ctx.fillRect(x + 8, y0 - 6, w, h); ctx.fillStyle = "#FFFDF8"; ctx.fillRect(x, y0 - 14, w, h);
      tape(ctx, x + 10, y0 - 14, 90, -.5); tape(ctx, x + w - 10, y0 - 14, 90, .5);
      ctx.fillStyle = th.ink; lines.forEach((l, i) => { const lw2 = ctx.measureText(l).width; ctx.fillText(l, (W - lw2) / 2, y0 + 36 + i * lh); }); ctx.restore(); return;
    }
    let y = y0;
    for (const l of lines){
      const w = ctx.measureText(l).width, x = (W - w) / 2;
      if (st === "accent"){ rr(ctx, x - 18, y, w + 36, 58, 14); ctx.fillStyle = th.accent; ctx.fill(); ctx.fillStyle = "#FFFFFF"; }
      else if (st === "soft"){ rr(ctx, x - 22, y, w + 44, 58, 29); ctx.fillStyle = "rgba(255,255,255,.72)"; ctx.fill(); ctx.fillStyle = th.ink; }
      else { rr(ctx, x - 14, y, w + 28, 56, 10); ctx.fillStyle = th.subBg; ctx.fill(); ctx.fillStyle = th.subInk; }
      ctx.fillText(l, x, y + 42); y += lh;
    }
  };

  /* ---------- entrances ---------- */
  const _enter = enter;
  enter = function(ctx, kind, t, start, cx, cy, dur){
    if (start == null) return true;
    G.enterStart = start;
    const k = mv().enter[kind] || kind;
    if (k === kind) return _enter(ctx, kind, t, start, cx, cy, dur);
    const p = prog(t, start, dur || .55);
    if (p <= 0) return false;
    const px = cx ?? 540, py = cy ?? 620;
    if (k === "rise"){ ctx.globalAlpha *= eOut(p); ctx.translate(0, 90 * (1 - eBack(p))); }
    else if (k === "drop"){ ctx.globalAlpha *= eOut(p); ctx.translate(0, -70 * (1 - eBack(p))); }
    else if (k === "zoom"){ const s = .9 + .1 * eOut(p); ctx.globalAlpha *= eOut(p); ctx.translate(px, py); ctx.scale(s, s); ctx.translate(-px, -py); }
    else if (k === "swing"){ ctx.globalAlpha *= eOut(p); ctx.translate(-140 * (1 - eBack(p)), 0); }
    else if (k === "fromLeft"){ ctx.globalAlpha *= eOut(p); ctx.translate(-110 * (1 - eOut(p)), 0); }
    else if (k === "spring"){ const s = .3 + .7 * eElastic(p); ctx.globalAlpha *= clamp(p * 2.2, 0, 1); ctx.translate(px, py); ctx.scale(s, s); ctx.translate(-px, -py); }
    else if (k === "flip"){ const s = Math.max(.02, eBack(p)); ctx.globalAlpha *= clamp(p * 2, 0, 1); ctx.translate(px, py); ctx.scale(1, s); ctx.translate(-px, -py); }
    else if (k === "spin"){ const s = .5 + .5 * eBack(p); ctx.globalAlpha *= clamp(p * 2, 0, 1); ctx.translate(px, py); ctx.rotate(-.45 * (1 - eOut(p))); ctx.scale(s, s); ctx.translate(-px, -py); }
    else if (k === "float"){ const q = prog(t, start, (dur || .55) * 1.4); ctx.globalAlpha *= eOut(q); ctx.translate(0, 46 * (1 - eOut(q))); }
    else if (k === "bloom"){ const s = .84 + .16 * eOut(p); ctx.globalAlpha *= eOut(p); ctx.translate(px, py); ctx.scale(s, s); ctx.translate(-px, -py); }
    else if (k === "slideR"){ ctx.globalAlpha *= eOut(p); ctx.translate(110 * (1 - eOut(p)), 0); }
    else if (k === "unfold"){ const s = Math.max(.02, eOut(p)); ctx.globalAlpha *= clamp(p * 2, 0, 1); ctx.translate(px, py); ctx.scale(s, 1); ctx.translate(-px, -py); }
    else if (k === "stamp"){ const s = 1 + .32 * (1 - eOut(p)); ctx.globalAlpha *= clamp(p * 3, 0, 1); ctx.translate(px, py); ctx.scale(s, s); ctx.translate(-px, -py); }
    else ctx.globalAlpha *= p;
    return true;
  };

  /* ---------- rich text: per-word reveal + animated highlight ---------- */
  // highlight marks of the kuartal 2 styles (gr = word group on a line, y = baseline, p = progress)
  const MARK_Q2 = {
    scribble(ctx, gr, y, size, p, c){ const W0 = gr.x2 - gr.x1, lw = Math.max(5, size * .07), yb = y + size * .13, p1 = clamp(p * 1.6, 0, 1), p2 = clamp(p * 1.6 - .6, 0, 1);
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(gr.x1 - 8, yb + 4); ctx.quadraticCurveTo(gr.x1 + W0 * p1 * .5, yb - 8, gr.x1 - 8 + (W0 + 16) * p1, yb);
      if (p2 > 0){ ctx.moveTo(gr.x1 + 12, yb + lw * 2.2); ctx.quadraticCurveTo(gr.x1 + W0 * p2 * .5, yb + lw * .8, gr.x1 + 12 + (W0 - 6) * p2, yb + lw * 1.6); } ctx.stroke(); },
    wavy(ctx, gr, y, size, p, c){ const W0 = (gr.x2 - gr.x1) * p, yb = y + size * .15, A = size * .05, k = TAU / (size * .5);
      ctx.strokeStyle = c; ctx.lineWidth = Math.max(5, size * .065); ctx.lineCap = "round"; ctx.beginPath(); for (let x = 0; x <= W0; x += 4) ctx.lineTo(gr.x1 + x, yb + Math.sin(x * k) * A); ctx.stroke(); },
    box(ctx, gr, y, size, p, c){ const x = gr.x1 - 16, yt = y - size * .84, w = gr.x2 - gr.x1 + 32, h = size * 1.06, L = 2 * (w + h);
      ctx.strokeStyle = c; ctx.lineWidth = Math.max(4, size * .055); ctx.lineJoin = "round"; ctx.setLineDash([L * p, L]); rr(ctx, x, yt, w, h, size * .16); ctx.stroke(); ctx.setLineDash([]); },
    bracket(ctx, gr, y, size, p, c){ const o = 26 * (1 - p), x1 = gr.x1 - 14 - o, x2 = gr.x2 + 14 + o, y1 = y - size * .84 - o * .5, y2 = y + size * .2 + o * .5, l = size * .26;
      ctx.globalAlpha *= p; ctx.fillStyle = hexA(c.startsWith("#") ? c : "#C2691F", .1); ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.strokeStyle = c; ctx.lineWidth = Math.max(5, size * .06); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
      ctx.moveTo(x1, y1 + l); ctx.lineTo(x1, y1); ctx.lineTo(x1 + l, y1); ctx.moveTo(x2 - l, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + l);
      ctx.moveTo(x1, y2 - l); ctx.lineTo(x1, y2); ctx.lineTo(x1 + l, y2); ctx.moveTo(x2 - l, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - l); ctx.stroke(); },
    arrow(ctx, gr, y, size, p, c){ const W0 = (gr.x2 - gr.x1 + 30) * p, yb = y + size * .16, xe = gr.x1 + W0, lw = Math.max(6, size * .07);
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(gr.x1, yb); ctx.lineTo(xe, yb);
      if (p > .7){ const a = size * .2 * clamp((p - .7) / .3, 0, 1); ctx.moveTo(xe - a, yb - a * .8); ctx.lineTo(xe, yb); ctx.lineTo(xe - a, yb + a * .8); } ctx.stroke(); },
  };
  drawRich = function(ctx, o){
    const M = mv();
    let size = o.size, lines;
    for (;;){
      font(ctx, o.weight || 800, size, o.fam); spacing(ctx, o.track ?? -size * 0.03);
      lines = wrapRich(ctx, o.text || "", o.hl, o.maxW);
      const widest = Math.max(...lines.map(l => l.reduce((a, x, i) => a + ctx.measureText(x.w).width + (i ? ctx.measureText(" ").width : 0), 0)));
      if ((lines.length <= (o.maxLines || 3) && widest <= o.maxW + 1) || size <= (o.minSize || 40)) break;
      size -= 4;
    }
    const kinetic = size >= 76 && G.enterStart != null;
    const base = G.enterStart ?? 0, lt = G.lt;
    const nWords = lines.reduce((a, l) => a + l.length, 0);
    const markP = o.hl ? eOut(prog(lt, base + .3 + nWords * .07, .55)) : 0;
    const lh = size * (o.lh || 1.06); let y = o.y, k = 0;
    ctx.textBaseline = "alphabetic";
    const sp = ctx.measureText(" ").width;
    for (const l of lines){
      const lw = l.reduce((a, x, i) => a + ctx.measureText(x.w).width + (i ? sp : 0), 0);
      let x = o.align === "center" ? o.x + (o.maxW - lw) / 2 : o.x;
      y += size * 0.86;
      const pos = l.map((wd, i) => { if (i) x += sp; const w = ctx.measureText(wd.w).width, r = { x, w, wd }; x += w; return r; });
      // highlight groups on this line
      if (markP > 0){
        let g = null; const groups = [];
        pos.forEach(p => { if (p.wd.hl){ if (g) g.x2 = p.x + p.w; else { g = { x1: p.x, x2: p.x + p.w }; groups.push(g); } } else g = null; });
        for (const gr of groups){
          const w = (gr.x2 - gr.x1) * markP; ctx.save();
          if (M.mark === "marker"){ rr(ctx, gr.x1 - 10, y - size * .36, w + 20, size * .48, 10); ctx.fillStyle = hexA(o.accent.startsWith("#") ? o.accent : "#C2691F", .2); ctx.fill(); }
          else if (M.mark === "underline"){ rr(ctx, gr.x1, y + size * .1, w, Math.max(8, size * .09), 6); ctx.fillStyle = o.accent; ctx.fill(); }
          else if (MARK_Q2[M.mark]) MARK_Q2[M.mark](ctx, gr, y, size, markP, o.accent);
          else { const cxm = (gr.x1 + gr.x2) / 2, rx = (gr.x2 - gr.x1) / 2 + 26, ry = size * .58;
            ctx.strokeStyle = o.accent; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath();
            ctx.ellipse(cxm, y - size * .3, rx, ry, -.04, -Math.PI * .9, -Math.PI * .9 + TAU * 1.04 * markP); ctx.stroke(); }
          ctx.restore();
        }
      }
      for (const p of pos){
        ctx.save();
        if (kinetic){
          const wp = prog(lt, base + .06 + k * .07, .42);
          if (wp <= 0){ ctx.restore(); k++; continue; }
          ctx.globalAlpha *= clamp(wp * 1.6, 0, 1);
          if (M.words === "rise") ctx.translate(0, 30 * (1 - eBack(wp)));
          else if (M.words === "slide") ctx.translate(-26 * (1 - eOut(wp)), 0);
          else if (M.words === "drop") ctx.translate(0, -34 * (1 - eBack(wp)));
          else if (M.words === "fade"){ const s = 1.12 - .12 * eOut(wp), cxw = p.x + p.w / 2, cyw = y - size * .3; ctx.globalAlpha *= eOut(wp); ctx.translate(cxw, cyw); ctx.scale(s, s); ctx.translate(-cxw, -cyw); }
          else if (M.words === "tilt"){ ctx.translate(p.x, y); ctx.rotate(-.3 * (1 - eBack(wp))); ctx.translate(-p.x, -y); }
          else { const s = .55 + .45 * eBack(wp), cxw = p.x + p.w / 2, cyw = y - size * .3; ctx.translate(cxw, cyw); ctx.scale(s, s); ctx.translate(-cxw, -cyw); }
        }
        ctx.fillStyle = p.wd.hl ? o.accent : o.color; ctx.fillText(p.wd.w, p.x, y);
        ctx.restore(); k++;
      }
      y += lh - size * 0.86;
    }
    spacing(ctx, 0);
    return { h: y - o.y, size };
  };

  /* ---------- per-layout extras ---------- */
  function star(ctx, x, y, s){ ctx.beginPath(); for (let i = 0; i < 8; i++){ const r = i % 2 ? s * .38 : s, a = i * Math.PI / 4; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
  function before(ctx, th, s, lt, T){
    const M = mv();
    if (s.layout === "cta" && T.logo != null && lt > T.logo){
      for (let k = 0; k < 3; k++){ const q = ((lt - T.logo) * .6 + k / 3) % 1; ctx.strokeStyle = hexA(M.pal[k], .35 * (1 - q)); ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(540, 850, 160 + q * 260, 0, TAU); ctx.stroke(); }
    }
    if (s.layout === "statement" && lt > .3){
      const q = clamp((lt - .3) / .9, 0, 1); ctx.strokeStyle = hexA(th.accent, .5 * (1 - q)); ctx.lineWidth = 7;
      rr(ctx, 400 - q * 70, 470 - q * 70, 280 + q * 140, 220 + q * 140, 34 + q * 30); ctx.stroke();
    }
  }
  function after(ctx, th, s, lt, T){
    const M = mv();
    if (s.layout === "statement" && lt > .55){
      const a = clamp((lt - .55) / .4, 0, 1);
      for (let k = 0; k < 3; k++){ const ang = lt * .7 + k * TAU / 3; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = M.pal[k];
        star(ctx, 540 + Math.cos(ang) * 230, 580 + Math.sin(ang) * 170, 16 + Math.sin(lt * 3 + k) * 4); ctx.restore(); }
    }
    if (s.layout === "steps" && T.steps){
      const n = T.steps.length, step = n > 4 ? 155 : 180; let j = -1; T.steps.forEach((ts, i) => { if (lt >= ts) j = i; });
      if (j >= 0){ const q = ((lt - T.steps[j]) * 1.1) % 1; ctx.strokeStyle = hexA(th.accent, .55 * (1 - q)); ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(165, 600 + j * step + 55, 60 + q * 40, 0, TAU); ctx.stroke(); }
    }
    if (s.layout === "cta" && T.pill != null && lt > T.pill && lt < T.pill + 2.2){
      const dt = lt - T.pill;
      for (const b of M.burst){ const x = 540 + Math.cos(b.a) * b.v * dt, y = 1110 + Math.sin(b.a) * b.v * dt + 900 * dt * dt;
        ctx.save(); ctx.globalAlpha *= clamp(1.6 - dt * .8, 0, 1); ctx.translate(x, y); ctx.rotate(b.vr * dt); ctx.fillStyle = ctx.strokeStyle = M.pal[b.c]; shape(ctx, b.k, b.s); ctx.restore(); }
    }
    if (s.layout === "hook" && lt > .4){
      // a few "?" floating up, for the confusion of the opening situation
      for (let k = 0; k < 3; k++){ const q = ((lt - .4) * .35 + k / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI) * .55;
        font(ctx, 800, 64 + k * 10, th.fam); ctx.fillStyle = M.pal[k]; ctx.fillText("?", [150, 880, 960][k], 1250 - q * 420); ctx.restore(); }
    }
  }

  /* ---------- camera + scenes + transitions ---------- */
  function camera(ctx, i, lt, dur){
    const M = mv(), e = clamp(lt / Math.max(1, dur), 0, 1);
    const mode = M.cam === "drift" || M.cam === "pan" || M.cam === "breathe" ? M.cam : (i % 2 ? (M.cam === "in" ? "out" : "in") : M.cam);
    let s = 1, dx = 0, dy = 0;
    if (mode === "in") s = 1 + .04 * e; else if (mode === "out") s = 1.04 - .04 * e;
    else if (mode === "pan"){ s = 1.03; dx = (i % 2 ? 1 : -1) * (e - .5) * 40; }
    else if (mode === "breathe"){ s = 1.02 + .014 * Math.sin(lt * TAU / 8); }
    else { s = 1.025; dx = (i % 2 ? -1 : 1) * (e - .5) * 30; dy = (.5 - e) * 18; }
    const bob = Math.sin(lt * 1.25 + i * 1.7) * 4;
    ctx.translate(540 + dx, 900 + dy + bob); ctx.scale(s, s); ctx.translate(-540, -900);
  }

  function drawScene(ctx, th, i, t){
    const st = TL.scenes[i], s = P.scenes[i]; if (!s || !st) return;
    const lt = t - st.start, dur = st.end - st.start;
    G.lt = lt; G.scene = i; G.enterStart = null;
    ctx.save(); camera(ctx, i, lt, dur);
    try { before(ctx, th, s, lt, st.T); } catch (e) { console.error(e); }
    try { (R[s.layout] || (() => {}))(ctx, th, s, lt, st.T, i === 0); } catch (e) { console.error(e); }
    try { after(ctx, th, s, lt, st.T); } catch (e) { console.error(e); }
    ctx.restore();
    if (s.layout !== "statement" && s.layout !== "kinetic"){
      let sub = ""; for (const c of st.subs) if (t >= c.t) sub = c.text;
      if (!(s.layout === "cta" && lt > (st.T.head || 99))) subtitle(ctx, th, sub);
    }
  }

  function coverPath(ctx, kind, q, out){
    ctx.beginPath();
    if (kind === "iris"){ const r = q * 1160; if (out){ ctx.rect(0, 0, W, H); ctx.moveTo(540 + r, 960); ctx.arc(540, 960, Math.max(.1, r), 0, TAU, true); } else ctx.arc(540, 960, Math.max(.1, r), 0, TAU); }
    else if (kind === "diamond"){ const d = q * 1600; const dm = (s) => { ctx.moveTo(540, 960 - s); ctx.lineTo(540 + s, 960); ctx.lineTo(540, 960 + s); ctx.lineTo(540 - s, 960); ctx.closePath(); };
      if (out){ ctx.rect(0, 0, W, H); ctx.moveTo(540, 960 - d); ctx.lineTo(540 - d, 960); ctx.lineTo(540, 960 + d); ctx.lineTo(540 + d, 960); ctx.closePath(); } else dm(d); }
    else if (kind === "swipe"){ const L = q * 1500; if (out){ ctx.moveTo(L, 0); ctx.lineTo(1700, 0); ctx.lineTo(1700, H); ctx.lineTo(L - 420, H); } else { ctx.moveTo(-500, 0); ctx.lineTo(L, 0); ctx.lineTo(L - 420, H); ctx.lineTo(-500, H); } ctx.closePath(); }
    else if (kind === "clock"){ const a = Math.max(.001, q * TAU); if (out){ ctx.rect(0, 0, W, H); ctx.moveTo(540, 960); ctx.arc(540, 960, 1300, -Math.PI / 2, -Math.PI / 2 + a, false); ctx.closePath(); }
      else { ctx.moveTo(540, 960); ctx.arc(540, 960, 1300, -Math.PI / 2, -Math.PI / 2 + a); ctx.closePath(); } }
    else if (kind === "slices"){ const nn = 8, sw = W / nn; for (let j = 0; j < nn; j++){ const d = clamp(q * 1.5 - j * .06, 0, 1) * H;
      if (j % 2){ if (out) ctx.rect(j * sw, 0, sw + 1, H - d); else ctx.rect(j * sw, H - d, sw + 1, d); } else { if (out) ctx.rect(j * sw, d, sw + 1, H - d); else ctx.rect(j * sw, 0, sw + 1, d); } } }
    else if (kind === "glitch"){
      const n = 14, hh = H / n;
      for (let j = 0; j < n; j++){ const seed = Math.sin((j + 1) * 12.9898) * 43758.5453, fr = seed - Math.floor(seed), del = fr * .35, qq = clamp((q - del) / (1 - del), 0, 1), w = qq * W * 1.02;
        const fromLeft = j % 2 === 0; if (out){ if (fromLeft) ctx.rect(w, j * hh, W - w + 2, hh + 1); else ctx.rect(0, j * hh, W - w, hh + 1); }
        else { if (fromLeft) ctx.rect(0, j * hh, w, hh + 1); else ctx.rect(W - w, j * hh, w, hh + 1); } }
    }
    else { // bars
      for (let j = 0; j < 6; j++){ const h = clamp(q * 1.6 - j * .12, 0, 1) * H; if (out) ctx.rect(j * 180, h, 181, H - h); else ctx.rect(j * 180, 0, 181, h); }
    }
  }
  function overlay(ctx, kind, p, M, b){
    const front = M.pal[b % 6], back = M.pal[(b + 2) % 6];
    ctx.save();
    if (p < .5){ const q = easeIO(p * 2), q2 = easeIO(clamp((p * 2 - .2) / .8, 0, 1));
      coverPath(ctx, kind, q, false); ctx.fillStyle = back; ctx.fill("evenodd");
      if (q2 > 0){ coverPath(ctx, kind, q2, false); ctx.fillStyle = front; ctx.fill("evenodd"); } }
    else { const q = easeIO((p - .5) * 2), q2 = easeIO(clamp(((p - .5) * 2 - .2) / .8, 0, 1));
      if (q2 < 1){ coverPath(ctx, kind, q2, true); ctx.fillStyle = back; ctx.fill("evenodd"); }
      coverPath(ctx, kind, q, true); ctx.fillStyle = front; ctx.fill("evenodd"); }
    if (p > .38 && p < .62){ // brand flash at full cover
      const a = 1 - Math.abs(p - .5) / .12; ctx.globalAlpha = clamp(a, 0, 1); ctx.fillStyle = "#FFF7EE"; star(ctx, 540, 960, 70); }
    ctx.restore();
  }
  function moved(ctx, th, i, t, kind, e, isNew){
    ctx.save();
    if (kind === "page"){ const dx = isNew ? (1 - e) * 1080 : -e * 1080; ctx.translate(dx, 0); ctx.globalAlpha *= isNew ? clamp(e * 1.6, 0, 1) : clamp((1 - e) * 1.6, 0, 1); }
    else if (kind === "push"){ ctx.beginPath(); ctx.rect(0, 300, W, H - 300); ctx.clip(); const dy = isNew ? (1 - e) * 1250 : -e * 1250; ctx.translate(0, dy); ctx.globalAlpha *= isNew ? clamp(e * 1.6, 0, 1) : clamp((1 - e) * 1.6, 0, 1); }
    else { const s = isNew ? .94 + .06 * e : 1 + .06 * e; ctx.translate(540, 1150); ctx.scale(s, s); ctx.translate(-540, -1150); ctx.globalAlpha *= isNew ? clamp(e * 1.4 - .2, 0, 1) : clamp(1 - e * 1.6, 0, 1); }
    drawScene(ctx, th, i, t); ctx.restore();
  }

  drawFrame = function(ctx, t){
    if (!TL) buildTimeline();
    const th = theme(), M = mv(); ctx.save(); ctx.textAlign = "left"; ctx.globalAlpha = 1;
    let i = TL.scenes.findIndex(st => t < st.end); if (i < 0) i = TL.scenes.length - 1;
    const st = TL.scenes[i], nxt = TL.scenes[i + 1], TD = .56;
    let tr = null;
    if (i > 0 && t - st.start < TD / 2) tr = { b: i, p: .5 + (t - st.start) / TD };
    else if (nxt && nxt.start - t < TD / 2) tr = { b: i + 1, p: .5 - (nxt.start - t) / TD };
    const kind = tr ? M.trans[tr.b % 2] : null;
    G.scene = i; G.lt = t - st.start;
    drawBg(ctx, th, t);
    if (tr && (kind === "push" || kind === "zoom" || kind === "page")){
      const e = easeIO(clamp(tr.p, 0, 1));
      moved(ctx, th, tr.b - 1, t, kind, e, false); moved(ctx, th, tr.b, t, kind, e, true);
      drawChip(ctx, th);
    } else {
      drawScene(ctx, th, i, t);
      drawChip(ctx, th);
      if (tr) (TR_Q2[kind] ? overlayQ2 : overlay)(ctx, kind, clamp(tr.p, 0, 1), M, tr.b);
    }
    ctx.restore();
  };
  Object.assign(TT, { cueT, popS, label, disc, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, room, prop, sceneDur, panel, pill, mv, easeIO, TAU, G, star });
})();

/* =====================================================================================================
   MODE CERITA: "motion": {"mode": "cerita"} in project.json.
   Full-screen cartoon story scenes in the style of story Shorts: toon characters with big round heads
   (TT.toon), a scene camera with zoom/pan/shake/cut (TT.cam), full-screen environments with parallax and
   ambient motion (TT.env / TT.envFront), props (TT.prop), big speech bubbles (TT.bubble), Shorts-style word
   subtitles (1-3 big words following the VO), a title stamp (TT.titleStamp), documentary info cards
   (TT.infoCard), story transitions (whip, zoom, iris, fade, cut) and a small header/footer.
   Every override below hands over to the previous function unless P.motion.mode === "cerita", so episodes
   without the mode render exactly as before. API notes: see API.md of the cerita work (TT.* below).
   ===================================================================================================== */
(() => {
  'use strict';
  const { cueT, easeIO, TAU, G, star } = TT;
  const isC = () => !!(typeof P !== "undefined" && P && P.motion && P.motion.mode === "cerita");
  const lerp = (a, b, q) => a + (b - a) * q;
  const eIn = x => x * x * x;
  const eEl = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (TAU / 3)) + 1;
  const ORANGE = "#C2691F", BROWN = "#3B2418", CREAM = "#FFF4E6", OUT = "#2B1A12", HL = "#F08C2E", FAM = "Poppins";
  const GROUND = 1640;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const EASE = { io: easeIO, out: eOut, back: eBack, lin: x => x, in: eIn, el: eEl };
  // per-frame state of the cerita renderer
  const CS = { active: false, ov: [], focus: null, focusOf: {}, grade: null, cam: null };
  const CERITA = new Set();

  /* ---------- time helpers ---------- */
  const keyT = (s, k, j, idx) => k.at != null ? +k.at : (k.cue ? cueT(s, k.cue, .1 + j * .12, idx) : 0);
  const sceneStart = () => (TL && TL.scenes[G.scene]) ? TL.scenes[G.scene].start : 0;
  // VO loudness 0..1 at global time gt (drives the lip-flap); without audio: speaking inside the scene's VO span
  function voLevel(gt){
    const A = typeof voAnalysis !== "undefined" ? voAnalysis : null;
    if (A && A.env && A.dur > 0){
      const n = A.env.length, x = gt / A.dur * n - .5, i = Math.floor(x), q = x - i;
      const v = A.env[clamp(i, 0, n - 1)] * (1 - q) + A.env[clamp(i + 1, 0, n - 1)] * q;
      return clamp((v - .42) / .36, 0, 1);
    }
    const st = TL && TL.scenes[G.scene]; return st && gt > st.ss && gt < st.se ? .8 : 0;
  }

  /* ---------- camera ---------- */
  // keys: [{at|cue, x, y, zoom, rot, dur=.9, ease:"io|out|back|lin|in|el", cut:true, on:<toon index|id>, fit, dx, dy, shake:amp, sdur}]
  // o: {handheld=1, push=.004 (zoom per second), shake:[{at|cue, amp, sdur}], resolve(on, t, key) -> [x, y, zoom?]}
  function makeCam(x, y, zoom, rot, sx, sy, t){
    return { x, y, zoom, rot, sx, sy, t,
      apply(ctx, depth){ const d = depth ?? 1, z = 1 + (this.zoom - 1) * d, cx = 540 + (this.x - 540) * d, cy = 960 + (this.y - 960) * d;
        ctx.translate(540 + this.sx, 960 + this.sy); if (this.rot) ctx.rotate(this.rot * d); ctx.scale(z, z); ctx.translate(-cx, -cy); },
      toScreen(wx, wy, depth){ const d = depth ?? 1, z = 1 + (this.zoom - 1) * d, cx = 540 + (this.x - 540) * d, cy = 960 + (this.y - 960) * d;
        const dx = (wx - cx) * z, dy = (wy - cy) * z, r = this.rot * d, c = Math.cos(r), s = Math.sin(r);
        return [540 + this.sx + dx * c - dy * s, 960 + this.sy + dx * s + dy * c]; },
      scale(depth){ return 1 + (this.zoom - 1) * (depth ?? 1); } };
  }
  function cam(s, t, keys, o){
    o = o || {};
    const idx = G.scene, K = (keys || []).map((k, j) => Object.assign({}, k, { T: keyT(s, k, j, idx) })).sort((a, b) => a.T - b.T);
    const tgt = k => { const r = k.on != null && o.resolve ? o.resolve(k.on, t, k) : null;
      return { x: r ? r[0] : k.x, y: r ? r[1] : k.y, zoom: k.zoom != null ? k.zoom : (r && r[2]) || null, rot: k.rot }; };
    let a = { x: 540, y: 960, zoom: 1, rot: 0 }, b = Object.assign({}, a), t0 = 0, d = 0, e = easeIO;
    const val = T => { const q = d > 0 ? e(clamp((T - t0) / d, 0, 1)) : 1; return { x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q), zoom: lerp(a.zoom, b.zoom, q), rot: lerp(a.rot, b.rot, q) }; };
    for (const k of K){ if (t < k.T) break; const cur = val(k.T), g = tgt(k);
      a = cur; b = { x: g.x ?? b.x, y: g.y ?? b.y, zoom: g.zoom ?? b.zoom, rot: g.rot ?? b.rot }; t0 = k.T;
      d = (k.cut || (k.T <= 0 && k.dur == null)) ? 0 : (k.dur ?? .9); e = EASE[k.ease || "io"] || easeIO; }
    const v = val(t), hd = o.handheld ?? 1;
    v.x += Math.sin(t * .63) * 6 * hd; v.y += Math.sin(t * .47 + 1) * 5 * hd; v.rot += Math.sin(t * .37) * .0035 * hd;
    v.zoom *= 1 + (o.push ?? .004) * Math.max(0, t);
    let sx = 0, sy = 0;
    K.concat((o.shake || []).map((k, j) => Object.assign({}, k, { T: keyT(s, k, j, idx), shake: k.amp || k.shake || 18 }))).forEach(k => {
      if (!k.shake) return; const A0 = typeof k.shake === "number" ? k.shake : 18, D = k.sdur || .55, q = (t - k.T) / D; if (q < 0 || q > 1) return;
      const f = A0 * Math.pow(1 - q, 2); sx += Math.sin(t * 73 + k.T * 7) * f; sy += Math.cos(t * 61 + k.T * 3) * f; });
    const c = makeCam(v.x, v.y, v.zoom, v.rot, sx, sy, t); CS.cam = c; return c;
  }
  const CAM0 = makeCam(540, 960, 1, 0, 0, 0, 0);
  function layer(ctx, c, d, fn){ ctx.save(); c.apply(ctx, d); try { fn(); } finally { ctx.restore(); } }

  /* ---------- small drawing helpers ---------- */
  function lg(ctx, x0, y0, x1, y1, stops){ const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
  function rg(ctx, x, y, r0, r1, stops){ const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
  function fillAll(ctx, style){ ctx.fillStyle = style; ctx.fillRect(-4000, -4000, 9080, 9920); }
  function glow(ctx, x, y, r, col, a){ ctx.fillStyle = rg(ctx, x, y, 0, r, [[0, hexA(col, a)], [1, hexA(col, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  function puff(ctx, x, y, s, col, shade){
    ctx.fillStyle = col; ctx.beginPath();
    [[0, 0, 1], [.9, -.45, 1.2], [2, -.15, 1], [2.8, .2, .75], [1.2, .3, 1], [-.7, .3, .7]].forEach(([dx, dy, r]) => { ctx.moveTo(x + dx * 60 * s + r * 55 * s, y + dy * 60 * s); ctx.arc(x + dx * 60 * s, y + dy * 60 * s, r * 55 * s, 0, TAU); });
    ctx.fill(); if (shade){ ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(x + 70 * s, y + 42 * s, 170 * s, 20 * s, 0, 0, TAU); ctx.fill(); }
  }
  function cloudLayer(ctx, c, t, d, n, seed, y0, y1, sc, col, shade, speed){
    layer(ctx, c, d, () => { for (let i = 0; i < n; i++){ const span = 3000, v = speed * (.6 + rnd(seed + i * 3) * .8);
      const x = ((rnd(seed + i) * span + t * v) % span) - 900, y = y0 + rnd(seed + i + 9) * (y1 - y0), s = sc * (.6 + rnd(seed + i + 4) * .8);
      puff(ctx, x, y, s, col, shade); } });
  }
  function birds(ctx, c, t, d, n, seed, y0){
    layer(ctx, c, d, () => { ctx.strokeStyle = "rgba(59,36,24,.55)"; ctx.lineWidth = 4; ctx.lineCap = "round";
      for (let i = 0; i < n; i++){ const span = 2400, x = ((rnd(seed + i) * span + t * (70 + rnd(seed + i + 1) * 40)) % span) - 600, y = y0 + rnd(seed + i + 2) * 220 + Math.sin(t * 1.3 + i) * 14, w = Math.sin(t * 9 + i * 2) * 9, s = 12 + rnd(seed + i + 3) * 8;
        ctx.beginPath(); ctx.moveTo(x - s, y - w); ctx.quadraticCurveTo(x - s * .4, y - s * .4, x, y); ctx.quadraticCurveTo(x + s * .4, y - s * .4, x + s, y - w); ctx.stroke(); } });
  }
  function motes(ctx, t, n, seed, x0, y0, w, h, col, a){
    for (let i = 0; i < n; i++){ const x = x0 + ((rnd(seed + i) * w + Math.sin(t * .4 + i) * 30 + t * 8) % w), y = y0 + ((rnd(seed + i + 7) * h - t * (10 + rnd(i) * 14)) % h + h) % h;
      ctx.globalAlpha = a * (.4 + .6 * Math.abs(Math.sin(t * 1.3 + i))); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 2.5 + rnd(seed + i + 3) * 3.5, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  const SKY = {
    day:   [["0", "#86BFD3"], [".55", "#BFDDDF"], ["1", "#F7E2C2"]],
    dusk:  [["0", "#6F5A86"], [".45", "#D98A78"], ["1", "#F6C98C"]],
    night: [["0", "#0E1330"], [".6", "#2A2346"], ["1", "#5E3B3C"]],
  };
  function sky(ctx, c, t, time, hY, o){
    time = time || "day";
    layer(ctx, c, .06, () => { fillAll(ctx, lg(ctx, 0, -300, 0, hY + 40, SKY[time].map(([a, b]) => [+a, b])));
      if (time === "day"){ glow(ctx, 860, 330, 300, "#FFF5DA", .7); ctx.fillStyle = "#FFF8E8"; ctx.beginPath(); ctx.arc(860, 330, 62, 0, TAU); ctx.fill(); }
      else if (time === "dusk"){ glow(ctx, 760, hY - 120, 520, "#FFC27A", .75); ctx.fillStyle = "#FFD79A"; ctx.beginPath(); ctx.arc(760, hY - 120, 118, 0, TAU); ctx.fill(); }
      else { for (let i = 0; i < 110; i++){ const x = rnd(i + 40) * 2200 - 560, y = rnd(i + 90) * (hY + 100) - 300, tw = .35 + .65 * Math.abs(Math.sin(t * (1 + rnd(i) * 2) + i));
          ctx.globalAlpha = tw * .9; ctx.fillStyle = i % 9 ? "#FFF1DC" : "#F4C27A"; ctx.beginPath(); ctx.arc(x, y, 1.6 + rnd(i + 5) * 2.6, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
        glow(ctx, 800, 360, 260, "#FFE7C0", .35); ctx.fillStyle = "#FFF0D6"; ctx.beginPath(); ctx.arc(800, 360, 70, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(214,190,160,.6)"; [[-22, -14, 13], [18, 10, 10], [-6, 26, 7]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(800 + dx, 360 + dy, r, 0, TAU); ctx.fill(); });
        const sq = (t % 7) / 1.1; if (sq < 1){ const x = 200 + sq * 700, y = 120 + sq * 260; ctx.strokeStyle = lg(ctx, x - 160, y - 60, x, y, [[0, "rgba(255,240,220,0)"], [1, "rgba(255,240,220,.9)"]]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 160, y - 60); ctx.lineTo(x, y); ctx.stroke(); } }
    });
    if (time !== "night"){ const cc = time === "dusk" ? "#F9D9C0" : "#FFFDF8", sh = time === "dusk" ? "rgba(186,110,110,.25)" : "rgba(150,170,190,.22)";
      cloudLayer(ctx, c, t, .1, 4, 11, 80, 480, .9, cc, sh, 9); cloudLayer(ctx, c, t, .22, 3, 31, 300, hY - 250, 1.25, cc, sh, 16); }
  }

  /* ---------- environments ---------- */
  // Each env draws a whole screen in world space (ground y = o.ground, default 1640) with parallax layers.
  const ENV = {}, ENVF = {}, GRADE = {};
  // office / ruang kerja: warm wall, big window with city + clouds, sunbeam with dust, shelf, clock, pendant lamps, wood floor, rug
  ENV.office = (ctx, c, t, o) => {
    const gy = o.ground, night = o.time === "night";
    layer(ctx, c, .3, () => {
      fillAll(ctx, lg(ctx, 0, -200, 0, gy, night ? [[0, "#4A3122"], [1, "#2F1E14"]] : [[0, "#F4DEC1"], [1, "#E5C097"]]));
      ctx.fillStyle = night ? "#3A2416" : "#D8AB7E"; ctx.fillRect(-4000, gy - 470, 9080, 700); ctx.fillStyle = "rgba(59,36,24,.2)"; ctx.fillRect(-4000, gy - 476, 9080, 10);
      [[110, 360, 470, 640], [-760, 360, 470, 640], [1480, 360, 470, 640]].forEach(([x, y, w, h], k) => {
        ctx.save(); rr(ctx, x, y, w, h, 18); ctx.clip();
        ctx.fillStyle = lg(ctx, 0, y, 0, y + h, night ? [[0, "#16203C"], [1, "#4A3550"]] : [[0, "#9DCFDC"], [1, "#F6E2C4"]]); ctx.fillRect(x, y, w, h);
        for (let b = 0; b < 7; b++){ const bx = x + b * 75 - 20, bh = 160 + rnd(b + k * 9) * 260; ctx.fillStyle = night ? "#20223A" : (b % 2 ? "#C9C2B4" : "#D8CDB9"); ctx.fillRect(bx, y + h - bh, 66, bh);
          ctx.fillStyle = night ? "rgba(244,194,122,.8)" : "rgba(255,255,255,.45)"; for (let wy = y + h - bh + 18; wy < y + h - 20; wy += 34) for (let wx = bx + 10; wx < bx + 56; wx += 20) if (!night || rnd(wx * 3 + wy) > .45) ctx.fillRect(wx, wy, 10, 16); }
        if (!night){ const cx = x + ((t * 14 + k * 200) % (w + 300)) - 150; puff(ctx, cx, y + 120, .55, "rgba(255,255,255,.9)"); }
        ctx.restore(); rr(ctx, x, y, w, h, 18); ctx.strokeStyle = "#FFF6EA"; ctx.lineWidth = 22; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h * .42); ctx.lineTo(x + w, y + h * .42); ctx.lineWidth = 12; ctx.stroke();
        ctx.fillStyle = "#EBD5BB"; rr(ctx, x - 30, y + h + 6, w + 60, 26, 8); ctx.fill(); });
      // clock
      const cx = 880, cy = 440; ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.arc(cx, cy, 70, 0, TAU); ctx.fill(); ctx.strokeStyle = BROWN; ctx.lineWidth = 10; ctx.stroke();
      ctx.lineCap = "round"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * .5) * 48, cy - Math.cos(t * .5) * 48); ctx.stroke();
      ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(2 + t * .04) * 30, cy - Math.cos(2 + t * .04) * 30); ctx.stroke();
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(t * 6.28) * 55, cy - Math.cos(t * 6.28) * 55); ctx.stroke();
      // shelf with books
      [640, 860].forEach((sy, r) => { ctx.fillStyle = "#9A5A34"; rr(ctx, 680, sy, 330, 22, 6); ctx.fill();
        for (let b = 0; b < 7; b++){ const bh = 70 + rnd(b + r * 7) * 50, bw = 30 + rnd(b + 3 + r) * 14; ctx.fillStyle = ["#C2691F", "#3B2418", "#E8A55B", "#2F6F73", "#F3D9B5", "#A0522D", "#D98A4E"][(b + r * 3) % 7];
          ctx.save(); ctx.translate(700 + b * 44, sy); if (b === 5) ctx.rotate(.18); rr(ctx, 0, -bh, bw, bh, 4); ctx.fill(); ctx.restore(); } });
    });
    // sunbeam + dust
    layer(ctx, c, .5, () => { if (!night){ ctx.fillStyle = lg(ctx, 200, 400, 700, gy, [[0, "rgba(255,236,196,.42)"], [1, "rgba(255,236,196,0)"]]);
      ctx.beginPath(); ctx.moveTo(130, 380); ctx.lineTo(560, 380); ctx.lineTo(1180, gy + 80); ctx.lineTo(520, gy + 80); ctx.closePath(); ctx.fill(); motes(ctx, t, 26, 3, 180, 400, 800, gy - 400, "#FFF3D6", .8); } });
    // pendant lamps
    layer(ctx, c, .7, () => { [300, 820].forEach((lx, i) => { const sw = Math.sin(t * .9 + i * 2) * .03; ctx.save(); ctx.translate(lx, -900); ctx.rotate(sw);
      ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 1110); ctx.stroke();
      glow(ctx, 0, 1190, night ? 420 : 260, "#FFD9A0", night ? .55 : .3);
      ctx.fillStyle = i ? ORANGE : BROWN; ctx.beginPath(); ctx.moveTo(-26, 1110); ctx.lineTo(26, 1110); ctx.lineTo(70, 1185); ctx.lineTo(-70, 1185); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.ellipse(0, 1188, 30, 11, 0, 0, TAU); ctx.fill(); ctx.restore(); }); });
    // floor
    layer(ctx, c, 1, () => { const fy = gy - 190; ctx.fillStyle = lg(ctx, 0, fy, 0, gy + 500, night ? [[0, "#6B4329"], [1, "#4A2D1B"]] : [[0, "#CF9C6C"], [1, "#B98152"]]); ctx.fillRect(-4000, fy, 9080, 3000);
      ctx.fillStyle = "rgba(59,36,24,.25)"; ctx.fillRect(-4000, fy, 9080, 12);
      ctx.strokeStyle = "rgba(59,36,24,.12)"; ctx.lineWidth = 3; for (let y = fy + 50, k = 0; y < gy + 600; y += 46 + k * 10, k++){ ctx.beginPath(); ctx.moveTo(-4000, y); ctx.lineTo(5080, y); ctx.stroke(); }
      if (o.rug !== false){ ctx.fillStyle = hexA(ORANGE, .55); ctx.beginPath(); ctx.ellipse(o.rugX ?? 540, gy + 20, 430, 78, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(255,244,230,.45)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(o.rugX ?? 540, gy + 20, 380, 60, 0, 0, TAU); ctx.stroke(); }
      if (o.desk !== false && o.desk !== "front") prop(ctx, "desk", o.deskX ?? 800, gy - 40, { s: o.deskS || 1, laptop: true, mug: true, papers: true }, t);
      if (o.plant !== false) prop(ctx, "plant", o.plantX ?? 130, gy - 60, { s: 1.1 }, t); });
  };
  ENVF.office = (ctx, c, t, o) => { if (o.desk === "front") layer(ctx, c, 1, () => prop(ctx, "desk", o.deskX ?? 800, o.ground + 60, { s: o.deskS || 1.15, laptop: true, mug: true, papers: true, back: true }, t)); };
  GRADE.office = { warm: .12, vig: .4 };

  // home / rumah kayu malam: plank wall, night window with curtains, framed picture, swaying pendant lamp, checkered floor
  ENV.home = (ctx, c, t, o) => {
    const gy = o.ground, day = o.time === "day";
    layer(ctx, c, .3, () => {
      fillAll(ctx, "#7A4528");
      for (let x = -1800; x < 2900; x += 96){ const k = Math.round(x / 96); ctx.fillStyle = k % 3 === 0 ? "#83502F" : k % 3 === 1 ? "#764126" : "#7E4A2B"; ctx.fillRect(x, -3000, 92, 6000); ctx.fillStyle = "#4E2A17"; ctx.fillRect(x + 92, -3000, 4, 6000);
        ctx.strokeStyle = "rgba(43,26,18,.16)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 30 + rnd(k) * 30, -200); ctx.bezierCurveTo(x + 10, 500, x + 70, 900, x + 40, 1600); ctx.stroke(); }
      ctx.fillStyle = "#4E2A17"; ctx.fillRect(-4000, 180, 9080, 40); ctx.fillRect(-4000, gy - 230, 9080, 40);
      // window
      const wx = 120, wy = 470, ww = 340, wh = 420; ctx.save(); rr(ctx, wx, wy, ww, wh, 10); ctx.clip();
      ctx.fillStyle = lg(ctx, 0, wy, 0, wy + wh, day ? [[0, "#9DCFDC"], [1, "#F6E2C4"]] : [[0, "#141B38"], [1, "#4A3550"]]); ctx.fillRect(wx, wy, ww, wh);
      if (!day){ for (let i = 0; i < 24; i++){ ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * 1.7 + i)); ctx.fillStyle = "#FFF1DC"; ctx.beginPath(); ctx.arc(wx + rnd(i) * ww, wy + rnd(i + 30) * wh * .7, 2.4, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
        glow(ctx, wx + 230, wy + 120, 120, "#FFE7C0", .4); ctx.fillStyle = "#FFF0D6"; ctx.beginPath(); ctx.arc(wx + 230, wy + 120, 40, 0, TAU); ctx.fill(); }
      ctx.restore(); ctx.strokeStyle = "#4E2A17"; ctx.lineWidth = 20; rr(ctx, wx, wy, ww, wh, 10); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
      [[-1, wx - 10], [1, wx + ww + 10]].forEach(([d, x]) => { const sw = Math.sin(t * .8 + d) * 8; ctx.fillStyle = "#C2691F"; ctx.beginPath(); ctx.moveTo(x, wy - 40); ctx.lineTo(x - d * 90, wy - 40);
        ctx.quadraticCurveTo(x - d * 60 + sw, wy + wh / 2, x - d * 100 + sw, wy + wh + 60); ctx.lineTo(x + d * 10, wy + wh + 60); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(43,26,18,.25)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - d * 45, wy - 30); ctx.quadraticCurveTo(x - d * 30 + sw, wy + wh / 2, x - d * 50 + sw, wy + wh + 50); ctx.stroke(); });
      ctx.fillStyle = "#4E2A17"; rr(ctx, wx - 120, wy - 56, ww + 240, 18, 9); ctx.fill();
      // picture
      ctx.fillStyle = "#3E2213"; rr(ctx, 640, 540, 280, 210, 8); ctx.fill(); ctx.fillStyle = "#F6D9AE"; ctx.fillRect(660, 560, 240, 170);
      ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.moveTo(660, 730); ctx.lineTo(740, 630); ctx.lineTo(800, 690); ctx.lineTo(850, 640); ctx.lineTo(900, 700); ctx.lineTo(900, 730); ctx.fill(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(850, 600, 20, 0, TAU); ctx.fill();
      // low cabinet
      ctx.fillStyle = "#5A321C"; rr(ctx, 700, gy - 420, 300, 230, 10); ctx.fill(); ctx.strokeStyle = "#3E2213"; ctx.lineWidth = 6; ctx.strokeRect(720, gy - 395, 125, 180); ctx.strokeRect(855, gy - 395, 125, 180);
      ctx.fillStyle = "#E8C07A"; ctx.beginPath(); ctx.arc(830, gy - 305, 7, 0, TAU); ctx.arc(870, gy - 305, 7, 0, TAU); ctx.fill();
      ctx.fillStyle = "#2F6F73"; rr(ctx, 760, gy - 470, 70, 50, 8); ctx.fill(); ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 4; k++){ ctx.save(); ctx.translate(795, gy - 470); ctx.rotate(-.8 + k * .5 + Math.sin(t + k) * .05); ctx.beginPath(); ctx.ellipse(0, -36, 11, 36, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    });
    // lamp
    const lx = o.lampX ?? 540, sw = Math.sin(t * .8) * .05;
    layer(ctx, c, .65, () => { ctx.save(); ctx.translate(lx, -1000); ctx.rotate(sw); ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 1330); ctx.stroke();
      ctx.fillStyle = "#3B2418"; ctx.beginPath(); ctx.moveTo(-30, 1330); ctx.quadraticCurveTo(-85, 1340, -95, 1400); ctx.lineTo(95, 1400); ctx.quadraticCurveTo(85, 1340, 30, 1330); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFE9B8"; ctx.beginPath(); ctx.arc(0, 1405, 22, 0, TAU); ctx.fill(); ctx.restore(); });
    // floor
    layer(ctx, c, 1, () => { const fy = gy - 190, vp = fy - 700; ctx.fillStyle = "#E9A866"; ctx.fillRect(-4000, fy, 9080, 3000);
      const rows = [fy]; let h = 30; while (rows[rows.length - 1] < gy + 700){ rows.push(rows[rows.length - 1] + h); h *= 1.22; }
      for (let r = 0; r < rows.length - 1; r++){ const y0 = rows[r], y1 = rows[r + 1];
        for (let k = -16; k < 16; k++){ if ((k + r) % 2) continue; const xa = 540 + (k * 90) * (y0 - vp) / (fy - vp), xb = 540 + ((k + 1) * 90) * (y0 - vp) / (fy - vp), xc = 540 + ((k + 1) * 90) * (y1 - vp) / (fy - vp), xd = 540 + (k * 90) * (y1 - vp) / (fy - vp);
          ctx.fillStyle = "#F6DDB2"; ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xb, y0); ctx.lineTo(xc, y1); ctx.lineTo(xd, y1); ctx.closePath(); ctx.fill(); } }
      ctx.fillStyle = "#4E2A17"; ctx.fillRect(-4000, fy - 14, 9080, 18); });
    // lamp light pool + dust
    layer(ctx, c, .65, () => { ctx.save(); ctx.translate(lx, -1000); ctx.rotate(sw); glow(ctx, 0, 1420, 700, "#FFCF8A", .38);
      ctx.fillStyle = lg(ctx, 0, 1400, 0, 2700, [[0, "rgba(255,220,160,.28)"], [1, "rgba(255,220,160,0)"]]); ctx.beginPath(); ctx.moveTo(-60, 1400); ctx.lineTo(60, 1400); ctx.lineTo(520, 2700); ctx.lineTo(-520, 2700); ctx.closePath(); ctx.fill(); ctx.restore();
      motes(ctx, t, 22, 17, lx - 380, 500, 760, 1100, "#FFE3B0", .7); });
  };
  GRADE.home = { warm: .14, vig: .62 };

  // street / jalan kota: sky, far skyline, shophouses with awnings, lamp posts, sidewalk, road, passing car
  function building(ctx, x, base, w, h, col, k, t, lit){
    ctx.fillStyle = col; ctx.fillRect(x, base - h, w, h); ctx.fillStyle = "rgba(59,36,24,.12)"; ctx.fillRect(x + w - 14, base - h, 14, h);
    ctx.fillStyle = "rgba(59,36,24,.25)"; ctx.fillRect(x - 8, base - h - 16, w + 16, 18);
    const cols = Math.max(2, Math.floor(w / 95)), gap = w / cols;
    for (let r = 0; r < Math.floor((h - 260) / 130); r++) for (let q = 0; q < cols; q++){ const wx = x + q * gap + gap * .22, wy = base - h + 50 + r * 130;
      ctx.fillStyle = lit ? (rnd(k * 31 + r * 7 + q) > .4 ? (Math.sin(t * .7 + k + r * q) > -.8 ? "#F4C27A" : "#8A6A50") : "#2B2238") : "#FFF4E6"; rr(ctx, wx, wy, gap * .56, 80, 6); ctx.fill();
      if (!lit){ ctx.fillStyle = "rgba(124,196,232,.45)"; rr(ctx, wx + 6, wy + 6, gap * .56 - 12, 68, 4); ctx.fill(); } }
    if (!lit){ const aw = base - 250; for (let s = 0; s < Math.ceil(w / 50); s++){ ctx.fillStyle = s % 2 ? "#FFF4E6" : (k % 2 ? ORANGE : "#A0522D"); ctx.beginPath(); ctx.moveTo(x + s * 50, aw); ctx.lineTo(x + Math.min(w, s * 50 + 50), aw); ctx.lineTo(x + Math.min(w, s * 50 + 50) + 10, aw + 60); ctx.lineTo(x + s * 50 + 10, aw + 60); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "#5A3A2A"; rr(ctx, x + w * .3, base - 180, w * .4, 180, [12, 12, 0, 0]); ctx.fill(); ctx.fillStyle = "rgba(255,236,196,.5)"; rr(ctx, x + w * .3 + 12, base - 168, w * .4 - 24, 70, 6); ctx.fill(); }
  }
  ENV.street = (ctx, c, t, o) => {
    const gy = o.ground, time = o.time || "day", night = time === "night", hY = gy - 300;
    sky(ctx, c, t, time, hY, o); if (!night) birds(ctx, c, t, .25, 4, 5, 260);
    layer(ctx, c, .22, () => { for (let i = -6; i < 18; i++){ const w = 110 + rnd(i + 70) * 120, h = 300 + rnd(i + 80) * 420, x = i * 150 - 200; ctx.fillStyle = night ? "#232540" : (i % 2 ? "#CFC5B4" : "#DCCDB6"); ctx.fillRect(x, hY - h + 40, w, h);
      ctx.fillStyle = night ? "rgba(244,194,122,.6)" : "rgba(255,255,255,.35)"; for (let wy = hY - h + 70; wy < hY; wy += 40) for (let wx = x + 14; wx < x + w - 16; wx += 26) if (rnd(wx + wy) > (night ? .55 : .3)) ctx.fillRect(wx, wy, 12, 18); } });
    layer(ctx, c, .55, () => { const base = gy - 140; const COL = ["#E8B98A", "#D9895B", "#EAD2B0", "#C99A6E", "#F0C9A0", "#B9764A"];
      for (let i = -4; i < 9; i++){ const w = 330 + rnd(i + 3) * 60, x = i * 380 - 60, h = 560 + rnd(i + 11) * 300; building(ctx, x, base, w, h, night ? "#3A2C3E" : COL[(i + 8) % 6], i + 8, t, night); }
      for (let i = -3; i < 6; i++){ const x = i * 760 + 190; ctx.fillStyle = "#3B2418"; ctx.fillRect(x - 8, base - 520, 16, 520); ctx.fillRect(x - 8, base - 520, 90, 14);
        ctx.fillStyle = night ? "#FFE3A8" : "#FFF4E6"; ctx.beginPath(); ctx.ellipse(x + 80, base - 500, 26, 14, 0, 0, TAU); ctx.fill(); if (night) glow(ctx, x + 80, base - 470, 260, "#FFD08A", .5); } });
    layer(ctx, c, 1, () => { ctx.fillStyle = night ? "#5B4A4A" : "#E6D2B2"; ctx.fillRect(-4000, gy - 150, 9080, 210); ctx.strokeStyle = "rgba(59,36,24,.13)"; ctx.lineWidth = 3;
      for (let x = -4000; x < 5080; x += 120){ ctx.beginPath(); ctx.moveTo(x, gy - 150); ctx.lineTo(x - 40, gy + 60); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-4000, gy - 60); ctx.lineTo(5080, gy - 60); ctx.stroke();
      ctx.fillStyle = "#B99F82"; ctx.fillRect(-4000, gy + 60, 9080, 26); ctx.fillStyle = night ? "#2E2A30" : "#6E655E"; ctx.fillRect(-4000, gy + 86, 9080, 3000);
      ctx.fillStyle = "#F2E6D0"; for (let x = -4000; x < 5080; x += 220) ctx.fillRect(x, gy + 230, 120, 14);
      const cq = ((t + (o.carOffset || 0)) % 9) / 9, carX = -700 + cq * 2600; carDraw(ctx, carX, gy + 170, night ? "#C2691F" : "#2F6F73", t, night); });
  };
  function carDraw(ctx, x, y, col, t, night){
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(x, y + 52, 210, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = col; rr(ctx, x - 200, y - 40, 400, 90, 30); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 110, y - 40); ctx.lineTo(x - 60, y - 110); ctx.lineTo(x + 80, y - 110); ctx.lineTo(x + 130, y - 40); ctx.fill();
    ctx.fillStyle = "#CFE7EE"; ctx.beginPath(); ctx.moveTo(x - 90, y - 44); ctx.lineTo(x - 52, y - 98); ctx.lineTo(x + 4, y - 98); ctx.lineTo(x + 4, y - 44); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 18, y - 44); ctx.lineTo(x + 18, y - 98); ctx.lineTo(x + 72, y - 98); ctx.lineTo(x + 110, y - 44); ctx.fill();
    [-120, 120].forEach(dx => { ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.arc(x + dx, y + 48, 38, 0, TAU); ctx.fill(); ctx.fillStyle = "#B8AE9D"; ctx.beginPath(); ctx.arc(x + dx, y + 48, 16, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#2B1A12"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + dx, y + 48); ctx.lineTo(x + dx + Math.cos(t * 12) * 16, y + 48 + Math.sin(t * 12) * 16); ctx.stroke(); });
    ctx.fillStyle = night ? "#FFE3A8" : "#FFF4E6"; ctx.beginPath(); ctx.ellipse(x + 192, y - 6, 10, 16, 0, 0, TAU); ctx.fill(); if (night) glow(ctx, x + 260, y, 160, "#FFE3A8", .45);
  }
  GRADE.street = { warm: .13, vig: .36 };

  // park / taman: hills, swaying tree line, big tree, grass, path, flowers, falling leaves, butterflies; front: bushes
  function treeCrown(ctx, x, y, r, col, col2, t, k){
    const sw = Math.sin(t * 1.1 + k) * r * .04; ctx.fillStyle = col; ctx.beginPath();
    [[0, 0, 1], [-.7, .25, .75], [.7, .25, .75], [-.35, -.5, .7], [.4, -.45, .72]].forEach(([dx, dy, rr2]) => { ctx.moveTo(x + dx * r + sw + rr2 * r, y + dy * r); ctx.arc(x + dx * r + sw * (1 - dy), y + dy * r, rr2 * r, 0, TAU); }); ctx.fill();
    ctx.fillStyle = col2; ctx.beginPath(); ctx.arc(x - r * .3 + sw, y - r * .35, r * .38, 0, TAU); ctx.fill();
  }
  ENV.park = (ctx, c, t, o) => {
    const gy = o.ground, time = o.time || "day", hY = gy - 420;
    sky(ctx, c, t, time, hY, o); birds(ctx, c, t, .2, 3, 21, 220);
    layer(ctx, c, .2, () => { ctx.fillStyle = time === "dusk" ? "#C9A07A" : "#B8CB8F"; ctx.beginPath(); ctx.moveTo(-3000, hY + 120); for (let x = -3000; x <= 4000; x += 100) ctx.lineTo(x, hY - 60 - Math.sin(x * .004) * 90 - Math.sin(x * .011) * 30); ctx.lineTo(4000, 3000); ctx.lineTo(-3000, 3000); ctx.fill(); });
    layer(ctx, c, .4, () => { ctx.fillStyle = time === "dusk" ? "#A8875F" : "#9DBB7A"; ctx.fillRect(-4000, hY + 40, 9080, 3000);
      for (let i = -8; i < 16; i++){ const x = i * 150 + rnd(i) * 60, r = 70 + rnd(i + 5) * 40; ctx.fillStyle = "#7A5236"; ctx.fillRect(x - 9, hY - 10, 18, 70); treeCrown(ctx, x, hY - 40 - r * .4, r, i % 2 ? "#7FA563" : "#6E9A58", "rgba(255,255,255,.12)", t, i); } });
    layer(ctx, c, .72, () => { const x = o.treeX ?? 60, by = gy - 240; ctx.fillStyle = "#7A5236"; ctx.beginPath(); ctx.moveTo(x - 40, by); ctx.quadraticCurveTo(x - 20, by - 400, x - 6, by - 620); ctx.lineTo(x + 30, by - 620); ctx.quadraticCurveTo(x + 40, by - 400, x + 60, by); ctx.fill();
      treeCrown(ctx, x + 10, by - 760, 230, "#5F8F4E", "rgba(255,255,255,.14)", t, 3); treeCrown(ctx, x + 180, by - 660, 150, "#6E9A58", "rgba(255,255,255,.12)", t, 4);
      if (o.bench !== false) prop(ctx, "bench", o.benchX ?? 840, gy - 160, { s: .9 }, t); });
    layer(ctx, c, 1, () => { ctx.fillStyle = lg(ctx, 0, gy - 220, 0, gy + 300, time === "dusk" ? [[0, "#B49A62"], [1, "#9C8350"]] : [[0, "#9FC46F"], [1, "#80A95A"]]); ctx.fillRect(-4000, gy - 220, 9080, 3000);
      ctx.fillStyle = "#E6CB9C"; ctx.beginPath(); ctx.moveTo(360, gy - 220); ctx.lineTo(620, gy - 220); ctx.quadraticCurveTo(700, gy + 100, 1100, gy + 400); ctx.lineTo(-100, gy + 400); ctx.quadraticCurveTo(300, gy + 80, 360, gy - 220); ctx.fill();
      for (let i = 0; i < 40; i++){ const x = rnd(i + 200) * 2400 - 700, y = gy - 200 + rnd(i + 300) * 420; if (x > 250 && x < 800 && y < gy + 200) continue; const sw = Math.sin(t * 2 + i) * 4;
        ctx.strokeStyle = "#5E8A44"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sw, y - 26); ctx.stroke(); ctx.fillStyle = ["#FFF4E6", "#F4A85C", "#E98A8A", "#F6D36B"][i % 4]; ctx.beginPath(); ctx.arc(x + sw, y - 30, 8, 0, TAU); ctx.fill(); } });
    layer(ctx, c, 1.1, () => { for (let i = 0; i < 10; i++){ const span = 2300, q = ((t * (30 + rnd(i) * 30) + rnd(i + 9) * span) % span), x = rnd(i + 40) * 1400 - 160 + Math.sin(t * .9 + i) * 70, y = q - 300;
        ctx.save(); ctx.translate(x, y); ctx.rotate(t * (1 + rnd(i)) + i); ctx.fillStyle = i % 3 ? "#E89544" : "#7FA563"; ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      for (let i = 0; i < 2; i++){ const x = 300 + i * 420 + Math.sin(t * .7 + i * 3) * 220, y = 1050 + Math.sin(t * 1.3 + i) * 120, fl = Math.abs(Math.sin(t * 14 + i));
        ctx.fillStyle = i ? "#F4A85C" : "#FFF4E6"; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(x + d * 9 * fl, y, 10 * fl + 2, 13, d * .4, 0, TAU); ctx.fill(); }); } });
  };
  ENVF.park = (ctx, c, t, o) => { if (o.bushes === false) return; layer(ctx, c, 1.3, () => { [[-60, o.ground + 260, 240], [1120, o.ground + 240, 260]].forEach(([x, y, r], k) => treeCrown(ctx, x, y, r, k ? "#557F45" : "#4E7A41", "rgba(255,255,255,.12)", t, k + 7)); }); };
  GRADE.park = { warm: .13, vig: .36 };

  // beach / pantai-laut: sky, sea with sun glitter and a boat, moving wave lines, wet shoreline, sand, palm
  ENV.beach = (ctx, c, t, o) => {
    const gy = o.ground, time = o.time || "day", dusk = time === "dusk", hY = gy - 640;
    sky(ctx, c, t, time, hY, o); birds(ctx, c, t, .22, 3, 41, 300);
    layer(ctx, c, .25, () => { ctx.fillStyle = lg(ctx, 0, hY, 0, gy, dusk ? [[0, "#B7737A"], [1, "#E5A57E"]] : [[0, "#4E9DB1"], [1, "#7CC1C4"]]); ctx.fillRect(-4000, hY, 9080, 3000);
      const sx = dusk ? 760 : 860; for (let i = 0; i < 26; i++){ const y = hY + 10 + i * 14, w = (40 + rnd(i) * 80) * (1 + i * .05), x = sx + Math.sin(t * 2 + i * 1.7) * 30 * (1 + i * .05); ctx.globalAlpha = .55 * (1 - i / 30); ctx.fillStyle = "#FFF1D0"; ctx.fillRect(x - w / 2, y, w, 4); } ctx.globalAlpha = 1;
      const bx = ((t * 18) % 2400) - 600, by = hY - 4; ctx.fillStyle = "#3B2418"; ctx.beginPath(); ctx.moveTo(bx - 60, by); ctx.lineTo(bx + 60, by); ctx.lineTo(bx + 44, by + 18); ctx.lineTo(bx - 44, by + 18); ctx.fill();
      ctx.fillStyle = "#FFF4E6"; ctx.beginPath(); ctx.moveTo(bx, by - 4); ctx.lineTo(bx, by - 110); ctx.lineTo(bx + 56, by - 10); ctx.fill(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(bx - 6, by - 6); ctx.lineTo(bx - 6, by - 90); ctx.lineTo(bx - 50, by - 10); ctx.fill(); });
    layer(ctx, c, .55, () => { ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 5; ctx.lineCap = "round";
      for (let r = 0; r < 9; r++){ const y = hY + 120 + r * r * 9 + r * 30; for (let x = -1600 + ((t * (20 + r * 6) + r * 97) % 260); x < 2700; x += 260){ ctx.globalAlpha = .25 + r * .06; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y - 10, x + 80 + r * 6, y); ctx.stroke(); } } ctx.globalAlpha = 1; });
    layer(ctx, c, 1, () => { const sh = gy - 260 + Math.sin(t * .9) * 18; ctx.fillStyle = lg(ctx, 0, sh, 0, gy + 400, dusk ? [[0, "#E7BF8D"], [1, "#D8A672"]] : [[0, "#F1D7A8"], [1, "#E7C38E"]]); ctx.fillRect(-4000, sh - 30, 9080, 3000);
      ctx.fillStyle = "rgba(120,90,60,.18)"; ctx.fillRect(-4000, sh - 30, 9080, 60);
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.moveTo(-4000, sh - 30); for (let x = -1600; x <= 2700; x += 40) ctx.lineTo(x, sh - 30 + Math.sin(x * .02 + t * 2.4) * 8); ctx.lineTo(2700, sh - 44); ctx.lineTo(-1600, sh - 44); ctx.fill();
      for (let i = 0; i < 14; i++){ const x = rnd(i + 500) * 2400 - 700, y = gy - 150 + rnd(i + 600) * 450; ctx.fillStyle = i % 3 ? "rgba(160,110,70,.3)" : "#F4A85C"; if (i % 3) { ctx.beginPath(); ctx.arc(x, y, 6, 0, TAU); ctx.fill(); } else { ctx.save(); ctx.translate(x, y); star(ctx, 0, 0, 16); ctx.restore(); } } });
    layer(ctx, c, .85, () => { const x = o.palmX ?? 980, by = gy - 120; ctx.strokeStyle = "#8E5A34"; ctx.lineWidth = 40; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, by); ctx.quadraticCurveTo(x - 30, by - 500, x - 140, by - 900); ctx.stroke();
      ctx.strokeStyle = "rgba(59,36,24,.25)"; ctx.lineWidth = 4; for (let k = 0; k < 12; k++){ const q = k / 12, px = lerp(x, x - 140, q * q) - 6, py = by - q * 900; ctx.beginPath(); ctx.moveTo(px - 18, py); ctx.lineTo(px + 18, py - 6); ctx.stroke(); }
      for (let k = 0; k < 7; k++){ const a = -Math.PI + k * .5 + Math.sin(t * 1.2 + k) * .06, L = 300 + (k % 2) * 60; ctx.save(); ctx.translate(x - 140, by - 900); ctx.rotate(a); ctx.fillStyle = k % 2 ? "#5F8F4E" : "#6E9A58";
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * .5, -70, L, 30); ctx.quadraticCurveTo(L * .5, -10, 0, 0); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = "#7A4A2B"; [[-20, 10], [14, 20], [-2, 30]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(x - 140 + dx, by - 900 + dy, 18, 0, TAU); ctx.fill(); }); });
  };
  GRADE.beach = { warm: .12, vig: .34 };

  // sky / langit: day or dusk sky with deep cloud layers and birds; optional low hills (o.hills)
  ENV.sky = (ctx, c, t, o) => {
    const time = o.time || "day", gy = o.ground; sky(ctx, c, t, time, gy + 200, o); birds(ctx, c, t, .35, 5, 61, 500);
    const cc = time === "dusk" ? "#F9D9C0" : "#FFFDF8", sh = time === "dusk" ? "rgba(186,110,110,.28)" : "rgba(150,170,190,.25)";
    cloudLayer(ctx, c, t, .45, 4, 71, 700, 1300, 1.6, cc, sh, 26); cloudLayer(ctx, c, t, .8, 3, 81, 1300, 1800, 2.2, cc, sh, 40);
    if (o.hills) layer(ctx, c, 1, () => { ctx.fillStyle = time === "dusk" ? "#B4865E" : "#9DBB7A"; ctx.beginPath(); ctx.moveTo(-3000, gy); for (let x = -3000; x <= 4000; x += 80) ctx.lineTo(x, gy - 120 - Math.sin(x * .003) * 80); ctx.lineTo(4000, 3000); ctx.lineTo(-3000, 3000); ctx.fill(); });
  };
  ENVF.sky = (ctx, c, t, o) => { const cc = (o.time || "day") === "dusk" ? "#FBE3CF" : "#FFFFFF"; if (o.frontClouds !== false) cloudLayer(ctx, c, t, 1.3, 2, 91, 1650, 1900, 2.6, cc, null, 60); };
  GRADE.sky = { warm: .11, vig: .3 };

  // night / malam berbintang + kota malam: stars, moon, shooting star, two skyline layers with flickering windows, rooftop
  ENV.night = (ctx, c, t, o) => {
    const gy = o.ground, hY = gy - 300; sky(ctx, c, t, "night", hY, o);
    layer(ctx, c, .22, () => { for (let i = -8; i < 20; i++){ const w = 100 + rnd(i + 170) * 110, h = 260 + rnd(i + 180) * 380, x = i * 140 - 200; ctx.fillStyle = "#24253F"; ctx.fillRect(x, hY - h + 60, w, h);
      for (let wy = hY - h + 90; wy < hY + 40; wy += 36) for (let wx = x + 12; wx < x + w - 14; wx += 24){ const r = rnd(wx * 1.3 + wy * .7); if (r > .62){ ctx.fillStyle = Math.sin(t * (.5 + r) + r * 50) > -.6 ? "rgba(244,194,122,.85)" : "rgba(244,194,122,.2)"; ctx.fillRect(wx, wy, 11, 16); } } }
      glow(ctx, 540, hY + 80, 900, "#E08A3C", .28); });
    layer(ctx, c, .5, () => { for (let i = -5; i < 11; i++){ const w = 220 + rnd(i + 270) * 120, h = 520 + rnd(i + 280) * 420, x = i * 300 - 120; ctx.fillStyle = "#17182C"; ctx.fillRect(x, gy - 100 - h, w, h + 400);
      if (i % 3 === 0){ ctx.fillRect(x + w / 2 - 4, gy - 100 - h - 90, 8, 90); ctx.fillStyle = Math.sin(t * 3 + i) > 0 ? "#E0503A" : "#5A2A22"; ctx.beginPath(); ctx.arc(x + w / 2, gy - 100 - h - 92, 7, 0, TAU); ctx.fill(); }
      for (let wy = gy - 70 - h; wy < gy - 120; wy += 56) for (let wx = x + 22; wx < x + w - 30; wx += 44){ const r = rnd(wx * .9 + wy * 1.1 + 3); if (r > .55){ ctx.fillStyle = Math.sin(t * (.3 + r) + r * 80) > -.7 ? "#F4C27A" : "#4A3A30"; ctx.fillRect(wx, wy, 20, 30); } } } });
    layer(ctx, c, 1, () => { ctx.fillStyle = "#2C2433"; ctx.fillRect(-4000, gy - 130, 9080, 3000); ctx.fillStyle = "#4A3A48"; ctx.fillRect(-4000, gy - 140, 9080, 22);
      ctx.strokeStyle = "#5A4858"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-4000, gy - 280); ctx.lineTo(5080, gy - 280); ctx.stroke(); for (let x = -1600; x < 2800; x += 140){ ctx.beginPath(); ctx.moveTo(x, gy - 280); ctx.lineTo(x, gy - 140); ctx.stroke(); }
      motes(ctx, t, 10, 77, -100, 900, 1280, 700, "#F6D36B", .8); });
  };
  GRADE.night = { warm: .08, vig: .55 };

  // info / ruang infografis navy: dark navy gradient, faint giant bars, spotlight, glowing perspective grid, rising dust
  ENV.info = (ctx, c, t, o) => {
    const hY = o.horizon ?? 1180;
    layer(ctx, c, .1, () => { fillAll(ctx, lg(ctx, 0, 0, 0, 1920, [[0, "#182744"], [.6, "#0F1B33"], [1, "#0A1222"]]));
      for (let i = -4; i < 12; i++){ const h = 300 + rnd(i + 900) * 700, x = i * 120 - 60; ctx.fillStyle = "rgba(40,60,98,.45)"; rr(ctx, x, hY - h, 84, h + 40, 18); ctx.fill(); ctx.fillStyle = "rgba(232,149,68,.14)"; rr(ctx, x, hY - h, 84, 30, 15); ctx.fill(); } });
    layer(ctx, c, .45, () => { ctx.save(); ctx.strokeStyle = "rgba(130,170,235,.28)"; ctx.lineWidth = 2.5;
      for (let k = -24; k <= 24; k++){ ctx.beginPath(); ctx.moveTo(540 + k * 18, hY); ctx.lineTo(540 + k * 260, hY + 1400); ctx.stroke(); }
      for (let r = 0; r < 18; r++){ const q = ((r + (t * .5) % 1) / 18), y = hY + Math.pow(q, 2.2) * 1400; ctx.globalAlpha = .2 + q * .8; ctx.beginPath(); ctx.moveTo(-3000, y); ctx.lineTo(4000, y); ctx.stroke(); } ctx.restore();
      ctx.fillStyle = lg(ctx, 0, hY - 60, 0, hY + 40, [[0, "rgba(232,149,68,0)"], [.5, "rgba(232,149,68,.35)"], [1, "rgba(232,149,68,0)"]]); ctx.fillRect(-4000, hY - 60, 9080, 100); });
    layer(ctx, c, .6, () => { const sx = o.spotX ?? 540; ctx.fillStyle = lg(ctx, 0, 0, 0, hY + 300, [[0, "rgba(255,238,210,.22)"], [1, "rgba(255,238,210,0)"]]); ctx.beginPath(); ctx.moveTo(sx - 70, -200); ctx.lineTo(sx + 70, -200); ctx.lineTo(sx + 520, hY + 300); ctx.lineTo(sx - 520, hY + 300); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rg(ctx, sx, hY + 260, 0, 520, [[0, "rgba(255,226,180,.25)"], [1, "rgba(255,226,180,0)"]]); ctx.save(); ctx.translate(sx, hY + 260); ctx.scale(1, .22); ctx.beginPath(); ctx.arc(0, 0, 520, 0, TAU); ctx.restore(); ctx.fill();
      motes(ctx, t, 30, 51, -100, 200, 1300, 1600, "#9FB9E8", .55); });
  };
  GRADE.info = { warm: .05, vig: .5 };
  ENV.sunset = (ctx, c, t, o) => ENV.sky(ctx, c, t, Object.assign({}, o, { time: "dusk", hills: o.hills ?? true }));
  ENVF.sunset = (ctx, c, t, o) => ENVF.sky(ctx, c, t, Object.assign({}, o, { time: "dusk" }));
  GRADE.sunset = GRADE.sky;
  ENV.city = ENV.night; GRADE.city = GRADE.night;

  function env(ctx, kind, t, c, o){
    o = Object.assign({ ground: GROUND }, o || {}); c = c || CS.cam || CAM0;
    const f = ENV[kind] || ENV.office; f(ctx, c, t, o);
    CS.grade = Object.assign({}, GRADE[kind] || GRADE.office, o.grade || {});
    return { ground: o.ground };
  }
  function envFront(ctx, kind, t, c, o){ o = Object.assign({ ground: GROUND }, o || {}); c = c || CS.cam || CAM0; if (ENVF[kind]) ENVF[kind](ctx, c, t, o); }

  /* ---------- props (world space, x = centre, y = floor line) ---------- */
  function prop(ctx, type, x, y, o, t){
    o = o || {}; const s = o.s || 1; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = "round";
    const ol = (w) => { ctx.strokeStyle = OUT; ctx.lineWidth = w || 6; ctx.stroke(); };
    if (type === "desk"){
      ctx.fillStyle = "rgba(43,26,18,.22)"; ctx.beginPath(); ctx.ellipse(0, 6, 300, 22, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#8E4E2E"; [-240, 220].forEach(dx => { rr(ctx, dx, -260, 26, 262, 6); ctx.fill(); ol(5); });
      ctx.fillStyle = "#A9643B"; rr(ctx, -150, -250, 300, 170, 10); ctx.fill(); ol(5); ctx.strokeStyle = "rgba(43,26,18,.3)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-150, -170); ctx.lineTo(150, -170); ctx.stroke();
      ctx.fillStyle = "#C47A48"; rr(ctx, -280, -290, 560, 40, 10); ctx.fill(); ol(6);
      if (o.laptop){ ctx.save(); ctx.translate(o.lx ?? -40, -290); glow(ctx, 0, -100, 200, "#CFE7EE", .35);
        ctx.fillStyle = "#544E42"; if (o.back){ rr(ctx, -110, -150, 220, 150, 12); ctx.fill(); ol(5); ctx.fillStyle = hexA(ORANGE, .9); ctx.beginPath(); ctx.arc(0, -75, 16, 0, TAU); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(-100, -150); ctx.lineTo(100, -150); ctx.lineTo(110, -10); ctx.lineTo(-110, -10); ctx.closePath(); ctx.fill(); ol(5); ctx.fillStyle = "#BFE2EA"; ctx.fillRect(-86, -136, 172, 112);
          ctx.fillStyle = hexA(ORANGE, .8); for (let k = 0; k < 4; k++) ctx.fillRect(-70, -122 + k * 24, 60 + ((k * 37 + Math.floor((t || 0) * 2)) % 70), 10); }
        ctx.fillStyle = "#3B2418"; rr(ctx, -125, -10, 250, 14, 6); ctx.fill(); ctx.restore(); }
      if (o.mug){ ctx.save(); ctx.translate(170, -290); ctx.fillStyle = "#FFF4E6"; rr(ctx, -24, -58, 48, 58, 8); ctx.fill(); ol(5); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(26, -30, 13, -1.3, 1.3); ctx.stroke(); ctx.fillStyle = ORANGE; ctx.fillRect(-20, -40, 40, 10);
        for (let k = 0; k < 3; k++){ const q = (((t || 0) * .5 + k / 3) % 1); ctx.globalAlpha = .5 * Math.sin(q * Math.PI); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-8 + k * 8, -66 - q * 80); ctx.quadraticCurveTo(-20 + k * 8 + Math.sin(q * 6) * 10, -90 - q * 80, -6 + k * 8, -110 - q * 80); ctx.stroke(); } ctx.globalAlpha = 1; ctx.restore(); }
      if (o.papers){ ctx.save(); ctx.translate(-220, -290); for (let k = 0; k < (o.papers === true ? 5 : o.papers); k++){ ctx.fillStyle = k % 2 ? "#FFFDF8" : "#F3E6D2"; ctx.save(); ctx.rotate((rnd(k + 3) - .5) * .12); ctx.fillRect(-60, -10 - k * 9, 120, 10); ctx.restore(); } ctx.restore(); }
    } else if (type === "chair"){
      ctx.fillStyle = "#3B2418"; ctx.fillRect(-8, -150, 16, 150); rr(ctx, -70, -12, 140, 14, 7); ctx.fill();
      ctx.fillStyle = "#5A3A2A"; rr(ctx, -80, -190, 160, 46, 18); ctx.fill(); ol(5); rr(ctx, -70, -400, 140, 220, 30); ctx.fill(); ol(5);
    } else if (type === "plant"){
      ctx.fillStyle = "#3E7D4F"; for (let k = 0; k < 7; k++){ ctx.save(); ctx.translate(0, -110); ctx.rotate(-1.2 + k * .4 + Math.sin((t || 0) * 1.3 + k) * .05); ctx.beginPath(); ctx.ellipse(0, -80, 24, 80, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.moveTo(-60, -120); ctx.lineTo(60, -120); ctx.lineTo(46, 0); ctx.lineTo(-46, 0); ctx.closePath(); ctx.fill(); ol(6);
    } else if (type === "bench"){
      ctx.fillStyle = "rgba(43,26,18,.2)"; ctx.beginPath(); ctx.ellipse(0, 8, 260, 20, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#3B2418"; [-200, 180].forEach(dx => ctx.fillRect(dx, -150, 20, 150));
      ctx.fillStyle = "#B5643C"; for (let k = 0; k < 3; k++){ rr(ctx, -250, -170 - k * 70 - (k ? 40 : 0), 500, 34, 8); ctx.fill(); ol(5); }
    } else if (type === "box"){
      ctx.fillStyle = "#D9A066"; rr(ctx, -90, -150, 180, 150, 8); ctx.fill(); ol(6); ctx.strokeStyle = "#8E4E2E"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-90, -110); ctx.lineTo(90, -110); ctx.moveTo(0, -150); ctx.lineTo(0, -110); ctx.stroke();
    } else if (type === "board"){
      ctx.fillStyle = "#3B2418"; ctx.fillRect(-180, -260, 14, 260); ctx.fillRect(166, -260, 14, 260);
      ctx.fillStyle = "#FFFDF8"; rr(ctx, -230, -620, 460, 380, 14); ctx.fill(); ol(8);
      const bars = o.bars || [.3, .5, .45, .8]; bars.forEach((v, k) => { const h = 260 * v * (o.p ?? 1); ctx.fillStyle = k === bars.length - 1 ? ORANGE : "#E8B98A"; rr(ctx, -180 + k * 100, -270 - h, 70, h, 8); ctx.fill(); });
      ctx.strokeStyle = BROWN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-200, -268); ctx.lineTo(200, -268); ctx.stroke();
    } else if (type === "sofa"){
      ctx.fillStyle = "rgba(43,26,18,.25)"; ctx.beginPath(); ctx.ellipse(0, 6, 330, 22, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = o.color || "#A0522D"; rr(ctx, -300, -330, 600, 200, 50); ctx.fill(); ol(6); rr(ctx, -330, -230, 110, 210, 40); ctx.fill(); ol(6); rr(ctx, 220, -230, 110, 210, 40); ctx.fill(); ol(6);
      ctx.fillStyle = mixHex(o.color || "#A0522D", "#FFFFFF", .15); rr(ctx, -230, -170, 460, 120, 30); ctx.fill(); ol(6);
    } else if (type === "phone"){
      ctx.rotate(o.rot || 0); ctx.fillStyle = "#1E1A18"; rr(ctx, -70, -140, 140, 280, 24); ctx.fill(); ol(6); ctx.fillStyle = o.screen || "#BFE2EA"; rr(ctx, -58, -122, 116, 244, 14); ctx.fill();
      if (o.notif){ ctx.fillStyle = "#E0503A"; ctx.beginPath(); ctx.arc(58, -128, 26, 0, TAU); ctx.fill(); ctx.fillStyle = "#fff"; font(ctx, 800, 30, FAM); ctx.textAlign = "center"; ctx.fillText(String(o.notif), 58, -117); ctx.textAlign = "left"; }
    } else if (type === "lamp"){
      ctx.fillStyle = "#3B2418"; ctx.fillRect(-6, -520, 12, 520); rr(ctx, -60, -12, 120, 14, 7); ctx.fill(); glow(ctx, 0, -470, 300, "#FFD9A0", .45);
      ctx.fillStyle = "#E8A55B"; ctx.beginPath(); ctx.moveTo(-40, -600); ctx.lineTo(40, -600); ctx.lineTo(80, -480); ctx.lineTo(-80, -480); ctx.closePath(); ctx.fill(); ol(5);
    } else if (type === "clock"){
      ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.arc(0, 0, 90, 0, TAU); ctx.fill(); ol(10); const sp = o.fast ? 6 : .5;
      ctx.strokeStyle = BROWN; ctx.lineCap = "round"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin((t || 0) * sp) * 64, -Math.cos((t || 0) * sp) * 64); ctx.stroke();
      ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin((t || 0) * sp / 12 + 2) * 40, -Math.cos((t || 0) * sp / 12 + 2) * 40); ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- toon characters ---------- */
  const SKINS = { a: "#D99A6E", b: "#C98B62", c: "#B5774F", d: "#E2A77C", e: "#F0C29A", w: "#FFF4E8" };
  // hand targets in body units (facing right, feet at 0, shoulders y -52): [x, y, elbowBend]
  const TP = {
    idle: { F: [11, -29, 1], B: [-11, -29, -1] },
    talk: { F: [24, -36, 1], B: [-11, -29, -1], gest: 1 },
    wave: { F: [25, -70, -1], B: [-11, -29, -1], wave: 1 },
    point: { F: [33, -56, 1], B: [-11, -30, -1], finger: 1 },
    pointUp: { F: [25, -71, -1], B: [-11, -30, -1], finger: 1 },
    shrug: { F: [24, -57, -1], B: [-24, -57, 1], up: 2.5, tilt: .1 },
    facepalm: { F: [7, -71, 1], B: [-16, -37, 1], tilt: .16 },
    clap: { F: [12, -47, 1], B: [10, -48, 1], clap: 1 },
    scratch: { F: [21, -76, -1], B: [-16, -37, 1], scratch: 1, tilt: -.08 },
    cheer: { F: [23, -72, -1], B: [-23, -72, 1], bounce: 1 },
    hips: { F: [17, -37, -1], B: [-17, -37, 1], tilt: -.07 },
    think: { F: [9, -62, 1], B: [-6, -43, 1], tilt: .08 },
    phone: { F: [17, -43, 1], B: [13, -42, 1], phone: 1, tilt: .16, lookDown: 1 },
    hold: { F: [21, -47, 1], B: [18, -47, 1] },
    scared: { F: [20, -60, 1], B: [12, -61, 1], tremble: 1 },
    shock: { F: [24, -64, -1], B: [-24, -64, 1] },
    sad: { F: [8, -29, 1], B: [-7, -29, -1], tilt: .15, slump: 2 },
    sit: { F: [14, -26, 1], B: [-4, -26, 1], sit: 1 },
  };
  const AUTO_POSE = { confused: "scratch", proud: "hips", scared: "scared", sad: "sad", shock: "shock" };
  const EXP = {
    neutral: { eye: 1, pupil: 1, brow: [-10, -10], mouth: "flat", blush: .2 },
    happy: { eye: 1.04, pupil: 1.05, brow: [-11.5, -11], mouth: "smile", blush: .45 },
    laugh: { closed: "up", brow: [-12, -11.5], mouth: "laugh", blush: .55 },
    shock: { eye: 1.4, pupil: .5, brow: [-15, -14.5], mouth: "O", blush: 0 },
    confused: { eye: 1, pupil: 1, brow: [-13, -9], browUp: 1, mouth: "wavy", blush: .15 },
    sad: { eye: .96, pupil: 1, brow: [-12.6, -8.4], lid: .4, lidSad: 1, mouth: "frown", look: [0, .7], blush: 0 },
    angry: { eye: .96, pupil: .8, brow: [-6.6, -11.4], lid: .42, lidAngry: 1, mouth: "teeth", tint: "red", blush: 0 },
    scared: { eye: 1.26, pupil: .55, brow: [-13.2, -10.8], mouth: "zigzag", tint: "pale", blush: 0 },
    proud: { closed: "down", brow: [-11.5, -11.8], mouth: "smirk", blush: .3, chin: -.1 },
  };
  function toonState(a, s, t){
    const idx = G.scene, K = (a.keys || []).map((k, j) => Object.assign({}, k, { T: keyT(s, k, j, idx) })).sort((p, q) => p.T - q.T);
    let x = a.x ?? 540, y = a.y ?? GROUND, mFrom = x, mTo = x, mS = -1, mD = 0, run = false, face = a.face || 1;
    let pose = a.pose || "idle", prevPose = pose, poseT = -9, expr = a.expr || "neutral", exprT = -9, talk = !!a.talk, say = null, sayT = 0, sayDur = 0, sayKind = "say";
    let emote = a.emote || null, emoteT = a.emote ? 0 : -9, emoteDur = a.emote ? 999 : 2, jumpT = -9, jumpH = 0, jumpD = .55, look = a.look ?? null, show = a.show !== false, showT = -9;
    const xAt = T => (mS >= 0 && T < mS + mD) ? mFrom + (mTo - mFrom) * easeIO((T - mS) / mD) : mTo;
    for (const k of K){ if (t < k.T) break;
      if (k.x != null && k.x !== mTo){ const cx = xAt(k.T); mFrom = cx; mTo = k.x; mS = k.T; run = !!k.run; mD = k.dur || Math.max(.35, Math.abs(k.x - cx) / (k.speed || (run ? 720 : 320))); if (k.face == null) face = Math.sign(k.x - cx) || face; }
      if (k.pose && k.pose !== pose){ prevPose = pose; pose = k.pose; poseT = k.T; }
      if (k.expr && k.expr !== expr){ expr = k.expr; exprT = k.T; }
      if (k.face) face = k.face; if (k.talk != null) talk = !!k.talk; if (k.look !== undefined) look = k.look; if (k.y != null) y = k.y;
      if (k.say != null){ say = k.say; sayT = k.T; sayDur = k.sayDur || 2.6; sayKind = k.kind || "say"; }
      if (k.emote !== undefined){ emote = k.emote; emoteT = k.T; emoteDur = k.emoteDur || 2.2; }
      if (k.jump){ jumpT = k.T; jumpH = typeof k.jump === "number" ? k.jump : 130; jumpD = k.jumpDur || .55; }
      if (k.show != null){ show = !!k.show; showT = k.T; } }
    const moving = mS >= 0 && t < mS + mD, sayOn = say != null && t - sayT >= 0 && t - sayT < sayDur;
    return { x: xAt(t), y, vx: (xAt(t) - xAt(t - .08)) / .08, moving, run: moving && run, moveT: t - mS, face, pose, prevPose, poseT, expr, exprT,
      talk: talk || sayOn, say: sayOn ? say : null, sayT, sayKind, emote: emote && t - emoteT >= 0 && t - emoteT < emoteDur ? emote : null, emoteT,
      jumpT, jumpH, jumpD, look, show, showT, size: a.size || 760 };
  }
  function ik(sx, sy, tx, ty, a, b, bend){
    const dx = tx - sx, dy = ty - sy, d0 = Math.hypot(dx, dy), d = Math.max(.01, Math.min(d0, a + b - .05)), th = Math.atan2(dy, dx);
    const al = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1)), e = th - bend * al;
    return [sx + Math.cos(e) * a, sy + Math.sin(e) * a, sx + Math.cos(th) * d, sy + Math.sin(th) * d];
  }
  function stroke2(ctx, pts, w, col, lw){
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.strokeStyle = OUT; ctx.lineWidth = w + lw * 2; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
  }
  function circ(ctx, x, y, r, fill, lw){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill(); if (lw){ ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); } }
  function ell(ctx, x, y, rx, ry, rot, fill, lw){ ctx.beginPath(); ctx.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), rot || 0, 0, TAU); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (lw){ ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); } }
  function poseHands(name, st, t, gt){
    const P0 = TP[name] || TP.idle, F = P0.F.slice(), B = P0.B.slice();
    if (P0.wave){ F[0] += Math.sin(t * 11) * 4; F[1] += Math.cos(t * 11) * 2; }
    if (P0.gest){ F[0] += Math.sin(t * 4.2) * 3; F[1] += Math.sin(t * 6.1) * 4; }
    if (P0.clap){ const o = Math.abs(Math.sin(t * 9)) * 6; F[0] += o; B[0] -= o * .8; }
    if (P0.scratch){ F[0] += Math.sin(t * 16) * 1.6; F[1] += Math.cos(t * 16) * 1.2; }
    if (P0.tremble){ F[0] += Math.sin(t * 50) * .7; B[0] += Math.cos(t * 47) * .7; }
    if (P0.bounce){ F[1] += Math.sin(t * 10) * 2.5; B[1] += Math.sin(t * 10 + 1) * 2.5; }
    return { F, B, P0 };
  }
  // draws a toon in the current (world) transform; returns anchors in world coordinates
  function drawToon(ctx, a, st, t){
    if (!st.show && t - st.showT > .35) return null;
    const size = st.size, k = size / 92, f = st.face || 1, gt = sceneStart() + t, seed = a.seed ?? ((a.x || 0) * .0137 + (a.size || 0) * .001);
    const skin = SKINS[a.skin] || a.skin || SKINS.a, shirt = a.shirt || "#2F6F73", pants = a.pants || "#3B2418", hairC = a.hairColor || "#2B1A12", shoe = a.shoes || "#2B1A12";
    const lw = (5.5 + size * .0034) / k;
    let alpha = 1; if (!st.show) alpha = 1 - clamp((t - st.showT) / .35, 0, 1); else if (st.showT > -9 && t - st.showT < .35) alpha = clamp((t - st.showT) / .35, 0, 1);
    // pose: auto pose from expression when the toon has no explicit pose
    let pose = st.pose, prev = st.prevPose; if (pose === "idle" && a.autoPose !== false && AUTO_POSE[st.expr] && t - st.exprT < 99) pose = AUTO_POSE[st.expr];
    if (st.talk && pose === "idle" && a.gesture !== false) pose = "talk";
    // jump / squash & stretch / anticipation
    let lift = 0, sq = 0, crouch = 0; const jq = t - st.jumpT;
    if (jq >= 0 && jq < .13 + st.jumpD + .45){ const ant = .13, D = st.jumpD;
      if (jq < ant){ const q = jq / ant; sq = -.16 * eOut(q); crouch = 4 * eOut(q); }
      else if (jq < ant + D){ const q = (jq - ant) / D; lift = st.jumpH * 4 * q * (1 - q); sq = .16 * Math.max(0, 1 - q * 2.4) - .03 * Math.max(0, q * 2 - 1.4); }
      else { const q = (jq - ant - D) / .45; sq = -.2 * Math.exp(-q * 5) * Math.cos(q * 10); crouch = 3 * Math.exp(-q * 6); } }
    const eq = t - st.exprT;
    if ((st.expr === "shock" || st.expr === "scared") && eq >= 0 && eq < .5){ const q = eq / .5; lift += (st.expr === "shock" ? 60 : 30) * (size / 760) * Math.sin(q * Math.PI); sq += .12 * Math.sin(q * Math.PI * 2) * (1 - q); }
    if (st.expr === "laugh") lift += Math.abs(Math.sin(t * 13)) * 6 * (size / 760);
    const pq = t - st.poseT; if (pq >= 0 && pq < .35) sq += .05 * Math.sin(pq / .35 * Math.PI) * (1 - pq / .35);
    const walk = st.moving, run = st.run, ph = (st.moveT || 0) * (run ? 15 : 9.5);
    const bob = walk ? Math.abs(Math.sin(ph)) * (run ? 3.2 : 1.6) : 0, breath = Math.sin(t * 2.3 + seed) * .55;
    const tremble = st.expr === "scared" ? Math.sin(t * 55) * .6 : 0;
    // ground shadow
    if (a.shadow !== false){ const sh = 1 - clamp(lift / (size * .6), 0, .6); ctx.save(); ctx.globalAlpha *= alpha * .28; ctx.fillStyle = "#2B1A12"; ctx.beginPath(); ctx.ellipse(st.x, st.y + 3 * k, 22 * k * sh, 4.2 * k * sh, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(st.x + tremble * k, st.y - lift); ctx.scale(k * f * (1 - sq * .7), k * (1 + sq));
    const lean = run ? .16 : walk ? .04 : 0; if (lean) ctx.rotate(lean);
    if (run || (walk && a.speedLines)){ ctx.save(); ctx.globalAlpha *= .5; ctx.strokeStyle = "#FFF4E6"; ctx.lineWidth = 1.4; ctx.lineCap = "round"; for (let i = 0; i < 4; i++){ const yy = -70 + i * 15 + Math.sin(t * 20 + i) * 2, L = 14 + (i % 2) * 8; ctx.beginPath(); ctx.moveTo(-24 - (t * 300 + i * 13) % 12, yy); ctx.lineTo(-24 - L, yy); ctx.stroke(); } ctx.restore(); }
    const P0 = TP[pose] || TP.idle, sit = !!P0.sit;
    const hipY = (sit ? -15 : -28) + crouch + bob * .4, up = (P0.up || 0) * Math.min(1, pq >= 0 ? pq / .25 : 1), slump = P0.slump || 0;
    const shY = hipY - 27 + breath * .3 - up + slump;
    const headY = shY - 17 + breath * .2 + up * .5 - bob * .2;
    // legs
    const legs = [];
    [[1, 5.5], [-1, -5.5]].forEach(([d, hx]) => { let fx, fy;
      if (sit){ fx = hx * .4 + 14 + d * 1.5; fy = 0; }
      else if (jq >= .13 && jq < .13 + st.jumpD && lift > 2){ fx = hx + 4 * d + 2; fy = -9; }
      else if (walk){ const s0 = Math.sin(ph + (d > 0 ? 0 : Math.PI)); fx = hx * .5 + s0 * (run ? 14 : 8.5); fy = -Math.max(0, Math.cos(ph + (d > 0 ? 0 : Math.PI))) * (run ? 9 : 4); }
      else { fx = hx; fy = 0; }
      const kne = sit ? [hx * .4 + 14, hipY - 1, fx, fy] : ik(hx * .7, hipY, fx, fy, 14.5, 14.5, -1);
      legs.push({ d, hx: hx * .7, kne, fx, fy }); });
    legs.sort((p, q) => p.d - q.d).forEach(L => { const sh = L.d < 0; const col = sh ? mixHex(pants, "#000000", .18) : pants;
      stroke2(ctx, [L.hx, hipY, L.kne[0], L.kne[1], L.fx, L.fy - 2], 8.2, col, lw);
      ell(ctx, L.fx + 2.8, L.fy - 1.6, 6.4, 3.4, 0, sh ? mixHex(shoe, "#000000", .2) : shoe, lw * .8); });
    // pose blend (with overshoot = follow-through)
    const now = poseHands(pose, st, t, gt), was = poseHands(prev === "idle" && st.talk ? "talk" : prev, st, t, gt), pm = pq >= 0 ? eBack(clamp(pq / .3, 0, 1)) : 1;
    const hand = (key) => { const A = now[key], Bv = was[key]; let hx = lerp(Bv[0], A[0], pm), hy = lerp(Bv[1], A[1], pm); return [hx, hy + slump * .5, A[2]]; };
    let HF = hand("F"), HB = hand("B");
    if (walk && !P0.wave && !P0.phone && !P0.hold){ const sw = Math.sin(ph) * (run ? 9 : 6); HF = run ? [10 + sw, -46 - Math.cos(ph) * 3, 1] : [10 + sw, -30, 1]; HB = run ? [-8 - sw, -46 + Math.cos(ph) * 3, 1] : [-10 - sw, -30, -1]; }
    const shF = [8.5, shY + 3], shB = [-8.5, shY + 3];
    const sleeve = a.sleeve === "short", armCol = shirt;
    const drawArm = (S, Hd, back) => { const j = ik(S[0], S[1], Hd[0], Hd[1], 13, 12.5, Hd[2]); const col = back ? mixHex(armCol, "#000000", .14) : armCol;
      if (sleeve){ stroke2(ctx, [S[0], S[1], j[0], j[1]], 6.6, col, lw); stroke2(ctx, [j[0], j[1], j[2], j[3]], 5, back ? mixHex(skin, "#000000", .1) : skin, lw); }
      else stroke2(ctx, [S[0], S[1], j[0], j[1], j[2], j[3]], 6.6, col, lw);
      return j; };
    // back arm
    const jB = drawArm(shB, HB, true); circ(ctx, jB[2], jB[3], 3.6, mixHex(skin, "#000000", .08), lw * .8);
    // long hair (behind body)
    if (a.hair === "long"){ ctx.save(); ctx.translate(0, headY); ctx.beginPath(); rr(ctx, -23.5, -12, 42, 44, 16); ctx.fillStyle = hairC; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); ctx.restore(); }
    // torso
    const tie = a.tie, vx = st.vx || 0;
    ctx.beginPath(); ctx.moveTo(-9.5, shY); ctx.bezierCurveTo(-15.5, shY + 6, -16, hipY - 6, -13.5, hipY + 2.5); ctx.quadraticCurveTo(0, hipY + 5.5, 13.5, hipY + 2.5); ctx.bezierCurveTo(16, hipY - 6, 15.5, shY + 6, 9.5, shY); ctx.quadraticCurveTo(0, shY - 3.2, -9.5, shY); ctx.closePath();
    ctx.fillStyle = a.jacket || shirt; ctx.fill(); ctx.save(); ctx.clip();
    if (a.stripes){ ctx.fillStyle = a.stripes; for (let yy = shY + 3; yy < hipY; yy += 5) ctx.fillRect(-20, yy, 40, 2.4); }
    if (a.jacket){ ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(-4, shY - 2); ctx.lineTo(5, shY - 2); ctx.lineTo(3, hipY + 4); ctx.lineTo(-2, hipY + 4); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = pants; ctx.fillRect(-20, hipY - 3.5, 40, 12); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(-20, hipY - 4, 40, 1.4);
    ctx.fillStyle = "rgba(0,0,0,.1)"; ctx.fillRect(-20, shY - 4, 7, hipY - shY + 10);
    ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke();
    if (a.collar !== false && a.hair !== "hijab"){ ctx.fillStyle = a.collarColor || "#FFF8EE"; [[-1], [1]].forEach(([d]) => { ctx.beginPath(); ctx.moveTo(1.5, shY - 1); ctx.lineTo(1.5 + d * 6.5, shY - 1.5); ctx.lineTo(1.5 + d * 4, shY + 4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); }); }
    if (tie){ const sw = clamp(-vx * .0016, -.6, .6) + Math.sin(t * 2.2) * .04 + (jq > .13 && jq < .13 + st.jumpD ? -.25 : 0); ctx.save(); ctx.translate(2, shY + 1); ctx.rotate(sw);
      ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(2, 0); ctx.lineTo(3.2, 15); ctx.lineTo(0, 19); ctx.lineTo(-3.2, 15); ctx.closePath(); ctx.fillStyle = tie; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); ctx.restore(); }
    if (a.idcard){ ctx.strokeStyle = a.idcard; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-5, shY); ctx.lineTo(-2, shY + 14); ctx.lineTo(4, shY); ctx.stroke(); rr(ctx, -5.5, shY + 13, 7, 9, 1.5); ctx.fillStyle = "#FFF8EE"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .6; ctx.stroke(); ctx.fillStyle = a.idcard; ctx.fillRect(-4.5, shY + 14.5, 5, 2.2); }
    // hijab drape over shoulders
    if (a.hair === "hijab"){ ctx.beginPath(); ctx.moveTo(-16, headY + 6); ctx.quadraticCurveTo(-19, shY + 9, -12, shY + 13); ctx.quadraticCurveTo(2, shY + 18, 15, shY + 12); ctx.quadraticCurveTo(20, shY + 8, 17, headY + 6); ctx.closePath(); ctx.fillStyle = a.hijab || ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.stroke(); }
    // head
    const ex = EXP[st.expr] || EXP.neutral, pop = eq >= 0 && eq < .4 ? 1 + .09 * Math.sin(eq / .4 * Math.PI) * (1 - eq / .4) : 1;
    const voL = st.talk ? voLevel(gt) : 0, m = voL * (.32 + .68 * Math.abs(Math.sin(gt * 13.5 + seed * 3))) * (a.mouthGain ?? 1);
    let tilt = (P0.tilt || 0) * pm + (ex.chin || 0) + Math.sin(gt * 4.3) * .035 * voL + (st.expr === "laugh" ? Math.sin(t * 13) * .05 : 0);
    if (st.look === "down") tilt += .12;
    ctx.save(); ctx.translate(0, headY); ctx.rotate(tilt); ctx.scale(pop, pop);
    drawHead(ctx, a, st, ex, m, t, gt, lw, skin, hairC, seed, f);
    ctx.restore();
    // front arm (after head: facepalm hand covers the face)
    const jF = drawArm(shF, HF, false);
    circ(ctx, jF[2], jF[3], 3.8, skin, lw * .8);
    if (P0.finger && pm > .5){ const ang = Math.atan2(jF[3] - jF[1], jF[2] - jF[0]); ctx.save(); ctx.translate(jF[2], jF[3]); ctx.rotate(ang); rr(ctx, 1, -1.3, 6.5, 2.6, 1.3); ctx.fillStyle = skin; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .6; ctx.stroke(); ctx.restore(); }
    if (P0.phone){ ctx.save(); ctx.translate((jF[2] + jB[2]) / 2 + 1, (jF[3] + jB[3]) / 2 - 4); ctx.rotate(-.25); rr(ctx, -4, -7, 8, 13, 1.6); ctx.fillStyle = "#1E1A18"; ctx.fill(); rr(ctx, -3, -6, 6, 10.5, 1); ctx.fillStyle = "#BFE2EA"; ctx.fill(); ctx.restore(); circ(ctx, jF[2], jF[3], 3.8, skin, lw * .8); }
    if (P0.clap && Math.abs(Math.sin(t * 9)) < .25){ ctx.strokeStyle = "#F6D36B"; ctx.lineWidth = 1.3; for (let i = 0; i < 3; i++){ const an = -1.1 + i * .55; ctx.beginPath(); ctx.moveTo(13 + Math.cos(an) * 7, -50 + Math.sin(an) * 7); ctx.lineTo(13 + Math.cos(an) * 12, -50 + Math.sin(an) * 12); ctx.stroke(); } }
    // effects around the head (emote + expression extras)
    drawFx(ctx, a, st, ex, t, headY, lw, f);
    if ((jq >= .13 + st.jumpD && jq < .13 + st.jumpD + .45) || (walk && run && Math.sin(ph) > .95)){ const q = jq >= .13 + st.jumpD ? (jq - .13 - st.jumpD) / .45 : .3; ctx.globalAlpha *= (1 - q) * .7; ctx.fillStyle = "#F3E2C8"; [-1, 1].forEach(d => { circ(ctx, d * (10 + q * 16), -2 - q * 4, 3.5 + q * 3, "#F3E2C8"); }); }
    ctx.restore();
    const hyW = st.y - lift + headY * k * (1 + sq);
    return { x: st.x, y: st.y, headX: st.x + 2 * k * f, headY: hyW, top: hyW - 21 * k, mouthY: hyW + 9.5 * k, r: 20.5 * k, k, face: f, st };
  }
  function drawHead(ctx, a, st, ex, m, t, gt, lw, skin, hairC, seed, f){
    const hj = a.hair === "hijab", fx = 2.6;
    if (hj){ ell(ctx, 0, 1.5, 24.5, 24, 0, a.hijab || ORANGE, lw); }
    else { ell(ctx, -19.2, 1.5, 3.8, 5, 0, skin, lw * .8); ell(ctx, -19.2, 1.5, 1.6, 2.6, 0, "rgba(0,0,0,.12)"); }
    const hrx = hj ? 16.8 : 20.5, hry = hj ? 17.5 : 19.3, hcx = hj ? 2.2 : 0, hcy = hj ? 2.5 : 0;
    ell(ctx, hcx, hcy, hrx, hry, 0, skin, lw);
    // tints
    if (ex.tint === "red"){ ctx.save(); ctx.beginPath(); ctx.ellipse(hcx, hcy, hrx, hry, 0, 0, TAU); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -20, 0, 8, [[0, "rgba(214,60,40,.45)"], [1, "rgba(214,60,40,0)"]]); ctx.fillRect(-25, -25, 50, 40); ctx.restore(); }
    if (ex.tint === "pale"){ ctx.save(); ctx.beginPath(); ctx.ellipse(hcx, hcy, hrx, hry, 0, 0, TAU); ctx.clip(); ctx.fillStyle = lg(ctx, 0, -20, 0, 4, [[0, "rgba(90,120,190,.42)"], [1, "rgba(90,120,190,0)"]]); ctx.fillRect(-25, -25, 50, 40);
      ctx.strokeStyle = "rgba(60,80,150,.55)"; ctx.lineWidth = lw * .7; for (let i = 0; i < 4; i++){ ctx.beginPath(); ctx.moveTo(-6 + i * 4 + fx, -16); ctx.lineTo(-6 + i * 4 + fx, -10); ctx.stroke(); } ctx.restore(); }
    // beard (under mouth)
    if (a.beard){ ctx.fillStyle = a.beardColor || hairC; ctx.beginPath(); if (a.beard === "goatee"){ ctx.ellipse(fx + 1.5, 15.5, 4.5, 4, 0, 0, TAU); } else { ctx.moveTo(-17, 1); ctx.quadraticCurveTo(-16, 19, fx + 1, 21.5); ctx.quadraticCurveTo(18.5, 19, 19.6, 1); ctx.lineTo(16, 5); ctx.quadraticCurveTo(fx + 1, 17, -13.5, 5); ctx.closePath(); } ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); }
    // blush
    if (ex.blush){ ctx.fillStyle = `rgba(233,118,96,${ex.blush * .7})`; ell(ctx, fx + 12, 6.5, 3.6, 2.3, 0, ctx.fillStyle); ell(ctx, fx - 10.5, 6.5, 3.2, 2.1, 0, ctx.fillStyle); }
    // eyes
    const blinkP = (t + seed * 7.3) % 3.4, blink = blinkP < .12 && !ex.closed, look = st.look === "cam" ? [0, 0] : st.look === "down" ? [.3, .8] : Array.isArray(st.look) ? st.look : (ex.look || (st.pose === "phone" ? [.5, .75] : [.45, 0]));
    [[-1, .9], [1, 1]].forEach(([d, sc]) => { const exx = fx + d * 7.3, eyy = -2, rx = 4.6 * (ex.eye || 1) * sc, ry = 5.6 * (ex.eye || 1) * sc;
      if (ex.closed || blink){ ctx.strokeStyle = OUT; ctx.lineWidth = lw * 1.05; ctx.lineCap = "round"; ctx.beginPath();
        if (ex.closed === "up") ctx.arc(exx, eyy + 2.2, 4.2, Math.PI * 1.15, Math.PI * 1.85); else if (ex.closed === "down") ctx.arc(exx, eyy - 1.8, 4.2, Math.PI * .15, Math.PI * .85); else { ctx.moveTo(exx - 4.2, eyy + .5); ctx.quadraticCurveTo(exx, eyy + 2, exx + 4.2, eyy + .5); }
        ctx.stroke(); return; }
      ell(ctx, exx, eyy, rx, ry, 0, "#FFFFFF");
      const pr = 2.55 * (ex.pupil || 1) * sc, px = exx + clamp(look[0], -1, 1) * (rx - pr - .4), py = eyy + clamp(look[1], -1, 1) * (ry - pr - .4) + (st.expr === "scared" ? Math.sin(t * 40) * .3 : 0);
      circ(ctx, px, py, pr, "#1E120B"); circ(ctx, px - pr * .35, py - pr * .4, Math.max(.5, pr * .32), "#FFFFFF");
      if (ex.lid){ ctx.save(); ctx.beginPath(); ctx.ellipse(exx, eyy, rx, ry, 0, 0, TAU); ctx.clip(); ctx.fillStyle = skin; ctx.translate(exx, eyy - ry); const tilt = ex.lidAngry ? -d * .45 : ex.lidSad ? d * .4 : 0; ctx.rotate(tilt); ctx.fillRect(-rx * 2, -ry, rx * 4, ry * (1 + ex.lid * 1.1)); ctx.restore();
        ctx.save(); ctx.translate(exx, eyy - ry + ry * ex.lid * 1.1); ctx.rotate(ex.lidAngry ? -d * .45 : ex.lidSad ? d * .4 : 0); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .8; ctx.beginPath(); ctx.moveTo(-rx * .9, 0); ctx.lineTo(rx * .9, 0); ctx.stroke(); ctx.restore(); }
      ell(ctx, exx, eyy, rx, ry, 0, null, lw * .75); });
    // brows
    ctx.strokeStyle = a.browColor || (/^#[0-9a-f]{6}$/i.test(hairC) ? mixHex(hairC, OUT, .35) : OUT); ctx.lineWidth = lw * 1.25; ctx.lineCap = "round";
    [[-1], [1]].forEach(([d]) => { const exx = fx + d * 7.3, inner = ex.brow[0], outer = ex.brow[1]; let yi = inner, yo = outer; if (ex.browUp && d === 1){ yi -= 1.5; yo -= 2.5; } if (ex.browUp && d === -1){ yi += 1.2; yo += 1.5; }
      const sc2 = ex.eye && ex.eye > 1.2 ? 1.15 : 1; ctx.beginPath(); ctx.moveTo(exx - d * 1.2, yi * sc2); ctx.quadraticCurveTo(exx + d * 2.5, Math.min(yi, yo) * sc2 - 1, exx + d * 5, yo * sc2); ctx.stroke(); });
    // nose
    ctx.strokeStyle = "rgba(43,26,18,.55)"; ctx.lineWidth = lw * .75; ctx.beginPath(); ctx.arc(fx + 2.2, 4.2, 1.8, -.6, 1.8); ctx.stroke();
    if (a.mustache){ ctx.fillStyle = a.beardColor || hairC; ctx.beginPath(); ctx.moveTo(fx + 1.5, 6.4); ctx.bezierCurveTo(fx - 3, 4.6, fx - 7.5, 6.5, fx - 7.8, 9.2); ctx.quadraticCurveTo(fx - 3, 8, fx + 1.5, 8.6); ctx.quadraticCurveTo(fx + 6, 8, fx + 10.8, 9.2); ctx.bezierCurveTo(fx + 10.5, 6.5, fx + 6, 4.6, fx + 1.5, 6.4); ctx.fill(); }
    drawMouth(ctx, ex.mouth, m, t, lw, fx + 1.2, 10.5 + (a.mustache ? .8 : 0), st);
    // hair / headwear
    hairTop(ctx, a, lw, hairC, t, st);
    if (a.glasses){ ctx.strokeStyle = a.glassesColor || OUT; ctx.lineWidth = lw * .85; [[-1, .9], [1, 1]].forEach(([d, sc]) => { ctx.beginPath(); ctx.arc(fx + d * 7.3, -2, 6.4 * sc, 0, TAU); ctx.stroke(); ctx.save(); ctx.globalAlpha *= .35; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(fx + d * 7.3 + 2, -4.5, 1.6, 0, TAU); ctx.fill(); ctx.restore(); });
      ctx.beginPath(); ctx.moveTo(fx - 1.5, -2.5); ctx.lineTo(fx + 1.5, -2.5); ctx.moveTo(fx - 13.6, -3); ctx.lineTo(-18, -4); ctx.stroke(); }
  }
  function drawMouth(ctx, kind, m, t, lw, x, y, st){
    ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = lw * .95;
    const DARK = "#5A2418", TONG = "#D9705A";
    const open = (w, h, top) => { ctx.beginPath(); if (top === "D"){ ctx.moveTo(-w, -1); ctx.lineTo(w, -1); ctx.quadraticCurveTo(w, h, 0, h); ctx.quadraticCurveTo(-w, h, -w, -1); } else ctx.ellipse(0, h / 2 - 1, w, Math.max(.6, h / 2), 0, 0, TAU);
      ctx.fillStyle = DARK; ctx.fill(); ctx.save(); ctx.clip(); ell(ctx, 0, h, w * .7, h * .45, 0, TONG); if (top === "D"){ ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-w, -1.5, w * 2, Math.min(2.2, h * .3)); } ctx.restore(); ctx.stroke(); };
    if (kind === "laugh"){ open(7, 8.5 + Math.sin(t * 16) * 1.3, "D"); }
    else if (kind === "O"){ open(3.6 + m, 4.8 + m * 2.5); }
    else if (m > .06){
      if (kind === "smile" || kind === "smirk") open(5.5, 1.5 + m * 6.5, "D");
      else if (kind === "teeth"){ ctx.beginPath(); rr(ctx, -5.5, -1.5, 11, 3 + m * 6, 2); ctx.fillStyle = DARK; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-4.6, -1, 9.2, 1.8); ctx.fillRect(-4.6, m * 6 - .2, 9.2, 1.8); }
      else open(4.2, 1.2 + m * 6);
    }
    else if (kind === "smile"){ ctx.beginPath(); ctx.arc(0, -3.2, 5.5, .22 * Math.PI, .78 * Math.PI); ctx.stroke(); }
    else if (kind === "smirk"){ ctx.beginPath(); ctx.moveTo(-4, .3); ctx.quadraticCurveTo(1, 2.2, 5.5, -2); ctx.stroke(); }
    else if (kind === "frown"){ ctx.beginPath(); ctx.arc(0, 4.5, 5, 1.22 * Math.PI, 1.78 * Math.PI); ctx.stroke(); }
    else if (kind === "wavy"){ ctx.beginPath(); ctx.moveTo(-5, 0); ctx.quadraticCurveTo(-2.5, -2, 0, 0); ctx.quadraticCurveTo(2.5, 2, 5, 0); ctx.stroke(); }
    else if (kind === "teeth"){ ctx.beginPath(); rr(ctx, -5.5, -2, 11, 5, 1.6); ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.stroke(); ctx.lineWidth = lw * .5; ctx.beginPath(); ctx.moveTo(-5.5, .5); ctx.lineTo(5.5, .5); for (let i = -1; i <= 1; i++){ ctx.moveTo(i * 2.7, -2); ctx.lineTo(i * 2.7, 3); } ctx.stroke(); }
    else if (kind === "zigzag"){ ctx.beginPath(); rr(ctx, -5, -2, 10, 5.5, 2); ctx.fillStyle = DARK; ctx.fill(); ctx.stroke(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = lw * .55; ctx.beginPath(); ctx.moveTo(-4, 0); for (let i = 0; i < 5; i++) ctx.lineTo(-4 + i * 2 + 1, i % 2 ? 0 : 1.8); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-3.6, .3); ctx.quadraticCurveTo(0, 1.1, 3.6, 0); ctx.stroke(); }
    ctx.restore();
  }
  function hairTop(ctx, a, lw, hairC, t, st){
    const h = a.hair || "short", hat = a.hat || (h === "kopiah" ? "kopiah" : null);
    ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = lw;
    if (h === "hijab"){ ctx.beginPath(); ctx.ellipse(0, 1.5, 24.5, 24, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.ellipse(2.2, -1, 17.5, 13.5, 0, Math.PI * 1.95, Math.PI * 1.05, true); ctx.closePath(); ctx.fillStyle = a.hijab || ORANGE; ctx.fill();
      ctx.strokeStyle = "rgba(43,26,18,.35)"; ctx.lineWidth = lw * .7; ctx.beginPath(); ctx.ellipse(2.2, -1, 17.5, 13.5, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.beginPath(); ctx.ellipse(0, 1.5, 24.5, 24, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke(); }
    else if (h === "short" || h === "spiky" || h === "long" || h === "bun" || h === "curly" || h === "side"){
      ctx.beginPath(); ctx.moveTo(-20.8, 3); ctx.bezierCurveTo(-24, -17, -10, -24.5, 2, -24); ctx.bezierCurveTo(15, -23.5, 23, -15, 21, -4);
      if (h === "long" || h === "side"){ ctx.quadraticCurveTo(14, -15, 2, -12); ctx.quadraticCurveTo(-10, -11, -15, -2); }
      else { ctx.quadraticCurveTo(16, -12, 9, -11.5); ctx.quadraticCurveTo(4.5, -15.5, -1, -11.5); ctx.quadraticCurveTo(-8, -15, -13.5, -7.5); }
      ctx.quadraticCurveTo(-16, -3, -16.8, 5); ctx.closePath(); ctx.fillStyle = hairC; ctx.fill(); ctx.stroke();
      if (h === "spiky"){ ctx.beginPath(); [[-14, -18], [-6, -24], [4, -24.5], [13, -21]].forEach(([x, y], i) => { ctx.moveTo(x - 4, y + 3); ctx.lineTo(x + (i - 1) * 1.5, y - 7); ctx.lineTo(x + 5, y + 3); }); ctx.fillStyle = hairC; ctx.fill(); ctx.stroke(); }
      if (h === "bun"){ circ(ctx, -5, -25.5, 7.5, hairC, lw); }
      if (h === "curly"){ for (let i = 0; i < 9; i++){ const an = Math.PI * (1.05 + i * .11); circ(ctx, Math.cos(an) * 20, Math.sin(an) * 19 - 3, 5.6, hairC, lw * .8); } }
      ctx.save(); ctx.globalAlpha *= .25; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = lw * .9; ctx.beginPath(); ctx.arc(2, -8, 13, -2.4, -1.6); ctx.stroke(); ctx.restore(); }
    else if (h === "bald" || h === "kopiah"){ ctx.save(); ctx.globalAlpha *= .4; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = lw * 1.1; ctx.beginPath(); ctx.arc(2, -4, 14, -2.3, -1.5); ctx.stroke(); ctx.restore(); }
    if (hat === "kopiah"){ ctx.beginPath(); ctx.moveTo(-15.5, -13); ctx.lineTo(-13.5, -27); ctx.quadraticCurveTo(0, -29.5, 14, -27); ctx.lineTo(16.5, -13); ctx.quadraticCurveTo(0, -10, -15.5, -13); ctx.closePath(); ctx.fillStyle = a.hatColor || "#1F1B19"; ctx.fill(); ctx.stroke();
      ctx.save(); ctx.globalAlpha *= .3; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = lw * .7; ctx.beginPath(); ctx.moveTo(-11, -24); ctx.lineTo(-9, -15); ctx.stroke(); ctx.restore(); }
    else if (hat === "cap"){ ctx.beginPath(); ctx.ellipse(0, -9, 21, 15.5, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = a.hatColor || ORANGE; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(18, -9.5, 12, 3.2, -.06, 0, TAU); ctx.fillStyle = mixHex(a.hatColor || ORANGE, "#000000", .2); ctx.fill(); ctx.stroke(); circ(ctx, 0, -24.5, 2, mixHex(a.hatColor || ORANGE, "#000000", .2)); }
    else if (hat === "fedora"){ ctx.beginPath(); ctx.ellipse(0, -14, 29, 5.5, 0, 0, TAU); ctx.fillStyle = a.hatColor || "#8E5A34"; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-14.5, -15); ctx.lineTo(-12.5, -32); ctx.quadraticCurveTo(0, -36, 12.5, -32); ctx.lineTo(14.5, -15); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = a.bandColor || ORANGE; ctx.fillRect(-14.2, -20.5, 28.6, 4.2); }
    else if (hat === "helmet"){ ctx.beginPath(); ctx.ellipse(0, -9, 22, 17.5, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = a.hatColor || "#E8B23A"; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -9, 26, 3.6, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.strokeStyle = "rgba(43,26,18,.4)"; ctx.lineWidth = lw * 1.2; ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, -12); ctx.stroke(); }
  }
  function txtU(ctx, txt, x, y, size, fill, f, lw){ ctx.save(); ctx.translate(x, y); ctx.scale(f, 1); font(ctx, 800, size, FAM); ctx.textAlign = "center"; ctx.lineJoin = "round"; ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.strokeText(txt, 0, 0); ctx.fillStyle = fill; ctx.fillText(txt, 0, 0); ctx.restore(); }
  function drawFx(ctx, a, st, ex, t, headY, lw, f){
    const eq = t - st.exprT, e = st.expr;
    ctx.save(); ctx.translate(0, headY); ctx.lineCap = "round";
    if (e === "confused"){ const b = Math.sin(t * 4) * 1.5, s = eBack(clamp(eq / .35, 0, 1)); ctx.save(); ctx.translate(23, -30 + b); ctx.scale(s, s); ctx.rotate(.18); txtU(ctx, "?", 0, 0, 20, HL, f, lw * 1.4); ctx.restore(); if (eq > .5){ ctx.save(); ctx.translate(31, -22 - b); ctx.scale(.6 * s, .6 * s); txtU(ctx, "?", 0, 0, 20, CREAM, f, lw * 2); ctx.restore(); } }
    if (e === "shock" && eq >= 0 && eq < 1.4){ const q = clamp(eq / .3, 0, 1), fade = 1 - clamp((eq - 1) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= fade; ctx.strokeStyle = OUT; ctx.lineWidth = lw * 1.3;
      for (let i = 0; i < 7; i++){ const an = -Math.PI * .95 + i * Math.PI * .15, r0 = 25 + q * 3, r1 = 30 + q * 7 + (i % 2) * 3; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r0, Math.sin(an) * r0); ctx.lineTo(Math.cos(an) * r1, Math.sin(an) * r1); ctx.stroke(); } ctx.restore(); }
    if (e === "angry"){ const p = 1 + Math.sin(t * 9) * .12; ctx.save(); ctx.translate(13, -15); ctx.scale(p, p); ctx.strokeStyle = "#D8432A"; ctx.lineWidth = lw * 1.25;
      for (let i = 0; i < 4; i++){ ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(1.2, -3.8); ctx.quadraticCurveTo(1.6, -1.6, 3.8, -1.2); ctx.stroke(); ctx.restore(); } ctx.restore();
      for (let i = 0; i < 3; i++){ const q = ((t * .9 + i / 3) % 1); ctx.save(); ctx.globalAlpha *= .75 * Math.sin(q * Math.PI); circ(ctx, (i - 1) * 9 + Math.sin(q * 6 + i) * 2, -26 - q * 18, 3 + q * 4, "#FFFFFF", lw * .5); ctx.restore(); } }
    if (e === "scared"){ for (let i = 0; i < 2; i++){ const q = ((t * .8 + i * .5) % 1); ctx.save(); ctx.globalAlpha *= 1 - q * .6; ctx.translate(i ? -21 : 22, -10 + q * 14); ctx.fillStyle = "#8FD0EE"; ctx.beginPath(); ctx.moveTo(0, -5); ctx.bezierCurveTo(3.6, 0, 3, 3.6, 0, 4); ctx.bezierCurveTo(-3, 3.6, -3.6, 0, 0, -5); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .55; ctx.stroke(); ctx.restore(); } }
    if (e === "sad"){ const q = (t * .6) % 1; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = "#8FD0EE"; ctx.beginPath(); ctx.ellipse(2.6 + 9, 3 + q * 12, 1.6, 2.4, 0, 0, TAU); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(90,110,160,.55)"; ctx.lineWidth = lw * .9; for (let i = 0; i < 3; i++){ const x = -10 + i * 10, y0 = -34 - (i % 2) * 3; ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + 2, y0 - 4, x, y0 - 8); ctx.quadraticCurveTo(x - 2, y0 - 12, x, y0 - 16); ctx.stroke(); } }
    if (e === "laugh"){ for (let i = 0; i < 2; i++){ const q = ((t * 1.6 + i * .5) % 1), d = i ? -1 : 1; ctx.save(); ctx.globalAlpha *= 1 - q; ctx.fillStyle = "#8FD0EE"; ctx.beginPath(); ctx.ellipse(2.6 + d * (12 + q * 10), -2 - q * 6 + q * q * 14, 1.6, 2.2, 0, 0, TAU); ctx.fill(); ctx.restore(); } }
    if (e === "proud" || st.emote === "sparkle"){ for (let i = 0; i < 3; i++){ const an = t * 1.4 + i * TAU / 3, s = 2.6 + Math.sin(t * 6 + i) * 1; ctx.fillStyle = i % 2 ? "#F6D36B" : "#FFF4E6"; ctx.save(); ctx.translate(Math.cos(an) * 30, -8 + Math.sin(an) * 22); star(ctx, 0, 0, s); ctx.restore(); } }
    if (st.emote && st.emote !== "sparkle"){ const k2 = t - st.emoteT, s = eBack(clamp(k2 / .3, 0, 1)), b = Math.sin(t * 5) * 1.2; ctx.save(); ctx.translate(18, -34 + b); ctx.scale(s, s); emoteDraw(ctx, st.emote, t, lw, f); ctx.restore(); }
    ctx.restore();
  }
  function emoteDraw(ctx, e, t, lw, f){
    if (e === "!" || e === "?" || e === "!!" || e === "?!"){ txtU(ctx, e, 0, 6, 22, e[0] === "!" ? "#E0503A" : HL, f, lw * 1.4); }
    else if (e === "heart"){ ctx.fillStyle = "#E0503A"; ctx.beginPath(); ctx.moveTo(0, 5); ctx.bezierCurveTo(-9, -1, -6, -10, 0, -5); ctx.bezierCurveTo(6, -10, 9, -1, 0, 5); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); }
    else if (e === "idea"){ glow(ctx, 0, -3, 16, "#FFE08A", .7); ctx.fillStyle = "#FFE08A"; ctx.beginPath(); ctx.arc(0, -3, 6.5, 0, TAU); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .7; ctx.stroke(); ctx.fillStyle = "#B8AE9D"; ctx.fillRect(-3, 3, 6, 4); ctx.strokeRect(-3, 3, 6, 4);
      ctx.strokeStyle = "#F6D36B"; ctx.lineWidth = lw * .8; for (let i = 0; i < 5; i++){ const an = -Math.PI * .9 + i * Math.PI * .2, r = 10 + Math.sin(t * 8) * 1; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r, -3 + Math.sin(an) * r); ctx.lineTo(Math.cos(an) * (r + 4), -3 + Math.sin(an) * (r + 4)); ctx.stroke(); } }
    else if (e === "zzz"){ for (let k = 0; k < 3; k++){ const q = ((t * .4) + k / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(q * Math.PI); txtU(ctx, "Z", k * 5 + q * 4, -q * 14, 8 + k * 2, CREAM, f, lw); ctx.restore(); } }
    else if (e === "sweat"){ ctx.fillStyle = "#8FD0EE"; ctx.beginPath(); ctx.moveTo(0, -6); ctx.bezierCurveTo(4.5, 0, 3.6, 4.4, 0, 4.8); ctx.bezierCurveTo(-3.6, 4.4, -4.5, 0, 0, -6); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = lw * .6; ctx.stroke(); }
    else if (e === "music"){ ctx.fillStyle = OUT; ctx.strokeStyle = OUT; ctx.lineWidth = lw * .8; const b = Math.sin(t * 4) * 2; ctx.beginPath(); ctx.ellipse(-3, 4 + b, 2.6, 2, -.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-.6, 4 + b); ctx.lineTo(-.6, -7 + b); ctx.lineTo(5, -5 + b); ctx.stroke(); }
    else if (e === "check"){ circ(ctx, 0, 0, 8, "#3BB273", lw * .6); ctx.strokeStyle = "#fff"; ctx.lineWidth = lw * 1.1; ctx.beginPath(); ctx.moveTo(-3.5, 0); ctx.lineTo(-1, 3); ctx.lineTo(4, -3); ctx.stroke(); }
    else if (e === "anger"){ ctx.strokeStyle = "#D8432A"; ctx.lineWidth = lw * 1.25; for (let i = 0; i < 4; i++){ ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(1.4, -4.5); ctx.quadraticCurveTo(1.8, -1.8, 4.5, -1.4); ctx.stroke(); ctx.restore(); } }
  }
  // TT.toon(ctx, cam, actor, scene, t[, {depth, st}]) -> anchors (world) + .screen {head, top}
  function toon(ctx, c, a, s, t, o){
    o = o || {}; c = c || CS.cam || CAM0; const st = o.st || toonState(a, s, t);
    ctx.save(); c.apply(ctx, o.depth ?? 1); const r = drawToon(ctx, a, st, t); ctx.restore();
    if (!r) return null;
    const d = o.depth ?? 1, hs = c.toScreen(r.headX, r.headY, d), ts = c.toScreen(r.headX + r.face * r.k * 6, r.top, d);
    r.screen = { head: hs, top: ts, scale: c.scale(d) * r.k };
    if (a.focus || !CS.focus) CS.focus = hs;
    if (st.say) { const txt = st.say, k = t - st.sayT, kind = st.sayKind, side = a.bubbleSide; CS.ov.push(() => bubble(ctx, txt, ts[0], ts[1] - 10, k, { kind, side, t })); }
    return r;
  }
  const toonHead = (st) => [st.x + 2 * st.size / 92 * (st.face || 1), st.y - st.size * 72 / 92];

  /* ---------- speech bubble (screen space) ---------- */
  function bubble(ctx, text, x, y, k, o){
    o = o || {}; if (k < 0) return; const kind = o.kind || "say", size0 = o.size || 50, maxW = o.maxW || 640, tt = o.t ?? k;
    let size = size0, lines; const label = kind === "shout" ? String(text).toUpperCase() : String(text);
    for (;;){ font(ctx, 800, size, FAM); lines = wrapRich(ctx, label, "", maxW).map(l => l.map(z => z.w).join(" ")); if (lines.length <= 3 || size <= 30) break; size -= 4; }
    lines = lines.slice(0, 3); const lh = size * 1.18, tw = Math.max(...lines.map(l => ctx.measureText(l).width)), w = Math.max(160, tw + size * 1.4), h = lines.length * lh + size * .9;
    let bx = clamp(x - w / 2 + (o.side || 0) * w * .25, 90, 990 - w), by = y - h - 70; let below = false;
    if (by < 210){ by = Math.max(210, y + 80); below = true; }
    const sc = eBack(clamp(k / .28, 0, 1)), bob = Math.sin(tt * 3) * 3; if (sc <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y + bob);
    ctx.lineJoin = "round"; const tipX = clamp(x, bx + 40, bx + w - 40);
    ctx.shadowColor = "rgba(30,18,11,.35)"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 10;
    const path = () => { ctx.beginPath();
      if (kind === "shout"){ const n = 22; for (let i = 0; i < n; i++){ const an = i / n * TAU, rx = w / 2 + (i % 2 ? 18 : -4), ry = h / 2 + (i % 2 ? 18 : -4); const px = bx + w / 2 + Math.cos(an) * rx, py = by + h / 2 + Math.sin(an) * ry; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
      else if (kind === "think"){ const n = 12; for (let i = 0; i < n; i++){ const an = i / n * TAU, px = bx + w / 2 + Math.cos(an) * w / 2, py = by + h / 2 + Math.sin(an) * h / 2; ctx.moveTo(px + size * .55, py); ctx.arc(px, py, size * .55, 0, TAU); } ctx.roundRect(bx + 10, by + 10, w - 20, h - 20, h / 2); }
      else { ctx.roundRect(bx, by, w, h, Math.min(46, h / 2)); }
      if (kind === "think"){ const tx = below ? tipX : tipX, ty0 = below ? by : by + h; for (let i = 0; i < 3; i++){ const q = (i + 1) / 4, cx = lerp(tx, x, q), cy = lerp(ty0, y, q), r = size * (.3 - i * .07); ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, TAU); } }
      else if (below){ ctx.moveTo(tipX - 26, by + 4); ctx.lineTo(x, y + 6); ctx.lineTo(tipX + 26, by + 4); }
      else { ctx.moveTo(tipX - 28, by + h - 4); ctx.quadraticCurveTo(tipX - 6, by + h + 30, x, y - 4); ctx.quadraticCurveTo(tipX + 10, by + h + 20, tipX + 30, by + h - 4); } };
    path(); ctx.fillStyle = kind === "shout" ? "#FFF1C9" : "#FFFFFF"; ctx.fill(); ctx.shadowColor = "transparent"; ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); path(); ctx.fill();
    font(ctx, 800, size, FAM); ctx.fillStyle = BROWN; ctx.textAlign = "center"; lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + size * .45 + lh * .8 + i * lh)); ctx.textAlign = "left";
    ctx.restore();
  }

  /* ---------- big outlined text (shared by subtitles, stamp, cta) ---------- */
  function outlineWords(ctx, words, cx, y, size, o){
    // words: [{w, hl}] on one line, centred at cx; o: {fill, hl, stroke, sw, shadow, track}
    font(ctx, 800, size, FAM); spacing(ctx, o.track ?? -1); const sp = ctx.measureText(" ").width + (o.sw || size * .2) * 1.1, ws = words.map(w => ctx.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
    let x = cx - tot / 2; ctx.lineJoin = "round"; ctx.miterLimit = 2;
    if (o.shadow !== false){ ctx.save(); ctx.fillStyle = "rgba(20,12,6,.55)"; let xx = x; words.forEach((w, i) => { ctx.strokeStyle = "rgba(20,12,6,.55)"; ctx.lineWidth = o.sw || size * .22; ctx.strokeText(w.w, xx + size * .02, y + size * .09); xx += ws[i] + sp; }); ctx.restore(); }
    words.forEach((w, i) => { const s = w.s || 1; ctx.save(); if (s !== 1){ ctx.translate(x + ws[i] / 2, y - size * .35); ctx.scale(s, s); ctx.translate(-(x + ws[i] / 2), -(y - size * .35)); }
      ctx.strokeStyle = o.stroke || "#1E120B"; ctx.lineWidth = o.sw || size * .2; ctx.strokeText(w.w, x, y); ctx.fillStyle = w.hl ? (o.hl || HL) : (o.fill || "#FFFFFF"); ctx.fillText(w.w, x, y); ctx.restore(); x += ws[i] + sp; });
    spacing(ctx, 0); return tot;
  }

  /* ---------- Shorts-style subtitles: 1-3 big words following the VO ---------- */
  function wordGroups(st, s){
    if (st._cw) return st._cw;
    const subs = st.subs || [], out = [];
    subs.forEach((c, i) => { const t0 = i ? c.t : st.ss, nxt = i + 1 < subs.length ? subs[i + 1].t : st.se, end = i + 1 < subs.length ? Math.max(t0 + .3, nxt - .22) : nxt;
      const ws = String(c.text).split(/\s+/).filter(Boolean), sy = ws.map(w => Math.max(1, sylCount(w))), tot = sy.reduce((a, b) => a + b, 0) || 1; let acc = 0;
      ws.forEach((w, j) => { out.push({ w, t: t0 + acc / tot * (end - t0), e: t0 + (acc + sy[j]) / tot * (end - t0), last: j === ws.length - 1 }); acc += sy[j]; }); });
    const groups = []; let g = null;
    out.forEach((w, i) => { const clean = w.w.replace(/[,.;:…"“”]+$/g, "").replace(/^["“]+/, ""), len = clean.length;
      if (!g || g.words.length >= 3 || g.len + len > 15 || g.brk){ g = { words: [], len: 0, t: w.t, e: w.e, brk: false }; groups.push(g); }
      g.words.push({ w: clean, t: w.t, e: w.e }); g.len += len + 1; g.e = w.e; if (/[,.;:?!…]$/.test(w.w) || w.last) g.brk = true; });
    groups.forEach((g, i) => { const n = groups[i + 1]; g.end = n ? (n.t - g.e > .5 ? g.e + .45 : n.t) : Math.min(g.e + .5, st.end - st.start + st.start - .2); });
    return (st._cw = groups);
  }
  function subtitleC(ctx, i, t){
    const st = TL.scenes[i], s = P.scenes[i]; if (!st || !s) return;
    if (s.f && s.f.noSub) return;
    const groups = wordGroups(st, s), g = groups.find(x => t >= x.t - .04 && t < x.end); if (!g || !g.words.length) return;
    const q = clamp((t - g.t) / .16, 0, 1), pop = 1 + .16 * (1 - eOut(q)), y0 = (P.motion && P.motion.subY) || 1400;
    let size = 104; font(ctx, 800, size, FAM); spacing(ctx, -1);
    const upper = g.words.map(w => ({ w: w.w.toUpperCase(), t: w.t }));
    const width = () => upper.reduce((a, w) => a + ctx.measureText(w.w).width, 0) + ctx.measureText(" ").width * (upper.length - 1);
    let lines = [upper]; while (width() > 860 && size > 72){ size -= 4; font(ctx, 800, size, FAM); }
    if (width() > 860 && upper.length > 1){ const h = Math.ceil(upper.length / 2); lines = [upper.slice(0, h), upper.slice(h)]; size = 96; font(ctx, 800, size, FAM);
      while (Math.max(...lines.map(l => l.reduce((a, w) => a + ctx.measureText(w.w).width, 0))) > 900 && size > 56){ size -= 4; font(ctx, 800, size, FAM); } }
    else if (width() > 900){ while (width() > 900 && size > 48){ size -= 4; font(ctx, 800, size, FAM); } }
    spacing(ctx, 0);
    let active = -1; upper.forEach((w, j) => { if (t >= w.t - .03) active = j; });
    ctx.save(); ctx.translate(540, y0 - size * .3); ctx.scale(pop, pop); ctx.translate(-540, -(y0 - size * .3)); ctx.globalAlpha *= clamp(q * 3, 0, 1);
    let j0 = 0; lines.forEach((l, li) => { const yy = y0 + (li - (lines.length - 1) / 2) * size * 1.05;
      outlineWords(ctx, l.map((w, j) => { const jj = j0 + j, aq = jj === active ? clamp((t - w.t) / .12, 0, 1) : 1; return { w: w.w, hl: jj === active, s: jj === active ? 1 + .08 * Math.sin(aq * Math.PI) + .03 : 1 }; }), 540, yy, size, {}); j0 += l.length; });
    ctx.restore();
  }

  /* ---------- title stamp + info card (screen space overlays, drawn above the colour grade) ---------- */
  function defer(fn, o){ if (CS.active && !(o && o.world)) CS.ov.push(fn); else fn(); }
  // o: {text:"Line 1\nLine 2", hl:"word", tag:"1 MENIT 1 INSIGHT", at=.15, hold=2.6, y=600, size=118, rot=-3}
  function titleStamp(ctx, o, t){
    const t0 = o.at ?? .15, hold = o.hold ?? 2.6, q = t - t0; if (q < 0 || q > hold + .35) return false;
    defer(() => {
      const yC = o.y ?? 600, rot = (o.rot ?? -3) * Math.PI / 180, inQ = clamp(q / .22, 0, 1), outQ = clamp((q - hold) / .35, 0, 1);
      const s = (2.3 - 1.3 * eOut(inQ)) * (1 + .03 * Math.sin(clamp((q - .22) / .5, 0, 1) * Math.PI * 3) * (1 - clamp((q - .22) / .5, 0, 1))) * (1 - .15 * outQ);
      ctx.save(); ctx.globalAlpha *= clamp(inQ * 4, 0, 1) * (1 - outQ); ctx.translate(540, yC - 60 * eIn(outQ)); ctx.rotate(rot * (inQ < 1 ? 1.6 - .6 * inQ : 1)); ctx.scale(s, s);
      const L = String(o.text || "").split("\n"); let size = o.size || 118; font(ctx, 800, size, FAM); while (Math.max(...L.map(l => ctx.measureText(l.toUpperCase()).width)) > 880 && size > 60){ size -= 4; font(ctx, 800, size, FAM); }
      const hl = (o.hl || "").toUpperCase(), lh = size * 1.02, h = L.length * lh;
      if (o.tag){ font(ctx, 800, 34, FAM); spacing(ctx, 3); const tw = ctx.measureText(o.tag.toUpperCase()).width + 48; ctx.save(); ctx.translate(0, -h / 2 - 54); ctx.rotate(.04); rr(ctx, -tw / 2, -30, tw, 58, 10); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(o.tag.toUpperCase(), 0, 12); ctx.textAlign = "left"; ctx.restore(); spacing(ctx, 0); }
      L.forEach((l, i) => { const U = l.toUpperCase(), words = U.split(" ").filter(Boolean); let hs = hl ? U.indexOf(hl) : -1, pos = 0;
        outlineWords(ctx, words.map(w => { const p = U.indexOf(w, pos); pos = p + w.length; return { w, hl: hs >= 0 && p >= hs && p < hs + hl.length }; }), 0, -h / 2 + lh * (i + .8), size, { sw: size * .24 }); });
      ctx.restore();
      if (q > .2 && q < .9){ const r = (q - .2) / .7; ctx.save(); ctx.globalAlpha *= (1 - r) * .8; ctx.strokeStyle = CREAM; ctx.lineWidth = 10 * (1 - r) + 2; ctx.beginPath(); ctx.ellipse(540, yC, 300 + r * 420, 120 + r * 200, 0, 0, TAU); ctx.stroke();
        for (let i = 0; i < 10; i++){ const an = i / 10 * TAU + .2; ctx.fillStyle = i % 2 ? HL : CREAM; star(ctx, 540 + Math.cos(an) * (260 + r * 380), yC + Math.sin(an) * (110 + r * 200), 16 * (1 - r) + 4); } ctx.restore(); }
    }, o);
    return true;
  }
  // o: {x=540 (centre), y=640 (top), w=780, style:"navy"|"cream", tag, tagColor:"orange"|"yellow", label, big, num:{to, from=0, dec=0, prefix, suffix},
  //     sub, icon, bars:[{v (0..1), label, hl}], at|T (show time, scene seconds), out (hide time), rot=-1.5, world:false}
  function infoCard(ctx, o, t){
    const t0 = o.T ?? o.at ?? 0, q = t - t0, tout = o.outT ?? o.out ?? 1e9; if (q < 0 || t > tout + .35) return false;
    defer(() => {
      const navy = (o.style || "navy") !== "cream", bg = navy ? "#13223D" : "#FFF4E6", bd = navy ? "#2E4670" : "#E3C9A6", ink = navy ? "#FFFFFF" : BROWN, muted = navy ? "#A9BCDD" : "#8A5A3E", accent = navy ? HL : ORANGE;
      const w = o.w || 780, x0 = (o.x ?? 540) - w / 2, y0 = o.y ?? 640, pad = 44, inner = w - pad * 2;
      // measure
      let hh = pad; const parts = [];
      if (o.tag) { parts.push(["tag", hh]); hh += 66; }
      if (o.label){ font(ctx, 800, 52, FAM); let ls = 52; while (ctx.measureText(o.label.toUpperCase()).width > inner - (o.icon ? 110 : 0) && ls > 30){ ls -= 2; font(ctx, 800, ls, FAM); } parts.push(["label", hh, ls]); hh += ls * 1.25; }
      if (o.big != null || o.num){ parts.push(["big", hh]); hh += 170; }
      let subL = []; if (o.sub){ font(ctx, 600, 38, FAM); subL = wrapRich(ctx, o.sub, "", inner).map(l => l.map(z => z.w).join(" ")).slice(0, 3); parts.push(["sub", hh]); hh += subL.length * 48 + 6; }
      if (o.bars){ parts.push(["bars", hh]); hh += 300; }
      hh += pad - 10; const h = o.h || hh;
      const inQ = eBack(clamp(q / .42, 0, 1)), outQ = clamp((t - tout) / .35, 0, 1), rot = ((o.rot ?? -1.5) + (1 - clamp(q / .5, 0, 1)) * -6) * Math.PI / 180;
      ctx.save(); ctx.globalAlpha *= clamp(q / .12, 0, 1) * (1 - outQ); ctx.translate(x0 + w / 2, y0 + h / 2); ctx.rotate(rot); const s = (.55 + .45 * inQ) * (1 - .2 * outQ); ctx.scale(s, s); ctx.translate(-(x0 + w / 2), -(y0 + h / 2));
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 18; rr(ctx, x0, y0, w, h, 30); ctx.fillStyle = bg; ctx.fill(); ctx.restore();
      rr(ctx, x0, y0, w, h, 30); ctx.strokeStyle = bd; ctx.lineWidth = 5; ctx.stroke(); rr(ctx, x0 + 14, y0 + 14, w - 28, h - 28, 20); ctx.strokeStyle = hexA(navy ? "#5D7BB0" : "#C2691F", .22); ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); rr(ctx, x0, y0, w, h, 30); ctx.clip(); const sh = (q - .35) / .7; if (sh > 0 && sh < 1){ const sx = x0 - 200 + sh * (w + 400); ctx.fillStyle = lg(ctx, sx - 120, 0, sx + 120, 0, [[0, "rgba(255,255,255,0)"], [.5, "rgba(255,255,255,.18)"], [1, "rgba(255,255,255,0)"]]); ctx.translate(sx, y0); ctx.rotate(.3); ctx.fillRect(-120, -200, 240, h + 400); } ctx.restore();
      parts.forEach(([k, y, ls]) => { const yy = y0 + y;
        if (k === "tag"){ font(ctx, 800, 30, FAM); spacing(ctx, 2); const T = o.tag.toUpperCase(), tw = Math.min(inner, ctx.measureText(T).width + 40); rr(ctx, x0 + pad, yy, tw, 50, 8); ctx.fillStyle = o.tagColor === "yellow" ? "#E8B23A" : ORANGE; ctx.fill(); ctx.fillStyle = o.tagColor === "yellow" ? BROWN : "#FFF4E6"; ctx.fillText(T, x0 + pad + 20, yy + 36); spacing(ctx, 0); }
        if (k === "label"){ font(ctx, 800, ls, FAM); ctx.fillStyle = ink; ctx.fillText(o.label.toUpperCase(), x0 + pad, yy + ls * .95);
          if (o.icon){ const r = 46, cx = x0 + w - pad - r, cy = yy + ls * .5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = accent; ctx.fill(); icon(ctx, o.icon, cx - r * .55, cy - r * .55, r * 1.1, "#FFFFFF", 2.2); } }
        if (k === "big"){ let txt = o.big != null ? String(o.big) : ""; if (o.num){ const n = o.num, v = lerp(n.from || 0, n.to, eOut(clamp((q - .25) / 1.3, 0, 1))); txt = (n.prefix || "") + v.toFixed(n.dec || 0).replace(".", ",") + (n.suffix || ""); }
          let bs = 150; font(ctx, 800, bs, FAM); while (ctx.measureText(txt).width > inner && bs > 60){ bs -= 6; font(ctx, 800, bs, FAM); } ctx.fillStyle = accent; ctx.fillText(txt, x0 + pad - 4, yy + 140); }
        if (k === "sub"){ font(ctx, 600, 38, FAM); ctx.fillStyle = muted; subL.forEach((l, i) => ctx.fillText(l, x0 + pad, yy + 38 + i * 48)); }
        if (k === "bars"){ const B = o.bars, n = B.length, gap = 18, bw = (inner - gap * (n - 1)) / n, base = yy + 240;
          B.forEach((b, i) => { const g = eOut(clamp((q - .3 - i * .12) / .7, 0, 1)), bh = 200 * clamp(b.v, 0, 1) * g; rr(ctx, x0 + pad + i * (bw + gap), base - bh, bw, Math.max(2, bh), [10, 10, 2, 2]);
            ctx.fillStyle = b.hl ? accent : (navy ? lg(ctx, 0, base - 200, 0, base, [[0, "#E8C49A"], [1, "#8C6A4C"]]) : "#E8B98A"); ctx.fill();
            if (b.label){ font(ctx, 700, 26, FAM); ctx.fillStyle = muted; ctx.textAlign = "center"; let L2 = String(b.label); while (ctx.measureText(L2).width > bw + gap - 4 && L2.length > 2) L2 = L2.slice(0, -1); ctx.fillText(L2, x0 + pad + i * (bw + gap) + bw / 2, base + 36); ctx.textAlign = "left"; } });
          ctx.strokeStyle = hexA(ink, .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + pad, base + 2); ctx.lineTo(x0 + w - pad, base + 2); ctx.stroke(); } });
      ctx.restore();
    }, o);
    return true;
  }

  /* ---------- colour grade + header/footer ---------- */
  function grade(ctx, g){
    g = g || { warm: .12, vig: .4 }; ctx.save();
    if (g.warm){ ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = hexA("#E0893A", Math.min(1, g.warm * 2.2)); ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over"; }
    if (g.cream){ ctx.fillStyle = hexA("#FBE9D7", g.cream); ctx.fillRect(0, 0, W, H); }
    if (g.vig){ ctx.fillStyle = rg(ctx, 540, 900, 520, 1300, [[0, "rgba(43,26,18,0)"], [1, `rgba(36,20,12,${g.vig})`]]); ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }
  function chipC(ctx){
    ctx.save(); ctx.fillStyle = lg(ctx, 0, 0, 0, 240, [[0, "rgba(20,12,6,.5)"], [1, "rgba(20,12,6,0)"]]); ctx.fillRect(0, 0, W, 240);
    ctx.fillStyle = lg(ctx, 0, 1740, 0, 1920, [[0, "rgba(20,12,6,0)"], [1, "rgba(20,12,6,.5)"]]); ctx.fillRect(0, 1740, W, 180);
    const bn = P.brand.name || ""; font(ctx, 700, 34, FAM); spacing(ctx, -.3); const bw = 50 + 14 + ctx.measureText(bn).width, bx = 540 - bw / 2;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2; ctx.beginPath(); ctx.arc(bx + 25, 92, 29, 0, TAU); ctx.fillStyle = "rgba(255,244,230,.95)"; ctx.fill(); ctx.restore();
    drawLogo(ctx, bx + 2, 69, 46);
    ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2; ctx.fillStyle = "#FFFFFF"; ctx.fillText(bn, bx + 64, 104); spacing(ctx, 0);
    const site = P.brand.site || ""; if (site){ font(ctx, 600, 28, FAM); const w = ctx.measureText(site).width, x0 = 540 - (w + 38) / 2; ctx.shadowBlur = 0; ctx.shadowColor = "transparent"; icon(ctx, "link", x0, 1846, 26, "#F4A85C", 2.4); ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 8; ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.fillText(site, x0 + 38, 1868); }
    ctx.restore();
  }

  /* ---------- the generic data-driven scene "cerita" ---------- */
  // f: {env, envOpt, cam:[keys], camOpt, toons:[actor], props:[{type, x, y, s, at|cue, front}], cards:[infoCard spec with cue/outCue], stamp:{text, hl, tag, at, hold, y}, front:true}
  function sceneCerita(ctx, th, s, t){
    const f = s.f || {}, toons = f.toons || [], idx = G.scene;
    const sts = toons.map(a => toonState(a, s, t));
    const resolve = (on, tt, k) => { const j = typeof on === "number" ? on : toons.findIndex(a => a.id === on); if (j < 0 || !toons[j]) return null; const st = sts[j], hp = toonHead(st);
      const z = k.fit ? (W * k.fit) / (st.size * 42 / 92) : null; return [hp[0] + (k.dx || 0), hp[1] + (k.dy ?? (k.fit ? st.size * .06 : 0)), z]; };
    const c = cam(s, t, f.cam || [{ at: 0, x: 540, y: 960, zoom: 1 }], Object.assign({ resolve }, f.camOpt || {}));
    const eo = Object.assign({}, f.envOpt || {}); env(ctx, f.env || "office", t, c, eo);
    const propOn = p => { const T = p.cue ? cueT(s, p.cue, .3, idx) : (p.at ?? -1); const q = t - T; return q < 0 ? 0 : eBack(clamp(q / .35, 0, 1)); };
    const drawProps = front => (f.props || []).filter(p => !!p.front === front).forEach(p => { const q = propOn(p); if (q <= 0) return; ctx.save(); c.apply(ctx, p.depth ?? 1); ctx.translate(p.x ?? 540, p.y ?? GROUND); ctx.scale(q, q); prop(ctx, p.type, 0, 0, p, t); ctx.restore(); });
    drawProps(false);
    toons.map((a, j) => [a, j]).sort((p, q) => (p[0].z || 0) - (q[0].z || 0)).forEach(([a, j]) => toon(ctx, c, a, s, t, { st: sts[j] }));
    drawProps(true);
    if (f.front !== false) envFront(ctx, f.env || "office", t, c, eo);
    (f.cards || []).forEach((cd, j) => infoCard(ctx, Object.assign({}, cd, { T: cd.cue ? cueT(s, cd.cue, .2 + j * .2, idx) : (cd.at ?? .3), outT: cd.outCue ? cueT(s, cd.outCue, .9, idx) : (cd.out ?? 1e9) }), t));
    if (f.stamp) titleStamp(ctx, Object.assign({}, f.stamp, { at: f.stamp.cue ? cueT(s, f.stamp.cue, .05, idx) : f.stamp.at }), t);
  }
  function sfxCerita(s, f, i, add){
    const kt = (k, j) => keyT(s, k, j, i);
    (f.cam || []).forEach((k, j) => { if (k.shake) add(kt(k, j), "pop"); if (k.cut && kt(k, j) > .2) add(kt(k, j), "whoosh"); });
    (f.toons || []).forEach(a => (a.keys || []).forEach((k, j) => { const T = kt(k, j); if (k.say != null) add(T, "pop"); if (k.jump) add(T + .13, "whoosh"); if (k.expr === "shock") add(T, "ping"); if (k.emote === "idea" || k.emote === "check") add(T, "chime"); }));
    (f.cards || []).forEach((cd, j) => add(cd.cue ? cueT(s, cd.cue, .2 + j * .2, i) : (cd.at ?? .3), "pop"));
    (f.props || []).forEach(p => { if (p.cue) add(cueT(s, p.cue, .3, i), "pop"); });
    if (f.stamp) add((f.stamp.cue ? cueT(s, f.stamp.cue, .05, i) : (f.stamp.at ?? .15)) + .2, "chime");
  }

  /* ---------- cta in cerita mode ---------- */
  function ctaC(ctx, th, s, t, T){
    const f = s.f || {}, mo = P.motion || {}, tH = Math.max(T.head ?? 2, f.question ? 2.4 : 0), tL = Math.max(T.logo ?? 2.4, tH + .3), tP = Math.max(T.pill ?? 3.2, tH + .8);
    const host = Object.assign({ x: 540, size: 780, hair: "hijab", hijab: ORANGE, shirt: "#3B2418", skin: "d", talk: true, focus: true }, mo.host || {}, f.host || {});
    host.keys = host.keys || [{ at: 0, pose: "wave", expr: "happy" }, { at: tH, pose: "pointUp", expr: "happy" }, { at: tP, pose: "cheer", expr: "laugh", jump: 120 }];
    const c = cam(s, t, [{ at: 0, x: 540, y: 1180, zoom: 1.35 }, { at: tH - .7, x: 540, y: 930, zoom: 1, dur: 1.0 }], { push: .002 });
    env(ctx, f.env || mo.ctaEnv || "beach", t, c, Object.assign({ time: "dusk" }, f.envOpt || mo.ctaEnvOpt || {}));
    const st = toonState(host, s, t); const r = toon(ctx, c, host, s, t, { st });
    envFront(ctx, f.env || mo.ctaEnv || "beach", t, c, Object.assign({ time: "dusk" }, f.envOpt || {}));
    if (f.question && t > .25 && t < tH) { const k = t - .25; CS.ov.push(() => bubble(ctx, f.question, r ? r.screen.top[0] : 540, r ? r.screen.top[1] - 10 : 800, k, { size: 54, t })); }
    defer(() => {
      if (t > tL){ const q = eBack(clamp((t - tL) / .5, 0, 1)); ctx.save(); ctx.translate(540, 300); ctx.scale(q, q);
        for (let k = 0; k < 3; k++){ const w = ((t - tL) * .6 + k / 3) % 1; ctx.strokeStyle = hexA("#F4A85C", .5 * (1 - w)); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 96 + w * 120, 0, TAU); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(0, 0, 96, 0, TAU); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.stroke(); drawLogo(ctx, -64, -64, 128); ctx.restore(); }
      if (t > tH && f.headline){ const q = clamp((t - tH) / .25, 0, 1), L = String(f.headline).split("\n"), hl = (f.highlight || "").toUpperCase(); let size = 104; font(ctx, 800, size, FAM);
        while (Math.max(...L.map(l => ctx.measureText(l.toUpperCase()).width)) > 900 && size > 56){ size -= 4; font(ctx, 800, size, FAM); }
        ctx.save(); ctx.globalAlpha *= q; const s2 = 1.6 - .6 * eOut(q); ctx.translate(540, 540); ctx.scale(s2, s2); ctx.translate(-540, -540);
        L.forEach((l, i) => { const U = l.toUpperCase(), ws = U.split(" ").filter(Boolean); const hs = hl ? U.indexOf(hl) : -1; let pos = 0;
          outlineWords(ctx, ws.map(w => { const p = U.indexOf(w, pos); pos = p + w.length; return { w, hl: hs >= 0 && p >= hs && p < hs + hl.length }; }), 540, 500 + i * size * 1.05, size, { sw: size * .22 }); }); ctx.restore(); }
      if (t > tP && f.pill){ const q = eBack(clamp((t - tP) / .4, 0, 1)); font(ctx, 800, 50, FAM); const w = ctx.measureText(f.pill.toUpperCase()).width + 90; ctx.save(); ctx.translate(540, 1390); ctx.scale(q, q); ctx.rotate(-.03);
        rr(ctx, -w / 2, -52, w, 104, 52); ctx.fillStyle = ORANGE; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.stroke(); ctx.fillStyle = CREAM; ctx.textAlign = "center"; ctx.fillText(f.pill.toUpperCase(), 0, 18); ctx.textAlign = "left"; ctx.restore();
        const dt = t - tP; if (dt < 2.2){ for (let i = 0; i < 30; i++){ const an = -Math.PI / 2 + (rnd(i + 3) - .5) * 2.8, v = 600 + rnd(i + 9) * 800, x = 540 + Math.cos(an) * v * dt, y = 1390 + Math.sin(an) * v * dt + 1100 * dt * dt;
          ctx.save(); ctx.globalAlpha *= clamp(1.8 - dt, 0, 1); ctx.translate(x, y); ctx.rotate(dt * 8 + i); ctx.fillStyle = [ORANGE, "#F4A85C", CREAM, "#E8B23A"][i % 4]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); } } }
      const url = f.url || P.brand.url || "", tU = T.url ?? 4; if (url && t > tU){ const q = clamp((t - tU) / .4, 0, 1); ctx.save(); ctx.globalAlpha *= q; outlineWords(ctx, [{ w: url }], 540, 1540, 64, { sw: 14 }); ctx.restore(); }
    });
  }

  /* ---------- scene + frame renderer for cerita mode ---------- */
  function drawSceneC(ctx, th, i, t){
    const st = TL.scenes[i], s = P.scenes[i]; if (!s || !st) return;
    const lt = t - st.start; G.lt = lt; G.scene = i; G.enterStart = null;
    CS.ov = []; CS.focus = null; CS.grade = null; CS.cam = CAM0; CS.active = true;
    ctx.save();
    try {
      if (CERITA.has(s.layout)) R[s.layout](ctx, th, s, lt, st.T, i === 0);
      else if (s.layout === "cta") ctaC(ctx, th, s, lt, st.T);
      else { drawBg(ctx, th, t); (R[s.layout] || (() => {}))(ctx, th, s, lt, st.T, i === 0); CS.grade = { warm: 0, vig: .25 }; }
    } catch (e) { console.error(e); }
    ctx.restore();
    CS.active = false;
    grade(ctx, CS.grade);
    CS.ov.forEach(fn => { ctx.save(); try { fn(); } catch (e) { console.error(e); } ctx.restore(); });
    CS.ov = []; CS.focusOf[i] = CS.focus || [540, 900];
  }
  let OFF = null;
  function offscreen(){ if (!OFF){ OFF = document.createElement("canvas"); OFF.width = W; OFF.height = H; } const x = OFF.getContext("2d"); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.filter = "none"; x.globalCompositeOperation = "source-over"; x.clearRect(0, 0, W, H); return x; }
  const TRD = { whip: .42, zoom: .5, iris: .8, fade: .6, cut: 0, flash: .3 };
  function transKind(b){ const s = P.scenes[b], own = s && ((s.f && s.f.trans) || s.trans); if (own) return own; const L = (P.motion && P.motion.transitions) || ["whip", "iris", "zoom", "whip", "fade", "iris"]; return L[(b - 1) % L.length] || "whip"; }
  function drawFrameC(ctx, t){
    if (!TL) buildTimeline();
    const th = theme(); TT.mv(); ctx.save(); ctx.textAlign = "left"; ctx.globalAlpha = 1;
    let i = TL.scenes.findIndex(st => t < st.end); if (i < 0) i = TL.scenes.length - 1;
    const st = TL.scenes[i], nxt = TL.scenes[i + 1];
    let tr = null;
    if (i > 0){ const k = transKind(i), D = TRD[k] ?? .45; if (D && t - st.start < D / 2) tr = { b: i, kind: k, p: .5 + (t - st.start) / D }; }
    if (!tr && nxt){ const k = transKind(i + 1), D = TRD[k] ?? .45; if (D && nxt.start - t < D / 2) tr = { b: i + 1, kind: k, p: .5 - (nxt.start - t) / D }; }
    ctx.fillStyle = "#120A05"; ctx.fillRect(0, 0, W, H);
    if (!tr) drawSceneC(ctx, th, i, t);
    else {
      const p = clamp(tr.p, 0, 1), out = p < .5, si = out ? tr.b - 1 : tr.b, k = tr.kind;
      if (k === "whip"){
        const x = offscreen(); drawSceneC(x, th, si, t); const q = out ? eIn(p * 2) : 1 - eOut((p - .5) * 2), dx = (out ? -1 : 1) * q * W * 1.05, spread = 90 * q;
        for (let j = 0; j < 6; j++){ ctx.save(); ctx.globalAlpha = 1 / (j + 1); ctx.drawImage(OFF, dx + (j - 2.5) * spread / 2.5 * (out ? -1 : 1), 0, W, H); ctx.restore(); }
        ctx.save(); ctx.globalAlpha = q * .7; ctx.fillStyle = "#FFF4E6"; for (let j = 0; j < 14; j++){ const y = rnd(j + Math.floor(t * 30)) * H, L = 300 + rnd(j + 5) * 600, xx = rnd(j + 9) * W; ctx.fillRect(xx - L / 2, y, L, 3 + rnd(j) * 5); } ctx.restore();
      } else if (k === "zoom"){
        const x = offscreen(); drawSceneC(x, th, si, t); const fc = CS.focusOf[si] || [540, 900];
        const sc = out ? 1 + 2.4 * eIn(p * 2) : 1 + 1.2 * (1 - eOut((p - .5) * 2)), bl = out ? 18 * eIn(p * 2) : 14 * (1 - eOut((p - .5) * 2));
        ctx.save(); ctx.translate(fc[0], fc[1]); ctx.scale(sc, sc); ctx.translate(-fc[0], -fc[1]); if (bl > .5) ctx.filter = `blur(${bl.toFixed(1)}px)`; ctx.drawImage(OFF, 0, 0, W, H); ctx.restore();
        const fl = 1 - Math.abs(p - .5) / .2; if (fl > 0){ ctx.save(); ctx.globalAlpha = clamp(fl, 0, 1) * .85; ctx.fillStyle = "#FFF4E6"; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      } else if (k === "iris"){
        drawSceneC(ctx, th, si, t); const fc = CS.focusOf[si] || [540, 900];
        let r; if (out){ const q = p * 2; r = q < .55 ? lerp(1500, 190, easeIO(q / .55)) : q < .8 ? lerp(190, 165, (q - .55) / .25) : lerp(165, 0, eIn((q - .8) / .2)); } else r = lerp(0, 1500, eOut((p - .5) * 2));
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(fc[0] + r, fc[1]); ctx.arc(fc[0], fc[1], Math.max(.1, r), 0, TAU, true); ctx.fillStyle = "#120A05"; ctx.fill("evenodd");
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(fc[0], fc[1], Math.max(.1, r), 0, TAU); if (r > 4) ctx.stroke(); ctx.restore();
      } else if (k === "fade" || k === "flash"){
        drawSceneC(ctx, th, si, t); const a = out ? clamp(p * 2.4, 0, 1) : clamp((1 - p) * 2.4, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = k === "flash" ? "#FFF4E6" : "#120A05"; ctx.fillRect(0, 0, W, H); ctx.restore();
      } else drawSceneC(ctx, th, i, t);
    }
    // subtitles (not in the cta after its headline appears), header + footer
    const s = P.scenes[i], lt = t - st.start;
    const subA = tr ? clamp((Math.abs(tr.p - .5) - .3) * 6, 0, 1) : 1;
    if (subA > 0 && !(s && s.layout === "cta" && lt > Math.max(st.T.head ?? 99, s.f && s.f.question ? 2.4 : 0))){ G.scene = i; ctx.save(); ctx.globalAlpha *= subA; try { subtitleC(ctx, i, t); } catch (e) { console.error(e); } ctx.restore(); }
    chipC(ctx);
    ctx.restore();
  }

  /* ---------- hook into the engine (only active for "mode": "cerita") ---------- */
  const _drawFrame = drawFrame;
  drawFrame = function(ctx, t){ return isC() ? drawFrameC(ctx, t) : _drawFrame(ctx, t); };
  const _info = window.motionInfo;
  window.motionInfo = () => { const r = _info(); if (isC()) Object.assign(r, { mode: "cerita", transitions: (P.motion && P.motion.transitions) || ["whip", "iris", "zoom", "whip", "fade", "iris"], subtitle: "shorts", camera: "cerita" }); return r; };

  function scene(name, labelText, draw, sfx, fields){ TT.layout(name, labelText, draw, sfx, fields || []); CERITA.add(name); }
  scene("cerita", "Cerita (adegan kartun layar penuh)", sceneCerita, sfxCerita);
  Object.assign(TT, { isCerita: isC, scene, cam, env, envFront, prop, toon, toonState, drawToon, toonHead, bubble, titleStamp, infoCard, outlineWords, grade, voLevel, layer,
    ENV_KINDS: Object.keys(ENV), TOON_POSES: Object.keys(TP).concat(["walk", "run", "jump"]), TOON_EXPRS: Object.keys(EXP), CERITA_GROUND: GROUND, CS });
})();
