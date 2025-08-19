import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const LeaderboardItem = ({ friend, position, isCurrentUser = false, currentUser }) => {
  if (!friend) return null; // safely handle missing data

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

  const weeklyProgress = Number(friend.weeklyProgress) || 0;
  const totalPoints = Number(friend.totalPoints) || 0;
  const progressPercentage = Math.min((weeklyProgress / 1000) * 100, 100);

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg transition-all duration-200
        ${
          isCurrentUser
            ? 'bg-blue-50 border border-blue-200'
            : 'hover:bg-gray-50'
        }
      `}
    >
      {/* Rank Position */}
      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
        {rankIcon ? (
          <Icon
            name={rankIcon.icon}
            size={20}
            className={rankIcon.color}
          />
        ) : (
          <span className="text-lg font-bold text-gray-600">
            {position}
          </span>
        )}
      </div>

      {/* Profile Picture */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        {friend.avatar ? (
          <Image
            src={friend.avatar}
            alt={`${friend.name || 'User'}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <Icon name="User" size={20} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* Friend Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-medium truncate ${
              isCurrentUser ? 'text-blue-700' : 'text-gray-900'
            }`}
          >
            {friend.name || friend.full_name || friend.email || 'Unknown User'}
            {isCurrentUser && (
              <span className="text-xs text-gray-500 ml-2">
                (You)
              </span>
            )}
          </h3>
          <span className="text-sm font-semibold text-gray-900">
            {totalPoints.toLocaleString()}
          </span>
        </div>

        {/* Weekly Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            +{weeklyProgress}
          </span>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {friend.trend === 'up' && (
          <Icon name="TrendingUp" size={16} className="text-green-500" />
        )}
        {friend.trend === 'down' && (
          <Icon name="TrendingDown" size={16} className="text-red-500" />
        )}
        {friend.trend === 'same' && (
          <Icon name="Minus" size={16} className="text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default LeaderboardItem;
