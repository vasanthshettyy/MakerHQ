/**
 * BrandSync Premium Motion Tokens
 * Standardized for 60fps performance and Apple-tier fluidity.
 */

export const PREMIUM_SPRING = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.8,
  restDelta: 0.001
};

export const FLUID_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 24,
  mass: 1,
  restDelta: 0.001
};

export const MICRO_SPRING = { 
  type: 'spring', 
  stiffness: 450, 
  damping: 35 
};

// Aliases for legacy support (Part 1 Overhaul)
export const AGRO_SPRING = PREMIUM_SPRING;

// Apple-style "Fluid" Easing for non-spring transforms
export const APPLE_FLUID = { 
  ease: [0.4, 0, 0.2, 1], 
  duration: 0.45 
};

export const SUPER_SMOOTH = { 
  ease: [0.22, 1, 0.36, 1], 
  duration: 0.5 
};

// Standard Animation Variants
export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
  transition: PREMIUM_SPRING,
};

export const PAGE_SLIDE_FADE = PAGE_TRANSITION;

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: PREMIUM_SPRING,
  },
};

// Performance-optimized interactions (Transform & Opacity only)
export const MICRO_INTERACTION = {
  whileHover: { scale: 1.02, opacity: 0.95 },
  whileTap: { scale: 0.98, opacity: 1 },
  transition: MICRO_SPRING
};

export const GHOST_INTERACTION = {
  whileHover: { opacity: 0.7 },
  whileTap: { opacity: 0.9 },
  transition: { duration: 0.2 }
};
