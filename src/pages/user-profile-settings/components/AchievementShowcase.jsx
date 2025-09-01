import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementShowcase = ({ achievements }) => {
  const badgeIcons = {
    'streak-master': 'Flame',
    'goal-crusher': 'Target',
    'team-player': 'Users',
    'early-bird': 'Sun',
    'consistency-king': 'Calendar',
    'milestone-maker': 'Flag',
    'feedback-hero': 'MessageCircle',
    'challenge-champion': 'Trophy'
  };

  const getBadgeColor = (type) => {
    const colors = {
      'streak-master': 'text-orange-500 bg-orange-50',
      'goal-crusher': 'text-green-500 bg-green-50',
      'team-player': 'text-blue-500 bg-blue-50',
      'early-bird': 'text-yellow-500 bg-yellow-50',
      'consistency-king': 'text-purple-500 bg-purple-50',
      'milestone-maker': 'text-red-500 bg-red-50',
      'feedback-hero': 'text-indigo-500 bg-indigo-50',
      'challenge-champion': 'text-amber-500 bg-amber-50'
    };
    return colors?.[type] || 'text-gray-500 bg-gray-50';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
        Achievements & Stats
      </h2>
      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <div className="text-2xl font-bold text-success mb-1">
            {achievements?.stats?.totalGoalsCompleted}
          </div>
          <div className="text-xs text-muted-foreground">Goals Completed</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary mb-1">
            {achievements?.stats?.longestStreak}
          </div>
          <div className="text-xs text-muted-foreground">Longest Streak</div>
        </div>
        <div className="text-center p-3 bg-accent/10 rounded-lg">
          <div className="text-2xl font-bold text-accent mb-1">
            {achievements?.stats?.totalPoints}
          </div>
          <div className="text-xs text-muted-foreground">Total Points</div>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <div className="text-2xl font-bold text-warning mb-1">
            {achievements?.stats?.helpfulFeedbacks}
          </div>
          <div className="text-xs text-muted-foreground">Helpful Feedbacks</div>
        </div>
      </div>
      {/* Badges */}
      <div>
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Icon name="Award" size={16} />
          Earned Badges ({achievements?.badges?.length})
        </h3>
        
        {achievements?.badges?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievements?.badges?.map((badge, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 border-dashed transition-smooth hover:scale-105 ${getBadgeColor(badge?.type)}`}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    <Icon 
                      name={badgeIcons?.[badge?.type] || 'Award'} 
                      size={20}
                      className="text-current"
                    />
                  </div>
                  <div className="text-xs font-medium text-current mb-1">
                    {badge?.name}
                  </div>
                  <div className="text-xs opacity-70">
                    {badge?.earnedDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/50 rounded-lg">
            <Icon name="Award" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Complete goals and help others to earn badges!
            </p>
          </div>
        )}
      </div>
      {/* Progress Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-medium text-foreground mb-3">Progress Towards Next Badges</h3>
        <div className="space-y-3">
          {achievements?.nextBadges?.map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={badgeIcons?.[badge?.type] || 'Award'} size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {badge?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {badge?.progress}/{badge?.required}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(badge?.progress / badge?.required) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementShowcase;