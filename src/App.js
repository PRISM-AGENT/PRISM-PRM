/**
 * 🌐 PRISM Application Main Component
 * Defines the main app layout and routing
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, ChakraProvider, Container } from '@chakra-ui/react';

// Context Providers
import { AuthProvider } from './context';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Common Components
import { PrivateRoute } from './components/common';

// Pages
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AssistantPage from './pages/AssistantPage';
// 👑 Main application pages
import KnowledgePage from './pages/KnowledgePage';
import TokenPage from './pages/TokenPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Box flex="1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route 
              path="/assistant" 
              element={
                <PrivateRoute>
                  <AssistantPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/knowledge" 
              element={
                <PrivateRoute>
                  <KnowledgePage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/token" 
              element={
                <PrivateRoute>
                  <TokenPage />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </AuthProvider>
  );
}

export default App; 