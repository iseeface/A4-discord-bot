const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

async function registerCommands(client) {
    const commands = client.commands.map(command => command.data.toJSON());
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Mendaftarkan slash commands ke Discord...');

        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

        console.log('Slash commands berhasil didaftarkan!');
    } catch (error) {
        console.error('Gagal mendaftarkan commands:', error);
    }
}

module.exports = { registerCommands };
