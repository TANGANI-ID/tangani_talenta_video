/* AUDIO16 — offline audio mix for 16:9 episodes: narration (decoded mp3 per adegan), synthesized SFX
   (S16.events), location ambience and a soft generative music bed per adegan mood, ducked under the voice.
   A16.build({dur, vo:[{t, b64}], moods:[{t0, t1, mood}], amb:[{t0, t1, kind}]}) -> {bytes, env}
   A16.chunk(i, size) -> base64 of WAV bytes (16-bit stereo 48 kHz). env = VO loudness (100 Hz) for lip-flap. */
(() => {
  'use strict';
  const SR = 48000;
  const rnd = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const b64ab = b => { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u.buffer; };
  let NOISE = null, JOBS = [];
  const J = (t, fn) => JOBS.push({ t, fn });
  const noise = ac => { if (NOISE && NOISE.sampleRate === ac.sampleRate) return NOISE; const b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd(i * .37 + 1) * 2 - 1; NOISE = b; return b; };
  function env(g, t, a, peak, hold, rel){ g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(.0002, peak), t + a); if (hold) g.gain.setValueAtTime(Math.max(.0002, peak), t + a + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + a + (hold || 0) + rel); }
  function osc(ac, out, type, f0, f1, t, a, peak, hold, rel, pan){ const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + a + (hold || 0) + rel * .6);
    env(g, t, a, peak, hold, rel); let n = g; if (pan){ const p = ac.createStereoPanner(); p.pan.value = pan; g.connect(p); n = p; } o.connect(g); n.connect(out); o.start(t); o.stop(t + a + (hold || 0) + rel + .05); }
  function nz(ac, out, t, dur, type, f0, f1, q, peak, a, rel, pan){ const s = ac.createBufferSource(); s.buffer = noise(ac); s.loop = true; const f = ac.createBiquadFilter(); f.type = type; f.Q.value = q || 1; f.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain(); env(g, t, a || .01, peak, Math.max(0, dur - (a || .01) - (rel || .05)), rel || .05); let n = g; if (pan){ const p = ac.createStereoPanner(); p.pan.value = pan; g.connect(p); n = p; } s.connect(f); f.connect(g); n.connect(out); s.start(t, rnd(t) * 1.5); s.stop(t + dur + .1); }

  const SFX = {
    pop(ac, o, t, v){ osc(ac, o, "sine", 480, 920, t, .012, .32 * v, 0, .12); },
    whoosh(ac, o, t, v){ nz(ac, o, Math.max(0, t - .45), 1, "bandpass", 350, 2600, .9, .5 * v, .45, .5); },
    ping(ac, o, t, v){ [1318.5, 1760].forEach((f, k) => osc(ac, o, "sine", f, f, t + k * .08, .01, .2 * v, 0, .35)); },
    chime(ac, o, t, v){ [[784, 1], [1175, .6], [1568, .45], [2350, .25]].forEach(([f, a]) => osc(ac, o, "sine", f, f, t, .015, .2 * v * a, 0, 1.5)); },
    thud(ac, o, t, v){ osc(ac, o, "sine", 110, 40, t, .005, .55 * v, 0, .35); nz(ac, o, t, .12, "lowpass", 600, 200, .7, .25 * v); },
    boing(ac, o, t, v){ osc(ac, o, "triangle", 220, 520, t, .01, .16 * v, .05, .22); },
    stamp(ac, o, t, v){ osc(ac, o, "sine", 160, 55, t, .004, .5 * v, 0, .3); nz(ac, o, t, .09, "bandpass", 1200, 900, 1.2, .35 * v); },
    dun(ac, o, t, v){ osc(ac, o, "sine", 65, 45, t, .01, .6 * v, .2, 2.2); osc(ac, o, "triangle", 130, 98, t, .01, .18 * v, .1, 1.6); nz(ac, o, t, 1.2, "lowpass", 500, 120, .7, .2 * v, .01, 1); },
    stinger(ac, o, t, v){ [261.6, 329.6, 392, 523.3, 587.3, 784].forEach((f, k) => { osc(ac, o, "triangle", f, f, t + k * .025, .02, .09 * v, .3, 1.8, (k % 2 ? .3 : -.3)); }); osc(ac, o, "sine", 65.4, 65.4, t, .01, .4 * v, .2, 1.2); SFX.chime(ac, o, t + .1, .6 * v); },
    notif(ac, o, t, v){ osc(ac, o, "sine", 880, 880, t, .006, .22 * v, 0, .25); osc(ac, o, "sine", 1318.5, 1318.5, t + .12, .006, .22 * v, 0, .45); },
    send(ac, o, t, v){ nz(ac, o, t - .1, .35, "bandpass", 800, 4000, 1.2, .25 * v, .15, .15); osc(ac, o, "sine", 660, 1320, t + .1, .01, .18 * v, 0, .2); },
    star(ac, o, t, v){ osc(ac, o, "sine", 1568, 2093, t, .005, .14 * v, 0, .25); },
    sparkle(ac, o, t, v){ for (let k = 0; k < 7; k++) osc(ac, o, "sine", 1800 + rnd(k + t) * 1800, 2600 + rnd(k) * 1200, t + k * .06, .004, .1 * v, 0, .2, (rnd(k + 3) - .5)); },
    confetti(ac, o, t, v){ SFX.pop(ac, o, t, v); nz(ac, o, t, .5, "highpass", 3000, 5000, .7, .12 * v, .01, .3); SFX.sparkle(ac, o, t + .1, .8 * v); },
    click(ac, o, t, v){ nz(ac, o, t, .03, "highpass", 2500, 2500, .7, .5 * v, .001, .02); },
    tap(ac, o, t, v){ osc(ac, o, "sine", 180, 90, t, .003, .4 * v, 0, .12); nz(ac, o, t, .05, "lowpass", 900, 400, .8, .3 * v, .002, .04); },
    knock(ac, o, t, v){ SFX.tap(ac, o, t, v * 1.3); },
    buzz(ac, o, t, v, d){ for (let k = 0; k < Math.max(2, Math.round((d || 1.4) / .5)); k++){ J(t + k * .5, () => osc(ac, o, "square", 150, 150, t + k * .5, .01, .05 * v, .28, .05)); } },
    ring(ac, o, t, v, d){ for (let k = 0; k < Math.max(1, Math.round((d || 2) / 1.2)); k++){ for (let j = 0; j < 8; j++){ const s = t + k * 1.2 + j * .05; osc(ac, o, "sine", 440, 440, s, .003, .09 * v, .02, .02); osc(ac, o, "sine", 480, 480, s, .003, .09 * v, .02, .02); } } },
    tick(ac, o, t, v, d){ for (let k = 0; k < Math.max(1, Math.floor(d || 2)); k++){ const s = t + k; J(s, () => { nz(ac, o, s, .025, "bandpass", k % 2 ? 2400 : 3000, 0, 4, .35 * v, .001, .02); osc(ac, o, "sine", k % 2 ? 1100 : 1400, 0, s, .001, .06 * v, 0, .04); }); } },
    tickfast(ac, o, t, v, d){ for (let k = 0; k < Math.floor((d || 2) / .14); k++){ const s = t + k * .14; J(s, () => nz(ac, o, s, .02, "bandpass", k % 2 ? 2400 : 3200, 0, 4, .22 * v, .001, .015)); } },
    typing(ac, o, t, v, d){ let s = t; for (let k = 0; s < t + (d || 2); k++){ const s0 = s; J(s0, () => nz(ac, o, s0, .025, "bandpass", 1800 + rnd(k) * 1800, 0, 2, (.12 + rnd(k + 5) * .1) * v, .001, .02, rnd(k + 9) * .4 - .2)); s += .07 + rnd(k + 2) * .14 + (rnd(k + 7) > .9 ? .35 : 0); } },
    scribble(ac, o, t, v, d){ for (let k = 0; k < (d || 1) / .12; k++){ const s = t + k * .12; J(s, () => nz(ac, o, s, .1, "bandpass", 2200 + rnd(k) * 1500, 0, 2.5, .14 * v, .01, .05)); } },
    bus(ac, o, t, v, d){ nz(ac, o, t, d || 4, "lowpass", 180, 260, .7, .5 * v, 1, 1.2); osc(ac, o, "sawtooth", 48, 52, t, 1, .05 * v, Math.max(0, (d || 4) - 2.2), 1.2); },
    riser(ac, o, t, v, d){ nz(ac, o, t, d || 3, "bandpass", 300, 3500, 2, .18 * v, (d || 3) * .9, .1); osc(ac, o, "sine", 110, 220, t, (d || 3) * .9, .08 * v, 0, .1); },
    rise(ac, o, t, v){ [523.3, 659.3, 784, 1046.5].forEach((f, k) => osc(ac, o, "triangle", f, f, t + k * .12, .01, .12 * v, 0, .5)); },
    applause(ac, o, t, v, d){ d = d || 3; for (let k = 0; k < d * 70; k++){ const s = t + rnd(k * 1.7) * d, fade = Math.min(1, (s - t) / .3) * Math.pow(1 - (s - t) / d, 1.5); J(s, () => nz(ac, o, s, .03, "bandpass", 1200 + rnd(k) * 2200, 0, 1.5, (.08 + rnd(k + 3) * .1) * v * fade + .0003, .002, .025, rnd(k + 5) * 1.4 - .7)); }
      nz(ac, o, t, d, "bandpass", 1500, 1500, .5, .06 * v, .2, d * .6); },
    cheer(ac, o, t, v, d){ nz(ac, o, t, d || 1.6, "bandpass", 700, 900, 1.2, .12 * v, .15, .8); },
    fly(ac, o, t, v, d){ const so = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(); so.type = "sawtooth"; so.frequency.value = 230; lfo.frequency.value = 7; lg.gain.value = 25; lfo.connect(lg); lg.connect(so.frequency);
      const f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 900; env(g, t, .2, .03 * v, (d || 2) - .5, .3); so.connect(f); f.connect(g); g.connect(o); so.start(t); lfo.start(t); so.stop(t + (d || 2) + .1); lfo.stop(t + (d || 2) + .1); },
  };
  // ambience beds per location kind
  const AMB = {
    rapat: (ac, o, a, b) => { nz(ac, o, a, b - a, "bandpass", 500, 500, .8, .05, .8, .8); },
    kerja: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 300, 300, .5, .035, .8, .8); for (let s = a + 1.3; s < b - .5; s += 2.5 + rnd(s) * 3) J(s, () => SFX.typing(ac, o, s, .18, .8 + rnd(s + 1))); },
    yoga: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 260, 260, .5, .03, .8, .8); osc(ac, o, "sine", 120, 120, a, .8, .008, Math.max(0, b - a - 1.6), .8); },
    halte: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 220, 220, .6, .09, .8, .8); for (let s = a + .5; s < b - 1.5; s += 2.2 + rnd(s) * 2.5) J(s, () => nz(ac, o, s, 1.6, "bandpass", 300, 900, .8, .05, .7, .8, rnd(s + 2) > .5 ? .6 : -.6)); },
    toko: (ac, o, a, b) => { nz(ac, o, a, b - a, "bandpass", 600, 600, .7, .05, .5, .5); osc(ac, o, "sine", 90, 90, a, .5, .01, Math.max(0, b - a - 1), .5); },
    lorong: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 350, 350, .5, .03, .6, .6); for (let s = a + .4; s < b - .3; s += .55) J(s, () => SFX.tap(ac, o, s, .12)); },
    kaca: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 280, 280, .5, .025, .6, .6); },
    kos: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 200, 200, .5, .02, .6, .6); for (let s = a + .3; s < b - .4; s += .9 + rnd(s) * .8) J(s, () => { for (let j = 0; j < 3; j++) osc(ac, o, "sine", 4200, 4200, s + j * .05, .005, .012, 0, .03); }); },
    pantry: (ac, o, a, b) => { nz(ac, o, a, b - a, "lowpass", 240, 240, .5, .03, .6, .6); osc(ac, o, "sine", 55, 55, a, .8, .01, Math.max(0, b - a - 1.6), .8); for (let s = a + 1.1; s < b - .4; s += 1.9 + rnd(s) * 2.2) J(s, () => osc(ac, o, "sine", 900 + rnd(s) * 500, 700, s, .005, .035, 0, .18)); },
    kampus: (ac, o, a, b) => { nz(ac, o, a, b - a, "bandpass", 900, 900, .5, .03, .8, .8); for (let s = a + .6; s < b - .5; s += 1.4 + rnd(s) * 1.8) J(s, () => { for (let k = 0; k < 3; k++) osc(ac, o, "sine", 2600 + rnd(s + k) * 1400, 3200 + rnd(s + k + 1) * 900, s + k * .09, .004, .03, 0, .07); }); },
  };
  AMB.warung = AMB.halte; AMB.bos = AMB.kaca; AMB.lobi = AMB.lorong; AMB.gudang = AMB.lorong;   // lokasi Eps 4 (kit16d)
  AMB.tokobaru = AMB.toko;   // lokasi Klien Terbesar Eps 1 (kit16e)
  AMB.kabin = AMB.halte; AMB.jalan = AMB.halte; AMB.tokoluar = AMB.halte;   // lokasi Klien Terbesar Eps 2 (kit16f)
  AMB.jalanHujan = AMB.halte;   // lokasi Klien Terbesar Eps 3 (kit16g)
  AMB.halaman = AMB.halte;   // lokasi Klien Terbesar Eps 4 (kit16h)
  AMB.parkiran = AMB.halte;   // lokasi Utang Bayu Eps 1 (kit16i)

  // music: chord progressions per mood (MIDI), bpm, pluck on/off
  const MOOD = {
    warm: { ch: [[48, 55, 64, 67], [43, 55, 62, 71], [45, 57, 64, 72], [41, 57, 65, 69]], bpm: 84, pluck: true, vol: 1 },
    light: { ch: [[41, 57, 65, 69], [48, 55, 64, 67], [50, 57, 65, 69], [46, 58, 65, 70]], bpm: 96, pluck: true, vol: .9 },
    sad: { ch: [[45, 57, 60, 64], [41, 57, 60, 65], [48, 55, 60, 64], [43, 55, 59, 62]], bpm: 66, pluck: false, vol: .9 },
    tense: { ch: [[45, 52, 57, 60], [45, 52, 57, 61], [41, 52, 57, 60], [40, 52, 56, 59]], bpm: 100, pluck: false, pulse: true, vol: .9 },
    hope: { ch: [[41, 57, 65, 69], [43, 55, 62, 71], [40, 55, 64, 71], [45, 57, 64, 72]], bpm: 90, pluck: true, vol: 1 },
    night: { ch: [[45, 57, 64, 67], [41, 53, 60, 64], [43, 55, 62, 65], [40, 52, 59, 64]], bpm: 72, pluck: true, vol: .8 },
  };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function music(ac, out, a, b, mood){
    const M = MOOD[mood]; if (!M || b - a < .5) return; const beat = 60 / M.bpm, bar = beat * 4, bus = ac.createGain(); bus.gain.setValueAtTime(0, a); bus.gain.linearRampToValueAtTime(M.vol, a + 1.2); bus.gain.setValueAtTime(M.vol, Math.max(a + 1.2, b - 1.2)); bus.gain.linearRampToValueAtTime(0, b); bus.connect(out);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500; lp.connect(bus);
    let k = 0; for (let s = a; s < b; s += bar * 2, k++){ const ch = M.ch[k % M.ch.length], len = Math.min(bar * 2, b - s) + .4, kk = k; J(s, () => {
      ch.forEach((m, j) => { [-4, 4].forEach(dt => { const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = hz(m) * Math.pow(2, dt / 1200); g.gain.setValueAtTime(0.0001, s); g.gain.linearRampToValueAtTime(.032 / (j ? 1.3 : 1), s + .8); g.gain.setValueAtTime(.032 / (j ? 1.3 : 1), s + len - .8); g.gain.linearRampToValueAtTime(0.0001, s + len); o.connect(g); g.connect(lp); o.start(s); o.stop(s + len + .05); }); });
      if (M.pluck) for (let q = 0; q < 16 && s + q * beat / 2 < b - .2; q++){ if (rnd(q + kk * 16) < .28) continue; const m = ch[1 + (q * 3 + kk) % 3] + 12; osc(ac, bus, "sine", hz(m), hz(m), s + q * beat / 2, .005, .05, 0, .5, (q % 2 ? .25 : -.25)); }
      if (M.pulse) for (let q = 0; q < 8 && s + q * beat < b - .2; q++) osc(ac, bus, "sine", hz(ch[0] - 12), hz(ch[0] - 12), s + q * beat, .01, .12, .05, .25);
    }); }
  }

  let WAV = null;
  window.A16 = {
    async build(o){
      const dur = o.dur, len = Math.ceil(dur * SR);
      const dc = new OfflineAudioContext(1, SR, SR);
      const vo = []; for (const v of o.vo){ vo.push({ t: v.t, buf: await dc.decodeAudioData(b64ab(v.b64)) }); }
      // VO loudness envelope at 100 Hz (global time)
      const N = Math.ceil(dur * 100), db = new Float32Array(N).fill(-120); let peak = -120;
      vo.forEach(({ t, buf }) => { const d = buf.getChannelData(0), hop = buf.sampleRate / 100; for (let f = 0; f * hop < d.length; f++){ let s = 0; const o0 = Math.floor(f * hop); for (let i = 0; i < hop && o0 + i < d.length; i++) s += d[o0 + i] * d[o0 + i];
        const v = 10 * Math.log10(s / hop + 1e-12), gi = Math.round(t * 100) + f; if (gi < N){ db[gi] = Math.max(db[gi], v); if (v > peak) peak = v; } } });
      const envA = Array.from(db, v => Math.max(0, (v - (peak - 60)) / 60));
      // mix
      const ac = new OfflineAudioContext(2, len, SR), comp = ac.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 3; comp.connect(ac.destination);
      const voBus = ac.createGain(); voBus.gain.value = 1; voBus.connect(comp);
      const sfx = ac.createGain(); sfx.gain.value = o.sfxVol ?? .55; sfx.connect(comp);
      const amb = ac.createGain(); amb.gain.value = o.ambVol ?? .8; amb.connect(comp);
      const mus = ac.createGain(); mus.connect(comp);
      JOBS = [];
      vo.forEach(({ t, buf }) => J(t, () => { const s = ac.createBufferSource(); s.buffer = buf; s.connect(voBus); s.start(t); }));
      // ducking: music level follows the (smoothed) voice envelope at 10 Hz
      const base = o.musicVol ?? .55, duck = o.duckVol ?? .2; mus.gain.setValueAtTime(base, 0);
      let prev = -1; for (let k = 0; k < N; k += 10){ let sp = 0; for (let j = Math.max(0, k - 30); j < Math.min(N, k + 30); j++) if (envA[j] > .45){ sp = 1; break; } const g = sp ? duck : base; if (g !== prev){ mus.gain.setTargetAtTime(g, k / 100, .25); prev = g; } }
      (S16.events || []).forEach(e => { const f = SFX[e.type]; if (f) J(e.t, () => { try { f(ac, sfx, e.t, e.vol ?? 1, e.dur); } catch (err){ console.error(e.type, err); } }); });
      (o.amb || []).forEach(a => { const f = AMB[a.kind]; if (f && a.t1 - a.t0 > .6) J(a.t0, () => f(ac, amb, a.t0, a.t1)); });
      (o.moods || []).forEach(m => J(m.t0, () => music(ac, mus, m.t0, m.t1, m.mood)));
      // feed jobs window by window (jobs may add jobs); every node is created ~1-3 s before it sounds
      const STEP = 2, LEAD = 1.2, runUntil = T => { for (let guard = 0; guard < 50; guard++){ const now = JOBS.filter(j => !j.done && j.t < T); if (!now.length) break; now.forEach(j => { j.done = true; try { j.fn(); } catch (err){ console.error(err); } }); } JOBS = JOBS.filter(j => !j.done); };
      runUntil(STEP + LEAD);
      for (let k = 1; k * STEP < dur; k++){ const T0 = k * STEP; ac.suspend(T0).then(() => { runUntil(T0 + STEP + LEAD); ac.resume(); }); }
      const out = await ac.startRendering(), L = out.getChannelData(0), R = out.getChannelData(1);
      const bytes = 44 + L.length * 4, buf = new ArrayBuffer(bytes), dv = new DataView(buf);
      const ws = (p, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(p + i, s.charCodeAt(i)); };
      ws(0, "RIFF"); dv.setUint32(4, bytes - 8, true); ws(8, "WAVE"); ws(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true); dv.setUint32(24, SR, true); dv.setUint32(28, SR * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); ws(36, "data"); dv.setUint32(40, L.length * 4, true);
      for (let i = 0, p = 44; i < L.length; i++, p += 4){ dv.setInt16(p, Math.max(-1, Math.min(1, L[i])) * 32767, true); dv.setInt16(p + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
      WAV = new Uint8Array(buf);
      return { bytes, env: { env: envA, dur } };
    },
    chunk(i, size){ const u = WAV.subarray(i * size, Math.min(WAV.length, (i + 1) * size)); let s = ""; for (let k = 0; k < u.length; k += 32768) s += String.fromCharCode.apply(null, u.subarray(k, k + 32768)); return btoa(s); },
  };
})();
