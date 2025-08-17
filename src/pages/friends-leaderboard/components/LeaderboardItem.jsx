import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const LeaderboardItem = ({ friend, position, isCurrentUser = false }) => {
  const getRankIcon = (pos) => {
    switch (pos) {
      case 1:
        return { icon: 'Crown', color: 'text-yellow-400' };
      case 2:
        return { icon: 'Medal', color: 'text-gray-400' };
      case 3:
        return { icon: 'Award', color: 'text-amber-600' };
      default:
        return null;
    }
  };

  const rankIcon = getRankIcon(position);
  const progressPercentage = Math.min((friend?.weeklyProgress / 1000) * 100, 100);

  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-lg transition-all duration-200
      ${isCurrentUser 
        ? 'bg-accent/10 border border-accent/20' :'hover:bg-muted/30'
      }
    `}>
      {/* Rank Position */}
      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
        {rankIcon ? (
          <Icon 
            name={rankIcon?.icon} 
            size={20} 
            className={rankIcon?.color}
          />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">
            {position}
          </span>
        )}
      </div>
      {/* Profile Picture */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={friend?.avatar}
          alt={`${friend?.name}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Friend Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-medium truncate ${
            isCurrentUser ? 'text-accent' : 'text-foreground'
          }`}>
            {friend?.name}
            {isCurrentUser && (
              <span className="text-xs text-muted-foreground ml-2">(You)</span>
            )}
          </h3>
          <span className="text-sm font-semibold text-foreground">
            {friend?.totalPoints?.toLocaleString()}
          </span>
        </div>

        {/* Weekly Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            +{friend?.weeklyProgress}
          </span>
        </div>
      </div>
      {/* Trend Indicator */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {friend?.trend === 'up' && (
          <Icon name="TrendingUp" size={16} className="text-success" />
        )}
        {friend?.trend === 'down' && (
          <Icon name="TrendingDown" size={16} className="text-error" />
        )}
        {friend?.trend === 'same' && (
          <Icon name="Minus" size={16} className="text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

export default LeaderboardItem;