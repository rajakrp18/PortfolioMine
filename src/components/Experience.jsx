import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Terminal, ArrowUpRight } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      role: 'AI Automation Developer',
      company: 'Miraaj Associates',
      type: 'Full-time',
      location: 'Delhi, India (On-site)',
      period: 'Sep 2026 – Present',
      current: true,
      description: 'Architecting intelligent business process automation pipelines, integrating custom Python backend services with internal ERPs, and building agentic workflows to eliminate repetitive operational bottlenecks.',
      achievements: [
        'Architected AI-driven automation pipelines and agentic integrations using Python and FastAPI to streamline enterprise operations.',
        'Engineered backend middleware connecting proprietary ERP systems with automated data processing and validation pipelines.',
        'Built scalable background task dispatchers and scheduled worker queues for automated report generation and real-time alerts.',
        'Collaborated directly with cross-functional business units to identify workflow friction and deliver rapid software solutions.'
      ],
      skills: ['Python', 'FastAPI', 'AI Automation', 'PostgreSQL', 'Docker', 'ERP Integration', 'REST APIs']
    },
    {
      role: 'Software Engineer',
      company: 'Vision Innovations',
      type: 'Full-time',
      location: 'Kolkata, West Bengal, India (On-site)',
      period: 'Sep 2025 – Aug 2026 (1 year)',
      current: false,
      description: 'Led the development of high-speed bio-signal acquisition software, camera calibration pipelines, and healthcare microservices processing high-frequency data streams.',
      achievements: [
        'Developed real-time EMG monitoring software using Python, PyQt6, PyQtGraph, and Arduino serial communication, reliably processing bio-signals at 60+ FPS with sub-50ms latency.',
        'Engineered FastAPI backend microservices and relational PostgreSQL solutions for medical imaging workflows, slashing query latency by 35%.',
        'Implemented dual data pipeline architecture supporting automated frame capture (.jpg) and high-density array capture (.npz) with structured metadata indexing.',
        'Designed normalized PostgreSQL schemas with row-level security and indexing for patient imaging records and calibration metrics.',
        'Created analytics dashboards for real-time monitoring of camera feed metrics, marker detection rates, and system baseline measurements.'
      ],
      skills: ['Python', 'FastAPI', 'PyQt6', 'PyQtGraph', 'Arduino Serial', 'PostgreSQL', 'OpenCV', 'Data Pipelines']
    },
    {
      role: 'Software Engineer Intern',
      company: 'Weloin Global Private Limited',
      type: 'Internship',
      location: 'Kolkata, West Bengal, India (On-site)',
      period: 'Jul 2025 – Sep 2025 (3 months)',
      current: false,
      description: 'Built vector similarity search pipelines, natural language processing models, and containerized backend services for automated medicine matching.',
      achievements: [
        'Developed an NLP-based medicine matching system using Hugging Face Sentence Transformers and vector similarity, achieving 95%+ matching accuracy.',
        'Optimized vector database queries and cosine similarity search algorithms, achieving 40% faster information retrieval.',
        'Developed containerized FastAPI microservices and PostgreSQL schemas for embeddings storage and semantic text search.',
        'Managed Dockerized development environments and created automated testing scripts for API endpoint validation.'
      ],
      skills: ['Python', 'FastAPI', 'Hugging Face', 'Sentence Transformers', 'Vector Search', 'PostgreSQL', 'Docker']
    }
  ];

  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-3">
            <Briefcase size={12} />
            <span>02 // CAREER TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Professional <span className="text-gradient-primary">Experience</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mt-3 text-sm sm:text-base">
            Hands-on software engineering across AI automation, real-time medical hardware systems, and NLP vector search.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Timeline Indicator Dot */}
              <div 
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 ${
                  exp.current 
                    ? 'border-emerald-500 bg-white dark:bg-slate-950 shadow-md shadow-emerald-500/30 ring-4 ring-emerald-500/20' 
                    : 'border-blue-500 bg-white dark:bg-slate-950'
                }`}
              />

              {/* Experience Card */}
              <div className="card-crafted rounded-2xl p-6 sm:p-8 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Current Role
                        </span>
                      )}
                    </div>
                    <div className="text-base font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                      {exp.company} <span className="text-slate-400 font-normal">• {exp.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end text-xs font-mono text-slate-500 dark:text-slate-400 gap-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Brief context */}
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                  {exp.description}
                </p>

                {/* Bulleted Achievements */}
                <div className="space-y-2.5 mb-6">
                  {exp.achievements.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Stack:</span>
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
