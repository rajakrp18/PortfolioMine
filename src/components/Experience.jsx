import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Terminal, ArrowUpRight } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      role: 'Software Engineer (AI & Full-Stack)',
      company: 'Miraaj Associates',
      type: 'Full-time',
      location: 'Delhi, India (On-site)',
      period: 'Aug 2026 – Oct 2026 (3 months)',
      current: false,
      description: 'Architecting autonomous regulatory intelligence platforms, multi-turn legal RAG copilots, and enterprise AI automation services connecting judicial databases with internal workflows.',
      achievements: [
        'Architected Cyber Law Watch Agent (LexSentry), an async full-stack regulatory intelligence platform using FastAPI, SQLAlchemy 2.0 (aiosqlite), and Next.js 14 to ingest, filter, and priority-score (P0–P2) rulings across 8 judicial and regulatory sources (Supreme Court, High Courts, RBI, CERT-In).',
        'Engineered a multi-turn Legal RAG Copilot using async Gemini API calls with source-grounded PDF citations, automated client advisory drafting, and a local statutory fallback engine for graceful degradation when external LLM APIs are unavailable.',
        'Built an in-app diagnostics and hot-reload configuration module to validate API keys via live roundtrip latency checks and update runtime backend settings without server restarts, alongside a standalone Windows desktop launcher and Docker deployment setup.',
        'Designed CMS matter impact mapping cross-referencing incoming rulings against active practice files, generating T-63 associate litigation tasks and court-ready petition clauses under Section 457 Cr.P.C. / Section 503 BNSS.'
      ],
      skills: ['FastAPI', 'Next.js 14', 'Python', 'Google Gemini API', 'SQLAlchemy 2.0 (Async)', 'LangChain / LangGraph', 'Docker', 'REST APIs']
    },
    {
      role: 'Software Developer',
      company: 'Vision Innovations',
      type: 'Full-time',
      location: 'Kolkata, West Bengal, India (On-site)',
      period: 'Sep 2025 – Aug 2026 (1 year)',
      current: false,
      description: 'Architected enterprise AI monorepo platforms, multi-agent OSINT pipelines, and high-throughput backend services and PostgreSQL database optimizations.',
      achievements: [
        'Architected a 2-app TypeScript / Next.js monorepo combining an OSINT contact-attribution engine (Contact Finder) and an AI software blueprint/PRD generator (Project Researcher), deployed live on Vercel.',
        'Engineered a 4-agent investigation pipeline (Coordinator, Researcher, Extractor, Verifier) combining regex parsing, offline semantic chunking (Transformers.js), Gemini Flash/Vision OCR, and a weighted 0–100% multi-factor identity confidence scoring model.',
        'Built bulk CSV/PDF dividend statement ingestion workflows with exponential backoff rate-limit handling, OpenRouter LLM fallback, and BYOK (Bring Your Own Key) client-side API key management.',
        'Deployed FastAPI microservices and optimized PostgreSQL relational schemas and REST API data flows for high-throughput workloads, supporting structured file formats (.jpg, .npz) and real-time feed-quality analytics.'
      ],
      skills: ['TypeScript', 'Next.js', 'React', 'FastAPI', 'Python', 'Google Gemini API', 'Transformers.js', 'Puppeteer', 'PostgreSQL', 'SQLite']
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
        'Engineered an NLP-based medicine matching engine using Hugging Face Sentence Transformers and cosine similarity to retrieve pharmacologically equivalent alternatives when exact matches were unavailable.',
        'Built FastAPI vector-search services and automated data extraction pipelines across medicine and inventory domains for embedding-based fuzzy matching.',
        'Containerized the NLP stack with Docker and managed embedding storage and indexed similarity queries in PostgreSQL.',
        'Optimized similarity search algorithms and database indexing to deliver sub-100ms vector lookup responses across medical formulation datasets.'
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
