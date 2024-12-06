const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken.userId) {
      return res.status(401).send({ message: "Token is not valid" });
    }
    req.user = decodedToken.userId;
    req.role = decodedToken.role;
    next();
  } catch (error) {
    console.error("error verifying token", error);
    res.status(400).send({ message: " Invalid Token" });
  }
};

module.exports = verifyToken;
