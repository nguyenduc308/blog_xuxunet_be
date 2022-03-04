const UnauthorizationException = require("../exceptions/UnauthorizationException");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

exports.authenticate = async (req, res, next) => {
  try {
    const cookieEncode = req.headers.cookie;

    if (!cookieEncode) {
      return next(new UnauthorizationException());
    }

    const cookieData = cookie.parse(cookieEncode);
    let token = cookieData && cookieData.token;

    if (!token) {
      return next(new UnauthorizationException());
    }

    token = token.replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return next(new UnauthorizationException());
    }
    res.locals = decode.id;

    return next();
  } catch (err) {
    console.log(err);
    return next(new UnauthorizationException());
  }
};

exports.authorization = () => () => {};
