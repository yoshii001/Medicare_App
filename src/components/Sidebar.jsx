import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiActivity,
  FiClock,
  FiUser,
  FiFileText,
  FiInbox
} from 'react-icons/fi';

const Sidebar = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/LandingPage');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavigationItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/doctors', icon: FiActivity, label: 'Doctors' },
          { path: '/recipients', icon: FiInbox, label: 'Recipients' },
          { path: '/settings', icon: FiSettings, label: 'Settings' }
        ];

      case 'doctor':
        return [
          { path: '/doctor/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/doctor/patients', icon: FiUsers, label: 'My Patients' },
          { path: '/profile', icon: FiUser, label: 'Profile' }
        ];

      case 'receptionist':
        return [
          { path: '/clinic/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/clinic/patients', icon: FiUsers, label: 'Patient Registration' },
          { path: '/clinic/timeslots', icon: FiClock, label: 'Time Slots' }
        ];

      default:
        return [
          { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
          { path: '/my-appointments', icon: FiCalendar, label: 'My Appointments' },
          { path: '/my-reports', icon: FiFileText, label: 'My Reports' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
      <div className="bg-white w-64 flex flex-col shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiActivity className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WellNests</h1>
              <p className="text-sm text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
              <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                              ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                  }
              >
                <item.icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-error-50 hover:text-error-600 transition-all duration-200"
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
  );
};

export default Sidebar;
