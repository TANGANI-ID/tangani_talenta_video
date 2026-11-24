import sys, json, os
sys.path.insert(0, "tools")
from mk_lib import mk
# run from project root: python3 -I $W/set8a/mk.py [CODE ...]
# Pack set8a: pinball, popcorn, claw, plinko, ferris, fishing, bowling, slingshot (+ cta). No project["motion"]: Q2 styles decide.
ONLY = set(sys.argv[1:])
CTA = lambda vo, q, h, hl, pill="Aksi hari ini": {"layout": "cta", "vo": vo, "f": {"question": q, "headline": h, "highlight": hl, "pill": pill, "url": ""}}
A = lambda **k: k
HJ = A(hair="hijab", hijab="#2F6F73", shirt="#E89544", skin="b")
SH = A(hair="short", shirt="#2F6F73", skin="a")
LG = A(hair="long", shirt="#A0522D", skin="d")
GL = A(hair="short", shirt="#C2691F", skin="c", glasses=True)

def ep(code, day, title, insight, problem, action, caption, scenes):
    if ONLY and code not in ONLY: return
    mk(code, title, problem, insight, action, scenes)
    json.dump({"code": code, "series": code[:2], "day": day, "title": title, "insight": insight, "action": action, "caption": caption,
               "video": f"{code}-tangani-talenta-9x16.mp4"}, open(f"{code}/episode.json", "w"), ensure_ascii=False, indent=2)

