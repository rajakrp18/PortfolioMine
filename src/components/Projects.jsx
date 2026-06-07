import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: 'Health Insurance Premium Prediction & Analysis',
      date: 'Apr 2023 – Apr 2024',
      techStack: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'NumPy', 'MERN Stack'],
      description: [
        'Built machine learning regression model predicting insurance premiums with 83%+ accuracy using Random Forest and XGBoost.',
        'Cleaned and processed 1,300+ customer records using Pandas, handling missing values, outliers, and categorical encoding.',
        'Performed comprehensive exploratory data analysis (EDA) revealing key factors: age, BMI, smoking status impact premiums.'
      ],
      docLink: '/Thesis.pdf'
    },
    {
      title: 'Dairy Management System with Analytics',
      date: 'Jan 2022 – Apr 2022',
      techStack: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
      description: [
        'Developed full-stack management system handling 500+ daily transactions with inventory tracking and billing automation.',
        'Designed MySQL database with normalized schema for customer records, transactions, and inventory management.',
        'Built analytics dashboard showing daily sales trends, top customers, inventory levels, and revenue forecasting.'
      ],
      docLink: '/Dairy.pdf'
    }
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Key <span className="text-blue-500">Projects</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="card-glass rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">{project.title}</h3>
                  <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap ml-4">{project.date}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className="space-y-3 mb-8">
                  {project.description.map((desc, idx) => (
                    <li key={idx} className="text-gray-400 flex items-start gap-2 text-sm leading-relaxed">
                      <span className="text-purple-500 mt-1">▹</span>
                      {desc}
                    </li>
                  ))}
                </ul>

                {project.docLink && (
                  <a href={project.docLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-medium transition-colors">
                    <FileText size={16} /> View Docs <ExternalLink size={14} className="ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
