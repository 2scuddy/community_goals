import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GroupLeaderboard = ({ members }) => {
  const [timeframe, setTimeframe] = useState('weekly');

  const timeframes = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-warning';
      case 2: return 'text-muted-foreground';
      case 3: return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Leaderboard
        </h3>
        <div className="flex bg-muted rounded-lg p-1">
          {timeframes?.map((tf) => (
            <button
              key={tf?.id}
              onClick={() => setTimeframe(tf?.id)}
              className={`
                px-3 py-1 text-xs font-medium rounded-md transition-smooth
                ${timeframe === tf?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tf?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {members?.map((member, index) => {
          const rank = index + 1;
          return (
            <div
              key={member?.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-smooth
                ${rank <= 3 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'}
              `}
            >
              {/* Rank */}
              <div className={`w-8 h-8 flex items-center justify-center font-bold ${getRankColor(rank)}`}>
                {typeof getRankIcon(rank) === 'string' && getRankIcon(rank)?.includes('#') ? (
                  <span className="text-sm">{getRankIcon(rank)}</span>
                ) : (
                  <span className="text-lg">{getRankIcon(rank)}</span>
                )}
              </div>
              {/* Avatar */}
              <div className="relative">
                <Image
                  src={member?.avatar}
                  alt={member?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {member?.isLeader && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center">
                    <Icon name="Crown" size={10} color="white" />
                  </div>
                )}
              </div>
              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{member?.name}</p>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Flame" size={12} />
                    <span>{member?.streak} day streak</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} />
                    <span>{member?.checkins} check-ins</span>
                  </span>
                </div>
              </div>
              {/* Points */}
              <div className="text-right">
                <p className="font-bold text-foreground">{member?.points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
              {/* Badges */}
              {member?.badges && member?.badges?.length > 0 && (
                <div className="flex space-x-1">
                  {member?.badges?.slice(0, 2)?.map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                      title={badge?.name}
                    >
                      <span className="text-xs">{badge?.emoji}</span>
                    </div>
                  ))}
                  {member?.badges?.length > 2 && (
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{member?.badges?.length - 2}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Points Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs font-medium text-foreground mb-2">Point System:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} color="var(--color-success)" />
            <span>Check-in: +10 pts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MessageCircle" size={12} color="var(--color-primary)" />
            <span>Feedback: +5 pts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Trophy" size={12} color="var(--color-warning)" />
            <span>Goal Complete: +50-500 pts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Flame" size={12} color="var(--color-accent)" />
            <span>Streak Bonus: +2 pts/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupLeaderboard;