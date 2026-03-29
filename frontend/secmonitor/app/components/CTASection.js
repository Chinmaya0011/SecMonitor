import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  Terminal,
  Database,
  Server,
  Code2
} from "lucide-react";

const CTASection = ({ isAuthenticated }) => {
  return (
    <section className="py-32 px-6 border-t border-border bg-gradient-to-br from-card via-background-secondary to-card relative overflow-hidden">
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Shield className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-mono text-accent font-semibold">PERSONAL PROJECT</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent leading-tight">
            Backend Security Dashboard
          </h2>
          <p className="text-foreground-secondary text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            A production-ready logging and monitoring solution demonstrating OWASP A09 implementation,
            built with modern web technologies and security best practices.
          </p>

          {!isAuthenticated && (
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-dim text-background font-bold rounded-2xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 transform hover:scale-105"
              >
                <Shield className="w-6 h-6" />
                Access Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-accent/50 rounded-2xl hover:border-accent hover:bg-accent/10 transition-all duration-300 backdrop-blur-sm"
              >
                <Terminal className="w-5 h-5 text-accent" />
                View Demo
              </Link>
            </motion.div>
          )}

          {/* Tech Stack */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">OWASP A09</div>
                <div className="text-sm text-foreground-secondary">Security Control</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">MongoDB</div>
                <div className="text-sm text-foreground-secondary">Audit Storage</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Server className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">Node.js</div>
                <div className="text-sm text-foreground-secondary">Runtime</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Code2 className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">Next.js</div>
                <div className="text-sm text-foreground-secondary">Frontend</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;