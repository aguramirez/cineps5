import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Custom cursor setup
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const moveCursor = (e: MouseEvent) => {
      if (cursor && cursorDot) {
        gsap.to(cursor, {
          duration: 0.3,
          x: e.clientX,
          y: e.clientY,
          ease: "power2.out"
        });
        
        gsap.to(cursorDot, {
          duration: 0.1,
          x: e.clientX,
          y: e.clientY,
          ease: "power2.out"
        });
      }
    };

    const handleMouseEnter = () => {
      if (cursor) {
        gsap.to(cursor, {
          duration: 0.3,
          scale: 1.5,
          opacity: 0.8,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      if (cursor) {
        gsap.to(cursor, {
          duration: 0.3,
          scale: 1,
          opacity: 0.5,
          ease: "power2.out"
        });
      }
    };

    // Event listeners
    document.addEventListener('mousemove', moveCursor);
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [data-hover="true"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Initial animation
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { 
          opacity: 0,
          scale: 0.95 
        },
        { 
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="main-layout" ref={containerRef}>
      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="ambient-light"></div>
        <div className="film-grain"></div>
      </div>

      {/* Main Content */}
      <div className="layout-container">
        {children}
      </div>

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${8 + (i % 4) * 2}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;