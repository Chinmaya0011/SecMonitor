const {verifyToken}=require("../utils/jwt.js");

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
module.exports={protect}