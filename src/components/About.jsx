import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">About <span className="text-blue-500">Me</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl transform rotate-3 scale-105 opacity-50 blur-lg"></div>
              <img src="/mypic.jpg" alt="Raj Poddar" className="relative rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-gray-800" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 text-lg leading-relaxed space-y-6"
          >
            <p>
              I'm a Data Analyst and MCA graduate with hands-on experience in Python, SQL, and data visualization. I am skilled in performing data cleaning, exploratory data analysis (EDA), and building analytical dashboards to derive actionable insights from structured and unstructured datasets.
            </p>
            <p>
              I have a proven track record working in startup environments, with expertise in backend development, API integration, and data-driven applications. I am passionate about leveraging data analytics, machine learning, and visualization tools to support business decision-making and drive measurable outcomes.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="card-glass px-6 py-3 rounded-lg text-white font-medium">
                <span className="text-blue-500 font-bold block text-2xl">MCA</span>
                JIS College of Engineering
              </div>
              <div className="card-glass px-6 py-3 rounded-lg text-white font-medium">
                <span className="text-purple-500 font-bold block text-2xl">B.Sc.</span>
                Kanchrapara College
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
