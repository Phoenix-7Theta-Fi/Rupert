const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const auth = require('../middleware/auth');

// Get all appointments for a user
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('practitioner', 'name email')
      .sort({ date: 'asc', time: 'asc' });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get all appointments for a practitioner
router.get('/practitioner-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ practitioner: req.user.id })
      .populate('user', 'name email')
      .sort({ date: 'asc', time: 'asc' });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching practitioner appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Create a new appointment
router.post('/', auth, async (req, res) => {
  try {
    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      practitioner: req.body.practitionerId,
      date: new Date(req.body.date),
      time: req.body.time,
      status: { $nin: ['cancelled'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      user: req.user.id,
      practitioner: req.body.practitionerId,
      date: req.body.date,
      time: req.body.time,
      reason: req.body.reason || 'Regular consultation',
      notes: req.body.notes
    });

    const savedAppointment = await appointment.save();
    
    // Populate practitioner details before sending response
    const populatedAppointment = await savedAppointment
      .populate('practitioner', 'name email')
      .execPopulate();

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: 'Error creating appointment' });
  }
});

// Update appointment status
router.patch('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow the practitioner or the user to update the appointment
    if (appointment.practitioner.toString() !== req.user.id && 
        appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Update allowed fields
    if (req.body.status) appointment.status = req.body.status;
    if (req.body.notes) appointment.notes = req.body.notes;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ message: 'Error updating appointment' });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow the user who booked the appointment to cancel it
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(400).json({ message: 'Error cancelling appointment' });
  }
});

module.exports = router;
