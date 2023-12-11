# Gap Limit

**Peringatan! Pengaturan batas kesenjangan ini sebaiknya dibiarkan begitu saja.** Peningkatan batas kesenjangan dapat menyebabkan penurunan kinerja yang besar.

Batas kesenjangan menetapkan jumlah alamat yang akan dihasilkan dompet dan melihat ke depan untuk menentukan penggunaan. Secara default, batas kesenjangan diatur ke 20. Ini berarti 2 hal.

  1. Saat dompet pertama kali dimuat, dompet memindai penggunaan alamat dan memperkirakan kesenjangan terbesar antar alamat adalah 20;

  2. Saat memberikan alamat yang baru dibuat kepada pengguna, ia hanya akan memberikan 20 alamat lalu mengulang kembali, yang memastikan bahwa kesenjangan tidak lebih besar dari 20.

Sebenarnya hanya ada 2 alasan mengapa Anda harus mengubah nilai ini:

  1. Jika dompet Anda dibuat dan banyak digunakan sebelum kira-kira v1.0, mungkin ada kesenjangan alamat yang besar. Jika Anda memulihkan dari awal dan menyadari bahwa Anda kehilangan dana, Anda dapat meningkatkannya menjadi 100 (kemudian 1000 jika tidak diperbaiki) kemudian memulai kembali dekrediton. Setelah saldo Anda terselesaikan, Anda dapat kembali ke 20.

  2. Jika Anda ingin dapat menghasilkan lebih dari 20 alamat sekaligus tanpa harus berbelit-belit.
