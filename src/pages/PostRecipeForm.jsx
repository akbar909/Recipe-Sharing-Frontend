import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import TopLoadingBar from 'react-top-loading-bar';

function PostRecipeForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const loadingBarRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!title || !description || !ingredients || !steps || !image) {
            setErrorMessage('All fields are required');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', ingredients);
        formData.append('steps', steps);
        if (image) formData.append('image', image);

        try {
            loadingBarRef.current.continuousStart();
            const token = localStorage.getItem('authToken');
            await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/recipes`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            loadingBarRef.current.complete();
            toast.success('Recipe posted successfully');
            navigate('/');
        } catch (error) {
            loadingBarRef.current.complete();
            console.error('Error posting recipe:', error);
            toast.error('Failed to post recipe');
        }
    };

    return (
        <>
            <Toaster position="bottom-right" />
            <TopLoadingBar color="#4f23ff" ref={loadingBarRef} />
            <div className='flex-grow container mx-auto px-4 mt-24'>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Post a Recipe</h2>
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Ingredients (one per line)</label>
                        <textarea
                            required
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Steps (one per line)</label>
                        <textarea
                            required
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Image</label>
                        <input
                            required
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Post Recipe
                    </button>
                </form>
            </div>
        </>
    );
}

export default PostRecipeForm;
