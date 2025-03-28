import { supabase } from "@/integrations/supabase/client";

export interface Interest {
  name: string;
  color: string;
}

export interface KidProfile {
  id: string;
  name: string;
  age: number | null;
  grade: string | null;
  schoolType: string;
  interests: string[];
  parent_id: string;
  // Optional fields from DB
  avatar?: string | null;
  gender?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  subjects?: string[] | null;
}

// Helper function to transform DB kid to KidProfile
const transformKidToProfile = (kid: any): KidProfile => {
  let interests: string[] = [];
  try {
    if (kid.interests) {
      // Try to parse the interests JSON string
      const parsedInterests = JSON.parse(kid.interests);
      if (Array.isArray(parsedInterests)) {
        interests = parsedInterests;
      } else if (typeof parsedInterests === 'string') {
        // Handle case where interests might be a single string
        interests = [parsedInterests];
      }
    }
  } catch (error) {
    console.error("Error parsing interests:", error);
    // If parsing fails, try to use it as a string
    if (typeof kid.interests === 'string') {
      interests = [kid.interests];
    }
  }

  return {
    id: kid.id,
    name: kid.name,
    age: kid.age,
    grade: kid.grade,
    schoolType: kid.school_type || kid.grade || '', // Try school_type first, then fall back to grade
    interests,
    parent_id: kid.parent_id,
    avatar: kid.avatar,
    gender: kid.gender,
    created_at: kid.created_at,
    updated_at: kid.updated_at,
    subjects: Array.isArray(kid.subjects) ? kid.subjects : []
  };
};

// Fetch kids profiles for the current parent
export const fetchKidProfiles = async (parentId: string): Promise<KidProfile[]> => {
  try {
    const { data: kids, error } = await supabase
      .from('kids')
      .select('*')
      .eq('parent_id', parentId);

    if (error) {
      console.error("Error fetching kid profiles:", error);
      throw new Error(`Failed to fetch kid profiles: ${error.message}`);
    }

    return (kids || []).map(transformKidToProfile);
  } catch (error) {
    console.error("Error in fetchKidProfiles:", error);
    throw error;
  }
};

// Create a new kid profile
export const createKidProfile = async (profile: Omit<KidProfile, 'id'>): Promise<KidProfile> => {
  try {
    // Ensure interests is an array
    const interests = Array.isArray(profile.interests) ? profile.interests : [];
    // Convert interests array to JSON string
    const interestsJson = JSON.stringify(interests);

    const { data, error } = await supabase
      .from('kids')
      .insert([{
        name: profile.name,
        age: profile.age,
        grade: profile.grade,
        school_type: profile.schoolType,
        interests: interestsJson,
        parent_id: profile.parent_id,
        subjects: Array.isArray(profile.subjects) ? profile.subjects : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating kid profile:", error);
      throw new Error(`Failed to create kid profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after creating kid profile");
    }

    return transformKidToProfile(data);
  } catch (error) {
    console.error("Error in createKidProfile:", error);
    throw error;
  }
};

// Update an existing kid profile
export const updateKidProfile = async (profile: KidProfile): Promise<KidProfile> => {
  try {
    // Ensure interests is an array
    const interests = Array.isArray(profile.interests) ? profile.interests : [];
    // Convert interests array to JSON string
    const interestsJson = JSON.stringify(interests);

    const { data, error } = await supabase
      .from('kids')
      .update({
        name: profile.name,
        age: profile.age,
        grade: profile.grade,
        school_type: profile.schoolType,
        interests: interestsJson,
        subjects: Array.isArray(profile.subjects) ? profile.subjects : [],
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id)
      .eq('parent_id', profile.parent_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating kid profile:", error);
      throw new Error(`Failed to update kid profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after updating kid profile");
    }

    return transformKidToProfile(data);
  } catch (error) {
    console.error("Error in updateKidProfile:", error);
    throw error;
  }
};

// Delete a kid profile
export const deleteKidProfile = async (kidId: string, parentId: string) => {
  try {
    const { error } = await supabase
      .from('kids')
      .delete()
      .eq('id', kidId)
      .eq('parent_id', parentId); // Extra security to ensure parent can only delete their own kids

    if (error) {
      console.error("Error deleting kid profile:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteKidProfile:", error);
    throw error;
  }
}; 