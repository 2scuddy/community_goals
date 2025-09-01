import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryCard from '../CategoryCard';

// Mock AppIcon component
jest.mock('../../../../components/AppIcon', () => {
  return function MockIcon({ name, size, className, ...props }) {
    return (
      <span 
        data-testid={`icon-${name}`} 
        data-size={size}
        className={className}
        {...props}
      >
        {name}
      </span>
    );
  };
});

// Mock Button component
jest.mock('../../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, variant, size, iconName, iconPosition, iconSize, className, ...props }) {
    return (
      <button 
        onClick={onClick}
        data-testid={`button-${children?.toString().toLowerCase().replace(/\s+/g, '-') || 'button'}`}
        data-variant={variant}
        data-size={size}
        data-icon-name={iconName}
        data-icon-position={iconPosition}
        data-icon-size={iconSize}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  };
});

describe('CategoryCard', () => {
  const mockCategory = {
    id: '1',
    name: 'Fitness/Health',
    description: 'Health and fitness related goals'
  };

  const mockGoals = [
    {
      id: '1',
      title: 'Run 5K daily',
      description: 'Build endurance by running 5K every day',
      status: 'active',
      progress: 75,
      targetDate: '2024-12-31',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Lose 10 pounds',
      description: 'Achieve healthy weight loss',
      status: 'active',
      progress: 50,
      targetDate: '2024-11-30',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Complete marathon',
      description: 'Finish first marathon',
      status: 'completed',
      progress: 100,
      targetDate: '2024-06-15',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Archived goal',
      description: 'This goal was archived',
      status: 'archived',
      progress: 25,
      targetDate: '2024-05-01',
      priority: 'low'
    }
  ];

  const mockCallbacks = {
    onCreateGoal: jest.fn(),
    onEditGoal: jest.fn(),
    onArchiveGoal: jest.fn(),
    onShareGoal: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render category card with correct icon and name', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Fitness/Health')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Heart')).toBeInTheDocument();
  });

  it('should display correct category description', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Health and fitness related goals')).toBeInTheDocument();
  });

  it('should show active and completed goal counts', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('2 Active')).toBeInTheDocument();
    expect(screen.getByText('1 Completed')).toBeInTheDocument();
  });

  it('should expand and collapse when clicked', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    
    // Initially collapsed
    expect(screen.queryByText('Run 5K daily')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(cardHeader);
    expect(screen.getByText('Run 5K daily')).toBeInTheDocument();
    expect(screen.getByText('Lose 10 pounds')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(cardHeader);
    expect(screen.queryByText('Run 5K daily')).not.toBeInTheDocument();
  });

  it('should display chevron icon that rotates on expand', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const chevronIcon = screen.getByTestId('icon-ChevronDown');
    expect(chevronIcon).toBeInTheDocument();
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    // Check if chevron has rotation class when expanded
    expect(chevronIcon).toHaveClass('rotate-180');
  });

  it('should render Create Goal button', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByTestId('button-create-goal')).toBeInTheDocument();
  });

  it('should call onCreateGoal when Create Goal button is clicked', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    const createButton = screen.getByTestId('button-create-goal');
    fireEvent.click(createButton);
    
    expect(mockCallbacks.onCreateGoal).toHaveBeenCalledWith(mockCategory.id);
  });

  it('should display active goals when expanded', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByText('Run 5K daily')).toBeInTheDocument();
    expect(screen.getByText('Build endurance by running 5K every day')).toBeInTheDocument();
    expect(screen.getByText('Lose 10 pounds')).toBeInTheDocument();
    expect(screen.getByText('Achieve healthy weight loss')).toBeInTheDocument();
  });

  it('should display goal progress bars', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should display goal target dates', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
    expect(screen.getByText('Nov 30, 2024')).toBeInTheDocument();
  });

  it('should display priority badges', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should render goal action buttons', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getAllByTestId('button-edit')).toHaveLength(2);
    expect(screen.getAllByTestId('button-archive')).toHaveLength(2);
    expect(screen.getAllByTestId('button-share')).toHaveLength(2);
  });

  it('should call onEditGoal when edit button is clicked', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    const editButtons = screen.getAllByTestId('button-edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockCallbacks.onEditGoal).toHaveBeenCalledWith('1');
  });

  it('should call onArchiveGoal when archive button is clicked', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    const archiveButtons = screen.getAllByTestId('button-archive');
    fireEvent.click(archiveButtons[0]);
    
    expect(mockCallbacks.onArchiveGoal).toHaveBeenCalledWith('1');
  });

  it('should call onShareGoal when share button is clicked', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    const shareButtons = screen.getAllByTestId('button-share');
    fireEvent.click(shareButtons[0]);
    
    expect(mockCallbacks.onShareGoal).toHaveBeenCalledWith('1');
  });

  it('should render correct icons for different categories', () => {
    const categories = [
      { name: 'Business/Career', expectedIcon: 'Briefcase' },
      { name: 'Relationships', expectedIcon: 'Users' },
      { name: 'Personal Development', expectedIcon: 'Brain' },
      { name: 'Financial', expectedIcon: 'DollarSign' },
      { name: 'Unknown Category', expectedIcon: 'Target' }
    ];
    
    categories.forEach(({ name, expectedIcon }) => {
      const { unmount } = render(
        <CategoryCard 
          category={{ id: '1', name, description: 'Test' }} 
          goals={[]} 
          {...mockCallbacks}
        />
      );
      
      expect(screen.getByTestId(`icon-${expectedIcon}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should apply correct color classes for different categories', () => {
    const businessCategory = { id: '1', name: 'Business/Career', description: 'Test' };
    
    render(
      <CategoryCard 
        category={businessCategory} 
        goals={[]} 
        {...mockCallbacks}
      />
    );
    
    const icon = screen.getByTestId('icon-Briefcase');
    expect(icon).toHaveClass('text-blue-600');
  });

  it('should handle empty goals array', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={[]} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('0 Active')).toBeInTheDocument();
    expect(screen.getByText('0 Completed')).toBeInTheDocument();
  });

  it('should handle null goals array', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={null} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('0 Active')).toBeInTheDocument();
    expect(screen.getByText('0 Completed')).toBeInTheDocument();
  });

  it('should handle undefined goals array', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={undefined} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('0 Active')).toBeInTheDocument();
    expect(screen.getByText('0 Completed')).toBeInTheDocument();
  });

  it('should not display completed goals in active goals section', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    // Should show active goals
    expect(screen.getByText('Run 5K daily')).toBeInTheDocument();
    expect(screen.getByText('Lose 10 pounds')).toBeInTheDocument();
    
    // Should not show completed goal in active section
    expect(screen.queryByText('Complete marathon')).not.toBeInTheDocument();
  });

  it('should handle goals without all properties gracefully', () => {
    const incompleteGoals = [{
      id: '1',
      title: 'Incomplete Goal',
      status: 'active'
      // Missing description, progress, targetDate, priority
    }];
    
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={incompleteGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByText('Incomplete Goal')).toBeInTheDocument();
  });

  it('should render with proper styling classes', () => {
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const container = screen.getByText('Fitness/Health').closest('div').parentElement;
    expect(container).toHaveClass('bg-card', 'rounded-lg', 'border', 'border-border', 'shadow-warm');
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Fitness/Health')).toBeInTheDocument();
    expect(screen.getByText('2 Active')).toBeInTheDocument();
    
    rerender(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Fitness/Health')).toBeInTheDocument();
    expect(screen.getByText('2 Active')).toBeInTheDocument();
  });

  it('should handle category without description', () => {
    const categoryWithoutDescription = { id: '1', name: 'Test Category' };
    
    render(
      <CategoryCard 
        category={categoryWithoutDescription} 
        goals={[]} 
        {...mockCallbacks}
      />
    );
    
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('should prevent event bubbling on action buttons', () => {
    const mockExpand = jest.fn();
    
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={mockGoals} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    const editButton = screen.getAllByTestId('button-edit')[0];
    fireEvent.click(editButton);
    
    // Should call onEditGoal but not affect expansion state
    expect(mockCallbacks.onEditGoal).toHaveBeenCalledWith('1');
  });

  it('should display different priority colors', () => {
    const goalsWithDifferentPriorities = [
      { id: '1', title: 'High Priority', status: 'active', priority: 'high' },
      { id: '2', title: 'Medium Priority', status: 'active', priority: 'medium' },
      { id: '3', title: 'Low Priority', status: 'active', priority: 'low' }
    ];
    
    render(
      <CategoryCard 
        category={mockCategory} 
        goals={goalsWithDifferentPriorities} 
        {...mockCallbacks}
      />
    );
    
    const cardHeader = screen.getByText('Fitness/Health').closest('div');
    fireEvent.click(cardHeader);
    
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});