// src/hooks/useMovieNavigationSimple.ts

import { useState, useCallback } from 'react';

interface Movie {
  id: string;
  title: string;
  [key: string]: any;
}

interface UseMovieNavigationOptions {
  movies: Movie[];
  initialIndex?: number;
  onMovieChange?: (event: {
    fromIndex: number;
    toIndex: number;
    direction: 'up' | 'down';
    movie: Movie;
  }) => void;
}

export const useMovieNavigation = ({
  movies,
  initialIndex = 0,
  onMovieChange
}: UseMovieNavigationOptions) => {
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  const goToMovie = useCallback((targetIndex: number) => {
    if (
      isTransitioning || 
      targetIndex === currentIndex || 
      targetIndex < 0 || 
      targetIndex >= movies.length
    ) {
      return;
    }

    const newDirection = targetIndex > currentIndex ? 'down' : 'up';
    const toMovie = movies[targetIndex];

    // Fire change event
    if (onMovieChange) {
      onMovieChange({
        fromIndex: currentIndex,
        toIndex: targetIndex,
        direction: newDirection,
        movie: toMovie
      });
    }

    // Update state
    setIsTransitioning(true);
    setDirection(newDirection);
    setCurrentIndex(targetIndex);

    // Complete transition after a short delay
    setTimeout(() => {
      setIsTransitioning(false);
      setDirection(null);
    }, 500);

  }, [currentIndex, isTransitioning, movies, onMovieChange]);

  const nextMovie = useCallback(() => {
    const nextIndex = (currentIndex + 1) % movies.length;
    goToMovie(nextIndex);
  }, [currentIndex, movies.length, goToMovie]);

  const previousMovie = useCallback(() => {
    const prevIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;
    goToMovie(prevIndex);
  }, [currentIndex, movies.length, goToMovie]);

  return {
    currentIndex,
    isTransitioning,
    direction,
    goToMovie,
    nextMovie,
    previousMovie,
    setTransitioning: setIsTransitioning
  };
};