import React, { useContext } from 'react';
import '../styles/AnimatedBackground.css';
import { ThemeContext } from './ThemeContext';

const AnimatedBackground = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`animated-medical-bg ${theme}`}>
      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0" className="svg-defs">
        <defs>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gradient-start)" />
            <stop offset="50%" stopColor="var(--gradient-mid)" />
            <stop offset="100%" stopColor="var(--gradient-end)" />
          </linearGradient>
          <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-color)" />
            <stop offset="100%" stopColor="var(--secondary-color)" />
          </linearGradient>
          <linearGradient id="stethoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-color)" />
            <stop offset="100%" stopColor="var(--secondary-color)" />
          </linearGradient>
          <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>

      {/* Soft Glowing Blobs */}
      <div className="bg-blob-slow blob-1"></div>
      <div className="bg-blob-slow blob-2"></div>
      <div className="bg-blob-slow blob-3"></div>

      {/* Light pulse glow */}
      <div className="light-pulse-glow"></div>

      {/* Holographic EKG Background Line */}
      <svg className="medical-svg ekg-line" viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M0 50 L 150 50 L 175 20 L 200 90 L 230 10 L 260 70 L 285 50 L 500 50" fill="none" stroke="url(#ecgGrad)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
      
      {/* Floating Holographic Symbols */}
      
      {/* Stethoscope */}
      <svg className="medical-svg stethoscope" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M30 20 C 30 5, 70 5, 70 20 C 70 40, 50 45, 50 65 L 50 85" fill="none" stroke="url(#stethoGrad)" strokeWidth="2" strokeLinecap="round"/>
        <circle className="draw-path" cx="50" cy="90" r="5" fill="none" stroke="url(#stethoGrad)" strokeWidth="2"/>
        <path className="draw-path" d="M25 20 L 30 20 M 70 20 L 75 20" fill="none" stroke="url(#stethoGrad)" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      {/* Plus (Primary Emerald) */}
      <svg className="medical-svg plus-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M50 20 L 50 80 M 20 50 L 80 50" fill="none" stroke="var(--primary-color)" strokeWidth="6" strokeLinecap="round"/>
      </svg>
      
      {/* Medical Cross (Secondary Blue) */}
      <svg className="medical-svg cross" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M35 35 L 35 15 L 65 15 L 65 35 L 85 35 L 85 65 L 65 65 L 65 85 L 35 85 L 35 65 L 15 65 L 15 35 Z" fill="none" stroke="var(--secondary-color)" strokeWidth="3" strokeLinejoin="round"/>
      </svg>
      
      {/* Heart Outline (Amber Accent) */}
      <svg className="medical-svg heart" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M50 85 C 50 85, 15 55, 15 35 C 15 20, 30 10, 50 30 C 70 10, 85 20, 85 35 C 85 55, 50 85, 50 85 Z" fill="none" stroke="var(--accent-color)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      
      {/* Capsule Outline (Primary/Secondary Grad) */}
      <svg className="medical-svg capsule" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M20 50 L 50 20 C 60 10, 75 10, 85 20 C 95 30, 95 45, 85 55 L 55 85 C 45 95, 30 95, 20 85 C 10 75, 10 60, 20 50 Z" fill="none" stroke="url(#capsuleGrad)" strokeWidth="3" strokeLinejoin="round" />
        <path className="draw-path" d="M25 45 L 60 80" fill="none" stroke="url(#capsuleGrad)" strokeWidth="3" />
      </svg>
      
      {/* DNA Helix (Blue/Emerald Grad) */}
      <svg className="medical-svg dna" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path className="draw-path" d="M20 10 C 50 30, 80 50, 80 90 M 80 10 C 50 30, 20 50, 20 90" fill="none" stroke="url(#dnaGrad)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="30" y1="20" x2="70" y2="20" stroke="url(#dnaGrad)" strokeWidth="2"/>
        <line x1="40" y1="40" x2="60" y2="40" stroke="url(#dnaGrad)" strokeWidth="2"/>
        <line x1="50" y1="50" x2="50" y2="50" stroke="url(#dnaGrad)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="40" y1="60" x2="60" y2="60" stroke="url(#dnaGrad)" strokeWidth="2"/>
        <line x1="30" y1="80" x2="70" y2="80" stroke="url(#dnaGrad)" strokeWidth="2"/>
      </svg>
    </div>
  );
};

export default AnimatedBackground;
