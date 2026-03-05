import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbruzrvoikozukcarlnt.supabase.co'
const supabaseAnonKey = 'sb_publishable_ejFdjYZEgg0Acvv5Tn54nQ_L8Qie0sD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)