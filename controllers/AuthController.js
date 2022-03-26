const yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
const UserModel = require('../models/User');

class AuthController {
  async register(req, res, next) {
    const { first_name, last_name, email, password } = req.body;

    try {
      const userExisted = await UserModel.findOne({email});

      if (userExisted) {
        throw { code: 'ER_DUP_ENTRY' };
      }

      const user = await UserModel.create({
        first_name,
        last_name,
        email,
        password,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );

      res.set({
        'Set-Cookie': cookie.serialize('token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60,
          domain:  process.env.FE_DOMAIN
        }),
      });

      const {password: _, ...userRes} = user;

      return res.status(200).json({
        data: {
          user: userRes
        },
        statusCode: 200
      });
    } catch (err) {
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
        error: 'Server error'
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({email}).lean();

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Login failed',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: 'Login failed',
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );

      const {password: _, ...userRes} = user;

      res.set({
        'Set-Cookie': cookie.serialize('token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60,
          domain: process.env.FE_DOMAIN
        }),
      });

      return res.status(200).json({
        data: {
          user: userRes
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
      });
    }
  }

  async logout(req, res) {
    res.writeHead(200, {
      'Set-Cookie': `token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${process.env.FE_DOMAIN}`,
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
