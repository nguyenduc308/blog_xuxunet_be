const UnauthorizationException = require('../exceptions/UnauthorizationException');

const UserModel = require('../models/User');

class UserController {
  async getMe(req, res, next) {
    const id = res.locals;

    const {password, ...user} = await UserModel.findById(id);

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
