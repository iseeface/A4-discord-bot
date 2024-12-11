const { handleEmbed } = require('../handlers/embedHandler'); // pastikan handler embed ada

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        // Jangan proses pesan yang dikirim oleh bot
        if (message.author.bot) return;

        // Misalnya, menangani pesan yang mengandung tautan
        await handleEmbed(message, client); // Memanggil handler embed untuk memproses pesan yang mengandung tautan
    },
};
