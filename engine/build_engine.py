#!/usr/bin/env python3
"""Make engine/studio-tangani.html = the Studio Explainer engine (engine/studio.html, fetched from the
artifact) + the Tangani motion pack (engine/motion-tangani.js) + every scene pack in engine/packs/*.js,
each injected in its own <script> after the engine's own script (a broken pack cannot stop the others).

  build_engine.py                                   -> studio-tangani.html with all packs
  build_engine.py --pack engine/packs/x.js --out engine/studio-x.html   -> only that pack (for testing)"""
import argparse
from pathlib import Path
here = Path(__file__).resolve().parent
ap = argparse.ArgumentParser(); ap.add_argument("--pack", action="append"); ap.add_argument("--out")
a = ap.parse_args()
html = (here / "studio.html").read_text(encoding="utf-8")
assert html.count("</body>") == 1, "engine layout changed: no single </body>"
packs = [Path(x).resolve() for x in a.pack] if a.pack else sorted((here / "packs").glob("*.js"))
js = [(here / "motion-tangani.js").read_text(encoding="utf-8")] + [p.read_text(encoding="utf-8") for p in packs]
out = Path(a.out).resolve() if a.out else here / "studio-tangani.html"
out.write_text(html.replace("</body>", "".join(f"<script>\n{j}\n</script>\n" for j in js) + "</body>"), encoding="utf-8")
print(f"{out} siap ({len(packs)} pack: {', '.join(p.stem for p in packs) or '-'})")
