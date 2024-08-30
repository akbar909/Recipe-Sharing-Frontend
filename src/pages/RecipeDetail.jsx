import { useParams } from 'react-router-dom';
import {useRef, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useContext(AuthContext);


    const commentTextareaRef = useRef(null);
    const commentsSectionRef = useRef(null);

    useEffect(() => {
        if (editingCommentId && commentTextareaRef.current) {
            commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            commentTextareaRef.current.focus();
        }
    }, [editingCommentId]);
    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await axios.get(`https://recipe-sharing-backend-one.vercel.app/api/recipes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipe(data);

                // Check if the user ID is in the likes array
                const liked = data.likes.some(like => like.toString() === user._id);
                setIsLiked(liked);
            } catch (error) {
                console.error('API Error:', error.response ? error.response.data.message : error.message);
                setError(error.response ? error.response.data.message : 'Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, user._id]);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/recipes/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRecipe(data);
            setIsLiked(prevIsLiked => !prevIsLiked);
        } catch (error) {
            console.error('Failed to like the recipe:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsPosting(true);
        try {
            const token = localStorage.getItem('authToken');
            if (editingCommentId) {
                // Edit comment
                const { data } = await axios.put(`https://recipe-sharing-backend-one.vercel.app/api/recipes/${id}/comment/${editingCommentId}`, { text: comment }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipe(data);
                setEditingCommentId(null);
            } else {
                // Add new comment
                const { data } = await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/recipes/${id}/comment`, { text: comment }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipe(data);
            }
            setComment('');

        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleEditComment = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setComment(commentText);
    };

    const handleDeleteRecipe = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`https://recipe-sharing-backend-one.vercel.app/api/recipes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            window.location.href = '/';
        } catch (error) {
            console.error('Failed to delete the recipe:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await axios.delete(`https://recipe-sharing-backend-one.vercel.app/api/recipes/${id}/comment/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Update the recipe state with the new list of comments without the deleted comment
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                comments: prevRecipe.comments.filter((comment) => comment._id !== commentId),
            }));
        } catch (error) {
            console.error('Failed to delete the comment:', error.response ? error.response.data.message : error.message);
        }
    };
    

    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className='mt-20'>
        {loading ? (
            <div className="flex justify-center items-center mt-48">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
            </div>
        ) : (
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold">{recipe?.title || 'Recipe Detail'}</h1>
                    {recipe?.user._id === user?._id && (
                        <FaEllipsisV
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this recipe?')) {
                                    handleDeleteRecipe();
                                }
                            }}
                            className="text-gray-700 text-2xl cursor-pointer"
                            title="Delete Recipe"
                        />
                    )}
                </div>

                <div className="mb-6 gap-3 flex items-center">
                    <p className="text-lg font-bold flex gap-3 items-center">Posted by: <span> <img
                        src={recipe?.user?.image}
                        alt={recipe?.user?.title}
                        className="w-10 h-10 rounded-full object-cover"
                    /></span> </p>
                    <div className='flex flex-col '>
                        <p className='font-bold'> {recipe?.user?.name}</p>
                        <p className="text-gray-500 text-xs mb-2">{new Date(recipe?.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {recipe?.image && (
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-80 object-contain rounded-lg mb-6"
                    />
                )}
                <p className="text-lg mb-6">{recipe?.description || 'No description available'}</p>

                <button onClick={handleLike} className="mt-4">
                    {isLiked ? (
                        <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                        <FaRegHeart className="text-gray-700 text-2xl" />
                    )}
                </button>
                <p className="text-lg mt-2">{recipe?.likes?.length || 0} likes</p>


                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-semibold text-blue-800 mb-4 border-b-2 border-blue-800 pb-2">Ingredients</h2>
                            {recipe?.ingredients?.length ? (
                                <ul className="list-disc ml-6 space-y-2">
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index} className="text-lg text-gray-700">{ingredient}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-lg text-gray-500">No ingredients listed.</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <h2 className="text-3xl font-semibold text-blue-800 mb-4 border-b-2 border-blue-800 pb-2">Steps</h2>
                            {recipe?.steps?.length ? (
                                <ol className="list-decimal ml-6 space-y-2">
                                    {recipe.steps.map((step, index) => (
                                        <li key={index} className="text-lg text-gray-700">{step}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-lg text-gray-500">No steps available.</p>
                            )}
                        </div>
                    </div>

                    <div ref={commentsSectionRef}>
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {recipe?.comments?.length > 0 ? (
                <ul className="space-y-4">
                    {recipe.comments.map((comment, index) => (
                        <li key={index} className="border rounded-lg p-2">
                            <div className='flex items-center gap-2'>
                                <span> 
                                    <img
                                        src={comment?.user?.image}
                                        alt={comment?.user?.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </span>
                                <div className='flex flex-col flex-grow'>
                                    <p className="text-lg font-semibold">{comment.user.name}</p>
                                    <p className="text-gray-700">{comment.text}</p>
                                    <p className="text-gray-500 text-sm">{new Date(comment.date).toLocaleString()}</p>
                                </div>
                                {comment.user._id === user?._id && (
                                    <div className="flex items-center justify-end space-x-4">
                                        <FaEdit
                                            onClick={() => handleEditComment(comment._id, comment.text)}
                                            className="text-blue-500 text-xl cursor-pointer"
                                            title="Edit Comment"
                                        />
                                        <FaTrash
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-red-500 text-xl cursor-pointer"
                                            title="Delete Comment"
                                        />
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-500">No comments yet.</p>
            )}

            <form onSubmit={handleCommentSubmit} className="mt-6">
                <textarea
                    ref={commentTextareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    required
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
                    disabled={isPosting}
                >
                    {isPosting ? (
                        <div className="w-4 h-4 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                    ) : (
                        editingCommentId ? 'Update Comment' : 'Post Comment'
                    )}
                </button>
            </form>
            </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetail;
