import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SeasonCountdown = ({ endDate, currentSeason }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-border p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon name="Clock" size={20} color="var(--color-primary)" />
        <h3 className="text-base font-heading font-semibold text-foreground">
          Season {currentSeason} Ends In
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">
            {timeLeft?.days}
          </div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">
            {timeLeft?.hours}
          </div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">
            {timeLeft?.minutes}
          </div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">
            {timeLeft?.seconds}
          </div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Groups will be locked for the next 90-day season after this countdown ends
      </p>
    </div>
  );
};

export default SeasonCountdown;