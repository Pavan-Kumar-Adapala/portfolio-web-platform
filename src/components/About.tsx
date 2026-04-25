import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';


const textVariants = {
  hiddenLeft: { opacity: 0, x: -30 },
  hiddenRight: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section id="about" ref={ref} className="py-20 bg-gray-90">
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
            initial={{ opacity: 0, scale: 0.6, y: -30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center z-20"
          >
            <div className="absolute top-0 translate-y-12">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-1 shadow-2xl">
                <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden">
                  <img
                    src="/images/profile.jpeg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating shapes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'circInOut' }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Circle */}
                <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full" />
                {/* <div className="absolute top-12 w-2 h-2 bg-green-500 rounded-full" />
                <div className="absolute right-10 top-1 w-2 h-2 bg-yellow-500 rounded-full" /> */}

                {/* Square */} 
                <div className="absolute left-2 w-3 h-3 bg-purple-500 rounded-sm" />

                {/* Triangle */}
                <div
                  className="absolute bottom-10 right-2 w-0 h-0
                            border-l-4 border-r-4 border-b-8
                            border-l-transparent border-r-transparent border-b-pink-500"
                />
              </motion.div>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            // className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl pt-72 pb-10 px-8 shadow-2xl"
            className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl pt-72 pb-10 px-8 shadow-2xl border border-white/10"
          >
            <div className="space-y-6 text-left md:text-justify max-w-3xl mx-auto">
          
              <motion.p
                variants={textVariants}
                initial="hiddenLeft"
                animate={isInView ? "visible" : "hiddenLeft"}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                DevOps & MLOps Engineer with 5 years of experience delivering scalable, automated cloud and ML platforms that drive measurable business outcomes.
              </motion.p>

              <motion.p
                variants={textVariants}
                initial="hiddenRight"
                animate={isInView ? "visible" : "hiddenRight"}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                Designed and implemented data-driven CI/CD pipelines and GitOps workflows, cutting build failure root-cause identification by 30% and eliminating manual test artifact analysis. Built production-grade MLOps platforms for energy forecasting in industrial HVAC systems, achieving 95% prediction accuracy and enabling predictive energy management that reduced operational costs and optimized load shifting.
              </motion.p>

              <motion.p
                variants={textVariants}
                initial="hiddenLeft"
                animate={isInView ? "visible" : "hiddenLeft"}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                Integrated observability and security tools — Grafana, Prometheus, SonarQube — while provisioning highly available, disaster-resilient infrastructure on AWS with Terraform and CloudFormation. Developed containerized ML inference services with FastAPI and cloud deployment pipelines, ensuring end-to-end automation, reproducibility, and operational reliability.
              </motion.p>

              <motion.p
                variants={textVariants}
                initial="hiddenRight"
                animate={isInView ? "visible" : "hiddenRight"}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                Passionate about exploring cloud-native technologies, automation frameworks, and open-source tools, with a focus on building solutions that solve real business problems and scale reliably in production.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
