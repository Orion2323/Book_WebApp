const bycrypt = require('bcrypt');

const userModel = require('../models/user');

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
    const ifExists = await userModel.findUserByEmail(email);
   
    if (ifExists.length > 0) {
        return {
            error: 'Email already exists',
            code: 409
        }
    }

    // create salt and hashed password
    console.log("Creating new user...")
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const result = await userModel.createNewUser(firstName, lastName, email, salt, hashedPassword);
    return result;
}

// function for deleting user
const deleteUser = async (email) => {
    // check if email is empty
    console.log("Checking parameters...")
    if (email == undefined || email == null) {
        return {
            error: "Email is required",
            code: 400
        }
    }

    // check if email exists
    console.log("Checking if email exists...")
    const ifExists = await userModel.findUserByEmail(email);
    if (ifExists.length == 0) {
        return {
            error: "Email does not exist",
            code: 404
        }
    }

    console.log("Deleting user...")
    const result = await userModel.deleteUser(email);
    return result;
}

// function for finding user by email
const findUserByEmail = async (email) => {
    // check if email is empty
    console.log("Checking parameters...")
    if (email == null || email == undefined) {
        return {
            error: 'Email is required',
            code: 400
        }
    }

    console.log("Checking if email exists...")
    const result = await userModel.findUserByEmail(email);

    if (result.length == 0) {
        return {
            error: "Email does not exist",
            code: 404
        }
    } else {
        return {
            firstName: result[0].firstName,
            lastName: result[0].lastName,
            email: result[0].email
        }
    }
}


module.exports = {
    createNewUser,
    deleteUser,
    findUserByEmail
}