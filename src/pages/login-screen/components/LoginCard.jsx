import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/NotificationToast';
import { useAuth } from '../../../contexts/AuthContext';

const LoginCard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      addToast("Welcome to StarryStudy! 🌟", "success");
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        addToast('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.', 'error');
        return;
      }
      addToast(error?.message || "Authentication failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="morphic-card text-center slide-in">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm">
            Sign in to continue your study journey with friends
          </p>
        </div>

        {/* Google Sign In Button */}
        <Button
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          onClick={handleGoogleSignIn}
          className="mb-6 bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
          iconName="Chrome"
          iconPosition="left"
          iconSize={20}
        >
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </Button>

        {/* Benefits Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icon name="Users" size={16} className="text-accent flex-shrink-0" />
            <span>Study with friends and stay motivated</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icon name="Target" size={16} className="text-accent flex-shrink-0" />
            <span>Track goals and earn achievement points</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icon name="Timer" size={16} className="text-accent flex-shrink-0" />
            <span>Built-in study timers and progress tracking</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} className="text-success" />
          <span>Secure Google Authentication</span>
        </div>
      </div>
      {/* Footer Links */}
      <div className="mt-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <button className="hover:text-accent transition-colors">
            Privacy Policy
          </button>
          <span>•</span>
          <button className="hover:text-accent transition-colors">
            Terms of Service
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date()?.getFullYear()} StarryStudy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginCard;