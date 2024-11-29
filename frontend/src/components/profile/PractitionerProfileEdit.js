import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PractitionerProfileEdit = () => {
  const [profile, setProfile] = useState({
    bio: '',
    specialties: [''],
    experience: '',
    education: [{ degree: '', institution: '', year: '' }],
    availability: [
      { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' }
    ],
    consultationFee: ''
  });

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/practitioners/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtiesChange = (index, value) => {
    const newSpecialties = [...profile.specialties];
    newSpecialties[index] = value;
    setProfile(prev => ({
      ...prev,
      specialties: newSpecialties
    }));
  };

  const addSpecialty = () => {
    setProfile(prev => ({
      ...prev,
      specialties: [...prev.specialties, '']
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...profile.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setProfile(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...profile.availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value
    };
    setProfile(prev => ({
      ...prev,
      availability: newAvailability
    }));
  };

  const addAvailability = () => {
    setProfile(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' }
      ]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5002/api/practitioners/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="4"
            maxLength="500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {profile.bio.length}/500 characters
          </p>
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialties
          </label>
          {profile.specialties.map((specialty, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={specialty}
                onChange={(e) => handleSpecialtiesChange(index, e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecialty}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            + Add Specialty
          </button>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            min="0"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education
          </label>
          {profile.education.map((edu, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                placeholder="Degree"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                placeholder="Institution"
                className="p-2 border rounded-md"
              />
              <input
                type="number"
                value={edu.year}
                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                placeholder="Year"
                className="p-2 border rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            + Add Education
          </button>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          {profile.availability.map((slot, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <select
                value={slot.dayOfWeek}
                onChange={(e) => handleAvailabilityChange(index, 'dayOfWeek', e.target.value)}
                className="p-2 border rounded-md"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                className="p-2 border rounded-md"
              />
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                className="p-2 border rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addAvailability}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            + Add Availability Slot
          </button>
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultation Fee (₹)
          </label>
          <input
            type="number"
            name="consultationFee"
            value={profile.consultationFee}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default PractitionerProfileEdit;
