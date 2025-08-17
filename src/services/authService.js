import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email, password
    })
    if (error) throw new Error(error.message)
    return data
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase?.auth?.signUp({
      email, password, 
      options: { data: metadata }
    })
    if (error) throw new Error(error.message)
    return data
  },

  async signInWithGoogle() {
    const { data, error } = await supabase?.auth?.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location?.origin}/daily-tasks`
      }
    })
    if (error) throw new Error(error.message)
    return data
  },

  async signOut() {
    const { error } = await supabase?.auth?.signOut()
    if (error) throw new Error(error.message)
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase?.auth?.getUser()
    return user
  },

  async getSession() {
    const { data: { session } } = await supabase?.auth?.getSession()
    return session
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase?.from('user_profiles')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', userId)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  }
}