import React from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming',
      skills: ['Python', 'SQL', 'JavaScript', 'HTML', 'CSS']
    },
    {
      title: 'Data Analysis',
      skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Data Cleaning', 'EDA', 'Feature Engineering', 'Statistical Analysis']
    },
    {
      title: 'Visualization',
      skills: ['Power BI', 'Matplotlib', 'Seaborn', 'Tableau', 'Excel']
    },
    {
      title: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Database Design', 'Query Optimization']
    },
    {
      title: 'Tools & Platforms',
      skills: ['Git', 'GitHub', 'Docker', 'Postman', 'AWS', 'GCP', 'Jupyter Notebook']
    },
    {
      title: 'Frameworks',
      skills: ['FastAPI', 'Flask', 'React', 'TensorFlow', 'PyTorch', 'Sentence Transformers']
    }
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Technical <span className="text-blue-500">Skills</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-glass p-6 rounded-2xl border-t border-gray-700 hover:-tranzinc-y-2 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm font-medium border border-gray-700 hover:border-blue-500 hover:text-white transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
