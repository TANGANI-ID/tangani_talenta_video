#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kantor-06 (Klien Terbesar Eps 2: "Orang gudang tidak mau membantu").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Bagian split (layar terbelah) tidak diubah shot_local(): kunci di dalamnya memakai cue atau at=0."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kantor-06/episode.json"
NASKAH = "youtube/serial/ep06-naskah.md"

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

LOBI = {"time": "pagi", "deskX": 1100, "deskFront": True, "stairs": 1600, "slamX": -230}
WULAN = lambda **kw: dict({"who": "resepsionis", "x": 1000, "y": 930, "layer": "back", "face": -1, "size": 520}, **kw)
# gudang: pintu besi kiri, rak WIJAYA · TK-12 kosong, meja uji di tengah, papan pengumuman di kanan
G = {"door": -150, "doorOpen": True, "bench": 1100, "board": 1560, "emptyRack": {"x": 300, "w": 520, "label": "WIJAYA · TK-12", "note": False}, "boxes": []}
def g(**kw):
    o = dict(G); o.update(kw); return o
HOLD = {"holdRack": {"x": 640, "w": 640, "box": "WIJAYA · TK-11"}, "boxes": [[1760, 2]]}
SORE = {"tint": "rgba(255,150,60,.10)"}
TOKO = {"time": "pagi", "fill": 0.9, "counterX": 900, "banner": False}
REC = {"type": "recap", "label": "SEBELUMNYA DI KLIEN TERBESAR"}
DODI_LOOK = {"hat": "cap", "hatColor": "#C2691F", "beard": "goatee", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "a", "pencil": True}
WA_MSG = "Pak, kardusnya belum ketemu. Jam 17.00 saya kabari. Cadangan: unit pinjaman dari gudang."
TY_MSG = ("Terima kasih Mas Dodi dan tim gudang. Kardus Toko Wijaya TK-12 ditemukan dan diantar sendiri jam 19.00. "
          "Kesalahan kode alamat dari saya; mulai hari ini keluhan ke gudang pakai format baru.")

extras = {
    "dodi": {"nama": "Dodi (staf gudang & lapangan)", "look": DODI_LOOK},
    "wijaya": {"nama": "Pak Wijaya (klien, 12 toko)", "look": {"hat": "kopiah", "hatColor": "#1E1A18", "mustache": True, "hairColor": "#8A8A8A", "shirt": "#8E4A24", "pants": "#2C2433", "skin": "c"}},
    "resepsionis": {"nama": "Mbak Wulan (resepsionis)", "look": {"hair": "hijab", "hijab": "#C2691F", "shirt": "#FFFDF8", "jacket": "#13223D", "pants": "#2C2433", "skin": "d", "idcard": "#C2691F"}},
    "tini": {"nama": "Bu Tini (pemilik warung)", "look": {"hair": "hijab", "hijab": "#7FA563", "shirt": "#F3D9B5", "jacket": "#B5643C", "pants": "#3B2418", "skin": "b"}},
    "pembeli": {"nama": "Pembeli pertama Toko Wijaya 12", "look": {"hair": "hijab", "hijab": "#9B7BC4", "shirt": "#FFFDF8", "jacket": "#2F6F73", "pants": "#3B2418", "skin": "a"}},
    "eko": {"nama": "Mas Eko (staf gudang)", "look": {"hair": "short", "hairColor": "#1E1410", "hat": "cap", "hatColor": "#3B4A6B", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "c"}},
    "jaka": {"nama": "Mas Jaka (staf gudang)", "look": {"hair": "spiky", "hairColor": "#2B1A12", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "d"}},
}
def staf(who, x, **kw):
    o = {"who": who, "x": x, "y": 940, "layer": "back", "size": 470, "face": 1, "item": "box", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}]}; o.update(kw); return o

A = []

# 1 ------------------------------------------------------------------ SEBELUMNYA (kilas Eps 1)
A.append({"n": 1, "name": "Sebelumnya di Klien Terbesar", "loc": "lobi", "music": "tense", "pre": 0.5, "post": 0.5, "trans": "cut",
  "locOpt": dict(LOBI, slam=1.3),
  "lines": [{"who": "rina", "from": "Hari pertama", "to": "membela diri", "text": "Maaf, Pak. Itu bukan bagian saya.", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [WULAN(x=1080, keys=[{"at": 0, "pose": "idle", "expr": "happy"}, {"at": 1.3, "pose": "scared", "expr": "scared", "emote": "!"}]),
                         {"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry"}, {"at": 1.0, "pose": "point"}, {"at": 1.8, "pose": "shrug", "emote": "anger"}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.08}, {"at": 0, "x": 820, "y": 520, "zoom": 1.2, "dur": 2.5, "shake": 0}, {"at": 1.3, "shake": 12}, C("Rina dipercaya", on="wijaya", fit=0.24, sx=820, dur=1.5)],
     "sfx": [{"at": 1.3, "type": "thud", "vol": 1.0}],
     "fx": [REC, {"type": "nameTag", "cue": "Rina dipercaya", "d": 0.6, "name": "Pak Wijaya", "role": "Klien terbesar · 12 toko", "x": 1180, "y": 800}]},
    {"cue": "Hari pertama", "d": -0.2, "trans": "whip",
     "actors": [{"who": "wijaya", "x": 640, "face": 1, "size": 640, "keys": [{"at": 0, "pose": "hips", "expr": "angry", "emote": "anger"}]},
                {"who": "rina", "x": 1380, "face": -1, "keys": [{"at": 0, "pose": "shrug", "expr": "happy", "emote": "sweat"}]}],
     "cam": [{"x": 1010, "y": 520, "zoom": 1.12}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.2, "dur": 3}],
     "fx": [REC]},
    insert("Hari itu juga", -0.2, [{"type": "stickyMove", "lines": ["DENGAR", "AKUI", "JAM"], "writeAt": -5, "circleAt": 99}, REC], trans="whip"),
    insert("memberi jam pasti", -0.4, [{"type": "chat16", "name": "Pak Wijaya", "sub": "Toko Wijaya", "ch": "W",
            "msgs": [{"t": -5, "me": True, "text": "Pak, unit tipe besar berangkat besok jam 07.00. Teknisi pasang Rabu jam 10.00.", "time": "15.00", "read": -4}, {"t": 0.3, "thumb": True, "time": "15.02"}]}, REC], trans="whip"),
    {"cue": "Tapi besok paginya", "d": -0.2, "trans": "flash", "loc": "gudang", "locOpt": {"emptyRack": {"x": 420, "w": 640, "label": "WIJAYA · TK-12"}, "boxes": [[1600, 2]]},
     "actors": [{"who": "bayu", "x": 1350, "face": -1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "scared", "look": [-1, -0.2], "emote": "sweat"}]}],
     "cam": [{"x": 900, "y": 500, "zoom": 1.0}, {"at": 0, "x": 860, "y": 500, "zoom": 1.1, "dur": 5}],
     "fx": [REC, cap(1400, 300, "KARDUS TOKO KE-12: HILANG", bg="#D9483B", at=0.5)]},
  ]})

