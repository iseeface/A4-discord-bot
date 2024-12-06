const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config(); // Memuat konfigurasi dari file .env

let embedDetectionStatus = true; // Default status aktif

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleembed')
        .setDescription('Aktifkan atau nonaktifkan pendeteksi embed (khusus untuk admin).')
        .setDefaultMemberPermissions(0), // Hanya admin yang bisa akses

    async execute(interaction) {
        const allowedUserId = process.env.ADMIN_USER_ID; // ID admin dari .env

        // Cek apakah ID pengguna yang mengirimkan perintah sesuai dengan yang ada di .env
        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({
                content: 'Anda tidak memiliki izin untuk mengubah status pendeteksi embed!',
                ephemeral: true,
            });
        }

        // Toggle status
        embedDetectionStatus = !embedDetectionStatus;
        
        await interaction.reply({
            content: `Pendeteksi embed telah ${embedDetectionStatus ? 'diaktifkan' : 'dinonaktifkan'}.`,
            ephemeral: true,
        });
    },
};

// Ekspor status pendeteksi untuk digunakan di embedHandler.js
module.exports.getEmbedDetectionStatus = () => embedDetectionStatus;
