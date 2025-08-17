import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const getBadgeIcon = (type) => {
    const iconMap = {
      streak: 'Flame',
      tasks: 'CheckCircle',
      hours: 'Clock',
      goals: 'Target',
      social: 'Users',
      milestone: 'Award'
    };
    return iconMap?.[type] || 'Star';
  };

  const getBadgeColor = (rarity) => {
    const colorMap = {
      common: 'text-muted-foreground bg-muted/20',
      rare: 'text-secondary bg-secondary/20',
      epic: 'text-accent bg-accent/20',
      legendary: 'text-warning bg-warning/20'
    };
    return colorMap?.[rarity] || 'text-muted-foreground bg-muted/20';
  };

  return (
    <div className="morphic-card mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
        <div className="text-sm text-muted-foreground">
          {achievements?.filter(a => a?.unlocked)?.length} / {achievements?.length} unlocked
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements?.map((achievement) => (
          <div
            key={achievement?.id}
            onClick={() => setSelectedAchievement(achievement)}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${achievement?.unlocked 
                ? 'border-accent/30 bg-accent/5 hover:border-accent/50' :'border-muted/30 bg-muted/5 hover:border-muted/50'
              }
            `}
          >
            {/* Badge Icon */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3
              ${achievement?.unlocked 
                ? getBadgeColor(achievement?.rarity)
                : 'text-muted-foreground bg-muted/20'
              }
            `}>
              <Icon 
                name={getBadgeIcon(achievement?.type)} 
                size={24} 
                className={achievement?.unlocked ? '' : 'opacity-50'}
              />
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h3 className={`
                text-sm font-medium mb-1
                ${achievement?.unlocked ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {achievement?.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {achievement?.description}
              </p>
            </div>

            {/* Progress Bar for Incomplete */}
            {!achievement?.unlocked && achievement?.progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-muted/30 rounded-full h-1.5">
                  <div 
                    className="bg-accent h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(achievement?.progress / achievement?.target) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center">
                  {achievement?.progress} / {achievement?.target}
                </div>
              </div>
            )}

            {/* Unlock Date */}
            {achievement?.unlocked && achievement?.unlockedDate && (
              <div className="text-xs text-muted-foreground mt-2 text-center">
                Unlocked {new Date(achievement.unlockedDate)?.toLocaleDateString()}
              </div>
            )}

            {/* Rarity Indicator */}
            {achievement?.unlocked && (
              <div className={`
                absolute top-2 right-2 w-2 h-2 rounded-full
                ${achievement?.rarity === 'legendary' ? 'bg-warning' :
                  achievement?.rarity === 'epic' ? 'bg-accent' :
                  achievement?.rarity === 'rare' ? 'bg-secondary' : 'bg-muted-foreground'
                }
              `} />
            )}

            {/* New Badge Indicator */}
            {achievement?.isNew && (
              <div className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs px-1.5 py-0.5 rounded-full">
                New
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div 
            className="morphic-card max-w-md w-full slide-in"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="text-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                ${selectedAchievement?.unlocked 
                  ? getBadgeColor(selectedAchievement?.rarity)
                  : 'text-muted-foreground bg-muted/20'
                }
              `}>
                <Icon 
                  name={getBadgeIcon(selectedAchievement?.type)} 
                  size={32} 
                  className={selectedAchievement?.unlocked ? '' : 'opacity-50'}
                />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {selectedAchievement?.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedAchievement?.description}
              </p>

              {selectedAchievement?.unlocked ? (
                <div className="text-success text-sm">
                  <Icon name="CheckCircle" size={16} className="inline mr-1" />
                  Unlocked on {new Date(selectedAchievement.unlockedDate)?.toLocaleDateString()}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Progress: {selectedAchievement?.progress} / {selectedAchievement?.target}
                </div>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="mt-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;