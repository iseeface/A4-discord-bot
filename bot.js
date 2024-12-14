require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandLoader');
const { loadEvents } = require('./handlers/eventLoader');
const { registerCommands } = require('./registerCommands');  // Impor registerCommands

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});
client.commands = new Collection();

// Load commands and events
loadEvents(client);
loadCommands(client);

client.login(process.env.DISCORD_TOKEN).then(() => {
    // Daftarkan slash commands setelah bot login
    registerCommands(client);
});
