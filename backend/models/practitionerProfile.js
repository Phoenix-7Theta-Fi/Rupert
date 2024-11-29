const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const practitionerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    required: true
  },
  specialties: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true
  },
  education: [{
    type: String,
    required: true
  }],
  availability: [availabilitySlotSchema],
  consultationFee: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const PractitionerProfile = mongoose.model('PractitionerProfile', practitionerProfileSchema);

module.exports = PractitionerProfile;
