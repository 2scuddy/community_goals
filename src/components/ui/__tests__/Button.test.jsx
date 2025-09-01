import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

// Mock the AppIcon component
jest.mock('../../AppIcon', () => {
  return function MockIcon({ name, size, className, ...props }) {
    return (
      <span 
        data-testid={`icon-${name}`} 
        data-size={size}
        className={className}
        {...props}
      >
        {name}
      </span>
    );
  };
});

// Mock class-variance-authority
jest.mock('class-variance-authority', () => ({
  cva: (base, config) => (props) => {
    let classes = base;
    if (config?.variants && props) {
      Object.keys(props).forEach(key => {
        if (config.variants[key] && config.variants[key][props[key]]) {
          classes += ` ${config.variants[key][props[key]]}`;
        }
      });
    }
    return classes;
  }
}));

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).not.toBeDisabled();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'warning', 'danger'];
    
    variants.forEach(variant => {
      const { rerender } = render(<Button variant={variant}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render different sizes', () => {
    const sizes = ['xs', 'sm', 'default', 'lg', 'xl', 'icon'];
    
    sizes.forEach(size => {
      const { rerender } = render(<Button size={size}>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render with custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should render as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render loading state', () => {
    render(<Button loading>Loading Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Check for loading spinner
    const spinner = button.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with left icon', () => {
    render(<Button iconName="Home">Button with Icon</Button>);
    
    const icon = screen.getByTestId('icon-Home');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-size', '16');
  });

  it('should render with right icon', () => {
    render(<Button iconName="Arrow" iconPosition="right">Button with Icon</Button>);
    
    const icon = screen.getByTestId('icon-Arrow');
    expect(icon).toBeInTheDocument();
  });

  it('should render with custom icon size', () => {
    render(<Button iconName="Home" iconSize={24}>Button</Button>);
    
    const icon = screen.getByTestId('icon-Home');
    expect(icon).toHaveAttribute('data-size', '24');
  });

  it('should render full width', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('should handle icon size mapping based on button size', () => {
    const sizeIconMap = {
      xs: '12',
      sm: '14',
      default: '16',
      lg: '18',
      xl: '20',
      icon: '16'
    };

    Object.entries(sizeIconMap).forEach(([size, expectedIconSize]) => {
      const { rerender } = render(
        <Button size={size} iconName="Test">
          {size !== 'icon' ? 'Button' : ''}
        </Button>
      );
      
      const icon = screen.getByTestId('icon-Test');
      expect(icon).toHaveAttribute('data-size', expectedIconSize);
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render without icon when iconName is null', () => {
    render(<Button iconName={null}>Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Button');
    expect(button.querySelector('[data-testid^="icon-"]')).not.toBeInTheDocument();
  });

  it('should handle icon rendering errors gracefully', () => {
    // Mock Icon to throw an error
    const OriginalIcon = require('../../AppIcon').default;
    require('../../AppIcon').default = () => {
      throw new Error('Icon error');
    };

    expect(() => {
      render(<Button iconName="ErrorIcon">Button</Button>);
    }).not.toThrow();

    // Restore original Icon
    require('../../AppIcon').default = OriginalIcon;
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Link Button');
  });

  it('should handle asChild with icon', () => {
    render(
      <Button asChild iconName="Home">
        <a href="/home">Home Link</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    const icon = screen.getByTestId('icon-Home');
    
    expect(link).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('should fallback to regular button when asChild has invalid children', () => {
    render(
      <Button asChild>
        <span>Invalid</span>
        <span>Multiple children</span>
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle keyboard events', async () => {
    const handleKeyDown = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onKeyDown={handleKeyDown}>Button</Button>);
    
    const button = screen.getByRole('button');
    await user.type(button, '{enter}');
    
    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef();
    
    render(<Button ref={ref}>Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button loading onClick={handleClick}>Loading Button</Button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render loading spinner with correct classes', () => {
    render(<Button loading>Loading</Button>);
    
    const spinner = screen.getByRole('button').querySelector('svg.animate-spin');
    expect(spinner).toHaveClass('animate-spin', '-ml-1', 'mr-2', 'h-4', 'w-4');
  });

  it('should handle complex asChild scenarios', () => {
    render(
      <Button asChild variant="outline" size="lg" iconName="External" iconPosition="right">
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          External Link
        </a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    const icon = screen.getByTestId('icon-External');
    
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(icon).toBeInTheDocument();
  });

  it('should maintain displayName', () => {
    expect(Button.displayName).toBe('Button');
  });
});