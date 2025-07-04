import React, { useState, useEffect } from 'react';
import {
  getDoctors,
  getPatients,
  getClinics,
  getAppointments,
  getRecipients // ✅ NEW
} from '../../services/database.js';
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiPlus
} from 'react-icons/fi';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    clinics: 0,
    appointments: 0,
    recipients: 0 // ✅ NEW
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [doctors, patients, clinics, appointments, recipients] = await Promise.all([
        getDoctors(),
        getPatients(),
        getClinics(),
        getAppointments(),
        getRecipients() // ✅ NEW
      ]);

      setStats({
        doctors: doctors ? Object.keys(doctors).length : 0,
        patients: patients ? Object.keys(patients).length : 0,
        clinics: clinics ? Object.keys(clinics).length : 0,
        appointments: appointments ? Object.keys(appointments).length : 0,
        recipients: recipients ? Object.keys(recipients).length : 0 // ✅ NEW
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Doctors',
      value: stats.doctors,
      icon: FiActivity,
      color: 'bg-primary-50 text-primary-600',
      change: '+5%'
    },
    {
      title: 'Total Patients',
      value: stats.patients,
      icon: FiUsers,
      color: 'bg-success-50 text-success-600',
      change: '+12%'
    },
    {
      title: 'Active Clinics',
      value: stats.clinics,
      icon: FiClock,
      color: 'bg-warning-50 text-warning-600',
      change: '+3%'
    },
    {
      title: 'Total Appointments',
      value: stats.appointments,
      icon: FiCalendar,
      color: 'bg-purple-50 text-purple-600',
      change: '+18%'
    },
    {
      title: 'Total Recipients', // ✅ NEW
      value: stats.recipients,
      icon: FiUsers,
      color: 'bg-blue-50 text-blue-600',
      change: '+9%'
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <FiPlus />
            <span>Quick Actions</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
              <div key={index} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                    <div className="flex items-center mt-2">
                      <FiTrendingUp className="text-success-500 text-sm mr-1" />
                      <span className="text-sm text-success-600 font-medium">{card.change}</span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon className="text-xl" />
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition-colors duration-200">
                <FiActivity className="text-primary-600 text-2xl mx-auto mb-2" />
                <p className="text-sm font-medium text-primary-900">Add Doctor</p>
              </button>
              <button className="p-4 bg-success-50 rounded-lg text-center hover:bg-success-100 transition-colors duration-200">
                <FiUsers className="text-success-600 text-2xl mx-auto mb-2" />
                <p className="text-sm font-medium text-success-900">Manage Patients</p>
              </button>
              <button className="p-4 bg-warning-50 rounded-lg text-center hover:bg-warning-100 transition-colors duration-200">
                <FiClock className="text-warning-600 text-2xl mx-auto mb-2" />
                <p className="text-sm font-medium text-warning-900">Clinic Settings</p>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors duration-200">
                <FiCalendar className="text-purple-600 text-2xl mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">View Reports</p>
              </button>
              {/* ✅ NEW: Manage Recipients button */}
              <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors duration-200">
                <FiUsers className="text-blue-600 text-2xl mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">Manage Recipients</p>
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="text-sm font-medium text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Today's Appointments</span>
                <span className="text-sm font-medium text-gray-900">18</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Pending Approvals</span>
                <span className="text-sm font-medium text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">System Health</span>
                <span className="text-sm font-medium text-success-600">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
