import { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, Github, Play, X, Eye } from 'lucide-react';

// ---------------- TiltCard Component ----------------
const TiltCard = ({ children }) => {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(((y - centerY) / centerY) * 15);
    rotateY.set(((centerX - x) / centerX) * 15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="your-card-class"
      >
        {children}
      </motion.div>
    </div>
  );
};

// ---------------- Projects Data ----------------
const projects = [
  // ── RAG Chatbot ─────────────────────────────────────────
  {
    title: 'AI-powered portfolio chatbot with RAG system',
    problem: 'Static portfolios force visitors to hunt for answers — most leave before finding them.',
    result: '0 hallucinations · 3–4 min response reduced to ~1 min via Singleton pattern.',
    description: 'Built a resume-grounded chatbot so hiring managers can ask natural questions and get factual answers instantly. RAG prevents LLM hallucination by grounding every response in actual resume chunks.',
    image: 'images/chatbot_before_after.png',
    technologies: ['FastAPI', 'LangChain', 'ChromaDB', 'Ollama · Llama 3.1', 'React', 'Docker', 'AWS EC2'],
    architecture: 'images/rag_chatbot_arch.png',
    github: 'https://github.com/Pavan-Kumar-Adapala/portfolio-web-platform',
    demo: '#',
    category: 'AI, RAG, DevOps, Cloud',
    detailedDescription: [
      'Problem: LLMs hallucinate — a plain LLM answering resume questions would fabricate answers. RAG solves this by grounding every response in actual document chunks.',
      'Built full RAG pipeline: PDF ingestion → recursive text splitting (740-char chunks) → qwen3-embedding:4b embeddings → ChromaDB vector store → top-4 similarity retrieval → Llama 3.1 generation.',
      'Identified critical bottleneck: every chat message rebuilt the entire pipeline from scratch — YAML config reload, MD5 file scan, ChromaDB reconnect, model init — adding 3–4 minutes of overhead per question.',
      'Applied Singleton design pattern via RAGSystemDependencies class — initialized once at FastAPI startup via lifespan event, reused across all requests. Overhead dropped to zero.',
      'Implemented incremental indexing with MD5 file tracking — pipeline only re-runs when PDFs actually change. SHA-256 chunk IDs prevent duplicate vectors on re-index.',
      'Containerized with multi-stage Docker builds — builder compiles C extensions, final stage ships only the runtime. Orchestrated with docker-compose on AWS EC2.',
      'Debugged a production runtime injection failure: browser JS was calling localhost:8000 instead of the EC2 IP. Root cause — env vars stay in the container and never reach the browser. Fixed with docker-entrypoint.sh writing env-config.js before Nginx starts.',
    ],
    metrics: {
      'Hallucinations': '0',
      'Overhead per request': '0s (singleton)',
      'Before fix': '3–4 min/msg',
      'Re-index trigger': 'Only on PDF change',
    }
  },

  // ── MLOps Platform ─────────────────────────────────────────
  {
    title: 'End-to-end MLOps platform for energy consumption prediction',
    problem: 'Industrial HVAC systems had no ML-based energy forecasting — operators reacted to waste instead of preventing it.',
    result: '95% forecasting accuracy · predictive load shifting enabled · 3 deployment architectures built and compared.',
    description: 'Built a production-grade MLOps platform predicting energy consumption in clean room air systems. Covers the full ML lifecycle from data ingestion to cloud deployment — with Terraform-automated infrastructure and three progressively improved AWS deployment architectures.',
    image: '/images/mlops_arch.png',
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker', 'Docker Compose', 'AWS EC2', 'ALB', 'Nginx', 'Terraform', 'GoDaddy DNS', 'Vite', 'Tailwind CSS'],
    architecture: '/images/mlops_arch.png',
    github: 'https://github.com/Pavan-Kumar-Adapala/MLOps_project',
    demo: '#',
    category: 'MLOps, Cloud, DevOps',
    detailedDescription: [
      'Problem: HVAC pre-heater energy consumption in clean rooms was unmanaged — no forecasting model existed to enable proactive load shifting or reduce energy waste.',
      'Built end-to-end ML pipeline: IIoT time-series data ingestion → EDA → feature engineering → prediction models → FastAPI inference service.',
      'Achieved 85% prediction accuracy — models account for weather-related uncertainties and enable Predictive Energy Management (PEM) for proactive load shifting.',
      'Containerized frontend (React/Vite) and backend (FastAPI) with Docker. Designed and compared three AWS deployment architectures with ALB, evaluating trade-offs between complexity and maintainability.',
      'Type 01 — Host-based routing: separate subdomains (ui.pavanclouds.com / api.pavanclouds.com) routed by ALB to individual containers. Simple but port-management complexity.',
      'Type 02 — Path-based routing: single domain, ALB routes /api/* to backend and /* to frontend. Couples application routing logic to ALB rules.',
      'Type 03 — Nginx reverse proxy (recommended): ALB routes all traffic to a single Nginx container which proxies internally. Cleanest separation — one ALB target, zero infrastructure coupling to API paths.',
      'Automated full infrastructure provisioning with Terraform: modular directory structure (modules/ec2, modules/alb, modules/security_groups), S3 remote state with versioning and AES256 encryption, separate dev/prod environments.',
      'EC2 bootstrap script (install_docker.sh.tpl) clones repo via GitHub PAT, installs Docker, and runs docker-compose — fully automated zero-touch deployment on new instances.',
    ],
    metrics: {
      'Prediction accuracy': '85%',
      'Deployment architectures': '3 built',
      'Infrastructure': 'Terraform automated',
      'Data': 'High uncertainty from weather, yet model still performs well',
    }
  },

  // ── Multitenant Platform ───────────────────────────────────
  {
    title: 'Multitenant serverless platform — automated zip processing with full audit trail',
    problem: 'Organizations needed a shared platform to process uploaded files with per-tenant isolation, validation, and an immutable audit trail — without managing servers.',
    result: '7-step fully automated pipeline · zero-touch deployment via GitHub Release · immutable DynamoDB audit trail · on-prem data residency via 3 env vars.',
    description: 'Built an event-driven serverless platform where each GitHub Release triggers Terraform provisioning, Docker build, S3 upload, Lambda validation, ECS Fargate processing, and DynamoDB auditing — fully automated end to end with least-privilege IAM throughout.',
    image: '/images/multitenant_pipeline_stages.png',
    technologies: ['AWS Lambda', 'ECS Fargate', 'S3', 'DynamoDB', 'ECR', 'Terraform', 'GitHub Actions', 'Python 3.12', 'Docker'],
    architecture: '/images/multitenant_system_arch.png',
    github: 'https://github.com/Pavan-Kumar-Adapala/multitenant-platform',
    demo: '#',
    category: 'Cloud, Serverless, DevOps',
    detailedDescription: [
      'Problem: Teams needed to submit zip files for processing with per-tenant isolation, automated validation, and a tamper-proof audit trail — without provisioning or managing servers.',
      'Built event-driven pipeline: GitHub Release (zip attached) → GitHub Actions → Terraform provisions S3, Lambda, DynamoDB, ECS Cluster, ECR → Docker build/push to ECR → S3 upload with organization-id tag → S3 PutObject triggers Lambda Validator → ECS Fargate processes zip → DynamoDB records every transition.',
      'Lambda Validator (Python 3.12): reads organization-id tag from S3, validates file size (<500MB) and content-type, writes VALIDATED to DynamoDB with PITR-enabled audit table, triggers ECS Fargate via ecs:RunTask.',
      'ECS Fargate processor container (non-root user): downloads zip from S3, logs all file contents and stats, writes COMPLETE audit record — three immutable DynamoDB events per run: VALIDATED → PROCESSING_START → COMPLETE.',
      'Terraform modular structure (modules/s3, modules/dynamodb, modules/iam, modules/lambda) with S3 remote state, state locking, and AES-256 encryption. Least-privilege IAM: Lambda role scoped to specific bucket/table/task ARNs, iam:PassRole conditioned on ecs-tasks.amazonaws.com only.',
      'Hybrid backbone strategy: all three storage/compute/audit layers can redirect to on-prem equivalents (MinIO, Relay Agent, ScyllaDB) by setting three AWS_ENDPOINT_URL_* environment variables — zero code changes, same Lambda, same processor, same audit schema.',
      'Destroy workflow: single GitHub Actions trigger runs terraform destroy -auto-approve — full teardown of all provisioned resources without any local tooling.',
    ],
    metrics: {
      'Pipeline steps': '7 automated',
      'Manual deployment steps': '0',
      'Audit events per run': '3 immutable',
      'On-prem config changes': '3 env vars',
    }
  },

  // ── GitOps CI/CD ─────────────────────────────────────────
  {
    title: 'End-to-end GitOps CI/CD pipeline for cloud-native deployment',
    problem: 'Manual deployments had no security gates — insecure images could reach production undetected.',
    result: '0 manual steps · 100% builds scanned · 35% code quality improvement · 2× smaller images.',
    description: 'Designed a fully automated GitOps pipeline eliminating human error from release cycles while embedding DevSecOps controls — SonarQube and Trivy — at every stage before production.',
    image: '/images/gitops_cicd_gen_ani.gif',
    technologies: ['GitHub Actions', 'Argo CD', 'Kubernetes', 'Docker', 'SonarQube', 'Trivy', 'Nexus', 'AWS ALB', 'Nginx'],
    architecture: '/images/gitops_cicd_gen_ani.gif',
    github: 'https://github.com/Pavan-Kumar-Adapala/Personal_portfolio_3d_animation',
    demo: '/images/gitops.svg',
    category: 'Web Application, DevOps, GitOps, CI/CD, Cloud',
    detailedDescription: [
      'Problem: Deployment had no automated security checks — insecure container images and code with vulnerabilities could be deployed without any gate.',
      'Embedded SonarQube (SAST) and Trivy (container scanning) as pipeline gates — insecure artifacts are rejected automatically before they can reach any environment.',
      'Implemented GitOps delivery with Argo CD: every deployment is a Git commit, enabling one-command declarative rollback and full audit trail.',
      'Reduced Docker image size by 200% using multi-stage builds — smaller attack surface and faster pull times in production.',
      'Architected AWS networking with ALB, IAM least-privilege, and HTTPS-only access following security best practices.',
    ],
    metrics: {
      'Code quality improvement': '35%',
      'Image size reduction': '200%',
      'Security scan coverage': '100%',
      'Manual deploy steps': '0',
    }
  },

  // ── ADAS CI/CD Pipeline ─────────────────────────────────
  {
    title: 'CI/CD pipeline for safety-critical ADAS software',
    problem: 'Manual ECU flashing setup caused frequent build failures and delayed releases for an autonomous parking system.',
    result: '40% setup time reduction · 0 flashing failures · ISO 27001 compliant pipeline.',
    description: 'Automated the full ECU flashing pipeline at Robert Bosch for an autonomous parking system — eliminating manual errors while enforcing ISO 27001 security compliance automatically.',
    image: '/images/ADAS_CICD.png',
    technologies: ['Jenkins', 'JFrog Artifactory', 'Grafana', 'PostgreSQL', 'Python', 'Bash', 'Bitbucket', 'JIRA'],
    architecture: '/images/ADAS_CICD.png',
    github: '#',
    demo: '#',
    category: 'ADAS, CI/CD, Automation',
    detailedDescription: [
      'Problem: Engineers manually prepared PDX containers for ECU flashing — a time-consuming, error-prone step that caused build failures and delayed releases for a safety-critical system.',
      'Automated PDX container generation directly from versioned binaries stored in JFrog Artifactory — validated, signed, and ready for flashing without any manual step.',
      'Integrated ISO 27001-aligned security and quality checks as pipeline gates — compliance is enforced automatically, not audited after the fact.',
      'Reduced setup time by 40%, eliminated all flashing failures, and accelerated release cycles for a safety-critical automotive control system.',
    ],
    metrics: {
      'Setup time reduction': '40%',
      'Flashing failures': '0',
      'Compliance': 'ISO 27001',
      'Manual steps eliminated': '100%',
    }
  },

  // ── Prometheus Hybrid Monitoring ─────────────────────────
  {
    title: 'Centralized observability platform for hybrid infrastructure',
    problem: 'Fragmented monitoring across AWS, Kubernetes, and on-prem RHEL meant incidents were found by users, not engineers.',
    result: 'Proactively caught CPU/memory bottlenecks before pod restarts. MTTR significantly reduced.',
    description: 'Built a unified Prometheus-Grafana observability stack across AWS VMs, Kubernetes clusters, and on-premise RHEL servers — making infrastructure visible at every layer from a single dashboard.',
    image: 'images/prometheus_hybrid_monitoring_architecture.gif',
    technologies: ['Prometheus', 'Grafana', 'Node Exporter', 'cAdvisor', 'AWS', 'VMware', 'OpenVPN', 'Nginx', 'RHEL 9'],
    architecture: 'images/prometheus_hybrid_monitoring_architecture.gif',
    github: 'https://github.com/Pavan-Kumar-Adapala/prometheus_hybrid_monitoring_proj',
    demo: 'images/prometheus_hybrid_monitoring_architecture.gif',
    category: 'Monitoring, DevOps, Hybrid',
    detailedDescription: [
      'Problem: AWS VMs, Kubernetes pods, and on-premise RHEL servers had separate monitoring setups — correlating an incident across all three was manual and slow. Bottlenecks were invisible until they caused outages.',
      'Deployed Prometheus with Node Exporter and cAdvisor across all environments — single pane of glass for CPU, memory, disk, and container metrics.',
      'Identified CPU and memory bottlenecks proactively — optimized Kubernetes resource requests and limits before pod restarts occurred in production.',
      'Custom dashboards and alerting enabled root-cause analysis in minutes instead of hours, significantly reducing MTTR and improving production stability.',
    ],
    metrics: {
      'Infrastructure layers unified': '3',
      'MTTR': 'Significantly reduced',
      'Production stability': 'Improved',
      'Alert coverage': '100% of services',
    }
  },

  // ── Serverless Static Hosting ─────────────────────────
  {
    title: 'Secure serverless static website hosting on AWS',
    problem: 'Static sites do not need servers — yet most setups pay for them and accept unnecessary risk.',
    result: '<$1/month cost · <80ms global latency · 0% public S3 access risk · 0 server ops.',
    description: 'Deployed a zero-maintenance, sub-dollar-per-month hosting solution using S3 and CloudFront with enforced Origin Access Identity — no server, no ops, no exposure.',
    image: 'images/AWS_serverless_static_website.png',
    technologies: ['AWS S3', 'AWS CloudFront', 'AWS IAM', 'Origin Access Identity', 'Terraform'],
    architecture: 'images/serverless_arch.svg',
    github: 'https://github.com/Pavan-Kumar-Adapala/Portfolio_project_Adapala',
    demo: '#',
    category: 'Cloud, Serverless, DevOps',
    detailedDescription: [
      'Configured Origin Access Identity (OAI) and S3 bucket policies to ensure the bucket is never publicly accessible — all access flows through CloudFront only, eliminating direct S3 exposure.',
      'CloudFront CDN delivers content globally at under 80ms latency while handling caching, compression, and HTTPS termination.',
      'Infrastructure provisioned with Terraform — reproducible, version-controlled, zero manual  drift.',
    ],
    metrics: {
      'Hosting cost': '<$1/month',
      'Global latency': '<80ms',
      'Public access risk': '0%',
      'Server ops': '0',
    }
  },

  // ── Hardware Asset Management ─────────────────────────
  {
    title: 'Hardware asset management automation at Bosch',
    problem: '€15,000 of equipment was unaccounted for annually due to manual, inconsistent asset tracking across the EPS2 department.',
    result: '€15,000 cost savings · 80% manual effort reduction · 100% configurationdepartment-wide coverage.',
    description: 'Built Python automation integrating JIRA and Confluence APIs to track hardware assets from acquisition to retirement across all storage areas and test benches at Robert Bosch.',
    image: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Python', 'JIRA REST API', 'Confluence API', 'Seventhings'],
    architecture: 'images/hardware_management.png',
    github: '#',
    demo: '#',
    category: 'Data Engineering, Automation',
    detailedDescription: [
      'Problem: No standardized QR code system, no cross-departmental visibility, and no automated reconciliation — assets left labs without any record.',
      'Built Python automation integrating JIRA REST API and Confluence API to track assets from acquisition to retirement across all storage areas and test benches.',
      'Implemented micro-level tracking in Seventhings — each asset has a unique identity tied to its physical location, visible across departments.',
      'Result: €15,000 annual savings, 80% reduction in manual tracking effort, 100% coverage across the entire department.',
    ],
    metrics: {
      'Cost savings': '€15,000',
      'Manual effort reduction': '80%',
      'Asset coverage': '100%',
      'Tracking accuracy': 'Real-time',
    }
  },

  // ── Python ETL Pipeline & Dashboard ─────────────────────────
  {
    title: 'Python ETL pipeline and KPI dashboard for team performance',
    problem: 'Focus time data was buried in siloed PDFs and calendars — team leads had no visibility into productivity.',
    result: '15% productivity improvement · 100% KPI visibility · fully automated data collection.',
    description: 'Built a modular ETL pipeline with Selenium-based extraction, Pandas processing, and a Tkinter desktop dashboard — turning scattered focus time data into actionable team insights at Robert Bosch.',
    image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Python', 'Tkinter', 'Selenium', 'Pandas', 'NumPy', 'Matplotlib', 'ETL', 'Linux'],
    architecture: 'images/FoucsTime_animation.gif',
    github: '#',
    demo: 'images/FoucsTime_animation.gif',
    category: 'KPI, Data Engineering, Automation',
    detailedDescription: [
      'Problem: Focus time data existed in secure PDFs and Outlook calendars across individual engineers — no automated way to collect, normalize, or visualize it at team level.',
      'Built modular ETL pipeline: Selenium extracts data from secure PDFs and Outlook → Pandas processes and normalizes → Matplotlib visualizes KPIs in a Tkinter desktop GUI.',
      'Used multithreading to keep the GUI responsive during data collection — heavy extraction runs in the background while the interface stays interactive.',
      'Delivered 15% team productivity improvement by making focus time visible and actionable for team leads.',
    ],
    metrics: {
      'Productivity improvement': '15%',
      'KPI visibility': '100%',
      'Data collection': 'Fully automated',
      'Manual reporting': 'Eliminated',
    }
  },

];

