const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.js');
const Admin = require('../models/adminSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');

// Middleware to check if the user is authenticated
const auth = asyncHandler(async (req, res, next) => {
  let token;
  
  // The token is sent in the "Authorization" header as "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      // Verify the token using the secret key from your .env file
      // We will add JWT_SECRET to your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user based on the ID and role in the token
      let user;
      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select("-password");
      } else if (decoded.role === 'student') {
        user = await Student.findById(decoded.id).select("-password");
      } else if (decoded.role === 'teacher') {
        user = await Teacher.findById(decoded.id).select("-password");
      }

      if (!user) {
        throw new ApiError(401, "Invalid token - user not found");
      }
      
      // Attach the user object to the request (`req.user`)
      // so all our controllers can access it
      req.user = user;
      next(); // Move to the next step
    } catch (error) {
      throw new ApiError(401, error?.message || "Not authorized, token failed");
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }
});

// Middleware to restrict routes to specific roles (e.g., only 'Admin')
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  };
};

module.exports = { auth, restrictTo };