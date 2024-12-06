const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config(); // Memuat konfigurasi dari file .env

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstatus')
        .setDescription('Mengatur status bot (khusus untuk admin).')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Jenis status (online, idle, dnd, invisible).')
                .setRequired(true)
                .addChoices(
                    { name: 'Online', value: 'online' },
                    { name: 'Idle', value: 'idle' },
                    { name: 'Do Not Disturb', value: 'dnd' },
                    { name: 'Invisible', value: 'invisible' }
                ))
        .addStringOption(option =>
            option.setName('activity')
                .setDescription('Aktivitas yang ingin ditampilkan. (Opsional)')),

    async execute(interaction) {
        const allowedUserId = process.env.ADMIN_USER_ID; // Mengambil USER_ID dari .env

        // Cek apakah ID pengguna yang mengirimkan perintah sesuai dengan yang ada di .env
        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({
                content: 'Anda tidak memiliki izin untuk mengatur status bot!',
                ephemeral: true,
            });
        }

        try {
            const type = interaction.options.getString('type');
            const activity = interaction.options.getString('activity') || null;

            // Set status
            const client = interaction.client;

            if (activity) {
                client.user.setPresence({
                    activities: [{ name: activity }],
                    status: type,
                });
            } else {
                client.user.setPresence({ status: type });
            }

            await interaction.reply({
                content: `Status bot berhasil diatur ke: **${type}**${activity ? ` dengan aktivitas: **${activity}**` : ''}`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error saat mengatur status bot:', error);
            await interaction.reply({
                content: 'Terjadi kesalahan saat mengatur status bot.',
                ephemeral: true,
            });
        }
    },
};
