/* Scene pack TEMPLATE. Copy to engine/packs/<name>.js. Runs after motion-tangani.js in its own <script>.
   Engine globals available directly: rr, font, icon, hexA, clamp, eOut, eBack, prog, headline, drawRich, wrapRich, TL, P, R, W.
   Pack helpers come from TT (see destructuring below). Canvas is 1080x1920; header logo ~y 0-150,
   headline (topHead) ~y 250-460, keep visuals in y ~560-1330 (subtitle sits ~y 1380-1500), footer ~y 1800. */
(() => {
  'use strict';
  const { cueT, popS, label, disc, burst, topHead, INK, keyTimes, actorState, drawActor, bubbleAt, emoteAt, sceneDur, panel, pill, mv, easeIO, TAU, G } = TT;
  // cueT(s, cueWord, fallbackFraction, sceneIdx?) -> local seconds when cueWord is spoken in this scene (fallback = fraction of scene)
  const at = (s, c, fr) => cueT(s, c, fr);

  TT.layout("demo", "Demo", (ctx, th, s, t) => {
    const f = s.f, M = mv(); topHead(ctx, th, f, t); if (!popS(t, .1)) return;
    (f.items || []).forEach((it, i) => { const ti = at(s, it.cue, .2 + i * .2); if (t < ti) return;
      const q = eBack(clamp((t - ti) / .45, 0, 1)); ctx.save(); ctx.translate(540, 760 + i * 170); ctx.scale(q, q);
      pill(ctx, th, it.label, 0, 0, M.pal[i % 3], "#fff", 40); ctx.restore(); burst(ctx, 540, 760 + i * 170, t - ti, M, 8); });
  }, (s, f, i, add) => { (f.items || []).forEach((it, k) => add(cueT(s, it.cue, .2 + k * .2, i), "pop")); });
})();
