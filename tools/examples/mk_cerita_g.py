"""Generator mode cerita, paket ceritag: SP26 RN26 KD26 JS26 SC26 -> CODE/project.json (+ .tts.json).
Jalankan dari root proyek: python3 -I $W/ceritag/mk.py [CODE ...]"""
import json, os, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE.parent))
from vo import VO
from mk_lib import check, LABEL, base

def D(*a, **k):
    r = {}
    for x in a: r.update(x)
    r.update(k); return r

# ---- tokoh ----
BIMO = dict(hair="spiky", glasses=True, shirt="#5B7DB1", pants="#3B2418", skin="c", idcard="#C2691F")
LAILA = dict(hair="long", hairColor="#3B2418", shirt="#C2691F", pants="#5A3A2A", skin="e", collar=False)
FAJAR = dict(hair="short", hat="kopiah", hatColor="#2C2433", beard="goatee", shirt="#7FA563", pants="#3B2418", skin="b", idcard="#2F6F73")
MIRA = dict(hair="curly", hairColor="#4A2C1C", shirt="#2F6F73", pants="#3B2418", skin="a", glasses=True)
REKAN = dict(hair="bun", shirt="#E8A55B", pants="#3B2418", skin="d", collar=False)
REKAN2 = dict(hair="side", shirt="#F3D9B5", tie="#3B2418", pants="#3B2418", skin="c")
RUDI = dict(hair="side", hairColor="#2B1A12", jacket="#3B4A6B", shirt="#E9E2D6", pants="#2C2433", skin="d")
WULAN = dict(hair="hijab", hijab="#2F6F73", glasses=True, shirt="#F3D9B5", pants="#5A3A2A", skin="b")
KURIR = dict(hat="cap", hatColor="#C2691F", shirt="#D9483B", pants="#3B2418", skin="a", sleeve="short")
TAMU1 = dict(hair="bald", mustache=True, shirt="#5B7DB1", tie="#C2691F", pants="#3B2418", skin="c")
TAMU2 = dict(hair="hijab", hijab="#C2691F", shirt="#7FA563", pants="#3B2418", skin="d")
DEWI = dict(hair="bun", hairColor="#3B2418", shirt="#E8A55B", pants="#3B2418", skin="c", collar=False)
ANTON = dict(hair="bald", glasses=True, mustache=True, shirt="#FFFDF8", tie="#2F6F73", jacket="#5A3A2A", pants="#3B2418", skin="b")
STAMP = lambda text, hl: {"text": text, "hl": hl, "tag": "1 Menit 1 Insight", "at": 0.1, "hold": 1.9, "y": 560}

def cta(q, h, hl): return {"question": q, "headline": h, "highlight": hl, "pill": "Aksi hari ini", "url": ""}

