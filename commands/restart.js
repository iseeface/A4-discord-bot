const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Merestart bot (khusus untuk admin).'),
    async execute(interaction) {
        // Cek apakah pengguna memiliki role dengan permission ADMINISTRATOR
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'Anda tidak memiliki izin untuk merestart bot.',
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: 'Merestart bot...',
            ephemeral: true,
        });

        // Restart bot menggunakan node.js
        exec('node bot.js', (error, stdout, stderr) => {
            if (error) {
                console.error('Gagal merestart bot:', error);
                return;
            }
            console.log('Bot berhasil direstart:', stdout);
        });

        // Tutup proses utama
        process.exit();
    },
};
