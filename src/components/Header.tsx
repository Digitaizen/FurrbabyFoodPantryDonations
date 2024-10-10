import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <PawPrint size={32} />
          <span className="text-xl font-bold">Pet Food Donation</span>
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/donate" className="hover:text-blue-200">Donate</Link></li>
            <li><Link to="/request" className="hover:text-blue-200">Request</Link></li>
            {user ? (
              <>
                <li><Link to="/profile" className="hover:text-blue-200"><User size={20} /></Link></li>
                {user.isAdmin && (
                  <li><Link to="/admin" className="hover:text-blue-200">Admin</Link></li>
                )}
                <li>
                  <button onClick={logout} className="hover:text-blue-200">
                    <LogOut size={20} />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-blue-200">Login</Link></li>
                <li><Link to="/register" className="hover:text-blue-200">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;