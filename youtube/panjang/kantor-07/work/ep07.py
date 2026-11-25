#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-07 (Klien Terbesar Eps 3: "7 hari sebelum pergi").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() mengubahnya ke {cue shot, d}.
Bagian split memakai cue. SFX selalu di tingkat adegan (sfx di dalam shot dipindah otomatis; mesin mengabaikan sfx shot)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-07/episode.json"
NASKAH = "youtube/serial/ep07-naskah.md"

def C(cue, d=None, **kw):
    o = {"cue": cue}
    if d is not None: o["d"] = d
    o.update(kw); return o

CHAIR = {"type": "chair16", "x": 830, "y": 1000}
def desk(**kw):
    o = {"type": "deskR", "x": 1210, "y": 1000}; o.update(kw); return o
def rina_sit(**kw):
    o = {"who": "rina", "x": 850, "face": 1}; o.update(kw); return o
def cap(x, y, text, bg="#13223D", col=None, **kw):
    o = {"type": "chip", "text": text, "x": x, "y": y, "bg": bg}
    if col: o["col"] = col
    o.update(kw); return o
def card(cue, text, d=0.1, **kw):
    o = {"type": "card", "cue": cue, "d": d, "style": "small", "text": text, "x": 1380, "y": 210, "size": 50}; o.update(kw); return o
NOLOC = {"actors": [], "useLoc": False}
def insert(cue, d, fx, trans="zoom", **kw):
    o = dict(cue=cue, d=d, trans=trans, **NOLOC); o["fx"] = fx if isinstance(fx, list) else [fx]; o.update(kw); return o
def day(n, keys=None):
    o = {"type": "dayCount", "at": 0.4, "day": n}
    if keys: o["keys"] = keys
    return o

LOBI = {"time": "pagi", "deskX": 1100, "deskFront": True, "stairs": 1600, "slamX": -230}
REC = {"type": "recap", "label": "SEBELUMNYA DI KLIEN TERBESAR"}
TOKO = {"time": "pagi", "fill": 0.9, "counterX": 900, "banner": False}
G = {"door": -150, "doorOpen": True, "bench": 1100, "board": 1560, "board5": True, "emptyRack": {"x": 300, "w": 520, "label": "WIJAYA · TK-12", "note": False}, "boxes": []}
# dua meja didorong berdampingan (tampak depan): Sinta kiri, Rina kanan
def two(sinta=None, rina=None, **kw):
    s = {"type": "deskFront", "x": 700, "y": 1000, "laptopX": -200, "lidW": 180, "lidH": 120, "book": 230, "mug": True, "mugX": 90}; s.update(sinta or {})
    r = {"type": "deskFront", "x": 1340, "y": 1000, "laptopX": 200, "lidW": 180, "lidH": 120, "mugX": -100}; r.update(rina or {})
    return [s, r]
SINTA = lambda **kw: dict({"who": "sinta", "x": 700, "y": 950, "layer": "back", "face": 1, "size": 560}, **kw)
RINA = lambda **kw: dict({"who": "rina", "x": 1340, "y": 950, "layer": "back", "face": -1, "size": 560}, **kw)
DODI_LOOK = {"hat": "cap", "hatColor": "#C2691F", "beard": "goatee", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "a", "pencil": True}
M3 = lambda a, b, c: f"Sudah: {a}\nSedang: {b}\nRisiko: {c}"
D2 = M3("4 kiriman tepat waktu", "cek ganda di gudang", "kurir utama penuh Kamis")
D3 = M3("kurir cadangan siap", "cek ganda tiap kardus", "hujan sore di jalur barat")
D6 = M3("pemindai toko 5 terpasang", "cek ganda tiap kiriman", "tidak ada hari ini")

extras = {
    "dodi": {"nama": "Dodi (staf gudang & lapangan)", "look": DODI_LOOK},
    "wijaya": {"nama": "Pak Wijaya (klien, 12 toko)", "look": {"hat": "kopiah", "hatColor": "#1E1A18", "mustache": True, "hairColor": "#8A8A8A", "shirt": "#8E4A24", "pants": "#2C2433", "skin": "c"}},
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
    "eko": {"nama": "Mas Eko (staf gudang)", "look": {"hair": "short", "hairColor": "#1E1410", "hat": "cap", "hatColor": "#3B4A6B", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "c"}},
    "sopir": {"nama": "Sopir kurir cadangan", "look": {"hair": "short", "hairColor": "#2B1A12", "hat": "cap", "hatColor": "#2F6F73", "shirt": "#E8C07A", "jacket": "#2F6F73", "pants": "#2C2433", "skin": "d"}},
}

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 1–2)
A.append({"n": 1, "name": "Sebelumnya di Klien Terbesar", "loc": "lobi", "music": "tense", "pre": 0.5, "post": 0.5, "trans": "cut",
  "locOpt": dict(LOBI, slam=1.3),
  "sfx": [{"at": 1.3, "type": "thud", "vol": 1.0}],
  "shots": [
    {"at": 0, "actors": [{"who": "resepsionis", "x": 1080, "y": 930, "layer": "back", "face": -1, "size": 520, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, {"at": 1.3, "pose": "scared", "expr": "scared", "emote": "!"}]},
                         {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, {"at": 1.0, "pose": "point"}, {"at": 1.8, "pose": "shrug", "emote": "anger"}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 820, "y": 520, "zoom": 1.2, "dur": 2.5}, {"at": 1.3, "shake": 12}],
     "fx": [REC]},
    {"cue": "Rina belajar menenangkan", "d": -0.2, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "pagi", "clock": "09:07"}, "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.1]}, C("klien terbesar kantor", expr="proud")])],
        "cam": [{"x": 900, "y": 540, "zoom": 1.18}, C("Rina belajar menenangkan", x=880, y=540, zoom=1.26, dur=4)]},
       {"loc": "tokobaru", "locOpt": dict(TOKO, fill=0.5), "actors": [{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "angry"}, C("klien terbesar kantor", expr="neutral")]}],
        "cam": [{"x": 960, "y": 500, "zoom": 1.1}, C("Rina belajar menenangkan", x=930, y=500, zoom=1.18, dur=4)]}],
     "fx": [REC]},
    {"cue": "Ia berteman dengan Dodi", "d": -0.2, "trans": "whip", "loc": "gudang", "locOpt": {"holdRack": {"x": 640, "w": 640, "box": "WIJAYA · TK-11"}, "boxes": [[1760, 2]]},
     "actors": [{"who": "rina", "x": 420, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": [1, 0]}, C("mengakui kesalahannya", pose="talk", expr="sad")]},
                {"who": "dodi", "x": 1250, "face": -1, "size": 580, "item": "box", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("mengakui kesalahannya", 0.6, pose="wave", item="keys", expr="happy")]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.06}, {"at": 0, "x": 950, "y": 520, "zoom": 1.14, "dur": 4}], "grade": {"tint": "rgba(255,150,60,.10)"},
     "fx": [REC]},
    {"cue": "Toko baru Pak Wijaya", "d": -0.2, "trans": "whip", "loc": "tokoluar", "locOpt": {"time": "pagi", "ribbon": True, "ribbonCut": C("buka tepat waktu", -0.3)},
     "actors": [{"who": "wijaya", "x": 1240, "face": -1, "size": 620, "keys": [{"at": 0, "pose": "hips", "expr": "happy"}, C("buka tepat waktu", -0.3, pose="cheer", expr="laugh")]}],
     "cam": [{"x": 1100, "y": 470, "zoom": 1.0}, {"at": 0, "x": 1150, "y": 480, "zoom": 1.08, "dur": 3}],
     "fx": [REC, {"type": "confetti", "cue": "buka tepat waktu", "d": -0.2, "x": 1570, "y": 420, "count": 60}]},
    insert("Tapi dua minggu", -0.2, [{"type": "warnMail", "openAt": -1, "hlAt": 0.8, "zoomAt": 99}, REC], trans="flash"),
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: ruang rapat Melati
RAPAT2 = {"slide": "email", "clock": "09:00", "backChairs": [], "hl7": C("Dalam tujuh hari", 0.0)}
SEAT = lambda who, x, **kw: dict({"who": who, "x": x, "size": 540, "face": -1}, **kw)
A.append({"n": 2, "name": "Tujuh hari", "loc": "rapat", "music": "tense", "trans": "flash", "pre": 0.6,
  "locOpt": RAPAT2,
  "sfx": [C("Lalu semua kepala", -0.3, type="tick", vol=1.0, dur=6), C("Rina.", 0.0, type="dun", vol=0.8)],
  "lines": [{"who": "hendra", "from": "Intinya: tujuh hari", "to": "Intinya: tujuh hari", "text": "Intinya: tujuh hari.", "label": "Pak Hendra", "min": 2.2, "size": 46},
            {"who": "hendra", "from": "Kalau Pak Wijaya pergi", "to": "ikut pergi", "text": "", "bubble": "none"}],
  "shots": [
    {"at": 0, "actors": [SEAT("bayu", 600, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}]), SEAT("sinta", 860, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}]),
                         SEAT("ratna", 1120, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}]), SEAT("rina", 1380, keys=[{"at": 0, "pose": "sit", "expr": "scared"}])],
     "props": [{"type": "easel7", "x": 1960, "y": 1000, "paperAt": C("menempel selembar", 0.4)}],
     "cam": [{"x": 1000, "y": 480, "zoom": 1.06}, {"at": 0, "x": 900, "y": 460, "zoom": 1.14, "dur": 4}],
     "fx": [cap(1480, 170, "SENIN · 09.00 · RUANG MELATI", col="#F6C343", at=0.4)]},
    insert("Di layar terpampang", -0.2, {"type": "projSlide", "hl7": C("Dalam tujuh hari", 0.0)}, trans="zoom"),
    {"cue": "Pak Hendra, kepala divisi", "d": -0.2, "trans": "whip",
     "actors": [SEAT("ratna", 1120, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}]), SEAT("rina", 1380, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [1, -0.2]}]),
                {"who": "hendra", "x": 1650, "face": 1, "size": 600, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("menempel selembar", 0.2, pose="pointUp", item=None),
                 C("Intinya: tujuh hari", -0.2, face=-1, pose="point", expr="angry"), C("dua belas toko", pose="shrug", expr="neutral")]}],
     "props": [{"type": "easel7", "x": 1960, "y": 1000, "paperAt": C("menempel selembar", 0.4)}],
     "cam": [{"x": 1700, "y": 470, "zoom": 1.1}, {"at": 0, "x": 1760, "y": 460, "zoom": 1.16, "dur": 4}, C("Intinya: tujuh hari", -0.2, x=1700, y=470, zoom=1.24, dur=0.6, ease="back")],
     "fx": [{"type": "nameTag", "cue": "Pak Hendra, kepala divisi", "d": 0.3, "name": "Pak Hendra", "role": "Kepala divisi", "x": 110, "y": 800, "out": C("Intinya: tujuh hari", -0.3)},
            card("dua belas toko", "Pak Wijaya pergi = 12 toko pergi.", d=0.0, x=560, y=200, size=44, maxW=760)]},
    {"cue": "Lalu semua kepala", "d": -0.2, "trans": "cut",
     "actors": [SEAT("bayu", 600, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, {"at": 0.4, "face": 1, "look": [1, 0], "expr": "scared"}]),
                SEAT("sinta", 860, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, {"at": 0.7, "face": 1, "look": [1, 0]}]),
                SEAT("ratna", 1120, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, {"at": 1.0, "face": 1, "look": [1, 0], "expr": "sad"}]),
                SEAT("rina", 1380, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [-1, 0]}, C("Rina.", expr="shock", emote="!", look="cam"), C("Orang yang memegang", expr="scared", emote="sweat")]),
                {"who": "hendra", "x": 1750, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "cross", "expr": "neutral", "look": [-1, 0]}]}],
     "props": [{"type": "easel7", "x": 1960, "y": 1000}],
     "cam": [{"x": 1150, "y": 470, "zoom": 1.06}, {"at": 0, "x": 1150, "y": 470, "zoom": 1.1, "dur": 2}, C("Rina.", -0.1, on="rina", fit=0.24, sx=960, dur=0.6, ease="back")],
     "fx": [cap(560, 170, "AKUN PAK WIJAYA: RINA", bg="#D9483B", cue="Orang yang memegang", d=0.1)]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "KLIEN TERBESAR · EPS 3/4",
     "hook": "Klien Terbesar Memberi Waktu 7 Hari Sebelum Pergi", "day": "15", "month": "JUNI", "marker": "JUNI · HARI 1 DARI 7", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Godaan email panjang
A.append({"n": 4, "name": "Godaan email panjang", "loc": "kerja", "music": "tense", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "09:40"},
  "lines": [{"who": "ratna", "from": "Ini klienmu", "to": "Saya di belakangmu", "text": "Ini klienmu, Rin. Saya di belakangmu.", "label": "Bu Ratna", "maxW": 600, "size": 42},
            {"who": "ratna", "from": "Tapi Pak Wijaya tidak", "to": "Ia minta bukti", "text": "Ia minta bukti, bukan alasan.", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.3]}, C("Kembali di mejanya", 1.5, expr="angry")])],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.06}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 4}]},
    insert("Ia ingin menjelaskan", -0.2, {"type": "excuseDraft", "itemAt": [C("Kurir yang terlambat", -0.1), C("Hujan deras", -0.1), C("Pesanan yang datang", -0.1)], "growAt": C("Emailnya makin panjang", -0.2), "per": 0.45,
            "chip": "MAKIN PANJANG…", "chipAt": C("Emailnya makin panjang", 0.4)}, trans="zoom"),
    {"cue": "Bu Ratna lewat", "d": -0.2, "trans": "cut",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "angry", "look": [1, 0.3]}]),
                {"who": "ratna", "x": -300, "face": 1, "keys": [{"at": 0.1, "x": 520, "dur": 1.6, "expr": "neutral"}, {"at": 1.8, "pose": "think", "expr": "neutral", "look": [1, 0.4]}]}],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 850, "y": 520, "zoom": 1.16, "dur": 3}]},
    insert("Tangannya sempat terulur", -0.2, {"type": "excuseDraft", "full": True, "handAt": C("Tangannya sempat terulur", 0.3), "backAt": C("Lalu ia menariknya", 0.0)}, trans="cut"),
    {"cue": "Ini klienmu", "d": -0.3, "trans": "cut",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [-1, -0.3]}, C("Ia minta bukti", expr="neutral", look=[1, 0.3])]),
                {"who": "ratna", "x": 520, "face": 1, "keys": [{"at": 0, "pose": "hold", "expr": "happy", "look": [1, 0.3]}, C("Ia menunjuk draf", pose="point", expr="neutral")]}],
     "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
     "cam": [{"x": 760, "y": 500, "zoom": 1.16}, {"at": 0, "x": 760, "y": 500, "zoom": 1.24, "dur": 6}],
     "fx": [cap(1480, 330, "BUKTI, BUKAN ALASAN", bg="#3BA36B", cue="Ia minta bukti", d=0.2)]},
  ]})

# 5 ------------------------------------------------------------------ Hari 1: telepon tanpa alasan
A.append({"n": 5, "name": "Hari 1: tanpa alasan", "loc": "kerja", "music": "warm", "trans": "whip", "ownBubbles": True,
  "locOpt": {"time": "pagi", "clock": "10:05"},
  "fx": [day(1)],
  "lines": [{"who": "rina", "from": "Pak, Bapak benar", "to": "akun Bapak", "text": "", "bubble": "none"},
            {"who": "rina", "from": "Setiap hari ada", "to": "baik maupun buruk", "text": "", "bubble": "none"},
            {"who": "wijaya", "from": "Kata-kata itu murah", "to": "Saya lihat tujuh hari", "text": "Kata-kata itu murah, Mbak.", "label": "Pak Wijaya", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "excuseDraft", "at": 0, "full": True, "delAt": 1.0}]},
    {"cue": "Ia tidak menyebut kurir", "d": -0.2, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "pagi", "clock": "10:06"}, "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.1]}, C("Pak, Bapak benar", expr="sad"), C("Lalu ia menyampaikan", expr="proud"), C("Kata-kata itu murah", expr="scared")])],
        "cam": [{"x": 900, "y": 540, "zoom": 1.18}, C("Pak, Bapak benar", x=880, y=540, zoom=1.28, dur=8)]},
       {"loc": "tokobaru", "locOpt": dict(TOKO, fill=0.85), "actors": [{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "angry"},
         C("Pak Wijaya mendengarkan", expr="neutral"), C("Tapi Rina melihatnya", pose="hold", item="bon", expr="neutral", look="down")]}],
        "cam": [{"x": 960, "y": 500, "zoom": 1.1}, C("Pak Wijaya mendengarkan", x=930, y=500, zoom=1.2, dur=5)]}],
     "fx": [cap(500, 150, "AKUI", bg="#C2691F", size=34, cue="Pak, Bapak benar", d=0.0, out=C("Pak Wijaya mendengarkan", 0)), cap(960, 150, "RENCANA HARIAN", bg="#C2691F", size=34, cue="Setiap hari ada", d=0.0, out=C("Pak Wijaya mendengarkan", 0)),
            cap(1440, 150, "KABAR JAM 17.00", bg="#C2691F", size=34, cue="Dan setiap jam lima", d=0.0, out=C("Pak Wijaya mendengarkan", 0))]},
    insert("Tapi Rina melihatnya", 0.3, {"type": "wijayaBook", "n": 1, "writeAt": 0.3, "chip": "BUKU KECIL PAK WIJAYA", "chipAt": 0.5}, trans="zoom"),
  ]})

# 6 ------------------------------------------------------------------ Papan pemulihan
RB = {"type": "recBoard", "x": 1150, "y": 1000, "w": 900, "h": 520}
A.append({"n": 6, "name": "Papan pemulihan", "loc": "kerja", "music": "hope", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "13:00"},
  "fx": [day(1)],
  "lines": [{"who": "dodi", "from": "Beres, Bos", "to": "Beres, Bos", "text": "Beres, Bos!", "label": "Dodi", "kind": "shout", "min": 1.8},
            {"who": "bayu", "from": "Bayu dari operasional", "to": "kurir utama penuh", "text": "Kurir cadangan, siap!", "label": "Bayu", "maxW": 520, "size": 44}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 450, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "proud"}, {"at": 2.0, "pose": "talk"}]},
                         {"who": "dodi", "x": 2300, "face": -1, "size": 580, "keys": [{"at": 0.5, "x": 1780, "dur": 1.8, "expr": "neutral"}, {"at": 2.4, "pose": "cross"}]},
                         {"who": "bayu", "x": 2500, "face": -1, "keys": [{"at": 1.0, "x": 2050, "dur": 1.8, "expr": "happy"}, {"at": 2.9, "pose": "hips"}]}],
     "props": [dict(RB, cards=[None, None, None], ticks=0, boxesAt=None)],
     "cam": [{"x": 1150, "y": 470, "zoom": 1.0}, {"at": 0, "x": 1200, "y": 470, "zoom": 1.05, "dur": 5}],
     "fx": [cap(560, 170, "PAPAN PEMULIHAN · 13.00", col="#F6C343", at=0.4)]},
    insert("Dodi dari gudang", -0.2, {"type": "recBoardFx", "cards": [C("menambahkan cek ganda", 0.0), None, None], "boxes": False}, trans="zoom"),
    {"cue": "Beres, Bos", "d": -0.4, "trans": "cut",
     "actors": [{"who": "dodi", "x": 1700, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "pointUp", "item": "thumb", "expr": "laugh"}]},
                {"who": "bayu", "x": 2020, "face": -1, "keys": [{"at": 0, "pose": "hips", "expr": "happy"}, C("Bayu dari operasional", pose="pointUp", expr="laugh", jump=16)]}],
     "props": [dict(RB, cards=[0, C("Bayu dari operasional", 0.6), None])],
     "cam": [{"on": "dodi", "fit": 0.2, "sx": 900}, {"at": 0, "on": "dodi", "fit": 0.2, "sx": 760, "dur": 1.0}, C("Bayu dari operasional", x=1750, y=470, zoom=1.12, dur=1.0)]},
    insert("Dan Rina memegang", -0.2, {"type": "recBoardFx", "cards": [-9, -9, C("kabar jam lima sore", 0.0)], "boxesAt": C("Tujuh kotak digambar", 0.0), "tickAt": [C("Satu sudah dicentang", 0.2)],
            "chip": "LANGKAH KECIL · TIAP HARI · TERLIHAT SEMUA ORANG", "chipAt": C("Tapi justru itu", 0.6), "chipSize": 32}, trans="zoom"),
  ]})

