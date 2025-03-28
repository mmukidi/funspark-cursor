
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-funsheets-purple to-funsheets-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Funsheets</span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-sm">
              Personalized, printable learning materials for kids based on their interests, 
              age, grade level, and school curriculum.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-funsheets-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-funsheets-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-funsheets-purple transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-funsheets-purple transition-colors">Home</Link></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-funsheets-purple transition-colors">How it Works</a></li>
              <li><a href="#benefits" className="text-gray-600 hover:text-funsheets-purple transition-colors">Benefits</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-funsheets-purple transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Info</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-funsheets-purple transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-funsheets-purple transition-colors">Terms of Use</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-funsheets-purple transition-colors">Contact Us</Link></li>
              <li><Link to="/feedback" className="text-gray-600 hover:text-funsheets-purple transition-colors">Feedback</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Funsheets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
