const { UnauthorizationException } = require('../exceptions/UnauthorizationException');

const db = require('../database');

const { user: Model } = db.models;

class UserController {
  async getMe(req, res, next) {
    const id = res.locals;

    const user = await Model.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });

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
