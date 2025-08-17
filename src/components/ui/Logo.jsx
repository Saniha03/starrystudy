import React from 'react';
import Icon from '../AppIcon';

const Logo = ({ size = 'default', showText = true, className = '' }) => {
  const sizeConfig = {
    sm: {
      container: 'h-8',
      icon: 20,
      text: 'text-lg'
    },
    default: {
      container: 'h-10',
      icon: 24,
      text: 'text-xl'
    },
    lg: {
      container: 'h-12',
      icon: 28,
      text: 'text-2xl'
    },
    xl: {
      container: 'h-16',
      icon: 36,
      text: 'text-3xl'
    }
  };

  const config = sizeConfig?.[size];

  return (
    <div className={`flex items-center gap-2 ${config?.container} ${className}`}>
      {/* Star Icon with Cosmic Gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-accent rounded-full blur-sm opacity-30" />
        <div className="relative bg-gradient-to-br from-accent to-primary rounded-full p-1.5">
          <Icon 
            name="Star" 
            size={config?.icon} 
            className="text-white fill-current"
            strokeWidth={1.5}
          />
        </div>
      </div>
      {/* App Name */}
      {showText && (
        <span className={`
          font-semibold ${config?.text} text-foreground
          bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent
        `}>
          StarryStudy
        </span>
      )}
    </div>
  );
};

export default Logo;