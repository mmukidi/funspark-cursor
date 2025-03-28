
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagicIllustration } from "@/components/MagicIllustration";
import Dashboard from "@/pages/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { user, isLoading, signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showDashboardPreview, setShowDashboardPreview] = useState(false);

  // Add debug info to help trace login issues
  console.log("Login component rendered, user:", user, "isLoading:", isLoading);

  // Add more detailed error handling for redirect
  if (user && !isLoading) {
    console.log("User authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }

  if (showDashboardPreview) {
    console.log("Showing dashboard preview");
    return <Dashboard />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in attempt with email:", signInEmail);
    try {
      await signIn(signInEmail, signInPassword);
      // Success feedback will be handled in AuthContext
    } catch (error) {
      console.error("Error during sign in:", error);
      // Toast is already displayed in the AuthContext
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempt with email:", signUpEmail);
    try {
      await signUp(signUpEmail, signUpPassword, firstName, lastName);
      // Success feedback will be handled in AuthContext
    } catch (error) {
      console.error("Error during sign up:", error);
      // Toast is already displayed in the AuthContext
    }
  };
  
  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Google sign in attempt");
    try {
      await signInWithGoogle();
      // This will redirect to Google, so no need for success handling here
    } catch (error) {
      console.error("Error during Google sign in:", error);
      // Toast is already displayed in the AuthContext
    }
  };

  const handleDashboardPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Showing dashboard preview");
    toast({
      title: "Dashboard Preview",
      description: "Showing dashboard preview mode. This is for development purposes only.",
    });
    setShowDashboardPreview(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block">
            <MagicIllustration className="w-full h-[500px]" theme="space" />
          </div>
          
          <div>
            <Tabs defaultValue="sign-in" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign-in">
                <Card className="neumorphic border-none">
                  <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                      Sign in to access your Funsheets account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignIn}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email-signin">Email</Label>
                          <Input 
                            id="email-signin" 
                            type="email" 
                            placeholder="name@example.com" 
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password-signin">Password</Label>
                            <Link to="/forgot-password" className="text-sm text-funsheets-purple hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <Input 
                            id="password-signin" 
                            type="password" 
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            required 
                          />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full" 
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sign-up">
                <Card className="neumorphic border-none">
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Sign up to start creating personalized worksheets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp}>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input 
                              id="first-name" 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input 
                              id="last-name" 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required 
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email-signup">Email</Label>
                          <Input 
                            id="email-signup" 
                            type="email" 
                            placeholder="name@example.com" 
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password-signup">Password</Label>
                          <Input 
                            id="password-signup" 
                            type="password" 
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          By signing up, you agree to our <Link to="/terms" className="text-funsheets-purple hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-funsheets-purple hover:underline">Privacy Policy</Link>.
                        </div>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full" 
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                  </CardContent>
                  <CardFooter className="bg-gray-50 rounded-b-xl border-t p-6">
                    <div className="text-sm text-gray-500 text-center w-full">
                      Funsheets is committed to protecting your children's privacy.
                      <br />
                      <Link to="/privacy" className="text-funsheets-purple hover:underline">
                        Learn about our COPPA compliance
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-10 right-10 flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleDashboardPreview}
        >
          Preview Dashboard
        </Button>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
