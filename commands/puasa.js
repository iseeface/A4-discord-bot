const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('puasa')
        .setDescription('Mengaktifkan atau menonaktifkan fitur puasa')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Status fitur puasa')
                .setRequired(true)
                .addChoices(
                    { name: 'On', value: 'on' },
                    { name: 'Off', value: 'off' },
                ),
        ),

    async execute(interaction) {
        const { client, user, options, guild } = interaction;
        const status = options.getString('status');

        // Pastikan perintah hanya digunakan dalam guild (server)
        if (!guild) {
            return interaction.reply({ content: 'Perintah ini hanya dapat digunakan di dalam server.', ephemeral: true });
        }

        const member = guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: 'Anda tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        // Ambil role yang diizinkan dari .env
        const allowedRoles = process.env.TEMPORARY_ROLE ? process.env.TEMPORARY_ROLE.split(",") : [];
        const hasTemporaryRole = member.roles.cache.some(role => allowedRoles.includes(role.id));

        // Periksa apakah user memiliki izin
        if (!member.permissions.has(PermissionFlagsBits.Administrator) && !hasTemporaryRole) {
            return interaction.reply({
                content: 'Anda tidak memiliki izin untuk menggunakan perintah ini.',
                ephemeral: true,
            });
        }

        // ID channel dan role yang akan diubah izin aksesnya
        const channelId1 = '930030583751532574';
        const channelId2 = '669404081009197077';
        const roleId1 = '932306141898215455';
        const roleId2 = '456930895287549984';

        const channel1 = client.channels.cache.get(channelId1);
        const channel2 = client.channels.cache.get(channelId2);

        if (!channel1 || !channel2) {
            return interaction.reply({ content: 'Salah satu channel tidak ditemukan.', ephemeral: false });
        }

        try {
            if (status === 'on') {
                await channel1.permissionOverwrites.edit(roleId1, { ViewChannel: false });
                await channel2.permissionOverwrites.edit(roleId2, { ViewChannel: false });
            } else if (status === 'off') {
                await channel1.permissionOverwrites.edit(roleId1, { ViewChannel: true });
                await channel2.permissionOverwrites.edit(roleId2, { ViewChannel: null });
            }

            // Kirim log penggunaan command
            const newStatus = status === 'on';
            await sendLog(client, process.env.LOG_CHANNEL_ID, {
                author: {
                    name: user.tag,
                    icon_url: user.displayAvatarURL(),
                },
                title: 'Status Lock/Unlock Channel Pada Puasa Diubah',
                description: `Fitur Puasa telah ${newStatus ? '**diaktifkan**' : '**dinonaktifkan**'} oleh ${user.tag}.`,
                fields: [
                    { name: 'Admin/Role', value: `<@${user.id}>`, inline: true },
                    { name: 'Status', value: newStatus ? 'Aktif' : 'Nonaktif', inline: true },
                ],
                userId: user.id,
            });

            // Balas pesan sukses
            await interaction.reply({ content: `Channel telah ${newStatus ? 'terkunci' : 'terbuka'}.`, ephemeral: false });

        } catch (error) {
            console.error('Error saat mengubah izin channel:', error);
            await interaction.reply({ content: 'Terjadi kesalahan saat mengubah izin channel.', ephemeral: false });
        }
    },
};
