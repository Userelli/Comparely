import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with security enhancements
const supabaseUrl = 'https://dyxoboyylifsmlaireuw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eG9ib3l5bGlmc21sYWlyZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDIyNTUsImV4cCI6MjA2MzgxODI1NX0.nRp3T5RrdmfAdbeL0qZUKIxfAlhnvTkMOyjZfuCxUcM';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'document-diff-app'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enhanced error handling wrapper
export const safeSupabaseCall = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error('Supabase operation failed:', error);
    throw new Error('Database operation failed. Please try again.');
  }
};

// Rate limiting helper
const rateLimiter = new Map<string, number[]>();

export const checkRateLimit = (key: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const requests = rateLimiter.get(key) || [];
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimiter.set(key, validRequests);
  return true;
};

export { supabase };
