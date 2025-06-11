import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    // Username: at least 3 characters
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }
    // Email: valid format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    // Password: at least 8 chars, one uppercase, one lowercase, one number
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, and a number';
    }
    // Confirm Password: must match password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      console.log('Form submitted successfully:', formData);
      // Here you would typically send the data to a server
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {submitted ? (
        <div className="text-center text-green-600">
          <h2 className="text-2xl font-bold">Registration Successful!</h2>
          <p>Thank you for registering.</p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h1>
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
                className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors"
            >
              Create Account
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default RegisterForm; 