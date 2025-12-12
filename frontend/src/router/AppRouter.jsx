import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Auth Pages
import HomePage from '../pages/HomePage';
import DoctorLogin from '../pages/Auth/DoctorLogin';
import PatientLogin from '../pages/Auth/PatientLogin';
import RegisterPage from '../pages/Auth/RegisterPage';
import RegisterDoctorAuth from '../pages/Auth/RegisterDoctor';

// Doctor Pages
import DoctorDashboard from '../pages/Doctor/DoctorDashboard';
import AppointmentDetails from '../pages/Doctor/AppointmentDetails';
import CreatePrescription from '../pages/Doctor/CreatePrescription';
import AllPatients from '../pages/Doctor/AllPatients';

// Patient Pages
import PatientDashboard from '../pages/Patient/PatientDashboard';
import AllDoctors from '../pages/Patient/AllDoctors';
import MyAppointments from '../pages/Patient/MyAppointments';
import MyPrescriptions from '../pages/Patient/MyPrescriptions';
import QRPrescriptionView from '../pages/Patient/QRPrescriptionView';

const AppRouter = () => {
  const { isAuthenticated, user } = useAuth();

  const Layout = ({ children }) => {
    if (!isAuthenticated) {
      return children;
    }

    return (
      <div className="flex">
        <Sidebar role={user?.role} />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 bg-gray-100">{children}</main>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/doctor" element={<RegisterDoctorAuth />} />
      
      <Route
        path="/doctor/dashboard"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
              <DoctorDashboard />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
              <DoctorDashboard />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
              <AllPatients />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/doctor/appointment/:id"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
              <AppointmentDetails />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/doctor/prescription/:appointmentId"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
              <CreatePrescription />
            </RoleRoute>
          </Layout>
        }
      />

      <Route
        path="/patient/dashboard"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.PATIENT]}>
              <PatientDashboard />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.PATIENT]}>
              <AllDoctors />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.PATIENT]}>
              <MyAppointments />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <Layout>
            <RoleRoute allowedRoles={[ROLES.PATIENT]}>
              <MyPrescriptions />
            </RoleRoute>
          </Layout>
        }
      />
      <Route
        path="/patient/prescriptions/qr/:token"
        element={<QRPrescriptionView />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

