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

function Router() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Sync data with localStorage for offline functionality
  useEffect(() => {
    const handleDataUpdate = () => {
      // Save data to localStorage when queries are updated
      const introData = queryClient.getQueryData(["/api/intro"]);
      const contentData = queryClient.getQueryData(["/api/content"]);
      const otherData = queryClient.getQueryData(["/api/other"]);
      
      if (introData) localStorage.saveIntro(introData);
      if (contentData) localStorage.saveContent(contentData);
      if (otherData) localStorage.saveOther(otherData);
    };

    // Listen for query updates
    const unsubscribe = queryClient.getQueryCache().subscribe(handleDataUpdate);
    
    return unsubscribe;
  }, []);

  return (
    <>
      <Navigation isAdminMode={isAdminMode} onToggleAdmin={() => setIsAdminMode(!isAdminMode)} />
      
      {isAdminMode ? (
        <AdminPage />
      ) : (
        <Switch>
          <Route path="/" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      )}
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
