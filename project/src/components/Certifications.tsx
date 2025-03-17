import { motion } from 'framer-motion';
import { Award, Brain, Database, Notebook as Robot, Sparkles } from 'lucide-react';

const certifications = [
  {
    title: "Microsoft Certified Azure AI Engineer",
    description: "Designed and implemented AI solutions using Azure AI services, including Cognitive Services, AI Search, and OpenAI. Collaborated across development phases.",
    icon: Brain
  },
  {
    title: "Google Certified Data Analyst",
    description: "Analyzed and processed complex datasets using tools such as spreadsheets, SQL, R, and Tableau. Developed data visualizations and dashboards to effectively communicate insights to stakeholders.",
    icon: Database
  },
  {
    title: "FCC Certified Machine Learning Developer",
    description: "Developed and deployed machine learning models using Python libraries such as TensorFlow and Scikit-Learn. Gained hands-on experience through projects like building neural networks for image classification and implementing natural language processing algorithms.",
    icon: Sparkles
  },
  {
    title: "UIPath Completion Certification in Specialized AI & RPA Engineer Professional",
    description: "Developed AI-driven automation solutions using UiPath's Document Understanding, Communications Mining, and AI Center. Independently built and led production level automations, enhancing operational efficiency.",
    icon: Robot
  },
  {
    title: "Alteryx Certified Machine Learning Micro-Credential",
    description: "Earned certification in machine learning fundamentals, focusing on data preparation, feature engineering, model selection, and evaluation. Demonstrated ability to build and interpret ML models for data-driven decision-making.",
    icon: Award
  }
];

export const Certifications = () => {
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
          Professional <span className="text-emerald-400">Certifications</span>
        </motion.h2>

        <div className="grid gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-lg p-6 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden"
            >
              {/* Gradient background that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Moving gradient overlay */}
              <div className="absolute inset-0 bg-[length:200%_200%] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  backgroundImage: 'linear-gradient(115deg, transparent 0%, transparent 40%, rgba(45, 212, 191, 0.1) 50%, transparent 60%, transparent 100%)',
                  animation: 'shine 3s linear infinite'
                }}
              />

              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-emerald-400/10 rounded-lg group-hover:bg-emerald-400/20 transition-colors duration-500">
                  <cert.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-emerald-400 transition-colors duration-500">{cert.title}</h3>
                  <p className="text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-500">{cert.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};