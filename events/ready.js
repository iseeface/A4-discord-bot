const { scheduleQOTD } = require('../handlers/quoteHandler');

module.exports = {
    once: true,
    async execute(client) {
        console.log(`Bot siap! Login sebagai ${client.user.tag}`);

        // Jadwalkan QOTD
        scheduleQOTD(client); // pastikan fungsi ini benar-benar membutuhkan client
    },
};
