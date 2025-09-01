import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { utilityService } from '../../../services/supabaseService';

const ActivityFeed = ({ activities = [], onLoadMore, hasMore = true, loading = false }) => {
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'check-in': return 'CheckCircle';
      case 'milestone': return 'Trophy';
      case 'goal-created': return 'Target';
      case 'badge-earned': return 'Award';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'check-in': return 'text-primary';
      case 'milestone': return 'text-accent';
      case 'goal-created': return 'text-secondary';
      case 'badge-earned': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const formatActivityContent = (activity) => {
    const baseContent = activity?.content || '';
    
    // Add goal context if available
    if (activity?.goals?.title) {
      return `${baseContent} (Goal: ${activity?.goals?.title})`;
    }
    
    return baseContent;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return utilityService?.formatRelativeTime(timestamp);
  };

  const getUserDisplayName = (activity) => {
    if (activity?.user_profiles?.full_name) {
      return activity?.user_profiles?.full_name;
    }
    if (activity?.user_profiles?.username) {
      return activity?.user_profiles?.username;
    }
    return activity?.userName || 'Unknown User';
  };

  const getUserAvatar = (activity) => {
    return activity?.user_profiles?.avatar_url || activity?.userAvatar;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-warm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Activity Feed</h2>
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>

        {activities?.length === 0 && !loading ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No activities yet</h3>
            <p className="text-muted-foreground">
              Start checking in and completing goals to see your activity feed come to life!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities?.map((activity) => (
              <div key={activity?.id} className="flex space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {getUserAvatar(activity) ? (
                    <img
                      src={getUserAvatar(activity)}
                      alt={getUserDisplayName(activity)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="User" size={20} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-foreground">
                        {getUserDisplayName(activity)}
                      </span>
                      <Icon 
                        name={getActivityIcon(activity?.type)} 
                        size={16} 
                        className={getActivityColor(activity?.type)} 
                      />
                      {activity?.goals?.category && (
                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {activity?.goals?.category}
                        </span>
                      )}
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {formatTimestamp(activity?.created_at || activity?.timestamp)}
                    </time>
                  </div>

                  <p className="text-foreground mb-3">
                    {formatActivityContent(activity)}
                  </p>

                  {/* Activity Image */}
                  {activity?.media_urls?.[0] && (
                    <div className="mb-3">
                      <img
                        src={activity?.media_urls?.[0]}
                        alt="Activity"
                        className="rounded-lg max-w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Engagement */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-destructive transition-smooth">
                      <Icon name="Heart" size={16} />
                      <span>{activity?.likes_count || activity?.likes || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary transition-smooth">
                      <Icon name="MessageCircle" size={16} />
                      <span>{activity?.comments_count || activity?.comments || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-accent transition-smooth">
                      <Icon name="Share" size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={loading}
                  className="w-full lg:w-auto"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Icon name="ChevronDown" size={16} />
                      <span>Load more activities</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;