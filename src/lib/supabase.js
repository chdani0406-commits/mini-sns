import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vkyhxjepvdbfjnwojbsv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZreWh4amVwdmRiZmpud29qYnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODExMTQsImV4cCI6MjA5NDM1NzExNH0.jKNY55XxfyEQjN2ROciAC4MAcSNJyOw9Am3bbGvIbZ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
