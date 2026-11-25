#!/usr/bin/env python3
"""Generator episode.json untuk youtube/panjang/kelas-01 (Kelas Produktif Eps 1: "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini").
Waktu `at` di shot ke-2 dst. ditulis RELATIF terhadap awal shot; shot_local() di bawah mengubahnya ke {cue shot, d}.
Mesin tambahan: engine/panjang/kit16kp.js (titleKP, matrix4, matrixMini, chatTower, jadwalFile, msgCount, tabsLaptop, galon, tomatoTimer, weekBoard, phoneDesk)."""
import json, sys
from pathlib import Path
ROOT = Path("/var/www/tangani_talenta/tangani_talenta_video")
sys.path.insert(0, str(ROOT / "tools/panjang"))
from common16 import narration  # noqa: E402
OUT = ROOT / "youtube/panjang/kelas-01/episode.json"
NASKAH = "youtube/kelas/kp01-naskah.md"

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

GREEN, RED, NAVY, ORANGE, YEL = "#3BA36B", "#D9483B", "#13223D", "#C2691F", "#F6C343"
CHAIR = {"type": "chair16", "x": 830, "y": 1000}
def desk(**kw):
    o = {"type": "deskR", "x": 1210, "y": 1000, "photo": False}; o.update(kw); return o
def pdesk(**kw):   # ponsel di meja Bayu (depan tokoh)
    o = {"type": "phoneDesk", "x": 930, "y": 772, "layer": "front"}; o.update(kw); return o
def ker(clock="09:00", time="pagi", **kw):
    o = {"time": time, "clock": clock}; o.update(kw); return o
def BS(**kw):   # Bayu duduk di mejanya
    o = {"who": "bayu", "x": 850, "face": 1}; o.update(kw); return o
def B(x, **kw):
    o = {"who": "bayu", "x": x, "face": 1}; o.update(kw); return o
def S(x, **kw):
    o = {"who": "sinta", "x": x, "face": 1}; o.update(kw); return o
def D(x, **kw):
    o = {"who": "dodi", "x": x, "face": -1}; o.update(kw); return o
def H(x, **kw):   # Pak Hendra di balik meja (lapisan belakang)
    o = {"who": "hendra", "x": x, "y": 950, "layer": "back", "face": -1, "size": 600}; o.update(kw); return o

DODI_LOOK = {"hat": "cap", "hatColor": "#C2691F", "beard": "goatee", "shirt": "#3F6FB5", "sleeve": "short", "pants": "#3B4A6B", "skin": "a", "pencil": True}
extras = {
    "dodi": {"nama": "Dodi (staf gudang & lapangan)", "look": DODI_LOOK},
    "joko": {"nama": "Pak Joko (teknisi pasang)", "look": {"hair": "short", "hairColor": "#2B1A12", "hat": "cap", "hatColor": "#13223D", "shirt": "#2F6F73", "sleeve": "short", "pants": "#2C2433", "skin": "c", "idcard": "#C2691F"}},
    "rahma": {"nama": "Bu Rahma (pemilik toko baru)", "look": {"hair": "hijab", "hijab": "#8E4A24", "shirt": "#FFFDF8", "jacket": "#3F6FB5", "pants": "#2C2433", "skin": "c"}},
    "kasir": {"nama": "Kasir toko Bu Rahma", "look": {"hair": "hijab", "hijab": "#2F6F73", "shirt": "#FFFDF8", "jacket": "#C2691F", "pants": "#2C2433", "skin": "d"}},
}
G = {"door": -150, "doorOpen": True, "bench": 1100, "boxes": [[1800, 2]]}
def g(**kw):
    o = dict(G); o.update(kw); return o
HOLD = {"holdRack": {"x": 640, "w": 640, "box": "TOKO BU RAHMA · KASIR"}, "boxes": [[1760, 2]]}
TOKO = {"time": "pagi", "rahma": True}

# ---------- matriks 31 catatan tempel (adegan 9) ----------
Q = {"gal": 2, "foto": 2, "stik": 3}
def notes9():
    n = []
    def add(text, to=None, **kw):
        o = {"text": text}
        if to is not None: o["to"] = to
        o.update(kw); n.append(o)
    add("Mesin kasir Bu Rahma"); add("Telepon Pak Joko"); add("Antar printer toko")           # tetap di kotak 1 (3 penting)
    add("Jadwal kirim", 1, pickAt=C("Dan jadwal kirim itu", 0.0), moveAt=C("Ia ada di kotak penting tapi", 0.3))
    add("Faktur vendor", 1, moveAt=C("Satu per satu, tempelan pindah", 0.0))
    add("Data stok mingguan", 1, moveAt=C("Satu per satu, tempelan pindah", 0.2))
    add("Galon", 2, pickAt=C("Sinta mengambil satu tempelan", 0.0), moveAt=C("orang lain yang angkat", 0.4))
    add("Foto kardus", 2, pickAt=C("Tempelan berikutnya", 0.0), moveAt=C("Dodi bisa kirim sendiri", 0.3))
    add("Stiker grup alumni", 3, pickAt=C("Stiker grup alumni", 0.0), moveAt=C("Bayu tertawa malu", 0.2))
    two = ["Balas Nisa", "Data pemasaran", "Info jam kirim", "Foto resi", "Tanya alamat", "Cek printer", "Kirim lokasi", "Minta nomor resi", "Cek stok kecil"]
    for i, t in enumerate(two): add(t, 2, moveAt=C("Satu per satu, tempelan pindah", 0.4 + i * 0.22))
    four = ["Meme grup", "Sapa grup", "Absen grup", "Info rapat", "Cari charger", "Stiker lucu", "Balas emoji", "Cek email promo", "Video lucu", "Kabar alumni", "Siap! lagi", "Foto makan siang"]
    for i, t in enumerate(four): add(t, 3, moveAt=C("Satu per satu, tempelan pindah", 0.6 + i * 0.2))
    for i, t in enumerate(["Foto spanduk", "Tanya kabar", "Sticker ulang"]):
        add(t, None, fallAt=C("menempelkan semuanya ke satu kotak", 2.2 + i * 0.35))
    return n
def mx9(**kw):
    o = {"type": "matrix4", "fillAt": C("menempelkan semuanya ke satu kotak", 0.2), "per": 0.1, "notes": notes9(), "tint": True}
    o.update(kw); return o

A = []

# 1 ------------------------------------------------------------------ PEMBUKA DINGIN: meja Bayu, 10.04
KER1 = ker("10:04", "pagi")
A.append({"n": 1, "name": "Meja Bayu, pukul 10.04", "loc": "kerja", "music": "tense", "pre": 0.5, "post": 0.5, "trans": "cut",
  "locOpt": KER1, "props": [CHAIR, desk(laptop=1)],
  "lines": [{"who": "joko", "from": "Mas Bayu, saya sudah di toko", "to": "kasirnya mana?", "text": "Mas Bayu, saya sudah di toko. Mesin kasirnya mana?", "label": "Pak Joko", "maxW": 560, "size": 40, "shots": [0]}],
  "sfx": [{"at": 0.2, "type": "ring", "vol": 0.8, "dur": 1.6}],
  "shots": [
    {"at": 0, "split": [
       {"loc": "kerja", "locOpt": KER1, "props": [CHAIR, desk(laptop=1)],
        "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": [1, 0.2]}, C("Itu Pak Joko", expr="shock")])],
        "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.25, "dur": 6}],
        "fx": [cap(560, 170, "MEJA BAYU · 10.04", bg=NAVY, col=YEL, at=0.3)]},
       {"loc": "tokobaru", "locOpt": dict(TOKO, fill=0.5),
        "actors": [{"who": "joko", "x": 760, "face": 1, "keys": [{"at": 0, "pose": "phone", "expr": "confused", "item": "phone"}, C("Mas Bayu, saya sudah", pose="shrug", item=None, expr="confused")]},
                   {"who": "rahma", "x": 1350, "y": 960, "layer": "back", "face": -1, "size": 560, "keys": [{"at": 0, "pose": "cross", "expr": "neutral", "look": [-1, -0.3]}, C("mesin kasirnya mana", pose="cross", expr="sad")]}],
        "cam": [{"x": 1000, "y": 520, "zoom": 1.0}, {"at": 0, "x": 1040, "y": 520, "zoom": 1.1, "dur": 6}],
        "fx": [cap(1450, 170, "TOKO BU RAHMA · GRAND OPENING", bg=RED, size=30, at=0.5)]}]},
    {"cue": "Itu Pak Joko", "d": -0.2, "trans": "cut", "loc": "tokobaru", "locOpt": dict(TOKO, fill=0.5),
     "actors": [{"who": "joko", "x": 760, "face": 1, "keys": [{"at": 0, "pose": "shrug", "expr": "confused"}]},
                {"who": "rahma", "x": 1450, "face": -1, "keys": [{"at": 0, "pose": "cross", "expr": "sad", "look": [-1, -0.4]}, C("Hari ini toko baru", 0.4, look="down")]}],
     "cam": [{"x": 1060, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1100, "y": 540, "zoom": 1.14, "dur": 5}],
     "fx": [{"type": "nameTag", "cue": "Itu Pak Joko", "d": 0.2, "name": "Pak Joko", "role": "Teknisi pemasang", "x": 160, "y": 800, "out": C("Hari ini toko baru", 0.4)},
            cap(1450, 190, "HARI INI TOKO BARU DIBUKA", bg=ORANGE, cue="Hari ini toko baru", d=0.2)]},
    {"cue": "Dan mesin kasirnya masih di gudang", "d": -0.2, "trans": "cut", "loc": "gudang", "locOpt": g(**HOLD), "actors": [],
     "cam": [{"x": 900, "y": 460, "zoom": 1.1}, {"at": 0, "x": 760, "y": 480, "zoom": 1.5, "dur": 4}],
     "fx": [cap(1300, 220, "MASIH DI RAK GUDANG", bg=RED, at=0.5)]},
    insert("karena jadwal kirim", -0.2, {"type": "jadwalFile", "emptyText": "Belum ada jadwal minggu ini", "clock": "10:04", "waAt": 0.8, "waN": 147, "chip": "FILE KOSONG", "chipAt": 1.2}, trans="zoom"),
    {"cue": "Padahal kemarin Bayu membalas", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": KER1, "props": [CHAIR, desk(laptop=1)],
     "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "sad", "look": "down"}, C("Ia orang paling sibuk", expr="proud", pose="sit", item=None, look="cam"), C("Lalu bagaimana", pose="sit", expr="shock", emote="?", look="cam")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.2}, {"at": 0, "x": 960, "y": 560, "zoom": 1.34, "dur": 10}],
     "fx": [cap(1450, 170, "147 PESAN DIBALAS KEMARIN", bg=NAVY, col=YEL, at=0.3), cap(1450, 300, "ORANG PALING SIBUK", bg=GREEN, cue="Ia orang paling sibuk", d=0.1),
            cap(1450, 430, "PEKERJAAN TERPENTING: TERLEWAT", bg=RED, size=34, cue="Lalu bagaimana pekerjaan", d=0.2)]},
  ]})

# 2 ------------------------------------------------------------------ JUDUL
A.append({"n": 2, "name": "Kartu judul", "vo": False, "dur": 8.2, "noHeader": True, "noCaption": True, "music": "none", "trans": "flash",
  "shots": [{"at": 0, "useLoc": False, "actors": [], "fx": [{"type": "titleKP", "at": 0, "disc": 2.2, "eps": "EPS 1", "topic": "WAKTU & PRIORITAS",
     "hook": "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini"}]}]})

# 3 ------------------------------------------------------------------ Pagi Bayu yang biasa
A.append({"n": 3, "name": "Pagi Bayu yang biasa", "loc": "kerja", "music": "light", "trans": "flash",
  "locOpt": ker("08:00", "pagi"), "props": [CHAIR, desk(laptop=1)],
  "lines": [{"who": "bayu", "from": "Siap!", "to": "Siap!", "text": "Siap!", "label": "Bayu", "kind": "shout", "min": 1.0, "size": 46, "shots": [4]},
            {"who": "bayu", "from": "Siap, Bos!", "to": "Siap, Bos!", "text": "Siap, Bos!", "label": "Bayu", "kind": "shout", "min": 1.0, "size": 46, "shots": [4]},
            {"who": "bayu", "from": "Meluncur!", "to": "Meluncur!", "text": "Meluncur!", "label": "Bayu", "kind": "shout", "min": 1.0, "size": 46, "shots": [4]}],
  "shots": [
    {"at": 0, "actors": [BS(item="helmet", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": "cam"}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.28, "dur": 7}],
     "fx": [cap(560, 170, "PAGI · 08.00", bg=NAVY, col=YEL, at=0.3), {"type": "nameTag", "cue": "Ini Bayu", "d": 0.0, "name": "Bayu", "role": "Staf operasional", "x": 160, "y": 800, "out": C("Tugasnya mengatur pengiriman", -0.3)}]},
    {"cue": "Tugasnya mengatur pengiriman", "d": -0.2, "trans": "cut",
     "actors": [BS(keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": "cam"}, C("menjadwalkan teknisi", pose="point", expr="proud")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.1}, {"at": 0, "x": 960, "y": 560, "zoom": 1.2, "dur": 10}],
     "fx": [cap(1520, 200, "MESIN KASIR", bg=ORANGE, cue="mesin kasir", d=0.0), cap(1520, 320, "PRINTER", bg="#2F6F73", cue="printer", d=0.0), cap(1520, 440, "PEMINDAI", bg="#5B7DB1", cue="dan pemindai", d=0.0),
            cap(1500, 580, "JADWALKAN TEKNISI", bg=GREEN, cue="menjadwalkan teknisi", d=0.0)]},
    {"cue": "Setiap pagi, sebelum helmnya dilepas", "d": -0.2, "trans": "cut",
     "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "happy", "look": [1, 0.4]}])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 820}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 820, "dur": 5}],
     "fx": [cap(1450, 200, "HELM BELUM DILEPAS", bg=NAVY, col=YEL, at=0.6)]},
    insert("Ada sembilan grup kerja", -0.3, {"type": "chat16", "name": "Grup Operasional", "sub": "9 grup aktif", "ch": "G", "col": "#3BA36B",
           "msgs": [{"t": 0.2, "text": "Bay, kiriman Toko Maju sudah?", "from": "Nisa", "time": "08.01", "read": 1.2}, {"t": 0.9, "me": True, "text": "Siap!", "time": "08.01"},
                    {"t": 1.7, "text": "Galon habis, Bay", "from": "Grup Kantor", "time": "08.02"}, {"t": 2.4, "text": "Mas, fakturnya?", "from": "Vendor Kurir", "time": "08.02"}],
           "chip": "9 GRUP KERJA", "chipAt": 0.8, "chipBg": "#3BA36B", "chip2": "NOTIFIKASI TERUS MASUK", "chip2At": 2.6, "chip2Bg": "#D9483B"}, trans="zoom"),
    {"cue": "Dan Bayu punya satu kebanggaan", "d": -0.2, "trans": "cut",
     "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "proud", "look": "cam"}, C("Siap!", pose="phone", expr="laugh", jump=14), C("Siap, Bos!", jump=14), C("Meluncur!", jump=18)])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 820}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 820, "dur": 8}],
     "fx": [cap(1450, 200, "BALAS KURANG DARI 1 MENIT", bg=GREEN, cue="tidak ada pesan yang menunggu", d=0.0)]},
    insert("Semua orang suka bekerja dengan Bayu", -0.2, {"type": "jadwalFile", "emptyText": "Jadwal kirim & pasang · belum diisi", "blink": True, "coverFrom": C("karena Bayu selalu", -0.3),
           "covers": [{"at": C("Semua orang suka bekerja", 0.5)}, {"at": C("karena Bayu selalu", -0.2)}, {"at": C("selalu menjawab", -0.4)}], "chip": "TERTUTUP CHAT", "chipAt": C("selalu menjawab", 0.2), "chipBg": "#D9483B"}, trans="zoom"),
  ]})

# 4 ------------------------------------------------------------------ Montase "sebentar kok"
def kerja4(clock, actor, fx, cue, d=-0.2, **kw):
    sh = {"cue": cue, "d": d, "trans": "whip", "loc": "kerja", "locOpt": ker(clock, "pagi" if clock < "12" else "siang"), "props": [CHAIR, desk(laptop=1), pdesk(buzz=1)],
          "actors": [actor], "cam": [{"x": 1000, "y": 560, "zoom": 1.12}, {"at": 0, "x": 960, "y": 560, "zoom": 1.22, "dur": 5}], "fx": fx}
    sh.update(kw); return sh
A.append({"n": 4, "name": "Montase sebentar kok", "loc": "kerja", "music": "tense", "trans": "whip",
  "locOpt": ker("09:10", "pagi"), "props": [CHAIR, desk(laptop=1), pdesk(buzz=1)],
  "fx": [{"type": "msgCount", "at": C("Permintaannya datang terus", 0.2), "x": 1600, "y": 215, "from": 0,
          "steps": [{"at": C("Nisa minta foto kardus printer", 0.3), "v": 12}, {"at": C("Grup kantor bertanya", 0.3), "v": 48}, {"at": C("Vendor kurir menanyakan faktur", 0.3), "v": 97},
                    {"at": C("Semuanya terasa mendesak", 0.0), "v": 147}]}],
  "sfx": [C("Permintaannya datang terus", 0.0, type="buzz", vol=0.6, dur=1.0), C("Vendor kurir menanyakan faktur", 0.0, type="buzz", vol=0.6, dur=1.0)],
  "shots": [
    {"at": 0, "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "happy", "look": [1, 0.4]}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.12}, {"at": 0, "x": 960, "y": 560, "zoom": 1.22, "dur": 2.5}],
     "fx": [cap(560, 170, "09.10", bg=NAVY, col=YEL, at=0.2)]},
    insert("Nisa minta foto kardus printer", -0.2, {"type": "chat16", "name": "Nisa", "sub": "online", "ch": "N", "col": "#D9483B",
           "msgs": [{"t": 0.2, "text": "Kak, minta foto kardus printer ya. Sebentar kok, Kak.", "time": "09.10"}, {"t": C("Grup kantor bertanya", -1.4), "me": True, "text": "Siap!", "time": "09.11"}],
           "chip": "09.10", "chipAt": 0.1, "chipBg": "#13223D", "chipCol": "#F6C343"}, trans="whip"),
    {"cue": "Grup kantor bertanya", "d": -0.2, "trans": "whip", "loc": "pantry", "locOpt": {"time": "pagi", "clock": "09:40"},
     "props": [{"type": "galon", "x": 1350, "y": 1000, "keys": [{"at": 0, "x": 1350}, C("Bayu yang berdiri", 0.9, x=5000, dur=0.05)]}],
     "actors": [B(560, keys=[{"at": 0, "pose": "phone", "item": "phone", "expr": "confused", "look": [1, 0.1]}, C("Bayu yang berdiri", -0.1, x=1250, dur=1.0, pose="hold", item="galon", expr="proud")])],
     "cam": [{"x": 960, "y": 540, "zoom": 1.05}, {"at": 0, "x": 980, "y": 540, "zoom": 1.12, "dur": 5}],
     "fx": [cap(560, 170, "09.40 · GALON SIAPA YANG ANGKAT?", bg=NAVY, col=YEL, at=0.2)]},
    kerja4("10:30", BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": [1, 0.3]}]), [cap(560, 170, "10.30 · VENDOR: FAKTURNYA MANA?", bg="#5B7DB1", at=0.2)], "Vendor kurir menanyakan faktur"),
    kerja4("11:15", BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "shock", "look": [1, 0.3]}]), [cap(560, 170, "11.15 · PEMASARAN: DATA BULAN LALU", bg="#C2691F", at=0.2)], "Tim pemasaran minta data"),
    kerja4("13:00", BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "scared", "look": [1, 0.3]}, C("Semuanya terasa mendesak", pose="facepalm", item=None, expr="tired")]),
           [cap(560, 170, "13.00 · ALUMNI KANTOR LAMA: [STIKER]", bg="#6E2430", at=0.2), cap(1500, 400, "SEMUANYA TERASA MENDESAK", bg=RED, cue="Semuanya terasa mendesak", d=0.0)], "Semuanya terasa mendesak"),
    insert("Di antara semua itu", -0.2, {"type": "jadwalFile", "emptyText": "Jadwal kirim & pasang · belum diisi", "blink": True, "coverFrom": C("yang terus ia geser", 0.0),
           "covers": [{"at": C("yang terus ia geser", 0.3)}, {"at": C("untuk minggu ini", -0.4)}], "chip": "DIGESER TERUS", "chipAt": C("yang terus ia geser", 0.2)}, trans="zoom"),
    {"cue": "Nanti sore saja,", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": ker("13:20", "siang"), "props": [CHAIR, desk(laptop=1), pdesk(buzz=1)],
     "actors": [BS(item="phone", keys=[{"at": 0, "pose": "think", "expr": "neutral", "look": [0.5, -0.6]}, C("Itu kan butuh", expr="happy", pose="sit")])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 820}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 820, "dur": 5}],
     "fx": [card("Nanti sore saja,", "\"Nanti sore saja.\"", d=0.1, x=1450, y=240, size=56, maxW=620), card("Itu kan butuh", "\"Itu kan butuh waktu tenang.\"", d=0.0, x=1450, y=470, size=44, maxW=640)]},
  ]})

