import { authService, userService, goalService, utilityService } from '../supabaseService';
import { supabase } from '../../lib/supabase';

// Mock the supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123' };
      
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authService.signUp('test@example.com', 'password123', {
        full_name: 'Test User',
        username: 'testuser',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
            username: 'testuser',
          },
          emailRedirectTo: `${window.location.origin}/dashboard-home`,
        },
      });

      expect(result).toEqual({ user: mockUser, session: mockSession });
    });

    it('should throw error when sign up fails', async () => {
      const mockError = new Error('Sign up failed');
      
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.signUp('test@example.com', 'password123'))
        .rejects.toThrow('Sign up failed');
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123' };
      
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authService.signIn('test@example.com', 'password123');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({ user: mockUser, session: mockSession });
    });

    it('should throw error when sign in fails', async () => {
      const mockError = new Error('Invalid credentials');
      
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.signIn('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      supabase.auth.signOut.mockResolvedValue({ error: null });

      await expect(authService.signOut()).resolves.not.toThrow();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should throw error when sign out fails', async () => {
      const mockError = new Error('Sign out failed');
      supabase.auth.signOut.mockResolvedValue({ error: mockError });

      await expect(authService.signOut()).rejects.toThrow('Sign out failed');
    });
  });

  describe('getCurrentSession', () => {
    it('should get current session successfully', async () => {
      const mockSession = { access_token: 'token123' };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await authService.getCurrentSession();
      expect(result).toEqual(mockSession);
    });

    it('should throw error when getting session fails', async () => {
      const mockError = new Error('Session error');
      
      supabase.auth.getSession.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.getCurrentSession()).rejects.toThrow('Session error');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should throw error when getting user fails', async () => {
      const mockError = new Error('User error');
      
      supabase.auth.getUser.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.getCurrentUser()).rejects.toThrow('User error');
    });
  });
});

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const mockProfile = {
        id: '123',
        full_name: 'Test User',
        email: 'test@example.com',
      };
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };
      
      supabase.from.mockReturnValue(mockQuery);

      const result = await userService.getUserProfile('123');

      expect(supabase.from).toHaveBeenCalledWith('user_profiles');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '123');
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });

    it('should throw error when getting profile fails', async () => {
      const mockError = new Error('Profile not found');
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };
      
      supabase.from.mockReturnValue(mockQuery);

      await expect(userService.getUserProfile('123')).rejects.toThrow('Profile not found');
    });
  });
});

describe('utilityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatRelativeTime', () => {
    it('should format recent time correctly', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      const result = utilityService.formatRelativeTime(fiveMinutesAgo.toISOString());
      expect(result).toBe('5 minutes ago');
    });

    it('should format hours correctly', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      const result = utilityService.formatRelativeTime(twoHoursAgo.toISOString());
      expect(result).toBe('2 hours ago');
    });

    it('should format days correctly', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      
      const result = utilityService.formatRelativeTime(threeDaysAgo.toISOString());
      expect(result).toBe('3 days ago');
    });

    it('should handle invalid date', () => {
      const result = utilityService.formatRelativeTime('invalid-date');
      expect(result).toBe('Invalid date');
    });
  });

  describe('getPublicUrl', () => {
    it('should get public URL successfully', () => {
      const mockUrl = 'https://example.com/file.jpg';
      
      const mockStorage = {
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: mockUrl } }),
      };
      
      supabase.storage.from.mockReturnValue(mockStorage);

      const result = utilityService.getPublicUrl('avatars', 'user123.jpg');

      expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(mockStorage.getPublicUrl).toHaveBeenCalledWith('user123.jpg');
      expect(result).toBe(mockUrl);
    });
  });
});