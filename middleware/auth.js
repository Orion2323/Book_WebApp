const jwt = require('jsonwebtoken');
const accessTokenSecret = "secret";

// function for authenticating user token
const authenticateJWT = (req, res, next) => {
    const headerToken = req.headers.authorization;
    console.log("Receiving token...")

    if (headerToken != undefined) {
        console.log("Verifying token...\n")
        jwt.verify(headerToken,accessTokenSecret, (err, user) => {
            // check if token is valid
            if (err) {
                return res.status(403).json("Invalid Token");
            }

            req.user = user;
        });
    }

    next();
}

// function for authenticating user
const authenticateWithClaims = (claims) => (req, res, next) => {
    const headerToken = req.headers.authorization;
    console.log("Receiving token...")

    // check for token in header
    if (headerToken == undefined) {
        return res.status(401).json("Enter a token");
    } else {
        // verify user token
        console.log("Verifying token...\n")
        jwt.verify(headerToken,accessTokenSecret, (err, user) => {
            // check if token is valid
            if (err) {
                return res.status(403).json("Invalid Token");
            }

            // check if role is valid
            if (!user.claims.includes(claims)) {
                return res.status(403).json("Invalid Role");
            }

            req.user = user;
        });
    }

    next();
}

// function for verifying token with user
const verifyTokenWithUser = (email) => (req, res, next) => {
    const headerToken = req.headers.authorization;
    console.log("Receiving token...")

    // check for token in header
    if (headerToken == undefined) {
        return res.status(401).json("Enter a token");
    } else {
        console.log("Decoding token...\n")
        const decodeToken = jwt.decode(headerToken);
        console.log(decodeToken);
    }

    next();
}

module.exports = {
    authenticateJWT,
    authenticateWithClaims,
    verifyTokenWithUser
}