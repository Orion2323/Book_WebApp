const bookModel = require('../models/book');

// function to get all books from library
const getAllBooks = async () => {
    const results = await bookModel.getAllBooks();

    // check if library is empty
    if (results.length === 0) {
        return {
            error: "No books in library",
            code: 404
        }
    }

    return results;
}

// function to add a new book to library
const addNewBook = async (title, author, inShelf) => {
    // check if title, author, or inShelf are empty
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
    } else if (inShelf == undefined || author == null) {
        return  {
            error: "Enter inShelf value",
            code: 400
        }
    } else if (inShelf != 1 && inShelf != 0) {
        return {
            error: "Enter a valid value inShelf",
            code: 400
        }
    }

    // check if book is already in library
    console.log("Checking if book exists...\n")
    const bookExists = await bookModel.searchBook(title, author);
    if (bookExists.length == 0) {
        const results = await bookModel.addNewBook(title, author, inShelf);
        return results;
    } else {
        return {
            error: "Book already exists in library",
            code: 409
        }
    }
}

// function to delete book from library
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
    const bookExists = await bookModel.searchBook(title, author);
    if (bookExists.length == 0) {
        return {
            error: "Book does not exist in library",
            code: 404
        }
    } else {
        const results = await bookModel.deleteBook(title, author);
        return results;
    }
}

// function to search for book by title
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
    const results = await bookModel.searchByTitle(title);
    if (results.length === 0) {
        return {
            error: "Book does not exist in library",
            code: 404
        }
    }

    return results;
}

// function to search for book by author
const searchByAuthor = async (author) => {
    // check if author is empty
    console.log("Checking parameters...\n")
    if (author == undefined || author == null) {
        return {
            error: "Enter author",
            code: 400
        } 
    }

    const results = await bookModel.searchByAuthor(author);

    // check if book is in library
    if (results.length === 0) {
        return {
            error: "No books by author found in library",
            code: 404
        }
    }

    return results;
}

// function to check all books in shelf
const checkShelves = async () => {
    const results = await bookModel.checkShelves();

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
    const results = await bookModel.getWishList();

    // check if library is empty
    if (results.length == 0) {
        return {
            error: "No books in library",
            code: 404
        }
    }

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
}