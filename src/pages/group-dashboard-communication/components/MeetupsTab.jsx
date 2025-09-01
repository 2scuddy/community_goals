import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MeetupsTab = ({ meetups, onRSVP, onCreateMeetup }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMeetup, setNewMeetup] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'in-person'
  });

  const handleCreateMeetup = () => {
    if (newMeetup?.title?.trim() && newMeetup?.date && newMeetup?.time) {
      onCreateMeetup(newMeetup);
      setNewMeetup({ title: '', description: '', date: '', time: '', location: '', type: 'in-person' });
      setShowCreateForm(false);
    }
  };

  const getMeetupStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-primary';
      case 'today': return 'text-accent';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getMeetupStatusBg = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-primary/10 border-primary/20';
      case 'today': return 'bg-accent/10 border-accent/20';
      case 'completed': return 'bg-muted/10 border-muted/20';
      default: return 'bg-muted/10 border-muted/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Group Meetups
        </h3>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
          iconName="Plus"
          iconPosition="left"
        >
          Schedule Meetup
        </Button>
      </div>
      {/* Discord Integration */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={20} color="white" />
            </div>
            <div>
              <p className="font-medium text-foreground">Discord Group Call</p>
              <p className="text-sm text-muted-foreground">Join the voice channel for instant connection</p>
            </div>
          </div>
          <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="right">
            Join Call
          </Button>
        </div>
      </div>
      {/* Create Meetup Form */}
      {showCreateForm && (
        <div className="bg-card rounded-lg p-4 shadow-warm border border-primary/20">
          <h4 className="font-medium text-foreground mb-3">Schedule New Meetup</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Meetup title..."
              value={newMeetup?.title}
              onChange={(e) => setNewMeetup({ ...newMeetup, title: e?.target?.value })}
              className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder-muted-foreground border-0 focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description (optional)..."
              value={newMeetup?.description}
              onChange={(e) => setNewMeetup({ ...newMeetup, description: e?.target?.value })}
              rows={2}
              className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder-muted-foreground border-0 focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={newMeetup?.date}
                onChange={(e) => setNewMeetup({ ...newMeetup, date: e?.target?.value })}
                className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-primary"
              />
              <input
                type="time"
                value={newMeetup?.time}
                onChange={(e) => setNewMeetup({ ...newMeetup, time: e?.target?.value })}
                className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={newMeetup?.type}
              onChange={(e) => setNewMeetup({ ...newMeetup, type: e?.target?.value })}
              className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-primary"
            >
              <option value="in-person">In-Person Meetup</option>
              <option value="virtual">Virtual Meetup</option>
              <option value="hybrid">Hybrid Meetup</option>
            </select>
            {newMeetup?.type !== 'virtual' && (
              <input
                type="text"
                placeholder="Location or meeting point..."
                value={newMeetup?.location}
                onChange={(e) => setNewMeetup({ ...newMeetup, location: e?.target?.value })}
                className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder-muted-foreground border-0 focus:ring-2 focus:ring-primary"
              />
            )}
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateMeetup}
                disabled={!newMeetup?.title?.trim() || !newMeetup?.date || !newMeetup?.time}
              >
                Schedule Meetup
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Meetups List */}
      <div className="space-y-4">
        {meetups?.map((meetup) => (
          <div key={meetup?.id} className={`bg-card rounded-lg p-4 shadow-warm border ${getMeetupStatusBg(meetup?.status)}`}>
            {/* Meetup Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{meetup?.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-muted/50 ${getMeetupStatusColor(meetup?.status)}`}>
                    {meetup?.status?.toUpperCase()}
                  </span>
                </div>
                {meetup?.description && (
                  <p className="text-sm text-muted-foreground mb-2">{meetup?.description}</p>
                )}
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{formatDate(meetup?.date)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{meetup?.time}</span>
                  </span>
                  {meetup?.location && (
                    <span className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{meetup?.location}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={meetup?.type === 'virtual' ? 'Video' : meetup?.type === 'hybrid' ? 'Smartphone' : 'MapPin'} 
                  size={16} 
                  color="var(--color-muted-foreground)" 
                />
              </div>
            </div>

            {/* RSVP Status */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Attendees ({meetup?.attendees?.going?.length || 0})
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-success">{meetup?.attendees?.going?.length || 0} going</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-warning">{meetup?.attendees?.maybe?.length || 0} maybe</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-error">{meetup?.attendees?.notGoing?.length || 0} can't make it</span>
                </div>
              </div>
              
              {/* Attendee Avatars */}
              {meetup?.attendees?.going && meetup?.attendees?.going?.length > 0 && (
                <div className="flex -space-x-1 mb-3">
                  {meetup?.attendees?.going?.slice(0, 6)?.map((attendee, index) => (
                    <Image
                      key={index}
                      src={attendee?.avatar}
                      alt={attendee?.name}
                      className="w-6 h-6 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                  {meetup?.attendees?.going?.length > 6 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{meetup?.attendees?.going?.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RSVP Buttons */}
            {meetup?.status === 'upcoming' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={meetup?.userRSVP === 'going' ? 'default' : 'outline'}
                  onClick={() => onRSVP(meetup?.id, 'going')}
                  iconName="Check"
                  iconSize={14}
                >
                  Going
                </Button>
                <Button
                  size="sm"
                  variant={meetup?.userRSVP === 'maybe' ? 'warning' : 'outline'}
                  onClick={() => onRSVP(meetup?.id, 'maybe')}
                  iconName="HelpCircle"
                  iconSize={14}
                >
                  Maybe
                </Button>
                <Button
                  size="sm"
                  variant={meetup?.userRSVP === 'notGoing' ? 'destructive' : 'outline'}
                  onClick={() => onRSVP(meetup?.id, 'notGoing')}
                  iconName="X"
                  iconSize={14}
                >
                  Can't Make It
                </Button>
              </div>
            )}

            {/* Safety Note */}
            {meetup?.type === 'in-person' && meetup?.status === 'upcoming' && (
              <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Shield" size={14} color="var(--color-warning)" />
                  <p className="text-xs text-warning">
                    Safety reminder: Meet in public places and let someone know your plans.
                  </p>
                </div>
              </div>
            )}

            {/* Map for In-Person Meetups */}
            {meetup?.type === 'in-person' && meetup?.coordinates && (
              <div className="mt-3">
                <div className="w-full h-32 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    title={meetup?.location}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${meetup?.coordinates?.lat},${meetup?.coordinates?.lng}&z=14&output=embed`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {meetups?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
          <p className="text-muted-foreground">No meetups scheduled</p>
          <p className="text-sm text-muted-foreground">Schedule the first meetup for your group!</p>
        </div>
      )}
    </div>
  );
};

export default MeetupsTab;