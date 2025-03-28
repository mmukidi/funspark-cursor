
import React from "react";

interface MagicIllustrationProps {
  theme?: "space" | "soccer" | "science" | "math" | "general";
  className?: string;
}

export const MagicIllustration: React.FC<MagicIllustrationProps> = ({ 
  theme = "general",
  className = "" 
}) => {
  // This is a placeholder for a real illustration - in a real app, you'd use imported SVGs
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full rounded-2xl overflow-hidden relative">
        <div className={`
          absolute inset-0 z-0
          ${theme === "space" ? "bg-gradient-to-br from-funsheets-purple to-blue-900" : ""}
          ${theme === "soccer" ? "bg-gradient-to-br from-funsheets-green to-funsheets-blue" : ""}
          ${theme === "science" ? "bg-gradient-to-br from-funsheets-teal to-funsheets-blue" : ""}
          ${theme === "math" ? "bg-gradient-to-br from-funsheets-orange to-funsheets-yellow" : ""}
          ${theme === "general" ? "bg-gradient-to-br from-funsheets-purple to-funsheets-blue" : ""}
        `}></div>
        
        {/* Background elements */}
        <div className="absolute inset-0 z-10 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className={`
                absolute rounded-full
                ${theme === "space" ? "bg-white animate-pulse-glow" : ""}
                ${theme === "science" ? "border-2 border-white" : ""}
                ${theme === "math" ? "bg-white" : ""}
                ${theme === "general" || theme === "soccer" ? "bg-white" : ""}
              `}
              style={{
                width: `${Math.random() * 10 + 2}px`,
                height: `${Math.random() * 10 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating elements - simplified representation */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative w-3/4 h-3/4">
            {theme === "space" && (
              <>
                <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-yellow-200 animate-float"></div>
                <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full bg-gray-800 opacity-80 animate-bounce-gentle" style={{ animationDelay: "1s" }}></div>
              </>
            )}
            
            {theme === "soccer" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full opacity-90 animate-bounce-gentle border-2 border-black"></div>
            )}
            
            {theme === "science" && (
              <>
                <div className="absolute top-10 left-10 w-12 h-20 bg-blue-400 rounded-lg rotate-12 animate-float"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-400 rounded-full animate-bounce-gentle"></div>
              </>
            )}
            
            {theme === "math" && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold animate-float">
                123
              </div>
            )}
            
            {theme === "general" && (
              <>
                <div className="absolute top-0 left-5 w-16 h-16 bg-funsheets-yellow rounded-lg rotate-12 animate-float"></div>
                <div className="absolute top-10 right-10 w-12 h-12 bg-funsheets-orange rounded-full animate-bounce-gentle"></div>
                <div className="absolute bottom-5 left-1/4 w-14 h-14 bg-funsheets-blue rounded-lg -rotate-12 animate-float" style={{ animationDelay: "2s" }}></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
