const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const moment = require('moment-timezone');
moment.locale('id'); // Set locale bahasa Indonesia

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adzan')
        .setDescription('Melihat waktu adzan di lokasi tertentu di seluruh dunia.')
        .addStringOption(option =>
            option.setName('lokasi')
                .setDescription('Nama kota atau lokasi.')
                .setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('lokasi');

        try {
            // Menangguhkan interaksi agar tidak timeout
            await interaction.deferReply({ ephemeral: false });

            // Menggunakan API untuk mendapatkan koordinat lokasi
            const locationResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: location,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1,
                },
            });

            if (!locationResponse.data.length) {
                return interaction.editReply({
                    content: `Lokasi "${location}" tidak ditemukan. Pastikan Anda memberikan nama lokasi yang valid.`,
                });
            }

            const { lat, lon, display_name } = locationResponse.data[0];
            const country = locationResponse.data[0].address.country; // Ambil nama negara dari response

            // Pisahkan nama lokasi untuk hanya mengambil nama kota dan provinsi
            const locationParts = display_name.split(','); // Memisahkan berdasarkan koma
            const cityAndProvince = locationParts.length > 1 ? `${locationParts[0]}, ${locationParts[1]}` : locationParts[0]; // Ambil nama kota dan provinsi saja

            // Ambil waktu adzan berdasarkan koordinat
            const adzanResponse = await axios.get(`https://api.aladhan.com/v1/timings`, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    method: 2, // Metode perhitungan waktu sholat
                },
            });

            if (!adzanResponse.data || !adzanResponse.data.data || !adzanResponse.data.data.timings) {
                throw new Error('Tidak dapat mengambil waktu adzan dari API.');
            }

            const timings = adzanResponse.data.data.timings;
            const date = adzanResponse.data.data.date;

            // Format tanggal menjadi hari, tanggal, bulan, dan tahun dalam bahasa Indonesia
            const readableDate = date.readable; // Misalnya: "10 Dec 2024"
            const formattedDate = moment(readableDate, 'DD MMM YYYY', 'en').locale('id').format('dddd, D MMMM YYYY'); // Menggunakan locale 'id'

            // Membuat Embed untuk menampilkan informasi
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Waktu Adzan | ${cityAndProvince}`) // Menampilkan hanya kota dan provinsi
                .setDescription(`${formattedDate}`)
                .addFields(
                    { name: 'Subuh', value: timings.Fajr, inline: false },
                    { name: 'Dzuhur', value: timings.Dhuhr, inline: false },
                    { name: 'Ashar', value: timings.Asr, inline: false },
                    { name: 'Maghrib', value: timings.Maghrib, inline: false },
                    { name: 'Isya', value: timings.Isha, inline: false },
                )
                .setFooter({
                    text: `Sumber: API Aladhan | ${country}`, // Menampilkan negara
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error saat mengambil waktu adzan:', error);

            // Kirim pesan error ke pengguna
            if (error.response && error.response.data) {
                await interaction.editReply({
                    content: `Terjadi kesalahan saat mengambil waktu adzan. ${error.response.data.message || 'Coba lagi nanti.'}`,
                });
            } else {
                await interaction.editReply({
                    content: 'Terjadi kesalahan saat mengambil waktu adzan. Mohon coba lagi nanti.',
                });
            }
        }
    },
};