# 7 ------------------------------------------------------------------ Sinta dan Rina, berdampingan
A.append({"n": 7, "name": "Berdampingan", "loc": "kerja", "music": "light", "trans": "whip",
  "locOpt": {"time": "siang", "clock": "14:10"},
  "fx": [day(1)],
  "sfx": [C("Kini mereka duduk", 1.6, type="knock", vol=0.9), C("Kini mereka duduk", 1.95, type="knock", vol=0.9)],
  "lines": [{"who": "ratna", "from": "Selama tujuh hari", "to": "toko-toko Pak Wijaya", "text": "", "bubble": "none"}],
  "shots": [
    {"at": 0, "actors": [SINTA(x=300, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Meja mereka didorong", x=700, dur=1.4)]), RINA(keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [-1, 0]}]),
                         {"who": "ratna", "x": 1000, "face": -1, "keys": [{"at": 0, "pose": "talk", "expr": "neutral"}, C("Sinta ditugaskan", pose="point", face=-1), C("Meja mereka didorong", -0.6, x=-60, dur=0.6, face=1, pose="hold"),
                          C("Meja mereka didorong", x=340, dur=1.4), C("Sejak Sinta diangkat", -0.5, x=-400, dur=1.6, face=-1, pose="idle")]}],
     "props": two(sinta={"x": 300, "keys": [C("Meja mereka didorong", x=700, dur=1.4)]}),
     "cam": [{"x": 900, "y": 470, "zoom": 1.02}, {"at": 0, "x": 1000, "y": 470, "zoom": 1.08, "dur": 5}],
     "sfx": [C("Meja mereka didorong", 0.0, type="whoosh", vol=0.5)],
     "fx": [card("Sinta ditugaskan", "7 hari: Sinta membantu Rina.", d=0.4, x=1400, y=200, size=44, out=C("Meja mereka didorong", 0)),
            card("Sejak Sinta diangkat", "Sejak Sinta jadi koordinator: hanya salam.", d=0.3, x=1300, y=200, size=42, maxW=780, out=C("Kini mereka duduk", -0.2))]},
    {"cue": "Kini mereka duduk", "d": -0.2, "trans": "cut",
     "actors": [SINTA(keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [0.3, 0.6]}, {"at": 1.0, "pose": "think", "look": "down"}, {"at": 2.6, "pose": "sit", "look": [1, 0]}, {"at": 3.2, "look": [0.2, 0.6]}]),
                RINA(keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [0.2, 0.6]}, {"at": 1.6, "pose": "type"}, {"at": 2.4, "pose": "sit", "look": [-1, 0], "emote": "sweat"}])],
     "props": two(sinta={"keys": [C("Dan buku kuning Sinta", 0.6, book=330, dur=0.8)]}),
     "cam": [{"x": 1020, "y": 560, "zoom": 1.25}, {"at": 0, "x": 1020, "y": 560, "zoom": 1.32, "dur": 4}, C("Dan buku kuning Sinta", x=1000, y=700, zoom=1.5, dur=1.6)],
     "fx": [{"type": "taps", "x": 1250, "y": 740, "word": "tok", "times": [{"at": 1.6}, {"at": 1.95}]}, cap(560, 170, "HENING YANG CANGGUNG", bg="#5E5A62", at=0.4, out=C("Dan buku kuning Sinta", 0)),
            cap(960, 900, "BUKU KUNING SINTA", bg="#F6C343", col="#13223D", cue="Dan buku kuning Sinta", d=0.6)]},
  ]})

# 8 ------------------------------------------------------------------ Hari 2 dan 3
A.append({"n": 8, "name": "Hari 2 dan 3", "loc": "kerja", "music": "light", "trans": "whip",
  "locOpt": {"time": "sore", "clock": "17:00"},
  "fx": [day(2, keys=[{"at": 0, "day": 2}, C("Ok.", 1.2, day=3)])],
  "shots": [
    {"at": 0, "actors": [SINTA(keys=[{"at": 0, "pose": "type", "expr": "neutral"}]), RINA(keys=[{"at": 0, "pose": "type", "expr": "proud"}])],
     "props": two(),
     "cam": [{"x": 1020, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1060, "y": 520, "zoom": 1.18, "dur": 4}],
     "fx": [cap(560, 170, "17.00 · HARI 2", col="#F6C343", at=0.3)]},
    insert("tiga baris terkirim", -0.6, {"type": "chat16", "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
            "msgs": [{"t": 0.4, "me": True, "text": D2, "time": "Sel 17.00", "read": C("Ok.", -0.3)}, {"t": C("Ok.", -0.1), "text": "Ok.", "time": "17.10"},
                     {"t": C("Ok.", 1.4), "me": True, "text": D3, "time": "Rab 17.00", "read": C("Ok.", 2.4)}, {"t": C("Ok.", 2.6), "text": "Ok.", "time": "17.06"}],
            "chip": "SUDAH · SEDANG · RISIKO", "chipAt": C("Apa yang sudah beres", 0.0), "chipBg": "#C2691F", "chipSize": 34}, trans="zoom"),
    {"cue": "Di sebelah Rina, Sinta", "d": -0.2, "trans": "whip", "locOpt": {"time": "siang", "clock": "11:20"},
     "actors": [SINTA(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral"}, C("Mereka jarang bicara", pose="type"), C("Sinta menyodorkan informasi", pose="hold", item="paper", face=1, expr="neutral", look=[1, 0])]),
                RINA(keys=[{"at": 0, "pose": "type", "expr": "neutral"}, C("Sinta menyodorkan informasi", 0.6, pose="hold", item="paper", expr="happy", look=[-1, 0]), C("Canggung, tapi efektif", pose="type", item=None, expr="proud")])],
     "props": two(),
     "cam": [{"x": 1020, "y": 540, "zoom": 1.2}, {"at": 0, "x": 1000, "y": 540, "zoom": 1.28, "dur": 6}],
     "fx": [cap(560, 170, "ADMIN TOKO 3 · BERES 2 MENIT", bg="#2F6F73", size=32, cue="dalam hitungan menit", d=0.0, out=C("Sinta menyodorkan informasi", -0.2)),
            card("Canggung, tapi efektif", "Canggung, tapi efektif.", d=0.0, x=1020, y=200, size=50)]},
    {"cue": "Di gudang, cek ganda", "d": -0.2, "trans": "whip", "loc": "gudang", "locOpt": G,
     "actors": [{"who": "dodi", "x": 1100, "y": 960, "layer": "back", "face": -1, "size": 580, "item": "scanner", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}, C("dua label yang salah", pose="pointUp", item=None, expr="proud")]},
                {"who": "eko", "x": 1500, "face": -1, "size": 540, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0.3]}, C("dua label yang salah", expr="shock", emote="!")]}],
     "cam": [{"x": 1250, "y": 500, "zoom": 1.1}, {"at": 0, "x": 1250, "y": 500, "zoom": 1.18, "dur": 5}],
     "fx": [cap(560, 170, "CEK GANDA: PINDAI + COCOKKAN", bg="#3F6FB5", at=0.3), cap(560, 290, "2 LABEL SALAH TERTANGKAP", bg="#3BA36B", cue="dua label yang salah", d=0.2)]},
  ]})

# 9 ------------------------------------------------------------------ Hari 4, kabar buruk (titik tegang)
A.append({"n": 9, "name": "Hari 4: kabar buruk", "loc": "kerja", "music": "tense", "musicCut": 2.0, "trans": "whip", "post": 0.4, "hold": 1.6,
  "locOpt": {"time": "siang", "clock": "14:00"},
  "fx": [day(4)],
  "lines": [{"who": "bayu", "from": "Rin, truk kurir", "to": "tidak sampai hari ini", "text": "Rin, kiriman toko 5 gagal hari ini.", "label": "Bayu", "maxW": 520, "size": 42},
            {"who": "rina", "from": "jangan bilang dulu", "to": "setelah semuanya aman", "text": "Jangan bilang dulu…", "kind": "think", "maxW": 480, "size": 42}],
  "shots": [
    {"at": 0, "actors": [SINTA(keys=[{"at": 0, "pose": "type", "expr": "neutral"}, C("Bayu datang setengah", 0.8, look=[1, 0], expr="scared")]), RINA(keys=[{"at": 0, "pose": "type", "expr": "neutral"}, C("Rin, truk kurir", expr="shock", emote="!", look=[1, 0])]),
                         {"who": "bayu", "x": 2400, "face": -1, "item": "phone", "keys": [{"at": 0.4, "x": 1760, "dur": 1.4, "run": True, "expr": "scared"}, C("Rin, truk kurir", pose="phone", expr="scared", emote="sweat")]}],
     "props": two(),
     "cam": [{"x": 1250, "y": 520, "zoom": 1.08}, {"at": 0, "x": 1350, "y": 520, "zoom": 1.14, "dur": 4}],
     "fx": [cap(560, 170, "KAMIS · 14.00", col="#F6C343", at=0.3)]},
    {"cue": "Pemindai untuk toko lima", "d": -0.2, "trans": "whip", "loc": "jalanHujan", "locOpt": {},
     "props": [{"type": "truck", "x": 1000, "y": 1000, "flat": True}],
     "actors": [{"who": "sopir", "x": 1620, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "sad", "emote": "sweat"}]}],
     "cam": [{"x": 1050, "y": 520, "zoom": 1.0}, {"at": 0, "x": 1100, "y": 520, "zoom": 1.08, "dur": 3}],
     "fx": [cap(560, 170, "BAN PECAH · PEMINDAI TOKO 5", bg="#D9483B", at=0.2)]},
    insert("Rina menatap papan", -0.2, {"type": "recBoardFx", "cards": [-9, -9, -9], "ticks": 3, "hlDay": 4}, trans="whip"),
    insert("Tinggal tiga hari", -0.3, {"type": "countdown", "top": "SEBELUM PAK WIJAYA PINDAH", "from": 7, "to": 3, "unit": "HARI LAGI"}, trans="flash"),
    {"cue": "Dan sebuah suara lama", "d": -0.2, "trans": "cut",
     "actors": [RINA(keys=[{"at": 0, "pose": "think", "expr": "scared", "look": [0.3, -0.5]}, C("Bereskan diam-diam", expr="sad", look="down")])],
     "props": two(),
     "cam": [{"on": "rina", "fit": 0.22, "sx": 960}, {"at": 0, "on": "rina", "fit": 0.27, "sx": 960, "dur": 6}],
     "grade": {"tint": "rgba(20,20,60,.2)"}},
    insert("Jarinya sudah mengetik", -0.2, {"type": "chat16", "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
            "msgs": [{"t": -5, "me": True, "text": D3, "time": "Rab 17.00", "read": -4}, {"t": -4, "text": "Ok.", "time": "17.06"}],
            "input": [{"t": 0.5, "text": "Aman, Pak", "cps": 5}]}, trans="zoom"),
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 10 ----------------------------------------------------------------- Menelepon lebih dulu (kejutan tengah)
A.append({"n": 10, "name": "Kabar buruk lebih dulu", "loc": "kerja", "music": "hope", "trans": "fade", "pre": 0.8, "ownBubbles": True,
  "locOpt": {"time": "siang", "clock": "14:05"},
  "fx": [day(4)],
  "lines": [{"who": "rina", "from": "Pak, saya mau menyampaikan", "to": "Truk kurirnya rusak", "text": "Saya kabari sebelum toko Bapak menelepon.", "maxW": 480, "size": 38},
            {"who": "wijaya", "from": "Lagi?", "to": "Lagi?", "text": "Lagi?!", "label": "Pak Wijaya", "kind": "shout", "min": 1.8},
            {"who": "rina", "from": "Mas Dodi akan", "to": "jam delapan", "text": "", "bubble": "none"},
            {"who": "wijaya", "from": "Selama ini, saya", "to": "lebih dulu", "text": "", "bubble": "none"}],
  "shots": [
    {"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "chat16", "at": 0, "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
       "msgs": [{"t": -5, "me": True, "text": D3, "time": "Rab 17.00", "read": -4}, {"t": -4, "text": "Ok.", "time": "17.06"}],
       "input": [{"t": -3, "text": "Aman, Pak", "cps": 50, "del": 0.2, "delCps": 12}], "chip": "HAPUS. TELEPON SEKARANG.", "chipAt": 0.9, "chipBg": "#3BA36B"}]},
    {"cue": "Lalu ia menelepon", "d": 0.4, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "siang", "clock": "14:06"}, "props": [CHAIR, desk(cups=2, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.1]}, C("Lagi?", expr="scared"), C("Rina tidak membela", expr="neutral"), C("Selama ini, saya", expr="sad"), C("lebih dulu", expr="happy")]),
                   {"who": "dodi", "x": -300, "face": 1, "size": 560, "item": "phone", "keys": [{"at": 0, "x": -300}, C("Mas Dodi akan", -0.6, x=420, dur=1.2, pose="phone"), C("jam delapan", item="keys", pose="pointUp", expr="proud")]}],
        "cam": [{"x": 880, "y": 540, "zoom": 1.12}, C("Mas Dodi akan", x=820, y=540, zoom=1.1, dur=1.5)]},
       {"loc": "tokobaru", "locOpt": dict(TOKO, fill=0.85), "actors": [{"who": "wijaya", "x": 880, "y": 950, "layer": "back", "face": -1, "size": 600, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral"},
         C("Lagi?", pose="shrug", expr="angry", emote="anger"), C("Rina tidak membela", pose="phone", expr="angry"), C("Lama tidak ada suara", expr="neutral", look="down"), C("Selama ini, saya", expr="neutral")]}],
        "cam": [{"x": 960, "y": 500, "zoom": 1.1}, C("Lagi?", x=930, y=490, zoom=1.24, dur=0.4, ease="back"), C("Lama tidak ada suara", x=940, y=500, zoom=1.16, dur=3)]}],
     "fx": [cap(960, 150, "KABAR BURUK, LEBIH DULU", bg="#C2691F", size=34, cue="Pak, saya mau menyampaikan", d=0.2, out=C("Lagi?", -0.2)),
            cap(480, 150, "DIANTAR DODI · PALING LAMBAT 20.00", bg="#3BA36B", size=28, cue="Mas Dodi akan", d=0.3)]},
    insert("Ia menulis sesuatu", -0.2, {"type": "wijayaBook", "n": 4, "writeAt": 0.3, "hl": 3, "hlAt": 1.8}, trans="zoom"),
    {"cue": "Dan jam tujuh empat puluh", "d": -0.2, "trans": "whip", "loc": "jalan", "locOpt": {"time": "malam"}, "actors": [],
     "cam": [{"x": 960, "y": 560, "zoom": 1.0}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.08, "dur": 3}],
     "fx": [cap(1450, 170, "19.40 · PEMINDAI SAMPAI DI TOKO 5", bg="#3BA36B", col="#FFFFFF", size=34, at=0.4)]},
  ]})

# 11 ----------------------------------------------------------------- Buku kuning Sinta
A.append({"n": 11, "name": "Buku kuning Sinta", "loc": "kerja", "music": "night", "trans": "iris",
  "locOpt": {"time": "malam", "clock": "19:30", "empty": True},
  "fx": [day(5)],
  "lines": [{"who": "sinta", "from": "Boleh kupakai", "to": "Dengan namamu", "text": "Boleh kupakai untuk pelatihan tim?", "label": "Sinta", "maxW": 520, "size": 40},
            {"who": "rina", "from": "Kenapa kamu catat", "to": "Kenapa kamu catat", "text": "Kenapa kamu catat?", "min": 1.8, "size": 44},
            {"who": "sinta", "from": "Karena dulu aku", "to": "secepat kamu", "text": "Dulu aku juga pernah bilang begitu.", "maxW": 520, "size": 40}],
  "shots": [
    {"at": 0, "actors": [SINTA(item="notebook", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, C("menyodorkannya kepada Rina", pose="point", item=None, expr="happy")]),
                         RINA(keys=[{"at": 0, "pose": "type", "expr": "tired"}, C("Sinta membuka buku", pose="sit", look=[-1, 0], expr="confused")])],
     "props": two(sinta={"night": True, "book": False}, rina={"night": True, "book": -200}),
     "cam": [{"x": 1020, "y": 540, "zoom": 1.15}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.24, "dur": 6}],
     "grade": {"tint": "rgba(20,16,50,.25)"},
     "fx": [cap(560, 170, "HARI 5 · MALAM", col="#F6C343", at=0.3)]},
    insert("Di halaman itu tertulis", -0.2, {"type": "sintaBook", "titleAt": C("Di halaman itu tertulis", 0.6), "leftAt": C("Ternyata, hari itu di lobi", 0.6), "rightAt": C("Ia mencatat bagaimana", 0.0),
            "chip": "BUKAN MENCATAT KESALAHAN", "chipAt": C("Ia mencatat bagaimana", 1.6)}, trans="zoom"),
    {"cue": "Boleh kupakai", "d": -0.2, "trans": "cut",
     "actors": [SINTA(keys=[{"at": 0, "pose": "talk", "expr": "happy", "look": [1, 0]}, C("Rina terdiam", pose="sit"), C("Sinta tersenyum kecil", expr="happy", look="down", emote="sweat"), C("Karena dulu aku", pose="talk", expr="sad", look=[1, 0])]),
                RINA(keys=[{"at": 0, "pose": "sit", "expr": "shock", "look": [-1, 0]}, C("Kenapa kamu catat", pose="talk", expr="confused"), C("Karena dulu aku", pose="sit", expr="sad"), C("secepat kamu", expr="happy")])],
     "props": two(sinta={"night": True, "book": False}, rina={"night": True, "book": -200}),
     "cam": [{"x": 1020, "y": 540, "zoom": 1.22}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.3, "dur": 10}],
     "grade": {"tint": "rgba(20,16,50,.25)"}},
  ]})

