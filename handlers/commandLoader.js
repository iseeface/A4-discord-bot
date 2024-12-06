const fs = require('fs');

module.exports = {
    loadCommands: (client) => {
        const commands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }

        return commands; // Mengembalikan array command untuk pendaftaran
    },
};