# 5 ------------------------------------------------------------------ Sore yang tidak pernah tenang
A.append({"n": 5, "name": "Sore yang tidak pernah tenang", "loc": "kerja", "music": "sad", "trans": "whip",
  "locOpt": ker("16:30", "sore"), "props": [CHAIR, desk(laptop=1), pdesk(buzz=1)],
  "lines": [{"who": "dodi", "from": "Besok kirim apa saja", "to": "apa saja, Bay?", "text": "Besok kirim apa saja, Bay?", "label": "Dodi", "kind": "shout", "maxW": 520, "size": 42},
            {"who": "bayu", "from": "Santai, Dod", "to": "kukabari!", "text": "Santai, Dod. Besok pagi kukabari!", "label": "Bayu", "maxW": 520, "size": 42}],
  "shots": [
    {"at": 0, "actors": [BS(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.2]}, C("ada telepon lagi", pose="phone", item="phone", expr="tired")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.12}, {"at": 0, "x": 960, "y": 560, "zoom": 1.2, "dur": 4}],
     "fx": [cap(560, 170, "16.30", bg=NAVY, col=YEL, at=0.3)]},
    insert("Setiap kali file jadwal dibuka", -0.2, {"type": "jadwalFile", "rows": [C("Setiap kali file jadwal dibuka", 1.0)], "clkFrom": 990, "clkTo": 1050, "clkAt": 0.2, "clkDur": 6.5,
           "covers": [{"at": C("ada telepon lagi", 0.2)}, {"at": C("ada pesan lagi", 0.2)}], "chip": "MASIH 1 BARIS", "chipAt": C("ada pesan lagi", 1.0)}, trans="zoom"),
    {"cue": "Jam setengah enam", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": ker("17:30", "sore"), "props": [CHAIR, desk(laptop=0.3)],
     "actors": [BS(item="helmet", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": "cam"}, C("Hari ini ia sibuk sekali", expr="proud")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.25, "dur": 5}],
     "fx": [cap(560, 170, "17.30 · PULANG PUAS", bg=GREEN, at=0.3), cap(1450, 300, "FILE JADWAL: MASIH 1 BARIS", bg=RED, size=34, cue="Hari ini ia sibuk", d=0.4)]},
    {"cue": "Di parkiran, Dodi", "d": -0.2, "trans": "cut", "loc": "parkiran", "locOpt": {"time": "sore"}, "props": [{"type": "motor", "x": 1500, "y": 1010, "s": 0.95, "seat": 118}],
     "actors": [D(560, face=1, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": [1, 0]}, C("Besok kirim apa saja", pose="talk", expr="happy")]),
                B(1250, face=-1, item="helmet", keys=[{"at": 0, "pose": "hold", "expr": "happy", "look": [-1, 0]}, C("Santai, Dod", pose="hold", expr="laugh")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.05}, {"at": 0, "x": 960, "y": 560, "zoom": 1.12, "dur": 6}],
     "fx": [cap(560, 170, "PARKIRAN · SORE", bg=NAVY, col=YEL, at=0.3)]},
    {"cue": "Besok paginya, Bayu membuka ponsel", "d": -0.2, "trans": "fade", "loc": "kerja", "locOpt": ker("08:00", "pagi"), "props": [CHAIR, desk(laptop=1), pdesk(buzz=1)],
     "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [1, 0.4]}, C("Dan sisanya kamu sudah tahu", expr="scared", emote="sweat")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.1}, {"at": 0, "x": 960, "y": 560, "zoom": 1.25, "dur": 5}],
     "fx": [cap(560, 170, "KEESOKAN PAGI · 08.00", bg=NAVY, col=YEL, at=0.3), card("Dan sisanya kamu sudah tahu", "Dan sisanya kamu sudah tahu.", d=0.0, x=1450, y=300, size=52, maxW=620)]},
  ]})

# 6 ------------------------------------------------------------------ Lari ke gudang
A.append({"n": 6, "name": "Lari ke gudang", "loc": "gudang", "music": "tense", "trans": "flash",
  "lines": [{"who": "dodi", "from": "Surat jalannya mana", "to": "jam delapan", "text": "Surat jalannya mana, Bay? Kurir sudah jalan dari jam delapan.", "label": "Dodi", "maxW": 560, "size": 40, "shots": [1]},
            {"who": "bayu", "from": "Bayu memesan ojek barang", "to": "mengangkat kardus itu sendiri", "text": "Pakai ojek barang! Sekarang!", "label": "Bayu", "kind": "shout", "maxW": 520, "size": 42, "shots": [3], "min": 2.4}],
  "sfx": [{"at": 0.3, "type": "steps", "vol": 0.6, "dur": 2.2}],
  "shots": [
    {"at": 0, "loc": "lorong", "locOpt": {}, "actors": [B(-300, keys=[{"at": 0, "x": -300, "pose": "idle", "expr": "scared"}, {"at": 0.2, "x": 1750, "dur": 2.6, "expr": "scared"}])],
     "cam": [{"x": 900, "y": 540, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.1, "dur": 3}],
     "fx": [cap(560, 170, "10.20", bg=NAVY, col=YEL, at=0.2)]},
    {"cue": "Dodi menatapnya dengan bingung", "d": -0.3, "trans": "cut", "loc": "gudang", "locOpt": g(**HOLD),
     "actors": [D(1350, keys=[{"at": 0, "pose": "hips", "expr": "confused", "look": [-1, 0]}, C("Surat jalannya mana", pose="shrug", expr="confused")]),
                B(560, keys=[{"at": 0, "pose": "idle", "expr": "scared", "emote": "sweat", "look": [1, 0]}])],
     "cam": [{"x": 900, "y": 520, "zoom": 1.05}, {"at": 0, "x": 960, "y": 520, "zoom": 1.15, "dur": 6}],
     "fx": [cap(560, 170, "JAM DINDING GUDANG: 10.20", bg=NAVY, col=YEL, at=0.3), cap(1450, 190, "KURIR JALAN SEJAK 08.00", bg=RED, size=32, cue="jam delapan", d=0.0)]},
    {"cue": "Mesin kasir untuk Bu Rahma masih duduk manis", "d": -0.2, "trans": "cut", "loc": "gudang", "locOpt": g(**HOLD), "actors": [],
     "cam": [{"x": 900, "y": 460, "zoom": 1.1}, {"at": 0, "x": 780, "y": 470, "zoom": 1.55, "dur": 5}],
     "fx": [cap(1300, 220, "RAK PALING ATAS", bg=RED, at=0.6)]},
    {"cue": "Bayu memesan ojek barang", "d": -0.2, "trans": "cut", "loc": "gudang", "locOpt": g(boxes=[[1760, 2]]),
     "actors": [B(900, keys=[{"at": 0, "pose": "phone", "item": "phone", "expr": "scared"}, C("menulis surat jalan", -0.1, pose="type", item="paper", expr="neutral", look="down"), C("mengangkat kardus", -0.2, pose="hold", item="box", expr="tired", emote="sweat")])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 900}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 900, "dur": 9}],
     "fx": [cap(1450, 200, "OJEK BARANG", bg=ORANGE, at=0.5), cap(1450, 320, "SURAT JALAN: TULIS TANGAN", bg=NAVY, cue="menulis surat jalan", d=0.0), cap(1450, 440, "ANGKAT SENDIRI", bg=RED, cue="mengangkat kardus", d=0.0)]},
    {"cue": "Mesin kasir tiba di toko jam satu siang", "d": -0.3, "trans": "whip", "loc": "tokobaru", "locOpt": dict(TOKO, time="siang", fill=0.5),
     "actors": [{"who": "rahma", "x": 600, "face": 1, "keys": [{"at": 0, "pose": "cross", "expr": "sad", "look": [1, 0]}]},
                {"who": "joko", "x": 1250, "face": -1, "item": "box", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1000, "y": 540, "zoom": 1.14, "dur": 4}],
     "fx": [cap(560, 170, "13.00", bg=NAVY, col=YEL, at=0.2), cap(1450, 250, "TERLAMBAT 3 JAM", bg=RED, cue="Tiga jam terlambat", d=0.0)]},
    {"cue": "Hari pertama Bu Rahma membuka toko", "d": -0.2, "trans": "cut", "loc": "tokobaru", "locOpt": dict(TOKO, time="siang", fill=0.5, counterX=1000),
     "actors": [{"who": "kasir", "x": 1000, "face": -1, "item": "notebook", "keys": [{"at": 0, "pose": "hold", "expr": "confused", "look": "down"}, C("kasirnya mencatat", pose="type", expr="neutral", look="down")]}],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.2}, {"at": 0, "x": 960, "y": 580, "zoom": 1.34, "dur": 6}],
     "fx": [card("kasirnya mencatat", "Mencatat di buku tulis", d=0.0, x=1450, y=260, size=48, maxW=560)]},
  ]})

