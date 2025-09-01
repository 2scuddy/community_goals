import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const GroupChatPreview = ({ groups, onOpenChat }) => {
  const formatLastMessage = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (groups?.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border shadow-warm text-center">
        <Icon name="MessageCircle" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No Group Chats</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Join a group to start chatting with your accountability partners
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
        <h3 className="text-lg font-heading font-semibold text-foreground">Group Chats</h3>
      </div>
      <div className="divide-y divide-border">
        {groups?.slice(0, 4)?.map((group) => (
          <div 
            key={group?.id} 
            className="p-4 hover:bg-muted/50 transition-smooth cursor-pointer"
            onClick={() => onOpenChat(group?.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Users" size={20} color="var(--color-primary)" />
                </div>
                {group?.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {group?.unreadCount > 9 ? '9+' : group?.unreadCount}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground text-sm truncate">
                    {group?.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatLastMessage(group?.lastMessage?.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {group?.lastMessage?.sender}:
                  </span>
                  <p className="text-xs text-muted-foreground truncate flex-1">
                    {group?.lastMessage?.content}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1 mt-2">
                  {group?.members?.slice(0, 4)?.map((member, index) => (
                    <Image
                      key={index}
                      src={member?.avatar}
                      alt={member?.name}
                      className="w-5 h-5 rounded-full object-cover border border-border"
                    />
                  ))}
                  {group?.members?.length > 4 && (
                    <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        +{group?.members?.length - 4}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground ml-2">
                    {group?.members?.length} members
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {groups?.length > 4 && (
        <div className="p-4 border-t border-border text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/group-dashboard-communication'}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
          >
            View All Chats
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupChatPreview;