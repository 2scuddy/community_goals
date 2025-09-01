import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OverviewTab = ({ group, members, recentActivity }) => {
  return (
    <div className="space-y-6">
      {/* Member Grid */}
      <div className="bg-card rounded-lg p-4 shadow-warm">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Group Members
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {members?.map((member) => (
            <div key={member?.id} className="text-center">
              <div className="relative mb-2">
                <Image
                  src={member?.avatar}
                  alt={member?.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover"
                />
                {member?.isLeader && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                    <Icon name="Crown" size={12} color="white" />
                  </div>
                )}
                {member?.streak > 0 && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                    {member?.streak}🔥
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {member?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {member?.points} pts
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Group Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 shadow-warm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {group?.stats?.totalCheckins}
              </p>
              <p className="text-sm text-muted-foreground">Check-ins</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-warm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Flame" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {group?.stats?.avgStreak}
              </p>
              <p className="text-sm text-muted-foreground">Avg Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-warm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Trophy" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {group?.stats?.completedGoals}
              </p>
              <p className="text-sm text-muted-foreground">Goals Done</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-warm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {group?.stats?.daysLeft}
              </p>
              <p className="text-sm text-muted-foreground">Days Left</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card rounded-lg p-4 shadow-warm">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Image
                src={activity?.userAvatar}
                alt={activity?.userName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity?.userName}</span> {activity?.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity?.timestamp}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Plus" size={12} color="var(--color-success)" />
                <span className="text-xs text-success font-medium">
                  +{activity?.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;