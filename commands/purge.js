const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Menghapus pesan dalam channel ini.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName('amount')
                .setDescription('Menghapus sejumlah pesan terbaru.')
                .addIntegerOption(option =>
                    option.setName('count')
                        .setDescription('Jumlah pesan yang akan dihapus (maksimum 100).')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('after')
                .setDescription('Menghapus pesan setelah pesan tertentu.')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID pesan sebagai acuan.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('count')
                        .setDescription('Jumlah pesan yang akan dihapus (maksimum 100).'))),

    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const subcommand = interaction.options.getSubcommand();
        const count = interaction.options.getInteger('count') || 100;

        if (count > 100) {
            return interaction.reply({ content: 'Anda hanya dapat menghapus hingga 100 pesan.', ephemeral: true });
        }

        if (subcommand === 'amount') {
            const messages = await interaction.channel.messages.fetch({ limit: count });
            const filteredMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) <= 86400000);

            if (filteredMessages.size === 0) {
                return interaction.reply({ content: 'Tidak ada pesan yang dapat dihapus (lebih dari 1 hari).', ephemeral: true });
            }

            await interaction.channel.bulkDelete(filteredMessages, true);
            await interaction.reply({ content: `Berhasil menghapus ${filteredMessages.size} pesan.`, ephemeral: true });

            await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
                title: `Pesan dihapus di https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`,
                description: `${filteredMessages.size} pesan dihapus.`,
                fields: [
                    { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Jumlah Pesan', value: `${filteredMessages.size}`, inline: true },
                ],
                color: 0x00FF00,
                userId: interaction.user.id,
            });
        } else if (subcommand === 'after') {
            const messageId = interaction.options.getString('message_id');
            const referenceMessage = await interaction.channel.messages.fetch(messageId).catch(() => null);
            if (!referenceMessage) {
                return interaction.reply({ content: 'ID pesan tidak valid atau tidak ditemukan.', ephemeral: true });
            }

            const messages = await interaction.channel.messages.fetch({ after: messageId, limit: count });
            const filteredMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) <= 86400000);

            if (filteredMessages.size === 0) {
                return interaction.reply({ content: 'Tidak ada pesan yang dapat dihapus (lebih dari 1 hari).', ephemeral: true });
            }

            await interaction.channel.bulkDelete(filteredMessages, true);
            await interaction.reply({ content: `Berhasil menghapus ${filteredMessages.size} pesan setelah ID ${messageId}.`, ephemeral: true });

            await sendLog(interaction.client, process.env.LOG_CHANNEL_ID, {
                title: `Pesan dihapus di https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`,
                description: `${filteredMessages.size} pesan dihapus setelah ID ${messageId}.`,
                fields: [
                    { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Jumlah Pesan', value: `${filteredMessages.size}`, inline: true },
                ],
                color: 0xFF4500,
                userId: interaction.user.id,
                messageId: messageId,
            });
        }
    },
};
