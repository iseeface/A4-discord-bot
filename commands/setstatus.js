const { SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Mengatur pengaturan bot.')
        .addSubcommand(subcommand =>
            subcommand.setName('status')
                .setDescription('Mengatur status bot sementara atau permanen.')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Jenis status bot.')
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
                        .setDescription('Jenis aktivitas bot.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Playing', value: 'PLAYING' },
                            { name: 'Listening', value: 'LISTENING' },
                            { name: 'Watching', value: 'WATCHING' },
                            { name: 'Streaming', value: 'STREAMING' }
                        )
                )
                .addStringOption(option =>
                    option.setName('duration')
                        .setDescription('Berapa lama status ini akan bertahan?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Hari ini', value: 'today' },
                            { name: '4 jam', value: '4h' },
                            { name: '1 jam', value: '1h' },
                            { name: '30 menit', value: '30m' },
                            { name: 'Selamanya (Don\'t Clear)', value: 'dont_clear' }
                        )
                )
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Teks status yang ingin ditampilkan')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
            }

            try {
                const type = interaction.options.getString('type');
                const activity = interaction.options.getString('activity');
                const duration = interaction.options.getString('duration');
                const message = interaction.options.getString('message');
                
                const activityTypeMap = {
                    'PLAYING': ActivityType.Playing,
                    'LISTENING': ActivityType.Listening,
                    'WATCHING': ActivityType.Watching,
                    'STREAMING': ActivityType.Streaming,
                };

                await interaction.client.user.setPresence({
                    status: type,
                    activities: [{ name: message, type: activityTypeMap[activity] }],
                });

                let timeoutDuration = null;
                if (duration === 'today') timeoutDuration = getTimeUntilMidnight();
                if (duration === '4h') timeoutDuration = 4 * 60 * 60 * 1000;
                if (duration === '1h') timeoutDuration = 1 * 60 * 60 * 1000;
                if (duration === '30m') timeoutDuration = 30 * 60 * 1000;

                if (timeoutDuration) {
                    setTimeout(async () => {
                        await interaction.client.user.setPresence({
                            status: 'online',
                            activities: [{ name: 'Normal Mode', type: ActivityType.Playing }]
                        });
                    }, timeoutDuration);
                }

                await interaction.reply({
                    content: `Status bot berhasil diatur ke **${type}** dengan aktivitas **${activity.toLowerCase()}** selama **${getReadableDuration(duration)}** dengan pesan **"${message}"**`,
                    ephemeral: true,
                });

                await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
                    author: {
                        name: interaction.user.tag,
                        icon_url: interaction.user.displayAvatarURL(),
                    },
                    title: 'Status Bot Diubah',
                    description: `Status bot telah diubah ke **${type}** dengan aktivitas **${activity.toLowerCase()}** selama **${getReadableDuration(duration)}** dengan pesan **"${message}"**`,
                    fields: [
                        { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Status Baru', value: type, inline: true },
                        { name: 'Aktivitas', value: activity.toLowerCase(), inline: true },
                        { name: 'Durasi', value: getReadableDuration(duration), inline: true },
                        { name: 'Pesan', value: message, inline: false },
                    ],
                    userId: interaction.user.id,
                    timestamp: Date.now(),
                });
            } catch (error) {
                await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
                    title: 'Error Saat Mengatur Status Bot',
                    description: `Terjadi kesalahan saat mengatur status bot: ${error.message}`,
                    color: 0xff0000,
                    timestamp: Date.now(),
                });
                await interaction.reply({ content: 'Terjadi kesalahan saat mengatur status bot. Silakan coba lagi.', ephemeral: true });
            }
        }
    },
};

function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    return midnight - now;
}

function getReadableDuration(duration) {
    const durationMap = {
        'today': 'hingga akhir hari ini',
        '4h': '4 jam',
        '1h': '1 jam',
        '30m': '30 menit',
        'dont_clear': 'selamanya',
    };
    return durationMap[duration] || 'waktu yang tidak diketahui';
}
