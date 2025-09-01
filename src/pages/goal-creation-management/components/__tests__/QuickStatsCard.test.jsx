import React from 'react';
import { render, screen } from '@testing-library/react';
import QuickStatsCard from '../QuickStatsCard';

// Mock the AppIcon component
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

// Mock Date to control the "Last updated" display
const mockDate = new Date('2024-01-15T10:30:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
Date.now = jest.fn(() => mockDate.getTime());

describe('QuickStatsCard', () => {
  const mockGoals = [
    {
      id: 1,
      status: 'active',
      streak: 5,
      progress: 75,
      priority: 'high',
      daysRemaining: 3
    },
    {
      id: 2,
      status: 'active',
      streak: 10,
      progress: 50,
      priority: 'medium',
      daysRemaining: 15
    },
    {
      id: 3,
      status: 'completed',
      streak: 30,
      progress: 100,
      priority: 'high',
      daysRemaining: 0
    },
    {
      id: 4,
      status: 'active',
      streak: 2,
      progress: 25,
      priority: 'low',
      daysRemaining: 5
    }
  ];

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render with goals data', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('Last updated: 1/15/2024')).toBeInTheDocument();
  });

  it('should calculate active goals correctly', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('3')).toBeInTheDocument(); // 3 active goals
    expect(screen.getByText('Active Goals')).toBeInTheDocument();
  });

  it('should calculate completed goals correctly', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 completed goal
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should calculate total streak correctly', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('17 days')).toBeInTheDocument(); // 5 + 10 + 2 = 17
    expect(screen.getByText('Total Streak')).toBeInTheDocument();
  });

  it('should calculate average progress correctly', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('50%')).toBeInTheDocument(); // (75 + 50 + 25) / 3 = 50
    expect(screen.getByText('Avg Progress')).toBeInTheDocument();
  });

  it('should render all stat icons', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByTestId('icon-Target')).toBeInTheDocument();
    expect(screen.getByTestId('icon-CheckCircle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Flame')).toBeInTheDocument();
    expect(screen.getByTestId('icon-TrendingUp')).toBeInTheDocument();
  });

  it('should handle empty goals array', () => {
    render(<QuickStatsCard goals={[]} />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Active goals
    expect(screen.getByText('0 days')).toBeInTheDocument(); // Total streak
    expect(screen.getByText('0%')).toBeInTheDocument(); // Avg progress
  });

  it('should handle undefined goals', () => {
    render(<QuickStatsCard goals={undefined} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    // Should not crash and should handle gracefully
  });

  it('should handle null goals', () => {
    render(<QuickStatsCard goals={null} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    // Should not crash and should handle gracefully
  });

  it('should handle goals with missing properties', () => {
    const incompleteGoals = [
      { status: 'active' }, // Missing other properties
      { status: 'completed', progress: 100 }
    ];
    
    render(<QuickStatsCard goals={incompleteGoals} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    // Should handle gracefully without crashing
  });

  it('should calculate stats with only completed goals', () => {
    const completedGoals = [
      { status: 'completed', streak: 30, progress: 100 },
      { status: 'completed', streak: 20, progress: 100 }
    ];
    
    render(<QuickStatsCard goals={completedGoals} />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Active goals
    expect(screen.getByText('2')).toBeInTheDocument(); // Completed goals
    expect(screen.getByText('0 days')).toBeInTheDocument(); // Total streak (only active count)
    expect(screen.getByText('0%')).toBeInTheDocument(); // Avg progress (only active count)
  });

  it('should calculate stats with only active goals', () => {
    const activeGoals = [
      { status: 'active', streak: 15, progress: 80, priority: 'high', daysRemaining: 2 },
      { status: 'active', streak: 5, progress: 60, priority: 'medium', daysRemaining: 10 }
    ];
    
    render(<QuickStatsCard goals={activeGoals} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Active goals
    expect(screen.getByText('0')).toBeInTheDocument(); // Completed goals
    expect(screen.getByText('20 days')).toBeInTheDocument(); // Total streak
    expect(screen.getByText('70%')).toBeInTheDocument(); // Avg progress (80 + 60) / 2 = 70
  });

  it('should render with correct styling classes', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    const container = screen.getByText('Quick Stats').closest('div');
    expect(container).toHaveClass('bg-card', 'rounded-lg', 'border', 'border-border', 'p-6', 'mb-6');
  });

  it('should render title with correct styling', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    const title = screen.getByText('Quick Stats');
    expect(title).toHaveClass('text-lg', 'font-heading', 'font-semibold', 'text-foreground');
  });

  it('should render stats grid with correct styling', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    const statsGrid = screen.getByTestId('icon-Target').closest('div').parentElement.parentElement;
    expect(statsGrid).toHaveClass('grid', 'grid-cols-2', 'lg:grid-cols-4', 'gap-4', 'mb-6');
  });

  it('should render icons with correct sizes', () => {
    render(<QuickStatsCard goals={mockGoals} />);
    
    const icons = [
      screen.getByTestId('icon-Target'),
      screen.getByTestId('icon-CheckCircle'),
      screen.getByTestId('icon-Flame'),
      screen.getByTestId('icon-TrendingUp')
    ];

    icons.forEach(icon => {
      expect(icon).toHaveAttribute('data-size', '20');
    });
  });

  it('should handle single goal correctly', () => {
    const singleGoal = [{
      status: 'active',
      streak: 7,
      progress: 90,
      priority: 'high',
      daysRemaining: 1
    }];
    
    render(<QuickStatsCard goals={singleGoal} />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Active goals
    expect(screen.getByText('0')).toBeInTheDocument(); // Completed goals
    expect(screen.getByText('7 days')).toBeInTheDocument(); // Total streak
    expect(screen.getByText('90%')).toBeInTheDocument(); // Avg progress
  });

  it('should handle goals with zero values', () => {
    const zeroGoals = [{
      status: 'active',
      streak: 0,
      progress: 0,
      priority: 'low',
      daysRemaining: 30
    }];
    
    render(<QuickStatsCard goals={zeroGoals} />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Active goals
    expect(screen.getByText('0 days')).toBeInTheDocument(); // Total streak
    expect(screen.getByText('0%')).toBeInTheDocument(); // Avg progress
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    rerender(<QuickStatsCard goals={mockGoals} />);
    
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should handle mixed status goals', () => {
    const mixedGoals = [
      { status: 'active', streak: 1, progress: 10 },
      { status: 'paused', streak: 5, progress: 50 },
      { status: 'completed', streak: 10, progress: 100 },
      { status: 'cancelled', streak: 2, progress: 20 }
    ];
    
    render(<QuickStatsCard goals={mixedGoals} />);
    
    expect(screen.getByText('1')).toBeInTheDocument(); // Only 1 active goal
    expect(screen.getByText('1')).toBeInTheDocument(); // Only 1 completed goal
    expect(screen.getByText('1 days')).toBeInTheDocument(); // Only active goal streak
    expect(screen.getByText('10%')).toBeInTheDocument(); // Only active goal progress
  });
});