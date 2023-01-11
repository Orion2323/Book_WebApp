const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require('../models/user');

// function to create a JWT token
const createAuthToken = async (email, role) => {
    const accessTokenSecret = "secret";

    // check if email is not empty
    console.log("Checking if user exists...")
    const ifExists = await userModel.findUserByEmail(email);

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
    const token = jwt.sign({...ifExists[0], claims: ["User"]}, accessTokenSecret);
    return token;
}

// function for authenticating user
const authenticateUser = async (email, password) => {
    // check if email and password are not empty
    console.log("Checking parameters...");
    if (email == null || email == undefined || email == '') {
        return {
            error: 'Email is required',
            code: 400
        }
    } else if (password == null || password == undefined || password == '') {
        return {
            error: 'Password is required',
            code: 400
        }
    }

    // check if user exists
    console.log("Checking if user exists...");
    const user = await userModel.findUserByEmail(email);
    if (user.length == 0) {
        return {
            error: 'User does not exist',
            code: 404
        }
    }

    // check if password is correct
    console.log("Checking if password is correct...");
    const hashedPassword = await bcrypt.hash(password, user[0].salt);
    if (hashedPassword == user[0].password) {
        return "User authenticated";
    } else {
        return {
            error: 'Incorrect password',
            code: 401
        }
    }
}

module.exports = {
    createAuthToken,
    authenticateUser
}