import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabNavigation from '../TabNavigation';

// Mock AppIcon component
jest.mock('../../../../components/AppIcon', () => {
  return function MockIcon({ name, size, ...props }) {
    return (
      <span 
        data-testid={`icon-${name}`} 
        data-size={size}
        {...props}
      >
        {name}
      </span>
    );
  };
});

describe('TabNavigation', () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all tab buttons', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Check-ins')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Meetups')).toBeInTheDocument();
  });

  it('should render all tab icons', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    expect(screen.getByTestId('icon-BarChart3')).toBeInTheDocument();
    expect(screen.getByTestId('icon-CheckCircle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Trophy')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Calendar')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    render(<TabNavigation activeTab="checkins" onTabChange={mockOnTabChange} />);
    
    const checkinsButton = screen.getByText('Check-ins').closest('button');
    const overviewButton = screen.getByText('Overview').closest('button');
    
    expect(checkinsButton).toHaveClass('border-primary', 'text-primary');
    expect(overviewButton).toHaveClass('border-transparent', 'text-muted-foreground');
  });

  it('should call onTabChange when tab is clicked', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    const challengesButton = screen.getByText('Challenges').closest('button');
    fireEvent.click(challengesButton);
    
    expect(mockOnTabChange).toHaveBeenCalledWith('challenges');
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
  });

  it('should handle all tab clicks', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    const tabs = [
      { text: 'Overview', id: 'overview' },
      { text: 'Check-ins', id: 'checkins' },
      { text: 'Challenges', id: 'challenges' },
      { text: 'Meetups', id: 'meetups' },
    ];

    tabs.forEach(({ text, id }) => {
      const button = screen.getByText(text).closest('button');
      fireEvent.click(button);
      expect(mockOnTabChange).toHaveBeenCalledWith(id);
    });

    expect(mockOnTabChange).toHaveBeenCalledTimes(4);
  });

  it('should render with correct container styling', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    const container = screen.getByText('Overview').closest('div').parentElement;
    expect(container).toHaveClass('bg-card', 'border-b', 'border-border');
  });

  it('should render with scrollable container', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    const scrollContainer = screen.getByText('Overview').closest('div');
    expect(scrollContainer).toHaveClass('flex', 'overflow-x-auto', 'scrollbar-hide');
  });

  it('should render buttons with correct styling', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    
    buttons.forEach(button => {
      expect(button).toHaveClass('flex', 'items-center', 'space-x-2', 'px-4', 'py-3', 'whitespace-nowrap', 'border-b-2', 'transition-smooth');
    });
  });

  it('should handle different active tabs', () => {
    const tabs = ['overview', 'checkins', 'challenges', 'meetups'];
    
    tabs.forEach(activeTab => {
      const { rerender } = render(<TabNavigation activeTab={activeTab} onTabChange={mockOnTabChange} />);
      
      // Should render without crashing
      expect(screen.getAllByRole('button')).toHaveLength(4);
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should handle undefined onTabChange gracefully', () => {
    render(<TabNavigation activeTab="overview" onTabChange={undefined} />);
    
    const button = screen.getByText('Overview').closest('button');
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
    
    rerender(<TabNavigation activeTab="checkins" onTabChange={mockOnTabChange} />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('should render icons with correct size', () => {
    render(<TabNavigation activeTab="overview" onTabChange={mockOnTabChange} />);
    
    const icons = [
      screen.getByTestId('icon-BarChart3'),
      screen.getByTestId('icon-CheckCircle'),
      screen.getByTestId('icon-Trophy'),
      screen.getByTestId('icon-Calendar')
    ];

    icons.forEach(icon => {
      expect(icon).toHaveAttribute('data-size', '16');
    });
  });

  it('should handle null activeTab', () => {
    render(<TabNavigation activeTab={null} onTabChange={mockOnTabChange} />);
    
    // Should render all tabs without crashing
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('should handle undefined activeTab', () => {
    render(<TabNavigation activeTab={undefined} onTabChange={mockOnTabChange} />);
    
    // Should render all tabs without crashing
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});