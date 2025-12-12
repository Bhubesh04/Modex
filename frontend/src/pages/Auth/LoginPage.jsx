import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';
import ErrorBox from '../../components/ErrorBox';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on role
      const role = result.user.role;
      switch (role) {
        case ROLES.DOCTOR:
          navigate('/doctor/dashboard');
          break;
        case ROLES.PATIENT:
          navigate('/patient/dashboard');
          break;
        default:
          setError('Invalid role. Only Doctor and Patient can login.');
      }
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">MedConnect+</h2>
        <h3 className="text-xl font-semibold text-center mb-6">Login</h3>
        
        {error && <ErrorBox message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-600">
            Don't have an account? Register as:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              Patient
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/register/doctor" className="text-blue-600 hover:text-blue-800 font-semibold">
              Doctor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

