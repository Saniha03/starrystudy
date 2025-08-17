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
    <div className="min-h-screen bg-background">
      <ToastContainer />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Friends &amp; Leaderboard
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

          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition ${
                activeTab === "friends"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("friends")}
            >
              <Icon name="Users" size={16} className="inline mr-2" />
              Friends ({friends?.length})
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition ${
                activeTab === "leaderboard"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("leaderboard")}
            >
              <Icon name="Trophy" size={16} className="inline mr-2" />
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "friends" && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* FRIENDS LIST */}
              <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-lg font-semibold">Your Study Friends</h2>
                  {friends?.length === 0 ? (
                    <div className="morphic-card text-center py-12">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">
                        No friends yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Add friends to start studying together and stay motivated!
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
                      {friends.map((friend) => (
                        <FriendCard
                          key={friend.id}
                          friend={friend}
                          onViewProgress={handleViewProgress}
                          onSendEncouragement={handleSendEncouragement}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIVITY FEED */}
                <div className="space-y-4">
                  <ActivityFeed activities={activities} />
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Your Study Friends</h2>
                  {friends?.length === 0 ? (
                    <div className="morphic-card text-center py-12">
                      <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No friends yet</h3>
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
                      {friends.map((friend) => (
                        <FriendCard
                          key={friend.id}
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

          {/* LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Leaderboard</h2>
                <div className="w-64">
                  <TimeFilter activeFilter={timeFilter} onFilterChange={setTimeFilter} />
                </div>
              </div>

              <div className="morphic-card p-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Icon name="Trophy" size={24} className="text-accent" />
                    <div>
                      <h3 className="font-semibold">
                        {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Rankings
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Based on points earned this {timeFilter.replace("ly", "")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  {leaderboardData?.map((u) => (
                    <LeaderboardItem
                      key={u.id}
                      friend={u}
                      position={u.position}
                      isCurrentUser={u.id === user?.id}
                    />
                  ))}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="morphic-card text-center">
                  <Icon name="Users" size={32} className="text-accent mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">
                    {friends.length + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
                <div className="morphic-card text-center">
                  <Icon name="TrendingUp" size={32} className="text-success mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">
                    #{leaderboardData.find((u) => u.id === user?.id)?.position || 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                </div>
                <div className="morphic-card text-center">
                  <Icon name="Star" size={32} className="text-warning mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">
                    {(user?.totalPoints || 0).toLocaleString()}
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
