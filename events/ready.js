const { scheduleQOTD } = require('../handlers/quoteHandler');
const { scheduleAdzanReminder } = require('../handlers/adzanHandler');

module.exports = {
    once: true,
    async execute(client) {
        console.log(`Bot siap! Login sebagai ${client.user.tag}`);

        // Jadwalkan QOTD dan pengingat Adzan
        scheduleQOTD(client); // pastikan fungsi ini benar-benar membutuhkan client
        scheduleAdzanReminder(client); // pastikan fungsi ini benar-benar membutuhkan client
    },
};
