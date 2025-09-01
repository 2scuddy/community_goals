import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(formData?.email, formData?.password);
      navigate('/dashboard-home');
    } catch (error) {
      console.error('Login error:', error);
      setError(error?.message || 'Invalid email or password. Please try again.');
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData?.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        
        <button
          type="button"
          className="text-primary hover:text-primary/80 transition-smooth"
        >
          Forgot password?
        </button>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign In'
        )}
      </Button>
      {/* Demo Credentials */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Email: <span className="font-mono">sarah.johnson@example.com</span></p>
          <p>Password: <span className="font-mono">password123</span></p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;