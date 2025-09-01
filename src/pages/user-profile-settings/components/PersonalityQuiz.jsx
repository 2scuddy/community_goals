import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PersonalityQuiz = ({ quizResults, onRetakeQuiz }) => {
  const personalityTypes = {
    'achiever': {
      title: 'The Achiever',
      description: 'Goal-oriented and results-driven. You thrive on completing tasks and reaching milestones.',
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'Trophy'
    },
    'collaborator': {
      title: 'The Collaborator',
      description: 'Team-focused and supportive. You excel in group settings and helping others succeed.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      icon: 'Users'
    },
    'innovator': {
      title: 'The Innovator',
      description: 'Creative and forward-thinking. You enjoy exploring new approaches and solutions.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      icon: 'Lightbulb'
    },
    'strategist': {
      title: 'The Strategist',
      description: 'Analytical and methodical. You prefer structured approaches and long-term planning.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      icon: 'Brain'
    }
  };

  const currentType = personalityTypes?.[quizResults?.type] || personalityTypes?.['achiever'];

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Personality Profile
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
          onClick={onRetakeQuiz}
        >
          Retake Quiz
        </Button>
      </div>
      {quizResults ? (
        <div className="space-y-4">
          {/* Personality Type */}
          <div className={`${currentType?.bgColor} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${currentType?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={currentType?.icon} size={20} className={currentType?.color} />
              </div>
              <div>
                <h3 className={`font-heading font-semibold ${currentType?.color}`}>
                  {currentType?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Completed on {quizResults?.completedDate}
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/80">
              {currentType?.description}
            </p>
          </div>

          {/* Traits */}
          <div className="grid grid-cols-2 gap-3">
            {quizResults?.traits?.map((trait, index) => (
              <div key={index} className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {trait?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trait?.score}%
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trait?.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Matching Preferences */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Icon name="Users" size={16} />
              Group Matching Preferences
            </h4>
            <div className="flex flex-wrap gap-2">
              {quizResults?.matchingPreferences?.map((pref, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Brain" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading font-medium text-foreground mb-2">
            Take Your Personality Quiz
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Help us match you with compatible group members based on your personality and goals.
          </p>
          <Button
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
            onClick={onRetakeQuiz}
          >
            Start Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalityQuiz;