const knex = require('../database/knex');
const bycrypt = require('bcrypt');

const USER_TABLE = 'users';

// function for creating a new user
const createNewUser = async (firstName, lastName, email, password) => {
    console.log("Checking parameters...")
    if (firstName == null || firstName == undefined || firstName == '') {
        return {
            error: 'First name is required',
            code: 400
        }
    } else if (lastName == null || lastName == undefined || lastName == '') {
        return {
            error: 'Last name is required',
            code: 400
        }
    } else if (email == null || email == undefined || email == '') {
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
    console.log("Checking if user exists...")
    const ifExists = await findByEmail(email);
   
    if (ifExists.length > 0) {
        return {
            error: 'Email already exists',
            code: 400
        }
    }

    // create salt and hashed password
    console.log("Creating new user...")
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const result = await knex(USER_TABLE).insert({firstName, lastName, email, salt, password: hashedPassword});

    return {
        name: firstName + ' ' + lastName,
        email: email,
        password: password
    }
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
    const user = await findByEmail(email);
    if (user.length == 0) {
        return {
            error: 'User does not exist',
            code: 404
        }
    }

    // check if password is correct
    console.log("Checking if password is correct...");
    const hashedPassword = await bycrypt.hash(password, user[0].salt);
    if (hashedPassword == user[0].password) {
        return "User authenticated";
    } else {
        return {
            error: 'Incorrect password',
            code: 401
        }
    }
}

// function for finding user by email
const findByEmail = async (email) => {
    // check if email is not empty
    if (email == null || email == undefined || email == '') {
        return {
            error: 'Email is required',
            code: 400
        }
    }

    const result = await knex(USER_TABLE).select('firstName', 'lastName', 'email').where({email});
    return result;
}

module.exports = {
    createNewUser,
    authenticateUser,
    findByEmail
}

