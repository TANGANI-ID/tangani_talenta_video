#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-08 (Klien Terbesar Eps 4: "Gudang paling lambat mau diserahkan ke pihak luar", penutup cerita).
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Bagian split (layar terbelah) tidak diubah shot_local(): kunci di dalamnya memakai cue atau at=0.
Mesin baru: engine/panjang/kit16h.js (lihat kepala berkas)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-08/episode.json"
NASKAH = "youtube/serial/ep08-naskah.md"

def C(cue, d=None, **kw):
    o = {"cue": cue}
    if d is not None: o["d"] = d
    o.update(kw); return o

def cap(x, y, text, bg="#13223D", col=None, **kw):
    o = {"type": "chip", "text": text, "x": x, "y": y, "bg": bg}
    if col: o["col"] = col
    o.update(kw); return o
def card(cue, text, d=0.1, **kw):
    o = {"type": "card", "cue": cue, "d": d, "style": "small", "text": text, "x": 1380, "y": 210, "size": 50}; o.update(kw); return o
NOLOC = {"actors": [], "useLoc": False}
def insert(cue, d, fx, trans="zoom", **kw):
    o = dict(cue=cue, d=d, trans=trans, **NOLOC); o["fx"] = fx if isinstance(fx, list) else [fx]; o.update(kw); return o
def day(n, frm=None, **kw):
    o = {"type": "dayChip", "day": n}
    if frm is not None: o["from"] = frm
    o.update(kw); return o

GREEN, RED, NAVY, ORANGE = "#3BA36B", "#D9483B", "#13223D", "#C2691F"
LOBI = {"time": "pagi", "deskX": 1100, "deskFront": True, "stairs": 1600, "slamX": -230}
WULAN = lambda **kw: dict({"who": "resepsionis", "x": 1000, "y": 930, "layer": "back", "face": -1, "size": 520}, **kw)
# gudang: pintu besi kiri, meja uji di tengah
G = {"door": -150, "doorOpen": True, "bench": 1100, "boxes": [[1800, 2]]}
def g(**kw):
    o = dict(G); o.update(kw); return o
HOLD = {"holdRack": {"x": 640, "w": 640, "box": "WIJAYA · TK-11"}, "boxes": [[1760, 2]]}
SORE = {"tint": "rgba(255,150,60,.10)"}
REC = {"type": "recap", "label": "SEBELUMNYA DI KLIEN TERBESAR"}
MEM = {"type": "recap", "label": "KLIEN TERBESAR · EPS 1–4"}
DODI_LOOK = {"hat": "cap", "hatColor": "#C2691F", "beard": "goatee", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "a", "pencil": True}
BROCH = {"type": "brochure", "x": 1310, "y": 770, "rot": 0.08, "w": 120, "h": 160}
def radio(on=False, x=1600, keys=None):
    r = [{"type": "box16", "x": x, "y": 1000, "w": 220, "h": 150, "label": "RADIO"}, {"type": "radio16", "x": x, "y": 850, "on": on}]
    if keys: r[1]["keys"] = keys
    return r
# papan nama rak (di lapisan rak, depth .4)
def signs(swap=None):
    a = {"type": "rackSign", "x": 210, "y": 175, "depth": 0.4, "w": 420, "text": "RAK 1\nkabel lama · mesin pameran", "text2": "RAK 1\nprinter · pemindai"}
    b = {"type": "rackSign", "x": 890, "y": 175, "depth": 0.4, "w": 420, "text": "RAK 2\nbarang jarang dikirim", "text2": "RAK 2\nkertas struk"}
    if swap is True:
        a["swap"] = b["swap"] = 1
    elif swap is not None:
        a["keys"] = [{"at": 0, "swap": 0}, dict(swap, swap=1, dur=0.7)]; b["keys"] = [{"at": 0, "swap": 0}, dict(swap, d=swap.get("d", 0) + 0.4, swap=1, dur=0.7)]
    return [a, b]

extras = {
    "dodi": {"nama": "Dodi (staf gudang & lapangan)", "look": DODI_LOOK},
    "wijaya": {"nama": "Pak Wijaya (klien, 12 toko)", "look": {"hat": "kopiah", "hatColor": "#1E1A18", "mustache": True, "hairColor": "#8A8A8A", "shirt": "#8E4A24", "pants": "#2C2433", "skin": "c"}},
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
    "eko": {"nama": "Mas Eko (staf gudang)", "look": {"hair": "short", "hairColor": "#1E1410", "hat": "cap", "hatColor": "#3B4A6B", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "c"}},
    "jaka": {"nama": "Mas Jaka (staf gudang)", "look": {"hair": "spiky", "hairColor": "#2B1A12", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "d"}},
    "vendor1": {"nama": "Petugas jasa gudang 1", "look": {"hair": "short", "hairColor": "#1E1410", "hat": "cap", "hatColor": "#5E5A62", "shirt": "#9CA3AF", "sleeve": "short", "pants": "#4B5563", "skin": "b", "idcard": "#5E5A62"}},
    "vendor2": {"nama": "Petugas jasa gudang 2", "look": {"hair": "side", "hairColor": "#2B1A12", "glasses": True, "shirt": "#9CA3AF", "sleeve": "short", "pants": "#4B5563", "skin": "d", "idcard": "#5E5A62"}},
    "teknisi": {"nama": "Teknisi pasang", "look": {"hair": "short", "hairColor": "#2B1A12", "hat": "cap", "hatColor": "#13223D", "shirt": "#2F6F73", "sleeve": "short", "pants": "#2C2433", "skin": "c", "idcard": "#C2691F"}},
}
def D(x, **kw):   # Dodi
    o = {"who": "dodi", "x": x, "face": -1, "size": 580}; o.update(kw); return o
def Y(x, **kw):   # Yoga (headphone di leher)
    o = {"who": "yoga", "x": x, "face": 1, "neckphones": True}; o.update(kw); return o
def staf(who, x, **kw):
    o = {"who": who, "x": x, "y": 940, "layer": "back", "size": 470, "face": 1, "item": "box", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}]}; o.update(kw); return o
