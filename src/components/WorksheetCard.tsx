
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, FileText, RefreshCw, Star } from "lucide-react";

interface WorksheetCardProps {
  id: string;
  title: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
  rating?: number;
  status: "New" | "Downloaded" | "Completed";
  childName: string;
  onDownload: (id: string) => void;
  onRegenerate: (id: string) => void;
  onMarkCompleted: (id: string) => void;
}

export const WorksheetCard: React.FC<WorksheetCardProps> = ({
  id,
  title,
  subject,
  difficulty,
  createdAt,
  rating,
  status,
  childName,
  onDownload,
  onRegenerate,
  onMarkCompleted
}) => {
  // Color for difficulty
  const difficultyColor = 
    difficulty === "Easy" ? "text-green-500 bg-green-50" :
    difficulty === "Medium" ? "text-orange-500 bg-orange-50" :
    "text-red-500 bg-red-50";
  
  // Color for status
  const statusColor = 
    status === "New" ? "text-blue-500 bg-blue-50" :
    status === "Downloaded" ? "text-purple-500 bg-purple-50" :
    "text-green-500 bg-green-50";

  // Date formatting
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  return (
    <Card className="neumorphic border-none h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <FileText size={20} className="text-funsheets-purple" />
          </div>
          <div className="flex space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
              {difficulty}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
              {status}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-gray-600 mb-1">Subject: {subject}</p>
        <p className="text-gray-600 mb-3">For: {childName}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Created: {formattedDate}</span>
          {rating && (
            <div className="flex items-center">
              <Star size={14} className="fill-funsheets-yellow text-funsheets-yellow mr-1" />
              <span>{rating}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-2">
        <Button 
          variant="outline"
          onClick={() => onDownload(id)}
          className="flex items-center gap-1"
        >
          <Download size={16} />
          <span>Download</span>
        </Button>
        
        {status !== "Completed" ? (
          <Button 
            variant="outline"
            onClick={() => onMarkCompleted(id)}
          >
            Mark Completed
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={() => onRegenerate(id)}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} />
            <span>Regenerate</span>
          </Button>
        )}
        
        <Link to={`/review/${id}`} className="col-span-2">
          <Button className="w-full">
            Rate & Review
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
