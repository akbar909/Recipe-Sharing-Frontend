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
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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

        const recipeData = {
            title,
            description,
            ingredients: ingredients.split('\n'),
            steps: steps.split('\n'),
            image: imageBase64,
        };

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://localhost:5000/api/recipes`, recipeData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Error posting recipe:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Post a Recipe</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Ingredients (one per line)</label>
                <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Steps (one per line)</label>
                <textarea
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Image</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Post Recipe</button>
        </form>
    );
}

export default PostRecipeForm;
