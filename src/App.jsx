import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
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
import PostProperty from './pages/PostProperty';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<PropertyDetail />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/agents" element={<div className="page-placeholder" style={{padding: '100px 20px', textAlign: 'center', minHeight: '60vh'}}><h1>Agents Page</h1><p>Coming Soon</p></div>} />
        <Route path="/news" element={<div className="page-placeholder" style={{padding: '100px 20px', textAlign: 'center', minHeight: '60vh'}}><h1>News Page</h1><p>Coming Soon</p></div>} />
        <Route path="/careers" element={<div className="page-placeholder" style={{padding: '100px 20px', textAlign: 'center', minHeight: '60vh'}}><h1>Careers Page</h1><p>Coming Soon</p></div>} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
