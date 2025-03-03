import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortSelector from '../components/SortSelector';
import MemeGrid from '../components/MemeGrid';
import { Meme, MemeCategory, SortOption } from '../types';
import { getTrendingMemes, getMemesByCategory, searchMemes, sortMemes } from '../api/memeApi';

const ExplorePage: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  const [displayedMemes, setDisplayedMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<MemeCategory>('Trending');
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const memesPerPage = 9;

  // Fetch initial memes
  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        const fetchedMemes = await getTrendingMemes();
        setMemes(fetchedMemes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching memes:', error);
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...memes];
    
    // Apply category filter
    if (category !== 'Trending') {
      result = getMemesByCategory(category);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = searchMemes(searchQuery);
    }
    
    // Apply sorting
    result = sortMemes(result, sortBy);
    
    setFilteredMemes(result);
    setPage(1);
    setDisplayedMemes(result.slice(0, memesPerPage));
  }, [memes, category, searchQuery, sortBy]);

  // Handle category change
  const handleCategoryChange = useCallback((newCategory: MemeCategory) => {
    setCategory(newCategory);
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
  }, []);

  // Load more memes for infinite scrolling
  const loadMoreMemes = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * memesPerPage;
    const endIndex = startIndex + memesPerPage;
    
    if (startIndex < filteredMemes.length) {
      setDisplayedMemes(prev => [
        ...prev,
        ...filteredMemes.slice(startIndex, endIndex)
      ]);
      setPage(nextPage);
    }
  }, [filteredMemes, page, memesPerPage]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Explore Memes</h1>
        
        {/* Search and filters */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <CategoryFilter
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
            />
            
            <SortSelector
              selectedSort={sortBy}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredMemes.length} {filteredMemes.length === 1 ? 'meme' : 'memes'} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
        
        {/* Memes grid with infinite scrolling */}
        <MemeGrid
          memes={displayedMemes}
          loading={loading}
          onLoadMore={loadMoreMemes}
          hasMore={displayedMemes.length < filteredMemes.length}
        />
      </div>
    </Layout>
  );
};

export default ExplorePage;