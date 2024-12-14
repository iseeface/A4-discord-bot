const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const ms = require('ms');
const { sendLog } = require('../handlers/logHandler'); // Pastikan logHandler sudah diimport

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Memberikan timeout kepada pengguna.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pengguna yang akan di-timeout.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('waktu')
                .setDescription('Durasi timeout (contoh: 10m, 1h).')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('alasan')
                .setDescription('Alasan timeout.')
                .setRequired(false)),

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('waktu');
        const reason = interaction.options.getString('alasan') || 'Tidak ada alasan yang diberikan.';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'Pengguna tidak ditemukan di server ini.', ephemeral: true });
        }

        try {
            const timeoutDuration = ms(duration);
            await member.timeout(timeoutDuration, reason);

            // Kirimkan log ke channel log
            const logDetails = {
                author: {
                    name: user.tag,
                    icon_url: user.displayAvatarURL(),
                },
                title: 'User Timed Out',
                description: `${user.tag} telah diberikan timeout.`,
                fields: [
                    { name: 'ID User', value: user.id, inline: true },
                    { name: 'Durasi Timeout', value: duration, inline: true },
                    { name: 'Alasan', value: reason, inline: true },
                ],
                userId: user.id,
                timestamp: Date.now(),
            };

            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);

            interaction.reply({ content: `**${user.tag}** telah diberikan timeout selama ${duration}. Alasan: ${reason}` });
        } catch (error) {
            console.error('Error saat memberikan timeout:', error);
            return interaction.reply({ content: 'Terjadi kesalahan saat mencoba memberikan timeout.', ephemeral: true });
        }
    },
};
