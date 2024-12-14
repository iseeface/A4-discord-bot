const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('../handlers/logHandler');

module.exports = {
    name: 'messageUpdate',
    once: false,
    async execute(client, oldMessage, newMessage) {
        if (oldMessage.content === newMessage.content) return; // Jika konten pesan tidak berubah

        const logChannelId = process.env.LOG_CHANNEL_ID; // Ambil ID channel log

        // Membuat embed untuk pesan yang diedit
        const logDetails = {
            color: 0xFFCC00,  // Warna embed
            title: `Pesan diedit pada https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${newMessage.id}`,
            description: `**Sebelum**:\n${oldMessage.content}\n\n**Sesudah**:\n${newMessage.content}`,
            author: { name: oldMessage.author.tag, icon_url: oldMessage.author.displayAvatarURL() },
            fields: [],
            footer: { text: `ID User: ${oldMessage.author.id} | ID Pesan: ${newMessage.id}` },
            timestamp: Date.now(),
            userId: oldMessage.author.id, // Tambahkan ID Pengguna
            messageId: newMessage.id,     // Tambahkan ID Pesan yang diedit
        };

        // Mengirim log ke channel log
        await sendLog(client, logChannelId, logDetails);
    },
};
