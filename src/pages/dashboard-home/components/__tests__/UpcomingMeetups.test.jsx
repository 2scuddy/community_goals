import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpcomingMeetups from '../UpcomingMeetups';

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
        data-testid={iconName ? `button-${iconName}` : 'join-button'}
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
        data-testid="meetup-image"
        {...props}
      />
    );
  };
});

// Mock window.location.href
const mockLocationHref = jest.fn();

// Store original location
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
});

describe('UpcomingMeetups', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const mockMeetups = [
    {
      id: '1',
      title: 'Morning Workout Session',
      description: 'Join us for an energizing morning workout',
      date: today.toISOString(),
      location: 'Central Park',
      attendeeCount: 8,
      maxAttendees: 15,
      group: {
        name: 'Fitness Enthusiasts',
        image: 'https://example.com/group1.jpg'
      },
      isJoined: false
    },
    {
      id: '2',
      title: 'Study Group Meeting',
      description: 'Weekly study session for exam prep',
      date: tomorrow.toISOString(),
      location: 'Library Room 201',
      attendeeCount: 12,
      maxAttendees: 20,
      group: {
        name: 'Study Buddies'
      },
      isJoined: true
    },
    {
      id: '3',
      title: 'Book Discussion',
      description: 'Discussing chapters 5-8 of our current book',
      date: nextWeek.toISOString(),
      location: 'Coffee Shop Downtown',
      attendeeCount: 6,
      maxAttendees: 10,
      group: {
        name: 'Book Club',
        image: 'https://example.com/group3.jpg'
      },
      isJoined: false
    },
    {
      id: '4',
      title: 'Extra Meetup',
      description: 'This should not appear (4th item)',
      date: nextWeek.toISOString(),
      location: 'Somewhere',
      attendeeCount: 5,
      maxAttendees: 10,
      group: {
        name: 'Extra Group'
      },
      isJoined: false
    }
  ];

  const mockOnJoinMeetup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });
  
  afterAll(() => {
    window.location = originalLocation;
  });

  it('should render empty state when no meetups', () => {
    render(<UpcomingMeetups meetups={[]} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('No Upcoming Meetups')).toBeInTheDocument();
    expect(screen.getByText('Join a group to start scheduling meetups with your accountability partners')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Calendar')).toBeInTheDocument();
    expect(screen.getByTestId('button-Users')).toBeInTheDocument();
  });

  it('should navigate to group discovery when Find Groups button is clicked', () => {
    render(<UpcomingMeetups meetups={[]} onJoinMeetup={mockOnJoinMeetup} />);
    
    const findGroupsButton = screen.getByTestId('button-Users');
    fireEvent.click(findGroupsButton);
    
    expect(mockLocationHref).toHaveBeenCalledWith('/group-discovery-matching');
  });

  it('should render meetups header when meetups exist', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Upcoming Meetups')).toBeInTheDocument();
  });

  it('should render only first 3 meetups', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Morning Workout Session')).toBeInTheDocument();
    expect(screen.getByText('Study Group Meeting')).toBeInTheDocument();
    expect(screen.getByText('Book Discussion')).toBeInTheDocument();
    expect(screen.queryByText('Extra Meetup')).not.toBeInTheDocument();
  });

  it('should display meetup titles and descriptions', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Morning Workout Session')).toBeInTheDocument();
    expect(screen.getByText('Join us for an energizing morning workout')).toBeInTheDocument();
    expect(screen.getByText('Study Group Meeting')).toBeInTheDocument();
    expect(screen.getByText('Weekly study session for exam prep')).toBeInTheDocument();
  });

  it('should display group names', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Fitness Enthusiasts')).toBeInTheDocument();
    expect(screen.getByText('Study Buddies')).toBeInTheDocument();
    expect(screen.getByText('Book Club')).toBeInTheDocument();
  });

  it('should display locations', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.getByText('Library Room 201')).toBeInTheDocument();
    expect(screen.getByText('Coffee Shop Downtown')).toBeInTheDocument();
  });

  it('should display attendee counts', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('8/15 attending')).toBeInTheDocument();
    expect(screen.getByText('12/20 attending')).toBeInTheDocument();
    expect(screen.getByText('6/10 attending')).toBeInTheDocument();
  });

  it('should format today dates correctly', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const todayText = screen.getByText(/Today,/);
    expect(todayText).toBeInTheDocument();
  });

  it('should format tomorrow dates correctly', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const tomorrowText = screen.getByText(/Tomorrow,/);
    expect(tomorrowText).toBeInTheDocument();
  });

  it('should format future dates correctly', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    // Should show month and day for dates beyond tomorrow
    const futureDateElements = screen.getAllByText(/\w{3} \d{1,2}/);
    expect(futureDateElements.length).toBeGreaterThan(0);
  });

  it('should render group images when available', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const images = screen.getAllByTestId('meetup-image');
    expect(images).toHaveLength(2); // Only first and third meetups have images
  });

  it('should render default group icons when no image', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const groupIcons = screen.getAllByTestId('icon-Users');
    expect(groupIcons.length).toBeGreaterThan(0);
  });

  it('should show Join button for meetups not joined', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const joinButtons = screen.getAllByText('Join');
    expect(joinButtons).toHaveLength(2); // First and third meetups are not joined
  });

  it('should show Joined status for joined meetups', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Joined')).toBeInTheDocument();
  });

  it('should call onJoinMeetup when Join button is clicked', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const joinButtons = screen.getAllByText('Join');
    fireEvent.click(joinButtons[0]);
    
    expect(mockOnJoinMeetup).toHaveBeenCalledWith('1');
  });

  it('should call onJoinMeetup for different meetups', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const joinButtons = screen.getAllByText('Join');
    fireEvent.click(joinButtons[1]); // Second join button (third meetup)
    
    expect(mockOnJoinMeetup).toHaveBeenCalledWith('3');
  });

  it('should render location and calendar icons', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const locationIcons = screen.getAllByTestId('icon-MapPin');
    const calendarIcons = screen.getAllByTestId('icon-Clock');
    
    expect(locationIcons.length).toBeGreaterThan(0);
    expect(calendarIcons.length).toBeGreaterThan(0);
  });

  it('should handle meetups without groups gracefully', () => {
    const meetupsWithoutGroups = [{
      id: '1',
      title: 'Solo Meetup',
      description: 'A meetup without group info',
      date: today.toISOString(),
      location: 'Somewhere',
      attendeeCount: 5,
      maxAttendees: 10,
      isJoined: false
    }];
    
    render(<UpcomingMeetups meetups={meetupsWithoutGroups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Solo Meetup')).toBeInTheDocument();
    expect(screen.getByText('A meetup without group info')).toBeInTheDocument();
  });

  it('should handle null meetups array', () => {
    render(<UpcomingMeetups meetups={null} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('No Upcoming Meetups')).toBeInTheDocument();
  });

  it('should handle undefined meetups array', () => {
    render(<UpcomingMeetups meetups={undefined} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('No Upcoming Meetups')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const container = screen.getByText('Upcoming Meetups').closest('div').parentElement;
    expect(container).toHaveClass('bg-card', 'rounded-lg', 'border', 'border-border', 'shadow-warm');
  });

  it('should render with proper divider styling', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const dividerContainer = screen.getByText('Morning Workout Session').closest('div').parentElement;
    expect(dividerContainer).toHaveClass('divide-y', 'divide-border');
  });

  it('should handle meetups with missing properties gracefully', () => {
    const incompleteMeetup = [{
      id: '1',
      title: 'Incomplete Meetup',
      date: today.toISOString(),
      isJoined: false
      // Missing description, location, attendee info, group
    }];
    
    render(<UpcomingMeetups meetups={incompleteMeetup} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Incomplete Meetup')).toBeInTheDocument();
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Upcoming Meetups')).toBeInTheDocument();
    expect(screen.getByText('Morning Workout Session')).toBeInTheDocument();
    
    rerender(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Upcoming Meetups')).toBeInTheDocument();
    expect(screen.getByText('Morning Workout Session')).toBeInTheDocument();
  });

  it('should handle edge case date formatting', () => {
    const edgeCaseMeetup = [{
      id: '1',
      title: 'Edge Case Meetup',
      date: new Date('2024-12-31T23:59:59Z').toISOString(),
      location: 'Test Location',
      attendeeCount: 1,
      maxAttendees: 5,
      isJoined: false
    }];
    
    render(<UpcomingMeetups meetups={edgeCaseMeetup} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText('Edge Case Meetup')).toBeInTheDocument();
  });

  it('should display correct button variants for join states', () => {
    render(<UpcomingMeetups meetups={mockMeetups} onJoinMeetup={mockOnJoinMeetup} />);
    
    const joinButtons = screen.getAllByTestId('join-button');
    const joinedButton = screen.getByText('Joined').closest('button');
    
    // Check that joined button has different styling
    expect(joinedButton).toHaveAttribute('data-variant', 'ghost');
  });

  it('should handle very long meetup titles and descriptions', () => {
    const longContentMeetup = [{
      id: '1',
      title: 'This is a very long meetup title that should be handled gracefully by the component',
      description: 'This is an extremely long description that goes on and on and should be properly displayed without breaking the layout or causing any issues with the component rendering',
      date: today.toISOString(),
      location: 'Very Long Location Name That Should Also Be Handled Properly',
      attendeeCount: 99,
      maxAttendees: 100,
      isJoined: false
    }];
    
    render(<UpcomingMeetups meetups={longContentMeetup} onJoinMeetup={mockOnJoinMeetup} />);
    
    expect(screen.getByText(/This is a very long meetup title/)).toBeInTheDocument();
    expect(screen.getByText(/This is an extremely long description/)).toBeInTheDocument();
  });
});