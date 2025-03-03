import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-indigo-400">MemeVerse</Link>
            <p className="mt-2 text-gray-300">
              The ultimate platform for meme enthusiasts to explore, create, and share the internet's best humor.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/explore" className="text-gray-300 hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/upload" className="text-gray-300 hover:text-white transition-colors">Upload</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/i-am-bharathkumar" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2025 MemeVerse. All rights reserved.</p>
          <p className="flex items-center text-gray-400 mt-4 md:mt-0">
            Made with <Heart size={16} className="mx-1 text-red-500" /> by Bharathkumar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;