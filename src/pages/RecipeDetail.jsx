// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const RecipeDetail = () => {
//     const { id } = useParams(); 
//     const [recipe, setRecipe] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchRecipe = async () => {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setRecipe(data);
//             } catch (error) {
//                 console.error('API Error:', error.response ? error.response.data.message : error.message);
//                 setError(error.response ? error.response.data.message : 'Server error');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecipe();
//     }, [id]);

//     if (loading) return <p className="text-center text-blue-500">Loading...</p>;
//     if (error) return <p className="text-center text-red-500">{error}</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <h1 className="text-4xl font-bold mb-6">{recipe?.title || 'Recipe Detail'}</h1>
//             {recipe?.image && (
//                 <img 
//                     src={recipe.image} 
//                     alt={recipe.title} 
//                     className="w-full h-80 object-cover rounded-lg mb-6"
//                 />
//             )}
//             <p className="text-lg mb-6">{recipe?.description || 'No description available'}</p>
//             <div className="mb-6">
//                 <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
//                 {recipe?.ingredients?.length ? (
//                     <ul className="list-disc ml-6 space-y-1">
//                         {recipe.ingredients.map((ingredient, index) => (
//                             <li key={index} className="text-lg">{ingredient}</li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-lg">No ingredients listed.</p>
//                 )}
//             </div>
//             <div>
//                 <h2 className="text-2xl font-semibold mb-2">Steps</h2>
//                 {recipe?.steps?.length ? (
//                     <ol className="list-decimal ml-6 space-y-1">
//                         {recipe.steps.map((step, index) => (
//                             <li key={index} className="text-lg">{step}</li>
//                         ))}
//                     </ol>
//                 ) : (
//                     <p className="text-lg">No steps available.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RecipeDetail;

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipe(data);

                // Determine if the current user has liked the recipe
                const userEmail = localStorage.getItem('userEmail');
                const liked = data.likes?.some(like => like.userEmail === userEmail) || false;
                setIsLiked(liked);

            } catch (error) {
                console.error('API Error:', error.response ? error.response.data.message : error.message);
                setError(error.response ? error.response.data.message : 'Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await axios.post(`http://localhost:5000/api/recipes/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setRecipe(data);
            
    
            // Toggle the isLiked state
            setIsLiked(prevIsLiked => !prevIsLiked);
    
        } catch (error) {
            console.error('Failed to like the recipe:', error.response ? error.response.data.message : error.message);
        }
    };
    

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await axios.post(`http://localhost:5000/api/recipes/${id}/comment`, { text: comment }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecipe(data);
            setComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    if (loading) return <p className="text-center text-blue-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6">{recipe?.title || 'Recipe Detail'}</h1>
            {recipe?.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-80 object-cover rounded-lg mb-6"
                />
            )}
            <p className="text-lg mb-6">{recipe?.description || 'No description available'}</p>

            {/* Display like button */}
            <button
                onClick={handleLike}
                className="mt-4"
            >
                {isLiked ? (
                    <FaHeart className="text-red-500 text-2xl" />
                ) : (
                    <FaRegHeart className="text-gray-700 text-2xl" />
                )}
            </button>
            <p className="text-lg mt-2">{recipe?.likes?.length || 0} likes</p>

            <div className='grid grid-flow-col'>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
                {recipe?.ingredients?.length ? (
                    <ul className="list-disc ml-6 space-y-1">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-lg">{ingredient}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg">No ingredients listed.</p>
                )}
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Steps</h2>
                {recipe?.steps?.length ? (
                    <ol className="list-decimal ml-6 space-y-1">
                        {recipe.steps.map((step, index) => (
                            <li key={index} className="text-lg">{step}</li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-lg">No steps available.</p>
                )}
            </div>
            </div>

            {/* Display comments */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                {recipe?.comments?.length > 0 ? (
                    <ul className="space-y-4">
                        {recipe.comments.map((comment, index) => (
                            <li key={index} className="border rounded-lg p-4">
                                <p className="text-lg font-semibold">{comment.user.name}</p>
                                <p className="text-gray-700">{comment.text}</p>
                                <p className="text-gray-500 text-sm">{new Date(comment.date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>

            {/* Add comment form */}
            <form onSubmit={handleCommentSubmit} className="mt-6">
                <textarea
                    className="w-full border rounded-lg p-2 mb-2"
                    rows="3"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Submit Comment
                </button>
            </form>
        </div>
    );
};

export default RecipeDetail;
