import React, { useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

function Search() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${window.location.origin}/api/recipes/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(data);
      setError(null);
    } catch (error) {
      setError('Search failed');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Recipes</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for recipes..."
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Search
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Search;
