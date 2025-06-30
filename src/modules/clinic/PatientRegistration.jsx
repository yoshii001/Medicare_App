import React, { useState, useEffect } from 'react';
import { createPatient, getPatients, getDoctors, updatePatient, deletePatient } from '../../services/database.js';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import PatientModal from './PatientModal.jsx';

const PatientRegistration = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const loadData = async () => {
    try {
      const [patientsData, doctorsData] = await Promise.all([
        getPatients(),
        getDoctors()
      ]);

      if (patientsData) {
        const patientsList = Object.values(patientsData);
        setPatients(patientsList);
        setFilteredPatients(patientsList);
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

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(patientId);
        loadData();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleSavePatient = async (patientData) => {
    try {
      if (selectedPatient) {
        await updatePatient(selectedPatient.id, patientData);
      } else {
        await createPatient(patientData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving patient:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-gray-600">Register new patients and manage existing records</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Register Patient</span>
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {patient.id?.slice(-8) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {patient.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FiPhone className="mr-2 text-gray-400" />
                      {patient.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.age || 'N/A'} years • {patient.gender || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Blood Group: {patient.bloodGroup || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.doctorName || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                      patient.status === 'active' ? 'status-active' :
                      patient.status === 'inactive' ? 'status-inactive' :
                      'status-pending'
                    }`}>
                      {patient.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
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

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
              </p>
              <button
                onClick={handleAddPatient}
                className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
              >
                Register your first patient
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <PatientModal
          patient={selectedPatient}
          doctors={doctors}
          onSave={handleSavePatient}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PatientRegistration;