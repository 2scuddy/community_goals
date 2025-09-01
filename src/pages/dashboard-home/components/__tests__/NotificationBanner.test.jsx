import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationBanner from '../NotificationBanner';

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
  return function MockButton({ children, onClick, variant, size, iconName, iconSize, className, ...props }) {
    return (
      <button 
        onClick={onClick}
        data-testid={iconName ? `button-${iconName}` : 'action-button'}
        data-variant={variant}
        data-size={size}
        className={className}
        {...props}
      >
        {iconName || children}
      </button>
    );
  };
});

describe('NotificationBanner', () => {
  const mockNotifications = [
    {
      id: '1',
      type: 'success',
      title: 'Success!',
      message: 'Your goal was created successfully.'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Warning',
      message: 'Your streak is about to end.'
    },
    {
      id: '3',
      type: 'error',
      title: 'Error',
      message: 'Failed to save your progress.'
    },
    {
      id: '4',
      type: 'info',
      title: 'Info',
      message: 'New features are available.',
      action: {
        label: 'Learn More',
        onClick: jest.fn()
      }
    }
  ];

  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all notifications', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Your goal was created successfully.')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Your streak is about to end.')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to save your progress.')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('New features are available.')).toBeInTheDocument();
  });

  it('should render correct icons for different notification types', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByTestId('icon-CheckCircle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-AlertTriangle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-AlertCircle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Info')).toBeInTheDocument();
  });

  it('should render action button when notification has action', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('should call action onClick when action button is clicked', () => {
    const actionOnClick = jest.fn();
    const notificationWithAction = [{
      id: '1',
      type: 'info',
      title: 'Info',
      message: 'Test message',
      action: {
        label: 'Click Me',
        onClick: actionOnClick
      }
    }];
    
    render(<NotificationBanner notifications={notificationWithAction} onDismiss={mockOnDismiss} />);
    
    const actionButton = screen.getByTestId('action-button');
    fireEvent.click(actionButton);
    
    expect(actionOnClick).toHaveBeenCalledTimes(1);
  });

  it('should render dismiss buttons for all notifications', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const dismissButtons = screen.getAllByTestId('button-X');
    expect(dismissButtons).toHaveLength(4);
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const firstDismissButton = screen.getAllByTestId('button-X')[0];
    fireEvent.click(firstDismissButton);
    
    expect(mockOnDismiss).toHaveBeenCalledWith('1');
  });

  it('should remove notification from visible list when dismissed', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    
    const firstDismissButton = screen.getAllByTestId('button-X')[0];
    fireEvent.click(firstDismissButton);
    
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  });

  it('should apply correct styling for success notification', () => {
    const successNotification = [{
      id: '1',
      type: 'success',
      title: 'Success',
      message: 'Success message'
    }];
    
    render(<NotificationBanner notifications={successNotification} onDismiss={mockOnDismiss} />);
    
    const notification = screen.getByText('Success').closest('div').closest('div');
    expect(notification).toHaveClass('bg-success/10', 'border-success/20', 'text-success');
  });

  it('should apply correct styling for warning notification', () => {
    const warningNotification = [{
      id: '1',
      type: 'warning',
      title: 'Warning',
      message: 'Warning message'
    }];
    
    render(<NotificationBanner notifications={warningNotification} onDismiss={mockOnDismiss} />);
    
    const notification = screen.getByText('Warning').closest('div').closest('div');
    expect(notification).toHaveClass('bg-warning/10', 'border-warning/20', 'text-warning');
  });

  it('should apply correct styling for error notification', () => {
    const errorNotification = [{
      id: '1',
      type: 'error',
      title: 'Error',
      message: 'Error message'
    }];
    
    render(<NotificationBanner notifications={errorNotification} onDismiss={mockOnDismiss} />);
    
    const notification = screen.getByText('Error').closest('div').closest('div');
    expect(notification).toHaveClass('bg-error/10', 'border-error/20', 'text-error');
  });

  it('should apply default styling for unknown notification type', () => {
    const defaultNotification = [{
      id: '1',
      type: 'unknown',
      title: 'Default',
      message: 'Default message'
    }];
    
    render(<NotificationBanner notifications={defaultNotification} onDismiss={mockOnDismiss} />);
    
    const notification = screen.getByText('Default').closest('div').closest('div');
    expect(notification).toHaveClass('bg-primary/10', 'border-primary/20', 'text-primary');
  });

  it('should not render when notifications array is empty', () => {
    const { container } = render(<NotificationBanner notifications={[]} onDismiss={mockOnDismiss} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when notifications is null', () => {
    const { container } = render(<NotificationBanner notifications={null} onDismiss={mockOnDismiss} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when notifications is undefined', () => {
    const { container } = render(<NotificationBanner notifications={undefined} onDismiss={mockOnDismiss} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should handle notifications without actions', () => {
    const notificationWithoutAction = [{
      id: '1',
      type: 'info',
      title: 'Info',
      message: 'No action here'
    }];
    
    render(<NotificationBanner notifications={notificationWithoutAction} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('No action here')).toBeInTheDocument();
    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
  });

  it('should handle multiple dismissals', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const dismissButtons = screen.getAllByTestId('button-X');
    
    // Dismiss first notification
    fireEvent.click(dismissButtons[0]);
    expect(mockOnDismiss).toHaveBeenCalledWith('1');
    
    // Dismiss second notification
    fireEvent.click(dismissButtons[1]);
    expect(mockOnDismiss).toHaveBeenCalledWith('2');
    
    expect(mockOnDismiss).toHaveBeenCalledTimes(2);
  });

  it('should render with proper spacing classes', () => {
    render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    const container = screen.getByText('Success!').closest('div').closest('div').parentElement;
    expect(container).toHaveClass('space-y-3', 'mb-6');
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getAllByTestId('button-X')).toHaveLength(4);
    
    rerender(<NotificationBanner notifications={mockNotifications} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getAllByTestId('button-X')).toHaveLength(4);
  });

  it('should handle notification with missing properties gracefully', () => {
    const incompleteNotification = [{
      id: '1',
      type: 'info'
      // Missing title and message
    }];
    
    render(<NotificationBanner notifications={incompleteNotification} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByTestId('icon-Info')).toBeInTheDocument();
    expect(screen.getByTestId('button-X')).toBeInTheDocument();
  });
});