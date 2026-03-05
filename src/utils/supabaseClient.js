import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fhqnxwmwqmyzpvdirskj.supabase.co'
const supabaseAnonKey = 'sb_publishable_6G_61ryVwuK7Xz1SzVoLHg_CO88ruD9'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)