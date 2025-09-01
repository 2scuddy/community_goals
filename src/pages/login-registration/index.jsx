import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialProof from './components/SocialProof';
import HeroSection from './components/HeroSection';
import Icon from '../../components/AppIcon';

const LoginRegistration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard-home');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Two-Column Layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            
            {/* Left Column - Hero Content (Desktop Only) */}
            <div className="hidden lg:block lg:sticky lg:top-8">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    Transform Your Goals Into Reality
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    Join a community-driven platform where accountability meets achievement. 
                    Connect with like-minded individuals and turn your aspirations into accomplishments.
                  </p>
                </div>
                
                <HeroSection />
              </div>
            </div>

            {/* Right Column - Authentication Forms */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              {/* Mobile Hero Section */}
              <div className="lg:hidden mb-8">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Welcome to Community Goals
                  </h1>
                  <p className="text-muted-foreground">
                    Your journey to achievement starts here
                  </p>
                </div>
              </div>

              {/* Authentication Card */}
              <div className="bg-card border border-border rounded-2xl shadow-warm p-6 lg:p-8">
                <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
                
                <div className="mb-6">
                  {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">
                      Join our community
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-primary">12.5K+</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-primary">8.2K+</div>
                    <div className="text-xs text-muted-foreground">Goals Achieved</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-primary">89%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Mobile Social Proof */}
              <div className="lg:hidden mt-8">
                <SocialProof />
              </div>
            </div>
          </div>

          {/* Desktop Social Proof Section */}
          <div className="hidden lg:block mt-16">
            <SocialProof />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={20} color="white" />
                </div>
                <span className="text-lg font-semibold text-foreground">
                  Community Goals
                </span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <button className="hover:text-foreground transition-smooth">
                  Privacy Policy
                </button>
                <button className="hover:text-foreground transition-smooth">
                  Terms of Service
                </button>
                <button className="hover:text-foreground transition-smooth">
                  Support
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
              <p>&copy; {new Date()?.getFullYear()} Community Goals. All rights reserved.</p>
              <p className="mt-1">Empowering individuals through community accountability since 2023.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginRegistration;