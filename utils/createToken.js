const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_CODE, {
    expiresIn: process.env.JWT_EXPIRE_DATE,
  });

module.exports = createToken;