import React from 'react';
import Icon from '../../../components/AppIcon';

const GroupHeader = ({ group }) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Users" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold text-foreground">
                {group?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {group?.memberCount} members • Season {group?.season}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth">
              <Icon name="MessageCircle" size={20} />
            </button>
            <button className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-smooth">
              <Icon name="Phone" size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Group Progress</span>
            <span className="text-sm text-muted-foreground">{group?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-500"
              style={{ width: `${group?.progress}%` }}
            />
          </div>
        </div>

        {/* Current Leader */}
        <div className="flex items-center space-x-2 p-3 bg-warning/10 rounded-lg">
          <Icon name="Crown" size={16} color="var(--color-warning)" />
          <span className="text-sm text-foreground">
            <span className="font-medium">{group?.currentLeader}</span> is leading this week
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;