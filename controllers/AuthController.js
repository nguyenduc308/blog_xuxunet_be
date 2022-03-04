const yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie');

const sequelize = require('../database');

const { user: model } = sequelize.models;

class AuthController {
  async register(req, res, next) {
    const { first_name, last_name, email, password } = req.body;

    try {
      const userExisted = await model.findOne({ where: { email } });

      if (userExisted) {
        throw { code: 'ER_DUP_ENTRY' };
      }

      const user = await model.create({
        first_name,
        last_name,
        email,
        password,
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );

      res.writeHead(200, {
        'Set-Cookie': cookie.serialize('token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60,
          domain:  process.env.FE_DOMAIN
        }),
      });

      return res.end();
    } catch (err) {
      console.log(err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          field: {
            name: 'body.email',
          },
          error: 'Email already existed',
        });
      }

      return res.status(500).json({
        success: false,
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await model.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Login failed',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Login failed',
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );

      res.writeHead(200, {
        'Set-Cookie': cookie.serialize('token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60,
          domain: process.env.FE_DOMAIN
        }),
      });

      return res.end();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
      });
    }
  }

  async logout(req, res) {
    res.writeHead(200, {
      'Set-Cookie': `token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    });

    return res.end();
  }

  get registerSchema() {
    return yup.object({
      body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().required().min(6),
        first_name: yup.string().required(),
        last_name: yup.string().required(),
      }),
    });
  }

  get loginSchema() {
    return yup.object({
      body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().required(),
      }),
    });
  }
}

module.exports = new AuthController();
