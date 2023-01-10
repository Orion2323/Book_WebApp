const knex = require('../database/knex');

const BOOK_TABLE = 'books';

// method to get all books from library
const getAllBooks = async () => {
    const results = await knex(BOOK_TABLE).select('title','author','inShelf');
    console.log(results);

    // check if library is empty
    if (results.length === 0) {
        return {
            error: "No books in library",
            code: 404
        }
    }

    return results;
}

// method to add a book in the library
const addNewBook = async (title, author, inShelf) => {
    // check if title, author, and inShelf are not empty
    console.log("Checking parameters...")
    if (title == undefined || title == null) {
        return {
            error: "Enter title",
            code: 400
        }
    } else if (author == undefined || author == null) {
        return {
            error: "Enter author",
            code: 400
        }
    } else if (inShelf == undefined || inShelf == null) {
        return {
            error: "Enter inShelf",
            code: 400
        }
    } else if (inShelf != 1 && inShelf != 0) {
        return {
            error: "Enter valid value for inShelf",
            code: 400
        }
    }

    // check if book is already in library
    console.log("Checking if book exists...\n")
    const bookExists = await searchBook(title, author);
    if (bookExists) {
        const results = await knex(BOOK_TABLE).insert({title, author, inShelf});

        // check if book was not successfully added
        if (results.rowCount == 0) {
            return {
                error: "Book was not added",
                code: 400
            }
        } else {
            return results;
        }
    } else {
        return {
            error: "Book already exists in library",
            code: 409
        }
    }
}

// method to delete a book from library
const deleteBook = async (title, author) => {
    // check if title and author are empty
    console.log("Checking parameters...");
    if (title == undefined || title == null) {
        return {
            error: "Enter title",
            code: 400
        }
    } else if (author == undefined || author == null) {
        return {
            error: "Enter author",
            code: 400
        }
    }

    // check if book is in library
    console.log("Checking if book exists...\n")
    const bookExists = await searchBook(title, author);
    if (bookExists) {
        return {
            error: "Book does not exist in library",
            code: 404
        }
    } else {
        const results = await knex(BOOK_TABLE).where({title, author}).del();
        
        // check if book was deleted
        if (results.rowCount === 0) {
            return {
                error: "Book was not deleted",
                code: 400
            }
        }

        return results;
    }
}

// method to search for book by title
const searchByTitle = async (title) => {
    // check if title is empty
    console.log("Checking parameters...\n")
    if (title == undefined || title == null) {
        return {
            error: "Enter title",
            code: 400
        }
    }

    // check if book is in library
    const results = await knex(BOOK_TABLE).select('title','author','inShelf').where({title});
    if (results.length === 0) {
        return {
            error: "Book does not exist in library",
            code: 404
        }
    }

    return results;
}

// method to search for book by author
const searchByAuthor = async (author) => {
    // check if author is empty
    console.log("Checking parameters...\n")
    if (author == undefined || author == null) {
        return {
            error: "Enter author",
            code: 400
        } 
    }

    const results = await knex(BOOK_TABLE).select('title','author','inShelf').where({author});
    console.log(results);

    // check if book is in library
    if (results.length === 0) {
        return {
            error: "No books by author found in library",
            code: 404
        }
    }

    return results;
}

// function for finding books on shelves
const checkShelves = async () => {
    const results = await knex(BOOK_TABLE).select('title','author').where({inShelf: 1});
    
    // check if library is empty
    if (results.length === 0) {
        return {
            error: "No books in library",
            code: 404
        }
    }

    return results;
}

// function for getting all books not on shelf
const getWishList = async () => {
    const results = await knex(BOOK_TABLE).select('title','author').where({inShelf: 0});

    // check if library is empty
    if (results.length == 0) {
        return {
            error: "No books in library",
            code: 404
        }
    }

    return results;
}

// method to search for a book in library
const searchBook = async (title, author) => {
    const results = await knex(BOOK_TABLE).where({title, author});

    // check if book is in library
    if (results.length === 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    getAllBooks,
    addNewBook,
    deleteBook,
    searchByTitle,
    searchByAuthor,
    checkShelves,
    getWishList
}