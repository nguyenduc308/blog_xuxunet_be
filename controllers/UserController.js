const UnauthorizationException = require('../exceptions/UnauthorizationException');

const UserModel = require('../models/User');

class UserController {
  async getMe(req, res, next) {
    const decoded = res.locals;

    const {password, ...user} = await UserModel.findById(decoded.id).lean();

    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
        statusCode: 200,
      });
    } else {
      next(new UnauthorizationException());
    }
  }
}

module.exports = new UserController();
