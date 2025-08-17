import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AddGoalModal = ({ isOpen, onClose, onSave, editingGoal = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    deadline: '',
    isPrivate: false,
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'academic', label: 'Academic', description: 'Study goals and educational objectives' },
    { value: 'personal', label: 'Personal', description: 'Self-improvement and personal development' },
    { value: 'fitness', label: 'Fitness', description: 'Health and physical activity goals' },
    { value: 'career', label: 'Career', description: 'Professional development and skills' },
    { value: 'creative', label: 'Creative', description: 'Art, writing, and creative projects' },
    { value: 'other', label: 'Other', description: 'Miscellaneous goals' }
  ];

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal?.title,
        description: editingGoal?.description,
        category: editingGoal?.category,
        deadline: editingGoal?.deadline,
        isPrivate: editingGoal?.isPrivate,
        milestones: editingGoal?.milestones || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'academic',
        deadline: '',
        isPrivate: false,
        milestones: []
      });
    }
    setErrors({});
  }, [editingGoal, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addMilestone = () => {
    if (newMilestone?.trim()) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev?.milestones, {
          id: Date.now(),
          title: newMilestone?.trim(),
          completed: false
        }]
      }));
      setNewMilestone('');
    }
  };

  const removeMilestone = (milestoneId) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev?.milestones?.filter(m => m?.id !== milestoneId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Goal description is required';
    }

    if (!formData?.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const goalData = {
        ...formData,
        id: editingGoal?.id || Date.now(),
        progress: editingGoal?.progress || 0,
        createdAt: editingGoal?.createdAt || new Date()?.toISOString(),
        celebrated: editingGoal?.celebrated || false,
        friendInteractions: editingGoal?.friendInteractions || []
      };
      
      onSave(goalData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'academic',
      deadline: '',
      isPrivate: false,
      milestones: []
    });
    setNewMilestone('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingGoal ? "Edit Goal" : "Add New Goal"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Title */}
        <Input
          label="Goal Title"
          type="text"
          placeholder="Enter your goal title"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
        />

        {/* Goal Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={3}
            placeholder="Describe your goal in detail..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
          />
          {errors?.description && (
            <p className="mt-1 text-sm text-error">{errors?.description}</p>
          )}
        </div>

        {/* Category and Deadline Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            required
          />

          <Input
            label="Deadline"
            type="date"
            value={formData?.deadline}
            onChange={(e) => handleInputChange('deadline', e?.target?.value)}
            error={errors?.deadline}
            required
            min={new Date()?.toISOString()?.split('T')?.[0]}
          />
        </div>

        {/* Privacy Setting */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox
            checked={formData?.isPrivate}
            onChange={(e) => handleInputChange('isPrivate', e?.target?.checked)}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon name="Lock" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Keep this goal private
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Private goals won't be visible to your friends
            </p>
          </div>
        </div>

        {/* Milestones Section */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Milestones (Optional)
          </label>
          
          {/* Add Milestone Input */}
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Add a milestone..."
              value={newMilestone}
              onChange={(e) => setNewMilestone(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), addMilestone())}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addMilestone}
              disabled={!newMilestone?.trim()}
            >
              <Icon name="Plus" size={16} />
            </Button>
          </div>

          {/* Milestones List */}
          {formData?.milestones?.length > 0 && (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData?.milestones?.map((milestone) => (
                <motion.div
                  key={milestone?.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 p-2 bg-surface rounded-lg"
                >
                  <Icon name="Target" size={14} className="text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground flex-1">
                    {milestone?.title}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMilestone(milestone?.id)}
                    className="h-6 w-6 text-muted-foreground hover:text-error"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="flex-1"
          >
            {editingGoal ? "Update Goal" : "Create Goal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGoalModal;