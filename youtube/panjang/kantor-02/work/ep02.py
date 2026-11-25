#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-02 (Tak Terlihat Eps 2)."""
import json, copy
OUT = "/var/www/tangani_talenta/tangani_talenta_video/youtube/panjang/kantor-02/episode.json"

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
NOLOC = {"actors": [], "useLoc": False}
def insert(cue, d, fx, trans="zoom", **kw):
    o = dict(cue=cue, d=d, trans=trans, **NOLOC); o["fx"] = fx if isinstance(fx, list) else [fx]; o.update(kw); return o

extras = {
    "dewi": {"nama": "Dewi (rekan tim)", "look": {"hair": "hijab", "hijab": "#3E7D4F", "shirt": "#F3D9B5", "pants": "#3B2418", "skin": "e", "idcard": "#C2691F"}},
    "fajar": {"nama": "Fajar (rekan tim)", "look": {"hair": "short", "hairColor": "#2B1A12", "shirt": "#9FC6D0", "pants": "#2C2433", "skin": "a", "idcard": "#2F6F73"}},
    "dimas": {"nama": "Dimas (adik Rina)", "look": {"hair": "short", "hairColor": "#2B1A12", "shirt": "#FFFDF8", "jacket": "#1F4E8C", "pants": "#2C2433", "skin": "c"}},
    "dir1": {"nama": "Bu Wulan (direksi)", "look": {"hair": "hijab", "hijab": "#13223D", "shirt": "#FFFDF8", "jacket": "#6E2430", "pants": "#2C2433", "skin": "b", "glasses": True}},
    "dir2": {"nama": "Pak Surya (direksi)", "look": {"hair": "side", "hairColor": "#5A5A5A", "shirt": "#FFFDF8", "tie": "#2F6F73", "jacket": "#2C2433", "pants": "#2C2433", "skin": "d"}},
    "dir3": {"nama": "Bu Dian (direksi)", "look": {"hair": "hijab", "hijab": "#B0763A", "shirt": "#F3D9B5", "jacket": "#3B4A6B", "pants": "#3B2418", "skin": "c"}},
}

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA
REC = {"type": "recap"}
A.append({"n": 1, "name": "Sebelumnya (kilas Eps 1)", "loc": "rapat", "music": "sad", "pre": 0.5, "post": 0.6, "trans": "cut",
  "locOpt": {"slide": "sinta", "clock": "08:06", "backChairs": [800, 1110]},
  "shots": [
    {"at": 0, "actors": [
        {"who": "hendra", "x": 270, "size": 610, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "laugh"}, {"at": 1.6, "pose": "clap", "expr": "happy"}]},
        {"who": "sinta", "x": 640, "size": 540, "face": 1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh"}]},
        {"who": "bayu", "x": 950, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}]},
        {"who": "dewi", "x": 1260, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}]},
        {"who": "rina", "x": 1850, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}]}],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.0}, {"at": 0.2, "x": 1500, "y": 560, "zoom": 1.25, "dur": 4}],
     "fx": [REC, {"type": "confetti", "x": 640, "y": 260, "count": 70}]},
    insert("baru sadar", -0.2, [{"type": "graph", "mode": "rank", "revealAt": 0.6, "panDur": 4, "push": 0.05}, REC], trans="whip"),
    {"cue": "Satu pertanyaan", "d": -0.2, "trans": "whip", "loc": "kaca", "locOpt": {"view": "luar", "time": "sore", "deskX": 1350},
     "actors": [{"who": "ratna", "x": 1300, "y": 950, "layer": "back", "face": -1, "size": 580, "keys": [{"at": 0, "pose": "sit", "look": "cam"}]},
                {"who": "rina", "x": 330, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "scared"}]}],
     "cam": [{"x": 700, "y": 560, "zoom": 1.2}, {"at": 0, "x": 640, "y": 560, "zoom": 1.3, "dur": 3}],
     "fx": [{"type": "taps", "x": 560, "y": 560, "word": "tok", "sound": "knock", "times": [C("Satu pertanyaan", 0.3), C("Satu pertanyaan", 0.6)]}, REC]},
    insert("mengubah cara kerjanya", -0.3, [{"type": "laptop", "mode": "sari5", "replyAt": 0.1, "starsAt": 0.6, "clock": "13:02"}, REC], trans="whip"),
    {"cue": "Tapi minggu ini", "d": -0.1, "trans": "flash", "loc": "kerja", "locOpt": {"time": "sore", "clock": "16:30"},
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "happy"}, C("ujian", pose="sit", expr="shock", emote="!")])],
     "props": [CHAIR, desk(cups=2)],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, C("ujian", on="rina", fit=0.24, sx=820, dur=0.6, ease="back", shake=8)],
     "fx": [cap(1450, 170, "MINGGU INI…", col="#F6C343", at=0.3)]},
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: Kamis 16.30, H-1
A.append({"n": 2, "name": "Meja Rina, Kamis 16.30 (H-1)", "loc": "kerja", "music": "tense", "trans": "flash", "pre": 0.6,
  "locOpt": {"time": "sore", "clock": "16:30"},
  "fx": [{"type": "month", "at": 0.4, "hold": 4.0, "day": "28", "text": "JANUARI"}],
  "actors": [rina_sit(eyebags=0.7, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]},
                C("Bu Ratna berdiri", d=0.4, look=[-1, -0.3], expr="happy"),
                C("Rina menatap layar", look=[1, 0.3], expr="scared"),
                C("Folder itu kosong", expr="scared", emote="sweat"),
                C("dua kata yang sama", expr="happy", look="cam"),
                C("Dan dua minggu itu", expr="sad", look="down")]),
             {"who": "ratna", "x": -300, "face": 1, "item": "notebook", "keys": [{"at": 0.1, "x": 470, "dur": 1.8}, C("Rin, data dari", pose="hold", expr="happy"), C("Rina menatap", pose="idle", expr="neutral")]}],
  "props": [CHAIR, desk(cups=3, photo=False), {"type": "deskCal", "x": 1295, "y": 765, "day": "29", "sub": "JUMAT", "ring": True}],
  "lines": [{"who": "ratna", "from": "Rin, data dari", "to": "semua, kan?", "text": "Rin, data vendor sudah masuk semua, kan?", "label": "Bu Ratna"},
            {"who": "ratna", "from": "Besok pagi", "to": "dinyalakan.", "text": "Besok pagi sistem barunya dinyalakan."}],
  "shots": [
    {"at": 0, "cam": [{"x": 900, "y": 540, "zoom": 1.05}, {"at": 1.0, "x": 760, "y": 520, "zoom": 1.2, "dur": 3}, C("Besok pagi", x=700, y=500, zoom=1.28, dur=2)],
     "fx": [cap(1520, 160, "KAMIS · 16.30", at=0.3, out=4.6)]},
    insert("Rina menatap layar", -0.1, {"type": "laptop", "mode": "folder", "clock": "16:30"}),
    {"cue": "Dua minggu terakhir", "d": -0.1, "trans": "cut", "cam": [{"on": "rina", "fit": 0.26, "sx": 860}, C("dua kata yang sama", on="rina", fit=0.3, sx=900, dur=1.5)],
     "fx": [{"type": "card", "cue": "dua kata yang sama", "d": 0.3, "style": "small", "text": "\"Aman, Bu!\"", "sub": "jawaban Rina, setiap kali ditanya", "x": 1380, "y": 220, "size": 64, "out": C("Dan dua minggu itu", -0.2)}]},
    insert("folder ini tidak pernah", -0.3, {"type": "calendar", "today": 28, "dead": 29, "circleAt": 0.3, "deadLabel": "BESOK!", "deadSub": "SISTEM BARU MENYALA"}, trans="whip"),
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "TAK TERLIHAT · EPS 2/4",
     "hook": "Bilang \"Aman, Bu!\" Padahal Proyeknya Hampir Gagal", "day": "14", "month": "JANUARI", "marker": "DUA MINGGU SEBELUMNYA", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Ruang rapat, pembagian proyek
A.append({"n": 4, "name": "Ruang rapat, pembagian proyek", "loc": "rapat", "music": "light", "trans": "iris",
  "locOpt": {"slide": "bagi", "clock": "09:00", "backChairs": [800, 1110, 1850], "bagi1": C("Setiap orang"), "bagi2": C("Setiap orang", 0.8), "bagi3": C("Rina kebagian", 0.3)},
  "actors": [
    {"who": "ratna", "x": 1790, "face": -1, "size": 600, "item": "marker", "keys": [{"at": 0, "pose": "talk", "expr": "happy"}, C("Semua data klien", pose="point"), C("Setiap orang", pose="pointUp"), C("Rina kebagian", pose="point", face=-1), C("Jantung Rina", pose="idle")]},
    {"who": "sinta", "x": 640, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("Setiap orang", expr="happy")]},
    {"who": "yoga", "x": 1240, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit"}, C("Setiap orang", 0.8, expr="happy")]},
    {"who": "rina", "x": 1530, "z": 3, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("Rina kebagian", expr="shock", emote="!"), C("Jantung Rina", expr="happy", emote="heart"),
        C("Ini kesempatannya", expr="proud", emote="sparkle", look="cam"), C("Setelah minggu lalu", expr="neutral", look=None), C("ia ingin membuktikan", expr="proud", emote="!!")]},
    {"who": "bayu", "x": 940, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "happy"}, C("Rina kebagian", 0.6, pose="clap", expr="laugh"), C("Jantung Rina", pose="sit")]},
    {"who": "dewi", "x": 800, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "sit"}]},
    {"who": "fajar", "x": 1110, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "sit"}]}],
  "lines": [{"who": "ratna", "from": "Rina kebagian", "to": "sistem lama.", "text": "Rina, kamu pegang data dari vendor lama.", "label": "Bu Ratna"}],
  "sfx": [C("Semua data klien", 0.3, type="whoosh", vol=0.3)],
  "shots": [
    {"at": 0, "cam": [{"x": 1000, "y": 520, "zoom": 1.0}, {"at": 0.3, "x": 760, "y": 380, "zoom": 1.25, "dur": 3.5}, C("Setiap orang", x=860, y=420, zoom=1.15, dur=1.5), C("Rina kebagian", 0.3, x=1350, y=520, zoom=1.15, dur=1.4)],
     "fx": [cap(420, 150, "2 MINGGU SEBELUMNYA", col="#F6C343", at=0.2, out=3.4)]},
    {"cue": "Jantung Rina", "d": -0.1, "trans": "cut", "cam": [{"on": "rina", "fit": 0.24, "sx": 1000}, C("Ini kesempatannya", on="rina", fit=0.3, sx=1000, dur=2)]},
    {"cue": "Setelah minggu lalu", "d": -0.1, "trans": "flash", "locOpt": {"slide": "sinta", "clock": "08:06", "backChairs": []},
     "actors": [{"who": "hendra", "x": 270, "size": 610, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "laugh"}]},
                {"who": "sinta", "x": 640, "size": 540, "face": 1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh"}]},
                {"who": "bayu", "x": 950, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}]}],
     "cam": [{"x": 640, "y": 540, "zoom": 1.1}], "fx": [{"type": "flashback"}, {"type": "confetti", "x": 640, "y": 240, "count": 60}]},
    {"cue": "ia ingin membuktikan", "d": -0.4, "trans": "flash", "cam": [{"on": "rina", "fit": 0.26, "sx": 1100}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 1150, "dur": 2.5}],
     "fx": [{"type": "card", "cue": "bisa diandalkan", "d": -0.4, "style": "small", "text": "Harus terlihat bisa diandalkan.", "x": 560, "y": 210, "size": 50}]},
  ]})

