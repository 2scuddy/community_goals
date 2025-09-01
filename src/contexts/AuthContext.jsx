import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/supabaseService';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // ⚠️ PROTECTED FUNCTION - DO NOT MODIFY OR ADD ASYNC OPERATIONS
  // This is a Supabase auth state change listener that must remain synchronous
  const handleAuthStateChange = (event, newSession) => {
    // SYNC OPERATIONS ONLY - NO ASYNC/AWAIT ALLOWED
    setSession(newSession)
    if (newSession?.user) {
      setUser(newSession?.user)
      // Remove mock authentication flag if exists
      localStorage.removeItem('isAuthenticated')
      // Fetch user profile separately
      fetchUserProfile(newSession?.user?.id)
    } else {
      setUser(null)
      setProfile(null)
      // Clear mock authentication
      localStorage.removeItem('isAuthenticated')
    }
    setLoading(false)
  }

  // Separate async function to fetch user profile
  const fetchUserProfile = async (userId) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (userProfile && !error) {
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }
  
  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      if (initialSession?.user) {
        setUser(initialSession.user)
        fetchUserProfile(initialSession.user.id)
      } else {
        // Check for mock authentication (backward compatibility)
        const mockAuth = localStorage.getItem('isAuthenticated')
        if (mockAuth === 'true') {
          // Clean up mock auth - user should use real auth now
          localStorage.removeItem('isAuthenticated')
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(handleAuthStateChange)

    return () => subscription?.unsubscribe()
  }, [])

  // Auth methods
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { user: newUser, session: newSession, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard-home`
        }
      })
      
      if (error) throw error
      if (newUser) setUser(newUser)
      if (newSession) setSession(newSession)
      
      return { user: newUser, session: newSession }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      if (data?.user) setUser(data.user)
      if (data?.session) setSession(data.session)
      
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error('No authenticated user')
      
      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      if (updatedProfile) {
        setProfile(updatedProfile)
        return updatedProfile
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!session
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}