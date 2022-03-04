const HttpException = require('./HttpException');

class NotFoundException extends HttpException {
  constructor(message) {
    super(404, message, 'NOT_FOUND');
  }
}

module.exports = NotFoundException;