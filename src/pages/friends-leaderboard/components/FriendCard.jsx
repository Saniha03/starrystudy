import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FriendCard = ({ friend, onViewProgress, onSendEncouragement }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'studying':
        return 'bg-accent';
      case 'away':
        return 'bg-warning';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'studying':
        return 'Studying';
      case 'away':
        return 'Away';
      default:
        return 'Offline';
    }
  };

  return (
    <div className="morphic-card p-4 hover:shadow-medium transition-all duration-200">
      <div className="flex items-start gap-3">
        {/* Profile Picture with Status */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={friend?.avatar}
              alt={`${friend?.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div 
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(friend?.status)}`}
            title={getStatusText(friend?.status)}
          />
        </div>

        {/* Friend Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground truncate">
              {friend?.name}
            </h3>
            <span className="text-sm text-accent font-medium">
              {friend?.totalPoints?.toLocaleString()} pts
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            {getStatusText(friend?.status)}
          </p>

          {/* Recent Activity */}
          <div className="text-xs text-muted-foreground mb-3">
            <Icon name="Clock" size={12} className="inline mr-1" />
            {friend?.lastActivity}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProgress(friend)}
              className="flex-1"
            >
              <Icon name="TrendingUp" size={14} className="mr-1" />
              Progress
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendEncouragement(friend)}
              className="px-3"
            >
              <Icon name="Heart" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;