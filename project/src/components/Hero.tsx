import { motion } from 'framer-motion';
import { Brain, Code, Database } from 'lucide-react';

export const Hero = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col justify-center items-center bg-neutral-900 text-neutral-50 relative overflow-hidden"
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, theme(colors.neutral.800/10) 1px, transparent 1px),
            linear-gradient(to bottom, theme(colors.neutral.800/10) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, theme(colors.neutral.800/5) 1px, transparent 1px),
            linear-gradient(to bottom, theme(colors.neutral.800/5) 1px, transparent 1px)
          `,
          backgroundSize: '1rem 1rem',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-8 tracking-tight"
        >
          <span className="animate-gradient text-transparent">bikr<span className="text-red-500">a</span>m.dev</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          ML Engineer
          <br />
          <span className="text-emerald-400">&</span> Data Analyst
        </motion.h1>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex gap-8 mb-12"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-400" />
            <span>Machine Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <span>Data Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-emerald-400" />
            <span>Development</span>
          </div>
        </motion.div>

        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg text-neutral-400 max-w-2xl leading-relaxed"
        >
          Transforming complex data into actionable insights through innovative machine learning solutions and robust data analysis.
        </motion.p>
      </div>

      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-500">Scroll to explore</span>
          <div className="w-1 h-12 bg-neutral-800 rounded-full">
            <motion.div 
              className="w-1 h-3 bg-emerald-400 rounded-full"
              animate={{ 
                y: [0, 36, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};