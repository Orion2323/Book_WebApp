const express = require('express');
const router = express.Router();
const {authenticateWithClaims} = require('../middleware/auth');

const sessionController = require('../controllers/session');
const userController = require('../controllers/user')

// GET route to verify is user credentials are valid
router.get('/', async (req, res, next) => {
    try {
        const result = await sessionController.authenticateUser(req.body.email,req.body.password);

        // check if result was successful or not
        if (result.error == undefined) {
            const token = await sessionController.createAuthToken(req.body.email,"User");

            // check if token was created successfully
            if (token.error == undefined) {
                res.status(200).json({Token: token});
            } else {
                res.status(token.code).json(token.error);
            }
        } else {
            res.status(result.code).json(result.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }

    next();
});

// POST route to create new user account
router.post('/', async (req, res, next) => {
    try {
        const result = await userController.createNewUser(req.body.firstName,req.body.lastName,req.body.email,req.body.password);

        // check if result was successful or not
        if (result.error == undefined) {
            res.status(201).json("Account created!");
        } else {
            res.status(result.code).json(result.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    } 

    next();
});

// DELETE route to delete user account
router.delete('/', authenticateWithClaims("User"), async (req, res, next) => {
    try {
        const result = await userController.deleteUser(req.user.email);

        // check for errors
        if (result.error == undefined) {
            res.status(200).json("Account deleted!");
        } else {
            res.status(result.code).json(result.error);
        }
    } catch (err) {
        res.status(500).json(err.toString());
    }

    next()
});

module.exports = router;