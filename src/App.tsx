// src/App.tsx

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import MainLayout from './components/Layout/MainLayout';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import Navbar from './components/Navbar/Navbar';
import MovieDisplay from './components/MovieDisplay/MovieDisplay';

// Hooks
import { useMovieNavigation } from './hooks/useMovieNavigation';
import { useLenisScroll } from './hooks/useLenisScroll';
import { useGSAPAnimations } from './hooks/useGSAPAnimations';

// Types
import { type Movie, type MovieChangeEvent, type CustomScrollEvent } from './types/movie.types';

// Data
import moviesData from '../movies.json';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [movies] = useState<Movie[]>(moviesData.movies);
  const [isLoading, setIsLoading] = useState(true);
  const [currentColors, setCurrentColors] = useState({
    main: '#ffffff',
    accent: '#888888'
  });

  const appRef = useRef<HTMLDivElement>(null);
  const moviesSectionRef = useRef<HTMLDivElement>(null);

  // Initialize hooks
  const {
    currentIndex,
    isTransitioning,
    goToMovie
  } = useMovieNavigation({
    movies,
    initialIndex: 0,
    onMovieChange: handleMovieChange,
    enableKeyboardNavigation: !showWelcome,
    transitionDuration: 1200
  });

  const {
    lenis,
    scrollY,
    scrollDirection,
    scrollToTop,
    start: startLenis,
    stop: stopLenis
  } = useLenisScroll({
    config: {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    },
    onScroll: handleScroll,
    onScrollEnd: handleScrollEnd,
    enableMovieSnapping: !showWelcome,
    movieCount: movies.length,
    snapThreshold: 100
  });

  const {
    playMovieTransition,
    cleanupAnimations,
    updateOptimizedSettings
  } = useGSAPAnimations({
    enableComplexAnimations: true,
    respectReducedMotion: true,
    optimizeForPerformance: false
  });

  /**
   * Handle movie change events
   */
  function handleMovieChange(event: MovieChangeEvent) {
    const newMovie = movies[event.toIndex];
    if (newMovie) {
      // Update global color variables
      setCurrentColors({
        main: newMovie.mainColor,
        accent: newMovie.accentColor
      });

      // Update CSS variables for theming
      updateCSSColors(newMovie.mainColor, newMovie.accentColor);

      // Play transition animation
      if (!isTransitioning) {
        playMovieTransition({
          direction: event.direction,
          fromIndex: event.fromIndex,
          toIndex: event.toIndex,
          duration: 1200
        });
      }
    }
  }

  /**
   * Handle scroll events
   */
  function handleScroll(event: CustomScrollEvent) {
    if (showWelcome) return;

    // Calculate current movie based on scroll position
    const viewportHeight = window.innerHeight;
    const movieSectionHeight = viewportHeight;
    const newIndex = Math.floor(event.scrollY / movieSectionHeight);
    
    // Update movie if changed
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < movies.length) {
      goToMovie(newIndex);
    }

    // Handle parallax effects for visible elements
    handleParallaxEffects(event.scrollY);
  }

  /**
   * Handle scroll end events
   */
  function handleScrollEnd() {
    // Implement any scroll end logic here
    console.log('Scroll ended');
  }

  /**
   * Handle parallax effects based on scroll position
   */
  function handleParallaxEffects(scrollY: number) {
    // Background parallax
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.getAttribute('data-parallax') || '0.5');
      gsap.to(element, {
        y: scrollY * speed,
        duration: 0.3,
        ease: "none"
      });
    });
  }

  /**
   * Update CSS custom properties for theming
   */
  function updateCSSColors(mainColor: string, accentColor: string) {
    const root = document.documentElement;
    root.style.setProperty('--movie-main-color', mainColor);
    root.style.setProperty('--movie-accent-color', accentColor);

    // Convert hex to RGB for rgba usage
    const mainRGB = hexToRgb(mainColor);
    const accentRGB = hexToRgb(accentColor);
    
    if (mainRGB) {
      root.style.setProperty('--movie-main-color-rgb', `${mainRGB.r}, ${mainRGB.g}, ${mainRGB.b}`);
    }
    if (accentRGB) {
      root.style.setProperty('--movie-accent-color-rgb', `${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}`);
    }
  }

  /**
   * Convert hex color to RGB
   */
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Handle welcome screen completion
   */
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    
    // Start Lenis smooth scrolling
    setTimeout(() => {
      startLenis();
    }, 500);

    // Initialize first movie colors
    if (movies.length > 0) {
      const firstMovie = movies[0];
      updateCSSColors(firstMovie.mainColor, firstMovie.accentColor);
      setCurrentColors({
        main: firstMovie.mainColor,
        accent: firstMovie.accentColor
      });
    }
  };

  /**
   * Handle navbar movie selection
   */
  const handleNavbarMovieSelect = (index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      // Calculate target scroll position
      const targetScroll = index * window.innerHeight;
      
      // Use Lenis to scroll to position
      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
      
      // Update movie state
      goToMovie(index);
    }
  };

  /**
   * Navigate to next movie (useful for future features)
   */
  const handleNextMovie = () => {
    const nextIndex = (currentIndex + 1) % movies.length;
    handleNavbarMovieSelect(nextIndex);
  };

  /**
   * Navigate to previous movie (useful for future features)
   */
  const handlePreviousMovie = () => {
    const prevIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    handleNavbarMovieSelect(prevIndex);
  };

  /**
   * Initialize app
   */
  useEffect(() => {
    const initializeApp = async () => {
      // Set initial colors
      if (movies.length > 0) {
        const firstMovie = movies[0];
        updateCSSColors(firstMovie.mainColor, firstMovie.accentColor);
      }

      // Update optimized settings based on device
      updateOptimizedSettings();

      // Simulate loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    initializeApp();
  }, [movies, updateOptimizedSettings]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      cleanupAnimations();
      stopLenis();
    };
  }, [cleanupAnimations, stopLenis]);

  /**
   * Handle window resize
   */
  useEffect(() => {
    const handleResize = () => {
      // Update GSAP ScrollTrigger
      ScrollTrigger.refresh();
      
      // Update optimized settings
      updateOptimizedSettings();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateOptimizedSettings]);

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    if (showWelcome) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          scrollToTop();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          handlePreviousMovie();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          handleNextMovie();
          break;
        case ' ':
          event.preventDefault();
          // Space key could trigger purchase modal
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showWelcome, scrollToTop]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading Cinema...</div>
      </div>
    );
  }

  // Show welcome screen
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // Main application
  return (
    <MainLayout>
      <div className="app" ref={appRef}>
        {/* Navigation Sidebar */}
        <Navbar
          movies={movies}
          activeMovieIndex={currentIndex}
          onMovieSelect={handleNavbarMovieSelect}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {/* Add scroll spacer to ensure scrollable content */}
          <div style={{ height: '100vh' }}></div>
          
          <div className="movies-container" ref={moviesSectionRef}>
            {movies.map((movie, index) => (
              <section
                key={movie.id}
                className="movie-section"
                data-movie-index={index}
                style={{ height: '100vh', minHeight: '100vh' }}
              >
                <MovieDisplay
                  movie={movie}
                  isActive={index === currentIndex}
                  isTransitioning={isTransitioning && (index === currentIndex)}
                />
              </section>
            ))}
          </div>
          
          {/* Footer spacer */}
          <div style={{ height: '50vh' }}></div>
        </main>

        {/* Debug Info (only in development) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs z-50">
            <div>Movie: {currentIndex + 1}/{movies.length}</div>
            <div>Scroll: {Math.round(scrollY)}px</div>
            <div>Direction: {scrollDirection || 'none'}</div>
            <div>Transitioning: {isTransitioning ? 'yes' : 'no'}</div>
            <div>Colors: {currentColors.main}</div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default App;