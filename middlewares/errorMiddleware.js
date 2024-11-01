const ApiError = require("../utils/apiError");

const globalError = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    errorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = JsonWebTokenError();
    if (err.name === "TokenExpiredError") err = TokenExpiredError();
    errorForProd(err, res);
  }
};

const JsonWebTokenError = () =>
  new ApiError("Invalid Token, Please Login Again..", 401);
const TokenExpiredError = () =>
  new ApiError("Token Expired, Please Login Again..", 401);

const errorForDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const errorForProd = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
