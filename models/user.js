const knex = require('../database/knex');

const USER_TABLE = 'users';

// function for inserting new user information into database
const createNewUser = async (firstName, lastName, email, salt, password) => {
    const result = await knex(USER_TABLE).insert({firstName, lastName, email, salt, password});
    return result;
}

// function for finding user by email into database
const findUserByEmail = async (email) => {
    const result = await knex(USER_TABLE).where({email});
    return result;
}

// function for deleting user from database
const deleteUser = async (email) => {
    const result = await knex(USER_TABLE).where({email}).del();
    return result;
}

module.exports = {
    createNewUser,
    deleteUser,
    findUserByEmail
}