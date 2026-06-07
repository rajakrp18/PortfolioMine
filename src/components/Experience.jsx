import React from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
  const experiences = [
    {
      role: 'Developer (Startup)',
      company: 'Vision Innovations',
      period: 'Oct 2025 – Present',
      details: [
        'Developed backend services and data-driven application features for medical imaging platform using Python and FastAPI.',
        'Built RESTful APIs for camera calibration data processing, enabling real-time metrics tracking and storage optimization.',
        'Implemented data pipeline architecture for auto-capture (.jpg) and manual capture (.npz) with structured file management.',
        'Designed PostgreSQL database schemas for patient imaging data, calibration metrics, and user authentication.',
        'Created analytics dashboards for real-time monitoring of camera feed metrics (FPS, marker detection, baseline measurements).'
      ]
    },
    {
      role: 'Software Engineering Intern',
      company: 'Weloin Technologies',
      period: 'Jul 2025 – Sep 2025',
      details: [
        'Developed FastAPI backend services for vector search and embedding-based NLP applications with 95%+ query accuracy.',
        'Implemented sentence-transformers for text embeddings and cosine similarity algorithms for efficient information retrieval.',
        'Worked with PostgreSQL and Docker for managing structured data, embeddings storage, and containerized deployment.',
        'Optimized data retrieval performance by 40% through query optimization and indexed similarity search implementation.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 px-6 relative">
      {/* Background decorations */}
      <div className="absolute top-40 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-40 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Experience</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-transparent rounded-full"></div>

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <div key={index} className="relative flex flex-col md:flex-row justify-between items-center w-full group">
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-slate-900 border-4 border-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)] group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-300"></div>

                {/* Left Side (Empty on mobile, content or empty on desktop) */}
                <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:order-2 md:pl-16 text-left'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`card-glass p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] border border-gray-700/50 hover:border-blue-500/50`}
                  >
                    {/* Subtle gradient overlay */}
                    <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${index % 2 === 0 ? 'from-purple-600 to-blue-500' : 'from-blue-500 to-purple-600'} left-0`}></div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                    <h4 className="text-lg font-semibold text-blue-400 mb-4">{exp.company}</h4>
                    
                    <div className={`inline-block px-4 py-1.5 rounded-full bg-slate-800/80 border border-gray-700 text-sm font-medium text-gray-300 mb-6 shadow-inner ${index % 2 === 0 ? 'md:ml-auto' : ''}`}>
                      {exp.period}
                    </div>

                    <ul className={`space-y-3 text-gray-400 text-sm leading-relaxed ${index % 2 === 0 ? 'md:text-right' : 'text-left'}`}>
                      {exp.details.map((detail, idx) => (
                        <li key={idx} className={`flex items-start gap-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <span className="text-purple-400 mt-1 flex-shrink-0 text-lg leading-none">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                
                {/* Empty side for layout balancing on desktop */}
                <div className={`hidden md:block w-5/12 ${index % 2 === 0 ? 'order-2' : ''}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
