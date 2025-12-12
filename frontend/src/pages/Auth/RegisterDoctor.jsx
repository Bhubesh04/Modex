import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import ErrorBox from '../../components/ErrorBox';
import axiosInstance from '../../api/axiosInstance';

const RegisterDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(null);

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axiosInstance.get('/health');
        if (response.data) {
          setApiConnected(true);
          console.log('✅ Backend API connected:', response.data);
        }
      } catch (err) {
        setApiConnected(false);
        console.error('❌ Backend API connection failed:', err);
        setError('Unable to connect to backend server. Please ensure the backend is running at https://modex-2.onrender.com');
      }
    };
    
    testConnection();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      // Log the API call for debugging
      console.log('📤 Registering doctor with data:', {
        ...registrationData,
        experience: parseInt(registrationData.experience),
        consultationFee: parseFloat(registrationData.consultationFee) || 500
      });
      
      const response = await authApi.registerDoctor({
        ...registrationData,
        experience: parseInt(registrationData.experience),
        consultationFee: parseFloat(registrationData.consultationFee) || 500
      });

      console.log('✅ Registration response:', response);

      if (response.success) {
        setSuccess('Doctor account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login/doctor');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      console.error('   Error response:', err.response);
      console.error('   Error message:', err.message);
      
      // Better error handling
      let errorMessage = 'Registration failed. Please try again.';
      
      if (!err.response) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and ensure the backend is running.';
      } else if (err.response.status === 404) {
        errorMessage = 'API endpoint not found. The registration endpoint may not be available.';
      } else if (err.response.status === 400) {
        errorMessage = err.response?.data?.message || 'Invalid registration data. Please check all fields.';
      } else if (err.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">MedConnect+</h2>
          <h3 className="text-xl font-semibold">Doctor Registration</h3>
        </div>
        
        {apiConnected === false && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">⚠️ Backend Connection Issue</p>
            <p className="text-sm">Unable to connect to backend server. Please check:</p>
            <ul className="text-sm list-disc list-inside mt-2">
              <li>Backend is running at: https://modex-2.onrender.com</li>
              <li>Environment variable REACT_APP_API_URL is set correctly</li>
              <li>Check browser console for detailed error messages</li>
            </ul>
          </div>
        )}
        {error && <ErrorBox message={error} onClose={() => setError('')} />}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Registering...' : 'Create Doctor Account'}
            </button>
          </div>
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDoctor;



