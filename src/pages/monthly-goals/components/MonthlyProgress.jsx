import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MonthlyProgress = ({ goals, currentMonth }) => {
  const totalGoals = goals?.length;
  const completedGoals = goals?.filter(goal => goal?.progress === 100)?.length;
  const activeGoals = goals?.filter(goal => goal?.progress > 0 && goal?.progress < 100)?.length;
  const overdueGoals = goals?.filter(goal => {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    return deadline < today && goal?.progress < 100;
  })?.length;

  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const stats = [
    {
      label: 'Total Goals',
      value: totalGoals,
      icon: 'Target',
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Completed',
      value: completedGoals,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'In Progress',
      value: activeGoals,
      icon: 'Play',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Overdue',
      value: overdueGoals,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="morphic-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {currentMonth} Goals
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your monthly progress and achievements
          </p>
        </div>
        
        {/* Overall Completion Rate */}
        <div className="text-right">
          <div className="text-2xl font-bold text-accent">
            {completionRate}%
          </div>
          <div className="text-xs text-muted-foreground">
            Completion Rate
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Monthly Progress
          </span>
          <span className="text-sm text-muted-foreground">
            {completedGoals} of {totalGoals} goals
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-accent to-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <motion.div
            key={stat?.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat?.bgColor} rounded-lg p-4 text-center`}
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat?.bgColor} mb-2`}>
              <Icon 
                name={stat?.icon} 
                size={16} 
                className={stat?.color}
              />
            </div>
            <div className={`text-2xl font-bold ${stat?.color} mb-1`}>
              {stat?.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat?.label}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Motivational Message */}
      {totalGoals > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-3">
            <Icon name="Sparkles" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {completionRate >= 80 
                  ? "Outstanding progress! You're crushing your goals! 🌟"
                  : completionRate >= 50
                    ? "Great momentum! Keep pushing forward! 💪"
                    : completionRate >= 25
                      ? "Good start! Stay focused and consistent! 🎯" :"Every journey begins with a single step! 🚀"
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {overdueGoals > 0 
                  ? `${overdueGoals} goal${overdueGoals !== 1 ? 's' : ''} need${overdueGoals === 1 ? 's' : ''} your attention`
                  : "All goals are on track!"
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyProgress;