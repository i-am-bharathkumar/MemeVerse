import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && user) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!commentText.trim()}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} className="mr-2" />
                  Comment
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-center">
            Please <a href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">log in</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{comment.author}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.text}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;