import { supabase } from '../lib/supabase';

export const studySessionsService = {
  async getStudySessions(filters = {}) {
    let query = supabase?.from('study_sessions')?.select(`
        *,
        task:daily_tasks(id, title, status)
      `)
    
    // Apply filters conditionally
    if (filters?.userId) {
      query = query?.eq('user_id', filters?.userId)
    }
    if (filters?.taskId) {
      query = query?.eq('task_id', filters?.taskId)
    }
    if (filters?.sessionType) {
      query = query?.eq('session_type', filters?.sessionType)
    }
    if (filters?.dateFrom) {
      query = query?.gte('started_at', filters?.dateFrom)
    }
    if (filters?.dateTo) {
      query = query?.lte('started_at', filters?.dateTo)
    }
    
    const { data, error } = await query?.order('started_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  },

  async getSessionById(id) {
    const { data, error } = await supabase?.from('study_sessions')?.select(`
        *,
        task:daily_tasks(id, title, status)
      `)?.eq('id', id)?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async createSession(sessionData) {
    const { data, error } = await supabase?.from('study_sessions')?.insert([sessionData])?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async updateSession(id, updates) {
    const { data, error } = await supabase?.from('study_sessions')?.update(updates)?.eq('id', id)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async endSession(id, notes = '', pointsEarned = 0) {
    const { data, error } = await supabase?.from('study_sessions')?.update({
        ended_at: new Date()?.toISOString(),
        notes,
        points_earned: pointsEarned,
        is_completed: true
      })?.eq('id', id)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async deleteSession(id) {
    const { error } = await supabase?.from('study_sessions')?.delete()?.eq('id', id)
    
    if (error) throw new Error(error.message)
    return true
  }
}