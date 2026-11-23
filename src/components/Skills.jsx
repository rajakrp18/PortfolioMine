import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Server, 
  Layout, 
  Database, 
  Cpu, 
  Wrench 
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code2,
      badge: 'Core Syntax',
      color: 'blue',
      skills: [
        { name: 'TypeScript', level: 'Production' },
        { name: 'Python', level: 'Production' },
        { name: 'JavaScript (ES6+)', level: 'Production' },
        { name: 'SQL', level: 'Production' },
        { name: 'C / C++', level: 'Core CS' },
        { name: 'HTML5 / CSS3', level: 'Production' }
      ]
    },
    {
      title: 'Backend & Systems',
      icon: Server,
      badge: 'High Throughput',
      color: 'emerald',
      skills: [
        { name: 'FastAPI (Async)', level: 'Production' },
        { name: 'Node.js & Express', level: 'Production' },
        { name: 'SQLAlchemy 2.0 (Async)', level: 'Production' },
        { name: 'RESTful API Architecture', level: 'Production' },
        { name: 'JWT & RBAC Middleware', level: 'Security' },
        { name: 'WebSockets', level: 'Real-Time' }
      ]
    },
    {
      title: 'Frontend & UI Engineering',
      icon: Layout,
      badge: 'Reactive UI',
      color: 'purple',
      skills: [
        { name: 'Next.js 14 (App Router)', level: 'Production' },
        { name: 'React 18', level: 'Production' },
        { name: 'Tailwind CSS', level: 'Production' },
        { name: 'React Query & Zustand', level: 'State/Cache' },
        { name: 'Responsive Systems', level: 'Production' },
        { name: 'Framer Motion', level: 'Micro-animations' }
      ]
    },
    {
      title: 'Databases & Caching',
      icon: Database,
      badge: 'Data Integrity',
      color: 'amber',
      skills: [
        { name: 'PostgreSQL (RLS & Indexing)', level: 'Production' },
        { name: 'Redis (Caching & Queues)', level: 'Scale' },
        { name: 'SQLite / aiosqlite', level: 'Async Embedded' },
        { name: 'MySQL', level: 'Production' },
        { name: 'Schema Design & Normalization', level: 'Enterprise' },
        { name: 'Vector Search / Cosine', level: 'Embeddings' }
      ]
    },
    {
      title: 'AI, RAG & Multi-Agent',
      icon: Cpu,
      badge: 'Applied AI',
      color: 'pink',
      skills: [
        { name: 'Google Gemini 2.5/3.6 Flash', level: 'Production' },
        { name: 'Legal & Enterprise RAG', level: 'Grounded Citations' },
        { name: 'Multi-Agent Architectures', level: 'State Machines' },
        { name: 'Transformers.js / Xenova', level: 'Offline Inference' },
        { name: 'Sentence Transformers', level: 'Semantic Search' },
        { name: 'LangChain & LangGraph', level: 'Workflows' }
      ]
    },
    {
      title: 'DevOps, Testing & Tooling',
      icon: Wrench,
      badge: 'Quality & CI/CD',
      color: 'cyan',
      skills: [
        { name: 'Docker & Containerization', level: 'Production' },
        { name: 'Playwright (E2E Testing)', level: 'Automated QA' },
        { name: 'Git & GitHub Actions (CI/CD)', level: 'DevOps' },
        { name: 'Vercel Deployment', level: 'Cloud Edge' },
        { name: 'Puppeteer (Stealth Scraping)', level: 'OSINT Automation' },
        { name: 'Postman & Swagger UI', level: 'API Testing' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-3">
            <Code2 size={12} />
            <span>05 // TECHNICAL ARSENAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skills & <span className="text-gradient-primary">Technologies</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mt-3 text-sm sm:text-base">
            Categorized by practical, hands-on production application across AI systems, full-stack web, and database scaling.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card-crafted rounded-2xl p-6 sm:p-7 hover:border-blue-400 dark:hover:border-blue-500 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {cat.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Skills Pill List */}
                  <div className="space-y-2.5">
                    {cat.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 group-hover:border-slate-200 dark:group-hover:border-slate-700/80 transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                          {skill.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Skills;
