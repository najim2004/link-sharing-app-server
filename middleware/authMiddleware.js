const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from cookies
  const token = req.cookies.token;

  // Check if the token exists
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next(); // Call the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
