import React, { useState, useEffect } from 'react';
import { getPatients, createPatient } from '../../services/database.js';
import { FiPlus, FiSearch, FiEdit, FiEye, FiUser } from 'react-icons/fi';
import PatientModal from './PatientModal.jsx';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
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

  const loadPatients = async () => {
    try {
      const patientsData = await getPatients();
      if (patientsData) {
        const patientsList = Object.values(patientsData);
        setPatients(patientsList);
        setFilteredPatients(patientsList);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
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

  const handleSavePatient = async (patientData) => {
    try {
      if (selectedPatient) {
        // Update existing patient (implement updatePatient in database.js)
        console.log('Update patient:', patientData);
      } else {
        await createPatient(patientData);
      }
      setShowModal(false);
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage and view patient information</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
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
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600" />
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
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.age || 'N/A'} years
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {patient.gender || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.doctorName || 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      patient.status === 'active' ? 'bg-green-100 text-green-800' :
                      patient.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                      >
                        <FiEdit />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200">
                        <FiEye />
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
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add your first patient
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <PatientModal
          patient={selectedPatient}
          onSave={handleSavePatient}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PatientList;