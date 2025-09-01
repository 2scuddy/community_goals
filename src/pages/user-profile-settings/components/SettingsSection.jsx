import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { Checkbox } from '../../../components/ui/Checkbox';

const SettingsSection = ({ settings, onSettingsUpdate }) => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [localSettings, setLocalSettings] = useState(settings);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const tabs = [
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'account', label: 'Account', icon: 'Settings' },
    { id: 'preferences', label: 'Preferences', icon: 'Sliders' }
  ];

  const handleSettingChange = (category, key, value) => {
    const updated = {
      ...localSettings,
      [category]: {
        ...localSettings?.[category],
        [key]: value
      }
    };
    setLocalSettings(updated);
    onSettingsUpdate(updated);
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
    // Simulate password change
    setTimeout(() => {
      setIsChangingPassword(false);
      alert('Password changed successfully!');
    }, 2000);
  };

  const renderPrivacySettings = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-foreground mb-3">Profile Visibility</h3>
        <div className="space-y-3">
          <Checkbox
            label="Show profile in group matching"
            description="Allow other users to see your profile when forming groups"
            checked={localSettings?.privacy?.showInMatching}
            onChange={(e) => handleSettingChange('privacy', 'showInMatching', e?.target?.checked)}
          />
          <Checkbox
            label="Display achievement badges publicly"
            description="Show your earned badges on your public profile"
            checked={localSettings?.privacy?.showBadges}
            onChange={(e) => handleSettingChange('privacy', 'showBadges', e?.target?.checked)}
          />
          <Checkbox
            label="Allow others to see my goal progress"
            description="Let group members view your goal completion status"
            checked={localSettings?.privacy?.showProgress}
            onChange={(e) => handleSettingChange('privacy', 'showProgress', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Data Sharing</h3>
        <div className="space-y-3">
          <Checkbox
            label="Share anonymous usage data"
            description="Help improve the platform by sharing anonymous usage statistics"
            checked={localSettings?.privacy?.shareUsageData}
            onChange={(e) => handleSettingChange('privacy', 'shareUsageData', e?.target?.checked)}
          />
          <Checkbox
            label="Allow location-based matching"
            description="Use your location to find nearby group members"
            checked={localSettings?.privacy?.locationMatching}
            onChange={(e) => handleSettingChange('privacy', 'locationMatching', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-foreground mb-3">Daily Reminders</h3>
        <div className="space-y-3">
          <Checkbox
            label="Check-in reminders"
            description="Get reminded to complete your daily check-ins"
            checked={localSettings?.notifications?.checkinReminders}
            onChange={(e) => handleSettingChange('notifications', 'checkinReminders', e?.target?.checked)}
          />
          <Checkbox
            label="Goal deadline alerts"
            description="Receive notifications when goal deadlines approach"
            checked={localSettings?.notifications?.goalDeadlines}
            onChange={(e) => handleSettingChange('notifications', 'goalDeadlines', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Group Activities</h3>
        <div className="space-y-3">
          <Checkbox
            label="New group member notifications"
            description="Get notified when someone joins your group"
            checked={localSettings?.notifications?.newMembers}
            onChange={(e) => handleSettingChange('notifications', 'newMembers', e?.target?.checked)}
          />
          <Checkbox
            label="Peer feedback notifications"
            description="Receive alerts when group members provide feedback"
            checked={localSettings?.notifications?.peerFeedback}
            onChange={(e) => handleSettingChange('notifications', 'peerFeedback', e?.target?.checked)}
          />
          <Checkbox
            label="Challenge invitations"
            description="Get notified about new group challenges"
            checked={localSettings?.notifications?.challenges}
            onChange={(e) => handleSettingChange('notifications', 'challenges', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Meetup Notifications</h3>
        <div className="space-y-3">
          <Checkbox
            label="Meetup invitations"
            description="Receive notifications for group meetup invitations"
            checked={localSettings?.notifications?.meetupInvites}
            onChange={(e) => handleSettingChange('notifications', 'meetupInvites', e?.target?.checked)}
          />
          <Checkbox
            label="Meetup reminders"
            description="Get reminded about upcoming meetups"
            checked={localSettings?.notifications?.meetupReminders}
            onChange={(e) => handleSettingChange('notifications', 'meetupReminders', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground mb-3">Password & Security</h3>
        <div className="space-y-4">
          <Button
            variant="outline"
            iconName="Lock"
            iconPosition="left"
            iconSize={16}
            loading={isChangingPassword}
            onClick={handlePasswordChange}
          >
            Change Password
          </Button>
          <div className="text-sm text-muted-foreground">
            Last changed: March 15, 2024
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Email Preferences</h3>
        <div className="space-y-3">
          <Checkbox
            label="Weekly progress summary"
            description="Receive a weekly email with your progress summary"
            checked={localSettings?.account?.weeklyEmails}
            onChange={(e) => handleSettingChange('account', 'weeklyEmails', e?.target?.checked)}
          />
          <Checkbox
            label="Monthly achievement report"
            description="Get a monthly report of your achievements and milestones"
            checked={localSettings?.account?.monthlyReports}
            onChange={(e) => handleSettingChange('account', 'monthlyReports', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Data Management</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export My Data
          </Button>
          <Button
            variant="destructive"
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-foreground mb-3">Goal Framework Preferences</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Default Goal Framework
            </label>
            <select 
              className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              value={localSettings?.preferences?.defaultFramework}
              onChange={(e) => handleSettingChange('preferences', 'defaultFramework', e?.target?.value)}
            >
              <option value="smart">SMART Goals</option>
              <option value="okr">OKRs</option>
              <option value="atomic">Atomic Habits</option>
              <option value="sprint">90-Day Sprints</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Meetup Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preferred Meetup Radius (miles)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={localSettings?.preferences?.meetupRadius}
              onChange={(e) => handleSettingChange('preferences', 'meetupRadius', parseInt(e?.target?.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground text-center">
              {localSettings?.preferences?.meetupRadius} miles
            </div>
          </div>
          
          <Checkbox
            label="Available for weekend meetups"
            checked={localSettings?.preferences?.weekendMeetups}
            onChange={(e) => handleSettingChange('preferences', 'weekendMeetups', e?.target?.checked)}
          />
          <Checkbox
            label="Available for evening meetups"
            checked={localSettings?.preferences?.eveningMeetups}
            onChange={(e) => handleSettingChange('preferences', 'eveningMeetups', e?.target?.checked)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3">Discord Integration</h3>
        <div className="space-y-3">
          <Checkbox
            label="Enable Discord notifications"
            description="Receive group notifications through Discord"
            checked={localSettings?.preferences?.discordNotifications}
            onChange={(e) => handleSettingChange('preferences', 'discordNotifications', e?.target?.checked)}
          />
          <Button
            variant="outline"
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={16}
          >
            Connect Discord Account
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl shadow-warm">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-smooth
                ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'privacy' && renderPrivacySettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'account' && renderAccountSettings()}
        {activeTab === 'preferences' && renderPreferences()}
      </div>
    </div>
  );
};

export default SettingsSection;