EP = {}
# ======================= SP26 Kapan fokusmu terbaik? =======================
v = VO["SP26"]
EP["SP26"] = dict(title="Kapan fokusmu terbaik?", host=BIMO, ctaEnv="park", trans=["whip", "zoom", "iris", "whip", "fade"],
  problem="Meniru semua tips fokus sekaligus lalu tetap tidak fokus.", points=["Cara fokus beda tiap orang", "Kenali jam emasmu", "Gabungkan keduanya"], cta_txt="Pilih satu cara fokus terbaik dan pasang di jam emasmu besok.",
  scenes=[
  {"layout": "cg_tempel", "vo": v[0], "f": {
    "stamp": STAMP("Kapan fokusmu\nterbaik?", "terbaik?"),
    "props": [{"type": "desk", "x": 880, "laptop": True, "mug": True, "s": 0.95}],
    "notes": [{"cue": "semua", "text": "Tutup tab"}, {"cue": "sekaligus", "text": "Notif mati"}, {"cue": "meja", "text": "Meja berdiri"},
              {"cue": "pomodoro", "text": "Pomodoro"}, {"cue": "enam", "text": "Jam 6 pagi"}, {"cue": "pagi", "text": "Sunyi total"}],
    "dropCue": "menguap",
    "toons": [D(BIMO, x=420, size=760, keys=[{"at": 0, "pose": "idle", "expr": "happy"}, {"cue": "mencoba", "pose": "cheer", "expr": "laugh"}, {"cue": "meja", "pose": "idle", "expr": "happy"},
                                           {"cue": "enam", "pose": "scared", "expr": "shock"}, {"cue": "Hasilnya", "pose": "shrug", "expr": "confused"}, {"cue": "menguap", "pose": "sad", "expr": "sad", "emote": "zzz", "emoteDur": 3}])],
    "cam": [{"at": 0, "x": 560, "y": 1020, "zoom": 1.08}, {"cue": "semua", "x": 520, "y": 960, "zoom": 1.0, "dur": 0.8}, {"cue": "Hasilnya", "on": 0, "fit": 0.46, "dur": 0.5},
            {"cue": "menguap", "x": 560, "y": 990, "zoom": 1.04, "dur": 0.6, "shake": 8}]}},
  {"layout": "cg_belah", "vo": v[1], "f": {
    "splitCue": "Bimo",
    "left": {"env": "office", "envOpt": {"plantX": 120}, "name": "LAILA", "time": "09.00 PAGI", "hour": 9, "fx": "quiet", "badge": {"cue": "Laila"}, "desk": {"x": 790, "s": 0.85},
             "cam": {"x": 540, "y": 1000, "zoom": 1.06},
             "toon": D(LAILA, x=470, size=680, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "tajam", "pose": "hips", "expr": "proud", "emote": "sparkle"}, {"cue": "sunyi", "pose": "think", "expr": "happy"}])},
    "right": {"env": "home", "envOpt": {"time": "day", "lampX": 880}, "name": "BIMO", "time": "13.00 SIANG", "hour": 13, "fx": "music", "badge": {"cue": "Bimo"}, "phones": {"cue": "mendengar"},
              "cam": {"x": 540, "y": 1000, "zoom": 1.06},
              "toon": D(BIMO, x=560, size=680, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "panas", "pose": "clap", "expr": "laugh"}, {"cue": "musik", "pose": "cheer", "expr": "happy", "emote": "music", "emoteDur": 3}])}}},
  {"layout": "cerita", "vo": v[2], "f": {
    "env": "info", "envOpt": {"spotX": 540},
    "toons": [D(LAILA, x=290, size=700, face=1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "Ternyata", "pose": "shock", "expr": "shock"}, {"cue": "sunyi", "pose": "pointUp", "expr": "happy"},
                                                    {"cue": "pagi", "pose": "hips", "expr": "proud", "emote": "sparkle"}]),
              D(BIMO, x=800, size=700, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "Ternyata", "pose": "shock", "expr": "shock"}, {"cue": "musik", "pose": "cheer", "expr": "laugh", "emote": "music"},
                                                    {"cue": "siang", "pose": "hips", "expr": "proud", "emote": "sparkle"}])],
    "cam": [{"at": 0, "x": 540, "y": 1060, "zoom": 1.14}, {"cue": "Ternyata", "x": 540, "y": 1000, "zoom": 1.0, "dur": 0.6, "shake": 10}, {"cue": "sunyi", "x": 430, "y": 1000, "zoom": 1.08, "dur": 0.6},
            {"cue": "musik", "x": 650, "y": 1000, "zoom": 1.08, "dur": 0.6}, {"cue": "pagi", "x": 430, "y": 990, "zoom": 1.1, "dur": 0.6}, {"cue": "siang", "x": 650, "y": 990, "zoom": 1.1, "dur": 0.6}],
    "cards": [{"cue": "cara", "outCue": "sunyi", "tag": "Ternyata", "label": "Cara fokus", "big": "BEDA-BEDA", "y": 250, "w": 760},
              {"cue": "sunyi", "outCue": "pagi", "style": "cream", "tag": "Laila", "label": "Sunyi", "x": 290, "y": 260, "w": 440},
              {"cue": "musik", "outCue": "pagi", "tag": "Bimo", "label": "Musik", "x": 790, "y": 260, "w": 440},
              {"cue": "pagi", "style": "cream", "tag": "Laila", "label": "Pagi", "x": 290, "y": 260, "w": 440},
              {"cue": "siang", "tag": "Bimo", "label": "Siang", "x": 790, "y": 260, "w": 440}]}},
  {"layout": "cg_super", "vo": v[3], "f": {
    "power": {"items": [{"cue": "cara", "kind": "music", "label": "Cara cocok"}, {"cue": "emasmu", "kind": "clock", "label": "Jam emas"}],
              "powerCue": "memasang", "workCue": "laporannya", "doneCue": "duduk", "desk": {"x": 860}},
    "toons": [D(BIMO, x=420, size=760, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "gabungkan", "pose": "clap", "expr": "happy"}, {"cue": "memasang", "pose": "cheer", "expr": "laugh", "jump": 90},
                                           {"cue": "makan", "pose": "hips", "expr": "proud"}, {"cue": "laporannya", "pose": "point", "expr": "happy", "face": 1}, {"cue": "duduk", "pose": "cheer", "expr": "laugh"}])],
    "cam": [{"at": 0, "x": 560, "y": 1000, "zoom": 1.04}, {"cue": "memasang", "on": 0, "fit": 0.42, "dy": -40, "dur": 0.4}, {"cue": "laporannya", "x": 640, "y": 1040, "zoom": 1.0, "dur": 0.7},
            {"cue": "duduk", "x": 660, "y": 1020, "zoom": 1.06, "dur": 0.4, "shake": 12}]}},
  {"layout": "cerita", "vo": v[4], "f": {
    "env": "park", "envOpt": {"bench": True, "benchX": 860},
    "toons": [D(BIMO, x=-200, size=740, keys=[{"at": 0, "x": 330}, {"cue": "lihat", "pose": "phone", "expr": "neutral"}, {"cue": "Pilih", "pose": "pointUp", "expr": "happy", "emote": "idea"},
                                            {"cue": "besok", "pose": "cheer", "expr": "laugh", "jump": 100}]),
              D(LAILA, x=1350, size=700, face=-1, keys=[{"cue": "Pilih", "x": 790}, {"cue": "ampuh", "pose": "clap", "expr": "laugh"}, {"cue": "besok", "pose": "wave", "expr": "happy"}])],
    "cam": [{"at": 0, "x": 540, "y": 1000, "zoom": 1.1}, {"cue": "lihat", "on": 0, "fit": 0.44, "dy": -60, "dur": 0.7}, {"cue": "Pilih", "x": 560, "y": 990, "zoom": 1.02, "dur": 0.7},
            {"cue": "besok", "x": 540, "y": 1000, "zoom": 1.06, "dur": 0.5, "shake": 10}],
    "cards": [{"cue": "lihat", "outCue": "Pilih", "style": "cream", "tag": "Aksi hari ini", "label": "Cek catatan fokus", "icon": "book", "sub": "Apa yang berhasil kuartal ini?", "y": 240, "w": 780},
              {"cue": "Pilih", "tag": "Lalu", "label": "1 cara terbaik", "icon": "star", "sub": "Pasang di jam emasmu besok", "y": 240, "w": 780}]}},
  {"layout": "cta", "vo": v[5], "f": cta("Jam emasmu kapan?", "Kapan fokusmu\nterbaik?", "terbaik?")},
  ])