# 2 ------------------------------------------------------------------ PEMBUKA DINGIN: gudang, Selasa 07.30
A.append({"n": 2, "name": "Gudang: orang kantor depan", "loc": "gudang", "music": "tense", "trans": "flash", "pre": 0.6,
  "locOpt": g(doorOpen=False, doorAt=0.5),
  "lines": [{"who": "dodi", "from": "Orang kantor depan", "to": "menyalahkan gudang", "text": "Orang kantor depan bisanya nyalahin gudang.", "label": "Dodi", "maxW": 600, "size": 42}],
  "shots": [
    {"at": 0, "actors": [{"who": "dodi", "x": 1100, "y": 960, "layer": "back", "face": -1, "size": 580, "keys": [{"at": 0, "pose": "type", "expr": "neutral", "look": "down"}, C("Orang kantor depan", pose="type", expr="angry", look="down")]},
                         staf("eko", 1900, keys=[{"at": 0, "pose": "hold", "expr": "neutral", "x": 1900}, {"at": 1.0, "x": 1650, "dur": 3.0}]),
                         {"who": "rina", "x": -260, "face": 1, "item": "notebook", "keys": [{"at": 1.4, "x": 520, "dur": 2.4, "expr": "scared"}, {"at": 3.9, "pose": "hold", "expr": "scared"},
                          C("Ia tidak kenal", look=[-1, -0.1]), C("Ia tidak kenal", 1.0, look=[1, -0.1]), C("Di meja uji", look=[1, 0], expr="neutral"), C("Orang kantor depan", 0.4, expr="shock", emote="!")]}],
     "cam": [{"x": 500, "y": 520, "zoom": 1.08}, {"at": 1.5, "x": 760, "y": 520, "zoom": 1.08, "dur": 3}, C("Di meja uji", on="dodi", fit=0.22, sx=1200, dur=1.6), C("Orang kantor depan", x=820, y=520, zoom=1.12, dur=1.2)],
     "sfx": [{"at": 0.5, "type": "whoosh", "vol": 0.6}, {"at": 0.6, "type": "thud", "vol": 0.4}],
     "fx": [cap(1480, 170, "SELASA · 07.30 · GUDANG", col="#F6C343", at=0.4, out=C("Di meja uji", 0)), cap(1480, 170, "PERTAMA KALI DALAM 3 TAHUN", bg="#5E5A62", cue="untuk pertama kalinya", d=0.0, out=C("Di meja uji", 0))]},
    {"cue": "Kalimat pembelaan", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 520, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "talk", "expr": "angry", "look": [1, 0]}, C("Tapi ia ingat", pose="hold", expr="neutral", look="down"),
                 C("ia memilih diam", pose="hold", expr="proud", look=[1, 0])]}],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 700}, {"at": 0, "on": "rina", "fit": 0.28, "sx": 700, "dur": 6}],
     "fx": [{"type": "strikeChip", "cue": "Kalimat pembelaan", "d": 0.4, "text": "\"BUKAN SALAH KAMI!\"", "x": 1380, "y": 220, "strikeAt": C("Tapi ia ingat", 0.2), "fadeAt": C("ia memilih diam", -0.3)},
            card("ia memilih diam", "Kali ini, ia memilih diam.", d=0.0, x=1380, y=220, size=46)]},
  ]})

# 3 ------------------------------------------------------------------ JUDUL
A.append({"n": 3, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "title", "at": 0, "disc": 2.2, "eps": "KLIEN TERBESAR · EPS 2/4",
     "hook": "Orang Gudang Tidak Mau Membantu, Sampai Rina Melakukan Ini", "day": "9", "month": "JUNI", "marker": "JUNI · 2 HARI SEBELUM TOKO BUKA", "markerAt": 2.9}]}]})

# 4 ------------------------------------------------------------------ Kenalan dengan Dodi
A.append({"n": 4, "name": "Kenalan dengan Dodi", "loc": "gudang", "music": "light", "trans": "iris",
  "locOpt": g(),
  "lines": [{"who": "dodi", "from": "Printer yang mana", "to": "Alamatnya di mana", "text": "Printer yang mana? Toko yang mana?", "label": "Dodi", "maxW": 560, "size": 42},
            {"who": "dodi", "from": "Kalau tebakan saya", "to": "gudang yang disalahkan", "text": "Salah tebak, gudang yang disalahkan.", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [{"who": "dodi", "x": 1100, "y": 960, "layer": "back", "face": -1, "size": 580, "keys": [{"at": 0, "pose": "type", "expr": "neutral", "look": "down"}, {"at": 0.6, "pose": "hips", "expr": "neutral", "look": [-1, 0]},
                          C("Sembilan tahun bekerja", pose="cross", expr="proud")]},
                         {"who": "rina", "x": 520, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0]}]}],
     "cam": [{"x": 820, "y": 520, "zoom": 1.1}, {"at": 0, "on": "dodi", "fit": 0.22, "sx": 1150, "dur": 2.5}],
     "fx": [{"type": "nameTag", "cue": "Namanya Dodi", "d": 0.2, "name": "Dodi", "role": "Gudang · 9 tahun", "x": 110, "y": 800, "out": C("Ia menunjuk papan", 0)}]},
    {"cue": "Ia menunjuk papan", "d": -0.2, "trans": "cut",
     "actors": [{"who": "dodi", "x": 1300, "face": 1, "size": 580, "keys": [{"at": 0, "pose": "point", "expr": "neutral", "look": [1, -0.3]}, {"at": 1.6, "pose": "talk", "face": -1, "look": [-1, 0]}]},
                {"who": "rina", "x": 700, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, -0.3]}]}],
     "cam": [{"x": 1250, "y": 480, "zoom": 1.06}, {"at": 0, "x": 1300, "y": 460, "zoom": 1.14, "dur": 5}],
     "fx": [cap(560, 170, "CETAKAN PESAN DARI TIM CS", bg="#5E5A62", at=0.4)]},
    insert("Lihat ini, Mbak", -0.2, {"type": "messyBoard", "pullAt": C("Tulisannya", 0.1), "qs": [C("Printer yang mana", -0.1), C("Toko yang mana", -0.1), C("Alamatnya di mana", -0.1)]}, trans="zoom"),
    {"cue": "Tiap hari saya", "d": -0.2, "trans": "cut",
     "actors": [{"who": "dodi", "x": 1250, "face": -1, "size": 580, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "angry", "look": [-1, 0]}, C("Kalau tebakan saya", pose="shrug", expr="angry")]},
                {"who": "rina", "x": 700, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "scared"}]}],
     "cam": [{"x": 980, "y": 520, "zoom": 1.12}, {"at": 0, "on": "dodi", "fit": 0.23, "sx": 1150, "dur": 3}],
     "fx": [cap(560, 170, "TIAP HARI MENEBAK-NEBAK", bg="#D9483B", at=0.3)]},
    {"cue": "Rina membaca satu", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 700, "face": 1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}, C("Pipinya memanas", expr="sad", emote="sweat")]}],
     "cam": [{"on": "rina", "fit": 0.24, "sx": 760}, {"at": 0, "on": "rina", "fit": 0.29, "sx": 760, "dur": 4}],
     "grade": {"tint": "rgba(210,60,40,.10)"}},
    insert("Beberapa pesan itu", -0.2, {"type": "messyBoard", "mineAt": C("ia sendiri yang menulis", 0.0), "card": "Bagi Rina: jelas. Bagi Dodi: teka-teki.", "cardAt": C("Baginya, pesan itu", 0.0), "cardBg": "#13223D"}, trans="zoom"),
  ]})

