import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FriendActivity = ({ activities }) => {
  if (!activities || activities?.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No recent friend activity</p>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return 'CheckCircle';
      case 'goal_created':
        return 'Target';
      case 'study_session':
        return 'Clock';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_completed':
        return 'text-success';
      case 'goal_created':
        return 'text-accent';
      case 'study_session':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground mb-4">Friend Activity</h3>
      {activities?.map((activity, index) => (
        <motion.div
          key={activity?.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
        >
          {/* Friend Avatar */}
          <div className="flex-shrink-0">
            <Image
              src={activity?.user?.avatar}
              alt={activity?.user?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity?.user?.name}</span>
                  <span className="text-muted-foreground ml-1">{activity?.message}</span>
                </p>
                
                {activity?.taskTitle && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    "{activity?.taskTitle}"
                  </p>
                )}
              </div>

              {/* Activity Icon and Time */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={14} 
                  className={getActivityColor(activity?.type)}
                />
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>
            </div>

            {/* Points Earned */}
            {activity?.pointsEarned && (
              <div className="flex items-center gap-1 mt-1">
                <Icon name="Star" size={12} className="text-accent fill-current" />
                <span className="text-xs text-accent font-medium">
                  +{activity?.pointsEarned} points
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FriendActivity;