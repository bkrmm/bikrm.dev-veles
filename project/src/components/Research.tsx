import { motion } from 'framer-motion';
import { BookOpen, FlaskRound as Flask, Link, Microscope, Share2 } from 'lucide-react';

const papers = [
  {
    title: "Optimizing Neural Networks for Edge Computing",
    description: "Research focused on developing lightweight neural network architectures optimized for edge devices while maintaining high accuracy. Implemented novel pruning techniques that reduced model size by 60% with minimal performance impact.",
    link: "https://arxiv.org/papers/example",
    icon: Microscope,
    tags: ["Neural Networks", "Edge Computing", "Model Optimization"]
  },
  {
    title: "Efficient Natural Language Processing in Resource-Constrained Environments",
    description: "Developed innovative approaches for implementing NLP models in environments with limited computational resources. Achieved 40% reduction in memory usage while maintaining 95% of original accuracy.",
    link: "https://arxiv.org/papers/example2",
    icon: BookOpen,
    tags: ["NLP", "Resource Optimization", "Machine Learning"]
  }
];

const projects = [
  {
    title: "AutoML Platform for Time Series Analysis",
    description: "Built an automated machine learning platform specifically designed for time series data. The system automatically selects and tunes optimal models based on data characteristics and performance requirements.",
    link: "https://github.com/example/automl-platform",
    icon: Flask,
    tags: ["AutoML", "Time Series", "Python"]
  },
  {
    title: "Distributed Data Processing Pipeline",
    description: "Designed and implemented a scalable data processing pipeline handling 10TB+ of daily data. Utilized Apache Spark and Kafka for real-time processing and analysis.",
    link: "https://github.com/example/data-pipeline",
    icon: Share2,
    tags: ["Big Data", "Apache Spark", "Real-time Processing"]
  }
];

const ResearchItem = ({ item, index, type }: { item: typeof papers[0] | typeof projects[0], index: number, type: 'paper' | 'project' }) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    className="group relative bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-lg p-6 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden"
  >
    {/* Gradient background that appears on hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Moving gradient overlay */}
    <div 
      className="absolute inset-0 bg-[length:200%_200%] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
      style={{
        backgroundImage: 'linear-gradient(115deg, transparent 0%, transparent 40%, rgba(45, 212, 191, 0.1) 50%, transparent 60%, transparent 100%)',
        animation: 'shine 3s linear infinite'
      }}
    />

    <div className="flex items-start gap-4 relative z-10">
      <div className="p-3 bg-emerald-400/10 rounded-lg group-hover:bg-emerald-400/20 transition-colors duration-500">
        <item.icon className="w-6 h-6 text-emerald-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-emerald-400 transition-colors duration-500">
            {item.title}
          </h3>
          <a 
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-emerald-400 transition-colors duration-300"
          >
            <Link className="w-5 h-5" />
          </a>
        </div>
        <p className="text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-500 mb-4">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, i) => (
            <span 
              key={i}
              className="px-2 py-1 text-xs rounded-full bg-neutral-700/50 text-neutral-300 group-hover:bg-emerald-400/10 group-hover:text-emerald-400 transition-colors duration-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export const Research = () => {
  return (
    <section className="min-h-screen bg-neutral-900 text-neutral-50 relative py-20">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-4 opacity-5">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border border-neutral-500" />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-16 tracking-tight"
        >
          Research <span className="text-emerald-400">& Projects</span>
        </motion.h2>

        <div className="space-y-16">
          <div>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold mb-8 tracking-tight text-emerald-400"
            >
              Research Papers
            </motion.h3>
            <div className="grid gap-8">
              {papers.map((paper, index) => (
                <ResearchItem key={paper.title} item={paper} index={index} type="paper" />
              ))}
            </div>
          </div>

          <div>
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold mb-8 tracking-tight text-emerald-400"
            >
              Featured Projects
            </motion.h3>
            <div className="grid gap-8">
              {projects.map((project, index) => (
                <ResearchItem key={project.title} item={project} index={index} type="project" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};