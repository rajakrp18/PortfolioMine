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
    <section id="experience" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Professional <span className="text-blue-500">Experience</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="card-glass p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                  <p className="text-blue-400 font-medium text-lg">{exp.company}</p>
                </div>
                <div className="px-4 py-2 bg-slate-800 rounded-full text-gray-300 text-sm whitespace-nowrap font-medium w-fit border border-gray-700">
                  {exp.period}
                </div>
              </div>
              <ul className="space-y-3 text-gray-400">
                {exp.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1.5 flex-shrink-0">▹</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
