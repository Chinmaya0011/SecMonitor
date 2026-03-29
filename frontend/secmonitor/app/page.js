"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoGifAnimation from "@/components/VideoGifAnimation";
import { 
  Shield, 
  Activity, 
  AlertTriangle,
  ChevronRight,
  Code2,
  MessageCircle,
  Mail,
  Server,
  Database,
  Terminal,
  FileText,
  Network,
  Timer,
  Hash,
  Zap,
  TrendingUp,
  Clock,
  BarChart3,
  Layers,
  GitBranch,
  Cpu,
  Lock
} from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, []);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animation */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6"
                variants={fadeInUp}
              >
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono text-accent">ENTERPRISE GRADE LOGGING</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6"
                variants={fadeInUp}
              >
                SecMonitor
                <span className="block text-accent text-3xl md:text-4xl mt-2">
                  Request & Response Logger
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-foreground-secondary text-lg mb-8"
                variants={fadeInUp}
              >
                Complete visibility into your backend operations. Log every request, 
                track responses, and monitor performance with enterprise-grade middleware.
              </motion.p>
              
              <motion.div 
                className="flex gap-4"
                variants={fadeInUp}
              >
                {isAuthenticated ? (
                  <Link
                    href="/logger"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-all"
                  >
                    View Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-all"
                    >
                      Get Started
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:border-accent hover:text-accent transition-all"
                    >
                      View Demo
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
            
            {/* Right Content - Video Animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[400px]"
            >
              <VideoGifAnimation type="matrix" className="w-full h-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Features
            </h2>
            <p className="text-foreground-secondary">
              Complete request-response logging system for modern applications
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Request Logging",
                description: "Method, URL, headers, body, IP address"
              },
              {
                icon: Server,
                title: "Response Tracking",
                description: "Status code, response time, content length"
              },
              {
                icon: Timer,
                title: "Performance Metrics",
                description: "Monitor response times and identify slow endpoints"
              },
              {
                icon: AlertTriangle,
                title: "Error Detection",
                description: "Flag failed requests, 4xx/5xx errors"
              },
              {
                icon: Network,
                title: "Client Intelligence",
                description: "Capture IP addresses and user agents"
              },
              {
                icon: Hash,
                title: "Endpoint Analytics",
                description: "Track usage patterns per endpoint"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div 
                  key={index} 
                  className="group p-6 border border-border rounded-lg hover:border-accent/50 transition-all hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4">
                    <IconComponent className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-foreground-secondary text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real-time Stats with Animation */}
      <section className="py-20 px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Real-time Analytics
              </motion.h2>
              <motion.p 
                className="text-foreground-secondary mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Monitor your API performance with live data streams and instant insights
              </motion.p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Requests/sec", value: "2,847", change: "+12%" },
                  { label: "Success Rate", value: "98.7%", change: "+2.3%" },
                  { label: "Avg Latency", value: "142ms", change: "-8ms" },
                  { label: "Active Users", value: "1,234", change: "+156" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-4 border border-border rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <div className="text-sm text-foreground-secondary mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-success">{stat.change}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div
              className="h-[300px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <VideoGifAnimation type="flow" className="w-full h-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-foreground-secondary">
              Simple, efficient, and scalable architecture
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Intercept", desc: "Capture request data in real-time", icon: GitBranch },
              { step: "02", title: "Store", desc: "Save to MongoDB for persistence", icon: Database },
              { step: "03", title: "Track", desc: "Monitor response times and status", icon: Activity },
              { step: "04", title: "Analyze", desc: "Visualize data in dashboard", icon: BarChart3 }
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <motion.div 
                  key={i} 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-16 h-16 mx-auto border-2 border-accent rounded-full flex items-center justify-center mb-4 relative">
                    <span className="text-accent font-mono text-lg">{item.step}</span>
                  </div>
                  <IconComponent className="w-6 h-6 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-foreground-secondary text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Endpoints Section */}
      <section className="py-20 px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              API Endpoints
            </h2>
            <p className="text-foreground-secondary">
              RESTful API for comprehensive log management
            </p>
          </motion.div>
          
          <motion.div 
            className="border border-border rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-3 gap-4 p-3 bg-background-secondary border-b border-border font-mono text-sm">
              <div>Method</div>
              <div>Endpoint</div>
              <div>Description</div>
            </div>
            <div className="divide-y divide-border">
              {[
                { method: "GET", endpoint: "/api/logs", desc: "Get latest logs" },
                { method: "GET", endpoint: "/api/logs/type/:type", desc: "Filter by type" },
                { method: "GET", endpoint: "/api/logs/search", desc: "Search logs" },
                { method: "GET", endpoint: "/api/logs/stats", desc: "Get statistics" },
                { method: "GET", endpoint: "/api/logs/paginated", desc: "Paginated logs" },
                { method: "DELETE", endpoint: "/api/logs/clear", desc: "Clear all logs" },
                { method: "DELETE", endpoint: "/api/logs/clear/old", desc: "Clear logs older than 30 days" }
              ].map((route, i) => (
                <motion.div 
                  key={i} 
                  className="grid grid-cols-3 gap-4 p-3 font-mono text-sm hover:bg-background-secondary transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <span className={route.method === "DELETE" ? "text-danger" : "text-accent"}>
                    {route.method}
                  </span>
                  <span className="text-foreground">{route.endpoint}</span>
                  <span className="text-foreground-secondary">{route.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Built With
          </motion.h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Node.js", icon: Server, color: "from-green-500 to-green-600" },
              { name: "Express", icon: Code2, color: "from-gray-500 to-gray-600" },
              { name: "MongoDB", icon: Database, color: "from-green-600 to-green-700" },
              { name: "Next.js", icon: Terminal, color: "from-white to-gray-300" },
              { name: "React", icon: Layers, color: "from-cyan-500 to-blue-500" },
              { name: "TypeScript", icon: Lock, color: "from-blue-500 to-blue-600" }
            ].map((tech, i) => {
              const IconComponent = tech.icon;
              return (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-accent transition-all cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, borderColor: "#00ff41" }}
                >
                  <IconComponent className="w-4 h-4 text-accent" />
                  <span className="text-sm">{tech.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Trusted by Developers
            </h2>
            <p className="text-foreground-secondary">
              Join thousands of developers who use SecMonitor
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "SecMonitor transformed how we debug our APIs. The real-time logging is invaluable.",
                author: "Sarah Chen",
                role: "Senior Backend Engineer",
                company: "TechCorp"
              },
              {
                quote: "Best request logging solution I've used. Simple setup and powerful features.",
                author: "Michael Rodriguez",
                role: "DevOps Lead",
                company: "CloudScale"
              },
              {
                quote: "The performance metrics helped us identify and fix bottlenecks instantly.",
                author: "Emily Watson",
                role: "Full Stack Developer",
                company: "StartupHub"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-6 border border-border rounded-lg hover:border-accent/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="mb-4">
                  <div className="text-accent text-4xl">"</div>
                  <p className="text-foreground-secondary text-sm mt-2">{testimonial.quote}</p>
                </div>
                <div className="mt-4">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-xs text-foreground-secondary">{testimonial.role} at {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-foreground-secondary">
              Choose the plan that fits your needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: ["1,000 requests/day", "7 days data retention", "Basic analytics", "Email support"],
                highlighted: false
              },
              {
                name: "Pro",
                price: "$29",
                period: "per month",
                features: ["100,000 requests/day", "30 days data retention", "Advanced analytics", "Priority support", "Custom alerts"],
                highlighted: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "contact us",
                features: ["Unlimited requests", "Unlimited retention", "Custom integrations", "24/7 phone support", "SLA guarantee"],
                highlighted: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                className={`p-6 border rounded-lg transition-all ${plan.highlighted ? 'border-accent bg-accent/5' : 'border-border'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-foreground-secondary text-sm">/{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="text-sm text-foreground-secondary flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Free" ? "/signup" : "/contact"}
                  className={`block text-center px-4 py-2 rounded-lg transition-all ${
                    plan.highlighted 
                      ? "bg-accent text-background hover:bg-accent-dim" 
                      : "border border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Logging?
            </h2>
            <p className="text-foreground-secondary mb-8">
              Get complete visibility into your backend operations today
            </p>
            
            {!isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-all"
                >
                  Get Started Free
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:border-accent hover:text-accent transition-all"
                >
                  View Demo
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-accent" />
                <span className="font-mono font-bold">SecMonitor</span>
              </div>
              <p className="text-xs text-foreground-secondary">
                Enterprise-grade request and response logging for modern applications.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li><a href="#" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">API</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="font-mono text-sm">SecMonitor</span>
              <span className="text-xs text-foreground-secondary">v2.0</span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-foreground-secondary hover:text-accent transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="text-foreground-secondary hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="text-foreground-secondary hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-xs text-foreground-secondary">
              © 2024 SecMonitor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}