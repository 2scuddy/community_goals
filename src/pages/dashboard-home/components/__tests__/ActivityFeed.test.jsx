import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityFeed from '../ActivityFeed';

// Mock Button component
jest.mock('../../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, loading, disabled, ...props }) {
    return (
      <button 
        onClick={onClick}
        disabled={disabled || loading}
        data-testid="load-more-button"
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  };
});

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

// Mock supabaseService
jest.mock('../../../../services/supabaseService', () => ({
  utilityService: {
    formatRelativeTime: jest.fn((timestamp) => {
      if (!timestamp) return '';
      return '2 hours ago';
    })
  }
}));

describe('ActivityFeed', () => {
  const mockActivities = [
    {
      id: '1',
      type: 'check-in',
      content: 'Completed daily workout',
      created_at: '2024-01-01T10:00:00Z',
      user_profiles: {
        full_name: 'John Doe',
        username: 'johndoe',
        avatar_url: 'https://example.com/avatar1.jpg'
      },
      goals: {
        title: 'Fitness Journey'
      }
    },
    {
      id: '2',
      type: 'milestone',
      content: 'Reached 30-day streak',
      created_at: '2024-01-01T09:00:00Z',
      user_profiles: {
        username: 'janedoe'
      }
    },
    {
      id: '3',
      type: 'goal-created',
      content: 'Created new goal',
      created_at: '2024-01-01T08:00:00Z',
      userName: 'Bob Smith',
      userAvatar: 'https://example.com/avatar3.jpg'
    },
    {
      id: '4',
      type: 'badge-earned',
      content: 'Earned consistency badge',
      created_at: '2024-01-01T07:00:00Z',
      user_profiles: {}
    }
  ];

  const mockOnLoadMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render activity feed title and icon', () => {
    render(<ActivityFeed activities={[]} />);
    
    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Activity')).toBeInTheDocument();
  });

  it('should render empty state when no activities', () => {
    render(<ActivityFeed activities={[]} loading={false} />);
    
    expect(screen.getByText('No activities yet')).toBeInTheDocument();
    expect(screen.getByText('Start checking in and completing goals to see your activity feed come to life!')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Activity')).toBeInTheDocument();
  });

  it('should render activities list', () => {
    render(<ActivityFeed activities={mockActivities} />);
    
    expect(screen.getByText('Completed daily workout (Goal: Fitness Journey)')).toBeInTheDocument();
    expect(screen.getByText('Reached 30-day streak')).toBeInTheDocument();
    expect(screen.getByText('Created new goal')).toBeInTheDocument();
    expect(screen.getByText('Earned consistency badge')).toBeInTheDocument();
  });

  it('should display correct activity icons', () => {
    render(<ActivityFeed activities={mockActivities} />);
    
    expect(screen.getByTestId('icon-CheckCircle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Trophy')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Target')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Award')).toBeInTheDocument();
  });

  it('should display correct user names', () => {
    render(<ActivityFeed activities={mockActivities} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('janedoe')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  it('should display formatted timestamps', () => {
    render(<ActivityFeed activities={mockActivities} />);
    
    const timestamps = screen.getAllByText('2 hours ago');
    expect(timestamps).toHaveLength(4);
  });

  it('should render user avatars when available', () => {
    render(<ActivityFeed activities={mockActivities} />);
    
    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(2); // Only activities with avatar_url or userAvatar
  });

  it('should render load more button when hasMore is true', () => {
    render(
      <ActivityFeed 
        activities={mockActivities} 
        hasMore={true}
        onLoadMore={mockOnLoadMore}
      />
    );
    
    expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  it('should not render load more button when hasMore is false', () => {
    render(
      <ActivityFeed 
        activities={mockActivities} 
        hasMore={false}
        onLoadMore={mockOnLoadMore}
      />
    );
    
    expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
  });

  it('should call onLoadMore when load more button is clicked', () => {
    render(
      <ActivityFeed 
        activities={mockActivities} 
        hasMore={true}
        onLoadMore={mockOnLoadMore}
      />
    );
    
    const loadMoreButton = screen.getByTestId('load-more-button');
    fireEvent.click(loadMoreButton);
    
    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should show loading state on load more button', () => {
    render(
      <ActivityFeed 
        activities={mockActivities} 
        hasMore={true}
        loading={true}
        onLoadMore={mockOnLoadMore}
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle activities without goals', () => {
    const activitiesWithoutGoals = [
      {
        id: '1',
        type: 'check-in',
        content: 'Simple check-in',
        created_at: '2024-01-01T10:00:00Z',
        user_profiles: {
          full_name: 'John Doe'
        }
      }
    ];
    
    render(<ActivityFeed activities={activitiesWithoutGoals} />);
    
    expect(screen.getByText('Simple check-in')).toBeInTheDocument();
  });

  it('should handle unknown activity types', () => {
    const unknownTypeActivity = [
      {
        id: '1',
        type: 'unknown-type',
        content: 'Unknown activity',
        created_at: '2024-01-01T10:00:00Z',
        user_profiles: {
          full_name: 'John Doe'
        }
      }
    ];
    
    render(<ActivityFeed activities={unknownTypeActivity} />);
    
    expect(screen.getByTestId('icon-Activity')).toBeInTheDocument();
    expect(screen.getByText('Unknown activity')).toBeInTheDocument();
  });

  it('should handle missing timestamps', () => {
    const activityWithoutTimestamp = [
      {
        id: '1',
        type: 'check-in',
        content: 'Activity without timestamp',
        user_profiles: {
          full_name: 'John Doe'
        }
      }
    ];
    
    render(<ActivityFeed activities={activityWithoutTimestamp} />);
    
    expect(screen.getByText('Activity without timestamp')).toBeInTheDocument();
  });

  it('should apply correct color classes for different activity types', () => {
    render(<ActivityFeed activities={mockActivities} />);
    
    const checkInIcon = screen.getByTestId('icon-CheckCircle');
    const milestoneIcon = screen.getByTestId('icon-Trophy');
    const goalCreatedIcon = screen.getByTestId('icon-Target');
    const badgeEarnedIcon = screen.getByTestId('icon-Award');
    
    expect(checkInIcon).toHaveClass('text-primary');
    expect(milestoneIcon).toHaveClass('text-accent');
    expect(goalCreatedIcon).toHaveClass('text-secondary');
    expect(badgeEarnedIcon).toHaveClass('text-warning');
  });

  it('should render with default props', () => {
    render(<ActivityFeed />);
    
    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('No activities yet')).toBeInTheDocument();
  });

  it('should handle null/undefined activities gracefully', () => {
    render(<ActivityFeed activities={null} />);
    
    expect(screen.getByText('No activities yet')).toBeInTheDocument();
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<ActivityFeed activities={mockActivities} />);
    
    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    rerender(<ActivityFeed activities={mockActivities} />);
    
    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});