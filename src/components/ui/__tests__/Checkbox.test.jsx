import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox, CheckboxGroup } from '../Checkbox';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: ({ className, ...props }) => (
    <span data-testid="check-icon" className={className} {...props}>✓</span>
  ),
  Minus: ({ className, ...props }) => (
    <span data-testid="minus-icon" className={className} {...props}>−</span>
  ),
}));

describe('Checkbox', () => {
  it('should render basic checkbox', () => {
    render(<Checkbox />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox', () => {
    render(<Checkbox checked />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should render indeterminate checkbox', () => {
    render(<Checkbox indeterminate />);
    
    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Checkbox label="Accept terms" />);
    
    const labels = screen.getAllByText('Accept terms');
    expect(labels).toHaveLength(2); // One for checkbox, one for text
    
    const checkbox = screen.getByRole('checkbox');
    expect(labels[0]).toHaveAttribute('for', checkbox.id);
  });

  it('should render required indicator', () => {
    render(<Checkbox label="Required field" required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-destructive', 'ml-1');
  });

  it('should render with description', () => {
    render(<Checkbox label="Newsletter" description="Receive weekly updates" />);
    
    expect(screen.getByText('Receive weekly updates')).toBeInTheDocument();
    expect(screen.getByText('Receive weekly updates')).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('should render with error message', () => {
    render(<Checkbox label="Terms" error="You must accept the terms" />);
    
    const errorMessage = screen.getByText('You must accept the terms');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-sm', 'text-destructive');
  });

  it('should hide description when error is present', () => {
    render(
      <Checkbox 
        label="Terms" 
        description="Please read carefully" 
        error="Required field" 
      />
    );
    
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('Please read carefully')).not.toBeInTheDocument();
  });

  it('should apply error styling', () => {
    render(<Checkbox error="Error message" />);
    
    const checkboxLabel = screen.getByRole('checkbox').nextElementSibling;
    expect(checkboxLabel).toHaveClass('border-destructive');
  });

  it('should render different sizes', () => {
    const sizes = ['sm', 'default', 'lg'];
    
    sizes.forEach(size => {
      const { rerender } = render(<Checkbox size={size} data-testid={`checkbox-${size}`} />);
      
      const checkboxLabel = screen.getByTestId(`checkbox-${size}`).nextElementSibling;
      
      if (size === 'lg') {
        expect(checkboxLabel).toHaveClass('h-5', 'w-5');
      } else {
        expect(checkboxLabel).toHaveClass('h-4', 'w-4');
      }
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    
    const checkboxLabel = checkbox.nextElementSibling;
    expect(checkboxLabel).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('should handle click events', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle label click', () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Click me" onChange={handleChange} />);
    
    const label = screen.getAllByText('Click me')[1]; // Get the text label
    fireEvent.click(label);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef();
    render(<Checkbox ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should generate unique ID when not provided', () => {
    render(
      <div>
        <Checkbox data-testid="checkbox1" />
        <Checkbox data-testid="checkbox2" />
      </div>
    );
    
    const checkbox1 = screen.getByTestId('checkbox1');
    const checkbox2 = screen.getByTestId('checkbox2');
    
    expect(checkbox1.id).toBeTruthy();
    expect(checkbox2.id).toBeTruthy();
    expect(checkbox1.id).not.toBe(checkbox2.id);
  });

  it('should use provided ID', () => {
    render(<Checkbox id="custom-checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'custom-checkbox');
  });

  it('should apply custom className', () => {
    render(<Checkbox className="custom-class" />);
    
    const container = screen.getByRole('checkbox').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('should not show icons when unchecked and not indeterminate', () => {
    render(<Checkbox checked={false} indeterminate={false} />);
    
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('minus-icon')).not.toBeInTheDocument();
  });

  it('should prioritize indeterminate over checked', () => {
    render(<Checkbox checked indeterminate />);
    
    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('should render with all props combined', () => {
    render(
      <Checkbox 
        id="full-checkbox"
        checked
        required
        label="Full Example"
        description="This is a complete example"
        size="lg"
        className="custom-checkbox"
      />
    );
    
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'full-checkbox');
    expect(screen.getByText('Full Example')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('This is a complete example')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should maintain displayName', () => {
    expect(Checkbox.displayName).toBe('Checkbox');
  });
});

describe('CheckboxGroup', () => {
  it('should render basic checkbox group', () => {
    render(
      <CheckboxGroup>
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
      </CheckboxGroup>
    );
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(
      <CheckboxGroup label="Select options">
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    const legend = screen.getByText('Select options');
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe('LEGEND');
  });

  it('should render required indicator for group', () => {
    render(
      <CheckboxGroup label="Required Group" required>
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render with description', () => {
    render(
      <CheckboxGroup label="Options" description="Choose one or more">
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    expect(screen.getByText('Choose one or more')).toBeInTheDocument();
    expect(screen.getByText('Choose one or more')).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('should render with error message', () => {
    render(
      <CheckboxGroup label="Options" error="Please select at least one option">
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    const errorMessage = screen.getByText('Please select at least one option');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-sm', 'text-destructive');
  });

  it('should hide description when error is present', () => {
    render(
      <CheckboxGroup 
        label="Options" 
        description="Select options" 
        error="Error occurred" 
      >
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.queryByText('Select options')).not.toBeInTheDocument();
  });

  it('should apply error styling to legend', () => {
    render(
      <CheckboxGroup label="Options" error="Error message">
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    const legend = screen.getByText('Options');
    expect(legend).toHaveClass('text-destructive');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <CheckboxGroup disabled>
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeDisabled();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef();
    render(
      <CheckboxGroup ref={ref}>
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it('should apply custom className', () => {
    render(
      <CheckboxGroup className="custom-group">
        <Checkbox label="Option 1" />
      </CheckboxGroup>
    );
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toHaveClass('custom-group');
  });

  it('should render multiple checkboxes with proper spacing', () => {
    render(
      <CheckboxGroup label="Multiple Options">
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
        <Checkbox label="Option 3" />
      </CheckboxGroup>
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
    
    const container = checkboxes[0].closest('.space-y-2');
    expect(container).toBeInTheDocument();
  });

  it('should render with all props combined', () => {
    render(
      <CheckboxGroup 
        label="Complete Group"
        description="Select your preferences"
        required
        className="full-group"
      >
        <Checkbox label="Option 1" />
        <Checkbox label="Option 2" />
      </CheckboxGroup>
    );
    
    expect(screen.getByText('Complete Group')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Select your preferences')).toBeInTheDocument();
    expect(screen.getByRole('group')).toHaveClass('full-group');
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('should maintain displayName', () => {
    expect(CheckboxGroup.displayName).toBe('CheckboxGroup');
  });
});