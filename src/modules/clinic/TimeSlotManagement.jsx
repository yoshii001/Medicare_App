

import React, { useState, useEffect } from 'react';
import {
  getClinics,
  getDoctors,
  createTimeSlot,
  getTimeSlots,
  updateTimeSlot,
  deleteTimeSlot
} from '../../services/database.js';

import { FiPlus, FiEdit, FiTrash2, FiClock, FiCalendar, FiUser } from 'react-icons/fi';
import TimeSlotModal from './TimeSlotModal.jsx';

const TimeSlotManagement = () => {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClinic) {
      loadTimeSlots();
    }
  }, [selectedClinic]);

  const loadData = async () => {
    try {
      const [clinicsData, doctorsData] = await Promise.all([
        getClinics(),
        getDoctors()
      ]);

      if (clinicsData) {
        const clinicsList = Object.values(clinicsData);
        setClinics(clinicsList);
        if (clinicsList.length > 0) {
          setSelectedClinic(clinicsList[0].id);
        }
      }

      if (doctorsData) {
        setDoctors(Object.values(doctorsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    if (!selectedClinic) return;

    try {
      const slotsData = await getTimeSlots(selectedClinic);
      if (slotsData) {
        setTimeSlots(Object.values(slotsData));
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const handleAddSlot = () => {
    setSelectedSlot(null);
    setShowModal(true);
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await deleteTimeSlot(selectedClinic, slotId);
        loadTimeSlots();
      } catch (error) {
        console.error('Error deleting time slot:', error);
      }
    }
  };

  const handleSaveSlot = async (slotData) => {
    try {
      if (selectedSlot) {
        await updateTimeSlot(selectedClinic, selectedSlot.id, slotData);
      } else {
        await createTimeSlot(selectedClinic, slotData);
      }
      setShowModal(false);
      loadTimeSlots();
    } catch (error) {
      console.error('Error saving time slot:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'status-active';
      case 'booked':
        return 'status-pending';
      case 'blocked':
        return 'status-inactive';
      default:
        return 'status-active';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Slot Management</h1>
          <p className="text-gray-600">Manage clinic schedules and doctor availability</p>
        </div>
        <button
          onClick={handleAddSlot}
          className="btn-primary flex items-center space-x-2"
          disabled={!selectedClinic}
        >
          <FiPlus />
          <span>Add Time Slot</span>
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <label className="form-label">Select Clinic</label>
          <select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="form-input"
          >
            <option value="">Select a clinic</option>
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

        {selectedClinic && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {/*
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patients
                  </th>
                  */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(slot.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiClock className="mr-1" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-primary-600 text-sm" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {slot.doctorName || 'Unassigned'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {slot.specialization || 'General'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{slot.duration || 30} minutes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge ${getStatusColor(slot.status)}`}>
                        {slot.status || 'available'}
                      </span>
                    </td>
                    {/*
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {Array.isArray(slot.assignedPatients) && slot.assignedPatients.length > 0 ? (
                          slot.assignedPatients.map((p, i) => (
                            <div key={p.id || i} className="text-sm text-gray-900 flex items-center space-x-1">
                              <FiUser className="text-gray-400 text-xs" />
                              <span>{p.name}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No patients</span>
                        )}
                      </div>
                    </td>
                    */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSlot(slot)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors duration-200"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {timeSlots.length === 0 && (
              <div className="text-center py-12">
                <FiClock className="text-gray-300 text-5xl mx-auto mb-4" />
                <p className="text-gray-500">No time slots scheduled for this clinic.</p>
                <button
                  onClick={handleAddSlot}
                  className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
                >
                  Add your first time slot
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <TimeSlotModal
          slot={selectedSlot}
          doctors={doctors}
          onSave={handleSaveSlot}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TimeSlotManagement;
