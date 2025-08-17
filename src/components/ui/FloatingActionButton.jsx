import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const FloatingActionButton = ({ onClick }) => {
  const location = useLocation();

  const getActionConfig = () => {
    switch (location?.pathname) {
      case '/daily-tasks':
        return {
          label: 'Add Task',
          icon: 'Plus',
          show: true
        };
      case '/monthly-goals':
        return {
          label: 'Add Goal',
          icon: 'Target',
          show: true
        };
      default:
        return {
          show: false
        };
    }
  };

  const actionConfig = getActionConfig();

  if (!actionConfig?.show) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-150">
      <Button
        variant="default"
        size="lg"
        onClick={onClick}
        className="floating-action bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-14 w-14 p-0 shadow-medium"
        aria-label={actionConfig?.label}
      >
        <Icon name={actionConfig?.icon} size={24} strokeWidth={2.5} />
      </Button>
    </div>
  );
};

export default FloatingActionButton;