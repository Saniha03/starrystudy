import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      id: 'todayHours',
      label: 'Today',
      value: `${stats?.todayHours}h`,
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 'weekHours',
      label: 'This Week',
      value: `${stats?.weekHours}h`,
      icon: 'Calendar',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      id: 'monthTasks',
      label: 'Month Tasks',
      value: stats?.monthTasks,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'activeGoals',
      label: 'Active Goals',
      value: stats?.activeGoals,
      icon: 'Target',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      name: 'Study Warrior',
      description: 'Completed 100 tasks',
      icon: 'Award',
      unlockedDate: '2025-08-15'
    },
    {
      id: 2,
      name: 'Time Master',
      description: 'Logged 50 hours this month',
      icon: 'Clock',
      unlockedDate: '2025-08-12'
    },
    {
      id: 3,
      name: 'Goal Crusher',
      description: 'Achieved 5 monthly goals',
      icon: 'Target',
      unlockedDate: '2025-08-10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="morphic-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
        <div className="space-y-3">
          {statItems?.map((stat) => (
            <div key={stat?.id} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                  <Icon name={stat?.icon} size={16} className={stat?.color} />
                </div>
                <span className="text-sm text-muted-foreground">{stat?.label}</span>
              </div>
              <span className="font-semibold text-foreground">{stat?.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="morphic-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {recentAchievements?.map((achievement) => (
            <div key={achievement?.id} className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg">
              <div className="p-2 rounded-lg bg-accent/10">
                <Icon name={achievement?.icon} size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {achievement?.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {achievement?.description}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(achievement.unlockedDate)?.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Study Streak */}
      <div className="morphic-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Study Streak</h3>
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-3">
              <Icon name="Flame" size={32} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full">
              {stats?.currentStreak}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Current streak: {stats?.currentStreak} days
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Best: {stats?.bestStreak} days
          </p>
        </div>
      </div>
      {/* Progress Ring */}
      <div className="morphic-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Today's Progress</h3>
        <div className="text-center">
          <div className="relative inline-block">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F472B6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${stats?.todayProgress * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{stats?.todayProgress}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Daily goal progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;