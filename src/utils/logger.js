const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

const { LOGGING_MODE, LOGGING_LINE_TRACE, LOG_DIR_PATH } = require('./env-var');

const LEVELS = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    debug: 'debug',
    verbose: 'verbose',
    userAction: 'userAction',
    silly: 'silly',
};

function stringifyMetaData(metadata = '') {
    if (!metadata || typeof metadata === 'string') return metadata;
    return Object.keys(metadata).length
        ? `\n\t${JSON.stringify(metadata, null, 2)}`
        : '';
}

class Logger {
    #logger;

    constructor() {
        const transportDailyRotateFile = new winstonDailyRotateFile({
            dirname: LOG_DIR_PATH,
            extension: '.log',
            filename: 'dog-adapter- %DATE%',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: LOGGING_MODE,
        });
        transportDailyRotateFile.on(
            'rotate',
            function (oldFileName, newFileName) {}
        );
        this.#logger = winston.createLogger({
            transports: [
                transportDailyRotateFile,
                new winston.transports.Console({ level: LOGGING_MODE }),
            ],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.splat(),
                winston.format.printf(
                    ({
                        timestamp,
                        level,
                        request_id,
                        message,
                        ...metadata
                    }) => {
                        return `${timestamp} [${level}] [${request_id}] ${message} ${stringifyMetaData(metadata)}`;
                    }
                )
            ),
        });

        this.#logger.on('error', (err) => {
            console.error('Logger error Caught: ', err);
        });
    }

    #getLineTrace(err) {
        if (!err.stack) return undefined;

        const stackLines = err.stack.split('\n');

        const traceLine = stackLines.find((line) => line.includes('at'));

        if (!traceLine) return undefined;

        const match =
            traceLine.match(/\((.*):(\d+):(\d+)\)/) ||
            traceLine.match(/at (.*):(\d+):(\d+)/);

        if (!match) return undefined;

        const [, filePath, line, column] = match;

        return `File: ${filePath}, Line: ${line}, Column: ${column}`;
    }

    writeLog(level, request_id, message, options = {}) {
        if (typeof options === 'object') {
            options.$message = options.message || null; // Optional chaining
            delete options.message;
        }

        let lineTrace;
        if (
            Array.isArray(LOGGING_LINE_TRACE) &&
            (LOGGING_LINE_TRACE.includes(level) || level === LEVELS.error)
        ) {
            const error = new Error(message);
            lineTrace = this.#getLineTrace(error);
        }

        if (lineTrace) {
            options.lineTrace = lineTrace;
        }

        this.#logger.log(level, message, { request_id, ...options });
    }

    error(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.error, request_id, message, metadata);
    }

    warn(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.warning, request_id, message, metadata);
    }

    info(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.info, request_id, message, metadata);
    }

    debug(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.debug, request_id, message, metadata);
    }

    verbose(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.verbose, request_id, message, metadata);
    }

    userAction(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.userAction, request_id, message, metadata);
    }

    silly(request_id, message, metadata = {}) {
        this.writeLog(LEVELS.silly, request_id, message, metadata);
    }
}

const logger = new Logger();
module.exports = logger;

// print the first log with the current logging mode
logger[LOGGING_MODE]('LOGGER', 'logger instance created', { LOGGING_MODE });
