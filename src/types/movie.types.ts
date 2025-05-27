// src/types/movie.types.ts

export interface Character {
  id: string;
  name: string;
  actor: string;
  image: string;
  description: string;
}

export interface Movie {
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

export interface MovieData {
  movies: Movie[];
}

// Navigation and State Types
export interface MovieNavigationState {
  currentIndex: number;
  isTransitioning: boolean;
  direction: 'up' | 'down' | null;
}

export interface ScrollState {
  scrollY: number;
  isScrolling: boolean;
  lastScrollTime: number;
  scrollDirection: 'up' | 'down' | null;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
}

export interface TransitionConfig extends AnimationConfig {
  from: Record<string, any>;
  to: Record<string, any>;
}

// Lenis Configuration
export interface LenisConfig {
  duration: number;
  easing: (t: number) => number;
  direction: 'vertical' | 'horizontal';
  gestureDirection: 'vertical' | 'horizontal' | 'both';
  smooth: boolean;
  smoothTouch: boolean;
  touchMultiplier: number;
  infinite: boolean;
  autoResize: boolean;
}

// GSAP Animation Helpers
export interface GSAPAnimationOptions {
  target: Element | Element[] | string;
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  onStart?: () => void;
}

export interface MovieTransitionOptions {
  direction: 'up' | 'down';
  fromIndex: number;
  toIndex: number;
  duration?: number;
}

// Component Props Types
export interface NavbarProps {
  movies: Movie[];
  activeMovieIndex: number;
  onMovieSelect: (index: number) => void;
}

export interface WelcomeScreenProps {
  onComplete?: () => void;
}

export interface MovieDisplayProps {
  movie: Movie;
  isActive: boolean;
  isTransitioning: boolean;
}

export interface MoviePosterProps {
  movie: Movie;
  isActive: boolean;
}

export interface MovieInfoProps {
  movie: Movie;
  isActive: boolean;
}

export interface CharacterCarouselProps {
  characters: Character[];
  isActive: boolean;
  movieColor: string;
}

// Hook Return Types
export interface UseMovieNavigationReturn {
  currentIndex: number;
  isTransitioning: boolean;
  direction: 'up' | 'down' | null;
  goToMovie: (index: number) => void;
  nextMovie: () => void;
  previousMovie: () => void;
  setTransitioning: (transitioning: boolean) => void;
}

export interface UseLenisScrollReturn {
  lenis: any | null;
  scrollY: number;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollToMovie: (index: number) => void;
  scrollToTop: () => void;
}

export interface UseGSAPAnimationsReturn {
  playMovieEntrance: (elements: Element[], config?: AnimationConfig) => Promise<void>;
  playMovieExit: (elements: Element[], config?: AnimationConfig) => Promise<void>;
  playMovieTransition: (options: MovieTransitionOptions) => Promise<void>;
  morphTransition: (fromElement: Element, toElement: Element, config?: AnimationConfig) => Promise<void>;
  staggerAnimation: (elements: Element[], config?: TransitionConfig) => Promise<void>;
  magneticHover: (element: Element, strength?: number) => void;
  cleanupAnimations: () => void;
  updateOptimizedSettings: () => void;
}

// Utility Types
export type ColorRGB = [number, number, number];

export interface ColorPalette {
  main: string;
  accent: string;
  mainRGB: ColorRGB;
  accentRGB: ColorRGB;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export interface PerformanceConfig {
  enableParticles: boolean;
  enableGlassmorphism: boolean;
  enableComplexAnimations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

// Event Types
export interface CustomScrollEvent {
  scrollY: number;
  direction: 'up' | 'down';
  velocity: number;
  isScrolling: boolean;
}

export interface MovieChangeEvent {
  fromIndex: number;
  toIndex: number;
  direction: 'up' | 'down';
  movie: Movie;
}

// Error Types
export interface CinemaError {
  code: string;
  message: string;
  context?: Record<string, any>;
}

export type CinemaErrorType = 
  | 'MOVIE_LOAD_ERROR'
  | 'ANIMATION_ERROR'
  | 'SCROLL_ERROR'
  | 'NAVIGATION_ERROR'
  | 'ASSET_LOAD_ERROR';

// Constants
export const ANIMATION_DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  cinematic: 1.8
} as const;

export const EASING_FUNCTIONS = {
  power1: 'power1.out',
  power2: 'power2.out',
  power3: 'power3.out',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  bounce: 'bounce.out',
  circ: 'circ.out',
  expo: 'expo.out'
} as const;

export const BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920
} as const;