# 5 ------------------------------------------------------------------ Hari ke-3 dan ke-7
A.append({"n": 5, "name": "Hari ke-3 sampai ke-7", "loc": "kerja", "music": "tense", "trans": "whip", "hold": 0.8,
  "locOpt": {"time": "siang", "clock": "10:20"},
  "lines": [{"who": "ratna", "from": "Aman, Rin?", "to": "Aman, Rin?", "text": "Aman, Rin?", "min": 1.6},
            {"who": "rina", "from": "Aman, Bu!", "to": "Aman, Bu!", "text": "Aman, Bu!", "kind": "shout", "min": 1.8}],
  "shots": [
    insert(None, None, [{"type": "mail", "sentAt": C("mengirim email", 0.4), "waitAt": C("Tidak ada balasan"), "d0": 3, "d1": 3, "dayDur": 1, "clock": "09:12"},
                        cap(1720, 1000, "HARI KE-3", col="#F6C343", at=0.2, size=40)], trans="cut"),
    {"cue": "Bu Ratna lewat", "d": -0.2, "trans": "whip",
     "actors": [rina_sit(eyebags=0.3, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, C("Aman, Rin?", look=[-1, -0.6], expr="shock"),
                    C("Rina tersenyum", pose="pointUp", item="thumb", expr="laugh", look=[-1, -0.6]), C("Kenapa ia bilang", d=0.5, pose="sit", item=None, expr="sad", look="down"),
                    C("Ia takut", expr="scared", emote="sweat", look=None), C("Lagi pula", expr="neutral", look=[1, 0.3])]),
                {"who": "ratna", "x": 2150, "y": 930, "layer": "back", "face": -1, "size": 560, "item": "notebook", "keys": [{"at": 0, "x": 1240, "dur": 1.6}, C("Aman, Bu!", 0.6, pose="wave", expr="happy"), C("Kenapa ia bilang", x=-400, dur=3.6, pose="idle")]}],
     "props": [CHAIR, desk(cups=1)],
     "cam": [{"x": 1080, "y": 520, "zoom": 1.08}, C("Rina tersenyum", x=1000, y=540, zoom=1.2, dur=1), C("Kenapa ia bilang", 0.3, on="rina", fit=0.27, sx=860, dur=3)],
     "fx": [{"type": "card", "cue": "Ia takut", "d": 0.2, "style": "small", "text": "Takut terlihat tidak mampu lagi.", "x": 1380, "y": 220, "size": 50, "out": C("Ia menelepon", -0.3)}]},
    {"cue": "Ia menelepon", "d": -0.1, "trans": "cut",
     "actors": [rina_sit(eyebags=0.4, keys=[{"at": 0, "pose": "phone", "item": "phone", "expr": "neutral"}, C("mesin penjawab", expr="sad", emote="sweat")])],
     "props": [CHAIR, desk(cups=2)],
     "cam": [{"on": "rina", "fit": 0.22, "sx": 760}, {"at": 0, "on": "rina", "fit": 0.26, "sx": 820, "dur": 4}],
     "fx": [cap(1480, 180, "TUT… TUT…", at=0.6, out=C("mesin penjawab", -0.2)), cap(1480, 180, "MESIN PENJAWAB", bg="#D9483B", cue="mesin penjawab")]},
    insert("Rina memutuskan", -0.1, {"type": "clockClose", "h0": 9, "rate": 3.2, "label": ["HARI KE-4", "HARI KE-5", "HARI KE-6", "HARI KE-6", "HARI KE-6", "HARI KE-6"], "labelEvery": 1.0, "x": 760}, trans="flash"),
    insert("Hari ketujuh", -0.1, [{"type": "mail", "replyAt": 0.3, "clock": "08:30"}, cap(1720, 1000, "HARI KE-7", bg="#D9483B", at=0.2, size=40)], trans="zoom"),
    insert("sampai sehari", -0.3, {"type": "calendar", "dead": 29, "circleAt": 0.1, "deadLabel": "TENGGAT", "back": 30, "backAt": 0.8, "stamp": "TERLAMBAT!"}, trans="whip"),
  ]})
A[-1]["shots"][0].pop("cue"); A[-1]["shots"][0].pop("d"); A[-1]["shots"][0]["at"] = 0

# 6 ------------------------------------------------------------------ Bayu & grup kantor
A.append({"n": 6, "name": "Grup kantor, Bayu", "loc": "kerja", "music": "light", "trans": "whip", "hold": 3.4,
  "locOpt": {"time": "siang", "clock": "11:00"},
  "lines": [{"who": "bayu", "from": "grup itu", "to": "grup itu", "d0": 0.9, "d1": 2.6, "text": "Kan sudah saya laporkan, Pak!", "label": "Bayu"},
            {"who": "hendra", "from": "grup itu", "to": "grup itu", "d0": -0.2, "d1": 0.6, "text": "Toko Makmur kok marah?", "label": "Pak Hendra"}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": 1000, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "happy"}, C("masalah yang terbalik", expr="laugh", look="cam"), C("Ia melaporkan", pose="phone", expr="happy")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 0.3, "on": "bayu", "fit": 0.22, "sx": 820, "dur": 3}],
     "fx": [{"type": "nameTag", "at": 0.6, "name": "Bayu", "role": "Staf Operasional", "x": 1180, "y": 780}]},
    insert("Sudah sampai kantor", -0.2, {"type": "group", "rate": 2.1, "startAt": 0.1, "max": 14, "hlAt": C("terselip satu", 0.3), "skin": "#C98E68"}),
    insert("Tidak ada yang membacanya", -0.1, {"type": "group", "instant": True, "max": 14, "counter": False, "muteAt": C("membisukan", -0.3),
            "label": "PONSEL PAK HENDRA", "labelX": 430, "labelY": 860, "labelBg": "#3B2418", "skin": "#E2A77C"}, trans="whip"),
    {"cue": "grup itu", "d": 0.3, "trans": "whip", "locOpt": {"time": "siang", "clock": "09:15"},
     "actors": [{"who": "hendra", "x": 1350, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, C("grup itu", 1.0, pose="idle", expr="confused", emote="?")]},
                {"who": "bayu", "x": 760, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "shock", "expr": "shock"}, C("grup itu", 0.9, pose="point", expr="happy")]}],
     "cam": [{"x": 1060, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1040, "y": 540, "zoom": 1.18, "dur": 3}],
     "fx": [cap(420, 150, "ESOKNYA", col="#F6C343", at=0)]},
  ]})

# 7 ------------------------------------------------------------------ Rina berjuang sendirian (malam)
NIGHT = {"time": "malam", "empty": True, "clock": "21:40", "lights": 0.55}
A.append({"n": 7, "name": "Malam, Rina berjuang sendirian", "loc": "kerja", "music": "night", "trans": "fade",
  "locOpt": NIGHT,
  "lines": [{"who": "yoga", "from": "Itu data vendor?", "to": "Mau kubantu?", "text": "Itu data vendor? Formatnya rusak, Rin. Mau kubantu?", "label": "Yoga"},
            {"who": "rina", "from": "Nggak apa-apa", "to": "hampir beres.", "text": "Nggak apa-apa, Yog. Sudah hampir beres."},
            {"who": "rina", "from": "jawabannya tetap sama", "to": "Aman, Bu.", "d0": 0.4, "text": "Aman, Bu.", "min": 1.6}],
  "shots": [
    {"at": 0, "actors": [rina_sit(eyebags=0.8, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Ia juga tidak", expr="sad"), C("Setiap malam", expr="neutral", look=[1, 0.3])])],
     "props": [CHAIR, desk(cups=3)],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0.3, "on": "rina", "fit": 0.22, "sx": 820, "dur": 5}],
     "fx": [cap(1500, 170, "SETIAP MALAM", col="#F6C343", at=0.4)]},
    insert("Hasilnya berantakan", -0.2, {"type": "exportSheet", "errAt": C("terpotong", -0.3), "tries": [3, 7], "triesDur": 4, "clock": "21:58"}),
    {"cue": "Pukul sepuluh malam", "d": -0.15, "trans": "whip", "locOpt": dict(NIGHT, clock="22:00"),
     "actors": [rina_sit(eyebags=0.9, keys=[{"at": 0, "pose": "facepalm", "expr": "sad"}, {"at": 1.2, "pose": "sit", "expr": "neutral", "look": [1, 0.3]},
                    C("Ia melirik", expr="shock", look=[1, -0.5]), C("Rina buru-buru", pose="scared", expr="scared"), C("Nggak apa-apa", pose="sit", expr="happy", look=[1, -0.5]),
                    C("Yoga mengangguk", expr="sad", look="down")]),
                {"who": "yoga", "x": 2200, "face": -1, "keys": [C("Yoga lewat", x=1480, dur=2.2), C("Ia melirik", look=[-1, 0.6]), C("Itu data vendor?", pose="point", expr="confused"),
                    C("Rina buru-buru", pose="idle", expr="neutral", look=None), C("Yoga mengangguk", pose="idle", face=1), C("Yoga mengangguk", 0.5, x=2500, dur=2.6)]}],
     "props": [CHAIR, desk(cups=3, keys=[{"at": 0, "laptop": 1}, {"at": 0.1, "laptop": 0, "dur": 0.15}, {"at": 1.0, "laptop": 1, "dur": 0.5},
                                       C("Rina buru-buru", 0.3, laptop=0, dur=0.25)])],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.08}, C("Yoga lewat", x=1150, y=520, zoom=1.0, dur=2), C("Itu data vendor?", x=1150, y=540, zoom=1.12, dur=1.5),
             C("Satu kesempatan", on="rina", fit=0.25, sx=840, dur=2.5)],
     "sfx": [{"at": 0.1, "type": "thud", "vol": 0.7}, C("Rina buru-buru", 0.4, type="thud", vol=0.5)],
     "fx": [{"type": "neckphones", "who": "yoga"},
            {"type": "card", "cue": "Satu kesempatan", "d": 0.2, "style": "small", "text": "Satu kesempatan minta tolong… lewat.", "x": 1380, "y": 210, "size": 50, "out": C("Dan setiap pagi", -0.3)}]},
    {"cue": "Dan setiap pagi", "d": -0.15, "trans": "flash", "locOpt": {"time": "pagi", "clock": "08:10"},
     "actors": [rina_sit(eyebags=1, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("jawabannya tetap sama", 0.3, pose="pointUp", item="thumb", expr="happy", look=[-1, -0.6])]),
                {"who": "ratna", "x": 2150, "y": 930, "layer": "back", "face": -1, "size": 560, "keys": [{"at": 0, "x": 1260, "dur": 1.5}, C("saat Bu Ratna bertanya", pose="talk", expr="happy")]}],
     "props": [CHAIR, desk(cups=6)],
     "cam": [{"x": 1080, "y": 520, "zoom": 1.08}, C("jawabannya tetap", x=1000, y=540, zoom=1.18, dur=1.5)],
     "fx": [cap(420, 150, "SETIAP PAGI", col="#F6C343", at=0.2)]},
  ]})

# 8 ------------------------------------------------------------------ Laporan Sinta
A.append({"n": 8, "name": "Laporan Sinta di grup proyek", "loc": "kerja", "music": "sad", "trans": "fade",
  "locOpt": {"time": "siang", "clock": "10:02"},
  "shots": [
    {"at": 0, "actors": [rina_sit(eyebags=0.8, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}])], "props": [CHAIR, desk(cups=4)],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.08}, {"at": 0.2, "on": "rina", "fit": 0.22, "sx": 800, "dur": 3}], "fx": [cap(1500, 170, "MINGGU KEDUA", col="#F6C343", at=0.3)]},
    insert("Pendek saja", -0.2, {"type": "projectChat", "msgAt": 0.2, "replyAt": C("sudah saya mintakan", -0.2), "typeAt": C("Rina menatap", 0.3), "delAt": C("Lalu ia menutupnya", -0.1), "clock": "10:04"}),
    {"cue": "Ia tidak mau", "d": -0.2, "trans": "cut",
     "actors": [rina_sit(eyebags=0.8, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}])],
     "props": [CHAIR, desk(cups=4, keys=[{"at": 0, "laptop": 1}, {"at": 0.2, "laptop": 0, "dur": 0.4}])],
     "cam": [{"on": "rina", "fit": 0.26, "sx": 860}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 900, "dur": 3}]},
  ]})

# 9 ------------------------------------------------------------------ Telepon Dimas (layar terbelah)
A.append({"n": 9, "name": "Telepon Dimas (pantry | kampus)", "loc": "pantry", "music": "sad", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "12:40"},
  "lines": [{"who": "dimas", "from": "Kak, batas", "to": "ya.", "text": "Kak, batas bayar kuliahnya minggu depan, ya.", "label": "Dimas"},
            {"who": "rina", "from": "Aman, Dim", "to": "Aman, Dim", "text": "Aman, Dim.", "min": 1.8}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 820, "face": 1, "eyebags": 0.8, "item": "cup", "keys": [{"at": 0, "pose": "hold", "expr": "sad", "look": [1, 0.4]}, C("menelepon", item="phoneBuzz", pose="phone", expr="shock", emote="!")]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.0}, {"at": 0.2, "on": "rina", "fit": 0.2, "sx": 760, "dur": 4}],
     "sfx": [C("menelepon", type="buzz", vol=0.8, dur=1.4)]},
    {"cue": "Kak, batas", "d": -0.3, "trans": "whip", "split": [
        {"loc": "pantry", "locOpt": {"time": "siang", "clock": "12:41"},
         "actors": [{"who": "rina", "x": 900, "face": 1, "eyebags": 0.8, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "scared"}, C("Rina tersenyum", expr="laugh", look="cam"), C("Dua kata yang sama", expr="sad", look="down")]}],
         "cam": [{"x": 900, "y": 540, "zoom": 1.25}]},
        {"loc": "kampus", "locOpt": {"time": "siang", "boardX": 1460},
         "actors": [{"who": "dimas", "x": 1060, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "happy"}, C("Aman, Dim", expr="laugh")]}],
         "cam": [{"x": 1240, "y": 520, "zoom": 1.05}]}],
     "fx": [{"type": "nameTag", "cue": "Kak, batas", "d": 0.2, "name": "Dimas", "role": "Adik Rina · mahasiswa", "x": 1010, "y": 800, "out": C("Rina tersenyum")}]},
    {"cue": "Setelah panggilan", "d": -0.1, "trans": "cut",
     "actors": [{"who": "rina", "x": 820, "face": 1, "eyebags": 0.8, "keys": [{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}, C("mengetuk meja", pose="point"), C("Tekanan itu", pose="sad", expr="sad"), C("Proyek ini", expr="scared", look="cam")]}],
     "cam": [{"on": "rina", "fit": 0.22, "sx": 820}, {"at": 0, "on": "rina", "fit": 0.28, "sx": 900, "dur": 6}],
     "fx": [{"type": "taps", "x": 1010, "y": 650, "word": "tok", "times": [C("mengetuk meja", 0.3), C("mengetuk meja", 0.65)]},
            {"type": "card", "cue": "Proyek ini", "d": 0.1, "style": "small", "text": "Proyek ini tidak boleh gagal.", "x": 1380, "y": 210, "size": 52}]},
  ]})

