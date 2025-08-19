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
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Study': 'bg-blue-50 text-blue-700 border-blue-200',
      'Work': 'bg-purple-50 text-purple-700 border-purple-200',
      'Personal': 'bg-pink-50 text-pink-700 border-pink-200',
      'Health': 'bg-green-50 text-green-700 border-green-200',
      'Other': 'bg-gray-50 text-gray-700 border-gray-200'
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
        bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 shadow-sm
        ${task?.completed ? 'opacity-60' : 'hover:shadow-md'}
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
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-blue-400'
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
              <Icon name="Check" size={14} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
          
          {isCompleting && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Icon name="Sparkles" size={16} className="text-blue-500" />
            </motion.div>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`
              font-medium text-gray-900 transition-all duration-200
              ${task?.completed ? 'line-through opacity-60' : ''}
            `}>
              {task?.title}
            </h3>
            
            {/* Priority Indicator */}
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 border
              ${getPriorityColor(task?.priority)}
            `}>
              {task?.priority}
            </span>
          </div>

          {/* Category and Time Estimate */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`
              px-2 py-1 rounded-md text-xs font-medium border
              ${getCategoryColor(task?.category)}
            `}>
              {task?.category || 'Other'}
            </span>
            
            {task?.timeEstimate && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
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
              className="flex items-center gap-1 text-xs text-blue-600 font-medium"
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
            size="sm"
            onClick={() => onEdit(task)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Edit task"
          >
            <Icon name="Edit2" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task?.id)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
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
