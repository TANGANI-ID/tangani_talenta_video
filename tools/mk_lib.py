import json, os, sys
from itertools import chain
base = json.load(open('SB02/project.json'))
LABEL = {"SB": "SENIN BERTUMBUH", "SP": "SELASA PRODUKTIF", "RN": "RABU NYAMBUNG", "KD": "KAMIS DIGITAL", "JS": "JUMAT SOLUTIF", "SC": "SABTU CERDAS FINANSIAL", "MS": "MINGGU SEHAT"}
def _cues(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k.lower().endswith("cue") and isinstance(v, str): yield v
            else: yield from _cues(v)
    elif isinstance(o, list):
        for v in o: yield from _cues(v)
def check(code, scenes):
    bad = 0
    for i, s in enumerate(scenes):
        for c in _cues(s["f"]):
            if c and c.lower() not in s["vo"].lower(): print(code, "CUE TIDAK ADA (rekursif)", i + 1, c); bad += 1
    for i, s in enumerate(scenes):
        f, vo = s["f"], s["vo"].lower()
        cues = [f.get(k) for k in ("sendCue", "backCue", "winCue", "wordCue", "badgeCue")]
        for k in ("chips", "extras", "items", "steps", "tiles", "nodes", "marks", "lines", "cards", "parts"):
            cues += [c.get("cue") for c in f.get(k, [])]
        cues += [(f.get(k) or {}).get("cue") for k in ("left", "right") if isinstance(f.get(k), dict)] + [f.get("splitCue"), f.get("offCue"), f.get("cue")] + [it.get("cue") for k in ("left", "right") if isinstance(f.get(k), dict) for it in (f[k].get("items") or []) if isinstance(it, dict)]
        for c in cues:
            if c and c.lower() not in vo: print(code, "CUE TIDAK ADA", i + 1, c); bad += 1
        hl, hd = f.get("highlight"), (f.get("headline") or f.get("word") or f.get("title") or "")
        if hl and hl not in hd: print(code, "HIGHLIGHT TIDAK ADA", i + 1, hl); bad += 1
    return bad
def mk(code, title, problem, points, cta, scenes):
    os.makedirs(code, exist_ok=True)
    ser = code[:2]
    p = {"id": code.lower(), "name": f"{code}: {title}", "style": "B" if ser == "KD" else "C", "series": ser,
         "brand": dict(base["brand"], label=f"{LABEL[ser]} · 1 MENIT 1 INSIGHT"),
         "brief": dict(base["brief"], problem=problem, points=points, cta=cta),
         "pron": "", "voice": base["voice"], "sfx": base["sfx"], "voVol": 1, "nudges": {}, "scenes": scenes}
    check(code, scenes)
    json.dump(p, open(f'{code}/project.json', 'w'), ensure_ascii=False, indent=1)
    t = "\n\n".join(s["vo"] for s in scenes)
    json.dump({"text": t, "model_id": "eleven_v4", "language_code": "id"}, open(f'{code}/.tts.json', 'w'), ensure_ascii=False)
    print(code, len(t.split()), "kata:", " > ".join(s["layout"] for s in scenes))

