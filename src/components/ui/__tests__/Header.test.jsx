import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

// Mock AppIcon component
jest.mock('../../AppIcon', () => {
  return function MockIcon({ name, size, color, ...props }) {
    return (
      <span 
        data-testid={`icon-${name}`} 
        data-size={size}
        data-color={color}
        {...props}
      >
        {name}
      </span>
    );
  };
});

// Mock Button component
jest.mock('../Button', () => {
  return function MockButton({ 
    children, 
    onClick, 
    variant, 
    size, 
    iconName, 
    iconPosition, 
    iconSize, 
    fullWidth,
    className,
    ...props 
  }) {
    return (
      <button 
        onClick={onClick}
        data-testid={`button-${children || iconName}`}
        data-variant={variant}
        data-size={size}
        data-icon-name={iconName}
        data-icon-position={iconPosition}
        data-icon-size={iconSize}
        data-full-width={fullWidth}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  };
});

// Mock window.location.href
const mockLocationHref = jest.fn();
delete window.location;
window.location = { href: '' };

describe('Header', () => {
  const mockUseLocation = useLocation;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationHref.mockClear();
    
    // Mock window.location.href setter
    Object.defineProperty(window.location, 'href', {
      set: mockLocationHref,
      configurable: true,
    });
  });

  it('should render auth page header', () => {
    mockUseLocation.mockReturnValue({ pathname: '/login-registration' });
    
    render(<Header />);
    
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Target')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should render main header with logo', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Target')).toBeInTheDocument();
  });

  it('should display correct page title on mobile', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should display correct page titles for different routes', () => {
    const routes = [
      { pathname: '/dashboard-home', title: 'Dashboard' },
      { pathname: '/goal-creation-management', title: 'Goals' },
      { pathname: '/group-discovery-matching', title: 'Find Groups' },
      { pathname: '/group-dashboard-communication', title: 'My Group' },
      { pathname: '/user-profile-settings', title: 'Profile' },
    ];

    routes.forEach(({ pathname, title }) => {
      mockUseLocation.mockReturnValue({ pathname });
      const { rerender } = render(<Header />);
      
      expect(screen.getByText(title)).toBeInTheDocument();
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render desktop navigation items', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    expect(screen.getByTestId('button-Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('button-Goals')).toBeInTheDocument();
    expect(screen.getByTestId('button-Groups')).toBeInTheDocument();
    expect(screen.getByTestId('button-Profile')).toBeInTheDocument();
  });

  it('should highlight active navigation item', () => {
    mockUseLocation.mockReturnValue({ pathname: '/goal-creation-management' });
    
    render(<Header />);
    
    const goalsButton = screen.getByTestId('button-Goals');
    expect(goalsButton).toHaveAttribute('data-variant', 'default');
    
    const dashboardButton = screen.getByTestId('button-Dashboard');
    expect(dashboardButton).toHaveAttribute('data-variant', 'ghost');
  });

  it('should render mobile menu button', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    expect(screen.getByTestId('button-Menu')).toBeInTheDocument();
  });

  it('should toggle mobile menu', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const menuButton = screen.getByTestId('button-Menu');
    
    // Menu should be closed initially
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    
    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Close menu
    const closeButton = screen.getByTestId('button-X');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should render mobile menu items when open', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const menuButton = screen.getByTestId('button-Menu');
    fireEvent.click(menuButton);
    
    // Check all navigation items are present in mobile menu
    const mobileButtons = screen.getAllByTestId(/button-/);
    const buttonTexts = mobileButtons.map(button => button.textContent);
    
    expect(buttonTexts).toContain('Dashboard');
    expect(buttonTexts).toContain('Goals');
    expect(buttonTexts).toContain('Groups');
    expect(buttonTexts).toContain('Profile');
    expect(buttonTexts).toContain('Settings');
  });

  it('should render settings button on desktop', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    expect(screen.getByTestId('button-Settings')).toBeInTheDocument();
  });

  it('should handle navigation clicks', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const goalsButton = screen.getByTestId('button-Goals');
    fireEvent.click(goalsButton);
    
    expect(mockLocationHref).toHaveBeenCalledWith('/goal-creation-management');
  });

  it('should handle settings button click', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const settingsButton = screen.getByTestId('button-Settings');
    fireEvent.click(settingsButton);
    
    expect(mockLocationHref).toHaveBeenCalledWith('/user-profile-settings');
  });

  it('should close mobile menu after navigation', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    // Open mobile menu
    const menuButton = screen.getByTestId('button-Menu');
    fireEvent.click(menuButton);
    
    // Click on a navigation item
    const mobileGoalsButtons = screen.getAllByTestId('button-Goals');
    const mobileGoalsButton = mobileGoalsButtons.find(button => 
      button.getAttribute('data-full-width') === 'true'
    );
    fireEvent.click(mobileGoalsButton);
    
    expect(mockLocationHref).toHaveBeenCalledWith('/goal-creation-management');
  });

  it('should render navigation items with correct icons', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const dashboardButton = screen.getByTestId('button-Dashboard');
    expect(dashboardButton).toHaveAttribute('data-icon-name', 'Home');
    
    const goalsButton = screen.getByTestId('button-Goals');
    expect(goalsButton).toHaveAttribute('data-icon-name', 'Target');
    
    const groupsButton = screen.getByTestId('button-Groups');
    expect(groupsButton).toHaveAttribute('data-icon-name', 'Users');
    
    const profileButton = screen.getByTestId('button-Profile');
    expect(profileButton).toHaveAttribute('data-icon-name', 'User');
  });

  it('should render navigation items with correct icon properties', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const dashboardButton = screen.getByTestId('button-Dashboard');
    expect(dashboardButton).toHaveAttribute('data-icon-position', 'left');
    expect(dashboardButton).toHaveAttribute('data-icon-size', '16');
  });

  it('should handle empty page title for unknown routes', () => {
    mockUseLocation.mockReturnValue({ pathname: '/unknown-route' });
    
    render(<Header />);
    
    // Should not crash and should render header
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
  });

  it('should render with correct header styling', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'z-90', 'bg-background', 'border-b', 'border-border');
  });

  it('should render logo with correct styling', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const logoIcon = screen.getByTestId('icon-Target');
    expect(logoIcon).toHaveAttribute('data-size', '20');
    expect(logoIcon).toHaveAttribute('data-color', 'white');
  });

  it('should render mobile menu with correct styling when open', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const menuButton = screen.getByTestId('button-Menu');
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation');
    expect(mobileMenu.closest('div')).toHaveClass('lg:hidden', 'bg-card', 'border-b', 'border-border', 'shadow-warm');
  });

  it('should render mobile navigation items with full width', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<Header />);
    
    const menuButton = screen.getByTestId('button-Menu');
    fireEvent.click(menuButton);
    
    const mobileButtons = screen.getAllByTestId(/button-/).filter(button => 
      button.getAttribute('data-full-width') === 'true'
    );
    
    expect(mobileButtons.length).toBeGreaterThan(0);
  });

  it('should handle location pathname being null', () => {
    mockUseLocation.mockReturnValue({ pathname: null });
    
    render(<Header />);
    
    // Should not crash
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
  });

  it('should handle useLocation returning null', () => {
    mockUseLocation.mockReturnValue(null);
    
    render(<Header />);
    
    // Should not crash
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
  });

  it('should render consistently on multiple renders', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    const { rerender } = render(<Header />);
    
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    rerender(<Header />);
    
    expect(screen.getByText('Community Goals')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});