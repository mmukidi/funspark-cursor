import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [overallRating, setOverallRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [featureRequest, setFeatureRequest] = useState<string>("");
  const [usability, setUsability] = useState<string>("");
  const [mostValuable, setMostValuable] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (overallRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide an overall rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setTimeout(() => {
      setSubmitted(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your valuable feedback!",
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">Feedback & Suggestions</h1>
        <p className="text-gray-600 mb-8">
          Help us improve Funsheets by sharing your experience and ideas.
        </p>
        
        {!submitted ? (
          <Card className="neumorphic border-none">
            <CardContent className="p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <Label className="mb-3 block text-lg">Overall Experience</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setOverallRating(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1"
                      >
                        <Star 
                          size={36} 
                          className={`
                            ${(hoveredRating || overallRating) >= value 
                              ? "fill-funsheets-yellow text-funsheets-yellow" 
                              : "text-gray-300"}
                            transition-all
                          `} 
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {overallRating === 1 && "Very Dissatisfied"}
                    {overallRating === 2 && "Dissatisfied"}
                    {overallRating === 3 && "Neutral"}
                    {overallRating === 4 && "Satisfied"}
                    {overallRating === 5 && "Very Satisfied"}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="detailed-feedback" className="mb-3 block text-lg">
                    What do you think of Funsheets?
                  </Label>
                  <Textarea
                    id="detailed-feedback"
                    placeholder="Share your experience with Funsheets. What did you like or dislike?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="resize-none h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="feature-request" className="mb-3 block text-lg">
                    Feature Request
                  </Label>
                  <Textarea
                    id="feature-request"
                    placeholder="Is there something you'd like us to add or improve? Let us know!"
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    className="resize-none h-32"
                  />
                </div>
                
                <div>
                  <Label className="mb-3 block text-lg">
                    How easy is Funsheets to use?
                  </Label>
                  <RadioGroup value={usability} onValueChange={setUsability} className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-easy" id="very-easy" />
                      <Label htmlFor="very-easy">Very easy - I had no trouble at all</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mostly-easy" id="mostly-easy" />
                      <Label htmlFor="mostly-easy">Mostly easy - I figured it out with minimal effort</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="neutral" />
                      <Label htmlFor="neutral">Neutral - It was okay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-difficult" id="somewhat-difficult" />
                      <Label htmlFor="somewhat-difficult">Somewhat difficult - I had some trouble</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-difficult" id="very-difficult" />
                      <Label htmlFor="very-difficult">Very difficult - I needed help</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="mb-3 block text-lg">
                    What feature do you find most valuable?
                  </Label>
                  <RadioGroup value={mostValuable} onValueChange={setMostValuable} className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="personalization" id="personalization" />
                      <Label htmlFor="personalization">Personalization based on interests</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="printable" id="printable" />
                      <Label htmlFor="printable">Printable worksheets (reduced screen time)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="variety" id="variety" />
                      <Label htmlFor="variety">Variety of subjects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="difficulty" id="difficulty" />
                      <Label htmlFor="difficulty">Adjustable difficulty levels</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="curriculum" id="curriculum" />
                      <Label htmlFor="curriculum">Alignment with school curriculum</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full mt-6"
                  size="lg"
                >
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="neumorphic border-none">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Thank You for Your Feedback!</h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Your input is incredibly valuable to us. We're constantly working to improve 
                Funsheets based on parent and educator feedback.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={() => navigate("/generator")}
                >
                  Create a Worksheet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Feedback;
