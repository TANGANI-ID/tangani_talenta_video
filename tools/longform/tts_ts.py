#!/usr/bin/env python3
"""VO Citra + timestamp per segmen. usage: K1=.. [K2 K3] tts_ts.py TEMA_DIR  -> TEMA_DIR/work/vo/<seg>.mp3 + .json (kata & waktu)"""
import base64, json, os, sys, time, urllib.request, urllib.error
from pathlib import Path
D = Path(sys.argv[1]); T = json.loads((D / "tema.json").read_text()); O = D / "work" / "vo"; O.mkdir(parents=True, exist_ok=True)
VOICE = "RbNgJzKAV7jpYJNtCBpj"
keys = [os.environ[k] for k in ("K1", "K2", "K3") if os.environ.get(k)]
segs = {"intro": T["intro"]["text"], "outro": T["outro"]["text"]} | {f"b_{c}": t for c, t in T["bridges"].items()}
def call(text, key):
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps({"text": text, "model_id": "eleven_v4", "language_code": "id"}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=180).read())
for name, text in segs.items():
    if (O / f"{name}.mp3").exists(): continue
    for key in keys:
        try: r = call(text, key); break
        except urllib.error.HTTPError as e:
            msg = e.read()[:200]; print(name, "key gagal", e.code, msg, file=sys.stderr)
            if e.code == 429: time.sleep(10)
    else: sys.exit(f"{name}: semua key gagal")
    (O / f"{name}.mp3").write_bytes(base64.b64decode(r["audio_base64"]))
    a = r.get("normalized_alignment") or r["alignment"]
    (O / f"{name}.json").write_text(json.dumps({"text": text, "chars": a["characters"], "start": a["character_start_times_seconds"], "end": a["character_end_times_seconds"]}))
    print(name, f"{a['character_end_times_seconds'][-1]:.2f} dtk")
