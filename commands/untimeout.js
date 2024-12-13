const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Menghapus timeout dari pengguna tertentu.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pilih pengguna yang ingin diuntimeout.')
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

        if (!guildMember) {
            return interaction.reply({
                content: `Pengguna **${user.tag}** tidak ditemukan di server.`,
                ephemeral: true,
            });
        }

        if (!guildMember.isCommunicationDisabled()) {
            return interaction.reply({
                content: `Pengguna **${user.tag}** tidak sedang dalam timeout.`,
                ephemeral: true,
            });
        }

        try {
            // Hapus timeout dari pengguna
            await guildMember.timeout(null);
            await interaction.reply({ content: `Pengguna **${user.tag}** berhasil diuntimeout.` });

            // Kirimkan log
            const logDetails = {
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                title: 'User Untimed Out',
                description: `Pengguna **${user.tag}** telah diuntimeout.`,
                fields: [
                    { name: 'User', value: user.tag, inline: true },
                    { name: 'Admin yang Melakukan', value: `<@${interaction.user.id}>`, inline: true },
                ],
                userId: interaction.user.id,
                timestamp: Date.now(),
            };
            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);
        } catch (error) {
            console.error('Error saat untimeout:', error);
            await interaction.reply({
                content: `Terjadi kesalahan saat mencoba melakukan untimeout pada pengguna **${user.tag}**.`,
                ephemeral: true,
            });
        }
    },
};
