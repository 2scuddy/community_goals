import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CheckinsTab = ({ checkins, onReaction, onComment }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);

  const moodEmojis = {
    'excited': '🚀',
    'happy': '😊',
    'neutral': '😐',
    'tired': '😴',
    'stressed': '😰'
  };

  const reactionEmojis = ['👏', '💪', '🔥', '❤️', '👍'];

  const handleComment = (checkinId) => {
    if (commentText?.trim()) {
      onComment(checkinId, commentText);
      setCommentText('');
      setActiveCommentId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Daily Check-in Prompt */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="CheckCircle" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Daily Check-in
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Share your progress and mood with the group
        </p>
        <Button variant="default" iconName="Plus" iconPosition="left">
          Add Check-in
        </Button>
      </div>
      {/* Check-ins Feed */}
      <div className="space-y-4">
        {checkins?.map((checkin) => (
          <div key={checkin?.id} className="bg-card rounded-lg p-4 shadow-warm">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Image
                  src={checkin?.userAvatar}
                  alt={checkin?.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{checkin?.userName}</p>
                  <p className="text-xs text-muted-foreground">{checkin?.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{moodEmojis?.[checkin?.mood]}</span>
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="Plus" size={12} />
                  <span className="text-xs font-medium">+10</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="text-sm text-foreground mb-2">{checkin?.content}</p>
              {checkin?.photo && (
                <Image
                  src={checkin?.photo}
                  alt="Check-in photo"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Goals Progress */}
            {checkin?.goals && (
              <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  TODAY'S GOALS
                </p>
                <div className="space-y-1">
                  {checkin?.goals?.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon 
                        name={goal?.completed ? "CheckCircle" : "Circle"} 
                        size={14} 
                        color={goal?.completed ? "var(--color-success)" : "var(--color-muted-foreground)"} 
                      />
                      <span className={`text-xs ${goal?.completed ? 'text-success line-through' : 'text-foreground'}`}>
                        {goal?.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reactions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {reactionEmojis?.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReaction(checkin?.id, emoji)}
                    className="p-2 hover:bg-muted rounded-lg transition-smooth"
                  >
                    <span className="text-sm">{emoji}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveCommentId(activeCommentId === checkin?.id ? null : checkin?.id)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="MessageCircle" size={16} />
                <span className="text-xs">{checkin?.comments?.length || 0}</span>
              </button>
            </div>

            {/* Reactions Display */}
            {checkin?.reactions && Object.keys(checkin?.reactions)?.length > 0 && (
              <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-border">
                {Object.entries(checkin?.reactions)?.map(([emoji, count]) => (
                  <div key={emoji} className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded-full">
                    <span className="text-xs">{emoji}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Comments */}
            {checkin?.comments && checkin?.comments?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {checkin?.comments?.map((comment) => (
                  <div key={comment?.id} className="flex items-start space-x-2">
                    <Image
                      src={comment?.userAvatar}
                      alt={comment?.userName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 bg-muted/30 rounded-lg p-2">
                      <p className="text-xs font-medium text-foreground">{comment?.userName}</p>
                      <p className="text-xs text-muted-foreground">{comment?.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            {activeCommentId === checkin?.id && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e?.target?.value)}
                    className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground placeholder-muted-foreground border-0 focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e?.key === 'Enter' && handleComment(checkin?.id)}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleComment(checkin?.id)}
                    disabled={!commentText?.trim()}
                    iconName="Send"
                    iconSize={14}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckinsTab;