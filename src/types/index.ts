export interface Meme {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
  captions?: number;
  category?: string;
  author?: string;
  authorId?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
  uploadedMemes: string[];
  likedMemes: string[];
}

export type MemeCategory = 'Trending' | 'New' | 'Classic' | 'Random';

export type SortOption = 'likes' | 'date' | 'comments';

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}