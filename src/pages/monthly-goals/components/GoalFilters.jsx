import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const GoalFilters = ({ 
  activeFilter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  searchQuery,
  onSearchChange 
}) => {
  const filterOptions = [
    { id: 'all', label: 'All Goals', icon: 'Target' },
    { id: 'active', label: 'Active', icon: 'Play' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { id: 'overdue', label: 'Overdue', icon: 'AlertTriangle' },
    { id: 'urgent', label: 'Due Soon', icon: 'Clock' }
  ];

  const sortOptions = [
    { value: 'deadline', label: 'Deadline' },
    { value: 'progress', label: 'Progress' },
    { value: 'created', label: 'Date Created' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
        />
        <input
          type="text"
          placeholder="Search goals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>
      {/* Filter Tabs and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((filter) => (
            <motion.button
              key={filter?.id}
              onClick={() => onFilterChange(filter?.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${activeFilter === filter?.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon 
                name={filter?.icon} 
                size={16} 
                className={activeFilter === filter?.id ? 'text-accent-foreground' : 'text-current'}
              />
              {filter?.label}
            </motion.button>
          ))}
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by"
            className="w-32"
          />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8"
              aria-label="Grid view"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
              className="h-8 w-8"
              aria-label="List view"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalFilters;