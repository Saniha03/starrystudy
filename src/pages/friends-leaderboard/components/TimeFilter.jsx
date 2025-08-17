import React from 'react';
import Button from '../../../components/ui/Button';

const TimeFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'daily', label: 'Daily', icon: 'Calendar' },
    { id: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
    { id: 'monthly', label: 'Monthly', icon: 'CalendarRange' }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1">
      {filters?.map((filter) => (
        <Button
          key={filter?.id}
          variant={activeFilter === filter?.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange(filter?.id)}
          className={`flex-1 ${
            activeFilter === filter?.id 
              ? 'bg-accent text-accent-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {filter?.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeFilter;