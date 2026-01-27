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
                  DevOps & MLOps Engineer with 3 years of experience delivering scalable, automated cloud and ML platforms that drive measurable business outcomes.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-gray-300 text-lg leading-relaxed"
                >
                  Designed and implemented data-driven CI/CD pipelines and GitOps workflows, cutting build failure root-cause identification by 30% and eliminating manual test artifact analysis. Built production-grade MLOps platforms for energy forecasting in industrial HVAC systems, achieving 95% prediction accuracy and enabling predictive energy management that reduced operational costs and optimized load shifting.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-gray-300 text-lg leading-relaxed"
                >
                  Integrated observability and security tools—Grafana, Prometheus, SonarQube—while provisioning highly available, disaster-resilient infrastructure on AWS with Terraform and CloudFormation. Developed containerized ML inference services with FastAPI and cloud deployment pipelines, ensuring end-to-end automation, reproducibility, and operational reliability.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-gray-300 text-lg leading-relaxed"
                >
                  Passionate about exploring cloud-native technologies, automation frameworks, and open-source tools, with a focus on building solutions that solve real business problems and scale reliably in production.
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
