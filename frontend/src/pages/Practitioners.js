import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Practitioners = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5002/api/practitioners');
        console.log('Practitioners data:', response.data); // Debug log
        setPractitioners(response.data);
      } catch (error) {
        console.error('Error fetching practitioners:', error);
        setError('Failed to fetch practitioners. Please try again later.');
        toast.error('Error fetching practitioners');
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioners();
  }, []);

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
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!practitioners || practitioners.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold mb-2">No Practitioners Found</p>
          <p>There are currently no practitioners available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Practitioners</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practitioners.map((practitioner) => (
          <div
            key={practitioner._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Dr. {practitioner.name}
              </h2>
              {practitioner.specialties && practitioner.specialties.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {practitioner.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {practitioner.bio && (
                <p className="text-gray-600 mb-4 line-clamp-3">{practitioner.bio}</p>
              )}
              <div className="flex flex-col space-y-2">
                <Link
                  to={`/practitioners/${practitioner.id}`}
                  className="inline-flex justify-center items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors duration-300"
                >
                  View Profile
                </Link>
                <Link
                  to={`/book-appointment/${practitioner.id}`}
                  className="inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practitioners;
