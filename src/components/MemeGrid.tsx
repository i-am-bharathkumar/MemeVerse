import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MemeCard from './MemeCard';
import { Meme } from '../types';

interface MemeGridProps {
  memes: Meme[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MemeGrid: React.FC<MemeGridProps> = ({
  memes,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasMore && onLoadMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore, loading]);

  // Grid animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (memes.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">No memes found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {memes.map((meme, index) => (
          <motion.div key={`${meme.id}-${index}`} variants={itemVariants}>
            <MemeCard
              meme={meme}
              featured={index === 0}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading indicator and infinite scroll trigger */}
      {(loading || hasMore) && (
        <div
          ref={ref}
          className="flex justify-center items-center py-8"
        >
          {loading && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading more memes...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MemeGrid;