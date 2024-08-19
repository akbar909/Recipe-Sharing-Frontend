import { useState, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import TopLoadingBar from 'react-top-loading-bar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const loadingBarRef = useRef(null); // Ref for the loading bar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    loadingBarRef.current?.continuousStart(); // Start the loading bar

    try {
      const { data } = await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/users/login`, { email, password });
      const decodedUser = JSON.parse(atob(data.token.split('.')[1]));
      login({ ...decodedUser, token: data.token });

      localStorage.setItem('userEmail', decodedUser.email);
      window.location.replace('/'); // Redirect to home page
    } catch (error) {
      loadingBarRef.current?.complete(); // Stop the loading bar
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      loadingBarRef.current?.complete(); // Stop the loading bar
    }
  };

  return (
    <div className="flex flex-col items-center mt-28">
      <TopLoadingBar
        color="#4f23ff"
        height={3}
        ref={loadingBarRef}
      />
      <div className="w-72 mx-auto p-6 border border-gray-200 rounded-lg shadow-lg mt-10">
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
    </div>
  );
}

export default Login;
