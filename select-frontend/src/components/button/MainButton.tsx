import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MainButtonProps } from './types';
import './styles.css';

const CustomButton: React.FC<MainButtonProps> = ({
  text,
  onClick,
  disabled = false,
  className = '',
  
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isFocused && !disabled) {
        event.preventDefault();
        onClick();
      }
    };

    const buttonElement = buttonRef.current;
    if (buttonElement) {
      buttonElement.addEventListener('keydown', handleKeyDown as unknown as (event: Event) => void);
      return () => {
        buttonElement.removeEventListener('keydown', handleKeyDown as unknown as (event: Event) => void);
      };
    }
  }, [isFocused, onClick, disabled]);

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const buttonClasses = `custom-button ${className} ${disabled ? 'disabled' : ''} ${
    isHovered ? 'hovered' : ''
  } ${isFocused ? 'focused' : ''}`;

  return (
    <div
      ref={buttonRef}
      className={buttonClasses}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-disabled={disabled}
      aria-label={text}
    >
      <span className="button-text">{text}</span>
    </div>
  );
};

export default CustomButton;
