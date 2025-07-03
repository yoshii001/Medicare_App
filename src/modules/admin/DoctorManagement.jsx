/*
import React, { useState, useEffect } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../services/database.js';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiSearch } from 'react-icons/fi';
import DoctorModal from './DoctorModal.jsx';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);

  const loadDoctors = async () => {
    try {
      const doctorsData = await getDoctors();
      if (doctorsData) {
        const doctorsList = Object.values(doctorsData);
        setDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctorId);
        loadDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleSaveDoctor = async (doctorData) => {
    try {
      if (selectedDoctor) {
        await updateDoctor(selectedDoctor.id, doctorData);
      } else {
        await createDoctor(doctorData);
      }
      setShowModal(false);
      loadDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Add, edit, and manage doctors in the system</p>
        </div>
        <button
          onClick={handleAddDoctor}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Doctor</span>
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
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
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
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
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {doctor.id?.slice(-8) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {doctor.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FiPhone className="mr-2 text-gray-400" />
                      {doctor.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialization}</div>
                    <div className="text-sm text-gray-500">{doctor.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.experience} years</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                      doctor.status === 'active' ? 'status-active' :
                      doctor.status === 'inactive' ? 'status-inactive' :
                      'status-pending'
                    }`}>
                      {doctor.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
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

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No doctors found matching your search.' : 'No doctors registered yet.'}
              </p>
              <button
                onClick={handleAddDoctor}
                className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
              >
                Add your first doctor
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <DoctorModal
          doctor={selectedDoctor}
          onSave={handleSaveDoctor}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorManagement;
*/

import React, { useState, useEffect } from 'react';
import {getDoctors, createDoctor, updateDoctor, deleteDoctor, createUser} from '../../services/database.js';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiSearch } from 'react-icons/fi';
import DoctorModal from './DoctorModal.jsx';


const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  // useEffect(() => {
  //   if (searchTerm) {
  //     const filtered = doctors.filter(doctor =>
  //       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredDoctors(filtered);
  //   } else {
  //     setFilteredDoctors(doctors);
  //   }
  // }, [searchTerm, doctors]);
  useEffect(() => {
    if (searchTerm) {
      const filtered = doctors.filter(doctor =>
          (doctor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (doctor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (doctor.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);


  // const loadDoctors = async () => {
  //   try {
  //     const doctorsData = await getDoctors();
  //     if (doctorsData) {
  //       const doctorsList = Object.values(doctorsData);
  //       setDoctors(doctorsList);
  //       setFilteredDoctors(doctorsList);
  //     }
  //   } catch (error) {
  //     console.error('Error loading doctors:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadDoctors = async () => {
    try {
      const doctorsData = await getDoctors();
      if (doctorsData && typeof doctorsData === 'object') {
        const doctorsList = Object.entries(doctorsData).map(([key, doctor]) => ({
          ...doctor,
          id: doctor.id || doctor.uid || key,
        }));
        setDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
      } else {
        setDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]); // fallback
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };


  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctorId);
        await loadDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  // const handleSaveDoctor = async (doctorData) => {
  //   try {
  //     if (selectedDoctor) {
  //       await updateDoctor(selectedDoctor.id, doctorData);
  //     } else {
  //       await createDoctor(doctorData);
  //     }
  //     setShowModal(false);
  //     loadDoctors();
  //   } catch (error) {
  //     console.error('Error saving doctor:', error);
  //   }
  // };



  const handleSaveDoctor = async (doctorData) => {
    setLoading(true);
    try {
      if (selectedDoctor) {
        await updateDoctor(selectedDoctor.id, doctorData);
      } else {
        await createDoctor(doctorData);
      }
       setShowModal(false);
       await loadDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error.message);
    }finally {
      setLoading(false); // hide spinner
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
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Add, edit, and manage doctors in the system</p>
        </div>
        <button
          onClick={handleAddDoctor}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Doctor</span>
        </button>
      </div>

      <div className="card">
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
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
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
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
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {doctor.id?.slice(-8) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {doctor.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FiPhone className="mr-2 text-gray-400" />
                      {doctor.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialization}</div>
                    <div className="text-sm text-gray-500">{doctor.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.experience} years</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge ${
                      doctor.status === 'active' ? 'status-active' :
                      doctor.status === 'inactive' ? 'status-inactive' :
                      'status-pending'
                    }`}>
                      {doctor.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors duration-200"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/*{filteredDoctors.map((doctor, index) => (*/}
              {/*    <tr key={doctor.id || doctor.uid || index} className="hover:bg-gray-50 transition-colors duration-200">*/}
              {/*      <td className="px-4 py-3">{doctor.name}</td>*/}
              {/*      <td className="px-4 py-3">{doctor.email}</td>*/}
              {/*      <td className="px-4 py-3">{doctor.phone}</td>*/}
              {/*      <td className="px-4 py-3">{doctor.specialization}</td>*/}
              {/*      <td className="px-4 py-3">{doctor.department}</td>*/}
              {/*      <td className="px-4 py-3">{doctor.experience} yrs</td>*/}
              {/*      <td className="px-4 py-3">{doctor.qualification}</td>*/}
              {/*      <td className="px-4 py-3 space-x-2">*/}
              {/*        <button*/}
              {/*            onClick={() => handleEditDoctor(doctor)}*/}
              {/*            className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"*/}
              {/*        >*/}
              {/*          <FiEdit />*/}
              {/*        </button>*/}
              {/*        <button*/}
              {/*            onClick={() => handleDeleteDoctor(doctor.id)}*/}
              {/*            className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50 transition-colors duration-200"*/}
              {/*        >*/}
              {/*          <FiTrash2 />*/}
              {/*        </button>*/}
              {/*      </td>*/}
              {/*    </tr>*/}
              {/*))}*/}

            </tbody>
          </table>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <FiUser className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No doctors found matching your search.' : 'No doctors registered yet.'}
              </p>
              <button
                onClick={handleAddDoctor}
                className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
              >
                Add your first doctor
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <DoctorModal
          doctor={selectedDoctor}
          onSave={handleSaveDoctor}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorManagement;