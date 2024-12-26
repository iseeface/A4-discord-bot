const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Mengirimkan pesan yang Anda tentukan.')
        .addStringOption(option =>
            option.setName('pesan')
                .setDescription('Pesan yang ingin dikirim oleh bot.')
                .setRequired(true)),
    async execute(interaction) {
        // Periksa apakah pengguna memiliki izin ADMIN
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.',
                ephemeral: true,
            });
        }

        try {
            // Ambil input pesan dari pengguna
            const messageContent = interaction.options.getString('pesan');

            // Kirim pesan ke channel yang sama
            await interaction.channel.send(messageContent);

            // Beri notifikasi bahwa pesan telah dikirim
            await interaction.reply({
                content: 'Pesan berhasil dikirim.',
                ephemeral: true, // Hanya pengirim yang bisa melihat balasan ini
            });
        } catch (error) {
            console.error('Error saat menjalankan perintah /say:', error);
            await interaction.reply({
                content: 'Terjadi kesalahan saat menjalankan perintah ini!',
                ephemeral: true,
            });
        }
    },
};
