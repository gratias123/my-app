import React, { useEffect, useRef, useState } from 'react';

export type RevealAnimation = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds (optional, defaults to 700ms)
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration,
  threshold = 0.12,
  rootMargin = '0px 0px -30px 0px',
  className = '',
  as: Component = 'div',
  id,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // If browser doesn't support IntersectionObserver or reduced motion is preferred
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, rootMargin]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-in':
        return 'scroll-reveal-fade';
      case 'fade-left':
        return 'scroll-reveal-left';
      case 'fade-right':
        return 'scroll-reveal-right';
      case 'scale':
        return 'scroll-reveal-scale';
      case 'fade-up':
      default:
        return 'scroll-reveal';
    }
  };

  const style: React.CSSProperties = {};
  if (delay > 0) {
    style.transitionDelay = `${delay}ms`;
  }
  if (duration && duration > 0) {
    style.transitionDuration = `${duration}ms`;
  }

  return (
    <Component
      id={id}
      ref={elementRef}
      style={style}
      className={`${getAnimationClass()} ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};
