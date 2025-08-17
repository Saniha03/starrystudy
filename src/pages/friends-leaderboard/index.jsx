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

const FriendsLeaderboard = () => {
  const { user } = useAuth(); // <-- authenticated user
  const [friends, setFriends] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const { addToast, ToastContainer } = useToast();

  // ---------------------------------------------------
  // Fetch Friends
  // ---------------------------------------------------
  const fetchFriends = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .eq("owner_id", user.id);

    if (!error) setFriends(data || []);
  }, [user]);

  // ---------------------------------------------------
  // Fetch Activity Feed
  // ---------------------------------------------------
  const fetchActivities = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.id);

    if (!error) setActivities(data || []);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchFriends();
    fetchActivities();
  }, [fetchFriends, fetchActivities]);

  // ---------------------------------------------------
  // Leaderboard (user + friends sorted by totalPoints)
  // ---------------------------------------------------
  const leaderboardData = useMemo(() => {
    // Combine current user with friends array
    const all = [{ ...user, totalPoints: user?.totalPoints || 0 }, ...friends];

    // Sort descending based on totalPoints
    return all
      .sort((a, b) => (b?.totalPoints || 0) - (a?.totalPoints || 0))
      .map((u, i) => ({ ...u, position: i + 1 }));
  }, [user, friends]);

  // ---------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------
  const handleViewProgress = (friend) => {
    addToast(`Viewing ${friend?.name || friend?.email}'s progress`, "info");
  };

  const handleSendEncouragement = (friend) => {
    addToast(`Encouragement sent to ${friend?.name || friend?.email}!`, "friend");
  };

  const handleAddFriend = (newFriend) => {
    // optimistic update
    setFriends((prev) => [...prev, newFriend]);
    addToast("Friend added!", "success");
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
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
      <div className="max-w-5xl mx-auto px-6 py-6 bottom-nav-safe">
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
                    <div className="morphic-card text-center py-12 bg-white border border-sky-200 shadow-sm rounded-xl">
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
                      {friends?.map(friend => (
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

                <div className="space-y-4">
                  <ActivityFeed activities={activities} />
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-sky-700">Your Study Friends</h2>
                  {friends?.length === 0 ? (
                    <div className="morphic-card text-center py-12 bg-white border border-sky-200 rounded-xl shadow-sm">
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
                      {friends?.map(friend => (
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-sky-700">Leaderboard</h2>
                <div className="w-64">
                  <TimeFilter activeFilter={timeFilter} onFilterChange={setTimeFilter} />
                </div>
              </div>

              <div className="morphic-card p-0 overflow-hidden bg-white border border-sky-200 shadow-sm rounded-xl">
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
                  {leaderboardData?.map(user => (
                    <LeaderboardItem
                      key={user?.id}
                      friend={user}
                      position={user?.position}
                      isCurrentUser={user?.id === currentUser?.id}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="morphic-card text-center bg-white border border-sky-200 shadow-sm rounded-xl">
                  <Icon name="Users" size={32} className="text-pink-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-sky-700">{friends?.length + 1}</h3>
                  <p className="text-sm text-sky-500">Total Members</p>
                </div>
                <div className="morphic-card text-center bg-white border border-sky-200 shadow-sm rounded-xl">
                  <Icon name="TrendingUp" size={32} className="text-azure-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-sky-700">
                    #{leaderboardData?.find(u => u?.id === currentUser?.id)?.position || 1}
                  </h3>
                  <p className="text-sm text-sky-500">Your Rank</p>
                </div>
                <div className="morphic-card text-center bg-white border border-sky-200 shadow-sm rounded-xl">
                  <Icon name="Star" size={32} className="text-pink-400 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-sky-700">
                    {currentUser?.totalPoints?.toLocaleString()}
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
    </div>
  );
};

export default FriendsLeaderboard;
