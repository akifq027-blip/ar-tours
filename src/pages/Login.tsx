import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Determine redirect path from search query or location state
  const searchParams = new URLSearchParams(location.search);
  const fromParam = searchParams.get('from');
  const fromState = (location.state as any)?.from;
  const targetFrom = fromParam || fromState;

  // If already logged in, redirect to appropriate portal
  useEffect(() => {
    if (!isLoading && user) {
      if (targetFrom) {
        navigate(targetFrom, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isLoading, navigate, targetFrom]);

  // Handle Credentials Submit
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email.trim(), password);
      if (targetFrom) {
        navigate(targetFrom, { replace: true });
      } else if (res.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your bookings, tour packages, or manage operations.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-300">Password</label>
              <Link
                to={email ? `/forgot-password?email=${encodeURIComponent(email)}` : '/forgot-password'}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300 underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

