import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Meme } from '../types';
import { useAuth } from '../context/AuthContext';
import { likeMeme, isMemeLiked } from '../api/memeApi';
import { formatDistanceToNow } from 'date-fns';

interface MemeCardProps {
  meme: Meme;
  featured?: boolean;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, featured = false }) => {
  const { user } = useAuth();
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(meme.likes);
  const [isLikeAnimating, setIsLikeAnimating] = React.useState(false);
  
  React.useEffect(() => {
    if (user) {
      setLiked(isMemeLiked(meme.id, user.id));
    }
  }, [meme.id, user]);
  
  const handleLike = () => {
    if (!user) return;
    
    likeMeme(meme.id, user.id);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    
    if (!liked) {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meme.title,
        text: `Check out this meme: ${meme.title}`,
        url: window.location.origin + `/meme/${meme.id}`,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.origin + `/meme/${meme.id}`)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
        });
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className={`rounded-lg overflow-hidden shadow-lg ${
        featured ? 'md:col-span-2 row-span-2' : ''
      } bg-white dark:bg-gray-800 transition-all duration-300`}
    >
      <Link to={`/meme/${meme.id}`}>
        <div className="relative pb-[75%] overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={meme.url}
            alt={meme.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/meme/${meme.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {meme.title}
          </h3>
        </Link>
        
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            {formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })}
          </span>
          {meme.author && (
            <span>by {meme.author}</span>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <motion.div
                animate={isLikeAnimating ? {
                  scale: [1, 1.5, 1],
                  transition: { duration: 0.5 }
                } : {}}
              >
                <Heart
                  size={18}
                  className={liked ? 'fill-current' : ''}
                />
              </motion.div>
              <span>{likeCount}</span>
            </motion.button>
            
            <Link
              to={`/meme/${meme.id}`}
              className="flex items-center space-x-1 text-gray-500 dark:text-gray-400"
            >
              <MessageCircle size={18} />
              <span>{meme.comments.length}</span>
            </Link>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            aria-label="Share"
          >
            <Share2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;