import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the Routes component
jest.mock('../Routes', () => {
  return function MockRoutes() {
    return <div data-testid="routes-component">Routes Component</div>;
  };
});

// Mock the AuthProvider
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

// Mock the ErrorBoundary
jest.mock('../components/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

// Mock the ScrollToTop component
jest.mock('../components/ScrollToTop', () => {
  return function MockScrollToTop({ children }) {
    return <div data-testid="scroll-to-top">{children}</div>;
  };
});

describe('App', () => {
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  it('should render without crashing', () => {
    renderApp();
    expect(screen.getByTestId('routes-component')).toBeInTheDocument();
  });

  it('should render ErrorBoundary wrapper', () => {
    renderApp();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('should render AuthProvider wrapper', () => {
    renderApp();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('should render ScrollToTop component', () => {
    renderApp();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
  });

  it('should render Routes component', () => {
    renderApp();
    expect(screen.getByTestId('routes-component')).toBeInTheDocument();
    expect(screen.getByText('Routes Component')).toBeInTheDocument();
  });

  it('should have proper component hierarchy', () => {
    renderApp();
    
    const errorBoundary = screen.getByTestId('error-boundary');
    const authProvider = screen.getByTestId('auth-provider');
    const scrollToTop = screen.getByTestId('scroll-to-top');
    const routes = screen.getByTestId('routes-component');
    
    expect(errorBoundary).toContainElement(authProvider);
    expect(authProvider).toContainElement(scrollToTop);
    expect(scrollToTop).toContainElement(routes);
  });

  it('should render consistently on multiple renders', () => {
    const { rerender } = renderApp();
    
    expect(screen.getByTestId('routes-component')).toBeInTheDocument();
    
    rerender(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('routes-component')).toBeInTheDocument();
  });

  it('should maintain component structure', () => {
    renderApp();
    
    // Verify all expected components are present
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    expect(screen.getByTestId('routes-component')).toBeInTheDocument();
  });
});