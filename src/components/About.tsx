import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section id="about" ref={ref} className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About Me
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-left">
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-gray-300 text-lg leading-relaxed"
                >
                  Hi, I'm Pavan Kumar Adapala, a passionate DevOps Engineer with around 3 years of experience AWS cloud, 
                  automating the software development lifecycle with CI/CD and open-source tools, and implementing observability 
                  solutions.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-gray-300 text-lg leading-relaxed"
                >
                  I have experience in building scalable, secure, and efficient cloud
                  solutions using Python and Bash scripting, AWS, and modern DevOps practices.
                  My goal is to bridge the gap between development and
                  operations, ensuring smooth and reliable software delivery.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-gray-300 text-lg leading-relaxed"
                >
                  Outside of optimizing infrastructure and writing automation scripts, 
                  I am passionate about building my own projects to explore new tools and technologies, 
                  while actively engaging with the DevOps community to share and grow knowledge.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, rotateY: 0 }
                    : { opacity: 0, scale: 0.8, rotateY: 90 }
                }
                transition={{ duration: 1, delay: 0.4 }}
                className="relative"
              >
                {/* Outer gradient circle */}
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-1">
                  {/* Inner circle with profile image */}
                  <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                    <img 
                      src="/images/profile.jpeg" 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* Floating elements around the profile */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full opacity-80"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-500 rounded-full opacity-80"></div>
                  <div className="absolute top-16 left-8 w-4 h-4 bg-green-500 rounded-full opacity-80"></div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
