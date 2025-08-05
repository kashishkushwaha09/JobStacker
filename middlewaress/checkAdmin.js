const { AppError } = require("../utils/appError");
const jwt = require('jsonwebtoken');
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    throw new AppError("Unauthorized",401);
    
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") throw new AppError("Not admin",403);
    next();
  } catch (err) {
    console.error(err);
    throw new AppError("Access denied",403);
  }
};

module.exports=isAdmin;