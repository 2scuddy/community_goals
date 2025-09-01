import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ChallengesTab = ({ challenges, onVote, onCreateChallenge }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    duration: '7',
    type: 'individual'
  });

  const handleCreateChallenge = () => {
    if (newChallenge?.title?.trim() && newChallenge?.description?.trim()) {
      onCreateChallenge(newChallenge);
      setNewChallenge({ title: '', description: '', duration: '7', type: 'individual' });
      setShowCreateForm(false);
    }
  };

  const getChallengeStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'voting': return 'text-warning';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getChallengeStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 border-success/20';
      case 'voting': return 'bg-warning/10 border-warning/20';
      case 'completed': return 'bg-muted/10 border-muted/20';
      default: return 'bg-muted/10 border-muted/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Challenge Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Group Challenges
        </h3>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
          iconName="Plus"
          iconPosition="left"
        >
          Create Challenge
        </Button>
      </div>
      {/* Create Challenge Form */}
      {showCreateForm && (
        <div className="bg-card rounded-lg p-4 shadow-warm border border-primary/20">
          <h4 className="font-medium text-foreground mb-3">Create New Challenge</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Challenge title..."
              value={newChallenge?.title}
              onChange={(e) => setNewChallenge({ ...newChallenge, title: e?.target?.value })}
              className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder-muted-foreground border-0 focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Challenge description..."
              value={newChallenge?.description}
              onChange={(e) => setNewChallenge({ ...newChallenge, description: e?.target?.value })}
              rows={3}
              className="w-full px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder-muted-foreground border-0 focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex space-x-3">
              <select
                value={newChallenge?.duration}
                onChange={(e) => setNewChallenge({ ...newChallenge, duration: e?.target?.value })}
                className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-primary"
              >
                <option value="3">3 days</option>
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
                <option value="30">1 month</option>
              </select>
              <select
                value={newChallenge?.type}
                onChange={(e) => setNewChallenge({ ...newChallenge, type: e?.target?.value })}
                className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0 focus:ring-2 focus:ring-primary"
              >
                <option value="individual">Individual</option>
                <option value="team">Team vs Team</option>
                <option value="group">Group Goal</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateChallenge}
                disabled={!newChallenge?.title?.trim() || !newChallenge?.description?.trim()}
              >
                Create Challenge
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
      {/* Challenges List */}
      <div className="space-y-4">
        {challenges?.map((challenge) => (
          <div key={challenge?.id} className={`bg-card rounded-lg p-4 shadow-warm border ${getChallengeStatusBg(challenge?.status)}`}>
            {/* Challenge Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-foreground">{challenge?.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-muted/50 ${getChallengeStatusColor(challenge?.status)}`}>
                    {challenge?.status?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{challenge?.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{challenge?.duration} days</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span>{challenge?.participants} participants</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Trophy" size={12} />
                    <span>{challenge?.points} points</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src={challenge?.creatorAvatar}
                  alt={challenge?.creatorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Challenge Progress */}
            {challenge?.status === 'active' && challenge?.progress && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Progress</span>
                  <span className="text-xs text-muted-foreground">{challenge?.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full transition-all duration-500"
                    style={{ width: `${challenge?.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Voting Section */}
            {challenge?.status === 'voting' && (
              <div className="mb-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
                <p className="text-sm text-foreground mb-2">
                  Vote to approve this challenge
                </p>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVote(challenge?.id, 'yes')}
                      iconName="ThumbsUp"
                      iconSize={14}
                    >
                      Yes ({challenge?.votes?.yes || 0})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVote(challenge?.id, 'no')}
                      iconName="ThumbsDown"
                      iconSize={14}
                    >
                      No ({challenge?.votes?.no || 0})
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {challenge?.votesNeeded} more votes needed
                  </span>
                </div>
              </div>
            )}

            {/* Participants */}
            {challenge?.status === 'active' && challenge?.participantAvatars && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Participants:</span>
                <div className="flex -space-x-1">
                  {challenge?.participantAvatars?.slice(0, 5)?.map((avatar, index) => (
                    <Image
                      key={index}
                      src={avatar}
                      alt={`Participant ${index + 1}`}
                      className="w-6 h-6 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                  {challenge?.participantAvatars?.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{challenge?.participantAvatars?.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {challenge?.status === 'active' && !challenge?.userParticipating && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  iconName="Plus"
                  iconPosition="left"
                >
                  Join Challenge
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {challenges?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Trophy" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
          <p className="text-muted-foreground">No challenges yet</p>
          <p className="text-sm text-muted-foreground">Create the first challenge for your group!</p>
        </div>
      )}
    </div>
  );
};

export default ChallengesTab;