module.exports = {
    name: 'ping',
    description: 'Replies with "Pong."',
    guildOnly: true,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};