ep("SP21", 142, "Satu layar, satu tugas", "Tutup tab dan aplikasi yang tidak sedang dipakai.",
   "Perhatian terpecah karena terlalu banyak tab dan aplikasi terbuka",
   "Sebelum mulai kerja, pilih satu tugas, tutup tab dan aplikasi lain, lalu kerjakan tugas itu sampai selesai di satu layar.",
   "Setiap tab yang terbuka bisa mencuri fokus kapan saja. Aksi hari ini: pilih satu tugas, tutup tab dan aplikasi yang tidak sedang dipakai, lalu kerjakan sampai selesai.", [
 {"layout": "pinball", "vo": "Kamu mau menyelesaikan laporan. Tapi email, grup chat, toko online, dan berita terbuka bersamaan. Perhatianmu memantul ke sana kemari, dan laporannya tidak maju.",
  "f": {"headline": "Perhatian\nyang memantul", "highlight": "memantul", "led": "TAB TERBUKA", "end": "drain", "endCue": "laporannya", "endLabel": "Laporan belum jalan",
        "actor": dict(SH, keys=[{"cue": "email", "expr": "neutral"}, {"cue": "Perhatianmu", "expr": "confused", "emote": "?"}]),
        "items": [{"label": "Email", "cue": "email", "icon": "file", "value": "4"}, {"label": "Grup chat", "cue": "grup", "icon": "chat", "value": "8"},
                  {"label": "Toko online", "cue": "toko", "icon": "cart", "value": "12"}, {"label": "Berita", "cue": "berita", "icon": "book", "value": "15"}]}},
 {"layout": "popcorn", "vo": "Setiap tab yang terbuka seperti jagung di atas api. Ada notifikasi, ada harga diskon, ada judul berita. Satu per satu meletup dan mencuri fokusmu.",
  "f": {"headline": "Siap meletup\nkapan saja", "highlight": "meletup", "sign": "TAB TERBUKA", "heatCue": "api", "end": "overflow", "endCue": "meletup", "endLabel": "Fokus buyar",
        "actor": dict(LG, keys=[{"cue": "Setiap", "expr": "neutral"}, {"cue": "diskon", "expr": "worried"}]),
        "items": [{"label": "Notifikasi", "cue": "notifikasi", "icon": "chat"}, {"label": "Harga diskon", "cue": "diskon", "icon": "cart"}, {"label": "Judul berita", "cue": "judul", "icon": "book"}]}},
 {"layout": "claw", "vo": "Jadi, jangan pegang semuanya sekaligus. Pilih satu tugas untuk sekarang, misalnya laporan. Chat, belanja, dan video bisa menunggu nanti.",
  "f": {"headline": "Pilih\nsatu tugas", "highlight": "satu tugas", "title": "PILIH SATU", "winLabel": "Sekarang: laporan",
        "actor": dict(HJ, keys=[{"cue": "Jadi", "expr": "confused"}, {"cue": "Pilih", "expr": "neutral"}]),
        "prizes": [{"label": "Balas chat", "icon": "chat"}, {"label": "Belanja", "icon": "cart"}, {"label": "Laporan", "icon": "file", "color": "#2F6F73"}, {"label": "Video", "icon": "phone"}, {"label": "Berita", "icon": "book"}],
        "tries": [{"cue": "Pilih", "pick": 2, "result": "win"}]}},
 {"layout": "bowling", "vo": "Lalu tutup tab dan aplikasi yang tidak sedang dipakai. Toko online, video, berita, semuanya ditutup. Tinggal laporan, dan layarmu jadi lega.",
  "f": {"headline": "Tutup yang\ntidak dipakai", "highlight": "tidak dipakai", "rollCue": "semuanya", "result": "strike", "strikeText": "TUTUP!", "endLabel": "Layar jadi lega", "ballLabel": "Tutup tab",
        "actor": dict(GL),
        "pins": [{"label": "Laporan", "cue": "Lalu", "stay": True}, {"label": "Toko online", "cue": "Toko"}, {"label": "Video", "cue": "video"}, {"label": "Berita", "cue": "berita"}]}},
 {"layout": "slingshot", "vo": "Aksi hari ini: sebelum mulai, pilih satu tugas, tutup tab dan aplikasi lain, lalu kerjakan sampai selesai di satu layar itu.",
  "f": {"headline": "Satu layar\nsampai selesai", "highlight": "sampai selesai", "fireCue": "kerjakan", "target": {"label": "Tugas selesai", "icon": "target"}, "ammo": "file",
        "hitText": "FOKUS!", "endLabel": "Satu tugas tuntas", "actor": dict(HJ),
        "items": [{"label": "Pilih 1 tugas", "cue": "pilih", "icon": "target"}, {"label": "Tutup yang lain", "cue": "tutup", "icon": "check"}, {"label": "Kerjakan di 1 layar", "cue": "lalu", "icon": "file"}]}},
 CTA("Satu layar, satu tugas, satu hasil yang beres hari ini. Selamat hari Selasa.", "Tab apa yang kamu tutup?", "Satu layar,\nsatu tugas", "satu tugas")])

