const { prefix } = require('./../config.json');

class CommandRouter {
    constructor(message) {
        this.message = message;
    }

    routeCommand() {

    }

    getCommandArguments() {
        let args = this.message.content.slice(prefix.length).trim().split(/ +/);
        let commandName = args.shift().toLowerCase();
    }
}