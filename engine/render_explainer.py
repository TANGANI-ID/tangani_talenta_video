#!/usr/bin/env python3
"""Render a Studio Explainer project to MP4 headlessly.

usage: python3 render_explainer.py --html studio.html --project project.json [--vo vo.mp3] [--out out.mp4] [--frames DIR] [--frames-only]
"""
import argparse, base64, json, os, subprocess, sys, tempfile, time
from pathlib import Path
from playwright.sync_api import sync_playwright

DEPS = Path.home() / ".cache" / "studio-deps"
FONTS = {"plus-jakarta-sans": "Plus Jakarta Sans", "poppins": "Poppins", "inter": "Inter"}

def deps():
    DEPS.mkdir(parents=True, exist_ok=True)
    pkgs = {"mp4-muxer@5.2.2": "mp4-muxer"} | {f"@fontsource/{k}@5": f"fontsource-{k}" for k in FONTS}
    for spec, prefix in pkgs.items():
        if not list(DEPS.glob(prefix + "*/package")):
            subprocess.run(["npm", "pack", spec, "--silent"], cwd=DEPS, check=True, stdout=subprocess.DEVNULL)
            tgz = sorted(DEPS.glob(prefix + "-*.tgz"))[-1]
            out = DEPS / tgz.name[:-4]; out.mkdir(exist_ok=True)
            subprocess.run(["tar", "xzf", str(tgz), "-C", str(out)], check=True)
    mux = next(DEPS.glob("mp4-muxer*/package/build/mp4-muxer.js")).read_text()
    css = []
    for slug, fam in FONTS.items():
        for w in (500, 600, 700, 800):
            css.append(f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:normal;src:url(https://fonts.gstatic.com/local/{slug}-latin-{w}-normal.woff2) format('woff2');}}")
    return mux, "\n".join(css)

def font_file(name):
    hits = list(DEPS.glob(f"fontsource-*/package/files/{name}"))
    return hits[0].read_bytes() if hits else b""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--html", required=True); ap.add_argument("--project", required=True)
    ap.add_argument("--vo"); ap.add_argument("--out"); ap.add_argument("--frames")
    ap.add_argument("--frames-only", action="store_true", help="hanya simpan frame cek, tanpa ekspor MP4")
    a = ap.parse_args()
    mux, css = deps()
    project = json.loads(Path(a.project).read_text())
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = b.new_page(viewport={"width": 1440, "height": 1000})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.route("https://cdn.jsdelivr.net/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=mux))
        pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
        pg.route("https://fonts.gstatic.com/**", lambda r: r.fulfill(status=200, content_type="font/woff2", body=font_file(r.request.url.rsplit("/", 1)[-1])))
        pg.goto(Path(a.html).resolve().as_uri()); pg.wait_for_timeout(1500)
        pg.evaluate("p => loadState(p)", project); pg.wait_for_timeout(800)
        if a.vo:
            pg.set_input_files("#voIn", a.vo)
            for _ in range(60):
                pg.wait_for_timeout(500)
                if pg.evaluate("!!(TL && TL.audio)"): break
            else: sys.exit("VO tidak terbaca: " + pg.evaluate("document.querySelector('#alignMsg').textContent"))
            print("VO:", pg.evaluate("document.querySelector('#alignMsg').textContent"))
        scenes = pg.evaluate("TL.scenes.map(s => [s.start, s.end])")
        print("Durasi %.1f dtk; adegan:" % pg.evaluate("TL.dur"), ", ".join(f"{i+1}:{s:.2f}-{e:.2f}" for i, (s, e) in enumerate(scenes)))
        if a.frames:
            Path(a.frames).mkdir(parents=True, exist_ok=True)
            for i, (s, e) in enumerate(scenes):
                t = s + (e - s) * 0.85
                d = pg.evaluate(f"(() => {{ const c=document.createElement('canvas'); c.width=540; c.height=960; const x=c.getContext('2d'); x.scale(.5,.5); drawFrame(x,{t}); return c.toDataURL('image/jpeg',.85); }})()")
                (Path(a.frames) / f"adegan{i+1:02d}.jpg").write_bytes(base64.b64decode(d.split(",")[1]))
        if a.frames_only:
            b.close(); print("Frame cek tersimpan di", a.frames); return
        pg.evaluate("exportMp4()")
        t0 = time.time()
        while time.time() - t0 < 900:
            pg.wait_for_timeout(1000)
            if pg.evaluate("!document.querySelector('#exportBtn').disabled"): break
        if not pg.evaluate("!!lastMp4"):
            sys.exit("Ekspor gagal: " + pg.evaluate("document.querySelector('#expMsg').textContent") + " " + "; ".join(errs))
        data = pg.evaluate("(async()=>{const u=new Uint8Array(await lastMp4.arrayBuffer());let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s);})()")
        b.close()
    raw = Path(tempfile.mkdtemp()) / "raw.mp4"; raw.write_bytes(base64.b64decode(data))
    tmp = str(Path(a.out).with_suffix(".tmp.mp4"))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", tmp], check=True)
    os.replace(tmp, a.out)
    print("Selesai:", a.out, "| error halaman:", errs or "tidak ada")

if __name__ == "__main__":
    main()
