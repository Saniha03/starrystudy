import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) getUserProfile(session.user.id);
      setLoading(false);
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) getUserProfile(session.user.id);
      else setUserProfile(null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error) setUserProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, signIn, signUp, signOut, getUserProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
