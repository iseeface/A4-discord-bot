const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { toggleAiStatus, getAiStatus } = require('../handlers/aiHandler');
const { getEmbedDetectionStatus, setEmbedDetectionStatus } = require('../handlers/embedHandler'); // Impor fungsi baru
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle')
        .setDescription('Aktifkan atau nonaktifkan fitur tertentu.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ai')
                .setDescription('Aktifkan atau nonaktifkan fitur AI.')
                .addStringOption(option =>
                    option
                        .setName('status')
                        .setDescription('Pilih apakah fitur AI akan diaktifkan atau dinonaktifkan.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'On', value: 'on' },
                            { name: 'Off', value: 'off' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('embed')
                .setDescription('Aktifkan atau nonaktifkan pendeteksi embed.')
                .addStringOption(option =>
                    option
                        .setName('status')
                        .setDescription('Pilih apakah pendeteksi embed akan diaktifkan atau dinonaktifkan.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'On', value: 'on' },
                            { name: 'Off', value: 'off' },
                        )
                )
        ),

    async execute(interaction) {
        // Periksa izin admin
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const status = interaction.options.getString('status');

        if (subcommand === 'ai') {
            const currentStatus = getAiStatus();

            if ((status === 'on' && currentStatus) || (status === 'off' && !currentStatus)) {
                return interaction.reply({ content: `Fitur AI sudah dalam keadaan ${currentStatus ? 'aktif' : 'nonaktif'}.`, ephemeral: true });
            }

            toggleAiStatus(status === 'on');
            const newStatus = getAiStatus();

            await interaction.reply({
                content: `Fitur AI telah ${newStatus ? '**diaktifkan**' : '**dinonaktifkan**'}.`,
                ephemeral: true,
            });

            // Kirim log perubahan status
            await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'Status Fitur AI Diubah',
                description: `Fitur AI telah ${newStatus ? '**diaktifkan**' : '**dinonaktifkan**'} oleh ${interaction.user.tag}.`,
                fields: [
                    { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Status', value: newStatus ? 'Aktif' : 'Nonaktif', inline: true },
                ],
                userId: interaction.user.id,
            });
        } else if (subcommand === 'embed') {
            const currentStatus = getEmbedDetectionStatus();

            if ((status === 'on' && currentStatus) || (status === 'off' && !currentStatus)) {
                return interaction.reply({ content: `Pendeteksi embed sudah dalam keadaan ${currentStatus ? 'aktif' : 'nonaktif'}.`, ephemeral: true });
            }

            const newStatus = status === 'on';
            setEmbedDetectionStatus(newStatus); // Perbarui status embed detection

            await interaction.reply({
                content: `Pendeteksi embed telah ${newStatus ? '**diaktifkan**' : '**dinonaktifkan**'}.`,
                ephemeral: true,
            });

            // Kirim log perubahan status
            await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'Status Pendeteksi Embed Diubah',
                description: `Pendeteksi embed telah ${newStatus ? '**diaktifkan**' : '**dinonaktifkan**'} oleh ${interaction.user.tag}.`,
                fields: [
                    { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Status', value: newStatus ? 'Aktif' : 'Nonaktif', inline: true },
                ],
                userId: interaction.user.id,
            });
        }
    },
};
