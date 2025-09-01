import { supabase } from '../lib/supabase';

// Authentication Services
export const authService = {
  // Sign up a new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name,
            username: userData?.username,
          },
          emailRedirectTo: `${window.location.origin}/dashboard-home`
        },
      });

      if (error) throw error;
      return { user: data?.user, session: data?.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: data?.user, session: data?.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user session
  async getCurrentSession() {
    try {
      const { data, error } = await supabase?.auth?.getSession();
      if (error) throw error;
      return data?.session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data, error } = await supabase?.auth?.getUser();
      if (error) throw error;
      return data?.user;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
};

// User Profile Services
export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },

  // Get user stats
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('points, streak_count, longest_streak, goals_completed, groups_joined')?.eq('id', userId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  // Search users
  async searchUsers(searchTerm, limit = 10) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('id, full_name, username, avatar_url, bio, location')?.or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)?.eq('is_active', true)?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }
};

// Goals Services
export const goalService = {
  // Create a new goal
  async createGoal(goalData) {
    try {
      const { data, error } = await supabase?.from('goals')?.insert(goalData)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create goal error:', error);
      throw error;
    }
  },

  // Get user's goals
  async getUserGoals(userId, status = null) {
    try {
      let query = supabase?.from('goals')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false });

      if (status) {
        query = query?.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user goals error:', error);
      throw error;
    }
  },

  // Update goal
  async updateGoal(goalId, updates) {
    try {
      const { data, error } = await supabase?.from('goals')?.update(updates)?.eq('id', goalId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update goal error:', error);
      throw error;
    }
  },

  // Delete goal
  async deleteGoal(goalId) {
    try {
      const { error } = await supabase?.from('goals')?.delete()?.eq('id', goalId);

      if (error) throw error;
    } catch (error) {
      console.error('Delete goal error:', error);
      throw error;
    }
  },

  // Get public goals (feed)
  async getPublicGoals(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase?.from('goals')?.select(`*,user_profiles:user_id (id,full_name,username,avatar_url)`)?.eq('visibility', 'public')?.eq('status', 'active')?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get public goals error:', error);
      throw error;
    }
  }
};

