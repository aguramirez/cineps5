// src/components/Navbar/Navbar.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Navbar.css';

interface Movie {
  id: string;
  title: string;
  slug: string;
  mainColor: string;
  accentColor: string;
}

interface NavbarProps {
  movies: Movie[];
  activeMovieIndex: number;
  onMovieSelect: (index: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ movies, activeMovieIndex, onMovieSelect }) => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize GSAP animations
  useEffect(() => {
    if (!navbarRef.current || !indicatorRef.current) return;

    // Initial navbar animation
    gsap.fromTo(navbarRef.current,
      {
        x: -100,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
      }
    );

    // Stagger animation for buttons
    gsap.fromTo(buttonsRef.current,
      {
        x: -50,
        opacity: 0,
        scale: 0.8
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.6
      }
    );

  }, []);

  // Update indicator position when active movie changes
  useEffect(() => {
    if (!indicatorRef.current || !buttonsRef.current[activeMovieIndex]) return;

    const activeButton = buttonsRef.current[activeMovieIndex];
    const buttonRect = activeButton?.getBoundingClientRect();
    const navbarRect = navbarRef.current?.getBoundingClientRect();

    if (buttonRect && navbarRect) {
      const relativeTop = buttonRect.top - navbarRect.top;
      
      gsap.to(indicatorRef.current, {
        y: relativeTop + (buttonRect.height / 2) - 2,
        duration: 0.8,
        ease: "power3.inOut"
      });
    }

    // Update active button styles
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        if (index === activeMovieIndex) {
          gsap.to(button, {
            x: 20,
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out"
          });
        } else {
          gsap.to(button, {
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          });
        }
      }
    });

    // Update colors based on active movie
    const activeMovie = movies[activeMovieIndex];
    if (activeMovie && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        backgroundColor: activeMovie.mainColor,
        boxShadow: `0 0 20px ${activeMovie.mainColor}40`,
        duration: 0.8,
        ease: "power2.out"
      });
    }

  }, [activeMovieIndex, movies]);

  const handleMovieSelect = (index: number) => {
    if (index !== activeMovieIndex) {
      // Micro-interaction on click
      const button = buttonsRef.current[index];
      if (button) {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
      
      onMovieSelect(index);
    }
  };

  const handleButtonHover = (index: number, isEntering: boolean) => {
    const button = buttonsRef.current[index];
    if (!button) return;

    if (isEntering && index !== activeMovieIndex) {
      gsap.to(button, {
        x: 15,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      });
    } else if (!isEntering && index !== activeMovieIndex) {
      gsap.to(button, {
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleNavbarHover = (isEntering: boolean) => {
    setIsHovered(isEntering);
    
    if (navbarRef.current) {
      gsap.to(navbarRef.current, {
        width: isEntering ? '280px' : '240px',
        duration: 0.6,
        ease: "power2.out"
      });
    }

    // Visual feedback for hover state
    if (navbarRef.current) {
      const bgElement = navbarRef.current.querySelector('.navbar-bg');
      if (bgElement) {
        gsap.to(bgElement, {
          opacity: isEntering ? 0.95 : 0.9,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };

  return (
    <nav 
      className="navbar"
      ref={navbarRef}
      onMouseEnter={() => handleNavbarHover(true)}
      onMouseLeave={() => handleNavbarHover(false)}
    >
      {/* Glassmorphism Background */}
      <div className="navbar-bg"></div>
      
      {/* Active Movie Indicator */}
      <div className="navbar-indicator" ref={indicatorRef}></div>
      
      {/* Movie Buttons */}
      <div className="navbar-content">
        <div className="navbar-header">
          <h2 className="navbar-title">Cinema</h2>
          <div className="navbar-subtitle">Select Movie</div>
        </div>
        
        <ul className="movie-list">
          {movies.map((movie, index) => (
            <li key={movie.id} className="movie-item">
              <button
                ref={el => { buttonsRef.current[index] = el; }}
                className={`movie-button ${index === activeMovieIndex ? 'active' : ''}`}
                onClick={() => handleMovieSelect(index)}
                onMouseEnter={() => handleButtonHover(index, true)}
                onMouseLeave={() => handleButtonHover(index, false)}
                data-hover="true"
              >
                <div className="button-content">
                  <span className="movie-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="movie-title">{movie.title}</span>
                </div>
                
                {/* Magnetic particles effect */}
                <div className="button-particles">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="particle-dot"></div>
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>
        
        {/* Navigation Info */}
        <div className="navbar-footer">
          <div className="scroll-hint">
            <span>Scroll to explore</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>
      
      {/* Edge Glow Effect */}
      <div className="navbar-edge-glow"></div>
    </nav>
  );
};

export default Navbar;