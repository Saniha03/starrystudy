import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/NotificationToast';
import FriendCard from './components/FriendCard';
import LeaderboardItem from './components/LeaderboardItem';
import AddFriendModal from './components/AddFriendModal';
import TimeFilter from './components/TimeFilter';
import ActivityFeed from './components/ActivityFeed';

const FriendsLeaderboard = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [activities, setActivities] = useState([]);
  const { addToast, ToastContainer } = useToast();

  // Mock current user data
  const currentUser = {
    id: 'current-user',
    name: 'You',
    email: 'you@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser',
    status: 'online',
    totalPoints: 3250,
    weeklyProgress: 420,
    lastActivity: 'Active now',
    trend: 'up'
  };

  // Mock friends data
  useEffect(() => {
    const mockFriends = [
      {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        status: 'studying',
        totalPoints: 4150,
        weeklyProgress: 580,
        lastActivity: 'Completed "Math Assignment" 15 min ago',
        trend: 'up'
      },
      {
        id: 2,
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        status: 'online',
        totalPoints: 3890,
        weeklyProgress: 320,
        lastActivity: 'Started study session 1 hour ago',
        trend: 'up'
      },
      {
        id: 3,
        name: 'Emma Thompson',
        email: 'emma.thompson@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        status: 'away',
        totalPoints: 2980,
        weeklyProgress: 280,
        lastActivity: 'Achieved goal "Read 5 chapters" 3 hours ago',
        trend: 'same'
      },
      {
        id: 4,
        name: 'Marcus Johnson',
        email: 'marcus.johnson@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'offline',
        totalPoints: 2750,
        weeklyProgress: 180,
        lastActivity: 'Completed 2 tasks yesterday',
        trend: 'down'
      },
      {
        id: 5,
        name: 'Lily Wang',
        email: 'lily.wang@example.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        status: 'studying',
        totalPoints: 2100,
        weeklyProgress: 350,
        lastActivity: 'Started "Chemistry Review" 30 min ago',
        trend: 'up'
      }
    ];
    setFriends(mockFriends);
  }, []);

  // Mock activity data
  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        user: friends?.find(f => f?.id === 1) || friends?.[0],
        type: 'task_completed',
        description: 'completed "Math Assignment"',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        points: 50
      },
      {
        id: 2,
        user: friends?.find(f => f?.id === 2) || friends?.[1],
        type: 'study_session',
        description: 'studied for 2 hours',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        points: 120
      },
      {
        id: 3,
        user: friends?.find(f => f?.id === 3) || friends?.[2],
        type: 'goal_achieved',
        description: 'achieved goal "Read 5 chapters"',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        points: 200
      },
      {
        id: 4,
        user: friends?.find(f => f?.id === 5) || friends?.[4],
        type: 'study_session',
        description: 'started "Chemistry Review"',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        points: null
      },
      {
        id: 5,
        user: friends?.find(f => f?.id === 1) || friends?.[0],
        type: 'milestone',
        description: 'reached 4000 points milestone!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        points: 100
      }
    ];
    setActivities(mockActivities);
  }, [friends]);

  // Create leaderboard with current user
  const getLeaderboardData = () => {
    const allUsers = [currentUser, ...friends];
    return allUsers?.sort((a, b) => b?.totalPoints - a?.totalPoints)?.map((user, index) => ({ ...user, position: index + 1 }));
  };

  const handleViewProgress = (friend) => {
    addToast(`Viewing ${friend?.name}'s progress`, 'info');
  };

  const handleSendEncouragement = (friend) => {
    addToast(`Encouragement sent to ${friend?.name}!`, 'friend');
  };

  const handleAddFriend = (newFriend) => {
    setFriends(prev => [...prev, newFriend]);
  };

  const leaderboardData = getLeaderboardData();

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Friends & Leaderboard
            </h1>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddFriendModalOpen(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Add Friend
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'friends' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Users" size={16} className="inline mr-2" />
              Friends ({friends?.length})
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'leaderboard' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Trophy" size={16} className="inline mr-2" />
              Leaderboard
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 bottom-nav-safe">
        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
                {/* Friends List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Your Study Friends
                  </h2>
                  {friends?.length === 0 ? (
                    <div className="morphic-card text-center py-12">
                      <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No friends yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add friends to start studying together and compete on the leaderboard!
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setIsAddFriendModalOpen(true)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Add Your First Friend
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {friends?.map((friend) => (
                        <FriendCard
                          key={friend?.id}
                          friend={friend}
                          onViewProgress={handleViewProgress}
                          onSendEncouragement={handleSendEncouragement}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                  <ActivityFeed activities={activities} />
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden space-y-6">
                {/* Friends List */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Your Study Friends
                  </h2>
                  {friends?.length === 0 ? (
                    <div className="morphic-card text-center py-12">
                      <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No friends yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add friends to start studying together!
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setIsAddFriendModalOpen(true)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Add Your First Friend
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {friends?.map((friend) => (
                        <FriendCard
                          key={friend?.id}
                          friend={friend}
                          onViewProgress={handleViewProgress}
                          onSendEncouragement={handleSendEncouragement}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Feed */}
                <div className="morphic-card">
                  <ActivityFeed activities={activities} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Time Filter */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Leaderboard
                </h2>
                <div className="w-64">
                  <TimeFilter
                    activeFilter={timeFilter}
                    onFilterChange={setTimeFilter}
                  />
                </div>
              </div>

              {/* Leaderboard */}
              <div className="morphic-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Icon name="Trophy" size={24} className="text-accent" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {timeFilter?.charAt(0)?.toUpperCase() + timeFilter?.slice(1)} Rankings
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Based on points earned this {timeFilter?.replace('ly', '')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  {leaderboardData?.map((user) => (
                    <LeaderboardItem
                      key={user?.id}
                      friend={user}
                      position={user?.position}
                      isCurrentUser={user?.id === currentUser?.id}
                    />
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="morphic-card text-center">
                  <Icon name="Users" size={32} className="text-accent mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">
                    {friends?.length + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
                <div className="morphic-card text-center">
                  <Icon name="TrendingUp" size={32} className="text-success mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">
                    #{leaderboardData?.find(u => u?.id === currentUser?.id)?.position || 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                </div>
                <div className="morphic-card text-center">
                  <Icon name="Star" size={32} className="text-warning mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-foreground">
                    {currentUser?.totalPoints?.toLocaleString()}
                  </h3>
                  <p className="text-sm text-muted-foreground">Your Points</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onAddFriend={handleAddFriend}
      />
    </div>
  );
};

export default FriendsLeaderboard;