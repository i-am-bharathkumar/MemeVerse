import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Sparkles, Image } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { uploadMeme, generateAICaption } from '../api/memeApi';
import { MemeCategory } from '../types';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MemeCategory>('New');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      // Check if file is an image
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  // Generate AI caption
  const handleGenerateCaption = async () => {
    if (!title) {
      setError('Please enter a title first');
      return;
    }
    
    setGenerating(true);
    try {
      const aiCaption = await generateAICaption(title);
      setCaption(aiCaption);
    } catch (error) {
      console.error('Error generating caption:', error);
      setError('Failed to generate caption. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!file || !title) {
      setError('Please provide a title and upload an image');
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real app, we would upload the file to a server
      // For this demo, we'll use the object URL as the meme URL
      const newMeme = uploadMeme({
        title,
        url: previewUrl as string,
        width: 500,
        height: 500,
        category,
        author: user.name,
      }, user.id);
      
      // Navigate to the new meme's page
      navigate(`/meme/${newMeme.id}`);
    } catch (error) {
      console.error('Error uploading meme:', error);
      setError('Failed to upload meme. Please try again.');
      setUploading(false);
    }
  };

  // Clear preview and reset form
  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload a Meme</h1>
        
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              You need to be logged in to upload memes.{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Log in now
              </button>
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          {/* Title input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Meme Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
              placeholder="Enter a catchy title for your meme"
              required
            />
          </div>
          
          {/* Category selection */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as MemeCategory)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
            >
              <option value="New">New</option>
              <option value="Classic">Classic</option>
              <option value="Random">Random</option>
            </select>
          </div>
          
          {/* File upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            
            {!previewUrl ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <Image size={48} className="text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {isDragActive
                      ? 'Drop the image here'
                      : 'Drag & drop an image, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports JPEG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                />
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-1 bg-gray-800/70 text-white rounded-full hover:bg-gray-900/90"
                  aria-label="Remove image"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
          
          {/* Caption input with AI generation */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="caption" className="block text-sm font-medium">
                Caption (optional)
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateCaption}
                disabled={generating || !title}
                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={16} className="mr-1" />
                {generating ? 'Generating...' : 'Generate AI Caption'}
              </motion.button>
            </div>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
              placeholder="Add a funny caption to your meme"
              rows={3}
            />
          </div>
          
          {/* Upload button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={uploading || !file || !title}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={20} className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Meme'}
            </motion.button>
          </div>
        </div>
        
        {/* Tips section */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tips for a Great Meme</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Keep your meme simple and easy to understand</li>
            <li>Use high-quality images for better visibility</li>
            <li>Be creative with your captions</li>
            <li>Consider current trends for more engagement</li>
            <li>Respect copyright and avoid offensive content</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;