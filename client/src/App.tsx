import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { HomePage } from "@/pages/home";
import { AdminPage } from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { localStorage } from "@/lib/local-storage";
import { AdminLogin } from "@/components/admin-login";

function Router() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Check authentication on load
  useEffect(() => {
    const authStatus = window.localStorage.getItem("adminAuthenticated");
    const loginTime = window.localStorage.getItem("adminLoginTime");
    
    // Session expires after 24 hours
    const sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isSessionValid = loginTime && (Date.now() - parseInt(loginTime)) < sessionExpiry;
    
    setIsAuthenticated(authStatus === "true" && !!isSessionValid);
  }, []);

  // Sync data with localStorage for offline functionality
  useEffect(() => {
    const handleDataUpdate = () => {
      // Save data to localStorage when queries are updated
      const introData = queryClient.getQueryData(["/api/intro"]);
      const contentData = queryClient.getQueryData(["/api/content"]);
      const otherData = queryClient.getQueryData(["/api/other"]);
      
      if (introData) localStorage.saveIntro(introData);
      if (contentData && Array.isArray(contentData)) localStorage.saveContent(contentData);
      if (otherData) localStorage.saveOther(otherData);
    };

    // Listen for query updates
    const unsubscribe = queryClient.getQueryCache().subscribe(handleDataUpdate);
    
    return unsubscribe;
  }, []);

  const handleToggleAdmin = () => {
    if (isAdminMode) {
      // Logout from admin mode
      setIsAdminMode(false);
    } else {
      // Check authentication before entering admin mode
      if (isAuthenticated) {
        setIsAdminMode(true);
      } else {
        setShowLoginDialog(true);
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsAdminMode(true);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("adminAuthenticated");
    window.localStorage.removeItem("adminLoginTime");
    setIsAuthenticated(false);
    setIsAdminMode(false);
  };

  return (
    <>
      <Navigation 
        isAdminMode={isAdminMode} 
        onToggleAdmin={handleToggleAdmin}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      
      {isAdminMode && isAuthenticated ? (
        <AdminPage />
      ) : (
        <Switch>
          <Route path="/" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      )}

      <AdminLogin
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
