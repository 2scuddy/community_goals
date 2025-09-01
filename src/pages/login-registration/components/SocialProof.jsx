import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const SocialProof = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Toronto, Canada",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      quote: "Found my accountability group and lost 30 pounds in 90 days. The daily check-ins kept me motivated!",
      achievement: "Fitness Goal Completed"
    },
    {
      id: 2,
      name: "Marcus Thompson",
      location: "Austin, TX",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      quote: "Launched my side business with support from my group. The peer coaching was invaluable.",
      achievement: "Business Goal Achieved"
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "London, UK",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote: "Built a 6-month emergency fund through consistent daily habits. My group celebrated every milestone!",
      achievement: "Financial Goal Reached"
    }
  ];

  const stats = [
    { label: "Active Members", value: "12,500+", icon: "Users" },
    { label: "Goals Completed", value: "8,200+", icon: "Target" },
    { label: "Success Rate", value: "89%", icon: "TrendingUp" },
    { label: "Countries", value: "15+", icon: "Globe" }
  ];

  return (
    <div className="space-y-8">
      {/* Community Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat) => (
          <div key={stat?.label} className="text-center p-4 bg-card rounded-lg border border-border">
            <div className="flex justify-center mb-2">
              <Icon name={stat?.icon} size={24} color="var(--color-primary)" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
            <div className="text-sm text-muted-foreground">{stat?.label}</div>
          </div>
        ))}
      </div>
      {/* Success Stories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground text-center">
          Success Stories from Our Community
        </h3>
        
        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground text-sm">{testimonial?.name}</h4>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{testimonial?.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Icon name="Award" size={14} color="var(--color-success)" />
                    <span className="text-xs text-success font-medium">{testimonial?.achievement}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial?.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="text-center space-y-2">
        <div className="flex justify-center items-center space-x-1">
          {[1, 2, 3, 4, 5]?.map((star) => (
            <Icon key={star} name="Star" size={16} color="var(--color-warning)" className="fill-current" />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">4.8/5 from 2,400+ reviews</span>
        </div>
        
        <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={14} color="var(--color-success)" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} color="var(--color-primary)" />
            <span>Real Community</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={14} color="var(--color-accent)" />
            <span>Proven Results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;