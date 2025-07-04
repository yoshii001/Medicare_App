


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getPatients, getAppointments } from '../../services/database.js';
import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';
import { format, isSameDay, parseISO } from 'date-fns';

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    reportsGenerated: 0,
    upcomingAppointments: 0,
    totalAppointments: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.uid) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [patients, appointments] = await Promise.all([
        getPatients(),
        getAppointments()
      ]);

      const allAppointments = appointments ? Object.values(appointments) : [];

      // Filter patients assigned to this doctor
      const doctorPatients = patients
          ? Object.entries(patients)
              .filter(([_, p]) => p.doctorId === currentUser.uid)
              .map(([key, p]) => ({ ...p, id: p.id || key }))
          : [];

      // Filter appointments for this doctor by name (case-insensitive)
      const doctorAppointments = allAppointments.filter(
          (a) =>
              a.name?.toLowerCase().trim() ===
              currentUser.displayName?.toLowerCase().trim()
      );

      const today = new Date();

      // Filter today's appointments
      const todayAppts = doctorAppointments
          .filter((a) => {
            try {
              const [year, month, day] = a.date.split("-");
              const apptDate = new Date(Number(year), Number(month) - 1, Number(day));
              return (
                  apptDate.getFullYear() === today.getFullYear() &&
                  apptDate.getMonth() === today.getMonth() &&
                  apptDate.getDate() === today.getDate()
              );
            } catch (error) {
              console.error("Error parsing appointment date:", a.date, error);
              return false;
            }
          })
          .sort(
              (a, b) =>
                  new Date(`1970-01-01T${a.time || "00:00"}`) -
                  new Date(`1970-01-01T${b.time || "00:00"}`)
          );

      // Count future appointments
      const upcomingCount = doctorAppointments.filter((a) => {
        try {
          const [y, m, d] = a.date.split("-");
          const apptDate = new Date(Number(y), Number(m) - 1, Number(d));
          return apptDate > today;
        } catch {
          return false;
        }
      }).length;

      // Update stats and UI state
      setStats({
        totalPatients: doctorPatients.length,
        todayAppointments: todayAppts.length,
        reportsGenerated: doctorPatients.reduce(
            (acc, p) =>
                acc + (p.medicalHistory ? Object.keys(p.medicalHistory).length : 0),
            0
        ),
        upcomingAppointments: upcomingCount,
        totalAppointments: allAppointments.length
      });

      setRecentPatients(doctorPatients.slice(0, 5));
      setTodaySchedule(todayAppts.slice(0, 5));

      // Debugging
      console.log("Doctor name:", currentUser?.displayName);
      console.log("Today's Appointments:", todayAppts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, Dr. {currentUser?.displayName || 'Doctor'}
          </h1>
          <p className="text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        {/* Stat Cards */}
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

        {/* Today's Schedule & Recent Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.length > 0 ? (
                  todaySchedule.map((appt, index) => (
                      <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">{appt.patientName || 'Patient'}</p>
                          <p className="text-xs text-gray-600">
                            {appt.clinicName || 'Clinic'} • {appt.type || 'Consultation'}
                          </p>
                          <p className="text-xs text-gray-400">Appt ID: {appt.id || '—'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {appt.time
                                ? format(new Date(`1970-01-01T${appt.time}`), 'h:mm a')
                                : 'Not set'}
                          </p>
                          <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                  appt.status
                              )}`}
                          >
                      {appt.status || 'unknown'}
                    </span>
                        </div>
                      </div>
                  ))
              ) : (

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-600">Wellness Clinic • Consultation</p>
                      <p className="text-xs text-gray-400">Appt ID: N/A</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">10:00 AM</p>
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                    default
                  </span>
                    </div>
                  </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
            <div className="space-y-3">
              {recentPatients.length > 0 ? (
                  recentPatients.map((patient, index) => (
                      <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <FiUsers className="text-primary-600 text-sm" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {patient.name || patient.patientName || 'Unnamed Patient'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Last visit:{' '}
                              {patient.lastVisit ||
                                  (patient.medicalHistory
                                      ? Object.keys(patient.medicalHistory).slice(-1)[0]
                                      : 'No visits yet')}
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

        {/* Quick Actions */}
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
