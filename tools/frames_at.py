"""usage: frames_at.py ENGINE_HTML PROJECT.json VO.mp3|- OUTDIR t1 t2 ... ; prints motionInfo"""
import base64, json, sys
from pathlib import Path
sys.path.insert(0, "/var/www/tangani_talenta/tangani_talenta_video/engine")
from render_explainer import deps, font_file
from playwright.sync_api import sync_playwright
html, proj, vo, out, *ts = sys.argv[1:]
mux, css = deps(); Path(out).mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome"); pg = b.new_page(viewport={"width":1440,"height":1000})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.route("https://cdn.jsdelivr.net/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=mux))
    pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
    pg.route("https://fonts.gstatic.com/**", lambda r: r.fulfill(status=200, content_type="font/woff2", body=font_file(r.request.url.rsplit("/",1)[-1])))
    pg.goto(Path(html).resolve().as_uri()); pg.wait_for_timeout(1500)
    pg.evaluate("p => loadState(p)", json.loads(Path(proj).read_text())); pg.wait_for_timeout(800)
    if vo != "-":
        pg.set_input_files("#voIn", vo)
        for _ in range(60):
            pg.wait_for_timeout(500)
            if pg.evaluate("!!(TL && TL.audio)"): break
    pg.evaluate("buildTimeline()")
    print("motion:", pg.evaluate("motionInfo()"))
    for t in ts:
        d = pg.evaluate(f"(() => {{ const c=document.createElement('canvas'); c.width=360; c.height=640; const x=c.getContext('2d'); x.scale(1/3,1/3); drawFrame(x,{t}); return c.toDataURL('image/jpeg',.85); }})()")
        (Path(out)/f"t{float(t):06.2f}.jpg").write_bytes(base64.b64decode(d.split(",")[1]))
    print("errors:", errs or "none"); b.close()
