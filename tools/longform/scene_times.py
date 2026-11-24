#!/usr/bin/env python3
"""Waktu adegan tiap episode (sama persis dengan render). usage: scene_times.py OUT.json CODE...  (jalankan dari root proyek, venv studio-deps)"""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(Path("engine").resolve()))
from render_explainer import deps, font_file

def engine_for(code):
    p = json.loads(Path(f"{code}/project.json").read_text())
    pre = [s["layout"] for s in p["scenes"] if s["layout"] != "cta"][0].split("_")[0]
    e = Path(f"engine/studio-{pre}.html")
    return (e if e.exists() else Path("engine/studio-tangani.html")), p

out = {}
mux, css = deps()
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/usr/bin/google-chrome")
    for code in sys.argv[2:]:
        eng, proj = engine_for(code)
        pg = b.new_page(viewport={"width": 1440, "height": 1000})
        pg.route("https://cdn.jsdelivr.net/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=mux))
        pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
        pg.route("https://fonts.gstatic.com/**", lambda r: r.fulfill(status=200, content_type="font/woff2", body=font_file(r.request.url.rsplit("/", 1)[-1])))
        pg.goto(eng.resolve().as_uri()); pg.wait_for_timeout(1200)
        pg.evaluate("p => loadState(p)", proj); pg.wait_for_timeout(500)
        pg.set_input_files("#voIn", f"{code}/vo.mp3")
        for _ in range(60):
            pg.wait_for_timeout(500)
            if pg.evaluate("!!(TL && TL.audio)"): break
        sc = pg.evaluate("TL.scenes.map(s => [s.start, s.end])")
        out[code] = {"scenes": sc, "layouts": [s["layout"] for s in proj["scenes"]], "dur": pg.evaluate("TL.dur")}
        print(code, eng.name, " ".join(f"{s:.2f}" for s, e in sc)); pg.close()
    b.close()
Path(sys.argv[1]).write_text(json.dumps(out, indent=1))
