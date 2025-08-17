import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    if (task?.completed) {
      onToggleComplete(task?.id);
      return;
    }

    setIsCompleting(true);
    
    // Simulate completion animation
    setTimeout(() => {
      onToggleComplete(task?.id);
      setIsCompleting(false);
    }, 600);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Study': 'bg-primary/10 text-primary border-primary/20',
      'Work': 'bg-secondary/10 text-secondary border-secondary/20',
      'Personal': 'bg-accent/10 text-accent border-accent/20',
      'Health': 'bg-success/10 text-success border-success/20',
      'Other': 'bg-muted/10 text-muted-foreground border-muted/20'
    };
    return colors?.[category] || colors?.['Other'];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        morphic-card p-4 transition-all duration-200
        ${task?.completed ? 'opacity-60' : 'hover:shadow-medium'}
        ${isCompleting ? 'scale-105' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={`
            relative flex-shrink-0 w-6 h-6 rounded-full border-2 
            transition-all duration-300 mt-0.5
            ${task?.completed 
              ? 'bg-success border-success' :'border-muted-foreground hover:border-accent'
            }
            ${isCompleting ? 'animate-pulse' : ''}
          `}
          aria-label={task?.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task?.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Icon name="Check" size={14} className="text-success-foreground" strokeWidth={3} />
            </motion.div>
          )}
          
          {isCompleting && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Icon name="Sparkles" size={16} className="text-accent" />
            </motion.div>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`
              font-medium text-foreground transition-all duration-200
              ${task?.completed ? 'line-through opacity-60' : ''}
            `}>
              {task?.title}
            </h3>
            
            {/* Priority Indicator */}
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium flex-shrink-0
              ${getPriorityColor(task?.priority)}
            `}>
              {task?.priority}
            </span>
          </div>

          {/* Category and Time Estimate */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`
              px-2 py-1 rounded-md text-xs font-medium border
              ${getCategoryColor(task?.category)}
            `}>
              {task?.category}
            </span>
            
            {task?.timeEstimate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>{task?.timeEstimate}min</span>
              </div>
            )}
          </div>

          {/* Points Reward */}
          {task?.completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-xs text-accent font-medium"
            >
              <Icon name="Star" size={12} className="fill-current" />
              <span>+{task?.points} points earned!</span>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Edit task"
          >
            <Icon name="Edit2" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task?.id)}
            className="h-8 w-8 text-muted-foreground hover:text-error"
            aria-label="Delete task"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;