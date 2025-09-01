import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import GroupHeader from './components/GroupHeader';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import CheckinsTab from './components/CheckinsTab';
import ChallengesTab from './components/ChallengesTab';
import MeetupsTab from './components/MeetupsTab';
import GroupLeaderboard from './components/GroupLeaderboard';

const GroupDashboardCommunication = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock group data
  const groupData = {
    id: 1,
    name: "Fitness Warriors",
    memberCount: 7,
    season: 3,
    progress: 68,
    currentLeader: "Alex Johnson",
    stats: {
      totalCheckins: 142,
      avgStreak: 12,
      completedGoals: 8,
      daysLeft: 23
    }
  };

  // Mock members data
  const membersData = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isLeader: true,
      streak: 15,
      points: 1250,
      checkins: 28,
      badges: [
        { name: "Streak Master", emoji: "🔥" },
        { name: "Goal Crusher", emoji: "💪" },
        { name: "Helper", emoji: "🤝" }
      ]
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isLeader: false,
      streak: 12,
      points: 1180,
      checkins: 25,
      badges: [
        { name: "Consistent", emoji: "⭐" },
        { name: "Motivator", emoji: "🎯" }
      ]
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isLeader: false,
      streak: 8,
      points: 980,
      checkins: 22,
      badges: [
        { name: "Early Bird", emoji: "🌅" }
      ]
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isLeader: false,
      streak: 10,
      points: 920,
      checkins: 20,
      badges: [
        { name: "Supporter", emoji: "💝" }
      ]
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      isLeader: false,
      streak: 6,
      points: 780,
      checkins: 18,
      badges: []
    },
    {
      id: 6,
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      isLeader: false,
      streak: 4,
      points: 650,
      checkins: 15,
      badges: [
        { name: "Newcomer", emoji: "🌟" }
      ]
    },
    {
      id: 7,
      name: "James Brown",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      isLeader: false,
      streak: 2,
      points: 420,
      checkins: 12,
      badges: []
    }
  ];

  // Mock recent activity data
  const recentActivityData = [
    {
      id: 1,
      userName: "Sarah Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      action: "completed their morning workout goal",
      timestamp: "2 hours ago",
      points: 50
    },
    {
      id: 2,
      userName: "Mike Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      action: "checked in with a progress photo",
      timestamp: "4 hours ago",
      points: 10
    },
    {
      id: 3,
      userName: "Emma Wilson",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      action: "gave encouraging feedback to David",
      timestamp: "6 hours ago",
      points: 5
    },
    {
      id: 4,
      userName: "Alex Johnson",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      action: "reached a 15-day streak milestone",
      timestamp: "8 hours ago",
      points: 25
    }
  ];

  // Mock check-ins data
  const checkinsData = [
    {
      id: 1,
      userName: "Alex Johnson",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Great morning workout! Hit all my targets today. Feeling stronger every day 💪",
      photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      mood: "excited",
      timestamp: "2 hours ago",
      goals: [
        { title: "30 min cardio", completed: true },
        { title: "Strength training", completed: true },
        { title: "Protein shake", completed: true }
      ],
      reactions: {
        "💪": 3,
        "🔥": 2,
        "👏": 1
      },
      comments: [
        {
          id: 1,
          userName: "Sarah Chen",
          userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          content: "Amazing consistency! Keep it up!"
        }
      ]
    },
    {
      id: 2,
      userName: "Sarah Chen",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Had a tough day but still managed to get my steps in. Sometimes showing up is enough!",
      photo: null,
      mood: "tired",
      timestamp: "5 hours ago",
      goals: [
        { title: "10k steps", completed: true },
        { title: "Yoga session", completed: false },
        { title: "Healthy lunch", completed: true }
      ],
      reactions: {
        "❤️": 4,
        "👏": 2
      },
      comments: [
        {
          id: 1,
          userName: "Mike Rodriguez",
          userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          content: "That\'s the spirit! Every step counts 👍"
        },
        {
          id: 2,
          userName: "Emma Wilson",
          userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          content: "You're doing great! Rest is important too 💝"
        }
      ]
    }
  ];

  // Mock challenges data
  const challengesData = [
    {
      id: 1,
      title: "7-Day Water Challenge",
      description: "Drink at least 8 glasses of water every day for a week",
      status: "active",
      duration: 7,
      participants: 5,
      points: 100,
      progress: 71,
      creatorName: "Sarah Chen",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      participantAvatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      ],
      userParticipating: true
    },
    {
      id: 2,
      title: "Weekend Hiking Adventure",
      description: "Complete a 5+ mile hike this weekend and share photos",
      status: "voting",
      duration: 3,
      participants: 0,
      points: 200,
      creatorName: "Mike Rodriguez",
      creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      votes: {
        yes: 3,
        no: 1
      },
      votesNeeded: 2
    }
  ];

  // Mock meetups data
  const meetupsData = [
    {
      id: 1,
      title: "Saturday Morning Group Run",
      description: "Let\'s meet for our weekly group run at the park!",
      date: "2025-01-04",
      time: "08:00",
      location: "Central Park - Main Entrance",
      type: "in-person",
      status: "upcoming",
      coordinates: {
        lat: 40.7829,
        lng: -73.9654
      },
      attendees: {
        going: [
          { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
          { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
          { name: "Mike Rodriguez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" }
        ],
        maybe: [
          { name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
        ],
        notGoing: []
      },
      userRSVP: "going"
    },
    {
      id: 2,
      title: "Virtual Goal Planning Session",
      description: "Let\'s discuss our goals for next month and share strategies",
      date: "2025-01-06",
      time: "19:00",
      location: null,
      type: "virtual",
      status: "upcoming",
      attendees: {
        going: [
          { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
          { name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
          { name: "Lisa Thompson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" }
        ],
        maybe: [],
        notGoing: []
      },
      userRSVP: "maybe"
    }
  ];

  // Event handlers
  const handleReaction = (checkinId, emoji) => {
    console.log(`Added reaction ${emoji} to check-in ${checkinId}`);
  };

  const handleComment = (checkinId, comment) => {
    console.log(`Added comment "${comment}" to check-in ${checkinId}`);
  };

  const handleVote = (challengeId, vote) => {
    console.log(`Voted ${vote} on challenge ${challengeId}`);
  };

  const handleCreateChallenge = (challenge) => {
    console.log('Created new challenge:', challenge);
  };

  const handleRSVP = (meetupId, response) => {
    console.log(`RSVP ${response} for meetup ${meetupId}`);
  };

  const handleCreateMeetup = (meetup) => {
    console.log('Created new meetup:', meetup);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            group={groupData}
            members={membersData}
            recentActivity={recentActivityData}
          />
        );
      case 'checkins':
        return (
          <CheckinsTab
            checkins={checkinsData}
            onReaction={handleReaction}
            onComment={handleComment}
          />
        );
      case 'challenges':
        return (
          <ChallengesTab
            challenges={challengesData}
            onVote={handleVote}
            onCreateChallenge={handleCreateChallenge}
          />
        );
      case 'meetups':
        return (
          <MeetupsTab
            meetups={meetupsData}
            onRSVP={handleRSVP}
            onCreateMeetup={handleCreateMeetup}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pb-16 lg:pb-0">
        <GroupHeader group={groupData} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="lg:flex lg:gap-6 lg:p-6">
          {/* Main Content */}
          <div className="lg:flex-1">
            <div className="p-4 lg:p-0">
              {renderTabContent()}
            </div>
          </div>
          
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:w-80">
            <GroupLeaderboard members={membersData} />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default GroupDashboardCommunication;