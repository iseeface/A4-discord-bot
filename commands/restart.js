const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Merestart bot.')
        .setDefaultPermission(true), // Tampilkan command untuk semua pengguna

    async execute(interaction) {
        // Periksa izin pengguna
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menggunakan perintah ini.', ephemeral: true });
        }

        try {
            await interaction.reply({
                content: 'Merestart bot... Tunggu beberapa saat.',
                ephemeral: true,
            });

            console.log(`[INFO] Bot direstart oleh: ${interaction.user.tag}`);

            process.exit(0);
        } catch (error) {
            console.error('[ERROR] Gagal merestart bot:', error);

            await interaction.reply({
                content: 'Terjadi kesalahan saat mencoba merestart bot.',
                ephemeral: true,
            });
        }
    },
};
