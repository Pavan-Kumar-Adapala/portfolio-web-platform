import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cloud, GitBranch, Database, Package } from 'lucide-react';

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

  const floatingIcons = [
    { Icon: Cloud, delay: 0, x: 100, y: 50 },
    { Icon: GitBranch, delay: 0.5, x: 150, y: 150 },
    { Icon: Database, delay: 1, x: 180, y: 200 },
    { Icon: Package, delay: 2, x: 200, y: 250 },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Floating 3D Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            x: [x, x + 20, x],
            y: [y, y - 20, y],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay,
          }}
          style={{
            left: `${50 + x}px`,
            top: `${50 + y}px`,
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
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
            className="text-gray-400 mb-12"
          >
            Passionate about cloud, CI/CD automation, containerization, and building scalable solutions that create real-world impact.
          </motion.div>
        </motion.div>
      </div>

      {/* Background Image - rendered after content */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/skills/Skills_chain.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      ></div>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-black/30"></div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-gray-400" size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