NOCAP = {"hat": None, "pencil": True}

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA
A.append({"n": 1, "name": "Sebelumnya di Klien Terbesar", "loc": "lobi", "music": "tense", "pre": 0.5, "post": 0.5, "trans": "cut",
  "locOpt": dict(LOBI, slam=1.3),
  "shots": [
    {"at": 0, "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "idle", "expr": "happy"}, {"at": 1.3, "pose": "scared", "expr": "scared", "emote": "!"}]),
                         {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, {"at": 1.0, "pose": "point"}, {"at": 1.8, "pose": "shrug", "emote": "anger"}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 820, "y": 520, "zoom": 1.2, "dur": 2.5}, {"at": 1.3, "shake": 12}],
     "sfx": [{"at": 1.3, "type": "thud", "vol": 1.0}],
     "fx": [REC]},
    insert("Rina berhasil membuat", -0.2, [{"type": "countdown", "top": "PAK WIJAYA BERTAHAN", "from": 33, "to": 30, "unit": "HARI LAGI"}, REC], trans="whip"),
    {"cue": "Syaratnya satu", "d": -0.2, "trans": "whip", "loc": "gudang", "locOpt": dict(HOLD),
     "actors": [{"who": "rina", "x": 420, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "scared", "look": [1, -0.2]}]},
                D(1450, keys=[{"at": 0, "pose": "hold", "item": "box", "expr": "neutral", "look": [-1, 0]}])],
     "cam": [{"x": 900, "y": 500, "zoom": 1.0}, {"at": 0, "x": 960, "y": 480, "zoom": 1.1, "dur": 4}],
     "fx": [REC, cap(1400, 300, "SYARAT: GUDANG HARUS BERES", bg=RED, at=0.4)]},
    {"cue": "Dan Dodi, orang gudang", "d": -0.2, "trans": "whip", "loc": "bos", "locOpt": {"time": "sore", "deskX": 1300, "folder": True},
     "props": [{"type": "officeDoor", "x": 420, "y": 1000, "label": "KEPALA OPERASIONAL"}],
     "actors": [{"who": "hendra", "x": 1400, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral"}]},
                D(560, face=1, item="box", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, C("mendengar rencana", -0.2, expr="shock", emote="!", pencil=False),
                                                 C("Kalau gagal", pose="scared", expr="scared")])],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0, "x": 820, "y": 520, "zoom": 1.15, "dur": 3}, C("Kalau gagal", x=960, y=520, zoom=1.05, dur=1.0)],
     "fx": [REC, {"type": "dropPencil", "who": "dodi", "cue": "mendengar rencana", "d": -0.2},
            {"type": "card", "cue": "Kalau gagal", "d": 0.0, "text": "Kalau gagal: gudang diserahkan ke pihak luar.", "bg": RED, "size": 64, "y": 760}]},
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: gudang sunyi, hari 1
A.append({"n": 2, "name": "Gudang sunyi", "loc": "gudang", "music": "sad", "trans": "flash", "pre": 0.6,
  "locOpt": g(doorOpen=False, doorAt=C("Lalu Rina masuk", -0.8)),
  "props": [BROCH] + radio(False),
  "lines": [{"who": "dodi", "from": "Mau mengukur apa", "to": "membuang kami", "text": "Mau ngukur apa? Buat bukti buang kami?", "label": "Dodi", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [D(1100, y=960, layer="back", keys=[{"at": 0, "pose": "hold", "item": "paper", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 1640, "y": 820, "zoom": 2.0}, {"at": 0.2, "x": 1580, "y": 780, "zoom": 1.85, "dur": 3.5}, C("pagi ini sunyi", x=1150, y=560, zoom=1.15, dur=2.0)],
     "fx": [cap(1480, 190, "HARI 1 DARI 30 · 07.45", col="#F6C343", at=0.3, out=C("Dodi menempel label", -0.2)), day(1, at=0.6),
            card("Tidak ada", "Tidak ada \"Beres, Bos!\"", d=0.1, x=520, y=330, size=46)]},
    {"cue": "Dodi menempel label", "d": -0.2, "trans": "cut",
     "actors": [D(1100, y=960, layer="back", keys=[{"at": 0, "pose": "hold", "item": "paper", "expr": "sad", "look": "down"}, {"at": 1.2, "pose": "point", "item": None, "look": [1, 0.2]}, {"at": 2.4, "pose": "hold", "item": "paper", "look": "down"}])],
     "cam": [{"x": 1220, "y": 620, "zoom": 1.55}, {"at": 0, "x": 1260, "y": 640, "zoom": 1.7, "dur": 4}],
     "fx": [cap(560, 170, "BROSUR: JASA GUDANG PIHAK KETIGA", bg="#5E5A62", size=34, at=0.5)]},
    {"cue": "Lalu Rina masuk", "d": -1.0, "trans": "cut",
     "actors": [D(1100, y=960, layer="back", keys=[{"at": 0, "pose": "hold", "item": "paper", "expr": "sad", "look": "down"}, C("Dodi melihat alat", pose="idle", item=None, look=[-1, 0], expr="neutral")]),
                {"who": "rina", "x": -320, "face": 1, "item": "stopwatch", "keys": [{"at": 0.8, "x": 560, "dur": 2.0, "expr": "neutral"}, {"at": 2.9, "pose": "hold", "expr": "happy"}]},
                Y(-560, item="clipboard", keys=[{"at": 1.1, "x": 300, "dur": 2.0, "expr": "neutral"}, {"at": 3.2, "pose": "hold"}])],
     "cam": [{"x": 700, "y": 520, "zoom": 1.06}, {"at": 0.8, "x": 820, "y": 520, "zoom": 1.06, "dur": 3}],
     "fx": [{"type": "nameTag", "cue": "analis data kantor", "d": 0.0, "name": "Yoga", "role": "Analis data kantor", "x": 110, "y": 800, "out": C("Dodi melihat alat", 0)}]},
    {"cue": "Dodi melihat alat", "d": -0.2, "trans": "cut",
     "actors": [D(1200, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}, C("tertawa pahit", pose="shrug", expr="laugh"), C("Mau mengukur apa", pose="cross", expr="angry")]),
                {"who": "rina", "x": 600, "face": 1, "item": "stopwatch", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}, C("Mau mengukur apa", expr="scared", emote="sweat")]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.12}, {"at": 0, "on": "dodi", "fit": 0.22, "sx": 1150, "dur": 3}]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "KLIEN TERBESAR · EPS 4/4",
     "hook": "Gudang Paling Lambat Mau Diserahkan ke Pihak Luar", "day": "15", "month": "JUNI", "marker": "HARI 1 DARI 30", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Mencari waktu, bukan kesalahan
SEAT_R, SEAT_D = {"type": "box16", "x": 760, "y": 1000}, {"type": "box16", "x": 1180, "y": 1000, "label": "KASIR"}
A.append({"n": 4, "name": "Mencari waktu, bukan kesalahan", "loc": "gudang", "music": "warm", "trans": "iris",
  "locOpt": g(),
  "props": [SEAT_R, SEAT_D, BROCH],
  "lines": [{"who": "rina", "from": "Mas, kami tidak", "to": "waktunya habis", "text": "Kami cari waktunya, bukan yang salah.", "maxW": 520, "size": 42},
            {"who": "yoga", "from": "Kalau tidak diukur", "to": "cuma tebakan", "text": "Kalau tidak diukur, semua cuma tebakan.", "label": "Yoga", "maxW": 520, "size": 40},
            {"who": "dodi", "from": "Dua hari,", "to": "kasih dua hari", "text": "Dua hari. Saya kasih dua hari.", "label": "Dodi", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [D(1180, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]),
                         {"who": "rina", "x": 520, "face": 1, "item": "stopwatch", "keys": [{"at": 0, "pose": "idle", "expr": "neutral"}, {"at": 0.6, "x": 760, "dur": 1.4}, C("Ia duduk di atas", pose="sit", item=None, expr="happy", look=[1, 0])]},
                         Y(300, item="clipboard", layer="back", y=960, size=520, keys=[{"at": 0, "pose": "hold", "expr": "neutral"}])],
     "cam": [{"x": 900, "y": 520, "zoom": 1.06}, {"at": 0.4, "x": 960, "y": 560, "zoom": 1.14, "dur": 4}],
     "fx": [card("sejajar dengannya", "Duduk sejajar, bukan berdiri di depan.", d=0.0, x=1380, y=220, size=42, maxW=700)]},
    {"cue": "Mas, kami tidak", "d": -0.3, "trans": "cut",
     "actors": [D(1180, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0]}]),
                {"who": "rina", "x": 760, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0]}]}],
     "cam": [{"x": 960, "y": 640, "zoom": 1.5}, {"at": 0, "x": 940, "y": 640, "zoom": 1.62, "dur": 6}]},
    {"cue": "Yoga menambahkan pelan", "d": -0.2, "trans": "cut",
     "actors": [Y(700, item="clipboard", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, C("Kalau tidak diukur", pose="talk"), C("Termasuk tebakan", pose="hold", expr="happy")])],
     "cam": [{"on": "yoga", "fit": 0.22, "sx": 760}, {"at": 0, "on": "yoga", "fit": 0.27, "sx": 760, "dur": 6}],
     "fx": [cap(1450, 200, "ANALIS DATA · SEDIKIT KATA", bg="#5E5A62", size=32, at=0.4, out=C("Kalau tidak diukur", 0.4))]},
    insert("Termasuk tebakan", -0.2, {"type": "clipCard", "rowsAt": 0.8, "per": 0.7, "qAt": 4.6, "chip": "TERMASUK: \"GUDANG LAMBAT\"", "chipAt": C("gudang lambat", 0.0), "chipBg": RED}, trans="zoom"),
    {"cue": "Dodi menatap papan", "d": -0.2, "trans": "cut", "grade": SORE,
     "actors": [D(1050, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0.1]}, C("Sembilan tahun", expr="sad", look="down"), C("Mungkin angka bisa", expr="neutral", look=[-1, -0.2]),
                              C("Atau mungkin angka", expr="scared", look=[1, 0.1], emote="sweat"), C("lebih menakutkan", expr="sad", look="down")])],
     "cam": [{"on": "dodi", "fit": 0.22, "sx": 1150}, {"at": 0, "on": "dodi", "fit": 0.28, "sx": 1150, "dur": 12}],
     "fx": [card("Sembilan tahun", "9 tahun membela gudang dengan kata-kata.", d=0.1, x=560, y=220, size=40, maxW=700, out=C("Mungkin angka bisa", -0.3)),
            cap(560, 200, "ANGKA BISA MEMBELA?", bg=GREEN, size=34, cue="Mungkin angka bisa", d=0.0, out=C("lebih menakutkan", 0.6)),
            cap(560, 340, "ATAU MEMBUKTIKAN KANTOR BENAR?", bg=RED, size=32, cue="Atau mungkin angka", d=0.3, out=C("lebih menakutkan", 0.6))]},
    {"cue": "Dua hari,", "d": -0.3, "trans": "cut",
     "actors": [D(1180, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0]}, {"at": 0.3, "pose": "pointUp", "item": "two", "expr": "proud"}]),
                {"who": "rina", "x": 760, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}, C("kasih dua hari", expr="laugh", emote="sparkle")]},
                Y(380, item="clipboard", layer="back", y=960, size=520, keys=[{"at": 0, "pose": "hold", "expr": "happy"}])],
     "cam": [{"x": 980, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.28, "dur": 4}],
     "fx": [cap(560, 220, "2 HARI", bg=ORANGE, size=60, cue="kasih dua hari", d=0.0)]},
  ]})

# 5 ------------------------------------------------------------------ Mengukur
A.append({"n": 5, "name": "Mengukur", "loc": "gudang", "music": "light", "trans": "whip",
  "locOpt": g(),
  "shots": [
    {"at": 0, "actors": [Y(800, item="stopwatch", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}]),
                         staf("eko", 1700, face=-1, keys=[{"at": 0, "pose": "hold", "expr": "neutral", "x": 1700}, {"at": 0.4, "x": 1250, "dur": 2.0}])],
     "cam": [{"x": 950, "y": 520, "zoom": 1.1}, {"at": 0, "x": 960, "y": 540, "zoom": 1.2, "dur": 3}],
     "sfx": [{"at": 0.4, "type": "click", "vol": 0.6}],
     "fx": [day(1, at=0.3)]},
    insert("setiap kali satu pesanan", -0.3, {"type": "measure", "per": 1.15, "chip": "CETAK → KARDUS SELESAI", "chipAt": 0.5}, trans="zoom"),
    {"cue": "Rina mengikuti langkah", "d": -0.2, "trans": "whip",
     "actors": [staf("jaka", 1800, layer="main", y=1000, size=540, face=-1, keys=[{"at": 0, "pose": "hold", "expr": "neutral", "x": 1800}, {"at": 0.2, "x": 300, "dur": 4.5}]),
                {"who": "rina", "x": 2150, "face": -1, "item": "notebook", "keys": [{"at": 0.6, "x": 650, "dur": 4.5, "expr": "neutral"}, {"at": 5.2, "pose": "hold", "expr": "happy"}]}],
     "cam": [{"x": 1400, "y": 520, "zoom": 1.1}, {"at": 0.3, "x": 700, "y": 520, "zoom": 1.1, "dur": 4.8}],
     "fx": [cap(1500, 170, "IKUTI LANGKAHNYA", bg=RED, at=0.4)]},
    insert("dengan benang merah", -0.4, [{"type": "floorPlan", "growAt": 0.4, "growDur": 9.5, "n": 32, "hlAt": C("rak paling belakang", 0.0),
            "chip": "RAK 9 · POJOK BELAKANG", "chipAt": C("rak paling belakang", 0.3)}, day(2, 1, cue="Di hari kedua sore", d=0.0)], trans="zoom"),
  ]})

# 6 ------------------------------------------------------------------ Bayu: jadwal yang tidak bertemu
TRUCK = {"type": "truck16", "x": 1180, "y": 1000}
A.append({"n": 6, "name": "Jadwal tidak bertemu", "loc": "halaman", "music": "light", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "10:00"},
  "props": [TRUCK],
  "lines": [{"who": "bayu", "from": "Kurir kita datang", "to": "jam dua siang", "text": "Kurir jam sepuluh, kardusnya siap jam dua.", "label": "Bayu", "maxW": 540, "size": 40}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": 320, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral"}, C("Ia baru sadar", pose="idle", item=None, expr="shock", emote="!", look=[1, -0.2])]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.0}, {"at": 0, "x": 860, "y": 520, "zoom": 1.08, "dur": 5}],
     "fx": [cap(560, 170, "HALAMAN GUDANG · 10.00", col="#F6C343", at=0.3), day(2, at=0.5)]},
    {"cue": "Kurir kita datang", "d": -0.3, "trans": "cut",
     "actors": [{"who": "bayu", "x": 600, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "confused", "look": [1, -0.2]}, C("Kardusnya baru siap", pose="shrug", expr="shock")]}],
     "cam": [{"on": "bayu", "fit": 0.22, "sx": 700}, {"at": 0, "on": "bayu", "fit": 0.26, "sx": 700, "dur": 5}],
     "fx": [cap(1450, 620, "KURIR DATANG 10.00", bg=NAVY, col="#F6C343", cue="Kurir kita datang", d=0.3),
            cap(1450, 760, "KARDUS SIAP 14.00", bg=RED, cue="Kardusnya baru siap", d=0.0)]},
    {"cue": "Truk menunggu empat", "d": -0.2, "trans": "cut", "locOpt": {"time": "siang", "clock": "10:00", "clockRate": 55},
     "actors": [],
     "cam": [{"x": 1250, "y": 560, "zoom": 1.25}, {"at": 0, "x": 1300, "y": 560, "zoom": 1.35, "dur": 4}],
     "fx": [cap(560, 170, "TRUK MENUNGGU 4 JAM", bg=RED, at=0.3)]},
    {"cue": "Teknisi pasang menunggu", "d": -0.2, "trans": "whip", "loc": "tokobaru", "locOpt": {"time": "siang", "fill": 1, "counterX": 900, "banner": False},
     "props": [{"type": "box16", "x": 1350, "y": 1000, "label": "ALAT"}],
     "actors": [{"who": "teknisi", "x": 1350, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, {"at": 1.3, "pose": "think", "expr": "confused", "emote": "?"}]},
                {"who": "wijaya", "x": 600, "y": 950, "layer": "back", "face": 1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "angry", "look": [1, 0]}]}],
     "cam": [{"x": 1100, "y": 500, "zoom": 1.1}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.18, "dur": 4}],
     "fx": [cap(1450, 330, "TEKNISI MENUNGGU BARANG", bg="#5E5A62", at=0.3)]},
    {"cue": "Semua orang sibuk", "d": -0.2, "trans": "whip", "split": [
       {"loc": "gudang", "locOpt": g(), "actors": [staf("eko", 700, layer="main", y=1000, size=560, face=1, keys=[{"at": 0, "pose": "hold", "expr": "scared", "x": 500}, C("Semua orang sibuk", x=1200, dur=3.0)])],
        "cam": [{"x": 900, "y": 520, "zoom": 1.15}]},
       {"loc": "halaman", "locOpt": {"time": "siang", "clock": "13:10"}, "props": [dict(TRUCK, x=1000)], "actors": [],
        "cam": [{"x": 1050, "y": 540, "zoom": 1.2}, C("Semua orang sibuk", x=1150, y=540, zoom=1.28, dur=5)]}],
     "fx": [card("Tapi jadwalnya", "Jadwalnya tidak pernah bertemu.", d=0.0, x=960, y=200, size=48)]},
  ]})

# 7 ------------------------------------------------------------------ Hasil pengukuran
A.append({"n": 7, "name": "Enam puluh dua persen", "loc": "gudang", "music": "tense", "trans": "fade",
  "locOpt": g(),
  "lines": [{"who": "yoga", "from": "Enam puluh dua persen", "to": "dua persen", "text": "Enam puluh dua persen.", "label": "Yoga", "size": 46, "min": 2.2}],
  "shots": [
    {"at": 0, "actors": [Y(560, item="tablet", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, {"at": 1.2, "pose": "talk"}]),
                         {"who": "rina", "x": 900, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}]},
                         D(1300, keys=[{"at": 0, "pose": "cross", "expr": "neutral", "look": [-1, 0]}])],
     "cam": [{"x": 920, "y": 520, "zoom": 1.08}, {"at": 0, "x": 900, "y": 520, "zoom": 1.15, "dur": 4}],
     "fx": [day(3, at=0.3), cap(560, 170, "HASILNYA", bg=NAVY, col="#F6C343", at=0.5)]},
    insert("Menyiapkan satu pesanan", -0.3, {"type": "bar42", "barAt": 0.3, "splitAt": C("Dua puluh enam menitnya", 0.0), "pctAt": C("habis untuk berjalan", 0.2)}, trans="zoom"),
    {"cue": "Ia menggeser layar", "d": -0.2, "trans": "cut",
     "actors": [Y(700, item="tablet", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}, C("Enam puluh dua persen", pose="hold", expr="proud", look=[1, 0])])],
     "cam": [{"on": "yoga", "fit": 0.24, "sx": 760}, {"at": 0, "on": "yoga", "fit": 0.29, "sx": 760, "dur": 4}],
     "fx": [cap(1450, 240, "62% = BERJALAN", bg=ORANGE, size=48, cue="Enam puluh dua persen", d=0.3)]},
    insert("Lalu tabel kedua", -0.2, {"type": "movers", "rowsAt": [0.4, C("printer struk", 0.0), C("pemindai, dan", 0.0), C("Sementara rak paling depan", 0.2), C("hampir tidak pernah", -0.2)],
            "hlAt": C("rak sembilan", 0.0), "hl2At": C("hampir tidak pernah", 0.4), "chip": "PALING LARIS = PALING JAUH", "chipAt": C("Rak paling belakang", 0.0), "chipY": 1010,
            "chip2": "RAK DEPAN: JARANG DIKIRIM", "chip2At": C("hampir tidak pernah", 1.0), "chip2Y": 1010}, trans="zoom"),
    {"cue": "Dodi menatap grafik", "d": -0.2, "trans": "cut",
     "actors": [D(1150, keys=[{"at": 0, "pose": "idle", "expr": "shock", "look": [-1, 0]}, C("Masalahnya bukan orangnya", expr="neutral", look="cam"), C("letak barangnya", pose="pointUp", expr="proud")])],
     "cam": [{"on": "dodi", "fit": 0.24, "sx": 1150}, {"at": 0, "on": "dodi", "fit": 0.3, "sx": 1150, "dur": 6}],
     "fx": [card("Masalahnya bukan orangnya", "Bukan orangnya.", d=0.0, x=560, y=220, size=46, out=C("letak barangnya", -0.4)),
            card("letak barangnya", "Letak barangnya.", d=-0.3, x=560, y=220, size=52, bg="#FFF6EA")]},
  ]})

# 8 ------------------------------------------------------------------ Hari 12: tekanan → hitam (jeda iklan)
A.append({"n": 8, "name": "Hari 12", "loc": "gudang", "music": "tense", "musicCut": 2.0, "trans": "flash", "post": 0.4, "hold": 1.6,
  "locOpt": g(doorOpen=False, doorAt=C("Pak Hendra datang", -0.6)),
  "props": [BROCH, {"type": "box16", "x": 1650, "y": 1000}],
  "lines": [{"who": "hendra", "from": "Intinya apa, Rin", "to": "Sudah membaik", "text": "Intinya apa? Sudah membaik?", "label": "Pak Hendra", "maxW": 520, "size": 44},
            {"who": "rina", "from": "Belum, Pak", "to": "Belum, Pak", "text": "Belum, Pak.", "size": 46, "min": 2.0}],
  "shots": [
    insert("Hari kedua belas", -0.5, {"type": "countdown", "top": "30 HARI PERBAIKAN GUDANG", "from": 11, "to": 12, "unit": "DARI 30 HARI"}, trans="cut", noHeader=True),
    {"cue": "Pak Hendra datang", "d": -0.6, "trans": "flash",
     "actors": [{"who": "hendra", "x": 0, "face": 1, "size": 600, "keys": [{"at": 0.8, "x": 700, "dur": 1.8, "expr": "neutral"}, {"at": 2.7, "pose": "hips"}]},
                {"who": "vendor1", "x": -300, "face": 1, "item": "tape", "keys": [{"at": 1.4, "x": 300, "dur": 2.0, "expr": "neutral"}]},
                {"who": "vendor2", "x": -500, "face": 1, "item": "paper", "keys": [{"at": 1.8, "x": 120, "dur": 2.0, "expr": "neutral"}]},
                {"who": "rina", "x": 1350, "face": -1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, {"at": 1.4, "expr": "scared", "emote": "sweat"}]}],
     "cam": [{"x": 700, "y": 520, "zoom": 1.05}, {"at": 0.6, "x": 800, "y": 520, "zoom": 1.08, "dur": 3}],
     "fx": [day(12, 11, at=0.3)]},
    {"cue": "Di belakangnya", "d": -0.1, "trans": "cut",
     "props": [BROCH, {"type": "box16", "x": 1650, "y": 1000}, {"type": "tapeLine", "x": 420, "y": 720, "keys": [{"at": 0, "len": 0}, {"at": 0.6, "len": 900, "dur": 3.5}]}],
     "actors": [{"who": "vendor1", "x": 1400, "face": -1, "item": "tape", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down", "x": 380}, {"at": 0.6, "x": 1330, "dur": 3.5}]},
                {"who": "vendor2", "x": 380, "face": 1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}]}],
     "cam": [{"x": 900, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.22, "dur": 5}],
     "fx": [cap(1500, 170, "PETUGAS JASA GUDANG", bg="#5E5A62", at=0.3), cap(1500, 300, "MENGUKUR LORONG", bg=RED, size=34, at=1.2)]},
    {"cue": "Intinya apa, Rin", "d": -0.3, "trans": "cut",
     "actors": [{"who": "hendra", "x": 700, "face": 1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "neutral", "look": [1, 0]}, C("Intinya apa, Rin", pose="shrug", expr="angry")]},
                {"who": "rina", "x": 1250, "face": -1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "scared"}]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.08}, {"at": 0, "x": 960, "y": 540, "zoom": 1.16, "dur": 4}]},
    insert("Sejak hasil pengukuran", -0.2, {"type": "tenList", "writeStart": 0.2, "per": 0.32, "chip": "0 / 10 SELESAI", "chipAt": C("belum satu pun", 0.0), "chipBg": RED}, trans="zoom"),
    {"cue": "Belum, Pak", "d": -0.3, "trans": "cut",
     "actors": [{"who": "rina", "x": 900, "face": -1, "item": "paper", "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": [-1, 0.2]}]}],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 1000}, {"at": 0, "on": "rina", "fit": 0.28, "sx": 1000, "dur": 3}]},
    {"cue": "Di pojok, Dodi", "d": -0.2, "trans": "cut", "grade": {"tint": "rgba(40,50,90,.18)"},
     "actors": [D(1450, keys=[{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}, C("melepas topi", -0.1, pose="scratch", expr="sad"), C("melepas topi", 0.5, hat=None, item="cap", pose="hold"),
                              C("duduk di atas kardus", -0.2, x=1650, dur=0.9), C("duduk di atas kardus", 0.8, pose="sit", expr="sad", look="down")])],
     "cam": [{"x": 1450, "y": 600, "zoom": 1.45}, {"at": 0, "x": 1550, "y": 640, "zoom": 1.5, "dur": 3}, C("Untuk pertama kalinya", x=1600, y=620, zoom=1.3, dur=3)],
     "fx": [card("Untuk pertama kalinya", "Untuk pertama kalinya, ia menyerah.", d=0.2, x=700, y=230, size=44, maxW=700)]},
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 9 ------------------------------------------------------------------ Buku saku Dodi (kejutan tengah)
TEN_STRIKE = [C("mencoret sembilan", -0.6 + i * 0.28) for i in range(9)]
A.append({"n": 9, "name": "Buku saku Dodi", "loc": "gudang", "music": "sad", "trans": "fade", "pre": 0.8,
  "locOpt": g(),
  "props": [{"type": "box16", "x": 1650, "y": 1000}],
  "lines": [{"who": "yoga", "from": "Perbaiki yang paling", "to": "besar dulu", "text": "Perbaiki yang paling besar dulu.", "label": "Yoga", "maxW": 520, "size": 42},
            {"who": "dodi", "from": "Sudah saya usulkan", "to": "Dua kali", "text": "Sudah saya usulkan. Dua kali.", "label": "Dodi", "maxW": 520, "size": 42, "min": 3.0}],
  "shots": [
    {"at": 0, "grade": SORE, "actors": [Y(650, item="paper", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}]),
                                       {"who": "rina", "x": 950, "face": -1, "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": [-1, 0.2]}]},
                                       D(1650, keys=[{"at": 0, "pose": "sit", "item": "cap", "expr": "sad", "look": "down"}], **NOCAP)],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.06}, {"at": 0, "x": 950, "y": 520, "zoom": 1.12, "dur": 4}],
     "fx": [cap(560, 170, "SETELAH TAMU PERGI", bg="#5E5A62", at=0.4)]},
    insert("mengambil daftar", -0.2, {"type": "tenList", "written": True, "strikeAt": TEN_STRIKE, "circleAt": C("Tersisa satu", 0.0), "chip": "TERSISA SATU", "chipAt": C("Tersisa satu", 0.3), "chipBg": "#3BA36B"}, trans="zoom"),
    {"cue": "Perbaiki yang paling", "d": -0.3, "trans": "cut", "grade": SORE,
     "actors": [Y(700, item="paper", keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [1, 0]}, C("Barang yang paling laris", pose="point", expr="happy")])],
     "cam": [{"on": "yoga", "fit": 0.24, "sx": 760}, {"at": 0, "on": "yoga", "fit": 0.28, "sx": 760, "dur": 5}],
     "fx": [cap(1400, 330, "1 · BARANG LARIS KE RAK DEPAN", bg=GREEN, size=34, cue="Barang yang paling laris", d=0.2)]},
    {"cue": "Dodi tiba-tiba tertawa", "d": -0.2, "trans": "cut", "grade": SORE,
     "actors": [D(1200, keys=[{"at": 0, "pose": "sit", "item": "cap", "expr": "laugh", "look": [-1, 0]}, C("Bukan tawa pahit", expr="happy"), C("Ia mengeluarkan buku", pose="hold", item="pocketbook", expr="proud")], **NOCAP),
                {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "confused", "emote": "?", "look": [1, 0]}]}],
     "props": [{"type": "box16", "x": 1200, "y": 1000}],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.2}, {"at": 0, "on": "dodi", "fit": 0.24, "sx": 1100, "dur": 4}],
     "fx": [card("Bukan tawa pahit", "Bukan tawa pahit.", d=0.0, x=560, y=220, size=46)]},
    insert("membuka satu halaman", -0.4, {"type": "pocketBook", "openAt": 0.1, "sketchAt": C("Sketsa rak", -0.2), "textAt": C("Printer dan pemindai", -0.1), "dateAt": C("Tanggalnya dua tahun", 0.0),
            "zoomAt": C("Tanggalnya dua tahun", 0.6), "noteAt": C("rapat, nanti dulu", -0.2), "note2At": C("rapat, nanti dulu", 1.2),
            "chip": "2 TAHUN LALU", "chipAt": C("yang lalu", 0.1), "chipX": 420, "chipY": 150}, trans="zoom"),
    {"cue": "Sudah saya usulkan", "d": -0.2, "trans": "cut", "grade": SORE,
     "actors": [D(1200, keys=[{"at": 0, "pose": "sit", "item": "pocketbook", "expr": "sad", "look": [-1, 0]}, C("Tidak ada yang mendengar", look="down")], **NOCAP),
                {"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "shock", "look": [1, 0]}, C("Tidak ada yang mendengar", pose="sad", expr="sad")]}],
     "props": [{"type": "box16", "x": 1200, "y": 1000}],
     "cam": [{"x": 1000, "y": 580, "zoom": 1.25}, {"at": 0, "x": 1050, "y": 580, "zoom": 1.32, "dur": 6}],
     "fx": [card("Tidak ada yang mendengar", "Tidak ada yang mendengar.", d=0.0, x=560, y=220, size=46)]},
  ]})

