# Discord Bot

Bot Discord multifungsi yang dirancang untuk memberikan fitur seperti menampilkan embed tautan otomatis, mengatur status bot, mengirim Quote of the Day (QOTD), dan berbagai perintah lainnya.  

## Fitur

- **Perintah Umum:**
  - `help` - Menampilkan daftar perintah yang tersedia.
  - `info` - Menampilkan informasi tentang bot.
  - `ping` - Mengecek respons bot.
  - `say` - Membuat bot mengirimkan pesan yang ditentukan.
  - `setstatus` - Mengubah status bot.
  - `toggleembed` - Mengaktifkan/mematikan fitur embed tautan.
  - `qotd` - Mengirimkan Quote of the Day secara manual.

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
   cd repo-name
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
- node-cron - Untuk penjadwalan tugas otomatis.

## Kontribusi
Kontribusi sangat diterima! Silakan buat pull request untuk perubahan besar atau kirimkan issue untuk melaporkan bug.

1. Fork repositori ini.
2. Buat branch baru untuk perubahan Anda.
3. Push perubahan ke branch Anda.
4. Buat pull request ke branch utama repositori ini.

## Lisensi
Repositori ini menggunakan lisensi [MIT](LICENSE).
