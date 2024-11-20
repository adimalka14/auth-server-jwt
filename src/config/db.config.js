const mongoose = require('mongoose');
const { MONGODB_URI } = require('../utils/env-var');
const logger = require('../utils/logger');

module.exports = connectDb = async (uri = MONGODB_URI) => {
    try {
        await mongoose.connect(uri);
        logger.info('SYSTEM', `MongoDB Connected`, { uri });
    } catch (err) {
        logger.error('SYSTEM', `MongoDB Connection Error`, { uri, err });
        throw new Error('Failed to connect to MongoDB');
    }
};
