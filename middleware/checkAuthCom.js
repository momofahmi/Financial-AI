const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    try {
      //jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/'); // Redirect to home page if authenticated
    } catch (err) {
      console.log('Invalid token:', err);
      // Invalid token, proceed to login page
    }
  }
  next();
};