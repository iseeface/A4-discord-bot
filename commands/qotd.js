const { SlashCommandBuilder } = require('discord.js');
const { getQOTDForUser } = require('../handlers/quoteHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qotd')
        .setDescription('Minta Quote of the Day (QOTD) dari bot!'),
    async execute(interaction) {
        try {
            const qotdEmbed = await getQOTDForUser(); // Memanggil fungsi untuk mendapatkan QOTD dalam bentuk embed
            await interaction.reply(qotdEmbed); // Mengirimkan QOTD yang sudah berbentuk embed ke pengguna
        } catch (error) {
            console.error('Error saat mengirim QOTD:', error);
            await interaction.reply({
                content: 'Terjadi kesalahan saat mengambil Quote of the Day.',
                ephemeral: true,
            });
        }
    },
};
