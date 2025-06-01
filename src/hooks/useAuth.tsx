import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        setError(null);
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        }
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          setError(error instanceof Error ? error.message : 'Authentication error');
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);
          
          // Create profile on sign up
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  id: session.user.id,
                  email: session.user.email,
                  subscription_plan: 'free',
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
              
              if (profileError) {
                console.error('Error creating/updating profile:', profileError);
              }
            } catch (err) {
              console.error('Profile creation error:', err);
            }
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign out error';
      setError(errorMessage);
      return { error: { message: errorMessage } };
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
    isAuthenticated: !!user
  };
};

export default useAuth;
