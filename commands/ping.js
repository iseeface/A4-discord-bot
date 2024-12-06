const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Menampilkan latensi bot dan API Discord.'),
    async execute(interaction) {
        try {
            // Kirim respons sementara untuk menghitung waktu ping
            const sent = await interaction.reply({ content: 'Mengukur latensi...', fetchReply: true });

            // Hitung latensi
            const timeTaken = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = interaction.client.ws.ping;

            // Edit pesan dengan hasil latensi
            await interaction.editReply(`Pong! 🏓\nLatensi Bot: \`${timeTaken}ms\`\nLatensi API: \`${apiLatency}ms\``);
        } catch (error) {
            console.error('Error saat menjalankan perintah ping:', error);

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: 'Terjadi kesalahan saat menjalankan perintah!' });
            } else {
                await interaction.reply({ content: 'Terjadi kesalahan saat menjalankan perintah!', ephemeral: true });
            }
        }
    },
};
