const sessionModel = require('../models/session.js');
const express = require('express');
const router = express.Router();

// POST route to create new user account
router.post('/', async (req, res, next) => {
    try {
        const result = await req.models.user.createNewUser(req.body.firstName,req.body.lastName,req.body.email,req.body.password);

        // check if result was successful or not
        if (result.error == undefined) {
            res.status(201).json(result);
        } else {
            res.status(result.code).json(result.error);
        }
    } catch (err) {
        res.status(500).json(err);
    } 

    next();
});

// GET route to verify is user credentials are valid
router.get('/', async (req, res, next) => {
    try {
        const result = await req.models.user.authenticateUser(req.body.email,req.body.password);

        // check if result was successful or not
        if (result.error == undefined) {
            const token = await sessionModel.createAuthToken(req.body.email,"User");

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
        res.status(500).json(err);
    }

    next();
});

module.exports = router;