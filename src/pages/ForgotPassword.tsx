import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send the OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // We use signInWithOtp because it reliably sends a code for this flow
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert(error.message);
    } else {
      setStep('otp'); // Move to next step
      alert("OTP code sent to your email!");
    }
    setLoading(false);
  };

  // Step 2: Verify the OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      alert("Invalid Code: " + error.message);
    } else {
      // Success! User is now logged in via the OTP.
      // Send them to the "Set New Password" page.
      navigate('/update-password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="text-brand-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 mt-2">
            {step === 'email' ? 'Enter your email to receive a code' : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
                  placeholder="you@gmail.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-brand-500 hover:bg-brand-600 shadow-lg font-medium"
            >
              {loading ? 'Sending Code...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-Digit Code</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-brand-500 hover:bg-brand-600 shadow-lg font-medium"
            >
              {loading ? 'Verifying...' : 'Verify & Reset'}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;