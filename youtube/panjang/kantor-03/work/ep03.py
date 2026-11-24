#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-03 (Tak Terlihat Eps 3: "Bu Radar")."""
import json
OUT = "/var/www/tangani_talenta/tangani_talenta_video/youtube/panjang/kantor-03/episode.json"

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
def first(shot):
    shot.pop("cue", None); shot.pop("d", None); shot["at"] = 0; return shot

extras = {
    "dewi": {"nama": "Dewi (rekan tim)", "look": {"hair": "hijab", "hijab": "#3E7D4F", "shirt": "#F3D9B5", "pants": "#3B2418", "skin": "e", "idcard": "#C2691F"}},
    "fajar": {"nama": "Fajar (rekan tim)", "look": {"hair": "short", "hairColor": "#2B1A12", "shirt": "#9FC6D0", "pants": "#2C2433", "skin": "a", "idcard": "#2F6F73"}},
    "ayu": {"nama": "Mbak Ayu (HR)", "look": {"hair": "hijab", "hijab": "#9B7BC4", "shirt": "#FFFDF8", "jacket": "#2F6F73", "pants": "#2C2433", "skin": "b", "idcard": "#C2691F"}},
}
RATNA_DESK = {"who": "ratna", "x": 1330, "y": 950, "layer": "back", "face": -1, "size": 580}
def ratna_desk(**kw):
    o = dict(RATNA_DESK); o.update(kw); return o

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 2)
REC = {"type": "recap"}
A.append({"n": 1, "name": "Sebelumnya (kilas Eps 2)", "loc": "kerja", "music": "sad", "pre": 0.5, "post": 0.6, "trans": "cut",
  "locOpt": {"time": "sore", "clock": "16:30"},
  "shots": [
    {"at": 0, "actors": [rina_sit(eyebags=0.8, keys=[{"at": 0, "pose": "pointUp", "item": "thumb", "expr": "laugh", "look": [-1, -0.6], "emote": "sweat"}]),
                         {"who": "ratna", "x": 470, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}]}],
     "props": [CHAIR, desk(cups=5, photo=False)],
     "cam": [{"x": 760, "y": 520, "zoom": 1.15}, {"at": 0, "x": 820, "y": 540, "zoom": 1.28, "dur": 4}],
     "fx": [REC, cap(1450, 200, "\"AMAN, BU!\"", col="#F6C343", at=0.5)]},
    insert("sampai sehari", -0.2, [{"type": "laptop", "mode": "folder", "clock": "16:30"}, REC], trans="whip"),
    {"cue": "Bu Ratna menyelamatkannya", "d": -0.2, "trans": "whip",
     "actors": [{"who": "ratna", "x": 820, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral"}, {"at": 1.2, "expr": "happy"}]}],
     "cam": [{"on": "ratna", "fit": 0.24, "sx": 760}, {"at": 0, "on": "ratna", "fit": 0.27, "sx": 760, "dur": 3}],
     "fx": [REC]},
    insert("laporan tiga baris", -0.4, [{"type": "sticky", "writeAt": 0, "circleAt": 1.2}, REC], trans="whip"),
    {"cue": "Tapi sejak hari itu", "d": -0.15, "trans": "flash", "loc": "lorong",
     "actors": [{"who": "ratna", "x": 700, "face": 1, "size": 600, "eyebags": 1, "keys": [{"at": 0, "pose": "facepalm", "expr": "sad", "emote": "sweat"}, C("ada yang berubah", pose="think", expr="sad")]}],
     "cam": [{"x": 760, "y": 560, "zoom": 1.15}, {"at": 0, "x": 720, "y": 540, "zoom": 1.32, "dur": 4}],
     "fx": [REC, card("ada yang berubah", "Ada yang berubah…", x=1350)]},
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: kamar kos 23.30
A.append({"n": 2, "name": "Kamar kos, 23.30", "loc": "kos", "music": "night", "trans": "flash", "pre": 0.6,
  "fx": [{"type": "month", "at": 0.4, "hold": 4.0, "day": "3", "text": "FEBRUARI"}],
  "props": [KCHAIR],
  "lines": [{"who": "rina", "from": "Apa salahku", "to": "Apa salahku", "text": "Apa salahku?", "kind": "think", "min": 2.0}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 720, "face": 1, "item": "bowl", "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [0.4, 0.6]}, {"at": 1.4, "expr": "laugh", "look": "cam"}, {"at": 2.4, "expr": "happy", "look": [0.4, 0.6]},
                    C("ketika ponselnya", item="phoneBuzz", pose="phone", expr="shock", emote="!", look=[0.6, 0.3])]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 820, "y": 540, "zoom": 1.25, "dur": 5}, C("ketika ponselnya", on="rina", fit=0.22, sx=760, dur=0.5, ease="back", shake=8)],
     "sfx": [C("ketika ponselnya", type="buzz", vol=0.9, dur=1.2)],
     "fx": [cap(1500, 170, "23.30", col="#F6C343", at=0.3)]},
    insert("Sekali", -0.2, {"type": "phone2", "scale": 1.1, "lock": True, "night": True, "time": "23.30", "date": "Selasa, 3 Februari",
            "notifs": [{"cue": "Sekali", "d": 0.1, "text": "Rin, sudah dicek?", "when": "23.30"}, {"cue": "Dua kali", "d": 0.1, "text": "Rin?", "when": "23.30"}, {"cue": "Tiga kali", "d": 0.1, "text": "Tolong kabari.", "when": "23.31"}],
            "chip": "SEMUA DARI BU RATNA", "chipAt": C("Semuanya dari"), "chipBg": "#6E2430", "chipCol": "#FFFFFF"}),
    insert("Di grup kantor", -0.2, {"type": "radarChat", "imgAt": C("Bayu mengirim", 0.3), "delAt": C("buru-buru menghapusnya", 0.2)}, trans="whip"),
    {"cue": "Atasan yang dulu hangat", "d": -0.15, "trans": "whip", "loc": "kaca", "locOpt": {"view": "dalam", "time": "malam", "deskX": 1240},
     "actors": [ratna_desk(eyebags=0.9, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [-0.8, 0.5]}, {"at": 1.4, "expr": "scared"}])],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1250, "y": 520, "zoom": 1.3, "dur": 4}],
     "grade": {"tint": "rgba(20,16,50,.28)"},
     "fx": [cap(520, 170, "23.31 · MASIH MENGECEK", bg="#6E2430", at=0.3)]},
    {"cue": "Rina menatap langit-langit", "d": -0.1, "trans": "fade",
     "actors": [{"who": "rina", "x": 720, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": [0.2, -1]}, C("Apa salahku", expr="confused", emote="?")]}],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 760}, {"at": 0, "on": "rina", "fit": 0.3, "sx": 820, "dur": 4}]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "TAK TERLIHAT · EPS 3/4",
     "hook": "Atasan Kirim Chat Jam 11 Malam Terus. Ternyata Ini Sebabnya", "day": "2", "month": "FEBRUARI", "marker": "MINGGU \"BU RADAR\"", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Minggu "Bu Radar"
A.append({"n": 4, "name": "Minggu Bu Radar", "loc": "kerja", "music": "tense", "trans": "iris",
  "locOpt": {"time": "siang", "clock": "10:40"},
  "lines": [{"who": "ratna", "from": "namanya dipanggil", "to": "dipanggil lagi", "d0": -0.3, "text": "Yoga!", "kind": "shout", "min": 1.4}],
  "shots": [
    {"at": 0, "actors": [rina_sit(eyebags=0.5, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, C("Ia berdiri di belakang", 0.6, expr="scared", emote="sweat", look=[-1, -0.4]), C("membaca balasan", look=[1, 0.3], expr="scared")]),
                         {"who": "ratna", "x": -300, "face": 1, "item": "notebook", "keys": [{"at": 0.1, "x": 560, "dur": 1.6}, C("Ia berdiri di belakang", pose="hips", expr="neutral", look=[1, 0.4]), C("membaca balasan", pose="point", look=[1, 0.4])]}],
     "props": [CHAIR, desk(cups=2)],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, C("Bu Radar", x=860, y=520, zoom=1.18, dur=1), C("Ia berdiri di belakang", x=760, y=520, zoom=1.26, dur=2.5)],
     "fx": [{"type": "card", "cue": "Bu Radar", "d": 0.05, "text": "\"BU RADAR\"", "size": 96, "y": 230, "x": 1380, "out": C("Ia berdiri di belakang", -0.2)},
            cap(1450, 220, "MEMBACA SEBELUM DIKIRIM", bg="#6E2430", cue="membaca balasan", out=C("Namanya muncul", -0.3))]},
    insert("Namanya muncul", -0.2, {"type": "ccMail", "startAt": 0.3, "per": 0.32}, trans="whip"),
    insert("Ia menanyakan kabar", -0.2, {"type": "updateDay", "times": [C("jam sembilan"), C("jam satu"), C("jam empat")]}, trans="whip"),
    {"cue": "Bahkan tabel", "d": -0.15, "trans": "whip", "loc": "yoga", "locOpt": {"time": "sore", "clock": "13:20"},
     "actors": [{"who": "yoga", "x": 560, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, -0.3]}, C("ia cek ulang", expr="confused", emote="?", face=1, look=[1, 0])]},
                {"who": "ratna", "x": 260, "face": 1, "keys": [{"at": 0, "pose": "point", "expr": "neutral", "look": [1, 0.2]}, C("ia cek ulang", pose="think"), C("tangkapan layar", pose="talk", look=[1, -0.3])]}],
     "cam": [{"x": 760, "y": 520, "zoom": 1.08}, {"at": 0, "x": 720, "y": 520, "zoom": 1.15, "dur": 4}],
     "fx": [{"type": "neckphones", "who": "yoga"}, cap(1520, 150, "SUDAH DICEK YOGA ✓", bg="#3BA36B", at=0.2, out=C("ia cek ulang", -0.1)), cap(1520, 150, "DICEK ULANG", bg="#D9483B", cue="ia cek ulang"),
            cap(520, 160, "+ KIRIM TANGKAPAN LAYAR", bg="#6E2430", cue="tangkapan layar", d=0.2)]},
    {"cue": "Yoga, yang biasanya", "d": -0.1, "trans": "cut", "loc": "yoga", "locOpt": {"time": "sore", "clock": "13:24"},
     "actors": [{"who": "yoga", "x": 640, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0.2]}, C("dari leher ke telinga", pose="hips", expr="neutral"), C("namanya dipanggil", expr="proud", pose="idle")]},
                {"who": "ratna", "x": 120, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral"}, C("namanya dipanggil", -0.3, pose="point", expr="neutral")]}],
     "cam": [{"on": "yoga", "fit": 0.24, "sx": 1000}, C("namanya dipanggil", -0.4, x=560, y=500, zoom=1.08, dur=0.8)],
     "fx": [{"type": "headphones", "who": "yoga", "onAt": C("dari leher ke telinga", 0.2)}]},
    insert("Dan malam harinya", -0.15, {"type": "phone2", "scale": 1.1, "lock": True, "night": True, "time": "22.48", "date": "Rabu, 4 Februari",
            "notifs": [{"at": 0.2, "text": "Rin, tiket Apotek Sehat sudah?", "when": "22.41"}, {"at": 0.6, "text": "Tolong kirim tangkapan layarnya.", "when": "22.44"}, {"at": 1.0, "text": "Rin?", "when": "22.48"}]}, trans="fade"),
  ]})

