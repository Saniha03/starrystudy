import { supabase } from '../lib/supabase';

export const tasksService = {
  async getDailyTasks(filters = {}) {
    let query = supabase?.from('daily_tasks')?.select('*')
    
    // Apply filters conditionally
    if (filters?.userId) {
      query = query?.eq('user_id', filters?.userId)
    }
    if (filters?.status) {
      query = query?.eq('status', filters?.status)
    }
    if (filters?.date) {
      query = query?.eq('due_date', filters?.date)
    }
    if (filters?.priority) {
      query = query?.eq('priority', filters?.priority)
    }
    
    const { data, error } = await query?.order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  },

  async getTaskById(id) {
    const { data, error } = await supabase?.from('daily_tasks')?.select('*')?.eq('id', id)?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async createTask(taskData) {
    const { data, error } = await supabase?.from('daily_tasks')?.insert([taskData])?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async updateTask(id, updates) {
    const { data, error } = await supabase?.from('daily_tasks')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', id)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async deleteTask(id) {
    const { error } = await supabase?.from('daily_tasks')?.delete()?.eq('id', id)
    
    if (error) throw new Error(error.message)
    return true
  },

  async completeTask(id, duration = 0) {
    const { data, error } = await supabase?.from('daily_tasks')?.update({
        status: 'completed',
        actual_duration: duration,
        completed_at: new Date()?.toISOString(),
        updated_at: new Date()?.toISOString()
      })?.eq('id', id)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  }
}