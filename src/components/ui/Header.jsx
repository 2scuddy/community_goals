import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAuthPage = location?.pathname === '/login-registration';
  
  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard-home', icon: 'Home' },
    { label: 'Goals', path: '/goal-creation-management', icon: 'Target' },
    { label: 'Groups', path: '/group-discovery-matching', icon: 'Users' },
    { label: 'Profile', path: '/user-profile-settings', icon: 'User' }
  ];

  const getPageTitle = () => {
    switch (location?.pathname) {
      case '/dashboard-home':
        return 'Dashboard';
      case '/goal-creation-management':
        return 'Goals';
      case '/group-discovery-matching':
        return 'Find Groups';
      case '/group-dashboard-communication':
        return 'My Group';
      case '/user-profile-settings':
        return 'Profile';
      default:
        return '';
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-90 bg-background border-b border-border">
        <div className="flex items-center justify-center h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-semibold text-foreground">
              Community Goals
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-90 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} color="white" />
          </div>
          <span className="text-xl font-heading font-semibold text-foreground hidden sm:block">
            Community Goals
          </span>
        </div>

        {/* Page Title - Mobile */}
        <div className="flex-1 text-center sm:hidden">
          <h1 className="text-lg font-heading font-medium text-foreground">
            {getPageTitle()}
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={location?.pathname === item?.path ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="transition-smooth"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            iconName={isMenuOpen ? "X" : "Menu"}
            iconSize={20}
          />
        </div>

        {/* Settings Button - Desktop */}
        <div className="hidden lg:block ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation('/user-profile-settings')}
            iconName="Settings"
            iconSize={18}
          />
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border shadow-warm">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={location?.pathname === item?.path ? "default" : "ghost"}
                size="sm"
                fullWidth
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-smooth"
              >
                {item?.label}
              </Button>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => handleNavigation('/user-profile-settings')}
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-smooth"
              >
                Settings
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;