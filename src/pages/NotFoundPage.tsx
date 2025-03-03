import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => {
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
      <div className="max-w-4xl mx-auto text-center py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-8xl font-bold text-indigo-600 dark:text-indigo-400">
              404
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meme Not Found
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              The meme you're looking for has vanished into the internet void.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <img
                src="https://images.unsplash.com/photo-1531928351158-2f736078e0a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Confused cat meme"
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-2xl font-bold text-center">
                When you click on a link and get a 404 error
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Homepage
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12">
            <p className="text-gray-500 dark:text-gray-400">
              Easter Egg: You found the secret 404 page! Share this with your friends.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;