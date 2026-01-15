/**
 * Supabase Client Configuration
 * English Fun with AI Game
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gtxfawrwfvffqoolgdit.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eGZhd3J3ZnZmZnFvb2xnZGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0Mzk0MjcsImV4cCI6MjA4NDAxNTQyN30.yYIr1k7pg2_hzQKlgfU0lKdVD37FOlJdEWBm1UfaWvg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Helper to check if user is authenticated
export const isAuthenticated = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session !== null
}

// Helper to get current user
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
