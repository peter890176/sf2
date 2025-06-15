import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PasswordCriteria = ({ password }) => {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const Criterion = ({ met, text }) => (
    <li className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      <span className="w-4 h-4 mr-2">{met ? '✓' : '◦'}</span>
      {text}
    </li>
  );

  return (
    <ul className="mt-2 space-y-1">
      <Criterion met={hasLength} text="At least 8 characters long" />
      <Criterion met={hasUpper} text="Contains an uppercase letter" />
      <Criterion met={hasLower} text="Contains a lowercase letter" />
      <Criterion met={hasNumber} text="Contains a number" />
    </ul>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};
    // Username
    if (touched.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }
    // Email
    if (touched.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    // Password
    if (touched.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password does not meet all criteria';
    }
    // Confirm Password
    if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return newErrors;
  }, [formData, touched]);

  useEffect(() => {
    validate();
  }, [validate]);

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
      email: true,
      password: true,
      confirmPassword: true,
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const { confirmPassword, ...registerData } = formData;
        await api.post('/api/auth/register', registerData);
        
        setIsSuccess(true);
        setSubmitError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Registration API call failed:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        setSubmitError(error.response?.data?.error || 'Registration failed. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h1>
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          Registration successful! Redirecting to login...
        </div>
      )}
      {submitError && !isSuccess && (
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
            disabled={isSubmitting || isSuccess}
            className={`w-full px-3 py-2 border rounded-lg ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting || isSuccess}
            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
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
            disabled={isSubmitting || isSuccess}
            className={`w-full px-3 py-2 border rounded-lg ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          <PasswordCriteria password={formData.password} />
          {errors.password && touched.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting || isSuccess}
            className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className={`w-full bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors ${
            (isSubmitting || isSuccess) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'
          }`}
        >
          {isSuccess ? 'Success!' : isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 