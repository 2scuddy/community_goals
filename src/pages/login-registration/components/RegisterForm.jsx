import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData?.fullName?.trim()) {
      return 'Full name is required';
    }
    if (!formData?.email) {
      return 'Email is required';
    }
    if (!formData?.username?.trim()) {
      return 'Username is required';
    }
    if (formData?.username?.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!formData?.password) {
      return 'Password is required';
    }
    if (formData?.password?.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (formData?.password !== formData?.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!acceptTerms) {
      return 'Please accept the Terms of Service';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(formData?.email, formData?.password, {
        full_name: formData?.fullName,
        username: formData?.username
      });
      
      // Show success message or redirect
      navigate('/dashboard-home');
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.message?.includes('email')) {
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
      } else if (error?.message?.includes('username')) {
        errorMessage = 'This username is already taken. Please choose a different username.';
      } else if (error?.message) {
        errorMessage = error?.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData?.fullName}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData?.email}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        <div>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData?.username}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            At least 3 characters, letters and numbers only
          </p>
        </div>

        <div>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData?.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            At least 6 characters
          </p>
        </div>

        <div>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e?.target?.checked)}
          className="rounded border-border text-primary focus:ring-primary mt-1"
          disabled={loading}
        />
        <label htmlFor="acceptTerms" className="text-sm text-muted-foreground cursor-pointer">
          I agree to the{' '}
          <button
            type="button"
            className="text-primary hover:text-primary/80 transition-smooth underline"
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button
            type="button"
            className="text-primary hover:text-primary/80 transition-smooth underline"
          >
            Privacy Policy
          </button>
        </label>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !acceptTerms}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span>Creating account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;