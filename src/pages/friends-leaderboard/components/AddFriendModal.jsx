import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/NotificationToast';
import { useAuth } from '../../../contexts/AuthContext';

const AddFriendModal = ({ isOpen, onClose, onAddFriend }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();

  const handleAddByEmail = async () => {
    if (!email?.trim()) {
      addToast("Please enter an email address", "error");
      return;
    }
    
    if (!email.includes('@')) {
      addToast("Please enter a valid email", "error");
      return;
    }
    
    if (email === currentUser?.email) {
      addToast("You cannot add yourself", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      // Find user by email
      const { data: targetUser, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !targetUser) {
        addToast("User not found", "error");
        setIsLoading(false);
        return;
      }

      // Check if friendship already exists
      const { data: existing, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(requester_id.eq.${currentUser.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (friendshipError) {
        console.error('Error checking existing friendship:', friendshipError);
      }

      if (existing) {
        addToast("You are already connected or have a pending request", "error");
        setIsLoading(false);
        return;
      }

      // Create friend request
      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          requester_id: currentUser.id,
          addressee_id: targetUser.id,
          status: 'pending'
        });

      if (insertError) {
        throw insertError;
      }

      addToast("Friend request sent", "success");
      onAddFriend && onAddFriend(targetUser);
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Error adding friend:', error);
      addToast("Failed to send friend request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddByCode = async () => {
    if (!friendCode?.trim()) {
      addToast("Please enter a friend code", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      // Find user by friend code
      const { data: targetUser, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('friend_code', friendCode.toUpperCase())
        .single();

      if (userError || !targetUser) {
        addToast("Invalid friend code", "error");
        setIsLoading(false);
        return;
      }

      if (targetUser.id === currentUser.id) {
        addToast("You cannot add yourself", "error");
        setIsLoading(false);
        return;
      }

      // Check if friendship already exists
      const { data: existing, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(requester_id.eq.${currentUser.id},addressee_id.eq.${targetUser.id}),and(requester_id.eq.${targetUser.id},addressee_id.eq.${currentUser.id})`)
        .maybeSingle();

      if (friendshipError) {
        console.error('Error checking existing friendship:', friendshipError);
      }

      if (existing) {
        addToast("You are already connected or have a pending request", "error");
        setIsLoading(false);
        return;
      }

      // Create friend request
      const { error: insertError } = await supabase
        .from('friendships')
        .insert({
          requester_id: currentUser.id,
          addressee_id: targetUser.id,
          status: 'pending'
        });

      if (insertError) {
        throw insertError;
      }

      addToast("Friend request sent!", "success");
      onAddFriend && onAddFriend(targetUser);
      setFriendCode('');
      onClose();
    } catch (error) {
      console.error('Error adding friend:', error);
      addToast("Failed to send friend request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyMyCode = async () => {
    if (!currentUser?.friend_code) {
      addToast("Friend code not available", "error");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(currentUser.friend_code);
      addToast("Friend code copied to clipboard!", "success");
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      addToast("Failed to copy friend code", "error");
    }
  };

  const resetForm = () => {
    setEmail('');
    setFriendCode('');
    setActiveTab('email');
    setIsLoading(false);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        onClose();
        resetForm();
      }} 
      title="Add Friend" 
      size="default"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('email')} 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'email' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon name="Mail" size={16} className="inline mr-2" />
            By Email
          </button>
          <button 
            onClick={() => setActiveTab('code')} 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'code' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon name="Hash" size={16} className="inline mr-2" />
            Friend Code
          </button>
        </div>

        {activeTab === 'email' && (
          <div className="space-y-4">
            <Input 
              label="Friend's Email" 
              type="email"
              placeholder="Enter email address"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              fullWidth 
              loading={isLoading} 
              onClick={handleAddByEmail}
              disabled={!email.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Send Invitation
            </Button>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <Input 
              label="Friend Code" 
              placeholder="Enter friend code"
              value={friendCode} 
              onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
              disabled={isLoading}
            />
            <Button 
              fullWidth 
              loading={isLoading} 
              onClick={handleAddByCode}
              disabled={!friendCode.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Add Friend
            </Button>
          </div>
        )}

        {/* My friend code section */}
        {currentUser?.friend_code && (
          <div className="border-t border-gray-200 pt-4 text-center space-y-2">
            <p className="text-sm text-gray-600">Your Friend Code:</p>
            <div className="font-mono text-lg text-gray-900 tracking-widest bg-gray-50 py-2 px-4 rounded">
              {currentUser.friend_code}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyMyCode}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Icon name="Copy" size={14} className="mr-2" />
              Copy My Code
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddFriendModal;
