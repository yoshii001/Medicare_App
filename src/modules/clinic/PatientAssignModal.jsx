/*
import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { getPatients } from '../../services/database'; // ✅ make sure this returns a valid object

const PatientAssignModal = ({ onAssign, onClose }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      if (data) {
        // Convert object to array if needed
        const patientsArray = Array.isArray(data) ? data : Object.values(data);
        setPatients(patientsArray);
      }
    };
    loadPatients();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Patient</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {patients.length === 0 ? (
            <p className="text-gray-500">No patients found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">{patient.email}</td>
                    <td className="p-2">
                      <button
                        onClick={() => onAssign(patient)}
                        className="btn-primary px-3 py-1 text-sm"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAssignModal;
*/

/*
import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { getPatients } from '../../services/database';

const PatientAssignModal = ({ onAssign, onClose, assignedPatients = [] }) => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(assignedPatients); // Store selected patient IDs

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      if (data) {
        const patientsArray = Array.isArray(data) ? data : Object.values(data);
        setPatients(patientsArray);
      }
    };
    loadPatients();
  }, []);

  const handleAdd = (patient) => {
    if (selected.length >= 5 || selected.find((p) => p.id === patient.id)) return;
    const updatedSelected = [...selected, patient];
    setSelected(updatedSelected);
    onAssign(patient); // Notify parent
  };

  const isDisabled = (patient) =>
    selected.length >= 5 || selected.find((p) => p.id === patient.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Patient (max 5)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {patients.length === 0 ? (
            <p className="text-gray-500">No patients found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">{patient.email}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleAdd(patient)}
                        disabled={isDisabled(patient)}
                        className={`px-3 py-1 text-sm rounded ${
                          isDisabled(patient)
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isDisabled(patient) ? 'Added' : 'Add'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected.length >= 5 && (
          <div className="p-4 text-sm text-red-600 text-center">
            Maximum of 5 patients selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAssignModal;
*/

/*
import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { getPatients } from '../../services/database';

const PatientAssignModal = ({ onAssign, onClose, assignedPatients = [] }) => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(assignedPatients);

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      if (data) {
        const patientsArray = Array.isArray(data) ? data : Object.values(data);
        setPatients(patientsArray);
      }
    };
    loadPatients();
  }, []);

  const handleAdd = (patient) => {
    if (selected.length >= 5 || selected.find((p) => p.id === patient.id)) return;

    const updatedSelected = [...selected, patient];
    setSelected(updatedSelected);
    onAssign(patient); // Notify parent
  };

  const isAlreadyAssigned = (patient) =>
    selected.some((p) => p.id === patient.id);

  const isMaxLimitReached = selected.length >= 5;

  // Filter out already selected patients from the list
  const availablePatients = patients.filter(
    (p) => !isAlreadyAssigned(p)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Patient (max 5)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="text-xl" />
          </button>
        </div>

       
        <div className="p-6">
          {availablePatients.length === 0 ? (
            <p className="text-gray-500">No more patients to assign.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availablePatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">{patient.email}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleAdd(patient)}
                        disabled={isMaxLimitReached}
                        className={`px-3 py-1 text-sm rounded ${
                          isMaxLimitReached
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        
        {isMaxLimitReached && (
          <div className="p-4 text-sm text-red-600 text-center">
            Maximum of 5 patients selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAssignModal;
*/

import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { getPatients } from '../../services/database';

const PatientAssignModal = ({ onAssign, onClose, assignedPatients = [] }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      if (data) {
        const patientsArray = Array.isArray(data) ? data : Object.values(data);
        setPatients(patientsArray);
      }
    };
    loadPatients();
  }, []);

  const isAlreadyAssigned = (patient) =>
    assignedPatients.some((p) => p.id === patient.id);

  const isMaxLimitReached = assignedPatients.length >= 5;

  const availablePatients = patients.filter(
    (p) => !isAlreadyAssigned(p)
  );

  const handleAdd = (patient) => {
    if (isMaxLimitReached || isAlreadyAssigned(patient)) return;
    onAssign(patient); // Notify parent to update assigned list
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Assign Patient (max 5)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Patient Table */}
        <div className="p-6">
          {availablePatients.length === 0 ? (
            <p className="text-gray-500">No more patients to assign.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availablePatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">{patient.email}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleAdd(patient)}
                        disabled={isMaxLimitReached}
                        className={`px-3 py-1 text-sm rounded ${
                          isMaxLimitReached
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Limit Warning */}
        {isMaxLimitReached && (
          <div className="p-4 text-sm text-red-600 text-center">
            Maximum of 5 patients selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAssignModal;
