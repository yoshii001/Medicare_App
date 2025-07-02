import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getPatients, getAppointments } from '../../services/database.js';
import { FiUsers, FiCalendar, FiFileText, FiClock, FiTrendingUp } from 'react-icons/fi';
import { format } from 'date-fns';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    reportsGenerated: 0,
    upcomingAppointments: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [patients, appointments] = await Promise.all([
        getPatients(),
        getAppointments()
      ]);

      const allAppointments = appointments ? Object.values(appointments) : [];

      // const doctorPatients = patients ? Object.values(patients) : [];
      const doctorPatients = patients
          ? Object.entries(patients)
              .filter(([_, p]) => p.doctorId === currentUser?.uid)
              .map(([key, p]) => ({ ...p, id: p.id || key }))
          : [];

      const doctorAppointments = allAppointments.filter(a => a.doctorId === currentUser?.uid);

      const today = format(new Date(), 'yyyy-MM-dd');
      const todayAppts = doctorAppointments.filter(a => a.date === today);

      setStats({
        totalPatients: doctorPatients.length,
        todayAppointments: todayAppts.length,
        reportsGenerated: doctorPatients.reduce(
            (acc, p) => acc + (p.medicalHistory ? Object.keys(p.medicalHistory).length : 0),
            0
        ),
        upcomingAppointments: doctorAppointments.filter(a => new Date(a.date) > new Date()).length,
        totalAppointments: allAppointments.length, //  store total appointments
      });

      setRecentPatients(doctorPatients.slice(0, 5));
      setTodaySchedule(todayAppts.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  const statsCards = [
    {
      title: 'My Patients',
      value: stats.totalPatients,
      icon: FiUsers,
      color: 'bg-primary-50 text-primary-600',
      change: '+3 this week'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: FiTrendingUp,
      color: 'bg-blue-50 text-blue-600',
      change: 'Overall count'
    },
    // {
    //   title: "Today's Appointments",
    //   value: stats.todayAppointments,
    //   icon: FiCalendar,
    //   color: 'bg-success-50 text-success-600',
    //   change: '2 completed'
    // },
    {
      title: 'Reports Generated',
      value: stats.reportsGenerated,
      icon: FiFileText,
      color: 'bg-warning-50 text-warning-600',
      change: '+5 this month'
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: FiClock,
      color: 'bg-purple-50 text-purple-600',
      change: 'Next: 2:00 PM'
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, Dr. {currentUser?.displayName || 'Doctor'}
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
      </div>

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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.patientName || 'Patient'}
                    </p>
                    <p className="text-xs text-gray-500">{appointment.type || 'Consultation'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    <span className={`status-badge ${
                      appointment.status === 'confirmed' ? 'status-active' :
                      appointment.status === 'pending' ? 'status-pending' :
                      'status-inactive'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUsers className="text-primary-600 text-sm" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-xs text-gray-500">
                        Last visit: {patient.lastVisit || 'No visits yet'}
                      </p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No patients assigned yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition-colors duration-200">
            <FiUsers className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-primary-900">View Patients</p>
          </button>
          <button className="p-4 bg-success-50 rounded-lg text-center hover:bg-success-100 transition-colors duration-200">
            <FiFileText className="text-success-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-success-900">Add Report</p>
          </button>
          <button className="p-4 bg-warning-50 rounded-lg text-center hover:bg-warning-100 transition-colors duration-200">
            <FiCalendar className="text-warning-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-warning-900">Schedule</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors duration-200">
            <FiClock className="text-purple-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-900">Time Slots</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;