const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User"); // Adjust the path as necessary

// Middleware for authentication
const isAuth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    // Get the token from the header
    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "
    const decodedToken = jwt.verify(token, "jwt");
    // console.log("decodeTOken",decodedToken);
    if (!decodedToken) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const user = await User.findById(decodedToken.id).select("-password");
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    req.userId = decodedToken.userId;
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

module.exports = { isAuth, isAdmin };
