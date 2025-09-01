import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const UpcomingMeetups = ({ meetups, onJoinMeetup }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    
    if (date?.toDateString() === today?.toDateString()) {
      return `Today, ${date?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      return `Tomorrow, ${date?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  if (meetups?.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm text-center">
        <Icon name="Calendar" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No Upcoming Meetups</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Join a group to start scheduling meetups with your accountability partners
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/group-discovery-matching'}
          iconName="Users"
          iconPosition="left"
          iconSize={16}
        >
          Find Groups
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">Upcoming Meetups</h3>
      </div>
      <div className="divide-y divide-border">
        {meetups?.slice(0, 3)?.map((meetup) => (
          <div key={meetup?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm mb-1">
                  {meetup?.title}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <Icon name="Calendar" size={12} />
                  <span>{formatDate(meetup?.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="MapPin" size={12} />
                  <span>{meetup?.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {meetup?.attendees?.slice(0, 3)?.map((attendee, index) => (
                  <Image
                    key={index}
                    src={attendee?.avatar}
                    alt={attendee?.name}
                    className="w-6 h-6 rounded-full object-cover border border-border"
                  />
                ))}
                {meetup?.attendees?.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      +{meetup?.attendees?.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {meetup?.attendees?.length} attending
              </div>
              <Button
                variant={meetup?.isJoined ? "outline" : "default"}
                size="xs"
                onClick={() => onJoinMeetup(meetup?.id)}
                iconName={meetup?.isJoined ? "Check" : "Plus"}
                iconPosition="left"
                iconSize={12}
              >
                {meetup?.isJoined ? "Joined" : "Join"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {meetups?.length > 3 && (
        <div className="p-4 border-t border-border text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/group-dashboard-communication'}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
          >
            View All Meetups
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetups;