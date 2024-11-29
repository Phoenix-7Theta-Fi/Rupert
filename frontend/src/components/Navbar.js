import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">Drisht</Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200">Home</Link>
            <Link to="/practitioners" className="hover:text-green-200">Practitioners</Link>
            <Link to="/blogs" className="hover:text-green-200">Blogs</Link>
            
            {user ? (
              <>
                {user.role === 'practitioner' ? (
                  <>
                    <Link to="/dashboard" className="hover:text-green-200">Dashboard</Link>
                    <Link to="/practitioner-appointments" className="hover:text-green-200">Appointments</Link>
                    <Link to="/profile/edit" className="hover:text-green-200">Profile</Link>
                  </>
                ) : (
                  <Link to="/my-appointments" className="hover:text-green-200">My Appointments</Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-green-200">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-green-700 px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="bg-green-700 px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border border-green-400 px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
