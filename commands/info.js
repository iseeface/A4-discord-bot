const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Informasi tentang bot ini.'),
    async execute(interaction) {
        await interaction.reply('Bot ini bertugas mendeteksi tautan Instagram, TikTok, X (Twitter), Reddit, dan Ifunny serta memberikan embed otomatis.');
    },
};
