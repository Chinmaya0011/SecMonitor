'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (api.isAuthenticated()) {
      router.push('/logger');
    }
  }, [router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOTP = () => {
    if (!email) {
      setOtpError('Please enter email address first');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setOtpError('Please enter a valid email address');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    setTimeout(() => {
      setOtpSent(true);
      setOtpSuccess('2FA code sent to your email!');
      setResendCooldown(60);
      setOtpLoading(false);
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    setTimeout(() => {
      if (otpValue === '123456') {
        setOtpSuccess('2FA verified!');
        setTimeout(() => {
          setCurrentStep(3);
        }, 800);
      } else {
        setOtpError('Invalid 2FA code. Demo code: 123456');
      }
      setOtpLoading(false);
    }, 800);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!email) {
        setError('Please enter your email');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address');
        return;
      }
      setCurrentStep(2);
      setError('');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await api.login(email, password);
    
    if (result.success) {
      router.push('/logger');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 scanline">
      <div className="absolute top-0 left-0 w-full p-3">
        <div className="text-accent text-xs font-mono">
          SECMONITOR v1.0 [{new Date().toLocaleTimeString()}]
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-5 rounded-lg glow-border relative">
          <div className="absolute -top-3 left-4 bg-card px-2 text-accent text-xs font-mono">
            SYSTEM ACCESS
          </div>

          {/* Step Indicators */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 text-center">
                  <div className={`
                    w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center text-xs font-mono transition-all
                    ${currentStep >= step 
                      ? 'border-accent text-accent glow-text' 
                      : 'border-border text-foreground-secondary'
                    }
                    ${currentStep > step ? 'bg-accent/10' : ''}
                  `}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div className="text-[10px] font-mono mt-1 text-foreground-secondary">
                    {step === 1 && 'IDENTITY'}
                    {step === 2 && '2FA'}
                    {step === 3 && 'ACCESS'}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 w-full h-px bg-border"></div>
              <div 
                className="absolute top-0 left-0 h-px bg-accent transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-danger bg-danger/10 p-2 rounded">
                <span className="text-danger text-xs font-mono">[ERROR] {error}</span>
              </div>
            )}

            {/* Step 1: Identity Verification */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground-secondary text-xs font-mono mb-1">
                    &gt; USERNAME_EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full terminal-input p-2 rounded text-xs font-mono"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-foreground-secondary text-xs font-mono mb-1">
                    &gt; PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full terminal-input p-2 rounded text-xs font-mono"
                    placeholder="********"
                    required
                  />
                </div>

                <div className="text-foreground-secondary text-[10px] font-mono">
                  [SECURE ENCRYPTED CONNECTION]
                </div>
              </div>
            )}

            {/* Step 2: 2FA Verification */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground-secondary text-xs font-mono mb-1">
                    &gt; TWO_FACTOR_AUTHENTICATION
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={email}
                      className="flex-1 terminal-input p-2 rounded text-xs font-mono bg-accent/5"
                      placeholder={email}
                      disabled
                    />
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || resendCooldown > 0}
                      className="px-3 border border-accent text-accent text-xs font-mono rounded hover:bg-accent/10 transition-all disabled:opacity-50"
                    >
                      {otpLoading ? '...' : resendCooldown > 0 ? `${resendCooldown}s` : 'SEND CODE'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="p-3 border border-accent/30 rounded bg-accent/5">
                    <div className="text-foreground-secondary text-[10px] font-mono mb-2">
                      &gt; ENTER_6_DIGIT_2FA_CODE
                    </div>
                    <div className="flex gap-1 justify-center mb-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-9 h-9 text-center text-sm font-mono terminal-input rounded"
                          maxLength={1}
                          autoComplete="off"
                        />
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otp.join('').length !== 6}
                      className="w-full py-1.5 border border-accent text-accent text-xs font-mono rounded hover:bg-accent/10 transition-all disabled:opacity-50 mb-2"
                    >
                      {otpLoading ? '[VERIFYING...]' : '[VERIFY 2FA] >_'}
                    </button>
                    
                    {otpError && (
                      <div className="text-danger text-[10px] font-mono text-center">[ERROR] {otpError}</div>
                    )}
                    
                    {otpSuccess && (
                      <div className="text-success text-[10px] font-mono text-center">[OK] {otpSuccess}</div>
                    )}
                    
                    <div className="text-center mt-2">
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={resendCooldown > 0}
                        className="text-accent/70 hover:text-accent text-[10px] font-mono disabled:opacity-50"
                      >
                        {resendCooldown > 0 ? `RESEND IN ${resendCooldown}s` : '⟳ RESEND CODE'}
                      </button>
                    </div>

                    <div className="text-center text-foreground-secondary/50 text-[9px] font-mono mt-2">
                      [DEMO 2FA: 123456]
                    </div>
                  </div>
                )}

                {!otpSent && (
                  <div className="text-center text-foreground-secondary text-[10px] font-mono p-3 border border-dashed border-border rounded">
                    Click "SEND CODE" to receive 2FA verification
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Access Granted */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border border-success bg-success/10 p-3 rounded text-center">
                  <div className="text-success text-sm font-mono mb-1">✓ ACCESS GRANTED</div>
                  <div className="text-foreground-secondary text-xs font-mono">
                    Welcome back, {email.split('@')[0]}
                  </div>
                  <div className="text-foreground-secondary text-[10px] font-mono mt-2">
                    [SECURE SESSION ESTABLISHED]
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-transparent border border-accent text-accent font-mono py-2 px-3 rounded text-sm hover:bg-accent/10 transition-all disabled:opacity-50"
                >
                  {loading ? '[AUTHENTICATING...]' : '[ACCESS DASHBOARD] >_'}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep !== 3 && (
              <div className="flex gap-3 pt-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="flex-1 border border-foreground-secondary text-foreground-secondary font-mono py-2 px-3 rounded text-xs hover:bg-foreground-secondary/10 transition-all"
                  >
                    &lt; BACK
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === 2 && !otpSent}
                  className="flex-1 border border-accent text-accent font-mono py-2 px-3 rounded text-xs hover:bg-accent/10 transition-all disabled:opacity-50"
                >
                  {currentStep === 2 ? 'VERIFY 2FA' : 'CONTINUE >'}
                </button>
              </div>
            )}
          </form>

          {/* Signup Link */}
          {currentStep !== 3 && (
            <div className="mt-4 text-center">
              <span className="text-foreground-secondary text-xs font-mono">
                [NO ACCESS?{' '}
                <Link href="/signup" className="text-accent hover:underline">
                  REQUEST ACCESS
                </Link>
                ]
              </span>
            </div>
          )}

          <div className="mt-4 text-center text-[10px] text-foreground-secondary font-mono">
            =================================
          </div>
        </div>
      </div>
    </div>
  );
}