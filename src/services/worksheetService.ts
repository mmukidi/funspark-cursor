
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Worksheet {
  id: string;
  title: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: string;
  status: "New" | "Downloaded" | "Completed";
  childId: string;
  childName: string;
  rating?: number;
}

export interface WorksheetReview {
  id: string;
  worksheetId: string;
  rating: number;
  feedback?: string;
  studentFeedback?: string;
  createdAt: string;
}

// Fetch worksheets for the current user
export const fetchUserWorksheets = async () => {
  const { data: worksheets, error } = await supabase
    .from('worksheets')
    .select(`
      id,
      title,
      subject,
      difficulty,
      created_at,
      status,
      kid_id,
      rating,
      kids (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching worksheets:", error);
    return [];
  }

  return worksheets.map(worksheet => ({
    id: worksheet.id,
    title: worksheet.title || "Untitled Worksheet",
    subject: worksheet.subject || "General",
    difficulty: (worksheet.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
    createdAt: worksheet.created_at,
    status: (worksheet.status as "New" | "Downloaded" | "Completed") || "New",
    childId: worksheet.kid_id,
    childName: worksheet.kids?.name || "Unknown",
    rating: worksheet.rating
  }));
};

// Fetch a specific worksheet by ID
export const fetchWorksheetById = async (id: string) => {
  const { data, error } = await supabase
    .from('worksheets')
    .select(`
      id,
      title,
      subject,
      difficulty,
      created_at,
      status,
      kid_id,
      claude_response,
      kids (
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching worksheet:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title || "Untitled Worksheet",
    subject: data.subject || "General",
    difficulty: data.difficulty as "Easy" | "Medium" | "Hard",
    createdAt: data.created_at,
    status: data.status as "New" | "Downloaded" | "Completed",
    childId: data.kid_id,
    childName: data.kids?.name || "Unknown",
    content: data.claude_response || ""
  };
};

// Update worksheet status
export const updateWorksheetStatus = async (id: string, status: "New" | "Downloaded" | "Completed") => {
  const { error } = await supabase
    .from('worksheets')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating worksheet status:", error);
    return false;
  }

  return true;
};

// Submit worksheet review
export const submitWorksheetReview = async (
  worksheetId: string,
  rating: number,
  feedback?: string,
  studentFeedback?: string
) => {
  // First, check if a review already exists
  const { data: existingReview, error: checkError } = await supabase
    .from('worksheet_reviews')
    .select('id')
    .eq('worksheet_id', worksheetId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking for existing review:", checkError);
    return false;
  }

  if (existingReview) {
    // Update existing review
    const { error } = await supabase
      .from('worksheet_reviews')
      .update({
        rating,
        feedback,
        student_feedback: studentFeedback,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingReview.id);

    if (error) {
      console.error("Error updating review:", error);
      return false;
    }
  } else {
    // Insert new review
    const { error } = await supabase
      .from('worksheet_reviews')
      .insert({
        worksheet_id: worksheetId,
        rating,
        feedback,
        student_feedback: studentFeedback
      });

    if (error) {
      console.error("Error submitting review:", error);
      return false;
    }
  }

  // Also update the rating in the worksheets table for easy access
  const { error: worksheetError } = await supabase
    .from('worksheets')
    .update({ rating })
    .eq('id', worksheetId);

  if (worksheetError) {
    console.error("Error updating worksheet rating:", worksheetError);
  }

  return true;
};

// Fetch review for a specific worksheet
export const fetchWorksheetReview = async (worksheetId: string) => {
  const { data, error } = await supabase
    .from('worksheet_reviews')
    .select('*')
    .eq('worksheet_id', worksheetId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching worksheet review:", error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    worksheetId: data.worksheet_id,
    rating: data.rating,
    feedback: data.feedback,
    studentFeedback: data.student_feedback,
    createdAt: data.created_at
  };
};
