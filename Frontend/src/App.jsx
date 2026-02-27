import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import EventDetails from './pages/EventDetails';
import CategoryEvents from './pages/CategoryEvents';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout Pages */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/all-events"
          element={
            <MainLayout>
              <AllEvents />
            </MainLayout>
          }
        />
         
         <Route
          path="/events/:area"
          element={
            <MainLayout>
              <AllEvents />
            </MainLayout>
           }
          />

        <Route
          path="/event/:eventId"
          element={
            <MainLayout>
              <EventDetails />
            </MainLayout>
          }
        />
        <Route
          path="/category/:category"
          element={
            <MainLayout>
              <CategoryEvents />
            </MainLayout>
          }
        />
        <Route
          path="/signin"
          element={
            <MainLayout>
              <SignIn />
            </MainLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <MainLayout>
              <SignUp />
            </MainLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}