import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = useCallback(() => {
    const newErrors = {};
    
    // Username
    if (touched.username && !formData.username) {
      newErrors.username = 'Username is required';
    }

    // Password
    if (touched.password && !formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return newErrors;
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSubmitError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      username: true,
      password: true,
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await login(formData.username, formData.password);
        navigate('/');
      } catch (error) {
        setSubmitError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Log In</h1>
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-lg ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'
          }`}
        >
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </button>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            New to SF Shop?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-gray-800 underline hover:text-black"
            >
              Create an account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 