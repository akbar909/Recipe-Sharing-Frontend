import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import SearchContext from '../context/SearchContext';


function Home() {
  const { searchQuery } = useContext(SearchContext);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      } else {
        navigate('/');
      }
      try {
        const { data } = await axios.get(`https://recipe-sharing-backend-one.vercel.app/api/recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(data);
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data.message : error.message);
        setError(error.response ? error.response.data.message : 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
    <div className='flex-grow container mx-auto px-4 py-6'>
      <h1 className="text-3xl font-bold mb-6">Latest Recipes</h1>

      {/* Check if there are no matching recipes */}
      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default Home;
