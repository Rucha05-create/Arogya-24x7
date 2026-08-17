const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Check Authorization header
        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message: "Not authorized. No token provided."
            });

        }

        // Get token
        const token =
            authHeader.split(" ")[1];

        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log(
            "Decoded Token:",
            decoded
        );

        // Store decoded information
        // inside req.user
        req.user = decoded;

        next();

    }

    catch (error) {

        console.error(
            "Authentication Error:",
            error
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};

module.exports = protect;