# 10 ----------------------------------------------------------------- Sabtu memindahkan rak
A.append({"n": 10, "name": "Sabtu memindahkan rak", "loc": "gudang", "music": "light", "trans": "iris", "post": 1.6,
  "locOpt": g(),
  "props": signs() + radio(False),
  "lines": [{"who": "dodi", "from": "Printer ke rak satu", "to": "ke belakang", "text": "Printer ke rak satu! Kabel lama ke belakang!", "label": "Dodi", "kind": "shout", "maxW": 560, "size": 38}],
  "shots": [
    {"at": 0, "actors": [staf("eko", 300, keys=[{"at": 0, "pose": "hold", "expr": "happy", "x": 300}, {"at": 0.5, "x": 900, "dur": 3}]),
                         staf("jaka", 1700, face=-1, keys=[{"at": 0, "pose": "hold", "expr": "happy", "x": 1700}, {"at": 0.3, "x": 1200, "dur": 3}]),
                         D(960, keys=[{"at": 0, "pose": "point", "item": "pocketbook", "expr": "happy", "face": 1}, {"at": 1.6, "face": -1, "pose": "point"}], **NOCAP)],
     "cam": [{"x": 960, "y": 480, "zoom": 1.0}, {"at": 0, "x": 960, "y": 500, "zoom": 1.08, "dur": 4}],
     "fx": [cap(1480, 330, "SABTU PAGI", col="#F6C343", at=0.3), day(14, 12, at=0.5)]},
    {"cue": "Kali ini yang memimpin", "d": -0.2, "trans": "cut",
     "actors": [D(1000, keys=[{"at": 0, "pose": "hold", "item": "pocketbook", "expr": "proud", "look": "down"}, C("Printer ke rak satu", pose="point", face=-1, expr="laugh"),
                             C("Pemindai di sebelahnya", pose="pointUp", face=1), C("Kabel model lama", pose="point", face=-1)], **NOCAP)],
     "cam": [{"on": "dodi", "fit": 0.17, "sx": 1100, "sy": 640}, {"at": 0, "on": "dodi", "fit": 0.2, "sx": 1100, "sy": 640, "dur": 6}]},
    {"cue": "Rina, Yoga, Bayu", "d": -0.3, "trans": "whip",
     "props": signs() + radio(False) + [{"type": "trolley", "x": 300, "y": 1000, "label": "PRINTER STRUK", "keys": [{"at": 0, "x": 300}, {"at": 0.2, "x": 1250, "dur": 3.4}]},
                                        {"type": "trolley", "x": 1700, "y": 1000, "flip": True, "label": "KABEL LAMA", "keys": [{"at": 0, "x": 1900}, {"at": 0.2, "x": 900, "dur": 3.4}]}],
     "actors": [{"who": "rina", "x": 90, "face": 1, "keys": [{"at": 0, "pose": "hold", "expr": "laugh", "x": 90}, {"at": 0.2, "x": 1040, "dur": 3.4}]},
                Y(-80, keys=[{"at": 0, "pose": "hold", "expr": "happy", "x": -80}, {"at": 0.2, "x": 870, "dur": 3.4}]),
                {"who": "bayu", "x": 2080, "face": -1, "keys": [{"at": 0, "pose": "hold", "expr": "laugh", "x": 2080}, {"at": 0.2, "x": 1080, "dur": 3.4}]},
                {"who": "sinta", "x": 2260, "face": -1, "keys": [{"at": 0, "pose": "hold", "expr": "happy", "x": 2260}, {"at": 0.2, "x": 1300, "dur": 3.4}]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 520, "zoom": 1.06, "dur": 4}],
     "sfx": [{"at": 0.3, "type": "bus", "vol": 0.25, "dur": 2.5}]},
    {"cue": "Bu Ratna menggulung", "d": -0.2, "trans": "cut",
     "actors": [{"who": "ratna", "x": 860, "face": 1, "keys": [{"at": 0, "pose": "scratch", "expr": "proud"}, {"at": 1.3, "pose": "hold", "item": "box", "expr": "laugh"}]},
                staf("jaka", 1450, face=-1, item=None, layer="main", y=1000, size=540, keys=[{"at": 0, "pose": "clap", "expr": "laugh"}])],
     "cam": [{"on": "ratna", "fit": 0.22, "sx": 820}, {"at": 0, "on": "ratna", "fit": 0.26, "sx": 820, "dur": 4}],
     "fx": [cap(1450, 200, "BU RATNA IKUT MENGANGKAT", bg="#6E2430", size=34, at=0.5)]},
    {"cue": "Menjelang sore", "d": -0.2, "trans": "fade", "grade": SORE, "locOpt": g(doorOpen=False),
     "props": signs(C("rak-rak sudah berganti", -0.3)) + radio(False),
     "actors": [],
     "bounds": False, "cam": [{"x": -65, "y": -265, "zoom": 2.0}, {"at": 0, "x": -40, "y": -250, "zoom": 2.1, "dur": 4}],
     "fx": [cap(1450, 900, "BARANG LARIS → RAK DEPAN", bg=GREEN, cue="rak-rak sudah berganti", d=0.6)]},
    {"cue": "Dan radio gudang", "d": -0.2, "trans": "cut", "grade": SORE,
     "props": signs(True) + radio(False, keys=[C("menyala lagi", -0.1, on=True)]),
     "actors": [D(1180, keys=[{"at": 0, "pose": "hips", "expr": "happy", "look": [1, 0]}, C("menyala lagi", 0.3, pose="clap", expr="laugh", jump=20)], **NOCAP)],
     "cam": [{"x": 1450, "y": 680, "zoom": 1.5}, {"at": 0, "x": 1400, "y": 640, "zoom": 1.4, "dur": 4}],
     "sfx": [C("menyala lagi", -0.1, type="click", vol=0.7), C("menyala lagi", 0.1, type="chime", vol=0.5)],
     "fx": [{"type": "whistle", "who": "dodi", "cue": "menyala lagi", "d": 0.6, "dx": 90}]},
  ]})

# 11 ----------------------------------------------------------------- Jadwal baru Bayu
SCHED = {"type": "schedBoard", "x": 1500, "y": 1000}
A.append({"n": 11, "name": "Jadwal baru Bayu", "loc": "gudang", "music": "light", "trans": "whip",
  "locOpt": g(),
  "props": signs(True) + [dict(SCHED, keys=[{"at": 0, "strike": 0, "rev": 0}, C("Ia menulis ulang", 0.0, strike=1, dur=0.8)])],
  "lines": [{"who": "bayu", "from": "Santai, Dod", "to": "jadwal ketemu", "text": "Santai, Dod. Semua jadwal ketemu.", "label": "Bayu", "maxW": 520, "size": 42},
            {"who": "dodi", "from": "Kopimu di warung", "to": "ketemu, Bay", "text": "Kopimu di Bu Tini juga ketemu, Bay.", "label": "Dodi", "maxW": 520, "size": 40}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": 1180, "face": 1, "item": "marker", "keys": [{"at": 0, "pose": "point", "expr": "proud", "look": [1, -0.2]}, C("Ia menulis ulang", pose="pointUp", expr="happy")]}],
     "cam": [{"x": 1300, "y": 520, "zoom": 1.15}, {"at": 0, "x": 1350, "y": 500, "zoom": 1.22, "dur": 4}],
     "fx": [day(15, at=0.3)]},
    insert("Barang dikemas mulai", -0.4, {"type": "sched", "strikeAt": 0.2, "w1At": C("Barang dikemas mulai", 0.0), "w2At": C("Kurir datang jam sebelas", 0.0), "w3At": C("Teknisi memasang", 0.0),
            "chip": "TIDAK ADA TRUK MENUNGGU", "chipAt": C("Tidak ada lagi truk", 0.0)}, trans="zoom"),
    {"cue": "Santai, Dod", "d": -0.3, "trans": "cut",
     "props": signs(True) + [dict(SCHED, strike=1, rev=1)],
     "actors": [{"who": "bayu", "x": 1250, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "pointUp", "item": "thumb", "expr": "laugh"}, C("Dodi tertawa", pose="hips", item=None, expr="happy"),
                 C("Kopimu di warung", expr="shock", emote="sweat"), C("Bayu pura-pura", pose="idle", face=1, expr="proud", look=[1, -0.4])]},
                D(700, face=1, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}, C("Dodi tertawa", pose="clap", expr="laugh"), C("Kopimu di warung", pose="point", expr="proud")], **NOCAP)],
     "cam": [{"x": 980, "y": 520, "zoom": 1.12}, {"at": 0, "x": 960, "y": 520, "zoom": 1.2, "dur": 8}],
     "fx": [{"type": "whistle", "who": "bayu", "cue": "Bayu pura-pura", "d": 0.3, "dx": 90}]},
  ]})

