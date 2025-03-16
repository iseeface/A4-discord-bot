const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Informasi tentang bot ini.'),
    async execute(interaction) {
        // Ambil URL avatar bot
        const botAvatar = interaction.client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 });

        // Membuat embed untuk informasi bot
        const infoEmbed = new EmbedBuilder()
            .setColor(0x00FFED)
            .setTitle('Informasi A4 Bot')
            .setDescription('✨ **A4 Bot** adalah asisten serbaguna yang dirancang untuk menjaga Server Kudet Tech. Bot ini mampu mendeteksi tautan Instagram, TikTok, X (Twitter), Reddit, dan Ifunny, lalu merubahnya menjadi embed otomatis. Fitur lainnya meliputi melihat waktu Adzan, QOTD, dan **bantuan AI** untuk diagnosis teknis.')
            .setThumbnail(botAvatar)
            .setFooter({ text: 'Made with ❤️ by asabop' })
            .setTimestamp();

        // Membuat button untuk interaksi
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Donasi')
                    .setURL('https://saweria.co/donate/kudettech5')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: '1321794204224978954' }),  // Logo Saweria
                new ButtonBuilder()
                    .setLabel('YouTube')
                    .setURL('https://www.youtube.com/@KudetTech')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: '1322153506034942064' }), // Ganti dengan ID emoji custom
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setURL('https://discord.gg/yePzcmdPKs')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: '1322155135505403935' }),  // Logo Discord
                new ButtonBuilder()
                    .setLabel('Source Code')
                    .setURL('https://github.com/iseeface/personal-bot-discord')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: '1321809108281593886' })  // Logo GitHub
            );

        // Mengirimkan embed dan button ke pengguna
        await interaction.reply({ embeds: [infoEmbed], components: [buttons] });
    },
};
