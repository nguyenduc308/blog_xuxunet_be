exports.errorsHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "An error occur";
  const code = error.code || "UNKNOWN";

  return res.status(statusCode).json({ message, statusCode, code });
};
