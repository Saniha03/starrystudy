import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

import NotFound from "./pages/NotFound";
import LoginScreen from './pages/login-screen';
import DailyTasks from './pages/daily-tasks';
import MonthlyGoals from './pages/monthly-goals';
import StudyTimer from './pages/study-timer';
import UserProfile from './pages/user-profile';
import FriendsLeaderboard from './pages/friends-leaderboard';

// -------------------- PrivateRoute --------------------
const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login-screen" replace />;

  return element;
};

// -------------------- Routes --------------------
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/login-screen" element={<LoginScreen />} />

          {/* Private Routes */}
          <Route path="/" element={<PrivateRoute element={<DailyTasks />} />} />
          <Route path="/daily-tasks" element={<PrivateRoute element={<DailyTasks />} />} />
          <Route path="/monthly-goals" element={<PrivateRoute element={<MonthlyGoals />} />} />
          <Route path="/study-timer" element={<PrivateRoute element={<StudyTimer />} />} />
          <Route path="/user-profile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/friends-leaderboard" element={<PrivateRoute element={<FriendsLeaderboard />} />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
