import React, { useState, useEffect } from 'react';
import { getAppointments, createAppointment, updateAppointmentStatus } from '../../services/database.js';
import { FiPlus, FiCalendar, FiClock, FiUser, FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
//
const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const appointmentsData = await getAppointments();
      if (appointmentsData) {
        const appointmentsList = Object.values(appointmentsData);
        setAppointments(appointmentsList);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
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
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and schedules</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
          <FiPlus />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName || 'Unknown Patient'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientId?.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.doctorName || 'Dr. Assigned'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.clinicName || 'Main Clinic'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {appointment.date ? format(new Date(appointment.date), 'MMM dd, yyyy') : 'TBD'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiClock className="mr-1" />
                          {appointment.time || '09:00 AM'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      {appointment.status !== 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                          title="Confirm"
                        >
                          <FiCheck />
                        </button>
                      )}
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          title="Cancel"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {appointments.length === 0 && (
            <div className="text-center py-12">
              <FiCalendar className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No appointments scheduled yet.</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Book your first appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;