# 12 ----------------------------------------------------------------- Hari 6, kabar yang mulai dibalas
A.append({"n": 12, "name": "Hari 6: lebih dari satu kata", "loc": "kerja", "music": "warm", "trans": "iris",
  "locOpt": {"time": "sore", "clock": "17:00"},
  "fx": [day(6)],
  "shots": [
    {"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "chat16", "at": 0, "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
       "msgs": [{"t": 0.6, "me": True, "text": D6, "time": "Sab 17.00", "read": C("Dan untuk pertama", 0.0)}, {"t": C("Toko lima sudah pakai", -0.3), "text": "Toko 5 sudah pakai pemindainya. Terima kasih kabarnya.", "time": "17.08"}],
       "chip": "LEBIH DARI SATU KATA", "chipAt": C("Terima kasih kabarnya", 0.0), "chipBg": "#3BA36B"}]},
    {"cue": "Rina menunjukkannya", "d": -0.2, "trans": "whip",
     "actors": [SINTA(keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}, {"at": 0.8, "expr": "happy"}, C("Sinta menyodorkan sepotong", pose="hold", item="gorengan", expr="happy")]),
                RINA(item="phone", keys=[{"at": 0, "pose": "hold", "expr": "laugh", "look": [-1, 0]}, C("Mereka tidak bersorak", item=None, pose="sit", expr="happy"), C("Sinta menyodorkan sepotong", 0.8, pose="hold", item="gorengan", expr="laugh")])],
     "props": two(sinta={"book": 240, "gorengan": 230}, rina={"book": -150}),
     "cam": [{"x": 1020, "y": 560, "zoom": 1.2}, {"at": 0, "x": 1020, "y": 560, "zoom": 1.26, "dur": 6}, C("Dan dua buku kuning", x=1000, y=700, zoom=1.45, dur=1.6)],
     "fx": [card("Mereka tidak bersorak", "Tidak bersorak. Tapi…", d=0.0, x=1400, y=200, size=44, out=C("Sinta menyodorkan sepotong", 0)),
            cap(960, 900, "DUA BUKU KUNING, BERDAMPINGAN", bg="#F6C343", col="#13223D", size=32, cue="Dan dua buku kuning", d=0.4)]},
    insert("Masih ada satu hari", -0.2, {"type": "recBoardFx", "cards": [-9, -9, -9], "ticks": 5, "tickAt": [None, None, None, None, None, 0.3], "hlDay": 7}, trans="whip"),
  ]})

# 13 ----------------------------------------------------------------- Hari 7, keputusan Pak Wijaya
SEAT13 = lambda who, x, **kw: dict({"who": who, "x": x, "size": 540, "face": 1}, **kw)
A.append({"n": 13, "name": "Hari 7: tiga puluh hari", "loc": "rapat", "music": "warm", "trans": "iris",
  "locOpt": {"slide": "logo", "clock": "10:00", "backChairs": []},
  "fx": [day(7)],
  "lines": [{"who": "wijaya", "from": "Hari keempat, kiriman", "to": "duduk di sini", "text": "", "bubble": "none"},
            {"who": "wijaya", "from": "Saya bertahan tiga puluh", "to": "Dengan satu syarat", "text": "Tiga puluh hari. Dengan satu syarat.", "label": "Pak Wijaya", "maxW": 560, "size": 42},
            {"who": "wijaya", "from": "gudang kalian dibereskan", "to": "saya pergi", "text": "", "bubble": "none"},
            {"who": "hendra", "from": "Intinya jelas", "to": "Kami sanggupi", "text": "Intinya jelas, Pak. Kami sanggupi.", "label": "Pak Hendra", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [SEAT13("hendra", 640, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}]), SEAT13("ratna", 900, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}]),
                         SEAT13("rina", 1160, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [1, 0]}]),
                         {"who": "wijaya", "x": 2300, "face": -1, "size": 580, "item": "bon", "keys": [{"at": 0.3, "x": 1560, "dur": 2.4, "expr": "neutral"}, {"at": 2.8, "pose": "sit"}, C("Ia membuka buku", pose="hold", expr="neutral", look="down")]}],
     "cam": [{"x": 1250, "y": 470, "zoom": 1.04}, {"at": 0, "x": 1200, "y": 470, "zoom": 1.1, "dur": 5}],
     "fx": [cap(560, 170, "RUANG MELATI · TANPA GEBRAKAN", col="#F6C343", at=0.4)]},
    insert("Tujuh baris", -0.2, {"type": "wijayaBook", "n": 7, "hl": 3, "hlAt": C("Hari keempat, kiriman", 0.3)}, trans="zoom"),
    {"cue": "Tapi saya mendengarnya", "d": -0.2, "trans": "cut",
     "actors": [SEAT13("rina", 1160, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [1, 0]}, C("Itu yang membuat", expr="happy"), C("Dengan satu syarat", expr="neutral"), C("Pak Hendra mengangguk", expr="proud")]),
                {"who": "wijaya", "x": 1560, "face": -1, "size": 580, "item": "bon", "keys": [{"at": 0, "pose": "talk", "expr": "neutral"}, C("Ia menutup bukunya", pose="hold", expr="neutral"), C("Saya bertahan tiga puluh", pose="pointUp", item=None, expr="neutral"),
                 C("Kalau dalam tiga puluh", pose="hips", expr="angry"), C("Pak Hendra mengangguk", pose="sit", expr="happy")]}],
     "cam": [{"x": 1360, "y": 470, "zoom": 1.16}, {"at": 0, "x": 1400, "y": 470, "zoom": 1.22, "dur": 8}, C("Saya bertahan tiga puluh", on="wijaya", fit=0.22, sx=1150, dur=0.8)],
     "fx": [card("Saya bertahan tiga puluh", "30 HARI", d=0.4, x=560, y=200, size=72, bg="#C2691F"), card("Dengan satu syarat", "Syarat: gudang dibereskan.", d=0.3, x=560, y=360, size=42)]},
    {"cue": "Pak Hendra mengangguk", "d": -0.2, "trans": "cut",
     "actors": [SEAT13("hendra", 640, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}, {"at": 0.4, "jump": 10, "expr": "happy"}, C("Intinya jelas", pose="talk", expr="proud")]),
                SEAT13("ratna", 900, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0]}]), SEAT13("rina", 1160, keys=[{"at": 0, "pose": "sit", "expr": "proud", "look": [-1, 0]}, C("Kami sanggupi", expr="laugh", emote="sparkle")])],
     "cam": [{"x": 900, "y": 470, "zoom": 1.12}, {"at": 0, "x": 860, "y": 470, "zoom": 1.2, "dur": 5}]},
  ]})

