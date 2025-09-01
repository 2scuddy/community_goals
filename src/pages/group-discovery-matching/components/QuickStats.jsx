import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Available Groups',
      value: stats?.totalGroups,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Your Matches',
      value: stats?.totalMatches,
      icon: 'Heart',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Success Rate',
      value: `${stats?.successRate}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Avg Match Score',
      value: `${stats?.averageMatch}%`,
      icon: 'Target',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-warm transition-shadow"
        >
          <div className={`w-12 h-12 ${item?.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <Icon name={item?.icon} size={20} color={`var(--color-${item?.color?.replace('text-', '')})`} />
          </div>
          <div className="text-lg font-heading font-semibold text-foreground mb-1">
            {item?.value}
          </div>
          <div className="text-xs text-muted-foreground">
            {item?.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;