const axios = require('axios');
const { getEmbedDetectionStatus } = require('../commands/toggleembed'); // Import status

module.exports = {
    handleEmbed: async (message) => {
        // Cek apakah pendeteksi embed diaktifkan
        if (!getEmbedDetectionStatus()) return; // Jika nonaktif, keluar dari fungsi

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
                        const embedUrl = await getEmbedUrl(url);

                        if (embedUrl) {
                            // Kirim tautan embed yang diformat ulang
                            await message.reply(embedUrl);
                        } else {
                            console.error('URL embed tidak ditemukan.');
                        }
                    } catch (error) {
                        console.error('Error saat menangani tautan embed:', error);
                    }
                }
            }
        }
    },
};

async function getEmbedUrl(url) {
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
            throw new Error('Embed URL tidak ditemukan dalam respons.');
        }
    } catch (error) {
        console.error('Error saat mengambil URL embed:', error);
        throw error;
    }
}
