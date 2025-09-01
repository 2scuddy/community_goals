import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GoalEditModal = ({ isOpen, onClose, goal, onUpdateGoal }) => {
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    targetMetric: '',
    targetValue: '',
    priority: 'medium',
    deadline: '',
    dailyTasks: [''],
    weeklyMilestones: ['']
  });

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  useEffect(() => {
    if (goal) {
      setGoalData({
        title: goal?.title || '',
        description: goal?.description || '',
        targetMetric: goal?.targetMetric || '',
        targetValue: goal?.targetValue || '',
        priority: goal?.priority || 'medium',
        deadline: goal?.deadline || '',
        dailyTasks: goal?.dailyTasks?.map(task => task?.text) || [''],
        weeklyMilestones: goal?.weeklyMilestones || ['']
      });
    }
  }, [goal]);

  const handleInputChange = (field, value) => {
    setGoalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setGoalData(prev => ({
      ...prev,
      [field]: prev?.[field]?.map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setGoalData(prev => ({
      ...prev,
      [field]: [...prev?.[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setGoalData(prev => ({
      ...prev,
      [field]: prev?.[field]?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const updatedGoal = {
      ...goal,
      ...goalData,
      daysRemaining: Math.ceil((new Date(goalData.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
      dailyTasks: goalData?.dailyTasks?.filter(task => task?.trim())?.map((task, index) => ({
        id: goal?.dailyTasks?.[index]?.id || Date.now() + Math.random(),
        text: task,
        completed: goal?.dailyTasks?.[index]?.completed || false
      }))
    };
    
    onUpdateGoal(updatedGoal);
    onClose();
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-warm-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Edit Goal</h2>
            <p className="text-sm text-muted-foreground">Update your goal details</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Input
              label="Goal Title"
              type="text"
              placeholder="Enter a clear, specific goal title"
              value={goalData?.title}
              onChange={(e) => handleInputChange('title', e?.target?.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Goal Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={3}
                placeholder="Describe your goal in detail..."
                value={goalData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Target Metric"
                type="text"
                placeholder="e.g., Weight, Revenue, Books"
                value={goalData?.targetMetric}
                onChange={(e) => handleInputChange('targetMetric', e?.target?.value)}
              />

              <Input
                label="Target Value"
                type="text"
                placeholder="e.g., 70kg, $10,000, 12 books"
                value={goalData?.targetValue}
                onChange={(e) => handleInputChange('targetValue', e?.target?.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Priority Level"
                options={priorityOptions}
                value={goalData?.priority}
                onChange={(value) => handleInputChange('priority', value)}
              />

              <Input
                label="Target Deadline"
                type="date"
                value={goalData?.deadline}
                onChange={(e) => handleInputChange('deadline', e?.target?.value)}
                required
              />
            </div>

            {/* Daily Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Daily Tasks</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('dailyTasks')}
                  iconName="Plus"
                  iconSize={14}
                >
                  Add Task
                </Button>
              </div>
              <div className="space-y-2">
                {goalData?.dailyTasks?.map((task, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder={`Daily task ${index + 1}`}
                      value={task}
                      onChange={(e) => handleArrayChange('dailyTasks', index, e?.target?.value)}
                      className="flex-1"
                    />
                    {goalData?.dailyTasks?.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('dailyTasks', index)}
                        iconName="Trash2"
                        iconSize={14}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Milestones */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Weekly Milestones</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addArrayItem('weeklyMilestones')}
                  iconName="Plus"
                  iconSize={14}
                >
                  Add Milestone
                </Button>
              </div>
              <div className="space-y-2">
                {goalData?.weeklyMilestones?.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder={`Weekly milestone ${index + 1}`}
                      value={milestone}
                      onChange={(e) => handleArrayChange('weeklyMilestones', index, e?.target?.value)}
                      className="flex-1"
                    />
                    {goalData?.weeklyMilestones?.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem('weeklyMilestones', index)}
                        iconName="Trash2"
                        iconSize={14}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!goalData?.title || !goalData?.deadline}
          >
            Update Goal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalEditModal;