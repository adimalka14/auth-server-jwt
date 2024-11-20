const authRouter = require('./auth.router');
const usersRouter = require('./users.router');

module.exports.initAppRouters = function (app) {
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        next(err);
    });
};