# 5 ------------------------------------------------------------------ Rina menawarkan bantuan lebih dulu
A.append({"n": 5, "name": "Apa yang bikin pusing?", "loc": "gudang", "music": "warm", "trans": "fade",
  "locOpt": g(),
  "lines": [{"who": "rina", "from": "Mas Dodi, dari tim", "to": "paling bikin pusing", "text": "Apa yang paling bikin Mas pusing dari kami?", "maxW": 560, "size": 40},
            {"who": "dodi", "from": "Saya cuma butuh", "to": "ketemu, Mbak", "text": "Saya cuma butuh kardusnya ketemu.", "label": "Dodi", "maxW": 560, "size": 42}],
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 650, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0]}, C("Ia menanyakan hal", pose="hold", item="notebook", expr="happy"), C("Mas Dodi, dari tim", pose="talk")]},
                         {"who": "dodi", "x": 1250, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "cross", "expr": "angry", "look": [-1, 0]}, C("Dodi mengangkat alis", pose="cross", expr="confused", emote="?"),
                          C("Belum pernah ada", pose="hips", expr="neutral")]}],
     "cam": [{"x": 950, "y": 520, "zoom": 1.08}, {"at": 0, "x": 950, "y": 520, "zoom": 1.15, "dur": 4}, C("Dodi mengangkat alis", on="dodi", fit=0.23, sx=1150, dur=1.0)],
     "fx": [card("Belum pernah ada", "Belum pernah ada yang bertanya begitu.", d=0.1, x=520, y=200, size=42, maxW=760)]},
    {"cue": "Ia menghitung dengan", "d": -0.2, "trans": "cut",
     "actors": [{"who": "dodi", "x": 1250, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "think", "expr": "neutral"}, C("Nama toko tidak", pose="pointUp"), C("Kode alamat tidak ada", pose="shrug"),
                 C("Barangnya tidak jelas", pose="pointUp"), C("Tidak ada foto", pose="shrug", expr="angry")]}],
     "cam": [{"on": "dodi", "fit": 0.2, "sx": 640}, {"at": 0, "on": "dodi", "fit": 0.23, "sx": 640, "dur": 7}],
     "fx": [cap(1400, 200, "1 · NAMA TOKO TIDAK LENGKAP", bg="#D9483B", size=32, cue="Nama toko tidak", d=0.0),
            cap(1400, 320, "2 · KODE ALAMAT TIDAK ADA", bg="#D9483B", size=32, cue="Kode alamat tidak ada", d=0.0),
            cap(1400, 440, "3 · BARANG TIDAK JELAS", bg="#D9483B", size=32, cue="Barangnya tidak jelas", d=0.0),
            cap(1400, 560, "4 · TIDAK ADA FOTO", bg="#D9483B", size=32, cue="Tidak ada foto", d=0.0)]},
    insert("Rina mencatat semuanya", -0.2, {"type": "fiveTable", "mode": "notebook", "titleAt": 0.2, "drawAt": 0.9, "title": "Format ke gudang:"}, trans="zoom",
           ),
    {"cue": "Dodi mendengus", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 650, "face": 1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "proud"}, C("Tapi nadanya", expr="happy")]},
                {"who": "dodi", "x": 1150, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "cross", "expr": "angry", "look": [-1, 0]}, C("Tapi nadanya", -0.2, x=1700, dur=2.2, face=1, pose="idle", expr="neutral"),
                 C("Tapi nadanya", 1.4, face=-1, look=[-1, 0], expr="proud")]},
                staf("eko", 180, keys=[{"at": 0, "pose": "hold", "expr": "neutral"}, {"at": 1.2, "x": 260, "dur": 1.5}]), staf("jaka", 1950, face=-1, item=None, keys=[{"at": 0, "pose": "think", "expr": "neutral"}])],
     "cam": [{"x": 950, "y": 520, "zoom": 1.1}, {"at": 0, "x": 1050, "y": 520, "zoom": 1.06, "dur": 5}],
     "fx": [cap(1450, 170, "NADANYA MELUNAK", bg="#3BA36B", cue="Tapi nadanya", d=0.4)]},
  ]})
A[-1]["shots"][2]["fx"].append(cap(1500, 960, "HARI INI JUGA", bg="#C2691F", cue="Hari ini juga", d=-0.1))

# 6 ------------------------------------------------------------------ Bayu datang, teman lama
A.append({"n": 6, "name": "Bayu dan buku bon", "loc": "gudang", "music": "light", "trans": "whip",
  "locOpt": g(doorOpen=False, doorAt=0.3),
  "lines": [{"who": "bayu", "from": "Dod!", "to": "Dod!", "text": "Dod!", "kind": "shout", "label": "Bayu", "min": 1.6},
            {"who": "bayu", "from": "Mbak Rina ini", "to": "Bantu, ya", "text": "Mbak Rina sahabat saya. Bantu, ya!", "maxW": 520, "size": 40},
            {"who": "dodi", "from": "Tapi kopimu", "to": "Belum dibayar", "text": "Empat belas kopi, Bay.", "label": "Dodi", "maxW": 520, "size": 44},
            {"who": "bayu", "from": "Gajian, Dod", "to": "Dod. Gajian", "text": "Gajian, Dod. Gajian!", "maxW": 520, "size": 44}],
  "shots": [
    {"at": 0, "actors": [{"who": "bayu", "x": -260, "face": 1, "keys": [{"at": 0.6, "x": 560, "dur": 1.8, "expr": "happy"}, C("Dod!", pose="wave", expr="laugh"), C("Ternyata mereka teman", pose="cheer", jump=20),
                          C("Mbak Rina ini", pose="point", face=1, expr="happy")]},
                         {"who": "dodi", "x": 1050, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "cross", "expr": "neutral"}, C("wajah Dodi langsung", pose="wave", expr="laugh"), C("Ternyata mereka teman", pose="clap", expr="laugh")]},
                         {"who": "rina", "x": 1500, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("Bayu masuk", expr="happy"), C("Mbak Rina ini", expr="laugh", look="cam")]}],
     "cam": [{"x": 700, "y": 520, "zoom": 1.05}, {"at": 0.5, "x": 820, "y": 520, "zoom": 1.1, "dur": 3}, C("Ternyata mereka teman", x=1000, y=520, zoom=1.06, dur=1.5)],
     "sfx": [{"at": 0.3, "type": "whoosh", "vol": 0.5}],
     "fx": [card("Ternyata mereka teman", "Teman lama di warung seberang kantor.", d=0.2, x=1300, y=200, size=42, maxW=760, out=C("Mbak Rina ini", -0.1))]},
    {"cue": "Dodi melirik Bayu", "d": -0.2, "trans": "cut",
     "actors": [{"who": "bayu", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "hips", "expr": "happy"}, C("Tapi kopimu", 1.0, expr="shock", emote="sweat")]},
                {"who": "dodi", "x": 1150, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "cross", "expr": "proud", "look": [-1, 0]}, C("Bantu bisa", pose="hold", item="bon", expr="proud")]}],
     "cam": [{"x": 920, "y": 520, "zoom": 1.18}, {"at": 0, "x": 940, "y": 520, "zoom": 1.26, "dur": 6}]},
    insert("Belum dibayar", -0.2, {"type": "bonBook", "count": 14, "chip": "BELUM DIBAYAR", "chipAt": 0.4}, trans="zoom"),
    {"cue": "Bayu tertawa keras", "d": -0.2, "trans": "cut",
     "actors": [{"who": "bayu", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "cheer", "expr": "laugh", "jump": 30, "emote": "sweat"}, {"at": 1.2, "pose": "shrug", "expr": "laugh"}, C("Gajian, Dod", pose="pointUp", expr="laugh")]},
                {"who": "dodi", "x": 1150, "face": -1, "size": 580, "item": "bon", "keys": [{"at": 0, "pose": "hold", "expr": "neutral"}, C("Gajian, Dod", pose="cross", expr="proud")]},
                {"who": "rina", "x": 1600, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "confused", "emote": "?"}]}],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.08}, {"at": 0, "x": 960, "y": 520, "zoom": 1.15, "dur": 5}]},
  ]})

