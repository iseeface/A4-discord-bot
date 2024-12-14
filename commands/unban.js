const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Membuka ban dari pengguna tertentu.')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('ID pengguna yang ingin di-unban.')
                .setRequired(true)
        )
        .setDefaultPermission(true), // Tampilkan command untuk semua pengguna

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        const userId = interaction.options.getString('user_id');

        try {
            const banList = await interaction.guild.bans.fetch();
            const isBanned = banList.has(userId);

            if (!isBanned) {
                return interaction.reply({
                    content: `Pengguna dengan ID **${userId}** tidak ditemukan dalam daftar ban.`,
                    ephemeral: true,
                });
            }

            await interaction.guild.members.unban(userId);
            await interaction.reply({ content: `Pengguna dengan ID **${userId}** berhasil di-unban.` });

            const logDetails = {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'User Unbanned',
                description: `Pengguna dengan ID **${userId}** telah di-unban.`,
                fields: [
                    { name: 'ID User', value: userId, inline: true },
                    { name: 'Admin yang Melakukan', value: `<@${interaction.user.id}>`, inline: true },
                ],
                userId: interaction.user.id,
                timestamp: Date.now(),
            };
            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);
        } catch (error) {
            console.error('Error saat membuka ban:', error);
            await interaction.reply({
                content: `Terjadi kesalahan saat mencoba membuka ban. Pastikan ID pengguna valid dan pengguna benar-benar di-ban.`,
                ephemeral: true,
            });
        }
    },
};