// Groups Services
export const groupService = {
  // Create a new group
  async createGroup(groupData) {
    try {
      const { data, error } = await supabase?.from('groups')?.insert(groupData)?.select()?.single();

      if (error) throw error;

      // Auto-join the creator as owner
      await supabase?.from('group_memberships')?.insert({
          group_id: data?.id,
          user_id: groupData?.owner_id,
          role: 'owner',
          status: 'active'
        });

      return data;
    } catch (error) {
      console.error('Create group error:', error);
      throw error;
    }
  },

  // Get public groups
  async getPublicGroups(category = null, limit = 20, offset = 0) {
    try {
      let query = supabase?.from('groups')?.select(`
          *,
          user_profiles:owner_id (
            id,
            full_name,
            username,
            avatar_url
          )
        `)?.eq('visibility', 'public')?.eq('status', 'active')?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (category) {
        query = query?.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get public groups error:', error);
      throw error;
    }
  },

  // Get user's groups
  async getUserGroups(userId) {
    try {
      const { data, error } = await supabase?.from('group_memberships')?.select(`*,groups (*)`)?.eq('user_id', userId)?.eq('status', 'active');

      if (error) throw error;
      return data?.map(membership => ({
        ...membership?.groups,
        membership_role: membership?.role,
        joined_at: membership?.joined_at
      })) || [];
    } catch (error) {
      console.error('Get user groups error:', error);
      throw error;
    }
  },

  // Join a group
  async joinGroup(groupId, userId) {
    try {
      const { data, error } = await supabase?.from('group_memberships')?.insert({
          group_id: groupId,
          user_id: userId,
          status: 'pending'
        })?.select()?.single();

      if (error) throw error;

      // Update group member count
      await supabase?.rpc('increment_group_member_count', { group_id: groupId });
      
      return data;
    } catch (error) {
      console.error('Join group error:', error);
      throw error;
    }
  },

  // Leave a group
  async leaveGroup(groupId, userId) {
    try {
      const { error } = await supabase?.from('group_memberships')?.delete()?.eq('group_id', groupId)?.eq('user_id', userId);

      if (error) throw error;

      // Update group member count
      await supabase?.rpc('decrement_group_member_count', { group_id: groupId });
    } catch (error) {
      console.error('Leave group error:', error);
      throw error;
    }
  },

  // Get group members
  async getGroupMembers(groupId) {
    try {
      const { data, error } = await supabase?.from('group_memberships')?.select(`*,user_profiles (id,full_name,username,avatar_url,bio)`)?.eq('group_id', groupId)?.eq('status', 'active')?.order('joined_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get group members error:', error);
      throw error;
    }
  }
};

// Check-ins Services
export const checkInService = {
  // Create a check-in
  async createCheckIn(checkInData) {
    try {
      const { data, error } = await supabase?.from('check_ins')?.insert(checkInData)?.select()?.single();

      if (error) throw error;

      // Update user's last check-in date and streakawait supabase.rpc('update_user_streak', { user_id: checkInData?.user_id });

      return data;
    } catch (error) {
      console.error('Create check-in error:', error);
      throw error;
    }
  },

  // Get activity feed (recent check-ins)
  async getActivityFeed(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase?.from('check_ins')?.select(`*,user_profiles:user_id (id,full_name,username,avatar_url),goals:goal_id (id,title,category)`)?.in('visibility', ['public', 'friends'])?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get activity feed error:', error);
      throw error;
    }
  },

  // Get user's check-ins
  async getUserCheckIns(userId, goalId = null, limit = 20) {
    try {
      let query = supabase?.from('check_ins')?.select(`
          *,
          goals:goal_id (
            id,
            title,
            category
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (goalId) {
        query = query?.eq('goal_id', goalId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user check-ins error:', error);
      throw error;
    }
  },

  // Like a check-in
  async likeCheckIn(checkInId, userId) {
    try {
      const { data, error } = await supabase?.from('check_in_likes')?.insert({ check_in_id: checkInId, user_id: userId })?.select()?.single();

      if (error) throw error;

      // Increment likes count
      await supabase?.rpc('increment_check_in_likes', { check_in_id: checkInId });

      return data;
    } catch (error) {
      console.error('Like check-in error:', error);
      throw error;
    }
  },

  // Unlike a check-in
  async unlikeCheckIn(checkInId, userId) {
    try {
      const { error } = await supabase?.from('check_in_likes')?.delete()?.eq('check_in_id', checkInId)?.eq('user_id', userId);

      if (error) throw error;

      // Decrement likes count
      await supabase?.rpc('decrement_check_in_likes', { check_in_id: checkInId });
    } catch (error) {
      console.error('Unlike check-in error:', error);
      throw error;
    }
  },

  // Add comment to check-in
  async addComment(checkInId, userId, content) {
    try {
      const { data, error } = await supabase?.from('check_in_comments')?.insert({
          check_in_id: checkInId,
          user_id: userId,
          content
        })?.select(`
          *,
          user_profiles:user_id (
            id,
            full_name,
            username,
            avatar_url
          )
        `)?.single();

      if (error) throw error;

      // Increment comments count
      await supabase?.rpc('increment_check_in_comments', { check_in_id: checkInId });

      return data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  },

  // Get check-in comments
  async getCheckInComments(checkInId) {
    try {
      const { data, error } = await supabase?.from('check_in_comments')?.select(`
          *,
          user_profiles:user_id (
            id,
            full_name,
            username,
            avatar_url
          )
        `)?.eq('check_in_id', checkInId)?.order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get check-in comments error:', error);
      throw error;
    }
  }
};

// Notifications Services
export const notificationService = {
  // Get user notifications
  async getUserNotifications(userId, limit = 20) {
    try {
      const { data, error } = await supabase?.from('notifications')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user notifications error:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('id', notificationId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('user_id', userId)?.eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }
};

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to activity feed updates
  subscribeToActivityFeed(callback) {
    return supabase?.channel('activity-feed')?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'check_ins' },
        callback
      )?.subscribe();
  },

  // Subscribe to user notifications
  subscribeToNotifications(userId, callback) {
    return supabase?.channel(`notifications:${userId}`)?.on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )?.subscribe();
  },

  // Subscribe to group updates
  subscribeToGroupUpdates(groupId, callback) {
    return supabase?.channel(`group:${groupId}`)?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'group_memberships',
          filter: `group_id=eq.${groupId}`
        },
        callback
      )?.subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};

// Utility functions
export const utilityService = {
  // Upload file to Supabase Storage
  async uploadFile(bucket, filePath, file) {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.upload(filePath, file, { upsert: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  },

  // Get public URL for file
  getPublicUrl(bucket, filePath) {
    const { data } = supabase?.storage?.from(bucket)?.getPublicUrl(filePath);
    
    return data?.publicUrl;
  },

  // Format relative time
  formatRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time?.toLocaleDateString();
  }
};

export default {
  auth: authService,
  user: userService,
  goal: goalService,
  group: groupService,
  checkIn: checkInService,
  notification: notificationService,
  realtime: realtimeService,
  utility: utilityService
};