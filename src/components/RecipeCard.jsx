import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

function RecipeCard({ recipe }) {
  const likesCount = recipe.likes ? recipe.likes.length : 0;
  const user = useContext(AuthContext);
  // console.log(recipe);
  // console.log(recipe?.user?.image);


  return (
    <div className="border rounded-lg p-4">
    <Link to={`/user/${encodeURIComponent(recipe?.user.name)}/recipes`}>
      <div className="mb-6 gap-3 flex items-center">
        <img
          src={recipe?.user.image}
          alt={recipe?.user?.title}
          className="w-12 h-12 rounded-full object-cover text-lg font-bold flex gap-3 items-center"
        />
        <div className='flex flex-col '>
          <p className='font-bold'> {recipe?.user?.name}</p>
          <p className="text-gray-500 text-xs mb-2">{new Date(recipe.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      </Link>
      <img src={recipe.image} alt={recipe.title} className="rounded-lg w-full h-48 object-cover mb-4" />
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-700 mb-2">{recipe.description.substring(0, 100)}...</p>

      <p className="text-gray-600 mb-2">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>

      <Link to={`/recipes/${recipe._id}`} className="text-blue-500 hover:underline mt-2 inline-block">Read more</Link>
    </div>
  );
}

export default RecipeCard;

