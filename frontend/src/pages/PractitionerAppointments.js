import React from 'react';
import AppointmentList from '../components/appointments/AppointmentList';

const PractitionerAppointments = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AppointmentList isPractitioner={true} />
    </div>
  );
};

export default PractitionerAppointments;
