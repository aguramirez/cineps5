// src/utils/gsapHelpers.ts

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  type AnimationConfig, 
  type TransitionConfig, 
  type MovieTransitionOptions,
  ANIMATION_DURATIONS,
  EASING_FUNCTIONS 
} from '../types/movie.types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Default animation configurations
 */
export const DEFAULT_CONFIGS = {
  entrance: {
    duration: ANIMATION_DURATIONS.cinematic,
    ease: EASING_FUNCTIONS.power3,
    stagger: 0.2
  },
  exit: {
    duration: ANIMATION_DURATIONS.normal,
    ease: EASING_FUNCTIONS.power2,
    stagger: 0.1
  },
  transition: {
    duration: ANIMATION_DURATIONS.slow,
    ease: EASING_FUNCTIONS.power3
  },
  hover: {
    duration: ANIMATION_DURATIONS.fast,
    ease: EASING_FUNCTIONS.power2
  }
} as const;

/**
 * Create a GSAP timeline with common settings
 */
export const createTimeline = (config?: Partial<AnimationConfig>) => {
  return gsap.timeline({
    defaults: {
      duration: config?.duration || DEFAULT_CONFIGS.entrance.duration,
      ease: config?.ease || DEFAULT_CONFIGS.entrance.ease
    }
  });
};

/**
 * Cinematic entrance animation for movie elements
 */
export const cinematicEntrance = (
  elements: Element | Element[], 
  config: Partial<TransitionConfig> = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const tl = createTimeline(config);
    
    tl.fromTo(elements, 
      {
        opacity: 0,
        scale: 0.8,
        y: 100,
        rotateX: 45,
        filter: 'blur(20px)',
        ...config.from
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: config.duration || DEFAULT_CONFIGS.entrance.duration,
        ease: config.ease || DEFAULT_CONFIGS.entrance.ease,
        stagger: config.stagger || 0.2,
        onComplete: resolve,
        ...config.to
      }
    );
  });
};

/**
 * Cinematic exit animation for movie elements
 */
export const cinematicExit = (
  elements: Element | Element[], 
  config: Partial<TransitionConfig> = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const tl = createTimeline(config);
    
    tl.to(elements, {
      opacity: 0,
      scale: 0.95,
      y: -50,
      filter: 'blur(10px)',
      duration: config.duration || DEFAULT_CONFIGS.exit.duration,
      ease: config.ease || DEFAULT_CONFIGS.exit.ease,
      stagger: config.stagger || 0.1,
      onComplete: resolve,
      ...config.to
    });
  });
};

/**
 * Movie transition with morph effect
 */
export const movieMorphTransition = (
  fromElement: Element,
  toElement: Element,
  options: MovieTransitionOptions
): Promise<void> => {
  return new Promise((resolve) => {
    const tl = createTimeline();
    const isDownward = options.direction === 'down';
    
    // Exit animation for current movie
    tl.to(fromElement, {
      opacity: 0,
      scale: 0.9,
      y: isDownward ? -100 : 100,
      rotateX: isDownward ? -20 : 20,
      filter: 'blur(15px)',
      duration: options.duration ? options.duration / 2 : DEFAULT_CONFIGS.transition.duration / 2,
      ease: EASING_FUNCTIONS.power2
    });
    
    // Entrance animation for new movie
    tl.fromTo(toElement,
      {
        opacity: 0,
        scale: 1.1,
        y: isDownward ? 100 : -100,
        rotateX: isDownward ? 20 : -20,
        filter: 'blur(15px)'
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: options.duration ? options.duration / 2 : DEFAULT_CONFIGS.transition.duration / 2,
        ease: EASING_FUNCTIONS.power3,
        onComplete: resolve
      },
      "-=0.2"
    );
  });
};

/**
 * Stagger animation with advanced timing
 */
export const staggerElements = (
  elements: Element[],
  config: Partial<TransitionConfig> = {}
): Promise<void> => {
  return new Promise((resolve) => {
    gsap.fromTo(elements,
      {
        opacity: 0,
        y: 50,
        scale: 0.8,
        ...config.from
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: config.duration || DEFAULT_CONFIGS.entrance.duration,
        ease: config.ease || DEFAULT_CONFIGS.entrance.ease,
        stagger: config.stagger || 0.15,
        onComplete: resolve,
        ...config.to
      }
    );
  });
};

/**
 * Magnetic hover effect for interactive elements
 */
export const magneticHover = (element: Element, strength: number = 0.3) => {
  const handleMouseMove = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (mouseEvent.clientX - centerX) * strength;
    const deltaY = (mouseEvent.clientY - centerY) * strength;
    
    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: DEFAULT_CONFIGS.hover.duration,
      ease: EASING_FUNCTIONS.power2
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: DEFAULT_CONFIGS.hover.duration * 1.5,
      ease: EASING_FUNCTIONS.elastic
    });
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Parallax scroll effect
 */
export const parallaxScroll = (element: Element, speed: number = 0.5) => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    gsap.to(element, {
      y: scrollY * speed,
      duration: 0.3,
      ease: "none"
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Color bleeding effect for themed elements
 */
export const colorBleeding = (
  element: Element, 
  mainColor: string, 
  accentColor: string,
  duration: number = 1
) => {
  return gsap.to(element, {
    '--dynamic-main-color': mainColor,
    '--dynamic-accent-color': accentColor,
    duration,
    ease: EASING_FUNCTIONS.power2
  });
};

/**
 * Typewriter text effect
 */
export const typewriterEffect = (
  element: Element, 
  text: string, 
  speed: number = 0.05
): Promise<void> => {
  return new Promise((resolve) => {
    const words = text.split(' ');
    element.innerHTML = '';
    
    const tl = gsap.timeline({ onComplete: resolve });
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = '0';
      element.appendChild(span);
      
      tl.to(span, {
        opacity: 1,
        duration: 0.1,
        ease: "none"
      }, index * speed);
    });
  });
};

/**
 * Floating animation for ambient elements
 */
export const floatingAnimation = (
  element: Element, 
  config: {
    yRange?: number;
    duration?: number;
    ease?: string;
  } = {}
) => {
  const { yRange = 20, duration = 4, ease = EASING_FUNCTIONS.power2 } = config;
  
  return gsap.to(element, {
    y: `+=${yRange}`,
    duration,
    ease,
    repeat: -1,
    yoyo: true
  });
};

/**
 * Pulse animation for glowing elements
 */
export const pulseAnimation = (
  element: Element,
  config: {
    scale?: number;
    opacity?: number;
    duration?: number;
  } = {}
) => {
  const { scale = 1.1, opacity = 0.8, duration = 2 } = config;
  
  return gsap.to(element, {
    scale,
    opacity,
    duration,
    ease: EASING_FUNCTIONS.power2,
    repeat: -1,
    yoyo: true
  });
};

/**
 * Kill all GSAP animations and ScrollTriggers
 */
export const killAllAnimations = () => {
  gsap.killTweensOf("*");
  ScrollTrigger.killAll();
};

/**
 * Refresh ScrollTrigger instances
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

/**
 * Create scroll-triggered animation
 */
export const createScrollAnimation = (
  trigger: string | Element,
  animation: () => void,
  config: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    onEnter?: () => void;
    onLeave?: () => void;
  } = {}
) => {
  return ScrollTrigger.create({
    trigger,
    start: config.start || "top 80%",
    end: config.end || "bottom 20%",
    scrub: config.scrub || false,
    pin: config.pin || false,
    onEnter: () => {
      animation();
      config.onEnter?.();
    },
    onLeave: config.onLeave,
    animation: gsap.timeline()
  });
};

/**
 * Batch animations for performance
 */
export const batchAnimations = (animations: (() => void)[]) => {
  return gsap.timeline().add(() => {
    animations.forEach(animation => animation());
  });
};

/**
 * Get optimized animation settings based on device capabilities
 */
export const getOptimizedSettings = () => {
  const isLowEnd = window.navigator.hardwareConcurrency <= 4;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return {
      duration: 0.1,
      ease: "none",
      enableComplexAnimations: false,
      enableParticles: false
    };
  }
  
  if (isLowEnd) {
    return {
      duration: DEFAULT_CONFIGS.entrance.duration * 0.7,
      ease: EASING_FUNCTIONS.power2,
      enableComplexAnimations: false,
      enableParticles: false
    };
  }
  
  return {
    duration: DEFAULT_CONFIGS.entrance.duration,
    ease: EASING_FUNCTIONS.power3,
    enableComplexAnimations: true,
    enableParticles: true
  };
};