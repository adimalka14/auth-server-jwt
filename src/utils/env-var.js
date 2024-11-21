const { config } = require('dotenv');
const { expand } = require('dotenv-expand');
const path = require('path');

const configPath = path.resolve(__dirname, '../..', `.env.${process.env.NODE_ENV ?? 'local'}`);

expand(config({ path: configPath }));

module.exports.MONGODB_URI = process.env.MONGODB_URI;
module.exports.PORT = +(process.env.PORT ?? 3000);
module.exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'default_secret';
module.exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'default_secret';
module.exports.NODE_ENV = process.env.NODE_ENV ?? 'local';
module.exports.LOGGING_MODE = process.env.LOGGING_MODE ?? 'silly';
module.exports.LOGGING_LINE_TRACE = process.env.LOGGING_LINE_TRACE?.split(',') ?? ['error'];
module.exports.LOG_DIR_PATH = path.resolve(__dirname, '../..', 'logs');
module.exports.SALT_ROUNDS = +process.env.SALT_ROUNDS ?? 10;
