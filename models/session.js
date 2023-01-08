const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

// function to create a JWT token
const createAuthToken = async (email, role) => {
    const accessTokenSecret = "secret";

    // check if email is not empty
    console.log("Checking if user exists...")
    const ifExists = await userModel.findByEmail(email);

    if (ifExists.length == 0) {
        return {
            error: 'User does not exist',
            code: 404
        }
    }

    if (role != "User") {
        return {
            error: 'Invalid role',
            code: 401
        }
    }

    console.log("Creating token...")
    const token = jwt.sign({...ifExists[0], claimns: ["User"]}, accessTokenSecret);
    return token;
}

module.exports = {
    createAuthToken
}