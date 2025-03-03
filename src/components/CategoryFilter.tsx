import React from 'react';
import { motion } from 'framer-motion';
import { MemeCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: MemeCategory;
  onCategoryChange: (category: MemeCategory) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const categories: MemeCategory[] = ['Trending', 'New', 'Classic', 'Random'];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;