import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ChildProfileCardProps {
  id: string;
  name: string;
  age: number;
  grade: string;
  schoolType: string;
  interests: string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateWorksheet: (id: string) => void;
}

export const ChildProfileCard: React.FC<ChildProfileCardProps> = ({
  id,
  name,
  age,
  grade,
  schoolType,
  interests,
  onEdit,
  onDelete,
  onCreateWorksheet
}) => {
  return (
    <Card className="neumorphic border-none h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-funsheets-purple to-funsheets-blue flex items-center justify-center text-white text-xl font-bold">
            {name.charAt(0)}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(id)}
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(id)}
            >
              <Trash2 size={16} className="text-destructive" />
            </Button>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-gray-600 mb-4">Age: {age} • Grade: {grade}</p>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">School Type</p>
          <p className="font-medium">{schoolType}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span 
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-funsheets-purple/10 text-funsheets-purple"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full"
          onClick={() => onCreateWorksheet(id)}
        >
          Create Worksheet
        </Button>
      </CardFooter>
    </Card>
  );
};
