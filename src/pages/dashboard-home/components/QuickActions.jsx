import React from 'react';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create Goal',
      icon: 'Plus',
      color: 'default',
      onClick: () => navigate('/goal-creation-management')
    },
    {
      label: 'Find Groups',
      icon: 'Search',
      color: 'outline',
      onClick: () => navigate('/group-discovery-matching')
    },
    {
      label: 'Join Challenge',
      icon: 'Zap',
      color: 'secondary',
      onClick: () => navigate('/group-discovery-matching')
    }
  ];

  return (
    <div className="bg-card rounded-lg p-4 border border-border shadow-warm mb-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.color}
            size="sm"
            fullWidth
            onClick={action?.onClick}
            iconName={action?.icon}
            iconPosition="left"
            iconSize={16}
            className="justify-start"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;