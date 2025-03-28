
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MagicIllustration } from "@/components/MagicIllustration";
import { TestimonialCard } from "@/components/TestimonialCard";
import { BenefitCard } from "@/components/BenefitCard";
import { Brain, Sparkles, Printer, FileText, Lock, Lightbulb } from "lucide-react";

const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent of 2",
      content: "Funsheets has transformed our after-school routine. My kids actually look forward to their worksheets because they're all about space and dinosaurs!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Elementary Teacher",
      content: "I recommend Funsheets to all parents in my class. The personalization makes such a difference in engagement levels compared to generic worksheets.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Parent of 3",
      content: "The soccer-themed math problems got my son to willingly practice multiplication. That's something I never thought I'd see!",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Unlock Personalized Learning for Your Child Today!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Generate customized, printable worksheets tailored to your child's interests, 
                age, and curriculum. Make learning fun and effective with Funsheets!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Now
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>
              
              {/* Quick benefits */}
              <div className="mt-12">
                <h3 className="font-medium text-gray-700 mb-4">Funsheets helps children:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-center text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <span className="text-green-500 text-sm">✓</span>
                    </div>
                    <span>Learn through their interests</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <span className="text-green-500 text-sm">✓</span>
                    </div>
                    <span>Reduce screen time</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <span className="text-green-500 text-sm">✓</span>
                    </div>
                    <span>Stay engaged with school subjects</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <span className="text-green-500 text-sm">✓</span>
                    </div>
                    <span>Develop critical thinking skills</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <MagicIllustration className="w-full h-[400px]" />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-[220px]">
                <p className="text-sm">
                  "My daughter loves the space-themed science worksheets!"
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-8 h-8 rounded-full bg-funsheets-purple flex items-center justify-center text-white text-xs font-bold">
                    JD
                  </div>
                  <span className="ml-2 text-xs font-medium">Jessica Davis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How Funsheets Works</h2>
            <p className="text-gray-600">
              Our simple 3-step process creates personalized learning materials that your kids will actually enjoy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-funsheets-purple/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-funsheets-purple font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Child Profiles</h3>
              <p className="text-gray-600">
                Add your child's age, grade, school type, and their favorite interests like space, soccer, or dinosaurs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-funsheets-orange/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-funsheets-orange font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Generate Worksheets</h3>
              <p className="text-gray-600">
                Our AI creates personalized worksheets based on your child's profile and the subject you choose.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-funsheets-blue/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-funsheets-blue font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Print & Learn</h3>
              <p className="text-gray-600">
                Download, print, and watch as your child engages with learning materials designed just for them.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/login">
              <Button size="lg">
                Create Your First Worksheet
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Funsheets?</h2>
            <p className="text-gray-600">
              Discover how our personalized worksheets transform learning into an adventure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard 
              icon={Brain}
              title="Enhanced Brain Activity"
              description="Engages multiple cognitive pathways with custom activities tailored to your child's interests."
              color="text-funsheets-purple"
            />
            
            <BenefitCard 
              icon={Printer}
              title="Reduced Screen Time"
              description="Printable learning keeps kids off screens while staying intellectually engaged."
              color="text-funsheets-blue"
            />
            
            <BenefitCard 
              icon={Sparkles}
              title="Fun-Filled Adventures"
              description="Worksheets turn soccer, stars, and science into magical learning journeys."
              color="text-funsheets-orange"
            />
            
            <BenefitCard 
              icon={FileText}
              title="AI-Personalized Content"
              description="Tailored to every child's learning style, grade level, and areas of curiosity."
              color="text-funsheets-teal"
            />
            
            <BenefitCard 
              icon={Lock}
              title="Secure and Private"
              description="Parent-controlled, COPPA-compliant, with no distractions or advertisements."
              color="text-funsheets-blue"
            />
            
            <BenefitCard 
              icon={Lightbulb}
              title="Supports Multiple Learning Goals"
              description="Boosts curiosity, creativity, logical thinking, and core subject skills."
              color="text-funsheets-yellow"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 px-4">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What Parents Say</h2>
            <p className="text-gray-600">
              Join hundreds of satisfied families using Funsheets to enhance their children's education
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`transition-opacity duration-500 ${index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 right-0'}`}
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === activeTestimonial ? 'bg-funsheets-purple' : 'bg-gray-300'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-funsheets-purple to-funsheets-blue text-white px-4">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Learning?</h2>
            <p className="mb-8 text-white/80">
              Join Funsheets today and create personalized worksheets that make learning a joy for your children.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
