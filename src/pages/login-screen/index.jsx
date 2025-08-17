import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginCard from "./components/LoginCard";
import StarryBackground from "./components/StarryBackground";
import WelcomeHeader from "./components/WelcomeHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/NotificationToast";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ToastContainer } = useToast();

  useEffect(() => {
    // If user is already logged in, redirect to daily-tasks
    if (user) {
      navigate("/daily-tasks");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-pink-100 to-white relative overflow-hidden">
      {/* Starry Background */}
      <StarryBackground />

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Left Side: Welcome Content */}
            <motion.div
              className="flex-1 max-w-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <WelcomeHeader />
            </motion.div>

            {/* Right Side: Login Card */}
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

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default LoginScreen;
