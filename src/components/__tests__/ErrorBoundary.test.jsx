import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Mock the AppIcon component
jest.mock('../AppIcon', () => {
  return function MockIcon({ name, size, color }) {
    return <span data-testid="mock-icon" data-name={name} data-size={size} data-color={color} />;
  };
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="no-error">No error occurred</div>;
};

// Mock window.location.href
const mockLocationHref = jest.fn();
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { href: '' };
});

afterAll(() => {
  window.location = originalLocation;
});

// Mock window.__COMPONENT_ERROR__
const mockComponentError = jest.fn();
Object.defineProperty(window, '__COMPONENT_ERROR__', {
  value: mockComponentError,
  writable: true,
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('no-error')).toBeInTheDocument();
    expect(screen.getByTestId('no-error')).toHaveTextContent('No error occurred');
  });

  it('should render error UI when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByTestId('no-error')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an unexpected error while processing your request.')).toBeInTheDocument();
  });

  it('should display the error UI with correct styling', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const container = screen.getByText('Something went wrong').closest('div');
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-neutral-50');
    
    const heading = screen.getByText('Something went wrong');
    expect(heading).toHaveClass('text-2xl', 'font-medium', 'text-neutral-800');
    
    const description = screen.getByText('We encountered an unexpected error while processing your request.');
    expect(description).toHaveClass('text-neutral-600', 'text-base');
  });

  it('should render the back button with correct styling', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass(
      'bg-blue-500',
      'hover:bg-blue-600',
      'text-white',
      'font-medium',
      'py-2',
      'px-4',
      'rounded'
    );
  });

  it('should render the error icon', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorIcon = screen.getByTestId('mock-icon');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveAttribute('data-name', 'ArrowLeft');
    expect(errorIcon).toHaveAttribute('data-size', '18');
    expect(errorIcon).toHaveAttribute('data-color', '#fff');
  });

  it('should have a clickable back button', async () => {
    const user = userEvent.setup();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeEnabled();
    
    // Test that button is clickable (doesn't throw error)
    await user.click(backButton);
    expect(backButton).toBeInTheDocument();
  });

  it('should call window.__COMPONENT_ERROR__ when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockComponentError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error',
        __ErrorBoundary: true,
      }),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should handle multiple errors correctly', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('no-error')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByTestId('no-error')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should handle case when window.__COMPONENT_ERROR__ is not defined', () => {
    // Temporarily remove the mock
    delete window.__COMPONENT_ERROR__;
    
    expect(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    }).not.toThrow();

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Restore the mock
    window.__COMPONENT_ERROR__ = mockComponentError;
  });
});