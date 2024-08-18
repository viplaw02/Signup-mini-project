const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();

exports.unHashed = async (req, res) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: "Authorization header missing or improperly formatted"
            });
        }

        // Extract the token from the header
        const token = authHeader.split(' ')[1];

        // Log the secret for debugging (remove in production)
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Received token:", token);   

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        // Return the decoded token details if successful
        return res.status(200).json({
            status: true,// Assume role is mandatory
            email: decoded.email,  // Assume email is mandatory
            Role: decoded.Role, 
        });

    } catch (error) {
        console.log("Token verification error:", error.message);
        let errorMessage = "Invalid token";
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Token has expired";
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = "Malformed token";
        }
        return res.status(401).json({
            success: false,
            message: errorMessage
        });
    }
}
