import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SessionNotes = ({ notes, onNotesChange, category, onCategoryChange }) => {
  const categoryOptions = [
    { value: '', label: 'Select category (optional)' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'languages', label: 'Languages' },
    { value: 'programming', label: 'Programming' },
    { value: 'research', label: 'Research' },
    { value: 'exam-prep', label: 'Exam Preparation' },
    { value: 'project-work', label: 'Project Work' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="morphic-card mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Icon name="FileText" size={20} className="text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Session Details
        </h3>
      </div>
      <div className="space-y-4">
        <Input
          label="Study Category"
          type="text"
          placeholder="e.g., Mathematics, Programming, Literature..."
          value={category}
          onChange={(e) => onCategoryChange(e?.target?.value)}
          description="Categorize your study session for better analytics"
        />

        <Input
          label="Session Notes"
          type="text"
          placeholder="What are you studying? Any specific goals or reflections..."
          value={notes}
          onChange={(e) => onNotesChange(e?.target?.value)}
          description="Optional notes about your study session"
        />
      </div>
    </div>
  );
};

export default SessionNotes;