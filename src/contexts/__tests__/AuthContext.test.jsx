import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';

// Mock the supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access the context
const TestComponent = () => {
  const { user, profile, loading, session, signUp, signIn, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="profile">{profile ? profile.full_name : 'no-profile'}</div>
      <div data-testid="session">{session ? 'has-session' : 'no-session'}</div>
      <button onClick={() => signUp('test@example.com', 'password123')}>Sign Up</button>
      <button onClick={() => signIn('test@example.com', 'password123')}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

const TestComponentOutsideProvider = () => {
  const { user } = useAuth();
  return <div data-testid="no-error">User: {user?.email || 'none'}</div>;
};

const ErrorBoundaryWrapper = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <div data-testid="error">{error?.message || 'An error occurred'}</div>;
  }

  try {
    return children;
  } catch (error) {
    return <div data-testid="error">{error.message}</div>;
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error">{this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Default mock implementations
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
  });

  describe('useAuth hook', () => {
    it('should provide context values when used within AuthProvider', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      
      // Should render without throwing an error
      expect(screen.getByTestId('user')).toBeInTheDocument();
      expect(screen.getByTestId('profile')).toBeInTheDocument();
      expect(screen.getByTestId('session')).toBeInTheDocument();
    });
  });

  describe('AuthProvider', () => {
    it('should render children and provide initial state', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('profile')).toHaveTextContent('no-profile');
      expect(screen.getByTestId('session')).toHaveTextContent('no-session');
    });

    it('should initialize with existing session', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123', user: mockUser };
      const mockProfile = { id: '123', full_name: 'Test User' };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };
      
      supabase.from.mockReturnValue(mockQuery);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('profile')).toHaveTextContent('Test User');
      });
      
      expect(screen.getByTestId('session')).toHaveTextContent('has-session');
    });

    it('should handle auth state changes', async () => {
      let authStateChangeCallback;
      
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateChangeCallback = callback;
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        };
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // Simulate auth state change
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123', user: mockUser };
      
      act(() => {
        authStateChangeCallback('SIGNED_IN', mockSession);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      });
      
      expect(screen.getByTestId('session')).toHaveTextContent('has-session');
    });

    it('should handle sign out state change', async () => {
      let authStateChangeCallback;
      
      supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authStateChangeCallback = callback;
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        };
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      // Simulate sign out
      act(() => {
        authStateChangeCallback('SIGNED_OUT', null);
      });

      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('profile')).toHaveTextContent('no-profile');
      expect(screen.getByTestId('session')).toHaveTextContent('no-session');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('isAuthenticated');
    });

    it('should clean up mock authentication on initialization', async () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('isAuthenticated');
    });

    it('should handle profile fetch error gracefully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123', user: mockUser };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error('Profile fetch failed')),
      };
      
      supabase.from.mockReturnValue(mockQuery);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      });
      
      expect(screen.getByTestId('profile')).toHaveTextContent('no-profile');
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user profile:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});