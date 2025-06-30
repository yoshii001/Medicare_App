import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getPatients, getDoctors, getAppointments, getClinics } from '../services/database.js';
import { FiUsers, FiCalendar, FiActivity, FiClock, FiTrendingUp, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';

const Dashboard = () => {
  const { userRole, currentUser } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    clinics: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [patients, doctors, appointments, clinics] = await Promise.all([
        getPatients(),
        getDoctors(),
        getAppointments(),
        getClinics()
      ]);

      setStats({
        patients: patients ? Object.keys(patients).length : 0,
        doctors: doctors ? Object.keys(doctors).length : 0,
        appointments: appointments ? Object.keys(appointments).length : 0,
        clinics: clinics ? Object.keys(clinics).length : 0
      });

      // Generate recent activities
      const activities = [];
      if (appointments) {
        Object.values(appointments).slice(0, 5).forEach(apt => {
          activities.push({
            type: 'appointment',
            message: `Appointment scheduled for ${apt.patientName || 'Patient'}`,
            time: apt.createdAt,
            status: apt.status
          });
        });
      }

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const name = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
    return `${greeting}, ${name}!`;
  };

  const getStatsCards = () => {
    const baseCards = [
      {
        title: 'Total Patients',
        value: stats.patients,
        icon: FiUsers,
        color: 'blue',
        change: '+12%'
      }
    ];

    switch (userRole) {
      case 'admin':
        return [
          ...baseCards,
          {
            title: 'Active Doctors',
            value: stats.doctors,
            icon: FiActivity,
            color: 'green',
            change: '+5%'
          },
          {
            title: 'Total Appointments',
            value: stats.appointments,
            icon: FiCalendar,
            color: 'purple',
            change: '+18%'
          },
          {
            title: 'Active Clinics',
            value: stats.clinics,
            icon: FiClock,
            color: 'orange',
            change: '+3%'
          }
        ];
      
      case 'doctor':
        return [
          ...baseCards,
          {
            title: "Today's Appointments",
            value: 8,
            icon: FiCalendar,
            color: 'purple',
            change: '+2'
          },
          {
            title: 'Reports Generated',
            value: 24,
            icon: FiFileText,
            color: 'green',
            change: '+8%'
          }
        ];
      
      case 'receptionist':
        return [
          ...baseCards,
          {
            title: 'Scheduled Today',
            value: 15,
            icon: FiCalendar,
            color: 'purple',
            change: '+6'
          },
          {
            title: 'Available Slots',
            value: 12,
            icon: FiClock,
            color: 'orange',
            change: '-3'
          }
        ];
      
      default:
        return [
          {
            title: 'My Appointments',
            value: 3,
            icon: FiCalendar,
            color: 'blue',
            change: '+1'
          },
          {
            title: 'Medical Reports',
            value: 7,
            icon: FiFileText,
            color: 'green',
            change: '+2'
          }
        ];
    }
  };

  const statsCards = getStatsCards();

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{getWelcomeMessage()}</h1>
        <p className="text-gray-600">
          {format(new Date(), 'EEEE, MMMM do, yyyy')} • 
          <span className="capitalize ml-1">{userRole} Dashboard</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="text-green-500 text-sm mr-1" />
                  <span className="text-sm text-green-600 font-medium">{card.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                <card.icon className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiActivity className="text-blue-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time ? format(new Date(activity.time), 'MMM dd, HH:mm') : 'Just now'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status || 'Active'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {userRole === 'doctor' && (
              <>
                <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors duration-200">
                  <FiUsers className="text-blue-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900">View Patients</p>
                </button>
                <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors duration-200">
                  <FiFileText className="text-green-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-900">New Report</p>
                </button>
              </>
            )}
            
            {userRole === 'admin' && (
              <>
                <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors duration-200">
                  <FiActivity className="text-purple-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-900">Manage Doctors</p>
                </button>
                <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors duration-200">
                  <FiClock className="text-orange-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-900">Clinic Settings</p>
                </button>
              </>
            )}
            
            {userRole === 'receptionist' && (
              <>
                <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors duration-200">
                  <FiCalendar className="text-blue-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900">Book Appointment</p>
                </button>
                <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors duration-200">
                  <FiUsers className="text-green-600 text-2xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-900">Patient Check-in</p>
                </button>
              </>
            )}

            <button className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors duration-200">
              <FiCalendar className="text-gray-600 text-2xl mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Calendar</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors duration-200">
              <FiActivity className="text-gray-600 text-2xl mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;