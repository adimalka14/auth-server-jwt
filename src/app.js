require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { initAppRouters } = require('./routes/index');
const { generalLimiterMW } = require('./middlewares/rateLimit.mw');
const bodyParser = require('body-parser');
const publicPath = path.resolve('..', './public');
const { swaggerOptions } = require('./config/swagger.config');
const { NODE_ENV } = require('./utils/env-var');

const app = express();

// Enable CORS for all origins (suitable for development).
// To restrict access in production, specify allowed domains in the 'origin' option.
// Example: app.use(cors({ origin: 'https://yourdomain.com' }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(generalLimiterMW);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));
if (NODE_ENV !== 'production') {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

initAppRouters(app);

module.exports = app;
