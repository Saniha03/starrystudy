import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BreakReminder = ({ 
  isVisible, 
  onTakeBreak, 
  onContinue, 
  studyDuration = 0 
}) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="morphic-card max-w-md w-full text-center"
          >
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
                <Icon name="Coffee" size={32} className="text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Time for a Break!
              </h3>
              <p className="text-muted-foreground">
                You've been studying for {formatDuration(studyDuration)}. 
                Taking regular breaks helps maintain focus and productivity.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="default"
                onClick={onTakeBreak}
                iconName="Pause"
                iconPosition="left"
                fullWidth
                className="bg-warning text-warning-foreground hover:bg-warning/90"
              >
                Take a 5-minute break
              </Button>
              
              <Button
                variant="outline"
                onClick={onContinue}
                iconName="Play"
                iconPosition="left"
                fullWidth
              >
                Continue studying
              </Button>
            </div>

            <div className="mt-4 p-3 bg-accent/5 rounded-lg">
              <p className="text-xs text-accent">
                💡 Tip: The Pomodoro Technique suggests 5-minute breaks every 25 minutes
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreakReminder;