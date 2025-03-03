import axios from 'axios';
import { Meme, MemeCategory, SortOption } from '../types';

// Base URL for the Imgflip API
const IMGFLIP_API_URL = 'https://api.imgflip.com';

// Local storage keys
const MEMES_STORAGE_KEY = 'memeverse_memes';
const LIKES_STORAGE_KEY = 'memeverse_likes';
const COMMENTS_STORAGE_KEY = 'memeverse_comments';
const UPLOADED_MEMES_KEY = 'memeverse_uploaded';

// Helper to get stored memes
const getStoredMemes = (): Meme[] => {
  const storedMemes = localStorage.getItem(MEMES_STORAGE_KEY);
  return storedMemes ? JSON.parse(storedMemes) : [];
};

// Helper to store memes
const storeMemes = (memes: Meme[]) => {
  localStorage.setItem(MEMES_STORAGE_KEY, JSON.stringify(memes));
};

// Get trending memes from Imgflip API
export const getTrendingMemes = async (): Promise<Meme[]> => {
  try {
    const response = await axios.get(`${IMGFLIP_API_URL}/get_memes`);
    
    if (response.data.success) {
      const apiMemes = response.data.data.memes;
      
      // Transform API response to our Meme type
      const memes: Meme[] = apiMemes.map((meme: any) => ({
        id: meme.id,
        title: meme.name,
        url: meme.url,
        width: meme.width,
        height: meme.height,
        box_count: meme.box_count,
        category: 'Trending',
        createdAt: new Date().toISOString(),
        likes: Math.floor(Math.random() * 1000),
        comments: [],
      }));
      
      // Store memes in localStorage for offline access
      storeMemes([...getStoredMemes(), ...memes]);
      
      return memes;
    }
    throw new Error('Failed to fetch memes');
  } catch (error) {
    console.error('Error fetching trending memes:', error);
    // Return cached memes if API fails
    return getStoredMemes().filter(meme => meme.category === 'Trending');
  }
};

// Get memes by category
export const getMemesByCategory = (category: MemeCategory): Meme[] => {
  const allMemes = getStoredMemes();
  
  if (category === 'Random') {
    // Shuffle array and return first 10 items
    return [...allMemes].sort(() => 0.5 - Math.random()).slice(0, 10);
  }
  
  return allMemes.filter(meme => meme.category === category);
};

// Search memes by query
export const searchMemes = (query: string): Meme[] => {
  const allMemes = getStoredMemes();
  const lowerCaseQuery = query.toLowerCase();
  
  return allMemes.filter(meme => 
    meme.title.toLowerCase().includes(lowerCaseQuery)
  );
};

// Sort memes by option
export const sortMemes = (memes: Meme[], sortBy: SortOption): Meme[] => {
  return [...memes].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    } else if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'comments') {
      return b.comments.length - a.comments.length;
    }
    return 0;
  });
};

// Get a single meme by ID
export const getMemeById = (id: string): Meme | undefined => {
  const allMemes = getStoredMemes();
  return allMemes.find(meme => meme.id === id);
};

// Like a meme
export const likeMeme = (memeId: string, userId: string): void => {
  const allMemes = getStoredMemes();
  const memeIndex = allMemes.findIndex(meme => meme.id === memeId);
  
  if (memeIndex !== -1) {
    // Get liked memes from localStorage
    const likedMemes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
    
    // Check if user already liked this meme
    const userLikes = likedMemes[userId] || [];
    const alreadyLiked = userLikes.includes(memeId);
    
    if (alreadyLiked) {
      // Unlike the meme
      allMemes[memeIndex].likes -= 1;
      likedMemes[userId] = userLikes.filter((id: string) => id !== memeId);
    } else {
      // Like the meme
      allMemes[memeIndex].likes += 1;
      likedMemes[userId] = [...userLikes, memeId];
    }
    
    // Update localStorage
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedMemes));
    storeMemes(allMemes);
  }
};

// Check if user liked a meme
export const isMemeLiked = (memeId: string, userId: string): boolean => {
  const likedMemes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
  const userLikes = likedMemes[userId] || [];
  return userLikes.includes(memeId);
};

// Add comment to a meme
export const addComment = (memeId: string, comment: Omit<Comment, 'id'>): void => {
  const allMemes = getStoredMemes();
  const memeIndex = allMemes.findIndex(meme => meme.id === memeId);
  
  if (memeIndex !== -1) {
    const newComment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    allMemes[memeIndex].comments = [...allMemes[memeIndex].comments, newComment];
    storeMemes(allMemes);
  }
};

// Upload a new meme
export const uploadMeme = (meme: Omit<Meme, 'id' | 'createdAt' | 'likes' | 'comments'>, userId: string): Meme => {
  const newMeme: Meme = {
    ...meme,
    id: `meme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    authorId: userId,
  };
  
  const allMemes = getStoredMemes();
  const updatedMemes = [...allMemes, newMeme];
  storeMemes(updatedMemes);
  
  // Update user's uploaded memes
  const uploadedMemes = JSON.parse(localStorage.getItem(UPLOADED_MEMES_KEY) || '{}');
  uploadedMemes[userId] = [...(uploadedMemes[userId] || []), newMeme.id];
  localStorage.setItem(UPLOADED_MEMES_KEY, JSON.stringify(uploadedMemes));
  
  return newMeme;
};

// Get user's uploaded memes
export const getUserUploadedMemes = (userId: string): Meme[] => {
  const allMemes = getStoredMemes();
  const uploadedMemes = JSON.parse(localStorage.getItem(UPLOADED_MEMES_KEY) || '{}');
  const userUploads = uploadedMemes[userId] || [];
  
  return allMemes.filter(meme => userUploads.includes(meme.id));
};

// Get user's liked memes
export const getUserLikedMemes = (userId: string): Meme[] => {
  const allMemes = getStoredMemes();
  const likedMemes = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || '{}');
  const userLikes = likedMemes[userId] || [];
  
  return allMemes.filter(meme => userLikes.includes(meme.id));
};

// Get top memes for leaderboard
export const getTopMemes = (limit: number = 10): Meme[] => {
  const allMemes = getStoredMemes();
  return [...allMemes].sort((a, b) => b.likes - a.likes).slice(0, limit);
};

// Generate AI caption for meme (mock implementation)
export const generateAICaption = async (prompt: string): Promise<string> => {
  // In a real app, this would call an AI API
  const captions = [
    "When you finally find the bug in your code after 5 hours",
    "Me explaining to my mom why I need a new graphics card",
    "That moment when your code works on the first try",
    "When someone asks if you tested your code before deploying",
    "My brain during a coding interview vs. my brain at work",
    "When the client says 'just one small change'",
    "How I think I look coding vs. How I actually look",
    "When you forget a semicolon and debug for 3 hours",
    "My code when my professor is checking it vs. when I'm alone",
    "When you write 100 lines of code without saving"
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a random caption
  return captions[Math.floor(Math.random() * captions.length)];
};