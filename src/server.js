const app = require('./app');
const connectDb = require('./config/db.config');
const logger = require('./utils/logger');
const { PORT } = require('./utils/env-var');

connectDb().then(() =>
    app.listen(PORT, () => {
        logger.info(`Server started!`, { PORT });
    })
);
