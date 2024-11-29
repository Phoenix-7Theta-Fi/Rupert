const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and populate practitioner profile if exists
    const user = await User.findById(decoded.id).populate('practitionerProfile');
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Add user and role to request
    req.user = {
      id: user._id,
      role: user.role,
      practitionerProfile: user.practitionerProfile?._id
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
