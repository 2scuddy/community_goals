import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MatchNotification = ({ match, isVisible, onClose, onViewMatch }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !match) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:w-96">
      <div className="bg-card rounded-xl border border-border shadow-warm-lg p-4 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Heart" size={20} color="var(--color-success)" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-heading font-semibold text-foreground">
                It's a Match! 🎉
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                iconName="X"
                iconSize={16}
                className="w-6 h-6 -mt-1 -mr-1"
              />
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              You and <span className="font-medium text-foreground">{match?.groupName}</span> are interested in each other!
            </p>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Target" size={12} />
                <span>{match?.matchPercentage}% Match</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="Users" size={12} />
                <span>{match?.memberCount} members</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="xs"
                onClick={onClose}
                className="flex-1"
              >
                Later
              </Button>
              <Button
                variant="default"
                size="xs"
                onClick={() => {
                  onViewMatch(match?.groupId);
                  onClose();
                }}
                iconName="MessageCircle"
                iconPosition="left"
                iconSize={12}
                className="flex-1"
              >
                View Match
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchNotification;