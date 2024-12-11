const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Menampilkan latensi bot dan API Discord.'),
    async execute(interaction) {
        try {
            // Kirim respons sementara untuk menghitung waktu ping
            const sent = await interaction.reply({ content: 'Mengukur latensi...', fetchReply: true });

            // Hitung latensi
            const timeTaken = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = interaction.client.ws.ping;

            // Membuat embed untuk menampilkan hasil latensi
            const pingEmbed = new EmbedBuilder()
                .setColor(0x00FFED)  // Warna embed
                .setTitle('Pong! 🏓')  // Judul embed
                .addFields(
                    { name: 'Latensi Bot', value: `\`${timeTaken}ms\``, inline: true },
                    { name: 'Latensi API', value: `\`${apiLatency}ms\``, inline: true }
                )
                .setTimestamp();  // Waktu timestamp

            // Mengedit pesan dengan embed yang berisi latensi
            await interaction.editReply({ embeds: [pingEmbed] });
        } catch (error) {
            console.error('Error saat menjalankan perintah ping:', error);

            // Menangani kesalahan dan memberikan respon error kepada pengguna
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: 'Terjadi kesalahan saat menjalankan perintah!' });
            } else {
                await interaction.reply({ content: 'Terjadi kesalahan saat menjalankan perintah!', ephemeral: true });
            }
        }
    },
};
