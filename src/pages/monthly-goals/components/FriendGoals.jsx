import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FriendGoals = ({ friendGoals, onCheerFriend }) => {
  const [expandedFriend, setExpandedFriend] = useState(null);

  const handleCheer = (friendId, goalId) => {
    onCheerFriend(friendId, goalId);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-accent';
    if (progress >= 25) return 'bg-warning';
    return 'bg-primary';
  };

  if (!friendGoals || friendGoals?.length === 0) {
    return (
      <div className="morphic-card text-center py-8">
        <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Friend Goals Yet
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Connect with friends to see their goals and cheer them on!
        </p>
        <Button variant="outline" size="sm">
          <Icon name="UserPlus" size={16} className="mr-2" />
          Invite Friends
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Friends' Goals
        </h3>
        <span className="text-sm text-muted-foreground">
          {friendGoals?.length} friend{friendGoals?.length !== 1 ? 's' : ''} sharing goals
        </span>
      </div>
      <div className="space-y-3">
        {friendGoals?.map((friend) => (
          <motion.div
            key={friend?.id}
            layout
            className="morphic-card"
          >
            {/* Friend Header */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedFriend(
                expandedFriend === friend?.id ? null : friend?.id
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-semibold">
                  {friend?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {friend?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {friend?.goals?.length} goal{friend?.goals?.length !== 1 ? 's' : ''} • {friend?.totalPoints} points
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {friend?.isOnline && (
                  <div className="w-2 h-2 bg-success rounded-full" />
                )}
                <Icon 
                  name={expandedFriend === friend?.id ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-muted-foreground"
                />
              </div>
            </div>

            {/* Expanded Goals */}
            <AnimatePresence>
              {expandedFriend === friend?.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 space-y-3"
                >
                  {friend?.goals?.map((goal) => (
                    <motion.div
                      key={goal?.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-surface rounded-lg p-4 border border-border"
                    >
                      {/* Goal Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon 
                              name={goal?.category === 'academic' ? 'BookOpen' : 
                                    goal?.category === 'personal' ? 'User' : 
                                    goal?.category === 'fitness' ? 'Dumbbell' : 'Target'} 
                              size={14} 
                              className="text-accent" 
                            />
                            <span className="text-xs font-medium text-accent uppercase tracking-wide">
                              {goal?.category}
                            </span>
                          </div>
                          <h5 className="font-medium text-foreground mb-1">
                            {goal?.title}
                          </h5>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {goal?.description}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCheer(friend?.id, goal?.id)}
                          className="ml-2 h-8 w-8 text-accent hover:text-accent hover:bg-accent/10"
                          aria-label="Cheer on friend"
                        >
                          <Icon name="Heart" size={16} />
                        </Button>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium text-accent">
                            {goal?.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <motion.div
                            className={`h-1.5 rounded-full ${getProgressColor(goal?.progress)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${goal?.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Deadline and Status */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Icon name="Calendar" size={12} />
                          <span>
                            Due {new Date(goal.deadline)?.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>

                        {goal?.progress === 100 && (
                          <div className="flex items-center gap-1 text-success">
                            <Icon name="CheckCircle" size={12} />
                            <span>Completed!</span>
                          </div>
                        )}
                      </div>

                      {/* Cheers Count */}
                      {goal?.cheers && goal?.cheers > 0 && (
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
                          <Icon name="Heart" size={12} className="text-accent" />
                          <span className="text-xs text-muted-foreground">
                            {goal?.cheers} cheer{goal?.cheers !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FriendGoals;