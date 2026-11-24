import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Terminal, ArrowUpRight } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      role: 'Software Engineer',
      company: 'Miraaj Associates',
      type: 'Full-time',
      location: 'New Delhi, India (On-site)',
      period: 'Oct 2025 – Oct 2026 (1 year)',
      current: false,
      description: 'Architected full-stack web applications, asynchronous REST APIs, and applied AI pipelines spanning regulatory intelligence (LexSentry), multi-agent OSINT engines (Contact Finder), and multi-tenant ERP platforms (Zewar Desk).',
      achievements: [
        'Architected Cyber Law Watch Agent (LexSentry), an async regulatory platform (FastAPI, SQLAlchemy 2.0, Next.js 14) ingesting and priority-scoring (P0–P2) precedents across 8 judicial and regulatory sources, replacing manual multi-portal checks.',
        'Developed a multi-turn Legal RAG Copilot (Gemini API) with source-grounded PDF citations, automated client advisory drafting, hot-reload API key diagnostics, and an offline statutory fallback maintaining 100% uptime without external LLM access.',
        'Built a 2-app TypeScript/Next.js monorepo (Contact Finder & Project Researcher) deployed on Vercel, supporting batch OSINT investigation of 20+ subjects per run via CSV and AI PDF-to-CSV ingestion.',
        'Orchestrated a 4-agent extraction pipeline (Coordinator, Researcher, Extractor, Verifier) integrating regex, offline Transformers.js chunking, and Gemini Vision OCR with a 0–100% multi-factor confidence scoring model and OpenRouter fallback.',
        'Designed a multi-tenant Jewellery ERP platform (Next.js, Node.js, PostgreSQL) comprising 18 modular REST APIs across 4 core business domains: inventory, billing, customer CRM, and automated reporting.',
        'Secured multi-role ERP endpoints using JWT HTTP-only cookies and RBAC middleware, enforcing strict role-scoped authorization and tenant isolation across admin, staff, and billing workflows.'
      ],
      skills: ['Next.js 14', 'TypeScript', 'Node.js', 'FastAPI', 'PostgreSQL', 'SQLAlchemy 2.0 (Async)', 'SQLite', 'Gemini API', 'Transformers.js', 'Docker']
    },
    {
      role: 'Software Engineering Intern',
      company: 'Weloin Technologies',
      type: 'Internship',
      location: 'Kolkata, West Bengal, India (On-site)',
      period: 'Jul 2025 – Sep 2025 (3 months)',
      current: false,
      description: 'Built vector similarity search pipelines, natural language processing models, and containerized backend services for automated medicine matching.',
      achievements: [
        'Engineered an NLP medicine-matching engine using Hugging Face Sentence Transformers and cosine similarity to retrieve pharmacologically equivalent substitutes when exact catalog matches were unavailable.',
        'Automated data extraction pipelines and FastAPI vector-search services across 2 data domains (medicine and inventory), indexing embeddings in PostgreSQL for fast fuzzy retrieval.',
        'Containerized the end-to-end NLP and API stack with Docker, standardizing local development and reproducible deployment environments.'
      ],
      skills: ['Python', 'FastAPI', 'Hugging Face', 'Sentence Transformers', 'PostgreSQL', 'Docker']
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
            Hands-on software engineering across autonomous AI systems, multi-agent OSINT pipelines, and NLP vector search.
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
