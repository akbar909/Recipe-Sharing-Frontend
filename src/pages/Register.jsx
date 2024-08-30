import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

function Register() {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [isUserNameAvailable, setIsUserNameAvailable] = useState(null);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('authToken');

    if (token) {
      navigate('/');
      return;
    }
    const checkUserNameAvailability = async () => {
      if (userName) {
        try {
          const response = await axios.get(`https://recipe-sharing-backend-one.vercel.app/api/users/check-userName/${userName}`);
          setIsUserNameAvailable(response.data.message === 'Username available');
        } catch (error) {
          console.error('Error checking username:', error.response?.data || error.message);
          setIsUserNameAvailable(null);
        }
      } else {
        setIsUserNameAvailable(null);
      }
    };

    checkUserNameAvailability();
  }, [userName]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !userName || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!isUserNameAvailable) {
      setError('Username is already taken');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('password', password);
    if (image) formData.append('image', image);

    try {
      await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Registraion successful');

      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data.message || 'Registration failed');
      toast.success('Registraion failed');

    }
  };

  return (

    <>
    
    <div className="flex justify-center items-center min-h-screen mt-4">
            <Toaster position="top-right" />

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Register</h1>
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {userName && (
                <div className="text-sm mt-1">
                  {isUserNameAvailable === null && <span className="text-gray-500">Checking username availability...</span>}
                  {isUserNameAvailable === true && <span className="text-green-500">Username is available!</span>}
                  {isUserNameAvailable === false && <span className="text-red-500">Username is already taken.</span>}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
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
            <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
          <div className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Register;
