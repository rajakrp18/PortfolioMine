import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Server, 
  Layout, 
  Database, 
  Cpu, 
  Wrench, 
  Terminal, 
  CheckCircle2 
} from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code2,
      badge: 'Core Syntax',
      color: 'blue',
      skills: [
        { name: 'Python', level: 'Production' },
        { name: 'JavaScript (ES6+)', level: 'Production' },
        { name: 'TypeScript', level: 'Intermediate' },
        { name: 'SQL', level: 'Production' },
        { name: 'C / C++', level: 'Academic Core' },
        { name: 'HTML5 / CSS3', level: 'Production' }
      ]
    },
    {
      title: 'Backend & Systems',
      icon: Server,
      badge: 'High Throughput',
      color: 'emerald',
      skills: [
        { name: 'FastAPI', level: 'Production' },
        { name: 'Node.js & Express', level: 'Production' },
        { name: 'RESTful API Architecture', level: 'Production' },
        { name: 'Serial Communication (Arduino)', level: 'Hardware I/O' },
        { name: 'WebSockets', level: 'Real-Time' },
        { name: 'Flask', level: 'Experienced' }
      ]
    },
    {
      title: 'Frontend & UI Engineering',
      icon: Layout,
      badge: 'Reactive UI',
      color: 'purple',
      skills: [
        { name: 'React', level: 'Production' },
        { name: 'Next.js', level: 'Production' },
        { name: 'Tailwind CSS', level: 'Production' },
        { name: 'Framer Motion', level: 'Micro-animations' },
        { name: 'Responsive Layouts', level: 'Production' },
        { name: 'State Management', level: 'Production' }
      ]
    },
    {
      title: 'Databases & Vector Search',
      icon: Database,
      badge: 'Data Integrity',
      color: 'amber',
      skills: [
        { name: 'PostgreSQL', level: 'Production' },
        { name: 'Vector Search / Cosine', level: 'Embeddings' },
        { name: 'MongoDB', level: 'Experienced' },
        { name: 'MySQL', level: 'Production' },
        { name: 'Schema Design & RLS', level: 'Enterprise' },
        { name: 'Index Optimization', level: 'Performance' }
      ]
    },
    {
      title: 'AI, ML & NLP',
      icon: Cpu,
      badge: 'Applied AI',
      color: 'pink',
      skills: [
        { name: 'Hugging Face Transformers', level: 'Production' },
        { name: 'Sentence Transformers', level: 'Production' },
        { name: 'Scikit-learn', level: 'Experienced' },
        { name: 'XGBoost & Random Forest', level: 'Regression/Clf' },
        { name: 'Pandas & NumPy', level: 'Data Science' },
        { name: 'EDA & Feature Engineering', level: 'Analytical' }
      ]
    },
    {
      title: 'DevOps & Tooling',
      icon: Wrench,
      badge: 'Workflow',
      color: 'cyan',
      skills: [
        { name: 'Docker', level: 'Containers' },
        { name: 'Git & GitHub', level: 'Version Control' },
        { name: 'Postman', level: 'API Testing' },
        { name: 'Linux / Bash', level: 'Systems' },
        { name: 'PyQt6 & PyQtGraph', level: 'Desktop GUI' },
        { name: 'OpenCV', level: 'Computer Vision' }
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
            Categorized by practical, hands-on production application rather than checklist theoretical familiarity.
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
