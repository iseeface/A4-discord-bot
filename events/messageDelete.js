const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    name: 'messageDelete',
    once: false,
    async execute(client, deletedMessage) {
        if (!deletedMessage || !deletedMessage.author) return; // Jika pesan tidak valid atau tidak ada

        const logChannelId = process.env.LOG_CHANNEL_ID; // Ambil ID channel log

        // Membuat embed untuk pesan yang dihapus
        const logDetails = {
            color: 0xFF0000,  // Warna embed
            title: `Pesan yang dikirim oleh ${deletedMessage.author.tag} dihapus pada ${deletedMessage.channel.url}`,
            description: `${deletedMessage.content || 'Pesan kosong'}`,
            author: { name: deletedMessage.author.tag, icon_url: deletedMessage.author.displayAvatarURL() },
            fields: [],
            footer: { text: `ID User: ${deletedMessage.author.id} | ID Pesan: ${deletedMessage.id}` },
            timestamp: Date.now(),
            userId: deletedMessage.author.id, // Tambahkan ID Pengguna
            messageId: deletedMessage.id,     // Tambahkan ID Pesan yang dihapus
        };

        // Mengirim log ke channel log
        await sendLog(client, logChannelId, logDetails);
    },
};
