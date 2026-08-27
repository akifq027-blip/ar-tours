import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';

type ResetStep = 'request' | 'verify' | 'new_password' | 'success';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard Step State
  const [step, setStep] = useState<ResetStep>('request');

  // Step 1 State: Email
  const [email, setEmail] = useState('');

  // Step 2 State: OTP & Session
  const [sessionId, setSessionId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [expiresIn, setExpiresIn] = useState<number>(600);
  const [resendCooldown, setResendCooldown] = useState<number>(30);
  const [resending, setResending] = useState(false);

  // Step 3 State: New Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check URL query parameters for email prefill if passed from login
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Expiration & Resend Cooldown Countdown Timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify') {
      timer = setInterval(() => {
        setExpiresIn(prev => (prev > 0 ? prev - 1 : 0));
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Step 1: Request Password Reset Code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await api.forgotPassword({ email: email.trim() });
      setSessionId(res.reset_session_id);
      setMaskedEmail(res.masked_email);
      setMaskedPhone(res.masked_phone || '');
      setExpiresIn(res.expires_in_seconds || 600);
      setResendCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('verify');
      setInfoMessage(res.message);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setError(err.message || 'Unable to request password reset. Please verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Navigation & Changes
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

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

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await api.verifyResetOtp({
        reset_session_id: sessionId,
        otp: fullOtp,
      });
      setInfoMessage(res.message);
      setStep('new_password');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      const res = await api.resendResetOtp({ reset_session_id: sessionId });
      setMaskedEmail(res.masked_email);
      setMaskedPhone(res.masked_phone || '');
      setExpiresIn(res.expires_in_seconds || 600);
      setResendCooldown(30);
      setInfoMessage('A new verification code has been dispatched.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  // Step 3: Complete Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullOtp = otpDigits.join('');
      await api.resetPassword({
        reset_session_id: sessionId,
        otp: fullOtp,
        new_password: newPassword,
      });
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please start the process again.');
    } finally {
      setLoading(false);
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
        {/* STEP 1: REQUEST CODE */}
        {step === 'request' && (
          <>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your registered email address and we will dispatch a 6-digit verification code to reset your password.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Registered Email</label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
              Remember your password?{' '}
              <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300 underline">
                Back to Sign In
              </Link>
            </div>
          </>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'verify' && (
          <>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25">
                <Smartphone className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white">Enter Security Code</h2>
              <p className="text-xs text-slate-300 mt-1">
                We have sent a 6-digit verification PIN to your registered contact:
              </p>
              <div className="mt-2.5 flex flex-wrap justify-center items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold backdrop-blur-md">
                  {maskedEmail}
                </span>
                {maskedPhone && (
                  <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold backdrop-blur-md">
                    {maskedPhone}
                  </span>
                )}
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

            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
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

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>
                  Expires in:{' '}
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
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setError('');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email Address</span>
              </button>
            </div>
          </>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 'new_password' && (
          <>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Create New Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your identity has been verified. Enter a secure new password for your account.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
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

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Password Updated!</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Your account password has been successfully reset. You can now sign in with your new credentials.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
