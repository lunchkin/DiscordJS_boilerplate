const winston = require('winston');

class Logger {
    constructor(logFile = "log.txt") {
        this.logFile = logFile;
    }

    addLog(text, level = "info") {
        const logger = winston.createLogger()
    }
}