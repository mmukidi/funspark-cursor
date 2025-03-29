import { useState, useEffect } from 'react';
import { createParentProfile, getParentProfileByAuthId, type ParentProfile } from '@/services/parentService';
import { useAuth as useAuthBase } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  parentProfile?: ParentProfile;
}

// Export the enhanced auth hook as a named export
export const useAuth = () => {
  const authContext = useAuthBase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleAuthUser = async (authUser: any) => {
      if (!authUser) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        console.log("Handling auth user:", authUser.id);
        
        // Try to get existing parent profile
        let parentProfile = await getParentProfileByAuthId(authUser.id);
        console.log("Got parent profile:", parentProfile);
        
        // If no parent profile exists, create one
        if (!parentProfile) {
          console.log("Creating new parent profile");
          parentProfile = await createParentProfile({
            id: authUser.id,
            email: authUser.email || ''
          });
          console.log("Created parent profile:", parentProfile);
        }

        if (mounted) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            parentProfile
          });
          setError(null);
        }
      } catch (error) {
        console.error("Error handling auth user:", error);
        if (mounted) {
          setError(error as Error);
          // Still set the user, even if we couldn't get/create the parent profile
          setUser({
            id: authUser.id,
            email: authUser.email || ''
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Watch for auth context changes
    if (!authContext.isLoading) {
      handleAuthUser(authContext.user);
    }

    return () => {
      mounted = false;
    };
  }, [authContext.user, authContext.isLoading]);

  return {
    user,
    loading: loading || authContext.isLoading,
    error,
    session: authContext.session
  };
}; 