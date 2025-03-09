
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import { MeetingProvider } from "@/contexts/MeetingContext";

import Home from "@/pages/Home";
import MeetingDetail from "@/pages/MeetingDetail";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";
import History from "@/pages/History";
import NotFound from "@/pages/NotFound";

import Sidebar from "@/components/Sidebar";

const queryClient = new QueryClient();

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <MeetingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className={`flex min-h-screen transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <Sidebar />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/meetings/:id" element={<MeetingDetail />} />
                      <Route path="/calendario" element={<Calendar />} />
                      <Route path="/registro" element={<Home />} />
                      <Route path="/historico" element={<History />} />
                      <Route path="/configuracoes" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </MeetingProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
