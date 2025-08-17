import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth } from 'date-fns';
import { useToast } from '../../components/ui/NotificationToast';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';
import GoalCard from './components/GoalCard';
import AddGoalModal from './components/AddGoalModal';
import CelebrationModal from './components/CelebrationModal';
import GoalFilters from './components/GoalFilters';
import MonthlyProgress from './components/MonthlyProgress';
import FriendGoals from './components/FriendGoals';
import { useAuth } from '../../contexts/AuthContext';
import { goalsService } from '../../services/goalsService';

const MonthlyGoals = () => {
  const { user, userProfile } = useAuth();
  const { addToast, ToastContainer } = useToast();
  
  // State management
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('grid');
  const [editingGoal, setEditingGoal] = useState(null);
  const [celebrationGoal, setCelebrationGoal] = useState(null);
  const [friendGoals, setFriendGoals] = useState([]);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user, filters]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const currentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const data = await goalsService.getMonthlyGoals({
        userId: user?.id,
        month: currentMonth,
        ...(filters.status !== 'all' && { status: filters.status })
      });
      setGoals(data);
    } catch (error) {
      addToast(error?.message || 'Failed to load goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await goalsService.createGoal({
        ...goalData,
        user_id: user?.id,
        target_month: format(startOfMonth(new Date()), 'yyyy-MM-dd')
      });
      setGoals([newGoal, ...goals]);
      setIsAddModalOpen(false);
      addToast('Goal created successfully! 🎯', 'success');
    } catch (error) {
      addToast(error?.message || 'Failed to create goal', 'error');
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      const updatedGoal = await goalsService.updateGoal(goalId, updates);
      setGoals(goals.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      ));
      
      // Check if goal was just completed
      if (updates.status === 'completed' && updatedGoal.status === 'completed') {
        setSelectedGoal(updatedGoal);
        setIsCelebrationOpen(true);
      }
      
      addToast('Goal updated successfully! ✨', 'success');
    } catch (error) {
      addToast(error?.message || 'Failed to update goal', 'error');
    }
  };

  const handleUpdateProgress = async (goalId, progress) => {
    try {
      const updatedGoal = await goalsService.updateGoalProgress(goalId, progress);
      setGoals(goals.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      ));
      
      // Check if goal was completed with this progress update
      if (progress >= updatedGoal.target_value && updatedGoal.status !== 'completed') {
        const completedGoal = await goalsService.updateGoal(goalId, { 
          status: 'completed',
          completed_at: new Date().toISOString()
        });
        setGoals(goals.map(goal => 
          goal.id === goalId ? completedGoal : goal
        ));
        setSelectedGoal(completedGoal);
        setIsCelebrationOpen(true);
      }
      
      addToast('Progress updated! 📈', 'success');
    } catch (error) {
      addToast(error?.message || 'Failed to update progress', 'error');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await goalsService.deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      addToast('Goal deleted', 'info');
    } catch (error) {
      addToast(error?.message || 'Failed to delete goal', 'error');
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

  // Filter and sort goals
  const getFilteredGoals = () => {
    let filtered = goals;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(goal =>
        goal?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        goal?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        goal?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply status filter
    switch (activeFilter) {
      case 'active':
        filtered = filtered?.filter(goal => goal?.progress > 0 && goal?.progress < 100);
        break;
      case 'completed':
        filtered = filtered?.filter(goal => goal?.progress === 100);
        break;
      case 'overdue':
        filtered = filtered?.filter(goal => {
          const deadline = new Date(goal.deadline);
          const today = new Date();
          return deadline < today && goal?.progress < 100;
        });
        break;
      case 'urgent':
        filtered = filtered?.filter(goal => {
          const deadline = new Date(goal.deadline);
          const today = new Date();
          const diffTime = deadline - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && diffDays >= 0 && goal?.progress < 100;
        });
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'deadline':
        filtered?.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case 'progress':
        filtered?.sort((a, b) => b?.progress - a?.progress);
        break;
      case 'created':
        filtered?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'alphabetical':
        filtered?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Goal management functions
  const handleSaveGoal = (goalData) => {
    if (editingGoal) {
      setGoals(prev => prev?.map(goal => 
        goal?.id === goalData?.id ? goalData : goal
      ));
      addToast("Goal updated successfully!", "success");
      setEditingGoal(null);
    } else {
      setGoals(prev => [...prev, goalData]);
      addToast("New goal created!", "success");
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsAddModalOpen(true);
  };

  const handleTogglePrivacy = (goalId) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === goalId 
        ? { ...goal, isPrivate: !goal?.isPrivate }
        : goal
    ));
    
    const goal = goals?.find(g => g?.id === goalId);
    addToast(
      `Goal is now ${goal?.isPrivate ? 'public' : 'private'}`, 
      "info"
    );
  };

  const handleCelebrate = (goalId) => {
    const goal = goals?.find(g => g?.id === goalId);
    if (goal && goal?.progress === 100 && !goal?.celebrated) {
      setGoals(prev => prev?.map(g => 
        g?.id === goalId ? { ...g, celebrated: true } : g
      ));
      setCelebrationGoal(goal);
    }
  };

  const handleShareAchievement = (goal) => {
    addToast("Achievement shared with friends!", "success");
  };

  const handleCheerFriend = (friendId, goalId) => {
    setFriendGoals(prev => prev?.map(friend => 
      friend?.id === friendId 
        ? {
            ...friend,
            goals: friend?.goals?.map(goal => 
              goal?.id === goalId 
                ? { ...goal, cheers: (goal?.cheers || 0) + 1 }
                : goal
            )
          }
        : friend
    ));
    
    const friend = friendGoals?.find(f => f?.id === friendId);
    addToast(`You cheered on ${friend?.name}!`, "friend");
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingGoal(null);
  };

  const filteredGoals = getFilteredGoals();
  const completedGoals = goals?.filter(goal => goal?.status === 'completed') || [];
  const totalProgress = goals?.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;
  const currentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Monthly Goals</h1>
              <p className="text-sm text-muted-foreground">
                {format(new Date(), 'MMMM yyyy')}
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              iconName="Target"
              className="bg-accent hover:bg-accent/90"
            >
              Add Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Monthly Progress Overview */}
        <MonthlyProgress 
          goals={goals}
          completedGoals={completedGoals.length}
          totalProgress={totalProgress}
          userProfile={userProfile}
          currentMonth={currentMonth}
        />

        {/* Goal Filters */}
        <GoalFilters 
          filters={filters}
          onFiltersChange={setFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Goals List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Icon name="Loader" size={32} className="animate-spin text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
          ) : goals?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Icon name="Target" size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Set your first monthly goal and start achieving greatness!
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                iconName="Target"
                className="bg-accent hover:bg-accent/90"
              >
                Create Your First Goal
              </Button>
            </motion.div>
          ) : (
            goals?.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onUpdate={handleUpdateGoal}
                onDelete={handleDeleteGoal}
                onEdit={handleEditGoal}
                onTogglePrivacy={handleTogglePrivacy}
                onCelebrate={handleCelebrate}
                index={index}
              />
            ))
          )}
        </div>

        {/* Friends Goals */}
        <FriendGoals 
          userId={user?.id} 
          friendGoals={friendGoals}
          onCheerFriend={handleCheerFriend}
        />
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateGoal}
      />

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => {
          setIsCelebrationOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onShare={handleShareAchievement}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default MonthlyGoals;