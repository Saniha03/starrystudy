import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DailyProgress = ({ completedTasks, totalTasks, pointsEarned, streak }) => {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const formatDate = () => {
    const today = new Date();
    return today?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="morphic-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Today's Progress</h2>
          <p className="text-sm text-muted-foreground">{formatDate()}</p>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-lg">
          <Icon name="Flame" size={16} className="text-accent" />
          <span className="text-sm font-medium text-accent">{streak} day streak</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {/* Progress Circle */}
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-accent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">
              {Math.round(completionPercentage)}%
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 ml-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-2xl font-bold text-foreground">{completedTasks}</span>
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Circle" size={16} className="text-muted-foreground" />
              <span className="text-2xl font-bold text-foreground">{totalTasks - completedTasks}</span>
            </div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          
          <div className="text-center col-span-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Icon name="Star" size={16} className="text-accent fill-current" />
              <span className="text-2xl font-bold text-accent">{pointsEarned}</span>
            </div>
            <p className="text-xs text-muted-foreground">Points Today</p>
          </div>
        </div>
      </div>
      {/* Motivational Message */}
      {completionPercentage === 100 && totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20"
        >
          <div className="flex items-center gap-2">
            <Icon name="Trophy" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              Amazing! You've completed all tasks for today! 🎉
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DailyProgress;