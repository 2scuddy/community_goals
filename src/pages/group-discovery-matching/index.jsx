import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import GroupCard from './components/GroupCard';
import FilterPanel from './components/FilterPanel';
import MatchedGroupsList from './components/MatchedGroupsList';
import QuickStats from './components/QuickStats';
import MatchNotification from './components/MatchNotification';
import SeasonCountdown from './components/SeasonCountdown';

const GroupDiscoveryMatching = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [matchNotification, setMatchNotification] = useState(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);

  // Mock data for available groups
  const [availableGroups] = useState([
    {
      id: 1,
      name: "Morning Fitness Warriors",
      focusAreas: ["Fitness & Health", "Personal Development"],
      memberCount: 6,
      maxMembers: 8,
      averageAge: 28,
      location: "2.3 miles away",
      distance: "2.3 mi",
      matchPercentage: 92,
      seasonProgress: 45,
      currentDay: 41,
      daysRemaining: 49,
      meetingFrequency: "Daily",
      isNew: true
    },
    {
      id: 2,
      name: "Career Growth Collective",
      focusAreas: ["Business & Career", "Financial", "Personal Development"],
      memberCount: 4,
      maxMembers: 6,
      averageAge: 32,
      location: "5.1 miles away",
      distance: "5.1 mi",
      matchPercentage: 87,
      seasonProgress: 62,
      currentDay: 56,
      daysRemaining: 34,
      meetingFrequency: "Weekly",
      isNew: false
    },
    {
      id: 3,
      name: "Mindful Living Circle",
      focusAreas: ["Personal Development", "Relationships"],
      memberCount: 7,
      maxMembers: 10,
      averageAge: 29,
      location: "1.8 miles away",
      distance: "1.8 mi",
      matchPercentage: 89,
      seasonProgress: 33,
      currentDay: 30,
      daysRemaining: 60,
      meetingFrequency: "Bi-weekly",
      isNew: false
    },
    {
      id: 4,
      name: "Financial Freedom Squad",
      focusAreas: ["Financial", "Business & Career"],
      memberCount: 5,
      maxMembers: 8,
      averageAge: 35,
      location: "3.7 miles away",
      distance: "3.7 mi",
      matchPercentage: 84,
      seasonProgress: 78,
      currentDay: 70,
      daysRemaining: 20,
      meetingFrequency: "Weekly",
      isNew: false
    }
  ]);

  // Mock data for matched groups
  const [matchedGroups] = useState([
    {
      id: 5,
      name: "Startup Hustlers",
      focusAreas: ["Business & Career", "Financial", "Personal Development"],
      memberCount: 6,
      maxMembers: 8,
      location: "4.2 miles away",
      distance: "4.2 mi",
      matchPercentage: 91,
      meetingFrequency: "Daily",
      status: "pending",
      estimatedResponse: "2-3 days",
      matchedAt: "2 hours ago",
      lastMessage: {
        sender: "Alex Chen",
        content: "Welcome to the group! Looking forward to working with you all this season.",
        time: "1h ago"
      }
    },
    {
      id: 6,
      name: "Wellness Warriors",
      focusAreas: ["Fitness & Health", "Personal Development"],
      memberCount: 4,
      maxMembers: 6,
      location: "1.5 miles away",
      distance: "1.5 mi",
      matchPercentage: 88,
      meetingFrequency: "Daily",
      status: "accepted",
      matchedAt: "1 day ago",
      lastMessage: {
        sender: "Sarah Johnson",
        content: "Great workout session today! Who's joining tomorrow's 6 AM run?",
        time: "3h ago"
      }
    }
  ]);

  // Mock stats
  const [stats] = useState({
    totalGroups: 247,
    totalMatches: 12,
    successRate: 78,
    averageMatch: 85
  });

  // Filter state
  const [filters, setFilters] = useState({
    categories: [],
    ageRange: [18, 65],
    locationRadius: 50,
    groupSize: [3, 10],
    meetingFrequencies: [],
    seasonProgress: [0, 100]
  });

  const handleSwipeRight = (groupId) => {
    const group = availableGroups?.find(g => g?.id === groupId);
    if (group) {
      // Simulate match notification
      setMatchNotification({
        groupId: group?.id,
        groupName: group?.name,
        matchPercentage: group?.matchPercentage,
        memberCount: group?.memberCount
      });
      setShowMatchNotification(true);
    }
    
    // Move to next card
    if (currentCardIndex < availableGroups?.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleSwipeLeft = (groupId) => {
    // Move to next card
    if (currentCardIndex < availableGroups?.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleViewDetails = () => {
    // Navigate to group details or show modal
    console.log('View group details');
  };

  const handleJoinGroup = (groupId) => {
    console.log('Request to join group:', groupId);
  };

  const handleViewGroup = (groupId) => {
    navigate('/group-dashboard-communication');
  };

  const handleViewMatch = (groupId) => {
    setActiveTab('matches');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      ageRange: [18, 65],
      locationRadius: 50,
      groupSize: [3, 10],
      meetingFrequencies: [],
      seasonProgress: [0, 100]
    });
  };

  const currentGroup = availableGroups?.[currentCardIndex];
  const hasMoreCards = currentCardIndex < availableGroups?.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              Find Your Accountability Group
            </h1>
            <p className="text-muted-foreground">
              Connect with like-minded individuals who share your goals and commitment to growth
            </p>
          </div>

          {/* Season Countdown */}
          <div className="mb-6">
            <SeasonCountdown 
              endDate="2025-11-27T23:59:59"
              currentSeason={4}
            />
          </div>

          {/* Quick Stats */}
          <div className="mb-6">
            <QuickStats stats={stats} />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'discover' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Discover Groups
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === 'matches' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Your Matches
              {matchedGroups?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {matchedGroups?.length}
                </span>
              )}
            </button>
          </div>

          <div className="lg:flex lg:space-x-6">
            {/* Main Content */}
            <div className="lg:flex-1">
              {activeTab === 'discover' && (
                <div>
                  {/* Filter Button - Mobile */}
                  <div className="flex justify-between items-center mb-6 lg:hidden">
                    <span className="text-sm text-muted-foreground">
                      {availableGroups?.length} groups available
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFilterOpen(true)}
                      iconName="Filter"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Filters
                    </Button>
                  </div>

                  {/* Group Cards */}
                  <div className="space-y-6">
                    {hasMoreCards || currentCardIndex === 0 ? (
                      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                        {/* Mobile: Single Card Stack */}
                        <div className="lg:hidden">
                          {currentGroup && (
                            <GroupCard
                              group={currentGroup}
                              onSwipeRight={handleSwipeRight}
                              onSwipeLeft={handleSwipeLeft}
                              onViewDetails={handleViewDetails}
                              isDesktop={false}
                            />
                          )}
                        </div>

                        {/* Desktop: Grid Layout */}
                        <div className="hidden lg:block lg:col-span-2">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {availableGroups?.slice(currentCardIndex, currentCardIndex + 4)?.map((group) => (
                              <GroupCard
                                key={group?.id}
                                group={group}
                                onSwipeRight={handleSwipeRight}
                                onSwipeLeft={handleSwipeLeft}
                                onViewDetails={handleViewDetails}
                                isDesktop={true}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Users" size={24} color="var(--color-muted-foreground)" />
                        </div>
                        <h3 className="text-lg font-heading font-medium text-foreground mb-2">
                          No More Groups
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
                          You've seen all available groups. Check back later for new groups or adjust your filters.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentCardIndex(0)}
                          iconName="RotateCcw"
                          iconPosition="left"
                          iconSize={16}
                        >
                          Start Over
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'matches' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-muted-foreground">
                      {matchedGroups?.length} matched groups
                    </span>
                  </div>
                  <MatchedGroupsList
                    matchedGroups={matchedGroups}
                    onJoinGroup={handleJoinGroup}
                    onViewGroup={handleViewGroup}
                  />
                </div>
              )}
            </div>

            {/* Filter Panel - Desktop Sidebar */}
            <div className="hidden lg:block lg:w-80">
              <div className="sticky top-24">
                <FilterPanel
                  isOpen={true}
                  onClose={() => {}}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Filter Panel - Mobile */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
      {/* Match Notification */}
      <MatchNotification
        match={matchNotification}
        isVisible={showMatchNotification}
        onClose={() => setShowMatchNotification(false)}
        onViewMatch={handleViewMatch}
      />
      <BottomNavigation />
    </div>
  );
};

export default GroupDiscoveryMatching;