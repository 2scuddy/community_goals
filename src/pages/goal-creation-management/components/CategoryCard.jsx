import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryCard = ({ category, goals, onCreateGoal, onEditGoal, onArchiveGoal, onShareGoal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case 'Fitness/Health':
        return 'Heart';
      case 'Business/Career':
        return 'Briefcase';
      case 'Relationships':
        return 'Users';
      case 'Personal Development':
        return 'Brain';
      case 'Financial':
        return 'DollarSign';
      default:
        return 'Target';
    }
  };

  const getCategoryColor = (categoryName) => {
    switch (categoryName) {
      case 'Fitness/Health':
        return 'text-red-600 bg-red-50';
      case 'Business/Career':
        return 'text-blue-600 bg-blue-50';
      case 'Relationships':
        return 'text-purple-600 bg-purple-50';
      case 'Personal Development':
        return 'text-green-600 bg-green-50';
      case 'Financial':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const activeGoals = goals?.filter(goal => goal?.status === 'active');
  const completedGoals = goals?.filter(goal => goal?.status === 'completed');

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(category?.name)}`}>
              <Icon name={getCategoryIcon(category?.name)} size={20} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">{category?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {activeGoals?.length} active • {completedGoals?.length} completed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onCreateGoal(category?.name);
              }}
              iconName="Plus"
              iconSize={16}
            >
              Add Goal
            </Button>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              color="var(--color-muted-foreground)" 
            />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {activeGoals?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Target" size={32} className="mx-auto mb-2 opacity-50" />
              <p>No active goals in this category</p>
              <p className="text-sm">Create your first goal to get started</p>
            </div>
          ) : (
            activeGoals?.map((goal) => (
              <div key={goal?.id} className="bg-muted rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{goal?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{goal?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Framework: {goal?.framework}</span>
                      <span>•</span>
                      <span>Created: {goal?.createdDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditGoal(goal)}
                      iconName="Edit2"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShareGoal(goal)}
                      iconName="Share2"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onArchiveGoal(goal)}
                      iconName="Archive"
                      iconSize={14}
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">Progress</span>
                    <span className="text-xs text-muted-foreground">{goal?.progress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal?.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Streak and Metrics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Flame" size={14} color="var(--color-accent)" />
                      <span className="text-xs font-medium text-foreground">{goal?.streak} day streak</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} color="var(--color-muted-foreground)" />
                      <span className="text-xs text-muted-foreground">{goal?.daysRemaining} days left</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {goal?.isSharedToWall && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Eye" size={12} color="var(--color-success)" />
                        <span className="text-xs text-success">Public</span>
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal?.priority === 'high' ? 'bg-red-100 text-red-700' :
                      goal?.priority === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {goal?.priority}
                    </div>
                  </div>
                </div>

                {/* Daily Tasks Preview */}
                {goal?.dailyTasks && goal?.dailyTasks?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">Today's Tasks</span>
                      <span className="text-xs text-muted-foreground">
                        {goal?.dailyTasks?.filter(task => task?.completed)?.length}/{goal?.dailyTasks?.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {goal?.dailyTasks?.slice(0, 5)?.map((task, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            task?.completed 
                              ? 'bg-primary border-primary' :'bg-background border-border'
                          }`}
                        >
                          {task?.completed && (
                            <Icon name="Check" size={12} color="white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryCard;