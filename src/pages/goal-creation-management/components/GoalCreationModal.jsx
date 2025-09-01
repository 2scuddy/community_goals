import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GoalCreationModal = ({ isOpen, onClose, selectedCategory, onCreateGoal }) => {
  const [step, setStep] = useState(1);
  const [goalData, setGoalData] = useState({
    category: selectedCategory || '',
    framework: '',
    title: '',
    description: '',
    targetMetric: '',
    targetValue: '',
    priority: 'medium',
    deadline: '',
    dailyTasks: [''],
    weeklyMilestones: ['']
  });

  const frameworks = [
    { 
      value: 'smart', 
      label: 'SMART Goals',
      description: 'Specific, Measurable, Achievable, Relevant, Time-bound'
    },
    { 
      value: 'okr', 
      label: 'OKRs (Objectives & Key Results)',
      description: 'Ambitious objectives with measurable key results'
    },
    { 
      value: 'atomic', 
      label: 'Atomic Habits',
      description: 'Small, consistent habits that compound over time'
    },
    { 
      value: '90day', 
      label: '90-Day Sprints',
      description: 'Focused 90-day cycles for rapid progress'
    },
    { 
      value: 'process', 
      label: 'Process vs Outcome',
      description: 'Focus on systems and processes rather than outcomes'
    },
    { 
      value: 'milestone', 
      label: 'Milestone-Based',
      description: 'Break down goals into specific milestones'
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

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

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      status: 'active',
      progress: 0,
      streak: 0,
      createdDate: new Date()?.toLocaleDateString(),
      daysRemaining: Math.ceil((new Date(goalData.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
      isSharedToWall: false,
      dailyTasks: goalData?.dailyTasks?.filter(task => task?.trim())?.map(task => ({
        id: Date.now() + Math.random(),
        text: task,
        completed: false
      }))
    };
    
    onCreateGoal(newGoal);
    onClose();
    setStep(1);
    setGoalData({
      category: selectedCategory || '',
      framework: '',
      title: '',
      description: '',
      targetMetric: '',
      targetValue: '',
      priority: 'medium',
      deadline: '',
      dailyTasks: [''],
      weeklyMilestones: ['']
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-warm-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Create New Goal</h2>
            <p className="text-sm text-muted-foreground">Step {step} of 3</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-medium text-foreground mb-4">
                  Choose Your Goal Framework
                </h3>
                <div className="grid gap-3">
                  {frameworks?.map((framework) => (
                    <div
                      key={framework?.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        goalData?.framework === framework?.value
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleInputChange('framework', framework?.value)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          goalData?.framework === framework?.value
                            ? 'border-primary bg-primary' :'border-border'
                        }`}>
                          {goalData?.framework === framework?.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{framework?.label}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{framework?.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-medium text-foreground mb-4">
                  Goal Details
                </h3>
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
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-medium text-foreground mb-4">
                  Break It Down
                </h3>
                
                {/* Daily Tasks */}
                <div className="space-y-4">
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={step === 1 ? onClose : handleBack}
            disabled={step === 1}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="default"
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={
              (step === 1 && !goalData?.framework) ||
              (step === 2 && (!goalData?.title || !goalData?.deadline)) ||
              (step === 3 && goalData?.dailyTasks?.every(task => !task?.trim()))
            }
          >
            {step === 3 ? 'Create Goal' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalCreationModal;