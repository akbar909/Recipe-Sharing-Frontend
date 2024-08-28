import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import moment from 'moment';
import { formatDistanceToNow } from 'date-fns';

function RecipeCard({ recipe, showLink = true }) {
  const likesCount = recipe.likes ? recipe.likes.length : 0;
  const user = useContext(AuthContext);

  return (
    <div className='border rounded-lg overflow-hidden flex flex-col'>
      {showLink ? (
        <Link to={`/user/${(recipe?.user?.userName)}/recipes`} className="flex items-center p-4">
          <img
            src={recipe?.user?.image}
            alt={recipe?.user?.title}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className='ml-4'>
            <p className='font-bold'> {recipe?.user?.name}</p>
            {/* <p className="text-gray-500 text-xs">{new Date(recipe.createdAt).toLocaleDateString()}</p> */}
            <p className="text-gray-500 text-xs">
                {moment(recipe.createdAt).fromNow()}
            </p>
            {/* <p className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
            </p> */}
          </div>
        </Link>
      ) : null}
      <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover mb-4" />
      <div className='p-4 flex flex-col flex-grow'>
        <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
        <p className="text-gray-700 mb-2">{recipe.description.substring(0, 100)}...</p>
        <p className="text-gray-600 mb-2">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</p>
        <Link to={`/recipes/${recipe._id}`} className="text-blue-500 hover:underline mt-2 inline-block">Read more</Link>
      </div>
    </div>
  );
}

export default RecipeCard;