# 12 ----------------------------------------------------------------- Ukur lagi (hari 20)
STATUS = {"type": "statusBoard", "x": 1560, "y": 640, "depth": 0.75}
A.append({"n": 12, "name": "Ukur lagi", "loc": "gudang", "music": "hope", "trans": "iris",
  "locOpt": g(),
  "props": signs(True) + radio(True, x=300) + [dict(STATUS, green=0)],
  "lines": [{"who": "yoga", "from": "sembilan puluh delapan", "to": "sembilan puluh delapan", "text": "Sembilan puluh delapan persen.", "label": "Yoga", "maxW": 520, "size": 42, "min": 2.4}],
  "shots": [
    {"at": 0, "actors": [Y(800, item="stopwatch", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, {"at": 1.4, "expr": "happy"}]),
                         staf("eko", 1300, face=-1, layer="main", y=1000, size=540, keys=[{"at": 0, "pose": "hold", "expr": "happy", "x": 1300}, {"at": 0.3, "x": 1050, "dur": 1.2}])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.1}, {"at": 0, "x": 960, "y": 520, "zoom": 1.18, "dur": 4}],
     "fx": [day(20, 15, at=0.3), cap(560, 170, "DIUKUR LAGI", bg=NAVY, col="#F6C343", at=0.5)]},
    insert("Menyiapkan satu pesanan", -0.3, {"type": "compare", "a0At": 0.2, "aAt": C("kini empat belas", 0.0), "b0At": C("Kiriman tepat waktu", 0.0), "bAt": C("menjadi sembilan", -0.3)}, trans="zoom"),
    {"cue": "sembilan puluh delapan", "d": -0.2, "trans": "cut",
     "actors": [Y(760, item="tablet", keys=[{"at": 0, "pose": "hold", "expr": "laugh", "look": [1, 0]}])],
     "cam": [{"on": "yoga", "fit": 0.24, "sx": 760}, {"at": 0, "on": "yoga", "fit": 0.28, "sx": 760, "dur": 3}],
     "fx": [cap(1450, 240, "98% TEPAT WAKTU", bg=GREEN, size=48, at=0.3)]},
    insert("Benang merah", -0.3, {"type": "floorPlan", "mode": "tidy", "growAt": 0.2, "growDur": 2.2, "n": 16, "title": "Denah gudang · hari 20", "hlAt": C("pendek dan rapi", 0.0),
            "chip": "PENDEK DAN RAPI", "chipAt": C("pendek dan rapi", 0.3), "chipBg": GREEN}, trans="zoom"),
    {"cue": "Untuk pertama kalinya", "d": -0.3, "trans": "zoom",
     "props": signs(True) + radio(True, x=300) + [dict(STATUS, keys=[{"at": 0, "green": 0}, C("berwarna hijau", -0.4, green=1, dur=0.6)])],
     "actors": [D(1050, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, -0.3]}, C("berwarna hijau", 0.2, pose="cheer", expr="laugh", jump=24)], **NOCAP),
                {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy", "look": [1, -0.3]}, C("berwarna hijau", 0.3, pose="clap", expr="laugh")]}],
     "cam": [{"x": 1450, "y": 450, "zoom": 1.5}, {"at": 0, "x": 1400, "y": 470, "zoom": 1.55, "dur": 2.2}, C("Tidak ada orang", x=1100, y=520, zoom=1.08, dur=1.4)],
     "sfx": [C("berwarna hijau", -0.4, type="chime", vol=0.8)],
     "fx": [card("Mereka hanya berhenti", "Berhenti berjalan ke tempat yang salah.", d=0.0, x=700, y=200, size=42, maxW=760)]},
  ]})

# 13 ----------------------------------------------------------------- Hari 30: Dodi presentasi di Melati
RAP = {"clock": "09:00", "slide": "gudang14", "backChairs": [1300, 1520], "tableX0": 1080, "tableX1": 1960,
       "tableItems": [[1300, "paper"], [1560, "cup"], [1800, "laptop"]]}
HEND_SIT = {"who": "hendra", "x": 1560, "face": -1, "size": 560}
RAT_SIT = {"who": "ratna", "x": 1820, "face": -1, "size": 560, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}]}
A.append({"n": 13, "name": "Hari 30: Dodi presentasi", "loc": "rapat", "music": "warm", "trans": "iris",
  "locOpt": dict(RAP, keys=[C("membuka halaman buku", 0.0, slide="bukuSaku"), C("menatap tanggal", 0.0, dateHl=True)]),
  "lines": [{"who": "rina", "from": "Ini ide Mas Dodi", "to": "yang presentasi", "text": "Ini ide Mas Dodi. Mas yang presentasi.", "maxW": 520, "size": 42},
            {"who": "hendra", "from": "Dua tahun lalu", "to": "tahun lalu", "text": "Dua tahun lalu?", "label": "Pak Hendra", "size": 46, "min": 2.0},
            {"who": "hendra", "from": "Maaf, Dod", "to": "tidak mendengar", "text": "Maaf, Dod. Kami tidak mendengar.", "label": "Pak Hendra", "maxW": 520, "size": 42, "min": 3.0},
            {"who": "hendra", "from": "Gudang tetap milik", "to": "milik kita", "text": "Gudang tetap milik kita.", "label": "Pak Hendra", "maxW": 520, "size": 44, "min": 2.6}],
  "shots": [
    {"at": 0, "actors": [dict(HEND_SIT, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, 0]}]), RAT_SIT,
                         {"who": "rina", "x": 1050, "face": -1, "item": "clicker", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}]},
                         D(780, face=1, keys=[{"at": 0, "pose": "idle", "expr": "scared", "look": [1, 0]}], **NOCAP)],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.0}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.06, "dur": 5}],
     "fx": [day(30, 20, at=0.3), cap(560, 960, "RUANG MELATI · HARI 30", bg=NAVY, col="#F6C343", at=0.5)]},
    {"cue": "Tapi Rina menyerahkan", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 1050, "face": -1, "item": "clicker", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}, {"at": 1.2, "pose": "point", "item": None}, C("Ini ide Mas Dodi", pose="talk", expr="happy")]},
                D(780, face=1, keys=[{"at": 0, "pose": "idle", "expr": "shock", "look": [1, 0]}, {"at": 1.3, "pose": "hold", "item": "clicker", "expr": "scared", "emote": "sweat"}], **NOCAP)],
     "cam": [{"x": 920, "y": 560, "zoom": 1.3}, {"at": 0, "x": 920, "y": 560, "zoom": 1.38, "dur": 6}]},
    {"cue": "Dodi gugup", "d": -0.2, "trans": "cut",
     "actors": [D(1200, face=-1, keys=[{"at": 0, "pose": "hold", "item": "clicker", "expr": "scared", "emote": "sweat", "look": [-1, -0.3]}, C("membuka halaman buku", 0.3, pose="point", expr="neutral")], **NOCAP)],
     "cam": [{"x": 950, "y": 420, "zoom": 1.15}, {"at": 0, "x": 860, "y": 380, "zoom": 1.3, "dur": 5}],
     "fx": [cap(1500, 200, "BUKU SAKU · 2 TAHUN LALU", bg=RED, size=34, cue="membuka halaman buku", d=0.6)]},
    {"cue": "Pak Hendra menatap", "d": -0.2, "trans": "cut",
     "actors": [dict(HEND_SIT, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [-1, -0.3]}, C("cukup lama", expr="shock"), C("Lalu ia berdiri", pose="idle", expr="sad", look=[-1, 0]),
                                     C("Dua tahun lalu", pose="point", expr="confused")]), RAT_SIT],
     "cam": [{"on": "hendra", "fit": 0.2, "sx": 1150}, {"at": 0, "on": "hendra", "fit": 0.24, "sx": 1150, "dur": 5}]},
    {"cue": "Dodi mengangguk", "d": -0.2, "trans": "cut",
     "actors": [{"who": "hendra", "x": 1450, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "idle", "expr": "sad"}, C("Maaf, Dod", pose="talk", expr="sad", look=[-1, 0])]},
                D(900, face=1, keys=[{"at": 0, "pose": "hold", "item": "clicker", "expr": "sad", "look": "down"}, C("Maaf, Dod", expr="shock", look=[1, 0]), C("tidak mendengar", 0.4, expr="happy")], **NOCAP)],
     "props": [],
     "locOpt": dict(RAP, slide="bukuSaku", table=False),
     "cam": [{"x": 1180, "y": 520, "zoom": 1.2}, {"at": 0, "x": 1180, "y": 520, "zoom": 1.28, "dur": 7}]},
    insert("Ia memasukkan brosur", -0.2, {"type": "drawer", "openAt": 0.2, "moveAt": 0.8, "closeAt": 2.2, "chip": "GUDANG TETAP MILIK KITA", "chipAt": C("Gudang tetap milik", 0.0)}, trans="zoom"),
    {"cue": "Gudang tetap milik", "d": 0.6, "trans": "cut",
     "actors": [{"who": "hendra", "x": 1450, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "pointUp", "expr": "happy"}]},
                D(900, face=1, keys=[{"at": 0, "pose": "cheer", "item": "clicker", "expr": "laugh", "jump": 24}], **NOCAP),
                {"who": "rina", "x": 600, "face": 1, "keys": [{"at": 0, "pose": "clap", "expr": "laugh"}]}],
     "locOpt": dict(RAP, slide="bukuSaku", table=False),
     "cam": [{"x": 1050, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1050, "y": 520, "zoom": 1.16, "dur": 3}]},
  ]})

