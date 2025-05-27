// src/components/TicketPurchase/TicketPurchaseButton.tsx

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './TicketPurchaseButton.css';

interface TicketPurchaseButtonProps {
  movieTitle: string;
  mainColor: string;
  accentColor: string;
  isActive: boolean;
  onClick?: () => void;
}

const TicketPurchaseButton: React.FC<TicketPurchaseButtonProps> = ({
  movieTitle,
  mainColor,
  accentColor,
  isActive,
  onClick
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!buttonRef.current || !isActive) return;

    // Set color variables
    const button = buttonRef.current;
    button.style.setProperty('--btn-main-color', mainColor);
    button.style.setProperty('--btn-accent-color', accentColor);

    // Entrance animation
    gsap.fromTo(buttonRef.current,
      {
        scale: 0.8,
        opacity: 0,
        y: 50
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.8
      }
    );

    // Pulsing glow animation
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      });
    }

  }, [isActive, mainColor, accentColor]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.5,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Ripple effect
    if (rippleRef.current) {
      const rect = buttonRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      rippleRef.current.style.left = `${x}px`;
      rippleRef.current.style.top = `${y}px`;
      
      gsap.fromTo(rippleRef.current,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }

    // Button press animation
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    onClick?.();
  };

  return (
    <div className="ticket-purchase-container">
      {/* Glow Background */}
      <div className="button-glow" ref={glowRef}></div>
      
      {/* Main Button */}
      <button
        ref={buttonRef}
        className={`ticket-purchase-btn ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-hover="true"
      >
        {/* Button Background */}
        <div className="btn-background">
          <div className="btn-gradient"></div>
          <div className="btn-shimmer"></div>
        </div>

        {/* Button Content */}
        <div className="btn-content">
          <div className="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M20 7H16V6C16 4.34 14.66 3 13 3H11C9.34 3 8 4.34 8 6V7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM10 6C10 5.45 10.45 5 11 5H13C13.55 5 14 5.45 14 6V7H10V6ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="btn-text">
            <span className="btn-main-text">Comprar Entradas</span>
            <span className="btn-sub-text">{movieTitle}</span>
          </div>
          <div className="btn-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path 
                d="M8 5L15 12L8 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="btn-particles">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="btn-particle"
              style={{
                '--delay': `${i * 0.3}s`,
                '--x': `${20 + (i % 3) * 30}%`,
                '--y': `${30 + Math.floor(i / 3) * 40}%`
              } as React.CSSProperties}
            ></div>
          ))}
        </div>

        {/* Ripple Effect */}
        <div className="btn-ripple" ref={rippleRef}></div>
      </button>

      {/* Price Badge */}
      <div className="price-badge">
        <span className="price-from">Desde</span>
        <span className="price-amount">$12.50</span>
      </div>
    </div>
  );
};

export default TicketPurchaseButton;