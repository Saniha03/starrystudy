import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'study_session':
        return { icon: 'Clock', color: 'text-accent' };
      case 'goal_achieved':
        return { icon: 'Target', color: 'text-warning' };
      case 'milestone':
        return { icon: 'Star', color: 'text-accent' };
      default:
        return { icon: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Recent Activity
      </h3>
      {activities?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No recent activity from friends
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities?.map((activity) => {
            const activityIcon = getActivityIcon(activity?.type);
            
            return (
              <div key={activity?.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                {/* Friend Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={activity?.user?.avatar}
                    alt={`${activity?.user?.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <Icon 
                      name={activityIcon?.icon} 
                      size={16} 
                      className={`${activityIcon?.color} mt-0.5 flex-shrink-0`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity?.user?.name}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity?.description}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity?.timestamp)}
                        </span>
                        {activity?.points && (
                          <span className="text-xs text-accent font-medium">
                            +{activity?.points} pts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;