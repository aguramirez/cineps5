// src/components/MovieDisplay/MovieDisplay.tsx

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !movie) return;

    // Update CSS custom properties for color theming
    const container = containerRef.current;
    container.style.setProperty('--movie-main-color', movie.mainColor);
    container.style.setProperty('--movie-accent-color', movie.accentColor);

    if (isActive && !isTransitioning) {
      // Simple entrance animation
      gsap.fromTo(contentRef.current?.children || [],
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

  }, [movie, isActive, isTransitioning]);

  if (!movie) {
    return (
      <div className="movie-display-error">
        <p>Error: No se pudo cargar la película</p>
      </div>
    );
  }

  return (
    <div 
      className={`movie-display ${isActive ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
      ref={containerRef}
    >
      {/* Backdrop Image */}
      <div className="backdrop-container">
        <div 
          className="backdrop-image"
          style={{ backgroundImage: `url(${movie.backdropImage})` }}
        ></div>
        <div className="backdrop-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="movie-content" ref={contentRef}>
        <div className="content-grid">
          {/* Left Column - Poster */}
          <div className="poster-section">
            <div className="movie-poster-simple">
              <img 
                src={movie.poster}
                alt={movie.title}
                className="poster-image-simple"
                onError={(e) => {
                  console.log('Error loading poster:', movie.poster);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="poster-info">
                <div className="movie-year">{movie.year}</div>
                <div className="movie-rating">{movie.rating}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="info-section">
            <div className="movie-info-simple">
              <h1 className="movie-title-main">{movie.title}</h1>
              
              <div className="movie-meta">
                <span className="meta-item">{movie.year}</span>
                <span className="meta-separator">•</span>
                <span className="meta-item">{movie.duration}</span>
                <span className="meta-separator">•</span>
                <span className="meta-item">{movie.rating}</span>
              </div>

              <div className="movie-genres">
                {movie.genre.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>

              <p className="movie-synopsis">{movie.synopsis}</p>

              <div className="movie-director">
                <strong>Director:</strong> {movie.director}
              </div>

              {/* Buy Tickets Button */}
              <button className="buy-tickets-btn">
                Comprar Entradas
              </button>
            </div>
          </div>
        </div>

        {/* Characters Section */}
        {movie.characters && movie.characters.length > 0 && (
          <div className="characters-section-simple">
            <h2 className="characters-title">Personajes</h2>
            <div className="characters-grid">
              {movie.characters.map((character, index) => (
                <div key={character.id} className="character-card-simple">
                  <img 
                    src={character.image}
                    alt={character.name}
                    className="character-image-simple"
                    onError={(e) => {
                      console.log('Error loading character image:', character.image);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="character-info-simple">
                    <h3 className="character-name">{character.name}</h3>
                    <p className="character-actor">{character.actor}</p>
                    <p className="character-description">{character.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDisplay;