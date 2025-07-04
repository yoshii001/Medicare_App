

// time slot modal
import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import PatientAssignModal from './PatientAssignModal'; //  Adjust path if needed

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
    notes: '',
    assignedPatients: []
  });

  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    if (slot) {
      setFormData({
        ...slot,
        date: slot.date ? slot.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [slot]);

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const diff = endMin - startMin;
    return diff > 0 ? diff : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...formData, [name]: value };

    if (name === 'startTime' || name === 'endTime') {
      updated.duration = calculateDuration(
        name === 'startTime' ? value : formData.startTime,
        name === 'endTime' ? value : formData.endTime
      );
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    const slotData = {
      ...formData,
      doctorName: selectedDoctor?.name || '',
      specialization: selectedDoctor?.specialization || '',
    };
    onSave(slotData);
  };

  const handleAssignPatient = (patient) => {
    setFormData((prev) => {
      if (
        prev.assignedPatients.find((p) => p.id === patient.id) ||
        prev.assignedPatients.length >= 5
      ) {
        return prev;
      }
      return {
        ...prev,
        assignedPatients: [...prev.assignedPatients, patient]
      };
    });
    setShowAssignModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {slot ? 'Edit Time Slot' : 'Add New Time Slot'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="form-label">Date *</label>
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

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Auto-calculated duration */}
          <div>
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              readOnly
              className="form-input bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Doctor Select */}
          <div>
            <label className="form-label">Assign Doctor *</label>
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

          {/* Status */}
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="available">Available</option>
              {/* Future: Booked / Blocked */}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="form-input"
              placeholder="Any special notes or instructions..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {slot ? 'Update Slot' : 'Add Slot'}
            </button>
          </div>
        </form>

        {/* Optional Patient Assignment Modal */}
        {showAssignModal && (
          <PatientAssignModal
            onAssign={handleAssignPatient}
            onClose={() => setShowAssignModal(false)}
            assignedPatients={formData.assignedPatients}
          />
        )}
      </div>
    </div>
  );
};

export default TimeSlotModal;
