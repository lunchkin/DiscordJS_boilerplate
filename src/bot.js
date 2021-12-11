require('dotenv').config();

const { prefix } = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const fileSystem = require('fs');
const path = require('path');
const dirPath = path.resolve(__dirname, 'commands');
const commandFiles = fileSystem.readdirSync(dirPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const coolDowns = new Discord.Collection();

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});

// When a message is posted where the bot is watching
client.on('message', message => {
    // TODO: Make class or functions for verifying messages / commands? - Might improve readability
    // If the message doesn't start with the designated prefix or it was from a bot
    if (!message.content.toLocaleLowerCase().startsWith(prefix.toLowerCase()) || message.author.bot) {
        return;
    }

    // Splits the arguments, on whitespace(s), after the prefix into an array
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // Get the first argument and make it lowercase
    const commandName = args.shift().toLowerCase();

    // Tries to get a command or a command alias
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // If it is an unsupported command
    if (!command) {
        return message.reply(`Sorry, I don't know that command. Try another command or type '${prefix} help' for help`);
    }

    // If the command is for a group only and it was used in a private message
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    // If the command required arguments and none were given
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!coolDowns.has(command.name)) {
        coolDowns.set(command.name, new Discord.Collection());
    }

    // TODO: Refactor into class / functions?
    const now = Date.now();
    const timestamps = coolDowns.get(command.name);
    const defaultCooldownSeconds = 3;
    const coolDownAmount = (command.cooldown || defaultCooldownSeconds) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        return message.reply('There was an error trying to execute that command! Please try again, or type ' + prefix + 'help.');
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });