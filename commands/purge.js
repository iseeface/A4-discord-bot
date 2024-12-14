const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Menghapus sejumlah pesan dalam channel ini.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Jumlah pesan yang akan dihapus (maksimum 100).')
                .setRequired(true)),
    async execute(interaction) {
        const count = interaction.options.getInteger('count');

        if (count > 100) {
            return interaction.reply({ content: 'Anda hanya dapat menghapus hingga 100 pesan.', ephemeral: true });
        }

        const messages = await interaction.channel.messages.fetch({ limit: count });
        const filteredMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) <= 86400000);

        if (filteredMessages.size === 0) {
            return interaction.reply({ content: 'Tidak ada pesan yang dapat dihapus (lebih dari 1 hari).', ephemeral: true });
        }

        await interaction.channel.bulkDelete(filteredMessages, true);
        await interaction.reply({ content: `Berhasil menghapus ${filteredMessages.size} pesan.`, ephemeral: true });

        // Kirim log
        await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
            author: {
                name: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            },
            title: `Pesan dihapus di https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`,
            description: `${filteredMessages.size} pesan dihapus.`,
            fields: [
                { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Jumlah Pesan', value: `${filteredMessages.size}`, inline: true },
            ],
            color: 0x00FF00,
            userId: interaction.user.id,
        });
    },
};