# 5 ------------------------------------------------------------------ Pantry, gerutuan tim
A.append({"n": 5, "name": "Pantry, Bayu memeragakan Bu Ratna", "loc": "pantry", "music": "light", "trans": "whip",
  "locOpt": {"time": "siang", "clock": "12:20"},
  "lines": [{"who": "bayu", "from": "Sabar aja", "to": "Galak", "text": "Sabar aja, Rin. Atasan memang begitu. Galak.", "label": "Bayu", "maxW": 640},
            {"who": "rina", "from": "Pikirannya penuh", "to": "kesalahannya kemarin", "text": "Ini pasti karena kesalahanku kemarin…", "kind": "think", "maxW": 600}],
  "shots": [
    {"at": 0, "actors": [
        {"who": "bayu", "x": 1060, "face": 1, "keys": [{"at": 0, "pose": "hips", "expr": "neutral"}, {"at": 1.2, "pose": "point", "expr": "angry", "look": [1, 0]}, C("Semua tertawa", pose="hips", expr="proud"), C("Sabar aja", pose="talk", expr="happy", face=-1)]},
        {"who": "nisa", "x": 1430, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Semua tertawa", pose="clap", expr="laugh")]},
        {"who": "dodi", "x": 1700, "face": -1, "item": "cup", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}, C("Semua tertawa", 0.2, expr="laugh", jump=20)]},
        {"who": "rina", "x": 640, "face": 1, "item": "cup", "eyebags": 0.6, "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("kecuali Rina", expr="sad", look="down")]}],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.05}, {"at": 0.3, "on": "bayu", "fit": 0.24, "sx": 960, "dur": 2.5}, C("Semua tertawa", x=1150, y=520, zoom=1.02, dur=1.2), C("kecuali Rina", on="rina", fit=0.26, sx=700, dur=1.2), C("Sabar aja", x=850, y=520, zoom=1.15, dur=1.5)],
     "sfx": [C("Semua tertawa", type="cheer", vol=0.35, dur=1.6)],
     "fx": [{"type": "capGlasses", "who": "bayu", "onAt": 0.6}, cap(1480, 160, "KACAMATA TUTUP BOTOL", bg="#2F6F73", at=1.0, out=C("Semua tertawa"))]},
    insert("Ponsel Bayu", -0.2, {"type": "phone2", "scale": 1.0, "lock": True, "time": "12.21", "date": "Rabu, 4 Februari", "skin": "#A86E48",
            "notifs": [{"cue": "Sebuah pengingat", "d": -0.2, "title": "PayNanti", "col": "#D9483B", "ch": "P", "text": "Pengingat: tagihan jatuh tempo 3 hari lagi.", "when": "12.21"}],
            "chip": "PONSEL BAYU", "chipAt": 0.2, "chipBg": "#E8A55B", "chipCol": "#FFFFFF"}, trans="cut"),
    {"cue": "Bayu menggesernya", "d": -0.1, "trans": "cut",
     "actors": [{"who": "bayu", "x": 1060, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "scared", "look": "down"}, C("lalu tertawa lagi", pose="cheer", item=None, expr="laugh")]},
                {"who": "rina", "x": 640, "face": 1, "item": "cup", "eyebags": 0.6, "keys": [{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}]}],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 1000}, C("lalu tertawa", x=900, y=520, zoom=1.12, dur=1)],
     "fx": [{"type": "capGlasses", "who": "bayu"}]},
    {"cue": "Rina tidak memperhatikan", "d": -0.1, "trans": "cut",
     "actors": [{"who": "rina", "x": 640, "face": 1, "item": "cup", "eyebags": 0.6, "keys": [{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}, C("Ia sedang dihukum", expr="scared", look="cam")]}],
     "cam": [{"on": "rina", "fit": 0.2, "sx": 560, "sy": 640}, {"at": 0, "on": "rina", "fit": 0.23, "sx": 620, "sy": 640, "dur": 6}],
     "fx": [card("Ia sedang dihukum", "\"Aku sedang dihukum.\"", x=1350, y=820, size=56)]},
  ]})

# 6 ------------------------------------------------------------------ Rina menghindar (cara keliru)
A.append({"n": 6, "name": "Rina menghindar", "loc": "kerja", "music": "sad", "trans": "fade",
  "locOpt": {"time": "siang", "clock": "14:05"},
  "shots": [
    {"at": 0, "actors": [rina_sit(eyebags=0.6, keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, {"at": 1.0, "look": [-1, -0.2], "expr": "shock"}, C("menghindar", pose="scared", expr="scared", look=[-1, -0.2])]),
                         {"who": "ratna", "x": 2150, "y": 930, "layer": "back", "face": -1, "size": 560, "item": "notebook", "keys": [{"at": 0, "x": 1450, "dur": 1.8}, C("menghindar", pose="idle", look=[-1, 0.3])]}],
     "props": [CHAIR, desk(cups=2, keys=[{"at": 0, "laptop": 1}, C("menghindar", laptop=1)])],
     "cam": [{"x": 1080, "y": 520, "zoom": 1.05}, C("menghindar", on="rina", fit=0.26, sx=880, dur=0.6, ease="back")],
     "fx": [card("menghindar", "MENGHINDAR", d=0.1, x=520, y=200, size=64)]},
    insert("Pesan Bu Ratna", -0.2, {"type": "phone2", "scale": 1.06, "chat": "Bu Ratna", "chatSub": "online", "chatCol": "#6E2430", "chatCh": "R", "skin": "#D9A07A",
            "msgs": [{"at": 0.1, "text": "Rin, keluhan Toko Makmur sudah dibalas? Tolong jelaskan langkahnya.", "time": "14.10"}, {"cue": "Ok", "d": -0.2, "text": "Ok.", "me": True, "time": "15.42 ✓✓"},
                     {"cue": "Ok", "d": 0.3, "text": "Tiket Apotek Sehat bagaimana?", "time": "15.43"}, {"cue": "Sudah", "d": -0.2, "text": "Sdh.", "me": True, "time": "17.05 ✓✓"}],
            "chip": "MAKIN LAMBAT, MAKIN PENDEK", "chipAt": C("makin pendek"), "chipBg": "#5E5A62", "chipCol": "#FFFFFF"}, trans="whip"),
    {"cue": "Ia bahkan datang", "d": -0.15, "trans": "whip", "loc": "lorong",
     "actors": [{"who": "rina", "x": 200, "face": 1, "item": "bag", "keys": [{"at": 0, "x": 760, "dur": 2.2, "expr": "neutral"}, C("berpapasan", -0.3, expr="shock", emote="!", face=-1), C("berpapasan", 0.1, x=-400, dur=1.4, expr="scared")]},
                {"who": "ratna", "x": 2300, "face": -1, "keys": [C("pulang lebih malam", x=1500, dur=2.4), C("berpapasan", 0.3, pose="idle", expr="confused", emote="?")]}],
     "cam": [{"x": 900, "y": 540, "zoom": 1.05}, {"at": 0, "x": 960, "y": 540, "zoom": 1.08, "dur": 5}],
     "fx": [cap(420, 150, "07.05 · DATANG PALING PAGI", col="#F6C343", at=0.2, out=C("pulang lebih malam", -0.1)), cap(420, 150, "20.30 · PULANG PALING MALAM", col="#F6C343", cue="pulang lebih malam")]},
    {"cue": "Sinta memperhatikannya", "d": -0.15, "trans": "whip",
     "actors": [rina_sit(eyebags=0.7, keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": [1, 0.3]}]),
                {"who": "sinta", "x": 1650, "y": 930, "layer": "back", "face": -1, "size": 520, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.2]}, {"at": 1.0, "pose": "think", "expr": "confused"}]}],
     "props": [CHAIR, desk(cups=3)],
     "cam": [{"x": 1250, "y": 520, "zoom": 1.15}, {"at": 0, "x": 1100, "y": 520, "zoom": 1.05, "dur": 3}]},
    insert("Malamnya ia tidur gelisah", -0.15, {"type": "sleepBed", "expr": "sad", "clock": "01.40", "chip": "01.40 · BELUM TIDUR", "chipAt": 0.3}, trans="fade"),
    insert("paginya ia salah", -0.15, {"type": "wrongSend", "sendAt": 0.9, "errAt": C("klien yang keliru", 0.1), "fixAt": C("Dan anehnya", -0.5)}, trans="flash"),
    {"cue": "Dan anehnya", "d": -0.1, "trans": "whip",
     "actors": [rina_sit(eyebags=0.9, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [-1, -0.4], "emote": "sweat"}]),
                {"who": "ratna", "x": 2100, "face": -1, "item": "notebook", "keys": [{"at": 0, "x": 1500, "dur": 0.9}, {"at": 0.9, "pose": "hips", "expr": "neutral"}]}],
     "props": [CHAIR, desk(cups=4)],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.08}],
     "fx": [cap(420, 150, "KE MEJA RINA: 4× HARI INI", bg="#6E2430", at=0.4)]},
    insert("makin sering Bu Ratna", -0.4, {"type": "cycle", "per": 0.65, "spinAt": C("Lingkaran itu")}, trans="zoom", hold=1.2),
  ]})

# 7 ------------------------------------------------------------------ Data dari Yoga
A.append({"n": 7, "name": "Data dari Yoga", "loc": "yoga", "music": "hope", "trans": "iris",
  "locOpt": {"time": "sore", "clock": "16:40"},
  "lines": [{"who": "yoga", "from": "Bukan cuma kamu", "to": "Semua kena", "text": "Bukan cuma kamu, Rin. Semua kena.", "label": "Yoga"},
            {"who": "rina", "from": "Kalau ini bukan", "to": "pada Bu Ratna", "text": "Lalu… Bu Ratna kenapa?", "kind": "think"}],
  "shots": [
    {"at": 0, "actors": [{"who": "yoga", "x": 640, "face": -1, "keys": [{"at": 0, "pose": "wave", "expr": "neutral", "look": [-1, 0]}, {"at": 1.4, "pose": "idle"}, C("ia memutar layar", pose="point", expr="neutral", face=1)]},
                         {"who": "rina", "x": -300, "face": 1, "keys": [{"at": 0.3, "x": 330, "dur": 2.0, "expr": "confused"}, C("ia memutar layar", look=[1, -0.3])]}],
     "cam": [{"x": 820, "y": 520, "zoom": 1.03}, {"at": 0.4, "x": 700, "y": 520, "zoom": 1.12, "dur": 4}],
     "fx": [{"type": "neckphones", "who": "yoga"}]},
    insert("Grafik jumlah pesan", -0.2, {"type": "msgChart", "drawAt": 0.4, "drawDur": 3.6, "markAt": C("hari demo sistem baru", -0.1), "legendAt": C("hari demo sistem baru", 1.0), "hlAt": C("Semua kena", 0.2)}, trans="zoom"),
    {"cue": "Bukan cuma kamu", "d": -0.2, "trans": "cut",
     "actors": [{"who": "yoga", "x": 640, "face": -1, "keys": [{"at": 0, "pose": "talk", "expr": "neutral", "look": [-1, -0.1]}, C("Rina menatap", pose="idle", face=1, look=[1, 0])]},
                {"who": "rina", "x": 330, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "shock", "look": [1, -0.1]}, C("Rina menatap", pose="think", expr="confused", look=[1, 0.4]), C("Kalau ini bukan", emote="?")]}],
     "cam": [{"x": 620, "y": 520, "zoom": 1.18}, C("Rina menatap", on="rina", fit=0.21, sx=760, dur=2)],
     "fx": [{"type": "neckphones", "who": "yoga"}]},
  ]})

# 8 ------------------------------------------------------------------ Malam yang hampir meledak
A.append({"n": 8, "name": "Pesan yang hampir terkirim", "loc": "kos", "music": "night", "trans": "fade",
  "props": [KCHAIR],
  "lines": [{"who": "rina", "from": "Besok, pikirnya", "to": "bicara langsung", "text": "Besok aku bicara langsung.", "kind": "think"}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 720, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "laugh", "look": [1, -0.1]}, {"at": 2.0, "expr": "happy"}, C("pesan itu datang", item="phoneBuzz", expr="shock", emote="!", look=[0.4, 0.6])]}],
     "cam": [{"x": 950, "y": 520, "zoom": 1.08}, {"at": 0, "x": 920, "y": 520, "zoom": 1.16, "dur": 5}, C("pesan itu datang", on="rina", fit=0.22, sx=760, dur=0.5, ease="back", shake=8)],
     "sfx": [C("pesan itu datang", type="buzz", vol=0.9, dur=1.2)],
     "fx": [{"type": "videoCall", "talkFrom": 0.2, "talkTo": 5.5, "expr": "laugh"}, cap(1500, 160, "KAMIS · 23.40", col="#F6C343", at=0.3)]},
    insert("Rin, laporan besok", -0.3, {"type": "phoneDraft", "msgAt": 0.2, "typeAt": C("Jarinya mengetik", 0.1), "holdAt": C("Jarinya berhenti"), "cps": 20}),
    {"cue": "Ia membayangkan", "d": -0.15, "trans": "flash", "loc": "kaca", "locOpt": {"view": "dalam", "time": "malam", "deskX": 1240},
     "actors": [ratna_desk(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral"}, {"at": 0.9, "expr": "shock", "emote": "!"}, {"at": 1.8, "pose": "hips", "expr": "angry"}])],
     "cam": [{"x": 1250, "y": 520, "zoom": 1.25}, {"at": 0, "x": 1300, "y": 500, "zoom": 1.4, "dur": 3}],
     "grade": {"tint": "rgba(120,20,40,.28)"}, "fx": [cap(560, 160, "BAYANGAN RINA", bg="#5E5A62", at=0.2)]},
    {"cue": "Lalu wajahnya sendiri", "d": -0.15, "trans": "whip", "loc": "kaca", "locOpt": {"view": "dalam", "time": "pagi", "deskX": 1240},
     "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "angry"}, {"at": 0.8, "pose": "point", "expr": "angry"}]),
                {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "scared", "look": "down", "emote": "sweat"}]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.1}, {"at": 0, "on": "rina", "fit": 0.26, "sx": 900, "dur": 3}],
     "grade": {"tint": "rgba(120,20,40,.28)"}, "fx": [cap(560, 160, "BESOK PAGI?", bg="#5E5A62", at=0.2)]},
    insert("Ia menghapus semuanya", -0.2, {"type": "phoneDraft", "msgAt": -6, "typeAt": -12, "holdAt": -1.5, "delAt": 0.4, "delCps": 22}, trans="flash"),
    {"cue": "Besok, pikirnya", "d": -0.15, "trans": "cut",
     "actors": [{"who": "rina", "x": 720, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, {"at": 0.8, "expr": "neutral", "look": "cam"}, C("bicara langsung", pose="hips", item=None, expr="proud", emote="!!")]}],
     "cam": [{"on": "rina", "fit": 0.2, "sx": 760, "sy": 640}, {"at": 0, "on": "rina", "fit": 0.24, "sx": 820, "sy": 640, "dur": 4}]},
  ]})

