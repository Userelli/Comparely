import { supabase } from '@/lib/supabase';

export interface ComparisonPayload {
  title?: string;
  document_type: string;
  file_names?: string[];
  comparison_data: any;
  user_id: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier?: string;
  usage_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Comparison functions with better error handling
export async function saveComparison(payload: ComparisonPayload) {
  try {
    // Validate payload
    if (!payload.user_id || !payload.document_type) {
      throw new Error('Missing required fields: user_id and document_type');
    }

    const { data, error } = await supabase
      .from('comparisons')
      .insert([{
        title: payload.title || 'Untitled comparison',
        document_type: payload.document_type,
        file_names: payload.file_names || [],
        comparison_data: payload.comparison_data || {},
        user_id: payload.user_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error saving comparison:', error);
      throw new Error(`Failed to save comparison: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving comparison:', error);
    throw error;
  }
}

export async function loadComparisons(userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('comparisons')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error loading comparisons:', error);
      throw new Error(`Failed to load comparisons: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error loading comparisons:', error);
    return [];
  }
}

export async function deleteComparison(comparisonId: string, userId: string) {
  try {
    if (!comparisonId || !userId) {
      throw new Error('Comparison ID and User ID are required');
    }

    const { error } = await supabase
      .from('comparisons')
      .delete()
      .eq('id', comparisonId)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error deleting comparison:', error);
      throw new Error(`Failed to delete comparison: ${error.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting comparison:', error);
    throw error;
  }
}

// Profile management functions
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating profile:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
