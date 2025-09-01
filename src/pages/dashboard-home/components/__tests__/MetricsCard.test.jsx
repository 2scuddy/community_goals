import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricsCard from '../MetricsCard';

// Mock the AppIcon component
jest.mock('../../../../components/AppIcon', () => {
  return function MockIcon({ name, size, ...props }) {
    return (
      <span 
        data-testid={`icon-${name}`} 
        data-size={size}
        {...props}
      >
        {name}
      </span>
    );
  };
});

describe('MetricsCard', () => {
  const defaultProps = {
    title: 'Total Goals',
    value: '42',
    icon: 'Target',
  };

  it('should render with required props', () => {
    render(<MetricsCard {...defaultProps} />);
    
    expect(screen.getByText('Total Goals')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Target')).toBeInTheDocument();
  });

  it('should render with subtitle', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        subtitle="This month"
      />
    );
    
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('should render without subtitle', () => {
    render(<MetricsCard {...defaultProps} />);
    
    expect(screen.queryByText('This month')).not.toBeInTheDocument();
  });

  it('should render with positive trend', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        trend={15}
      />
    );
    
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-TrendingUp')).toBeInTheDocument();
  });

  it('should render with negative trend', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        trend={-8}
      />
    );
    
    expect(screen.getByText('8%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-TrendingDown')).toBeInTheDocument();
  });

  it('should render without trend when not provided', () => {
    render(<MetricsCard {...defaultProps} />);
    
    expect(screen.queryByTestId('icon-TrendingUp')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-TrendingDown')).not.toBeInTheDocument();
  });

  it('should render with different color variants', () => {
    const colors = ['primary', 'success', 'warning', 'accent'];
    
    colors.forEach(color => {
      const { rerender } = render(
        <MetricsCard 
          {...defaultProps} 
          color={color}
        />
      );
      
      const iconContainer = screen.getByTestId('icon-Target').parentElement;
      expect(iconContainer).toHaveClass(`text-${color}`);
      expect(iconContainer).toHaveClass(`bg-${color}/10`);
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should use primary color as default', () => {
    render(<MetricsCard {...defaultProps} />);
    
    const iconContainer = screen.getByTestId('icon-Target').parentElement;
    expect(iconContainer).toHaveClass('text-primary');
    expect(iconContainer).toHaveClass('bg-primary/10');
  });

  it('should render icon with correct size', () => {
    render(<MetricsCard {...defaultProps} />);
    
    const icon = screen.getByTestId('icon-Target');
    expect(icon).toHaveAttribute('data-size', '20');
  });

  it('should render trend icons with correct size', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        trend={10}
      />
    );
    
    const trendIcon = screen.getByTestId('icon-TrendingUp');
    expect(trendIcon).toHaveAttribute('data-size', '12');
  });

  it('should apply correct styling classes', () => {
    render(<MetricsCard {...defaultProps} />);
    
    const card = screen.getByText('Total Goals').closest('div').closest('div');
    expect(card).toHaveClass('bg-card', 'rounded-lg', 'p-4', 'border', 'border-border', 'shadow-warm');
  });

  it('should render value with correct styling', () => {
    render(<MetricsCard {...defaultProps} />);
    
    const value = screen.getByText('42');
    expect(value).toHaveClass('text-2xl', 'font-bold', 'text-foreground');
  });

  it('should render title with correct styling', () => {
    render(<MetricsCard {...defaultProps} />);
    
    const title = screen.getByText('Total Goals');
    expect(title).toHaveClass('text-xs', 'text-muted-foreground', 'font-medium');
  });

  it('should render subtitle with correct styling when provided', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        subtitle="Last 30 days"
      />
    );
    
    const subtitle = screen.getByText('Last 30 days');
    expect(subtitle).toHaveClass('text-xs', 'text-muted-foreground');
  });

  it('should handle zero trend correctly', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        trend={0}
      />
    );
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-TrendingDown')).toBeInTheDocument();
  });

  it('should handle large trend values', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        trend={150}
      />
    );
    
    expect(screen.getByText('150%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-TrendingUp')).toBeInTheDocument();
  });

  it('should handle different icon names', () => {
    const icons = ['Home', 'User', 'Settings', 'Star'];
    
    icons.forEach(iconName => {
      const { rerender } = render(
        <MetricsCard 
          {...defaultProps} 
          icon={iconName}
        />
      );
      
      expect(screen.getByTestId(`icon-${iconName}`)).toBeInTheDocument();
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render with all props combined', () => {
    render(
      <MetricsCard 
        title="Active Users"
        value="1,234"
        subtitle="Online now"
        icon="Users"
        trend={25}
        color="success"
      />
    );
    
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('Online now')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Users')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-TrendingUp')).toBeInTheDocument();
    
    const iconContainer = screen.getByTestId('icon-Users').parentElement;
    expect(iconContainer).toHaveClass('text-success', 'bg-success/10');
  });

  it('should handle undefined color gracefully', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        color={undefined}
      />
    );
    
    const iconContainer = screen.getByTestId('icon-Target').parentElement;
    expect(iconContainer).toHaveClass('text-primary', 'bg-primary/10');
  });

  it('should handle invalid color gracefully', () => {
    render(
      <MetricsCard 
        {...defaultProps} 
        color="invalid-color"
      />
    );
    
    const iconContainer = screen.getByTestId('icon-Target').parentElement;
    // Should not crash and should handle gracefully
    expect(iconContainer).toBeInTheDocument();
  });
});