//import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Code, Coffee, Linkedin, Github} from 'lucide-react';
import { Link } from 'react-router-dom';

const socialLinks = [
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/pavanadapala/',
    label: 'LinkedIn',
    color: 'hover:text-blue-500',
  },
  {
    icon: Github,
    href: 'https://github.com/Pavan-Kumar-Adapala/Pavan_Kumar_Adapala_github',
    label: 'GitHub',
    color: 'hover:text-gray-400',
  },
];


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
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
              <a href="mailto:pavankumar.adapala.msc@gmail.com" className="block hover:text-white transition-colors">📧 pavankumar.adapala.msc@gmail.com</a>
              <a href="https://www.google.com/maps/search/?api=1&query=70435+Stuttgart,+Germany" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">📍 70435 Stuttgart, Germany</a>
              {/* Social Links */}
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-all hover:bg-gray-700`}
                    aria-label={social.label}
                    >
                      <social.icon size={24} />
                      </motion.a>
                    ))
                  }
                </div>
              </motion.div>
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