module.exports = {
    name: 'args-info',
    description: 'Information about the arguments provided.',
    args: true,
    execute(message, args) {
        let argumentMessage = `Argument list: \n`;

        for (const argument of args) {
            argumentMessage += `${args.indexOf(argument) + 1} - ${argument}\n`
        }

        message.channel.send(argumentMessage);
    },
};