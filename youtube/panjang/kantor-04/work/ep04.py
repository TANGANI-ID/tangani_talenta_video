#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-04 (Tak Terlihat Eps 4: "Pilih dua", penutup cerita 1).
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}."""
import json, re, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-04/episode.json"

def C(cue, d=None, **kw):
    o = {"cue": cue}
    if d is not None: o["d"] = d
    o.update(kw); return o

CHAIR = {"type": "chair16", "x": 830, "y": 1000}
KCHAIR = {"type": "chair16", "x": 700, "y": 1000, "col": "#C2691F"}
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
RATNA_DESK = {"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580}
def ratna_desk(**kw):
    o = dict(RATNA_DESK); o.update(kw); return o
DALAM = {"view": "dalam", "time": "pagi", "deskX": 1240}

extras = {
    "dewi": {"nama": "Dewi (rekan tim)", "look": {"hair": "hijab", "hijab": "#3E7D4F", "shirt": "#F3D9B5", "pants": "#3B2418", "skin": "e", "idcard": "#C2691F"}},
    "fajar": {"nama": "Fajar (rekan tim)", "look": {"hair": "short", "hairColor": "#2B1A12", "shirt": "#9FC6D0", "pants": "#2C2433", "skin": "a", "idcard": "#2F6F73"}},
    "ayu": {"nama": "Mbak Ayu (HR)", "look": {"hair": "hijab", "hijab": "#9B7BC4", "shirt": "#FFFDF8", "jacket": "#2F6F73", "pants": "#2C2433", "skin": "b", "idcard": "#C2691F"}},
    "dimas": {"nama": "Dimas (adik Rina)", "look": {"hair": "short", "hairColor": "#2B1A12", "shirt": "#FFFDF8", "jacket": "#1F4E8C", "pants": "#2C2433", "skin": "c"}},
    "andi": {"nama": "Mas Andi (tim TI)", "look": {"hair": "short", "hairColor": "#1E1410", "glasses": True, "shirt": "#3B4A6B", "pants": "#2C2433", "skin": "b", "idcard": "#5B7DB1"}},
    "wijaya": {"nama": "Pak Wijaya (klien, 12 toko)", "look": {"hat": "kopiah", "hatColor": "#1E1A18", "mustache": True, "hairColor": "#8A8A8A", "shirt": "#8E4A24", "pants": "#2C2433", "skin": "c"}},
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
}

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 1–3)
REC = {"type": "recap"}
A.append({"n": 1, "name": "Sebelumnya (kilas Eps 1–3)", "loc": "rapat", "music": "hope", "pre": 0.5, "post": 0.5, "trans": "cut",
  "locOpt": {"slide": "sinta", "clock": "08:06", "backChairs": []},
  "shots": [
    {"at": 0, "actors": [{"who": "sinta", "x": 1420, "face": -1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh"}]},
                         {"who": "bayu", "x": 1760, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}]},
                         {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "clap", "expr": "sad", "look": [1, -0.2]}]}],
     "cam": [{"x": 1150, "y": 500, "zoom": 1.05}, {"at": 0, "x": 1250, "y": 500, "zoom": 1.15, "dur": 4}],
     "sfx": [{"at": 0.2, "type": "applause", "vol": 0.4, "dur": 1.8}],
     "fx": [REC, {"type": "confetti", "at": 0.3, "x": 1420, "y": 330, "count": 60}]},
    insert("Rina berubah", -0.3, [{"type": "graph", "mode": "rise", "riseAt": 0.4, "title": "Rata-rata waktu balas klien", "sub": "Tim Layanan Pelanggan · Februari"}, REC], trans="whip"),
    insert("belajar melapor", -0.2, [{"type": "sticky", "writeAt": 0.1, "circleAt": 1.4}, REC], trans="whip"),
    {"cue": "belajar memahami", "d": -0.2, "trans": "whip", "loc": "kaca", "locOpt": {"view": "luar", "time": "pagi", "deskX": 1530, "bandY": 800},
     "actors": [ratna_desk(x=1580, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}]),
                {"who": "hendra", "x": 1180, "y": 950, "layer": "back", "face": 1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}]},
                {"who": "rina", "x": 740, "face": 1, "keys": [{"at": 0, "pose": "scared", "expr": "shock", "emote": "!"}]}],
     "props": [{"type": "bigPlant", "x": 960, "y": 1010, "layer": "front", "size": 0.55}],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.12}, {"at": 0, "x": 1250, "y": 520, "zoom": 1.22, "dur": 3}],
     "fx": [REC, cap(560, 200, "\"ITU TANGGUNG JAWAB SAYA, PAK.\"", bg="#6E2430", at=0.3)]},
    insert("Lalu amplop", -0.2, [{"type": "envelope", "openAt": 0.6, "stampAt": 2.4}, REC], trans="flash"),
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: bilik toilet
A.append({"n": 2, "name": "Bilik toilet: nilai cukup", "loc": "toilet", "music": "sad", "trans": "flash", "pre": 0.6,
  "lines": [{"who": "rina", "from": "Apa masih ada", "to": "gunanya bertahan", "text": "Apa masih ada gunanya bertahan?", "kind": "think", "maxW": 800, "size": 40}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 960, "face": 1, "item": "envelope", "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, C("Tiga tahun bekerja", expr="tired", look=[0.3, -0.6]), C("Dan nilainya", expr="sad", look="down", emote="sweat")]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 960, "dur": 3}, C("Tiga tahun bekerja", on="rina", fit=0.26, sx=960, dur=4)],
     "fx": [cap(560, 160, "BILIK TOILET · KE-3 KALINYA", bg="#5E5A62", at=0.3, out=C("Cukup", -0.3))]},
    insert("Cukup", -0.25, {"type": "review", "stampAt": 0.15, "pick": 2, "chip": "3 TAHUN · 2 BULAN BERUBAH", "chipAt": C("Tiga tahun bekerja", 0.2)}, trans="cut"),
    {"cue": "Dan nilainya", "d": -0.15, "trans": "cut",
     "actors": [{"who": "rina", "x": 960, "face": 1, "item": "envelope", "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": "down", "emote": "sweat"}, C("Di ponselnya", item="phone", pose="phone", expr="neutral", look=[0.5, 0.5])]}],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 960}, {"at": 0, "on": "rina", "fit": 0.31, "sx": 960, "dur": 4}]},
    insert("sebuah lowongan", -0.3, {"type": "jobApp", "payAt": C("Gajinya lebih tinggi", -0.1), "hoverAt": C("Ibu jarinya melayang", -0.2)}, trans="zoom"),
    {"cue": "Apa masih ada", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 960, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "sad", "look": [0.2, -1]}, {"at": 1.2, "pose": "think", "expr": "tired"}]}],
     "cam": [{"on": "rina", "fit": 0.19, "sx": 960}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 960, "dur": 4}]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "TAK TERLIHAT · EPS 4/4",
     "hook": "Nilai Kinerja Jelek, 3 Bulan Kemudian Jadi yang Terbaik", "day": "27", "month": "FEBRUARI", "marker": "AKHIR FEBRUARI → MEI", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Warung kopi, Bayu
A.append({"n": 4, "name": "Warung kopi: resign aja?", "loc": "warung", "music": "light", "trans": "iris",
  "locOpt": {"time": "siang"},
  "props": [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1000, "cups": [[-230, "teh"], [190, "kopi"]], "spoon": 0}],
  "lines": [{"who": "bayu", "from": "Atasanku pilih kasih", "to": "Percuma kerja bagus", "text": "Atasanku pilih kasih, Rin. Percuma kerja bagus.", "label": "Bayu", "maxW": 640},
            {"who": "rina", "from": "Kamu pernah tanya", "to": "nilaimu cukup", "text": "Kamu pernah tanya kenapa nilaimu cukup?", "maxW": 600},
            {"who": "bayu", "from": "Buat apa", "to": "pasti alasan", "text": "Buat apa? Jawabannya pasti alasan.", "maxW": 600},
            {"who": "bayu", "from": "Resign aja kita", "to": "Bareng", "text": "Resign aja kita, Rin. Bareng!", "kind": "shout", "min": 1.8}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": 1150, "face": -1, "item": "paper", "keys": [{"at": 0, "pose": "wave", "expr": "angry"}, C("Nilainya juga cukup", pose="hold", expr="sad"), C("Atasanku pilih kasih", pose="point", expr="angry", look=[1, 0], face=1),
                    C("Yang dipuji", pose="shrug", expr="angry", face=-1), C("Kamu pernah tanya", pose="sit", expr="neutral"), C("Bayu tertawa", pose="sit", expr="laugh"), C("Ia menyeruput", item="cup", pose="drink", expr="happy"), C("Resign aja kita", pose="cheer", item=None, expr="laugh", jump=20)]},
                         {"who": "rina", "x": 760, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": [1, -0.2]}, C("Rina bertanya pelan", expr="neutral", look=[1, -0.2]), C("Bayu tertawa", expr="confused"), C("Rina mengaduk", expr="sad", look="down")]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0.3, "x": 1060, "y": 520, "zoom": 1.15, "dur": 3}, C("Atasanku pilih kasih", on="bayu", fit=0.24, sx=1100, dur=1.2), C("Rina bertanya pelan", on="rina", fit=0.25, sx=820, dur=1.2),
             C("Bayu tertawa", x=960, y=520, zoom=1.1, dur=1.2), C("Resign aja kita", on="bayu", fit=0.27, sx=1100, dur=0.5, ease="back", shake=6), C("Rina mengaduk", on="rina", fit=0.26, sx=820, dur=1.2)],
     "fx": [cap(420, 150, "WARUNG SEBERANG KANTOR · 12.15", col="#F6C343", at=0.3, out=C("Atasanku pilih kasih", -0.2)),
            cap(1500, 170, "NILAI BAYU: CUKUP", bg="#D9483B", cue="Nilainya juga cukup", d=0.1, out=C("Atasanku pilih kasih", -0.2))]},
    insert("Malamnya, ia mengisi", -0.15, {"type": "jobApp", "night": True, "formAt": 0.0, "chip": "SETENGAH JADI", "chipAt": C("setengah jadi", -0.2)}, trans="fade"),
  ]})

# 5 ------------------------------------------------------------------ Video call Dimas
A.append({"n": 5, "name": "Video call Dimas", "loc": "kos", "music": "warm", "trans": "fade",
  "props": [KCHAIR],
  "lines": [{"who": "dimas", "from": "Kakak pasti juga", "to": "di kantor, kan", "text": "Kakak pasti juga jadi yang terbaik di kantor, kan?", "label": "Dimas", "bubble": "none"}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.3]}, {"at": 0.6, "expr": "shock", "emote": "!"}, C("Ia masuk daftar", expr="laugh", look=[1, 0.2]),
                    C("Kakak pasti juga", expr="smile"), C("tidak sanggup bercerita", expr="sad", look="down")]}],
     "cam": [{"x": 950, "y": 520, "zoom": 1.08}, {"at": 0, "x": 980, "y": 520, "zoom": 1.18, "dur": 5}, C("Kakak pasti juga", x=1060, y=520, zoom=1.3, dur=1.5), C("tidak sanggup bercerita", on="rina", fit=0.24, sx=760, dur=1.5)],
     "sfx": [{"at": 0.4, "type": "ring", "vol": 0.6, "dur": 1.0}],
     "fx": [{"type": "videoCall", "talkFrom": C("Lalu Dimas"), "talkTo": C("di kantor, kan", 0.3), "expr": "laugh"}, cap(1500, 160, "MAHASISWA BERPRESTASI", bg="#3BA36B", cue="Ia masuk daftar", d=0.2, out=C("Kakak pasti juga", -0.2)),
            card("Kakak pasti juga", "\"Kakak pasti juga jadi yang terbaik di kantor, kan?\"", d=0.1, x=560, y=200, size=44, maxW=760, out=C("tidak sanggup bercerita", 0.4))]},
    insert("Ia membuka foto lama", -0.2, {"type": "oldPhoto", "date": "3 tahun lalu", "chip": "HARI PERTAMA", "chipAt": C("hari pertamanya", 0)}, trans="zoom"),
    {"cue": "Setelah panggilan berakhir", "d": -0.15, "trans": "fade",
     "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.3]}, C("Lalu ia teringat", expr="shock", emote="idea", look="cam")]}],
     "cam": [{"x": 980, "y": 520, "zoom": 1.15}, {"at": 0, "on": "rina", "fit": 0.24, "sx": 900, "dur": 3}],
     "fx": [cap(1450, 170, "FORMULIR LAMARAN · 50%", bg="#2F6F73", at=0.3)]},
    {"cue": "Dua bulan lalu", "d": -0.15, "trans": "flash", "loc": "kaca", "locOpt": {"view": "luar", "time": "sore", "deskX": 1530},
     "actors": [ratna_desk(x=1580, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}]),
                {"who": "rina", "x": 300, "face": 1, "keys": [{"at": 0, "x": 520, "dur": 1.2, "expr": "scared"}, {"at": 1.3, "pose": "pointUp", "expr": "neutral"}]}],
     "cam": [{"x": 760, "y": 540, "zoom": 1.12}, {"at": 0, "x": 700, "y": 520, "zoom": 1.25, "dur": 5}],
     "fx": [{"type": "flashback"}, {"type": "taps", "x": 600, "y": 560, "word": "tok", "sound": "knock", "times": [{"at": 1.5}, {"at": 1.8}]}, cap(1480, 160, "EPS 1 · SATU PERTANYAAN", bg="#5E5A62", at=0.3)]},
    {"cue": "Mungkin, kali ini", "d": -0.15, "trans": "fade",
     "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "think", "expr": "neutral", "look": [0.3, -0.6]}, C("sebuah pertanyaan", pose="sit", expr="proud", look="cam")]}],
     "cam": [{"on": "rina", "fit": 0.2, "sx": 700}, {"at": 0, "on": "rina", "fit": 0.235, "sx": 720, "dur": 5}],
     "fx": [card("sebuah pertanyaan", "Mungkin jawabannya ada pada sebuah pertanyaan.", d=0.0, x=1340, y=210, size=46, maxW=820)]},
  ]})

# 6 ------------------------------------------------------------------ Ruang kaca: meminta contoh konkret
A.append({"n": 6, "name": "Meminta contoh konkret", "loc": "kaca", "music": "warm", "trans": "iris",
  "locOpt": DALAM,
  "lines": [{"who": "rina", "from": "Bu, bisa Ibu", "to": "nilai saya cukup", "text": "Bu, bisa Ibu beri contoh konkret, apa yang membuat nilai saya cukup?", "maxW": 640, "size": 42},
            {"who": "ratna", "from": "Penilaian ini untuk", "to": "dua bulan cara baru", "text": "Penilaian ini untuk setahun penuh, Rin.", "label": "Bu Ratna", "side": -0.3, "maxW": 760, "size": 42},
            {"who": "ratna", "from": "Kamu datang bertanya", "to": "awal yang baik", "text": "Kamu datang bertanya. Itu awal yang baik.", "side": -0.3, "maxW": 820, "size": 42},
            {"who": "rina", "from": "Kalau begitu", "to": "tiga bulan lagi", "text": "Apa yang harus saya buktikan, tiga bulan lagi?", "maxW": 640, "size": 42}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Ia bertanya", expr="happy", look=[-1, 0]), C("Bu, bisa Ibu", pose="think", expr="neutral")]),
                         {"who": "rina", "x": -260, "face": 1, "keys": [{"at": 0.1, "x": 700, "dur": 1.8, "expr": "neutral"}, {"at": 2.0, "pose": "idle"}, C("Ia tidak protes", pose="hips", expr="proud"), C("Bu, bisa Ibu", pose="talk", expr="neutral")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, C("Ia tidak protes", x=1000, y=520, zoom=1.15, dur=2)],
     "fx": [{"type": "taps", "x": 1060, "y": 690, "word": "tok", "sound": "knock", "times": [{"at": 1.9}, {"at": 2.2}]}, cap(1520, 160, "ESOK PAGI · 08.10", at=0.3, out=C("Ia tidak protes", -0.2)),
            card("Ia tidak protes", "Tidak protes. Bertanya.", d=0.1, x=520, y=200, out=C("Bu, bisa Ibu", -0.2))]},
    insert("Bu Ratna membuka berkas", -0.2, {"type": "yearFile", "barsAt": 0.3, "legendAt": C("Sepuluh bulan cara lama", -0.1), "noteAt": [C("Tiket yang sering"), C("Masalah proyek")]}, trans="zoom"),
    {"cue": "Perubahanmu terlihat", "d": -0.15, "trans": "whip",
     "actors": [ratna_desk(keys=[{"at": 0, "pose": "talk", "expr": "neutral"}, C("banyak orang", pose="shrug", expr="neutral"), C("Kamu datang bertanya", pose="pointUp", expr="happy")]),
                {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "sad"}, C("Kamu datang bertanya", expr="shock", emote="!"), C("Rina menarik napas", pose="hips", expr="proud"), C("Kalau begitu", pose="talk", expr="neutral")]}],
     "cam": [{"on": "ratna", "fit": 0.24, "sx": 1100}, {"at": 0, "on": "ratna", "fit": 0.27, "sx": 1150, "dur": 4}, C("Kamu datang bertanya", -0.5, x=1000, y=520, zoom=1.15, dur=0.9),
             C("Kalau begitu", on="rina", fit=0.22, sx=700, dur=1.2)],
     "fx": [card("Perubahanmu terlihat", "Berubah: terlihat. Tapi belum cukup lama.", d=0.1, x=520, y=200, size=44, out=C("banyak orang", -0.2)),
            card("langsung diam", "Diam · Pergi · atau BERTANYA", d=0.1, x=520, y=200, size=46, out=C("Kamu datang bertanya", 1.2))]},
  ]})

# 7 ------------------------------------------------------------------ Sembilan hal sekaligus
A.append({"n": 7, "name": "Sembilan hal sekaligus", "loc": "kos", "music": "tense", "trans": "fade",
  "props": [KCHAIR],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 720, "face": 1, "item": "marker", "keys": [{"at": 0, "pose": "sit", "expr": "proud", "look": [1, 0.4]}, {"at": 0.8, "pose": "type", "expr": "proud"}]}],
     "cam": [{"x": 950, "y": 520, "zoom": 1.08}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 2.5}],
     "grade": {"tint": "rgba(20,16,50,.25)"}, "fx": [cap(1500, 160, "MALAM ITU · 22.40", col="#F6C343", at=0.2)]},
    insert("Belajar Excel lanjutan", -0.4, {"type": "nineList", "night": True, "writeAt": [C("Belajar Excel lanjutan", -0.2), C("Membuat templat", -0.2), C("Ikut semua rapat", -0.2), C("Mengambil setiap", -0.2), C("Ikut kursus daring", -0.2),
                {"cue": "Sembilan hal", "d": -0.6}, {"cue": "Sembilan hal", "d": -0.3}, {"cue": "Sembilan hal", "d": 0.0}, {"cue": "Sembilan hal", "d": 0.3}], "chip": "9 HAL SEKALIGUS", "chipAt": C("Sembilan hal", 0.6)}, trans="zoom"),
    {"cue": "Bulan Maret", "d": -0.2, "trans": "whip", "loc": "rapat", "locOpt": {"slide": "bagi", "clock": "08:30", "backChairs": [800, 1110]},
     "actors": [{"who": "rina", "x": 1530, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "proud"}, {"at": 0.8, "pose": "pointUp", "expr": "laugh"}]},
                {"who": "sinta", "x": 640, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}]},
                {"who": "yoga", "x": 1240, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}]}],
     "cam": [{"x": 1150, "y": 450, "zoom": 1.1}, {"at": 0, "x": 1300, "y": 450, "zoom": 1.2, "dur": 3}],
     "fx": [{"type": "month", "at": 0.2, "hold": 3.0, "day": "", "text": "MARET"}, cap(520, 170, "RAPAT KE-3 HARI INI", bg="#6E2430", at=0.6)]},
    insert("kursus tengah malam", -0.2, {"type": "course", "clock": "23.12", "chip": "KURSUS DARING", "chipAt": 0.4}, trans="whip"),
    {"cue": "templat sambil makan siang", "d": -0.2, "trans": "whip", "loc": "kerja", "locOpt": {"time": "siang", "clock": "12:20"},
     "actors": [rina_sit(item="bowl", keys=[{"at": 0, "pose": "sit", "expr": "tired", "look": [1, 0.3]}, {"at": 0.7, "pose": "type", "item": None, "expr": "proud"}])],
     "props": [CHAIR, desk(cups=3, laptop=1)],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.1}, {"at": 0, "on": "rina", "fit": 0.24, "sx": 900, "dur": 3}],
     "fx": [cap(1500, 160, "MAKAN SIANG + TEMPLAT", bg="#2F6F73", at=0.3)]},
    {"cue": "Ia bahkan menawarkan", "d": -0.2, "trans": "whip", "loc": "rapat", "locOpt": {"slide": "demo", "clock": "15:00", "backChairs": []},
     "actors": [{"who": "rina", "x": 1750, "face": -1, "size": 600, "item": "marker", "keys": [{"at": 0, "pose": "point", "expr": "laugh"}, C("padahal tiketnya", pose="talk", expr="scared", emote="sweat")]},
                {"who": "dewi", "x": 800, "size": 520, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}]},
                {"who": "fajar", "x": 1100, "size": 520, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "confused"}]}],
     "cam": [{"x": 1250, "y": 500, "zoom": 1.08}, {"at": 0, "x": 1350, "y": 500, "zoom": 1.18, "dur": 4}],
     "fx": [cap(560, 160, "PELATIHAN KARYAWAN BARU", bg="#5B7DB1", at=0.3), cap(560, 280, "TIKET SENDIRI: BELUM", bg="#D9483B", cue="padahal tiketnya", d=0.1)]},
    {"cue": "Setiap malam ia kembali", "d": -0.2, "trans": "fade", "loc": "kerja", "locOpt": {"time": "malam", "clock": "21:40"},
     "actors": [rina_sit(eyebags=1, keys=[{"at": 0, "pose": "type", "expr": "tired"}, C("berlari sangat cepat", pose="sit", expr="proud", look="cam")])],
     "props": [CHAIR, desk(cups=5, laptop=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 860, "dur": 6}],
     "grade": {"tint": "rgba(20,16,50,.3)"}, "fx": [cap(1500, 160, "21.40 · PULANG PALING AKHIR", col="#F6C343", at=0.3)]},
    insert("Ia tidak melihat", -0.2, [{"type": "laptop", "mode": "tickets", "n0": 18, "n1": 47, "countDur": 4.5, "clock": "21:40"}, cap(1500, 960, "ANTREAN TERUS BERTAMBAH", bg="#D9483B", cue="terus bertambah", d=-0.3)], trans="zoom"),
  ]})

# 8 ------------------------------------------------------------------ Bayu yang tidak bertanya
A.append({"n": 8, "name": "Bayu yang tidak bertanya", "loc": "kerja", "music": "light", "trans": "whip",
  "locOpt": {"time": "siang", "clock": "14:10"},
  "lines": [{"who": "bayu", "from": "nanti saja", "to": "nanti saja", "text": "Nanti saja.", "min": 1.6, "label": "Bayu"}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": 850, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "angry", "look": [-1, 0]}, C("Ia hanya menggerutu", pose="sit", expr="angry"), C("lalu bekerja", pose="type", expr="neutral")]},
                         {"who": "fajar", "x": 420, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral"}, C("Ia hanya menggerutu", pose="shrug", expr="confused")]}],
     "props": [{"type": "chair16", "x": 830, "y": 1000, "col": "#2F6F73"}, desk(cups=2, laptop=1, photo=False)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 860, "y": 520, "zoom": 1.18, "dur": 5}],
     "fx": [cap(1500, 160, "MEJA OPERASIONAL", bg="#2F6F73", at=0.2), cap(1500, 280, "TIDAK BERTANYA", bg="#5E5A62", cue="Ia tidak bertanya", d=0.1, out=C("Setiap kali Rina", -0.2))]},
    {"cue": "Setiap kali Rina", "d": -0.15, "trans": "cut",
     "actors": [{"who": "bayu", "x": 850, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "happy", "look": [0.6, 0.4]}, C("nanti saja", pose="shrug", expr="laugh", look=[-1, 0])]},
                {"who": "rina", "x": 400, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "talk", "expr": "neutral"}, C("nanti saja", pose="hold", expr="confused", emote="?")]}],
     "props": [{"type": "chair16", "x": 830, "y": 1000, "col": "#2F6F73"}, desk(cups=2, laptop=1, photo=False)],
     "cam": [{"x": 760, "y": 520, "zoom": 1.15}, {"at": 0, "x": 800, "y": 520, "zoom": 1.22, "dur": 4}, C("Angkanya tidak naik", on="bayu", fit=0.24, sx=1000, dur=1.5)],
     "fx": [{"type": "headChart", "who": "bayu", "cue": "Angkanya tidak naik", "d": -0.2, "dy": 170, "label": "DATAR"}]},
  ]})

# 9 ------------------------------------------------------------------ Umpan balik bulan pertama (titik tegang)
A.append({"n": 9, "name": "Angkamu turun", "loc": "kaca", "music": "tense", "musicCut": 2.0, "trans": "iris", "post": 0.4, "hold": 1.6,
  "locOpt": {"view": "dalam", "time": "sore", "deskX": 1240},
  "lines": [{"who": "ratna", "from": "kata Bu Ratna pelan", "to": "angkamu turun", "text": "Rin… angkamu turun.", "label": "Bu Ratna", "side": -0.3, "min": 2.2}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Bu Ratna memutar", pose="type", expr="neutral")]),
                         {"who": "rina", "x": -260, "face": 1, "item": "notebook", "keys": [{"at": 0.1, "x": 700, "dur": 1.8, "expr": "happy"}, {"at": 2.0, "pose": "hold", "expr": "proud"}, C("Ia yakin akan dipuji", pose="hips", expr="laugh", emote="sparkle")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 2.0, "x": 900, "y": 520, "zoom": 1.15, "dur": 3}],
     "fx": [cap(1520, 160, "AKHIR MARET · UMPAN BALIK", at=0.3, out=C("Bu Ratna memutar", -0.2)), card("Ia yakin akan dipuji", "Yakin akan dipuji…", d=0.2, x=1380, y=210, out=C("Bu Ratna memutar", -0.2))]},
    insert("Grafik waktu balas", -0.3, {"type": "lineChart", "title": "Waktu balas Rina", "sub": "rata-rata per bulan · makin tinggi makin lambat", "labels": ["DES", "JAN", "FEB", "MAR"], "vals": [6, 4.6, 2.8, 4.9],
            "min": 0, "max": 7, "unit": " j", "drawAt": 0.3, "drawDur": 2.6, "lastFrom": 2, "lastCol": "#D9483B", "col": "#3BA36B",
            "flag": {"t": C("kini kembali memburuk", 0.1), "text": "MEMBURUK", "col": "#D9483B", "dx": -60, "dy": -100}}, trans="zoom"),
    {"cue": "kata Bu Ratna pelan", "d": -0.8, "trans": "cut",
     "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, 0]}])],
     "cam": [{"on": "ratna", "fit": 0.2, "sx": 1100}, {"at": 0, "on": "ratna", "fit": 0.225, "sx": 1100, "dur": 2.5}]},
    {"cue": "angkamu turun", "d": 0.4, "trans": "cut",
     "actors": [{"who": "rina", "x": 700, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "shock", "emote": "!", "look": [1, -0.1]}]}],
     "cam": [{"on": "rina", "fit": 0.3, "sx": 960, "shake": 6}, {"at": 0, "on": "rina", "fit": 0.36, "sx": 960, "dur": 1.3}]},
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 10 ----------------------------------------------------------------- Pilih dua (kejutan tengah)
A.append({"n": 10, "name": "Pilih dua", "loc": "kaca", "music": "hope", "trans": "fade", "pre": 0.8,
  "locOpt": {"view": "dalam", "time": "sore", "deskX": 1240},
  "lines": [{"who": "ratna", "from": "Kamu mencoba", "to": "benar-benar membaik", "text": "Kamu mencoba memperbaiki semuanya sekaligus, Rin.", "label": "Bu Ratna", "side": -0.3, "maxW": 820, "size": 42},
            {"who": "ratna", "from": "Pilih dua", "to": "Pilih dua", "text": "Pilih dua.", "kind": "shout", "side": -0.3, "min": 2.0, "shots": [0]}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Bu Ratna membacanya", pose="think", expr="neutral"), C("tersenyum kecil", expr="smile"), C("Kamu mencoba", pose="talk", expr="neutral"),
                    C("Ia menyerahkan spidolnya", pose="hold", item="marker", expr="happy"), C("Pilih dua", pose="pointUp", item=None, expr="proud")]),
                         {"who": "rina", "x": 700, "face": 1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "sad"}, C("Kamu mencoba", item=None, pose="idle", expr="sad", look="down"), C("Ia menyerahkan spidolnya", 0.5, item="marker", pose="hold", expr="shock")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.08}, {"at": 0, "x": 1000, "y": 520, "zoom": 1.16, "dur": 5}, C("Pilih dua", -0.3, on="ratna", fit=0.27, sx=1150, dur=0.6, ease="back")],
     "fx": [card("Akibatnya", "Semua sekaligus = tidak ada yang membaik.", d=0.2, x=520, y=200, size=44, out=C("Ia menyerahkan", -0.2))]},
    {"cue": "Yang paling berpengaruh", "d": -0.2, "trans": "cut", "blur": 8,
     "actors": [ratna_desk(keys=[{"at": 0, "pose": "talk", "expr": "neutral"}])],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.05}, {"at": 0, "x": 1100, "y": 520, "zoom": 1.1, "dur": 8}],
     "fx": [{"type": "card", "cue": "Perhatian kita terbatas", "d": 0.1, "text": "Perhatian kita terbatas.", "size": 70, "maxW": 1250, "y": 330, "out": C("Dua hal yang dikerjakan", -0.2)},
            {"type": "card", "cue": "Dua hal yang dikerjakan", "d": 0.1, "text": "2 hal setiap hari > 9 hal sesekali", "size": 74, "maxW": 1300, "y": 330}]},
    insert("Rina mencoret", -0.3, {"type": "nineList", "written": True, "strikeAt": [{"at": 0.3}, {"at": 0.75}, {"at": 1.2}, {"at": 1.65}, {"at": 2.1}, {"at": 2.55}, C("Tujuh baris hilang", -0.1)],
            "circleAt": C("Tersisa dua", 0.1), "title": "Yang harus kuperbaiki:", "chip": "PILIH DUA", "chipAt": 0.2, "chipBg": "#3BA36B"}, trans="zoom"),
    insert("Nilai yang jelek", -0.2, {"type": "twoNote", "slapAt": 0.2, "chip": "PETA, BUKAN VONIS", "chipAt": C("Ia adalah peta", 0)}, trans="whip"),
  ]})

# 11 ----------------------------------------------------------------- Montase April
RL = [["Selesai", "34 tiket tuntas hari ini.", "#3BA36B"], ["Sedang", "cek data Mart 8.", "#C2691F"], ["Butuh", "—", "#D9483B"]]
A.append({"n": 11, "name": "Montase April", "loc": "kerja", "music": "hope", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "08:30"},
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "proud", "look": [1, 0.3]}, C("Ia berhenti ikut rapat", pose="shrug", expr="happy"), C("Templat baru", pose="sit", expr="happy", look=[-1, 0])]),
                         {"who": "sinta", "x": 420, "face": 1, "keys": [{"at": 0, "x": -400}, C("Ia meminjam", -0.4, x=440, dur=0.8, pose="idle", expr="happy"), C("Ia meminjam", 0.5, pose="thumbs", expr="laugh")]}],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.08}, {"at": 0.5, "x": 900, "y": 520, "zoom": 1.16, "dur": 3}],
     "fx": [{"type": "month", "at": 0.2, "hold": 3.0, "day": "", "text": "APRIL"}, cap(520, 160, "FOKUS: 2 HAL", bg="#3BA36B", at=0.6),
            {"type": "strikeChip", "cue": "Ia berhenti ikut rapat", "d": 0.1, "text": "RAPAT TAK PERLU", "x": 1450, "y": 200, "strikeAt": C("tidak membutuhkannya", 0), "fadeAt": C("Kursus Excel", 0.4)},
            {"type": "strikeChip", "cue": "Kursus Excel", "d": 0.0, "text": "KURSUS EXCEL", "x": 1450, "y": 320, "strikeAt": C("ia tunda", 0), "fadeAt": C("Templat baru", 0.3)},
            cap(1450, 200, "TEMPLAT: PINJAM SINTA", bg="#2F6F73", cue="Ia meminjam", d=0.2, out=C("Setiap keluhan", -0.3))]},
    insert("Setiap keluhan", -0.2, [{"type": "laptop", "mode": "tickets", "n0": 31, "n1": 0, "countDur": 3.2, "clock": "16:40"}, cap(1500, 960, "✓ SELESAI HARI INI", bg="#3BA36B", cue="selesai hari ini", d=0.0)], trans="whip"),
    insert("Setiap jam empat sore", -0.2, {"type": "report", "lines": RL, "lineAt": [0.2, 0.5, 0.8], "per": 0.3, "sendAt": 1.6, "sentTime": "16.00 ✓✓", "clock": "16:00"}, trans="whip"),
    {"cue": "Suatu hari sistem", "d": -0.2, "trans": "flash", "locOpt": {"time": "siang", "clock": "11:20"},
     "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "sit", "expr": "shock", "emote": "!", "look": [1, 0.3]}, C("Rina tidak panik", pose="phone", expr="neutral")])],
     "props": [CHAIR, desk(cups=1, laptop=1)],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 900, "shake": 6}, {"at": 0.4, "on": "rina", "fit": 0.27, "sx": 900, "dur": 3}],
     "fx": [cap(1450, 160, "SISTEM TIKET MATI · 11.20", bg="#D9483B", at=0.2)]},
    insert("Sepuluh menit kemudian", -0.2, {"type": "phone2", "scale": 1.06, "chat": "Bu Ratna", "chatSub": "online", "chatCol": "#6E2430", "chatCh": "R", "skin": "#C98B62",
            "msgs": [{"at": -2.2, "text": "Bu, sistem tiket mati sejak 11.20. Saya catat keluhan manual dulu. Butuh tim TI.", "me": True, "time": "11.21 ✓✓"},
                     {"at": 0.4, "text": "Terima kasih, Rin. Mas Andi dari TI meluncur.", "time": "11.30"}],
            "chip": "LAPOR DALAM 10 MENIT", "chipAt": 0.8, "chipBg": "#3BA36B", "chipCol": "#FFFFFF"}, trans="whip"),
    {"cue": "bantuan dari tim TI", "d": -0.2, "trans": "whip", "locOpt": {"time": "siang", "clock": "11:48"},
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [-1, -0.2]}]),
                {"who": "andi", "x": -300, "face": 1, "item": "bag", "keys": [{"at": 0, "x": 500, "dur": 1.4, "expr": "happy"}, {"at": 1.5, "pose": "thumbs", "item": None, "expr": "laugh"}]}],
     "props": [CHAIR, desk(cups=1, laptop=1)],
     "cam": [{"x": 820, "y": 520, "zoom": 1.1}, {"at": 0, "x": 760, "y": 520, "zoom": 1.18, "dur": 3}],
     "fx": [{"type": "nameTag", "at": 1.0, "name": "Mas Andi", "role": "Tim TI", "x": 300, "y": 800}, cap(1450, 160, "11.48 · SEBELUM MAKAN SIANG", col="#F6C343", at=0.4)]},
    insert("Grafiknya naik pelan", -0.3, {"type": "lineChart", "title": "Tiket tuntas di hari yang sama", "sub": "Rina · April, per minggu", "labels": ["MG 1", "MG 2", "MG 3", "MG 4", "MG 5"], "vals": [58, 71, 66, 80, 90],
            "min": 40, "max": 100, "unit": "%", "avg": 78, "avgLabel": "rata-rata tim 78%", "avgAt": 0.2, "drawAt": 0.4, "drawDur": C("melewati rata-rata", 0.2), "col": "#C2691F",
            "flag": {"t": C("melewati rata-rata", 0.4), "text": "DI ATAS RATA-RATA", "col": "#3BA36B", "dx": -170, "dy": -90}}, trans="zoom"),
  ]})

# 12 ----------------------------------------------------------------- Umpan balik rutin
A.append({"n": 12, "name": "Umpan balik rutin", "loc": "kaca", "music": "warm", "trans": "iris",
  "locOpt": {"view": "dalam", "time": "sore", "deskX": 1240},
  "lines": [{"who": "rina", "from": "apa yang bisa saya", "to": "bulan depan", "text": "Apa yang bisa saya perbaiki bulan depan?", "maxW": 620, "size": 42}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "happy"}, C("Masukannya kecil", pose="talk", expr="neutral"), C("Mei: tandai", pose="pointUp", expr="happy")]),
                         {"who": "rina", "x": 700, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}, C("Satu pertanyaan saja", pose="talk", expr="neutral"), C("Masukannya kecil", pose="hold", expr="proud")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.08}, {"at": 0, "x": 1000, "y": 520, "zoom": 1.15, "dur": 4}, C("Masukannya kecil", -0.4, x=880, y=520, zoom=1.2, dur=1.2)],
     "fx": [cap(1520, 160, "15 MENIT · TIAP AKHIR BULAN", at=0.3, out=C("Masukannya kecil", -0.3)),
            card("April: kalimat", "April: kalimat penutup terlalu panjang", d=0.0, x=1350, y=180, size=40, maxW=760, out=C("Mei: tandai", -0.2)),
            card("Mei: tandai", "Mei: tandai tiket \"butuh tim lain\" sejak pagi", d=0.0, x=1350, y=180, size=40, maxW=760, out=C("Bu Sari", -0.4))]},
    insert("Bu Sari", -0.2, {"type": "phone2", "scale": 1.06, "chat": "Bu Sari · Toko Makmur", "chatSub": "online", "chatCol": "#3E7D4F", "chatCh": "S", "skin": "#C98B62",
            "msgs": [{"at": 0.2, "text": "Mbak Rina, makasih ya, cepat sekali!", "time": "10.02"}, {"at": 0.9, "text": "★★★★★", "time": "10.02"}],
            "chip": "DULU MENUNGGU 4 JAM", "chipAt": C("menunggu empat jam", -0.2), "chipBg": "#5E5A62", "chipCol": "#FFFFFF"}, trans="whip"),
    {"cue": "Dan suatu pagi", "d": -0.15, "trans": "whip", "loc": "kerja", "locOpt": {"time": "pagi", "clock": "08:05"},
     "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "neutral"}, C("di meja Rina", 0.3, pose="sit", expr="shock", look=[-1, -0.4]), C("Hanya senyum", pose="sit", expr="happy", emote="heart", look=[-1, -0.4])]),
                {"who": "sinta", "x": -300, "face": 1, "item": "notebook", "keys": [{"at": 0, "x": 520, "dur": 1.6, "expr": "happy"}, C("di meja Rina", pose="hold", expr="smile"), C("Tanpa kata", pose="idle", item=None, expr="happy"), C("Hanya senyum", 0.4, x=-400, dur=2.2, face=-1)]}],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, C("di meja Rina", -0.3, x=760, y=520, zoom=1.2, dur=1.5), C("Hanya senyum", on="rina", fit=0.25, sx=960, dur=2)],
     "fx": [cap(1500, 160, "BUKU CATATAN KUNING BARU", bg="#F6C343", col="#13223D", cue="buku catatan kuning", d=0.2)]},
  ]})

# 13 ----------------------------------------------------------------- Menghapus draf
A.append({"n": 13, "name": "Menghapus draf", "loc": "kos", "music": "night", "trans": "fade",
  "props": [KCHAIR],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}, C("sebuah email", item="phoneBuzz", pose="phone", expr="shock", look=[0.5, 0.5])]}],
     "cam": [{"x": 950, "y": 520, "zoom": 1.08}, {"at": 0, "x": 920, "y": 520, "zoom": 1.16, "dur": 4}, C("sebuah email", on="rina", fit=0.22, sx=760, dur=0.5, ease="back")],
     "sfx": [C("sebuah email", type="buzz", vol=0.8, dur=1.0)],
     "fx": [{"type": "month", "at": 0.2, "hold": 3.0, "day": "", "text": "AKHIR MEI"}]},
    insert("Lamaran Anda", -0.3, {"type": "jobMail", "mailAt": 0.1, "delAt": C("menekan hapus", 0.0)}, trans="zoom"),
    {"cue": "Bukan karena", "d": -0.15, "trans": "fade",
     "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [0.3, -0.5]}, C("tahu persis", pose="hips", expr="proud", look="cam")]}],
     "cam": [{"on": "rina", "fit": 0.2, "sx": 700}, {"at": 0, "on": "rina", "fit": 0.235, "sx": 720, "dur": 5}],
     "fx": [card("tahu persis", "Tahu persis ke mana ia berjalan.", d=0.1, x=1340, y=210, size=48, maxW=820)]},
    insert("Lalu ia mengirim pesan", -0.2, {"type": "phone2", "scale": 1.06, "night": True, "chat": "Bu Ratna", "chatSub": "online", "chatCol": "#6E2430", "chatCh": "R", "skin": "#C98B62",
            "msgs": [{"cue": "Bu, bulan depan", "d": -0.2, "text": "Bu, bulan depan saya ingin belajar memimpin rapat kecil. Boleh saya coba?", "me": True, "time": "21.05 ✓✓"}],
            "chip": "LANGKAH BERIKUTNYA", "chipAt": C("Boleh saya coba", 0.1), "chipBg": "#C2691F", "chipCol": "#FFFFFF"}, trans="whip", hold=0.6),
  ]})

# 14 ----------------------------------------------------------------- Penilaian triwulan + panggilan
A.append({"n": 14, "name": "Penilaian berikutnya", "loc": "kerja", "music": "warm", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "10:00"},
  "lines": [{"who": "hendra", "from": "Mulai bulan depan", "to": "klien terbesar kita", "text": "Mulai bulan depan, kamu yang memegang klien terbesar kita.", "label": "Pak Hendra", "maxW": 680, "size": 42},
            {"who": "bayu", "from": "Rin, dulu kamu", "to": "ke Bu Ratna", "text": "Rin… dulu kamu tanya apa ke Bu Ratna?", "label": "Bayu", "maxW": 620, "size": 42}],
  "shots": [
    {"at": 0, "actors": [{"who": "ayu", "x": 2200, "face": -1, "item": "envelopes", "keys": [{"at": 0, "x": 1350, "dur": 1.6}, {"at": 1.7, "pose": "hold", "expr": "happy"}, C("Kali ini Rina", 0.2, x=2400, dur=2.4)]},
                         rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, {"at": 1.6, "item": "envelope", "expr": "scared", "look": [1, -0.4]}, C("Kali ini Rina", pose="hold", expr="neutral", look="down")])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.05}, {"at": 0.5, "x": 1050, "y": 520, "zoom": 1.15, "dur": 3}, C("Kali ini Rina", on="rina", fit=0.24, sx=900, dur=1.5)],
     "fx": [cap(420, 150, "AKHIR MEI · PENILAIAN TRIWULAN", col="#F6C343", at=0.2, out=C("Sangat baik", -0.3)), card("bukan di toilet", "Di meja. Bukan di toilet.", d=0.1, x=1380, y=210, out=C("Sangat baik", -0.3))]},
    insert("Sangat baik", -0.3, {"type": "review", "bg": "desk", "title": "PENILAIAN KINERJA TRIWULAN", "period": "Maret – Mei", "labels": ["SANGAT BAIK", "BAIK", "CUKUP", "KURANG"], "pick": 0, "col": "#3BA36B",
            "stampAt": 0.2, "bannerAt": C("Terbaik di tim", 0.0)}, trans="cut"),
    {"cue": "Bayu bersorak", "d": -0.15, "trans": "whip",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "laugh", "emote": "sparkle", "look": [-1, -0.3]}]),
                {"who": "bayu", "x": 470, "face": 1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh", "jump": 40}, {"at": 0.9, "pose": "clap", "expr": "laugh"}]},
                {"who": "nisa", "x": 1650, "y": 930, "layer": "back", "size": 520, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}]}],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 860, "y": 520, "zoom": 1.15, "dur": 2}],
     "sfx": [{"at": 0.1, "type": "cheer", "vol": 0.45, "dur": 1.6}], "fx": [{"type": "confetti", "at": 0.2, "x": 600, "y": 300, "count": 50}]},
    insert("Di layar, Yoga", -0.2, {"type": "rankTop", "riseAt": 0.6, "chip": "TANPA KATA-KATA", "chipAt": C("tanpa kata-kata", 0)}, trans="zoom"),
    {"cue": "Sorenya", "d": -0.2, "trans": "whip", "loc": "bos", "locOpt": {"time": "sore", "deskX": 1300, "folder": True},
     "actors": [{"who": "hendra", "x": 1400, "y": 950, "layer": "back", "face": -1, "size": 600, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("Mulai bulan depan", pose="point", expr="happy")]},
                {"who": "rina", "x": -260, "face": 1, "keys": [{"at": 0.1, "x": 620, "dur": 1.6, "expr": "scared"}, {"at": 1.8, "pose": "idle", "expr": "neutral"}, C("klien terbesar kita", pose="shock", expr="shock", emote="!")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 1.0, "x": 1050, "y": 520, "zoom": 1.12, "dur": 3}, C("klien terbesar kita", on="rina", fit=0.24, sx=760, dur=0.6, ease="back")],
     "fx": [cap(560, 160, "RUANG PAK HENDRA", bg="#3B2418", at=0.3), cap(1450, 300, "WIJAYA · 12 TOKO", bg="#6E2430", cue="klien terbesar kita", d=0.2)]},
    {"cue": "Kembali ke mejanya", "d": -0.2, "trans": "whip", "loc": "kerja", "locOpt": {"time": "sore", "clock": "16:20"},
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [-1, -0.3]}, C("Rin, dulu kamu", expr="shock", look=[-1, -0.3])]),
                {"who": "bayu", "x": 470, "face": 1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}, C("Lalu Bayu bertanya", pose="talk", expr="sad", look=[1, -0.1])]}],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 760, "y": 520, "zoom": 1.15}, {"at": 0, "on": "bayu", "fit": 0.25, "sx": 760, "dur": 3}, C("Rin, dulu kamu", -0.4, x=700, y=520, zoom=1.15, dur=1.2)],
     "fx": [cap(420, 150, "NILAI BAYU: CUKUP", bg="#D9483B", at=0.4, out=C("Lalu Bayu bertanya", -0.2))]},
  ]})

# 15 ----------------------------------------------------------------- Kartu pelajaran + penutup cerita
A.append({"n": 15, "name": "Kartu pelajaran & penutup", "loc": "kerja", "music": "warm", "trans": "iris", "post": 2.6,
  "locOpt": {"time": "siang", "clock": "16:05"},
  "shots": [
    {"at": 0, "blur": 9, "actors": [{"who": "rina", "x": 300, "size": 600, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: nilai", pose="pointUp"), C("Dua: pilih", pose="hips", expr="proud"),
                 C("Tiga: minta", pose="pointUp", expr="laugh", item="thumb", jump=40)]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Satu: nilai", "d": -0.6, "items": [{"cue": "Satu: nilai", "text": "Nilai jelek adalah peta, bukan vonis"},
            {"cue": "Dua: pilih", "text": "Pilih dua hal saja untuk diperbaiki"}, {"cue": "Tiga: minta", "text": "Minta umpan balik rutin, jangan menunggu penilaian"}]}]},
    {"cue": "Rina tidak berubah", "d": -0.2, "trans": "fade", "loc": "halte", "locOpt": {"time": "senja"},
     "actors": [{"who": "rina", "x": 900, "face": 1, "item": "bag", "keys": [{"at": 0, "pose": "idle", "expr": "sad", "look": [1, -0.2]}]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "x": 920, "y": 520, "zoom": 1.15, "dur": 4}],
     "fx": [{"type": "flashback"}, cap(1480, 160, "EPS 1", bg="#5E5A62", at=0.2)]},
    insert("Ia hanya berhenti", -0.2, {"type": "sticky", "writeAt": -3, "circleAt": 0.3}, trans="fade"),
    insert("dan mulai bertanya", -0.2, {"type": "rulePoster", "slapAt": -3, "line3At": -3}, trans="fade"),
    insert("ke mana harus melangkah", -0.4, {"type": "twoNote", "slapAt": 0.1}, trans="fade"),
    {"cue": "Dan Bayu", "d": -0.15, "trans": "whip", "loc": "lorong",
     "actors": [{"who": "bayu", "x": 1500, "face": -1, "keys": [{"at": 0, "x": 960, "dur": 2.0, "expr": "scared"}, C("ia mengetuk pintu", -0.3, pose="pointUp", expr="proud")]}],
     "props": [{"type": "officeDoor", "x": 760, "y": 1000, "label": "KEPALA OPERASIONAL"}],
     "cam": [{"x": 960, "y": 540, "zoom": 1.05}, {"at": 0, "x": 900, "y": 540, "zoom": 1.15, "dur": 5}],
     "fx": [cap(1450, 160, "BESOK PAGINYA", col="#F6C343", at=0.3), {"type": "taps", "x": 860, "y": 640, "word": "tok", "sound": "knock", "times": [C("ia mengetuk pintu", 0.0), C("ia mengetuk pintu", 0.3)]},
            {"type": "card", "cue": "pintu atasannya", "d": 0.7, "text": "TAK TERLIHAT · SELESAI", "size": 80, "y": 400, "maxW": 1300}]},
  ]})

# 16 ----------------------------------------------------------------- Cuplikan Cerita 2 + layar akhir
A.append({"n": 16, "name": "Cuplikan Klien Terbesar + layar akhir", "loc": "lobi", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": {"time": "pagi", "deskX": 1250, "slam": C("Siapa yang bertanggung", -0.25), "slamX": -300},
  "lines": [{"who": "wijaya", "from": "Siapa yang bertanggung", "to": "di sini", "text": "Siapa yang bertanggung jawab di sini?!", "label": "Pak Wijaya", "kind": "shout", "maxW": 760, "size": 44}],
  "shots": [
    {"at": 0, "actors": [{"who": "resepsionis", "x": 1350, "y": 930, "layer": "back", "face": -1, "size": 520, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Siapa yang bertanggung", -0.1, pose="scared", expr="scared", emote="!")]},
                         {"who": "wijaya", "x": -300, "face": 1, "size": 640, "keys": [{"at": 0, "x": 780, "dur": 2.4, "expr": "angry"}, C("Siapa yang bertanggung", -0.4, pose="point", expr="angry")]}],
     "cam": [{"x": 900, "y": 540, "zoom": 1.02}, {"at": 0, "x": 960, "y": 520, "zoom": 1.1, "dur": 3}, C("Siapa yang bertanggung", -0.25, on="wijaya", fit=0.26, sx=900, dur=0.4, ease="back", shake=10)],
     "sfx": [C("Siapa yang bertanggung", -0.25, type="thud", vol=1.0)],
     "fx": [cap(480, 160, "BULAN DEPAN · LOBI", col="#F6C343", at=0.3), {"type": "nameTag", "cue": "klien terbesar itu", "d": 0.3, "name": "Pak Wijaya", "role": "Klien · 12 toko", "x": 360, "y": 820, "out": C("Siapa yang bertanggung", -0.3)}]},
    {"cue": "Saksikan cerita baru", "d": -0.2, "trans": "whip", "loc": "gudang", "locOpt": {"wrong": True, "boxes": [[1450, 3], [1720, 2]]},
     "actors": [{"who": "dodi", "x": 900, "face": 1, "keys": [{"at": 0, "pose": "cross", "expr": "angry", "look": [1, 0]}, {"at": 0.9, "pose": "cross", "expr": "neutral", "look": "cam"}]}],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.08}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.16, "dur": 2}],
     "fx": [cap(560, 160, "KARDUS TIPE SALAH", bg="#D9483B", at=0.2)]},
    insert("Tangani: Klien", -0.1, [{"type": "countdown", "from": 9, "to": 7}, {"type": "card", "cue": "Tangani: Klien", "d": 0.7, "text": "CERITA BARU · KLIEN TERBESAR", "size": 64, "y": 920, "maxW": 1300}], trans="flash"),
    {"cue": "Kalau cerita Rina", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis"), "nextQuote": "\"Siapa yang bertanggung jawab?\"", "nextSub": "klien terbesar", "nextTitle": "Klien Terbesar · Eps 1",
             "nextWho": "wijaya", "nextKey": {"pose": "point", "expr": "angry"}, "nextThumb": False, "ask": "Kebiasaan mana yang paling ingin kamu coba minggu ini? Tulis di komentar!"}]},
  ]})


def shot_local(A):
    """Mesin membaca `at` (aktor, kamera, fx) sebagai detik sejak awal ADEGAN. Di shot ke-2 dst. data di sini ditulis
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
            for k in sh.get("cam", []): fix(k, sh, moving)
            for f in sh.get("fx", []): fix(f, sh, lambda k: k["at"] > 0)


def check_cues(A):
    """Setiap cue harus ada di narasi adegannya (huruf kecil, tanda baca persis)."""
    nar = narration(ROOT / "youtube/serial/ep04-naskah.md"); bad = []
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
ep = {"slug": "kantor-04", "title": "Nilai Kinerja Jelek, 3 Bulan Kemudian Jadi yang Terbaik | Kantor Tangani: Tak Terlihat Eps 4",
      "series": "Kantor Tangani", "story": "Tak Terlihat", "eps": "4/4", "month": "FEBRUARI–MEI", "naskah": "youtube/serial/ep04-naskah.md", "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Nilai cukup"], [4, "Resign aja?"], [7, "Sembilan hal sekaligus"], [10, "Pilih dua"], [11, "Tiga bulan"], [14, "Penilaian berikutnya"], [16, "Cerita baru"]],
      "parts": [["Pembuka & masalah", 0, 4], ["Memburuk", 4, 6], ["Berubah & hasil", 6, 8], ["Cerita baru", 8, 9]],
      "lessons": ["Nilai yang jelek adalah peta, bukan vonis.", "Pilih dua hal saja untuk diperbaiki, kerjakan setiap hari.", "Minta umpan balik secara rutin, jangan menunggu penilaian datang."],
      "youtube": {
        "desc": "Tiga tahun bekerja, dua bulan berubah habis-habisan, dan nilai kinerjanya hanya \"Cukup\". Rina duduk di bilik toilet dengan lowongan kerja terbuka di ponselnya. Bertahan atau pergi? Episode penutup Kantor Tangani: Tak Terlihat.",
        "ask": "Dari empat episode Tak Terlihat, kebiasaan mana yang paling ingin kamu coba minggu ini? Tulis di kolom komentar.",
        "next": "Cerita baru, Kantor Tangani: Klien Terbesar, tayang berikutnya.",
        "tags": "kantor tangani, tak terlihat, cerita kantor, animasi kantor, penilaian kinerja, nilai kinerja jelek, umpan balik atasan, resign atau bertahan, fokus kerja, karier, dunia kerja, Tangani Talenta",
        "adAfter": 9},
      "thumb": {"kind": "nilai", "lines": ["NILAI", "CUKUP…"], "hl": "JADI #1", "badge": "EPS 4/4"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
