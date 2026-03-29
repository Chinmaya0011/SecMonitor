import { motion } from "framer-motion";
import {
  Terminal,
  Server,
  Database,
  Lock,
  FileText,
  Shield,
  Timer,
  Network,
  CheckCircle,
  Code2,
  Zap,
  Activity,
  Eye
} from "lucide-react";

const TechStackSection = () => {
  const backendTech = [
    { name: "Express.js", version: "5.2.1", desc: "Web Framework", icon: Server },
    { name: "MongoDB", version: "9.3.2", desc: "Database", icon: Database },
    { name: "JWT", version: "9.0.3", desc: "Authentication", icon: Lock },
    { name: "Winston", version: "3.19.0", desc: "Logging", icon: FileText },
    { name: "Helmet", version: "8.1.0", desc: "Security", icon: Shield },
    { name: "Rate Limit", version: "8.3.1", desc: "API Protection", icon: Timer },
    { name: "AMQP", version: "0.10.9", desc: "Message Queue", icon: Network },
    { name: "Zod", version: "4.3.6", desc: "Validation", icon: CheckCircle }
  ];

  const frontendTech = [
    { name: "Next.js", version: "16.2.0", desc: "React Framework", icon: Code2 },
    { name: "React", version: "19.2.4", desc: "UI Library", icon: Zap },
    { name: "Framer Motion", version: "12.38.0", desc: "Animations", icon: Activity },
    { name: "Tailwind CSS", version: "4.0", desc: "Styling", icon: Eye },
    { name: "Lucide React", version: "1.7.0", desc: "Icons", icon: Shield },
    { name: "ESLint", version: "9.0", desc: "Code Quality", icon: CheckCircle }
  ];

  const TechCard = ({ tech, index, colorClass }) => {
    const IconComponent = tech.icon;
    return (
      <motion.div
        className={`group relative p-6 bg-gradient-to-br from-card to-background-secondary border ${colorClass} rounded-xl hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 backdrop-blur-sm`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-accent-dim/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <IconComponent className="w-6 h-6 text-accent" />
          </div>
          <div>
            <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
              {tech.name}
            </div>
            <div className="text-xs text-foreground-secondary">v{tech.version}</div>
          </div>
        </div>
        <p className="text-sm text-foreground-secondary">{tech.desc}</p>
      </motion.div>
    );
  };

  return (
    <section className="py-32 px-6 border-t border-gray-800 bg-gradient-to-br from-black via-gray-900 to-black relative">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Terminal className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono text-accent font-semibold">TECH STACK</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            Built with Modern Technologies
          </h2>
          <p className="text-foreground-secondary text-xl max-w-2xl mx-auto leading-relaxed">
            Leveraging industry-standard tools and frameworks for robust, scalable, and secure backend logging infrastructure
          </p>
        </motion.div>

        {/* Backend Technologies */}
        <div className="mb-20">
          <motion.h3
            className="text-2xl font-bold text-center mb-12 text-green-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Backend Stack
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {backendTech.map((tech, index) => (
              <TechCard key={index} tech={tech} index={index} colorClass="border-green-500/20" />
            ))}
          </div>
        </div>

        {/* Frontend Technologies */}
        <div>
          <motion.h3
            className="text-2xl font-bold text-center mb-12 text-green-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frontend Stack
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {frontendTech.map((tech, index) => (
              <TechCard key={index} tech={tech} index={index} colorClass="border-green-500/20" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;