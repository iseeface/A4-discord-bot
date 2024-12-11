const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Menghapus mute dari pengguna tertentu.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pilih pengguna yang ingin di-unmute.')
                .setRequired(true)
        )
        .setDefaultPermission(true), // Tampilkan command untuk semua pengguna

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const guildMember = interaction.guild.members.cache.get(user.id);
        const mutedRoleId = process.env.MUTED_ROLE_ID;

        if (!guildMember) {
            return interaction.reply({
                content: `Pengguna **${user.tag}** tidak ditemukan di server.`,
                ephemeral: true,
            });
        }

        if (!guildMember.roles.cache.has(mutedRoleId)) {
            return interaction.reply({
                content: `Pengguna **${user.tag}** tidak sedang di-mute.`,
                ephemeral: true,
            });
        }

        try {
            // Hapus role mute
            await guildMember.roles.remove(mutedRoleId);
            await interaction.reply({ content: `Pengguna **${user.tag}** berhasil di-unmute.` });

            // Kirimkan log
            const logDetails = {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'User Unmuted',
                description: `Pengguna **${user.tag}** telah di-unmute.`,
                fields: [
                    { name: 'User', value: user.tag, inline: true },
                    { name: 'Admin yang Melakukan', value: interaction.user.tag, inline: true },
                ],
                userId: interaction.user.id,
                timestamp: Date.now(),
            };
            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);
        } catch (error) {
            console.error('Error saat unmute:', error);
            await interaction.reply({
                content: `Terjadi kesalahan saat mencoba melakukan unmute pada pengguna **${user.tag}**.`,
                ephemeral: true,
            });
        }
    },
};
