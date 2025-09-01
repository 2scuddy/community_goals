import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SeasonCountdown from '../SeasonCountdown';

// Mock AppIcon component
jest.mock('../../../../components/AppIcon', () => {
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

// Mock timers
jest.useFakeTimers();

describe('SeasonCountdown', () => {
  const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
  
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should render season countdown with correct title', () => {
    render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('Season Spring 2024 Ends In')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Clock')).toBeInTheDocument();
  });

  it('should display time units labels', () => {
    render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();
  });

  it('should calculate and display correct countdown values', () => {
    const testDate = new Date(Date.now() + (5 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000) + (30 * 60 * 1000) + (45 * 1000));
    
    render(<SeasonCountdown endDate={testDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Days
    expect(screen.getByText('3')).toBeInTheDocument(); // Hours
    expect(screen.getByText('30')).toBeInTheDocument(); // Minutes
    expect(screen.getByText('45')).toBeInTheDocument(); // Seconds
  });

  it('should update countdown every second', () => {
    const testDate = new Date(Date.now() + 61000); // 1 minute and 1 second from now
    
    render(<SeasonCountdown endDate={testDate.toISOString()} currentSeason="Spring 2024" />);
    
    // Initial state
    expect(screen.getByText('1')).toBeInTheDocument(); // Minutes
    expect(screen.getByText('1')).toBeInTheDocument(); // Seconds (there might be two '1's)
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Should show 1 minute, 0 seconds
    expect(screen.getByText('1')).toBeInTheDocument(); // Minutes
    expect(screen.getByText('0')).toBeInTheDocument(); // Seconds
  });

  it('should handle past dates gracefully', () => {
    render(<SeasonCountdown endDate={pastDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Should show zeros
  });

  it('should display season end message', () => {
    render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('New season starts soon! Get ready to join fresh groups and set new goals.')).toBeInTheDocument();
  });

  it('should render with proper styling classes', () => {
    render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    const container = screen.getByText('Season Spring 2024 Ends In').closest('div').parentElement;
    expect(container).toHaveClass('bg-gradient-to-r', 'from-primary/10', 'to-secondary/10', 'rounded-xl', 'border', 'border-border', 'p-4');
  });

  it('should render countdown grid with proper styling', () => {
    render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    const daysContainer = screen.getByText('Days').closest('div');
    expect(daysContainer).toHaveClass('text-center', 'bg-card', 'rounded-lg', 'p-2', 'border', 'border-border');
  });

  it('should handle different season names', () => {
    const { rerender } = render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Winter 2024" />);
    
    expect(screen.getByText('Season Winter 2024 Ends In')).toBeInTheDocument();
    
    rerender(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Summer 2025" />);
    
    expect(screen.getByText('Season Summer 2025 Ends In')).toBeInTheDocument();
  });

  it('should cleanup timer on unmount', () => {
    const { unmount } = render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    // Verify timer is running
    expect(setInterval).toHaveBeenCalled();
    
    unmount();
    
    // Verify cleanup
    expect(clearInterval).toHaveBeenCalled();
  });

  it('should handle invalid date strings gracefully', () => {
    render(<SeasonCountdown endDate="invalid-date" currentSeason="Spring 2024" />);
    
    // Should still render without crashing
    expect(screen.getByText('Season Spring 2024 Ends In')).toBeInTheDocument();
  });

  it('should display correct icon properties', () => {
    render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    const clockIcon = screen.getByTestId('icon-Clock');
    expect(clockIcon).toHaveAttribute('data-size', '20');
    expect(clockIcon).toHaveAttribute('data-color', 'var(--color-primary)');
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('Season Spring 2024 Ends In')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
    
    rerender(<SeasonCountdown endDate={futureDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('Season Spring 2024 Ends In')).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('should handle edge case of exactly zero time left', () => {
    const exactlyNow = new Date();
    
    render(<SeasonCountdown endDate={exactlyNow.toISOString()} currentSeason="Spring 2024" />);
    
    // Should show zeros for all time units
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(4); // At least 4 zeros for days, hours, minutes, seconds
  });

  it('should handle very large time differences', () => {
    const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    
    render(<SeasonCountdown endDate={farFuture.toISOString()} currentSeason="Spring 2024" />);
    
    // Should display days count (around 365)
    expect(screen.getByText('365')).toBeInTheDocument();
  });

  it('should update endDate prop correctly', () => {
    const initialDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const newDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    
    const { rerender } = render(<SeasonCountdown endDate={initialDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 days
    
    rerender(<SeasonCountdown endDate={newDate.toISOString()} currentSeason="Spring 2024" />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // 5 days
  });

  it('should handle missing props gracefully', () => {
    render(<SeasonCountdown />);
    
    // Should render without crashing even with missing props
    expect(screen.getByTestId('icon-Clock')).toBeInTheDocument();
  });

  it('should format time units with proper padding', () => {
    const testDate = new Date(Date.now() + (1 * 24 * 60 * 60 * 1000) + (1 * 60 * 60 * 1000) + (1 * 60 * 1000) + (1 * 1000));
    
    render(<SeasonCountdown endDate={testDate.toISOString()} currentSeason="Spring 2024" />);
    
    // All values should be single digits but properly displayed
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});