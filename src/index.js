import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <SearchProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SearchProvider>
  // </React.StrictMode>
);
// https://recipe-sharing-backend-one.vercel.app/
// http://localhost:5000