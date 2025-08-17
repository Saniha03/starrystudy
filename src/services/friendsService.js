import { supabase } from '../lib/supabase';

export const friendsService = {
  async getFriends(userId, status = 'accepted') {
    const { data, error } = await supabase?.from('friendships')?.select(`
        id,
        status,
        created_at,
        requester:requester_id(id, full_name, avatar_url, total_points),
        addressee:addressee_id(id, full_name, avatar_url, total_points)
      `)?.or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)?.eq('status', status)?.order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    
    // Format the response to get friend data
    return data?.map(friendship => ({
      ...friendship,
      friend: friendship?.requester?.id === userId 
        ? friendship?.addressee 
        : friendship?.requester
    })) || [];
  },

  async getFriendRequests(userId) {
    const { data, error } = await supabase?.from('friendships')?.select(`
        id,
        status,
        created_at,
        requester:requester_id(id, full_name, avatar_url, email)
      `)?.eq('addressee_id', userId)?.eq('status', 'pending')?.order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    return data || []
  },

  async sendFriendRequest(requesterId, addresseeId) {
    const { data, error } = await supabase?.from('friendships')?.insert([{
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: 'pending'
      }])?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async acceptFriendRequest(friendshipId) {
    const { data, error } = await supabase?.from('friendships')?.update({
        status: 'accepted',
        updated_at: new Date()?.toISOString()
      })?.eq('id', friendshipId)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async declineFriendRequest(friendshipId) {
    const { data, error } = await supabase?.from('friendships')?.update({
        status: 'declined',
        updated_at: new Date()?.toISOString()
      })?.eq('id', friendshipId)?.select()?.single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async removeFriend(friendshipId) {
    const { error } = await supabase?.from('friendships')?.delete()?.eq('id', friendshipId)
    
    if (error) throw new Error(error.message)
    return true
  },

  async searchUsers(query) {
    const { data, error } = await supabase?.from('user_profiles')?.select('id, full_name, avatar_url, email')?.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)?.limit(10)
    
    if (error) throw new Error(error.message)
    return data || []
  },

  async getLeaderboard(userIds = [], limit = 50) {
    let query = supabase?.from('user_profiles')?.select('id, full_name, avatar_url, total_points, study_streak')?.order('total_points', { ascending: false })?.limit(limit)
    
    if (userIds?.length > 0) {
      query = query?.in('id', userIds)
    }
    
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data || []
  }
}