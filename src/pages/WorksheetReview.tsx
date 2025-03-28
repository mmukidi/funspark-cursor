
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWorksheetById, submitWorksheetReview, fetchWorksheetReview } from "@/services/worksheetService";

const reactions = [
  { emoji: "😃", label: "Fun" },
  { emoji: "🧠", label: "Educational" },
  { emoji: "😕", label: "Confusing" },
  { emoji: "😴", label: "Boring" },
  { emoji: "🔥", label: "Challenging" },
  { emoji: "👍", label: "Just Right" }
];

const WorksheetReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [worksheet, setWorksheet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  
  useEffect(() => {
    const loadWorksheet = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const worksheetData = await fetchWorksheetById(id);
        if (!worksheetData) {
          toast({
            title: "Error",
            description: "Worksheet not found. Please try again.",
            variant: "destructive"
          });
          navigate('/history');
          return;
        }
        
        setWorksheet(worksheetData);
        
        // Load existing review if any
        const reviewData = await fetchWorksheetReview(id);
        if (reviewData) {
          setRating(reviewData.rating || 0);
          setFeedback(reviewData.feedback || "");
          if (reviewData.studentFeedback) {
            setSelectedReactions(reviewData.studentFeedback.split(',').filter(Boolean));
          }
        }
      } catch (error) {
        console.error("Error loading worksheet:", error);
        toast({
          title: "Error",
          description: "Failed to load worksheet. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadWorksheet();
  }, [id, navigate, toast]);
  
  const handleReactionToggle = (emoji: string) => {
    if (selectedReactions.includes(emoji)) {
      setSelectedReactions(selectedReactions.filter(r => r !== emoji));
    } else {
      setSelectedReactions([...selectedReactions, emoji]);
    }
  };
  
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  const handleSubmit = async () => {
    if (!id || rating === 0) return;
    
    setSubmitting(true);
    try {
      const studentFeedback = selectedReactions.join(',');
      const success = await submitWorksheetReview(id, rating, feedback, studentFeedback);
      
      if (success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback! It helps us improve future worksheets.",
        });
        
        setTimeout(() => {
          navigate("/history");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-20 px-4 flex items-center justify-center">
          <p className="text-gray-600">Loading worksheet...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!worksheet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-20 px-4 flex items-center justify-center">
          <p className="text-gray-600">Worksheet not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container py-20 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            ← Back to History
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Rate & Review Worksheet</h1>
          <p className="text-gray-600">
            Your feedback helps us create better worksheets for your child.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="neumorphic border-none">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Worksheet Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{worksheet.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{worksheet.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-medium">{worksheet.difficulty}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Created For</p>
                    <p className="font-medium">{worksheet.childName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-medium">
                      {new Date(worksheet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="neumorphic-inset p-6 rounded-xl font-mono text-sm whitespace-pre-wrap mt-6 max-h-[400px] overflow-y-auto">
              {worksheet.content}
            </div>
          </div>
          
          <div>
            <Card className="neumorphic border-none">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Your Review</h2>
                
                <div className="space-y-8">
                  <div>
                    <Label className="mb-3 block">How would you rate this worksheet?</Label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRatingChange(value)}
                          onMouseEnter={() => setHoveredRating(value)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1"
                        >
                          <Star 
                            size={32} 
                            className={`
                              ${(hoveredRating || rating) >= value 
                                ? "fill-funsheets-yellow text-funsheets-yellow" 
                                : "text-gray-300"}
                              transition-all
                            `} 
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {rating === 1 && "Needs improvement"}
                      {rating === 2 && "Could be better"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Great"}
                      {rating === 5 && "Excellent!"}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="mb-3 block">How did your child react to the worksheet?</Label>
                    <div className="flex flex-wrap gap-2">
                      {reactions.map(reaction => (
                        <button
                          key={reaction.emoji}
                          onClick={() => handleReactionToggle(reaction.emoji)}
                          className={`
                            flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-all
                            ${selectedReactions.includes(reaction.emoji)
                              ? "bg-funsheets-purple/10 text-funsheets-purple"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
                          `}
                        >
                          <span className="text-lg">{reaction.emoji}</span>
                          <span>{reaction.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="feedback" className="mb-3 block">
                      Detailed Feedback (Optional)
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="What did you like or dislike about this worksheet? How could we improve it?"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="resize-none h-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmit} 
                    disabled={rating === 0 || submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WorksheetReview;
