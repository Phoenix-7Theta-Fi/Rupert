import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppointmentForm from './appointments/AppointmentForm';

const PractitionerCard = ({ _id, name, specialization, experience, rating, image }) => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowAppointmentForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-green-700 font-medium mb-2">{specialization}</p>
        <div className="text-gray-600 mb-4">
          <p>Experience: {experience}</p>
          <p>Rating: {rating} ⭐</p>
        </div>
        <button 
          onClick={handleBookAppointment}
          className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors duration-300"
        >
          Book Appointment
        </button>
      </div>

      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <AppointmentForm 
              practitioner={{ _id, name, specialization }} 
              onClose={() => setShowAppointmentForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PractitionerCard;
