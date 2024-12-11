const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstatus')
        .setDescription('Mengatur status bot.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Jenis status (online, idle, dnd, invisible).')
                .setRequired(true)
                .addChoices(
                    { name: 'Online', value: 'online' },
                    { name: 'Idle', value: 'idle' },
                    { name: 'Do Not Disturb', value: 'dnd' },
                    { name: 'Invisible', value: 'invisible' }
                )
        )
        .addStringOption(option =>
            option.setName('activity')
                .setDescription('Aktivitas yang ingin ditampilkan (opsional).')
        )
        .setDefaultPermission(true), // Tampilkan command untuk semua pengguna

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        try {
            const type = interaction.options.getString('type');
            const activity = interaction.options.getString('activity');

            const presenceOptions = { status: type };

            if (activity) {
                presenceOptions.activities = [{ name: activity }];
            }

            await interaction.client.user.setPresence(presenceOptions);

            await interaction.reply({
                content: `Status bot berhasil diatur ke **${type}**${activity ? ` dengan aktivitas **${activity}**` : ''}.`,
                ephemeral: true,
            });

            console.log(`[INFO] Status bot diubah ke: ${type} ${activity ? `dengan aktivitas: ${activity}` : ''}`);

            // Kirimkan log perubahan status ke channel log
            const logDetails = {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'Status Bot Diubah',
                description: `Status bot telah diubah ke **${type}**${activity ? ` dengan aktivitas: ${activity}` : ''}.`,
                fields: [
                    { name: 'Admin yang Melakukan', value: interaction.user.tag, inline: true },
                    { name: 'Status Baru', value: type, inline: true },
                    { name: 'Aktivitas', value: activity || 'Tidak ada', inline: true },
                ],
                userId: interaction.user.id,
                timestamp: Date.now(),
            };

            // Kirim log ke channel log
            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);
        } catch (error) {
            console.error('[ERROR] Gagal mengatur status bot:', error);

            await interaction.reply({
                content: 'Terjadi kesalahan saat mengatur status bot. Silakan coba lagi.',
                ephemeral: true,
            });
        }
    },
};
