const mongoose = require('mongoose');
const User = require('../models/user');
const PractitionerProfile = require('../models/practitionerProfile');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const addTestPractitioner = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test practitioner user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson2@example.com',
      password: hashedPassword,
      role: 'practitioner'
    });

    const savedUser = await user.save();
    console.log('Created test practitioner user');

    // Create practitioner profile
    const profile = new PractitionerProfile({
      user: savedUser._id,
      bio: 'Dr. Sarah Johnson is a dedicated healthcare professional with over 15 years of experience in holistic medicine and integrative healthcare. She specializes in combining traditional medical practices with modern therapeutic approaches.',
      specialties: ['Holistic Medicine', 'Integrative Healthcare', 'Nutritional Therapy'],
      experience: 15,
      education: [
        'M.D. from Johns Hopkins University School of Medicine',
        'Fellowship in Integrative Medicine, University of Arizona',
        'Board Certified in Internal Medicine'
      ],
      availability: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00' }
      ],
      consultationFee: 150
    });

    await profile.save();
    console.log('Created test practitioner profile');

    console.log('Test data added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error adding test data:', error);
    process.exit(1);
  }
};

addTestPractitioner();
