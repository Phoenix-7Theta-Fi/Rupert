import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookAppointment = () => {
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/practitioners/${id}`);
        setPractitioner(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching practitioner:', error);
        toast.error('Error fetching practitioner details');
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, [id]);

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let current = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    while (current < end) {
      slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      current = new Date(current.getTime() + 30 * 60000); // Add 30 minutes
    }
    
    return slots;
  };

  const handleDateChange = (e) => {
    const selectedDay = new Date(e.target.value).toLocaleDateString('en-US', { weekday: 'long' });
    setSelectedDate(e.target.value);
    
    // Find available time slots for the selected day
    const daySchedule = practitioner?.availability?.find(
      slot => slot.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()
    );

    if (daySchedule) {
      const slots = generateTimeSlots(daySchedule.startTime, daySchedule.endTime);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
      toast.warning('No availability for selected day');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      const appointmentData = {
        practitionerId: id,
        date: selectedDate,
        time: selectedTime,
      };

      await axios.post('http://localhost:5002/api/appointments', appointmentData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Error booking appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Practitioner not found</div>
      </div>
    );
  }

  // Get next 30 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Book Appointment with Dr. {practitioner.name}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Choose a date</option>
              {getAvailableDates().map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Select Time
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              required
              disabled={!selectedDate || availableSlots.length === 0}
            >
              <option value="">Choose a time</option>
              {availableSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Consultation Fee: ${practitioner.consultationFee}
            </p>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
