// src/App.tsx

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import Navbar from './components/Navbar/Navbar';
import MovieDisplay from './components/MovieDisplay/MovieDisplay';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import MainLayout from './components/Layout/MainLayout';
import { useMovieNavigation } from './hooks/useMovieNavigationSimple';
import type { Movie } from './types/movie.types';
import movieData from '../movies.json';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [movies] = useState<Movie[]>(movieData.movies);
  
  const {
    currentIndex,
    isTransitioning,
    direction,
    goToMovie
  } = useMovieNavigation({
    movies,
    initialIndex: 0,
    onMovieChange: (event) => {
      console.log(`Cambiando a película: ${event.movie.title}`);
    }
  });

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    const tl = gsap.timeline();
    
    tl.to('.welcome-screen', {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => setShowWelcome(false)
    });
  };

  // Auto-hide welcome screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(handleWelcomeComplete, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando películas...</div>
      </div>
    );
  }

  return (
    <div className="cinema-app">
      {/* Welcome Screen Overlay */}
      {showWelcome && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}

      {/* Main Cinema Interface */}
      {!showWelcome && (
        <MainLayout>
          {/* Navbar */}
          <Navbar
            movies={movies}
            activeMovieIndex={currentIndex}
            onMovieSelect={goToMovie}
          />

          {/* Current Movie Display */}
          <div className="main-content">
            <MovieDisplay
              movie={movies[currentIndex]}
              isActive={true}
              isTransitioning={isTransitioning}
            />
          </div>

          {/* Debug Info (solo en desarrollo) */}
          {import.meta.env.NODE_ENV === 'development' && (
            <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm z-50">
              <div>Película actual: {currentIndex + 1}/{movies.length}</div>
              <div>Título: {movies[currentIndex]?.title}</div>
              <div>Transicionando: {isTransitioning ? 'Sí' : 'No'}</div>
            </div>
          )}
        </MainLayout>
      )}
    </div>
  );
};

export default App;