"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const DataStreamAnimation = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let timeouts = [];

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle class for data streams
    class DataParticle {
      constructor(x, y, speed, char, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.char = char;
        this.color = color;
        this.opacity = 1;
        this.size = Math.random() * 14 + 10;
      }

      update() {
        this.y += this.speed;
        this.opacity = Math.max(0, this.opacity - 0.005);
        return this.y < canvas.height && this.opacity > 0;
      }

      draw(ctx) {
        ctx.save();
        ctx.font = `${this.size}px 'Share Tech Mono', monospace`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillText(this.char, this.x, this.y);
        ctx.restore();
      }
    }

    // Generate random characters
    const getRandomChar = () => {
      const chars = "01<>[]{}()!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      return chars[Math.floor(Math.random() * chars.length)];
    };

    // Create new particle
    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = -50;
      const speed = Math.random() * 2 + 1;
      const char = getRandomChar();
      const colors = ['#00ff41', '#33ff33', '#00cc33', '#00ff66'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particles.push(new DataParticle(x, y, speed, char, color));
    };

    // Draw binary background
    const drawBinaryBackground = () => {
      const binaryChars = ["0", "1"];
      const fontSize = 12;
      const columns = Math.ceil(canvas.width / fontSize);
      
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = Math.random() * canvas.height;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
        ctx.fillText(binaryChars[Math.floor(Math.random() * 2)], x, y);
      }
    };

    // Draw grid lines
    const drawGrid = () => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 0.5;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Draw scanline effect
    let scanY = 0;
    const drawScanline = () => {
      scanY = (scanY + 2) % canvas.height;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
      ctx.lineWidth = 2;
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
      
      // Glow effect
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 4;
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
    };

    // Draw pulsing circles - FIXED VERSION
    let pulseRadius = 0;
    let pulseGrowing = true;
    const drawPulse = () => {
      // Update radius with bounds checking
      if (pulseGrowing) {
        pulseRadius += 1;
        if (pulseRadius >= 100) {
          pulseGrowing = false;
        }
      } else {
        pulseRadius -= 1;
        if (pulseRadius <= 0) {
          pulseRadius = 0;
          pulseGrowing = true;
        }
      }
      
      // Ensure radius is never negative
      const safeRadius = Math.max(0, pulseRadius);
      
      if (safeRadius > 0) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, safeRadius, 0, Math.PI * 2);
        const opacity = Math.max(0, Math.min(0.1, 0.1 - safeRadius / 1000));
        ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      if (!isPlaying) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw effects
      drawBinaryBackground();
      drawGrid();
      
      // Create new particles periodically
      if (Math.random() < 0.3) {
        createParticle();
      }
      
      // Update and draw particles
      particles = particles.filter(particle => particle.update());
      particles.forEach(particle => particle.draw(ctx));
      
      // Draw special effects
      drawScanline();
      drawPulse();
      
      // Draw corner decorations
      drawCornerDecorations(ctx, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Draw corner decorations
    const drawCornerDecorations = (ctx, width, height) => {
      ctx.beginPath();
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      
      // Top-left corner
      ctx.moveTo(0, 20);
      ctx.lineTo(0, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      
      // Top-right corner
      ctx.moveTo(width - 20, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, 20);
      ctx.stroke();
      
      // Bottom-left corner
      ctx.moveTo(0, height - 20);
      ctx.lineTo(0, height);
      ctx.lineTo(20, height);
      ctx.stroke();
      
      // Bottom-right corner
      ctx.moveTo(width - 20, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, height - 20);
      ctx.stroke();
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ background: '#0a0c0a' }}
      />
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 right-4 px-3 py-1 bg-background-secondary border border-accent rounded-lg text-xs text-accent hover:bg-accent hover:text-background transition-all z-10"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

// Video-style animation with data flow
const DataFlowAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let dataPoints = [];
    let flowY = 0;
    
    const setCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Create data flow particles
    class DataFlow {
      constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.points = [];
        this.length = 20;
        this.color = `hsl(${Math.random() * 60 + 100}, 100%, 50%)`;
        
        for (let i = 0; i < this.length; i++) {
          this.points.push({
            x: this.x + (Math.random() - 0.5) * 10,
            y: this.y - i * 8
          });
        }
      }
      
      update() {
        this.y += this.speed;
        
        // Update points
        for (let i = this.points.length - 1; i > 0; i--) {
          this.points[i].x = this.points[i-1].x;
          this.points[i].y = this.points[i-1].y;
        }
        
        this.points[0] = {
          x: this.x + (Math.random() - 0.5) * 10,
          y: this.y
        };
        
        return this.y < canvas.height + 100;
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.stroke();
        
        // Draw circles at points
        this.points.forEach((point, index) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        });
      }
    }
    
    // Create data flows
    const createDataFlow = () => {
      if (Math.random() < 0.1) {
        const x = Math.random() * canvas.width;
        const y = -50;
        const speed = Math.random() * 2 + 1;
        dataPoints.push(new DataFlow(x, y, speed));
      }
    };
    
    // Draw network nodes
    const drawNetworkNodes = () => {
      const nodes = 8;
      for (let i = 0; i < nodes; i++) {
        const x = (canvas.width / (nodes + 1)) * (i + 1);
        const y = Math.sin(Date.now() / 1000 + i) * 20 + canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff41';
        ctx.shadowBlur = 10;
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < nodes; j++) {
          const x2 = (canvas.width / (nodes + 1)) * (j + 1);
          const y2 = Math.sin(Date.now() / 1000 + j) * 20 + canvas.height / 2;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0c0a');
      gradient.addColorStop(1, '#0f1a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      createDataFlow();
      drawNetworkNodes();
      
      dataPoints = dataPoints.filter(point => point.update());
      dataPoints.forEach(point => point.draw(ctx));
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
      style={{ background: '#0a0c0a' }}
    />
  );
};

// Main component with GIF-like animation
const VideoGifAnimation = ({ type = 'matrix', className = '' }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border border-accent/20 shadow-lg ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {type === 'matrix' ? <DataStreamAnimation /> : <DataFlowAnimation />}
      
      {/* Overlay text */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded border border-accent/30">
        <span className="text-xs text-accent font-mono">
          {type === 'matrix' ? 'DATA STREAM ACTIVE' : 'NETWORK TRAFFIC'}
        </span>
      </div>
      
      {/* FPS Counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
        <span className="text-[10px] text-foreground-secondary font-mono">
          LIVE FEED
        </span>
      </div>
      
      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        <span className="text-[10px] text-foreground-secondary font-mono">
          RECORDING
        </span>
      </div>
    </motion.div>
  );
};

export default VideoGifAnimation;