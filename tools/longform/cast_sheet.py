#!/usr/bin/env python3
"""Lembar tokoh dari youtube/tokoh/tokoh.json -> youtube/tokoh/lembar_tokoh.jpg (render pakai mesin mode cerita)."""
import base64, io, json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, str(Path("engine").resolve()))
from render_explainer import deps, font_file
C = json.loads(Path("youtube/tokoh/tokoh.json").read_text()); ids = list(C)
base = json.loads(Path("assets/base/project_dasar.json").read_text())
poses = [("wave", "happy"), ("hips", "proud"), ("talk", "neutral"), ("pointUp", "happy")]
scenes = []
for i, k in enumerate(ids):
    look = dict(C[k]["look"]); p, e = poses[i % 4]
    scenes.append({"layout": "cerita", "vo": f"Kenalkan, ini {C[k]['nama']}.", "f": {"env": "office", "envOpt": {"desk": False, "plant": False},
        "toons": [dict(look, x=540, size=900, face=1, keys=[{"at": 0, "pose": p, "expr": e, "look": "cam"}])],
        "cam": [{"at": 0, "x": 540, "y": 1050, "zoom": 1.0}]}})
proj = dict(base, scenes=scenes, id="cast", name="Lembar tokoh")
mux, css = deps(); FD = Path.home() / ".cache/studio-deps"
imgs = []
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path="/usr/bin/google-chrome"); pg = b.new_page(viewport={"width": 1440, "height": 1000})
    pg.route("https://cdn.jsdelivr.net/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=mux))
    pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
    pg.route("https://fonts.gstatic.com/**", lambda r: r.fulfill(status=200, content_type="font/woff2", body=font_file(r.request.url.rsplit("/", 1)[-1])))
    pg.goto(Path("engine/studio-tangani.html").resolve().as_uri()); pg.wait_for_timeout(1500)
    pg.evaluate("p => loadState(p)", proj); pg.wait_for_timeout(500); pg.evaluate("buildTimeline()")
    sc = pg.evaluate("TL.scenes.map(s => [s.start, s.end])")
    for (s, e) in sc:
        t = s + (e - s) * 0.7
        d = pg.evaluate(f"(() => {{ const c=document.createElement('canvas'); c.width=1080; c.height=1920; const x=c.getContext('2d'); drawFrame(x,{t}); return c.toDataURL('image/png'); }})()")
        imgs.append(Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert("RGB"))
    b.close()
def F(w, s): return ImageFont.truetype(str(FD / f"fontsource-poppins-5.3.0/package/files/poppins-latin-{w}-normal.woff"), s)
def J(w, s): return ImageFont.truetype(str(FD / f"fontsource-plus-jakarta-sans-5.3.0/package/files/plus-jakarta-sans-latin-{w}-normal.woff"), s)
cw, chh = 480, 668; cols = 4; rows = (len(ids) + cols - 1) // cols
S = Image.new("RGB", (cols * cw + 40, rows * (chh + 170) + 150), "#13223D"); d = ImageDraw.Draw(S)
d.text((30, 40), "Pemeran tetap Tangani Talenta", font=F(800, 54), fill="white")
for i, (k, im) in enumerate(zip(ids, imgs)):
    crop = im.crop((90, 380, 990, 1692)).resize((cw - 20, int((cw - 20) * 1312 / 900)))
    crop = crop.crop((0, 0, cw - 20, chh)); x = 20 + (i % cols) * cw; y = 140 + (i // cols) * (chh + 170)
    S.paste(crop, (x, y)); d.rounded_rectangle((x, y + chh, x + cw - 20, y + chh + 150), 0, fill="#0E1A30")
    d.text((x + 18, y + chh + 14), C[k]["nama"], font=F(800, 40), fill="#F6C343")
    d.text((x + 18, y + chh + 68), C[k]["peran"], font=J(700, 21), fill="white")
    d.text((x + 18, y + chh + 102), C[k]["watak"], font=J(600, 20), fill="#F0A35E")
S.save("youtube/tokoh/lembar_tokoh.jpg", quality=88); print("ok", len(imgs), "tokoh")
