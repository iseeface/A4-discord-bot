const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

// Status pendeteksi embed (default: aktif)
let embedDetectionStatus = true;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleembed')
        .setDescription('Aktifkan atau nonaktifkan pendeteksi embed.')
        .setDefaultPermission(true), // Perintah dapat dilihat oleh semua pengguna

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        try {
            // Toggle status embed
            embedDetectionStatus = !embedDetectionStatus;

            // Kirimkan respon ke pengguna
            await interaction.reply({
                content: `Pendeteksi embed telah ${embedDetectionStatus ? '**diaktifkan**' : '**dinonaktifkan**'}.`,
                ephemeral: true, // Hanya pengirim command yang dapat melihat respon ini
            });

            console.log(`[INFO] Pendeteksi embed telah ${embedDetectionStatus ? 'diaktifkan' : 'dinonaktifkan'} oleh ${interaction.user.tag}`);

            // Kirimkan log perubahan status toggleembed ke channel log
            const logDetails = {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'Status Pendeteksi Embed Diubah',
                description: `Pendeteksi embed telah ${embedDetectionStatus ? '**diaktifkan**' : '**dinonaktifkan**'} oleh ${interaction.user.tag}.`,
                fields: [
                    { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Status', value: embedDetectionStatus ? 'Diaktifkan' : 'Dinonaktifkan', inline: true },
                ],
                userId: interaction.user.id,
                timestamp: Date.now(),
            };

            // Kirim log ke channel log
            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);
        } catch (error) {
            console.error('[ERROR] Terjadi kesalahan saat toggle embed:', error);

            // Beri respon error kepada pengguna
            await interaction.reply({
                content: 'Terjadi kesalahan saat mencoba mengubah status pendeteksi embed.',
                ephemeral: true,
            });
        }
    },
};

// Getter untuk mengambil status pendeteksi embed
module.exports.getEmbedDetectionStatus = () => embedDetectionStatus;
