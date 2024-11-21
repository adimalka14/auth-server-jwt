const { model, Schema } = require('mongoose');
const { hashPassword } = require('../utils/hashingPassword');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, 'you must provide an username'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'you must provide a password'],
            minlength: 4,
        },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    try {
        user.password = await hashPassword(user.password);
        next();
    } catch (err) {
        next(err);
    }
});

const userModel = model('User', userSchema);

module.exports = userModel;
