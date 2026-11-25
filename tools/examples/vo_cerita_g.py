VO = {
"SP26": [
 "Kuartal ini, Bimo mencoba semua tips fokus sekaligus: meja berdiri, pomodoro, sampai kerja jam enam pagi. Hasilnya? Ia malah menguap di depan laptop.",
 "Padahal Laila, rekannya, paling tajam jam sembilan pagi di ruangan sunyi. Bimo justru baru panas setelah makan siang, sambil mendengar musik pelan.",
 "Ternyata, cara fokus terbaik berbeda tiap orang. Ada yang butuh sunyi, ada yang butuh musik. Ada yang tajam pagi, ada yang siang.",
 "Kuncinya, gabungkan cara yang paling cocok dengan jam emasmu. Saat Bimo memasang musik pelan tepat setelah makan siang, laporannya selesai dalam sekali duduk.",
 "Aksi hari ini: lihat lagi catatan fokusmu kuartal ini. Pilih satu cara paling ampuh, lalu pasang di jam emasmu besok.",
 "Fokus terbaik bukan soal meniru orang lain, tapi mengenal dirimu sendiri. Selamat hari Selasa.",
],
"RN26": [
 "Rapat sore itu, Mira mengkritik desain Fajar di depan semua orang. Wajah Fajar memanas, dan kata-kata tajam sudah di ujung lidahnya.",
 "Ia teringat bulan lalu, saat ia membalas dengan ketus. Kata-kata itu terbang, tak bisa ditarik kembali, dan suasana tim jadi canggung berminggu-minggu.",
 "Kali ini Fajar memilih diam sejenak. Ia menarik napas panjang, menghitung sampai lima, dan membiarkan panasnya turun pelan-pelan.",
 "Jeda singkat memberi waktu untuk berpikir, bukan sekadar bereaksi. Fajar lalu menjawab dengan tenang, menanyakan bagian mana yang perlu diperbaiki. Rapat pun kembali hangat.",
 "Aksi hari ini: saat emosimu mulai naik, diam dan tarik napas lima detik sebelum menjawab. Bicaralah setelah kepala dingin.",
 "Kata yang tertahan masih bisa diucapkan nanti, tapi kata yang terucap tak bisa ditarik kembali. Selamat hari Rabu.",
],
"KD26": [
 "Kamis malam, Rudi butuh satu file kontrak untuk rapat besok pagi. Ia membuka laptop, dan desktopnya penuh ikon sampai gambar latarnya tak terlihat.",
 "Folder unduhan lebih parah: ratusan file bernama mirip, menumpuk sejak setahun lalu. Galeri fotonya pun penuh tangkapan layar yang sudah tak terpakai.",
 "Berkas digital itu mirip barang di rumah. Kalau tidak dirapikan secara rutin, ia menumpuk diam-diam dan akhirnya menyembunyikan yang penting.",
 "Rudi pun bersih-bersih. Ikon desktop masuk ke folder proyek, unduhan lama dihapus, dan foto kerja dipindah ke album. File kontraknya langsung ketemu.",
 "Aksi hari ini: sisihkan sepuluh menit setiap Kamis sore untuk merapikan desktop, folder unduhan, dan galeri foto kerjamu. Jadikan kebiasaan.",
 "Ruang digital yang rapi bikin kerja lebih cepat dan kepala lebih tenang. Selamat hari Kamis.",
],
"JS26": [
 "Jumat sore, Bu Wulan merenungkan satu keputusan besarnya kuartal ini: memilih katering termurah untuk acara ulang tahun kantor, tanpa membaca ulasannya dulu.",
 "Hasilnya? Makanan datang terlambat satu jam, dan para tamu sudah kelaparan. Bu Wulan sempat malu, tapi ia tidak mau sekadar melupakannya.",
 "Ia lalu bertanya pada dirinya sendiri. Apa yang terjadi? Kenapa bisa begitu? Apa yang akan kulakukan berbeda? Jawabannya jelas: cek ulasan, jangan cuma harga.",
 "Satu keputusan yang direnungkan memberi pelajaran untuk keputusan berikutnya. Untuk acara bulan depan, Bu Wulan sudah tahu cara memilih yang lebih baik.",
 "Aksi hari ini: pilih satu keputusan minggu ini, lalu tulis jawaban tiga pertanyaan tadi di buku catatanmu. Cukup lima menit.",
 "Keputusan yang direnungkan tak pernah sia-sia, bahkan yang keliru sekalipun. Selamat hari Jumat.",
],
"SC26": [
 "Sudah satu kuartal, Dewi menabung untuk biaya kursus desain. Tapi bulan ini semangatnya mulai kendur. Rasanya uangnya tidak bertambah, padahal ia rutin menyisihkan gaji.",
 "Pak Anton, rekan satu timnya, bertanya santai: sudah berapa yang terkumpul? Dewi menggeleng. Ia tidak pernah melihat angkanya lagi sejak bulan pertama.",
 "Malam itu ia membuka catatan tabungannya di ponsel. Ternyata sudah terkumpul enam puluh persen dari target! Dunianya serasa kembali berwarna.",
 "Melihat progres membuat semangat menabung terjaga. Garis finis terasa makin dekat, dan setiap setoran berikutnya jadi lebih ringan dijalani.",
 "Aksi hari ini: cek saldo tabunganmu, hitung persentasenya dari target, lalu tulis angkanya di tempat yang paling sering kamu lihat.",
 "Tabungan memang tumbuh pelan, tapi semangatmu ikut tumbuh setiap kali kamu melihat progresnya. Selamat hari Sabtu.",
],
}
if __name__ == "__main__":
    for k, v in VO.items(): print(k, len(" ".join(v).split()), [len(x.split()) for x in v])
