import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import SearchContext from '../context/SearchContext';
import { HiMenu, HiX } from 'react-icons/hi';

function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen(prev => !prev);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">Recipe Sharing</Link>

        <div className="flex items-center">
          {/* Hamburger Menu for Mobile */}
          <div className="sm:hidden">
            <button
              onClick={handleMenuToggle}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>

          {/* Search Bar and Links for Larger Screens */}
          <div className="hidden sm:flex items-center space-x-4">

            {user ? (
              <>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search recipes"
                  className="px-4  py-2 border rounded-md"
                />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleMenuToggle}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <p className="text-white font-semibold mr-2">
                    {loading ? 'Loading...' : `Welcome, ${user.name || 'Loading...'}`}
                  </p>
                  {loading &&  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    <span className="text-white font-semibold ml-2">Loading...</span>
                  </div>}
                  {!loading && (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>
                {menuOpen && (
                  <div className="absolute z-10 right-0 mt-36 bg-white text-gray-800 border border-gray-300 rounded-md shadow-lg w-48">
                    <Link to="/profile" onClick={() => { setMenuOpen(false) }} className="block px-4 py-2 hover:bg-gray-200">My Recipes</Link>
                    <Link to="/postrecipe" onClick={() => { setMenuOpen(false) }} className="block px-4 py-2 hover:bg-gray-200">Post Recipe</Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        window.location.href = '/';
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
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {menuOpen && (
        <div className="sm:hidden bg-gray-800 text-white flex flex-col items-center space-y-2 py-4">

          {user ? (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search recipes"
                className="px-4 text-black py-2 border rounded-md w-full max-w-xs"
              />
              <img
                src={user.image}
                alt="UserProfile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="w-full text-center">My Recipes</Link>
              <Link to="/postrecipe" onClick={() => setMenuOpen(false)} className="w-full text-center">Post Recipe</Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  window.location.href = '/login';
                }}
                className="w-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full text-center">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="w-full text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