ep("RN21", 143, "Tanya, jangan menebak", "Menanyakan langsung lebih aman daripada mengira-ngira maksud orang.",
   "Mengira-ngira maksud instruksi sehingga pekerjaan meleset",
   "Saat instruksi terasa kabur, jangan menebak: kirim satu pertanyaan singkat, lalu ulangi jawabannya untuk memastikan.",
   "Menebak maksud orang bisa membuat kerja seharian meleset, padahal satu pertanyaan cukup. Aksi hari ini: saat instruksi terasa kabur, kirim satu pertanyaan singkat, lalu ulangi jawabannya untuk memastikan.", [
 {"layout": "plinko", "vo": "Atasan menulis di grup: tolong rapikan datanya, ya. Kamu menebak maksudnya, lalu seharian merapikan format. Ternyata yang diminta cuma menghapus data ganda.",
  "f": {"headline": "Tebakan\nyang meleset", "highlight": "meleset", "resultCue": "Ternyata", "resultSlot": 2, "resultLabel": "Maksud sebenarnya",
        "actor": dict(SH, auto=False, keys=[{"cue": "menebak", "expr": "neutral", "pose": "think"}, {"cue": "seharian", "pose": "stand"}, {"cue": "Ternyata", "expr": "shock", "emote": "!", "pose": "cover"}]),
        "slots": [{"label": "Format"}, {"label": "Urutan"}, {"label": "Data ganda", "good": True}],
        "drops": [{"cue": "menebak", "slot": 0, "n": 3, "label": "Tebakanmu", "icon": "help"}, {"cue": "format", "slot": 0, "n": 2, "label": "Tebakanmu", "icon": "help"}]}},
 {"layout": "popcorn", "vo": "Menebak itu diam-diam melelahkan. Dari satu kalimat, muncul banyak kemungkinan. Dia buru-buru? Dia kesal? Versi lama salah? Kepala penuh, kerjaan belum jalan.",
  "f": {"headline": "Kepala penuh\ntebakan", "highlight": "tebakan", "sign": "TEBAKAN", "heatCue": "kalimat", "end": "overflow", "endCue": "Kepala", "endLabel": "Kerjaan belum jalan",
        "actor": dict(GL, keys=[{"cue": "Menebak", "expr": "tired"}, {"cue": "buru-buru", "expr": "confused", "emote": "?"}]),
        "items": [{"label": "Dia buru-buru?", "cue": "buru-buru", "icon": "clock"}, {"label": "Dia kesal?", "cue": "kesal", "icon": "alert"}, {"label": "Versi lama salah?", "cue": "Versi", "icon": "file"}]}},
 {"layout": "fishing", "vo": "Lebih aman lempar satu pertanyaan langsung. Rapikan bagian mana, Bu, dan untuk apa? Jawabannya datang jelas, dan kamu tahu persis apa yang harus dikerjakan.",
  "f": {"headline": "Lempar satu\npertanyaan", "highlight": "pertanyaan", "castCue": "lempar", "bait": "Bagian mana, Bu?", "catchCue": "Jawabannya", "catch": 0, "catchLabel": "Jawaban jelas",
        "actor": dict(HJ),
        "fish": [{"label": "Jawaban jelas", "cue": "pertanyaan", "color": "#E8A317"}, {"label": "Tebakan", "cue": "Rapikan", "kind": "boot"}]}},
 {"layout": "pinball", "vo": "Bertanya itu bukan tanda tidak paham. Tanyakan tujuannya, minta contohnya, dan kapan dibutuhkan. Tiga pertanyaan pendek ini bisa menghemat waktu berjam-jam.",
  "f": {"headline": "Tiga pertanyaan\npendek", "highlight": "pendek", "led": "PERTANYAAN", "end": "win", "endCue": "Tiga", "endWord": "JELAS!", "endLabel": "Hemat waktu",
        "actor": dict(LG, keys=[{"cue": "Bertanya", "expr": "smile"}]),
        "items": [{"label": "Tujuannya?", "cue": "tujuannya", "icon": "target", "value": "1"}, {"label": "Contohnya?", "cue": "contohnya", "icon": "file", "value": "2"},
                  {"label": "Kapan dibutuhkan?", "cue": "kapan", "icon": "clock", "value": "3"}]}},
 {"layout": "slingshot", "vo": "Aksi hari ini: saat instruksi terasa kabur, jangan menebak. Kirim satu pertanyaan singkat, lalu ulangi jawabannya dengan kata-katamu untuk memastikan kamu paham.",
  "f": {"headline": "Tanya dulu,\nbaru kerja", "highlight": "baru kerja", "fireCue": "ulangi", "target": {"label": "Paham maksudnya", "icon": "target"}, "ammo": "help",
        "hitText": "PAS!", "endLabel": "Kerja tepat sasaran", "actor": dict(SH),
        "items": [{"label": "Instruksi kabur?", "cue": "kabur", "icon": "help"}, {"label": "Kirim 1 pertanyaan", "cue": "Kirim", "icon": "chat"}, {"label": "Ulangi jawabannya", "cue": "singkat", "icon": "check"}]}},
 CTA("Satu pertanyaan hari ini menghindarkan satu kerja ulang besok. Selamat hari Rabu.", "Mau tanya apa hari ini?", "Tanya,\njangan menebak", "jangan menebak")])

