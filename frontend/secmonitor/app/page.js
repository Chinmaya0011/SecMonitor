"use client";
import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import ArchitectureSection from "./components/ArchitectureSection";
import TechStackSection from "./components/TechStackSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dark Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,0,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,100,0,0.1),transparent_50%)]"></div>

      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesSection />
      <ArchitectureSection />
      <TechStackSection />
      <CTASection isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
}