import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SiteProvider } from './context/SiteContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { BuyingPage } from './pages/BuyingPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { SellingPage } from './pages/SellingPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/properties"
              element={
                <PublicLayout>
                  <PropertiesPage />
                </PublicLayout>
              }
            />
            <Route
              path="/properties/:slug"
              element={
                <PublicLayout>
                  <PropertyDetailsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/buying"
              element={
                <PublicLayout>
                  <BuyingPage />
                </PublicLayout>
              }
            />
            <Route
              path="/selling"
              element={
                <PublicLayout>
                  <SellingPage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicLayout>
                  <LegalPage type="privacy" />
                </PublicLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <PublicLayout>
                  <LegalPage type="terms" />
                </PublicLayout>
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="*"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </ErrorBoundary>
  );
}
