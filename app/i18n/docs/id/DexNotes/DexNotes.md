Selamat datang di DCRDEX!

Meskipun DCRDEX terlihat dan terasa seperti bursa biasa, namun ada beberapa perbedaan penting. Silakan baca Sorotan dan Pemberitahuan Penting di https://github.com/decred/dcrdex/blob/master/docs/release-notes/release-notes-0.2.0.md.

Perdagangan tidak diselesaikan secara instan. Penyelesaian terjadi secara on-chain, dan membutuhkan beberapa konfirmasi blok. Tergantung pada kondisi jaringan, hal ini dapat memakan waktu berjam-jam. Perangkat lunak DEX dan dompet eksternal seperti bitcoind HARUS tetap berjalan hingga transaksi Anda sepenuhnya diselesaikan atau dikembalikan.

Anda harus tetap terhubung ke internet selama durasi penuh penyelesaian perdagangan. Kehilangan konektivitas selama beberapa menit biasanya tidak masalah, tetapi waktu henti yang lama dapat menyebabkan swap dicabut (dipaksa untuk mengembalikan dana) dan order yang telah dipesan dibatalkan. Kehilangan koneksi ke server DEX TIDAK akan membahayakan dana Anda. Jika Anda perlu memulai ulang perangkat lunak DEX, pastikan untuk segera masuk kembali.

Selalu mulai wallet eksternal terlebih dahulu, dan hentikan wallet eksternal yang terakhir.

Selama swap, jika Anda atau mitra rekanan gagal bertindak karena alasan apa pun, pertandingan dapat dibatalkan setelah batas waktu. Jika Anda memiliki match yang dibatalkan, tetap jalankan perangkat lunak DEX dan wallet Anda hingga pengembalian dana selesai. Ini bisa memakan waktu hingga 20 jam, tergantung pada apakah Anda pembuat atau penerima.

Untuk mendapatkan dukungan, silakan kunjungi [#dex Matrix chat room] (https://matrix.to/#/!mlRZqBtfWHrcmgdTWB:decred.org?via=decred.org&via=matrix.org&via=planetdecred.org).