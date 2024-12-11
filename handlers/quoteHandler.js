const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment-timezone');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

// Fungsi untuk mengambil Quote of the Day dari ZenQuotes API
async function getQuoteOfTheDay() {
    try {
        const response = await axios.get('https://zenquotes.io/api/random');
        const quote = response.data[0].q;
        const author = response.data[0].a;
        return { quote, author };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return { quote: null, author: null };
    }
}

// Fungsi untuk mengirimkan QOTD ke channel Discord dengan format embed
async function sendQOTD(client) {
    const channel = await client.channels.fetch(process.env.QUOTE_CHANNEL_ID);
    if (!channel) {
        console.error('Channel tidak ditemukan!');
        return;
    }

    const { quote, author } = await getQuoteOfTheDay();
    if (quote && author) {
        const embed = new EmbedBuilder()
            .setColor(0x00FFED)  // Warna embed
            .setTitle('Quote of the Day')  // Judul embed
            .setDescription(`"${quote}"`)  // Konten QOTD
            .setFooter({ text: `- ${author}` })  // Nama penulis di footer
            .setTimestamp();  // Waktu timestamp

        channel.send({ embeds: [embed] });
        console.log('QOTD berhasil dikirim');
    } else {
        console.error('Gagal mendapatkan Quote of the Day');
    }
}

// Penjadwalan QOTD berdasarkan waktu dari .env (format HH:mm waktu UTC)
function scheduleQOTD(client) {
    const [utcHour, utcMinute] = process.env.QOTD_TIME.split(':').map(Number);

    cron.schedule(`${utcMinute} ${utcHour} * * *`, () => {
        sendQOTD(client);
    });

    // Format jam dan menit dengan leading zero
    const formattedHour = utcHour.toString().padStart(2, '0');
    const formattedMinute = utcMinute.toString().padStart(2, '0');

    console.log(`QOTD dijadwalkan setiap hari pada ${formattedHour}:${formattedMinute} UTC.`);
}

// Fungsi untuk mendapatkan QOTD untuk pengguna (via perintah), mengirimkan embed
async function getQOTDForUser() {
    const { quote, author } = await getQuoteOfTheDay();
    if (!quote || !author) {
        return 'Gagal mendapatkan Quote of the Day. Coba lagi nanti!';
    }

    const embed = new EmbedBuilder()
        .setColor(0x00FFED)  // Warna embed
        .setTitle('Quote of the Day')  // Judul embed
        .setDescription(`"${quote}"`)  // Konten QOTD
        .setFooter({ text: `- ${author}` })  // Nama penulis di footer
        .setTimestamp();  // Waktu timestamp

    return { embeds: [embed] };
}

module.exports = { scheduleQOTD, sendQOTD, getQOTDForUser };
