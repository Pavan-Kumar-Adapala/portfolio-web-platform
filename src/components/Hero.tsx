import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const texts = ['Cloud Engineer', 'DevOps Engineer', 'Platform Engineer', 'MLOps Engineer'];

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const current = texts[currentIndex];

        if (isDeleting) {
          setCurrentText(current.substring(0, currentText.length - 1));
        } else {
          setCurrentText(current.substring(0, currentText.length + 1));
        }

        if (!isDeleting && currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);


  return (
    <section
      id="home"
      className="relative bg-gray-900"
    >
      {/* Content Section - Top */}
      <div className="relative w-full pt-32 pb-12 bg-gray-900">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Pavan Kumar Adapala
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 h-8"
            >
              <span className="text-blue-400">{currentText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-blue-400"
              >
                |
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-gray-400 text-lg"
            >
              Passionate about cloud, CI/CD automation, containerization, and building scalable solutions that create real-world impact.
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Image Section - Full Screen */}
      <div className="w-screen bg-gray-900 relative overflow-hidden px-10">
        <p className="text-white text-center font-bold">Technical Skillset Overview</p>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex justify-center"
        >
          <ChevronDown className="text-white" size={32} />
        </motion.div>
        <motion.img
          src="/skills/Skills_chain.png"
          alt="Skills Chain"
          className="w-full h-auto object-contain block"
          style={{
            minHeight: '100vh',
            filter: 'contrast(2.1) brightness(0.8)',
            mixBlendMode: 'screen',
          }}
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-gray-400" size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
