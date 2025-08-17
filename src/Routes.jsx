import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

import NotFound from "./pages/NotFound";
import LoginScreen from './pages/login-screen';
import DailyTasks from './pages/daily-tasks';
import MonthlyGoals from './pages/monthly-goals';
import StudyTimer from './pages/study-timer';
import UserProfile from './pages/user-profile';
import FriendsLeaderboard from './pages/friends-leaderboard';

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login-screen" replace />;

  return element;
};

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
