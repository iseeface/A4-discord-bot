const { EmbedBuilder } = require('discord.js');

module.exports = {
    sendLog: async (client, channelId, logDetails) => {
        try {
            // Validasi parameter logDetails
            if (!logDetails || typeof logDetails !== 'object') {
                console.error('logDetails tidak valid atau kosong!');
                return;
            }

            const logChannel = client.channels.cache.get(channelId);
            if (!logChannel) {
                console.error(`Channel log dengan ID ${channelId} tidak ditemukan!`);
                return;
            }

            // Menyiapkan footer
            let footerText = '';
            if (logDetails.userId && logDetails.messageId) {
                footerText = `ID User: ${logDetails.userId} | ID Pesan: ${logDetails.messageId}`;
            } else if (logDetails.userId) {
                footerText = `ID User: ${logDetails.userId}`;
            } else if (logDetails.messageId) {
                footerText = `ID Pesan: ${logDetails.messageId}`;
            }

            // Fallback nilai default untuk logDetails
            const embed = new EmbedBuilder()
                .setColor(logDetails.color || 0x00FFED)
                .setAuthor({
                    name: logDetails.author?.name || 'Bot System',
                    iconURL: logDetails.author?.icon_url || client.user.displayAvatarURL(),
                })
                .setTitle(logDetails.title || 'Log Notification')
                .setDescription(logDetails.description || 'Tidak ada deskripsi yang diberikan.')
                .addFields(logDetails.fields || [])
                .setFooter({ text: footerText || 'Tidak Diketahui' })
                .setTimestamp(logDetails.timestamp || Date.now());
                
                const channel = client.channels.cache.get(channelId);
                if (!channel) throw new Error(`Channel dengan ID ${channelId} tidak ditemukan.`);

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Error mengirim log ke channel ${channelId}:`, error);
        }
    }
};
