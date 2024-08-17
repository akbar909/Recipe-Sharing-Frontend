import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  const likesCount = recipe.likes ? recipe.likes.length : 0;

  return (
    <div className="border rounded-lg p-4">
      <img src={recipe.image} alt={recipe.title} className="rounded-lg w-full h-48 object-cover mb-4" />
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-700 mb-2">{recipe.description.substring(0, 100)}...</p>
      

      <p className="text-gray-600 mb-2">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>
      
      <Link to={`/recipes/${recipe._id}`} className="text-blue-500 hover:underline mt-2 inline-block">Read more</Link>
    </div>
  );
}

export default RecipeCard;

