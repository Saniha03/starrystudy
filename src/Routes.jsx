import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginScreen from './pages/login-screen';
import DailyTasks from './pages/daily-tasks';
import MonthlyGoals from './pages/monthly-goals';
import StudyTimer from './pages/study-timer';
import UserProfile from './pages/user-profile';
import FriendsLeaderboard from './pages/friends-leaderboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DailyTasks />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/daily-tasks" element={<DailyTasks />} />
        <Route path="/monthly-goals" element={<MonthlyGoals />} />
        <Route path="/study-timer" element={<StudyTimer />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/friends-leaderboard" element={<FriendsLeaderboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
