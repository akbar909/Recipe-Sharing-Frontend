import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);


  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">Recipe Sharing</Link>
        <div className='flex'>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-300 mx-2">
                {loading ? (
                  <p className="text-gray-300">Loading...</p>  
                ) : (
                  <p>Welcome, {user.name || 'Loading...'}</p>
                )}
              </Link>
              <Link to="/post-recipe" className="text-gray-300 mx-2">Post Recipe</Link>
              <Link to="/login" onClick={() => { logout(); }} className="text-gray-300 hover:text-white mx-2">Logout</Link>
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
