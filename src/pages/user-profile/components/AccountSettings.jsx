import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettings = ({ settings, onUpdateSettings }) => {
  const [activeSection, setActiveSection] = useState('notifications');
  const [localSettings, setLocalSettings] = useState(settings);

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'data', label: 'Data', icon: 'Download' }
  ];

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
  };

  const handleExportData = () => {
    // Mock data export functionality
    const exportData = {
      profile: localSettings?.profile,
      studyHours: 245.5,
      tasksCompleted: 1247,
      goalsAchieved: 23,
      exportDate: new Date()?.toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `starrystudy-data-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const renderNotifications = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4">Notification Preferences</h3>
      
      <Checkbox
        label="Friend activity notifications"
        description="Get notified when friends complete tasks or achieve goals"
        checked={localSettings?.notifications?.friendActivity}
        onChange={(e) => handleSettingChange('notifications', {
          ...localSettings?.notifications,
          friendActivity: e?.target?.checked
        })}
      />

      <Checkbox
        label="Daily reminders"
        description="Receive daily reminders to log study time and complete tasks"
        checked={localSettings?.notifications?.dailyReminders}
        onChange={(e) => handleSettingChange('notifications', {
          ...localSettings?.notifications,
          dailyReminders: e?.target?.checked
        })}
      />

      <Checkbox
        label="Achievement unlocks"
        description="Get notified when you unlock new achievements"
        checked={localSettings?.notifications?.achievements}
        onChange={(e) => handleSettingChange('notifications', {
          ...localSettings?.notifications,
          achievements: e?.target?.checked
        })}
      />

      <Checkbox
        label="Weekly progress reports"
        description="Receive weekly summaries of your study progress"
        checked={localSettings?.notifications?.weeklyReports}
        onChange={(e) => handleSettingChange('notifications', {
          ...localSettings?.notifications,
          weeklyReports: e?.target?.checked
        })}
      />
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4">Privacy Settings</h3>
      
      <Checkbox
        label="Show profile to friends"
        description="Allow friends to view your profile and study statistics"
        checked={localSettings?.privacy?.profileVisible}
        onChange={(e) => handleSettingChange('privacy', {
          ...localSettings?.privacy,
          profileVisible: e?.target?.checked
        })}
      />

      <Checkbox
        label="Show on leaderboards"
        description="Display your ranking on friend leaderboards"
        checked={localSettings?.privacy?.leaderboardVisible}
        onChange={(e) => handleSettingChange('privacy', {
          ...localSettings?.privacy,
          leaderboardVisible: e?.target?.checked
        })}
      />

      <Checkbox
        label="Allow friend requests"
        description="Let other users send you friend requests"
        checked={localSettings?.privacy?.allowFriendRequests}
        onChange={(e) => handleSettingChange('privacy', {
          ...localSettings?.privacy,
          allowFriendRequests: e?.target?.checked
        })}
      />

      <Checkbox
        label="Share study streaks"
        description="Show your current study streak to friends"
        checked={localSettings?.privacy?.shareStreaks}
        onChange={(e) => handleSettingChange('privacy', {
          ...localSettings?.privacy,
          shareStreaks: e?.target?.checked
        })}
      />
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4">Account Information</h3>
      
      <Input
        label="Display Name"
        type="text"
        value={localSettings?.profile?.displayName}
        onChange={(e) => handleSettingChange('profile', {
          ...localSettings?.profile,
          displayName: e?.target?.value
        })}
        description="This name will be visible to your friends"
      />

      <Input
        label="Bio"
        type="text"
        value={localSettings?.profile?.bio}
        onChange={(e) => handleSettingChange('profile', {
          ...localSettings?.profile,
          bio: e?.target?.value
        })}
        description="Tell your friends about your study goals"
      />

      <Input
        label="Email Address"
        type="email"
        value={localSettings?.profile?.email}
        disabled
        description="Email cannot be changed. Contact support if needed."
      />

      <div className="pt-4 border-t border-border">
        <Button variant="destructive" className="w-full">
          <Icon name="Trash2" size={16} className="mr-2" />
          Delete Account
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </div>
  );

  const renderData = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground mb-4">Data Management</h3>
      
      <div className="bg-surface/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Download" size={20} className="text-accent" />
          <div>
            <h4 className="font-medium text-foreground">Export Your Data</h4>
            <p className="text-sm text-muted-foreground">
              Download all your study data, achievements, and progress
            </p>
          </div>
        </div>
        <Button onClick={handleExportData} className="w-full">
          <Icon name="Download" size={16} className="mr-2" />
          Export Data
        </Button>
      </div>

      <div className="bg-surface/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="RefreshCw" size={20} className="text-secondary" />
          <div>
            <h4 className="font-medium text-foreground">Sync Data</h4>
            <p className="text-sm text-muted-foreground">
              Last synced: {new Date()?.toLocaleString()}
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Sync Now
        </Button>
      </div>

      <div className="bg-surface/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Trash2" size={20} className="text-error" />
          <div>
            <h4 className="font-medium text-foreground">Clear Data</h4>
            <p className="text-sm text-muted-foreground">
              Reset all study statistics and achievements
            </p>
          </div>
        </div>
        <Button variant="destructive" className="w-full">
          <Icon name="Trash2" size={16} className="mr-2" />
          Clear All Data
        </Button>
      </div>
    </div>
  );

  return (
    <div className="morphic-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-1/4">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
            {sections?.map((section) => (
              <button
                key={section?.id}
                onClick={() => setActiveSection(section?.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap
                  transition-colors min-w-fit lg:min-w-full
                  ${activeSection === section?.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface/50'
                  }
                `}
              >
                <Icon name={section?.icon} size={18} />
                <span className="font-medium">{section?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:w-3/4">
          {activeSection === 'notifications' && renderNotifications()}
          {activeSection === 'privacy' && renderPrivacy()}
          {activeSection === 'account' && renderAccount()}
          {activeSection === 'data' && renderData()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;