# 10 ----------------------------------------------------------------- Kembali ke Kamis 16.30 (titik tegang)
A.append({"n": 10, "name": "Kembali ke Kamis 16.30", "loc": "kerja", "music": "tense", "musicCut": 2.2, "trans": "whip", "post": 0.4, "hold": 1.6,
  "locOpt": {"time": "sore", "clock": "16:31"},
  "actors": [rina_sit(eyebags=0.9, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [-1, -0.4]}, C("Rina membuka", pose="talk", expr="sad"), C("Tepat saat itu", pose="sit", expr="shock", look=[1, -0.3]), C("Jangan sampai", expr="scared", look="cam")]),
             {"who": "ratna", "x": 470, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("Tepat saat itu", look=[1, 0], expr="neutral", face=1), C("Jangan sampai", expr="scared")]},
             {"who": "hendra", "x": 2300, "face": -1, "size": 600, "keys": [C("Tepat saat itu", -0.2, x=1700, dur=1.2), C("Ratna, besok", pose="point", expr="happy"), C("Jangan sampai", pose="pointUp", expr="neutral")]}],
  "props": [CHAIR, desk(cups=6, photo=False), {"type": "deskCal", "x": 1295, "y": 765, "day": "29", "sub": "JUMAT", "ring": True}],
  "lines": [{"who": "rina", "from": "Bu, sebenarnya", "to": "Bu, sebenarnya", "text": "Bu, sebenarnya…", "min": 1.6},
            {"who": "hendra", "from": "Ratna, besok", "to": "yang kurang.", "text": "Besok pagi direksi mau lihat sistemnya langsung!", "label": "Pak Hendra", "side": -0.4}],
  "shots": [
    {"at": 0, "cam": [{"x": 820, "y": 520, "zoom": 1.25}, {"at": 0.3, "x": 760, "y": 540, "zoom": 1.32, "dur": 3}], "fx": [cap(1520, 160, "KAMIS · 16.31", at=0.2, out=3.2)]},
    {"cue": "Rina membuka", "d": -0.1, "trans": "cut", "cam": [{"on": "rina", "fit": 0.27, "sx": 1000}, {"at": 0, "on": "rina", "fit": 0.31, "sx": 1000, "dur": 2}]},
    {"cue": "Tepat saat itu", "d": 0.2, "trans": "whip", "cam": [{"x": 1250, "y": 520, "zoom": 1.0}, C("Ratna, besok", x=1350, y=500, zoom=1.12, dur=2)]},
    {"cue": "Jangan sampai", "d": -0.1, "trans": "cut", "cam": [{"on": "rina", "fit": 0.3, "sx": 960, "shake": 8}]},
    {"cue": "yang kurang", "d": -0.2, "trans": "cut", "cam": [{"on": "ratna", "fit": 0.3, "sx": 960, "shake": 6}]},
    {"cue": "yang kurang", "d": 0.5, "trans": "cut", "cam": [{"on": "hendra", "fit": 0.28, "sx": 960}, {"at": 0, "on": "hendra", "fit": 0.32, "sx": 960, "dur": 1}]},
    {"atE": 1.7, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 11 ----------------------------------------------------------------- Pengakuan (kejutan tengah)
A.append({"n": 11, "name": "Pengakuan", "loc": "kerja", "music": "sad", "trans": "fade", "pre": 0.8,
  "locOpt": {"time": "sore", "clock": "16:32"},
  "lines": [{"who": "rina", "from": "Datanya belum", "to": "sama sekali, Bu.", "text": "Datanya belum masuk sama sekali, Bu."},
            {"who": "ratna", "from": "Saya bisa bantu", "to": "bilang sekarang?", "text": "Saya bisa bantu dari minggu lalu, Rin. Kenapa baru bilang sekarang?", "label": "Bu Ratna", "maxW": 700}],
  "shots": [
    {"at": 0, "actors": [rina_sit(eyebags=0.9, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [1, -0.2]}, C("Rina memutar", look=[-1, -0.4])]),
                         {"who": "ratna", "x": 470, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}, {"at": 1.0, "look": None}]},
                         {"who": "hendra", "x": 1700, "face": 1, "size": 600, "keys": [{"at": 0.2, "x": 2500, "dur": 2.4}]}],
     "props": [CHAIR, desk(cups=6)],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.0}, {"at": 0.8, "x": 760, "y": 540, "zoom": 1.2, "dur": 2.5}]},
    insert("Folder kosong", -0.4, {"type": "laptop", "mode": "folder", "clock": "16:32"}, trans="cut"),
    {"cue": "Datanya belum", "d": -0.1, "trans": "cut",
     "actors": [rina_sit(eyebags=0.9, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, -0.4]}, C("Ia menunduk", look="down", expr="sad", emote="sweat")]),
                {"who": "ratna", "x": 470, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "shock"}, C("Tapi Bu Ratna", expr="neutral"), C("mengambil ponselnya", pose="phone", item="phone", look=[-1, -0.4])]}],
     "props": [CHAIR, desk(cups=6)],
     "cam": [{"x": 700, "y": 540, "zoom": 1.25}, C("Ia menunduk", on="rina", fit=0.25, sx=1000, dur=2), C("Tapi Bu Ratna", on="ratna", fit=0.24, sx=760, dur=1.4)],
     "fx": [{"type": "nameTag", "cue": "direktur vendor", "name": "Pak Darmawan", "role": "Direktur vendor · rekan lama Bu Ratna", "x": 1060, "y": 160, "out": C("Sepuluh menit", -0.2)}]},
    insert("Sepuluh menit kemudian", -0.2, {"type": "clockClose", "time": "16:42", "sub": "10 menit kemudian", "x": 760}, trans="flash"),
    insert("sebuah pesan masuk", -0.1, {"type": "phone2", "scale": 1.08, "chat": "Pak Darmawan", "chatSub": "Direktur vendor", "chatCol": "#6B7280", "chatCh": "D", "skin": "#E9B892",
            "msgs": [{"at": 0.2, "text": "Bu Ratna, siap. Data lengkap kami kirim malam ini.", "time": "16.42"}], "chip": "DATA DIKIRIM MALAM INI", "chipAt": 0.9, "chipBg": "#3BA36B", "chipCol": "#FFFFFF"}),
    {"cue": "Bu Ratna menatap", "d": -0.1, "trans": "cut",
     "actors": [rina_sit(eyebags=0.9, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, -0.4]}, C("Kenapa baru bilang", expr="sad", look="down"), C("Rina menghela", expr="sad", emote="sweat")]),
                {"who": "ratna", "x": 470, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral"}, C("Saya bisa bantu", pose="talk", expr="sad"), C("Kenapa baru bilang", pose="shrug")]}],
     "props": [CHAIR, desk(cups=6)],
     "cam": [{"x": 700, "y": 520, "zoom": 1.15}, C("Saya bisa bantu", x=680, y=540, zoom=1.25, dur=3), C("Rina menghela", on="rina", fit=0.27, sx=1000, dur=2)],
     "fx": [{"type": "card", "cue": "padahal jalan keluarnya", "d": 0.2, "style": "small", "text": "Jalan keluarnya cuma sejauh satu telepon.", "x": 1380, "y": 210, "size": 46, "out": C("Malam itu", -0.3)}]},
    {"cue": "Malam itu", "d": -0.15, "trans": "fade", "locOpt": {"time": "malam", "empty": True, "clock": "21:30", "lights": 0.6},
     "actors": [rina_sit(eyebags=0.7, keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}, C("memindahkan datanya", 0.8, expr="laugh", look=[-1, -0.6])]),
                {"who": "yoga", "x": 560, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "happy"}, C("memindahkan datanya", 0.8, pose="talk", expr="laugh")]}],
     "props": [CHAIR, desk(cups=2)],
     "cam": [{"x": 900, "y": 540, "zoom": 1.1}, {"at": 0, "x": 860, "y": 540, "zoom": 1.2, "dur": 4}],
     "fx": [{"type": "neckphones", "who": "yoga"}, {"type": "counter", "at": 0.4, "label": "DATA PINDAH", "from": 0, "to": 312, "dur": 2.4, "good": 400, "x": 1520, "y": 200}]},
    {"cue": "Besok paginya", "d": -0.1, "trans": "whip", "loc": "rapat", "locOpt": {"slide": "demo", "clock": "09:00", "backChairs": [], "demoOn": C("menyala tepat", -0.2)},
     "actors": [{"who": "ratna", "x": 1500, "face": -1, "size": 600, "keys": [{"at": 0, "pose": "point", "expr": "neutral"}, C("menyala tepat", pose="pointUp", expr="happy")]},
                {"who": "dir1", "x": 640, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("di depan para", pose="clap", expr="happy")]},
                {"who": "hendra", "x": 950, "size": 560, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("di depan para", 0.2, pose="clap", expr="happy")]},
                {"who": "dir2", "x": 1250, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("di depan para", 0.4, pose="clap", expr="happy")]},
                {"who": "rina", "x": 1760, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "scared", "expr": "scared"}, C("menyala tepat", 0.3, pose="cheer", expr="laugh")]},
                {"who": "yoga", "x": 1960, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "expr": "neutral"}, C("menyala tepat", 0.5, pose="clap", expr="happy")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.0}, {"at": 0, "x": 1040, "y": 530, "zoom": 1.08, "dur": 5}],
     "sfx": [C("di depan para", type="applause", dur=3.5, vol=0.6)],
     "fx": [cap(1660, 150, "JUMAT · 09.00", col="#F6C343", at=0.2)]},
  ]})

# 12 ----------------------------------------------------------------- Ruang kaca: atasan bukan peramal
A.append({"n": 12, "name": "Ruang kaca Bu Ratna", "loc": "kaca", "music": "hope", "trans": "iris",
  "locOpt": {"view": "dalam", "time": "siang", "deskX": 1240},
  "lines": [{"who": "ratna", "from": "Saya tidak kecewa", "to": "telat, Rin.", "text": "Saya tidak kecewa karena datanya telat.", "label": "Bu Ratna", "side": -0.3},
            {"who": "ratna", "from": "Saya kecewa karena", "to": "tidak tahu.", "text": "Saya kecewa karena saya tidak tahu.", "side": -0.3},
            {"who": "ratna", "from": "Tanpa kabar", "to": "menolong.", "text": "Tanpa kabar darimu, saya tidak bisa menolong.", "side": -0.3},
            {"who": "rina", "from": "Tapi Bu, bagaimana", "to": "tidak mampu?", "text": "Bagaimana melapor tanpa terlihat tidak mampu?", "maxW": 620}],
  "shots": [
    {"at": 0, "actors": [{"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580, "eyebags": 0.6, "keys": [{"at": 0, "pose": "sit", "expr": "sad"}, C("Saya tidak kecewa", pose="talk", expr="neutral"), C("Saya kecewa karena", expr="sad")]},
                         {"who": "rina", "x": -260, "face": 1, "item": "cup", "keys": [{"at": 0.1, "x": 700, "dur": 2}, {"at": 2.2, "pose": "hold", "expr": "scared"}, C("Saya tidak kecewa", expr="shock"), C("Saya kecewa karena", expr="sad", look="down")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, C("Saya tidak kecewa", x=1100, y=540, zoom=1.15, dur=2), C("Saya kecewa karena", on="ratna", fit=0.22, sx=1100, dur=1.5)]},
    insert("Ia menggambar", -0.1, {"type": "rescue", "drawAt": 0.2, "drawDur": 2.8, "textAt": C("Atasan bukan peramal", -0.2)}),
    {"cue": "Tanpa kabar", "d": -0.1, "trans": "cut",
     "actors": [{"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580, "eyebags": 0.6, "keys": [{"at": 0, "pose": "talk", "expr": "neutral"}, C("Kamu tahu kenapa", pose="point")]},
                {"who": "rina", "x": 700, "face": 1, "item": "cup", "keys": [{"at": 0, "pose": "hold", "expr": "sad"}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.15}, {"at": 0, "x": 1050, "y": 540, "zoom": 1.22, "dur": 3}]},
    insert("Kamu tahu kenapa", -0.1, [{"type": "projectChat", "msgAt": 0.1, "replyAt": C("Karena ia bilang", -0.4), "clock": "10:04"}, {"type": "flashback"}], trans="flash"),
    {"cue": "Rina mengangguk", "d": -0.15, "trans": "flash",
     "actors": [{"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580, "eyebags": 0.6, "keys": [{"at": 0, "pose": "sit", "expr": "happy"}]},
                {"who": "rina", "x": 700, "face": 1, "item": "cup", "keys": [{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}, {"at": 0.4, "look": None}, {"at": 0.8, "look": "down"}, C("Tapi Bu, bagaimana", pose="talk", expr="confused", look=None, emote="?")]}],
     "cam": [{"x": 900, "y": 540, "zoom": 1.15}, C("Tapi Bu, bagaimana", x=880, y=520, zoom=1.2, dur=2)]},
  ]})

# 13 ----------------------------------------------------------------- Tiga baris
A.append({"n": 13, "name": "Laporan tiga baris", "loc": "kaca", "music": "warm", "trans": "zoom",
  "locOpt": {"view": "dalam", "time": "siang", "deskX": 1240},
  "lines": [{"who": "ratna", "from": "Baris ini", "to": "penting, Rin.", "text": "Baris ini yang paling penting, Rin.", "maxW": 520}],
  "shots": [
    {"at": 0, "blur": 8, "actors": [{"who": "ratna", "x": 300, "size": 600, "face": 1, "item": "marker", "keys": [{"at": 0, "pose": "talk", "expr": "happy", "look": "cam"}, C("Satu: apa", pose="pointUp"), C("Dua: apa", pose="point"), C("Tiga: bantuan", pose="pointUp", expr="proud"),
                    C("Ia melingkari", pose="point", expr="neutral"), C("Kabar buruk yang disampaikan", pose="hips", expr="neutral", look="cam")]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.05, "dur": 14}],
     "fx": [{"type": "steps", "x": 1290, "y": 250, "w": 1060, "out": C("Kabar buruk yang disampaikan", -0.3), "items": [
                {"cue": "Satu: apa", "text": "Sudah selesai: apa?"}, {"cue": "Dua: apa", "text": "Sedang dikerjakan: apa?"}, {"cue": "Tiga: bantuan", "text": "Butuh bantuan: apa?", "bg": "#D9483B"}]},
            {"type": "ring", "cue": "Ia melingkari", "d": 0.1, "x": 1290, "y": 670, "rx": 600, "ry": 120, "dur": 0.8, "out": C("Kabar buruk yang disampaikan", -0.3)},
            {"type": "card", "cue": "Kabar buruk yang disampaikan", "d": 0.1, "text": "Kabar buruk yang disampaikan lebih awal masih bisa diselamatkan.", "size": 68, "maxW": 1200, "y": 440, "out": C("Kabar buruk yang disimpan", -0.3)},
            {"type": "card", "cue": "Kabar buruk yang disimpan", "d": 0.1, "text": "Disimpan sampai hari terakhir? Biasanya tidak.", "size": 68, "maxW": 1200, "y": 440, "bg": "#13223D"}]},
  ]})

# 14 ----------------------------------------------------------------- Pesan pertama + Bayu ikut belajar
A.append({"n": 14, "name": "Laporan pertama, Bayu ikut belajar", "loc": "kerja", "music": "hope", "trans": "iris",
  "locOpt": {"time": "sore", "clock": "16:00"},
  "shots": [
    insert(None, None, {"type": "sticky", "writeAt": 0.4, "circleAt": 2.9}, trans="cut"),
    insert("Tiga ratus", -0.4, {"type": "report", "lineAt": [C("Tiga ratus", -0.1), C("Empat puluh data", -0.1), C("Butuh akses", -0.1)], "sendAt": C("Satu menit kemudian", -0.7), "replyAt": C("Bu Ratna membalas", -0.2), "clock": "16:00"}),
    {"cue": "Bayu mengintip", "d": -0.15, "trans": "whip",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}, {"at": 1.2, "look": [-1, -0.6], "expr": "laugh"}]),
                {"who": "bayu", "x": 2200, "face": -1, "item": "phone", "keys": [{"at": 0, "x": 1500, "dur": 1.0}, {"at": 1.0, "look": [-1, 0.7], "expr": "confused"}, C("Hari itu", pose="phone", expr="happy", face=1, look=None), C("tanpa stiker", expr="proud", emote="sparkle")]}],
     "props": [CHAIR, desk(sticky=1, cups=1)],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.08}, {"at": 0.3, "x": 1250, "y": 520, "zoom": 1.18, "dur": 3}]},
    insert("laporannya di grup", -0.1, {"type": "group", "scale": 1.08, "mode": "tiga", "msgAt": 0.3, "unmuteAt": C("membuka lagi", 0.1), "time": "16.10", "skin": "#E2A77C"}, trans="zoom"),
  ]})
