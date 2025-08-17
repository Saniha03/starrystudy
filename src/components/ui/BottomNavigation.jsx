import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationTabs = [
    {
      id: 'today',
      label: 'Today',
      icon: 'Calendar',
      paths: ['/daily-tasks', '/study-timer'],
      defaultPath: '/daily-tasks'
    },
    {
      id: 'social',
      label: 'Social',
      icon: 'Users',
      paths: ['/friends-leaderboard'],
      defaultPath: '/friends-leaderboard'
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: 'Target',
      paths: ['/monthly-goals', '/user-profile'],
      defaultPath: '/monthly-goals'
    }
  ];

  const getActiveTab = () => {
    const currentPath = location?.pathname;
    return navigationTabs?.find(tab => 
      tab?.paths?.includes(currentPath)
    )?.id || 'today';
  };

  const handleTabPress = (tab) => {
    const currentPath = location?.pathname;
    
    // If already in this tab's section, don't navigate
    if (tab?.paths?.includes(currentPath)) {
      return;
    }
    
    navigate(tab?.defaultPath);
  };

  const activeTab = getActiveTab();

  // Don't show navigation on login screen
  if (location?.pathname === '/login-screen') {
    return null;
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-100"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-4 max-w-md mx-auto">
        {navigationTabs?.map((tab) => {
          const isActive = activeTab === tab?.id;
          
          return (
            <button
              key={tab?.id}
              onClick={() => handleTabPress(tab)}
              className={`
                flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1
                transition-all duration-200 ease-in-out
                ${isActive 
                  ? 'text-accent' :'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-label={`Navigate to ${tab?.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`
                p-1 rounded-lg transition-all duration-200
                ${isActive ? 'bg-accent/10 scale-110' : 'hover:bg-muted/50'}
              `}>
                <Icon 
                  name={tab?.icon} 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`
                text-xs font-medium mt-1 transition-all duration-200
                ${isActive ? 'text-accent' : 'text-muted-foreground'}
              `}>
                {tab?.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div className="constellation-dot active mt-1" />
              )}
            </button>
          );
        })}
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-surface" />
    </nav>
  );
};

export default BottomNavigation;