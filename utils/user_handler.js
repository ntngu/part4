const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/User");

const userExtractor = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, config.SECRET);
    if (decodedToken.id === null) {
      res.status(401).json({ error: "token invalid" });
    }
    req.user = await User.findById(decodedToken.id);
    next();
  } catch(err) {
    next(err);
  }
};

module.exports = userExtractor;