# 7 ------------------------------------------------------------------ Ruang Pak Hendra
BOS = {"time": "sore", "deskX": 1300, "folder": True}
A.append({"n": 7, "name": "Ruang Pak Hendra", "loc": "bos", "music": "sad", "trans": "iris",
  "locOpt": BOS,
  "lines": [{"who": "hendra", "from": "Kenapa bisa terlewat", "to": "terlewat, Bay", "text": "Kenapa bisa terlewat, Bay?", "label": "Pak Hendra", "maxW": 520, "size": 42, "shots": [1]},
            {"who": "bayu", "from": "Saya sibuk sekali kemarin", "to": "kemarin, Pak", "text": "Saya sibuk sekali kemarin, Pak.", "label": "Bayu", "maxW": 520, "size": 42, "shots": [2]},
            {"who": "hendra", "from": "Sibuk mengerjakan apa", "to": "mengerjakan apa", "text": "Sibuk mengerjakan apa?", "label": "Pak Hendra", "maxW": 520, "size": 42, "shots": [4]}],
  "shots": [
    {"at": 0, "actors": [H(1450, item="phone", keys=[{"at": 0, "pose": "phone", "expr": "neutral", "look": [-1, 0.1]}]), B(560, item="phoneBuzz", keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.05}, {"at": 0, "x": 920, "y": 520, "zoom": 1.15, "dur": 5}],
     "fx": [cap(560, 170, "SORE · RUANG PAK HENDRA", bg=NAVY, col=YEL, at=0.3)]},
    {"cue": "Kenapa bisa terlewat", "d": -0.4, "trans": "cut",
     "actors": [H(1250, item=None, keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [-1, 0.1]}, C("Saya sibuk sekali kemarin", pose="idle", expr="neutral")]), B(560, item="phoneBuzz", keys=[{"at": 0, "pose": "hold", "expr": "scared", "look": [1, 0]}])],
     "cam": [{"on": "hendra", "fit": 0.24, "sx": 1050}, {"at": 0, "on": "hendra", "fit": 0.3, "sx": 1050, "dur": 5}]},
    {"cue": "Saya sibuk sekali kemarin", "d": -0.3, "trans": "cut",
     "actors": [B(700, item="phoneBuzz", keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}]), H(1450, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.1]}])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 700}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 700, "dur": 4}]},
    {"cue": "Pak Hendra mengangguk pelan", "d": -0.2, "trans": "cut",
     "actors": [H(1300, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.1]}, C("Sibuk mengerjakan apa", pose="talk", expr="confused")]), B(560, item="phoneBuzz", keys=[{"at": 0, "pose": "hold", "expr": "sad", "look": "down"}])],
     "cam": [{"on": "hendra", "fit": 0.24, "sx": 1100}, {"at": 0, "on": "hendra", "fit": 0.3, "sx": 1100, "dur": 5}]},
    {"cue": "Bayu membuka mulut", "d": -0.2, "trans": "cut",
     "actors": [B(700, item="phoneBuzz", keys=[{"at": 0, "pose": "hold", "expr": "shock", "look": [1, 0]}, C("Ia mencoba mengingat", expr="confused", look=[0.4, -0.7]), C("Ia membuka ponselnya", expr="sad", look="down")]), H(1500, keys=[{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0.1]}])],
     "cam": [{"on": "bayu", "fit": 0.24, "sx": 700}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 700, "dur": 12}],
     "fx": [cap(1450, 190, "MEMBALAS PESAN", bg=NAVY, col=YEL, cue="Membalas pesan.", d=0.0), cap(1450, 310, "MENGANGKAT GALON", bg=NAVY, col=YEL, cue="Mengangkat galon.", d=0.0),
            cap(1450, 430, "MENGIRIM FOTO", bg=NAVY, col=YEL, cue="Mengirim foto.", d=0.0), cap(1450, 600, "TIDAK TAHU HARUS MEMBALAS APA", bg=RED, size=34, cue="tidak tahu harus membalas apa", d=-0.6)]},
  ]})

# 8 ------------------------------------------------------------------ Riwayat chat (titik tegang)
A.append({"n": 8, "name": "Riwayat chat", "loc": "kerja", "music": "tense", "trans": "fade", "post": 0.4, "hold": 0.8,
  "locOpt": ker("21:40", "malam", lights=0.5), "props": [CHAIR, desk(laptop=1), pdesk(buzz=0.4)],
  "shots": [
    {"at": 0, "actors": [BS(item="phone", keys=[{"at": 0, "pose": "phone", "expr": "sad", "look": "down"}])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.3, "dur": 4}],
     "fx": [cap(560, 170, "MALAM ITU", bg=NAVY, col=YEL, at=0.3)]},
    insert("Seratus empat puluh tujuh", -1.9, {"type": "chatTower", "n": 147, "zoomAt": 3.4, "zoomDur": 4.6, "fileAt": 6.6, "hudAt": 0.5}, trans="zoom"),
  ]})

# 9 ------------------------------------------------------------------ Pantry, pagi berikutnya
PANT9 = {"time": "pagi", "clock": "08:20"}
A.append({"n": 9, "name": "Pantry, pagi berikutnya", "loc": "pantry", "music": "warm", "trans": "fade", "post": 0.8,
  "locOpt": PANT9,
  "lines": [{"who": "sinta", "from": "Tulis semua yang kamu kerjakan", "to": "kemarin, Bay", "text": "Tulis semua yang kamu kerjakan kemarin, Bay.", "label": "Sinta", "maxW": 520, "size": 40, "shots": [2]},
            {"who": "bayu", "from": "Semua orang nunggu", "to": "nunggu, Sin", "text": "Semua orang nunggu, Sin.", "label": "Bayu", "maxW": 480, "size": 40, "shots": [4]},
            {"who": "sinta", "from": "Kalau bukan kamu yang angkat", "to": "apa yang terjadi", "text": "Kalau bukan kamu yang angkat, apa yang terjadi?", "label": "Sinta", "maxW": 520, "size": 40, "shots": [5]},
            {"who": "bayu", "from": "Ya, orang lain yang angkat", "to": "yang angkat.", "text": "Ya, orang lain yang angkat.", "label": "Bayu", "maxW": 480, "size": 40, "shots": [5]},
            {"who": "sinta", "from": "Dodi bisa kirim sendiri", "to": "kirim sendiri", "text": "Dodi bisa kirim sendiri.", "label": "Sinta", "maxW": 480, "size": 40, "shots": [7]},
            {"who": "sinta", "from": "Itu masalahnya, Bay", "to": "masalahnya, Bay", "text": "Itu masalahnya, Bay.", "label": "Sinta", "maxW": 480, "size": 40, "shots": [8]}],
  "sfx": [C("Ia mengambil spidol", 0.2, type="typing", vol=0.4, dur=2.0)],
  "shots": [
    {"at": 0, "actors": [S(700, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0.1]}]), {"who": "bayu", "x": 1350, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "sad", "look": "down"}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.15, "dur": 8}],
     "fx": [cap(560, 170, "PAGI BERIKUTNYA · PANTRY", bg=NAVY, col=YEL, at=0.3), {"type": "nameTag", "cue": "Di pantry, Sinta", "d": 0.2, "name": "Sinta", "role": "Koordinator layanan pelanggan", "x": 160, "y": 800, "out": C("Ia tidak berkomentar", 0.0)}]},
    {"cue": "Ia mengambil spidol", "d": -0.2, "trans": "zoom", **NOLOC, "fx": [{"type": "matrix4", "drawAt": 0.4, "drawDur": 2.6, "title": "EMPAT KOTAK", "titleAt": 2.6, "tint": True}]},
    {"cue": "Tulis semua yang kamu kerjakan", "d": -0.3, "trans": "cut",
     "actors": [S(760, item="marker", keys=[{"at": 0, "pose": "point", "expr": "neutral", "look": [1, 0.1]}]), {"who": "bayu", "x": 1300, "face": -1, "item": "paper", "keys": [{"at": 0, "pose": "hold", "expr": "neutral", "look": [-1, 0]}, C("Bayu menulis", pose="type", expr="neutral", look="down")]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.2, "dur": 6}]},
    {"cue": "menempelkan semuanya ke satu kotak", "d": -1.2, "trans": "cut", **NOLOC,
     "fx": [mx9(noDraw=True, title="EMPAT KOTAK", titleAt=0.1, hl=[{"q": 0, "at": C("penting dan mendesak", 0.0), "out": C("Semua orang nunggu", -0.2)}],
                chip="31 TUGAS · SEMUA \"PENTING & MENDESAK\"", chipAt=C("Semua orang nunggu", 0.3), chipX=960, chipY=1020, chipBg="#D9483B")]},
    {"cue": "Semua orang nunggu, Sin", "d": -0.2, "trans": "cut", "loc": "pantry", "locOpt": PANT9,
     "actors": [S(760, item="cup", keys=[{"at": 0, "pose": "hold", "expr": "neutral", "look": [1, 0.1]}]), {"who": "bayu", "x": 1300, "face": -1, "keys": [{"at": 0, "pose": "talk", "expr": "sad", "look": [-1, 0]}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.2, "dur": 4}],
     "fx": [{"type": "card", "cue": "Semua orang nunggu, Sin", "d": 0.6, "style": "small", "text": "Mendesak bagi siapa?", "x": 960, "y": 220, "size": 68, "bg": "#C2691F", "out": C("Sinta mengambil satu tempelan", 0.0)}]},
    insert("Sinta mengambil satu tempelan", -0.2, mx9(noDraw=True, quiet=True), trans="cut"),
    {"cue": "Kalau bukan kamu yang angkat", "d": -0.3, "trans": "cut", "loc": "pantry", "locOpt": PANT9, "props": [{"type": "galon", "x": 1500, "y": 1000}],
     "actors": [S(760, item="marker", keys=[{"at": 0, "pose": "talk", "expr": "confused", "look": [1, 0.1]}]), {"who": "bayu", "x": 1250, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}, C("Ya, orang lain yang angkat", expr="sad", pose="shrug")]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.2, "dur": 4}]},
    insert("Tempelan berikutnya", -0.2, mx9(noDraw=True, quiet=True), trans="cut"),
    {"cue": "Dodi bisa kirim sendiri", "d": -0.3, "trans": "cut", "loc": "pantry", "locOpt": PANT9,
     "actors": [S(760, item="marker", keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [1, 0.1]}]), {"who": "bayu", "x": 1250, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}, C("Bayu tertawa malu", pose="scratch", expr="laugh")]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.2, "dur": 3}]},
    insert("Satu per satu, tempelan pindah", -0.2, mx9(noDraw=True, quiet=True, title="31 TUGAS → 3 PENTING", titleAt=C("Dari tiga puluh satu tugas", 0.0),
           hl=[{"q": 1, "at": C("Ia ada di kotak penting tapi", -0.4)}], chip="PENTING TAPI TIDAK MENDESAK", chipAt=C("Ia ada di kotak penting tapi", 0.4), chipBg="#3BA36B", chipX=960, chipY=1020), trans="cut"),
    {"cue": "Itu masalahnya, Bay", "d": -0.3, "trans": "cut", "loc": "pantry", "locOpt": PANT9,
     "actors": [S(760, item="cup", keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [1, 0.1]}, C("kalau ditunda terus", pose="pointUp", expr="confused")]), {"who": "bayu", "x": 1250, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "shock", "look": [-1, 0]}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.2, "dur": 8}],
     "fx": [cap(1450, 200, "DITUNDA TERUS → DARURAT", bg=RED, cue="suatu hari berubah jadi darurat", d=-0.8)]},
  ]})

