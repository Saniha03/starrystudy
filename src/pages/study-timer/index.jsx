import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ui/NotificationToast';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import TaskSelector from './components/TaskSelector';
import SessionNotes from './components/SessionNotes';
import ManualTimeEntry from './components/ManualTimeEntry';
import SessionHistory from './components/SessionHistory';
import BreakReminder from './components/BreakReminder';
import CompletionCelebration from './components/CompletionCelebration';
import Icon from '../../components/AppIcon';

const StudyTimer = () => {
  // Timer state
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Session state
  const [selectedTask, setSelectedTask] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionCategory, setSessionCategory] = useState('');
  const [sessions, setSessions] = useState([]);

  // UI state
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastSessionData, setLastSessionData] = useState({});
  const [showHistory, setShowHistory] = useState(false);

  const intervalRef = useRef(null);
  const { addToast, ToastContainer } = useToast();

  // Mock tasks data
  const mockTasks = [
    {
      id: '1',
      title: 'Complete Mathematics Assignment',
      category: 'Mathematics',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Read Chapter 5 - Physics',
      category: 'Science',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Practice JavaScript Algorithms',
      category: 'Programming',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Review History Notes',
      category: 'History',
      priority: 'low'
    },
    {
      id: '5',
      title: 'Prepare for English Literature Exam',
      category: 'Literature',
      priority: 'high'
    }
  ];

  // Mock session history
  const mockSessionHistory = [
    {
      id: '1',
      duration: 1800, // 30 minutes
      category: 'Mathematics',
      notes: 'Worked on calculus problems',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(), // 1 hour ago
      pointsEarned: 30
    },
    {
      id: '2',
      duration: 2700, // 45 minutes
      category: 'Programming',
      notes: 'JavaScript practice session',
      timestamp: new Date(Date.now() - 7200000)?.toISOString(), // 2 hours ago
      pointsEarned: 45
    },
    {
      id: '3',
      duration: 1200, // 20 minutes
      category: 'Science',
      notes: 'Physics chapter review',
      timestamp: new Date(Date.now() - 10800000)?.toISOString(), // 3 hours ago
      pointsEarned: 20
    }
  ];

  useEffect(() => {
    setSessions(mockSessionHistory);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef?.current);
    }

    return () => clearInterval(intervalRef?.current);
  }, [isActive, isPaused]);

  // Break reminder logic
  useEffect(() => {
    if (isActive && !isPaused && time > 0 && time % 1500 === 0) { // Every 25 minutes
      setShowBreakReminder(true);
    }
  }, [time, isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (!startTime) {
      setStartTime(new Date()?.toISOString());
    }
    addToast('Timer started! Focus on your studies 🎯', 'success');
  };

  const handlePause = () => {
    setIsPaused(true);
    addToast('Timer paused. Take a moment to recharge ⏸️', 'info');
  };

  const handleStop = () => {
    if (time > 60) { // Only save sessions longer than 1 minute
      const sessionData = {
        id: Date.now()?.toString(),
        duration: time,
        category: sessionCategory || 'General Study',
        notes: sessionNotes,
        timestamp: new Date()?.toISOString(),
        taskId: selectedTask,
        pointsEarned: Math.floor(time / 60) // 1 point per minute
      };

      setSessions(prev => [sessionData, ...prev]);
      setLastSessionData(sessionData);
      setShowCelebration(true);
    }

    // Reset timer
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
    setSessionNotes('');
    setSessionCategory('');
    setSelectedTask('');
  };

  const handleReset = () => {
    setTime(0);
    setStartTime(null);
    setSessionNotes('');
    setSessionCategory('');
    setSelectedTask('');
    addToast('Timer reset successfully', 'info');
  };

  const handleManualSubmit = (manualData) => {
    const sessionData = {
      id: Date.now()?.toString(),
      duration: manualData?.duration,
      category: manualData?.category || 'General Study',
      notes: manualData?.notes,
      timestamp: manualData?.timestamp,
      pointsEarned: Math.floor(manualData?.duration / 60),
      isManual: true
    };

    setSessions(prev => [sessionData, ...prev]);
    setLastSessionData(sessionData);
    setShowCelebration(true);
    
    addToast('Study time logged successfully! 📚', 'success');
  };

  const handleTakeBreak = () => {
    setShowBreakReminder(false);
    setIsPaused(true);
    addToast('Break time! You deserve it ☕', 'info');
    
    // Auto-resume after 5 minutes (for demo, we'll just show a toast)
    setTimeout(() => {
      addToast('Break time is over. Ready to continue? 🚀', 'info');
    }, 5000);
  };

  const handleContinueStudying = () => {
    setShowBreakReminder(false);
    addToast('Great dedication! Keep up the excellent work 💪', 'success');
  };

  const calculateProgress = () => {
    if (!startTime || time === 0) return 0;
    // Progress based on 25-minute intervals (Pomodoro technique)
    const targetTime = 1500; // 25 minutes
    return Math.min((time % targetTime) / targetTime, 1);
  };

  const getTodayStats = () => {
    const today = new Date()?.toDateString();
    const todaySessions = sessions?.filter(session => 
      new Date(session.timestamp)?.toDateString() === today
    );
    
    const totalTime = todaySessions?.reduce((sum, session) => sum + session?.duration, 0);
    const totalPoints = todaySessions?.reduce((sum, session) => sum + session?.pointsEarned, 0);
    
    return {
      sessions: todaySessions?.length,
      totalTime,
      totalPoints
    };
  };

  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Study Timer
          </h1>
          <p className="text-muted-foreground">
            Track your study time and stay focused on your goals
          </p>
        </motion.div>

        {/* Today's Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="morphic-card text-center p-4">
            <div className="text-2xl font-bold text-accent mb-1">
              {todayStats?.sessions}
            </div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="morphic-card text-center p-4">
            <div className="text-2xl font-bold text-success mb-1">
              {Math.floor(todayStats?.totalTime / 60)}m
            </div>
            <div className="text-xs text-muted-foreground">Study Time</div>
          </div>
          <div className="morphic-card text-center p-4">
            <div className="text-2xl font-bold text-primary mb-1">
              {todayStats?.totalPoints}
            </div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="morphic-card text-center"
            >
              <TimerDisplay
                time={time}
                isActive={isActive && !isPaused}
                progress={calculateProgress()}
              />
              
              <TimerControls
                isActive={isActive}
                isPaused={isPaused}
                onStart={handleStart}
                onPause={handlePause}
                onStop={handleStop}
                onReset={handleReset}
              />
            </motion.div>

            {/* Task Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TaskSelector
                selectedTask={selectedTask}
                onTaskChange={setSelectedTask}
                tasks={mockTasks}
              />
            </motion.div>

            {/* Session Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SessionNotes
                notes={sessionNotes}
                onNotesChange={setSessionNotes}
                category={sessionCategory}
                onCategoryChange={setSessionCategory}
              />
            </motion.div>

            {/* Manual Time Entry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ManualTimeEntry
                onManualSubmit={handleManualSubmit}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session History Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="morphic-card"
            >
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Icon name="BarChart3" size={20} className="text-success" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-foreground">
                      Study Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      View your progress
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: showHistory ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
                </motion.div>
              </button>
            </motion.div>

            {/* Session History */}
            <SessionHistory
              sessions={sessions}
              isVisible={showHistory}
            />

            {/* Study Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="morphic-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Icon name="Lightbulb" size={20} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Study Tips
                </h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>🍅 Try the Pomodoro Technique: 25 minutes focused study, 5 minute break</p>
                <p>🎯 Set specific goals for each study session</p>
                <p>📱 Keep your phone in another room to avoid distractions</p>
                <p>💧 Stay hydrated and take regular breaks</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <BreakReminder
        isVisible={showBreakReminder}
        onTakeBreak={handleTakeBreak}
        onContinue={handleContinueStudying}
        studyDuration={time}
      />
      <CompletionCelebration
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        sessionData={lastSessionData}
        pointsEarned={lastSessionData?.pointsEarned || 0}
      />
      <ToastContainer />
    </div>
  );
};

export default StudyTimer;