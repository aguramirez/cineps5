// src/hooks/useGSAPAnimations.ts

import { useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  type UseGSAPAnimationsReturn, 
  type AnimationConfig, 
  type MovieTransitionOptions 
} from '../types/movie.types';
import {
  cinematicEntrance,
  cinematicExit,
  movieMorphTransition,
  staggerElements,
  magneticHover,
  colorBleeding,
  typewriterEffect,
  killAllAnimations,
  getOptimizedSettings
} from '../utils/gsapHelpers';

interface UseGSAPAnimationsOptions {
  enableComplexAnimations?: boolean;
  respectReducedMotion?: boolean;
  optimizeForPerformance?: boolean;
}

export const useGSAPAnimations = ({
  enableComplexAnimations = true,
  respectReducedMotion = true,
  optimizeForPerformance = true
}: UseGSAPAnimationsOptions = {}): UseGSAPAnimationsReturn => {
  
  const activeAnimationsRef = useRef<Set<gsap.core.Timeline | gsap.core.Tween>>(new Set());
  const magneticCleanupRef = useRef<Map<Element, () => void>>(new Map());
  const optimizedSettingsRef = useRef(getOptimizedSettings());

  /**
   * Track animation for cleanup
   */
  const trackAnimation = useCallback((animation: gsap.core.Timeline | gsap.core.Tween) => {
    activeAnimationsRef.current.add(animation);
    
    // Auto-remove when complete
    animation.eventCallback('onComplete', () => {
      activeAnimationsRef.current.delete(animation);
    });
    
    return animation;
  }, []);

  /**
   * Play movie entrance animation
   */
  const playMovieEntrance = useCallback(async (
    elements: Element[], 
    config?: AnimationConfig
  ): Promise<void> => {
    if (!enableComplexAnimations && optimizeForPerformance) {
      // Simple fade-in for performance
      gsap.set(elements, { opacity: 0 });
      const animation = gsap.to(elements, { 
        opacity: 1, 
        duration: optimizedSettingsRef.current.duration,
        stagger: 0.1 
      });
      trackAnimation(animation);
      return;
    }

    return cinematicEntrance(elements, {
      duration: config?.duration || optimizedSettingsRef.current.duration,
      ease: config?.ease || optimizedSettingsRef.current.ease,
      stagger: config?.stagger || 0.2
    });
  }, [enableComplexAnimations, optimizeForPerformance, trackAnimation]);

  /**
   * Play movie exit animation
   */
  const playMovieExit = useCallback(async (
    elements: Element[], 
    config?: AnimationConfig
  ): Promise<void> => {
    if (!enableComplexAnimations && optimizeForPerformance) {
      // Simple fade-out for performance
      const animation = gsap.to(elements, { 
        opacity: 0, 
        duration: optimizedSettingsRef.current.duration * 0.5 
      });
      trackAnimation(animation);
      return;
    }

    return cinematicExit(elements, {
      duration: config?.duration || optimizedSettingsRef.current.duration,
      ease: config?.ease || optimizedSettingsRef.current.ease,
      stagger: config?.stagger || 0.1
    });
  }, [enableComplexAnimations, optimizeForPerformance, trackAnimation]);

  /**
   * Play movie transition animation
   */
  const playMovieTransition = useCallback(async (
    options: MovieTransitionOptions
  ): Promise<void> => {
    const fromElement = document.querySelector(`[data-movie-index="${options.fromIndex}"]`);
    const toElement = document.querySelector(`[data-movie-index="${options.toIndex}"]`);

    if (!fromElement || !toElement) {
      console.warn('Movie transition elements not found');
      return;
    }

    if (!enableComplexAnimations && optimizeForPerformance) {
      // Simple cross-fade
      const tl = gsap.timeline();
      tl.to(fromElement, { opacity: 0, duration: 0.3 })
        .fromTo(toElement, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.1");
      trackAnimation(tl);
      return;
    }

    return movieMorphTransition(fromElement, toElement, options);
  }, [enableComplexAnimations, optimizeForPerformance, trackAnimation]);

  /**
   * Morph transition between elements
   */
  const morphTransition = useCallback(async (
    fromElement: Element, 
    toElement: Element, 
    config?: AnimationConfig
  ): Promise<void> => {
    const tl = gsap.timeline();
    
    // Exit animation
    tl.to(fromElement, {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
      duration: (config?.duration || 0.8) / 2,
      ease: config?.ease || 'power2.inOut'
    });
    
    // Enter animation
    tl.fromTo(toElement,
      { opacity: 0, scale: 1.1, filter: 'blur(10px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: (config?.duration || 0.8) / 2,
        ease: config?.ease || 'power2.inOut'
      },
      "-=0.1"
    );

    trackAnimation(tl);
    return new Promise(resolve => tl.eventCallback('onComplete', resolve));
  }, [trackAnimation]);

  /**
   * Stagger animation for multiple elements
   */
  const staggerAnimation = useCallback(async (
    elements: Element[], 
    config?: {
      from?: Record<string, any>;
      to?: Record<string, any>;
      duration?: number;
      stagger?: number;
      ease?: string;
    }
  ): Promise<void> => {
    return staggerElements(elements, {
      from: config?.from,
      to: config?.to,
      duration: config?.duration || optimizedSettingsRef.current.duration,
      ease: config?.ease || optimizedSettingsRef.current.ease,
      stagger: config?.stagger || 0.15
    });
  }, []);

  /**
   * Apply magnetic hover effect
   */
  const magneticHoverEffect = useCallback((element: Element, strength: number = 0.3) => {
    if (!enableComplexAnimations) return;

    // Clean up existing effect
    const existingCleanup = magneticCleanupRef.current.get(element);
    if (existingCleanup) {
      existingCleanup();
    }

    // Apply new effect
    const cleanup = magneticHover(element, strength);
    magneticCleanupRef.current.set(element, cleanup);
  }, [enableComplexAnimations]);

  /**
   * Apply color bleeding effect
   */
  const applyColorBleeding = useCallback((
    element: Element, 
    mainColor: string, 
    accentColor: string,
    duration: number = 1
  ) => {
    const animation = colorBleeding(element, mainColor, accentColor, duration);
    trackAnimation(animation);
    return animation;
  }, [trackAnimation]);

  /**
   * Typewriter text effect
   */
  const playTypewriter = useCallback(async (
    element: Element, 
    text: string, 
    speed: number = 0.05
  ): Promise<void> => {
    if (!enableComplexAnimations) {
      // Instant text for performance
      element.textContent = text;
      return;
    }

    return typewriterEffect(element, text, speed);
  }, [enableComplexAnimations]);

  /**
   * Floating animation for ambient elements
   */
  const floatingElement = useCallback((
    element: Element, 
    config: {
      yRange?: number;
      duration?: number;
      ease?: string;
    } = {}
  ) => {
    if (!enableComplexAnimations) return null;

    const animation = gsap.to(element, {
      y: `+=${config.yRange || 20}`,
      duration: config.duration || 4,
      ease: config.ease || 'power2.inOut',
      repeat: -1,
      yoyo: true
    });

    trackAnimation(animation);
    return animation;
  }, [enableComplexAnimations, trackAnimation]);

  /**
   * Cleanup all animations
   */
  const cleanupAnimations = useCallback(() => {
    // Kill tracked animations
    activeAnimationsRef.current.forEach(animation => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });
    activeAnimationsRef.current.clear();

    // Cleanup magnetic effects
    magneticCleanupRef.current.forEach(cleanup => cleanup());
    magneticCleanupRef.current.clear();

    // Kill all GSAP animations
    killAllAnimations();
  }, []);

  /**
   * Update optimized settings based on current conditions
   */
  const updateOptimizedSettings = useCallback(() => {
    optimizedSettingsRef.current = getOptimizedSettings();
  }, []);

  /**
   * Handle reduced motion preference
   */
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      updateOptimizedSettings();
      if (mediaQuery.matches) {
        cleanupAnimations();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Initial check

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [respectReducedMotion, updateOptimizedSettings, cleanupAnimations]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      cleanupAnimations();
    };
  }, [cleanupAnimations]);

  return {
    playMovieEntrance,
    playMovieExit,
    playMovieTransition,
    morphTransition,
    staggerAnimation,
    magneticHover: magneticHoverEffect,
    cleanupAnimations,
    updateOptimizedSettings
  };
};