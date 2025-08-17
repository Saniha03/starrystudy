import React from 'react';
import Button from '../../../components/ui/Button';


const TaskFilters = ({ 
  activeFilter, 
  onFilterChange, 
  activeSortBy, 
  onSortChange,
  taskCounts 
}) => {
  const filters = [
    { id: 'all', label: 'All', count: taskCounts?.all },
    { id: 'pending', label: 'Pending', count: taskCounts?.pending },
    { id: 'completed', label: 'Completed', count: taskCounts?.completed }
  ];

  const sortOptions = [
    { id: 'priority', label: 'Priority', icon: 'ArrowUp' },
    { id: 'category', label: 'Category', icon: 'Tag' },
    { id: 'created', label: 'Created', icon: 'Calendar' }
  ];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filters?.map((filter) => (
          <Button
            key={filter?.id}
            variant={activeFilter === filter?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter?.id)}
            className="flex-shrink-0"
          >
            {filter?.label}
            {filter?.count > 0 && (
              <span className={`
                ml-2 px-1.5 py-0.5 rounded-full text-xs
                ${activeFilter === filter?.id 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {filter?.count}
              </span>
            )}
          </Button>
        ))}
      </div>
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <div className="flex items-center gap-1">
          {sortOptions?.map((option) => (
            <Button
              key={option?.id}
              variant={activeSortBy === option?.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onSortChange(option?.id)}
              iconName={option?.icon}
              iconSize={14}
              className="text-xs"
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;