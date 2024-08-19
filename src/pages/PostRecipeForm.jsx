import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostRecipeForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        const maxSizeInMB = 5;
        if (file && file.size > maxSizeInMB * 1024 * 1024) {
            setErrorMessage(`Image is too large. Please upload an image smaller than ${maxSizeInMB} MB.`);
            setImage(null); // Clear the image
            setImageBase64(''); // Clear the base64 data
            return;
        } else {
            setErrorMessage(''); // Clear any previous error messages
        }

        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageBase64 === '') {
            setErrorMessage('Please upload a valid image.');
            return;
        }

        const recipeData = {
            title,
            description,
            ingredients: ingredients.split('\n'),
            steps: steps.split('\n'),
            image: imageBase64,
        };

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`https://recipe-sharing-backend-one.vercel.app/api/recipes`, recipeData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Error posting recipe:', error);
            alert("Please upload smaller recipe image it's too Large")
        }
    };

    return (
        <div className='flex-grow container mx-auto px-4  mt-24'>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Post a Recipe</h2>
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Ingredients (one per line)</label>
                <textarea
                    required
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Steps (one per line)</label>
                <textarea
                    required
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Image</label>
                <input
                    required
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Post Recipe</button>
        </form>
        </div>
    );
}

export default PostRecipeForm;
