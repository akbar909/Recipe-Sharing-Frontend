import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostRecipeForm from './pages/PostRecipeForm';
import AuthContext from './context/AuthContext';
import NotFound from './pages/NotFound';

function PrivateRoute({ element, ...rest }) {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/postrecipe" element={<PrivateRoute element={<PostRecipeForm />} />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>
    
      </div>
    </Router>
  );
}

export default App;
