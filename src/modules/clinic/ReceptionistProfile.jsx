import React, { useEffect, useState } from 'react';
import { getRecipients } from '../../services/database.js';
import { useParams } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiTag, FiCheckCircle } from 'react-icons/fi';

const ReceptionistProfile = () => {
  const { email } = useParams(); // From route param: /receptionist/:email
  const [receptionist, setReceptionist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceptionist = async () => {
      try {
        const all = await getRecipients();
        if (all) {
          const found = Object.values(all).find(r => r.email === decodeURIComponent(email));
          setReceptionist(found || null);
        }
      } catch (err) {
        console.error('Error loading receptionist profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceptionist();
  }, [email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!receptionist) {
    return (
      <div className="text-center py-16">
        <FiUser className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Receptionist Not Found</h2>
        <p className="text-gray-500 mt-2">No receptionist found with the email: <strong>{email}</strong></p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
          <FiUser className="text-primary-600 text-3xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{receptionist.name}</h2>
          <p className="text-sm text-gray-500">ID: {receptionist.id?.slice(-8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProfileField icon={FiMail} label="Email" value={receptionist.email} />
        <ProfileField icon={FiPhone} label="Phone" value={receptionist.phone || 'N/A'} />
        <ProfileField icon={FiTag} label="Category" value={receptionist.category || 'Receptionist'} />
        <ProfileField
          icon={FiCheckCircle}
          label="Status"
          value={
            <span className={`status-badge ${
              receptionist.status === 'active' ? 'status-active' :
              receptionist.status === 'inactive' ? 'status-inactive' :
              'status-pending'
            }`}>
              {receptionist.status || 'active'}
            </span>
          }
        />
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center bg-gray-50 rounded-lg p-3">
    <Icon className="text-gray-400 text-xl mr-3" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default ReceptionistProfile;
