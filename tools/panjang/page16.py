"""Shared: build the 16:9 timeline from episode.json + vo/, and open a Playwright page with the story engine.

timeline(ep_dir)  -> dict written to work/timeline.json
open_page(p, ep_dir, tl, env) -> playwright page with S16 initialised (engine/studio-tangani.html + engine/panjang/*.js)"""
import base64, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16 import ROOT, load_episode, vo_name, duration, words_from_chars
sys.path.insert(0, str(ROOT / "engine"))
from render_explainer import deps, font_file  # noqa: E402

ENGINE = ROOT / "engine" / "studio-tangani.html"
JS = [ROOT / "engine" / "panjang" / n for n in ("story16.js", "loc16.js", "fx16.js", "kit16b.js", "kit16c.js", "kit16d.js", "kit16e.js", "kit16f.js", "kit16g.js", "kit16h.js", "kit16i.js", "kit16j.js", "kit16k.js", "kit16l.js", "kit16kp.js", "audio16.js")]
FPS = 30


def cast():
    return json.loads((ROOT / "youtube" / "tokoh" / "tokoh.json").read_text("utf-8"))


def episode(ep_dir):
    ep = load_episode(ep_dir)
    ep["cast"] = cast()
    return ep


def timeline(ep_dir):
    """Scene times from the VO lengths + breathing pauses; lengthen pauses (never audio) to reach ep['minDur']."""
    d = Path(ep_dir); ep = load_episode(d); rows = []
    for A in ep["adegan"]:
        n = A["n"]; js, mp3 = d / "vo" / f"{vo_name(n)}.json", d / "vo" / f"{vo_name(n)}.mp3"
        row = {"n": n, "voOff": 0.0, "voDur": 0.0, "text": "", "words": [], "vo": None, "dummy": False}
        if A.get("vo", True) and js.exists() and mp3.exists():
            j = json.loads(js.read_text("utf-8")); text = j["text"]
            row.update(text=text, words=words_from_chars(text, j["start"], j["end"]), vo=str(mp3.relative_to(d)),
                       voDur=round(duration(mp3), 3), dummy=bool(j.get("dummy")), voOff=float(A.get("pre", 0.5)))
            row["len"] = row["voOff"] + row["voDur"] + float(A.get("post", 0.7)) + float(A.get("hold", 0))
        else:
            row["len"] = float(A.get("dur", 6))
        rows.append(row)
    total = sum(r["len"] for r in rows); lo = float(ep.get("minDur", 495))
    if total < lo:   # spread the missing time over the post-pauses of narrated adegan (max +1.2 s each), rest at the end screen
        narr = [r for r in rows if r["vo"]]; add = min(1.2, (lo - total) / max(1, len(narr)))
        for r in narr:
            r["len"] += add
        total = sum(r["len"] for r in rows)
        if total < lo:
            rows[-1]["len"] += lo - total
    t = 0.0
    for r in rows:
        r["start"] = round(t, 3); t += r["len"]; r["end"] = round(t, 3)
    return {"dur": round(t, 3), "fps": FPS, "adegan": rows, "dummy": any(r["dummy"] for r in rows)}


def logo_data():
    return "data:image/png;base64," + base64.b64encode((ROOT / "site" / "public" / "logo.png").read_bytes()).decode()


def open_page(pw, ep_dir, tl, env=None, log=None):
    mux, css = deps()
    b = pw.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--disable-gpu-vsync", "--mute-audio"])
    pg = b.new_page(viewport={"width": 1280, "height": 800})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.route("https://cdn.jsdelivr.net/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=mux))
    pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
    pg.route("https://fonts.gstatic.com/**", lambda r: r.fulfill(status=200, content_type="font/woff2", body=font_file(r.request.url.rsplit("/", 1)[-1])))
    pg.goto(ENGINE.as_uri()); pg.wait_for_timeout(1200)
    for f in JS:
        pg.add_script_tag(content=f.read_text("utf-8"))
    pg.evaluate("""async () => { const L = []; for (const f of ['Poppins', "'Plus Jakarta Sans'"]) for (const w of [500, 600, 700, 800]) L.push(document.fonts.load(`${w} 40px ${f}`)); await Promise.all(L); }""")
    info = pg.evaluate("d => { const r = S16.init(d); return new Promise(ok => { if (S16.logo.complete) ok(r); else S16.logo.onload = () => ok(r); }); }",
                       {"ep": episode(ep_dir), "tl": tl, "env": env, "logo": logo_data()})
    pg._errs = errs; pg._browser = b
    if log is not False:
        for w in info.get("warnings", []):
            print("PERINGATAN:", w)
    return pg
