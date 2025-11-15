import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://yiarrshhxltesgoehqse.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYXJyc2hoeGx0ZXNnb2VocXNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY1NjIzNCwiZXhwIjoyMDY0MjMyMjM0fQ.-ycD96zzx36rzH92Fu-h1IWF7oxL2WMjeTDmH_fu7L8';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');
console.log('Supabase URL:', supabaseUrl);