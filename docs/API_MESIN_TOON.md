# Mode Cerita: API singkat

Mode visual "cerita" = adegan kartun layar penuh ala Shorts (tokoh kepala bulat besar, kamera bergerak, latar lengkap, teks 1–3 kata besar). Kode: blok `MODE CERITA` di akhir `engine/motion-tangani.js`. Contoh: `engine/packs/cerita_demo.js` (mesin uji: `engine/studio-cerita_demo.html`), proyek demo `demo/project.json` (generator `demo/mk_demo.py`).

## Mengaktifkan
```json
"motion": {"mode": "cerita",
           "transitions": ["whip", "zoom", "iris", "whip", "fade"],
           "host": {"hair": "short", "shirt": "#2F6F73", "tie": "#C2691F", "skin": "d"},
           "ctaEnv": "beach", "subY": 1400}
```
- Tanpa `mode: "cerita"` tidak ada yang berubah (sudah diuji: frame identik piksel).
- Topik atas (`topHead`/headline) TIDAK dipakai. Header (logo + "Tangani Talenta") dan footer (talenta.tangani.id) dibuat kecil dan putih di atas latar.
- Subtitle otomatis: 1–3 kata HURUF BESAR, putih dengan garis tepi gelap tebal, kata yang sedang diucapkan berwarna oranye, pop kecil saat ganti, y ≈ 1400 (ubah lewat `motion.subY`). Waktu kata dari timing subtitle mesin (per suku kata, jeda VO). Matikan per adegan dengan `f.noSub: true`.
- Transisi masuk ke adegan i: `transitions[(i-1) % n]`, atau per adegan `f.trans`: `whip` (geser cepat + blur + garis), `zoom` (tembus zoom + kilat krem), `iris` (lingkaran menutup ke wajah tokoh utama lalu membuka), `fade` (hitam singkat), `flash` (kilat krem), `cut`.
- Adegan terakhir `cta` digambar ulang otomatis: tokoh host (`motion.host`) melambai di pantai senja, `question` di balon, `headline` besar di atas, logo, pill + confetti.
- Adegan dengan layout lama (bukan cerita) tetap jalan: latar lama + layout lama, header/subtitle cerita.

## Cara 1: tanpa kode, layout `"cerita"` (data saja)
```json
{"layout": "cerita", "vo": "Coba aturan dua menit. Kalau sebuah tugas bisa selesai kurang dari dua menit, kerjakan saat itu juga.",
 "f": {"env": "street", "envOpt": {"time": "day"},
       "toons": [
         {"id": "raka", "x": 330, "size": 740, "hair": "short", "shirt": "#2F6F73", "tie": "#C2691F", "skin": "d",
          "keys": [{"at": 0, "expr": "sad"}, {"cue": "aturan", "expr": "confused"},
                   {"cue": "kerjakan", "expr": "happy", "emote": "idea", "jump": 90}]},
         {"x": 1350, "face": -1, "hair": "hijab", "hijab": "#C2691F", "glasses": true, "talk": true,
          "keys": [{"at": 0.1, "x": 760}, {"cue": "aturan", "pose": "pointUp", "say": "Aturan 2 menit!", "kind": "shout"},
                   {"cue": "Kalau", "pose": "talk"}]}],
       "cam": [{"at": 0, "x": 540, "y": 1060, "zoom": 1.05},
               {"cue": "aturan", "on": 1, "fit": 0.48, "dur": 0.8},
               {"cue": "Kalau", "x": 560, "y": 980, "zoom": 1, "dur": 0.9},
               {"cue": "kerjakan", "shake": 14},
               {"cue": "selesai", "cut": true, "on": "raka", "fit": 0.55}],
       "props": [{"type": "box", "x": 900, "y": 1640, "cue": "tugas"}],
       "cards": [{"cue": "kurang", "outCue": "kerjakan", "style": "cream", "tag": "Aturannya", "label": "Kurang dari", "big": "2 MENIT", "y": 330}],
       "stamp": {"text": "Aturan\n2 menit", "hl": "2 menit", "tag": "1 Menit 1 Insight", "at": 0.1, "hold": 2.4}}}
```
SFX otomatis: say→pop, jump→whoosh, expr shock→ping, emote idea/check→chime, kartu/prop→pop, cut→whoosh, shake→pop, stamp→chime.

