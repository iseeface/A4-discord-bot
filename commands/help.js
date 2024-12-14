const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Menampilkan daftar semua perintah.'),
    async execute(interaction) {
        // Membuat embed untuk daftar perintah
        const commandsList = interaction.client.commands.map(cmd => `**/${cmd.data.name}**: ${cmd.data.description}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x00FFED)
            .setTitle('Daftar Perintah')
            .setDescription(`Berikut adalah daftar perintah yang tersedia:\n\n${commandsList}`)
            .setFooter({ text: 'Gunakan perintah ini untuk berinteraksi dengan bot' })
            .setTimestamp();

        // Mengirim embed sebagai respon yang hanya bisa dilihat oleh pengguna yang mengirim perintah
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,  // Pesan hanya bisa dilihat oleh pengirim perintah
        });
    },
};
