import Link from "next/link";
import { motion } from "framer-motion";
import VideoGifAnimation from "@/components/VideoGifAnimation";
import {
  Shield,
  Activity,
  ArrowRight,
  Lock,
  Database,
  Terminal
} from "lucide-react";

const HeroSection = ({ isAuthenticated }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="relative h-screen px-6 overflow-hidden flex items-center">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Professional Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="relative z-10"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 border border-accent/30 rounded-full mb-8 backdrop-blur-sm"
              variants={fadeInUp}
            >
              <Shield className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-mono text-accent font-semibold tracking-wider">OWASP A09 COMPLIANT</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-8 leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                SecMonitor
              </span>
              <span className="block text-accent text-4xl md:text-5xl mt-4 font-light">
                Backend Security Logger
              </span>
            </motion.h1>

            <motion.p
              className="text-foreground-secondary text-xl mb-10 leading-relaxed max-w-lg"
              variants={fadeInUp}
            >
              A comprehensive backend logging and monitoring solution implementing OWASP A09 security controls.
              Built for production environments requiring robust audit trails and real-time security monitoring.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              {isAuthenticated ? (
                <Link
                  href="/logger"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-dim text-background font-semibold rounded-xl hover:shadow-2xl hover:shadow-accent/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Activity className="w-5 h-5" />
                  Access Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-dim text-background font-semibold rounded-xl hover:shadow-2xl hover:shadow-accent/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <Shield className="w-5 h-5" />
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-accent/50 rounded-xl hover:border-accent hover:bg-accent/10 transition-all duration-300 backdrop-blur-sm text-foreground"
                  >
                    <Terminal className="w-5 h-5 text-accent" />
                    Demo Access
                  </Link>
                </>
              )}
            </motion.div>

            {/* Technical Credentials */}
            <motion.div
              className="flex items-center gap-6 mt-12"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">OWASP A09</div>
                  <div className="text-xs text-gray-400">Logging & Monitoring</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">MongoDB</div>
                  <div className="text-xs text-gray-400">Audit Storage</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Technical Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative h-[500px] w-full">
              {/* Security-focused Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-dim/10 rounded-3xl blur-3xl transform scale-110"></div>
              <div className="relative h-full w-full bg-gradient-to-br from-card to-background-secondary rounded-3xl border border-accent/20 backdrop-blur-sm overflow-hidden">
                <VideoGifAnimation type="matrix" className="w-full h-full rounded-3xl" />
                {/* Security Metrics Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-accent/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">A09</div>
                      <div className="text-xs text-foreground-secondary">OWASP Control</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-terminal-green">100%</div>
                      <div className="text-xs text-foreground-secondary">Compliance</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">Real-time</div>
                      <div className="text-xs text-foreground-secondary">Monitoring</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;