# ======================= RN26 Jeda saat emosi =======================
v = VO["RN26"]
RN_BG = D(REKAN, x=540, y=1500, size=520, z=-1, face=1)
EP["RN26"] = dict(title="Jeda saat emosi", host=FAJAR, ctaEnv="sunset", trans=["whip", "fade", "zoom", "whip", "iris"],
  problem="Membalas kritik dengan kata-kata tajam saat emosi lalu menyesal.", points=["Diam sejenak", "Tarik napas, hitung sampai lima", "Jawab setelah tenang"], cta_txt="Saat emosi naik, diam dan tarik napas lima detik sebelum menjawab.",
  scenes=[
  {"layout": "cg_panas", "vo": v[0], "f": {
    "stamp": STAMP("Jeda saat\nemosi", "emosi"),
    "angry": {"on": 1, "cue": "memanas", "thornCue": "tajam", "grow": 1.2},
    "toons": [D(MIRA, x=250, size=720, face=1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "mengkritik", "pose": "point", "expr": "neutral", "say": "Desainnya kurang!", "kind": "shout", "sayDur": 2.0},
                                                   {"cue": "Wajah", "pose": "idle", "expr": "confused"}, {"cue": "tajam", "pose": "scared", "expr": "scared"}]),
              D(FAJAR, x=780, size=720, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "happy"}, {"cue": "desain", "pose": "shock", "expr": "shock"}, {"cue": "semua", "pose": "sad", "expr": "sad", "emote": "sweat"},
                                                     {"cue": "memanas", "pose": "idle", "expr": "angry", "emote": "anger"}]),
              D(RN_BG, keys=[{"at": 0, "expr": "neutral"}, {"cue": "semua", "expr": "shock", "pose": "scared"}])],
    "cam": [{"at": 0, "x": 540, "y": 1030, "zoom": 1.06}, {"cue": "mengkritik", "x": 420, "y": 1000, "zoom": 1.08, "dur": 0.6}, {"cue": "memanas", "on": 1, "fit": 0.46, "dur": 0.7},
            {"cue": "tajam", "on": 1, "fit": 0.5, "dx": -170, "dur": 0.5, "shake": 14}]}},
  {"layout": "cg_kata", "vo": v[1], "f": {
    "tag": "BULAN LALU", "hero": 0,
    "words": [{"cue": "membalas", "text": "Kamu"}, {"cue": "dengan", "text": "Selalu"}, {"cue": "ketus", "text": "Salah!"}],
    "flyCue": "terbang", "chaseCue": "ditarik", "awkCue": "canggung",
    "toons": [D(FAJAR, x=300, size=720, face=1, keys=[{"at": 0, "pose": "think", "expr": "neutral"}, {"cue": "membalas", "pose": "point", "expr": "angry", "talk": True}, {"cue": "terbang", "pose": "shock", "expr": "shock", "talk": False},
                                                    {"cue": "ditarik", "x": 560, "run": True, "pose": "cheer", "expr": "scared"}, {"cue": "kembali", "jump": 130}, {"cue": "canggung", "face": -1, "pose": "sad", "expr": "sad"}]),
              D(MIRA, x=830, size=700, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "ketus", "pose": "scared", "expr": "shock"}, {"cue": "itu", "x": 900, "expr": "sad"},
                                                    {"cue": "canggung", "face": 1, "pose": "idle", "expr": "sad", "say": "...", "sayDur": 2.4}])],
    "cam": [{"at": 0, "x": 540, "y": 1000, "zoom": 1.04}, {"cue": "membalas", "x": 520, "y": 940, "zoom": 1.0, "dur": 0.8}, {"cue": "terbang", "x": 620, "y": 800, "zoom": 0.96, "dur": 0.8},
            {"cue": "ditarik", "x": 600, "y": 900, "zoom": 1.0, "dur": 0.6}, {"cue": "canggung", "x": 600, "y": 1010, "zoom": 1.06, "dur": 1.2}]}},
  {"layout": "cg_jeda", "vo": v[2], "f": {
    "freeze": {"on": 1, "cue": "diam", "breathCue": "menarik", "countCue": "menghitung", "countEndCue": "lima", "coolCue": "turun", "grow0": 1.2},
    "toons": [D(MIRA, x=250, size=720, face=1, keys=[{"at": 0, "pose": "point", "expr": "neutral", "say": "Coba revisi lagi!", "sayDur": 2.6}]),
              D(FAJAR, x=780, size=720, face=-1, keys=[{"at": 0, "pose": "idle", "expr": "angry"}, {"cue": "napas", "pose": "idle", "expr": "neutral"}, {"cue": "lima", "pose": "idle", "expr": "proud"},
                                                     {"cue": "turun", "pose": "idle", "expr": "happy", "emote": "sparkle"}]),
              D(RN_BG, keys=[{"at": 0, "expr": "confused"}])],
    "cam": [{"at": 0, "on": 1, "fit": 0.46}, {"cue": "diam", "x": 540, "y": 1000, "zoom": 1.0, "dur": 0.5}, {"cue": "menarik", "on": 1, "fit": 0.42, "dy": -40, "dur": 1.2},
            {"cue": "turun", "x": 580, "y": 1000, "zoom": 1.02, "dur": 1.2}]}},
  {"layout": "cerita", "vo": v[3], "f": {
    "env": "info", "envOpt": {"spotX": 540},
    "toons": [D(FAJAR, x=330, size=720, face=1, keys=[{"at": 0, "pose": "pointUp", "expr": "happy"}, {"cue": "berpikir", "pose": "think", "expr": "neutral", "emote": "idea"}, {"cue": "bereaksi", "pose": "shrug", "expr": "confused"},
                                                    {"cue": "menjawab", "pose": "talk", "expr": "happy", "say": "Bagian mana, ya?", "sayDur": 2.2}, {"cue": "hangat", "pose": "clap", "expr": "laugh"}]),
              D(MIRA, x=1350, size=700, face=-1, keys=[{"cue": "Fajar", "x": 790}, {"cue": "diperbaiki", "pose": "point", "expr": "happy", "say": "Yang ini, coba!", "sayDur": 2.0}, {"cue": "hangat", "pose": "cheer", "expr": "laugh", "emote": "heart"}])],
    "cam": [{"at": 0, "x": 430, "y": 1000, "zoom": 1.12}, {"cue": "Fajar", "x": 560, "y": 990, "zoom": 1.0, "dur": 0.8}, {"cue": "hangat", "x": 560, "y": 1000, "zoom": 1.05, "dur": 0.5, "shake": 8}],
    "cards": [{"at": 0.3, "outCue": "menjawab", "tag": "Jeda singkat", "label": "Waktu berpikir", "icon": "clock", "sub": "Bukan sekadar bereaksi", "y": 240, "w": 780}]}},
  {"layout": "cerita", "vo": v[4], "f": {
    "env": "park", "envOpt": {"treeX": 160},
    "toons": [D(FAJAR, x=540, size=760, talk=True, keys=[{"at": 0, "pose": "wave", "expr": "happy"}, {"cue": "naik", "pose": "idle", "expr": "angry", "talk": False}, {"cue": "diam", "pose": "idle", "expr": "neutral"},
                                                      {"cue": "napas", "pose": "idle", "expr": "proud"}, {"cue": "Bicaralah", "pose": "talk", "expr": "happy", "talk": True}, {"cue": "dingin", "pose": "cheer", "expr": "laugh", "jump": 90, "talk": False}])],
    "cam": [{"at": 0, "x": 540, "y": 1000, "zoom": 1.1}, {"cue": "naik", "on": 0, "fit": 0.46, "dy": -60, "dur": 0.4, "shake": 10}, {"cue": "diam", "x": 540, "y": 1000, "zoom": 1.0, "dur": 0.9},
            {"cue": "dingin", "x": 540, "y": 1000, "zoom": 1.06, "dur": 0.5, "shake": 10}],
    "cards": [{"cue": "diam", "outCue": "Bicaralah", "tag": "Aksi hari ini", "label": "Diam & tarik napas", "big": "5 DETIK", "y": 230, "w": 780},
              {"cue": "Bicaralah", "style": "cream", "tag": "Baru", "label": "Bicara saat tenang", "icon": "chat", "y": 240, "w": 780}]}},
  {"layout": "cta", "vo": v[5], "f": cta("Pernah menyesal bicara?", "Jeda dulu,\nbaru bicara", "baru bicara")},
  ])

