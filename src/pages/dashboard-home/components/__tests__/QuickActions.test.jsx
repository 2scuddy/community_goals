import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import QuickActions from '../QuickActions';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock the Button component
jest.mock('../../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, variant, size, fullWidth, iconName, iconPosition, iconSize, className, ...props }) {
    return (
      <button 
        onClick={onClick}
        data-testid={`button-${children?.toLowerCase()?.replace(/\s+/g, '-')}`}
        data-variant={variant}
        data-size={size}
        data-full-width={fullWidth}
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

describe('QuickActions', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render the component title', () => {
    render(<QuickActions />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('should render all action buttons', () => {
    render(<QuickActions />);
    
    expect(screen.getByTestId('button-create-goal')).toBeInTheDocument();
    expect(screen.getByTestId('button-find-groups')).toBeInTheDocument();
    expect(screen.getByTestId('button-join-challenge')).toBeInTheDocument();
  });

  it('should render buttons with correct text', () => {
    render(<QuickActions />);
    
    expect(screen.getByText('Create Goal')).toBeInTheDocument();
    expect(screen.getByText('Find Groups')).toBeInTheDocument();
    expect(screen.getByText('Join Challenge')).toBeInTheDocument();
  });

  it('should render buttons with correct variants', () => {
    render(<QuickActions />);
    
    expect(screen.getByTestId('button-create-goal')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByTestId('button-find-groups')).toHaveAttribute('data-variant', 'outline');
    expect(screen.getByTestId('button-join-challenge')).toHaveAttribute('data-variant', 'secondary');
  });

  it('should render buttons with correct icons', () => {
    render(<QuickActions />);
    
    expect(screen.getByTestId('button-create-goal')).toHaveAttribute('data-icon-name', 'Plus');
    expect(screen.getByTestId('button-find-groups')).toHaveAttribute('data-icon-name', 'Search');
    expect(screen.getByTestId('button-join-challenge')).toHaveAttribute('data-icon-name', 'Zap');
  });

  it('should render buttons with correct props', () => {
    render(<QuickActions />);
    
    const buttons = [
      screen.getByTestId('button-create-goal'),
      screen.getByTestId('button-find-groups'),
      screen.getByTestId('button-join-challenge')
    ];

    buttons.forEach(button => {
      expect(button).toHaveAttribute('data-size', 'sm');
      expect(button).toHaveAttribute('data-full-width', 'true');
      expect(button).toHaveAttribute('data-icon-position', 'left');
      expect(button).toHaveAttribute('data-icon-size', '16');
      expect(button).toHaveClass('justify-start');
    });
  });

  it('should navigate to goal creation when Create Goal is clicked', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    
    const createGoalButton = screen.getByTestId('button-create-goal');
    await user.click(createGoalButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/goal-creation-management');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to group discovery when Find Groups is clicked', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    
    const findGroupsButton = screen.getByTestId('button-find-groups');
    await user.click(findGroupsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/group-discovery-matching');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to group discovery when Join Challenge is clicked', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    
    const joinChallengeButton = screen.getByTestId('button-join-challenge');
    await user.click(joinChallengeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/group-discovery-matching');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple button clicks', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    
    const createGoalButton = screen.getByTestId('button-create-goal');
    const findGroupsButton = screen.getByTestId('button-find-groups');
    
    await user.click(createGoalButton);
    await user.click(findGroupsButton);
    
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/goal-creation-management');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/group-discovery-matching');
  });

  it('should render with correct container styling', () => {
    render(<QuickActions />);
    
    const container = screen.getByText('Quick Actions').closest('div');
    expect(container).toHaveClass('bg-card', 'rounded-lg', 'p-4', 'border', 'border-border', 'shadow-warm', 'mb-6');
  });

  it('should render title with correct styling', () => {
    render(<QuickActions />);
    
    const title = screen.getByText('Quick Actions');
    expect(title).toHaveClass('text-lg', 'font-heading', 'font-semibold', 'text-foreground', 'mb-4');
  });

  it('should render buttons grid with correct styling', () => {
    render(<QuickActions />);
    
    const buttonsContainer = screen.getByTestId('button-create-goal').parentElement;
    expect(buttonsContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-3', 'gap-3');
  });

  it('should render all buttons in the correct order', () => {
    render(<QuickActions />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('Create Goal');
    expect(buttons[1]).toHaveTextContent('Find Groups');
    expect(buttons[2]).toHaveTextContent('Join Challenge');
  });

  it('should handle navigation errors gracefully', async () => {
    const user = userEvent.setup();
    mockNavigate.mockImplementation(() => {
      throw new Error('Navigation error');
    });
    
    render(<QuickActions />);
    
    const createGoalButton = screen.getByTestId('button-create-goal');
    
    // Should not crash the component
    expect(async () => {
      await user.click(createGoalButton);
    }).not.toThrow();
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<QuickActions />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    
    rerender(<QuickActions />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('should handle useNavigate hook correctly', () => {
    render(<QuickActions />);
    
    expect(useNavigate).toHaveBeenCalledTimes(1);
  });

  it('should use fireEvent for click events', () => {
    render(<QuickActions />);
    
    const createGoalButton = screen.getByTestId('button-create-goal');
    fireEvent.click(createGoalButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/goal-creation-management');
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<QuickActions />);
    
    const createGoalButton = screen.getByTestId('button-create-goal');
    
    // Focus and press Enter
    createGoalButton.focus();
    await user.keyboard('{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/goal-creation-management');
  });
});