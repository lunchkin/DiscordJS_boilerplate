const rawData = require('./../../data/strangeMessages.json');
const strangeMessages = JSON.parse(rawData).strangeMessages;

// TODO: Validate message array here?

module.exports = {
    strangeMessages: strangeMessages,

    getRandomMessage: () => {
        if (Array.isArray(strangeMessages) && strangeMessages.length > 0) {
            return strangeMessages[Math.floor(Math.random() * strangeMessages.length)];
        }

        return 'That was a strange message...';
    },

    // getMultipleMessages: (numberOfMessages) => {
    //     if (numberOfMessages > 0) {
    //
    //     }
    // }
}