import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { ProfilesGrid } from "@/components/dashboard/ProfilesGrid";
import { ChildProfileDialog } from "@/components/dashboard/ChildProfileDialog";
import { RecentWorksheets } from "@/components/dashboard/RecentWorksheets";
import { fetchKidProfiles, createKidProfile, updateKidProfile, deleteKidProfile, type KidProfile } from "@/services/profileService";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<KidProfile>({
    id: "",
    name: "",
    age: null,
    grade: null,
    schoolType: "",
    interests: [],
    parent_id: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, error: authError } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message);
        setIsLoading(false);
      } else if (!user) {
        // If not authenticated, redirect to login
        navigate('/login');
      } else if (user.parentProfile?.id) {
        loadProfiles();
      } else {
        setError("Parent profile not found. Please try logging out and back in.");
        setIsLoading(false);
      }
    }
  }, [user, authLoading, authError]);

  const loadProfiles = async () => {
    if (!user?.parentProfile?.id) {
      setError("Parent profile not found. Please try logging out and back in.");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Loading profiles for parent:", user.parentProfile.id);
      setError(null);
      const kidProfiles = await fetchKidProfiles(user.parentProfile.id);
      console.log("Loaded profiles:", kidProfiles);
      setProfiles(kidProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
      setError(error instanceof Error ? error.message : "Failed to load kid profiles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChild = () => {
    if (!user?.parentProfile?.id) {
      toast({
        title: "Error",
        description: "Parent profile not found. Please try logging out and back in.",
        variant: "destructive"
      });
      return;
    }

    setIsEditing(false);
    setCurrentProfile({
      id: "",
      name: "",
      age: null,
      grade: null,
      schoolType: "",
      interests: [],
      parent_id: user.parentProfile.id
    });
    setIsDialogOpen(true);
  };

  const handleEditChild = (id: string) => {
    const profileToEdit = profiles.find(profile => profile.id === id);
    if (profileToEdit) {
      setCurrentProfile(profileToEdit);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (!user?.parentProfile?.id) {
      toast({
        title: "Error",
        description: "Parent profile not found. Please try logging out and back in.",
        variant: "destructive"
      });
      return;
    }

    try {
      await deleteKidProfile(id, user.parentProfile.id);
      setProfiles(profiles.filter(profile => profile.id !== id));
      
      toast({
        title: "Profile deleted",
        description: "The child profile has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateWorksheet = (id: string) => {
    navigate(`/generator?childId=${id}`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        console.log("Updating profile:", currentProfile);
        const updatedProfile = await updateKidProfile(currentProfile);
        console.log("Updated profile:", updatedProfile);
        setProfiles(profiles.map(profile => 
          profile.id === updatedProfile.id ? updatedProfile : profile
        ));
        
        toast({
          title: "Profile updated",
          description: `${currentProfile.name}'s profile has been updated.`,
        });
      } else {
        console.log("Creating profile:", currentProfile);
        const newProfile = await createKidProfile(currentProfile);
        console.log("Created profile:", newProfile);
        setProfiles([...profiles, newProfile]);
        
        toast({
          title: "Profile created",
          description: `${currentProfile.name}'s profile has been added.`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we load your profiles.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                loadProfiles();
              }} 
              className="text-funsheets-purple hover:underline"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container py-20 px-4">
        <ProfilesGrid 
          profiles={profiles}
          onAddChild={handleAddChild}
          onEditChild={handleEditChild}
          onDeleteChild={handleDeleteChild}
          onCreateWorksheet={handleCreateWorksheet}
        />
        
        <RecentWorksheets hasProfiles={profiles.length > 0} />
      </div>
      
      <ChildProfileDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveProfile}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
        isEditing={isEditing}
      />
      
      <Footer />
    </div>
  );
};

export default Dashboard;