# 7 ------------------------------------------------------------------ Makan siang di warung Bu Tini
WTAB = [{"type": "warungTable", "x": 960, "y": 1060, "layer": "front", "w": 1180, "cups": [[-440, "teh"], [-40, "teh"], [420, "kopi"]], "spoon": 1},
        {"type": "nasiBungkus", "x": 960, "y": 855, "layer": "front", "items": [[-250], [170]]}]
A.append({"n": 7, "name": "Warung Bu Tini", "loc": "warung", "music": "warm", "trans": "iris",
  "locOpt": {"time": "siang"},
  "props": WTAB,
  "lines": [{"who": "dodi", "from": "Orang kantor depan datang", "to": "ada yang salah", "text": "Kantor depan datang cuma kalau ada salah.", "label": "Dodi", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [{"who": "tini", "x": 1620, "y": 930, "layer": "back", "face": -1, "size": 520, "keys": [{"at": 0, "pose": "idle", "expr": "happy", "look": [-1, 0.3]}, {"at": 2.5, "pose": "hold", "expr": "happy"}]},
                         {"who": "rina", "x": 600, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}, C("Pertama kalinya ia", expr="happy")]},
                         {"who": "dodi", "x": 960, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "sit", "expr": "neutral"}, C("Pertama kalinya ia", expr="happy", look=[-1, 0])]},
                         {"who": "bayu", "x": 1320, "face": -1, "keys": [{"at": 0, "pose": "sit", "expr": "laugh"}, {"at": 2.0, "pose": "drink", "item": "cup", "expr": "happy"}]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "x": 960, "y": 540, "zoom": 1.14, "dur": 7}],
     "fx": [cap(420, 150, "WARUNG BU TINI · 12.10", col="#F6C343", at=0.3, out=C("Pertama kalinya ia", 0.5)),
            {"type": "nameTag", "cue": "warung Bu Tini", "d": 0.2, "name": "Bu Tini", "role": "Pemilik warung", "x": 1250, "y": 800, "out": C("Dodi bercerita", -0.3)},
            card("Pertama kalinya ia", "Pertama kali semeja dengan orang gudang.", d=0.2, x=560, y=200, size=42, maxW=760, out=C("Dodi bercerita", -0.3)),
            cap(1450, 200, "DODI MENGGAMBAR DI KERTAS NASI", bg="#8E4A24", size=30, cue="Dodi bercerita", d=0.3)]},
    insert("Setiap kardus diberi", -0.3, {"type": "flowPaper", "flowAt": [C("Setiap kardus diberi", 0.0), C("label kode alamat", 0.0), C("label kode alamat", 0.8), C("label kode alamat", 1.6)],
            "holdAt": C("masuk ke rak tahan", -0.3)}, trans="zoom"),
    {"cue": "Sembilan tahun, Mbak", "d": -0.2, "trans": "cut",
     "actors": [{"who": "rina", "x": 600, "face": 1, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0]}, C("Rina tidak membela", expr="happy")]},
                {"who": "dodi", "x": 960, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "sit", "expr": "sad", "look": [-1, 0]}, C("Orang kantor depan datang", pose="shrug", expr="angry"), C("Rina tidak membela", pose="sit", expr="neutral")]}],
     "cam": [{"x": 780, "y": 520, "zoom": 1.2}, {"at": 0, "x": 800, "y": 520, "zoom": 1.28, "dur": 6}],
     "fx": [card("Rina tidak membela", "Tidak membela timnya.", d=0.1, x=1400, y=200, size=46)]},
    insert("Ia hanya menggambar", -0.2, {"type": "flowPaper", "flowAt": [-9, -9, -9, -9], "holdAt": -9, "tableAt": C("Ia hanya menggambar", 0.4),
            "colAt": [C("Lima kolom", 0.3), C("kode alamat, barang", 0.0), C("barang, masalah", 0.0), C("masalah, foto", 0.0), C("foto.", 0.0)],
            "card": "Format keluhan: Toko · Kode alamat · Barang · Masalah · Foto", "cardAt": C("Lima kolom", 0.0), "cardSize": 32, "cardY": 1000}, trans="cut"),
  ]})

# 8 ------------------------------------------------------------------ Pesan Pak Wijaya (jujur + jam pasti) + tabel dikirim ke gudang
A.append({"n": 8, "name": "Bukan \"aman\"", "loc": "kerja", "music": "light", "trans": "whip",
  "locOpt": {"time": "sore", "clock": "15:00"},
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.3]}, {"at": 1.0, "pose": "phone", "item": "phoneBuzz", "expr": "shock", "emote": "!"}])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 3}],
     "sfx": [{"at": 1.0, "type": "buzz", "vol": 0.8, "dur": 1.0}],
     "fx": [cap(1480, 330, "15.00 · PESAN PAK WIJAYA", bg="#8E4A24", at=0.6)]},
    insert("Besok teknisi jadi", -0.6, {"type": "chat16", "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
            "msgs": [{"t": C("Besok teknisi jadi", -0.2), "text": "Besok teknisi jadi datang, Mbak?", "time": "15.00"},
                     {"t": C("Balasan Pak Wijaya", -0.4), "me": True, "text": WA_MSG, "time": "15.04", "read": C("Balasan Pak Wijaya", 0.3)},
                     {"t": C("Saya tunggu jam lima", -0.1), "text": "Saya tunggu jam lima.", "time": "15.05"}],
            "input": [{"t": C("Jari Rina mengetik", 0.5), "text": "Aman, Pak.", "cps": 4, "del": C("Ia menghapusnya", 0.0), "delCps": 12},
                      {"t": C("Ia menulis yang sebenarnya", 0.1), "text": WA_MSG, "cps": 9, "send": C("Balasan Pak Wijaya", -0.4)}],
            "chip": "HAPUS \"AMAN, PAK\"", "chipAt": C("Ia menghapusnya", 0.1), "chipBg": "#5E5A62", "chip2": "JUJUR + JAM PASTI", "chip2At": C("Jam lima sore", 0.0), "chip2Bg": "#3BA36B"}, trans="zoom"),
    {"cue": "Tidak marah", "d": -0.2, "trans": "cut",
     "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.4]}, C("Tapi setidaknya", expr="happy", look="cam")])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.22, "sx": 800}, {"at": 0, "on": "rina", "fit": 0.26, "sx": 800, "dur": 6}],
     "fx": [card("Tidak marah", "Tidak marah. Tidak juga ramah.", d=0.1, x=1400, y=200, size=44, out=C("Tapi setidaknya", -0.2)),
            card("Tapi setidaknya", "Tapi ia tahu persis yang terjadi.", d=0.1, x=1400, y=200, size=44, maxW=760)]},
    insert("Lalu Rina menyelesaikan", -0.2, {"type": "fiveTable", "mode": "laptop", "rowsAt": 0.8, "per": 0.7, "sendAt": C("mengirimkannya ke gudang", 0.2)}, trans="zoom"),
    {"cue": "mengirimkannya ke gudang", "d": 1.4, "trans": "whip", "loc": "gudang", "locOpt": g(),
     "actors": [{"who": "dodi", "x": 1100, "y": 960, "layer": "back", "face": -1, "size": 580, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}, {"at": 0.9, "pose": "pointUp", "expr": "proud"}]},
                staf("eko", 300, keys=[{"at": 0, "pose": "hold", "expr": "neutral"}, {"at": 0.5, "x": 450, "dur": 1.6}])],
     "cam": [{"on": "dodi", "fit": 0.2, "sx": 1100}, {"at": 0, "on": "dodi", "fit": 0.23, "sx": 1100, "dur": 3}],
     "fx": [cap(560, 170, "GUDANG · DICETAK, RAK DISISIR", bg="#3BA36B", at=0.2)]},
  ]})

