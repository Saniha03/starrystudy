import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useToast } from '../../components/ui/NotificationToast';
import BottomNavigation from '../../components/ui/BottomNavigation';
import ProfileHeader from './components/ProfileHeader';
import StudyAnalytics from './components/StudyAnalytics';
import AchievementBadges from './components/AchievementBadges';
import AccountSettings from './components/AccountSettings';
import QuickStats from './components/QuickStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { studySessionsService } from '../../services/studySessionsService';

const UserProfile = () => {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const { addToast, ToastContainer } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStudySessions();
    }
  }, [user]);

  const loadStudySessions = async () => {
    try {
      setLoading(true);
      const data = await studySessionsService?.getStudySessions({
        userId: user?.id
      });
      setSessions(data);
    } catch (error) {
      addToast(error?.message || 'Failed to load study sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      addToast('Signed out successfully', 'info');
    } catch (error) {
      addToast(error?.message || 'Failed to sign out', 'error');
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      await updateProfile(updates);
      addToast('Profile updated successfully! ✨', 'success');
    } catch (error) {
      addToast(error?.message || 'Failed to update profile', 'error');
    }
  };

  // Show authentication loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  const totalStudyTime = sessions?.reduce((sum, session) => sum + session?.duration_minutes, 0) || 0;
  const completedSessions = sessions?.filter(session => session?.is_completed) || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account and view your progress
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              iconName="LogOut"
              size="sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      {/* Profile Header */}
      <ProfileHeader 
        user={user}
        userProfile={userProfile}
        onEditProfile={handleUpdateProfile}
      />
      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg mb-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pb-24">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <QuickStats 
                userProfile={userProfile}
                totalStudyTime={totalStudyTime}
                sessionsCount={completedSessions?.length}
                stats={{
                  totalStudyTime,
                  sessionsCompleted: completedSessions?.length || 0,
                  averageSessionDuration: totalStudyTime / (completedSessions?.length || 1),
                  streak: userProfile?.currentStreak || 0
                }}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <StudyAnalytics 
                sessions={sessions}
                loading={loading}
                analytics={{
                  totalTime: totalStudyTime,
                  completedSessions: completedSessions?.length || 0,
                  averageDaily: totalStudyTime / 30,
                  weeklyData: sessions || []
                }}
              />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AchievementBadges 
                userProfile={userProfile}
                sessions={sessions}
                achievements={userProfile?.achievements || []}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AccountSettings 
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onSignOut={handleSignOut}
                settings={userProfile?.settings || {}}
                onUpdateSettings={handleUpdateProfile}
              />
            </motion.div>
          )}
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation />
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default UserProfile;