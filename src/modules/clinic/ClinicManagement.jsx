

import React, { useState, useEffect } from 'react';
import { getClinics, createClinic, updateClinic, deleteClinic } from '../../services/database';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const ClinicManagement = () => {
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', contact: '' });
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    const data = await getClinics();
    if (data) setClinics(Object.values(data));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await createClinic(form);
    setForm({ name: '', address: '', contact: '' });
    loadClinics();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await updateClinic(selectedClinic.id, form);
    setShowEditModal(false);
    setSelectedClinic(null);
    setForm({ name: '', address: '', contact: '' });
    loadClinics();
  };

  const handleEdit = (clinic) => {
    setSelectedClinic(clinic);
    setForm({ name: clinic.name, address: clinic.address, contact: clinic.contact });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this clinic?')) {
      await deleteClinic(id);
      loadClinics();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Management</h1>
          <p className="text-gray-600">Manage clinic locations and details</p>
        </div>
      </div>

      {/* Add Clinic Form */}
      <div className="card p-6 space-y-4">
        <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Clinic Name"
            value={form.name}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            className="form-input"
            required
          />
          <button type="submit" className="btn-primary col-span-full md:col-auto">
            Add Clinic
          </button>
        </form>

        {/* Clinic Table */}
        <table className="w-full table-auto mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Address</th>
              <th className="text-left p-2">Contact</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map(clinic => (
              <tr key={clinic.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{clinic.name}</td>
                <td className="p-2">{clinic.address}</td>
                <td className="p-2">{clinic.contact}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(clinic)} className="btn-sm text-blue-600">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(clinic.id)} className="btn-sm text-red-600">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {clinics.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">No clinics found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <FiX className="text-xl" />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Clinic</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Clinic Name"
                value={form.name}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={form.contact}
                onChange={handleChange}
                className="form-input w-full"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicManagement;
