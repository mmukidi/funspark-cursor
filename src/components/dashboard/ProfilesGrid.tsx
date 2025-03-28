import { ChildProfileCard } from "@/components/ChildProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  schoolType: string;
  interests: string[];
}

interface ProfilesGridProps {
  profiles: ChildProfile[];
  onAddChild: () => void;
  onEditChild: (id: string) => void;
  onDeleteChild: (id: string) => void;
  onCreateWorksheet: (id: string) => void;
}

export const ProfilesGrid = ({
  profiles,
  onAddChild,
  onEditChild,
  onDeleteChild,
  onCreateWorksheet
}: ProfilesGridProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kid Profiles</h1>
          <p className="text-gray-600">
            {profiles.length === 0
              ? "Add your first kid profile to get started!"
              : "Create personalized worksheets for your kids."}
          </p>
        </div>
        <Button onClick={onAddChild} className="flex items-center gap-2">
          <Plus size={16} />
          Add Child
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <img
              src="/empty-state.svg"
              alt="No profiles"
              className="w-48 mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Profiles Yet</h2>
          <p className="text-gray-600 mb-6">
            Add your first kid profile to start creating personalized worksheets.
          </p>
          <Button onClick={onAddChild} className="flex items-center gap-2">
            <Plus size={16} />
            Add Child
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ChildProfileCard
              key={profile.id}
              {...profile}
              onEdit={onEditChild}
              onDelete={onDeleteChild}
              onCreateWorksheet={onCreateWorksheet}
            />
          ))}
        </div>
      )}
    </div>
  );
};
