import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, receptionists: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctorsRes, receptionistsRes] = await Promise.all([
          adminApi.getDoctors().catch(() => ({ success: false, doctors: [] })),
          adminApi.getReceptionists().catch(() => ({ success: false, receptionists: [] }))
        ]);

        setStats({
          doctors: doctorsRes.success ? doctorsRes.doctors.length : 0,
          receptionists: receptionistsRes.success ? receptionistsRes.receptionists.length : 0
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
      title: 'Doctors',
      description: 'Manage doctors and their profiles',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'blue',
      count: stats.doctors,
      onClick: () => navigate('/admin/doctors')
    },
    {
      title: 'Receptionists',
      description: 'Manage receptionist accounts',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'purple',
      count: stats.receptionists,
      onClick: () => navigate('/admin/receptionists')
    },
    {
      title: 'Register Doctor',
      description: 'Add new doctors to the system',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      color: 'green',
      onClick: () => navigate('/admin/register-doctor')
    },
    {
      title: 'Register Receptionist',
      description: 'Add new receptionists to the system',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'orange',
      onClick: () => navigate('/admin/register-receptionist')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your hospital system and personnel.</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card variant="gradient" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold mb-1 uppercase tracking-wide">Total Doctors</p>
              <p className="text-5xl font-extrabold text-blue-900">{stats.doctors}</p>
            </div>
            <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card variant="gradient" className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-semibold mb-1 uppercase tracking-wide">Total Receptionists</p>
              <p className="text-5xl font-extrabold text-purple-900">{stats.receptionists}</p>
            </div>
            <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            hover 
            onClick={action.onClick}
            className="group cursor-pointer border-2 border-transparent hover:border-purple-300 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-gray-100/50 to-transparent rounded-full -mr-14 -mt-14"></div>
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-2xl ${getColorClasses(action.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
              {action.count !== undefined && (
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-gray-900">{action.count}</span>
                  <span className="text-xs text-gray-500 font-medium">total</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;


