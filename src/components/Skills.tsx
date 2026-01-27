import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  Users,
  MessageSquare,
  Lightbulb,
  Globe,
  CheckCircle,
} from "lucide-react";

// Skill categories with PNGs
const categorizedSkills: Record<string, { name: string; img: string }[]> = {
  "Cloud": [
    { name: "AWS", img: "aws.png" },
    { name: "Azure", img: "azure.png" },
  ],
  "DevOps": [
    { name: "Jenkins", img: "jenkins.png" },
    { name: "GitHub Actions", img: "githubactions.png" },
    { name: "ArgoCD", img: "argocd.png" },
    { name: "Terraform", img: "terraform.png" },
    { name: "CloudFormation", img: "awscloudformation.png" },
    { name: "Docker", img: "docker.png" },
    { name: "Kubernetes", img: "kubernetes.png" },
    { name: "CloudWatch", img: "cloudwatch.png" },
    { name: "Prometheus", img: "prometheus.png" },
    { name: "Grafana", img: "grafana.png" },
  ],
  "Programming & Scripting": [
    { name: "Python", img: "python.png" },
    { name: "Bash", img: "bash.png" },
  ],
  "Configuration Management": [
    { name: "Ansible", img: "ansible.png" },
    { name: "Helm", img: "helm.png" },
  ],
  "Version Control & Collaboration": [
    { name: "Git & GitHub", img: "github.png" },
    { name: "Bitbucket", img: "bitbucket.png" },
    { name: "Jira", img: "jira.png" },
    { name: "Confluence", img: "confluence.png" },
  ],
  "Databases": [
    { name: "MySQL", img: "mysql.png" },
    { name: "PostgreSQL", img: "postgresql.png" },
  ],
  "Operating Systems & Virtualization": [
    { name: "Linux - Ubuntu, RHEL", img: "linux.png" },
    { name: "VMWare", img: "vmware.png" },
  ],
  "Artifactory Management": [
    { name: "SonarQube", img: "sonarqube.png" },
    { name: "Nexus Repository", img: "NexusRepository.png" },
  ],
  "Software Methodology": [
    { name: "Agile", img: "agile.png" },
    { name: "Scrum", img: "scrum.png" },
  ],
  "Network": [
    { name: "Networking Concepts", img: "network.png" },
  ],
  "Other": [
    { name: "Nginx", img: "nginx.png" },
    { name: "Selenium", img: "seleniumwebdriver.png" },
    { name: "ETL Pipelines", img: "etl.png" },
  ],
};

const personalSkills = [
  { name: "Problem Solving", icon: Lightbulb },
  { name: "Team Collaboration", icon: Users },
  { name: "Communication", icon: MessageSquare },
  { name: "Creativity & Innovation", icon: CheckCircle },
  { name: "Quick Learning", icon: Lightbulb },
  { name: "Openness to Challenges", icon: Lightbulb },
];

const languages = [
  {
    name: "Telugu",
    levelCode: "C2",
    levelLabel: "Native",
  },
  {
    name: "English",
    levelCode: "C1",
    levelLabel: "Proficient",
  },
  {
    name: "German",
    levelCode: "B1",
    levelLabel: "Conversational",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3 },
  }),
};

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  return (
    <section id="skills" ref={ref} className="py-12 bg-gradient-to-br from-slate-800 via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white">Skills</h2>
          <p className="text-gray-400 text-sm">
            Tech stack, soft skills & languages
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Technical Skills */}
          <div className="space-y-10">
            <h3 className="text-xl font-semibold text-white">Technical Skills</h3>
            {Object.entries(categorizedSkills).map(([category, skills], catIndex) => (
              <motion.div
                key={category}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={catIndex}
                variants={itemVariants}
              >
                <h4 className="text-white text-md font-semibold mb-2">{category}</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      custom={i}
                      variants={itemVariants}
                      className="flex flex-col items-center gap-1"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <img
                              src={`/skills/${skill.img}`}
                              alt={skill.name}
                              loading="lazy"
                              //className="w-10 h-10 object-contain hover:scale-105 transition"
                              className={`w-10 h-10 object-contain transition hover:scale-105 ${
                                          ['vmware.png', 'sonarqube.png', 'helm.png', 'ansible.png', 'bash.png', 'github.png'].includes(skill.img)
                                            ? 'bg-white p-1 rounded shadow'
                                            : ''
                                        }`}
                            ></img> 
                          </TooltipTrigger>
                          <TooltipContent>{skill.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-xs text-gray-300 text-center">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Soft Skills and Languages */}
          <div className="space-y-8">
            {/* Soft Skills */}
            <div>
              <h3 className="text-white text-md font-semibold flex items-center mb-2">
                <Users size={18} className="text-purple-400 mr-2" />
                Soft Skills
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {personalSkills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-center gap-2"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 cursor-default">
                            <skill.icon size={16} className="text-white" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{skill.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="text-sm text-white">{skill.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-white text-md font-semibold flex items-center mb-2">
                <Globe size={18} className="text-green-400 mr-2" />
                Languages
              </h3>
              <div className="space-y-2">
                {languages.map((lang, i) => (
                  <motion.div
                    key={lang.name}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="flex items-center gap-3"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm text-white">
                            {lang.name} - {lang.levelLabel} ({lang.levelCode})
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {lang.name} – {lang.levelLabel} ({lang.levelCode})
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
