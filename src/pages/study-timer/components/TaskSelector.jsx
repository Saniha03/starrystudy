import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TaskSelector = ({ selectedTask, onTaskChange, tasks = [] }) => {
  const taskOptions = [
    { value: '', label: 'Select a task (optional)', disabled: true },
    ...tasks?.map(task => ({
      value: task?.id,
      label: task?.title,
      description: task?.category ? `Category: ${task?.category}` : undefined
    }))
  ];

  return (
    <div className="morphic-card mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Icon name="Target" size={20} className="text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Associate with Task
        </h3>
      </div>
      <Select
        label="Current Task"
        description="Link this study session to a specific task for better tracking"
        options={taskOptions}
        value={selectedTask}
        onChange={onTaskChange}
        placeholder="Choose a task..."
        searchable={tasks?.length > 5}
        clearable
        className="mb-0"
      />
      {selectedTask && (
        <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">
              Session will be linked to selected task
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSelector;