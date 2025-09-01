import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupChatPreview from '../GroupChatPreview';

// Mock AppIcon component
jest.mock('../../../../components/AppIcon', () => {
  return function MockIcon({ name, size, color, className, ...props }) {
    return (
      <span 
        data-testid={`icon-${name}`} 
        data-size={size}
        data-color={color}
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
  return function MockButton({ children, onClick, variant, size, iconName, iconPosition, iconSize, ...props }) {
    return (
      <button 
        onClick={onClick}
        data-testid="find-groups-button"
        data-variant={variant}
        data-size={size}
        data-icon-name={iconName}
        data-icon-position={iconPosition}
        data-icon-size={iconSize}
        {...props}
      >
        {children}
      </button>
    );
  };
});

// Mock AppImage component
jest.mock('../../../../components/AppImage', () => {
  return function MockImage({ src, alt, className, ...props }) {
    return (
      <img 
        src={src}
        alt={alt}
        className={className}
        data-testid="group-image"
        {...props}
      />
    );
  };
});

// Mock window.location.href
const mockLocationHref = jest.fn();
delete window.location;
window.location = { href: '' };

describe('GroupChatPreview', () => {
  const mockGroups = [
    {
      id: '1',
      name: 'Fitness Enthusiasts',
      lastMessage: {
        content: 'Great workout today!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        sender: {
          name: 'John Doe'
        }
      },
      unreadCount: 2,
      memberCount: 15
    },
    {
      id: '2',
      name: 'Study Group',
      lastMessage: {
        content: 'Meeting tomorrow at 3pm',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        sender: {
          name: 'Jane Smith'
        }
      },
      unreadCount: 0,
      memberCount: 8
    },
    {
      id: '3',
      name: 'Book Club',
      lastMessage: {
        content: 'What did everyone think of chapter 5?',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        sender: {
          name: 'Bob Wilson'
        }
      },
      unreadCount: 12,
      memberCount: 25
    },
    {
      id: '4',
      name: 'Cooking Masters',
      lastMessage: {
        content: 'Try this recipe!',
        timestamp: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
        sender: {
          name: 'Alice Brown'
        }
      },
      unreadCount: 1,
      memberCount: 12
    },
    {
      id: '5',
      name: 'Extra Group',
      lastMessage: {
        content: 'This should not appear',
        timestamp: new Date().toISOString(),
        sender: {
          name: 'Extra User'
        }
      },
      unreadCount: 0,
      memberCount: 5
    }
  ];

  const mockOnOpenChat = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window.location, 'href', {
      set: mockLocationHref,
      configurable: true,
    });
  });

  it('should render empty state when no groups', () => {
    render(<GroupChatPreview groups={[]} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('No Group Chats')).toBeInTheDocument();
    expect(screen.getByText('Join a group to start chatting with your accountability partners')).toBeInTheDocument();
    expect(screen.getByTestId('icon-MessageCircle')).toBeInTheDocument();
    expect(screen.getByTestId('find-groups-button')).toBeInTheDocument();
  });

  it('should navigate to group discovery when Find Groups button is clicked', () => {
    render(<GroupChatPreview groups={[]} onOpenChat={mockOnOpenChat} />);
    
    const findGroupsButton = screen.getByTestId('find-groups-button');
    fireEvent.click(findGroupsButton);
    
    expect(mockLocationHref).toHaveBeenCalledWith('/group-discovery-matching');
  });

  it('should render group chats header when groups exist', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('Group Chats')).toBeInTheDocument();
  });

  it('should render only first 4 groups', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('Fitness Enthusiasts')).toBeInTheDocument();
    expect(screen.getByText('Study Group')).toBeInTheDocument();
    expect(screen.getByText('Book Club')).toBeInTheDocument();
    expect(screen.getByText('Cooking Masters')).toBeInTheDocument();
    expect(screen.queryByText('Extra Group')).not.toBeInTheDocument();
  });

  it('should display group names and last messages', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('Fitness Enthusiasts')).toBeInTheDocument();
    expect(screen.getByText('Great workout today!')).toBeInTheDocument();
    expect(screen.getByText('Study Group')).toBeInTheDocument();
    expect(screen.getByText('Meeting tomorrow at 3pm')).toBeInTheDocument();
  });

  it('should display sender names', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
  });

  it('should display member counts', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('15 members')).toBeInTheDocument();
    expect(screen.getByText('8 members')).toBeInTheDocument();
    expect(screen.getByText('25 members')).toBeInTheDocument();
    expect(screen.getByText('12 members')).toBeInTheDocument();
  });

  it('should display unread count badges for groups with unread messages', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Fitness Enthusiasts
    expect(screen.getByText('9+')).toBeInTheDocument(); // Book Club (12 > 9)
    expect(screen.getByText('1')).toBeInTheDocument(); // Cooking Masters
  });

  it('should not display unread badge for groups with no unread messages', () => {
    const groupsWithNoUnread = [{
      id: '1',
      name: 'Test Group',
      lastMessage: {
        content: 'Test message',
        timestamp: new Date().toISOString(),
        sender: { name: 'Test User' }
      },
      unreadCount: 0,
      memberCount: 5
    }];
    
    render(<GroupChatPreview groups={groupsWithNoUnread} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should format timestamps correctly', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('5m')).toBeInTheDocument(); // 5 minutes ago
    expect(screen.getByText('2h')).toBeInTheDocument(); // 2 hours ago
    expect(screen.getByText('1d')).toBeInTheDocument(); // 1 day ago
    expect(screen.getByText('now')).toBeInTheDocument(); // 30 seconds ago (< 1 minute)
  });

  it('should call onOpenChat when group is clicked', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    const firstGroup = screen.getByText('Fitness Enthusiasts').closest('div');
    fireEvent.click(firstGroup);
    
    expect(mockOnOpenChat).toHaveBeenCalledWith('1');
  });

  it('should call onOpenChat for different groups', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    const secondGroup = screen.getByText('Study Group').closest('div');
    fireEvent.click(secondGroup);
    
    expect(mockOnOpenChat).toHaveBeenCalledWith('2');
  });

  it('should render group icons', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    const groupIcons = screen.getAllByTestId('icon-Users');
    expect(groupIcons.length).toBeGreaterThan(0);
  });

  it('should handle groups without last messages gracefully', () => {
    const groupsWithoutMessages = [{
      id: '1',
      name: 'Empty Group',
      unreadCount: 0,
      memberCount: 3
    }];
    
    render(<GroupChatPreview groups={groupsWithoutMessages} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('Empty Group')).toBeInTheDocument();
    expect(screen.getByText('3 members')).toBeInTheDocument();
  });

  it('should handle null groups array', () => {
    render(<GroupChatPreview groups={null} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('No Group Chats')).toBeInTheDocument();
  });

  it('should handle undefined groups array', () => {
    render(<GroupChatPreview groups={undefined} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('No Group Chats')).toBeInTheDocument();
  });

  it('should apply hover effects to group items', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    const firstGroup = screen.getByText('Fitness Enthusiasts').closest('div');
    expect(firstGroup).toHaveClass('hover:bg-muted/50', 'transition-smooth', 'cursor-pointer');
  });

  it('should render with proper styling classes', () => {
    render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    const container = screen.getByText('Group Chats').closest('div').parentElement;
    expect(container).toHaveClass('bg-card', 'rounded-lg', 'border', 'border-border', 'shadow-warm');
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('Group Chats')).toBeInTheDocument();
    expect(screen.getByText('Fitness Enthusiasts')).toBeInTheDocument();
    
    rerender(<GroupChatPreview groups={mockGroups} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('Group Chats')).toBeInTheDocument();
    expect(screen.getByText('Fitness Enthusiasts')).toBeInTheDocument();
  });

  it('should handle very recent messages (now)', () => {
    const recentGroup = [{
      id: '1',
      name: 'Recent Group',
      lastMessage: {
        content: 'Just now message',
        timestamp: new Date().toISOString(),
        sender: { name: 'Recent User' }
      },
      unreadCount: 1,
      memberCount: 5
    }];
    
    render(<GroupChatPreview groups={recentGroup} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('now')).toBeInTheDocument();
  });

  it('should handle large unread counts with 9+ display', () => {
    const groupWithManyUnread = [{
      id: '1',
      name: 'Busy Group',
      lastMessage: {
        content: 'Lots of messages',
        timestamp: new Date().toISOString(),
        sender: { name: 'Active User' }
      },
      unreadCount: 25,
      memberCount: 50
    }];
    
    render(<GroupChatPreview groups={groupWithManyUnread} onOpenChat={mockOnOpenChat} />);
    
    expect(screen.getByText('9+')).toBeInTheDocument();
  });
});