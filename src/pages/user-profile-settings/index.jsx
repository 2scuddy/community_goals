import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import ProfileHeader from './components/ProfileHeader';
import PersonalityQuiz from './components/PersonalityQuiz';
import AchievementShowcase from './components/AchievementShowcase';
import SettingsSection from './components/SettingsSection';
import GroupHistory from './components/GroupHistory';
import CommitmentWall from './components/CommitmentWall';

const UserProfileSettings = () => {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    age: 28,
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    activeGoals: 3,
    groupsJoined: 5,
    currentStreak: 12
  });

  const [quizResults, setQuizResults] = useState({
    type: 'achiever',
    completedDate: 'March 10, 2024',
    traits: [
      { name: 'Goal-Oriented', score: 92 },
      { name: 'Collaborative', score: 78 },
      { name: 'Consistent', score: 85 },
      { name: 'Supportive', score: 71 }
    ],
    matchingPreferences: ['Similar Goals', 'High Accountability', 'Regular Check-ins', 'Peer Support']
  });

  const [achievements, setAchievements] = useState({
    stats: {
      totalGoalsCompleted: 12,
      longestStreak: 45,
      totalPoints: 2840,
      helpfulFeedbacks: 67
    },
    badges: [
      { type: 'streak-master', name: 'Streak Master', earnedDate: 'Mar 15, 2024' },
      { type: 'goal-crusher', name: 'Goal Crusher', earnedDate: 'Feb 28, 2024' },
      { type: 'team-player', name: 'Team Player', earnedDate: 'Mar 5, 2024' },
      { type: 'early-bird', name: 'Early Bird', earnedDate: 'Mar 1, 2024' },
      { type: 'feedback-hero', name: 'Feedback Hero', earnedDate: 'Feb 20, 2024' }
    ],
    nextBadges: [
      { type: 'consistency-king', name: 'Consistency King', progress: 18, required: 30 },
      { type: 'milestone-maker', name: 'Milestone Maker', progress: 7, required: 10 },
      { type: 'challenge-champion', name: 'Challenge Champion', progress: 2, required: 5 }
    ]
  });

  const [settings, setSettings] = useState({
    privacy: {
      showInMatching: true,
      showBadges: true,
      showProgress: true,
      shareUsageData: false,
      locationMatching: true
    },
    notifications: {
      checkinReminders: true,
      goalDeadlines: true,
      newMembers: true,
      peerFeedback: true,
      challenges: true,
      meetupInvites: true,
      meetupReminders: true
    },
    account: {
      weeklyEmails: true,
      monthlyReports: false
    },
    preferences: {
      defaultFramework: 'smart',
      meetupRadius: 25,
      weekendMeetups: true,
      eveningMeetups: false,
      discordNotifications: true
    }
  });

  const [groupHistory, setGroupHistory] = useState([
    {
      name: "Fitness Warriors",
      description: "Daily workout accountability group focused on strength training and cardio",
      status: "active",
      memberCount: 6,
      duration: "90 days",
      goalCategory: "Fitness",
      dateRange: "Jan 15 - Apr 15, 2024",
      stats: {
        completionRate: 87,
        checkinStreak: 12,
        feedbackGiven: 23,
        pointsEarned: 450
      }
    },
    {
      name: "Career Climbers",
      description: "Professional development and skill building group",
      status: "completed",
      memberCount: 8,
      duration: "90 days",
      goalCategory: "Career",
      dateRange: "Oct 1 - Dec 31, 2023",
      stats: {
        completionRate: 94,
        checkinStreak: 28,
        feedbackGiven: 31,
        pointsEarned: 680
      }
    },
    {
      name: "Morning Routine Masters",
      description: "Building consistent morning habits for productivity",
      status: "completed",
      memberCount: 5,
      duration: "90 days",
      goalCategory: "Personal Development",
      dateRange: "Jul 1 - Sep 30, 2023",
      stats: {
        completionRate: 91,
        checkinStreak: 35,
        feedbackGiven: 28,
        pointsEarned: 590
      }
    },
    {
      name: "Financial Freedom Seekers",
      description: "Budgeting and saving goals accountability group",
      status: "left",
      memberCount: 7,
      duration: "45 days (left early)",
      goalCategory: "Financial",
      dateRange: "Apr 1 - May 15, 2023",
      stats: {
        completionRate: 62,
        checkinStreak: 8,
        feedbackGiven: 12,
        pointsEarned: 180
      }
    },
    {
      name: "Reading Challenge Group",
      description: "Monthly book reading and discussion group",
      status: "completed",
      memberCount: 10,
      duration: "90 days",
      goalCategory: "Personal Development",
      dateRange: "Jan 1 - Mar 31, 2023",
      stats: {
        completionRate: 88,
        checkinStreak: 22,
        feedbackGiven: 19,
        pointsEarned: 420
      }
    }
  ]);

  const [commitments, setCommitments] = useState([
    {
      id: 1,
      text: "I will complete my daily workout routine for the next 30 days, no matter what obstacles come my way.",
      date: "March 20, 2024",
      likes: 12,
      comments: 3,
      isPublic: true
    },
    {
      id: 2,
      text: "I commit to reading for at least 30 minutes every day to expand my knowledge and improve my focus.",
      date: "March 15, 2024",
      likes: 8,
      comments: 2,
      isPublic: true
    },
    {
      id: 3,
      text: "I will save $500 this month by cutting unnecessary expenses and cooking meals at home.",
      date: "March 1, 2024",
      likes: 15,
      comments: 5,
      isPublic: true
    }
  ]);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUser(prev => ({
      ...prev,
      avatar: newPhotoUrl
    }));
  };

  const handleRetakeQuiz = () => {
    // Simulate quiz retake
    alert('Personality quiz will open in a new window. This feature will redirect to the quiz interface.');
  };

  const handleSettingsUpdate = (newSettings) => {
    setSettings(newSettings);
  };

  const handleAddCommitment = (newCommitment) => {
    setCommitments(prev => [newCommitment, ...prev]);
  };

  useEffect(() => {
    document.title = 'Profile & Settings - Community Goals';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20 lg:pb-6 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button 
            onClick={() => window.location.href = '/dashboard-home'}
            className="hover:text-foreground transition-smooth"
          >
            Dashboard
          </button>
          <span>•</span>
          <span className="text-foreground">Profile & Settings</span>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader 
            user={user} 
            onPhotoUpdate={handlePhotoUpdate}
          />

          {/* Two Column Layout for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personality Quiz */}
              <PersonalityQuiz 
                quizResults={quizResults}
                onRetakeQuiz={handleRetakeQuiz}
              />

              {/* Achievement Showcase */}
              <AchievementShowcase achievements={achievements} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Group History */}
              <GroupHistory groupHistory={groupHistory} />

              {/* Commitment Wall */}
              <CommitmentWall 
                commitments={commitments}
                onAddCommitment={handleAddCommitment}
              />
            </div>
          </div>

          {/* Full Width Settings Section */}
          <SettingsSection 
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default UserProfileSettings;