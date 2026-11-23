import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  Database, 
  Cpu, 
  Layers, 
  ArrowUpRight, 
  Shield, 
  Search, 
  Activity 
} from 'lucide-react';
import { GitHubIcon } from './SocialIcons';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Applied AI & RAG', 'Full-Stack & ERP', 'Systems & Search'];

  const projects = [
    {
      title: 'Zewar Desk — Multi-Tenant Jewellery ERP',
      category: 'Full-Stack & ERP',
      badge: 'Flagship ERP',
      period: 'Independent Product',
      metrics: '18 Modular APIs • 4 Domains',
      techStack: ['Next.js 14', 'TypeScript', 'Express.js', 'PostgreSQL', 'Tailwind CSS', 'Zustand', 'React Query', 'Playwright'],
      description: 'Production-ready multi-tenant ERP platform architected across 4 core business domains: inventory lifecycle, automated billing, customer CRM, and reporting with airtight tenant data isolation.',
      highlights: [
        'Architected 18+ modular REST APIs and per-company/per-fiscal-year database isolation to enforce role-scoped authorization.',
        'Implemented JWT HTTP-only cookie authentication and RBAC middleware securing workflows across admin, staff, and billing tiers.',
        'Built 50+ frontend views with React Query and Zustand for client cache synchronization and automated E2E flows with Playwright.'
      ],
      githubLink: 'https://github.com/rajakrp18',
      icon: Layers,
      color: 'amber'
    },
    {
      title: 'Cyber Law Watch Agent (LexSentry)',
      category: 'Applied AI & RAG',
      badge: 'Regulatory AI & RAG',
      period: 'Miraaj Associates',
      metrics: '8 Judicial Sources • Sub-10ms API',
      techStack: ['FastAPI', 'Next.js 14', 'SQLAlchemy 2.0 (Async)', 'Google Gemini API', 'Docker', 'aiosqlite', 'LangGraph'],
      description: 'Autonomous regulatory & judicial intelligence platform continuously monitoring Supreme Court & High Court precedents, RBI directions, and CERT-In advisories with automated legal RAG copilot.',
      highlights: [
        'Continuously ingests, filters, and priority-scores (P0–P2) rulings across 8 authoritative constitutional courts and regulatory bodies.',
        'Built multi-turn Legal RAG Copilot with source-grounded certified PDF citations and local statutory ratio fallback for 100% offline uptime.',
        'Engineered in-app API key diagnostics panel with live roundtrip ping testing and in-memory hot-reloading without server restarts.'
      ],
      githubLink: 'https://github.com/rajakrp18/cyberlaw-watchdog',
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'Contact Finder & Project Researcher (Enterprise Monorepo)',
      category: 'Applied AI & RAG',
      badge: 'Multi-Agent Monorepo',
      period: 'Vision Innovations',
      metrics: '4-Agent Pipeline • Vercel Live',
      techStack: ['Next.js', 'TypeScript', 'Transformers.js', 'Google Gemini API', 'Puppeteer', 'SQLite', 'Vercel'],
      description: 'Enterprise AI monorepo combining an Indian OSINT contact-attribution and phone verification engine with an automated software architecture PRD generator.',
      highlights: [
        'Engineered 4-agent investigation pipeline (Coordinator, Researcher, Extractor, Verifier) with 0–100% multi-factor confidence scoring.',
        'Combined high-speed regex, offline semantic chunking (Transformers.js), and Gemini 3.6 Flash / Vision OCR for obfuscated canvas records.',
        'Built bulk CSV/PDF dividend record parsing, exponential backoff rate limiting, OpenRouter fallback, and client BYOK key management.'
      ],
      githubLink: 'https://github.com/rajakrp18/Project-Researcher',
      liveLink: 'https://project-researcher-contact-finder.vercel.app',
      icon: Cpu,
      color: 'purple'
    },
    {
      title: 'Medical Imaging Data Pipeline & Service',
      category: 'Systems & Search',
      badge: 'High-Throughput Systems',
      period: 'Vision Innovations',
      metrics: 'Dual-Format Pipeline • Fast Indexing',
      techStack: ['Python', 'FastAPI', 'PostgreSQL', 'OpenCV', 'NumPy', 'Docker'],
      description: 'Automated data collection and calibration pipeline managing dual-format capture (.jpg for inspection, .npz for raw multi-dimensional matrix data) and real-time camera telemetry.',
      highlights: [
        'Optimized PostgreSQL table indexing and query plans for medical imaging schemas to handle high-frequency writes.',
        'Implemented auto-capture trigger system with real-time marker tracking and FPS health checks.',
        'Structured file storage and hierarchical cataloging allowing instant clinical replay of capture sessions.'
      ],
      icon: Database,
      color: 'emerald'
    },
    {
      title: 'NLP Semantic Medicine Matching & Vector Search Engine',
      category: 'Systems & Search',
      badge: 'Vector Search / NLP',
      period: 'Weloin Global',
      metrics: 'Dense Vector Search • Sub-100ms',
      techStack: ['Python', 'FastAPI', 'Hugging Face', 'Sentence Transformers', 'PostgreSQL', 'Docker'],
      description: 'Intelligent semantic search service retrieving pharmacologically equivalent alternatives using dense vector representations rather than naive regex.',
      highlights: [
        'Utilized Hugging Face Sentence Transformers to encode pharmaceutical items into high-dimensional embedding spaces.',
        'Implemented cosine similarity ranking and indexed PostgreSQL vector lookups for rapid information retrieval.',
        'Built containerized FastAPI REST microservices tested against extensive medical formulation datasets.'
      ],
      icon: Search,
      color: 'blue'
    },
    {
      title: 'Dairy Distribution Management & Business Analytics',
      category: 'Full-Stack & ERP',
      badge: 'Production Platform',
      period: 'Production Deployment',
      metrics: '500+ Daily Trans.',
      techStack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'Analytics'],
      description: 'Operational business platform managing 500+ daily milk collection and customer distribution transactions with automated billing and inventory replenishment alerts.',
      highlights: [
        'Designed normalized MySQL schema managing customer rosters, daily milk volume metrics, and supplier payments.',
        'Engineered business analytics dashboard delivering real-time revenue curves, debtor summaries, and sales forecasts.',
        'Replaced manual paper ledgers with automated receipt generation and audit logging.'
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
            Autonomous AI systems, multi-tenant ERP platforms, legal RAG copilot, and high-throughput backend pipelines.
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
            {filteredProjects.map((p) => {
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
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <IconComp size={15} />
                        </div>
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {p.badge}
                        </span>
                      </div>
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

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {p.liveLink && (
                        <a
                          href={p.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                        >
                          <ExternalLink size={13} />
                          <span>Live Demo</span>
                          <ArrowUpRight size={12} />
                        </a>
                      )}

                      {p.githubLink && (
                        <a
                          href={p.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-xs"
                        >
                          <GitHubIcon size={13} />
                          <span>Code Repository</span>
                          <ArrowUpRight size={12} className="opacity-60" />
                        </a>
                      )}

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