ep("KD21", 144, "Kirim sebagai PDF", "Dokumen resmi dikirim sebagai PDF agar tampilannya tidak berubah.",
   "Dokumen yang dikirim berubah tampilan di perangkat penerima",
   "Kirim dokumen resmi berikutnya sebagai PDF, buka sekali untuk mengecek hasilnya, dan simpan file aslinya untuk diedit.",
   "File dokumen biasa bisa tampil berbeda di perangkat penerima, sedangkan PDF menjaga tampilannya tetap sama. Aksi hari ini: kirim dokumen resmi berikutnya sebagai PDF dan simpan file aslinya untuk diedit.", [
 {"layout": "popcorn", "vo": "Kamu mengirim surat penawaran dalam file dokumen biasa. Di laptop klien, hurufnya berubah, tabelnya bergeser, halamannya loncat. Rapi di tempatmu, berantakan di tempat mereka.",
  "f": {"headline": "Rapi di sini,\nberantakan di sana", "highlight": "berantakan", "sign": "FILE DOKUMEN", "heatCue": "laptop", "end": "overflow", "endCue": "berantakan", "endLabel": "Berantakan di klien",
        "actor": dict(GL, keys=[{"cue": "Kamu", "expr": "smile"}, {"cue": "tabelnya", "expr": "worried"}]),
        "items": [{"label": "Huruf berubah", "cue": "hurufnya", "icon": "file"}, {"label": "Tabel bergeser", "cue": "tabelnya", "icon": "chart"}, {"label": "Halaman loncat", "cue": "halamannya", "icon": "alert"}]}},
 {"layout": "plinko", "vo": "Kenapa bisa begitu? File dokumen biasa disusun ulang oleh aplikasi di perangkat penerima. Beda laptop, beda HP, beda aplikasi, hasilnya pun beda.",
  "f": {"headline": "Beda perangkat,\nbeda tampilan", "highlight": "beda tampilan", "resultCue": "hasilnya", "resultSlot": 1, "resultLabel": "Tampilan berubah-ubah",
        "actor": dict(HJ, keys=[{"cue": "Kenapa", "expr": "confused", "emote": "?", "pose": "think"}, {"cue": "Beda", "pose": "stand", "expr": "neutral"}]),
        "slots": [{"label": "Laptop lain", "bad": True}, {"label": "HP", "bad": True}, {"label": "Aplikasi lain", "bad": True}],
        "drops": [{"cue": "disusun", "slot": 0, "label": "File kamu", "icon": "file"}, {"cue": "Beda laptop", "slot": 0}, {"cue": "beda HP", "slot": 1}, {"cue": "beda aplikasi", "slot": 2}]}},
 {"layout": "ferris", "vo": "PDF berbeda. Tampilannya seperti dikunci, jadi di laptop, HP, atau tablet mana pun, isinya tetap sama persis seperti yang kamu kirim.",
  "f": {"headline": "PDF mengunci\ntampilan", "highlight": "tampilan", "stopCue": "jadi", "pick": 0, "hub": "Tampilan tetap sama", "speed": .45,
        "actor": dict(SH, keys=[{"cue": "PDF", "expr": "smile"}]),
        "cabins": [{"label": "Laptop", "cue": "laptop", "badge": "check"}, {"label": "HP", "cue": "HP", "badge": "check"}, {"label": "Tablet", "cue": "tablet", "badge": "check"}, {"label": "Laptop klien", "cue": "isinya", "badge": "check"}]}},
 {"layout": "pinball", "vo": "Caranya mudah. Di aplikasimu, klik simpan sebagai atau unduh, pilih format PDF, lalu buka sekali untuk mengecek hasilnya sebelum dikirim.",
  "f": {"headline": "Tiga klik\njadi PDF", "highlight": "PDF", "led": "LANGKAH", "end": "win", "endCue": "mengecek", "endWord": "PDF SIAP!", "endLabel": "Siap dikirim",
        "actor": dict(LG, keys=[{"cue": "Caranya", "expr": "smile"}]),
        "items": [{"label": "Simpan sebagai", "cue": "simpan", "icon": "file", "value": "1/3"}, {"label": "Pilih PDF", "cue": "format", "icon": "check", "value": "2/3"},
                  {"label": "Buka & cek", "cue": "buka", "icon": "help", "value": "3/3"}]}},
 {"layout": "bowling", "vo": "Aksi hari ini: kirim dokumen resmi berikutnya sebagai PDF. Surat, penawaran, dan laporan tampil rapi, sementara file aslinya tetap kamu simpan untuk diedit.",
  "f": {"headline": "Kirim versi\nPDF", "highlight": "PDF", "rollCue": "sebagai", "result": "strike", "strikeText": "RAPI!", "endLabel": "Tampil rapi di mana saja", "ballLabel": "PDF",
        "actor": dict(HJ),
        "pins": [{"label": "Huruf berubah", "cue": "Aksi"}, {"label": "Tabel bergeser", "cue": "kirim"}, {"label": "Halaman loncat", "cue": "resmi"}]}},
 CTA("Rapi saat dibuat, rapi juga saat dibuka. Selamat hari Kamis.", "Mau kirim dokumen apa?", "Kirim sebagai\nPDF", "PDF")])