## Cara 2: paket adegan sendiri
```js
(() => { if (!TT.scene) return;
  const { cueT, cam, env, envFront, toon, toonState, toonHead, prop, infoCard, titleStamp, bubble } = TT;
  TT.scene("x_kantor", "Cerita: kantor", (ctx, th, s, t) => {   // t = detik lokal adegan
    const f = s.f, hero = Object.assign({ x: 400, size: 760 }, f.hero);
    const st = toonState(hero, s, t);
    const c = cam(s, t, [{ at: 0, x: 540, y: 1000, zoom: 1.1 }, { cue: f.zoomCue, on: 0, fit: .55, dur: .8 }],
      { resolve: (on, tt, k) => { const h = toonHead(st); return [h[0], h[1] + 10, k.fit ? 1080 * k.fit / (st.size * 42 / 92) : null]; } });
    env(ctx, "office", t, c, { deskX: 800 });        // latar dulu
    toon(ctx, c, hero, s, t, { st });               // lalu tokoh (dunia)
    envFront(ctx, "office", t, c, {});              // lapisan depan (opsional)
    infoCard(ctx, { T: cueT(s, f.cardCue, .5), label: "Judul", big: "70%", y: 300 }, t);   // overlay layar
  }, (s, f, i, add) => add(cueT(s, f.zoomCue, .5, i), "whoosh"));
})();
```
Urutan: `cam` → `env` → objek dunia/tokoh → `envFront` → overlay (kartu, stempel). Grading warna hangat + vignette dipasang otomatis setelah fungsi adegan; kartu, stempel, dan balon digambar SESUDAH grading (warna merek tetap bersih).

## Fungsi TT
| Fungsi | Keterangan |
| --- | --- |
| `TT.scene(name, label, draw(ctx, th, s, t), sfx(s, f, i, add), fields)` | daftarkan adegan cerita layar penuh (tanpa kamera/latar lama) |
| `TT.cam(s, t, keys, opts)` → `c` | kamera. key: `{at\|cue, x, y, zoom, rot, dur=.9, ease: io\|out\|back\|lin\|in\|el, cut:true, shake: px, sdur=.55, on, fit, dx, dy}`. Key pertama di t=0 tanpa `dur` = posisi awal. `cut` = potong instan. `on` + `opts.resolve(on, t, key)` → `[x, y, zoom]` untuk mengikuti tokoh; `fit` = lebar kepala / lebar layar (0.5 = close-up, 0.6 = wajah penuh). opts: `{handheld=1 (goyang halus), push=.004 (dorong zoom per detik), shake:[{at\|cue, amp, sdur}], resolve}`. `c.apply(ctx, depth)`, `c.toScreen(x, y, depth)`, `c.scale(depth)` |
| `TT.layer(ctx, c, depth, fn)` | gambar dalam koordinat dunia dengan paralaks (`depth` 0.1 jauh … 1 dunia … 1.3 depan) |
| `TT.env(ctx, kind, t, c, o)` | latar layar penuh. kind: `office`, `home` (rumah kayu malam), `street`, `park`, `beach`, `sky`, `sunset`, `night` (= `city`), `info` (navy infografis). o: `ground` (default 1640), `time: day\|dusk\|night` (street/park/beach/sky; office/home: night/day), office `{desk:false\|"front", deskX, rug, rugX, plant, plantX}`, home `{lampX}`, park `{bench, benchX, treeX}`, beach `{palmX}`, sky `{hills}`, info `{spotX, horizon}`, `grade:{warm, vig, cream}` |
| `TT.envFront(ctx, kind, t, c, o)` | lapisan depan: park semak, sky/sunset awan, office meja depan (`desk:"front"`) |
| `TT.prop(ctx, type, x, y, o, t)` | properti dunia (y = lantai): `desk {laptop, back, mug, papers, lx}`, `chair`, `plant`, `bench`, `box`, `board {bars:[..], p}`, `sofa {color}`, `phone {notif, screen, rot}`, `lamp`, `clock {fast}`; `o.s` skala |
| `TT.toon(ctx, c, actor, s, t, {st, depth})` | gambar tokoh, kembalikan jangkar dunia `{headX, headY, top, mouthY, r, k}` + `.screen.head/.top`. Balon `say` diantre otomatis di atas semuanya |
| `TT.toonState(actor, s, t)` / `TT.drawToon(ctx, actor, st, t)` / `TT.toonHead(st)` | versi manual |
| `TT.bubble(ctx, text, x, y, k, {kind: say\|shout\|think, size=50, maxW=640, side})` | balon besar (layar), ekor ke (x,y), `k` = detik sejak muncul; otomatis dijepit ke x 90–990, y ≥ 210 |
| `TT.titleStamp(ctx, {text:"A\nB", hl, tag, at=.15, hold=2.6, y=600, size=118, rot=-3}, t)` | stempel judul besar menghantam masuk (pakai di adegan pertama) |
| `TT.infoCard(ctx, o, t)` | kartu dokumenter. o: `{T\|at, outT\|out, x=540 (tengah), y=640 (atas), w=780, style: navy\|cream, tag, tagColor: orange\|yellow, label (HURUF BESAR otomatis), icon, big:"70%" atau num:{to, from, dec, prefix, suffix} (hitung naik), sub, bars:[{v 0..1, label, hl}], rot=-1.5, world:false}` |
| `TT.outlineWords(ctx, [{w, hl}], cx, y, size, {fill, hl, sw})` | teks tebal bergaris (gaya subtitle) |
| `TT.voLevel(gt)` | kerasnya VO 0..1 di detik global (penggerak mulut) |
| `TT.isCerita()`, `TT.ENV_KINDS`, `TT.TOON_POSES`, `TT.TOON_EXPRS`, `TT.CS` | info |

