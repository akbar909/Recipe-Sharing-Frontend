import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

function UserRecipes() {
    const { userName } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await axios.get(`https://recipe-sharing-backend-one.vercel.app/api/recipes/user/${userName}`, {
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
    }, [userName]);

    return (
        <div className='mt-20'>
            {loading ? (
                <div className="flex justify-center items-center mt-48">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className='flex-grow container mx-auto px-4 py-6'>
                    <h1 className="text-3xl font-bold mb-6">Recipes by {userName}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {recipes.length === 0 ? (
                            <p>No recipes found.</p>
                        ) : (
                            recipes.map(recipe => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserRecipes;
