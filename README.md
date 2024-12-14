# Personal Bot Discord

Hai, ini adalah Repositori untuk perjalanan bot discord yang saya buat. Kode dalam Repositori ini akan berkembang seiring waktu, jadi pantangi terus ya.

Bot Discord multifungsi yang dirancang untuk memberikan fitur seperti moderasi, menampilkan embed tautan otomatis, mengatur status bot, mengirim Quote of the Day (QOTD), dan berbagai perintah lainnya.  

## Fitur

- **Perintah Umum:**
  - `adzan` - Melihat waktu adzan di lokasi tertentu di seluruh dunia.
  - `help` - Menampilkan daftar semua perintah.
  - `info` - Informasi tentang bot ini.
  - `ping` - Menampilkan latensi bot dan API Discord.
  - `qotd` - Minta Quote of the Day (QOTD) dari bot!
  - `say` - Mengirimkan pesan yang Anda tentukan.
 
- **Perintah Moderasi:**
  - `ban` - Melakukan ban kepada pengguna.
  - `kick` - Mengeluarkan pengguna dari server.
  - `mute` - Memberikan mute kepada pengguna.
  - `purge` - Menghapus sejumlah pesan dalam channel ini.
  - `purgeafter` - Menghapus pesan setelah pesan tertentu.
  - `restart` - Merestart bot.
  - `setstatus` - Mengatur status bot.
  - `timeout` - Memberikan timeout kepada pengguna.
  - `toggleembed` - Aktifkan atau nonaktifkan pendeteksi embed.
  - `unban` - Membuka ban dari pengguna tertentu.
  - `unmute` - Menghapus mute dari pengguna tertentu.
  - `untimeout` - Menghapus timeout dari pengguna tertentu.

- **Fitur Otomatis:**
  - Embed otomatis untuk tautan dari platform tertentu seperti Instagram, TikTok, X, Reddit, dan lainnya.
  - Pengiriman otomatis QOTD (Quote of the Day) berdasarkan jadwal.

## Persyaratan Sistem

- **Node.js:** v18 atau lebih baru
- **NPM:** v9 atau lebih baru

## Instalasi

1. **Clone repositori ini:**

   ```
   git clone https://github.com/iseeface/personal-bot-discord.git
   cd personal-bot-discord
2. **Instal dependensi:**
   ```
   npm install
3. **isi file .env:**
   ```
   Isi sesuai dengan instruksi yang ada pada file .env.text, jangan lupa ganti .env.txt menjadi .env
4. **Jalankan bot:**
   ```
   node bot.js
## Perintah Penting
- Registrasi Command ke Discord: Gunakan file registerCommands.js untuk mendaftarkan perintah slash ke server.
  ```bash
  node registerCommands.js

- Hapus Command dari Discord: Gunakan file deleteCommands.js untuk menghapus semua perintah slash.
  ```bash
  node deleteCommands.js

## Dependensi
- discord.js - Library utama untuk interaksi dengan Discord API.
- axios - Untuk pengambilan data dari API.
- dotenv - Untuk pengelolaan variabel lingkungan.
- moment-timezone - Untuk pengaturan waktu otomatis QOTD.
- ms - Untuk mengonversi durasi waktu.
- node-cron - Untuk penjadwalan tugas otomatis.


## Kontribusi
Kontribusi sangat diterima! Silakan buat pull request untuk perubahan besar atau kirimkan issue untuk melaporkan bug.

1. Fork repositori ini.
2. Buat branch baru untuk perubahan Anda.
3. Push perubahan ke branch Anda.
4. Buat pull request ke branch utama repositori ini.

## Lisensi
Repositori ini menggunakan lisensi [MIT](LICENSE).
