import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/NotificationToast";
import FriendCard from "./components/FriendCard";
import LeaderboardItem from "./components/LeaderboardItem";
import AddFriendModal from "./components/AddFriendModal";
import TimeFilter from "./components/TimeFilter";
import ActivityFeed from "./components/ActivityFeed";
import BottomNavigation from "../../components/ui/BottomNavigation";

const FriendsLeaderboard = () => {
  const { user } = useAuth(); // authenticated user
  const [friends, setFriends] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToast, ToastContainer } = useToast();

  // Fetch Friends
  const fetchFriends = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("friendships")
        .select(`
          id,
          status,
          created_at,
          requester:requester_id(id, full_name, avatar_url, total_points),
          addressee:addressee_id(id, full_name, avatar_url, total_points)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the response to get friend data
      const friendsList = (data || []).map(friendship => ({
        ...friendship,
        friend: friendship?.requester?.id === user.id 
          ? friendship?.addressee 
          : friendship?.requester
      }));

      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
      addToast('Failed to load friends', 'error');
    }
  }, [user?.id, addToast]);

  // Fetch Activity Feed
  const fetchActivities = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Mock activities for now - replace with real data later
      const mockActivities = [
        {
          id: 1,
          user: { name: "Sarah Wilson", avatar: null },
          type: "task_completed",
          description: "completed their daily math practice",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
          points: 15
        },
        {
          id: 2,
          user: { name: "Mike Chen", avatar: null },
          type: "study_session",
          description: "finished a 2-hour study session",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          points: 25
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchFriends(), fetchActivities()])
        .finally(() => setLoading(false));
    }
  }, [fetchFriends, fetchActivities, user]);

  // Leaderboard (user + friends sorted by totalPoints)
  const leaderboardData = useMemo(() => {
    if (!user) return [];

    // Get friends data and add current user
    const friendsData = friends.map(f => f.friend).filter(Boolean);
    const currentUserData = {
      ...user,
      totalPoints: user?.total_points || 0,
      weeklyProgress: user?.weekly_progress || 0,
      name: user?.full_name || user?.name || user?.email,
      avatar: user?.avatar_url
    };

    // Combine current user with friends array
    const allUsers = [currentUserData, ...friendsData];

    // Sort descending based on totalPoints
    return allUsers
      .sort((a, b) => (b?.totalPoints || b?.total_points || 0) - (a?.totalPoints || a?.total_points || 0))
      .map((u, i) => ({ 
        ...u, 
        position: i + 1,
        totalPoints: u?.totalPoints || u?.total_points || 0,
        weeklyProgress: u?.weeklyProgress || u?.weekly_progress || 0
      }));
  }, [user, friends]);

  // Event Handlers
  const handleViewProgress = (friend) => {
    addToast(`Viewing ${friend?.name || friend?.email}'s progress`, "info");
  };

  const handleSendEncouragement = (friend) => {
    addToast(`Encouragement sent to ${friend?.name || friend?.email}!`, "success");
  };

  const handleAddFriend = (newFriend) => {
    // Optimistic update
    setFriends((prev) => [...prev, { friend: newFriend }]);
    addToast("Friend added!", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
      <ToastContainer />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-100 to-sky-200/90 backdrop-blur-sm border-b border-sky-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-sky-800">
              Friends & Leaderboard
            </h1>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddFriendModalOpen(true)}
              className="bg-pink-400 text-white hover:bg-pink-500 shadow-md"
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Add Friend
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-sky-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'friends'
                  ? 'bg-white text-sky-700 shadow-md'
                  : 'text-sky-600 hover:text-sky-800'
              }`}
            >
              <Icon name="Users" size={16} className="inline mr-2" />
              Friends ({friends?.length})
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-sky-700 shadow-md'
                  : 'text-sky-600 hover:text-sky-800'
              }`}
            >
              <Icon name="Trophy" size={16} className="inline mr-2" />
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6 pb-24">
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
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-semibold text-sky-700">Your Study Friends</h2>
                  {friends?.length === 0 ? (
                    <div className="bg-white border border-sky-200 shadow-sm rounded-xl text-center py-12">
                      <Icon name="Users" size={48} className="text-sky-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-sky-700 mb-2">No friends yet</h3>
                      <p className="text-sky-500 mb-4">
                        Add friends to start studying together and compete on the leaderboard!
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setIsAddFriendModalOpen(true)}
                        className="bg-pink-400 text-white hover:bg-pink-500"
                      >
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Add Your First Friend
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {friends?.map(friendship => (
                        <FriendCard
                          key={friendship?.id}
                          friend={friendship?.friend}
                          onViewProgress={handleViewProgress}
                          onSendEncouragement={handleSendEncouragement}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <ActivityFeed activities={activities} />
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-sky-700">Your Study Friends</h2>
                  {friends?.length === 0 ? (
                    <div className="bg-white border border-sky-200 rounded-xl shadow-sm text-center py-12">
                      <Icon name="Users" size={48} className="text-sky-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-sky-700 mb-2">No friends yet</h3>
                      <p className="text-sky-500 mb-4">Add friends to start studying together!</p>
                      <Button
                        variant="default"
                        onClick={() => setIsAddFriendModalOpen(true)}
                        className="bg-pink-400 text-white hover:bg-pink-500"
                      >
                        <Icon name="UserPlus" size={16} className="mr-2" />
                        Add Your First Friend
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {friends?.map(friendship => (
                        <FriendCard
                          key={friendship?.id}
                          friend={friendship?.friend}
                          onViewProgress={handleViewProgress}
                          onSendEncouragement={handleSendEncouragement}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-6">
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-sky-700">Leaderboard</h2>
                <div className="w-64">
                  <TimeFilter activeFilter={timeFilter} onFilterChange={setTimeFilter} />
                </div>
              </div>

              <div className="bg-white border border-sky-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6 border-b border-sky-200">
                  <div className="flex items-center gap-3">
                    <Icon name="Trophy" size={24} className="text-pink-500" />
                    <div>
                      <h3 className="font-semibold text-sky-700">
                        {timeFilter?.charAt(0)?.toUpperCase() + timeFilter?.slice(1)} Rankings
                      </h3>
                      <p className="text-sm text-sky-500">
                        Based on points earned this {timeFilter?.replace('ly', '')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  {leaderboardData?.map(userItem => (
                    <LeaderboardItem
                      key={userItem?.id}
                      friend={userItem}
                      position={userItem?.position}
                      isCurrentUser={userItem?.id === user?.id}
                      currentUser={user}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-sky-200 shadow-sm rounded-xl text-center p-4">
                  <Icon name="Users" size={32} className="text-pink-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-sky-700">{friends?.length + 1}</h3>
                  <p className="text-sm text-sky-500">Total Members</p>
                </div>
                <div className="bg-white border border-sky-200 shadow-sm rounded-xl text-center p-4">
                  <Icon name="TrendingUp" size={32} className="text-blue-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-sky-700">
                    #{leaderboardData?.find(u => u?.id === user?.id)?.position || 1}
                  </h3>
                  <p className="text-sm text-sky-500">Your Rank</p>
                </div>
                <div className="bg-white border border-sky-200 shadow-sm rounded-xl text-center p-4">
                  <Icon name="Star" size={32} className="text-pink-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-sky-700">
                    {(user?.total_points || 0).toLocaleString()}
                  </h3>
                  <p className="text-sm text-sky-500">Your Points</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onAddFriend={handleAddFriend}
      />

      <BottomNavigation />
    </div>
  );
};

export default FriendsLeaderboard;
