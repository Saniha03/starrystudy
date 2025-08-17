import React from 'react';
import { motion } from 'framer-motion';

const TimerDisplay = ({ time, isActive, progress = 0 }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        {/* Background Circle */}
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            stroke="var(--color-accent)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className={`text-5xl md:text-6xl font-mono font-semibold ${
              isActive ? 'text-accent' : 'text-foreground'
            }`}
            animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            {formatTime(time)}
          </motion.div>
          
          {/* Pulsing Dots */}
          {isActive && (
            <div className="flex gap-1 mt-4">
              {[0, 1, 2]?.map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Starry Background Effect */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)]?.map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i * 8)}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;