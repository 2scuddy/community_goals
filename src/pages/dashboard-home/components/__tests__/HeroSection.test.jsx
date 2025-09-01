import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '../HeroSection';

// Mock the Button component
jest.mock('../../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, variant, size, iconName, ...props }) {
    return (
      <button 
        onClick={onClick}
        data-testid="mock-button"
        data-variant={variant}
        data-size={size}
        data-icon-name={iconName}
        {...props}
      >
        {children}
      </button>
    );
  };
});

// Mock the AppIcon component
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

describe('HeroSection', () => {
  const defaultProps = {
    currentStreak: 5,
    hasCheckedInToday: false,
    onQuickCheckIn: jest.fn(),
    userName: 'John',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date to control time-based greetings
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with default props', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/good/i)).toBeInTheDocument();
    expect(screen.getByText(/there/i)).toBeInTheDocument();
  });

  it('should render with custom userName', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/john/i)).toBeInTheDocument();
  });

  it('should display morning greeting', () => {
    // Set time to 10 AM
    jest.setSystemTime(new Date('2024-01-01 10:00:00'));
    
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
  });

  it('should display afternoon greeting', () => {
    // Set time to 2 PM
    jest.setSystemTime(new Date('2024-01-01 14:00:00'));
    
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/good afternoon/i)).toBeInTheDocument();
  });

  it('should display evening greeting', () => {
    // Set time to 8 PM
    jest.setSystemTime(new Date('2024-01-01 20:00:00'));
    
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/good evening/i)).toBeInTheDocument();
  });

  it('should display streak information', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/day streak/i)).toBeInTheDocument();
  });

  it('should display motivational message for zero streak', () => {
    render(<HeroSection {...defaultProps} currentStreak={0} />);
    
    expect(screen.getByText(/ready to start your journey/i)).toBeInTheDocument();
  });

  it('should display motivational message for short streak', () => {
    render(<HeroSection {...defaultProps} currentStreak={3} />);
    
    expect(screen.getByText(/you are building something great/i)).toBeInTheDocument();
    expect(screen.getByText(/3 days and counting/i)).toBeInTheDocument();
  });

  it('should display motivational message for medium streak', () => {
    render(<HeroSection {...defaultProps} currentStreak={15} />);
    
    expect(screen.getByText(/incredible consistency/i)).toBeInTheDocument();
    expect(screen.getByText(/15-day streak/i)).toBeInTheDocument();
  });

  it('should display motivational message for long streak', () => {
    render(<HeroSection {...defaultProps} currentStreak={50} />);
    
    expect(screen.getByText(/you are absolutely crushing it/i)).toBeInTheDocument();
    expect(screen.getByText(/50 days of dedication/i)).toBeInTheDocument();
  });

  it('should display different message when checked in today', () => {
    render(<HeroSection {...defaultProps} hasCheckedInToday={true} />);
    
    expect(screen.getByText(/great job staying on track today/i)).toBeInTheDocument();
  });

  it('should render check-in button when not checked in', () => {
    render(<HeroSection {...defaultProps} hasCheckedInToday={false} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/quick check-in/i);
  });

  it('should not render check-in button when already checked in', () => {
    render(<HeroSection {...defaultProps} hasCheckedInToday={true} />);
    
    expect(screen.queryByText(/quick check-in/i)).not.toBeInTheDocument();
  });

  it('should call onQuickCheckIn when button is clicked', () => {
    const mockOnQuickCheckIn = jest.fn();
    render(<HeroSection {...defaultProps} onQuickCheckIn={mockOnQuickCheckIn} />);
    
    const button = screen.getByTestId('mock-button');
    fireEvent.click(button);
    
    expect(mockOnQuickCheckIn).toHaveBeenCalledTimes(1);
  });

  it('should render with correct styling classes', () => {
    render(<HeroSection {...defaultProps} />);
    
    const container = screen.getByText(/good/i).closest('div').closest('div');
    expect(container).toHaveClass('bg-gradient-to-br', 'from-primary/5', 'via-accent/5', 'to-secondary/5');
    expect(container).toHaveClass('rounded-3xl', 'p-6', 'lg:p-8', 'border', 'border-border/50');
  });

  it('should render streak icon', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByTestId('icon-Flame')).toBeInTheDocument();
  });

  it('should render check-in button with correct props', () => {
    render(<HeroSection {...defaultProps} hasCheckedInToday={false} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveAttribute('data-icon-name', 'CheckCircle');
  });

  it('should handle edge case for streak boundary (7 days)', () => {
    render(<HeroSection {...defaultProps} currentStreak={7} />);
    
    expect(screen.getByText(/incredible consistency/i)).toBeInTheDocument();
  });

  it('should handle edge case for streak boundary (30 days)', () => {
    render(<HeroSection {...defaultProps} currentStreak={30} />);
    
    expect(screen.getByText(/you are absolutely crushing it/i)).toBeInTheDocument();
  });

  it('should handle undefined onQuickCheckIn gracefully', () => {
    render(<HeroSection {...defaultProps} onQuickCheckIn={undefined} />);
    
    const button = screen.getByTestId('mock-button');
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    rerender(<HeroSection {...defaultProps} currentStreak={10} />);
    
    expect(screen.getByText(/john/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle time boundary correctly (noon)', () => {
    // Set time to exactly 12:00 PM
    jest.setSystemTime(new Date('2024-01-01 12:00:00'));
    
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/good afternoon/i)).toBeInTheDocument();
  });

  it('should handle time boundary correctly (5 PM)', () => {
    // Set time to exactly 5:00 PM
    jest.setSystemTime(new Date('2024-01-01 17:00:00'));
    
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText(/good evening/i)).toBeInTheDocument();
  });

  it('should display correct streak text for singular day', () => {
    render(<HeroSection {...defaultProps} currentStreak={1} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/day streak/i)).toBeInTheDocument();
  });

  it('should handle very large streak numbers', () => {
    render(<HeroSection {...defaultProps} currentStreak={365} />);
    
    expect(screen.getByText('365')).toBeInTheDocument();
    expect(screen.getByText(/365 days of dedication/i)).toBeInTheDocument();
  });

  it('should handle negative streak gracefully', () => {
    render(<HeroSection {...defaultProps} currentStreak={-1} />);
    
    // Should treat negative as zero streak
    expect(screen.getByText(/ready to start your journey/i)).toBeInTheDocument();
  });
});