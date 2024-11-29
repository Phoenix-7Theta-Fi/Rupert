const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PractitionerProfile = require('../models/practitionerProfile');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registration attempt:', { name, email, role }); // Debug log

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ name, email, password, role });
    await user.save();
    console.log('User created:', user._id); // Debug log

    // If registering as practitioner, create practitioner profile
    if (role === 'practitioner') {
      const profile = new PractitionerProfile({
        user: user._id,
        bio: `Dr. ${name} is a dedicated healthcare professional specializing in holistic medicine and integrative healthcare.`,
        specialties: ['General Ayurveda'],
        experience: 0,
        education: ['Medical Degree'],
        availability: [
          { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00' }
        ],
        consultationFee: 100
      });
      await profile.save();
      console.log('Practitioner profile created:', profile._id); // Debug log
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
