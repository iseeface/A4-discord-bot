const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Informasi tentang bot ini.'),
    async execute(interaction) {
        // Membuat embed untuk informasi bot
        const infoEmbed = new EmbedBuilder()
            .setColor(0x00FFED)  // Warna embed
            .setTitle('Informasi Bot')  // Judul embed
            .setDescription('Bot ini bertugas menjaga Server Kudet Tech dan mendeteksi tautan Instagram, TikTok, X (Twitter), Reddit, dan Ifunny serta memberikan embed otomatis.')  // Deskripsi embed
            .setFooter({ text: 'Dibuat oleh Farahat' })  // Footer embed
            .setTimestamp();  // Waktu timestamp

        // Mengirimkan embed ke pengguna
        await interaction.reply({ embeds: [infoEmbed] });
    },
};