# 14 ----------------------------------------------------------------- Kabar dari Pak Wijaya
A.append({"n": 14, "name": "Kabar dari Pak Wijaya", "loc": "rapat", "music": "hope", "trans": "whip",
  "locOpt": dict(RAP, slide="logo", clock="16:10", table=False),
  "lines": [{"who": "wijaya", "from": "Bulan depan saya", "to": "pakai Tangani", "text": "Lima toko baru. Semuanya pakai Tangani.", "label": "Pak Wijaya", "maxW": 500, "size": 40, "pos": [1540, 520], "shots": [1]},
            {"who": "wijaya", "from": "Tapi Mbak Rina", "to": "memegangnya, ya", "text": "Mbak Rina dan Mas Dodi yang pegang.", "label": "Pak Wijaya", "maxW": 500, "size": 40, "pos": [1540, 520], "shots": [3]},
            {"who": "dodi", "from": "Beres, Bos", "to": "Beres, Bos", "text": "Beres, Bos!", "label": "Dodi", "kind": "shout", "min": 2.4}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 760, "face": 1, "item": "phoneBuzz", "keys": [{"at": 0, "pose": "phone", "expr": "shock", "emote": "!"}, {"at": 1.6, "pose": "phone", "item": "phone", "expr": "happy"}]},
                         D(1100, face=-1, keys=[{"at": 0, "pose": "idle", "item": "cap", "expr": "confused", "look": [-1, 0.2]}], **NOCAP),
                         {"who": "hendra", "x": 1450, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.2]}]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.1}, {"at": 0, "x": 960, "y": 540, "zoom": 1.2, "dur": 3}],
     "sfx": [{"at": 0.1, "type": "ring", "vol": 0.7, "dur": 1.4}],
     "fx": [cap(1500, 200, "SORE · PAK WIJAYA MENELEPON", bg="#8E4A24", size=34, at=0.3)]},
    insert("Bulan depan saya", -0.8, {"type": "wijayaCall", "newAt": C("lima toko baru", 0.0), "talk": [[C("Bulan depan saya", 0), C("pakai Tangani.", 0)], [C("Tapi Mbak Rina", 0), C("memegangnya, ya", 0.3)]],
            "dodiExpr": "shock", "chip": "+5 TOKO BARU", "chipAt": C("lima toko baru", 0.3), "chipY": 760, "px": 760}, trans="zoom"),
    insert("Lalu ia menambahkan", -0.2, {"type": "storeMap17", "litAt": 0.0, "newAt": 0.9, "chip": "12 + 5 TOKO · SEMUA PAKAI TANGANI", "chipAt": 3.4}, trans="whip"),
    insert("Tapi Mbak Rina", -0.6, {"type": "wijayaCall", "talk": [[C("Tapi Mbak Rina", 0), C("memegangnya, ya", 0.3)]], "dodiExpr": "laugh", "px": 760, "expr": "laugh"}, trans="whip"),
    {"cue": "Dodi memakai kembali", "d": -0.4, "trans": "cut",
     "actors": [D(1000, face=-1, keys=[{"at": 0, "pose": "hold", "item": "cap", "expr": "happy", "look": [-1, 0]}, C("memakai kembali", 0.4, pose="scratch", item=None, hat="cap"),
                                       C("tiga puluh hari", pose="idle", expr="proud", look="cam"), C("Beres, Bos", -0.2, pose="pointUp", item="thumb", expr="laugh", jump=30)], **NOCAP),
                {"who": "rina", "x": 600, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Beres, Bos", 0.0, pose="cheer", expr="laugh")]},
                {"who": "hendra", "x": 1450, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Beres, Bos", 0.1, pose="clap", expr="laugh")]}],
     "cam": [{"on": "dodi", "fit": 0.2, "sx": 960}, {"at": 0, "on": "dodi", "fit": 0.24, "sx": 960, "dur": 2.5}, C("Beres, Bos", -0.4, x=1000, y=520, zoom=1.1, dur=0.8, ease="back")],
     "fx": [{"type": "confetti", "cue": "Beres, Bos", "d": 0.0, "x": 960, "y": 260, "count": 90},
            card("terdengar lagi", "Setelah 30 hari, terdengar lagi.", d=0.0, x=560, y=220, size=40, maxW=700, out=C("Beres, Bos", -0.3))]},
  ]})

# 15 ----------------------------------------------------------------- Kartu pelajaran + montase penutup
A.append({"n": 15, "name": "Pelajaran + penutup cerita", "loc": "gudang", "music": "warm", "trans": "iris", "post": 3.6,
  "locOpt": g(),
  "props": signs(True) + radio(True, x=300) + [dict(STATUS, green=1)],
  "shots": [
    {"at": 0, "blur": 9, "actors": [D(300, face=1, size=600, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: masalah", pose="pointUp", item="pocketbook"),
                 C("Dua: perbaiki", pose="hips", item=None, expr="proud"), C("Tiga: dengarkan", pose="pointUp", expr="laugh", item="pocketbook", jump=30)])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 22}],
     "fx": [{"type": "lesson", "cue": "Satu: masalah", "d": -0.6, "tag": "PELAJARAN DARI GUDANG", "items": [{"cue": "Satu: masalah", "text": "Masalah yang diukur bisa diperbaiki"},
            {"cue": "Dua: perbaiki", "text": "Perbaiki hambatan terbesar dulu"}, {"cue": "Tiga: dengarkan", "text": "Dengarkan orang lapangan"}]}]},
    {"cue": "Klien terbesar itu", "d": -0.3, "trans": "fade", "loc": "lobi", "locOpt": dict(LOBI, slam=0.6), "push": 0.02,
     "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "scared", "expr": "scared"}]), {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "shrug", "expr": "angry"}]}],
     "cam": [{"x": 860, "y": 520, "zoom": 1.15}, {"at": 0, "x": 820, "y": 520, "zoom": 1.22, "dur": 3}],
     "fx": [MEM]},
    insert("tidak pernah salah", -0.1, [{"type": "stickyMove", "lines": ["DENGAR", "AKUI", "JAM"], "writeAt": -5, "circleAt": 99}, MEM], trans="fade"),
    {"cue": "Ia bertahan karena", "d": -0.1, "trans": "fade", "loc": "kabin", "locOpt": {},
     "actors": [D(700, face=1, size=700, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [0, -0.2]}]), {"who": "rina", "x": 1220, "face": -1, "size": 700, "keys": [{"at": 0, "pose": "sit", "expr": "happy"}]}],
     "cam": [{"x": 960, "y": 560, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.12, "dur": 3}],
     "fx": [MEM]},
    {"cue": "diakui, dikabari", "d": -0.1, "trans": "fade", "loc": "gudang", "locOpt": g(),
     "props": signs(True) + [{"type": "trolley", "x": 700, "y": 1000, "label": "PRINTER STRUK", "keys": [{"at": 0, "x": 500}, {"at": 0, "x": 900, "dur": 3}]}],
     "actors": [{"who": "sinta", "x": 450, "face": 1, "keys": [{"at": 0, "pose": "hold", "expr": "laugh", "x": 320}, {"at": 0, "x": 720, "dur": 3}]},
                {"who": "bayu", "x": 1300, "face": -1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh"}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 960, "y": 520, "zoom": 1.14, "dur": 3}],
     "fx": [MEM]},
    {"cue": "diperbaiki bersama-sama", "d": -0.2, "trans": "fade", "loc": "gudang", "locOpt": g(), "props": signs(True) + [dict(STATUS, green=1)] + radio(True, x=300),
     "actors": [D(960, face=1, size=640, keys=[{"at": 0, "pose": "pointUp", "item": "thumb", "expr": "laugh", "look": "cam"}])],
     "cam": [{"on": "dodi", "fit": 0.22, "sx": 960}, {"at": 0, "on": "dodi", "fit": 0.18, "sx": 960, "dur": 6}],
     "fx": [{"type": "finale", "cue": "diperbaiki bersama-sama", "d": 1.0, "title": "KLIEN TERBESAR", "stamp": "SELESAI", "sub": "Cerita 2 · Eps 1–4 · Kantor Tangani"}]},
  ]})

