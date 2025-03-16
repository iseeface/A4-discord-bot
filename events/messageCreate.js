const { handleEmbed } = require('../handlers/embedHandler'); // pastikan handler embed ada
const { handleAiChat } = require('../handlers/aiHandler'); // pastikan handler AI ada

module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        // Jangan proses pesan yang dikirim oleh bot
        if (message.author.bot) return;

        // Memproses pesan untuk embed (tautan)
        await handleEmbed(message, client);

        // Memproses pesan untuk fitur AI (hanya di channel tertentu jika AI aktif)
        await handleAiChat(message);
    },
};
