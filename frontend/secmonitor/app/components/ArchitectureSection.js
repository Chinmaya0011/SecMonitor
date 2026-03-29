import { motion } from "framer-motion";
import VideoGifAnimation from "@/components/VideoGifAnimation";
import {
  Code2,
  CheckCircle
} from "lucide-react";

const ArchitectureSection = () => {
  const architecturePoints = [
    "Express.js middleware for request/response interception",
    "MongoDB with encrypted audit collections",
    "JWT-based authentication with role-based access",
    "Real-time WebSocket monitoring dashboard",
    "Automated log rotation and retention policies",
    "OWASP A09 compliant security controls"
  ];

  return (
    <section className="py-32 px-6 border-t border-border bg-gradient-to-br from-card via-background-secondary to-card relative">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Code2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-accent font-semibold">ARCHITECTURE</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Enterprise Security Architecture
            </motion.h2>

            <motion.p
              className="text-foreground-secondary text-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Built with security-first principles, implementing comprehensive logging middleware,
              encrypted storage, and real-time monitoring capabilities for production environments.
            </motion.p>

            <div className="space-y-6">
              {architecturePoints.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                >
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-foreground-secondary">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-[400px] w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-accent-dim/10 rounded-3xl blur-3xl transform scale-110"></div>
              <div className="relative h-full w-full bg-gradient-to-br from-card to-background-secondary rounded-3xl border border-accent/30 backdrop-blur-sm overflow-hidden shadow-2xl">
                <VideoGifAnimation type="flow" className="w-full h-full rounded-3xl" />

                <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-accent">Security Active</span>
                  </div>
                  <div className="text-xs text-foreground-secondary">Monitoring 24/7</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;