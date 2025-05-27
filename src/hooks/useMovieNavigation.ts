// src/hooks/useMovieNavigation.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  type UseMovieNavigationReturn, 
  type Movie, 
  type MovieChangeEvent 
} from '../types/movie.types';

interface UseMovieNavigationOptions {
  movies: Movie[];
  initialIndex?: number;
  onMovieChange?: (event: MovieChangeEvent) => void;
  enableKeyboardNavigation?: boolean;
  transitionDuration?: number;
}

export const useMovieNavigation = ({
  movies,
  initialIndex = 0,
  onMovieChange,
  enableKeyboardNavigation = true,
  transitionDuration = 800
}: UseMovieNavigationOptions): UseMovieNavigationReturn => {
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  
  const transitionTimeoutRef = useRef<number | null>(null);
  const lastChangeTimeRef = useRef<number>(0);
  
  // Minimum time between transitions (debounce)
  const MIN_TRANSITION_INTERVAL = 100;

  /**
   * Navigate to a specific movie by index
   */
  const goToMovie = useCallback((targetIndex: number) => {
    const now = Date.now();
    
    // Prevent rapid transitions
    if (
      isTransitioning || 
      targetIndex === currentIndex || 
      targetIndex < 0 || 
      targetIndex >= movies.length ||
      (now - lastChangeTimeRef.current) < MIN_TRANSITION_INTERVAL
    ) {
      return;
    }

    const newDirection = targetIndex > currentIndex ? 'down' : 'up';
    const toMovie = movies[targetIndex];

    // Update state
    setIsTransitioning(true);
    setDirection(newDirection);
    lastChangeTimeRef.current = now;

    // Fire change event
    if (onMovieChange) {
      onMovieChange({
        fromIndex: currentIndex,
        toIndex: targetIndex,
        direction: newDirection,
        movie: toMovie
      });
    }

    // Clear existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Update index immediately for UI
    setCurrentIndex(targetIndex);

    // Complete transition after duration
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      setDirection(null);
    }, transitionDuration);

  }, [currentIndex, isTransitioning, movies, onMovieChange, transitionDuration]);

  /**
   * Navigate to next movie
   */
  const nextMovie = useCallback(() => {
    const nextIndex = (currentIndex + 1) % movies.length;
    goToMovie(nextIndex);
  }, [currentIndex, movies.length, goToMovie]);

  /**
   * Navigate to previous movie
   */
  const previousMovie = useCallback(() => {
    const prevIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    goToMovie(prevIndex);
  }, [currentIndex, movies.length, goToMovie]);

  /**
   * Manually set transitioning state (useful for external animations)
   */
  const setTransitioning = useCallback((transitioning: boolean) => {
    setIsTransitioning(transitioning);
    if (!transitioning) {
      setDirection(null);
    }
  }, []);

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case 'j':
          event.preventDefault();
          nextMovie();
          break;
        case 'ArrowUp':
        case 'PageUp':
        case 'k':
          event.preventDefault();
          previousMovie();
          break;
        case 'Home':
          event.preventDefault();
          goToMovie(0);
          break;
        case 'End':
          event.preventDefault();
          goToMovie(movies.length - 1);
          break;
        default:
          // Handle number keys for direct navigation
          const num = parseInt(event.key);
          if (!isNaN(num) && num >= 1 && num <= movies.length) {
            event.preventDefault();
            goToMovie(num - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [enableKeyboardNavigation, nextMovie, previousMovie, goToMovie, movies.length]);

  /**
   * Validate current index when movies array changes
   */
  useEffect(() => {
    if (currentIndex >= movies.length) {
      setCurrentIndex(Math.max(0, movies.length - 1));
    }
  }, [movies.length, currentIndex]);

  /**
   * Cleanup timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentIndex,
    isTransitioning,
    direction,
    goToMovie,
    nextMovie,
    previousMovie,
    setTransitioning
  };
};