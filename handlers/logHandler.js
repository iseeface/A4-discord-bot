const { WebhookClient } = require('discord.js');

module.exports = {
    sendLog: async (client, channelId, logDetails) => {
        try {
            // Validasi parameter logDetails
            if (!logDetails || typeof logDetails !== 'object') {
                console.error('logDetails tidak valid atau kosong!');
                return;
            }

            // Ambil URL webhook dari environment variable
            const webhookUrl = process.env.LOG_WEBHOOK_URL;
            if (!webhookUrl) {
                console.error('URL webhook tidak ditemukan di environment variable!');
                return;
            }

            // Buat instance WebhookClient
            const webhookClient = new WebhookClient({ url: webhookUrl });

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
            const embed = {
                color: logDetails.color || 0x00FFED,
                author: {
                    name: logDetails.author?.name || 'Bot System',
                    icon_url: logDetails.author?.icon_url || client.user.displayAvatarURL(),
                },
                title: logDetails.title || 'Log Notification',
                description: logDetails.description || 'Tidak ada deskripsi yang diberikan.',
                fields: logDetails.fields || [],
                footer: { text: footerText || 'Tidak Diketahui' },
                timestamp: logDetails.timestamp ? new Date(logDetails.timestamp).toISOString() : new Date().toISOString(),
            };

            // Kirim log menggunakan webhook
            await webhookClient.send({
                embeds: [embed],
            });

        } catch (error) {
            console.error('Error mengirim log melalui webhook:', error);
        }
    },
};
