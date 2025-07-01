/*import React, { useState, useEffect } from 'react';
import { getPatients, getAppointments, getClinics, getTimeSlots } from '../../services/database.js';
import { FiUsers, FiCalendar, FiClock, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { format } from 'date-fns';

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    availableSlots: 0,
    totalClinics: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [patients, appointments, clinics] = await Promise.all([
        getPatients(),
        getAppointments(),
        getClinics()
      ]);

      const today = format(new Date(), 'yyyy-MM-dd');
      const todayAppts = appointments ? Object.values(appointments).filter(a => a.date === today) : [];

      setStats({
        totalPatients: patients ? Object.keys(patients).length : 0,
        todayAppointments: todayAppts.length,
        availableSlots: 24, // Mock data
        totalClinics: clinics ? Object.keys(clinics).length : 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Registered Patients',
      value: stats.totalPatients,
      icon: FiUsers,
      color: 'bg-primary-50 text-primary-600',
      change: '+8 this week'
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FiCalendar,
      color: 'bg-success-50 text-success-600',
      change: '12 completed'
    },
    {
      title: 'Available Slots',
      value: stats.availableSlots,
      icon: FiClock,
      color: 'bg-warning-50 text-warning-600',
      change: 'Next: 2:00 PM'
    },
    {
      title: 'Active Clinics',
      value: stats.totalClinics,
      icon: FiActivity,
      color: 'bg-purple-50 text-purple-600',
      change: 'All operational'
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
          <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
      </div>

      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'patients'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Patient Management
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
              <div key={index} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.change}</p>
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
                  <FiUsers className="text-primary-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary-900">Register Patient</p>
                </button>
                <button className="p-4 bg-success-50 rounded-lg text-center hover:bg-success-100 transition-colors duration-200">
                  <FiCalendar className="text-success-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-success-900">Book Appointment</p>
                </button>
                <button className="p-4 bg-warning-50 rounded-lg text-center hover:bg-warning-100 transition-colors duration-200">
                  <FiClock className="text-warning-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-warning-900">Manage Slots</p>
                </button>
                <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors duration-200">
                  <FiActivity className="text-purple-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-900">View Reports</p>
                </button>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dr. Smith - Cardiology</p>
                    <p className="text-xs text-gray-500">Room 101</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">9:00 AM - 1:00 PM</p>
                    <span className="status-badge status-active">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dr. Johnson - Pediatrics</p>
                    <p className="text-xs text-gray-500">Room 102</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">2:00 PM - 6:00 PM</p>
                    <span className="status-badge status-pending">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'patients' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Management Dashboard</h3>
          <p className="text-gray-600 mb-6">
            This section will contain patient registration, medical history management, and patient records.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <FiUsers className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Register New Patient</p>
            </button>
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <FiCalendar className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Manage Medical History</p>
            </button>
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
              <FiActivity className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">View Patient Records</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicDashboard;


*/

// File: src/modules/clinic/ClinicDashboard.jsx
// ClinicDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getPatients, getAppointments, getClinics, getTimeSlots } from '../../services/database.js';
import { FiUsers, FiCalendar, FiClock, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';

const ClinicDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    availableSlots: 0,
    totalClinics: 0
  });
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [todaySlots, setTodaySlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [patients, appointments, clinicsData] = await Promise.all([
          getPatients(),
          getAppointments(),
          getClinics()
        ]);
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointments
          ? Object.values(appointments).filter((a) => a.date === today)
          : [];

        setStats({
          totalPatients: patients ? Object.keys(patients).length : 0,
          todayAppointments: todayAppts.length,
          availableSlots: 24, // optional: calculate from timeSlots if needed
          totalClinics: clinicsData ? Object.keys(clinicsData).length : 0
        });

        if (clinicsData) {
          const arr = Object.values(clinicsData);
          setClinics(arr);
          if (arr.length) setSelectedClinic(arr[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedClinic) return;
    (async () => {
      try {
        const slots = await getTimeSlots(selectedClinic);
        const today = new Date().toISOString().split('T')[0];
        setTodaySlots(
          slots
            ? Object.values(slots).filter((s) => s.date === today)
            : []
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedClinic]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
       
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FiUsers} title="Registered Patients" value={stats.totalPatients} subtitle="+8 this week" />
        <StatCard icon={FiCalendar} title="Today's Appointments" value={stats.todayAppointments} subtitle="12 completed" />
        <StatCard icon={FiClock} title="Available Slots" value={stats.availableSlots} subtitle="Next: 2:00 PM" />
        <StatCard icon={FiActivity} title="Active Clinics" value={stats.totalClinics} subtitle="All operational" />
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
               </div>
             </div>


      
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <select
          className="form-input"
          value={selectedClinic}
          onChange={(e) => setSelectedClinic(e.target.value)}
        >
          {clinics.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>


        <div className="space-y-3">
          {todaySlots.length === 0 ? (
            <p className="text-gray-500">No slots scheduled for today.</p>
          ) : (
            todaySlots.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Dr. {s.doctorName || 'Unassigned'} – {s.specialization || 'General'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Clinic: {s.clinicName || 'Not Assigned'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(`1970-01-01T${s.startTime}`), 'h:mm aa')} – {format(new Date(`1970-01-01T${s.endTime}`), 'h:mm aa')}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(s.status)}`}>
                    {s.status === 'available' ? 'Available' : s.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="card p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="text-xl text-gray-700" />
      </div>
    </div>
  </div>
);

export default ClinicDashboard;


