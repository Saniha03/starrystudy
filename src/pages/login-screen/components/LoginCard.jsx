import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../components/ui/NotificationToast';
import { useAuth } from '../../../contexts/AuthContext';

const LoginCard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signIn, signUp, getUserProfile } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Check for existing user
        const { data: existingUser, error: fetchError } = await getUserProfile(email);
        if (existingUser) {
          setError('An account with this email already exists. Please log in.');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Register new user
        await signUp(email, password, { createdAt: new Date().toISOString() });
        addToast('Registration successful! You can now log in.', 'success');
        setIsRegistering(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');

      } else {
        // Sign in existing user
        const { data, error: loginError } = await signIn(email, password);
        if (loginError) {
          setError(loginError.message);
        } else if (data?.user) {
          localStorage.setItem('isAuthenticated', 'true');
          addToast('Welcome back! 🌟', 'success');
          navigate('/daily-tasks');
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="morphic-card text-center slide-in relative z-10">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {isRegistering 
            ? 'Register a new account to start your study journey' 
            : 'Sign in to continue your study journey with friends'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
            />
          </div>

          {isRegistering && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent focus:outline-none"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={loading}
            className="mb-4 bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
          >
            {loading ? (isRegistering ? 'Registering...' : 'Signing in...') : (isRegistering ? 'Register' : 'Sign In')}
          </Button>
        </form>

        <div className="text-sm mt-4">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button
                className="text-accent hover:underline"
                onClick={() => { setIsRegistering(false); setError(''); }}
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New here?{' '}
              <button
                className="text-accent hover:underline"
                onClick={() => { setIsRegistering(true); setError(''); }}
              >
                Register
              </button>
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
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

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
          <Icon name="Shield" size={14} className="text-success" />
          <span>Secure authentication with email & password</span>
        </div>
      </div>

      {/* Footer */}
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
          © {new Date().getFullYear()} StarryStudy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
