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
    if (!email?.trim()) return addToast("Please enter an email address", "error");
    if (!email.includes('@')) return addToast("Please enter a valid email", "error");
    if (email === currentUser?.email) return addToast("You cannot add yourself", "error");

    setIsLoading(true);
    const { data: targetUser, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();
    if (!targetUser || error) {
      addToast("User not found", "error"); setIsLoading(false); return;
    }

    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${currentUser.id},addressee_id.eq.${currentUser.id}`)
      .eq('addressee_id', targetUser.id)
      .maybeSingle();
    if (existing) {
      addToast("You are already connected (or pending)","error");
      setIsLoading(false); return;
    }

    await supabase.from('friendships').insert({
      requester_id: currentUser.id,
      addressee_id: targetUser.id,
      status: 'pending'
    });
    addToast("Friend request sent", "success");
    onAddFriend && onAddFriend(targetUser);
    setIsLoading(false);
    setEmail('');
    onClose();
  };

  const handleAddByCode = async () => {
    if (!friendCode?.trim()) return addToast("Please enter a friend code", "error");
    setIsLoading(true);

    const { data: targetUser, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('friend_code', friendCode)
      .single();
    if (!targetUser || error) {
      addToast("Invalid friend code","error");
      setIsLoading(false); return;
    }
    if (targetUser.id === currentUser.id) {
      addToast("You cannot add yourself","error");
      setIsLoading(false); return;
    }

    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${currentUser.id},addressee_id.eq.${currentUser.id}`)
      .eq('addressee_id', targetUser.id)
      .maybeSingle();
    if (existing) {
      addToast("You are already connected (or pending)","error");
      setIsLoading(false); return;
    }

    await supabase.from('friendships').insert({
      requester_id: currentUser.id,
      addressee_id: targetUser.id,
      status: 'pending'
    });
    addToast("Friend added!", "success");
    onAddFriend && onAddFriend(targetUser);
    setIsLoading(false);
    setFriendCode('');
    onClose();
  };

  const copyMyCode = async () => {
    if (!currentUser?.friend_code) return;
    await navigator.clipboard.writeText(currentUser.friend_code);
    addToast("Friend code copied to clipboard!", "success");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Friend" size="default">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button onClick={() => setActiveTab('email')} className={`flex-1 py-2 px-4 rounded-md text-sm ${activeTab==='email' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}>
            <Icon name="Mail" size={16} className="mr-2" />By Email
          </button>
          <button onClick={() => setActiveTab('code')} className={`flex-1 py-2 px-4 rounded-md text-sm ${activeTab==='code' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}>
            <Icon name="Hash" size={16} className="mr-2" />Friend Code
          </button>
        </div>

        {activeTab === 'email' && (
          <div className="space-y-4">
            <Input label="Friend's Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <Button fullWidth loading={isLoading} onClick={handleAddByEmail}>
              <Icon name="UserPlus" className="mr-2"/>Send Invitation
            </Button>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <Input label="Friend Code" value={friendCode} onChange={(e)=>setFriendCode(e.target.value.toUpperCase())}/>
            <Button fullWidth loading={isLoading} onClick={handleAddByCode}>
              <Icon name="UserPlus" className="mr-2"/>Add Friend
            </Button>
          </div>
        )}

        {/* My friend code / copy */}
        {currentUser?.friend_code && (
          <div className="border-t border-border pt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your Friend Code:</p>
            <div className="font-mono text-lg text-foreground tracking-widest">
              {currentUser.friend_code}
            </div>
            <Button variant="outline" size="sm" onClick={copyMyCode}>
              <Icon name="Copy" size={14} className="mr-2"/> Copy My Code
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddFriendModal;
