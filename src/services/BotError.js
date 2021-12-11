const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label,  prettyPrint } = format;

const logger = createLogger({
    format: combine(
        label({ label: 'error' }),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'exceptions.log', level: 'error'}),
    ]
})

module.exports = class BotError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);

        logger.log({
            level: 'error',
            message: message
        });
    }
}