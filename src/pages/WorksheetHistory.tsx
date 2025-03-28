
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WorksheetCard } from "@/components/WorksheetCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchUserWorksheets, updateWorksheetStatus } from "@/services/worksheetService";

const WorksheetHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    child: "all",
    subject: "all",
    status: "all",
    difficulty: "all"
  });
  
  useEffect(() => {
    const loadWorksheets = async () => {
      setLoading(true);
      try {
        const data = await fetchUserWorksheets();
        setWorksheets(data);
      } catch (error) {
        console.error("Error fetching worksheets:", error);
        toast({
          title: "Error",
          description: "Failed to load worksheet history. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadWorksheets();
  }, [toast]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const handleDownload = async (id: string) => {
    const success = await updateWorksheetStatus(id, "Downloaded");
    
    if (success) {
      toast({
        title: "Worksheet downloaded",
        description: "Your worksheet has been saved to your device.",
      });
      
      // Update the worksheet status in the local state
      setWorksheets(
        worksheets.map(worksheet => 
          worksheet.id === id && worksheet.status === "New" 
            ? { ...worksheet, status: "Downloaded" as const }
            : worksheet
        )
      );
    } else {
      toast({
        title: "Error",
        description: "Failed to update worksheet status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRegenerate = (id: string) => {
    toast({
      title: "Regenerating worksheet",
      description: "Creating a new version of this worksheet...",
    });
    
    setTimeout(() => {
      navigate(`/generator?regenerate=${id}`);
    }, 1000);
  };
  
  const handleMarkCompleted = async (id: string) => {
    const success = await updateWorksheetStatus(id, "Completed");
    
    if (success) {
      toast({
        title: "Worksheet completed",
        description: "Great job! The worksheet has been marked as completed.",
      });
      
      // Update the worksheet status in the local state
      setWorksheets(
        worksheets.map(worksheet => 
          worksheet.id === id 
            ? { ...worksheet, status: "Completed" as const }
            : worksheet
        )
      );
    } else {
      toast({
        title: "Error",
        description: "Failed to update worksheet status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredWorksheets = worksheets.filter(worksheet => {
    return (
      (filters.search === "" || 
        worksheet.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        worksheet.subject.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.child === "all" || worksheet.childId === filters.child) &&
      (filters.subject === "all" || worksheet.subject === filters.subject) &&
      (filters.status === "all" || worksheet.status === filters.status) &&
      (filters.difficulty === "all" || worksheet.difficulty === filters.difficulty)
    );
  });
  
  const sortedWorksheets = [...filteredWorksheets].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const uniqueChildren = Array.from(new Set(worksheets.map(w => w.childId))).map(
    id => ({
      id,
      name: worksheets.find(w => w.childId === id)?.childName || ""
    })
  );
  
  const uniqueSubjects = Array.from(new Set(worksheets.map(w => w.subject)));
  const uniqueStatuses = Array.from(new Set(worksheets.map(w => w.status)));
  const uniqueDifficulties = Array.from(new Set(worksheets.map(w => w.difficulty)));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container py-20 px-4 flex items-center justify-center">
          <p className="text-gray-600">Loading worksheets...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container py-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Worksheet History</h1>
            <p className="text-gray-600">
              View, download, and manage all your generated worksheets.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/generator")}
            className="mt-4 md:mt-0"
          >
            Create New Worksheet
          </Button>
        </div>
        
        <div className="mb-8 neumorphic p-6 rounded-xl">
          <h2 className="font-bold mb-4">Filter Worksheets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by title or subject..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select 
                value={filters.child} 
                onValueChange={(value) => handleFilterChange("child", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {uniqueChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={filters.subject} 
                onValueChange={(value) => handleFilterChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {sortedWorksheets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorksheets.map(worksheet => (
              <WorksheetCard
                key={worksheet.id}
                id={worksheet.id}
                title={worksheet.title}
                subject={worksheet.subject}
                difficulty={worksheet.difficulty}
                createdAt={worksheet.createdAt}
                rating={worksheet.rating}
                status={worksheet.status}
                childName={worksheet.childName}
                onDownload={handleDownload}
                onRegenerate={handleRegenerate}
                onMarkCompleted={handleMarkCompleted}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold mb-2">No Worksheets Found</h3>
            <p className="text-gray-600 mb-6">
              {worksheets.length === 0
                ? "You haven't created any worksheets yet."
                : "No worksheets match your current filters."}
            </p>
            {worksheets.length === 0 ? (
              <Button onClick={() => navigate("/generator")}>
                Create Your First Worksheet
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setFilters({ search: "", child: "all", subject: "all", status: "all", difficulty: "all" })}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default WorksheetHistory;
