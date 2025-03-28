
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  rating,
  imageUrl
}) => {
  return (
    <Card className="neumorphic border-none transition-all hover:translate-y-[-5px]">
      <CardContent className="p-6">
        <div className="flex space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "fill-funsheets-yellow text-funsheets-yellow" : "text-gray-300"}
            />
          ))}
        </div>
        
        <p className="text-gray-700 mb-6">{content}</p>
        
        <div className="flex items-center space-x-3">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-funsheets-purple to-funsheets-blue flex items-center justify-center text-white font-bold">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
