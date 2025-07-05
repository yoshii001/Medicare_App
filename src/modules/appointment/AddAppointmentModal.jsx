

// AddAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import {
  getPatients,
  getClinics,
  getTimeSlots,
  updateTimeSlot,
} from '../../services/database';

const AddAppointmentModal = ({ onClose, onSave, existingData = null }) => {
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [slots, setSlots] = useState([]);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    clinicId: '',
    clinicName: '',
    timeSlotId: '',
    date: '',
    time: '',
    doctorName: '',
    status: 'pending',
  });

  const previousSlotIdRef = useState(existingData?.timeSlotId || null)[0];
  const previousClinicIdRef = useState(existingData?.clinicId || null)[0];

  useEffect(() => {
    const fetchData = async () => {
      const [patientsData, clinicsData] = await Promise.all([
        getPatients(),
        getClinics(),
      ]);
      if (patientsData) setPatients(Object.values(patientsData));
      if (clinicsData) setClinics(Object.values(clinicsData));

      if (existingData) {
        setFormData({ ...existingData });
        await loadTimeSlots(existingData.clinicId, existingData.timeSlotId);
      }
    };
    fetchData();
  }, [existingData]);

  const handlePatientSelect = (e) => {
    const selectedId = e.target.value;
    const selectedPatient = patients.find((p) => p.id === selectedId);
    if (selectedPatient) {
      setFormData((prev) => ({
        ...prev,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
      }));
    }
  };

  const handleClinicSelect = async (e) => {
    const selectedClinicId = e.target.value;
    const selectedClinic = clinics.find((c) => c.id === selectedClinicId);
    if (!selectedClinic) return;

    setFormData((prev) => ({
      ...prev,
      clinicId: selectedClinic.id,
      clinicName: selectedClinic.name,
      timeSlotId: '',
      date: '',
      time: '',
      doctorName: '',
    }));

    await loadTimeSlots(selectedClinic.id);
  };

  const loadTimeSlots = async (clinicId, includeSlotId = null) => {
    const slotsData = await getTimeSlots(clinicId);
    if (slotsData) {
      const allSlots = Object.values(slotsData);
      const filtered = allSlots.filter(
        (s) => s.status === 'available' || s.id === includeSlotId
      );
      setSlots(filtered);
    } else {
      setSlots([]);
    }
  };

  const handleSlotSelect = (e) => {
    const selectedSlot = slots.find((s) => s.id === e.target.value);
    if (selectedSlot) {
      setFormData((prev) => ({
        ...prev,
        timeSlotId: selectedSlot.id,
        date: selectedSlot.date,
        time: selectedSlot.startTime,
        doctorName: selectedSlot.doctorName,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      existingData &&
      previousSlotIdRef !== formData.timeSlotId &&
      previousClinicIdRef
    ) {
      await updateTimeSlot(previousClinicIdRef, previousSlotIdRef, {
        status: 'available',
      });
    }

    await onSave(formData);

    if (formData.clinicId && formData.timeSlotId) {
      await updateTimeSlot(formData.clinicId, formData.timeSlotId, {
        status: 'booked',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {existingData ? 'Edit Appointment' : 'Book Appointment'}
          </h2>
          <button onClick={onClose}>
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select className="form-input w-full" onChange={handlePatientSelect} value={formData.patientId} required>
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input type="text" className="form-input w-full" value={formData.patientName} readOnly placeholder="Patient Name" />

          <select className="form-input w-full" onChange={handleClinicSelect} value={formData.clinicId} required>
            <option value="">Select Clinic</option>
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select className="form-input w-full" onChange={handleSlotSelect} value={formData.timeSlotId} required>
            <option value="">Select Time Slot</option>
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.date} | {slot.startTime} - {slot.endTime} | {slot.doctorName}
              </option>
            ))}
          </select>

          <input type="text" className="form-input w-full" value={formData.date} readOnly placeholder="Date" />
          <input type="text" className="form-input w-full" value={formData.time} readOnly placeholder="Time" />
          <input type="text" className="form-input w-full" value={formData.doctorName} readOnly placeholder="Doctor Name" />
          <input type="text" className="form-input w-full" value={formData.clinicName} readOnly placeholder="Clinic Name" />

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn-secondary bg-gray-200 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="btn-primary bg-blue-600 text-white px-4 py-2 rounded">
              {existingData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;

