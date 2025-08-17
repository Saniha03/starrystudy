import { supabase } from '../lib/supabase';

export const goalsService = {
  async getMonthlyGoals(filters = {}) {
    let query = supabase?.from('monthly_goals')?.select('*')
    
    // Apply filters conditionally
    if (filters?.userId) {
      query = query?.eq('user_id', filters?.userId)
    }
    if (filters?.status) {
      query = query?.eq('status', filters?.status)
    }
    if (filters?.month) {
      query = query?.eq('target_month', filters?.month)
    }
    
    const { data, error } = await query?.order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  },

  async getGoalById(id) {
    const { data, error } = await supabase?.from('monthly_goals')?.select('*')?.eq('id', id)?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async createGoal(goalData) {
    const { data, error } = await supabase?.from('monthly_goals')?.insert([goalData])?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async updateGoal(id, updates) {
    const { data, error } = await supabase?.from('monthly_goals')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async deleteGoal(id) {
    const { error } = await supabase?.from('monthly_goals')?.delete()?.eq('id', id)
    
    if (error) throw new Error(error.message)
    return true
  },

  async updateGoalProgress(id, progress) {
    const { data, error } = await supabase?.from('monthly_goals')?.update({
        current_progress: progress,
        updated_at: new Date()?.toISOString()
      })?.eq('id', id)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  }
}