# 9 ------------------------------------------------------------------ Telepon Dodi (titik tegang)
HOLD_R = {"loc": "gudang", "locOpt": dict(HOLD), "grade": SORE}
A.append({"n": 9, "name": "Ketemu. Tapi…", "loc": "kerja", "music": "tense", "musicCut": 2.0, "trans": "whip", "post": 0.4, "hold": 1.6,
  "locOpt": {"time": "sore", "clock": "16:20"},
  "lines": [{"who": "dodi", "from": "Mbak, ke gudang", "to": "Kardusnya ketemu", "text": "Kardusnya ketemu.", "label": "Dodi", "min": 2.0, "size": 44},
            {"who": "dodi", "from": "Tapi Mbak nggak", "to": "bakal suka", "text": "Tapi Mbak nggak bakal suka.", "maxW": 520, "size": 42, "min": 2.2}],
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.3]}, C("ponsel Rina berdering", pose="phone", item="phoneBuzz", expr="shock", emote="!")])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.06}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 2.5}],
     "sfx": [C("ponsel Rina berdering", -0.1, type="ring", vol=0.8, dur=1.5)],
     "fx": [cap(1480, 330, "16.20", bg="#13223D", at=0.4)]},
    insert("Dodi.", -0.4, {"type": "callScreen", "name": "Dodi Gudang", "sub": "Gudang perangkat · memanggil", "ch": "D", "col": "#C2691F", "rings": [-0.2], "connectAt": 0.6}, trans="zoom"),
    {"cue": "Mbak, ke gudang", "d": -0.2, "trans": "whip", "split": [
       {"loc": "kerja", "locOpt": {"time": "sore", "clock": "16:21"}, "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
        "actors": [rina_sit(item="phone", keys=[{"at": 0, "pose": "sit", "expr": "scared", "look": [1, 0.1]}, C("Kardusnya ketemu", expr="laugh"),
                    C("langsung berdiri", -0.3, pose="phone", expr="happy", jump=20), C("Tapi Mbak nggak", expr="scared")])],
        "cam": [{"x": 900, "y": 540, "zoom": 1.2}, C("Kardusnya ketemu", x=900, y=520, zoom=1.28, dur=5)]},
       dict(HOLD_R, actors=[{"who": "dodi", "x": 1250, "face": -1, "size": 580, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "neutral", "look": [-1, 0.2]}, C("Tapi Mbak nggak", expr="sad", look=[-1, 0.4])]}],
            cam=[{"x": 1000, "y": 500, "zoom": 1.0}, C("Kardusnya ketemu", x=1050, y=500, zoom=1.1, dur=5)])]},
    {"cue": "bakal suka", "d": 0.5, "trans": "cut",
     "actors": [{"who": "rina", "x": 850, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "shock", "emote": "!", "look": [1, -0.1]}]}],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"on": "rina", "fit": 0.3, "sx": 960, "shake": 6}, {"at": 0, "on": "rina", "fit": 0.36, "sx": 960, "dur": 1.4}]},
    {"atE": 1.6, "trans": "cut", "actors": [], "useLoc": False, "loc": "hitam", "noHeader": True},
  ]})

# 10 ----------------------------------------------------------------- Rak tahan (kejutan tengah)
A.append({"n": 10, "name": "Rak tahan: TK-11", "loc": "gudang", "music": "sad", "trans": "fade", "pre": 0.8,
  "locOpt": dict(HOLD, holdRack=dict(HOLD["holdRack"], hlAt=C("Ia ada di rak tahan", 0.3))),
  "shots": [
    {"at": 0, "grade": SORE, "actors": [{"who": "rina", "x": 260, "face": 1, "keys": [{"at": 0, "x": 330, "dur": 1.2, "expr": "scared"}, {"at": 1.3, "pose": "idle", "look": [1, -0.3]}, C("Ia ada di rak tahan", expr="shock", emote="!")]},
                         {"who": "dodi", "x": 1550, "face": -1, "size": 580, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Ia ada di rak tahan", pose="point", item=None)]}],
     "cam": [{"x": 960, "y": 500, "zoom": 1.0}, {"at": 0, "x": 960, "y": 470, "zoom": 1.1, "dur": 5}],
     "fx": [cap(1500, 170, "RAK TAHAN · KODE TIDAK COCOK", bg="#D9483B", cue="karena kode alamatnya", d=0.0)]},
    insert("Di labelnya tertulis", -0.2, [{"type": "fiveTable", "mode": "print", "labelAt": C("TK-11", 0.0), "rowAt": C("Padahal toko barunya", 0.3), "cmpAt": C("Begitu toko dan kode", 0.3),
            "chip": "Kode alamat salah ketik: TK-11 → seharusnya TK-12", "chipAt": C("bedanya langsung", 0.0), "chipBg": "#D9483B"},
            cap(960, 70, "KETEMU BERKAT TABEL 5 KOLOM", bg="#3BA36B", cue="Dodi menemukannya", d=0.3, size=36)], trans="zoom"),
    insert("Rina membuka data", -0.2, {"type": "orderForm", "head": "DATA PESANAN", "no": "PO-0525-12", "clock": "16:35",
            "rows": [["Toko", "Toko Wijaya 12 (baru)"], ["Produk", "Mesin kasir Tangani"], ["Tipe", "BESAR (diganti)"], ["Kode alamat", "TK-11", "hl"], ["Diubah oleh", "Rina · Senin 14.52", "who"]],
            "hlAt": C("Rina membuka data", 0.9), "whoAt": C("Rina sendiri, Senin", 0.0), "verdict": "BUKAN GUDANG. TIM LAYANAN PELANGGAN.", "verdictAt": C("Tim layanan pelanggan", 0.0), "verdictBg": "#D9483B"}, trans="cut"),
    {"cue": "Bukan gudang yang salah", "d": -0.3, "trans": "cut", "grade": SORE,
     "actors": [{"who": "rina", "x": 560, "face": 1, "keys": [{"at": 0, "pose": "scared", "expr": "scared", "look": [1, 0]}, C("Dirinya sendiri", pose="sad", expr="sad", look="down")]},
                {"who": "dodi", "x": 1150, "face": -1, "size": 580, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}]}],
     "cam": [{"on": "rina", "fit": 0.22, "sx": 760}, {"at": 0, "on": "rina", "fit": 0.27, "sx": 760, "dur": 5}],
     "fx": [card("Dirinya sendiri", "Dirinya sendiri.", d=0.0, x=1400, y=210, size=54)]},
  ]})

