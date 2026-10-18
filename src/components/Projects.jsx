import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, Activity, Database, Cpu, Layers, ArrowUpRight, Check } from 'lucide-react';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Systems & Real-Time', 'AI & Vector Search', 'Full-Stack & ERP'];

  const projects = [
    {
      title: 'Real-Time EMG Bio-Signal Monitoring & Visualization System',
      category: 'Systems & Real-Time',
      badge: 'Hardware & Systems',
      period: 'Vision Innovations',
      metrics: '60+ FPS • <50ms Latency',
      techStack: ['Python', 'PyQt6', 'PyQtGraph', 'Arduino Serial', 'Multi-threading', 'Signal Processing'],
      description: 'High-frequency desktop software capturing bio-electrical signals through Arduino serial communication, plotting real-time EMG waveforms with zero UI freeze.',
      highlights: [
        'Implemented non-blocking multi-threaded serial buffer preventing UI stutter at 60+ frames per second.',
        'Engineered live baseline measurement algorithms and digital filtering for noise suppression.',
        'Architected structured session logging with automated data exports for clinical evaluation.'
      ],
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'NLP Semantic Medicine Matching & Vector Search Engine',
      category: 'AI & Vector Search',
      badge: 'Vector Search / NLP',
      period: 'Weloin Global',
      metrics: '95%+ Precision • 40% Faster',
      techStack: ['Python', 'FastAPI', 'Hugging Face', 'Sentence Transformers', 'Vector Embeddings', 'Docker'],
      description: 'Intelligent semantic search service mapping complex pharmaceutical names and medicine formulations using dense vector representations rather than naive regex.',
      highlights: [
        'Utilized Hugging Face Sentence Transformers to encode catalog items into high-dimensional embedding spaces.',
        'Implemented cosine similarity ranking and indexed vector lookups, accelerating query retrieval by 40%.',
        'Built containerized FastAPI REST endpoints tested against extensive medical formulation datasets.'
      ],
      icon: Cpu,
      color: 'purple'
    },
    {
      title: 'Enterprise Multi-Tenant Cloud ERP Platform',
      category: 'Full-Stack & ERP',
      badge: 'Enterprise Architecture',
      period: 'Production System',
      metrics: '18 Modular APIs',
      techStack: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'REST APIs'],
      description: 'End-to-end multi-tenant business operating system featuring 18 independent API modules for inventory lifecycle, automated billing, CRM, and financial accounting.',
      highlights: [
        'Architected clean multi-tenant relational schema in PostgreSQL ensuring complete organization data isolation.',
        'Built 18 RESTful microservices managing automated GST invoice generation, stock ledgers, and audit trails.',
        'Created responsive React dashboard with granular role-based permissions (RBAC) and real-time alerts.'
      ],
      icon: Layers,
      color: 'amber'
    },
    {
      title: 'Medical Imaging Auto-Calibration & Capture Pipeline',
      category: 'Systems & Real-Time',
      badge: 'Pipeline Engineering',
      period: 'Vision Innovations',
      metrics: '35% Latency Drop',
      techStack: ['Python', 'FastAPI', 'PostgreSQL', 'OpenCV', 'NumPy', 'File Storage'],
      description: 'Automated data collection and calibration pipeline managing dual-format capture (.jpg for quick inspection, .npz for raw multi-dimensional matrix data) and real-time camera telemetry.',
      highlights: [
        'Optimized PostgreSQL table indexing and query plans for medical imaging schemas, cutting database latency by 35%.',
        'Implemented auto-capture trigger system with real-time marker tracking and FPS health checks.',
        'Structured file storage and hierarchical cataloging allowing instant clinical replay of capture sessions.'
      ],
      icon: Database,
      color: 'emerald'
    },
    {
      title: 'Health Insurance Premium Prediction & Risk Analytics',
      category: 'Systems & Real-Time',
      badge: 'Machine Learning',
      period: 'Academic Thesis',
      metrics: '83%+ Accuracy',
      techStack: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'NumPy', 'MERN Stack'],
      description: 'Predictive regression modeling and exploratory data analysis over 1,300+ customer records to identify critical pricing factors: age, BMI, and smoking habits.',
      highlights: [
        'Trained and validated Random Forest and XGBoost regression models reaching 83%+ predictive accuracy.',
        'Executed deep exploratory data analysis (EDA), handling categorical encoding and multi-feature collinearity.',
        'Authored comprehensive research paper detailing model evaluation, error residuals, and web integration.'
      ],
      docLink: './Thesis.pdf',
      docName: 'Read Research Thesis (PDF)',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Dairy Distribution Management & Business Analytics',
      category: 'Full-Stack & ERP',
      badge: 'Full-Stack Platform',
      period: 'Production Deployment',
      metrics: '500+ Daily Trans.',
      techStack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'Analytics'],
      description: 'Operational business platform managing 500+ daily milk collection and customer distribution transactions with automated billing and inventory replenishment alerts.',
      highlights: [
        'Designed normalized MySQL schema managing customer rosters, daily milk volume metrics, and supplier payments.',
        'Engineered business analytics dashboard delivering real-time revenue curves, debtor summaries, and sales forecasts.',
        'Replaced error-prone paper ledgers with automated receipt generation and audit logging.'
      ],
      docLink: './Dairy.pdf',
      docName: 'View Project Documentation (PDF)',
      icon: FileText,
      color: 'amber'
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-3">
            <Layers size={12} />
            <span>03 // FEATURED ENGINEERING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Key Software <span className="text-gradient-primary">Projects</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mt-3 text-sm sm:text-base">
            Real production systems, low-latency pipelines, ERP architectures, and ML models built with measurable impact.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'card-crafted text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <motion.div
                  key={p.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="card-crafted rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                >
                  <div>
                    {/* Top Meta */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {p.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        {p.metrics}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                      {p.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                          <span className="text-blue-500 font-bold shrink-0">▹</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer: Tech Stack & Links */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {p.docLink && (
                      <a
                        href={p.docLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        <FileText size={14} />
                        <span>{p.docName}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