A[-1]["shots"][0].pop("cue"); A[-1]["shots"][0].pop("d"); A[-1]["shots"][0]["at"] = 0

# 15 ----------------------------------------------------------------- Pujian, Bu Ratna lelah, pesan ke Dimas
A.append({"n": 15, "name": "Pujian, lorong, pesan untuk Dimas", "loc": "rapat", "music": "warm", "trans": "fade",
  "locOpt": {"slide": "demo", "clock": "11:00", "backChairs": []},
  "lines": [{"who": "hendra", "from": "Pak Hendra memuji", "to": "semua orang.", "text": "Sistem barunya lancar. Kerja bagus, Ratna!", "label": "Pak Hendra"},
            {"who": "ratna", "from": "mengucapkan terima kasih", "to": "terima kasih", "text": "Terima kasih, Pak.", "min": 1.8}],
  "shots": [
    {"at": 0, "actors": [{"who": "hendra", "x": 900, "face": 1, "size": 600, "keys": [{"at": 0, "pose": "talk", "expr": "laugh"}, C("Bu Ratna tersenyum", pose="clap", expr="happy")]},
                         {"who": "ratna", "x": 1200, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Bu Ratna tersenyum", pose="talk", expr="laugh")]},
                         {"who": "sinta", "x": 1500, "size": 520, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}]},
                         {"who": "bayu", "x": 1730, "size": 520, "face": -1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh"}]},
                         {"who": "rina", "x": 1930, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "clap", "expr": "happy"}, C("Ia tidak menyebut", pose="idle", expr="confused", look=[-1, 0])]}],
     "cam": [{"x": 1100, "y": 500, "zoom": 1.05}, {"at": 0, "x": 1050, "y": 520, "zoom": 1.15, "dur": 6}, C("Ia tidak menyebut", x=1650, y=470, zoom=1.35, dur=1.5)],
     "sfx": [{"at": 0.3, "type": "applause", "dur": 4, "vol": 0.5}]},
    {"cue": "Tapi setelah Pak Hendra", "d": -0.2, "trans": "whip", "loc": "lorong",
     "actors": [{"who": "ratna", "x": 1000, "face": -1, "size": 600, "eyebags": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Tapi setelah Pak Hendra", -0.1, x=420, dur=1.6, expr="neutral"), C("Tapi setelah Pak Hendra", 1.5, face=1, expr="sad"), C("bersandar", pose="facepalm", expr="sad", emote="sweat"), C("Ada sesuatu", pose="think", expr="sad")]},
                {"who": "rina", "x": 1300, "y": 860, "depth": 0.75, "size": 430, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("bersandar", expr="confused", look=[-1, 0]), C("Ada sesuatu", emote="?")]}],
     "cam": [{"x": 900, "y": 540, "zoom": 1.05}, C("bersandar", x=700, y=560, zoom=1.2, dur=3), C("Ada sesuatu", x=950, y=500, zoom=1.1, dur=2)]},
    {"cue": "Malamnya", "d": -0.15, "trans": "fade", "loc": "kos",
     "actors": [{"who": "rina", "x": 720, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral", "look": [0.6, 0.6]}, C("Malamnya", 0.6, expr="happy", look="cam"), C("Malamnya", 1.3, expr="laugh", look=[0.6, 0.6], jump=25), C("Malamnya", 2.1, expr="proud", emote="heart")]}],
     "props": [{"type": "chair16", "x": 700, "y": 1000, "col": "#C2691F"}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.1}, {"at": 0, "x": 820, "y": 540, "zoom": 1.32, "dur": 4}]},
    insert("Uang kuliahmu", -0.6, {"type": "phone2", "scale": 1.08, "night": True, "chat": "Dimas", "chatSub": "online", "chatCol": "#1F4E8C", "chatCh": "D", "skin": "#D9A07A",
            "msgs": [{"cue": "Uang kuliahmu", "d": -0.1, "text": "Uang kuliahmu aman, Dim.", "me": True, "time": "20.15 ✓✓"}, {"cue": "Kali ini", "d": 0.2, "text": "Makasih, Kak! Kakak hebat.", "time": "20.16"}],
            "chip": "KALI INI BENAR AMAN", "chipAt": C("kata aman itu benar", -0.3), "chipBg": "#3BA36B", "chipCol": "#FFFFFF"}),
  ]})

# 16 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 16, "name": "Kartu pelajaran", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": {"time": "siang", "clock": "16:05"},
  "shots": [{"at": 0, "blur": 9, "actors": [{"who": "rina", "x": 300, "size": 600, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: kabar", pose="pointUp"), C("Dua: laporkan", pose="hips", expr="proud"),
                 C("Tiga: jangan", pose="pointUp", expr="laugh", item="thumb", jump=50), C("Tiga: jangan", 2.8, pose="wave", item=None), C("Tiga: jangan", 4.4, pose="hips", expr="proud")]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Jadi, apa", "d": 0.8, "items": [{"cue": "Satu: kabar", "text": "Kabar buruk lebih awal masih bisa diselamatkan"},
            {"cue": "Dua: laporkan", "text": "Laporkan dalam 3 baris, sebelum ditanya"}, {"cue": "Tiga: jangan", "text": "Jangan kosongkan baris ketiga: butuh bantuan apa"}]}]}]})

# 17 ----------------------------------------------------------------- Cuplikan Eps 3 + layar akhir
A.append({"n": 17, "name": "Cuplikan Eps 3 + layar akhir", "loc": "kos", "music": "tense", "trans": "flash", "post": 6.5,
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [0.9, 0]}, {"at": 0.9, "look": "cam", "expr": "proud"}, {"at": 1.7, "look": [0.9, 0.3], "expr": "happy"}, C("berbunyi", item="phoneBuzz", pose="phone", expr="shock", emote="!")]}],
     "props": [{"type": "chair16", "x": 700, "y": 1000, "col": "#C2691F"}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.1}, {"at": 0, "x": 840, "y": 540, "zoom": 1.22, "dur": 4}, C("berbunyi", on="rina", fit=0.22, sx=760, dur=0.5, ease="back", shake=8)],
     "sfx": [C("berbunyi", type="buzz", vol=0.9, dur=1.4)], "fx": [cap(1500, 170, "23.07", col="#F6C343", at=0.3)]},
    insert("Rin, data Toko Makmur", -0.2, {"type": "phone2", "scale": 1.1, "lock": True, "night": True, "time": "23.07", "date": "Jumat, 30 Januari", "notifs": [{"at": 0.2, "text": "Rin, data Toko Makmur sudah dicek?", "when": "23.07"}]}),
    insert("Malam berikutnya, pesan", -0.1, {"type": "phone2", "scale": 1.1, "lock": True, "night": True, "time": "23.15", "date": "Sabtu, 31 Januari", "notifs": [{"at": 0.3, "text": "Rin, sudah dicek?", "when": "23.15"}]}, trans="whip"),
    insert("Dan malam berikutnya lagi", -0.1, {"type": "phone2", "scale": 1.1, "lock": True, "night": True, "time": "23.21", "date": "Minggu, 1 Februari",
            "notifs": [{"at": 0.1, "text": "Rin, sudah dicek?", "when": "23.19"}, {"at": 0.5, "text": "Besok pagi kabari saya ya.", "when": "23.20"}, {"at": 0.9, "text": "Rin?", "when": "23.21"}]}, trans="whip"),
    {"cue": "Mulai minggu itu", "d": -0.1, "trans": "flash", "loc": "kaca", "locOpt": {"view": "dalam", "time": "malam", "deskX": 1240},
     "actors": [{"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580, "eyebags": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "sad"}, C("Mulai minggu itu", 0.6, look=[-0.8, 0.5]), C("Mulai minggu itu", 1.2, look=None, expr="neutral", pose="think"), C("berubah", pose="phone"), C("berubah", expr="angry", look="cam")]}],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.05}, {"at": 0, "x": 1250, "y": 520, "zoom": 1.3, "dur": 5}],
     "grade": {"tint": "rgba(20,16,50,.28)"},
     "fx": [{"type": "card", "cue": "berubah", "d": 0.1, "style": "small", "text": "Bu Ratna berubah?", "x": 520, "y": 220, "size": 56}]},
    {"cue": "Saksikan kelanjutannya", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis"), "nextQuote": "\"Rin, sudah dicek?\"", "nextSub": "pukul 23.07", "nextTitle": "Tak Terlihat · Eps 3",
             "nextWho": "ratna", "nextKey": {"pose": "phone", "expr": "neutral"}, "nextThumb": False, "ask": "Kamu tim laporan 3 baris, atau tim stiker kucing? Tulis di komentar!"}]},
  ]})

ep = {"slug": "kantor-02", "title": "Bilang \"Aman, Bu!\" Padahal Proyeknya Hampir Gagal | Kantor Tangani: Tak Terlihat Eps 2",
      "series": "Kantor Tangani", "story": "Tak Terlihat", "eps": "2/4", "month": "JANUARI", "naskah": "youtube/serial/ep02-naskah.md", "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "H-1"], [4, "Proyek besar"], [8, "Laporan Sinta"], [11, "Pengakuan"], [12, "Atasan bukan peramal"], [14, "Hasilnya"], [17, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah & hasil", 5, 7], ["Episode berikutnya", 7, 8]],
      "lessons": ["Kabar buruk yang disampaikan lebih awal masih bisa diselamatkan.", "Laporkan progres dalam 3 baris: selesai, sedang, butuh bantuan.", "Jangan kosongkan baris ketiga: bantuan apa yang kamu butuhkan."],
      "youtube": {
        "desc": "Dua minggu Rina selalu menjawab \"Aman, Bu!\". Padahal folder data vendor masih kosong, dan besok pagi sistem baru harus menyala di depan direksi. Apa yang terjadi kalau masalah disimpan sampai H-1? Ikuti episode kedua Kantor Tangani: Tak Terlihat.",
        "ask": "Kamu tim yang melapor tiga baris, atau tim stiker kucing? Tulis di kolom komentar.",
        "next": "Tak Terlihat Eps 3 tayang berikutnya.",
        "tags": "kantor tangani, tak terlihat, cerita kantor, animasi kantor, laporan kerja, komunikasi dengan atasan, minta bantuan, laporan progres, dunia kerja, Tangani Talenta",
        "adAfter": 10},
      "thumb": {"kind": "aman", "lines": ["\"AMAN,", "BU!\""], "hl": "PADAHAL…", "badge": "EPS 2/4"},
      "extras": extras, "adegan": A}
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A))