# 10 ----------------------------------------------------------------- Empat kotak
A.append({"n": 10, "name": "Empat kotak", "loc": "pantry", "music": "warm", "trans": "fade",
  "locOpt": PANT9,
  "shots": [
    {"at": 0, "actors": [S(900, item="marker", keys=[{"at": 0, "pose": "point", "expr": "neutral", "look": [1, 0.1]}])],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 960, "y": 540, "zoom": 1.2, "dur": 3.5}],
     "fx": [cap(560, 170, "SINTA MENULIS ULANG 4 KOTAK", bg=NAVY, col=YEL, at=0.4)]},
    insert("Kotak pertama", -0.6, {"type": "matrix4", "mode": "card", "title": "MATRIKS PENTING–MENDESAK", "titleAt": 0.1,
           "items": [{"at": C("Kotak pertama", 0.0), "q": 0, "ex": "Mesin kasir toko yang buka hari ini"}, {"at": C("Kotak kedua", 0.0), "q": 1, "ex": "Jadwal kirim mingguan · 08.00–08.45"},
                     {"at": C("Kotak ketiga", 0.0), "q": 2, "ex": "Foto kardus → Dodi"}, {"at": C("Kotak keempat", 0.0), "q": 3, "ex": "Stiker grup alumni"}]}, trans="zoom"),
    {"cue": "Penting itu artinya", "d": -0.3, "trans": "cut", "loc": "pantry", "locOpt": PANT9,
     "actors": [S(900, item="marker", keys=[{"at": 0, "pose": "talk", "expr": "neutral", "look": [1, 0.1]}, C("Mendesak artinya", pose="pointUp", expr="neutral")]), {"who": "bayu", "x": 1450, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1040, "y": 540, "zoom": 1.2, "dur": 10}],
     "fx": [cap(1450, 190, "PENTING = BERPENGARUH KE KLIEN, TARGET, TUGAS UTAMA", bg=ORANGE, size=28, cue="Penting itu artinya", d=0.2),
            cap(1450, 330, "MENDESAK = ADA AKIBAT KALAU TIDAK SELESAI HARI INI", bg=RED, size=28, cue="Mendesak artinya", d=0.0)]},
  ]})

# 11 ----------------------------------------------------------------- Dua pertanyaan
QN = [{"text": "Mesin kasir Bu Rahma", "at": 0.3}, {"text": "Telepon klien", "at": 0.6}, {"text": "Faktur vendor", "at": 0.9, "to": 1, "moveAt": C("Kotak kedua", 0.0)},
      {"text": "Data pemasaran", "at": 1.2, "to": 2, "moveAt": C("Kotak ketiga", 0.0)}]
A.append({"n": 11, "name": "Dua pertanyaan", "loc": "pantry", "music": "warm", "trans": "fade",
  "locOpt": PANT9,
  "shots": [
    {"at": 0, "actors": [S(760, item="marker", keys=[{"at": 0, "pose": "talk", "expr": "happy", "look": [1, 0.1]}, C("Kedua, kalau tidak hari ini", pose="pointUp")]), {"who": "bayu", "x": 1300, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "neutral", "look": [-1, 0]}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 960, "y": 540, "zoom": 1.18, "dur": 12}],
     "fx": [{"type": "steps", "x": 1350, "y": 250, "gap": 230, "w": 1000, "title": "DUA PERTANYAAN",
             "items": [{"cue": "Pertama, kalau ini", "text": "Dampaknya ke klien atau targetku?"}, {"cue": "Kedua, kalau tidak hari ini", "text": "Kalau tidak hari ini, apa akibatnya?"}]}]},
    {"cue": "Bayu mencobanya untuk tugas hari ini", "d": -0.2, "trans": "zoom", **NOLOC,
     "fx": [{"type": "matrix4", "noDraw": True, "title": "TUGAS HARI INI", "titleAt": 0.2, "fillAt": 0.3, "per": 0.3, "notes": [dict(n, at=C("Bayu mencobanya untuk tugas hari ini", n["at"])) for n in QN],
             "hl": [{"q": 0, "at": C("kotak pertama Bayu tinggal", 0.0)}], "chip": "TINGGAL 2 TEMPELAN", "chipAt": C("kotak pertama Bayu tinggal", 0.8), "chipBg": "#3BA36B", "chipX": 960}]},
  ]})

# 12 ----------------------------------------------------------------- Satu aturan pagi
A.append({"n": 12, "name": "Satu aturan pagi", "loc": "kerja", "music": "light", "trans": "fade",
  "locOpt": ker("08:00", "pagi"), "props": [CHAIR, desk(laptop=1)],
  "sfx": [C("lalu membalik ponselnya", 0.2, type="thud", vol=0.9), C("Baru setelah itu Bayu membalik ponselnya", 0.2, type="thud", vol=0.9)],
  "shots": [
    {"at": 0, "loc": "pantry", "locOpt": PANT9, "actors": [S(900, keys=[{"at": 0, "pose": "pointUp", "expr": "happy", "look": [1, 0.1]}]), {"who": "bayu", "x": 1450, "face": -1, "keys": [{"at": 0, "pose": "idle", "expr": "tired", "look": [-1, 0]}]}],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.1}, {"at": 0, "x": 1000, "y": 540, "zoom": 1.2, "dur": 8}],
     "fx": [card("Kerjakan satu tugas penting dulu", "Satu tugas penting dulu, baru buka chat.", d=0.0, x=1440, y=250, size=52, maxW=620)]},
    {"cue": "Besok paginya, jam delapan", "d": -0.2, "trans": "cut", "props": [CHAIR, desk(laptop=1), pdesk(keys=[{"at": 0, "s": 1, "buzz": 1}, C("meraih ponsel", 0.5, s=0, dur=0.05)])],
     "actors": [BS(keys=[{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.6]}, C("meraih ponsel", 0.3, pose="phone", item="phone", expr="neutral"), C("Ia berhenti", 0.0, expr="shock", emote="!")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.25, "dur": 8}],
     "fx": [cap(560, 170, "08.00", bg=NAVY, col=YEL, at=0.3), cap(1450, 250, "KEBIASAAN", bg=RED, cue="Kebiasaan", d=0.0)]},
    {"cue": "lalu membalik ponselnya", "d": -0.4, "trans": "cut", "props": [CHAIR, desk(laptop=1), pdesk(keys=[{"at": 0, "s": 0, "buzz": 1}, C("lalu membalik ponselnya", 0.2, s=1, down=1, buzz=0, dur=0.05)])],
     "actors": [BS(keys=[{"at": 0, "pose": "phone", "item": "phone", "expr": "confused", "look": [1, 0.3]}, C("lalu membalik ponselnya", 0.1, pose="sit", item=None, expr="proud", look=[1, 0.7])])],
     "cam": [{"x": 1100, "y": 700, "zoom": 1.6}, {"at": 0, "x": 1040, "y": 690, "zoom": 1.75, "dur": 5}],
     "fx": [cap(560, 170, "LAYAR MENGHADAP MEJA", bg=NAVY, col=YEL, cue="Layarnya menghadap meja", d=0.0)]},
    insert("Ia membuka file jadwal", -0.2, {"type": "jadwalFile", "clkFrom": 480, "clkTo": 528, "clkAt": 0.3, "clkDur": 8.0, "fillAt": C("Ia membuka file jadwal", 1.0), "per": 0.5, "sendAt": C("terkirim ke Dodi", 0.3),
           "chip": "48 MENIT · SATU TUGAS", "chipAt": C("Empat puluh delapan menit", 0.0), "chipBg": "#3BA36B"}, trans="zoom"),
    insert("Beres, Bos!", -0.2, {"type": "chat16", "name": "Dodi · Gudang", "sub": "online", "ch": "D", "col": "#C2691F",
           "msgs": [{"t": 0.2, "me": True, "text": "Jadwal kirim & pasang minggu ini sudah kukirim ya, Dod.", "time": "08.48", "read": 1.2}, {"t": C("Beres, Bos!", 0.6), "text": "Beres, Bos! Jadwal sudah kuterima.", "time": "08.49"}]}, trans="whip"),
    {"cue": "Baru setelah itu Bayu membalik ponselnya", "d": -0.2, "trans": "cut", "props": [CHAIR, desk(laptop=1), pdesk(keys=[{"at": 0, "s": 1, "down": 1}, C("Baru setelah itu Bayu membalik ponselnya", 0.2, down=0, buzz=1, dur=0.05), C("Ia membalas semuanya", 0.0, s=0, dur=0.05)])],
     "actors": [BS(keys=[{"at": 0, "pose": "sit", "expr": "proud", "look": [1, 0.7]}, C("Dua puluh tiga pesan menunggu", expr="shock", look=[1, 0.7]), C("tidak ada yang kenapa-kenapa", expr="happy", pose="shrug"),
                         C("Ia membalas semuanya", -0.2, pose="phone", item="phone", expr="proud", look=[1, 0.3])])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.25, "dur": 10}],
     "fx": [{"type": "msgCount", "cue": "Dua puluh tiga pesan menunggu", "d": 0.0, "label": "PESAN MENUNGGU", "x": 1560, "y": 215, "from": 0, "steps": [{"at": C("Dua puluh tiga pesan menunggu", 0.2), "v": 23}]},
            cap(1500, 400, "TIDAK ADA YANG KENAPA-KENAPA", bg=GREEN, size=32, cue="tidak ada yang kenapa-kenapa", d=0.0), cap(1500, 520, "15 MENIT · SEMUA TERBALAS", bg=NAVY, col=YEL, cue="lima belas menit", d=-0.2)]},
  ]})

