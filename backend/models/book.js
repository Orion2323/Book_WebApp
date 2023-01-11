const knex = require('../database/knex');

const BOOK_TABLE = 'books';

// function to get all books from database
const getAllBooks = async () => {
    const results= await knex(BOOK_TABLE).select('title','author','inShelf').orderBy('title');
    return results
}

// function to add a book in database
const addNewBook = async (title, author, inShelf) => {
    const results= await knex(BOOK_TABLE).insert({title, author, inShelf});
    return results
}

// function to delete a book from database
const deleteBook = async (title, author) => {
    const results = await knex(BOOK_TABLE).where({title, author}).del();
    return results;
}

// method to search for book by title
const searchByTitle = async (title) => {
    const results = await knex(BOOK_TABLE).select('title','author','inShelf').where({title}).orderBy('author');
    return results
}

// method to search for book by author
const searchByAuthor = async (author) => {
    const results = await knex(BOOK_TABLE).select('title','author','inShelf').where({author}).orderBy('title');
    return results;
}

// function for finding books already user has
const checkShelves = async () => {
    const results = await knex(BOOK_TABLE).select('title','author').where({inShelf: 1}).orderBy('title');
    return results;
}

// function for getting all books not on shelf
const getWishList = async () => {
    const results = await knex(BOOK_TABLE).select('title','author').where({inShelf: 0}).orderBy('title');
    return results;
}

// method to search for a book in database
const searchBook = async (title, author) => {
    const results = await knex(BOOK_TABLE).where({title, author});
    return results;
}

module.exports = {
    getAllBooks,
    addNewBook,
    deleteBook,
    searchByTitle,
    searchByAuthor,
    checkShelves,
    getWishList,
    searchBook
}