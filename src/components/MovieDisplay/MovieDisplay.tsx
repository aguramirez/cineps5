// src/components/MovieDisplay/MovieDisplay.tsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import MoviePoster from './MoviePoster';
import CharacterCarousel from './CharacterCarousel';
import MovieInfo from './MovieInfo';
import './MovieDisplay.css';

interface Character {
  id: string;
  name: string;
  actor: string;
  image: string;
  description: string;
}

interface Movie {
  id: string;
  title: string;
  slug: string;
  poster: string;
  backdropImage: string;
  genre: string[];
  duration: string;
  rating: string;
  year: number;
  synopsis: string;
  director: string;
  mainColor: string;
  accentColor: string;
  characters: Character[];
}

interface MovieDisplayProps {
  movie: Movie;
  isActive: boolean;
  isTransitioning: boolean;
}

const MovieDisplay: React.FC<MovieDisplayProps> = ({ movie, isActive, isTransitioning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !backdropRef.current || !contentRef.current) return;

    // Update CSS custom properties for color theming
    const container = containerRef.current;
    container.style.setProperty('--movie-main-color', movie.mainColor);
    container.style.setProperty('--movie-accent-color', movie.accentColor);

    if (isActive && !isTransitioning) {
      // Entrance animation when movie becomes active
      const tl = gsap.timeline();

      // Backdrop entrance with parallax
      tl.fromTo(backdropRef.current,
        {
          scale: 1.2,
          opacity: 0,
          filter: 'blur(20px)'
        },
        {
          scale: 1,
          opacity: 0.4,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: "power3.out"
        }
      );

      // Content entrance with stagger
      tl.fromTo(contentRef.current.children,
        {
          y: 100,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out"
        },
        "-=1"
      );

      // Color bleeding effect
      if (overlayRef.current) {
        tl.fromTo(overlayRef.current,
          {
            opacity: 0
          },
          {
            opacity: 1,
            duration: 2,
            ease: "power2.out"
          },
          "-=1.5"
        );
      }
    }

    if (isTransitioning) {
      // Exit animation when transitioning away
      gsap.to([backdropRef.current, contentRef.current], {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: "power2.inOut"
      });
    }

  }, [movie, isActive, isTransitioning]);

  // Parallax effect on scroll
  useEffect(() => {
    if (!isActive || !backdropRef.current) return;

    const handleScroll = () => {
      if (backdropRef.current) {
        const scrollY = window.scrollY;
        const parallaxSpeed = 0.5;
        
        gsap.to(backdropRef.current, {
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

  return (
    <div 
      className={`movie-display ${isActive ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
      ref={containerRef}
    >
      {/* Dynamic Color Overlay */}
      <div className="color-overlay" ref={overlayRef}>
        <div className="color-gradient"></div>
        <div className="color-particles">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="color-particle"
              style={{
                '--delay': `${i * 0.5}s`,
                '--x': `${20 + (i % 3) * 30}%`,
                '--y': `${30 + Math.floor(i / 3) * 40}%`
              } as React.CSSProperties}
            ></div>
          ))}
        </div>
      </div>

      {/* Backdrop Image with Parallax */}
      <div className="backdrop-container">
        <div 
          className="backdrop-image"
          ref={backdropRef}
          style={{ backgroundImage: `url(${movie.backdropImage})` }}
        ></div>
        <div className="backdrop-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="movie-content" ref={contentRef}>
        <div className="content-grid">
          {/* Left Column - Poster */}
          <div className="poster-section">
            <MoviePoster 
              movie={movie}
              isActive={isActive}
            />
          </div>

          {/* Right Column - Info */}
          <div className="info-section">
            <MovieInfo 
              movie={movie}
              isActive={isActive}
            />
          </div>
        </div>

        {/* Characters Section */}
        <div className="characters-section">
          <CharacterCarousel 
            characters={movie.characters}
            isActive={isActive}
            movieColor={movie.mainColor}
          />
        </div>
      </div>

      {/* Cinematic Elements */}
      <div className="cinematic-elements">
        {/* Film borders */}
        <div className="film-border film-border-top">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="film-perforation"></div>
          ))}
        </div>
        <div className="film-border film-border-bottom">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="film-perforation"></div>
          ))}
        </div>

        {/* Lens flare effects */}
        <div className="lens-flare lens-flare-1"></div>
        <div className="lens-flare lens-flare-2"></div>
      </div>

      {/* Floating ambient lights */}
      <div className="ambient-lights">
        <div className="ambient-light ambient-light-1"></div>
        <div className="ambient-light ambient-light-2"></div>
        <div className="ambient-light ambient-light-3"></div>
      </div>
    </div>
  );
};

export default MovieDisplay;