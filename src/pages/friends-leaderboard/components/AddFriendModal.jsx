import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/NotificationToast';

const AddFriendModal = ({ isOpen, onClose, onAddFriend }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleAddByEmail = async () => {
    if (!email?.trim()) {
      addToast('Please enter an email address', 'error');
      return;
    }

    if (!email?.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newFriend = {
        id: Date.now(),
        name: email?.split('@')?.[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase()),
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        status: 'offline',
        totalPoints: Math.floor(Math.random() * 5000) + 1000,
        weeklyProgress: Math.floor(Math.random() * 500) + 50,
        lastActivity: 'Just joined',
        trend: 'up'
      };

      onAddFriend(newFriend);
      addToast(`Friend request sent to ${email}`, 'success');
      setEmail('');
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleAddByCode = async () => {
    if (!friendCode?.trim()) {
      addToast('Please enter a friend code', 'error');
      return;
    }

    if (friendCode?.length < 6) {
      addToast('Friend code must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newFriend = {
        id: Date.now(),
        name: `User${friendCode?.slice(-4)}`,
        email: `user${friendCode?.slice(-4)}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendCode}`,
        status: 'online',
        totalPoints: Math.floor(Math.random() * 8000) + 2000,
        weeklyProgress: Math.floor(Math.random() * 800) + 100,
        lastActivity: '2 hours ago',
        trend: 'up'
      };

      onAddFriend(newFriend);
      addToast('Friend added successfully!', 'success');
      setFriendCode('');
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const generateFriendCode = () => {
    const code = Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase();
    navigator.clipboard?.writeText(code);
    addToast('Your friend code copied to clipboard!', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Friend"
      size="default"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'email' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Mail" size={16} className="inline mr-2" />
            By Email
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'code' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Hash" size={16} className="inline mr-2" />
            Friend Code
          </button>
        </div>

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <Input
              label="Friend's Email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              description="We'll send them an invitation to join your study group"
            />
            <Button
              variant="default"
              fullWidth
              loading={isLoading}
              onClick={handleAddByEmail}
              disabled={!email?.trim()}
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Send Invitation
            </Button>
          </div>
        )}

        {/* Friend Code Tab */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <Input
              label="Friend Code"
              type="text"
              placeholder="Enter 6-digit friend code"
              value={friendCode}
              onChange={(e) => setFriendCode(e?.target?.value?.toUpperCase())}
              description="Ask your friend for their unique friend code"
            />
            <Button
              variant="default"
              fullWidth
              loading={isLoading}
              onClick={handleAddByCode}
              disabled={!friendCode?.trim()}
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Add Friend
            </Button>

            {/* Generate Friend Code */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Share your friend code with others:
              </p>
              <Button
                variant="outline"
                fullWidth
                onClick={generateFriendCode}
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Generate & Copy My Code
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddFriendModal;