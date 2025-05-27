// src/hooks/useLenisScroll.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { 
  type UseLenisScrollReturn, 
  type LenisConfig, 
  type CustomScrollEvent 
} from '../types/movie.types';

interface UseLenisScrollOptions {
  config?: Partial<LenisConfig>;
  onScroll?: (event: CustomScrollEvent) => void;
  onScrollEnd?: () => void;
  enableMovieSnapping?: boolean;
  movieCount?: number;
  snapThreshold?: number;
}

const DEFAULT_LENIS_CONFIG: LenisConfig = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
  autoResize: true
};

export const useLenisScroll = ({
  config = {},
  onScroll,
  onScrollEnd,
  enableMovieSnapping = true,
  movieCount = 0,
  snapThreshold = 100
}: UseLenisScrollOptions = {}): UseLenisScrollReturn => {
  
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const isSnappingRef = useRef(false);

  // Merge config with defaults
  const finalConfig = { ...DEFAULT_LENIS_CONFIG, ...config };

  /**
   * Initialize Lenis
   */
  useEffect(() => {
    const lenis = new Lenis(finalConfig);
    lenisRef.current = lenis;

    // RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Scroll event handler
    const handleScroll = (e: any) => {
      const currentScrollY = e.scroll;
      const direction = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
      
      setScrollY(currentScrollY);
      setScrollDirection(direction);
      setIsScrolling(true);
      
      velocityRef.current = e.velocity;
      lastScrollYRef.current = currentScrollY;

      // Fire custom scroll event
      if (onScroll) {
        onScroll({
          scrollY: currentScrollY,
          direction,
          velocity: e.velocity,
          isScrolling: true
        });
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scroll end timeout
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection(null);
        
        if (onScrollEnd) {
          onScrollEnd();
        }

        // Handle movie snapping
        if (enableMovieSnapping && movieCount > 0 && !isSnappingRef.current) {
          handleMovieSnapping(currentScrollY);
        }
      }, 150);
    };

    lenis.on('scroll', handleScroll);

    // Cleanup
    return () => {
      lenis.destroy();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [finalConfig, onScroll, onScrollEnd, enableMovieSnapping, movieCount]);

  /**
   * Handle snapping to movie sections
   */
  const handleMovieSnapping = useCallback((currentScroll: number) => {
    if (!enableMovieSnapping || movieCount <= 0 || isSnappingRef.current) return;

    const viewportHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight - viewportHeight;
    const movieSectionHeight = totalHeight / movieCount;
    
    const currentMovieIndex = Math.round(currentScroll / movieSectionHeight);
    const targetScroll = currentMovieIndex * movieSectionHeight;
    
    // Only snap if we're close enough to a movie boundary
    const distanceToTarget = Math.abs(currentScroll - targetScroll);
    
    if (distanceToTarget > snapThreshold && distanceToTarget < movieSectionHeight / 3) {
      scrollToMovie(currentMovieIndex);
    }
  }, [enableMovieSnapping, movieCount, snapThreshold]);

  /**
   * Scroll to specific movie by index
   */
  const scrollToMovie = useCallback((movieIndex: number) => {
    if (!lenisRef.current || movieIndex < 0 || movieIndex >= movieCount) return;

    isSnappingRef.current = true;
    
    const viewportHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight - viewportHeight;
    const movieSectionHeight = totalHeight / movieCount;
    const targetScroll = movieIndex * movieSectionHeight;

    lenisRef.current.scrollTo(targetScroll, {
      duration: finalConfig.duration * 1.5,
      easing: finalConfig.easing,
      onComplete: () => {
        isSnappingRef.current = false;
      }
    });
  }, [movieCount, finalConfig]);

  /**
   * Scroll to top of page
   */
  const scrollToTop = useCallback(() => {
    if (!lenisRef.current) return;

    isSnappingRef.current = true;
    
    lenisRef.current.scrollTo(0, {
      duration: finalConfig.duration * 2,
      easing: finalConfig.easing,
      onComplete: () => {
        isSnappingRef.current = false;
      }
    });
  }, [finalConfig]);

  /**
   * Start smooth scroll
   */
  const start = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  /**
   * Stop smooth scroll
   */
  const stop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  }, []);

  /**
   * Resize handler for responsive behavior
   */
  useEffect(() => {
    const handleResize = () => {
      if (lenisRef.current) {
        lenisRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    lenis: lenisRef.current,
    scrollY,
    isScrolling,
    scrollDirection,
    scrollToMovie,
    scrollToTop,
    start,
    stop
  };
};