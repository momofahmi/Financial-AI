const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded:', decoded.id);
      return res.redirect('/dashboard'); // Redirect to home page if authenticated
    } catch (err) {
      console.log('Invalid token:', err);
      // Invalid token, proceed to login page
    }
  }
  else {
    // No token, proceed to login page
    console.log('No token:', token);
  }
  console.log('Got here');
  next();
};