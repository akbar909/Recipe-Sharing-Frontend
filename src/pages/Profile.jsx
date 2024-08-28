import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import AuthContext from '../context/AuthContext';

function Profile() {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await axios.get(`https://recipe-sharing-backend-one.vercel.app/api/recipes/byemail/${user.email}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipes(data);
            } catch (error) {
                setError(error.response ? error.response.data.message : 'Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [user]);

    // if (loading) return <p>Loading...</p>;
    if (error) {
        console.error('Error fetching recipes:', error);
        return (
            <div>
                <p className="text-red-500">{error}</p>
                <button onClick={() => window.location.reload()} className="text-blue-500 underline">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className='mt-16'>
            {loading ? (
                <div className="flex justify-center items-center mt-48">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className='flex-grow container mx-auto px-4 py-6'>
                    <h1 className="text-3xl font-bold mb-6">My Recipes</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                        {recipes.length === 0 ? (
                            <p>No recipes found.</p>
                        ) : (
                            recipes.map(recipe => (
                                <RecipeCard key={recipe._id} recipe={recipe} showLink={false}/>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
