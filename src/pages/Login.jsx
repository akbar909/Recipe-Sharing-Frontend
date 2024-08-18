import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading to true when login is initiated

    try {
      const { data } = await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/users/login`, { email, password });
      const decodedUser = JSON.parse(atob(data.token.split('.')[1]));
      login({ ...decodedUser, token: data.token });

      localStorage.setItem('userEmail', decodedUser.email);
      window.location.replace('/'); // Redirect to home page
    } catch (error) {
      setLoading(false); // Set loading to false on error
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="w-72 mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                autoComplete="email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
