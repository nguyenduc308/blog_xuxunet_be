const HttpException = require('./HttpException');

class UnauthorizationException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTH');
  }
}

module.exports = UnauthorizationException;