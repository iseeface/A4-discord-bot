const axios = require('axios');
const { sendLog } = require('../handlers/logHandler');

// Status pendeteksi embed (default: aktif)
let embedDetectionStatus = true;

// Fungsi untuk mengubah status pendeteksi embed
const setEmbedDetectionStatus = (status) => {
    embedDetectionStatus = status;
};

module.exports = {
    handleEmbed: async (message, client) => {
        // Cek apakah pendeteksi embed diaktifkan
        if (!embedDetectionStatus) return; // Jika nonaktif, keluar dari fungsi

        // Cek apakah pesan mengandung tautan
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex);

        if (urls) {
            // Daftar domain yang didukung oleh bot untuk embed
            const supportedDomains = ['reddit.com', 'instagram.com', 'tiktok.com', 'x.com', 'ifunny.co'];

            for (const url of urls) {
                const isSupported = supportedDomains.some(domain => url.includes(domain));

                if (isSupported) {
                    try {
                        // Hapus embed otomatis hanya untuk tautan yang didukung
                        await message.suppressEmbeds(true);

                        // Ambil tautan embed menggunakan API eksternal
                        const embedUrl = await getEmbedUrl(url, client);

                        if (embedUrl) {
                            // Kirim tautan embed yang diformat ulang
                            await message.reply(embedUrl);
                        } else {
                            const noEmbedMessage = 'URL embed tidak ditemukan.';
                            console.error(noEmbedMessage);

                            // Kirim log ke channel log
                            await sendLog(client, process.env.LOG_CHANNEL_ID, {
                                title: 'Embed Tidak Ditemukan',
                                description: noEmbedMessage,
                                color: 0xFFA500,
                                fields: [{ name: 'URL', value: url, inline: false }],
                            });

                            await message.reply('Maaf, terjadi masalah dalam mengambil embed untuk tautan ini.');
                        }
                    } catch (error) {
                        const errorMessage = `Error saat menangani tautan embed: ${error.message}`;
                        console.error(errorMessage);

                        // Kirim log ke channel log
                        await sendLog(client, process.env.LOG_CHANNEL_ID, {
                            title: 'Kesalahan Embed Handler',
                            description: errorMessage,
                            color: 0xFF0000,
                            fields: [{ name: 'URL', value: url, inline: false }],
                        });

                        await message.reply('Maaf, terjadi kesalahan saat memproses tautan embed ini. Coba lagi nanti.');
                    }
                }
            }
        }
    },

    // Ekspor fungsi dan variabel yang diperlukan
    embedDetectionStatus,
    getEmbedDetectionStatus: () => embedDetectionStatus,
    setEmbedDetectionStatus, // Ekspor fungsi untuk mengubah status
};

async function getEmbedUrl(url, client) {
    try {
        const response = await axios.get(`https://embedez.com/api/v1/providers/combined?q=${encodeURIComponent(url)}`, {
            headers: {
                'Authorization': `Bearer ${process.env.EMBED_EZ_API_KEY}`,
            },
        });

        // Periksa apakah data embed valid
        if (response.data && response.data.success && response.data.data && response.data.data.key) {
            return `[Klik untuk melihat Tautan](https://embedez.com/embed/${response.data.data.key})`;
        } else {
            const noEmbedMessage = 'Embed URL tidak ditemukan dalam respons.';
            console.error(noEmbedMessage);

            // Kirim log ke channel log
            await sendLog(client, process.env.LOG_CHANNEL_ID, {
                title: 'Embed Tidak Valid',
                description: noEmbedMessage,
                color: 0xFFA500,
                fields: [{ name: 'URL', value: url, inline: false }],
            });

            throw new Error(noEmbedMessage);
        }
    } catch (error) {
        const apiErrorMessage = `Error saat mengambil URL embed: ${error.message}`;
        console.error(apiErrorMessage);

        // Kirim log ke channel log
        await sendLog(client, process.env.LOG_CHANNEL_ID, {
            title: 'Kesalahan API Embed',
            description: apiErrorMessage,
            color: 0xFF0000,
            fields: [{ name: 'URL', value: url, inline: false }],
        });

        throw error;
    }
}