# 9 ------------------------------------------------------------------ Di depan pintu kaca (titik tegang)
LUAR = {"view": "luar", "time": "pagi", "deskX": 1530, "bandY": 800}
A.append({"n": 9, "name": "Di depan pintu kaca", "loc": "kaca", "music": "tense", "musicCut": 2.2, "trans": "whip", "post": 0.4, "hold": 1.6,
  "locOpt": LUAR,
  "actors": [ratna_desk(x=1580, keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [-1, -0.3]}, C("Siapa yang memegang", expr="shock")]),
             {"who": "hendra", "x": 1180, "y": 950, "layer": "back", "face": 1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, C("Proyek data", pose="point", expr="angry"), C("Kalau terulang", pose="pointUp"), C("Siapa yang memegang", pose="point", expr="angry")]},
             {"who": "rina", "x": -250, "face": 1, "keys": [{"at": 0.1, "x": 420, "dur": 2.2, "expr": "proud"}, C("Tangannya sudah", pose="pointUp", expr="neutral"), C("Suaranya keras", pose="shock", expr="shock", emote="!"),
                 C("Suaranya keras", 0.6, x=740, dur=0.9, pose="scared", expr="scared"), C("Siapa yang memegang", pose="scared", expr="scared", emote="sweat")]}],
  "props": [{"type": "bigPlant", "x": 960, "y": 1010, "layer": "front", "size": 0.55, "rustle": C("Suaranya keras", 1.0)}],
  "lines": [{"who": "hendra", "from": "Proyek data", "to": "gagal, Ratna", "text": "Proyek data kemarin hampir gagal, Ratna.", "label": "Pak Hendra"},
            {"who": "hendra", "from": "Direksi bertanya", "to": "harus menjawab", "text": "Kalau terulang, saya yang harus menjawab!"},
            {"who": "hendra", "from": "Siapa yang memegang", "to": "data vendor", "text": "Siapa yang memegang bagian data vendor?", "maxW": 620}],
  "shots": [
    {"at": 0, "cam": [{"x": 820, "y": 540, "zoom": 1.0}, {"at": 0.3, "x": 640, "y": 540, "zoom": 1.15, "dur": 2.5}], "fx": [cap(1520, 160, "JUMAT · 08.10", at=0.2, out=3.2)]},
    {"cue": "ketika ia mendengar", "d": -0.1, "trans": "cut", "cam": [{"x": 1150, "y": 520, "zoom": 1.15}, {"at": 0, "x": 1150, "y": 500, "zoom": 1.22, "dur": 3}]},
    {"cue": "Hening sejenak", "d": -0.1, "trans": "cut", "cam": [{"on": "rina", "fit": 0.27, "sx": 960}, {"at": 0, "on": "rina", "fit": 0.32, "sx": 960, "dur": 3}]},
    {"cue": "Siapa yang memegang", "d": -0.2, "trans": "cut", "cam": [{"on": "hendra", "fit": 0.28, "sx": 960, "shake": 6}]},
    {"cue": "data vendor", "d": 0.5, "trans": "cut", "cam": [{"on": "rina", "fit": 0.33, "sx": 960}, {"at": 0, "on": "rina", "fit": 0.38, "sx": 960, "dur": 1.2}]},
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 10 ----------------------------------------------------------------- Bu Ratna menanggungnya (kejutan tengah)
A.append({"n": 10, "name": "Itu tanggung jawab saya", "loc": "kaca", "music": "sad", "trans": "fade", "pre": 0.8,
  "locOpt": LUAR,
  "lines": [{"who": "ratna", "from": "Itu tanggung jawab", "to": "kurang memantau", "text": "Itu tanggung jawab saya, Pak. Saya yang kurang memantau.", "label": "Bu Ratna", "maxW": 640}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(x=1580, keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, {"at": 0.4, "pose": "idle", "expr": "neutral", "look": [-1, 0]}, C("Ia tidak menyebut", pose="sit", expr="sad", look="down")]),
                         {"who": "hendra", "x": 1180, "y": 950, "layer": "back", "face": 1, "size": 600, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, C("kurang memantau", expr="neutral"), C("Ia tidak menyebut", 0.2, x=2600, dur=2.6, face=1)]},
                         {"who": "rina", "x": 740, "face": 1, "keys": [{"at": 0, "pose": "scared", "expr": "scared", "look": [1, -0.2]}, C("Itu tanggung jawab", expr="shock", emote="!"), C("Ia menanggung", pose="sad", expr="sad")]}],
     "props": [{"type": "bigPlant", "x": 960, "y": 1010, "layer": "front", "size": 0.55}],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.15}, C("Ia tidak menyebut", on="rina", fit=0.27, sx=960, dur=2)],
     "fx": [card("Ia tidak menyebut", "Ia tidak menyebut nama Rina.", d=0.2, x=560, y=190)]},
    {"cue": "Rina mundur pelan", "d": -0.15, "trans": "whip", "loc": "kerja", "locOpt": {"time": "pagi", "clock": "08:16"},
     "actors": [{"who": "rina", "x": 2100, "face": -1, "keys": [{"at": 0, "x": 850, "dur": 2.0, "expr": "sad", "look": "down"}, {"at": 2.0, "pose": "sit", "face": 1}]}],
     "props": [CHAIR, desk(cups=1)],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.05}, {"at": 1.0, "on": "rina", "fit": 0.24, "sx": 900, "dur": 2}]},
    {"cue": "Ia teringat", "d": -0.15, "trans": "flash", "loc": "lorong",
     "actors": [{"who": "ratna", "x": 700, "face": 1, "size": 600, "eyebags": 1, "keys": [{"at": 0, "pose": "idle", "expr": "sad"}, {"at": 0.5, "pose": "facepalm", "expr": "sad", "emote": "sweat"}]}],
     "cam": [{"x": 760, "y": 560, "zoom": 1.15}, {"at": 0, "x": 720, "y": 540, "zoom": 1.3, "dur": 4}], "fx": [{"type": "flashback"}, cap(1480, 160, "SETELAH DEMO", bg="#5E5A62", at=0.3)]},
    {"cue": "Sejak hari itu", "d": -0.15, "trans": "fade", "loc": "kaca", "locOpt": {"view": "dalam", "time": "malam", "deskX": 1240},
     "actors": [ratna_desk(eyebags=1, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "sad"}, {"cue": "memikul", "pose": "think", "expr": "sad", "item": None}, {"cue": "tidak pernah ia", "pose": "facepalm", "expr": "sad", "emote": "sweat"}])],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.05}, {"cue": "Sejak hari itu", "x": 1250, "y": 520, "zoom": 1.3, "dur": 7}], "grade": {"tint": "rgba(20,16,50,.25)"}},
    {"cue": "Tiba-tiba semuanya", "d": -0.1, "trans": "cut", "loc": "kerja", "locOpt": {"time": "pagi", "clock": "08:18"},
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "sad", "look": "down"}, {"at": 0.5, "expr": "shock", "emote": "idea", "look": "cam"}])],
     "props": [CHAIR, desk(cups=1)],
     "cam": [{"on": "rina", "fit": 0.25, "sx": 900}, {"at": 0.4, "on": "rina", "fit": 0.3, "sx": 900, "dur": 0.6, "ease": "back"}]},
    insert("Pesan tengah malam itu", -0.2, {"type": "phone2", "scale": 1.08, "night": True, "chat": "Rina", "chatSub": "terakhir dilihat 23.02", "chatCol": "#D9483B", "chatCh": "R", "skin": "#C98B62",
            "msgs": [{"at": 0.0, "text": "Rin, data Toko Makmur sudah dicek?", "me": True, "time": "23.07 ✓✓"}, {"at": 0.25, "text": "Rin, sudah dicek?", "me": True, "time": "23.15 ✓✓"},
                     {"at": 0.5, "text": "Besok pagi kabari saya ya.", "me": True, "time": "23.20 ✓✓"}, {"at": 0.75, "text": "Rin, laporan besok jam berapa?", "me": True, "time": "23.40 ✓✓"}],
            "chip": "BUKAN HUKUMAN", "chipAt": C("bukan hukuman"), "chipBg": "#3BA36B", "chipCol": "#FFFFFF"}, trans="zoom"),
    {"cue": "Bu Ratna sedang takut", "d": -0.15, "trans": "flash", "loc": "kaca", "locOpt": {"view": "dalam", "time": "malam", "deskX": 1240},
     "actors": [ratna_desk(eyebags=1, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared"}, C("takut ditanya", pose="scared", expr="scared", emote="sweat")])],
     "cam": [{"on": "ratna", "fit": 0.24, "sx": 1100}, {"at": 0, "on": "ratna", "fit": 0.3, "sx": 1150, "dur": 5}], "grade": {"tint": "rgba(20,16,50,.25)"},
     "fx": [card("Takut kecolongan", "Takut kecolongan lagi.", x=560, y=200, out=C("takut ditanya", -0.2)), card("takut ditanya", "Takut ditanya tanpa tahu jawabannya.", x=560, y=200, size=44)]},
    {"cue": "Atasan yang terlihat galak", "d": -0.15, "trans": "zoom", "loc": "kaca", "locOpt": {"view": "dalam", "time": "sore", "deskX": 1240}, "blur": 8,
     "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "sad"}])],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.05}],
     "fx": [{"type": "card", "cue": "Atasan yang terlihat galak", "d": 0.1, "text": "Atasan yang terlihat galak, sering kali hanya kekurangan informasi.", "size": 66, "maxW": 1250, "y": 440}]},
  ]})

