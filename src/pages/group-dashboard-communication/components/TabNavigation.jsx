import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'checkins', label: 'Check-ins', icon: 'CheckCircle' },
    { id: 'challenges', label: 'Challenges', icon: 'Trophy' },
    { id: 'meetups', label: 'Meetups', icon: 'Calendar' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 whitespace-nowrap border-b-2 transition-smooth
              ${activeTab === tab?.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon 
              name={tab?.icon} 
              size={18} 
              color={activeTab === tab?.id ? 'var(--color-primary)' : 'currentColor'} 
            />
            <span className="text-sm font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;