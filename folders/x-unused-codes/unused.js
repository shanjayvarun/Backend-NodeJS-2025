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
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '24h' });
//     return sendSuccess(res, { accessToken: token }, 'User logged In')
//   } catch (error) {
//     return sendError(res, { statusCode: 500, details: error.message }, 'Internal server error');
//   }
// };

//Unsed Codes in app.js
// const { sendError } = require('./folders/middlewares/response.middleware');
// const session = require('express-session');

// Set up session for passport
// app.use(session({
//     secret: process.env.JWT_ACCESS_SECRET,
//     resave: false,
//     saveUninitialized: true
// }));

// app.get('/protected', (req, res) => {
//     if (!req.user) {
//         return sendError(res, { statusCode: 401, details: '' }, 'Unauthorized access');
//     }
//     return sendSuccess(res, { message: 'This is a protected route', user: req.user }, '');
// });

// Initialize Passport.js

// app.use(passport.session());

//Code to create a JWT_ACCESS_SECRET
//const secretKey = crypto.randomBytes(64).toString('hex');