# 13 ----------------------------------------------------------------- Hari ketiga, godaan lama
A.append({"n": 13, "name": "Hari ketiga, godaan lama", "loc": "kerja", "music": "light", "trans": "fade",
  "locOpt": ker("09:30", "pagi"), "props": [CHAIR, desk(laptop=1), pdesk(buzz=1)],
  "shots": [
    {"at": 0, "actors": [BS(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.2]}, C("Ada yang bisa mengangkat galon", pose="sit", expr="neutral", look=[1, 0.7])])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.12}, {"at": 0, "x": 960, "y": 560, "zoom": 1.22, "dur": 4}],
     "fx": [cap(560, 170, "HARI KETIGA · 09.30", bg=NAVY, col=YEL, at=0.3)]},
    insert("Ada yang bisa mengangkat galon", -0.3, {"type": "chat16", "name": "Grup Kantor", "sub": "9 grup · ramai", "ch": "G", "col": "#2F6F73",
           "msgs": [{"t": 0.3, "text": "Ada yang bisa angkat galon?", "from": "Nisa", "time": "09.30"}, {"t": C("sampai jam sepuluh, ya.", 0.5), "me": True, "text": "Aku lagi pegang jadwal pasang sampai jam 10, ya.", "time": "09.31", "read": C("sampai jam sepuluh, ya.", 1.5)}],
           "input": [{"t": C("Jari Bayu sudah siap", 0.4), "text": "Siap!", "cps": 6, "del": C("Ia menahan diri", 0.2)},
                     {"t": C("Aku lagi pegang", -0.3), "text": "Aku lagi pegang jadwal pasang sampai jam 10, ya.", "cps": 20, "send": C("sampai jam sepuluh, ya.", 0.5)}],
           "chip": "TAHAN. JANGAN LANGSUNG \"SIAP!\"", "chipAt": C("Ia menahan diri", 0.3), "chipBg": "#C2691F", "chipSize": 34}, trans="zoom"),
    {"cue": "Dua menit kemudian", "d": -0.2, "trans": "whip", "loc": "pantry", "locOpt": {"time": "pagi", "clock": "09:33"},
     "props": [{"type": "galon", "x": 1300, "y": 1000, "keys": [{"at": 0, "x": 1300}, C("Oleh Dodi", -0.8, x=5000, dur=0.05)]}],
     "actors": [D(700, face=1, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}, {"at": 0.2, "x": 1150, "dur": 1.4}, C("Oleh Dodi", -1.0, pose="hold", item="galon", expr="happy")])],
     "cam": [{"x": 1000, "y": 540, "zoom": 1.05}, {"at": 0, "x": 1020, "y": 540, "zoom": 1.14, "dur": 6}],
     "fx": [cap(560, 170, "2 MENIT KEMUDIAN", bg=NAVY, col=YEL, at=0.3), {"type": "whistle", "who": "dodi", "cue": "sambil bersiul", "d": 0.0}]},
    {"cue": "Ternyata dunia tetap berputar", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": ker("09:45", "pagi"), "props": [CHAIR, desk(laptop=1), pdesk(down=1)],
     "actors": [BS(keys=[{"at": 0, "pose": "type", "expr": "proud", "look": [1, 0.2]}, C("walau Bayu tidak menjawab", expr="laugh", look="cam")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.15}, {"at": 0, "x": 960, "y": 560, "zoom": 1.25, "dur": 6}],
     "fx": [card("Ternyata dunia tetap berputar", "Dunia tetap berputar.", d=0.0, x=1450, y=270, size=56, maxW=620)]},
  ]})

# 14 ----------------------------------------------------------------- Jumat sore
A.append({"n": 14, "name": "Jumat sore", "loc": "gudang", "music": "hope", "trans": "whip",
  "locOpt": g(),
  "lines": [{"who": "hendra", "from": "Intinya?", "to": "Intinya?", "text": "Intinya?", "label": "Pak Hendra", "maxW": 420, "size": 44, "shots": [2]},
            {"who": "bayu", "from": "Intinya, Pak", "to": "tepat waktu", "text": "Intinya, Pak, semua toko minggu ini terpasang tepat waktu.", "label": "Bayu", "maxW": 560, "size": 40, "shots": [2]}],
  "shots": [
    {"at": 0, "props": [{"type": "weekBoard", "x": 1300, "y": 1000, "keys": [{"at": 0, "done": 0}, {"at": 0.6, "done": 5, "dur": 3.6}]}],
     "actors": [D(650, face=1, keys=[{"at": 0, "pose": "idle", "expr": "happy", "look": [1, 0]}, C("berwarna hijau", pose="thumbs", expr="laugh")])],
     "cam": [{"x": 1000, "y": 520, "zoom": 1.05}, {"at": 0, "x": 1060, "y": 520, "zoom": 1.14, "dur": 6}],
     "fx": [cap(560, 170, "JUMAT SORE", bg=NAVY, col=YEL, at=0.3), cap(560, 300, "SEMUA BARIS HIJAU", bg=GREEN, cue="berwarna hijau", d=0.0)]},
    insert("Bu Rahma mengirim foto", -0.2, {"type": "chat16", "name": "Bu Rahma", "sub": "Toko Bu Rahma", "ch": "R", "col": "#8E4A24",
           "msgs": [{"t": 0.4, "img": "rahma", "time": "16.02"}, {"t": C("Terima kasih, Mas", 0.0), "text": "Terima kasih, Mas. Minggu ini lancar.", "time": "16.02"}],
           "chip": "STRUK PERTAMA", "chipAt": C("memegang struk pertama", 0.0), "chipBg": "#3BA36B"}, trans="zoom"),
    {"cue": "Pak Hendra lewat di belakang meja Bayu", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": ker("16:40", "sore"), "props": [CHAIR, desk(laptop=1, cups=1), pdesk(down=1)],
     "actors": [H(300, keys=[{"at": 0, "x": 300, "pose": "idle", "expr": "neutral", "look": [1, 0]}, {"at": 0.2, "x": 1350, "dur": 3.0}, C("Intinya?", -0.4, x=1350, dur=0.01, pose="talk", expr="neutral", look=[-1, 0])]),
                BS(keys=[{"at": 0, "pose": "type", "expr": "neutral", "look": [1, 0.2]}, C("Bayu tersenyum", pose="sit", expr="happy", look=[1, 0]), C("Intinya, Pak", pose="talk", expr="proud")])],
     "cam": [{"x": 1000, "y": 560, "zoom": 1.1}, {"at": 0, "x": 1040, "y": 560, "zoom": 1.2, "dur": 8}]},
    {"cue": "Pesan yang ia balas minggu ini lebih sedikit", "d": -0.2, "trans": "cut", "loc": "kerja", "locOpt": ker("16:45", "sore"), "props": [CHAIR, desk(laptop=1, cups=1), pdesk(down=1)],
     "actors": [BS(keys=[{"at": 0, "pose": "sit", "expr": "happy", "look": [1, 0.2]}, C("Tapi untuk pertama kalinya", expr="proud", look="cam")])],
     "cam": [{"on": "bayu", "fit": 0.26, "sx": 820}, {"at": 0, "on": "bayu", "fit": 0.3, "sx": 820, "dur": 9}],
     "fx": [{"type": "counter", "at": 0.1, "label": "PESAN DIBALAS / HARI", "from": 147, "to": 62, "dur": 3.0, "good": 70, "x": 1550, "y": 215},
            cap(1450, 420, "TAHU PERSIS YANG DIKERJAKAN", bg=GREEN, size=34, cue="Bayu tahu persis", d=0.0)]},
  ]})

