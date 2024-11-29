import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AppointmentList = ({ isPractitioner = false }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const endpoint = isPractitioner 
        ? '/api/appointments/practitioner-appointments'
        : '/api/appointments/my-appointments';
      
      const response = await axios.get(`http://localhost:5002${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Fetched appointments:', response.data); // Debug log
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5002/api/appointments/${appointmentId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(
        `http://localhost:5002/api/appointments/${appointmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {isPractitioner ? 'Patient Appointments' : 'My Appointments'}
      </h2>
      
      {appointments.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-gray-600">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            // Safely access nested properties
            const practitionerName = appointment.practitioner?.name || 'Unknown Practitioner';
            const patientName = appointment.user?.name || 'Unknown Patient';
            const appointmentDate = appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date not set';
            const appointmentTime = appointment.time || 'Time not set';

            return (
              <div
                key={appointment.id || appointment._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {isPractitioner
                        ? `Patient: ${patientName}`
                        : `Practitioner: Dr. ${practitionerName}`}
                    </p>
                    <p className="text-gray-600">Date: {appointmentDate}</p>
                    <p className="text-gray-600">Time: {appointmentTime}</p>
                    <p className="text-gray-600">Reason: {appointment.reason || 'Regular consultation'}</p>
                    {appointment.notes && (
                      <p className="text-gray-600">Notes: {appointment.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-x-2">
                  {isPractitioner && appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id || appointment._id, 'confirmed')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id || appointment._id, 'cancelled')}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {!isPractitioner && appointment.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(appointment.id || appointment._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
