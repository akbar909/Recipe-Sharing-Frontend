import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const registerData = {
      name,
      image: imageBase64,
      email,
      password,
    };

    try {
      await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/users`, registerData);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      alert("Please upload smaller size profile image it's too Large")
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        
        setError('Registration failed');

      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen mt-4">
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;
