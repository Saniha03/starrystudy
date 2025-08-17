import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------- Initial Session -----------------
  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session ?? null;
      setUser(session?.user ?? null);

      if (session?.user) await getUserProfile(session.user.id);

      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await getUserProfile(session.user.id);
        else setUserProfile(null);
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // ----------------- Get User Profile -----------------
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      setUserProfile(data ?? null);
      return data ?? null;
    } catch (err) {
      console.error("Error fetching user profile:", err.message);
      return null;
    }
  };

  // ----------------- Check if email exists -----------------
  const checkUserExists = async (email) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      return data ?? null;
    } catch (err) {
      console.error("Error checking user existence:", err.message);
      return null;
    }
  };

  // ----------------- Sign Up -----------------
  const signUp = async (email, password, metadata) => {
    try {
      const existingUser = await checkUserExists(email);
      if (existingUser) throw new Error("Email already exists. Please log in.");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Sign Up Error:", err.message);
      throw err;
    }
  };

  // ----------------- Sign In -----------------
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Sign In Error:", err.message);
      throw err;
    }
  };

  // ----------------- Sign Out -----------------
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserProfile(null);
      setUser(null);
    } catch (err) {
      console.error("Sign Out Error:", err.message);
      throw err;
    }
  };

  // ----------------- Update Profile -----------------
  const updateProfile = async (updates) => {
    if (!user) throw new Error("No user logged in");
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (err) {
      console.error("Update Profile Error:", err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    getUserProfile,
    updateProfile,
    checkUserExists,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

