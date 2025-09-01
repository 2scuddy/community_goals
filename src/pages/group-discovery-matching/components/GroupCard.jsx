import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GroupCard = ({ group, onSwipeRight, onSwipeLeft, onViewDetails, isDesktop = false }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 60) return 'text-warning';
    return 'text-accent';
  };

  const getProgressBg = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-accent';
  };

  const handleSwipeRight = () => {
    onSwipeRight(group?.id);
  };

  const handleSwipeLeft = () => {
    onSwipeLeft(group?.id);
  };

  return (
    <div className="bg-card rounded-2xl shadow-warm-lg border border-border overflow-hidden">
      {/* Header Image */}
      <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-medium text-foreground">
              {group?.focusAreas?.[0]}
            </span>
          </div>
          {group?.isNew && (
            <div className="bg-accent text-accent-foreground rounded-full px-2 py-1">
              <span className="text-xs font-medium">NEW</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
            <Icon name="Users" size={16} color="var(--color-primary)" />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {/* Group Name & Match Score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              {group?.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Icon name="Target" size={14} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">
                  {group?.matchPercentage}% Match
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {group?.location}
              </span>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {group?.focusAreas?.slice(0, 3)?.map((area, index) => (
              <span
                key={index}
                className="bg-muted text-muted-foreground px-2 py-1 rounded-lg text-xs font-medium"
              >
                {area}
              </span>
            ))}
            {group?.focusAreas?.length > 3 && (
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-lg text-xs font-medium">
                +{group?.focusAreas?.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-foreground">
              {group?.memberCount}/{group?.maxMembers}
            </div>
            <div className="text-xs text-muted-foreground">Members</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-foreground">
              {group?.averageAge}
            </div>
            <div className="text-xs text-muted-foreground">Avg Age</div>
          </div>
        </div>

        {/* Season Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Season Progress</span>
            <span className={`text-sm font-medium ${getProgressColor(group?.seasonProgress)}`}>
              {group?.seasonProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBg(group?.seasonProgress)}`}
              style={{ width: `${group?.seasonProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              Day {group?.currentDay} of 90
            </span>
            <span className="text-xs text-muted-foreground">
              {group?.daysRemaining} days left
            </span>
          </div>
        </div>

        {/* Meeting Info */}
        <div className="flex items-center space-x-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{group?.meetingFrequency}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{group?.distance}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {isDesktop ? (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwipeLeft}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              Pass
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              Details
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSwipeRight}
              iconName="Heart"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              Interest
            </Button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwipeLeft}
              iconName="X"
              iconSize={20}
              className="w-12 h-12 rounded-full"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleSwipeRight}
              iconName="Heart"
              iconSize={20}
              className="w-12 h-12 rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;