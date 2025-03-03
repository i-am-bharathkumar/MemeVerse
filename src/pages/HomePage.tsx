import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ThumbsUp, Share, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import MemeGrid from '../components/MemeGrid';
import { useQuery } from 'react-query';
import { getTrendingMemes } from '../api/memeApi';

const HomePage: React.FC = () => {
  const { data: trendingMemes, isLoading } = useQuery('trendingMemes', getTrendingMemes, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070')] bg-fixed bg-cover opacity-5 -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to MemeVerse
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Discover, share, and create the internet's best memes. Join our community of meme enthusiasts and unleash your creativity!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/explore">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0px 10px 25px rgba(79, 70, 229, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Explore Memes
                    <ArrowRight size={18} className="ml-2" />
                  </motion.button>
                </Link>
                <Link to="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Upload a Meme
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-lg opacity-30 animate-pulse-slow"></div>
                <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1531928351158-2f736078e0a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Featured meme" 
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-bold text-lg">When you finally debug that error</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Posted by MemeVerse</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center text-red-500"><ThumbsUp size={14} className="mr-1" /> 1.2k</span>
                        <span className="flex items-center text-gray-500 dark:text-gray-400"><Share size={14} className="mr-1" /> 342</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Memes Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="flex items-center">
                <Zap size={24} className="mr-2 text-yellow-500" />
                Trending Memes
              </span>
            </h2>
            <Link to="/explore" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              View all
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <MemeGrid 
              memes={trendingMemes?.slice(0, 6) || []} 
              loading={isLoading}
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why MemeVerse?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The ultimate platform for meme enthusiasts with features designed to enhance your meme experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={itemVariants}
              className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Trending</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find the most popular and viral memes from around the web.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Like & Comment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Engage with the community by liking and commenting on your favorite memes.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share with Friends</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily share your favorite memes across social media platforms.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to join the fun?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Create an account to upload your own memes, like and comment on others, and join our growing community.
        </p>
        <Link to="/login">
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 25px rgba(79, 70, 229, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.section>
    </Layout>
  );
};

export default HomePage;