"""Shared helpers for the 16:9 story pipeline (tools/panjang/*).
Episode folder layout (e.g. youtube/panjang/kantor-01):
  episode.json   scene data (locations, actors, camera, fx, lines) + "naskah" (path of the script .md)
  vo/aNN.mp3     narration per adegan, vo/aNN.json = {"text", "chars", "start", "end", ["dummy": true]}
  work/          timeline.json, audio, frames (generated)"""
import json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load_episode(d):
    d = Path(d)
    return json.loads((d / "episode.json").read_text("utf-8"))


def narration(naskah_path):
    """{adegan number: narration text} from the '> ' lines of every '### Adegan N' block."""
    t = Path(naskah_path).read_text("utf-8")
    parts = re.split(r"^### Adegan (\d+)", t, flags=re.M)
    out = {}
    for i in range(1, len(parts), 2):
        body = re.split(r"^## ", parts[i + 1], flags=re.M)[0]
        lines = [l[2:].strip() for l in body.splitlines() if l.startswith("> ")]
        if lines:
            out[int(parts[i])] = " ".join(lines)
    return out


def vo_name(n):
    return f"a{int(n):02d}"


def duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def words_from_chars(text, starts, ends):
    """Word list [{w, i (char index), t, e}] from char-level alignment of `text`."""
    out, i, n = [], 0, len(text)
    while i < n:
        if text[i].isspace():
            i += 1
            continue
        j = i
        while j < n and not text[j].isspace():
            j += 1
        if i < len(starts):
            out.append({"w": text[i:j], "i": i, "t": round(starts[i], 3), "e": round(ends[min(j, len(ends)) - 1], 3)})
        i = j
    return out
