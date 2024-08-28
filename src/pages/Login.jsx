import { useState, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import TopLoadingBar from 'react-top-loading-bar';
import { Toaster, toast } from 'sonner';
import { Link } from 'react-router-dom';

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
      toast.success('Login successful');

      window.location.replace('/'); // Redirect to home page
    } catch (error) {
      console.error("Login error:", error.response || error.message); // Log the error details
      loadingBarRef.current?.complete(); // Stop the loading bar
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed');
        toast.error('Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      loadingBarRef.current?.complete(); // Stop the loading bar
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <TopLoadingBar color="#4f23ff" height={3} ref={loadingBarRef} />

      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">Welcome Back</h1>
        <p className="text-center text-gray-600">Login to access your account</p>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Resgister
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