# ======================= KD26 Bersih-bersih digital =======================
v = VO["KD26"]
EP["KD26"] = dict(title="Bersih-bersih digital", host=RUDI, ctaEnv="night", trans=["zoom", "whip", "iris", "whip", "fade"],
  problem="Desktop, folder unduhan, dan galeri penuh sampai file penting sulit ditemukan.", points=["Rapikan desktop", "Bersihkan folder unduhan", "Pindahkan foto kerja ke album"], cta_txt="Sisihkan sepuluh menit tiap Kamis sore untuk bersih-bersih digital.",
  scenes=[
  {"layout": "cg_desktop", "vo": v[0], "f": {
    "stamp": STAMP("Bersih-bersih\ndigital", "digital"),
    "desk": {"mode": "mess", "enterCue": "membuka", "fillCue": "desktopnya", "fullCue": "terlihat"}, "deskX": 700,
    "toonA": D(RUDI, x=380, size=760, face=1, keys=[{"at": 0, "pose": "think", "expr": "neutral", "emote": "?"}, {"cue": "kontrak", "pose": "scratch", "expr": "confused"}, {"cue": "rapat", "pose": "idle", "expr": "happy"}]),
    "camA": [{"at": 0, "x": 560, "y": 1040, "zoom": 1.06}, {"cue": "kontrak", "x": 600, "y": 1060, "zoom": 1.14, "dur": 1.6}],
    "toons": [D(RUDI, x=540, size=560, face=1, keys=[{"at": 0, "pose": "idle", "expr": "happy"}, {"cue": "desktopnya", "pose": "shock", "expr": "shock"}, {"cue": "ikon", "pose": "scared", "expr": "scared", "say": "Kontraknya di mana?", "sayDur": 2.2},
                                           {"cue": "terlihat", "pose": "facepalm", "expr": "sad"}])],
    "cam": [{"cue": "terlihat", "x": 540, "y": 940, "zoom": 0.98, "dur": 0.6, "shake": 12}]}},
  {"layout": "cg_longsor", "vo": v[1], "f": {
    "folder": {"burstCue": "parah", "galleryCue": "Galeri"},
    "toons": [D(RUDI, x=300, size=720, face=1, keys=[{"at": 0, "pose": "point", "expr": "neutral"}, {"cue": "parah", "pose": "shock", "expr": "shock"}, {"cue": "menumpuk", "pose": "scared", "expr": "scared", "emote": "sweat"},
                                           {"cue": "Galeri", "pose": "shock", "expr": "shock"}, {"cue": "terpakai", "pose": "facepalm", "expr": "sad"}])],
    "cam": [{"at": 0, "x": 600, "y": 980, "zoom": 1.06}, {"cue": "parah", "x": 560, "y": 980, "zoom": 1.0, "dur": 0.4, "shake": 18}, {"cue": "Galeri", "x": 640, "y": 960, "zoom": 1.0, "dur": 0.7},
            {"cue": "terpakai", "x": 580, "y": 1000, "zoom": 1.06, "dur": 1.0}],
    "cards": [{"cue": "ratusan", "outCue": "Galeri", "label": "Isi unduhan", "num": {"to": 347, "suffix": " file"}, "x": 300, "y": 220, "w": 500}]}},
  {"layout": "cerita", "vo": v[2], "f": {
    "env": "home", "envOpt": {"time": "night", "lampX": 880},
    "props": [{"type": "sofa", "x": 820, "color": "#8E4E2E"}, {"type": "box", "x": 700, "cue": "menumpuk"}, {"type": "box", "x": 900, "cue": "diam-diam", "s": 1.1}, {"type": "box", "x": 800, "y": 1470, "cue": "akhirnya", "s": 0.9}],
    "toons": [D(RUDI, x=330, size=740, face=1, talk=True, keys=[{"at": 0, "pose": "pointUp", "expr": "happy"}, {"cue": "rumah", "pose": "point", "expr": "happy"}, {"cue": "menumpuk", "pose": "shock", "expr": "shock", "talk": False},
                                                       {"cue": "menyembunyikan", "pose": "scratch", "expr": "confused", "emote": "?"}])],
    "cam": [{"at": 0, "x": 480, "y": 1000, "zoom": 1.1}, {"cue": "menumpuk", "x": 620, "y": 1000, "zoom": 1.0, "dur": 0.8, "shake": 10}, {"cue": "menyembunyikan", "on": 0, "fit": 0.44, "dy": -60, "dur": 0.8}],
    "cards": [{"cue": "mirip", "outCue": "Kalau", "style": "cream", "tag": "Ibaratnya", "label": "Seperti barang rumah", "icon": "file", "y": 240, "w": 780},
              {"cue": "Kalau", "outCue": "menyembunyikan", "tag": "Tanpa rutin", "label": "Menumpuk diam-diam", "icon": "alert", "y": 240, "w": 780},
              {"cue": "menyembunyikan", "style": "cream", "tag": "Akibatnya", "tagColor": "yellow", "label": "Yang penting hilang", "icon": "help", "y": 240, "w": 780}]}},
  {"layout": "cg_desktop", "vo": v[3], "f": {
    "desk": {"mode": "clean", "groups": [{"cue": "folder", "kind": "folder", "label": "PROYEK", "x": 230, "y": 400}, {"cue": "dihapus", "kind": "poof"}, {"cue": "album", "kind": "album", "label": "FOTO KERJA", "x": 850, "y": 400}],
             "foundCue": "kontraknya"},
    "toons": [D(RUDI, x=540, size=560, face=1, keys=[{"at": 0, "pose": "hips", "expr": "proud"}, {"cue": "Ikon", "pose": "point", "expr": "happy", "face": -1}, {"cue": "dihapus", "pose": "clap", "expr": "laugh"},
                                           {"cue": "album", "pose": "point", "expr": "happy", "face": 1}, {"cue": "kontraknya", "pose": "cheer", "expr": "laugh", "jump": 110, "emote": "sparkle"}])],
    "cam": [{"at": 0, "x": 540, "y": 1000, "zoom": 1.08}, {"cue": "Ikon", "x": 540, "y": 960, "zoom": 1.0, "dur": 0.6}, {"cue": "kontraknya", "x": 540, "y": 940, "zoom": 1.02, "dur": 0.5, "shake": 10}]}},
  {"layout": "cerita", "vo": v[4], "f": {
    "env": "night",
    "toons": [D(RUDI, x=-200, size=740, face=1, talk=True, keys=[{"at": 0, "x": 420}, {"cue": "sisihkan", "pose": "pointUp", "expr": "happy"}, {"cue": "merapikan", "pose": "point", "expr": "happy"},
                                                        {"cue": "kebiasaan", "pose": "cheer", "expr": "laugh", "jump": 100, "talk": False}])],
    "cam": [{"at": 0, "x": 520, "y": 1000, "zoom": 1.1}, {"cue": "sisihkan", "on": 0, "fit": 0.42, "dy": -60, "dur": 0.7}, {"cue": "merapikan", "x": 540, "y": 990, "zoom": 1.0, "dur": 0.8},
            {"cue": "kebiasaan", "x": 540, "y": 1000, "zoom": 1.06, "dur": 0.5, "shake": 10}],
    "cards": [{"cue": "sisihkan", "outCue": "merapikan", "tag": "Aksi hari ini", "label": "Tiap Kamis sore", "big": "10 MENIT", "icon": "clock", "y": 230, "w": 780},
              {"cue": "merapikan", "style": "cream", "tag": "Rapikan", "label": "Desktop", "sub": "Folder unduhan dan galeri foto kerja", "icon": "check", "y": 240, "w": 780}]}},
  {"layout": "cta", "vo": v[5], "f": cta("Desktopmu serapi apa?", "Bersih-bersih\ndigital", "digital")},
  ])

# ======================= JS26 Pelajaran dari satu keputusan =======================
v = VO["JS26"]
EP["JS26"] = dict(title="Pelajaran dari satu keputusan", host=WULAN, ctaEnv="beach", trans=["whip", "zoom", "iris", "fade", "whip"],
  problem="Keputusan yang meleset dilupakan begitu saja tanpa diambil pelajarannya.", points=["Renungkan satu keputusan", "Jawab tiga pertanyaan", "Bawa pelajarannya ke keputusan berikutnya"], cta_txt="Tulis jawaban tiga pertanyaan untuk satu keputusan minggu ini.",
  scenes=[
  {"layout": "cerita", "vo": v[0], "f": {
    "env": "sunset",
    "stamp": dict(STAMP("Pelajaran dari\nsatu keputusan", "satu keputusan"), size=100),
    "toons": [D(WULAN, x=540, size=760, keys=[{"at": 0, "pose": "think", "expr": "neutral", "emote": "?", "emoteDur": 2.4}, {"cue": "katering", "pose": "point", "expr": "happy"}, {"cue": "termurah", "pose": "hips", "expr": "proud"},
                                           {"cue": "tanpa", "pose": "scratch", "expr": "confused"}, {"cue": "dulu", "pose": "sad", "expr": "sad"}])],
    "cam": [{"at": 0, "x": 540, "y": 1060, "zoom": 1.14}, {"cue": "merenungkan", "x": 540, "y": 1000, "zoom": 1.0, "dur": 1.2}, {"cue": "tanpa", "on": 0, "fit": 0.44, "dy": -60, "dur": 0.7}],
    "cards": [{"cue": "katering", "outCue": "tanpa", "tag": "Keputusan kuartal ini", "label": "Katering termurah", "icon": "receipt", "y": 240, "w": 780},
              {"cue": "tanpa", "style": "cream", "tag": "Tapi", "tagColor": "yellow", "label": "Tanpa cek ulasan", "icon": "alert", "y": 240, "w": 780}]}},
  {"layout": "cg_replay", "vo": v[1], "f": {
    "replay": {"clock": {"spinCue": "terlambat"}, "carry": 3, "rewindCue": "sekadar",
               "marks": [{"cue": "terlambat", "kind": "circle", "x": 960, "y": 560, "r": 135}, {"cue": "kelaparan", "kind": "circle", "x": 640, "y": 1236, "rx": 300, "ry": 70}]},
    "toons": [D(TAMU1, x=500, y=1500, size=560, face=1, keys=[{"at": 0, "expr": "neutral"}, {"cue": "kelaparan", "pose": "sad", "expr": "sad", "emote": "sweat"}]),
              D(TAMU2, x=770, y=1500, size=560, face=-1, keys=[{"at": 0, "expr": "happy"}, {"cue": "kelaparan", "pose": "idle", "expr": "angry", "emote": "anger"}]),
              D(WULAN, x=220, size=720, face=1, z=1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "terlambat", "pose": "shock", "expr": "shock"}, {"cue": "malu", "pose": "facepalm", "expr": "scared"},
                                                    {"cue": "tidak", "pose": "think", "expr": "neutral"}]),
              D(KURIR, x=1450, size=680, face=-1, z=2, keys=[{"cue": "terlambat", "x": 900, "run": True, "pose": "hold", "expr": "scared", "emote": "sweat"}])],
    "cam": [{"at": 0, "x": 580, "y": 960, "zoom": 1.0}, {"cue": "terlambat", "x": 720, "y": 900, "zoom": 1.04, "dur": 0.8}, {"cue": "kelaparan", "x": 600, "y": 1000, "zoom": 1.06, "dur": 0.7},
            {"cue": "malu", "on": 2, "fit": 0.44, "dy": -80, "dur": 0.6}, {"cue": "sekadar", "x": 580, "y": 960, "zoom": 1.0, "dur": 0.4, "shake": 10}]}},
  {"layout": "cg_bisik", "vo": v[2], "f": {
    "props": [{"type": "sofa", "x": 860, "color": "#7A4A2E"}],
    "mini": {"cue": "dirinya", "on": 0, "dx": 300, "dy": -20,
             "qs": [{"cue": "terjadi", "text": "Apa yang terjadi?"}, {"cue": "Kenapa", "text": "Kenapa bisa begitu?"}, {"cue": "kulakukan", "text": "Lain kali beda apa?"}], "answerCue": "Jawabannya",
             "keys": [{"at": 0, "pose": "pointUp", "expr": "happy", "talk": True}, {"cue": "Kenapa", "pose": "shrug", "expr": "confused"}, {"cue": "kulakukan", "pose": "point", "expr": "neutral"},
                      {"cue": "Jawabannya", "pose": "cheer", "expr": "laugh", "talk": False}]},
    "toons": [D(WULAN, x=320, size=760, face=1, keys=[{"at": 0, "pose": "think", "expr": "neutral"}, {"cue": "dirinya", "pose": "shock", "expr": "shock"}, {"cue": "terjadi", "pose": "think", "expr": "confused"},
                                                    {"cue": "Kenapa", "pose": "scratch", "expr": "confused"}, {"cue": "berbeda", "pose": "think", "expr": "neutral"}, {"cue": "Jawabannya", "pose": "pointUp", "expr": "happy", "emote": "idea"},
                                                    {"cue": "harga", "pose": "hips", "expr": "proud"}])],
    "cam": [{"at": 0, "x": 460, "y": 1010, "zoom": 1.1}, {"cue": "dirinya", "x": 560, "y": 940, "zoom": 1.04, "dur": 0.7}, {"cue": "Jawabannya", "x": 540, "y": 980, "zoom": 1.0, "dur": 0.6, "shake": 8}],
    "cards": [{"cue": "Jawabannya", "style": "cream", "tag": "Pelajaran", "label": "Cek ulasan dulu", "sub": "Jangan cuma lihat harga", "icon": "star", "y": 230, "w": 780}]}},
  {"layout": "cg_portal", "vo": v[3], "f": {
    "portal": {"on": 0, "orbCue": "pelajaran", "openCue": "berikutnya", "enterCue": "acara", "futureCue": "tahu", "x": 800, "y": 1150, "label": "BULAN DEPAN",
               "future": {"env": "park", "starsCue": "memilih", "starLabel": "VENDOR BERULASAN BAIK",
                          "toons": [D(WULAN, x=300, size=720, face=1, keys=[{"at": 0, "pose": "cheer", "expr": "laugh"}, {"cue": "memilih", "pose": "hips", "expr": "proud", "emote": "sparkle"}]),
                                    D(TAMU1, x=620, size=660, face=-1, keys=[{"at": 0, "pose": "clap", "expr": "laugh", "emote": "heart"}]),
                                    D(TAMU2, x=880, size=660, face=-1, keys=[{"at": 0, "pose": "cheer", "expr": "happy"}])],
                          "cam": [{"at": 0, "x": 560, "y": 1040, "zoom": 1.15}, {"cue": "tahu", "x": 560, "y": 1000, "zoom": 1.0, "dur": 1.0}]}},
    "toons": [D(WULAN, x=300, size=740, face=1, keys=[{"at": 0, "pose": "think", "expr": "neutral"}, {"cue": "direnungkan", "pose": "idle", "expr": "happy", "emote": "idea"}, {"cue": "pelajaran", "pose": "hold", "expr": "happy"},
                                                    {"cue": "berikutnya", "pose": "hold", "expr": "shock"}, {"cue": "acara", "x": 800, "pose": "hold", "expr": "proud", "speed": 300}])],
    "cam": [{"at": 0, "x": 480, "y": 1000, "zoom": 1.08}, {"cue": "pelajaran", "on": 0, "fit": 0.4, "dy": 60, "dur": 0.6}, {"cue": "berikutnya", "x": 580, "y": 1000, "zoom": 1.0, "dur": 0.8},
            {"cue": "acara", "x": 740, "y": 1080, "zoom": 1.2, "dur": 1.4}]}},
  {"layout": "cerita", "vo": v[4], "f": {
    "env": "street", "envOpt": {"time": "dusk"},
    "toons": [D(WULAN, x=-200, size=740, face=1, talk=True, keys=[{"at": 0, "x": 400}, {"cue": "pilih", "pose": "pointUp", "expr": "happy"}, {"cue": "tulis", "pose": "point", "expr": "happy"},
                                                         {"cue": "Cukup", "pose": "cheer", "expr": "laugh", "jump": 100, "talk": False}])],
    "cam": [{"at": 0, "x": 520, "y": 1000, "zoom": 1.1}, {"cue": "pilih", "on": 0, "fit": 0.42, "dy": -60, "dur": 0.7}, {"cue": "tulis", "x": 540, "y": 990, "zoom": 1.0, "dur": 0.8},
            {"cue": "Cukup", "x": 540, "y": 1000, "zoom": 1.06, "dur": 0.5, "shake": 10}],
    "cards": [{"cue": "pilih", "outCue": "tulis", "tag": "Aksi hari ini", "label": "1 keputusan", "sub": "Yang kamu ambil minggu ini", "icon": "target", "y": 240, "w": 780},
              {"cue": "tulis", "style": "cream", "tag": "Tulis jawaban", "label": "3 pertanyaan", "sub": "Apa terjadi? Kenapa? Lain kali?", "icon": "book", "y": 240, "w": 780}]}},
  {"layout": "cta", "vo": v[5], "f": cta("Keputusan apa minggu ini?", "Satu keputusan,\nsatu pelajaran", "satu pelajaran")},
  ])

