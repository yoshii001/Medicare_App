import  { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getPatients, updatePatient, deletePatient, getPatientMedicalHistory, addMedicalHistory, updateMedicalHistory, deleteMedicalHistory } from '../../services/database.js';
import { FiSearch, FiEdit, FiTrash2, FiUser, FiPlus, FiFileText } from 'react-icons/fi';
import MedicalHistoryModal from './MedicalHistoryModal.jsx';

const PatientManagement = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
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
        // Filter patients assigned to current doctor
        const doctorPatients = Object.values(patientsData).filter(p => p.doctorId === currentUser?.uid);
        setPatients(doctorPatients);
        setFilteredPatients(doctorPatients);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(patientId);
        loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleAddMedicalHistory = (patient) => {
    setSelectedPatient(patient);
    setSelectedHistory(null);
    setShowHistoryModal(true);
  };

  const handleEditMedicalHistory = (patient, history) => {
    setSelectedPatient(patient);
    setSelectedHistory(history);
    setShowHistoryModal(true);
  };

  const handleSaveMedicalHistory = async (historyData) => {
    try {
      if (selectedHistory) {
        await updateMedicalHistory(selectedPatient.id, selectedHistory.id, historyData);
      } else {
        await addMedicalHistory(selectedPatient.id, historyData);
      }
      setShowHistoryModal(false);
      loadPatients();
    } catch (error) {
      console.error('Error saving medical history:', error);
    }
  };

  const handleDeleteMedicalHistory = async (patientId, historyId) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await deleteMedicalHistory(patientId, historyId);
        loadPatients();
      } catch (error) {
        console.error('Error deleting medical history:', error);
      }
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
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600">Manage your assigned patients and their medical history</p>
        </div>
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

        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.email} • {patient.phone}</p>
                    <p className="text-sm text-gray-500">
                      {patient.age} years • {patient.gender} • Blood Group: {patient.bloodGroup || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddMedicalHistory(patient)}
                    className="btn-primary flex items-center space-x-1 text-sm"
                  >
                    <FiPlus className="text-sm" />
                    <span>Add Record</span>
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="text-error-600 hover:text-error-900 p-2 rounded hover:bg-error-50 transition-colors duration-200"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {patient.medicalHistory && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <FiFileText className="mr-2" />
                    Medical History
                  </h4>
                  <div className="space-y-3">
                    {Object.values(patient.medicalHistory).map((history) => (
                      <div key={history.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{history.diagnosis}</h5>
                              <span className="text-sm text-gray-500">
                                {new Date(history.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{history.symptoms}</p>
                            <p className="text-sm text-gray-700"><strong>Treatment:</strong> {history.treatment}</p>
                            {history.prescription && (
                              <p className="text-sm text-gray-700"><strong>Prescription:</strong> {history.prescription}</p>
                            )}
                            {history.notes && (
                              <p className="text-sm text-gray-600 mt-2"><strong>Notes:</strong> {history.notes}</p>
                            )}
                          </div>
                          <div className="flex space-x-1 ml-4">
                            <button
                              onClick={() => handleEditMedicalHistory(patient, history)}
                              className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                            >
                              <FiEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicalHistory(patient.id, history.id)}
                              className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors duration-200"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No patients found matching your search.' : 'No patients assigned to you yet.'}
            </p>
          </div>
        )}
      </div>

      {showHistoryModal && (
        <MedicalHistoryModal
          patient={selectedPatient}
          history={selectedHistory}
          onSave={handleSaveMedicalHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
};

export default PatientManagement;