# 11 ----------------------------------------------------------------- Dodi memilih membantu
A.append({"n": 11, "name": "Kita antar sendiri", "loc": "gudang", "music": "hope", "trans": "cut",
  "locOpt": dict(HOLD, holdRack=dict(HOLD["holdRack"], box=False)),
  "lines": [{"who": "rina", "from": "Maaf, Mas", "to": "salah ketik", "text": "Maaf, Mas. Saya yang salah.", "maxW": 520, "size": 44},
            {"who": "dodi", "from": "Ayo, Mbak", "to": "Sekarang", "text": "Ayo. Kita antar sendiri.", "label": "Dodi", "maxW": 520, "size": 44}],
  "shots": [
    {"at": 0, "grade": SORE, "actors": [{"who": "rina", "x": 520, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": "down"}, C("Maaf, Mas", pose="talk", expr="sad", look=[1, 0])]},
                                       {"who": "dodi", "x": 1250, "face": -1, "size": 580, "item": "box", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Dodi punya semua", expr="proud"), C("Maaf, Mas", expr="neutral")]}],
     "props": [{"type": "trolley", "x": 1550, "y": 1000, "box": False}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.06}, {"at": 0, "x": 900, "y": 520, "zoom": 1.12, "dur": 4}, C("Dodi punya semua", on="dodi", fit=0.22, sx=1150, dur=1.2), C("Maaf, Mas", -0.3, on="rina", fit=0.24, sx=760, dur=1.0)],
     "fx": [{"type": "taps", "x": 690, "y": 560, "word": "tok", "sound": "knock", "times": [{"at": 1.0}, {"at": 1.35}]},
            card("Sembilan tahun gudang", "9 tahun gudang yang disalahkan…", d=0.1, x=1350, y=210, size=44, out=C("Maaf, Mas", -0.3))]},
    {"cue": "Dodi menatapnya lama", "d": -0.2, "trans": "cut", "grade": SORE,
     "actors": [{"who": "rina", "x": 520, "face": 1, "keys": [{"at": 0, "pose": "sad", "expr": "sad", "look": [1, -0.1]}, C("Ayo, Mbak", pose="idle", expr="shock", emote="!"), C("Sekarang", expr="happy")]},
                {"who": "dodi", "x": 1150, "face": -1, "size": 580, "item": "box", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Lalu ia mengangkat", x=1450, dur=0.9, face=1),
                 C("mengambil kunci", -0.4, item="keys", pose="hold", face=-1, expr="proud"), C("Ayo, Mbak", pose="wave", expr="happy")]}],
     "props": [{"type": "trolley", "x": 1600, "y": 1000, "box": False, "label": "WIJAYA · TK-11", "keys": [C("mengambil kunci", -1.0, box=True)]}],
     "cam": [{"on": "dodi", "fit": 0.22, "sx": 1100}, {"at": 0, "on": "dodi", "fit": 0.25, "sx": 1100, "dur": 2}, C("Lalu ia mengangkat", x=1050, y=520, zoom=1.05, dur=1.4)],
     "sfx": [C("Lalu ia mengangkat", 0.9, type="thud", vol=0.5), C("mengambil kunci", -0.4, type="click", vol=0.6)]},
  ]})

# 12 ----------------------------------------------------------------- Mengantar malam itu
A.append({"n": 12, "name": "Diantar sendiri", "loc": "kabin", "music": "warm", "trans": "fade",
  "locOpt": {},
  "lines": [{"who": "wijaya", "from": "Malam-malam diantar", "to": "diantar sendiri", "text": "Malam-malam diantar sendiri?", "label": "Pak Wijaya", "maxW": 560, "size": 42},
            {"who": "rina", "from": "Kesalahannya di tim", "to": "yang menemukannya", "text": "Kesalahannya di tim kami, Pak.", "maxW": 520, "size": 42},
            {"who": "wijaya", "from": "Bertahun-tahun saya", "to": "orang gudangnya", "text": "Baru kali ini kenal orang gudangnya.", "maxW": 560, "size": 40}],
  "shots": [
    {"at": 0, "actors": [{"who": "dodi", "x": 700, "face": 1, "size": 700, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [0, -0.2]}]},
                         {"who": "rina", "x": 1220, "face": -1, "size": 700, "item": "phone", "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [0.2, 0.6]}]}],
     "cam": [{"x": 960, "y": 560, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.12, "dur": 3}],
     "fx": [cap(1480, 170, "17.00 · TEPAT JANJI", bg="#3BA36B", at=0.4)]},
    insert("kardus ketemu, sedang", -1.4, {"type": "chat16", "night": True, "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W",
            "msgs": [{"t": 0.9, "me": True, "text": "Pak, kardusnya ketemu. Sedang kami antar sendiri ke toko.", "time": "17.00", "read": C("Jam tujuh malam", -0.6)}]}, trans="zoom"),
    {"cue": "Jam tujuh malam", "d": -0.2, "trans": "whip", "loc": "jalan", "locOpt": {"time": "malam"}, "actors": [],
     "cam": [{"x": 960, "y": 560, "zoom": 1.0}, {"at": 0, "x": 1000, "y": 560, "zoom": 1.08, "dur": 3}],
     "sfx": [{"at": 0.1, "type": "bus", "vol": 0.5, "dur": 2.4}],
     "fx": [cap(1480, 170, "19.00", bg="#13223D", col="#F6C343", at=0.3)]},
    {"cue": "Pak Wijaya keluar", "d": -0.6, "trans": "fade", "loc": "tokoluar", "locOpt": {"time": "malam", "banner": True},
     "props": [{"type": "pickup", "x": 280, "y": 1000, "night": True, "box": False}, {"type": "trolley", "x": 1260, "y": 1000, "label": "WIJAYA · TK-12"}],
     "actors": [{"who": "rina", "x": 760, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [1, 0]}, C("Kesalahannya di tim", pose="talk", expr="neutral"), C("Mas Dodi dari gudang", pose="point", face=-1, expr="happy"),
                 C("Pak Wijaya diam sejenak", pose="idle", face=1, expr="neutral")]},
                {"who": "dodi", "x": 1010, "face": 1, "size": 580, "keys": [{"at": 0, "pose": "hips", "expr": "neutral"}, C("menepuk bahu Dodi", jump=14, expr="shock"), C("Bertahun-tahun saya", expr="laugh"), C("orang gudangnya", pose="pointUp", item="thumb", expr="proud")]},
                {"who": "wijaya", "x": 1600, "face": -1, "size": 620, "keys": [{"at": 0.2, "x": 1480, "dur": 1.2, "expr": "neutral"}, C("Malam-malam diantar", pose="shrug", expr="confused"),
                 C("Kesalahannya di tim", pose="idle", expr="neutral"), C("Pak Wijaya diam sejenak", 0.4, x=1180, dur=0.9, pose="idle"), C("menepuk bahu Dodi", -0.2, pose="wave", expr="happy"), C("Bertahun-tahun saya", 0.8, pose="talk", expr="laugh")]}],
     "cam": [{"x": 1100, "y": 520, "zoom": 1.0}, {"at": 0, "x": 1150, "y": 520, "zoom": 1.08, "dur": 4}, C("Kesalahannya di tim", on="rina", fit=0.22, sx=760, dur=1.2), C("Pak Wijaya diam sejenak", x=1100, y=520, zoom=1.1, dur=1.2)],
     "fx": [cap(1600, 900, "TOKO KE-12 · 19.00", bg="#13223D", col="#F6C343", at=0.3, out=C("Malam-malam diantar", 0))]},
    {"cue": "Di perjalanan pulang", "d": -0.2, "trans": "fade", "locOpt": {"radioAt": C("Dodi menyalakan radio", 0.3)},
     "actors": [{"who": "dodi", "x": 700, "face": 1, "size": 700, "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": [0, -0.2]}, C("dan bersiul", expr="proud")]},
                {"who": "rina", "x": 1220, "face": -1, "size": 700, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [-0.4, 0]}, C("Rina tersenyum", expr="happy", look=[1, -0.3])]}],
     "cam": [{"x": 960, "y": 560, "zoom": 1.05}, {"at": 0, "x": 1040, "y": 560, "zoom": 1.14, "dur": 6}],
     "fx": [{"type": "whistle", "who": "dodi", "cue": "dan bersiul", "d": 0.0, "dx": 90}]},
  ]})

# 13 ----------------------------------------------------------------- Terima kasih secara terbuka
A.append({"n": 13, "name": "Terima kasih di grup", "loc": "kerja", "music": "hope", "trans": "iris",
  "locOpt": {"time": "pagi", "clock": "08:05"},
  "lines": [{"who": "dodi", "from": "Beres, Bos", "to": "Beres, Bos", "text": "Beres, Bos!", "label": "Dodi", "kind": "shout", "min": 2.0}],
  "shots": [
    {"at": 0, "actors": [rina_sit(keys=[{"at": 0, "pose": "type", "expr": "happy", "look": [1, 0.3]}])],
     "props": [CHAIR, desk(cups=1, laptop=1, sticky=1)],
     "cam": [{"x": 960, "y": 520, "zoom": 1.06}, {"at": 0, "on": "rina", "fit": 0.22, "sx": 820, "dur": 3}],
     "fx": [{"type": "month", "at": 0.2, "hold": 3.0, "day": "10", "text": "JUNI"}, cap(1480, 190, "RABU PAGI", col="#F6C343", at=0.5)]},
    insert("Terima kasih untuk Mas Dodi", -0.8, {"type": "chat16", "name": "Layanan Pelanggan + Gudang + Ops", "sub": "Pak Hendra, Bu Ratna, Dodi, Bayu, +9", "ch": "G", "col": "#2F6F73", "skinHand": "#B5774F",
            "msgs": [{"t": 0.6, "me": True, "text": TY_MSG, "time": "08.05", "read": C("Dan mulai hari ini", 0.5)}],
            "chip": "DIBACA PAK HENDRA & BU RATNA", "chipAt": C("Dan mulai hari ini", 0.6), "chipBg": "#13223D", "chipSize": 30, "chipX": 1520}, trans="zoom"),
    {"cue": "Di gudang, ponsel Dodi", "d": -0.2, "trans": "whip", "loc": "gudang", "locOpt": g(board5=C("menggantikan tumpukan", -0.3)),
     "actors": [{"who": "dodi", "x": 1150, "face": -1, "size": 580, "item": "phone", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": "down"}, C("membetulkan topi", pose="scratch", item=None, expr="neutral"),
                 C("pura-pura biasa saja", pose="cross", expr="neutral", look=[1, 0]), C("pura-pura biasa saja", 1.1, expr="proud"),
                 C("Lalu ia menempel", item="paper", pose="hold", x=1350, dur=0.8, face=1), C("menggantikan tumpukan", -0.4, pose="pointUp"),
                 C("Beres, Bos", -0.3, face=-1, item="thumb", pose="pointUp", expr="laugh")]}],
     "cam": [{"on": "dodi", "fit": 0.22, "sx": 900}, {"at": 0, "on": "dodi", "fit": 0.25, "sx": 900, "dur": 3}, C("Lalu ia menempel", x=1350, y=460, zoom=1.1, dur=1.2)],
     "sfx": [{"at": 0.1, "type": "notif", "vol": 0.8}],
     "fx": [cap(560, 170, "GUDANG · 08.07", bg="#5E5A62", at=0.3, out=C("Lalu ia menempel", 0))]},
  ]})

# 14 ----------------------------------------------------------------- Kamis, toko buka
A.append({"n": 14, "name": "Kamis: toko buka", "loc": "tokoluar", "music": "hope", "trans": "iris",
  "locOpt": {"time": "pagi", "ribbon": True, "ribbonCut": C("dibuka tepat waktu", -0.4)},
  "lines": [{"who": "bayu", "from": "Minggu depan", "to": "depan, Bu Tini", "text": "Minggu depan, Bu Tini…", "label": "Bayu", "kind": "think", "maxW": 520, "size": 42, "min": 1.8}],
  "shots": [
    {"at": 0, "actors": [{"who": "wijaya", "x": 1240, "face": -1, "size": 620, "keys": [{"at": 0, "pose": "hips", "expr": "happy"}, C("dibuka tepat waktu", -0.4, pose="cheer", expr="laugh", jump=20)]},
                         {"who": "pembeli", "x": 700, "face": 1, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("dibuka tepat waktu", 0.0, pose="clap", expr="laugh")]}],
     "cam": [{"x": 1100, "y": 470, "zoom": 1.0}, {"at": 0, "x": 1150, "y": 480, "zoom": 1.08, "dur": 4}],
     "sfx": [C("dibuka tepat waktu", -0.4, type="applause", vol=0.4, dur=1.8)],
     "fx": [cap(560, 170, "KAMIS · 08.00 · TOKO KE-12 BUKA", col="#F6C343", at=0.3), {"type": "confetti", "cue": "dibuka tepat waktu", "d": -0.3, "x": 1570, "y": 420, "count": 70}]},
    {"cue": "Struk pertama keluar", "d": -0.2, "trans": "whip", "loc": "tokobaru", "locOpt": dict(TOKO, posBig=True, receiptAt=C("Struk pertama keluar", 0.4)),
     "actors": [{"who": "wijaya", "x": 760, "y": 950, "layer": "back", "face": 1, "size": 600, "keys": [{"at": 0, "pose": "talk", "expr": "laugh", "look": [1, 0]}]},
                {"who": "pembeli", "x": 1330, "face": -1, "item": "money", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}, {"at": 1.6, "pose": "clap", "item": None, "expr": "laugh"}]}],
     "cam": [{"x": 1000, "y": 480, "zoom": 1.1}, {"at": 0, "x": 1000, "y": 480, "zoom": 1.2, "dur": 3.4}],
     "fx": [cap(1500, 170, "KASIR TIPE BESAR · STRUK #1", bg="#3BA36B", at=0.6)]},
    insert("Pak Wijaya mengirim", -0.2, {"type": "chat16", "name": "Pak Wijaya", "sub": "Toko Wijaya · online", "ch": "W", "skinHand": "#B5774F",
            "msgs": [{"t": 0.4, "img": "receipt", "time": "08.02"}], "chip": "TANPA KATA-KATA", "chipAt": C("tanpa kata-kata", 0.0), "chipBg": "#5E5A62"}, trans="zoom"),
    insert("Rina meneruskannya", -0.2, {"type": "chat16", "name": "Tim Gudang", "sub": "Dodi, Mas Eko, Mas Jaka, Rina", "ch": "G", "col": "#C2691F",
            "msgs": [{"t": 0.3, "me": True, "img": "receipt", "text": "Toko Wijaya 12 sudah buka. Terima kasih, tim gudang!", "time": "08.05"},
                     {"t": C("satu jempol dan", -0.3), "from": "Dodi", "thumb": True, "cap": True, "time": "08.06"}]}, trans="whip"),
    {"cue": "Sementara itu di warung", "d": -0.2, "trans": "whip", "loc": "warung", "locOpt": {"time": "pagi"},
     "props": [{"type": "warungTable", "x": 700, "y": 1060, "layer": "front", "w": 700, "cups": [[-120, "kopi"]]}],
     "actors": [{"who": "tini", "x": 1450, "y": 930, "layer": "back", "face": -1, "size": 520, "keys": [{"at": 0, "pose": "idle", "expr": "happy"}, C("Lalu menariknya", expr="confused", emote="?"), C("Bu Tini menambah", pose="hold", item="bon", expr="neutral")]},
                {"who": "bayu", "x": 1120, "face": 1, "item": "money", "keys": [{"at": 0, "pose": "hold", "expr": "happy"}, C("Lalu menariknya", pose="hips", expr="laugh", emote="sweat"), C("Minggu depan", pose="talk", expr="laugh")]}],
     "cam": [{"x": 1250, "y": 500, "zoom": 1.15}, {"at": 0, "x": 1280, "y": 500, "zoom": 1.24, "dur": 7}],
     "fx": [cap(560, 170, "WARUNG BU TINI", col="#F6C343", at=0.3)]},
    insert("Bu Tini menambah", -0.2, {"type": "bonBook", "count": 14, "addAt": C("Lima belas", -0.7)}, trans="zoom"),
  ]})

