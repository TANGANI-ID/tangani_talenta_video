#!/usr/bin/env python3
"""Fit a VO to an exact length so the rendered video is exactly 60 s (the engine adds 0.8 s at the end).

usage: fit_vo.py vo_raw.mp3 vo.mp3 [--target 59.2]
Shorter VO: extra silence is spread over the longest pauses between sentences (max 0.6 s each), the rest at the end.
Longer VO: sped up with atempo, at most 6 % (beyond that the script must be shortened).
"""
import argparse, array, re, subprocess, sys, tempfile, wave
from pathlib import Path

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("dst"); ap.add_argument("--target", type=float, default=59.2)
a = ap.parse_args()
dur = lambda p: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)
d = dur(a.src)
tmp = Path(tempfile.mkdtemp())
if d > a.target:
    r = d / a.target
    if r > 1.06: sys.exit(f"VO {d:.2f} dtk terlalu panjang ({r:.3f}x); perpendek naskah")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-af", f"atempo={r:.5f}", "-ar", "44100", "-ac", "1", "-b:a", "160k", a.dst], check=True)
    print(f"VO {d:.2f} -> {dur(a.dst):.2f} dtk (dipercepat {r:.3f}x)"); sys.exit()
wav = tmp / "v.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.src, "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", str(wav)], check=True)
with wave.open(str(wav)) as w: sr = w.getframerate(); pcm = array.array("h", w.readframes(w.getnframes()))
d = len(pcm) / sr; extra = a.target - d
out = subprocess.run(["ffmpeg", "-v", "info", "-i", str(wav), "-af", "silencedetect=n=-40dB:d=0.22", "-f", "null", "-"], capture_output=True, text=True).stderr
gaps = [(float(s), float(e)) for s, e in zip(re.findall(r"silence_start: ([\d.]+)", out), re.findall(r"silence_end: ([\d.]+)", out)) if float(s) > .5 and float(e) < d - .3]
gaps = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[:7])
per = min(.6, extra * .7 / len(gaps)) if gaps else 0
res, pos = array.array("h"), 0
for s, e in gaps:
    mid = int((s + e) / 2 * sr); res.extend(pcm[pos:mid]); res.extend(array.array("h", bytes(2 * int(per * sr)))); pos = mid
res.extend(pcm[pos:])
tail = int(a.target * sr) - len(res)
if tail > 0: res.extend(array.array("h", bytes(2 * tail)))
with wave.open(str(tmp / "o.wav"), "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(res.tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp / "o.wav"), "-b:a", "160k", a.dst], check=True)
print(f"VO {d:.2f} -> {dur(a.dst):.2f} dtk (+{per:.2f} dtk di {len(gaps)} jeda, sisa di akhir)")
