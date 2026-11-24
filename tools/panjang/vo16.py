#!/usr/bin/env python3
"""VO Citra (ElevenLabs) per adegan, dengan stempel waktu per karakter.

usage:  K1=<key> [K2=<key>] [K3=<key>] python3 tools/panjang/vo16.py youtube/panjang/kantor-01

- Narasi = baris "> " tiap "### Adegan N" di naskah (episode.json -> "naskah"), digabung.
- Hasil: vo/aNN.mp3 + vo/aNN.json {"text", "chars", "start", "end", "src"} (format sama dengan suara robot).
- Berkas yang sudah ada DILEWATI, kecuali suara robot sementara ("dummy": true) -> otomatis diganti.
- Kunci API hanya dibaca dari environment; tidak pernah dicetak atau disimpan."""
import base64, json, os, sys, time, urllib.error, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common16 import ROOT, load_episode, narration, vo_name

VOICE = "RbNgJzKAV7jpYJNtCBpj"   # Citra
MODEL = "eleven_v4"


def call(text, key):
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps({"text": text, "model_id": MODEL, "language_code": "id"}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=300).read())


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    d = Path(sys.argv[1]).resolve()
    ep = load_episode(d)
    nar = narration(ROOT / ep["naskah"])
    keys = [os.environ[k] for k in ("K1", "K2", "K3") if os.environ.get(k)]
    if not keys:
        sys.exit("Tidak ada kunci: jalankan dengan K1=<kunci ElevenLabs> (K2/K3 opsional).")
    out = d / "vo"; out.mkdir(exist_ok=True)
    done = 0
    for n, text in sorted(nar.items()):
        name = vo_name(n); mp3, js = out / f"{name}.mp3", out / f"{name}.json"
        if mp3.exists() and js.exists():
            try:
                if not json.loads(js.read_text("utf-8")).get("dummy"):
                    continue
            except ValueError:
                pass
        r = None
        for i, key in enumerate(keys):
            for attempt in range(3):
                try:
                    r = call(text, key); break
                except urllib.error.HTTPError as e:
                    msg = e.read()[:300].decode("utf-8", "replace")
                    print(f"{name}: kunci #{i + 1} gagal ({e.code}) {msg}", file=sys.stderr)
                    if e.code == 429:
                        time.sleep(10 * (attempt + 1)); continue
                    break
                except (urllib.error.URLError, TimeoutError) as e:
                    print(f"{name}: jaringan gagal ({e}), coba lagi", file=sys.stderr); time.sleep(5)
            if r:
                break
        if not r:
            sys.exit(f"{name}: semua kunci gagal; adegan lain yang sudah jadi tetap tersimpan.")
        a = r.get("alignment") or r["normalized_alignment"]
        tmp = mp3.with_suffix(".tmp")
        tmp.write_bytes(base64.b64decode(r["audio_base64"])); tmp.replace(mp3)
        js.write_text(json.dumps({"text": "".join(a["characters"]), "src": text, "chars": a["characters"],
                                  "start": a["character_start_times_seconds"], "end": a["character_end_times_seconds"],
                                  "voice": VOICE, "model": MODEL}, ensure_ascii=False))
        done += 1
        print(f"{name}: {a['character_end_times_seconds'][-1]:.2f} dtk, {len(text.split())} kata")
    print(f"selesai: {done} adegan baru dibuat ({len(nar)} adegan bernarasi).")


if __name__ == "__main__":
    main()
