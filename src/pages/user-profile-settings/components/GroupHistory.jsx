import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GroupHistory = ({ groupHistory }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Groups', count: groupHistory?.length },
    { id: 'current', label: 'Current', count: groupHistory?.filter(g => g?.status === 'active')?.length },
    { id: 'completed', label: 'Completed', count: groupHistory?.filter(g => g?.status === 'completed')?.length },
    { id: 'left', label: 'Left Early', count: groupHistory?.filter(g => g?.status === 'left')?.length }
  ];

  const filteredGroups = groupHistory?.filter(group => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'current') return group?.status === 'active';
    if (activeFilter === 'completed') return group?.status === 'completed';
    if (activeFilter === 'left') return group?.status === 'left';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10 border-success/20';
      case 'completed':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'left':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'left':
        return 'Left Early';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Group History
        </h2>
        <div className="text-sm text-muted-foreground">
          {groupHistory?.length} total groups
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => setActiveFilter(filter?.id)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-full transition-smooth
              ${activeFilter === filter?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {filter?.label} ({filter?.count})
          </button>
        ))}
      </div>
      {/* Groups List */}
      <div className="space-y-4">
        {filteredGroups?.length > 0 ? (
          filteredGroups?.map((group, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-4 hover:shadow-warm-md transition-smooth"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">
                      {group?.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(group?.status)}`}>
                      {getStatusLabel(group?.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {group?.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={12} />
                      {group?.memberCount} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {group?.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Target" size={12} />
                      {group?.goalCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-sm font-semibold text-foreground">
                    {group?.stats?.completionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">Completion</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-sm font-semibold text-foreground">
                    {group?.stats?.checkinStreak}
                  </div>
                  <div className="text-xs text-muted-foreground">Best Streak</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-sm font-semibold text-foreground">
                    {group?.stats?.feedbackGiven}
                  </div>
                  <div className="text-xs text-muted-foreground">Feedback Given</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-sm font-semibold text-foreground">
                    {group?.stats?.pointsEarned}
                  </div>
                  <div className="text-xs text-muted-foreground">Points Earned</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {group?.dateRange}
                </div>
                <div className="flex gap-2">
                  {group?.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="MessageCircle"
                      iconPosition="left"
                      iconSize={14}
                      onClick={() => window.location.href = '/group-dashboard-communication'}
                    >
                      View Group
                    </Button>
                  )}
                  {group?.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Award"
                      iconPosition="left"
                      iconSize={14}
                    >
                      View Certificate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Users" size={32} className="text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-2">
              No groups found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {activeFilter === 'all' ? "You haven't joined any groups yet."
                : `No ${activeFilter} groups to display.`
              }
            </p>
            {activeFilter === 'all' && (
              <Button
                variant="default"
                iconName="Users"
                iconPosition="left"
                iconSize={16}
                onClick={() => window.location.href = '/group-discovery-matching'}
              >
                Find Groups
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupHistory;