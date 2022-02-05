const jwt = require('jsonwebtoken');

// Generate an Access Token for the given User ID
function generateAccessToken(user) {
    // How long will the token be valid for
    //const expiresIn = '1 hour';
    const expiresIn = '1 hour';
    // Which service issued the token
    const issuer = 'API_SERVER';
    // Which service is the token intended for
    const audience = 'USER';
    // The signing key for signing the token
    const secret = 'SECRET';

    const token = jwt.sign({}, secret, {
        expiresIn: expiresIn,
        algorithm: 'HS256',
        audience: audience,
        issuer: issuer,
        subject: JSON.stringify(user)
    });
    return token;
}

//Verifying the JWT Token
function verifyAccessToken(token, cb) {
    return jwt.verify(token, 'SECRET', cb);
}

//Parsing the Token
function parseAccessToken(token) {
    return jwt.verify(token, 'SECRET', { ignoreExpiration: true });
}

module.exports = { generateAccessToken, verifyAccessToken, parseAccessToken };