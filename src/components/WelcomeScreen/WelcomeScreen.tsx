// src/components/WelcomeScreen/WelcomeScreen.tsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onComplete?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current || !arrowRef.current) return;

    // Create timeline for entrance animation
    const tl = gsap.timeline({ delay: 0.5 });

    // Title entrance with cinematic effect
    tl.fromTo(titleRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotationX: 45
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.5,
        ease: "power3.out"
      }
    )
    // Subtitle and arrow entrance
    .fromTo([subtitleRef.current, arrowRef.current],
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      },
      "-=0.5"
    );

    // Continuous arrow animation
    gsap.to(arrowRef.current, {
      y: 15,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      delay: 2
    });

    // Particles animation
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      gsap.fromTo(particles,
        {
          opacity: 0,
          scale: 0,
          rotation: 0
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 360,
          duration: 2,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 1,
          repeat: -1,
          repeatDelay: 3
        }
      );
    }

    // Auto-scroll hint after 3 seconds
    const autoScrollTimeout = setTimeout(() => {
      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          scale: 1.2,
          duration: 0.3,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut"
        });
      }
    }, 3000);

    return () => {
      clearTimeout(autoScrollTimeout);
      tl.kill();
    };
  }, []);

  return (
    <div className="welcome-screen" ref={containerRef}>
      {/* Background Effects */}
      <div className="welcome-bg">
        <div className="welcome-gradient"></div>
        <div className="welcome-noise"></div>
      </div>

      {/* Floating Particles */}
      <div className="welcome-particles" ref={particlesRef}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="welcome-particle"
            style={{
              '--x': `${20 + (i % 4) * 20}%`,
              '--y': `${20 + Math.floor(i / 4) * 60}%`,
              '--delay': `${i * 0.3}s`
            } as React.CSSProperties}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="welcome-content">
        <h1 className="welcome-title" ref={titleRef}>
          <span className="title-main">CINE</span>
          <span className="title-accent">JUJUY</span>
        </h1>

        <div className="welcome-subtitle-container">
          <h2 className="welcome-subtitle" ref={subtitleRef}>
            seguí bajando
          </h2>
          
          <div className="scroll-indicator" ref={arrowRef}>
            <div className="arrow-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 5V19M5 12L12 19L19 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="scroll-line"></div>
          </div>
        </div>
      </div>

      {/* Cinema Reel Effect */}
      <div className="cinema-reels">
        <div className="reel reel-left">
          <div className="reel-center"></div>
          <div className="reel-spoke"></div>
          <div className="reel-spoke"></div>
          <div className="reel-spoke"></div>
          <div className="reel-spoke"></div>
        </div>
        <div className="reel reel-right">
          <div className="reel-center"></div>
          <div className="reel-spoke"></div>
          <div className="reel-spoke"></div>
          <div className="reel-spoke"></div>
          <div className="reel-spoke"></div>
        </div>
      </div>

      {/* Film Strip */}
      <div className="film-strip film-strip-left">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="film-perforation"></div>
        ))}
      </div>
      <div className="film-strip film-strip-right">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="film-perforation"></div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;