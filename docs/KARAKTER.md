# Karakter, merek & aturan konsistensi

Semua video harus tampak seperti satu keluarga. Hal-hal di bawah **tidak boleh berubah** antar episode/server.

## Merek
- Nama: **Tangani Talenta** (PT Tangani Digital Automasi). Logo: `assets/brand/logo.png` (sudah juga tertanam di `brand.logo` tiap `project.json`).
- Aksen: **#C2691F** (oranye talenta.tangani.id), nada krem hangat. Bukan warna per series.
- Header video: hanya logo + "Tangani Talenta" tengah atas. Footer: `talenta.tangani.id` (jangan ubah footer ikon-link).
- Label layar: `<SERIES> · 1 MENIT 1 INSIGHT` (mis. "SENIN BERTUMBUH · 1 MENIT 1 INSIGHT") hanya di data `brand.label`; baris label sudah disembunyikan di header.
- Font: Plus Jakarta Sans / Inter / Poppins (di-install otomatis dari npm @fontsource saat render pertama).
- Perusahaan dalam cerita (video panjang) = PT Tangani Digital Automasi, penyedia aplikasi + perangkat kasir untuk UMKM. Wajib catatan "cerita fiksi"; Tangani tidak pernah digambarkan membocorkan data/menipu.

## Suara
- **Citra** – "The Warmth in Every Word", ElevenLabs `voice_id = RbNgJzKAV7jpYJNtCBpj`. Satu-satunya suara; narator juga membacakan dialog.
- Endpoint TTS: `POST /v1/text-to-speech/RbNgJzKAV7jpYJNtCBpj?output_format=mp3_44100_128` (lihat `tools/tts.sh`). Kunci hanya butuh izin TTS.
- Episode pendek harus **tepat 60 dtk**: naskah ±113–125 kata (Citra ±2,05 kata/dtk), lalu `engine/fit_vo.py` (VO 59,2 dtk + ekor 0,8).

## Aturan wajib
1. **Semua tokoh wanita berhijab** (termasuk figuran, penonton, host CTA).
2. Adegan harus sesuai cerita episodenya dan **berbeda** dari adegan episode/paket lain (grep `engine/packs/*.js` sebelum membuat adegan baru).
3. Tiap series (hari) punya gaya video tetap (`STYLES` / `STYLES_Q2` di `engine/motion-tangani.js`) — jangan diacak.
4. Pemeran video panjang = 8 tokoh di `youtube/tokoh/tokoh.json` (tampilan baku `TT.toon`); pakai persis, jangan diubah warnanya.

## Pemeran tetap (youtube/tokoh/tokoh.json, lembar: assets/brand/lembar_tokoh.jpg)
| Tokoh | Peran | Ciri |
|---|---|---|
| **Rina** | tokoh utama, staf layanan pelanggan, 26 | hijab merah #D9483B, kemeja biru #5B7DB1, ID card oranye |
| **Bayu** | sahabat Rina, staf operasional, 27 | rambut spiky, kemeja oranye muda, ceria & ceroboh |
| **Bu Ratna** | supervisor, 40 | hijab marun #6E2430, kacamata, blazer biru tua, tegas tapi hangat |
| **Pak Hendra** | kepala divisi, 52 | rambut abu-abu, kacamata, kumis, dasi oranye, berwibawa |
| **Sinta** | koordinator tim, 29 | hijab teal #2F6F73, blazer oranye, rapi & komunikatif |
| **Yoga** | analis data, 30 | kacamata, kemeja hijau #7FA563, pendiam & teliti |
| **Nisa** | karyawan baru, 22 | hijab pink #E07A9B, kemeja kuning, antusias |
| **Dodi** | staf gudang/lapangan, 35 | topi oranye, jenggot kecil, humoris |
Figuran: Pak Wijaya (klien, kopiah), Mbak Wulan (resepsionis, hijab), Mas Andi (TI).
Alur besar serial: lihat `youtube/serial/panduan-serial.md` dan `garis-besar.md`.
