import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarryBackground from './components/StarryBackground';
import WelcomeHeader from './components/WelcomeHeader';
import LoginCard from './components/LoginCard';
import { useToast } from '../../components/ui/NotificationToast';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { ToastContainer } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/daily-tasks');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Starry Background */}
      <StarryBackground />
      {/* Main Content */}
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            
            {/* Left Side - Welcome Content */}
            <motion.div 
              className="flex-1 max-w-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <WelcomeHeader />
            </motion.div>

            {/* Right Side - Login Card */}
            <motion.div 
              className="flex-1 max-w-md w-full"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <LoginCard />
            </motion.div>

          </div>
        </div>
      </motion.div>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default LoginScreen;