# ======================= SC26 Cek progres tabungan =======================
v = VO["SC26"]
EP["SC26"] = dict(title="Cek progres tabungan", host=DEWI, ctaEnv="sunset", trans=["zoom", "whip", "iris", "whip", "fade"],
  problem="Semangat menabung kendur karena tidak pernah melihat progresnya.", points=["Cek saldo tabungan", "Hitung persentase dari target", "Tempel angkanya di tempat terlihat"], cta_txt="Cek saldo, hitung persentasenya, dan tulis angkanya di tempat yang sering dilihat.",
  scenes=[
  {"layout": "cg_warna", "vo": v[0], "f": {
    "env": "street", "envOpt": {"time": "dusk"},
    "stamp": STAMP("Cek progres\ntabungan", "tabungan"),
    "mood": {"grayCue": "kendur", "snail": {"cue": "Rasanya", "label": "TABUNGAN", "p": 0.3, "y": 500}, "coinCue": "menyisihkan"},
    "toons": [D(DEWI, x=-200, size=740, face=1, keys=[{"at": 0, "x": 520, "speed": 380}, {"cue": "kursus", "pose": "hips", "expr": "happy", "emote": "sparkle"}, {"cue": "kendur", "pose": "sad", "expr": "sad"},
                                                  {"cue": "Rasanya", "pose": "scratch", "expr": "confused"}, {"cue": "menyisihkan", "pose": "sad", "expr": "sad", "emote": "sweat"}])],
    "cam": [{"at": 0, "x": 480, "y": 1000, "zoom": 1.06}, {"cue": "kendur", "on": 0, "fit": 0.42, "dy": 40, "dur": 1.0}, {"cue": "Rasanya", "x": 540, "y": 990, "zoom": 1.0, "dur": 0.7}]}},
  {"layout": "cerita", "vo": v[1], "f": {
    "env": "office", "envOpt": {"deskX": 900},
    "toons": [D(DEWI, x=300, size=740, face=1, keys=[{"at": 0, "pose": "idle", "expr": "neutral"}, {"cue": "menggeleng", "pose": "shrug", "expr": "confused", "emote": "?"}, {"cue": "pertama", "pose": "sad", "expr": "sad"}]),
              D(ANTON, x=1350, size=760, face=-1, keys=[{"at": 0.2, "x": 790}, {"cue": "bertanya", "pose": "talk", "expr": "happy", "say": "Sudah berapa terkumpul?", "sayDur": 2.6}, {"cue": "menggeleng", "pose": "idle", "expr": "shock"},
                                                     {"cue": "pertama", "pose": "facepalm", "expr": "laugh"}])],
    "cam": [{"at": 0, "x": 600, "y": 1000, "zoom": 1.06}, {"cue": "bertanya", "on": 1, "fit": 0.4, "dy": -60, "dur": 0.6}, {"cue": "menggeleng", "on": 0, "fit": 0.44, "dx": -120, "dy": -40, "dur": 0.6, "shake": 6},
            {"cue": "pertama", "x": 540, "y": 1000, "zoom": 1.02, "dur": 0.8}],
    "cards": [{"cue": "pernah", "style": "cream", "tag": "Terakhir dicek", "tagColor": "yellow", "label": "Bulan pertama", "icon": "clock", "y": 240, "w": 760}]}},
  {"layout": "cg_warna", "vo": v[2], "f": {
    "env": "home", "envOpt": {"time": "night", "lampX": 880},
    "props": [{"type": "sofa", "x": 820, "color": "#8E4E2E"}],
    "mood": {"start": 0.92, "colorCue": "Dunianya", "num": {"cue": "enam", "to": 60, "suffix": "%", "label": "DARI TARGET"}},
    "toons": [D(DEWI, x=420, size=760, face=1, keys=[{"at": 0, "pose": "phone", "expr": "neutral"}, {"cue": "Ternyata", "pose": "phone", "expr": "shock"}, {"cue": "persen", "pose": "phone", "expr": "happy"},
                                                  {"cue": "Dunianya", "pose": "cheer", "expr": "laugh", "jump": 100}])],
    "cam": [{"at": 0, "x": 480, "y": 1020, "zoom": 1.1}, {"cue": "Ternyata", "on": 0, "fit": 0.4, "dy": -90, "dur": 0.5}, {"cue": "Dunianya", "x": 540, "y": 1000, "zoom": 1.0, "dur": 0.8}]}},
  {"layout": "cg_finis", "vo": v[3], "f": {
    "finish": {"flags": [{"x": -250, "label": "BLN 1"}, {"x": 120, "label": "BLN 2"}, {"x": 430, "label": "60%", "hl": True}], "nearCue": "Garis", "coinCue": "setiap", "startX": 600},
    "toons": [D(DEWI, x=640, size=740, face=-1, keys=[{"at": 0, "pose": "hips", "expr": "proud"}, {"cue": "semangat", "pose": "point", "expr": "happy"}, {"cue": "Garis", "face": 1, "pose": "shock", "expr": "shock"},
                                                  {"cue": "dekat", "pose": "cheer", "expr": "laugh"}, {"cue": "setiap", "x": 1300, "run": True, "expr": "laugh", "face": 1}, {"cue": "ringan", "jump": 120}])],
    "cam": [{"at": 0, "x": 340, "y": 1000, "zoom": 0.96}, {"cue": "terjaga", "x": 600, "y": 1000, "zoom": 1.0, "dur": 0.8}, {"cue": "Garis", "on": "arch", "zoom": 0.8, "dur": 1.0},
            {"cue": "dekat", "x": 900, "y": 1000, "zoom": 0.95, "dur": 0.8}, {"cue": "setiap", "on": 0, "dx": 220, "dy": 40, "zoom": 0.95, "dur": 0.8}]}},
  {"layout": "cerita", "vo": v[4], "f": {
    "env": "park", "envOpt": {"bench": True, "benchX": 860},
    "toons": [D(DEWI, x=420, size=760, face=1, keys=[{"at": 0, "pose": "phone", "expr": "neutral"}, {"cue": "hitung", "pose": "think", "expr": "neutral", "emote": "?"}, {"cue": "tulis", "pose": "pointUp", "expr": "happy", "emote": "idea"},
                                                  {"cue": "lihat", "pose": "cheer", "expr": "laugh", "jump": 90}])],
    "cam": [{"at": 0, "x": 520, "y": 1000, "zoom": 1.1}, {"cue": "hitung", "on": 0, "fit": 0.42, "dy": -60, "dur": 0.7}, {"cue": "tulis", "x": 540, "y": 990, "zoom": 1.0, "dur": 0.8},
            {"cue": "lihat", "x": 540, "y": 1000, "zoom": 1.06, "dur": 0.5, "shake": 10}],
    "cards": [{"cue": "cek", "outCue": "tulis", "tag": "Aksi hari ini", "label": "Cek saldo tabungan", "sub": "Hitung persen dari target", "icon": "wallet", "y": 240, "w": 780},
              {"cue": "tulis", "style": "cream", "tag": "Lalu", "label": "Tulis angkanya", "sub": "Di tempat yang sering dilihat", "icon": "pin", "y": 240, "w": 780}]}},
  {"layout": "cta", "vo": v[5], "f": cta("Sudah berapa persen?", "Cek progres\ntabunganmu", "tabunganmu")},
  ])

