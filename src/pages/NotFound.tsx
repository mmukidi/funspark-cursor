
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MagicIllustration } from "@/components/MagicIllustration";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="mb-8 mx-auto w-64 h-64">
            <MagicIllustration theme="general" className="w-full h-full" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 gradient-text">Oops!</h1>
          <p className="text-xl text-gray-600 mb-8">
            We couldn't find the page you're looking for.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button onClick={() => navigate("/")}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
