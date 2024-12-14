const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const ms = require('ms'); // Untuk parsing durasi seperti "10m", "1h", dsb.
const { sendLog } = require('../handlers/logHandler'); // Pastikan logHandler sudah diimport

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Memberikan mute kepada pengguna.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pengguna yang akan di-mute.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('waktu')
                .setDescription('Durasi mute (contoh: 10m, 1h).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('alasan')
                .setDescription('Alasan mute.')
                .setRequired(false)),

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('waktu');
        const reason = interaction.options.getString('alasan') || 'Tidak ada alasan yang diberikan.';
        const mutedRole = interaction.guild.roles.cache.get(process.env.MUTED_ROLE_ID);

        // Periksa apakah role mute ada
        if (!mutedRole) {
            return interaction.reply({ content: 'Role muted tidak ditemukan.', ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: 'Pengguna tidak ditemukan di server ini.', ephemeral: true });
        }

        try {
            // Tambahkan role muted ke pengguna
            await member.roles.add(mutedRole, reason);
            await interaction.reply({ content: `**${user.tag}** telah di-mute. Alasan: ${reason}` });

            // Kirimkan log ke channel log
            const logDetails = {
                author: {
                    name: user.tag,
                    icon_url: user.displayAvatarURL(),
                },
                title: 'User Muted',
                description: `${user.tag} telah di-mute!`,
                fields: [
                    { name: 'ID User', value: user.id, inline: true },
                    { name: 'Alasan', value: reason, inline: true },
                ],
                userId: user.id,
                timestamp: Date.now(),
            };

            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, logDetails);

            // Jika durasi diberikan, jadwalkan penghapusan role muted
            if (duration) {
                const muteDuration = ms(duration);
                if (muteDuration) {
                    setTimeout(async () => {
                        if (member.roles.cache.has(mutedRole.id)) {
                            await member.roles.remove(mutedRole, 'Mute selesai.');
                            await interaction.followUp({ content: `**${user.tag}** telah selesai di-mute.` });

                            // Kirimkan log untuk unmute
                            const unmuteLogDetails = {
                                author: {
                                    name: user.tag,
                                    icon_url: user.displayAvatarURL(),
                                },
                                title: 'User Unmuted',
                                description: `${user.tag} telah selesai di-mute.`,
                                fields: [
                                    { name: 'ID User', value: user.id, inline: true },
                                    { name: 'Alasan', value: 'Mute selesai', inline: true },
                                ],
                                userId: user.id,
                                timestamp: Date.now(),
                            };

                            sendLog(interaction.client, process.env.LOG_CHANNEL_ID, unmuteLogDetails);
                        }
                    }, muteDuration);
                }
            }
        } catch (error) {
            console.error('Error saat melakukan mute:', error);
            return interaction.reply({ content: 'Terjadi kesalahan saat mencoba mem-mute pengguna.', ephemeral: true });
        }
    },
};
