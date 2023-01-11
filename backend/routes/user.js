const express = require('express');
const router = express.Router();
const {authenticateWithClaims} = require('../middleware/auth');

const bookController = require('../controllers/book')
const userController = require('../controllers/user');

// GET route to get user info
router.get('/self',authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const result = await userController.findUserByEmail(req.user.email);

        // check for errors
        if (result.error == undefined) {
            res.status(200).json(result);
        } else {
            res.status(result.status).json(result.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }

    next();
});

// GET route to show all books in library
router.get('/all', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const allBooks = await bookController.getAllBooks();

        // check for errors
        if (allBooks.error == undefined || allBooks.error == null) {
            res.status(200).json(allBooks);
        } else {
            res.status(allBooks.code).json(allBooks.error);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.toString());
    }

    next();
});

// GET route to search for a book in library by title
router.get('/byTitle', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const byTitle = await bookController.searchByTitle(req.body.title);

        // check for error
        if (byTitle.error == undefined || byTitle.error == null) {
            res.status(200).json(byTitle);
        } else {
            res.status(byTitle.code).json(byTitle.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }

    next();
}); 

// GET route to search for a book in library by author
router.get('/byAuthor', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const byAuthor = await bookController.searchByAuthor(req.body.author);

        // check for error
        if (byAuthor.error == undefined || byAuthor.error == null) {
            res.status(200).json(byAuthor);
        } else {
            res.status(byAuthor.code).json(byAuthor.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }

    next();
});

// GET route that shows all books on shelf
router.get('/onShelf', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const onShelf = await bookController.checkShelves();

        // check for errors
        if (onShelf.error == undefined || onShelf.error == null) {
            res.status(200).json(onShelf);
        } else {
            res.status(onShelf.code).json(onShelf.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }


    next();
});

// GET route for getting all books on wish list
router.get('/wishList', async (req, res, next) => {
    try {
        const wishList = await bookController.getWishList();

        // check for errors
        if (wishList.error == undefined || wishList.error == null) {
            res.status(200).json(wishList);
        } else {
            res.status(wishList.code).json(wishList.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }
    next();
});

// POST route to add a book to library
router.post('/add', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const addBook = await bookController.addNewBook(req.body.title,req.body.author,req.body.inShelf);

        // check for errors
        if (addBook.error == undefined || addBook.error == null) {
            res.status(204).json("Book added to Library");
        } else {
            res.status(addBook.code).json(addBook.error);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err.toString());
    }

    next();
});

// DELETE route to delete a book from library
router.delete('/delete', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const deleteBook = await bookController.deleteBook(req.body.title,req.body.author);

        // check for error 
        if (deleteBook.error == undefined || deleteBook.error == null) {
            res.status(204).json("Book deleted from library");
        } else {
            res.status(deleteBook.code).json(deleteBook.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }

    next();
});

module.exports = router;