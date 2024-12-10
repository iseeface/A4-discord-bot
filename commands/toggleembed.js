const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config(); // Memuat konfigurasi dari file .env

let embedDetectionStatus = true; // Default status aktif

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleembed')
        .setDescription('Aktifkan atau nonaktifkan pendeteksi embed (khusus untuk admin).'),

    async execute(interaction) {
        // Cek apakah pengguna memiliki role dengan permission ADMINISTRATOR
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'Anda tidak memiliki izin untuk mengubah status pendeteksi embed.',
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
