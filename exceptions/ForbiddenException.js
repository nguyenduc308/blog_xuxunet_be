const HttpException = require('./HttpException');

export class ForbiddenException extends HttpException {
  constructor(message = 'Access not allowed') {
    super(403, message, 'FORBIDDEN');
  }
}
