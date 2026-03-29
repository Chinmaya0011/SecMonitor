import { Shield, GitBranch, Mail, ExternalLink, Code2, Database, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.05),transparent_70%)]"></div>

      <div className="relative py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-mono font-bold text-2xl text-white">SecMonitor</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                A comprehensive backend logging and monitoring solution implementing OWASP A09 security controls.
                Built for production environments requiring robust audit trails and real-time security monitoring.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                  aria-label="GitHub"
                >
                  <GitBranch className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
                <a
                  href="mailto:contact@secmonitor.dev"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/logger" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Login
                  </a>
                </li>
                <li>
                  <a href="/signup" className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>

            {/* Security Features */}
            <div>
              <h3 className="font-semibold text-white mb-6">Security Controls</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>OWASP A09 Compliant</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Database className="w-4 h-4 text-green-500" />
                  <span>Encrypted Storage</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Code2 className="w-4 h-4 text-green-500" />
                  <span>Real-time Monitoring</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>© 2024 SecMonitor. All rights reserved.</span>
                <span>•</span>
                <span>Built with security-first principles</span>
                <span>•</span>
                <span>Production Ready</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Version 1.0.0</span>
                <span>•</span>
                <span>Node.js Backend</span>
                <span>•</span>
                <span>MongoDB Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;