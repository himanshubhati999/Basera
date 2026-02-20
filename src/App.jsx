import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import Header from './components/Header';
import Footer from './components/Footer';
import StickyDialPad from './components/StickyDialPad';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Properties from './pages/Properties';
import Contact from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import CreateProject from './pages/CreateProject';
import DynamicPage from './pages/DynamicPage';
import News from './pages/News';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import { trackPageView, trackSession } from './utils/analytics';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  // Track session on component mount and unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackSession();
    };
  }, []);

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<PropertyDetail />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/agents" element={<div className="page-placeholder" style={{padding: '100px 20px', textAlign: 'center', minHeight: '60vh'}}><h1>Agents Page</h1><p>Coming Soon</p></div>} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<DynamicPage />} />
        <Route path="/careers" element={<div className="page-placeholder" style={{padding: '100px 20px', textAlign: 'center', minHeight: '60vh'}}><h1>Careers Page</h1><p>Coming Soon</p></div>} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/projects/create" element={
          <AdminRoute>
            <CreateProject />
          </AdminRoute>
        } />
        {/* Dynamic Pages Route - catches custom page slugs */}
        <Route path="/:slug" element={<DynamicPage />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyDialPad />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <AppContent />
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
