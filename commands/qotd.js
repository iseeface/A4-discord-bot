const { SlashCommandBuilder } = require('discord.js');
const { getQOTDForUser } = require('../handlers/quoteHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qotd')
        .setDescription('Minta Quote of the Day (QOTD) dari bot!'),
    async execute(interaction) {
        try {
            const qotdMessage = await getQOTDForUser(); // Memanggil fungsi untuk mendapatkan QOTD
            await interaction.reply(qotdMessage); // Mengirimkan QOTD ke pengguna
        } catch (error) {
            console.error('Error saat mengirim QOTD:', error);
            await interaction.reply({
                content: 'Terjadi kesalahan saat mengambil Quote of the Day.',
                ephemeral: true,
            });
        }
    },
};
