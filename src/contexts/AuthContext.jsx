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

  // ----------------- Fetch user profile -----------------
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

  // ----------------- Initialize auth -----------------
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;

        if (!mounted) return;

        setUser(session?.user ?? null);
        if (session?.user) await getUserProfile(session.user.id);
      } catch (err) {
        console.error("Auth session error:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        if (session?.user) await getUserProfile(session.user.id);
        else setUserProfile(null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // ----------------- Auth actions -----------------
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error("No user logged in");
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    setUserProfile(data);
    return data;
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      getUserProfile,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