// ---------------- Projects Component ----------------
const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Data Engineering', 'AI', 'RAG', 'MLOps', 'Cloud', 'Hybrid','Serverless', 'DevOps', 'Monitoring', 'GitOps', 'Automation'];

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) =>
      p.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const itemVariantsLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const itemVariantsRight = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <section id="projects" ref={ref} className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-6">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Real problems. Measurable results.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${filter === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 mt-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <TiltCard key={project.title}>
                <motion.div
                  variants={index % 2 === 0 ? itemVariantsLeft : itemVariantsRight}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 50 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-500/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {project.category.split(',')[0].trim()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Problem / Result pills */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full mt-0.5">
                          Problem
                        </span>
                        <p className="text-gray-400 text-xs leading-relaxed">{project.problem}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full mt-0.5">
                          Result
                        </span>
                        <p className="text-green-400 text-xs leading-relaxed font-medium">{project.result}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-2 py-0.5 rounded-lg text-xs border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="text-gray-500 text-xs px-1 py-0.5">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-2 border-t border-gray-700/50">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        <Github size={15} />
                        <span>Code</span>
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        <Play size={15} />
                        <span>Demo</span>
                      </a>
                      <button
                        onClick={() => setSelectedProject(index)}
                        className="flex items-center space-x-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm ml-auto"
                      >
                        <Eye size={15} />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  {/* Modal header */}
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white pr-8 leading-snug">
                      {projects[selectedProject].title}
                    </h3>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Problem / Result — prominent at top */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                      <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Problem</div>
                      <p className="text-gray-300 text-sm leading-relaxed">{projects[selectedProject].problem}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Result</div>
                      <p className="text-green-400 text-sm leading-relaxed font-medium">{projects[selectedProject].result}</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {Object.entries(projects[selectedProject].metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-700/50 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-blue-400 mb-1">{value}</div>
                        <div className="text-gray-400 text-xs capitalize leading-tight">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Architecture image */}
                  <div className="mb-6 rounded-xl overflow-hidden border border-gray-600">
                    <img
                      src={projects[selectedProject].architecture}
                      alt={`${projects[selectedProject].title} architecture`}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Implementation details */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">How it was built</h4>
                    <ul className="space-y-3">
                      {projects[selectedProject].detailedDescription.map((item, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start leading-relaxed">
                          <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Technologies used</h4>
                    <div className="flex flex-wrap gap-2">
                      {projects[selectedProject].technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-sm border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-4">
                    <a
                      href={projects[selectedProject].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <Github size={18} />
                      <span>View code</span>
                    </a>
                    <a
                      href={projects[selectedProject].demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                      <ExternalLink size={18} />
                      <span>Live demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;