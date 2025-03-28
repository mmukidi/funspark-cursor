
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon: Icon,
  title,
  description,
  color = "text-funsheets-purple"
}) => {
  return (
    <Card className="neumorphic border-none transition-all hover:translate-y-[-5px]">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
          <Icon size={24} className={color} />
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};
