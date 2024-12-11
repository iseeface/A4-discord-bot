const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment-timezone');
const { EmbedBuilder } = require('discord.js');
const { sendLog } = require('./logHandler');

// Cache untuk melacak pengingat yang sudah dikirim
const reminderCache = new Set();

// Fungsi untuk mengambil waktu adzan dengan retry mechanism
async function getAdzanTimes(location, client, retries = 3, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
                params: {
                    city: location,
                    country: 'Indonesia',
                    method: 2,
                },
            });
            return response.data.data.timings;
        } catch (error) {
            const errorMessage = `Error saat mengambil waktu adzan (Percobaan ${attempt}/${retries}): ${error.message}`;
            console.error(errorMessage);

            // Laporkan error ke channel log
            await sendLog(client, process.env.LOG_CHANNEL_ID, {
                title: 'Kesalahan API Waktu Adzan',
                description: errorMessage,
                color: 0xFF0000,
                fields: [
                    { name: 'Lokasi', value: location, inline: true },
                    { name: 'Percobaan', value: `${attempt} dari ${retries}`, inline: true },
                ],
            });

            if (attempt < retries) {
                console.log(`Retrying dalam ${delay / 1000} detik...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            } else {
                const finalError = 'Gagal mengambil waktu adzan setelah beberapa kali percobaan.';
                console.error(finalError);

                // Laporkan kegagalan final
                await sendLog(client, process.env.LOG_CHANNEL_ID, {
                    title: 'Gagal Mengambil Waktu Adzan',
                    description: finalError,
                    color: 0xFF0000,
                    fields: [{ name: 'Lokasi', value: location, inline: true }],
                });

                return null;
            }
        }
    }
}

// Fungsi untuk mengirim pengingat adzan
async function sendAdzanReminder(client) {
    const channel = await client.channels.fetch(process.env.ADZAN_CHANNEL_ID);
    if (!channel) {
        console.error('Channel pengingat adzan tidak ditemukan!');
        await sendLog(client, process.env.LOG_CHANNEL_ID, {
            title: 'Channel Tidak Ditemukan',
            description: 'Channel pengingat adzan tidak dapat diakses. Periksa konfigurasi bot.',
            color: 0xFF0000,
        });
        return;
    }

    const timings = await getAdzanTimes(process.env.LOCATION_ADZAN, client);
    if (!timings) {
        console.error('Gagal mendapatkan waktu adzan.');
        return;
    }

    const now = moment().tz('Asia/Jakarta');
    const timeFormats = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const timeKey of timeFormats) {
        const prayerTimeString = timings[timeKey];
        const prayerTime = moment.tz(prayerTimeString, 'HH:mm', 'Asia/Jakarta');
        const diff = prayerTime.diff(now, 'minutes');
        const reminderKey = `${timeKey}-${now.format('YYYY-MM-DD')}`;

        if ((diff === 0 || diff === 5) && !reminderCache.has(reminderKey)) {
            const embedColor = diff === 0 ? '#0099ff' : '#ffcc00';
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`Pengingat Waktu Adzan ${timeKey}`)
                .setDescription(
                    diff === 0
                        ? `**Sudah waktunya adzan ${timeKey}** di Jakarta (${prayerTime.format('HH:mm')} WIB). Mari laksanakan sholat tepat waktu.`
                        : `Waktu adzan untuk **${timeKey}** akan tiba dalam 5 menit pada pukul **${prayerTime.format('HH:mm')} WIB**.`
                )
                .addFields(
                    { name: 'Waktu Adzan', value: prayerTime.format('HH:mm'), inline: true },
                    { name: 'Lokasi', value: 'Jakarta', inline: true }
                )
                .setFooter({ text: `Sumber: API Aladhan`, timestamp: now.toDate() });

            try {
                await channel.send({ embeds: [embed] });
                console.log(`Mengirim pengingat adzan ${timeKey}`);
                reminderCache.add(reminderKey);

                // Logging sukses
                await sendLog(client, process.env.LOG_CHANNEL_ID, {
                    title: `Pengingat Adzan ${timeKey} Terkirim`,
                    description: `Pengingat waktu adzan untuk ${timeKey} berhasil dikirim ke channel.`,
                    color: 0x00FF00,
                    fields: [{ name: 'Waktu Adzan', value: prayerTime.format('HH:mm'), inline: true }],
                });
            } catch (error) {
                console.error(`Error mengirim pengingat adzan ${timeKey}:`, error);
                await sendLog(client, process.env.LOG_CHANNEL_ID, {
                    title: `Error Pengingat Adzan ${timeKey}`,
                    description: `Gagal mengirim pengingat adzan ${timeKey}. Periksa log error untuk detailnya.`,
                    color: 0xFF0000,
                });
            }
        }
    }
}

// Fungsi untuk menjadwalkan pengingat adzan
function scheduleAdzanReminder(client) {
    cron.schedule('* * * * *', () => {
        sendAdzanReminder(client);

        const now = moment().tz('Asia/Jakarta');
        if (now.format('HH:mm') === '00:00') {
            console.log("Membersihkan cache pengingat adzan.");
            reminderCache.clear();

            // Logging pembersihan cache
            sendLog(client, process.env.LOG_CHANNEL_ID, {
                title: 'Cache Pengingat Dibersihkan',
                description: 'Cache pengingat adzan telah dibersihkan untuk hari baru.',
                color: 0x00FFED,
            });
        }
    });

    console.log('Penjadwalan pengingat adzan telah diaktifkan.');
}

module.exports = { scheduleAdzanReminder };
