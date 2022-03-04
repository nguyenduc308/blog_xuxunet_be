class HttpException extends Error {
  statusCode;
  message;
  code;
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
  }
}

module.exports = HttpException;
