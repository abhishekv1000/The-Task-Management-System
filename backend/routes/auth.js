const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
  
    const decoded = jwt.verify(token, "rajTM");
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { authenticateToken };
