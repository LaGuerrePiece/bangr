import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = "https://gfdakuvgcmtzsngfshnb.supabase.co"
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZGFrdXZnY210enNuZ2ZzaG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4MjkxNjQsImV4cCI6MTk4ODQwNTE2NH0.W74ATfMAhxpxjc4pO_44L4Q5YiPYWKsNA80DoIuwCqQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

