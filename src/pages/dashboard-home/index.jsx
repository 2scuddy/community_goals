import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import HeroSection from './components/HeroSection';
import MetricsCard from './components/MetricsCard';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import NotificationBanner from './components/NotificationBanner';
import UpcomingMeetups from './components/UpcomingMeetups';
import GroupChatPreview from './components/GroupChatPreview';
import { useAuth } from '../../contexts/AuthContext';
import { checkInService, notificationService, userService, realtimeService } from '../../services/supabaseService';

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Mock data for features not yet implemented
  const mockMeetups = [
    {
      id: 1,
      title: "Morning Workout Session",
      date: new Date(Date.now() + 86400000), // Tomorrow
      location: "Central Park, NYC",
      attendees: [
        { name: "Sarah J.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" },
        { name: "Mike C.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
        { name: "Emma R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
        { name: "David P.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" }
      ],
      isJoined: false
    },
    {
      id: 2,
      title: "Book Club Discussion",
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      location: "Coffee Bean Café",
      attendees: [
        { name: "Emma R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
        { name: "Lisa T.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face" }
      ],
      isJoined: true
    }
  ];

  const mockGroupChats = [
    {
      id: 1,
      name: "Fitness Warriors",
      unreadCount: 3,
      lastMessage: {
        sender: "Sarah",
        content: "Great workout today everyone! Who is joining tomorrow?",
        timestamp: new Date(Date.now() - 600000)
      },
      members: [
        { name: "Sarah J.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" },
        { name: "Mike C.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
        { name: "David P.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" }
      ]
    },
    {
      id: 2,
      name: "Book Lovers United",
      unreadCount: 0,
      lastMessage: {
        sender: "Emma",
        content: "Just finished Atomic Habits - highly recommend!",
        timestamp: new Date(Date.now() - 3600000)
      },
      members: [
        { name: "Emma R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
        { name: "Lisa T.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face" }
      ]
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadInitialData();
      setupRealtimeSubscriptions();
    }
  }, [user?.id]);

  useEffect(() => {
    if (profile) {
      setCurrentStreak(profile?.streak_count || 0);
      
      // Check if user has checked in today
      const today = new Date()?.toDateString();
      const lastCheckIn = profile?.last_check_in_date ? new Date(profile.last_check_in_date)?.toDateString() : null;
      setHasCheckedInToday(lastCheckIn === today);
    }
  }, [profile]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load user stats
      const stats = await userService?.getUserStats(user?.id);
      setUserStats(stats || {});

      // Load activity feed
      const activityData = await checkInService?.getActivityFeed(20, 0);
      setActivities(activityData || []);

      // Load notifications
      const notificationData = await notificationService?.getUserNotifications(user?.id, 10);
      setNotifications(notificationData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to activity feed updates
    const activityChannel = realtimeService?.subscribeToActivityFeed((payload) => {
      if (payload?.eventType === 'INSERT' && payload?.new) {
        setActivities(prev => [payload?.new, ...prev]);
      }
    });

    // Subscribe to notifications
    const notificationChannel = realtimeService?.subscribeToNotifications(user?.id, (payload) => {
      if (payload?.eventType === 'INSERT' && payload?.new) {
        setNotifications(prev => [payload?.new, ...prev]);
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      realtimeService?.unsubscribe(activityChannel);
      realtimeService?.unsubscribe(notificationChannel);
    };
  };

  const handleQuickCheckIn = async () => {
    if (!user?.id) return;

    try {
      // For now, create a simple check-in without a specific goal
      const checkInData = {
        user_id: user?.id,
        type: 'progress',
        title: 'Daily Check-in',
        content: 'Checked in for today! Staying consistent with my goals.',
        mood_rating: 4,
        energy_level: 4,
        confidence_level: 4
      };

      await checkInService?.createCheckIn(checkInData);
      
      setHasCheckedInToday(true);
      setCurrentStreak(prev => prev + 1);
      
      // Remove check-in notification
      setNotifications(prev => prev?.filter(n => n?.title !== "Check-in Reminder"));
      
      // Refresh user profile to get updated streak
      // This will be handled by the AuthContext profile refresh
      
    } catch (error) {
      console.error('Error creating check-in:', error);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const moreActivities = await checkInService?.getActivityFeed(20, activities?.length);
      if (moreActivities?.length > 0) {
        setActivities(prev => [...prev, ...moreActivities]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      await notificationService?.markAsRead(notificationId);
      setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const handleJoinMeetup = (meetupId) => {
    // Handle meetup join logic - placeholder for future implementation
    console.log('Joining meetup:', meetupId);
  };

  const handleOpenChat = (groupId) => {
    window.location.href = '/group-dashboard-communication';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-foreground">Please sign in to access your dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
        {/* Notifications */}
        <NotificationBanner 
          notifications={notifications}
          onDismiss={handleDismissNotification}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Metrics Cards */}
            <div className="space-y-4">
              <MetricsCard
                title="Weekly Progress"
                value="85%"
                subtitle="5 of 7 days completed"
                icon="TrendingUp"
                trend={12}
                color="success"
              />
              <MetricsCard
                title="Group Rank"
                value="#3"
                subtitle="Out of 8 members"
                icon="Trophy"
                trend={0}
                color="warning"
              />
              <MetricsCard
                title="Total Points"
                value={userStats?.points || 0}
                subtitle="This month"
                icon="Star"
                trend={8}
                color="accent"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Hero Section */}
            <HeroSection
              currentStreak={currentStreak}
              hasCheckedInToday={hasCheckedInToday}
              onQuickCheckIn={handleQuickCheckIn}
              userName={profile?.full_name || user?.email}
            />

            {/* Mobile Metrics */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
              <MetricsCard
                title="Weekly Progress"
                value="85%"
                subtitle="5 of 7 days"
                icon="TrendingUp"
                trend={12}
                color="success"
              />
              <MetricsCard
                title="Group Rank"
                value="#3"
                subtitle="Out of 8"
                icon="Trophy"
                trend={5}
                color="warning"
              />
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Activity Feed */}
            <ActivityFeed
              activities={activities}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loading}
            />
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Upcoming Meetups */}
            <UpcomingMeetups
              meetups={mockMeetups}
              onJoinMeetup={handleJoinMeetup}
            />

            {/* Group Chat Preview */}
            <GroupChatPreview
              groups={mockGroupChats}
              onOpenChat={handleOpenChat}
            />
          </div>
        </div>

        {/* Mobile Bottom Sections */}
        <div className="lg:hidden mt-6 space-y-6">
          <UpcomingMeetups
            meetups={mockMeetups}
            onJoinMeetup={handleJoinMeetup}
          />
          <GroupChatPreview
            groups={mockGroupChats}
            onOpenChat={handleOpenChat}
          />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default DashboardHome;