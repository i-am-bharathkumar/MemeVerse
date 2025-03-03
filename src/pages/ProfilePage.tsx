import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Edit, LogOut, User, Heart, Image } from 'lucide-react';
import Layout from '../components/Layout';
import MemeGrid from '../components/MemeGrid';
import { useAuth } from '../context/AuthContext';
import { getUserUploadedMemes, getUserLikedMemes } from '../api/memeApi';
import { Meme } from '../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [uploadedMemes, setUploadedMemes] = useState<Meme[]>([]);
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setName(user.name);
    setBio(user.bio);
    setProfilePicture(user.profilePicture);
    setPreviewError(false);

    // Fetch user's memes
    const fetchMemes = async () => {
      setLoading(true);
      try {
        const uploaded = getUserUploadedMemes(user.id);
        const liked = getUserLikedMemes(user.id);
        
        setUploadedMemes(uploaded);
        setLikedMemes(liked);
      } catch (error) {
        console.error('Error fetching user memes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    updateUser({
      ...user,
      name,
      bio,
      profilePicture: previewError ? '' : profilePicture,
    });
    
    setEditing(false);
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile picture */}
              <div className="flex-shrink-0 -mt-16 mb-4 md:mb-0">
                {editing ? (
                  <div className="w-32">
                    <label htmlFor="profile-picture" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      id="profile-picture"
                      value={profilePicture}
                      onChange={(e) => {
                        setProfilePicture(e.target.value);
                        setPreviewError(false);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Image URL"
                    />
                    {profilePicture && !previewError ? (
                      <div className="mt-2 w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
                        <img
                          src={profilePicture}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </div>
                    ) : profilePicture && previewError ? (
                      <div className="mt-2 text-sm text-red-500">
                        Invalid image URL. Please try another.
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format";
                        }}
                      />
                    ) : (
                      <User size={48} className="text-indigo-500 dark:text-indigo-400" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Profile info */}
              <div className="md:ml-6 flex-grow">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Save Changes
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditing(false);
                          setName(user.name);
                          setBio(user.bio);
                          setProfilePicture(user.profilePicture);
                          setPreviewError(false);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold">{name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {uploadedMemes.length} memes uploaded • {likedMemes.length} memes liked
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditing(true)}
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Edit profile"
                        >
                          <Edit size={18} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLogout}
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Log out"
                        >
                          <LogOut size={18} />
                        </motion.button>
                      </div>
                    </div>
                    
                    {bio && (
                      <p className="mt-4 text-gray-700 dark:text-gray-300">{bio}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Memes tabs */}
        <Tabs defaultValue="uploaded" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="uploaded" className="flex items-center">
              <Image size={16} className="mr-2" />
              Uploaded Memes
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center">
              <Heart size={16} className="mr-2" />
              Liked Memes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="uploaded">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <MemeGrid memes={uploadedMemes} />
            )}
          </TabsContent>
          
          <TabsContent value="liked">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <MemeGrid memes={likedMemes} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;