## Tokoh (actor)
Tinggi `size` px (default 760; kepala ≈ 42 % tinggi). Posisi `x`, kaki di `y` (default 1640). `face: 1|-1`.
- Tampilan: `skin a|b|c|d|e|w|#hex`, `hair short|side|long|bun|curly|spiky|hijab|bald|kopiah`, `hairColor`, `hijab` (warna), `hat cap|fedora|helmet|kopiah`, `hatColor`, `bandColor`, `glasses`, `mustache`, `beard: true|"goatee"`, `beardColor`, `shirt`, `jacket`, `stripes` (warna garis), `tie`, `collar:false`, `idcard` (warna tali), `sleeve:"short"`, `pants`, `shoes`, `shadow:false`.
- Perilaku: `pose`, `expr`, `talk` (mulut ikut VO), `look: "cam"|"down"|[x,y]`, `emote`, `autoPose:false`, `gesture:false` (tanpa gerak tangan saat bicara), `mouthGain`, `focus:true` (titik iris), `z` (urutan gambar di layout cerita), `id`.
- `keys: [{at|cue, x (jalan ke sana; run:true lari; speed; dur), face, pose, expr, talk, look, say, sayDur=2.6, kind, emote, emoteDur, jump (tinggi px, jumpDur), show, y}]`.
- Pose: `idle` (bernapas), `talk`, `wave`, `point`, `pointUp`, `shrug`, `facepalm`, `clap`, `scratch` (garuk kepala), `cheer`, `hips` (bangga), `think`, `phone`, `hold`, `scared`, `shock`, `sad`, `sit`; jalan/lari otomatis saat `x` berubah; lompat lewat `jump`. Ganti pose punya overshoot (follow-through), lompat punya antisipasi + squash & stretch.
- Ekspresi: `neutral`, `happy`, `laugh` (mata ^^, air mata, badan bergoyang), `shock` (mata melotot, mulut O, garis kejut, loncat kecil), `confused` (alis miring, "?" + garuk kepala), `sad` (kelopak turun, air mata, garis muram), `angry` (urat, asap, wajah merah, gigi), `scared` (keringat, gemetar, wajah pucat), `proud` (mata terpejam puas, dagu naik, kilau, tangan di pinggang). Ekspresi tanpa pose memilih pose otomatis.
- Emote: `!`, `?`, `!!`, `?!`, `heart`, `idea`, `sparkle`, `sweat`, `zzz`, `music`, `check`, `anger`.

## Tips tata letak
- Kanvas 1080×1920. Header ≈ y 0–150, footer ≈ y 1800–1920. Subtitle di y ≈ 1300–1460: jangan taruh wajah close-up atau kartu di sana; dada/badan tokoh boleh tertutup subtitle.
- Lantai 1640. Tokoh 700–800 px = medium shot (kepala ≈ y 950–1050); close-up wajah: kamera `on` + `fit` 0.5–0.6 (kepala ±600 px). Kartu info di y 250–700 saat ada close-up; atur `dy` di resolve (positif = kepala tampil lebih tinggi).
- Teks di kartu/balon otomatis diukur dan dikecilkan; tetap jaga label ≤ 4 kata.
- Gerak: selalu ada gerak dari latar (awan, debu, lampu, ombak) + napas/kedip tokoh; beri minimal satu push-in kamera, satu perubahan ekspresi dan satu aksi besar (lompat/shake/cut) per adegan.
- Narasi orang ketiga: biarkan `talk` mati; tokoh yang "berbicara" ke penonton: `talk: true`.
- Satu adegan = satu lingkungan; ganti lingkungan antar adegan supaya terasa seperti cerita.
