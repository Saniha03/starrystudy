import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const SessionHistory = ({ sessions = [], isVisible = false }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTotalTime = () => {
    const total = sessions?.reduce((sum, session) => sum + session?.duration, 0);
    return formatDuration(total);
  };

  const todaySessions = sessions?.filter(session => {
    const sessionDate = new Date(session.timestamp)?.toDateString();
    const today = new Date()?.toDateString();
    return sessionDate === today;
  });

  if (!isVisible || todaySessions?.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="morphic-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <Icon name="History" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Today's Sessions
            </h3>
            <p className="text-sm text-muted-foreground">
              Total: {getTotalTime()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-accent">
            {todaySessions?.length}
          </span>
          <p className="text-xs text-muted-foreground">sessions</p>
        </div>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {todaySessions?.map((session, index) => (
          <motion.div
            key={session?.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {session?.category || 'Study Session'}
                </p>
                {session?.notes && (
                  <p className="text-xs text-muted-foreground truncate max-w-40">
                    {session?.notes}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {formatDuration(session?.duration)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(session?.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionHistory;