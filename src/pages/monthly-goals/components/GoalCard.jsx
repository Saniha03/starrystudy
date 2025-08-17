import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalCard = ({ goal, onEdit, onDelete, onTogglePrivacy, onCelebrate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-accent';
    if (progress >= 25) return 'bg-warning';
    return 'bg-primary';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(goal?.deadline);
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining <= 7 && daysRemaining >= 0;

  const handleProgressClick = () => {
    if (goal?.progress === 100 && !goal?.celebrated) {
      onCelebrate(goal?.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="morphic-card hover:shadow-medium transition-all duration-200"
    >
      {/* Goal Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon 
              name={goal?.category === 'academic' ? 'BookOpen' : 
                    goal?.category === 'personal' ? 'User' : 
                    goal?.category === 'fitness' ? 'Dumbbell' : 'Target'} 
              size={16} 
              className="text-accent" 
            />
            <span className="text-xs font-medium text-accent uppercase tracking-wide">
              {goal?.category}
            </span>
            {!goal?.isPrivate && (
              <Icon name="Users" size={14} className="text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {goal?.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {goal?.description}
          </p>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePrivacy(goal?.id)}
            className="h-8 w-8"
            aria-label={goal?.isPrivate ? "Make goal public" : "Make goal private"}
          >
            <Icon 
              name={goal?.isPrivate ? "EyeOff" : "Eye"} 
              size={16} 
              className={goal?.isPrivate ? "text-muted-foreground" : "text-accent"}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(goal)}
            className="h-8 w-8"
            aria-label="Edit goal"
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(goal?.id)}
            className="h-8 w-8 text-error hover:text-error"
            aria-label="Delete goal"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm font-semibold text-accent">
            {goal?.progress}%
          </span>
        </div>
        
        <div 
          className="w-full bg-muted rounded-full h-2 cursor-pointer"
          onClick={handleProgressClick}
        >
          <motion.div
            className={`h-2 rounded-full ${getProgressColor(goal?.progress)}`}
            initial={{ width: 0 }}
            animate={{ width: `${goal?.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {goal?.progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 mt-2 text-success"
          >
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm font-medium">Goal Completed!</span>
            {goal?.celebrated && (
              <Icon name="Sparkles" size={16} className="text-accent" />
            )}
          </motion.div>
        )}
      </div>
      {/* Deadline and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon 
            name="Calendar" 
            size={16} 
            className={isOverdue ? "text-error" : isUrgent ? "text-warning" : "text-muted-foreground"}
          />
          <span className={`text-sm ${isOverdue ? "text-error" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
            {isOverdue 
              ? `Overdue by ${Math.abs(daysRemaining)} days`
              : daysRemaining === 0 
                ? "Due today"
                : `${daysRemaining} days left`
            }
          </span>
        </div>
        
        <span className="text-xs text-muted-foreground">
          Due: {new Date(goal.deadline)?.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
      {/* Milestones */}
      {goal?.milestones && goal?.milestones?.length > 0 && (
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="mr-1"
            />
            {goal?.milestones?.length} milestones
          </Button>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {goal?.milestones?.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Icon 
                    name={milestone?.completed ? "CheckCircle" : "Circle"} 
                    size={14} 
                    className={milestone?.completed ? "text-success" : "text-muted-foreground"}
                  />
                  <span className={milestone?.completed ? "text-success line-through" : "text-foreground"}>
                    {milestone?.title}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
      {/* Friend Interactions */}
      {!goal?.isPrivate && goal?.friendInteractions && goal?.friendInteractions?.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <div className="flex -space-x-2">
            {goal?.friendInteractions?.slice(0, 3)?.map((friend, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground border-2 border-surface"
              >
                {friend?.name?.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {goal?.friendInteractions?.length} friend{goal?.friendInteractions?.length !== 1 ? 's' : ''} cheering you on
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;