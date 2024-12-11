module.exports = {
    async execute(client, interaction) {
        // Pastikan interaksi adalah command
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`Command ${interaction.commandName} tidak ditemukan!`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error saat mengeksekusi command ${interaction.commandName}:`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: 'Terjadi kesalahan saat menjalankan perintah!' });
            } else {
                await interaction.reply({ content: 'Terjadi kesalahan saat menjalankan perintah!', ephemeral: true });
            }
        }
    },
};