# 15 ----------------------------------------------------------------- Kartu "Coba besok pagi"
A.append({"n": 15, "name": "Coba besok pagi", "loc": "kerja", "music": "warm", "trans": "iris", "post": 3.0,
  "locOpt": ker("08:00", "pagi"), "props": [CHAIR, desk(laptop=1)],
  "shots": [
    {"at": 0, "blur": 9, "actors": [B(300, size=640, keys=[{"at": 0, "pose": "wave", "expr": "happy", "look": "cam"}, C("Satu: tulis", pose="pointUp", expr="happy"), C("Dua: yang penting", pose="hips", expr="proud"), C("Tiga: kerjakan", pose="pointUp", expr="laugh", jump=26)])],
     "cam": [{"x": 960, "y": 520, "zoom": 1.0}, {"at": 0, "x": 960, "y": 540, "zoom": 1.06, "dur": 18}],
     "fx": [{"type": "matrixMini", "at": 0.6, "x": 250, "y": 190, "s": 0.8},
            {"type": "lesson", "cue": "Satu: tulis", "d": -0.6, "tag": "COBA BESOK PAGI", "items": [{"cue": "Satu: tulis", "text": "Tulis semua tugasmu, masukkan ke 4 kotak"},
             {"cue": "Dua: yang penting", "text": "Yang penting tapi tidak mendesak: beri jam"}, {"cue": "Tiga: kerjakan", "text": "Kerjakan satu tugas penting sebelum membuka chat"}]}]},
  ]})

# 16 ----------------------------------------------------------------- Penggoda Eps 2 + layar akhir
A.append({"n": 16, "name": "Cuplikan Eps 2 + layar akhir", "loc": "kerja", "music": "tense", "trans": "flash", "post": 6.5,
  "locOpt": ker("13:00", "siang"), "props": [CHAIR, desk(laptop=1)],
  "lines": [{"who": "yoga", "from": "meletakkan sebuah pengatur waktu", "to": "di mejanya", "text": "Dua puluh lima menit. Satu tugas.", "label": "Yoga", "maxW": 520, "size": 42, "min": 2.6}],
  "shots": [
    {"at": 0, "trans": "cut", **NOLOC, "fx": [{"type": "tabsLaptop", "from": 540, "to": 720, "dur": 7.0, "pct": 0.2, "chip": "3 JAM · BARU 20%", "chipAt": C("dua puluh persen", -0.6)}]},
    {"cue": "Lalu Yoga meletakkan", "d": -0.2, "trans": "whip", "loc": "kerja", "locOpt": ker("13:05", "siang"),
     "props": [CHAIR, desk(laptop=1, mug=False), {"type": "tomatoTimer", "x": 1180, "y": 770, "layer": "front", "keys": [{"at": 0, "s": 0}, C("meletakkan sebuah pengatur waktu", 0.0, s=1, dur=0.4)]}],
     "actors": [{"who": "yoga", "x": 850, "face": 1, "neckphones": True, "keys": [{"at": 0, "pose": "sit", "expr": "neutral", "look": [1, 0.6]}, C("meletakkan sebuah pengatur waktu", 0.0, pose="point", expr="proud"), C("di mejanya", pose="sit", expr="happy")]}],
     "cam": [{"x": 1050, "y": 600, "zoom": 1.3}, {"at": 0, "x": 1060, "y": 620, "zoom": 1.45, "dur": 6}],
     "fx": [cap(560, 170, "SEBENTAR LAGI · EPS 2", bg="#6E2430", at=0.3)]},
    {"cue": "Saksikan di Kelas Produktif episode dua", "d": -0.2, "trans": "flash", "blur": 8,
     "props": [CHAIR, desk(laptop=1, mug=False), {"type": "tomatoTimer", "x": 1180, "y": 770, "layer": "front", "ring": True}],
     "actors": [{"who": "yoga", "x": 850, "face": 1, "neckphones": True, "keys": [{"at": 0, "pose": "sit", "expr": "happy", "look": "cam"}]}],
     "cam": [{"x": 960, "y": 540, "zoom": 1.05}, {"at": 0, "x": 960, "y": 540, "zoom": 1.1, "dur": 4}],
     "fx": [{"type": "card", "at": 0.1, "text": "SUSAH FOKUS KERJA?", "tag": "KELAS PRODUKTIF · EPS 2", "sub": "Coba teknik 25 menit ini", "size": 96, "bg": "#C2691F"}]},
    {"cue": "Kalau video ini bermanfaat", "d": -0.2, "trans": "fade", "actors": [], "useLoc": False, "noHeader": True,
     "fx": [{"type": "endscreen", "clickAt": C("subscribe Tangani"), "askAt": C("Dan tulis di kolom komentar"), "nextQuote": "\"Dua puluh lima menit.\"", "nextSub": "Satu tugas.", "nextTitle": "Kelas Produktif · Eps 2",
             "nextWho": "yoga", "nextKey": {"pose": "pointUp", "expr": "happy"}, "nextThumb": False, "playlistHead": "Kelas Produktif:", "playlist": "Waktu & Prioritas", "playlistEps": "Eps 1 · 2 · 3",
             "ask": "Berapa grup kerja yang ada di ponselmu? Tulis di komentar!"}]},
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
                if k == "from" and "time" in o: continue   # nama pengirim di pesan chat, bukan cue
                if isinstance(v, str) and v.lower() not in nar.get(n, "").lower(): bad.append((n, k, v))
            for v in o.values(): walk(v, n)
        elif isinstance(o, list):
            for v in o: walk(v, n)
    for a in A: walk(a, a["n"])
    for b in bad: print("CUE TIDAK DITEMUKAN:", b)
    return not bad


A = json.loads(json.dumps(A))   # helper dicts dipakai bersama antar shot → salin dulu sebelum shot_local mengubahnya
shot_local(A)
for a in A:   # story16 hanya membaca sfx di tingkat adegan
    for sh in a.get("shots", []):
        if sh.get("sfx"): a.setdefault("sfx", []).extend(sh.pop("sfx"))
ep = {"slug": "kelas-01", "title": "Sibuk Seharian Tapi Tidak Ada yang Selesai? Atur Prioritas Begini | Kelas Produktif Eps 1",
      "series": "Kelas Produktif", "story": "Waktu & Prioritas", "eps": "1", "naskah": NASKAH, "minDur": 495,
      "chapters": [[1, "Mesin kasirnya mana?"], [3, "Bayu yang selalu menjawab"], [6, "Terlambat tiga jam"], [9, "Empat kotak Sinta"], [10, "Matriks penting–mendesak"], [12, "Satu tugas sebelum chat"], [15, "Coba besok pagi"], [16, "Episode berikutnya"]],
      "parts": [["Masalah", 0, 3], ["Memburuk", 3, 4], ["Cara yang benar", 4, 6], ["Penutup", 6, 8]],
      "lessons": ["Tulis semua tugasmu, lalu masukkan ke empat kotak: penting dan mendesak, penting tidak mendesak, mendesak tidak penting, tidak penting.",
                  "Yang penting tapi tidak mendesak: beri jam, jangan cuma \"nanti\".",
                  "Kerjakan satu tugas penting sebelum membuka chat."],
      "youtube": {
        "lessonHead": "Coba besok pagi:",
        "about": "Kelas Produktif adalah serial belajar kerja dari Tangani Talenta: cerita singkat, cara praktis yang bisa dicoba besok.",
        "desc": "Sibuk seharian, membalas ratusan pesan, tapi pekerjaan terpenting malah terlewat? Ikuti Bayu, staf operasional yang selalu menjawab dalam satu menit, dan belajar menyusun prioritas kerja harian dengan matriks penting-mendesak: empat kotak, dua pertanyaan, dan satu aturan pagi. Cerita fiksi, tokoh dan kejadian rekaan.",
        "ask": "Berapa grup kerja yang ada di ponselmu? Tulis di kolom komentar.",
        "next": "Kelas Produktif Eps 2: Susah Fokus Kerja? Coba Teknik 25 Menit Ini (Pomodoro).",
        "tags": "kelas produktif, prioritas kerja, matriks eisenhower, penting mendesak, produktivitas kerja, manajemen waktu, sibuk tapi tidak produktif, tips kerja, dunia kerja, Tangani Talenta",
        "hashtags": "#KelasProduktif #produktivitas #duniakerja",
        "adAfter": 8},
      "thumb": {"kind": "kp1", "lines": ["SIBUK TAPI", "TAK SELESAI?"], "hl": "ATUR PRIORITAS", "lineSize": 90, "hlSize": 72, "badge": "EPS 1", "tag": "KELAS PRODUKTIF · EPS 1"},
      "extras": extras, "adegan": A}
ok = check_cues(A)
json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
print("adegan:", len(A), "· cue", "OK" if ok else "BERMASALAH")
