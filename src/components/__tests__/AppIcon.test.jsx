import React from 'react';
import { render, screen } from '@testing-library/react';
import AppIcon from '../AppIcon';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Home: ({ size, color, ...props }) => (
    <svg data-testid="home-icon" width={size} height={size} fill={color} {...props}>
      <title>Home</title>
    </svg>
  ),
  User: ({ size, color, ...props }) => (
    <svg data-testid="user-icon" width={size} height={size} fill={color} {...props}>
      <title>User</title>
    </svg>
  ),
  Settings: ({ size, color, ...props }) => (
    <svg data-testid="settings-icon" width={size} height={size} fill={color} {...props}>
      <title>Settings</title>
    </svg>
  ),
  ArrowLeft: ({ size, color, ...props }) => (
    <svg data-testid="arrow-left-icon" width={size} height={size} fill={color} {...props}>
      <title>ArrowLeft</title>
    </svg>
  ),
  Search: ({ size, color, ...props }) => (
    <svg data-testid="search-icon" width={size} height={size} fill={color} {...props}>
      <title>Search</title>
    </svg>
  ),
}));

describe('AppIcon', () => {
  it('should render Home icon with default props', () => {
    render(<AppIcon name="Home" />);
    
    const icon = screen.getByTestId('home-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
  });

  it('should render icon with custom size', () => {
    render(<AppIcon name="User" size={32} />);
    
    const icon = screen.getByTestId('user-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('should render icon with custom color', () => {
    render(<AppIcon name="Settings" color="#ff0000" />);
    
    const icon = screen.getByTestId('settings-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('fill', '#ff0000');
  });

  it('should render icon with custom props', () => {
    render(<AppIcon name="ArrowLeft" className="custom-class" data-custom="test" />);
    
    const icon = screen.getByTestId('arrow-left-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('custom-class');
    expect(icon).toHaveAttribute('data-custom', 'test');
  });

  it('should render different icon types', () => {
    const { rerender } = render(<AppIcon name="Search" />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();

    rerender(<AppIcon name="Home" />);
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('search-icon')).not.toBeInTheDocument();
  });

  it('should handle missing icon gracefully', () => {
    // Suppress console errors for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<AppIcon name="NonExistentIcon" />);
    }).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  it('should pass through all props to the icon component', () => {
    render(
      <AppIcon 
        name="User" 
        size={16} 
        color="blue" 
        strokeWidth={2}
        className="test-class"
        id="test-id"
      />
    );
    
    const icon = screen.getByTestId('user-icon');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
    expect(icon).toHaveAttribute('fill', 'blue');
    expect(icon).toHaveClass('test-class');
    expect(icon).toHaveAttribute('id', 'test-id');
  });
});