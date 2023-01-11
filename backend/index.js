const express = require('express');
const bodyParser = require('body-parser');

// Import route handlers
const sessionRoutes = require('./routes/session');
const userRoutes = require('./routes/user');

// Import middleware
const {createMiddleware} = require('./middleware/model-middleware.js');
const {authenticateJWT} = require('./middleware/auth');

// Define express app instance
const app = express();
const port = 3000;

app.use(createMiddleware);
app.use(bodyParser.json());

// health route to verify that connection to database is active
app.get('/health', (req, res, next) => {
    const responseBody = {
        status: 'up',
        port
    };

    res.json(responseBody);
    next();
});

app.use('/session', sessionRoutes);
app.use('/user', userRoutes, authenticateJWT);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})