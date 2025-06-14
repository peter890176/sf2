import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="font-bold text-xl text-gray-800 hover:text-black">
          SF Shop
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="text-lg text-gray-600 hover:text-black">
            Shop
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-lg text-gray-600 hover:text-black">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg text-gray-600 hover:text-black"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-lg text-gray-600 hover:text-black">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 