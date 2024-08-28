import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import SearchContext from '../context/SearchContext';

function Home() {
  const { searchQuery } = useContext(SearchContext);
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(8); // Set initial number of visible recipes
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

  if (error) return <p className="text-red-500">{error}</p>;

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reverse();

  // Load more recipes
  const loadMoreRecipes = () => {
    setVisibleRecipes((prevVisibleRecipes) => prevVisibleRecipes + 8);
  };

  return (
    <div className='mt-16'>
      {loading ? (
        <div className="flex justify-center items-center mt-48">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className='flex-grow container mx-auto px-4 py-6'>
          <h1 className="text-3xl font-bold mb-6">Latest Recipes</h1>

          {/* Check if there are no matching recipes */}
          {filteredRecipes.length === 0 ? (
            <p className="text-gray-500">No recipes found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {filteredRecipes.slice(0, visibleRecipes).map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} showLink={true} />
                ))}
              </div>
              {visibleRecipes < filteredRecipes.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreRecipes}
                    className="px-6 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
