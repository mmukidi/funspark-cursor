import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { MagicIllustration } from "@/components/MagicIllustration";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockProfiles = [
  {
    id: "1",
    name: "Alex Johnson",
    age: 8,
    grade: "3rd Grade",
    schoolType: "Public",
    interests: [
      { name: "Space", color: "bg-funsheets-purple/10 text-funsheets-purple" },
      { name: "Soccer", color: "bg-funsheets-blue/10 text-funsheets-blue" },
      { name: "Dinosaurs", color: "bg-funsheets-orange/10 text-funsheets-orange" }
    ]
  },
  {
    id: "2",
    name: "Sophia Davis",
    age: 10,
    grade: "5th Grade",
    schoolType: "Magnet",
    interests: [
      { name: "Science", color: "bg-funsheets-teal/10 text-funsheets-teal" },
      { name: "Art", color: "bg-funsheets-pink/10 text-pink-500" },
      { name: "Math", color: "bg-funsheets-blue/10 text-funsheets-blue" }
    ]
  }
];

const subjects = [
  { id: "math", name: "Math", icon: "📊" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "english", name: "English/Language Arts", icon: "📝" },
  { id: "logic", name: "Logic & Reasoning", icon: "🧩" },
  { id: "finance", name: "Financial Literacy", icon: "💰" }
];

const WorksheetGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const queryParams = new URLSearchParams(location.search);
  const childIdFromUrl = queryParams.get("childId");
  
  const [selectedChild, setSelectedChild] = useState<string>(childIdFromUrl || "");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(2); // 1 = Easy, 2 = Medium, 3 = Hard
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<string>("");
  
  const generateWorksheet = () => {
    if (!selectedChild || !selectedSubject) {
      toast({
        title: "Missing information",
        description: "Please select a child and subject",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockWorksheet = `# ${getSubjectName(selectedSubject)} Worksheet for ${getChildName(selectedChild)}
      
## ${getDifficultyLabel(difficulty)} Level

1. Question one about ${getInterestsForChild(selectedChild)[0]?.name || 'general topics'}
2. Question two about ${getSubjectName(selectedSubject)}
3. Question three combining ${getSubjectName(selectedSubject)} with ${getInterestsForChild(selectedChild)[0]?.name || 'general topics'}
4. ${customInstructions ? 'Custom question: ' + customInstructions : 'Additional practice question'}
5. Bonus challenge question

Good luck, ${getChildName(selectedChild)}!`;
      
      setGeneratedWorksheet(mockWorksheet);
      setIsGenerating(false);
      
      const newWorksheet = {
        id: Date.now().toString(),
        title: `${getSubjectName(selectedSubject)} Worksheet`,
        subject: getSubjectName(selectedSubject),
        difficulty: getDifficultyLabel(difficulty),
        createdAt: new Date().toISOString(),
        childId: selectedChild,
        content: mockWorksheet
      };
      
      toast({
        title: "Worksheet generated!",
        description: "Your personalized worksheet is ready to download.",
      });
    }, 3000);
  };
  
  const getChildName = (id: string) => {
    const child = mockProfiles.find(profile => profile.id === id);
    return child ? child.name : "Unknown Child";
  };
  
  const getSubjectName = (id: string) => {
    const subject = subjects.find(subj => subj.id === id);
    return subject ? subject.name : "General";
  };
  
  const getInterestsForChild = (id: string) => {
    const child = mockProfiles.find(profile => profile.id === id);
    return child ? child.interests : [];
  };
  
  const getDifficultyLabel = (value: number) => {
    return value === 1 ? "Easy" : value === 2 ? "Medium" : "Hard";
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedWorksheet], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${getSubjectName(selectedSubject)}_Worksheet_${getChildName(selectedChild)}.txt`;
    document.body.appendChild(element);
    element.click();
    
    toast({
      title: "Worksheet downloaded",
      description: "Your worksheet has been saved to your device.",
    });
    
    setTimeout(() => {
      navigate("/history");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">Worksheet Generator</h1>
        <p className="text-gray-600 mb-8">
          Create personalized educational worksheets tailored to your child's interests and needs.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {!generatedWorksheet ? (
            <>
              <div>
                <div className="neumorphic p-6 rounded-xl mb-8">
                  <h2 className="text-xl font-bold mb-6">Worksheet Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="child-select" className="mb-2 block">Select Child</Label>
                      <Select value={selectedChild} onValueChange={setSelectedChild}>
                        <SelectTrigger id="child-select">
                          <SelectValue placeholder="Choose a child" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProfiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.name} ({profile.grade})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject-select" className="mb-2 block">Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger id="subject-select">
                          <SelectValue placeholder="Choose a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.icon} {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="mb-3 block">Difficulty Level</Label>
                      <div className="px-2">
                        <Slider
                          value={[difficulty]}
                          onValueChange={(value) => setDifficulty(value[0])}
                          min={1}
                          max={3}
                          step={1}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Easy</span>
                          <span>Medium</span>
                          <span>Hard</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-instructions" className="mb-2 block">Custom Instructions (Optional)</Label>
                      <Textarea
                        id="custom-instructions"
                        placeholder="Add any specific topics, questions, or instructions..."
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        className="resize-none h-24"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={generateWorksheet} 
                  disabled={isGenerating || !selectedChild || !selectedSubject}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? "Creating Your Worksheet..." : "Generate Worksheet"}
                </Button>
              </div>
              
              <div>
                <div className="neumorphic p-6 rounded-xl h-full">
                  <h2 className="text-xl font-bold mb-6">Worksheet Preview</h2>
                  
                  {selectedChild && selectedSubject ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">Creating a <strong>{getSubjectName(selectedSubject)}</strong> worksheet for <strong>{getChildName(selectedChild)}</strong>.</p>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Based on:</p>
                        <ul className="mt-2 space-y-1">
                          <li>• Grade: {mockProfiles.find(p => p.id === selectedChild)?.grade}</li>
                          <li>• Interests: {getInterestsForChild(selectedChild).map(i => i.name).join(", ")}</li>
                          <li>• Difficulty: {getDifficultyLabel(difficulty)}</li>
                        </ul>
                      </div>
                      
                      <MagicIllustration 
                        theme={
                          selectedSubject === "math" ? "math" : 
                          selectedSubject === "science" ? "science" : 
                          getInterestsForChild(selectedChild)[0]?.name === "Space" ? "space" :
                          getInterestsForChild(selectedChild)[0]?.name === "Soccer" ? "soccer" : 
                          "general"
                        } 
                        className="h-48 mt-4" 
                      />
                      
                      {isGenerating && (
                        <div className="mt-4 text-center text-sm text-gray-500">
                          <div className="animate-pulse">
                            Creating a personalized worksheet...
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-8">
                      <FileText size={48} className="mb-4 opacity-30" />
                      <p>Select a child and subject to preview your worksheet.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="neumorphic p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold">Your Worksheet is Ready!</h2>
                    <Button variant="outline" onClick={() => setGeneratedWorksheet("")}>
                      Create Another
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 mb-1">Generated for:</p>
                      <p className="font-medium">{getChildName(selectedChild)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-1">Subject:</p>
                      <p className="font-medium">{getSubjectName(selectedSubject)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 mb-1">Difficulty:</p>
                      <p className="font-medium">{getDifficultyLabel(difficulty)}</p>
                    </div>
                    
                    <Button 
                      onClick={handleDownload} 
                      className="w-full mt-4 flex items-center justify-center gap-2"
                      size="lg"
                    >
                      <Download size={18} />
                      <span>Download Worksheet</span>
                    </Button>
                    
                    <p className="text-sm text-gray-500 text-center">
                      Your worksheet will also be saved to your history
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="neumorphic-inset p-6 rounded-xl font-mono text-sm whitespace-pre-wrap h-full overflow-y-auto">
                  {generatedWorksheet}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WorksheetGenerator;
