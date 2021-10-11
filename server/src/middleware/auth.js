const jwt = require('jsonwebtoken');
const config = require('config');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

const User = require('../models/users/User');
const Wallet = require('../models/wallet');
const { walletOptions } = require('../local/local-copy');

exports.protect = asyncHandler(async (req, res, next) => {
  if (!process.env.PEER) {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } //else if(req.cookies.token) {
    //token = req.cookies.token;
    //}

    //Make sure token exists
    if (!token) {
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }

    //Verify token
    try {
      const decoded = jwt.verify(token, config.get('JWT_SECRET'));

      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      return next(
        new ErrorResponse('Not authorized to access this route', 401)
      );
    }
  } else {
    req.user = {
      keys: [walletOptions.priv, walletOptions.pub],
      addressBook: JSON.stringify(walletOptions.addressBook),
      role: 'peer',
    };

    next();
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
