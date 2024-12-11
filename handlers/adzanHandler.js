const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment-timezone');
const { EmbedBuilder } = require('discord.js');

// Cache untuk melacak pengingat yang sudah dikirim
const reminderCache = new Set();

async function getAdzanTimes(location) {
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
        console.error('Error saat mengambil waktu adzan:', error);
        return null;
    }
}

async function sendAdzanReminder(client) {
    const channel = await client.channels.fetch(process.env.ADZAN_CHANNEL_ID);
    if (!channel) {
        console.error('Channel pengingat adzan tidak ditemukan!');
        return;
    }

    const timings = await getAdzanTimes(process.env.LOCATION_ADZAN);
    if (!timings) {
        console.error('Gagal mendapatkan waktu adzan.');
        return;
    }

    const now = moment().tz('Asia/Jakarta'); // Pastikan menggunakan waktu Jakarta
    console.log("Waktu server sekarang (Asia/Jakarta):", now.format('HH:mm')); // Verifikasi waktu server

    const timeFormats = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const currentTime = now.format('HH:mm');

    for (const timeKey of timeFormats) {
        const prayerTime = moment(timings[timeKey], 'HH:mm').tz('Asia/Jakarta'); // Konversi waktu adzan ke Jakarta
        console.log(`Waktu adzan untuk ${timeKey}: ${prayerTime.format('HH:mm')}`); // Verifikasi waktu adzan

        const diff = prayerTime.diff(now, 'minutes');

        const reminderKey = `${timeKey}-${now.format('YYYY-MM-DD')}`;

        if (diff === 0 && !reminderCache.has(reminderKey)) {
            // Kirim pemberitahuan saat waktu adzan tiba dalam bentuk embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Waktu Adzan ${timeKey}`)
                .setDescription(`**Sudah waktunya adzan ${timeKey}** di Jakarta (${prayerTime.format('HH:mm')} WIB). Mari laksanakan sholat tepat waktu.`)
                .addFields(
                    { name: 'Waktu Adzan', value: prayerTime.format('HH:mm'), inline: true },
                    { name: 'Lokasi', value: 'Jakarta', inline: true }
                )
                .setFooter({
                    text: `Sumber: API Aladhan | Dikirim pada ${now.format('HH:mm')} WIB`,
                })
                .setTimestamp();

            await channel.send({ embeds: [embed] });
            reminderCache.add(reminderKey);
        } else if (diff === 5 && !reminderCache.has(reminderKey)) {
            // Kirim pengingat 5 menit sebelum waktu adzan dalam bentuk embed
            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle(`Pengingat Adzan ${timeKey}`)
                .setDescription(`Waktu adzan untuk **${timeKey}** di Jakarta akan tiba pada pukul **${prayerTime.format('HH:mm')}** WIB.`)
                .addFields(
                    { name: 'Pengingat Waktu', value: `${prayerTime.format('HH:mm')} WIB`, inline: true },
                    { name: 'Lokasi', value: 'Jakarta', inline: true }
                )
                .setFooter({
                    text: `Sumber: API Aladhan`,
                })
                .setTimestamp();

            await channel.send({ embeds: [embed] });
            reminderCache.add(reminderKey);
        }
    }
}

function scheduleAdzanReminder(client) {
    cron.schedule('* * * * *', () => {
        sendAdzanReminder(client);

        // Bersihkan cache setiap tengah malam
        const now = moment().tz('Asia/Jakarta'); // Pastikan menggunakan waktu Jakarta
        console.log("Waktu sekarang (setiap jam 00:00):", now.format('HH:mm')); // Verifikasi waktu yang digunakan untuk pembersihan cache

        if (now.format('HH:mm') === '00:00') {
            reminderCache.clear();
        }
    });

    console.log('Penjadwalan pengingat adzan telah diaktifkan.');
}

module.exports = { scheduleAdzanReminder };
