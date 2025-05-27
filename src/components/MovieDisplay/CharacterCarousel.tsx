// src/components/MovieDisplay/CharacterCarousel.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './CharacterCarousel.css';

interface Character {
  id: string;
  name: string;
  actor: string;
  image: string;
  description: string;
}

interface CharacterCarouselProps {
  characters: Character[];
  isActive: boolean;
  movieColor: string;
}

const CharacterCarousel: React.FC<CharacterCarouselProps> = ({ 
  characters, 
  isActive, 
  movieColor 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    // Set color variables
    const container = containerRef.current;
    container.style.setProperty('--carousel-main-color', movieColor);

    // Entrance animation
    const tl = gsap.timeline();

    // Title entrance
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        }
      );
    }

    // Cards stagger entrance
    if (cardsRef.current.length > 0) {
      tl.fromTo(cardsRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotateY: 45
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out"
        },
        "-=0.6"
      );
    }

    // Navigation entrance
    if (navRef.current) {
      tl.fromTo(navRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        },
        "-=0.4"
      );
    }

  }, [isActive, movieColor]);

  // Auto-scroll when not hovered
  useEffect(() => {
    if (!isActive || isHovered || characters.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % characters.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive, isHovered, characters.length]);

  // Update carousel position
  useEffect(() => {
    if (!carouselRef.current) return;

    const translateX = -currentIndex * 280; // Card width + gap
    
    gsap.to(carouselRef.current, {
      x: translateX,
      duration: 0.8,
      ease: "power2.inOut"
    });

    // Update card scales
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const isCenter = index === currentIndex;
        const isAdjacent = Math.abs(index - currentIndex) === 1;
        
        gsap.to(card, {
          scale: isCenter ? 1 : isAdjacent ? 0.85 : 0.7,
          opacity: isCenter ? 1 : isAdjacent ? 0.7 : 0.4,
          z: isCenter ? 100 : 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    });

  }, [currentIndex]);

  const handleCardClick = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      
      // Click feedback
      const card = cardsRef.current[index];
      if (card) {
        gsap.to(card, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
    }
  };

  const handleCardHover = (index: number, isEntering: boolean) => {
    const card = cardsRef.current[index];
    if (!card || index === currentIndex) return;

    if (isEntering) {
      gsap.to(card, {
        scale: 0.9,
        y: -10,
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      const baseScale = Math.abs(index - currentIndex) === 1 ? 0.85 : 0.7;
      gsap.to(card, {
        scale: baseScale,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(prev => prev === 0 ? characters.length - 1 : prev - 1);
    } else {
      setCurrentIndex(prev => (prev + 1) % characters.length);
    }
  };

  return (
    <div 
      className={`character-carousel ${isActive ? 'active' : ''}`}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Title */}
      <h2 className="carousel-title" ref={titleRef}>
        Characters
        <div className="title-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-circle"></div>
        </div>
      </h2>

      {/* Carousel Container */}
      <div className="carousel-container">
        <div className="carousel-track" ref={carouselRef}>
          {characters.map((character, index) => (
            <div
              key={character.id}
              ref={el => { cardsRef.current[index] = el; }}
              className={`character-card ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
              data-hover="true"
            >
              {/* Card Background */}
              <div className="card-bg">
                <div className="card-gradient"></div>
                <div className="card-noise"></div>
              </div>

              {/* Character Image */}
              <div className="character-image-container">
                <img 
                  src={character.image}
                  alt={character.name}
                  className="character-image"
                  loading="lazy"
                />
                <div className="image-overlay"></div>
                <div className="image-glow"></div>
              </div>

              {/* Character Info */}
              <div className="character-info">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-actor">{character.actor}</p>
                <p className="character-description">{character.description}</p>
              </div>

              {/* Card Effects */}
              <div className="card-effects">
                <div className="corner-accent corner-tl"></div>
                <div className="corner-accent corner-tr"></div>
                <div className="corner-accent corner-bl"></div>
                <div className="corner-accent corner-br"></div>
                <div className="card-shine"></div>
              </div>

              {/* Floating Particles */}
              <div className="card-particles">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="card-particle"
                    style={{
                      '--delay': `${i * 0.5}s`,
                      '--x': `${20 + (i % 2) * 60}%`,
                      '--y': `${30 + (i % 2) * 40}%`
                    } as React.CSSProperties}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="carousel-navigation" ref={navRef}>
        <button 
          className="nav-button nav-prev"
          onClick={() => handleNavigation('prev')}
          disabled={characters.length <= 1}
          data-hover="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M12.5 15L7.5 10L12.5 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="nav-indicators">
          {characters.map((_, index) => (
            <button
              key={index}
              className={`nav-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              data-hover="true"
            />
          ))}
        </div>

        <button 
          className="nav-button nav-next"
          onClick={() => handleNavigation('next')}
          disabled={characters.length <= 1}
          data-hover="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path 
              d="M7.5 15L12.5 10L7.5 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Background Ambient */}
      <div className="carousel-ambient">
        <div className="ambient-glow"></div>
        <div className="ambient-particles">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="ambient-particle"
              style={{
                '--delay': `${i * 1}s`,
                '--x': `${10 + (i % 3) * 40}%`,
                '--y': `${20 + Math.floor(i / 3) * 60}%`
              } as React.CSSProperties}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterCarousel;