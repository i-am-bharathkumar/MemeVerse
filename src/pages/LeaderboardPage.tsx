import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import Layout from '../components/Layout';
import MemeCard from '../components/MemeCard';
import { Meme } from '../types';
import { getTopMemes } from '../api/memeApi';

const LeaderboardPage: React.FC = () => {
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMemes = () => {
      setLoading(true);
      try {
        const memes = getTopMemes(10);
        setTopMemes(memes);
      } catch (error) {
        console.error('Error fetching top memes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMemes();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
            >
              <Crown size={40} className="text-white" />
            </motion.div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Meme Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The most popular memes on MemeVerse, ranked by likes and engagement.
            Can your meme make it to the top?
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {topMemes.length > 0 ? (
              topMemes.map((meme, index) => (
                <motion.div 
                  key={`${meme.id}-${index}`} 
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Rank badge */}
                    <div className="flex-shrink-0">
                      {index === 0 ? (
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg"
                        >
                          <Trophy size={24} className="text-white" />
                        </motion.div>
                      ) : index === 1 ? (
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md"
                        >
                          <Medal size={24} className="text-white" />
                        </motion.div>
                      ) : index === 2 ? (
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md"
                        >
                          <Award size={24} className="text-white" />
                        </motion.div>
                      ) : (
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-sm"
                        >
                          <span className="text-xl font-bold text-white">
                            {index + 1}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Meme card */}
                    <div className="flex-grow">
                      <MemeCard meme={meme} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No memes found. Be the first to upload and like memes!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default LeaderboardPage;