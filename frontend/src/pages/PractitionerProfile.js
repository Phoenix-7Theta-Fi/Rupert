import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PractitionerProfile = () => {
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching practitioner with ID:', id); // Debug log
        const response = await axios.get(`http://localhost:5002/api/practitioners/${id}`);
        console.log('Practitioner data:', response.data); // Debug log
        setPractitioner(response.data);
      } catch (error) {
        console.error('Error fetching practitioner:', error.response || error);
        setError(error.response?.data?.message || 'Failed to fetch practitioner profile');
        toast.error('Error fetching practitioner profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPractitioner();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600 mb-4">Practitioner Not Found</div>
          <Link 
            to="/practitioners"
            className="text-green-600 hover:text-green-700"
          >
            Return to Practitioners List
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (time) => {
    if (!time) return '';
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return time;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dr. {practitioner.name}
          </h1>

          {practitioner.bio && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">{practitioner.bio}</p>
            </div>
          )}

          {practitioner.specialties && practitioner.specialties.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {practitioner.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {practitioner.experience && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Experience</h2>
              <p className="text-gray-600">{practitioner.experience} years</p>
            </div>
          )}

          {practitioner.education && practitioner.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
              <ul className="space-y-2">
                {practitioner.education.map((edu, index) => (
                  <li key={index} className="text-gray-600">
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {practitioner.availability && practitioner.availability.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {practitioner.availability.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="font-medium text-gray-900">{slot.dayOfWeek}</div>
                    <div className="text-gray-600">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {practitioner.consultationFee && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Consultation Fee</h2>
              <p className="text-gray-600">${practitioner.consultationFee}</p>
            </div>
          )}

          <div className="mt-8">
            <Link
              to={`/book-appointment/${id}`}
              className="inline-flex justify-center items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 text-lg font-medium"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerProfile;
