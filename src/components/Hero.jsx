import React from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronDown } from 'lucide-react';
import { Link } from 'react-scroll';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>

      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/mypic.jpg" alt="Raj Poddar" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-top border-4 border-blue-500/30 shadow-2xl mb-8 mx-auto" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-lg md:text-xl tracking-widest uppercase mb-4 font-semibold"
        >
          Hi, I'm Raj Poddar
        </motion.h2>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight"
        >
          Data Analyst & <br /> <span className="text-gradient">Backend Developer</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
        >
          Transforming complex data into actionable insights and building robust backend services for high-performance applications.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="projects" smooth={true} duration={500} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full cursor-pointer transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
            Explore My Work
          </Link>
          <a href="/Raj_Poddar_Data_Analyst_Resume-compressed.pdf" download className="px-8 py-4 card-glass hover:bg-gray-800 text-white font-medium rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105">
            <Download size={20} /> Download Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 animate-bounce"
        >
          <Link to="about" smooth={true} duration={500} className="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <ChevronDown size={32} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
