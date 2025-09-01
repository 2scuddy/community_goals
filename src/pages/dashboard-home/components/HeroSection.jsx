import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ 
  currentStreak = 0, 
  hasCheckedInToday = false, 
  onQuickCheckIn,
  userName = 'there'
}) => {
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (hasCheckedInToday) {
      return "Great job staying on track today! Keep the momentum going.";
    }
    
    if (currentStreak === 0) {
      return "Ready to start your journey? Your first check-in is just a click away!";
    }
    
    if (currentStreak < 7) {
      return `You are building something great! ${currentStreak} days and counting.`;
    }
    
    if (currentStreak < 30) {
      return `Incredible consistency! Your ${currentStreak}-day streak is inspiring.`;
    }
    
    return `You are absolutely crushing it! ${currentStreak} days of dedication - you are unstoppable!`;
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl p-6 lg:p-8 border border-border/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left Content */}
        <div className="flex-1">
          <div className="space-y-4">
            {/* Greeting */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {getGreeting()}, {userName?.split(' ')?.[0] || 'there'}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                {getMotivationalMessage()}
              </p>
            </div>

            {/* Streak Display */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Icon name="Flame" size={24} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day streak</div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                hasCheckedInToday 
                  ? 'bg-success/10 text-success border border-success/20' :'bg-warning/10 text-warning border border-warning/20'
              }`}>
                {hasCheckedInToday ? '✓ Checked in today' : 'Check-in pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex-shrink-0">
          {!hasCheckedInToday ? (
            <Button
              onClick={onQuickCheckIn}
              className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Icon name="CheckCircle" size={20} className="mr-2" />
              Quick Check-in
            </Button>
          ) : (
            <div className="flex items-center space-x-3 text-success">
              <Icon name="CheckCircle2" size={24} />
              <div className="text-sm font-medium">All set for today!</div>
            </div>
          )}
        </div>

      </div>
      {/* Progress Bar - Optional visual element */}
      {currentStreak > 0 && (
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Progress to next milestone</span>
            <span className="text-xs font-medium text-muted-foreground">
              {currentStreak % 7}/7 days
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStreak % 7) / 7) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;