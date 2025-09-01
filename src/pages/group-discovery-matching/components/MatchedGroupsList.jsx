import React from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const MatchedGroupsList = ({ matchedGroups, onJoinGroup, onViewGroup }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'accepted':
        return 'text-success bg-success/10';
      case 'rejected':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Available';
    }
  };

  if (matchedGroups?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Users" size={24} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-lg font-heading font-medium text-foreground mb-2">
          No Matches Yet
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Keep swiping to find groups that match your goals and preferences. Your perfect accountability partners are waiting!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matchedGroups?.map((group) => (
        <div
          key={group?.id}
          className="bg-card rounded-xl border border-border p-4 hover:shadow-warm-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-base font-heading font-medium text-foreground">
                  {group?.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group?.status)}`}>
                  {getStatusText(group?.status)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Target" size={14} />
                <span>{group?.matchPercentage}% Match</span>
                <span>•</span>
                <span>{group?.location}</span>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              {group?.matchedAt}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="flex flex-wrap gap-2 mb-3">
            {group?.focusAreas?.slice(0, 2)?.map((area, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-medium"
              >
                {area}
              </span>
            ))}
            {group?.focusAreas?.length > 2 && (
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-lg text-xs font-medium">
                +{group?.focusAreas?.length - 2}
              </span>
            )}
          </div>

          {/* Group Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span>{group?.memberCount}/{group?.maxMembers}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{group?.meetingFrequency}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{group?.distance}</span>
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          {group?.lastMessage && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary-foreground">
                    {group?.lastMessage?.sender?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-foreground">
                      {group?.lastMessage?.sender}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {group?.lastMessage?.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {group?.lastMessage?.content}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewGroup(group?.id)}
              iconName="Eye"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              View Details
            </Button>
            {group?.status === 'available' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onJoinGroup(group?.id)}
                iconName="UserPlus"
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                Request to Join
              </Button>
            )}
            {group?.status === 'accepted' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onViewGroup(group?.id)}
                iconName="MessageCircle"
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                Open Chat
              </Button>
            )}
            {group?.status === 'pending' && (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                <Icon name="Clock" size={14} className="mr-1" />
                Response in {group?.estimatedResponse}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchedGroupsList;