import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { user, login, verify2FA, resend2FA, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Step state: 'credentials' or '2fa'
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');

  // Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2FA State
  const [sessionId, setSessionId] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [expiresIn, setExpiresIn] = useState<number>(300);
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  const [resending, setResending] = useState(false);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Determine redirect path from search query or location state
  const searchParams = new URLSearchParams(location.search);
  const fromParam = searchParams.get('from');
  const fromState = (location.state as any)?.from;
  const targetFrom = fromParam || fromState;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Expiration and Resend Cooldown Countdown Timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === '2fa') {
      timer = setInterval(() => {
        setExpiresIn(prev => (prev > 0 ? prev - 1 : 0));
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Handle Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await login(email.trim(), password);
      if (res.requires_2fa && res.two_factor_session_id) {
        setSessionId(res.two_factor_session_id);
        setMaskedPhone(res.masked_phone || '+91 ••••• ••741');
        setExpiresIn(res.expires_in_seconds || 300);
        setResendCooldown(30);
        setOtpDigits(['', '', '', '', '', '']);
        setStep('2fa');
        setInfoMessage(`A 6-digit security code was dispatched to ${res.masked_phone || 'your phone'}.`);
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      } else {
        // Direct login success
        if (targetFrom) {
          navigate(targetFrom, { replace: true });
        } else if (res.user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // If user pasted or typed multiple digits
    if (cleanVal.length > 1) {
      const digitsArr = cleanVal.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      digitsArr.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(digitsArr.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto advance to next input box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key navigation between OTP boxes
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Step 2: Submit 2FA OTP
  const handleVerify2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the security verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await verify2FA(sessionId, fullOtp);
      if (targetFrom) {
        navigate(targetFrom, { replace: true });
      } else if (res.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      const res = await resend2FA(sessionId);
      setMaskedPhone(res.masked_phone || maskedPhone);
      setExpiresIn(res.expires_in_seconds || 300);
      setResendCooldown(30);
      setInfoMessage('New security code dispatched successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend security code.');
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        {step === 'credentials' ? (
          <>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-1">
                Sign in to manage your car bookings, tour packages, or access the admin portal.
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
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
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
          </>
        ) : (
          /* STEP 2: TWO-STEP VERIFICATION (2FA) */
          <>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                <KeyRound className="w-3 h-3" />
                Two-Step Verification
              </div>
              <h2 className="text-2xl font-black text-white">Enter Security Code</h2>
              <p className="text-xs text-slate-300 mt-1">
                To protect administrative access, enter the 6-digit OTP dispatched to:
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold backdrop-blur-md">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>{maskedPhone}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {infoMessage && !error && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerify2FASubmit} className="space-y-5 text-xs">
              {/* 6-Box OTP Input */}
              <div>
                <label className="block text-center font-bold text-slate-300 mb-2">
                  6-Digit Verification PIN
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleKeyDown(idx, e)}
                      className="w-10 sm:w-12 h-12 text-center text-lg font-bold bg-white/5 border border-white/15 rounded-xl text-white focus:bg-white/10 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 focus:outline-none transition font-mono backdrop-blur-md"
                    />
                  ))}
                </div>
              </div>

              {/* Expiration Timer & Resend Controls */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Code expires in:{' '}
                  <span className={`font-mono font-bold ${expiresIn < 60 ? 'text-red-400' : 'text-amber-400'}`}>
                    {formatTimer(expiresIn)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resending}
                  className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6 || expiresIn === 0}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Verifying Code...' : 'Verify & Access Admin'}
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setError('');
                  setInfoMessage('');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In (Change Account)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