# 11 ----------------------------------------------------------------- Kabari lebih dulu
RLINES = [["Selesai", "48 tiket dibalas, 2 klien baru aktif.", "#3BA36B"], ["Sedang", "cek data ganda Mart 8, beres besok.", "#C2691F"], ["Butuh", "contoh templat keluhan struk.", "#D9483B"]]
RLINES2 = [["Selesai", "51 tiket dibalas.", "#3BA36B"], ["Sedang", "Toko Berkah mengeluh 2×. Saya telepon besok jam 10.", "#C2691F"], ["Butuh", "izin kirim teknisi ke Toko Berkah.", "#D9483B"]]
A.append({"n": 11, "name": "Kabari lebih dulu", "loc": "kerja", "music": "hope", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "08:02"},
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": -200, "face": 1, "item": "bag", "keys": [{"at": 0, "x": 850, "dur": 1.8, "expr": "proud"}, {"at": 1.8, "pose": "sit", "item": None, "expr": "proud", "emote": "!!"}]}],
     "props": [CHAIR, desk(cups=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0.8, "on": "rina", "fit": 0.24, "sx": 860, "dur": 2}],
     "fx": [cap(1500, 160, "SENIN", col="#F6C343", at=0.2)]},
    insert("Ia memasang alarm", -0.2, {"type": "alarm", "onAt": C("pukul empat sore", 0.2), "time": "16.00", "label": "LAPORAN 3 BARIS"}),
    insert("Setiap hari, sebelum", -0.15, {"type": "alarm", "ringAt": 0, "time": "16.00", "label": "LAPORAN 3 BARIS"}, trans="whip"),
    insert("ia mengirim tiga baris", -0.3, {"type": "report", "lines": RLINES, "lineAt": [C("yang sudah selesai", -0.1), C("yang sedang dikerjakan", -0.1), C("dan bantuan", -0.1)], "sendAt": C("Setiap Jumat", -0.7), "clock": "16:00"}, trans="zoom"),
    {"cue": "Setiap Jumat", "d": -0.1, "trans": "whip", "locOpt": {"time": "sore", "clock": "16:30"},
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}])],
     "props": [CHAIR, desk(cups=1, sticky=1)],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1050, "y": 520, "zoom": 1.18, "dur": 3}],
     "fx": [cap(420, 150, "JUMAT · RINGKASAN MINGGUAN", col="#F6C343", at=0.2)]},
    insert("Hari Rabu", -0.2, [{"type": "report", "lines": RLINES2, "lineAt": [0.1, 0.4, 0.7], "per": 0.3, "sendAt": C("Bu Ratna hanya membalas", -0.6), "replyAt": C("oke, terima kasih", -0.2),
            "reply": ["Oke, terima kasih", "sudah mengabari."], "replyChip": "TANPA DITANYA", "sentTime": "16.00 ✓✓", "clock": "16:00"},
            {"type": "ring", "cue": "di baris kedua", "d": -0.2, "x": 1020, "y": 672, "rx": 640, "ry": 70, "dur": 0.8, "out": C("Bu Ratna hanya membalas", -0.6)}], trans="whip"),
    insert("Hari pertama", -0.3, {"type": "nightCount", "times": [C("Hari pertama", 0.6), C("Hari kedua", 0.2), C("Hari ketiga", 0.2), C("Hari keempat", 0.3)]}, trans="fade", hold=0.6),
  ]})

