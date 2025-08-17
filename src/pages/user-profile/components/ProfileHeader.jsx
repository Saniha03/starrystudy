import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = ({ user, onEditProfile }) => {
  return (
    <div className="morphic-card mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-accent/20">
            <Image
              src={user?.avatar}
              alt={`${user?.name}'s profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2">
            <Icon name="Star" size={16} className="text-accent-foreground fill-current" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">{user?.name}</h1>
            <span className="text-sm text-muted-foreground">@{user?.username}</span>
          </div>
          
          <p className="text-muted-foreground mb-4">{user?.bio}</p>
          
          {/* Stats Row */}
          <div className="flex justify-center sm:justify-start gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{user?.totalPoints?.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{user?.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{user?.rank}</div>
              <div className="text-xs text-muted-foreground">Global Rank</div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={onEditProfile}
            className="breathing-button bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <Icon name="Edit" size={16} className="inline mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;