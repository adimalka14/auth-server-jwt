const app = require('./app');
const connectDb = require('./config/db.config');

connectDb().then(() =>
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}!`);
    })
);
