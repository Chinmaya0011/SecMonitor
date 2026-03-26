"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Zap,
  ChevronRight,
  Code2,
  MessageCircle,
  Mail,
  Server,
  Database,
  Cloud,
  Terminal,
  BarChart3,
  Globe,
  Cpu,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  FileText,
  Network,
  Webhook,
  ArrowLeftRight,
  Timer,
  Hash
} from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, []);

  const features = [
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
  ];

  return (
    <div className="min-h-screen scanline">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-full mb-6">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono text-accent">BACKEND LOGGER v2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              SecMonitor
              <span className="block text-accent text-3xl md:text-4xl mt-2">
                Request & Response Logger
              </span>
            </h1>
            
            <p className="text-foreground-secondary max-w-2xl mx-auto mb-8">
              Complete visibility into your backend operations. Log every request, 
              track responses, and monitor performance with middleware-based logging.
            </p>
            
            <div className="flex gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href="/logger"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-mono font-bold rounded-lg hover:bg-accent-dim transition-all"
                >
                  View Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-mono font-bold rounded-lg hover:bg-accent-dim transition-all"
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
            </div>

            {/* Code Preview */}
            <div className="mt-12">
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background-secondary">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-danger rounded-full"></div>
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                  <span className="text-xs text-foreground-secondary ml-2 font-mono">request_logger.js</span>
                </div>
                <div className="p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-foreground-secondary">
                    <code>{`// Request Logger Middleware
const requestLogger = (req, res, next) => {
  const logData = {
    type: 'request',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.headers['x-forwarded-for'],
    userAgent: req.get('User-Agent')
  };
  
  logger.info('REQUEST_LOG', logData);
  next();
};

// Response Logger Middleware  
const responseLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const responseTime = Number(process.hrtime.bigint() - start) / 1000000;
    
    logger.info('RESPONSE_LOG', {
      type: 'response',
      statusCode: res.statusCode,
      responseTime: \`\${responseTime.toFixed(2)}ms\`
    });
  });
  
  next();
};`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Features
          </h2>
          <p className="text-foreground-secondary text-center mb-12">
            Complete request-response logging system
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="p-6 border border-border rounded-lg hover:border-accent transition-all hover:-translate-y-0.5"
                >
                  <IconComponent className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            How It Works
          </h2>
          <p className="text-foreground-secondary text-center mb-12">
            Simple middleware-based architecture
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Intercept", desc: "Capture request data" },
              { step: "2", title: "Store", desc: "Save to MongoDB" },
              { step: "3", title: "Track", desc: "Monitor response" },
              { step: "4", title: "Analyze", desc: "View dashboard" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto border border-accent rounded-full flex items-center justify-center mb-3">
                  <span className="text-accent font-bold">{item.step}</span>
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-foreground-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            API Endpoints
          </h2>
          <p className="text-foreground-secondary text-center mb-8">
            RESTful API for log management
          </p>
          
          <div className="border border-border rounded-lg overflow-hidden">
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
                { method: "DELETE", endpoint: "/api/logs/clear/old", desc: "Clear old logs" }
              ].map((route, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 p-3 font-mono text-sm">
                  <span className={route.method === "DELETE" ? "text-danger" : "text-accent"}>
                    {route.method}
                  </span>
                  <span className="text-foreground">{route.endpoint}</span>
                  <span className="text-foreground-secondary">{route.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Requests Logged", value: "2.4M+", icon: FileText },
              { label: "Avg Response", value: "156ms", icon: Timer },
              { label: "Active Endpoints", value: "47", icon: Server },
              { label: "Error Rate", value: "2.3%", icon: AlertTriangle }
            ].map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div key={i} className="text-center p-4 border border-border rounded-lg">
                  <IconComponent className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-foreground-secondary mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Built With
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "Node.js", icon: Server },
              { name: "Express", icon: Code2 },
              { name: "MongoDB", icon: Database },
              { name: "Next.js", icon: Terminal }
            ].map((tech, i) => {
              const IconComponent = tech.icon;
              return (
                <div key={i} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
                  <IconComponent className="w-4 h-4 text-accent" />
                  <span className="text-sm">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Start Logging Your Backend
          </h2>
          <p className="text-foreground-secondary mb-8">
            Get complete request-response visibility for debugging and monitoring
          </p>
          
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 bg-accent text-background font-mono font-bold rounded-lg hover:bg-accent-dim transition-all"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-border rounded-lg hover:border-accent hover:text-accent transition-all"
              >
                View Demo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border text-center text-sm text-foreground-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="font-mono">SecMonitor</span>
              <span className="text-xs">v2.0</span>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-xs">
              © 2024 SecMonitor. Request-Response Logger
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}