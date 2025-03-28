
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Clock, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUserWorksheets } from "@/services/worksheetService";
import { useToast } from "@/hooks/use-toast";

interface RecentWorksheetsProps {
  hasProfiles: boolean;
}

export const RecentWorksheets = ({ hasProfiles }: RecentWorksheetsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recent");
  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadWorksheets = async () => {
      if (activeTab === "history") {
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
      }
    };
    
    loadWorksheets();
  }, [activeTab, toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleRateWorksheet = (id: string) => {
    navigate(`/review/${id}`);
  };

  return (
    <div className="mt-16">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Worksheets</h2>
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="recent">
          {hasProfiles ? (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <p className="text-gray-600 mb-4">
                No worksheets created yet. Start by creating your first personalized worksheet!
              </p>
              <Button onClick={() => navigate("/generator")}>
                Create New Worksheet
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <p className="text-gray-600">
                Please add a child profile first before creating worksheets.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading worksheets...</p>
            </div>
          ) : worksheets.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {worksheets.slice(0, 5).map((worksheet) => (
                      <TableRow key={worksheet.id}>
                        <TableCell className="font-medium">{worksheet.title}</TableCell>
                        <TableCell>{worksheet.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(worksheet.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={14} />
                            <span>{formatTime(worksheet.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {worksheet.rating ? (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < worksheet.rating! ? "fill-funsheets-yellow text-funsheets-yellow" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not rated</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/history`)}
                            >
                              View
                            </Button>
                            {!worksheet.rating && (
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleRateWorksheet(worksheet.id)}
                              >
                                Rate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => navigate("/history")}>
                    View All Worksheets
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <p className="text-gray-600 mb-4">
                No worksheet history available yet.
              </p>
              <Button onClick={() => navigate("/generator")}>
                Create Your First Worksheet
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
