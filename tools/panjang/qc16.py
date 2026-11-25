#!/usr/bin/env python3
"""QC video 16:9: lembar kontak + cek "tidak ada gambar diam > 0,8 dtk".

usage: ~/.cache/studio-deps/venv/bin/python tools/panjang/qc16.py youtube/panjang/kantor-01 [--sheet] [--motion] [--mp4]
  --sheet   work/qc/lembar_kontak.jpg: 1 frame per adegan di 85 % + 2 frame tambahan untuk adegan > 30 dtk (dari mesin)
  --motion  frame tiap 0,25 dtk (dari MP4 jadi bila --mp4, atau dari mesin), selisih rata-rata, rentang diam terpanjang per adegan
Tanpa opsi: keduanya."""
import argparse, base64, io, json, subprocess, sys
from multiprocessing import Pool
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from page16 import open_page, timeline  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402
from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageStat  # noqa: E402

FD = Path.home() / ".cache/studio-deps"
STILL = 0.8          # threshold (mean abs diff, 0..255, on 480x270 grey) under which two samples count as "the same picture"


def F(s):
    return ImageFont.truetype(str(FD / "fontsource-poppins-5.3.0/package/files/poppins-latin-700-normal.woff"), s)


def grab(args):
    d, tl, env, ts, scale = args
    with sync_playwright() as pw:
        pg = open_page(pw, d, tl, env, log=False)
        out = []
        for i in range(0, len(ts), 8):
            out += pg.evaluate(f"S16.grabAt({json.dumps(ts[i:i + 8])}, .85, {scale})")
        errs = pg._errs; pg._browser.close()
    return out, errs


def frames(d, tl, env, ts, scale, workers=6):
    n = max(1, min(workers, len(ts) // 20 or 1)); per = (len(ts) + n - 1) // n
    with Pool(n) as p:
        res = p.map(grab, [(d, tl, env, ts[k * per:(k + 1) * per], scale) for k in range(n)])
    imgs, errs = [], []
    for o, e in res:
        imgs += [Image.open(io.BytesIO(base64.b64decode(b))).convert("RGB") for b in o]; errs += e
    return imgs, errs


def sheet(d, tl, env, out):
    picks = []
    for A in tl["adegan"]:
        a, b = A["start"], A["end"]; L = b - a
        fr = [.85] if L <= 30 else [.3, .6, .85]
        picks += [(A["n"], f, round(a + L * f, 2)) for f in fr]
    imgs, errs = frames(d, tl, env, [p[2] for p in picks], .5)
    W, H, cols = 640, 360, 4; rows = (len(imgs) + cols - 1) // cols
    S = Image.new("RGB", (cols * W, rows * (H + 34)), "#13223D"); dr = ImageDraw.Draw(S)
    for i, ((n, f, t), im) in enumerate(zip(picks, imgs)):
        x, y = (i % cols) * W, (i // cols) * (H + 34)
        S.paste(im.resize((W, H)), (x, y + 34)); dr.text((x + 10, y + 4), f"Adegan {n} · {int(f * 100)}% · {int(t // 60)}:{t % 60:05.2f}", font=F(20), fill="#F6C343")
    S.save(out, quality=86); print("lembar kontak:", out, f"({len(imgs)} frame)")
    if errs:
        print("galat halaman:", errs[:5])


def shots_sheet(d, tl, env, out):
    """one frame per shot (1.2 s after its start, or mid-shot when shorter): checks every camera set-up."""
    with sync_playwright() as pw:
        pg = open_page(pw, d, tl, env, log=False); ad = pg.evaluate("S16.adegan()"); pg._browser.close()
    picks = []
    for A in ad:
        L = A["end"] - A["start"]; sh = A["shots"] + [L]
        for j in range(len(A["shots"])):
            a, b = sh[j], sh[j + 1]; picks.append((A["n"], j + 1, round(A["start"] + a + min(1.2, (b - a) * .5), 2)))
    imgs, errs = frames(d, tl, env, [p[2] for p in picks], .5)
    W, H, cols = 480, 270, 5; rows = (len(imgs) + cols - 1) // cols
    S = Image.new("RGB", (cols * W, rows * (H + 28)), "#13223D"); dr = ImageDraw.Draw(S)
    for i, ((n, j, t), im) in enumerate(zip(picks, imgs)):
        x, y = (i % cols) * W, (i // cols) * (H + 28)
        S.paste(im.resize((W, H)), (x, y + 28)); dr.text((x + 8, y + 3), f"A{n} shot {j} · {t:.1f}", font=F(18), fill="#F6C343")
    S.save(out, quality=84); print("lembar shot:", out, len(imgs), "frame"); print("galat:", errs[:3] if errs else "tidak ada")


def mp4_frames(mp4, ts):
    """decode the finished video at 4 fps (480x270 grey)."""
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", "fps=4,scale=480:270,format=gray", "-f", "rawvideo", "-"], capture_output=True)
    n = len(r.stdout) // (480 * 270)
    return [Image.frombytes("L", (480, 270), r.stdout[i * 480 * 270:(i + 1) * 480 * 270]) for i in range(n)]


def motion(d, tl, env, mp4=None):
    dur = tl["dur"]; ts = [round(i * .25, 2) for i in range(int(dur / .25))]
    if mp4:
        g = mp4_frames(mp4, ts); ts = ts[:len(g)]; g = g[:len(ts)]
    else:
        im, _ = frames(d, tl, env, ts, .25); g = [x.convert("L") for x in im]
    diff = [ImageStat.Stat(ImageChops.difference(g[i - 1], g[i])).mean[0] for i in range(1, len(g))]
    rows, worst_all = [], 0
    for A in tl["adegan"]:
        a, b = A["start"], A["end"]; run = worst = 0; at = None; vals = []
        for i in range(1, len(g)):
            t = ts[i]
            if not (a < t <= b):
                continue
            vals.append(diff[i - 1])
            if diff[i - 1] < STILL:
                run += .25
                if run > worst:
                    worst, at = run, t
            else:
                run = 0
        worst_all = max(worst_all, worst)
        rows.append((A["n"], a, b, sum(vals) / max(1, len(vals)), min(vals or [0]), worst, at))
        print(f"adegan {A['n']:2d} {a:6.1f}-{b:6.1f}: gerak rata {sum(vals) / max(1, len(vals)):5.2f}  min {min(vals or [0]):5.2f}  diam terpanjang {worst:.2f} dtk" + (f" (di {at:.2f})" if worst >= 1 else ""))
    print(f"DIAM TERPANJANG DI SELURUH VIDEO: {worst_all:.2f} dtk (ambang selisih {STILL})")
    return rows


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("ep"); ap.add_argument("--sheet", action="store_true"); ap.add_argument("--motion", action="store_true"); ap.add_argument("--mp4", action="store_true"); ap.add_argument("--shots", action="store_true")
    x = ap.parse_args(); d = Path(x.ep).resolve(); work = d / "work"; (work / "qc").mkdir(parents=True, exist_ok=True)
    tl = json.loads((work / "timeline.json").read_text()) if (work / "timeline.json").exists() else timeline(d)
    env = json.loads((work / "vo_env.json").read_text()) if (work / "vo_env.json").exists() else None
    if x.shots:
        return shots_sheet(d, tl, env, work / "qc" / "lembar_shot.jpg")
    both = not (x.sheet or x.motion)
    if x.sheet or both:
        sheet(d, tl, env, work / "qc" / "lembar_kontak.jpg")
    if x.motion or both:
        motion(d, tl, env, d / f"{d.name}-16x9.mp4" if x.mp4 else None)


if __name__ == "__main__":
    main()
