import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterSortBar = ({ onFilterChange, onSortChange, totalGoals, activeGoals }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    framework: 'all',
    category: 'all'
  });
  const [sortBy, setSortBy] = useState('created');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const frameworkOptions = [
    { value: 'all', label: 'All Frameworks' },
    { value: 'smart', label: 'SMART Goals' },
    { value: 'okr', label: 'OKRs' },
    { value: 'atomic', label: 'Atomic Habits' },
    { value: '90day', label: '90-Day Sprints' },
    { value: 'process', label: 'Process vs Outcome' },
    { value: 'milestone', label: 'Milestone-Based' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Fitness/Health', label: 'Fitness/Health' },
    { value: 'Business/Career', label: 'Business/Career' },
    { value: 'Relationships', label: 'Relationships' },
    { value: 'Personal Development', label: 'Personal Development' },
    { value: 'Financial', label: 'Financial' }
  ];

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'progress', label: 'Progress' },
    { value: 'priority', label: 'Priority' },
    { value: 'streak', label: 'Streak' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      priority: 'all',
      framework: 'all',
      category: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== 'all');

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      {/* Top Row - Stats and Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{activeGoals}</span> active of{' '}
            <span className="font-medium text-foreground">{totalGoals}</span> total goals
          </div>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-primary font-medium">Filters applied</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isFilterOpen ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            iconName="Filter"
            iconSize={16}
          >
            Filter
          </Button>
          
          <div className="w-px h-6 bg-border"></div>
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={handleSortChange}
            placeholder="Sort by"
            className="min-w-[140px]"
          />
        </div>
      </div>
      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />

            <Select
              label="Priority"
              options={priorityOptions}
              value={filters?.priority}
              onChange={(value) => handleFilterChange('priority', value)}
            />

            <Select
              label="Framework"
              options={frameworkOptions}
              value={filters?.framework}
              onChange={(value) => handleFilterChange('framework', value)}
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange('category', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Use filters to narrow down your goals and find what you're looking for
            </div>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                iconName="X"
                iconSize={14}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSortBar;