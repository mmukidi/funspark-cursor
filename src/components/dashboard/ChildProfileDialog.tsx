import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ChildProfile {
  id: string;
  name: string;
  age: number | null;
  grade: string | null;
  schoolType: string;
  interests: string[];
}

interface ChildProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (e: React.FormEvent) => void;
  currentProfile: ChildProfile;
  setCurrentProfile: React.Dispatch<React.SetStateAction<ChildProfile>>;
  isEditing: boolean;
}

const SUGGESTED_INTERESTS = [
  "Video Games",
  "Astronomy",
  "Dinosaurs",
  "Fortnite",
  "Minecraft",
  "Roblox",
  "Pokemon",
  "Space Exploration",
  "Animals",
  "Science Experiments",
  "Coding",
  "Drawing"
];

export const ChildProfileDialog = ({
  isOpen,
  onOpenChange,
  onSave,
  currentProfile,
  setCurrentProfile,
  isEditing,
}: ChildProfileDialogProps) => {
  const [interestsInput, setInterestsInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // When the dialog opens, set the interests input to the current interests
    setInterestsInput(currentProfile.interests.join(', '));
    setShowSuggestions(false);
  }, [currentProfile.interests, isOpen]);

  const handleInterestsChange = (value: string) => {
    setInterestsInput(value);
    // Split by comma, trim whitespace, and filter out empty strings
    const interestsList = value.split(',')
      .map(interest => interest.trim())
      .filter(interest => interest !== '');
    
    setCurrentProfile({
      ...currentProfile,
      interests: interestsList
    });
  };

  const addInterest = (interest: string) => {
    if (!currentProfile.interests.includes(interest)) {
      setCurrentProfile({
        ...currentProfile,
        interests: [...currentProfile.interests, interest]
      });
      setInterestsInput('');
      setShowSuggestions(false);
    }
  };

  const removeInterest = (interest: string) => {
    setCurrentProfile({
      ...currentProfile,
      interests: currentProfile.interests.filter(i => i !== interest)
    });
  };

  const filteredSuggestions = SUGGESTED_INTERESTS.filter(interest => 
    interest.toLowerCase().includes(interestsInput.toLowerCase()) &&
    !currentProfile.interests.includes(interest)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit ${currentProfile.name}'s Profile` : "Add Child Profile"}
          </DialogTitle>
          <DialogDescription>
            Fill in your child's details to create personalized worksheets.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSave}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Child's Name</Label>
              <Input 
                id="name" 
                value={currentProfile.name}
                onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  min="3" 
                  max="18"
                  value={currentProfile.age || ""}
                  onChange={(e) => setCurrentProfile({...currentProfile, age: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="grade">Grade</Label>
                <Select 
                  value={currentProfile.grade || ""} 
                  onValueChange={(value) => setCurrentProfile({...currentProfile, grade: value})}
                >
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-K">Pre-K</SelectItem>
                    <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="1st Grade">1st Grade</SelectItem>
                    <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                    <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                    <SelectItem value="4th Grade">4th Grade</SelectItem>
                    <SelectItem value="5th Grade">5th Grade</SelectItem>
                    <SelectItem value="6th Grade">6th Grade</SelectItem>
                    <SelectItem value="7th Grade">7th Grade</SelectItem>
                    <SelectItem value="8th Grade">8th Grade</SelectItem>
                    <SelectItem value="9th Grade">9th Grade</SelectItem>
                    <SelectItem value="10th Grade">10th Grade</SelectItem>
                    <SelectItem value="11th Grade">11th Grade</SelectItem>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-type">School Type</Label>
              <Select 
                value={currentProfile.schoolType} 
                onValueChange={(value) => setCurrentProfile({...currentProfile, schoolType: value})}
              >
                <SelectTrigger id="school-type">
                  <SelectValue placeholder="Select school type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Charter">Charter</SelectItem>
                  <SelectItem value="Magnet">Magnet</SelectItem>
                  <SelectItem value="Homeschool">Homeschool</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="interests">Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                id="interests"
                value={interestsInput}
                onChange={(e) => handleInterestsChange(e.target.value)}
                placeholder="Enter interests separated by commas (e.g. Video Games, Astronomy, Dinosaurs, Fortnite)"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => addInterest(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Add your child's interests separated by commas
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
