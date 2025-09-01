import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../NotFound';

// Mock the AppIcon component
jest.mock('../../components/AppIcon', () => {
  return function MockAppIcon({ name, size, color, ...props }) {
    return (
      <span 
        data-testid={`icon-${name.toLowerCase()}`} 
        data-size={size} 
        data-color={color}
        {...props}
      >
        {name}
      </span>
    );
  };
});

const NotFoundWithRouter = () => (
  <BrowserRouter>
    <NotFound />
  </BrowserRouter>
);

describe('NotFound', () => {
  it('should render 404 error message', () => {
    render(<NotFoundWithRouter />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should render descriptive error message', () => {
    render(<NotFoundWithRouter />);
    
    const errorMessage = screen.getByText(/sorry, the page you are looking for/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should render back to home link', () => {
    render(<NotFoundWithRouter />);
    
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render with proper styling classes', () => {
    render(<NotFoundWithRouter />);
    
    const container = screen.getByText('404').closest('div');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });

  it('should render 404 heading with correct styling', () => {
    render(<NotFoundWithRouter />);
    
    const heading404 = screen.getByText('404');
    expect(heading404).toHaveClass('text-6xl');
    expect(heading404).toHaveClass('font-bold');
    expect(heading404).toHaveClass('text-gray-900');
  });

  it('should render page title with correct styling', () => {
    render(<NotFoundWithRouter />);
    
    const pageTitle = screen.getByText('Page Not Found');
    expect(pageTitle).toHaveClass('text-2xl');
    expect(pageTitle).toHaveClass('font-semibold');
    expect(pageTitle).toHaveClass('text-gray-700');
  });

  it('should render error description with correct styling', () => {
    render(<NotFoundWithRouter />);
    
    const description = screen.getByText(/sorry, the page you are looking for/i);
    expect(description).toHaveClass('text-gray-500');
    expect(description).toHaveClass('text-center');
  });

  it('should render home link with correct styling', () => {
    render(<NotFoundWithRouter />);
    
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveClass('bg-blue-600');
    expect(homeLink).toHaveClass('text-white');
    expect(homeLink).toHaveClass('px-6');
    expect(homeLink).toHaveClass('py-3');
    expect(homeLink).toHaveClass('rounded-lg');
    expect(homeLink).toHaveClass('hover:bg-blue-700');
  });

  it('should render home icon in the link', () => {
    render(<NotFoundWithRouter />);
    
    const homeIcon = screen.getByTestId('icon-home');
    expect(homeIcon).toBeInTheDocument();
    expect(homeIcon).toHaveAttribute('data-size', '20');
  });

  it('should have proper semantic structure', () => {
    render(<NotFoundWithRouter />);
    
    // Check for main content area
    const mainContent = screen.getByText('404').closest('div');
    expect(mainContent).toBeInTheDocument();
    
    // Check for proper heading hierarchy
    const heading404 = screen.getByText('404');
    const pageTitle = screen.getByText('Page Not Found');
    expect(heading404.tagName).toBe('H1');
    expect(pageTitle.tagName).toBe('H2');
  });

  it('should be accessible', () => {
    render(<NotFoundWithRouter />);
    
    // Check for proper link accessibility
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);
  });

  it('should render consistently', () => {
    const { rerender } = render(<NotFoundWithRouter />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    
    rerender(<NotFoundWithRouter />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});