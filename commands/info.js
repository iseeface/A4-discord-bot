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
            .setTitle('Informasi <NAMA_BOT> Bot')
            .setDescription('✨ **<NAMA_BOT>** adalah asisten serbaguna yang dirancang untuk menjaga Server <NAMA_SERVER>. Bot ini mampu mendeteksi tautan Instagram, TikTok, X (Twitter), Reddit, dan Ifunny, lalu merubahnya menjadi embed otomatis. Fitur lainnya meliputi melihat waktu Adzan, QOTD, dan **bantuan AI** untuk diagnosis teknis.')
            .setThumbnail(botAvatar)
            .setFooter({ text: 'Made with ❤️ by asabop' })
            .setTimestamp();

        // Membuat button untuk interaksi
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Donasi')
                    .setURL('<URL_DONASI>')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: '<ID_EMOJI>' }),  // Logo Saweria
                new ButtonBuilder()
                    .setLabel('YouTube')
                    .setURL('<URL_YOUTUBE>')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: 'ID_EMOJI' }), // Ganti dengan ID emoji custom
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setURL('<URL_SUPPORT_SERVER>')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: 'ID_EMOJI' }),  // Logo Discord
                new ButtonBuilder()
                    .setLabel('Source Code')
                    .setURL('<URL_SOURCE_CODE>')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji({ id: 'ID_EMOJI' })  // Logo GitHub
            );

        // Mengirimkan embed dan button ke pengguna
        await interaction.reply({ embeds: [infoEmbed], components: [buttons] });
    },
};
