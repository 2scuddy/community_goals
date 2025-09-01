import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  it('should render basic text input', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('should render required indicator', () => {
    render(<Input label="Email" required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-destructive', 'ml-1');
  });

  it('should render with description', () => {
    render(<Input label="Password" description="Must be at least 8 characters" />);
    
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('Must be at least 8 characters')).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('should render with error message', () => {
    render(<Input label="Email" error="Invalid email format" />);
    
    const errorMessage = screen.getByText('Invalid email format');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-sm', 'text-destructive');
  });

  it('should hide description when error is present', () => {
    render(
      <Input 
        label="Email" 
        description="Enter your email" 
        error="Invalid email" 
      />
    );
    
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
  });

  it('should apply error styling to input', () => {
    render(<Input error="Error message" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive', 'focus-visible:ring-destructive');
  });

  it('should apply error styling to label', () => {
    render(<Input label="Field" error="Error message" />);
    
    const label = screen.getByText('Field');
    expect(label).toHaveClass('text-destructive');
  });

  it('should render different input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'];
    
    types.forEach(type => {
      const { rerender } = render(<Input type={type} data-testid={`input-${type}`} />);
      
      const input = screen.getByTestId(`input-${type}`);
      expect(input).toHaveAttribute('type', type);
      
      rerender(<div />); // Clear for next iteration
    });
  });

  it('should render checkbox input', () => {
    render(<Input type="checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('h-4', 'w-4', 'rounded', 'border');
  });

  it('should render radio input', () => {
    render(<Input type="radio" name="option" />);
    
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveClass('h-4', 'w-4', 'rounded-full', 'border');
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('should handle onChange event', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle onFocus and onBlur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should generate unique ID when not provided', () => {
    render(
      <div>
        <Input data-testid="input1" />
        <Input data-testid="input2" />
      </div>
    );
    
    const input1 = screen.getByTestId('input1');
    const input2 = screen.getByTestId('input2');
    
    expect(input1.id).toBeTruthy();
    expect(input2.id).toBeTruthy();
    expect(input1.id).not.toBe(input2.id);
  });

  it('should use provided ID', () => {
    render(<Input id="custom-id" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should handle checkbox interactions', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input type="checkbox" onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  it('should handle radio button interactions', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <div>
        <Input type="radio" name="test" value="option1" onChange={handleChange} />
        <Input type="radio" name="test" value="option2" onChange={handleChange} />
      </div>
    );
    
    const radios = screen.getAllByRole('radio');
    await user.click(radios[0]);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it('should render with all props combined', () => {
    render(
      <Input 
        type="email"
        label="Email Address"
        description="We'll never share your email"
        required
        placeholder="Enter your email"
        className="custom-input"
        id="email-field"
      />
    );
    
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
    expect(input).toHaveAttribute('id', 'email-field');
    expect(input).toHaveClass('custom-input');
  });

  it('should handle file input type', () => {
    render(<Input type="file" />);
    
    const input = screen.getByRole('textbox', { hidden: true }) || document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('type', 'file');
  });

  it('should maintain displayName', () => {
    expect(Input.displayName).toBe('Input');
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.tab();
    
    expect(input).toHaveFocus();
  });

  it('should handle paste events', async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.paste('pasted text');
    
    expect(input).toHaveValue('pasted text');
  });

  it('should render without wrapper for checkbox and radio', () => {
    const { container: checkboxContainer } = render(<Input type="checkbox" />);
    const { container: radioContainer } = render(<Input type="radio" />);
    
    // Checkbox and radio should not have the wrapper div with space-y-2
    expect(checkboxContainer.querySelector('.space-y-2')).not.toBeInTheDocument();
    expect(radioContainer.querySelector('.space-y-2')).not.toBeInTheDocument();
  });

  it('should render with wrapper for regular inputs', () => {
    const { container } = render(<Input type="text" />);
    
    expect(container.querySelector('.space-y-2')).toBeInTheDocument();
  });
});