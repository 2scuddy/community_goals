import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import CategoryCard from './components/CategoryCard';
import GoalCreationModal from './components/GoalCreationModal';
import GoalEditModal from './components/GoalEditModal';
import FilterSortBar from './components/FilterSortBar';
import QuickStatsCard from './components/QuickStatsCard';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const GoalCreationManagement = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
    status: 'all',
    priority: 'all',
    framework: 'all',
    category: 'all'
  });
  const [currentSort, setCurrentSort] = useState('created');

  // Mock data for goals
  const mockGoals = [
    {
      id: 1,
      category: 'Fitness/Health',
      title: 'Lose 15 pounds by summer',
      description: 'Get in shape for summer vacation by following a structured diet and exercise plan',
      framework: 'smart',
      targetMetric: 'Weight',
      targetValue: '155 lbs',
      priority: 'high',
      status: 'active',
      progress: 65,
      streak: 12,
      createdDate: '12/15/2024',
      deadline: '2025-06-01',
      daysRemaining: 154,
      isSharedToWall: true,
      dailyTasks: [
        { id: 1, text: '30 minutes cardio', completed: true },
        { id: 2, text: 'Track calories', completed: true },
        { id: 3, text: 'Drink 8 glasses water', completed: false },
        { id: 4, text: '10k steps', completed: true },
        { id: 5, text: 'No late night snacks', completed: false }
      ],
      weeklyMilestones: ['Lose 1-2 lbs per week', 'Complete 5 workout sessions', 'Meal prep on Sundays']
    },
    {
      id: 2,
      category: 'Business/Career',
      title: 'Launch side business',
      description: 'Start an online consulting business to generate additional income',
      framework: 'okr',
      targetMetric: 'Revenue',
      targetValue: '$5,000/month',
      priority: 'high',
      status: 'active',
      progress: 35,
      streak: 8,
      createdDate: '01/02/2025',
      deadline: '2025-07-01',
      daysRemaining: 123,
      isSharedToWall: false,
      dailyTasks: [
        { id: 1, text: 'Work on business plan', completed: true },
        { id: 2, text: 'Research competitors', completed: false },
        { id: 3, text: 'Network with potential clients', completed: true }
      ],
      weeklyMilestones: ['Complete business registration', 'Build website', 'Get first client']
    },
    {
      id: 3,
      category: 'Personal Development',
      title: 'Read 24 books this year',
      description: 'Expand knowledge and improve focus through consistent reading habit',
      framework: 'atomic',
      targetMetric: 'Books',
      targetValue: '24 books',
      priority: 'medium',
      status: 'active',
      progress: 25,
      streak: 45,
      createdDate: '01/01/2025',
      deadline: '2025-12-31',
      daysRemaining: 306,
      isSharedToWall: true,
      dailyTasks: [
        { id: 1, text: 'Read for 30 minutes', completed: true },
        { id: 2, text: 'Take reading notes', completed: true }
      ],
      weeklyMilestones: ['Finish 2 books per month', 'Write book summaries', 'Join book club discussions']
    },
    {
      id: 4,
      category: 'Financial',
      title: 'Save $10,000 emergency fund',
      description: 'Build a solid financial foundation with 6 months of expenses saved',
      framework: 'milestone',
      targetMetric: 'Savings',
      targetValue: '$10,000',
      priority: 'high',
      status: 'active',
      progress: 80,
      streak: 30,
      createdDate: '10/01/2024',
      deadline: '2025-04-01',
      daysRemaining: 61,
      isSharedToWall: false,
      dailyTasks: [
        { id: 1, text: 'Track all expenses', completed: true },
        { id: 2, text: 'Transfer $50 to savings', completed: true },
        { id: 3, text: 'Review budget', completed: false }
      ],
      weeklyMilestones: ['Save $400 per week', 'Review and optimize expenses', 'Find additional income sources']
    },
    {
      id: 5,
      category: 'Relationships',
      title: 'Strengthen family connections',
      description: 'Spend more quality time with family and improve communication',
      framework: 'process',
      targetMetric: 'Quality Time',
      targetValue: '10 hours/week',
      priority: 'medium',
      status: 'active',
      progress: 50,
      streak: 15,
      createdDate: '01/15/2025',
      deadline: '2025-12-31',
      daysRemaining: 306,
      isSharedToWall: true,
      dailyTasks: [
        { id: 1, text: 'Call parents', completed: false },
        { id: 2, text: 'Plan family activity', completed: true }
      ],
      weeklyMilestones: ['Weekly family dinner', 'Plan monthly family outing', 'Have meaningful conversations']
    }
  ];

  const categories = [
    { name: 'Fitness/Health', description: 'Physical health, fitness, and wellness goals' },
    { name: 'Business/Career', description: 'Professional development and career advancement' },
    { name: 'Relationships', description: 'Personal relationships and social connections' },
    { name: 'Personal Development', description: 'Learning, skills, and personal growth' },
    { name: 'Financial', description: 'Money management, savings, and investments' }
  ];

  useEffect(() => {
    setGoals(mockGoals);
    setFilteredGoals(mockGoals);
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [goals, currentFilters, currentSort]);

  const applyFiltersAndSort = () => {
    let filtered = [...goals];

    // Apply filters
    if (currentFilters?.status !== 'all') {
      filtered = filtered?.filter(goal => goal?.status === currentFilters?.status);
    }
    if (currentFilters?.priority !== 'all') {
      filtered = filtered?.filter(goal => goal?.priority === currentFilters?.priority);
    }
    if (currentFilters?.framework !== 'all') {
      filtered = filtered?.filter(goal => goal?.framework === currentFilters?.framework);
    }
    if (currentFilters?.category !== 'all') {
      filtered = filtered?.filter(goal => goal?.category === currentFilters?.category);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (currentSort) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'progress':
          return b?.progress - a?.progress;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
        case 'streak':
          return b?.streak - a?.streak;
        case 'alphabetical':
          return a?.title?.localeCompare(b?.title);
        case 'created':
        default:
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

    setFilteredGoals(filtered);
  };

  const handleCreateGoal = (category) => {
    setSelectedCategory(category);
    setIsCreateModalOpen(true);
  };

  const handleGoalCreated = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleGoalUpdated = (updatedGoal) => {
    setGoals(prev => prev?.map(goal => goal?.id === updatedGoal?.id ? updatedGoal : goal));
  };

  const handleArchiveGoal = (goalToArchive) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === goalToArchive?.id 
        ? { ...goal, status: 'archived' }
        : goal
    ));
  };

  const handleShareGoal = (goalToShare) => {
    setGoals(prev => prev?.map(goal => 
      goal?.id === goalToShare?.id 
        ? { ...goal, isSharedToWall: !goal?.isSharedToWall }
        : goal
    ));
  };

  const getGoalsByCategory = (categoryName) => {
    return filteredGoals?.filter(goal => goal?.category === categoryName);
  };

  const activeGoals = goals?.filter(goal => goal?.status === 'active')?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Goal Management</h1>
            <p className="text-muted-foreground">Create, track, and achieve your goals across all life areas</p>
          </div>
          <Button
            variant="default"
            onClick={() => setIsCreateModalOpen(true)}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            className="hidden sm:flex"
          >
            Create Goal
          </Button>
        </div>

        {/* Quick Stats */}
        <QuickStatsCard goals={goals} />

        {/* Filter and Sort Bar */}
        <FilterSortBar
          onFilterChange={setCurrentFilters}
          onSortChange={setCurrentSort}
          totalGoals={goals?.length}
          activeGoals={activeGoals}
        />

        {/* Categories */}
        <div className="space-y-6">
          {categories?.map((category) => (
            <CategoryCard
              key={category?.name}
              category={category}
              goals={getGoalsByCategory(category?.name)}
              onCreateGoal={handleCreateGoal}
              onEditGoal={handleEditGoal}
              onArchiveGoal={handleArchiveGoal}
              onShareGoal={handleShareGoal}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredGoals?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Target" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-heading font-medium text-foreground mb-2">No goals found</h3>
            <p className="text-muted-foreground mb-6">
              {goals?.length === 0 
                ? "Start your journey by creating your first goal" :"Try adjusting your filters to see more goals"
              }
            </p>
            <Button
              variant="default"
              onClick={() => setIsCreateModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Create Your First Goal
            </Button>
          </div>
        )}

        {/* Floating Action Button - Mobile */}
        <div className="fixed bottom-20 right-4 z-40 sm:hidden">
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsCreateModalOpen(true)}
            iconName="Plus"
            iconSize={20}
            className="w-14 h-14 rounded-full shadow-warm-lg"
          />
        </div>
      </main>
      {/* Modals */}
      <GoalCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedCategory('');
        }}
        selectedCategory={selectedCategory}
        onCreateGoal={handleGoalCreated}
      />
      <GoalEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onUpdateGoal={handleGoalUpdated}
      />
      <BottomNavigation />
    </div>
  );
};

export default GoalCreationManagement;