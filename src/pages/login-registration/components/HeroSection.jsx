import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const features = [
    {
      icon: "Target",
      title: "Set Structured Goals",
      description: "SMART goals, OKRs, and habit tracking frameworks"
    },
    {
      icon: "Users",
      title: "Join Accountability Groups",
      description: "Connect with 3-10 like-minded individuals"
    },
    {
      icon: "Calendar",
      title: "Daily Check-ins",
      description: "Track progress with photos and mood updates"
    },
    {
      icon: "Trophy",
      title: "Gamified Progress",
      description: "Earn points, badges, and celebrate milestones"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
          alt="Community of people achieving goals together"
          className="w-full h-64 lg:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">
            Achieve Your Goals Together
          </h2>
          <p className="text-white/90 text-sm lg:text-base">
            Join thousands who've transformed their lives through community accountability
          </p>
        </div>
      </div>
      {/* Key Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={feature?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground text-sm mb-1">
                {feature?.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Success Metrics */}
      <div className="bg-primary/5 rounded-lg p-6 text-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">89%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">90</div>
            <div className="text-xs text-muted-foreground">Day Seasons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-xs text-muted-foreground">Community</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;