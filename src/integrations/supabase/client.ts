
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lfhvnqmhbjanlaozrwlp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaHZucW1oYmphbmxhb3pyd2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTY1ODMsImV4cCI6MjA1OTQ3MjU4M30.lDigQtU_d5bSQj1Kq0RAeUuI_xQ2tUeZy4dsIKGGdNk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
