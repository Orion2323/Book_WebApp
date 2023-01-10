const User = require('../models/user');

const createMiddleware = async (req, res, next) => {
    req.models = {
        user: User
    };

    next();
};

module.exports = {
    createMiddleware,
};