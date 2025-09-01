import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Select from '../Select';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: ({ className, ...props }) => (
    <span data-testid="chevron-down" className={className} {...props}>▼</span>
  ),
  Check: ({ className, ...props }) => (
    <span data-testid="check-icon" className={className} {...props}>✓</span>
  ),
  Search: ({ className, ...props }) => (
    <span data-testid="search-icon" className={className} {...props}>🔍</span>
  ),
  X: ({ className, ...props }) => (
    <span data-testid="x-icon" className={className} {...props}>✕</span>
  ),
}));

// Mock Button and Input components
jest.mock('../Button', () => {
  const mockReact = require('react');
  return mockReact.forwardRef(({ children, onClick, className, ...props }, ref) => (
    mockReact.createElement('button', { ref, onClick, className, ...props }, children)
  ));
});

jest.mock('../Input', () => {
  const mockReact = require('react');
  return mockReact.forwardRef(({ onChange, className, ...props }, ref) => (
    mockReact.createElement('input', { ref, onChange, className, ...props })
  ));
});

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render basic select', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent('Select an option');
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<Select options={mockOptions} placeholder="Choose an item" />);
    
    expect(screen.getByText('Choose an item')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select options={mockOptions} label="Select Option" />);
    
    const label = screen.getByText('Select Option');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('should render required indicator', () => {
    render(<Select options={mockOptions} label="Required Field" required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-destructive', 'ml-1');
  });

  it('should render with description', () => {
    render(<Select options={mockOptions} description="Choose your preferred option" />);
    
    expect(screen.getByText('Choose your preferred option')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred option')).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('should render with error message', () => {
    render(<Select options={mockOptions} error="Please select an option" />);
    
    const errorMessage = screen.getByText('Please select an option');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-sm', 'text-destructive');
  });

  it('should hide description when error is present', () => {
    render(
      <Select 
        options={mockOptions} 
        description="Select description" 
        error="Error occurred" 
      />
    );
    
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.queryByText('Select description')).not.toBeInTheDocument();
  });

  it('should open dropdown when clicked', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should close dropdown when option is selected', () => {
    const handleChange = jest.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    expect(handleChange).toHaveBeenCalledWith('option1');
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('should display selected value', () => {
    render(<Select options={mockOptions} value="option2" />);
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should handle multiple selection', () => {
    const handleChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        multiple 
        value={['option1']} 
        onChange={handleChange} 
      />
    );
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    
    expect(handleChange).toHaveBeenCalledWith(['option1', 'option2']);
  });

  it('should show multiple selection count', () => {
    render(
      <Select 
        options={mockOptions} 
        multiple 
        value={['option1', 'option2']} 
      />
    );
    
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('should show single item label for multiple selection with one item', () => {
    render(
      <Select 
        options={mockOptions} 
        multiple 
        value={['option1']} 
      />
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should deselect option in multiple mode', () => {
    const handleChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        multiple 
        value={['option1', 'option2']} 
        onChange={handleChange} 
      />
    );
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(handleChange).toHaveBeenCalledWith(['option2']);
  });

  it('should render searchable select', () => {
    render(<Select options={mockOptions} searchable />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search options...')).toBeInTheDocument();
  });

  it('should filter options based on search', () => {
    render(<Select options={mockOptions} searchable />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText('Search options...');
    fireEvent.change(searchInput, { target: { value: 'Option 1' } });
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
  });

  it('should show no options found message', () => {
    render(<Select options={mockOptions} searchable />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText('Search options...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No options found')).toBeInTheDocument();
  });

  it('should render clearable select', () => {
    render(<Select options={mockOptions} clearable value="option1" />);
    
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('should clear selection when clear button is clicked', () => {
    const handleChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        clearable 
        value="option1" 
        onChange={handleChange} 
      />
    );
    
    const clearButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('should clear multiple selection', () => {
    const handleChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        multiple 
        clearable 
        value={['option1', 'option2']} 
        onChange={handleChange} 
      />
    );
    
    const clearButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(clearButton);
    
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('should show loading state', () => {
    render(<Select options={mockOptions} loading />);
    
    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select options={mockOptions} disabled />);
    
    const select = screen.getByRole('button');
    expect(select).toBeDisabled();
  });

  it('should not open when disabled', () => {
    render(<Select options={mockOptions} disabled />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('should handle onOpenChange callback', () => {
    const handleOpenChange = jest.fn();
    render(<Select options={mockOptions} onOpenChange={handleOpenChange} />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('should generate unique ID when not provided', () => {
    render(
      <div>
        <Select options={mockOptions} data-testid="select1" />
        <Select options={mockOptions} data-testid="select2" />
      </div>
    );
    
    const select1 = screen.getByTestId('select1');
    const select2 = screen.getByTestId('select2');
    
    expect(select1.id).toBeTruthy();
    expect(select2.id).toBeTruthy();
    expect(select1.id).not.toBe(select2.id);
  });

  it('should use provided ID', () => {
    render(<Select options={mockOptions} id="custom-select" />);
    
    const select = screen.getByRole('button');
    expect(select).toHaveAttribute('id', 'custom-select');
  });

  it('should render hidden native select for form submission', () => {
    render(<Select options={mockOptions} name="test-select" value="option1" />);
    
    const hiddenSelect = document.querySelector('select[name="test-select"]');
    expect(hiddenSelect).toBeInTheDocument();
    expect(hiddenSelect).toHaveValue('option1');
  });

  it('should handle options with descriptions', () => {
    const optionsWithDesc = [
      { value: 'opt1', label: 'Option 1', description: 'First option' },
      { value: 'opt2', label: 'Option 2', description: 'Second option' },
    ];
    
    render(<Select options={optionsWithDesc} />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(screen.getByText('First option')).toBeInTheDocument();
    expect(screen.getByText('Second option')).toBeInTheDocument();
  });

  it('should handle disabled options', () => {
    const optionsWithDisabled = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2', disabled: true },
    ];
    
    const handleChange = jest.fn();
    render(<Select options={optionsWithDisabled} onChange={handleChange} />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const disabledOption = screen.getByText('Option 2');
    fireEvent.click(disabledOption);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should show check icon for selected options in multiple mode', () => {
    render(
      <Select 
        options={mockOptions} 
        multiple 
        value={['option1']} 
      />
    );
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('should rotate chevron when open', () => {
    render(<Select options={mockOptions} />);
    
    const select = screen.getByRole('button');
    const chevron = screen.getByTestId('chevron-down');
    
    expect(chevron).not.toHaveClass('rotate-180');
    
    fireEvent.click(select);
    expect(chevron).toHaveClass('rotate-180');
  });

  it('should clear search term when dropdown closes', () => {
    render(<Select options={mockOptions} searchable />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    const searchInput = screen.getByPlaceholderText('Search options...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    fireEvent.click(select); // Close dropdown
    fireEvent.click(select); // Reopen dropdown
    
    const newSearchInput = screen.getByPlaceholderText('Search options...');
    expect(newSearchInput.value).toBe('');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef();
    render(<Select options={mockOptions} ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should apply custom className', () => {
    render(<Select options={mockOptions} className="custom-select" />);
    
    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveClass('custom-select');
  });

  it('should maintain displayName', () => {
    expect(Select.displayName).toBe('Select');
  });

  it('should show no options available message when no options provided', () => {
    render(<Select options={[]} />);
    
    const select = screen.getByRole('button');
    fireEvent.click(select);
    
    expect(screen.getByText('No options available')).toBeInTheDocument();
  });

  it('should handle empty value correctly', () => {
    render(<Select options={mockOptions} value="" />);
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should handle undefined value correctly', () => {
    render(<Select options={mockOptions} value={undefined} />);
    
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });
});