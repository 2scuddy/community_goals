import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ goals }) => {
  const activeGoals = goals?.filter(goal => goal?.status === 'active');
  const completedGoals = goals?.filter(goal => goal?.status === 'completed');
  const totalStreak = activeGoals?.reduce((sum, goal) => sum + goal?.streak, 0);
  const avgProgress = activeGoals?.length > 0 
    ? Math.round(activeGoals?.reduce((sum, goal) => sum + goal?.progress, 0) / activeGoals?.length)
    : 0;

  const highPriorityGoals = activeGoals?.filter(goal => goal?.priority === 'high')?.length;
  const goalsNearDeadline = activeGoals?.filter(goal => goal?.daysRemaining <= 7)?.length;

  const stats = [
    {
      label: 'Active Goals',
      value: activeGoals?.length,
      icon: 'Target',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Completed',
      value: completedGoals?.length,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Total Streak',
      value: `${totalStreak} days`,
      icon: 'Flame',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: 'TrendingUp',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">Quick Stats</h2>
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleDateString()}
        </div>
      </div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center mx-auto mb-2`}>
              <Icon name={stat?.icon} size={20} color={stat?.color?.replace('text-', 'var(--color-')} />
            </div>
            <div className="text-xl font-heading font-bold text-foreground">{stat?.value}</div>
            <div className="text-xs text-muted-foreground">{stat?.label}</div>
          </div>
        ))}
      </div>
      {/* Alert Indicators */}
      {(highPriorityGoals > 0 || goalsNearDeadline > 0) && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {highPriorityGoals > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{highPriorityGoals}</span> high priority
                  </span>
                </div>
              )}
              {goalsNearDeadline > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{goalsNearDeadline}</span> due soon
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Need attention
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStatsCard;