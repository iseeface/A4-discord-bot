const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const ms = require('ms');
const { sendLog } = require('../handlers/logHandler'); // Pastikan logHandler sudah diimport

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Melakukan ban kepada pengguna.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pengguna yang akan di-ban.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('waktu')
                .setDescription('Durasi ban (contoh: 7d, 1h).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('alasan')
                .setDescription('Alasan ban.')
                .setRequired(false)),

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
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
            await member.ban({ reason });

            // Kirimkan log ke channel log
            const logDetails = {
                author: {
                    name: user.tag,
                    icon_url: user.displayAvatarURL(),
                },
                title: 'User Banned',
                description: `${user.tag} telah dibanned!`,
                fields: [
                    { name: 'ID User', value: user.id, inline: true },
                    { name: 'Alasan', value: reason, inline: true },
                ],
                userId: user.id,
                timestamp: Date.now(),
            };

            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);

            interaction.reply({ content: `**${user.tag}** telah di-ban. Alasan: ${reason}` });

            // Jika durasi diberikan, jadwalkan pembatalan ban
            if (duration) {
                const banDuration = ms(duration);
                if (banDuration) {
                    setTimeout(async () => {
                        await interaction.guild.members.unban(user.id, 'Ban selesai.');
                        interaction.followUp({ content: `**${user.tag}** telah selesai di-ban.` });
                    }, banDuration);
                }
            }
        } catch (error) {
            console.error('Error saat melakukan ban:', error);
            return interaction.reply({ content: 'Terjadi kesalahan saat mencoba mem-ban pengguna.', ephemeral: true });
        }
    },
};
