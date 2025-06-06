import { AuthProvider } from '@/components/auth/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import About from '@/pages/About';
import Admin from '@/pages/Admin';
import SchoolManagement from '@/pages/admin/SchoolManagement';
import ApplicationReviewPage from '@/pages/ApplicationReviewPage';
import Index from '@/pages/Index';
import JoinSupplier from '@/pages/JoinSupplier';
import LegalComplaint from "@/pages/LegalComplaint";
import LegalComplaints from "@/pages/LegalComplaints";
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import PricingManagement from "@/pages/PricingManagement";
import Profile from '@/pages/Profile';
import Register from '@/pages/Register';
import SchoolDashboard from '@/pages/SchoolDashboard';
import Services from '@/pages/Services';
import EdTechSolutions from '@/pages/services/EdTechSolutions';
import SchoolFurniture from '@/pages/services/SchoolFurniture';
import SubmissionSuccess from '@/pages/SubmissionSuccess';
import SupplierDashboard from '@/pages/SupplierDashboard';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/edtech-solutions" element={<EdTechSolutions />} />
            <Route path="/services/school-furniture" element={<SchoolFurniture />} />
            <Route path="/join" element={<JoinSupplier />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/school-dashboard" element={<SchoolDashboard />} />
            <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/submission-success" element={<SubmissionSuccess />} />
            <Route path="/legal-complaint/:supplierId?" element={<LegalComplaint />} />
            <Route path="/admin/legal-complaints" element={<LegalComplaints />} />
            <Route path="/pricing-management" element={<PricingManagement />} />
            <Route path="/application-review" element={<ApplicationReviewPage />} />
            <Route path="/admin/schools" element={<SchoolManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
