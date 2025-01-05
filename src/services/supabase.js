import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})

// Social login providers configuration
export const OAUTH_PROVIDERS = {
  google: {
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  },
  facebook: {
    provider: 'facebook',
    options: {
      queryParams: {
        auth_type: 'reauthenticate',
      },
    },
  },
}

// Helper function to get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Helper function to update user profile
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
  return data
}

// Helper function to handle auth state change
export const handleAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Helper function to get user role
export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data?.role || 'customer'
}

// Helper function to check if user is admin
export const isAdmin = async (userId) => {
  const role = await getUserRole(userId)
  return role === 'admin'
}
