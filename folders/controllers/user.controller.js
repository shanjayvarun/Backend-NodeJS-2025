const userService = require('../services/user.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
// const crypto = require('crypto');
const { sendSuccess, sendError } = require('../middlewares/response.middleware');
const { validationResult } = require('express-validator');

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', { failureRedirect: '/login' }, async (error, user, info) => {
    await validateInputs(req, res)
    if (error) {
      return sendError(res, { statusCode: 500, details: error.message }, 'Internal server error');
    }
    if (!user) {
      return sendError(res, { statusCode: 404, details: info.message }, 'User not found');
    }
    const token = jwt.sign({ id: user._id, role: user.roleType }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return sendSuccess(res, { accessToken: token }, 'User logged in successfully');
  })(req, res, next);
};

exports.createUser = async (req, res) => {
  try {
    // await validateInputs(req, res)
    const hashedPassword = await hashPassword(req.body.password)
    req.body.password = hashedPassword
    const user = await userService.saveUser(req.body);
    return sendSuccess(res, user, 'User registered successfully');
  } catch (error) {
    if (error.code == 11000) {
      return sendError(res, res.status(409), 'Email already exists');
    }
    return sendError(res, res.status(400), 'Failed to register user');
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

//Helper functions
async function hashPassword(password) {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password", error);
  }
}

function validateInputs(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, { statusCode: 400, details: errors.array() }, 'Invalid inputs');
  }
}

//Another Way of Login Function
// exports.loginUser = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return sendError(res, { statusCode: 400, details: errors.array() }, 'Invalid inputs');
//     }
//     const user = await userService.findOneByEmail(req.body.email);
//     if (!user) {
//       return sendError(res, { statusCode: 404, details: 'User not found' }, 'User not found');
//     }
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return sendError(res, { statusCode: 401, details: 'Invalid email or password' }, 'Invalid credentials');
//     }
//     const token = jwt.sign({ id: user._id, role: user.roleType }, process.env.JWT_SECRET, { expiresIn: '24h' });
//     return sendSuccess(res, { accessToken: token }, 'User logged In')
//   } catch (error) {
//     return sendError(res, { statusCode: 500, details: error.message }, 'Internal server error');
//   }
// };
