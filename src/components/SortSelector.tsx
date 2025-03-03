import React from 'react';
import { SortOption } from '../types';

interface SortSelectorProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  selectedSort,
  onSortChange,
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'likes', label: 'Most Liked' },
    { value: 'date', label: 'Newest' },
    { value: 'comments', label: 'Most Comments' },
  ];

  return (
    <div className="flex items-center space-x-2 mb-6">
      <label htmlFor="sort-select" className="text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="block w-40 py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelector;