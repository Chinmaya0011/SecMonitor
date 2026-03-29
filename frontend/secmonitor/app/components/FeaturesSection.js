import { motion } from "framer-motion";
import {
  FileText,
  Server,
  AlertTriangle,
  Eye,
  Timer,
  Database,
  Lock
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Request Logging",
      description: "Complete HTTP request capture including headers, body, and client information for security analysis",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: Server,
      title: "Response Tracking",
      description: "Monitor all HTTP responses with status codes, timing, and content for anomaly detection",
      color: "from-blue-500/20 to-green-500/20"
    },
    {
      icon: AlertTriangle,
      title: "Security Event Detection",
      description: "Automated identification of security-relevant events and potential attack patterns",
      color: "from-red-500/20 to-green-500/20"
    },
    {
      icon: Eye,
      title: "Audit Trail",
      description: "Immutable logging of all security events with timestamps and user context",
      color: "from-green-500/20 to-blue-500/20"
    },
    {
      icon: Timer,
      title: "Real-time Monitoring",
      description: "Live monitoring and alerting for security events and system anomalies",
      color: "from-green-600/20 to-green-500/20"
    },
    {
      icon: Database,
      title: "Secure Storage",
      description: "Encrypted audit log storage with access controls and retention policies",
      color: "from-green-500/20 to-green-600/20"
    }
  ];

  return (
    <section className="py-32 px-6 border-t border-gray-800 relative">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Lock className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono text-accent font-semibold">SECURITY CONTROLS</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            OWASP A09 Implementation
          </h2>
          <p className="text-foreground-secondary text-xl max-w-2xl mx-auto leading-relaxed">
            Comprehensive logging and monitoring controls to ensure security visibility and audit capabilities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className={`group relative p-8 bg-gradient-to-br ${feature.color} border border-accent/20 rounded-2xl hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 backdrop-blur-sm overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent-dim/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-accent" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;