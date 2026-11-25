"""usage: motion.py ENGINE_HTML CODE [OUTDIR]  (project root) -> frames every 0.25 s, mean abs diff in y 560-1330, per scene stats + longest still stretch"""
import re, subprocess, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
eng, code = sys.argv[1], sys.argv[2]; T = Path(__file__).resolve().parent; V = str(Path.home() / ".cache/studio-deps/venv/bin/python")
out = Path(sys.argv[3] if len(sys.argv) > 3 else "/tmp/motion") / code; subprocess.run(["rm", "-rf", str(out)])
r = subprocess.run([V, "-I", "../engine/render_explainer.py", "--html", str(Path(eng).resolve()), "--project", "project.json", "--vo", "vo.mp3", "--frames", "cek", "--frames-only"], cwd=code, capture_output=True, text=True)
line = next(l for l in r.stdout.splitlines() if l.startswith("Durasi")); sc = [tuple(map(float, m)) for m in re.findall(r"\d+:([\d.]+)-([\d.]+)", line)]
ts = [round(i * .25, 2) for i in range(int(59.9 / .25) + 1)]
subprocess.run([V, "-I", str(T / "frames_at.py"), eng, f"{code}/project.json", f"{code}/vo.mp3", str(out)] + [str(t) for t in ts], capture_output=True, text=True)
im = {t: Image.open(out / f"t{t:06.2f}.jpg").convert("L") for t in ts}
W, H = im[ts[0]].size; box = (0, int(560 / 1920 * H), W, int(1330 / 1920 * H)); im = {t: v.crop(box) for t, v in im.items()}
d = {ts[i]: ImageStat.Stat(ImageChops.difference(im[ts[i - 1]], im[ts[i]])).mean[0] for i in range(1, len(ts))}
for k, (a, b) in enumerate(sc):
    v = [d[t] for t in d if a + .25 <= t <= b]; run = 0; worst = 0
    for t in sorted(d):
        if a < t <= b:
            run = run + .25 if d[t] < 1.0 else 0; worst = max(worst, run)
    print(f"{code} adegan {k+1} {a:5.2f}-{b:5.2f}: rata {sum(v)/len(v):5.2f}  min {min(v):4.2f}  diam terpanjang (<1.0) {worst:.2f} dtk")
