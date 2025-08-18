import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../components/ui/NotificationToast";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const LoginCard = () => {
  const navigate = useNavigate();
  const { addToast, ToastContainer } = useToast();
  const { signIn, signUp, checkUserExists, resetPassword } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setError("Please enter your email first");
      return;
    }
    try {
      await resetPassword(form.email);
      addToast("Password reset email sent!", "success");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (!form.email || !form.password || (isRegister && !form.name)) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      if (isRegister) {
        // Register mode
        const exists = await checkUserExists(form.email);
        if (exists) {
          setError("Email already exists. Please log in.");
          setIsLoading(false);
          return;
        }
        await signUp(form.email, form.password, { name: form.name });
        addToast("Registration successful! Please log in.", "success");
        setIsRegister(false);
      } else {
        // Login mode
        await signIn(form.email, form.password);
        addToast("Login successful! Redirecting...", "success");
        navigate("/daily-tasks");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <motion.div
        className="morphic-card p-8 rounded-2xl shadow-lg relative bg-gradient-to-b from-sky-100 via-pink-100 to-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-sky-600">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-pink-500 text-sm mt-2">
            {isRegister
              ? "Register to start your study journey!"
              : "Sign in to continue with your progress"}
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="text-red-600 text-sm mb-4 text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {isRegister && (
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {!isRegister && (
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-sky-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            fullWidth
            size="lg"
            loading={isLoading}
            onClick={handleSubmit}
            className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold"
          >
            {isRegister ? "Register" : "Login"}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button
                className="text-pink-500 font-semibold hover:underline"
                onClick={() => { setIsRegister(false); setError(""); }}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              New here?{" "}
              <button
                className="text-sky-600 font-semibold hover:underline"
                onClick={() => { setIsRegister(true); setError(""); }}
              >
                Register
              </button>
            </p>
          )}
        </div>

        {/* Benefits */}
        <motion.div
          className="mt-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Icon name="Users" size={16} className="text-pink-400" />
            <span>Study with friends and stay motivated</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Icon name="Target" size={16} className="text-sky-400" />
            <span>Track goals and earn achievement points</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Icon name="Timer" size={16} className="text-pink-400" />
            <span>Built-in study timers and progress tracking</span>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Icon name="Shield" size={14} className="text-sky-500" />
          <span>Secure password authentication</span>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} StarryStudy. All rights reserved.
        </div>
      </motion.div>

      <ToastContainer />
    </div>
  );
};

export default LoginCard;