# 12 ----------------------------------------------------------------- Percakapan sepuluh menit
A.append({"n": 12, "name": "Percakapan sepuluh menit", "loc": "kaca", "music": "warm", "trans": "iris",
  "locOpt": {"view": "dalam", "time": "siang", "deskX": 1240},
  "lines": [{"who": "rina", "from": "Terima kasih sudah", "to": "Pak Hendra, Bu", "text": "Terima kasih sudah menanggung kesalahan saya, Bu.", "maxW": 600},
            {"who": "ratna", "from": "Kamu dengar", "to": "Kamu dengar", "text": "Kamu dengar, ya?", "label": "Bu Ratna", "side": -0.3, "min": 1.6},
            {"who": "ratna", "from": "Saya juga takut", "to": "takut, Rin", "text": "Saya juga takut, Rin.", "side": -0.3, "min": 1.6},
            {"who": "ratna", "from": "Setiap kali tidak", "to": "bertanya lagi", "text": "Tiap tidak ada kabar, saya membayangkan yang terburuk.", "side": -0.3, "d0": 0.45, "maxW": 820, "size": 42},
            {"who": "ratna", "from": "Usul yang bagus", "to": "dengan tim", "text": "Usul yang bagus. Kita sepakati dengan tim.", "side": -0.3, "maxW": 820, "size": 42}],
  "shots": [
    {"at": 0, "actors": [ratna_desk(keys=[{"at": 0, "pose": "sit", "expr": "neutral"}, C("Terima kasih sudah", expr="shock", look=[-1, 0])]),
                         {"who": "rina", "x": -260, "face": 1, "keys": [{"at": 0.1, "x": 700, "dur": 1.8}, {"at": 2.0, "pose": "talk", "expr": "neutral"}, C("Terima kasih sudah", pose="idle", expr="happy")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, C("Terima kasih sudah", x=1000, y=520, zoom=1.15, dur=2)],
     "fx": [{"type": "taps", "x": 1060, "y": 690, "word": "tok", "sound": "knock", "times": [{"at": 1.9}, {"at": 2.2}]}, cap(1520, 160, "KAMIS · 10 MENIT", at=0.3, out=4)]},
    {"cue": "Bu Ratna melepas", "d": -0.1, "trans": "cut",
     "actors": [ratna_desk(look={"glasses": False}, item="glasses", keys=[{"at": 0, "pose": "hold", "expr": "shock"}, C("Kamu dengar", pose="talk", expr="neutral"), C("Ia tersenyum lelah", pose="hold", expr="happy"), C("Saya juga takut", pose="talk", expr="sad"),
                    C("Jadi saya bertanya", pose="shrug", expr="sad")]),
                {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Saya juga takut", expr="shock"), C("Jadi saya bertanya", expr="sad")]}],
     "cam": [{"on": "ratna", "fit": 0.24, "sx": 1100}, C("Saya juga takut", on="ratna", fit=0.28, sx=1150, dur=1.0), C("Setiap kali tidak", -0.5, x=1000, y=520, zoom=1.15, dur=0.9)]},
    insert("Bu, bagaimana kalau", -0.2, {"type": "boardWrite", "title": "Usul Rina", "skin": "#B5774F", "lines": [
        {"text": "Setelah 20.00 →", "at": C("jam delapan malam", -0.2)}, {"text": "hanya [DARURAT]", "at": C("hanya untuk yang darurat", -0.1), "col": "#D9483B", "box": True},
        {"text": "Sisanya: laporan 16.00", "at": C("Sisanya saya laporkan", -0.1), "col": "#2F6F73", "size": 62}]}, trans="whip"),
    {"cue": "Bu Ratna menatap", "d": -0.15, "trans": "cut",
     "actors": [ratna_desk(look={"glasses": False}, keys=[{"at": 0, "pose": "think", "expr": "neutral", "look": [1, -0.6]}, C("Usul yang bagus", pose="pointUp", expr="laugh", look=None)]),
                {"who": "rina", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "scared"}, C("Usul yang bagus", 0.6, pose="cheer", expr="laugh", emote="sparkle")]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 520, "zoom": 1.12, "dur": 4}]},
  ]})

# 13 ----------------------------------------------------------------- Kesepakatan tim
A.append({"n": 13, "name": "Kesepakatan tim", "loc": "rapat", "music": "light", "trans": "whip",
  "locOpt": {"slide": "aturan", "clock": "13:00", "backChairs": [800, 1110], "aturan1": C("Grup kerja aktif"), "aturan2": C("Di luar itu")},
  "lines": [{"who": "sinta", "from": "setiap pesan darurat", "to": "dan kapan", "text": "Pesan darurat wajib sebut: butuh apa, kapan.", "label": "Sinta", "maxW": 620},
            {"who": "bayu", "from": "Kalau stiker kucing", "to": "Kalau stiker kucing", "text": "Kalau stiker kucing, Bu?", "label": "Bayu", "min": 1.8}],
  "actors": [
    {"who": "ratna", "x": 1790, "face": -1, "size": 600, "item": "marker", "keys": [{"at": 0, "pose": "talk", "expr": "happy"}, C("Grup kerja aktif", pose="point"), C("Sinta menambahkan", pose="idle", look=[-1, 0.2]),
        C("Bayu mengangkat", expr="confused"), C("Untuk pertama kalinya", pose="clap", expr="laugh", jump=20)]},
    {"who": "sinta", "x": 640, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("Sinta menambahkan", pose="pointUp", expr="happy"), C("Bu Ratna langsung", pose="sit"), C("Untuk pertama kalinya", expr="laugh")]},
    {"who": "bayu", "x": 940, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "happy"}, C("Bayu mengangkat", pose="pointUp", expr="laugh"), C("Untuk pertama kalinya", 0.3, pose="cheer", expr="laugh")]},
    {"who": "yoga", "x": 1240, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit"}, C("Untuk pertama kalinya", 0.2, pose="clap", expr="laugh")]},
    {"who": "rina", "x": 1530, "z": 3, "size": 540, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "happy"}, C("Untuk pertama kalinya", 0.1, pose="clap", expr="laugh")]},
    {"who": "dewi", "x": 800, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "sit"}, C("Untuk pertama kalinya", 0.4, expr="laugh")]},
    {"who": "fajar", "x": 1110, "y": 880, "depth": 0.8, "size": 470, "face": -1, "keys": [{"at": 0, "pose": "sit"}, C("Untuk pertama kalinya", 0.4, expr="laugh")]}],
  "shots": [
    {"at": 0, "cam": [{"x": 1000, "y": 520, "zoom": 1.0}, {"at": 0.3, "x": 760, "y": 400, "zoom": 1.22, "dur": 3.5}]},
    {"cue": "Sinta menambahkan", "d": -0.15, "trans": "cut", "cam": [{"on": "sinta", "fit": 0.24, "sx": 800}, {"at": 0, "on": "sinta", "fit": 0.27, "sx": 800, "dur": 3}]},
    insert("Bu Ratna langsung", -0.2, {"type": "rulePoster", "slapAt": 0.1, "line3At": 0.6}, trans="whip"),
    {"cue": "Bayu mengangkat", "d": -0.15, "trans": "whip", "cam": [{"on": "bayu", "fit": 0.24, "sx": 1100}, {"at": 0, "on": "bayu", "fit": 0.27, "sx": 1100, "dur": 2}],
     "fx": [{"type": "catPop", "cue": "Kalau stiker kucing", "d": 0.3, "x": 1500, "y": 330, "out": C("Untuk pertama kalinya", -0.2)}]},
    {"cue": "Untuk pertama kalinya", "d": -0.15, "trans": "cut", "cam": [{"on": "ratna", "fit": 0.24, "sx": 1100}, {"at": 0.6, "x": 1150, "y": 500, "zoom": 1.02, "dur": 2.5}],
     "sfx": [C("Untuk pertama kalinya", 0.3, type="cheer", vol=0.4, dur=2)]},
    {"cue": "Dan julukan", "d": -0.15, "trans": "whip", "loc": "pantry", "locOpt": {"time": "siang", "clock": "12:30"},
     "actors": [{"who": "bayu", "x": 1000, "face": 1, "item": "cup", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}]},
                {"who": "nisa", "x": 1350, "face": -1, "keys": [{"at": 0, "pose": "talk", "expr": "laugh"}]}],
     "cam": [{"x": 1150, "y": 520, "zoom": 1.08}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.15, "dur": 4}],
     "fx": [{"type": "strikeChip", "cue": "Dan julukan", "d": 0.2, "text": "\"BU RADAR\"", "x": 1450, "y": 220, "strikeAt": C("pelan-pelan hilang", -0.3), "fadeAt": C("dari pantry", 0.2)}]},
  ]})

# 14 ----------------------------------------------------------------- Malam yang tenang, pagi yang baru
A.append({"n": 14, "name": "Malam yang tenang, pagi yang baru", "loc": "kerja", "music": "warm", "trans": "fade",
  "locOpt": {"time": "pagi", "clock": "08:05"},
  "lines": [{"who": "ratna", "from": "Ini lebih berat", "to": "kemarin, Rin", "text": "Ini lebih berat dari yang kemarin, Rin.", "label": "Bu Ratna"},
            {"who": "ratna", "from": "Tapi saya percaya", "to": "mengabari saya", "text": "Tapi saya percaya kamu akan mengabari saya.", "maxW": 620}],
  "shots": [
    insert(None, None, {"type": "sleepBed", "clock": "23.00", "chip": "0 PESAN MALAM", "chipAt": 1.2}, trans="cut"),
    {"cue": "Di kamar kos lain", "d": -0.15, "trans": "fade", "loc": "kos", "locOpt": {"desk": False},
     "actors": [{"who": "bayu", "x": 900, "face": 1, "item": "phoneBuzz", "keys": [{"at": 0, "pose": "phone", "expr": "scared", "look": [0.6, 0.4]}, C("Bukan karena", expr="sad", emote="sweat")]}],
     "props": [{"type": "chair16", "x": 880, "y": 1000, "col": "#2F6F73"}],
     "cam": [{"on": "bayu", "fit": 0.22, "sx": 900}, {"at": 0, "on": "bayu", "fit": 0.27, "sx": 960, "dur": 3}], "grade": {"tint": "rgba(20,16,50,.32)"},
     "fx": [cap(1500, 170, "KAMAR BAYU · 23.10", col="#F6C343", at=0.2)]},
    insert("Bukan karena", -0.1, {"type": "phone2", "scale": 1.08, "lock": True, "night": True, "time": "23.10", "date": "Jumat, 13 Februari", "skin": "#A86E48",
            "notifs": [{"at": 0.15, "title": "PayNanti", "col": "#D9483B", "ch": "P", "text": "Tagihan jatuh tempo BESOK. Denda berlaku.", "when": "23.10"}]}, trans="cut"),
    {"cue": "Pagi harinya", "d": -0.15, "trans": "whip",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.3]}, C("meletakkan sebuah map", 0.4, look=[-1, -0.4], expr="shock")]),
                {"who": "ratna", "x": -300, "face": 1, "item": "folder", "keys": [{"at": 0, "x": 520, "dur": 1.6}, C("meletakkan sebuah map", pose="hold", expr="happy")]}],
     "props": [CHAIR, desk(cups=1)],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, C("meletakkan sebuah map", x=800, y=520, zoom=1.18, dur=1.5)]},
    insert("berisi daftar klien", -0.5, {"type": "folderDesk", "dropAt": 0.5}, trans="cut"),
    {"cue": "Ini lebih berat", "d": -0.15, "trans": "cut",
     "actors": [rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "shock", "look": [-1, -0.5]}, C("Tapi saya percaya", expr="happy"), C("Atasan yang galak", pose="sit", expr="proud", emote="heart", look=[-1, -0.2])]),
                {"who": "ratna", "x": 520, "face": 1, "keys": [{"at": 0, "pose": "talk", "expr": "neutral"}, C("Tapi saya percaya", pose="pointUp", expr="happy"), C("Atasan yang galak", -0.2, face=-1, x=-400, dur=2.4, pose="idle", expr="happy")]}],
     "props": [CHAIR, desk(cups=1, papers=True)],
     "cam": [{"x": 720, "y": 520, "zoom": 1.2}, C("Tapi saya percaya", x=720, y=520, zoom=1.28, dur=2), C("Atasan yang galak", on="rina", fit=0.25, sx=960, dur=2)],
     "fx": [card("menjadi atasan yang paling", "Galak → paling mendukung.", d=0.2, x=1380, y=200)]},
  ]})
A[-1]["shots"][0] = first(A[-1]["shots"][0])

# 15 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 15, "name": "Kartu pelajaran", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": {"time": "siang", "clock": "16:05"},
  "shots": [{"at": 0, "blur": 9, "actors": [{"who": "rina", "x": 300, "size": 600, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: atasan", pose="pointUp"), C("Dua: kabari", pose="hips", expr="proud"),
                 C("Tiga: batas", pose="pointUp", expr="laugh", item="thumb", jump=50), C("Tiga: batas", 2.8, pose="wave", item=None), C("Tiga: batas", 4.4, pose="hips", expr="proud")]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 14}],
     "fx": [{"type": "lesson", "cue": "Jadi, apa", "d": 0.8, "items": [{"cue": "Satu: atasan", "text": "Atasan galak sering hanya kurang informasi"},
            {"cue": "Dua: kabari", "text": "Kabari lebih dulu, sebelum ditanya"}, {"cue": "Tiga: batas", "text": "Sepakati batas jam kerja: sopan + ada jalan keluarnya"}]}]}]})

# 16 ----------------------------------------------------------------- Cuplikan Eps 4 + layar akhir
A.append({"n": 16, "name": "Cuplikan Eps 4 + layar akhir", "loc": "kerja", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": {"time": "siang", "clock": "10:00"},
  "lines": [{"who": "rina", "from": "Cukup", "to": "Cukup", "d0": 0.5, "d1": 1.2, "text": "Cukup?", "kind": "shout", "min": 1.6}],
  "shots": [
    {"at": 0, "actors": [{"who": "ayu", "x": 2200, "face": -1, "item": "envelopes", "keys": [{"at": 0, "x": 1300, "dur": 1.8}, {"at": 1.9, "pose": "hold", "expr": "neutral"}, C("Rina membukanya", -0.6, pose="idle", expr="neutral")]},
                         rina_sit(keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.3]}, {"at": 1.6, "look": [1, -0.5], "expr": "scared"}, C("penilaian kinerja", item="envelope", expr="scared", emote="sweat")])],
     "props": [CHAIR, desk(cups=1)],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.05}, {"at": 0.5, "x": 1050, "y": 520, "zoom": 1.15, "dur": 3}],
     "fx": [cap(420, 150, "AKHIR FEBRUARI", col="#F6C343", at=0.2), {"type": "nameTag", "at": 1.6, "name": "Mbak Ayu", "role": "HR · Personalia", "x": 1340, "y": 800}]},
    {"cue": "Rina membukanya", "d": -0.15, "trans": "whip", "loc": "toilet",
     "actors": [{"who": "rina", "x": 960, "face": 1, "item": "envelope", "keys": [{"at": 0, "pose": "sit", "expr": "scared", "look": "down"}]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.24, "sx": 960, "dur": 2.5}],
     "fx": [cap(1500, 160, "BILIK TOILET", bg="#5E5A62", at=0.2)]},
    insert("Setelah semua", -0.2, {"type": "envelope", "openAt": 0.3, "stampAt": C("Cukup", -0.1)}, trans="cut"),
    {"cue": "Cukup", "d": 0.35, "trans": "cut", "loc": "toilet",
     "actors": [{"who": "rina", "x": 960, "face": 1, "item": "envelope", "keys": [{"at": 0, "pose": "sit", "expr": "shock", "emote": "!", "look": "cam"}]}],
     "cam": [{"on": "rina", "fit": 0.3, "sx": 960, "shake": 8}, {"at": 0, "on": "rina", "fit": 0.34, "sx": 960, "dur": 1.5}]},
    {"cue": "di Tak Terlihat", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis"), "nextQuote": "\"Cukup?\"", "nextSub": "nilai Rina", "nextTitle": "Tak Terlihat · Eps 4",
             "nextWho": "rina", "nextKey": {"pose": "sad", "expr": "shock"}, "nextThumb": False, "ask": "Jam berapa grup kantormu biasanya mulai sepi? Tulis di komentar!"}]},
  ]})

ep = {"slug": "kantor-03", "title": "Atasan Kirim Chat Jam 11 Malam Terus. Ternyata Ini Sebabnya | Kantor Tangani: Tak Terlihat Eps 3",
      "series": "Kantor Tangani", "story": "Tak Terlihat", "eps": "3/4", "month": "FEBRUARI", "naskah": "youtube/serial/ep03-naskah.md", "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Jam 11 malam"], [4, "Bu Radar"], [7, "Data dari Yoga"], [8, "Pesan yang dihapus"], [9, "Di balik pintu"], [11, "Kabari lebih dulu"], [14, "Hasilnya"], [16, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 4], ["Memburuk", 4, 6], ["Berubah & hasil", 6, 8], ["Episode berikutnya", 8, 9]],
      "lessons": ["Atasan yang terlihat galak sering hanya kekurangan informasi.", "Kabari lebih dulu, sebelum ditanya.", "Batas jam kerja bisa disepakati, asal disampaikan dengan sopan dan disertai jalan keluarnya."],
      "youtube": {
        "desc": "Pesan dari atasan datang jam sebelas malam, tiga kali sehari ditanya \"Update?\", dan namanya muncul di setiap email. Rina yakin ia sedang dihukum. Sampai suatu pagi ia mendengar sesuatu dari balik pintu kaca. Ikuti episode ketiga Kantor Tangani: Tak Terlihat.",
        "ask": "Jam berapa grup kantormu biasanya mulai sepi? Tulis di kolom komentar.",
        "next": "Tak Terlihat Eps 4 (episode terakhir cerita ini) tayang berikutnya.",
        "tags": "kantor tangani, tak terlihat, cerita kantor, animasi kantor, atasan micromanage, chat atasan malam hari, batas jam kerja, komunikasi dengan atasan, laporan progres, dunia kerja, Tangani Talenta",
        "adAfter": 9},
      "thumb": {"kind": "radar", "lines": ["CHAT", "JAM 11"], "hl": "MALAM?!", "badge": "EPS 3/4"},
      "extras": extras, "adegan": A}
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


shot_local(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A))