ep("JS21", 145, "Jangan sekadar ikut", "Pilihan mayoritas belum tentu pilihan yang benar.",
   "Ikut suara terbanyak tanpa memeriksa alasannya",
   "Sebelum ikut suara terbanyak, tanyakan alasannya dan cek datanya; kalau tidak cocok, sampaikan pendapatmu dengan sopan.",
   "Suara terbanyak belum tentu benar, jadi cek alasan dan datanya dulu. Aksi hari ini: sebelum ikut pilihan mayoritas, tanyakan alasannya dan cek datanya, lalu sampaikan pendapatmu dengan sopan.", [
 {"layout": "plinko", "vo": "Di rapat, tim memilih aplikasi absensi baru. Hampir semua memilih aplikasi A karena paling ramai dipakai. Kamu ragu, tapi akhirnya ikut saja.",
  "f": {"headline": "Ikut yang\nramai saja", "highlight": "ramai", "resultCue": "ikut", "resultSlot": 0, "resultLabel": "Ikut yang ramai",
        "actor": dict(GL, auto=False, keys=[{"cue": "ragu", "expr": "worried", "pose": "think"}, {"cue": "ikut", "expr": "neutral", "pose": "shrug"}]),
        "slots": [{"label": "Aplikasi A", "bad": True}, {"label": "Aplikasi B"}],
        "drops": [{"cue": "Hampir", "slot": 0, "n": 5, "label": "Suara tim", "icon": "users"}, {"cue": "ikut", "slot": 0, "label": "Suaramu", "color": "#D84315"}]}},
 {"layout": "ferris", "vo": "Kenapa kita mudah ikut? Takut dianggap beda, sungkan pada senior, atau mengira yang ramai pasti benar. Akhirnya semua berputar di pilihan yang sama.",
  "f": {"headline": "Kenapa\nmudah ikut?", "highlight": "mudah ikut?", "hub": "Ikut arus", "hubCue": "berputar", "hubBad": True, "speed": .55,
        "actor": dict(HJ, keys=[{"cue": "Kenapa", "pose": "think", "expr": "confused", "emote": "?"}, {"cue": "Takut", "pose": "point", "expr": "neutral"}, {"cue": "Akhirnya", "expr": "worried", "shake": True}]),
        "cabins": [{"label": "Takut beda", "cue": "Takut"}, {"label": "Sungkan", "cue": "sungkan"}, {"label": "Ramai = benar?", "cue": "ramai"}, {"label": "Ikut saja", "cue": "Akhirnya"}]}},
 {"layout": "claw", "vo": "Sebelum ikut, cek dulu kebutuhannya. Gudang kita sinyalnya lemah, jadi yang cocok justru aplikasi B yang bisa dipakai tanpa internet, bukan yang paling ramai.",
  "f": {"headline": "Cek dulu\nkebutuhannya", "highlight": "kebutuhannya", "title": "SESUAI KEBUTUHAN", "winLabel": "Cocok untuk gudang",
        "actor": dict(SH, keys=[{"cue": "Sebelum", "expr": "neutral"}]),
        "prizes": [{"label": "Aplikasi A", "icon": "star", "color": "#D84315"}, {"label": "Aplikasi B", "icon": "check", "color": "#2F6F73"}, {"label": "Aplikasi C", "icon": "gear", "color": "#E8A317"}],
        "tries": [{"cue": "ikut", "pick": 0, "result": "slip"}, {"cue": "cocok", "pick": 1, "result": "win"}]}},
 {"layout": "fishing", "vo": "Kalau ragu, jangan diam. Ajukan satu pertanyaan di rapat: apa alasannya, dan datanya dari mana? Pertanyaan ini sering memancing fakta yang terlewat.",
  "f": {"headline": "Pancing\nalasannya", "highlight": "alasannya", "castCue": "Ajukan", "bait": "Alasannya apa?", "catchCue": "Pertanyaan ini", "catch": 0, "catchLabel": "Fakta yang terlewat",
        "actor": dict(LG, keys=[{"cue": "Kalau", "expr": "worried"}, {"cue": "Ajukan", "expr": "neutral"}]),
        "fish": [{"label": "Fakta", "cue": "datanya", "color": "#E8A317"}, {"label": "Asumsi", "cue": "rapat", "color": "#4F8FD9"}]}},
 {"layout": "bowling", "vo": "Aksi hari ini: sebelum ikut suara terbanyak, tanyakan alasannya dan cek datanya. Kalau tetap cocok, ikut dengan yakin. Kalau tidak, sampaikan dengan sopan.",
  "f": {"headline": "Tanya alasan,\ncek data", "highlight": "cek data", "rollCue": "tanyakan", "result": "strike", "strikeText": "YAKIN!", "endLabel": "Putuskan dengan data", "ballLabel": "Tanya & cek",
        "actor": dict(GL),
        "pins": [{"label": "Asal ikut", "cue": "Aksi"}, {"label": "Sungkan", "cue": "sebelum"}, {"label": "Takut beda", "cue": "suara"}]}},
 CTA("Ramai belum tentu benar. Yang benar perlu dicek. Selamat hari Jumat.", "Apa alasannya?", "Jangan\nsekadar ikut", "sekadar ikut")])