# 14 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 14, "name": "Kartu pelajaran", "loc": "kerja", "music": "warm", "trans": "iris", "post": 1.4,
  "locOpt": {"time": "siang", "clock": "12:00"},
  "props": [dict(RB, x=1300, cards=[-9, -9, -9], ticks=7)],
  "shots": [
    {"at": 0, "blur": 9, "actors": [{"who": "rina", "x": 300, "size": 600, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: pegang", pose="pointUp"),
                 C("Dua: buat", pose="hips", expr="proud"), C("Tiga: kirim", pose="pointUp", expr="laugh", item="thumb", jump=30)]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 22}],
     "fx": [{"type": "lesson", "cue": "Satu: pegang", "d": -0.6, "items": [{"cue": "Satu: pegang", "text": "Pegang tanggung jawab, tanpa mencari alasan"},
            {"cue": "Dua: buat", "text": "Buat rencana pemulihan harian"}, {"cue": "Tiga: kirim", "text": "Kabar rutin, termasuk kabar buruk, lebih dulu"}]}]},
  ]})

# 15 ----------------------------------------------------------------- Cuplikan Eps 4 + layar akhir
A.append({"n": 15, "name": "Cuplikan Klien Terbesar Eps 4 + layar akhir", "loc": "lorong", "music": "tense", "trans": "flash", "post": 6.5,
  "lines": [{"who": "hendra", "from": "Kalau tiga puluh hari", "to": "ke pihak luar", "text": "Gudang kita serahkan ke pihak luar.", "label": "Pak Hendra", "maxW": 520, "size": 40}],
  "shots": [
    {"at": 0, "actors": [], "props": [{"type": "doorAjar", "x": 900, "y": 1000, "label": "KEPALA DIVISI"}],
     "cam": [{"x": 960, "y": 540, "zoom": 1.0}, {"at": 0, "x": 900, "y": 520, "zoom": 1.15, "dur": 4}],
     "fx": [cap(1450, 170, "SORE · RUANG PAK HENDRA", col="#F6C343", at=0.3)]},
    {"cue": "Kalau tiga puluh hari", "d": -0.2, "trans": "cut", "loc": "bos", "locOpt": {"time": "sore", "deskX": 1450},
     "actors": [{"who": "ratna", "x": 650, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "sad", "look": [1, 0]}, C("ke pihak luar", expr="shock", emote="!")]},
                {"who": "hendra", "x": 1100, "face": -1, "size": 600, "item": "brochure", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("gudang kita serahkan", pose="talk", expr="neutral")]}],
     "cam": [{"x": 900, "y": 500, "zoom": 1.12}, {"at": 0, "x": 900, "y": 500, "zoom": 1.2, "dur": 4}],
     "fx": [cap(1450, 300, "JASA GUDANG PIHAK KETIGA", bg="#2F6F73", cue="gudang kita serahkan", d=0.0, size=34)]},
    insert("ke pihak luar", 0.3, {"type": "brochure"}, trans="cut"),
    {"cue": "Di lorong, Dodi", "d": -0.2, "trans": "cut", "props": [{"type": "doorAjar", "x": 700, "y": 1000, "label": "KEPALA DIVISI"}],
     "actors": [{"who": "dodi", "x": 1150, "face": -1, "size": 600, "item": "box", "pencilOff": C("Pensil di telinganya", 0.5),
                 "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Ia mendengar semuanya", expr="shock", emote="!"), C("Pensil di telinganya", 1.2, expr="sad", look="down")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.1}, {"at": 0, "on": "dodi", "fit": 0.2, "sx": 1050, "dur": 3}, C("Pensil di telinganya", 0.3, x=1100, y=620, zoom=1.25, dur=1.2)],
     "fx": [{"type": "pencilFall", "who": "dodi", "cue": "Pensil di telinganya", "d": 0.5}]},
    {"cue": "Saksikan akhir ceritanya", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Gudang ke pihak luar?\"", "nextSub": "nasib Dodi", "nextTitle": "Klien Terbesar · Eps 4",
             "nextWho": "dodi", "nextKey": {"pose": "hold", "expr": "sad"}, "nextThumb": False, "playlist": "Klien Terbesar", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Langsung mengabari kabar buruk, atau menunggu beres dulu? Tulis di komentar!"}]},
  ]})


def shot_local(A):
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
            for k in sh.get("cam", []): fix(k, sh, moving)
            for f in sh.get("fx", []): fix(f, sh, lambda k: k["at"] > 0)
            for k in sh.get("sfx", []): fix(k, sh, lambda k: k["at"] > 0)


def check_cues(A):
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


shot_local(A)
for a in A:   # story16 hanya membaca sfx di tingkat adegan → pindahkan sfx shot
    for sh in a.get("shots", []):
        if sh.get("sfx"): a.setdefault("sfx", []).extend(sh.pop("sfx"))
ep = {"slug": "kantor-07", "title": "Klien Terbesar Memberi Waktu 7 Hari Sebelum Pergi | Kantor Tangani: Klien Terbesar Eps 3",
      "series": "Kantor Tangani", "story": "Klien Terbesar", "eps": "3/4", "month": "JUNI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Tujuh hari"], [4, "Tanpa alasan"], [7, "Canggung tapi efektif"], [9, "Kabar buruk"], [11, "Buku kuning Sinta"], [13, "Keputusan Pak Wijaya"], [14, "Pelajaran"], [15, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah & hasil", 5, 7], ["Episode berikutnya", 7, 9]],
      "lessons": ["Pegang tanggung jawab, tanpa sibuk mencari alasan.", "Buat rencana pemulihan yang harian, bukan janji besar.", "Kirim kabar rutin, termasuk kabar buruk, dan sampaikan lebih dulu."],
      "youtube": {
        "desc": "\"Dalam tujuh hari, kami pindah ke penyedia lain.\" Email klien terbesar itu terpampang di layar rapat, dan semua kepala menoleh ke Rina. Bagaimana memulihkan kepercayaan klien saat waktunya tinggal tujuh hari? Episode ketiga Kantor Tangani: Klien Terbesar.",
        "ask": "Kamu tipe yang langsung mengabari kabar buruk, atau menunggu semuanya beres dulu? Tulis di kolom komentar.",
        "next": "Klien Terbesar Eps 4, akhir cerita, tayang berikutnya.",
        "tags": "kantor tangani, klien terbesar, cerita kantor, animasi kantor, memulihkan kepercayaan klien, kabar buruk, laporan harian, tanggung jawab, layanan pelanggan, komunikasi kerja, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #KlienTerbesar #duniakerja",
        "adAfter": 9},
      "thumb": {"kind": "hari7", "lines": ["WAKTU", "7 HARI"], "hl": "SEBELUM PERGI", "hlSize": 74, "badge": "EPS 3/4", "tag": "KANTOR TANGANI · KLIEN TERBESAR"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
