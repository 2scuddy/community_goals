import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onPhotoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          onPhotoUpdate(e?.target?.result);
          setIsUploading(false);
        };
        reader?.readAsDataURL(file);
      }, 1500);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Profile Photo */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-muted border-4 border-primary/20">
            <Image
              src={user?.avatar}
              alt={`${user?.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Upload Button */}
          <label className="absolute -bottom-2 -right-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-warm-md hover:bg-primary/90 transition-smooth">
              {isUploading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name="Camera" size={16} />
              )}
            </div>
          </label>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {user?.name}
          </h1>
          <p className="text-muted-foreground mb-3">
            {user?.age} years old • {user?.location}
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
            <div className="flex items-center gap-1 text-success">
              <Icon name="Target" size={16} />
              <span>{user?.activeGoals} Active Goals</span>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Icon name="Users" size={16} />
              <span>{user?.groupsJoined} Groups Joined</span>
            </div>
            <div className="flex items-center gap-1 text-warning">
              <Icon name="Flame" size={16} />
              <span>{user?.currentStreak} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Share2"
            iconPosition="left"
            iconSize={16}
          >
            Share Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;