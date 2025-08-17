import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ManualTimeEntry = ({ onManualSubmit, isSubmitting = false }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    
    if (totalMinutes <= 0) {
      return;
    }

    onManualSubmit({
      duration: totalMinutes * 60, // Convert to seconds
      notes: notes?.trim(),
      category: category?.trim(),
      timestamp: new Date()?.toISOString()
    });

    // Reset form
    setHours('');
    setMinutes('');
    setNotes('');
    setCategory('');
    setIsExpanded(false);
  };

  const isValid = (parseInt(hours) || 0) > 0 || (parseInt(minutes) || 0) > 0;

  return (
    <div className="morphic-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="manual-time-form"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Clock" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">
              Manual Time Entry
            </h3>
            <p className="text-sm text-muted-foreground">
              Log completed study sessions
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
        </motion.div>
      </button>
      <motion.div
        id="manual-time-form"
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hours"
              type="number"
              placeholder="0"
              value={hours}
              onChange={(e) => setHours(e?.target?.value)}
              min="0"
              max="12"
            />
            <Input
              label="Minutes"
              type="number"
              placeholder="0"
              value={minutes}
              onChange={(e) => setMinutes(e?.target?.value)}
              min="0"
              max="59"
            />
          </div>

          <Input
            label="Category"
            type="text"
            placeholder="e.g., Mathematics, Programming..."
            value={category}
            onChange={(e) => setCategory(e?.target?.value)}
          />

          <Input
            label="Notes"
            type="text"
            placeholder="What did you study? Any achievements or reflections..."
            value={notes}
            onChange={(e) => setNotes(e?.target?.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="default"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
              className="flex-1"
            >
              Log Study Time
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ManualTimeEntry;