# LN Wallet Backup Information

Karena sifatnya sebagai jaringan lapisan kedua, data dompet yang terkait dengan LN **tidak** 
disimpan di dalam blockchain itu sendiri. Ini berarti bahwa seed dompet standar adalah
**tidak cukup** untuk mengembalikan saldo LN dari sebuah dompet jika terjadi seed ulang.

Pengguna LN harus **juga** secara teratur dan aman menyimpan file _SCB_ sehingga
lightning wallet yang dipulihkan dapat digunakan untuk menutup saluran yang dibuka oleh
dompet sebelumnya.

Cadangan harus diperbarui setiap kali saluran dibuka atau ditutup pada
node LN lokal (termasuk ketika node _remote_ membuka saluran kembali ke node lokal).
lokal).

Untuk informasi lebih lanjut mengenai backup LN, silakan lihat dokumentasi di
https://docs.decred.org/lightning-network/backups/