import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CompletionCelebration = ({ 
  isVisible, 
  onClose, 
  sessionData = {},
  pointsEarned = 0 
}) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const achievements = [
    { icon: 'Clock', label: 'Time Logged', value: formatDuration(sessionData?.duration || 0) },
    { icon: 'Star', label: 'Points Earned', value: `+${pointsEarned}` },
    { icon: 'Target', label: 'Category', value: sessionData?.category || 'General Study' }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="morphic-card max-w-md w-full text-center relative overflow-hidden"
          >
            {/* Celebration Background Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)]?.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-accent rounded-full"
                  style={{
                    left: `${10 + (i * 7)}%`,
                    top: `${5 + (i * 8)}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4"
                >
                  <Icon name="Trophy" size={40} className="text-success" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-foreground mb-2"
                >
                  Great Work! 🎉
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  You've completed another productive study session!
                </motion.p>
              </div>

              <div className="space-y-4 mb-6">
                {achievements?.map((achievement, index) => (
                  <motion.div
                    key={achievement?.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Icon name={achievement?.icon} size={16} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {achievement?.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-accent">
                      {achievement?.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              {sessionData?.notes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Notes: </span>
                    {sessionData?.notes}
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  variant="default"
                  onClick={onClose}
                  iconName="CheckCircle"
                  iconPosition="left"
                  fullWidth
                  className="bg-success text-success-foreground hover:bg-success/90"
                >
                  Continue Studying
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompletionCelebration;