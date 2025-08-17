import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase?.auth?.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        getUserProfile(session?.user?.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {  // ✅ NEVER make this async
        setUser(session?.user ?? null)
        if (session?.user) {
          getUserProfile(session?.user?.id)  // ✅ NO await - just call it
        } else {
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
      
      if (error) {
        if (error?.code !== 'PGRST116') { // Row not found
          throw error
        }
        return
      }
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error?.message)
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase?.auth?.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location?.origin}/daily-tasks`
      }
    })
    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email, password
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase?.auth?.signUp({
      email, password,
      options: { data: metadata }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase?.auth?.signOut()
    if (error) throw error
    setUserProfile(null)
  }

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in')
    
    const { data, error } = await supabase?.from('user_profiles')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', user?.id)?.select()?.single()
    
    if (error) throw error
    setUserProfile(data)
    return data
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    getUserProfile,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}