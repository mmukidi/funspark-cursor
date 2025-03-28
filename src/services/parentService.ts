import { supabase } from "@/integrations/supabase/client";

export interface ParentProfile {
  id: string;
  auth_id: string;
  email: string;
  name: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
}

interface CreateParentProfileInput {
  id: string;
  email: string;
  name?: string | null;
}

// Create a parent profile
export const createParentProfile = async (input: CreateParentProfileInput): Promise<ParentProfile> => {
  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabase
      .from('parents')
      .select('*')
      .eq('auth_id', input.id)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    const { data, error } = await supabase
      .from('parents')
      .insert([{
        auth_id: input.id,
        email: input.email,
        name: input.name || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating parent profile:", error);
      throw new Error(`Failed to create parent profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after creating parent profile");
    }

    return data;
  } catch (error) {
    console.error("Error in createParentProfile:", error);
    throw error;
  }
};

// Get parent profile by auth ID
export const getParentProfileByAuthId = async (authId: string): Promise<ParentProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      console.error("Error fetching parent profile:", error);
      throw new Error(`Failed to fetch parent profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getParentProfileByAuthId:", error);
    throw error;
  }
}; 