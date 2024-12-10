require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandLoader');
const { handleEmbed } = require('./handlers/embedHandler');
const { scheduleQOTD } = require('./handlers/quoteHandler');
const { scheduleAdzanReminder } = require('./handlers/adzanHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

// Load commands
const commands = loadCommands(client);


// Event ready
client.once('ready', () => {
    console.log(`Bot siap! Login sebagai ${client.user.tag}`);
    scheduleQOTD(client);
    scheduleAdzanReminder(client);
});

// Event interactionCreate
client.on('error', error => console.error('Bot mengalami error:', error));
client.on('interactionCreate', async interaction => {
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
});

// Event messageCreate untuk tautan
client.on('messageCreate', async message => {
    if (!message.author.bot) {
        await handleEmbed(message);
    }
});

client.login(process.env.DISCORD_TOKEN);
