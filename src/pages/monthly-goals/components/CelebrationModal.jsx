import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CelebrationModal = ({ isOpen, onClose, goal, onShare }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!goal) return null;

  const celebrationMessages = [
    "🌟 Outstanding achievement! You've reached for the stars and caught one!",
    "🎯 Goal conquered! Your dedication has paid off beautifully!",
    "✨ Incredible work! You've turned your dreams into reality!",
    "🚀 Mission accomplished! You're unstoppable!",
    "💫 Stellar performance! You've made it happen!"
  ];

  const randomMessage = celebrationMessages?.[Math.floor(Math.random() * celebrationMessages?.length)];

  const handleShare = () => {
    onShare(goal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Goal Completed!"
      showCloseButton={false}
      closeOnBackdrop={false}
      size="default"
    >
      <div className="text-center py-4">
        {/* Animated Stars */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full mb-4"
          >
            <Icon name="Star" size={40} className="text-white fill-current" />
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)]?.map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full"
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: Math.cos(i * 60 * Math.PI / 180) * 60,
                y: Math.sin(i * 60 * Math.PI / 180) * 60
              }}
              transition={{ 
                duration: 2, 
                delay: 0.3 + i * 0.1,
                ease: "easeOut"
              }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>

        {/* Celebration Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Goal Completed! 🎉
          </h2>
          <h3 className="text-lg font-semibold text-accent mb-3">
            "{goal?.title}"
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {randomMessage}
          </p>
        </motion.div>

        {/* Goal Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface rounded-lg p-4 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-success">100%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">
                {goal?.category}
              </div>
              <div className="text-xs text-muted-foreground">Category</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">
                +{goal?.points || 50}
              </div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            <Icon name="X" size={16} className="mr-2" />
            Close
          </Button>
          <Button
            variant="default"
            onClick={handleShare}
            className="flex-1"
          >
            <Icon name="Share2" size={16} className="mr-2" />
            Share Achievement
          </Button>
        </motion.div>

        {/* Auto-close indicator */}
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-1 bg-accent rounded-full mt-4"
        />
      </div>
    </Modal>
  );
};

export default CelebrationModal;