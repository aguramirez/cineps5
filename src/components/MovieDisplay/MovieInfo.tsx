// src/components/MovieDisplay/MovieInfo.tsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './MovieInfo.css';

interface Movie {
  id: string;
  title: string;
  genre: string[];
  duration: string;
  rating: string;
  year: number;
  synopsis: string;
  director: string;
  mainColor: string;
  accentColor: string;
}

interface MovieInfoProps {
  movie: Movie;
  isActive: boolean;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const synopsisRef = useRef<HTMLParagraphElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const directorRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    // Set color variables
    const container = containerRef.current;
    container.style.setProperty('--info-main-color', movie.mainColor);
    container.style.setProperty('--info-accent-color', movie.accentColor);

    // Entrance animation with stagger
    const tl = gsap.timeline();

    // Title entrance with cinematic effect
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        {
          y: 80,
          opacity: 0,
          scale: 0.8,
          rotateX: 45
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }

    // Meta info stagger
    if (metaRef.current) {
      const metaItems = metaRef.current.children;
      tl.fromTo(metaItems,
        {
          x: -50,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.8"
      );
    }

    // Genre tags animation
    if (genreRef.current) {
      const genreTags = genreRef.current.children;
      tl.fromTo(genreTags,
        {
          scale: 0,
          rotation: 180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        },
        "-=0.6"
      );
    }

    // Synopsis typewriter effect
    if (synopsisRef.current) {
      const text = movie.synopsis;
      const words = text.split(' ');
      synopsisRef.current.innerHTML = '';
      
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        synopsisRef.current?.appendChild(span);
        
        tl.to(span, {
          opacity: 1,
          duration: 0.1,
          ease: "none"
        }, `-=${words.length * 0.05 - index * 0.05}`);
      });
    }

    // Director info
    if (directorRef.current) {
      tl.fromTo(directorRef.current,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        },
        "-=1"
      );
    }

    // Decorative elements
    if (decorRef.current) {
      tl.fromTo(decorRef.current.children,
        {
          scale: 0,
          rotation: 0
        },
        {
          scale: 1,
          rotation: 360,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out"
        },
        "-=1.5"
      );
    }

  }, [movie, isActive]);

  // Parallax effect on scroll
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY;
        const parallaxSpeed = 0.2;
        
        gsap.to(containerRef.current, {
          y: scrollY * parallaxSpeed,
          duration: 0.3,
          ease: "none"
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isActive]);

  const handleGenreHover = (element: HTMLElement, isEntering: boolean) => {
    gsap.to(element, {
      scale: isEntering ? 1.1 : 1,
      y: isEntering ? -3 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div 
      className={`movie-info ${isActive ? 'active' : ''}`}
      ref={containerRef}
    >
      {/* Decorative Elements */}
      <div className="info-decoration" ref={decorRef}>
        <div className="decor-circle decor-circle-1"></div>
        <div className="decor-circle decor-circle-2"></div>
        <div className="decor-line decor-line-1"></div>
        <div className="decor-line decor-line-2"></div>
      </div>

      {/* Title Section */}
      <div className="title-section">
        <h1 className="movie-title" ref={titleRef}>
          {movie.title}
          <div className="title-underline"></div>
        </h1>
      </div>

      {/* Meta Information */}
      <div className="meta-info" ref={metaRef}>
        <div className="meta-item">
          <span className="meta-label">Year</span>
          <span className="meta-value">{movie.year}</span>
        </div>
        <div className="meta-separator">•</div>
        <div className="meta-item">
          <span className="meta-label">Duration</span>
          <span className="meta-value">{movie.duration}</span>
        </div>
        <div className="meta-separator">•</div>
        <div className="meta-item">
          <span className="meta-label">Rating</span>
          <span className="meta-value meta-rating">{movie.rating}</span>
        </div>
      </div>

      {/* Genre Tags */}
      <div className="genre-section">
        <h3 className="section-title">Genres</h3>
        <div className="genre-tags" ref={genreRef}>
          {movie.genre.map((genre, index) => (
            <span 
              key={index}
              className="genre-tag"
              onMouseEnter={(e) => handleGenreHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleGenreHover(e.currentTarget, false)}
              data-hover="true"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Synopsis */}
      <div className="synopsis-section">
        <h3 className="section-title">Synopsis</h3>
        <p className="synopsis-text" ref={synopsisRef}>
          {movie.synopsis}
        </p>
      </div>

      {/* Director */}
      <div className="director-section" ref={directorRef}>
        <h3 className="section-title">Director</h3>
        <div className="director-info">
          <span className="director-name">{movie.director}</span>
          <div className="director-badge">Director</div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="floating-element"
            style={{
              '--delay': `${i * 1.5}s`,
              '--x': `${20 + (i % 2) * 60}%`,
              '--y': `${30 + (i % 2) * 40}%`
            } as React.CSSProperties}
          ></div>
        ))}
      </div>

      {/* Background Effects */}
      <div className="info-bg-effects">
        <div className="bg-gradient"></div>
        <div className="bg-noise"></div>
        <div className="bg-scanlines"></div>
      </div>
    </div>
  );
};

export default MovieInfo;