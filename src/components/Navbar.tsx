import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Define the props interface for the Navbar component
interface NavbarProps {
  // isLoggedIn prop is optional with a default value of false
  isLoggedIn?: boolean;
}

export const Navbar = ({ isLoggedIn: propIsLoggedIn }: NavbarProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Use the prop value if provided, otherwise fallback to auth context
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : !!user;

  return (
    <nav className="w-full py-4 bg-white/80 backdrop-blur-sm fixed top-0 z-50 shadow-sm">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-funsheets-purple to-funsheets-blue flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-bold gradient-text">Funsheets</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-medium hover:text-funsheets-purple transition-colors">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="font-medium hover:text-funsheets-purple transition-colors">
                  Dashboard
                </Link>
                <Link to="/generator" className="font-medium hover:text-funsheets-purple transition-colors">
                  Create Worksheet
                </Link>
                <Link to="/history" className="font-medium hover:text-funsheets-purple transition-colors">
                  History
                </Link>
              </>
            ) : (
              <>
                <a href="#how-it-works" className="font-medium hover:text-funsheets-purple transition-colors">
                  How it Works
                </a>
                <a href="#benefits" className="font-medium hover:text-funsheets-purple transition-colors">
                  Benefits
                </a>
                <a href="#testimonials" className="font-medium hover:text-funsheets-purple transition-colors">
                  Testimonials
                </a>
              </>
            )}
          </div>

          {isLoggedIn ? (
            <Button onClick={signOut}>Sign Out</Button>
          ) : (
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 z-50">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-funsheets-purple transition-colors">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="font-medium hover:text-funsheets-purple transition-colors">
                  Dashboard
                </Link>
                <Link to="/generator" className="font-medium hover:text-funsheets-purple transition-colors">
                  Create Worksheet
                </Link>
                <Link to="/history" className="font-medium hover:text-funsheets-purple transition-colors">
                  History
                </Link>
              </>
            ) : (
              <>
                <a href="#how-it-works" className="font-medium hover:text-funsheets-purple transition-colors">
                  How it Works
                </a>
                <a href="#benefits" className="font-medium hover:text-funsheets-purple transition-colors">
                  Benefits
                </a>
                <a href="#testimonials" className="font-medium hover:text-funsheets-purple transition-colors">
                  Testimonials
                </a>
              </>
            )}
            {isLoggedIn ? (
              <Button className="w-full" onClick={signOut}>Sign Out</Button>
            ) : (
              <Link to="/login">
                <Button className="w-full">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
