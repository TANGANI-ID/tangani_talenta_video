#!/usr/bin/env python3
"""QC one episode: usage  qc.py ENGINE_HTML CODE OUTDIR   (run from the project root)
- runs the engine with the VO to get scene times (prints Durasi line; must be 60.0)
- checks each scene boundary falls inside a VO pause (✓/✗)
- renders 3 frames per scene (35%, 70%, 95%) and a contact sheet OUTDIR/CODE.jpg, prints page errors"""
import re, subprocess, sys
from pathlib import Path
eng, code, out = sys.argv[1:4]
V = str(Path.home() / ".cache/studio-deps/venv/bin/python"); S = Path(__file__).resolve().parent
r = subprocess.run([V, "-I", "../engine/render_explainer.py", "--html", str(Path(eng).resolve()), "--project", "project.json", "--vo", "vo.mp3", "--frames", "cek", "--frames-only"], cwd=code, capture_output=True, text=True)
line = next((l for l in r.stdout.splitlines() if l.startswith("Durasi")), r.stdout + r.stderr); print(line)
sc = [tuple(map(float, m)) for m in re.findall(r"\d+:([\d.]+)-([\d.]+)", line)]
a = subprocess.run(["ffmpeg", "-v", "info", "-i", f"{code}/vo.mp3", "-af", "silencedetect=n=-40dB:d=0.1", "-f", "null", "-"], capture_output=True, text=True).stderr
gaps = list(zip(map(float, re.findall(r"silence_start: ([\d.]+)", a)), map(float, re.findall(r"silence_end: ([\d.]+)", a))))
print("batas:", " ".join(f"{e}{'✓' if any(s0 - .06 <= e <= e0 + .06 for s0, e0 in gaps) else '✗'}" for _, e in sc[:-1]))
ts = [str(round(s0 + (e - s0) * f, 2)) for s0, e in sc for f in (.35, .7, .95)]
d = Path(out) / code; subprocess.run(["rm", "-rf", str(d)])
r2 = subprocess.run([V, "-I", str(S / "frames_at.py"), eng, f"{code}/project.json", f"{code}/vo.mp3", str(d)] + ts, capture_output=True, text=True)
print([l for l in r2.stdout.splitlines() if l.startswith("errors")] or r2.stderr[-800:])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-pattern_type", "glob", "-i", f"{d}/t*.jpg", "-vf", f"scale=240:427,tile=9x{(len(ts) + 8) // 9}:padding=3:color=white", "-frames:v", "1", f"{out}/{code}.jpg"])
print("lembar kontak:", f"{out}/{code}.jpg")
