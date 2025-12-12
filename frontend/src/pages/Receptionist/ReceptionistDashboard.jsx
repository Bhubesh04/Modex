import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Register Patient',
      description: 'Register new patients in the system',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      color: 'blue',
      onClick: () => navigate('/receptionist/register-patient')
    },
    {
      title: 'Book Appointment',
      description: 'Schedule appointments for patients',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'green',
      onClick: () => navigate('/receptionist/book-appointment')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Receptionist Dashboard</h1>
        <p className="text-gray-600">Manage patient registrations and appointments efficiently.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            hover 
            onClick={action.onClick}
            className="group cursor-pointer border-2 border-transparent hover:border-orange-300 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-20 h-20 rounded-2xl ${getColorClasses(action.color)} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                <span>Get Started</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Quick Tips</h3>
              <p className="text-gray-700 text-sm">
                Use the "Register Patient" option to add new patients to the system. Once registered, you can book appointments for them using the "Book Appointment" feature.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;


