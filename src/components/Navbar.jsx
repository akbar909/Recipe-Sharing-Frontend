import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav  className="bg-gray-800 p-4">
      <div  className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">Recipe Sharing</Link>
        <div className="relative flex items-center">
          {user ? (
            <>
              <div
                className="flex items-center cursor-pointer"
                onClick={handleMenuToggle}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <p className="text-white font-semibold mr-2">
                  {loading ? 'Loading...' : `Welcome, ${user.name || 'Loading...'}`}
                </p>
                <img
                  src={user.image}
                  alt={`Profile picture of ${user.name}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {menuOpen && (
                <div className="absolute right-0 mt-36 bg-white text-gray-800 border border-gray-300 rounded-md shadow-lg w-48">
                  <Link to="/profile" onClick={() => { setMenuOpen(false) }} className="block px-4 py-2 hover:bg-gray-200">My Recipes</Link>
                  <Link to="/post-recipe" onClick={() => { setMenuOpen(false) }} className="block px-4 py-2 hover:bg-gray-200">Post Recipe</Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white mx-2">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white mx-2">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
