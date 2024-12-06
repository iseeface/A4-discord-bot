const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Mengirimkan pesan yang Anda tentukan.')
        .addStringOption(option =>
            option.setName('pesan')
                .setDescription('Pesan yang ingin dikirim oleh bot.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Ambil input pesan dari pengguna
            const messageContent = interaction.options.getString('pesan');

            // Hapus pesan eksekusi (opsional, untuk bot command)
            await interaction.deferReply({ ephemeral: true });

            // Kirim pesan ke channel yang sama
            await interaction.channel.send(messageContent);

            // Balas interaksi tanpa pesan (atau gunakan ephemeral reply)
            await interaction.deleteReply(); // Hapus jejak eksekusi
        } catch (error) {
            console.error('Error saat menjalankan perintah /say:', error);
            await interaction.reply({
                content: 'Terjadi kesalahan saat menjalankan perintah ini!',
                ephemeral: true,
            });
        }
    },
};
