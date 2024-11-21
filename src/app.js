require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const { initAppRouters } = require('./routes/index');
const { generalLimiterMW } = require('./middlewares/rateLimit.mw');
const bodyParser = require('body-parser');
const publicPath = path.resolve('..', './public');

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(generalLimiterMW);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));

initAppRouters(app);

module.exports = app;