# 15 ----------------------------------------------------------------- Kartu pelajaran
A.append({"n": 15, "name": "Kartu pelajaran", "loc": "gudang", "music": "warm", "trans": "iris", "post": 1.4,
  "locOpt": g(board5=True),
  "shots": [
    {"at": 0, "blur": 9, "actors": [{"who": "rina", "x": 300, "size": 600, "face": 1, "keys": [{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: bangun", pose="pointUp"),
                 C("Dua: bantu", pose="hips", expr="proud"), C("Tiga: ucapkan", pose="pointUp", expr="laugh", item="thumb", jump=30)]}],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 22}],
     "fx": [{"type": "lesson", "cue": "Satu: bangun", "d": -0.6, "items": [{"cue": "Satu: bangun", "text": "Bangun hubungan sebelum kamu butuh"},
            {"cue": "Dua: bantu", "text": "Bantu mereka dulu: tanyakan apa yang menyulitkan"}, {"cue": "Tiga: ucapkan", "text": "Ucapkan terima kasih secara terbuka"}]}]},
  ]})

# 16 ----------------------------------------------------------------- Cuplikan Eps 3 + layar akhir
A.append({"n": 16, "name": "Cuplikan Klien Terbesar Eps 3 + layar akhir", "loc": "gudang", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": g(board5=True),
  "shots": [
    {"at": 0, "actors": [{"who": "rina", "x": 700, "face": 1, "item": "phone", "keys": [{"at": 0, "pose": "phone", "expr": "scared", "look": [1, 0]}, C("terlambat", expr="sad", emote="sweat")]},
                         {"who": "dodi", "x": 1100, "y": 960, "layer": "back", "face": -1, "size": 580, "keys": [{"at": 0, "pose": "type", "expr": "sad", "look": "down"}]}],
     "cam": [{"x": 900, "y": 520, "zoom": 1.06}, {"at": 0, "x": 900, "y": 520, "zoom": 1.16, "dur": 5}],
     "fx": [cap(560, 150, "DUA MINGGU KEMUDIAN", col="#F6C343", at=0.3), cap(1450, 330, "TOKO 7 · KERTAS STRUK · +2 HARI", bg="#D9483B", size=30, cue="dua kiriman lain", d=0.0),
            cap(1450, 450, "TOKO 3 · PEMINDAI · TERLAMBAT", bg="#D9483B", size=30, cue="dua kiriman lain", d=1.0)]},
    insert("Dan sebuah email", -0.2, {"type": "warnMail", "openAt": C("Kiriman terlambat tiga", -0.5), "hlAt": C("Dalam tujuh hari", 0.0), "zoomAt": C("Dalam tujuh hari", 0.4)}, trans="zoom"),
    insert("pindah ke penyedia", 0.5, {"type": "countdown", "top": "SEBELUM PAK WIJAYA PINDAH", "from": 7, "to": 7, "unit": "HARI"}, trans="flash"),
    {"cue": "Saksikan kelanjutannya", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di komentar"), "nextQuote": "\"Dalam 7 hari…\"", "nextSub": "lalu pindah?", "nextTitle": "Klien Terbesar · Eps 3",
             "nextWho": "wijaya", "nextKey": {"pose": "hips", "expr": "angry"}, "nextThumb": False, "playlist": "Klien Terbesar", "playlistEps": "Eps 1 · 2 · 3 · 4",
             "ask": "Divisi mana yang paling kamu butuhkan, tapi belum kamu kenal? Tulis di komentar!"}]},
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


shot_local(A)
for a in A:   # story16 hanya membaca sfx di tingkat adegan (sfx di dalam shot diabaikan mesin) → pindahkan
    for sh in a.get("shots", []):
        if sh.get("sfx"): a.setdefault("sfx", []).extend(sh.pop("sfx"))
ep = {"slug": "kantor-06", "title": "Orang Gudang Tidak Mau Membantu, Sampai Rina Melakukan Ini | Kantor Tangani: Klien Terbesar Eps 2",
      "series": "Kantor Tangani", "story": "Klien Terbesar", "eps": "2/4", "month": "JUNI", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Sebelumnya"], [2, "Gudang"], [4, "Dodi"], [7, "Warung Bu Tini"], [10, "Rak tahan"], [12, "Diantar sendiri"], [15, "Pelajaran"], [16, "Episode berikutnya"]],
      "parts": [["Pembuka & masalah", 0, 3], ["Memburuk", 3, 5], ["Berubah & hasil", 5, 7], ["Episode berikutnya", 7, 8]],
      "lessons": ["Bangun hubungan dengan divisi lain sebelum kamu butuh.", "Bantu mereka dulu: tanyakan apa yang menyulitkan, lalu perbaiki bagianmu.", "Ucapkan terima kasih secara terbuka, di depan orang yang perlu tahu."],
      "youtube": {
        "desc": "Kardus untuk toko baru klien terbesar dinyatakan hilang, dan orang gudang sudah curiga sebelum Rina sempat bicara: \"Orang kantor depan bisanya cuma menyalahkan gudang.\" Bagaimana minta bantuan divisi lain yang sudah lebih dulu curiga padamu? Episode kedua Kantor Tangani: Klien Terbesar.",
        "ask": "Divisi mana yang paling sering kamu butuhkan, tapi belum kamu kenal? Tulis di kolom komentar.",
        "next": "Klien Terbesar Eps 3 tayang berikutnya.",
        "tags": "kantor tangani, klien terbesar, cerita kantor, animasi kantor, kerja sama antar divisi, minta bantuan rekan kerja, gudang, layanan pelanggan, terima kasih, komunikasi kerja, dunia kerja, Tangani Talenta",
        "hashtags": "#KantorTangani #KlienTerbesar #duniakerja",
        "adAfter": 9},
      "thumb": {"kind": "gudang", "lines": ["ORANG GUDANG", "NGGAK MAU"], "hl": "BANTU?", "lineSize": 84, "badge": "EPS 2/4", "tag": "KANTOR TANGANI · KLIEN TERBESAR"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
