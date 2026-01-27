//import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Code, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Pavan Kumar Adapala
            </motion.div>
            <p className="text-gray-400">
              DevOps Engineer passionate about cloud, automation (CI/CD), containerization, 
              and building scalable solutions that make a difference.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  About
                </motion.button>
              </Link>
              <Link to="/skills">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Skills
                </motion.button>
              </Link>
              <Link to="/experience">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Experience
                </motion.button>
              </Link>
              <Link to="/projects">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </motion.button>
              </Link>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-2 text-gray-400">
              <p>📧 pavankumar.adapala.msc@email.com</p>
              <p>📍 70435 Stuttgart, Germany</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0"
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={16} className="text-red-500" />
              </motion.div>
              <span>using</span>
              <Code size={16} className="text-blue-400" />
              <span>and</span>
              <Coffee size={16} className="text-amber-600" />
            </motion.div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; {currentYear} pavanclouds.com. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;