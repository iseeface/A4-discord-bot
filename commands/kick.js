const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Mengeluarkan pengguna dari server.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pengguna yang akan dikeluarkan.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('alasan')
                .setDescription('Alasan kick.')
                .setRequired(false))
        .setDefaultPermission(true), // Tampilkan command untuk semua pengguna

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('alasan') || 'Tidak ada alasan yang diberikan.';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'Pengguna tidak ditemukan di server ini.', ephemeral: true });
        }

        try {
            await member.kick(reason);
            const logDetails = {
                author: {
                    name: user.tag,
                    icon_url: user.displayAvatarURL(),
                },
                title: 'User Kicked',
                description: `${user.tag} telah dikeluarkan!`,
                fields: [
                    { name: 'ID User', value: user.id, inline: true },
                    { name: 'Alasan', value: reason, inline: true },
                ],
                userId: user.id,
                timestamp: Date.now(),
            };
            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);

            interaction.reply({ content: `**${user.tag}** berhasil dikeluarkan. Alasan: ${reason}` });
        } catch (error) {
            console.error('Error saat melakukan kick:', error);
            return interaction.reply({ content: 'Terjadi kesalahan saat mencoba mengeluarkan pengguna.', ephemeral: true });
        }
    },
};
