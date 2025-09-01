import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '../BottomNavigation';

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

describe('BottomNavigation', () => {
  const mockUseLocation = useLocation;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render on auth page', () => {
    mockUseLocation.mockReturnValue({ pathname: '/login-registration' });
    
    const { container } = render(<BottomNavigation />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should render navigation items', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render navigation icons', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    expect(screen.getByTestId('icon-Home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Target')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Users')).toBeInTheDocument();
    expect(screen.getByTestId('icon-User')).toBeInTheDocument();
  });

  it('should highlight active navigation item', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    const goalsButton = screen.getByText('Goals').closest('button');
    
    expect(dashboardButton).toHaveClass('text-primary');
    expect(goalsButton).toHaveClass('text-muted-foreground');
  });

  it('should render navigation buttons as clickable', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('should show badge for Groups item', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should not show badge for items with 0 badge count', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    // Only Groups should have a badge (value 2), others should not
    const badges = screen.queryAllByText(/^[0-9]+$/);
    expect(badges).toHaveLength(1);
    expect(badges[0]).toHaveTextContent('2');
  });

  it('should handle group discovery and communication paths as active for Groups', () => {
    // Test group-discovery-matching
    mockUseLocation.mockReturnValue({ pathname: '/group-discovery-matching' });
    const { rerender } = render(<BottomNavigation />);
    
    let groupsButton = screen.getByText('Groups').closest('button');
    expect(groupsButton).toHaveClass('text-primary');
    
    // Test group-dashboard-communication
    mockUseLocation.mockReturnValue({ pathname: '/group-dashboard-communication' });
    rerender(<BottomNavigation />);
    
    groupsButton = screen.getByText('Groups').closest('button');
    expect(groupsButton).toHaveClass('text-primary');
  });

  it('should render with correct styling classes', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0', 'z-100', 'bg-card', 'border-t', 'border-border', 'lg:hidden');
  });

  it('should render all navigation items as buttons', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    const navigationItems = ['Dashboard', 'Goals', 'Groups', 'Profile'];

    navigationItems.forEach(text => {
      const button = screen.getByText(text).closest('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });
  });

  it('should handle null location pathname', () => {
    mockUseLocation.mockReturnValue({ pathname: null });
    
    render(<BottomNavigation />);
    
    // Should not crash and should render navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should handle useLocation returning null', () => {
    mockUseLocation.mockReturnValue(null);
    
    render(<BottomNavigation />);
    
    // Should not crash and should render navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render consistently on multiple renders', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    const { rerender } = render(<BottomNavigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    
    rerender(<BottomNavigation />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('should render navigation items with correct structure', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    
    buttons.forEach(button => {
      expect(button).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });
  });

  it('should handle different active states correctly', () => {
    const routes = [
      '/dashboard-home',
      '/goal-creation-management',
      '/group-discovery-matching',
      '/user-profile-settings',
    ];

    routes.forEach(pathname => {
      mockUseLocation.mockReturnValue({ pathname });
      const { rerender } = render(<BottomNavigation />);
      
      // Should render without crashing
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render badge with correct styling', () => {
    mockUseLocation.mockReturnValue({ pathname: '/dashboard-home' });
    
    render(<BottomNavigation />);
    
    const badge = screen.getByText('2');
    expect(badge).toHaveClass('absolute', '-top-1', '-right-1', 'bg-destructive', 'text-destructive-foreground');
  });
});