# 16 ----------------------------------------------------------------- Cuplikan cerita baru: Utang Bayu + layar akhir
PAN = {"time": "siang", "clock": "12:41"}
PTAB = [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1000, "cups": [[-380, "teh"]]}, {"type": "bekal", "x": 900, "y": 880, "layer": "front"},
        {"type": "deskCal", "x": 1330, "y": 880, "layer": "front", "mon": "JULI", "day": "5", "sub": "GAJIAN +10", "ring": True}]
A.append({"n": 16, "name": "Cuplikan Utang Bayu + layar akhir", "loc": "pantry", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": PAN, "props": PTAB,
  "lines": [{"who": "bayu", "from": "Rin, boleh pinjam", "to": "Buat makan", "text": "Rin, boleh pinjam dulu? Buat makan.", "label": "Bayu", "maxW": 520, "size": 42, "min": 2.8}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": 960, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": "down"}]}],
     "cam": [{"x": 1150, "y": 640, "zoom": 1.5}, {"at": 0, "x": 1250, "y": 700, "zoom": 1.7, "dur": 6}],
     "fx": [cap(560, 170, "CERITA BARU · SEBENTAR LAGI", bg="#6E2430", at=0.3), cap(1500, 170, "5 JULI · GAJIAN +10 HARI", bg=NAVY, col="#F6C343", cue="Tanggal lima Juli", d=0.2)]},
    {"cue": "Bayu duduk di pantry", "d": -0.2, "trans": "cut",
     "actors": [{"who": "bayu", "x": 960, "face": 1, "item": "phoneBuzz", "keys": [{"at": 0, "pose": "sit", "item": None, "expr": "sad", "look": "down"}, C("Ponselnya terus", -0.4, pose="phone", item="phoneBuzz", expr="scared", emote="sweat")]}],
     "cam": [{"x": 940, "y": 760, "zoom": 1.8}, {"at": 0, "x": 960, "y": 700, "zoom": 1.9, "dur": 4}],
     "sfx": [C("Ponselnya terus", -0.4, type="buzz", vol=0.7, dur=1.0)],
     "fx": [cap(560, 200, "NASI PUTIH + KERUPUK", bg="#8E4A24", size=34, at=0.6)]},
    insert("Ponselnya terus", 0.2, {"type": "bills", "startAt": 0.3, "per": 0.32, "date": "5 Juli", "chip": "7 APLIKASI · 7 TAGIHAN", "chipAt": 2.7}, trans="zoom"),
    {"cue": "Lalu ia tersenyum", "d": -0.2, "trans": "cut",
     "actors": [{"who": "bayu", "x": 900, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "scared"}, {"at": 0.6, "pose": "sit", "item": None, "expr": "laugh", "look": [1, -0.1]}, C("Rin, boleh pinjam", pose="wave", expr="laugh")]},
                {"who": "rina", "x": 1650, "face": -1, "item": "cup", "keys": [{"at": 0, "x": 2100}, {"at": 0.1, "x": 1450, "dur": 1.4, "expr": "happy"}, C("Buat makan", -0.2, expr="shock", emote="!")]}],
     "cam": [{"x": 1150, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1150, "y": 560, "zoom": 1.28, "dur": 5}]},
    {"cue": "Saksikan cerita baru", "d": -0.2, "trans": "flash", "blur": 8,
     "actors": [{"who": "bayu", "x": 900, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "laugh"}]}],
     "cam": [{"x": 960, "y": 540, "zoom": 1.05}, {"at": 0, "x": 960, "y": 540, "zoom": 1.1, "dur": 4}],
     "fx": [{"type": "card", "at": 0.1, "text": "UTANG BAYU", "tag": "CERITA BARU", "sub": "Kantor Tangani", "size": 110, "bg": "#C2691F"}]},
    {"cue": "Kalau cerita ini", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Rin, pinjam dulu?\"", "nextSub": "buat makan…", "nextTitle": "Utang Bayu · Eps 1",
             "nextWho": "bayu", "nextKey": {"pose": "wave", "expr": "laugh"}, "nextThumb": False, "playlist": "Klien Terbesar", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Di kantormu, ide siapa yang paling sering tidak didengar? Tulis di komentar!"}]},
  ]})


def shot_local(A):
    """Mesin membaca `at` (aktor, kamera, fx, props) sebagai detik sejak awal ADEGAN. Di shot ke-2 dst. data di sini ditulis
    relatif terhadap awal SHOT, jadi diubah ke {cue shot, d} (atau shot.at + at bila shot tidak memakai cue)."""
    def fix(k, sh, need):
        if "at" not in k or "cue" in k or not need(k):
            return
        a = k.pop("at")
        if "cue" in sh:
            k["cue"] = sh["cue"]; k["d"] = round(sh.get("d", 0) + a, 3)
            if "n" in sh: k["n"] = sh["n"]
        else:
            k["at"] = round(sh.get("at", 0) + a, 3)
    moving = lambda k: k["at"] > 0 or "dur" in k
    for a in A:
        for sh in a.get("shots", [])[1:]:
            for ac in sh.get("actors", []):
                for k in ac.get("keys", []): fix(k, sh, moving)
            for p in sh.get("props", []):
                for k in p.get("keys", []): fix(k, sh, moving)
            for k in sh.get("cam", []): fix(k, sh, moving)
            for f in sh.get("fx", []): fix(f, sh, lambda k: k["at"] > 0)
            for k in sh.get("sfx", []): fix(k, sh, lambda k: k["at"] > 0)


def check_cues(A):
    """Setiap cue harus ada di narasi adegannya (huruf kecil, tanda baca persis)."""
    nar = narration(ROOT / NASKAH); bad = []
    def walk(o, n):
        if isinstance(o, dict):
            for k in ("cue", "from", "to"):
                v = o.get(k)
                if isinstance(v, str) and v.lower() not in nar.get(n, "").lower(): bad.append((n, k, v))
            for v in o.values(): walk(v, n)
        elif isinstance(o, list):
            for v in o: walk(v, n)
    for a in A: walk(a, a["n"])
    for b in bad: print("CUE TIDAK DITEMUKAN:", b)
    return not bad


A = json.loads(json.dumps(A))   # helper dicts (signs(), radio(), BROCH …) are shared between shots → give every shot its own copy before shot_local mutates them
shot_local(A)
for a in A:   # story16 hanya membaca sfx di tingkat adegan (sfx di dalam shot diabaikan mesin) → pindahkan
    for sh in a.get("shots", []):
        if sh.get("sfx"): a.setdefault("sfx", []).extend(sh.pop("sfx"))
ep = {"slug": "kantor-08", "title": "Gudang Paling Lambat Mau Diserahkan ke Pihak Luar | Kantor Tangani: Klien Terbesar Eps 4",
      "series": "Kantor Tangani", "story": "Klien Terbesar", "eps": "4/4", "month": "JUNI–JULI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Gudang sunyi"], [4, "Mengukur"], [7, "Enam puluh dua persen"], [9, "Buku saku Dodi"], [10, "Memindahkan rak"], [15, "Pelajaran"], [16, "Cerita baru"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah & hasil", 5, 7], ["Cerita baru", 7, 8]],
      "lessons": ["Masalah yang diukur bisa diperbaiki; masalah yang hanya dirasakan biasanya cuma jadi saling menyalahkan.",
                  "Perbaiki hambatan terbesar dulu, bukan sepuluh hal sekaligus.",
                  "Dengarkan orang lapangan: sering kali jawabannya sudah lama ada, di buku saku seseorang."],
      "youtube": {
        "desc": "Hari pertama dari tiga puluh. Gudang yang dicap paling lambat akan diserahkan ke perusahaan luar kalau gagal berbenah, dan orang gudangnya sudah hampir menyerah. Bagaimana memperbaiki bagian yang sudah dicap \"paling lambat\" dalam 30 hari? Episode terakhir Kantor Tangani: Klien Terbesar.",
        "ask": "Di kantormu, ide siapa yang paling sering tidak didengar? Tulis di kolom komentar.",
        "next": "Cerita baru, Kantor Tangani: Utang Bayu, tayang berikutnya.",
        "tags": "kantor tangani, klien terbesar, cerita kantor, animasi kantor, perbaikan proses, ukur kinerja, gudang, logistik, hambatan terbesar, dengarkan karyawan, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #KlienTerbesar #duniakerja",
        "adAfter": 8},
      "thumb": {"kind": "gudang4", "lines": ["GUDANG", "PALING LAMBAT"], "hl": "MAU DIBUANG?", "lineSize": 84, "hlSize": 88, "badge": "EPS 4/4", "tag": "KANTOR TANGANI · KLIEN TERBESAR"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
