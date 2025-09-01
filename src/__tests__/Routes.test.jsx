import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Routes from '../Routes';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock all the page components
jest.mock('../pages/landing/LandingPage', () => {
  return function MockLandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  };
});

jest.mock('../pages/login-registration', () => {
  return function MockLoginRegistration() {
    return <div data-testid="login-registration">Login Registration</div>;
  };
});

jest.mock('../pages/dashboard-home', () => {
  return function MockDashboardHome() {
    return <div data-testid="dashboard-home">Dashboard Home</div>;
  };
});

jest.mock('../pages/goal-creation-management', () => {
  return function MockGoalManagement() {
    return <div data-testid="goal-management">Goal Management</div>;
  };
});

jest.mock('../pages/group-discovery-matching', () => {
  return function MockGroupDiscovery() {
    return <div data-testid="group-discovery">Group Discovery</div>;
  };
});

jest.mock('../pages/group-dashboard-communication', () => {
  return function MockGroupDashboard() {
    return <div data-testid="group-dashboard">Group Dashboard</div>;
  };
});

jest.mock('../pages/user-profile-settings', () => {
  return function MockUserProfile() {
    return <div data-testid="user-profile">User Profile</div>;
  };
});

jest.mock('../pages/NotFound', () => {
  return function MockNotFound() {
    return <div data-testid="not-found">Not Found</div>;
  };
});

const { useAuth } = require('../contexts/AuthContext');

describe('Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes />
      </MemoryRouter>
    );
  };

  describe('Public Routes (Unauthenticated)', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: null,
        loading: false,
      });
    });

    it('should render landing page for root path', () => {
      renderWithRouter(['/']);
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });

    it('should render login page for /login path', () => {
      renderWithRouter(['/login']);
      expect(screen.getByTestId('login-registration')).toBeInTheDocument();
    });

    it('should render login page for /register path', () => {
      renderWithRouter(['/register']);
      expect(screen.getByTestId('login-registration')).toBeInTheDocument();
    });

    it('should render not found page for invalid routes', () => {
      renderWithRouter(['/invalid-route']);
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    it('should redirect protected routes to landing when not authenticated', () => {
      renderWithRouter(['/dashboard-home']);
      // Should redirect to landing page or show login
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
  });

  describe('Protected Routes (Authenticated)', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
      });
    });

    it('should render dashboard home for /dashboard-home path', () => {
      renderWithRouter(['/dashboard-home']);
      expect(screen.getByTestId('dashboard-home')).toBeInTheDocument();
    });

    it('should render goal management for /goals path', () => {
      renderWithRouter(['/goals']);
      expect(screen.getByTestId('goal-management')).toBeInTheDocument();
    });

    it('should render group discovery for /groups path', () => {
      renderWithRouter(['/groups']);
      expect(screen.getByTestId('group-discovery')).toBeInTheDocument();
    });

    it('should render group dashboard for /group/:id path', () => {
      renderWithRouter(['/group/123']);
      expect(screen.getByTestId('group-dashboard')).toBeInTheDocument();
    });

    it('should render user profile for /profile path', () => {
      renderWithRouter(['/profile']);
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    });

    it('should render not found page for invalid protected routes', () => {
      renderWithRouter(['/invalid-protected-route']);
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should handle loading state', () => {
      useAuth.mockReturnValue({
        user: null,
        loading: true,
      });

      renderWithRouter(['/']);
      
      // During loading, it might show a loading indicator or the landing page
      // The exact behavior depends on the implementation
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });
  });

  describe('Route Navigation', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
      });
    });

    it('should handle multiple route changes', () => {
      const { rerender } = renderWithRouter(['/dashboard-home']);
      expect(screen.getByTestId('dashboard-home')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/goals']}>
          <Routes />
        </MemoryRouter>
      );
      expect(screen.getByTestId('goal-management')).toBeInTheDocument();
    });
  });

  describe('Authentication State Changes', () => {
    it('should handle authentication state changes', () => {
      // Start unauthenticated
      useAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      const { rerender } = renderWithRouter(['/']);
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();

      // Simulate user login
      useAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
      });

      rerender(
        <MemoryRouter initialEntries={['/dashboard-home']}>
          <Routes />
        </MemoryRouter>
      );
      expect(screen.getByTestId('dashboard-home')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined user gracefully', () => {
      useAuth.mockReturnValue({
        user: undefined,
        loading: false,
      });

      expect(() => {
        renderWithRouter(['/']);
      }).not.toThrow();

      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });

    it('should handle null auth context gracefully', () => {
      useAuth.mockReturnValue(null);

      expect(() => {
        renderWithRouter(['/']);
      }).not.toThrow();
    });
  });
});