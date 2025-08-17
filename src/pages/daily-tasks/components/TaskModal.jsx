import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const TaskModal = ({ isOpen, onClose, onSave, editingTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Study',
    priority: 'medium',
    timeEstimate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask?.title,
        category: editingTask?.category,
        priority: editingTask?.priority,
        timeEstimate: editingTask?.timeEstimate || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Study',
        priority: 'medium',
        timeEstimate: ''
      });
    }
    setErrors({});
  }, [editingTask, isOpen]);

  const categoryOptions = [
    { value: 'Study', label: 'Study' },
    { value: 'Work', label: 'Work' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Health', label: 'Health' },
    { value: 'Other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData?.timeEstimate && (isNaN(formData?.timeEstimate) || formData?.timeEstimate < 1)) {
      newErrors.timeEstimate = 'Time estimate must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      timeEstimate: formData?.timeEstimate ? parseInt(formData?.timeEstimate) : null,
      id: editingTask?.id || Date.now(),
      completed: editingTask?.completed || false,
      createdAt: editingTask?.createdAt || new Date(),
      points: editingTask?.points || Math.floor(Math.random() * 20) + 10
    };

    onSave(taskData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : 'Create New Task'}
      size="default"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          type="text"
          placeholder="Enter task description..."
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={formData?.category}
          onChange={(value) => handleInputChange('category', value)}
        />

        <Select
          label="Priority Level"
          options={priorityOptions}
          value={formData?.priority}
          onChange={(value) => handleInputChange('priority', value)}
        />

        <Input
          label="Time Estimate (minutes)"
          type="number"
          placeholder="Optional time estimate..."
          value={formData?.timeEstimate}
          onChange={(e) => handleInputChange('timeEstimate', e?.target?.value)}
          error={errors?.timeEstimate}
          min="1"
          max="480"
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            fullWidth
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;