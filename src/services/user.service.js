const userModel = require('../models/users.model');

const findUserByUsername = async (username) => {
    return userModel.findOne({ username });
};

const createUser = async (userData) => {
    const user = new userModel(userData);
    return await user.save();
};

module.exports = {
    findUserByUsername,
    createUser,
};
