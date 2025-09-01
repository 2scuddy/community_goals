import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isAuthPage = location?.pathname === '/login-registration';
  
  if (isAuthPage) {
    return null;
  }

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard-home', 
      icon: 'Home',
      badge: 0
    },
    { 
      label: 'Goals', 
      path: '/goal-creation-management', 
      icon: 'Target',
      badge: 0
    },
    { 
      label: 'Groups', 
      path: '/group-discovery-matching', 
      icon: 'Users',
      badge: 2
    },
    { 
      label: 'Profile', 
      path: '/user-profile-settings', 
      icon: 'User',
      badge: 0
    }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const isActive = (path) => {
    if (path === '/group-discovery-matching') {
      return location?.pathname === '/group-discovery-matching' || 
             location?.pathname === '/group-dashboard-communication';
    }
    return location?.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navigationItems?.map((item) => {
          const active = isActive(item?.path);
          
          return (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg
                transition-smooth min-w-0 flex-1 relative
                ${active 
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <div className="relative">
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  color={active ? 'var(--color-primary)' : 'currentColor'}
                />
                {item?.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {item?.badge > 9 ? '9+' : item?.badge}
                  </div>
                )}
              </div>
              <span className={`
                text-xs font-caption truncate max-w-full
                ${active ? 'font-medium' : 'font-normal'}
              `}>
                {item?.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;