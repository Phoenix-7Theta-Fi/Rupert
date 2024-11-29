const express = require('express');
const router = express.Router();
const User = require('../models/user');
const PractitionerProfile = require('../models/practitionerProfile');
const authMiddleware = require('../middleware/auth');
const { isPractitioner } = require('../middleware/roles');

// Get all practitioners
router.get('/', async (req, res) => {
  try {
    const practitioners = await User.find({ role: 'practitioner' })
      .select('name email')
      .lean();

    const practitionerProfiles = await Promise.all(
      practitioners.map(async (practitioner) => {
        const profile = await PractitionerProfile.findOne({ user: practitioner._id });
        return {
          id: practitioner._id.toString(),
          name: practitioner.name,
          email: practitioner.email,
          ...(profile?._doc || {})
        };
      })
    );

    res.json(practitionerProfiles);
  } catch (error) {
    console.error('Error fetching practitioners:', error);
    res.status(500).json({ message: 'Error fetching practitioners' });
  }
});

// Update practitioner profile
router.put('/profile', authMiddleware, isPractitioner, async (req, res) => {
  try {
    console.log('Updating profile for user:', req.user.id);
    console.log('Profile data:', req.body);
    
    let profile = await PractitionerProfile.findOne({ user: req.user.id });
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, req.body);
      profile = await profile.save();
    } else {
      // Create new profile
      profile = await PractitionerProfile.create({
        user: req.user.id,
        ...req.body
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error updating practitioner profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get a single practitioner by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching practitioner with ID:', id);

    const user = await User.findById(id)
      .select('name email role')
      .lean();

    if (!user || user.role !== 'practitioner') {
      console.log('Practitioner not found for ID:', id);
      return res.status(404).json({ message: 'Practitioner not found' });
    }

    const profile = await PractitionerProfile.findOne({ user: user._id });
    console.log('Profile found:', !!profile);
    
    const practitioner = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      ...(profile?._doc || {})
    };

    res.json(practitioner);
  } catch (error) {
    console.error('Error fetching practitioner:', error);
    res.status(500).json({ message: 'Error fetching practitioner profile' });
  }
});

// Update practitioner profile by ID (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow admins or the practitioner themselves to update
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(id);
    if (!user || user.role !== 'practitioner') {
      return res.status(404).json({ message: 'Practitioner not found' });
    }

    let profile = await PractitionerProfile.findOne({ user: id });
    if (!profile) {
      profile = new PractitionerProfile({ user: id });
    }

    Object.assign(profile, req.body);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error('Error updating practitioner profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