def build(code):
    e = EP[code]; ser = code[:2]; scenes = e["scenes"]
    assert [s["vo"] for s in scenes] == VO[code]
    p = {"id": code.lower(), "name": f"{code}: {e['title']}", "style": "B" if ser == "KD" else "C", "series": ser,
         "brand": dict(base["brand"], label=f"{LABEL[ser]} · 1 MENIT 1 INSIGHT"),
         "brief": dict(base["brief"], problem=e["problem"], points=e["points"], cta=e["cta_txt"]),
         "pron": "", "voice": base["voice"], "sfx": base["sfx"], "voVol": 1, "nudges": {}, "scenes": scenes,
         "motion": {"mode": "cerita", "host": dict(e["host"]), "transitions": e["trans"], "ctaEnv": e.get("ctaEnv", "beach")}}
    bad = check(code, scenes)
    for i, s in enumerate(scenes):
        if s["layout"] == "cta" and len(s["f"]["question"]) > 26: print(code, "PERTANYAAN TERLALU PANJANG"); bad += 1
    os.makedirs(code, exist_ok=True)
    json.dump(p, open(f"{code}/project.json", "w"), ensure_ascii=False, indent=1)
    t = "\n\n".join(s["vo"] for s in scenes)
    old = json.load(open(f"{code}/.tts.json"))["text"] if os.path.exists(f"{code}/.tts.json") else None
    if old != t:
        json.dump({"text": t, "model_id": "eleven_v4", "language_code": "id"}, open(f"{code}/.tts.json", "w"), ensure_ascii=False); print(code, "TEKS VO BERUBAH -> perlu TTS ulang")
    print(code, len(t.split()), "kata:", " > ".join(s["layout"] for s in scenes), "OK" if not bad else f"{bad} MASALAH")

for c in (sys.argv[1:] or EP): build(c)
