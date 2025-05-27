// src/components/MovieDisplay/MoviePoster.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './MoviePoster.css';

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: number;
  rating: string;
  mainColor: string;
  accentColor: string;
}

interface MoviePosterProps {
  movie: Movie;
  isActive: boolean;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ movie, isActive }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!posterRef.current || !isActive) return;

    // Entrance animation
    const tl = gsap.timeline();

    tl.fromTo(posterRef.current,
      {
        scale: 0.8,
        rotateY: -45,
        opacity: 0,
        filter: 'blur(20px)'
      },
      {
        scale: 1,
        rotateY: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: "power3.out"
      }
    );

    // Floating animation when active
    if (isLoaded) {
      gsap.to(posterRef.current, {
        y: -10,
        duration: 4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });
    }

  }, [isActive, isLoaded]);

  // Update colors based on movie
  useEffect(() => {
    if (!posterRef.current) return;

    const container = posterRef.current;
    container.style.setProperty('--poster-main-color', movie.mainColor);
    container.style.setProperty('--poster-accent-color', movie.accentColor);

    // Animate glow color change
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        boxShadow: `0 0 60px ${movie.mainColor}40, 0 0 100px ${movie.accentColor}20`,
        duration: 1,
        ease: "power2.out"
      });
    }

  }, [movie]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        {
          scale: 1.2,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        }
      );
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (posterRef.current && frameRef.current) {
      // Magnetic effect
      gsap.to(posterRef.current, {
        scale: 1.08,
        rotateY: 5,
        z: 50,
        duration: 0.6,
        ease: "power2.out"
      });

      // Frame glow effect
      gsap.to(frameRef.current, {
        boxShadow: `0 0 40px ${movie.mainColor}60, inset 0 0 20px ${movie.accentColor}30`,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    // Reflection effect
    if (reflectionRef.current) {
      gsap.to(reflectionRef.current, {
        opacity: 0.6,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (posterRef.current && frameRef.current) {
      gsap.to(posterRef.current, {
        scale: 1,
        rotateY: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.out"
      });

      gsap.to(frameRef.current, {
        boxShadow: `0 0 20px ${movie.mainColor}30, inset 0 0 10px ${movie.accentColor}15`,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    if (reflectionRef.current) {
      gsap.to(reflectionRef.current, {
        opacity: 0.2,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!posterRef.current || !isHovered) return;

    const rect = posterRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Subtle tilt based on mouse position
    gsap.to(posterRef.current, {
      rotateY: deltaX * 15,
      rotateX: -deltaY * 10,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className="movie-poster-container">
      <div 
        className={`movie-poster ${isActive ? 'active' : ''} ${isLoaded ? 'loaded' : ''}`}
        ref={posterRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        data-hover="true"
      >
        {/* Glow Effect */}
        <div className="poster-glow" ref={glowRef}></div>
        
        {/* Main Frame */}
        <div className="poster-frame" ref={frameRef}>
          {/* Corner decorations */}
          <div className="frame-corner frame-corner-tl"></div>
          <div className="frame-corner frame-corner-tr"></div>
          <div className="frame-corner frame-corner-bl"></div>
          <div className="frame-corner frame-corner-br"></div>
          
          {/* Poster Image */}
          <div className="poster-image-container">
            <img 
              ref={imageRef}
              src={movie.poster}
              alt={movie.title}
              className="poster-image"
              onLoad={handleImageLoad}
              loading="lazy"
            />
            
            {/* Image Overlay Effects */}
            <div className="image-overlay">
              <div className="vignette-effect"></div>
              <div className="scan-lines"></div>
            </div>
          </div>
          
          {/* Reflection Effect */}
          <div className="poster-reflection" ref={reflectionRef}></div>
        </div>

        {/* Floating Info Badge */}
        <div className="info-badge">
          <span className="badge-year">{movie.year}</span>
          <span className="badge-rating">{movie.rating}</span>
        </div>

        {/* Particle Effects */}
        <div className="poster-particles">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="poster-particle"
              style={{
                '--delay': `${i * 0.5}s`,
                '--duration': `${3 + (i % 3)}s`,
                '--x': `${10 + (i % 4) * 25}%`,
                '--y': `${15 + Math.floor(i / 4) * 70}%`
              } as React.CSSProperties}
            ></div>
          ))}
        </div>

        {/* Loading State */}
        {!isLoaded && (
          <div className="poster-loading">
            <div className="loading-spinner"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Shadow Base */}
      <div className="poster-shadow"></div>
    </div>
  );
};

export default MoviePoster;