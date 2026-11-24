#!/usr/bin/env python3
"""Render episode 16:9 (1920x1080, 30 fps) dari youtube/panjang/<slug>/episode.json + vo/.

usage: ~/.cache/studio-deps/venv/bin/python tools/panjang/render16.py youtube/panjang/kantor-01 [opsi]
  (tanpa opsi)        timeline -> audio (VO + SFX + musik) -> frame paralel -> <slug>-16x9.mp4 + YOUTUBE.txt
  --stills t1,t2..    simpan frame cek (JPEG) ke work/stills/ saja (detik global; 'aN' = adegan N di 85 %)
  --from S --to S     render sebagian (uji), hasil work/uji.mp4
  --workers N         jumlah proses render (bawaan 6)
  --scale X           skala frame (uji cepat, mis. 0.5)"""
import argparse, base64, json, os, subprocess, sys, time
from multiprocessing import Process
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from page16 import timeline, open_page, FPS  # noqa: E402
from common16 import ROOT  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402


def audio(d, tl, work):
    """mix.wav + vo_env.json (lip-flap envelope)."""
    vo = [{"t": a["start"] + a["voOff"], "b64": base64.b64encode((d / a["vo"]).read_bytes()).decode()} for a in tl["adegan"] if a["vo"]]
    with sync_playwright() as pw:
        pg = open_page(pw, d, tl, None)
        amb = pg.evaluate("S16.ambience()"); moods = pg.evaluate("S16.moods()")
        r = pg.evaluate("o => A16.build(o)", {"dur": tl["dur"], "vo": vo, "amb": amb, "moods": moods})
        size = 4 * 1024 * 1024; n = (r["bytes"] + size - 1) // size
        with open(work / "mix.wav", "wb") as f:
            for i in range(n):
                f.write(base64.b64decode(pg.evaluate(f"A16.chunk({i}, {size})")))
        (work / "vo_env.json").write_text(json.dumps({"env": [round(x, 3) for x in r["env"]["env"]], "dur": r["env"]["dur"]}))
        (work / "events.json").write_text(json.dumps(pg.evaluate("S16.events"), indent=0))
        errs = pg._errs; pg._browser.close()
    if errs:
        print("galat halaman (audio):", errs[:5])
    return json.loads((work / "vo_env.json").read_text())


def worker(d, tl, env, f0, f1, out, scale, k):
    with sync_playwright() as pw:
        pg = open_page(pw, d, tl, env, log=False)
        W, H = int(1920 * scale) // 2 * 2, int(1080 * scale) // 2 * 2
        ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               "-vf", f"scale={W}:{H}", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), str(out)],
                              stdin=subprocess.PIPE)
        f, B, t0 = f0, 6, time.time()
        while f < f1:
            n = min(B, f1 - f)
            for b in pg.evaluate(f"S16.grab({f}, {n}, {FPS}, .93, {scale})"):
                ff.stdin.write(base64.b64decode(b))
            f += n
            if k == 0 and (f - f0) % 300 < B:
                el = time.time() - t0; print(f"  [w0] {f - f0}/{f1 - f0} frame, {el / max(1, f - f0) * 1000:.0f} ms/frame", flush=True)
        ff.stdin.close(); ff.wait()
        if pg._errs:
            print(f"  [w{k}] galat halaman:", pg._errs[:3])
        pg._browser.close()


def frames(d, tl, env, work, a, b, workers, scale, out):
    F0, F1 = int(round(a * FPS)), int(round(b * FPS)); n = F1 - F0; per = (n + workers - 1) // workers; segs, ps = [], []
    for k in range(workers):
        s0, s1 = F0 + k * per, min(F1, F0 + (k + 1) * per)
        if s0 >= s1:
            break
        seg = work / f"seg{k:02d}.mp4"; segs.append(seg)
        p = Process(target=worker, args=(d, tl, env, s0, s1, seg, scale, k)); p.start(); ps.append(p)
    for p in ps:
        p.join()
    (work / "segs.txt").write_text("".join(f"file '{s}'\n" for s in segs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "segs.txt"), "-c", "copy", str(work / "video.mp4")], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(work / "video.mp4"), "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", str(work / "mix.wav"),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", "-shortest", str(out) + ".tmp.mp4"], check=True)
    os.replace(str(out) + ".tmp.mp4", out)
    for s in segs:
        s.unlink(missing_ok=True)


def stills(d, tl, env, work, spec, scale=1.0):
    ts = []
    for x in spec.split(","):
        if x.startswith("a"):
            A = next(r for r in tl["adegan"] if r["n"] == int(x[1:])); ts.append(round(A["start"] + (A["end"] - A["start"]) * .85, 2))
        else:
            ts.append(float(x))
    od = work / "stills"; od.mkdir(exist_ok=True)
    with sync_playwright() as pw:
        pg = open_page(pw, d, tl, env)
        for t, b in zip(ts, pg.evaluate(f"S16.grabAt({json.dumps(ts)}, .9, {scale})")):
            (od / f"t{t:07.2f}.jpg").write_bytes(base64.b64decode(b))
        if pg._errs:
            print("galat halaman:", pg._errs[:5])
        pg._browser.close()
    print("frame cek:", od)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("ep"); ap.add_argument("--stills"); ap.add_argument("--from", dest="a", type=float)
    ap.add_argument("--to", dest="b", type=float); ap.add_argument("--workers", type=int, default=6); ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--no-audio", action="store_true", help="pakai work/mix.wav lama")
    x = ap.parse_args(); d = Path(x.ep).resolve(); work = d / "work"; work.mkdir(exist_ok=True); T0 = time.time()
    tl = timeline(d); (work / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False))
    print(f"timeline: {tl['dur']:.2f} dtk ({int(tl['dur'] // 60)}:{tl['dur'] % 60:04.1f}), {len(tl['adegan'])} adegan" + ("  [ADA SUARA ROBOT SEMENTARA]" if tl["dummy"] else ""))
    envp = work / "vo_env.json"
    if x.stills:
        env = json.loads(envp.read_text()) if envp.exists() else None
        return stills(d, tl, env, work, x.stills, x.scale)
    env = json.loads(envp.read_text()) if (x.no_audio and envp.exists()) else audio(d, tl, work)
    print(f"audio siap ({time.time() - T0:.0f} dtk)")
    if x.a is not None or x.b is not None:
        a, b = x.a or 0, x.b or tl["dur"]; frames(d, tl, env, work, a, b, x.workers, x.scale, work / "uji.mp4"); print("uji:", work / "uji.mp4")
    else:
        out = d / f"{d.name}-16x9.mp4"; frames(d, tl, env, work, 0, tl["dur"], x.workers, x.scale, out)
        subprocess.run([sys.executable, "-I", str(Path(__file__).resolve().parent / "meta16.py"), str(d)], check=False)
        print("selesai:", out)
    print(f"waktu render: {(time.time() - T0) / 60:.1f} menit")


if __name__ == "__main__":
    main()
