import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { useToast } from "../../../components/ui/NotificationToast";

const LoginCard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signIn, signUp } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle between login and registration
  const toggleMode = () => {
    setError("");
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await signUp(email, password, { createdAt: new Date().toISOString() });
        addToast("Registration successful! You can now log in.", "success");
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        await signIn(email, password);
        addToast("Welcome back! 🌟", "success");
        navigate("/daily-tasks");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Starry decorative elements
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    animationDelay: Math.random() * 4,
  }));

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto bg-background border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6 morphic-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Floating stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-50 pulse-gentle pointer-events-none"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}

      {/* Card Header */}
      <div className="text-center mb-6">
        <motion.h2
          className="text-3xl font-bold text-foreground"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {isRegistering ? "Create Account" : "Welcome Back"}
        </motion.h2>
        <p className="text-muted-foreground mt-2">
          {isRegistering
            ? "Register a new account to start your study journey"
            : "Sign in to continue your study journey with friends"}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md mb-4 text-center text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (isRegistering ? "Registering..." : "Signing in...") : isRegistering ? "Register" : "Sign In"}
        </Button>
      </form>

      {/* Toggle mode */}
      <div className="text-center mt-4">
        <button
          onClick={toggleMode}
          className="text-sm text-accent hover:underline"
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>
      </div>

      {/* Benefits */}
      <div className="mt-8 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="Users" size={16} className="text-accent flex-shrink-0" />
          <span>Study with friends and stay motivated</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Target" size={16} className="text-accent flex-shrink-0" />
          <span>Track goals and earn achievement points</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Timer" size={16} className="text-accent flex-shrink-0" />
          <span>Built-in study timers and progress tracking</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} StarryStudy. All rights reserved.
      </div>
    </motion.div>
  );
};

export default LoginCard;
