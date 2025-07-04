import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';

// Admin Module
import AdminDashboard from './modules/admin/AdminDashboard.jsx';
import DoctorManagement from './modules/admin/DoctorManagement.jsx';
import RecipientManagement from './modules/admin/RecipientManagement.jsx';

// Doctor Module
import DoctorDashboard from './modules/doctor/DoctorDashboard.jsx';
import PatientManagement from './modules/doctor/PatientManagement.jsx';

// Clinic Module
import ClinicDashboard from './modules/clinic/ClinicDashboard.jsx';
import PatientRegistration from './modules/clinic/PatientRegistration.jsx';
import TimeSlotManagement from './modules/clinic/TimeSlotManagement.jsx';

const AppRoutes = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/login"
                element={currentUser ? <Navigate to="/dashboard" /> : <Login />}
            />

            {/* Main Dashboard Router */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Layout>
                        <Navigate to="/dashboard/main" />
                    </Layout>
                </ProtectedRoute>
            } />

             Admin Routes
            <Route path="/dashboard/main" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                        <AdminDashboard />
                    </Layout>
                </ProtectedRoute>
            } />


            {/*<Route path="/doctors" element={*/}
            {/*    <ProtectedRoute allowedRoles={['admin']}>*/}
            {/*        <Layout>*/}
            {/*            <DoctorManagement />*/}
            {/*        </Layout>*/}
            {/*    </ProtectedRoute>*/}
            {/*} />*/}
            <Route
                path="/doctors"
                element={
                    <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                        <Layout>
                            <DoctorManagement />
                        </Layout>
                    </ProtectedRoute>
                }
            />


            <Route path="/recipients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                        <RecipientManagement />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <Layout>
                        <DoctorDashboard />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/doctor/patients" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <Layout>
                        <PatientManagement />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Clinic/Receptionist Routes */}
            <Route path="/clinic/dashboard" element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                    <Layout>
                        <ClinicDashboard />
                    </Layout>
                </ProtectedRoute>
            } />


            <Route path="/clinic/patients" element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                    <Layout>
                        <PatientRegistration />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/clinic/timeslots" element={
                <ProtectedRoute allowedRoles={['receptionist']}>
                    <Layout>
                        <TimeSlotManagement />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Fallback Route */}
            <Route path="*" element={
                currentUser ? (
                    <ProtectedRoute>
                        <Layout>
                            <Navigate to="/dashboard" />
                        </Layout>
                    </ProtectedRoute>
                ) : (
                    <Navigate to="/" />
                )
            } />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
