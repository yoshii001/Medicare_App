import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUser } from 'react-icons/fi';

const TimeSlotModal = ({ slot, doctors, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    doctorId: '',
    doctorName: '',
    specialization: '',
    status: 'available',
    maxPatients: 1,
    notes: ''
  });

  useEffect(() => {
    if (slot) {
      setFormData({
        ...slot,
        date: slot.date ? slot.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [slot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find doctor details if doctorId is selected
    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    const slotData = {
      ...formData,
      doctorName: selectedDoctor ? selectedDoctor.name : '',
      specialization: selectedDoctor ? selectedDoctor.specialization : ''
    };
    
    onSave(slotData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {slot ? 'Edit Time Slot' : 'Add New Time Slot'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="form-label">
              Date *
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Start Time *
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="form-input pl-10"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">
                End Time *
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="form-input pl-10"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">
              Assign Doctor *
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="form-input pl-10"
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Duration (minutes)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-input"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Max Patients
              </label>
              <input
                type="number"
                name="maxPatients"
                value={formData.maxPatients}
                onChange={handleChange}
                min="1"
                max="10"
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="form-input"
              placeholder="Any special notes or instructions..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {slot ? 'Update Slot' : 'Add Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSlotModal;