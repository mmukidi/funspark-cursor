import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createParentProfile, getParentProfileByAuthId, type ParentProfile } from "@/services/parentService";

export type AuthUser = User & {
  parentProfile?: ParentProfile;
};

export type AuthContextType = {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUser = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      // Try to get the parent profile
      const parentProfile = await getParentProfileByAuthId(authUser.id);
      
      if (!parentProfile) {
        // Create a parent profile if one doesn't exist
        console.log("Creating parent profile for user:", authUser.id);
        const newParentProfile = await createParentProfile({
          id: authUser.id,
          email: authUser.email || ''
        });
        
        setUser({ ...authUser, parentProfile: newParentProfile });
      } else {
        setUser({ ...authUser, parentProfile });
      }
    } catch (error) {
      console.error("Error handling user profile:", error);
      // Still set the user even if we couldn't get/create the parent profile
      setUser(authUser);
      
      toast({
        title: "Profile Error",
        description: "There was an error loading your profile. Some features may be limited.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('Starting auth initialization...');
    setIsLoading(true); // Set loading to true when starting auth check
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, "Session:", !!session);
        setSession(session);
        await handleUser(session?.user ?? null);
        console.log("Auth state change processed, setting isLoading to false");
        setIsLoading(false); // Set loading to false after auth state change
        
        // If the user just signed in, redirect to dashboard
        if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
          navigate('/dashboard');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", !!session);
      setSession(session);
      await handleUser(session?.user ?? null);
      console.log("Initial session check complete, setting isLoading to false");
      setIsLoading(false); // Set loading to false after session check
    }).catch(error => {
      console.error("Error checking session:", error);
      console.log("Session check failed, setting isLoading to false");
      setIsLoading(false); // Set loading to false even if there's an error
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    if (isLoading) {
      console.log("Sign in attempted while loading, preventing...");
      return;
    }
    
    try {
      console.log("Starting sign in process...");
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error from Supabase:", error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      }
      
      console.log("Sign in successful");
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      console.log("Sign in process complete, setting isLoading to false");
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    if (isLoading) return; // Prevent multiple simultaneous attempts
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      }
      
      toast({
        title: "Account created",
        description: "Welcome to Funsheets! Your account has been created successfully.",
      });
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      }
      
      navigate('/');
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (isLoading) return; // Prevent multiple simultaneous attempts
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      }
      
      // Success toast is not needed here as we'll redirect to Google
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Google sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
