import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar, MapPin, TrendingUp } from 'lucide-react';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const experiences = [
    {
      title: 'Data Analyst',
      company: 'Dürr Systems AG',
      location: 'Bietigheim-Bissingen, Germany',
      period: '02/2024 - 07/2024',
      description: [
        'Developed and evaluated ML-based load forecasting models (batch and one-step-ahead) using IIoT time-series data from automotive paint shop HVAC systems. These models enhanced Predictive Energy Management (PEM) by achieving 95% forecasting accuracy, accounting for weather-related uncertainties, and enabling proactive load shifting to reduce energy waste and operational costs.',
        'Worked closely with data scientists and domain experts to operationalize ML models under real-world constraints of critical energy infrastructure.',
      ],
      // technologies: ['Python', 'Exploratory Data Analysis (EDA)', 'Time series forecasting', 'Data pipelines', 'Machine Learning (ML)', 
      //   'Feature engineering', 'Data-driven decision making', 'Exclude commissioning period', 'Plausibility checks'],
      // achievements: '95% forecasting accuracy, 15% model performance improvement'
    },
    {
      title: 'Software Integration and DevOps Intern',
      company: 'Robert Bosch GmbH',
      location: 'Stuttgart, Germany',
      period: '05/2023 - 01/2024',
      description: [
        'Designed and optimized Jenkins-based CI/CD/CT pipelines with automated unit, integration, and system testing, improving build reliability and delivery efficiency for an autonomous parking system.',
        'Designed and implemented data-driven Python automation to analyze test reports (unit, smoke, integration) and build artifacts, reducing debugging effort and accelerating root cause identification for CI/CD build failures.',
        'Built a centralized monitoring solution using Grafana and PostgreSQL to collect and visualize development process KPIs across multiple projects, enabling data-driven release planning.',
        'Collaborated with development and testing teams to ensure consistent and reliable firmware flashing processes across development and test environments.',
        'Designed and implemented a Python-based analytics tool with ETL pipelines to collect, process, and visualize performance KPIs, supporting data-driven operational decisions.',
        'Designed and developed an automated hardware asset management framework to improve traceability and operational efficiency, resulting in cost savings of approximately €15,000.'
      ],
      // technologies: ['Python(Tkinter, selenium, Pandas, Numpy, threading, logging)', 'Bash Scripting', 'Jenkins', 'Git & Bitbucket', 
      //   'JFrog Artifactory', 'JIRA & Confluence', 'Grafana', 'PostgreSQL', 'RESTAPIs', 'WSL', 'Linux VM','ETL Pipeline', 'GUI Application',
      //   'Data-driven'],
      // achievements: '30% reduction in debugging time, 15% improvement in team productivity'
    },
    {
      title: 'Trainee DevOps Engineer',
      company: 'Ibexlabs Cloud Consulting Pvt. Ltd.',
      location: 'Hyderabad, India',
      period: '04/2021 - 09/2021',
      description: [
        'Provisioned and managed AWS infrastructure using Infrastructure as Code (IaC)-Terraform and CloudFormation to support development and operations teams, ensuring scalable, repeatable deployments.',
        'Developed custom CloudWatch dashboards and alerting systems by integrating open-source monitoring agents, enabling proactive application management, and reducing downtime.',
        'Documented troubleshooting procedures in Confluence, enabling faster resolution of recurring issues and promoting team knowledge sharing.'
      ],
      // technologies: ['AWS', 'Python', 'Bash', 'Terraform', 'Ansible', 'Git & GitHub'],
      // achievements: 'Managing and monitoring client cloud solutions'
    },
    {
      title: 'Trainee Cloud Engineer',
      company: 'Isuzu Motors India Pvt. Ltd.',
      location: 'Sri City, India',
      period: '06/2018 - 07/2019',
      description: [
        'Contributed to cloud migration proof-of-concept (PoC) project, reducing infrastructure costs by 25% through implementation of scalable (Auto Scaling), production-ready cloud infrastructure.',
        'Established GitHub repository standards including branch protection rules, mandatory CI checks before merges, and an optimized branching strategy, improving code quality and reducing integration issues across the team.',
        'Implemented CI/CD pipelines using Jenkins Master-Slave architecture to automate deployments, distributing workloads for faster builds and accelerating release cycles.',
        'Deployed the web application following 3-tier AWS architecture, ensuring secure, highly available (HA), and fault-tolerant systems.'
      ],
      // technologies: ['AWS Services', 'Networking', 'Secuirty', 'Python', 'Bash', 'Git & GitHub'],
      // achievements: 'Reduced data retrieval time by 30%, Reduced operational costs by 25%'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariantsLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariantsRight = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };


  return (
    <section id="experience" ref={ref} className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Experience
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={index % 2 === 0 ? itemVariantsLeft : itemVariantsRight}
                className="relative mb-12"
              >
                {/* Timeline line */}
                <motion.div 
                  className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: '100%' } : { height: 0 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                ></motion.div>
                
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={isInView ? { scale: 1, rotate: 360 } : { scale: 0, rotate: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="absolute left-6 top-8 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-900 z-10"
                ></motion.div>
                
                <div className="ml-20">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-8 shadow-2xl border border-gray-600 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <motion.h3 
                          className="text-2xl font-bold text-white mb-2"
                          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          {exp.title}
                        </motion.h3>
                        <div className="flex items-center text-blue-400 mb-2">
                          <Briefcase size={18} className="mr-2" />
                          <span className="font-medium">{exp.company}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end space-y-2">
                        <div className="flex items-center text-gray-400">
                          <Calendar size={16} className="mr-2" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MapPin size={16} className="mr-2" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Achievement Badge */}
                    {/* <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      className="flex items-center mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-2 w-fit"
                    >
                      <TrendingUp size={16} className="text-green-400 mr-2" />
                      <span className="text-green-400 text-sm font-medium">{exp.achievements}</span>
                    </motion.div> */}
                    
                    <ul className="space-y-2 mb-6">
                      {exp.description.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: index * 0.1 + i * 0.1 }}
                          className="text-gray-300 flex items-start"
                        >
                          <span className="text-blue-400 mr-2 mt-2">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                    
                    {/* <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30 hover:border-blue-400/50 transition-all cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div> */}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;