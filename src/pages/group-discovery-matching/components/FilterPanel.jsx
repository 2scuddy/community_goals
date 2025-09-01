import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange, onApplyFilters, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const goalCategories = [
    'Fitness & Health',
    'Business & Career',
    'Relationships',
    'Personal Development',
    'Financial'
  ];

  const meetingFrequencies = [
    'Daily',
    'Every 2 days',
    'Weekly',
    'Bi-weekly'
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    const updatedCategories = localFilters?.categories?.includes(category)
      ? localFilters?.categories?.filter(c => c !== category)
      : [...localFilters?.categories, category];
    
    handleFilterChange('categories', updatedCategories);
  };

  const handleFrequencyToggle = (frequency) => {
    const updatedFrequencies = localFilters?.meetingFrequencies?.includes(frequency)
      ? localFilters?.meetingFrequencies?.filter(f => f !== frequency)
      : [...localFilters?.meetingFrequencies, frequency];
    
    handleFilterChange('meetingFrequencies', updatedFrequencies);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      categories: [],
      ageRange: [18, 65],
      locationRadius: 50,
      groupSize: [3, 10],
      meetingFrequencies: [],
      seasonProgress: [0, 100]
    };
    setLocalFilters(resetFilters);
    onResetFilters();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      {/* Filter Panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-warm-lg z-50 max-h-[80vh] overflow-y-auto
        lg:static lg:w-80 lg:rounded-2xl lg:shadow-warm lg:max-h-none lg:overflow-visible
        transform transition-transform duration-300
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 rounded-t-2xl lg:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Filter Groups
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              iconSize={20}
              className="lg:hidden"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Goal Categories */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Goal Categories</h4>
            <div className="space-y-2">
              {goalCategories?.map((category) => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={localFilters?.categories?.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Age Range</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Age"
                type="number"
                value={localFilters?.ageRange?.[0]}
                onChange={(e) => handleFilterChange('ageRange', [parseInt(e?.target?.value), localFilters?.ageRange?.[1]])}
                min="18"
                max="100"
              />
              <Input
                label="Max Age"
                type="number"
                value={localFilters?.ageRange?.[1]}
                onChange={(e) => handleFilterChange('ageRange', [localFilters?.ageRange?.[0], parseInt(e?.target?.value)])}
                min="18"
                max="100"
              />
            </div>
          </div>

          {/* Location Radius */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Location Radius: {localFilters?.locationRadius} miles
            </h4>
            <input
              type="range"
              min="5"
              max="500"
              value={localFilters?.locationRadius}
              onChange={(e) => handleFilterChange('locationRadius', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5 miles</span>
              <span>500+ miles</span>
            </div>
          </div>

          {/* Group Size */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Group Size</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Size"
                type="number"
                value={localFilters?.groupSize?.[0]}
                onChange={(e) => handleFilterChange('groupSize', [parseInt(e?.target?.value), localFilters?.groupSize?.[1]])}
                min="3"
                max="10"
              />
              <Input
                label="Max Size"
                type="number"
                value={localFilters?.groupSize?.[1]}
                onChange={(e) => handleFilterChange('groupSize', [localFilters?.groupSize?.[0], parseInt(e?.target?.value)])}
                min="3"
                max="10"
              />
            </div>
          </div>

          {/* Meeting Frequency */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Meeting Frequency</h4>
            <div className="space-y-2">
              {meetingFrequencies?.map((frequency) => (
                <Checkbox
                  key={frequency}
                  label={frequency}
                  checked={localFilters?.meetingFrequencies?.includes(frequency)}
                  onChange={() => handleFrequencyToggle(frequency)}
                />
              ))}
            </div>
          </div>

          {/* Season Progress */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Season Progress: {localFilters?.seasonProgress?.[0]}% - {localFilters?.seasonProgress?.[1]}%
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Min Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localFilters?.seasonProgress?.[0]}
                  onChange={(e) => handleFilterChange('seasonProgress', [parseInt(e?.target?.value), localFilters?.seasonProgress?.[1]])}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Max Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localFilters?.seasonProgress?.[1]}
                  onChange={(e) => handleFilterChange('seasonProgress', [localFilters?.seasonProgress?.[0], parseInt(e?.target?.value)])}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 rounded-b-2xl lg:rounded-b-2xl">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              variant="default"
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;