
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormsManager from "./pages/FormsManager";
import ViewForm from "./pages/ViewForm";
import FormResponses from "./pages/FormResponses";
import FormBuilder from "./components/FormBuilder";
import FormConfig from "./pages/FormConfig";
import DbConnections from "./pages/DbConnections";
import DbFormBuilder from "./pages/DbFormBuilder";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check for theme preference on initial load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forms" element={<FormsManager />} />
            <Route path="/form/:id" element={<ViewForm />} />
            <Route path="/form/:id/edit" element={<FormBuilder />} />
            <Route path="/form/:id/config" element={<FormConfig />} />
            <Route path="/form/new" element={<FormBuilder />} />
            <Route path="/responses/:id" element={<FormResponses />} />
            <Route path="/db-connections" element={<DbConnections />} />
            <Route path="/dbform/:id" element={<DbFormBuilder />} />
            <Route path="/dbform/new" element={<DbFormBuilder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
