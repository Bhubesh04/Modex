import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../api/patientApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ appointments: 0, prescriptions: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsRes, prescriptionsRes, doctorsRes] = await Promise.all([
          patientApi.getAppointments().catch(() => ({ success: false, appointments: [] })),
          patientApi.getPrescriptions().catch(() => ({ success: false, prescriptions: [] })),
          patientApi.getAllDoctors().catch(() => ({ success: false, doctors: [] }))
        ]);

        setStats({
          appointments: appointmentsRes.success ? appointmentsRes.appointments.length : 0,
          prescriptions: prescriptionsRes.success ? prescriptionsRes.prescriptions.length : 0,
          doctors: doctorsRes.success ? doctorsRes.doctors.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const quickActions = [
    {
      title: 'My Appointments',
      description: 'View and manage your appointments',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'blue',
      count: stats.appointments,
      onClick: () => navigate('/patient/appointments')
    },
    {
      title: 'My Prescriptions',
      description: 'Access your digital prescriptions',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'green',
      count: stats.prescriptions,
      onClick: () => navigate('/patient/prescriptions')
    },
    {
      title: 'Find Doctors',
      description: 'Browse and find doctors',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'purple',
      count: stats.doctors,
      onClick: () => navigate('/patient/doctors')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your healthcare journey.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} hover onClick={action.onClick} variant="gradient" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-14 h-14 rounded-xl ${getColorClasses(action.color)} flex items-center justify-center mb-4`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-gray-900">{action.count}</span>
                  <span className="text-sm text-gray-500 font-medium">total</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -mr-16 -mt-16"></div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            hover 
            onClick={action.onClick}
            className="group cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl ${getColorClasses(action.color)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;


