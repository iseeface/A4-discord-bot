require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Menghapus semua Slash Command...');
        const commands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        const promises = commands.map(command =>
            rest.delete(`${Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`)
        );
        await Promise.all(promises);
        console.log('Semua Slash Command berhasil dihapus.');
    } catch (error) {
        console.error('Error menghapus Slash Command:', error);
    }
})();
