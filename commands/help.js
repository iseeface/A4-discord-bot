const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Menampilkan daftar semua perintah.'),
    async execute(interaction) {
        const commandsList = interaction.client.commands.map(cmd => `**/${cmd.data.name}**: ${cmd.data.description}`).join('\n');
        await interaction.reply(`Daftar Perintah:\n${commandsList}`);
    },
};
