import { useState } from 'react';
import axios from 'axios';
import { DEMO_MODE, DEMO_USER, API_BASE_URL } from '../api';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (DEMO_MODE) {
        // Demo mode - simulate login
        localStorage.setItem('token', DEMO_USER.token);
        localStorage.setItem('user', JSON.stringify(DEMO_USER));
        window.location.reload();
        return;
      }

      const endpoint = showSignUp ? '/register' : '/login';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email first' });
      return;
    }

    if (DEMO_MODE) {
      alert('Demo mode: Password reset feature not available');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, { email: formData.email });
      alert('Password reset instructions sent to your email');
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'An error occurred' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {showSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {showSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : showSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {!showSignUp && (
            <button
              onClick={handleForgotPassword}
              className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Forgot Password?
            </button>
          )}

          <div className="text-center">
            <span className="text-gray-600 text-sm">
              {showSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => setShowSignUp(!showSignUp)}
              className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;