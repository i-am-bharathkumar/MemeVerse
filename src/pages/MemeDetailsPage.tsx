import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import CommentSection from '../components/CommentSection';
import { Meme } from '../types';
import { getMemeById, likeMeme, isMemeLiked, addComment } from '../api/memeApi';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const MemeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchedMeme = getMemeById(id);
      
      if (fetchedMeme) {
        setMeme(fetchedMeme);
        setLikeCount(fetchedMeme.likes);
        
        if (user) {
          setLiked(isMemeLiked(fetchedMeme.id, user.id));
        }
      }
      
      setLoading(false);
    }
  }, [id, user]);

  const handleLike = () => {
    if (!user || !meme) return;
    
    likeMeme(meme.id, user.id);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (!meme) return;
    
    if (navigator.share) {
      navigator.share({
        title: meme.title,
        text: `Check out this meme: ${meme.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
        });
    }
  };

  const handleAddComment = (text: string) => {
    if (!meme || !user) return;
    
    const newComment = {
      text,
      author: user.name,
      createdAt: new Date().toISOString(),
    };
    
    addComment(meme.id, newComment);
    
    // Update local state
    setMeme(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        comments: [
          ...prev.comments,
          {
            id: `comment-${Date.now()}`,
            ...newComment,
          },
        ],
      };
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!meme) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Meme not found</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The meme you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Explore other memes
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {/* Meme details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Meme image */}
          <div className="relative bg-gray-200 dark:bg-gray-700">
            <img
              src={meme.url}
              alt={meme.title}
              className="w-full h-auto max-h-[70vh] object-contain mx-auto"
            />
          </div>

          {/* Meme info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{meme.title}</h1>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {meme.author && <span>Posted by {meme.author} • </span>}
                <span>{formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                  }`}
                  aria-label={liked ? 'Unlike' : 'Like'}
                >
                  <Heart
                    size={20}
                    className={liked ? 'fill-current' : ''}
                  />
                  <span>{likeCount}</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-gray-500 dark:text-gray-400"
                  aria-label="Share"
                >
                  <Share2 size={20} />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
            
            {/* Comment section */}
            <CommentSection
              comments={meme.comments}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemeDetailsPage;