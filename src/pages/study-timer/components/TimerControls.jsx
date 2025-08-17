import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TimerControls = ({ 
  isActive, 
  isPaused, 
  onStart, 
  onPause, 
  onStop, 
  onReset,
  disabled = false 
}) => {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {/* Start/Pause Button */}
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant={isActive && !isPaused ? "outline" : "default"}
          size="lg"
          onClick={isActive && !isPaused ? onPause : onStart}
          disabled={disabled}
          className={`
            h-16 w-16 rounded-full p-0 
            ${isActive && !isPaused 
              ? 'bg-warning text-warning-foreground hover:bg-warning/90' 
              : 'bg-accent text-accent-foreground hover:bg-accent/90'
            }
            shadow-medium transition-all duration-200
          `}
          aria-label={isActive && !isPaused ? "Pause timer" : "Start timer"}
        >
          <Icon 
            name={isActive && !isPaused ? "Pause" : "Play"} 
            size={24} 
            strokeWidth={2.5}
          />
        </Button>
      </motion.div>
      {/* Stop Button */}
      {(isActive || isPaused) && (
        <motion.div 
          variants={buttonVariants} 
          whileHover="hover" 
          whileTap="tap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Button
            variant="destructive"
            size="lg"
            onClick={onStop}
            disabled={disabled}
            className="h-14 w-14 rounded-full p-0 shadow-medium"
            aria-label="Stop timer"
          >
            <Icon name="Square" size={20} strokeWidth={2.5} />
          </Button>
        </motion.div>
      )}
      {/* Reset Button */}
      {!isActive && (
        <motion.div 
          variants={buttonVariants} 
          whileHover="hover" 
          whileTap="tap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={onReset}
            disabled={disabled}
            className="h-14 w-14 rounded-full p-0 text-muted-foreground hover:text-foreground"
            aria-label="Reset timer"
          >
            <Icon name="RotateCcw" size={20} strokeWidth={2} />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TimerControls;