ep("SC21", 146, "Simpan di tempat aman", "Pilih bank atau lembaga yang diawasi OJK. Simpanan bank dijamin LPS sampai batas tertentu.",
   "Tergiur menyimpan uang di tempat yang menjanjikan untung besar tanpa izin jelas",
   "Cek apakah tempatmu menyimpan uang terdaftar dan diawasi OJK, lalu pastikan bunga simpananmu tidak melebihi tingkat bunga penjaminan LPS.",
   "Simpan uang di bank atau lembaga resmi yang diawasi OJK; simpanan di bank dijamin LPS sampai Rp2 miliar per nasabah per bank dengan syarat 3T. Aksi hari ini: cek izin OJK tempatmu menyimpan uang dan pastikan bunganya tidak melebihi bunga penjaminan LPS.", [
 {"layout": "fishing", "vo": "Seseorang menawarkan titip uang dengan untung sepuluh persen sebulan, katanya pasti aman. Tabunganmu tergoda, mendekat, lalu terpancing. Uangnya bisa hilang tanpa jejak.",
  "f": {"headline": "Umpan\nuntung besar", "highlight": "untung besar", "castCue": "menawarkan", "bait": "Untung 10%/bulan!", "catchCue": "terpancing", "catch": 0, "catchLabel": "Uang bisa hilang",
        "actor": dict(GL, auto=False, keys=[{"cue": "menawarkan", "expr": "smile"}, {"cue": "terpancing", "expr": "happy"}]),
        "fish": [{"label": "Tabunganmu", "cue": "titip", "color": "#E8A317"}]}},
 {"layout": "claw", "vo": "Jadi, jangan pilih tempat menyimpan karena janji untung besar. Pilih bank atau lembaga keuangan resmi yang terdaftar dan diawasi OJK.",
  "f": {"headline": "Pilih yang\ndiawasi OJK", "highlight": "diawasi OJK", "title": "TEMPAT MENYIMPAN", "winLabel": "Terdaftar & diawasi OJK",
        "actor": dict(HJ, keys=[{"cue": "Jadi", "expr": "neutral"}]),
        "prizes": [{"label": "Janji untung", "icon": "money", "color": "#D84315"}, {"label": "Diawasi OJK", "icon": "shield", "color": "#2F6F73"}, {"label": "Titip teman", "icon": "users", "color": "#E8A317"}],
        "tries": [{"cue": "janji", "pick": 0, "result": "slip"}, {"cue": "Pilih bank", "pick": 1, "result": "win"}]}},
 {"layout": "ferris", "vo": "Simpanan di bank, baik tabungan, giro, maupun deposito, dijamin LPS sampai dua miliar rupiah per nasabah per bank. Jadi simpananmu punya pelindung.",
  "f": {"headline": "Dijamin LPS", "highlight": "LPS", "stopCue": "dijamin", "pick": 0, "hub": "Dijamin LPS s.d. Rp2 miliar", "hubIcon": "shield", "speed": .4,
        "actor": dict(SH, keys=[{"cue": "Simpanan", "expr": "smile"}]),
        "cabins": [{"label": "Tabungan", "cue": "tabungan", "badge": "shield"}, {"label": "Giro", "cue": "giro", "badge": "shield"}, {"label": "Deposito", "cue": "deposito", "badge": "shield"}]}},
 {"layout": "pinball", "vo": "Tapi ada syaratnya, disebut tiga T. Tercatat di pembukuan bank, bunganya tidak melebihi bunga penjaminan LPS, dan tidak melakukan tindakan yang merugikan bank.",
  "f": {"headline": "Syarat\ntiga T", "highlight": "tiga T", "led": "SYARAT 3T", "end": "win", "endCue": "merugikan", "endWord": "3T BERES!", "endLabel": "Simpanan dijamin",
        "actor": dict(LG, keys=[{"cue": "Tapi", "expr": "neutral", "nod": True}]),
        "items": [{"label": "Tercatat di bank", "cue": "Tercatat", "icon": "file", "value": "T1"}, {"label": "Bunga tidak melebihi LPS", "cue": "bunganya", "icon": "money", "value": "T2"},
                  {"label": "Tidak merugikan bank", "cue": "tidak melakukan", "icon": "shield", "value": "T3"}]}},
 {"layout": "slingshot", "vo": "Aksi hari ini: cek apakah tempatmu menyimpan uang terdaftar dan diawasi OJK. Lalu pastikan bunga simpananmu tidak melebihi bunga penjaminan LPS.",
  "f": {"headline": "Cek izin,\ncek bunga", "highlight": "cek bunga", "fireCue": "melebihi", "target": {"label": "Uang aman", "icon": "shield"}, "ammo": "shield",
        "hitText": "AMAN!", "endLabel": "Simpanan terlindungi", "actor": dict(HJ),
        "items": [{"label": "Cek izin OJK", "cue": "cek", "icon": "shield"}, {"label": "Cek bunga simpanan", "cue": "pastikan", "icon": "money"}]}},
 CTA("Uang yang disimpan di tempat aman bikin hati lebih tenang. Selamat hari Sabtu.", "Uangmu disimpan di mana?", "Simpan di\ntempat aman", "tempat aman")])
