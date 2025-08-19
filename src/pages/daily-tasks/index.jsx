import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';
import { useToast } from '../../components/ui/NotificationToast';

import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import TaskFilters from './components/TaskFilters';
import DailyProgress from './components/DailyProgress';
import FriendActivity from './components/FriendActivity';

import { useAuth } from '../../contexts/AuthContext';
import { tasksService } from '../../services/tasksService';

const DailyTasks = () => {
  const { user, userProfile } = useAuth();
  const { addToast, ToastContainer } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all' });

  useEffect(() => {
    if (user?.id) loadTasks();
  }, [user?.id, filters.status, filters.priority]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getDailyTasks({
        userId: user?.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.priority !== 'all' && { priority: filters.priority })
      });
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      addToast(error?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await tasksService.createTask({
        ...taskData,
        user_id: user?.id,
        due_date: format(new Date(), 'yyyy-MM-dd')
      });
      setTasks([newTask, ...tasks]);
      setIsTaskModalOpen(false);
      addToast('Task created successfully! 🎯', 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      addToast(error?.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await tasksService.updateTask(taskId, updates);
      setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
      setSelectedTask(null);
      addToast('Task updated successfully! ✨', 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      addToast(error?.message || 'Failed to update task', 'error');
    }
  };

  const handleCompleteTask = async (taskId, duration = 0) => {
    try {
      const completedTask = await tasksService.completeTask(taskId, duration);
      setTasks(tasks.map(task => (task.id === taskId ? completedTask : task)));
      addToast('Great job! Task completed! 🌟', 'success');
    } catch (error) {
      console.error('Error completing task:', error);
      addToast(error?.message || 'Failed to complete task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      addToast('Task deleted', 'info');
    } catch (error) {
      console.error('Error deleting task:', error);
      addToast(error?.message || 'Failed to delete task', 'error');
    }
  };

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

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Daily Tasks</h1>
            <p className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <DailyProgress
          completedTasks={completedTasks.length}
          totalTasks={tasks.length}
          completionRate={completionRate}
          pointsEarned={completedTasks.length * 10}
          streak={userProfile?.streak || 0}
          userProfile={userProfile}
        />

        <TaskFilters
          activeFilter={filters.status}
          onFilterChange={(status) => setFilters({ ...filters, status })}
          activeSortBy={filters.priority}
          onSortChange={(priority) => setFilters({ ...filters, priority })}
          taskCounts={{
            all: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            completed: completedTasks.length,
            high: tasks.filter(t => t.priority === 'high').length,
            medium: tasks.filter(t => t.priority === 'medium').length,
            low: tasks.filter(t => t.priority === 'low').length
          }}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Icon name="Loader" size={32} className="animate-spin text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <Icon name="CheckCircle" size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-6">Start your productive day by adding your first task!</p>
              <Button onClick={() => setIsTaskModalOpen(true)} iconName="Plus" className="bg-accent hover:bg-accent/90">Create Your First Task</Button>
            </motion.div>
          ) : (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleCompleteTask}
                onEdit={(task) => {
                  setSelectedTask(task);
                  setIsTaskModalOpen(true);
                }}
                onDelete={handleDeleteTask}
                index={index}
              />
            ))
          )}
        </div>

        <FriendActivity userId={user.id} activities={[]} />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={selectedTask ? (data) => handleUpdateTask(selectedTask.id, data) : handleCreateTask}
        editingTask={selectedTask}
      />

      <BottomNavigation />
      <ToastContainer />
    </div>
  );
};

export default DailyTasks;
