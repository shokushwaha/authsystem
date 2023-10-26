const jwt = require("jsonwebtoken");

// generating jwt token
const generateAccessToken = (user) => {
    return jwt.sign(
        { username: user.username, role: user.role, _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};


// verifying jwt token
const verifyAccessToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken)
        return res.status(400).json({ error: "User not Authenticated!" });

    try {
        const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


module.exports = { generateAccessToken, verifyAccessToken };